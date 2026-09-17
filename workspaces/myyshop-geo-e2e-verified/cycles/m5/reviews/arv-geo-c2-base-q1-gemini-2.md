---
id: ARV-GEO-C2-BASE-Q1-GEMINI-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-30T00:00:02.000Z'
updated_at: '2026-09-30T00:00:02.000Z'
title: Answer Review SMP-GEO-C2-BASE-Q1-GEMINI-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C2-BASE-Q1.json
    sha256: 2354285f153c89704d85d47e70d6476ae0276bc6b13134e36d01a489b7ea23d1
    model_call: MODEL-835733ee-78a4-4798-b60c-f591cca4fd80
sample_ref: SMP-GEO-C2-BASE-Q1-GEMINI-2
sample_raw_manifest_sha256: 5a4cbadd446c36d7e1aced3a92ebfa281b123a7477e3d670481c8826bb94a201
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: pass
  core_fact_accuracy: pass
  current_positioning: pass
  risk_boundary: partial
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
# Answer Review SMP-GEO-C2-BASE-Q1-GEMINI-2
