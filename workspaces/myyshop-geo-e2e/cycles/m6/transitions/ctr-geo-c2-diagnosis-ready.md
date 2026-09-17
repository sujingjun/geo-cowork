---
id: CTR-GEO-C2-DIAGNOSIS-READY
record_type: cycle_transition
status: recorded
version: 1.0.0
created_at: '2026-10-01T00:00:00.000Z'
updated_at: '2026-10-01T00:00:00.000Z'
title: baseline_recorded to diagnosis_ready
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
operation_id: 'CYC-GEO-E2E-C2:diagnosis_ready'
operation_fingerprint: e72c87b05a687af6891fac7876e9b9b9579198cad81c697d2d283b12b5c0a274
expected_cycle_version: 1.0.1
input_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C2
  version: 1.0.0
gate_snapshot_version:
  ref: CIS-GEO-C2-DIAGNOSIS-READY
  version: 1.0.0
from_status: active
to_status: waiting_human
from_stage: baseline_recorded
to_stage: diagnosis_ready
required_gate_entry_keys:
  - 246a0f201f6798386d252aafb2634be88d655179b9cd03642c4b2ee5a7eda485
  - 4fbee091fcaafe1b42d31654606139626fda9b15eb70bc356b364874beb190ef
  - 5d3ab1655210bcb0427344dddfda5347f97d4031187ffa943a09be7927439a9b
  - 6a6d22000fa5d88518647485b2f7245ed768fdc11acdea8962e767e809740e40
  - 80c79c4b8982e1c4eb25d78c20a79960cfbe39ccefb6a8fd850c0250465787ff
  - 8e0027f4c963e86f236cabf39766f8c8c4b5fabdfff14cc5bb46f318b060b34e
  - a89f377c985cc0c48b8467a88485bbf630cbf06c86f300e56dd2add7dab5923e
  - c9a6a7c6df5d96d53b16900cca5b0c34fff6e69942b83df1a1a50f9231274d03
  - e2bd557005c70c60c74d737d1ffb69a3b568e58f2c8f4ba1ce1bca38a46ce5b0
  - e59b3011ac9fb0a53bd36a987ccd17f8bcfd925abd15886a6db1f727281b724e
  - e645f4fe9cf2970ec47a0c1285546f55b5c81b50f73ab72c8e858fd83e6d1758
  - ec507495f9892e1dc36b085ccf3550ea6a7878afc7af5d732354159a7e1067c8
  - eef0b15bb7dbd92087672ebdf6b5317bd7826a3af4bc015653f60084a9277ca5
lease_revision: 1
actor:
  kind: deterministic_tool
---
# Cycle Transition CTR-GEO-C2-DIAGNOSIS-READY
