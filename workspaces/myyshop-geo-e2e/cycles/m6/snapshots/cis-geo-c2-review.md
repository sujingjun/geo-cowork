---
id: CIS-GEO-C2-REVIEW
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
cycle_ref: CYC-GEO-E2E-C2
snapshot_kind: review
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: outputs/snapshots/cis-geo-c2-review/manifest.json
  sha256: f65d28fe69c6a97fbef12186b1fc02fbecbce239cd437b2508330c2ea8e315e1
  fingerprint: 3bee8cfe970d0025be28472b096d1cc9c4911dbfb142bf6a68f478e6e81c384a
source_entries:
  - object_id: SRC-GEO-SITE-C1-OWN
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-geo-site-c1-own.md
    content_sha256: 3e6dc7819cc82b834438792a1446182ea7c6a51497bc3cd5050d7eafad9de198
    file_sha256: 9b1d2f9ef532bfb50e1787cdb9502e4d4c4b21638cd9b63648e99129c40ee708
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-geo-site-c1-own.md
    snapshot_sha256: 9b1d2f9ef532bfb50e1787cdb9502e4d4c4b21638cd9b63648e99129c40ee708
    entry_key: 0053e4c43ab9e761e35f651f490d65941e45c311cae45c8045b8daaa6d76353b
  - object_id: ARV-GEO-C2-AFTER-Q3-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-perplexity-1-reviewed.md
    content_sha256: ae10c463d1e3dc35213277ec5c787c733a0816f1cb83dac4606770ceece51f68
    file_sha256: 81c6a38014797758d17b080a68f99d0f8a8db82389e19c37d3828450d4d1b9bd
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-perplexity-1-reviewed.md
    snapshot_sha256: 81c6a38014797758d17b080a68f99d0f8a8db82389e19c37d3828450d4d1b9bd
    entry_key: 01d1df2fd9efd5a057e783d7bf923f79bcabd5c9ba6918689ae279946cb361d6
  - object_id: CPF-GEO-E2E-C2-BASE-GOOGLE-AI
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c2-base-google-ai.md
    content_sha256: bb211ba9085ae220155bed2ba6e654906f40730ab2f78b0a93cd1ffa2d3b7ce6
    file_sha256: 3319ad46cebf5a9d1ef8a4b776493e2ff2b6fd27a3e5ae8cd4b3008728f2a338
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c2-base-google-ai.md
    snapshot_sha256: 3319ad46cebf5a9d1ef8a4b776493e2ff2b6fd27a3e5ae8cd4b3008728f2a338
    entry_key: 01de4d1dbda6a4e947eddda9f4daa488c8fa3659fa9c9cf2c85a9e8b838ac98d
  - object_id: ARV-GEO-C2-BASE-Q4-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-perplexity-2-reviewed.md
    content_sha256: f056a48b0e7b2e33505c470b7ac3462e63da8f6fe2295a5c23e8a1b96564367a
    file_sha256: 644785b9fa6afae06500b97f9a1dbc6bb2300d3e0cebb75bf58b13f73a00fc24
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-perplexity-2-reviewed.md
    snapshot_sha256: 644785b9fa6afae06500b97f9a1dbc6bb2300d3e0cebb75bf58b13f73a00fc24
    entry_key: 01de72510d80e9dee46d0a97dec5284f1d1d88251f7a04ffad73c153bc12fc5a
  - object_id: SMP-GEO-C2-AFTER-Q1-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 2bea54a3612850ca871e3eabddcf18acfdea2303236cf87d4d1ec7f45d9b27b8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-perplexity-1.md
    snapshot_sha256: 2bea54a3612850ca871e3eabddcf18acfdea2303236cf87d4d1ec7f45d9b27b8
    entry_key: 02177ff355ba6f3d2d816859842ceb3360f79994b47759b9d81b6bbd2012757f
  - object_id: SMP-GEO-C2-BASE-Q6-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 6438fb3b429b7b88981453bad9ce125eaf3b438ff9d107ffabe9a7e447622240
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-perplexity-2.md
    snapshot_sha256: 6438fb3b429b7b88981453bad9ce125eaf3b438ff9d107ffabe9a7e447622240
    entry_key: 0256ada3ac15a3837e15c7bceb69ed31f2c051aaeba474154282d35d2da9139e
  - object_id: SMP-GEO-C2-BASE-Q3-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 313afe25c2877ad1b74ef0aec84228b52715d164e9ac61019b739f2ccd4a77c1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-claude-2.md
    snapshot_sha256: 313afe25c2877ad1b74ef0aec84228b52715d164e9ac61019b739f2ccd4a77c1
    entry_key: 0273ab3716556e800b970e669f73f64d6cc6ef667041d1babe25370f9131bcb1
  - object_id: SMP-GEO-C2-AFTER-Q5-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8d001a540dbd5d1910af7965cdac4ee77c45b0871cc538bd69cc8ce28ce3bea2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-perplexity-2.md
    snapshot_sha256: 8d001a540dbd5d1910af7965cdac4ee77c45b0871cc538bd69cc8ce28ce3bea2
    entry_key: 03444457420fdf6b185dea56a23e3651fc25e377a6661e8b641f219726d41da5
  - object_id: SMP-GEO-C2-AFTER-Q4-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: c55091d19654a459d5b6bf5edc2172bb1a7912661d81d17539381e0ad7e80903
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-claude-2.md
    snapshot_sha256: c55091d19654a459d5b6bf5edc2172bb1a7912661d81d17539381e0ad7e80903
    entry_key: 04d46dbac32a9d5e26959833a699056cedeb0ee964297c9c88ae78d46d0b540f
  - object_id: AGG-GEO-C2-BASE-Q1-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q1-chatgpt.md
    content_sha256: 4a6512b114004b84ed668f37c6baad0213b320bcd10105865c2f163689b3d455
    file_sha256: e4fcbd1ac2aecdb02a745854f2102fd5e9670496825c8a3c2a1baa3363c96b71
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q1-chatgpt.md
    snapshot_sha256: e4fcbd1ac2aecdb02a745854f2102fd5e9670496825c8a3c2a1baa3363c96b71
    entry_key: 0586f6b1f0c1891275f0941ca53f524445959bcfbddb5462ab1897b3e94968e3
  - object_id: ARV-GEO-C2-AFTER-Q4-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-google-ai-1-reviewed.md
    content_sha256: fecf27753711902f54e7963a8b738f90b591cdfbda74faef2ce6066ef14ad88a
    file_sha256: b11446579a706d11e355a7d3036602f9ef429dcc7e87c88458abcc2e5c216103
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-google-ai-1-reviewed.md
    snapshot_sha256: b11446579a706d11e355a7d3036602f9ef429dcc7e87c88458abcc2e5c216103
    entry_key: 05993e61bd645b836e98969dcd54d9d0fff21d233ac81540d0f8d322079d052b
  - object_id: AGG-GEO-C2-BASE-Q6-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q6-gemini.md
    content_sha256: 3006c1d3d9d592e4bdf2d39541b7585515f7fa894c9306c9956c059e1a94de36
    file_sha256: e3c49de67de2ffe45de7cc1aad1e4403055934f3d6cbc3bcebbd5e6a1251ded3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q6-gemini.md
    snapshot_sha256: e3c49de67de2ffe45de7cc1aad1e4403055934f3d6cbc3bcebbd5e6a1251ded3
    entry_key: 063cada5f1a00bce2d93f196a4c8dc792979ad2edc4e0067201090a2fd8f6a97
  - object_id: SRC-GEO-E2E-CAMPAIGNS
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-campaigns.md
    content_sha256: 3987871042f7f7afed241d9b0fcf21cdf7a041c4849d71dfc019b3aee7716ea2
    file_sha256: a3e73cf610800affd058b484506bae1a6e06bc8f335b1809a9eafb7024304a83
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-campaigns.md
    snapshot_sha256: a3e73cf610800affd058b484506bae1a6e06bc8f335b1809a9eafb7024304a83
    entry_key: 076a0cfb7aed7acd5f5585abaa9c13acbf3c0dcb33d54e50b63eeb5cd3bda951
  - object_id: BSIG-GEO-C2
    record_type: business_signal
    object_version: 1.0.0
    object_path: cycles/m6/analytics/bsig-geo-c2.md
    content_sha256: 2c1327c1293d94e47fed4fb3502e2ba54e0201149f847835b4027e6d9c6e00dc
    file_sha256: a0ab899e7a3e17c8a372a2c81f905217fc4cb2ce783f97dfcf716e533aa77a0c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m6/analytics/bsig-geo-c2.md
    snapshot_sha256: a0ab899e7a3e17c8a372a2c81f905217fc4cb2ce783f97dfcf716e533aa77a0c
    entry_key: 088ece9454a21d76e031712baa0d9757b68d61938de41aa8a20d92fae42f769a
  - object_id: SMP-GEO-C2-AFTER-Q6-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: b2bf3dc343fe89eac5dc061fb0e554cd7b254de73d60eaf7de2e9faef4e4e77f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-gemini-1.md
    snapshot_sha256: b2bf3dc343fe89eac5dc061fb0e554cd7b254de73d60eaf7de2e9faef4e4e77f
    entry_key: 09043fbb5b5fc1434e253a73515763ab5c5a14bc969467a9d9b671a184bf0755
  - object_id: SMP-GEO-C2-BASE-Q5-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 363783789dce0c394b966358116d473a237caf5d96f3f2d87d389dce908e2db9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-google-ai-1.md
    snapshot_sha256: 363783789dce0c394b966358116d473a237caf5d96f3f2d87d389dce908e2db9
    entry_key: 09216262114f92c7a053d54c6b1b40858e003503c26c05428669b522a6fb4ab1
  - object_id: AGG-GEO-C2-AFTER-Q1-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q1-claude.md
    content_sha256: a728336d45072315bd106f7e832cfa90feeef6607075680fae554082bc03ef6c
    file_sha256: 76b305009501feb583bb075354d8d85cdb8facd2fdc432722f7628634786724c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q1-claude.md
    snapshot_sha256: 76b305009501feb583bb075354d8d85cdb8facd2fdc432722f7628634786724c
    entry_key: 098342b67b56714620a6a8195fded2e021a084057ba8b37e15136f92d7c6591a
  - object_id: SRC-GEO-E2E-POSITIONING
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-positioning.md
    content_sha256: 53595091ce44ad6dc2ea2ec1d5aa0d30060cb6c52f98d80e35ac628b2bf6d8c1
    file_sha256: d6955af4ad0dc59320933f29430d2ea1497f1bb6cf64b0bf91641dc95c9bf40c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-positioning.md
    snapshot_sha256: d6955af4ad0dc59320933f29430d2ea1497f1bb6cf64b0bf91641dc95c9bf40c
    entry_key: 09cbc5ccefeb2d5b947fd9315b2333dbbaf3087780cab57db878e8fab9f03622
  - object_id: ARV-GEO-C2-AFTER-Q5-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-perplexity-1-reviewed.md
    content_sha256: bfbc298aacc3261325a84f624175bbae98bc51e5c02f55fe2dc212b7568fb7c6
    file_sha256: 82dca6863e1096f5a15fc19bfaf2372a541b6d480a82a1ea47d69585701b687b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-perplexity-1-reviewed.md
    snapshot_sha256: 82dca6863e1096f5a15fc19bfaf2372a541b6d480a82a1ea47d69585701b687b
    entry_key: 0a599cea358547da1b6024fab679a923bff17c8d84dc9fc1d79aaf782bed8062
  - object_id: SRC-QINPUT-C247D5A12766731ADE4B
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-qinput-c247d5a12766731ade4b.md
    content_sha256: 3cb19a045fc2ae27f489a396a71ebe48b63f92cc8d57053de16ed2fce8f97362
    file_sha256: 458b5f0c4f0a6d7af6b490c1508327d8e8719bdc83955919e29419cb628b6b84
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-qinput-c247d5a12766731ade4b.md
    snapshot_sha256: 458b5f0c4f0a6d7af6b490c1508327d8e8719bdc83955919e29419cb628b6b84
    entry_key: 0a7a3dacc522f4bacbe71b7950e4f6ef022689bf6591fb4d28f5449c64fdb80b
  - object_id: SMP-GEO-C2-BASE-Q2-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: c4a4a5edd63354be5953fd12d65156c8c3f4cbcaf9566963f49a37206c785a4d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-google-ai-2.md
    snapshot_sha256: c4a4a5edd63354be5953fd12d65156c8c3f4cbcaf9566963f49a37206c785a4d
    entry_key: 0a92c5ad488de600d3d2babf9c66d6e0e0dc848fbb9ea8d48bd2656cb3763fd2
  - object_id: AGG-GEO-C2-AFTER-Q3-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q3-google-ai.md
    content_sha256: 739b2590b46439d0f38ff6afa203bfa9ead33053f8ae6b47567c3fd70471b7f4
    file_sha256: 725ce6332bedf991201a7086c0f6e9ad2bbbd579a3d1a8f0d13c1b3bd6273f2a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q3-google-ai.md
    snapshot_sha256: 725ce6332bedf991201a7086c0f6e9ad2bbbd579a3d1a8f0d13c1b3bd6273f2a
    entry_key: 0ac9ea78b3da5f44b5c68f548b5006ee494bf351f33a22c9b836eb21035e90b0
  - object_id: ARV-GEO-C2-AFTER-Q5-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-chatgpt-1-reviewed.md
    content_sha256: 0c838585f35ba499420cad18feaa3b1f165b471c459ccd7154a4e66ea762bad7
    file_sha256: 9f7f043e9075938820e3c22f8ad3227ecedda61528e0abc0823ae5f551ccbcf8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-chatgpt-1-reviewed.md
    snapshot_sha256: 9f7f043e9075938820e3c22f8ad3227ecedda61528e0abc0823ae5f551ccbcf8
    entry_key: 0b8fb0b28a28a24a28998d2ec6d5960c95180568256e6862b49992477dbed5bc
  - object_id: ARV-GEO-C2-AFTER-Q1-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-google-ai-2-reviewed.md
    content_sha256: 420bc23d3b2261c8079d94770243217daee3d5285af48f0c336bc153076256c6
    file_sha256: 8f08106e7949222a9388ad3452e3a5b47432e97f5ad3a22bd495743aa583dad5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-google-ai-2-reviewed.md
    snapshot_sha256: 8f08106e7949222a9388ad3452e3a5b47432e97f5ad3a22bd495743aa583dad5
    entry_key: 0cbb1b764b0831694c98d813520a728775c5c60cfa43d5bff39e7410a8078fa2
  - object_id: PUB-GEO-C2-OWN-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c2-own-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: b082099c6aaa7076c3e81c4a269e10eb41dea45b5b9c5bbd3ff7febd8ee64fc4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/publications/pub-geo-c2-own-v2-confirmed.md
    snapshot_sha256: b082099c6aaa7076c3e81c4a269e10eb41dea45b5b9c5bbd3ff7febd8ee64fc4
    entry_key: 0db0db083d4ca84f14f970bb13b7a388c7d9f3f0651f735d6f7c6638961fa403
  - object_id: ARV-GEO-C2-AFTER-Q2-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-google-ai-1-reviewed.md
    content_sha256: 7d63a9968a8ff7f2dfcf468a948dbe7a3fcde1571fb6f4a9c7adf49284e48b25
    file_sha256: 3c1a10ba5b4aab23f002f48851bedaaf702e61542fb9329dec73ce34183a979f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-google-ai-1-reviewed.md
    snapshot_sha256: 3c1a10ba5b4aab23f002f48851bedaaf702e61542fb9329dec73ce34183a979f
    entry_key: 0dbda1ff49fb8e4e03156f3baf92ee7ea08e502f0fc0786efdc1ce2419b70454
  - object_id: AGG-GEO-C2-BASE-Q6-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q6-chatgpt.md
    content_sha256: 45ee053aa38a5bbf0d036740aa1807442da54467916cbbad0639b4bdc99fd14a
    file_sha256: b18e984b956f2a411968376a428a07c77335088515e5300c0619aacb2d1f6029
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q6-chatgpt.md
    snapshot_sha256: b18e984b956f2a411968376a428a07c77335088515e5300c0619aacb2d1f6029
    entry_key: 0ec28e74652124f71a63858dd55bffa574aa0fc6d4a5497980f65ddcf2866319
  - object_id: AGG-GEO-C2-AFTER-Q4-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q4-chatgpt.md
    content_sha256: 19a534f8c483a0265d77e8e8278530bfc431ecea59974a7615a925a0faed4d80
    file_sha256: 045c5065fd537e6ce105650e7ed4ffbc3db9a19fc86f4913119a02e123213a3b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q4-chatgpt.md
    snapshot_sha256: 045c5065fd537e6ce105650e7ed4ffbc3db9a19fc86f4913119a02e123213a3b
    entry_key: 10b29ce24bc25d86b3b8c5120dd2aa4659737e007ad60b9d0f251159dfa6c74a
  - object_id: SMP-GEO-C2-BASE-Q5-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 08a7174f14ed58410f298c176ce391b2de3cce782ebe4bc52e265a293c4588b0
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-perplexity-2.md
    snapshot_sha256: 08a7174f14ed58410f298c176ce391b2de3cce782ebe4bc52e265a293c4588b0
    entry_key: 110990a07009a599e01eb0b167d5b8c1dd125920ae5105770c8fbb6c750e3373
  - object_id: ARV-GEO-C2-AFTER-Q1-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-claude-2-reviewed.md
    content_sha256: ea1ab2e45f8270c72ef0c7c550fa7455fb588451240641d24364eb85e516c148
    file_sha256: e1974d046270d7b686ca7a22008185d5047577ef75d948afd18f0b8dc61e5d07
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-claude-2-reviewed.md
    snapshot_sha256: e1974d046270d7b686ca7a22008185d5047577ef75d948afd18f0b8dc61e5d07
    entry_key: 111135bce7dee6eaf5389185a93bb1db7b22a0e19de8ff652553aac91aef47fa
  - object_id: SMP-GEO-C2-BASE-Q6-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1dcdb2e79399b6a62d33523cbfaac7070f8b8db88d1808c48c23391affa3c17b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-chatgpt-1.md
    snapshot_sha256: 1dcdb2e79399b6a62d33523cbfaac7070f8b8db88d1808c48c23391affa3c17b
    entry_key: 112cd14803fe4011e0c7b5e75f0adb55519b54307c716751eb3b9cce94a4162a
  - object_id: ARV-GEO-C2-BASE-Q2-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-perplexity-2-reviewed.md
    content_sha256: e04ac03bbb17d0ffedc7b805be2198b512e844204acda78a91872e7687f9aa8d
    file_sha256: 3aa6da8d2f4b14d3f4d5a56108a7452457004c91d253e65d3148076a70ee342e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-perplexity-2-reviewed.md
    snapshot_sha256: 3aa6da8d2f4b14d3f4d5a56108a7452457004c91d253e65d3148076a70ee342e
    entry_key: 122fcf720659928eb223cd9c481855992309aa519c2f76d1b7beef24e8de8d9c
  - object_id: AGG-GEO-C2-AFTER-Q4-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q4-perplexity.md
    content_sha256: af6418d3ce160bc2e3be0b077f64e060d3d018dda024d0a3d5727e580db19e99
    file_sha256: 3e4dc82158223c59c2b5aad410df1a42411ae6007523a0985b5c20afe7e2dda2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q4-perplexity.md
    snapshot_sha256: 3e4dc82158223c59c2b5aad410df1a42411ae6007523a0985b5c20afe7e2dda2
    entry_key: 12654c83741a1dbdbb57678890fac0fcf25fe69fc2dd43013863cc9920f8aa58
  - object_id: SMP-GEO-C2-AFTER-Q6-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 07e3e4c930e79b87c89846522bc084fe5072bd7d17ecfb26f2e9a30cda4fc7e9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-google-ai-1.md
    snapshot_sha256: 07e3e4c930e79b87c89846522bc084fe5072bd7d17ecfb26f2e9a30cda4fc7e9
    entry_key: 12772920dbe32e0202bf4b21fa504b1f787d24632c821d1895051a6f7123e760
  - object_id: AGG-GEO-C2-AFTER-Q3-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q3-perplexity.md
    content_sha256: 52c190d7a20573cebfc19794b05db6e44a498794fdc0c2571935c8fc014ed85b
    file_sha256: 329e8a9ad32caae3b1ed9df02936723b0711e40cb73614bf0578bbfe78542250
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q3-perplexity.md
    snapshot_sha256: 329e8a9ad32caae3b1ed9df02936723b0711e40cb73614bf0578bbfe78542250
    entry_key: 135ea76d5775ecfa99ba0e905beb82d5f3c448e94778d016bef34b675b2ced24
  - object_id: SMP-GEO-C2-AFTER-Q5-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 01b24df9a95412466767b9b53fcc065a66c296aeb40023245088bcbe290e5ae3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-google-ai-2.md
    snapshot_sha256: 01b24df9a95412466767b9b53fcc065a66c296aeb40023245088bcbe290e5ae3
    entry_key: 136accfcbb682af872101dc67e90d8b917478e0f652485d70a83c38a280830ab
  - object_id: ARV-GEO-C2-BASE-Q6-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-gemini-1-reviewed.md
    content_sha256: 445314d6aaaa6f1e7988c4007ccbde094758b0b55a3e332254e4e04dba48ed50
    file_sha256: 180e11305f533c2c9996e2bb04580526c921625226c3203ad7e5a987b6116f88
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-gemini-1-reviewed.md
    snapshot_sha256: 180e11305f533c2c9996e2bb04580526c921625226c3203ad7e5a987b6116f88
    entry_key: 14089da3df5c2c7d4c0ada008fcd3ccb3bc3dda8f599dcc8e64d59d5e3897605
  - object_id: ARV-GEO-C2-AFTER-Q1-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-google-ai-1-reviewed.md
    content_sha256: de819d44745a8692646fb1790d49812359d18befe7d3a5ee1a0669b4b73c7a4d
    file_sha256: 79fade8ac3dab2eda4ccc56d1cce6b2b2e711c070f2b08bf693b173182130726
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-google-ai-1-reviewed.md
    snapshot_sha256: 79fade8ac3dab2eda4ccc56d1cce6b2b2e711c070f2b08bf693b173182130726
    entry_key: 146662daa3bc1482e539b57f48118e281e6d5c9f400856c6d9f36ee1c6468399
  - object_id: SMP-GEO-C2-AFTER-Q2-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 6c9259a58e45aa9476b6e4ded24550a3ba18bcc14c5043ac7ff005078ce6e839
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-google-ai-2.md
    snapshot_sha256: 6c9259a58e45aa9476b6e4ded24550a3ba18bcc14c5043ac7ff005078ce6e839
    entry_key: 1535bdafd6d0a18588a3d6c0ae52a1139f06dc77822f388ddbf726c626127183
  - object_id: ARV-GEO-C2-BASE-Q1-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-perplexity-1-reviewed.md
    content_sha256: 67b47a65e6f2da95eae261bdffa58169308d903bff1bb8560c82cd2f564df147
    file_sha256: 371d874760eca19a7d9c8ef0e9e94ff9aacdb6dff5a89a08e0f598466cfa0a53
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-perplexity-1-reviewed.md
    snapshot_sha256: 371d874760eca19a7d9c8ef0e9e94ff9aacdb6dff5a89a08e0f598466cfa0a53
    entry_key: 16752bb3a66cb00cd37167e2bd4e23db39840873c8ba4660edc9979eac96091c
  - object_id: CLM-GEO-E2E-FEES
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-fees.md
    content_sha256: 6e0610ad7c6ea19a5143bad7b2167bddf28ecfc8e49ee460f16fd33060260812
    file_sha256: 28de7011440d1b48ca55bc8b85d682d86f15d404cd07e1d4f655b81daba3ae92
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-fees.md
    snapshot_sha256: 28de7011440d1b48ca55bc8b85d682d86f15d404cd07e1d4f655b81daba3ae92
    entry_key: 177aeb5e8506500bfc32dd450415d7a4186312f4d2cf3b6dae448920a757b1d6
  - object_id: SMP-GEO-C2-AFTER-Q1-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4865b2725c7355ff42f7aa4923c34dc55b6738d528b3897bdf6d9b834aa8ed08
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-gemini-2.md
    snapshot_sha256: 4865b2725c7355ff42f7aa4923c34dc55b6738d528b3897bdf6d9b834aa8ed08
    entry_key: 179de33ea36a4239ee7882c47aa1d6eaa76c67807cba2dcece95773b7775db8b
  - object_id: AGG-GEO-C2-AFTER-Q5-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q5-chatgpt.md
    content_sha256: d60a8cf5d12ad91d25527c9589dc7ed5ae8100a581eb2028eda59c3a18f229d0
    file_sha256: 434b3790499cb0641da6eeccb370e09860049dce41a98b9de42631ad65da45a0
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q5-chatgpt.md
    snapshot_sha256: 434b3790499cb0641da6eeccb370e09860049dce41a98b9de42631ad65da45a0
    entry_key: 17ef009a82ff6857c27eb8e73a7e452577d0ad74ba296f8ea8ae2bea3d9b22a8
  - object_id: AGG-GEO-C2-BASE-Q1-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q1-gemini.md
    content_sha256: a27daf600b9decad4759187ea77392f099fe4d79a6c46ad61a276169e191ec66
    file_sha256: e8a9c43dedf7515fd1df520d00e6cf189cd23d860a5e154c2eed2e8902a52fed
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q1-gemini.md
    snapshot_sha256: e8a9c43dedf7515fd1df520d00e6cf189cd23d860a5e154c2eed2e8902a52fed
    entry_key: 18a72363a62bda3f5dee2947fcdf40e0cb54fcd95ca8abbe0f6437d3ea834dd1
  - object_id: EVD-GEO-E2E-POSITIONING
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-positioning.md
    content_sha256: 53595091ce44ad6dc2ea2ec1d5aa0d30060cb6c52f98d80e35ac628b2bf6d8c1
    file_sha256: e747b4a3c44221730551b54d92c5bba438f11357e00a24593521e8d3dd3796ae
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-positioning.md
    snapshot_sha256: e747b4a3c44221730551b54d92c5bba438f11357e00a24593521e8d3dd3796ae
    entry_key: 1900f4175fbd96d383c962f23c14a76605b4bb1938e437268f0f32b9d6329c60
  - object_id: CLM-GEO-E2E-POSITIONING
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-positioning.md
    content_sha256: 53595091ce44ad6dc2ea2ec1d5aa0d30060cb6c52f98d80e35ac628b2bf6d8c1
    file_sha256: 960d556fca4cec10a37d2e9fa4cba818ef6d287a3dc2214a0bd9fe9438b5c51d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-positioning.md
    snapshot_sha256: 960d556fca4cec10a37d2e9fa4cba818ef6d287a3dc2214a0bd9fe9438b5c51d
    entry_key: 190f99146f919602531452b7199315890b92668ab6403ab77d62f0c0fae7f646
  - object_id: SMP-GEO-C2-AFTER-Q4-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: c2eca4a36a555d2c988034577b6d4a40cffdd9caeb5ca46b18ef130a1badecf1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-gemini-1.md
    snapshot_sha256: c2eca4a36a555d2c988034577b6d4a40cffdd9caeb5ca46b18ef130a1badecf1
    entry_key: 192d6e7b5accbf6064893c299bf07bcd15911a141ea6c46a18e1b3b4a8cc4170
  - object_id: ARV-GEO-C2-AFTER-Q2-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-claude-1-reviewed.md
    content_sha256: 5b8933dde25b65fd2830d0658590a419e5187eacf9e11e1be7b5ea362410091e
    file_sha256: 8ec0e573caedf5f017bc48504603a1bc54287fd9a6fe056499c258780f45f8b5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-claude-1-reviewed.md
    snapshot_sha256: 8ec0e573caedf5f017bc48504603a1bc54287fd9a6fe056499c258780f45f8b5
    entry_key: 197fcde4992fec9646b269c0ed6fbbd9cdea0b0e53871aa6f5d6eacab9900946
  - object_id: CPF-GEO-E2E-C2-BASE-CHATGPT
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c2-base-chatgpt.md
    content_sha256: 2c38d43b7b12aa1d6fe5912013b5033f50806710895c0113d404223ab83ca262
    file_sha256: 0faac05827b72032a80af6d4dad2bb564a7bbc7dade0b17ec97626d9a8f4a445
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c2-base-chatgpt.md
    snapshot_sha256: 0faac05827b72032a80af6d4dad2bb564a7bbc7dade0b17ec97626d9a8f4a445
    entry_key: 1a5d6342fd7b20e34b932c7723fc911b164aa48370a6c789993e76dc575645d1
  - object_id: AGG-GEO-C2-BASE-Q5-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q5-perplexity.md
    content_sha256: dbff1fe93af8f40dac52ffe55257101752b744f726bfc291f3e265625e04ce5c
    file_sha256: 4909fdad81716f84153403cc0ddda6ef527a8c85618fb2d33f39e2b99046a326
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q5-perplexity.md
    snapshot_sha256: 4909fdad81716f84153403cc0ddda6ef527a8c85618fb2d33f39e2b99046a326
    entry_key: 1a81afc0fdf81f06e5049bf6386df9c7560f3ef3e1a2ba2edc9b0537e1fcb0b7
  - object_id: ARV-GEO-C2-BASE-Q5-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-google-ai-2-reviewed.md
    content_sha256: f421032dd63dc3d3f54dde89ebc41607c67b817918ac9b1cfe9201167325520b
    file_sha256: 263785006e87222ff218d7846dc2da3c1d123c8499d8ea4e3cb8718464f3e3ef
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-google-ai-2-reviewed.md
    snapshot_sha256: 263785006e87222ff218d7846dc2da3c1d123c8499d8ea4e3cb8718464f3e3ef
    entry_key: 1ab6a36cb41b551d4bfd9ce008b697c8de0946f64e0498972afb2498b79d88b1
  - object_id: DOC-GEO-E2E-LEGACY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-legacy.md
    content_sha256: db91c92b56d933a08d874c9de3cbb6b8d30668f810b153bf0285b738437b9de7
    file_sha256: b7aa20e3fcdb74c85feb598381dfc147fc5d5f762a8792cb649b11cb636b3e8b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-legacy.md
    snapshot_sha256: b7aa20e3fcdb74c85feb598381dfc147fc5d5f762a8792cb649b11cb636b3e8b
    entry_key: 1af8d389764749b96e6f4fc317f5459ce8cbab8e7f79c17ae31a579a7bc8884b
  - object_id: SMP-GEO-C2-BASE-Q1-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f310ae8bbad927de3349675844e41f89161f00b47bbc107779ae7c535ef9d5de
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-google-ai-1.md
    snapshot_sha256: f310ae8bbad927de3349675844e41f89161f00b47bbc107779ae7c535ef9d5de
    entry_key: 1bea7cd506d4f156d824629f4a2adb332b8e995e9f9e456b679b531ecb3fd162
  - object_id: SMP-GEO-C2-BASE-Q1-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4b2114eed38e2c255d05227e2703f05b7d0657c37c8a0b660930bf9c8cb6529b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-claude-2.md
    snapshot_sha256: 4b2114eed38e2c255d05227e2703f05b7d0657c37c8a0b660930bf9c8cb6529b
    entry_key: 1c732de450fb08b43fd52a60474952f5213a26d942768b41f45ccdfc2af20344
  - object_id: SRC-GEO-E2E-LEGACY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-legacy.md
    content_sha256: 115347126b40e11f3aaa82b2cf9b793751c02bc82808fd3984c6c1b257bed8d8
    file_sha256: 80a77b275ad7cbe00829521ec5a42f78579ecbe6c713682c512dd0e3b87855b3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-legacy.md
    snapshot_sha256: 80a77b275ad7cbe00829521ec5a42f78579ecbe6c713682c512dd0e3b87855b3
    entry_key: 1c7b72b8163899efe62d1a00f0872048ec3b56e63e4173fffac1b337119da10f
  - object_id: ARV-GEO-C2-BASE-Q6-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-chatgpt-2-reviewed.md
    content_sha256: 78e1320c0ac18270b4cc6cdedfa37f937eb3e38d44bb8ff65d5d6deb9653b527
    file_sha256: 17020d95a3df9a8d4e3335d9ef3bf6cb3c4916a38eb873e65dfe99d7a2739a95
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-chatgpt-2-reviewed.md
    snapshot_sha256: 17020d95a3df9a8d4e3335d9ef3bf6cb3c4916a38eb873e65dfe99d7a2739a95
    entry_key: 1cb5d57d83ab92549c173cb959aa5f0533c5b2b656b2de8c0d2dcfd72699d873
  - object_id: ARV-GEO-C2-AFTER-Q2-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-chatgpt-2-reviewed.md
    content_sha256: dd7e3198d3f8fdfbbe05a26d40736edbcf7d226cb86c952d4d9cb326dfd172aa
    file_sha256: aca022f92aec58f06b8bea355e9f077b4a06460f0f58009eb25eb2dd791c9034
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-chatgpt-2-reviewed.md
    snapshot_sha256: aca022f92aec58f06b8bea355e9f077b4a06460f0f58009eb25eb2dd791c9034
    entry_key: 1dbb35ae3f81eb9872b20fca662264589334d84a1fd8da547441d62012f7e2a0
  - object_id: SMP-GEO-C2-BASE-Q2-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 274476236413ad372d12c318a5bf544c5f0fd4b8fd253adff1477f81a04c2c87
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-perplexity-2.md
    snapshot_sha256: 274476236413ad372d12c318a5bf544c5f0fd4b8fd253adff1477f81a04c2c87
    entry_key: 1e62656097ad93a7c9139661b2a8a328c9ecca713ec8a59c783025f669563a02
  - object_id: SMP-GEO-C2-BASE-Q1-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: b0bf9c728eda00cc53b8b0af449ae7991c8a46aae0617c873f7a261c6a437817
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-gemini-1.md
    snapshot_sha256: b0bf9c728eda00cc53b8b0af449ae7991c8a46aae0617c873f7a261c6a437817
    entry_key: 1e6f883f3c2fc23945ba625d9f3d651180941af5a2cf39da2a1be72551ccbb80
  - object_id: SMP-GEO-C2-AFTER-Q4-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: cf38f84a57516e57c1bbb51f47f275b11f9beeac9968c0efaea8efcfd2ce2809
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-perplexity-2.md
    snapshot_sha256: cf38f84a57516e57c1bbb51f47f275b11f9beeac9968c0efaea8efcfd2ce2809
    entry_key: 201e8ae9d6f266d85ffcfb5ded955e1127d719fe2af69ff7f9a9f9c79fa0c53e
  - object_id: SMP-GEO-C2-BASE-Q4-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: dbc2f386540d292417e7325cef40b5e9e93a912ed3cf3c4e3e361c868503209a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-gemini-2.md
    snapshot_sha256: dbc2f386540d292417e7325cef40b5e9e93a912ed3cf3c4e3e361c868503209a
    entry_key: 21c2f716b111b488ff1d608c027b7fc60e586c34f23da5d517def20414b43f6e
  - object_id: ARV-GEO-C2-BASE-Q2-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-google-ai-2-reviewed.md
    content_sha256: 5cea086e5446e123730aad3478754ef8268dc6422c4a30e0990903531c33d57d
    file_sha256: eaf5dbb2748ac5a6ce6c171c38d16d3638fec25048327e63147aae2a63cc4517
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-google-ai-2-reviewed.md
    snapshot_sha256: eaf5dbb2748ac5a6ce6c171c38d16d3638fec25048327e63147aae2a63cc4517
    entry_key: 2248ef27d41bfe423927eb37a1f716e4d43c357d9cb9effd8e9b8017d98538b5
  - object_id: SRC-GEO-E2E-ELIGIBILITY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-eligibility.md
    content_sha256: 8ae668b4bb38e19fcc1a10d7ef63231fce19387bea31feb72120f8ec27d0d9f5
    file_sha256: 3836bce6852c161caba5a0702480f49373b8adc2c5888d0aba2c7fe2967bb375
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-eligibility.md
    snapshot_sha256: 3836bce6852c161caba5a0702480f49373b8adc2c5888d0aba2c7fe2967bb375
    entry_key: 228d8dc36e0372a72b78ec2efc1ebd5dd472ecabf083e724efad1a823f779630
  - object_id: SMP-GEO-C2-AFTER-Q5-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 0949142274a6c40aa8a5ab66c5b015473756b58be0ab8ec87f742a3638a6e74f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-perplexity-1.md
    snapshot_sha256: 0949142274a6c40aa8a5ab66c5b015473756b58be0ab8ec87f742a3638a6e74f
    entry_key: 23211b8d630ba1e76a7659e26ed2ce8a0b1b2a5e9ee5f741e231f040c7e52d0f
  - object_id: ARV-GEO-C2-AFTER-Q6-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-perplexity-1-reviewed.md
    content_sha256: 7512cda5e55b1c22adc1edecad8083373c120aef5a7abdfdab1b6e469a770ead
    file_sha256: 1d47c148ee214b466d8952b3f44e55ab99b8d58eebd2e2d876d0f3b876824466
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-perplexity-1-reviewed.md
    snapshot_sha256: 1d47c148ee214b466d8952b3f44e55ab99b8d58eebd2e2d876d0f3b876824466
    entry_key: 266394df7be26d95a7195e6c3bd098ed27d85d5e28ac698576bc08b83c198755
  - object_id: AGG-GEO-C2-AFTER-Q2-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q2-gemini.md
    content_sha256: 499f245f0797e8d8b68206638188ad7c0653ba6e4c3f1adfb3bfe6233a4d214c
    file_sha256: 21feba2805fb6adcdba698657ccc1cbfc36f4951e113ecd78fa273bf8f9ca949
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q2-gemini.md
    snapshot_sha256: 21feba2805fb6adcdba698657ccc1cbfc36f4951e113ecd78fa273bf8f9ca949
    entry_key: 26eb54b6f3960368c005375a9bd1363ad72a19fd87a115902e079e82e0bfbade
  - object_id: ARV-GEO-C2-BASE-Q5-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-google-ai-1-reviewed.md
    content_sha256: 19232c6471a4fd06a8214779b2f9a1406349e25fd59487a7bdf486a32725db4b
    file_sha256: 7161da06cd699feee1b4691503d828d8d5338b087f028ae1a509920ae6a4ddc7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-google-ai-1-reviewed.md
    snapshot_sha256: 7161da06cd699feee1b4691503d828d8d5338b087f028ae1a509920ae6a4ddc7
    entry_key: 27799f22df770e506dea81e9e8100bc26faf658d767ed5470fde03c625ee7039
  - object_id: SMP-GEO-C2-AFTER-Q1-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8f4c16e9aaa0d03e8e0c710122d1ce79c36a9c16572f74e27b1c1c5ad2149a21
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-claude-2.md
    snapshot_sha256: 8f4c16e9aaa0d03e8e0c710122d1ce79c36a9c16572f74e27b1c1c5ad2149a21
    entry_key: 2779f1f509c89b788194a60e6e948423809d695422e4511b0f5a5d1783b25a24
  - object_id: ADR-GEO-C2-OFFICIAL-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c2-official-decided.md
    content_sha256: 78c7abebdf53b2231049fd54193f3ba0a10ea10289042a89267d911e4a3d79a9
    file_sha256: 544632ae36effef78afad45f922f9c19247c24e92ec1c8feeb172d4b9c235a84
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/adoptions/adr-geo-c2-official-decided.md
    snapshot_sha256: 544632ae36effef78afad45f922f9c19247c24e92ec1c8feeb172d4b9c235a84
    entry_key: 27bab30623e9e55e494de7e15ad7b52a3e9375f02f056bd4c8620f2c8cc62ea9
  - object_id: ARV-GEO-C2-AFTER-Q3-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-claude-1-reviewed.md
    content_sha256: e37a6f100bd08480d20e7c5c0be2f88d868c69d76a81b7f6ea3b2d43d6829e73
    file_sha256: bfe7943c7ff7a249978d10ffe9addf81c88b76499de477a4a2e91417fdc1d6af
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-claude-1-reviewed.md
    snapshot_sha256: bfe7943c7ff7a249978d10ffe9addf81c88b76499de477a4a2e91417fdc1d6af
    entry_key: 2838d475fbc1f754cd42ae419a171c5692c106aef3578e4a52f383d72a56c3f2
  - object_id: SMP-GEO-C2-AFTER-Q5-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4e39c370b7959cd8256503e0bf88c2814a6b84edcf4e657fb440591f10655213
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-chatgpt-2.md
    snapshot_sha256: 4e39c370b7959cd8256503e0bf88c2814a6b84edcf4e657fb440591f10655213
    entry_key: 284ace1374591e5cffc4082271de5fdb88fb36a3175b8399af8624327f348e09
  - object_id: SRC-GEO-SITE-C1-THIRD-PARTY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-geo-site-c1-third-party.md
    content_sha256: 655624dbd4677d255e60241f6c1fbde3d877de7da3f666f156340636f456ea5d
    file_sha256: 935a8eb56d02b5dd39aedf1a8d963f65067f6b5d094cb21855f3ea1eec327f39
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-geo-site-c1-third-party.md
    snapshot_sha256: 935a8eb56d02b5dd39aedf1a8d963f65067f6b5d094cb21855f3ea1eec327f39
    entry_key: 2886f6b015b6b0ca2ba8473d201701fac4cd588986e71e52a78a4b7ec71fcd92
  - object_id: SMP-GEO-C2-BASE-Q2-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: a02c33074f85fa092707b9046f7546904c8f736d533a14b9e0e02148d161c19c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-chatgpt-1.md
    snapshot_sha256: a02c33074f85fa092707b9046f7546904c8f736d533a14b9e0e02148d161c19c
    entry_key: 297d40e2adeedbec45efd495d719e86be36b20c2095aa5d20ebdc31bef767992
  - object_id: CPF-GEO-E2E-C2-BASE-PERPLEXITY
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c2-base-perplexity.md
    content_sha256: edb7a49614af42eccd27496ea6033810e0363e7265fcf13a577ad357680b7a5e
    file_sha256: 4b0b0e4c5af7d0a90d784bb9e261262e36b2ab230bcc3a9f0d0eed25fe55b2f1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c2-base-perplexity.md
    snapshot_sha256: 4b0b0e4c5af7d0a90d784bb9e261262e36b2ab230bcc3a9f0d0eed25fe55b2f1
    entry_key: 2a9251a78af7b938cbe710e4b77a526f34668e0664a0a215350dfdbbb52be36c
  - object_id: SMP-GEO-C2-BASE-Q3-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 3f8565f2a8a2ed35c2061be71770697d8292001c81593c837956c8d66a68611e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-gemini-2.md
    snapshot_sha256: 3f8565f2a8a2ed35c2061be71770697d8292001c81593c837956c8d66a68611e
    entry_key: 2aa1f68d111413fd4b79dad550bd1193bbd0030759178877ab598a517f61dc12
  - object_id: AGG-GEO-C2-BASE-Q1-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q1-claude.md
    content_sha256: 0b864a1843a73f9aeeb3fff2a30ecf802b7fccc9867171f8bbb391e249c04e08
    file_sha256: a8dd30a6a6bb4b1ae33df382c90c30b6f2feb79ac565d13db6581501c7d448de
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q1-claude.md
    snapshot_sha256: a8dd30a6a6bb4b1ae33df382c90c30b6f2feb79ac565d13db6581501c7d448de
    entry_key: 2aa9bff5fe383908fe7856a6b292e657da8d54f58f16972e13103fa7617f52d5
  - object_id: SRC-GEO-E2E-CASE
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-case.md
    content_sha256: 9cddd8a4732579c1ea633d2c66b028f8d72aeb6f15123fc3543b52cbf17e1df7
    file_sha256: 3235db7d86791a1003cd700710895c7b3fb944db1f6762bcc40b9c5af302cc65
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-case.md
    snapshot_sha256: 3235db7d86791a1003cd700710895c7b3fb944db1f6762bcc40b9c5af302cc65
    entry_key: 2b908b50cd42d5ecc07dc448b0e4b22bc3ae1678a4f1ee6e4d33beab79b97232
  - object_id: SMP-GEO-C2-BASE-Q3-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: aca94f25924262a86ff26987480a4f1a1e43d5657fce5389b75fa414879da87f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-gemini-1.md
    snapshot_sha256: aca94f25924262a86ff26987480a4f1a1e43d5657fce5389b75fa414879da87f
    entry_key: 2bda79edb95384031b4a31c4b07aaacc902841815b26e1b4e6c22898a9405761
  - object_id: AGG-GEO-C2-AFTER-Q2-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q2-claude.md
    content_sha256: 67a2c0cf10e29ab1192eb47a14106bb43b231d9cb07362520ab53543eb9072aa
    file_sha256: f416a141279eb7220de70d18ea990120424744cade50674acfb8ec2eb17f2175
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q2-claude.md
    snapshot_sha256: f416a141279eb7220de70d18ea990120424744cade50674acfb8ec2eb17f2175
    entry_key: 2c360e5dfec333de394708c527c52012b432cc740a205f30f2daf94c2ced8400
  - object_id: AGG-GEO-C2-AFTER-Q2-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q2-google-ai.md
    content_sha256: ba3438a8e334ed614487d9bcc18ac9d77e845e455bf855a35cd4bace03217076
    file_sha256: 8cb26b60e65dae151888c773119846c6244563dc803741145fa25e9e232d2549
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q2-google-ai.md
    snapshot_sha256: 8cb26b60e65dae151888c773119846c6244563dc803741145fa25e9e232d2549
    entry_key: 2d37689295403397f48af0e81f3dc3b8b3c3b6c149a8d546fcf89f3bc8ee478b
  - object_id: CLM-GEO-E2E-CASE
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-case.md
    content_sha256: 9cddd8a4732579c1ea633d2c66b028f8d72aeb6f15123fc3543b52cbf17e1df7
    file_sha256: df5dbdd400deaf7ed8a994700c3467639cf6e9e5178815e1672ed4633459620f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-case.md
    snapshot_sha256: df5dbdd400deaf7ed8a994700c3467639cf6e9e5178815e1672ed4633459620f
    entry_key: 2dabf7aedaeeb507ecd651ec9570bec4048c465022502cfad3030988e7ae5f68
  - object_id: SMP-GEO-C2-BASE-Q5-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 2d8a7c2a1d4b29f4908bf0528527191bc0fdbe55c9acb35351d2b73f83f376ca
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-chatgpt-2.md
    snapshot_sha256: 2d8a7c2a1d4b29f4908bf0528527191bc0fdbe55c9acb35351d2b73f83f376ca
    entry_key: 2dbda65fa9316a9d950cadb0dc3b3f9ea6457e31266b8269cb5930ffffb6b4e8
  - object_id: QS-GEO-E2E-C2
    record_type: query_set
    object_version: 1.0.0
    object_path: queries/sets/qs-geo-e2e-c2.md
    content_sha256: cfa47e85f7b5692881e7ec9f2f4e6551a6dd7014382211da4786a52ee8f25914
    file_sha256: 11a5cd60c171b53879065394bb5658c031fe18654b6ed3921ff111db8497daae
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/queries/sets/qs-geo-e2e-c2.md
    snapshot_sha256: 11a5cd60c171b53879065394bb5658c031fe18654b6ed3921ff111db8497daae
    entry_key: 2e4e1dbb9ededb81d69242348833b784bec903c8bdbf7d972cd09e7c567640d2
  - object_id: ARV-GEO-C2-AFTER-Q5-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-gemini-1-reviewed.md
    content_sha256: 455c27fac304c9504452d6bf89b6c7c91f5a5d163ab4ab30bec6e63dbf733178
    file_sha256: 3b9cf9ef46f0ad544d21d18edb5dc5a1552164efa18543b285493e952b4eee80
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-gemini-1-reviewed.md
    snapshot_sha256: 3b9cf9ef46f0ad544d21d18edb5dc5a1552164efa18543b285493e952b4eee80
    entry_key: 2ef8addf21b4dc99b0d23d6548155e3ad073c3d958d468d79cc2965249dd0030
  - object_id: DOC-GEO-E2E-FEES
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-fees.md
    content_sha256: 6f69e3de1b0410a5e174120dcba0127654e747d711ab3789419bf7a740b562aa
    file_sha256: 5bdfcd34d66c4357177f5489d53e2269475db20670489a6cb72ff75090e04e84
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-fees.md
    snapshot_sha256: 5bdfcd34d66c4357177f5489d53e2269475db20670489a6cb72ff75090e04e84
    entry_key: 2fcfbc505841bccd6172c706c2d76e4c16e82ee4ed3fc3b6db867eb887a04342
  - object_id: SMP-GEO-C2-BASE-Q2-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 33425a5d6212c990c774c868004b055b2f1a9f8efb6af2875024f2075d13c3f4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-gemini-1.md
    snapshot_sha256: 33425a5d6212c990c774c868004b055b2f1a9f8efb6af2875024f2075d13c3f4
    entry_key: 301f2294fcd722a3088435b82b52ba952da362c48ff3184b73175c5e22b6aa5f
  - object_id: SMP-GEO-C2-AFTER-Q2-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: ac83f2e76d2ed1950db309aba03a4fef3f21775402bd181b912ecc7adc179b69
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-perplexity-2.md
    snapshot_sha256: ac83f2e76d2ed1950db309aba03a4fef3f21775402bd181b912ecc7adc179b69
    entry_key: 31108516bee176e46187a6faab0520015a9339e0dd3f9ddf1a49fa639c17c833
  - object_id: ARV-GEO-C2-AFTER-Q3-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-chatgpt-1-reviewed.md
    content_sha256: 0b5f34fa48cee8cf11c2de290a8f70f5922707aabbf77a9e23f1371ee698005c
    file_sha256: 6f69d70ea511e9f78ce6951e760df210bb894d89848fb358a7f46a6c23c630f3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-chatgpt-1-reviewed.md
    snapshot_sha256: 6f69d70ea511e9f78ce6951e760df210bb894d89848fb358a7f46a6c23c630f3
    entry_key: 312bff077d5a351687a3309db5cb6c50ecb373e2b5eabea98195bf2e5c537494
  - object_id: ARV-GEO-C2-AFTER-Q5-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-claude-1-reviewed.md
    content_sha256: 4883d27c46f6bebc651c7f4574972e57727e7146ece9ba783402a11a5467bb82
    file_sha256: 2208b054b71ed6e1b86f5a4f6643f43cb16b5e674d360b724c401f93eaa212b7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-claude-1-reviewed.md
    snapshot_sha256: 2208b054b71ed6e1b86f5a4f6643f43cb16b5e674d360b724c401f93eaa212b7
    entry_key: 31bb74f06a725b7a7593565789aeef2dbc43c0b4ca18371311adf91ed85aabd5
  - object_id: DOC-GEO-E2E-VOICE
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-voice.md
    content_sha256: f2b26587bb6f73725e275c09fcdd3747a482c8369c0891d1600c9151316c9bb4
    file_sha256: ee357e82630bb369657c26bf2755621adaf1d635ba7c2fd6812eaddd2e56ee80
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-voice.md
    snapshot_sha256: ee357e82630bb369657c26bf2755621adaf1d635ba7c2fd6812eaddd2e56ee80
    entry_key: 31e3b8f5063498638f4b670430a3769dfcadd8cba40cd00638d4d8eb7462eb38
  - object_id: AGG-GEO-C2-BASE-Q4-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q4-chatgpt.md
    content_sha256: 21eb6671b3c030fa06a374b901fcd0c4b6a566af6519fedea314dcca5eaa0184
    file_sha256: 05280d8ed728448048c0bec95f4b8d3e56b6a5a11700041e0dfb181a0ab66930
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q4-chatgpt.md
    snapshot_sha256: 05280d8ed728448048c0bec95f4b8d3e56b6a5a11700041e0dfb181a0ab66930
    entry_key: 32232786e70ab8954b38ad0b62c5d88013478084290d83fa8b030fa10e0144e7
  - object_id: EVD-GEO-E2E-ELIGIBILITY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-eligibility.md
    content_sha256: 8ae668b4bb38e19fcc1a10d7ef63231fce19387bea31feb72120f8ec27d0d9f5
    file_sha256: 40b2138d425d41dbae491b74da88cd05329aecb040918569d44af74a6b251116
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-eligibility.md
    snapshot_sha256: 40b2138d425d41dbae491b74da88cd05329aecb040918569d44af74a6b251116
    entry_key: 323e7e8bbbae2354916bb5171f4cd05ebfb6864822a5b369b9dab66abc56c6fc
  - object_id: ARV-GEO-C2-BASE-Q5-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-chatgpt-2-reviewed.md
    content_sha256: e9ecc070c3279b26d591534b011e21d778ebdea6e48f978fb454c4f377c67ef3
    file_sha256: 1149372ed2444b8a9975524cd269bbb71f94ec7ed717d4b7969fc2d278008170
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-chatgpt-2-reviewed.md
    snapshot_sha256: 1149372ed2444b8a9975524cd269bbb71f94ec7ed717d4b7969fc2d278008170
    entry_key: 3299075549117e73c728e0210e7e7c008fb89534d455d25c0edd4f5e517fb3a9
  - object_id: SMP-GEO-C2-BASE-Q4-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 90cd384927bfce9f6c9807e98533daffc9a81c824fca269d462a321e889bceb4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-chatgpt-1.md
    snapshot_sha256: 90cd384927bfce9f6c9807e98533daffc9a81c824fca269d462a321e889bceb4
    entry_key: 334375a8aa495bafd3c7a2216cac1a8a0f44ee8a3b97c3809359b52f0ddf88e8
  - object_id: EVD-GEO-E2E-VOICE
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-voice.md
    content_sha256: 4572ad641758c23474309fd0917192b0a55daa34e6bc97c3b8ca3e18c2e67004
    file_sha256: b673aea570c80fafc2f6984248f3081816802d1a1cdef3d5de0a26a7c239ed62
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-voice.md
    snapshot_sha256: b673aea570c80fafc2f6984248f3081816802d1a1cdef3d5de0a26a7c239ed62
    entry_key: 334f4a80604dd95f705ef30f2ddf40bed490bccaa333922b6ba998250bcc926c
  - object_id: ARV-GEO-C2-BASE-Q6-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-google-ai-1-reviewed.md
    content_sha256: c97a4c7879d7b5d96640371900b234f98213d456438bc634f3fc2cf4e7084ef9
    file_sha256: d0232b8526f686067d980192de1af48d341526c431b092f864e6601a11f11a12
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-google-ai-1-reviewed.md
    snapshot_sha256: d0232b8526f686067d980192de1af48d341526c431b092f864e6601a11f11a12
    entry_key: 33eb3e83fe9075ed12a287f843d3a58cdb99a75bc1439ee870bd9f988bdbc5b0
  - object_id: CLM-GEO-E2E-LEGACY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-legacy.md
    content_sha256: 115347126b40e11f3aaa82b2cf9b793751c02bc82808fd3984c6c1b257bed8d8
    file_sha256: d211f82cd66363a55ec8092ffe6e3211f224aeaf726ecea0e3821a2959e85898
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-legacy.md
    snapshot_sha256: d211f82cd66363a55ec8092ffe6e3211f224aeaf726ecea0e3821a2959e85898
    entry_key: 3474709ad42f3cc7c300bf244277a4e955fc3eba0031dc6c0f1e05c8c833ac85
  - object_id: CLM-GEO-E2E-ONBOARDING
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-onboarding.md
    content_sha256: d6fd212806c92f8b1d294e5b0d5f0afaa052d13d205a6f413183bf3746d0c908
    file_sha256: 65481f6c93b58553439c50adf0fc0f406e81cc0409bd5c9ccef2032e7ddafeda
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-onboarding.md
    snapshot_sha256: 65481f6c93b58553439c50adf0fc0f406e81cc0409bd5c9ccef2032e7ddafeda
    entry_key: 3483c2d6f70cc089217324db8b8984a17ccaaf18fa04e42c8a04e580d70a9fc6
  - object_id: CLM-GEO-E2E-PRIVACY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-privacy.md
    content_sha256: 1f715fc357d9cad4ec3309c90babd8e66e0cca6207463f3f5915bed060fc7301
    file_sha256: 269e5d212c7bb1d73e8a9d67fa1781463344864bddd3f7817253c918db9616e9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-privacy.md
    snapshot_sha256: 269e5d212c7bb1d73e8a9d67fa1781463344864bddd3f7817253c918db9616e9
    entry_key: 36d1932bbd89720ff0e46cd9b3ad22170b62574c992ad63e42c65c8e0fda41a6
  - object_id: SMP-GEO-C2-AFTER-Q3-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 52c54b6b78d6ecd59b1ba58dad04f0ce8cbec2a397239e745482e02b13c544a9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-google-ai-1.md
    snapshot_sha256: 52c54b6b78d6ecd59b1ba58dad04f0ce8cbec2a397239e745482e02b13c544a9
    entry_key: 3744efd79ba4ede177ea3c2915ea57e9ed0b469a9265fc217266c7055d1728a4
  - object_id: SMP-GEO-C2-BASE-Q2-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 8df128f14f662fff36310f148d127efc46376b8bd1d57992301c5afa09d60d7b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-claude-1.md
    snapshot_sha256: 8df128f14f662fff36310f148d127efc46376b8bd1d57992301c5afa09d60d7b
    entry_key: 37a247769dc9e37d2712acf9f02fe36c9c72e485fc7868ac72142f856e88d662
  - object_id: ARV-GEO-C2-AFTER-Q6-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-chatgpt-1-reviewed.md
    content_sha256: bd4d9a94657782e15c5e1850dee33423804528c79589299187baf7076677e5bf
    file_sha256: 2cebc5e8dc7eb690ca3b12d9389a6d77724d4faf463266987c63a58f09ed7c6c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-chatgpt-1-reviewed.md
    snapshot_sha256: 2cebc5e8dc7eb690ca3b12d9389a6d77724d4faf463266987c63a58f09ed7c6c
    entry_key: 38dd8c5f3915b2320ec3da1fc4645b7d8cd600748a23574e1e32e4b2bf112cc3
  - object_id: ARV-GEO-C2-AFTER-Q6-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-claude-2-reviewed.md
    content_sha256: ba04bc095da766d5d0bfb711b7a7471600d1941d813e4536e12737a1a1ebfe15
    file_sha256: 57158780b6b8cc8b254149803f05a18a79503abe34df951d9f59fd1041a1d6be
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-claude-2-reviewed.md
    snapshot_sha256: 57158780b6b8cc8b254149803f05a18a79503abe34df951d9f59fd1041a1d6be
    entry_key: 39097e07b5c31fa5b22a66abb5c29dfa31656272d290eecc85085e752e68495e
  - object_id: SRC-QINPUT-26E9601953DD31494C5C
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-qinput-26e9601953dd31494c5c.md
    content_sha256: 3cb19a045fc2ae27f489a396a71ebe48b63f92cc8d57053de16ed2fce8f97362
    file_sha256: 1985971c6d74500bb8d11dfaf778cc9ab1936dfeb221450c41dd5f70236ed5fa
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-qinput-26e9601953dd31494c5c.md
    snapshot_sha256: 1985971c6d74500bb8d11dfaf778cc9ab1936dfeb221450c41dd5f70236ed5fa
    entry_key: 3994cbbee73fb5111e4f5bf2d4d4ccafe7d5eceefe7f21ba59f98e4e407295f2
  - object_id: DOC-GEO-E2E-NON-GOALS
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-non-goals.md
    content_sha256: 3859e3b3f3891807b5d16f77e1f46fcd9b5b39b2a775befa25a9f0059c03d485
    file_sha256: 596631234a599770999f069edd0cfefed3db228a6aeea6e8705fd7f2edd9b410
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-non-goals.md
    snapshot_sha256: 596631234a599770999f069edd0cfefed3db228a6aeea6e8705fd7f2edd9b410
    entry_key: 3a365bfeb25bce7425fdd2ad30cc12c0b26ffe59d4c7cf22b5a83eef19efc659
  - object_id: CLM-GEO-E2E-CAMPAIGNS
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-campaigns.md
    content_sha256: 3987871042f7f7afed241d9b0fcf21cdf7a041c4849d71dfc019b3aee7716ea2
    file_sha256: 3e9e34fe7fe193d4a16fd3ce5c6fefdace0d8794cb3d44c91132e1f63b138a0f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-campaigns.md
    snapshot_sha256: 3e9e34fe7fe193d4a16fd3ce5c6fefdace0d8794cb3d44c91132e1f63b138a0f
    entry_key: 3aa1f5b392ff99eaa5a0c154861efc2249209a9a36c1505b70a94189767d0800
  - object_id: SMP-GEO-C2-AFTER-Q2-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: c91f3f3e8250f5cf71869e97c2bfc13832f52d4ea5200a3cef0546ff76f5d565
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-chatgpt-2.md
    snapshot_sha256: c91f3f3e8250f5cf71869e97c2bfc13832f52d4ea5200a3cef0546ff76f5d565
    entry_key: 3ab39ce0d756a69bead59df408043e8a84aa01f37c76187667ad2843d73a71dc
  - object_id: SMP-GEO-C2-BASE-Q2-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: b21f78f99116e8f8c5f3999649e341acbecda0ea69b8b9cec493c65cd147fb71
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-gemini-2.md
    snapshot_sha256: b21f78f99116e8f8c5f3999649e341acbecda0ea69b8b9cec493c65cd147fb71
    entry_key: 3ae6dc512f919972cda87a4f5419a5fc15a2f11017c99e8cf56208619daa5fb7
  - object_id: SMP-GEO-C2-BASE-Q5-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 81467891f715585718dfdb41027196ba45ce704819b479a9b43baa5d350fa819
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-gemini-1.md
    snapshot_sha256: 81467891f715585718dfdb41027196ba45ce704819b479a9b43baa5d350fa819
    entry_key: 3f0d58dfc0f5c4d2dc026353abb4d7adef55a40a9bf0621ad6ea482b07af0a29
  - object_id: ARV-GEO-C2-BASE-Q4-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-google-ai-1-reviewed.md
    content_sha256: c35dea39763b508d00b3b2c16691a0fc1a181318c7bfd59ee9d86f62c4aa9312
    file_sha256: 7616049cb9dfa757451a6f6876a5cfd9fe574f1cc94fe709746889cdb575e48f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-google-ai-1-reviewed.md
    snapshot_sha256: 7616049cb9dfa757451a6f6876a5cfd9fe574f1cc94fe709746889cdb575e48f
    entry_key: 3f82ad458a054961b31ca4c21217ff46f03e39acb37caa84a28d6bc44e63ffc4
  - object_id: SRC-GEO-E2E-PRIVACY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-privacy.md
    content_sha256: 1f715fc357d9cad4ec3309c90babd8e66e0cca6207463f3f5915bed060fc7301
    file_sha256: 09237fe58794e0b2f498db110b2e1cfbee705ab7c33e794355780b1b4e87f926
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-privacy.md
    snapshot_sha256: 09237fe58794e0b2f498db110b2e1cfbee705ab7c33e794355780b1b4e87f926
    entry_key: 3fa1cd3a6e417efb3f2ab81cfe3ed1b3d769f561e8089cb1225872f2765f2877
  - object_id: DOC-GEO-E2E-REFUND
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-refund.md
    content_sha256: 367ceb2cda480a9b37842c2602757be9db5898b7f6d5a805b8527c2bddb2640a
    file_sha256: ec156fc00999a81c16594b7bb862d078b9648e928a4e509ceafeeacf212d5dbc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-refund.md
    snapshot_sha256: ec156fc00999a81c16594b7bb862d078b9648e928a4e509ceafeeacf212d5dbc
    entry_key: 4021f62e48af9cae634d187c920d8fc0a64ae7973f055790f44dcb945bc34e6c
  - object_id: SMP-GEO-C2-BASE-Q6-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 7a41f943ee61cff9de356c61fe3179105905243d100974bd9285dc7ab41a6add
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-gemini-2.md
    snapshot_sha256: 7a41f943ee61cff9de356c61fe3179105905243d100974bd9285dc7ab41a6add
    entry_key: 4028d5092305d29d601deae7e47953d8c34839a1fb577981b814c564065c939f
  - object_id: AGG-GEO-C2-AFTER-Q4-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q4-claude.md
    content_sha256: e05ebb3cbe32fb222add3450ec6a9c12a28c805803fc016fce6a2a2edb8f3fdf
    file_sha256: 5fe6ae04b7002f2879d870386fc24b4cd886e7c5e02281cfedf4e5aef002b537
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q4-claude.md
    snapshot_sha256: 5fe6ae04b7002f2879d870386fc24b4cd886e7c5e02281cfedf4e5aef002b537
    entry_key: 427a56784e202504cbe338c1d775a894f176197f1c9692adf6a939741f0989ed
  - object_id: ARV-GEO-C2-BASE-Q5-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-claude-1-reviewed.md
    content_sha256: 19d8d42ed7a0c0117d490a2c747be0b39e6bebcb651ee4e9cb25f958a0d2850b
    file_sha256: e01897022512f64a3f434ba27558e7fd6748141033ae119adcc49cef1bf3bd6d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-claude-1-reviewed.md
    snapshot_sha256: e01897022512f64a3f434ba27558e7fd6748141033ae119adcc49cef1bf3bd6d
    entry_key: 442005019511e90b97f9aeb1b030e922eac0f46f58e539de648de4588f57a225
  - object_id: SMP-GEO-C2-BASE-Q4-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 3557cec5e5cef6c8a12bbd026e79b993c986a045b1e7103150a54735635a896b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-google-ai-2.md
    snapshot_sha256: 3557cec5e5cef6c8a12bbd026e79b993c986a045b1e7103150a54735635a896b
    entry_key: 4451fe49f9f5227e9a25f5ffa020688ae107146f01569c1d634b8449c6aeb4db
  - object_id: SMP-GEO-C2-AFTER-Q1-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 758eec3267775ba61a33f611be59d7cbecc90202b01b57ba2cd39d80def2f323
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-google-ai-1.md
    snapshot_sha256: 758eec3267775ba61a33f611be59d7cbecc90202b01b57ba2cd39d80def2f323
    entry_key: 44b696cd317971bfdd6ab583502dd265708ebee6bb3db97da3e955a79bc47464
  - object_id: ARV-GEO-C2-BASE-Q2-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-google-ai-1-reviewed.md
    content_sha256: 077d90d19bb43f9e01e8f93d28d5b881a1ca112519de11aca51a36cd825e8c1f
    file_sha256: e19125d67a1330fe5fd7d2af02b87cf82f351cbc2c7303bd82ce07e2b14e86d4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-google-ai-1-reviewed.md
    snapshot_sha256: e19125d67a1330fe5fd7d2af02b87cf82f351cbc2c7303bd82ce07e2b14e86d4
    entry_key: 44fa50422406e85eb9e9c652da6480e1f1aa0560e19f597ea1fc6f92a4d11c33
  - object_id: SMP-GEO-C2-BASE-Q6-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 14c7d2672facb183bb91fe711dc9ee7ca81c475ca8c2c8dc095b8136250f0ada
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-claude-2.md
    snapshot_sha256: 14c7d2672facb183bb91fe711dc9ee7ca81c475ca8c2c8dc095b8136250f0ada
    entry_key: 4513df7dcb808cf7f94f74fc54b5a22c773bb036798e8ec99923e07256e68afb
  - object_id: DOC-GEO-E2E-POSITIONING
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-positioning.md
    content_sha256: af4604fedd31943104cd300f492bceb68c91b610780198f6f9168d38e6c47a34
    file_sha256: 6eb4fb55801c3e9f9bfe3b7cf2ebb1aab213c6394bb6dcc86e9fc1ad81c7a2e7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-positioning.md
    snapshot_sha256: 6eb4fb55801c3e9f9bfe3b7cf2ebb1aab213c6394bb6dcc86e9fc1ad81c7a2e7
    entry_key: 47d94efa07258b061e523e3b63694744aaf11b34b0a772b1fca811513c48fa2b
  - object_id: SRC-GEO-E2E-NON-GOALS
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-non-goals.md
    content_sha256: a210c8651cd23b7d74a65e4f99c45cf2a7681b9223ee46b623e3323d308d9020
    file_sha256: 19d5bfbfc92e81c1a895e8516e25fc643065101f5eb0d872fd52df128b1017fa
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-non-goals.md
    snapshot_sha256: 19d5bfbfc92e81c1a895e8516e25fc643065101f5eb0d872fd52df128b1017fa
    entry_key: 48034c606087a852cf299bcd3b0cc8835ebc39d403f84c2cf734a3965d7f366d
  - object_id: AGG-GEO-C2-AFTER-Q2-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q2-perplexity.md
    content_sha256: 4ea0aaccc3ace009584fae0e2503ea162780b41761f47a6afea00c0db2cfb9cd
    file_sha256: 48656f6c60df44a861676d52153cdcc2a3a12739192980e687a92cdcd08294b3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q2-perplexity.md
    snapshot_sha256: 48656f6c60df44a861676d52153cdcc2a3a12739192980e687a92cdcd08294b3
    entry_key: 482d42eb0448b13fd6fdd8686237d8ba25e4811abf6b0651b36ab95bcbefba53
  - object_id: DOC-GEO-E2E-ANSWER-DEFINITION
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-answer-definition.md
    content_sha256: e982319badeffd7faf9b90b3ea74c4912f4bded37f57ee72318fa4cca56bcaeb
    file_sha256: 812211777d82da2ca268dd8cd1720e9b7d5d696c7e2067f5854852c6f5455854
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-answer-definition.md
    snapshot_sha256: 812211777d82da2ca268dd8cd1720e9b7d5d696c7e2067f5854852c6f5455854
    entry_key: 491919b63f099c25902cdb1784c61bb1698fcc47cd35c9296d2e7350a8d59251
  - object_id: SMP-GEO-C2-AFTER-Q3-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 02b1b8a2470f547208ff059cf3b3953b68f5a3cae2903d74521bf45fe216733a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-perplexity-1.md
    snapshot_sha256: 02b1b8a2470f547208ff059cf3b3953b68f5a3cae2903d74521bf45fe216733a
    entry_key: 4a19b548d546f1ed9ab7aac4760a532b6ee31d5fad08c90ccd26f55e9c96132b
  - object_id: ARV-GEO-C2-BASE-Q6-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-gemini-2-reviewed.md
    content_sha256: 679018de3e5a966d5c8f604971ecbf027e8c78c2a3e032255deb5854294c5991
    file_sha256: 29089474de188dbc16aa633df2e4d8ab50ff1b6e9abbd455a5284bf3a48ea776
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-gemini-2-reviewed.md
    snapshot_sha256: 29089474de188dbc16aa633df2e4d8ab50ff1b6e9abbd455a5284bf3a48ea776
    entry_key: 4a3d9a1d300589e6eda49266c7ebe0e599a422ae189cc7f136ffdeba9739e7b4
  - object_id: SMP-GEO-C2-BASE-Q1-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 72d14ed231019dfa1cd5532b1bced4c717d968a685f1addc2913d3b3cc23b608
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-claude-1.md
    snapshot_sha256: 72d14ed231019dfa1cd5532b1bced4c717d968a685f1addc2913d3b3cc23b608
    entry_key: 4a949bd786d9b702edb26adfedf49fa54d2b099c29bccd1f5bc365b0b62315d1
  - object_id: ARV-GEO-C2-AFTER-Q6-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-gemini-1-reviewed.md
    content_sha256: d6dcede56dfd6beb71878c5b05c7504009ac111ec0c0e782b92e31c0d467141a
    file_sha256: ddf744f400b103a7ff712412cf5a8acc53c732d6e719d541feb51fe62aea79cf
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-gemini-1-reviewed.md
    snapshot_sha256: ddf744f400b103a7ff712412cf5a8acc53c732d6e719d541feb51fe62aea79cf
    entry_key: 4ae877363a89d14ec84581f998b904cfcca262d8a8f4e8404cab8127a8a9f459
  - object_id: AGG-GEO-C2-AFTER-Q6-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q6-gemini.md
    content_sha256: 6ec785a24b4efe2a10500a9ca16552c2cc83890e019161f906a5fc9cb7f01a09
    file_sha256: 9a2ebf9e23372654e7117f7ea0af1fe15da9794148d5aac118b0f9d917405395
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q6-gemini.md
    snapshot_sha256: 9a2ebf9e23372654e7117f7ea0af1fe15da9794148d5aac118b0f9d917405395
    entry_key: 4aef636b8835420c49b362e80a7f3ccc8326a3df886ce7f94317d41413686ca7
  - object_id: PRP-GEO-C2-OWN
    record_type: asset_proposal
    object_version: 1.0.0
    object_path: assets/proposals/prp-geo-c2-own.md
    content_sha256: a6f50bf3f12deebc42b38a4db52d5b2cc30ca39e65aca48b9b41642a14df6bf9
    file_sha256: 9d3e4e387da437a4fe7b1ae2839789373274850def7740faa1696601e703c480
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/proposals/prp-geo-c2-own.md
    snapshot_sha256: 9d3e4e387da437a4fe7b1ae2839789373274850def7740faa1696601e703c480
    entry_key: 4b9791ed1f148670285b9706068b41116086fb1caea3b53eb01f755090078963
  - object_id: ARV-GEO-C2-AFTER-Q2-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-perplexity-1-reviewed.md
    content_sha256: 42752073f4a5e07dae2d50077c90deceee55273c0654deab048d9e8bcd677754
    file_sha256: 90f6c1bb395a751594bb8c018a16c4d0516786c8ec6de50f6e5860e0802699af
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-perplexity-1-reviewed.md
    snapshot_sha256: 90f6c1bb395a751594bb8c018a16c4d0516786c8ec6de50f6e5860e0802699af
    entry_key: 4bf048d0c72f48392240dc4fcccaf6bbedefed71764d04bb70691dc5ff09c843
  - object_id: ARV-GEO-C2-BASE-Q6-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-google-ai-2-reviewed.md
    content_sha256: 24318c1d4d2c1646290d6cfa5556ea642806737b4bc84a8b6c4900c2e20e7634
    file_sha256: e36d49500db8b62a2ddf29baaae2afaa21fad637d0fa222fd573c5d82b6a6fca
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-google-ai-2-reviewed.md
    snapshot_sha256: e36d49500db8b62a2ddf29baaae2afaa21fad637d0fa222fd573c5d82b6a6fca
    entry_key: 4e9891d618e9ff14e4be8d9957e14426cef2caf3ca3e99d33b7dfc006dc07b91
  - object_id: AGG-GEO-C2-AFTER-Q6-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q6-google-ai.md
    content_sha256: fdb2e9084067c3e7ebb6a841c86246b8634b96c5d66ee1999e584db73b2ca032
    file_sha256: 4af115852fcdedb93b289c035a02787a15f79890506d488e13e76da966f8ea4e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q6-google-ai.md
    snapshot_sha256: 4af115852fcdedb93b289c035a02787a15f79890506d488e13e76da966f8ea4e
    entry_key: 4eff0a120ad4174ca9bf02aabb4f36f7713b77c86b8dd70f6ddbeefd65bb76e9
  - object_id: SMP-GEO-C2-AFTER-Q1-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: a0cd2d96596646c5e63f41c301c41236dfa4e40e992b9d088dc892fd8d6a327e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-chatgpt-2.md
    snapshot_sha256: a0cd2d96596646c5e63f41c301c41236dfa4e40e992b9d088dc892fd8d6a327e
    entry_key: 4f51fb357eb59debf63c75ff48239d57a8ba83fa683ac0aa2b0311c6841f8e52
  - object_id: AGG-GEO-C2-BASE-Q4-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q4-gemini.md
    content_sha256: cab3fecfe3c606c8e9324c0de2be1714af79b595ecb0134ac8171f2cdbe3b6a2
    file_sha256: 092f633fc2be746d9d59f07efc624a3692b5cbc54f4a293f75a1677537ed1ace
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q4-gemini.md
    snapshot_sha256: 092f633fc2be746d9d59f07efc624a3692b5cbc54f4a293f75a1677537ed1ace
    entry_key: 502729b79fa61647cb7351ae275b052fd3e23fff4a3a0692a2a6f9940728912c
  - object_id: AGG-GEO-C2-BASE-Q5-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q5-claude.md
    content_sha256: 7ae438214014336313e11ad86acfb54820c0871254b1e61614f1b5ba7e5870e9
    file_sha256: fa5d2efd449331589d6cf24d861930d0feab7014961177478c5e99910f256d42
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q5-claude.md
    snapshot_sha256: fa5d2efd449331589d6cf24d861930d0feab7014961177478c5e99910f256d42
    entry_key: 50390eee776cd28b339f2fe442833cc033e0f0f67356e545441312788e7feb20
  - object_id: EVD-GEO-E2E-AUTOMATION
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-automation.md
    content_sha256: 93e1c25d15e397d249e71905bd51a80b5af9be0d998e9032667dd3402089e880
    file_sha256: acde7b80c13130658bdb15db1e6ee1098075116625615c4838b2c949cafdc7d2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-automation.md
    snapshot_sha256: acde7b80c13130658bdb15db1e6ee1098075116625615c4838b2c949cafdc7d2
    entry_key: 50928677a9f998d987fc0fd91504a6d05f8f9e2887cfde20877977d06f2cbf2b
  - object_id: CLM-GEO-E2E-GUARANTEES
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-guarantees.md
    content_sha256: c05c6c819824b4a3bbbe50587e611d97dc478fa9777acc9ab0371c4133722b0f
    file_sha256: 5140d1c928f241fefb9aaa801e2258488e219f27f8e93bc04705e4d3c28bdb5c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-guarantees.md
    snapshot_sha256: 5140d1c928f241fefb9aaa801e2258488e219f27f8e93bc04705e4d3c28bdb5c
    entry_key: 50b31ac15b28be36bd2a9482f342c95ea6bc00e9667053ac56e715e1fdace350
  - object_id: FND-GEO-SITE-C2-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c2-base-third-party-meta-description-present.md
    content_sha256: 06f484593238390540c3c812626d8ca01a77c892956c7cb06fc02b6ff8a3b005
    file_sha256: a20802dd47051aee86af01e47fde8710c5a470cc8366f46a28d55146a194a8df
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-site-c2-base-third-party-meta-description-present.md
    snapshot_sha256: a20802dd47051aee86af01e47fde8710c5a470cc8366f46a28d55146a194a8df
    entry_key: 50cc4840941887e2ded36bc701dfba23751b51e083761e3bce883914d2ba1240
  - object_id: ARV-GEO-C2-BASE-Q2-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-gemini-2-reviewed.md
    content_sha256: a3ea747f8e9b10122089a338c1d82e671fe474922385bb28d20605093842b18c
    file_sha256: 2d9fe33c6c94a44dd5ceceb6d166a75f2ae6ac7ce0117535755921a966a0e897
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-gemini-2-reviewed.md
    snapshot_sha256: 2d9fe33c6c94a44dd5ceceb6d166a75f2ae6ac7ce0117535755921a966a0e897
    entry_key: 51127f8194d319d14a35a2d61c10dfd63e3b3e515d6babf9eb5a8274a911c1b2
  - object_id: AGG-GEO-C2-AFTER-Q1-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q1-gemini.md
    content_sha256: bc1f569e4bb56bcfb15d369b69d509f3a2e0282b447a6671d7dd1c87c4fb563f
    file_sha256: 2f0475bbbfe6ca5eba4a145ec651d30209ffe68c6e67f23e5d67fd3c2ab151cc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q1-gemini.md
    snapshot_sha256: 2f0475bbbfe6ca5eba4a145ec651d30209ffe68c6e67f23e5d67fd3c2ab151cc
    entry_key: 51e1b738296ef9c3c6fd02ba82c36592e2d6326c1be7ffaf32eb637551013658
  - object_id: ARV-GEO-C2-AFTER-Q1-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-chatgpt-2-reviewed.md
    content_sha256: 73efce337ba7ed9fb06e26799148a87de1d5224143c37b9c81608568b5d87efe
    file_sha256: 5490bf0511f30f1b40582e3766065a7f1898e9d8d4d970624e1ccf274302b42b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-chatgpt-2-reviewed.md
    snapshot_sha256: 5490bf0511f30f1b40582e3766065a7f1898e9d8d4d970624e1ccf274302b42b
    entry_key: 529bed72caf57c8f30dca03830f75357d6c920c710f68ab27e8174e8fb478b8e
  - object_id: CPF-GEO-E2E-C2-BASE-CLAUDE
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c2-base-claude.md
    content_sha256: 72ef7be1df18095ac54c342950d6aaa56675a497a8c77e79ddc8d89c843f983b
    file_sha256: c5de72cf87abce4d962e1c6b41d2306b0de21078cc498ca3031c91bb97266a9b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c2-base-claude.md
    snapshot_sha256: c5de72cf87abce4d962e1c6b41d2306b0de21078cc498ca3031c91bb97266a9b
    entry_key: 52c35e21462cf1031f152decc73f582809a4c447925b65277aaa5f9da81db1ee
  - object_id: EVD-GEO-E2E-ONBOARDING
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-onboarding.md
    content_sha256: d6fd212806c92f8b1d294e5b0d5f0afaa052d13d205a6f413183bf3746d0c908
    file_sha256: 4bfe6229aaa4aeb4c57a949fd2ea5a43b7056f6b4a30e20e43cd288d9e52daff
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-onboarding.md
    snapshot_sha256: 4bfe6229aaa4aeb4c57a949fd2ea5a43b7056f6b4a30e20e43cd288d9e52daff
    entry_key: 52fa95eec98a618618909fe346d2b448cb7c693fbde4b76d46ad9c761db3df48
  - object_id: SRC-GEO-E2E-GROWTH
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-growth.md
    content_sha256: 29980cbf4cdae009088f030cb6f11189d43d680daa60b66401307b37b9c7e06f
    file_sha256: 5cb4ae9af467a4b283fa4fdc7d6d2ef1b7e0945bd581a58c848bc24ee85ecd6a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-growth.md
    snapshot_sha256: 5cb4ae9af467a4b283fa4fdc7d6d2ef1b7e0945bd581a58c848bc24ee85ecd6a
    entry_key: 53f6b931a202e03452bd5c54d363352655f134f1bef885fbd290e08599e64f5f
  - object_id: SMP-GEO-C2-AFTER-Q1-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 09aba838176f6ffe903fb5ef798ed9542f97a0084fe59921a61919b3d4dc59b4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-perplexity-2.md
    snapshot_sha256: 09aba838176f6ffe903fb5ef798ed9542f97a0084fe59921a61919b3d4dc59b4
    entry_key: 54281fe61b36835379c2f319e6702082393ae546c1074ebea03df587dba93e15
  - object_id: ARV-GEO-C2-AFTER-Q5-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-chatgpt-2-reviewed.md
    content_sha256: 44a8f027e124ae5fdbff744ca87fb4d4740dfbc319cf979bc971e1662fc65131
    file_sha256: b687d3ea84b52b75c365a2164845a35fee283295b828b397d002843c56493a1d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-chatgpt-2-reviewed.md
    snapshot_sha256: b687d3ea84b52b75c365a2164845a35fee283295b828b397d002843c56493a1d
    entry_key: 543b65e209e68876c5fa2ae56a331fc1a8f2271db48a172dff1e2138361f2e75
  - object_id: EVD-GEO-E2E-IDENTITY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-identity.md
    content_sha256: a72644835b1a7648ba95871bc7c874b7646ff9247675d45295e09105a2a124fa
    file_sha256: 61de83100ec6389312d7db93caff3452e02973809caafe502cec92b44b40b8c8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-identity.md
    snapshot_sha256: 61de83100ec6389312d7db93caff3452e02973809caafe502cec92b44b40b8c8
    entry_key: 54b0f0f0a98752a1f8c714511609d555c72ac89a408246daa259e3006414e89c
  - object_id: SMP-GEO-C2-BASE-Q3-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 66729c71febe16f0cc340bf1f12abbdec79b174f87571c660d732289aa2b4ef2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-perplexity-2.md
    snapshot_sha256: 66729c71febe16f0cc340bf1f12abbdec79b174f87571c660d732289aa2b4ef2
    entry_key: 5501f5a369db2cf92bc2a108fad32652721bd0a98690ab341cc55da4ef3a5b2f
  - object_id: SMP-GEO-C2-BASE-Q3-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 5b9ee8a6a748fb370d3f96d5ba55bac301e5b006c10f28c120d7884ea42f1a0d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-google-ai-2.md
    snapshot_sha256: 5b9ee8a6a748fb370d3f96d5ba55bac301e5b006c10f28c120d7884ea42f1a0d
    entry_key: 555c374bc7c18d205be5f9d8d6c5139e3ac201887a37556e4e4dbb91c48ef1f9
  - object_id: ARV-GEO-C2-AFTER-Q5-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-google-ai-2-reviewed.md
    content_sha256: efb21ae97edd5c8dce9ce50f56061f9464af0d1250736f93a467b43bd7c8164e
    file_sha256: 217f3abcb9fcec069b734e6a80e394a4c1fa669e5f7e37ed9a8d1331bf87de37
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-google-ai-2-reviewed.md
    snapshot_sha256: 217f3abcb9fcec069b734e6a80e394a4c1fa669e5f7e37ed9a8d1331bf87de37
    entry_key: 57f59cbe906cad62acb8585228b0fb252ebf1ab7927bd197f3bd624b4b77f72e
  - object_id: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-1724
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-is-the-myyshop-rehearsal-en-1724.md
    content_sha256: 4dbc0ebccd8dfd16de6c58128ce41f0a282e3de810651c53a51994dd0773803f
    file_sha256: 97e0c732881fbd51077f2eb0fcf655c8a71087c9377e4c1cbb651d24a5c44884
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/queries/candidates/q-what-is-the-myyshop-rehearsal-en-1724.md
    snapshot_sha256: 97e0c732881fbd51077f2eb0fcf655c8a71087c9377e4c1cbb651d24a5c44884
    entry_key: 5854376f6cfb8b4a14250e2827c1057bc88196fb232d8a76d8fad33b48275080
  - object_id: ARV-GEO-C2-BASE-Q4-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-google-ai-2-reviewed.md
    content_sha256: 364ddd73778ce86764ae85f92b01526ffa899b1d4c44ce522dfed896994887a5
    file_sha256: b4393ca27579e88b42c075519b3da2c1d73a40c0f692514312236c01a5426e02
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-google-ai-2-reviewed.md
    snapshot_sha256: b4393ca27579e88b42c075519b3da2c1d73a40c0f692514312236c01a5426e02
    entry_key: 586ba09f7ae1e13f0de5d786c2e865fbe053e36e27ee4950cb49d0efcf302803
  - object_id: AGG-GEO-C2-AFTER-Q1-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q1-chatgpt.md
    content_sha256: 8ed5d39674d3b86205cd9aef3e59ae7a436e4610426e98e495a4356dccb0ac76
    file_sha256: 03630dbec7602d844760fb39775843ba55c9b9740f72484efb53494999892b63
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q1-chatgpt.md
    snapshot_sha256: 03630dbec7602d844760fb39775843ba55c9b9740f72484efb53494999892b63
    entry_key: 59273c122c29e15dff5be1812632404c206867cb90b6c041a6f4487c95fc47c3
  - object_id: SMP-GEO-C2-AFTER-Q6-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: db1196d163258db2cc33cf973522f6bb66f50eeb50a956edb71f2cee3a564767
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-claude-2.md
    snapshot_sha256: db1196d163258db2cc33cf973522f6bb66f50eeb50a956edb71f2cee3a564767
    entry_key: 59fec491a1c2b492d543545e715358b6a50dd297ae84bcd283d1f86ce15e6246
  - object_id: EVD-GEO-E2E-PRIVACY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-privacy.md
    content_sha256: 1f715fc357d9cad4ec3309c90babd8e66e0cca6207463f3f5915bed060fc7301
    file_sha256: 32a907f1a9e21524918f4f98328d8a6151f78efa7f6ffeb07557cdbe081bd748
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-privacy.md
    snapshot_sha256: 32a907f1a9e21524918f4f98328d8a6151f78efa7f6ffeb07557cdbe081bd748
    entry_key: 5a9733100a5a684ce43a5e783482943586041b0605691f1f5377257fcf72e63a
  - object_id: SMP-GEO-C2-BASE-Q5-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: a888f91eea063693172adf5a24a1bcfe74970483ae0bf2ab2040e36fee33f278
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-chatgpt-1.md
    snapshot_sha256: a888f91eea063693172adf5a24a1bcfe74970483ae0bf2ab2040e36fee33f278
    entry_key: 5cf28bf92d8dc69f9ec95f7fee31f0264812f2f6898ade17fbdb26f98fdfb8b1
  - object_id: SMP-GEO-C2-AFTER-Q5-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 967936d8d07f430e7b18b35c816d8b33c6307215b48b50456ac00a8213f476af
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-google-ai-1.md
    snapshot_sha256: 967936d8d07f430e7b18b35c816d8b33c6307215b48b50456ac00a8213f476af
    entry_key: 5d6528326d57808f57394bd05a48799c78704a4c63529d36d21eb52d625114c5
  - object_id: ARV-GEO-C2-AFTER-Q4-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-claude-1-reviewed.md
    content_sha256: 368a75bba22cde7527c6f52e97b0cc73dc23a7cdab371462711dafeefb4e5a52
    file_sha256: 1ea9183af552bb89ef726838bea470b48a1769a058ea87bd65ae7fefa0624391
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-claude-1-reviewed.md
    snapshot_sha256: 1ea9183af552bb89ef726838bea470b48a1769a058ea87bd65ae7fefa0624391
    entry_key: 5fc25a9195b8e151b003b683b9a8782369a701f46f47acc363bbd280e3c49b29
  - object_id: ANS-GEO-E2E-C2-2
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c2-2.md
    content_sha256: b666ae7a7be8ab816071ceff77dbc6bb209585b62186276eb7313480e21043b2
    file_sha256: 202aa4143017ea08fcd31b2111aae79c445942a305f5a53a04ab06ceabdfcd25
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/answer-cards/ans-geo-e2e-c2-2.md
    snapshot_sha256: 202aa4143017ea08fcd31b2111aae79c445942a305f5a53a04ab06ceabdfcd25
    entry_key: 5ffc32a06fb9b3c93e20156c9efb4a951f4dcab4bf924e7498c12e49ebb39d61
  - object_id: AGG-GEO-C2-BASE-Q4-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q4-google-ai.md
    content_sha256: d95ec814a1a4b5371cb5f2608ef7cab5f98af1be021690800678390baa31cb28
    file_sha256: 53a13d528d19b314f90ba98775313dc409ba05e20ff840fb255f7533ba820aa5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q4-google-ai.md
    snapshot_sha256: 53a13d528d19b314f90ba98775313dc409ba05e20ff840fb255f7533ba820aa5
    entry_key: 610cb392418c8c323d568225e7f9a43c29ea198d3fd5005189e7bfb11a8dc3d4
  - object_id: AGG-GEO-C2-BASE-Q5-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q5-chatgpt.md
    content_sha256: deb242afbd6b4f8c637a91051e63a6d3ed6016d70754cd1868f1518fec74ca66
    file_sha256: a9867cc01fd79e1505789d8d9bd88ef568019ee7ba65e060f47f6282dec24fb4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q5-chatgpt.md
    snapshot_sha256: a9867cc01fd79e1505789d8d9bd88ef568019ee7ba65e060f47f6282dec24fb4
    entry_key: 61562da44c80ce8ab0d67b23e0fdd7a9890161ca1ca041df3d71a925e5931924
  - object_id: ARV-GEO-C2-AFTER-Q3-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-gemini-1-reviewed.md
    content_sha256: de7dc10b08a8c1a8cf4d0d55df0ebd62883be306cd0b73840a237803c55b571e
    file_sha256: bec19d01a5e54de6d377337cbe52dc2412a900f29b9ef31a27ae95e562679369
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-gemini-1-reviewed.md
    snapshot_sha256: bec19d01a5e54de6d377337cbe52dc2412a900f29b9ef31a27ae95e562679369
    entry_key: 6173b820f63ba325273f904a4088bb04db0291f7212cb56897720c20146405f4
  - object_id: CLM-GEO-E2E-VOICE
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-voice.md
    content_sha256: 4572ad641758c23474309fd0917192b0a55daa34e6bc97c3b8ca3e18c2e67004
    file_sha256: f3e1250cdb9fd20e027247adc46ef0463f08c84c6f01bb281f255563da62162e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-voice.md
    snapshot_sha256: f3e1250cdb9fd20e027247adc46ef0463f08c84c6f01bb281f255563da62162e
    entry_key: 61c0b82f8ab3e540bdfd0d27af52d34a0acbda1fa45dfe5734a1c12af7f4c8d1
  - object_id: CLM-GEO-E2E-REFUND
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-refund.md
    content_sha256: d8d34b9f234e97400b8a96db2edb8664e4889192426a0a6be8fd884fc28b1808
    file_sha256: 4798604be05ca4c62908509a6c62c51bf09e80ca5973eafd28f48f863a1dfdff
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-refund.md
    snapshot_sha256: 4798604be05ca4c62908509a6c62c51bf09e80ca5973eafd28f48f863a1dfdff
    entry_key: 61d44623afbbe977a8bc841e8a2fb587e91f7a122ba2e3fc0679da73a877f1b7
  - object_id: SMP-GEO-C2-BASE-Q5-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 27ff28bf71b231ad0a9587b2101c7b87a4864519c55209bebb2b8c59538a7bec
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-perplexity-1.md
    snapshot_sha256: 27ff28bf71b231ad0a9587b2101c7b87a4864519c55209bebb2b8c59538a7bec
    entry_key: 62392b1e96a0568d261a5bc63d771dfe977883744f9eac20b947b14e80cbe6b0
  - object_id: ARV-GEO-C2-BASE-Q3-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-gemini-1-reviewed.md
    content_sha256: 01260fb4b046b91e59bc239a244f25aa33599f57395ddcbb6d0504a0d7076d22
    file_sha256: c005380dd9298794fe2f05e32d516d4a75b348e03e283b5bec41ab4544e342bc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-gemini-1-reviewed.md
    snapshot_sha256: c005380dd9298794fe2f05e32d516d4a75b348e03e283b5bec41ab4544e342bc
    entry_key: 636d8de84d9e37b544ea940778e22cfc39d902a996204a20f4952595b3d7ad38
  - object_id: AGG-GEO-C2-BASE-Q1-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q1-google-ai.md
    content_sha256: 15b27427c2bbd98b7931efce332880d6b62b11cbae545332f6aa7383f214dcfc
    file_sha256: ecfe349ba0764728ac01df175edfb293f3d7f45c199ea129f8b6965a64a2fd7a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q1-google-ai.md
    snapshot_sha256: ecfe349ba0764728ac01df175edfb293f3d7f45c199ea129f8b6965a64a2fd7a
    entry_key: 642a0cc9e55132b9119e1259452d4ac603ca5cf7aff7ec19203e1182cec9b8da
  - object_id: AGG-GEO-C2-BASE-Q6-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q6-perplexity.md
    content_sha256: a49db5aa73efdd9ba15da64f69cd25a9ce66f5f8c8c2b4b56951f041310bded4
    file_sha256: b5c117a2f5cc94c9c1a60cca0421325eb49acff2606737c8428b37e9a8b9ddf9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q6-perplexity.md
    snapshot_sha256: b5c117a2f5cc94c9c1a60cca0421325eb49acff2606737c8428b37e9a8b9ddf9
    entry_key: 645992e5a3f7ac4b71c36741c30ac0c939f5b436ee60aa55c387fa3d3f4e9147
  - object_id: ARV-GEO-C2-BASE-Q2-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-chatgpt-1-reviewed.md
    content_sha256: 8cf55388f4adeafeed86b97d136e9e1b167c4421218fffac7c21392a3b35e622
    file_sha256: a66af57c9a88f2ce7444284d5e9d3e6764f228e3d0a20e11b948611aabe05900
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-chatgpt-1-reviewed.md
    snapshot_sha256: a66af57c9a88f2ce7444284d5e9d3e6764f228e3d0a20e11b948611aabe05900
    entry_key: 6495ca31378a92852278e8198685f75de1fcf7490bddb1774961885d0134ac51
  - object_id: ARV-GEO-C2-BASE-Q1-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-claude-2-reviewed.md
    content_sha256: 8561f446465212a0c11b57ffc46a3c8ed901cc6b707a86dcff83781847b0b44d
    file_sha256: 59f3610ea9e570676b5c69d2cfc55c922f6a9466c7d5e78c6c2e1357a6e89402
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-claude-2-reviewed.md
    snapshot_sha256: 59f3610ea9e570676b5c69d2cfc55c922f6a9466c7d5e78c6c2e1357a6e89402
    entry_key: 64aaa6daa9436c5499b4ecbc0fd4d0c3834699dc40a3e1f991034c2d37bddce7
  - object_id: SMP-GEO-C2-BASE-Q1-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 61b3902d4eaaf7c725dba7b887a4af556fc5ffcf7c223f0ac1ad3762db7f7e78
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-perplexity-1.md
    snapshot_sha256: 61b3902d4eaaf7c725dba7b887a4af556fc5ffcf7c223f0ac1ad3762db7f7e78
    entry_key: 66007877a1799161e0073c9f141e8fa5820debd80b96f9789333f522d410fcd9
  - object_id: AGG-GEO-C2-AFTER-Q1-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q1-google-ai.md
    content_sha256: 04ea41d634c9ada48a35657806eb3d5e883679dd967d654b529c316865b56125
    file_sha256: 9bc56fa0e55f0134e19c630267a75f1f68969335888731dd6bdbe33342242f2f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q1-google-ai.md
    snapshot_sha256: 9bc56fa0e55f0134e19c630267a75f1f68969335888731dd6bdbe33342242f2f
    entry_key: 660d8dfaae220108614b1cf5237cb44c435c943efe799d968ceb8a5dd4086de6
  - object_id: SRC-GEO-E2E-FEES
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-fees.md
    content_sha256: 6e0610ad7c6ea19a5143bad7b2167bddf28ecfc8e49ee460f16fd33060260812
    file_sha256: aae93f87da3c8e64f51c4ebb7ed3d2f940ee056e32d1f03d11e835e41faa4d4b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-fees.md
    snapshot_sha256: aae93f87da3c8e64f51c4ebb7ed3d2f940ee056e32d1f03d11e835e41faa4d4b
    entry_key: 6669d913437cbe7277bbd13325066c4e4c7f3d4a42f4b11127e2618d41e6fb15
  - object_id: ARV-GEO-C2-BASE-Q3-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-perplexity-2-reviewed.md
    content_sha256: 0156d1118873c6ea57a5b55a784b4a1ebdee0f27c40082366af4e971f55d0f75
    file_sha256: dd04edf909df98822835a326239dd9ce068e38b4040fc37002bda0cf5af28a17
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-perplexity-2-reviewed.md
    snapshot_sha256: dd04edf909df98822835a326239dd9ce068e38b4040fc37002bda0cf5af28a17
    entry_key: 6739b48bc037f484199706dd6a333810d7de76dee07c3e03f4931a7dca6a376d
  - object_id: ARV-GEO-C2-BASE-Q1-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-google-ai-2-reviewed.md
    content_sha256: 0dd3b5382db197cfb5bd982df38d5bce99c04d1900fbb899a35abb564414513b
    file_sha256: 31811f40efd965b0a16e5720a4e821c6f8f019a7e86e89f01657ea63da552624
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-google-ai-2-reviewed.md
    snapshot_sha256: 31811f40efd965b0a16e5720a4e821c6f8f019a7e86e89f01657ea63da552624
    entry_key: 67c9907a3f44e219c71bb333d1632285b6c98ccec1288d3d3399ddad0fae0f99
  - object_id: SRC-GEO-E2E-VOICE
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-voice.md
    content_sha256: 4572ad641758c23474309fd0917192b0a55daa34e6bc97c3b8ca3e18c2e67004
    file_sha256: 156bfbc8840357db69a1c20b21d95aae3f97020e0c8a77889c005c82c0f9031c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-voice.md
    snapshot_sha256: 156bfbc8840357db69a1c20b21d95aae3f97020e0c8a77889c005c82c0f9031c
    entry_key: 682bf52930566e2a41015f1f6250ccd25225f7e2a77dade9a268b19d8eb021ad
  - object_id: DOC-GEO-E2E-ELIGIBILITY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-eligibility.md
    content_sha256: 55b5651e0871c467f336463957d6bbcd39e8c58d23651630b5e6a2cd23b73c46
    file_sha256: badc4ec0dc8e75c614bd7c9da8116411cf8c1221bd018002cb885396ccd81075
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-eligibility.md
    snapshot_sha256: badc4ec0dc8e75c614bd7c9da8116411cf8c1221bd018002cb885396ccd81075
    entry_key: 692ade77ea5c1e8c00d6767200eb25be103326c088de9299df86f97325546211
  - object_id: AGG-GEO-C2-BASE-Q4-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q4-claude.md
    content_sha256: 688e5956cb8d93a0cfc859cae44320f2cf49eef184a17217fb7263fa43a64ea0
    file_sha256: 996c372e97465f60dbfef3da09499f361d98941b3a099fb8a8124f7c4e8d8817
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q4-claude.md
    snapshot_sha256: 996c372e97465f60dbfef3da09499f361d98941b3a099fb8a8124f7c4e8d8817
    entry_key: 699ede6897ccdc2038fa9faac89982bbd623464d154de435001ed8a5218a5094
  - object_id: SMP-GEO-C2-AFTER-Q2-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: e385cdbe74a34fc46d039f51bd240e417cda86e965ea287e6ef094721e1babb1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-google-ai-1.md
    snapshot_sha256: e385cdbe74a34fc46d039f51bd240e417cda86e965ea287e6ef094721e1babb1
    entry_key: 6b1fd5a8c53c2bfe3021bdb32514cc1694059757b791aaca33d9c6435305e8f6
  - object_id: SMP-GEO-C2-BASE-Q5-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 4ee934c3e8a57c036c21b7a274a5c9469cbc484e3072852b52879b6e1769a407
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-claude-1.md
    snapshot_sha256: 4ee934c3e8a57c036c21b7a274a5c9469cbc484e3072852b52879b6e1769a407
    entry_key: 6b920d09137c39e0de538ea8302c2b7084da348c8ca5218ed8a5c24d7b33acab
  - object_id: SRC-GEO-E2E-ANSWER-DEFINITION
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-answer-definition.md
    content_sha256: 39e9f04bfbb709f8985c63171446a5d66214132c264165afb6eb98c13a5bbb95
    file_sha256: 4d7a38cdc4f48630c9d0f4355d7f6da7f71d2f51b4831d644d002a1e4fa88d3c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-answer-definition.md
    snapshot_sha256: 4d7a38cdc4f48630c9d0f4355d7f6da7f71d2f51b4831d644d002a1e4fa88d3c
    entry_key: 6bb805777ba5c48514f107ba3b0042a5809a0769cd2ea39b7b55bdbe6a0079ec
  - object_id: ARV-GEO-C2-AFTER-Q4-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-perplexity-1-reviewed.md
    content_sha256: 63741f563546a3336b4e467fceaf6d819d0c90a1d216c4b6264aa65fb05a639c
    file_sha256: 129321533370fddd8900b4f16dd715ad866422df536ea10555887186acda4817
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-perplexity-1-reviewed.md
    snapshot_sha256: 129321533370fddd8900b4f16dd715ad866422df536ea10555887186acda4817
    entry_key: 6bc1dff6961a3cc5d9825b5f40dc276025f8c9c5db63cff9003bc31a195cfccf
  - object_id: SMP-GEO-C2-BASE-Q4-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 00f89f2005384b94fef8e525117be895ba14c01dbba588aa56423a912e073124
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-perplexity-2.md
    snapshot_sha256: 00f89f2005384b94fef8e525117be895ba14c01dbba588aa56423a912e073124
    entry_key: 6d31a2798a4790017534599425031a8cb21af92902e62f76f3e48673adb0a767
  - object_id: SMP-GEO-C2-AFTER-Q2-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 6c3dba671a7dd2cb1fd26d08be278a61fb970696d4f3d5051b4fb5936b4569e5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-perplexity-1.md
    snapshot_sha256: 6c3dba671a7dd2cb1fd26d08be278a61fb970696d4f3d5051b4fb5936b4569e5
    entry_key: 6da06c439da8325ba41614b4541d121ee4fd9056e24a65a34d0101211f25e3b6
  - object_id: ANS-GEO-E2E-C2-5
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c2-5.md
    content_sha256: 4dbc0ebccd8dfd16de6c58128ce41f0a282e3de810651c53a51994dd0773803f
    file_sha256: 54ca0cb39424c4b4d5dcd8775bea80edb98b8e2ac434db979d0fc53d0c9cc82d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/answer-cards/ans-geo-e2e-c2-5.md
    snapshot_sha256: 54ca0cb39424c4b4d5dcd8775bea80edb98b8e2ac434db979d0fc53d0c9cc82d
    entry_key: 6df5b5bafc4e22f6d582c2546e3a3e83254a84cfa14606fb7718e3dbf8122462
  - object_id: AGG-GEO-C2-AFTER-Q5-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q5-gemini.md
    content_sha256: 032b67cc1b5a61f974c44bdd765b97634217a461f22b8ab73b94d7a8dc2c2c5c
    file_sha256: 2a229f3c187041881fe9ea45212c9e7f8a1d7b15f5c6b92a4a8fccc92ec8d15d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q5-gemini.md
    snapshot_sha256: 2a229f3c187041881fe9ea45212c9e7f8a1d7b15f5c6b92a4a8fccc92ec8d15d
    entry_key: 6df7a1b435bc0f85cc894e6bb10f7909feb8166158f6557f10d736b4fa2a99c8
  - object_id: AGG-GEO-C2-BASE-Q3-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q3-google-ai.md
    content_sha256: 9547d8186a18af4b7e09b3675389ad8e2802aeeab117659c686a3cef0d256910
    file_sha256: 82c7dc50d3bd36b1c35e79de7e0c65dd2c9d684e966fe575d825b68a51f5d43c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q3-google-ai.md
    snapshot_sha256: 82c7dc50d3bd36b1c35e79de7e0c65dd2c9d684e966fe575d825b68a51f5d43c
    entry_key: 6f1c38a7c1a0e6881716915d53b3fdca0190829503ec4de9833c85dee91f261f
  - object_id: AGG-GEO-C2-AFTER-Q3-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q3-claude.md
    content_sha256: 4d18c4d4ab055bdc778eda23d76725aff5185b1babfb8cbda8d3619ce97a755c
    file_sha256: 2549576e8edd9d6b891d9898eb2e67664fca8d9de97756d2572c49746095e1c9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q3-claude.md
    snapshot_sha256: 2549576e8edd9d6b891d9898eb2e67664fca8d9de97756d2572c49746095e1c9
    entry_key: 6f9186045b1bf7fc426faa570669b080729f7f0a6115e35ffbafcb854a071335
  - object_id: SMP-GEO-C2-BASE-Q4-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 41b216931ad157d71668012399934ca649effd3252577c601af4a0e794912a4b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-chatgpt-2.md
    snapshot_sha256: 41b216931ad157d71668012399934ca649effd3252577c601af4a0e794912a4b
    entry_key: 70847607c474f8e8d276b7191b894583193c3120930f9c7a8977a2a31e5ebb15
  - object_id: AGG-GEO-C2-AFTER-Q6-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q6-claude.md
    content_sha256: 10188fb5f8f92b7f2cb17e22f3596eca4758ee6c18e7ab1427d2d4684d9fbff4
    file_sha256: e8bf61045e62e5debe487b99883b24f5cc5c7844ec2ad0efb4194ba71bb37b33
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q6-claude.md
    snapshot_sha256: e8bf61045e62e5debe487b99883b24f5cc5c7844ec2ad0efb4194ba71bb37b33
    entry_key: 71e2f48f0de8eafc75d342a90574be2d8f8bd038d8af4f1f5a0d0307a9e1bc11
  - object_id: ARV-GEO-C2-BASE-Q1-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-gemini-2-reviewed.md
    content_sha256: 10fd996ddc398e457aab9a5d9f75b1a055d0d3d42a7acc5868c9057a37835030
    file_sha256: 2d1a8c337c6c3faad7e1344df7281725059eb455846bda67a27438f2d08f22c2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-gemini-2-reviewed.md
    snapshot_sha256: 2d1a8c337c6c3faad7e1344df7281725059eb455846bda67a27438f2d08f22c2
    entry_key: 729b50e868234cfe24566eca495092e95d5c84c427d21779a799d39b66fabfd8
  - object_id: ARV-GEO-C2-AFTER-Q5-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-perplexity-2-reviewed.md
    content_sha256: 439ad7d00a117aa97d80b30694fca565a6ce97eba9e01fbee4a1cda9e4852593
    file_sha256: 18021fad175dc0a5b2bc076206fb50a644aaa098f3184d777cff730a4218f377
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-perplexity-2-reviewed.md
    snapshot_sha256: 18021fad175dc0a5b2bc076206fb50a644aaa098f3184d777cff730a4218f377
    entry_key: 72d5bdc3a09b737454bf7d5d0935d0af25bdc0e34d14506a894457b4189d8fd5
  - object_id: DOC-GEO-E2E-AUTOMATION
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-automation.md
    content_sha256: bcbbe60c40d08b23ad454416f2579068f38b6ef5948112a8919aac919c07e309
    file_sha256: 37f5b37285d0c1e58c1005683308e62a5feb7fb175e36aa0d61559e9adaaadc2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-automation.md
    snapshot_sha256: 37f5b37285d0c1e58c1005683308e62a5feb7fb175e36aa0d61559e9adaaadc2
    entry_key: 73f5ba02f4eda875f9d762a77275ea79c8e65339681130a5658f306e4cf051a9
  - object_id: ARV-GEO-C2-BASE-Q4-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-chatgpt-2-reviewed.md
    content_sha256: 4639a3eae1295b507aa2f68c214f48a1e60899abfac999a3ff2b5af8354598b2
    file_sha256: 5d274ceaf8d783d912e24b370604e0c2c8d494d98155da01356135ca45f2a931
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-chatgpt-2-reviewed.md
    snapshot_sha256: 5d274ceaf8d783d912e24b370604e0c2c8d494d98155da01356135ca45f2a931
    entry_key: 749b8fcdc73cbce6f1032e35dc098414a0620873d3d4a931cf1a1765bfd8e71a
  - object_id: SMP-GEO-C2-BASE-Q5-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 92af088a4c3b84f811727377cad30264402253dfb8fd50d5ef0efb139985f5e5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-gemini-2.md
    snapshot_sha256: 92af088a4c3b84f811727377cad30264402253dfb8fd50d5ef0efb139985f5e5
    entry_key: 75a452c4843c18f6b0133472355058ab51ce5ff0d76843dcbc229e66b238f2f1
  - object_id: DOC-GEO-E2E-COMPARISON
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-comparison.md
    content_sha256: c9d8ef1bc1ed48d79cdf7315db7f9aec3f3b4b1ab78720bca2db9797b760e4fa
    file_sha256: 86fbdfeafb3d3957ddabfb73aa2e7971ffabfe25ea4176f589cf828377de7408
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-comparison.md
    snapshot_sha256: 86fbdfeafb3d3957ddabfb73aa2e7971ffabfe25ea4176f589cf828377de7408
    entry_key: 75fa5c9b44623ff2487fa8534f65273f4c275f00f48b62b461b675632cfcb67d
  - object_id: AGG-GEO-C2-BASE-Q2-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q2-chatgpt.md
    content_sha256: a44c763afd940dfbc92a13b57c4f6241f38c1f95f7d020d90488a1650de49a4f
    file_sha256: 152e1686dd4fdfbe2cea1db74af120707c569f9f676d859235d7e7f4e4962926
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q2-chatgpt.md
    snapshot_sha256: 152e1686dd4fdfbe2cea1db74af120707c569f9f676d859235d7e7f4e4962926
    entry_key: 7618c3cf9208a61a9d69e2e16a97029360d372becd95f3ce9561e556cb80e700
  - object_id: SMP-GEO-C2-AFTER-Q4-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: c90591f941c17b90297bd2e0a8a40493f36e5d8c1304feccf4633dd886d6ca83
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-perplexity-1.md
    snapshot_sha256: c90591f941c17b90297bd2e0a8a40493f36e5d8c1304feccf4633dd886d6ca83
    entry_key: 773b3d2d2e95be04a7ae0b0a69f1519c5fbce7f2b210b2d4bd91f291003cbaf3
  - object_id: SMP-GEO-C2-BASE-Q1-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 20e5aefb61ddfd421557f9e5610e25ce9e478ecd93f39d37199365e9d647f2bc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-chatgpt-2.md
    snapshot_sha256: 20e5aefb61ddfd421557f9e5610e25ce9e478ecd93f39d37199365e9d647f2bc
    entry_key: 7760e3c855f25c9b01fe652fd86ecc3a32012f4cc0fbd0af881a068181beb4f6
  - object_id: AGG-GEO-C2-AFTER-Q1-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q1-perplexity.md
    content_sha256: 91ec4c4ceea22236d80b5fa8aa5eab4efa17d5201628cb0a443740b221982bc0
    file_sha256: 472dfff03af5581d900099f8b81779594e12e095bc86dcca7925e08926801580
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q1-perplexity.md
    snapshot_sha256: 472dfff03af5581d900099f8b81779594e12e095bc86dcca7925e08926801580
    entry_key: 778b73ff20962b74a2d295920fd2d3d6d9b9462a3d8c0f3388db296e829f353f
  - object_id: AGG-GEO-C2-BASE-Q6-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q6-google-ai.md
    content_sha256: 63e258b095c6abe9dc10c0cec3d5c2325497ddfdc20c2d8463c811dd0b260618
    file_sha256: 1caa032fc25c08d91609c6c1bedad69a28961ea4add1ecb7f8c153d58f625329
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q6-google-ai.md
    snapshot_sha256: 1caa032fc25c08d91609c6c1bedad69a28961ea4add1ecb7f8c153d58f625329
    entry_key: 78d404a0c8653029d1ee5e5781749b53c942e592917795ec9f9ce896ada3d7b4
  - object_id: CPF-GEO-E2E-C2-BASE-GEMINI
    record_type: collector_profile
    object_version: 1.0.0
    object_path: cycles/preparation/profiles/cpf-geo-e2e-c2-base-gemini.md
    content_sha256: 88f518c05bd10c7733d4e122fef3e355706c232456bb947f2fd8d25e945d5eee
    file_sha256: ca09fd3d4a453dfe4a94e3dff99835dfa20382b21af06856bb3a78928d07e1d3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/preparation/profiles/cpf-geo-e2e-c2-base-gemini.md
    snapshot_sha256: ca09fd3d4a453dfe4a94e3dff99835dfa20382b21af06856bb3a78928d07e1d3
    entry_key: 796e7ec1062a62bb6430786e36155d439fa217052aa67fe179d145246a05ecce
  - object_id: ANS-GEO-E2E-C2-6
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c2-6.md
    content_sha256: 5c2bcef41ad05e9ebff5e0df7b83b327fabab171710b8c75e61e8dd1c256f5d3
    file_sha256: 7b7984337156e77e662af43ddbf95fd1badac2128b696d4c2f89987de8b18053
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/answer-cards/ans-geo-e2e-c2-6.md
    snapshot_sha256: 7b7984337156e77e662af43ddbf95fd1badac2128b696d4c2f89987de8b18053
    entry_key: 79dbc387e105981e6818b45c71cf11608c1f060dee3b78b23ef0aef73e64708b
  - object_id: ARV-GEO-C2-BASE-Q6-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-claude-2-reviewed.md
    content_sha256: c7be9cb2fe8bf0bb316f80787e06b8a4e3e196d7b0cc5ebed238a11053d6ef45
    file_sha256: 2e3958e79dcbfd3d802859e3302f2f40c09257bb5015a983461499be81fe3b20
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-claude-2-reviewed.md
    snapshot_sha256: 2e3958e79dcbfd3d802859e3302f2f40c09257bb5015a983461499be81fe3b20
    entry_key: 7ac5e08e291a5860dc046411943a29c9ee5fc01558d279bcd7b6b735e4f314da
  - object_id: ADR-GEO-C2-THIRD-PARTY-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c2-third-party-decided.md
    content_sha256: 3c61a8315b3065c010b30771ca5c09f1fc9719896921af90602faa62f68263dc
    file_sha256: 82166b6d2338de582d83a9673a1c1be6b97e950c9957d3c4b649f3598718a216
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/adoptions/adr-geo-c2-third-party-decided.md
    snapshot_sha256: 82166b6d2338de582d83a9673a1c1be6b97e950c9957d3c4b649f3598718a216
    entry_key: 7b02218e9d4a011f35e04e28b6ecfe6cf5198b8f661278cabb092a3d017b12b2
  - object_id: AGG-GEO-C2-BASE-Q2-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q2-gemini.md
    content_sha256: 9f78ba17f71217b02756a8757a3f211dfedff24c4007fe9a80bbb032e3dde58d
    file_sha256: 1a9e75ace186c2ba0d9f8ae4ae3561f457ceb876ae7bd9d7bab6693bcb66e4be
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q2-gemini.md
    snapshot_sha256: 1a9e75ace186c2ba0d9f8ae4ae3561f457ceb876ae7bd9d7bab6693bcb66e4be
    entry_key: 7c0b2e065a4005a4ad11ef3d13cb9a6e59c7126622299bdce48d0c93247d299f
  - object_id: SMP-GEO-C2-BASE-Q3-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: e91e9cd0b6713dc7801c10ef09c1179a604fbc4fe8b65d0a67633d0db9aa78e7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-google-ai-1.md
    snapshot_sha256: e91e9cd0b6713dc7801c10ef09c1179a604fbc4fe8b65d0a67633d0db9aa78e7
    entry_key: 7c0db7f617e29a2f21fdb34d1b37124df6795db20c0d2d08ac9740ffd2cc9f5b
  - object_id: ARV-GEO-C2-AFTER-Q1-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-chatgpt-1-reviewed.md
    content_sha256: 8b0387a54ed0a99d1969bd3b2e7143e2e4ae09771d6a324b0e0e99a0ebf24eef
    file_sha256: d7911c97accc4d1a0e5d22a3b109fc13d2b5843210a21dcb20e00e168170c475
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-chatgpt-1-reviewed.md
    snapshot_sha256: d7911c97accc4d1a0e5d22a3b109fc13d2b5843210a21dcb20e00e168170c475
    entry_key: 7d5f056bf861c1a8e40f135713d17ec61ac06f796b0421b1f095dfd7410b0518
  - object_id: DOC-GEO-E2E-GUARANTEES
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-guarantees.md
    content_sha256: e3b9d1f5840bcc95fd731f489ca5a8ae1d48641023aa6a2f32921ee1f2471649
    file_sha256: 717158bad2b2283b18de266b7589bf84d99c292f055659502b19bc70cb548262
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-guarantees.md
    snapshot_sha256: 717158bad2b2283b18de266b7589bf84d99c292f055659502b19bc70cb548262
    entry_key: 7e3d0d941713aade1eec1dce35ed0aef26b41558202ef2b4524a98421ca1bc8f
  - object_id: ARV-GEO-C2-AFTER-Q1-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-gemini-2-reviewed.md
    content_sha256: cf7ef84c803c6ac69799ac05c88698af0daa06c0115bac8af44f19e58bfb06f4
    file_sha256: faa1ec54a2020f0036278d48af5a07fa823632f4a18a721d27784424c682ff55
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-gemini-2-reviewed.md
    snapshot_sha256: faa1ec54a2020f0036278d48af5a07fa823632f4a18a721d27784424c682ff55
    entry_key: 7e77a06acee3523c8a76f68b620d64f1f6e2966f0079e92360e3352eb093c021
  - object_id: AGG-GEO-C2-AFTER-Q3-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q3-chatgpt.md
    content_sha256: 2ff1034ece66a2c277a86d0ee4e82e1a450cb998745c353016df1ff1b731cb23
    file_sha256: 5429a1c5d1029c7de4fc837b1216a906bb988f94859580c40d03c743404aeabf
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q3-chatgpt.md
    snapshot_sha256: 5429a1c5d1029c7de4fc837b1216a906bb988f94859580c40d03c743404aeabf
    entry_key: 7e95c504828d0d598edaa96735b82f3256db1e88191c9999db4aaec1757a63d9
  - object_id: SMP-GEO-C2-AFTER-Q4-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 39368e1bee08fc46472510c9e7637d89e95e429a7288c27e03499ef370ddeba0
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-gemini-2.md
    snapshot_sha256: 39368e1bee08fc46472510c9e7637d89e95e429a7288c27e03499ef370ddeba0
    entry_key: 7eb8e0ed9a96dc58ea93a69658de29be43bf4d402355d04234bde865b90ad1a6
  - object_id: AGG-GEO-C2-BASE-Q1-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q1-perplexity.md
    content_sha256: c3ce97665ab794f247f5e7b97ef64e1a920cb189998f95d4ff9f0fa0c0d4c863
    file_sha256: 601ff68cd321cffe35cba358fe0c9e38c6edcae628e885f15bacadc56b81e5ed
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q1-perplexity.md
    snapshot_sha256: 601ff68cd321cffe35cba358fe0c9e38c6edcae628e885f15bacadc56b81e5ed
    entry_key: 7ec75df7c80a1ced7fdd3d72527af4ed580cb1fb0d630b9148356660a2506c44
  - object_id: EVD-GEO-E2E-CASE
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-case.md
    content_sha256: 9cddd8a4732579c1ea633d2c66b028f8d72aeb6f15123fc3543b52cbf17e1df7
    file_sha256: 26424a837b2587aea6b65bf7f57a11d0c4e91920a057c460d871fcfe3992a3f1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-case.md
    snapshot_sha256: 26424a837b2587aea6b65bf7f57a11d0c4e91920a057c460d871fcfe3992a3f1
    entry_key: 7ef4579ef9ac93c7c3af7dccf3d56c73f71a0e6fea5abedae226c62e54dfebab
  - object_id: ARV-GEO-C2-AFTER-Q1-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-perplexity-1-reviewed.md
    content_sha256: 6c73951a8651d7a7330290927e7753c407f757fc6beab5ce181982480020ff04
    file_sha256: 8decac4a2ef33b11562eacf75b3fa6f5d4dd64a580c74240b2add064773c2737
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-perplexity-1-reviewed.md
    snapshot_sha256: 8decac4a2ef33b11562eacf75b3fa6f5d4dd64a580c74240b2add064773c2737
    entry_key: 7f5071b2e8a0857d3d49fc947cdecd09b97c4ec37ef2be950988f8bf6cde5fa1
  - object_id: ARV-GEO-C2-BASE-Q5-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-gemini-2-reviewed.md
    content_sha256: def54416bcade5975bf5e09d13de3b4e4b2166ec83c2de5a5a717e7da7dd92b0
    file_sha256: 3c03c43052308d84f74a817b316b0304e98c1f2f96ca5ff375ae739c9abc3f75
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-gemini-2-reviewed.md
    snapshot_sha256: 3c03c43052308d84f74a817b316b0304e98c1f2f96ca5ff375ae739c9abc3f75
    entry_key: 7fc3247b50b1b8bc40efa93f6e3aad7dfe62b6d9b1780fe51895d9a099c2f754
  - object_id: ARV-GEO-C2-AFTER-Q2-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-claude-2-reviewed.md
    content_sha256: 33fe3b5d7738757d458ae898583713e392fcc6645aeb977b758b6af2daff4da7
    file_sha256: 886579aa80999b92049a7ccb0fce4d6d9dd2b44304128c876ef7d737ab433a92
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-claude-2-reviewed.md
    snapshot_sha256: 886579aa80999b92049a7ccb0fce4d6d9dd2b44304128c876ef7d737ab433a92
    entry_key: 8013fe202ac7037a83a76b357330c3fed280ff33be08dd4166d28918accfa300
  - object_id: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-2CC4
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-are-the-myyshop-rehearsal-en-2cc4.md
    content_sha256: b666ae7a7be8ab816071ceff77dbc6bb209585b62186276eb7313480e21043b2
    file_sha256: 2260f2390b69f5a282a2e068a03360536daafc6a4182c94ace3540e09fbc4f60
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/queries/candidates/q-what-are-the-myyshop-rehearsal-en-2cc4.md
    snapshot_sha256: 2260f2390b69f5a282a2e068a03360536daafc6a4182c94ace3540e09fbc4f60
    entry_key: 80a4fe6db2ab245d3b3c6fd179281b6b07513f70e17c6ccef6b199cd6dcb3911
  - object_id: SMP-GEO-C2-BASE-Q4-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 7450c52f7510d49cdb1782a39ae75e9579c616583a808d9763ce3a42e31152ee
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-gemini-1.md
    snapshot_sha256: 7450c52f7510d49cdb1782a39ae75e9579c616583a808d9763ce3a42e31152ee
    entry_key: 81de11f6003e0a907aec67dd972033f7124537f15813ad473612615e1b07a98b
  - object_id: SRC-QINPUT-B4A7F3A49879D5F3DE0E
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-qinput-b4a7f3a49879d5f3de0e.md
    content_sha256: 008a198305b88428becd4730fe78ab7318db0dc85237e33cc1194bbcaf7f3b0e
    file_sha256: aa39e902218d1f30c45efa5cf9f7d2c5a673592c315e97554a7efe8543f89a90
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-qinput-b4a7f3a49879d5f3de0e.md
    snapshot_sha256: aa39e902218d1f30c45efa5cf9f7d2c5a673592c315e97554a7efe8543f89a90
    entry_key: 82c82a6401cb9094a17fe744a9bffc27520cebfc0e097e1c36a4a36e95ac79bf
  - object_id: SMP-GEO-C2-AFTER-Q5-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: a8c5384d785019050495b3b65c1a8e6f739ddbe5937c54a947905c1ee04899e3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-gemini-2.md
    snapshot_sha256: a8c5384d785019050495b3b65c1a8e6f739ddbe5937c54a947905c1ee04899e3
    entry_key: 8343ede2eae9bdf41a98a40f3e66f09db5c9761118d0cbcfa88cf143ecb37949
  - object_id: AST-GEO-E2E-C2-THIRD-PARTY
    record_type: asset
    object_version: 1.0.0
    object_path: assets/external/ast-geo-e2e-c2-third-party.md
    content_sha256: 8af1c6d04690a5b34f37be79f4a180dfce3137bd93190190fbb055bd56a9bc2e
    file_sha256: 73fbd4e1bb34e5579ed5166d665804d711121e59fddccb7ab61c4dcefb6725dc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/external/ast-geo-e2e-c2-third-party.md
    snapshot_sha256: 73fbd4e1bb34e5579ed5166d665804d711121e59fddccb7ab61c4dcefb6725dc
    entry_key: 839293667d35ceb51842f22838f68fc0271273dc4db1932306e47693d5da61ea
  - object_id: ARV-GEO-C2-BASE-Q1-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-claude-1-reviewed.md
    content_sha256: 21db148fba5788e40fc1902065137275a797d35cdf6a5d87f19ca7e9b97ae132
    file_sha256: 7bff8070eed505872c3a75fe332b5446c164aeb83bc14ad80c9d67e88bd37099
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-claude-1-reviewed.md
    snapshot_sha256: 7bff8070eed505872c3a75fe332b5446c164aeb83bc14ad80c9d67e88bd37099
    entry_key: 83c089cc330fa2ec951235a30a71367936d379ba430bbf054a0f823b0bbd2800
  - object_id: SMP-GEO-C2-AFTER-Q5-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1d5a20c38c77803999ce18ce3c5b957944cd42f401614bd1325992cd52ce9ff5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-claude-1.md
    snapshot_sha256: 1d5a20c38c77803999ce18ce3c5b957944cd42f401614bd1325992cd52ce9ff5
    entry_key: 84d71ff1bc23e080d03881ce5ed7c9581e9dddb6614249db0896a54f96052f80
  - object_id: SMP-GEO-C2-BASE-Q3-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 145ef2b2fed9049a0a1188830c1dcc79c45305a8390cc94f013b5a5e0041bd07
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-claude-1.md
    snapshot_sha256: 145ef2b2fed9049a0a1188830c1dcc79c45305a8390cc94f013b5a5e0041bd07
    entry_key: 85859a493647952bffcd29e147e59216c7b0874ad8d814f5ee3995395e3d744b
  - object_id: SRC-GEO-E2E-AUTOMATION
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-automation.md
    content_sha256: 93e1c25d15e397d249e71905bd51a80b5af9be0d998e9032667dd3402089e880
    file_sha256: a129f8fdc3f90cefa4592d13d7f3ae4dc6ef5af8b864ef9c2635c41af870f6e9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-automation.md
    snapshot_sha256: a129f8fdc3f90cefa4592d13d7f3ae4dc6ef5af8b864ef9c2635c41af870f6e9
    entry_key: 859dca714c9823f707021eaafa0d892f8bcd9ef5b1769b2ac777ffdd66a1fc3c
  - object_id: ARV-GEO-C2-BASE-Q1-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-chatgpt-1-reviewed.md
    content_sha256: 6d87b375141a8e9b7eafe32e746f44dc59ce1004c2e422186bcce4ec0b231552
    file_sha256: c1a332652df539565d290a667d84bc3bfe719bcd78059cfa72f8ae15ac0cd52f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-chatgpt-1-reviewed.md
    snapshot_sha256: c1a332652df539565d290a667d84bc3bfe719bcd78059cfa72f8ae15ac0cd52f
    entry_key: 86cf0769e23d97010bf38eebe00cf9e9284d1c800ae09bb18ca476f6cf1ee979
  - object_id: ARV-GEO-C2-BASE-Q4-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-gemini-1-reviewed.md
    content_sha256: bdf8a948b7c40cf1373f773444e69abb6f1d71a391a8ac88e8802ae16cabff33
    file_sha256: d4fffb3a7d4df9da02e6a356e328794ea31e383a193b84a5af2df246334aea4a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-gemini-1-reviewed.md
    snapshot_sha256: d4fffb3a7d4df9da02e6a356e328794ea31e383a193b84a5af2df246334aea4a
    entry_key: 86faa49d54289c5afa7ee403127a4f56e7ecb05dc990a09db58775604c0ff6a1
  - object_id: ARV-GEO-C2-BASE-Q2-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-chatgpt-2-reviewed.md
    content_sha256: 3f3f9c7d44657bfc6062f04f2f097e92b7aa6c2fd81302f00c51ce412f236b9d
    file_sha256: 67980685cdece5a0efa84f92a83f5fe9c524512fc4cadefec6156442862aa9a1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-chatgpt-2-reviewed.md
    snapshot_sha256: 67980685cdece5a0efa84f92a83f5fe9c524512fc4cadefec6156442862aa9a1
    entry_key: 86ff27c314e9bf6169e50142e2312ca3695ae5339aa4eaba099cf19031a68622
  - object_id: SRC-GEO-E2E-REFUND
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-refund.md
    content_sha256: d8d34b9f234e97400b8a96db2edb8664e4889192426a0a6be8fd884fc28b1808
    file_sha256: f2df70df2218b51a1071d7429669960a4f3a82cf30219cd596603a04b62a58fb
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-refund.md
    snapshot_sha256: f2df70df2218b51a1071d7429669960a4f3a82cf30219cd596603a04b62a58fb
    entry_key: 8733ccb5aff6d364158f14e5650c32d3f63374c921d1f9bf9b4af4e825df6fcf
  - object_id: ANS-GEO-E2E-C2-1
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c2-1.md
    content_sha256: 39187b640ae837ce838bfd3b61cf447bf43e56102a6638769a0fb1e417a559fd
    file_sha256: e1b536e9072a15797f99a5decb1d0e776a1c55d24932afbc8974bcd9bbf0dc03
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/answer-cards/ans-geo-e2e-c2-1.md
    snapshot_sha256: e1b536e9072a15797f99a5decb1d0e776a1c55d24932afbc8974bcd9bbf0dc03
    entry_key: 879d919e21b39ecf1e205b17b9dd6d6dcd051c1edcd6de8f34787a51ea902949
  - object_id: SMP-GEO-C2-BASE-Q6-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: d60f8bd669d4629a5faeb19a9dfe272b3fc2bb2b3bef3de942fd2614f5eaa168
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-perplexity-1.md
    snapshot_sha256: d60f8bd669d4629a5faeb19a9dfe272b3fc2bb2b3bef3de942fd2614f5eaa168
    entry_key: 881ce4af8ea02c72a3b5afa4aa81e537cf83793fd827733271b78afd85f65afc
  - object_id: PUB-GEO-C2-OFFICIAL-V2-CONFIRMED
    record_type: asset_publication
    object_version: 1.0.0
    object_path: assets/publications/pub-geo-c2-official-v2-confirmed.md
    content_sha256: 1c0c33fdfcffcfbc504619320ee79346921a06320df0254e0e237cfd34e70b03
    file_sha256: 83e4f4555f1843d1c6718d207b5381fb8d0b7d3583a52e79a6db8eca8b887df2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/publications/pub-geo-c2-official-v2-confirmed.md
    snapshot_sha256: 83e4f4555f1843d1c6718d207b5381fb8d0b7d3583a52e79a6db8eca8b887df2
    entry_key: 88b6e5d4eae593104791df8da1dca580427c394f05add939bc631ae88df6eb7d
  - object_id: ARV-GEO-C2-BASE-Q2-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-gemini-1-reviewed.md
    content_sha256: 45866d9b49217ca41167501e64d794561c4417258cac82ce9de04602dc667a0e
    file_sha256: 184f3c30ea6e7011f427444857d64fc8a58db2361a3b02983be81520f511b778
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-gemini-1-reviewed.md
    snapshot_sha256: 184f3c30ea6e7011f427444857d64fc8a58db2361a3b02983be81520f511b778
    entry_key: 893ef75ca866024c1d10aaba5489031e77b54ca7d6191ce7198b8273d006572e
  - object_id: FND-GEO-C2-OWN-1
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c2-own-1.md
    content_sha256: 58663e78e4755e02057dd5e5855bbbe5154420006653b3e7cc0c16aff2a9c0fb
    file_sha256: 0ee9b2ec74fe236ed76028a0047d30989b3ddf8f0e7469650c14b2f5b9397187
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-c2-own-1.md
    snapshot_sha256: 0ee9b2ec74fe236ed76028a0047d30989b3ddf8f0e7469650c14b2f5b9397187
    entry_key: 8986be4e94734b0455797591355ee16a2c67cd44e3cba207aaedf4ecce9b8482
  - object_id: AGG-GEO-C2-AFTER-Q5-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q5-google-ai.md
    content_sha256: c62c1451f7822f1ca0d20a1614645cfb5324037109f6bfbcbb59031b71fcfa4e
    file_sha256: 3b0987308d214b11d379c6ed4172c8a4a30d2864be3311425ef0605463061807
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q5-google-ai.md
    snapshot_sha256: 3b0987308d214b11d379c6ed4172c8a4a30d2864be3311425ef0605463061807
    entry_key: 89974501a34dbdff574f889409b093ae0e726e0110f51a2d8b54f656db61efc7
  - object_id: AGG-GEO-C2-AFTER-Q5-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q5-perplexity.md
    content_sha256: 1f336254841c950112723be0001e5e04bd942385f02b928e5b8700534dff51d5
    file_sha256: bfc7da1f000a88c1f3110b0accd384ec355c5a781c8525d8f538d2134fd7cafd
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q5-perplexity.md
    snapshot_sha256: bfc7da1f000a88c1f3110b0accd384ec355c5a781c8525d8f538d2134fd7cafd
    entry_key: 8a0265652b19bdb9f7a5035083288877537b617029ec6ffb11040f334797f4da
  - object_id: Q-HOW-SHOULD-I-COMPARE-THE-EN-5087
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-how-should-i-compare-the-en-5087.md
    content_sha256: 39187b640ae837ce838bfd3b61cf447bf43e56102a6638769a0fb1e417a559fd
    file_sha256: e93fde825a7194ecd400979ba5584902021aead230c8fc0e5b136bfe0fc8423b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/queries/candidates/q-how-should-i-compare-the-en-5087.md
    snapshot_sha256: e93fde825a7194ecd400979ba5584902021aead230c8fc0e5b136bfe0fc8423b
    entry_key: 8bb36f35a8a60e9c58fbd65c4360977210439c3052e42a3883491e1cc8e9369b
  - object_id: SRC-GEO-E2E-GUARANTEES
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-guarantees.md
    content_sha256: c05c6c819824b4a3bbbe50587e611d97dc478fa9777acc9ab0371c4133722b0f
    file_sha256: f4dd7b79796c549b8bf1cb89a22e09efea49bfe4a3e5f4de80ce9d417045b6cf
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-guarantees.md
    snapshot_sha256: f4dd7b79796c549b8bf1cb89a22e09efea49bfe4a3e5f4de80ce9d417045b6cf
    entry_key: 8c1ad8740ab4465fe7045517b40fed0a8c8f9162f940732a2e58fd1936547e51
  - object_id: ARV-GEO-C2-AFTER-Q3-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-perplexity-2-reviewed.md
    content_sha256: aa2bdd18ed336fbc1284bfbfbc5d30c7924a094b40facb774cc311f3c964bf9a
    file_sha256: de10a766b24cad9f013ae48dd77c4015be673aec9edc42f11bea29b808455ad1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-perplexity-2-reviewed.md
    snapshot_sha256: de10a766b24cad9f013ae48dd77c4015be673aec9edc42f11bea29b808455ad1
    entry_key: 8cbe0522fa6d49911c61171212941a8541a97633e01d2fc8d949c46f356b5794
  - object_id: ARV-GEO-C2-AFTER-Q2-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-gemini-2-reviewed.md
    content_sha256: 3d89fb6ada1046521a03e44bb254ce4f86a5a50b4983ef0023d1005021728ad4
    file_sha256: 41944488cf5d4b23fe14fbe0cdd45ab21a4e81ee0aaa75395ee06e2e72b28cdb
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-gemini-2-reviewed.md
    snapshot_sha256: 41944488cf5d4b23fe14fbe0cdd45ab21a4e81ee0aaa75395ee06e2e72b28cdb
    entry_key: 8cf2e8b778d54c0af272458488f7e27e2c7ceadb41969bfcca06e490b9215ecf
  - object_id: KR-GEO-E2E-C2
    record_type: knowledge_release
    object_version: 1.0.0
    object_path: knowledge/releases/kr-geo-e2e-c2.md
    content_sha256: 18f1cd1c0da4a57c72f02c5d8cee707ea730156d7dc62674996b1ac17bd31f4c
    file_sha256: 17371b3877324ecb4ab048fd54d442b6d3ebb0c221fbd6d5aa28f68c5a7d61ba
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/releases/kr-geo-e2e-c2.md
    snapshot_sha256: 17371b3877324ecb4ab048fd54d442b6d3ebb0c221fbd6d5aa28f68c5a7d61ba
    entry_key: 8d03e9387eb9ba5850e295e9696ce3a7ef27e81d7f22f8384d6654b402bef013
  - object_id: SMP-GEO-C2-AFTER-Q4-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4ca5789897ca398ce67108eecf7d44fbbc0a7cffb90e49b9c7d5948438d0b912
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-google-ai-2.md
    snapshot_sha256: 4ca5789897ca398ce67108eecf7d44fbbc0a7cffb90e49b9c7d5948438d0b912
    entry_key: 8d7e195b3184e10daa4aa8c9ad3e767329dd8976b7c0631819b7b50efb987bb3
  - object_id: CLM-GEO-E2E-COMPARISON
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-comparison.md
    content_sha256: 24e1cedf6efc20a99384f95baa7f873d352a7f4f44ddb1881a87f22fe10ae271
    file_sha256: feedf7af4e742227854393f7e4ca88a92e8ab17bf6d89455b2e92335025f4a4e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-comparison.md
    snapshot_sha256: feedf7af4e742227854393f7e4ca88a92e8ab17bf6d89455b2e92335025f4a4e
    entry_key: 8df8111339bf49c708b2a48b34a0127074fc294a735ad7bc6b88c9cae217d4e6
  - object_id: FND-GEO-C2-THIRD-PARTY-1
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c2-third-party-1.md
    content_sha256: 04ec91c750ff59e165852d856c454488018f48025c1e1390a6e34b694bd17339
    file_sha256: 06beb58fa4067eb62acfa4dcf7eef53c2221dbf157160e626a1087616b4f677b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-c2-third-party-1.md
    snapshot_sha256: 06beb58fa4067eb62acfa4dcf7eef53c2221dbf157160e626a1087616b4f677b
    entry_key: 8e0cad0187fc2770e0ed4d1ae84749a604626251798bbadc6a8911f8ce1f60d4
  - object_id: CLM-GEO-E2E-ELIGIBILITY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-eligibility.md
    content_sha256: 8ae668b4bb38e19fcc1a10d7ef63231fce19387bea31feb72120f8ec27d0d9f5
    file_sha256: 78b1021f050f3e6eae7ad634107594952385d9266aef35f18be9330af42b7a7b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-eligibility.md
    snapshot_sha256: 78b1021f050f3e6eae7ad634107594952385d9266aef35f18be9330af42b7a7b
    entry_key: 8f5a0479d79664990b78fba7c4c47ca4b6e30f27666e6d29200bdfa68e6a1730
  - object_id: SMP-GEO-C2-BASE-Q5-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: adc4294432f9fcb080fdfb485abe195b9e06c9a22ba928848b71bd5cfc21c035
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-google-ai-2.md
    snapshot_sha256: adc4294432f9fcb080fdfb485abe195b9e06c9a22ba928848b71bd5cfc21c035
    entry_key: 8f6920a21544fcf717670c68a9e619d321ea5bba47b90ac3ff97e21e71419be7
  - object_id: AGG-GEO-C2-AFTER-Q4-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q4-google-ai.md
    content_sha256: c3ff6a5cae779ac7090789924ed4feb56f791f5f7eceb4d6a81e4284e3ef171b
    file_sha256: 9743934d1021c95f38021af0497af6b7013df514efbc3ef6018b30d669dcba84
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q4-google-ai.md
    snapshot_sha256: 9743934d1021c95f38021af0497af6b7013df514efbc3ef6018b30d669dcba84
    entry_key: 902da1a7fd8f4f35a1164cdf9b3864903c96245847283bcac00dc1f4b143fe23
  - object_id: ARV-GEO-C2-BASE-Q6-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-claude-1-reviewed.md
    content_sha256: ba9c61bb151e9642cd00e3162728099b39e5c2dc29f8ee9b46400a639b88c972
    file_sha256: 5affd54c1489390d8605ff2657159b9e4c644cd4add3029440776c4aaaa8d12b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-claude-1-reviewed.md
    snapshot_sha256: 5affd54c1489390d8605ff2657159b9e4c644cd4add3029440776c4aaaa8d12b
    entry_key: 910c1db4c65c9886e2ed6e84bdd7ef89b06e3f08349d435b470764f1d67aac88
  - object_id: FND-GEO-C2-THIRD-PARTY-2
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c2-third-party-2.md
    content_sha256: 0f09c40057e42b636d240e5d400c13836213ad39fc9d0ab74aecc886108f8907
    file_sha256: c1b807afd5fe5e9bade39176e3dc157d0b330aab2e02f7abfb7e2f3c98d78d7c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-c2-third-party-2.md
    snapshot_sha256: c1b807afd5fe5e9bade39176e3dc157d0b330aab2e02f7abfb7e2f3c98d78d7c
    entry_key: 914f12f5382c7a1e2e44633de92425741ba65a9d8a975075f09169e9e5019f1d
  - object_id: SMP-GEO-C2-BASE-Q6-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 139c2e5fb4cb2a6f8457161833667627a41858f4ee6cec37623382b42fd747ed
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-chatgpt-2.md
    snapshot_sha256: 139c2e5fb4cb2a6f8457161833667627a41858f4ee6cec37623382b42fd747ed
    entry_key: 9484f8f54440bb686cf5031305aa50f6112f9a83a8664e9cb587cc3b75352612
  - object_id: ARV-GEO-C2-AFTER-Q2-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-gemini-1-reviewed.md
    content_sha256: f7fe400966654b25a1b921d3903bb9e442990c209941e8c0c1293e4e9e9f0b6a
    file_sha256: 15bd01ee3654d0b237d59dab638bce499ce52327fa76c5eeabc2bce8c379ceb4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-gemini-1-reviewed.md
    snapshot_sha256: 15bd01ee3654d0b237d59dab638bce499ce52327fa76c5eeabc2bce8c379ceb4
    entry_key: 95259121961b1a65298c42f9514be04b95dccbbad38635c2d45d4338829952c4
  - object_id: AGG-GEO-C2-AFTER-Q4-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q4-gemini.md
    content_sha256: 8d9c5c758a23789b211f458aa553e615ba94f074a0fc2b423d2d96611a9c26cb
    file_sha256: b9aa61563c37d01aa4223abc4ba80bb5d2abc99a2b36868c61bbeda76bb391bd
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q4-gemini.md
    snapshot_sha256: b9aa61563c37d01aa4223abc4ba80bb5d2abc99a2b36868c61bbeda76bb391bd
    entry_key: 9549586b60e365b55b13a972ac11013cf4e21d7c6da4174e64e65e2fa1a89d10
  - object_id: AGG-GEO-C2-BASE-Q3-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q3-chatgpt.md
    content_sha256: 8063f0e7dc3a96fae0fd86758a83fb7048632f02842a6ad048f8be8a5f4fc1df
    file_sha256: a260c73e1be5cb45e961d9eeae651067fcd5c448d26b932bbfdd0311cc21b267
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q3-chatgpt.md
    snapshot_sha256: a260c73e1be5cb45e961d9eeae651067fcd5c448d26b932bbfdd0311cc21b267
    entry_key: 98c9cdf7b7411ab8d9b91901ea834480f320f71b64e22bd8f4af6b870122b184
  - object_id: SMP-GEO-C2-AFTER-Q1-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 78492a8eaa44469448241967560bf779301586ea1029cc7a4b4d1bf9f745711e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-gemini-1.md
    snapshot_sha256: 78492a8eaa44469448241967560bf779301586ea1029cc7a4b4d1bf9f745711e
    entry_key: 9b1e55d75ba7bf228e73f2acbf046baa9d97bd1244d51ccb3cdf7f79c2f281ba
  - object_id: ARV-GEO-C2-AFTER-Q5-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-google-ai-1-reviewed.md
    content_sha256: 4145f2fce80c63fde2451a3b507ddd30727ea5f439b10e6120683d5ba0d2ca79
    file_sha256: 617a6b8ad329990a835f7716c64adfaafd166721e79710f1917dfb72900838ba
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-google-ai-1-reviewed.md
    snapshot_sha256: 617a6b8ad329990a835f7716c64adfaafd166721e79710f1917dfb72900838ba
    entry_key: 9c2a400d32ad8b18a6a31a41c19c4f01b014480fe863c06f353269c4882f20c7
  - object_id: SMP-GEO-C2-BASE-Q2-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: e92ce998c0c8e78413b779ddeb869286537b30f79386290a0a6c92b95bd62e26
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-perplexity-1.md
    snapshot_sha256: e92ce998c0c8e78413b779ddeb869286537b30f79386290a0a6c92b95bd62e26
    entry_key: 9d3e6cd560ebe540f7bb1822a6758737b4c065b7c4f37ecd1c6438f1c7fc703a
  - object_id: ARV-GEO-C2-AFTER-Q3-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-claude-2-reviewed.md
    content_sha256: c51b091fe597f1c13104baaa35d17eaee6646fd05c4712f178bb57320143cfad
    file_sha256: 06cc6209afa0d203c34156e57cffc1dbfb3035448a9c428952eb0b97752246ae
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-claude-2-reviewed.md
    snapshot_sha256: 06cc6209afa0d203c34156e57cffc1dbfb3035448a9c428952eb0b97752246ae
    entry_key: 9d52ee2a325bd55a1eea1d241b7b8bc8cf2cf9818961f393cf8dcbe5b76765d0
  - object_id: SMP-GEO-C2-AFTER-Q6-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: f982c0741ca1cf3c45982412ad8c4ca3dfc93acefc5d6eddc535aabb0eeb893a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-perplexity-2.md
    snapshot_sha256: f982c0741ca1cf3c45982412ad8c4ca3dfc93acefc5d6eddc535aabb0eeb893a
    entry_key: 9dfa891825ea4e69dd2ac60129826c59496889d768f1281415f3e73805927dc3
  - object_id: AGG-GEO-C2-BASE-Q3-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q3-claude.md
    content_sha256: dc66941caafb32ede361c385c1fdfd0bba80d72a8999ee413937a1e55f567a7f
    file_sha256: 451f00d586cd13e5288fffe73ced61fee80b0c354f237c0d9666e938da52c113
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q3-claude.md
    snapshot_sha256: 451f00d586cd13e5288fffe73ced61fee80b0c354f237c0d9666e938da52c113
    entry_key: 9e86f2c47929a301dfcd49c5b929cdf1d571da2d0b3aa67f3aeb41c8697cea91
  - object_id: AGG-GEO-C2-AFTER-Q6-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q6-chatgpt.md
    content_sha256: 3c2c16c190f885a39c9597e05e10a41fa919166fa6ca29713875060f6a22bcca
    file_sha256: e0d336b13e7588e201117990ab4025a92467a41409ad23b5a555635838d52e02
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q6-chatgpt.md
    snapshot_sha256: e0d336b13e7588e201117990ab4025a92467a41409ad23b5a555635838d52e02
    entry_key: 9ebfabb286df9dbc008699a347e02609fefd39a2908b9867b71ec705e4e68931
  - object_id: SMP-GEO-C2-BASE-Q6-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 24ae0dff6261f82773e76059d2633a13f137a3b0143d1ce14bfb08e1d0bbc3e4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-gemini-1.md
    snapshot_sha256: 24ae0dff6261f82773e76059d2633a13f137a3b0143d1ce14bfb08e1d0bbc3e4
    entry_key: a07962592a3ab71f2d026552d655f879a5cc0739e87d2c6712572f87e6e46f5c
  - object_id: AGG-GEO-C2-BASE-Q2-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q2-google-ai.md
    content_sha256: 671edd285b88d4e785512d08180f0fd4bbcf0adeafb3d4c9d8c081eb5c493134
    file_sha256: 34801e376012da951e5c002ba9c9a2721d6924f79fb46524b29a71417bc54a81
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q2-google-ai.md
    snapshot_sha256: 34801e376012da951e5c002ba9c9a2721d6924f79fb46524b29a71417bc54a81
    entry_key: a0ba7aaafe1d3899ebb0c321d6142c31c26b82068e51402cadf054a5a851395f
  - object_id: Q-WHO-IS-ELIGIBLE-TO-PARTICIPATE-EN-B8C2
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-who-is-eligible-to-participate-en-b8c2.md
    content_sha256: 5c2bcef41ad05e9ebff5e0df7b83b327fabab171710b8c75e61e8dd1c256f5d3
    file_sha256: 4062fd2a0f22235ea5771ce045929e1f63a32a4df794be94dda4e9b126fa06d2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/queries/candidates/q-who-is-eligible-to-participate-en-b8c2.md
    snapshot_sha256: 4062fd2a0f22235ea5771ce045929e1f63a32a4df794be94dda4e9b126fa06d2
    entry_key: a12730630b7e9abf81c70a4939cb0768d9947f6a2244c544aaeec058c301853b
  - object_id: Q-WHAT-DOES-THE-MYYSHOP-REHEARSAL-EN-0B93
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-does-the-myyshop-rehearsal-en-0b93.md
    content_sha256: 0107ac84d7eca944881fc67072cc42d7210d4e5207c1085ba0deb860c2116774
    file_sha256: c8020b1427b52f8a7186e6f6bf2ed601f29a8b16d9a0e34bde418aaed51e3dd4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/queries/candidates/q-what-does-the-myyshop-rehearsal-en-0b93.md
    snapshot_sha256: c8020b1427b52f8a7186e6f6bf2ed601f29a8b16d9a0e34bde418aaed51e3dd4
    entry_key: a2357a12f0320247ef97b447975fd2a0e5951567ff8ede19dd4178a497db1d5d
  - object_id: ARV-GEO-C2-AFTER-Q2-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-chatgpt-1-reviewed.md
    content_sha256: bf960352feba34326c685a81f1092872fe7d4111dfb2ec9cd02cf3dc83a22436
    file_sha256: 0f742050031183ce4e0f533a6bffcea2b6f9d96063766b2ee118f145c14ec0a9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-chatgpt-1-reviewed.md
    snapshot_sha256: 0f742050031183ce4e0f533a6bffcea2b6f9d96063766b2ee118f145c14ec0a9
    entry_key: a2aa8f44b1b29e6e0bb7736f3cf4b325672555d90e91551011a9ac90e2276245
  - object_id: SMP-GEO-C2-AFTER-Q2-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 60cc41537db496ffe7a74c95c5014c7aa1a2fea1e79d71aae451959fcf3a746b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-claude-2.md
    snapshot_sha256: 60cc41537db496ffe7a74c95c5014c7aa1a2fea1e79d71aae451959fcf3a746b
    entry_key: a362f1e4275ab0b132dcbac0f2418580f1ed656a7ee7193f34e3da8058773838
  - object_id: SMP-GEO-C2-BASE-Q3-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 63feebc245128ffbfb373a433a41b06d546560a3a6615942df5234634ad49e0c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-perplexity-1.md
    snapshot_sha256: 63feebc245128ffbfb373a433a41b06d546560a3a6615942df5234634ad49e0c
    entry_key: a55f15b82085bfd93988906c244874efb2f9377d9ddeef1a71bd592e57c4dd65
  - object_id: ANS-GEO-E2E-C2-4
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c2-4.md
    content_sha256: 0107ac84d7eca944881fc67072cc42d7210d4e5207c1085ba0deb860c2116774
    file_sha256: cfe3b54b8269f960c632b1b7cbada5594d261f0b8ae962bbc6f4007d2d749100
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/answer-cards/ans-geo-e2e-c2-4.md
    snapshot_sha256: cfe3b54b8269f960c632b1b7cbada5594d261f0b8ae962bbc6f4007d2d749100
    entry_key: a58cce75161e6ec18b2863ad514c757d2571dc4151ca410a38bbc21e15d65c6a
  - object_id: SMP-GEO-C2-AFTER-Q5-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 704ded98240d507be0ce6d8ae712cd4cbeeaef69e33fee7266b6205ce4ce91b7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-gemini-1.md
    snapshot_sha256: 704ded98240d507be0ce6d8ae712cd4cbeeaef69e33fee7266b6205ce4ce91b7
    entry_key: a624a32b88c74b3081cb6472f0178b7a1daf4fee022f6c67bff47c9602fa2784
  - object_id: ARV-GEO-C2-BASE-Q3-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-perplexity-1-reviewed.md
    content_sha256: d69f44f2cc13cd44205455dca7f93cf97a9431dcd807a201c154c239d03fb909
    file_sha256: ebe78dbc640e794e9582540c3d0719ff0d77bbfa714eec9ea9c9258018c5d881
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-perplexity-1-reviewed.md
    snapshot_sha256: ebe78dbc640e794e9582540c3d0719ff0d77bbfa714eec9ea9c9258018c5d881
    entry_key: a63de82b03af2a7aeeb0401869112dae3a101febf3b08e8491522623b94ea420
  - object_id: CLM-GEO-E2E-ANSWER-DEFINITION
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-answer-definition.md
    content_sha256: 39e9f04bfbb709f8985c63171446a5d66214132c264165afb6eb98c13a5bbb95
    file_sha256: 58b702e9721c65bfac92306d5e82b7ee40ce72d8175c50ebfa0d880cf947fee1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-answer-definition.md
    snapshot_sha256: 58b702e9721c65bfac92306d5e82b7ee40ce72d8175c50ebfa0d880cf947fee1
    entry_key: a64a68b40061981db10a3303ef3039c761e997a5983311d814fffed8cf1d6d44
  - object_id: RUN-GEO-SITE-C2-AFTER-OFFICIAL
    record_type: run
    object_version: 1.0.0
    object_path: cycles/m4/runs/run-geo-site-c2-after-official.md
    content_sha256: 78e75f0c4e0b93fe82a1b9c618d81f986eff26e1f570616109f493c89c8975aa
    file_sha256: 20272d9596dc7fa8b36a585a3c70b17dc3f9c3329920a2e4952e8fce41b54c73
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m4/runs/run-geo-site-c2-after-official.md
    snapshot_sha256: 20272d9596dc7fa8b36a585a3c70b17dc3f9c3329920a2e4952e8fce41b54c73
    entry_key: a6edc34e784e85b74db87bf277837e34b8941a627d61ec704878d208e6f88ce3
  - object_id: EVD-GEO-E2E-NON-GOALS
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-non-goals.md
    content_sha256: a210c8651cd23b7d74a65e4f99c45cf2a7681b9223ee46b623e3323d308d9020
    file_sha256: d662baf367afdf6645d9317518d4b2b38f5fb95e8ff71635509ad45f7ae9958e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-non-goals.md
    snapshot_sha256: d662baf367afdf6645d9317518d4b2b38f5fb95e8ff71635509ad45f7ae9958e
    entry_key: a6efe0669a947e6d36ed869f1a71437dc21940a985e26ff7e7455808ef6bbd2b
  - object_id: ARV-GEO-C2-BASE-Q5-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-gemini-1-reviewed.md
    content_sha256: d41a5e565d02fdd5440c21dce29e9e204dc28b115e9d06c3b259002b713db7de
    file_sha256: 33c7baa415e7598365ec5e2ce7648db2740581dbc274a7b1317d3466a87b89bb
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-gemini-1-reviewed.md
    snapshot_sha256: 33c7baa415e7598365ec5e2ce7648db2740581dbc274a7b1317d3466a87b89bb
    entry_key: a7ad62698e5d6a38713644a5ebccf9c6c6435af1c18e6cd1e7701ee2e3887976
  - object_id: ARV-GEO-C2-AFTER-Q6-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-google-ai-2-reviewed.md
    content_sha256: 30978c372eee92a0b5eaa9b565f453fe592f60c9f4e1634530a39983c64feb73
    file_sha256: 7b7f5b5ea161341a4b87cb75960f28e73696d01fdc065bd6c0790c38fb2259da
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-google-ai-2-reviewed.md
    snapshot_sha256: 7b7f5b5ea161341a4b87cb75960f28e73696d01fdc065bd6c0790c38fb2259da
    entry_key: a7c6753b5b516070a3f1852d87ee74c20f4bfceadb8fc980918cf74752c17e2b
  - object_id: GOAL-GEO-E2E-C2
    record_type: perception_goal
    object_version: 1.0.0
    object_path: cycles/preparation/goal-c2.md
    content_sha256: 71f7f9a5ae1d9ae5d06a0010134ede582628f8d21ac0c26fc8a2501665623908
    file_sha256: b08dcc39c7bb97edb77937a1f056b55f81f20edef774542ea95b84dd37b5632b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/preparation/goal-c2.md
    snapshot_sha256: b08dcc39c7bb97edb77937a1f056b55f81f20edef774542ea95b84dd37b5632b
    entry_key: a8feb5046c36f2db4beae1e26f777a0a638454598d2ee535062b042505b86b8f
  - object_id: SMP-GEO-C2-AFTER-Q3-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 0acab7ac6a05f05fd9bd552b4586bb49fd940da100ad215673946bccd50dfb69
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-google-ai-2.md
    snapshot_sha256: 0acab7ac6a05f05fd9bd552b4586bb49fd940da100ad215673946bccd50dfb69
    entry_key: a97d42c0db34aeeb5a5dd3e975741404a7927012128f666dbebfbac597f45fdb
  - object_id: ARV-GEO-C2-BASE-Q4-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-claude-1-reviewed.md
    content_sha256: 2d29ef351141f9eec0b4774b8c4d81fae3e8cc6819b00a7846fd489bffcc2e2d
    file_sha256: e045eed93d1bfff48a5c39ea7063717c310b16a21301a92ab843e69cca1bc3a8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-claude-1-reviewed.md
    snapshot_sha256: e045eed93d1bfff48a5c39ea7063717c310b16a21301a92ab843e69cca1bc3a8
    entry_key: a9b8e9affdb81e7595be68bad0c2c1390a863154752a0f3cc29fcc1fb8d00ff3
  - object_id: SMP-GEO-C2-AFTER-Q6-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: c2c43b0d93a8232a8cb88a5a19a7ed03d65e897f38c3e53b803b389d8aaf9a70
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-chatgpt-2.md
    snapshot_sha256: c2c43b0d93a8232a8cb88a5a19a7ed03d65e897f38c3e53b803b389d8aaf9a70
    entry_key: ab251b7439482ecac65787317df3cdbab5a56804f6e223ab26da27d02cf355f0
  - object_id: CLM-GEO-E2E-NON-GOALS
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-non-goals.md
    content_sha256: a210c8651cd23b7d74a65e4f99c45cf2a7681b9223ee46b623e3323d308d9020
    file_sha256: 2c14e22e093b65c494c6480d3a9044abd65bd072d9edcde129dfa59555a13943
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-non-goals.md
    snapshot_sha256: 2c14e22e093b65c494c6480d3a9044abd65bd072d9edcde129dfa59555a13943
    entry_key: ab73c991d1e234d20202580b2877e0a8af650f0cc044bff7c498f4b826e05334
  - object_id: PRP-GEO-C2-OFFICIAL
    record_type: asset_proposal
    object_version: 1.0.0
    object_path: assets/proposals/prp-geo-c2-official.md
    content_sha256: c99b8cb6468032f7fcc3f3fb20b25f3fd0be38ccc5b8b110a093f5527b5cee75
    file_sha256: 4e3487e741f8dcccb6d9f04729b1ce9ecf2fa0b0ae61f01f74d268f4415f7a4e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/proposals/prp-geo-c2-official.md
    snapshot_sha256: 4e3487e741f8dcccb6d9f04729b1ce9ecf2fa0b0ae61f01f74d268f4415f7a4e
    entry_key: ac05aa545c4932528ab44dc49ef4befd083d72c6ed91784f860835d17a51d4d0
  - object_id: EPL-GEO-C2-OWN-1
    record_type: evidence_plan
    object_version: 1.0.0
    object_path: evidence/plans/epl-geo-c2-own-1.md
    content_sha256: 77f7fa9817029cd22399a9b9d6cba84bc5bf1c0cc8e98fe50ab467109becf65a
    file_sha256: 913088b554ef270e0d682b5ece92955d3f4a6bff5df50354653b62839365da16
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/plans/epl-geo-c2-own-1.md
    snapshot_sha256: 913088b554ef270e0d682b5ece92955d3f4a6bff5df50354653b62839365da16
    entry_key: ac10cf70f59b49d147d053b0cbdaf1d86f1a27ac1ff4a8e0395380b0976d0eae
  - object_id: SMP-GEO-C2-AFTER-Q3-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1839be39151117ffa6c8cd5618695c50c47edf58359063cdc6799e6f75d29a48
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-gemini-1.md
    snapshot_sha256: 1839be39151117ffa6c8cd5618695c50c47edf58359063cdc6799e6f75d29a48
    entry_key: ad404ec1536b90725fd5dc3f3e75833c8229f12e03761992f15f826711530074
  - object_id: ARV-GEO-C2-AFTER-Q3-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-chatgpt-2-reviewed.md
    content_sha256: 52d77235dc155179fc3ce3cfd1cdde13fb8d0ecb1cc8037d75d055f2cb2908d5
    file_sha256: 4d9829204a14d4009a7aaa514c6364774d6f64dba4f5b7244537607dc054ecb9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-chatgpt-2-reviewed.md
    snapshot_sha256: 4d9829204a14d4009a7aaa514c6364774d6f64dba4f5b7244537607dc054ecb9
    entry_key: adb7d5c4411e7428a3e7983b0b771e1eba113c095e5f9464bfd544001d91469f
  - object_id: ARV-GEO-C2-AFTER-Q2-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-perplexity-2-reviewed.md
    content_sha256: fa4864e9ab78896f0e1f00d30bfcedff5aa4818b0c1506313e86e3da3f88d5e7
    file_sha256: 63eb8dc1476ad553db0bda724bd2b1d36f01dc3c662e19464198bd81806c9ab2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-perplexity-2-reviewed.md
    snapshot_sha256: 63eb8dc1476ad553db0bda724bd2b1d36f01dc3c662e19464198bd81806c9ab2
    entry_key: adcf05bd821eea141d9c10741a46cf00d0644622627f5e735e135091e4c40aa3
  - object_id: ARV-GEO-C2-AFTER-Q1-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-claude-1-reviewed.md
    content_sha256: 667e53ad55454a1d3ffc6f989972959fae3ae9b5fd93414cf5d3a9fe7b1aeeb1
    file_sha256: 2301bc7ff7b6109c8d09d06e96c218cd85c0beb8c1357674583a08340bdd1d84
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-claude-1-reviewed.md
    snapshot_sha256: 2301bc7ff7b6109c8d09d06e96c218cd85c0beb8c1357674583a08340bdd1d84
    entry_key: aeadd80ed911c5dd69f7931423852ba9098c54d821d8b12772ce99e1217cab2c
  - object_id: SMP-GEO-C2-AFTER-Q1-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: af4107b089d6d209cdd98646f48fadb2341acc3619d6943284addd779ec8a88c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-google-ai-2.md
    snapshot_sha256: af4107b089d6d209cdd98646f48fadb2341acc3619d6943284addd779ec8a88c
    entry_key: af74e2c1896079d9aa21263034beb96b116b94513a12bbe14d62e638aecd2559
  - object_id: SMP-GEO-C2-AFTER-Q3-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 010824720859d85f73ee337eb0a2ff602216ab382f802c70b9a18e3768a38def
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-claude-2.md
    snapshot_sha256: 010824720859d85f73ee337eb0a2ff602216ab382f802c70b9a18e3768a38def
    entry_key: b1198a02141bc505624a60fbbc0a22f5bcec4459fd02061edbcefd6dfc612036
  - object_id: SRC-GEO-E2E-EXPIRED
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-expired.md
    content_sha256: 77d048ca80f0df056a4c933dfbc21020e0de473f08cb3113135c644e2f4e1fd0
    file_sha256: 222f2d6bbb48e4d74719a7d03e52a36498bec9640c949d343bc10833337e1b67
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-expired.md
    snapshot_sha256: 222f2d6bbb48e4d74719a7d03e52a36498bec9640c949d343bc10833337e1b67
    entry_key: b154017302709674ddfc780afc4b7f5c1adff0627763f97e57010bf5bf1747b6
  - object_id: SMP-GEO-C2-BASE-Q6-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: e90bfadb864d62c2aaf6fe22c0cbbcf98d34d999991da8bcd8f7cbf965b551f2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-claude-1.md
    snapshot_sha256: e90bfadb864d62c2aaf6fe22c0cbbcf98d34d999991da8bcd8f7cbf965b551f2
    entry_key: b29910357267e5f2b838d2f0f0501d3615cd9d52f456589c24fc728f79fe303c
  - object_id: AGG-GEO-C2-BASE-Q6-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q6-claude.md
    content_sha256: 71a76883e9db6549caf3888fdbd5ea39708939e3d4f7e586017cc16dda8fb300
    file_sha256: 0ab19d3be76721418ce49e53266a428d81567aedc7ba5595266b2e61a06d2981
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q6-claude.md
    snapshot_sha256: 0ab19d3be76721418ce49e53266a428d81567aedc7ba5595266b2e61a06d2981
    entry_key: b40e7faf766b4ef0d915a71cf5467057cc7f0a5f5bbd6092deaaeb06722e4c10
  - object_id: PRP-GEO-C2-THIRD-PARTY
    record_type: asset_proposal
    object_version: 1.0.0
    object_path: assets/proposals/prp-geo-c2-third-party.md
    content_sha256: b918b5acfd10b7548bb174b191a01c14cd37d8b4d0307b990e0d684a8562c76d
    file_sha256: e0576e182b328a4cab50348b0e65cfeead761d2058b75a66e76c8f60a9aadf07
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/proposals/prp-geo-c2-third-party.md
    snapshot_sha256: e0576e182b328a4cab50348b0e65cfeead761d2058b75a66e76c8f60a9aadf07
    entry_key: b4841ef4a130c9017d4f1daa688022c7230d2385e30d3d102356bc74aefbde06
  - object_id: SMP-GEO-C2-BASE-Q6-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: eb5e14fd741081980740bcb3e9d7b5896c1bdac76b80f1be16500a0640d71d61
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-google-ai-2.md
    snapshot_sha256: eb5e14fd741081980740bcb3e9d7b5896c1bdac76b80f1be16500a0640d71d61
    entry_key: b4c68bbbf9746b3bea8ba7d065572df3cc7c4db16e65084b0c9d0fb982525426
  - object_id: ARV-GEO-C2-BASE-Q3-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-chatgpt-2-reviewed.md
    content_sha256: 71b6100e5d1a62fe05aaa54248184a6724492ade931f9960cc1da3745ee8aaa7
    file_sha256: dedc6c2fe936c900ce2c1717020ea7660748aefee1d176f06c24d4055884f827
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-chatgpt-2-reviewed.md
    snapshot_sha256: dedc6c2fe936c900ce2c1717020ea7660748aefee1d176f06c24d4055884f827
    entry_key: b66f6bb008d53057ea3ca28e424fbec86f3d0295528f3bc2a17cdb12f0e94b1d
  - object_id: ARV-GEO-C2-AFTER-Q1-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-gemini-1-reviewed.md
    content_sha256: 8762b9b58922d65250e3e3799274da7586c6104042de0b54e27328b2aad072d2
    file_sha256: 417f3be615533e7885a43616ad860bffd7190caab6f4eb00d958ab6c1882a845
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-gemini-1-reviewed.md
    snapshot_sha256: 417f3be615533e7885a43616ad860bffd7190caab6f4eb00d958ab6c1882a845
    entry_key: b70352a2fa7b5b87f1f55c70d00fc99e98434596d5650128fa9bd364613f93a6
  - object_id: FND-GEO-SITE-C2-BASE-THIRD-PARTY-CRAWLABILITY
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c2-base-third-party-crawlability.md
    content_sha256: e91bfa0ec2e04024f1ce034827c414931a31ed8191e3a756f816c54fdfa95edc
    file_sha256: d8459d56d9f7b673746fd59812b4bafd70e36bcee74c8e9faae5cdecdaf4ec27
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-site-c2-base-third-party-crawlability.md
    snapshot_sha256: d8459d56d9f7b673746fd59812b4bafd70e36bcee74c8e9faae5cdecdaf4ec27
    entry_key: b783c8e55ef7aacd2a22271a09015569918b6753d84fbfe67937dc5381efa0d0
  - object_id: EVD-GEO-E2E-ANSWER-DEFINITION
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-answer-definition.md
    content_sha256: 39e9f04bfbb709f8985c63171446a5d66214132c264165afb6eb98c13a5bbb95
    file_sha256: 32a38848347f185bb45040f1ea5a623c2166129702a0194a527debe3377486f6
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-answer-definition.md
    snapshot_sha256: 32a38848347f185bb45040f1ea5a623c2166129702a0194a527debe3377486f6
    entry_key: b7ce9adecd1c95c0d47aca7c157ef4adc9fff8970b0db79e39ae88fd49ed3cc2
  - object_id: EVD-GEO-E2E-COMPARISON
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-comparison.md
    content_sha256: 24e1cedf6efc20a99384f95baa7f873d352a7f4f44ddb1881a87f22fe10ae271
    file_sha256: 05e99927d2f0c40e5275b0aef706f312960a02d9bbfcdfbda630f974a7494402
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-comparison.md
    snapshot_sha256: 05e99927d2f0c40e5275b0aef706f312960a02d9bbfcdfbda630f974a7494402
    entry_key: b870214de478470da94863de2d217ca87ccd977eec38130f9cb0918bc3bfbd6f
  - object_id: SMP-GEO-C2-AFTER-Q3-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 2716f6506d9be9f3a1d00bab20f36cd9448c6b1775933f8a6376a0c23d99183a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-perplexity-2.md
    snapshot_sha256: 2716f6506d9be9f3a1d00bab20f36cd9448c6b1775933f8a6376a0c23d99183a
    entry_key: b910eb0f8891c3c3ccbc03391c2cb317c9899dc40194487e64cf5677f462b697
  - object_id: ARV-GEO-C2-BASE-Q4-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-claude-2-reviewed.md
    content_sha256: 231d50e54654ea5b8a42cb65801f8f48ef733358a8ac0e741d453b3bff5b5c4d
    file_sha256: 362bcbb8cdc46632b80db93f44a59699953b4153bba764a58ea5bcc4d7756250
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-claude-2-reviewed.md
    snapshot_sha256: 362bcbb8cdc46632b80db93f44a59699953b4153bba764a58ea5bcc4d7756250
    entry_key: b93cb606afbbdd505d28ea1bb8438b60f242ec74ad83ae3ac978b342635ef3e8
  - object_id: SMP-GEO-C2-AFTER-Q5-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8f3d48dce8c5bacdbea93a4d6607cc9bc5ac6c616916e387b773870961ae3a11
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-claude-2.md
    snapshot_sha256: 8f3d48dce8c5bacdbea93a4d6607cc9bc5ac6c616916e387b773870961ae3a11
    entry_key: b98d4c0fcf3136d81e5f637017fe3847f3a94aef57dab8ac8fbf5d27776cf963
  - object_id: SMP-GEO-C2-BASE-Q2-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 74622d081cde59d925c3fe0d8900314a9de187af3d7d9fd413ac5e68684c6e10
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-chatgpt-2.md
    snapshot_sha256: 74622d081cde59d925c3fe0d8900314a9de187af3d7d9fd413ac5e68684c6e10
    entry_key: b9fdeef5d715d4e694dabed95022887b09f2ca346bbb488bbc2884f9deaa186e
  - object_id: SMP-GEO-C2-AFTER-Q5-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q5-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 88d93d2f567f07d15afbaf04998c94cb2236d59d5586796523f931a72253a419
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q5-chatgpt-1.md
    snapshot_sha256: 88d93d2f567f07d15afbaf04998c94cb2236d59d5586796523f931a72253a419
    entry_key: ba345ab6a4de1e5c33bbcc8daa79b6a07f0e3215e2505a79d131d6ce64f8784e
  - object_id: SMP-GEO-C2-BASE-Q1-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 02c1edeecb9cb0e696a85b779608a9fbc1564b2915e8c21fb7dc1b96e08906b9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-perplexity-2.md
    snapshot_sha256: 02c1edeecb9cb0e696a85b779608a9fbc1564b2915e8c21fb7dc1b96e08906b9
    entry_key: ba3f578233167782bf65aa8ab7635fe96ec17ae375263e294ab5c02200485d9c
  - object_id: SMP-GEO-C2-AFTER-Q6-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 7045e1eefbe39fe8220fb8eff9fd673e5f5a7274d4da640e9f60655de2dbd748
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-google-ai-2.md
    snapshot_sha256: 7045e1eefbe39fe8220fb8eff9fd673e5f5a7274d4da640e9f60655de2dbd748
    entry_key: ba9507fc51d28598aec0e979fe3ab470382afcff7e31f56e908b3343dda4a635
  - object_id: AGG-GEO-C2-BASE-Q2-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q2-perplexity.md
    content_sha256: 061ee9bdf3774731224141ebb52fdcd7d768a6ca00ae6b4e00811846ca5f230d
    file_sha256: 06a8ce34c13372f635b53d4e1a18fc72194680d2c81820db0463d6c2c55c9063
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q2-perplexity.md
    snapshot_sha256: 06a8ce34c13372f635b53d4e1a18fc72194680d2c81820db0463d6c2c55c9063
    entry_key: bbaa598e43fa1e88fe3a47d1f22e97f1a0e1e2bbd5f3159247a97a5616f0ea86
  - object_id: EVD-GEO-E2E-CAMPAIGNS
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-campaigns.md
    content_sha256: 3987871042f7f7afed241d9b0fcf21cdf7a041c4849d71dfc019b3aee7716ea2
    file_sha256: 4c9ed466508663569772fec6a7ac6de0421df29c0b1c755526d221cadd59c0fa
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-campaigns.md
    snapshot_sha256: 4c9ed466508663569772fec6a7ac6de0421df29c0b1c755526d221cadd59c0fa
    entry_key: bc5f3edfbd438459fd1c5d704a0efc04a4bf020e3467ff7896ecd2c08866c036
  - object_id: ARV-GEO-C2-AFTER-Q6-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-gemini-2-reviewed.md
    content_sha256: bdc5295ac63d62ef5afb29057a2854aa54267bc0c91b7df14e6cc9fb6c22f2ef
    file_sha256: aa20a74e0e1253483051b9473c70af58bc821298edca88d45dbc29b953e12c1d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-gemini-2-reviewed.md
    snapshot_sha256: aa20a74e0e1253483051b9473c70af58bc821298edca88d45dbc29b953e12c1d
    entry_key: bc78747b3366c2f796497f866851f64d631d616a1f5f1b5397870fe45f4476d9
  - object_id: ARV-GEO-C2-BASE-Q3-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-claude-2-reviewed.md
    content_sha256: e8cab6ccc8d0f4cf6e9550705593ff6c1b7d772f6e0b5a4e2cf3b2b22f84d689
    file_sha256: 8b70c8c486caf480a4b7b99057ac0b523944254f661884525e53997cb250ada3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-claude-2-reviewed.md
    snapshot_sha256: 8b70c8c486caf480a4b7b99057ac0b523944254f661884525e53997cb250ada3
    entry_key: bd0dc7c22cb65a6b1acf639a1e82831920364a047f4163a92aff7c354265111c
  - object_id: ARV-GEO-C2-AFTER-Q4-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-chatgpt-2-reviewed.md
    content_sha256: 4eecf8438a2ee6bc2cb56dfe4b453abb04d8eeb85de9cb888570f069d938533b
    file_sha256: 35961d59ace24f2fe7eb0c8949cdba5a0a29f5d87597341a4e838f1ae0b2c30a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-chatgpt-2-reviewed.md
    snapshot_sha256: 35961d59ace24f2fe7eb0c8949cdba5a0a29f5d87597341a4e838f1ae0b2c30a
    entry_key: bd5ef8ef84f7d29bde01747585da559e4866d991b781dbe55a3e15f6994871d7
  - object_id: SMP-GEO-C2-BASE-Q5-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q5-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 6c4130e64fd6cd14df6c6d0031f052eb187f5431a787e5cad4cead2b272a0ba7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q5-claude-2.md
    snapshot_sha256: 6c4130e64fd6cd14df6c6d0031f052eb187f5431a787e5cad4cead2b272a0ba7
    entry_key: bda63686b960d92f66ac0dea07f9560fc42d823257eb4f053fe7fc0c5d056d03
  - object_id: ARV-GEO-C2-BASE-Q3-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-google-ai-2-reviewed.md
    content_sha256: 1f87c9435c4991ca719020d809a5cb3cc002b0953c5fbf2e6d1f04d024b0bede
    file_sha256: d892144be03599973384d5dcc45d1ddbfa3403e3b5c87c43421c3bfe59739d0a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-google-ai-2-reviewed.md
    snapshot_sha256: d892144be03599973384d5dcc45d1ddbfa3403e3b5c87c43421c3bfe59739d0a
    entry_key: be258e26e2fd2757b544c053379fdc6c3c031218e8b580a5273a796428ce0ad4
  - object_id: AGG-GEO-C2-AFTER-Q6-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q6-perplexity.md
    content_sha256: 07a0afa57206f559166c1255d8f78391f476343d8ca0c2aa059bfd72006cbc39
    file_sha256: d3fb9db6285a4b6d5f8746d59e68ed5add077fa67581c7458cf4b4208a35899e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q6-perplexity.md
    snapshot_sha256: d3fb9db6285a4b6d5f8746d59e68ed5add077fa67581c7458cf4b4208a35899e
    entry_key: bea5bb7cc459b3ddb89a8041baf611e425f1cb45dd748dd83d4b12b71910ed6f
  - object_id: AGG-GEO-C2-BASE-Q2-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q2-claude.md
    content_sha256: a60ad63e629c00718aff483c36987be311c87b88a77861e349facb398645704e
    file_sha256: e4cef26cec3e95d22df3d8615ed87587139e0cd26baf95004591261e4719f6f0
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q2-claude.md
    snapshot_sha256: e4cef26cec3e95d22df3d8615ed87587139e0cd26baf95004591261e4719f6f0
    entry_key: bedc47449a889214b255062736123e985434efffdb4d7513488b0ec1c1a89a92
  - object_id: ARV-GEO-C2-AFTER-Q6-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-chatgpt-2-reviewed.md
    content_sha256: 2b235a950d69f4aecaa479d621507f34e326ad799fec76c6ad1baf1e9e699a1b
    file_sha256: 427788faf8d8dda282457d5aaf6b5c71ad0f61e2b2321e530635352fb2c9ded9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-chatgpt-2-reviewed.md
    snapshot_sha256: 427788faf8d8dda282457d5aaf6b5c71ad0f61e2b2321e530635352fb2c9ded9
    entry_key: c038eb2e75ca7ea500b2907e392848c502384275adf28d975d475df9127b7ffa
  - object_id: SMP-GEO-C2-BASE-Q4-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 848aaf3f53defe17385cc304cf8671c11b6dceaaed67d3b0e7613600e16f805f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-claude-1.md
    snapshot_sha256: 848aaf3f53defe17385cc304cf8671c11b6dceaaed67d3b0e7613600e16f805f
    entry_key: c144ed1308d0cb564d40cde4388f4e16eac8ae561b0e4a79ef3588468554f86f
  - object_id: ARV-GEO-C2-BASE-Q6-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-perplexity-2-reviewed.md
    content_sha256: b8895a003175831d3132daf85a1c64fb84647fd375ef1bf50d50af573d03acd8
    file_sha256: 30875920110ecb4f3b3630ffdcee42b188cea754b70b341caf3194dc109324f7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-perplexity-2-reviewed.md
    snapshot_sha256: 30875920110ecb4f3b3630ffdcee42b188cea754b70b341caf3194dc109324f7
    entry_key: c15660cc63505b3f8e6731f48356ecbeade75d209239872a5dc103b012c7c620
  - object_id: SMP-GEO-C2-AFTER-Q2-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 1547f533d7542bd73eec9dc1cf791b1bb0d142ca8e6773b5f2fb9652958d3ef8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-gemini-1.md
    snapshot_sha256: 1547f533d7542bd73eec9dc1cf791b1bb0d142ca8e6773b5f2fb9652958d3ef8
    entry_key: c1655a4413adfcf6d5958ad404c4822792e59188aee4e5b45305d9cbedcc02f8
  - object_id: ARV-GEO-C2-BASE-Q4-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-chatgpt-1-reviewed.md
    content_sha256: 7f05f774f1ed5cee5ec65035508898e0367ccd679ff7dd55eb763e3b3cba47b6
    file_sha256: f1ca7d3808a1ade73d2b4add3e706e159fe5c008ecb080aa4b688f9bc0f11e4e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-chatgpt-1-reviewed.md
    snapshot_sha256: f1ca7d3808a1ade73d2b4add3e706e159fe5c008ecb080aa4b688f9bc0f11e4e
    entry_key: c32628cd8ec223b4ef33b9bf4161fff9a33ab8e0f9fbc3059754d840eb0f534e
  - object_id: ARV-GEO-C2-AFTER-Q4-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-gemini-2-reviewed.md
    content_sha256: 2b21452608e9149c7432863b4c38a74fe3afe5eb538818739a2319c9fc8200fe
    file_sha256: 5fb3ea957ac4d3cf5b1c1ab604425bf89c4052c0f0165e2d6752b751fb2c1b63
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-gemini-2-reviewed.md
    snapshot_sha256: 5fb3ea957ac4d3cf5b1c1ab604425bf89c4052c0f0165e2d6752b751fb2c1b63
    entry_key: c4dc372381f41f0d3b0d8b54785239f5e06e8beacd7037804f3bd97647a530c2
  - object_id: ARV-GEO-C2-BASE-Q5-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-chatgpt-1-reviewed.md
    content_sha256: 5caf1d8e18c119eb963580dd746bc6271e62360b86e0b54af5f75e7e3dbbb410
    file_sha256: b669ce3ae563b406219614233af1f0158404cca370abd0d3f66542d9e3c1774c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-chatgpt-1-reviewed.md
    snapshot_sha256: b669ce3ae563b406219614233af1f0158404cca370abd0d3f66542d9e3c1774c
    entry_key: c737eb180715ab731ddd0e0aa57d55501824e227ccda00c02495e601a3ea787e
  - object_id: SMP-GEO-C2-AFTER-Q6-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: fd9ce96a418d80b784e9022f90f2520d9eb71baa44974ebb8127795583498e4a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-gemini-2.md
    snapshot_sha256: fd9ce96a418d80b784e9022f90f2520d9eb71baa44974ebb8127795583498e4a
    entry_key: c887dcdfca3f43006edd1397037eade7113ab58c067dc1bd50391cb69f2063cb
  - object_id: RUN-GEO-SITE-C2-AFTER-OWN
    record_type: run
    object_version: 1.0.0
    object_path: cycles/m4/runs/run-geo-site-c2-after-own.md
    content_sha256: e290ee14e0f8b35e919f1150df577332e4eac9a32061fd1a1fd9ffbcda1ffdc0
    file_sha256: 759988da2efbc4740f7506a5b680e6b8c40d9858ed795cde8c66e1c9ed32fc93
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m4/runs/run-geo-site-c2-after-own.md
    snapshot_sha256: 759988da2efbc4740f7506a5b680e6b8c40d9858ed795cde8c66e1c9ed32fc93
    entry_key: c905b7b26d3f99a50d10358f672fa67219cf283bd679e99bd595dc20a3d97fb1
  - object_id: SRC-GEO-E2E-IDENTITY
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-identity.md
    content_sha256: a72644835b1a7648ba95871bc7c874b7646ff9247675d45295e09105a2a124fa
    file_sha256: ca7d2051a822b32292915f81027d87bca479f41023869f6efd59204b87221fb5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-identity.md
    snapshot_sha256: ca7d2051a822b32292915f81027d87bca479f41023869f6efd59204b87221fb5
    entry_key: c930e570814430ff682e82769cf9885ddc67c94e0588a708cb7a680d6667132c
  - object_id: FND-GEO-SITE-C2-BASE-THIRD-PARTY-SCHEMA-SYNTAX
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c2-base-third-party-schema-syntax.md
    content_sha256: 07cea7107fbb21d3b3fd7559fe96e8a83888e13b321f85eb7f4764e56f0a6518
    file_sha256: 51225ac3de73fb717e1e79febb7b30c36171eaaa7bf511201593b5622e9f42dc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-site-c2-base-third-party-schema-syntax.md
    snapshot_sha256: 51225ac3de73fb717e1e79febb7b30c36171eaaa7bf511201593b5622e9f42dc
    entry_key: cc33923fe1cfdb75e20183f9f8c56da4aeb6e4ddf16da8124d08b806301aef87
  - object_id: SMP-GEO-C2-AFTER-Q6-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: edabecaae2c68987e9cd262226c3a52a77473e074ee9fed0b9fc80bdd485670f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-claude-1.md
    snapshot_sha256: edabecaae2c68987e9cd262226c3a52a77473e074ee9fed0b9fc80bdd485670f
    entry_key: ccc637a40e13448f7d4064efa5aa38ce2401245b68615b3088353684eab31be8
  - object_id: SMP-GEO-C2-AFTER-Q4-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f8f7e3f176442f23a7acd18626ce3e3d05756039fff65d5f8a0a9670528d63f2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-chatgpt-1.md
    snapshot_sha256: f8f7e3f176442f23a7acd18626ce3e3d05756039fff65d5f8a0a9670528d63f2
    entry_key: cd01cfb874d3b6535803badbf427ee67b4016bd7af9f8a95fbfd032370f31d19
  - object_id: AGG-GEO-C2-AFTER-Q5-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q5-claude.md
    content_sha256: 7a88925bcc5fdca84b7e4f3413febfdcf748e70451fca2d8e3beefa3006d0b93
    file_sha256: a67993df8c325acb10782e91d64c8066289db7b9d9f47255a593fffbe1a19e05
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q5-claude.md
    snapshot_sha256: a67993df8c325acb10782e91d64c8066289db7b9d9f47255a593fffbe1a19e05
    entry_key: ce80886484edb6642986d8c8d79fae287c4e0e6c5df7bf4e1c1edce4c749e164
  - object_id: ARV-GEO-C2-AFTER-Q3-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-google-ai-2-reviewed.md
    content_sha256: 9d6805f76e533b5eb9e26fae92f1418df0767c3609959406cce579780c9f230c
    file_sha256: 2faffae7668d0ce8ea6d14498ccecf1bd52b11947ce5ff26786e1b3cbf5d8a28
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-google-ai-2-reviewed.md
    snapshot_sha256: 2faffae7668d0ce8ea6d14498ccecf1bd52b11947ce5ff26786e1b3cbf5d8a28
    entry_key: cf29b38b3d97e35b857ca82024935d83f7896170ee3fd2a452ab5b253dbe0561
  - object_id: ARV-GEO-C2-BASE-Q3-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-gemini-2-reviewed.md
    content_sha256: 80d9f8d80ea05fe2022eeec22a93e6c080ee57b62bf19c2e06590ee13cdad66f
    file_sha256: 608c6fe6d1adf4c0377e84658fc3b1d7ae16791dd1ed40588807ae2e52d00f0f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-gemini-2-reviewed.md
    snapshot_sha256: 608c6fe6d1adf4c0377e84658fc3b1d7ae16791dd1ed40588807ae2e52d00f0f
    entry_key: cfd7a1968753c0db28d60e70b677842f0aaf5fa79085a1ce3bf44adc6fa9af3f
  - object_id: SMP-GEO-C2-AFTER-Q2-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: d155d8b4365ab131b73dae3e975c04354191d224c995e88b29fe799f16d9c0e2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-gemini-2.md
    snapshot_sha256: d155d8b4365ab131b73dae3e975c04354191d224c995e88b29fe799f16d9c0e2
    entry_key: d008b5ac972f668db2123c46c71f8298a825e7a0f1cb5764018a126c0d6cfc1d
  - object_id: EVD-GEO-E2E-GUARANTEES
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-guarantees.md
    content_sha256: c05c6c819824b4a3bbbe50587e611d97dc478fa9777acc9ab0371c4133722b0f
    file_sha256: 0a081c899141ef78f8d4fe70f924baa6512051b1c8ac210f8e83741bdba10242
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-guarantees.md
    snapshot_sha256: 0a081c899141ef78f8d4fe70f924baa6512051b1c8ac210f8e83741bdba10242
    entry_key: d080aba3ee5b452a68acc5fbf4d224cec18bcec92a8842c822fd58c943caba32
  - object_id: ARV-GEO-C2-BASE-Q6-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-perplexity-1-reviewed.md
    content_sha256: 64208a69fa7670cfc054c587b7599b613dc3b7b459f10c917a5749580f75af37
    file_sha256: 09db6e83c513559d30890e5689ac74c9264d93ab44fd83c4ce3512bacc9853d3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-perplexity-1-reviewed.md
    snapshot_sha256: 09db6e83c513559d30890e5689ac74c9264d93ab44fd83c4ce3512bacc9853d3
    entry_key: d0c30548eadb012b0db05f2f2c781ac7f1ab01abd211a4a69da9f371259d0e00
  - object_id: SMP-GEO-C2-AFTER-Q4-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8f2e0d09f27a5fe430941dffaaa995c62c2b82069a685bd2cbb7a97d43c1c10f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-chatgpt-2.md
    snapshot_sha256: 8f2e0d09f27a5fe430941dffaaa995c62c2b82069a685bd2cbb7a97d43c1c10f
    entry_key: d0c982989a35b694fc75de6a139fd6ed08e9f58a8a0b179ea2d853c763b599e4
  - object_id: SMP-GEO-C2-BASE-Q4-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: ef094af6dcb6e8de57f8403f40ed83c210331b4bf02d381606541eb070c8ff0d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-perplexity-1.md
    snapshot_sha256: ef094af6dcb6e8de57f8403f40ed83c210331b4bf02d381606541eb070c8ff0d
    entry_key: d113e5b54ee6690057f3daa3ae70703fa6b4b2992d660b98850158e6cf606c89
  - object_id: CLM-GEO-E2E-AUTOMATION
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-automation.md
    content_sha256: 93e1c25d15e397d249e71905bd51a80b5af9be0d998e9032667dd3402089e880
    file_sha256: 28a5428875224946ee4a72e56b81dffdc8a7cdd51d1dd09bf225694b79951755
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-automation.md
    snapshot_sha256: 28a5428875224946ee4a72e56b81dffdc8a7cdd51d1dd09bf225694b79951755
    entry_key: d2356ed9728c764c7f728ba1d0101f0f3841d24a7e35c97935494fb2a153d400
  - object_id: SMP-GEO-C2-AFTER-Q3-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 76d989133590695770ba7bc215c97e19d0e5e0ef92b2db1b6f8a46cdf9423b85
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-chatgpt-2.md
    snapshot_sha256: 76d989133590695770ba7bc215c97e19d0e5e0ef92b2db1b6f8a46cdf9423b85
    entry_key: d2b64b37120a7720e6b35ff141c08f3d646d2676e033acbe2a9b6026cf250cae
  - object_id: ARV-GEO-C2-AFTER-Q5-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-claude-2-reviewed.md
    content_sha256: fac207e30e1c6cd09e0574df89a4fd7c13acebc99cc89d7fc7193d2e5f01d0bc
    file_sha256: 8b08a02fccc07ebe0613feb4db70424d6f4450d3129273f974b4c9b070723e5a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-claude-2-reviewed.md
    snapshot_sha256: 8b08a02fccc07ebe0613feb4db70424d6f4450d3129273f974b4c9b070723e5a
    entry_key: d2ceaaa0b7573c556a08b4c055d7e8fb8bad130dd78b145e7524f1ab01c91779
  - object_id: ARV-GEO-C2-BASE-Q2-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-claude-2-reviewed.md
    content_sha256: 4fdfe54a0bc3a237d8475b4d420f65b2e307e718bae955a49934c82616411c39
    file_sha256: d45caeb293039c4b69a1acc6df0485b07713534d9e74d85112d903107b86cfb3
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-claude-2-reviewed.md
    snapshot_sha256: d45caeb293039c4b69a1acc6df0485b07713534d9e74d85112d903107b86cfb3
    entry_key: d34d98a6016b744bae7e9e12057f2438888c045ed67669aa4b372a1be4bf889e
  - object_id: DOC-GEO-E2E-CAMPAIGNS
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-campaigns.md
    content_sha256: ac11c76d89484a02665ea448ec8dbc835a8227ee836d7d049c487cc64e521b8c
    file_sha256: 800fb382d8f1751e5939f95a7168e1a4381f860ac4e2ce59c941558a685c5026
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-campaigns.md
    snapshot_sha256: 800fb382d8f1751e5939f95a7168e1a4381f860ac4e2ce59c941558a685c5026
    entry_key: d432889df2b42a732234f96248e2a9f31fc3201f201e97e69c2444fc8da95345
  - object_id: ARV-GEO-C2-BASE-Q1-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-google-ai-1-reviewed.md
    content_sha256: c1fc75f0ba0f2d0dc16d6b52a697b477a4c08d110fa7a1e87c0e1ac44da26538
    file_sha256: bc0758b826b9f958722e655f5009c9623796f1d6150c58d52f921139705d53d5
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-google-ai-1-reviewed.md
    snapshot_sha256: bc0758b826b9f958722e655f5009c9623796f1d6150c58d52f921139705d53d5
    entry_key: d5b9a748bc1bb8b67cf70d4447d4bc6a6e3220a7ae33aedca509a4d42f8fcab9
  - object_id: AGG-GEO-C2-BASE-Q4-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q4-perplexity.md
    content_sha256: 6769f1a923553d615b6aadb3bc87b98c4c27252886d23ffe12e19a0411e73085
    file_sha256: 2b8a952ce1931f96ae9e1d31f3c2491f075a1a9ef053f67e3a2284a62b4da505
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q4-perplexity.md
    snapshot_sha256: 2b8a952ce1931f96ae9e1d31f3c2491f075a1a9ef053f67e3a2284a62b4da505
    entry_key: d649c0e7de838581ebcbe13440b3f97e77549c89c6bc5fd1c9bfa16eaa629bc0
  - object_id: ARV-GEO-C2-AFTER-Q3-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-gemini-2-reviewed.md
    content_sha256: 0ff4141d4aff4cad98be2a1bbece4eaf20155b547e589388228aeceded662883
    file_sha256: 640cf39f59034214c71bd419d5cfa56f0e20825c60e669c02f11eb43448b4e28
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-gemini-2-reviewed.md
    snapshot_sha256: 640cf39f59034214c71bd419d5cfa56f0e20825c60e669c02f11eb43448b4e28
    entry_key: d66781c2b1f32d9f6b9daa8ef2290775e3b8d6584d4c5e6f6c4979e230e22a64
  - object_id: SRC-GEO-E2E-COMPARISON
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-comparison.md
    content_sha256: 24e1cedf6efc20a99384f95baa7f873d352a7f4f44ddb1881a87f22fe10ae271
    file_sha256: 86e4b804c125127323dca43c7c54797b24422da6dee92498703d8b990957636a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-comparison.md
    snapshot_sha256: 86e4b804c125127323dca43c7c54797b24422da6dee92498703d8b990957636a
    entry_key: d6ae32ba4429dd4539ebe401e955190655c9847b6101850450d250d953c9daed
  - object_id: ARV-GEO-C2-BASE-Q5-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-perplexity-1-reviewed.md
    content_sha256: 6426812f6335b1177847ed3bbd72a5e2087b01e51094fb8a49ae3bf98a5b26d3
    file_sha256: 668cb92ca61469c0b682772a9026ea25d130af4b139ab223c06d8a0aa9814e69
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-perplexity-1-reviewed.md
    snapshot_sha256: 668cb92ca61469c0b682772a9026ea25d130af4b139ab223c06d8a0aa9814e69
    entry_key: d6c0c0cbb2157c9af5383e4a597521f43b59b19f07e885aea3ba0a37800bbb14
  - object_id: SMP-GEO-C2-AFTER-Q4-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 422027dd16c88ab19e7a649006a588da7ff35384455f3352d8e6d8ff51cd2c9b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-google-ai-1.md
    snapshot_sha256: 422027dd16c88ab19e7a649006a588da7ff35384455f3352d8e6d8ff51cd2c9b
    entry_key: d8396d6e6613d2bfcf1d90c95c596c82ac9c6270218003df48b1ee0a170599bd
  - object_id: SRC-GEO-E2E-ONBOARDING
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-e2e-onboarding.md
    content_sha256: d6fd212806c92f8b1d294e5b0d5f0afaa052d13d205a6f413183bf3746d0c908
    file_sha256: 4691afe6a2344fb54de2e2b07a32fe7c5963df7bb4fa6ebaeae8fa5cb40ad3ae
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-e2e-onboarding.md
    snapshot_sha256: 4691afe6a2344fb54de2e2b07a32fe7c5963df7bb4fa6ebaeae8fa5cb40ad3ae
    entry_key: d8e06e5e15acba3cdb385aaea4045b76819489bb523d7078d8e4a16b07d71710
  - object_id: ARV-GEO-C2-BASE-Q1-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-perplexity-2-reviewed.md
    content_sha256: ecf721f168b1649a0d2f1f39b92d653af1c99e29421e1428addfb8ab65997338
    file_sha256: 959f6e669aa8e9da7a55c5c457ac152ca0100ff5774a47b1658410cfe8b32a75
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-perplexity-2-reviewed.md
    snapshot_sha256: 959f6e669aa8e9da7a55c5c457ac152ca0100ff5774a47b1658410cfe8b32a75
    entry_key: d8fe6b08b10e1af55e8c8312ba4ac92f1b0fc8f2f71ef0cbe72f6dacc732592f
  - object_id: ARV-GEO-C2-BASE-Q4-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-perplexity-1-reviewed.md
    content_sha256: 03bc41d0284340134285ec629357df82fa7f00710ce27cf5940038420bdf96ce
    file_sha256: 8b1625b6a7f52358a932c3fc73c0712ab9737638e51ebad635bd1b46ef142643
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-perplexity-1-reviewed.md
    snapshot_sha256: 8b1625b6a7f52358a932c3fc73c0712ab9737638e51ebad635bd1b46ef142643
    entry_key: d9076b7e4a370085ebd15274d2b17bfc0317d6e5f1c6ac1a91a3385e95d04664
  - object_id: DOC-GEO-E2E-ONBOARDING
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-onboarding.md
    content_sha256: 3edaab1a20a56c87db0265bb28fc27d5c4c64bab385699f515931e17687fcb8c
    file_sha256: 39d0eddb9b65796f1262d4a250b8271637ae5ecdc29dba0b18769a4a7e24a7eb
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-onboarding.md
    snapshot_sha256: 39d0eddb9b65796f1262d4a250b8271637ae5ecdc29dba0b18769a4a7e24a7eb
    entry_key: d93638d033563b67acf5411a24003794b738b086628261c8375583a81c6f2830
  - object_id: SMP-GEO-C2-AFTER-Q3-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 46d596c19a1c6d34866b93b64c3ee86b81ddc6a40aba76cf4f10124afc704eb2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-gemini-2.md
    snapshot_sha256: 46d596c19a1c6d34866b93b64c3ee86b81ddc6a40aba76cf4f10124afc704eb2
    entry_key: d9a9889303a3bd025fd07fffb844465455e58548557cf7b38ed7e33c3bcd4264
  - object_id: SMP-GEO-C2-AFTER-Q3-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 9c209f33ab0105f81386b42fc9c7b6e3dd29237216514e61ae97917f69980dff
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-chatgpt-1.md
    snapshot_sha256: 9c209f33ab0105f81386b42fc9c7b6e3dd29237216514e61ae97917f69980dff
    entry_key: dab533921809f56c1c39960eb89998c807159d7b530a1e97e19ec8e40699b8fd
  - object_id: SMP-GEO-C2-AFTER-Q6-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 133f320ce60ea1c81f96e1653fd505cbe5465f2cda29358e2b39e415267de68b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-chatgpt-1.md
    snapshot_sha256: 133f320ce60ea1c81f96e1653fd505cbe5465f2cda29358e2b39e415267de68b
    entry_key: dbd132b9165215bd7422242c96c44f9d6b472a6aafcf3ed351271f66e616d895
  - object_id: ADR-GEO-C2-OWN-DECIDED
    record_type: adoption_record
    object_version: 1.0.0
    object_path: assets/adoptions/adr-geo-c2-own-decided.md
    content_sha256: c79972ba5f8a3d45da8f7afb399dc60cb0d93a5552ef1ae89c4b66df7efd6bb1
    file_sha256: 6aabaac3c430b64686a1cde2f087b097e3cd08f95e5b3cd2ccc9b65cfe96a599
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/adoptions/adr-geo-c2-own-decided.md
    snapshot_sha256: 6aabaac3c430b64686a1cde2f087b097e3cd08f95e5b3cd2ccc9b65cfe96a599
    entry_key: dc2cd5b50d3ca78fb340cc79a3f4f873f8f637d06f09906a9c3b1e1073aadd35
  - object_id: ARV-GEO-C2-BASE-Q1-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-chatgpt-2-reviewed.md
    content_sha256: 42fc9cb3765a0e61821edbc761783cf363389a09aa1888cb478c21cd895f4f7d
    file_sha256: 2b6bec2844e5e211c3376bd54d8305d385c251e18faa945474c45c680d0438f9
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-chatgpt-2-reviewed.md
    snapshot_sha256: 2b6bec2844e5e211c3376bd54d8305d385c251e18faa945474c45c680d0438f9
    entry_key: de4dba888ca404ecaea38d4c7e041346124b9e9c58e0ff4e7542acbe24b40553
  - object_id: ARV-GEO-C2-BASE-Q6-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q6-chatgpt-1-reviewed.md
    content_sha256: ed5c4877d7e47468ca8cedc85b5796cb52b46816e8f6cd0243938ae345bcac52
    file_sha256: 5a6f06703c40b1caa4bfc5450647d8f747fa32d093100ddd7459eb7b1608949b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q6-chatgpt-1-reviewed.md
    snapshot_sha256: 5a6f06703c40b1caa4bfc5450647d8f747fa32d093100ddd7459eb7b1608949b
    entry_key: dee6abcedb2e509c0f13764fa6b4fcc482ada26b464a24bd4555175beb5660ec
  - object_id: SMP-GEO-C2-BASE-Q3-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 673c58f11f374891e32a4930adfaddd576a7224120bc847ed0ce7d2a1af08746
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-chatgpt-1.md
    snapshot_sha256: 673c58f11f374891e32a4930adfaddd576a7224120bc847ed0ce7d2a1af08746
    entry_key: dfe6059280018893abb81c03c3bc59dc36778b67f0287655d41ba7ca83458b10
  - object_id: ARV-GEO-C2-AFTER-Q2-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q2-google-ai-2-reviewed.md
    content_sha256: 294026696a39ed7822c868971dc0799b5053d0217dd3cde28d328e07a37d7d65
    file_sha256: 2f3cfcab35f2a0aa4eec63038dbabc55b9b0a943513ccc51c64107669488c5e8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q2-google-ai-2-reviewed.md
    snapshot_sha256: 2f3cfcab35f2a0aa4eec63038dbabc55b9b0a943513ccc51c64107669488c5e8
    entry_key: e1711e00a7bd862855fd7b5b4bf07a33d0a3e998070d46b552b56e8517261351
  - object_id: SMP-GEO-C2-AFTER-Q1-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 904ba65a053a56560f12580d0c47d278951ccb9b54f0566c56a7f4e89a33706f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-chatgpt-1.md
    snapshot_sha256: 904ba65a053a56560f12580d0c47d278951ccb9b54f0566c56a7f4e89a33706f
    entry_key: e28393935c6fe45d11040af75bf27f61e51d0a5456bfe42530ee4111ab4e1ffe
  - object_id: SMP-GEO-C2-AFTER-Q2-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 4450a281f6f1a4799c75ab4f5394497ce258cdf6d1d76a01daf77972bcc2254f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-chatgpt-1.md
    snapshot_sha256: 4450a281f6f1a4799c75ab4f5394497ce258cdf6d1d76a01daf77972bcc2254f
    entry_key: e306091fe7b5eefca3019006c4123b89a4d7ebfa87d20581de903f9b4abfeb6f
  - object_id: ARV-GEO-C2-BASE-Q5-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-claude-2-reviewed.md
    content_sha256: 20d948a79472510898801e28da749ec42a3a2a32d6e8525f082631a18210db69
    file_sha256: 9c77757367218490ae59898490c38379c2f6667b68369458c2086da6e9aa6ecd
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-claude-2-reviewed.md
    snapshot_sha256: 9c77757367218490ae59898490c38379c2f6667b68369458c2086da6e9aa6ecd
    entry_key: e497eac46931f869c217751129e399616b9073818c8a965497b04a8ca8321b14
  - object_id: SMP-GEO-C2-AFTER-Q4-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q4-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: d81b2aa3ebeebd7166e3b7a836a84b9ac486310118855a82e496e4c7ca8979cc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q4-claude-1.md
    snapshot_sha256: d81b2aa3ebeebd7166e3b7a836a84b9ac486310118855a82e496e4c7ca8979cc
    entry_key: e4cfa9c80281a50c3cd8e9c5156b00e87d60312a2703caacfc427e93a94c236a
  - object_id: SMP-GEO-C2-BASE-Q4-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 64e13ede619cffc83e959d0cc8acae605117d04f45f1bdca956afd9ddb885c73
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-google-ai-1.md
    snapshot_sha256: 64e13ede619cffc83e959d0cc8acae605117d04f45f1bdca956afd9ddb885c73
    entry_key: e56bded22a9079802a7f9ef1410dd62d36359cbf28ef62463cd082042e1fedcc
  - object_id: SMP-GEO-C2-BASE-Q2-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 576ff5b258f67f67afa37aee239933616913a3a2dd3206b57a8ee48ec9260336
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-google-ai-1.md
    snapshot_sha256: 576ff5b258f67f67afa37aee239933616913a3a2dd3206b57a8ee48ec9260336
    entry_key: e6ee2b78c2341debe89169c99be6b54ab81e99c3e4cf06e687c6754f11540774
  - object_id: ARV-GEO-C2-BASE-Q2-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-perplexity-1-reviewed.md
    content_sha256: 85f349ee4d5875b7fbbe1b054cf44b9824eb60218c9c098562bfdbf336877d98
    file_sha256: 9dab5e0065b7d479f7b1ab638528001f44a78a06a59446653dc30960a33067cd
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-perplexity-1-reviewed.md
    snapshot_sha256: 9dab5e0065b7d479f7b1ab638528001f44a78a06a59446653dc30960a33067cd
    entry_key: e6f7129bad37c5bbb86c67498aa783d7a98ffb34c9aae205b7e108d5957dfa51
  - object_id: SMP-GEO-C2-AFTER-Q3-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q3-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: cbc585f571872c157a60e31e224d0947144bf89c4742b99d487068af24cd198f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q3-claude-1.md
    snapshot_sha256: cbc585f571872c157a60e31e224d0947144bf89c4742b99d487068af24cd198f
    entry_key: e7070f231877a0b28fabdafcfc755da7348e6099a28357094b4b734f8c194e15
  - object_id: ARV-GEO-C2-BASE-Q4-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q4-gemini-2-reviewed.md
    content_sha256: 0ea890f9177a7a4a7b54c6745c15f44f0076e74939af974ae8152f165413b09e
    file_sha256: 5156c075c59b8fb183f24ce7d5c4dcbdc25a5a20526dc0e54f2ad25d58dcf081
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q4-gemini-2-reviewed.md
    snapshot_sha256: 5156c075c59b8fb183f24ce7d5c4dcbdc25a5a20526dc0e54f2ad25d58dcf081
    entry_key: e73f4d774c6ea05e1c9310212229abf40a3cda69971f4fa3c74de81f2b605eaf
  - object_id: ARV-GEO-C2-AFTER-Q4-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-gemini-1-reviewed.md
    content_sha256: 6fd51dc32c92d796f6e05f3b7b2d5f5674e5c6eceeb24ee5c0521d00fac8d4a8
    file_sha256: 8ec02413131bcf38620e1a6c7a719d8fa2b284b2029ef25c1c13c48a2f37f42e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-gemini-1-reviewed.md
    snapshot_sha256: 8ec02413131bcf38620e1a6c7a719d8fa2b284b2029ef25c1c13c48a2f37f42e
    entry_key: e7aeabd884890f97af5246257b0cec2f749ae64b70c88051337b9f70c6429a2d
  - object_id: ARV-GEO-C2-BASE-Q3-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-google-ai-1-reviewed.md
    content_sha256: 05f54509daaa1a29d1b1173c9aa49876858fed77dd2bd8f92de873c4cfd1d72c
    file_sha256: 23f703c7e70e06f43700f42f3731dfa0e64d625df2cb407cee735c1e2ad588b2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-google-ai-1-reviewed.md
    snapshot_sha256: 23f703c7e70e06f43700f42f3731dfa0e64d625df2cb407cee735c1e2ad588b2
    entry_key: e85b24672af8c5ffc58b482df2dcc09ad6aabe031f7f413d43d6124505d05952
  - object_id: SMP-GEO-C2-AFTER-Q6-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q6-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 91684fc3e5343e101bbe7cfa00077693d8b45ca7e11e5efb24f70bc3708b85f1
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q6-perplexity-1.md
    snapshot_sha256: 91684fc3e5343e101bbe7cfa00077693d8b45ca7e11e5efb24f70bc3708b85f1
    entry_key: e8706566ae149f293ed6b2c0eff49ceade693030430400718fa9f6abff65c61d
  - object_id: AGG-GEO-C2-BASE-Q3-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q3-perplexity.md
    content_sha256: a575111c193d3b7a8b37ef02c76ef3a3eb3253063730111a302c36a8739b438e
    file_sha256: d88b74a495e0dfa1a5ec4dfa903c672351be9bf909b80c6ef551352268ec9163
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q3-perplexity.md
    snapshot_sha256: d88b74a495e0dfa1a5ec4dfa903c672351be9bf909b80c6ef551352268ec9163
    entry_key: e8aa9e6f7bab2d401a47e7805eef5d9d178f422a9e3dcbd402c9fd9420c84b79
  - object_id: ARV-GEO-C2-AFTER-Q6-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-google-ai-1-reviewed.md
    content_sha256: 4a00cdec285ca9497b832f9623fa93fab4eafd86caac6dbce1623f97de21962d
    file_sha256: fc4d5b0a881dca693fa92bae9b1717e2dec2e1f8d962ad00956ea609b32f8f47
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-google-ai-1-reviewed.md
    snapshot_sha256: fc4d5b0a881dca693fa92bae9b1717e2dec2e1f8d962ad00956ea609b32f8f47
    entry_key: e8d6f018414197ee640318efebd740beb1b073b7df7ca4171cf209a9660f9268
  - object_id: ARV-GEO-C2-AFTER-Q6-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-perplexity-2-reviewed.md
    content_sha256: e2929a39e9c3bccf01a2af39d88b3693f0237dadab237d80cd8b4762563ddeb4
    file_sha256: 86fd74eef0500a8a6b397e504548d219cd4ccd5fcb8d8d339cb123368919a57d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-perplexity-2-reviewed.md
    snapshot_sha256: 86fd74eef0500a8a6b397e504548d219cd4ccd5fcb8d8d339cb123368919a57d
    entry_key: e9c498ce3a5934875e3183f7ddd411fab0c8d75405e4cb6eeff6c892ffa73436
  - object_id: ARV-GEO-C2-AFTER-Q4-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-google-ai-2-reviewed.md
    content_sha256: fe2b900e29516f16c4efd769969139bd5195dc10217b8c93a62929e0e35a3d66
    file_sha256: 70bd5b7a645809005311f69f1952feb806a72f1fa520cc29e7acfc1bd970e834
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-google-ai-2-reviewed.md
    snapshot_sha256: 70bd5b7a645809005311f69f1952feb806a72f1fa520cc29e7acfc1bd970e834
    entry_key: e9f072081404554e584473b4c73f56b02211c74cbbcae4d5e5257c014dba6e49
  - object_id: ARV-GEO-C2-AFTER-Q6-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q6-claude-1-reviewed.md
    content_sha256: d9f1cd87d1785eff3126a4053f188fddc3119fefc6cc73427bfda60a49af8336
    file_sha256: 3d8c2b3e721627907447f6fe9a45bc0f56fb3228800460e21a941b82307f258b
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q6-claude-1-reviewed.md
    snapshot_sha256: 3d8c2b3e721627907447f6fe9a45bc0f56fb3228800460e21a941b82307f258b
    entry_key: ea293cfd4a3dbf97274c208558c15f341eb2fc17224748b76dde35f10c19286f
  - object_id: ARV-GEO-C2-BASE-Q1-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q1-gemini-1-reviewed.md
    content_sha256: 52466ae9c1f9c3a61959ff1944b9ab681f8c48521fbc1b188fa74e37329bef0a
    file_sha256: f9189c16d10006eea823a511f854584027f0104c59c7a50997479675b307a897
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q1-gemini-1-reviewed.md
    snapshot_sha256: f9189c16d10006eea823a511f854584027f0104c59c7a50997479675b307a897
    entry_key: ebdd43e5b09fecd5439e271214af81a594f3195efc45a1ef06f67b42bad069ee
  - object_id: AGG-GEO-C2-BASE-Q3-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q3-gemini.md
    content_sha256: 2e4b2e16278f7b8f55dafe8069a5b1249c202399459197dc7bc777b5b50c9f89
    file_sha256: b890508fdaa5db5735052644c67b53e0ed7e0d9f517e09b7095bdfc9d28023a2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q3-gemini.md
    snapshot_sha256: b890508fdaa5db5735052644c67b53e0ed7e0d9f517e09b7095bdfc9d28023a2
    entry_key: ec0db3516027ad5a46c4aa01715dfff8688e19a65138b2d0fed8bfdfdc6f750e
  - object_id: SMP-GEO-C2-BASE-Q1-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: ba974580881850493ca3e1eb508ad03fa8a9713499c71f624cd2c62906c48949
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-google-ai-2.md
    snapshot_sha256: ba974580881850493ca3e1eb508ad03fa8a9713499c71f624cd2c62906c48949
    entry_key: ec36bd1fab8972855e451dd27f1da0639ca6fbecc71d3a914dfc2a82fda6a89a
  - object_id: ANS-GEO-E2E-C2-3
    record_type: answer_card
    object_version: 1.0.0
    object_path: knowledge/answer-cards/ans-geo-e2e-c2-3.md
    content_sha256: e29054df05f124d3ea06f02361bc32ca6ca2c48e6d3b52055ffb1a84f0a66e87
    file_sha256: 541c2ca4ff39ef3edf540639d39743a091a4447f13785bf52ff92ec97de1e3a2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/answer-cards/ans-geo-e2e-c2-3.md
    snapshot_sha256: 541c2ca4ff39ef3edf540639d39743a091a4447f13785bf52ff92ec97de1e3a2
    entry_key: ee5962d20f48a6251de99bca2f5db38147190fe7571d81593a6fd1d5a01565b7
  - object_id: ARV-GEO-C2-BASE-Q3-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-claude-1-reviewed.md
    content_sha256: c3e4c4736b741de7f9cf0e1de5ccd32cbac673e70e662c89e2534331c93b6f41
    file_sha256: 2bfba2c67c9cf7d24260866592d5224412fd6ddd43873687c4b9a9c9d2a08220
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-claude-1-reviewed.md
    snapshot_sha256: 2bfba2c67c9cf7d24260866592d5224412fd6ddd43873687c4b9a9c9d2a08220
    entry_key: ee71e0dbe07aef228e74762326b72db7400bfb2d6cdd0c0ccc836dd78a283253
  - object_id: ARV-GEO-C2-BASE-Q2-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q2-claude-1-reviewed.md
    content_sha256: 1b56fd3ff4f05973536f8f5495c5a834023219eb7c56d35d1fe858d0f2fe62ba
    file_sha256: 8245e784ceafda2bb04ce665c03b22d5589c5ab417965f015d763a70478dd129
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q2-claude-1-reviewed.md
    snapshot_sha256: 8245e784ceafda2bb04ce665c03b22d5589c5ab417965f015d763a70478dd129
    entry_key: eee9d6e292476ee553cfcfce91ba6f20e4b9314a4f537448cd2669961b34d042
  - object_id: ARV-GEO-C2-BASE-Q3-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q3-chatgpt-1-reviewed.md
    content_sha256: 88a4ab91bb7df38f93342d7164bd490bff79aad45d713f9c22449a1dc5de1116
    file_sha256: 391b0d3c1681da425b5dadbd7b68889fa42d79f976f5c365a1b2c78a627d6327
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q3-chatgpt-1-reviewed.md
    snapshot_sha256: 391b0d3c1681da425b5dadbd7b68889fa42d79f976f5c365a1b2c78a627d6327
    entry_key: efe4751b008d4adb7a576f16258b6e571e2a36c02345f0c5d1b1a5f93f10adf5
  - object_id: DOC-GEO-E2E-CASE
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-case.md
    content_sha256: 7b0444b51d3763c8c8041c03de8f069a6ada649ef8b4f8f054a2713cf32faf92
    file_sha256: 714208c343ad81826406674317329fc667161d45fb9a0831436c94fce37ea3be
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-case.md
    snapshot_sha256: 714208c343ad81826406674317329fc667161d45fb9a0831436c94fce37ea3be
    entry_key: f037ddb358862339da1b2b160b74a2b33f1486214d46eb6f6a0980056d146325
  - object_id: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271
    record_type: query
    object_version: 1.0.0
    object_path: queries/candidates/q-what-capabilities-does-the-myyshop-en-3271.md
    content_sha256: e29054df05f124d3ea06f02361bc32ca6ca2c48e6d3b52055ffb1a84f0a66e87
    file_sha256: 788653985df16cb8097c033938eb67c5f827ea9a8e5b6ae5cc9cab2a09bc3be0
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/queries/candidates/q-what-capabilities-does-the-myyshop-en-3271.md
    snapshot_sha256: 788653985df16cb8097c033938eb67c5f827ea9a8e5b6ae5cc9cab2a09bc3be0
    entry_key: f123fc53823925f689bc109641981ee9bcb28b936aa0f85b7112deb8bc165671
  - object_id: SMP-GEO-C2-BASE-Q6-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q6-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 8ce19a510bbe115806c855f35aa4b6f5da1470cff6531cc072cbcae082d6f5b7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q6-google-ai-1.md
    snapshot_sha256: 8ce19a510bbe115806c855f35aa4b6f5da1470cff6531cc072cbcae082d6f5b7
    entry_key: f1ff43a97b65c82e6394bea13681aa5b47f1edfe4e30c417b96c7b7521ba8900
  - object_id: SMP-GEO-C2-BASE-Q1-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 659cc65323d35ad709461ecc86896eea79e5fc876f8ff0a96a371cb7175e1df6
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-gemini-2.md
    snapshot_sha256: 659cc65323d35ad709461ecc86896eea79e5fc876f8ff0a96a371cb7175e1df6
    entry_key: f225c8b77e22ae7966f94a7c970a3c238fa68bcc9d3ccdb169f51e9fd38aee72
  - object_id: SMP-GEO-C2-AFTER-Q1-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q1-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 4ee58b62ce64d2956f1accaf5d70ba960ed9b4a1e03a60909f9c790a1d08493c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q1-claude-1.md
    snapshot_sha256: 4ee58b62ce64d2956f1accaf5d70ba960ed9b4a1e03a60909f9c790a1d08493c
    entry_key: f2ac3092f129c7d0cd40f18e2a461c0bfaeaaf40407cf80f60b3361362877271
  - object_id: FND-GEO-C2-OFFICIAL-1
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-c2-official-1.md
    content_sha256: fe889a8d599195fea32ed3029ff33f853b21c5ddacfafdaa698dbd75ccc9ce45
    file_sha256: 7de0661606e75491a1ddb35baa023aa07f0940d1f1c29eae1670baef004c171f
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-c2-official-1.md
    snapshot_sha256: 7de0661606e75491a1ddb35baa023aa07f0940d1f1c29eae1670baef004c171f
    entry_key: f3b937afead980782a7725ce2068dfe96b5f99143857ae2f334e586e7342eab7
  - object_id: EVD-GEO-E2E-LEGACY
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-legacy.md
    content_sha256: 115347126b40e11f3aaa82b2cf9b793751c02bc82808fd3984c6c1b257bed8d8
    file_sha256: a91c48fbbbe7d0968e5e13dc20f5294eb583e321ee4f1b98fe698260f97779a4
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-legacy.md
    snapshot_sha256: a91c48fbbbe7d0968e5e13dc20f5294eb583e321ee4f1b98fe698260f97779a4
    entry_key: f3ee14fe7a652901a194d91a423b2fe0b5624ab3d6492c2b432a26d55f70492c
  - object_id: MER-MYYSHOP-001
    record_type: merchant
    object_version: 1.0.0
    object_path: execution/identity/merchant.md
    content_sha256: fe78dcaa3f721df1e7e16170d3894b3c4b98c61f3fe2545f4272042d10e59beb
    file_sha256: 03797ad886848a758bd33376e205cadb365b7ded03b996437d5f7204f542af76
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/execution/identity/merchant.md
    snapshot_sha256: 03797ad886848a758bd33376e205cadb365b7ded03b996437d5f7204f542af76
    entry_key: f45f6cb04d54a045b6bc029f0d6460ba20d9c64d609bf15ccef2ac550e56405a
  - object_id: SMP-GEO-C2-BASE-Q2-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q2-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: afb0f072945f59ec3b4f9428e0452584846ba6a516121c96f967c11d477a3b57
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q2-claude-2.md
    snapshot_sha256: afb0f072945f59ec3b4f9428e0452584846ba6a516121c96f967c11d477a3b57
    entry_key: f4c249b8af13eb101f3026fb4dc47b976a11abc6820857e0c86a3b63684d6bee
  - object_id: SRC-GEO-SITE-C1-OFFICIAL
    record_type: source
    object_version: 1.0.0
    object_path: evidence/sources/src-geo-site-c1-official.md
    content_sha256: 85f6014ccda5f0e589c130ad13d6998d19a37a90a06383b18f7ef4505adf6ded
    file_sha256: 49337219467d42b3616fe28581f9986157e1fd8f24699489327cca22bfa321fc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/sources/src-geo-site-c1-official.md
    snapshot_sha256: 49337219467d42b3616fe28581f9986157e1fd8f24699489327cca22bfa321fc
    entry_key: f545b9dfb4dfa5b45c375d0843a3679451b79714daf00783dc507a20b1d9b81e
  - object_id: AST-GEO-E2E-C2-OWN
    record_type: asset
    object_version: 1.0.0
    object_path: assets/own/ast-geo-e2e-c2-own.md
    content_sha256: 05e3ca52c30aa01e4db24e638a04c5b75022ac63a26667e65977cb8c3e609bc2
    file_sha256: 0c6489ce664ae370b5f7f1ac0b9a9c4422db4e3c074a865e7e96765e411de937
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/own/ast-geo-e2e-c2-own.md
    snapshot_sha256: 0c6489ce664ae370b5f7f1ac0b9a9c4422db4e3c074a865e7e96765e411de937
    entry_key: f554e4770e1634f78fa51d68499c0badf208a07978d35afbafc4123b65d8c170
  - object_id: FND-GEO-SITE-C2-BASE-THIRD-PARTY-CANONICAL
    record_type: finding
    object_version: 1.0.0
    object_path: findings/fnd-geo-site-c2-base-third-party-canonical.md
    content_sha256: 38f0dce4fe2d1d91f1731627f634e45f44cede066889a9ccb120e84374dace50
    file_sha256: 3d9cc92fd9eeb8d3540a400edfdd207681344ae387a1a8cd98a38fad552d1339
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/findings/fnd-geo-site-c2-base-third-party-canonical.md
    snapshot_sha256: 3d9cc92fd9eeb8d3540a400edfdd207681344ae387a1a8cd98a38fad552d1339
    entry_key: f73db0bbf3aff654ed564bab04e56b9c697502ad7893e0a27b284e62df8bcc81
  - object_id: ANO-GEO-C2
    record_type: analytics_observation
    object_version: 1.0.0
    object_path: cycles/m6/analytics/ano-geo-c2.md
    content_sha256: 65421194cea985633a204dd88ab9ec5d85d9acd9c3404dedd94dab8cbff18608
    file_sha256: 2c6d2a9f4d0d1dc7e9ce17e2e1b39bae33e5205579b94c5f2e093e3c1c1c2f99
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m6/analytics/ano-geo-c2.md
    snapshot_sha256: 2c6d2a9f4d0d1dc7e9ce17e2e1b39bae33e5205579b94c5f2e093e3c1c1c2f99
    entry_key: f765c18a7a4c205b4eba98d4f96d452d98d73161f63a83b52431972e3a764a68
  - object_id: ARV-GEO-C2-AFTER-Q3-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q3-google-ai-1-reviewed.md
    content_sha256: cfc5e58bdec35f9744946edcbb3ea8d63d0184b8ee51f3b4c0dfd1dd9b21f832
    file_sha256: 8930a0f62a82051a27ed5a8af3e1a999b6fc1ed4ffe4c3be7f7ab1168e7e1b29
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q3-google-ai-1-reviewed.md
    snapshot_sha256: 8930a0f62a82051a27ed5a8af3e1a999b6fc1ed4ffe4c3be7f7ab1168e7e1b29
    entry_key: f802d0a464b4e34a79451a44d0edb83313c5b339812535ca689ce6123926301f
  - object_id: DOC-GEO-E2E-IDENTITY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-identity.md
    content_sha256: e489eb225c655e10ed1c45fc3524e1762acc273045a358c911e74e136045b9f4
    file_sha256: 16797c92cefdbebad4050b06fcfb28719de22e8f658b2367066b2a854f9a4e80
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-identity.md
    snapshot_sha256: 16797c92cefdbebad4050b06fcfb28719de22e8f658b2367066b2a854f9a4e80
    entry_key: f84edc7c2ae12ce39d95f11e5e8efc0073e58808ea2389456b75a9c71afc4701
  - object_id: SMP-GEO-C2-AFTER-Q2-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-after-q2-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 4d6317f7ccbc891ff552bcb710bcae57f4929e54cf574ca24abf617f69c69e1c
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-after-q2-claude-1.md
    snapshot_sha256: 4d6317f7ccbc891ff552bcb710bcae57f4929e54cf574ca24abf617f69c69e1c
    entry_key: f8ab7031974c9e453bce3ae8248ec12d50518d70025c68b86a658358bcf5166c
  - object_id: DOC-GEO-E2E-PRIVACY
    record_type: document
    object_version: 1.0.0
    object_path: knowledge/documents/doc-e2e-privacy.md
    content_sha256: 6410f73c9189ee86d2323d1e93f3bba9086da2c377de3010782df8d880e2cc10
    file_sha256: aca117de587fc7483662e767f60ba993648f2f8fea97bec61c1aeddab02e9b37
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/documents/doc-e2e-privacy.md
    snapshot_sha256: aca117de587fc7483662e767f60ba993648f2f8fea97bec61c1aeddab02e9b37
    entry_key: f8f062bd00e37eaab720e8024eeac47aea4d83c57cd9847b856c479bb8fb42bc
  - object_id: ARV-GEO-C2-AFTER-Q1-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q1-perplexity-2-reviewed.md
    content_sha256: e6f678709076dc01b7fa09c966860f66f1f15cc81fbb8c7ebb85d8e298bb7b88
    file_sha256: 82cf210d926a0eaabfab41f028276388bc62133ee18037c1df6578ab2da07590
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q1-perplexity-2-reviewed.md
    snapshot_sha256: 82cf210d926a0eaabfab41f028276388bc62133ee18037c1df6578ab2da07590
    entry_key: f968369cc859c06235406d2f09aaa2efd8cdd7edc03984882eac0a6bb456c0c2
  - object_id: SMP-GEO-C2-BASE-Q3-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q3-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 9dd9a1c6613d8cdae35152d1ecdb41a6fc770ccf10076cd884837baf1dbdaeff
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q3-chatgpt-2.md
    snapshot_sha256: 9dd9a1c6613d8cdae35152d1ecdb41a6fc770ccf10076cd884837baf1dbdaeff
    entry_key: f96cae45d68e1b0ea96b08725930134c6f09e73531bc961452cda1ca8ad711d8
  - object_id: AGG-GEO-C2-AFTER-Q2-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q2-chatgpt.md
    content_sha256: 7be8dcba9e220db2739f965e43d7618eade4b9f8f9740d2d56daf6e4bcaabf72
    file_sha256: 1a7fb1c8eeefe106ac7140011a1390512450bdb61d43bae21855bd5ce89c421e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q2-chatgpt.md
    snapshot_sha256: 1a7fb1c8eeefe106ac7140011a1390512450bdb61d43bae21855bd5ce89c421e
    entry_key: f9b6dba78e38248cfbd3c51878e718f3f4a084beb86040c5b34f220de5f28ec6
  - object_id: CLM-GEO-E2E-IDENTITY
    record_type: claim
    object_version: 1.0.0
    object_path: knowledge/claims/clm-e2e-identity.md
    content_sha256: a72644835b1a7648ba95871bc7c874b7646ff9247675d45295e09105a2a124fa
    file_sha256: 81482f6278b56c751bd7a1f1fe935617ffb14d06cab934805b2559b89be1eb74
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/claims/clm-e2e-identity.md
    snapshot_sha256: 81482f6278b56c751bd7a1f1fe935617ffb14d06cab934805b2559b89be1eb74
    entry_key: fa0ddc14d59c94cdff81e79908556d5ca80783a1ff152763c1f9618b28e7b591
  - object_id: EVD-GEO-E2E-REFUND
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-refund.md
    content_sha256: d8d34b9f234e97400b8a96db2edb8664e4889192426a0a6be8fd884fc28b1808
    file_sha256: 4cf4dd8a708a97905fef675fcc1bb2c4bcf8320b8265bc2324a03c4b4da62700
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-refund.md
    snapshot_sha256: 4cf4dd8a708a97905fef675fcc1bb2c4bcf8320b8265bc2324a03c4b4da62700
    entry_key: fa59c57090344b55146599ad79b892bc185d679f1fe4a19a655d28145aafa4c8
  - object_id: AGG-GEO-C2-BASE-Q5-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q5-gemini.md
    content_sha256: 797c240e65bc80533a2890b4719ee57cd8438db455a30c1f983cdc6b2136c59e
    file_sha256: f53ef5756ec6319c91405c70e4d67cb037a017679d6880c51f5ddee6bb0d971e
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q5-gemini.md
    snapshot_sha256: f53ef5756ec6319c91405c70e4d67cb037a017679d6880c51f5ddee6bb0d971e
    entry_key: fad23dcb075d455b2f13534d27ff258cf051b5895a2985f11e056d0d4001ad16
  - object_id: SMP-GEO-C2-BASE-Q1-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q1-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 049a7ec7b62a443e4852100d20713af08bbfec015a2f870098a69910daab8dea
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q1-chatgpt-1.md
    snapshot_sha256: 049a7ec7b62a443e4852100d20713af08bbfec015a2f870098a69910daab8dea
    entry_key: fadb9c956ee094da6fa7d1a1a55c3ef35cd892b41cf0edbfe5780dde4276e173
  - object_id: AGG-GEO-C2-AFTER-Q3-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-after-q3-gemini.md
    content_sha256: a360d8bb5c6e79cd554eba13ea8782953d2aee4ae0fc6c8fb0c16df5d23a7369
    file_sha256: 411aaa7d33614af7980e6c648274be69f3512138d11573d48ade30ab8e4528c2
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-after-q3-gemini.md
    snapshot_sha256: 411aaa7d33614af7980e6c648274be69f3512138d11573d48ade30ab8e4528c2
    entry_key: fb2b417ae76d4a36a5b965cedf5fc30eab4423a740fc382541bb98b6349383ff
  - object_id: KBASE-GEO-E2E-2BB19816EE72
    record_type: brand_knowledge_base
    object_version: 1.0.0
    object_path: knowledge/meta/knowledge-base.md
    content_sha256: d0e85b74923a3c500675936bcfc580810fde7a43d961a8aca8aee633c5134dbd
    file_sha256: ebb4f1165375773b76a2f9a32c2d4e07235fccc7430dc132b01b44519b926c5d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/knowledge/meta/knowledge-base.md
    snapshot_sha256: ebb4f1165375773b76a2f9a32c2d4e07235fccc7430dc132b01b44519b926c5d
    entry_key: fbfaeb75f481c405ab451c94f87aca145c60f5f899488523262e10c41f4d53ed
  - object_id: ARV-GEO-C2-AFTER-Q4-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-chatgpt-1-reviewed.md
    content_sha256: ecb26e564306796bc2d58370e88712c4cd668919a27d374062aca952bb107886
    file_sha256: 482c8c95e5b2fb241c687ccfba33098da15386f53131f6f2036d7b666399102d
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-chatgpt-1-reviewed.md
    snapshot_sha256: 482c8c95e5b2fb241c687ccfba33098da15386f53131f6f2036d7b666399102d
    entry_key: fc4424314c9ff5c138dd14463076e40b7e94b6b02d02b1b52fb5b6240037cb64
  - object_id: ARV-GEO-C2-AFTER-Q5-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q5-gemini-2-reviewed.md
    content_sha256: 21795785cd7f0877b9d545b9fc6be1b38f78e000b570d5d79dfa2534c4ccebaa
    file_sha256: 4adbf900070923dfe72089c7beaf3b8a747bfc483b39d0ed7dc2bfd1470fecef
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q5-gemini-2-reviewed.md
    snapshot_sha256: 4adbf900070923dfe72089c7beaf3b8a747bfc483b39d0ed7dc2bfd1470fecef
    entry_key: fc6aca6ace241f7fbc27f22edc726e0fc2057a1f1470422a883e9567a40c8962
  - object_id: AST-GEO-E2E-C2-OFFICIAL
    record_type: asset
    object_version: 1.0.0
    object_path: assets/external/ast-geo-e2e-c2-official.md
    content_sha256: ffe434bb182e1a1d4124c81524c4c617be3666d6d4289d0ae97f759327a29459
    file_sha256: b5594934b32a13544a24cbc7392da3682cb003b35de9a3b42e300583ad3fecd7
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/assets/external/ast-geo-e2e-c2-official.md
    snapshot_sha256: b5594934b32a13544a24cbc7392da3682cb003b35de9a3b42e300583ad3fecd7
    entry_key: fd6adaf89a43d1f633fb8db75744b82aacb5d2cb2aad586c9e9b2c1afd62ab47
  - object_id: AGG-GEO-C2-BASE-Q5-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c2-base-q5-google-ai.md
    content_sha256: 66c98ca91cd76fa700fa5568cc605f527988e74dc3481c458c5f72fa2342b478
    file_sha256: 1eefb4aaaa213791a1cac75e0277c51ddad334d307d1051a6e1838e2849949e8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/aggregations/agg-geo-c2-base-q5-google-ai.md
    snapshot_sha256: 1eefb4aaaa213791a1cac75e0277c51ddad334d307d1051a6e1838e2849949e8
    entry_key: fd79816942a27fa26060ec2dacfdd3eeb4a0b4c01984fd6b4d9fd212ab54e370
  - object_id: SMP-GEO-C2-BASE-Q4-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c2-base-q4-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 60a6a593423496afa70beb0d7c30412e1248d93c5502ea5acba02d27d08c57dc
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/samples/smp-geo-c2-base-q4-claude-2.md
    snapshot_sha256: 60a6a593423496afa70beb0d7c30412e1248d93c5502ea5acba02d27d08c57dc
    entry_key: fe239e2925717b6e3c7d37bc7498e96d43b0cb899b72e6978c74bb1d66b6ae84
  - object_id: ARV-GEO-C2-AFTER-Q4-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-claude-2-reviewed.md
    content_sha256: a0786d04f41a3515201d5f0f4fcdd9ceb3bffd9366c73cc042a7c61545829e7c
    file_sha256: 216299f7081dc55f3e2e1109394e4e75a8a6fcacf60a42793f8855f45c0fb899
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-claude-2-reviewed.md
    snapshot_sha256: 216299f7081dc55f3e2e1109394e4e75a8a6fcacf60a42793f8855f45c0fb899
    entry_key: fe2939cbb4580f137597a14c07a3fc96a25633b7eeafc672c763b2c4b4620ba5
  - object_id: ARV-GEO-C2-AFTER-Q4-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-after-q4-perplexity-2-reviewed.md
    content_sha256: 5a112b9b1006c0e924522594f9cf6eb3688d2c6f119afdba6cd2d61ec2843221
    file_sha256: 6ccbaf6771c0a045b133948cd8033a91fea9e6b83f5f143c51e69b09fcf65a1a
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-after-q4-perplexity-2-reviewed.md
    snapshot_sha256: 6ccbaf6771c0a045b133948cd8033a91fea9e6b83f5f143c51e69b09fcf65a1a
    entry_key: fef78a8a91d53f2f16a472bf01b13acb07489dd644e642dbecdefdc0b1da0b67
  - object_id: EVD-GEO-E2E-FEES
    record_type: evidence
    object_version: 1.0.0
    object_path: evidence/records/evd-e2e-fees.md
    content_sha256: 6e0610ad7c6ea19a5143bad7b2167bddf28ecfc8e49ee460f16fd33060260812
    file_sha256: 6c278c90dc26490c2acd0e6e88d098587f69757b59b0187257379c5d4f6df728
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/evidence/records/evd-e2e-fees.md
    snapshot_sha256: 6c278c90dc26490c2acd0e6e88d098587f69757b59b0187257379c5d4f6df728
    entry_key: ff3066d41c22ae2db20edec7d54a33e177daa6f5062723c2805b846f75f72b8e
  - object_id: ARV-GEO-C2-BASE-Q5-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c2-base-q5-perplexity-2-reviewed.md
    content_sha256: dd08da3ab2ce422bc9661674f577b6bdfff66d5b5e2da54d79db6e488a6510d9
    file_sha256: 37e46648eecf536165782bc2d1c2fb4c9ab5a167729baafc4a0be8d362f94ea8
    snapshot_path: outputs/snapshots/cis-geo-c2-review/objects/cycles/m5/reviews/arv-geo-c2-base-q5-perplexity-2-reviewed.md
    snapshot_sha256: 37e46648eecf536165782bc2d1c2fb4c9ab5a167729baafc4a0be8d362f94ea8
    entry_key: ff59db54d174f62dd11f40e64692c20dc3b59576f3a739a5119e3b986718449b
artifact_entries:
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9311dcc68a85-collector-2.json
    media_type: application/json
    source_sha256: 01ad40ed4d3f21b29f8e76f8547b94d3a203d64df57e38de7d089d5f8ffcd711
    snapshot_sha256: 01ad40ed4d3f21b29f8e76f8547b94d3a203d64df57e38de7d089d5f8ffcd711
    entry_key: 001f6a31fea70acb20a03e7833b745be1229a82bbfe2db24d38a4956cd57d6c6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/2d6053021932-answer-2.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: 00c98aa8f6e986afc80a4af76fc3804177c14e3cdbf91dba26975f3141a254ea
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-63176d7d-b3da-406e-89d6-ce65be11d394.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-63176d7d-b3da-406e-89d6-ce65be11d394.json
    media_type: application/json
    source_sha256: 81f9b0ab22093240317eb27d3aeeaf58ed12d3233bcadc29b97ef0e74bf336d6
    snapshot_sha256: 81f9b0ab22093240317eb27d3aeeaf58ed12d3233bcadc29b97ef0e74bf336d6
    entry_key: 026910f668909bff0edc48b08d09009e9ce0a9c5699955ea3ab1a5acb5291fec
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/fbb140417330-collector-2.json
    media_type: application/json
    source_sha256: 99723295e9bd8ba9c08af0080931c249000cecc0caad86a07e5f09777ae02de3
    snapshot_sha256: 99723295e9bd8ba9c08af0080931c249000cecc0caad86a07e5f09777ae02de3
    entry_key: 036228a8b28c179c59422e53c3015f4b54f234a0b2b968ee97b40a84a73e7717
  - role: supporting_artifact
    source_path: assets/published/C2/own-readback.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/own-readback.json
    media_type: application/json
    source_sha256: 431e65bb0cd2b3723be29a1305d47b8c32abf948b78189464d9d31c852a2e83f
    snapshot_sha256: 431e65bb0cd2b3723be29a1305d47b8c32abf948b78189464d9d31c852a2e83f
    entry_key: 03b6105a499475602af137d7a3ef0e178a31c680b3ae5797c38aaf6a88f056ed
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/936e0719500d-answer-2.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 055fca5ac50d6bfa59dfa6f248e62ca00fb73d1547a52adde17549bcb51e76bb
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/51de85779acc-collector-2.json
    media_type: application/json
    source_sha256: ee5a4ba166e39d2c93f523f52894b217238a8df1108b90b56cf0dcfe3fdfb789
    snapshot_sha256: ee5a4ba166e39d2c93f523f52894b217238a8df1108b90b56cf0dcfe3fdfb789
    entry_key: 0587da84f77199dde4e5781a0d17b5864cfbd35fa543d0c891afb85d4f3c5bc8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8c66363e36ce-extraction-2.json
    media_type: application/json
    source_sha256: b04463d249c2d24fc7289478987e100732b417313c7bd7f280e367091eeeea78
    snapshot_sha256: b04463d249c2d24fc7289478987e100732b417313c7bd7f280e367091eeeea78
    entry_key: 07eea8377d032cf316e3f51abe5e264c154f58453a3555450e59671ff23d9565
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-36bf1494-130a-431e-bd08-be49cd3b51e0.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-36bf1494-130a-431e-bd08-be49cd3b51e0.json
    media_type: application/json
    source_sha256: 6f64dffb3a9455ec2de0078d9b862689af1c26a16a4db99db8ebde50157620bd
    snapshot_sha256: 6f64dffb3a9455ec2de0078d9b862689af1c26a16a4db99db8ebde50157620bd
    entry_key: 091a3efb7e7b8b4448a30b517697fe61e6009b907d6bb5aa75c9350fef7afd53
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/776c7bab3f8e-answer-2.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 09b6c93c2b6de93c427482de5b3cf600e536198ef13da9c8e12bea57ac7550fc
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/d4da4f522ab7-extraction-2.json
    media_type: application/json
    source_sha256: 358bdaab7de81a243c202d6796d098c1f1456708f020aae29075242944322738
    snapshot_sha256: 358bdaab7de81a243c202d6796d098c1f1456708f020aae29075242944322738
    entry_key: 0a97829237a90273a97197e16097f7765b462458ab68a84684babceb8eda6709
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/13e488d26525-collector-2.json
    media_type: application/json
    source_sha256: d5b41c07b1aa5b94c5c2c000356a529f701971b9676ee48051f600bf0d846414
    snapshot_sha256: d5b41c07b1aa5b94c5c2c000356a529f701971b9676ee48051f600bf0d846414
    entry_key: 0aa5836ae6c32f33a0a59594ce05aa433b33e0694a651704dd4e5b7fdd819475
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/c6beb168f330-extraction-2.json
    media_type: application/json
    source_sha256: e5fb3ef469d2f23e44571d4615a4049f17228019565814a48b668e14a1bb2a5a
    snapshot_sha256: e5fb3ef469d2f23e44571d4615a4049f17228019565814a48b668e14a1bb2a5a
    entry_key: 0b2a4882487a4083eb39f7ad9f20ce4d55ccf4559dffa084d88c81aa57be4197
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a5adef268e89-extraction-2.json
    media_type: application/json
    source_sha256: 4a9e1e4307e125ae8fab0cb3f192bd508bfed848f251ea5c120528a8c1e539f7
    snapshot_sha256: 4a9e1e4307e125ae8fab0cb3f192bd508bfed848f251ea5c120528a8c1e539f7
    entry_key: 0bb817bfd70fb18e37903da3b7112ba35ba9a802335b177ecfb11862b483c9a4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/f1b2ffafb6a0-collector-2.json
    media_type: application/json
    source_sha256: 3594e6e561dae965f6d8494a48e3a74c7a596a4a7027e4b9ff9971ba517d98d8
    snapshot_sha256: 3594e6e561dae965f6d8494a48e3a74c7a596a4a7027e4b9ff9971ba517d98d8
    entry_key: 0c3ce25ef170d0abeb46c179f1e8d0ec8b4ca5506d7fc8d372d0c8ea5edad87a
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-dac7913c-36e2-4426-b77d-2b7ba620f53c.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-dac7913c-36e2-4426-b77d-2b7ba620f53c.json
    media_type: application/json
    source_sha256: b01645665ca313b309080318b71e19e8ffa829923e53c56c88d786cfcb3e00ca
    snapshot_sha256: b01645665ca313b309080318b71e19e8ffa829923e53c56c88d786cfcb3e00ca
    entry_key: 0dc07424fb012e8f85cdeec08b965ea56e445787c7f3138b81695999abc0fc43
  - role: supporting_artifact
    source_path: reviews/decisions/OWNER-C2-AFTER-ANSWERS.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/75561987e1b3-OWNER-C2-AFTER-ANSWERS.json
    media_type: application/json
    source_sha256: 724e52d0918363783019719feee3623abe283730ad1679565aca5843b1466c4b
    snapshot_sha256: 724e52d0918363783019719feee3623abe283730ad1679565aca5843b1466c4b
    entry_key: 0ec95561ee774b0cca443b40da28e0afcce0f6dc0f40b163f15eac723a3582ec
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/d18e8f9f609d-answer-1.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: 109ee92dab08929fe79ed40d50e1a7c49b706bd33aca4b93b58051631831e815
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/2c8cf488bb72-extraction-2.json
    media_type: application/json
    source_sha256: ddae4d6999a4c6a0144f882161d89a81688124c622055cdd055851d41ccfa2e2
    snapshot_sha256: ddae4d6999a4c6a0144f882161d89a81688124c622055cdd055851d41ccfa2e2
    entry_key: 11be4de6cff3e8ea93e825103e8d7152fbf89bc20e2bba37d9fccf2b4ce87a23
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/bdaff0a88537-collector-2.json
    media_type: application/json
    source_sha256: 71a1e1974343989d2bd5aceae37d9ca8844b2e74e0424b535a71443145efd671
    snapshot_sha256: 71a1e1974343989d2bd5aceae37d9ca8844b2e74e0424b535a71443145efd671
    entry_key: 12ed7470feea25c09ac0b38662d033df1d6716da30c46a7caac9848aca433d97
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C2-AFTER-ANSWERS.md
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/OWNER-C2-AFTER-ANSWERS.md
    media_type: text/plain
    source_sha256: 3a43d07aa0fa0eb6e72a630df0df8dd1b0024dc14d91f4dd33b8b4b4397351a2
    snapshot_sha256: 3a43d07aa0fa0eb6e72a630df0df8dd1b0024dc14d91f4dd33b8b4b4397351a2
    entry_key: 16924c50bcbed61ea869dbd3955bbc9a11e24cc6ec246d86e75ea5a1f4d23be3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/71650cfe168b-collector-1.json
    media_type: application/json
    source_sha256: 891c55594208beffee83985751f6ceae992f7292820ec7716a748fdf06620f08
    snapshot_sha256: 891c55594208beffee83985751f6ceae992f7292820ec7716a748fdf06620f08
    entry_key: 1715497fed74a991c60361faa4ccd29f2e47a7bdcf12ff0ccbdaaddcd24265bf
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7c271318-c9a4-455c-a57a-03c9be3077e3.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-7c271318-c9a4-455c-a57a-03c9be3077e3.json
    media_type: application/json
    source_sha256: acc7f07a22d043073b8bbf43c116370fdebbe7e379f81e2e5b9ad719538d6c5a
    snapshot_sha256: acc7f07a22d043073b8bbf43c116370fdebbe7e379f81e2e5b9ad719538d6c5a
    entry_key: 1771ed53d57ec1fe64a7a28a3c24bd7ca1f613aafb66954d11f82b7e5f67a617
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/7519bce341d4-collector-2.json
    media_type: application/json
    source_sha256: 7eb62d3ef3cd002321b3fb9a1906e87ea698fcfa675af2e5ae8c4758940ace5b
    snapshot_sha256: 7eb62d3ef3cd002321b3fb9a1906e87ea698fcfa675af2e5ae8c4758940ace5b
    entry_key: 17e140bd56adca4e7f3665d517e92de1801499a40296df92ffea274826eb43c1
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-0ac8faac-dc4c-42f5-83cf-ad7575000b21.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-0ac8faac-dc4c-42f5-83cf-ad7575000b21.json
    media_type: application/json
    source_sha256: 0114be9d3e3aee2d9ef0002390e5a9037e2bbb0bcb2b3405b6449ccf8cd71bdd
    snapshot_sha256: 0114be9d3e3aee2d9ef0002390e5a9037e2bbb0bcb2b3405b6449ccf8cd71bdd
    entry_key: 190de2eef0facf992efdc5baa8ec26d8b9e34da4c25cee92fff8b54d34bdba1c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/48f9b077641e-collector-2.json
    media_type: application/json
    source_sha256: cbfa47ec4c9384f258cb84fbbb5445f315055f4b68ae5b93fc33b98849477d4c
    snapshot_sha256: cbfa47ec4c9384f258cb84fbbb5445f315055f4b68ae5b93fc33b98849477d4c
    entry_key: 1a267e4e5f0657abcdf78181689c98bf0ff9e29a7d7973ea1bfd23118cc1921e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/254ad7b65383-extraction-2.json
    media_type: application/json
    source_sha256: 2e2e4312289cacef93532e2d280db56fac8ec437731ff71cdf240b6f32b74782
    snapshot_sha256: 2e2e4312289cacef93532e2d280db56fac8ec437731ff71cdf240b6f32b74782
    entry_key: 1acfb3ccf8664f465b6a4e80f8a2b312f5766c156b60081e81311592330b0865
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/234085eefa37-collector-1.json
    media_type: application/json
    source_sha256: c9e4c570e440db80b4a6096927a92e61bf5a68f1352b423b2355cd527546ba43
    snapshot_sha256: c9e4c570e440db80b4a6096927a92e61bf5a68f1352b423b2355cd527546ba43
    entry_key: 1b57cdf754201b5d8784901396465a85a3605dc620965a6c17b5fe090bdefd34
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/e30ccb875fa2-answer-2.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 1ca139401a431a41eb50e62b69adad9c0a31bf8174a23cd70b9fc26bd948ef7a
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-c9615f87-aa30-4432-bc7f-acbeb8ba2ccc.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-c9615f87-aa30-4432-bc7f-acbeb8ba2ccc.json
    media_type: application/json
    source_sha256: 7275281a4745105133d35de74e7082f09ed84cacd989a9a177b2567d9ffd1580
    snapshot_sha256: 7275281a4745105133d35de74e7082f09ed84cacd989a9a177b2567d9ffd1580
    entry_key: 1ce49b0c283c1553579817e327f62cd230f9d28075b988e75ed5f0cc4baf9688
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a155142d085d-extraction-1.json
    media_type: application/json
    source_sha256: fe99f3aaddfba2f6a540fb7b082e56ae835a15852123d033cff1524e2f6e36ab
    snapshot_sha256: fe99f3aaddfba2f6a540fb7b082e56ae835a15852123d033cff1524e2f6e36ab
    entry_key: 1d5904859be2fc2c813a0b9a2aee8643efecdeb4841d94a8eb9d804ab720d3c0
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/2e8534bfc020-answer-2.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: 1e3fe9585195c792ec3df62ade32021716744a51e20de57d8fbb3bef70638776
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8b182aef1a67-collector-2.json
    media_type: application/json
    source_sha256: 0e356e31357544672f715fbfc0be9f99eff7ab0b53d61b4353c5dcb4ca478a30
    snapshot_sha256: 0e356e31357544672f715fbfc0be9f99eff7ab0b53d61b4353c5dcb4ca478a30
    entry_key: 2067b10a7d4df6cabc91a9068eff532b981de9842f6f6ff269d61796b79a73d9
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/77e7e01a338f-extraction-2.json
    media_type: application/json
    source_sha256: 0f205d3abc30bced04f07288bc90a37cfef2327f57ccea08032f9abc944af976
    snapshot_sha256: 0f205d3abc30bced04f07288bc90a37cfef2327f57ccea08032f9abc944af976
    entry_key: 21ae62320a3cb07a41880b5fba305b9af1043226af22f26f2d633cca83a87513
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/66e2e48d658a-answer-1.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 2240ed8ef4e204743664f03467764fb8f2617e5a3b4887f314fdf1df47b244b2
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/de574cca08e2-collector-1.json
    media_type: application/json
    source_sha256: e89480f7a475cf3b3d19c287bfd011d8b0ada29b50f282e6c43b3d2738b31be8
    snapshot_sha256: e89480f7a475cf3b3d19c287bfd011d8b0ada29b50f282e6c43b3d2738b31be8
    entry_key: 22565016b01daca26463b4281665ed8ba6ef15ef698b431b99a35d39030e18f9
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/bad58fc71936-answer-2.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: 24a2a9feab157aab209e13b17b961fbb2e984a376382c812304cb96dcc0619c3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/eb0832120fda-collector-1.json
    media_type: application/json
    source_sha256: faafa141778fa34f273fdede49384cb133dab45a330b673e3b41f73ae13d7241
    snapshot_sha256: faafa141778fa34f273fdede49384cb133dab45a330b673e3b41f73ae13d7241
    entry_key: 24e01bf6816e8a587b78db77d0cc88d877d50fc0a6c7d32f70bb66fdbbeb1835
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9d3b8f72a691-collector-2.json
    media_type: application/json
    source_sha256: 191e6a1150e7967a33e36e0eeb0c199debdd1a8991ef5bbecdf5aa465f53cf1d
    snapshot_sha256: 191e6a1150e7967a33e36e0eeb0c199debdd1a8991ef5bbecdf5aa465f53cf1d
    entry_key: 2502c88998d3c03067a9b96806d4025d9cf63f46cd0f38c0463fdfed2b090555
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-6609d0ab-e4f7-4d9a-a3b1-fe5d3c8f4fa4.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-6609d0ab-e4f7-4d9a-a3b1-fe5d3c8f4fa4.json
    media_type: application/json
    source_sha256: 47cbdf76cdd9e93e019079bd710f5b9ea2f7d6623fe34be33690f07fffec1155
    snapshot_sha256: 47cbdf76cdd9e93e019079bd710f5b9ea2f7d6623fe34be33690f07fffec1155
    entry_key: 25e149f08688fd0902fb9438c63ee4854f32fd477f77ed64487cc61a4668e934
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/f211271b4274-extraction-1.json
    media_type: application/json
    source_sha256: 1de11f077fa70ff230a674515c29f0abae4d509c582f9027e4e213d058788d12
    snapshot_sha256: 1de11f077fa70ff230a674515c29f0abae4d509c582f9027e4e213d058788d12
    entry_key: 298aff67de876cd2c2290d637820130bf297cfe96cf953f158234a6f1c56fd8d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/081c855ec81b-answer-2.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 2c22186bbebee28b96248f31708a03ad9689085a2f0c0ec48396d9e9e376e961
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/48502c7da3b3-answer-1.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: 2d213af7f63d3dd368f7a040a1288d5f0c59196776e517385a3df1ca779e07c8
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-157acc0b-9998-43b9-81fb-0e9205bc5a0e.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-157acc0b-9998-43b9-81fb-0e9205bc5a0e.json
    media_type: application/json
    source_sha256: 691cb4004c7233048b680d9b0d888e3ac7a23e4c707f7cae382784b86f67dc59
    snapshot_sha256: 691cb4004c7233048b680d9b0d888e3ac7a23e4c707f7cae382784b86f67dc59
    entry_key: 2f619f6b416bc18a96d6b164be846b8b11a7e637610f8abc5c3f1ba4c6147707
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/429aeab20375-answer-1.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 30457820614578bef6f8f8742ca63b2074d7b66cfe532d1d5fce397914c44b4c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-09371cec-be80-4891-987f-193c5ca05a8f.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-09371cec-be80-4891-987f-193c5ca05a8f.json
    media_type: application/json
    source_sha256: d8b8fc0974f776c929d63381728137f66f8f354af77fb598089e60c9ace07fe7
    snapshot_sha256: d8b8fc0974f776c929d63381728137f66f8f354af77fb598089e60c9ace07fe7
    entry_key: 33093aa66e0bffe66dfbd52a7172d43bb44b632996531f4650b242b46c413127
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/71c5d62dcb3f-answer-2.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 3313810bc97617e037261a3d5be3388e0eb1acc694c094f564fc1dc47d9fb562
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/b3e4bcc8d185-collector-1.json
    media_type: application/json
    source_sha256: cd970880ed8452e4089a72d15c3c21ef3c43969e810212ebe2f9dab59c082226
    snapshot_sha256: cd970880ed8452e4089a72d15c3c21ef3c43969e810212ebe2f9dab59c082226
    entry_key: 3362c1da218476bcc4b99f508d792062e5f929e16b52e16e6dadf0f6181a1238
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/96104d346d3f-collector-2.json
    media_type: application/json
    source_sha256: a70f8ed6a5d59d49cfde90352ff52ab9672e8b8e3dc53311bdfb17e541368280
    snapshot_sha256: a70f8ed6a5d59d49cfde90352ff52ab9672e8b8e3dc53311bdfb17e541368280
    entry_key: 33c24d1ec994ba3c735415efdf7c99ef5c0f6d5bc787850ded642ec70886c9f1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/7c69a656ba91-answer-2.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 361de47b5ef12571e124d2e36aad09a7372283f34eb3057f5f83b534f269a905
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-e0456d6e-c06c-40b4-86e3-38b3f8534c5e.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-e0456d6e-c06c-40b4-86e3-38b3f8534c5e.json
    media_type: application/json
    source_sha256: 18e63ea003fe81f84fe38f317f3774e5e242fc8343276a7f3400bc778b9d7ea8
    snapshot_sha256: 18e63ea003fe81f84fe38f317f3774e5e242fc8343276a7f3400bc778b9d7ea8
    entry_key: 3788bdb53866df2e49bd29f790959dfa8b51baed054927dee197ab9afe95ff6f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/01666ff0e297-extraction-1.json
    media_type: application/json
    source_sha256: 0300a4ba311e36c5a989deb217cea68e1a04168991651f9fa656f06e747325da
    snapshot_sha256: 0300a4ba311e36c5a989deb217cea68e1a04168991651f9fa656f06e747325da
    entry_key: 37b88487c4140113500f77874c26e741a568d42139026d720f48dc5b17f41d51
  - role: supporting_artifact
    source_path: assets/publications/pub-geo-c2-own-v2.md
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/pub-geo-c2-own-v2.md
    media_type: text/plain
    source_sha256: 102728bb445d3d2925a5aca89be4635fd123615130f1618416df52322d139661
    snapshot_sha256: 102728bb445d3d2925a5aca89be4635fd123615130f1618416df52322d139661
    entry_key: 38e42df05ff9a6c859630db7662184392540e1a7b0382be725a97db679691a09
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/462f8831203e-collector-1.json
    media_type: application/json
    source_sha256: 9bb8fe804834813610f82e83c754ad2d1be9aeb493a33ffd153e5082a9fa3a96
    snapshot_sha256: 9bb8fe804834813610f82e83c754ad2d1be9aeb493a33ffd153e5082a9fa3a96
    entry_key: 3925c9b78ff0b817ef0ea82c79be1afbf7a6d1009c59ddb9b8cb80b1f0d92149
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/f35fcc2e41d4-extraction-2.json
    media_type: application/json
    source_sha256: 2ce192ac447d7557b5d10ff624a3927817ce7bf44a13a90b995791186c0074f1
    snapshot_sha256: 2ce192ac447d7557b5d10ff624a3927817ce7bf44a13a90b995791186c0074f1
    entry_key: 3af72e6a5a258d8258436c6fa68788dc7b92a7eee51cf3a642cde84d67798949
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7048f05f-fbcd-4a14-9b26-6f7e02b3850b.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-7048f05f-fbcd-4a14-9b26-6f7e02b3850b.json
    media_type: application/json
    source_sha256: ea7102df93610630e126786f7424b62511a95ee35ed0cd40e946cc668a2e8eda
    snapshot_sha256: ea7102df93610630e126786f7424b62511a95ee35ed0cd40e946cc668a2e8eda
    entry_key: 3bb737c0f9976f34acf1d176ba1174fc4123dca57c0fad54d2e74212794131ee
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/6a0715bfdbe8-answer-2.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: 3bc79c42ef5f92445011add7715b3cf75da885e1309980dbd9ee62e8653075f7
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-48348907-b241-4551-a707-5b76e81ca921.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-48348907-b241-4551-a707-5b76e81ca921.json
    media_type: application/json
    source_sha256: d2de8e2cf56fa48c9565732cae4a39e84e49ae35852e20e7a37db2237d6af7a5
    snapshot_sha256: d2de8e2cf56fa48c9565732cae4a39e84e49ae35852e20e7a37db2237d6af7a5
    entry_key: 3df26c0397506219db2fc2d59e85db519cab512ee631624ef09812153f72b3e8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/32715b1915bc-collector-1.json
    media_type: application/json
    source_sha256: da7481a7f11216192dc07ab310b85600607dc4d525b44512d9c41fd6c1fe06a5
    snapshot_sha256: da7481a7f11216192dc07ab310b85600607dc4d525b44512d9c41fd6c1fe06a5
    entry_key: 3e2b13b15ada3a8ac82a3a97fdac7f985724da356dd8ff8a38c58c42c2bb7e68
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/225b17d2aba8-answer-2.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: 3e604bebbe28f6c7ad7a9d4ff93c258df71725516c565a7eebb935711e523e7e
  - role: other_contract
    source_path: cycles/preparation/matrix-C2-AFTER.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/matrix-C2-AFTER.json
    media_type: application/json
    source_sha256: 079065003ba6e5613e56d770213bed1960c2000b0169488a39d65ad08bd9d6a8
    snapshot_sha256: 079065003ba6e5613e56d770213bed1960c2000b0169488a39d65ad08bd9d6a8
    entry_key: 3e6d73e55a2b7dd29064cd404560d157511eeea1dcaa92fe83fdecc1462ae588
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/3a16595ae2ff-extraction-1.json
    media_type: application/json
    source_sha256: 7ddba547b38c011051b93d50b9e294d8bbd142dfac3f5e266fed741499e37351
    snapshot_sha256: 7ddba547b38c011051b93d50b9e294d8bbd142dfac3f5e266fed741499e37351
    entry_key: 3eef75e91d0136b9f88c2cbd805bdb3c36905010acc1750786d7548d659f82fa
  - role: supporting_artifact
    source_path: assets/published/C2/official-readback.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/official-readback.json
    media_type: application/json
    source_sha256: ae96fe4fa0a1d35784dbe44d5ac8b2170ecce9e3b6898aca4843433a305856f8
    snapshot_sha256: ae96fe4fa0a1d35784dbe44d5ac8b2170ecce9e3b6898aca4843433a305856f8
    entry_key: 40e8d92192cd7f03986e8a77031660cc984033fd2d148efa153e58cb3fbc4b7d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/ebb502b1c2f8-extraction-1.json
    media_type: application/json
    source_sha256: fedf5c211513410a1825c1bdd20db983bdc9f8a89b0809df68244511b09ef662
    snapshot_sha256: fedf5c211513410a1825c1bdd20db983bdc9f8a89b0809df68244511b09ef662
    entry_key: 41160ed501b6041fcd48f287ce0370881506e783414a7d2a05857d52bf05b8b3
  - role: supporting_artifact
    source_path: assets/publications/pub-geo-c2-official-v2.md
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/pub-geo-c2-official-v2.md
    media_type: text/plain
    source_sha256: 46f4782eb19b75b834200419dbe162e4218611e5d563daa801552d26317f1cec
    snapshot_sha256: 46f4782eb19b75b834200419dbe162e4218611e5d563daa801552d26317f1cec
    entry_key: 42e707a2431ffe5d7d27dd69e5404f13ef24a2efa8591ab426cfb519e8ab8dfe
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/7423a3feffb6-collector-2.json
    media_type: application/json
    source_sha256: 7c2ca03a5c5b6dca27c44747885bbd09e4d9afc2bb13eb18c4a120a8e874600c
    snapshot_sha256: 7c2ca03a5c5b6dca27c44747885bbd09e4d9afc2bb13eb18c4a120a8e874600c
    entry_key: 42eb4ae12d87dd121f832c561138573e8beee9b7e17db8630ece2c7ad90ba941
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/23a5fb9ea754-answer-1.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 430800cdb6e06c24f0b4705573693d504981cd922d5d4da4845f101ec1b93cc8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/53ccae261b57-collector-2.json
    media_type: application/json
    source_sha256: 2075c9a186f43004d61400822e308fc18396f59fa8b8f39c9c9c0043d99a39e6
    snapshot_sha256: 2075c9a186f43004d61400822e308fc18396f59fa8b8f39c9c9c0043d99a39e6
    entry_key: 43197392cf44e1b6a1eb7a78974e3026d9a7b81144edaf462e8ef19c4373caea
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/053cf6508d2b-extraction-2.json
    media_type: application/json
    source_sha256: d21e7c527999cb022716b925bf9c42c3efd9635e9bdb87234fd7217c7ce034b8
    snapshot_sha256: d21e7c527999cb022716b925bf9c42c3efd9635e9bdb87234fd7217c7ce034b8
    entry_key: 4394b9b150529eed586318a62c37d9b1cccf76927de4f149c9e838852e1e027a
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C2-AFTER-Q6.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/C2-AFTER-Q6.json
    media_type: application/json
    source_sha256: 857f29cddf0dab4eaa03557c7cc55ef813769ab20b49b6bade195ee04a307c00
    snapshot_sha256: 857f29cddf0dab4eaa03557c7cc55ef813769ab20b49b6bade195ee04a307c00
    entry_key: 44abde14ca40da5363a28207ffb42e70e053413e936319d83e21d4230a611fd4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/07ed26ec6980-collector-2.json
    media_type: application/json
    source_sha256: 774ed22b29065882de2e75882ecab6ef8bf0d78270c216316beec58d90e26998
    snapshot_sha256: 774ed22b29065882de2e75882ecab6ef8bf0d78270c216316beec58d90e26998
    entry_key: 454f1c1ab515ab1088d772528490c99302f1203fa48120ac46faf23400d4d1bf
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/fceab3c2bcb1-answer-1.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 461a972a7d808c3f46a654e968b68e42e61a45d735925c3922ce7216261db23c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2fef0026-c21c-4701-a317-911f8efbe210.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-2fef0026-c21c-4701-a317-911f8efbe210.json
    media_type: application/json
    source_sha256: f3783e31b9a998fc22b8e99a85448cbcdf5143d1a6f6c223abb3d9d7aa255685
    snapshot_sha256: f3783e31b9a998fc22b8e99a85448cbcdf5143d1a6f6c223abb3d9d7aa255685
    entry_key: 468d72afcfbffeddbc80393aca8fb98aabe439256bc72fc286f7e7fbe33eccef
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/36fcf1c6dc87-collector-1.json
    media_type: application/json
    source_sha256: 6bf5b74885d5c06e4f9c2deb5194fe89200260339e67a91025296f2ff4cb9837
    snapshot_sha256: 6bf5b74885d5c06e4f9c2deb5194fe89200260339e67a91025296f2ff4cb9837
    entry_key: 46c48a7f753a8b78167b4c02bd26292106937d6543a8f3f60b2d9b656bca782b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/920d856fbe5b-collector-1.json
    media_type: application/json
    source_sha256: 0a74ddcc7da991b802066223f37a748ce6299eb74a7b1b7b613f802f978cf0ed
    snapshot_sha256: 0a74ddcc7da991b802066223f37a748ce6299eb74a7b1b7b613f802f978cf0ed
    entry_key: 47691bd9ad0fd9033509fd7102f8b6415735a26bf88bcb8bc601e86561f046ca
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/23f61d416479-answer-2.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 478ced02cd26e63987106750ce88746174da81400cfefc5ae52047a456f423eb
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C2-AFTER-Q4.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/C2-AFTER-Q4.json
    media_type: application/json
    source_sha256: a89962da186ccf8b9453e37f36ebff470a2bd17abb532012c36127f802ebd7ab
    snapshot_sha256: a89962da186ccf8b9453e37f36ebff470a2bd17abb532012c36127f802ebd7ab
    entry_key: 4b5dab0e9e471b7482c259aee2c3fb0cda007bf59116d3acf7f44d59373ad142
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/fe94a1659062-answer-2.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: 4c66c435c3d80cbc83ef1d6e4de8c54bb2f35473e9fb3bac74aa443c3d95693e
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C2-PUBLICATION-V2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/7c0d85af28c7-OWNER-C2-PUBLICATION-V2.json
    media_type: application/json
    source_sha256: 8a873d233a0126127a3b15aa3160c726110d69dabc3b37d960c99a8040fced87
    snapshot_sha256: 8a873d233a0126127a3b15aa3160c726110d69dabc3b37d960c99a8040fced87
    entry_key: 4c9fe1bf7e4bd5d51d92a2718c1d6ee30dedbaf410fead31a39ed9554a04b09a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/0a972615c24f-answer-1.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 4cb961d0d6536fd9b5891d37c0bbdee18791e89f1241cdf7b5470471f613d56d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9ba137d601a7-extraction-1.json
    media_type: application/json
    source_sha256: 4d5499c5216231a1cc9d686d01fcb68e9812a301a512bb1bad27dae667c0bfd6
    snapshot_sha256: 4d5499c5216231a1cc9d686d01fcb68e9812a301a512bb1bad27dae667c0bfd6
    entry_key: 4f1b6fa7cf66234b15b0d2140e78b4845b4a483ec5e3bbbfc9a0e9baed004b5f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/946d4d1e457c-extraction-2.json
    media_type: application/json
    source_sha256: 2582e6247a8a43e5448f76de0ccbbee23cc1b83a0233b104dc42f6415ab3258a
    snapshot_sha256: 2582e6247a8a43e5448f76de0ccbbee23cc1b83a0233b104dc42f6415ab3258a
    entry_key: 4f74f7e1910b99b16de6be0cc593d8be3985a0d769ea2de0b04ca05ed5e8203d
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C2-AFTER-Q2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/C2-AFTER-Q2.json
    media_type: application/json
    source_sha256: a9cd82803bc63e88a05ee4a7e32e879bb8f8a7f907fec6fe17b9c02cd6f2da39
    snapshot_sha256: a9cd82803bc63e88a05ee4a7e32e879bb8f8a7f907fec6fe17b9c02cd6f2da39
    entry_key: 5018ca086464576a643bc189b710b25710dda51681b5a6a66b92796a6f7f91f8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/c96c32f74b4e-collector-1.json
    media_type: application/json
    source_sha256: eba247b38735f8f36eae41b9cff70642a94de739c5596e5daa7a0e8624b682c8
    snapshot_sha256: eba247b38735f8f36eae41b9cff70642a94de739c5596e5daa7a0e8624b682c8
    entry_key: 5102cd48b74f7b414b18212449153026967128c3724349774f16f241af75f9e3
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-08dfe514-06cf-48f7-84b1-f7ea7806af68.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-08dfe514-06cf-48f7-84b1-f7ea7806af68.json
    media_type: application/json
    source_sha256: 804693ed3a01696f47aa1f2948a44e9436f1a5ee388828c5503f9ab326e48ee1
    snapshot_sha256: 804693ed3a01696f47aa1f2948a44e9436f1a5ee388828c5503f9ab326e48ee1
    entry_key: 515c73acf24816ee9dc60563c1175e9ab5ceec7a2d54d051db71888fefae5d6c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/92a6df4e5129-collector-2.json
    media_type: application/json
    source_sha256: c4a715ea97846038faf6b1602aae445bbad1a0d027eb98ac333ebfec4b4db6d0
    snapshot_sha256: c4a715ea97846038faf6b1602aae445bbad1a0d027eb98ac333ebfec4b4db6d0
    entry_key: 54170209124b724b43cd39bcbe4de166b1a40b7259fcb476c7e387bc966be196
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/e31abf7626c8-collector-1.json
    media_type: application/json
    source_sha256: 0aced265562e1d406b722383845656da7cd7ec8ff8bc99d434f36e5f884d0fd0
    snapshot_sha256: 0aced265562e1d406b722383845656da7cd7ec8ff8bc99d434f36e5f884d0fd0
    entry_key: 5630db8c79b2dd5a1066bdf7050b2f989ad0cd64fa18e75ea2fa4c00d62aed26
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C2-AFTER-ANSWERS.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/fc1bd084c67a-OWNER-C2-AFTER-ANSWERS.json
    media_type: application/json
    source_sha256: 2271f4192ab290dc67cab61d5b546559f43f1585accf76ae43fe45b487424a73
    snapshot_sha256: 2271f4192ab290dc67cab61d5b546559f43f1585accf76ae43fe45b487424a73
    entry_key: 5856e4ce7f3d7057d5e955d9f5a0025e2ae2deb8e7f85e083297a4ed023434f6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/6508efb661a5-answer-1.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: 59ca8bb96cdbcb6215ba20cb7102323e06b62c6a8aee46277e28d56462bb0a39
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8403741193b7-answer-1.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: 5b0d52f7f5f317caf3152789ba8af2b5fdf03e2bd60d9e5a7134215c0868c509
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-8907a8da-6d3d-4205-acdc-10cf226aa1cd.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-8907a8da-6d3d-4205-acdc-10cf226aa1cd.json
    media_type: application/json
    source_sha256: 50eb7d6f6b529295483bee58b265c9f891771a84a567c31cfdb6de723adff9c9
    snapshot_sha256: 50eb7d6f6b529295483bee58b265c9f891771a84a567c31cfdb6de723adff9c9
    entry_key: 5b66d60e3c49df2b74588caade9dc025364b6655a9e3080a5077248af75e858f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/b2b1cb05d3cd-answer-1.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: 5c3ab2717f4003fc03d478d3894efd8f75fa0c33d1be224d0fef5370c045907e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/609fc9d4bccd-extraction-2.json
    media_type: application/json
    source_sha256: 7b13bb4280b4b578eb885f5d171eec3a76a2b7fb998e4067358b3741920f33fc
    snapshot_sha256: 7b13bb4280b4b578eb885f5d171eec3a76a2b7fb998e4067358b3741920f33fc
    entry_key: 5d3153b5d4f15643e54a36970844c8e006697ab888ac47ac13dff092ef4a5e14
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/de9e96b6dded-answer-1.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: 608788e8a539e6221508c6fd2b3a25fb218ea178b1bc98246bfd828b62dc6b6d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/42b27e80e349-collector-2.json
    media_type: application/json
    source_sha256: 3f74d988291bb34c096440c01db4287bc2d79c65ed9b1fce6b85d39554244803
    snapshot_sha256: 3f74d988291bb34c096440c01db4287bc2d79c65ed9b1fce6b85d39554244803
    entry_key: 632981eb591f360d6de1b6ce2ee5e45501abfae2b38dd0c950f21bef49e3699f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/2ca72fdf811b-collector-1.json
    media_type: application/json
    source_sha256: 4008a785add4ca6373ed0c6a0fded4858895c33071e7f65321f94ab98b4fe5c0
    snapshot_sha256: 4008a785add4ca6373ed0c6a0fded4858895c33071e7f65321f94ab98b4fe5c0
    entry_key: 639052dca0683ac96bd23b80ceb0546a5f8c9aa6f7c5d857bf975fa84486539d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/617a88e577b1-extraction-2.json
    media_type: application/json
    source_sha256: dbd86500b4ecd585fe23d1b73df69291997485b67f848fc9590043ccc421307e
    snapshot_sha256: dbd86500b4ecd585fe23d1b73df69291997485b67f848fc9590043ccc421307e
    entry_key: 64ac4e415d3533a56746c1b230adf29d0570fbd2e945ae0de8c8ea14356e13b9
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8b317fe64a35-answer-1.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 65d23aa85291b9d8af9a77709ff2976615ab7978303484a3a6bdbfa8df918350
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/583475cd8121-extraction-2.json
    media_type: application/json
    source_sha256: 02914cb975873b9f993eb517ce4a9e9b1022fbc23731a17d9f69d1b1d55df92c
    snapshot_sha256: 02914cb975873b9f993eb517ce4a9e9b1022fbc23731a17d9f69d1b1d55df92c
    entry_key: 66d385fb4dbe00524ec8614fdb921a71eff67933bd945a56e3f53e861daf8d61
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/edc08a82f69b-extraction-1.json
    media_type: application/json
    source_sha256: 0f42692432fc844eb017f8874f5712a39df0dd26b9fd7f79aba1ba8859c697d1
    snapshot_sha256: 0f42692432fc844eb017f8874f5712a39df0dd26b9fd7f79aba1ba8859c697d1
    entry_key: 694bf7d7952c1de201aec2e00d228b314ed2f83b702b348ba60ff3ae1caee339
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/aa4990197cd1-collector-1.json
    media_type: application/json
    source_sha256: babdce3860a4e968e7e5b136a911ea9ae836092cc4bd80e8a6962b406e2675b4
    snapshot_sha256: babdce3860a4e968e7e5b136a911ea9ae836092cc4bd80e8a6962b406e2675b4
    entry_key: 6b638f5f684cfb5601e32e4bddcdf8bccfcc9d19ad3ce5944d520d9b2b8dd5ff
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8c04b0390a71-collector-2.json
    media_type: application/json
    source_sha256: 8369d8fd6898f8477eb01671141f3fe51f025c5531f5c702e729fe09fcaa2743
    snapshot_sha256: 8369d8fd6898f8477eb01671141f3fe51f025c5531f5c702e729fe09fcaa2743
    entry_key: 6bdbab15c426f5c9fbe4d1f7a187557e79d1791bb4ae1b4b6c05f84b2f4f823d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/510f2b6c5d1a-extraction-2.json
    media_type: application/json
    source_sha256: f7ba6a8fe22ad721f0e67786d8d7b322fb358d9ff2a084644f86f9e55550a036
    snapshot_sha256: f7ba6a8fe22ad721f0e67786d8d7b322fb358d9ff2a084644f86f9e55550a036
    entry_key: 6bf863a45874175365fb0ca6b0f4ce6102ccdecce7efc62bc309bc2a3fcb6763
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7096e6ec-35aa-4282-bae5-8be96f6aed48.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-7096e6ec-35aa-4282-bae5-8be96f6aed48.json
    media_type: application/json
    source_sha256: 480bac0e46d2fb4e7d6c1d9873b05bc65cdcfc71fd542e9da030ac01e345f149
    snapshot_sha256: 480bac0e46d2fb4e7d6c1d9873b05bc65cdcfc71fd542e9da030ac01e345f149
    entry_key: 6c2bb3ef24a2d2ad5fc4141f659bb5f56072bfae1bef80fefc81539fb1dadf18
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-c7893e7b-e22c-4076-8c62-fb1c18249954.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-c7893e7b-e22c-4076-8c62-fb1c18249954.json
    media_type: application/json
    source_sha256: f11cb574400bf0c50231ca4d51b56abba57474a2d39100bde8c793e1a70d4ca1
    snapshot_sha256: f11cb574400bf0c50231ca4d51b56abba57474a2d39100bde8c793e1a70d4ca1
    entry_key: 6ce441406cb48a381db5eecc0e9140514caf4239771e11af138f5cfa961e51c2
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/bdae9085351c-answer-1.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: 6d9bdb797058a0927237b158bda7874c44a0fb697bdaebe038c1d2d21c5a0afa
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/1a13c4420576-extraction-1.json
    media_type: application/json
    source_sha256: f0fecd58c89ec6dc69c6c9b86508bcbd4e53e65f59d50a0953d588054316a16c
    snapshot_sha256: f0fecd58c89ec6dc69c6c9b86508bcbd4e53e65f59d50a0953d588054316a16c
    entry_key: 6d9ff8fa3b8f56e8928e4f6bbb644c943938672ddd2031803582c5dbda17a48e
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-efb25d4f-bd1a-4e0b-a5ed-3ee96a62231e.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-efb25d4f-bd1a-4e0b-a5ed-3ee96a62231e.json
    media_type: application/json
    source_sha256: 3aa7d9778d5fa7ed4099cad793d215d031bfead8c2fdbb48780280cea27b5ce4
    snapshot_sha256: 3aa7d9778d5fa7ed4099cad793d215d031bfead8c2fdbb48780280cea27b5ce4
    entry_key: 6e25e730bbc22e3e3a2708c2f66fde473ef59784a6f07ba8d5c567f1c56d6bf4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a8706ab31c46-extraction-1.json
    media_type: application/json
    source_sha256: ffb177812ed714cedae02985f20fe9efdec9a4a0d8812e554e66aec5ceb091c7
    snapshot_sha256: ffb177812ed714cedae02985f20fe9efdec9a4a0d8812e554e66aec5ceb091c7
    entry_key: 6eae5882c78dd0915b04ea74c5706cb93b3c4590393b9a33f5dfd2a8a3786480
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/66790261f9ef-extraction-1.json
    media_type: application/json
    source_sha256: 62708600c9f7996da9c78258e1bfa7fcc1721e3b3bfefd4a76ad48afa3635d83
    snapshot_sha256: 62708600c9f7996da9c78258e1bfa7fcc1721e3b3bfefd4a76ad48afa3635d83
    entry_key: 6f98383182c162376ccdb5fdac6dc220e29235a13a7ad77c05a4a78f11e00ff2
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/f850cb5d9a29-collector-2.json
    media_type: application/json
    source_sha256: c334d3d7f11a37decf56b252fc0d9efc646cc2a9b4bf76a42bb5afc8fe8039e5
    snapshot_sha256: c334d3d7f11a37decf56b252fc0d9efc646cc2a9b4bf76a42bb5afc8fe8039e5
    entry_key: 6fb1645e9a27626d9b6c703ecba624cf04189b535ebd72951b0713109a28d6d3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/2b08f20541ff-answer-1.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: 70b42d10faf6585229d368b5070cb8fa6429c7af5ff96be18fe8bc4e90497a14
  - role: sensitive_data_policy
    source_path: execution/contracts/sensitive-data-policy.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/sensitive-data-policy.json
    media_type: application/json
    source_sha256: ac819db2c463201f8d00e1a9dd8d081df9d1df7c5202b91ebc3404b2724310ab
    snapshot_sha256: ac819db2c463201f8d00e1a9dd8d081df9d1df7c5202b91ebc3404b2724310ab
    entry_key: 70bab051d8f5dc33260852058d5df5c9aea146573668326362897cf5d42d622e
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-a76d16af-d790-43f9-8726-b288f10eba72.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-a76d16af-d790-43f9-8726-b288f10eba72.json
    media_type: application/json
    source_sha256: 7a0f28719fb0f41dc217e8f595c8dc327ab8f900b2c1dfb5ad371e6a4aaee9a2
    snapshot_sha256: 7a0f28719fb0f41dc217e8f595c8dc327ab8f900b2c1dfb5ad371e6a4aaee9a2
    entry_key: 732126fdee74a5de3b7e41c00358312d2207c73cfe98c22157a4f31fdd324f09
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/031e94fff61a-collector-1.json
    media_type: application/json
    source_sha256: 0786d9a9a2ef3cd5c84f3e69d2079a14bc38987445c69b752e458fec04708d0a
    snapshot_sha256: 0786d9a9a2ef3cd5c84f3e69d2079a14bc38987445c69b752e458fec04708d0a
    entry_key: 7351b255968401deb92fdebfec8296aca8751300f2435793e5176de2f2a7e065
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/5a2685ef8f29-extraction-1.json
    media_type: application/json
    source_sha256: 6a5f531c51df19cd594b4a956a414baa92c65f53ce136486ece0553edfc2fdf6
    snapshot_sha256: 6a5f531c51df19cd594b4a956a414baa92c65f53ce136486ece0553edfc2fdf6
    entry_key: 74db056ac79c701b37f22e0c2eed7ceff1a3c254d42c26d83b109919c51b88c8
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-48590c7f-0f74-4b4a-bead-ec027105c8e2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-48590c7f-0f74-4b4a-bead-ec027105c8e2.json
    media_type: application/json
    source_sha256: 3927f5ee53f7ad6ccf55c9ba16461d0082bf4c04dab26b3844509ae0794c65a0
    snapshot_sha256: 3927f5ee53f7ad6ccf55c9ba16461d0082bf4c04dab26b3844509ae0794c65a0
    entry_key: 7515962d6a6289e319022aadcd67bf4afe7fe329d0572796a18f7d702ab53bb3
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-51f44fa2-b4f9-464d-8ccb-a907d5322565.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-51f44fa2-b4f9-464d-8ccb-a907d5322565.json
    media_type: application/json
    source_sha256: d29e3f53f731f824226af3dcca188d7fac2713a6b670259fc9db451d33fa60dc
    snapshot_sha256: d29e3f53f731f824226af3dcca188d7fac2713a6b670259fc9db451d33fa60dc
    entry_key: 76623c0df27c2d08b88142be39ece0a2ef5f6438110216e3c34ada52806c6f24
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/eab71a1a1a93-extraction-1.json
    media_type: application/json
    source_sha256: 683cc48ec050fadda8e60c53efd579355ae8b3a4ecc92896de531265c10b9d86
    snapshot_sha256: 683cc48ec050fadda8e60c53efd579355ae8b3a4ecc92896de531265c10b9d86
    entry_key: 76b02174e6f5a3394f7e62a19ff9f47d6b4d342c2e1def66c1477b4188c381dd
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-a2f47e97-fedc-4ef4-b2cf-57fc0ad2eb28.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-a2f47e97-fedc-4ef4-b2cf-57fc0ad2eb28.json
    media_type: application/json
    source_sha256: ae153ee57949ce00d91dab38db1e316da09eeb49c8e9f44e6fba5ce1c2dde107
    snapshot_sha256: ae153ee57949ce00d91dab38db1e316da09eeb49c8e9f44e6fba5ce1c2dde107
    entry_key: 772d4416fe60707d9c9de1b925cc03e966f28e00859b54a496f76be8305a9a4d
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-9580d825-b53e-41f8-b655-9858465b150c.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-9580d825-b53e-41f8-b655-9858465b150c.json
    media_type: application/json
    source_sha256: a84f8a6a8bd93f759da6fef3bd512ef8e018521418bb481bd528ae17145bab38
    snapshot_sha256: a84f8a6a8bd93f759da6fef3bd512ef8e018521418bb481bd528ae17145bab38
    entry_key: 775c8e244bc125518033ba35577803088950f7a3684100b1501e52aeb0eac7ad
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/f5659ee4dfbe-extraction-1.json
    media_type: application/json
    source_sha256: 28e54421e2b0a5e825a40547915996f2a90e0922ac46df6c5664a41d32bb8ea9
    snapshot_sha256: 28e54421e2b0a5e825a40547915996f2a90e0922ac46df6c5664a41d32bb8ea9
    entry_key: 78f0c09286206db138589698a059329a52bba5082f0d3c437ac2d7ca9924483e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/6eb7b566e7ba-collector-1.json
    media_type: application/json
    source_sha256: 3f95471eb9712de7d264fb13789cec229e488acb31a3bb00f56c3ac4f92ebd7f
    snapshot_sha256: 3f95471eb9712de7d264fb13789cec229e488acb31a3bb00f56c3ac4f92ebd7f
    entry_key: 79623e7a71b77f984a4e5e6dfedf6118ef281bf2261ec26740c00c6ce7ef7bdd
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/01756102517e-collector-2.json
    media_type: application/json
    source_sha256: 1ebc3a198770cd1441045608b51ff6c93627b99aaadc5f2872af4a2de73069eb
    snapshot_sha256: 1ebc3a198770cd1441045608b51ff6c93627b99aaadc5f2872af4a2de73069eb
    entry_key: 79ecd8d9c0e006c76d16a0ab600533ab0328f2930f293d8d8b67706b30de21e9
  - role: supporting_artifact
    source_path: reviews/decisions/OWNER-C2-PUBLICATION-V2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a6e1b730da95-OWNER-C2-PUBLICATION-V2.json
    media_type: application/json
    source_sha256: 6899248cf79c28294a4a1fb1882d775da23d4d2ca0d66a353436253731658eb4
    snapshot_sha256: 6899248cf79c28294a4a1fb1882d775da23d4d2ca0d66a353436253731658eb4
    entry_key: 7a8b681b48fe2f51eaf07691204f08ef3f4db5e2579ffa1a2e1a3ff0e6b74027
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C2-PUBLICATION-V2.md
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/OWNER-C2-PUBLICATION-V2.md
    media_type: text/plain
    source_sha256: 923d6d47e28b9a0c7dd5dc6a8532d2cb325b73e2babb85d15fbd8e50acb6adea
    snapshot_sha256: 923d6d47e28b9a0c7dd5dc6a8532d2cb325b73e2babb85d15fbd8e50acb6adea
    entry_key: 7da39b409436cac8e957018aef68f3c4aef7c9c8c15c8467933688f6af0f805f
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-c2a40a08-cb5b-4f25-a541-fbcf89f7eac3.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-c2a40a08-cb5b-4f25-a541-fbcf89f7eac3.json
    media_type: application/json
    source_sha256: 0cc616dcec4f71412e159db2d60be4c9c119dc74b177cab881273939ab5ab93e
    snapshot_sha256: 0cc616dcec4f71412e159db2d60be4c9c119dc74b177cab881273939ab5ab93e
    entry_key: 7ecff3d901f7f388fe306e89dd5747ee221332cfbab3aa3bc4117321675c6f2c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-aa5073f2-26a8-4a19-bebc-8f53420622cd.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-aa5073f2-26a8-4a19-bebc-8f53420622cd.json
    media_type: application/json
    source_sha256: 58b993066217a7c54f6f336b6d87802cb9e93288a0076ad6dce084f099b2ad60
    snapshot_sha256: 58b993066217a7c54f6f336b6d87802cb9e93288a0076ad6dce084f099b2ad60
    entry_key: 7ed59e5013b9fc35143b80d8c6f058e67eea684860ebb4230a10e342fabe596d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/e7f62c84dbc5-answer-1.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: 7ef3d90ea7a9c8e639731c04fc05c782a274ec92176ecb1e2c29abd01049b634
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/32f8d82f7eeb-collector-1.json
    media_type: application/json
    source_sha256: c649c73087d940e7905604776a7dfabc918c7bb6f316c9c6e66f0295b0ae2e81
    snapshot_sha256: c649c73087d940e7905604776a7dfabc918c7bb6f316c9c6e66f0295b0ae2e81
    entry_key: 7fc3df4896c1051da5698829b8ce23ed15b5ff95250ecb812028d2528bfc071d
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-ec7b8383-ea24-41f0-8e79-fc17612f3d84.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-ec7b8383-ea24-41f0-8e79-fc17612f3d84.json
    media_type: application/json
    source_sha256: e34e14ddafd477464c206f4a389bf42255ccb6cc7e33c391bf98e20cfe4088a7
    snapshot_sha256: e34e14ddafd477464c206f4a389bf42255ccb6cc7e33c391bf98e20cfe4088a7
    entry_key: 80350a4ff4144231314f468036ee30c1dd6a982548fff8c3a963843135b517e4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/fe727fc96489-extraction-2.json
    media_type: application/json
    source_sha256: 09e252ccc40644ff7e9cc18b4fb45c8fd44d1be286b179ee32cc24241342274e
    snapshot_sha256: 09e252ccc40644ff7e9cc18b4fb45c8fd44d1be286b179ee32cc24241342274e
    entry_key: 80e96bf05501122dc828ff9690b5bca00e998fe5e9241a70d4ec2dce0891c4e8
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-0183835c-958d-45b2-ac40-293e0e7573c0.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-0183835c-958d-45b2-ac40-293e0e7573c0.json
    media_type: application/json
    source_sha256: 5b4bc7f050bfbeeeacbe5a7ff1f259d73301af29e890354e3dccfc38bd2bd907
    snapshot_sha256: 5b4bc7f050bfbeeeacbe5a7ff1f259d73301af29e890354e3dccfc38bd2bd907
    entry_key: 83a063a756162d2be874d41dcdeac8448bf78b747f7ff9dcd666e21a666fc562
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/d299f7280411-answer-2.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: 83c8b63e45d2042b3accbb1def8185aa476c3f3d6c2c185e9dd45933063907e4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8e039e3c411d-extraction-1.json
    media_type: application/json
    source_sha256: b73ad0186f22978cdf4cfa21a18291217562c3d000f1fac5a2eb983752dfd40c
    snapshot_sha256: b73ad0186f22978cdf4cfa21a18291217562c3d000f1fac5a2eb983752dfd40c
    entry_key: 856721d219f2587b41b8e2eb67b4c2be8c6dc48ffd78d5977119e26c777e1e31
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: 85d07bdd2171a9031ae2e4b366b4c1f649ee3f99e73293a793c75e39c00d0946
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2b5918f9-62b5-4e1b-8239-a0024e4ab445.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-2b5918f9-62b5-4e1b-8239-a0024e4ab445.json
    media_type: application/json
    source_sha256: 42dc8a14829a73bfa4dd29ff00cd750111977c6d49563ab452cd4269f7d28a2e
    snapshot_sha256: 42dc8a14829a73bfa4dd29ff00cd750111977c6d49563ab452cd4269f7d28a2e
    entry_key: 86c7fc4d95d742b7992a71a4f49604c6fca24e8b69ec0c223860e483fb6b4c5c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/3355c0379917-extraction-1.json
    media_type: application/json
    source_sha256: 5b5dc0d8fcaf4d2d6bbaa723617e73931f586aa3dbf5fe26861ca3b7affeafcb
    snapshot_sha256: 5b5dc0d8fcaf4d2d6bbaa723617e73931f586aa3dbf5fe26861ca3b7affeafcb
    entry_key: 88e521e6b9b8ec071a841479423b4377c7b7407b3910d59f575a1e35d81088f8
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-914734f9-6766-497e-a246-1daf55109444.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-914734f9-6766-497e-a246-1daf55109444.json
    media_type: application/json
    source_sha256: 8cb13e803f3bf7d2f47609cb4c11c3c4a198183ae494820684473a108f1b7dde
    snapshot_sha256: 8cb13e803f3bf7d2f47609cb4c11c3c4a198183ae494820684473a108f1b7dde
    entry_key: 8a05449e6794dcc2362f99f8c102fbb50f3134b5b2e29eb519a5b54d1bc30e66
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/49a822b1d954-answer-1.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: 8b766f7b939a36b598fb4b068c3dad2cf3d559edc31db36fb91cda2e3cba999a
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-5b4a8a8b-ff38-467f-82a7-2affcd8098bf.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-5b4a8a8b-ff38-467f-82a7-2affcd8098bf.json
    media_type: application/json
    source_sha256: 74d84fef466a983984283dd2bbfdb6da1061b470482e0a31213f30c17dc8140b
    snapshot_sha256: 74d84fef466a983984283dd2bbfdb6da1061b470482e0a31213f30c17dc8140b
    entry_key: 8c03dd51b31c8fda167d3444f47bb88adcc6a8f0b0b8fa39d8dd07e388fdd8fa
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/1fafaa351095-extraction-2.json
    media_type: application/json
    source_sha256: c80a2fa46ce31967c7af9690b697a2061b2990a8cf2d101a451ba46e6e3de524
    snapshot_sha256: c80a2fa46ce31967c7af9690b697a2061b2990a8cf2d101a451ba46e6e3de524
    entry_key: 8d08a1fbcc26cb69d64f6fbaad95c60c32fc2f402ec0c97864f76ef87ee711cb
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/b266502697b0-extraction-2.json
    media_type: application/json
    source_sha256: 5c45c1abd63d8ea40b54e124078c061c3e9f4cacb7dcd2971550def3e481781d
    snapshot_sha256: 5c45c1abd63d8ea40b54e124078c061c3e9f4cacb7dcd2971550def3e481781d
    entry_key: 8dd987d11141f9aeceb087db78169342536d367c4c5e867c3750c66074ab8293
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8b32bc349440-extraction-2.json
    media_type: application/json
    source_sha256: ad9af769b82853bc5c63b7b31c8e500059db744c0135618a974ddc70ef3bbbbc
    snapshot_sha256: ad9af769b82853bc5c63b7b31c8e500059db744c0135618a974ddc70ef3bbbbc
    entry_key: 8f1052d3159c27d8ab282accdd6fbefa272308df65ebff72a35f2062f91e7b0d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/84748d0d6745-answer-1.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 903bdc4efc3eafded0cb7f35798f9a659a56edc4339baf1991d0e2113ee56291
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/5599fc1e9753-extraction-1.json
    media_type: application/json
    source_sha256: f4ad53aab084fad5bb7e182c26ad01a90ae4d78978628998eb5740975cce7280
    snapshot_sha256: f4ad53aab084fad5bb7e182c26ad01a90ae4d78978628998eb5740975cce7280
    entry_key: 913d8d0c5435e76a440c3561047734dd251888e15d6532aba291d93d2ad52185
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-980128c1-17ee-4c5d-b1ee-dbe1b2963e30.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-980128c1-17ee-4c5d-b1ee-dbe1b2963e30.json
    media_type: application/json
    source_sha256: 5ba9d3c4e23206ebbd86b96e909d43afc01ba6f10fd3d7cd955e916f85b2a920
    snapshot_sha256: 5ba9d3c4e23206ebbd86b96e909d43afc01ba6f10fd3d7cd955e916f85b2a920
    entry_key: 9141b5c515961849c3a563dd0df9cdd5d874d98fa1093fef613372d6fe44a325
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/19b4b87b0e2e-collector-1.json
    media_type: application/json
    source_sha256: 2991b8a09e60ce58d3a4671b671abda224440067e8f081409fdd347d949a4baa
    snapshot_sha256: 2991b8a09e60ce58d3a4671b671abda224440067e8f081409fdd347d949a4baa
    entry_key: 92a482f7400dd2a6341c3466f17ad134dca48a9989e80c23db7cde3e22ee7493
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/085f07fcab54-collector-1.json
    media_type: application/json
    source_sha256: 17582d2767f1ae5dd1cb164db97b91b7f50ef324845ad4802b9129a2462068fc
    snapshot_sha256: 17582d2767f1ae5dd1cb164db97b91b7f50ef324845ad4802b9129a2462068fc
    entry_key: 92da9f5ffc91acf475f077f64682abd0178027676657cfb0e08d15a7d2f46421
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/4a803d3becdb-answer-1.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: 936ae362c352bc145f387c4005b8087f7ad6158d527f643e9919347ea56109a4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/41e898dc8c4c-collector-1.json
    media_type: application/json
    source_sha256: dfb09dc5cde96c3c08f5b35e7b8989824769c77ac717aa46b0c89ec2965929a3
    snapshot_sha256: dfb09dc5cde96c3c08f5b35e7b8989824769c77ac717aa46b0c89ec2965929a3
    entry_key: 958a42ac7a5bd61b4811be0bbdeb61db20239af8843d30dc30be6ba702607741
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-e2c34090-3080-4f9c-b3eb-d1f79150be30.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-e2c34090-3080-4f9c-b3eb-d1f79150be30.json
    media_type: application/json
    source_sha256: 1087ccf0dff9bc2d6a9262fcd7719d6d58a17fe39b3862a94f0e7415ee2977d6
    snapshot_sha256: 1087ccf0dff9bc2d6a9262fcd7719d6d58a17fe39b3862a94f0e7415ee2977d6
    entry_key: 9aaa7b28919b065010f889eb41e36f739595b6224bdfd1ffcf196784d993efb6
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C2-AFTER-Q5.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/C2-AFTER-Q5.json
    media_type: application/json
    source_sha256: b2205072535c4dbe2868b927860936203c0e013a1924aa5d317dc8a8441ad81c
    snapshot_sha256: b2205072535c4dbe2868b927860936203c0e013a1924aa5d317dc8a8441ad81c
    entry_key: 9b163a79980a03ca149a2191e0dbe7ea1efdee00a46d995ab7a56b560a8eafe8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/1e3c8aa3ff7e-collector-1.json
    media_type: application/json
    source_sha256: 6b3dd9bf11e2c29f3e5f95d62ec3d79e77f0d70b2936e181f2a5b18a66c0a0df
    snapshot_sha256: 6b3dd9bf11e2c29f3e5f95d62ec3d79e77f0d70b2936e181f2a5b18a66c0a0df
    entry_key: 9b3009405a9bee627dad870da07d354a1b1fe62cf095938efc54cf7bd561ec9c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/b2bb2df6e85b-answer-2.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: 9b73954e0254a6f8d36d89dc53cfc11feba9bd7c8e023f160ad2599403f7ddc9
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/515cad98e854-extraction-2.json
    media_type: application/json
    source_sha256: 1b5d719febfc4e96a22ccf09c185327c86a6db33970383587c6956df9add9968
    snapshot_sha256: 1b5d719febfc4e96a22ccf09c185327c86a6db33970383587c6956df9add9968
    entry_key: 9b79d28b7187b3cac785f7150a10a9ce43a7d70e0c15f3c6d930eb944e26ab04
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/1b44e6cac883-collector-2.json
    media_type: application/json
    source_sha256: 5d0712ea13002a4c8719dbf90775a3aeef543e9d7392ce69cd5d8ff8d4498eac
    snapshot_sha256: 5d0712ea13002a4c8719dbf90775a3aeef543e9d7392ce69cd5d8ff8d4498eac
    entry_key: 9c576fa5dd4fc41d8570af302375ba1bb9db42786bd9166197abb75d6531f3c6
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-da09c5e5-c2a7-41d8-b025-fdb1d8bbf4cf.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-da09c5e5-c2a7-41d8-b025-fdb1d8bbf4cf.json
    media_type: application/json
    source_sha256: 7c7c274fdf59901c06c77d5b3a1fd1b0c07fd3265a366263959bb4a70267a770
    snapshot_sha256: 7c7c274fdf59901c06c77d5b3a1fd1b0c07fd3265a366263959bb4a70267a770
    entry_key: 9c956b31fb20430e2b7a0addea9e9097ad69e2f03efc311f44771047ea143213
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9fbe1298df04-answer-1.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: 9de509f557709ce2fe872858b70f024d1aad9112f474a12443c554eb2b621291
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/cbf8bccad422-answer-1.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: 9f9244742d4de7325e17ecf99956c338c147bbcbba3c254338eae3a74728306f
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-ec678639-74a9-4032-b634-3db80991dd8c.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-ec678639-74a9-4032-b634-3db80991dd8c.json
    media_type: application/json
    source_sha256: 9d48964834a0f289bc016e4d3aa35b41ba8fb4eeb648aa2662167273ea0b716a
    snapshot_sha256: 9d48964834a0f289bc016e4d3aa35b41ba8fb4eeb648aa2662167273ea0b716a
    entry_key: 9fa172673e5e4200dc57acf74646ee4b0dca3ff28c76d242d994b263688ceb75
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/13926d9fcc13-extraction-2.json
    media_type: application/json
    source_sha256: d98aa9504aa8f3a751fe9fb363227e1ff0eb25f8f8f2f9967970030137fe7a57
    snapshot_sha256: d98aa9504aa8f3a751fe9fb363227e1ff0eb25f8f8f2f9967970030137fe7a57
    entry_key: a01d1d6accb5ceb64074a029c5982defdb1d7f78b18d2caca7f636a5802e9794
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-e4555b0f-6db7-46fe-b252-4ae5b915ce63.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-e4555b0f-6db7-46fe-b252-4ae5b915ce63.json
    media_type: application/json
    source_sha256: cc97288c36cef01953ac085ac503215e8b92af2f60a076c83a7a20eeba22495e
    snapshot_sha256: cc97288c36cef01953ac085ac503215e8b92af2f60a076c83a7a20eeba22495e
    entry_key: a0298d6e18487eb3d0825120a0b3e90380f01a8c99da41054d7e1067e47731df
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/d4d646e44f55-collector-1.json
    media_type: application/json
    source_sha256: b5b24b72dc6212f7afedf9665069c67ed9b720c9d08443f5da5981cab3059f30
    snapshot_sha256: b5b24b72dc6212f7afedf9665069c67ed9b720c9d08443f5da5981cab3059f30
    entry_key: a14475e3940dfd88d651ec9f1c5e3b8963c3ead6eefcba84c23776e012fc40b1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/aea1cd34d0ea-answer-2.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: a1827a52d4f6fe10fc9b0eb4f7a05de7b4a1dae20f9ebfe41732441e67e3aaa6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/300af70b0718-answer-2.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: a46e2a7026945a93b64486a7ed75f6c67cdaa2f4b79b644024e01ec7b562c0f4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/3d7f260306d6-extraction-1.json
    media_type: application/json
    source_sha256: 3e5c74da8c5e2096089caf2b28338eda1e77b117fbd4ba6154fdfe65d66e8804
    snapshot_sha256: 3e5c74da8c5e2096089caf2b28338eda1e77b117fbd4ba6154fdfe65d66e8804
    entry_key: a4b7746229f4427afd59089900466788027577011c976db6f3c1790830e344c0
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/7492db0fe0bb-collector-1.json
    media_type: application/json
    source_sha256: 90ab0eb54f385c6ef9d4f0a5db53a554adaaf13e674a94d3a022ec35ac6446cb
    snapshot_sha256: 90ab0eb54f385c6ef9d4f0a5db53a554adaaf13e674a94d3a022ec35ac6446cb
    entry_key: a7a8eacfa4d65e58262724a29df57ed827f1a2ec746f28ce76f938ce22671044
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/aeefefda374c-extraction-1.json
    media_type: application/json
    source_sha256: 78316cf56b5e35836303be68d3a1d1f07a53749781b7a7f50eeb953a5e5f9b4a
    snapshot_sha256: 78316cf56b5e35836303be68d3a1d1f07a53749781b7a7f50eeb953a5e5f9b4a
    entry_key: a81f00f297d474e3f727523de94e9f4d420dd96ca025c25be1d8c4fa5fe9743f
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-1faed4b1-952f-4beb-96bf-d80176648014.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-1faed4b1-952f-4beb-96bf-d80176648014.json
    media_type: application/json
    source_sha256: e6a73dde1d30cee36f4621fcb065bb153bf281e6b6af63de62d256a0e5d91662
    snapshot_sha256: e6a73dde1d30cee36f4621fcb065bb153bf281e6b6af63de62d256a0e5d91662
    entry_key: a88688ab66d96815590c4a57f416a52c55a3599a0c633d1920283fb4256931a7
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/45c01d1497f7-collector-2.json
    media_type: application/json
    source_sha256: 764cb457266b991d70cbcedf50b5b7f24b1340c2b791ac5138e779705485e0c0
    snapshot_sha256: 764cb457266b991d70cbcedf50b5b7f24b1340c2b791ac5138e779705485e0c0
    entry_key: a9a8ee8b23cae8e1a5e2d8ecac935c420a0bc271c2641e1e8f165b030256e827
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/15423ba6a4e4-collector-1.json
    media_type: application/json
    source_sha256: 16afbe03241a3532a5f6d4543c76753576db804b9bec25646250c034a1288d67
    snapshot_sha256: 16afbe03241a3532a5f6d4543c76753576db804b9bec25646250c034a1288d67
    entry_key: a9e3140a4b2a3c056d01b697b5eae2df46ec00c3e662fb6eaf4c934ff979453f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9033416b956a-collector-2.json
    media_type: application/json
    source_sha256: 3968bea66fea87391994dee446cea333e0e96e1c82adba6c053651e10cf2cfa0
    snapshot_sha256: 3968bea66fea87391994dee446cea333e0e96e1c82adba6c053651e10cf2cfa0
    entry_key: aa69131361209bdb6e85255487e91a056d90d48e05f099bf73a6c15f790563e2
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C2-AFTER-Q1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/C2-AFTER-Q1.json
    media_type: application/json
    source_sha256: ed27037ce2a31039958d87e00286f2b687aeb87762dc1140e3aab4b70195c4e3
    snapshot_sha256: ed27037ce2a31039958d87e00286f2b687aeb87762dc1140e3aab4b70195c4e3
    entry_key: ad7858296f8ca68a368ff3987dfb0f82c8e2b0e18cbb58604ad6653865fbb075
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9b979090609c-extraction-1.json
    media_type: application/json
    source_sha256: c11a208fe5d1285d14d58204e01e3d1fffdd3e68ec354089628525b63d664ee0
    snapshot_sha256: c11a208fe5d1285d14d58204e01e3d1fffdd3e68ec354089628525b63d664ee0
    entry_key: adb965c15347f1c20230a9527a0e6a4344359fcd3d4686cd998c3295613e727c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/fada09b372fc-answer-2.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: ae766fba3f02f118ec6f1c512d9ad932fbcea363f0e84205dceb2846982ba801
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-cf804d84-d473-4a38-aac8-e00d31a500ad.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-cf804d84-d473-4a38-aac8-e00d31a500ad.json
    media_type: application/json
    source_sha256: 1acc9295297b5d5593f1a28ce2a8f5b0c59906cb2fc560b454b504610dedf2fb
    snapshot_sha256: 1acc9295297b5d5593f1a28ce2a8f5b0c59906cb2fc560b454b504610dedf2fb
    entry_key: aecdb34df66490f8e12136bc33812b8b25bbee71be6a1dee91311a6e3817cf1f
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-3ca607a4-fe30-45ba-909c-4912646bbb13.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-3ca607a4-fe30-45ba-909c-4912646bbb13.json
    media_type: application/json
    source_sha256: ea54f5a8e2b292be1be94d4b897dd037f1ddeac6b260cc14ea9ca1e93d50beb9
    snapshot_sha256: ea54f5a8e2b292be1be94d4b897dd037f1ddeac6b260cc14ea9ca1e93d50beb9
    entry_key: affb49e139b0cb7f95a6e8226cba3024630814a6c7423b1c6491fdab63580eaa
  - role: other_contract
    source_path: cycles/preparation/matrix-C2-BASE.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/matrix-C2-BASE.json
    media_type: application/json
    source_sha256: e677d8108ab14c7090f9bc3fdb6ec39cb57acb1cea4d28c2e4cbad250dbe8af2
    snapshot_sha256: e677d8108ab14c7090f9bc3fdb6ec39cb57acb1cea4d28c2e4cbad250dbe8af2
    entry_key: b02d8d6bfd35d3707c19d5c6bb34700da18eb28ff657a596a0dc2cb28b309804
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/dd067ef841a1-collector-1.json
    media_type: application/json
    source_sha256: 80527bf067ebfe0b42a8d6b5fd3de0bcc72aa42c9ffd510fc0f5c1479437de4d
    snapshot_sha256: 80527bf067ebfe0b42a8d6b5fd3de0bcc72aa42c9ffd510fc0f5c1479437de4d
    entry_key: b1b42231b941d4b87df43f5e28b85bef99b8ae0ae14d5300c664544eb4491e6b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/e6e7d3d061ad-answer-2.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: b2ac2992d0be51f8e283a95ebb5f08f572704b729365d99ec1f5010b06e1db4a
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-69ccd64b-6cef-412d-bc1c-1a4314316d9f.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-69ccd64b-6cef-412d-bc1c-1a4314316d9f.json
    media_type: application/json
    source_sha256: e709a3c41f1f31ac1afc17fbd7461a937127d2be1417aa8f28677e6906c582f1
    snapshot_sha256: e709a3c41f1f31ac1afc17fbd7461a937127d2be1417aa8f28677e6906c582f1
    entry_key: b3377eac99f6931f6d5a537ebf3af65c2996bacf879453f7feaa3da810363adf
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/aab2b1cf2a7c-extraction-1.json
    media_type: application/json
    source_sha256: f16616626f1c2df75491463ec1fcd3ed7022d0d07fbae78e9275b9fbca4715fd
    snapshot_sha256: f16616626f1c2df75491463ec1fcd3ed7022d0d07fbae78e9275b9fbca4715fd
    entry_key: b51cea9cd35642fd6d14281835baa704462ba25ec2536ad789264aae518f1a08
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-878820f0-1a42-47b4-872e-035a7bbf42ab.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-878820f0-1a42-47b4-872e-035a7bbf42ab.json
    media_type: application/json
    source_sha256: 906253df4bce47b7b3d2a3db29375a3b32e6a40e13128a54209c99c29dfb0d30
    snapshot_sha256: 906253df4bce47b7b3d2a3db29375a3b32e6a40e13128a54209c99c29dfb0d30
    entry_key: b66b56c5054ef34004e1c8c7696fa08c041aee715a3e088ff1ae2537b7310fb0
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2de5f229-db13-49d0-8dc4-edcdd05bac52.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-2de5f229-db13-49d0-8dc4-edcdd05bac52.json
    media_type: application/json
    source_sha256: 7a42d6743c6bca065ec173a9caf41379d1cfffc6ef25a71108affa2ec35f0238
    snapshot_sha256: 7a42d6743c6bca065ec173a9caf41379d1cfffc6ef25a71108affa2ec35f0238
    entry_key: b7746853b9f9bc4dac784c77b53984df6cb09afd27acd73e868e4193b68a94e2
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/5e5a20d5486f-answer-1.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: ba1f76f3e06b123bada6a8e83ff9709fe4005e48eacfb60e4ac085bcbe9cdd21
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/3e6416dafa4b-answer-2.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: ba3215569f37ae17d42944adfee7adae4371b58e0ee3222cb6f35a1fcdcaa341
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-6df9e690-c917-4558-8f3e-6f444713aaa5.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-6df9e690-c917-4558-8f3e-6f444713aaa5.json
    media_type: application/json
    source_sha256: eaf047457400c7be223384db446afaf79ef628a30ef66f8ca587db9c5665d6a7
    snapshot_sha256: eaf047457400c7be223384db446afaf79ef628a30ef66f8ca587db9c5665d6a7
    entry_key: bba6114101364fb83360bc332f1f68a72003908ffc46274d8ea4601616c5abf0
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-17a494a8-85fb-4bd3-b9fa-445b89030a94.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-17a494a8-85fb-4bd3-b9fa-445b89030a94.json
    media_type: application/json
    source_sha256: 655d4e24f141337da7b536a3a0713c2d92f6bb3522a185ed3f5a632d9ece9cfc
    snapshot_sha256: 655d4e24f141337da7b536a3a0713c2d92f6bb3522a185ed3f5a632d9ece9cfc
    entry_key: bbcd24533af5190ff8b11af504d29e88107de4648204f5f78cefc7224e61b3ff
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/73f74336b0ec-collector-1.json
    media_type: application/json
    source_sha256: 9d158181a2b26e581efe11272e7d1b6e227682e92ab9aa75b24cbdfd3468ada1
    snapshot_sha256: 9d158181a2b26e581efe11272e7d1b6e227682e92ab9aa75b24cbdfd3468ada1
    entry_key: bc9df714caf2b4e2c4af3d212fcdaf0df569fc34bbe3efb794bef8fd6734ddea
  - role: signal_rule
    source_path: execution/contracts/signal-rule.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/signal-rule.json
    media_type: application/json
    source_sha256: b3b82536873a227ca6bdb3764f1f8711df6b50fd000fe78308e36173d56e19a0
    snapshot_sha256: b3b82536873a227ca6bdb3764f1f8711df6b50fd000fe78308e36173d56e19a0
    entry_key: bd071578ddb8bc2610a0face99ce956bbf899966ba0997b128d0458ddf58bf1c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-b245c06a-51d0-49cc-b889-3118551fef4e.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-b245c06a-51d0-49cc-b889-3118551fef4e.json
    media_type: application/json
    source_sha256: b185bdf6816811e763e2df0314ac21aa533fb85f05810343452d4e97c5ebb6e4
    snapshot_sha256: b185bdf6816811e763e2df0314ac21aa533fb85f05810343452d4e97c5ebb6e4
    entry_key: bdb5a69bfd8a15373efdcb9ea8c41dca72a1134fecf5b266da9fbb157e341f84
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-de5f98d1-3afa-4c8c-a2f3-52b83c498c7b.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-de5f98d1-3afa-4c8c-a2f3-52b83c498c7b.json
    media_type: application/json
    source_sha256: c8506e018c3fcc8d47bf9ea587b058f24d30cdd9c87c3a3e391f62d9c8bd349b
    snapshot_sha256: c8506e018c3fcc8d47bf9ea587b058f24d30cdd9c87c3a3e391f62d9c8bd349b
    entry_key: bdfb7d0f96b56c7efa00c815ae2f18a0c339569f9b384563111e935d478ec02c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/95ec811e6e16-extraction-2.json
    media_type: application/json
    source_sha256: b1733c94358661735eef9919b1c38a98125fb36f686a7b6ee9d957c70959390f
    snapshot_sha256: b1733c94358661735eef9919b1c38a98125fb36f686a7b6ee9d957c70959390f
    entry_key: bf80fd4a7d34268dd2b8f087c0d1af8c51e03f57af6d10c5041db7f9d1d991b5
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-44130a93-3a77-4641-b719-7e2eea7a9ebd.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-44130a93-3a77-4641-b719-7e2eea7a9ebd.json
    media_type: application/json
    source_sha256: a58068a71c55bd831b8fdb2673abccf6df7ee318c1074392f4a361d501beab57
    snapshot_sha256: a58068a71c55bd831b8fdb2673abccf6df7ee318c1074392f4a361d501beab57
    entry_key: c042f1ad385203f11220cdac590d9dc147f981754258676e501e5f98af818381
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/8b29ff71d879-collector-1.json
    media_type: application/json
    source_sha256: 80cd4bcb7c5626dbb739a5a25fccb1c48c2532113dcb66b97f8cdadbb3849e5c
    snapshot_sha256: 80cd4bcb7c5626dbb739a5a25fccb1c48c2532113dcb66b97f8cdadbb3849e5c
    entry_key: c1065686492ff06ae4460e1d2c09008e4c2d58cf089b2341b388f3ef972b7d8d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/ec125e862bad-answer-2.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: c227667e9345222eea89b8dca43373926bbd6a2f2d441ba9c1e3bcc41b808b42
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/40985ebc75b4-extraction-2.json
    media_type: application/json
    source_sha256: 5392a59194b3d10abd5ba86e96518df5247c09468551fa9a3bed3f45fd27445b
    snapshot_sha256: 5392a59194b3d10abd5ba86e96518df5247c09468551fa9a3bed3f45fd27445b
    entry_key: c2616f1d47816f4fa32cca48ecf6b9e3904cd159e600f2ebc0a1872d117e1eae
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/3018cd8063cf-answer-2.txt
    media_type: text/plain
    source_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    snapshot_sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    entry_key: c350a3d3e19db422af2cc887225f1e3fe3819246102b841a60e015eff9950484
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/57ccdcd1fb5f-collector-1.json
    media_type: application/json
    source_sha256: 08d359584301ef496f29ee44c34216300700ae9a777f4b88206265ec50dfd58b
    snapshot_sha256: 08d359584301ef496f29ee44c34216300700ae9a777f4b88206265ec50dfd58b
    entry_key: c3f692346549f592483853043e823cd8cf14ad621adfaf5d64b856905f5dd206
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-ce1fb185-e451-4979-b00d-689df1920538.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-ce1fb185-e451-4979-b00d-689df1920538.json
    media_type: application/json
    source_sha256: 8455a2205d24df4f7a31fa194f182193a825f835f0c32d3efe802f7fd60e2e64
    snapshot_sha256: 8455a2205d24df4f7a31fa194f182193a825f835f0c32d3efe802f7fd60e2e64
    entry_key: c47904d7d5194ee09f1b523490c0917dd1297af999c717633c801bac0f683d52
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-40ddeca2-c0cc-4763-8320-dd6ed94fa8ae.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-40ddeca2-c0cc-4763-8320-dd6ed94fa8ae.json
    media_type: application/json
    source_sha256: c758c8a340aceb9bb75c20d0b15bc8af3df2f89c5fdc59bbf8a7e64e6fbd2db8
    snapshot_sha256: c758c8a340aceb9bb75c20d0b15bc8af3df2f89c5fdc59bbf8a7e64e6fbd2db8
    entry_key: c589ce59329d25b27fb834955512f4e1a88a8b48e5c5a7cdbf17c5db2d36c2bc
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/896516383e2c-extraction-1.json
    media_type: application/json
    source_sha256: b7ffda279ac57ca1492cebbfb1d0953a4ed7b87d63b30d968ab88c609ae60ef5
    snapshot_sha256: b7ffda279ac57ca1492cebbfb1d0953a4ed7b87d63b30d968ab88c609ae60ef5
    entry_key: c5b0d69acbec984136b61066db1838693fcb8753a071a7af187a9514b681b845
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/784873c295f8-collector-1.json
    media_type: application/json
    source_sha256: 4ac0e7ca1e2cda90004dea64441e43044115de0129575b3d697124d38180a28d
    snapshot_sha256: 4ac0e7ca1e2cda90004dea64441e43044115de0129575b3d697124d38180a28d
    entry_key: c61355e3b813058fa8d6081771061b77599d43658657c8e263d9793e9191821b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9440eea7bcfc-answer-2.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: c70609b7ef89d6a3478b1a606701c5a0ce47e10047820c4c9beefaedf9a8c24d
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-8172f1b6-9f32-47b3-b4af-1581e0fb3de9.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-8172f1b6-9f32-47b3-b4af-1581e0fb3de9.json
    media_type: application/json
    source_sha256: 91973396b6aba56ce18bde013dcc3c037008c759756127ec0cb4f71d552a3882
    snapshot_sha256: 91973396b6aba56ce18bde013dcc3c037008c759756127ec0cb4f71d552a3882
    entry_key: c7eafacd7624079fe4be4cedcceb8864b6f7c282170cc753d9eee4e9b6d1fabc
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-cd0d008e-80ba-48b5-9324-8db060579ae4.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-cd0d008e-80ba-48b5-9324-8db060579ae4.json
    media_type: application/json
    source_sha256: f9529962964443b9a7f016a2a6ac329454b0ef53d9add744bb5be1e7e514719d
    snapshot_sha256: f9529962964443b9a7f016a2a6ac329454b0ef53d9add744bb5be1e7e514719d
    entry_key: c7f718ac3b3229b0b75c6850b55f1e2126c4cbeb4dda0ecdcc512951ee5bc22a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/c17e9e1a7438-extraction-1.json
    media_type: application/json
    source_sha256: bd69d9e089f1d73aaa87e62c7d6b2c1d32042dc578cf209a66df181e32f05aad
    snapshot_sha256: bd69d9e089f1d73aaa87e62c7d6b2c1d32042dc578cf209a66df181e32f05aad
    entry_key: c837b163c3dc9279051f818abf93cbf6f49a9e06031f94c8f07d917e5a8a7341
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/3835bf94e41e-collector-2.json
    media_type: application/json
    source_sha256: 3f72ff9809d63a95b0e82cbc58a5dd19aa971df6fd38584ba6b8dbbb6185fd83
    snapshot_sha256: 3f72ff9809d63a95b0e82cbc58a5dd19aa971df6fd38584ba6b8dbbb6185fd83
    entry_key: c8f62cb8e5e6eb645d8553a3d819681c3425d0c590d586a55aafd1ff872ced2f
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-bb706ddd-3121-4760-b1b1-2b121efae488.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-bb706ddd-3121-4760-b1b1-2b121efae488.json
    media_type: application/json
    source_sha256: edb2a6f965c0963098311d00b6033b9eb0f7921c5041b391c5f35a7492ce9898
    snapshot_sha256: edb2a6f965c0963098311d00b6033b9eb0f7921c5041b391c5f35a7492ce9898
    entry_key: ca361abd902d5560cec569424080333a291a8a5476eb6dade7b06ead7943decb
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-9149a1ca-b966-43a4-b2ce-30233ff555f0.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-9149a1ca-b966-43a4-b2ce-30233ff555f0.json
    media_type: application/json
    source_sha256: fc32fba4ea82f4dc8634a04691a14a64a902364cdc8321f4969c93b6d94f1b1f
    snapshot_sha256: fc32fba4ea82f4dc8634a04691a14a64a902364cdc8321f4969c93b6d94f1b1f
    entry_key: cbb737843e940bb7eedf8413ef31c598783812074ca070654724458d49c7e45e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a01d07a1b531-extraction-1.json
    media_type: application/json
    source_sha256: 1b34011031527e3b74089317225d8ec4525294645b775ab28730b96d58b91ae6
    snapshot_sha256: 1b34011031527e3b74089317225d8ec4525294645b775ab28730b96d58b91ae6
    entry_key: cc0eb78bf6e3a572e381c79c50baa039361a3295bd1fcd3ba74793bca61610a8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/f5dcbb235022-extraction-2.json
    media_type: application/json
    source_sha256: f291285f4c0c76698fb5d14fcd84542690f41a8e64b43e397c38b044a65d3560
    snapshot_sha256: f291285f4c0c76698fb5d14fcd84542690f41a8e64b43e397c38b044a65d3560
    entry_key: cdd577c319e1f545b770563c3b30f2e7787ef44ed9de9878eedd4a0f4cd5dfd7
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/cbb28e3fbe25-collector-2.json
    media_type: application/json
    source_sha256: 3711806509142731e7fe68b3d0237053ede683518e88689b7d4a9d851e170ef2
    snapshot_sha256: 3711806509142731e7fe68b3d0237053ede683518e88689b7d4a9d851e170ef2
    entry_key: cfb44da79c8d87414eafb49ca828c0d4feac82c1ac4cc333657a6529324b237e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/4ae8e95099e8-collector-2.json
    media_type: application/json
    source_sha256: 647e2e9223573a085e766011ba6cf9ab6008ea59e2c625629c447417fa16232b
    snapshot_sha256: 647e2e9223573a085e766011ba6cf9ab6008ea59e2c625629c447417fa16232b
    entry_key: d1404b8f3dc159ed4b24aacbaa4cd80f88784e2cb7a03dabea72815785696a22
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/be84806ab6a9-collector-2.json
    media_type: application/json
    source_sha256: ca958bea045c2ef61f09998e132989886a48d237e92a6026ccb2e2fe2b5427f7
    snapshot_sha256: ca958bea045c2ef61f09998e132989886a48d237e92a6026ccb2e2fe2b5427f7
    entry_key: d289d39a2783544cb0c35f6bf15f9d5b49127f14577e88135693ccbb4646dc7f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/fbfe6c56ecad-extraction-1.json
    media_type: application/json
    source_sha256: 978be641fcf6810ab699ec1b2ded5233cdd7c0f6347d646bde6138ed5b1d1006
    snapshot_sha256: 978be641fcf6810ab699ec1b2ded5233cdd7c0f6347d646bde6138ed5b1d1006
    entry_key: d296983aa35d4ad4ca08db0a2948d1efd6576668097e3dff4e426de8d0bc15c3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/2c4dcc4680bf-answer-1.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: d3fff149f3e34a35e807fd7ffb4eaae6532855b404baadd819be118e81a9cbfc
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/233e28b90199-extraction-1.json
    media_type: application/json
    source_sha256: daceb5b03b8d1d3245c5bfef440e008788a27a1e68f996b394ee550223bff480
    snapshot_sha256: daceb5b03b8d1d3245c5bfef440e008788a27a1e68f996b394ee550223bff480
    entry_key: d43d5eaa4e22957f4c00219cea92d6ca6231787da1947c71275b7334c21de420
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2654011f-c56b-4d0e-9b10-65b1f1867879.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-2654011f-c56b-4d0e-9b10-65b1f1867879.json
    media_type: application/json
    source_sha256: 2a9d4d852180423d26f02eb159f7cb29cd192f6fda395dffa2cca932cef660a7
    snapshot_sha256: 2a9d4d852180423d26f02eb159f7cb29cd192f6fda395dffa2cca932cef660a7
    entry_key: d4db51c10d79fecbc7e44af6ce6836f6645706f4264cd22ffaba4f51b30a4180
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-9a534203-7e13-493b-b433-4891908cf1d6.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-9a534203-7e13-493b-b433-4891908cf1d6.json
    media_type: application/json
    source_sha256: 56f10ea3949b5f004f66db022b607c5da65e4b9987d0f1079103df3c43c538f6
    snapshot_sha256: 56f10ea3949b5f004f66db022b607c5da65e4b9987d0f1079103df3c43c538f6
    entry_key: d4f819d1641e15141deab6b53396cbced39a5eb26e723c1e1655ac8bf847614f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a507506acbe8-answer-2.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: d66e80889305e0be28073cab196efdfaeb12bb6c5cefc67a168fdb50f99c02b1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/6ee14e80dff1-extraction-2.json
    media_type: application/json
    source_sha256: bcfa3f84a2cc6326e0bdf829c5e7a212d190b106cc7cd891fa36f1278b8e3700
    snapshot_sha256: bcfa3f84a2cc6326e0bdf829c5e7a212d190b106cc7cd891fa36f1278b8e3700
    entry_key: d7e56d913b8f14db955e53d638a86fa5b3c5033cacfa7c3f4a2fcd50eabff9d1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/03ff69371d98-extraction-2.json
    media_type: application/json
    source_sha256: 91c9872b703d65ed07c1c479a9ca8c24451651a36c73ecce6305101096aa288c
    snapshot_sha256: 91c9872b703d65ed07c1c479a9ca8c24451651a36c73ecce6305101096aa288c
    entry_key: d83151f9692950e50ff86cbf646602d3594dc4f3978025e6126266c295b0c576
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/35bac349cd06-extraction-1.json
    media_type: application/json
    source_sha256: fd2e444b7cf400ebfdc02d459d62e3413019bb1d7bc08fa521b34ef1f01b510c
    snapshot_sha256: fd2e444b7cf400ebfdc02d459d62e3413019bb1d7bc08fa521b34ef1f01b510c
    entry_key: d902962b7abd15c8d1d507774df92a715ef2560016cd983a1456eec46111dbe1
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-11c7c559-c35c-49d1-b8ee-86372675ee39.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-11c7c559-c35c-49d1-b8ee-86372675ee39.json
    media_type: application/json
    source_sha256: fd281b6498a4987b3096c5b627f50b62dfd844ff8547e9ecde2497cdbbcac10b
    snapshot_sha256: fd281b6498a4987b3096c5b627f50b62dfd844ff8547e9ecde2497cdbbcac10b
    entry_key: d950a5d8873acd05d1416da0630804ebdbeb1a68458f4a3df8f12617be135ffa
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a8b0f9fec954-answer-1.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: d95721d6e2ab9fdea6294a8ad956f2441fa0664b9319a7303f37d2ef4f326b22
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/0367df1c5708-collector-2.json
    media_type: application/json
    source_sha256: 04f6a4ec050aa9576f5ef117b1a4d3bf3ff868797389728019e02e601e6ef2f1
    snapshot_sha256: 04f6a4ec050aa9576f5ef117b1a4d3bf3ff868797389728019e02e601e6ef2f1
    entry_key: d9b5e36e6839dcfdd7262b6c1dd33c0243c1824368c3ab9fc77267614313e471
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/191ab7e4b1c0-extraction-1.json
    media_type: application/json
    source_sha256: 2c54d7f7acdf20574cf7dba049c6997442ed46323273b0f3b29e0ed1e9599909
    snapshot_sha256: 2c54d7f7acdf20574cf7dba049c6997442ed46323273b0f3b29e0ed1e9599909
    entry_key: dc8e84d5f28bd3360b40068d507306a250b805aef970d60feed8be5c6c57d17b
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-374e5fa9-8c08-4a7d-87d7-8b4ad14ca306.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-374e5fa9-8c08-4a7d-87d7-8b4ad14ca306.json
    media_type: application/json
    source_sha256: c60778ca9360dc789f7e4a485a1cf5e1f38b60761d06db034de011792c69535a
    snapshot_sha256: c60778ca9360dc789f7e4a485a1cf5e1f38b60761d06db034de011792c69535a
    entry_key: dcb3efc79477e4af846ca8280e601eca1c0dd90b5e649c4a224f5f1d01c50cd1
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-665e1047-8cb5-4fde-b3a9-1ca3072aea82.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-665e1047-8cb5-4fde-b3a9-1ca3072aea82.json
    media_type: application/json
    source_sha256: d722ab176127c1389cfb9bc3705e87368625dd4d77712619694ea6d3c6a1caa3
    snapshot_sha256: d722ab176127c1389cfb9bc3705e87368625dd4d77712619694ea6d3c6a1caa3
    entry_key: dcc0919f3a645c755c7992ba2d9482569a501af2e89ae6da8a808bec78a1cf6a
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-b681c3c3-f27e-475f-8491-c8a9fc7d20c9.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-b681c3c3-f27e-475f-8491-c8a9fc7d20c9.json
    media_type: application/json
    source_sha256: a6a66a0bd2ffffd6ab8760768f8c88489b084ab2cd7bea8e26cc0df6641ebb46
    snapshot_sha256: a6a66a0bd2ffffd6ab8760768f8c88489b084ab2cd7bea8e26cc0df6641ebb46
    entry_key: ddd40c617678446edfb49dfc4c51d6727e63027d9769b737108fcb17bc6fd1f6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/39f285733bdc-extraction-2.json
    media_type: application/json
    source_sha256: 655bc44ee1287d26c55bde3ea201850c317f84177d5f5398e0c549b93e015450
    snapshot_sha256: 655bc44ee1287d26c55bde3ea201850c317f84177d5f5398e0c549b93e015450
    entry_key: de5e2d819610e3a69826315ce1c412b8a6f3d32abf82c5003f96cdbe78b74cb1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/b98822e3f11f-extraction-2.json
    media_type: application/json
    source_sha256: 5280f56e5c66c058189cc9e2b7ac5e8208fc939b3c10dc9c1480a7f44af1be20
    snapshot_sha256: 5280f56e5c66c058189cc9e2b7ac5e8208fc939b3c10dc9c1480a7f44af1be20
    entry_key: dec6402c624f679bdee672535e9d6e6fe9a58512828d6aaf4ead7f862db30ba8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/17a3b85fde6c-answer-2.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: df944ce9929f3068962f30d48bf7824a0833acc72ea83d7d1dfffb38de4a0c32
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/250084622937-collector-1.json
    media_type: application/json
    source_sha256: 026ed0494c51342bb632a9527015bad8514f1b814b601e1724e4e99dbb4f976f
    snapshot_sha256: 026ed0494c51342bb632a9527015bad8514f1b814b601e1724e4e99dbb4f976f
    entry_key: dfbdec60c20caff945102874c33ec2306d5149d68b8940f5fcafaac15c054011
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/7bafd0331105-answer-2.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: e04a8f0c9a0ba55c95b1b605a5da971ae754b32b3d87e2a37b71356c3f248a47
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/da17535aa39c-collector-1.json
    media_type: application/json
    source_sha256: cf48ee724b8c56b3d6153fac3a05a08c5486a63a389d301b7ca4cef73fe66bde
    snapshot_sha256: cf48ee724b8c56b3d6153fac3a05a08c5486a63a389d301b7ca4cef73fe66bde
    entry_key: e1d2e0cf8515724ef8e4056e84235e5fe3b16c7f834b7015aa4e22b95ba4dc34
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-82eb2bce-b6ac-4c1e-ac30-0e9f550bf925.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-82eb2bce-b6ac-4c1e-ac30-0e9f550bf925.json
    media_type: application/json
    source_sha256: c1d9a9ece6857f71e9ab7558a9a8404adb6a03d03f600a9748be0daf84145ab2
    snapshot_sha256: c1d9a9ece6857f71e9ab7558a9a8404adb6a03d03f600a9748be0daf84145ab2
    entry_key: e237a6b88e9a654812eb79a180d8566ad723c6487681428434a408cc51d6c509
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/36a921ede794-extraction-1.json
    media_type: application/json
    source_sha256: de4d9f45fff8e035cb783e9faf4e533081f793021f9d37ff0cd3e752591b683d
    snapshot_sha256: de4d9f45fff8e035cb783e9faf4e533081f793021f9d37ff0cd3e752591b683d
    entry_key: e3154a86878d19e07ab85b883b085708ed185cd045244cb29eb0472d701712d6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/416f2f797c5a-answer-1.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: e35e6e5d5b59e13bde2c6d952b0c287002cb2dfb3a9b28d8b58cc149b448c02c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-da68c328-c4de-46b4-9f4f-8a7dc32b1017.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-da68c328-c4de-46b4-9f4f-8a7dc32b1017.json
    media_type: application/json
    source_sha256: 484603ff9baf6df6107936c5ad3473ba0393b5375b5573cc700bb6081e6c1470
    snapshot_sha256: 484603ff9baf6df6107936c5ad3473ba0393b5375b5573cc700bb6081e6c1470
    entry_key: e441a97801387d1be821f6a66a3343345e013156ef6e016f099a34d68e46c18e
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-df3c09d9-4ceb-440a-b1fc-76c919c7a6d9.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-df3c09d9-4ceb-440a-b1fc-76c919c7a6d9.json
    media_type: application/json
    source_sha256: 2a696643ba19c4048feb0bfc1256ba62e4c074a0245d3ce78f2dc4d734e2d2da
    snapshot_sha256: 2a696643ba19c4048feb0bfc1256ba62e4c074a0245d3ce78f2dc4d734e2d2da
    entry_key: e499383bb5b2884dee9500240fc8ce61bb380cfebf50dabf3d576cecf2016bc4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/50dbf758bd2e-answer-1.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: e5409dec4d0c3ec2d9716c6935589c6abdfa768dc990f17742e544030c9429e6
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C2-AFTER-Q3.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/C2-AFTER-Q3.json
    media_type: application/json
    source_sha256: 2690bd5a07e9beb4308a10a13fb7c257a145f893fac6c656daaf705e0951720f
    snapshot_sha256: 2690bd5a07e9beb4308a10a13fb7c257a145f893fac6c656daaf705e0951720f
    entry_key: e6da58fad12ca476dba3ec76e7ad62d55d47949b21dafa1b4551c3c381dadb20
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2500a40b-e9b8-4de7-9e25-6db51fb2d7e8.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-2500a40b-e9b8-4de7-9e25-6db51fb2d7e8.json
    media_type: application/json
    source_sha256: afb4e0d0989cb95b01a532966667988f889d915078ab989aaaa13c35dbcd75b7
    snapshot_sha256: afb4e0d0989cb95b01a532966667988f889d915078ab989aaaa13c35dbcd75b7
    entry_key: e99a27fa4370bff631b0743e1357447dba3a90f5ab87d3a0d9d28cf0f38a8733
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-a7e0fa34-f615-4209-a100-b9b266d4d081.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-a7e0fa34-f615-4209-a100-b9b266d4d081.json
    media_type: application/json
    source_sha256: 415c14c81b57728a03f80a45fa15aa1d03f72e87c21ef8034bfa3d377838a674
    snapshot_sha256: 415c14c81b57728a03f80a45fa15aa1d03f72e87c21ef8034bfa3d377838a674
    entry_key: ead239058795db4a29878c1bc3f12495c222555a00d13b9cde49bd6c27f9d2fd
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/7ed1a296e40b-answer-1.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: ebb9632b27ad9ab8076523a90a7f929809fb0381d471c2a5b388ae7b9b815f80
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/61966e28bf72-extraction-1.json
    media_type: application/json
    source_sha256: 6258496f726c24f21d438da2c1560cbfcce8707bba53754a3ce871bc34f2bd5e
    snapshot_sha256: 6258496f726c24f21d438da2c1560cbfcce8707bba53754a3ce871bc34f2bd5e
    entry_key: ec7c47d47354cfa4c636d4e174adff003f9992dacb70df9433271ecee9a4ce4d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/25320011ee04-collector-2.json
    media_type: application/json
    source_sha256: a09111f27dc3ecbcbb7fd78a6de963f9a3e08fcb67eaaa56efddb4cc3623f5c4
    snapshot_sha256: a09111f27dc3ecbcbb7fd78a6de963f9a3e08fcb67eaaa56efddb4cc3623f5c4
    entry_key: ecf2b98510d9b3529faa71cab6c42e7528ba544865aca17440d40bea89ee65f3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/e591da43700b-extraction-2.json
    media_type: application/json
    source_sha256: 70ed1340348561d71a6e1a086c00d8d26b6490c7fd72c26d27a67c197a1f367b
    snapshot_sha256: 70ed1340348561d71a6e1a086c00d8d26b6490c7fd72c26d27a67c197a1f367b
    entry_key: ed641baa99944551fe1356abac0747e1f148d62a4f44e4468ea8c52619ec6d00
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/294027d52560-collector-2.json
    media_type: application/json
    source_sha256: cdd3ae14dd25790f5d968bf592000ae16450898297e55395299b764868823c4a
    snapshot_sha256: cdd3ae14dd25790f5d968bf592000ae16450898297e55395299b764868823c4a
    entry_key: ef0b5a72bd68f811be98c750c6e59cee1a26f513c042c5079e6a09353c8eb162
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/9f925a0e5101-answer-2.txt
    media_type: text/plain
    source_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    snapshot_sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    entry_key: ef5c1e1623af5953492b34522e3c55e362c9f984838d109ea00f993a3ba8b615
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/30c75b9a7c84-answer-2.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: f06f22403f2b53ac8c4a9edde7ec2a8cf80c2cb3b2eda99168e62e898322026d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/5538841e8b81-extraction-2.json
    media_type: application/json
    source_sha256: 3420d4b13d4436dede290fc770823a0fe3226c9a0bc2628b749d4f1e7018cbf0
    snapshot_sha256: 3420d4b13d4436dede290fc770823a0fe3226c9a0bc2628b749d4f1e7018cbf0
    entry_key: f31a7b7db3c4e9b9a58dcdfa8d7bd8a5ce2b76118e730d041e197630f8ee1ce8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/da22e383bc9d-answer-2.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: f42729bc749199fe556a14c980e1c8601fc5f6ce4831a3a2a92c1261387f9397
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/77de04d186bd-answer-1.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: f44aaa64b3d5cfa165e8cd9087c73c192a174fff8a4badd8c423e0783a4fe219
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/67bdcbaf91a0-collector-2.json
    media_type: application/json
    source_sha256: 153ca8ecbe75bc3af9d2d5157350f45253efe395e6cdd4dec2d481b8f69631e4
    snapshot_sha256: 153ca8ecbe75bc3af9d2d5157350f45253efe395e6cdd4dec2d481b8f69631e4
    entry_key: f5e548a09a0e94b5f4d0cbf31d78d319c181d60fdc4ae18f3534c48e4f9f3045
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/4fc8c452f66d-extraction-1.json
    media_type: application/json
    source_sha256: fff4903bcfc6e84aef6a169b845b19a276e674e722067a6e74f2c634dfc1d1af
    snapshot_sha256: fff4903bcfc6e84aef6a169b845b19a276e674e722067a6e74f2c634dfc1d1af
    entry_key: f6bfe275f3ddabd468c41e0bfb807ccebb50c8950ad23dc3edd97276082a7cf1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q1-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/d569c9b61850-answer-1.txt
    media_type: text/plain
    source_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    snapshot_sha256: eb0298d7a50f1ecb48d8ae8f4669dc5b9f9596da501bf4e05ea752d75e8c72de
    entry_key: f871c6b09b2a4ebe8bc3c29d050e85ce83ca5af091cb94b028ed02622a772d11
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-cb125e76-bea8-4bd6-b5bd-86fa6fb1a9ff.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-cb125e76-bea8-4bd6-b5bd-86fa6fb1a9ff.json
    media_type: application/json
    source_sha256: a9e62a2f6c9df125160c818be17a509573dcb6d0326de3b274f61aabf3dfee27
    snapshot_sha256: a9e62a2f6c9df125160c818be17a509573dcb6d0326de3b274f61aabf3dfee27
    entry_key: f8c6a8d5fc9133a48efc5e0148bff788c7e30d6589a01297771ba75e798df6b5
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q3-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/a729ae5ad4f4-answer-2.txt
    media_type: text/plain
    source_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    snapshot_sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    entry_key: f8e7a2edc47bd800e6d4841c37c21574f743d4e85f99b2292f02ba414429d329
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-bdb364a2-90d1-4fee-895b-cfc69df84b0c.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-bdb364a2-90d1-4fee-895b-cfc69df84b0c.json
    media_type: application/json
    source_sha256: a2dccd54c20dd46a3ee445c56f859aa89885267b2bd34e0ef3b1b4193c803b16
    snapshot_sha256: a2dccd54c20dd46a3ee445c56f859aa89885267b2bd34e0ef3b1b4193c803b16
    entry_key: f95f408b915e41edd684cdb1e6e0fa2e59a7eae5b97932b3d689c69c7c9651d4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q2-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/b394e15c2775-answer-1.txt
    media_type: text/plain
    source_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    snapshot_sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    entry_key: faa5f4f80f42f3beb717150d34203f0c237ad47115f7bf95a61dcb6fa95814b4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/5ff1db0e798e-extraction-2.json
    media_type: application/json
    source_sha256: bc2246b325b7a1ca3c94ab49647bfefc3320bacc0c44f46cebad8551f0a4180c
    snapshot_sha256: bc2246b325b7a1ca3c94ab49647bfefc3320bacc0c44f46cebad8551f0a4180c
    entry_key: fc7c9ff4eb1b0701244ce058cf5ee463c65cd7838df9c13aa21c7631cc0cd66c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-9b1ed772-5bbc-45db-9d8f-df90da76ea93.json
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/MODEL-9b1ed772-5bbc-45db-9d8f-df90da76ea93.json
    media_type: application/json
    source_sha256: 5f074cb9914692fa50e33364f00b8ffdbcdddd8c8c848ab267b5fe88f4b3353a
    snapshot_sha256: 5f074cb9914692fa50e33364f00b8ffdbcdddd8c8c848ab267b5fe88f4b3353a
    entry_key: fce48053f0140bcf5c00d07501e9edddd82e2053669003af1d61ef0479a9200a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C2-AFTER-Q4-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c2-review/artifacts/f9e51419756a-answer-1.txt
    media_type: text/plain
    source_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    snapshot_sha256: 90e7574f0844499aff68a46555d68efe5851eb9c0c7f9300d3e431385738efdb
    entry_key: fd867d75eabcab59e6fdb3066ab3a32d334cded2ccd95fbe0faeb83f2c2cbf4b
base_freeze_snapshot_version:
  ref: CIS-GEO-E2E-FREEZE-C2
  version: 1.0.0
pre_review_transition_snapshot_versions:
  - ref: CIS-GEO-C2-BASELINE-RECORDED
    version: 1.0.0
  - ref: CIS-GEO-C2-DIAGNOSIS-READY
    version: 1.0.0
  - ref: CIS-GEO-C2-ADOPTION-DECIDED
    version: 1.0.0
  - ref: CIS-GEO-C2-PUBLICATION-CONFIRMED
    version: 1.0.0
  - ref: CIS-GEO-C2-TECHNICAL-RETEST-COMPLETED
    version: 1.0.0
  - ref: CIS-GEO-C2-ANSWER-RETEST-COMPLETED
    version: 1.0.0
  - ref: CIS-GEO-C2-ANALYTICS-RECORDED
    version: 1.0.0
pre_review_entry_keys:
  - 006bac5b7883544bd538634d4aae551f9b9f31343282776fc823e0924c67e164
  - 00c5cedfa93c9fab726b680b0998acecb54914c87ea853c2a9e0a2253270e3ef
  - 00c6755fac6ac464334647139a2ab23b3af6b4536a23ed9cac7e87714ed8d2d5
  - 01a97a95b6adef06eaacb9766492ab80d8a29d58e3f20b50101b741d09548e9b
  - 01e03683793d769bc24064d2da0f11a9ad81697814b39e75e3032bce2a850898
  - 01f68adc43d47f7a81402786d9d9d456d0e343ee585e2e6c5a80cc70a6aadb3f
  - 01f6b70ca3ada530d64188de7baa955a6818b4458906afac98483b87abf5af85
  - 022cab79fb6039d8c27e98dc536332ac646d924c64935358a35b3b2218ab0057
  - 02ad9ca9466bd9eeb1041b33b3f14f51a4df0e07692cdf2d707818f3a8222c29
  - 0413ad7f023b85d6ecce868ccfa778f932df64988e1987a320033c8437e86aa7
  - 044ec131e0aff297d194c477aeb805d6850188cdec0fa881466187eb7b013e2f
  - 0483a3159484178f404406a19cdb35aaa01edbafbb215d1bed2a2084f8b1a271
  - 04a696be774a639fbcae4722fd4bae14d1b0357b5e355dda79423a2a8e1f2e38
  - 04fe872c730572bbdaf027ff8309257966b82b8c78da636723b8bd7ef36b6cac
  - 063c328f45b5c8cac89ed7e651aa3e145be081a417ed10d478e907a5f767a37f
  - 0661f34e80d64188bad23e8dcbf9ecc1ae9e49f54bea24f3a61137d3c2533375
  - 06e7e26da0bb0cd489d08613a13a8ee01b7204965482671862e0c71f5eb7dca4
  - 06f4df2c141cb9f38ea94c73084d0f08d0b3e29cccf2de60f2708ee2415286e0
  - 0774597f03c1e2cbd572ad658e12be76447b867d9bc4a5f840d346cd5a968204
  - 081cd0c1b237d45199fb2945dfe173f17a8013d9d154f3f329bdc6f81429d57c
  - 08547295542351d34e4b50df4a5ac572d55887af42d31583ec502df5d118e71c
  - 086cf044f8f42b97e900ce73d68eb4012f4ab6290ed162a98cb79f2f51ed7f53
  - 08991af7c53387032135783a5b077891bbfe7f295935acd632cc0f64341ff0c2
  - 0984b862ea7b4f4c7ffddb53963b62b87b666fdf571293258b73622a0b1be7cf
  - 0ad7bce5c7a70993a7bae72efaf1b8c5e80d5dd43d92208024a5c2101fe8e07c
  - 0aea730f3410311e6f9bd1df7ce8abb0253ff67531a0458b02e22d2d1a16ebce
  - 0b106e73f05a581c633782ffcedd5dee30f5fdc45fb93dd7a96dd75f4e17c890
  - 0bd82ff4c8df8273b0a95831dd6887119fc0bb3dd2c1f1ed25c7575dccc04971
  - 0bddddff8e6dfb97924cf3132d791781d29e1819937c6724cec9158c779f43a8
  - 0c8f2dc66a71d28551448db4ee742f58c9469773173d3948b89bef11dd2184ba
  - 0da39371044d11c883eefc59857af074a67860b2602ccc7b1110e73b66216817
  - 0dbd75aa401990fd08e46aef4e1e89ced402a5fccd57d9a56669fd6df1e2b121
  - 0de7d3057c46445038dd57180bd1966366c976b13dc73aa2fc7703db80113f23
  - 0e1e095543a40c284670306b92c3285e61dec7e2943b8cffd01e2058b1beea71
  - 0e343eb3df2dc12b570e93d70771212b95aa5fdeefb0e043de5b5dc1ee7e0206
  - 0f4c37365269b714d63e145efe6eec3878894f026e3a8ccce7db6a2390d74925
  - 0f5ced03d6d488e12e262da0383cf3f73aa35d07507079c335abb9417ab14d3d
  - 0f6906901add665eed67be73fbcceba25b1715274b54df039718fbf3988a0078
  - 0fa941816b4d2df836475e77f1335d1afcc8c4699604fa80ecd03b3ffc853d1e
  - 102506df5030b28e1dd3b009d2be42ebb5546ed9357347188010683df1ed31f3
  - 102a9319fbdcad584226a450c20922279003df2c0378c136a9efc87373515092
  - 106a033b035277e7526791599b5549993ec215809688db92d7f52bcd8359ad02
  - 107364c5f29e42494c5d73c491e49c5c98f14920c0c97d06ddcf9e569976406b
  - 11836c8fbc1cfda312911d571b73d29648cf9a4bb4db268a2f64e347f39f4ec4
  - 1218ed8314e0e40789a0e28ba920c2a7eeef15f157ddbf66490ac1d12208fbad
  - 125cdad4d05f5082796929a085ff8cfa536750e31aa62ec8a5f7cf401098ba76
  - 12877171ba3a63cba96987b99d6d4b3b5b10fc0ca7e6827895802a0e4e314ffa
  - 128d2420a70038eda330d364f06750ce869036e6f5be58c2ed36a7085ca544f1
  - 12cc04b1075ebe351cf2dbdb338a9d8fd45734c83ed69e1b45608371b5d233fe
  - 13b80a070a88dcd0f62133d7f5c4e0ff1059ca12b20557081fe69fac8d160474
  - 15039a4138cd8150d250c55334f6370ae69572809e4f8759843ada054903ce20
  - 15b4b6f52ec685d2d5901b4bf86cd29ef93fd5ee9ac71ca53d3a746c7d953e96
  - 15f1609ddf80ef29faad103cd285e5af2222b9e9dece01057db18af5fae584b0
  - 15fcadea8423e99559f75c6430160dc9ccc9f1e51f3f0eb492e4d1f0daea13c9
  - 166b8b285d727b25987fce2d7997daeff8aa7e06c558cbfcff3c8bba1b0deb1e
  - 1770b45ee7cfce52126953a6a12f12448a95a465b9a0bd5030e13dbac788f67b
  - 1781faef726a7173114584da6e14c9563bb7eaa76eeb1a5e29f2720b56df02fd
  - 17d379f7286ee2cdc516e4dd46c125c5c8ddefa5bfacc8a7cd3199842b5f1539
  - 186c28c11eb1700023b2badcb2b6e2c2e9cf646ff7b9b0a3d230ef01d9198d34
  - 1894c334f20f130cc2a01aaddbed5ed84d6be233b584f5693838f26464870d1e
  - 1895e370b203ea8ca950ade27aa976855f8f15602f7364ae4add5616fcbf33cc
  - 1911ce34508ad557fbdb43f9aa1d54715b820954caa2c41730cc33698d03cdc4
  - 19757274dac2876180b1395b6ada25d1649161a0ce915df005aadc74de44af51
  - 19ec86f7d800e6f4c0deb406f3177698ca6ff484fd16a0db3b17db859795b73e
  - 19faf9084d0c53ff0903dcc682998168a2789cebdaf07542f4a2fd6a1834fb22
  - 1a02f7bd4233149ef18ebc4b9967364196ef7ec50aacaf2c45015023be123202
  - 1af352ca3a347533c7c282750bdc182d5d55da4672e75d4b5e1a2537fa40e335
  - 1ca87f0b8154520496b438e642f4bf92ee73e6f29068ca488798737b5688bf67
  - 1cfdd13b5f3fde8e02a7b6bff11eb8a1e8dcac415063dbf84903481eb669f3d2
  - 1e206877f4bd0918b7ec4f8e8fe76f8aebe4a35d81e8f8d48f4aaa0adc9c62f3
  - 1ecce9cf2fafb90861846eb32001dc2542418c8eba9fbb7ce4c1f27f9cbc9e60
  - 1f0f8238f427c798d8fc68f33c7f4e985bac3e315bf09abf6b6856534224b6ee
  - 2030904bdabd732e908b145e9ea97abc1a5af3fb6751728e6a0d88a30e2d8555
  - 20e8b290bea3dfac8b9e1f9f51f5fd3d86948108042916528c664cb77b86a515
  - 2107dab1fc5d18b3510a2120c54ea3945efdb90d041f8672fa94eadb65f1e131
  - 2240a44923db2480544d75dbbac077563bfbb2724cc2095b6914bcf9c7664879
  - 234bd671cef6b2e58d6ef5174745501f77c4c5994477952a60473454d6b2295b
  - 237640ea89ce255db7a4fd2721e8185dbf2b8b8b5827f363a06a41a274e0de68
  - 23aeba4b96f2904c985405f0999af9decab19d50ab7446d2b251dc50a8ce87f1
  - 2400c9ad400367b47fd03ad06ab29309a6c494542189c0f0709e2ebc47f3b2b5
  - 243bf62955c902b3d895c1767397820849c5b1ba377f4d54702e9acedcd897bb
  - 2456e657a1155ddddceb283d1fe3c3c1ed2d01fd13c110e241281d4b327ec036
  - 246a0f201f6798386d252aafb2634be88d655179b9cd03642c4b2ee5a7eda485
  - 249a04b448e75839a99ba3665d2b241e7f31283b850d48d72fdacb58ece0e16b
  - 24dbd6aafd9a972df6500c84dd5da9c04367a38983d65b4b26f432551c5a2604
  - 25a99b43882e7a2879b4571b609da14474a8295c009f406d2e39942c0c745ed0
  - 25c59cea814104eccd4f0ca2819b6c95ccca8cb7300122731b8482d5c42a94c7
  - 25fef970f18b371f3b5b183f9d9c4329b6b5033a647d32e885b95eee6cef9e52
  - 282bee932351ebb7710a6b2ab2f7210f886a28d922ee351dd0d0c853be47377d
  - 28acc12fed0e9df3d6ef84c9873ef422597252276d53783209a34136207eeca1
  - 28b4357120a2ed4a8b29b3c66a5144e79fcd5024c6de2f5ce5daa8ab029d81bc
  - 28c3bb5e761e93c961b87ea792890a489ee2d2823b6bcf098ecea2685cb70ba0
  - 294450c258aaa40b48a1a6d142cf2225091e4864fb3dde04c6f44661eb049912
  - 2955ac1de8da4bd274ab71539d742796d8ee78ad4f8d22ec4f1a7f0a6ea396d7
  - 298f25a93cd04c4d7c5392e7cb3bb07ffb77f9078032ad8a1896bf3612f0bc2b
  - 2acc1876e0eb50c403f5137d36a2863ef70dd06a43dd54105eb30dca840c6456
  - 2b941ff0748ed79604e754bc3b58706d04b769589ef87333d86ffe6f6d943e03
  - 2b945861f322615f3c5f52b52b7a9299b10348e6a98660fba27ee6e0a368946d
  - 2bceddd46007353027174a4b782daae4eb422b27fbd634769c3ef0f67477416a
  - 2c52e85bba883a692b6fe119ee824a2d178f8ff78f2865efd62829017f65bf55
  - 2cab73bffa59a72b501e0b466ebc0edc03fc9fc572e2ea9eaa2f6b2479c43f24
  - 2d3859c66fad095cf2cdbbf903ba2461a78a22e9a09ded77c84b8d6c10022cb0
  - 2d5aa1690c6e8da1a2f365b7ab17874dccc3d4b5ff6dbb7296f24657ccda459c
  - 2d88ccc7a3ef04f10050d738223431f065d3953ee1f2719a2218d894a8a5d5b1
  - 2dcb01098f9f3c1a182a8b804d62c824f8f38eb0c374d627ba6ed9332ac987dd
  - 2dfeffa3a2ba76540749ce2648715a333ec4e46098df63d16ea43d6531b076aa
  - 2f9a9c0955429514e19d4c50dfb9f7547618998ab40ea898f7d203da5b2ae8d2
  - 2fb7c7cea0ccda9716716afb82d70c18e956bed23537e17b7458239830fb6434
  - 3099a804d3af5a6d61c299186e0c8341f755e6b775f111b37f6ce70097fd152d
  - 31cb81867964f826b1959bc66a278e7f6f6696f20a1d405a538e54a735beceea
  - 31cde58ddd34ba46b144b8aa561119241a739706fe62b8d4acf84a630f219e8a
  - 31d44128d77deccf48792faf3c61f8cc3c4209ee6e0b66ad07dac8f35daff558
  - 322f7dc27b16b44734a383aaa7bdf51c37cf20e5e7595fa90a89964d095c0af0
  - 323fb0f9da6c237afd9d7658dbb21a9331427b135a8cff39b4d3c8c0dd050450
  - 326374a142a8797deb2615132581c5c4d04b34828de50510f23165b71c7169ef
  - 326d66989b8b01b7830bd830fd716a10ccee04d223f90727368137253164768c
  - 32eddb8d24341d3cda9eaf3b65aa418fc89543fa3c03425fc40d5f2fd7f00cf9
  - 3520d9cb9f31f2e360a5c013cda4767af7d6d2a4a023e2330ff7f5101c2b6a4f
  - 3529c7ec180b7795baa135f00ed164ee7d329b1bb99cc6fb3c24d0f591f40153
  - 35747674b660d62808f48c4389e5bf7ffb777570a74fbe14e4d96520457bedda
  - 35c681c68a14cd655142b2eac88827f98b6ff6b42b2457e782998421b2c89a66
  - 35d1d2b2b59077bc38bf3c272c310e3ea1109c832ecf40a3f5c7ea9c6909c393
  - 369ac42f4e2c359a67670a746c40f931fa4bb82475aa29320e1539b65421955a
  - 369e96760ba06494f7fcd63378ab10b751a81caeef42193edfc869b6d7e71607
  - 382af4a5a2340164b344a9e626d878951f5d83483ea9545324f45bf5eff1408a
  - 38999d3ac39f052717536dd353da997bb042a12aeb573ddc43accee76e3a0316
  - 3899e621d80a21887876de1e745038a6cc014f43460eb854a291ed1025fc8d35
  - 392053cd9ed012221f5404caa1b61cab852082cdb661eea5d8173574e9dde10e
  - 39548b9b7b295050d3743b99ac785252e1467d566b1beaa556bdb119bac54237
  - 39f992e56ba786a9de6f17688e5ca1b77c240d4d89eb207f76a2f611673cd002
  - 3a07b40bcee6f2e4eedaad1b2ae9a1c9a42456b3725e1c48b008adaca867287b
  - 3a2f313f71b55adf4d5b58a37e1e6d9d5cb7c4faf21d4f167f42d88384b50bf2
  - 3ca7804f23b5ea370ab23e5043fadfdb64b2237f5f4f33fba95e5ea98b075b29
  - 3cafc93158f7c5b9242814f01450c680c1930257600cee6d36d048d7bf81c1f5
  - 3d1beaa0d507efb4906312ab1ebd81fbec24b9e9c37e927765c29c265bf40df6
  - 3d1e26671395265e007d3144c8f1f99b480fe12042bc8dc65c90376aa10ec499
  - 3d8f839d984e90acdf7a76b4a85bea16644e1ee370a0e47dc6cd6463906b7775
  - 3e607c2a938c46072ec8bc34185a0f4cd3b5025dd9457f5d8d2338b2518446cd
  - 3e6a798511021afa7872d24041677b623894d103a2b0628bfd1e231490712685
  - 3f84e1fb242b0491139f9497a4cbc3827091fb01258aa37d110e37d300e8c833
  - 3f9f885a074b862b5c7b0f534fad62b2cf5e30629fa6e5012a3ea5e353a68d69
  - 40591fd2708336b91d8e1653a2849972529def1d0cfa9758f1f1bef948d4a324
  - 41473e221ee03e22e0ade1c92762421979a7aa075440358f792bc74ff3d088ce
  - 41b4ba45f71187ff624aa9b941762a86949a007219d9882f1832f9d896491b06
  - 43405b035d9759b399540dba0ec9a844f5c5cb3d37c4e53b7b6b58e6b6b9153b
  - 4384debbcdf036aa531ef243750f96f996bb2a5ccb8a9e823aebe7501d5047b6
  - 439a74774653aa06cb906e30d9e2a1a57364df5eabf4852628f224f05c9f9d29
  - 4442f74d23bacadad4836971a34bb8643ccf5c6d5dc32e07fae70000f1824b8b
  - 44874210c6d795ad7784e00e4add23636bb2a7984af554e898b798ceb43c2db3
  - 4593a00119ae8192cc27961e8470b8f2aaffce40fa4df6d9a85ee25ee245fdef
  - 462a0e70fa237c515cee56e67bb12fe49f2ef43b7160efb7b14f2a1adfe1d251
  - 470c81da7a92b8f5efe4d576593c5b8cdc31bae3370efef99c3d736c932115c8
  - 472a4f7143962675164ca37bf93d3da3b020cadf2c09827436b3fde33629bff8
  - 4738d7d6a13a5d1b9391d8800637d3914236f3a107075052e7bec3ae70400c40
  - 47f84792fa868db88f8eacc08b61c4d68d8a45093ad2786fe27f541034c857ef
  - 481afb05b1fed3a25477c94cb5667f3ba219d30243aba002e05b4c1a6ebc71f5
  - 483ea8e8ae502d299d0160daeb560bbb8e8cea66c7f0fbe097fc9d6f8a0a0dba
  - 487548b0cfded30771d7ae6c7c107de027fea0aa2c8f5cb525039fa320fa27da
  - 49f5b656c750c6fdc018f25c977a517dbb5fb68d3863349e310c27ccf81beb75
  - 4b0a8eb138c12eabc766a102b8f1edbd3a1abd055db0dae17701ad66cc0d8d60
  - 4b576f4977ee70c8b8daceb4de5c1e7bb88373a4a068f9fec78b12acf774647d
  - 4be6cb8882f8ff8bf541c01979cbf598f899fdb9133a33c9e5cfe5dcfbca5373
  - 4c15ef2d1adadfe6cba336e5d6fce9498999a7296caa01e3a0432d9a5ce04036
  - 4d146e8c3a6b18a5c71933fe1a4483f1fb4b30f60c797973e5379598034a024d
  - 4d8264c249c1d2f9cc4500971e0ccce9657489c244486b618616381460fe1604
  - 4d84d4333165290d194949b67debc1df4dab9045c7990bb9787d139ea557b9e6
  - 4ed34cbdcefb642431bda056b74286cecd18d4a9e841a07ff23d37ebc2c2b331
  - 4f5b33bdffe97426615ed79cb8475b5a22de920214b8e03c2be07c56bc317466
  - 4fbee091fcaafe1b42d31654606139626fda9b15eb70bc356b364874beb190ef
  - 4fdd61a059df5aca243ec85fa99abdc4096ed82f83bcf4af89d1a2a49aeef7b7
  - 4fe0cd899e37e7faab6b9bca0cdae257e34fbe151ee760f2e1f1e13345c7255d
  - 501ee9a6f3cfcc6e82a109a1137639b32bf5370b31fe73861144de257dd672b1
  - 50473f558fbec1b599813ea7e3a83378bc905a3e700fa25b8060c6022cd01b76
  - 5066e8ddc169ea83063fdd1d17ced214178b27051cf72368b925fa6c6b2a9f67
  - 5136ab30591498464d58ad54eedb0089f3ad54d5d371d2fb07ccbecff2561298
  - 513d12f6aebca848a5a93ff3cd41a4cf8a4576a83abc53c30cf1c371b5b381f1
  - 51de5b3cae47ba54330e34429980b014402c363e981d552d569140476a917793
  - 51fc231437635bf7c54011681afdbda93b4ebe342e52e79f6e67ee826c4f5a96
  - 526f9ed8ffc8ee0e0bd5f73ad9c911e0a20dd8d45f499edb6e7104286879a34a
  - 52a889c0207db02ad6b7fa256de394102dd2883d4d7968111f996c510e05d016
  - 53f921c7f325613dfcc2a2938886825d4dcac3fbd04547254105b61f83ca1959
  - 54ccd5dfc957913f8464b8ff3b87d2cd322f2173c970ed1d5e28f11cef07dc61
  - 54df2f391e4638c47d77c751290abac09d92133333e8369e958e1f71686e239c
  - 54e0d3e35153a071227102897c93010ec7c9645858ee5bccf1736b3bf4a4b682
  - 5540d426eb35ccfe2013266b14cf1910c4da6c738220ea9191218a9d837e0153
  - 562818aafa7ca1cc7ce8cc7508dd2c25f97db18883d298bd93fc075f3a2b80b4
  - 56c689d366cdbd7cfd24fa509b995263d0a350a8f43ac6451f617172ebb4a740
  - 56ca68ce43e3a85ccaf6b3ecd30468ceb2f269b3b3c3c7ae3ee2601b2b8f05d2
  - 56e877b2ffa56a691016c013b690b086438accdd5b45a07c1f1d0fe167f5d223
  - 5728c99646f54620045f063a76bbbf4a29d6627192dd1b7897f940f57c5860ff
  - 57abca8bd59dc3ca3280a96a971d2a2618fa28ea6943a74f931c43b4eba26d6e
  - 57d33def75dd081e4f84c28e1e3f074660913d98659981604cdd0df14793b161
  - 58146993665e65758c1ce6c71dcd6bd823291dc02ca9cd2211f32d38a2f9b616
  - 5933af5b70ddc5f7678d669478840d180bcd16de3ca4a1f3b495b2d4850fb58f
  - 593901be40c2386d0920dc2962c06b2602e515591335ed9e2b6b1da00bce4ff2
  - 597d3586dee1e8856bcf49a379238e053b336a00b9b199c7113d9f55389e518d
  - 59c9dbbcf261d89e60c95b551a1fc3b5655f98882259564267aef799e1917ded
  - 59e650248fd11d9ac807d87b5a5affcdeb9473fb2cc0fa742632f3a6ece9b5d0
  - 5a5962de6e04b37d92904c051002b91bf63a9af30d5b2295a0fa33b01838c45a
  - 5a8e7c57cbcc23077d41157b4cd583a937e367110d08f1206fe802b16ebb4f50
  - 5ae29b1539c38f6c5aacf32368e3a25265b7b9a54734e650f53a5bddae656733
  - 5b45445b3e37f5befe584573188160f5707989bafeb04df7566fb2d0f09848f5
  - 5b75da6b17ebe202875b440fe224dca08c420a38f020a4bba28698533b710318
  - 5cfff1fae6f929b8d1adb3c805054d0652398ad3cc62634556e8ffa52134e572
  - 5d22971babac4f09b6fa7d6644b308685d950734a47077a47933b15dacc73fac
  - 5d3ab1655210bcb0427344dddfda5347f97d4031187ffa943a09be7927439a9b
  - 5e44606566ad896fcbc40ff9b781f359a784df8f7cc684ed3271a3a7c07a33b5
  - 5ec1651c523d4c2e4b700949e69064e422ee0917340af26938ed48da2aaef700
  - 5eda81709c59260ce3543f3c6c435ececb5c62226b602dca756b0016540f6bd6
  - 5f30dad13378a4e85fce818050e88ea4cfe46176cbb8aa5ff2cffa71de4abd85
  - 5f9082625ec60dad585c36ad010bf38b3de4d495af5820bf23c60886dd0033d1
  - 6075fab359dd55155f7f0410fe0936444a3f49a1709ab8a4703c5ca583f012d4
  - 60a0ec2b72f0069d70e79120432eed97d025f637bbdb0a6ced5abbe6646ad6f5
  - 60a9bc969625665cafe78c97203d3a919c75a2fcb97f626dfd397097f82c7f8e
  - 60b25a28e68677266081370cf5b4c86f910f856ed0d396bf8615accb539ac851
  - 60bded29183e551c9e01477641a621b9bc98d0bd6cb20fda27c83ea647e3bae0
  - 611afea5dc241674cdf8d8ae26b92067edfdcebaa316d6e3e687d9bcf693e5b3
  - 61f7166b22b3b550fdc7cb3af5f4e45aab2f2dc7fbb0e4fc9095cda1cb868ea9
  - 61fcd4d2f87c64fe726c686ef230a6ad7d40e945562ee9b7645e58edbfbfb1e0
  - 62297e7f581cbaf37a46db087d65aef259c6c29024225783803606b37f803f27
  - 625722a11923afa745388f106d325af30e1fb1a3f31d39c2e6eee0211636ff9e
  - 62afe1007c77cdacff923f7969b932092b9feae1bde5ea933acebec9ed16106a
  - 62ebec05263313708958e41ea7f398b784dde148ae5a3375b18930ca706aa623
  - 62ec4ff353e311a82f1ae0ec96260e9858d6910d69a6f16781d285ee5e7a11ae
  - 631a489ba05d3e0018696f7a34a332af66b437fc99a6427f594c2be5a3ae5e7a
  - 638a185fd40c6c92b0ce15cb1c9dd3cf6f72f20a3ecd2ce3385d1092b3a823e9
  - 63fc56ac60c98d623d9f0743343593e610f84dcb43e6be0c42f2b0c999b62c53
  - 644b6a5a94cdeb590c9b0b5eb955c1df43524cc5fee382fda1e6774a7d123846
  - 6480960249506b9dcd01112c96f407e98321354b2df2bb6a117453bd9c6dbc03
  - 648794b776f9748df1ff891f0235ac12ea2524672a57699913b9bdc1ee2de0e1
  - 65b9790e259198c12766e04eb97e07052238168b72c7b4ce257e0895e034539e
  - 6630580a1f787434b0c66a3982f4e4ec7c92672a64288a908a460b7d89d37e27
  - 6686892d22d877e7caa62c70f43f5a46a7e942844c6e043502776908da2da70f
  - 688643d58a51a5ec276c2dac1e19b9f74e45bedcb43bff5ac463c2a9de93e069
  - 68e2c58a6c276729b7a8eb99dd3ac5261004660ae3fe064a2462e0f7d10ce72a
  - 69b07d224974e29583c740de1f819117010b752f91aa7f6372b95ecf5ce444b1
  - 69b47e4103a55740e68720edc882f0031807bfda7e6629092ad25f5952c45e3e
  - 69d7fddfa9685bc5eaa9ee3b57fb6248412fd182957741d27a707d851ed8f53c
  - 6a6387c6233ae0318bdcfb65c57433a7bed48fb5edf035aab22956acaa7c68ef
  - 6a6d22000fa5d88518647485b2f7245ed768fdc11acdea8962e767e809740e40
  - 6ab2a4a65125337abe43b731ae82e81aa920d5238bbf04001fa3a7ed2fc07aae
  - 6ae988578b248c5ec196b7ee4d55e9690d20d33b38b30baf188ecfacf76e86b9
  - 6b86f58b6e25cda71f5a5c809ebb28a8088b870145718d597c0b2351cb4d9241
  - 6d4777cca451db0f35589ca669556fae78aae199c2d7326e237b1812c986a341
  - 6d7b0b94116a8b005f1fde345dfcce1d9b8210baec1c61af7ffa9dd4de996dea
  - 6d9802fae8e9cde1b117af6f5886eb4b5744d6970da86e4e76d9cdd97e0e89a8
  - 6f4771968e6a1f352f0d7a9c49469d91a135d1f807a4fc0f4c4ac5ff643363e1
  - 6f8d19eb694ffc4cd75c928c28ae9c8916408b2f95c037d5142a39dd6260edb4
  - 6ffbff58192364901f1e822a3fc2934434f4243af264327bd1e9f9026781795a
  - 70035538055322a9b105abac04eb7de8f5ed3757205db7b83f9e8253da789f26
  - 70060262e80709d8a945f18b161d00c897a57f4eefff0d7cc3fffdf3ab214e9e
  - 70066817d8d592893b10a83f8fb40de28252286b19ffebd14c281bc73c0b3be5
  - 706d84e8a425f8a70325328d583bc238a6ef340b956a3c976d45e791993c483a
  - 716245f99b799dabb6a7344d8c553a0ce4cba771ad31073ceea48a2c4b0017e3
  - 72015088efe688dd45f7c66fb93586cc4b6b314918e0679cccc9acb112268691
  - 723d8f1cd9f91d901654bef4c5ffa54a299ff9039997053ef49b296dfcc60f70
  - 7253d1a1c263ed99fc90370c013d54018580b3f0d470f13430f8f96bdbd9e27b
  - 7265b03693b5759e34a4c78fa341c60cfcd94e247539721090cf95c2e9baa2ec
  - 728779bb877be1bc2c13099029b683a3dcff587edc60d0d49eb49e7a518d9c86
  - 739931632406eb30cd591a684405977483eb717694ac91cb116dddae625f3120
  - 73f9c97539a869ca958150873a5c2f6bb48a85f2673b3ab64e087905dd0db0a6
  - 7406202416284cf157b506eb15bc9332653eedf538d37a6871cf9170099b0709
  - 743cbe9cd2cea779d42cc8c47e71ec02dc7ffe4f6bc55b066e67ec12666fd174
  - 744ced1c861f125a06e2e8165b1dedf7d369155b51cea37cff2893321ff7d725
  - 74769ca9817945a4b0dd457c7fe0f7665916b04b241060e7c0e3c8b0b3e8981a
  - 74a745e1704cd5a2c631a7d892486b3c4bb508d34cbd1fc835dc9b7c471481e8
  - 7513e8cb0f0555f1979519a14993b3c88fdd6fe5e8cfd60d990242ac71030dbf
  - 75be4546d3b783173b53c4f2b7158816018e782b0710fa5f6306e84ad0dd01cc
  - 75cad8697bffd63e8abcbdd1be5cc516d5c36940771065d594dc5e6df3f7d8f5
  - 76ec0f4f449b4fe9a1543af88c0425ff5ee7826f8f6568eaff936c91200422a8
  - 76f6018e1d2c0019a35308457e210a08633ea22ca8c603ac8c79d4f6fb3b3bde
  - 774973c49e989def78338b7de6aa0401516a99cf24b017b33e74f8b64653f017
  - 781931a9dc016bff8441aca2ade9bd9040f4d72f71a0970d04891fbbb4d221f3
  - 795a0609ed30faa105f7fbfb19ecde8c1363052c432e016c0aef5c5792468e55
  - 79c77ec310d9b3413d377469d5750b8b9db9eb09e621a8d8739df7f66b8b2e97
  - 7a13e45b635d349ec65024fb5168c3c4adaf52d7aac21d9476da7beb2e0aaff9
  - 7a378e11ad8b89e675f93f7a8ea7f4e89959cee5c7fda9bc1437b5da57a0b534
  - 7b14b535ee029765752bb0531b9ae6e900a7f6dde39773684845bfefc2280988
  - 7e37df1c73149f8afd717bc44b7329f43c1f05e0551627be6312fdf9bb253007
  - 7e3fcadac58a1319dca88659eecc870dd7a5967caf2cffb5c5cac16d227aacb8
  - 7e67c8354ba93c37e74457d4986727a8e19d7be6935995beef0863f1eae92f04
  - 7e82b8498b63abc4ac5f74dc6fa7acde453a844bbab0de89bd61afddf080de59
  - 7f06d4b0fc2eb1380b6da44b5824d69903f4f1fff58dbef070c45c1f32cca6b3
  - 7f83c1cff1f236944fdfe139ca9ddcfed099561bf95439e075d734a85da70afc
  - 8014ade59567c0e506b3c2edff5e305a1415eea7f0a50e3fda3687498f37e23b
  - 80c79c4b8982e1c4eb25d78c20a79960cfbe39ccefb6a8fd850c0250465787ff
  - 80da794cb34699073ba886beaaba1f79c1ed18d9b93d043632b301d523363f35
  - 824f300bcd8faa5879c86ec438f29c2108f6fefd5211d67522cfe1fc6433f61c
  - 83b74b586cf99d7250f36f071b95cc8521528ba96f7862b8795d19efb15a0dc0
  - 83d65d628eba77ab7693e155ccc2b2c745f04233c60e3b0df18b0bdbf7ea46e3
  - 83eadd9424eb87c157279c85a9964926db77406a215763acf4dc00b783d07fb7
  - 83fa7ee2a9fe4268508c59c2b6c5d2d87da45dea5a4019e101e73b830f6e4ef3
  - 8525d7d528f46bcaae4f0ab703367b2034362f6cec94006fb7466e8aa04bbe69
  - 85320da3ffb765dc56455dfba1b05250068dd468cfcbaf8036301b53f8877240
  - 85650b921a8103cf2ad44640055ee38d1682a7af138404fd70aa5cbc908087ae
  - 858193b9f1a352843a8ee077a07537fce8afdf1ddcb001d682b8d0a8769b85e8
  - 85b13554b62a1da1f1f1e3943a0518971d69a450258dc37eb7f2b9eeea28db76
  - 85db7cad55644744f660938e02d7d11452b43ccc15260d4bb2c8ae9dacb61cc1
  - 85f40dd3c0e3a74f3fa83dbdc0a3dd9130a6489b012e9c999695701a1140d169
  - 872d5b64b83421a3d877d29fbdbce77531dcf29a798be3aee3c3aecd7949d754
  - 878eff10a9852c6bc9869a9af9ffc19fffd2453593e35b58668d32d21cf0b9f4
  - 889d06a1336b3c454671097453502619c1bffa8c629908c05b987538423250b5
  - 88b6602740e8cf6d37c830c71d895200a5cbc4c61024fa68942fc68027d964b9
  - 890afbbb622b045a3db3b86a5dc887395182b724a39a19d2ccca708d51d4b03b
  - 8920d5bcc4cade37169deea073b2d83ccc1afa13fe663ae1ada806247da305d4
  - 892c6f1a1254762fbda598ce48fa396581595c547314c60c67554fcb47deb93c
  - 892f289f96a2631386ffa167a957880b48d7409fb07212aa270799a4f8f8826c
  - 89f8f40c2b94ac772afb1aa09e0a0989b788d78f65c28660bda7410ee2572cd5
  - 8a21636f8e4e171fc0d57c246ff7c452d144312c692606c4ed05cbbbfc476c53
  - 8aac88b4433070a93a72ed0c50e3627c15f470a546584a4c6bef4c9223ec7d22
  - 8ae5312dc1e4544f57c86c318ecba64ae0e55980bfccd4110364e423ac3b578d
  - 8b016611411cc84d12bd43bc90a7212f88ecb6cbf4de4108c276769f2f0206cb
  - 8c2dff80807786ead78b503d13f29a771574220d8bfdabd46c0fef2b1621fc8e
  - 8c33ff03885343ae831c628da7bd887084af6f099c25c61aa67f36b265fd4fc4
  - 8c4b870f1fdcbd987b3a1b2b28c5c13798efc8ccf726a0dc4fede4dcd5dd2e12
  - 8ca9ea5422e6a42cc19c429d9ba8645920e108b4243279577613fb852e6f5a0b
  - 8caf3284c490eac5f23f045e804f5a2a7b2b184bbf4964fbcf788cf9b2c4d26a
  - 8cf8ea1d73651facf24c02898bfdd6cdb654b25b315d536b7139992a8709b82c
  - 8d0302a434b4df96efe568c658504ebe0d479f29b845c07e910cbef5cbe8c914
  - 8dbbca21f3094abe23c16dd49ae6462d1b09d685580e1544bbf662d44f850957
  - 8dd478e73bc422cab5d35bc6eccb7180441373167e21a72439287aa5a23ebe56
  - 8df9a0036fd65684772c48196149a87cf4c85e9064a886773e2331fbdee8f06e
  - 8e0027f4c963e86f236cabf39766f8c8c4b5fabdfff14cc5bb46f318b060b34e
  - 8e6aea308380bccbd0a6f4a52153b54eaf231bdae10875c9adaf871b2d99a2fa
  - 8ff1abbd2ba83583ec67daeb656bc13758512ad46c492e992d8c1ede91a5039e
  - 90436b8edeab496ee4a978982096fb7fc0935555102d27ff059d9a316f67b324
  - 90b268a0abbfe60b40c5d82ab370099cef50db9d4defafabe5882807112e2fb9
  - 90b6e4a70a86c6b8436546e2a517efca2c9e3d1c90b6af4aa466c4677cea6e55
  - 90db261e25ba1ab6d4297c315e4eb8599ce0d69b6deaae73ff8bfe43745ab8f3
  - 90dbf30ce7d12958870bc1dda46151f3237cb2797056b2a03fc38d30291a4d41
  - 92518325bf50a0065eb49645c996b30afdf62dbae9f3b863a696d138f2e7abb0
  - 92891bbde6e1c055ee9f34902bea72a858a7974f160b3e5426c2e01d0d7cf2a0
  - 92d1552b55e2a6b3c9e65a2eb3e3fbc571bc76098963acded918d920ffe012b0
  - 92f041eb7da2ed2666e87d56f8f4a28d39796c25792216757f235d08b4344ee5
  - 937bcd7ec1da7d64ef3a2aa94a2e9c00ea01f0d57869327bb9e30cd31d01d4a9
  - 9473739da93cc9f813e96cfc1deb7c7161fafded2af4d94e0c78e23b373f6ef3
  - 94fc72c2f6c70ee5899232fb4ba15696fef42d3146ccdfbe21eec1c436f99e1f
  - 9544586b2a388c3dec0e9cfb2b382c0ce39b556e27e39d4e1079315de6f66a04
  - 95bc032eba2a5c42c74a8aa3bde2f63dfa118d77a478331a4f9490965af59b3e
  - 965f51f6dae384fbda2c0fa38df47b9382e50226782ec5c20376da50ea44dcd2
  - 96825e829d644c7d4c84240c3263a7b213302d0c9f1ecfb5e64db917583efd5f
  - 96e5b415dd45706c67d501bb2e56d1ceb8c79a277f5d20578ef189b6ece8e441
  - 97615ded241ca79e7857d3afa3caa567d7b481563e10cfae58fefa41fcc8ecee
  - 97f3a05d2636bd8d3aab31e01a9ec4e244eac6d3158092a3cfc223687dde3eb6
  - 982196e92173cb7fdd9f9922a8432dc1363de7101ee7629f80d87c8525e852c0
  - 9924b77e64ec40c0148f08f065b9180168bfcfdea472e327b4ba675ddd58ca10
  - 99495295dad840812a808a4d5f31714fc39b08be596b4c64c4c8472f5d16c278
  - 99e2520177767076edf82c23fa77c43a916e46808af0e6a618022ef855df8022
  - 9a97e66ebab11c634f543a7cdcba4b10a8d784ed5b59d3e3db54b0df00b76452
  - 9bb98dcc499aaf9cb00d6587eca2eb600c7b58175e27f7061fce21bf0d7bba83
  - 9bc2c40cf2a583520d1e0751a40f56b86756eb07085ceb28dda02823eba72a3a
  - 9bf642cf43aa535be0e794a6469932868139e55d917a53a8e24425ededa3b29a
  - 9c367277df6cd17dab42f5f5165b1cf11346314b594672b26bf452e6d3a63a29
  - 9c77a200531956f77f5d7eb6998e1425403228ffda4d128822e38a9f99dd2de8
  - 9d08cec0e25f5eace754423215c1f1752b24595565f830e9601d6b51eb7af92c
  - 9d9e531dbcad33b8d33caea1bb74d5d47650bd010d34d17d4b45ff4644e82c51
  - 9ea1a64c6c92e703b2e682d498a0ba5b79aa5c35fde54e0d3ac4986fe82cbd52
  - 9f0d11302101e0f1f91ae80ac8bcdc6061db85a5d7b825b5ee89d49c7bd65510
  - 9feb4a63b655fb2f646aef79c1aa370c688d38cafcfcb3b2405da3bf0f06f78c
  - a0d9740a13daf3c5f08460f67e1fb7efe1ee3eb8d9a8b081f0ffb8c27bd56e31
  - a1abf6e07006043c219a6571ac475859ea998cd2884ff577916d933d4303c7dc
  - a2124679af9fb7dda4cc8d17497a39ee3a610bada4305e7088da99f80a777619
  - a243acdfb50171bb40c609cacab4cc4deb18e4d6dc9218eb8455f5f55dbf07e2
  - a3e264c537a5392d06f2aa235d96931db0437450562f8a644a5790c7d0f540fc
  - a40337af0b3ee629b1bfbea255b3f07e8019eb2faa73b044b9c5ab17684a9f36
  - a4dcc02b70730e6b0821234a1d60694a2f53d0629140f7af730487d5a51c4bd4
  - a4f2522d386f0e0aed7cc8dfe35f526f27106bff5f3f93dccc96a8717deff5bf
  - a539f3731b7581e746984f9badf130bab63e337a0cefd607accc15681283e5b1
  - a5d4a31171fcfde38b7a7532db36ce762100925aedd344cf867036f0d59a68c7
  - a5f8e3a6bb9f652a1adca6fdd9b079b6429fb4a2a6e770f9292f069add546629
  - a64b9a7cad2f376aa73275548a3bdf246ac9df667f28ad42acdea7e14130ce2d
  - a6ad860ec863bd18367c363a7738bc4586676c9dfc9ae7a229d1d4df00b50f40
  - a6ef9ed48f5a36890e9b3b3d73fd5c1ff4e44d3b88e359e3b2f80da432396237
  - a75bce634af3eaa8e744737781b92344d99675f3ea7f15ca2168026b1a94d2eb
  - a840476343c6858d2455e86e6876467aa04660010dcc1cbdba35aeefaf709197
  - a874216274141032f7f36ef35c4ce8280d24763af436e7294aea8c49e5b1d987
  - a89f377c985cc0c48b8467a88485bbf630cbf06c86f300e56dd2add7dab5923e
  - a8ea5b2d17577e05be2c430c4323ce31d6b1d499baeed07821809113e82576a1
  - a91893d76a7d24f2bc9eed2d53cedf9ff779e4de0457ae69a91f7cdccae028b7
  - a9b2a7ba4812f53191d4c8de3608dbc1a8c4d5c6d4262126e96c0d666bae4025
  - a9f46e5e4d87a119ecc2dad18f2a1d88dab316ac72b223efc25429fc8be2902a
  - aa10e0775e57de3d7cf40b6c5d9472cfb5655826c35bc8b024c275f8df3a4456
  - aa55ac45d32ec4774215752dfdd454eb18d84d34e8f45d53d02cf26daf61d5fc
  - aafb09bdce3e3bfbd27c3ea4625be26a9079db84cf17343485890098808ae79c
  - ab8d9efa535ffd40bb3815a835fc3779dea918ef5222c9cf45ba94000920f2bb
  - ab9dd871c635086873550fb3764fe500f9df8b6da197ffb74246e7a5c92de414
  - ad0488b03d6f16377320e9a29cf13f47d51423ffcecec8603a0353d11efd635a
  - ad7fc3a8ab7c359f789f284652fc27d47d506478eab4e74740e64e9a52575411
  - adda896c3a65426f6fdc412d613190f9d0c6eb2666d57596400268a9132f642a
  - adefc59689224bffb421b480d1422187dd20e036368d3a17bc38db9ef7ffde9c
  - ae940c907dda0d704566df87bb75531f3c3882e6a1b38851afbf7a4e66d14908
  - af8895d6dd596c88b046289cc53ae9c769ba1ab82fb09e723b217ed1a8f24007
  - af8afedcf318cf644957a80e37a2728e2e0299a7121f47347012b3fd61863c48
  - afa40c45f2ccd9b3ab7ad7e702f3a99160649fcc4be5ae02711389e51c77427d
  - afca611b9f93875a86c39f64170c660d66bcdee1d929c0001a6ac578c699afeb
  - b02525f47b299e903ea52a48ac175384008017c63d47361655634d6c88ddb434
  - b029aaa5e21529e6ababdbd9e3f68deff632caf272b2bd3d88974259251c0ddc
  - b04650b89770936af041ecbff9c68cfdcd106ffcf62aef7d92a7802a60050d28
  - b12fe4ddfe8bc72cc9e2e6565a0c57d5c295cf7071871b83fd7b4608250e52eb
  - b19f844e070ece82ae5b6c86680678c72e00ef9783e7d4b5f5ecb207e1d4e1a6
  - b2080fb76ea9624c2f93ef6691f00290e434683bdb2cea027d15ea7f2e1834d9
  - b26d68a61484e7c9f9d08cea0912aa869aca4ea93c828c4581ffb9be69ad5382
  - b2716ebcbcf096fb1a118dba08905b71b55b9f85f638cf23ad93dd53b4cbcff0
  - b2a148367c32dc024a57ac89e3ce9107629c7fb2b940b91713d4a6ffee36e708
  - b47a852e42c3461d0108040235a3cbec9563bd341c8d3971cd423f9cbe76526d
  - b57c3e555dde1f9af77410af57313da81f250780606d7164a0f5c1ecdcb2330b
  - b5856544856d7e7349983d00e9be669d3fb2cc2c3e6a795c3c080ea01b22a632
  - b593fef4741188c0ef84c87d08fd3a078cfec4064b5c4a9a3568c9fa6124f780
  - b5de4e4ee3dc01a8de892091aea0a5fc46ab76a040a3f9a148503aae92910a69
  - b68422aedac5fe5a231b5a43e43d12a111e30036023e1ff664d4e0b3795f71b0
  - b6d206cfba08b653e673f2fe36af49717df39ae4b055cf345055c5a457b1b171
  - b771954d322f50e08bc1079de4260a0410574ef70a3afc04ec8faa88761163fe
  - b79d0093e17d920d95e153b75e8244cbe3bc2252da27a4a6c6ff80115a7bd78b
  - b840ecffaa6ade171c624cb6afcda8019f56041c1faf8e426df47978eb4453d1
  - b852a5a0e27a6a4bb9caaa2ec6da5ef01107fb93a8592bb541c69948f5c2daac
  - b8ee06c6d8868c842592d3c4dde9c52128dc7435efc4cb092e15b3fa8b3c038f
  - b922d1a168ab76f6f682188c91a897e8ee93079c99eb3f21a6a35c49129802c5
  - b96a8eb3f262b2bb1074a95b07984422788ed72edd149fb9916212ffb9fa911a
  - b99ef820657d93faa831ab4cd5ca74cc52d648a15c7f6e54eaeea10db7d2a88e
  - ba2d0c431a8739eec69c890e26c99bc370e45c3868086fe9488830b5f283a1a8
  - ba5ab0766a54d5a16987520314b268d613f83bdeeab7ab2161b11fcded63c7be
  - bbd7de92868c545fe19674d4cfb27d5e8fb6ac3a1518f08f0071ed66cae7bb74
  - bc4a6597a2dc6f2786dfbcc2ffc05cec1a1de22e482935d4d666317d6994e74e
  - bc9f79862e9eb64176fb035d92fde4d49d12165a0e0736214a1a5282901bb028
  - bcf9821f5e0e4fc1acc942aee222e5856478eceb196c52992197bc2b63e22df5
  - bd620fd612bfe7e72472ee03d6d405a5be8e094bade16d2df9375c28ac3d3251
  - bdb689aae39e29dab32bfd3d0d8e097a660d03f52c9aa842729ab7d53a0cf5d0
  - bdd9745ed77ab49f0ceddffac02bd420dd927095616962570709c5150225b96b
  - bde927e3197913a6bcb6b4e5ad57fc9226abd6db4470a78e450d96e8dd185e2c
  - be1d867afd03e4cc2fcd25603c71cdccec72b7cacd183802ca18b4728b8681f3
  - be9ca2533598efb6444a8ddcfabba001660d307e7e312531a27a40f2962c19dc
  - bec8a593974b1bfff7480f56db82d168ec961a41b12555f0c3c9d644df55d1ac
  - bee84c686b858dae27d93e41280ae077f70c850d435083bd3a9d93ab3d255078
  - beef99377fa7a759979627406a3d83f493a3ba46f3507c1b3740fa0b07119151
  - bf65f060b4bbaac44f9703a0f9e95b2243641e3e0aa0af7d017eb975418b805e
  - bf6f8d18a4bba0910f4a969f391829ea1fc1a99169a6b255bc1d91a836666cb1
  - bfb5d6565438a179c0155f5246890e48a032ffdacb51ab23132407430845fddf
  - bfeeaf20f170d48e52879b12f423b649a3448476573a25635f23ea5e14fdab92
  - c01a13a26f6c8dcae1a8e4f18ab249490942930dda09f6e821a93a6ff506c4cb
  - c140b8a5a74e8121cbe93d81c553286427dd8fcd978285e7389d50b11d040c47
  - c15dedc5af48ef4992c55bf3bcb2025c320dad8ecbee40eea5975eec211d8da0
  - c164dcea531efcbd2ff76c34607027a8c90b2582529152a8e4192b81df476c07
  - c1f76d12b32733bc3fed998e159164599931274f8b0dc5786441ed2c12c2cb7b
  - c2845e3577aa977e6f539a44541ad32956212949f83ea2bdba21251aac8e5cd3
  - c33606ebd93fead328ba3031f07ee5cf132bd680e29ebe748a9e33f8d58d05d9
  - c3442f736729dd41744fc911b3c5103e4641135c786bb12553c353cc8f50f0c3
  - c3669fc1db1ec0f57b1a03fc3d1a1f02ac521d0301e3a391f29e6a30b1b6bb8d
  - c36f187e436f604fd5b801c472264f49a117c03ad1235513d86913ef903aa29a
  - c39455f717b9fa93017ebd89e72a292da168b8c201cd12fd972bfd211b5e5127
  - c3a101426027e6836608ce8ee8d49d52bb8b09b33268e4428cb65d536a4f3036
  - c44565962558bfe20a3d62aab1be17204ef55617d5f1e4dac4091b07fca118e9
  - c44fc370c106131f27a079473d837af648b24552e06964f4d0fef6c832a1efc7
  - c5658766ffba2eba1e3c14cc2bdd2be28f36470b0cddcb11ed1a215d6f68f584
  - c5751125ae3af83a50c1d15fcd1c4453df08b54ea6af690da85db563f484c0fb
  - c5a964496f3c8d5400948e733f46cbaf64b4d8d4f5e62a011407e9bba583d7d5
  - c67bd4f5c2095fa0ff0dc3ae5cb1c09d5f8bcd4eec389f6ffb7b27a22f40ea02
  - c7b663483383bdacb70f2d90fd1ab6351ce12c1a46208954b16f6a8ae7eb7323
  - c82a21d326b23de4b02cbd525e6c6053db8435eb005158ee864327b1d28e7e57
  - c8aeb1cc44ba0f522102a0a42f25a11f75a2b5f651a415c611ee3268535fdc07
  - c97a259b2ea91a0bc0eb702a4dfd0615883269779dd7dc86397be6adbafa1b6b
  - c9a6a7c6df5d96d53b16900cca5b0c34fff6e69942b83df1a1a50f9231274d03
  - ca7db0914e86d36a572ab2a7868b7a03569ddce9e9b91edf52472fb45640c6cb
  - cb88f496d2ebc5be69d7ec79db4eb1625a32495aeab6c4c79c7cd3815e388680
  - cb904a3826d732ae4f538f4cff12e9d4152fa303adecd998e6c6d51793b8787f
  - cbeb6013216cd0292fa936c7701aab5b7edb44913dc7320c6078176cbbca96ae
  - cc90961f77694365f2c732740c5daf407814bc7acc5d958e5d5cab92918aee59
  - ccec70c0efa3b399944112b928bb32056b9edbe3e2f45a0756936deb91f819f4
  - cd197c0daa67696d547c3d57121b4e7f2ebceebedcdbb26c8a683fef2eefea8b
  - cdfeee947d97b95bd778eaf5eb3e44891bc6532457e961e96b803e96b81d9f8e
  - ce161c0effc5e89e0abf7e58ec7f5eddfadf5e86ec077c58cd10fe345e969b02
  - ce38d4c3357c46f0714bffbd0f8a21fb073e8dcb9aee70716918b8177790e4b2
  - ce6ca93fe51016fa33dd33285ae416c0ca60a632f311b406c6ea9d2bef2f96ce
  - cec7b3b9134cbf59c94cdceffd62e07ee917e3d9364d81d736626c8166cc12aa
  - ced8cd10dc1d04c5f73f20c91c4b7df098d82dbe572eb8220c71e9018b3bf95c
  - cf8728eb54b90fd80569d9861e98975ab939d2982ad150ba3ed4920e495bd896
  - cfe6f5a684bb89a7001ab67c398d434b600f89e86934ddf2a92493027c97e10e
  - d05947a9c6f8e97e66b6725d410d62db73907abc4a4bb9749625eb01781972b1
  - d12d5d2f40f5869c509fe37033a2375010ee46e06f4a2baec62dda70b0be3661
  - d190403e50d73b556f06000e85a10041a3e7d62e97c4c388ed6f30c3a13f5c2b
  - d1b80a700a723c3477b5981193decddb4899df53b460e5c7a98b5047b588a7ab
  - d26809dd526402ae39b5aa4547df3db7d6852a75c9d89c6ab687ecf74e015ff6
  - d2813c7330b1a114fecc4ab49d7b88321b4c534d26ea735232167209310e8629
  - d3338e81e002d07a0e27a8e8edc5548d96cb7b40a102001ba9b43af28851cf58
  - d35d41f65af6a5cd8de14360062f5f81b90beaf9a3e4c075d886379f683c9980
  - d3f17085d9bae52df443ab4b7cb030d7d2fb7ce89c337928595d7133c552d478
  - d401d42e5ce0a6695b45bc211a5e17f5979078333ff7d04b6d987f0e7d96ae73
  - d4565cb03d86428056103bd2ba48f0a83a3d967b9122ac71d723099646c20637
  - d486012c795cc846b6d1e72623718e04fd3ecc58ed575803d30036a9801aadfc
  - d4886427855965d5857d8f876c37a5369c54bee361ac089468dab5a3b4f45e62
  - d4a2976ecf99a9a8dfe17ec57fb6b365793b125c197a16e0324c85c2c544d5db
  - d4cdba2cd0cbf0d05bf71dde49196caa8ab6e381d570457e3c2f210f1f476aa7
  - d568dc4ec2639cec26a02d1c99ba7ca3064538a7a1b2d5ca0e095dea75fd8d45
  - d591825ea00c496071a3b882279a956556dc774d73db3bbb57cdd0551f547a51
  - d6e6c19637bf23093bfb4e9428ce40c7741f2d926c02e9e1335987554b11a531
  - d7437d01c9a97ad0727c977b0773463b981739083425231c7fab9973be84c151
  - d9ea5d667b2298cd628adcf01c7278b077fdc3e6c72abf14c43dbd2e44aa60c1
  - da16e50f73e0cc721f549948f2abdf1629c66af559c8e50673f4d28bbc25e535
  - da5a33502d2a6aa4f163b1a809526f7f363c44474a77fd1bccaf65aa71a91964
  - da6212145621b78b1351b7835f12f8e1c731d2f95d63038468dfeba9ab57d082
  - db44f2242ab4118952185e258a2bcebf9d35e0deef53c7eb6345519be99ef131
  - db61cefb7db1699372266507614a20cacc086e538dacdeb28674ffde96fb5cc4
  - dc841a6034a779430ff05bc7e6a8fe39835ce5c3a2384c3f45b49e65c17b7f4e
  - dcc1bc1f0f1de4dd0c25c269fb2055d34968f52e8c1ebc2f4f9c19c63266de35
  - dd259854178a916725651545d9b9afcf88373ea14453ed1f1e5fc1e03e0da954
  - ddfc20c339de2cedb8957e4c2953be183b3f88039cf7278c4a9eb5451e695799
  - de47369f384f04ac8deb43e82b2cf1b3bd7e1595928c98a4af7db0cbdb93093b
  - de95908fa9c0ebaca76994d8d9b5fea6a1cf32edebc29a3f27a1d9689e03e2cb
  - de97b6c13b606853f6bc8da78b8b8ecbf09f9282e401ce0b0776e665c0f0c7c1
  - df648526bd212db46195d4050f49e4e3e7340f689ca27d769cbe862e0072f5a4
  - dff01876254b88c3637a329f6096f718bd9a62487a80c692a2d0856a2e6548a0
  - e06ae77c4ba39b11a501332a3d714b8a108596e68574ee8e7d3b40d505d3e381
  - e09d9c867e44ae65603f0cca91d3ce53ddf4b9a33d4c0121ec3e6f40cbda8bde
  - e0be65edf24d13812f77fc08f0ce4c47bedbcdab2808f482b828a2a4d04426c2
  - e0f1d70a253989c99f6c0e98aa36e132f4c1cc8dcdb7b614dba089ff4f0105e7
  - e14b539f0ea4f1e9986c54b007717d845ae28ddf062a8ef20f8ba7c2d09e0d88
  - e19c3a6ebb701b4e6bb71426eb87d5fd6b6e5a58bbf4502fdf1e2c7b0cbf097f
  - e2044550b9da92bdbaf985412f7d5266f6ae1ef30f33e0a7b345625677ca4043
  - e22abbfe4d40c7d4de8c92110cd65816bf883b16864cc7656b8f7a9b162177fd
  - e27691ac8aeb5a66b6d3f2ff67e74e627ed5ccebbb5c3e97d12201efa4ab114e
  - e2bd557005c70c60c74d737d1ffb69a3b568e58f2c8f4ba1ce1bca38a46ce5b0
  - e432eb208c002f8809968a29062a33a4c7af644267822adba82608f1ff013065
  - e450fb7050823aacfa18a501f80c785133e2a1a8369ad552ebf816d0cd461e8a
  - e48cb92dc7b17bdb4764077e78aab23dcf7b71d1ae97b416391122927829af82
  - e51e188684a19cc35fdf95056ee3ec13260b5001ec3b01e5fe5f1d8278f98843
  - e52e26d8646d4f2d19d7913cb183517281f16fc7ae95bb9be7cb8250995f9897
  - e535655a0d0d8b88f5beacd69e7f6b236727cce053a12a16d973a1b8d6aa95c8
  - e53d1d9762bebc1a1d8b7db90b920cda678952b751ed17d6ffdd52b5aefb3896
  - e59b3011ac9fb0a53bd36a987ccd17f8bcfd925abd15886a6db1f727281b724e
  - e645f4fe9cf2970ec47a0c1285546f55b5c81b50f73ab72c8e858fd83e6d1758
  - e69695459b2e528550797ddf69a64db878c22ddff6aeeb27786dcb8b7f83337c
  - e6d2b060e3153731d1bb8bbdf9a7c1d7eca2db4268ce5a2026a41388ad7c6462
  - e6ee31152ae49c38808c78943c3b2c01e740e9cf0015e91ce465260b060bc0d2
  - e702a4fcea411c1ee01e95a6f6c70399eb4be93e8df6fee419eeac2651d299fe
  - e7344e8fb7c54632e022c09abc355bbfe9c298a80c42a3a775d9af1b8c6a7d35
  - e78081ccf90e30b4c8be1e9d52c6ce98fe402df33982f66908382b34327f0a38
  - e7928fae2eb2d0a17a4ec9d5e60cd783bb8f273ff313116b06bc1faa7c419f2d
  - e7db45e9da9009bcdba18163b92d3d474995382319111e0ff43d259bad1f9570
  - e7f34a69bfc1cac87773dca2c5e670d3203cd4e2363637b808823265c8c4466b
  - e899c83e7483471d3121c5fc22813783c4c08af0ab479a557855fbd3983076ae
  - e8d9a7543e9489169845521d236c2774fe207c74fc7c884c9089c9896929754c
  - e951b9fce849430586502a5943b7dc93e0b1dfd6bfa1c8e24d253bf3513aa676
  - e97a43d3c506f8b4032097742bebdce6b2b96987dda7017fa6bde52a9af85d3a
  - e9c0cbec77b3f03573eb75acac83b10f831c64e7a85f7b68c4d4347573d9d287
  - ea05c441278c4beb66bf13b07108168d0260eeb36603590e70be32139713de90
  - ea0745e7b3b2b76f08555c3740d43a468c677eab1f7a0c2b75265b4998be09ff
  - ea469dfa822c49bd15d44370b7b36d847e49b9aab95731189225290872dea3a3
  - ea6e516c956d48c9c96551f7f8d3dbee0063cc20cd56d8566e794a06a4d21dfa
  - eb0e2eb78d72399c2abc59828786f1dcc859fc5e34f050459af0e71f5ea14f38
  - eb831dd5f743ab71f32e358eb7f36e9afd5edf8ebf780633bc5d94439d1f3c17
  - ec507495f9892e1dc36b085ccf3550ea6a7878afc7af5d732354159a7e1067c8
  - ed21f96322a094964c674d0f273d2fae5c5634555d8793a074389e4950328495
  - edefabd21e694f469fa94ac4f102a511704a24b5f57da35ac0f2ab530a5dbb4e
  - edf497cf1270f4cdb9c624237e9972ffb0c130da2e90ef1c1e98b5864877d06e
  - eef0b15bb7dbd92087672ebdf6b5317bd7826a3af4bc015653f60084a9277ca5
  - ef38aefc9c3713f47a6401d41d36abde2fa8a1c34c6a240fb79bf16a940cd652
  - ef8ea77236d6f24965da60b3444d70dc29beeae0b0e7e3455fe9ab68e3db01f2
  - f01863e65925706d0cdce70909e2e388a6bc4629130f756698cba9c619d4f565
  - f11dab13af6fde22c0c5b8e713c5792286c5766647e7a893b092e406bf0e0fb6
  - f15a81ae0fd2f83951701b96057c8434d1d7deb1e42a299cccbd6ca2f29399d4
  - f1df1dd547c5c7c33f5a600ca3ef5538ae26ab9f2a31bf1f71ab08bd532846b6
  - f280eeed19c69d1ec91ea692fb175853c0ef5513072898ca94b61ec372e58e1b
  - f29704377fee07bf5053d14d04d58f50d4575a650f3de525bc4e87b3b5ccc24f
  - f29ac391f26a3c657f335683cfa0c534ddf423a0311c582dff2254209ce5c384
  - f2a44c38a1b8c8b15cd52e6dab232cdad2dd7bc1cd986d459588b70ced0f2141
  - f3281fd7d9fbe9ee113bf08cc0839c3165abdf9b2ae59991601dd1e9251f9ab1
  - f41a364c656f59ff1d7c7137f0fa5ed27f327abb0a794dcb8284a1ad3ab4bd35
  - f423306f5edf2f25353deecd3abeb84f39cb6501c909569f020295fb73919a97
  - f45e367c425679d6a572135f4aa9ae24c47f9e9dc5e3e5b31ec6769273330473
  - f5725861f81420a7b6077d170edfd6bceca8147d4cc9ba2118e13c505ebcbd19
  - f58b45049be6288447ab0975d553a2b984d6ed800ab4ac78b862f57d8fb5c300
  - f5e705ea72385944aa26559ffceb84ca4b95ea9ff8c3cf7b2a902c6a95644478
  - f70abbc00c5aa05c4c8d058bd7f3b54ff9da7e2d9fa83300c5b6ca260fc0f981
  - f8d0160287e7bbc24cffde77583e8cb9a7c0d5efe0ac9f7e70c900eb97671e92
  - f92bf5a7ce7e62b75e2e8fb53bc56ca236933386c32ca5191d15d5d086ad7e71
  - f97638683d943f1fe5eaf8a4dafefa7e479942fc3d6a0285899a0ecc5d295d3a
  - f9780dea278e59aa7388501bddef470f68ad58827a07163898eda30dbf060c44
  - fa73f1e93a78dc8eab637de201adcafd3675be5d2da7306dd71e9bd1dcf164d6
  - faf5e82e673d1248686a18bda02c2bd2e5e8a35a7ff7515ea1dfdb364396fef0
  - fb27433b8105fb708bb1a8db4fc68701b8638282298acad8a405571f3056b71d
  - fb449a117fa01b5ed041b6ced618aea9a77a8bdd7e78a9d2c6a9bb190c1312b1
  - fb50291c46520ba8b9b068153a6f0d0f00f9f09f70788809bcdde3f4e9a416c2
  - fba6d968158e5738cbb4cfbef8ec06579c6aaf5207b05174b83989fd30f2bce3
  - fc33a6c6fd5197c4eeb495ccf69293e791e78b5c67e03547f47c540f6fe30a6d
  - fc50f2d5bdc5711fceb6bb59457095c04d3f6faa57251ef0420f21dbba2a37b1
  - fc5b9d8fac9eca67d0f31869568a1790c609b0d6ba44633b4fb3c22c1f0db5b2
  - fc6fa9ddca7f8ea937393857587deb4d164dd92138d89324cd812d99d7f53878
  - fd51388394fb3e7c44d19ff74cfd1bfc7da6bb4896527b4d876a1c396d5a916c
  - fde862b8eef143c05b92679b0ff53f7035b91daaf9487a45ed091b2688c13bbb
  - fde9a146b9e8f8021d88ee0a579873ff20c131bbd29702fdba32bddfc84a0615
  - fe4a6b354ab91935a7fabbceffaa85dbc0fe9f7e361f8e5e92fb15115a468b96
  - feac5c538f59196ec563cb6614282d8f98637b0cf066112992c842c7fcfdc960
  - ff0f94cb4fece3344a3158dd23885010aa238e4ba37e2aeec411190458e3952b
  - ff113c835f0c8c8a9ba2dfe30965335b68c99a01ed436af252af5186e23d3f38
run_ref: RUN-GEO-E2E-C2
---
# Cycle Input Snapshot CIS-GEO-C2-REVIEW
