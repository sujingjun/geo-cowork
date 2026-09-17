import { readFile } from 'node:fs/promises';
import {
  findJourneyCycle,
  journeyObjectPath,
  refVersion,
} from './journey-cycle-inputs.mjs';
import {
  writeCreateOnly,
  resolveWithin,
  stableStringify,
  atomicWrite,
} from './workspace-paths.mjs';
import {
  ingestFixtureObservation,
  computeBusinessSignal,
} from './analytics-cycle.mjs';
import { completeReviewPlan } from '../geo-lifecycle.mjs';
import { buildCycleSnapshotPlan } from './cycle-snapshot.mjs';
import { assembleCycleReview, decideCycleReview } from './cycle-trace.mjs';
import { createOwnerPackage } from './owner-feedback.mjs';
import { serializeMarkdownObject } from './object-contract.mjs';

export async function observeJourneyAnalytics(workspace) {
  const { context, cycle, graph } = await findJourneyCycle(workspace);
  const suffix = `C${context.cycle_number}`;
  const oid = `ANO-GEO-${suffix}`;
  const sid = `BSIG-GEO-${suffix}`;
  if (graph.byId.has(oid) && graph.byId.has(sid))
    return [graph.byId.get(oid), graph.byId.get(sid)];
  const starts = new Date(Date.parse(context.created_at) + 2 * 86400000);
  const ends = new Date(Date.parse(context.created_at) + 9 * 86400000);
  const input = {
    schema_version: 'm6-fixture-analytics/1.0.0',
    time_window: {
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      as_of: ends.toISOString(),
    },
    metrics: [
      {
        metric_id: 'ai_visits',
        value: context.seed.analytics.visits,
        unit: 'visits',
        dimensions: { source: 'synthetic' },
      },
      {
        metric_id: 'ai_registrations',
        value: context.seed.analytics.registrations,
        unit: 'registrations',
        dimensions: { source: 'synthetic' },
      },
    ],
  };
  const inputPath = `cycles/m6/analytics/${suffix}-raw.json`;
  await writeCreateOnly(workspace, inputPath, stableStringify(input, 2), {
    idempotent: true,
  });
  const common = {
    merchant_ref: context.test_scope.merchant_ref,
    cycle_ref: context.cycle_ref,
    goal_ref: context.goal_ref,
    test_scope: context.test_scope,
    run_ref: `RUN-GEO-ANALYTICS-${suffix}`,
    measurement_contract_path: 'execution/contracts/measurement-contract.json',
    sensitive_data_policy_path:
      'execution/contracts/sensitive-data-policy.json',
  };
  const observation = await ingestFixtureObservation({
    workspace,
    plan: {
      ...common,
      input_path: inputPath,
      raw_output_path: 'raw/analytics.json',
      adapter: {
        kind: 'fixture',
        name: 'aggregate-business-input',
        version: '1.0.0',
        access_mode: 'fixture',
        authorization_ref: 'fixture://independent-business-input',
      },
      observation: {
        id: oid,
        path: journeyObjectPath('cycles/m6/analytics', oid),
      },
    },
  });
  const signal = await computeBusinessSignal({
    workspace,
    plan: {
      ...common,
      observation_versions: [{ ref: oid, version: observation.data.version }],
      rule_path: 'execution/contracts/signal-rule.json',
      signal: { id: sid, path: journeyObjectPath('cycles/m6/analytics', sid) },
    },
  });
  return [
    {
      data: observation.data,
      path: journeyObjectPath('cycles/m6/analytics', oid),
    },
    { data: signal.data, path: journeyObjectPath('cycles/m6/analytics', sid) },
  ];
}
export async function assembleJourneyReview(workspace) {
  const { context, cycle, graph } = await findJourneyCycle(workspace);
  const suffix = `C${context.cycle_number}`;
  const request = {
    merchant_ref: context.test_scope.merchant_ref,
    cycle_ref: context.cycle_ref,
    test_scope: context.test_scope,
    review_snapshot: { id: `CIS-GEO-${suffix}-REVIEW` },
    waiting_review: {
      id: `CRV-GEO-${suffix}-WAITING`,
      path: journeyObjectPath('cycles/m6/reviews', `CRV-GEO-${suffix}-WAITING`),
    },
    goal_results: [],
    next_cycle_candidate_inputs: [],
  };
  const plan = await completeReviewPlan(workspace, request);
  const snapshot = await buildCycleSnapshotPlan({
    workspace,
    id: plan.review_snapshot.id,
    snapshotKind: 'review',
    merchantRef: plan.merchant_ref,
    cycleRef: plan.cycle_ref,
    runRef: plan.run_ref,
    sourcePaths: plan.review_snapshot.source_paths,
    artifactPaths: plan.review_snapshot.artifact_paths,
    baseFreezeSnapshotVersion:
      plan.review_snapshot.base_freeze_snapshot_version,
    preReviewTransitionSnapshotVersions:
      plan.review_snapshot.pre_review_transition_snapshot_versions,
    preReviewEntryKeys: plan.review_snapshot.pre_review_entry_keys,
  });
  const goalEntry = snapshot.source_entries.find(
    (e) => e.object_id === context.goal_ref,
  );
  const signalEntry = snapshot.source_entries.find(
    (e) => e.record_type === 'business_signal',
  );
  const findingEntry =
    snapshot.source_entries.find(
      (e) =>
        e.record_type === 'finding' &&
        graph.byId.get(e.object_id)?.data.diagnosis_class === 'evidence_gap',
    ) ??
    snapshot.source_entries.find(
      (e) =>
        e.record_type === 'finding' &&
        graph.byId.get(e.object_id)?.data.diagnosis_class === 'content_gap',
    );
  plan.goal_results = [
    {
      goal_entry_key: goalEntry.entry_key,
      perception_goal: 'inconclusive',
      observations: [
        `${suffix}: 60 baseline and 60 post-change synthetic slots processed by real DeepSeek.`,
        'Zero registrations is preserved as no signal; no causal effect is claimed.',
      ],
      business_signal_entry_keys: [signalEntry.entry_key],
      limitations: [
        'Synthetic external inputs and simulated publication; real model execution.',
        'Uncontrolled third-party publication and unresolved evidence remain outside completed actions.',
      ],
      forbidden_conclusions: ['Do not infer real MyyShop impact or causality.'],
    },
  ];
  const descriptor = (e) => ({
    entry_key: e.entry_key,
    object_id: e.object_id,
    record_type: e.record_type,
    object_version: e.object_version,
    file_sha256: e.file_sha256,
  });
  if (findingEntry)
    plan.next_cycle_candidate_inputs = [
      {
        candidate_kind: graph.byId.get(findingEntry.object_id).data
          .diagnosis_class,
        source_goal_entry: descriptor(goalEntry),
        source_entries: [descriptor(findingEntry)],
        goal_statement:
          'Improve eligibility and evidence clarity using the previous cycle review.',
        success_question:
          'Can an eligible creator identify the rehearsal terms and evidence limits?',
        query_cluster_key: 'eligibility-evidence',
        evidence_gaps: context.seed.entries
          .filter((e) => !e.evidence || e.superseded)
          .map((e) => e.fact),
        risks: ['Synthetic rehearsal only'],
        rank_inputs: { priority: 1 },
        rationale: 'Address a traceable unresolved diagnosis from this review.',
      },
    ];
  const assembled = await assembleCycleReview({ workspace, plan });
  await writeCreateOnly(
    workspace,
    `cycles/m6/reviews/${suffix}-assembly-plan.json`,
    stableStringify(plan, 2),
    { idempotent: true },
  );
  const pack = await createOwnerPackage({
    workspace,
    id: `OWNER-${suffix}-CYCLE-REVIEW`,
    kind: 'cycle_review',
    title: `${suffix} cycle review and next Goal`,
    objects: [{ data: assembled.data, path: request.waiting_review.path }],
    body: `## Results\n${plan.goal_results[0].observations.join('\n')}\n\n## Limitations\n${plan.goal_results[0].limitations.join('\n')}\n\n## Next candidate\n${plan.next_cycle_candidate_inputs.map((c) => c.goal_statement).join('\n')}\n\nOwner must provide an independent next Goal selection after this Review.`,
  });
  return {
    waiting_human: true,
    package: pack.file,
    review_ref: assembled.data.id,
  };
}
export async function decideJourneyReview(workspace, feedback) {
  if (feedback.decision.decision !== 'approve') return { waiting_human: true };
  const { context, graph } = await findJourneyCycle(workspace);
  const waiting = graph.byId.get(feedback.package.targets[0].id);
  const id = `CRV-GEO-C${context.cycle_number}-DECIDED`;
  return decideCycleReview({
    workspace,
    decision: {
      waiting_review_ref: waiting.data.id,
      decided_review: { id, path: journeyObjectPath('cycles/m6/reviews', id) },
      approval: {
        approved_by: feedback.decision.actor,
        approved_at: feedback.decision.at,
        decision_ref: feedback.decision_ref,
      },
      goal_results: waiting.data.goal_results,
      test_scope: context.test_scope,
    },
  });
}
