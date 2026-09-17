---
id: AGG-GEO-C2-BASE-Q5-CLAUDE
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-01T00:00:00.000Z'
updated_at: '2026-10-01T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-BASE-Q5-CLAUDE
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
purpose: baseline
industry: synthetic_creator_campaigns
platform: claude
query_cluster:
  id: CLU-GEO-C2-Q5
  label: What is the MyyShop rehearsal service as defined in the synthetic test knowledge base?
  query_versions:
    - ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-BASE
  starts_at: '2026-09-30T00:00:00.000Z'
  ends_at: '2026-10-01T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-BASE-CLAUDE
    version: 1.0.0
selected_sample_versions:
  - slot_key: 02ae74fcb7c6da85cd18093d10ce9889fd67203df940e9e79908cc2c0680d72a
    ref: SMP-GEO-C2-BASE-Q5-CLAUDE-1
    version: 1.0.0
    raw_manifest_sha256: 9672b2d0ea5384320634436762fa166fda158854cb9bf24b7d999f2e230e6129
  - slot_key: 89c373833c20d9322b4ac970d6858fe0b8aba6472e3e3351c201e82de6db4054
    ref: SMP-GEO-C2-BASE-Q5-CLAUDE-2
    version: 1.0.0
    raw_manifest_sha256: 17787fe559907bad0df8bec721c5b17f6ad4c332090876ead395a53b42a87780
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-BASE-Q5-CLAUDE-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-BASE-Q5-CLAUDE-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-BASE-Q5-CLAUDE
