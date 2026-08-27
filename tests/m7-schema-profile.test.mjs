import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateObjectData,
} from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  M7_DDM_FACTOR_PROMOTED,
  M7_DDM_VALIDATION_DECISION,
  decisionDimensionData,
  decisionDimensionMatrix,
  m7SchemaSamples,
  strategyAssessmentData,
} from './helpers/m7-fixtures.mjs';

const samples = m7SchemaSamples();

for (const recordType of [
  'strategy_assessment',
  'decision_dimension',
  'cycle_goal_candidate_batch',
  'cycle_goal_candidate',
  'cycle_goal_selection',
  'strategy_output',
]) {
  test(`M7 注册 ${recordType} 且保留 unknown-field fail closed`, () => {
    assert.equal(validateObjectData(samples[recordType]).record_type, recordType);
    assert.throws(
      () => validateObjectData({ ...samples[recordType], unexpected_m7_field: true }),
      (error) => error.code === 'INVALID_FRONTMATTER',
    );
  });
}

test('六类 M7 对象均要求顶层 synthetic test_scope', () => {
  for (const sample of Object.values(samples)) {
    validateObjectData(sample);
    const { test_scope: omitted, ...withoutScope } = sample;
    assert.ok(omitted);
    assert.throws(
      () => validateObjectData(withoutScope),
      (error) => error.code === 'INVALID_FRONTMATTER',
    );
  }
});

test('STA decided/proceed 必须是 eligible 四项 pass、新 ID lineage 与人工 approval', async () => {
  const { validateStrategyObject } = await import(
    '../plugins/geo-expert/scripts/lib/strategy-profile.mjs'
  );
  const waiting = strategyAssessmentData();
  const decided = strategyAssessmentData({
    id: 'STA-M7-DECIDED-001',
    status: 'decided',
    decision: 'proceed',
    approval: {
      approved_by: 'Fixture Strategy Reviewer',
      approved_at: waiting.updated_at,
      decision_ref: 'fixture://decision/m7-strategy-proceed-001',
    },
    supersedesRef: waiting.id,
  });
  assert.deepEqual(validateStrategyObject(decided, { prior: waiting }).errors, []);
  for (const invalid of [
    { ...decided, id: waiting.id },
    { ...decided, approval: undefined },
    { ...decided, supersedes_ref: 'STA-M7-OTHER-001' },
    { ...decided, eligibility_result: 'insufficient' },
    {
      ...decided,
      eligibility_checks: {
        ...decided.eligibility_checks,
        repeated_dimension: {
          ...decided.eligibility_checks.repeated_dimension,
          state: 'insufficient',
        },
      },
    },
  ]) {
    assert.notDeepEqual(validateStrategyObject(invalid, { prior: waiting }).errors, []);
  }
});

test('DDM Schema/profile 精确覆盖四态 decision 矩阵，表外组合失败', async () => {
  const { validateDecisionDimensionLineage } = await import(
    '../plugins/geo-expert/scripts/lib/decision-dimension.mjs'
  );
  const matrix = decisionDimensionMatrix();
  const validEdges = [
    [matrix.candidate, null],
    [matrix.validated, matrix.candidate],
    [matrix.validationRejected, matrix.candidate],
    [matrix.factor, matrix.validated],
    [matrix.factorRejectedValidated, matrix.validated],
    [matrix.factorRejectedDeprecated, matrix.validated],
    [matrix.retiredFactor, matrix.factor],
  ];
  for (const [current, prior] of validEdges) {
    assert.equal(validateObjectData(current).record_type, 'decision_dimension');
    assert.deepEqual(validateDecisionDimensionLineage({ current, prior }).errors, []);
  }

  const invalid = decisionDimensionData({
    id: 'DDM-M7-INVALID-001',
    status: 'decision_factor',
    supersedesRef: matrix.candidate.id,
    validationDecision: { ...M7_DDM_VALIDATION_DECISION },
    factorDecision: { ...M7_DDM_FACTOR_PROMOTED },
  });
  assert.notDeepEqual(
    validateDecisionDimensionLineage({ current: invalid, prior: matrix.candidate }).errors,
    [],
  );
});
