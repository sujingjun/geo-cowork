import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { createRealSamplingWorkspace } from './helpers/real-sampling-fixtures.mjs';
import { writeObject } from './helpers/object-fixtures.mjs';
import { m6SchemaSamples } from './helpers/m6-fixtures.mjs';
import {
  realContext,
  realObject,
  putObject,
  putJson,
  jsonAt,
  ref,
  REAL_PLAN_PATH,
} from '../plugins/geo-expert/scripts/lib/real-journey-store.mjs';
import {
  buildCycleSnapshotPlan,
  materializeCycleSnapshot,
} from '../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import { completeReviewPlan } from '../plugins/geo-expert/scripts/geo-lifecycle.mjs';
import { assembleCycleReview } from '../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import {
  createOwnerPackage,
  acceptOwnerFeedback,
} from '../plugins/geo-expert/scripts/lib/owner-feedback.mjs';
import {
  buildRealReviewFields,
  decideRealReview,
  prepareRealNextCycle,
  selectRealNextGoal,
  approveRealNextGoal,
  assertRealCycleTwoBindings,
  validateRealNextGoalChoice,
} from '../plugins/geo-expert/scripts/lib/real-cycle-review.mjs';
import { validateObjectData } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { validateStrategyObject } from '../plugins/geo-expert/scripts/lib/strategy-profile.mjs';
import {
  sha256,
  stableStringify,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  prepareRealKnowledge,
  applyRealKnowledge,
} from '../plugins/geo-expert/scripts/lib/real-knowledge.mjs';

