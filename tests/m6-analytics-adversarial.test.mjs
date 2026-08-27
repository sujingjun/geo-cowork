import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import {
  computeBusinessSignal,
  computeSignalFromMetrics,
  ingestFixtureObservation,
  materializeObservationEvidence,
  validateFixtureAnalyticsInput,
} from '../plugins/geo-expert/scripts/lib/analytics-cycle.mjs';
import {
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  m6SchemaSamples,
  seedM6FreezeInputs,
  writeM6Object,
} from './helpers/m6-fixtures.mjs';
import {
  analyticsInput,
  capture,
  observationPlan,
  pathExists,
  signalPlan,
  treeDigest,
  writeJsonAt,
} from './helpers/m6-adversarial-fixtures.mjs';

test('P0: Analytics scalar values 中的 secret、phone、IP 必须按 policy fail closed', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    const values = [
      'api_key=abcdefghijklmnop',
      '+1 415 555 1212',
      '203.0.113.42',
    ];
    const outcomes = await Promise.all(values.map((value, index) => capture(() =>
      validateFixtureAnalyticsInput({
        workspace: root,
        input: analyticsInput({
          metrics: [{
            metric_id: `adversarial_metric_${index}`,
            value: 1,
            unit: 'count',
            dimensions: { note: value },
          }],
        }),
        policyPath: 'execution/contracts/sensitive-data-policy.json',
      }))));
    assert.deepEqual(
      outcomes.map((outcome) => !outcome.ok),
      [true, true, true],
      '禁止信息不能因字段名为 note 而绕过值扫描',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: 未被 freeze CIS pin 的弱 policy 不得写 raw 或 ANO', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const inputPath = 'fixtures/analytics/adversarial-secret.json';
    const policyPath = 'execution/contracts/weakened-policy.json';
    await writeJsonAt(root, inputPath, analyticsInput({
      metrics: [{
        metric_id: 'ai_visits',
        value: 1,
        unit: 'visits',
        dimensions: { note: 'api_key=abcdefghijklmnop' },
      }],
    }));
    await writeJsonAt(root, policyPath, {
      schema_version: 'm6-sensitive-data-policy/1.0.0',
      id: 'unfrozen-weakened-policy',
      version: '9.9.9',
      scope: 'test_only',
      allowed_fields: ['schema_version', 'time_window', 'metrics', 'metric_id', 'value', 'unit', 'dimensions'],
      forbidden_field_patterns: [],
      max_input_bytes: 1_000_000,
      unknown_binary: 'reject',
    });
    const plan = observationPlan({
      id: 'ANO-M6-WEAK-POLICY-001',
      inputPath,
      policyPath,
    });
    const before = await treeDigest(root);
    const outcome = await capture(() => ingestFixtureObservation({ workspace: root, plan }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
      raw_created: await pathExists(root, `runs/${plan.run_ref}/${plan.raw_output_path}`),
    }, {
      rejected: true,
      error_code: 'ANALYTICS_SENSITIVE_DATA_POLICY_REQUIRED',
      unchanged: true,
      raw_created: false,
    }, 'policy ID/version/bytes 必须来自 frozen CIS，而非任意调用方路径');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: measurement contract 未声明的 metric 必须在 raw 写入前拒绝', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const inputPath = 'fixtures/analytics/unknown-metric.json';
    await writeJsonAt(root, inputPath, analyticsInput({
      metrics: [{
        metric_id: 'uncontracted_revenue_metric',
        value: 42,
        unit: 'currency',
        dimensions: { source_group: 'synthetic_ai' },
      }],
    }));
    const plan = observationPlan({ id: 'ANO-M6-UNKNOWN-METRIC-001', inputPath });
    const before = await treeDigest(root);
    const outcome = await capture(() => ingestFixtureObservation({ workspace: root, plan }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'ANALYTICS_FIELD_NOT_ALLOWED',
      unchanged: true,
    });
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: unrelated negative metric 不得覆盖 rule 的 numerator/denominator', async () => {
  const result = computeSignalFromMetrics({
    input: analyticsInput({
      metrics: [
        { metric_id: 'ai_visits', value: 20, unit: 'visits', dimensions: {} },
        { metric_id: 'ai_registrations', value: 2, unit: 'registrations', dimensions: {} },
        { metric_id: 'unrelated_debug_delta', value: -99, unit: 'debug', dimensions: {} },
      ],
    }),
    rule: {
      numerator_metric_id: 'ai_registrations',
      denominator_metric_id: 'ai_visits',
    },
  });
  assert.deepEqual({
    denominator: result.denominator,
    calculation: result.calculation,
  }, {
    denominator: { definition: 'ai_visits', value: 20, state: 'known' },
    calculation: {
      value: 0.1,
      unit: 'registrations_per_visit',
      state: 'signal_observed',
      explanation: '2 / 20.',
    },
  });
});

