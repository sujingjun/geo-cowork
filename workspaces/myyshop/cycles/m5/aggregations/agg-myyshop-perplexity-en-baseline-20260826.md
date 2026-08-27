---
id: AGG-MYYSHOP-PERPLEXITY-EN-BASELINE-20260826
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-08-26T20:59:39+08:00'
updated_at: '2026-08-26T20:59:39+08:00'
title: Answer Aggregation AGG-MYYSHOP-PERPLEXITY-EN-BASELINE-20260826
purpose: baseline
industry: creator-services
platform: perplexity
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
  - ref: CPF-MYYSHOP-PERPLEXITY-EN-BASELINE-20260826
    version: 1.0.0
selected_sample_versions:
  - slot_key: 74c37f474aaa7dfced01f3c4ac125171d48d46bef2f93c90923c0b0c3bb78aa7
    ref: SMP-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-20260826
    version: 1.0.0
    raw_manifest_sha256: bb6c48216bdb2371a5e965730f41162016780ef70c50e3459586647bfef9c69e
  - slot_key: fb7ac0a5ab2fd53b8225c12cf3d50c3f344c60f645640c04742d78861f0db173
    ref: SMP-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-20260826
    version: 1.0.0
    raw_manifest_sha256: a3e7f7e7c1b865b89b2e54bc7db541271bc91c2d1dabdd45479d6ad487ee56bc
citation_versions:
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-002
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-003
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-004
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-005
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-006
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-001
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-002
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-003
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-004
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-005
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-006
    version: 1.0.0
  - ref: CIT-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-007
    version: 1.0.0
source_versions:
  - ref: SRC-MYYSHOP-CLAUDE-US-APP-STORE-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-PERPLEXITY-REDDIT-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-PERPLEXITY-REGISTER-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-PERPLEXITY-WORDPRESS-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-SHOP-ADMIN-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-WEB-ABOUT-001
    version: 1.0.1
  - ref: SRC-MYYSHOP-WEB-HOMEPAGE-001
    version: 1.0.1
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-MYYSHOP-PERPLEXITY-EN-BASELINE-S1-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
  - ref: ARV-MYYSHOP-PERPLEXITY-EN-BASELINE-S2-20260826
    version: 1.0.0
    rubric_sha256: 363525d166ea636b89b052b9c4e88a582e4c607b8a4688cf128c991c40904bea
comparability:
  result: partial
  field_differences:
    - field: region
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
  total_citation_units: 13
  top_citation_domains:
    - domain: myyshop.com
      count: 7
      share: 0.5384615384615384
    - domain: apps.apple.com
      count: 2
      share: 0.15384615384615385
    - domain: reddit.com
      count: 2
      share: 0.15384615384615385
    - domain: stufftotalk.wordpress.com
      count: 2
      share: 0.15384615384615385
  citation_share:
    denominator: 13
    domains:
      - domain: myyshop.com
        count: 7
        share: 0.5384615384615384
      - domain: apps.apple.com
        count: 2
        share: 0.15384615384615385
      - domain: reddit.com
        count: 2
        share: 0.15384615384615385
      - domain: stufftotalk.wordpress.com
        count: 2
        share: 0.15384615384615385
    reason: null
  source_diversity:
    distinct_source_types: 0
    distinct_citation_domains: 4
    classification_coverage: 0
    normalized_source_type_entropy: null
    status: partial
  party_relation:
    first_party_count: 0
    third_party_count: 0
    unknown_count: 13
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
  returning_source_count: 2
  classification_counts:
    candidate: 0
    reviewed: 0
    unresolved: 0
    archived_unclassified: 7
  review_required_count: 2
---
# Answer Aggregation AGG-MYYSHOP-PERPLEXITY-EN-BASELINE-20260826
