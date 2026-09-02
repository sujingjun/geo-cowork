import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  normalizeReadonlyResultToMetrics,
} from './analytics-observation-inputs.mjs';
import { assertCreateOnlyTargets } from './cycle-two-workspace.mjs';
import { inputFingerprint } from './run-store.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  assertNoSymlinkPath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class RealAnalyticsMaterializationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'RealAnalyticsMaterializationError';
    this.code = code;
    Object.assign(this, details);
  }
}

function assertPlan(plan) {
  if (plan?.schema_version !== 'real-analytics-observation-plan/1.0.0'
      || !/^MER-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(plan.merchant_ref ?? '')
      || plan.execution_scope !== 'authorized_real'
      || !plan.run?.id || !plan.run?.path
      || !Array.isArray(plan.sources) || plan.sources.length !== 2
      || !Array.isArray(plan.observations) || plan.observations.length !== 2
      || !plan.signal?.id || !plan.evidence?.id
      || plan.evidence.status !== 'candidate') {
    throw new RealAnalyticsMaterializationError('ANALYTICS_OBSERVATION_PLAN_INVALID', 'Real Analytics observation plan invalid');
  }
  const kinds = [...plan.sources.map(({ kind }) => kind)].sort();
  if (stableStringify(kinds) !== stableStringify(['ga4', 'gsc'])) {
    throw new RealAnalyticsMaterializationError('ANALYTICS_OBSERVATION_PLAN_INVALID', 'GA4/GSC source descriptors required');
  }
}

function containsSensitive(value) {
  if (typeof value === 'string') {
    return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(value)
      || /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(value)
      || /(?:api[_-]?key|access[_-]?token|authorization|cookie|password|secret)\s*[:=]/i.test(value);
  }
  if (Array.isArray(value)) return value.some(containsSensitive);
  return value && typeof value === 'object' && Object.values(value).some(containsSensitive);
}

async function readContract(root, descriptor) {
  await assertNoSymlinkPath(root, descriptor.path);
  const bytes = await readFile(resolveWithin(root, descriptor.path));
  let data;
  try {
    data = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new RealAnalyticsMaterializationError('ANALYTICS_OBSERVATION_PLAN_INVALID', `Contract invalid: ${descriptor.path}`);
  }
  if (descriptor.sha256 && descriptor.sha256 !== sha256(bytes)) {
    throw new RealAnalyticsMaterializationError('READINESS_INPUT_DRIFT', `Contract checksum drift: ${descriptor.path}`);
  }
  return { data, bytes, sha256: sha256(bytes) };
}

function artifactPin(role, descriptor, resolved) {
  return {
    version: resolved.data.version,
    artifact_path: descriptor.path,
    artifact_entry_key: sha256(stableStringify({ role, path: descriptor.path, sha256: resolved.sha256 })),
    sha256: resolved.sha256,
  };
}

function sourceData(descriptor, plan, readonlyPlan, createdAt) {
  const locator = descriptor.kind === 'ga4'
    ? `google-analytics://properties/${readonlyPlan.ga4.property_id}`
    : `google-search-console://${encodeURIComponent(readonlyPlan.gsc.site_url)}`;
  return {
    id: descriptor.id,
    record_type: 'source',
    status: 'active',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: `MyyShop ${descriptor.kind.toUpperCase()} aggregate source`,
    name: descriptor.name,
    source_kind: 'first_party_analytics',
    locator,
  };
}

function observationData({ descriptor, plan, result, metrics, measurement, policy, createdAt }) {
  const source = descriptor.kind;
  const sourceResult = result.sources[source];
  return {
    id: descriptor.id,
    record_type: 'analytics_observation',
    status: 'recorded',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: `MyyShop ${source.toUpperCase()} authorized read-only observation`,
    merchant_ref: plan.merchant_ref,
    run_ref: plan.run.id,
    execution_scope: 'authorized_real',
    adapter: {
      kind: source,
      name: `${source}-readonly`,
      version: '1.0.0',
      access_mode: 'read_only',
      authorization_ref: plan.authorization_ref,
    },
    measurement_contract: artifactPin('measurement_contract', plan.contracts.measurement, measurement),
    sensitive_data_policy: {
      id: policy.data.id,
      version: policy.data.version,
      artifact_entry_key: artifactPin('sensitive_data_policy', plan.contracts.sensitive_data_policy, policy).artifact_entry_key,
      sha256: policy.sha256,
    },
    time_window: {
      starts_at: `${result.time_window.start_date}T00:00:00Z`,
      ends_at: `${result.time_window.end_date}T23:59:59Z`,
      as_of: createdAt,
    },
    metrics: metrics.filter((item) => item.dimensions.source === source),
    artifacts: [{
      path: plan.raw_output_path,
      sha256: sha256(stableStringify(result, 2)),
      media_type: 'application/json',
    }],
    quality: {
      completeness: sourceResult.status === 'ok' ? 'complete' : 'unavailable',
      warnings: [...(result.quality?.warnings ?? [])].filter((warning) => warning.startsWith(source.toUpperCase())),
    },
    causal_claim: false,
  };
}

