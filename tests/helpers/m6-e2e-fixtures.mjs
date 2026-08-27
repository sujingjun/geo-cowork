import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { sampleSlotKey } from '../../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { serializeMarkdownObject } from '../../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { inputFingerprint } from '../../plugins/geo-expert/scripts/lib/run-store.mjs';
import {
  sha256,
  stableStringify,
  writeCreateOnly,
} from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  M6_APPROVAL,
  M6_NOW,
  M6_TEST_SCOPE,
} from './m6-fixtures.mjs';

const PROFILE_REF = 'CPF-M6-TEST-001';
const PROFILE_VERSION = '1.0.0';
const QUERY_REF = 'Q-M6-TEST-001';
const QUERY_SET_REF = 'QS-M6-TEST-001';
const CLAIM_REF = 'CLM-M6-TEST-001';
const GOAL_REF = 'GOAL-M6-TEST-001';
const RELEASE_REF = 'KR-M6-TEST-001';
const ASSET_REF = 'AST-M6-TEST-001';

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

async function writeObject(root, relative, data, body = '# Synthetic E2E gate\n') {
  const bytes = serializeMarkdownObject(data, body);
  const result = await writeCreateOnly(root, relative, bytes, {
    idempotent: true,
    conflictCode: 'OBJECT_CONFLICT',
  });
  return {
    id: data.id,
    record_type: data.record_type,
    status: data.status,
    version: data.version,
    path: relative,
    sha256: sha256(bytes),
    action: result.action,
  };
}

async function writeRaw(root, runId, relative, bytes) {
  await writeCreateOnly(root, `runs/${runId}/${relative}`, bytes, {
    idempotent: true,
    conflictCode: 'RAW_ARTIFACT_CONFLICT',
  });
  return { path: relative, sha256: sha256(bytes), media_type: 'text/plain' };
}

function reviewData(id, sample, rubricSha) {
  return {
    ...common(id, 'answer_review', 'reviewed', `Synthetic review ${id}`),
    sample_ref: sample.id,
    sample_raw_manifest_sha256: sample.raw_manifest_sha256,
    rubric: { version: '1.0.0', sha256: rubricSha },
    claim_support_review_refs: [],
    core: {
      entity_recognition: 'pass',
      core_fact_accuracy: 'pass',
      current_positioning: 'partial',
      risk_boundary: 'pass',
      citation_quality: 'partial',
    },
    exploratory: {
      comparison_dimensions: [], recommendation_reasons: [], exclusion_reasons: [],
      competitor_mentions: [], source_structure_notes: [], decision_dimension_candidates: [],
    },
    reviewer: { kind: 'geo_expert', identifier: 'm6-e2e-fixture-reviewer' },
    review_required: false,
  };
}

