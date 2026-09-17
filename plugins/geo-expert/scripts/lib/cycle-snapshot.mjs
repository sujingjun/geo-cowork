import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { serializeMarkdownObject } from './object-contract.mjs';
import {
  assertNoTestKnowledgeContamination,
  preflightLifecycleWrite,
  readWorkspaceIdentity,
  validateLifecycleWorkspace,
} from './workspace-scope.mjs';
import {
  assertNoSymlinkPath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class CycleSnapshotError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CycleSnapshotError';
    this.code = code;
    Object.assign(this, details);
  }
}

function byteCompare(a, b) {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function equalJson(a, b) {
  return stableStringify(a) === stableStringify(b);
}

function snapshotFingerprintPayload(plan) {
  return {
    source_entries: plan.source_entries,
    artifact_entries: plan.artifact_entries,
    base_freeze_snapshot_version: plan.base_freeze_snapshot_version ?? null,
    pre_review_transition_snapshot_versions: plan.pre_review_transition_snapshot_versions ?? [],
    pre_review_entry_keys: plan.pre_review_entry_keys ?? [],
  };
}

function expectedManifest(plan) {
  return {
    schema_version: 'cycle-input-snapshot/1.0.0',
    snapshot_id: plan.snapshot.id,
    snapshot_kind: plan.snapshot.kind,
    fingerprint: plan.manifest.fingerprint,
    ...snapshotFingerprintPayload(plan),
  };
}

export async function buildCycleSnapshotPlan({
  workspace,
  id,
  snapshotKind,
  snapshotPath,
  merchantRef,
  knowledgeBaseRef,
  cycleRef,
  runRef,
  sourcePaths,
  artifactPaths,
  sourceBytesByPath = null,
  artifactBytesByPath = null,
  baseFreezeSnapshotVersion,
  preReviewTransitionSnapshotVersions = [],
  preReviewEntryKeys = [],
}) {
  const root = path.resolve(workspace);
  const identity = await readWorkspaceIdentity(root);
  const effectiveKnowledgeBaseRef = knowledgeBaseRef ?? identity.knowledge_base_ref;
  const base = `outputs/snapshots/${id.toLowerCase()}`;
  const sourceEntries = [];
  for (const objectPath of sourcePaths) {
    const bytes = sourceBytesByPath?.get(objectPath) ?? await readSafe(root, objectPath);
    const parsed = matter(bytes.toString('utf8'));
    const entry = {
      object_id: parsed.data.id,
      record_type: parsed.data.record_type,
      object_version: String(parsed.data.version),
      object_path: objectPath,
      content_sha256: sha256(parsed.content),
      file_sha256: sha256(bytes),
      snapshot_path: `${base}/objects/${objectPath}`,
      snapshot_sha256: sha256(bytes),
    };
    entry.entry_key = sha256(stableStringify(entry));
    sourceEntries.push(entry);
  }
  const artifactEntries = [];
  for (const artifact of artifactPaths) {
    const bytes = artifactBytesByPath?.get(artifact.path) ?? await readSafe(root, artifact.path);
    const entry = {
      role: artifact.role,
      source_path: artifact.path,
      snapshot_path: `${base}/artifacts/${artifactPaths.filter(item => path.posix.basename(item.path) === path.posix.basename(artifact.path)).length > 1 && artifactPaths.some(item => path.posix.basename(item.path) === path.posix.basename(artifact.path) && item.role === 'supporting_artifact') ? sha256(artifact.path).slice(0, 12) + "-" : ""}${path.posix.basename(artifact.path)}`,
      media_type: artifact.media_type ?? 'application/octet-stream',
      source_sha256: sha256(bytes),
      snapshot_sha256: sha256(bytes),
    };
    entry.entry_key = sha256(stableStringify(entry));
    artifactEntries.push(entry);
  }
  sourceEntries.sort((a, b) => byteCompare(a.entry_key, b.entry_key));
  artifactEntries.sort((a, b) => byteCompare(a.entry_key, b.entry_key));
  const plan = {
    schema_version: 'm6-cycle-input-snapshot-plan/1.0.0',
    snapshot: {
      id,
      path: snapshotPath ?? `cycles/m6/snapshots/${id.toLowerCase()}.md`,
      version: '1.0.0',
      kind: snapshotKind,
    },
    merchant_ref: merchantRef,
    knowledge_base_ref: effectiveKnowledgeBaseRef,
    cycle_ref: cycleRef,
    run_ref: runRef,
    source_entries: sourceEntries,
    artifact_entries: artifactEntries,
    ...(baseFreezeSnapshotVersion
      ? { base_freeze_snapshot_version: baseFreezeSnapshotVersion }
      : {}),
    pre_review_transition_snapshot_versions: preReviewTransitionSnapshotVersions,
    pre_review_entry_keys: [...preReviewEntryKeys].sort(byteCompare),
  };
  const fingerprint = sha256(stableStringify(snapshotFingerprintPayload(plan)));
  const manifestPayload = {
    schema_version: 'cycle-input-snapshot/1.0.0',
    snapshot_id: id,
    snapshot_kind: snapshotKind,
    fingerprint,
    ...snapshotFingerprintPayload(plan),
  };
  const bytes = stableStringify(manifestPayload, 2);
  plan.manifest = {
    schema_version: 'cycle-input-snapshot/1.0.0',
    artifact_path: `${base}/manifest.json`,
    fingerprint,
    sha256: sha256(bytes),
    bytes,
  };
  return plan;
}

function validateSortedUnique(entries, field) {
  const keys = entries.map((entry) => entry.entry_key);
  if (new Set(keys).size !== keys.length
      || !equalJson(keys, [...keys].sort(byteCompare))) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_INVALID', 'CIS entries 必须按 entry_key bytes 排序且唯一', {
      field,
    });
  }
}

