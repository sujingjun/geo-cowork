---
id: CIS-GEO-C2-ADOPTION-DECIDED
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
  artifact_path: outputs/snapshots/cis-geo-c2-adoption-decided/manifest.json
  sha256: ba546ac9909f49828c3a30ecf0366ad854a502c5f4cf6385138ffd33738f6052
  fingerprint: d1e987461ddd22e78181d4ee5d2d6607570080771cf98e787a25c4aebe91205b
source_entries:
  - object_id: ADR-GEO-C2-OFFICIAL-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c2-official-decided.md
    content_sha256: 78c7abebdf53b2231049fd54193f3ba0a10ea10289042a89267d911e4a3d79a9
    file_sha256: 544632ae36effef78afad45f922f9c19247c24e92ec1c8feeb172d4b9c235a84
    snapshot_path: outputs/snapshots/cis-geo-c2-adoption-decided/objects/assets/adoptions/adr-geo-c2-official-decided.md
    snapshot_sha256: 544632ae36effef78afad45f922f9c19247c24e92ec1c8feeb172d4b9c235a84
    entry_key: 52a889c0207db02ad6b7fa256de394102dd2883d4d7968111f996c510e05d016
  - object_id: ADR-GEO-C2-THIRD-PARTY-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c2-third-party-decided.md
    content_sha256: 3c61a8315b3065c010b30771ca5c09f1fc9719896921af90602faa62f68263dc
    file_sha256: 82166b6d2338de582d83a9673a1c1be6b97e950c9957d3c4b649f3598718a216
    snapshot_path: outputs/snapshots/cis-geo-c2-adoption-decided/objects/assets/adoptions/adr-geo-c2-third-party-decided.md
    snapshot_sha256: 82166b6d2338de582d83a9673a1c1be6b97e950c9957d3c4b649f3598718a216
    entry_key: 75cad8697bffd63e8abcbdd1be5cc516d5c36940771065d594dc5e6df3f7d8f5
  - object_id: ADR-GEO-C2-OWN-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c2-own-decided.md
    content_sha256: c79972ba5f8a3d45da8f7afb399dc60cb0d93a5552ef1ae89c4b66df7efd6bb1
    file_sha256: 6aabaac3c430b64686a1cde2f087b097e3cd08f95e5b3cd2ccc9b65cfe96a599
    snapshot_path: outputs/snapshots/cis-geo-c2-adoption-decided/objects/assets/adoptions/adr-geo-c2-own-decided.md
    snapshot_sha256: 6aabaac3c430b64686a1cde2f087b097e3cd08f95e5b3cd2ccc9b65cfe96a599
    entry_key: a64b9a7cad2f376aa73275548a3bdf246ac9df667f28ad42acdea7e14130ce2d
artifact_entries:
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c2-adoption-decided/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: 76f6018e1d2c0019a35308457e210a08633ea22ca8c603ac8c79d4f6fb3b3bde
pre_review_transition_snapshot_versions: []
pre_review_entry_keys: []
run_ref: RUN-GEO-E2E-C2
---
# Cycle Input Snapshot CIS-GEO-C2-ADOPTION-DECIDED
