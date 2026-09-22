import { validateDecisionDimensionLineage } from './decision-dimension.mjs';

const M7_TYPES = new Set([
  'strategy_assessment',
  'decision_dimension',
  'cycle_goal_candidate_batch',
  'cycle_goal_candidate',
  'cycle_goal_selection',
  'strategy_output',
]);

function add(errors, code, details = {}) {
  errors.push({ code, ...details });
}

function validTestScope(data) {
  return data.test_scope?.kind === 'synthetic'
    && data.test_scope?.usage === 'test_only'
    && data.test_scope?.merchant_ref === data.merchant_ref
    && typeof data.test_scope?.workspace_id === 'string'
    && typeof data.test_scope?.knowledge_base_ref === 'string';
}

function validateAssessment(data, prior, errors) {
  if (!data.human_invocation?.decision_ref) add(errors, 'STRATEGY_HUMAN_TRIGGER_REQUIRED');
  const checks = Object.values(data.eligibility_checks ?? {});
  if (data.status === 'decided') {
    if (!prior || prior.record_type !== 'strategy_assessment'
        || prior.status !== 'waiting_human'
        || data.id === prior.id
        || data.supersedes_ref !== prior.id) {
      add(errors, 'STRATEGY_ASSESSMENT_LINEAGE_INVALID');
    }
    if (!data.approval) add(errors, 'DECISION_DIMENSION_APPROVAL_REQUIRED');
    if (data.decision === 'pending') add(errors, 'STRATEGY_TRIGGER_CHECK_INCOMPLETE');
    if (data.decision === 'proceed'
        && (data.eligibility_result !== 'eligible'
          || checks.length !== 4
          || checks.some((item) => item.state !== 'pass'))) {
      add(errors, 'STRATEGY_TRIGGER_CHECK_INCOMPLETE');
    }
  } else if (data.decision !== 'pending' || data.approval || data.supersedes_ref) {
    add(errors, 'STRATEGY_AUTO_TRIGGER_FORBIDDEN');
  }
}

function validateCandidate(data, errors) {
  if (data.candidate_kind === 'product_gap' && !data.strategy_gate_versions) {
    add(errors, 'GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED');
  }
  if (data.candidate_kind !== 'product_gap' && data.strategy_gate_versions) {
    add(errors, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  }
  if (data.rank_inputs?.tie_break_key !== data.candidate_content_key) {
    add(errors, 'GOAL_CANDIDATE_INPUT_DRIFT');
  }
}

function validateSelection(data, errors) {
  if (data.status === 'draft') {
    if (data.approval || data.supersedes_ref
        || data.decision?.selected_candidate_version
        || (data.decision?.rejected_candidate_versions?.length ?? 0) > 0
        || (data.decision?.deferred_candidate_versions?.length ?? 0) > 0) {
      add(errors, 'STRATEGY_AUTO_TRIGGER_FORBIDDEN');
    }
  } else if (data.status === 'decided' && (!data.approval || !data.supersedes_ref)) {
    add(errors, 'GOAL_SELECTION_APPROVAL_REQUIRED');
  }
}

function validateOutput(data, errors) {
  const roles = data.artifacts?.map((item) => item.role) ?? [];
  const expected = ['human_validation_plan', 'opportunity_analysis', 'prd_draft'];
  if (new Set(roles).size !== 3
      || [...roles].sort().join('\0') !== expected.join('\0')) {
    add(errors, 'STRATEGY_OUTPUT_CONFLICT');
  }
  if (data.validation_plan_contract?.real_execution_authorized !== false
      || data.validation_plan_contract?.auto_approval !== false) {
    add(errors, 'STRATEGY_AUTO_TRIGGER_FORBIDDEN');
  }
}

export function validateStrategyObject(data, { prior = null } = {}) {
  const errors = [];
  const warnings = [];
  if (!M7_TYPES.has(data?.record_type)) return { errors, warnings };
  const realGoalObject = ['cycle_goal_candidate_batch', 'cycle_goal_candidate', 'cycle_goal_selection'].includes(data.record_type)
    && data.execution_scope === 'authorized_real' && !data.test_scope
    && /^MER-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(data.merchant_ref ?? '')
    && /^KBASE-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(data.knowledge_base_ref ?? '');
  if (!validTestScope(data) && !realGoalObject) add(errors, 'TEST_KNOWLEDGE_SCOPE_REQUIRED');
  switch (data.record_type) {
    case 'strategy_assessment':
      validateAssessment(data, prior, errors);
      break;
    case 'decision_dimension':
      errors.push(...validateDecisionDimensionLineage({ current: data, prior }).errors);
      break;
    case 'cycle_goal_candidate':
      validateCandidate(data, errors);
      break;
    case 'cycle_goal_selection':
      validateSelection(data, errors);
      break;
    case 'strategy_output':
      validateOutput(data, errors);
      break;
    default:
      break;
  }
  return { errors, warnings };
}
