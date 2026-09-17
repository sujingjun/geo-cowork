---
id: CIS-GEO-C1-PUBLICATION-CONFIRMED
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
cycle_ref: CYC-GEO-E2E-C1
snapshot_kind: transition
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: outputs/snapshots/cis-geo-c1-publication-confirmed/manifest.json
  sha256: c0c7c7399c53739590958073d4176af15982e100c1a53b083fdde495f6503c7d
  fingerprint: 985f382c5c1a155cf3d89ede55b94b12b53e5e9d3709b341d1c0e1fff11e0535
source_entries:
  - object_id: PUB-GEO-C1-OWN-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c1-own-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: be58cde9469783baf2b9bc73ced1bbbb38994dc8f2c105d130fb7094770152ad
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/objects/assets/publications/pub-geo-c1-own-v2-confirmed.md
    snapshot_sha256: be58cde9469783baf2b9bc73ced1bbbb38994dc8f2c105d130fb7094770152ad
    entry_key: 1a7d72fe55943f805747f7402d81ab9890e02e730b7cbfbbe9603555cd7dfb31
  - object_id: PUB-GEO-C1-OFFICIAL-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c1-official-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: 755704d3ac551c13716ef245a0a3a6056a8294ceaab43acd5c39f09cac9fc01a
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/objects/assets/publications/pub-geo-c1-official-v2-confirmed.md
    snapshot_sha256: 755704d3ac551c13716ef245a0a3a6056a8294ceaab43acd5c39f09cac9fc01a
    entry_key: 268740e9796b38f622a6513d0708a883dc7f3d1d0a250e7808b2e75f4c4fc6c8
artifact_entries:
  - role: supporting_artifact
    source_path: assets/published/C1/own-readback.json
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/own-readback.json
    media_type: application/json
    source_sha256: b4e0573a9bf227ebbcb5408e5a923e9bda76c42ca9cb9ffdf68c772ddbae7f88
    snapshot_sha256: b4e0573a9bf227ebbcb5408e5a923e9bda76c42ca9cb9ffdf68c772ddbae7f88
    entry_key: 03fc59250df875e10fb56240d816afd048a00bdb4a9ebe49637fecc74bd12f84
  - role: supporting_artifact
    source_path: assets/publications/pub-geo-c1-official-v2.md
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/pub-geo-c1-official-v2.md
    media_type: text/plain
    source_sha256: ae658fb28bd7515e2ce96636e19beade8c720a269bc55160148a8131108e4936
    snapshot_sha256: ae658fb28bd7515e2ce96636e19beade8c720a269bc55160148a8131108e4936
    entry_key: 0e88401a8d19199e215212bc134bb1244cd5407e97f18d02e4287d680d82edc6
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C1-PUBLICATION-V2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/711000bf64b1-OWNER-C1-PUBLICATION-V2.json
    media_type: application/json
    source_sha256: f25e1422bd6a6fd21ec80b64c3b0176e3cbef73794767fcd4d299c161fe8202b
    snapshot_sha256: f25e1422bd6a6fd21ec80b64c3b0176e3cbef73794767fcd4d299c161fe8202b
    entry_key: 10b49372d5f5790513faf8bbc4731cc5c4203679e3e333ba92f850810e292529
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C1-PUBLICATION-V2.md
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/OWNER-C1-PUBLICATION-V2.md
    media_type: text/plain
    source_sha256: 37c6c412b933460816b93ed1916d3bd32aefc4c82241ad272403b547ede9da4b
    snapshot_sha256: 37c6c412b933460816b93ed1916d3bd32aefc4c82241ad272403b547ede9da4b
    entry_key: 7933b4a210b465821f2a056c460c819e53e893938420a4348cecf5456beb20f3
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: 7bebc79e94b39a1eaec28c8886869e3bb4795917f1e72862af20d7ae16823196
  - role: supporting_artifact
    source_path: reviews/decisions/OWNER-C1-PUBLICATION-V2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/1a28fcd94d7c-OWNER-C1-PUBLICATION-V2.json
    media_type: application/json
    source_sha256: fbd6fff3a34aaf9d4198eed36feebca3c13a69a7cc9a1403ced7cfafb850530d
    snapshot_sha256: fbd6fff3a34aaf9d4198eed36feebca3c13a69a7cc9a1403ced7cfafb850530d
    entry_key: b662aab35a1eb80e273a2520e2e964cd2244e5e2c3a444ed4ad9a26c1bde162c
  - role: supporting_artifact
    source_path: assets/publications/pub-geo-c1-own-v2.md
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/pub-geo-c1-own-v2.md
    media_type: text/plain
    source_sha256: 8f4e541e88799daec57fc270ac4b1599da57991ed727d8fce975e2af0b37d400
    snapshot_sha256: 8f4e541e88799daec57fc270ac4b1599da57991ed727d8fce975e2af0b37d400
    entry_key: c6fca9031efe0e09f49f3a08ae1c1146a82f2a4a745a22373e6caf898f719798
  - role: supporting_artifact
    source_path: assets/published/C1/official-readback.json
    snapshot_path: outputs/snapshots/cis-geo-c1-publication-confirmed/artifacts/official-readback.json
    media_type: application/json
    source_sha256: 1cbc3d4bd38f5b3f22499a01e945bec1f2811c0773a30d7cc0c1c6c2824b6c56
    snapshot_sha256: 1cbc3d4bd38f5b3f22499a01e945bec1f2811c0773a30d7cc0c1c6c2824b6c56
    entry_key: ed6820aa98f62cdc8b1a22895b8a2db06160268354712fb249c6f6448dd68447
pre_review_transition_snapshot_versions: []
pre_review_entry_keys: []
run_ref: RUN-GEO-E2E-C1
---
# Cycle Input Snapshot CIS-GEO-C1-PUBLICATION-CONFIRMED
