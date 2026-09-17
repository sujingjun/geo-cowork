---
id: RUN-GEO-C2-BASE-Q1-GOOGLE-AI
record_type: run
status: completed
version: 1.0.6
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: geo-answer-cycle run
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
skill: geo-answer-cycle
skill_version: 1.0.0
input_refs:
  - CPF-GEO-E2E-C2-BASE-GOOGLE-AI
  - Q-HOW-SHOULD-I-COMPARE-THE-EN-5087
  - QS-GEO-E2E-C2
input_versions:
  CPF-GEO-E2E-C2-BASE-GOOGLE-AI: 1.0.0
  Q-HOW-SHOULD-I-COMPARE-THE-EN-5087: 1.0.0
  QS-GEO-E2E-C2: 1.0.0
input_fingerprint: 42c73efc4687f81ff86729a185432ae5a0d6c815fdc14f972fbc39dc84f641a1
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
# Run RUN-GEO-C2-BASE-Q1-GOOGLE-AI
