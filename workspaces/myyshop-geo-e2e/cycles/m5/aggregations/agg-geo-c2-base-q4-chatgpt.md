---
id: AGG-GEO-C2-BASE-Q4-CHATGPT
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-01T00:00:00.000Z'
updated_at: '2026-10-01T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-BASE-Q4-CHATGPT
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
purpose: baseline
industry: synthetic_creator_campaigns
platform: chatgpt
query_cluster:
  id: CLU-GEO-C2-Q4
  label: 'What does the MyyShop rehearsal not guarantee, and what privacy limits apply to its reports?'
  query_versions:
    - ref: Q-WHAT-DOES-THE-MYYSHOP-REHEARSAL-EN-0B93
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-BASE
  starts_at: '2026-09-30T00:00:00.000Z'
  ends_at: '2026-10-01T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-BASE-CHATGPT
    version: 1.0.0
selected_sample_versions:
  - slot_key: 6aea0efe8d5ae0dd31d449f4c41f4ce603e03a67de732d7f4fd0bc29197cbee8
    ref: SMP-GEO-C2-BASE-Q4-CHATGPT-1
    version: 1.0.0
    raw_manifest_sha256: 5aa28cac0b880a3f9c7275c5c98f99348fcc14c04aa7a5083bd35f4f4284c99f
  - slot_key: c1b8a9373d8a59ce283416ca2987e317e97ccbaea2b73b4ecad3be98f7eb0df2
    ref: SMP-GEO-C2-BASE-Q4-CHATGPT-2
    version: 1.0.0
    raw_manifest_sha256: 32f8c41d4eeb57a8bd20045e0391d612d7d0b604bd98d6675776a62f56077e89
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-BASE-Q4-CHATGPT-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-BASE-Q4-CHATGPT-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-BASE-Q4-CHATGPT
