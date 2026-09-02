import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  readFile,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import {
  buildCycleSnapshotPlan,
} from '../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import {
  assembleCycleReview,
  decideCycleReview,
  traceCycle,
} from '../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import {
  serializeMarkdownObject,
} from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  M6_APPROVAL,
  M6_CYCLE_ID,
  M6_MERCHANT_ID,
  M6_NOW,
  M6_RUN_ID,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  seedM6FreezeInputs,
  writeM6Object,
} from './helpers/m6-fixtures.mjs';
import {
  createM6CompletedTraceWorkspace,
} from './helpers/m6-cycle-fixtures.mjs';
import {
  capture,
  createM6ReviewReadyWorkspace,
  treeDigest,
} from './helpers/m6-adversarial-fixtures.mjs';

function reviewPlan(overrides = {}) {
  return {
    schema_version: 'm6-cycle-review-plan/1.0.0',
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: M6_CYCLE_ID,
    run_ref: M6_RUN_ID,
    reviewed_cycle_input_version: '9.9.9',
    review_snapshot: {
      id: 'CIS-M6-ADVERSARIAL-REVIEW-001',
      base_freeze_snapshot_version: {
        ref: 'CIS-NOT-PRESENT-FREEZE',
        version: '7.7.7',
      },
      pre_review_transition_snapshot_versions: [{
        ref: 'CIS-NOT-PRESENT-ANALYTICS',
        version: '8.8.8',
      }],
      pre_review_entry_keys: ['f'.repeat(64)],
      source_paths: ['execution/identity/merchant.md'],
      artifact_paths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
    },
    waiting_review: {
      id: 'CRV-M6-ADVERSARIAL-WAITING-001',
      path: 'cycles/m6/reviews/crv-m6-adversarial-waiting-001.md',
    },
    goal_results: [{
      goal_entry_key: '1'.repeat(64),
      perception_goal: 'inconclusive',
      observations: ['Self-reported review input only.'],
      business_signal_entry_keys: ['2'.repeat(64)],
      limitations: ['Missing pre-review closure.'],
      forbidden_conclusions: ['No conclusion is allowed.'],
    }],
    next_cycle_candidate_inputs: [],
    test_scope: { ...M6_TEST_SCOPE },
    ...overrides,
  };
}

async function rewriteCycle(root, mutate) {
  const relative = 'cycles/m6/cycle.md';
  const target = path.join(root, ...relative.split('/'));
  const parsed = matter(await readFile(target, 'utf8'));
  const data = mutate(parsed.data);
  await writeFile(target, serializeMarkdownObject(data, parsed.content));
}

