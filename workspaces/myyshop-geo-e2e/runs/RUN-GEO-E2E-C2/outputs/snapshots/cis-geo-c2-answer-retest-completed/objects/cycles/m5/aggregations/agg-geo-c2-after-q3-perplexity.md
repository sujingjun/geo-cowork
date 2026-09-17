---
id: AGG-GEO-C2-AFTER-Q3-PERPLEXITY
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-08T00:00:00.000Z'
updated_at: '2026-10-08T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-AFTER-Q3-PERPLEXITY
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
  id: CLU-GEO-C2-Q3
  label: 'What capabilities does the MyyShop rehearsal support for campaign discovery, applications, and performance reports, and what automation is unavailable?'
  query_versions:
    - ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-AFTER
  starts_at: '2026-10-07T00:00:00.000Z'
  ends_at: '2026-10-08T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-AFTER-PERPLEXITY
    version: 1.0.0
selected_sample_versions:
  - slot_key: 0831fad418a88d75a0c8c9f79d8e7552a20d0359e0fa8a0627a9a32ebc44475e
    ref: SMP-GEO-C2-AFTER-Q3-PERPLEXITY-1
    version: 1.0.0
    raw_manifest_sha256: 92e13962354bd38acbe1b6209d98c12afe566b47a29dbb530570b7d3708a3d33
  - slot_key: 932fd06df4f88dbbc554ed95d4335c71c827e8d790698419b5bdca879b744622
    ref: SMP-GEO-C2-AFTER-Q3-PERPLEXITY-2
    version: 1.0.0
    raw_manifest_sha256: c025bff915f7be27623e4fb4b475e0e6684ea4938dbb3a3ce1a84c5909d8063a
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-AFTER-Q3-PERPLEXITY-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-AFTER-Q3-PERPLEXITY-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-AFTER-Q3-PERPLEXITY
