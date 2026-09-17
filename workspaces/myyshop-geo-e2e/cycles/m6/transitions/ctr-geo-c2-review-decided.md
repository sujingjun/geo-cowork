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
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
operation_id: 'CYC-GEO-E2E-C2:review_decided'
operation_fingerprint: 8625854efa4b0435e35fbae6de9585043252c6e4452ef326f87dd71d5fa1113d
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
  - 29b80c13462c2bf27cea3a2d3b7304ea82f99810f2c555f89e27cd2feb9070be
  - 93b81c26f6cc11d5bdac9a92354a36fe1c1478af5fea5dbff67231a335f09e67
  - b35ad97e2f1ff09e44c7df9ea0e108955d8c48f895856dfc4ef059d34bce459e
  - bfae737aba81166cca5022dec0fd46f0aa0f828c616aa11031fd73523437cffb
  - f70bd0d230e68505091b7371756ea8aef480ec87a1fcf6dc06e02314a6dcf553
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C2-CYCLE-REVIEW.json'
---
# Cycle Transition CTR-GEO-C2-REVIEW-DECIDED
