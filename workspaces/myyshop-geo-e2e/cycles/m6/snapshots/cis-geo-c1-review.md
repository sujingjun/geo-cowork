---
id: CIS-GEO-C1-REVIEW
record_type: cycle_input_snapshot
status: recorded
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: review cycle input snapshot
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
snapshot_kind: review
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: outputs/snapshots/cis-geo-c1-review/manifest.json
  sha256: e84ff50fd73b8817e7209c89aa644d27f6c0ae2a6525316d7cd813aa4f6bb8e3
  fingerprint: 268dae3755fc071939e7ce154c2b0f5509ed40d27f328904df64b6665ebcace8
source_entries:
  - object_id: SMP-GEO-C1-AFTER-Q1-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 384614cf5bb613c6819dd7aa56b505817a1fd6c6943a6e6f14bc568cef93d1ce
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-claude-2.md
    snapshot_sha256: 384614cf5bb613c6819dd7aa56b505817a1fd6c6943a6e6f14bc568cef93d1ce
    entry_key: 0028aeca91db61a4b52092982e070d949ffeea4a69de90a85712c8fb83acae76
  - object_id: BSIG-GEO-C1
    record_type: business_signal
    object_version: 1.0.0
    object_path: cycles/m6/analytics/bsig-geo-c1.md
    content_sha256: 2c1327c1293d94e47fed4fb3502e2ba54e0201149f847835b4027e6d9c6e00dc
    file_sha256: feedcac1b2efb3fd192a516a5b67f144c9664936b234ef231c6c8301733e6f13
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m6/analytics/bsig-geo-c1.md
    snapshot_sha256: feedcac1b2efb3fd192a516a5b67f144c9664936b234ef231c6c8301733e6f13
    entry_key: 003cc2b08f414f6053217396448af25e7262c9ac57b20dd4b0a7ebf32be53413
  - object_id: SRC-GEO-E2E-IDENTITY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-identity.md
    content_sha256: a72644835b1a7648ba95871bc7c874b7646ff9247675d45295e09105a2a124fa
    file_sha256: ca7d2051a822b32292915f81027d87bca479f41023869f6efd59204b87221fb5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-identity.md
    snapshot_sha256: ca7d2051a822b32292915f81027d87bca479f41023869f6efd59204b87221fb5
    entry_key: 009787bebd844bdab7f10b94b450e7c66db1c5a1c574f3bd5c9add1be92fe7c7
  - object_id: ARV-GEO-C1-BASE-Q3-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-2-reviewed.md
    content_sha256: 9897b35b2d4f9c2ec0bb5933815c735afa0905823c27eb317931ffa33229e176
    file_sha256: c370e9601ed8d1f8782bfca5a3a22bf2ee67d88ce8e2afb4b9f57281d2baa0ad
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-2-reviewed.md
    snapshot_sha256: c370e9601ed8d1f8782bfca5a3a22bf2ee67d88ce8e2afb4b9f57281d2baa0ad
    entry_key: 013f447e9788b5d60b2dac8dd71ecdd04c31d9534bf7802ea00d7000926f4323
  - object_id: DOC-GEO-E2E-FEES
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-fees.md
    content_sha256: 6f69e3de1b0410a5e174120dcba0127654e747d711ab3789419bf7a740b562aa
    file_sha256: 5bdfcd34d66c4357177f5489d53e2269475db20670489a6cb72ff75090e04e84
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-fees.md
    snapshot_sha256: 5bdfcd34d66c4357177f5489d53e2269475db20670489a6cb72ff75090e04e84
    entry_key: 021b3234bf6b628d6b058ff750845dcb4751f6b95babc16498cb747b51df132f
  - object_id: SMP-GEO-C1-BASE-Q1-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: aa311fc097d70b55cae3eb193e31f0c0003898059dbbd6c0fec49a7435b8584e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-2.md
    snapshot_sha256: aa311fc097d70b55cae3eb193e31f0c0003898059dbbd6c0fec49a7435b8584e
    entry_key: 02ca4d66fca24d3ab0dc1faef200e20b01b39d881b99211c1cf24757b591e2ee
  - object_id: SMP-GEO-C1-AFTER-Q3-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 3442ba8f66d680feee49d20f78d1c643facc1efabf1ecda3adc034460cc8e0eb
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-chatgpt-1.md
    snapshot_sha256: 3442ba8f66d680feee49d20f78d1c643facc1efabf1ecda3adc034460cc8e0eb
    entry_key: 04e198b27c0e33b1d77b4fc82b1cd33f64109357e72aedaf89ebec89fc9e9f05
  - object_id: EPL-GEO-C1-OFFICIAL-4
    record_type: evidence_plan
    object_version: 1.0.0
    object_path: evidence/plans/epl-geo-c1-official-4.md
    content_sha256: 77f7fa9817029cd22399a9b9d6cba84bc5bf1c0cc8e98fe50ab467109becf65a
    file_sha256: 888b781291097d96621b147bf6deda6b4f581c46e275df74bb541e9e9ec239b6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/plans/epl-geo-c1-official-4.md
    snapshot_sha256: 888b781291097d96621b147bf6deda6b4f581c46e275df74bb541e9e9ec239b6
    entry_key: 0542a2f2a4874ef7f7c92d7a43df2941cfbe15126a0089e948662975fd2ab325
  - object_id: SMP-GEO-C1-AFTER-Q2-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 317aaf73ec58876bee347ce8e35dc7ca63a4e79e9be25229b96b8d62462d80ff
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-google-ai-1.md
    snapshot_sha256: 317aaf73ec58876bee347ce8e35dc7ca63a4e79e9be25229b96b8d62462d80ff
    entry_key: 06aa62550da6027cd37c6e31c190a9ea41eccc4e88fd7d57735811607ecebeb1
  - object_id: SRC-GEO-E2E-VOICE
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-voice.md
    content_sha256: 4572ad641758c23474309fd0917192b0a55daa34e6bc97c3b8ca3e18c2e67004
    file_sha256: 156bfbc8840357db69a1c20b21d95aae3f97020e0c8a77889c005c82c0f9031c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-voice.md
    snapshot_sha256: 156bfbc8840357db69a1c20b21d95aae3f97020e0c8a77889c005c82c0f9031c
    entry_key: 071f53eca5bd648f443760ebc01b126d21b67f5224be0ace9b829605a3cab030
  - object_id: FND-GEO-SITE-C1-AFTER-OWN-SCHEMA-SYNTAX
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-own-schema-syntax.md
    content_sha256: f75f3e8d00e214448464a9a652c802996e26bec05b316753ba053efd15dc4376
    file_sha256: d82f6f4ebfc6acf177f9dd0cd978d0c5ecd1f9254b11a3d23b5eec7807a6935a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-own-schema-syntax.md
    snapshot_sha256: d82f6f4ebfc6acf177f9dd0cd978d0c5ecd1f9254b11a3d23b5eec7807a6935a
    entry_key: 07a25213958aba00d64bb5bfed78b06794dfe43eeda10809d389729ee2fa2567
  - object_id: ARV-GEO-C1-AFTER-Q1-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-chatgpt-2-reviewed.md
    content_sha256: 8370654f16f4f6a1c663dbef66b6d5d904fbc04bef89ece2fde2a41ae4829d05
    file_sha256: 8b24afd2f927f334531d6ae52ce03f738a9d9a74ecbe86aa45176edbdd258c93
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-chatgpt-2-reviewed.md
    snapshot_sha256: 8b24afd2f927f334531d6ae52ce03f738a9d9a74ecbe86aa45176edbdd258c93
    entry_key: 09be9d6938b5d52b6f2ea0522d3483a772ba9d2b8ebb55fbb0110ca415d96dfc
  - object_id: GOAL-GEO-E2E-C1
    record_type: perception_goal
    object_version: 1.0.0
    object_path: cycles/preparation/goal-c1.md
    content_sha256: 6683f801dda8f589230d70f77c84758977491e096a99645bd639892c6a2d8f9a
    file_sha256: 6ccfc26cc6b8a20a3bff2b0b4361f85dd596163e8abd211b58d132d55f214187
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/preparation/goal-c1.md
    snapshot_sha256: 6ccfc26cc6b8a20a3bff2b0b4361f85dd596163e8abd211b58d132d55f214187
    entry_key: 09c8374ea6476a76aca7e004999605a33a81aa7cf4d17d53e9d3fa45991c4d63
  - object_id: SMP-GEO-C1-BASE-Q4-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1fb193d91453ce6578cc1eda50b013abf2dabfe1384074434f3068b5617ff75f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-1.md
    snapshot_sha256: 1fb193d91453ce6578cc1eda50b013abf2dabfe1384074434f3068b5617ff75f
    entry_key: 09d7d87708530a8cfb817314acfc69f7c6653b7e318bd811baf91e96e4f9f9f7
  - object_id: ARV-GEO-C1-BASE-Q4-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-1-reviewed.md
    content_sha256: e53b76e17146774990ae5792a4d25b2b4ec8c786f4558ecec5a0e5b2d8c07816
    file_sha256: 442183ace95064338ab9c3d6acfe2807afe8cf0a8fd9d7e6a127f5455b1cc2c6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-1-reviewed.md
    snapshot_sha256: 442183ace95064338ab9c3d6acfe2807afe8cf0a8fd9d7e6a127f5455b1cc2c6
    entry_key: 0a613a013c68b61f213ed6a511eb442f6ad0dbb4b6092562ef23b0d75801359c
  - object_id: SMP-GEO-C1-AFTER-Q4-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8ef010b6ae8b73e4f67621b7563a9e873ad7ae6465ecb6b8d75ae8c595a9da13
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-google-ai-2.md
    snapshot_sha256: 8ef010b6ae8b73e4f67621b7563a9e873ad7ae6465ecb6b8d75ae8c595a9da13
    entry_key: 0ade439486adfbf9df3850ade4c9ae62a1e5623f080e14451247a7e46caa1e7b
  - object_id: SMP-GEO-C1-AFTER-Q6-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8149653f9cf7d1d05c03eb45870e11144486be64f07c193d8ea1d31db2cea027
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-perplexity-2.md
    snapshot_sha256: 8149653f9cf7d1d05c03eb45870e11144486be64f07c193d8ea1d31db2cea027
    entry_key: 0b456ae7eaa5a89a82180d5e4982083cafd6da0a6e9957c31cec26f9c57382d9
  - object_id: SMP-GEO-C1-AFTER-Q3-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: d8d4c3c1786f75e2ec10b5a216a03ad4cb719aa684fd5f7dd2a4e6d0959bc7e5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-chatgpt-2.md
    snapshot_sha256: d8d4c3c1786f75e2ec10b5a216a03ad4cb719aa684fd5f7dd2a4e6d0959bc7e5
    entry_key: 0b88661e070551c27c4cc2d981da3417f108bd6d14d86ab725f6167b7ad9f1d2
  - object_id: ARV-GEO-C1-BASE-Q6-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-claude-1-reviewed.md
    content_sha256: 8930d5de250da52e40b007ece92a9954d4203acfd6628c479addc017a4e519ff
    file_sha256: e1434f01648fb584e16a86f4443f9555162d73462708ad14d241e5c5a9a58e54
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-claude-1-reviewed.md
    snapshot_sha256: e1434f01648fb584e16a86f4443f9555162d73462708ad14d241e5c5a9a58e54
    entry_key: 0c0173d19da07aa0c3971c01d4c3df6ca5620cc49a97946916ca27f0109e95a9
  - object_id: SMP-GEO-C1-AFTER-Q6-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 0132fccaa8ba61be1eec2829d25369a81ca5265acb68c85427333c542f992cd8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-google-ai-2.md
    snapshot_sha256: 0132fccaa8ba61be1eec2829d25369a81ca5265acb68c85427333c542f992cd8
    entry_key: 0c905daca46f038ddccc99cb804576864581bb66e5422f8132e8d9ab427db75a
  - object_id: SMP-GEO-C1-BASE-Q3-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 6f25076b9efd13025c674b819657d363086c9fded708ad9ec62a2c7b0a515f5d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-1.md
    snapshot_sha256: 6f25076b9efd13025c674b819657d363086c9fded708ad9ec62a2c7b0a515f5d
    entry_key: 0c9b48fcf668cebf1127e750bebc5bee7d72bbb0298c9ce23cc7e55f33fd43a4
  - object_id: AGG-GEO-C1-AFTER-Q5-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q5-perplexity.md
    content_sha256: 4a446d18d61be39afc98cabd74a3bc120fd27d10cdbf7db8ee4716db027786f9
    file_sha256: 35fdd0611574dbe5e3ff25c8522bcf32384f536b59f865388c15b01d0607730c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q5-perplexity.md
    snapshot_sha256: 35fdd0611574dbe5e3ff25c8522bcf32384f536b59f865388c15b01d0607730c
    entry_key: 0d0102c9ac37491baf4cc3497bec3cfb89f335838e6932e4d26dc4b888f4417b
  - object_id: SMP-GEO-C1-BASE-Q6-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 2500bd0e2b2d00e81f5d0981d3dfe13ddb8940c00c114a1540d68d7076d7006d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-google-ai-2.md
    snapshot_sha256: 2500bd0e2b2d00e81f5d0981d3dfe13ddb8940c00c114a1540d68d7076d7006d
    entry_key: 0e4db57efb839377487299f4413d4d0dfbe98ab8d74a1f90b1a20b37385588fd
  - object_id: EVD-GEO-E2E-POSITIONING
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-positioning.md
    content_sha256: 53595091ce44ad6dc2ea2ec1d5aa0d30060cb6c52f98d80e35ac628b2bf6d8c1
    file_sha256: e747b4a3c44221730551b54d92c5bba438f11357e00a24593521e8d3dd3796ae
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-positioning.md
    snapshot_sha256: e747b4a3c44221730551b54d92c5bba438f11357e00a24593521e8d3dd3796ae
    entry_key: 0e5d2801fe6118d7effc4d938da52c898069dbb10291b3c4169d344faaaba289
  - object_id: CLM-GEO-E2E-ONBOARDING
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-onboarding.md
    content_sha256: d6fd212806c92f8b1d294e5b0d5f0afaa052d13d205a6f413183bf3746d0c908
    file_sha256: 65481f6c93b58553439c50adf0fc0f406e81cc0409bd5c9ccef2032e7ddafeda
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-onboarding.md
    snapshot_sha256: 65481f6c93b58553439c50adf0fc0f406e81cc0409bd5c9ccef2032e7ddafeda
    entry_key: 0ecdfc19a2c42c697a45d684eb3e4672048d1957bc9fcd6db6d17d7d55025406
  - object_id: ARV-GEO-C1-BASE-Q2-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-1-reviewed.md
    content_sha256: c8796766a726ce3aa449b23db7a274e48218660f3a9076c371c30f4d2a2a1481
    file_sha256: 13ddfae8a563ef86342c76ef3daed69e7b30bd03cb823a6c90824c2034639b30
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-1-reviewed.md
    snapshot_sha256: 13ddfae8a563ef86342c76ef3daed69e7b30bd03cb823a6c90824c2034639b30
    entry_key: 0f2d5b4fc7461ffb5e3a3203a919e041f00e1067aaf27e6ca9f52f95dddb6209
  - object_id: ARV-GEO-C1-BASE-Q5-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-claude-1-reviewed.md
    content_sha256: 845cdbe97e8f6be765ae83844337e4f829a07398c3e731fe6638e68d2d0e9732
    file_sha256: 6abf0cf102006538e3c14210be326ca05589711141efb63da519d067bcf5dd80
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-claude-1-reviewed.md
    snapshot_sha256: 6abf0cf102006538e3c14210be326ca05589711141efb63da519d067bcf5dd80
    entry_key: 0f40eab76f09d17972b8b8156f0e69b4e91d565fadba38a950d14851389da36f
  - object_id: ARV-GEO-C1-AFTER-Q5-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-perplexity-1-reviewed.md
    content_sha256: 04771201cd116758675c54ed3c19c94967d609c8ba97f31d11616a83a72ab245
    file_sha256: f97a5becc047066caeae5a993aa6f0866c5a4648e13339602128febb4997f270
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-perplexity-1-reviewed.md
    snapshot_sha256: f97a5becc047066caeae5a993aa6f0866c5a4648e13339602128febb4997f270
    entry_key: 101503b083f5ab9be1651aaa8b167bff48287616d3d3299f1ec28b14d927f7b6
  - object_id: ARV-GEO-C1-AFTER-Q6-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-gemini-2-reviewed.md
    content_sha256: 4227ac62da0fb62a6a879003c60c7ab4493047cf84be0ba1c12bc62bbd762417
    file_sha256: 6f570688a3f1fd01ce0ba8dda3c2d710a2c81c70df2bc8dd5b7a2e7200f4d7ca
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-gemini-2-reviewed.md
    snapshot_sha256: 6f570688a3f1fd01ce0ba8dda3c2d710a2c81c70df2bc8dd5b7a2e7200f4d7ca
    entry_key: 1057b263d55245872e387a225cb99d80c7d7d8f2da1871adc9b5bf73718e13b3
  - object_id: ARV-GEO-C1-BASE-Q4-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-claude-1-reviewed.md
    content_sha256: 0ffd6464c097017181480d3b8db8d8da3f5e659962465cf00ea13b5c1627789b
    file_sha256: f688aff1940f1c48f5f9ef1e4fbc47a764d773005460b47fe390cbcc99050684
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-claude-1-reviewed.md
    snapshot_sha256: f688aff1940f1c48f5f9ef1e4fbc47a764d773005460b47fe390cbcc99050684
    entry_key: 11e825831e7bd37a4a010c681d85e4851a2a1549724fa98ac36c77d82024193c
  - object_id: ARV-GEO-C1-BASE-Q6-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-2-reviewed.md
    content_sha256: 3f46964610dd5aec3ce700d88c82a330ce25b43deb65f908a76c3e0cd069a67b
    file_sha256: 5556bde916e7782e36a0f8a0d45a47a7ea8df25a8ac6bb5f4f134a00475c11c6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-2-reviewed.md
    snapshot_sha256: 5556bde916e7782e36a0f8a0d45a47a7ea8df25a8ac6bb5f4f134a00475c11c6
    entry_key: 121119772e345e5975a69e879c1136cf8b64fbd7b4f09c47fcb70c6a7dda03ed
  - object_id: SMP-GEO-C1-BASE-Q1-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 082578b7bea25538de1a7dbe8dad67be044074264259b9da6d5984db77fca0ea
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-google-ai-2.md
    snapshot_sha256: 082578b7bea25538de1a7dbe8dad67be044074264259b9da6d5984db77fca0ea
    entry_key: 121d91478337c14c55ad477697e5bec7d6f36ed258e0e5bf61711fbd0096e843
  - object_id: SRC-QINPUT-B4A7F3A49879D5F3DE0E
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-qinput-b4a7f3a49879d5f3de0e.md
    content_sha256: 008a198305b88428becd4730fe78ab7318db0dc85237e33cc1194bbcaf7f3b0e
    file_sha256: aa39e902218d1f30c45efa5cf9f7d2c5a673592c315e97554a7efe8543f89a90
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-qinput-b4a7f3a49879d5f3de0e.md
    snapshot_sha256: aa39e902218d1f30c45efa5cf9f7d2c5a673592c315e97554a7efe8543f89a90
    entry_key: 12e433b759093802469fad1b54420fde832043f4d1e97f171238d2de6191e550
  - object_id: SMP-GEO-C1-AFTER-Q6-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 3c650912d2410c51e9beb0acb213019ed8481db8ebf88d71cdeeb53811c61e91
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-claude-2.md
    snapshot_sha256: 3c650912d2410c51e9beb0acb213019ed8481db8ebf88d71cdeeb53811c61e91
    entry_key: 133b19c42d6e5dd6e4625a6f395b7d12f049bed6c4774a00d9e75a23c02519aa
  - object_id: SRC-GEO-E2E-AUTOMATION
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-automation.md
    content_sha256: 93e1c25d15e397d249e71905bd51a80b5af9be0d998e9032667dd3402089e880
    file_sha256: a129f8fdc3f90cefa4592d13d7f3ae4dc6ef5af8b864ef9c2635c41af870f6e9
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-automation.md
    snapshot_sha256: a129f8fdc3f90cefa4592d13d7f3ae4dc6ef5af8b864ef9c2635c41af870f6e9
    entry_key: 13452f3935141a33683508708e8ef6f359d64f1ba8f265c5aed2c9f8de5e759a
  - object_id: AGG-GEO-C1-BASE-Q1-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-chatgpt.md
    content_sha256: e1d39810eca2bfe7a63359760b061c6c1b590aa30968da73b984769d38d6fb2c
    file_sha256: a78711b824d3fa3e1b2595e6192f4ac5560212e58636c333e33f5c427b909536
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-chatgpt.md
    snapshot_sha256: a78711b824d3fa3e1b2595e6192f4ac5560212e58636c333e33f5c427b909536
    entry_key: 13a9a205735bfe09504a79cf61fdc32f819ea47517168537bdb17046df9be4c7
  - object_id: AGG-GEO-C1-BASE-Q6-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-chatgpt.md
    content_sha256: 4c5cbf23b6b81873dcacda438d18cfb897611feb3f523b7856556788e7b1a496
    file_sha256: 39cc46e9660c71fad1ab980bc75c8bea230c57af6499f09da9f6e5704bbff53a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-chatgpt.md
    snapshot_sha256: 39cc46e9660c71fad1ab980bc75c8bea230c57af6499f09da9f6e5704bbff53a
    entry_key: 13ef5d88c5ef5f200cf704d7ae2df3fee60f267df4e9439732e67a48b7105080
  - object_id: ARV-GEO-C1-AFTER-Q3-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-gemini-2-reviewed.md
    content_sha256: 3816538f2afdd8f0f28fd85b52bc34644baf768fae6dd73bae81cff10e82a5cb
    file_sha256: e36f696f6366b387ce7bab1f5f5c90aed17ddb88a496be2f37b4fd6739ba98c4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-gemini-2-reviewed.md
    snapshot_sha256: e36f696f6366b387ce7bab1f5f5c90aed17ddb88a496be2f37b4fd6739ba98c4
    entry_key: 146b4e6ac79785cb38ff28fe3fd83f57cda2fcd821412e92d562a81d322dd0dd
  - object_id: SRC-GEO-E2E-POSITIONING
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-positioning.md
    content_sha256: 53595091ce44ad6dc2ea2ec1d5aa0d30060cb6c52f98d80e35ac628b2bf6d8c1
    file_sha256: d6955af4ad0dc59320933f29430d2ea1497f1bb6cf64b0bf91641dc95c9bf40c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-positioning.md
    snapshot_sha256: d6955af4ad0dc59320933f29430d2ea1497f1bb6cf64b0bf91641dc95c9bf40c
    entry_key: 1505a95f0033e9ca7d97a23dfaa948cda9432fe3eb8c3b0a160bb1b1b92c4d09
  - object_id: ANS-GEO-E2E-C1-4
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c1-4.md
    content_sha256: 256f8a7315348698bdbe7d66546ec20e92b6c437c967cb4e72d368c716497f09
    file_sha256: a7dd12ad559bcd3ec37972b95e4ed46bfc91101ecaa82ff0f8d1743097ff9f22
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/answer-cards/ans-geo-e2e-c1-4.md
    snapshot_sha256: a7dd12ad559bcd3ec37972b95e4ed46bfc91101ecaa82ff0f8d1743097ff9f22
    entry_key: 1596904a90c0d0090329395d24ef1fd0afebf786c1893d3d42625ccf5b19f9a3
  - object_id: AGG-GEO-C1-BASE-Q1-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-claude.md
    content_sha256: ec18a5665c312f143c275fc8490188c9f876f1ec19912d39b56bf747a1102689
    file_sha256: a1205b9c7e643ead5185a028c4ee3467bcb40f6c7a5d86b4ae9d35d8a452d3fc
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-claude.md
    snapshot_sha256: a1205b9c7e643ead5185a028c4ee3467bcb40f6c7a5d86b4ae9d35d8a452d3fc
    entry_key: 15caeaad2fc55db4d39710efe355be890a67f9383247231312c01497efa2df88
  - object_id: ARV-GEO-C1-AFTER-Q3-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-chatgpt-1-reviewed.md
    content_sha256: 462b7ef7d2d884b9d9dc8141c7a85d12904a88ce3555f7b7af482df55ba5e501
    file_sha256: e5f23b7e7d88fc2556802e2a9c3b72e96f43177f3928d02695b5f625158dfc87
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-chatgpt-1-reviewed.md
    snapshot_sha256: e5f23b7e7d88fc2556802e2a9c3b72e96f43177f3928d02695b5f625158dfc87
    entry_key: 162eaecbb25b3b8b44233316f081d4a883c146e80eab9b656e61a71543bff531
  - object_id: EVD-GEO-E2E-COMPARISON
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-comparison.md
    content_sha256: 24e1cedf6efc20a99384f95baa7f873d352a7f4f44ddb1881a87f22fe10ae271
    file_sha256: 05e99927d2f0c40e5275b0aef706f312960a02d9bbfcdfbda630f974a7494402
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-comparison.md
    snapshot_sha256: 05e99927d2f0c40e5275b0aef706f312960a02d9bbfcdfbda630f974a7494402
    entry_key: 16b4da55c0a36aca6854845f7d155f8dc867faf6b559a684ada36ad48281cb2c
  - object_id: AGG-GEO-C1-AFTER-Q2-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q2-gemini.md
    content_sha256: 13364af0eb9aa1cedee4666117ce1245c33ba34fb258e1e3c1b24d163acdd0bc
    file_sha256: c854775aefa21612fdec891c0da2de2c725cf2ea31d6d5e16026061956ac572d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q2-gemini.md
    snapshot_sha256: c854775aefa21612fdec891c0da2de2c725cf2ea31d6d5e16026061956ac572d
    entry_key: 17441d11fa7a098937c1585c6b1549573767c6d9ff2ddebe46a8eb9a000a3971
  - object_id: AGG-GEO-C1-AFTER-Q5-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q5-chatgpt.md
    content_sha256: b65eb9cd55c3f749e17333b4ea51abf5284fa0bf276df7487bedac9ede9b8f08
    file_sha256: 524b3d75058ca748f5b5dccd12e2b18730b37e5d48d9e625200154def1fe0d8a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q5-chatgpt.md
    snapshot_sha256: 524b3d75058ca748f5b5dccd12e2b18730b37e5d48d9e625200154def1fe0d8a
    entry_key: 17589c233c04fe76a3be862553de6d179901a69f70fb95d70326a91ada01c57d
  - object_id: RUN-GEO-SITE-C1-AFTER-OWN
    record_type: run
    object_version: 1.0.0
    object_path: cycles/m4/runs/run-geo-site-c1-after-own.md
    content_sha256: 257c01ea6f19154d2633d1558f5607ba51f30b1af91e43ff622ee8f261726851
    file_sha256: 4662dc9d7aa9b05c74505d89b390989c04c6be6d859e0d99e907cac0c77e2245
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m4/runs/run-geo-site-c1-after-own.md
    snapshot_sha256: 4662dc9d7aa9b05c74505d89b390989c04c6be6d859e0d99e907cac0c77e2245
    entry_key: 175c5ce76b0127c5f135ee3cee61fca6f7252def370824b475697489a15a8649
  - object_id: SMP-GEO-C1-AFTER-Q1-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: b6cfccabf108f9a9a407a2abe242551f64e30cb750fad35a9dcdfe794af9b9a3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-google-ai-2.md
    snapshot_sha256: b6cfccabf108f9a9a407a2abe242551f64e30cb750fad35a9dcdfe794af9b9a3
    entry_key: 177993f5df84d400a196d98093374c71327c544de892b1acc423568f425dea1c
  - object_id: ANS-GEO-E2E-C1-6
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c1-6.md
    content_sha256: 8e1828d0c63af7aa02d5bd980a941afb6179135cb0128aa1ae6f01924e39cc66
    file_sha256: e1a071cb159104b04614ad1f1ffbd56fde0c3bb4c8eb694d3b6d9e043200d90f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/answer-cards/ans-geo-e2e-c1-6.md
    snapshot_sha256: e1a071cb159104b04614ad1f1ffbd56fde0c3bb4c8eb694d3b6d9e043200d90f
    entry_key: 185e0965010b1145ec2aaea5dd6b81f7b81f9690b4adafd245d13607fe56dc5b
  - object_id: ARV-GEO-C1-AFTER-Q1-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-gemini-1-reviewed.md
    content_sha256: 55978ae25dfa386e0b0044cecec243e0314891020bdc150f7e2b3d2699a66c1f
    file_sha256: aa597a9a0c7d210ef6bfdacb86b7f291cc57a7bfc423a61c49000124f41ec68a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-gemini-1-reviewed.md
    snapshot_sha256: aa597a9a0c7d210ef6bfdacb86b7f291cc57a7bfc423a61c49000124f41ec68a
    entry_key: 19ca4200003a0436614dab036e9bf7dea80d515783570f28b2c99818e49fa4c0
  - object_id: AGG-GEO-C1-BASE-Q2-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-perplexity.md
    content_sha256: 58cf292e19536409fca3056c2ce9c1eff2c6b2a44cc7fb78657ee6f3a28bbe5c
    file_sha256: 75a1e8a443397bd4731af58bdd2c42c3528653a653b393f66bc18ed8dfc69837
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-perplexity.md
    snapshot_sha256: 75a1e8a443397bd4731af58bdd2c42c3528653a653b393f66bc18ed8dfc69837
    entry_key: 19f7e789105d381e63f7166c6a947ed4dd5a5e557490fee784bc5a67ed586851
  - object_id: AGG-GEO-C1-BASE-Q4-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-claude.md
    content_sha256: 53c690af183de2d75274176deea4b23de4147ece6026976f5c7a951454dbe2e1
    file_sha256: e284b4ffa5c18c82e16cf605ecff1ebf59659c8d118af438d06a02d3cb847ff7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-claude.md
    snapshot_sha256: e284b4ffa5c18c82e16cf605ecff1ebf59659c8d118af438d06a02d3cb847ff7
    entry_key: 1a0c2cc14dcbe31963c844d5d254e3142628bee55e109543648cdbada0c78681
  - object_id: SMP-GEO-C1-AFTER-Q2-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 589e2bc58d633e7a76c09ecfcf004203143d8c4f5bdae7e5d735fc73607282f4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-perplexity-2.md
    snapshot_sha256: 589e2bc58d633e7a76c09ecfcf004203143d8c4f5bdae7e5d735fc73607282f4
    entry_key: 1a0df99198c22dab0d7f0d0e880048d20710e4747e7ec9be10ff914d1cc544c0
  - object_id: EVD-GEO-E2E-REFUND
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-refund.md
    content_sha256: d8d34b9f234e97400b8a96db2edb8664e4889192426a0a6be8fd884fc28b1808
    file_sha256: 4cf4dd8a708a97905fef675fcc1bb2c4bcf8320b8265bc2324a03c4b4da62700
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-refund.md
    snapshot_sha256: 4cf4dd8a708a97905fef675fcc1bb2c4bcf8320b8265bc2324a03c4b4da62700
    entry_key: 1a9104bce7991ebce839db6ab56b1a9aeee057aa6c9e8e25f4567db04ead558c
  - object_id: ARV-GEO-C1-BASE-Q2-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-2-reviewed.md
    content_sha256: eb2cc3c6428d100d669c31f2283255d439659a5477df7083383600536cf8aa41
    file_sha256: f41409045d77075e91ccc9be5a305cb1e157f320f39311fcd68a0910c78a198a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-2-reviewed.md
    snapshot_sha256: f41409045d77075e91ccc9be5a305cb1e157f320f39311fcd68a0910c78a198a
    entry_key: 1bd22e41e483190b0bd0a28b7326db8b9f7aebae4bf55c7f57d55de4162877da
  - object_id: ARV-GEO-C1-AFTER-Q4-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-perplexity-2-reviewed.md
    content_sha256: d34661f2c49509e533dfaca268949cb2f4035afb48ff9d62df4cd0dccb102ba5
    file_sha256: 0a4f0216357e24497edbda5c570eb03df604585a31248ce9f8d6b9084321ae11
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-perplexity-2-reviewed.md
    snapshot_sha256: 0a4f0216357e24497edbda5c570eb03df604585a31248ce9f8d6b9084321ae11
    entry_key: 1c27cb8ed7686af387d2204f65c07c9f667918e32136324caf58e41926aafa83
  - object_id: ARV-GEO-C1-AFTER-Q5-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-claude-2-reviewed.md
    content_sha256: 984efb4cfa1a2017ffc5673336961d656df27e800f11720296e25d71d049de8a
    file_sha256: 706b1dba21f2fee801477d2551243cfa0f30fb7ac0021a2baaa53028974d4582
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-claude-2-reviewed.md
    snapshot_sha256: 706b1dba21f2fee801477d2551243cfa0f30fb7ac0021a2baaa53028974d4582
    entry_key: 1ca9af4bfdae71a93e807c02c2d15cae330c5c79ed3d6a7de38d86d44528ccae
  - object_id: DOC-GEO-E2E-REFUND
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-refund.md
    content_sha256: 367ceb2cda480a9b37842c2602757be9db5898b7f6d5a805b8527c2bddb2640a
    file_sha256: ec156fc00999a81c16594b7bb862d078b9648e928a4e509ceafeeacf212d5dbc
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-refund.md
    snapshot_sha256: ec156fc00999a81c16594b7bb862d078b9648e928a4e509ceafeeacf212d5dbc
    entry_key: 1cfae65090a44e85fd15835109e892987a493bedf10b19704af01edf34598082
  - object_id: AGG-GEO-C1-AFTER-Q1-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q1-claude.md
    content_sha256: ce8e193672d880bdfab9ce67694559f3da31b62395c9b7be2197ec76b321176f
    file_sha256: d6259aaef5c238862687812e59717192bf0ef371c3ff7ad40d0e1e0e841bb70b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q1-claude.md
    snapshot_sha256: d6259aaef5c238862687812e59717192bf0ef371c3ff7ad40d0e1e0e841bb70b
    entry_key: 1e0ac42a45eace8c97a1351444d04ef1116e330fcec7ec8ddfb3d82dcb192182
  - object_id: SMP-GEO-C1-BASE-Q2-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 77093d98cff2f86b860b50535b18aa84ccd675a959c16403b2741acfcf110d7b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-perplexity-1.md
    snapshot_sha256: 77093d98cff2f86b860b50535b18aa84ccd675a959c16403b2741acfcf110d7b
    entry_key: 1ec2e3d31a55af5752125b7f11ee699e946f67bc01b255e776c29c0fa37b7d6d
  - object_id: CPF-GEO-E2E-C1-BASE-PERPLEXITY
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c1-base-perplexity.md
    content_sha256: edb7a49614af42eccd27496ea6033810e0363e7265fcf13a577ad357680b7a5e
    file_sha256: 98f355ddc20abe7ab71a8c38d08ee941e7b31efe656904a84ef79c2c4e6d00af
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c1-base-perplexity.md
    snapshot_sha256: 98f355ddc20abe7ab71a8c38d08ee941e7b31efe656904a84ef79c2c4e6d00af
    entry_key: 1f08aea5ad80285e411f14eb103a595f23571a7e520d5bff7299e70a42bdec5e
  - object_id: ARV-GEO-C1-BASE-Q3-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-2-reviewed.md
    content_sha256: a979cf4c8810f0f2ee88c98801b1238688a1ead97ad097b2fd1c01d20a51d4f3
    file_sha256: c27ae7b08d1d4fd28cb115fe88abe975c362a7b7b66c215544a0a47387d58060
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-2-reviewed.md
    snapshot_sha256: c27ae7b08d1d4fd28cb115fe88abe975c362a7b7b66c215544a0a47387d58060
    entry_key: 202dac26386201716402ee20bc96cc6d04ed14be7b7ff5e0613479214a4833d3
  - object_id: ARV-GEO-C1-AFTER-Q4-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-gemini-2-reviewed.md
    content_sha256: acccd447a18f7af0fea5a0bad07be36ff78e12a7d23205d9833eddac700db68b
    file_sha256: 32c349c8d4d0bbc83fe777fe5786b895a8a2f9a2519620ab38bc117b99ee1983
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-gemini-2-reviewed.md
    snapshot_sha256: 32c349c8d4d0bbc83fe777fe5786b895a8a2f9a2519620ab38bc117b99ee1983
    entry_key: 20903ac01e7768b24cdc5c0ce726afb556077b25182ca46129f9269dd41df865
  - object_id: CLM-GEO-E2E-COMPARISON
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-comparison.md
    content_sha256: 24e1cedf6efc20a99384f95baa7f873d352a7f4f44ddb1881a87f22fe10ae271
    file_sha256: feedf7af4e742227854393f7e4ca88a92e8ab17bf6d89455b2e92335025f4a4e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-comparison.md
    snapshot_sha256: feedf7af4e742227854393f7e4ca88a92e8ab17bf6d89455b2e92335025f4a4e
    entry_key: 20c0a29750dfc6e100d464624401b7ee43530fea7cdb64b26036668fbccb3b85
  - object_id: AGG-GEO-C1-BASE-Q2-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-claude.md
    content_sha256: 5826e4a69ee82495a5b2323f3dd5234e9c29a2036be7b24eb51350c702307197
    file_sha256: 216f3a4ca25a8b9cb64c16b34a04aec62c5989c0ee15975fa0e60934b54c4d88
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-claude.md
    snapshot_sha256: 216f3a4ca25a8b9cb64c16b34a04aec62c5989c0ee15975fa0e60934b54c4d88
    entry_key: 20ca4a01ede90720586d7811757b3ba66c40eb6d0588dd5e7ee5e0508a863c7d
  - object_id: SMP-GEO-C1-AFTER-Q1-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 44796cdf19df94c4d53cfe7cb0714d88d5da78b94058c5edd7936fb7a4e7efc6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-gemini-2.md
    snapshot_sha256: 44796cdf19df94c4d53cfe7cb0714d88d5da78b94058c5edd7936fb7a4e7efc6
    entry_key: 2140d3d4d544351c804356141a65aab1d0451d982261178ad1cd99be7c7ecdf5
  - object_id: RUN-GEO-SITE-C1-AFTER-OFFICIAL
    record_type: run
    object_version: 1.0.0
    object_path: cycles/m4/runs/run-geo-site-c1-after-official.md
    content_sha256: 742cd49202a5097624e3c5473e360521305b386990fe5b98f04f436aee82fef1
    file_sha256: 746aae3fc8440ffd08421d1d3f160d6bd6a0dd7f9844a98fa0709c955d6572be
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m4/runs/run-geo-site-c1-after-official.md
    snapshot_sha256: 746aae3fc8440ffd08421d1d3f160d6bd6a0dd7f9844a98fa0709c955d6572be
    entry_key: 2159be07824c2b440a6240d203254e2b24d5ce65fa6378f83d1fe407b86ca0ca
  - object_id: AGG-GEO-C1-AFTER-Q6-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q6-chatgpt.md
    content_sha256: 6d9d2e85ed04c48c709d18956e079ee85f33e429fafb9af6ec4a5b4d63b6fdbd
    file_sha256: 5dfb54f08a9e4c47a2265c5c8b53d97e1f9804981cfb37c8e136d7e7cb2f5dda
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q6-chatgpt.md
    snapshot_sha256: 5dfb54f08a9e4c47a2265c5c8b53d97e1f9804981cfb37c8e136d7e7cb2f5dda
    entry_key: 217139bb2141dce013fe0cbffd89b5633dc3f4402e3540492ff510d24c26c432
  - object_id: AGG-GEO-C1-AFTER-Q4-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q4-perplexity.md
    content_sha256: 1787996e8bc17dacf1954987723d1bdae89a8d4ee0d2cc324f581179a82974b6
    file_sha256: f0d7f9144fb890b2a1303b925cdf43d112e4c2dc42f2bc240ed1de1979033146
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q4-perplexity.md
    snapshot_sha256: f0d7f9144fb890b2a1303b925cdf43d112e4c2dc42f2bc240ed1de1979033146
    entry_key: 21dbd90320c06155d7311638b7e24ee1b21f82d0f51c260ef2ffcddd58279cf6
  - object_id: ARV-GEO-C1-AFTER-Q2-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-google-ai-2-reviewed.md
    content_sha256: 716737837514d47245c5bb557de116420c41af55309d2ca404e4acbe625b6ba5
    file_sha256: dd8351b66470a78c4af861b0f90c7af1973878604df74d06cc22ee7d853f6424
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-google-ai-2-reviewed.md
    snapshot_sha256: dd8351b66470a78c4af861b0f90c7af1973878604df74d06cc22ee7d853f6424
    entry_key: 222dbc178593baf42fd718e02a1c87ee7f1f09ade99f1dd95fa2307995486421
  - object_id: ARV-GEO-C1-AFTER-Q4-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-chatgpt-2-reviewed.md
    content_sha256: da6f794dc905acc6a80d221ee407dd2aacb2cd4c595e4c6594341697371ab7aa
    file_sha256: 0d4d6f745e886ccceeeb2ae9ba32db7b3285e10a2e9f493b8abc1ff075aa852b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-chatgpt-2-reviewed.md
    snapshot_sha256: 0d4d6f745e886ccceeeb2ae9ba32db7b3285e10a2e9f493b8abc1ff075aa852b
    entry_key: 22c77b588e88a6bad84d41b874dac38bdb80a3cc05836cf2caae31d4b6896eb7
  - object_id: SMP-GEO-C1-BASE-Q3-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 1f9ce97e48da1d14887ad66f11b971972244f19bda2949ff2ce8062f897ad302
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-google-ai-2.md
    snapshot_sha256: 1f9ce97e48da1d14887ad66f11b971972244f19bda2949ff2ce8062f897ad302
    entry_key: 23c706fea31c7ddc3aff47ce011790b1bb82072c96d6862f915d1d423e90dc1b
  - object_id: AGG-GEO-C1-AFTER-Q2-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q2-google-ai.md
    content_sha256: 1f894098d9949c7c80c9592bfe69ce8a935a492bc2d7c7bdec6b0deb30444aeb
    file_sha256: 45bef5df3abee8f10dd91abd08d20af223816f567c3a0592434378fae5c44efd
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q2-google-ai.md
    snapshot_sha256: 45bef5df3abee8f10dd91abd08d20af223816f567c3a0592434378fae5c44efd
    entry_key: 2509c2934146424bf4979c66de43fc4050904b90fac8de28e4cc27bcabc5ceee
  - object_id: FND-GEO-C1-OWN-1
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c1-own-1.md
    content_sha256: d624c1546bcb8e9c398b9bda276a7773f8c6ae1e74ecfa3c85a5eec240586a0a
    file_sha256: eb38b8d53c2bb713ed2cdcff79c03f7da529d245f81ef36847e4fec947189e86
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-c1-own-1.md
    snapshot_sha256: eb38b8d53c2bb713ed2cdcff79c03f7da529d245f81ef36847e4fec947189e86
    entry_key: 26d7be3bbd6b55027a768cf38f292b0032c60470dbae727acdb7a6c9c9cfdbb3
  - object_id: AGG-GEO-C1-BASE-Q2-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-gemini.md
    content_sha256: dbc14e451934504b73c27db172d11092b8df1e05897afd34ef8ee10ddb5acc9f
    file_sha256: 3cc8e4b2b4c6a712c8ad3459429a8f36b344d366e1ebe90d74fa1e395d15b851
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-gemini.md
    snapshot_sha256: 3cc8e4b2b4c6a712c8ad3459429a8f36b344d366e1ebe90d74fa1e395d15b851
    entry_key: 270b42126b4e9b7d48260264e636c4bd5c91ff5b55fd74dfd34af0928d7eaa73
  - object_id: AGG-GEO-C1-AFTER-Q1-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q1-gemini.md
    content_sha256: 8e1d86333cb5d10b4c2c61c88a32c4fa3491cf4c0a3e02eea6b9eef828ecfdd3
    file_sha256: dcd505bd748fba493223360dee18af1edd395dad4902b49a3c72b206e895e295
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q1-gemini.md
    snapshot_sha256: dcd505bd748fba493223360dee18af1edd395dad4902b49a3c72b206e895e295
    entry_key: 2749f4d38c8ec517ecd5d05d721682569f547ec4c02d448a9047a70a896c8093
  - object_id: AGG-GEO-C1-AFTER-Q3-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q3-chatgpt.md
    content_sha256: f5bb6493d7a6f3cf2b4fb5912320766f19a70aa467857c60c5ed2eca804f7e7b
    file_sha256: 2ccf71a87c2d56432d8bf6ab059beaf3b3c1e8c8b46efe91a4c4a745aa1446c0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q3-chatgpt.md
    snapshot_sha256: 2ccf71a87c2d56432d8bf6ab059beaf3b3c1e8c8b46efe91a4c4a745aa1446c0
    entry_key: 27a120a65277b5e4545a9acd22eb602d79c255399695352c7f826111a60165bf
  - object_id: SMP-GEO-C1-AFTER-Q1-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 8e3924e991126d6eaa76320e0676387bf812be299047da4a368a1c5b07a34730
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-google-ai-1.md
    snapshot_sha256: 8e3924e991126d6eaa76320e0676387bf812be299047da4a368a1c5b07a34730
    entry_key: 28ac3786cb326a23c656654efd3412d5e0e71d3d4af3dc5865202daf1c5ce5be
  - object_id: SMP-GEO-C1-BASE-Q6-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 013ce00b5d98d671a89de135b181ad51b6a3e6161eaa3b66242152e53a698df7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-claude-1.md
    snapshot_sha256: 013ce00b5d98d671a89de135b181ad51b6a3e6161eaa3b66242152e53a698df7
    entry_key: 28c3608b3dce3fb10bb4872610d6333cb7e3138505237b1a520906c2167f7e8c
  - object_id: ARV-GEO-C1-BASE-Q4-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-claude-2-reviewed.md
    content_sha256: e88659f0409ec8eec1e199dd9cfb765dd863b23dd120bb764997f1a4adccc099
    file_sha256: 3ceb34afdfcd4508b8007b71f0124dc1235e6dd598e554d478afdd04497fd435
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-claude-2-reviewed.md
    snapshot_sha256: 3ceb34afdfcd4508b8007b71f0124dc1235e6dd598e554d478afdd04497fd435
    entry_key: 29545c3db6b13a6f8fe6feb31097e6ffb66d3f80639a5feb86fc8e539080e440
  - object_id: CLM-GEO-E2E-POSITIONING
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-positioning.md
    content_sha256: 53595091ce44ad6dc2ea2ec1d5aa0d30060cb6c52f98d80e35ac628b2bf6d8c1
    file_sha256: 960d556fca4cec10a37d2e9fa4cba818ef6d287a3dc2214a0bd9fe9438b5c51d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-positioning.md
    snapshot_sha256: 960d556fca4cec10a37d2e9fa4cba818ef6d287a3dc2214a0bd9fe9438b5c51d
    entry_key: 29570271d03c21bfa7e1e3619eca87811cc082022f4b1a3f7f1ff544a1999280
  - object_id: SMP-GEO-C1-BASE-Q5-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: c44e75332dbb52397649027c58b6c3b470147c322df7972ad01ac1bc40c20823
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-2.md
    snapshot_sha256: c44e75332dbb52397649027c58b6c3b470147c322df7972ad01ac1bc40c20823
    entry_key: 296b7a05f487fad646b43222afc23d7588133aae884bfbb859beaab4f86b543d
  - object_id: CLM-GEO-E2E-REFUND
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-refund.md
    content_sha256: d8d34b9f234e97400b8a96db2edb8664e4889192426a0a6be8fd884fc28b1808
    file_sha256: 4798604be05ca4c62908509a6c62c51bf09e80ca5973eafd28f48f863a1dfdff
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-refund.md
    snapshot_sha256: 4798604be05ca4c62908509a6c62c51bf09e80ca5973eafd28f48f863a1dfdff
    entry_key: 29823f9b2ead2865ad51dd57d5e4ddcb035dc4a49c1e1e75994b6afba1cc7fa4
  - object_id: EVD-GEO-E2E-CASE
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-case.md
    content_sha256: 9cddd8a4732579c1ea633d2c66b028f8d72aeb6f15123fc3543b52cbf17e1df7
    file_sha256: 26424a837b2587aea6b65bf7f57a11d0c4e91920a057c460d871fcfe3992a3f1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-case.md
    snapshot_sha256: 26424a837b2587aea6b65bf7f57a11d0c4e91920a057c460d871fcfe3992a3f1
    entry_key: 2b1a3eb0e380cc736cc57034fe7ca36a03ab26ca15eb17bf35c09494252f1048
  - object_id: AGG-GEO-C1-AFTER-Q5-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q5-google-ai.md
    content_sha256: d273be160a60a2f81927fd44bc3483b0d7008a02199dcf8817c8ca15d8914fca
    file_sha256: cb2f957cb331cd124c7877d86df65e005022a140b576085a991ab8c88f26af24
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q5-google-ai.md
    snapshot_sha256: cb2f957cb331cd124c7877d86df65e005022a140b576085a991ab8c88f26af24
    entry_key: 2b25fa494c00e1eb0f25f6e828b5d118617f749d812e78da8bd5e5a169bdc846
  - object_id: AGG-GEO-C1-AFTER-Q4-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q4-claude.md
    content_sha256: e807e5071d47d7265ccfaf33ae9c8457b58da4b444b37a141200d06b288c190b
    file_sha256: a9dbc144607ce3d2628cec82d7b43c8a8f3027db5c13047b993974ebe0e1ad01
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q4-claude.md
    snapshot_sha256: a9dbc144607ce3d2628cec82d7b43c8a8f3027db5c13047b993974ebe0e1ad01
    entry_key: 2d0b6987ccff66460cf6cf047aca2982561498c8e2a5986100741084a48b90b2
  - object_id: ARV-GEO-C1-BASE-Q5-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-1-reviewed.md
    content_sha256: bd3b2a6f76e78ba1089165c59afdcc4594877a06e82a1839a6fe09c0ddbebce6
    file_sha256: 620c68dac87ff4d9d90267b7f73de67d3e5864c15369a87839a11aa8b92fae62
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-1-reviewed.md
    snapshot_sha256: 620c68dac87ff4d9d90267b7f73de67d3e5864c15369a87839a11aa8b92fae62
    entry_key: 2dcc7e861722c423277e70901e0ec4f68b10493cbe32b111f440c7f0ffdf7ab2
  - object_id: SMP-GEO-C1-BASE-Q4-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f7c9f8eee378473f6115cd725ea10635139cb07629383885ea2a91ec773216fc
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-perplexity-1.md
    snapshot_sha256: f7c9f8eee378473f6115cd725ea10635139cb07629383885ea2a91ec773216fc
    entry_key: 2dd1a19ff1931f3b6c968bcfc2bd7d2add077b1a2c2520d85fbd6dfd2f78f375
  - object_id: ARV-GEO-C1-AFTER-Q4-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-claude-1-reviewed.md
    content_sha256: 6058beff5803fe8d76eb92e0ac340bd7ad92be0c2e069fd8f21aad0f6c2b4431
    file_sha256: 26e51a5f41d4b2f3f1a7d169cdee0ef070e7454b79652e6d0e35cfd6abd17742
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-claude-1-reviewed.md
    snapshot_sha256: 26e51a5f41d4b2f3f1a7d169cdee0ef070e7454b79652e6d0e35cfd6abd17742
    entry_key: 2f086847e6f9657cc744cf2315f0d49fca3db68cf9d77f1e194d191aaa48c9b2
  - object_id: DOC-GEO-E2E-GUARANTEES
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-guarantees.md
    content_sha256: e3b9d1f5840bcc95fd731f489ca5a8ae1d48641023aa6a2f32921ee1f2471649
    file_sha256: 717158bad2b2283b18de266b7589bf84d99c292f055659502b19bc70cb548262
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-guarantees.md
    snapshot_sha256: 717158bad2b2283b18de266b7589bf84d99c292f055659502b19bc70cb548262
    entry_key: 2f1b98aa23488212daa939559f31c9ab10641cccb35cb6797442ba1ed89c5c88
  - object_id: ANS-GEO-E2E-C1-3
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c1-3.md
    content_sha256: 3a6e7f00300fc991bfe500930fff0bfe4ae811e5c7d13886fa50b02771d467d2
    file_sha256: b878ff96444834e48726b726a89601857c707126b10e6d81a2ccba209780671f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/answer-cards/ans-geo-e2e-c1-3.md
    snapshot_sha256: b878ff96444834e48726b726a89601857c707126b10e6d81a2ccba209780671f
    entry_key: 2fcdab3fcea1db364c3b33f51460ce7b2a3cc193860c464f84fc46f324dcf9f8
  - object_id: SMP-GEO-C1-AFTER-Q2-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: e4b4ce86a512dbec432b4ee4027028884595288a7452fbed1112729f1d6241fa
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-chatgpt-1.md
    snapshot_sha256: e4b4ce86a512dbec432b4ee4027028884595288a7452fbed1112729f1d6241fa
    entry_key: 30e545316c1fa2da9e570cf7efe17283bed3e605fcb6f91e298f1eb5f74c0dde
  - object_id: DOC-GEO-E2E-PRIVACY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-privacy.md
    content_sha256: 6410f73c9189ee86d2323d1e93f3bba9086da2c377de3010782df8d880e2cc10
    file_sha256: aca117de587fc7483662e767f60ba993648f2f8fea97bec61c1aeddab02e9b37
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-privacy.md
    snapshot_sha256: aca117de587fc7483662e767f60ba993648f2f8fea97bec61c1aeddab02e9b37
    entry_key: 329f956bf63bc928268a1f0d971dd6b13006b105d6651b278cc2ec15557391e6
  - object_id: SMP-GEO-C1-BASE-Q6-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 75548d477e0b8db71558a5f6d387ed6218521b3e598f94af9719e237c1d81fc8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-1.md
    snapshot_sha256: 75548d477e0b8db71558a5f6d387ed6218521b3e598f94af9719e237c1d81fc8
    entry_key: 3323fb80437ae070d29c5dd2a1b8a6c2c88da0a133a2911251ac0450ab8f2c2c
  - object_id: CLM-GEO-E2E-ANSWER-DEFINITION
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-answer-definition.md
    content_sha256: 39e9f04bfbb709f8985c63171446a5d66214132c264165afb6eb98c13a5bbb95
    file_sha256: 58b702e9721c65bfac92306d5e82b7ee40ce72d8175c50ebfa0d880cf947fee1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-answer-definition.md
    snapshot_sha256: 58b702e9721c65bfac92306d5e82b7ee40ce72d8175c50ebfa0d880cf947fee1
    entry_key: 33d0d1e3e6db1bcaea70f78c2719b97b7a84e7c2b0f0f3e9a59fe608f23798e8
  - object_id: ARV-GEO-C1-AFTER-Q5-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-gemini-2-reviewed.md
    content_sha256: 383f6c40b41182cfcd8a535dd26d7f4ddfeb0e339e290e3e82e1e3d8ceefd17d
    file_sha256: 231e56a2e0f682904acfd061fdd976b8d868119548880b12396b4e48dbf15109
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-gemini-2-reviewed.md
    snapshot_sha256: 231e56a2e0f682904acfd061fdd976b8d868119548880b12396b4e48dbf15109
    entry_key: 3448770adf9657298f94faa965aa9a9879ab2e0af6df43900ccbdf5bf5a28dc2
  - object_id: DOC-GEO-E2E-POSITIONING
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-positioning.md
    content_sha256: af4604fedd31943104cd300f492bceb68c91b610780198f6f9168d38e6c47a34
    file_sha256: 6eb4fb55801c3e9f9bfe3b7cf2ebb1aab213c6394bb6dcc86e9fc1ad81c7a2e7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-positioning.md
    snapshot_sha256: 6eb4fb55801c3e9f9bfe3b7cf2ebb1aab213c6394bb6dcc86e9fc1ad81c7a2e7
    entry_key: 34becb235ad417da8175d65bb8851b1e3171dca2d2941f7cf63af01418f43671
  - object_id: SMP-GEO-C1-BASE-Q1-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: c2bfabf9763a1d64a3025067f26f9ea6977e206d6c5615d96d118f3fd048c6a1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-google-ai-1.md
    snapshot_sha256: c2bfabf9763a1d64a3025067f26f9ea6977e206d6c5615d96d118f3fd048c6a1
    entry_key: 34cf32157478255ad70fb4db2c943c0fb4b685a8ebb0960d82d6f012f4375c7c
  - object_id: QS-GEO-E2E-C1
    record_type: query_set
    object_version: 1.0.0
    object_path: queries/sets/qs-geo-e2e-c1.md
    content_sha256: cfa47e85f7b5692881e7ec9f2f4e6551a6dd7014382211da4786a52ee8f25914
    file_sha256: a169b26d36a4d1b9f317b975eb68419f2b8efd63ccd1af4cffdc19586e025bcd
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/queries/sets/qs-geo-e2e-c1.md
    snapshot_sha256: a169b26d36a4d1b9f317b975eb68419f2b8efd63ccd1af4cffdc19586e025bcd
    entry_key: 35829b204c3dc8f10ba982580e878468e5da3e379afabcf4bd7f7046ecc8c96b
  - object_id: Q-HOW-CAN-CREATORS-COMPARE-REHEARSAL-EN-23C2
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-how-can-creators-compare-rehearsal-en-23c2.md
    content_sha256: 62c8358df3358e11e0162d62e94b0bbabab0e7eedbf0ba4898545d17f273f216
    file_sha256: 163916acc2565332b3079ccd57f32915f7c88dc86d2e2a1c59e384d19d6b7eb3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/queries/candidates/q-how-can-creators-compare-rehearsal-en-23c2.md
    snapshot_sha256: 163916acc2565332b3079ccd57f32915f7c88dc86d2e2a1c59e384d19d6b7eb3
    entry_key: 363b056b5398f1ab47ba0dd15279660935938d825fcc61d2f6ae7641881f5108
  - object_id: SMP-GEO-C1-BASE-Q2-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: cc44460352e2eeb1cad29d1504524f925d4310acef8a0a0a7b57c8acb1977a2d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-google-ai-1.md
    snapshot_sha256: cc44460352e2eeb1cad29d1504524f925d4310acef8a0a0a7b57c8acb1977a2d
    entry_key: 36b8a27e9292d22f243d2597ff8557a8e5363cd2cea917a498fe1f80f9802f35
  - object_id: AGG-GEO-C1-BASE-Q6-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-google-ai.md
    content_sha256: c9435a0871c584b6e2a6a011f9fe68a330ebc14d7790343c70f5c3b4897f6e8d
    file_sha256: 40514fdf09168ab783ebab63a61b8d108c8e5e9784803db301c5d9217ae52730
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-google-ai.md
    snapshot_sha256: 40514fdf09168ab783ebab63a61b8d108c8e5e9784803db301c5d9217ae52730
    entry_key: 372cf2da2e2e18cfd3abe9cf4e2414aec5e3afcd4cd9b89b22b432ff052e92c9
  - object_id: ARV-GEO-C1-AFTER-Q1-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-claude-1-reviewed.md
    content_sha256: 3c8b77bfb8fc76271bbcf0a167a822f3e83db3e4ca0a7f588309e0e683aa6852
    file_sha256: d2a47f7de442c18879e1a035f053c7e4e8da6c844a377df878670f37f6b7a301
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-claude-1-reviewed.md
    snapshot_sha256: d2a47f7de442c18879e1a035f053c7e4e8da6c844a377df878670f37f6b7a301
    entry_key: 37f1455139fac55d5fc7559fc3e6f7bb54d4982d5d4ae032a4a42591fc2978f7
  - object_id: SMP-GEO-C1-BASE-Q4-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: d1ebb9fa5dfaffc2780178f36804c6763f3a7aa4dd10ae14da9ca8683b333a60
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-gemini-1.md
    snapshot_sha256: d1ebb9fa5dfaffc2780178f36804c6763f3a7aa4dd10ae14da9ca8683b333a60
    entry_key: 37f71c4f7774cbad5ac9d16beaf6ae7c80e438767c841dbf9ce59ace4330c62d
  - object_id: SMP-GEO-C1-BASE-Q3-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 409fd5aef06483e40b94404ef66072b09487cdeed2ffa4ecac762ae9db2512ed
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-claude-1.md
    snapshot_sha256: 409fd5aef06483e40b94404ef66072b09487cdeed2ffa4ecac762ae9db2512ed
    entry_key: 37fea83dfb29e754c27d93cbd3e66d7338642c1808d96009cf5bc5a64e311515
  - object_id: SMP-GEO-C1-BASE-Q4-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 59994de79573a10bb5376281b8bacd366be8450cae313c59d7c0e3071792a2f4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-google-ai-2.md
    snapshot_sha256: 59994de79573a10bb5376281b8bacd366be8450cae313c59d7c0e3071792a2f4
    entry_key: 39c110ba085a084e8ba1296e47848dcb05a3db1cdf3d3bd1067a2c3b7d9a1ead
  - object_id: DOC-GEO-E2E-CAMPAIGNS
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-campaigns.md
    content_sha256: ac11c76d89484a02665ea448ec8dbc835a8227ee836d7d049c487cc64e521b8c
    file_sha256: 800fb382d8f1751e5939f95a7168e1a4381f860ac4e2ce59c941558a685c5026
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-campaigns.md
    snapshot_sha256: 800fb382d8f1751e5939f95a7168e1a4381f860ac4e2ce59c941558a685c5026
    entry_key: 3a21b6ed5d98d041c9a477283bbd27495db25e2730d188ea762b00c23a4784d2
  - object_id: SRC-GEO-E2E-LEGACY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-legacy.md
    content_sha256: 115347126b40e11f3aaa82b2cf9b793751c02bc82808fd3984c6c1b257bed8d8
    file_sha256: 80a77b275ad7cbe00829521ec5a42f78579ecbe6c713682c512dd0e3b87855b3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-legacy.md
    snapshot_sha256: 80a77b275ad7cbe00829521ec5a42f78579ecbe6c713682c512dd0e3b87855b3
    entry_key: 3bf05090817fb858485c8a96f251c8f6eddd114cad2411ee0c28597c30754d23
  - object_id: AGG-GEO-C1-BASE-Q3-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-gemini.md
    content_sha256: 7f5a14635340a5f5fe1ef4cdba75a1cd5bffe104d04053b785b08a9423d7f55f
    file_sha256: 33297c385212bb47ef997cd9d22d86cd09b1811ac34dff3a78f11059f9f50f27
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-gemini.md
    snapshot_sha256: 33297c385212bb47ef997cd9d22d86cd09b1811ac34dff3a78f11059f9f50f27
    entry_key: 3c0dd03ce581e8123f70254a8839f0de6d2e6c0a6e3eb6d27041e6e34690dbb6
  - object_id: FND-GEO-SITE-C1-BASE-OFFICIAL-META-DESCRIPTION-PRESENT
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-official-meta-description-present.md
    content_sha256: 06f484593238390540c3c812626d8ca01a77c892956c7cb06fc02b6ff8a3b005
    file_sha256: e279f4abd972569442fc8252c2fc2b630ccf8715a0dea7c1b2b685b165412a4f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-official-meta-description-present.md
    snapshot_sha256: e279f4abd972569442fc8252c2fc2b630ccf8715a0dea7c1b2b685b165412a4f
    entry_key: 3c27afb57e5eabb34cf1d05fb252397791ba7aafc5321fbea2a07167b31a0bab
  - object_id: SMP-GEO-C1-AFTER-Q5-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: a950ac99aa39f294fde9fc8c5761661150ac8d385e8e49f581fd0e8b03385aa0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-chatgpt-2.md
    snapshot_sha256: a950ac99aa39f294fde9fc8c5761661150ac8d385e8e49f581fd0e8b03385aa0
    entry_key: 3c29e8380eb3cb22927a0a66cc8befb603c706aed7aeff2b6ff24fe7a4a5eba7
  - object_id: ARV-GEO-C1-AFTER-Q6-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-chatgpt-1-reviewed.md
    content_sha256: 027a1927e1ec9031551373fe982589d156e2b542fa7d7a269cd0fdc653ae796c
    file_sha256: 2c255da4f92541bebf37698032600279ff2cb3f05e17027ac593e58213f72665
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-chatgpt-1-reviewed.md
    snapshot_sha256: 2c255da4f92541bebf37698032600279ff2cb3f05e17027ac593e58213f72665
    entry_key: 3c3adc0ec4b87b7466e12ca727154869271bb93f668aff1df9a2060cc02a081e
  - object_id: DOC-GEO-E2E-VOICE
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-voice.md
    content_sha256: f2b26587bb6f73725e275c09fcdd3747a482c8369c0891d1600c9151316c9bb4
    file_sha256: ee357e82630bb369657c26bf2755621adaf1d635ba7c2fd6812eaddd2e56ee80
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-voice.md
    snapshot_sha256: ee357e82630bb369657c26bf2755621adaf1d635ba7c2fd6812eaddd2e56ee80
    entry_key: 3d1613e00260f33e1d94c7184d0976a0f4194b96b37d00489e235d9255b61f51
  - object_id: ARV-GEO-C1-AFTER-Q1-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-claude-2-reviewed.md
    content_sha256: 7df15c6214227ff5663f2d9bb1b789b8961212f77e8c1798745c82825ad598b5
    file_sha256: b95521220c83150058a85be8ab72788dd931fe46995d89368e199450c979c582
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-claude-2-reviewed.md
    snapshot_sha256: b95521220c83150058a85be8ab72788dd931fe46995d89368e199450c979c582
    entry_key: 3d95855ed8f847750e4f971f213f0a48caa4fb62027eace209c081890d8c22fb
  - object_id: SMP-GEO-C1-AFTER-Q3-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: d4605660511f43e836299ed216c58bb0a309e98b7c35d0fbbff8f33b51fd476d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-google-ai-2.md
    snapshot_sha256: d4605660511f43e836299ed216c58bb0a309e98b7c35d0fbbff8f33b51fd476d
    entry_key: 3e9c8bfb6dc7e29c45592c8931093b00d0e1cff3121b74113f4f86f9a23ec22b
  - object_id: DOC-GEO-E2E-ONBOARDING
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-onboarding.md
    content_sha256: 3edaab1a20a56c87db0265bb28fc27d5c4c64bab385699f515931e17687fcb8c
    file_sha256: 39d0eddb9b65796f1262d4a250b8271637ae5ecdc29dba0b18769a4a7e24a7eb
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-onboarding.md
    snapshot_sha256: 39d0eddb9b65796f1262d4a250b8271637ae5ecdc29dba0b18769a4a7e24a7eb
    entry_key: 3eb60c702a33935ab69b0309b2b3e80530c2a3be3bd8b8e059dd932436086efd
  - object_id: SMP-GEO-C1-BASE-Q5-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 11494090046cf5e81c0560e7743431bcb30a6a2b4184a2916007985bd54714af
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-gemini-1.md
    snapshot_sha256: 11494090046cf5e81c0560e7743431bcb30a6a2b4184a2916007985bd54714af
    entry_key: 3ebdc83cf32788c71e91a44b359deb38e9875cd6095c86d60c5aec6ceebd1f10
  - object_id: ARV-GEO-C1-AFTER-Q1-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-google-ai-1-reviewed.md
    content_sha256: 80d0030fa9d7704e5fb6c5088465561ba48e079378af49405fd559c5e633b99d
    file_sha256: 7cdb135873a61edef89199172105901f55ee990e6da4843a47b709e66b1f4678
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-google-ai-1-reviewed.md
    snapshot_sha256: 7cdb135873a61edef89199172105901f55ee990e6da4843a47b709e66b1f4678
    entry_key: 3fa47eaaf61e0ddedadce71db1ea1e3da18b6ab42c5a5be8996a78bcdccc6836
  - object_id: DOC-GEO-E2E-ANSWER-DEFINITION
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-answer-definition.md
    content_sha256: e982319badeffd7faf9b90b3ea74c4912f4bded37f57ee72318fa4cca56bcaeb
    file_sha256: 812211777d82da2ca268dd8cd1720e9b7d5d696c7e2067f5854852c6f5455854
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-answer-definition.md
    snapshot_sha256: 812211777d82da2ca268dd8cd1720e9b7d5d696c7e2067f5854852c6f5455854
    entry_key: 3fca16d8cd9f330e953380019186ffaadf76a5221af1c69e2a524ca747e57c48
  - object_id: CLM-GEO-E2E-CASE
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-case.md
    content_sha256: 9cddd8a4732579c1ea633d2c66b028f8d72aeb6f15123fc3543b52cbf17e1df7
    file_sha256: df5dbdd400deaf7ed8a994700c3467639cf6e9e5178815e1672ed4633459620f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-case.md
    snapshot_sha256: df5dbdd400deaf7ed8a994700c3467639cf6e9e5178815e1672ed4633459620f
    entry_key: 401fe990065ddc9d33bd0b9d944ec1cf4389f771ea1808c06b982de513e4cdef
  - object_id: ARV-GEO-C1-BASE-Q5-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-1-reviewed.md
    content_sha256: d0094393865b5f15ff31df6db72808b0c4e0a47f7a7040cb6fe65494303e7b7e
    file_sha256: ab0f6abe1f92e8bf83c800ffb020102f529a8263e9acc1d0334136baf5b4da5a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-1-reviewed.md
    snapshot_sha256: ab0f6abe1f92e8bf83c800ffb020102f529a8263e9acc1d0334136baf5b4da5a
    entry_key: 404857bb54819d93392e2cc6544827c4b372a285faa0f21d33cb2ecf554fc221
  - object_id: ARV-GEO-C1-AFTER-Q5-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-perplexity-2-reviewed.md
    content_sha256: 55d63a7e20c1d419e6c42ba79a20ec3f73e94c9d59a91fc3250de4e758c1be02
    file_sha256: 5d1950f4d9b17d24318bd4217107937013df134b3df5f1a142961737dc95790d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-perplexity-2-reviewed.md
    snapshot_sha256: 5d1950f4d9b17d24318bd4217107937013df134b3df5f1a142961737dc95790d
    entry_key: 414c296f0dd2371b07c2caaae1609025d9a874adab74f1cdfe9f27f8ec4c6dec
  - object_id: SMP-GEO-C1-BASE-Q6-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 7f38464d79aa093488bd2c98b4911014576514fbaec65d2f6382b84d0b42dd08
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-perplexity-1.md
    snapshot_sha256: 7f38464d79aa093488bd2c98b4911014576514fbaec65d2f6382b84d0b42dd08
    entry_key: 4175212d8a8c3d23d6de32892bd12ab1a3e041706e62a56efede50d094b83efb
  - object_id: CLM-GEO-E2E-CAMPAIGNS
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-campaigns.md
    content_sha256: 3987871042f7f7afed241d9b0fcf21cdf7a041c4849d71dfc019b3aee7716ea2
    file_sha256: 3e9e34fe7fe193d4a16fd3ce5c6fefdace0d8794cb3d44c91132e1f63b138a0f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-campaigns.md
    snapshot_sha256: 3e9e34fe7fe193d4a16fd3ce5c6fefdace0d8794cb3d44c91132e1f63b138a0f
    entry_key: 42a875b9d24f9f519d57c4eb7047060e44c27275d3942c7cb4b18ed04a4bab15
  - object_id: CLM-GEO-E2E-AUTOMATION
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-automation.md
    content_sha256: 93e1c25d15e397d249e71905bd51a80b5af9be0d998e9032667dd3402089e880
    file_sha256: 28a5428875224946ee4a72e56b81dffdc8a7cdd51d1dd09bf225694b79951755
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-automation.md
    snapshot_sha256: 28a5428875224946ee4a72e56b81dffdc8a7cdd51d1dd09bf225694b79951755
    entry_key: 4396806df1716b97beaba3d2e8a44898efdf7825610a61b768f6960c8eb00a68
  - object_id: FND-GEO-C1-OFFICIAL-3
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c1-official-3.md
    content_sha256: 3daef52ef46f5d4790abc371610c70d2c2a0e42a3b9562aadab590ea79b00a87
    file_sha256: bc49dca300f09316d1d054c7bf1674eaec73c14b8d7fc3425b161bd77a769f8e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-c1-official-3.md
    snapshot_sha256: bc49dca300f09316d1d054c7bf1674eaec73c14b8d7fc3425b161bd77a769f8e
    entry_key: 445571817fab72f7258493c00f53680fccdd59f97ad8a2c9b2c71cbd4fa58269
  - object_id: SMP-GEO-C1-BASE-Q1-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: a9142054c005b3bb7b0a884813036a2ced3f6b607df78076cfd3c9df8c5cf579
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-1.md
    snapshot_sha256: a9142054c005b3bb7b0a884813036a2ced3f6b607df78076cfd3c9df8c5cf579
    entry_key: 44be137fd6b04d557bd9db2d223a329b494a13df4c7d10f83caa1e75b68735db
  - object_id: AGG-GEO-C1-BASE-Q1-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-perplexity.md
    content_sha256: 2795dde115402f526cbfeca54ac6c476421e3d64a312b097cec25748c502223b
    file_sha256: bb144cecfca0b3123127a176c0f4b6c8c5bf368b35fe33579bbc00a3fb071dca
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-perplexity.md
    snapshot_sha256: bb144cecfca0b3123127a176c0f4b6c8c5bf368b35fe33579bbc00a3fb071dca
    entry_key: 45b2a4c3e234d8244a849bca57e72a726f600b8162fb12a97a39967feb5c061b
  - object_id: SMP-GEO-C1-BASE-Q1-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1cf5f8ed6fb5e84340fd3b79396201942ef68e1b23743f55169914a622e4e181
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-claude-1.md
    snapshot_sha256: 1cf5f8ed6fb5e84340fd3b79396201942ef68e1b23743f55169914a622e4e181
    entry_key: 473df92f58046f1dafc6e5af8e8c6cde9f383be2152a3a6558896e48c0d7f7bc
  - object_id: SRC-GEO-E2E-COMPARISON
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-comparison.md
    content_sha256: 24e1cedf6efc20a99384f95baa7f873d352a7f4f44ddb1881a87f22fe10ae271
    file_sha256: 86e4b804c125127323dca43c7c54797b24422da6dee92498703d8b990957636a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-comparison.md
    snapshot_sha256: 86e4b804c125127323dca43c7c54797b24422da6dee92498703d8b990957636a
    entry_key: 47681f773644f3c5fdd8ae3a8fda042330bd63d837b1d55ee87958a7467a46be
  - object_id: ARV-GEO-C1-AFTER-Q6-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-chatgpt-2-reviewed.md
    content_sha256: fed2e445174edbd49f2d1723ad05e4126ad7b72d733dba3f880be7b37448f04e
    file_sha256: 4a0a39db631ed7bc78a56d83b9ef66c8f65a83ec6ba65106bc0815f70cd3ef88
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-chatgpt-2-reviewed.md
    snapshot_sha256: 4a0a39db631ed7bc78a56d83b9ef66c8f65a83ec6ba65106bc0815f70cd3ef88
    entry_key: 47769c5dc790384db3fb5eabcc71437593e953370aff2a223fd623ad1cbcf46f
  - object_id: SMP-GEO-C1-BASE-Q5-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 514675d181f74859d2c768ad9035919681da5de739a3e4a8378606776cddf0d7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-claude-2.md
    snapshot_sha256: 514675d181f74859d2c768ad9035919681da5de739a3e4a8378606776cddf0d7
    entry_key: 4830dc57c3633137d186604a9b896cfe4b419870376d89c88008a07f9a5e534d
  - object_id: ARV-GEO-C1-BASE-Q2-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-claude-1-reviewed.md
    content_sha256: f72d9ebb404ba35178367fd6cb426dcc3a022ec901f20ac046bbc13ec55e9f5d
    file_sha256: 03940580ad79d16d5d59d9f50a2d4a7627eb567485b1cd6e68282b694434f84c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-claude-1-reviewed.md
    snapshot_sha256: 03940580ad79d16d5d59d9f50a2d4a7627eb567485b1cd6e68282b694434f84c
    entry_key: 490c8aa7a4b2c9a4fd7d913193d4e53763b8d1592446b6a9d2fed928fe2eedf4
  - object_id: ARV-GEO-C1-BASE-Q4-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-gemini-1-reviewed.md
    content_sha256: b57bc28f79067b18c0aeaac5472b414708a1c269ababcb8d2838c10cbefee00c
    file_sha256: 514c8fad15d64e33f68386da51f31af49e9e02bb6f419014324df4776a3b3940
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-gemini-1-reviewed.md
    snapshot_sha256: 514c8fad15d64e33f68386da51f31af49e9e02bb6f419014324df4776a3b3940
    entry_key: 491e4786ded5f0ff1b459c92dbcd87f96e90bc30273b6e460ac55fb4ed89e0b3
  - object_id: SMP-GEO-C1-AFTER-Q2-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4239868072d80775517f66f78e9547708380075692b1fbb947ee996d87698859
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-chatgpt-2.md
    snapshot_sha256: 4239868072d80775517f66f78e9547708380075692b1fbb947ee996d87698859
    entry_key: 4a0ffd3b98b37b8d393f7c9c5df9ee0da3f28b6ee7ff4f630cf8039e38e5ba8a
  - object_id: ARV-GEO-C1-BASE-Q6-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-1-reviewed.md
    content_sha256: b922c3a60a7fd6ec23cd9606548b25f4a948537edf90eeb1c3e6c8075678df8d
    file_sha256: dc2639c52ed8cafb7f5f922ca99b2c91fac0191be6b2467b62be79f4a674393c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-1-reviewed.md
    snapshot_sha256: dc2639c52ed8cafb7f5f922ca99b2c91fac0191be6b2467b62be79f4a674393c
    entry_key: 4b8caa69f9ef50c561de4d561434a293d2c5a6257f84bed9f47d85dd4f4cd55b
  - object_id: AGG-GEO-C1-BASE-Q5-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-claude.md
    content_sha256: 7da029924603f75c7775c8cdf7a32d26dc822920d85ff25d6cf7961ab06717ca
    file_sha256: 6a8714b0ab8e71ed59f7c82cc7f210d8a39928b01789e1d643b3833d70f0db56
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-claude.md
    snapshot_sha256: 6a8714b0ab8e71ed59f7c82cc7f210d8a39928b01789e1d643b3833d70f0db56
    entry_key: 4c0bff95866afb4f375484faf9195c82980f91422fb14a5d4f591b046d13d762
  - object_id: KR-GEO-E2E-C1
    record_type: knowledge_release
    object_version: 1.0.0
    object_path: knowledge/releases/kr-geo-e2e-c1.md
    content_sha256: 18f1cd1c0da4a57c72f02c5d8cee707ea730156d7dc62674996b1ac17bd31f4c
    file_sha256: 44a15648073dfc060d3d2d0a7fec04c2ffde4db415013a9af4fd6037d27a6063
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/releases/kr-geo-e2e-c1.md
    snapshot_sha256: 44a15648073dfc060d3d2d0a7fec04c2ffde4db415013a9af4fd6037d27a6063
    entry_key: 4c38cafc0837baa95f613029253006cc841aaa3471b7e3065d7ab1e01ce6470f
  - object_id: AGG-GEO-C1-BASE-Q6-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-perplexity.md
    content_sha256: 970b668c3f06a659a99fd34dc93448b8addc0540064b81b3c8551ccc282fe1fc
    file_sha256: ab1805eef359b3c189f636d893da20f5c54ba79dce52b69b39c2dba924b475b0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-perplexity.md
    snapshot_sha256: ab1805eef359b3c189f636d893da20f5c54ba79dce52b69b39c2dba924b475b0
    entry_key: 4c9008c6eed33946e223d1e2988a4332659b51b14a3a34ecc2ed7b13d83783e0
  - object_id: FND-GEO-SITE-C1-BASE-THIRD-PARTY-CRAWLABILITY
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-third-party-crawlability.md
    content_sha256: e91bfa0ec2e04024f1ce034827c414931a31ed8191e3a756f816c54fdfa95edc
    file_sha256: 4e22217c77050f8164f04183b957145b45a324916477f7c10dd0948bcc84d898
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-third-party-crawlability.md
    snapshot_sha256: 4e22217c77050f8164f04183b957145b45a324916477f7c10dd0948bcc84d898
    entry_key: 4d3f73ea2485812be5d30c1ccb068b881dd46bcda7b7fe7ee1d2c1256891f164
  - object_id: SMP-GEO-C1-AFTER-Q2-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 6ddcfdeec10fd552e8e418307298a3c0ecff9d1063132e09aaa391f728865bac
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-claude-1.md
    snapshot_sha256: 6ddcfdeec10fd552e8e418307298a3c0ecff9d1063132e09aaa391f728865bac
    entry_key: 4d7e3c723e472c141f007b61379c0583907706fa0acaf7ebe855baa352254754
  - object_id: ARV-GEO-C1-AFTER-Q2-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-chatgpt-1-reviewed.md
    content_sha256: 7f9b3ee1dc76d265399c13ac829546fc622e818634ec3c7c6c613764cd103aad
    file_sha256: d3c254e7760f74dab307cb8d03856206e02de7799c7b5cdf9f9136331fcba04f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-chatgpt-1-reviewed.md
    snapshot_sha256: d3c254e7760f74dab307cb8d03856206e02de7799c7b5cdf9f9136331fcba04f
    entry_key: 4e8d7f98216869a6626d328e0cf496f9401c110d5b047f53cf32d2cbd3c42eba
  - object_id: FND-GEO-SITE-C1-AFTER-OFFICIAL-CANONICAL
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-official-canonical.md
    content_sha256: c56af95ee672b8ffea6954607444ccd50222ac59a1a2bd809e7905c2955f9431
    file_sha256: 45c3312e61acce6912f7b4734379baf1a8d18e306b3e1ee1f9b41acf3835bf31
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-official-canonical.md
    snapshot_sha256: 45c3312e61acce6912f7b4734379baf1a8d18e306b3e1ee1f9b41acf3835bf31
    entry_key: 4eafeb0f3ff16d527a2826e0a57708c00d48d127fb612d29d551b3261c35c24d
  - object_id: EVD-GEO-E2E-ELIGIBILITY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-eligibility.md
    content_sha256: 8ae668b4bb38e19fcc1a10d7ef63231fce19387bea31feb72120f8ec27d0d9f5
    file_sha256: 40b2138d425d41dbae491b74da88cd05329aecb040918569d44af74a6b251116
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-eligibility.md
    snapshot_sha256: 40b2138d425d41dbae491b74da88cd05329aecb040918569d44af74a6b251116
    entry_key: 4edebb1ecdafda587419f7c1faaf8371fee9692c5c0199d5e572ce9328dd1559
  - object_id: DOC-GEO-E2E-AUTOMATION
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-automation.md
    content_sha256: bcbbe60c40d08b23ad454416f2579068f38b6ef5948112a8919aac919c07e309
    file_sha256: 37f5b37285d0c1e58c1005683308e62a5feb7fb175e36aa0d61559e9adaaadc2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-automation.md
    snapshot_sha256: 37f5b37285d0c1e58c1005683308e62a5feb7fb175e36aa0d61559e9adaaadc2
    entry_key: 4f3bf7960139cc343fb128c0ff75e46a38e59235bed877d1b840e4dd73c97134
  - object_id: AGG-GEO-C1-AFTER-Q3-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q3-google-ai.md
    content_sha256: 1cf24251b4dc53f7ff764a79e22841ad54bf08db55a4b1212e92d67270ec515b
    file_sha256: 386eac0bedf9263272ec2c9c8bd8c45f34b40e33db999cb5fd0e19d5e31399ce
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q3-google-ai.md
    snapshot_sha256: 386eac0bedf9263272ec2c9c8bd8c45f34b40e33db999cb5fd0e19d5e31399ce
    entry_key: 4fb2340b51845fdc608c39c2ddd74564babb6c32cf87187dbd5c3cdeebbbbb68
  - object_id: SMP-GEO-C1-BASE-Q2-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 51706afef79c9f785f315a1a61b4548dc79bbd6064fdcc1b396cccebd644e361
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-gemini-1.md
    snapshot_sha256: 51706afef79c9f785f315a1a61b4548dc79bbd6064fdcc1b396cccebd644e361
    entry_key: 5125c90abad7618513b2fb5245a2481ad2d4706aa99acd0c3c53a77717de6250
  - object_id: FND-GEO-C1-OFFICIAL-1
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c1-official-1.md
    content_sha256: fde879c233773f955016da6b2e032edd96648c2361522ff3521775cc4eb2cb69
    file_sha256: 9231b2ccc58f639812dd315c1493224f4a9693170639f1594bef103f3ac6783b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-c1-official-1.md
    snapshot_sha256: 9231b2ccc58f639812dd315c1493224f4a9693170639f1594bef103f3ac6783b
    entry_key: 5179b698c8cbbf88f53afddbcaeaf6cfadf489a8595d5d4259920192654d4a9d
  - object_id: SMP-GEO-C1-AFTER-Q1-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 3b46e720493ccc7ffb0b48a4f4e2f060eaec8eafab79e8161ac9093ea103940c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-perplexity-1.md
    snapshot_sha256: 3b46e720493ccc7ffb0b48a4f4e2f060eaec8eafab79e8161ac9093ea103940c
    entry_key: 51b34ecfe9564043bf3750ca92992e9f43bb49a4f09ac4bdefeaf080597c79ee
  - object_id: SMP-GEO-C1-AFTER-Q5-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f0502ebaa3d6919b35963a60fb095807c1d265baa0f8e4801c72e1e44f2e8557
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-gemini-1.md
    snapshot_sha256: f0502ebaa3d6919b35963a60fb095807c1d265baa0f8e4801c72e1e44f2e8557
    entry_key: 521141ec9348bf3646731230fafc61e69e6bd9ec28d69a8d3f41fd8626881ecd
  - object_id: SMP-GEO-C1-BASE-Q6-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4838bc86c8d610825f5ea4bf8148eeb3d1968c514371af7c56a111999e5f7ead
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-2.md
    snapshot_sha256: 4838bc86c8d610825f5ea4bf8148eeb3d1968c514371af7c56a111999e5f7ead
    entry_key: 525dae22f9600d578feb1004be5596efa75b8a1e2939ab53f3a0411c69e7c1eb
  - object_id: PRP-GEO-C1-OWN
    record_type: asset_proposal
    object_version: 1.0.0
    object_path: assets/proposals/prp-geo-c1-own.md
    content_sha256: aa8586c706ab14f20d5f83abe405ac89d96e89d0bab8d9b6476360421dcdd4b4
    file_sha256: 4ec13dd3e2fea55dbffd7cf83cc270422f18382900b76646d46043dadae82ef1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/proposals/prp-geo-c1-own.md
    snapshot_sha256: 4ec13dd3e2fea55dbffd7cf83cc270422f18382900b76646d46043dadae82ef1
    entry_key: 52892b17dd989285cf6a7ce64ee6b157af8410fe35e02c79ac722ec004bcb330
  - object_id: ARV-GEO-C1-AFTER-Q5-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-google-ai-2-reviewed.md
    content_sha256: ec750f507a51302700006b59928db2809786c3dcdf29a3d0ee71e67bf18c139a
    file_sha256: a6c084757495e5922a1766f39e1a9c485e6ce39f99307a707cf03e2c9749e145
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-google-ai-2-reviewed.md
    snapshot_sha256: a6c084757495e5922a1766f39e1a9c485e6ce39f99307a707cf03e2c9749e145
    entry_key: 52ad7845ee9e6d9dfeac5eb3f44dc7122c117b15165db7001a3ef4e4b266ac85
  - object_id: EVD-GEO-E2E-AUTOMATION
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-automation.md
    content_sha256: 93e1c25d15e397d249e71905bd51a80b5af9be0d998e9032667dd3402089e880
    file_sha256: acde7b80c13130658bdb15db1e6ee1098075116625615c4838b2c949cafdc7d2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-automation.md
    snapshot_sha256: acde7b80c13130658bdb15db1e6ee1098075116625615c4838b2c949cafdc7d2
    entry_key: 54a2f5c19b36ad54ae7f3381cfce1c711faf1a3c0259fc4fd791a10ec545b4b7
  - object_id: AGG-GEO-C1-BASE-Q5-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-gemini.md
    content_sha256: af2f98410219dc6f68ff5b6d6c367561936e36bf781e00213aeacb0aafd7accb
    file_sha256: 921f109b7138acdcd2e8967c4c0c9f571266d3a1454df58df3c498083949ddf4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-gemini.md
    snapshot_sha256: 921f109b7138acdcd2e8967c4c0c9f571266d3a1454df58df3c498083949ddf4
    entry_key: 54d42e2e3fd6eeea95390188098d4261e8e9e88ab8a76b7ca0a5ad993506c554
  - object_id: AGG-GEO-C1-BASE-Q3-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-perplexity.md
    content_sha256: 6df58421fdc2aa8d04a46d1a346f0214cee3183c881e775de542bcbdcf730fd6
    file_sha256: 08c712eebd131604f79b56c08f5399ae470fbef33e69b69dd4ebece51245a9ef
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-perplexity.md
    snapshot_sha256: 08c712eebd131604f79b56c08f5399ae470fbef33e69b69dd4ebece51245a9ef
    entry_key: 55d7a53297830ce400d83e21700779c6e01a7b171dbfbf33b87d7d5ea3d164ef
  - object_id: FND-GEO-SITE-C1-BASE-OWN-META-DESCRIPTION-PRESENT
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-own-meta-description-present.md
    content_sha256: 06f484593238390540c3c812626d8ca01a77c892956c7cb06fc02b6ff8a3b005
    file_sha256: 6fb9591eae3e31e4d6016827d1471fbcd4162e0553a0d159a2e91889f07ffc93
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-own-meta-description-present.md
    snapshot_sha256: 6fb9591eae3e31e4d6016827d1471fbcd4162e0553a0d159a2e91889f07ffc93
    entry_key: 5755028342bdf8dfe459f8bdd83c07075aa5b283236239fde4af4523701c4a61
  - object_id: SMP-GEO-C1-BASE-Q2-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 5b386987f5fa8f0b560e7172d328200586df62c7c58cd49583022b03e3e78572
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-gemini-2.md
    snapshot_sha256: 5b386987f5fa8f0b560e7172d328200586df62c7c58cd49583022b03e3e78572
    entry_key: 57facc656afca6fe9d8e5cef40500204c7bf9455bcf7b779748e25aad9ce16ec
  - object_id: CPF-GEO-E2E-C1-BASE-CHATGPT
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c1-base-chatgpt.md
    content_sha256: 2c38d43b7b12aa1d6fe5912013b5033f50806710895c0113d404223ab83ca262
    file_sha256: 96bf40276cc5105457c744f8ec45589cfa9ef09a09a922b1e8a15e325d1e42ec
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c1-base-chatgpt.md
    snapshot_sha256: 96bf40276cc5105457c744f8ec45589cfa9ef09a09a922b1e8a15e325d1e42ec
    entry_key: 58549efe3f8b01a8b32e79c9bb4754c4b6c48fefc7a5bfa62a6cb5b172e36290
  - object_id: MER-MYYSHOP-001
    record_type: merchant
    object_version: 1.0.0
    object_path: execution/identity/merchant.md
    content_sha256: fe78dcaa3f721df1e7e16170d3894b3c4b98c61f3fe2545f4272042d10e59beb
    file_sha256: 03797ad886848a758bd33376e205cadb365b7ded03b996437d5f7204f542af76
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/execution/identity/merchant.md
    snapshot_sha256: 03797ad886848a758bd33376e205cadb365b7ded03b996437d5f7204f542af76
    entry_key: 595308da0b4d7d004c91d0c7cec446834b9f5f119cadf74a15de9f575685c5e6
  - object_id: ARV-GEO-C1-BASE-Q5-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-2-reviewed.md
    content_sha256: 40963eb7d341c56e3a01cd533933749d635c8386ef67d3ee37b46c6ac796d42b
    file_sha256: b1140eec556fc30af7260b41a75c8e68af084182eab534cf2f1cea84c3bb2004
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-2-reviewed.md
    snapshot_sha256: b1140eec556fc30af7260b41a75c8e68af084182eab534cf2f1cea84c3bb2004
    entry_key: 59a462ff0e771faa2ae4a2c1d75c0fdd3bab2a0baa8917f083cb90a5fdc2df4d
  - object_id: FND-GEO-SITE-C1-BASE-OWN-CANONICAL
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-own-canonical.md
    content_sha256: 38f0dce4fe2d1d91f1731627f634e45f44cede066889a9ccb120e84374dace50
    file_sha256: c7bae4193d9f90dc448e011591369300cf468b89b9cde88b1ceadc5a2758fd69
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-own-canonical.md
    snapshot_sha256: c7bae4193d9f90dc448e011591369300cf468b89b9cde88b1ceadc5a2758fd69
    entry_key: 59c2f38a3421d63d1751d9f813278f3aa562d4f10725fe13fbf51a5bc2268405
  - object_id: SMP-GEO-C1-AFTER-Q1-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: e9e9671c189a4b8182748e3b63a4fbe2eb68c2e7e232378171a9cf49f699e26a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-chatgpt-1.md
    snapshot_sha256: e9e9671c189a4b8182748e3b63a4fbe2eb68c2e7e232378171a9cf49f699e26a
    entry_key: 59d76e105bf2db0007970879f335975d32472fc7f3432a717bc90a2e6ff8d178
  - object_id: ARV-GEO-C1-BASE-Q3-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-claude-1-reviewed.md
    content_sha256: 237cf18448497d479b44166717005ff2ef3f80255606af26f32630db66aaf270
    file_sha256: 628cd9e0b82c4a42a4dc1c5c372dab4c0fc1742422f3a213ce89cbf483585264
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-claude-1-reviewed.md
    snapshot_sha256: 628cd9e0b82c4a42a4dc1c5c372dab4c0fc1742422f3a213ce89cbf483585264
    entry_key: 59f09a4dcb31361cef32edfc0c7888ca2e4d61cb9f661c0b65ea26d5909790a6
  - object_id: ARV-GEO-C1-BASE-Q4-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-2-reviewed.md
    content_sha256: 996d6133ee1d2e65df081f4ca724838400e43f333c770157a1a468a0150c7841
    file_sha256: 658993f71851313bb1254325a62adb8bd56f6b9abc16bd4128aa6467c04e70d3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-2-reviewed.md
    snapshot_sha256: 658993f71851313bb1254325a62adb8bd56f6b9abc16bd4128aa6467c04e70d3
    entry_key: 5a714165347c9fe0875e69513ae052a29019328c9b23db65b00980a42e5941df
  - object_id: CLM-GEO-E2E-ELIGIBILITY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-eligibility.md
    content_sha256: 8ae668b4bb38e19fcc1a10d7ef63231fce19387bea31feb72120f8ec27d0d9f5
    file_sha256: 78b1021f050f3e6eae7ad634107594952385d9266aef35f18be9330af42b7a7b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-eligibility.md
    snapshot_sha256: 78b1021f050f3e6eae7ad634107594952385d9266aef35f18be9330af42b7a7b
    entry_key: 5de47ca8a51238272a948f57d43ec6ae2ee4c9d9a311a1e7e6ec3396754f6a4b
  - object_id: AGG-GEO-C1-AFTER-Q5-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q5-claude.md
    content_sha256: 7459317cb9729f6f1741867bad331bfc4c40f61abb908c8dce7aae0eb751fa04
    file_sha256: 9ea0db68e150273c1ddd74a842d9d97fca1253d01307a8e4be0f1a89871f9841
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q5-claude.md
    snapshot_sha256: 9ea0db68e150273c1ddd74a842d9d97fca1253d01307a8e4be0f1a89871f9841
    entry_key: 5e327c727be13adf6b2fb8d7e608d3004753300a5659229c311572720a616ddc
  - object_id: ANS-GEO-E2E-C1-1
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c1-1.md
    content_sha256: 62c8358df3358e11e0162d62e94b0bbabab0e7eedbf0ba4898545d17f273f216
    file_sha256: 3999730ee94d2a36710279db62a093b54ce42cc86aae821a773e3bfced15e449
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/answer-cards/ans-geo-e2e-c1-1.md
    snapshot_sha256: 3999730ee94d2a36710279db62a093b54ce42cc86aae821a773e3bfced15e449
    entry_key: 5e42c3745aaf78fa4da733cde8496339eee322f7e92ea531ba6adb12a2ff3a13
  - object_id: SMP-GEO-C1-AFTER-Q2-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 859b3adf9ca1b348c0cf5e7cd8837f2c9e0d0128d4b646089391ba7588846c78
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-claude-2.md
    snapshot_sha256: 859b3adf9ca1b348c0cf5e7cd8837f2c9e0d0128d4b646089391ba7588846c78
    entry_key: 5ec19fce63d6a81c3fa0bd1db567790f158852f32275415b59521df33d27220f
  - object_id: AGG-GEO-C1-AFTER-Q3-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q3-gemini.md
    content_sha256: 0d9248540ed497ec577eb377f37a6ef70932fb7fc82824556e3c60b5a44ad56c
    file_sha256: 92b77552289b70de626fa1b22fe65ba70d4b146fa7959b81f1e49d10ae5ebeb8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q3-gemini.md
    snapshot_sha256: 92b77552289b70de626fa1b22fe65ba70d4b146fa7959b81f1e49d10ae5ebeb8
    entry_key: 5f9503f2d4272bc6a27e7c45b9867e2cb61de033f14832b99bcb4384d754a4ce
  - object_id: AGG-GEO-C1-AFTER-Q4-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q4-google-ai.md
    content_sha256: 8a3aa410aa35c39e1bdeffb7121f7d5b95b60eaed0cf59cbefea25745d62ae11
    file_sha256: 7288a8a74be7045c55d2e9bcb02806b2c71dc1c5150d8f778b3dea455a568b93
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q4-google-ai.md
    snapshot_sha256: 7288a8a74be7045c55d2e9bcb02806b2c71dc1c5150d8f778b3dea455a568b93
    entry_key: 5fe81ea4ecc793917ed683e6dd8d7a6ead82eb4e8d0e8322b0f15313917cecce
  - object_id: FND-GEO-SITE-C1-BASE-THIRD-PARTY-SCHEMA-SYNTAX
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-third-party-schema-syntax.md
    content_sha256: 07cea7107fbb21d3b3fd7559fe96e8a83888e13b321f85eb7f4764e56f0a6518
    file_sha256: fda230ea23d42c26634f1dc32f7f7cdde3aec757f78ad0f14fc17fe4daca9456
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-third-party-schema-syntax.md
    snapshot_sha256: fda230ea23d42c26634f1dc32f7f7cdde3aec757f78ad0f14fc17fe4daca9456
    entry_key: 6016c766b90be5b207ccb8db129e33690be78d68d200b2da00793d1e8d4dbf4c
  - object_id: SMP-GEO-C1-AFTER-Q2-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 28b8bcef35b262769f86a569c621dce5e73750ccc42d24dfe83a9ead724214a2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-google-ai-2.md
    snapshot_sha256: 28b8bcef35b262769f86a569c621dce5e73750ccc42d24dfe83a9ead724214a2
    entry_key: 616d4f4ba09847533476275ef012f97f9dcf00fa9622b243864c311148fceaa5
  - object_id: ARV-GEO-C1-BASE-Q6-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-gemini-2-reviewed.md
    content_sha256: bac22b6cf8bcb1354ee1d60c86b31675cced7a1bd2ed6929916bb841ae9d560d
    file_sha256: 7481edab2f2114d6ba1a0c9f625404f428b2c7e61ad2a06fa1b546ccce88d7fc
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-gemini-2-reviewed.md
    snapshot_sha256: 7481edab2f2114d6ba1a0c9f625404f428b2c7e61ad2a06fa1b546ccce88d7fc
    entry_key: 62a3d7de3cf650b3c1b3b73d590ba7f95c199c22f122ab1586f6dec487f8343e
  - object_id: ARV-GEO-C1-AFTER-Q1-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-gemini-2-reviewed.md
    content_sha256: cddd8651e1ea6a78a260dca01f6debfe6656ae5835381e5225e7d58cac5564eb
    file_sha256: e0c665448c38fcdfe0ebfb30f53ddd073a8cef4c802cb3800ed077e68ce240af
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-gemini-2-reviewed.md
    snapshot_sha256: e0c665448c38fcdfe0ebfb30f53ddd073a8cef4c802cb3800ed077e68ce240af
    entry_key: 62d4231920dbafef71fdb5a1822eeab67850716767bbf9922d0ae6e7621560c3
  - object_id: AGG-GEO-C1-AFTER-Q2-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q2-claude.md
    content_sha256: 5fa5cf2234f2a8f2d70cafd46183fa5f231024e034a92330c0f6f1429a6c1e26
    file_sha256: a312a52e5235e23ec320a571e23fc56443de571557b7cbebf65b0d14e76a8f59
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q2-claude.md
    snapshot_sha256: a312a52e5235e23ec320a571e23fc56443de571557b7cbebf65b0d14e76a8f59
    entry_key: 642ec25c1363735defab21ed4c226286fa06132de2a852d36830f9e079fe27ab
  - object_id: SMP-GEO-C1-BASE-Q1-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 3d568ffcee6783a35cc2137e97bb924e312e41b18438ed5b404e4d5ab77e0fd3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-perplexity-2.md
    snapshot_sha256: 3d568ffcee6783a35cc2137e97bb924e312e41b18438ed5b404e4d5ab77e0fd3
    entry_key: 64b382b7352b664427ed332509b16458052d17585cef9d5969fdf984e89c301d
  - object_id: SMP-GEO-C1-BASE-Q1-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 1c33cd4ac60463e7573bf726e480aaf9481d7775163450dd64fdb2bd117e2130
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-claude-2.md
    snapshot_sha256: 1c33cd4ac60463e7573bf726e480aaf9481d7775163450dd64fdb2bd117e2130
    entry_key: 64b7159d8426b2c76a5197b0e650e78f13099a86e90c2be704df529636924f96
  - object_id: EVD-GEO-E2E-GUARANTEES
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-guarantees.md
    content_sha256: c05c6c819824b4a3bbbe50587e611d97dc478fa9777acc9ab0371c4133722b0f
    file_sha256: 0a081c899141ef78f8d4fe70f924baa6512051b1c8ac210f8e83741bdba10242
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-guarantees.md
    snapshot_sha256: 0a081c899141ef78f8d4fe70f924baa6512051b1c8ac210f8e83741bdba10242
    entry_key: 64c46911b2fbdc4350525c4d0be08374a37ccdba8538dc20c52a9504c654ce61
  - object_id: ADR-GEO-C1-OFFICIAL-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c1-official-decided.md
    content_sha256: 258ce8fe08a404363b6efc88cc605af3a4465aa29dcb4ba95737027327716064
    file_sha256: 1a588340c39e4b2d3e1c45e915ed401501b41d03e798e71de8de2850b0e6a6e4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/adoptions/adr-geo-c1-official-decided.md
    snapshot_sha256: 1a588340c39e4b2d3e1c45e915ed401501b41d03e798e71de8de2850b0e6a6e4
    entry_key: 6524ad789704eb4ded5873e683ea1e5ce25be6a91b76d48a517bc287db23872b
  - object_id: ARV-GEO-C1-BASE-Q3-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-2-reviewed.md
    content_sha256: 2e81306580b3ef418768e19bd50f2592d88643ce005774ac3c76149502d02294
    file_sha256: a89ef52bffb6396ef09a4e839a1424bce5595140431645f8a232e58b971eed75
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-2-reviewed.md
    snapshot_sha256: a89ef52bffb6396ef09a4e839a1424bce5595140431645f8a232e58b971eed75
    entry_key: 65360093364cdf5d1f5185a475a9fdcbf3ebb6d390aefc53100fdd1f2bec002b
  - object_id: SMP-GEO-C1-AFTER-Q6-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: b6fcc0c0febe0fb1363b2c75a0c8ccf9b7b3207fe46a553a608aed6612b870f0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-perplexity-1.md
    snapshot_sha256: b6fcc0c0febe0fb1363b2c75a0c8ccf9b7b3207fe46a553a608aed6612b870f0
    entry_key: 68af99515321f605e322c7cdb1d8b6c5d212ffc777ced4ffe46ee10bca73bbb9
  - object_id: SMP-GEO-C1-BASE-Q4-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: baee8ec62149f0bb8557b1cc16b383b3eda7dfb959683194e9ba1bf72e433dbc
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-claude-1.md
    snapshot_sha256: baee8ec62149f0bb8557b1cc16b383b3eda7dfb959683194e9ba1bf72e433dbc
    entry_key: 69ef1676b8cd25e0aec661195efe2aec81e1b503d77d9e471c648d084983e211
  - object_id: CLM-GEO-E2E-PRIVACY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-privacy.md
    content_sha256: 1f715fc357d9cad4ec3309c90babd8e66e0cca6207463f3f5915bed060fc7301
    file_sha256: 269e5d212c7bb1d73e8a9d67fa1781463344864bddd3f7817253c918db9616e9
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-privacy.md
    snapshot_sha256: 269e5d212c7bb1d73e8a9d67fa1781463344864bddd3f7817253c918db9616e9
    entry_key: 69f16f085d957aa19c9b4e7031fbc589a3634a988fa4aebe490fa2d2adb4aa2a
  - object_id: FND-GEO-C1-OFFICIAL-4
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c1-official-4.md
    content_sha256: ec8c79fec36973ff105e2dfb7c36c7e09f4b566d4ee94448fe1081c25efaccf4
    file_sha256: 6108611195a2d067ac8ff2a3213905100bfc3baf55367b6e48a92c2317be0459
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-c1-official-4.md
    snapshot_sha256: 6108611195a2d067ac8ff2a3213905100bfc3baf55367b6e48a92c2317be0459
    entry_key: 6a03e2f82c06a2c71e6d19dcfd88d6d1552b40f6f087c34b986dff2b80e5a3fe
  - object_id: FND-GEO-SITE-C1-BASE-OFFICIAL-CANONICAL
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-official-canonical.md
    content_sha256: 38f0dce4fe2d1d91f1731627f634e45f44cede066889a9ccb120e84374dace50
    file_sha256: 54d2a391e1b791e1bd74fe565c3af8409a50bbbb75d29b09eb4799446bb884b7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-official-canonical.md
    snapshot_sha256: 54d2a391e1b791e1bd74fe565c3af8409a50bbbb75d29b09eb4799446bb884b7
    entry_key: 6a1171448c1e82273cb7547e06987a3adae8db57bb4aff172c052d64c7914be3
  - object_id: SRC-GEO-E2E-GROWTH
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-growth.md
    content_sha256: 29980cbf4cdae009088f030cb6f11189d43d680daa60b66401307b37b9c7e06f
    file_sha256: 5cb4ae9af467a4b283fa4fdc7d6d2ef1b7e0945bd581a58c848bc24ee85ecd6a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-growth.md
    snapshot_sha256: 5cb4ae9af467a4b283fa4fdc7d6d2ef1b7e0945bd581a58c848bc24ee85ecd6a
    entry_key: 6a9a89dc4e1bb55e8a0390d1cd648a2519923a78758f6125f78c89b5c4645ec5
  - object_id: AGG-GEO-C1-AFTER-Q1-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q1-chatgpt.md
    content_sha256: 0e70582475cd95f168b2f37f0b099c23b39291b43dab006f8cf26695a665747f
    file_sha256: 1362105f396feb8cb652f3f3c298ec88ecf0c91d284dbf2b036e39b6d46d82cd
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q1-chatgpt.md
    snapshot_sha256: 1362105f396feb8cb652f3f3c298ec88ecf0c91d284dbf2b036e39b6d46d82cd
    entry_key: 6afbd9bb2c227ace7fc17e7df1b27fa994e45346b30435c4229bf55c3b6567b1
  - object_id: ANO-GEO-C1
    record_type: analytics_observation
    object_version: 1.0.0
    object_path: cycles/m6/analytics/ano-geo-c1.md
    content_sha256: 65421194cea985633a204dd88ab9ec5d85d9acd9c3404dedd94dab8cbff18608
    file_sha256: 125ce526a0213f8674fea36499d6032280ac332d7f7f4ab57b641cd6d8ff2ef8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m6/analytics/ano-geo-c1.md
    snapshot_sha256: 125ce526a0213f8674fea36499d6032280ac332d7f7f4ab57b641cd6d8ff2ef8
    entry_key: 6b42eea832523773cb8347e56ac3c23752a4ea58ade019dc0be7d0e44052cd70
  - object_id: SMP-GEO-C1-BASE-Q2-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 7df10abd4859e69ea9312963be66aa677c817b8ac8a259f8078f806c0099c777
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-2.md
    snapshot_sha256: 7df10abd4859e69ea9312963be66aa677c817b8ac8a259f8078f806c0099c777
    entry_key: 6bc3298791575c3a1d151517b19c04c8906d5fdc063b05a41b8ab08943811eaf
  - object_id: SMP-GEO-C1-AFTER-Q3-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 5ef426e478671d7e718bdb5a0d7ca7646b402f1ddcb40dd1b701d3186817458d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-perplexity-1.md
    snapshot_sha256: 5ef426e478671d7e718bdb5a0d7ca7646b402f1ddcb40dd1b701d3186817458d
    entry_key: 6d61b6920e504a8fa17d3e688cd7169d8d69bbd3f689bf912f54cd88ff4f0914
  - object_id: SMP-GEO-C1-BASE-Q6-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1694d354607d47eafe9588cb65e3180ac40c054f782a89e6dd64213549eb1a6a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-gemini-1.md
    snapshot_sha256: 1694d354607d47eafe9588cb65e3180ac40c054f782a89e6dd64213549eb1a6a
    entry_key: 6e13f4327086d775bfd09d17107e9f187f12e75cb62742f37ba6a99bd29c6590
  - object_id: ARV-GEO-C1-AFTER-Q1-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-chatgpt-1-reviewed.md
    content_sha256: b54ca3d25eba5f2cd8a7d3efff6645316c763b7f2aa71b98ebd853f4952ca90c
    file_sha256: 01e5060260808ea6b0942950492702c5330c890579290b5a6050e0c23b5eec92
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-chatgpt-1-reviewed.md
    snapshot_sha256: 01e5060260808ea6b0942950492702c5330c890579290b5a6050e0c23b5eec92
    entry_key: 6e25a2683d29c2f8adab449eb4cb810e218b33ec11b83a48b5cbb6f9027782ff
  - object_id: ARV-GEO-C1-AFTER-Q5-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-chatgpt-1-reviewed.md
    content_sha256: 985c3ba8a7881f86b086ec243e597c91705f3660b9448eb619710dc11b84c825
    file_sha256: a9e550843a4aba6f0a39f258a7cfc15d1ae184617c1a097e74a25574fdcff86f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-chatgpt-1-reviewed.md
    snapshot_sha256: a9e550843a4aba6f0a39f258a7cfc15d1ae184617c1a097e74a25574fdcff86f
    entry_key: 6e3608ccab7da952d01bdeca5687f4c06ebbbd23abc0b6e2d9e61c50b74d24fe
  - object_id: SMP-GEO-C1-BASE-Q5-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: f5a119e0782a278f314513e9b8f1135a31fe76b074d32edefb6092eb3394df3b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-gemini-2.md
    snapshot_sha256: f5a119e0782a278f314513e9b8f1135a31fe76b074d32edefb6092eb3394df3b
    entry_key: 6e6794d899ae54bf16b45430ea8b322c14d843fdb4bcb71e52cf216c8aac8ade
  - object_id: ARV-GEO-C1-AFTER-Q4-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-google-ai-1-reviewed.md
    content_sha256: c71fe0c096ce1336dbfa35d2f542b6f410d3633acd9a242c1b97907eb59fe931
    file_sha256: f4072c701c4ca54c397979815092778c1254fcccf28be91b2fb3d3d3f2c8e814
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-google-ai-1-reviewed.md
    snapshot_sha256: f4072c701c4ca54c397979815092778c1254fcccf28be91b2fb3d3d3f2c8e814
    entry_key: 6f9537a866c90becdfd2e19462997442ea697812bfae0ed08f68e663cb7cfb65
  - object_id: AGG-GEO-C1-BASE-Q4-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-chatgpt.md
    content_sha256: 30fdb796d0f0bff026c4e15c98a3f37724a11d4d16a6ec86888c2e3c6ea6135d
    file_sha256: 0cae6488f1e8abeec09e3b85dc05220ed3cd6cae1e04c5eee5b29369010894e3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-chatgpt.md
    snapshot_sha256: 0cae6488f1e8abeec09e3b85dc05220ed3cd6cae1e04c5eee5b29369010894e3
    entry_key: 6ffaf764b53b4f8f3a40d961c87cea1505a3b0850eda07aa01b97d1d64aaa1e4
  - object_id: AST-GEO-E2E-C1-OWN
    record_type: asset
    object_version: 1.0.0
    object_path: assets/own/ast-geo-e2e-c1-own.md
    content_sha256: 05e3ca52c30aa01e4db24e638a04c5b75022ac63a26667e65977cb8c3e609bc2
    file_sha256: 35549816e5870fc251e522e5de2971b68ffcaacec141d49bbc7e6dfc12834a2e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/own/ast-geo-e2e-c1-own.md
    snapshot_sha256: 35549816e5870fc251e522e5de2971b68ffcaacec141d49bbc7e6dfc12834a2e
    entry_key: 72535f0a995e5cc828a65c44d079595c21c43307e307986e9cc5b0c53f748715
  - object_id: SRC-GEO-E2E-CAMPAIGNS
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-campaigns.md
    content_sha256: 3987871042f7f7afed241d9b0fcf21cdf7a041c4849d71dfc019b3aee7716ea2
    file_sha256: a3e73cf610800affd058b484506bae1a6e06bc8f335b1809a9eafb7024304a83
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-campaigns.md
    snapshot_sha256: a3e73cf610800affd058b484506bae1a6e06bc8f335b1809a9eafb7024304a83
    entry_key: 7253e90a1b8932ca98e705b546a40cb574889fd473e1749525f2698144f5fc28
  - object_id: SMP-GEO-C1-BASE-Q5-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 9d216483a54f3e8f1a2be257d3deb46bde5ad04f02c93372344ed42f4a71fad5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-google-ai-2.md
    snapshot_sha256: 9d216483a54f3e8f1a2be257d3deb46bde5ad04f02c93372344ed42f4a71fad5
    entry_key: 72a19ddebd0ba136fd5777d0def95ba0f6d82bf3d1ba68e02d502a6e1a7cd15a
  - object_id: SMP-GEO-C1-AFTER-Q1-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 11303dc62bad483ba1a74dbfd2f1e5e29f2cbb5a1f4dc6a5527545262c2d52b4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-claude-1.md
    snapshot_sha256: 11303dc62bad483ba1a74dbfd2f1e5e29f2cbb5a1f4dc6a5527545262c2d52b4
    entry_key: 72a646893ac5884f9907840fcd81af36f90c01a01796f183ba090c576cd1a054
  - object_id: ARV-GEO-C1-AFTER-Q3-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-gemini-1-reviewed.md
    content_sha256: 09dc9f8284ee899547e2326744eadf306bec92075abc488b14ecd83aac59d640
    file_sha256: ff03ccd890f8da5f0ef859a0d8722e5fb52bb55de0f2ae7b08a80df62e6345ef
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-gemini-1-reviewed.md
    snapshot_sha256: ff03ccd890f8da5f0ef859a0d8722e5fb52bb55de0f2ae7b08a80df62e6345ef
    entry_key: 7379679e6a020535dfade9a31153812ee8edd2dd8613f2b67903fae099bd4407
  - object_id: ARV-GEO-C1-AFTER-Q2-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-google-ai-1-reviewed.md
    content_sha256: 58195e14d5a870ee4a048f5e5a2e12fe0f2c3bc8e47f8a190bec42f899f19f11
    file_sha256: 248a127d3a48fb7026edc17c51a44385cd2a0d1e427700c61c17ff5f222eabf3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-google-ai-1-reviewed.md
    snapshot_sha256: 248a127d3a48fb7026edc17c51a44385cd2a0d1e427700c61c17ff5f222eabf3
    entry_key: 746344c8e6f2a26ea96d817b3ebf0ccc25aeeda6fd204df6b98bf7e4b517eb18
  - object_id: ADR-GEO-C1-THIRD-PARTY-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c1-third-party-decided.md
    content_sha256: 11eba6508a4c4c1d270cabcec8c92346103d17f5959f3e43e9a09da9fcaf5d90
    file_sha256: 10e71a9718675358c0a5f42a24736b1111ccc9641f898a55b61f1192dd7f5f8c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/adoptions/adr-geo-c1-third-party-decided.md
    snapshot_sha256: 10e71a9718675358c0a5f42a24736b1111ccc9641f898a55b61f1192dd7f5f8c
    entry_key: 754e83eb3a5b73ed0627a6e5d6c3c6c31329e1678649d70534d635f59b586fe2
  - object_id: SMP-GEO-C1-BASE-Q2-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: e0cf18ac0021fb2de2f6ac8907105a35d6139aae5ba476d2737fe7072e623a5d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-perplexity-2.md
    snapshot_sha256: e0cf18ac0021fb2de2f6ac8907105a35d6139aae5ba476d2737fe7072e623a5d
    entry_key: 75dea27a1bca02ee31b8119edc891a47ed8e0857c165b94ed45e6d9b699cc57d
  - object_id: SMP-GEO-C1-BASE-Q5-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 04b81851d5a30ae0807533b34278dbd5807de77ba53753253c2d10de8bf371ba
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-claude-1.md
    snapshot_sha256: 04b81851d5a30ae0807533b34278dbd5807de77ba53753253c2d10de8bf371ba
    entry_key: 75e03f0f5615e673ee3256df4ebf9409cfcd68210699b735b04194b1f6f76797
  - object_id: FND-GEO-C1-OWN-2
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c1-own-2.md
    content_sha256: 666a5e8957f676a03111d1faa1d3907db7bdaf7eff6e13282c7e76d8feaee421
    file_sha256: 10f3f6f1f1415f1f6cff9a405138bc90aaf60fe012023bbf514a464119f6232e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-c1-own-2.md
    snapshot_sha256: 10f3f6f1f1415f1f6cff9a405138bc90aaf60fe012023bbf514a464119f6232e
    entry_key: 76dbbf778fd6806ce71682a1e4471cc234d0055e6f9ce4fed7f8d761e70181d7
  - object_id: AGG-GEO-C1-AFTER-Q2-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q2-perplexity.md
    content_sha256: 3da79260d28f08cd8d20cefb8c5f90b29a32feaef06992bca3404d20db210408
    file_sha256: f19a02252324dfd266a0d56a324b3f92cc86024497ce49ba5b7b4d68ea9baa04
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q2-perplexity.md
    snapshot_sha256: f19a02252324dfd266a0d56a324b3f92cc86024497ce49ba5b7b4d68ea9baa04
    entry_key: 76df1a16566a0ec7c14980f1ae7c61ea67b4a99ed369cc0e611a5d5a4210fef1
  - object_id: PRP-GEO-C1-THIRD-PARTY
    record_type: asset_proposal
    object_version: 1.0.0
    object_path: assets/proposals/prp-geo-c1-third-party.md
    content_sha256: 7485b0dd5b8dfbaab3263a4313c63a8c9b1cce05e79e8fe3c6087f4f3f4fddc1
    file_sha256: 28d82c5d2b9b03d119699f2498c1c1e85cf63f6f3c55220a9f7d75257cf9de36
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/proposals/prp-geo-c1-third-party.md
    snapshot_sha256: 28d82c5d2b9b03d119699f2498c1c1e85cf63f6f3c55220a9f7d75257cf9de36
    entry_key: 76e2dc4682b29b0cea942acff471a857d00720bfb9c7ee06d27539e6de6f952e
  - object_id: ARV-GEO-C1-BASE-Q3-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-claude-2-reviewed.md
    content_sha256: 8e103c85b7f94168899a0f0dd9d2c563a2cd018b4e0122562da42e778b2ae738
    file_sha256: 6260bd02d37ae6bec086c2f58f1d77c664adafde47ce279c8d39b7dfd5435132
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-claude-2-reviewed.md
    snapshot_sha256: 6260bd02d37ae6bec086c2f58f1d77c664adafde47ce279c8d39b7dfd5435132
    entry_key: 77010e33b266a3dfe13746c7608fb1ccfd6611fbb9285289d2ceca2a4d2e1bf8
  - object_id: ARV-GEO-C1-AFTER-Q6-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-claude-1-reviewed.md
    content_sha256: 8ea308f85a4dcbfa4b25604835de5ea8d39f9ad0a90dd7b6618f42812f1dbeeb
    file_sha256: f1fc8912e81112c71e46da02b3e377a7d27946768538316bff6b87cc89f165c1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-claude-1-reviewed.md
    snapshot_sha256: f1fc8912e81112c71e46da02b3e377a7d27946768538316bff6b87cc89f165c1
    entry_key: 774ca1b7507e91996fea2faac8f4c939d8dacd6c6d9b48c015a0dd8a5258d4a7
  - object_id: CLM-GEO-E2E-GUARANTEES
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-guarantees.md
    content_sha256: c05c6c819824b4a3bbbe50587e611d97dc478fa9777acc9ab0371c4133722b0f
    file_sha256: 5140d1c928f241fefb9aaa801e2258488e219f27f8e93bc04705e4d3c28bdb5c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-guarantees.md
    snapshot_sha256: 5140d1c928f241fefb9aaa801e2258488e219f27f8e93bc04705e4d3c28bdb5c
    entry_key: 77ac8961c6d395b1cac87d57d47e2e7cbb3072dc361f54e2797c393001ba1b73
  - object_id: SMP-GEO-C1-AFTER-Q5-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 8180fee15cae62cd35ecdfdf9b0a4b6f7f41e4b531fa1711abd732587f02d088
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-claude-1.md
    snapshot_sha256: 8180fee15cae62cd35ecdfdf9b0a4b6f7f41e4b531fa1711abd732587f02d088
    entry_key: 790b3234eaa240986e84e7f7609e85ebfcdd3867716f875c65c15e0ce511657a
  - object_id: SMP-GEO-C1-AFTER-Q6-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 0716ad3bbd3994d49961139a4f512ce5481c3914b03823724216f19a0fe236f5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-chatgpt-1.md
    snapshot_sha256: 0716ad3bbd3994d49961139a4f512ce5481c3914b03823724216f19a0fe236f5
    entry_key: 792fb1cc69d6fdf4165b5c323d8788128143b79eeac5f072e7ed596a0f2380d5
  - object_id: ARV-GEO-C1-AFTER-Q6-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-perplexity-2-reviewed.md
    content_sha256: 0b181f98bfb6c06f2b87c201f21ca8484947f08e958da3750ee421eafd2cb907
    file_sha256: 50640f658779095e167da23b430f6011054c17d44d67665ec68809c7a0d69372
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-perplexity-2-reviewed.md
    snapshot_sha256: 50640f658779095e167da23b430f6011054c17d44d67665ec68809c7a0d69372
    entry_key: 7ba62f62fe31036e8f2b849e45157257754ba55359f883f8823e6619369d2d29
  - object_id: ARV-GEO-C1-BASE-Q1-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-gemini-2-reviewed.md
    content_sha256: 63a3e2d80bb27923dd05810bdd2d2aad7779509eac2ab272c48eb8595ef8587c
    file_sha256: 3e00e2d5ac706defa4e38093ac4a6e601b102c4c019fbf75808812146d405f79
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-gemini-2-reviewed.md
    snapshot_sha256: 3e00e2d5ac706defa4e38093ac4a6e601b102c4c019fbf75808812146d405f79
    entry_key: 7c9ac0a3f488bdd2cfffe51727f8dfac8879cd4f2a752e3eea7d75cc5d4d1eb3
  - object_id: SMP-GEO-C1-BASE-Q4-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 1c968dd3474f742c9b982e77a2cd3d5548a648037e307e70999a115ca3fb33a7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-gemini-2.md
    snapshot_sha256: 1c968dd3474f742c9b982e77a2cd3d5548a648037e307e70999a115ca3fb33a7
    entry_key: 7ca80f943d161a947aa52a3638424c8c5d4746b8b329f78af7bba007b61f242d
  - object_id: FND-GEO-SITE-C1-AFTER-OFFICIAL-SCHEMA-SYNTAX
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-official-schema-syntax.md
    content_sha256: f75f3e8d00e214448464a9a652c802996e26bec05b316753ba053efd15dc4376
    file_sha256: 4a5c3a49972811377ee1bb6574a5488dfc41c3638f90c04d7cc883c5de35ec0d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-official-schema-syntax.md
    snapshot_sha256: 4a5c3a49972811377ee1bb6574a5488dfc41c3638f90c04d7cc883c5de35ec0d
    entry_key: 7cbb8404cc15501a6f17073bb5d5dc9cec3f76db7ee7199893b28a581cb3322a
  - object_id: ARV-GEO-C1-AFTER-Q2-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-gemini-2-reviewed.md
    content_sha256: e382ca08be7019c3255dcc03708b5efbbb78012cf876f8e817cb7ebc6b3b0462
    file_sha256: 538fed4158667cb9507ac89fb02ede0cb701d40b0489e3c26700757ce90ebb7d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-gemini-2-reviewed.md
    snapshot_sha256: 538fed4158667cb9507ac89fb02ede0cb701d40b0489e3c26700757ce90ebb7d
    entry_key: 7d5f43636494e2b90e69db430859b46e857b46a4f2268759d8b2efa4bd91c59e
  - object_id: ARV-GEO-C1-AFTER-Q4-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-chatgpt-1-reviewed.md
    content_sha256: 3548b6a8ffb96694e2c658007ddfaac9c3a3d77bdbf30071071f927bbfc57714
    file_sha256: 3b7fb0aa748d75a56a09c205d5ef44a845c6e93997b96bcedffe0f1ec5a09bda
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-chatgpt-1-reviewed.md
    snapshot_sha256: 3b7fb0aa748d75a56a09c205d5ef44a845c6e93997b96bcedffe0f1ec5a09bda
    entry_key: 7dde68525b741dec283e0122951f31fedf4a5b25faefd7e73ffc0c49a43fcbdc
  - object_id: EVD-GEO-E2E-ONBOARDING
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-onboarding.md
    content_sha256: d6fd212806c92f8b1d294e5b0d5f0afaa052d13d205a6f413183bf3746d0c908
    file_sha256: 4bfe6229aaa4aeb4c57a949fd2ea5a43b7056f6b4a30e20e43cd288d9e52daff
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-onboarding.md
    snapshot_sha256: 4bfe6229aaa4aeb4c57a949fd2ea5a43b7056f6b4a30e20e43cd288d9e52daff
    entry_key: 7ef257d27f97ac644211ee1a3179be6bc703be234d82d12f2844037b85118bac
  - object_id: ARV-GEO-C1-AFTER-Q2-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-perplexity-1-reviewed.md
    content_sha256: 991c53e8c90c2ab7af74475f63427608c266620cf3a584bc44f2f40ea0f188d5
    file_sha256: f426377dd41bd41caa04e9c69273800a4feefc2b691df4fc46f52bc1f24652aa
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-perplexity-1-reviewed.md
    snapshot_sha256: f426377dd41bd41caa04e9c69273800a4feefc2b691df4fc46f52bc1f24652aa
    entry_key: 7f8d3492c60d158426e235d9573dcdb1cebe91e060c4763e756bef91fb620df5
  - object_id: ARV-GEO-C1-BASE-Q2-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-1-reviewed.md
    content_sha256: 462c30cc944f95a506a9303a57e2ca4738f2ba9ed2d7e39f74d704d997498617
    file_sha256: bfe8ed7bdf097ee37e6aa86a455a44f895ef6a692625d793dfa3e82f86efc7e9
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-1-reviewed.md
    snapshot_sha256: bfe8ed7bdf097ee37e6aa86a455a44f895ef6a692625d793dfa3e82f86efc7e9
    entry_key: 7ff540043eaca08c05cc03f6df6130ae1359eae777cdb925850f767a4928b0b0
  - object_id: ARV-GEO-C1-AFTER-Q3-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-google-ai-2-reviewed.md
    content_sha256: b0275f1703034ee99210d4d7a6b1a7aa934e4b910e56239641dc04e2acef1bcf
    file_sha256: 22921aa0022787a9c5b22ebb957010893969f70f5fb4ade69cde0e947e348a0f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-google-ai-2-reviewed.md
    snapshot_sha256: 22921aa0022787a9c5b22ebb957010893969f70f5fb4ade69cde0e947e348a0f
    entry_key: 80d416a9b4a39db5c00b62124f250bff5449bec0bcc1e2c29b7d22726844e805
  - object_id: AGG-GEO-C1-AFTER-Q4-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q4-gemini.md
    content_sha256: 9c2f14ca9af3a12a78c4a433e2ee189e37ac693e696f79309eb6e3ecb4efe5ad
    file_sha256: e40478957ea0d6223c32746cafcabb2fefa89062593f0456816e83957afa9448
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q4-gemini.md
    snapshot_sha256: e40478957ea0d6223c32746cafcabb2fefa89062593f0456816e83957afa9448
    entry_key: 812ccaa637a8e9e48a4806e6bc100cc007e30ae45d8036c944eab2a444c985be
  - object_id: SMP-GEO-C1-AFTER-Q5-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: b0a007f8a1891b9b09c66e9d1967c3b284c7ba37aa78e87e37831432c00428fe
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-gemini-2.md
    snapshot_sha256: b0a007f8a1891b9b09c66e9d1967c3b284c7ba37aa78e87e37831432c00428fe
    entry_key: 834c989477c8a1e752e1d13329418209f9dcc93182a6b71cdc7c527f4272d084
  - object_id: SMP-GEO-C1-BASE-Q5-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 5e6d4a7b0634756108fbf6c907bf5a19f600a54f207e4bd5adbe643f9bc89eb8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-perplexity-1.md
    snapshot_sha256: 5e6d4a7b0634756108fbf6c907bf5a19f600a54f207e4bd5adbe643f9bc89eb8
    entry_key: 8382bd88cc17924310c124200e52d18f1dfd83dcdb02a811363832e667b22005
  - object_id: ARV-GEO-C1-BASE-Q2-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-gemini-1-reviewed.md
    content_sha256: 45e6b3509435e79707a07ff65ec3f8341b9b08a67e39a1bfc81c7e050eaf059c
    file_sha256: b09ead785c3fbe0034b35cd6110bc41b6ea06341ea0b4137f88b626acde36058
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-gemini-1-reviewed.md
    snapshot_sha256: b09ead785c3fbe0034b35cd6110bc41b6ea06341ea0b4137f88b626acde36058
    entry_key: 83d203a41cb50f65d8c7aaf746e03e56b5bab8823b0acbb0a40f65d6fd2e0960
  - object_id: FND-GEO-SITE-C1-BASE-OWN-SCHEMA-SYNTAX
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-own-schema-syntax.md
    content_sha256: 07cea7107fbb21d3b3fd7559fe96e8a83888e13b321f85eb7f4764e56f0a6518
    file_sha256: c10539fa427ceb31b19089a8cb92b4ec70a98a3bf8f798f1b296e6d29261afba
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-own-schema-syntax.md
    snapshot_sha256: c10539fa427ceb31b19089a8cb92b4ec70a98a3bf8f798f1b296e6d29261afba
    entry_key: 8560a7322d95656e66abe8393a7ac37657f2532c8272d60b2db69172192046ff
  - object_id: CLM-GEO-E2E-VOICE
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-voice.md
    content_sha256: 4572ad641758c23474309fd0917192b0a55daa34e6bc97c3b8ca3e18c2e67004
    file_sha256: f3e1250cdb9fd20e027247adc46ef0463f08c84c6f01bb281f255563da62162e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-voice.md
    snapshot_sha256: f3e1250cdb9fd20e027247adc46ef0463f08c84c6f01bb281f255563da62162e
    entry_key: 85c5ec8da758e559337f7adf08d7e4e4729c11c46eacb94babc634cb720f7bd1
  - object_id: ARV-GEO-C1-AFTER-Q5-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-chatgpt-2-reviewed.md
    content_sha256: f6f56216615893999a13c5c6eb85bb622917d669399b727c7ad3f01ad423702a
    file_sha256: 1e088beb3b8c80521c2df92fd3a803b3bea92da9dee414f41f3b68825f2cbde2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-chatgpt-2-reviewed.md
    snapshot_sha256: 1e088beb3b8c80521c2df92fd3a803b3bea92da9dee414f41f3b68825f2cbde2
    entry_key: 86dab000343f46b2667635e0267155d821c20d1ea7d5656ffa0cf19b4fcf2d1f
  - object_id: EVD-GEO-E2E-VOICE
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-voice.md
    content_sha256: 4572ad641758c23474309fd0917192b0a55daa34e6bc97c3b8ca3e18c2e67004
    file_sha256: b673aea570c80fafc2f6984248f3081816802d1a1cdef3d5de0a26a7c239ed62
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-voice.md
    snapshot_sha256: b673aea570c80fafc2f6984248f3081816802d1a1cdef3d5de0a26a7c239ed62
    entry_key: 8733fb4c8d2f358de3c37e3c0084a53e26fdf401256ecf2fbf704f071ff12161
  - object_id: AGG-GEO-C1-AFTER-Q1-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q1-google-ai.md
    content_sha256: bb889b4519cf2cb31eab935e21ac49cf2f15e44a85c20578de54b09c7ecc23ad
    file_sha256: 7e7778234f891f16aac326ab75491f936f59efe7f10f1f6721f0427378fc7e61
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q1-google-ai.md
    snapshot_sha256: 7e7778234f891f16aac326ab75491f936f59efe7f10f1f6721f0427378fc7e61
    entry_key: 876c3c7f82fb205781fa3d3b439f59d432318c1bbe664e05e638809f924a4112
  - object_id: ARV-GEO-C1-AFTER-Q2-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-perplexity-2-reviewed.md
    content_sha256: db1402327681dfe7741e490a10810a868099c73bbeb656440a803fe5e13f5c21
    file_sha256: 2be2f686d5e4d8ec12be2ee7ea08bcf6b116127a48be0889e315d0ae830863d7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-perplexity-2-reviewed.md
    snapshot_sha256: 2be2f686d5e4d8ec12be2ee7ea08bcf6b116127a48be0889e315d0ae830863d7
    entry_key: 87ef06ae7c4a26d70be01ccbc0878d4f0e18d0df967d798f720736d2c108d083
  - object_id: DOC-GEO-E2E-NON-GOALS
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-non-goals.md
    content_sha256: 3859e3b3f3891807b5d16f77e1f46fcd9b5b39b2a775befa25a9f0059c03d485
    file_sha256: 596631234a599770999f069edd0cfefed3db228a6aeea6e8705fd7f2edd9b410
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-non-goals.md
    snapshot_sha256: 596631234a599770999f069edd0cfefed3db228a6aeea6e8705fd7f2edd9b410
    entry_key: 88de44bea18c0d20593eaab7f5a1716092f1907a934a53f7531d2b4a929ae84e
  - object_id: EVD-GEO-E2E-FEES
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-fees.md
    content_sha256: 6e0610ad7c6ea19a5143bad7b2167bddf28ecfc8e49ee460f16fd33060260812
    file_sha256: 6c278c90dc26490c2acd0e6e88d098587f69757b59b0187257379c5d4f6df728
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-fees.md
    snapshot_sha256: 6c278c90dc26490c2acd0e6e88d098587f69757b59b0187257379c5d4f6df728
    entry_key: 89e4c678a08f165430ffcfecf0275b7cb43a04c136f4b5e9412e3f33660faf80
  - object_id: ARV-GEO-C1-BASE-Q3-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-1-reviewed.md
    content_sha256: 30bea80029f8eaf7f1d7bee23f6090fcb12c255b5b71e13fb04e5e7fbab4ba32
    file_sha256: 43b9273dc3a1ba0a0dd361515def1d69c4edf5c3b229762a1f0254f5c9a6c2e5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-1-reviewed.md
    snapshot_sha256: 43b9273dc3a1ba0a0dd361515def1d69c4edf5c3b229762a1f0254f5c9a6c2e5
    entry_key: 89e6f7af1b6f34b65284fcbb725b8889ffd72ce3c9398b84dbbde47f39fe8e7f
  - object_id: SRC-GEO-E2E-EXPIRED
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-expired.md
    content_sha256: 77d048ca80f0df056a4c933dfbc21020e0de473f08cb3113135c644e2f4e1fd0
    file_sha256: 222f2d6bbb48e4d74719a7d03e52a36498bec9640c949d343bc10833337e1b67
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-expired.md
    snapshot_sha256: 222f2d6bbb48e4d74719a7d03e52a36498bec9640c949d343bc10833337e1b67
    entry_key: 8acebda83b6ae3cb33e263ae0d856b1a0751a4b750d3a396d5b69d9c3402a717
  - object_id: AGG-GEO-C1-AFTER-Q6-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q6-gemini.md
    content_sha256: 40ca712044034b404f60a76af4ff18bdf02dfb837418176b4e127e2a754485bb
    file_sha256: 94a8a658bfec2db476ee2c1e7d37357847006a3d1e37472129e9691ec43c9a11
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q6-gemini.md
    snapshot_sha256: 94a8a658bfec2db476ee2c1e7d37357847006a3d1e37472129e9691ec43c9a11
    entry_key: 8ad84e6f4f1f8c79d01dfca4b12c5691f05067fdbb88fb2f75455bf875d036ee
  - object_id: SMP-GEO-C1-BASE-Q5-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: c3b4d7a15bdf9f4b07a060c48925ce6f971740f08569dffc9fbb884d416516d4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-perplexity-2.md
    snapshot_sha256: c3b4d7a15bdf9f4b07a060c48925ce6f971740f08569dffc9fbb884d416516d4
    entry_key: 8b8da4978b33a27ca809b8480b7ffac5431151ee7847becd3997149006af8bf8
  - object_id: ARV-GEO-C1-BASE-Q2-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-claude-2-reviewed.md
    content_sha256: 485f914c3045883740c14af0c8109fa6fcddc6d621274b6372a66c5cae8b6b27
    file_sha256: 7746780e2bc1cb3e10a9f9408f33756a3e4689863b70a0d22f4bd08d261ffb4a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-claude-2-reviewed.md
    snapshot_sha256: 7746780e2bc1cb3e10a9f9408f33756a3e4689863b70a0d22f4bd08d261ffb4a
    entry_key: 8cba2d4f6b73f162a5cc9a4122b93ed15f0b1e08ba46c5810b4911af8dbb2097
  - object_id: ARV-GEO-C1-BASE-Q1-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-2-reviewed.md
    content_sha256: 127eb883afc168d1700d2cdee749f3ae58bf40fed7ec97ce2a68bc1b6b79ebd9
    file_sha256: 4bcd656c9fe26d91176d3cf28d989c1d05879edeb1cfb1107b687fd7fa737910
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-2-reviewed.md
    snapshot_sha256: 4bcd656c9fe26d91176d3cf28d989c1d05879edeb1cfb1107b687fd7fa737910
    entry_key: 8e09bd1743ed57b5eab77d1943ac28f05f60841486f5039adb72f4609f321cf5
  - object_id: SMP-GEO-C1-BASE-Q2-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 5c26d4ddae264276ea904368e81582d92deffc915a9b3c1d13bd47ffa9ad70e7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-google-ai-2.md
    snapshot_sha256: 5c26d4ddae264276ea904368e81582d92deffc915a9b3c1d13bd47ffa9ad70e7
    entry_key: 8ecd4fb2eb3eaa22df363d6183ff6836e4b7dbd2a03a2a3d240b88dc37f089d9
  - object_id: FND-GEO-SITE-C1-AFTER-OWN-CRAWLABILITY
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-own-crawlability.md
    content_sha256: 5e6cf5a5e24db76c78f00a3863a7b044540531e72d5b1e991d5f9774e2e3c9d2
    file_sha256: e55f46524df538bb7e9fd5406df8c20b4b22696a87ff9705c473d7e3517d3ba8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-own-crawlability.md
    snapshot_sha256: e55f46524df538bb7e9fd5406df8c20b4b22696a87ff9705c473d7e3517d3ba8
    entry_key: 8f1413609452166fc2fc69a7e46adb690a6f102fdce82ddfdc4cdd9ddc480c4c
  - object_id: ARV-GEO-C1-BASE-Q1-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-2-reviewed.md
    content_sha256: baa504a7809a6fdc5fd0eb42ded1892813a2932d24fe97ad41a21d5110571471
    file_sha256: 9381e6f18f33389e2e71de6d8b01b0284ebbf8e23249530274da7bc4cf4e9eaa
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-2-reviewed.md
    snapshot_sha256: 9381e6f18f33389e2e71de6d8b01b0284ebbf8e23249530274da7bc4cf4e9eaa
    entry_key: 8f826dc3a1867f93a6f7f9bb1484025bdb7fc26f398f418b6f778502816d80a1
  - object_id: ARV-GEO-C1-BASE-Q4-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-1-reviewed.md
    content_sha256: 80a183abbd5893c531b2868e41dee518373a8d39b1c3a5640deb3be918e96467
    file_sha256: 127ea42925c615dbcd0c06a262ae3064421dfb311e25d5f5e1eb61bcc4a876a9
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-1-reviewed.md
    snapshot_sha256: 127ea42925c615dbcd0c06a262ae3064421dfb311e25d5f5e1eb61bcc4a876a9
    entry_key: 9019e56f7f0a05189a0192af2323bbdd410973a6e77260edef48e08a7fb7b941
  - object_id: SMP-GEO-C1-BASE-Q5-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: c31b201221a9ab7695d11b146757df187b0e9a85fdb8e86b5a0b5895e11b05a4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-1.md
    snapshot_sha256: c31b201221a9ab7695d11b146757df187b0e9a85fdb8e86b5a0b5895e11b05a4
    entry_key: 905c2dfab2344f23654d14abb34d9f31ac3fae2e014949e8ff5562f45d57f11a
  - object_id: ARV-GEO-C1-AFTER-Q2-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-gemini-1-reviewed.md
    content_sha256: a69243934311697f3d322aa32d454f4738d1c61653cabf6b10c23eaeaec62a09
    file_sha256: 72c9dadfdfd5907fba1bbd29082b12410b691267fea45ddd5503bd29a61b297c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-gemini-1-reviewed.md
    snapshot_sha256: 72c9dadfdfd5907fba1bbd29082b12410b691267fea45ddd5503bd29a61b297c
    entry_key: 90b367bbb72a6fb400c0007fe13e0e3996fbd7b11e72456190c3a93918091849
  - object_id: FND-GEO-SITE-C1-BASE-OFFICIAL-CRAWLABILITY
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-official-crawlability.md
    content_sha256: e91bfa0ec2e04024f1ce034827c414931a31ed8191e3a756f816c54fdfa95edc
    file_sha256: 223eb472eb0e159e87a71e6e8172abf2f5be3611d9bf2ffc186337d32f39c8ae
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-official-crawlability.md
    snapshot_sha256: 223eb472eb0e159e87a71e6e8172abf2f5be3611d9bf2ffc186337d32f39c8ae
    entry_key: 92da338975cb5830e42c414759a5db251643978aac271279b39530112f719c96
  - object_id: SMP-GEO-C1-AFTER-Q2-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: a6e540b8af500b153e1ff14784abe720bc9cb0700183ace29ca23b78d72d59a0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-gemini-2.md
    snapshot_sha256: a6e540b8af500b153e1ff14784abe720bc9cb0700183ace29ca23b78d72d59a0
    entry_key: 9382d520513d6410b487f23c41fe9613a1213d10625e641f10960d6b0225381d
  - object_id: ANS-GEO-E2E-C1-5
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c1-5.md
    content_sha256: f3999be15f70663cb32657e806d0dfd06ecca0d2648bcd9a891f53b4df4a695d
    file_sha256: 8c801c3f842971e9280d00b895be36d59f4fa4461b6261452bad20963cd44f31
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/answer-cards/ans-geo-e2e-c1-5.md
    snapshot_sha256: 8c801c3f842971e9280d00b895be36d59f4fa4461b6261452bad20963cd44f31
    entry_key: 93833b60dbc13ef44d237d48d1d372f2783d0d3ed659afc003d2a1bcbc973cb6
  - object_id: EVD-GEO-E2E-LEGACY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-legacy.md
    content_sha256: 115347126b40e11f3aaa82b2cf9b793751c02bc82808fd3984c6c1b257bed8d8
    file_sha256: a91c48fbbbe7d0968e5e13dc20f5294eb583e321ee4f1b98fe698260f97779a4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-legacy.md
    snapshot_sha256: a91c48fbbbe7d0968e5e13dc20f5294eb583e321ee4f1b98fe698260f97779a4
    entry_key: 93a66272df97777815b5000fc6e5a36496dcd6c94f15413731e3b8e6041ee7fc
  - object_id: SMP-GEO-C1-BASE-Q4-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 427b2374e4da448c510e09b2843d8d21a6c92dd5ce5311854ec449512bc880a0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-google-ai-1.md
    snapshot_sha256: 427b2374e4da448c510e09b2843d8d21a6c92dd5ce5311854ec449512bc880a0
    entry_key: 93dc83d77ea8df41cb5f4a680b0c0036372e2bfb0c2f7fbfcf62c006cb1ba35d
  - object_id: SMP-GEO-C1-BASE-Q1-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 7d5a73fd6ac49ff756e8d1ffc950e300b2967a98991e4d681f88a7b3b3e2a303
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-gemini-1.md
    snapshot_sha256: 7d5a73fd6ac49ff756e8d1ffc950e300b2967a98991e4d681f88a7b3b3e2a303
    entry_key: 9452857595af1985d57579e405f43ae868a2b232c8e7c4211fe7f64f41cc1d8b
  - object_id: ARV-GEO-C1-BASE-Q6-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-gemini-1-reviewed.md
    content_sha256: cf0036b3ee7d4ba800b359f4e56508910d8096ac73e1bc5b2053916ea48a6d8d
    file_sha256: 06cb9a0f4b3d6f1692a08a367024fe83c55aa84e035b8c6a07df0524b491c6af
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-gemini-1-reviewed.md
    snapshot_sha256: 06cb9a0f4b3d6f1692a08a367024fe83c55aa84e035b8c6a07df0524b491c6af
    entry_key: 94b0e989449604d73dfb3836395f4bce8aa2da0b848ffafae72fc366ab37e1f7
  - object_id: ARV-GEO-C1-BASE-Q6-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-2-reviewed.md
    content_sha256: a1839de212f14cac8ef30d8a8b5f0ae37e26de44bce2318c737257343e7e7905
    file_sha256: 0d460856c889142879332446b3f1eb8d6da9098d056f75050378f5fccdfaa0ef
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-2-reviewed.md
    snapshot_sha256: 0d460856c889142879332446b3f1eb8d6da9098d056f75050378f5fccdfaa0ef
    entry_key: 94bed5a0d7c665299f229e4f3c0230fcd4ef6399750263d188e6fe4a6ae2954f
  - object_id: SMP-GEO-C1-AFTER-Q2-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: dcf13f417d7332650a4864ed473ce58c724717d6e1a1473bbfe8dc9e56e6699a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-perplexity-1.md
    snapshot_sha256: dcf13f417d7332650a4864ed473ce58c724717d6e1a1473bbfe8dc9e56e6699a
    entry_key: 95e0c66b16089fe3e1d1147d80047275294f781a585300a70b00e9deca572f8e
  - object_id: SMP-GEO-C1-BASE-Q4-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 02eb091938ae96bcf8c485fe40f8e27222f3c434f1e00db52fe8aea4c2582c8e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-claude-2.md
    snapshot_sha256: 02eb091938ae96bcf8c485fe40f8e27222f3c434f1e00db52fe8aea4c2582c8e
    entry_key: 963ed386529733193e228a5ab5fee3b5e47cc1cfd6482ce632caf47a07dcc303
  - object_id: EVD-GEO-E2E-IDENTITY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-identity.md
    content_sha256: a72644835b1a7648ba95871bc7c874b7646ff9247675d45295e09105a2a124fa
    file_sha256: 61de83100ec6389312d7db93caff3452e02973809caafe502cec92b44b40b8c8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-identity.md
    snapshot_sha256: 61de83100ec6389312d7db93caff3452e02973809caafe502cec92b44b40b8c8
    entry_key: 972fdf10b6440744f49465469482a780d7a68bf73ac83fe2c81e075be2b8051a
  - object_id: DOC-GEO-E2E-IDENTITY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-identity.md
    content_sha256: e489eb225c655e10ed1c45fc3524e1762acc273045a358c911e74e136045b9f4
    file_sha256: 16797c92cefdbebad4050b06fcfb28719de22e8f658b2367066b2a854f9a4e80
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-identity.md
    snapshot_sha256: 16797c92cefdbebad4050b06fcfb28719de22e8f658b2367066b2a854f9a4e80
    entry_key: 9911bebdeec14aff83acdafb8c43477affa22fcc62585930da82d67b5354205e
  - object_id: Q-WHAT-ARE-THE-FEES-TRIAL-EN-BEC0
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-are-the-fees-trial-en-bec0.md
    content_sha256: f061f25dccdae3ab8bc05d71b5bd28f987dd460aeb176752a5f15caee7b7aeae
    file_sha256: 6e7b0ce1c11314e7d737801fdeb5101acfb772c4b5401515e6591fb8e4ce9ce4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/queries/candidates/q-what-are-the-fees-trial-en-bec0.md
    snapshot_sha256: 6e7b0ce1c11314e7d737801fdeb5101acfb772c4b5401515e6591fb8e4ce9ce4
    entry_key: 999e331df1408a454fd8bd4827fe132f04dd925ba1a181fcfe09ffeeacaa5411
  - object_id: ARV-GEO-C1-AFTER-Q2-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-claude-1-reviewed.md
    content_sha256: 3b70077861e61178a09b73e245cf7576a58a1f6c5930459326d8d0f688be746c
    file_sha256: f65ac7f8321c603671edc9504049292c8ac1e38ee285b3986765eebb0dfa6d78
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-claude-1-reviewed.md
    snapshot_sha256: f65ac7f8321c603671edc9504049292c8ac1e38ee285b3986765eebb0dfa6d78
    entry_key: 9a2dc4c36bd9e68576b452f16e27cdb0b1e10bbd12acf03abf4c73e6ec0a2eeb
  - object_id: CPF-GEO-E2E-C1-BASE-GOOGLE-AI
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c1-base-google-ai.md
    content_sha256: bb211ba9085ae220155bed2ba6e654906f40730ab2f78b0a93cd1ffa2d3b7ce6
    file_sha256: 7220eb00f5a9fcaef225a1745a76f48b76fd91776b0d404c92547564c4c12cba
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c1-base-google-ai.md
    snapshot_sha256: 7220eb00f5a9fcaef225a1745a76f48b76fd91776b0d404c92547564c4c12cba
    entry_key: 9a2e9ef5f578b96676aa0e1bf9cb9a62022dd4c5592cadf72e77c51a682fc140
  - object_id: SMP-GEO-C1-AFTER-Q5-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: bb5b4856ba536aeda64b58c6c36e16113686ce5162b8b0fb508b21c14efa198d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-google-ai-2.md
    snapshot_sha256: bb5b4856ba536aeda64b58c6c36e16113686ce5162b8b0fb508b21c14efa198d
    entry_key: 9ade0b3b6dbcbff1512e0abbc523f84b0c5fde8e8ac722eaa5548c156ac47110
  - object_id: ADR-GEO-C1-OWN-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c1-own-decided.md
    content_sha256: 2eee2699e950cc3b2e8222abd3c365e25eac63e9b6fe6023e2bdc6199bae6e9d
    file_sha256: 73a762a882d5e352ead4be0ecebff752ee9d96996234b5b570db36c0073aa464
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/adoptions/adr-geo-c1-own-decided.md
    snapshot_sha256: 73a762a882d5e352ead4be0ecebff752ee9d96996234b5b570db36c0073aa464
    entry_key: 9b2aeb978d84fb722f6baf6075739eb0ff1349c4bcb42601ae2e96fef89de5bf
  - object_id: SMP-GEO-C1-BASE-Q2-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 7e5718e12446c828b48c144dd05b9687868d83a86b78b8dc16fadecd2fb74212
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-claude-2.md
    snapshot_sha256: 7e5718e12446c828b48c144dd05b9687868d83a86b78b8dc16fadecd2fb74212
    entry_key: 9b6a547f88b0f8d5387c7897a7ba18ebbeb9fa913906b0a541eae841bbb6ee40
  - object_id: AGG-GEO-C1-BASE-Q5-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-chatgpt.md
    content_sha256: 8304174d4c4a6dd89094a5e1fffac81f7f5408c31702d82a88c53560cfbfb8b7
    file_sha256: 916933cb5fb733619c68a69c59ea3c8790bdb40c9301a0f707a1f2a4c7db65a1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-chatgpt.md
    snapshot_sha256: 916933cb5fb733619c68a69c59ea3c8790bdb40c9301a0f707a1f2a4c7db65a1
    entry_key: 9c7065d9c058f87958397ffa99859497b6da3ab4c17a5f92c06d0da568540e19
  - object_id: EVD-GEO-E2E-NON-GOALS
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-non-goals.md
    content_sha256: a210c8651cd23b7d74a65e4f99c45cf2a7681b9223ee46b623e3323d308d9020
    file_sha256: d662baf367afdf6645d9317518d4b2b38f5fb95e8ff71635509ad45f7ae9958e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-non-goals.md
    snapshot_sha256: d662baf367afdf6645d9317518d4b2b38f5fb95e8ff71635509ad45f7ae9958e
    entry_key: 9cd40ba36ff5a26f7f66aeb65cdf5442577a9313697a706ae5c83bb2a6b3cdba
  - object_id: ARV-GEO-C1-BASE-Q3-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-gemini-1-reviewed.md
    content_sha256: 0a3ab34d11e8865d9f5dcdd6e7f6bc583655231cef7730519913ce208e91bb58
    file_sha256: 6dd8a10d8be2cbd40cacf73c942fbea7dd806a18d06e173cee387c04d1e98576
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-gemini-1-reviewed.md
    snapshot_sha256: 6dd8a10d8be2cbd40cacf73c942fbea7dd806a18d06e173cee387c04d1e98576
    entry_key: 9e2b394995d7d6a5ee287e69a437bf09c3486544e6e60bfb48c137de44279422
  - object_id: AGG-GEO-C1-BASE-Q4-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-perplexity.md
    content_sha256: b9c608548314177a8b42368f4d1734cca9be61ac4ff96d9a02695e58a78c04e1
    file_sha256: 9cc88769aa9cd14c1a0add290fd9ee8eddef598d35a1e4332aa1c619e9be0aff
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-perplexity.md
    snapshot_sha256: 9cc88769aa9cd14c1a0add290fd9ee8eddef598d35a1e4332aa1c619e9be0aff
    entry_key: 9e4d674feec7703c7dab4950dc9086a7b0b028969f1f7743348b587df750272d
  - object_id: SMP-GEO-C1-BASE-Q4-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: fd540ec80b15085308e171ce62f3d68a10d4fa5c7cfcabd433dd094130ae4e67
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-perplexity-2.md
    snapshot_sha256: fd540ec80b15085308e171ce62f3d68a10d4fa5c7cfcabd433dd094130ae4e67
    entry_key: 9e51627d9a58db1b57b735f53a35818ef12e8252781d89f45380cc1423a909c5
  - object_id: ARV-GEO-C1-AFTER-Q6-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-google-ai-2-reviewed.md
    content_sha256: 3c5175a38af7ae5b65e8ed04315c34dcb45c58606580858f0577fe9610fcdc44
    file_sha256: 7901ee468ddf6ef38a85ecd087d2e0856afffe8d8d52e7dfd855c2339da7f4c0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-google-ai-2-reviewed.md
    snapshot_sha256: 7901ee468ddf6ef38a85ecd087d2e0856afffe8d8d52e7dfd855c2339da7f4c0
    entry_key: 9e811f5f8bc68f24b328fb04f34a0d5b98efc1f7db1dc515bcfb0456f36be0d1
  - object_id: CLM-GEO-E2E-IDENTITY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-identity.md
    content_sha256: a72644835b1a7648ba95871bc7c874b7646ff9247675d45295e09105a2a124fa
    file_sha256: 81482f6278b56c751bd7a1f1fe935617ffb14d06cab934805b2559b89be1eb74
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-identity.md
    snapshot_sha256: 81482f6278b56c751bd7a1f1fe935617ffb14d06cab934805b2559b89be1eb74
    entry_key: 9fe80b7212a59f24d00834684d1d9b64972609d04e527f0e2d43bbbdb0fa55cc
  - object_id: SMP-GEO-C1-AFTER-Q6-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 11d5b25e3f2c96d6034aad5a2f39b42cde860a697dda8ac7c8ae5765ece60366
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-claude-1.md
    snapshot_sha256: 11d5b25e3f2c96d6034aad5a2f39b42cde860a697dda8ac7c8ae5765ece60366
    entry_key: a003e57febef62f8c404a0f84ad7bc56dfb829896b2c0ee00c0816f6333d3383
  - object_id: KBASE-GEO-E2E-2BB19816EE72
    record_type: brand_knowledge_base
    object_version: 1.0.0
    object_path: knowledge/meta/knowledge-base.md
    content_sha256: d0e85b74923a3c500675936bcfc580810fde7a43d961a8aca8aee633c5134dbd
    file_sha256: ebb4f1165375773b76a2f9a32c2d4e07235fccc7430dc132b01b44519b926c5d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/meta/knowledge-base.md
    snapshot_sha256: ebb4f1165375773b76a2f9a32c2d4e07235fccc7430dc132b01b44519b926c5d
    entry_key: a145f4bbcaa616ab219ae4d503d2724a56eaf19cbbba104f913a5e97f1955aa2
  - object_id: SMP-GEO-C1-AFTER-Q4-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 66cb89b1f870f920bd67823cea9990b7d2605c2673b3ec461350e34274e80547
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-chatgpt-1.md
    snapshot_sha256: 66cb89b1f870f920bd67823cea9990b7d2605c2673b3ec461350e34274e80547
    entry_key: a14fe0f6c0e648fbecf54bfcfd63518bff6541e8000ad427a4ae2a00086b1251
  - object_id: SMP-GEO-C1-AFTER-Q4-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 3f916f821b4663c9b0370f307b556a6dfc6376a0b2ed1badec1ae9b394360265
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-perplexity-1.md
    snapshot_sha256: 3f916f821b4663c9b0370f307b556a6dfc6376a0b2ed1badec1ae9b394360265
    entry_key: a1a2b37a4b91aa60943efefc154be043fc34e0d1ce443f2b751b8211f3536b5d
  - object_id: CLM-GEO-E2E-LEGACY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-legacy.md
    content_sha256: 115347126b40e11f3aaa82b2cf9b793751c02bc82808fd3984c6c1b257bed8d8
    file_sha256: d211f82cd66363a55ec8092ffe6e3211f224aeaf726ecea0e3821a2959e85898
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-legacy.md
    snapshot_sha256: d211f82cd66363a55ec8092ffe6e3211f224aeaf726ecea0e3821a2959e85898
    entry_key: a3669308b9933dcda47d191654b256adb026dc296cb25d2058af0b3157d1e8aa
  - object_id: ARV-GEO-C1-BASE-Q1-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-claude-2-reviewed.md
    content_sha256: 38a9d73fba79370172ec7735c6ff1314d34bfe372bfb3d876ab1544b35a503a7
    file_sha256: 4fa3a7fd5e542b7d14368df5514cccd4d1d6437509164b190e11a8a4307318fa
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-claude-2-reviewed.md
    snapshot_sha256: 4fa3a7fd5e542b7d14368df5514cccd4d1d6437509164b190e11a8a4307318fa
    entry_key: a4e175c7f08d7c4f52107a596a24ab5682cc02df43df671e50c09e0fb06d119b
  - object_id: ARV-GEO-C1-BASE-Q1-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-claude-1-reviewed.md
    content_sha256: b2ae294a520de7e40c2cea6928a3e36ad62a270de8975fc92bd1f64748397655
    file_sha256: 4f76a748852601e713f26a7a4657d8b66ec8eb14011862b8536cebda6f358b8f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-claude-1-reviewed.md
    snapshot_sha256: 4f76a748852601e713f26a7a4657d8b66ec8eb14011862b8536cebda6f358b8f
    entry_key: a52b4e6128884fb1fc9f7a47430d39b9a71ef20d9c60f1e317b634f598b7de1a
  - object_id: ARV-GEO-C1-BASE-Q1-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-1-reviewed.md
    content_sha256: a286d96e7f25f9e0a1b8dedd3c44bcd4121511a3211362fb7b4b7bc36be949f5
    file_sha256: 44011e1d624b9185ab775ccf934e7c6662c5ece2c791e06b0dfe20b1a6331a5d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-1-reviewed.md
    snapshot_sha256: 44011e1d624b9185ab775ccf934e7c6662c5ece2c791e06b0dfe20b1a6331a5d
    entry_key: a5aa9ac0c721d0fc92b63ed64159ca8d1732aa8b9d26d76d37aadc483622339f
  - object_id: SMP-GEO-C1-AFTER-Q4-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 6f1442387d9bacaaf17d9b1daa0e397524cc952e4f8306636d835fcd99fac16d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-perplexity-2.md
    snapshot_sha256: 6f1442387d9bacaaf17d9b1daa0e397524cc952e4f8306636d835fcd99fac16d
    entry_key: a6807514e67632e7c6a43333e49919ac5ceb6e6f82b3b6bfffd9e56f6c03390c
  - object_id: ARV-GEO-C1-AFTER-Q4-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-google-ai-2-reviewed.md
    content_sha256: 2b847a7412ef6f8b0b6a5203c569fd42fca42f90d110616559d378fdaf2bc9ee
    file_sha256: 54930674413b5781edd59df83e95d6c4f6969a7ecc466684e5fb00209ea02ae8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-google-ai-2-reviewed.md
    snapshot_sha256: 54930674413b5781edd59df83e95d6c4f6969a7ecc466684e5fb00209ea02ae8
    entry_key: a71424e025188871ac5b30ddd8078f5c83332e3e72389850b8713d91b1b778d8
  - object_id: CPF-GEO-E2E-C1-BASE-CLAUDE
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c1-base-claude.md
    content_sha256: 72ef7be1df18095ac54c342950d6aaa56675a497a8c77e79ddc8d89c843f983b
    file_sha256: 1ecfac390ed6253545a77b76ffe0e3cc8da4ad8ec51aca7399bb726a284c759f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c1-base-claude.md
    snapshot_sha256: 1ecfac390ed6253545a77b76ffe0e3cc8da4ad8ec51aca7399bb726a284c759f
    entry_key: a8bcb5e4e470ff85659f7bbbb6d6ec4f419e2b600a54e4772e37d4468bd3b3f8
  - object_id: SMP-GEO-C1-AFTER-Q6-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 3bc4eb94201b1fed545479dfe4f1e038c34e7d25cf6f31f17261c8ca6147c10e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-gemini-2.md
    snapshot_sha256: 3bc4eb94201b1fed545479dfe4f1e038c34e7d25cf6f31f17261c8ca6147c10e
    entry_key: a972ca529506ff1cb5ddd4a56c63f2c609c31374dd64af73c1f2bdbc20c3f482
  - object_id: SMP-GEO-C1-AFTER-Q4-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 5f8c09a83ff33278d579dcff29633dfc555af6da4c85b7b5d491b4fa7daf6772
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-google-ai-1.md
    snapshot_sha256: 5f8c09a83ff33278d579dcff29633dfc555af6da4c85b7b5d491b4fa7daf6772
    entry_key: a99f63dcb2712a5d9d98f006e41de0069ce5457466dc2a1e680888fcb25e0d3c
  - object_id: ARV-GEO-C1-AFTER-Q5-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-google-ai-1-reviewed.md
    content_sha256: 2b35cbbf1bf33356e95617e702afca8cde7e9e7c47665c5e8cf6874103254991
    file_sha256: 9f6bd9f55b7e1aa40600b6e3fe34520767776fccb3c97449e010b1c9d5b7c8d6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-google-ai-1-reviewed.md
    snapshot_sha256: 9f6bd9f55b7e1aa40600b6e3fe34520767776fccb3c97449e010b1c9d5b7c8d6
    entry_key: aa55c4f18acf44e2e88e269f8db9d099010ced4ba8732195599ab6c29e11b214
  - object_id: FND-GEO-SITE-C1-BASE-OWN-CRAWLABILITY
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-own-crawlability.md
    content_sha256: e91bfa0ec2e04024f1ce034827c414931a31ed8191e3a756f816c54fdfa95edc
    file_sha256: df6e2e2374c5555878c7d47b7b7aad997542d02b09827a6b595bd637c454d63d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-own-crawlability.md
    snapshot_sha256: df6e2e2374c5555878c7d47b7b7aad997542d02b09827a6b595bd637c454d63d
    entry_key: aaa2a3e0b4a4ecf251534ce9c6a65d48735ef4e20f851d52c788239670ba2217
  - object_id: AGG-GEO-C1-BASE-Q1-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-gemini.md
    content_sha256: c1a5c6684deb40657d6ebda9da4f4dd760d8efc61995a96557d116d5dd6cf2be
    file_sha256: cb552125a58ceb5a519a7085d2b676449332f3fc11a8cd4a8aa4e1583ddb92ec
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-gemini.md
    snapshot_sha256: cb552125a58ceb5a519a7085d2b676449332f3fc11a8cd4a8aa4e1583ddb92ec
    entry_key: aad3d0c2210c62112076c367c474b1b2747337a3a2e7c8f4f34cec4328ce428c
  - object_id: AGG-GEO-C1-AFTER-Q3-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q3-claude.md
    content_sha256: 2cdc2073da29bcf004499ae35cd124d9a788e5edf56e87d49d051a2343d9f94c
    file_sha256: 9e8d76d6dd22731df8275e1aec697fb61b8d9b11d1341e387aa406516e0ea138
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q3-claude.md
    snapshot_sha256: 9e8d76d6dd22731df8275e1aec697fb61b8d9b11d1341e387aa406516e0ea138
    entry_key: ab6a997639e4354af7e26be28d18a5d163faa85e04208cecad98284a9d8f437a
  - object_id: Q-WHAT-CAPABILITIES-DOES-THE-REHEARSAL-EN-A732
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-capabilities-does-the-rehearsal-en-a732.md
    content_sha256: 3a6e7f00300fc991bfe500930fff0bfe4ae811e5c7d13886fa50b02771d467d2
    file_sha256: 35c769d2c2eba84d3fc95e2fe9607dea29d377bf4f1c33a76f2b62e67f4f98cf
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/queries/candidates/q-what-capabilities-does-the-rehearsal-en-a732.md
    snapshot_sha256: 35c769d2c2eba84d3fc95e2fe9607dea29d377bf4f1c33a76f2b62e67f4f98cf
    entry_key: ac055d9249e4c1965204c6b0d9332d272f592e272a6f3130ab238a69019b6f4b
  - object_id: ARV-GEO-C1-BASE-Q5-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-gemini-2-reviewed.md
    content_sha256: 2cbf1803f0cc87cb5dc67426d6aa834db17efa3ae0ff4f4cc5abecf7312862b7
    file_sha256: 1da04723b0b219880b91bd0ccc1d175b9a3f5ce86e42307fdeda2821b1b3a76d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-gemini-2-reviewed.md
    snapshot_sha256: 1da04723b0b219880b91bd0ccc1d175b9a3f5ce86e42307fdeda2821b1b3a76d
    entry_key: adce2284c8654a62d8c0247ac8c922b056b3458ee4ddb4fde4b6469835bcfdb2
  - object_id: ARV-GEO-C1-AFTER-Q4-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-gemini-1-reviewed.md
    content_sha256: f3f632a4b52a62f36ada208f21a62506772c49d9c0d4624d27beddd94d1cc1ab
    file_sha256: fa2b58dc3eefabbfdc5a2082cec8f6587409d8f43bae70d8c4a0d8eb4a829d09
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-gemini-1-reviewed.md
    snapshot_sha256: fa2b58dc3eefabbfdc5a2082cec8f6587409d8f43bae70d8c4a0d8eb4a829d09
    entry_key: adef44e493f60b3d0feb65bd0be797de3c598b5f22467f2f45b4ed96e593e5f1
  - object_id: DOC-GEO-E2E-CASE
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-case.md
    content_sha256: 7b0444b51d3763c8c8041c03de8f069a6ada649ef8b4f8f054a2713cf32faf92
    file_sha256: 714208c343ad81826406674317329fc667161d45fb9a0831436c94fce37ea3be
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-case.md
    snapshot_sha256: 714208c343ad81826406674317329fc667161d45fb9a0831436c94fce37ea3be
    entry_key: aecc17b85c759d902f43dd578b6c37f2a64f82cf930d2831ad5bc54ef34e5f93
  - object_id: ARV-GEO-C1-BASE-Q2-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-1-reviewed.md
    content_sha256: cbb4a245702737d6708476132ceb781c72571ca0f2d828357f6c205760fb0de6
    file_sha256: 893776ca9ad2c27ab9c4b3f5e35c567f06623b1734362240cc721acc56148630
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-1-reviewed.md
    snapshot_sha256: 893776ca9ad2c27ab9c4b3f5e35c567f06623b1734362240cc721acc56148630
    entry_key: af7540b35f46b17ece6490bd5bfecbe2c7f5547e3b5dba460239ae74dd142167
  - object_id: ARV-GEO-C1-BASE-Q4-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-2-reviewed.md
    content_sha256: 8056923fc91bdffb468d8dd5538cdb5321d8a589a477ccee51a49200ebaad05a
    file_sha256: 7b4190eea2b507c1c9c103521ed6e972829e144f0f315553dc26c94382aef9e1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-2-reviewed.md
    snapshot_sha256: 7b4190eea2b507c1c9c103521ed6e972829e144f0f315553dc26c94382aef9e1
    entry_key: af7836cd1eaf2d72d09ab3c1c359caa2136a1b46aef3d3a2a8bdc31a7126d506
  - object_id: SMP-GEO-C1-AFTER-Q3-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 947f72698bcdb17e18dc77f5fa699f169a51ec57246584f02247b7485b4168b2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-claude-1.md
    snapshot_sha256: 947f72698bcdb17e18dc77f5fa699f169a51ec57246584f02247b7485b4168b2
    entry_key: b05efe65de6075ed05f886f19355db64a9baecb76b73206bb15766b8c3c22b9f
  - object_id: ARV-GEO-C1-BASE-Q2-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-2-reviewed.md
    content_sha256: 3b3e8de9baaae1a18ad9afaac54a2b56c148fd8d6db11d9c2e1831ab30291937
    file_sha256: 844aabb7af33f36c76fd37f71b6aeff588dea1e3716b0a46c499358833d2515d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-2-reviewed.md
    snapshot_sha256: 844aabb7af33f36c76fd37f71b6aeff588dea1e3716b0a46c499358833d2515d
    entry_key: b1e226cb630acb5d4e135decdd35b95fc718e4b6c9a439b1fcb1a9c8f945705b
  - object_id: SRC-GEO-E2E-PRIVACY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-privacy.md
    content_sha256: 1f715fc357d9cad4ec3309c90babd8e66e0cca6207463f3f5915bed060fc7301
    file_sha256: 09237fe58794e0b2f498db110b2e1cfbee705ab7c33e794355780b1b4e87f926
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-privacy.md
    snapshot_sha256: 09237fe58794e0b2f498db110b2e1cfbee705ab7c33e794355780b1b4e87f926
    entry_key: b2f695239809157ab717bbdd49bc6ae2c41feae7e62fad0775ee77118fd9b938
  - object_id: ARV-GEO-C1-AFTER-Q3-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-claude-1-reviewed.md
    content_sha256: 5f723010c75afc56fe8c9bd85b2cc9bc6dc08bc27b3ad9080a89d00b1e730a8b
    file_sha256: 9b6df55da605fc1241d60d3aabfd0e578039c4c55a25e2e72e8bb4a15bbffe34
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-claude-1-reviewed.md
    snapshot_sha256: 9b6df55da605fc1241d60d3aabfd0e578039c4c55a25e2e72e8bb4a15bbffe34
    entry_key: b40ab30caadc930de077b4ba279bb26e48ba88e504d4990597486021a5df990c
  - object_id: FND-GEO-SITE-C1-AFTER-OWN-META-DESCRIPTION-PRESENT
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-own-meta-description-present.md
    content_sha256: fb9ac32410a8fab8378c152359d2f895b1ca404eb83f5eb7a583e16528c783e9
    file_sha256: 0c74c6142236dd1c1862a6471246fb6e53cc6673674010bfee355048d612f94e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-own-meta-description-present.md
    snapshot_sha256: 0c74c6142236dd1c1862a6471246fb6e53cc6673674010bfee355048d612f94e
    entry_key: b40ae477df7b375731d45451b6728e491e5b33b9553eeb6ce00b9d56a1981f2c
  - object_id: SRC-QINPUT-26E9601953DD31494C5C
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-qinput-26e9601953dd31494c5c.md
    content_sha256: 3cb19a045fc2ae27f489a396a71ebe48b63f92cc8d57053de16ed2fce8f97362
    file_sha256: 1985971c6d74500bb8d11dfaf778cc9ab1936dfeb221450c41dd5f70236ed5fa
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-qinput-26e9601953dd31494c5c.md
    snapshot_sha256: 1985971c6d74500bb8d11dfaf778cc9ab1936dfeb221450c41dd5f70236ed5fa
    entry_key: b441771f4ace35b79acdb96be7cb97562a42e4d99ec11100a87015300418d283
  - object_id: AGG-GEO-C1-BASE-Q1-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-google-ai.md
    content_sha256: a1dece7b6d2784b5b72f035814fe619a93e99ed492b675ab6ac35bd45e9c6def
    file_sha256: f5dc3f9e14540ed8419602685aedf2de1a645058cb145955487366dd7786135f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-google-ai.md
    snapshot_sha256: f5dc3f9e14540ed8419602685aedf2de1a645058cb145955487366dd7786135f
    entry_key: b4b8d9769b6d39e6024a32d1892606a6f9d07fd12d897ae4b115b4db8e7ce744
  - object_id: ARV-GEO-C1-AFTER-Q3-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-perplexity-1-reviewed.md
    content_sha256: aacfb60bceb9fe0ee827ebc19f952f6e13b168070b01e3b0f6bafc2fa4d14c83
    file_sha256: 77fbd73ed6e914ee39b2beef46c24dd6543165395a6d128a5634d59856bfef52
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-perplexity-1-reviewed.md
    snapshot_sha256: 77fbd73ed6e914ee39b2beef46c24dd6543165395a6d128a5634d59856bfef52
    entry_key: b4e2fe67f39e36cffe110dcdcebc8ee5818688a0b95b4f7e5886464df7158bd4
  - object_id: AGG-GEO-C1-AFTER-Q1-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q1-perplexity.md
    content_sha256: 744a03cef84357739856a824fdf146cde028071669500c10447606f00541ca48
    file_sha256: e899add07e382ee00bf350766cca42c221ebefb34445075af7239211f4cae18e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q1-perplexity.md
    snapshot_sha256: e899add07e382ee00bf350766cca42c221ebefb34445075af7239211f4cae18e
    entry_key: b5af064f1eaaa575146c628698cd421f95ac519839eb5fd946eeb50616ea1b78
  - object_id: SMP-GEO-C1-AFTER-Q4-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 6f698d5067b72c023756a9657f3b5ca1218077ed63eae61a88fded85f47398e7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-claude-1.md
    snapshot_sha256: 6f698d5067b72c023756a9657f3b5ca1218077ed63eae61a88fded85f47398e7
    entry_key: b68c4499af30f0545d633ad9d48ec05b3e4a576b4c8e49c4030a854e308b95c2
  - object_id: SMP-GEO-C1-BASE-Q4-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: b98e6ce0e476c0c4506e7c120c07402c3956591263c59bd7bc17bf3a2c2c94f6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-2.md
    snapshot_sha256: b98e6ce0e476c0c4506e7c120c07402c3956591263c59bd7bc17bf3a2c2c94f6
    entry_key: b70184162cfb1a0e66244ffad9540553e8a8466efcc9bd38d6d65b4d93d2488d
  - object_id: SRC-GEO-E2E-ONBOARDING
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-onboarding.md
    content_sha256: d6fd212806c92f8b1d294e5b0d5f0afaa052d13d205a6f413183bf3746d0c908
    file_sha256: 4691afe6a2344fb54de2e2b07a32fe7c5963df7bb4fa6ebaeae8fa5cb40ad3ae
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-onboarding.md
    snapshot_sha256: 4691afe6a2344fb54de2e2b07a32fe7c5963df7bb4fa6ebaeae8fa5cb40ad3ae
    entry_key: b775b1d886fbe428c9aed1e4b8bf6081cd4a8c70b27d8265047e6ad443814da3
  - object_id: SMP-GEO-C1-AFTER-Q1-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 900daf3b2b167b796899bf52ddcc09869ecc0a93e9e8dd980b4db21f47700dbb
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-gemini-1.md
    snapshot_sha256: 900daf3b2b167b796899bf52ddcc09869ecc0a93e9e8dd980b4db21f47700dbb
    entry_key: b7985fd1c98fdd2daa52fca1e1bcb3016ac0db80ead21bd69407b38f36a975a4
  - object_id: FND-GEO-C1-OFFICIAL-2
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c1-official-2.md
    content_sha256: f628591371778e651f6d767bd853709f949cf2a6549f7a650f395862362aabfe
    file_sha256: ed0942d94c4786f9d5f2c552868ca67d343203f4c3c5f0a1e82a4fd850b1ccb9
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-c1-official-2.md
    snapshot_sha256: ed0942d94c4786f9d5f2c552868ca67d343203f4c3c5f0a1e82a4fd850b1ccb9
    entry_key: b8a162be5432cc15223cdf0fc94ec1ddf6850d2fa0557a55b30989f242580076
  - object_id: SMP-GEO-C1-AFTER-Q4-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: dce42dc59d8588beb183ed2ecaa98a8abb0ac8ea2f838d37ed0c516d817d55d0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-chatgpt-2.md
    snapshot_sha256: dce42dc59d8588beb183ed2ecaa98a8abb0ac8ea2f838d37ed0c516d817d55d0
    entry_key: b9228ffe1f4ceed9dcdf9ac63d1ace16d7157c63f041c73b18bcbb4cc2c840b0
  - object_id: ARV-GEO-C1-AFTER-Q6-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-google-ai-1-reviewed.md
    content_sha256: 42f6752bc218db0105c8702f3eab90ddb1df2523c5dff477cfa8928a1b835fcd
    file_sha256: dbfa0354a7692e5b536ec2d6b8fda10899ee87952acc208becab78a98619dd5c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-google-ai-1-reviewed.md
    snapshot_sha256: dbfa0354a7692e5b536ec2d6b8fda10899ee87952acc208becab78a98619dd5c
    entry_key: b95543b5d452b5dd46ecd2d7ada8ff08f0f286730e08842ed98d80b6eb7b20b8
  - object_id: ARV-GEO-C1-AFTER-Q3-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-chatgpt-2-reviewed.md
    content_sha256: db46d8d53ba48f93044a87d8efc104ff6a5b844da67487a740a65ab021e65145
    file_sha256: 97e6173186ea7a05bef1157908dfe239c41253680573c8548e32b71e6fd8bc97
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-chatgpt-2-reviewed.md
    snapshot_sha256: 97e6173186ea7a05bef1157908dfe239c41253680573c8548e32b71e6fd8bc97
    entry_key: b9c524794579ee2be49b5d1f1528ed48aea96944c5fd6395f3abce446d997474
  - object_id: ARV-GEO-C1-AFTER-Q5-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-gemini-1-reviewed.md
    content_sha256: 9fef20dcc8b6ed4bdb711ccbe338b6ee5bea12aa3c020d2893d28196e76141f4
    file_sha256: e55a3ef0d2aa5b731eda65f8a6cfbcbdd47c030bb9951247ff5c0658d3e0c6a8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-gemini-1-reviewed.md
    snapshot_sha256: e55a3ef0d2aa5b731eda65f8a6cfbcbdd47c030bb9951247ff5c0658d3e0c6a8
    entry_key: bb542afd1af603304f625493a20915e0097cb17210758ff775a2b62032b6012a
  - object_id: PUB-GEO-C1-OWN-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c1-own-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: a89f96e77577bab25266f5035bda20bcb1ef02f6cc1707bf4547f5769105f5e4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/publications/pub-geo-c1-own-v2-confirmed.md
    snapshot_sha256: a89f96e77577bab25266f5035bda20bcb1ef02f6cc1707bf4547f5769105f5e4
    entry_key: bb6e7998427cfc3c4817fcd8694db2af4e8ce35bd99ab94da8db64e596f491f4
  - object_id: AGG-GEO-C1-AFTER-Q6-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q6-perplexity.md
    content_sha256: 41b23d960343666ebb095e8a2cbd6afa670cb3619c0c387243fb09d2fa374e9b
    file_sha256: ab4f2db6ea2029e8404b1b2b8581dedf51b460e3d1401bb09b98c3f454843987
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q6-perplexity.md
    snapshot_sha256: ab4f2db6ea2029e8404b1b2b8581dedf51b460e3d1401bb09b98c3f454843987
    entry_key: bc2056f48d8f733f2ea1e8d4f92329d4d8c7114f05fdf458edfa7743a1ca603d
  - object_id: FND-GEO-SITE-C1-AFTER-OFFICIAL-META-DESCRIPTION-PRESENT
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-official-meta-description-present.md
    content_sha256: fb9ac32410a8fab8378c152359d2f895b1ca404eb83f5eb7a583e16528c783e9
    file_sha256: b2b59c9498a8f47f325e7f91bcc5d8ec9b32f5548c7a57e560bfffdb4333a2c5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-official-meta-description-present.md
    snapshot_sha256: b2b59c9498a8f47f325e7f91bcc5d8ec9b32f5548c7a57e560bfffdb4333a2c5
    entry_key: bdb865785d7eb178ec79c71c4dd5a4819ca7f173e85ccc15d9047279869be43f
  - object_id: SMP-GEO-C1-AFTER-Q6-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 09ab05319116df352e826fd08c78d6e52993b630bfdc612a09494f331796f4a4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-gemini-1.md
    snapshot_sha256: 09ab05319116df352e826fd08c78d6e52993b630bfdc612a09494f331796f4a4
    entry_key: bde610e8c8c06a464d47e0cc06c39ebd20225693ceac090b7769049f1b54ecb9
  - object_id: ARV-GEO-C1-BASE-Q4-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-2-reviewed.md
    content_sha256: e1bd62780aa99a3b65894206789b0937578f97d36595e7ea1bbee75182968ff9
    file_sha256: 272d5557cd263411939be14e960bf733ea44983d1a3bdf3bda36a261528569eb
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-2-reviewed.md
    snapshot_sha256: 272d5557cd263411939be14e960bf733ea44983d1a3bdf3bda36a261528569eb
    entry_key: be95345019ab15d3537a4733f873a4a92e01e8bac4bd9152ae539fb211cf4d03
  - object_id: AGG-GEO-C1-BASE-Q4-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-google-ai.md
    content_sha256: 3bbbc69d0b42a0960fef9361378ed3c4bbcddffe1abb65fa43d4a3cef99eaaeb
    file_sha256: ec38e102aaf6347e88d1ee12d9e7beed44610f4a07f5d5b23295f933891af950
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-google-ai.md
    snapshot_sha256: ec38e102aaf6347e88d1ee12d9e7beed44610f4a07f5d5b23295f933891af950
    entry_key: bed3febe3f5f928a2ff0cad595418bdc307007e5b303c6b7908b698a73fdba07
  - object_id: FND-GEO-C1-THIRD-PARTY-1
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c1-third-party-1.md
    content_sha256: 72fb71eb47678d13229bbf04ebb2b8616fa7466fa32b1dc17ce6253ee0f73c81
    file_sha256: 354cbba4dbd66e0ede8063454cabe2541ff8328b5339561fb0a5f8667cab2067
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-c1-third-party-1.md
    snapshot_sha256: 354cbba4dbd66e0ede8063454cabe2541ff8328b5339561fb0a5f8667cab2067
    entry_key: bf85532cb00fe19cb0e71d233170c48d7b727f7b4ec8b3e6c52691d0e4037e5e
  - object_id: SMP-GEO-C1-AFTER-Q4-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 79417607c64059bb8c5d647540ffceafdef6091eee696870eac93d7e5a41573b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-claude-2.md
    snapshot_sha256: 79417607c64059bb8c5d647540ffceafdef6091eee696870eac93d7e5a41573b
    entry_key: bfef2cead946e7a60fa59ee5f2bac6bd9816ad09b2e32ca4745e73bebde7f1ec
  - object_id: EVD-GEO-E2E-ANSWER-DEFINITION
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-answer-definition.md
    content_sha256: 39e9f04bfbb709f8985c63171446a5d66214132c264165afb6eb98c13a5bbb95
    file_sha256: 32a38848347f185bb45040f1ea5a623c2166129702a0194a527debe3377486f6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-answer-definition.md
    snapshot_sha256: 32a38848347f185bb45040f1ea5a623c2166129702a0194a527debe3377486f6
    entry_key: c02364119db25600ae6526a781ddbc5821118ca7612f23d51bb78094a3462235
  - object_id: ARV-GEO-C1-BASE-Q6-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-2-reviewed.md
    content_sha256: 591465021a543076d839de1994b7551de40b2e6020a90f68b21353a0a7d0df53
    file_sha256: eb7df3b8b32f4e01a6b08377c1fe227ed143350eda262db0198be8b12ddd4e5c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-2-reviewed.md
    snapshot_sha256: eb7df3b8b32f4e01a6b08377c1fe227ed143350eda262db0198be8b12ddd4e5c
    entry_key: c0a6c6045ff6b094bfa855ac3433c6758bd9e00987ccab00a1abecb0b9c3c006
  - object_id: ARV-GEO-C1-AFTER-Q4-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-claude-2-reviewed.md
    content_sha256: bf1d61f3eb315c96bab0880329945ce64c7f96042644d6bbccd7db93426112ea
    file_sha256: 93a8d503a8b981f3c8e4be3133b681be7c138078f9bf19291880a6c329524f74
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-claude-2-reviewed.md
    snapshot_sha256: 93a8d503a8b981f3c8e4be3133b681be7c138078f9bf19291880a6c329524f74
    entry_key: c17a0ee535e4064484eb39b1dc0866a8195badaf11db0d3c4f379f03177b71c1
  - object_id: ARV-GEO-C1-BASE-Q6-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-claude-2-reviewed.md
    content_sha256: 0049553ff019af54607529496731b0d31cddd6b944937ab6912bc98189d35c8f
    file_sha256: ff0e31f491ed4db4c65f0d4298fd3e4b8e699fcc9c16496fb64f5f15c3a77aa3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-claude-2-reviewed.md
    snapshot_sha256: ff0e31f491ed4db4c65f0d4298fd3e4b8e699fcc9c16496fb64f5f15c3a77aa3
    entry_key: c1aff065e75c2c33855f700f288bf8e1220a9a89d19244e1ad71b2cc526adf86
  - object_id: Q-WHAT-PRIVACY-AND-GUARANTEE-LIMITATIONS-EN-7E60
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-privacy-and-guarantee-limitations-en-7e60.md
    content_sha256: f3999be15f70663cb32657e806d0dfd06ecca0d2648bcd9a891f53b4df4a695d
    file_sha256: 280a91f094bd1bcdcf1ba7f545e6ffddc5cf23e9d1024cc36d171f66dcf071ec
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/queries/candidates/q-what-privacy-and-guarantee-limitations-en-7e60.md
    snapshot_sha256: 280a91f094bd1bcdcf1ba7f545e6ffddc5cf23e9d1024cc36d171f66dcf071ec
    entry_key: c1bd8c7b5a6aa8aef577dbc35cf1ad90362108c0e899bc68ca133631da29dc71
  - object_id: ARV-GEO-C1-BASE-Q3-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-1-reviewed.md
    content_sha256: 8270577a276360e31fd4d992082b5fc3bcf38ef18afd32c97bf015b7a0c64c1e
    file_sha256: 0b38f458ffee83f569eff4eab6225bbf0d31b3522ecf311eeee8ffcbeaf333d6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-1-reviewed.md
    snapshot_sha256: 0b38f458ffee83f569eff4eab6225bbf0d31b3522ecf311eeee8ffcbeaf333d6
    entry_key: c329ccbc1172d8f5552e93404b7ae87907e075956a20a54e3f71620c23db313d
  - object_id: SMP-GEO-C1-BASE-Q3-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: c2b12c8f810e5b73b7005e104723cdda2b79e483cdefeddf13670a10b970ce30
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-gemini-2.md
    snapshot_sha256: c2b12c8f810e5b73b7005e104723cdda2b79e483cdefeddf13670a10b970ce30
    entry_key: c3672d71200e9820ac726c7ae662dabf2d9b47ebff3a8262cb04051d4a2e99fa
  - object_id: ARV-GEO-C1-AFTER-Q2-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-chatgpt-2-reviewed.md
    content_sha256: e3967f1176e11f458170e56b176252e062d2ca5c4e5784ff09f44c641509b39e
    file_sha256: 99a7dba977f20275380aa05b225f3e02cd4e5818e883da0b922dd4cb51a264c2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-chatgpt-2-reviewed.md
    snapshot_sha256: 99a7dba977f20275380aa05b225f3e02cd4e5818e883da0b922dd4cb51a264c2
    entry_key: c51aa723507b94949963ad2a2b854ef5ac5da476e62c6ac61f27345eb11faa54
  - object_id: PUB-GEO-C1-OFFICIAL-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c1-official-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: 666e0e5cde2d1821b0b3739fafe6d30e9d88dbf882eae74955f40637c90ef4f8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/publications/pub-geo-c1-official-v2-confirmed.md
    snapshot_sha256: 666e0e5cde2d1821b0b3739fafe6d30e9d88dbf882eae74955f40637c90ef4f8
    entry_key: c5ce9a8e5d487e5a97b140889fe82d6896e89e9dd677bd53f216b6b5fe337d09
  - object_id: Q-WHAT-IS-THE-REHEARSAL-SERVICE-EN-B466
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-is-the-rehearsal-service-en-b466.md
    content_sha256: 256f8a7315348698bdbe7d66546ec20e92b6c437c967cb4e72d368c716497f09
    file_sha256: 529fd59c2d52b9e38aaec506fd382e656ebf28798e7829c1dda02e9cf85e7683
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/queries/candidates/q-what-is-the-rehearsal-service-en-b466.md
    snapshot_sha256: 529fd59c2d52b9e38aaec506fd382e656ebf28798e7829c1dda02e9cf85e7683
    entry_key: c705d782e09b303e5005fe1e4caac7b2fdeb338629e6a7f11ad8266ac56f8cc6
  - object_id: AGG-GEO-C1-BASE-Q5-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-perplexity.md
    content_sha256: b937b064201e431264bd66a64b64adf0cbd2f6e3e84afb1d5118f6f4cfe6d7af
    file_sha256: d50479fdc44c28ffc8ae0759d2aa47596e3270b0e7905e64d5dd0a4b2275f90b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-perplexity.md
    snapshot_sha256: d50479fdc44c28ffc8ae0759d2aa47596e3270b0e7905e64d5dd0a4b2275f90b
    entry_key: c8158063206a36af2da2106db4440e919c6da7592c76854abb3eb30533527c68
  - object_id: SRC-GEO-E2E-ANSWER-DEFINITION
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-answer-definition.md
    content_sha256: 39e9f04bfbb709f8985c63171446a5d66214132c264165afb6eb98c13a5bbb95
    file_sha256: 4d7a38cdc4f48630c9d0f4355d7f6da7f71d2f51b4831d644d002a1e4fa88d3c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-answer-definition.md
    snapshot_sha256: 4d7a38cdc4f48630c9d0f4355d7f6da7f71d2f51b4831d644d002a1e4fa88d3c
    entry_key: c8b8e5f8600bf923e296f8a50f2645631323683744a53fe5e1e7dc0b4b75f06e
  - object_id: SMP-GEO-C1-BASE-Q2-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: e0f584f1594251c1c9996ff6906f211bc4ec8e0bfe3b891c8f3446255c8b6af4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-claude-1.md
    snapshot_sha256: e0f584f1594251c1c9996ff6906f211bc4ec8e0bfe3b891c8f3446255c8b6af4
    entry_key: c8cfd44ec099423da35d566b6fcff574d30b030bbe6c48b93983d7ed38b646bf
  - object_id: AGG-GEO-C1-BASE-Q2-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-google-ai.md
    content_sha256: fef2b265fd814c119ce39cdc80ec8503f2359bb2a75a19cde960ead5cdea1c07
    file_sha256: 566b1ba49e2a9eab33641222dc118eda425073c3e10aaaf7932bf15b4daaf47c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-google-ai.md
    snapshot_sha256: 566b1ba49e2a9eab33641222dc118eda425073c3e10aaaf7932bf15b4daaf47c
    entry_key: c8d1bb593c346bf121b7014a5ea5f3b5b3495e73bf7f65dfd10338f667bd30e6
  - object_id: SMP-GEO-C1-BASE-Q6-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: b95ec8b7402b79938eae43c81c5d7dbaae5e199e0eaecf54e2f8eece3cd64ebb
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-google-ai-1.md
    snapshot_sha256: b95ec8b7402b79938eae43c81c5d7dbaae5e199e0eaecf54e2f8eece3cd64ebb
    entry_key: ca5929e074b68b71488e67ff1f6c4cc3a61d5a1b85388bfaedd7f66359176ef4
  - object_id: SMP-GEO-C1-AFTER-Q6-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: e4da02ef73840ed5ccf001176c98795de92fcf68cc0370e5fcab774a992ddad7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-chatgpt-2.md
    snapshot_sha256: e4da02ef73840ed5ccf001176c98795de92fcf68cc0370e5fcab774a992ddad7
    entry_key: ca7fcbb472c3eb24c79762f26e71459e1b72649a09c76ceb546baaf25c1599cf
  - object_id: ARV-GEO-C1-BASE-Q5-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-2-reviewed.md
    content_sha256: a7773982a9014bfffcc76b0204674eae794f8737d8e58265aa80b91e8b769e39
    file_sha256: 412ea8403fb8678e1246dd4c6abaf3b7e950ab7100661e61cab09d672ff64cc4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-2-reviewed.md
    snapshot_sha256: 412ea8403fb8678e1246dd4c6abaf3b7e950ab7100661e61cab09d672ff64cc4
    entry_key: ca86ececc06bd1df061f3853fa37181d2524b338aea6b53c819558e9682dda59
  - object_id: ARV-GEO-C1-AFTER-Q1-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-perplexity-1-reviewed.md
    content_sha256: 8a611aa1570f49400451263760710d2d83a282e634d85db70119795071525105
    file_sha256: b0870a759eea496dd6606563378326c5d13aee4662415f2a1268c1251f92d584
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-perplexity-1-reviewed.md
    snapshot_sha256: b0870a759eea496dd6606563378326c5d13aee4662415f2a1268c1251f92d584
    entry_key: cb94a725e2f9a6bbb010b96b72bb808b10cda6cd345bbed9b4164de1792eb98e
  - object_id: AGG-GEO-C1-BASE-Q4-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-gemini.md
    content_sha256: 7db889c2020bbc1fd08a9ad3918eb21e600e2a798cd39fb8dc955d1b22b67b64
    file_sha256: 0496e01480e77d2e869f4e640579505fc96e9b501607099521087a3fdaf22ed3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-gemini.md
    snapshot_sha256: 0496e01480e77d2e869f4e640579505fc96e9b501607099521087a3fdaf22ed3
    entry_key: cbd3812a4ae055542a51c4726ee77c47e33c9ce3472903256da9c98e8ca48b35
  - object_id: ARV-GEO-C1-AFTER-Q3-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-google-ai-1-reviewed.md
    content_sha256: 613b12dd63916eb5fc171547636775b5c6db602b9cd254ca5d256676720a7725
    file_sha256: aefdee3fe0b19edcd907fdde618ae8ffcc636517dff1bbb9080dde966d5743d7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-google-ai-1-reviewed.md
    snapshot_sha256: aefdee3fe0b19edcd907fdde618ae8ffcc636517dff1bbb9080dde966d5743d7
    entry_key: cbd920f0e7322a6d2138e8128cbd3577b3fc7d3c776a9b59378799070112683e
  - object_id: SMP-GEO-C1-BASE-Q6-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 16df291ced314a5121e744d213c34c9e2eb0f451d8a94ed6e20c6a6a29b9b1c4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-claude-2.md
    snapshot_sha256: 16df291ced314a5121e744d213c34c9e2eb0f451d8a94ed6e20c6a6a29b9b1c4
    entry_key: cbe117a2bcd1ec378fb13de9a37999e3601c4173e74439b0c39b250184f208e9
  - object_id: SMP-GEO-C1-AFTER-Q4-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f8a2efdd1b2eea47f88429a293725b2ef40cf4fa774887c9ef264a8d4feb4e3d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-gemini-1.md
    snapshot_sha256: f8a2efdd1b2eea47f88429a293725b2ef40cf4fa774887c9ef264a8d4feb4e3d
    entry_key: cc05c82806178f906029e6c8dd15f7b42a6e8c92f30774b535e74089455899ba
  - object_id: SMP-GEO-C1-AFTER-Q6-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q6-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: aa5dc30326ff0dd74296abf6b7b5dede262d0e425f43cb0759c215342a9e7617
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q6-google-ai-1.md
    snapshot_sha256: aa5dc30326ff0dd74296abf6b7b5dede262d0e425f43cb0759c215342a9e7617
    entry_key: ccf1ebba160f750d09229ffd42c963aefceb0ca29d375e1517d362008ec4cec4
  - object_id: FND-GEO-SITE-C1-AFTER-OFFICIAL-CRAWLABILITY
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-official-crawlability.md
    content_sha256: 5e6cf5a5e24db76c78f00a3863a7b044540531e72d5b1e991d5f9774e2e3c9d2
    file_sha256: 289e670ab53217573e20e95136716850b8f0235ca6d5150e23a2955fae5fcb95
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-official-crawlability.md
    snapshot_sha256: 289e670ab53217573e20e95136716850b8f0235ca6d5150e23a2955fae5fcb95
    entry_key: cd1a08de337518d487a1374fb6e10764a399710ba8b673d850dfc41f7754d34f
  - object_id: FND-GEO-SITE-C1-AFTER-OWN-CANONICAL
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-after-own-canonical.md
    content_sha256: c56af95ee672b8ffea6954607444ccd50222ac59a1a2bd809e7905c2955f9431
    file_sha256: 1f4907a5d84fbcf2f2fedcfdbf8be8cc6de690e479b3fd3fb21c2495f0d98973
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-after-own-canonical.md
    snapshot_sha256: 1f4907a5d84fbcf2f2fedcfdbf8be8cc6de690e479b3fd3fb21c2495f0d98973
    entry_key: cd5d095b31f102381d3690302cbc3b13e4aecb0927bac3576a2913778394f399
  - object_id: ARV-GEO-C1-AFTER-Q6-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-claude-2-reviewed.md
    content_sha256: 514af184123f0883c55a1ccc0ef8cbe144c30bab51fa94f2f77b28d7938c2f8c
    file_sha256: 6ecb680aebc8c052e50c74adfb0e8fbad0a11f35806ba4410217275f5384d80a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-claude-2-reviewed.md
    snapshot_sha256: 6ecb680aebc8c052e50c74adfb0e8fbad0a11f35806ba4410217275f5384d80a
    entry_key: cf47399cef8700f02a3d2066cd73e2f1828b68cf592cff5eebff8625741a60af
  - object_id: ARV-GEO-C1-BASE-Q5-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-2-reviewed.md
    content_sha256: 20fdf5230e708de10fe1eb6906189647be4c25fd957ffd71ad08cafedf99e957
    file_sha256: 7aa4f0af841cab131375a9784f8cb00e16a542cc764b8e55501035bc270969ed
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-2-reviewed.md
    snapshot_sha256: 7aa4f0af841cab131375a9784f8cb00e16a542cc764b8e55501035bc270969ed
    entry_key: cf4a110746a56ccea17e97b5d7bbb3bd46f2f85c65e6ab0f9c4d6d66ff408a5b
  - object_id: SMP-GEO-C1-AFTER-Q3-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: eae19f4f1cb0e99e9557c075ebae146661e5d8a4f56291a8d3424c6cb3ab9202
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-google-ai-1.md
    snapshot_sha256: eae19f4f1cb0e99e9557c075ebae146661e5d8a4f56291a8d3424c6cb3ab9202
    entry_key: d029c019fbc340dd2b78883ff3cf426c6e3b364166be2b96b7dad5768e64ee5c
  - object_id: AGG-GEO-C1-AFTER-Q4-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q4-chatgpt.md
    content_sha256: ec92f04a9d40ca8f69bb32355eaabd25a421bf3702d4d6f745b918d09e37ee10
    file_sha256: 152362300d461a37b89b2a4720b413d892af01630385a3cec5abba732c390bff
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q4-chatgpt.md
    snapshot_sha256: 152362300d461a37b89b2a4720b413d892af01630385a3cec5abba732c390bff
    entry_key: d1efab804ce464d0e56225c8fb98da0d2baeaa35f397471d06114f8ea2ae591f
  - object_id: SMP-GEO-C1-AFTER-Q3-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: ea10fe9528d3bb1315e572d33f56a1048cfa360bc3a199ee049ce927f53c2a34
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-gemini-1.md
    snapshot_sha256: ea10fe9528d3bb1315e572d33f56a1048cfa360bc3a199ee049ce927f53c2a34
    entry_key: d23e2312e92a4449e4d616e65971760faec609d19323c9751b42432107d2b19f
  - object_id: SMP-GEO-C1-AFTER-Q5-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: f0b1eea8d9764ddc80cddd60662f6198e87315bb2286171fcff6020f5aca2551
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-perplexity-2.md
    snapshot_sha256: f0b1eea8d9764ddc80cddd60662f6198e87315bb2286171fcff6020f5aca2551
    entry_key: d3c474300cf5edc3c68b9dcf126507a4590148bd46c15c17981db0d0d3d4256c
  - object_id: SMP-GEO-C1-BASE-Q6-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 2570dfe19de85863a5f22323d2aaf4b7382a7b0f712b2f152b4cc649d66fefcf
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-gemini-2.md
    snapshot_sha256: 2570dfe19de85863a5f22323d2aaf4b7382a7b0f712b2f152b4cc649d66fefcf
    entry_key: d408d79e17797397d9291d7f62c8c155bdb5c33929a57250686a71698e1f7a69
  - object_id: CPF-GEO-E2E-C1-BASE-GEMINI
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c1-base-gemini.md
    content_sha256: 88f518c05bd10c7733d4e122fef3e355706c232456bb947f2fd8d25e945d5eee
    file_sha256: a018daf99a44cb354c341f4a0ae3d3fec2d710ebc9f84733d964cca46fa9ed1c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c1-base-gemini.md
    snapshot_sha256: a018daf99a44cb354c341f4a0ae3d3fec2d710ebc9f84733d964cca46fa9ed1c
    entry_key: d46a2e02a555d74965c142f222dc7d90b39bd84e0e29e215a63c61b535bd84af
  - object_id: EVD-GEO-E2E-CAMPAIGNS
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-campaigns.md
    content_sha256: 3987871042f7f7afed241d9b0fcf21cdf7a041c4849d71dfc019b3aee7716ea2
    file_sha256: 4c9ed466508663569772fec6a7ac6de0421df29c0b1c755526d221cadd59c0fa
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-campaigns.md
    snapshot_sha256: 4c9ed466508663569772fec6a7ac6de0421df29c0b1c755526d221cadd59c0fa
    entry_key: d4734d792a1d27113dd8a86cfff518283e139ba29574f695d46ef57f07d6fdf2
  - object_id: SMP-GEO-C1-AFTER-Q1-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 7d53882c4acb99e37cef61e8bc8589cde1d4f30466bf37e77828836629043ff7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-perplexity-2.md
    snapshot_sha256: 7d53882c4acb99e37cef61e8bc8589cde1d4f30466bf37e77828836629043ff7
    entry_key: d478586b8ab876ca8a5caee25221993c99f1094e3dc0b5fe45997105d47500f9
  - object_id: AGG-GEO-C1-BASE-Q2-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-chatgpt.md
    content_sha256: 534b64945bab71fbace586527e153564e6d3a1185a82081ab03982e1cd315d5a
    file_sha256: bfdfa16e91182022341183141d769aa57115a9e2a864b770c599df09579bf6b4
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-chatgpt.md
    snapshot_sha256: bfdfa16e91182022341183141d769aa57115a9e2a864b770c599df09579bf6b4
    entry_key: d58fe6f57d79521a5277ff5ade53eeb610882687f834f6031db71ad373434525
  - object_id: ARV-GEO-C1-AFTER-Q6-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-perplexity-1-reviewed.md
    content_sha256: 85d06163e66f3b004a187f1ef7579d03f54c6f6568bb11e4082aefbe0eb3886b
    file_sha256: 7a228d120527753e66786868ff8e7a73ec59075abe5dbabcde5ccacb95804267
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-perplexity-1-reviewed.md
    snapshot_sha256: 7a228d120527753e66786868ff8e7a73ec59075abe5dbabcde5ccacb95804267
    entry_key: d5f794546319b222599be5d8e691e3083a419b2ab2d47a46bb790073d6ba8e99
  - object_id: SMP-GEO-C1-AFTER-Q3-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 5fe9f04c7221609870ec04d77ea232a1f81ee73f5b8f8dac6f2029414f5ce9c8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-gemini-2.md
    snapshot_sha256: 5fe9f04c7221609870ec04d77ea232a1f81ee73f5b8f8dac6f2029414f5ce9c8
    entry_key: d67ace442c106aaaecf22b7f4f391e771cfe62040c7e49b06bb37ee199f1af7e
  - object_id: SMP-GEO-C1-AFTER-Q2-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q2-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1bc6d16d87db7cfdc12f5da85f619095e6889d584a64e5868b8f3fed021bb36e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q2-gemini-1.md
    snapshot_sha256: 1bc6d16d87db7cfdc12f5da85f619095e6889d584a64e5868b8f3fed021bb36e
    entry_key: d79c2f24a81d7046f0aa5a0548969c6df86bf1fa11fe5e9e209f76b101f4990c
  - object_id: AGG-GEO-C1-BASE-Q6-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-claude.md
    content_sha256: d1fa51f626ead4cc5437385e22e8f5b5ee5bc5d5c7462a9ff46526258214cb67
    file_sha256: b2b5c2774a6dab7a0d2d79f2a8f1fc2fe26563652fc1bf6085b6aab2ebf03597
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-claude.md
    snapshot_sha256: b2b5c2774a6dab7a0d2d79f2a8f1fc2fe26563652fc1bf6085b6aab2ebf03597
    entry_key: d860d0f2e173a0fbf46e4bbf4509723b46a767c713d8035978edda0678fa292c
  - object_id: ARV-GEO-C1-AFTER-Q1-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-google-ai-2-reviewed.md
    content_sha256: a9e97f8a0e4e25d2c2832cf24a898df74501ed49014997a49cc643b30bbcb78c
    file_sha256: f5da87ba0b413164723fac743cc7eca7f9af6975bad6f2e02b021e96866e281c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-google-ai-2-reviewed.md
    snapshot_sha256: f5da87ba0b413164723fac743cc7eca7f9af6975bad6f2e02b021e96866e281c
    entry_key: d86f936bae27992cf1573d6837dad2af1fdc82ba5064caeeb8fbd8071b2d1625
  - object_id: ARV-GEO-C1-BASE-Q4-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-gemini-2-reviewed.md
    content_sha256: e45de9cad88774ecde42146e614bc33881c47378eeb421b9947038087840a13f
    file_sha256: 0ef171d5312ed77bbbb5ae4cfa3e6cc454f419df7459530d23d40dabe6dc4dd7
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-gemini-2-reviewed.md
    snapshot_sha256: 0ef171d5312ed77bbbb5ae4cfa3e6cc454f419df7459530d23d40dabe6dc4dd7
    entry_key: da3ea306c5a7c90702019cfa11982ca3a7affad94a072ac0ebdce52026cc0900
  - object_id: AGG-GEO-C1-AFTER-Q6-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q6-claude.md
    content_sha256: fce44671231ac069bb33f6e21f19ca76541f75b777f1c4cd6bf64e1673d230cd
    file_sha256: b60c2f1a709f564c5563f2025f5484efb8928e3a283a9808e9c6bd4b731a6a5d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q6-claude.md
    snapshot_sha256: b60c2f1a709f564c5563f2025f5484efb8928e3a283a9808e9c6bd4b731a6a5d
    entry_key: db18d4c3c9fe34dca0aab053aa72ea5c5a8ffaa92c10f67cd334e9dbb9887542
  - object_id: Q-WHO-IS-ELIGIBLE-FOR-THE-EN-754E
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-who-is-eligible-for-the-en-754e.md
    content_sha256: 8e1828d0c63af7aa02d5bd980a941afb6179135cb0128aa1ae6f01924e39cc66
    file_sha256: a94f52af64133d0ed8e18e7120719a02285f11fa892f2b1bb35758b76f3a24a2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/queries/candidates/q-who-is-eligible-for-the-en-754e.md
    snapshot_sha256: a94f52af64133d0ed8e18e7120719a02285f11fa892f2b1bb35758b76f3a24a2
    entry_key: db3cb2d99379bba2596c584e3d38b9003ccc12ece1a9736bc2c86060952a4dc6
  - object_id: SMP-GEO-C1-BASE-Q5-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 799f0d572c778affb27759e5f50f3040722de776ebf921b4960004d92b23a7ec
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q5-google-ai-1.md
    snapshot_sha256: 799f0d572c778affb27759e5f50f3040722de776ebf921b4960004d92b23a7ec
    entry_key: dba328e9b9bbbdb65905419a6e21c001989178a6ca383a17e2ab540c8373de8f
  - object_id: AST-GEO-E2E-C1-THIRD-PARTY
    record_type: asset
    object_version: 1.0.0
    object_path: assets/external/ast-geo-e2e-c1-third-party.md
    content_sha256: 8af1c6d04690a5b34f37be79f4a180dfce3137bd93190190fbb055bd56a9bc2e
    file_sha256: 2ec05ccff5099b75d9f773c3e35dd5855dae5a952258a409ced0c6573b562e8a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/external/ast-geo-e2e-c1-third-party.md
    snapshot_sha256: 2ec05ccff5099b75d9f773c3e35dd5855dae5a952258a409ced0c6573b562e8a
    entry_key: dc48f37d346363443653719aacc1e5922a9582b7da331c53eeb1145b2ceca3eb
  - object_id: SMP-GEO-C1-BASE-Q6-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4ba4f0c385be6b37144d3a55a8853eeaef239fe8d3577ae26c198260978838c6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q6-perplexity-2.md
    snapshot_sha256: 4ba4f0c385be6b37144d3a55a8853eeaef239fe8d3577ae26c198260978838c6
    entry_key: dcb4773d156366d6145f4326fe886e9f9a5b0eb4fa569d058fddea8dfcddcd87
  - object_id: SMP-GEO-C1-AFTER-Q5-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 9de12961c832b9ff52fbff1dabf52706419ebaccb5061b423d162e9ad53d7947
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-perplexity-1.md
    snapshot_sha256: 9de12961c832b9ff52fbff1dabf52706419ebaccb5061b423d162e9ad53d7947
    entry_key: dd0c514de6202c55f829ea9932b6637e606215d6f5ec074b1fe19725ca8be7a7
  - object_id: SRC-GEO-E2E-FEES
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-fees.md
    content_sha256: 6e0610ad7c6ea19a5143bad7b2167bddf28ecfc8e49ee460f16fd33060260812
    file_sha256: aae93f87da3c8e64f51c4ebb7ed3d2f940ee056e32d1f03d11e835e41faa4d4b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-fees.md
    snapshot_sha256: aae93f87da3c8e64f51c4ebb7ed3d2f940ee056e32d1f03d11e835e41faa4d4b
    entry_key: dd7d41010aac335bdbdaf3814d209cdb1b374ffc59b6486fd0415b2c873fe5f2
  - object_id: ARV-GEO-C1-BASE-Q3-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-1-reviewed.md
    content_sha256: 51776a4c38e8d4e7fe2f2b06edc4ad1a9f87c0fba818714428fe0b28955ec4c3
    file_sha256: c7d1083ebb8c3a9add10ab21be93a810d92af3896f007837e0714b6cdfba42e8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-1-reviewed.md
    snapshot_sha256: c7d1083ebb8c3a9add10ab21be93a810d92af3896f007837e0714b6cdfba42e8
    entry_key: de236388d39fa255b28a471f3c0e343e8a094dcd518d0773542b43a3628055ff
  - object_id: SMP-GEO-C1-BASE-Q3-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: acea3dc8ea0368db944c3756145ed56803d2489e1c758da8a01ed7ba7f4fa916
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-google-ai-1.md
    snapshot_sha256: acea3dc8ea0368db944c3756145ed56803d2489e1c758da8a01ed7ba7f4fa916
    entry_key: de4bb64347c5fe4af990113bc3a366d5ee853d33830485456eb674bff75d0632
  - object_id: SRC-GEO-E2E-ELIGIBILITY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-eligibility.md
    content_sha256: 8ae668b4bb38e19fcc1a10d7ef63231fce19387bea31feb72120f8ec27d0d9f5
    file_sha256: 3836bce6852c161caba5a0702480f49373b8adc2c5888d0aba2c7fe2967bb375
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-eligibility.md
    snapshot_sha256: 3836bce6852c161caba5a0702480f49373b8adc2c5888d0aba2c7fe2967bb375
    entry_key: de6d5ba3f93d14a000723c737989b157e84069fcdc75cb35793d6d09b3a738b5
  - object_id: SMP-GEO-C1-BASE-Q3-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: e2e771dca295aa42b1c1e3e3ea7bbbffeeb283579634834646ed4bae5e39c0b6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-claude-2.md
    snapshot_sha256: e2e771dca295aa42b1c1e3e3ea7bbbffeeb283579634834646ed4bae5e39c0b6
    entry_key: dec69499e5c22ab684f28208f9f8d39aa5ec68640d74d75bff07b7843692e83d
  - object_id: ARV-GEO-C1-AFTER-Q3-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-perplexity-2-reviewed.md
    content_sha256: eefb8ee304b59421308394ad88b96c5bc26b6a00066dd9e0722f1e515182b768
    file_sha256: f6802d3b3bcaf200426d0853c046f073f57460e20ee90d4e333f520010f2416a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-perplexity-2-reviewed.md
    snapshot_sha256: f6802d3b3bcaf200426d0853c046f073f57460e20ee90d4e333f520010f2416a
    entry_key: e1436b63795249fb966989ffc55d724eeee710851c1f621351d276f4514c4eca
  - object_id: ARV-GEO-C1-BASE-Q5-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-claude-2-reviewed.md
    content_sha256: e87472d971d1148c530d0a3a19c4f7a4bc1b0bde23ce2cd97cb0becb669bbd86
    file_sha256: 73e89c5401e93629868721cfa13e124e4d319d97a25637f7bc177213f924b9c5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-claude-2-reviewed.md
    snapshot_sha256: 73e89c5401e93629868721cfa13e124e4d319d97a25637f7bc177213f924b9c5
    entry_key: e1a4568b4470fe3b3351a353ef486318f3dfe15d97f8b50af8208bc6d6f44f31
  - object_id: SMP-GEO-C1-AFTER-Q5-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 04e2225bdb023f303acd658b159eb7087fcf288ad51ba5deeadd86844f6f7e29
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-google-ai-1.md
    snapshot_sha256: 04e2225bdb023f303acd658b159eb7087fcf288ad51ba5deeadd86844f6f7e29
    entry_key: e21273bc7213a0aa42b0e5c3df31b5828e8e8f7e1fe7a32c17b4cb0decbb2157
  - object_id: SMP-GEO-C1-AFTER-Q1-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q1-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: dce1f0a1dc85b74fb32d785a7c4fce8a326ab97e4e00fe2df601ea618b4a41a0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q1-chatgpt-2.md
    snapshot_sha256: dce1f0a1dc85b74fb32d785a7c4fce8a326ab97e4e00fe2df601ea618b4a41a0
    entry_key: e21e881b154bcd40ba4dd2291282887361c3fd3720a04f7a52710b8ddc7ef9fe
  - object_id: SMP-GEO-C1-AFTER-Q5-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 6f50c72f46bdb65352e205b113d0a0dedddce0cde1a2ad5d560f6214eb16f698
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-chatgpt-1.md
    snapshot_sha256: 6f50c72f46bdb65352e205b113d0a0dedddce0cde1a2ad5d560f6214eb16f698
    entry_key: e2ee6fb85bb566ade2ecb79441338efe8056c87409283a318e183ea5fd578b83
  - object_id: ARV-GEO-C1-AFTER-Q5-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q5-claude-1-reviewed.md
    content_sha256: a85405874cba94f34aa4672d5b85107b99cfe8037d684df7514f8526d204e847
    file_sha256: d9b19154f6078319d9cc9b586fc37e113ce53fbfe8c455b6e94720878208af72
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q5-claude-1-reviewed.md
    snapshot_sha256: d9b19154f6078319d9cc9b586fc37e113ce53fbfe8c455b6e94720878208af72
    entry_key: e44a5e8c2376c539931246ad633c743b3cab581feba505f964d12ddc0092e3a0
  - object_id: ARV-GEO-C1-BASE-Q5-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-1-reviewed.md
    content_sha256: dc2582e94f51e3e685c7268d3f0e618addd93bd58ccc9cde6dad467c02b3a404
    file_sha256: adfabb80f9f6b5b7951f23f83d35b5f7de96c3467efe4a7865358fe03f3ad6c0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-1-reviewed.md
    snapshot_sha256: adfabb80f9f6b5b7951f23f83d35b5f7de96c3467efe4a7865358fe03f3ad6c0
    entry_key: e4f001d8739e57dbb8cc560fe8f86c60f1e9b3f0079d3d6622681be502ea7dde
  - object_id: ARV-GEO-C1-BASE-Q2-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-gemini-2-reviewed.md
    content_sha256: 9c919a73d7fa4512d9c52a6a58b2d26f0613fac646b5f40d831b8d90cd46e327
    file_sha256: 4db31dc4ce2854239950f7d5e8ead78aaa89a7c477165449113d68170654cfa2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-gemini-2-reviewed.md
    snapshot_sha256: 4db31dc4ce2854239950f7d5e8ead78aaa89a7c477165449113d68170654cfa2
    entry_key: e52862d2f5b1f99e225c2c5b688fafe15985b8f94ce3f1c129245a0e39ef7d01
  - object_id: SRC-GEO-E2E-GUARANTEES
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-guarantees.md
    content_sha256: c05c6c819824b4a3bbbe50587e611d97dc478fa9777acc9ab0371c4133722b0f
    file_sha256: f4dd7b79796c549b8bf1cb89a22e09efea49bfe4a3e5f4de80ce9d417045b6cf
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-guarantees.md
    snapshot_sha256: f4dd7b79796c549b8bf1cb89a22e09efea49bfe4a3e5f4de80ce9d417045b6cf
    entry_key: e5d3bb905b2cd4c0bbb9e4eaf439748c90d7b6b25d057846208a6ebfc6e5254c
  - object_id: AGG-GEO-C1-BASE-Q6-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-gemini.md
    content_sha256: 50b58a9fe51a5c3f0e3bb63685f152c1ee26d79827fc9464664ca383f02d82a3
    file_sha256: a6d8cc318cc47c15cac62a2fada1758775b4a3fdf2c1fd2e2b509e2d1a3a3015
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-gemini.md
    snapshot_sha256: a6d8cc318cc47c15cac62a2fada1758775b4a3fdf2c1fd2e2b509e2d1a3a3015
    entry_key: e5e89246de932149edb95e5ab59b65081b972493dd03e012e932837d4aee9732
  - object_id: AGG-GEO-C1-BASE-Q3-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-chatgpt.md
    content_sha256: c9ed420102edafc557637c263a71be7c2c81ab2ee9c02f86daf739405053b26f
    file_sha256: 4126db0e3cdb8022dd511baf299a81ddec829f42b657a0f32fa0803c5e0b01bc
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-chatgpt.md
    snapshot_sha256: 4126db0e3cdb8022dd511baf299a81ddec829f42b657a0f32fa0803c5e0b01bc
    entry_key: e61cf50edc3c20e4a19674aa70bd19fbe7947b05884c4bede74d92d1b6173e6f
  - object_id: ARV-GEO-C1-AFTER-Q2-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q2-claude-2-reviewed.md
    content_sha256: c568144e9ded4f1e7f6a12571a3740de72c8b3c6f773f80026188baaf2447f25
    file_sha256: a2b94c15d05c19e5e1b99e290fb1865b6557fb4a19f3783962ec23d143936b96
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q2-claude-2-reviewed.md
    snapshot_sha256: a2b94c15d05c19e5e1b99e290fb1865b6557fb4a19f3783962ec23d143936b96
    entry_key: e6234469abff4cb3f2181d0a82196e6084942973123c0dbd552c0cc612effe48
  - object_id: FND-GEO-SITE-C1-BASE-THIRD-PARTY-CANONICAL
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-third-party-canonical.md
    content_sha256: 38f0dce4fe2d1d91f1731627f634e45f44cede066889a9ccb120e84374dace50
    file_sha256: 4343bb2d93dd342b633aa50d353e59bc0b56eb76c2235144849d66c337de0b21
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-third-party-canonical.md
    snapshot_sha256: 4343bb2d93dd342b633aa50d353e59bc0b56eb76c2235144849d66c337de0b21
    entry_key: e62b6656be135b242dbe855c3195c07ba9d0cdb4be64d0215406eb0342b7cac9
  - object_id: FND-GEO-SITE-C1-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-third-party-meta-description-present.md
    content_sha256: 06f484593238390540c3c812626d8ca01a77c892956c7cb06fc02b6ff8a3b005
    file_sha256: e005bb00cd23ac9e00affd9f1a82c570f6f7fb8f85b9920b700ad14c954e3ff2
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-third-party-meta-description-present.md
    snapshot_sha256: e005bb00cd23ac9e00affd9f1a82c570f6f7fb8f85b9920b700ad14c954e3ff2
    entry_key: e7091c223c1b0f9e3d63da01e91d36bc5c57c87f12356f6a053f6955288eadc8
  - object_id: SMP-GEO-C1-BASE-Q3-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 2562ce9587b7cdcbe1d5d5b8f760c9418b26700a78240a56e45b4c1d0a54f3ce
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-perplexity-2.md
    snapshot_sha256: 2562ce9587b7cdcbe1d5d5b8f760c9418b26700a78240a56e45b4c1d0a54f3ce
    entry_key: e72d31eb4b5cadc1010fae1147ab4270e46c73b6cc6de74c6bb906b2512bb7f4
  - object_id: AGG-GEO-C1-BASE-Q3-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-claude.md
    content_sha256: 1b8f19074cd3768a6bf1fb90738eaecb7c0ea67025aba3d64718f5f50d10a7bf
    file_sha256: 402600422e8805719d558e810982fc9cdd0b074405449f18655d212eef90495d
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-claude.md
    snapshot_sha256: 402600422e8805719d558e810982fc9cdd0b074405449f18655d212eef90495d
    entry_key: e76c526b0afdac0b6ddf5bcc303888490b6b8c840b194f2979dc721f5fdba6ad
  - object_id: AGG-GEO-C1-AFTER-Q5-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q5-gemini.md
    content_sha256: 755705bc48834fc95a5b9435dde41561fea75c6fbefa8463d490dc5fb68cc932
    file_sha256: 69bef0279090789d58554ea6b3c242f59f0792db2502846e226b7fe4c8ea2c63
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q5-gemini.md
    snapshot_sha256: 69bef0279090789d58554ea6b3c242f59f0792db2502846e226b7fe4c8ea2c63
    entry_key: e8b22159f51d28be770cc773e59286388a9b8d91b5652ff5cb42cd64a6784357
  - object_id: SMP-GEO-C1-AFTER-Q4-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q4-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 68078b1e01fad68351bc0fc7b43a5cfaaae49c25007b00f3f954ad947f274bda
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q4-gemini-2.md
    snapshot_sha256: 68078b1e01fad68351bc0fc7b43a5cfaaae49c25007b00f3f954ad947f274bda
    entry_key: e8e990956cae3d3e159e407368c6f28af4bdf724e6ccd125b377662c1fa5dfc8
  - object_id: ARV-GEO-C1-AFTER-Q1-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q1-perplexity-2-reviewed.md
    content_sha256: 6fc63b67834d7635a71c1bb2baef9e8429490d4353c6dace9d24dd3ef72fbeb6
    file_sha256: d6915c751823b7d408f7af79d8c4133952959da13f24f10bcb0ee9cd92be5a7c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q1-perplexity-2-reviewed.md
    snapshot_sha256: d6915c751823b7d408f7af79d8c4133952959da13f24f10bcb0ee9cd92be5a7c
    entry_key: e9b7bbbaa9cf8247bb3f8562930b9f74d0cc90147b540e24f47b41a53d8fe2a9
  - object_id: AGG-GEO-C1-BASE-Q3-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-google-ai.md
    content_sha256: 2e282bb570c9d270fb92a5b9376349d96c41d07599d2462e891656c92d3e41fd
    file_sha256: 0f10f4b023ddb7c0f870747d3ea0b97b16cde4355598d437e94b7cc1f3c41108
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-google-ai.md
    snapshot_sha256: 0f10f4b023ddb7c0f870747d3ea0b97b16cde4355598d437e94b7cc1f3c41108
    entry_key: eae0a2551c2462793c5b52674639e78da0062dd0e7bc1fde3175a85cca32b327
  - object_id: CLM-GEO-E2E-NON-GOALS
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-non-goals.md
    content_sha256: a210c8651cd23b7d74a65e4f99c45cf2a7681b9223ee46b623e3323d308d9020
    file_sha256: 2c14e22e093b65c494c6480d3a9044abd65bd072d9edcde129dfa59555a13943
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-non-goals.md
    snapshot_sha256: 2c14e22e093b65c494c6480d3a9044abd65bd072d9edcde129dfa59555a13943
    entry_key: eb4012364f4efd8addf1a90d3f1bec5688849b027d6957489f2d55b9737f8d9b
  - object_id: AGG-GEO-C1-AFTER-Q2-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q2-chatgpt.md
    content_sha256: 7eb520372ca731e1dfcdbdbef6d660ccc6da15bbb6e4d9846319381cb2fe0ade
    file_sha256: 13336a3755cf6ec6490d0e5456c27fc1c0e0b806a5df644fce2d1d7a5960c948
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q2-chatgpt.md
    snapshot_sha256: 13336a3755cf6ec6490d0e5456c27fc1c0e0b806a5df644fce2d1d7a5960c948
    entry_key: eb55b955db86fc454deae06ee861a62513877ebbd7fcadecd0f267ec30d43bb3
  - object_id: ARV-GEO-C1-BASE-Q1-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-gemini-1-reviewed.md
    content_sha256: 4496245a33c16a3e688ea0de440321d8002515d0ebcbc2776cc3c1229cfe93cc
    file_sha256: 0814efa470d31e12c18bae8fcef1f15a8f2e99c2686063a79928f4ca68de5f2e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-gemini-1-reviewed.md
    snapshot_sha256: 0814efa470d31e12c18bae8fcef1f15a8f2e99c2686063a79928f4ca68de5f2e
    entry_key: ec8802bc6d5f240aa94d141fa0e36e73aff9c5ab3df655a8750c381e224e6507
  - object_id: ARV-GEO-C1-AFTER-Q6-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q6-gemini-1-reviewed.md
    content_sha256: a07b1b99e1988e50e751274034dbced0ccaf11b4437fe5ca97740ee5e91fff38
    file_sha256: 97f462c3c73516925eed185e7da3e788e771ba318e5bb1c078782e28e5c8126b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q6-gemini-1-reviewed.md
    snapshot_sha256: 97f462c3c73516925eed185e7da3e788e771ba318e5bb1c078782e28e5c8126b
    entry_key: ede83fcd9b04088654193411c93b786b9b7c4af5ecc97b82960a82cca4acc5b4
  - object_id: DOC-GEO-E2E-ELIGIBILITY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-eligibility.md
    content_sha256: 55b5651e0871c467f336463957d6bbcd39e8c58d23651630b5e6a2cd23b73c46
    file_sha256: badc4ec0dc8e75c614bd7c9da8116411cf8c1221bd018002cb885396ccd81075
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-eligibility.md
    snapshot_sha256: badc4ec0dc8e75c614bd7c9da8116411cf8c1221bd018002cb885396ccd81075
    entry_key: ef13aa25e81e77f9772e2bed867f3342c8c3a24676ffea5dce2da4d4fe4ab416
  - object_id: ARV-GEO-C1-BASE-Q1-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-1-reviewed.md
    content_sha256: a072f5227705966c2550a360f99bab2f39eb918d753ff69a9a51269b276ec4fa
    file_sha256: 2284396f8fe306258da9ab265f99e3958858bce220bcdfffe58f3568cbd44152
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-1-reviewed.md
    snapshot_sha256: 2284396f8fe306258da9ab265f99e3958858bce220bcdfffe58f3568cbd44152
    entry_key: ef4fb4a15969f966c05ab85b9fed74bf7712bb88acd7f10f983eb93bac791a4e
  - object_id: ARV-GEO-C1-BASE-Q1-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-1-reviewed.md
    content_sha256: 90e55bcdd5bd454f9ccd7a873497353e7486fb77092b83ba5a2b1858916c275f
    file_sha256: 368e2d7008d6b92719ca0f4fd1c22b3370d525300e973454559f0fcaab982763
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-1-reviewed.md
    snapshot_sha256: 368e2d7008d6b92719ca0f4fd1c22b3370d525300e973454559f0fcaab982763
    entry_key: ef6fd9a861fe39926d83c0fc5a5a80a2e017522943c2c06925e9cc998443cd8a
  - object_id: AST-GEO-E2E-C1-OFFICIAL
    record_type: asset
    object_version: 1.0.0
    object_path: assets/external/ast-geo-e2e-c1-official.md
    content_sha256: ffe434bb182e1a1d4124c81524c4c617be3666d6d4289d0ae97f759327a29459
    file_sha256: 3acdabe1f3955ca20e101d491803e1a8900150dde473d47e2b1caf4f1d67674c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/external/ast-geo-e2e-c1-official.md
    snapshot_sha256: 3acdabe1f3955ca20e101d491803e1a8900150dde473d47e2b1caf4f1d67674c
    entry_key: f04cdadb5d195be0154e904d0dc98d42fec660f14f232bc1cb53d0dcc790af1e
  - object_id: ARV-GEO-C1-BASE-Q6-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-1-reviewed.md
    content_sha256: 891e11fbd93f78dc4824813c75cc3cdf6e3a68a36b5a0440998b078a0de2589f
    file_sha256: 0416653b296b9636ff53c370b2bf7396f0004bcdfcdb7b49365a3e18938e098b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-1-reviewed.md
    snapshot_sha256: 0416653b296b9636ff53c370b2bf7396f0004bcdfcdb7b49365a3e18938e098b
    entry_key: f14466e23e90f23eb093567b43537a13029499955eb39c097664c541afb997a3
  - object_id: DOC-GEO-E2E-COMPARISON
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-comparison.md
    content_sha256: c9d8ef1bc1ed48d79cdf7315db7f9aec3f3b4b1ab78720bca2db9797b760e4fa
    file_sha256: 86fbdfeafb3d3957ddabfb73aa2e7971ffabfe25ea4176f589cf828377de7408
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-comparison.md
    snapshot_sha256: 86fbdfeafb3d3957ddabfb73aa2e7971ffabfe25ea4176f589cf828377de7408
    entry_key: f14e1985b9be605ff829917eff3efc09b1045bb6eb2ea7248d658b6ce835e4a7
  - object_id: SMP-GEO-C1-BASE-Q2-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 29789617bb35cadc3a3fa44dccbf8c052451ffe82b36fc8023329f5cbe0793e3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-1.md
    snapshot_sha256: 29789617bb35cadc3a3fa44dccbf8c052451ffe82b36fc8023329f5cbe0793e3
    entry_key: f1611b90c1769678c4d762f8360f002d7c35a191eeb547fd735b6d215b87aa24
  - object_id: ARV-GEO-C1-AFTER-Q4-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q4-perplexity-1-reviewed.md
    content_sha256: 2651f5ad431796055ae93e7be1c939839eb6e69628da8ea57b42f9c688168cc9
    file_sha256: 993120b943ad95a7c5f12a2bbc6be49a509bffbaf1e9599761f51aa2054691f1
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q4-perplexity-1-reviewed.md
    snapshot_sha256: 993120b943ad95a7c5f12a2bbc6be49a509bffbaf1e9599761f51aa2054691f1
    entry_key: f1ce7a8611ac4fa1f4138ab39931bd5c7db27847a8d46fc9b8907577e115ae45
  - object_id: CLM-GEO-E2E-FEES
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-fees.md
    content_sha256: 6e0610ad7c6ea19a5143bad7b2167bddf28ecfc8e49ee460f16fd33060260812
    file_sha256: 28de7011440d1b48ca55bc8b85d682d86f15d404cd07e1d4f655b81daba3ae92
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/claims/clm-e2e-fees.md
    snapshot_sha256: 28de7011440d1b48ca55bc8b85d682d86f15d404cd07e1d4f655b81daba3ae92
    entry_key: f2bffb457be1a0a03ccb934fcfabee67aedcfd4154d9cfa7f23424d201ba4c33
  - object_id: ARV-GEO-C1-BASE-Q3-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-gemini-2-reviewed.md
    content_sha256: 81e66b7d7ce8b1ab4f1029b7ad28a84e23e58a1624d772e840d3bbaef10fbd2b
    file_sha256: 18ce781c966ab9638c1b2c38f258a3096efda4f4f872fd5074b58038e73efdce
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q3-gemini-2-reviewed.md
    snapshot_sha256: 18ce781c966ab9638c1b2c38f258a3096efda4f4f872fd5074b58038e73efdce
    entry_key: f399fd2237344985c89f22982ba91132f7a9bd8356b850dc9431e7b2e78c0698
  - object_id: PRP-GEO-C1-OFFICIAL
    record_type: asset_proposal
    object_version: 1.0.0
    object_path: assets/proposals/prp-geo-c1-official.md
    content_sha256: 69b716567cd84e5d98448fee0cb549d923e87be975a9ba32e889dc3f2b38e951
    file_sha256: 65b03c6809181a111b91b5895bf3e07641ed64503a6a5d37eb8c9970b2199004
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/assets/proposals/prp-geo-c1-official.md
    snapshot_sha256: 65b03c6809181a111b91b5895bf3e07641ed64503a6a5d37eb8c9970b2199004
    entry_key: f3f247bc4df9b2b1970a30d8fca2e0dbe805cd1b075ce8be741cec25a4ca05b3
  - object_id: SMP-GEO-C1-BASE-Q1-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 634e97c7714af2ecb9214bb900cdd0ef915fda8642471d56b2b8596c6c11d920
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-gemini-2.md
    snapshot_sha256: 634e97c7714af2ecb9214bb900cdd0ef915fda8642471d56b2b8596c6c11d920
    entry_key: f4f4d56539242af9f0ae694126c853dafb6d99f5d61666cc842e732a7fcd5ddb
  - object_id: SRC-GEO-E2E-CASE
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-case.md
    content_sha256: 9cddd8a4732579c1ea633d2c66b028f8d72aeb6f15123fc3543b52cbf17e1df7
    file_sha256: 3235db7d86791a1003cd700710895c7b3fb944db1f6762bcc40b9c5af302cc65
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-case.md
    snapshot_sha256: 3235db7d86791a1003cd700710895c7b3fb944db1f6762bcc40b9c5af302cc65
    entry_key: f5e66c95c2bec911b44db60c9ec1dc071edcf62e50778c57b60d165ef1a91a58
  - object_id: SMP-GEO-C1-BASE-Q3-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: eb3a4dd0ac18bf305a14a093b7fb0e298d6dcc7b62e9f22829302b4e9a42fdb6
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-gemini-1.md
    snapshot_sha256: eb3a4dd0ac18bf305a14a093b7fb0e298d6dcc7b62e9f22829302b4e9a42fdb6
    entry_key: f6631480a033fe8bdc8dded40cf6cb11a2ff78023b2b3d5600bc21945612b831
  - object_id: EVD-GEO-E2E-PRIVACY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-privacy.md
    content_sha256: 1f715fc357d9cad4ec3309c90babd8e66e0cca6207463f3f5915bed060fc7301
    file_sha256: 32a907f1a9e21524918f4f98328d8a6151f78efa7f6ffeb07557cdbe081bd748
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/records/evd-e2e-privacy.md
    snapshot_sha256: 32a907f1a9e21524918f4f98328d8a6151f78efa7f6ffeb07557cdbe081bd748
    entry_key: f6ff831545243ace2bf5e34841ec0275e44e2dd0949a5e1e864e1aacd2b2ac2b
  - object_id: SMP-GEO-C1-BASE-Q1-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 733015df037d4261225f5cc1fd677e680e4c0b27a75f7cbe36ccf675498c0982
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q1-perplexity-1.md
    snapshot_sha256: 733015df037d4261225f5cc1fd677e680e4c0b27a75f7cbe36ccf675498c0982
    entry_key: f71d2a0ea3946a464678e67456d1575d40e012ad4e5814191a90c37dfbc67b67
  - object_id: FND-GEO-SITE-C1-BASE-OFFICIAL-SCHEMA-SYNTAX
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c1-base-official-schema-syntax.md
    content_sha256: 07cea7107fbb21d3b3fd7559fe96e8a83888e13b321f85eb7f4764e56f0a6518
    file_sha256: a449776979bcc2572bb8686ed288ec5f8b0bca65801d6731b0d0ef7cab59cdd3
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/findings/fnd-geo-site-c1-base-official-schema-syntax.md
    snapshot_sha256: a449776979bcc2572bb8686ed288ec5f8b0bca65801d6731b0d0ef7cab59cdd3
    entry_key: f727fc982839c8d99decce493a4d0f0b72f50ab4fd204d5e844849d07190048c
  - object_id: SRC-GEO-E2E-NON-GOALS
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-non-goals.md
    content_sha256: a210c8651cd23b7d74a65e4f99c45cf2a7681b9223ee46b623e3323d308d9020
    file_sha256: 19d5bfbfc92e81c1a895e8516e25fc643065101f5eb0d872fd52df128b1017fa
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-non-goals.md
    snapshot_sha256: 19d5bfbfc92e81c1a895e8516e25fc643065101f5eb0d872fd52df128b1017fa
    entry_key: f78bf8db2c1a3ed1116353a3a7525d1ea4534713dc29c9b7249e9ebadf12a125
  - object_id: SMP-GEO-C1-AFTER-Q3-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 670c35c285c18ea5a119c0ec0823df199da34cb7f4c7d4abe3f55746e100389c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-claude-2.md
    snapshot_sha256: 670c35c285c18ea5a119c0ec0823df199da34cb7f4c7d4abe3f55746e100389c
    entry_key: f7d056d134c0ad83eeb4ff502f3102cf0136d302f7f4aaf62ede05f23a8ad60d
  - object_id: ARV-GEO-C1-BASE-Q5-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-gemini-1-reviewed.md
    content_sha256: 222a5b2575c5a3efd4f970f497e94f29b6193201a494a33f6b86e3d21732c2b3
    file_sha256: adb3988d64f378f67fb197724e997e9a36825572daef05d8fb2938a31d0985b5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q5-gemini-1-reviewed.md
    snapshot_sha256: adb3988d64f378f67fb197724e997e9a36825572daef05d8fb2938a31d0985b5
    entry_key: f8af10d65978b0edbfbc63d0b002045d56c273b940aa7c086701dc35b890da88
  - object_id: ARV-GEO-C1-BASE-Q2-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-2-reviewed.md
    content_sha256: 02aa70c8b1cc6ea7d55aabfb50b2d484d39a208da690a1bfa282d9ec73a2882c
    file_sha256: b259ac36a11373b8227a58ab4624559e7245d240c20f45df928bba70e84a1ef5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-2-reviewed.md
    snapshot_sha256: b259ac36a11373b8227a58ab4624559e7245d240c20f45df928bba70e84a1ef5
    entry_key: f9b02d48294608c36d54808be0010893fb76af0d2af7cc8ef5d4ccd8a15b4cd3
  - object_id: ARV-GEO-C1-BASE-Q6-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-1-reviewed.md
    content_sha256: 52e5b605c252d877f6669118c1e7f911e5ca267d81f26259d1dd7ae551d2eddf
    file_sha256: e492de153bb053e5da57a96aa93bed3483e688c7ced2bde4fcef506460b38027
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-1-reviewed.md
    snapshot_sha256: e492de153bb053e5da57a96aa93bed3483e688c7ced2bde4fcef506460b38027
    entry_key: f9ef09d4588ddb88043246b5513201a4fa80411b719f03dc544a0f9028621c63
  - object_id: SMP-GEO-C1-AFTER-Q5-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q5-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: d067d045a47d50d1a3bf934269af6a1334c0963dc31827d4cd293a4801d0d72f
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q5-claude-2.md
    snapshot_sha256: d067d045a47d50d1a3bf934269af6a1334c0963dc31827d4cd293a4801d0d72f
    entry_key: fa38b1fd74a9f1cf7804c9829d5607d517192abf069f82409d9899673513d866
  - object_id: AGG-GEO-C1-AFTER-Q6-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q6-google-ai.md
    content_sha256: d7b5cf96bc9dd8c4ad7354b34c1921a480ff6383274bc86bf81930ab5d4d9276
    file_sha256: 3ca4c24b0c4ad91fba88e8e4463d3ba363ba004a0b1d871d1b75f2f41c28859e
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q6-google-ai.md
    snapshot_sha256: 3ca4c24b0c4ad91fba88e8e4463d3ba363ba004a0b1d871d1b75f2f41c28859e
    entry_key: fa3aed2a45534d208014d247901e48340d41fcfd65dd98190da52d80725a69cb
  - object_id: ARV-GEO-C1-BASE-Q1-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-2-reviewed.md
    content_sha256: 61af8cdea15d940b979104493a6835f7f9c37651c34141ced8bbe76f686f63ef
    file_sha256: 7fd2cfd36048e37398e192584591e31c55d2ee4ff23ab4bef367b4d278720839
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-2-reviewed.md
    snapshot_sha256: 7fd2cfd36048e37398e192584591e31c55d2ee4ff23ab4bef367b4d278720839
    entry_key: fab860c916fe2fd6657a54792c77e1e1020fb5e47507f7f2f92c55bac7684f27
  - object_id: ANS-GEO-E2E-C1-2
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c1-2.md
    content_sha256: f061f25dccdae3ab8bc05d71b5bd28f987dd460aeb176752a5f15caee7b7aeae
    file_sha256: e9e8cf8672f136fcc23ecb5fdbb7f87841e8c658978ab892b443070a62b7f0c5
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/answer-cards/ans-geo-e2e-c1-2.md
    snapshot_sha256: e9e8cf8672f136fcc23ecb5fdbb7f87841e8c658978ab892b443070a62b7f0c5
    entry_key: fac09b07c2829aa586cc5ae0a908239ea0ddd1970573c5447105543498f723f0
  - object_id: AGG-GEO-C1-AFTER-Q3-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-after-q3-perplexity.md
    content_sha256: cb47e937b0ff7d28c2212cb0c970ebbf3d77848ad1d4d2f93d1ad8e40baa8d9a
    file_sha256: 1a8f932daa32340a4326e76c78c2f0d38fccbccce595897b05f304611330863c
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-after-q3-perplexity.md
    snapshot_sha256: 1a8f932daa32340a4326e76c78c2f0d38fccbccce595897b05f304611330863c
    entry_key: fb4eb8d9e5124b60021c0688edc2b29a6f6512212f3ff28aa020d85879e4b155
  - object_id: ARV-GEO-C1-AFTER-Q3-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-after-q3-claude-2-reviewed.md
    content_sha256: 67b6aed06390a62e74e9c17a1171e1e0146846c9e92a7870f2b3637ff257db8c
    file_sha256: 96b117d46f96eef2f0c04f856f3835ebc24cbcc068abce03cc6e73299e7ab281
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-after-q3-claude-2-reviewed.md
    snapshot_sha256: 96b117d46f96eef2f0c04f856f3835ebc24cbcc068abce03cc6e73299e7ab281
    entry_key: fb7c21606b3e4c85c0b2471736266284dc6fb35c16d984559524219ba0401144
  - object_id: SMP-GEO-C1-BASE-Q3-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: e3cdc62119bb469a87b1eae5099229e4400275db1c82f51dedee33984d402e2a
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-2.md
    snapshot_sha256: e3cdc62119bb469a87b1eae5099229e4400275db1c82f51dedee33984d402e2a
    entry_key: fc29a6b0ab8aac410e755b54e28e794780bacaeaeaa859a990a5b29928ec9691
  - object_id: SRC-GEO-E2E-REFUND
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-refund.md
    content_sha256: d8d34b9f234e97400b8a96db2edb8664e4889192426a0a6be8fd884fc28b1808
    file_sha256: f2df70df2218b51a1071d7429669960a4f3a82cf30219cd596603a04b62a58fb
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/evidence/sources/src-e2e-refund.md
    snapshot_sha256: f2df70df2218b51a1071d7429669960a4f3a82cf30219cd596603a04b62a58fb
    entry_key: fdc4065302afea4964d480dc03b8626b3dd8482fffa1c5fa2b97d1afab01eb6b
  - object_id: SMP-GEO-C1-AFTER-Q3-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-after-q3-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 75bedcbf4884e01e51fff1c02947ae3d074c6171672d8fe68c29ab7a83e297c0
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-after-q3-perplexity-2.md
    snapshot_sha256: 75bedcbf4884e01e51fff1c02947ae3d074c6171672d8fe68c29ab7a83e297c0
    entry_key: fe8aca1645429c674acde4d2802bee3d14cd2f9dd5d2f79a14511479ecf44f73
  - object_id: ARV-GEO-C1-BASE-Q4-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-1-reviewed.md
    content_sha256: 29832f1c3476262f88a0f491acba8237440fa3ed588482394358f6503eb405bb
    file_sha256: 5737d2cfb303ccd99da01e6a18b6fd0124c194cf2cfd1ac5ba792bb4e11d13ab
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-1-reviewed.md
    snapshot_sha256: 5737d2cfb303ccd99da01e6a18b6fd0124c194cf2cfd1ac5ba792bb4e11d13ab
    entry_key: feac291bf769485ebeffc8b0de95f29c4d55c0f4b5c8c4496a2e23320adbc4af
  - object_id: SMP-GEO-C1-BASE-Q3-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: d3734ae20d8ff94455b4eb87de166e6dcda8ad3c70d8d1becc3ddd0785942368
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/samples/smp-geo-c1-base-q3-perplexity-1.md
    snapshot_sha256: d3734ae20d8ff94455b4eb87de166e6dcda8ad3c70d8d1becc3ddd0785942368
    entry_key: ff068c90856912baf63112a7e0ee6ec21cfac442d14571ba7f38a818c4d0ecb6
  - object_id: AGG-GEO-C1-BASE-Q5-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-google-ai.md
    content_sha256: 50092fa9c4168904f6242f78e9b4bee6e690fb77b52a9a371b5bfa8b2dab87dd
    file_sha256: b15a605418dd2fb88a01cbf41f9de3f949686b272217939a386ba11ddc0883c8
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-google-ai.md
    snapshot_sha256: b15a605418dd2fb88a01cbf41f9de3f949686b272217939a386ba11ddc0883c8
    entry_key: ff6f5a4424da37f0f9685d1f8ed1329c8d30af6134425e7ce6c299d02add4642
  - object_id: DOC-GEO-E2E-LEGACY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-legacy.md
    content_sha256: db91c92b56d933a08d874c9de3cbb6b8d30668f810b153bf0285b738437b9de7
    file_sha256: b7aa20e3fcdb74c85feb598381dfc147fc5d5f762a8792cb649b11cb636b3e8b
    snapshot_path: outputs/snapshots/cis-geo-c1-review/objects/knowledge/documents/doc-e2e-legacy.md
    snapshot_sha256: b7aa20e3fcdb74c85feb598381dfc147fc5d5f762a8792cb649b11cb636b3e8b
    entry_key: ff883eb1be8a26cf31e28445bc0d9cd6362133fc49848e1f6f33fd1764ee51a9
