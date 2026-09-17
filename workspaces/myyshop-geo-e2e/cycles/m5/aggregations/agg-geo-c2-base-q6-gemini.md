---
id: AGG-GEO-C2-BASE-Q6-GEMINI
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-01T00:00:00.000Z'
updated_at: '2026-10-01T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-BASE-Q6-GEMINI
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
purpose: baseline
industry: synthetic_creator_campaigns
platform: gemini
query_cluster:
  id: CLU-GEO-C2-Q6
  label: 'Who is eligible to participate in the MyyShop rehearsal, and what onboarding is required?'
  query_versions:
    - ref: Q-WHO-IS-ELIGIBLE-TO-PARTICIPATE-EN-B8C2
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-BASE
  starts_at: '2026-09-30T00:00:00.000Z'
  ends_at: '2026-10-01T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-BASE-GEMINI
    version: 1.0.0
selected_sample_versions:
  - slot_key: 061cf7d5ea978fce6e275183459e2c3c1c78b9a04831a83259f995919c37970c
    ref: SMP-GEO-C2-BASE-Q6-GEMINI-1
    version: 1.0.0
    raw_manifest_sha256: 366d10cf5b2c39ca8a6d020253b43ca84450f2927e120cc9a66e987c998f166f
  - slot_key: 71797cf7e4c983ccc1a63834b33f9e5538f1441a366ad144c002439f3b4a29eb
    ref: SMP-GEO-C2-BASE-Q6-GEMINI-2
    version: 1.0.0
    raw_manifest_sha256: 4ba361ee6daa3a5c22e372ce75ffdc6db9295225731eb87e76ac977e9e864156
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-BASE-Q6-GEMINI-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-BASE-Q6-GEMINI-2-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
comparability:
  result: true
  field_differences: []
  notes: []
metrics:
  expected_sample_count: 2
  selected_sample_count: 2
  outcome_counts:
    success: 2
    refusal: 0
    timeout: 0
    no_result: 0
    challenge: 0
    cancelled: 0
    system_failure: 0
  system_failure_attempt_count: 0
  no_citation_answer_count: 2
  total_citation_units: 0
  top_citation_domains: []
  citation_share:
    denominator: 0
    domains: []
    reason: NO_CITATIONS
  source_diversity:
    distinct_source_types: 0
    distinct_citation_domains: 0
    classification_coverage: null
    normalized_source_type_entropy: null
    status: partial
  party_relation:
    first_party_count: 0
    third_party_count: 0
    unknown_count: 0
    first_party_share: null
    third_party_share: null
    unknown_share: null
    party_coverage: null
    ratio: null
    ratio_reason: NO_THIRD_PARTY_CITATIONS
  source_volatility:
    value: null
    reason: NO_COMPARISON_BASELINE
  new_source_count: 0
  returning_source_count: 0
  classification_counts:
    candidate: 0
    reviewed: 0
    unresolved: 0
    archived_unclassified: 0
  review_required_count: 0
---
# Answer Aggregation AGG-GEO-C2-BASE-Q6-GEMINI
