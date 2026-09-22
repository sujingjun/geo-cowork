import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  realContext,
  jsonAt,
  putJson,
  assertRealAuthorization,
  objectPath,
  REAL_PLAN_PATH,
} from './real-journey-store.mjs';
import { assessLifecycleReadiness } from './lifecycle-readiness.mjs';
import { validateLifecycleWorkspace } from './workspace-scope.mjs';
import {
  ownerInbox,
  acceptOwnerFeedback,
  parseOwnerFeedback,
} from './owner-feedback.mjs';
import { withJourneyLock } from './journey-lock.mjs';
import {
  REAL_PLATFORMS,
  requireReal,
  observationWindowState,
} from './real-cycle-contract.mjs';
import { freezeRealCycle, advanceRealCycle } from './real-cycle-progress.mjs';
import { prepareRealKnowledge, applyRealKnowledge } from './real-knowledge.mjs';
import {
  formalSlots,
  collectFormalSlot,
  receiveFormalAnswer,
  reviewRealSamples,
  aggregateRealSamples,
  approveRealAnswers,
} from './real-sampling.mjs';
import {
  prepareRealPublication,
  confirmRealPublication,
  retestRealPublications,
} from './real-publication.mjs';
import { diagnoseRealCycle, applyRealAdoption } from './real-diagnosis.mjs';
import { collectCycleAnalytics } from './real-analytics.mjs';
import {
  prepareRealReview,
  decideRealReview,
  prepareRealNextCycle,
  selectRealNextGoal,
  approveRealNextGoal,
  validateRealNextGoalChoice,
} from './real-cycle-review.mjs';
import { traceCycle } from './cycle-trace.mjs';
import { loadModelEnvironment } from './model-client.mjs';
import { atomicWrite, sha256, resolveWithin } from './workspace-paths.mjs';
import { recoverCitationSourcePairs } from './source-registry.mjs';

export async function preflightRealJourney(workspace) {
  const { identity, plan, cycle, graph } = await realContext(workspace);
  const readiness = await assessLifecycleReadiness({
    workspace,
    knowledgeBaseRef: plan?.knowledge_base_ref ?? identity.knowledge_base_ref,
    goalRef: plan?.goal_ref ?? 'GOAL-MYYSHOP-DEFINITION-001',
    querySetRef: plan?.query_set_ref,
  });
  const blockers = readiness.gates
    .filter((g) => g.status === 'blocked')
    .map((g) => ({ code: g.code, kind: 'knowledge', reason: g.reason }));
  if (!plan)
    blockers.push({
      code: 'REAL_PLAN_REQUIRED',
      kind: 'runtime',
      reason: 'Real execution plan has not been prepared.',
    });
  else {
    try {
      await assertRealAuthorization(workspace, plan);
      requireReal(
        plan.merchant_ref === identity.merchant_ref &&
          [1, 2].includes(plan.cycle_number),
        'REAL_PLAN_INVALID',
        'Merchant or cycle number differs',
      );
      requireReal(
        Object.keys(REAL_PLATFORMS).every((p) =>
          ['manual', 'browser_automation'].includes(
            plan.collection_methods?.[p],
          ),
        ),
        'REAL_PLAN_INVALID',
        'Five-platform methods required',
      );
      for (const [role, relative] of Object.entries(plan.contracts ?? {})) {
        const contract = await jsonAt(workspace, relative);
        requireReal(
          contract.scope === 'authorized_real' && contract.version,
          'REAL_PLAN_INVALID',
          `${role} is not a real contract`,
        );
      }
      requireReal(
        ['measurement_contract', 'signal_rule', 'sensitive_data_policy'].every(
          (k) => plan.contracts?.[k],
        ),
        'REAL_PLAN_INVALID',
        'Measurement contracts missing',
      );
    } catch (error) {
      blockers.push({
        code: error.code ?? 'REAL_PLAN_INVALID',
        kind: 'runtime',
        reason: error.message,
      });
    }
    const release = graph.byId.get(plan.knowledge?.release_ref);
    if (
      !release ||
      release.data.status !== 'published' ||
      !release.data.approval
    )
      blockers.push({
        code: 'KNOWLEDGE_RELEASE_REQUIRED',
        kind: 'knowledge',
        reason: 'The selected real knowledge release needs Owner review.',
      });
    if (
      graph.byId.has(plan.knowledge_base_ref) &&
      identity.knowledge_base_ref !== plan.knowledge_base_ref
    )
      blockers.push({
        code: 'KNOWLEDGE_BASE_ACTIVATION_PENDING',
        kind: 'knowledge',
        reason:
          'Resume the already approved knowledge application before creating a cycle.',
      });
    if (!plan.analytics?.property_time_zone)
      blockers.push({
        code: 'GA4_TIMEZONE_UNCONFIRMED',
        kind: 'runtime',
        reason:
          'Read the GA4 property time zone before freezing analytics windows.',
      });
    if (identity.knowledge_base_ref) {
      const validation = await validateLifecycleWorkspace({
        workspace,
        knowledgeBaseRef: plan.knowledge_base_ref,
      });
      blockers.push(
        ...validation.errors.map((e) => ({
          ...e,
          kind: 'knowledge',
          reason: 'Workspace identity or canonical closure invalid.',
        })),
      );
    }
    await loadModelEnvironment();
    if (!process.env.DEEPSEEK_API_KEY)
      blockers.push({
        code: 'MODEL_CONFIGURATION_REQUIRED',
        kind: 'runtime',
        reason: 'DeepSeek configuration is missing.',
      });
  }
  const pending = await ownerInbox(workspace);
  const schedule = plan
    ? await jsonAt(workspace, `${plan.cycle_dir}/schedule.json`, null)
    : null;
  const windows = (schedule?.windows ?? []).map((w) => ({
    ...w,
    state: observationWindowState(w),
  }));
  return {
    ...readiness,
    schema_version: 'geo-real-journey-status-v1',
    formal_cycle_created: Boolean(cycle),
    cycle_ref: cycle?.data.id ?? null,
    stage: cycle?.data.aggregate_stage ?? 'preparation',
    runtime_ready: !blockers.some((b) => b.kind === 'runtime'),
    safe_to_create: readiness.real_cycle_start_ready && !blockers.length,
    blockers,
    pending: pending.map((p) => ({ id: p.id, file: p.file, kind: p.kind })),
    windows,
    limitations: [
      ...readiness.limitations,
      'This preflight checks current inputs and local contracts; service login/availability is reported by actual execution.',
    ],
  };
}

