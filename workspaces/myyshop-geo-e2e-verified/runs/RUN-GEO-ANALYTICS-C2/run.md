---
id: RUN-GEO-ANALYTICS-C2
record_type: run
status: completed
version: 1.0.1
created_at: '2026-10-09T00:00:00.000Z'
updated_at: '2026-10-09T00:00:00.000Z'
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
  - CYC-GEO-E2E-C2
  - GOAL-GEO-E2E-C2
  - MER-MYYSHOP-001
input_versions:
  CYC-GEO-E2E-C2: 1.0.6
  GOAL-GEO-E2E-C2: 1.0.0
  MER-MYYSHOP-001: 1.0.0
input_fingerprint: 718fbe1ee29103b49b938f615e5a11fe7fe6df28151f8c4bd0ec04332e10f9d0
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
cycle_ref: CYC-GEO-E2E-C2
cycle_version: 1.0.6
transition_plan_sha256: 71f41e52eaebaf2bdb896a8d0de1da39f290ab0a85a1085d222c3f316966feae
lease:
  scope_key: 'CYC-GEO-E2E-C2:analytics'
  owner_id: geo-analytics-1810
  revision: 1
  acquired_at: '2026-10-09T00:00:00.000Z'
  heartbeat_at: '2026-10-09T00:00:00.000Z'
  expires_at: '2026-10-09T00:01:00.000Z'
---
# Synthetic geo-analytics Run
