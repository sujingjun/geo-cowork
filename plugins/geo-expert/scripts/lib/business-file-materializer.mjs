import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { normalizeBusinessFileInput } from './analytics-observation-inputs.mjs';
import { assertCreateOnlyTargets } from './cycle-two-workspace.mjs';
import { inputFingerprint } from './run-store.mjs';
import { serializeMarkdownObject, validateObjectData } from './object-contract.mjs';
import {
  assertNoSymlinkPath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

function fail(code, message, details = {}) {
  const error = new Error(message);
  error.name = 'BusinessFileMaterializationError';
  error.code = code;
  Object.assign(error, details);
  throw error;
}

function assertPlan(plan) {
  if (plan?.schema_version !== 'business-file-observation-plan/1.0.0'
      || !/^MER-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(plan.merchant_ref ?? '')
      || plan.execution_scope !== 'authorized_real'
      || !['business_file', 'server_log'].includes(plan.adapter_kind)
      || !['json', 'csv'].includes(plan.format)
      || !plan.input_path || !plan.authorization?.ref?.startsWith('workspace://')
      || !plan.authorization?.sha256
      || !plan.source?.id || !plan.run?.id || !plan.observation?.id
      || !plan.signal?.id || !plan.evidence?.id || plan.evidence.status !== 'candidate') {
    fail('BUSINESS_FILE_PLAN_INVALID', 'Business file observation plan invalid');
  }
}

async function contract(root, descriptor, role) {
  await assertNoSymlinkPath(root, descriptor.path);
  const bytes = await readFile(resolveWithin(root, descriptor.path));
  const data = JSON.parse(bytes.toString('utf8'));
  const checksum = sha256(bytes);
  if (descriptor.sha256 && descriptor.sha256 !== checksum) {
    fail('READINESS_INPUT_DRIFT', `${role} checksum drift`);
  }
  return {
    data,
    checksum,
    pin: {
      version: data.version,
      artifact_path: descriptor.path,
      artifact_entry_key: sha256(stableStringify({ role, path: descriptor.path, sha256: checksum })),
      sha256: checksum,
    },
  };
}

export async function materializeBusinessFileBundle({ workspace, plan }) {
  assertPlan(plan);
  const root = path.resolve(workspace);
  const identity = JSON.parse(await readFile(resolveWithin(root, 'workspace.json'), 'utf8'));
  if (identity.workspace_mode !== 'online' || identity.merchant_ref !== plan.merchant_ref) {
    fail('WORKSPACE_SCOPE_INVALID', 'Business file does not belong to current online Merchant');
  }
  let bytes;
  try {
    await assertNoSymlinkPath(root, plan.input_path);
    bytes = await readFile(resolveWithin(root, plan.input_path));
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) {
      fail('BUSINESS_FILE_NOT_PROVIDED', 'Authorized aggregate business file not provided');
    }
    throw error;
  }
  const authorizationPath = plan.authorization.ref.replace(/^workspace:\/\//, '');
  const authorizationBytes = await readFile(resolveWithin(root, authorizationPath));
  if (sha256(authorizationBytes) !== plan.authorization.sha256) {
    fail('ANALYTICS_AUTHORIZATION_REQUIRED', 'Business file authorization checksum drift');
  }
  const normalized = normalizeBusinessFileInput({
    bytes,
    format: plan.format,
    metadata: {
      ...plan.metadata,
      merchant_ref: plan.merchant_ref,
      authorization_ref: plan.authorization.ref,
      source_locator: `workspace://${plan.input_path}`,
    },
  });
  const [measurement, policy, rule] = await Promise.all([
    contract(root, plan.contracts.measurement, 'measurement_contract'),
    contract(root, plan.contracts.sensitive_data_policy, 'sensitive_data_policy'),
    contract(root, plan.contracts.signal_rule, 'signal_rule'),
  ]);
  const createdAt = normalized.time_window.as_of;
  const rawSha = sha256(bytes);
  const source = {
    id: plan.source.id, record_type: 'source', status: 'active', version: '1.0.0',
    created_at: createdAt, updated_at: createdAt,
    title: 'MyyShop authorized aggregate business file source',
    name: plan.source.name,
    source_kind: plan.adapter_kind === 'server_log' ? 'first_party_server_log' : 'first_party_business_file',
    locator: normalized.source_locator,
  };
  const observation = {
    id: plan.observation.id, record_type: 'analytics_observation', status: 'recorded', version: '1.0.0',
    created_at: createdAt, updated_at: createdAt,
    title: 'MyyShop authorized aggregate business observation',
    merchant_ref: plan.merchant_ref, run_ref: plan.run.id, execution_scope: 'authorized_real',
    adapter: {
      kind: plan.adapter_kind, name: 'aggregate-business-file', version: '1.0.0',
      access_mode: 'read_only', authorization_ref: plan.authorization.ref,
    },
    measurement_contract: measurement.pin,
    sensitive_data_policy: {
      id: policy.data.id, version: policy.data.version,
      artifact_entry_key: policy.pin.artifact_entry_key, sha256: policy.checksum,
    },
    time_window: normalized.time_window,
    metrics: normalized.metrics,
    artifacts: [{ path: plan.input_path, sha256: rawSha, media_type: plan.format === 'csv' ? 'text/csv' : 'application/json' }],
    quality: { completeness: 'complete', warnings: [] },
    causal_claim: false,
  };
  const numerator = normalized.metrics.find(({ metric_id: id }) => id === plan.signal.numerator_metric_id);
  const denominator = normalized.metrics.find(({ metric_id: id }) => id === plan.signal.denominator_metric_id);
  const hasDenominator = denominator && denominator.value > 0;
  const signal = {
    id: plan.signal.id, record_type: 'business_signal', status: 'computed', version: '1.0.0',
    created_at: createdAt, updated_at: createdAt,
    title: 'MyyShop aggregate business signal',
    merchant_ref: plan.merchant_ref, run_ref: plan.run.id, execution_scope: 'authorized_real',
    observation_versions: [{ ref: observation.id, version: observation.version }],
    measurement_contract: measurement.pin,
    rule: {
      id: rule.data.id, version: rule.data.version, artifact_path: plan.contracts.signal_rule.path,
      artifact_entry_key: rule.pin.artifact_entry_key, sha256: rule.checksum,
    },
    signal_kind: 'custom',
    denominator: {
      definition: plan.signal.denominator_metric_id,
      value: denominator?.value ?? null,
      state: denominator ? (denominator.value === 0 ? 'zero' : 'known') : 'unknown',
    },
    calculation: {
      value: hasDenominator && numerator ? numerator.value / denominator.value : null,
      unit: plan.signal.unit,
      state: hasDenominator && numerator ? 'signal_observed' : 'insufficient_data',
      explanation: 'Deterministic ratio from an authorized aggregate file; no GEO causality is asserted.',
    },
    causal_claim: false,
  };
  const evidence = {
    id: plan.evidence.id, record_type: 'evidence', status: 'candidate', version: '1.0.0',
    created_at: createdAt, updated_at: createdAt,
    title: 'MyyShop aggregate business file Evidence candidate',
    merchant_ref: plan.merchant_ref, execution_scope: 'authorized_real',
    source_refs: [source.id], locator: normalized.source_locator, captured_at: createdAt,
    snapshot: { path: plan.input_path, sha256: rawSha, media_type: plan.format === 'csv' ? 'text/csv' : 'application/json' },
    collector: { name: 'geo-analytics-business-file', version: '1.0.0' },
    scope: 'Authorized aggregate observation only; no GEO or content causality.',
    observation_versions: [{ ref: observation.id, version: observation.version }],
  };
  const versions = Object.fromEntries([[plan.merchant_ref, '1.0.0'], [source.id, source.version]].sort());
  const run = {
    id: plan.run.id, record_type: 'run', status: 'completed', version: '1.0.0',
    created_at: createdAt, updated_at: createdAt,
    title: 'MyyShop aggregate business file observation Run',
    skill: 'geo-analytics', skill_version: '1.1.0',
    input_refs: Object.keys(versions).sort(), input_versions: versions,
    input_fingerprint: inputFingerprint(versions),
    completed_steps: ['aggregate_file_validated', 'observation_recorded', 'signal_computed', 'candidate_evidence_created'],
    output_artifacts: [plan.observation.path, plan.signal.path, plan.evidence.path].sort(),
    business_result: 'inconclusive', next_action: 'Human review of candidate Evidence.',
    evidence_refs: [evidence.id], finding_refs: [], asset_refs: [], failure_reason: null,
    merchant_ref: plan.merchant_ref, execution_scope: 'authorized_real',
    transition_plan_sha256: sha256(stableStringify(plan)),
    lease: {
      scope_key: `${plan.merchant_ref}:business-file`, owner_id: `geo-analytics-${process.pid}`, revision: 1,
      acquired_at: createdAt, heartbeat_at: createdAt,
      expires_at: new Date(Date.parse(createdAt) + 60_000).toISOString(),
    },
  };
  const objects = [source, run, observation, signal, evidence];
  for (const object of objects) validateObjectData(object, { path: `<business-file:${object.id}>` });
  const descriptors = [plan.source, plan.run, plan.observation, plan.signal, plan.evidence];
  const targets = objects.map((object) => ({
    path: descriptors.find(({ id }) => id === object.id).path,
    bytes: Buffer.from(serializeMarkdownObject(object, `# ${object.title}\n`)),
  }));
  await assertCreateOnlyTargets(root, targets, 'ANALYTICS_OBSERVATION_CONFLICT');
  const writes = [];
  for (const target of targets) {
    writes.push(await writeCreateOnly(root, target.path, target.bytes, {
      idempotent: true, conflictCode: 'ANALYTICS_OBSERVATION_CONFLICT',
    }));
  }
  return {
    action: writes.every(({ action }) => action === 'kept') ? 'kept' : 'created',
    run_ref: run.id,
    observation_ref: observation.id,
    business_signal_ref: signal.id,
    evidence_ref: evidence.id,
    evidence_status: 'candidate',
    causal_claim: false,
    auto_approved: false,
  };
}
