---
id: RUN-GEO-ANALYTICS-C1
record_type: run
status: completed
version: 1.0.1
created_at: '2026-09-25T00:00:00.000Z'
updated_at: '2026-09-25T00:00:00.000Z'
title: Synthetic geo-analytics Run
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
skill: geo-analytics
skill_version: 1.0.0
input_refs:
  - CYC-GEO-E2E-C1
  - GOAL-GEO-E2E-C1
  - MER-MYYSHOP-001
input_versions:
  CYC-GEO-E2E-C1: 1.0.6
  GOAL-GEO-E2E-C1: 1.0.0
  MER-MYYSHOP-001: 1.0.0
input_fingerprint: acdae28602a089b45cc8956f136164b8fa087c12cbeafa7f23f7d5f85df33e90
completed_steps:
  - fixture_input_validated
  - observation_recorded
  - signal_computed
output_artifacts:
  - raw/analytics.json
business_result: partial
next_action: advance analytics gate
finding_refs: []
evidence_refs: []
asset_refs: []
failure_reason: null
merchant_ref: MER-MYYSHOP-001
cycle_ref: CYC-GEO-E2E-C1
cycle_version: 1.0.6
transition_plan_sha256: f87b09892adf216b94c5e1a38d86e3f089a642eec276f7cb72b607d36204e693
lease:
  scope_key: 'CYC-GEO-E2E-C1:analytics'
  owner_id: geo-analytics-73877
  revision: 1
  acquired_at: '2026-09-25T00:00:00.000Z'
  heartbeat_at: '2026-09-25T00:00:00.000Z'
  expires_at: '2026-09-25T00:01:00.000Z'
---
# Synthetic geo-analytics Run
