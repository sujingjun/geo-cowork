import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import {
  buildCycleSnapshotPlan,
  compareLiveInputsWithFreeze,
  materializeCycleSnapshot,
} from './cycle-snapshot.mjs';
import {
  acquireCycleLease,
  releaseCycleLease,
} from './cycle-lock.mjs';
import { assertStageGate } from './cycle-gates.mjs';
import {
  deriveCycleSummary,
  validateCycleAdvance,
} from './cycle-state.mjs';
export { deriveCycleSummary, validateCycleAdvance } from './cycle-state.mjs';
import { preflightTestKnowledgeWrite } from './workspace-scope.mjs';
import { serializeMarkdownObject } from './object-contract.mjs';
import {
  atomicWrite,
  sha256,
  stableStringify,
  walkMarkdownFiles,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class CycleLifecycleError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CycleLifecycleError';
    this.code = code;
    Object.assign(this, details);
  }
}

function bumpPatch(version) {
  const parts = version.split('.').map(Number);
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function operationPlanFingerprint(plan) {
  const payload = structuredClone(plan);
  delete payload.fault_after;
  return sha256(stableStringify(payload));
}

async function findObjects(workspace, predicate) {
  const matches = [];
  for (const file of await walkMarkdownFiles(workspace, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    if (predicate(parsed.data)) {
      matches.push({
        data: parsed.data,
        content: parsed.content,
        original: text,
        path: path.relative(workspace, file).split(path.sep).join('/'),
      });
    }
  }
  return matches;
}

async function findCycle(workspace, cycleId) {
  const cycle = (await findObjects(workspace, (data) =>
    data.record_type === 'cycle' && data.id === cycleId))[0];
  if (!cycle) throw new CycleLifecycleError('CYCLE_INPUT_NOT_READY', 'Cycle 不存在');
  return cycle;
}

async function transitionsForOperation(workspace, cycleId, operationId) {
  return findObjects(workspace, (data) =>
    data.record_type === 'cycle_transition'
      && data.cycle_ref === cycleId
      && data.operation_id === operationId);
}

async function freezeSnapshotForCycle(workspace, cycle) {
  const ref = cycle.core_versions?.input_snapshot?.ref;
  return (await findObjects(workspace, (data) =>
    data.record_type === 'cycle_input_snapshot' && data.id === ref))[0];
}

async function snapshotPlanFromCanonical(workspace, snapshotObject) {
  const data = snapshotObject.data;
  const manifestPath = `runs/${data.run_ref}/${data.manifest.artifact_path}`;
  const manifestBytes = await readFile(path.join(workspace, ...manifestPath.split('/')), 'utf8');
  return {
    schema_version: 'm6-cycle-input-snapshot-plan/1.0.0',
    snapshot: {
      id: data.id,
      path: snapshotObject.path,
      version: data.version,
      kind: data.snapshot_kind,
    },
    merchant_ref: data.merchant_ref,
    cycle_ref: data.cycle_ref,
    run_ref: data.run_ref,
    source_entries: data.source_entries,
    artifact_entries: data.artifact_entries,
    base_freeze_snapshot_version: data.base_freeze_snapshot_version,
    pre_review_transition_snapshot_versions: data.pre_review_transition_snapshot_versions ?? [],
    pre_review_entry_keys: data.pre_review_entry_keys ?? [],
    manifest: { ...data.manifest, bytes: manifestBytes },
  };
}

async function goalRefForEntryKey(workspace, cycle, entryKey) {
  const snapshot = await freezeSnapshotForCycle(workspace, cycle);
  return snapshot?.data.source_entries
    ?.find((entry) => entry.entry_key === entryKey && entry.record_type === 'perception_goal')
    ?.object_id ?? null;
}

async function goalEntryKeyForRef(workspace, cycle, goalRef) {
  const snapshot = await freezeSnapshotForCycle(workspace, cycle);
  return snapshot?.data.source_entries
    ?.find((entry) => entry.object_id === goalRef && entry.record_type === 'perception_goal')
    ?.entry_key ?? null;
}

function artifactDescriptors(paths) {
  return paths.map((item, index) => typeof item === 'string'
    ? {
      path: item,
      role: index === 0 ? 'measurement_contract' : 'other_contract',
      media_type: item.endsWith('.json') ? 'application/json' : 'application/octet-stream',
    }
    : item);
}

async function gateSnapshotPlan(workspace, plan, cycle) {
  const freeze = await freezeSnapshotForCycle(workspace, cycle);
  if (!freeze?.data.run_ref) {
    throw new CycleLifecycleError('CYCLE_INPUT_NOT_READY', 'freeze CIS 缺少 run_ref');
  }
  return buildCycleSnapshotPlan({
    workspace,
    id: plan.gate_snapshot_id,
    snapshotKind: 'transition',
    merchantRef: cycle.merchant_ref,
    cycleRef: cycle.id,
    runRef: freeze.data.run_ref,
    sourcePaths: plan.gate.source_paths,
    artifactPaths: artifactDescriptors(plan.gate.artifact_paths),
  });
}

function trackGatePatch(snapshot, toStage) {
  const ids = (type) => snapshot.source_entries
    .filter((entry) => entry.record_type === type)
    .map((entry) => entry.object_id);
  if (toStage === 'baseline_recorded') return { baseline_aggregation_refs: ids('answer_aggregation') };
  if (toStage === 'diagnosis_ready') return {
    finding_refs: ids('finding'),
    evidence_plan_refs: ids('evidence_plan'),
    asset_proposal_refs: ids('asset_proposal'),
  };
  if (toStage === 'adoption_decided' || toStage === 'cancelled_no_adoption') {
    return { adoption_record_refs: ids('adoption_record') };
  }
  if (toStage === 'publication_confirmed') return { publication_refs: ids('asset_publication') };
  if (toStage === 'technical_retest_completed') return { technical_retest_run_refs: ids('run') };
  if (toStage === 'answer_retest_completed') {
    return { answer_retest_aggregation_refs: ids('answer_aggregation') };
  }
  if (toStage === 'analytics_recorded') return {
    analytics_observation_refs: ids('analytics_observation'),
    business_signal_refs: ids('business_signal'),
  };
  if (toStage === 'review_waiting_human') {
    return { review_input_snapshot_version: { ref: snapshot.snapshot.id, version: snapshot.snapshot.version } };
  }
  return {};
}

function transitionData({ plan, cycle, gateSnapshot, leaseRevision, toStatus, now, supersedesRef }) {
  return {
    id: plan.transition_id,
    record_type: 'cycle_transition',
    status: 'recorded',
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `${plan.from_stage} to ${plan.to_stage}`,
    test_scope: { ...cycle.test_scope },
    cycle_ref: cycle.id,
    goal_ref: plan.goal_ref ?? null,
    ...(supersedesRef ? { supersedes_ref: supersedesRef } : {}),
    operation_id: plan.operation_id,
    operation_fingerprint: plan.operation_fingerprint,
    expected_cycle_version: plan.expected_cycle_version,
    input_snapshot_version: { ...cycle.core_versions.input_snapshot },
    gate_snapshot_version: { ref: gateSnapshot.snapshot.id, version: gateSnapshot.snapshot.version },
    from_status: cycle.status,
    to_status: toStatus,
    from_stage: plan.from_stage,
    to_stage: plan.to_stage,
    required_gate_entry_keys: [
      ...gateSnapshot.source_entries.map((entry) => entry.entry_key),
      ...gateSnapshot.artifact_entries.map((entry) => entry.entry_key),
    ].sort(),
    lease_revision: leaseRevision,
    actor: plan.actor,
  };
}

async function applyIntent({
  workspace,
  cycleObject,
  transition,
  transitionPath,
  ownerId,
  goalEntryKey,
  gateSnapshot,
}) {
  const current = await findCycle(workspace, cycleObject.data.id);
  if (current.data.version !== transition.expected_cycle_version) {
    throw new CycleLifecycleError('CYCLE_CAS_MISMATCH', 'expected Cycle version 不匹配');
  }
  const updatedTracks = current.data.goal_tracks.map((track) => track.goal_entry_key === goalEntryKey
    ? { ...track, ...trackGatePatch(gateSnapshot, transition.to_stage), stage: transition.to_stage }
    : track);
  const summary = deriveCycleSummary(updatedTracks);
  const updated = {
    ...current.data,
    ...summary,
    goal_tracks: updatedTracks,
    transition_refs: [...new Set([...current.data.transition_refs, transition.id])],
    version: bumpPatch(current.data.version),
    updated_at: transition.updated_at,
  };
  await atomicWrite(workspace, current.path, serializeMarkdownObject(updated, current.content));
  return { updated, transitionPath, ownerId };
}

export async function advanceCycle({ workspace, plan }) {
  const root = path.resolve(workspace);
  const computedFingerprint = operationPlanFingerprint(plan);
  const existing = await transitionsForOperation(root, plan.cycle_ref, plan.operation_id);
  if (existing.length > 0) {
    const intent = existing[0];
    if (intent.data.operation_fingerprint !== computedFingerprint) {
      throw new CycleLifecycleError('TRANSITION_CONFLICT', '相同 operation_id 对应不同 fingerprint');
    }
    const cycle = await findCycle(root, plan.cycle_ref);
    if (cycle.data.transition_refs.includes(intent.data.id)) {
      return { action: 'kept', applied: true, transition_id: intent.data.id, steps: [] };
    }
  }

  const cycleObject = await findCycle(root, plan.cycle_ref);
  const freezeSnapshot = await freezeSnapshotForCycle(root, cycleObject.data);
  if (!freezeSnapshot) {
    throw new CycleLifecycleError('CYCLE_INPUT_NOT_READY', 'Cycle freeze CIS 不存在');
  }
  const freezePlan = await snapshotPlanFromCanonical(root, freezeSnapshot);
  const freezeCheck = await compareLiveInputsWithFreeze({ workspace: root, plan: freezePlan });
  if (!freezeCheck.ok) {
    throw new CycleLifecycleError('CYCLE_VERSION_DRIFT', 'active Cycle freeze inputs 已漂移', {
      diagnostics: freezeCheck.errors,
    });
  }
  const goalKey = plan.goal_entry_key;
  validateCycleAdvance({
    cycle: cycleObject.data,
    goalEntryKey: goalKey,
    fromStage: plan.from_stage,
    toStage: plan.to_stage,
    gateGoalEntryKey: plan.gate_goal_entry_key ?? goalKey,
  });
  const gateSnapshot = await gateSnapshotPlan(root, plan, cycleObject.data);
  await materializeCycleSnapshot({ workspace: root, plan: gateSnapshot });
  const steps = ['gate_snapshot_written'];
  const lease = await acquireCycleLease({
    workspace: root,
    cycleId: plan.cycle_ref,
    ownerId: plan.lease.owner_id,
    now: plan.lease.now,
    ttlMs: plan.lease.ttl_ms,
    inputFingerprint: computedFingerprint,
  });
  steps.push('lock_acquired');
  try {
    const lockedCycle = await findCycle(root, plan.cycle_ref);
    if (lockedCycle.data.version !== plan.expected_cycle_version) {
      throw new CycleLifecycleError('CYCLE_CAS_MISMATCH', 'expected Cycle version 不匹配');
    }
    if (operationPlanFingerprint(plan) !== computedFingerprint) {
      throw new CycleLifecycleError('TRANSITION_CONFLICT', 'lock 内 operation plan fingerprint 漂移');
    }
    const gateCheck = await compareLiveInputsWithFreeze({ workspace: root, plan: gateSnapshot });
    if (!gateCheck.ok) {
      throw new CycleLifecycleError('CYCLE_CAS_MISMATCH', 'lock 内 gate bytes 与 transition CIS 不一致', {
        diagnostics: gateCheck.errors,
      });
    }
    await assertStageGate(root, gateSnapshot, plan.to_stage);
    const previewTracks = lockedCycle.data.goal_tracks.map((track) => track.goal_entry_key === goalKey
      ? { ...track, stage: plan.to_stage }
      : track);
    const summary = deriveCycleSummary(previewTracks);
    const now = plan.lease.now;
    const goalRef = await goalRefForEntryKey(root, lockedCycle.data, goalKey);
    if (!goalRef) throw new CycleLifecycleError('CYCLE_GATE_REQUIRED', 'Goal entry 未解析到 freeze CIS');
    const transition = transitionData({
      plan: { ...plan, goal_ref: goalRef, operation_fingerprint: computedFingerprint },
      cycle: lockedCycle.data,
      gateSnapshot,
      leaseRevision: lease.revision,
      toStatus: summary.status,
      now,
    });
    const transitionPath = `cycles/m6/transitions/${transition.id.toLowerCase()}.md`;
    await preflightTestKnowledgeWrite({
      workspace: root,
      data: transition,
      body: `# Cycle Transition ${transition.id}\n`,
      manifest: plan,
    });
    await writeCreateOnly(root, transitionPath, serializeMarkdownObject(
      transition,
      `# Cycle Transition ${transition.id}\n`,
    ), { idempotent: true, conflictCode: 'TRANSITION_CONFLICT' });
    steps.push('transition_intent_written');
    if (plan.fault_after === 'transition_intent_written') {
      throw new CycleLifecycleError('FAULT_INJECTED', 'transition intent 写入后故障注入', {
        transition_id: transition.id,
        transition_applied: false,
      });
    }
    const applied = await applyIntent({
      workspace: root,
      cycleObject: lockedCycle,
      transition,
      transitionPath,
      ownerId: lease.owner_id,
      goalEntryKey: goalKey,
      gateSnapshot,
    });
    steps.push('cas_applied');
    return {
      action: 'updated',
      applied: true,
      transition_id: transition.id,
      cycle_version: applied.updated.version,
      steps,
    };
  } finally {
    await releaseCycleLease({
      workspace: root,
      cycleId: plan.cycle_ref,
      ownerId: plan.lease.owner_id,
      expectedRevision: lease.revision,
    });
  }
}

export async function resumeCycleTransition({
  workspace,
  cycleId,
  operationId,
  expectedCycleVersion,
  replacementTransitionId,
}) {
  const root = path.resolve(workspace);
  const intents = await transitionsForOperation(root, cycleId, operationId);
  if (intents.length === 0) {
    throw new CycleLifecycleError('TRANSITION_INTENT_ORPHANED', '找不到 orphan transition intent');
  }
  const old = intents[0];
  const cycle = await findCycle(root, cycleId);
  if (cycle.data.transition_refs.includes(old.data.id)) {
    return { action: 'kept', transition_id: old.data.id, old_intent_applied: true };
  }
  const resumeOwner = `m6-resume-${process.pid}`;
  const lease = await acquireCycleLease({
    workspace: root,
    cycleId,
    ownerId: resumeOwner,
    now: old.data.updated_at,
    ttlMs: 60_000,
    inputFingerprint: old.data.operation_fingerprint,
  });
  try {
    if (old.data.expected_cycle_version === expectedCycleVersion
        && cycle.data.version === expectedCycleVersion) {
    const goalEntryKey = await goalEntryKeyForRef(root, cycle.data, old.data.goal_ref);
    if (!goalEntryKey) throw new CycleLifecycleError('CYCLE_GATE_REQUIRED', 'orphan intent Goal 无法解析');
    const updatedTracks = cycle.data.goal_tracks.map((track) =>
      track.goal_entry_key === goalEntryKey
        ? { ...track, stage: old.data.to_stage }
        : track);
    const updated = {
      ...cycle.data,
      ...deriveCycleSummary(updatedTracks),
      goal_tracks: updatedTracks,
      transition_refs: [...cycle.data.transition_refs, old.data.id],
      version: bumpPatch(cycle.data.version),
      updated_at: old.data.updated_at,
    };
      await atomicWrite(root, cycle.path, serializeMarkdownObject(updated, cycle.content));
      return { action: 'applied_existing_intent', transition_id: old.data.id };
    }
    if (!replacementTransitionId) {
      throw new CycleLifecycleError('TRANSITION_INTENT_INPUT_DRIFT', 'orphan intent 输入已漂移');
    }
    const replacement = {
    ...old.data,
    id: replacementTransitionId,
    supersedes_ref: old.data.id,
    expected_cycle_version: expectedCycleVersion,
    operation_fingerprint: sha256(stableStringify({
      old: old.data.operation_fingerprint,
      expected_cycle_version: expectedCycleVersion,
    })),
  };
    const relative = `cycles/m6/transitions/${replacement.id.toLowerCase()}.md`;
    await writeCreateOnly(root, relative, serializeMarkdownObject(
      replacement,
      `# Cycle Transition ${replacement.id}\n`,
    ), { idempotent: true, conflictCode: 'TRANSITION_CONFLICT' });
    return {
      action: 'superseded_orphan',
      transition_id: replacement.id,
      supersedes_ref: old.data.id,
      old_intent_applied: false,
    };
  } finally {
    await releaseCycleLease({
      workspace: root,
      cycleId,
      ownerId: resumeOwner,
      expectedRevision: lease.revision,
    });
  }
}
