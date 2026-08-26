import {
  acquireAnswerLease,
  completeAnswerStep,
  initializeAnswerRun,
  releaseAnswerLease,
} from './answer-run.mjs';
import {
  assertManualAnswerPrivacy,
  materializeManualSample,
} from './answer-sample.mjs';
import { materializeSourceClassification } from './citation-analysis.mjs';
import {
  materializeCitationObservation,
  materializeCitationSourcePair,
} from './source-registry.mjs';
import { readRun, transitionRun } from './run-store.mjs';
import { stableStringify, writeCreateOnly } from './workspace-paths.mjs';

export class ManualAnswerError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ManualAnswerError';
    this.code = code;
    Object.assign(this, details);
  }
}

function validateManualPlan(plan) {
  if (plan.schema_version !== 'm5-manual-sample-plan-v1'
      || plan.purpose !== 'exploratory'
      || plan.profile?.data?.collection_method !== 'manual'
      || !plan.authorization_ref?.startsWith('workspace://')
      || !plan.sample?.id
      || !Array.isArray(plan.sample.citations)) {
    throw new ManualAnswerError('M5_FIELD_REQUIRED', 'manual Sample plan 合同不完整');
  }
  const serialized = stableStringify(plan);
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(serialized)) {
    throw new ManualAnswerError('PRIVACY_SCOPE_VIOLATION', 'manual plan 不得保存账号邮箱');
  }
  const ids = new Set();
  const positions = new Set();
  for (const occurrence of plan.sample.citations) {
    const sourceModes = Number(Boolean(occurrence.existing_source_ref)) + Number(Boolean(occurrence.source));
    if (!occurrence.id || !occurrence.path || sourceModes !== 1
        || ids.has(occurrence.id) || positions.has(occurrence.occurrence_index)) {
      throw new ManualAnswerError('CITATION_SOURCE_PAIR_INCOMPLETE', 'manual Citation plan 冲突');
    }
    ids.add(occurrence.id);
    positions.add(occurrence.occurrence_index);
  }
  return plan;
}

async function complete({ workspace, runId, ownerId, slotKey, step, proof, now, ...rest }) {
  return completeAnswerStep({
    workspace,
    runId,
    ownerId,
    slotKey,
    step,
    proof,
    now,
    ...rest,
  });
}

export async function ingestManualSample({ workspace, plan, answerText }) {
  validateManualPlan(plan);
  assertManualAnswerPrivacy(answerText);
  const inputPath = `runs/${plan.run.id}/inputs/manual-sample-plan.json`;
  await writeCreateOnly(
    workspace,
    inputPath,
    stableStringify(plan, 2),
    { idempotent: true, conflictCode: 'AGGREGATION_INPUT_DRIFT' },
  );
  await initializeAnswerRun({ workspace, plan, now: plan.sample.captured_at });
  const ownerId = `manual-import-${process.pid}`;
  await acquireAnswerLease({
    workspace,
    runId: plan.run.id,
    ownerId,
    now: plan.sample.captured_at,
    ttlMs: 60 * 60 * 1000,
  });
  const citationRefs = [];
  const sourceRefs = [];
  const classificationRefs = [];
  let sample;
  try {
    const run = await readRun({ workspace, runId: plan.run.id });
    const slot = run.data.sample_slots[0];
    for (const [step, proof] of [
      ['profile_validated', `profile:${plan.profile.data.profile_fingerprint}`],
      ['authorization_checked', plan.authorization_ref],
      ['session_prepared', 'owner-manual-new-session'],
      ['query_submitted', `owner-manual-submit:${plan.query_version.ref}`],
      ['terminal_state_observed', `owner-manual-outcome:${plan.sample.outcome}`],
    ]) {
      await complete({
        workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
        step, proof, now: plan.sample.captured_at,
      });
    }
    sample = await materializeManualSample({ workspace, plan, answerText });
    await complete({
      workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
      step: 'raw_artifacts_written', proof: sample.raw_manifest_sha256,
      now: plan.sample.captured_at,
    });
    await complete({
      workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
      step: 'sample_metadata_written', proof: sample.id, now: plan.sample.captured_at,
      attemptRef: sample.id, selectedSampleRef: sample.id,
    });
    await complete({
      workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
      step: 'citation_source_plan_frozen',
      proof: `citation-count:${plan.sample.citations.length}`,
      now: plan.sample.captured_at,
    });
    for (const occurrence of plan.sample.citations) {
      const materialized = occurrence.existing_source_ref
        ? await materializeCitationObservation({
          workspace, sample, occurrence, now: plan.sample.captured_at,
        })
        : await materializeCitationSourcePair({
          workspace, sample, occurrence, now: plan.sample.captured_at,
        });
      const sourceId = occurrence.existing_source_ref ?? materialized.source_ref;
      citationRefs.push(occurrence.id);
      sourceRefs.push(sourceId);
      const classification = await materializeSourceClassification({
        workspace,
        sourceId,
        citationIds: [occurrence.id],
        plan: occurrence.classification,
        now: plan.sample.captured_at,
      });
      classificationRefs.push(classification.id);
    }
    await complete({
      workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
      step: 'citations_and_sources_materialized',
      proof: `citation-count:${citationRefs.length}`,
      now: plan.sample.captured_at,
    });
    await complete({
      workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
      step: 'candidate_classifications_materialized',
      proof: `classification-count:${classificationRefs.length}`,
      now: plan.sample.captured_at,
    });
  } finally {
    await releaseAnswerLease({ workspace, runId: plan.run.id, ownerId });
  }
  const current = await readRun({ workspace, runId: plan.run.id });
  if (current.data.status !== 'completed') {
    await transitionRun({
      workspace,
      runId: plan.run.id,
      status: 'completed',
      businessResult: 'partial',
      now: plan.sample.captured_at,
      patch: {
        next_action: 'human review manual exploratory sample; do not aggregate as baseline',
      },
    });
  }
  return {
    ok: true,
    run_ref: plan.run.id,
    sample_ref: sample.id,
    citation_refs: citationRefs,
    source_refs: [...new Set(sourceRefs)].sort(),
    classification_refs: classificationRefs,
    purpose: 'exploratory',
    collection_method: 'manual',
  };
}
