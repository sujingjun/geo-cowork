import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';

import {
  M6_APPROVAL,
  M6_CYCLE_ID,
  M6_MERCHANT_ID,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  readM6FixtureJson,
  seedM6FreezeInputs,
} from './helpers/m6-fixtures.mjs';

async function analyticsApi() {
  return import('../plugins/geo-expert/scripts/lib/analytics-cycle.mjs');
}

function observationPlan({
  id = 'ANO-M6-TEST-001',
  input = 'fixtures/analytics/complete.json',
} = {}) {
  return {
    schema_version: 'm6-analytics-observation-plan/1.0.0',
    observation: { id, path: `cycles/m6/analytics/${id.toLowerCase()}.md` },
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: M6_CYCLE_ID,
    goal_ref: 'GOAL-M6-TEST-001',
    run_ref: 'RUN-M6-ANALYTICS-001',
    adapter: {
      kind: 'fixture',
      name: 'm6-fixture',
      version: '1.0.0',
      access_mode: 'fixture',
      authorization_ref: 'fixture://authorization/m6-analytics-001',
    },
    input_path: input,
    raw_output_path: `raw/analytics/${id.toLowerCase()}.json`,
    measurement_contract_path: 'execution/contracts/measurement-contract.json',
    signal_rule_path: 'execution/contracts/signal-rule.json',
    sensitive_data_policy_path: 'execution/contracts/sensitive-data-policy.json',
    test_scope: { ...M6_TEST_SCOPE },
  };
}

test('Analytics fixtures 覆盖 signal、no-signal、partial、zero denominator、negative 与 PII', async () => {
  const fixtures = await Promise.all([
    'complete.json', 'no-signal.json', 'partial.json', 'zero-denominator.json',
    'negative.json', 'forbidden-pii.json',
  ].map((name) => readM6FixtureJson(`analytics/${name}`)));
  assert.deepEqual(fixtures.slice(0, 2).map((fixture) => fixture.metrics[1].value), [2, 0]);
  assert.equal(fixtures[2].metrics[0].value, null);
  assert.equal(fixtures[3].metrics[0].value, 0);
  assert.equal(fixtures[4].metrics[0].value < 0, true);
  assert.equal(typeof fixtures[5].metrics[0].dimensions.email, 'string');
  for (const fixture of fixtures) assert.equal(fixture.schema_version, 'm6-fixture-analytics/1.0.0');
});

test('fixture policy 允许聚合字段，拒绝 nested PII、secret marker、未知字段和不可扫描 binary', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { validateFixtureAnalyticsInput } = await analyticsApi();
    const valid = await validateFixtureAnalyticsInput({
      workspace: root,
      inputPath: 'fixtures/analytics/complete.json',
      policyPath: 'execution/contracts/sensitive-data-policy.json',
    });
    assert.equal(valid.ok, true);
    for (const [input, code] of [
      ['fixtures/analytics/forbidden-pii.json', 'ANALYTICS_PII_DETECTED'],
      [{ metrics: [{ dimensions: { nested: { access_token: '[REDACTED_TEST_SECRET]' } } }] }, 'ANALYTICS_FIELD_NOT_ALLOWED'],
      [{ unexpected_payload: true }, 'ANALYTICS_FIELD_NOT_ALLOWED'],
      [Buffer.from([0, 255, 1, 2]), 'ANALYTICS_FIELD_NOT_ALLOWED'],
    ]) {
      await assert.rejects(
        validateFixtureAnalyticsInput({
          workspace: root,
          input: typeof input === 'string' ? undefined : input,
          inputPath: typeof input === 'string' ? input : undefined,
          policyPath: 'execution/contracts/sensitive-data-policy.json',
        }),
        (error) => error.code === code,
      );
    }
  } finally {
    await rm(root, { recursive: true });
  }
});

