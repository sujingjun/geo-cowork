import { readFile } from 'node:fs/promises';

import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  readSnapshot,
  requireObject,
} from './diagnosis-io.mjs';
import { SITE_CODES } from './site-audit.mjs';
import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

class PublicSiteM4InputError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PublicSiteM4InputError';
    this.code = code;
    Object.assign(this, details);
  }
}

function fail(code, message, details) {
  throw new PublicSiteM4InputError(code, message, details);
}

function requireArray(value, label) {
  if (!Array.isArray(value)) fail('M4_INPUT_MAP_INVALID', `${label} 必须是数组`);
  return value;
}

function assertStableId(value, prefix, label) {
  if (typeof value !== 'string' || !value.startsWith(prefix) || !/^[A-Z][A-Z0-9-]+$/.test(value)) {
    fail('M4_INPUT_MAP_INVALID', `${label} 不是合法 stable ID`);
  }
  return value;
}

async function readJson(workspace, relativePath, label) {
  const safe = assertSafeRelativePath(relativePath);
  try {
    await assertNoSymlinkPath(workspace, safe);
    return JSON.parse(await readFile(resolveWithin(workspace, safe), 'utf8'));
  } catch (error) {
    if (error.code) throw error;
    fail('M4_INPUT_MAP_INVALID', `${label} 不是合法 JSON`, { path: safe });
  }
}

function validateVersionRef(graph, item, type) {
  if (!item?.ref || !item.version) fail('M4_INPUT_MAP_INVALID', `${type} version ref 缺失`);
  const object = requireObject(graph, item.ref, type);
  if (object.data.version !== item.version) {
    fail('RETEST_INPUT_DRIFT', 'mapping 精确版本与当前对象不一致', {
      ref: item.ref,
      expected: item.version,
      actual: object.data.version,
    });
  }
  return object;
}

function validateMapping(graph, mapping) {
  if (mapping?.schema_version !== 'm4-public-site-input-map-v1'
      || !mapping.output_root || typeof mapping.development_fixture !== 'boolean'
      || !mapping.shared || !mapping.site_defaults
      || !Array.isArray(mapping.site_targets) || mapping.site_targets.length === 0
      || !mapping.research || !Array.isArray(mapping.research.observations)) {
    fail('M4_INPUT_MAP_INVALID', 'mapping 缺少必填字段');
  }
  assertSafeRelativePath(mapping.output_root);
  for (const [field, type] of [
    ['goal_versions', 'perception_goal'],
    ['query_set_versions', 'query_set'],
    ['knowledge_release_versions', 'knowledge_release'],
    ['claim_versions', 'claim'],
  ]) {
    const values = requireArray(mapping.shared[field], `shared.${field}`);
    if (values.length === 0) fail('M4_INPUT_MAP_INVALID', `shared.${field} 不能为空`);
    values.forEach((item) => validateVersionRef(graph, item, type));
  }
  const targetIds = new Set();
  const runIds = new Set();
  for (const item of mapping.site_targets) {
    if (!item?.target_id || targetIds.has(item.target_id)) {
      fail('M4_INPUT_MAP_INVALID', 'site target_id 缺失或重复');
    }
    targetIds.add(item.target_id);
    assertStableId(item.run_id, 'RUN-', 'site run_id');
    if (runIds.has(item.run_id)) fail('M4_INPUT_MAP_INVALID', 'site run_id 重复');
    runIds.add(item.run_id);
    requireObject(graph, item.asset_ref, 'asset');
    requireObject(graph, item.source_ref, 'source');
    if (typeof item.output_id_prefix !== 'string' || !/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(item.output_id_prefix)) {
      fail('M4_INPUT_MAP_INVALID', 'output_id_prefix 非法');
    }
  }
  assertStableId(mapping.research.run_id, 'RUN-', 'research run_id');
  for (const ref of requireArray(mapping.research.asset_refs, 'research.asset_refs')) {
    requireObject(graph, ref, 'asset');
  }
  const evidenceIds = new Set();
  const evidencePaths = new Set();
  for (const item of mapping.research.observations) {
    if (!item?.target_id || !item.source_ref || !item.evidence_id || !item.evidence_path
        || !Array.isArray(item.claim_refs) || !item.confidence_reason
        || !['high', 'medium', 'low', 'unknown'].includes(item.confidence)) {
      fail('M4_INPUT_MAP_INVALID', 'research observation 缺少必填字段');
    }
    requireObject(graph, item.source_ref, 'source');
    item.claim_refs.forEach((ref) => requireObject(graph, ref, 'claim'));
    assertStableId(item.evidence_id, 'EVD-', 'research evidence_id');
    assertSafeRelativePath(item.evidence_path);
    if (evidenceIds.has(item.evidence_id) || evidencePaths.has(item.evidence_path)) {
      fail('M4_INPUT_MAP_INVALID', 'research Evidence ID/path 重复');
    }
    evidenceIds.add(item.evidence_id);
    evidencePaths.add(item.evidence_path);
  }
}

