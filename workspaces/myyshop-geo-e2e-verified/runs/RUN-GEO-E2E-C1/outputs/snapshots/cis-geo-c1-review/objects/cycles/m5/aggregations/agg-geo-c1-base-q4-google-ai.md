---
id: AGG-GEO-C1-BASE-Q4-GOOGLE-AI
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-09-17T00:00:00.000Z'
updated_at: '2026-09-17T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C1-BASE-Q4-GOOGLE-AI
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
purpose: baseline
industry: synthetic_creator_campaigns
platform: google_ai
query_cluster:
  id: CLU-GEO-C1-Q4
  label: 'What capabilities does the MyyShop rehearsal support, and what automation or fulfillment is unavailable?'
  query_versions:
    - ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-2DE3
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C1-BASE
  starts_at: '2026-09-16T00:00:00.000Z'
  ends_at: '2026-09-17T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C1-BASE-GOOGLE-AI
    version: 1.0.0
selected_sample_versions:
  - slot_key: 00460ae4976bef20350cded62b6266fe20424456d65ddb205ffdc2f00f3bcaa9
    ref: SMP-GEO-C1-BASE-Q4-GOOGLE-AI-2
    version: 1.0.0
    raw_manifest_sha256: f5a23e23ca33fa865f6803915446c9440fccf3ddb89924f1224e5108ee56f22f
  - slot_key: e2cdc5788de371a54e192576e6eb372d28c28d5e06cc962a84d5c5a0e2e34b99
    ref: SMP-GEO-C1-BASE-Q4-GOOGLE-AI-1
    version: 1.0.0
    raw_manifest_sha256: 1a269c7e3b9d95a80250944653d1eda8a6ce46e0f3410c6282a2a26c60248a6e
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C1-BASE-Q4-GOOGLE-AI-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C1-BASE-Q4-GOOGLE-AI-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C1-BASE-Q4-GOOGLE-AI
