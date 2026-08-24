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

const FORBIDDEN_KEYS = /^(?:authorization|cookie|set-cookie|token|secret|api[_-]?key)$/i;

function assertNoSecrets(value, pathLabel = 'manifest') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecrets(item, `${pathLabel}[${index}]`));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.test(key)) {
        throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'research manifest 包含禁止的敏感字段', {
          field: `${pathLabel}.${key}`,
        });
      }
      assertNoSecrets(item, `${pathLabel}.${key}`);
    }
  }
}

function validateObservation(observation) {
  if (!observation?.source_ref
      || !['accessible', 'blocked', 'unverifiable'].includes(observation.access_state)
      || !['captured', 'missing', 'not_applicable'].includes(observation.original_content_state)
      || !['first_party', 'user', 'independent', 'competitor', 'platform_observation']
        .includes(observation.support_kind)
      || !['high', 'medium', 'low', 'unknown'].includes(observation.confidence)
      || !observation.confidence_reason
      || !Array.isArray(observation.independent_support_refs)
      || !Array.isArray(observation.counter_evidence_refs)) {
    throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'research observation 缺少必填字段');
  }
  if (observation.access_state === 'accessible' && observation.original_content_state === 'captured'
      && !observation.snapshot) {
    throw new DiagnosisError('SNAPSHOT_REQUIRED', 'accessible + captured 必须有原文 snapshot');
  }
  if (observation.access_state !== 'accessible' && !observation.snapshot) {
    throw new DiagnosisError('SNAPSHOT_REQUIRED', 'blocked/unverifiable 必须有响应页或 collector log');
  }
  if (observation.access_state !== 'accessible'
      && observation.original_content_state === 'captured') {
    throw new DiagnosisError('EVIDENCE_SCOPE_MISMATCH', 'blocked/unverifiable 不能标为已取得目标原文');
  }
}

function validatePlan(graph, plan, manifest) {
  if (!plan?.run?.id || !plan.run.path || !plan.input_versions
      || !Array.isArray(plan.observations)
      || plan.observations.length !== manifest.observations.length) {
    throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'research plan 缺少 Run、输入版本或 observation 输出');
  }
  const ids = new Set();
  const paths = new Set();
  for (const target of plan.observations) {
    if (!target.source_ref || !target.id || !target.path || ids.has(target.id) || paths.has(target.path)) {
      throw new DiagnosisError('OBJECT_CONFLICT', 'research plan 的 Evidence ID/path 缺失或重复');
    }
    ids.add(target.id);
    paths.add(target.path);
  }
  for (const [ref, version] of Object.entries(plan.input_versions)) {
    const target = graph.byId.get(ref);
    if (!target) throw new DiagnosisError('BROKEN_REF', 'research plan input 不存在', { ref });
    if (target.data.version !== version) {
      throw new DiagnosisError('RETEST_INPUT_DRIFT', 'research plan input 版本漂移', {
        ref, expected: version, actual: target.data.version,
      });
    }
  }
  validateVersionRefs(graph, plan.query_set_versions, 'query_set');
  validateVersionRefs(graph, plan.knowledge_release_versions, 'knowledge_release');
  for (const ref of plan.goal_refs ?? []) requireObject(graph, ref, 'perception_goal');
  for (const ref of plan.asset_refs ?? []) requireObject(graph, ref, 'asset');
  const sourceRefs = manifest.observations.map(({ source_ref }) => source_ref);
  const requiredInputs = [
    ...sourceRefs,
    ...(plan.goal_refs ?? []),
    ...(plan.query_set_versions ?? []).map(({ ref }) => ref),
    ...(plan.knowledge_release_versions ?? []).map(({ ref }) => ref),
    ...(plan.asset_refs ?? []),
  ];
  for (const ref of requiredInputs) {
    if (!(ref in plan.input_versions)) {
      throw new DiagnosisError('RETEST_INPUT_DRIFT', 'research 关系未进入 input_versions', { ref });
    }
  }
  if (plan.development_fixture) {
    for (const ref of sourceRefs) {
      if (!isFixtureLocator(requireObject(graph, ref, 'source').data.locator)) {
        throw new DiagnosisError('INPUT_NOT_M4_READY', 'development fixture 只能引用 .invalid 或 workspace Source', { ref });
      }
    }
  }
}

function warningsFor(observation, evidenceId) {
  const warnings = [];
  if (observation.access_state === 'blocked') warnings.push({ code: 'SOURCE_BLOCKED', id: evidenceId });
  if (observation.original_content_state === 'missing') {
    warnings.push({ code: 'ORIGINAL_CONTENT_MISSING', id: evidenceId });
  }
  if (observation.confidence === 'low') warnings.push({ code: 'LOW_CONFIDENCE', id: evidenceId });
  if (observation.support_kind !== 'independent' && observation.independent_support_refs.length === 0) {
    warnings.push({ code: 'INDEPENDENT_SUPPORT_MISSING', id: evidenceId });
  }
  return warnings;
}

function proofScope(observation) {
  if (observation.access_state !== 'accessible') return 'collection_failure';
  if (observation.original_content_state === 'captured') return 'original_content';
  return 'metadata_only';
}