// Explicitly isolated state contracts: the fixture has no real business outcomes,
// model calls, production publication, or completed observation period.
async function owner(root, pack, { decision = 'approve', choice } = {}) {
  return acceptOwnerFeedback({
    workspace: root,
    text: `包：${pack.id}\n校验：${pack.sha256}\n决定：${decision}\n决定人：Isolated contract reviewer\n时间：${new Date().toISOString()}\n说明：Verify state contract only.\n${choice ? `下一目标：${choice}\n` : ''}`,
  });
}
async function packageAt(root, file) {
  const relative = file.replace(/\.md$/, '.json'),
    bytes = await readFile(path.join(root, relative));
  return { ...JSON.parse(bytes), sha256: sha256(bytes) };
}
async function fixture(t) {
  const root = await createRealSamplingWorkspace();
  t.after(() => rm(root, { recursive: true, force: true }));
  const { cycle, plan, graph } = await realContext(root),
    freeze = graph.byId.get(cycle.data.core_versions.input_snapshot.ref);
  const samples = m6SchemaSamples(),
    extra = [];
  for (const data of [samples.analytics_observation, samples.business_signal]) {
    delete data.test_scope;
    Object.assign(data, {
      execution_scope: 'authorized_real',
      cycle_ref: cycle.data.id,
      goal_ref: plan.goal_ref,
      run_ref: plan.run_ref,
    });
    if (data.adapter)
      Object.assign(data.adapter, { kind: 'ga4', access_mode: 'read_only' });
    extra.push(await putObject(root, 'cycles/m6/analytics', data));
  }
  const snap = await buildCycleSnapshotPlan({
    workspace: root,
    id: 'CIS-REAL-REVIEW-CONTRACT',
    snapshotKind: 'review',
    merchantRef: plan.merchant_ref,
    cycleRef: cycle.data.id,
    runRef: plan.run_ref,
    sourcePaths: [
      ...freeze.data.source_entries.map((e) => e.object_path),
      ...extra.map((o) => o.path),
    ],
    artifactPaths: freeze.data.artifact_entries.map((e) => ({
      role: e.role,
      path: e.source_path,
      media_type: e.media_type,
    })),
    baseFreezeSnapshotVersion: ref(freeze),
  });
  await materializeCycleSnapshot({ workspace: root, plan: snap });
  const query = graph.byId.get('Q-M6-TEST-001').data;
  const input = { evidence: [query] };
  const output = {
    perception_goal: 'inconclusive',
    observations: [
      'Contract fixture: zero measured change is not a positive result.',
    ],
    limitations: [
      'No actual business measurement is provided by this fixture.',
    ],
    next_candidates: [
      {
        kind: 'query_cluster',
        source_refs: [query.id],
        goal_statement: 'Clarify documented scope',
        success_question: 'What is the documented service scope?',
        query_cluster_key: 'scope',
        rationale: 'A distinct scope question grounded in the reviewed Query.',
        priority: 0,
      },
      {
        kind: 'query_cluster',
        source_refs: [query.id],
        goal_statement: 'Clarify known limitations',
        success_question: 'Which limitations are documented?',
        query_cluster_key: 'limits',
        rationale:
          'A distinct limitations question grounded in the reviewed Query.',
        priority: 1,
      },
    ],
  };
  const fields = buildRealReviewFields({
    output,
    snapshot: snap,
    input,
    goalRef: plan.goal_ref,
  });
  const waiting = await putObject(root, 'cycles/m6/reviews', {
    ...realObject(
      'CRV-REAL-CONTRACT-WAITING',
      'cycle_review',
      'waiting_human',
      'Isolated real-scope review contract',
    ),
    execution_scope: 'authorized_real',
    knowledge_base_ref: plan.knowledge_base_ref,
    merchant_ref: plan.merchant_ref,
    cycle_ref: cycle.data.id,
    reviewed_cycle_input_version: cycle.data.version,
    review_input_snapshot_version: {
      ref: snap.snapshot.id,
      version: snap.snapshot.version,
    },
    review_input_fingerprint: snap.manifest.fingerprint,
    ...fields,
  });
  cycle.data.aggregate_stage = 'review_waiting_human';
  cycle.data.goal_tracks[0].stage = 'review_waiting_human';
  await writeObject(root, cycle.path, cycle.data, cycle.content);
  const pack = await createOwnerPackage({
    workspace: root,
    id: 'OWNER-REVIEW-CONTRACT',
    kind: 'real_cycle_review',
    objects: [waiting],
    title: 'Isolated Review',
    body: 'No real business outcome; state contract only.',
  });
  const feedback = await owner(root, pack),
    decided = await decideRealReview(root, feedback);
  cycle.data.status = 'completed';
  cycle.data.aggregate_stage = 'review_decided';
  cycle.data.completion_scope = 'full';
  cycle.data.goal_tracks[0].stage = 'review_decided';
  cycle.data.cycle_review_version = {
    ref: decided.data.id,
    version: decided.data.version,
  };
  await writeObject(root, cycle.path, cycle.data, cycle.content);
  return { root, cycle, plan, snap, input, output, review: decided.data };
}
async function chosenGoal(f) {
  const prepared = await prepareRealNextCycle(f.root),
    pack = await packageAt(f.root, prepared.package);
  const { graph } = await realContext(f.root),
    candidates = pack.targets
      .map((t) => graph.byId.get(t.id))
      .filter((o) => o.data.record_type === 'cycle_goal_candidate');
  const chosen = candidates[1];
  const feedback = await owner(f.root, pack, { choice: chosen.data.id }),
    selected = await selectRealNextGoal(f.root, feedback);
  return { prepared, pack, candidates, chosen, feedback, selected };
}

