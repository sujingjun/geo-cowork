import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  sha256,
  stableStringify,
} from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  M6_MERCHANT_ID,
  M6_NOW,
  M6_TEST_SCOPE,
} from './m6-fixtures.mjs';
const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const M7_FIXTURE_ROOT = path.resolve(THIS_DIR, '..', 'fixtures', 'm7-strategy-discovery');
export const M7_STRATEGY_CIS_ID = 'CIS-M7-STRATEGY-001';
export const M7_REVIEW_CIS_ID = 'CIS-M7-REVIEW-001';
export const M7_REVIEW_ID = 'CRV-M7-CYCLE-ONE-DECIDED-001';
export const M7_STA_WAITING_ID = 'STA-M7-WAITING-001';
export const M7_STA_DECIDED_ID = 'STA-M7-DECIDED-001';
export const M7_PRODUCT_GAP_ID = 'FND-M7-PRODUCT-GAP-001';
export const M7_HUMAN_INVOCATION = Object.freeze({
  decision_ref: 'fixture://decision/m7-strategy-invocation-001',
  invoked_by: 'Fixture Strategy Reviewer',
  invoked_at: M6_NOW,
  requested_scope: 'synthetic-pricing-clarity',
});
export const M7_STRATEGY_APPROVAL = Object.freeze({
  approved_by: 'Fixture Strategy Reviewer',
  approved_at: M6_NOW,
  decision_ref: 'fixture://decision/m7-strategy-proceed-001',
});
export const M7_DDM_VALIDATION_DECISION = Object.freeze({
  decided_by: 'Fixture Dimension Reviewer',
  decided_at: M6_NOW,
  decision_ref: 'fixture://decision/m7-ddm-validation-001',
  verdict: 'validated',
  reason: 'Two reviewed synthetic observations support this dimension.',
});
export const M7_DDM_FACTOR_PROMOTED = Object.freeze({
  decided_by: 'Fixture Factor Reviewer',
  decided_at: M6_NOW,
  decision_ref: 'fixture://decision/m7-ddm-factor-promoted-001',
  verdict: 'promoted',
  reason: 'The dimension affects synthetic comparison and exclusion observations.',
});
export const M7_DDM_FACTOR_REJECTED = Object.freeze({
  decided_by: 'Fixture Factor Reviewer',
  decided_at: M6_NOW,
  decision_ref: 'fixture://decision/m7-ddm-factor-rejected-001',
  verdict: 'rejected',
  reason: 'Keep the validated dimension, but do not treat it as a decision factor.',
});
export const M7_DDM_DEPRECATION_DECISION = Object.freeze({
  decided_by: 'Fixture Dimension Owner',
  decided_at: M6_NOW,
  decision_ref: 'fixture://decision/m7-ddm-deprecation-001',
  verdict: 'deprecated',
  reason: 'The promoted factor is explicitly retired for the synthetic scope.',
});
const HASH = Object.freeze({
  goal: '1'.repeat(64),
  queryA: '2'.repeat(64),
  queryB: '3'.repeat(64),
  sampleA: '4'.repeat(64),
  sampleB: '5'.repeat(64),
  reviewA: '6'.repeat(64),
  reviewB: '7'.repeat(64),
  demand: '8'.repeat(64),
  capability: '9'.repeat(64),
  contentGap: 'a'.repeat(64),
  evidenceGap: 'b'.repeat(64),
  productGap: 'c'.repeat(64),
  eligibilityRule: 'd'.repeat(64),
  reviewFingerprint: 'e'.repeat(64),
  reviewFile: 'f'.repeat(64),
});
function common(id, recordType, status, title) {
  return {
    id,
    record_type: recordType,
    status,
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    title,
    test_scope: { ...M6_TEST_SCOPE },
  };
}
export function m7FixturePath(relative) {
  return path.join(M7_FIXTURE_ROOT, ...relative.split('/'));
}

export async function readM7Fixture(relative, encoding = 'utf8') {
  return readFile(m7FixturePath(relative), encoding);
}

