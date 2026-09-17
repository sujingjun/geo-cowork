---
id: ARV-GEO-C1-BASE-Q3-GOOGLE-AI-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-16T00:00:02.000Z'
updated_at: '2026-09-16T00:00:02.000Z'
title: Answer Review SMP-GEO-C1-BASE-Q3-GOOGLE-AI-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C1-BASE-Q3.json
    sha256: b5d35008e3e9b3797cf7532a24f7ac69544251ee059ee0a9c180fd91d8932e4d
    model_call: MODEL-f9838c91-5763-4f95-8c25-f33385a22e05
sample_ref: SMP-GEO-C1-BASE-Q3-GOOGLE-AI-2
sample_raw_manifest_sha256: 3120960bdd1aa6542949389fd9bd2f405078ecff5cad93e5f615bc0f25292038
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
# Answer Review SMP-GEO-C1-BASE-Q3-GOOGLE-AI-2