function signalData({ plan, observations, metrics, measurement, rule, createdAt }) {
  const impressions = metrics.find(({ metric_id: id }) => id === 'gsc_impressions')?.value ?? 0;
  const ctr = metrics.find(({ metric_id: id }) => id === 'gsc_ctr')?.value ?? null;
  const gscObservation = observations.find(({ title }) => title.includes('GSC'));
  return {
    id: plan.signal.id,
    record_type: 'business_signal',
    status: 'computed',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: 'MyyShop observed GSC search visibility signal',
    merchant_ref: plan.merchant_ref,
    run_ref: plan.run.id,
    execution_scope: 'authorized_real',
    observation_versions: [{ ref: gscObservation.id, version: gscObservation.version }],
    measurement_contract: artifactPin('measurement_contract', plan.contracts.measurement, measurement),
    rule: {
      id: rule.data.id,
      version: rule.data.version,
      artifact_path: plan.contracts.signal_rule.path,
      artifact_entry_key: artifactPin('signal_rule', plan.contracts.signal_rule, rule).artifact_entry_key,
      sha256: rule.sha256,
    },
    signal_kind: 'search_visibility',
    denominator: {
      definition: 'GSC impressions in the authorized window.',
      value: impressions,
      state: impressions > 0 ? 'known' : 'zero',
    },
    calculation: {
      value: ctr,
      unit: 'clicks_per_impression',
      state: impressions > 0 ? 'signal_observed' : 'insufficient_data',
      explanation: 'Observed GSC clicks divided by impressions; no GEO or content causality is asserted.',
    },
    causal_claim: false,
  };
}

function runData({ plan, sourceObjects, createdAt, rawSha }) {
  const versions = Object.fromEntries([
    [plan.merchant_ref, '1.0.0'],
    ...sourceObjects.map(({ id, version }) => [id, version]),
  ].sort(([left], [right]) => left.localeCompare(right)));
  return {
    id: plan.run.id,
    record_type: 'run',
    status: 'completed',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: 'MyyShop authorized read-only Analytics observation Run',
    skill: 'geo-analytics',
    skill_version: '1.1.0',
    input_refs: Object.keys(versions).sort(),
    input_versions: versions,
    input_fingerprint: inputFingerprint(versions),
    completed_steps: ['authorized_read', 'observation_recorded', 'signal_computed', 'candidate_evidence_created'],
    output_artifacts: [plan.raw_output_path, ...plan.observations.map(({ path: item }) => item), plan.signal.path, plan.evidence.path].sort(),
    business_result: 'inconclusive',
    next_action: 'Human review of candidate Evidence; no causal conclusion.',
    evidence_refs: [plan.evidence.id],
    finding_refs: [],
    asset_refs: [],
    failure_reason: null,
    merchant_ref: plan.merchant_ref,
    execution_scope: 'authorized_real',
    transition_plan_sha256: rawSha,
    lease: {
      scope_key: `${plan.merchant_ref}:authorized-real-analytics`,
      owner_id: `geo-analytics-${process.pid}`,
      revision: 1,
      acquired_at: createdAt,
      heartbeat_at: createdAt,
      expires_at: new Date(Date.parse(createdAt) + 60_000).toISOString(),
    },
  };
}