async function materializeAnswerGate(root, {
  purpose,
  prefix,
  runId,
  aggregationId,
  publicationRefs = [],
  technicalRetestRunRefs = [],
  baselineAggregationRefs = [],
}) {
  const inputVersions = {
    [GOAL_REF]: '1.0.0',
    [QUERY_REF]: '1.0.0',
    [QUERY_SET_REF]: '1.0.0',
    [RELEASE_REF]: '1.0.0',
    [CLAIM_REF]: '1.0.0',
    [PROFILE_REF]: PROFILE_VERSION,
  };
  const rubricSha = sha256('m6-e2e-rubric-v1');
  const samples = [];
  const reviews = [];
  const descriptors = [];
  for (const ordinal of [1, 2]) {
    const sampleId = `SMP-M6-${prefix}-S${ordinal}-001`;
    const answerBytes = `Synthetic ${purpose} answer slot ${ordinal}.\n`;
    const raw = await writeRaw(root, runId, `raw/${purpose}/slot-${ordinal}.txt`, answerBytes);
    const artifacts = [{ role: 'answer_text', availability: 'captured', ...raw }];
    const sample = {
      ...common(sampleId, 'answer_sample', 'recorded', `Synthetic ${purpose} slot ${ordinal}`),
      purpose,
      query_ref: QUERY_REF,
      query_version: '1.0.0',
      query_set_ref: QUERY_SET_REF,
      query_set_version: '1.0.0',
      intent: 'definition',
      platform: 'chatgpt',
      collector_profile_ref: PROFILE_REF,
      collector_profile_version: PROFILE_VERSION,
      run_ref: runId,
      slot_key: sampleSlotKey({
        purpose,
        queryRef: QUERY_REF,
        queryVersion: '1.0.0',
        platform: 'chatgpt',
        collectorProfileRef: PROFILE_REF,
        collectorProfileVersion: PROFILE_VERSION,
        queryTemplateVersion: '1.0.0',
        timeWindowId: 'TW-M6-TEST-001',
        ordinal,
      }),
      ordinal,
      attempt_no: 1,
      outcome: 'success',
      captured_at: `2026-08-27T00:0${ordinal}:00Z`,
      collection_method: 'recorded_fixture',
      artifacts,
      raw_manifest_sha256: sha256(stableStringify(artifacts)),
      privacy: {
        account_identifier_stored: false,
        credentials_stored: false,
        answer_region_only: true,
        redaction_notes: [],
      },
      ...(purpose === 'post_change_retest'
        ? { publication_refs: publicationRefs, technical_retest_run_refs: technicalRetestRunRefs, baseline_aggregation_refs: baselineAggregationRefs }
        : {}),
    };
    const samplePath = `cycles/m6/answers/${sampleId.toLowerCase()}.md`;
    descriptors.push(await writeObject(root, samplePath, sample));
    samples.push(sample);
    const review = reviewData(`ARV-M6-${prefix}-S${ordinal}-001`, sample, rubricSha);
    descriptors.push(await writeObject(
      root,
      `cycles/m6/reviews/${review.id.toLowerCase()}.md`,
      review,
    ));
    reviews.push(review);
  }
  const run = {
    ...common(runId, 'run', 'completed', `Synthetic ${purpose} Answer Run`),
    skill: 'geo-answer-cycle',
    skill_version: '1.0.0',
    input_refs: Object.keys(inputVersions).sort(),
    input_versions: Object.fromEntries(Object.entries(inputVersions).sort(([a], [b]) => a.localeCompare(b))),
    input_fingerprint: inputFingerprint(inputVersions),
    completed_steps: ['samples_recorded', 'reviews_recorded', 'aggregation_computed'],
    output_artifacts: samples.map((sample) => sample.artifacts[0].path),
    business_result: 'partial',
    next_action: 'M6 lifecycle gate',
    finding_refs: [], evidence_refs: [], asset_refs: [], failure_reason: null,
    authorization_ref: 'fixture://authorization/m6-e2e-answer',
    purpose,
    profile_versions: [{ ref: PROFILE_REF, version: PROFILE_VERSION }],
    query_set_versions: [{ ref: QUERY_SET_REF, version: '1.0.0' }],
    sample_slots: samples.map((sample) => ({
      slot_key: sample.slot_key,
      query_ref: QUERY_REF,
      platform: 'chatgpt',
      ordinal: sample.ordinal,
      completed_steps: [],
      step_proofs: {},
      attempt_refs: [sample.id],
      selected_sample_ref: sample.id,
    })),
    collector_contract: {
      schema_version: '1.0.0', collector_version: 'm6-e2e-fixture-v1',
      tool_policy_version: 'm6-e2e-policy-v1',
    },
  };
  descriptors.push(await writeObject(root, `runs/${runId}/run.md`, run));
  const aggregation = {
    ...common(aggregationId, 'answer_aggregation', 'computed', `Synthetic ${purpose} Aggregation`),
    purpose,
    industry: 'synthetic-services',
    platform: 'chatgpt',
    query_cluster: {
      id: 'QC-M6-DEFINITION', label: 'Synthetic definition',
      query_versions: [{ ref: QUERY_REF, version: '1.0.0' }],
    },
    time_window: {
      id: purpose === 'baseline' ? 'TW-M6-BASELINE' : 'TW-M6-RETEST',
      starts_at: '2026-08-27T00:00:00Z', ends_at: '2026-08-28T00:00:00Z',
    },
    profile_versions: [{ ref: PROFILE_REF, version: PROFILE_VERSION }],
    selected_sample_versions: samples.map((sample) => ({
      slot_key: sample.slot_key,
      ref: sample.id,
      version: sample.version,
      raw_manifest_sha256: sample.raw_manifest_sha256,
    })),
    citation_versions: [], source_versions: [], classification_versions: [],
    claim_support_review_versions: [],
    answer_review_versions: reviews.map((review) => ({
      ref: review.id, version: review.version, rubric_sha256: review.rubric.sha256,
    })),
    comparability: {
      result: true,
      ...(purpose === 'post_change_retest' ? { compared_to_ref: baselineAggregationRefs[0] } : {}),
      field_differences: [], notes: [],
    },
    metrics: { expected_sample_count: 2, selected_sample_count: 2 },
  };
  descriptors.push(await writeObject(
    root,
    `cycles/m6/aggregations/${aggregation.id.toLowerCase()}.md`,
    aggregation,
  ));
  return { descriptors, samples, reviews, aggregation, run };
}

