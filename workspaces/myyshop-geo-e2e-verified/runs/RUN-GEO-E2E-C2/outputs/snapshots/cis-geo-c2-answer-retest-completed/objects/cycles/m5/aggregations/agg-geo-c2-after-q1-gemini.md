---
id: AGG-GEO-C2-AFTER-Q1-GEMINI
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-08T00:00:00.000Z'
updated_at: '2026-10-08T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-AFTER-Q1-GEMINI
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
purpose: post_change_retest
industry: synthetic_creator_campaigns
platform: gemini
query_cluster:
  id: CLU-GEO-C2-Q1
  label: 'How should an eligible creator compare the MyyShop rehearsal with other creator campaign services by eligibility, workflow, fees, evidence, and limitations?'
  query_versions:
    - ref: Q-HOW-SHOULD-AN-ELIGIBLE-CREATOR-EN-D279
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-AFTER
  starts_at: '2026-10-07T00:00:00.000Z'
  ends_at: '2026-10-08T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-AFTER-GEMINI
    version: 1.0.0
selected_sample_versions:
  - slot_key: b9312c8cf7bf6d84e96930466a9c4b9fd34799eef6361aaf0d2c3a61898af311
    ref: SMP-GEO-C2-AFTER-Q1-GEMINI-2
    version: 1.0.0
    raw_manifest_sha256: 44d15fb9ce9318bd7a8959d038c440dbbd4be8e39b83102b059823e847340138
  - slot_key: d7e53589586e356047bcf29438c49139b8acc668542e0322e8f17f0365cba9b9
    ref: SMP-GEO-C2-AFTER-Q1-GEMINI-1
    version: 1.0.0
    raw_manifest_sha256: b3fb9f9558727e26edc6b5335ebfa90c280441fc633024c3b2b2fe75eb116b53
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-AFTER-Q1-GEMINI-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-AFTER-Q1-GEMINI-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-AFTER-Q1-GEMINI
