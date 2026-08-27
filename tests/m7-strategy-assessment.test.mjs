import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  M7_HUMAN_INVOCATION,
  productGapIdentity,
  strategyAssessmentData,
} from './helpers/m7-fixtures.mjs';

const key = (character) => character.repeat(64);

function strategySnapshot({
  productGapId = 'FND-M7-PRODUCT-GAP-001',
  productGapSha = key('c'),
  productGapStatus = 'open',
  productGapApproval = true,
  demandStatus = 'approved',
  demandScope = 'synthetic-pricing-clarity',
  dimensionCandidates = ['Pricing clarity'],
  secondPlatform = 'claude',
  secondQueryRef = 'Q-M7-QUERY-002',
} = {}) {
  const entries = new Map();
  const add = (entryKey, data, fileSha = entryKey) => entries.set(entryKey, {
    entry_key: entryKey,
    file_sha256: fileSha,
    data,
  });
  add(key('2'), {
    id: 'Q-M7-QUERY-001', record_type: 'query', status: 'formal', version: '1.0.0',
  });
  add(key('3'), {
    id: 'Q-M7-QUERY-002', record_type: 'query', status: 'formal', version: '1.0.0',
  });
  add(key('4'), {
    id: 'SMP-M7-CHATGPT-001', record_type: 'answer_sample', status: 'recorded',
    version: '1.0.0', platform: 'chatgpt', query_ref: 'Q-M7-QUERY-001',
  });
  add(key('5'), {
    id: 'SMP-M7-SECOND-001', record_type: 'answer_sample', status: 'recorded',
    version: '1.0.0', platform: secondPlatform, query_ref: secondQueryRef,
  });
  add(key('6'), {
    id: 'ARV-M7-CHATGPT-001', record_type: 'answer_review', status: 'reviewed',
    version: '1.0.0', sample_ref: 'SMP-M7-CHATGPT-001',
    exploratory: { decision_dimension_candidates: dimensionCandidates },
  });
  add(key('7'), {
    id: 'ARV-M7-SECOND-001', record_type: 'answer_review', status: 'reviewed',
    version: '1.0.0', sample_ref: 'SMP-M7-SECOND-001',
    exploratory: { decision_dimension_candidates: dimensionCandidates },
  });
  add(key('8'), {
    id: 'EVD-M7-DEMAND-001', record_type: 'evidence', status: demandStatus,
    version: '1.0.0', support_kind: 'user', scope: demandScope,
    captured_at: '2026-08-26T00:00:00Z', approval: { decision_ref: 'fixture://demand' },
  });
  add(key('9'), {
    id: 'EVD-M7-CAPABILITY-001', record_type: 'evidence', status: 'approved',
    version: '1.0.0', support_kind: 'first_party', scope: demandScope,
    captured_at: '2026-08-26T00:00:00Z', approval: { decision_ref: 'fixture://capability' },
  });
  add(key('a'), {
    id: 'FND-M7-CONTENT-GAP-001', record_type: 'finding', status: 'open',
    version: '1.0.0', diagnosis_class: 'content_gap', approval: { decision_ref: 'fixture://content-gap' },
    query_refs: ['Q-M7-QUERY-001'], claim_refs: ['CLM-M7-CLAIM-001'], asset_refs: ['AST-M7-ASSET-001'],
  });
  add(key('b'), {
    id: 'FND-M7-EVIDENCE-GAP-001', record_type: 'finding', status: 'open',
    version: '1.0.0', diagnosis_class: 'evidence_gap', approval: { decision_ref: 'fixture://evidence-gap' },
    query_refs: ['Q-M7-QUERY-001'], claim_refs: ['CLM-M7-CLAIM-001'], asset_refs: ['AST-M7-ASSET-001'],
  });
  add(key('c'), {
    id: productGapId, record_type: 'finding', status: productGapStatus, version: '1.0.0',
    diagnosis_class: 'product_gap',
    query_refs: ['Q-M7-QUERY-001'], claim_refs: ['CLM-M7-CLAIM-001'], asset_refs: ['AST-M7-ASSET-001'],
    evidence_refs: ['EVD-M7-DEMAND-001', 'EVD-M7-CAPABILITY-001'],
    gap_basis: {
      supporting_evidence_refs: ['EVD-M7-DEMAND-001', 'EVD-M7-CAPABILITY-001'],
      counter_evidence_refs: [], unresolved_conflicts: [], rationale: 'Synthetic Product Gap.',
    },
    ...(productGapApproval ? { approval: { decision_ref: 'fixture://product-gap' } } : {}),
  }, productGapSha);
  return {
    snapshot_id: 'CIS-M7-STRATEGY-001',
    snapshot_kind: 'strategy',
    entries,
    artifact_entries: new Map([[key('d'), {
      entry_key: key('d'), role: 'other_contract',
      bytes: Buffer.from('{"id":"m7-strategy-eligibility-test-v1","version":"1.0.0"}\n'),
    }]]),
  };
}

