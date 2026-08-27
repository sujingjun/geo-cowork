import { readFile } from 'node:fs/promises';

import {
  materializeAnswerAggregation,
} from './answer-aggregation.mjs';
import {
  materializeAnswerReview,
} from './answer-review.mjs';
import {
  validateAnswerWorkspace,
  validateCollectorProfileData,
} from './answer-profile.mjs';
import {
  acquireAnswerLease,
  completeAnswerStep,
  initializeAnswerRun,
  releaseAnswerLease,
  resumeAnswerRun,
} from './answer-run.mjs';
import { materializeFixtureSample } from './answer-sample.mjs';
import {
  materializeClaimSupportReview,
  materializeSourceClassification,
} from './citation-analysis.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import { readRun, transitionRun } from './run-store.mjs';
import { expectedFormalOrdinals } from './m5-policy.mjs';
import {
  materializeCitationSourcePair,
  normalizeCitationUrl,
} from './source-registry.mjs';

export class AnswerCycleError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnswerCycleError';
    this.code = code;
    Object.assign(this, details);
  }
}

function assertInvalidHost(value, label) {
  let hostname;
  try {
    hostname = new URL(value).hostname;
  } catch {
    throw new AnswerCycleError('M5_FIELD_REQUIRED', `${label} URL 非法`);
  }
  if (!hostname.endsWith('.invalid')) {
    throw new AnswerCycleError('COLLECTION_AUTHORIZATION_REQUIRED', `${label} 不是 .invalid 离线入口`);
  }
}

export function planAnswerCycle(plan) {
  validateCollectorProfileData(plan.profile.data);
  assertInvalidHost(plan.profile.data.product_entry, 'product_entry');
  if (plan.profile.data.collection_method !== 'recorded_fixture') {
    throw new AnswerCycleError('PLAYWRIGHT_GATE_NOT_APPROVED', '当前仅批准 recorded_fixture');
  }
  if (plan.purpose !== 'exploratory') {
    const ordinals = plan.samples.map((sample) => sample.ordinal).sort();
    if (ordinals.join(',') !== expectedFormalOrdinals(plan.profile.data.sampling_count).join(',')) {
      throw new AnswerCycleError('SAMPLE_NOT_INDEPENDENT', '正式 plan 必须固定两个 ordinal');
    }
  }
  for (const sample of plan.samples) {
    for (const occurrence of sample.citations ?? []) {
      const normalized = normalizeCitationUrl(occurrence.url_raw);
      if (!normalized.citation_domain.endsWith('.invalid')) {
        throw new AnswerCycleError(
          'COLLECTION_AUTHORIZATION_REQUIRED',
          'recorded Fixture Citation 只能使用 .invalid',
        );
      }
    }
  }
  return {
    ok: true,
    purpose: plan.purpose,
    platform: plan.profile.data.platform,
    sample_count: plan.samples.length,
    network: 'disabled',
  };
}

async function step({ workspace, runId, ownerId, slotKey, name, proof, now, ...rest }) {
  return completeAnswerStep({
    workspace,
    runId,
    ownerId,
    slotKey,
    step: name,
    proof,
    now,
    ...rest,
  });
}

