---
id: ARV-GEO-C2-AFTER-Q1-PERPLEXITY-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-10-07T00:00:02.000Z'
updated_at: '2026-10-07T00:00:02.000Z'
title: Answer Review SMP-GEO-C2-AFTER-Q1-PERPLEXITY-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C2-AFTER-Q1.json
    sha256: 11110216ede710d6118770a17f1700d16fb770f07ea01c4e43f633d697551ded
    model_call: MODEL-55e15943-8cd5-4ec6-b0f5-f73425ffc9c1
sample_ref: SMP-GEO-C2-AFTER-Q1-PERPLEXITY-2
sample_raw_manifest_sha256: 64a4d2fbe8eac64dbc225f9693a015bb176aac8acf21356b6b104b1c04bad32b
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: pass
  core_fact_accuracy: pass
  current_positioning: pass
  risk_boundary: pass
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
# Answer Review SMP-GEO-C2-AFTER-Q1-PERPLEXITY-2
