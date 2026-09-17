---
id: ARV-GEO-C2-AFTER-Q6-PERPLEXITY-2
record_type: answer_review
status: candidate
version: 1.0.0
created_at: '2026-10-07T00:00:02.000Z'
updated_at: '2026-10-07T00:00:02.000Z'
title: Answer Review SMP-GEO-C2-AFTER-Q6-PERPLEXITY-2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.analysis:
    path: cycles/m5/analysis/C2-AFTER-Q6.json
    sha256: bf6a8dba5ef8d60aeaefa88bcaf5840ac82c7668ff081ebf0960030d6ba2918e
    model_call: MODEL-595f1bcb-bdd6-4bc5-995e-9faced5985ce
sample_ref: SMP-GEO-C2-AFTER-Q6-PERPLEXITY-2
sample_raw_manifest_sha256: 8beba6ef78a91243c9d5cf2417268398f69b47aa6e52817af47a02194591240d
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
# Answer Review SMP-GEO-C2-AFTER-Q6-PERPLEXITY-2
