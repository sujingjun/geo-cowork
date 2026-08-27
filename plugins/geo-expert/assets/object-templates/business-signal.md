---
id: BSIG-EXAMPLE-001
record_type: business_signal
status: computed
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: TMT-EXAMPLE-001
  workspace_id: ws_example0000000000000000000
merchant_ref: TMT-EXAMPLE-001
cycle_ref: CYC-EXAMPLE-001
goal_ref: GOAL-EXAMPLE-001
run_ref: RUN-EXAMPLE-001
observation_versions:
  - ref: ANO-EXAMPLE-001
    version: 1.0.0
measurement_contract:
  version: 1.0.0
  artifact_path: execution/contracts/measurement-contract.json
  artifact_entry_key: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  sha256: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
rule:
  id: example-signal-rule
  version: 1.0.0
  artifact_path: execution/contracts/signal-rule.json
  artifact_entry_key: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
  sha256: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
signal_kind: ai_registration
denominator:
  definition: Synthetic AI visits.
  value: 0
  state: zero
calculation:
  value: null
  unit: registrations_per_visit
  state: insufficient_data
  explanation: Zero denominator; no ratio is computed.
causal_claim: false
---
# Business Signal 模板