test('real Review fields bind exact snapshot sources and preserve adverse/unknown outcomes', async (t) => {
  const f = await fixture(t),
    fields = buildRealReviewFields({
      output: f.output,
      snapshot: f.snap,
      input: f.input,
      goalRef: f.plan.goal_ref,
    });
  assert.equal(fields.goal_results[0].perception_goal, 'inconclusive');
  assert.match(fields.goal_results[0].observations[0], /zero/);
  assert.equal(fields.next_cycle_candidate_inputs.length, 2);
  assert.equal(
    fields.next_cycle_candidate_inputs[0].source_entries[0].object_id,
    'Q-M6-TEST-001',
  );
  for (const patch of [
    { source_refs: ['Q-UNKNOWN'] },
    { kind: 'product_gap' },
    { kind: 'content_gap' },
    { priority: -1 },
  ]) {
    const output = structuredClone(f.output);
    Object.assign(output.next_candidates[0], patch);
    assert.throws(
      () =>
        buildRealReviewFields({
          output,
          snapshot: f.snap,
          input: f.input,
          goalRef: f.plan.goal_ref,
        }),
      { code: 'REVIEW_GROUNDING_INVALID' },
    );
  }
});
test('real candidate batch and selection materialize with explicit scope and complete hash closure', async (t) => {
  const f = await fixture(t),
    result = await prepareRealNextCycle(f.root);
  assert.deepEqual(await prepareRealNextCycle(f.root), result);
  const { graph } = await realContext(f.root),
    objects = graph.objects.filter((o) =>
      o.data.record_type.startsWith('cycle_goal_'),
    );
  assert.equal(objects.length, 4);
  for (const object of objects) {
    assert.equal(object.data.test_scope, undefined);
    assert.equal(object.data.execution_scope, 'authorized_real');
    assert.equal(object.data.knowledge_base_ref, f.plan.knowledge_base_ref);
    validateObjectData(object.data);
    assert.deepEqual(validateStrategyObject(object.data).errors, []);
  }
  const batch = objects.find(
    (o) => o.data.record_type === 'cycle_goal_candidate_batch',
  );
  assert.equal(batch.data.ordered_candidates.length, 2);
  const bytes = await readFile(
    path.join(f.root, batch.data.generator_rule.artifact_path),
  );
  assert.equal(sha256(bytes), batch.data.generator_rule.sha256);
});
test('multiple candidates require a valid explicit choice before persisting approval', async (t) => {
  const f = await fixture(t),
    prepared = await prepareRealNextCycle(f.root),
    pack = await packageAt(f.root, prepared.package);
  await assert.rejects(
    validateRealNextGoalChoice(f.root, {
      package_id: pack.id,
      decision: 'approve',
    }),
    { code: 'GOAL_SELECTION_REQUIRED' },
  );
  await assert.rejects(
    validateRealNextGoalChoice(f.root, {
      package_id: pack.id,
      decision: 'approve',
      next_goal: 'not listed',
    }),
    { code: 'GOAL_SELECTION_REQUIRED' },
  );
  await assert.rejects(
    readFile(path.join(f.root, `reviews/decisions/${pack.id}.json`)),
    { code: 'ENOENT' },
  );
  const candidate = pack.targets.find((t) => t.id.startsWith('GCD-'));
  assert.equal(
    (
      await validateRealNextGoalChoice(f.root, {
        package_id: pack.id,
        decision: 'approve',
        next_goal: candidate.id,
      })
    ).ref,
    candidate.id,
  );
});
test('selected candidate is exact, all others are deferred, and Goal approval stays separate', async (t) => {
  const f = await fixture(t),
    choice = await chosenGoal(f);
  assert.deepEqual(
    await selectRealNextGoal(f.root, choice.feedback),
    choice.selected,
  );
  const pack = await packageAt(f.root, choice.selected.package),
    { graph } = await realContext(f.root),
    selection = pack.targets
      .map((t) => graph.byId.get(t.id))
      .find((o) => o.data.record_type === 'cycle_goal_selection');
  assert.deepEqual(
    selection.data.decision.selected_candidate_version,
    ref(choice.chosen),
  );
  assert.equal(selection.data.decision.deferred_candidate_versions.length, 1);
  assert.equal(selection.data.decision.rejected_candidate_versions.length, 0);
  assert.equal((await jsonAt(f.root, REAL_PLAN_PATH)).cycle_number, 1);
  await assert.rejects(approveRealNextGoal(f.root, choice.feedback), {
    code: 'OWNER_FEEDBACK_CONFLICT',
  });
  const approved = await owner(f.root, pack),
    result = await approveRealNextGoal(f.root, approved);
  assert.equal(result.waiting_knowledge_review, true);
  assert.deepEqual(await approveRealNextGoal(f.root, approved), result);
  const next = await jsonAt(f.root, REAL_PLAN_PATH);
  assert.equal(next.cycle_number, 2);
  assert.notEqual(next.knowledge.release_ref, f.plan.knowledge.release_ref);
  assert.equal(next.knowledge.english_answer, null);
  assert.deepEqual(next.selected_candidate_version, ref(choice.chosen));
  assert.deepEqual(next.knowledge.claim_refs, ['CLM-M6-TEST-001']);
  const state = await realContext(f.root);
  assert.equal(state.cycle, undefined);
  assert.equal(
    state.graph.byId.get(next.goal_ref).data.goal_statement,
    choice.chosen.data.proposed_goal.statement,
  );
  const query = state.graph.byId.get(
    state.graph.byId.get(next.query_set_ref).data.query_versions[0].ref,
  ).data;
  assert.equal(
    query.query_text,
    choice.chosen.data.proposed_goal.success_question,
  );
  assert.equal(
    query.extensions['geo.real_goal_query'].candidate_version.ref,
    choice.chosen.data.id,
  );
  await assertRealCycleTwoBindings(f.root, next, { requireKnowledge: false });
  await assert.rejects(assertRealCycleTwoBindings(f.root, next), {
    code: 'KNOWLEDGE_INPUT_ABSENT',
  });
});
test('candidate rule drift and a changed decided Review block next-goal execution', async (t) => {
  const f = await fixture(t),
    choice = await chosenGoal(f),
    pack = await packageAt(f.root, choice.selected.package),
    feedback = await owner(f.root, pack);
  const rule = `${f.plan.cycle_dir}/candidate-rule.json`,
    bytes = await readFile(path.join(f.root, rule));
  await writeFile(path.join(f.root, rule), '{}');
  await assert.rejects(approveRealNextGoal(f.root, feedback), {
    code: 'GOAL_CANDIDATE_INPUT_DRIFT',
  });
  await writeFile(path.join(f.root, rule), bytes);
  const { graph } = await realContext(f.root),
    review = graph.byId.get(f.review.id);
  review.data.next_cycle_candidate_inputs[0].goal_statement =
    'Changed after approval';
  await writeObject(f.root, review.path, review.data, review.content);
  await assert.rejects(approveRealNextGoal(f.root, feedback), {
    code: 'GOAL_CANDIDATE_INPUT_DRIFT',
  });
});

