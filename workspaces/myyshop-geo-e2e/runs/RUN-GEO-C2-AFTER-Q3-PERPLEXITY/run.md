---
id: RUN-GEO-C2-AFTER-Q3-PERPLEXITY
record_type: run
status: completed
version: 1.0.6
created_at: '2026-10-07T00:00:00.000Z'
updated_at: '2026-10-07T00:00:00.000Z'
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
  - CPF-GEO-E2E-C2-AFTER-PERPLEXITY
  - Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271
  - QS-GEO-E2E-C2
input_versions:
  CPF-GEO-E2E-C2-AFTER-PERPLEXITY: 1.0.0
  Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271: 1.0.0
  QS-GEO-E2E-C2: 1.0.0
input_fingerprint: 52d35290dd930dbcf5bec59cde8bdb0dc96e1352350801ea84f03917a7c936dd
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
# Run RUN-GEO-C2-AFTER-Q3-PERPLEXITY
