import { loadWorkspaceGraph } from './index-builder.mjs';
import { inputFingerprint } from './run-store.mjs';
import {
  commonData,
  DiagnosisError,
  isFixtureLocator,
  prepareOutputs,
  readSnapshot,
  requireObject,
  sortedUnique,
  validateVersionRefs,
  writePreparedOutputs,
} from './diagnosis-io.mjs';
import { validateDiagnosisObject } from './diagnosis-profile.mjs';
import { stableStringify } from './workspace-paths.mjs';

export const SITE_DETECTOR_VERSION = 'm4-site-detectors-v1.0.2';
export const SITE_CODES = Object.freeze([
  'HTTP_STATUS',
  'CANONICAL',
  'ROBOTS',
  'SITEMAP',
  'SCHEMA_SYNTAX',
  'TITLE_PRESENT',
  'META_DESCRIPTION_PRESENT',
  'HEADING_PRESENT',
  'CRAWLABILITY',
]);
const METADATA_CODES = new Set(['HTTP_STATUS', 'ROBOTS', 'SITEMAP', 'CRAWLABILITY']);

const HEADER_ALLOWLIST = new Set(['content-type', 'location', 'x-robots-tag']);
const FORBIDDEN_KEYS = /^(?:authorization|cookie|set-cookie|token|secret|api[_-]?key)$/i;

function assertNoSecrets(value, pathLabel = 'manifest') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecrets(item, `${pathLabel}[${index}]`));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.test(key)) {
        throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'manifest 包含禁止的敏感字段', {
          field: `${pathLabel}.${key}`,
        });
      }
      assertNoSecrets(item, `${pathLabel}.${key}`);
    }
  }
}

function assertManifestShape(manifest) {
  assertNoSecrets(manifest);
  if (manifest?.schema_version !== 'm4-site-manifest-v1'
      || !manifest.target?.asset_ref || !manifest.target?.locator
      || !manifest.captured_at || !manifest.collector?.name || !manifest.collector?.version
      || !['captured', 'blocked', 'unverifiable'].includes(manifest.collection_state)
      || !Array.isArray(manifest.snapshots)) {
    throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'site manifest 缺少必填字段');
  }
  const roles = new Set();
  for (const snapshot of manifest.snapshots) {
    if (!snapshot.role || roles.has(snapshot.role)) {
      throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'snapshot role 缺失或重复');
    }
    roles.add(snapshot.role);
  }
  for (const header of Object.keys(manifest.http?.headers ?? {})) {
    if (!HEADER_ALLOWLIST.has(header.toLowerCase())) {
      throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'HTTP header 不在允许列表', { header });
    }
  }
  if (manifest.collection_state === 'captured'
      && !manifest.snapshots.some(({ role }) => ['response', 'html'].includes(role))) {
    throw new DiagnosisError('SNAPSHOT_REQUIRED', 'captured manifest 必须提供 response 或 html snapshot');
  }
  if (manifest.collection_state !== 'captured'
      && !manifest.snapshots.some(({ role }) => ['response', 'collector_log'].includes(role))) {
    throw new DiagnosisError('SNAPSHOT_REQUIRED', 'blocked/unverifiable manifest 必须提供响应页或 collector log');
  }
}

function result(code, state, message) {
  return { code, state, rule_version: SITE_DETECTOR_VERSION, message };
}

function textFor(snapshots, role) {
  return snapshots.get(role)?.bytes.toString('utf8') ?? null;
}

function extractCanonical(html) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/\brel\s*=\s*["'][^"']*\bcanonical\b[^"']*["']/i.test(tag)) continue;
    return tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
  }
  return null;
}

function metaContent(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const actualName = tag.match(/\bname\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (actualName === name) return tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] ?? '';
  }
  return null;
}

