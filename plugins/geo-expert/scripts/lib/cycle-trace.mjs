import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import {
  buildCycleSnapshotPlan,
  materializeCycleSnapshot,
} from './cycle-snapshot.mjs';
import { traceStageGateValid } from './cycle-trace-gates.mjs';
import { preflightTestKnowledgeWrite } from './workspace-scope.mjs';
import { serializeMarkdownObject } from './object-contract.mjs';
import {
  resolveWithin,
  sha256,
  walkMarkdownFiles,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class CycleTraceError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CycleTraceError';
    this.code = code;
    Object.assign(this, details);
  }
}

const REQUIRED_GOAL_STAGES = [
  'baseline_recorded', 'diagnosis_ready', 'adoption_decided',
  'publication_confirmed', 'technical_retest_completed',
  'answer_retest_completed', 'analytics_recorded',
  'review_waiting_human', 'review_decided',
];

async function objectsIn(workspace) {
  const objects = [];
  for (const file of await walkMarkdownFiles(workspace, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    if (!parsed.data.record_type || parsed.data.record_type === 'knowledge_entry') continue;
    objects.push({
      data: parsed.data,
      content: parsed.content,
      path: path.relative(workspace, file).split(path.sep).join('/'),
    });
  }
  return objects;
}

function candidateError(errors, index, reason) {
  errors.push({ code: 'CYCLE_GATE_REQUIRED', index, reason });
}

export function validateNextCycleCandidates(candidates, { entryGoalMap = {} } = {}) {
  const errors = [];
  const allowed = {
    query_cluster: new Set(['query', 'query_set', 'answer_review', 'answer_aggregation']),
    content_gap: new Set(['finding', 'query', 'asset_proposal']),
    evidence_gap: new Set(['finding', 'query', 'evidence_plan']),
    product_gap: new Set(['finding', 'query', 'evidence']),
    severe_misperception: new Set(['answer_review', 'answer_aggregation', 'query']),
    recommendation_reason: new Set(['answer_review', 'answer_aggregation', 'query']),
  };
  for (const [index, candidate] of candidates.entries()) {
    const types = candidate.source_entries?.map((entry) => entry.record_type) ?? [];
    const allowedTypes = allowed[candidate.candidate_kind];
    if (!allowedTypes || types.some((type) => !allowedTypes.has(type))) {
      candidateError(errors, index, types.includes('answer_sample')
        ? 'raw_sample_forbidden'
        : 'source_type_invalid');
    }
    if (['content_gap', 'evidence_gap', 'product_gap'].includes(candidate.candidate_kind)
        && !types.includes('finding')) {
      candidateError(errors, index, 'gap_finding_required');
    }
    const expectedGoal = candidate.source_goal_entry?.entry_key;
    if ((candidate.source_entries ?? []).some((entry) =>
      entryGoalMap[entry.entry_key] && entryGoalMap[entry.entry_key] !== expectedGoal)) {
      candidateError(errors, index, 'cross_goal_source');
    }
  }
  return { errors };
}

function candidateEntryGoalMap(plan) {
  return Object.fromEntries((plan.next_cycle_candidate_inputs ?? [])
    .flatMap((candidate) => candidate.source_entries.map((entry) => [
      entry.entry_key,
      candidate.source_goal_entry.entry_key,
    ])));
}

async function entryGoalMapFromSnapshotPlan(workspace, snapshot) {
  const goalEntries = new Map(snapshot.source_entries
    .filter((entry) => entry.record_type === 'perception_goal')
    .map((entry) => [entry.object_id, entry.entry_key]));
  const result = {};
  for (const entry of snapshot.source_entries) {
    if (entry.record_type === 'perception_goal') {
      result[entry.entry_key] = entry.entry_key;
      continue;
    }
    const text = await readFile(resolveWithin(workspace, entry.object_path), 'utf8');
    const data = matter(text).data;
    const goalRefs = data.goal_refs ?? [];
    if (goalRefs.length === 1 && goalEntries.has(goalRefs[0])) {
      result[entry.entry_key] = goalEntries.get(goalRefs[0]);
    }
  }
  return result;
}

function assertCandidateEntriesInSnapshot(candidates, snapshot) {
  const entries = new Map(snapshot.source_entries.map((entry) => [entry.entry_key, entry]));
  for (const candidate of candidates) {
    const requested = [candidate.source_goal_entry, ...(candidate.source_entries ?? [])];
    for (const item of requested) {
      const actual = entries.get(item.entry_key);
      if (!actual
          || actual.object_id !== item.object_id
          || actual.object_version !== item.object_version
          || actual.file_sha256 !== item.file_sha256
          || item.record_type && actual.record_type !== item.record_type) {
        throw new CycleTraceError('CYCLE_GATE_REQUIRED', 'Review candidate entry 不属于 review CIS');
      }
    }
    if (entries.get(candidate.source_goal_entry.entry_key)?.record_type !== 'perception_goal') {
      throw new CycleTraceError('CYCLE_GATE_REQUIRED', 'Review candidate Goal entry 类型非法');
    }
  }
}

async function deriveReviewCutoff(workspace, plan, objects) {
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  const cycle = byId.get(plan.cycle_ref);
  if (!cycle
      || cycle.data.version !== plan.reviewed_cycle_input_version
      || !cycle.data.core_versions?.input_snapshot?.ref) {
    throw new CycleTraceError('REVIEW_PRE_CUTOFF_INCOMPLETE', 'Review Cycle/version/freeze 不完整');
  }
  const base = cycle.data.core_versions.input_snapshot;
  const baseObject = byId.get(base.ref);
  if (!baseObject || baseObject.data.record_type !== 'cycle_input_snapshot') {
    throw new CycleTraceError('REVIEW_PRE_CUTOFF_INCOMPLETE', 'Review freeze CIS 不存在');
  }
  const transitions = [];
  const entryKeys = [];
  let reachedAnalytics = false;
  for (const ref of cycle.data.transition_refs ?? []) {
    const transition = byId.get(ref);
    if (!transition || transition.data.record_type !== 'cycle_transition') {
      throw new CycleTraceError('REVIEW_PRE_CUTOFF_INCOMPLETE', 'applied transition 不完整');
    }
    if (['review_waiting_human', 'review_decided'].includes(transition.data.to_stage)) break;
    const gate = byId.get(transition.data.gate_snapshot_version?.ref);
    if (!gate || gate.data.record_type !== 'cycle_input_snapshot') {
      throw new CycleTraceError('REVIEW_PRE_CUTOFF_INCOMPLETE', 'transition gate CIS 不完整');
    }
    transitions.push({ ref: gate.data.id, version: gate.data.version });
    entryKeys.push(
      ...gate.data.source_entries.map((entry) => entry.entry_key),
      ...gate.data.artifact_entries.map((entry) => entry.entry_key),
    );
    if (transition.data.to_stage === 'analytics_recorded') reachedAnalytics = true;
  }
  if (!reachedAnalytics) {
    throw new CycleTraceError('REVIEW_PRE_CUTOFF_INCOMPLETE', 'Review cutoff 尚未达到 analytics_recorded');
  }
  return {
    cycle,
    base,
    transitions,
    entryKeys: [...new Set(entryKeys)].sort(),
  };
}

export async function assembleCycleReview({ workspace, plan }) {
  const root = path.resolve(workspace);
  const snapshot = await buildCycleSnapshotPlan({
    workspace: root,
    id: plan.review_snapshot.id,
    snapshotKind: 'review',
    merchantRef: plan.merchant_ref,
    cycleRef: plan.cycle_ref,
    runRef: plan.run_ref,
    sourcePaths: plan.review_snapshot.source_paths,
    artifactPaths: plan.review_snapshot.artifact_paths,
    baseFreezeSnapshotVersion: plan.review_snapshot.base_freeze_snapshot_version,
    preReviewTransitionSnapshotVersions:
      plan.review_snapshot.pre_review_transition_snapshot_versions,
    preReviewEntryKeys: plan.review_snapshot.pre_review_entry_keys,
  });
  assertCandidateEntriesInSnapshot(plan.next_cycle_candidate_inputs, snapshot);
  const actualMembership = await entryGoalMapFromSnapshotPlan(root, snapshot);
  const candidateValidation = validateNextCycleCandidates(
    plan.next_cycle_candidate_inputs,
    { entryGoalMap: { ...candidateEntryGoalMap(plan), ...actualMembership } },
  );
  if (candidateValidation.errors.length > 0) {
    throw new CycleTraceError('CYCLE_GATE_REQUIRED', 'Cycle candidate 输入非法', {
      diagnostics: candidateValidation.errors,
    });
  }
  const objects = await objectsIn(root);
  const cutoff = await deriveReviewCutoff(root, plan, objects);
  if (!equalRef(plan.review_snapshot.base_freeze_snapshot_version, cutoff.base)
      || stableRefs(plan.review_snapshot.pre_review_transition_snapshot_versions) !== stableRefs(cutoff.transitions)
      || stableRefs(plan.review_snapshot.pre_review_entry_keys) !== stableRefs(cutoff.entryKeys)) {
    throw new CycleTraceError('REVIEW_PRE_CUTOFF_INCOMPLETE', '调用方 Review cutoff 与 applied Cycle 不一致');
  }
  await materializeCycleSnapshot({ workspace: root, plan: snapshot });
  const data = {
    id: plan.waiting_review.id,
    record_type: 'cycle_review',
    status: 'waiting_human',
    version: '1.0.0',
    created_at: cutoff.cycle.data.updated_at,
    updated_at: cutoff.cycle.data.updated_at,
    title: 'Synthetic Cycle Review',
    test_scope: { ...plan.test_scope },
    merchant_ref: plan.merchant_ref,
    cycle_ref: plan.cycle_ref,
    reviewed_cycle_input_version: plan.reviewed_cycle_input_version,
    review_input_snapshot_version: { ref: snapshot.snapshot.id, version: snapshot.snapshot.version },
    review_input_fingerprint: snapshot.manifest.fingerprint,
    goal_results: plan.goal_results,
    next_cycle_candidate_inputs: plan.next_cycle_candidate_inputs,
  };
  await preflightTestKnowledgeWrite({
    workspace: root, data, body: '# Synthetic Cycle Review\n', refClosure: false,
  });
  const result = await writeCreateOnly(
    root,
    plan.waiting_review.path,
    serializeMarkdownObject(data, '# Synthetic Cycle Review\n'),
    { idempotent: true, conflictCode: 'CYCLE_INPUT_SNAPSHOT_CONFLICT' },
  );
  return { action: result.action, data, review_snapshot: snapshot };
}

function equalRef(left, right) {
  return left?.ref === right?.ref && left?.version === right?.version;
}

function stableRefs(value) {
  return JSON.stringify([...(value ?? [])].sort((left, right) => {
    const a = typeof left === 'string' ? left : `${left.ref}@${left.version}`;
    const b = typeof right === 'string' ? right : `${right.ref}@${right.version}`;
    return a.localeCompare(b);
  }));
}

async function findById(workspace, id) {
  return (await objectsIn(workspace)).find((object) => object.data.id === id) ?? null;
}

export async function decideCycleReview({ workspace, decision }) {
  const root = path.resolve(workspace);
  const waiting = await findById(root, decision.waiting_review_ref);
  if (!waiting
      || waiting.data.record_type !== 'cycle_review'
      || waiting.data.status !== 'waiting_human'
      || !decision.approval
      || !decision.decided_review?.id
      || decision.decided_review.id === waiting.data.id) {
    throw new CycleTraceError('CYCLE_REVIEW_APPROVAL_REQUIRED', 'Cycle Review 决定缺少新 ID 或人工批准');
  }
  const reviewSnapshot = await findById(root, waiting.data.review_input_snapshot_version?.ref);
  if (!reviewSnapshot || reviewSnapshot.data.record_type !== 'cycle_input_snapshot') {
    throw new CycleTraceError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'Review CIS 不存在');
  }
  const manifestPath = `runs/${reviewSnapshot.data.run_ref}/${reviewSnapshot.data.manifest.artifact_path}`;
  let manifestBytes;
  try {
    manifestBytes = await readFile(resolveWithin(root, manifestPath));
  } catch {
    throw new CycleTraceError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'Review CIS manifest 不存在');
  }
  if (sha256(manifestBytes) !== reviewSnapshot.data.manifest.sha256
      || reviewSnapshot.data.manifest.fingerprint !== waiting.data.review_input_fingerprint) {
    throw new CycleTraceError('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'Review CIS manifest/fingerprint 漂移');
  }
  const data = {
    ...waiting.data,
    id: decision.decided_review.id,
    status: 'decided',
    version: '1.0.0',
    updated_at: decision.approval.approved_at,
    supersedes_ref: waiting.data.id,
    approval: decision.approval,
    goal_results: decision.goal_results,
    test_scope: { ...decision.test_scope },
  };
  const relative = decision.decided_review.path
    ?? `cycles/m6/reviews/${data.id.toLowerCase()}.md`;
  await preflightTestKnowledgeWrite({
    workspace: root, data, body: '# Decided Synthetic Cycle Review\n', refClosure: false,
  });
  const result = await writeCreateOnly(
    root,
    relative,
    serializeMarkdownObject(data, '# Decided Synthetic Cycle Review\n'),
    { idempotent: true, conflictCode: 'CYCLE_REVIEW_APPROVAL_REQUIRED' },
  );
  return { action: result.action, data };
}

