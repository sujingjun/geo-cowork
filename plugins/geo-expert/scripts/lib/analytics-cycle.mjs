import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import { validateFixtureAnalyticsInput } from './analytics-security.mjs';
export { validateFixtureAnalyticsInput } from './analytics-security.mjs';
import {
  completeAnalyticsRun,
  createAnalyticsRun,
} from './analytics-run.mjs';
import { preflightTestKnowledgeWrite } from './workspace-scope.mjs';
import { serializeMarkdownObject } from './object-contract.mjs';
import {
  resolveWithin,
  sha256,
  stableStringify,
  walkMarkdownFiles,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class AnalyticsCycleError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnalyticsCycleError';
    this.code = code;
    Object.assign(this, details);
  }
}
async function readJson(workspace, relative) {
  return JSON.parse(await readFile(resolveWithin(workspace, relative), 'utf8'));
}

async function resolveFreezeArtifactPin(root, plan, role, sourcePath, errorCode) {
  const bytes = await readFile(resolveWithin(root, sourcePath));
  const cycle = await findObject(root, plan.cycle_ref);
  if (cycle?.data.record_type === 'cycle') {
    const snapshot = await findObject(root, cycle.data.core_versions?.input_snapshot?.ref);
    const entry = snapshot?.data.artifact_entries?.find((item) =>
      item.role === role && item.source_path === sourcePath);
    if (!entry || sha256(bytes) !== entry.source_sha256) {
      throw new AnalyticsCycleError(errorCode, `${role} 与 freeze CIS tuple/bytes 不一致`);
    }
    const copy = await readFile(resolveWithin(
      root,
      `runs/${snapshot.data.run_ref}/${entry.snapshot_path}`,
    ));
    if (sha256(copy) !== entry.snapshot_sha256 || entry.snapshot_sha256 !== entry.source_sha256) {
      throw new AnalyticsCycleError(errorCode, `${role} snapshot copy 漂移`);
    }
    const contract = JSON.parse(bytes.toString('utf8'));
    return {
      contract,
      bytes,
      pin: {
        version: contract.version,
        artifact_path: sourcePath,
        artifact_entry_key: entry.entry_key,
        sha256: entry.source_sha256,
      },
    };
  }
  if (!sourcePath.startsWith('execution/contracts/')
      || role === 'sensitive_data_policy'
        && sourcePath !== 'execution/contracts/sensitive-data-policy.json') {
    throw new AnalyticsCycleError(errorCode, `${role} 未使用 Workspace canonical contract`);
  }
  const contract = JSON.parse(bytes.toString('utf8'));
  return { contract, bytes, pin: artifactPin(role, sourcePath, bytes) };
}

function metricDefinition(contract, metricId) {
  return contract.metrics.find((metric) => metric.metric_id === metricId)?.definition
    ?? `Synthetic fixture metric ${metricId}.`;
}

function artifactPin(role, relative, bytes) {
  const checksum = sha256(bytes);
  return {
    version: '1.0.0',
    artifact_path: relative,
    artifact_entry_key: sha256(stableStringify({ role, path: relative, sha256: checksum })),
    sha256: checksum,
  };
}

async function writeCanonical(workspace, relative, data, body, conflictCode) {
  return writeCreateOnly(workspace, relative, serializeMarkdownObject(data, body), {
    idempotent: true,
    conflictCode,
  });
}