function actualMediaType(item) {
  return (item.response?.headers?.['content-type'] ?? 'application/octet-stream')
    .split(';', 1)[0]
    .trim()
    .toLowerCase();
}

async function collectedItem(workspace, byTarget, targetId) {
  const item = byTarget.get(targetId);
  if (!item || item.state !== 'captured' || !item.snapshot_path || !item.sha256) {
    fail('M4_COLLECTION_INCOMPLETE', 'collection target 缺失或未 captured', { target_id: targetId });
  }
  await readSnapshot({
    workspace,
    snapshot: {
      path: item.snapshot_path,
      sha256: item.sha256,
      media_type: actualMediaType(item),
    },
  });
  return item;
}

function snapshotOf(item) {
  return {
    path: item.snapshot_path,
    sha256: item.sha256,
    media_type: actualMediaType(item),
  };
}

function sharedInputVersions(mapping) {
  return [
    ...mapping.shared.goal_versions,
    ...mapping.shared.query_set_versions,
    ...mapping.shared.knowledge_release_versions,
    ...mapping.shared.claim_versions,
  ];
}

function versionsObject(graph, refs) {
  return Object.fromEntries(
    [...new Set(refs)]
      .sort()
      .map((ref) => {
        const object = graph.byId.get(ref);
        if (!object) fail('BROKEN_REF', 'input ref 不存在', { ref });
        return [ref, object.data.version];
      }),
  );
}

function siteOutputs(prefix) {
  return Object.fromEntries(SITE_CODES.map((code) => {
    const token = code.replaceAll('_', '-');
    const evidenceId = `EVD-${prefix}-${token}`;
    const findingId = `FND-${prefix}-${token}`;
    return [code, {
      evidence: {
        id: evidenceId,
        path: `evidence/records/${evidenceId.toLowerCase()}.md`,
      },
      finding: {
        id: findingId,
        path: `findings/${findingId.toLowerCase()}.md`,
      },
    }];
  }));
}

function allowedHttpHeaders(item) {
  const headers = item.response?.headers ?? {};
  return Object.fromEntries(
    ['content-type', 'location', 'x-robots-tag']
      .filter((key) => headers[key] !== undefined)
      .map((key) => [key, headers[key]]),
  );
}

async function siteFiles({ workspace, graph, mapping, byTarget, target }) {
  const page = await collectedItem(workspace, byTarget, target.target_id);
  const robots = await collectedItem(
    workspace,
    byTarget,
    mapping.site_defaults.robots_target_id,
  );
  const sitemap = await collectedItem(
    workspace,
    byTarget,
    mapping.site_defaults.sitemap_target_id,
  );
  const asset = requireObject(graph, target.asset_ref, 'asset');
  const source = requireObject(graph, target.source_ref, 'source');
  if (asset.data.locator !== page.requested_url || source.data.locator !== page.requested_url) {
    fail('M4_INPUT_MAP_INVALID', 'Site Asset/Source locator 与 collection target 不一致', {
      target_id: target.target_id,
    });
  }
  const manifest = {
    schema_version: 'm4-site-manifest-v1',
    target: { asset_ref: target.asset_ref, locator: asset.data.locator },
    captured_at: page.captured_at,
    collector: {
      ...page.collector,
      mode: mapping.development_fixture ? 'development_fixture' : page.collector.mode,
    },
    collection_state: 'captured',
    snapshots: [
      { role: 'html', ...snapshotOf(page) },
      { role: 'robots', ...snapshotOf(robots) },
      { role: 'sitemap', ...snapshotOf(sitemap) },
    ],
    http: {
      status: page.response.status,
      headers: allowedHttpHeaders(page),
    },
    expectations: {
      expected_http_statuses: page.expectation?.expected_statuses ?? [200],
      target_path: new URL(asset.data.locator).pathname,
    },
  };
  const extraRefs = [target.asset_ref, target.source_ref];
  const plan = {
    source_ref: target.source_ref,
    run: { id: target.run_id, path: `runs/${target.run_id}/run.md` },
    input_versions: versionsObject(graph, [
      ...sharedInputVersions(mapping).map(({ ref }) => ref),
      ...extraRefs,
    ]),
    goal_refs: mapping.shared.goal_versions.map(({ ref }) => ref),
    query_set_versions: mapping.shared.query_set_versions,
    knowledge_release_versions: mapping.shared.knowledge_release_versions,
    asset_refs: [target.asset_ref],
    development_fixture: mapping.development_fixture,
    outputs: siteOutputs(target.output_id_prefix),
  };
  return [
    {
      path: `${mapping.output_root}/${target.target_id}.site-manifest.json`,
      value: manifest,
    },
    {
      path: `${mapping.output_root}/${target.target_id}.site-plan.json`,
      value: plan,
    },
  ];
}

