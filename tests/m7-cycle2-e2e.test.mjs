import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { buildIndexes } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { sha256, stableStringify } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  ANALYTICS_CLI,
  LIFECYCLE_CLI,
  fixturePath,
  readFixtureJson,
  runNode,
  writeJson,
} from './helpers/m7-cycle2-fixtures.mjs';
import { materializeCycle2GateFixtures } from './helpers/m7-cycle2-gates.mjs';
import {
  createStrategyCliWorkspace,
  materializeFullStrategyFlow,
} from './helpers/m7-strategy-cli-fixtures.mjs';

const exec = promisify(execFile);

test('Cycle 2 E2E fixture 固定 predecessor/GSEL/新 Goal approval 与完整九门', async () => {
  const plan = await readFixtureJson('plans/cycle-2-e2e.json');
  assert.equal(plan.cycle_number, 2);
  assert.equal(plan.predecessor_review_version, null);
  assert.equal(plan.goal_selection_version, null);
  assert.equal(plan.selected_candidate_version, null);
  assert.equal(JSON.stringify(plan).includes('GCD-M7-PRODUCT-001'), false);
  assert.equal(plan.source_objects.length, 11);
  assert.equal(plan.source_paths.length, 13);
  assert.equal(plan.source_paths.includes('execution/identity/merchant.md'), true);
  assert.equal(plan.source_paths.includes('knowledge/meta/knowledge-base.md'), true);
  assert.equal(plan.cycle_one_review_handoff.candidate_input, undefined);
  assert.ok(plan.new_goal.approval.decision_ref.startsWith('fixture://decision/'));
  assert.deepEqual(plan.stages, [
    'baseline_recorded', 'diagnosis_ready', 'adoption_decided',
    'publication_confirmed', 'technical_retest_completed',
    'answer_retest_completed', 'analytics_recorded',
    'review_waiting_human', 'review_decided',
  ]);
});

function cycle2Gates() {
  const stages = [
    'baseline_recorded', 'diagnosis_ready', 'adoption_decided',
    'publication_confirmed', 'technical_retest_completed',
    'answer_retest_completed', 'analytics_recorded',
    'review_waiting_human', 'review_decided',
  ];
  const names = [
    'baseline', 'diagnosis', 'adoption', 'publication',
    'technical_retest', 'answer_retest', 'analytics',
    'review_waiting', 'review_decided',
  ];
  return stages.map((toStage, index) => ({
    name: names[index],
    from_stage: index === 0 ? 'frozen' : stages[index - 1],
    to_stage: toStage,
    transition_id: `CTR-M7-C2-${names[index].replaceAll('_', '-').toUpperCase()}-001`,
    gate_snapshot_id: `CIS-M7-C2-${names[index].replaceAll('_', '-').toUpperCase()}-001`,
  }));
}

async function descriptor(root, spec) {
  return {
    ...spec,
    sha256: sha256(await readFile(path.join(root, ...spec.path.split('/')))),
  };
}

async function workspaceBytes(root) {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const files = entries.filter((item) => item.isFile())
    .map((item) => path.join(item.parentPath ?? item.path, item.name))
    .sort();
  return stableStringify(await Promise.all(files.map(async (file) => ({
    path: path.relative(root, file),
    sha256: sha256(await readFile(file)),
  }))));
}

async function expectProposeZeroWrite(root, reviewRef, plan, expectedCode, name) {
  const planPath = await writeJson(root, `fixtures/plans/${name}.json`, plan);
  const before = await workspaceBytes(root);
  await assert.rejects(
    runNode(LIFECYCLE_CLI, [
      'propose-cycle-two', '--workspace', root, '--review', reviewRef, '--plan', planPath,
    ]),
    (error) => {
      assert.equal(error.code, 1);
      assert.equal(JSON.parse(error.stderr.trim()).error, expectedCode);
      return true;
    },
  );
  assert.equal(await workspaceBytes(root), before);
}

function advancePlan(plan, gate, version, goalEntryKey, descriptors) {
  return {
    schema_version: 'm6-cycle-transition-plan/1.0.0',
    operation_id: `m7-cycle-2-${gate.name}`,
    operation_fingerprint: sha256(stableStringify({ gate: gate.name, version })),
    transition_id: gate.transition_id,
    gate_snapshot_id: gate.gate_snapshot_id,
    cycle_ref: plan.cycle_id,
    goal_entry_key: goalEntryKey,
    expected_cycle_version: version,
    from_stage: gate.from_stage,
    to_stage: gate.to_stage,
    gate_objects: descriptors,
    actor: gate.name === 'review_decided'
      ? { kind: 'fixture_human', decision_ref: 'fixture://decision/m7-cycle-2-review-001' }
      : { kind: 'deterministic_tool' },
    lease: {
      owner_id: `m7-cycle-2-${gate.name}`,
      now: '2026-08-27T00:03:00Z',
      ttl_ms: 60_000,
    },
  };
}

