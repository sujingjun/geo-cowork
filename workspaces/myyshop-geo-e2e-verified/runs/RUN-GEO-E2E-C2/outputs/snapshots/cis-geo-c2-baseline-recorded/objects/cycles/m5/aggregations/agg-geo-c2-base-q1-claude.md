---
id: AGG-GEO-C2-BASE-Q1-CLAUDE
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-10-01T00:00:00.000Z'
updated_at: '2026-10-01T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C2-BASE-Q1-CLAUDE
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
purpose: baseline
industry: synthetic_creator_campaigns
platform: claude
query_cluster:
  id: CLU-GEO-C2-Q1
  label: 'How should an eligible creator compare the MyyShop rehearsal with other creator campaign services by eligibility, workflow, fees, evidence, and limitations?'
  query_versions:
    - ref: Q-HOW-SHOULD-AN-ELIGIBLE-CREATOR-EN-D279
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C2-BASE
  starts_at: '2026-09-30T00:00:00.000Z'
  ends_at: '2026-10-01T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C2-BASE-CLAUDE
    version: 1.0.0
selected_sample_versions:
  - slot_key: ad16d8a0bfb7efa3dc89e3f9d4481a64ffa2ca279ca3d825debe8ab9829547a0
    ref: SMP-GEO-C2-BASE-Q1-CLAUDE-2
    version: 1.0.0
    raw_manifest_sha256: e0bb6679712b9c55d12fab62f20c47a6c2e4f63e27bd642022b9ca2027a03246
  - slot_key: c07762d6ee92ec03e4aa2c8aee945bfb7ebeb1cffb06a24315485df729c62926
    ref: SMP-GEO-C2-BASE-Q1-CLAUDE-1
    version: 1.0.0
    raw_manifest_sha256: 44d06fb1d7f7d45c2a0dc4e9628e3ab6c05f263480ab4ecdcfd7a64d402488f6
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C2-BASE-Q1-CLAUDE-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C2-BASE-Q1-CLAUDE-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C2-BASE-Q1-CLAUDE