test('Cycle 2 accepts only its separately approved goal-specific knowledge slice', async (t) => {
  const f = await fixture(t),
    choice = await chosenGoal(f),
    goalPack = await packageAt(f.root, choice.selected.package);
  await approveRealNextGoal(f.root, await owner(f.root, goalPack));
  const next = await jsonAt(f.root, REAL_PLAN_PATH);
  // Explicit human-supplied input, not a fabricated model output. The .invalid
  // fixture website is recorded as unavailable without a network request.
  next.knowledge.english_answer =
    'Human supplied isolated contract answer; evidence limitations remain.';
  await writeFile(path.join(f.root, REAL_PLAN_PATH), stableStringify(next, 2));
  const prepared = await prepareRealKnowledge(f.root),
    knowledgePack = await packageAt(f.root, prepared.package);
  const approved = await owner(f.root, knowledgePack);
  await applyRealKnowledge(f.root, approved);
  const binding = await assertRealCycleTwoBindings(f.root, next);
  assert.equal(binding.goal_ref, next.goal_ref);
  const { graph } = await realContext(f.root),
    release = graph.byId.get(next.knowledge.release_ref),
    answer = graph.byId.get(next.knowledge.answer_ref);
  assert.notEqual(release.data.approval.decision_ref, next.goal_approval_ref);
  assert.equal(answer.data.direct_answer, next.knowledge.english_answer);
  answer.data.direct_answer = 'Changed after knowledge approval';
  await writeObject(f.root, answer.path, answer.data, answer.content);
  await assert.rejects(assertRealCycleTwoBindings(f.root, next), {
    code: 'KNOWLEDGE_INPUT_DRIFT',
  });
});

test('interrupted approved Cycle 2 publication resumes its exact object bundle and root plan', async (t) => {
  const f = await fixture(t),
    choice = await chosenGoal(f),
    pack = await packageAt(f.root, choice.selected.package),
    feedback = await owner(f.root, pack);
  const first = await approveRealNextGoal(f.root, feedback),
    next = await jsonAt(f.root, REAL_PLAN_PATH);
  await writeFile(
    path.join(f.root, REAL_PLAN_PATH),
    stableStringify(f.plan, 2),
  );
  await rm(path.join(f.root, `${next.cycle_dir}/approved-inputs`), {
    recursive: true,
  });
  assert.deepEqual(await prepareRealNextCycle(f.root), first);
  assert.deepEqual(await jsonAt(f.root, REAL_PLAN_PATH), next);
  await assertRealCycleTwoBindings(f.root, next, { requireKnowledge: false });
});

