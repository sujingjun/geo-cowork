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
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
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
transition_plan_sha256: 835b98c74f779b0fb901b111fc4e2580a4bbf4c8cb5c71e89e0fb10493804fbb
lease:
  scope_key: 'CYC-GEO-E2E-C1:analytics'
  owner_id: geo-analytics-98383
  revision: 1
  acquired_at: '2026-09-25T00:00:00.000Z'
  heartbeat_at: '2026-09-25T00:00:00.000Z'
  expires_at: '2026-09-25T00:01:00.000Z'
---
# Synthetic geo-analytics Run
