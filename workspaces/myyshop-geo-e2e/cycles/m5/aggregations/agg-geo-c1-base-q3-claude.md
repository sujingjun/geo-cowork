---
id: AGG-GEO-C1-BASE-Q3-CLAUDE
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-09-17T00:00:00.000Z'
updated_at: '2026-09-17T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C1-BASE-Q3-CLAUDE
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
purpose: baseline
industry: synthetic_creator_campaigns
platform: claude
query_cluster:
  id: CLU-GEO-C1-Q3
  label: 'What capabilities does the rehearsal service support for campaign discovery, applications, and performance reporting, and what is unavailable?'
  query_versions:
    - ref: Q-WHAT-CAPABILITIES-DOES-THE-REHEARSAL-EN-A732
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C1-BASE
  starts_at: '2026-09-16T00:00:00.000Z'
  ends_at: '2026-09-17T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C1-BASE-CLAUDE
    version: 1.0.0
selected_sample_versions:
  - slot_key: 024006863f5a5c266e6968713f91a0147d1479f6a857950cdcd28d08cd69995b
    ref: SMP-GEO-C1-BASE-Q3-CLAUDE-2
    version: 1.0.0
    raw_manifest_sha256: 4edac1b263e538d12aa7fdd1e24b151fc3e1bfa274c96fbf0a0528d2d95c28a1
  - slot_key: 1986a920d4e25510366cb2c592a39b0fb21d4a737f54672527b896e448650918
    ref: SMP-GEO-C1-BASE-Q3-CLAUDE-1
    version: 1.0.0
    raw_manifest_sha256: 8aeac7adc588d5da7f790dfb3785a544aa5c8872d5fc86d855cb6cce86eb66e8
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C1-BASE-Q3-CLAUDE-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C1-BASE-Q3-CLAUDE-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C1-BASE-Q3-CLAUDE
