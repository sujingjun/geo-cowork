import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  M6_CYCLE_ID,
  createM6FixtureWorkspace,
  readM6FixtureJson,
} from './helpers/m6-fixtures.mjs';
import { materializeM6E2EGates } from './helpers/m6-e2e-fixtures.mjs';
import {
  createM6FrozenCycleWorkspace,
  m6CycleData,
  m6GoalTrack,
} from './helpers/m6-cycle-fixtures.mjs';

const exec = promisify(execFile);

async function lifecycleApi() {
  return import('../plugins/geo-expert/scripts/lib/cycle-lifecycle.mjs');
}

async function lockApi() {
  return import('../plugins/geo-expert/scripts/lib/cycle-lock.mjs');
}

function transitionPlan(overrides = {}) {
  return {
    schema_version: 'm6-cycle-transition-plan/1.0.0',
    operation_id: 'op-m6-baseline-recorded-001',
    operation_fingerprint: 'a'.repeat(64),
    transition_id: 'CTR-M6-TEST-BASELINE-001',
    gate_snapshot_id: 'CIS-M6-TEST-GATE-001',
    cycle_ref: M6_CYCLE_ID,
    goal_entry_key: '1'.repeat(64),
    expected_cycle_version: '1.0.0',
    from_stage: 'frozen',
    to_stage: 'baseline_recorded',
    actor: { kind: 'deterministic_tool' },
    lease: {
      owner_id: 'transition-test-owner',
      now: '2026-08-27T00:00:00Z',
      ttl_ms: 60_000,
    },
    gate: {
      source_paths: ['cycles/preparation/goal.md'],
      artifact_paths: ['execution/contracts/measurement-contract.json'],
    },
    ...overrides,
  };
}

async function legalBaselinePlan(fixture, overrides = {}) {
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  const gates = await materializeM6E2EGates(fixture.root, bundle);
  return transitionPlan({
    goal_entry_key: fixture.cycle.goal_tracks[0].goal_entry_key,
    gate: {
      source_paths: gates.byGate.baseline.map((object) => object.path),
      artifact_paths: ['execution/contracts/measurement-contract.json'],
    },
    ...overrides,
  });
}

test('multi-goal fixture 明确每个 track 独立，aggregate 只可派生不直接推进其他 Goal', () => {
  const cycle = m6CycleData({
    status: 'waiting_human',
    tracks: [
      m6GoalTrack({ suffix: '001', stage: 'diagnosis_ready' }),
      m6GoalTrack({ suffix: '002', stage: 'baseline_recorded' }),
    ],
    aggregateStage: 'mixed',
  });
  assert.deepEqual(cycle.goal_tracks.map((track) => track.stage), [
    'diagnosis_ready', 'baseline_recorded',
  ]);
  assert.equal(cycle.aggregate_stage, 'mixed');
  assert.equal(cycle.status, 'waiting_human');
  assert.notEqual(cycle.goal_tracks[0].goal_entry_key, cycle.goal_tracks[1].goal_entry_key);
});

test('Cycle aggregate 覆盖 prepared、waiting、completed/full、cancelled 与 terminal partial', async () => {
  const { deriveCycleSummary } = await lifecycleApi();
  const cases = [
    [['prepared', 'prepared'], { status: 'proposed', aggregate_stage: 'prepared', completion_scope: 'none' }],
    [['diagnosis_ready', 'baseline_recorded'], { status: 'waiting_human', aggregate_stage: 'mixed', completion_scope: 'none' }],
    [['review_decided', 'review_decided'], { status: 'completed', aggregate_stage: 'review_decided', completion_scope: 'full' }],
    [['cancelled_no_adoption', 'cancelled_no_adoption'], {
      status: 'cancelled', aggregate_stage: 'cancelled_no_adoption', completion_scope: 'none',
    }],
    [['review_decided', 'cancelled_no_adoption'], {
      status: 'completed', aggregate_stage: 'mixed', completion_scope: 'partial',
    }],
  ];
  for (const [stages, expected] of cases) {
    assert.deepEqual(deriveCycleSummary(stages.map((stage, index) =>
      m6GoalTrack({ suffix: index === 0 ? '001' : '002', stage }))), expected);
  }
});

test('非法跳阶段、倒退、terminal 继续与跨 Goal gate 均在任何写入前失败', async () => {
  const { validateCycleAdvance } = await lifecycleApi();
  for (const [from, to, code] of [
    ['frozen', 'publication_confirmed', 'INVALID_CYCLE_TRANSITION'],
    ['analytics_recorded', 'baseline_recorded', 'INVALID_CYCLE_TRANSITION'],
    ['review_decided', 'analytics_recorded', 'INVALID_CYCLE_TRANSITION'],
  ]) {
    assert.throws(
      () => validateCycleAdvance({
        cycle: m6CycleData({
          status: from === 'review_decided' ? 'completed' : 'active',
          tracks: [m6GoalTrack({ stage: from }), m6GoalTrack({ suffix: '002', stage: 'prepared' })],
          aggregateStage: 'mixed',
        }),
        goalEntryKey: '1'.repeat(64),
        fromStage: from,
        toStage: to,
        gateGoalEntryKey: '2'.repeat(64),
      }),
      (error) => error.code === code || error.code === 'CYCLE_GATE_REQUIRED',
    );
  }
});