function robotsBlocksPath(robots, targetPath) {
  if (!robots) return null;
  const groups = [];
  let group = null;
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const userAgent = line.match(/^user-agent\s*:\s*(.+)$/i)?.[1]?.trim().toLowerCase();
    if (userAgent) {
      if (!group || group.rules.length > 0) {
        group = { agents: [], rules: [] };
        groups.push(group);
      }
      group.agents.push(userAgent);
      continue;
    }
    const rule = line.match(/^(allow|disallow)\s*:\s*(.*)$/i);
    if (group && rule) {
      group.rules.push({ directive: rule[1].toLowerCase(), pattern: rule[2].trim() });
    }
  }

  const candidates = groups
    .filter(({ agents }) => agents.includes('*'))
    .flatMap(({ rules }) => rules)
    .filter(({ pattern }) => pattern !== '')
    .filter(({ pattern }) => {
      const anchored = pattern.endsWith('$');
      const value = anchored ? pattern.slice(0, -1) : pattern;
      const expression = value
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replaceAll('*', '.*');
      return new RegExp(`^${expression}${anchored ? '$' : ''}`).test(targetPath);
    })
    .sort((left, right) => {
      const length = (value) => value.pattern.replaceAll('*', '').replace(/\$$/, '').length;
      return length(right) - length(left)
        || (left.directive === right.directive ? 0 : left.directive === 'allow' ? -1 : 1);
    });
  return candidates[0]?.directive === 'disallow';
}

function schemaSyntax(html) {
  const scripts = [...html.matchAll(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )];
  if (scripts.length === 0) return { ok: false, message: '未发现 JSON-LD' };
  try {
    scripts.forEach((match) => JSON.parse(match[1]));
    return { ok: true, message: 'JSON-LD 语法可解析' };
  } catch {
    return { ok: false, message: 'JSON-LD 语法无法解析' };
  }
}

function sitemapCheck(sitemap, locator) {
  if (sitemap === null) return { state: 'unverifiable', message: '缺少 sitemap snapshot' };
  const normalized = sitemap.trim()
    .replace(/^<\?xml\b[\s\S]*?\?>\s*/i, '')
    .replace(/^(?:(?:<\?[\s\S]*?\?>|<!--[\s\S]*?-->)\s*)*/, '')
    .replace(/(?:(?:<\?[\s\S]*?\?>|<!--[\s\S]*?-->)\s*)*$/, '');
  const validRoot = /^<(urlset|sitemapindex)\b[^>]*>[\s\S]*<\/\1>\s*$/i
    .test(normalized);
  if (!validRoot) return { state: 'fail', message: 'sitemap 语法不可解析' };
  const locators = [...sitemap.matchAll(/<loc\b[^>]*>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1].replaceAll('&amp;', '&').trim());
  let expected;
  try {
    expected = new URL(locator).href;
  } catch {
    return { state: 'fail', message: '显式目标 URL 非法' };
  }
  const included = locators.some((value) => {
    try {
      return new URL(value).href === expected;
    } catch {
      return false;
    }
  });
  return {
    state: included ? 'pass' : 'fail',
    message: included ? 'sitemap 包含显式目标' : 'sitemap 未包含显式目标',
  };
}

function headerValue(headers, name) {
  return Object.entries(headers ?? {})
    .find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1] ?? '';
}

