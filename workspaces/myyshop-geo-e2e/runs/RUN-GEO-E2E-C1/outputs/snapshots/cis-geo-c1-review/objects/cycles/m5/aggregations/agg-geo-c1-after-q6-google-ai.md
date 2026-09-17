---
id: AGG-GEO-C1-AFTER-Q6-GOOGLE-AI
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-09-24T00:00:00.000Z'
updated_at: '2026-09-24T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C1-AFTER-Q6-GOOGLE-AI
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
purpose: post_change_retest
industry: synthetic_creator_campaigns
platform: google_ai
query_cluster:
  id: CLU-GEO-C1-Q6
  label: 'Who is eligible for the rehearsal service, and what onboarding steps are required before accepting a campaign?'
  query_versions:
    - ref: Q-WHO-IS-ELIGIBLE-FOR-THE-EN-754E
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C1-AFTER
  starts_at: '2026-09-23T00:00:00.000Z'
  ends_at: '2026-09-24T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C1-AFTER-GOOGLE-AI
    version: 1.0.0
selected_sample_versions:
  - slot_key: b1ea261140ebe09cd1c6ba61a9572490e1f57eeabd058ea984a434826f279b0b
    ref: SMP-GEO-C1-AFTER-Q6-GOOGLE-AI-1
    version: 1.0.0
    raw_manifest_sha256: 3e82dfd992b7daff135e90f32d2c311210c56bc73689131e6d104b278781df5d
  - slot_key: fe47af99e3a5c451f3e31806115f783bcd5a2da3897b8aa31809a950f66c5b94
    ref: SMP-GEO-C1-AFTER-Q6-GOOGLE-AI-2
    version: 1.0.0
    raw_manifest_sha256: 6388248ae01672850362d0c62a31b3f21cfdd89f8599e61ffb453a16e293f3aa
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C1-AFTER-Q6-GOOGLE-AI-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C1-AFTER-Q6-GOOGLE-AI-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C1-AFTER-Q6-GOOGLE-AI
