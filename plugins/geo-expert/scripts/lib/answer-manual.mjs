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
  assertPlatformManualAllowed,
  getPlatformAdapter,
} from '../collectors/platforms/index.mjs';
import {
  materializeCitationObservation,
  materializeCitationSourcePair,
} from './source-registry.mjs';
import { readRun, transitionRun } from './run-store.mjs';
import { M5_PRIMARY_LANGUAGE, M5_SOURCE_CLASSIFICATION_THRESHOLD } from './m5-policy.mjs';
import { archiveObservedSourcesForBatchClassification } from './source-batch.mjs';
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
  const isLegacy = plan.schema_version === 'm5-manual-sample-plan-v1';
  const isBaseline = plan.schema_version === 'm5-manual-baseline-plan-v2';
  if ((!isLegacy && !isBaseline)
      || plan.profile?.data?.collection_method !== 'manual'
      || !plan.authorization_ref?.startsWith('workspace://')
      || !plan.sample?.id
      || !Array.isArray(plan.sample.citations)) {
    throw new ManualAnswerError('M5_FIELD_REQUIRED', 'manual Sample plan 合同不完整');
  }
  if (isLegacy && plan.purpose !== 'exploratory') {
    throw new ManualAnswerError('SAMPLE_NOT_INDEPENDENT', 'legacy manual plan 只能是 exploratory');
  }
  if (isBaseline) {
    const ordinals = (plan.samples ?? []).map((sample) => sample.ordinal).sort();
    if (plan.purpose !== 'baseline'
        || plan.profile.data.sampling_count !== 2
        || ordinals.join(',') !== '1,2'
        || !ordinals.includes(plan.sample.ordinal)
        || plan.classification_policy?.mode !== 'batch_at_source_threshold'
        || plan.classification_policy?.threshold !== M5_SOURCE_CLASSIFICATION_THRESHOLD
        || !plan.classification_policy?.decision_ref?.startsWith('workspace://')
        || plan.language_contract?.role !== 'primary'
        || plan.language_contract?.primary_language !== M5_PRIMARY_LANGUAGE
        || plan.language_contract?.primary_query_ref !== plan.query_version.ref
        || plan.profile.data.language !== M5_PRIMARY_LANGUAGE
        || plan.manual_source?.kind !== 'user_supplied_result_url'
        || plan.manual_source?.capture_surface !== 'chrome_extension') {
      throw new ManualAnswerError('M5_FIELD_REQUIRED', 'manual baseline v2 合同不完整');
    }
  }
  const serialized = stableStringify(plan);
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(serialized)) {
    throw new ManualAnswerError('PRIVACY_SCOPE_VIOLATION', 'manual plan 不得保存账号邮箱');
  }
  const adapter = assertPlatformManualAllowed(getPlatformAdapter(plan.profile.data.platform), {
    manualSourceKind: plan.manual_source?.kind,
  });
  if (plan.manual_source?.kind === 'user_supplied_export'
      && (!plan.manual_source?.filename
        || /[\\/]/.test(plan.manual_source.filename)
        || !/^[a-f0-9]{64}$/.test(plan.manual_source.sha256 ?? ''))) {
    throw new ManualAnswerError(
      'PLATFORM_MANUAL_COLLECTION_BLOCKED',
      '用户导出文件必须冻结安全文件名与 SHA-256',
    );
  }
  if (plan.manual_source?.kind === 'user_supplied_result_url') {
    let resultUrl;
    try {
      resultUrl = new URL(plan.manual_source.result_url);
    } catch {
      throw new ManualAnswerError('PLATFORM_ALLOWLIST_VIOLATION', '人工结果 URL 非法');
    }
    if (!(adapter.manual_fallback.result_url_origins ?? []).includes(resultUrl.origin)) {
      throw new ManualAnswerError('PLATFORM_ALLOWLIST_VIOLATION', '人工结果 URL 不属于平台允许来源');
    }
  }
  let profileUrl;
  try {
    profileUrl = new URL(plan.profile.data.product_entry);
  } catch {
    throw new ManualAnswerError('PLATFORM_ALLOWLIST_VIOLATION', 'manual Profile product entry 非法');
  }
  const allowed = adapter.product_entries.some((entry) => {
    const allowedUrl = new URL(entry);
    return allowedUrl.origin === profileUrl.origin && allowedUrl.pathname === profileUrl.pathname;
  });
  if (!allowed) {
    throw new ManualAnswerError(
      'PLATFORM_ALLOWLIST_VIOLATION',
      'manual Profile product entry 不在平台注册入口',
      { platform: adapter.platform, product_entry: plan.profile.data.product_entry },
    );
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
  const deferredClassification = plan.schema_version === 'm5-manual-baseline-plan-v2';
  assertManualAnswerPrivacy(answerText);
  const inputPath = deferredClassification
    ? `runs/${plan.run.id}/inputs/manual-sample-plan-slot-${plan.sample.ordinal}.json`
    : `runs/${plan.run.id}/inputs/manual-sample-plan.json`;
  await writeCreateOnly(
    workspace,
    inputPath,
    stableStringify(plan, 2),
    { idempotent: true, conflictCode: 'AGGREGATION_INPUT_DRIFT' },
  );
  await initializeAnswerRun({ workspace, plan, now: plan.sample.captured_at });
  const initializedRun = await readRun({ workspace, runId: plan.run.id });
  const initializedSlot = initializedRun.data.sample_slots
    .find((item) => item.ordinal === plan.sample.ordinal);
  if (!initializedSlot) {
    throw new ManualAnswerError('SAMPLE_SLOT_CONFLICT', 'manual Sample 未匹配预分配 slot');
  }
  if (initializedSlot.selected_sample_ref) {
    if (initializedSlot.selected_sample_ref !== plan.sample.id) {
      throw new ManualAnswerError('SAMPLE_SLOT_CONFLICT', 'manual slot 已选择另一 Sample');
    }
    const existingSample = await materializeManualSample({ workspace, plan, answerText });
    const existingSourceArchive = deferredClassification
      ? await archiveObservedSourcesForBatchClassification({
        workspace,
        decisionRef: plan.classification_policy.decision_ref,
        now: plan.sample.captured_at,
        threshold: plan.classification_policy.threshold,
      })
      : null;
    return {
      ok: true,
      run_ref: plan.run.id,
      sample_ref: existingSample.id,
      citation_refs: plan.sample.citations.map((item) => item.id),
      source_refs: [...new Set(plan.sample.citations
        .map((item) => item.existing_source_ref ?? item.source?.id))].sort(),
      classification_refs: deferredClassification
        ? []
        : plan.sample.citations.map((item) => item.classification.id),
      purpose: plan.purpose,
      collection_method: 'manual',
      ...(existingSourceArchive ? { source_archive: existingSourceArchive } : {}),
      action: 'kept',
    };
  }
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
  let sourceArchive;
  try {
    const run = await readRun({ workspace, runId: plan.run.id });
    const slot = run.data.sample_slots.find((item) => item.ordinal === plan.sample.ordinal);
    if (!slot) throw new ManualAnswerError('SAMPLE_SLOT_CONFLICT', 'manual Sample 未匹配预分配 slot');
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
      if (!deferredClassification) {
        const classification = await materializeSourceClassification({
          workspace,
          sourceId,
          citationIds: [occurrence.id],
          plan: occurrence.classification,
          now: plan.sample.captured_at,
        });
        classificationRefs.push(classification.id);
      }
    }
    sourceArchive = deferredClassification
      ? await archiveObservedSourcesForBatchClassification({
        workspace,
        decisionRef: plan.classification_policy.decision_ref,
        now: plan.sample.captured_at,
        threshold: plan.classification_policy.threshold,
      })
      : null;
    await complete({
      workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
      step: 'citations_and_sources_materialized',
      proof: `citation-count:${citationRefs.length}`,
      now: plan.sample.captured_at,
    });
    await complete({
      workspace, runId: plan.run.id, ownerId, slotKey: slot.slot_key,
      step: 'candidate_classifications_materialized',
      proof: deferredClassification
        ? `classification-deferred:${sourceArchive.unique_source_count}/${sourceArchive.threshold}`
        : `classification-count:${classificationRefs.length}`,
      now: plan.sample.captured_at,
    });
  } finally {
    await releaseAnswerLease({ workspace, runId: plan.run.id, ownerId });
  }
  const current = await readRun({ workspace, runId: plan.run.id });
  const allSlotsComplete = current.data.sample_slots.every((slot) => slot.selected_sample_ref);
  if (current.data.status !== 'completed') {
    await transitionRun({
      workspace,
      runId: plan.run.id,
      status: allSlotsComplete ? 'completed' : 'waiting_human',
      businessResult: 'partial',
      now: plan.sample.captured_at,
      patch: {
        next_action: allSlotsComplete
          ? 'review two-slot baseline; source classification remains deferred until 100 sources'
          : 'collect remaining independent manual baseline slot',
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
    purpose: plan.purpose,
    collection_method: 'manual',
    ...(sourceArchive ? { source_archive: sourceArchive } : {}),
  };
}
