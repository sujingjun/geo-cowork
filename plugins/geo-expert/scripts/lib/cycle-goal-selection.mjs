import { serializeMarkdownObject } from './object-contract.mjs';
import { preflightTestKnowledgeWrite } from './workspace-scope.mjs';
import {
  compareUtf8,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

function sortedVersions(items) {
  return [...items].sort((left, right) => compareUtf8(left.ref, right.ref));
}

function common(context, id, status) {
  return {
    id,
    record_type: 'cycle_goal_selection',
    status,
    version: '1.0.0',
    created_at: context.created_at,
    updated_at: context.created_at,
    title: 'Synthetic Cycle Goal Selection',
    test_scope: { ...context.test_scope },
    merchant_ref: context.merchant_ref,
  };
}

export function selectionDecisionKey({ batchKey, phase, selected, rejected, deferred, reason, approval }) {
  return sha256(stableStringify({
    batch_key: batchKey,
    phase,
    selected,
    rejected: sortedVersions(rejected),
    deferred: sortedVersions(deferred),
    reason,
    approval,
  }));
}

export function buildDraftGoalSelection({ context, batch, candidates }) {
  const versions = candidates.map(({ id, version }) => ({ ref: id, version }));
  const decisionKey = selectionDecisionKey({
    batchKey: batch.batch_key,
    phase: 'draft',
    selected: null,
    rejected: [],
    deferred: [],
    reason: null,
    approval: null,
  });
  return {
    ...common(context, `GSEL-${decisionKey.slice(0, 24).toUpperCase()}`, 'draft'),
    source_cycle_review_version: batch.source_cycle_review_version,
    candidate_batch_version: { ref: batch.id, version: batch.version },
    batch_key: batch.batch_key,
    decision_key: decisionKey,
    candidate_versions: versions,
    decision: {
      selected_candidate_version: null,
      rejected_candidate_versions: [],
      deferred_candidate_versions: [],
      reason: null,
    },
  };
}

function refKey(item) {
  return `${item.ref}\0${item.version}`;
}

function same(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function expectedDecisionIdentity(data) {
  const phase = data.status === 'draft' ? 'draft' : 'decided';
  const key = selectionDecisionKey({
    batchKey: data.batch_key,
    phase,
    selected: data.decision?.selected_candidate_version ?? null,
    rejected: data.decision?.rejected_candidate_versions ?? [],
    deferred: data.decision?.deferred_candidate_versions ?? [],
    reason: data.decision?.reason ?? null,
    approval: data.approval ?? null,
  });
  return { key, id: `GSEL-${key.slice(0, 24).toUpperCase()}` };
}

export function validateGoalSelection(data, { prior = null } = {}) {
  const errors = [];
  const candidates = new Set((data.candidate_versions ?? []).map(refKey));
  const selected = data.decision?.selected_candidate_version
    ? [data.decision.selected_candidate_version] : [];
  const rejected = data.decision?.rejected_candidate_versions ?? [];
  const deferred = data.decision?.deferred_candidate_versions ?? [];
  const partition = [...selected, ...rejected, ...deferred].map(refKey);
  if (new Set(partition).size !== partition.length
      || partition.some((item) => !candidates.has(item))) {
    errors.push({ code: 'GOAL_SELECTION_PARTITION_INVALID' });
  }
  const expected = expectedDecisionIdentity(data);
  if (data.decision_key !== expected.key || data.id !== expected.id) {
    errors.push({ code: 'GOAL_CANDIDATE_INPUT_DRIFT' });
  }
  if (data.status === 'draft') {
    if (partition.length > 0 || data.approval || data.supersedes_ref) {
      errors.push({ code: 'STRATEGY_AUTO_TRIGGER_FORBIDDEN' });
    }
  } else if (data.status === 'decided') {
    if (!prior || prior.status !== 'draft' || data.id === prior.id
        || data.supersedes_ref !== prior.id || !data.approval
        || !data.decision?.reason?.trim()
        || data.merchant_ref !== prior.merchant_ref
        || data.batch_key !== prior.batch_key
        || !same(data.test_scope, prior.test_scope)
        || !same(data.source_cycle_review_version, prior.source_cycle_review_version)
        || !same(data.candidate_batch_version, prior.candidate_batch_version)
        || !same(data.candidate_versions, prior.candidate_versions)) {
      errors.push({ code: 'GOAL_SELECTION_APPROVAL_REQUIRED' });
    }
    if (partition.length !== candidates.size) {
      errors.push({ code: 'GOAL_SELECTION_PARTITION_INVALID' });
    }
  }
  return { errors };
}

export function buildDecidedGoalSelection({
  context,
  draft,
  selected = null,
  rejected = [],
  deferred = [],
  reason,
  approval,
}) {
  const sortedRejected = sortedVersions(rejected);
  const sortedDeferred = sortedVersions(deferred);
  const decisionKey = selectionDecisionKey({
    batchKey: draft.batch_key,
    phase: 'decided',
    selected,
    rejected: sortedRejected,
    deferred: sortedDeferred,
    reason,
    approval,
  });
  const data = {
    ...common(context, `GSEL-${decisionKey.slice(0, 24).toUpperCase()}`, 'decided'),
    source_cycle_review_version: draft.source_cycle_review_version,
    candidate_batch_version: draft.candidate_batch_version,
    batch_key: draft.batch_key,
    decision_key: decisionKey,
    candidate_versions: draft.candidate_versions,
    decision: {
      selected_candidate_version: selected,
      rejected_candidate_versions: sortedRejected,
      deferred_candidate_versions: sortedDeferred,
      reason,
    },
    approval,
    supersedes_ref: draft.id,
  };
  const checked = validateGoalSelection(data, { prior: draft });
  if (checked.errors.length > 0) {
    const failure = new Error('Cycle Goal Selection 决定非法');
    failure.code = checked.errors[0].code;
    failure.diagnostics = checked.errors;
    throw failure;
  }
  return data;
}

export async function materializeGoalSelection({ workspace, path, data, prior = null }) {
  const checked = validateGoalSelection(data, { prior });
  if (checked.errors.length > 0) {
    const failure = new Error('Cycle Goal Selection 校验失败');
    failure.code = checked.errors[0].code;
    throw failure;
  }
  const body = '# Synthetic Cycle Goal Selection\n';
  await preflightTestKnowledgeWrite({ workspace, data, body, manifest: data.decision });
  return writeCreateOnly(workspace, path, serializeMarkdownObject(data, body), {
    idempotent: true,
    conflictCode: 'GOAL_CANDIDATE_BATCH_CONFLICT',
  });
}
