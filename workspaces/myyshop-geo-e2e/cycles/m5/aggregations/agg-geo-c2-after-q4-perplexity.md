---
id: AGG-GEO-C2-AFTER-Q4-PERPLEXITY
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-08T00:00:00.000Z'
updated_at: '2026-10-08T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-AFTER-Q4-PERPLEXITY
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
purpose: post_change_retest
industry: synthetic_creator_campaigns
platform: perplexity
query_cluster:
  id: CLU-GEO-C2-Q4
  label: 'What does the MyyShop rehearsal not guarantee, and what privacy limits apply to its reports?'
  query_versions:
    - ref: Q-WHAT-DOES-THE-MYYSHOP-REHEARSAL-EN-0B93
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-AFTER
  starts_at: '2026-10-07T00:00:00.000Z'
  ends_at: '2026-10-08T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-AFTER-PERPLEXITY
    version: 1.0.0
selected_sample_versions:
  - slot_key: 1474e14600600f80d0ee9e243eb16e678f2588ce906c8f8faf0405e27ecbf65b
    ref: SMP-GEO-C2-AFTER-Q4-PERPLEXITY-1
    version: 1.0.0
    raw_manifest_sha256: 3c70f18ee03d568516f4ce0b892b970464b5405dafabd967177cdfe5e56766fe
  - slot_key: e08845777ed13a7e233311fcbb7c8185d794ef49f687e51381f64666c28273f8
    ref: SMP-GEO-C2-AFTER-Q4-PERPLEXITY-2
    version: 1.0.0
    raw_manifest_sha256: 713703fe123d61d52529b2f745ee13a27d1b338cfafe8bd28e2016261f44af8a
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-AFTER-Q4-PERPLEXITY-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-AFTER-Q4-PERPLEXITY-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-AFTER-Q4-PERPLEXITY