function validatePlanShape(plan) {
  if (plan?.schema_version !== 'm6-cycle-input-snapshot-plan/1.0.0'
      || !plan.snapshot?.id
      || !['freeze', 'transition', 'review', 'strategy'].includes(plan.snapshot.kind)
      || !plan.merchant_ref
      || !plan.knowledge_base_ref
      || !plan.cycle_ref
      || !plan.run_ref
      || !Array.isArray(plan.source_entries)
      || plan.source_entries.length === 0
      || !Array.isArray(plan.artifact_entries)
      || plan.artifact_entries.length === 0) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_INVALID', 'CIS materialization plan 不完整');
  }
  validateSortedUnique(plan.source_entries, 'source_entries');
  validateSortedUnique(plan.artifact_entries, 'artifact_entries');
  const targets = [
    ...plan.source_entries.map((entry) => `runs/${plan.run_ref}/${entry.snapshot_path}`),
    ...plan.artifact_entries.map((entry) => `runs/${plan.run_ref}/${entry.snapshot_path}`),
    `runs/${plan.run_ref}/${plan.manifest?.artifact_path}`,
    plan.snapshot.path,
  ];
  if (new Set(targets).size !== targets.length) {
    throw new CycleSnapshotError(
      'CYCLE_INPUT_SNAPSHOT_CONFLICT',
      'CIS materialization target path 必须全量唯一',
    );
  }
  if (plan.snapshot.kind === 'review'
      && (!plan.base_freeze_snapshot_version
        || !Array.isArray(plan.pre_review_transition_snapshot_versions)
        || !Array.isArray(plan.pre_review_entry_keys))) {
    throw new CycleSnapshotError('REVIEW_PRE_CUTOFF_INCOMPLETE', 'Review CIS 缺少 pre-review cutoff');
  }
  if (new Set(plan.pre_review_entry_keys ?? []).size !== (plan.pre_review_entry_keys ?? []).length
      || !equalJson(
        plan.pre_review_entry_keys ?? [],
        [...(plan.pre_review_entry_keys ?? [])].sort(byteCompare),
      )) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_INVALID', 'pre_review_entry_keys 必须按 bytes 排序且唯一');
  }
  const fingerprint = sha256(stableStringify(snapshotFingerprintPayload(plan)));
  if (fingerprint !== plan.manifest?.fingerprint) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS fingerprint 不一致');
  }
  const manifestBytes = stableStringify(expectedManifest(plan), 2);
  if (manifestBytes !== plan.manifest.bytes
      || sha256(manifestBytes) !== plan.manifest.sha256) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS manifest bytes/checksum 不一致');
  }
}

