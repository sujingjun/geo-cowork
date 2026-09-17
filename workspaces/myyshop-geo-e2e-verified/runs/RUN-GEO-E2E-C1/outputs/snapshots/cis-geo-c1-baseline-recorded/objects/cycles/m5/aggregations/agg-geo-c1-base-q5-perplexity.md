---
id: AGG-GEO-C1-BASE-Q5-PERPLEXITY
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-09-17T00:00:00.000Z'
updated_at: '2026-09-17T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C1-BASE-Q5-PERPLEXITY
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
purpose: baseline
industry: synthetic_creator_campaigns
platform: perplexity
query_cluster:
  id: CLU-GEO-C1-Q5
  label: 'What is the MyyShop rehearsal service, and who is it designed for?'
  query_versions:
    - ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-2B21
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C1-BASE
  starts_at: '2026-09-16T00:00:00.000Z'
  ends_at: '2026-09-17T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C1-BASE-PERPLEXITY
    version: 1.0.0
selected_sample_versions:
  - slot_key: 233984865e6398bab6fcde18915dd50813fc53356b7d45bb3f3f5890865f037a
    ref: SMP-GEO-C1-BASE-Q5-PERPLEXITY-2
    version: 1.0.0
    raw_manifest_sha256: 4fd08daff7a5a2b60f52ae44e64ff92bf2f6b7821e5487a702814f0593e144c9
  - slot_key: e7166c38b0581cf0832b84929e18e3c066f2fd487686e8a7c0de243f0c339a8a
    ref: SMP-GEO-C1-BASE-Q5-PERPLEXITY-1
    version: 1.0.0
    raw_manifest_sha256: b7c4311c83cd09ca346bb27538dcd49e67eaeb03cfb712d697239cfefaf7a5b0
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C1-BASE-Q5-PERPLEXITY-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C1-BASE-Q5-PERPLEXITY-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C1-BASE-Q5-PERPLEXITY
