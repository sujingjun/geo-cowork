---
id: CIS-GEO-C2-PUBLICATION-CONFIRMED
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
  artifact_path: outputs/snapshots/cis-geo-c2-publication-confirmed/manifest.json
  sha256: 1cc3f7cac64e3c384cf0a09f302dcb8e41644debb79ef8b0ef9c4a51086893f3
  fingerprint: 0b945e8b3d8e5dd3e56222af0c6eddb84defa42741600fd52f2b4d5e1e47e99f
source_entries:
  - object_id: PUB-GEO-C2-OWN-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c2-own-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: b082099c6aaa7076c3e81c4a269e10eb41dea45b5b9c5bbd3ff7febd8ee64fc4
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/objects/assets/publications/pub-geo-c2-own-v2-confirmed.md
    snapshot_sha256: b082099c6aaa7076c3e81c4a269e10eb41dea45b5b9c5bbd3ff7febd8ee64fc4
    entry_key: 326d66989b8b01b7830bd830fd716a10ccee04d223f90727368137253164768c
  - object_id: PUB-GEO-C2-OFFICIAL-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c2-official-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: 83e4f4555f1843d1c6718d207b5381fb8d0b7d3583a52e79a6db8eca8b887df2
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/objects/assets/publications/pub-geo-c2-official-v2-confirmed.md
    snapshot_sha256: 83e4f4555f1843d1c6718d207b5381fb8d0b7d3583a52e79a6db8eca8b887df2
    entry_key: 9bf642cf43aa535be0e794a6469932868139e55d917a53a8e24425ededa3b29a
artifact_entries:
  - role: supporting_artifact
    source_path: assets/publications/pub-geo-c2-official-v2.md
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/pub-geo-c2-official-v2.md
    media_type: text/plain
    source_sha256: 46f4782eb19b75b834200419dbe162e4218611e5d563daa801552d26317f1cec
    snapshot_sha256: 46f4782eb19b75b834200419dbe162e4218611e5d563daa801552d26317f1cec
    entry_key: 4d84d4333165290d194949b67debc1df4dab9045c7990bb9787d139ea557b9e6
  - role: supporting_artifact
    source_path: assets/published/C2/own-readback.json
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/own-readback.json
    media_type: application/json
    source_sha256: 431e65bb0cd2b3723be29a1305d47b8c32abf948b78189464d9d31c852a2e83f
    snapshot_sha256: 431e65bb0cd2b3723be29a1305d47b8c32abf948b78189464d9d31c852a2e83f
    entry_key: 6ab2a4a65125337abe43b731ae82e81aa920d5238bbf04001fa3a7ed2fc07aae
  - role: supporting_artifact
    source_path: assets/published/C2/official-readback.json
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/official-readback.json
    media_type: application/json
    source_sha256: ae96fe4fa0a1d35784dbe44d5ac8b2170ecce9e3b6898aca4843433a305856f8
    snapshot_sha256: ae96fe4fa0a1d35784dbe44d5ac8b2170ecce9e3b6898aca4843433a305856f8
    entry_key: 83eadd9424eb87c157279c85a9964926db77406a215763acf4dc00b783d07fb7
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C2-PUBLICATION-V2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/7c0d85af28c7-OWNER-C2-PUBLICATION-V2.json
    media_type: application/json
    source_sha256: 8a873d233a0126127a3b15aa3160c726110d69dabc3b37d960c99a8040fced87
    snapshot_sha256: 8a873d233a0126127a3b15aa3160c726110d69dabc3b37d960c99a8040fced87
    entry_key: 8920d5bcc4cade37169deea073b2d83ccc1afa13fe663ae1ada806247da305d4
  - role: supporting_artifact
    source_path: reviews/decisions/OWNER-C2-PUBLICATION-V2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/a6e1b730da95-OWNER-C2-PUBLICATION-V2.json
    media_type: application/json
    source_sha256: 6899248cf79c28294a4a1fb1882d775da23d4d2ca0d66a353436253731658eb4
    snapshot_sha256: 6899248cf79c28294a4a1fb1882d775da23d4d2ca0d66a353436253731658eb4
    entry_key: 9d08cec0e25f5eace754423215c1f1752b24595565f830e9601d6b51eb7af92c
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: 9ea1a64c6c92e703b2e682d498a0ba5b79aa5c35fde54e0d3ac4986fe82cbd52
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C2-PUBLICATION-V2.md
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/OWNER-C2-PUBLICATION-V2.md
    media_type: text/plain
    source_sha256: 923d6d47e28b9a0c7dd5dc6a8532d2cb325b73e2babb85d15fbd8e50acb6adea
    snapshot_sha256: 923d6d47e28b9a0c7dd5dc6a8532d2cb325b73e2babb85d15fbd8e50acb6adea
    entry_key: b840ecffaa6ade171c624cb6afcda8019f56041c1faf8e426df47978eb4453d1
  - role: supporting_artifact
    source_path: assets/publications/pub-geo-c2-own-v2.md
    snapshot_path: outputs/snapshots/cis-geo-c2-publication-confirmed/artifacts/pub-geo-c2-own-v2.md
    media_type: text/plain
    source_sha256: 102728bb445d3d2925a5aca89be4635fd123615130f1618416df52322d139661
    snapshot_sha256: 102728bb445d3d2925a5aca89be4635fd123615130f1618416df52322d139661
    entry_key: fde862b8eef143c05b92679b0ff53f7035b91daaf9487a45ed091b2688c13bbb
pre_review_transition_snapshot_versions: []
pre_review_entry_keys: []
run_ref: RUN-GEO-E2E-C2
---
# Cycle Input Snapshot CIS-GEO-C2-PUBLICATION-CONFIRMED
