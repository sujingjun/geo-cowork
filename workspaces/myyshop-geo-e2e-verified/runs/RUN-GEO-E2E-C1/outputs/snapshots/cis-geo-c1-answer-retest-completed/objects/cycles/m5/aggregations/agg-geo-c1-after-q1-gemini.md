---
id: AGG-GEO-C1-AFTER-Q1-GEMINI
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-09-24T00:00:00.000Z'
updated_at: '2026-09-24T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C1-AFTER-Q1-GEMINI
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
  id: CLU-GEO-C1-Q1
  label: 'Does the MyyShop rehearsal guarantee income or AI placement, and how are report data and privacy handled?'
  query_versions:
    - ref: Q-DOES-THE-MYYSHOP-REHEARSAL-GUARANTEE-EN-F889
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C1-AFTER
  starts_at: '2026-09-23T00:00:00.000Z'
  ends_at: '2026-09-24T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C1-AFTER-GEMINI
    version: 1.0.0
selected_sample_versions:
  - slot_key: 569e602f1fe0dc12041fcce6a4ffdd105abfdf387c728ccec8acf5cc8035787b
    ref: SMP-GEO-C1-AFTER-Q1-GEMINI-1
    version: 1.0.0
    raw_manifest_sha256: a919d5da3d3d690decba5efe37b37fe759685c92ae0df48256604a89f81f53c6
  - slot_key: 94526e08284c2904540f67964e6ec7e155d9b1ad24ceadbce36f3842291078d7
    ref: SMP-GEO-C1-AFTER-Q1-GEMINI-2
    version: 1.0.0
    raw_manifest_sha256: 337bb286d46c8cbb46d02c5a86291bc93ee851747f647f45ef09d75ee2023fa0
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C1-AFTER-Q1-GEMINI-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C1-AFTER-Q1-GEMINI-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C1-AFTER-Q1-GEMINI