export async function ingestFixtureObservation({ workspace, plan }) {
  const root = path.resolve(workspace);
  if (plan.adapter.kind !== 'fixture' || plan.adapter.access_mode !== 'fixture') {
    throw new AnalyticsCycleError('ANALYTICS_ADAPTER_INVALID', '测试商户只允许 fixture adapter');
  }
  const policyResolved = await resolveFreezeArtifactPin(
    root,
    plan,
    'sensitive_data_policy',
    plan.sensitive_data_policy_path,
    'ANALYTICS_SENSITIVE_DATA_POLICY_REQUIRED',
  );
  if (policyResolved.contract.schema_version !== 'm6-sensitive-data-policy/1.0.0'
      || policyResolved.contract.scope !== 'test_only'
      || !Array.isArray(policyResolved.contract.forbidden_field_patterns)) {
    throw new AnalyticsCycleError(
      'ANALYTICS_SENSITIVE_DATA_POLICY_REQUIRED',
      'Analytics policy contract 语义非法',
    );
  }
  const validated = await validateFixtureAnalyticsInput({
    workspace: root,
    inputPath: plan.input_path,
    policyPath: plan.sensitive_data_policy_path,
  });
  const measurementResolved = await resolveFreezeArtifactPin(
    root,
    plan,
    'measurement_contract',
    plan.measurement_contract_path,
    'CYCLE_VERSION_DRIFT',
  );
  const contract = measurementResolved.contract;
  const declaredMetrics = new Set(contract.metrics.map((metric) => metric.metric_id));
  if (validated.input.metrics.some((metric) => !declaredMetrics.has(metric.metric_id))) {
    throw new AnalyticsCycleError(
      'ANALYTICS_FIELD_NOT_ALLOWED',
      'Analytics metric 未在 pinned measurement contract 声明',
    );
  }
  const rawBytes = validated.bytes;
  const rawRelative = `runs/${plan.run_ref}/${plan.raw_output_path}`;
  const metrics = validated.input.metrics.map((metric) => ({
    metric_id: metric.metric_id,
    definition: metricDefinition(contract, metric.metric_id),
    value: metric.value,
    unit: metric.unit,
    dimensions: metric.dimensions,
    state: metric.value === null ? 'partial' : 'observed',
    limitation: metric.value === null ? 'Fixture metric unavailable.' : null,
  }));
  const partial = metrics.some((metric) => metric.state !== 'observed');
  const data = {
    id: plan.observation.id,
    record_type: 'analytics_observation',
    status: 'recorded',
    version: '1.0.0',
    created_at: validated.input.time_window.as_of,
    updated_at: validated.input.time_window.as_of,
    title: 'Synthetic Analytics Observation',
    test_scope: { ...plan.test_scope },
    execution_scope: 'synthetic_test',
    merchant_ref: plan.merchant_ref,
    cycle_ref: plan.cycle_ref,
    goal_ref: plan.goal_ref,
    run_ref: plan.run_ref,
    adapter: plan.adapter,
    measurement_contract: measurementResolved.pin,
    sensitive_data_policy: (() => {
      const pin = policyResolved.pin;
      return {
        id: policyResolved.contract.id,
        version: pin.version,
        artifact_entry_key: pin.artifact_entry_key,
        sha256: pin.sha256,
      };
    })(),
    time_window: validated.input.time_window,
    metrics,
    artifacts: [{
      path: plan.raw_output_path,
      sha256: sha256(rawBytes),
      media_type: 'application/json',
    }],
    quality: {
      completeness: partial ? 'partial' : 'complete',
      warnings: partial ? ['ANALYTICS_PARTIAL'] : [],
    },
    causal_claim: false,
  };
  await preflightTestKnowledgeWrite({
    workspace: root, data, body: '# Synthetic Analytics Observation\n', refClosure: false,
  });
  await createAnalyticsRun(root, plan, data.updated_at, plan.raw_output_path);
  const rawResult = await writeCreateOnly(root, rawRelative, rawBytes, {
    idempotent: true,
    conflictCode: 'ANALYTICS_ARTIFACT_CONFLICT',
  });
  const objectResult = await writeCanonical(
    root,
    plan.observation.path,
    data,
    '# Synthetic Analytics Observation\n',
    'ANALYTICS_ARTIFACT_CONFLICT',
  );
  return {
    action: rawResult.action === 'kept' && objectResult.action === 'kept' ? 'kept' : 'created',
    data,
  };
}

