---
id: ARV-GEO-C1-BASE-Q5-GEMINI-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-16T00:00:02.000Z'
updated_at: '2026-09-16T00:00:02.000Z'
title: Answer Review SMP-GEO-C1-BASE-Q5-GEMINI-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C1-BASE-Q5.json
    sha256: 1b70034d1c1c86342f621e2502da31d0dd9437033f29a7b07d5486b498c6eddc
    model_call: MODEL-44ed5383-301a-4758-b842-973f412d5634
sample_ref: SMP-GEO-C1-BASE-Q5-GEMINI-2
sample_raw_manifest_sha256: 64c46415600d4ee61989fbd61d1acf1b3427712db7dd33bb19e238bb94bd7b21
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: pass
  core_fact_accuracy: pass
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
# Answer Review SMP-GEO-C1-BASE-Q5-GEMINI-2