test('P0: Review cutoff 必须解析真实 freeze/applied transition/Cycle version 后才可写', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const plan = reviewPlan();
    const before = await treeDigest(root);
    const outcome = await capture(() => assembleCycleReview({ workspace: root, plan }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'REVIEW_PRE_CUTOFF_INCOMPLETE',
      unchanged: true,
    }, '不存在的 freeze/transition refs 与自报 Cycle version 不得进入 Review CIS');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: decided Review 必须复验 pinned CIS manifest bytes/fingerprint', async () => {
  const fixture = await createM6ReviewReadyWorkspace({
    snapshotId: 'CIS-M6-ADVERSARIAL-REVIEW-DECIDE-001',
    waitingId: 'CRV-M6-ADVERSARIAL-WAITING-DECIDE-001',
  });
  const { root } = fixture;
  try {
    const plan = fixture.reviewPlan;
    const assembled = await assembleCycleReview({ workspace: root, plan });
    const manifest = path.join(
      root,
      'runs',
      plan.run_ref,
      ...assembled.review_snapshot.manifest.artifact_path.split('/'),
    );
    await writeFile(manifest, '{"tampered":true}\n');
    const before = await treeDigest(root);
    const outcome = await capture(() => decideCycleReview({
      workspace: root,
      decision: {
        waiting_review_ref: plan.waiting_review.id,
        decided_review: {
          id: 'CRV-M6-ADVERSARIAL-DECIDED-001',
          path: 'cycles/m6/reviews/crv-m6-adversarial-decided-001.md',
        },
        approval: { ...M6_APPROVAL },
        goal_results: plan.goal_results,
        test_scope: { ...M6_TEST_SCOPE },
      },
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
      unchanged: true,
    });
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: assemble Review 必须按 CIS 实际 Goal membership 拒绝 self-declared cross-Goal candidate', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    await writeM6Object(root, 'cycles/preparation/goal-2.md', {
      id: 'GOAL-M6-TEST-002',
      record_type: 'perception_goal',
      status: 'approved',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      title: 'Synthetic second goal',
      test_scope: { ...M6_TEST_SCOPE },
      goal_statement: 'Second synthetic goal.',
      success_question: 'Is the second goal represented?',
      query_set_refs: ['QS-M6-TEST-001'],
      approval: { ...M6_APPROVAL },
    });
    const sourcePaths = [
      'cycles/preparation/goal.md',
      'cycles/preparation/goal-2.md',
      'queries/formal/query.md',
    ];
    const preview = await buildCycleSnapshotPlan({
      workspace: root,
      id: 'CIS-M6-ADVERSARIAL-CROSS-GOAL-001',
      snapshotKind: 'review',
      merchantRef: M6_MERCHANT_ID,
      cycleRef: M6_CYCLE_ID,
      runRef: M6_RUN_ID,
      sourcePaths,
      artifactPaths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
      baseFreezeSnapshotVersion: { ref: 'CIS-NOT-PRESENT-FREEZE', version: '1.0.0' },
      preReviewTransitionSnapshotVersions: [],
      preReviewEntryKeys: [],
    });
    const goal2 = preview.source_entries.find((entry) => entry.object_id === 'GOAL-M6-TEST-002');
    const query1 = preview.source_entries.find((entry) => entry.object_id === 'Q-M6-TEST-001');
    const candidate = {
      candidate_kind: 'query_cluster',
      source_goal_entry: {
        entry_key: goal2.entry_key,
        object_id: goal2.object_id,
        object_version: goal2.object_version,
        file_sha256: goal2.file_sha256,
      },
      source_entries: [{
        entry_key: query1.entry_key,
        object_id: query1.object_id,
        record_type: query1.record_type,
        object_version: query1.object_version,
        file_sha256: query1.file_sha256,
      }],
      rank_inputs: { priority: 0 },
      goal_statement: 'Wrongly bind Goal 1 query to Goal 2.',
      success_question: 'Should cross-goal input be rejected?',
      query_cluster_key: 'cross-goal-adversarial',
      evidence_gaps: [],
      risks: ['Cross-goal contamination.'],
    };
    const plan = reviewPlan({
      review_snapshot: {
        ...reviewPlan().review_snapshot,
        id: preview.snapshot.id,
        source_paths: sourcePaths,
      },
      waiting_review: {
        id: 'CRV-M6-ADVERSARIAL-CROSS-GOAL-001',
        path: 'cycles/m6/reviews/crv-m6-adversarial-cross-goal-001.md',
      },
      next_cycle_candidate_inputs: [candidate],
    });
    const before = await treeDigest(root);
    const outcome = await capture(() => assembleCycleReview({ workspace: root, plan }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: true,
      error_code: 'CYCLE_GATE_REQUIRED',
      unchanged: true,
    });
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: completed trace 缺任一 artifact snapshot copy 必须 TRACE_INCOMPLETE', async () => {
  const fixture = await createM6CompletedTraceWorkspace();
  try {
    const entry = fixture.snapshotPlan.artifact_entries[0];
    await unlink(path.join(
      fixture.root,
      'runs',
      M6_RUN_ID,
      ...entry.snapshot_path.split('/'),
    ));
    const trace = await traceCycle({ workspace: fixture.root, cycleId: M6_CYCLE_ID });
    assert.equal(trace.lifecycle_ready, false, 'artifact bytes 缺失时 completed trace 不得 ready');
    assert.ok(
      trace.errors.some((item) => item.code === 'TRACE_INCOMPLETE'),
      '必须报告 TRACE_INCOMPLETE',
    );
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('P0: trace 不得对非 test scope Cycle 无条件声称 synthetic/no-impact', async () => {
  const fixture = await createM6CompletedTraceWorkspace();
  try {
    await rewriteCycle(fixture.root, (data) => {
      const changed = { ...data, scope: 'real_business_cycle' };
      delete changed.test_scope;
      return changed;
    });
    const trace = await traceCycle({ workspace: fixture.root, cycleId: M6_CYCLE_ID });
    assert.equal(trace.synthetic, false);
    assert.ok(
      trace.errors.some((item) => item.code === 'SYNTHETIC_REAL_REF_CONTAMINATION'),
      'scope/test_scope 未验证时不得返回 real_myyshop_impact:false',
    );
    assert.equal(trace.lifecycle_ready, false);
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('P0: multi-Goal trace 必须逐 track 重建，不得复制全局 stages', async () => {
  const fixture = await createM6CompletedTraceWorkspace();
  try {
    await rewriteCycle(fixture.root, (data) => ({
      ...data,
      goal_tracks: [
        ...data.goal_tracks,
        {
          ...data.goal_tracks[0],
          goal_entry_key: 'f'.repeat(64),
          stage: 'review_decided',
        },
      ],
      status: 'completed',
      aggregate_stage: 'review_decided',
      completion_scope: 'full',
    }));
    const trace = await traceCycle({ workspace: fixture.root, cycleId: M6_CYCLE_ID });
    assert.equal(trace.lifecycle_ready, false, '没有 Goal 2 transition history 时不得 full ready');
    assert.ok(trace.errors.some((item) => item.code === 'TRACE_INCOMPLETE'));
    assert.notDeepEqual(
      trace.goal_tracks[0]?.stages,
      trace.goal_tracks[1]?.stages,
      '不同 Goal 不得共享同一全局 transition stages',
    );
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});
