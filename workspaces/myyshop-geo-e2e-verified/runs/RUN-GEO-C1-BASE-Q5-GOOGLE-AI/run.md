---
id: RUN-GEO-C1-BASE-Q5-GOOGLE-AI
record_type: run
status: completed
version: 1.0.6
created_at: '2026-09-16T00:00:00.000Z'
updated_at: '2026-09-16T00:00:00.000Z'
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
  - CPF-GEO-E2E-C1-BASE-GOOGLE-AI
  - Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-2B21
  - QS-GEO-E2E-C1
input_versions:
  CPF-GEO-E2E-C1-BASE-GOOGLE-AI: 1.0.0
  Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-2B21: 1.0.0
  QS-GEO-E2E-C1: 1.0.0
input_fingerprint: 9935bf932bb99bcbf4a2d8433af9e8af43bfcdc095fe6c86f9bc4250a2ab6b6d
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
# Run RUN-GEO-C1-BASE-Q5-GOOGLE-AI