test('advance 先预检与 exclusive lock，再持久化 transition CIS 和 CAS', async () => {
  const { root, cycle } = await createM6FrozenCycleWorkspace();
  try {
    const { advanceCycle } = await lifecycleApi();
    const plan = await legalBaselinePlan({ root, cycle });
    const result = await advanceCycle({
      workspace: root,
      plan,
    });
    assert.equal(result.applied, true);
    assert.ok(result.steps.indexOf('lock_acquired') < result.steps.indexOf('gate_snapshot_written'));
    assert.ok(result.steps.indexOf('gate_snapshot_written') < result.steps.indexOf('transition_intent_written'));
    assert.ok(result.steps.indexOf('lock_acquired') < result.steps.indexOf('cas_applied'));
    assert.equal(result.transition_id, 'CTR-M6-TEST-BASELINE-001');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('expected Cycle version 不匹配时 CTR 不 applied，Cycle bytes 不变', async () => {
  const { root, cycle } = await createM6FrozenCycleWorkspace();
  try {
    const cyclePath = path.join(root, 'cycles/m6/cycle.md');
    const before = await readFile(cyclePath).catch(() => null);
    const { advanceCycle } = await lifecycleApi();
    await assert.rejects(
      advanceCycle({
        workspace: root,
        plan: transitionPlan({
          goal_entry_key: cycle.goal_tracks[0].goal_entry_key,
          expected_cycle_version: '9.9.9',
        }),
      }),
      (error) => error.code === 'CYCLE_CAS_MISMATCH',
    );
    const after = await readFile(cyclePath).catch(() => null);
    assert.deepEqual(after, before);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('同 operation/fingerprint 幂等 kept；同 operation 不同 fingerprint 冲突', async () => {
  const { root, cycle } = await createM6FrozenCycleWorkspace();
  try {
    const { advanceCycle } = await lifecycleApi();
    const plan = await legalBaselinePlan({ root, cycle });
    const first = await advanceCycle({ workspace: root, plan });
    const second = await advanceCycle({ workspace: root, plan });
    assert.equal(first.transition_id, second.transition_id);
    assert.equal(second.action, 'kept');
    await assert.rejects(
      advanceCycle({
        workspace: root,
        plan: transitionPlan({
          goal_entry_key: cycle.goal_tracks[0].goal_entry_key,
          operation_fingerprint: 'b'.repeat(64),
        }),
      }),
      (error) => error.code === 'TRANSITION_CONFLICT',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('CTR orphan intent 不计 applied；同输入 resume 附加，版本漂移新 CTR supersede 旧 intent', async () => {
  const { advanceCycle, resumeCycleTransition } = await lifecycleApi();
  const sameInput = await createM6FrozenCycleWorkspace();
  try {
    const samePlan = await legalBaselinePlan(sameInput, {
      fault_after: 'transition_intent_written',
    });
    await assert.rejects(
      advanceCycle({
        workspace: sameInput.root,
        plan: samePlan,
      }),
      (error) => error.code === 'FAULT_INJECTED' && error.transition_applied === false,
    );
    const resumed = await resumeCycleTransition({
      workspace: sameInput.root,
      cycleId: M6_CYCLE_ID,
      operationId: 'op-m6-baseline-recorded-001',
      expectedCycleVersion: '1.0.0',
    });
    assert.equal(resumed.action, 'applied_existing_intent');
  } finally {
    await rm(sameInput.root, { recursive: true });
  }

  const driftedInput = await createM6FrozenCycleWorkspace();
  try {
    const driftedPlan = await legalBaselinePlan(driftedInput, {
      fault_after: 'transition_intent_written',
    });
    await assert.rejects(
      advanceCycle({
        workspace: driftedInput.root,
        plan: driftedPlan,
      }),
      (error) => error.code === 'FAULT_INJECTED' && error.transition_applied === false,
    );
    const drifted = await resumeCycleTransition({
      workspace: driftedInput.root,
      cycleId: M6_CYCLE_ID,
      operationId: 'op-m6-baseline-recorded-001',
      expectedCycleVersion: '2.0.0',
      replacementTransitionId: 'CTR-M6-TEST-BASELINE-002',
    });
    assert.equal(drifted.supersedes_ref, 'CTR-M6-TEST-BASELINE-001');
    assert.equal(drifted.old_intent_applied, false);
  } finally {
    await rm(driftedInput.root, { recursive: true });
  }
});

test('lease 双 owner 竞争只有一个成功；stale takeover 保留前 owner 并提升 revision', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    const { recoverStaleCycleLease } = await lockApi();
    const moduleUrl = new URL('../plugins/geo-expert/scripts/lib/cycle-lock.mjs', import.meta.url).href;
    const script = [
      `import { acquireCycleLease } from ${JSON.stringify(moduleUrl)};`,
      'try {',
      ' const result = await acquireCycleLease({ workspace: process.argv[1], cycleId: "CYC-M6-TEST-001", ownerId: process.argv[2], now: "2026-08-27T00:00:00Z", ttlMs: 60000, inputFingerprint: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" });',
      ' console.log(JSON.stringify(result));',
      '} catch (error) { console.error(error.code); process.exit(3); }',
    ].join('\n');
    const results = await Promise.allSettled([
      exec(process.execPath, ['--input-type=module', '-e', script, root, 'owner-a']),
      exec(process.execPath, ['--input-type=module', '-e', script, root, 'owner-b']),
    ]);
    assert.equal(results.filter((item) => item.status === 'fulfilled').length, 1);
    assert.equal(results.filter((item) => item.status === 'rejected'
      && item.reason.stderr.includes('LEASE_ACTIVE')).length, 1);

    const takeover = await recoverStaleCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'owner-c',
      now: '2026-08-27T00:02:00Z',
      expectedInputFingerprint: 'a'.repeat(64),
    });
    assert.equal(takeover.previous_owner_id.length > 0, true);
    assert.equal(takeover.revision, 2);
  } finally {
    await rm(root, { recursive: true });
  }
});
