---
id: CTR-GEO-C1-REVIEW-DECIDED
record_type: cycle_transition
status: recorded
version: 1.0.0
created_at: '2026-09-25T00:00:00.000Z'
updated_at: '2026-09-25T00:00:00.000Z'
title: review_waiting_human to review_decided
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
cycle_ref: CYC-GEO-E2E-C1
goal_ref: GOAL-GEO-E2E-C1
operation_id: 'CYC-GEO-E2E-C1:review_decided'
operation_fingerprint: c3982fcc907f45807acf99b5b6e1f9d17bb1334d7143abc8c1eef91f8026ba24
expected_cycle_version: 1.0.8
input_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C1
  version: 1.0.0
gate_snapshot_version:
  ref: CIS-GEO-C1-REVIEW-DECIDED
  version: 1.0.0
from_status: waiting_human
to_status: completed
from_stage: review_waiting_human
to_stage: review_decided
required_gate_entry_keys:
  - 3602bfda192be06ab30da66035558490ca2cfc7f8e65fd3be0173d19fe7e0fc8
  - b9f5a2965ec525bd619203b7e1b05b0d48388ee25d881d653666f3edc31943d5
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C1-CYCLE-REVIEW.json'
---
# Cycle Transition CTR-GEO-C1-REVIEW-DECIDED
