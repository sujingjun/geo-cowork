---
id: RUN-GEO-C2-AFTER-Q6-PERPLEXITY
record_type: run
status: completed
version: 1.0.6
created_at: '2026-10-07T00:00:00.000Z'
updated_at: '2026-10-07T00:00:00.000Z'
title: geo-answer-cycle run
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
skill: geo-answer-cycle
skill_version: 1.0.0
input_refs:
  - CPF-GEO-E2E-C2-AFTER-PERPLEXITY
  - Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
  - QS-GEO-E2E-C2
input_versions:
  CPF-GEO-E2E-C2-AFTER-PERPLEXITY: 1.0.0
  Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A: 1.0.0
  QS-GEO-E2E-C2: 1.0.0
input_fingerprint: 7f65797b43ca89826499a916780a365f5e8464458db1186e59b5d09a4b0c71e3
completed_steps:
  - raw_received
  - real_model_extraction
  - sample_materialized
output_artifacts:
  - raw/answer-1.txt
  - raw/answer-2.txt
  - raw/collector-1.json
  - raw/collector-2.json
business_result: not_evaluated
next_action: start
finding_refs: []
evidence_refs: []
asset_refs: []
failure_reason: null
---
# Run RUN-GEO-C2-AFTER-Q6-PERPLEXITY
