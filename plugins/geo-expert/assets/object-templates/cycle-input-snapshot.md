---
id: CIS-EXAMPLE-001
record_type: cycle_input_snapshot
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
merchant_ref: MER-EXAMPLE-001
knowledge_base_ref: KBASE-EXAMPLE-DEVTEST-001
execution_scope: synthetic_test
cycle_ref: CYC-EXAMPLE-001
snapshot_kind: freeze
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: outputs/snapshots/cis-example-001/manifest.json
  sha256: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  fingerprint: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
source_entries:
  - entry_key: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    object_id: GOAL-EXAMPLE-001
    record_type: perception_goal
    object_version: 1.0.0
    object_path: cycles/preparation/goal.md
    content_sha256: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    file_sha256: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    snapshot_path: outputs/snapshots/cis-example-001/objects/goal.md
    snapshot_sha256: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
artifact_entries:
  - entry_key: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-example-001/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    snapshot_sha256: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
pre_review_transition_snapshot_versions: []
pre_review_entry_keys: []
run_ref: RUN-EXAMPLE-001
---
# Cycle Input Snapshot 模板
