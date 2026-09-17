import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  buildCandidateBatchPlan,
  materializeCandidateBatch,
  validateProductGapCandidate,
} from './cycle-goal-candidates.mjs';
import {
  buildDraftGoalSelection,
  materializeGoalSelection,
} from './cycle-goal-selection.mjs';
import { validateDecisionDimensionLineage } from './decision-dimension.mjs';
import {
  assertDevelopmentWorkspaceWriteAllowed,
  preflightTestKnowledgeWrite,
  validateDevelopmentKnowledgeWorkspace,
} from './workspace-scope.mjs';
import { serializeMarkdownObject } from './object-contract.mjs';
import { traceStrategy } from './strategy-trace.mjs';
import { validateStrategyObject } from './strategy-profile.mjs';
import { traceCycle } from './cycle-trace.mjs';
import {
  assertCreateOnlyTargets,
  canonicalObjectMap,
  entryIdentity,
  entryTuple,
  exactVersion,
  loadCanonicalSnapshot,
  makeFailure,
  sameJson,
} from './cycle-two-workspace.mjs';
import { compareUtf8, resolveWithin, sha256, stableStringify } from './workspace-paths.mjs';

const KIND_ORDER = Object.freeze({
  query_cluster: 1,
  content_gap: 2,
  evidence_gap: 3,
  severe_misperception: 4,
  recommendation_reason: 5,
  product_gap: 6,
});

async function validateWorkspace(root) {
  await assertDevelopmentWorkspaceWriteAllowed({ workspace: root });
  const result = await validateDevelopmentKnowledgeWorkspace({ workspace: root });
  if (result.errors.length > 0) {
    throw makeFailure(result.errors[0].code, 'M7 Test Workspace 未就绪', {
      diagnostics: result.errors,
    });
  }
  return result;
}

function assertReviewCandidate(input, reviewGraph) {
  const goal = reviewGraph.entries.get(input.source_goal_entry?.entry_key);
  if (!goal || goal.data.record_type !== 'perception_goal'
      || !sameJson(entryTuple(goal), input.source_goal_entry)) {
    throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Review candidate Goal tuple 漂移');
  }
  if (!Array.isArray(input.source_entries) || input.source_entries.length === 0) {
    throw makeFailure('CYCLE_ONE_REVIEW_REQUIRED', 'Review 未冻结候选 source entries');
  }
  for (const tuple of input.source_entries) {
    const actual = reviewGraph.entries.get(tuple.entry_key);
    if (!actual || !sameJson(entryTuple(actual), tuple)) {
      throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Review candidate source tuple 漂移', {
        entry_key: tuple.entry_key,
      });
    }
  }
  for (const field of ['goal_statement', 'success_question', 'query_cluster_key']) {
    if (!input[field]?.trim()) {
      throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Review candidate Goal 字段不完整', { field });
    }
  }
  return goal;
}

function checkExpected(object, spec, code = 'TRACE_INCOMPLETE') {
  if (spec && (object.data.id !== spec.id || object.path !== spec.path)) {
    throw makeFailure(code, 'plan expected object 与 canonical 对象不一致', {
      expected: spec,
      actual: { id: object.data.id, path: object.path },
    });
  }
}