export function validateReviewDecision({ waitingReview, reviewSnapshot }) {
  if (waitingReview.review_input_fingerprint !== reviewSnapshot.manifest.fingerprint) {
    throw new CycleTraceError(
      'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
      'Review fingerprint 与 pinned CIS 不一致',
    );
  }
  return { ok: true };
}

async function verifySnapshotCopies(workspace, snapshot) {
  const manifestRelative = `runs/${snapshot.run_ref}/${snapshot.manifest.artifact_path}`;
  const manifest = await readFile(resolveWithin(workspace, manifestRelative));
  if (sha256(manifest) !== snapshot.manifest.sha256) {
    throw new CycleTraceError('TRACE_INCOMPLETE', 'Snapshot manifest checksum 不一致', {
      snapshot_id: snapshot.id,
    });
  }
  const byId = new Map();
  for (const entry of snapshot.source_entries) {
    const relative = `runs/${snapshot.run_ref}/${entry.snapshot_path}`;
    const bytes = await readFile(resolveWithin(workspace, relative));
    if (sha256(bytes) !== entry.snapshot_sha256) {
      throw new CycleTraceError('TRACE_INCOMPLETE', 'Snapshot copy checksum 不一致', {
        snapshot_id: snapshot.id,
        object_id: entry.object_id,
      });
    }
    const parsed = matter(bytes.toString('utf8'));
    byId.set(parsed.data.id, parsed.data);
  }
  for (const entry of snapshot.artifact_entries) {
    const relative = `runs/${snapshot.run_ref}/${entry.snapshot_path}`;
    let bytes;
    try {
      bytes = await readFile(resolveWithin(workspace, relative));
    } catch {
      throw new CycleTraceError('TRACE_INCOMPLETE', 'Snapshot artifact copy 缺失', {
        snapshot_id: snapshot.id,
        path: relative,
      });
    }
    if (sha256(bytes) !== entry.snapshot_sha256) {
      throw new CycleTraceError('TRACE_INCOMPLETE', 'Snapshot artifact copy checksum 不一致', {
        snapshot_id: snapshot.id,
        path: relative,
      });
    }
  }
  return byId;
}

