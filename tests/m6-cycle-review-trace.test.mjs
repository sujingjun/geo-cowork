import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm, unlink } from 'node:fs/promises';
import path from 'node:path';

import {
  M6_APPROVAL,
  M6_CYCLE_ID,
  M6_MERCHANT_ID,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  seedM6FreezeInputs,
} from './helpers/m6-fixtures.mjs';
import {
  createM6AnalyticsReadyCycleWorkspace,
  createM6CompletedTraceWorkspace,
} from './helpers/m6-cycle-fixtures.mjs';
import { createM6CompletedBusinessTraceWorkspace } from './helpers/m6-completed-business-fixture.mjs';

async function traceApi() {
  return import('../plugins/geo-expert/scripts/lib/cycle-trace.mjs');
}

function sourceEntry({
  entryKey = 'a'.repeat(64),
  objectId = 'Q-M6-TEST-001',
  recordType = 'query',
  fileSha = 'b'.repeat(64),
} = {}) {
  return {
    entry_key: entryKey,
    object_id: objectId,
    record_type: recordType,
    object_version: '1.0.0',
    file_sha256: fileSha,
  };
}

function candidateInput(overrides = {}) {
  return {
    candidate_kind: 'query_cluster',
    source_goal_entry: {
      entry_key: '1'.repeat(64),
      object_id: 'GOAL-M6-TEST-001',
      object_version: '1.0.0',
      file_sha256: '2'.repeat(64),
    },
    source_entries: [sourceEntry()],
    rank_inputs: { priority: 0 },
    goal_statement: 'Improve the synthetic definition query cluster.',
    success_question: 'Is the synthetic definition represented accurately?',
    query_cluster_key: 'm6-synthetic-definition',
    evidence_gaps: [],
    risks: ['Synthetic fixture only.'],
    ...overrides,
  };
}

function reviewPlan(overrides = {}) {
  return {
    schema_version: 'm6-cycle-review-plan/1.0.0',
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: M6_CYCLE_ID,
    reviewed_cycle_input_version: '1.0.9',
    review_snapshot: {
      id: 'CIS-M6-TEST-REVIEW-001',
      base_freeze_snapshot_version: { ref: 'CIS-M6-TEST-001', version: '1.0.0' },
      pre_review_transition_snapshot_versions: [
        { ref: 'CIS-M6-GATE-BASELINE-001', version: '1.0.0' },
        { ref: 'CIS-M6-GATE-ANALYTICS-001', version: '1.0.0' },
      ],
      pre_review_entry_keys: ['3'.repeat(64), '4'.repeat(64)],
      source_paths: [
        'execution/identity/merchant.md',
        'knowledge/meta/knowledge-base.md',
        'cycles/preparation/goal.md',
        'queries/formal/query.md',
        'evidence/records/evidence.md',
      ],
      artifact_paths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
    },
    waiting_review: {
      id: 'CRV-M6-TEST-WAITING-001',
      path: 'cycles/m6/reviews/crv-m6-test-waiting-001.md',
    },
    goal_results: [{
      goal_entry_key: '1'.repeat(64),
      perception_goal: 'inconclusive',
      observations: ['Synthetic observation only.'],
      business_signal_entry_keys: ['5'.repeat(64)],
      limitations: ['No real Publication or Analytics.'],
      forbidden_conclusions: ['Do not claim causality or real MyyShop impact.'],
    }],
    next_cycle_candidate_inputs: [candidateInput()],
    test_scope: { ...M6_TEST_SCOPE },
    ...overrides,
  };
}

function reviewPlanForFixture(fixture, overrides = {}) {
  return reviewPlan({
    run_ref: fixture.snapshotPlan.run_ref,
    reviewed_cycle_input_version: fixture.cycle.version,
    review_snapshot: {
      id: 'CIS-M6-TEST-REVIEW-001',
      base_freeze_snapshot_version: fixture.reviewCutoff.baseFreezeSnapshotVersion,
      pre_review_transition_snapshot_versions:
        fixture.reviewCutoff.preReviewTransitionSnapshotVersions,
      pre_review_entry_keys: fixture.reviewCutoff.preReviewEntryKeys,
      source_paths: [
        'execution/identity/merchant.md',
        'knowledge/meta/knowledge-base.md',
        'cycles/preparation/goal.md',
        'queries/formal/query.md',
        'evidence/records/evidence.md',
      ],
      artifact_paths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
    },
    goal_results: [{
      ...reviewPlan().goal_results[0],
      goal_entry_key: fixture.goalEntryKey,
    }],
    next_cycle_candidate_inputs: [],
    ...overrides,
  });
}

