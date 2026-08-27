import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';

import {
  validateProductGapCandidate,
} from '../plugins/geo-expert/scripts/lib/cycle-goal-candidates.mjs';
import { validateAnswerWorkspace } from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { validateDiagnosisWorkspace } from '../plugins/geo-expert/scripts/lib/diagnosis-profile.mjs';
import { buildIndexes } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { validateKnowledgeWorkspace } from '../plugins/geo-expert/scripts/lib/knowledge-query.mjs';
import {
  buildOrdinaryCandidateBundle,
  buildProductCandidateBundle,
  buildStrategyGateObjects,
  bindCycle2PlanWithActualSelection,
  createCycle2InputWorkspace,
  createCycleOneHandoffWorkspace,
  readFixtureJson,
} from './helpers/m7-cycle2-fixtures.mjs';
import { productGapIdentity } from './helpers/m7-fixtures.mjs';
import { materializeCycle2GateFixtures } from './helpers/m7-cycle2-gates.mjs';

test('strategy 未触发时普通 Query Cluster Candidate 仍可进入人工选择', () => {
  const { candidate } = buildOrdinaryCandidateBundle();
  assert.equal(candidate.candidate_kind, 'query_cluster');
  assert.equal(candidate.strategy_gate_versions, undefined);
  assert.deepEqual(validateProductGapCandidate({ candidate, gates: null }).errors, []);
});

test('Product Gap Candidate 必须闭合 STA proceed → factor DDM → STO 同 tuple', () => {
  const { candidate } = buildProductCandidateBundle();
  const { assessment, dimension, output } = buildStrategyGateObjects();
  const gates = {
    assessment,
    dimensions: [dimension],
    output,
    reviewProductGapIdentity: productGapIdentity(),
    strategyProductGapIdentity: productGapIdentity(),
  };
  assert.deepEqual(validateProductGapCandidate({ candidate, gates }).errors, []);
  assert.equal(assessment.decision, 'proceed');
  assert.equal(dimension.status, 'decision_factor');
  assert.equal(output.status, 'draft');
});

test('Cycle 2 freeze 输入拥有独立 Goal/Query/QS/KR/Evidence/Asset/CPF 完整 graph', async () => {
  const { root, plan } = await createCycle2InputWorkspace();
  try {
    const built = await buildIndexes({ workspace: root, write: false });
    assert.equal(built.object_count >= 23, true);
    assert.deepEqual((await validateKnowledgeWorkspace({ workspace: root })).errors, []);
    assert.deepEqual((await validateDiagnosisWorkspace({ workspace: root })).errors, []);
    assert.deepEqual((await validateAnswerWorkspace({ workspace: root })).errors, []);
    const types = new Set(plan.source_objects.map((item) => item.data.record_type));
    for (const type of [
      'perception_goal', 'query', 'query_set', 'document', 'claim', 'answer_card',
      'knowledge_release', 'evidence', 'source', 'asset', 'collector_profile',
    ]) assert.equal(types.has(type), true, type);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('Cycle 2 Baseline/M4/Publication/双Retest gate fixtures 使用独立 IDs 且 graph/profile 全绿', async () => {
  const { root } = await createCycle2InputWorkspace();
  try {
    const gates = await materializeCycle2GateFixtures(root);
    for (const name of [
      'baseline', 'diagnosis', 'adoption', 'publication',
      'technical_retest', 'answer_retest',
    ]) assert.equal(gates.byGate[name].length > 0, true, name);
    await buildIndexes({ workspace: root, write: false });
    assert.deepEqual((await validateDiagnosisWorkspace({ workspace: root })).errors, []);
    assert.deepEqual((await validateAnswerWorkspace({ workspace: root })).errors, []);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('Cycle 1 decided CRV 从实际 Review CIS entry tuples 冻结 Product Gap 候选', async () => {
  const handoff = await createCycleOneHandoffWorkspace();
  try {
    assert.equal(handoff.cycle.status, 'completed');
    assert.equal(handoff.decided.next_cycle_candidate_inputs.length, 1);
    const candidate = handoff.decided.next_cycle_candidate_inputs[0];
    assert.deepEqual(candidate, handoff.candidate);
    assert.equal(candidate.candidate_kind, 'product_gap');
    const entries = new Map(handoff.reviewSnapshot.source_entries
      .map((item) => [item.entry_key, item]));
    for (const item of [candidate.source_goal_entry, ...candidate.source_entries]) {
      const actual = entries.get(item.entry_key);
      assert.equal(actual.object_id, item.object_id);
      assert.equal(actual.object_version, item.object_version);
      assert.equal(actual.file_sha256, item.file_sha256);
    }
    assert.equal(candidate.source_entries.some((item) =>
      item.object_id === 'FND-M7-PRODUCT-GAP-001'), true);
    await buildIndexes({ workspace: handoff.root, write: false });
    assert.deepEqual((await validateDiagnosisWorkspace({ workspace: handoff.root })).errors, []);
  } finally {
    await rm(handoff.root, { recursive: true });
  }
});

test('Cycle 2 输入必须绑定 predecessor Review、decided GSEL、selected Candidate 与独立 Goal approval', async () => {
  const {
    prepareCycleTwoInputs,
    validateCycleTwoBinding,
  } = await import('../plugins/geo-expert/scripts/lib/cycle-two.mjs');
  const plan = bindCycle2PlanWithActualSelection(
    await readFixtureJson('plans/cycle-2-e2e.json'),
  ).plan;
  const prepared = prepareCycleTwoInputs(plan);
  assert.deepEqual(validateCycleTwoBinding(prepared).errors, []);
  assert.equal(prepared.cycle_number, 2);
  assert.equal(prepared.new_goal.approval.decision_ref.startsWith('fixture://decision/'), true);
  assert.notEqual(
    prepared.new_goal.approval.decision_ref,
    prepared.goal_selection_version.ref,
  );
});

test('直接创建 Cycle 2、缺 selected 或复用 Cycle 1 Goal approval 必须 fail closed', async () => {
  const { validateCycleTwoBinding } = await import(
    '../plugins/geo-expert/scripts/lib/cycle-two.mjs'
  );
  const plan = bindCycle2PlanWithActualSelection(
    await readFixtureJson('plans/cycle-2-e2e.json'),
  ).plan;
  for (const invalid of [
    { ...plan, predecessor_review_version: null },
    { ...plan, goal_selection_version: null },
    { ...plan, selected_candidate_version: null },
    { ...plan, new_goal: { ...plan.new_goal, approval: null } },
    {
      ...plan,
      new_goal: {
        ...plan.new_goal,
        approval: {
          ...plan.new_goal.approval,
          decision_ref: 'fixture://decision/m6-cycle-one-goal-approval-001',
        },
      },
    },
  ]) {
    assert.notDeepEqual(validateCycleTwoBinding(invalid).errors, []);
  }
});

test('runSyntheticCycleTwo 无 lifecycle adapter/九门 trace 时不得伪造 completed', async () => {
  const { runSyntheticCycleTwo } = await import(
    '../plugins/geo-expert/scripts/lib/cycle-two.mjs'
  );
  const { root } = await createCycle2InputWorkspace();
  try {
    const plan = bindCycle2PlanWithActualSelection(
      await readFixtureJson('plans/cycle-2-e2e.json'),
    ).plan;
    await assert.rejects(
      runSyntheticCycleTwo({ workspace: root, plan }),
      (error) => error.code === 'CYCLE_GATE_REQUIRED',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});
