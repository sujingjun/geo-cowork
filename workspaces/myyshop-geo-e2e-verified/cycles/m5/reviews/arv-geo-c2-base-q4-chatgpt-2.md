---
id: ARV-GEO-C2-BASE-Q4-CHATGPT-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-30T00:00:02.000Z'
updated_at: '2026-09-30T00:00:02.000Z'
title: Answer Review SMP-GEO-C2-BASE-Q4-CHATGPT-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C2-BASE-Q4.json
    sha256: adab350b0b9c2d530a799526d0e651e32d2b4d85cf08fcf89a02521a070280ad
    model_call: MODEL-bbf071d2-29c3-4acd-ba09-1cb3620885e0
sample_ref: SMP-GEO-C2-BASE-Q4-CHATGPT-2
sample_raw_manifest_sha256: 75758363c97785cc40f61e5b120a0419d68dcaaa9a0b8b38bef820444c485dff
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: pass
  core_fact_accuracy: pass
  current_positioning: pass
  risk_boundary: partial
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
# Answer Review SMP-GEO-C2-BASE-Q4-CHATGPT-2
