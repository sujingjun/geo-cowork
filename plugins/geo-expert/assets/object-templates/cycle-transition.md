---
id: CTR-EXAMPLE-001
record_type: cycle_transition
status: recorded
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-EXAMPLE-001
  workspace_id: ws_example0000000000000000000
  knowledge_base_ref: KBASE-EXAMPLE-DEVTEST-001
cycle_ref: CYC-EXAMPLE-001
goal_ref: GOAL-EXAMPLE-001
operation_id: example-operation-001
operation_fingerprint: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
expected_cycle_version: 1.0.0
input_snapshot_version:
  ref: CIS-EXAMPLE-001
  version: 1.0.0
gate_snapshot_version:
  ref: CIS-EXAMPLE-GATE-001
  version: 1.0.0
from_status: active
to_status: active
from_stage: frozen
to_stage: baseline_recorded
required_gate_entry_keys:
  - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
lease_revision: 1
actor:
  kind: deterministic_tool
---
# Cycle Transition 模板