async function samplingStep(workspace, purpose) {
  let context = await realContext(workspace);
  const slots = await formalSlots(workspace, purpose);
  // Analytics uses only mature windows; an unavailable source is a recorded limitation.
  if (purpose === 'post_change_retest') await collectCycleAnalytics(workspace);
  const missing = slots.filter((s) => !context.graph.byId.has(s.sample_ref));
  for (const slot of missing) {
    if (
      observationWindowState(slot.window) !== 'due' ||
      slot.collection_method !== 'browser_automation'
    )
      continue;
    let result;
    try {
      result = await collectFormalSlot(workspace, slot);
    } catch (error) {
      if (error.code === 'COLLECTION_RATE_LIMIT')
        return {
          waiting_window: true,
          reason: error.code,
          next_action: 'Resume after the submission interval.',
        };
      throw error;
    }
    if (result.status === 'waiting_human')
      return { waiting_human: true, slot: slot.id, ...result };
    // One submission per invocation keeps heartbeat recovery and rate control explicit.
    return {
      progress: true,
      slot: slot.id,
      ...result,
      next_action: 'continue',
    };
  }
  const reviewPackages = await reviewRealSamples(workspace, purpose);
  if (reviewPackages.length)
    return { waiting_human: true, reviews: reviewPackages };
  const aggs = await aggregateRealSamples(workspace, purpose);
  context = await realContext(workspace);
  const absent = slots.filter((s) => !context.graph.byId.has(s.sample_ref));
  if (absent.length)
    return {
      waiting_human: absent.some((s) => s.collection_method === 'manual'),
      waiting_window: true,
      slots: absent.map((s) => ({
        id: s.id,
        query: s.query_text,
        platform: s.platform,
        ordinal: s.ordinal,
        window: s.window,
        state: observationWindowState(s.window),
        method: s.collection_method,
      })),
      next_action:
        'Provide due manual results or resume the next actual observation window. Missed windows require an explicit revised schedule; no backdating.',
    };
  if (
    purpose !== 'baseline' &&
    slots.some((s) => Date.parse(s.window.ends_at) > Date.now())
  )
    return { waiting_window: true, reason: 'OBSERVATION_WINDOW_PENDING' };
  const objects = [
    ...slots.map((s) => context.graph.byId.get(s.sample_ref)),
    ...slots.map((s) =>
      context.graph.byId.get(
        s.sample_ref.replace(/^SMP-/, 'ARV-') + '-REVIEWED',
      ),
    ),
    ...aggs,
  ];
  requireReal(
    objects.every(Boolean),
    'ANSWER_REVIEW_REQUIRED',
    'All current samples need reviewed successors',
  );
  await advanceRealCycle(
    workspace,
    purpose === 'baseline' ? 'baseline_recorded' : 'answer_retest_completed',
    objects,
  );
  return { progress: true, next_action: 'continue' };
}