async function researchFiles({ workspace, graph, mapping, summary, byTarget }) {
  const observations = [];
  const planObservations = [];
  const sourceRefs = [];
  const claimRefs = [];
  for (const target of mapping.research.observations) {
    const item = await collectedItem(workspace, byTarget, target.target_id);
    const source = requireObject(graph, target.source_ref, 'source');
    if (source.data.locator !== item.requested_url) {
      fail('M4_INPUT_MAP_INVALID', 'Research Source locator 与 collection target 不一致', {
        target_id: target.target_id,
      });
    }
    observations.push({
      source_ref: target.source_ref,
      access_state: 'accessible',
      original_content_state: 'captured',
      snapshot: snapshotOf(item),
      support_kind: 'first_party',
      independent_support_refs: [],
      counter_evidence_refs: [],
      confidence: target.confidence,
      confidence_reason: target.confidence_reason,
    });
    planObservations.push({
      source_ref: target.source_ref,
      id: target.evidence_id,
      path: target.evidence_path,
      claim_refs: target.claim_refs,
    });
    sourceRefs.push(target.source_ref);
    claimRefs.push(...target.claim_refs);
  }
  const manifest = {
    schema_version: 'm4-research-manifest-v1',
    captured_at: summary.completed_at,
    collector: {
      ...summary.collector,
      mode: mapping.development_fixture ? 'development_fixture' : summary.collector.mode,
    },
    observations,
  };
  const plan = {
    skill: mapping.research.skill ?? 'geo-reputation',
    run: {
      id: mapping.research.run_id,
      path: `runs/${mapping.research.run_id}/run.md`,
    },
    input_versions: versionsObject(graph, [
      ...sharedInputVersions(mapping).map(({ ref }) => ref),
      ...mapping.research.asset_refs,
      ...sourceRefs,
      ...claimRefs,
    ]),
    goal_refs: mapping.shared.goal_versions.map(({ ref }) => ref),
    query_set_versions: mapping.shared.query_set_versions,
    knowledge_release_versions: mapping.shared.knowledge_release_versions,
    asset_refs: mapping.research.asset_refs,
    development_fixture: mapping.development_fixture,
    observations: planObservations,
    findings: [],
  };
  return [{
    path: `${mapping.output_root}/research-manifest.json`,
    value: manifest,
  }, {
    path: `${mapping.output_root}/research-plan.json`,
    value: plan,
  }];
}

async function writeJsonOutputs(workspace, outputs) {
  const prepared = outputs.map(({ path, value }) => ({
    path: assertSafeRelativePath(path),
    content: stableStringify(value, 2),
  }));
  for (const output of prepared) {
    try {
      await assertNoSymlinkPath(workspace, output.path);
      const current = await readFile(resolveWithin(workspace, output.path), 'utf8');
      if (current !== output.content) {
        fail('M4_INPUT_CONFLICT', '现有 M4 input 与当前 collection/mapping 不一致', {
          path: output.path,
        });
      }
    } catch (error) {
      if (!['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) throw error;
    }
  }
  const created = [];
  const kept = [];
  for (const output of prepared) {
    const result = await writeCreateOnly(workspace, output.path, output.content, {
      idempotent: true,
      conflictCode: 'M4_INPUT_CONFLICT',
    });
    (result.action === 'created' ? created : kept).push(result.path);
  }
  return { created, kept };
}

export async function buildPublicSiteM4Inputs({ workspace, collectionSummaryPath, mapping }) {
  const [summary, graph] = await Promise.all([
    readJson(workspace, collectionSummaryPath, 'collection summary'),
    loadWorkspaceGraph({ workspace }),
  ]);
  if (summary?.schema_version !== '1.0.0' || summary.state !== 'completed'
      || !Array.isArray(summary.items) || !summary.collector) {
    fail('M4_COLLECTION_INCOMPLETE', 'collection summary 未完成或缺少 items');
  }
  validateMapping(graph, mapping);
  const byTarget = new Map(summary.items.map((item) => [item.target_id, item]));
  if (byTarget.size !== summary.items.length) {
    fail('M4_COLLECTION_INCOMPLETE', 'collection summary target_id 重复');
  }
  const outputs = [];
  for (const target of mapping.site_targets) {
    outputs.push(...await siteFiles({ workspace, graph, mapping, byTarget, target }));
  }
  outputs.push(...await researchFiles({ workspace, graph, mapping, summary, byTarget }));
  const written = await writeJsonOutputs(workspace, outputs);
  return { ...written, output_paths: outputs.map(({ path }) => path).sort() };
}