export async function collectFixtureCycle({ workspace, plan, stopAfter }) {
  planAnswerCycle(plan);
  await initializeAnswerRun({ workspace, plan });
  const operationNow = plan.profile.data.time_window.starts_at;
  const ownerId = `recorded-fixture-${process.pid}`;
  await acquireAnswerLease({
    workspace,
    runId: plan.run.id,
    ownerId,
    now: operationNow,
    ttlMs: 24 * 60 * 60 * 1000,
  });
  const materialized = [];
  try {
    for (const samplePlan of plan.samples) {
      const run = await readRun({ workspace, runId: plan.run.id });
      const slot = run.data.sample_slots.find((item) => item.ordinal === samplePlan.ordinal);
      for (const [name, proof] of [
        ['profile_validated', `profile:${plan.profile.data.profile_fingerprint}`],
        ['authorization_checked', plan.authorization_ref],
        ['session_prepared', `recorded-fixture:${samplePlan.ordinal}`],
        ['query_submitted', `recorded-query:${samplePlan.ordinal}`],
        ['terminal_state_observed', `outcome:${samplePlan.outcome}`],
      ]) {
        await step({
          workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
          name, proof, now: operationNow,
        });
      }
      const sample = await materializeFixtureSample({ workspace, plan, sample: samplePlan });
      materialized.push(sample);
      await step({
        workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
        name: 'raw_artifacts_written', proof: sample.raw_manifest_sha256, now: operationNow,
      });
      await step({
        workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
        name: 'sample_metadata_written', proof: sample.id, now: operationNow,
        attemptRef: sample.id, selectedSampleRef: sample.id,
      });
      if (stopAfter === 'samples') continue;
      await step({
        workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
        name: 'citation_source_plan_frozen',
        proof: `citation-count:${samplePlan.citations.length}`,
        now: operationNow,
      });
      for (const occurrence of samplePlan.citations) {
        await materializeCitationSourcePair({
          workspace,
          sample,
          occurrence,
          now: sample.captured_at,
        });
      }
      await step({
        workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
        name: 'citations_and_sources_materialized',
        proof: `citation-count:${samplePlan.citations.length}`,
        now: operationNow,
      });
      for (const occurrence of samplePlan.citations) {
        await materializeSourceClassification({
          workspace,
          sourceId: occurrence.source.id,
          citationIds: [occurrence.id],
          plan: occurrence.classification,
          now: sample.captured_at,
        });
      }
      await step({
        workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
        name: 'candidate_classifications_materialized',
        proof: `classification-count:${samplePlan.citations.length}`,
        now: operationNow,
      });
    }
  } finally {
    await releaseAnswerLease({ workspace, runId: plan.run.id, ownerId });
  }
  return { ok: true, run_ref: plan.run.id, samples: materialized };
}

export async function reviewFixtureCycle({ workspace, plan }) {
  planAnswerCycle(plan);
  const reviews = [];
  const supports = [];
  for (const samplePlan of plan.samples) {
    for (const occurrence of samplePlan.citations) {
      supports.push(await materializeClaimSupportReview({
        workspace,
        citationId: occurrence.id,
        classificationId: occurrence.classification.id,
        plan: occurrence.claim_support,
        now: samplePlan.captured_at,
      }));
    }
    reviews.push(await materializeAnswerReview({
      workspace,
      sampleId: samplePlan.id,
      claimSupportIds: samplePlan.citations.map((item) => item.claim_support.id),
      plan: samplePlan.answer_review,
      now: samplePlan.captured_at,
    }));
  }
  return { ok: true, supports, reviews };
}

export async function aggregateFixtureCycle({ workspace, plan }) {
  planAnswerCycle(plan);
  const now = plan.samples.map((sample) => sample.captured_at).sort().at(-1);
  const aggregation = await materializeAnswerAggregation({ workspace, plan, now });
  const run = await readRun({ workspace, runId: plan.run.id });
  if (run.data.status !== 'completed') {
    await transitionRun({
      workspace,
      runId: plan.run.id,
      status: 'completed',
      businessResult: 'pass',
      now,
      patch: {
        next_action: 'offline M5 fixture verified; real collection remains blocked',
      },
    });
  }
  return { ok: true, aggregation };
}

export async function normalizeSampleCitations({ workspace, sampleId }) {
  const graph = await loadWorkspaceGraph({ workspace });
  const citations = graph.objects
    .filter(({ data }) => data.record_type === 'citation_observation'
      && data.sample_ref === sampleId)
    .map(({ data }) => ({
      id: data.id,
      ...normalizeCitationUrl(data.url_raw),
    }));
  return { ok: true, sample_ref: sampleId, citations };
}

export async function readPlan(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export { resumeAnswerRun, validateAnswerWorkspace };
