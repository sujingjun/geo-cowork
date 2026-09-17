---
id: ARV-GEO-C1-BASE-Q1-PERPLEXITY-1
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-16T00:00:01.000Z'
updated_at: '2026-09-16T00:00:01.000Z'
title: Answer Review SMP-GEO-C1-BASE-Q1-PERPLEXITY-1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C1-BASE-Q1.json
    sha256: 7c39973f3e630d5b4dde5ad3fd15f656f8bf20f9b638ba86778e28688ab77977
    model_call: MODEL-4c7ce3f8-f0de-4c61-8cfa-da98097a8543
sample_ref: SMP-GEO-C1-BASE-Q1-PERPLEXITY-1
sample_raw_manifest_sha256: 8c2083d192b2a1a134499ea299b7a1942bc654ece1d1e9c66c50c91fd3501833
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: partial
  core_fact_accuracy: fail
  current_positioning: fail
  risk_boundary: fail
  citation_quality: not_applicable
exploratory:
  comparison_dimensions: []
  recommendation_reasons: []
  exclusion_reasons: []
  competitor_mentions: []
  source_structure_notes: []
  decision_dimension_candidates: []
reviewer:
  kind: geo_expert
  identifier: deepseek/deepseek-flash
review_required: true
---
# Answer Review SMP-GEO-C1-BASE-Q1-PERPLEXITY-1