async function readSafe(workspace, relative) {
  await assertNoSymlinkPath(workspace, relative);
  return readFile(resolveWithin(workspace, relative));
}

async function validateSourceEntry(workspace, entry, providedBytes = null) {
  const bytes = providedBytes ?? await readSafe(workspace, entry.object_path);
  const parsed = matter(bytes.toString('utf8'));
  if (parsed.data.id !== entry.object_id
      || parsed.data.record_type !== entry.record_type
      || String(parsed.data.version) !== entry.object_version
      || sha256(parsed.content) !== entry.content_sha256
      || sha256(bytes) !== entry.file_sha256
      || entry.snapshot_sha256 !== entry.file_sha256) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS source entry 与 live bytes 不一致', {
      object_id: entry.object_id,
      path: entry.object_path,
    });
  }
  const expectedEntry = {
    object_id: entry.object_id,
    record_type: entry.record_type,
    object_version: entry.object_version,
    object_path: entry.object_path,
    content_sha256: entry.content_sha256,
    file_sha256: entry.file_sha256,
    snapshot_path: entry.snapshot_path,
    snapshot_sha256: entry.snapshot_sha256,
  };
  if (sha256(stableStringify(expectedEntry)) !== entry.entry_key) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS source entry_key 不一致', {
      object_id: entry.object_id,
    });
  }
  return bytes;
}

export function assertSnapshotArtifactScope(bytes, role) {
  let scanned = bytes.toString('utf8');
  if (role === 'supporting_artifact') {
    // Technical vocabulary is not a real brand locator. Physical transport is
    // accepted only in an explicit test-only read-back proof; bytes stay intact.
    scanned = scanned.replace(/https?:\/\/(?:schema\.org|json-schema\.org)(?=[/"'\s<]|$)/g, 'fixture://schema-vocabulary');
    try {
      const proof = JSON.parse(scanned);
      if (proof.synthetic === true && typeof proof.logical_locator === 'string'
          && new URL(proof.logical_locator).hostname.endsWith('.invalid')
          && typeof proof.transport === 'string') {
        const transport = new URL(proof.transport);
        if (transport.protocol !== 'http:' || !['127.0.0.1','localhost','[::1]'].includes(transport.hostname)
            || transport.username || transport.password || transport.search || transport.hash || transport.pathname !== '/asset') throw new Error('Invalid fixture transport');
        proof.transport = 'fixture://loopback-readback';
        scanned = JSON.stringify(proof);
      }
    } catch { /* The normal contamination check rejects any unrecognized URL. */ }
  }
  assertNoTestKnowledgeContamination(scanned);
}

async function validateArtifactEntry(workspace, entry, providedBytes = null, { testOnly = true } = {}) {
  const bytes = providedBytes ?? await readSafe(workspace, entry.source_path);
  if (testOnly) assertSnapshotArtifactScope(bytes, entry.role);
  if (sha256(bytes) !== entry.source_sha256
      || entry.snapshot_sha256 !== entry.source_sha256) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS artifact entry 与源 bytes 不一致', {
      path: entry.source_path,
    });
  }
  const expectedEntry = {
    role: entry.role,
    source_path: entry.source_path,
    snapshot_path: entry.snapshot_path,
    media_type: entry.media_type,
    source_sha256: entry.source_sha256,
    snapshot_sha256: entry.snapshot_sha256,
  };
  if (sha256(stableStringify(expectedEntry)) !== entry.entry_key) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS artifact entry_key 不一致', {
      path: entry.source_path,
    });
  }
  return bytes;
}

