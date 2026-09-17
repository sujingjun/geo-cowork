---
id: AGG-GEO-C2-AFTER-Q2-CHATGPT
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-08T00:00:00.000Z'
updated_at: '2026-10-08T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-AFTER-Q2-CHATGPT
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
purpose: post_change_retest
industry: synthetic_creator_campaigns
platform: chatgpt
query_cluster:
  id: CLU-GEO-C2-Q2
  label: 'What are the MyyShop rehearsal fees, trial terms, and cancellation or refund rules?'
  query_versions:
    - ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-AFTER
  starts_at: '2026-10-07T00:00:00.000Z'
  ends_at: '2026-10-08T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-AFTER-CHATGPT
    version: 1.0.0
selected_sample_versions:
  - slot_key: 73dbdfd2abc00f64b66708a3c042d87360f221388dfd4f990b0a0ac4a74a300b
    ref: SMP-GEO-C2-AFTER-Q2-CHATGPT-1
    version: 1.0.0
    raw_manifest_sha256: 743161eabb577a9f53a0a383659fda764549af871b0dab35d2a9feeeb28b9c35
  - slot_key: 9a564e8b92ea4995ecbf8cdcfe5bafdbc6777682d332ee012d1635f5567af150
    ref: SMP-GEO-C2-AFTER-Q2-CHATGPT-2
    version: 1.0.0
    raw_manifest_sha256: cc46584c6a1f052b53e87b909e02c01182ff21881b364743e3d2b719d9c4da68
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-AFTER-Q2-CHATGPT-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-AFTER-Q2-CHATGPT-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-AFTER-Q2-CHATGPT