async function continueRealJourney(workspace) {
  let { cycle, plan, graph } = await realContext(workspace);
  if (!cycle) {
    const preflight = await preflightRealJourney(workspace);
    if (preflight.blockers.some((b) => b.kind === 'knowledge'))
      return prepareRealKnowledge(workspace);
    if (!preflight.safe_to_create) return preflight;
    await freezeRealCycle(workspace);
    return {
      progress: true,
      cycle_ref: plan.cycle_ref,
      stage: 'frozen',
      next_action: 'continue',
    };
  }
  const stage = cycle.data.aggregate_stage,
    track = cycle.data.goal_tracks[0];
  if (['frozen', 'technical_retest_completed'].includes(stage))
    return samplingStep(
      workspace,
      stage === 'frozen' ? 'baseline' : 'post_change_retest',
    );
  if (stage === 'baseline_recorded') {
    const diagnosis = await diagnoseRealCycle(workspace);
    if (diagnosis.objects)
      await advanceRealCycle(workspace, 'diagnosis_ready', diagnosis.objects);
    return diagnosis;
  }
  if (stage === 'diagnosis_ready') {
    const proposals = graph.objects.filter(
      (o) =>
        o.data.record_type === 'asset_proposal' &&
        plan.asset_refs.includes(o.data.asset_ref),
    );
    const superseded = new Set(
      proposals.map((o) => o.data.supersedes_ref).filter(Boolean),
    );
    const current = proposals.filter((o) => !superseded.has(o.data.id));
    const decisions = current.map((p) =>
      graph.objects.find(
        (o) =>
          o.data.record_type === 'adoption_record' &&
          o.data.status === 'decided' &&
          o.data.proposal_ref === p.data.id,
      ),
    );
    if (!current.length || decisions.some((o) => !o))
      return { waiting_human: true, pending: await ownerInbox(workspace) };
    const allRejected = decisions.every((o) =>
      o.data.decisions.every((d) => d.decision === 'rejected'),
    );
    // Record the decision stage before the existing explicit cancellation transition.
    await advanceRealCycle(workspace, 'adoption_decided', decisions);
    if (allRejected)
      await advanceRealCycle(workspace, 'cancelled_no_adoption', decisions);
    return {
      progress: true,
      waiting_human: !allRejected,
      cancelled: allRejected,
      next_action: allRejected
        ? 'Choose a new goal; this cycle does not count as full.'
        : 'Publish adopted content, then provide a publication receipt.',
    };
  }
  if (stage === 'adoption_decided') {
    const adoptions = track.adoption_record_refs.map((id) =>
      graph.byId.get(id),
    );
    const adoptedProposals = adoptions.map((a) =>
      graph.byId.get(a.data.proposal_ref),
    );
    if (
      adoptedProposals.every((p) =>
        p.data.recommendation_items.every((i) => !i.proposed_text),
      )
    )
      return {
        needs_input: true,
        reason: 'EVIDENCE_INPUT_REQUIRED',
        evidence_plan_refs: adoptedProposals.flatMap(
          (p) =>
            p.data.extensions?.['geo.real_diagnosis']?.evidence_plan_refs ?? [],
        ),
        next_action:
          'Provide the requested evidence for Owner review; evidence-only recommendations cannot be published. Preserve the current frozen knowledge.',
      };
    const publications = graph.objects.filter(
      (o) =>
        o.data.record_type === 'asset_publication' &&
        o.data.status === 'confirmed' &&
        track.adoption_record_refs.includes(o.data.adoption_ref),
    );
    if (!publications.length)
      return {
        waiting_human: true,
        reason: 'REAL_PUBLICATION_REQUIRED',
        next_action:
          'Site Owner publishes an adopted controlled asset and provides exact URL, time and adopted content checks.',
      };
    await advanceRealCycle(workspace, 'publication_confirmed', publications);
    return { progress: true, next_action: 'continue' };
  }
  if (stage === 'publication_confirmed') {
    const results = await retestRealPublications(workspace);
    await advanceRealCycle(workspace, 'technical_retest_completed', results);
    return { progress: true, next_action: 'continue' };
  }
  if (stage === 'answer_retest_completed') {
    const observations = await collectCycleAnalytics(workspace);
    await advanceRealCycle(workspace, 'analytics_recorded', observations);
    return { progress: true, next_action: 'continue' };
  }
  if (stage === 'analytics_recorded') {
    const result = await prepareRealReview(workspace);
    await advanceRealCycle(workspace, 'review_waiting_human', [result.object]);
    return result;
  }
  if (stage === 'review_waiting_human') {
    const review = graph.objects.find(
      (o) =>
        o.data.record_type === 'cycle_review' &&
        o.data.cycle_ref === cycle.data.id &&
        o.data.status === 'decided',
    );
    if (!review)
      return { waiting_human: true, pending: await ownerInbox(workspace) };
    await advanceRealCycle(workspace, 'review_decided', [review]);
    return { progress: true, next_action: 'continue' };
  }
  if (stage === 'review_decided') {
    const trace = await traceCycle({ workspace, cycleId: cycle.data.id });
    requireReal(
      trace.lifecycle_ready,
      'TRACE_INCOMPLETE',
      'Completed real cycle trace failed',
    );
    return prepareRealNextCycle(workspace);
  }
  if (stage === 'cancelled_no_adoption')
    return { cancelled: true, completion_scope: 'none' };
  throw new Error(`Unsupported real stage ${stage}`);
}