function cisData(plan, createdAt, identity) {
  const testOnly = identity.workspace_mode === 'development_test';
  return {
    id: plan.snapshot.id,
    record_type: 'cycle_input_snapshot',
    status: 'recorded',
    version: plan.snapshot.version,
    created_at: createdAt,
    updated_at: createdAt,
    title: `${plan.snapshot.kind} cycle input snapshot`,
    ...(testOnly ? { test_scope: {
      kind: 'synthetic', usage: 'test_only', merchant_ref: plan.merchant_ref,
      workspace_id: identity.workspace_id, knowledge_base_ref: plan.knowledge_base_ref,
    } } : {}),
    execution_scope: testOnly ? 'synthetic_test' : 'authorized_real',
    merchant_ref: plan.merchant_ref,
    knowledge_base_ref: plan.knowledge_base_ref,
    cycle_ref: plan.cycle_ref,
    snapshot_kind: plan.snapshot.kind,
    manifest: {
      schema_version: plan.manifest.schema_version,
      artifact_path: plan.manifest.artifact_path,
      sha256: plan.manifest.sha256,
      fingerprint: plan.manifest.fingerprint,
    },
    source_entries: plan.source_entries,
    artifact_entries: plan.artifact_entries,
    ...(plan.base_freeze_snapshot_version
      ? { base_freeze_snapshot_version: plan.base_freeze_snapshot_version }
      : {}),
    pre_review_transition_snapshot_versions: plan.pre_review_transition_snapshot_versions ?? [],
    pre_review_entry_keys: plan.pre_review_entry_keys ?? [],
    run_ref: plan.run_ref,
  };
}

async function existingState(workspace, target, expected) {
  try {
    await assertNoSymlinkPath(workspace, target);
    const bytes = await readFile(resolveWithin(workspace, target));
    if (!bytes.equals(expected)) {
      throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CONFLICT', 'CIS create-only 目标 bytes 冲突', {
        path: target,
      });
    }
    return true;
  } catch (error) {
    if (error.code === 'PATH_NOT_FOUND' || error.code === 'ENOENT') return false;
    throw error;
  }
}

