---
id: ARV-GEO-C2-BASE-Q3-GEMINI-1
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-30T00:00:01.000Z'
updated_at: '2026-09-30T00:00:01.000Z'
title: Answer Review SMP-GEO-C2-BASE-Q3-GEMINI-1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C2-BASE-Q3.json
    sha256: af7753d9f13eb99d6888f88301ed035ba7837292303558b8bda0e852c028efa3
    model_call: MODEL-7f09b599-c7ba-4786-8c32-41457663b48b
sample_ref: SMP-GEO-C2-BASE-Q3-GEMINI-1
sample_raw_manifest_sha256: 758cecbde294acc50defd265ad1b4501f236db13ffc910134e9db792fe3e3036
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: partial
  core_fact_accuracy: not_applicable
  current_positioning: fail
  risk_boundary: fail
  citation_quality: fail
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
# Answer Review SMP-GEO-C2-BASE-Q3-GEMINI-1