export async function traceCycle({ workspace, cycleId, active = false }) {
  const root = path.resolve(workspace);
  const objects = await objectsIn(root);
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  const cycle = byId.get(cycleId);
  const base = {
    scope: 'knowledge_independent_engineering',
  };
  if (!cycle) {
    let testKnowledgeWorkspace = false;
    try {
      const identity = JSON.parse(await readFile(path.join(root, 'workspace.json'), 'utf8'));
      testKnowledgeWorkspace = identity.workspace_mode === 'development_test'
        && identity.knowledge_base_mode === 'test_only';
    } catch {
      testKnowledgeWorkspace = false;
    }
    return {
      ...base,
      synthetic: testKnowledgeWorkspace,
      real_myyshop_impact: testKnowledgeWorkspace ? false : null,
      errors: [{ code: 'TRACE_INCOMPLETE', ref: cycleId }],
      lifecycle_ready: false,
      goal_tracks: [],
    };
  }
  const errors = [];
  const snapshotObjects = new Map();
  const synthetic = cycle.data.scope === 'knowledge_independent_engineering'
    && cycle.data.test_scope?.kind === 'synthetic'
    && cycle.data.test_scope?.usage === 'test_only';
  if (!synthetic) {
    errors.push({ code: 'SYNTHETIC_REAL_REF_CONTAMINATION', ref: cycle.data.id });
  }
  const snapshotIds = new Set([cycle.data.core_versions?.input_snapshot?.ref]);
  const transitions = [];
  for (const ref of cycle.data.transition_refs ?? []) {
    const transition = byId.get(ref);
    if (!transition) {
      errors.push({ code: 'TRACE_INCOMPLETE', ref });
      continue;
    }
    transitions.push(transition.data);
    snapshotIds.add(transition.data.gate_snapshot_version?.ref);
  }
  if (cycle.data.cycle_review_version?.ref) {
    const review = byId.get(cycle.data.cycle_review_version.ref);
    if (!review) errors.push({ code: 'TRACE_INCOMPLETE', ref: cycle.data.cycle_review_version.ref });
    else snapshotIds.add(review.data.review_input_snapshot_version?.ref);
  }
  for (const snapshotId of snapshotIds) {
    const snapshot = byId.get(snapshotId);
    if (!snapshot) {
      errors.push({ code: 'TRACE_INCOMPLETE', ref: snapshotId });
      continue;
    }
    try {
      const frozen = await verifySnapshotCopies(root, snapshot.data);
      snapshotObjects.set(snapshotId, [...frozen.values()]);
      if (active) {
        for (const entry of snapshot.data.source_entries) {
          const live = byId.get(entry.object_id);
          if (!live || live.data.version !== entry.object_version) {
            errors.push({ code: 'CYCLE_VERSION_DRIFT', ref: entry.object_id });
          }
        }
      }
      if (snapshot.data.snapshot_kind === 'freeze' && frozen.size === 0) {
        errors.push({ code: 'TRACE_INCOMPLETE', ref: snapshotId });
      }
    } catch (error) {
      errors.push({ code: error.code ?? 'TRACE_INCOMPLETE', ref: snapshotId });
    }
  }
  for (const transition of transitions) {
    const gateObjects = snapshotObjects.get(transition.gate_snapshot_version?.ref) ?? [];
    if (!traceStageGateValid(gateObjects, transition.to_stage)) {
      errors.push({
        code: 'CYCLE_GATE_REQUIRED',
        transition_ref: transition.id,
        to_stage: transition.to_stage,
      });
    }
  }
  const stages = transitions.map((transition) => transition.to_stage);
  const freeze = byId.get(cycle.data.core_versions?.input_snapshot?.ref);
  const goalByEntry = new Map((freeze?.data.source_entries ?? [])
    .filter((entry) => entry.record_type === 'perception_goal')
    .map((entry) => [entry.entry_key, entry.object_id]));
  const goalTracks = cycle.data.goal_tracks.map((track) => {
    const goalRef = goalByEntry.get(track.goal_entry_key);
    const trackStages = goalRef
      ? transitions.filter((transition) => transition.goal_ref === goalRef)
        .map((transition) => transition.to_stage)
      : [];
    if (!goalRef || trackStages.length === 0) {
      errors.push({ code: 'TRACE_INCOMPLETE', goal_entry_key: track.goal_entry_key });
    }
    const expectedPrefix = REQUIRED_GOAL_STAGES.slice(0, trackStages.length);
    const sequenceMatches = JSON.stringify(trackStages) === JSON.stringify(expectedPrefix);
    const stageMatches = trackStages.at(-1) === track.stage
      || trackStages.length === 0 && track.stage === 'frozen';
    const completedExact = cycle.data.status !== 'completed'
      || cycle.data.completion_scope !== 'full'
      || JSON.stringify(trackStages) === JSON.stringify(REQUIRED_GOAL_STAGES);
    if (!sequenceMatches || !stageMatches || !completedExact) {
      errors.push({
        code: 'TRACE_INCOMPLETE',
        goal_entry_key: track.goal_entry_key,
        reason: 'goal_transition_sequence',
      });
    }
    return { goal_entry_key: track.goal_entry_key, goal_ref: goalRef ?? null, stages: trackStages };
  });
  return {
    ...base,
    synthetic,
    real_myyshop_impact: synthetic ? false : null,
    status: cycle.data.status,
    aggregate_stage: cycle.data.aggregate_stage,
    completion_scope: cycle.data.completion_scope,
    source: cycle.data.status === 'completed' ? 'snapshot_copies' : 'live_and_snapshot_copies',
    completed_history_requires_live_revision: false,
    errors,
    lifecycle_ready: errors.length === 0
      && cycle.data.status === 'completed'
      && cycle.data.completion_scope === 'full',
    goal_tracks: goalTracks,
  };
}
