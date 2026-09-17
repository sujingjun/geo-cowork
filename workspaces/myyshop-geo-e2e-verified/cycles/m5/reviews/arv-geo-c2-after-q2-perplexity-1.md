---
id: ARV-GEO-C2-AFTER-Q2-PERPLEXITY-1
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-10-07T00:00:01.000Z'
updated_at: '2026-10-07T00:00:01.000Z'
title: Answer Review SMP-GEO-C2-AFTER-Q2-PERPLEXITY-1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C2-AFTER-Q2.json
    sha256: dc9349db4455a777674881984b02c00ef2f86b86dcda0a4f9d5f9ace98468ddd
    model_call: MODEL-c1898156-5457-4fc9-b730-445d0349e2f8
sample_ref: SMP-GEO-C2-AFTER-Q2-PERPLEXITY-1
sample_raw_manifest_sha256: fc18fa63f1e88ea3662ef5bfa044ed6bf3ed1745d9b306d650f7b7cbc97c27db
rubric:
  version: 1.0.0
  sha256: 4168d5f1c3c65cedb003985a7505b729bf45f2128e520a0bb807acba94415007
claim_support_review_refs: []
core:
  entity_recognition: pass
  core_fact_accuracy: pass
  current_positioning: pass
  risk_boundary: pass
  citation_quality: partial
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
# Answer Review SMP-GEO-C2-AFTER-Q2-PERPLEXITY-1