export function byteCompare(a, b) {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}
export function productGapIdentity(overrides = {}) {
  return {
    object_id: M7_PRODUCT_GAP_ID,
    record_type: 'finding',
    object_version: '1.0.0',
    file_sha256: HASH.productGap,
    ...overrides,
  };
}
function eligibilityChecks(state = 'pass') {
  return {
    repeated_dimension: {
      state,
      dimension_key: 'pricing-clarity',
      query_entry_keys: [HASH.queryA, HASH.queryB],
      review_entry_keys: [HASH.reviewA, HASH.reviewB],
    },
    user_interest_evidence: { state, evidence_entry_keys: [HASH.demand] },
    comparison_impact: {
      state,
      evidence_entry_keys: [HASH.demand],
      review_entry_keys: [HASH.reviewA, HASH.reviewB],
    },
    content_evidence_fix_insufficient: {
      state,
      finding_entry_keys: [HASH.contentGap, HASH.evidenceGap, HASH.productGap],
    },
  };
}
export function strategyAssessmentData({
  id = M7_STA_WAITING_ID,
  status = 'waiting_human',
  decision = 'pending',
  eligibilityResult = 'eligible',
  checks = eligibilityChecks(),
  approval,
  supersedesRef,
  productGap = productGapIdentity(),
} = {}) {
  return {
    ...common(id, 'strategy_assessment', status, 'Synthetic strategy assessment'),
    merchant_ref: M6_MERCHANT_ID,
    cycle_review_ref: M7_REVIEW_ID,
    cycle_review_version: '1.0.0',
    strategy_input_snapshot_version: { ref: M7_STRATEGY_CIS_ID, version: '1.0.0' },
    human_invocation: { ...M7_HUMAN_INVOCATION },
    eligibility_inputs: {
      review_entry_keys: [HASH.reviewA, HASH.reviewB],
      evidence_entry_keys: [HASH.demand, HASH.capability],
      finding_entry_keys: [HASH.contentGap, HASH.evidenceGap, HASH.productGap],
      product_gap_entry_key: HASH.productGap,
      product_gap_identity: productGap,
    },
    eligibility_checks: checks,
    eligibility_result: eligibilityResult,
    eligibility_rule: {
      id: 'm7-strategy-eligibility-test-v1',
      version: '1.0.0',
      artifact_path: 'outputs/contracts/m7-eligibility-rule.json',
      artifact_entry_key: HASH.eligibilityRule,
      sha256: HASH.eligibilityRule,
    },
    decision,
    ...(approval ? { approval } : {}),
    ...(supersedesRef ? { supersedes_ref: supersedesRef } : {}),
  };
}
function dimensionBasis() {
  return {
    platforms: ['chatgpt', 'claude'],
    query_clusters: ['synthetic-pricing'],
    supporting_observations: ['Two reviewed synthetic answers expose pricing clarity.'],
    counter_observations: ['No real market observation exists.'],
    unresolved_conflicts: [],
  };
}
export function decisionDimensionData({
  id = 'DDM-M7-CANDIDATE-001',
  status = 'candidate',
  supersedesRef,
  validationDecision,
  factorDecision,
  deprecationDecision,
  productGap = productGapIdentity(),
} = {}) {
  return {
    ...common(id, 'decision_dimension', status, 'Synthetic pricing clarity dimension'),
    merchant_ref: M6_MERCHANT_ID,
    strategy_assessment_version: { ref: M7_STA_DECIDED_ID, version: '1.0.0' },
    strategy_input_snapshot_version: { ref: M7_STRATEGY_CIS_ID, version: '1.0.0' },
    label: 'Pricing clarity',
    definition: 'Whether a consumer can determine the applicable synthetic price range.',
    query_entry_keys: [HASH.queryA, HASH.queryB],
    review_entry_keys: [HASH.reviewA, HASH.reviewB],
    evidence_entry_keys: [HASH.demand, HASH.capability],
    finding_entry_keys: [HASH.contentGap, HASH.evidenceGap, HASH.productGap],
    product_gap_entry_key: HASH.productGap,
    product_gap_identity: productGap,
    basis: dimensionBasis(),
    ...(validationDecision ? { validation_decision: validationDecision } : {}),
    ...(factorDecision ? { factor_decision: factorDecision } : {}),
    ...(deprecationDecision ? { deprecation_decision: deprecationDecision } : {}),
    ...(supersedesRef ? { supersedes_ref: supersedesRef } : {}),
  };
}
export function decisionDimensionMatrix() {
  const candidate = decisionDimensionData();
  const validated = decisionDimensionData({
    id: 'DDM-M7-VALIDATED-001',
    status: 'validated',
    supersedesRef: candidate.id,
    validationDecision: { ...M7_DDM_VALIDATION_DECISION },
  });
  const validationRejected = decisionDimensionData({
    id: 'DDM-M7-DEPRECATED-VALIDATION-001',
    status: 'deprecated',
    supersedesRef: candidate.id,
    validationDecision: {
      ...M7_DDM_VALIDATION_DECISION,
      decision_ref: 'fixture://decision/m7-ddm-validation-rejected-001',
      verdict: 'rejected',
      reason: 'Synthetic evidence does not validate the dimension.',
    },
  });
  const factor = decisionDimensionData({
    id: 'DDM-M7-FACTOR-001',
    status: 'decision_factor',
    supersedesRef: validated.id,
    validationDecision: { ...M7_DDM_VALIDATION_DECISION },
    factorDecision: { ...M7_DDM_FACTOR_PROMOTED },
  });
  const factorRejectedValidated = decisionDimensionData({
    id: 'DDM-M7-VALIDATED-REJECTED-001',
    status: 'validated',
    supersedesRef: validated.id,
    validationDecision: { ...M7_DDM_VALIDATION_DECISION },
    factorDecision: { ...M7_DDM_FACTOR_REJECTED },
  });
  const factorRejectedDeprecated = decisionDimensionData({
    id: 'DDM-M7-DEPRECATED-FACTOR-001',
    status: 'deprecated',
    supersedesRef: validated.id,
    validationDecision: { ...M7_DDM_VALIDATION_DECISION },
    factorDecision: {
      ...M7_DDM_FACTOR_REJECTED,
      decision_ref: 'fixture://decision/m7-ddm-factor-rejected-terminal-001',
      reason: 'Reject factor status and terminate this synthetic lineage.',
    },
  });
  const retiredFactor = decisionDimensionData({
    id: 'DDM-M7-DEPRECATED-RETIRED-001',
    status: 'deprecated',
    supersedesRef: factor.id,
    validationDecision: { ...M7_DDM_VALIDATION_DECISION },
    factorDecision: { ...M7_DDM_FACTOR_PROMOTED },
    deprecationDecision: { ...M7_DDM_DEPRECATION_DECISION },
  });
  return {
    candidate,
    validated,
    validationRejected,
    factor,
    factorRejectedValidated,
    factorRejectedDeprecated,
    retiredFactor,
  };
}

