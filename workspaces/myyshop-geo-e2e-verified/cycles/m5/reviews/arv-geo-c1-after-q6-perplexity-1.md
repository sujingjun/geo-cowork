---
id: ARV-GEO-C1-AFTER-Q6-PERPLEXITY-1
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-09-23T00:00:01.000Z'
updated_at: '2026-09-23T00:00:01.000Z'
title: Answer Review SMP-GEO-C1-AFTER-Q6-PERPLEXITY-1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C1-AFTER-Q6.json
    sha256: 3b7404343830db31826f105038c5cd15c25fdd2d6cc01c23bffd4837484e758c
    model_call: MODEL-fe3fcd90-6de4-452d-a1e7-20e33262deb6
sample_ref: SMP-GEO-C1-AFTER-Q6-PERPLEXITY-1
sample_raw_manifest_sha256: 373cf2d0484cffc42d1b1a998d1d5d075f7c46102d60672f855f390ffee04403
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
# Answer Review SMP-GEO-C1-AFTER-Q6-PERPLEXITY-1