test('Cycle Review fixture 使用冻结 source entries，不用字符串占位或裸 Sample', () => {
  const candidate = candidateInput();
  assert.equal(candidate.source_goal_entry.object_id, 'GOAL-M6-TEST-001');
  assert.equal(candidate.source_entries[0].record_type, 'query');
  assert.match(candidate.source_entries[0].entry_key, /^[a-f0-9]{64}$/);
  assert.equal(candidate.source_entries.some((entry) => entry.record_type === 'answer_sample'), false);
  assert.equal(candidate.rank_inputs.priority >= 0, true);
});

test('candidate kind 限制 source type、对应 Goal；Gap 必须含 FND，misperception/reason 禁止裸 SMP', async () => {
  const { validateNextCycleCandidates } = await traceApi();
  const valid = candidateInput();
  assert.deepEqual(validateNextCycleCandidates([valid], {
    entryGoalMap: { [valid.source_entries[0].entry_key]: valid.source_goal_entry.entry_key },
  }), { errors: [] });

  const invalid = [
    candidateInput({
      candidate_kind: 'evidence_gap',
      source_entries: [sourceEntry({ recordType: 'query' })],
    }),
    candidateInput({
      candidate_kind: 'severe_misperception',
      source_entries: [sourceEntry({ objectId: 'SMP-M6-TEST-001', recordType: 'answer_sample' })],
    }),
    candidateInput({
      source_goal_entry: {
        entry_key: '6'.repeat(64), object_id: 'GOAL-M6-TEST-002',
        object_version: '1.0.0', file_sha256: '7'.repeat(64),
      },
      source_entries: [sourceEntry({
        entryKey: '8'.repeat(64),
        objectId: 'Q-M6-OTHER-GOAL-001',
      })],
    }),
  ];
  const result = validateNextCycleCandidates(invalid, {
    entryGoalMap: { ['8'.repeat(64)]: '9'.repeat(64) },
  });
  assert.ok(result.errors.some((item) => item.code === 'CYCLE_GATE_REQUIRED'
    && item.reason === 'gap_finding_required'));
  assert.ok(result.errors.some((item) => item.code === 'CYCLE_GATE_REQUIRED'
    && item.reason === 'raw_sample_forbidden'));
  assert.ok(result.errors.some((item) => item.code === 'CYCLE_GATE_REQUIRED'
    && item.reason === 'cross_goal_source'));
});