async function applyFeedback(workspace, file) {
  const text = await readFile(path.resolve(file), 'utf8');
  return applyFeedbackText(workspace, text);
}

async function applyFeedbackText(workspace, text) {
  const parsed = parseOwnerFeedback(text);
  requireReal(
    /^[A-Za-z0-9-]+$/.test(parsed.package_id),
    'OWNER_FEEDBACK_INVALID',
    'Invalid package ID',
  );
  const pack = await jsonAt(
    workspace,
    `reviews/packages/${parsed.package_id}.json`,
  );
  if (pack.kind === 'real_goal_selection' && parsed.decision === 'approve')
    await validateRealNextGoalChoice(workspace, parsed);
  if (pack.kind === 'adoption' && parsed.decision === 'modify') {
    requireReal(
      parsed.modified_text?.trim(),
      'OWNER_FEEDBACK_INVALID',
      'Modification content is required before accepting a final decision',
    );
    const { graph } = await realContext(workspace);
    const candidates = pack.targets
      .map((t) => graph.byId.get(t.id))
      .filter(Boolean);
    requireReal(
      candidates.filter((o) =>
        parsed.target
          ? [
              o.data.id,
              o.data.title,
              graph.byId.get(o.data.asset_ref)?.data.locator,
            ].includes(parsed.target)
          : candidates.length === 1,
      ).length === 1,
      'OWNER_FEEDBACK_TARGET_REQUIRED',
      'Select one proposal to modify',
    );
  }
  const feedback = await acceptOwnerFeedback({ workspace, text });
  const application = `reviews/applications/${feedback.package.id}-${sha256(text)}.json`,
    prior = await jsonAt(workspace, application, null);
  if (prior) return { ...prior, replay: true };
  if (
    ['defer', 'reject'].includes(feedback.decision.decision) &&
    feedback.package.kind !== 'adoption'
  )
    return { waiting_human: true, decision: feedback.decision.decision };
  const handlers = {
    real_knowledge: applyRealKnowledge,
    answer_review: approveRealAnswers,
    adoption: applyRealAdoption,
    real_publication: confirmRealPublication,
    real_cycle_review: decideRealReview,
    real_goal_selection: selectRealNextGoal,
    real_goal: approveRealNextGoal,
  };
  requireReal(
    handlers[feedback.package.kind],
    'OWNER_FEEDBACK_INVALID',
    'Unsupported real review package',
  );
  const result = await handlers[feedback.package.kind](workspace, feedback);
  await putJson(workspace, application, {
    package_id: feedback.package.id,
    decision_sha256: sha256(text),
    result,
  });
  return result;
}

