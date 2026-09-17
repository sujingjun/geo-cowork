---
id: ARV-GEO-C2-BASE-Q2-CHATGPT-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-30T00:00:02.000Z'
updated_at: '2026-09-30T00:00:02.000Z'
title: Answer Review SMP-GEO-C2-BASE-Q2-CHATGPT-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C2-BASE-Q2.json
    sha256: 5924b91eb37b72e0008e61e4129c3a19b86cce7861e8abdfe006e0560d635e51
    model_call: MODEL-de7f7557-4964-44e8-90ba-567b4ee4739e
sample_ref: SMP-GEO-C2-BASE-Q2-CHATGPT-2
sample_raw_manifest_sha256: b85477676fa12589eaf6be5d259a41877906470111629dd4e2d7eb467693c0a7
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: pass
  core_fact_accuracy: partial
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
# Answer Review SMP-GEO-C2-BASE-Q2-CHATGPT-2
