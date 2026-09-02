import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  byteCompare,
  candidateBatchData,
  candidateDescriptor,
  productGapIdentity,
} from './helpers/m7-fixtures.mjs';

const candidateContext = {
  merchant_ref: 'MER-MYYSHOP-001',
  test_scope: {
    kind: 'synthetic', usage: 'test_only',
    merchant_ref: 'MER-MYYSHOP-001', workspace_id: 'ws_myyshopdevtest000000000000',
  },
  created_at: '2026-08-27T00:00:00Z',
  run_ref: 'RUN-M7-CANDIDATES-001',
  review_ref: 'CRV-M7-CYCLE-ONE-DECIDED-001',
  review_version: '1.0.0',
  review_file_sha256: 'f'.repeat(64),
  review_input_snapshot_version: { ref: 'CIS-M7-REVIEW-001', version: '1.0.0' },
  review_snapshot_fingerprint: 'e'.repeat(64),
  generator_rule: {
    id: 'm7-cycle-goal-candidate-test-v1',
    version: '1.0.0',
    artifact_path: 'outputs/contracts/m7-candidate-generator-rule.json',
    sha256: '6'.repeat(64),
  },
};

test('GCB/GCD key、ID 与排序完全由 frozen Review/CIS/rule/descriptor 决定', async () => {
  const {
    buildCandidateBatchPlan,
  } = await import('../plugins/geo-expert/scripts/lib/cycle-goal-candidates.mjs');
  const descriptors = [
    candidateDescriptor({ candidateKind: 'product_gap', priority: 1 }),
    candidateDescriptor({ candidateKind: 'query_cluster', priority: 0 }),
    candidateDescriptor({ candidateKind: 'content_gap', priority: 0 }),
  ];
  const actual = buildCandidateBatchPlan({ context: candidateContext, descriptors });
  const expected = candidateBatchData({ descriptors });
  assert.equal(actual.batch.batch_key, expected.batch.batch_key);
  assert.equal(actual.batch.id, expected.batch.id);
  assert.deepEqual(
    actual.candidates.map(({ id }) => id),
    expected.candidates.map(({ id }) => id),
  );
  assert.deepEqual(
    actual.candidates.map(({ rank_inputs }) => rank_inputs),
    expected.candidates.map(({ rank_inputs }) => rank_inputs),
  );
});

test('相同输入重复生成同 bytes；priority/kind/content/risk/gate 漂移生成新 batch', async () => {
  const { buildCandidateBatchPlan } = await import(
    '../plugins/geo-expert/scripts/lib/cycle-goal-candidates.mjs'
  );
  const descriptor = candidateDescriptor();
  const first = buildCandidateBatchPlan({ context: candidateContext, descriptors: [descriptor] });
  const repeated = buildCandidateBatchPlan({ context: candidateContext, descriptors: [descriptor] });
  assert.deepEqual(repeated, first);
  for (const changed of [
    { ...descriptor, priority: 2 },
    candidateDescriptor({ candidateKind: 'recommendation_reason' }),
    { ...descriptor, risks: [...descriptor.risks, 'A changed synthetic risk.'] },
    {
      ...descriptor,
      strategy_gate_versions: {
        ...descriptor.strategy_gate_versions,
        product_gap_identity: productGapIdentity({ file_sha256: 'f'.repeat(64) }),
      },
    },
  ]) {
    const next = buildCandidateBatchPlan({ context: candidateContext, descriptors: [changed] });
    assert.notEqual(next.batch.batch_key, first.batch.batch_key);
  }
});

test('ASCII/UTF-8 byte tie-break 不使用 localeCompare', async () => {
  const { sortRankedCandidateDescriptors } = await import(
    '../plugins/geo-expert/scripts/lib/cycle-goal-candidates.mjs'
  );
  const ranked = [
    { candidate_content_key: 'f0', rank_inputs: { priority: 0, kind_order: 1, tie_break_key: 'f0' } },
    { candidate_content_key: '0f', rank_inputs: { priority: 0, kind_order: 1, tie_break_key: '0f' } },
    { candidate_content_key: '10', rank_inputs: { priority: 0, kind_order: 1, tie_break_key: '10' } },
  ];
  const expected = [...ranked].sort((a, b) => byteCompare(
    a.candidate_content_key,
    b.candidate_content_key,
  ));
  assert.deepEqual(sortRankedCandidateDescriptors(ranked), expected);
});

test('GCB/GCD 先预分配完整双向闭包，FND-A/B 换绑与 strategy gate 缺失失败', async () => {
  const {
    validateCandidateBatchClosure,
    validateProductGapCandidate,
  } = await import('../plugins/geo-expert/scripts/lib/cycle-goal-candidates.mjs');
  const { batch, candidates } = candidateBatchData();
  assert.deepEqual(validateCandidateBatchClosure({ batch, candidates }).errors, []);
  const candidate = candidates[0];
  const validGates = {
    assessment: {
      id: 'STA-M7-DECIDED-001', status: 'decided', decision: 'proceed',
      product_gap_identity: productGapIdentity(),
    },
    dimensions: [{
      id: 'DDM-M7-FACTOR-001', status: 'decision_factor',
      factor_decision: { verdict: 'promoted' }, product_gap_identity: productGapIdentity(),
    }],
    output: {
      id: 'STO-M7-DRAFT-001', status: 'draft', product_gap_identity: productGapIdentity(),
    },
    reviewProductGapIdentity: productGapIdentity(),
    strategyProductGapIdentity: productGapIdentity(),
  };
  assert.deepEqual(validateProductGapCandidate({ candidate, gates: validGates }).errors, []);
  for (const gates of [
    { ...validGates, assessment: { ...validGates.assessment, decision: 'do_not_proceed' } },
    { ...validGates, dimensions: [{ ...validGates.dimensions[0], status: 'validated' }] },
    { ...validGates, output: null },
    {
      ...validGates,
      strategyProductGapIdentity: productGapIdentity({ object_id: 'FND-M7-PRODUCT-GAP-B' }),
    },
    {
      ...validGates,
      strategyProductGapIdentity: productGapIdentity({ file_sha256: '0'.repeat(64) }),
    },
  ]) {
    assert.notDeepEqual(validateProductGapCandidate({ candidate, gates }).errors, []);
  }
});

test('普通 Cycle 2 候选不要求 strategy gates，Product Gap 候选恰好需要一条 Gap', async () => {
  const { validateProductGapCandidate } = await import(
    '../plugins/geo-expert/scripts/lib/cycle-goal-candidates.mjs'
  );
  const ordinary = candidateBatchData({
    descriptors: [candidateDescriptor({ candidateKind: 'query_cluster' })],
  }).candidates[0];
  assert.deepEqual(validateProductGapCandidate({ candidate: ordinary, gates: null }).errors, []);
  const product = candidateBatchData().candidates[0];
  assert.notDeepEqual(validateProductGapCandidate({ candidate: product, gates: null }).errors, []);
  assert.equal(product.source_entry_keys.filter((entry) =>
    entry === product.strategy_gate_versions.review_product_gap_entry_key).length, 1);
});
