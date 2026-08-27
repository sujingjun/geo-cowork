---
id: AGG-MYYSHOP-GEMINI-EN-BASELINE-20260826
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-08-26T20:59:39+08:00'
updated_at: '2026-08-26T20:59:39+08:00'
title: Answer Aggregation AGG-MYYSHOP-GEMINI-EN-BASELINE-20260826
purpose: baseline
industry: creator-services
platform: gemini
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
  - ref: CPF-MYYSHOP-GEMINI-EN-BASELINE-20260826
    version: 1.0.0
selected_sample_versions:
  - slot_key: 1a586d64dfb55d186a6a7115ae0aede76fe5a6a2a436146085281104c3df1f84
    ref: SMP-MYYSHOP-GEMINI-EN-BASELINE-S1-20260826
    version: 1.0.0
    raw_manifest_sha256: 4977de576d1a5a6b901d87b258c46fec5baaa92bd9b39ea2a13ffa66e1718165
  - slot_key: 5d8979a08d04bb4140b0cc85ecae758a47262605777fa21d51aef3df42b19ea6
    ref: SMP-MYYSHOP-GEMINI-EN-BASELINE-S2-20260826
    version: 1.0.0
    raw_manifest_sha256: 18fb33b7f345b97863c2822f386fa739764b211362bb2d05895c6940268c4d39
citation_versions:
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-002
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-003
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-004
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-005
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-006
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-007
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-008
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-009
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-010
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S1-011
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S2-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S2-002
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S2-003
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S2-004
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S2-005
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S2-006
    version: 1.0.0
  - ref: CIT-MYYSHOP-GEMINI-EN-BASELINE-S2-007
    version: 1.0.0
source_versions:
  - ref: SRC-MYYSHOP-BUSINESS-WIRE-LAUNCH-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-DHGATE-DROPSHIPPING-BLOG-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-GLOBENEWSWIRE-CPM-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-INFLUENCER-MARKETING-HUB-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-PRNEWSWIRE-AWARD-001
    version: 1.0.1
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-MYYSHOP-GEMINI-EN-BASELINE-S1-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
  - ref: ARV-MYYSHOP-GEMINI-EN-BASELINE-S2-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
comparability:
  result: partial
  field_differences:
    - field: region
      before: unknown
      after: unknown
      severity: unknown
    - field: web_search_state
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
  total_citation_units: 6
  top_citation_domains:
    - domain: businesswire.com
      count: 2
      share: 0.3333333333333333
    - domain: dhgate.com
      count: 1
      share: 0.16666666666666666
    - domain: globenewswire.com
      count: 1
      share: 0.16666666666666666
    - domain: influencermarketinghub.com
      count: 1
      share: 0.16666666666666666
    - domain: prnewswire.com
      count: 1
      share: 0.16666666666666666
  citation_share:
    denominator: 6
    domains:
      - domain: businesswire.com
        count: 2
        share: 0.3333333333333333
      - domain: dhgate.com
        count: 1
        share: 0.16666666666666666
      - domain: globenewswire.com
        count: 1
        share: 0.16666666666666666
      - domain: influencermarketinghub.com
        count: 1
        share: 0.16666666666666666
      - domain: prnewswire.com
        count: 1
        share: 0.16666666666666666
    reason: null
  source_diversity:
    distinct_source_types: 0
    distinct_citation_domains: 5
    classification_coverage: 0
    normalized_source_type_entropy: null
    status: partial
  party_relation:
    first_party_count: 0
    third_party_count: 0
    unknown_count: 6
    first_party_share: 0
    third_party_share: 0
    unknown_share: 1
    party_coverage: 0
    ratio: null
    ratio_reason: NO_THIRD_PARTY_CITATIONS
  source_volatility:
    value: null
    reason: NO_COMPARISON_BASELINE
  new_source_count: 5
  returning_source_count: 0
  classification_counts:
    candidate: 0
    reviewed: 0
    unresolved: 0
    archived_unclassified: 5
  review_required_count: 2
---
# Answer Aggregation AGG-MYYSHOP-GEMINI-EN-BASELINE-20260826
