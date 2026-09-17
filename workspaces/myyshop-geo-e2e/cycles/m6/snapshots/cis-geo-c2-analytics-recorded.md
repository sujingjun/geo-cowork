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
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
execution_scope: synthetic_test
merchant_ref: MER-MYYSHOP-001
knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
cycle_ref: CYC-GEO-E2E-C2
snapshot_kind: transition
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: outputs/snapshots/cis-geo-c2-analytics-recorded/manifest.json
  sha256: d8af2916ee90c3e4c7631b00faf3bf4a9a42305fee989984ca043a4a12ba4b8f
  fingerprint: 5721c642acb7e7041d72986d100cc9ef62056ac15dde2ba278da1711e20449a8
source_entries:
  - object_id: EPL-GEO-C2-OWN-1
    record_type: evidence_plan
    object_version: 1.0.0
    object_path: evidence/plans/epl-geo-c2-own-1.md
    content_sha256: 77f7fa9817029cd22399a9b9d6cba84bc5bf1c0cc8e98fe50ab467109becf65a
    file_sha256: 913088b554ef270e0d682b5ece92955d3f4a6bff5df50354653b62839365da16
    snapshot_path: outputs/snapshots/cis-geo-c2-analytics-recorded/objects/evidence/plans/epl-geo-c2-own-1.md
    snapshot_sha256: 913088b554ef270e0d682b5ece92955d3f4a6bff5df50354653b62839365da16
    entry_key: 0dbd75aa401990fd08e46aef4e1e89ced402a5fccd57d9a56669fd6df1e2b121
  - object_id: ANO-GEO-C2
    record_type: analytics_observation
    object_version: 1.0.0
    object_path: cycles/m6/analytics/ano-geo-c2.md
    content_sha256: 65421194cea985633a204dd88ab9ec5d85d9acd9c3404dedd94dab8cbff18608
    file_sha256: 2c6d2a9f4d0d1dc7e9ce17e2e1b39bae33e5205579b94c5f2e093e3c1c1c2f99
    snapshot_path: outputs/snapshots/cis-geo-c2-analytics-recorded/objects/cycles/m6/analytics/ano-geo-c2.md
    snapshot_sha256: 2c6d2a9f4d0d1dc7e9ce17e2e1b39bae33e5205579b94c5f2e093e3c1c1c2f99
    entry_key: 2955ac1de8da4bd274ab71539d742796d8ee78ad4f8d22ec4f1a7f0a6ea396d7
  - object_id: BSIG-GEO-C2
    record_type: business_signal
    object_version: 1.0.0
    object_path: cycles/m6/analytics/bsig-geo-c2.md
    content_sha256: 2c1327c1293d94e47fed4fb3502e2ba54e0201149f847835b4027e6d9c6e00dc
    file_sha256: a0ab899e7a3e17c8a372a2c81f905217fc4cb2ce783f97dfcf716e533aa77a0c
    snapshot_path: outputs/snapshots/cis-geo-c2-analytics-recorded/objects/cycles/m6/analytics/bsig-geo-c2.md
    snapshot_sha256: a0ab899e7a3e17c8a372a2c81f905217fc4cb2ce783f97dfcf716e533aa77a0c
    entry_key: c97a259b2ea91a0bc0eb702a4dfd0615883269779dd7dc86397be6adbafa1b6b
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