test('P0: 所有 Observation versions 均须检查 status/scope/Goal，不得只消费第一项', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const observation = await ingestFixtureObservation({
      workspace: root,
      plan: observationPlan(),
    });
    const second = {
      ...m6SchemaSamples().analytics_observation,
      id: 'ANO-M6-SECOND-CROSS-GOAL-001',
      status: 'superseded',
      goal_ref: 'GOAL-M6-OTHER-001',
      run_ref: observation.data.run_ref,
      test_scope: { ...M6_TEST_SCOPE },
    };
    await writeM6Object(root, 'cycles/m6/analytics/ano-m6-second-cross-goal-001.md', second);
    const plan = signalPlan({
      observationVersions: [
        { ref: observation.data.id, version: observation.data.version },
        { ref: second.id, version: second.version },
      ],
    });
    const before = await treeDigest(root);
    const outcome = await capture(() => computeBusinessSignal({ workspace: root, plan }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'BUSINESS_SIGNAL_INPUT_DRIFT',
      unchanged: true,
    });
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: raw checksum、time window 与 Goal/Cycle 漂移必须阻止 Signal', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const observation = await ingestFixtureObservation({
      workspace: root,
      plan: observationPlan({ id: 'ANO-M6-RAW-DRIFT-001' }),
    });
    const rawRelative = `runs/${observation.data.run_ref}/${observation.data.artifacts[0].path}`;
    const raw = JSON.parse(await readFile(path.join(root, ...rawRelative.split('/')), 'utf8'));
    raw.time_window = {
      starts_at: '2030-01-01T00:00:00Z',
      ends_at: '2030-01-08T00:00:00Z',
      as_of: '2030-01-09T00:00:00Z',
    };
    raw.metrics[0].value = 999;
    await writeFile(path.join(root, ...rawRelative.split('/')), JSON.stringify(raw));
    const plan = signalPlan({
      id: 'BSIG-M6-RAW-DRIFT-001',
      observationVersions: [{ ref: observation.data.id, version: observation.data.version }],
      goalRef: 'GOAL-M6-OTHER-001',
      cycleRef: 'CYC-M6-OTHER-001',
    });
    const before = await treeDigest(root);
    const outcome = await capture(() => computeBusinessSignal({ workspace: root, plan }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'BUSINESS_SIGNAL_INPUT_DRIFT',
      unchanged: true,
    });
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: BSIG 永远不能作为 Observation materialize Evidence', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const signal = m6SchemaSamples().business_signal;
    await writeM6Object(root, 'cycles/m6/signals/bsig-m6-evidence-bypass.md', signal);
    const before = await treeDigest(root);
    const outcome = await capture(() => materializeObservationEvidence({
      workspace: root,
      plan: {
        evidence: {
          id: 'EVD-M6-BSIG-BYPASS-001',
          path: 'evidence/records/evd-m6-bsig-bypass-001.md',
        },
        observation_versions: [{ ref: signal.id, version: signal.version }],
        source_refs: ['SRC-M6-TEST-001'],
        claim_refs: ['CLM-M6-TEST-001'],
        snapshot_path: 'fixtures/analytics/complete.json',
        requested_status: 'candidate',
        test_scope: { ...M6_TEST_SCOPE },
      },
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'BUSINESS_SIGNAL_AS_EVIDENCE_FORBIDDEN',
      unchanged: true,
    });
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: superseded/cross-Goal Observation 与缺 Owner/Source/Claim closure 不得物化 Evidence', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const first = await ingestFixtureObservation({
      workspace: root,
      plan: observationPlan({ id: 'ANO-M6-EVIDENCE-FIRST-001' }),
    });
    const second = {
      ...first.data,
      id: 'ANO-M6-EVIDENCE-CROSS-GOAL-002',
      status: 'superseded',
      goal_ref: 'GOAL-M6-OTHER-001',
    };
    await writeM6Object(root, 'cycles/m6/analytics/ano-m6-evidence-cross-goal-002.md', second);
    const before = await treeDigest(root);
    const outcome = await capture(() => materializeObservationEvidence({
      workspace: root,
      plan: {
        evidence: {
          id: 'EVD-M6-INCOMPLETE-CLOSURE-001',
          path: 'evidence/records/evd-m6-incomplete-closure-001.md',
        },
        observation_versions: [
          { ref: first.data.id, version: first.data.version },
          { ref: second.id, version: second.version },
        ],
        source_refs: [],
        claim_refs: [],
        snapshot_path: 'execution/contracts/measurement-contract.json',
        requested_status: 'candidate',
        test_scope: { ...M6_TEST_SCOPE },
      },
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'EVIDENCE_MATERIALIZATION_INCOMPLETE',
      unchanged: true,
    }, 'Evidence plan 必须闭合所有 Observation、事实 Owner、授权、Source 与 Claim');
  } finally {
    await rm(root, { recursive: true });
  }
});
