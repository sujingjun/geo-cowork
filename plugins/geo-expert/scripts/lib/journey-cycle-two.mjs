import { readFile } from 'node:fs/promises';
import {
  findJourneyCycle,
  journeyObjectPath,
  refVersion,
} from './journey-cycle-inputs.mjs';
import { transitionRun } from './run-store.mjs';
import { ensureJourneyRun } from './journey-sampling.mjs';
import {
  writeCreateOnly,
  stableStringify,
  resolveWithin,
  atomicWrite,
} from './workspace-paths.mjs';
import { proposeCycleTwo } from './cycle-two-proposal.mjs';
import {
  buildDecidedGoalSelection,
  materializeGoalSelection,
} from './cycle-goal-selection.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import { createOwnerPackage } from './owner-feedback.mjs';
import { scopedObject, writeKnowledgeObject } from './knowledge-workspace.mjs';
import { generateKnowledgeQueries } from './query-inputs.mjs';
import { modelHash } from './model-client.mjs';

export async function prepareJourneyCycleTwo(workspace) {
  let { context, graph } = await findJourneyCycle(workspace);
  const run = 'RUN-GEO-C2-CANDIDATES';
  const review = graph.byId.get('CRV-GEO-C1-DECIDED');
  await ensureJourneyRun(
    workspace,
    run,
    { [review.data.id]: review.data.version },
    context.test_scope,
    context.created_at,
    'geo-lifecycle',
  );
  const parentCycle = graph.byId.get(review.data.cycle_ref).data;
  await transitionRun({
    workspace,
    runId: run,
    status: 'running',
    now: review.data.updated_at,
    patch: {
      merchant_ref: context.test_scope.merchant_ref,
      cycle_ref: parentCycle.id,
      cycle_version: parentCycle.version,
      transition_plan_sha256: modelHash({
        review: refVersion(review),
        purpose: 'next_cycle_candidates',
      }),
      lease: {
        scope_key: `${parentCycle.id}:next-cycle-candidates`,
        owner_id: 'knowledge-journey',
        revision: 1,
        acquired_at: review.data.updated_at,
        heartbeat_at: review.data.updated_at,
        expires_at: new Date(
          Date.parse(review.data.updated_at) + 60000,
        ).toISOString(),
      },
    },
  });
  const rulePath = `runs/${run}/outputs/candidate-rule.json`;
  await writeCreateOnly(
    workspace,
    rulePath,
    stableStringify(
      {
        schema_version: 'm7-cycle-goal-candidate-rule/1.0.0',
        id: 'geo-e2e-candidate-rule-v1',
        version: '1.0.0',
        kind_order: {
          query_cluster: 1,
          content_gap: 2,
          evidence_gap: 3,
          severe_misperception: 4,
          recommendation_reason: 5,
          product_gap: 6,
        },
        hidden_score: false,
        real_execution_authorized: false,
        derived_fields: {
          rationale_template:
            'Address reviewed {candidate_kind} using its exact source snapshot.',
          limitations: [
            'Synthetic rehearsal; source input remains exact-pinned.',
          ],
        },
      },
      2,
    ),
    { idempotent: true },
  );
  const result = await proposeCycleTwo({
    workspace,
    reviewId: review.data.id,
    plan: {
      network_access: false,
      real_execution_authorized: false,
      cycle_number: 2,
      run_ref: run,
      candidate_generator_rule_path: rulePath,
      predecessor_review_version: refVersion(review),
    },
  });
  graph = await loadWorkspaceGraph({ workspace });
  const selection = [...graph.objects].find(
    (o) =>
      o.data.record_type === 'cycle_goal_selection' &&
      o.data.status === 'draft' &&
      o.data.source_cycle_review_version.ref === review.data.id,
  );
  const candidates = result.candidates.map((c) => graph.byId.get(c.ref));
  const pack = await createOwnerPackage({
    workspace,
    id: 'OWNER-C2-GOAL-SELECTION',
    kind: 'goal_selection',
    title: 'Choose the next Goal from Cycle 1 Review',
    objects: [selection, ...candidates],
    body: candidates
      .map(
        (c) =>
          `- ${c.data.id}: ${c.data.proposed_goal.statement}\n  Basis: ${c.data.rationale}`,
      )
      .join('\n'),
  });
  return {
    waiting_human: true,
    package: pack.file,
    candidates: result.candidates,
  };
}
export async function selectJourneyCycleTwo(workspace, feedback) {
  if (feedback.decision.decision !== 'approve') return { waiting_human: true };
  let { context, graph } = await findJourneyCycle(workspace);
  const draft = feedback.package.targets
    .map((t) => graph.byId.get(t.id))
    .find((o) => o.data.record_type === 'cycle_goal_selection');
  const candidates = feedback.package.targets
    .map((t) => graph.byId.get(t.id))
    .filter((o) => o.data.record_type === 'cycle_goal_candidate');
  if (candidates.length !== 1)
    throw Object.assign(
      new Error('Select an explicit candidate when there is more than one'),
      { code: 'GOAL_SELECTION_REQUIRED' },
    );
  const selected = candidates[0];
  const approval = {
    approved_by: feedback.decision.actor,
    approved_at: feedback.decision.at,
    decision_ref: feedback.decision_ref,
  };
  const data = buildDecidedGoalSelection({
    context: {
      created_at: feedback.decision.at,
      test_scope: context.test_scope,
      merchant_ref: context.test_scope.merchant_ref,
    },
    draft: draft.data,
    selected: refVersion(selected),
    reason: feedback.decision.reason,
    approval,
  });
  await materializeGoalSelection({
    workspace,
    path: journeyObjectPath('cycles/m7/selections', data.id),
    data,
    prior: draft.data,
  });
  await writeCreateOnly(
    workspace,
    'cycles/preparation/knowledge-input-C1.json',
    stableStringify(context, 2),
    { idempotent: true },
  );
  const next = {
    ...structuredClone(context),
    cycle_number: 2,
    created_at: new Date(
      Date.parse(context.created_at) + 14 * 86400000,
    ).toISOString(),
    goal_ref: 'GOAL-GEO-E2E-C2',
    cycle_ref: 'CYC-GEO-E2E-C2',
    goal_selection_ref: data.id,
    selected_candidate_ref: selected.data.id,
    predecessor_review_ref: 'CRV-GEO-C1-DECIDED',
    selected_query_refs: [],
    knowledge_package_id: 'OWNER-KNOWLEDGE-C2',
  };
  for (const asset of next.seed.assets)
    if (['own', 'official_external'].includes(asset.control))
      asset.html = await readFile(
        resolveWithin(workspace, `assets/published/C1/${asset.key}.html`),
        'utf8',
      );
  for (const observation of next.seed.cycle_two_assets ?? []) {
    const existing = next.seed.assets.find((a) => a.key === observation.key);
    if (existing) Object.assign(existing, observation);
    else next.seed.assets.push(observation);
  }
  const goal = await writeKnowledgeObject(
    workspace,
    'cycles/preparation/goal-c2.md',
    {
      ...scopedObject(
        next,
        next.goal_ref,
        'perception_goal',
        'candidate',
        'Cycle 2 selected Goal',
      ),
      goal_statement: selected.data.proposed_goal.statement,
      success_question: selected.data.proposed_goal.success_question,
    },
  );
  const generated = await generateKnowledgeQueries({
    workspace,
    goal: next.goal_ref,
    knowledgeFiles: next.knowledge_paths,
    clues: [
      {
        source_review: next.predecessor_review_ref,
        selected_goal: selected.data.proposed_goal,
      },
    ],
    count: 6,
    provider: next.provider,
    model: next.model ?? undefined,
  });
  next.selected_query_refs = generated.queries.map((q) => q.id);
  graph = await loadWorkspaceGraph({ workspace });
  const pack = await createOwnerPackage({
    workspace,
    id: next.knowledge_package_id,
    kind: 'knowledge',
    title: 'Approve the independently selected Cycle 2 Goal and questions',
    objects: [
      goal,
      ...next.selected_query_refs.map((id) => graph.byId.get(id)),
    ],
    body: `Goal: ${selected.data.proposed_goal.statement}\n\n${next.selected_query_refs.map((id) => `- ${graph.byId.get(id).data.query_text}`).join('\n')}\n\nReuses supported knowledge; starts from the actual Cycle 1 published rehearsal pages. New six-question five-platform/two-slot protocol and independent next-week simulated retest.`,
  });
  await atomicWrite(
    workspace,
    'cycles/preparation/knowledge-input.json',
    stableStringify(next, 2),
  );
  return {
    waiting_human: true,
    package: pack.file,
    selected_goal: next.goal_ref,
  };
}
