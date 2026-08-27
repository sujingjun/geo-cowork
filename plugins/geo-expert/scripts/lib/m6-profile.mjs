const M6_NEW_TYPES = new Set([
  'test_merchant',
  'cycle_input_snapshot',
  'cycle_transition',
  'analytics_observation',
  'business_signal',
  'cycle_review',
]);

const M6_RUN_SKILLS = new Set(['geo-lifecycle', 'geo-analytics']);

function missing(data, field) {
  const value = data[field];
  return value === undefined || value === null
    || typeof value === 'string' && value.trim() === ''
    || Array.isArray(value) && value.length === 0;
}

function absent(data, field) {
  const value = data[field];
  return value === undefined || value === null
    || typeof value === 'string' && value.trim() === '';
}

function addError(errors, code, object, details = {}) {
  errors.push({
    code,
    id: object.data?.id,
    path: object.path ?? '<memory>',
    ...details,
  });
}

function requireFields(errors, object, fields, code = 'M6_FIELD_REQUIRED') {
  for (const field of fields) {
    if (missing(object.data, field)) addError(errors, code, object, { field });
  }
}

function validateTestScope(object, errors) {
  const scope = object.data.test_scope;
  if (!scope
      || scope.kind !== 'synthetic'
      || scope.usage !== 'test_only'
      || typeof scope.merchant_ref !== 'string'
      || typeof scope.workspace_id !== 'string') {
    addError(errors, 'TEST_MERCHANT_SCOPE_REQUIRED', object, { field: 'test_scope' });
  }
}

function validateCycle(object, errors) {
  requireFields(errors, object, [
    'test_scope', 'scope', 'merchant_ref', 'cycle_number', 'core_versions',
    'aggregate_stage', 'completion_scope', 'goal_tracks',
  ]);
  if (!Array.isArray(object.data.transition_refs)) {
    addError(errors, 'M6_FIELD_REQUIRED', object, { field: 'transition_refs' });
  }
  if (object.data.scope !== 'test_merchant_engineering') {
    addError(errors, 'M6_FIELD_REQUIRED', object, { field: 'scope' });
  }
  if (!object.data.core_versions?.input_snapshot?.ref
      || !object.data.core_versions?.input_snapshot?.version) {
    addError(errors, 'M6_FIELD_REQUIRED', object, { field: 'core_versions.input_snapshot' });
  }
}

function validateEvidence(object, errors) {
  if (!('observation_versions' in object.data)) return;
  requireFields(errors, object, ['test_scope', 'observation_versions']);
}

function validateRun(object, errors) {
  if (!M6_RUN_SKILLS.has(object.data.skill)) return;
  requireFields(errors, object, [
    'test_scope', 'merchant_ref', 'cycle_ref', 'cycle_version',
    'transition_plan_sha256', 'lease',
  ]);
  const lease = object.data.lease;
  if (lease) {
    for (const field of [
      'scope_key', 'owner_id', 'revision', 'acquired_at', 'heartbeat_at', 'expires_at',
    ]) {
      if (missing(lease, field)) addError(errors, 'M6_FIELD_REQUIRED', object, { field: `lease.${field}` });
    }
  }
}

export function isM6Object(data) {
  return M6_NEW_TYPES.has(data.record_type)
    || data.record_type === 'cycle' && data.scope === 'test_merchant_engineering'
    || data.record_type === 'evidence' && 'observation_versions' in data
    || data.record_type === 'run' && M6_RUN_SKILLS.has(data.skill);
}

export function validateM6Object(object, { testWorkspace = false } = {}) {
  const errors = [];
  const warnings = [];
  const data = object.data ?? {};
  if (testWorkspace || isM6Object(data)) validateTestScope(object, errors);

  if (data.record_type === 'cycle' && data.scope === 'test_merchant_engineering') {
    validateCycle(object, errors);
  } else if (data.record_type === 'evidence') {
    validateEvidence(object, errors);
  } else if (data.record_type === 'run') {
    validateRun(object, errors);
  } else if (M6_NEW_TYPES.has(data.record_type)) {
    const requiredByType = {
      test_merchant: [
        'workspace_id', 'workspace_namespace', 'display_name', 'identity',
        'provenance', 'real_workspace_forbidden',
      ],
      cycle_input_snapshot: [
        'merchant_ref', 'cycle_ref', 'snapshot_kind', 'manifest',
        'source_entries', 'artifact_entries', 'run_ref',
      ],
      cycle_transition: [
        'cycle_ref', 'operation_id', 'operation_fingerprint', 'expected_cycle_version',
        'input_snapshot_version', 'gate_snapshot_version', 'from_status', 'to_status',
        'from_stage', 'to_stage', 'required_gate_entry_keys', 'lease_revision', 'actor',
      ],
      analytics_observation: [
        'merchant_ref', 'cycle_ref', 'goal_ref', 'run_ref', 'adapter',
        'measurement_contract', 'sensitive_data_policy', 'time_window', 'metrics',
        'artifacts', 'quality', 'causal_claim',
      ],
      business_signal: [
        'merchant_ref', 'cycle_ref', 'goal_ref', 'run_ref', 'observation_versions',
        'measurement_contract', 'rule', 'signal_kind', 'denominator', 'calculation',
        'causal_claim',
      ],
      cycle_review: [
        'merchant_ref', 'cycle_ref', 'reviewed_cycle_input_version',
        'review_input_snapshot_version', 'review_input_fingerprint', 'goal_results',
      ],
    };
    requireFields(errors, object, requiredByType[data.record_type] ?? []);
    if (data.record_type === 'cycle_review' && absent(data, 'next_cycle_candidate_inputs')) {
      addError(errors, 'M6_FIELD_REQUIRED', object, { field: 'next_cycle_candidate_inputs' });
    }
  }
  return { errors, warnings };
}
