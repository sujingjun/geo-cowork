---
id: CTR-GEO-C2-PUBLICATION-CONFIRMED
record_type: cycle_transition
status: recorded
version: 1.0.0
created_at: '2026-10-02T00:00:00.000Z'
updated_at: '2026-10-02T00:00:00.000Z'
title: adoption_decided to publication_confirmed
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
operation_id: 'CYC-GEO-E2E-C2:publication_confirmed'
operation_fingerprint: 166c96b470a65ffb0499ff02945cd0da2f6304c47dd141400f063d09e8bcd06c
expected_cycle_version: 1.0.3
input_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C2
  version: 1.0.0
gate_snapshot_version:
  ref: CIS-GEO-C2-PUBLICATION-CONFIRMED
  version: 1.0.0
from_status: waiting_human
to_status: active
from_stage: adoption_decided
to_stage: publication_confirmed
required_gate_entry_keys:
  - 326d66989b8b01b7830bd830fd716a10ccee04d223f90727368137253164768c
  - 4d84d4333165290d194949b67debc1df4dab9045c7990bb9787d139ea557b9e6
  - 6ab2a4a65125337abe43b731ae82e81aa920d5238bbf04001fa3a7ed2fc07aae
  - 83eadd9424eb87c157279c85a9964926db77406a215763acf4dc00b783d07fb7
  - 8920d5bcc4cade37169deea073b2d83ccc1afa13fe663ae1ada806247da305d4
  - 9bf642cf43aa535be0e794a6469932868139e55d917a53a8e24425ededa3b29a
  - 9d08cec0e25f5eace754423215c1f1752b24595565f830e9601d6b51eb7af92c
  - 9ea1a64c6c92e703b2e682d498a0ba5b79aa5c35fde54e0d3ac4986fe82cbd52
  - b840ecffaa6ade171c624cb6afcda8019f56041c1faf8e426df47978eb4453d1
  - fde862b8eef143c05b92679b0ff53f7035b91daaf9487a45ed091b2688c13bbb
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C2-PUBLICATION-V2.json'
---
# Cycle Transition CTR-GEO-C2-PUBLICATION-CONFIRMED
