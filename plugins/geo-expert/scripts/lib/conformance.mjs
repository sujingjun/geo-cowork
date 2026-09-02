const REQUIRED_KEYS = new Set([
  'codex:packaging_static:packaging',
  'codex:direct_shared_tool:shared_tool',
  'claude_code:packaging_static:packaging',
  'claude_code:direct_shared_tool:shared_tool',
  'workbuddy_cn:test_only_semantic_fixture:shared_tool',
]);

export class ConformanceError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ConformanceError';
    this.code = code;
    Object.assign(this, details);
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

function validateProfile(profile) {
  if (profile?.schema_version !== 'cross-host-conformance/1.0.0'
      || !Array.isArray(profile.required_executions)
      || !Array.isArray(profile.optional_executions)) {
    throw new ConformanceError('CONFORMANCE_PROFILE_INVALID', 'Conformance profile invalid');
  }
  const keys = profile.required_executions.map(({ execution_key: key }) => key);
  if (keys.length !== REQUIRED_KEYS.size
      || new Set(keys).size !== keys.length
      || [...REQUIRED_KEYS].some((key) => !keys.includes(key))) {
    throw new ConformanceError('CONFORMANCE_PROFILE_INVALID', 'Required execution keys are not exact');
  }
}

function assertWorkBuddyBoundary(run) {
  const boundary = run.host_boundary;
  if (!boundary
      || boundary.native_adapter_present !== false
      || boundary.native_host_verified !== false
      || boundary.packaging_contract_available !== false
      || boundary.native_packaging_conformance_applicable !== false) {
    throw new ConformanceError(
      'CONFORMANCE_CAPABILITY_UNSUPPORTED',
      'WorkBuddy boundary must remain explicitly unsupported for native packaging',
    );
  }
}

export function evaluateConformance({ profile, outputs }) {
  validateProfile(profile);
  if (!outputs || typeof outputs !== 'object' || containsSensitive(outputs)) {
    throw new ConformanceError('CONFORMANCE_SENSITIVE_OUTPUT', 'Conformance output contains sensitive data');
  }
  const hostRuns = [];
  for (const execution of profile.required_executions) {
    const output = outputs[execution.execution_key];
    if (!output || output.status === 'unsupported') {
      throw new ConformanceError(
        'CONFORMANCE_CAPABILITY_UNSUPPORTED',
        `Required execution unsupported: ${execution.execution_key}`,
      );
    }
    if (output.status !== 'passed' || !/^[a-f0-9]{64}$/.test(output.normalized_digest ?? '')) {
      throw new ConformanceError(
        'CONFORMANCE_REQUIRED_FAILED',
        `Required execution failed: ${execution.execution_key}`,
      );
    }
    const run = { ...execution, ...output };
    if (execution.host === 'workbuddy_cn') assertWorkBuddyBoundary(run);
    hostRuns.push(run);
  }
  const digests = new Set(hostRuns.map(({ normalized_digest: digest }) => digest));
  if (digests.size !== 1) {
    throw new ConformanceError(
      'CONFORMANCE_OUTPUT_MISMATCH',
      'Comparable normalized output digests differ',
      { execution_keys: hostRuns.map(({ execution_key: key }) => key) },
    );
  }
  const optionalRuns = profile.optional_executions.map((execution) => ({
    ...execution,
    status: 'not_executed',
  }));
  return {
    schema_version: 'cross-host-conformance-result/1.0.0',
    status: 'passed',
    merchant_ref: profile.merchant_ref,
    knowledge_base_ref: profile.knowledge_base_ref,
    required_passed: true,
    normalized_digest: hostRuns[0].normalized_digest,
    host_runs: hostRuns,
    optional_runs: optionalRuns,
    limitations: [
      'Native interactive host checks were not required.',
      'WorkBuddy China native packaging and native host execution were not verified.',
      'This result is test-only engineering conformance, not production or business evidence.',
    ],
  };
}

export { REQUIRED_KEYS };
