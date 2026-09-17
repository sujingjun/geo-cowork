---
id: CTR-GEO-C1-PUBLICATION-CONFIRMED
record_type: cycle_transition
status: recorded
version: 1.0.0
created_at: '2026-09-18T00:00:00.000Z'
updated_at: '2026-09-18T00:00:00.000Z'
title: adoption_decided to publication_confirmed
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
cycle_ref: CYC-GEO-E2E-C1
goal_ref: GOAL-GEO-E2E-C1
operation_id: 'CYC-GEO-E2E-C1:publication_confirmed'
operation_fingerprint: d9581a4124baad7e1057dc27b1e8db4efca63027ff0f6aa072bb919ecba6e34d
expected_cycle_version: 1.0.3
input_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C1
  version: 1.0.0
gate_snapshot_version:
  ref: CIS-GEO-C1-PUBLICATION-CONFIRMED
  version: 1.0.0
from_status: waiting_human
to_status: active
from_stage: adoption_decided
to_stage: publication_confirmed
required_gate_entry_keys:
  - 03fc59250df875e10fb56240d816afd048a00bdb4a9ebe49637fecc74bd12f84
  - 0e88401a8d19199e215212bc134bb1244cd5407e97f18d02e4287d680d82edc6
  - 10b49372d5f5790513faf8bbc4731cc5c4203679e3e333ba92f850810e292529
  - 1a7d72fe55943f805747f7402d81ab9890e02e730b7cbfbbe9603555cd7dfb31
  - 268740e9796b38f622a6513d0708a883dc7f3d1d0a250e7808b2e75f4c4fc6c8
  - 7933b4a210b465821f2a056c460c819e53e893938420a4348cecf5456beb20f3
  - 7bebc79e94b39a1eaec28c8886869e3bb4795917f1e72862af20d7ae16823196
  - b662aab35a1eb80e273a2520e2e964cd2244e5e2c3a444ed4ad9a26c1bde162c
  - c6fca9031efe0e09f49f3a08ae1c1146a82f2a4a745a22373e6caf898f719798
  - ed6820aa98f62cdc8b1a22895b8a2db06160268354712fb249c6f6448dd68447
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C1-PUBLICATION-V2.json'
---
# Cycle Transition CTR-GEO-C1-PUBLICATION-CONFIRMED
