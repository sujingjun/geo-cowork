---
id: ARV-GEO-C1-BASE-Q2-GOOGLE-AI-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-16T00:00:02.000Z'
updated_at: '2026-09-16T00:00:02.000Z'
title: Answer Review SMP-GEO-C1-BASE-Q2-GOOGLE-AI-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C1-BASE-Q2.json
    sha256: b10965be024a4d1947e6cb42ca8483ee1fd2e60248af492741f054e40ba4b514
    model_call: MODEL-185b7d07-e83a-4b94-9db3-c34ee13b49f1
sample_ref: SMP-GEO-C1-BASE-Q2-GOOGLE-AI-2
sample_raw_manifest_sha256: 8c6b206ee63f7feb994d2f224fb2cbf1ed7976474d6d040eb007793c8c106a7e
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: pass
  core_fact_accuracy: partial
  current_positioning: pass
  risk_boundary: pass
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
# Answer Review SMP-GEO-C1-BASE-Q2-GOOGLE-AI-2
