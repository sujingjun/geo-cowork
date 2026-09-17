---
id: RUN-GEO-C1-AFTER-Q6-GOOGLE-AI
record_type: run
status: completed
version: 1.0.6
created_at: '2026-09-23T00:00:00.000Z'
updated_at: '2026-09-23T00:00:00.000Z'
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
  - CPF-GEO-E2E-C1-AFTER-GOOGLE-AI
  - Q-WHO-IS-ELIGIBLE-TO-USE-EN-1531
  - QS-GEO-E2E-C1
input_versions:
  CPF-GEO-E2E-C1-AFTER-GOOGLE-AI: 1.0.0
  Q-WHO-IS-ELIGIBLE-TO-USE-EN-1531: 1.0.0
  QS-GEO-E2E-C1: 1.0.0
input_fingerprint: a3cd4e37001a4b8fb222aa3de38d9c95fccc7dc8fcff74bb8308d5b9644c43de
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
# Run RUN-GEO-C1-AFTER-Q6-GOOGLE-AI