artifact_entries:
  - role: signal_rule
    source_path: execution/contracts/signal-rule.json
    snapshot_path: outputs/snapshots/cis-geo-c1-review/artifacts/signal-rule.json
    media_type: application/json
    source_sha256: b3b82536873a227ca6bdb3764f1f8711df6b50fd000fe78308e36173d56e19a0
    snapshot_sha256: b3b82536873a227ca6bdb3764f1f8711df6b50fd000fe78308e36173d56e19a0
    entry_key: 02169cdb8e2cb27facaf983fab92fb5aaa5dac08d8c51010400abb073db44d12
  - role: sensitive_data_policy
    source_path: execution/contracts/sensitive-data-policy.json
    snapshot_path: outputs/snapshots/cis-geo-c1-review/artifacts/sensitive-data-policy.json
    media_type: application/json
    source_sha256: ac819db2c463201f8d00e1a9dd8d081df9d1df7c5202b91ebc3404b2724310ab
    snapshot_sha256: ac819db2c463201f8d00e1a9dd8d081df9d1df7c5202b91ebc3404b2724310ab
    entry_key: 8039963f099881c20f3807118b7b657097802fa90f1e7becc7c66255e3070317
  - role: other_contract
    source_path: cycles/preparation/matrix-C1-BASE.json
    snapshot_path: outputs/snapshots/cis-geo-c1-review/artifacts/matrix-C1-BASE.json
    media_type: application/json
    source_sha256: d0360bfe70194c48c88044bcd406789011ce9e2c32e1962eb530d2c9a6c1c7ec
    snapshot_sha256: d0360bfe70194c48c88044bcd406789011ce9e2c32e1962eb530d2c9a6c1c7ec
    entry_key: 927fa8b2911d58bef585f281f70d2dc95911d020256c11395bcfbfe7a3291261
  - role: other_contract
    source_path: cycles/preparation/matrix-C1-AFTER.json
    snapshot_path: outputs/snapshots/cis-geo-c1-review/artifacts/matrix-C1-AFTER.json
    media_type: application/json
    source_sha256: e1ba3a9abb365bab1afa8115205d547ae609526999aa5735c65fbe17be4be66d
    snapshot_sha256: e1ba3a9abb365bab1afa8115205d547ae609526999aa5735c65fbe17be4be66d
    entry_key: c5270b0c10d826d53db49a655d568c612dedead558fb7d85d47e2a3486bfd352
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c1-review/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: d7cf6624cff5d27e8c295954cf7d3d92c7455d80c7cd0bac6a8bd59daa0a1175
base_freeze_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C1
  version: 1.0.0
