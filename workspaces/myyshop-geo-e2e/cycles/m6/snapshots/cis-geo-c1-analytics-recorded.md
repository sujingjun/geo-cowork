---
id: CIS-GEO-C1-ANALYTICS-RECORDED
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
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
execution_scope: synthetic_test
merchant_ref: MER-MYYSHOP-001
knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
cycle_ref: CYC-GEO-E2E-C1
snapshot_kind: transition
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: outputs/snapshots/cis-geo-c1-analytics-recorded/manifest.json
  sha256: 79f35a4b31eb9615a52dc1e2fe99ca8c6db0119893fcb32390db4abde6e3bd40
  fingerprint: 6c860dcdb9688644d275645ed9fdd3a25f533fad45887e8bf30de11e82cf76c9
source_entries:
  - object_id: ANO-GEO-C1
    record_type: analytics_observation
    object_version: 1.0.0
    object_path: cycles/m6/analytics/ano-geo-c1.md
    content_sha256: 65421194cea985633a204dd88ab9ec5d85d9acd9c3404dedd94dab8cbff18608
    file_sha256: 125ce526a0213f8674fea36499d6032280ac332d7f7f4ab57b641cd6d8ff2ef8
    snapshot_path: outputs/snapshots/cis-geo-c1-analytics-recorded/objects/cycles/m6/analytics/ano-geo-c1.md
    snapshot_sha256: 125ce526a0213f8674fea36499d6032280ac332d7f7f4ab57b641cd6d8ff2ef8
    entry_key: 5f14b6fde4317def77a1a99ea0317f4f93a3a545a45d6586a54ee72740f833ce
  - object_id: EPL-GEO-C1-OFFICIAL-4
    record_type: evidence_plan
    object_version: 1.0.0
    object_path: evidence/plans/epl-geo-c1-official-4.md
    content_sha256: 77f7fa9817029cd22399a9b9d6cba84bc5bf1c0cc8e98fe50ab467109becf65a
    file_sha256: 888b781291097d96621b147bf6deda6b4f581c46e275df74bb541e9e9ec239b6
    snapshot_path: outputs/snapshots/cis-geo-c1-analytics-recorded/objects/evidence/plans/epl-geo-c1-official-4.md
    snapshot_sha256: 888b781291097d96621b147bf6deda6b4f581c46e275df74bb541e9e9ec239b6
    entry_key: c1da2e5eeaabb3808de16e4678fd81ab5f4aea4a31f8fd1cc2e9e0252b1f852c
  - object_id: BSIG-GEO-C1
    record_type: business_signal
    object_version: 1.0.0
    object_path: cycles/m6/analytics/bsig-geo-c1.md
    content_sha256: 2c1327c1293d94e47fed4fb3502e2ba54e0201149f847835b4027e6d9c6e00dc
    file_sha256: feedcac1b2efb3fd192a516a5b67f144c9664936b234ef231c6c8301733e6f13
    snapshot_path: outputs/snapshots/cis-geo-c1-analytics-recorded/objects/cycles/m6/analytics/bsig-geo-c1.md
    snapshot_sha256: feedcac1b2efb3fd192a516a5b67f144c9664936b234ef231c6c8301733e6f13
    entry_key: ea7c14bb17b5ae870540651c1b871d5a11407d69923d905a9ba30f371aa4a73c
artifact_entries:
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c1-analytics-recorded/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: bf4ba17942a4daef5519024e48c74a3a2ed972b1726821f20a6e8030009305f4
pre_review_transition_snapshot_versions: []
pre_review_entry_keys: []
run_ref: RUN-GEO-E2E-C1
---
# Cycle Input Snapshot CIS-GEO-C1-ANALYTICS-RECORDED
