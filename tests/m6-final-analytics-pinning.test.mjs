import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  computeBusinessSignal,
  ingestFixtureObservation,
} from '../plugins/geo-expert/scripts/lib/analytics-cycle.mjs';
import {
  createM6FrozenCycleWorkspace,
} from './helpers/m6-cycle-fixtures.mjs';
import {
  capture,
  observationPlan,
  signalPlan,
  treeDigest,
  writeJsonAt,
} from './helpers/m6-adversarial-fixtures.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('final QA P0: ANO measurement/policy tuple 必须精确引用 freeze CIS artifact entry', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const result = await ingestFixtureObservation({
      workspace: fixture.root,
      plan: observationPlan({ id: 'ANO-M6-FINAL-QA-PIN-001' }),
    });
    const measurement = fixture.snapshotPlan.artifact_entries
      .find((entry) => entry.role === 'measurement_contract');
    const policy = fixture.snapshotPlan.artifact_entries
      .find((entry) => entry.role === 'sensitive_data_policy');
    assert.deepEqual({
      measurement_entry_key: result.data.measurement_contract.artifact_entry_key,
      measurement_sha256: result.data.measurement_contract.sha256,
      policy_entry_key: result.data.sensitive_data_policy.artifact_entry_key,
      policy_sha256: result.data.sensitive_data_policy.sha256,
    }, {
      measurement_entry_key: measurement.entry_key,
      measurement_sha256: measurement.source_sha256,
      policy_entry_key: policy.entry_key,
      policy_sha256: policy.source_sha256,
    }, 'ANO 不得使用与 CIS entry 算法无关的自报 artifact key');
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: freeze 后弱化同 ID policy 仍须按 bytes drift/PII fail closed', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    await writeJsonAt(fixture.root, 'execution/contracts/sensitive-data-policy.json', {
      schema_version: 'm6-sensitive-data-policy/1.0.0',
      id: 'sensitive-data-policy-m6-fixture-v1',
      version: '1.0.0',
      scope: 'test_only',
      allowed_fields: [
        'schema_version', 'time_window', 'metrics', 'metric_id',
        'value', 'unit', 'dimensions',
      ],
      forbidden_field_patterns: [],
      max_input_bytes: 65_536,
      unknown_binary: 'reject',
    });
    await writeJsonAt(fixture.root, 'fixtures/analytics/final-qa-phone.json', {
      schema_version: 'm6-fixture-analytics/1.0.0',
      time_window: {
        starts_at: '2026-08-01T00:00:00Z',
        ends_at: '2026-08-08T00:00:00Z',
        as_of: '2026-08-09T00:00:00Z',
      },
      metrics: [{
        metric_id: 'ai_visits',
        value: 1,
        unit: 'visits',
        dimensions: { phone: '13800138000' },
      }],
    });
    const plan = observationPlan({
      id: 'ANO-M6-FINAL-QA-WEAK-POLICY-001',
      inputPath: 'fixtures/analytics/final-qa-phone.json',
    });
    const before = await treeDigest(fixture.root);
    const outcome = await capture(() => ingestFixtureObservation({
      workspace: fixture.root,
      plan,
    }));
    assert.equal(outcome.ok, false, 'freeze 后 policy bytes 变化不得继续 ingest');
    assert.ok(
      [
        'ANALYTICS_SENSITIVE_DATA_POLICY_REQUIRED',
        'CYCLE_VERSION_DRIFT',
        'ANALYTICS_PII_DETECTED',
      ].includes(outcome.error?.code),
      `应返回 policy pin/PII 错误，实际为 ${outcome.error?.code ?? 'success'}`,
    );
    assert.equal(
      await treeDigest(fixture.root),
      before,
      'policy drift/PII 失败后不得留下 raw 或 ANO',
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: BSIG measurement/rule tuple 必须精确引用 freeze CIS artifact entry', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const observation = await ingestFixtureObservation({
      workspace: fixture.root,
      plan: observationPlan({ id: 'ANO-M6-FINAL-QA-SIGNAL-PIN-001' }),
    });
    const result = await computeBusinessSignal({
      workspace: fixture.root,
      plan: signalPlan({
        id: 'BSIG-M6-FINAL-QA-PIN-001',
        observationVersions: [{ ref: observation.data.id, version: observation.data.version }],
      }),
    });
    const measurement = fixture.snapshotPlan.artifact_entries
      .find((entry) => entry.role === 'measurement_contract');
    const rule = fixture.snapshotPlan.artifact_entries
      .find((entry) => entry.role === 'signal_rule');
    assert.deepEqual({
      measurement_entry_key: result.data.measurement_contract.artifact_entry_key,
      measurement_sha256: result.data.measurement_contract.sha256,
      rule_entry_key: result.data.rule.artifact_entry_key,
      rule_sha256: result.data.rule.sha256,
    }, {
      measurement_entry_key: measurement.entry_key,
      measurement_sha256: measurement.source_sha256,
      rule_entry_key: rule.entry_key,
      rule_sha256: rule.source_sha256,
    }, 'BSIG measurement/rule 必须来自同一 freeze CIS tuple 与 snapshot bytes');
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: freeze 后同 ID/version Signal Rule 漂移必须零写失败', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const observation = await ingestFixtureObservation({
      workspace: fixture.root,
      plan: observationPlan({ id: 'ANO-M6-FINAL-QA-RULE-DRIFT-001' }),
    });
    await writeJsonAt(fixture.root, 'execution/contracts/signal-rule.json', {
      schema_version: 'm6-signal-rule/1.0.0',
      id: 'signal-rule-m6-fixture-v1',
      version: '1.0.0',
      scope: 'test_only',
      signal_kind: 'ai_registration',
      numerator_metric_id: 'ai_visits',
      denominator_metric_id: 'ai_registrations',
      calculation: 'numerator / denominator',
      causal_claim: false,
    });
    const plan = signalPlan({
      id: 'BSIG-M6-FINAL-QA-RULE-DRIFT-001',
      observationVersions: [{ ref: observation.data.id, version: observation.data.version }],
    });
    assert.equal(plan.rule_sha256, undefined, '攻击不得依赖调用方提供 optional rule sha');
    const before = await treeDigest(fixture.root);
    const outcome = await capture(() => computeBusinessSignal({
      workspace: fixture.root,
      plan,
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(fixture.root) === before,
    }, {
      rejected: true,
      error_code: 'BUSINESS_SIGNAL_INPUT_DRIFT',
      unchanged: true,
    }, '冻结后的 Rule bytes 不能通过相同 ID/version 或缺 optional sha 绕过');
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: public Analytics 不得按 fixture policy ID 特判合法性', async () => {
  const source = await readFile(path.join(
    REPO_ROOT,
    'plugins/geo-expert/scripts/lib/analytics-cycle.mjs',
  ), 'utf8');
  assert.equal(
    source.includes("policy.id !== 'sensitive-data-policy-m6-fixture-v1'"),
    false,
    '合法性必须来自 Cycle freeze CIS tuple/bytes，而不是 canonical fixture ID',
  );
});
