---
id: RUN-GEO-C2-AFTER-Q5-GOOGLE-AI
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
  - CPF-GEO-E2E-C2-AFTER-GOOGLE-AI
  - Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5
  - QS-GEO-E2E-C2
input_versions:
  CPF-GEO-E2E-C2-AFTER-GOOGLE-AI: 1.0.0
  Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5: 1.0.0
  QS-GEO-E2E-C2: 1.0.0
input_fingerprint: 6b3f4169bf1c062243c913e0414c5fe1a932d49e904d176f117d1d6c71a29046
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
# Run RUN-GEO-C2-AFTER-Q5-GOOGLE-AI