async function productGapGates({ workspace, objects, review, reviewGraph, input, expected }) {
  const gapTuple = input.source_entries.find((tuple) => {
    const item = reviewGraph.entries.get(tuple.entry_key);
    return item?.data.record_type === 'finding' && item.data.diagnosis_class === 'product_gap';
  });
  if (!gapTuple) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', 'Product Gap tuple 未冻结');
  }
  const assessments = [...objects.values()].filter((object) =>
    object.data.record_type === 'strategy_assessment'
      && object.data.status === 'decided'
      && object.data.decision === 'proceed'
      && object.data.cycle_review_ref === review.data.id
      && object.data.cycle_review_version === review.data.version);
  if (assessments.length !== 1) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', '唯一 decided/proceed STA 不存在');
  }
  const assessment = assessments[0];
  checkExpected(assessment, expected?.decided_assessment, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  const waiting = objects.get(assessment.data.supersedes_ref);
  if (!waiting) throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', 'STA waiting 前态缺失');
  checkExpected(waiting, expected?.waiting_assessment, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  const assessmentCheck = validateStrategyObject(assessment.data, { prior: waiting.data });
  if (assessmentCheck.errors.length > 0) {
    throw makeFailure(assessmentCheck.errors[0].code, 'STA lineage 非法', {
      diagnostics: assessmentCheck.errors,
    });
  }
  const strategyGraph = await loadCanonicalSnapshot(
    workspace,
    assessment.data.strategy_input_snapshot_version.ref,
  );
  exactVersion(strategyGraph.snapshot, assessment.data.strategy_input_snapshot_version,
    'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  if (strategyGraph.snapshot.data.snapshot_kind !== 'strategy') {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', 'STA 未绑定 strategy CIS');
  }
  if (expected?.strategy_snapshot_id
      && strategyGraph.snapshot.data.id !== expected.strategy_snapshot_id) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', 'strategy CIS 与 plan 不一致');
  }
  const strategyGap = strategyGraph.entries.get(
    assessment.data.eligibility_inputs.product_gap_entry_key,
  );
  const identity = entryIdentity(reviewGraph.entries.get(gapTuple.entry_key));
  if (!strategyGap || !sameJson(entryIdentity(strategyGap), identity)
      || !sameJson(assessment.data.eligibility_inputs.product_gap_identity, identity)) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', 'Review/strategy Product Gap 换绑');
  }
  const dimensions = [...objects.values()].filter((object) =>
    object.data.record_type === 'decision_dimension'
      && object.data.strategy_assessment_version?.ref === assessment.data.id
      && object.data.strategy_assessment_version?.version === assessment.data.version);
  const candidate = dimensions.find((object) => object.data.status === 'candidate');
  const validated = dimensions.find((object) =>
    object.data.status === 'validated' && object.data.supersedes_ref === candidate?.data.id);
  const factor = dimensions.find((object) =>
    object.data.status === 'decision_factor' && object.data.supersedes_ref === validated?.data.id);
  if (!candidate || !validated || !factor
      || validateDecisionDimensionLineage({ current: candidate.data, prior: null }).errors.length > 0
      || validateDecisionDimensionLineage({ current: validated.data, prior: candidate.data }).errors.length > 0
      || validateDecisionDimensionLineage({ current: factor.data, prior: validated.data }).errors.length > 0) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', 'DDM candidate→validated→factor 链不完整');
  }
  checkExpected(candidate, expected?.candidate_dimension, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  checkExpected(validated, expected?.validated_dimension, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  checkExpected(factor, expected?.factor_dimension, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  const outputs = [...objects.values()].filter((object) =>
    object.data.record_type === 'strategy_output'
      && object.data.status === 'draft'
      && object.data.strategy_assessment_version?.ref === assessment.data.id
      && object.data.decision_dimension_versions?.some((item) =>
        item.ref === factor.data.id && item.version === factor.data.version));
  if (outputs.length !== 1) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', '唯一 STO draft 不存在');
  }
  const output = outputs[0];
  checkExpected(output, expected?.strategy_output, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  const trace = traceStrategy({
    assessment: assessment.data,
    snapshot: {
      snapshot_id: strategyGraph.snapshot.data.id,
      snapshot_kind: strategyGraph.snapshot.data.snapshot_kind,
    },
    dimensions: [candidate.data, validated.data, factor.data],
    output: output.data,
  });
  if (trace.errors.length > 0) {
    throw makeFailure(trace.errors[0].code, 'Strategy trace 不完整', { diagnostics: trace.errors });
  }
  return {
    trace,
    graph: strategyGraph,
    run_ref: output.data.run_ref,
    versions: {
      strategy_input_snapshot_version: { ...assessment.data.strategy_input_snapshot_version },
      review_product_gap_entry_key: gapTuple.entry_key,
      strategy_product_gap_entry_key: strategyGap.entry_key,
      product_gap_identity: identity,
      strategy_assessment_version: { ref: assessment.data.id, version: assessment.data.version },
      decision_dimension_versions: [{ ref: factor.data.id, version: factor.data.version }],
      strategy_output_version: { ref: output.data.id, version: output.data.version },
    },
    validation: {
      assessment: assessment.data,
      dimensions: [factor.data],
      output: output.data,
      reviewProductGapIdentity: identity,
      strategyProductGapIdentity: entryIdentity(strategyGap),
    },
  };
}

async function generatorRule(root, plan, runRef, strategyGraph = null) {
  const relative = plan.candidate_generator_rule_path;
  if (!relative || !relative.startsWith(`runs/${runRef}/outputs/`)) {
    throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Candidate rule 必须位于对应 Run outputs');
  }
  let bytes;
  try {
    bytes = await readFile(resolveWithin(root, relative));
  } catch {
    throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Candidate generator rule 不存在');
  }
  if (strategyGraph) {
    const frozen = [...strategyGraph.artifacts.values()].find((entry) =>
      entry.source_path === relative);
    if (!frozen || !frozen.bytes.equals(bytes)) {
      throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Candidate rule 未由 strategy CIS 冻结或 bytes 漂移');
    }
  }
  let rule;
  try { rule = JSON.parse(bytes); } catch {
    throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Candidate generator rule 不是合法 JSON');
  }
  if (rule.schema_version !== 'm7-cycle-goal-candidate-rule/1.0.0'
      || !rule.id || !/^\d+\.\d+\.\d+$/.test(rule.version ?? '')
      || !sameJson(rule.kind_order, KIND_ORDER)
      || rule.hidden_score !== false || rule.real_execution_authorized !== false
      || !rule.derived_fields?.rationale_template?.includes('{candidate_kind}')
      || !Array.isArray(rule.derived_fields?.limitations)
      || rule.derived_fields.limitations.length === 0) {
    throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'Candidate generator rule 合同非法');
  }
  return {
    data: rule,
    metadata: {
      id: rule.id,
      version: rule.version,
      artifact_path: relative.slice(`runs/${runRef}/`.length),
      sha256: sha256(bytes),
    },
    path: relative,
  };
}

function materializationPaths(batch, candidates, selection) {
  return {
    batchPath: `cycles/m7/candidate-batches/${batch.id.toLowerCase()}.md`,
    candidatePaths: Object.fromEntries(candidates.map((item) => [
      item.id,
      `cycles/m7/candidates/${item.id.toLowerCase()}.md`,
    ])),
    selectionPath: `cycles/m7/selections/${selection.id.toLowerCase()}.md`,
  };
}

export async function proposeCycleTwo({ workspace, reviewId, plan }) {
  const root = path.resolve(workspace);
  const validation = await validateWorkspace(root);
  if (plan?.network_access !== false || plan?.real_execution_authorized !== false
      || plan?.cycle_number !== 2) {
    throw makeFailure('STRATEGY_AUTO_TRIGGER_FORBIDDEN', 'Cycle 2 propose scope 非 test-only');
  }
  if (plan.cycle_one_review_handoff?.candidate_input !== undefined) {
    throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'plan 不得注入 Review candidate');
  }
  if (plan.predecessor_review_version?.ref
      && plan.predecessor_review_version.ref !== reviewId) {
    throw makeFailure('CYCLE_TWO_PREDECESSOR_MISMATCH', '--review 与 plan predecessor 不一致');
  }
  const objects = await canonicalObjectMap(root);
  const review = objects.get(reviewId);
  if (!review || review.data.record_type !== 'cycle_review'
      || review.data.status !== 'decided'
      || !Array.isArray(review.data.next_cycle_candidate_inputs)
      || review.data.next_cycle_candidate_inputs.length === 0) {
    throw makeFailure('CYCLE_ONE_REVIEW_REQUIRED', 'decided Cycle 1 Review/candidate 不存在');
  }
  if (plan.predecessor_review_version) {
    exactVersion(review, plan.predecessor_review_version, 'CYCLE_TWO_PREDECESSOR_MISMATCH');
  }
  const predecessorTrace = await traceCycle({ workspace: root, cycleId: review.data.cycle_ref });
  if (predecessorTrace.status !== 'completed' || predecessorTrace.errors?.length > 0) {
    throw makeFailure('CYCLE_ONE_REVIEW_REQUIRED', 'predecessor Cycle 1 未 completed', {
      diagnostics: predecessorTrace.errors ?? [],
    });
  }
  const reviewGraph = await loadCanonicalSnapshot(root, review.data.review_input_snapshot_version.ref);
  exactVersion(reviewGraph.snapshot, review.data.review_input_snapshot_version,
    'CYCLE_TWO_PREDECESSOR_MISMATCH');
  if (reviewGraph.snapshot.data.snapshot_kind !== 'review'
      || review.data.review_input_fingerprint !== reviewGraph.snapshot.data.manifest.fingerprint) {
    throw makeFailure('CYCLE_TWO_PREDECESSOR_MISMATCH', 'Review CIS fingerprint 漂移');
  }
  const strategyByInput = new Map();
  for (const input of review.data.next_cycle_candidate_inputs) {
    assertReviewCandidate(input, reviewGraph);
    if (input.candidate_kind === 'product_gap') {
      strategyByInput.set(input, await productGapGates({
        workspace: root,
        objects,
        review,
        reviewGraph,
        input,
        expected: plan.strategy_materialization,
      }));
    }
  }
  const strategyRuns = new Set([...strategyByInput.values()].map((item) => item.run_ref));
  const runRef = plan.run_ref ?? plan.strategy_materialization?.run_ref
    ?? (strategyRuns.size === 1 ? [...strategyRuns][0] : null);
  if (!runRef || (strategyRuns.size > 0 && !strategyRuns.has(runRef))) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', 'Candidate Run 与 Strategy Output 不一致');
  }
  const firstStrategy = strategyByInput.values().next().value ?? null;
  const rule = await generatorRule(root, plan, runRef, firstStrategy?.graph ?? null);
  const descriptors = [];
  let strategyTrace = { applicable: false, result: 'not_applicable', errors: [] };
  for (const input of review.data.next_cycle_candidate_inputs) {
    const strategy = strategyByInput.get(input);
    if (strategy) strategyTrace = strategy.trace;
    const descriptor = {
      candidate_kind: input.candidate_kind,
      source_goal_entry_key: input.source_goal_entry.entry_key,
      source_entry_keys: input.source_entries.map((item) => item.entry_key).sort(compareUtf8),
      proposed_goal: {
        statement: input.goal_statement,
        success_question: input.success_question,
        query_cluster_key: input.query_cluster_key,
      },
      rationale: rule.data.derived_fields.rationale_template.replaceAll(
        '{candidate_kind}', input.candidate_kind,
      ),
      limitations: [...rule.data.derived_fields.limitations],
      evidence_gaps: [...input.evidence_gaps],
      risks: [...input.risks],
      priority: /^P[0-3]$/.test(String(input.rank_inputs.priority)) ? Number(input.rank_inputs.priority.slice(1)) : input.rank_inputs.priority,
      ...(strategy ? { strategy_gate_versions: strategy.versions } : {}),
    };
    descriptors.push(descriptor);
  }
  const reviewSha = sha256(review.bytes);
  const context = {
    merchant_ref: review.data.merchant_ref,
    test_scope: { ...review.data.test_scope },
    created_at: review.data.updated_at,
    run_ref: runRef,
    review_ref: review.data.id,
    review_version: review.data.version,
    review_file_sha256: reviewSha,
    review_input_snapshot_version: { ...review.data.review_input_snapshot_version },
    review_snapshot_fingerprint: review.data.review_input_fingerprint,
    generator_rule: rule.metadata,
  };
  const { batch, candidates } = buildCandidateBatchPlan({ context, descriptors });
  for (const candidate of candidates.filter((item) => item.candidate_kind === 'product_gap')) {
    const input = review.data.next_cycle_candidate_inputs.find((item) =>
      item.source_goal_entry.entry_key === candidate.source_goal_entry_key);
    const strategy = strategyByInput.get(input);
    const checked = validateProductGapCandidate({ candidate, gates: strategy.validation });
    if (checked.errors.length > 0) {
      throw makeFailure(checked.errors[0].code, 'Product Gap Candidate strategy gate 非法', {
        diagnostics: checked.errors,
      });
    }
  }
  const selection = buildDraftGoalSelection({ context, batch, candidates });
  const paths = materializationPaths(batch, candidates, selection);
  const targets = [
    {
      path: paths.batchPath,
      bytes: Buffer.from(serializeMarkdownObject(batch, '# Synthetic Cycle Goal Candidate Batch\n')),
    },
    ...candidates.map((candidate) => ({
      path: paths.candidatePaths[candidate.id],
      bytes: Buffer.from(serializeMarkdownObject(candidate, '# Synthetic Cycle Goal Candidate\n')),
    })),
    {
      path: paths.selectionPath,
      bytes: Buffer.from(serializeMarkdownObject(selection, '# Synthetic Cycle Goal Selection\n')),
    },
  ];
  await preflightTestKnowledgeWrite({
    workspace: root,
    data: selection,
    body: '# Synthetic Cycle Goal Selection\n',
    manifest: selection.decision,
    refClosure: false,
  });
  await assertCreateOnlyTargets(root, targets, 'GOAL_CANDIDATE_BATCH_CONFLICT');
  const batchResult = await materializeCandidateBatch({
    workspace: root,
    batch,
    candidates,
    batchPath: paths.batchPath,
    candidatePaths: paths.candidatePaths,
  });
  const selectionResult = await materializeGoalSelection({
    workspace: root,
    path: paths.selectionPath,
    data: selection,
  });
  const byPath = new Map(targets.map((target) => [target.path, sha256(target.bytes)]));
  return {
    action: batchResult.action === 'kept' && selectionResult.action === 'kept' ? 'kept' : 'created',
    source_review_version: { ref: review.data.id, version: review.data.version, file_sha256: reviewSha },
    predecessor_review_version: { ref: review.data.id, version: review.data.version, file_sha256: reviewSha },
    source_candidate_fingerprint: sha256(stableStringify(review.data.next_cycle_candidate_inputs)),
    candidate_rule_path: rule.path,
    candidate_inputs_from_plan: false,
    batch_ref: batch.id,
    batch_path: paths.batchPath,
    batch_sha256: byPath.get(paths.batchPath),
    candidates: candidates.map((candidate) => ({
      ref: candidate.id,
      version: candidate.version,
      path: paths.candidatePaths[candidate.id],
      sha256: byPath.get(paths.candidatePaths[candidate.id]),
    })),
    candidate_refs: candidates.map((candidate) => candidate.id),
    selection_draft_ref: selection.id,
    selection_draft_path: paths.selectionPath,
    selection_draft_sha256: byPath.get(paths.selectionPath),
    strategy_trace: strategyTrace,
    auto_selected: false,
    auto_approved: false,
    network_accessed: false,
    workspace_id: validation.identity.workspace_id,
    written_paths: targets.map((target) => target.path),
  };
}
