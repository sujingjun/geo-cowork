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
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
operation_id: 'CYC-GEO-E2E-C2:publication_confirmed'
operation_fingerprint: 1047a59f99d39f3e8ed9deda3046056c0a5bfc91fcd62a263343a354daece81b
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
  - 001d355c9b1f1e6b82a077e4a00091ceb2b1d1d984dadf71a73109776e264470
  - 44e462c9a2bb43f632fb94500f75ef16ddfef5f5cc60eb5fe6730443630466bb
  - 8421c4b9c21acb3fa9f1a5d35981d2f44c92d66addcc82e23a1990f47272befc
  - 9504c58473471f164ec8053d3cb8bc19798549d2d4fa7b334090795396ec8c0c
  - 9ea1a64c6c92e703b2e682d498a0ba5b79aa5c35fde54e0d3ac4986fe82cbd52
  - a5db69238e325b740fb4f25be3c2d26a23bf2240567f38f5bc153c47ac76f23a
  - c14f4476d62e0015f3f38f9cb7face8e03d960765d78fb35236c16421115eff7
lease_revision: 1
actor:
  kind: fixture_human
  decision_ref: 'workspace://reviews/decisions/OWNER-C2-PUBLICATION-V2.json'
---
# Cycle Transition CTR-GEO-C2-PUBLICATION-CONFIRMED