function capturedChecks(manifest, snapshots) {
  const html = textFor(snapshots, 'html') ?? textFor(snapshots, 'response') ?? '';
  const robots = textFor(snapshots, 'robots');
  const sitemap = textFor(snapshots, 'sitemap');
  const expectedStatuses = manifest.expectations?.expected_http_statuses ?? [200];
  const httpOk = expectedStatuses.includes(manifest.http?.status);
  const http = result('HTTP_STATUS', httpOk ? 'pass' : 'fail',
    httpOk ? 'HTTP 状态符合显式期望' : 'HTTP 状态不符合显式期望');

  const canonicalValue = extractCanonical(html);
  let canonicalOk = false;
  if (canonicalValue) {
    try {
      canonicalOk = new URL(canonicalValue).href === new URL(manifest.target.locator).href;
    } catch {
      canonicalOk = false;
    }
  }
  const canonical = result('CANONICAL', canonicalOk ? 'pass' : 'fail',
    canonicalOk ? 'canonical 与显式目标一致' : 'canonical 缺失、非法或与显式目标不一致');

  const targetPath = manifest.expectations?.target_path ?? new URL(manifest.target.locator).pathname;
  const robotsBlocked = robotsBlocksPath(robots, targetPath);
  const robotsResult = result('ROBOTS', robotsBlocked === null ? 'unverifiable' : robotsBlocked ? 'fail' : 'pass',
    robotsBlocked === null ? '缺少 robots snapshot' : robotsBlocked ? 'robots 声明阻断目标路径' : 'robots 未声明阻断目标路径');
  const sitemapEvaluation = sitemapCheck(sitemap, manifest.target.locator);
  const sitemapResult = result('SITEMAP', sitemapEvaluation.state, sitemapEvaluation.message);
  const schema = schemaSyntax(html);
  const schemaResult = result('SCHEMA_SYNTAX', schema.ok ? 'pass' : 'fail', schema.message);
  const title = /<title\b[^>]*>\s*[^<\s][\s\S]*?<\/title>/i.test(html);
  const description = (metaContent(html, 'description') ?? '').trim().length > 0;
  const heading = /<h[1-6]\b[^>]*>\s*[^<\s][\s\S]*?<\/h[1-6]>/i.test(html);
  const titleResult = result('TITLE_PRESENT', title ? 'pass' : 'fail', title ? 'title 非空' : 'title 缺失或为空');
  const metaResult = result('META_DESCRIPTION_PRESENT', description ? 'pass' : 'fail',
    description ? 'meta description 非空' : 'meta description 缺失或为空');
  const headingResult = result('HEADING_PRESENT', heading ? 'pass' : 'fail',
    heading ? 'heading 非空' : 'heading 缺失或为空');
  const noindex = /\bnoindex\b/i.test(metaContent(html, 'robots') ?? '')
    || /\bnoindex\b/i.test(headerValue(manifest.http?.headers, 'x-robots-tag'));
  const dependencies = [http, canonical, robotsResult];
  const crawlState = dependencies.some((item) => item.state === 'fail') || noindex
    ? 'fail'
    : dependencies.some((item) => item.state === 'unverifiable') ? 'unverifiable' : 'pass';
  const crawl = result('CRAWLABILITY', crawlState,
    crawlState === 'pass' ? 'HTTP、robots、noindex 与 canonical 条件通过'
      : crawlState === 'fail' ? '至少一个确定性 crawlability 条件失败' : '缺少必要的 crawlability 输入');
  return [http, canonical, robotsResult, sitemapResult, schemaResult, titleResult, metaResult, headingResult, crawl];
}

async function loadManifestSnapshots(workspace, manifest) {
  const snapshots = new Map();
  for (const snapshot of manifest.snapshots) {
    snapshots.set(snapshot.role, await readSnapshot({ workspace, snapshot }));
  }
  return snapshots;
}

export async function evaluateSiteManifest({ workspace, manifest }) {
  assertManifestShape(manifest);
  const graph = await loadWorkspaceGraph({ workspace });
  const asset = requireObject(graph, manifest.target.asset_ref, 'asset');
  if (asset.data.locator !== manifest.target.locator) {
    throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'manifest locator 与 Asset 不一致');
  }
  if (manifest.collector.mode === 'development_fixture' && !isFixtureLocator(manifest.target.locator)) {
    throw new DiagnosisError('INPUT_NOT_M4_READY', 'development fixture 只能使用 .invalid 或 workspace locator');
  }
  const snapshots = await loadManifestSnapshots(workspace, manifest);
  const checks = manifest.collection_state === 'captured'
    ? capturedChecks(manifest, snapshots)
    : SITE_CODES.map((code) => result(
      code,
      manifest.collection_state,
      manifest.collection_state === 'blocked' ? '本次采集被阻断，未取得目标正文' : '本次采集不可验证，未取得目标正文',
    ));
  return {
    schema_version: 'm4-site-result-v1',
    detector_version: SITE_DETECTOR_VERSION,
    target: manifest.target,
    collection_state: manifest.collection_state,
    manifest_fingerprint: inputFingerprint(manifest),
    checks,
  };
}

function validatePlanInputs(graph, plan) {
  if (!plan?.run?.id || !plan.run.path || !plan.source_ref || !plan.input_versions) {
    throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'site plan 缺少 run、source 或 input_versions');
  }
  requireObject(graph, plan.source_ref, 'source');
  for (const [ref, version] of Object.entries(plan.input_versions)) {
    const target = graph.byId.get(ref);
    if (!target) throw new DiagnosisError('BROKEN_REF', 'plan input 不存在', { ref });
    if (target.data.version !== version) {
      throw new DiagnosisError('RETEST_INPUT_DRIFT', 'plan input 版本漂移', { ref, expected: version, actual: target.data.version });
    }
  }
  validateVersionRefs(graph, plan.query_set_versions, 'query_set');
  validateVersionRefs(graph, plan.knowledge_release_versions, 'knowledge_release');
  for (const ref of plan.goal_refs ?? []) requireObject(graph, ref, 'perception_goal');
  for (const ref of plan.asset_refs ?? []) requireObject(graph, ref, 'asset');
  const requiredInputs = [
    plan.source_ref,
    ...(plan.goal_refs ?? []),
    ...(plan.query_set_versions ?? []).map(({ ref }) => ref),
    ...(plan.knowledge_release_versions ?? []).map(({ ref }) => ref),
    ...(plan.asset_refs ?? []),
    ...(plan.publication_refs ?? []),
    ...(plan.retest_of_refs ?? []),
  ];
  for (const ref of requiredInputs) {
    if (!(ref in plan.input_versions)) {
      throw new DiagnosisError('RETEST_INPUT_DRIFT', 'plan 关系未进入 input_versions', { ref });
    }
  }
}

