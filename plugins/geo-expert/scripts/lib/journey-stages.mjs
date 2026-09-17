import {
  findJourneyCycle,
  journeyObjectPath,
} from './journey-cycle-inputs.mjs';
import {
  collectJourneyAnswers,
  approveJourneyAnswers,
  aggregateJourneyAnswers,
} from './journey-sampling.mjs';
import {
  diagnoseJourney,
  approveJourneyAdoption,
  publishJourneyAssets,
  confirmJourneyPublication,
  retestJourneySites,
  createJourneyEvidencePlans,
} from './journey-diagnosis.mjs';
import {
  observeJourneyAnalytics,
  assembleJourneyReview,
  decideJourneyReview,
} from './journey-review.mjs';
import { advanceJourney, journeyDecision } from './journey-progress.mjs';
import { traceCycle } from './cycle-trace.mjs';

export async function continueJourneyStages(workspace) {
  for (let step = 0; step < 12; step++) {
    let { cycle, context, graph } = await findJourneyCycle(workspace);
    const suffix = `C${context.cycle_number}`;
    const stage = cycle.data.aggregate_stage;
    const track = cycle.data.goal_tracks[0];
    if (stage === 'frozen' || stage === 'technical_retest_completed') {
      const phase = stage === 'frozen' ? 'BASE' : 'AFTER';
      const purpose = stage === 'frozen' ? 'baseline' : 'post_change_retest';
      if (
        !(await journeyDecision(workspace, `OWNER-${suffix}-${phase}-ANSWERS`))
      )
        return collectJourneyAnswers(workspace, purpose);
      const aggs = await aggregateJourneyAnswers(workspace, purpose);
      ({ graph } = await findJourneyCycle(workspace));
      const sampleIds = aggs.flatMap((a) =>
        a.data.selected_sample_versions.map((v) => v.ref),
      );
      const reviews = aggs.flatMap((a) =>
        a.data.answer_review_versions.map((v) => v.ref),
      );
      await advanceJourney(
        workspace,
        purpose === 'baseline'
          ? 'baseline_recorded'
          : 'answer_retest_completed',
        [...sampleIds, ...reviews, ...aggs],
      );
      continue;
    }
    if (stage === 'baseline_recorded') {
      const result = await diagnoseJourney(workspace);
      if (result.needs_input) return result;
      ({ graph } = await findJourneyCycle(workspace));
      await advanceJourney(workspace, 'diagnosis_ready', [
        ...result.finding_refs,
        ...result.proposal_refs,
        ...(result.evidence_plan_refs ?? []),
      ]);
      return result;
    }
    if (stage === 'diagnosis_ready') {
      const decision = await journeyDecision(
        workspace,
        `OWNER-${suffix}-ADOPTION`,
      );
      if (!decision) return { waiting_human: true };
      const adoptions = graph.objects.filter(
        (o) =>
          o.data.record_type === 'adoption_record' &&
          o.data.status === 'decided' &&
          o.data.id.includes(`-${suffix}-`),
      );
      const none = adoptions.every((o) =>
        o.data.decisions.every((d) => d.decision === 'rejected'),
      );
      await advanceJourney(
        workspace,
        none ? 'cancelled_no_adoption' : 'adoption_decided',
        [
          ...adoptions,
          ...adoptions.map((o) => graph.byId.get(o.data.proposal_ref)),
        ],
      );
      continue;
    }
    if (stage === 'adoption_decided') {
      if (!(await journeyDecision(workspace, `OWNER-${suffix}-PUBLICATION-V2`)))
        return publishJourneyAssets(workspace);
      const publications = graph.objects.filter(
        (o) =>
          o.data.record_type === 'asset_publication' &&
          o.data.status === 'confirmed' &&
          o.data.id.includes(`-${suffix}-`),
      );
      await advanceJourney(workspace, 'publication_confirmed', publications);
      continue;
    }
    if (stage === 'publication_confirmed') {
      const results = await retestJourneySites(workspace);
      await advanceJourney(
        workspace,
        'technical_retest_completed',
        results.flatMap((r) => [
          r.run_ref,
          ...r.finding_refs,
          ...r.evidence_refs,
        ]),
      );
      continue;
    }
    if (stage === 'answer_retest_completed') {
      const objects = [
        ...(await observeJourneyAnalytics(workspace)),
        ...(await createJourneyEvidencePlans(workspace)),
      ];
      await advanceJourney(workspace, 'analytics_recorded', objects);
      continue;
    }
    if (stage === 'analytics_recorded') {
      const result = await assembleJourneyReview(workspace);
      await advanceJourney(workspace, 'review_waiting_human', [
        result.review_ref,
      ]);
      return result;
    }
    if (stage === 'review_waiting_human') {
      if (!(await journeyDecision(workspace, `OWNER-${suffix}-CYCLE-REVIEW`)))
        return { waiting_human: true };
      await advanceJourney(workspace, 'review_decided', [
        `CRV-GEO-${suffix}-DECIDED`,
      ]);
      continue;
    }
    if (stage === 'review_decided') {
      const trace = await traceCycle({ workspace, cycleId: cycle.data.id });
      if (!trace.lifecycle_ready)
        throw Object.assign(new Error('Completed cycle trace failed'), {
          code: 'TRACE_INCOMPLETE',
          diagnostics: trace.errors,
        });
      if (context.cycle_number === 1)
        return (await import('./journey-cycle-two.mjs')).prepareJourneyCycleTwo(
          workspace,
        );
      return { completed: true, cycle: cycle.data.id, stage, trace };
    }
    if (stage === 'cancelled_no_adoption')
      return { cancelled: true, cycle: cycle.data.id };
    throw new Error(`Unsupported stage: ${stage}`);
  }
  throw new Error('Unexpected transition loop');
}
export async function applyJourneyFeedback(workspace, feedback) {
  if (feedback.package.kind === 'answer_review')
    return approveJourneyAnswers(workspace, feedback);
  if (feedback.package.kind === 'adoption')
    return approveJourneyAdoption(workspace, feedback);
  if (feedback.package.kind === 'publication')
    return confirmJourneyPublication(workspace, feedback);
  if (feedback.package.kind === 'cycle_review')
    return decideJourneyReview(workspace, feedback);
  if (feedback.package.kind === 'goal_selection')
    return (await import('./journey-cycle-two.mjs')).selectJourneyCycleTwo(
      workspace,
      feedback,
    );
  throw new Error(`Unsupported feedback kind: ${feedback.package.kind}`);
}
