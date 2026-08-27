import { readFile } from 'node:fs/promises';

import { serializeMarkdownObject } from './object-contract.mjs';
import { preflightSyntheticWrite } from './m6-test-merchant.mjs';
import {
  compareUtf8,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

const KIND_ORDER = Object.freeze({
  query_cluster: 1,
  content_gap: 2,
  evidence_gap: 3,
  severe_misperception: 4,
  recommendation_reason: 5,
  product_gap: 6,
});

function same(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function common(context, id, recordType, status, title) {
  return {
    id,
    record_type: recordType,
    status,
    version: '1.0.0',
    created_at: context.created_at,
    updated_at: context.created_at,
    title,
    test_scope: { ...context.test_scope },
  };
}

function reviewSnapshotVersion(context) {
  return context.review_input_snapshot_version;
}

export function candidateContentKey({ context, descriptor }) {
  return sha256(stableStringify({
    candidate_kind: descriptor.candidate_kind,
    review_input_snapshot_version: reviewSnapshotVersion(context),
    source_goal_entry_key: descriptor.source_goal_entry_key,
    source_entry_keys: [...descriptor.source_entry_keys].sort(compareUtf8),
    proposed_goal: descriptor.proposed_goal,
    rationale: descriptor.rationale,
    limitations: descriptor.limitations,
    evidence_gaps: descriptor.evidence_gaps,
    risks: descriptor.risks,
    strategy_gate_versions: descriptor.strategy_gate_versions ?? null,
  }));
}

export function sortRankedCandidateDescriptors(items) {
  return [...items].sort((left, right) =>
    left.rank_inputs.priority - right.rank_inputs.priority
    || left.rank_inputs.kind_order - right.rank_inputs.kind_order
    || compareUtf8(left.candidate_content_key, right.candidate_content_key));
}

function rankedDescriptors(context, descriptors) {
  const prepared = descriptors.map((descriptor) => {
    const contentKey = candidateContentKey({ context, descriptor });
    return {
      descriptor,
      candidate_content_key: contentKey,
      rank_inputs: {
        priority: descriptor.priority,
        kind_order: KIND_ORDER[descriptor.candidate_kind],
        tie_break_key: contentKey,
      },
    };
  });
  return sortRankedCandidateDescriptors(prepared)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function batchKey(context, ranked) {
  return sha256(stableStringify({
    review_ref: context.review_ref,
    review_version: context.review_version,
    review_file_sha256: context.review_file_sha256,
    review_input_snapshot_version: reviewSnapshotVersion(context),
    review_snapshot_fingerprint: context.review_snapshot_fingerprint,
    generator_rule: context.generator_rule,
    ordered_ranked_descriptors: ranked.map((item) => ({
      candidate_content_key: item.candidate_content_key,
      rank_inputs: item.rank_inputs,
      rank: item.rank,
    })),
  }));
}

function candidateInstanceKey(batch, item) {
  return sha256(stableStringify({
    batch_key: batch,
    candidate_content_key: item.candidate_content_key,
    rank_inputs: item.rank_inputs,
    rank: item.rank,
  }));
}

function assertContext(context, descriptors) {
  const required = [
    'merchant_ref', 'test_scope', 'created_at', 'run_ref', 'review_ref',
    'review_version', 'review_file_sha256', 'review_input_snapshot_version',
    'review_snapshot_fingerprint', 'generator_rule',
  ];
  if (required.some((field) => context?.[field] === undefined)
      || !Array.isArray(descriptors) || descriptors.length === 0
      || descriptors.some((item) => !(item.candidate_kind in KIND_ORDER))) {
    const failure = new Error('Cycle Goal Candidate 输入不完整');
    failure.code = 'GOAL_CANDIDATE_INPUT_DRIFT';
    throw failure;
  }
}

export function buildCandidateBatchPlan({ context, descriptors }) {
  assertContext(context, descriptors);
  const ranked = rankedDescriptors(context, descriptors);
  const key = batchKey(context, ranked);
  const batchId = `GCB-${key.slice(0, 24).toUpperCase()}`;
  const reviewVersion = {
    ref: context.review_ref,
    version: context.review_version,
    file_sha256: context.review_file_sha256,
  };
  const snapshotVersion = {
    ...reviewSnapshotVersion(context),
    fingerprint: context.review_snapshot_fingerprint,
  };
  const candidates = ranked.map((item) => {
    const instanceKey = candidateInstanceKey(key, item);
    return {
      ...common(
        context,
        `GCD-${instanceKey.slice(0, 24).toUpperCase()}`,
        'cycle_goal_candidate',
        'candidate',
        'Synthetic cycle goal candidate',
      ),
      merchant_ref: context.merchant_ref,
      candidate_batch_version: { ref: batchId, version: '1.0.0' },
      source_cycle_review_version: reviewVersion,
      review_input_snapshot_version: snapshotVersion,
      candidate_content_key: item.candidate_content_key,
      candidate_instance_key: instanceKey,
      candidate_kind: item.descriptor.candidate_kind,
      source_goal_entry_key: item.descriptor.source_goal_entry_key,
      source_entry_keys: [...item.descriptor.source_entry_keys].sort(compareUtf8),
      proposed_goal: item.descriptor.proposed_goal,
      rationale: item.descriptor.rationale,
      limitations: item.descriptor.limitations,
      evidence_gaps: item.descriptor.evidence_gaps,
      risks: item.descriptor.risks,
      rank_inputs: item.rank_inputs,
      rank: item.rank,
      ...(item.descriptor.strategy_gate_versions
        ? { strategy_gate_versions: item.descriptor.strategy_gate_versions }
        : {}),
    };
  });
  const batch = {
    ...common(context, batchId, 'cycle_goal_candidate_batch', 'recorded', 'Synthetic candidate batch'),
    merchant_ref: context.merchant_ref,
    source_cycle_review_version: reviewVersion,
    review_input_snapshot_version: snapshotVersion,
    generator_rule: context.generator_rule,
    batch_key: key,
    ordered_candidates: candidates.map((candidate) => ({
      candidate_content_key: candidate.candidate_content_key,
      rank_inputs: candidate.rank_inputs,
      rank: candidate.rank,
      candidate_instance_key: candidate.candidate_instance_key,
      candidate_version: { ref: candidate.id, version: candidate.version },
    })),
    run_ref: context.run_ref,
  };
  return { batch, candidates };
}

export function validateCandidateBatchClosure({ batch, candidates }) {
  const errors = [];
  if (!batch || !Array.isArray(candidates)
      || batch.ordered_candidates?.length !== candidates.length
      || new Set(candidates.map((item) => item.id)).size !== candidates.length) {
    return { errors: [{ code: 'GOAL_CANDIDATE_BATCH_INCOMPLETE' }] };
  }
  for (const [index, candidate] of candidates.entries()) {
    const ordered = batch.ordered_candidates[index];
    if (candidate.candidate_batch_version?.ref !== batch.id
        || candidate.candidate_batch_version?.version !== batch.version
        || ordered?.candidate_version?.ref !== candidate.id
        || ordered?.candidate_version?.version !== candidate.version
        || ordered?.candidate_content_key !== candidate.candidate_content_key
        || ordered?.candidate_instance_key !== candidate.candidate_instance_key
        || ordered?.rank !== candidate.rank
        || !same(ordered?.rank_inputs, candidate.rank_inputs)) {
      errors.push({ code: 'GOAL_CANDIDATE_BATCH_INCOMPLETE', candidate_id: candidate.id });
    }
  }
  if (errors.length === 0) {
    const context = {
      merchant_ref: batch.merchant_ref,
      test_scope: batch.test_scope,
      created_at: batch.created_at,
      run_ref: batch.run_ref,
      review_ref: batch.source_cycle_review_version?.ref,
      review_version: batch.source_cycle_review_version?.version,
      review_file_sha256: batch.source_cycle_review_version?.file_sha256,
      review_input_snapshot_version: {
        ref: batch.review_input_snapshot_version?.ref,
        version: batch.review_input_snapshot_version?.version,
      },
      review_snapshot_fingerprint: batch.review_input_snapshot_version?.fingerprint,
      generator_rule: batch.generator_rule,
    };
    const descriptors = candidates.map((candidate) => ({
      candidate_kind: candidate.candidate_kind,
      source_goal_entry_key: candidate.source_goal_entry_key,
      source_entry_keys: candidate.source_entry_keys,
      proposed_goal: candidate.proposed_goal,
      rationale: candidate.rationale,
      limitations: candidate.limitations,
      evidence_gaps: candidate.evidence_gaps,
      risks: candidate.risks,
      priority: candidate.rank_inputs?.priority,
      ...(candidate.strategy_gate_versions
        ? { strategy_gate_versions: candidate.strategy_gate_versions }
        : {}),
    }));
    try {
      const rebuilt = buildCandidateBatchPlan({ context, descriptors });
      if (!same(rebuilt.batch, batch)
          || !same(rebuilt.candidates, candidates)) {
        errors.push({ code: 'GOAL_CANDIDATE_INPUT_DRIFT' });
      }
    } catch {
      errors.push({ code: 'GOAL_CANDIDATE_INPUT_DRIFT' });
    }
  }
  return { errors };
}

function gateIdentity(object) {
  return object?.product_gap_identity ?? object?.eligibility_inputs?.product_gap_identity ?? null;
}

export function validateProductGapCandidate({ candidate, gates }) {
  const errors = [];
  if (candidate.candidate_kind !== 'product_gap') {
    if (candidate.strategy_gate_versions) {
      errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH' });
    }
    return { errors };
  }
  if (!gates || !candidate.strategy_gate_versions) {
    return { errors: [{ code: 'GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED' }] };
  }
  const expected = candidate.strategy_gate_versions.product_gap_identity;
  const identities = [
    gates.reviewProductGapIdentity,
    gates.strategyProductGapIdentity,
    gateIdentity(gates.assessment),
    gateIdentity(gates.output),
    ...(gates.dimensions ?? []).map(gateIdentity),
  ];
  if (identities.some((identity) => !same(identity, expected))) {
    errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH' });
  }
  if (gates.assessment?.status !== 'decided' || gates.assessment?.decision !== 'proceed') {
    errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', gate: 'assessment' });
  }
  if (!(gates.dimensions ?? []).some((dimension) =>
    dimension?.status === 'decision_factor'
    && dimension.factor_decision?.verdict === 'promoted')) {
    errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', gate: 'decision_dimension' });
  }
  if (gates.output?.status !== 'draft') {
    errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', gate: 'strategy_output' });
  }
  const productEntries = candidate.source_entry_keys.filter((key) =>
    key === candidate.strategy_gate_versions.review_product_gap_entry_key);
  if (productEntries.length !== 1) {
    errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', gate: 'review_product_gap' });
  }
  return { errors };
}

async function currentBytes(workspace, target) {
  try {
    return await readFile(resolveWithin(workspace, target));
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'PATH_NOT_FOUND') return null;
    throw error;
  }
}

export async function materializeCandidateBatch({
  workspace,
  batch,
  candidates,
  batchPath,
  candidatePaths,
}) {
  const checked = validateCandidateBatchClosure({ batch, candidates });
  if (checked.errors.length > 0 || !batchPath
      || candidates.some((candidate) => !candidatePaths?.[candidate.id])) {
    const failure = new Error('Cycle Goal Candidate batch 闭包不完整');
    failure.code = 'GOAL_CANDIDATE_BATCH_INCOMPLETE';
    throw failure;
  }
  const targets = [
    {
      path: batchPath,
      data: batch,
      body: '# Synthetic Cycle Goal Candidate Batch\n',
    },
    ...candidates.map((candidate) => ({
      path: candidatePaths[candidate.id],
      data: candidate,
      body: '# Synthetic Cycle Goal Candidate\n',
    })),
  ].map((target) => ({
    ...target,
    bytes: Buffer.from(serializeMarkdownObject(target.data, target.body)),
  }));
  for (const target of targets) {
    await preflightSyntheticWrite({
      workspace,
      data: target.data,
      body: target.body,
      manifest: { batch_key: batch.batch_key },
      refClosure: false,
    });
    const existing = await currentBytes(workspace, target.path);
    if (existing && !existing.equals(target.bytes)) {
      const failure = new Error('Cycle Goal Candidate create-only bytes 冲突');
      failure.code = 'GOAL_CANDIDATE_BATCH_CONFLICT';
      failure.path = target.path;
      throw failure;
    }
  }
  const results = [];
  for (const target of targets) {
    results.push(await writeCreateOnly(workspace, target.path, target.bytes, {
      idempotent: true,
      conflictCode: 'GOAL_CANDIDATE_BATCH_CONFLICT',
    }));
  }
  return {
    action: results.every((item) => item.action === 'kept') ? 'kept' : 'created',
    batch_ref: batch.id,
    candidate_refs: candidates.map((item) => item.id),
  };
}