test('ingest-fixture 只创建 causal_claim:false ANO，raw artifact create-only 且 partial/unavailable 明示', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { ingestFixtureObservation } = await analyticsApi();
    const complete = await ingestFixtureObservation({ workspace: root, plan: observationPlan() });
    assert.equal(complete.data.record_type, 'analytics_observation');
    assert.equal(complete.data.status, 'recorded');
    assert.equal(complete.data.adapter.kind, 'fixture');
    assert.equal(complete.data.adapter.access_mode, 'fixture');
    assert.equal(complete.data.causal_claim, false);
    assert.equal(complete.data.quality.completeness, 'complete');

    const partial = await ingestFixtureObservation({
      workspace: root,
      plan: observationPlan({
        id: 'ANO-M6-TEST-PARTIAL-001',
        input: 'fixtures/analytics/partial.json',
      }),
    });
    assert.equal(partial.data.quality.completeness, 'partial');
    assert.ok(partial.data.metrics.some((metric) =>
      metric.state === 'partial' || metric.state === 'unavailable'));

    const kept = await ingestFixtureObservation({ workspace: root, plan: observationPlan() });
    assert.equal(kept.action, 'kept');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('Business Signal 对 signal/no_signal/insufficient_data/negative 使用确定性 denominator 语义', async () => {
  const { computeSignalFromMetrics } = await analyticsApi();
  const cases = [
    ['complete.json', { state: 'signal_observed', value: 0.1, denominator: 'known' }],
    ['no-signal.json', { state: 'no_signal', value: 0, denominator: 'known' }],
    ['partial.json', { state: 'insufficient_data', value: null, denominator: 'unknown' }],
    ['zero-denominator.json', { state: 'insufficient_data', value: null, denominator: 'zero' }],
    ['negative.json', { state: 'negative', value: -3, denominator: 'not_applicable' }],
  ];
  const rule = await readM6FixtureJson('contracts/signal-rule.json');
  for (const [fixtureName, expected] of cases) {
    const input = await readM6FixtureJson(`analytics/${fixtureName}`);
    const signal = computeSignalFromMetrics({ input, rule });
    assert.equal(signal.calculation.state, expected.state, fixtureName);
    assert.equal(signal.calculation.value, expected.value, fixtureName);
    assert.equal(signal.denominator.state, expected.denominator, fixtureName);
    assert.equal(signal.causal_claim, false);
  }
});

test('compute-signals version-pin ANO/measurement/rule，规则漂移不覆盖旧 BSIG', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { computeBusinessSignal, ingestFixtureObservation } = await analyticsApi();
    await ingestFixtureObservation({ workspace: root, plan: observationPlan() });
    const plan = {
      schema_version: 'm6-business-signal-plan/1.0.0',
      signal: { id: 'BSIG-M6-TEST-001', path: 'cycles/m6/signals/bsig-m6-test-001.md' },
      merchant_ref: M6_MERCHANT_ID,
      cycle_ref: M6_CYCLE_ID,
      goal_ref: 'GOAL-M6-TEST-001',
      run_ref: 'RUN-M6-ANALYTICS-001',
      observation_versions: [{ ref: 'ANO-M6-TEST-001', version: '1.0.0' }],
      measurement_contract_path: 'execution/contracts/measurement-contract.json',
      rule_path: 'execution/contracts/signal-rule.json',
      test_scope: { ...M6_TEST_SCOPE },
    };
    const first = await computeBusinessSignal({ workspace: root, plan });
    assert.equal(first.data.record_type, 'business_signal');
    assert.equal(first.data.causal_claim, false);
    await assert.rejects(
      computeBusinessSignal({
        workspace: root,
        plan: { ...plan, rule_sha256: 'f'.repeat(64) },
      }),
      (error) => error.code === 'BUSINESS_SIGNAL_INPUT_DRIFT',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('ANO/BSIG 永远不能进入 claim.evidence_refs 或被当作 Evidence', async () => {
  const { assertEvidenceRefsDoNotUseAnalytics } = await analyticsApi();
  for (const ref of ['ANO-M6-TEST-001', 'BSIG-M6-TEST-001']) {
    assert.throws(
      () => assertEvidenceRefsDoNotUseAnalytics([ref]),
      (error) => error.code === (ref.startsWith('ANO-')
        ? 'OBSERVATION_AS_EVIDENCE_FORBIDDEN'
        : 'BUSINESS_SIGNAL_AS_EVIDENCE_FORBIDDEN'),
    );
  }
});

test('Observation → Evidence 使用独立新 EVD、初始 candidate、精确版本与 fixture approval 分离', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const { ingestFixtureObservation, materializeObservationEvidence } = await analyticsApi();
    await ingestFixtureObservation({ workspace: root, plan: observationPlan() });
    const plan = {
      schema_version: 'm6-observation-evidence-plan/1.0.0',
      evidence: { id: 'EVD-M6-ANALYTICS-001', path: 'evidence/records/evd-m6-analytics-001.md' },
      observation_versions: [{ ref: 'ANO-M6-TEST-001', version: '1.0.0' }],
      source_refs: ['SRC-M6-TEST-001'],
      claim_refs: ['CLM-M6-TEST-001'],
      snapshot_path: 'runs/RUN-M6-ANALYTICS-001/raw/analytics/ano-m6-test-001.json',
      decision_ref: M6_APPROVAL.decision_ref,
      requested_status: 'candidate',
      test_scope: { ...M6_TEST_SCOPE },
    };
    const result = await materializeObservationEvidence({ workspace: root, plan });
    assert.equal(result.data.id, 'EVD-M6-ANALYTICS-001');
    assert.equal(result.data.status, 'candidate');
    assert.deepEqual(result.data.observation_versions, plan.observation_versions);
    assert.equal(result.data.approval, undefined);
    await assert.rejects(
      materializeObservationEvidence({
        workspace: root,
        plan: { ...plan, evidence: { id: 'EVD-M6-ANALYTICS-002' }, requested_status: 'approved' },
      }),
      (error) => error.code === 'EVIDENCE_MATERIALIZATION_INCOMPLETE',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});
