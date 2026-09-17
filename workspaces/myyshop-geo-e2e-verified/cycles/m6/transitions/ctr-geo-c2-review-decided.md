---
id: CTR-GEO-C2-REVIEW-DECIDED
record_type: cycle_transition
status: recorded
version: 1.0.0
created_at: '2026-10-09T00:00:00.000Z'
updated_at: '2026-10-09T00:00:00.000Z'
title: review_waiting_human to review_decided
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
operation_id: 'CYC-GEO-E2E-C2:review_decided'
operation_fingerprint: 467d9210a9d434e4f5d5665af5791727b54c9cd55da2c1d91fc9a0fbff090cb5
expected_cycle_version: 1.0.8
input_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C2
  version: 1.0.0
gate_snapshot_version:
  ref: CIS-GEO-C2-REVIEW-DECIDED
  version: 1.0.0
from_status: waiting_human
to_status: completed
from_stage: review_waiting_human
to_stage: review_decided
required_gate_entry_keys:
  - 0583f798d88b8f272ec0f66cc5a29a90eb2f2a0a319389ea4fe8918df888945d
  - 178aec94dafe516e733fdfa9df40fb62a303d8c67f140260fd21b67e053e5485
  - 2198d813bf7e45251843cd39b243fad9a967f669cf3c73093d0b66d2a5d3da22
  - 29b80c13462c2bf27cea3a2d3b7304ea82f99810f2c555f89e27cd2feb9070be
  - a1ad7c7f15d697025b5753b0b78112d12fba9693ce0a3929042f2d1dc143704e
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C2-CYCLE-REVIEW.json'
---
# Cycle Transition CTR-GEO-C2-REVIEW-DECIDED