function primarySnapshot(manifest, state, code) {
  const wanted = state !== 'captured'
    ? ['response', 'collector_log']
    : code === 'ROBOTS'
      ? ['robots', 'html', 'response']
      : code === 'SITEMAP'
        ? ['sitemap', 'html', 'response']
        : ['html', 'response', 'robots', 'sitemap'];
  return wanted.map((role) => manifest.snapshots.find((item) => item.role === role)).find(Boolean);
}

function resultOutputs({ graph, manifest, plan, evaluation, now, retest }) {
  const asset = requireObject(graph, manifest.target.asset_ref, 'asset');
  const outputs = [];
  const evidenceRefs = [];
  const findingRefs = [];
  const retestByCode = new Map((plan.retest_of_refs ?? []).map((ref) => {
    const finding = requireObject(graph, ref, 'finding');
    if (stableStringify(finding.data.asset_refs ?? [])
        !== stableStringify([manifest.target.asset_ref])) {
      throw new DiagnosisError('RETEST_INPUT_DRIFT', '旧 Finding 与 Retest Asset 不一致', { ref });
    }
    return [finding.data.finding_code, finding];
  }));
  const applicable = retest
    ? evaluation.checks.filter((check) => retestByCode.has(check.code))
    : evaluation.checks.filter((check) => check.state !== 'pass');
  for (const check of applicable) {
    const target = plan.outputs?.[check.code];
    if (!target?.evidence?.id || !target.evidence.path || !target.finding?.id || !target.finding.path) {
      throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'plan 缺少检测输出 ID/path', { code: check.code });
    }
    const snapshot = primarySnapshot(manifest, manifest.collection_state, check.code);
    const evidence = {
      ...commonData(target.evidence, 'evidence', 'candidate', now, graph.byId.get(target.evidence.id)),
      title: target.evidence.title ?? `${check.code} Evidence`,
      source_refs: [plan.source_ref],
      claim_refs: asset.data.claim_versions.map(({ ref }) => ref),
      locator: manifest.target.locator,
      captured_at: manifest.captured_at,
      snapshot: { path: snapshot.path, sha256: snapshot.sha256, media_type: snapshot.media_type },
      collector: { name: manifest.collector.name, version: manifest.collector.version },
      scope: check.message,
      collection_state: ['blocked', 'unverifiable'].includes(check.state)
        ? check.state : manifest.collection_state,
      proof_scope: check.state === 'blocked' || check.state === 'unverifiable'
        ? 'collection_failure' : METADATA_CODES.has(check.code) ? 'metadata_only' : 'target_content',
      detector_code: check.code,
    };
    const previous = retestByCode.get(check.code);
    const finding = {
      ...commonData(target.finding, 'finding', retest && check.state === 'pass' ? 'resolved' : 'open', now,
        graph.byId.get(target.finding.id)),
      title: target.finding.title ?? `${check.code} Finding`,
      finding_code: check.code,
      finding_kind: 'technical',
      item_state: check.state === 'fail' || check.state === 'pass' ? 'observed' : check.state,
      rule_version: SITE_DETECTOR_VERSION,
      diagnosis_class: 'technical',
      query_refs: asset.data.query_refs,
      claim_refs: asset.data.claim_versions.map(({ ref }) => ref),
      evidence_refs: [evidence.id],
      asset_refs: [asset.data.id],
      source_refs: [plan.source_ref],
      ...(previous ? { retest_of_ref: previous.data.id } : {}),
    };
    outputs.push({ path: target.evidence.path, data: evidence, body: `# ${evidence.title}\n\n${check.message}\n` });
    outputs.push({ path: target.finding.path, data: finding, body: `# ${finding.title}\n\n${check.message}\n` });
    evidenceRefs.push(evidence.id);
    findingRefs.push(finding.id);
  }
  return { outputs, evidenceRefs: sortedUnique(evidenceRefs), findingRefs: sortedUnique(findingRefs) };
}

