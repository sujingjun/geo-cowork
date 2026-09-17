---
id: CIS-GEO-C2-ANALYTICS-RECORDED
record_type: cycle_input_snapshot
status: recorded
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: transition cycle input snapshot
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
execution_scope: synthetic_test
merchant_ref: MER-MYYSHOP-001
knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
cycle_ref: CYC-GEO-E2E-C2
snapshot_kind: transition
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: outputs/snapshots/cis-geo-c2-analytics-recorded/manifest.json
  sha256: cc89ebc2ac33bc8c5fd78ce8accb8f5c52e1963a9c0ab0032453b7313a11f495
  fingerprint: 5dc9f25e64070ca208d0c716ebc75802c813b05f8eff6f42dcc33df6cdcdd7a6
source_entries:
  - object_id: ANO-GEO-C2
    record_type: analytics_observation
    object_version: 1.0.0
    object_path: cycles/m6/analytics/ano-geo-c2.md
    content_sha256: 65421194cea985633a204dd88ab9ec5d85d9acd9c3404dedd94dab8cbff18608
    file_sha256: 1aa23f9d89a99d83f09eff6224b3fb74e6ba2478b79fb424731560c4598de8df
    snapshot_path: outputs/snapshots/cis-geo-c2-analytics-recorded/objects/cycles/m6/analytics/ano-geo-c2.md
    snapshot_sha256: 1aa23f9d89a99d83f09eff6224b3fb74e6ba2478b79fb424731560c4598de8df
    entry_key: 5260fd48a50f7da388b9f0512a29783e83fc34dab77d9c1a336d02dfb7b997cc
  - object_id: EPL-GEO-C2-OWN-2
    record_type: evidence_plan
    object_version: 1.0.0
    object_path: evidence/plans/epl-geo-c2-own-2.md
    content_sha256: 77f7fa9817029cd22399a9b9d6cba84bc5bf1c0cc8e98fe50ab467109becf65a
    file_sha256: a519752ff7a074974108823029e7edd4df6d21b36ad00f1e03840356f14f62f8
    snapshot_path: outputs/snapshots/cis-geo-c2-analytics-recorded/objects/evidence/plans/epl-geo-c2-own-2.md
    snapshot_sha256: a519752ff7a074974108823029e7edd4df6d21b36ad00f1e03840356f14f62f8
    entry_key: a34894944cad4f59494547bf90cfcdfdbcf5a1ca61ef39e39f85e148d72fe364
  - object_id: BSIG-GEO-C2
    record_type: business_signal
    object_version: 1.0.0
    object_path: cycles/m6/analytics/bsig-geo-c2.md
    content_sha256: 2c1327c1293d94e47fed4fb3502e2ba54e0201149f847835b4027e6d9c6e00dc
    file_sha256: ffa1789d7ace1ddf974dafeb5f572d4b8b703b5c31f63d1d5bd6248fc48805ec
    snapshot_path: outputs/snapshots/cis-geo-c2-analytics-recorded/objects/cycles/m6/analytics/bsig-geo-c2.md
    snapshot_sha256: ffa1789d7ace1ddf974dafeb5f572d4b8b703b5c31f63d1d5bd6248fc48805ec
    entry_key: b03c9d12fd307f17a1f79abb944392dca6fe6a9a1fe648bec9feb069a3d33453
artifact_entries:
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c2-analytics-recorded/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: f45e367c425679d6a572135f4aa9ae24c47f9e9dc5e3e5b31ec6769273330473
pre_review_transition_snapshot_versions: []
pre_review_entry_keys: []
run_ref: RUN-GEO-E2E-C2
---
# Cycle Input Snapshot CIS-GEO-C2-ANALYTICS-RECORDED