export function strategyOutputData(overrides = {}) {
  return {
    ...common('STO-M7-DRAFT-001', 'strategy_output', 'draft', '测试商户战略建议'),
    merchant_ref: M6_MERCHANT_ID,
    strategy_assessment_version: { ref: M7_STA_DECIDED_ID, version: '1.0.0' },
    strategy_input_snapshot_version: { ref: M7_STRATEGY_CIS_ID, version: '1.0.0' },
    run_ref: 'RUN-M7-STRATEGY-001',
    decision_dimension_versions: [{ ref: 'DDM-M7-FACTOR-001', version: '1.0.0' }],
    product_gap_entry_key: HASH.productGap,
    product_gap_identity: productGapIdentity(),
    opportunity: {
      statement: 'Evaluate synthetic pricing clarity without claiming a real opportunity.',
      supporting_evidence_entry_keys: [HASH.demand, HASH.capability],
      counter_evidence_entry_keys: [],
      limitations: ['Synthetic fixture only.'],
    },
    artifacts: [
      ['opportunity_analysis', 'outputs/opportunity-analysis.md', '1'],
      ['prd_draft', 'outputs/prd-draft.md', '2'],
      ['human_validation_plan', 'outputs/human-validation-plan.md', '3'],
    ].map(([role, artifactPath, character]) => ({
      role, path: artifactPath, sha256: character.repeat(64), media_type: 'text/markdown',
    })),
    validation_plan_contract: {
      hypothesis: 'Pricing clarity is a synthetic decision factor.',
      required_evidence: ['Two independent user-interest observations.'],
      method: 'Fixture-only human review.',
      result_criteria: {
        success: 'Evidence supports the factor.',
        fail: 'Evidence rejects the factor.',
        inconclusive: 'Evidence remains insufficient.',
      },
      owner: 'Fixture Product Reviewer',
      stop_conditions: ['Any real data or external write is requested.'],
      real_execution_authorized: false,
      auto_approval: false,
    },
    body_sha256: '4'.repeat(64),
    artifact_manifest_fingerprint: '5'.repeat(64),
    ...overrides,
  };
}