async function materializeSite({ workspace, manifest, plan, now, retest }) {
  const evaluation = await evaluateSiteManifest({ workspace, manifest });
  const graph = await loadWorkspaceGraph({ workspace });
  validatePlanInputs(graph, plan);
  const generated = resultOutputs({ graph, manifest, plan, evaluation, now, retest });
  const run = {
    ...commonData(plan.run, 'run', 'completed', now, graph.byId.get(plan.run.id)),
    title: retest ? 'geo-site Technical Retest' : 'geo-site audit',
    skill: retest ? 'geo-site-technical-retest' : 'geo-site',
    skill_version: '1.0.0',
    input_refs: Object.keys(plan.input_versions).sort(),
    input_versions: Object.fromEntries(Object.entries(plan.input_versions).sort(([a], [b]) => a.localeCompare(b))),
    input_fingerprint: inputFingerprint(plan.input_versions),
    completed_steps: evaluation.checks.map(({ code }) => code),
    output_artifacts: [],
    business_result: 'not_evaluated',
    next_action: retest ? 'review technical retest only' : 'review Findings and human gates',
    finding_refs: generated.findingRefs,
    evidence_refs: generated.evidenceRefs,
    asset_refs: sortedUnique(plan.asset_refs),
    failure_reason: null,
    goal_refs: sortedUnique(plan.goal_refs),
    query_set_versions: plan.query_set_versions,
    knowledge_release_versions: plan.knowledge_release_versions,
    publication_refs: sortedUnique(plan.publication_refs),
    retest_of_refs: sortedUnique(plan.retest_of_refs),
    development_fixture: Boolean(plan.development_fixture),
    manifest_fingerprint: evaluation.manifest_fingerprint,
    detector_results: evaluation.checks.map(({ code, state, rule_version, message }) => ({
      code, state, rule_version, message,
    })),
  };
  const outputs = [...generated.outputs, {
    path: plan.run.path,
    data: run,
    body: `# Run ${run.id}\n`,
  }];
  const virtualGraph = { ...graph, byId: new Map(graph.byId) };
  for (const output of outputs) {
    const validation = validateDiagnosisObject(virtualGraph, {
      ...output,
      content: output.body,
    });
    if (validation.errors.length > 0) {
      throw new DiagnosisError(validation.errors[0].code, 'site 输出不符合 M4 profile', {
        diagnostics: validation.errors,
      });
    }
    virtualGraph.byId.set(output.data.id, {
      data: output.data,
      path: output.path,
      content: output.body,
    });
  }
  const prepared = await prepareOutputs({ workspace, graph, outputs });
  const written = await writePreparedOutputs({ workspace, prepared });
  return {
    ...evaluation,
    ...written,
    evidence_refs: generated.evidenceRefs,
    finding_refs: generated.findingRefs,
    run_ref: run.id,
  };
}

export async function auditSite(options) {
  return materializeSite({ ...options, retest: false });
}

export async function technicalRetest({ workspace, manifest, plan, now }) {
  const graph = await loadWorkspaceGraph({ workspace });
  if (!plan.development_fixture) {
    if ((plan.publication_refs?.length ?? 0) === 0) {
      throw new DiagnosisError('PUBLICATION_REQUIRED', '非 Fixture Technical Retest 需要 confirmed Publication');
    }
    for (const ref of plan.publication_refs) {
      const publication = requireObject(graph, ref, 'asset_publication');
      if (publication.data.status !== 'confirmed') {
        throw new DiagnosisError('PUBLICATION_REQUIRED', 'Publication 尚未 confirmed', { ref });
      }
      if (publication.data.asset_ref !== manifest.target?.asset_ref) {
        throw new DiagnosisError('RETEST_INPUT_DRIFT', 'Publication 与 Retest Asset 不一致', { ref });
      }
    }
  } else if (!isFixtureLocator(manifest.target?.locator)) {
    throw new DiagnosisError('INPUT_NOT_M4_READY', 'Fixture Retest 只能使用 .invalid 或 workspace locator');
  }
  if ((plan.retest_of_refs?.length ?? 0) === 0) {
    throw new DiagnosisError('RETEST_INPUT_DRIFT', 'Technical Retest 缺少旧 Finding refs');
  }
  return materializeSite({ workspace, manifest, plan, now, retest: true });
}
