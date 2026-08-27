import { stableStringify } from './workspace-paths.mjs';

function same(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function identity(object) {
  return object?.product_gap_identity ?? object?.eligibility_inputs?.product_gap_identity ?? null;
}

export function traceStrategy({ assessment, snapshot, dimensions = [], output = null }) {
  if (!assessment) {
    return {
      applicable: false,
      result: 'not_applicable',
      warnings: [{ code: 'STRATEGY_NOT_TRIGGERED' }],
      errors: [],
    };
  }
  const errors = [];
  if (snapshot?.snapshot_kind !== 'strategy'
      || assessment.strategy_input_snapshot_version?.ref !== snapshot.snapshot_id) {
    errors.push({ code: 'TRACE_INCOMPLETE', edge: 'strategy_snapshot' });
  }
  if (assessment.status !== 'decided' || assessment.decision !== 'proceed') {
    errors.push({ code: 'TRACE_INCOMPLETE', edge: 'human_proceed_decision' });
  }
  const expectedIdentity = identity(assessment);
  for (const dimension of dimensions) {
    if (!same(identity(dimension), expectedIdentity)) {
      errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', id: dimension.id });
    }
  }
  if (!output) {
    errors.push({ code: 'TRACE_INCOMPLETE', edge: 'strategy_output' });
  } else if (!same(identity(output), expectedIdentity)) {
    errors.push({ code: 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', id: output.id });
  }
  if (!dimensions.some((item) => item.status === 'decision_factor')) {
    errors.push({ code: 'TRACE_INCOMPLETE', edge: 'decision_factor' });
  }
  return {
    applicable: true,
    result: errors.length === 0 ? 'complete' : 'incomplete',
    human_invocation: assessment.human_invocation,
    assessment: { id: assessment.id, status: assessment.status, decision: assessment.decision },
    product_gap_identity: expectedIdentity,
    dimensions: dimensions.map(({ id, status }) => ({ id, status })),
    output: output ? { id: output.id, status: output.status } : null,
    errors,
  };
}

export function traceCycleTwo({ predecessorReview, batch, candidates, selection, cycle }) {
  const errors = [];
  if (predecessorReview?.status !== 'decided') {
    errors.push({ code: 'CYCLE_ONE_REVIEW_REQUIRED' });
  }
  if (batch?.source_cycle_review_version?.ref !== predecessorReview?.id) {
    errors.push({ code: 'CYCLE_TWO_PREDECESSOR_MISMATCH' });
  }
  const selected = selection?.decision?.selected_candidate_version;
  const candidate = candidates.find((item) => item.id === selected?.ref && item.version === selected?.version);
  if (selection?.status !== 'decided' || !selected || !candidate) {
    errors.push({ code: 'GOAL_SELECTION_REQUIRED' });
  }
  if (cycle?.cycle_number !== 2
      || cycle?.predecessor_review_version?.ref !== predecessorReview?.id
      || cycle?.goal_selection_version?.ref !== selection?.id) {
    errors.push({ code: 'CYCLE_TWO_PREDECESSOR_MISMATCH' });
  }
  return {
    result: errors.length === 0 ? 'complete' : 'incomplete',
    predecessor_review: predecessorReview?.id ?? null,
    batch: batch?.id ?? null,
    selected_candidate: candidate?.id ?? null,
    selection: selection?.id ?? null,
    cycle: cycle?.id ?? null,
    errors,
  };
}