function assessmentInput(overrides = {}) {
  return {
    human_invocation: { ...M7_HUMAN_INVOCATION },
    review_entry_keys: [key('6'), key('7')],
    evidence_entry_keys: [key('8'), key('9')],
    finding_entry_keys: [key('a'), key('b'), key('c')],
    product_gap_entry_key: key('c'),
    product_gap_identity: productGapIdentity(),
    eligibility_rule_entry_key: key('d'),
    ...overrides,
  };
}

test('Gate 0 缺 human invocation 时不创建 Strategy Run/STA', async () => {
  const { assessStrategyEligibility } = await import(
    '../plugins/geo-expert/scripts/lib/strategy-assessment.mjs'
  );
  await assert.rejects(
    assessStrategyEligibility({ snapshot: strategySnapshot(), input: assessmentInput({ human_invocation: undefined }) }),
    (error) => error.code === 'STRATEGY_HUMAN_TRIGGER_REQUIRED'
      && error.created_paths?.length === 0,
  );
});

test('eligibility 只从 pinned CIS 计算，拒绝调用方自报 pass', async () => {
  const { assessStrategyEligibility } = await import(
    '../plugins/geo-expert/scripts/lib/strategy-assessment.mjs'
  );
  await assert.rejects(
    assessStrategyEligibility({
      snapshot: strategySnapshot({ dimensionCandidates: [] }),
      input: assessmentInput({ eligibility_checks: strategyAssessmentData().eligibility_checks }),
    }),
    (error) => error.code === 'STRATEGY_ELIGIBILITY_SELF_REPORT_FORBIDDEN',
  );
  const result = await assessStrategyEligibility({
    snapshot: strategySnapshot(),
    input: assessmentInput(),
  });
  assert.equal(result.eligibility_result, 'eligible');
  assert.deepEqual(
    Object.values(result.eligibility_checks).map((item) => item.state),
    ['pass', 'pass', 'pass', 'pass'],
  );
});

test('两条 formal Query/两个可追溯平台与 approved/non-stale 同 Scope Evidence 是硬门', async () => {
  const { assessStrategyEligibility } = await import(
    '../plugins/geo-expert/scripts/lib/strategy-assessment.mjs'
  );
  for (const snapshot of [
    strategySnapshot({ dimensionCandidates: [] }),
    strategySnapshot({ secondPlatform: 'chatgpt', secondQueryRef: 'Q-M7-QUERY-001' }),
    strategySnapshot({ demandStatus: 'candidate' }),
    strategySnapshot({ demandStatus: 'stale' }),
    strategySnapshot({ demandScope: 'another-scope' }),
  ]) {
    const result = await assessStrategyEligibility({ snapshot, input: assessmentInput() });
    assert.notEqual(result.eligibility_result, 'eligible');
  }
});

test('只消费 M4 open+approval Product Gap，并锁定同一 identity tuple', async () => {
  const { validateStrategyProductGap } = await import(
    '../plugins/geo-expert/scripts/lib/strategy-assessment.mjs'
  );
  assert.deepEqual(validateStrategyProductGap({
    snapshot: strategySnapshot(),
    entryKey: key('c'),
    identity: productGapIdentity(),
  }).errors, []);
  for (const fixture of [
    { snapshot: strategySnapshot({ productGapStatus: 'waiting_human' }), identity: productGapIdentity() },
    { snapshot: strategySnapshot({ productGapApproval: false }), identity: productGapIdentity() },
    {
      snapshot: strategySnapshot({ productGapId: 'FND-M7-PRODUCT-GAP-B' }),
      identity: productGapIdentity(),
    },
    {
      snapshot: strategySnapshot({ productGapSha: key('f') }),
      identity: productGapIdentity(),
    },
  ]) {
    assert.notDeepEqual(validateStrategyProductGap({
      snapshot: fixture.snapshot,
      entryKey: key('c'),
      identity: fixture.identity,
    }).errors, []);
  }
});