export function computeSignalFromMetrics({ input, rule }) {
  const metrics = new Map(input.metrics.map((metric) => [metric.metric_id, metric.value]));
  const numerator = metrics.get(rule.numerator_metric_id);
  const denominator = metrics.get(rule.denominator_metric_id);
  const negative = input.metrics.find((metric) => typeof metric.value === 'number' && metric.value < 0);
  if (negative && numerator === undefined && denominator === undefined) {
    return {
      denominator: { definition: 'Not applicable for negative trend.', value: null, state: 'not_applicable' },
      calculation: {
        value: negative.value, unit: negative.unit, state: 'negative',
        explanation: `${negative.metric_id} is negative in the frozen fixture window.`,
      },
      causal_claim: false,
    };
  }
  if (denominator === undefined || denominator === null) {
    return {
      denominator: { definition: rule.denominator_metric_id, value: null, state: 'unknown' },
      calculation: { value: null, unit: 'ratio', state: 'insufficient_data', explanation: 'Denominator unavailable.' },
      causal_claim: false,
    };
  }
  if (denominator === 0) {
    return {
      denominator: { definition: rule.denominator_metric_id, value: 0, state: 'zero' },
      calculation: { value: null, unit: 'ratio', state: 'insufficient_data', explanation: 'Zero denominator.' },
      causal_claim: false,
    };
  }
  if (numerator === undefined || numerator === null) {
    return {
      denominator: { definition: rule.denominator_metric_id, value: denominator, state: 'known' },
      calculation: { value: null, unit: 'ratio', state: 'insufficient_data', explanation: 'Numerator unavailable.' },
      causal_claim: false,
    };
  }
  const value = numerator / denominator;
  return {
    denominator: { definition: rule.denominator_metric_id, value: denominator, state: 'known' },
    calculation: {
      value, unit: 'registrations_per_visit', state: value === 0 ? 'no_signal' : 'signal_observed',
      explanation: `${numerator} / ${denominator}.`,
    },
    causal_claim: false,
  };
}

