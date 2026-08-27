import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  M7_DDM_DEPRECATION_DECISION,
  M7_DDM_FACTOR_PROMOTED,
  M7_DDM_FACTOR_REJECTED,
  M7_DDM_VALIDATION_DECISION,
  decisionDimensionData,
  decisionDimensionMatrix,
} from './helpers/m7-fixtures.mjs';

test('DDM 四态七个可达组合逐一闭合，旧 bytes 不改写', async () => {
  const { validateDecisionDimensionLineage } = await import(
    '../plugins/geo-expert/scripts/lib/decision-dimension.mjs'
  );
  const matrix = decisionDimensionMatrix();
  const candidateBytes = JSON.stringify(matrix.candidate);
  const edges = [
    [matrix.candidate, null],
    [matrix.validated, matrix.candidate],
    [matrix.validationRejected, matrix.candidate],
    [matrix.factor, matrix.validated],
    [matrix.factorRejectedValidated, matrix.validated],
    [matrix.factorRejectedDeprecated, matrix.validated],
    [matrix.retiredFactor, matrix.factor],
  ];
  for (const [current, prior] of edges) {
    assert.deepEqual(validateDecisionDimensionLineage({ current, prior }).errors, []);
  }
  assert.equal(JSON.stringify(matrix.candidate), candidateBytes);
  assert.equal(matrix.candidate.status, 'candidate');
});
test('每次推进必须新 ID、supersedes 直接前态，禁止回 candidate/跳态/terminal 继续', async () => {
  const { validateDecisionDimensionLineage } = await import(
    '../plugins/geo-expert/scripts/lib/decision-dimension.mjs'
  );
  const matrix = decisionDimensionMatrix();
  const invalidEdges = [
    [decisionDimensionData({
      id: matrix.candidate.id,
      status: 'validated',
      supersedesRef: matrix.candidate.id,
      validationDecision: M7_DDM_VALIDATION_DECISION,
    }), matrix.candidate],
    [decisionDimensionData({
      id: 'DDM-M7-CANDIDATE-RETURN-001', status: 'candidate', supersedesRef: matrix.validated.id,
    }), matrix.validated],
    [matrix.factor, matrix.candidate],
    [decisionDimensionData({
      id: 'DDM-M7-AFTER-TERMINAL-001', status: 'validated',
      supersedesRef: matrix.validationRejected.id,
      validationDecision: M7_DDM_VALIDATION_DECISION,
    }), matrix.validationRejected],
  ];
  for (const [current, prior] of invalidEdges) {
    assert.notDeepEqual(validateDecisionDimensionLineage({ current, prior }).errors, []);
  }
});

test('validation/factor/deprecation decision 块按来源精确出现且 decision_ref 不复用', async () => {
  const { validateDecisionDimensionLineage } = await import(
    '../plugins/geo-expert/scripts/lib/decision-dimension.mjs'
  );
  const matrix = decisionDimensionMatrix();
  const invalid = [
    decisionDimensionData({
      id: 'DDM-M7-INVALID-CANDIDATE-001', status: 'candidate',
      validationDecision: M7_DDM_VALIDATION_DECISION,
    }),
    decisionDimensionData({
      id: 'DDM-M7-INVALID-FACTOR-001', status: 'decision_factor',
      supersedesRef: matrix.validated.id,
      validationDecision: M7_DDM_VALIDATION_DECISION,
      factorDecision: {
        ...M7_DDM_FACTOR_PROMOTED,
        decision_ref: M7_DDM_VALIDATION_DECISION.decision_ref,
      },
    }),
    decisionDimensionData({
      id: 'DDM-M7-INVALID-RETIRED-001', status: 'deprecated',
      supersedesRef: matrix.factor.id,
      validationDecision: M7_DDM_VALIDATION_DECISION,
      factorDecision: M7_DDM_FACTOR_PROMOTED,
    }),
    decisionDimensionData({
      id: 'DDM-M7-INVALID-DEPRECATION-REF-001', status: 'deprecated',
      supersedesRef: matrix.factor.id,
      validationDecision: M7_DDM_VALIDATION_DECISION,
      factorDecision: M7_DDM_FACTOR_PROMOTED,
      deprecationDecision: {
        ...M7_DDM_DEPRECATION_DECISION,
        decision_ref: M7_DDM_FACTOR_PROMOTED.decision_ref,
      },
    }),
  ];
  for (const current of invalid) {
    const prior = current.status === 'candidate' ? null
      : current.supersedes_ref === matrix.factor.id ? matrix.factor : matrix.validated;
    assert.notDeepEqual(validateDecisionDimensionLineage({ current, prior }).errors, []);
  }
});

test('factor rejected 可显式保留 validated 或进入 deprecated，但不能伪装 promoted', async () => {
  const { validateDecisionDimensionLineage } = await import(
    '../plugins/geo-expert/scripts/lib/decision-dimension.mjs'
  );
  const matrix = decisionDimensionMatrix();
  assert.deepEqual(validateDecisionDimensionLineage({
    current: matrix.factorRejectedValidated,
    prior: matrix.validated,
  }).errors, []);
  assert.deepEqual(validateDecisionDimensionLineage({
    current: matrix.factorRejectedDeprecated,
    prior: matrix.validated,
  }).errors, []);
  const invalid = {
    ...matrix.factorRejectedValidated,
    factor_decision: { ...M7_DDM_FACTOR_REJECTED, verdict: 'promoted' },
  };
  assert.notDeepEqual(validateDecisionDimensionLineage({
    current: invalid,
    prior: matrix.validated,
  }).errors, []);
});
