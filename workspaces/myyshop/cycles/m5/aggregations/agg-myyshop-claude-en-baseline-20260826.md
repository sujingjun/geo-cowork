---
id: AGG-MYYSHOP-CLAUDE-EN-BASELINE-20260826
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-08-26T20:59:39+08:00'
updated_at: '2026-08-26T20:59:39+08:00'
title: Answer Aggregation AGG-MYYSHOP-CLAUDE-EN-BASELINE-20260826
purpose: baseline
industry: creator-services
platform: claude
query_cluster:
  id: QC-MYYSHOP-BRAND-DEFINITION-EN
  label: What is MyyShop English brand definition
  query_versions:
    - ref: Q-MYYSHOP-WHAT-IS-EN-BASELINE-001
      version: 1.0.0
time_window:
  id: TW-MYYSHOP-M5-EN-BASELINE-20260826
  starts_at: '2026-08-26T00:00:00+08:00'
  ends_at: '2026-08-31T23:59:59+08:00'
profile_versions:
  - ref: CPF-MYYSHOP-CLAUDE-EN-BASELINE-20260826
    version: 1.0.0
selected_sample_versions:
  - slot_key: 06925a82b84d6bdb67ac5005b35ace381abc2819bae3fece4385cf549abeb748
    ref: SMP-MYYSHOP-CLAUDE-EN-BASELINE-S1-20260826
    version: 1.0.0
    raw_manifest_sha256: b1838ffb23fa481dfe3da2696e07a47fb777cef791746524c9717212ebcb7fd7
  - slot_key: 1aebcd47b6f35d3512574f66c50d61f75ec3617316c6b2d7d0307c513521660d
    ref: SMP-MYYSHOP-CLAUDE-EN-BASELINE-S2-20260826
    version: 1.0.0
    raw_manifest_sha256: a56d39fe03b9e0079a73b2491c4a0e55f84e75a91fe10780e50530601507271a
citation_versions:
  - ref: CIT-MYYSHOP-CLAUDE-EN-BASELINE-S1-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-CLAUDE-EN-BASELINE-S1-002
    version: 1.0.0
  - ref: CIT-MYYSHOP-CLAUDE-EN-BASELINE-S1-003
    version: 1.0.0
  - ref: CIT-MYYSHOP-CLAUDE-EN-BASELINE-S1-004
    version: 1.0.0
  - ref: CIT-MYYSHOP-CLAUDE-EN-BASELINE-S2-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-CLAUDE-EN-BASELINE-S2-002
    version: 1.0.0
source_versions:
  - ref: SRC-MYYSHOP-BUSINESS-WIRE-LAUNCH-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-CLAUDE-US-APP-STORE-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-WEB-HOMEPAGE-001
    version: 1.0.1
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-MYYSHOP-CLAUDE-EN-BASELINE-S1-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
  - ref: ARV-MYYSHOP-CLAUDE-EN-BASELINE-S2-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
comparability:
  result: partial
  field_differences:
    - field: region
      before: unknown
      after: unknown
      severity: unknown
    - field: login_state
      before: unknown
      after: unknown
      severity: unknown
    - field: model_mode
      before: unknown
      after: unknown
      severity: soft
    - field: device.viewport
      before: unknown
      after: unknown
      severity: soft
  notes:
    - 存在未知或软条件差异，仅部分可比。
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
  no_citation_answer_count: 0
  total_citation_units: 5
  top_citation_domains:
    - domain: apps.apple.com
      count: 2
      share: 0.4
    - domain: businesswire.com
      count: 2
      share: 0.4
    - domain: myyshop.com
      count: 1
      share: 0.2
  citation_share:
    denominator: 5
    domains:
      - domain: apps.apple.com
        count: 2
        share: 0.4
      - domain: businesswire.com
        count: 2
        share: 0.4
      - domain: myyshop.com
        count: 1
        share: 0.2
    reason: null
  source_diversity:
    distinct_source_types: 0
    distinct_citation_domains: 3
    classification_coverage: 0
    normalized_source_type_entropy: null
    status: partial
  party_relation:
    first_party_count: 0
    third_party_count: 0
    unknown_count: 5
    first_party_share: 0
    third_party_share: 0
    unknown_share: 1
    party_coverage: 0
    ratio: null
    ratio_reason: NO_THIRD_PARTY_CITATIONS
  source_volatility:
    value: null
    reason: NO_COMPARISON_BASELINE
  new_source_count: 2
  returning_source_count: 1
  classification_counts:
    candidate: 0
    reviewed: 0
    unresolved: 0
    archived_unclassified: 3
  review_required_count: 2
---
# Answer Aggregation AGG-MYYSHOP-CLAUDE-EN-BASELINE-20260826
