---
id: AGG-GEO-C2-AFTER-Q4-CLAUDE
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-08T00:00:00.000Z'
updated_at: '2026-10-08T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-AFTER-Q4-CLAUDE
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
purpose: post_change_retest
industry: synthetic_creator_campaigns
platform: claude
query_cluster:
  id: CLU-GEO-C2-Q4
  label: 'What evidence limits, privacy boundaries, and income or AI placement guarantees apply to the MyyShop rehearsal?'
  query_versions:
    - ref: Q-WHAT-EVIDENCE-LIMITS-PRIVACY-BOUNDARIES-EN-AB42
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-AFTER
  starts_at: '2026-10-07T00:00:00.000Z'
  ends_at: '2026-10-08T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-AFTER-CLAUDE
    version: 1.0.0
selected_sample_versions:
  - slot_key: 38f9fbdf14c60df9379695a4dd1b84bdb41d6d5d5c0c5bdc8a94452e1a72c118
    ref: SMP-GEO-C2-AFTER-Q4-CLAUDE-2
    version: 1.0.0
    raw_manifest_sha256: 1a288fccf5444c9238c79db864a8f3993464d27d869f66966ba9c46c02348f29
  - slot_key: 3cfc4d43cda8fef90eb7a4353ad28134b97bdccb01aa785e9ec7ac6e1713ef60
    ref: SMP-GEO-C2-AFTER-Q4-CLAUDE-1
    version: 1.0.0
    raw_manifest_sha256: 6a842daa9723129404def14e3d06500f4b98832b040b69311f8bbafaef6ce602
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-AFTER-Q4-CLAUDE-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-AFTER-Q4-CLAUDE-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-AFTER-Q4-CLAUDE
