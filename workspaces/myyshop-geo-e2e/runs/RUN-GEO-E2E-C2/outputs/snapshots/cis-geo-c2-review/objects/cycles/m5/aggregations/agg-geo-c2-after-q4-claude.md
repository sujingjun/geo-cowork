---
id: AGG-GEO-C2-AFTER-Q4-CLAUDE
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-08T00:00:00.000Z'
updated_at: '2026-10-08T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-AFTER-Q4-CLAUDE
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
purpose: post_change_retest
industry: synthetic_creator_campaigns
platform: claude
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
  - ref: CPF-GEO-E2E-C2-AFTER-CLAUDE
    version: 1.0.0
selected_sample_versions:
  - slot_key: 4c41205a485ea1c14d0f3b8623c6026ab29eb5b3be6f162a67a7f53639ba8136
    ref: SMP-GEO-C2-AFTER-Q4-CLAUDE-1
    version: 1.0.0
    raw_manifest_sha256: e22d1b88d769455d89f60474b3630f2cbfea46b5c112b5bd5de68a8e334b9fff
  - slot_key: 50ab2ad77724a011c84903ef2272d1a96d49adecc9ddb18b08f7d591ca194312
    ref: SMP-GEO-C2-AFTER-Q4-CLAUDE-2
    version: 1.0.0
    raw_manifest_sha256: 9a8909e8e5c10d7f2cae4a320691ae2a0f8cd815ec6708d5dedd79f3df0a96dc
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-AFTER-Q4-CLAUDE-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-AFTER-Q4-CLAUDE-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-AFTER-Q4-CLAUDE