export function candidateDescriptor({
  candidateKind = 'product_gap',
  priority = 0,
  productGap = productGapIdentity(),
} = {}) {
  const strategyGateVersions = candidateKind === 'product_gap' ? {
    strategy_input_snapshot_version: { ref: M7_STRATEGY_CIS_ID, version: '1.0.0' },
    review_product_gap_entry_key: HASH.productGap,
    strategy_product_gap_entry_key: HASH.productGap,
    product_gap_identity: productGap,
    strategy_assessment_version: { ref: M7_STA_DECIDED_ID, version: '1.0.0' },
    decision_dimension_versions: [{ ref: 'DDM-M7-FACTOR-001', version: '1.0.0' }],
    strategy_output_version: { ref: 'STO-M7-DRAFT-001', version: '1.0.0' },
  } : undefined;
  return {
    candidate_kind: candidateKind,
    source_goal_entry_key: HASH.goal,
    source_entry_keys: candidateKind === 'product_gap'
      ? [HASH.productGap]
      : [HASH.reviewA, HASH.queryA].sort(byteCompare),
    proposed_goal: {
      statement: `Improve synthetic ${candidateKind.replaceAll('_', ' ')}.`,
      success_question: `Is synthetic ${candidateKind.replaceAll('_', ' ')} improved?`,
      query_cluster_key: `m7-${candidateKind.replaceAll('_', '-')}`,
    },
    rationale: `Cycle 1 review recorded a synthetic ${candidateKind}.`,
    limitations: ['Synthetic fixture only.'],
    evidence_gaps: [],
    risks: ['Do not infer a real product decision.'],
    priority,
    ...(strategyGateVersions ? { strategy_gate_versions: strategyGateVersions } : {}),
  };
}

export function candidateKeys({ descriptor, batchKey }) {
  const kindOrder = {
    query_cluster: 1,
    content_gap: 2,
    evidence_gap: 3,
    severe_misperception: 4,
    recommendation_reason: 5,
    product_gap: 6,
  }[descriptor.candidate_kind];
  const candidateContentKey = sha256(stableStringify({
    candidate_kind: descriptor.candidate_kind,
    review_input_snapshot_version: { ref: M7_REVIEW_CIS_ID, version: '1.0.0' },
    source_goal_entry_key: descriptor.source_goal_entry_key,
    source_entry_keys: [...descriptor.source_entry_keys].sort(byteCompare),
    proposed_goal: descriptor.proposed_goal,
    rationale: descriptor.rationale,
    limitations: descriptor.limitations,
    evidence_gaps: descriptor.evidence_gaps,
    risks: descriptor.risks,
    strategy_gate_versions: descriptor.strategy_gate_versions ?? null,
  }));
  const rankInputs = {
    priority: descriptor.priority,
    kind_order: kindOrder,
    tie_break_key: candidateContentKey,
  };
  const rank = 1;
  const candidateInstanceKey = batchKey
    ? sha256(stableStringify({
      batch_key: batchKey,
      candidate_content_key: candidateContentKey,
      rank_inputs: rankInputs,
      rank,
    }))
    : null;
  return { candidateContentKey, rankInputs, rank, candidateInstanceKey };
}