test('assemble waiting_human CRV 创建 pre-review CIS，cutoff 只到 analytics_recorded', async () => {
  const fixture = await createM6AnalyticsReadyCycleWorkspace();
  const { root } = fixture;
  try {
    const { assembleCycleReview } = await traceApi();
    const result = await assembleCycleReview({
      workspace: root,
      plan: reviewPlanForFixture(fixture),
    });
    assert.equal(result.data.record_type, 'cycle_review');
    assert.equal(result.data.status, 'waiting_human');
    assert.equal(result.data.approval, undefined);
    assert.equal(result.data.review_input_snapshot_version.ref, 'CIS-M6-TEST-REVIEW-001');
    assert.deepEqual(
      result.review_snapshot.pre_review_transition_snapshot_versions,
      fixture.reviewCutoff.preReviewTransitionSnapshotVersions,
    );
    const frozen = JSON.stringify(result.review_snapshot);
    assert.equal(frozen.includes('review_waiting_human'), false);
    assert.equal(frozen.includes('review_decided'), false);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('waiting_human → decided 必须新 CRV ID、supersedes waiting 且有人类决定', async () => {
  const fixture = await createM6AnalyticsReadyCycleWorkspace();
  const { root } = fixture;
  try {
    const { assembleCycleReview, decideCycleReview } = await traceApi();
    const preparedReview = reviewPlanForFixture(fixture);
    await assembleCycleReview({ workspace: root, plan: preparedReview });
    const decision = {
      waiting_review_ref: 'CRV-M6-TEST-WAITING-001',
      decided_review: {
        id: 'CRV-M6-TEST-DECIDED-001',
        path: 'cycles/m6/reviews/crv-m6-test-decided-001.md',
      },
      approval: { ...M6_APPROVAL },
      goal_results: preparedReview.goal_results,
      test_scope: { ...M6_TEST_SCOPE },
    };
    const result = await decideCycleReview({ workspace: root, decision });
    assert.equal(result.data.status, 'decided');
    assert.equal(result.data.id, 'CRV-M6-TEST-DECIDED-001');
    assert.equal(result.data.supersedes_ref, 'CRV-M6-TEST-WAITING-001');
    assert.deepEqual(result.data.approval, M6_APPROVAL);

    await assert.rejects(
      decideCycleReview({
        workspace: root,
        decision: {
          ...decision,
          decided_review: { id: 'CRV-M6-TEST-WAITING-001' },
          approval: undefined,
        },
      }),
      (error) => error.code === 'CYCLE_REVIEW_APPROVAL_REQUIRED',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('review CIS fingerprint 或 reviewed Cycle version 漂移时拒绝，不用当前 bump 误判历史 version', async () => {
  const { validateReviewDecision } = await traceApi();
  assert.doesNotThrow(() => validateReviewDecision({
    waitingReview: {
      reviewed_cycle_input_version: '1.0.9',
      review_input_fingerprint: 'a'.repeat(64),
      review_input_snapshot_version: { ref: 'CIS-M6-TEST-REVIEW-001', version: '1.0.0' },
    },
    reviewSnapshot: { manifest: { fingerprint: 'a'.repeat(64) } },
    currentCycleVersion: '1.0.10',
  }));
  assert.throws(
    () => validateReviewDecision({
      waitingReview: {
        reviewed_cycle_input_version: '1.0.9',
        review_input_fingerprint: 'b'.repeat(64),
        review_input_snapshot_version: { ref: 'CIS-M6-TEST-REVIEW-001', version: '1.0.0' },
      },
      reviewSnapshot: { manifest: { fingerprint: 'a'.repeat(64) } },
      currentCycleVersion: '1.0.10',
    }),
    (error) => error.code === 'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
  );
});

test('completed trace 只依赖 freeze/pre-review/后生 transition snapshot copies，不依赖 live 旧 revision', async () => {
  const { root } = await createM6CompletedBusinessTraceWorkspace();
  try {
    const queryPath = path.join(root, 'queries/formal/query.md');
    await unlink(queryPath);
    const { traceCycle } = await traceApi();
    const trace = await traceCycle({ workspace: root, cycleId: M6_CYCLE_ID });
    assert.equal(trace.scope, 'knowledge_independent_engineering');
    assert.equal(trace.synthetic, true);
    assert.equal(trace.real_myyshop_impact, false);
    assert.equal(trace.source, 'snapshot_copies');
    assert.equal(trace.completed_history_requires_live_revision, false);
    assert.deepEqual(trace.errors, []);
    assert.deepEqual(trace.goal_tracks[0].stages, [
      'baseline_recorded', 'diagnosis_ready', 'adoption_decided',
      'publication_confirmed', 'technical_retest_completed',
      'answer_retest_completed', 'analytics_recorded',
      'review_waiting_human', 'review_decided',
    ]);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('active trace 同时报告 live drift；缺 snapshot edge 返回 TRACE_INCOMPLETE 而非猜测', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    const { traceCycle } = await traceApi();
    const trace = await traceCycle({ workspace: root, cycleId: M6_CYCLE_ID, active: true });
    assert.ok(trace.errors.some((item) => item.code === 'TRACE_INCOMPLETE'));
    assert.equal(trace.lifecycle_ready, false);
    assert.equal(trace.synthetic, true);
  } finally {
    await rm(root, { recursive: true });
  }
});