pre_review_transition_snapshot_versions:
  - ref: CIS-GEO-C1-BASELINE-RECORDED
    version: 1.0.0
  - ref: CIS-GEO-C1-DIAGNOSIS-READY
    version: 1.0.0
  - ref: CIS-GEO-C1-ADOPTION-DECIDED
    version: 1.0.0
  - ref: CIS-GEO-C1-PUBLICATION-CONFIRMED
    version: 1.0.0
  - ref: CIS-GEO-C1-TECHNICAL-RETEST-COMPLETED
    version: 1.0.0
  - ref: CIS-GEO-C1-ANSWER-RETEST-COMPLETED
    version: 1.0.0
  - ref: CIS-GEO-C1-ANALYTICS-RECORDED
    version: 1.0.0
pre_review_entry_keys:
  - 00cbd13e0f8be33c9d21b59500ecbfe221002d79aae70f46bd3c72dd1e8f8ad5
  - 019cccfae6e0a2852c3b64ddabb153c1dc48900817555e259c90af549cea27d1
  - 0251d321d6550dc89dac1d978ccfd3a42bc326d51cf96327494b0f9b0393aa3a
  - 02f6aeec066167f02886691b680a67d488b5871491fa906905841aa8653b370c
  - 036dd134b9a7c503423c368546776f05c2512700b56254be35ce6190f06a1f76
  - 04816eeddbfd22ac88ceae55fdc59d6e29762222248b3437914784e8653ef6cf
  - 04a015a223baa69b9fd16e441cf1d22c7730ceee4f991a9bf182d8ee76e868a5
  - 05a13670403c02f885da8d377683cd41a32a7285f3314bd05bb976efedbc615a
  - 05edd7921ccf8917e53ac1690f275dcd8a7a32c0591a66e48538762b771a10aa
  - 060be975c4cca7bb180fdaf2169dc8647b39d65d855072c855ac92c0b38738df
  - 065d9cb84a6932cc169273cf40aa52596558b0c50e5ea0050b342f0beb8adc32
  - 06ac37f420ab5b1aec5777b183351d34ef56f70de8c206082bcca9ef673f7e20
  - 06acf6faa6072519605e4088bb2dd7842008569148aa7f197915257839aea703
  - 06c2b6bf43385d7eb951d1273b37fba976b115e3a45f1b01fbcb69e6b84add61
  - 0ab1ccde5d325d21dddb4096d933bb25ba1802de89bf1f0e426b73743b842a6f
  - 0b22cbe9be115792e79d3bff22c313440e8a1f768e15c2aadcacef417e856567
  - 0c1694321a8017ee3a5a0b1494825bb5b2dee04e921cbcab648e2a8533bef5af
  - 0ccf9432049665c5d72091c7e007040ecae036a53eb4e214f17c84b8d407bfb7
  - 0cf40fd8656a1e27cb5b22eb1b400300f7220620ad5fdee0bcefb6a13c306bdf
  - 0e8cf7f84e4a556a2fb1a744013f5b4d5b3811c5e1c22f59c9a9323fb80b224a
  - 0f5116e1bac17a4b887c75c5eddc8d6bf70f2b246058e46913bd5ce432812623
  - 0fb6545edffda8de1645ebccc575562058c2a74709eae0c0669b32d3ac2e247d
  - 0ff499d9feae0cbc7960aa6ef356ce70a533cc9b30c62ee47477ec76159726fd
  - 101240e7b736ba34b03a12aa8701214d0f32bf7beef5bc5e80e80dd574da4ee1
  - 10f95df85dc1d0fff2e1501cd93948c09a0662854c23e96a3e88d45a78e78f66
  - 11008a42398f914c8dc6644244905b5f19b5f091261ec78716af4c7168abe4db
  - 11df3c1d6fd26b1589fd666e5eab56be155da84e28a08bab97768b2eab25e851
  - 1259aee689078fee0b66fb540ba9d84e18b77962a20ac658ed88367bd3dd8139
  - 1289d3bdb029d33ef02de5f25a72d7d5934dd95e78d76bba387c7dc09ede7391
  - 13392c8ec5fb7c61ee328ecd1ed232992737aa7ea8b6734ba220b98b597cb55c
  - 135879a80417e96f51283843b43b58fd3ca223f3a1146bcf3f2a0e86aa28a744
  - 1381810e6f3c5ab0293cb1b30719645459a9bb46f3c0c4e66d3b481a95a1b0fc
  - 14250fcaae869e34249464b485afefa5c28739e3fe6693d96d99ae731d9793ae
  - 142c1834f9751fd6d7080c4c9527197ac1469a89d08121e7facef0849dfe7c83
  - 14ae0672f0cde708a03adeb6ab076ce9d4c55321f34dba1ad9f41427772450ef
  - 14b19882ee43fb913dd1d1c0b73985b424d812ebfab856d00e72817fd70d4ba7
  - 15d4cc2fe155a192f1d31b9df0075992fe658e4b88e8e32bc60ad004f17c7ae7
  - 1643bd411db3634fa67bf37403ff2826251192c6b56efbfa3e8664d414466bf9
  - 17f7f0273f03b230de793bf1e66b9752a466d515055efdaed0a64ab95c76a48b
  - 19f07b36675a30adc65c62b613758d7b31517071702afcc36a2a8d504d9a66f1
  - 1aad04978e8f9a59f8d0371268a7afdd4224a86a0a0008e785c20f8d43150929
  - 1c68b57d04fcec2bca47246c426579b143960cb18020ec300fe52251cfcdd2dc
  - 1cba5a89213d94909c60270473214a336fa0d09ae05603a653591a17037b4703
  - 1d2bbfdb4db3b944332b4b158d5076dff0459a8b70497fb96562c75b63d24a45
  - 1e9c93d88f6a66b5600ba34e3cada1ede2f50630de17ecddc4ad7317c4a05b2c
  - 1f3b6c2b2b8995f83316e6dc2264fa2b54ff0a9117c62cb171619b2518b8c27c
  - 1f45d0a9194f492e815c0608eb5fc59663b04fb1819eec68962be30d3eb57dff
  - 1f4e416c6cf622cd09c768178f53266d1e7e97f66d90442191b31e1e7925fa84
  - 1f64bf105f31a982772da1fbce4896b2fea5e28576b4cac287037706f6c20e2b
  - 1f6e02467279d5546f5783f979d7b3569131e2d01061ab62f207c3169be62654
  - 1f722d231d7168be1fbae06c0d81a1b5b9642bc5b7c11a2ab059c2048c6de6bf
  - 1facfb0b6c9378b9958bbc3821cf8367322e2f2c6b6b8de9a66c28d7da13fb77
  - 213531fd56ded672f8a8cfaab9abb35865ad4964d941d9aef71da9ff570febf7
  - 21cbb7aa74f904ac9b09b81078e34449b3027396974709888798b176a8ad5b8f
  - 22556644a3a05c915d0d0fd582d57e0f97a95c8fa212732c6538648c8492d47c
  - 22a3451db90d76622b2f2a755ee86afd7df4d8696c88103e9816afb82bf5b040
  - 22a59d9fe50224c4d74a58f4efdcadcc67626ad8dca23b606b2d1fba8c478b2e
  - 23632135ca147ba48e54def311840fccad996899b7c9447615fa5ceba32df96e
  - 249de17ecddbcfd4d590c055aadcd436a23b88d0dccf9ceca7204cafae38272e
  - 255a4391b7c5fc0705fb455727f39cd41a7462f245e9c5286d6ad50dc2510d4c
  - 2575ebf19aa121f91cdcd0bb115e42ec825fe519b9f783a5dfadcbe352aff4df
  - 2708d88122de65ba0c0efc42b72f8029d3fbb256ea8c7ad1952ac19ca81dbb90
  - 28d78dcef78d5ded559e2e6d1edfb5b2f114b5fa722828764442b1989ed7f989
  - 2954945ce348e7d56a750ff28b6048b2728f52a77b26abf2e1eb1047b34b7a1c
  - 29a6835bbac96ce98498a2d60669c51b13cb272e08a41a4a205049012e2207fa
  - 29eb9bd8f9e30f233084d4c9b490a3759e7f66e371af81c317c66ee5b570214c
  - 29faac53110d232319c9b39b7bd711cb56f5103a906b8b507bb561d5697e9a54
  - 2a03c2086f04bfda774bc2a260e7720ffc3093978ed8f70304af579a50802d45
  - 2a152cd63fc4b9562a1dec146e864ffd8ed4cce16f7242541a3cd792ab55711c
  - 2ac3c8db40f276b85d7b9d61c7c8fb1eda66fa1ce78de13efc0a08cd3e787861
  - 2b1e8bb622af5455f3032dd662123ef79f17ee233d76ce0a1ebae62cb8c98ac1
  - 2b3f26c8446efc5c54f04a3f97ce8c9d16319d8310b264a88ef3d4ea6436571d
  - 2bbb636426b11d68b717ff6bb42a85de7fb619448ebc9b457ba31893c441ed78
  - 2c48c260114e19a750638889dc43eed99121898fa7886ad268aee3c1d947e4e2
  - 2d2ba41d6c729a96f1dc0db08cda0b148a292899250c1241bdfeb26fbd9a473b
  - 2e54918bca2f6fb297fe0a80fe353274d48c15a18e2ec2c2ea2172d69fb5f980
  - 2f2d1c1a2df72d3c94eb3dcc7492d96a22d9dd674f69f4953660b464d69db525
  - 2f85eb8cf46e3f2885deabb050597cc2b68cbf00c949ad4cd0e90821bc34053d
  - 30caf7164b71c91c30612cea6f05e1d99c5b165f191f462fa1e379a6b368ff36
  - 32b6f3f734ca623f447ba69c80f274a484c47d3d189d068c4425f0386fc51137
  - 32dca7a428af189082c9d9705557d56290750e6620557b27fcd9f7318482c1d9
  - 348e2640f0e8622da10fecbfa7410c6c1d7de211060717440ac06d0b20119d54
  - 35064b9dad525e6490c5904db7cf286b3290c206bef6a1794d409ba3fafc205f
  - 352d1a5daa58795b4b4d41568e172a4fc2b0e38d5d9b18c23f4e8d1556c357c1
  - 370aa12c41164d594a7a3427d1aab57865c829a74e882f8e6e50f22db573bebd
  - 377f61ccbe82b0ba6136900d43b7d969bab5c827a84e0b181c4ebc5fe0f260dd
  - 37e2c7863a493e9f0979d8ee56b67ffdfcb24afe619d416dd120fd1dfa7e5847
  - 38079aaa4a60adbf935b6e14f5ec3d32c8ab6643648c93c847d723bba9f83fd8
  - 3a38406a124ecf0c849523dedbd745e337352bb412d79803fc15c0e4cca921b6
  - 3c72a89ef125bfd9ed7987f475d0464956e524f1a61774a525a41695f114c0ed
  - 3ccc21fb001dd5ff9ebc9b07a5dfbff6096b435c9cfbeadd4ca9548e37607cb2
  - 3d0d3a16797f32c39eddbe0dc5bc4720ea6b52560364b593769432f0b546d9a7
  - 3f32256c906040627c35fd49c0af815fb3152c69ea2d59b6c2583b2c8d9b804d
  - 3f7fcd90c418275ee661a8eb15ecc270aa5a3e6639846d33e0768e812514f231
  - 3fb25b7c97648fa3f5a978e1f797ed70a52ec8e5b7354be8e278e4ece6712714
  - 401af3965c3b07cb8d23287683ad71aa7ba13fc69bbbd89eb71312118c2a8571
  - 40b9518df806cf5626d2914c8f4fac54cf814a4956f9d6ad044c2e63dbe70f62
  - 4163299522a3a02d1bca6a42df12a92713899f93a63b67acd995d2d0448c771e
  - 41ad7b985356eed3b9ff16bf3778f20bca6b7d759ef93a568530c8d000c9c142
  - 4322adf8b8e2d3d9d86def890e4cd2effed242f6d41af8632335b7afa0c0c3f9
  - 432f42c4aa2de34a435471637ca311f1957ae0b28999efef576ad15b38c52f9c
  - 43b490627519cc770710a74482350b9f924de9b8afc2be2b5161d59f239df8ce
  - 43e5466da8e9e59503bfa706e3e12649c20248a2aa1f9096714a6f475d12d456
  - 455e7c1f09c38d9dcc1ad3623e7c1b6580fe96f5b3376087ed75a6d863c5e942
  - 458b69b31e457f1ac119c4d5af71041c0bb64739e3edf423d605c99dc22a155d
  - 46161b123bcfe2ed249068e6e06c09f8f474c65f06402b37f9a4603f5e57ee5d
  - 466553b532f294b213b5ba7447b1e20730f30dfbef7e8770630a8016c93e0453
  - 49cba78a2a1843a7188775883049732a97e18ebcbbe9f229bb484a73e20b07aa
  - 4ccabee2aeca65061420166ea0586d278b54a8d50dc54435261ad59def0e0281
  - 4ee075d467ebd5e8335f699a3d9ebfa619cfdf93a8947346abdcb2c8d4dfa486
  - 4ef5db6d2782a555b87589ad87365a9b786b97c069c2ffae5474383ab546a0a0
  - 4ff616159b7d86ba3c70033e6136f1019eee0c23c6a69a581324c871ca8f565e
  - 5142c21479fee109807d68fc4fa8e5d628f18ca1734d9fb0fd45eb68e02389fd
  - 5232b996685a3260c9b26d410bdb64cc5020cb665c32a0a711741d364a37dc5c
  - 5279b0a564d611206c9a7bd8783ba2c7816aead041aa2e22e49d2a00b88cc704
  - 539eef3750b48546faa9a7f924985f5835319b37082f6e8dcb23b72be384bcd3
  - 53bafdbb12056049b8db85df6e6e080f58a3429ba3438219f895e7d8de0803bc
  - 542fbc0b2ada8ebdf13d82334db87c02b02687601a56df9f90869c69f8013778
  - 54f245c0ea6ecf5b7ed62ec91309220102e91d67beaf730c6b8bbc2240169365
  - 5548a83af8b37f18b8d0ae6ec42195dff184b0f3f29aa2667252bc2031c65dde
  - 564040b7911b6250d4de6ba87d5982b1eaf1295bd64878cf20c7b82a719276dd
  - 56898338c9791b16e7e71d97da6389ba5e659cb0ac9ceabf4a850edf85840aa7
  - 56a42c1717684eb9a614f5de7a86b688fdcfec79437ee90479271cb3e2062765
  - 5742bf8af9f536b88e9c29ebd57982a19c0ba6da88b21b0697d99e57d5ef3d85
  - 5743b125fa40d5c4651f61177ac25eb112c3cfe200e060f3a7e3a1c3230ca44f
  - 5801eae77d984d0122bf3526edcbe20a5b2caf448cc74d919a616a08a7e463d6
  - 59352be11e942c80b43c7b121a9bf4c333f6be9ba7c75a2ac5af674a4260a153
  - 59a5f27758c04a48da56e642c3380b44bd4b43a40a73d3438415d2679f4629e1
  - 59e08ae5a0ca462acc4cd2a6b547f43979a933f2639d59f24aa6f731e02d6565
  - 59e1c0e7cce523b291f1f8577ba771d752b1a78b6b7af7baad88580c8cc7ba7f
  - 5a59bb70337c106fe30e0315ba3005ffcfae2095e9dbad84163712a1a087076b
  - 5b4f4fe23d222183a3d10b8fea714052399bf2f552137df57ebfc4e769c146b5
  - 5b851e5b1d7448559e032ff930696bcb3a60f9c32aa78d024cb19fcdf9db879a
  - 5d76341377a413dda044465cca75d5c35e0d1de2e8de0d74d6c9bea144aa3c45
  - 5dd7019d6b1265109cdcf91bf6c4bd96862440ff499cccd7786b5e85c91b358f
  - 5de63d72b6df9d1340f4ffdcd53649952898b27bce7484103b41856ca79f1a30
  - 5e8ebdce77cf323a5e527126eee10e1d8ccc6d7da96feaa2ae02d8168676adee
  - 5f14b6fde4317def77a1a99ea0317f4f93a3a545a45d6586a54ee72740f833ce
  - 601ea73e8f8dd1313b79296e9486275967f78b74704ceb2adb51d598da17e4e5
  - 6084bb051c4bc488da6800315afa8c49d1917f7831b4599d115a69c6c5313175
  - 616906330bb67dfdf38d6332a6d9b4dd7a471b1ef4f58234ffb053004f90a5fb
  - 617514da8e2c1489e8154049461345a8e3954be1f02543c187a44092da7acfe7
  - 62ca21ecbe0187741caf03997f0ed5affa12e2e3470f8f59b984e28ac79ae93b
  - 62e610e85df12b859ce602a1dba977c8499a50dda36547b6aac408bdb71c6a2f
  - 62f61ba981252452f3b0edd646caab774bba63742c8fd9d861dbd8aa0676e178
  - 63cd86d83376a794e1ba4ca1f8b948c97856fe8e845ea4920fc7141387f83acd
  - 63e0198fcaa7f3fa2f3821969c3323994c05bd1ed6406938d1fbfbd9240f197f
  - 64f24a23fc415291ed36ee4060bd4058c4121eca50c1fdd72cf98d3019438381
  - 6538473b684bec152b457848b586d2a8de269676dd9e23a85974ef92f91f5dc8
  - 659a853787944e18d0bcb41ec2cbed4ac5e2eea2387ef4502e802877c006986a
  - 65a1ee8ccfb441f9c1f32292cae02ec33165c8dd815208a9fd4759783963fb76
  - 66b5ae382320c52dc84d108c1cdd4967d7b32da0edd53e5ccbd04e2c25addf3e
  - 6827c41779f29d39f8c6524d46a63b3951a129a0a69ebd68dc6e2f48a4a28b5e
  - 6862b4ebba8c6a67525c7e83db9f4d23b753c2342ab91d01623ae607e3bd0fb3
  - 6888d0ebed3f231eafe802b82ffe46f1b3dc2e3aa51c6741b67e6ba80123ed53
  - 6998bdf365c92a3706c067c88c5c35cebc32e54462463f5e9946eb2b39f611db
  - 69b18d76175ccc5fd8a87eaca82863dc4370ca14a1a7f573f36f22fecce525a8
  - 69fc6bd6842a93537b3bb399f43a27a62674964a6f41f7777d44a4a466f5f1a3
  - 6cd70cae7bc0439ebde8980954900011e5ac8e48a8f2896382a6628320cbd8ed
  - 6cdf0ed4dcd16b9335ee6566f126a07bf5cdeff900a6e8d1b5b309e0dcc85dd6
  - 6ceae000609453d9972855b3d450fd9164fd65fd820c78539c4703c5f98a331b
  - 6d11b26ccfd591a75096b6746ee3ff60ec61a40c427a9bf4e06b80472bf6d9aa
  - 6d9c1d8a479dcb19a444a3467ae2ce4d105068eadaa9fd50bea66aa7dbe35528
  - 6e5b0a179c0ccbbd74056dd645f1df3b87375452b2ed1949e300700737e54ff4
  - 6f865315be5a12e33897d856042717e9daefabe0856c279b437f826e0d9f6e3b
  - 70bc7562c313b3a1115d921a3c7c2248011d485ebba84dd980e07371a6395331
  - 713d92e3f8a8d275db42eceec0a017779dd40f8368a830e1b8c0db1f4ea44a98
  - 71a2224809f998b5581e17b6105ec0b7a9ca5a323beaea800f8a0f259da86154
  - 71a6e0aacd74ab5e3482cae4238d30bb8d16d35f48d5491fd22a9007fd10df96
  - 71af74c75dc1a2fd0f1ddc34ae756263bb337d1a00ea0c618748f2b95b902aeb
  - 72de0fb39c82602d2904bde7f45bdc4364dd47cd476dd557025cb188e6cbd4f8
  - 730de43ab47c70067833df9245d7c2d073d744a8eac897440ee093ea223e80cc
  - 7360647234e50f6064ea08acbd06b1022b6407750c992423ba2b1199b32fccb6
  - 761cf3b1c73e8dab7b33163aa38483dd30a018fc13aaa3cb6f963b3b5dee0556
  - 7746750e585b9eb7015edce3aa0ea5b0ae213d75d7e1aeba0632261c79e86055
  - 77df411a973c72919b8c62a3506b8ea52666a167baefef6ee9a8294a62f441fe
  - 7864d5e89885e019b72746c19b95811faf6efb8823d938729ecc853e0606fc67
  - 78c4babc9940d12e5f9c1b64dc82cf1d814fd540ad69d7669eb5f01ba7ba522b
  - 799391d9c0b90e33294615ecda695dfec5a35cbc825ff1e9d7052b0eef615b50
  - 7a0bddbf425de588a51d012f61dd98573a69128d1bd74a4c7f9e0201524472a4
  - 7b928815ce9f032e9f3e11eb4a74698c874779cb6c0e4d8626d3b66eea7ac737
  - 7bebc79e94b39a1eaec28c8886869e3bb4795917f1e72862af20d7ae16823196
  - 7ca99aceb62d481adde919508969b564547a23847aa934789e1e6c423027af92
  - 7d853ef63bcdae7ce91e5e77dfd5c6f6d95c4d3d42fb8de4bbd64f73f0f7219b
  - 7e5b031c7bbc58e0cfa4893915d5a3b7a1a63322e35af86feffc4d83ad54ab40
  - 7e91320e29e2a1ac531de0ff95b7c67bb89e7136ed9624513e544db82cf981db
  - 805477e3487e4c1480d0e1a7a91473908fc61b4b1a010d9f86da69fcd3573229
  - 80edddf1774b1c90555fffd0da924a06403f4ee2fc3a41a84b363c47708bfac2
  - 81f9ec04d03ec8542712df083e9b6a17e0d40ddb595aae71f8b1eabd49ad782c
  - 822239b0c3cd74de173689fbfb5f9f491497529f2f558a98972a58f9eebd92ec
  - 827d19e3fd8ae9ccc51f5796a8c0adef56f22e9921b67364359b1ad37f06647b
  - 82e7d3fd36a82bc0af687542009bc494edbbffc0c529d6856c6d4722645045e6
  - 83e073f60529c4b4c16462a100624e450cbc82973179d857a1a39f2da6a291cf
  - 841e378fa9b1c98ce7e60b7bf5c1a861aedab3dc0f39b91ae8ef04f8769b9e67
  - 84f76b0c7eb501688b2b5475f88aba2ebdb581f318451d350c07bca5e64f5b73
  - 864fb200052cfce6ddf224a17a03677e0197d2b51655e6ef2614ff44e076964c
  - 889b0d721bdd74adfbdce103057e695487bd02915636b01be2888b5ccfdf08e7
  - 88a49bc9d6ca248deb77e1687afc3a3f613a89498ee1045e3e0875e28bf8a1c7
  - 88fe4824c72966a6e1a2d12069ecb087ecca745aefdedadaaa5ce14aa6203aaa
  - 8946c790d171b0538b8e4f204f8dfe2fb6e84b64ff15b67c096ce07b34c52466
  - 8989c4e109f3d550cb0ffe98c7efc11a53420742b427d532ec707ccf36a8c0f5
  - 8989d2fac0327220da809f2b1a663a6f2dfc32451fbb631ce27bed84bf480f8b
  - 8a2458cb03e790d5fc8d228697ac65d3d8a33edd97cb16b2e192033c0720b998
  - 8b27b7f43cfe2fd50f20c47b65665c831d8c93607d94ef52ce91ae621984178a
  - 8ba670b95b7c3d36fa0b98fcaa4edf0fc4f574e2012f61f20dd118d461f6ba4e
  - 8c2235774f7a6aa14bc6999f8ba26ce5aa1f04f7d0db086e30e7ab96820d43b6
  - 8d5f5c531f526c1922989367c2010af3692c60d3dbfcb4d6f61d02244600812e
  - 8de6f7f1a9635c16b662f429ab892f21412a6341fb9a99d730f2d8471cfdbda9
  - 8e7dd761e9a9a308e7c078908dbfdfc6c1fca75990fb52653a4643d9366ab9a2
  - 90ba73d2b7db548d50fcab442f550b1a26c20dae1ad2ba6fa81e5e548ec7d253
  - 90fbf74ee7af95548318c4b0f97ef0d0e2c20d9b098c5c8be2161311188d0d39
  - 9164c81289b189199b738f46811a74e6b9d025add0fbee5d2bcdfb180823cc03
  - 9313aad564dea2657bbba162524271703bd73bceed333e5c5d592c8f8d933c44
  - 9334732ac68871ef9f0c0ac8fa69508bdc26b3aad532c639f03358c22cf35509
  - 9528002e6e6d3a21bdc67dcc1bf6cf605561606e04162110878660a9ed8686f9
  - 962e3667fbc1cb54fb1730d5823551a87edefb558ccc820ed087efeb2cbfb3d2
  - 968fcc46bbef08899c6c091320e6766c0574ea066f3c6dff7dd9c30d269d3fec
  - 9719a275c8e60adcd162d801c709598548c8de2105ea00298ca4798f9170e4c2
  - 97f1290fb9e9ac849cddbce0631bb2f6358cf3fe9c2b230c45e23b730ee950b7
  - 99e94be2d581eb6566f28f7ff63e09a74d1080d888fe102f9b9b938abeaf7bb3
  - 9a236e7061e8d356f706035e423e539d35a9d27ce4f80c6c2b35818ab34389c3
  - 9aa18c8ed22800f92b7e7cbcf64c40b31c7308de6b6612658caac731f55758f9
  - 9aad4fddc5044050b9164c80993e79a98f929a8876ff72a8f5f9603bc38f7a32
  - 9b2569f100e6f738a6579ada8435a91a9b4a7d6b7f5997fb159df10667e67bfe
  - 9bbee68378a62b8678fe626e43d388904f73de3c74603d3acaa25b375644c203
  - 9de53196984688a6535e5f2665a5f8cdd602481397db0b721efa7d7de024ba79
  - 9e6166e9ebe01075d8d4fd0269571f978a229a4ce0b1d9dbd2558ce3e82b4e74
  - 9f2af1f70f36f18a27e5559d8696f62e5ba3698de682860f5eb8bcdd9592dd3f
  - 9f8363c6fe921c912d8ae2582ba38cd1717a047d1698a93dcd1ee2197a2b2aa7
  - 9fe3ea77695c76c66b518a96dbed591784d1431f6445b51a56b93e0c96bf5efa
  - a01407f71f41a82dd1b98e7687cdab4ce79b076c54bd3aa0d45a5f62dfcd6d6a
  - a060f110510b8e02562e400af2045f7c161310acdcee1f2d9ce892091f0f2357
  - a08d8041452bf11324a1adf5c6cb8936dde4f1696028ab1c47cdf6e7b5f57c8a
  - a0c0f4233c0ebacc0ee78e6d993eb69252a7040c6f4e916895829351b447369c
  - a2b9d0614423904343062289b58dc304300029ef56d0f64a2895f10cb89901a2
  - a3dcbb6f53dc30993ed82688a28178a82be2add72aede12a57f5916d79c7e877
  - a3ea1ef04b864d18de990be123746f0a96cadc5346c102b32546e272dfb91d0e
  - a4e260f1acf31807cb2523ec3b91306be265ffc948aed2c066cdfd14c75ef9e8
  - a590f0bdbdbdbb46695f4738670923fec3f3815e8cd78e0556a91a538cfe2030
  - a636de43c1feeb358f4601014f856a0b19d1808e915ec33a033e04cf897d0ddb
  - a716dd24ab3cbe08acf1367c244a37af6d398544251567cdd8e5a2dbcae61f85
  - a78716c62b1032ba9483aa77ebb28005bc22ec3de3f0034a77d359b1e631de54
  - a963fdd890561583d1dc79b57c4fae4fc9c88a34fbe374f59bc8d6e916b1a3d6
  - ab1470f84244da4f6167b5230bdce618d6ec7d6f0b048f2ae568e20aae5a20e0
  - ab9724ebc334f4e4e52aca76417bd9c55e828b5cc1097de430aefbb4eed52a85
  - ad9a41aa0eb816607790dc5db05bfeb6a02459abc983b48a01b88808730ece3a
  - af2e8da81cb088ad3ef69c3968894b1a22707d9946dba7b7a9bbafa681bf4c8d
  - b04270191126c20efc9f05167782ba3d8bedfcaa5ecce950e7c08552910bc028
  - b0d7655ec1ce935316afe9e73316a4ef44b3299e9d221fce6c3a1497f1efb071
  - b16ae9675fc8e0482e025086b7130d8be20a5ec0b54b3c6c4fdaff76540c1940
  - b268ae2b3727cce74324b357a8a49fd7d8e8f2da99594b4e5211b4af6c3057c4
  - b3e3d1875b68591f43cb84d28ce2230f4c89dc13868a758bb4d1b8b391a75e9b
  - b6092ae94e69471d3c596e661ded82e7f48d10ac0e31291b3cf286702e9d5620
  - b78aa91c296af799031d49204288e92f5862a2932e7be9468b261da783ae8eeb
  - b85b71e3af826b71ef18e75f4f814dadf5db157165923adb1a490ffb5bcfa2c1
  - b8be655456b0dcefec8f97d8c81bbee416629be46e85f0398422e7eb14557b63
  - ba98c2547be7376558fc6a0d6513c14c414eb8b113ef3e35f7656b4e25017c98
  - bb2232ca6638930fdaa8b3cc5f62925add95e7640ca96b9ef3124f778669a009
  - bb38149242d3423e09168b81300725588ea41562aebc4aa41661ff9be4b2db20
  - bb3d86534dd8ea35f58902107117c906365a30914518e3e9a3cf2d056d9f21be
  - bb45cb1b88f58472f405ae988f11384764a4e1d595253dd3808fad21c933cd55
  - bbc124bbb904029cd4d81aeed085660c2f23c25b362139a3b558cf5718935b26
  - bc1822243e8756394d6df859f1efd582c25e6cada17867aaa081d1a8e4ae5a83
  - bcf17dfa6cc3a8bb443f90c85fc659a061c5f68c0d0422bb1f707f061bf77638
  - bdced6e02745ab520cccaba1b998854bf7891d7b96264aa7fd7804baccafa7a2
  - bdd6d42e5816453a7aebebdf940c1dd760fa85487d7633dc4056bb3e0da9e58b
  - bde6f4e35182461a91129355bce02f541be3e30eaf2ed183efc7c99daaadf5c3
  - bf4ba17942a4daef5519024e48c74a3a2ed972b1726821f20a6e8030009305f4
  - bf96216502a73d08da4a6c8fc60e2779551a4cbf3a9f4833316557b4703afa8b
  - bfa51999c1f2f5192a4f4abbb372485f9e8098f36447f1504a47cef5b405c660
  - bfe2aafe36eaf50fa656e030ff9ac5c25307c36ada49a9790f762ec06b93ce61
  - c00b230d26aea2938406070dcb1e916be5305210ad0072b13835d2de3bd691d5
  - c053e68ac97552b735157f09607b91e681c203a87df4a95e9b73ad3d667ef40c
  - c05839162a153118586690eebe4019a6fe60a492a4ccea359b0d0d4247fc9cd9
  - c1da2e5eeaabb3808de16e4678fd81ab5f4aea4a31f8fd1cc2e9e0252b1f852c
  - c32a804dfd8ed0da644814ae2913b28eda59290381d417d7fd395ac30c360531
  - c3a48c3c16d61bc4508cce717a4c4ed21f7e39696156011e20bc24c9346518a5
  - c3ccdf0ff2381d92a644e313a50950c72a2cbb75f3d55019e1c94e88cc2f9438
  - c43c01a54592bd80efc483f91c5262cef1b98490b7a06c230753c8a7563e1693
  - c48d42b35724a5c4856d3211a2761185276868d3ad0e2729c43b3a04a35cae5e
  - c5517f41fd0a7e0f69cb5ca1a4e073a0265bc80dbf36d4b583bd13f25026f22d
  - c573227bc8c94a809e47011f1e75d0ef81210b024e5b9516addfa5f753497d79
  - c60e7578ac53e74edc5225366cb794e26801fc2b78978a2343bf3fa4b1d12db7
  - c7204565a79dab7b084fd200da50553ab52e9dc7cb9872289d969d27e20298b0
  - c7e8ab8d132f3f19d51b2d9bd5c6d074aa855e2834efb282cccaf5cfa708035f
  - cb478efb857c27de73b05fdbc57c2498c4944314fb3331e8f905c1bd3e466d10
  - cb73a5e47aa8c929e199cd7f58b0dff4937612456ac914f12e490278c3dcd516
  - cc19b3c9c1baba226031be203eae967db985064bf1183e1e47a4af2c4fb3a632
  - cc270487a71c43363dd17d5d319e1095347d383566345a6b6ad8530b50985dad
  - cc2cea5ba1c9c225bc9ab5d3b056a6d6e6b2794088ac110efdefa3c05f71cbc8
  - cd887080aa00f8c5f7b5f8df77c041eb2f337d851f1159e683feb292dbd3abca
  - ced9d744ebcbf5d1031738fab919c0d29c6d78e78aaac7ff7fe8ae35fad8e29e
  - cf6f6cb70838a01df07527a1c73d1de62db5131ceb9f3d68bceb224e4f802149
  - d08552740bfb6ffc40d3519ec2df16485bbb0b6a7676ef37f43e3c97454ccdfb
  - d09b9a3af5e5b6022224986a20cecdc50dc3ffa5bfb15cb7a627d80a7aaf651f
  - d34a06c59c2c9a75bf8ba0615e68aa989aa40ccf828fd65aaca33cbed9042440
  - d3ef069279227a6ffc9cdaa6b6d7d908a0024c854585e227fdfec6c820489e0e
  - d6546c79233670410eb045aaa360d241d4d24b658aac391ccd5256503d2118ef
  - d6cdf410f3216f610181662b1db2d8e4c2ba800a3b6d8171e6bf944fd6d0027e
  - d73f753753c0bfaccb23e0efb8730523f493ac3b93382603605e6e0f257e3e13
  - d7eab5bff7a098af457055a416485c78ae6e2b7f3356a42134277cc29a1ecc2a
  - d83fd0fc6d8b300b0858adaa3ae8fa04ca4a203bbe13f40507782514bc386d11
  - d8b8e23700e6dd9ead8da6c8fef50391c846986178c52061e9d94c94bea290a5
  - dbdc6b5ab51bc2d5f37b1668813d604385ae84987665d31807cb17136534867a
  - dc5d121a893997476531632affaab192128e4e12858177e561eef6f0263f3de6
  - dd0bf7f63eee8af0d10ec6f56bb63bfcf9528f14bd365a84346d1b864b47b7a7
  - dea12ea289bb7befaedde6ba78fb8c8586e7bdcbacdbcd1f300800d486ed17ed
  - dec887dc0b2292bba7d9210233f43dee402d9547ad2ad8bd80f995f43bb6df4b
  - e060d8adc40f5be9a9a1371d4bd115e6cc81950e1b54d020d8d4d46ecb86b225
  - e09db13bafddb9a38f8d3333cc8de8e2a531712dd7ada868b996b2945ad8065f
  - e1a715d067f0a8bfa7041acdfbd61ef3d56c7eb0336b7a67226d0748550e7e54
  - e222dc9610e9484bc0d0f43e2a2e6167472aa62d783f9ca21f0e96ac93695af6
  - e50a0d5d3c0176391fdc69012b6d78b47ea8fd3d581c64afb00f5e81f2acb7c7
  - e5130529fa4d13c096b90051386670d54912c60e1f3b8ee3f9398251ff2f1726
  - e54eab3c10e5b5a00135d1eff1fdf839e090534d1cc1e9e0d9cd27bfb0764133
  - e5958e6b910c5045898386d93ccf60ea6607fb2f74bd831e8e64fbc244c97e3f
  - e5ceb8bac0acc5f1689fd5e52b122ceed687ed13915dbd67acaf26f891a9cd88
  - e6f9577316520a8e6ae731e06771217bebe9693aa3f47b0d723ed78c316931fc
  - e9ce1e522d79a953301b208850dcf88692cbb1ddf23f98cb703d26bcf34ed069
  - ea7c14bb17b5ae870540651c1b871d5a11407d69923d905a9ba30f371aa4a73c
  - eaa5f27fb67736abbe4186fcbdd1f81a3bacca274eb831dc375c1f14c629f0ef
  - eb3b35b98356d189a08f0fbf727adfae886cb4e0d07324b22387904ea758d854
  - ec400b75e719fcfd4c9d616efafe9c3d04b842e8a76f56427ba86adf2dc0d90b
  - ec443281504008fbe184982aee09d158e6e6768f7026caba8743c5c680dcb1ec
  - ed1eb34f5e59329d5c39520633bf66e12864b60fd8a141c9be9d48874c891ba6
  - edfa42c3d6db1b5f2ef39561537f15464f1b26758814f15db01c8706f94d0d5c
  - edfb9f2fc2d92a40b4f1740ea83e9b4c3e71d55ede70098dfa8944acd519677d
  - ee80521b1793c672858e26f75998bd1954a0bcaca46b6f2aa84c60a049e16647
  - eecc856225895652d1724f8379d842391bab721e0710b0de0c3b9e708033301c
  - ef5ed44ba5eb37cd77c8a31af215e530d48d05dc0f661aa4933b0be8f2c0cab0
  - efad84e22cb2a8d3ea7e87542987e4edef5bb3ff5cd3ae8fb1bc8da8d205eac7
  - f108ce653fe98498ebee6d6da435722e888bc149b50ceced2b3e605a89807f47
  - f131985d8a043792abf2fc2c4ae5748dba5ad72c83b4a50dcbf9e7bbbdae5c08
  - f307b66aed04d7ce7b408091b5d75d2ccfdbbeb7437e40d8af0998db63dbdd71
  - f3eadb04bbfb29a5b1980c26bed6e993f339be3ef4850b456e0fb60df1e70a8d
  - f51979356814624a455e89cb0915bb159c1e8901279cc3263b1503bea4f6d52a
  - f5a5f157cab324c6c6ecb6e1d3a273125630e2623195c75e4522519679b2cd1c
  - f61990fb1669b1a236d19a34ddb9f1313e779f05ccc71c6d6f9e6e60273ae3e7
  - f70770cc7645828bc996d985f4f0baa8053e312b6e44429f14e561f903bf39cd
  - f726d79aeab77efd617a256533f70b003cd44eff67ac8a44e71983fbcb7af55a
  - fa3608b8ec9659fd7c3db387e847d9986e0aac1f2c9639ef463e63faea1443a2
  - fbd3ba936ee5eb83800b4baa13ef0bd5fbed9ba39a65d677dbbcfb929681ec0c
  - fbe1aef2ae6555d58b9dac805d819dfd67eedab583c0bf008cbbfb00b70639f1
  - fcc3d81125dc600baadfaa0dfbf05cd7f316cc952d006c6fc67e1ad19edef517
  - fe4f8379218ddde4ada74e2a826961e7068f27d99a13799d489def6f87cafa91
  - ff466a22a694c5ef10d9e69b11711b155803939d7115583fdbbb3534a2fb3a69
  - ff872854a2cecfc6be1cc3a82f7d0290e25fe42257741ae31abee51f22890222
  - ff91c007d171f32402dfede4823321d8957e1c0f8988c9a1e038a2dd97825a23
  - ffeb0e0e4896bdd10c49119a3aed08bc64ea6b63c0e6bf1cc87b1b52cc8a8169
run_ref: RUN-GEO-E2E-C1
---
# Cycle Input Snapshot CIS-GEO-C1-REVIEW