async function advance(root, plan, gate, version, goalEntryKey, descriptors) {
  const planPath = await writeJson(
    root,
    `fixtures/plans/advance-m7-${gate.name}.json`,
    advancePlan(plan, gate, version, goalEntryKey, descriptors),
  );
  const result = await runNode(LIFECYCLE_CLI, [
    'advance', '--workspace', root, '--cycle', plan.cycle_id, '--plan', planPath,
  ]);
  return JSON.parse(result.stdout);
}

test('三份人工决定由不同 fresh-process 证据承载，均不使用聊天历史', async () => {
  const decisions = await Promise.all([
    readFixtureJson('decisions/strategy-proceed.json'),
    readFixtureJson('decisions/dimension-factor.json'),
    readFixtureJson('decisions/goal-selection.json'),
  ]);
  assert.deepEqual(decisions.map((item) => item.decision_kind), [
    'strategy_assessment', 'decision_dimension', 'cycle_goal_selection',
  ]);
  assert.equal(decisions.every((item) => item.conversation_history_used === false), true);
  assert.equal(decisions.every((item) => item.fresh_process_required === true), true);
  const refs = [
    decisions[0].approval.decision_ref,
    decisions[1].validation_decision.decision_ref,
    decisions[1].factor_decision.decision_ref,
    decisions[2].approval.decision_ref,
  ];
  assert.equal(new Set(refs).size, refs.length);
});

test('fresh Node 只从三份 decision bytes 重建人工门，不读取当前会话', async () => {
  const paths = [
    fixturePath('decisions/strategy-proceed.json'),
    fixturePath('decisions/dimension-factor.json'),
    fixturePath('decisions/goal-selection.json'),
  ];
  const script = `
    import { readFile } from 'node:fs/promises';
    import { createHash } from 'node:crypto';
    const decisions = [];
    for (const file of process.argv.slice(1)) {
      const bytes = await readFile(file);
      const data = JSON.parse(bytes);
      decisions.push({
        kind: data.decision_kind,
        conversation_history_used: data.conversation_history_used,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      });
    }
    console.log(JSON.stringify({ decisions, conversation_history_used: false }));
  `;
  const child = await exec(process.execPath, [
    '--input-type=module', '-e', script, ...paths,
  ], { cwd: os.tmpdir() });
  const result = JSON.parse(child.stdout);
  assert.equal(result.conversation_history_used, false);
  assert.equal(result.decisions.length, 3);
  assert.equal(result.decisions.every((item) => item.conversation_history_used === false), true);
  assert.equal(result.decisions.every((item) => /^[a-f0-9]{64}$/.test(item.sha256)), true);
});

