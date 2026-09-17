---
id: AGG-GEO-C1-BASE-Q2-GEMINI
record_type: answer_aggregation
status: computed
version: 1.0.0
created_at: '2026-09-17T00:00:00.000Z'
updated_at: '2026-09-17T00:00:00.000Z'
title: Answer Aggregation AGG-GEO-C1-BASE-Q2-GEMINI
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
purpose: baseline
industry: synthetic_creator_campaigns
platform: gemini
query_cluster:
  id: CLU-GEO-C1-Q2
  label: 'What are the fees, trial terms, and refund rules for the rehearsal service?'
  query_versions:
    - ref: Q-WHAT-ARE-THE-FEES-TRIAL-EN-BEC0
      version: 1.0.0
time_window:
  id: TW-GEO-E2E-C1-BASE
  starts_at: '2026-09-16T00:00:00.000Z'
  ends_at: '2026-09-17T00:00:00.000Z'
profile_versions:
  - ref: CPF-GEO-E2E-C1-BASE-GEMINI
    version: 1.0.0
selected_sample_versions:
  - slot_key: b058e448795a4b4c6231874dab51764272276855c6332cf84ee22e48c172e474
    ref: SMP-GEO-C1-BASE-Q2-GEMINI-2
    version: 1.0.0
    raw_manifest_sha256: a3c2f6c8dfe6395e26ac4e4104c5003c6c443a6ca0952ac83d5043f55584b1dc
  - slot_key: e4648a3dac7bb2f88663545f6eef3d85bf6f26cecb2a722aa3fd011f2f24da9b
    ref: SMP-GEO-C1-BASE-Q2-GEMINI-1
    version: 1.0.0
    raw_manifest_sha256: cdaf4ca43f21ff99709cb0416d5c2ce1fb3e7e11eb16d6a223ebf63b1a4e4e9e
citation_versions: []
source_versions: []
classification_versions: []
claim_support_review_versions: []
answer_review_versions:
  - ref: ARV-GEO-C1-BASE-Q2-GEMINI-1-REVIEWED
    version: 1.0.0
    rubric_sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
  - ref: ARV-GEO-C1-BASE-Q2-GEMINI-2-REVIEWED
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
# Answer Aggregation AGG-GEO-C1-BASE-Q2-GEMINI
