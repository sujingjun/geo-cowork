import { serializeMarkdownObject } from './object-contract.mjs';
import { preflightTestKnowledgeWrite } from './workspace-scope.mjs';
import { stableStringify, writeCreateOnly } from './workspace-paths.mjs';

function error(code, details = {}) {
  return { code, ...details };
}

function same(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function decisionRefs(data) {
  return [
    data.validation_decision?.decision_ref,
    data.factor_decision?.decision_ref,
    data.deprecation_decision?.decision_ref,
  ].filter(Boolean);
}

function decisionShape(data, prior) {
  if (!prior) {
    return data.status === 'candidate'
      && !data.validation_decision
      && !data.factor_decision
      && !data.deprecation_decision
      && !data.supersedes_ref;
  }
  if (prior.status === 'candidate' && data.status === 'validated') {
    return data.validation_decision?.verdict === 'validated'
      && !data.factor_decision && !data.deprecation_decision;
  }
  if (prior.status === 'candidate' && data.status === 'deprecated') {
    return data.validation_decision?.verdict === 'rejected'
      && !data.factor_decision && !data.deprecation_decision;
  }
  if (prior.status === 'validated' && data.status === 'decision_factor') {
    return data.validation_decision?.verdict === 'validated'
      && data.factor_decision?.verdict === 'promoted'
      && !data.deprecation_decision;
  }
  if (prior.status === 'validated' && ['validated', 'deprecated'].includes(data.status)) {
    return data.validation_decision?.verdict === 'validated'
      && data.factor_decision?.verdict === 'rejected'
      && !data.deprecation_decision;
  }
  if (prior.status === 'decision_factor' && data.status === 'deprecated') {
    return data.validation_decision?.verdict === 'validated'
      && data.factor_decision?.verdict === 'promoted'
      && data.deprecation_decision?.verdict === 'deprecated';
  }
  return false;
}

function inheritedDecisionsMatch(data, prior) {
  if (!prior) return true;
  for (const field of ['validation_decision', 'factor_decision']) {
    if (prior[field] && !same(data[field], prior[field])) return false;
  }
  return true;
}

function scopeMatches(data, prior) {
  if (!prior) return true;
  return data.merchant_ref === prior.merchant_ref
    && same(data.strategy_assessment_version, prior.strategy_assessment_version)
    && same(data.strategy_input_snapshot_version, prior.strategy_input_snapshot_version)
    && data.product_gap_entry_key === prior.product_gap_entry_key
    && same(data.product_gap_identity, prior.product_gap_identity);
}

export function validateDecisionDimensionLineage({ current, prior }) {
  const errors = [];
  if (!current || current.record_type !== 'decision_dimension') {
    return { errors: [error('DECISION_DIMENSION_TRANSITION_INVALID')] };
  }
  if (prior) {
    if (prior.record_type !== 'decision_dimension'
        || current.id === prior.id
        || current.supersedes_ref !== prior.id) {
      errors.push(error('DECISION_DIMENSION_LINEAGE_INVALID'));
    }
    if (prior.status === 'deprecated' || current.status === 'candidate') {
      errors.push(error('DECISION_DIMENSION_TRANSITION_INVALID'));
    }
    if (!scopeMatches(current, prior)) {
      errors.push(error('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH'));
    }
    if (!inheritedDecisionsMatch(current, prior)) {
      errors.push(error('DECISION_DIMENSION_DECISION_DRIFT'));
    }
  }
  if (!decisionShape(current, prior)) {
    errors.push(error('DECISION_DIMENSION_TRANSITION_INVALID', {
      from: prior?.status ?? null,
      to: current.status,
    }));
  }
  const refs = decisionRefs(current);
  if (new Set(refs).size !== refs.length) {
    errors.push(error('DECISION_DIMENSION_DECISION_REF_REUSED'));
  }
  if (current.factor_decision?.verdict === 'promoted') {
    const impact = current.basis?.supporting_observations?.length ?? 0;
    if (impact === 0) errors.push(error('DECISION_DIMENSION_EVIDENCE_INSUFFICIENT'));
  }
  return { errors };
}

export function buildDecisionDimensionSuccessor({ prior, id, status, decision, updatedAt }) {
  const field = prior.status === 'candidate'
    ? 'validation_decision'
    : prior.status === 'validated' ? 'factor_decision' : 'deprecation_decision';
  const current = {
    ...prior,
    id,
    status,
    updated_at: updatedAt ?? prior.updated_at,
    supersedes_ref: prior.id,
    [field]: decision,
  };
  const result = validateDecisionDimensionLineage({ current, prior });
  if (result.errors.length > 0) {
    const problem = new Error('Decision Dimension 状态推进非法');
    problem.code = result.errors[0].code;
    problem.diagnostics = result.errors;
    throw problem;
  }
  return current;
}

export async function materializeDecisionDimension({ workspace, path, data, prior = null }) {
  const checked = validateDecisionDimensionLineage({ current: data, prior });
  if (checked.errors.length > 0) {
    const failure = new Error('Decision Dimension 校验失败');
    failure.code = checked.errors[0].code;
    throw failure;
  }
  const body = '# Synthetic Decision Dimension\n';
  await preflightTestKnowledgeWrite({ workspace, data, body, manifest: data.basis });
  return writeCreateOnly(workspace, path, serializeMarkdownObject(data, body), {
    idempotent: true,
    conflictCode: 'DECISION_DIMENSION_CONFLICT',
  });
}