test('real Review assembly creates a scoped review snapshot through the actual cutoff interface', async (t) => {
  const f = await fixture(t),
    { graph } = await realContext(f.root),
    freeze = graph.byId.get(f.cycle.data.core_versions.input_snapshot.ref);
  const gate = await buildCycleSnapshotPlan({
    workspace: f.root,
    id: 'CIS-REAL-ASSEMBLY-ANALYTICS',
    snapshotKind: 'transition',
    merchantRef: f.plan.merchant_ref,
    cycleRef: f.cycle.data.id,
    runRef: f.plan.run_ref,
    sourcePaths: f.snap.source_entries.map((e) => e.object_path),
    artifactPaths: f.snap.artifact_entries.map((e) => ({
      role: e.role,
      path: e.source_path,
      media_type: e.media_type,
    })),
  });
  await materializeCycleSnapshot({ workspace: f.root, plan: gate });
  const transition = m6SchemaSamples().cycle_transition;
  delete transition.test_scope;
  Object.assign(transition, {
    id: 'CTR-REAL-ASSEMBLY-ANALYTICS',
    cycle_ref: f.cycle.data.id,
    goal_ref: f.plan.goal_ref,
    execution_scope: 'authorized_real',
    merchant_ref: f.plan.merchant_ref,
    knowledge_base_ref: f.plan.knowledge_base_ref,
    input_snapshot_version: ref(freeze),
    gate_snapshot_version: { ref: gate.snapshot.id, version: '1.0.0' },
    from_stage: 'answer_retest_completed',
    to_stage: 'analytics_recorded',
    required_gate_entry_keys: [gate.source_entries[0].entry_key],
  });
  await putObject(f.root, 'cycles/m6/transitions', transition);
  Object.assign(f.cycle.data, {
    status: 'active',
    aggregate_stage: 'analytics_recorded',
    completion_scope: 'none',
    cycle_review_version: null,
    transition_refs: [transition.id],
  });
  f.cycle.data.goal_tracks[0].stage = 'analytics_recorded';
  await writeObject(f.root, f.cycle.path, f.cycle.data, f.cycle.content);
  const request = await completeReviewPlan(f.root, {
    merchant_ref: f.plan.merchant_ref,
    cycle_ref: f.cycle.data.id,
    review_snapshot: { id: 'CIS-REAL-ASSEMBLY-REVIEW' },
    waiting_review: {
      id: 'CRV-REAL-ASSEMBLY-WAITING',
      path: 'cycles/m6/reviews/assembly-waiting.md',
    },
  });
  const snapshot = await buildCycleSnapshotPlan({
    workspace: f.root,
    id: request.review_snapshot.id,
    snapshotKind: 'review',
    merchantRef: f.plan.merchant_ref,
    cycleRef: f.cycle.data.id,
    runRef: request.run_ref,
    sourcePaths: request.review_snapshot.source_paths,
    artifactPaths: request.review_snapshot.artifact_paths,
    baseFreezeSnapshotVersion:
      request.review_snapshot.base_freeze_snapshot_version,
    preReviewTransitionSnapshotVersions:
      request.review_snapshot.pre_review_transition_snapshot_versions,
    preReviewEntryKeys: request.review_snapshot.pre_review_entry_keys,
  });
  Object.assign(
    request,
    buildRealReviewFields({
      output: f.output,
      snapshot,
      input: f.input,
      goalRef: f.plan.goal_ref,
    }),
  );
  const assembled = await assembleCycleReview({
    workspace: f.root,
    plan: request,
  });
  assert.equal(assembled.data.execution_scope, 'authorized_real');
  assert.equal(assembled.data.test_scope, undefined);
  assert.equal(assembled.data.title, 'Real Cycle Review');
  assert.equal(
    assembled.data.review_input_fingerprint,
    snapshot.manifest.fingerprint,
  );
  assert.equal(assembled.data.next_cycle_candidate_inputs.length, 2);
  assert.equal(
    (await assembleCycleReview({ workspace: f.root, plan: request })).action,
    'kept',
  );
});