export async function materializeRealAnalyticsBundle({ workspace, readonlyPlan, result, plan }) {
  assertPlan(plan);
  const root = path.resolve(workspace);
  const identity = JSON.parse(await readFile(resolveWithin(root, 'workspace.json'), 'utf8'));
  if (identity.workspace_mode !== 'online'
      || identity.merchant_ref !== plan.merchant_ref
      || identity.online_configuration?.ga4_property_id !== readonlyPlan.ga4.property_id
      || identity.online_configuration?.gsc_site_url !== readonlyPlan.gsc.site_url
      || plan.authorization_ref !== readonlyPlan.authorization?.ref
      || result.run_id !== readonlyPlan.run_id) {
    throw new RealAnalyticsMaterializationError('WORKSPACE_SCOPE_INVALID', 'Online Merchant/Analytics configuration mismatch');
  }
  if (containsSensitive(result)) {
    throw new RealAnalyticsMaterializationError('BUSINESS_FILE_PII_DETECTED', 'Normalized Analytics result contains sensitive data');
  }
  const [measurement, policy, rule] = await Promise.all([
    readContract(root, plan.contracts.measurement),
    readContract(root, plan.contracts.sensitive_data_policy),
    readContract(root, plan.contracts.signal_rule),
  ]);
  const persistedResult = { ...result, persisted_to_workspace: true };
  const metrics = normalizeReadonlyResultToMetrics(persistedResult);
  const declaredMetrics = new Set(measurement.data.metrics?.map(({ metric_id: id }) => id) ?? []);
  if (metrics.some(({ metric_id: id }) => !declaredMetrics.has(id))
      || policy.data.aggregate_only !== true
      || rule.data.causal_claim !== false) {
    throw new RealAnalyticsMaterializationError(
      'ANALYTICS_OBSERVATION_PLAN_INVALID',
      'Measurement/policy/rule contract does not cover normalized output',
    );
  }
  const createdAt = result.captured_at;
  const rawBytes = Buffer.from(stableStringify(persistedResult, 2));
  const rawSha = sha256(rawBytes);
  const sourceObjects = plan.sources.map((descriptor) =>
    sourceData(descriptor, plan, readonlyPlan, createdAt));
  const observations = plan.observations.map((descriptor) => observationData({
    descriptor, plan, result: persistedResult, metrics, measurement, policy, createdAt,
  }));
  const signal = signalData({ plan, observations, metrics, measurement, rule, createdAt });
  const evidence = {
    id: plan.evidence.id,
    record_type: 'evidence',
    status: 'candidate',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: 'MyyShop authorized Analytics Evidence candidate',
    merchant_ref: plan.merchant_ref,
    execution_scope: 'authorized_real',
    source_refs: sourceObjects.map(({ id }) => id),
    locator: `workspace://${plan.raw_output_path}`,
    captured_at: createdAt,
    snapshot: { path: plan.raw_output_path, sha256: rawSha, media_type: 'application/json' },
    collector: { name: 'geo-analytics-readonly', version: '1.1.0' },
    scope: 'Authorized aggregate GA4/GSC observation only; no GEO or content causality.',
    observation_versions: observations.map(({ id, version }) => ({ ref: id, version })),
  };
  const run = runData({ plan, sourceObjects, createdAt, rawSha });
  const objects = [...sourceObjects, run, ...observations, signal, evidence];
  for (const object of objects) validateObjectData(object, { path: `<real-analytics:${object.id}>` });
  const descriptors = [
    ...plan.sources,
    plan.run,
    ...plan.observations,
    plan.signal,
    plan.evidence,
  ];
  const targets = [
    { path: plan.raw_output_path, bytes: rawBytes },
    ...objects.map((object) => {
      const descriptor = descriptors.find(({ id }) => id === object.id);
      return {
        path: descriptor.path,
        bytes: Buffer.from(serializeMarkdownObject(object, `# ${object.title}\n`)),
      };
    }),
  ];
  await assertCreateOnlyTargets(root, targets, 'ANALYTICS_OBSERVATION_CONFLICT');
  const writes = [];
  for (const target of targets) {
    writes.push(await writeCreateOnly(root, target.path, target.bytes, {
      idempotent: true,
      conflictCode: 'ANALYTICS_OBSERVATION_CONFLICT',
    }));
  }
  return {
    action: writes.every(({ action }) => action === 'kept') ? 'kept' : 'created',
    run_ref: run.id,
    source_refs: sourceObjects.map(({ id }) => id),
    observation_refs: observations.map(({ id }) => id),
    business_signal_ref: signal.id,
    evidence_ref: evidence.id,
    evidence_status: 'candidate',
    raw_sha256: rawSha,
    persisted_to_workspace: true,
    causal_claim: false,
    auto_approved: false,
  };
}
