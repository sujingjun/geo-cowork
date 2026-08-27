import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import {
  assembleCycleReview,
  traceCycle,
} from '../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import {
  loadWorkspaceGraph,
} from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  serializeMarkdownObject,
} from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  createM6CompletedTraceWorkspace,
} from './helpers/m6-cycle-fixtures.mjs';
import {
  createM6CompletedBusinessTraceWorkspace,
} from './helpers/m6-completed-business-fixture.mjs';
import {
  capture,
  createM6ReviewReadyWorkspace,
  treeDigest,
} from './helpers/m6-adversarial-fixtures.mjs';

const REQUIRED_COMPLETED_STAGES = [
  'baseline_recorded',
  'diagnosis_ready',
  'adoption_decided',
  'publication_confirmed',
  'technical_retest_completed',
  'answer_retest_completed',
  'analytics_recorded',
  'review_waiting_human',
  'review_decided',
];

async function attackCompletedTransitionSequence(attack) {
  const fixture = await createM6CompletedBusinessTraceWorkspace();
  try {
    const cyclePath = path.join(fixture.root, 'cycles/m6/cycle.md');
    const parsed = matter(await readFile(cyclePath, 'utf8'));
    const transitions = new Map();
    for (const ref of parsed.data.transition_refs) {
      const transitionPath = path.join(
        fixture.root,
        'cycles/m6/transitions',
        `${ref.toLowerCase()}.md`,
      );
      transitions.set(ref, matter(await readFile(transitionPath, 'utf8')).data);
    }
    const stages = parsed.data.transition_refs.map((ref) => transitions.get(ref).to_stage);
    assert.deepEqual(stages, REQUIRED_COMPLETED_STAGES, '攻击前必须是真实完整九门 Cycle');
    assert.ok(parsed.data.goal_tracks.every((track) =>
      track.stage === REQUIRED_COMPLETED_STAGES.at(-1)));

    let transitionRefs;
    if (attack === 'missing_diagnosis') {
      transitionRefs = parsed.data.transition_refs.filter((ref) =>
        transitions.get(ref).to_stage !== 'diagnosis_ready');
    } else {
      transitionRefs = [...parsed.data.transition_refs];
      [transitionRefs[1], transitionRefs[2]] = [transitionRefs[2], transitionRefs[1]];
    }
    await writeFile(cyclePath, serializeMarkdownObject({
      ...parsed.data,
      transition_refs: transitionRefs,
    }, parsed.content));
    const trace = await traceCycle({ workspace: fixture.root, cycleId: parsed.data.id });
    return {
      attack,
      lifecycle_ready: trace.lifecycle_ready,
      has_sequence_error: trace.errors.some((item) =>
        ['TRACE_INCOMPLETE', 'CYCLE_GATE_REQUIRED'].includes(item.code)),
      observed_matches_required: trace.goal_tracks.every((track) =>
        JSON.stringify(track.stages) === JSON.stringify(REQUIRED_COMPLETED_STAGES)),
      track_stage_matches_final: parsed.data.goal_tracks.every((track) =>
        track.stage === REQUIRED_COMPLETED_STAGES.at(-1)),
    };
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

test('final QA P0: completed trace 必须复验九门业务对象，不能只认 transition 名称', async () => {
  const fixture = await createM6CompletedTraceWorkspace();
  try {
    const graph = await loadWorkspaceGraph({ workspace: fixture.root });
    const cycle = graph.byId.get(fixture.cycle.id).data;
    const firstSevenGateTypes = cycle.transition_refs.slice(0, 7).map((ref) => {
      const transition = graph.byId.get(ref).data;
      const gate = graph.byId.get(transition.gate_snapshot_version.ref).data;
      return gate.source_entries.map((entry) => entry.record_type);
    });
    assert.ok(
      firstSevenGateTypes.every((types) =>
        types.length === 1 && types[0] === 'perception_goal'),
      '对抗夹具必须确认前七门没有 Sample/Review/Gap/Publication/Retest/Analytics 对象',
    );

    const trace = await traceCycle({ workspace: fixture.root, cycleId: cycle.id });
    assert.equal(
      trace.lifecycle_ready,
      false,
      '只有阶段名和合法 checksum、但九门业务闭包为空时不得 lifecycle_ready',
    );
    assert.ok(
      trace.errors.some((item) =>
        ['CYCLE_GATE_REQUIRED', 'TRACE_INCOMPLETE'].includes(item.code)),
      'trace 必须报告缺少九门业务闭包',
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: completed/full 每个 Goal 必须完整且有序覆盖九门并匹配 track.stage', async () => {
  const outcomes = [];
  for (const attack of ['missing_diagnosis', 'reordered_diagnosis_adoption']) {
    outcomes.push(await attackCompletedTransitionSequence(attack));
  }
  assert.deepEqual(outcomes, [
    {
      attack: 'missing_diagnosis',
      lifecycle_ready: false,
      has_sequence_error: true,
      observed_matches_required: false,
      track_stage_matches_final: true,
    },
    {
      attack: 'reordered_diagnosis_adoption',
      lifecycle_ready: false,
      has_sequence_error: true,
      observed_matches_required: false,
      track_stage_matches_final: true,
    },
  ]);
});

test('final QA P0: Review candidate 的每个 entry 必须真实属于 review CIS', async () => {
  const fixture = await createM6ReviewReadyWorkspace({
    snapshotId: 'CIS-M6-FINAL-QA-FORGED-REVIEW-001',
    waitingId: 'CRV-M6-FINAL-QA-FORGED-WAITING-001',
  });
  try {
    const plan = structuredClone(fixture.reviewPlan);
    const goal = fixture.snapshotPlan.source_entries
      .find((entry) => entry.record_type === 'perception_goal');
    const forgedEntryKey = 'f'.repeat(64);
    plan.next_cycle_candidate_inputs = [{
      candidate_kind: 'query_cluster',
      source_goal_entry: {
        entry_key: goal.entry_key,
        object_id: goal.object_id,
        object_version: goal.object_version,
        file_sha256: goal.file_sha256,
      },
      source_entries: [{
        entry_key: forgedEntryKey,
        object_id: 'Q-M6-FINAL-QA-NONEXISTENT-001',
        record_type: 'query',
        object_version: '1.0.0',
        file_sha256: 'e'.repeat(64),
      }],
      rank_inputs: { priority: 0 },
      goal_statement: 'A forged candidate must not enter Cycle Review.',
      success_question: 'Did the source entry really exist in review CIS?',
      query_cluster_key: 'm6-final-qa-forged-entry',
      evidence_gaps: [],
      risks: ['The source entry is not present in review CIS.'],
    }];

    const before = await treeDigest(fixture.root);
    const outcome = await capture(() => assembleCycleReview({
      workspace: fixture.root,
      plan,
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(fixture.root) === before,
    }, {
      rejected: true,
      error_code: 'CYCLE_GATE_REQUIRED',
      unchanged: true,
    }, '不存在于 review CIS 的 entry key 必须在任何 CIS/CRV 写入前失败');
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