async function snapshotTargets(workspace, plan, {
  sourceBytesByPath = null,
  artifactBytesByPath = null,
} = {}) {
  const identity = await readWorkspaceIdentity(path.resolve(workspace));
  const workspaceValidation = await validateLifecycleWorkspace({
    workspace,
    knowledgeBaseRef: plan.knowledge_base_ref,
  });
  if (workspaceValidation.errors.length > 0) {
    throw new CycleSnapshotError(workspaceValidation.errors[0].code, 'CIS 写入前 Workspace 校验失败', {
      diagnostics: workspaceValidation.errors,
    });
  }
  const merchantEntry = plan.source_entries.find((entry) => entry.object_id === plan.merchant_ref);
  const knowledgeBaseEntry = plan.source_entries.find(
    (entry) => entry.object_id === plan.knowledge_base_ref,
  );
  if (plan.snapshot.kind === 'freeze' && !merchantEntry) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_INVALID', 'Freeze 输入缺 Merchant');
  }
  if (plan.snapshot.kind === 'freeze' && !knowledgeBaseEntry) {
    throw new CycleSnapshotError('KNOWLEDGE_BASE_REQUIRED', 'Freeze 输入缺 Brand Knowledge Base');
  }
  const merchant = merchantEntry
    ? matter((await validateSourceEntry(
      workspace,
      merchantEntry,
      sourceBytesByPath?.get(merchantEntry.object_path) ?? null,
    )).toString('utf8')).data
    : workspaceValidation.merchant;
  if (!merchant || merchant.id !== plan.merchant_ref) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_INVALID', 'CIS merchant_ref 与 Workspace 不一致');
  }
  if (plan.knowledge_base_ref !== workspaceValidation.identity.knowledge_base_ref) {
    throw new CycleSnapshotError('KNOWLEDGE_BASE_SCOPE_MISMATCH', 'CIS knowledge_base_ref 与 Workspace 不一致');
  }
  const targets = [];
  for (const entry of plan.source_entries) {
    const bytes = await validateSourceEntry(
      workspace,
      entry,
      sourceBytesByPath?.get(entry.object_path) ?? null,
    );
    targets.push({
      target: `runs/${plan.run_ref}/${entry.snapshot_path}`,
      reportPath: entry.snapshot_path,
      bytes,
    });
  }
  for (const entry of plan.artifact_entries) {
    const bytes = await validateArtifactEntry(
      workspace,
      entry,
      artifactBytesByPath?.get(entry.source_path) ?? null,
      { testOnly: identity.workspace_mode === 'development_test' },
    );
    targets.push({
      target: `runs/${plan.run_ref}/${entry.snapshot_path}`,
      reportPath: entry.snapshot_path,
      bytes,
    });
  }
  targets.push({
    target: `runs/${plan.run_ref}/${plan.manifest.artifact_path}`,
    reportPath: plan.manifest.artifact_path,
    bytes: Buffer.from(plan.manifest.bytes),
  });
  const data = cisData(plan, merchant.updated_at, identity);
  const body = `# Cycle Input Snapshot ${plan.snapshot.id}\n`;
  await preflightLifecycleWrite({
    workspace,
    data,
    body,
    manifest: expectedManifest(plan),
    refClosure: false,
  });
  const canonical = serializeMarkdownObject(data, body);
  targets.push({
    target: plan.snapshot.path,
    reportPath: plan.snapshot.path,
    bytes: Buffer.from(canonical),
  });
  return targets;
}

export async function previewCycleSnapshotTargets({
  workspace,
  plan,
  sourceBytesByPath = null,
  artifactBytesByPath = null,
}) {
  validatePlanShape(plan);
  return snapshotTargets(path.resolve(workspace), plan, {
    sourceBytesByPath,
    artifactBytesByPath,
  });
}

export async function materializeCycleSnapshot({ workspace, plan }) {
  const root = path.resolve(workspace);
  validatePlanShape(plan);
  const targets = await snapshotTargets(root, plan);
  const existing = [];
  for (const target of targets) {
    if (await existingState(root, target.target, target.bytes)) existing.push(target.reportPath);
  }
  for (const target of targets) {
    await writeCreateOnly(root, target.target, target.bytes, {
      idempotent: true,
      conflictCode: 'CYCLE_INPUT_SNAPSHOT_CONFLICT',
    });
  }
  const action = existing.length === 0
    ? 'created'
    : existing.length === targets.length ? 'kept' : 'resumed';
  return {
    action,
    snapshot_id: plan.snapshot.id,
    snapshot_kind: plan.snapshot.kind,
    kept: existing,
    created: targets.map((target) => target.reportPath)
      .filter((target) => !existing.includes(target)),
  };
}

