---
id: CTR-GEO-C2-ADOPTION-DECIDED
record_type: cycle_transition
status: recorded
version: 1.0.0
created_at: '2026-10-01T00:00:00.000Z'
updated_at: '2026-10-01T00:00:00.000Z'
title: diagnosis_ready to adoption_decided
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
operation_id: 'CYC-GEO-E2E-C2:adoption_decided'
operation_fingerprint: ff26191740f90973f1e2ed4da736fe8bd9b85ff9380782f61180437ddb00b968
expected_cycle_version: 1.0.2
input_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C2
  version: 1.0.0
gate_snapshot_version:
  ref: CIS-GEO-C2-ADOPTION-DECIDED
  version: 1.0.0
from_status: waiting_human
to_status: waiting_human
from_stage: diagnosis_ready
to_stage: adoption_decided
required_gate_entry_keys:
  - 52a889c0207db02ad6b7fa256de394102dd2883d4d7968111f996c510e05d016
  - 75cad8697bffd63e8abcbdd1be5cc516d5c36940771065d594dc5e6df3f7d8f5
  - 76f6018e1d2c0019a35308457e210a08633ea22ca8c603ac8c79d4f6fb3b3bde
  - a64b9a7cad2f376aa73275548a3bdf246ac9df667f28ad42acdea7e14130ce2d
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C2-ADOPTION.json'
---
# Cycle Transition CTR-GEO-C2-ADOPTION-DECIDED