async function materializeM4Gates(root, { allRejected }) {
  const descriptors = [];
  const assetSnapshot = '<html><body><h1>Synthetic About</h1></body></html>\n';
  await writeCreateOnly(root, 'evidence/snapshots/m6-e2e-asset.html', assetSnapshot, {
    idempotent: true, conflictCode: 'OBJECT_CONFLICT',
  });
  const assetEvidence = {
    ...common('EVD-M6-ASSET-001', 'evidence', 'candidate', 'Synthetic Asset Evidence'),
    source_refs: ['SRC-M6-TEST-001'], claim_refs: [CLAIM_REF],
    locator: 'https://m6-test-merchant.invalid/about', captured_at: M6_NOW,
    snapshot: {
      path: 'evidence/snapshots/m6-e2e-asset.html', sha256: sha256(assetSnapshot), media_type: 'text/html',
    },
    collector: { name: 'm6-e2e-fixture', version: '1.0.0' },
    scope: 'Synthetic target content.', collection_state: 'captured',
    proof_scope: 'target_content', detector_code: 'CONTENT_PRESENT',
  };
  descriptors.push(await writeObject(root, 'evidence/records/evd-m6-asset-001.md', assetEvidence));
  const contentGap = {
    ...common('FND-M6-CONTENT-GAP-001', 'finding', 'open', 'Synthetic Content Gap'),
    finding_code: 'CONTENT_MISSING', finding_kind: 'semantic', item_state: 'inferred',
    rule_version: 'm6-e2e-gap-v1', diagnosis_class: 'content_gap',
    query_refs: [QUERY_REF], claim_refs: [CLAIM_REF],
    evidence_refs: ['EVD-M6-TEST-001', assetEvidence.id], asset_refs: [ASSET_REF],
    source_refs: ['SRC-M6-TEST-001'], approval: { ...M6_APPROVAL },
    gap_basis: {
      supporting_evidence_refs: ['EVD-M6-TEST-001', assetEvidence.id],
      counter_evidence_refs: [], unresolved_conflicts: [], rationale: 'Synthetic Content Gap.',
    },
  };
  descriptors.push(await writeObject(root, 'cycles/m6/findings/fnd-m6-content-gap-001.md', contentGap));
  const proposalBody = '# About\n\nAdd the synthetic approved capability statement.\n';
  const proposal = {
    ...common('PRP-M6-ASSET-001', 'asset_proposal', 'draft', 'Synthetic Asset Proposal'),
    asset_ref: ASSET_REF, goal_refs: [GOAL_REF], query_refs: [QUERY_REF],
    finding_refs: [contentGap.id],
    knowledge_release_versions: [{ ref: RELEASE_REF, version: '1.0.0' }],
    claim_versions: [{ ref: CLAIM_REF, version: '1.0.0' }],
    evidence_refs: ['EVD-M6-TEST-001', assetEvidence.id],
    body_sha256: sha256(proposalBody),
    recommendation_items: [{
      item_id: 'REC-M6-ASSET-001', section: 'About', action: 'Add synthetic capability.',
      claim_refs: [CLAIM_REF], evidence_refs: ['EVD-M6-TEST-001', assetEvidence.id],
      finding_refs: [contentGap.id],
      risk: {
        level: 'low', type: 'none', reason: 'Synthetic approved fixture.',
        suggested_weakening: 'Not required for fixture.',
      },
    }],
  };
  descriptors.push(await writeObject(
    root,
    'cycles/m6/proposals/prp-m6-asset-001.md',
    proposal,
    proposalBody,
  ));
  const adoption = {
    ...common('ADR-M6-ASSET-001', 'adoption_record', 'decided', 'Synthetic Adoption'),
    proposal_ref: proposal.id, asset_ref: ASSET_REF,
    decisions: [{
      item_id: 'REC-M6-ASSET-001',
      decision: allRejected ? 'rejected' : 'accepted',
      reason: allRejected ? 'Synthetic rejection fixture.' : 'Synthetic acceptance fixture.',
    }],
    approval: { ...M6_APPROVAL },
  };
  descriptors.push(await writeObject(root, 'cycles/m6/adoptions/adr-m6-asset-001.md', adoption));
  if (allRejected) return { descriptors, proposal, adoption, publication: null };
  const publication = {
    ...common('PUB-M6-ASSET-001', 'asset_publication', 'confirmed', 'Synthetic Publication'),
    proposal_ref: proposal.id, adoption_ref: adoption.id, asset_ref: ASSET_REF,
    published_item_ids: ['REC-M6-ASSET-001'],
    published_locator: 'https://m6-test-merchant.invalid/about',
    content_sha256: sha256(proposalBody), published_at: M6_NOW,
    approval: { ...M6_APPROVAL },
  };
  descriptors.push(await writeObject(root, 'cycles/m6/publications/pub-m6-asset-001.md', publication));
  return { descriptors, proposal, adoption, publication };
}

