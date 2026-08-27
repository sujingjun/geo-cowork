---
id: AGG-MYYSHOP-GOOGLE-AI-EN-BASELINE-20260826
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-08-26T20:59:39+08:00'
updated_at: '2026-08-26T20:59:39+08:00'
title: Answer Aggregation AGG-MYYSHOP-GOOGLE-AI-EN-BASELINE-20260826
purpose: baseline
industry: creator-services
platform: google_ai
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
  - ref: CPF-MYYSHOP-GOOGLE-AI-EN-BASELINE-20260826
    version: 1.0.0
selected_sample_versions:
  - slot_key: 0b6032e1cccc3e1f31764a07e10fdeb060536e8eaa1acbd074af4fa39153b3c9
    ref: SMP-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-20260826
    version: 1.0.0
    raw_manifest_sha256: 57e7986bcd073e3c0b6b5780add2023a2ededb56ee7cab6400296064ce8529bd
  - slot_key: 857e83292d9f1b106f5cd5b29fa8b64455e1172fda0af5a73761ca0160f91878
    ref: SMP-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-20260826
    version: 1.0.0
    raw_manifest_sha256: 5dfa7b910fbd68b079357bf35d25852f80b8061bce12350489e758ab02d47a3e
citation_versions:
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-002
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-003
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-004
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-005
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-006
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-007
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-002
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-003
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-004
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-005
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-006
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-007
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-008
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-009
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-010
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-011
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-012
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-013
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-014
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-015
    version: 1.0.0
  - ref: CIT-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-016
    version: 1.0.0
source_versions:
  - ref: SRC-MYYSHOP-CLAUDE-US-APP-STORE-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-FACEBOOK-OFFICIAL-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-INFLUENCER-MARKETING-HUB-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-LINKEDIN-COMPANY-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-PERPLEXITY-REDDIT-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-WEB-ABOUT-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-WEB-HOMEPAGE-001
    version: 1.0.1
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-MYYSHOP-GOOGLE-AI-EN-BASELINE-S1-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
  - ref: ARV-MYYSHOP-GOOGLE-AI-EN-BASELINE-S2-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
comparability:
  result: partial
  field_differences:
    - field: region
      before: unknown
      after: unknown
      severity: unknown
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
  total_citation_units: 14
  top_citation_domains:
    - domain: myyshop.com
      count: 4
      share: 0.2857142857142857
    - domain: apps.apple.com
      count: 3
      share: 0.21428571428571427
    - domain: facebook.com
      count: 2
      share: 0.14285714285714285
    - domain: influencermarketinghub.com
      count: 2
      share: 0.14285714285714285
    - domain: reddit.com
      count: 2
      share: 0.14285714285714285
    - domain: linkedin.com
      count: 1
      share: 0.07142857142857142
  citation_share:
    denominator: 14
    domains:
      - domain: myyshop.com
        count: 4
        share: 0.2857142857142857
      - domain: apps.apple.com
        count: 3
        share: 0.21428571428571427
      - domain: facebook.com
        count: 2
        share: 0.14285714285714285
      - domain: influencermarketinghub.com
        count: 2
        share: 0.14285714285714285
      - domain: reddit.com
        count: 2
        share: 0.14285714285714285
      - domain: linkedin.com
        count: 1
        share: 0.07142857142857142
    reason: null
  source_diversity:
    distinct_source_types: 0
    distinct_citation_domains: 6
    classification_coverage: 0
    normalized_source_type_entropy: null
    status: partial
  party_relation:
    first_party_count: 0
    third_party_count: 0
    unknown_count: 14
    first_party_share: 0
    third_party_share: 0
    unknown_share: 1
    party_coverage: 0
    ratio: null
    ratio_reason: NO_THIRD_PARTY_CITATIONS
  source_volatility:
    value: null
    reason: NO_COMPARISON_BASELINE
  new_source_count: 4
  returning_source_count: 3
  classification_counts:
    candidate: 0
    reviewed: 0
    unresolved: 0
    archived_unclassified: 7
  review_required_count: 2
---
# Answer Aggregation AGG-MYYSHOP-GOOGLE-AI-EN-BASELINE-20260826