async function findObject(workspace, id) {
  for (const file of await walkMarkdownFiles(workspace, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    if (parsed.data.id === id) {
      return { data: parsed.data, content: parsed.content, path: path.relative(workspace, file).split(path.sep).join('/') };
    }
  }
  return null;
}

async function validateObservationInputs(root, plan) {
  const observations = [];
  let expectedWindow = null;
  for (const version of plan.observation_versions) {
    const object = await findObject(root, version.ref);
    if (!object) {
      throw new AnalyticsCycleError('BUSINESS_SIGNAL_INPUT_DRIFT', 'Observation 不存在');
    }
    if (object.data.record_type !== 'analytics_observation') {
      throw new AnalyticsCycleError(
        object.data.record_type === 'business_signal'
          ? 'BUSINESS_SIGNAL_AS_EVIDENCE_FORBIDDEN'
          : 'BUSINESS_SIGNAL_INPUT_DRIFT',
        '输入不是 Analytics Observation',
      );
    }
    if (object.data.version !== version.version
        || object.data.status !== 'recorded'
        || object.data.goal_ref !== plan.goal_ref
        || object.data.cycle_ref !== plan.cycle_ref
        || object.data.test_scope?.kind !== 'synthetic'
        || object.data.test_scope?.usage !== 'test_only'
        || object.data.test_scope?.workspace_id !== plan.test_scope?.workspace_id) {
      throw new AnalyticsCycleError('BUSINESS_SIGNAL_INPUT_DRIFT', 'Observation status/scope/Goal/Cycle 漂移');
    }
    const window = stableStringify(object.data.time_window);
    if (expectedWindow && expectedWindow !== window) {
      throw new AnalyticsCycleError('BUSINESS_SIGNAL_INPUT_DRIFT', 'Observation time window 不兼容');
    }
    expectedWindow = window;
    for (const artifact of object.data.artifacts) {
      const relative = `runs/${object.data.run_ref}/${artifact.path}`;
      const bytes = await readFile(resolveWithin(root, relative));
      if (sha256(bytes) !== artifact.sha256) {
        throw new AnalyticsCycleError('BUSINESS_SIGNAL_INPUT_DRIFT', 'Observation raw checksum 漂移');
      }
      const raw = JSON.parse(bytes.toString('utf8'));
      if (stableStringify(raw.time_window) !== window) {
        throw new AnalyticsCycleError('BUSINESS_SIGNAL_INPUT_DRIFT', 'Observation raw time window 漂移');
      }
    }
    observations.push(object);
  }
  return observations;
}

export async function computeBusinessSignal({ workspace, plan }) {
  const root = path.resolve(workspace);
  const observations = await validateObservationInputs(root, plan);
  const observation = observations[0];
  const measurementResolved = await resolveFreezeArtifactPin(
    root,
    plan,
    'measurement_contract',
    plan.measurement_contract_path,
    'BUSINESS_SIGNAL_INPUT_DRIFT',
  );
  const ruleResolved = await resolveFreezeArtifactPin(
    root,
    plan,
    'signal_rule',
    plan.rule_path,
    'BUSINESS_SIGNAL_INPUT_DRIFT',
  );
  for (const item of observations) {
    if (item.data.measurement_contract.artifact_entry_key
          !== measurementResolved.pin.artifact_entry_key
        || item.data.measurement_contract.sha256 !== measurementResolved.pin.sha256) {
      throw new AnalyticsCycleError(
        'BUSINESS_SIGNAL_INPUT_DRIFT',
        'Observation measurement tuple 不属于同一 freeze CIS',
      );
    }
  }
  const rawPath = `runs/${observation.data.run_ref}/${observation.data.artifacts[0].path}`;
  const input = await readJson(root, rawPath);
  const rule = ruleResolved.contract;
  if (plan.rule_sha256 && plan.rule_sha256 !== ruleResolved.pin.sha256) {
    throw new AnalyticsCycleError('BUSINESS_SIGNAL_INPUT_DRIFT', 'Signal rule checksum 漂移');
  }
  const computed = computeSignalFromMetrics({ input, rule });
  const data = {
    id: plan.signal.id,
    record_type: 'business_signal',
    status: 'computed',
    version: '1.0.0',
    created_at: observation.data.updated_at,
    updated_at: observation.data.updated_at,
    title: 'Synthetic Business Signal',
    test_scope: { ...plan.test_scope },
    execution_scope: 'synthetic_test',
    merchant_ref: plan.merchant_ref,
    cycle_ref: plan.cycle_ref,
    goal_ref: plan.goal_ref,
    run_ref: plan.run_ref,
    observation_versions: plan.observation_versions,
    measurement_contract: measurementResolved.pin,
    rule: {
      id: rule.id,
      ...ruleResolved.pin,
    },
    signal_kind: rule.signal_kind,
    ...computed,
  };
  await preflightTestKnowledgeWrite({
    workspace: root, data, body: '# Synthetic Business Signal\n', refClosure: false,
  });
  const result = await writeCanonical(
    root,
    plan.signal.path,
    data,
    '# Synthetic Business Signal\n',
    'ANALYTICS_ARTIFACT_CONFLICT',
  );
  await completeAnalyticsRun(root, plan.run_ref, data.updated_at);
  return { action: result.action, data };
}

export function assertEvidenceRefsDoNotUseAnalytics(refs) {
  const observation = refs.find((ref) => ref.startsWith('ANO-'));
  if (observation) {
    throw new AnalyticsCycleError('OBSERVATION_AS_EVIDENCE_FORBIDDEN', 'Analytics Observation 不能作为 Evidence ref');
  }
  const signal = refs.find((ref) => ref.startsWith('BSIG-'));
  if (signal) {
    throw new AnalyticsCycleError('BUSINESS_SIGNAL_AS_EVIDENCE_FORBIDDEN', 'Business Signal 不能作为 Evidence ref');
  }
}

export async function materializeObservationEvidence({ workspace, plan }) {
  const root = path.resolve(workspace);
  if (plan.requested_status !== 'candidate' || plan.approval) {
    throw new AnalyticsCycleError('EVIDENCE_MATERIALIZATION_INCOMPLETE', 'Analytics Evidence 只能创建 candidate');
  }
  const firstObject = await findObject(root, plan.observation_versions[0].ref);
  if (firstObject?.data.record_type === 'business_signal') {
    throw new AnalyticsCycleError(
      'BUSINESS_SIGNAL_AS_EVIDENCE_FORBIDDEN',
      'Business Signal 不能物化为 Evidence',
    );
  }
  if (!plan.decision_ref
      || !Array.isArray(plan.source_refs) || plan.source_refs.length === 0
      || !Array.isArray(plan.claim_refs) || plan.claim_refs.length === 0) {
    throw new AnalyticsCycleError('EVIDENCE_MATERIALIZATION_INCOMPLETE', 'Evidence Owner/Source/Claim closure 不完整');
  }
  const expectedGoal = firstObject?.data.goal_ref;
  const expectedCycle = firstObject?.data.cycle_ref;
  const observations = [];
  for (const version of plan.observation_versions) {
    const object = await findObject(root, version.ref);
    if (!object
        || object.data.record_type !== 'analytics_observation'
        || object.data.version !== version.version
        || object.data.status !== 'recorded'
        || object.data.goal_ref !== expectedGoal
        || object.data.cycle_ref !== expectedCycle
        || object.data.test_scope?.workspace_id !== plan.test_scope?.workspace_id) {
      throw new AnalyticsCycleError('EVIDENCE_MATERIALIZATION_INCOMPLETE', 'Observation closure/status/scope 不完整');
    }
    observations.push(object);
  }
  for (const ref of plan.source_refs) {
    if ((await findObject(root, ref))?.data.record_type !== 'source') {
      throw new AnalyticsCycleError('EVIDENCE_MATERIALIZATION_INCOMPLETE', 'Evidence Source closure 不完整');
    }
  }
  for (const ref of plan.claim_refs) {
    if ((await findObject(root, ref))?.data.record_type !== 'claim') {
      throw new AnalyticsCycleError('EVIDENCE_MATERIALIZATION_INCOMPLETE', 'Evidence Claim closure 不完整');
    }
  }
  const observation = observations[0];
  if (!observation) {
    throw new AnalyticsCycleError('EVIDENCE_MATERIALIZATION_INCOMPLETE', 'Observation version 不完整');
  }
  const snapshotBytes = await readFile(resolveWithin(root, plan.snapshot_path));
  const data = {
    id: plan.evidence.id,
    record_type: 'evidence',
    status: 'candidate',
    version: '1.0.0',
    created_at: observation.data.updated_at,
    updated_at: observation.data.updated_at,
    title: 'Synthetic Analytics Evidence Candidate',
    test_scope: { ...plan.test_scope },
    merchant_ref: observation.data.merchant_ref,
    execution_scope: 'synthetic_test',
    source_refs: plan.source_refs,
    claim_refs: plan.claim_refs,
    locator: `fixture://${plan.evidence.id.toLowerCase()}`,
    captured_at: observation.data.updated_at,
    snapshot: {
      path: plan.snapshot_path,
      sha256: sha256(snapshotBytes),
      media_type: 'application/json',
    },
    collector: { name: 'geo-analytics-fixture', version: '1.0.0' },
    scope: 'Synthetic test-only Analytics Evidence candidate.',
    observation_versions: plan.observation_versions,
  };
  await preflightTestKnowledgeWrite({
    workspace: root, data, body: '# Synthetic Analytics Evidence Candidate\n', refClosure: false,
  });
  const result = await writeCanonical(
    root,
    plan.evidence.path,
    data,
    '# Synthetic Analytics Evidence Candidate\n',
    'EVIDENCE_MATERIALIZATION_INCOMPLETE',
  );
  return { action: result.action, data };
}