test('完整 synthetic Cycle 1 → strategy/GSEL → 新 freeze CIS → 九门 Cycle 2', async () => {
  const handoff = await createStrategyCliWorkspace();
  try {
    const strategy = await materializeFullStrategyFlow(handoff);
    const plan = await readFixtureJson('plans/cycle-2-e2e.json');
    plan.strategy_materialization = {
      run_ref: strategy.run_ref,
      strategy_snapshot_id: strategy.strategy_snapshot.id,
      waiting_assessment: strategy.waiting_assessment,
      decided_assessment: strategy.decided_assessment,
      candidate_dimension: strategy.candidate_dimension,
      validated_dimension: strategy.validated_dimension,
      factor_dimension: strategy.factor_dimension,
      strategy_output: strategy.strategy_output,
    };
    plan.candidate_generator_rule_path = strategy.candidate_rule_path;
    plan.predecessor_review_version = { ref: handoff.decided.id, version: handoff.decided.version };
    const planPath = await writeJson(handoff.root, 'fixtures/plans/m7-cycle-2-e2e.json', plan);
    const proposed = await runNode(LIFECYCLE_CLI, [
      'propose-cycle-two', '--workspace', handoff.root,
      '--review', handoff.decided.id,
      '--plan', planPath,
    ]);
    const proposal = JSON.parse(proposed.stdout);
    assert.equal(proposal.network_accessed, false);
    assert.ok(proposal.batch_ref.startsWith('GCB-'));
    assert.ok(proposal.selection_draft_ref.startsWith('GSEL-'));
    assert.equal(proposal.candidates.length > 0, true);
    assert.equal(proposal.strategy_trace.errors.length, 0);
    assert.equal(proposal.source_review_version.ref, handoff.decided.id);
    assert.equal(proposal.source_candidate_fingerprint, sha256(stableStringify(
      handoff.decided.next_cycle_candidate_inputs,
    )));
    assert.equal(proposal.candidate_rule_path, plan.candidate_generator_rule_path);
    assert.equal(proposal.candidate_inputs_from_plan, false);
    assert.equal(
      sha256(await readFile(path.join(handoff.root, proposal.batch_path))),
      proposal.batch_sha256,
    );
    assert.equal(
      sha256(await readFile(path.join(handoff.root, proposal.selection_draft_path))),
      proposal.selection_draft_sha256,
    );
    const actualCandidate = proposal.candidates[0];
    const candidateObject = await readMarkdownObject(
      path.join(handoff.root, actualCandidate.path),
      { workspace: handoff.root },
    );
    assert.equal(candidateObject.data.id, actualCandidate.ref);
    assert.equal(sha256(candidateObject.original), actualCandidate.sha256);
    assert.equal(candidateObject.data.source_goal_entry_key, handoff.candidate.source_goal_entry.entry_key);
    assert.deepEqual(
      candidateObject.data.source_entry_keys,
      handoff.candidate.source_entries.map((item) => item.entry_key).sort(),
    );
    assert.deepEqual(candidateObject.data.proposed_goal, {
      statement: handoff.candidate.goal_statement,
      success_question: handoff.candidate.success_question,
      query_cluster_key: handoff.candidate.query_cluster_key,
    });
    const generatorRule = JSON.parse(await readFile(
      path.join(handoff.root, plan.candidate_generator_rule_path),
      'utf8',
    ));
    assert.equal(
      candidateObject.data.rationale,
      generatorRule.derived_fields.rationale_template.replace(
        '{candidate_kind}', candidateObject.data.candidate_kind,
      ),
    );
    assert.deepEqual(candidateObject.data.limitations, generatorRule.derived_fields.limitations);
    await buildIndexes({ workspace: handoff.root, write: false });

    const emptyPlan = structuredClone(plan);
    emptyPlan.predecessor_review_version = { ref: 'CRV-M6-E2E-DECIDED-001', version: '1.0.0' };
    await expectProposeZeroWrite(
      handoff.root,
      'CRV-M6-E2E-DECIDED-001',
      emptyPlan,
      'CYCLE_ONE_REVIEW_REQUIRED',
      'm7-empty-review-candidate',
    );
    await expectProposeZeroWrite(
      handoff.root,
      'CRV-M6-E2E-DECIDED-001',
      plan,
      'CYCLE_TWO_PREDECESSOR_MISMATCH',
      'm7-review-argument-mismatch',
    );
    const driftPlan = structuredClone(plan);
    driftPlan.cycle_one_review_handoff.candidate_input = {
      ...handoff.candidate,
      goal_statement: 'Caller-reported drift must never be authoritative.',
    };
    await expectProposeZeroWrite(
      handoff.root,
      handoff.decided.id,
      driftPlan,
      'GOAL_CANDIDATE_INPUT_DRIFT',
      'm7-caller-candidate-drift',
    );

    const decision = await readFixtureJson('decisions/goal-selection.json');
    decision.selected_candidate_ref = proposal.candidates[0].ref;
    const decisionPath = await writeJson(
      handoff.root,
      'fixtures/plans/m7-goal-selection-decision.json',
      decision,
    );
    const selectionModule = new URL(
      '../plugins/geo-expert/scripts/lib/cycle-goal-selection.mjs', import.meta.url,
    ).href;
    const objectModule = new URL(
      '../plugins/geo-expert/scripts/lib/object-contract.mjs', import.meta.url,
    ).href;
    const selectionScript = `
      import { readFile } from 'node:fs/promises';
      import { readMarkdownObject } from ${JSON.stringify(objectModule)};
      import { buildDecidedGoalSelection, materializeGoalSelection } from ${JSON.stringify(selectionModule)};
      const workspace=process.argv[1], draftPath=process.argv[2], decisionPath=process.argv[3];
      const draft=(await readMarkdownObject(draftPath,{workspace})).data;
      const decision=JSON.parse(await readFile(decisionPath,'utf8'));
      const selected=draft.candidate_versions.find((item)=>item.ref===decision.selected_candidate_ref);
      const context={merchant_ref:draft.merchant_ref,test_scope:draft.test_scope,created_at:decision.approval.approved_at};
      const data=buildDecidedGoalSelection({context,draft,selected,rejected:[],deferred:[],reason:decision.reason,approval:decision.approval});
      const output='cycles/m7/selections/'+data.id.toLowerCase()+'.md';
      await materializeGoalSelection({workspace,path:output,data,prior:draft});
      console.log(JSON.stringify({data,path:output,conversation_history_used:false}));
    `;
    const freshSelection = await exec(process.execPath, [
      '--input-type=module', '-e', selectionScript,
      handoff.root, path.join(handoff.root, proposal.selection_draft_path), decisionPath,
    ], { cwd: os.tmpdir() });
    const selected = JSON.parse(freshSelection.stdout);
    assert.equal(selected.conversation_history_used, false);
    plan.predecessor_review_version = proposal.predecessor_review_version;
    plan.goal_selection_version = { ref: selected.data.id, version: selected.data.version };
    plan.selected_candidate_version = selected.data.decision.selected_candidate_version;
    const applyPlanPath = await writeJson(
      handoff.root,
      'fixtures/plans/m7-cycle-2-apply.json',
      plan,
    );

    const applied = await runNode(LIFECYCLE_CLI, [
      'apply-goal-selection', '--workspace', handoff.root,
      '--plan', applyPlanPath,
    ]);
    const cycle = JSON.parse(applied.stdout);
    assert.equal(cycle.cycle_number, 2);
    assert.equal(cycle.status, 'active');
    assert.equal(cycle.aggregate_stage, 'frozen');
    assert.notEqual(cycle.status, 'completed');
    assert.ok(cycle.core_versions.input_snapshot.ref.startsWith('CIS-'));
    await buildIndexes({ workspace: handoff.root, write: false });

    const gates = cycle2Gates();
    const materialized = await materializeCycle2GateFixtures(handoff.root);
    let version = cycle.cycle_version;
    const goalEntryKey = cycle.goal_entry_key;
    for (const gate of gates.slice(0, 6)) {
      const result = await advance(
        handoff.root, plan, gate, version, goalEntryKey, materialized.byGate[gate.name],
      );
      assert.equal(result.to_stage, gate.to_stage);
      version = result.cycle_version;
    }

    const observation = {
      id: 'ANO-M7-C2-001', path: 'cycles/m7/cycle-2/analytics/ano-m7-c2-001.md',
      input_path: 'fixtures/analytics/complete.json', raw_output_path: 'raw/analytics/ano-m7-c2-001.json',
    };
    const observationPlan = {
      schema_version: 'm6-analytics-observation-plan/1.0.0', observation,
      merchant_ref: plan.merchant_ref, cycle_ref: plan.cycle_id, goal_ref: plan.new_goal.id,
      run_ref: 'RUN-M7-C2-ANALYTICS-001',
      adapter: { kind: 'fixture', name: 'm7-cycle-2-fixture', version: '1.0.0', access_mode: 'fixture', authorization_ref: 'fixture://authorization/m7-cycle-2-analytics' },
      input_path: observation.input_path, raw_output_path: observation.raw_output_path,
      measurement_contract_path: 'execution/contracts/measurement-contract.json',
      signal_rule_path: 'execution/contracts/signal-rule.json',
      sensitive_data_policy_path: 'execution/contracts/sensitive-data-policy.json',
      test_scope: {
        kind: 'synthetic', usage: 'test_only', merchant_ref: plan.merchant_ref,
        workspace_id: plan.workspace_id, knowledge_base_ref: plan.knowledge_base_ref,
      },
    };
    await runNode(ANALYTICS_CLI, [
      'ingest-fixture', '--workspace', handoff.root,
      '--plan', await writeJson(handoff.root, 'fixtures/plans/m7-cycle-2-observation.json', observationPlan),
    ]);
    const signal = { id: 'BSIG-M7-C2-001', path: 'cycles/m7/cycle-2/signals/bsig-m7-c2-001.md' };
    const signalPlan = {
      schema_version: 'm6-business-signal-plan/1.0.0', signal,
      merchant_ref: plan.merchant_ref, cycle_ref: plan.cycle_id, goal_ref: plan.new_goal.id,
      run_ref: observationPlan.run_ref,
      observation_versions: [{ ref: observation.id, version: '1.0.0' }],
      measurement_contract_path: observationPlan.measurement_contract_path,
      rule_path: 'execution/contracts/signal-rule.json', test_scope: observationPlan.test_scope,
    };
    await runNode(ANALYTICS_CLI, [
      'compute-signals', '--workspace', handoff.root,
      '--plan', await writeJson(handoff.root, 'fixtures/plans/m7-cycle-2-signal.json', signalPlan),
    ]);
    const analyticsDescriptors = await Promise.all([
      descriptor(handoff.root, { ...observation, record_type: 'analytics_observation', status: 'recorded', version: '1.0.0' }),
      descriptor(handoff.root, { ...signal, record_type: 'business_signal', status: 'computed', version: '1.0.0' }),
    ]);
    let result = await advance(handoff.root, plan, gates[6], version, goalEntryKey, analyticsDescriptors);
    version = result.cycle_version;

    const reviewPlan = {
      schema_version: 'm6-cycle-review-plan/1.0.0', merchant_ref: plan.merchant_ref,
      cycle_ref: plan.cycle_id, reviewed_cycle_input_version: version,
      review_snapshot: { id: 'CIS-M7-C2-REVIEW-001' },
      waiting_review: { id: 'CRV-M7-C2-WAITING-001', path: 'cycles/m7/cycle-2/reviews/crv-m7-c2-waiting-001.md' },
      goal_results: [{ goal_entry_key: goalEntryKey, perception_goal: 'inconclusive', observations: ['Synthetic Cycle 2 observation.'], business_signal_entry_keys: ['a'.repeat(64)], limitations: ['Synthetic fixture only.'], forbidden_conclusions: ['No causal or real MyyShop conclusion.'] }],
      next_cycle_candidate_inputs: [], test_scope: observationPlan.test_scope,
    };
    await runNode(LIFECYCLE_CLI, [
      'assemble-review', '--workspace', handoff.root,
      '--plan', await writeJson(handoff.root, 'fixtures/plans/m7-cycle-2-review.json', reviewPlan),
    ]);
    result = await advance(handoff.root, plan, gates[7], version, goalEntryKey, [
      await descriptor(handoff.root, { id: reviewPlan.waiting_review.id, path: reviewPlan.waiting_review.path, record_type: 'cycle_review', status: 'waiting_human', version: '1.0.0' }),
    ]);
    version = result.cycle_version;
    const reviewDecision = {
      waiting_review_ref: reviewPlan.waiting_review.id,
      decided_review: { id: 'CRV-M7-C2-DECIDED-001', path: 'cycles/m7/cycle-2/reviews/crv-m7-c2-decided-001.md' },
      approval: { approved_by: 'Fixture Cycle 2 Reviewer', approved_at: '2026-08-27T00:04:00Z', decision_ref: 'fixture://decision/m7-cycle-2-review-001' },
      goal_results: reviewPlan.goal_results, test_scope: reviewPlan.test_scope,
    };
    const traceModule = new URL('../plugins/geo-expert/scripts/lib/cycle-trace.mjs', import.meta.url).href;
    const reviewScript = `import {readFile} from 'node:fs/promises';import {decideCycleReview} from ${JSON.stringify(traceModule)};const d=JSON.parse(await readFile(process.argv[2],'utf8'));const r=await decideCycleReview({workspace:process.argv[1],decision:d});console.log(JSON.stringify({...r,conversation_history_used:false}));`;
    const freshReview = await exec(process.execPath, [
      '--input-type=module', '-e', reviewScript, handoff.root,
      await writeJson(handoff.root, 'fixtures/plans/m7-cycle-2-review-decision.json', reviewDecision),
    ], { cwd: os.tmpdir() });
    assert.equal(JSON.parse(freshReview.stdout).conversation_history_used, false);
    await advance(handoff.root, plan, gates[8], version, goalEntryKey, [
      await descriptor(handoff.root, { id: reviewDecision.decided_review.id, path: reviewDecision.decided_review.path, record_type: 'cycle_review', status: 'decided', version: '1.0.0' }),
    ]);
    const completed = JSON.parse((await runNode(LIFECYCLE_CLI, [
      'trace', '--workspace', handoff.root, '--cycle', plan.cycle_id,
    ])).stdout);
    assert.equal(completed.status, 'completed');
    assert.equal(completed.completion_scope, 'full');
    assert.deepEqual(completed.errors, []);
    assert.equal(completed.real_myyshop_impact, false);
  } finally {
    await rm(handoff.root, { recursive: true });
  }
});