async function recoverOwnerApplications(workspace) {
  let files = [];
  try {
    files = await readdir(resolveWithin(workspace, 'reviews/decisions'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  for (const name of files.filter((n) => n.endsWith('.json')).sort()) {
    const decision = await jsonAt(workspace, `reviews/decisions/${name}`);
    if (
      decision.scope !== 'authorized_real' ||
      !decision.raw_feedback ||
      decision.decision === 'defer'
    )
      continue;
    const pack = await jsonAt(
      workspace,
      `reviews/packages/${decision.package_id}.json`,
      null,
    );
    if (!pack || (decision.decision === 'reject' && pack.kind !== 'adoption'))
      continue;
    const application = `reviews/applications/${decision.package_id}-${sha256(decision.raw_feedback)}.json`;
    if (!(await jsonAt(workspace, application, null)))
      return applyFeedbackText(workspace, decision.raw_feedback);
  }
  return null;
}

export async function executeRealJourney(args) {
  const workspace = path.resolve(args.workspace);
  if (args.command === 'preflight') return preflightRealJourney(workspace);
  if (args.command === 'inbox')
    return {
      pending: await ownerInbox(workspace),
      preflight: await preflightRealJourney(workspace),
    };
  if (args.command === 'report') {
    const status = await preflightRealJourney(workspace),
      { graph } = await realContext(workspace);
    const cycles = graph.objects.filter(
      (o) =>
        o.data.record_type === 'cycle' &&
        o.data.execution_scope === 'authorized_real',
    );
    const md = `# MyyShop 正式真实周期\n\n更新时间：${new Date().toISOString()}\n\n当前：${status.stage}\n真实周期：${cycles.length}\n完整完成：${cycles.filter((o) => o.data.completion_scope === 'full').length}/2\n\n## 当前阻塞\n${status.blockers.map((b) => `- ${b.code}: ${b.reason}`).join('\n') || '无启动阻塞；仍按当前阶段验收。'}\n\n## Owner 待办\n${status.pending.map((p) => `- [${p.kind}](../${p.file})`).join('\n') || '无待处理审核包。'}\n\n## 观察窗口\n${status.windows.map((w) => `- ${w.id}: ${w.starts_at} — ${w.ends_at} (${w.state})`).join('\n')}\n\n阶段完成、认知改善、业务信号分别判断；报告不代表因果效果。\n`;
    await atomicWrite(workspace, 'reports/real-cycle-overview.md', md);
    return { ...status, report: 'reports/real-cycle-overview.md' };
  }
  return withJourneyLock(workspace, async () => {
    const identity = await jsonAt(workspace, 'workspace.json');
    requireReal(
      identity.workspace_mode === 'online' &&
        identity.execution_scope === 'authorized_real',
      'WORKSPACE_SCOPE_INVALID',
      'Real writes require an online workspace',
    );
    await assertRealAuthorization(
      workspace,
      await jsonAt(workspace, REAL_PLAN_PATH),
    );
    await recoverCitationSourcePairs(workspace);
    if (['start', 'continue'].includes(args.command)) {
      const recovered = await recoverOwnerApplications(workspace);
      if (recovered)
        return {
          recovered_owner_application: true,
          ...recovered,
          next_action: 'continue',
        };
    }
    const { plan } = await realContext(workspace);
    await assertRealAuthorization(workspace, plan);
    if (args.command === 'apply-feedback')
      return applyFeedback(workspace, args.file);
    if (args.command === 'receive-answer')
      return receiveFormalAnswer(
        workspace,
        JSON.parse(await readFile(path.resolve(args.file), 'utf8')),
      );
    if (args.command === 'record-publication')
      return prepareRealPublication(
        workspace,
        JSON.parse(await readFile(path.resolve(args.file), 'utf8')),
      );
    if (args.command === 'start' || args.command === 'continue')
      return continueRealJourney(workspace);
    throw new Error(`Unsupported real command ${args.command}`);
  });
}