export async function materializeCycleFreeze({ workspace, plan }) {
  if (plan.snapshot?.kind !== 'freeze' || !plan.cycle?.path || !plan.cycle?.data) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_INVALID', 'Freeze plan 缺少预分配 Cycle');
  }
  const root = path.resolve(workspace);
  const cycleBody = plan.cycle.data.execution_scope === 'authorized_real'
    ? '# Authorized Real GEO Cycle\n' : '# M6 synthetic cycle\n';
  const cycleBytes = Buffer.from(serializeMarkdownObject(plan.cycle.data, cycleBody));
  await preflightLifecycleWrite({
    workspace: root,
    data: plan.cycle.data,
    body: cycleBody,
    manifest: plan,
    refClosure: false,
  });
  const cycleExisted = await existingState(root, plan.cycle.path, cycleBytes);
  const snapshot = await materializeCycleSnapshot({ workspace: root, plan });
  await writeCreateOnly(root, plan.cycle.path, cycleBytes, {
    idempotent: true,
    conflictCode: 'CYCLE_INPUT_SNAPSHOT_CONFLICT',
  });
  return {
    action: cycleExisted || snapshot.action !== 'created' ? 'resumed' : 'created',
    cycle_id: plan.cycle.data.id,
    snapshot_id: plan.snapshot.id,
  };
}

export async function compareLiveInputsWithFreeze({ workspace, plan }) {
  const errors = [];
  const testOnly = (await readWorkspaceIdentity(path.resolve(workspace))).workspace_mode === 'development_test';
  for (const entry of plan.source_entries) {
    try {
      await validateSourceEntry(path.resolve(workspace), entry);
    } catch (error) {
      if (entry.record_type === 'source') {
        try {
          const live = matter((await readSafe(path.resolve(workspace), entry.object_path)).toString('utf8'));
          const frozenBytes = await readSafe(path.resolve(workspace), `runs/${plan.run_ref}/${entry.snapshot_path}`);
          if (sha256(frozenBytes) !== entry.snapshot_sha256) throw error;
          const frozen = matter(frozenBytes.toString('utf8'));
          const stableSource = parsed => {
            const data = { ...parsed.data };
            delete data.classification_queue; delete data.updated_at; delete data.version;
            return stableStringify({ data, content: parsed.content });
          };
          if (stableSource(live) === stableSource(frozen)) continue;
        } catch { /* Any other source drift remains blocking. */ }
      }
      errors.push({
        code: 'CYCLE_VERSION_DRIFT',
        object_id: entry.object_id,
        path: entry.object_path,
        cause_code: error.code,
      });
    }
  }
  for (const entry of plan.artifact_entries) {
    try {
      await validateArtifactEntry(path.resolve(workspace), entry, null, { testOnly });
    } catch (error) {
      errors.push({
        code: 'CYCLE_VERSION_DRIFT',
        path: entry.source_path,
        cause_code: error.code,
      });
    }
  }
  return { ok: errors.length === 0, errors };
}

export async function loadSnapshotGraph({ workspace, plan }) {
  const root = path.resolve(workspace);
  const manifestBytes = await readSafe(
    root,
    `runs/${plan.run_ref}/${plan.manifest.artifact_path}`,
  );
  if (sha256(manifestBytes) !== plan.manifest.sha256
      || manifestBytes.toString('utf8') !== plan.manifest.bytes) {
    throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', '历史 manifest checksum 不一致');
  }
  const byId = new Map();
  for (const entry of plan.source_entries) {
    const relative = `runs/${plan.run_ref}/${entry.snapshot_path}`;
    const bytes = await readSafe(root, relative);
    if (sha256(bytes) !== entry.snapshot_sha256) {
      throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', '历史 snapshot copy checksum 不一致', {
        path: relative,
      });
    }
    const parsed = matter(bytes.toString('utf8'));
    if (parsed.data.id !== entry.object_id
        || parsed.data.record_type !== entry.record_type
        || String(parsed.data.version) !== entry.object_version) {
      throw new CycleSnapshotError('CYCLE_INPUT_SNAPSHOT_INVALID', '历史 snapshot copy identity 不一致', {
        path: relative,
      });
    }
    byId.set(parsed.data.id, {
      data: parsed.data,
      content: parsed.content,
      original: bytes.toString('utf8'),
      path: entry.object_path,
      snapshot_path: relative,
    });
  }
  return { byId, source: 'snapshot_copies' };
}
