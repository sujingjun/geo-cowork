import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { evaluateConformance } from '../plugins/geo-expert/scripts/lib/conformance.mjs';
import { runConformance } from '../plugins/geo-expert/scripts/geo-conformance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const profile = {
  schema_version: 'cross-host-conformance/1.0.0',
  merchant_ref: 'MER-MYYSHOP-001',
  knowledge_base_ref: 'KBASE-MYYSHOP-DEVTEST-001',
  required_executions: [
    { host: 'codex', mode: 'packaging_static', execution_key: 'codex:packaging_static:packaging' },
    { host: 'codex', mode: 'direct_shared_tool', execution_key: 'codex:direct_shared_tool:shared_tool' },
    { host: 'claude_code', mode: 'packaging_static', execution_key: 'claude_code:packaging_static:packaging' },
    { host: 'claude_code', mode: 'direct_shared_tool', execution_key: 'claude_code:direct_shared_tool:shared_tool' },
    { host: 'workbuddy_cn', mode: 'test_only_semantic_fixture', execution_key: 'workbuddy_cn:test_only_semantic_fixture:shared_tool' },
  ],
  optional_executions: [
    { host: 'codex', mode: 'native_interactive' },
    { host: 'claude_code', mode: 'native_interactive' },
    { host: 'workbuddy_cn', mode: 'manual_configuration_check' },
  ],
};

function outputs(overrides = {}) {
  const digest = 'a'.repeat(64);
  return Object.fromEntries(profile.required_executions.map((execution) => [
    execution.execution_key,
    {
      status: 'passed',
      normalized_digest: digest,
      diagnostics: [],
      host_boundary: execution.host === 'workbuddy_cn' ? {
        native_adapter_present: false,
        native_host_verified: false,
        packaging_contract_available: false,
        native_packaging_conformance_applicable: false,
      } : undefined,
      ...overrides[execution.execution_key],
    },
  ]));
}

test('M8 required tiers 一致通过，optional 保持 not_executed', () => {
  const result = evaluateConformance({ profile, outputs: outputs() });
  assert.equal(result.status, 'passed');
  assert.equal(result.required_passed, true);
  assert.ok(result.optional_runs.every((run) => run.status === 'not_executed'));
  const workbuddy = result.host_runs.find((run) => run.host === 'workbuddy_cn');
  assert.equal(workbuddy.host_boundary.native_host_verified, false);
});

test('M8 输出不一致与 unsupported required execution 必须 fail loud', () => {
  assert.throws(
    () => evaluateConformance({
      profile,
      outputs: outputs({
        'claude_code:direct_shared_tool:shared_tool': { normalized_digest: 'b'.repeat(64) },
      }),
    }),
    (error) => error.code === 'CONFORMANCE_OUTPUT_MISMATCH',
  );
  assert.throws(
    () => evaluateConformance({
      profile,
      outputs: outputs({
        'codex:packaging_static:packaging': { status: 'unsupported' },
      }),
    }),
    (error) => error.code === 'CONFORMANCE_CAPABILITY_UNSUPPORTED',
  );
});

test('M8 profile 缺 required key、WorkBuddy boundary 冒充 native 均失败', () => {
  assert.throws(
    () => evaluateConformance({
      profile: { ...profile, required_executions: profile.required_executions.slice(1) },
      outputs: outputs(),
    }),
    (error) => error.code === 'CONFORMANCE_PROFILE_INVALID',
  );
  assert.throws(
    () => evaluateConformance({
      profile,
      outputs: outputs({
        'workbuddy_cn:test_only_semantic_fixture:shared_tool': {
          host_boundary: {
            native_adapter_present: false,
            native_host_verified: true,
            packaging_contract_available: false,
            native_packaging_conformance_applicable: false,
          },
        },
      }),
    }),
    (error) => error.code === 'CONFORMANCE_CAPABILITY_UNSUPPORTED',
  );
});

test('M8 任一 host output 含 PII 时在比较前失败', () => {
  assert.throws(
    () => evaluateConformance({
      profile,
      outputs: outputs({
        'codex:direct_shared_tool:shared_tool': { diagnostics: ['user@example.com'] },
      }),
    }),
    (error) => error.code === 'CONFORMANCE_SENSITIVE_OUTPUT',
  );
});

test('M8 实际检查两套 packaging、shared Tool 与 WorkBuddy semantic fixture', async () => {
  const result = await runConformance({
    workspace: path.join(ROOT, 'workspaces/myyshop-development-test'),
    profilePath: path.join(ROOT, 'workspaces/myyshop-development-test/execution/conformance/profile.json'),
  });
  assert.equal(result.required_passed, true);
  assert.equal(result.host_runs.length, 5);
  assert.equal(result.normalized.content_gap_inferred, false);
});