export function candidateBatchData({ descriptors = [candidateDescriptor()] } = {}) {
  const ranked = descriptors.map((descriptor) => ({ descriptor, ...candidateKeys({ descriptor }) }))
    .sort((a, b) => a.rankInputs.priority - b.rankInputs.priority
      || a.rankInputs.kind_order - b.rankInputs.kind_order
      || byteCompare(a.candidateContentKey, b.candidateContentKey))
    .map((item, index) => ({ ...item, rank: index + 1 }));
  const generatorRule = {
    id: 'm7-cycle-goal-candidate-test-v1',
    version: '1.0.0',
    artifact_path: 'outputs/contracts/m7-candidate-generator-rule.json',
    sha256: '6'.repeat(64),
  };
  const batchKey = sha256(stableStringify({
    review_ref: M7_REVIEW_ID,
    review_version: '1.0.0',
    review_file_sha256: HASH.reviewFile,
    review_input_snapshot_version: { ref: M7_REVIEW_CIS_ID, version: '1.0.0' },
    review_snapshot_fingerprint: HASH.reviewFingerprint,
    generator_rule: generatorRule,
    ordered_ranked_descriptors: ranked.map((item) => ({
      candidate_content_key: item.candidateContentKey,
      rank_inputs: item.rankInputs,
      rank: item.rank,
    })),
  }));
  const candidates = ranked.map((item) => {
    const instance = sha256(stableStringify({
      batch_key: batchKey,
      candidate_content_key: item.candidateContentKey,
      rank_inputs: item.rankInputs,
      rank: item.rank,
    }));
    return {
      ...common(`GCD-${instance.slice(0, 24).toUpperCase()}`, 'cycle_goal_candidate', 'candidate', 'Synthetic cycle goal candidate'),
      merchant_ref: M6_MERCHANT_ID,
      candidate_batch_version: { ref: `GCB-${batchKey.slice(0, 24).toUpperCase()}`, version: '1.0.0' },
      source_cycle_review_version: { ref: M7_REVIEW_ID, version: '1.0.0', file_sha256: HASH.reviewFile },
      review_input_snapshot_version: {
        ref: M7_REVIEW_CIS_ID, version: '1.0.0', fingerprint: HASH.reviewFingerprint,
      },
      candidate_content_key: item.candidateContentKey,
      candidate_instance_key: instance,
      candidate_kind: item.descriptor.candidate_kind,
      source_goal_entry_key: item.descriptor.source_goal_entry_key,
      source_entry_keys: [...item.descriptor.source_entry_keys].sort(byteCompare),
      proposed_goal: item.descriptor.proposed_goal,
      rationale: item.descriptor.rationale,
      limitations: item.descriptor.limitations,
      evidence_gaps: item.descriptor.evidence_gaps,
      risks: item.descriptor.risks,
      rank_inputs: item.rankInputs,
      rank: item.rank,
      ...(item.descriptor.strategy_gate_versions
        ? { strategy_gate_versions: item.descriptor.strategy_gate_versions }
        : {}),
    };
  });
  const batch = {
    ...common(`GCB-${batchKey.slice(0, 24).toUpperCase()}`, 'cycle_goal_candidate_batch', 'recorded', 'Synthetic candidate batch'),
    merchant_ref: M6_MERCHANT_ID,
    source_cycle_review_version: { ref: M7_REVIEW_ID, version: '1.0.0', file_sha256: HASH.reviewFile },
    review_input_snapshot_version: {
      ref: M7_REVIEW_CIS_ID, version: '1.0.0', fingerprint: HASH.reviewFingerprint,
    },
    generator_rule: generatorRule,
    batch_key: batchKey,
    ordered_candidates: candidates.map((candidate) => ({
      candidate_content_key: candidate.candidate_content_key,
      rank_inputs: candidate.rank_inputs,
      rank: candidate.rank,
      candidate_instance_key: candidate.candidate_instance_key,
      candidate_version: { ref: candidate.id, version: candidate.version },
    })),
    run_ref: 'RUN-M7-CANDIDATES-001',
  };
  return { batch, candidates };
}

export function cycleGoalSelectionData() {
  const { batch, candidates } = candidateBatchData();
  const decisionKey = sha256(stableStringify({
    batch_key: batch.batch_key,
    phase: 'draft',
    selected: null,
    rejected: [],
    deferred: [],
    reason: null,
    approval: null,
  }));
  return {
    ...common(`GSEL-${decisionKey.slice(0, 24).toUpperCase()}`, 'cycle_goal_selection', 'draft', 'Synthetic goal selection'),
    merchant_ref: M6_MERCHANT_ID,
    source_cycle_review_version: batch.source_cycle_review_version,
    candidate_batch_version: { ref: batch.id, version: batch.version },
    batch_key: batch.batch_key,
    decision_key: decisionKey,
    candidate_versions: candidates.map(({ id, version }) => ({ ref: id, version })),
    decision: {
      selected_candidate_version: null,
      rejected_candidate_versions: [],
      deferred_candidate_versions: [],
      reason: null,
    },
  };
}

export function m7SchemaSamples() {
  const matrix = decisionDimensionMatrix();
  const { batch, candidates } = candidateBatchData();
  return {
    strategy_assessment: strategyAssessmentData(),
    decision_dimension: matrix.candidate,
    cycle_goal_candidate_batch: batch,
    cycle_goal_candidate: candidates[0],
    cycle_goal_selection: cycleGoalSelectionData(),
    strategy_output: strategyOutputData(),
  };
}