export async function ingestResearch({ workspace, manifest, plan, now }) {
  assertNoSecrets(manifest);
  if (manifest?.schema_version !== 'm4-research-manifest-v1'
      || !Array.isArray(manifest.observations) || manifest.observations.length === 0) {
    throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'research manifest 缺少 observations');
  }
  manifest.observations.forEach(validateObservation);
  const graph = await loadWorkspaceGraph({ workspace });
  validatePlan(graph, plan, manifest);
  const outputs = [];
  const evidenceRefs = [];
  const warnings = [];
  const plannedEvidence = new Set(plan.observations.map(({ id }) => id));

  for (const [index, observation] of manifest.observations.entries()) {
    const target = plan.observations[index];
    if (target.source_ref !== observation.source_ref) {
      throw new DiagnosisError('COLLECTION_MANIFEST_INVALID', 'manifest 与 plan 的 source_ref 顺序不一致');
    }
    const source = requireObject(graph, observation.source_ref, 'source');
    const snapshot = await readSnapshot({ workspace, snapshot: observation.snapshot });
    for (const ref of [...observation.independent_support_refs, ...observation.counter_evidence_refs]) {
      const existing = graph.byId.get(ref);
      if (!plannedEvidence.has(ref) && existing?.data.record_type !== 'evidence') {
        throw new DiagnosisError('BROKEN_REF', 'research Evidence 支持引用不存在', { ref });
      }
    }
    const evidence = {
      ...commonData(target, 'evidence', 'candidate', now, graph.byId.get(target.id)),
      title: target.title ?? `Research Evidence ${target.id}`,
      source_refs: [observation.source_ref],
      claim_refs: sortedUnique(target.claim_refs),
      locator: source.data.locator,
      captured_at: manifest.captured_at ?? now,
      snapshot: { path: snapshot.path, sha256: snapshot.sha256, media_type: snapshot.media_type },
      collector: {
        name: manifest.collector?.name ?? 'research-manifest',
        version: manifest.collector?.version ?? '1.0.0',
      },
      scope: observation.confidence_reason,
      access_state: observation.access_state,
      original_content_state: observation.original_content_state,
      support_kind: observation.support_kind,
      independent_support_refs: sortedUnique(observation.independent_support_refs),
      counter_evidence_refs: sortedUnique(observation.counter_evidence_refs),
      confidence: observation.confidence,
      confidence_reason: observation.confidence_reason,
      proof_scope: proofScope(observation),
    };
    outputs.push({
      path: target.path,
      data: evidence,
      body: `# ${evidence.title}\n\n${observation.confidence_reason}\n`,
    });
    evidenceRefs.push(evidence.id);
    warnings.push(...warningsFor(observation, evidence.id));
  }

  const findingRefs = [];
  const virtualGraph = { ...graph, byId: new Map(graph.byId) };
  for (const output of outputs) {
    virtualGraph.byId.set(output.data.id, {
      data: output.data,
      path: output.path,
      content: output.body,
    });
  }
  for (const item of plan.findings ?? []) {
    const finding = {
      ...commonData(item, 'finding', 'waiting_human', now, graph.byId.get(item.id)),
      title: item.title ?? `Research Finding ${item.id}`,
      finding_code: item.finding_code,
      finding_kind: 'semantic',
      item_state: item.item_state ?? 'inferred',
      rule_version: item.rule_version ?? 'm4-gap-v1',
      diagnosis_class: item.diagnosis_class,
      query_refs: sortedUnique(item.query_refs),
      claim_refs: sortedUnique(item.claim_refs),
      evidence_refs: sortedUnique(item.evidence_refs),
      asset_refs: sortedUnique(item.asset_refs),
      source_refs: sortedUnique(item.source_refs),
      gap_basis: item.gap_basis,
    };
    for (const ref of finding.evidence_refs) {
      if (!plannedEvidence.has(ref) && graph.byId.get(ref)?.data.record_type !== 'evidence') {
        throw new DiagnosisError('BROKEN_REF', 'research Finding 引用不存在', { ref });
      }
    }
    const output = { path: item.path, data: finding, body: `# ${finding.title}\n` };
    const validation = validateDiagnosisObject(virtualGraph, {
      data: finding,
      path: item.path,
      content: output.body,
    });
    if (validation.errors.length > 0) {
      throw new DiagnosisError(validation.errors[0].code, 'research Finding 不符合 M4 profile', {
        diagnostics: validation.errors,
      });
    }
    outputs.push(output);
    virtualGraph.byId.set(finding.id, { data: finding, path: item.path, content: output.body });
    findingRefs.push(finding.id);
  }

  const sortedVersions = Object.fromEntries(
    Object.entries(plan.input_versions).sort(([a], [b]) => a.localeCompare(b)),
  );
  const run = {
    ...commonData(plan.run, 'run', 'completed', now, graph.byId.get(plan.run.id)),
    title: 'geo-research ingest',
    skill: plan.skill ?? 'geo-reputation',
    skill_version: '1.0.0',
    input_refs: Object.keys(sortedVersions),
    input_versions: sortedVersions,
    input_fingerprint: inputFingerprint(sortedVersions),
    completed_steps: ['manifest_validated', 'evidence_materialized'],
    output_artifacts: [],
    business_result: 'not_evaluated',
    next_action: findingRefs.length > 0 ? 'human semantic review' : 'review Evidence scope',
    finding_refs: sortedUnique(findingRefs),
    evidence_refs: sortedUnique(evidenceRefs),
    asset_refs: sortedUnique(plan.asset_refs),
    failure_reason: null,
    goal_refs: sortedUnique(plan.goal_refs),
    query_set_versions: plan.query_set_versions,
    knowledge_release_versions: plan.knowledge_release_versions,
    publication_refs: [],
    retest_of_refs: [],
    development_fixture: Boolean(plan.development_fixture),
    manifest_fingerprint: inputFingerprint(manifest),
  };
  outputs.push({ path: plan.run.path, data: run, body: `# Run ${run.id}\n` });
  const prepared = await prepareOutputs({ workspace, graph, outputs });
  const written = await writePreparedOutputs({ workspace, prepared });
  return {
    ...written,
    evidence_refs: sortedUnique(evidenceRefs),
    finding_refs: sortedUnique(findingRefs),
    run_ref: run.id,
    warnings,
  };
}