export async function materializeM6E2EGates(root, bundle, { allRejected = false } = {}) {
  const baseline = await materializeAnswerGate(root, {
    purpose: 'baseline', prefix: 'BASE', runId: 'RUN-M6-BASELINE-001',
    aggregationId: 'AGG-M6-BASE-001',
  });
  const m4 = await materializeM4Gates(root, { allRejected });
  if (allRejected) {
    return {
      byGate: {
        baseline: baseline.descriptors,
        diagnosis: m4.descriptors.filter((item) => ['finding', 'asset_proposal'].includes(item.record_type)),
        adoption: m4.descriptors.filter((item) => item.record_type === 'adoption_record'),
      },
      all: [...baseline.descriptors, ...m4.descriptors],
    };
  }

  const technicalEvidence = {
    ...common('EVD-M6-TECH-RETEST-001', 'evidence', 'candidate', 'Synthetic Retest Evidence'),
    source_refs: ['SRC-M6-TEST-001'], claim_refs: [CLAIM_REF],
    locator: 'https://m6-test-merchant.invalid/about', captured_at: M6_NOW,
    snapshot: {
      path: 'evidence/snapshots/m6-e2e-asset.html',
      sha256: sha256(await readFile(path.join(root, 'evidence/snapshots/m6-e2e-asset.html'))),
      media_type: 'text/html',
    },
    collector: { name: 'm6-e2e-fixture', version: '1.0.0' },
    scope: 'Synthetic Technical Retest.', collection_state: 'captured',
    proof_scope: 'target_content', detector_code: 'HTTP_STATUS',
  };
  const technicalDescriptors = [await writeObject(
    root, 'evidence/records/evd-m6-tech-retest-001.md', technicalEvidence,
  )];
  const oldTechnical = {
    ...common('FND-M6-TECHNICAL-001', 'finding', 'open', 'Synthetic Technical Finding'),
    finding_code: 'HTTP_STATUS', finding_kind: 'technical', item_state: 'observed',
    rule_version: 'm6-e2e-detector-v1', diagnosis_class: 'technical',
    query_refs: [QUERY_REF], claim_refs: [CLAIM_REF], evidence_refs: ['EVD-M6-ASSET-001'],
    asset_refs: [ASSET_REF], source_refs: ['SRC-M6-TEST-001'],
  };
  technicalDescriptors.push(await writeObject(root, 'cycles/m6/findings/fnd-m6-technical-001.md', oldTechnical));
  const retestFinding = {
    ...common('FND-M6-TECHNICAL-RETEST-001', 'finding', 'resolved', 'Synthetic Technical Retest'),
    finding_code: 'HTTP_STATUS', finding_kind: 'technical', item_state: 'observed',
    rule_version: 'm6-e2e-detector-v1', diagnosis_class: 'technical',
    query_refs: [QUERY_REF], claim_refs: [CLAIM_REF], evidence_refs: [technicalEvidence.id],
    asset_refs: [ASSET_REF], source_refs: ['SRC-M6-TEST-001'], retest_of_ref: oldTechnical.id,
  };
  technicalDescriptors.push(await writeObject(
    root, 'cycles/m6/findings/fnd-m6-technical-retest-001.md', retestFinding,
  ));
  const techInputVersions = {
    [GOAL_REF]: '1.0.0', [QUERY_SET_REF]: '1.0.0', [RELEASE_REF]: '1.0.0',
    [ASSET_REF]: '1.0.0', [m4.publication.id]: '1.0.0', [oldTechnical.id]: '1.0.0',
  };
  const techRun = {
    ...common('RUN-M6-TECHNICAL-RETEST-001', 'run', 'completed', 'Synthetic Technical Retest Run'),
    skill: 'geo-site-technical-retest', skill_version: '1.0.0',
    input_refs: Object.keys(techInputVersions).sort(),
    input_versions: Object.fromEntries(Object.entries(techInputVersions).sort(([a], [b]) => a.localeCompare(b))),
    input_fingerprint: inputFingerprint(techInputVersions),
    completed_steps: ['technical_retest'], output_artifacts: [], business_result: 'pass',
    next_action: 'answer retest', finding_refs: [retestFinding.id],
    evidence_refs: [technicalEvidence.id], asset_refs: [ASSET_REF], failure_reason: null,
    goal_refs: [GOAL_REF], query_set_versions: [{ ref: QUERY_SET_REF, version: '1.0.0' }],
    knowledge_release_versions: [{ ref: RELEASE_REF, version: '1.0.0' }],
    publication_refs: [m4.publication.id], retest_of_refs: [oldTechnical.id],
    development_fixture: true, manifest_fingerprint: 'f'.repeat(64),
    detector_results: [{
      code: 'HTTP_STATUS', state: 'pass', rule_version: 'm6-e2e-detector-v1',
      message: 'Synthetic fixture HTTP status passes.',
    }],
  };
  technicalDescriptors.push(await writeObject(root, `runs/${techRun.id}/run.md`, techRun));
  const retest = await materializeAnswerGate(root, {
    purpose: 'post_change_retest', prefix: 'RETEST', runId: 'RUN-M6-ANSWER-RETEST-001',
    aggregationId: 'AGG-M6-RETEST-001', publicationRefs: [m4.publication.id],
    technicalRetestRunRefs: [techRun.id], baselineAggregationRefs: [baseline.aggregation.id],
  });
  const all = [...baseline.descriptors, ...m4.descriptors, ...technicalDescriptors, ...retest.descriptors];
  return {
    all,
    byGate: {
      baseline: baseline.descriptors.filter((item) =>
        ['answer_sample', 'answer_review', 'answer_aggregation'].includes(item.record_type)),
      diagnosis: m4.descriptors.filter((item) => ['finding', 'asset_proposal'].includes(item.record_type)),
      adoption: m4.descriptors.filter((item) => item.record_type === 'adoption_record'),
      publication: m4.descriptors.filter((item) => item.record_type === 'asset_publication'),
      technical_retest: technicalDescriptors.filter((item) =>
        item.id === techRun.id || item.id === retestFinding.id),
      answer_retest: retest.descriptors.filter((item) =>
        ['answer_sample', 'answer_review', 'answer_aggregation'].includes(item.record_type)),
    },
  };
}
