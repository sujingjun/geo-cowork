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
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
cycle_ref: CYC-GEO-E2E-C1
goal_ref: GOAL-GEO-E2E-C1
operation_id: 'CYC-GEO-E2E-C1:review_decided'
operation_fingerprint: 1a9ca343b5a5ed4e23769524440d5f376c67c73bee76ff361aee494a4c93cc81
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
  - 10163976de589956d7254a1aa0c2bcc602493b01072c9ad5e7097623b064ab4c
  - a8ab6f0bec63062285056aa34912f5241cf0d9fd18d9bd7a8d4ea3f73fdef870
  - b9f5a2965ec525bd619203b7e1b05b0d48388ee25d881d653666f3edc31943d5
  - d5c3d96dddf7dda32ad08ea537e140f931853a16ccefe47aafed2e5bfef56299
  - d7304514106c398d2f25d6c9f6da79f7566cbcd57818b552ba5b7ee86368b81a
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C1-CYCLE-REVIEW.json'
---
# Cycle Transition CTR-GEO-C1-REVIEW-DECIDED
