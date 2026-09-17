---
id: CIS-GEO-C1-BASELINE-RECORDED
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
  artifact_path: outputs/snapshots/cis-geo-c1-baseline-recorded/manifest.json
  sha256: aadaee14a7719e43f10454880e0cb85fd66ab07566b1b3d584fafbbbfb667912
  fingerprint: 3553200ba452e55aebec4d3ca67dd721508a111a21a165ec11f4206158166f57
source_entries:
  - object_id: AGG-GEO-C1-BASE-Q3-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-google-ai.md
    content_sha256: 2e282bb570c9d270fb92a5b9376349d96c41d07599d2462e891656c92d3e41fd
    file_sha256: a962573fbb94a7f94376b640cf3f6c81331e5ea64258d6829720399b53545c9c
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-google-ai.md
    snapshot_sha256: a962573fbb94a7f94376b640cf3f6c81331e5ea64258d6829720399b53545c9c
    entry_key: 0536bd6efd96f5a40566a0a96526784299322c30d967b5a2f9a9813233b69ef2
  - object_id: AGG-GEO-C1-BASE-Q5-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-gemini.md
    content_sha256: af2f98410219dc6f68ff5b6d6c367561936e36bf781e00213aeacb0aafd7accb
    file_sha256: 117ef8d23589218827288ea1d4eef9b6e95840601b18f16e841d8290e3955010
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-gemini.md
    snapshot_sha256: 117ef8d23589218827288ea1d4eef9b6e95840601b18f16e841d8290e3955010
    entry_key: 067289982bd8b5c148e9370a6dfacdf12b5472ada6596bb39a29d1041bb24572
  - object_id: ARV-GEO-C1-BASE-Q5-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-1-reviewed.md
    content_sha256: d0094393865b5f15ff31df6db72808b0c4e0a47f7a7040cb6fe65494303e7b7e
    file_sha256: 095fc955bdcd7ce0b007073b9f58ea4df1b2c089d41341038f12682d06e15246
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-1-reviewed.md
    snapshot_sha256: 095fc955bdcd7ce0b007073b9f58ea4df1b2c089d41341038f12682d06e15246
    entry_key: 07833a77748b24ee21a0ac3ee48054b749154ad7ac6300d01b279f4950f16135
  - object_id: AGG-GEO-C1-BASE-Q4-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-perplexity.md
    content_sha256: b9c608548314177a8b42368f4d1734cca9be61ac4ff96d9a02695e58a78c04e1
    file_sha256: 19c9f7a5adb6cb6f254bf5b0ef3d80a8e8a2019f39cc782f2de8ef5d37f8eee0
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-perplexity.md
    snapshot_sha256: 19c9f7a5adb6cb6f254bf5b0ef3d80a8e8a2019f39cc782f2de8ef5d37f8eee0
    entry_key: 0b3a495138abc94ec236623395cd06c04d4234dc6ce803092c43e72f2a4601c0
  - object_id: ARV-GEO-C1-BASE-Q3-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-2-reviewed.md
    content_sha256: 9897b35b2d4f9c2ec0bb5933815c735afa0905823c27eb317931ffa33229e176
    file_sha256: 466ca2da7408e388087a4e0463493e5da7adc84ed7df09991b364a1125af6aec
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-2-reviewed.md
    snapshot_sha256: 466ca2da7408e388087a4e0463493e5da7adc84ed7df09991b364a1125af6aec
    entry_key: 0ce71468cd05e1e74ed7b7888038d8b4b9df27d4149ea76bba71bac8783f258f
  - object_id: SMP-GEO-C1-BASE-Q3-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f1a389a3422c3817bd37e20d96efd525e7a4af319b8346946f15c61064025dc1
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-gemini-1.md
    snapshot_sha256: f1a389a3422c3817bd37e20d96efd525e7a4af319b8346946f15c61064025dc1
    entry_key: 10e6f5ecd4920be2c05a4ca1bfaa1430abfd590a541fbbe9c5085261511d9e70
  - object_id: ARV-GEO-C1-BASE-Q6-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-gemini-1-reviewed.md
    content_sha256: cf0036b3ee7d4ba800b359f4e56508910d8096ac73e1bc5b2053916ea48a6d8d
    file_sha256: b907d232f6b0e2c41fefd596095af61874d8268b2d636887e88efd31f22e151c
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-gemini-1-reviewed.md
    snapshot_sha256: b907d232f6b0e2c41fefd596095af61874d8268b2d636887e88efd31f22e151c
    entry_key: 15afb6acf664abf6ec534656b34c9af5c9e7e1cc4a7cd1849b845f9aaa19beb6
  - object_id: AGG-GEO-C1-BASE-Q2-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-chatgpt.md
    content_sha256: 534b64945bab71fbace586527e153564e6d3a1185a82081ab03982e1cd315d5a
    file_sha256: ac9a294665ded5aa7ce16bc656b85b574f36f87d025e32520908d9dac68eae6e
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-chatgpt.md
    snapshot_sha256: ac9a294665ded5aa7ce16bc656b85b574f36f87d025e32520908d9dac68eae6e
    entry_key: 160387a9718735116acc6833222c2ac50d1a1e180167277251fc345bdb8bf9c1
  - object_id: ARV-GEO-C1-BASE-Q5-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-1-reviewed.md
    content_sha256: dc2582e94f51e3e685c7268d3f0e618addd93bd58ccc9cde6dad467c02b3a404
    file_sha256: bfbb9655f59f9d0882c6e833fee4fbbe7addbb8b7e5d95aedcf7c0172e87ff60
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-1-reviewed.md
    snapshot_sha256: bfbb9655f59f9d0882c6e833fee4fbbe7addbb8b7e5d95aedcf7c0172e87ff60
    entry_key: 166e162b66ff9f865e213ac58af9241034047e2d511c9d52307a74572d5624ed
  - object_id: SMP-GEO-C1-BASE-Q3-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 978f0533305d5a73295c80dae06aa6db7a09bbe548ba021be8a369682afc4b64
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-perplexity-1.md
    snapshot_sha256: 978f0533305d5a73295c80dae06aa6db7a09bbe548ba021be8a369682afc4b64
    entry_key: 2200e0525b67eba6e096035f20013e12f0e63d55e5809d6f5e85189e64aa0109
  - object_id: AGG-GEO-C1-BASE-Q2-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-claude.md
    content_sha256: 5826e4a69ee82495a5b2323f3dd5234e9c29a2036be7b24eb51350c702307197
    file_sha256: a62ccbfc012cfeb603facac3ff19e517483a87cd74f96632e71dfe8cc1864f94
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-claude.md
    snapshot_sha256: a62ccbfc012cfeb603facac3ff19e517483a87cd74f96632e71dfe8cc1864f94
    entry_key: 26692b40d02f1e53a9e53de753b99665c0869876ea84bc9adee1c5a19c0569b5
  - object_id: ARV-GEO-C1-BASE-Q5-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-2-reviewed.md
    content_sha256: 20fdf5230e708de10fe1eb6906189647be4c25fd957ffd71ad08cafedf99e957
    file_sha256: 7324dd2df3b1905abf980f7d536f99b750cc37f981e9e775848d7f87a904374a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-google-ai-2-reviewed.md
    snapshot_sha256: 7324dd2df3b1905abf980f7d536f99b750cc37f981e9e775848d7f87a904374a
    entry_key: 27eae6976f67720d1811b129e526140158b944b6f4ace5fd327b40329a4de07c
  - object_id: AGG-GEO-C1-BASE-Q6-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-chatgpt.md
    content_sha256: 4c5cbf23b6b81873dcacda438d18cfb897611feb3f523b7856556788e7b1a496
    file_sha256: 8e432543d6eda90870dab8b53aee36b7f45088de2b7670d2548fcbc35f032b68
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-chatgpt.md
    snapshot_sha256: 8e432543d6eda90870dab8b53aee36b7f45088de2b7670d2548fcbc35f032b68
    entry_key: 2a46c43b37f616d170eab557a69d8e207739146b5f3e063cdbdac0f2137d7195
  - object_id: SMP-GEO-C1-BASE-Q2-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: f949d0fd78f3ebd41d2b61fe32c43b7cb356e46be15058611146178ef0806dc3
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-gemini-2.md
    snapshot_sha256: f949d0fd78f3ebd41d2b61fe32c43b7cb356e46be15058611146178ef0806dc3
    entry_key: 2d52dd20caa7b19dc833c2f30b679ab98105262bff9cba7f79410ba28c00d529
  - object_id: ARV-GEO-C1-BASE-Q2-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-gemini-1-reviewed.md
    content_sha256: 45e6b3509435e79707a07ff65ec3f8341b9b08a67e39a1bfc81c7e050eaf059c
    file_sha256: 45494376e2c38d0246ab12931af5e9d66e496448f148adacab0eed8713b9f398
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-gemini-1-reviewed.md
    snapshot_sha256: 45494376e2c38d0246ab12931af5e9d66e496448f148adacab0eed8713b9f398
    entry_key: 2df55f6a7b88412e5dc44b48092b30808135aa11f9f157e6bc63b42b46098ecc
  - object_id: SMP-GEO-C1-BASE-Q2-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: b3823c88ffd08cae3a5bef99eaa8f510ad75b17b058c7045e7c1977df1edf4f4
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-1.md
    snapshot_sha256: b3823c88ffd08cae3a5bef99eaa8f510ad75b17b058c7045e7c1977df1edf4f4
    entry_key: 2e43beab44ad46fbfd1b6ed0478d4a7821ec1d5ac85cce34452a673b8398a967
  - object_id: ARV-GEO-C1-BASE-Q6-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-1-reviewed.md
    content_sha256: 52e5b605c252d877f6669118c1e7f911e5ca267d81f26259d1dd7ae551d2eddf
    file_sha256: 87345fe7756fab281efd6ce959674b43bce1e42cb3ea22f8ea044931d0f941cb
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-1-reviewed.md
    snapshot_sha256: 87345fe7756fab281efd6ce959674b43bce1e42cb3ea22f8ea044931d0f941cb
    entry_key: 2e4f948d63772470e6de476e5d1df3b30aac020bb653435003b1a0aca2321990
  - object_id: ARV-GEO-C1-BASE-Q5-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-claude-2-reviewed.md
    content_sha256: e87472d971d1148c530d0a3a19c4f7a4bc1b0bde23ce2cd97cb0becb669bbd86
    file_sha256: e52197b29c483101fbcb090e8265c1cfb3ab635a755649acc033e1f640fc3ef6
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-claude-2-reviewed.md
    snapshot_sha256: e52197b29c483101fbcb090e8265c1cfb3ab635a755649acc033e1f640fc3ef6
    entry_key: 2f331a36e64cee1ea0149a90300e6ace203e4a88a8020d2053aa28e24b2fa7f9
  - object_id: ARV-GEO-C1-BASE-Q3-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-2-reviewed.md
    content_sha256: 2e81306580b3ef418768e19bd50f2592d88643ce005774ac3c76149502d02294
    file_sha256: 489e620147cf9a1382059012c46c1c77527b52d5ac332bc69ecafc3cf9e06ce7
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-2-reviewed.md
    snapshot_sha256: 489e620147cf9a1382059012c46c1c77527b52d5ac332bc69ecafc3cf9e06ce7
    entry_key: 2f930b7c7f1e51a58f36ddc2b988269d2d384e6b3332adff0b066820116939ba
  - object_id: ARV-GEO-C1-BASE-Q3-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-gemini-1-reviewed.md
    content_sha256: 0a3ab34d11e8865d9f5dcdd6e7f6bc583655231cef7730519913ce208e91bb58
    file_sha256: 1b8d3847d3235db724fbc70241bcc122a2ce6540b9cd6170eb4116f5d5d78b30
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-gemini-1-reviewed.md
    snapshot_sha256: 1b8d3847d3235db724fbc70241bcc122a2ce6540b9cd6170eb4116f5d5d78b30
    entry_key: 30c278ecb26cb6083a5d2c7bbaf504611f1b7b3fcd038404246f13ffaaed763e
  - object_id: SMP-GEO-C1-BASE-Q5-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 510caac923b3d0ae2d37339b79d43c30f60f0fd801b484354bbc08a61166a8cb
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-perplexity-2.md
    snapshot_sha256: 510caac923b3d0ae2d37339b79d43c30f60f0fd801b484354bbc08a61166a8cb
    entry_key: 310cb3cece26df7390bbe41dabb0ad1c4097e52767657cd8334237a88bdd19e6
  - object_id: AGG-GEO-C1-BASE-Q6-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-perplexity.md
    content_sha256: 970b668c3f06a659a99fd34dc93448b8addc0540064b81b3c8551ccc282fe1fc
    file_sha256: 2f8cd32050a8b6684cdaea2b44739f67c9b4f1092ad19147c3403561a0e26181
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-perplexity.md
    snapshot_sha256: 2f8cd32050a8b6684cdaea2b44739f67c9b4f1092ad19147c3403561a0e26181
    entry_key: 3241b686b4c19701dfa748647004abaa1c0510c7a950dca8610410234d055fd6
  - object_id: AGG-GEO-C1-BASE-Q5-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-claude.md
    content_sha256: 7da029924603f75c7775c8cdf7a32d26dc822920d85ff25d6cf7961ab06717ca
    file_sha256: e63b736c49f7d2c32b7ab88af22cddb249e7c28fe27f52af597bcd90ede68f6a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-claude.md
    snapshot_sha256: e63b736c49f7d2c32b7ab88af22cddb249e7c28fe27f52af597bcd90ede68f6a
    entry_key: 32ce34a7ccc199335d28eabeb80bb70a794c90aaf11b2b7ee1512d70413239cd
  - object_id: ARV-GEO-C1-BASE-Q3-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-1-reviewed.md
    content_sha256: 30bea80029f8eaf7f1d7bee23f6090fcb12c255b5b71e13fb04e5e7fbab4ba32
    file_sha256: 42cb260fe4c6f05b2ac97375eb91f6913abd2e0ceb7a6e9698ac5fb02f5c64ac
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-google-ai-1-reviewed.md
    snapshot_sha256: 42cb260fe4c6f05b2ac97375eb91f6913abd2e0ceb7a6e9698ac5fb02f5c64ac
    entry_key: 33044d2acb5fc69f20d561fe6dbc4726fdce10d15c7e2a80f6fbf06a7d46fc0b
  - object_id: SMP-GEO-C1-BASE-Q1-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: d1dcefea1e7b7ae1e56aa0041713083adc4636f54e4c8c3c42376eeac05e438b
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-perplexity-2.md
    snapshot_sha256: d1dcefea1e7b7ae1e56aa0041713083adc4636f54e4c8c3c42376eeac05e438b
    entry_key: 34ae0ef32a9430333fce6a76c09576c981ef23aef53fae24b4dbd508f75a7b6b
  - object_id: SMP-GEO-C1-BASE-Q1-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 64f40928d279a9aae823d1e2c5a32143693a26df74cfcb52d19cef53c2bf18da
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-gemini-2.md
    snapshot_sha256: 64f40928d279a9aae823d1e2c5a32143693a26df74cfcb52d19cef53c2bf18da
    entry_key: 365fac8f6c10c2093f496a37816e96b19dadbaedf1772929099a7607a52d32cc
  - object_id: ARV-GEO-C1-BASE-Q4-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-gemini-1-reviewed.md
    content_sha256: b57bc28f79067b18c0aeaac5472b414708a1c269ababcb8d2838c10cbefee00c
    file_sha256: 78e1284886d44ee3d99ae8e72ce7ce9c67cae72f913da2d7ba75688da0dc5a42
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-gemini-1-reviewed.md
    snapshot_sha256: 78e1284886d44ee3d99ae8e72ce7ce9c67cae72f913da2d7ba75688da0dc5a42
    entry_key: 37565de9b2b7625f3ca1cc7c9799147de9dbccc2928acc41bafa598e411550ef
  - object_id: ARV-GEO-C1-BASE-Q2-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-claude-2-reviewed.md
    content_sha256: 485f914c3045883740c14af0c8109fa6fcddc6d621274b6372a66c5cae8b6b27
    file_sha256: 71bfcc9fb79c303866df014cf75d69c79de04ac6b5b587b90e96cee98a9ddd3a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-claude-2-reviewed.md
    snapshot_sha256: 71bfcc9fb79c303866df014cf75d69c79de04ac6b5b587b90e96cee98a9ddd3a
    entry_key: 38bc87232a0c3ae75893efffabf38e19ace72b24eb73320a662ab5a7e1e803ef
  - object_id: ARV-GEO-C1-BASE-Q5-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-2-reviewed.md
    content_sha256: a7773982a9014bfffcc76b0204674eae794f8737d8e58265aa80b91e8b769e39
    file_sha256: 81d103a67c22639e94999dea249b1a1ae91fd17dce68c2aaebff92c4a89e2716
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-perplexity-2-reviewed.md
    snapshot_sha256: 81d103a67c22639e94999dea249b1a1ae91fd17dce68c2aaebff92c4a89e2716
    entry_key: 39dcff3df8bdab3d4a817074bef567de16a09f94c16579890d2a2da5b5965efc
  - object_id: ARV-GEO-C1-BASE-Q2-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-1-reviewed.md
    content_sha256: cbb4a245702737d6708476132ceb781c72571ca0f2d828357f6c205760fb0de6
    file_sha256: e2c88d03527f6709f6d93854913f53da345e9f1285457e2c86371ed7550c5977
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-1-reviewed.md
    snapshot_sha256: e2c88d03527f6709f6d93854913f53da345e9f1285457e2c86371ed7550c5977
    entry_key: 3b088691980b036f60aec0a2fbebb46b552a0d198aaf2b40d87748c3229997a8
  - object_id: SMP-GEO-C1-BASE-Q2-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f7e2cd5e044e70a959d3bdf1f546ed9bda7f74b523ca7d93f1eca8ffbe8c37ec
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-claude-1.md
    snapshot_sha256: f7e2cd5e044e70a959d3bdf1f546ed9bda7f74b523ca7d93f1eca8ffbe8c37ec
    entry_key: 3be87a28975eded980f30e0c8233c10a3755b548d8388bfc25d26e4423a60dd0
  - object_id: SMP-GEO-C1-BASE-Q1-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 5b8891f588f7c8f1211ec383315ec15e4fbe1d2d55239b18e60f3947f67ab3b1
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-gemini-1.md
    snapshot_sha256: 5b8891f588f7c8f1211ec383315ec15e4fbe1d2d55239b18e60f3947f67ab3b1
    entry_key: 3c77077ffa6c92e23f5ea207b390c9aff4accde2ed17548c6f254f603bcd101d
  - object_id: ARV-GEO-C1-BASE-Q1-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-claude-2-reviewed.md
    content_sha256: 38a9d73fba79370172ec7735c6ff1314d34bfe372bfb3d876ab1544b35a503a7
    file_sha256: c5d1a22f86851841a60b07d91623ace89120d5b4813473d40ed44cf7c07052e1
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-claude-2-reviewed.md
    snapshot_sha256: c5d1a22f86851841a60b07d91623ace89120d5b4813473d40ed44cf7c07052e1
    entry_key: 3d3e28f304c4df01b922c0b3cd9613423ea43223481fb550fb6122bbf3c9af50
  - object_id: ARV-GEO-C1-BASE-Q4-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-1-reviewed.md
    content_sha256: 29832f1c3476262f88a0f491acba8237440fa3ed588482394358f6503eb405bb
    file_sha256: 1fab49e47fd100418a3bb81c6dada33a264fccf0d1ca043379b966caa3763385
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-1-reviewed.md
    snapshot_sha256: 1fab49e47fd100418a3bb81c6dada33a264fccf0d1ca043379b966caa3763385
    entry_key: 3e32093c013eb954420436f43b9ac5c6f323958b2cd2c258722e95e08c8a761a
  - object_id: SMP-GEO-C1-BASE-Q2-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 32b7d729a5572afca3711b3edd4cce17a8849740a25e14590845bb87405afa07
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-chatgpt-2.md
    snapshot_sha256: 32b7d729a5572afca3711b3edd4cce17a8849740a25e14590845bb87405afa07
    entry_key: 3fffecb253a6713fa073863e58b89a6b12ee80488e9d766ad68464a333654d45
  - object_id: ARV-GEO-C1-BASE-Q4-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-claude-1-reviewed.md
    content_sha256: 0ffd6464c097017181480d3b8db8d8da3f5e659962465cf00ea13b5c1627789b
    file_sha256: e9d9a61eb025313db6c9c48d6b95a9950e008119dfd67c82b6f8b0e4f60f08f7
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-claude-1-reviewed.md
    snapshot_sha256: e9d9a61eb025313db6c9c48d6b95a9950e008119dfd67c82b6f8b0e4f60f08f7
    entry_key: 43f950842f001980fcec54c563c9299db70f29a529dc79e631e0b238fb0e814c
  - object_id: SMP-GEO-C1-BASE-Q1-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 308a34cc06960eeca6f2e70510933dd5c3bfd3c80c4f8be3836c1dfb94ca98b4
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-google-ai-2.md
    snapshot_sha256: 308a34cc06960eeca6f2e70510933dd5c3bfd3c80c4f8be3836c1dfb94ca98b4
    entry_key: 4462d3331125b6de41d1bc32c87273816a85efa5a19458bb63f4f24c19836553
  - object_id: ARV-GEO-C1-BASE-Q2-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-1-reviewed.md
    content_sha256: c8796766a726ce3aa449b23db7a274e48218660f3a9076c371c30f4d2a2a1481
    file_sha256: 0e25aad5690e759b97f2880ee802ccb66533dfdd268994bd3a073d2bdb60d43e
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-1-reviewed.md
    snapshot_sha256: 0e25aad5690e759b97f2880ee802ccb66533dfdd268994bd3a073d2bdb60d43e
    entry_key: 48a84bb897d68cda6b58504713e7563a36df94ffc4ce50704cf9690dd4e5701f
  - object_id: ARV-GEO-C1-BASE-Q1-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-1-reviewed.md
    content_sha256: 90e55bcdd5bd454f9ccd7a873497353e7486fb77092b83ba5a2b1858916c275f
    file_sha256: 71b408e736fdd7b48b74f553eb6467e554d0bfef02c7107f08c615469ff5e3b4
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-1-reviewed.md
    snapshot_sha256: 71b408e736fdd7b48b74f553eb6467e554d0bfef02c7107f08c615469ff5e3b4
    entry_key: 498f5c68e0901d0eb88f751ee62b9df95eee2cba627f4b63e37a348477fd7da6
  - object_id: ARV-GEO-C1-BASE-Q6-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-claude-1-reviewed.md
    content_sha256: 8930d5de250da52e40b007ece92a9954d4203acfd6628c479addc017a4e519ff
    file_sha256: 1cef1b9cec845e5d0a8b70f4a78a64e9ae2e0d77c7854baa6f5be6c4b27ec4f7
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-claude-1-reviewed.md
    snapshot_sha256: 1cef1b9cec845e5d0a8b70f4a78a64e9ae2e0d77c7854baa6f5be6c4b27ec4f7
    entry_key: 49aa7eb564de3cea59872c39f7f7b3476220ef0be61360e2198aa000bdf4d9a1
  - object_id: AGG-GEO-C1-BASE-Q4-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-chatgpt.md
    content_sha256: 30fdb796d0f0bff026c4e15c98a3f37724a11d4d16a6ec86888c2e3c6ea6135d
    file_sha256: b10d0bb042fd4eb9d39699d8a0dce4b5e7a0193767b7a5dabe1183a50370d4cd
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-chatgpt.md
    snapshot_sha256: b10d0bb042fd4eb9d39699d8a0dce4b5e7a0193767b7a5dabe1183a50370d4cd
    entry_key: 4c573d9cdc9326e1b6b91e682f1e7fd5cf54111cb89676ca3cb53cb073ac2408
  - object_id: ARV-GEO-C1-BASE-Q4-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-claude-2-reviewed.md
    content_sha256: e88659f0409ec8eec1e199dd9cfb765dd863b23dd120bb764997f1a4adccc099
    file_sha256: da337f5e8e33ade76c9ff8856667c0b924aa2debc4dad49103b3508c84eff2b3
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-claude-2-reviewed.md
    snapshot_sha256: da337f5e8e33ade76c9ff8856667c0b924aa2debc4dad49103b3508c84eff2b3
    entry_key: 4f5f3616791dd8954b167ac84523701675c8de4bb6f79c4887532401124c11ee
  - object_id: SMP-GEO-C1-BASE-Q1-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 37e14a7bb47ac8660146382d6cf1416e7cc27f7c297f2f7196b29ff1befc1a63
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-perplexity-1.md
    snapshot_sha256: 37e14a7bb47ac8660146382d6cf1416e7cc27f7c297f2f7196b29ff1befc1a63
    entry_key: 4f8c0540c1322fe8da18e714aee60cd86dd4f37e8707b683d6bfdf1421433a1d
  - object_id: ARV-GEO-C1-BASE-Q2-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-claude-1-reviewed.md
    content_sha256: f72d9ebb404ba35178367fd6cb426dcc3a022ec901f20ac046bbc13ec55e9f5d
    file_sha256: 0f793a242e3fb0470be4289d0b185b1edd910ad4da5060a8e9160afe938e33c0
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-claude-1-reviewed.md
    snapshot_sha256: 0f793a242e3fb0470be4289d0b185b1edd910ad4da5060a8e9160afe938e33c0
    entry_key: 503841186c08f06bacce535e8924abe136da00445690e1943f71a5964c8313a2
  - object_id: SMP-GEO-C1-BASE-Q4-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: eb1e1ba16f0e4c75ee42ac56d2a0343094afe3a804282ff0f667c2fa33da11d2
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-claude-2.md
    snapshot_sha256: eb1e1ba16f0e4c75ee42ac56d2a0343094afe3a804282ff0f667c2fa33da11d2
    entry_key: 5195a5a58477f89ee4bf5f84c9d86c3a26f6c2ffdee9f4b580962e235bce4ba0
  - object_id: SMP-GEO-C1-BASE-Q6-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 3cdd2625add63918cbaac8c963a13f5cf2a65569a61e93d7cef91ad8dd5a032e
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-google-ai-2.md
    snapshot_sha256: 3cdd2625add63918cbaac8c963a13f5cf2a65569a61e93d7cef91ad8dd5a032e
    entry_key: 519a71e19c2fd7ced101415f3ee74d00607f062effd0ae3c954c5a0f4668b1a7
  - object_id: ARV-GEO-C1-BASE-Q3-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-gemini-2-reviewed.md
    content_sha256: 81e66b7d7ce8b1ab4f1029b7ad28a84e23e58a1624d772e840d3bbaef10fbd2b
    file_sha256: 62e190e43b363b87d8561855f42d1d3f14c93ef4d84dc3867e01afdfe0db5de6
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-gemini-2-reviewed.md
    snapshot_sha256: 62e190e43b363b87d8561855f42d1d3f14c93ef4d84dc3867e01afdfe0db5de6
    entry_key: 559e3d4af8b16d3455f3526d316b24a45d2fb1405636008de3c7d1daf9b9d8e4
  - object_id: ARV-GEO-C1-BASE-Q1-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-2-reviewed.md
    content_sha256: baa504a7809a6fdc5fd0eb42ded1892813a2932d24fe97ad41a21d5110571471
    file_sha256: 14b2a2f9ac3080332ab70946179c3f0d571b0d2ea179451f9ddb04779ea25d03
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-2-reviewed.md
    snapshot_sha256: 14b2a2f9ac3080332ab70946179c3f0d571b0d2ea179451f9ddb04779ea25d03
    entry_key: 5abc6804b1004a85bb3021ec0641b9dcbe29ce6b77828d0e6ea9e0dd07bd0a55
  - object_id: SMP-GEO-C1-BASE-Q5-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8d768e3ea95fd18d3698ffb86f851aaec37fb134b1132712d8d0c04aea8a5275
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-gemini-2.md
    snapshot_sha256: 8d768e3ea95fd18d3698ffb86f851aaec37fb134b1132712d8d0c04aea8a5275
    entry_key: 5c0e31539c1c7dc941822a57c7e4217fc672ea0457b7359057ec9393bdbe2c2a
  - object_id: SMP-GEO-C1-BASE-Q3-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: d5aef32a2894c405f27c009512a240b169474b7418bcac5fa840f03e37c10ba9
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-claude-1.md
    snapshot_sha256: d5aef32a2894c405f27c009512a240b169474b7418bcac5fa840f03e37c10ba9
    entry_key: 5e56d4bbc32767e1c1eb6a9d8e0751db601c61129aac96b3547d1e27c8e2812f
  - object_id: ARV-GEO-C1-BASE-Q4-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-2-reviewed.md
    content_sha256: 8056923fc91bdffb468d8dd5538cdb5321d8a589a477ccee51a49200ebaad05a
    file_sha256: 47e22641868fb9ae3fd897bc416bcf4276ae2f2d4d976932133219c9fa6fa4b4
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-chatgpt-2-reviewed.md
    snapshot_sha256: 47e22641868fb9ae3fd897bc416bcf4276ae2f2d4d976932133219c9fa6fa4b4
    entry_key: 5ead958c62ec945ace78025269c4a2e294a126080cf1fcdcef06483815d77b30
  - object_id: SMP-GEO-C1-BASE-Q6-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 33e64f93e0bfa217b933c4e0fd5247f074eec4b4e992db884a1e332554599bfd
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-google-ai-1.md
    snapshot_sha256: 33e64f93e0bfa217b933c4e0fd5247f074eec4b4e992db884a1e332554599bfd
    entry_key: 5f4e877ca200daabc9e141b7355efc9ba27dea3960ef526cf60c71f76a8f7adc
  - object_id: AGG-GEO-C1-BASE-Q6-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-claude.md
    content_sha256: d1fa51f626ead4cc5437385e22e8f5b5ee5bc5d5c7462a9ff46526258214cb67
    file_sha256: 8004b534cfc07a57b9ef2a6848d9a711b79c733ca004f61464b3c38b7af27095
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-claude.md
    snapshot_sha256: 8004b534cfc07a57b9ef2a6848d9a711b79c733ca004f61464b3c38b7af27095
    entry_key: 5fa8c391d80ff5fabdefccb3867baece90c444dc88f98a410ca50001237095a0
  - object_id: ARV-GEO-C1-BASE-Q6-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-2-reviewed.md
    content_sha256: 591465021a543076d839de1994b7551de40b2e6020a90f68b21353a0a7d0df53
    file_sha256: a3364d84c37c38613b572e3c201eff0b90b7cba8a9b7a98b3e649adfbf0b1b64
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-perplexity-2-reviewed.md
    snapshot_sha256: a3364d84c37c38613b572e3c201eff0b90b7cba8a9b7a98b3e649adfbf0b1b64
    entry_key: 5fce2b2d6b87d2a062ecc00168b9e37ef4ab9a18b16d8bf5b61d27f2ef54febe
  - object_id: SMP-GEO-C1-BASE-Q2-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: cda7cbbbc420b639b8290f6568c2beb95894e082a5b7f679800ab0fba28b4ee1
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-perplexity-1.md
    snapshot_sha256: cda7cbbbc420b639b8290f6568c2beb95894e082a5b7f679800ab0fba28b4ee1
    entry_key: 617726b90097f9c9c88ed82bf1d5af4da1992d0de10e776a354a52685bd13285
  - object_id: AGG-GEO-C1-BASE-Q3-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-chatgpt.md
    content_sha256: c9ed420102edafc557637c263a71be7c2c81ab2ee9c02f86daf739405053b26f
    file_sha256: 3adcd90563e895ea8d983786dc3e7bcdac0f8d225f3e9c54dcf00981e49d765a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-chatgpt.md
    snapshot_sha256: 3adcd90563e895ea8d983786dc3e7bcdac0f8d225f3e9c54dcf00981e49d765a
    entry_key: 630748aa20d3716fe6fbb85eac5f428b2d5103711904cb75a7cbd0aeaf63daed
  - object_id: SMP-GEO-C1-BASE-Q4-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 5e73f2625a76465b30ee5c91d2d09dce8d45bf2e0ea2f69d64cfd6444a1cde69
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-2.md
    snapshot_sha256: 5e73f2625a76465b30ee5c91d2d09dce8d45bf2e0ea2f69d64cfd6444a1cde69
    entry_key: 65892abe9ed7ec05061fc17b4bb9030812db952394c8275f13ae5df30deafec9
  - object_id: ARV-GEO-C1-BASE-Q3-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-2-reviewed.md
    content_sha256: a979cf4c8810f0f2ee88c98801b1238688a1ead97ad097b2fd1c01d20a51d4f3
    file_sha256: 13f7d51c6a5be5f7ceaf82e900b4231e1488eea98c8f4815c6603b061045214c
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-2-reviewed.md
    snapshot_sha256: 13f7d51c6a5be5f7ceaf82e900b4231e1488eea98c8f4815c6603b061045214c
    entry_key: 675cd13e66af486b0419320083d1fa87e285f1a14e1b061f78a628074670d37f
  - object_id: SMP-GEO-C1-BASE-Q3-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: a4d729c9ffa87f293f715ff38b415dec02e1bb99453c5095a2de9ee614fa316b
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-2.md
    snapshot_sha256: a4d729c9ffa87f293f715ff38b415dec02e1bb99453c5095a2de9ee614fa316b
    entry_key: 695b577ecc92cc4b92df4653bc8cc48012f902df9473e49dd38d6b664b139468
  - object_id: AGG-GEO-C1-BASE-Q3-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-gemini.md
    content_sha256: 7f5a14635340a5f5fe1ef4cdba75a1cd5bffe104d04053b785b08a9423d7f55f
    file_sha256: 923c8df4b25c4f4a7fb3da81fd04cc5761ed87bf1c7623256356112d99333484
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-gemini.md
    snapshot_sha256: 923c8df4b25c4f4a7fb3da81fd04cc5761ed87bf1c7623256356112d99333484
    entry_key: 6af6366b275d0710b4b9117f5c7a694e09e6dd6bdc6902fa076a48900b07585e
  - object_id: ARV-GEO-C1-BASE-Q1-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-gemini-1-reviewed.md
    content_sha256: 4496245a33c16a3e688ea0de440321d8002515d0ebcbc2776cc3c1229cfe93cc
    file_sha256: 4501d944468c100f87a5597eab049966be257156f8f16f97cba8b109ed89c493
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-gemini-1-reviewed.md
    snapshot_sha256: 4501d944468c100f87a5597eab049966be257156f8f16f97cba8b109ed89c493
    entry_key: 6c2ae317217ba5f77cd1838d88dcb5de37e5edff45a62f79e974ca5aafdbbc61
  - object_id: ARV-GEO-C1-BASE-Q2-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-2-reviewed.md
    content_sha256: 02aa70c8b1cc6ea7d55aabfb50b2d484d39a208da690a1bfa282d9ec73a2882c
    file_sha256: 51740a3cc985fb38783c9335f0fd3cb36ddd79f5a9c0181e4896ef853a2a7d00
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-2-reviewed.md
    snapshot_sha256: 51740a3cc985fb38783c9335f0fd3cb36ddd79f5a9c0181e4896ef853a2a7d00
    entry_key: 73d239aa91d57415f820b8f8b6745702a47b6571cb6bf96a33a9d7d31a7c9b9c
  - object_id: SMP-GEO-C1-BASE-Q4-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: cc75178222ff3fb97f7617ce3c874f37d95b2ceff93c4ae89faa2f90aa87a603
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-perplexity-1.md
    snapshot_sha256: cc75178222ff3fb97f7617ce3c874f37d95b2ceff93c4ae89faa2f90aa87a603
    entry_key: 742d4949a7cb838d777f40b82ce9b9a19f712935f7f2d026bc4b52573324fbcf
  - object_id: AGG-GEO-C1-BASE-Q5-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-chatgpt.md
    content_sha256: 8304174d4c4a6dd89094a5e1fffac81f7f5408c31702d82a88c53560cfbfb8b7
    file_sha256: b9be4679eea6d330f9f2fc062a94489ae78f2b2b7dee02cea04e4d5b730c46ab
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-chatgpt.md
    snapshot_sha256: b9be4679eea6d330f9f2fc062a94489ae78f2b2b7dee02cea04e4d5b730c46ab
    entry_key: 7704769ccfb16a1d5ce87e0928cfdcb447013d6231ef445f29a73fbf63c5f325
  - object_id: SMP-GEO-C1-BASE-Q1-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 8bdefb2f2014a8360f096440a38f6fa45d0018c45a0d2259204a13878fe470da
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-google-ai-1.md
    snapshot_sha256: 8bdefb2f2014a8360f096440a38f6fa45d0018c45a0d2259204a13878fe470da
    entry_key: 7753e406a6273d08cd28c36c4c322d33471466c8f8416c829687806292d43ae0
  - object_id: SMP-GEO-C1-BASE-Q5-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 0ec91f36305e6bc0e1f1597b174d52df545af14baf73752fff9c9091a7f4acfe
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-perplexity-1.md
    snapshot_sha256: 0ec91f36305e6bc0e1f1597b174d52df545af14baf73752fff9c9091a7f4acfe
    entry_key: 7b03c089da0c58653aaa473d12f2066f4aacd37f626c921ecf4c244dafe83917
  - object_id: ARV-GEO-C1-BASE-Q5-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-2-reviewed.md
    content_sha256: 40963eb7d341c56e3a01cd533933749d635c8386ef67d3ee37b46c6ac796d42b
    file_sha256: 2350b61d5efff0c33e7f5a49be5aa1526a39fc9cb8d00aa81cd5cbfa32ae5706
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-2-reviewed.md
    snapshot_sha256: 2350b61d5efff0c33e7f5a49be5aa1526a39fc9cb8d00aa81cd5cbfa32ae5706
    entry_key: 7ca8a9cf8f9d0346c95b219d8a527a340e00374c3b27b21de8346978ce75d2b5
  - object_id: ARV-GEO-C1-BASE-Q1-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-1-reviewed.md
    content_sha256: a286d96e7f25f9e0a1b8dedd3c44bcd4121511a3211362fb7b4b7bc36be949f5
    file_sha256: 33c9f1c220f9731f137c6e8048a8159540ee2078e3575de4242f1e138540fb15
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-chatgpt-1-reviewed.md
    snapshot_sha256: 33c9f1c220f9731f137c6e8048a8159540ee2078e3575de4242f1e138540fb15
    entry_key: 7ef16ec95704c141ba76962272f688b20df3f3cb0c224188e5e672ad7160a274
  - object_id: SMP-GEO-C1-BASE-Q4-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: b3d5e839de19cc4766f097a908491f2771a5d99c3120e58cbde70b3db50ffffd
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-chatgpt-1.md
    snapshot_sha256: b3d5e839de19cc4766f097a908491f2771a5d99c3120e58cbde70b3db50ffffd
    entry_key: 801de358f5ec4cc8e366ad85f9ba7269a8ef1e4cce092cd07659523fb7c7ecba
  - object_id: ARV-GEO-C1-BASE-Q4-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-2-reviewed.md
    content_sha256: 996d6133ee1d2e65df081f4ca724838400e43f333c770157a1a468a0150c7841
    file_sha256: c26feedb065c2c6cf78df8b007b9700791e6a3cb0168d3f68296ca2cbd08df19
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-2-reviewed.md
    snapshot_sha256: c26feedb065c2c6cf78df8b007b9700791e6a3cb0168d3f68296ca2cbd08df19
    entry_key: 8042ff865c76c5462c8cdf1d0e6c63f3f70119c08eb280569adce1cf34d1d8a0
  - object_id: ARV-GEO-C1-BASE-Q2-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-2-reviewed.md
    content_sha256: 3b3e8de9baaae1a18ad9afaac54a2b56c148fd8d6db11d9c2e1831ab30291937
    file_sha256: 50f8892c621c15ae23a282400377bcbff06a5b379fe966e3c0508bbb65208502
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-google-ai-2-reviewed.md
    snapshot_sha256: 50f8892c621c15ae23a282400377bcbff06a5b379fe966e3c0508bbb65208502
    entry_key: 8280df16a12ddf7a024eee63488d18e06dcfac58630b0751d12daf343bff749f
  - object_id: AGG-GEO-C1-BASE-Q1-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-perplexity.md
    content_sha256: 2795dde115402f526cbfeca54ac6c476421e3d64a312b097cec25748c502223b
    file_sha256: 6a13d8408862757a93d9fdbed331f923df9033940facb3b6a2174425ea8835a2
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-perplexity.md
    snapshot_sha256: 6a13d8408862757a93d9fdbed331f923df9033940facb3b6a2174425ea8835a2
    entry_key: 82ae39441142aaecb69a0745ec9009690e9a180b448bd5ce93e8da69151a585c
  - object_id: SMP-GEO-C1-BASE-Q5-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: d377a8b9c451e01b92e815fe40653986577729ae4a7989e91cd7456ba45cd171
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-google-ai-2.md
    snapshot_sha256: d377a8b9c451e01b92e815fe40653986577729ae4a7989e91cd7456ba45cd171
    entry_key: 830b7490829e873a3eb4e8d63e3532da5a35cf50b26c802f837ee2ba34ac3d86
  - object_id: SMP-GEO-C1-BASE-Q4-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 43262edd96e8f91c7a59daf1e2a3564a8ef5d492546f7da40ca8e2a51388d0de
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-claude-1.md
    snapshot_sha256: 43262edd96e8f91c7a59daf1e2a3564a8ef5d492546f7da40ca8e2a51388d0de
    entry_key: 8530a60105b19a15b7d495ffe1ff5dc1a4cb1114cbcebf74b7aeb4e082bf73dc
  - object_id: SMP-GEO-C1-BASE-Q5-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 59cc0f955be51e7d6b1bcc72991f8a54d0c94e497e5796f8d3ff6dfc0db4031f
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-claude-2.md
    snapshot_sha256: 59cc0f955be51e7d6b1bcc72991f8a54d0c94e497e5796f8d3ff6dfc0db4031f
    entry_key: 8aec931a17f2fcbc14730d2bbe26622133cea017aae06642ed1f075786d6643a
  - object_id: SMP-GEO-C1-BASE-Q5-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 9223c2477d4c946ae2214284872bb2fb0ed4c3cb0723b250461c273f45778105
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-gemini-1.md
    snapshot_sha256: 9223c2477d4c946ae2214284872bb2fb0ed4c3cb0723b250461c273f45778105
    entry_key: 8e03d0c3eee58832734f41de554a6e020bcb22a093ed1b5c2b78807a8f998e7d
  - object_id: ARV-GEO-C1-BASE-Q4-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-2-reviewed.md
    content_sha256: e1bd62780aa99a3b65894206789b0937578f97d36595e7ea1bbee75182968ff9
    file_sha256: c55b7d24c83b087b40798fac5aeed4b72698a07be71f693d4bb369188c51a223
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-2-reviewed.md
    snapshot_sha256: c55b7d24c83b087b40798fac5aeed4b72698a07be71f693d4bb369188c51a223
    entry_key: 90864d5f9e98e09f0360dda265da1efc8ea127cd64e971e5a05c14a5711a3dec
  - object_id: ARV-GEO-C1-BASE-Q2-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-2-reviewed.md
    content_sha256: eb2cc3c6428d100d669c31f2283255d439659a5477df7083383600536cf8aa41
    file_sha256: 6c07762bd039b9548c4a44fa35f753edfd5ac48d9c9ad26cca38eb09adac0a62
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-perplexity-2-reviewed.md
    snapshot_sha256: 6c07762bd039b9548c4a44fa35f753edfd5ac48d9c9ad26cca38eb09adac0a62
    entry_key: 919638b18bd6fe4d95060936336d9b6afb9239187d80ece5e6d4e36b66b26735
  - object_id: SMP-GEO-C1-BASE-Q1-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 617b98584fddac814104d8c633acdce607d4ca4f69fad6912f7853f5fce6c347
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-claude-1.md
    snapshot_sha256: 617b98584fddac814104d8c633acdce607d4ca4f69fad6912f7853f5fce6c347
    entry_key: 9316cc0983463ae770b2d4e75316575c4f68493cf9274e85bb8db4227435a491
  - object_id: SMP-GEO-C1-BASE-Q5-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: a0dab4cd29a1d9e9d12db7657bbc5bef81f82f90c1ddae3c8bfa4a705878de89
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-1.md
    snapshot_sha256: a0dab4cd29a1d9e9d12db7657bbc5bef81f82f90c1ddae3c8bfa4a705878de89
    entry_key: 949cf1be52191cdcd7b80700430b164c0fc1b925784514d14ac735937013adff
  - object_id: SMP-GEO-C1-BASE-Q1-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 37da8443e2641c83a6cff4505a5c68e5cdfca1390fc4dfa6ec2f00e323c55fee
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-1.md
    snapshot_sha256: 37da8443e2641c83a6cff4505a5c68e5cdfca1390fc4dfa6ec2f00e323c55fee
    entry_key: 9531c513db7354a2de554a117616503405732ea9b08c31505e8f1faf3be434ad
  - object_id: SMP-GEO-C1-BASE-Q6-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: f35fa4ede7240add889afe66285075304df7897afed578d86865a8a151d0c256
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-gemini-2.md
    snapshot_sha256: f35fa4ede7240add889afe66285075304df7897afed578d86865a8a151d0c256
    entry_key: 95854eada651375e3ecf1722421ebb26a25c27e57e1368031dcd51d800a641c2
  - object_id: SMP-GEO-C1-BASE-Q3-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: b8bd4fe54f6bf7888833e7d10c7e2afb9f57afbf7943dff9ab90c2508481aaae
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-google-ai-1.md
    snapshot_sha256: b8bd4fe54f6bf7888833e7d10c7e2afb9f57afbf7943dff9ab90c2508481aaae
    entry_key: 980b9660d7501958eec3f77a4cac0a293ef030f1e54b94ff2d164a952262d7d4
  - object_id: ARV-GEO-C1-BASE-Q1-PERPLEXITY-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-2-reviewed.md
    content_sha256: 127eb883afc168d1700d2cdee749f3ae58bf40fed7ec97ce2a68bc1b6b79ebd9
    file_sha256: fba0519fbc96c670acf37ed81e6f480684e9bfa49ea65b45cd3047a7de2458e8
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-perplexity-2-reviewed.md
    snapshot_sha256: fba0519fbc96c670acf37ed81e6f480684e9bfa49ea65b45cd3047a7de2458e8
    entry_key: 99bdf0aa82aa39ac62fd03627160268982aabb285f72d8c8c508f61109595f95
  - object_id: SMP-GEO-C1-BASE-Q2-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: ad99d03a124ea8af3b951f03f0a1ecd62b11fcaf596604589710d6c82f570ad2
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-claude-2.md
    snapshot_sha256: ad99d03a124ea8af3b951f03f0a1ecd62b11fcaf596604589710d6c82f570ad2
    entry_key: 9b5545e3b8c7351290fa2de2418242c523528b4d62c2967401c6dae2f60b4e80
  - object_id: SMP-GEO-C1-BASE-Q1-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 6600e36539cfb5526bcb65964f19d07c47cb06a2b57b02ba6258212095114596
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-claude-2.md
    snapshot_sha256: 6600e36539cfb5526bcb65964f19d07c47cb06a2b57b02ba6258212095114596
    entry_key: 9f97de714ebffa16a11032ee010b76f04e0dcb1619583b75ef614739edeb84b0
  - object_id: ARV-GEO-C1-BASE-Q3-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-claude-1-reviewed.md
    content_sha256: 237cf18448497d479b44166717005ff2ef3f80255606af26f32630db66aaf270
    file_sha256: f3c919bc1b500944d55eaf0aaeebd8f656ef049acd2774ec4e1b92d8b4d29e40
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-claude-1-reviewed.md
    snapshot_sha256: f3c919bc1b500944d55eaf0aaeebd8f656ef049acd2774ec4e1b92d8b4d29e40
    entry_key: a1ce8a02280829684b52cc30aaa7edc3a479c2143661382b06bb66161744fbf0
  - object_id: AGG-GEO-C1-BASE-Q6-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-google-ai.md
    content_sha256: c9435a0871c584b6e2a6a011f9fe68a330ebc14d7790343c70f5c3b4897f6e8d
    file_sha256: 4a5f81cc140ba7601aa25f6f1ae9ac23aee8684d084b1c86b203ed9f25d2610d
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-google-ai.md
    snapshot_sha256: 4a5f81cc140ba7601aa25f6f1ae9ac23aee8684d084b1c86b203ed9f25d2610d
    entry_key: a21696ebb1aac17a41fde3d2a2e22f1bb84b4254148f392495457c3821aa6ecf
  - object_id: ARV-GEO-C1-BASE-Q6-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-1-reviewed.md
    content_sha256: 891e11fbd93f78dc4824813c75cc3cdf6e3a68a36b5a0440998b078a0de2589f
    file_sha256: 822e818987a6f8e7bd9ddae4ee46111af8ccdd1caadebaac1ef72dd1fbdd75c7
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-1-reviewed.md
    snapshot_sha256: 822e818987a6f8e7bd9ddae4ee46111af8ccdd1caadebaac1ef72dd1fbdd75c7
    entry_key: a312234c8624ce7d11c9d6a53b7904b787121f8c65602b3cda9c669431e4f4d9
  - object_id: ARV-GEO-C1-BASE-Q4-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-1-reviewed.md
    content_sha256: 80a183abbd5893c531b2868e41dee518373a8d39b1c3a5640deb3be918e96467
    file_sha256: 28fe10e846e6a6f4ad4d4770098983446b6576dbdd257c97bc3eb7f03ec748aa
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-perplexity-1-reviewed.md
    snapshot_sha256: 28fe10e846e6a6f4ad4d4770098983446b6576dbdd257c97bc3eb7f03ec748aa
    entry_key: a4bac9d998dc0bc868f39448911b6d6348bf71861a13b0b8f8bd73f43185b455
  - object_id: ARV-GEO-C1-BASE-Q5-GEMINI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-gemini-1-reviewed.md
    content_sha256: 222a5b2575c5a3efd4f970f497e94f29b6193201a494a33f6b86e3d21732c2b3
    file_sha256: c865c5bfcbe07b3d87243220fb8c9fdf5ef5abcd1082246813cf61ca541d6668
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-gemini-1-reviewed.md
    snapshot_sha256: c865c5bfcbe07b3d87243220fb8c9fdf5ef5abcd1082246813cf61ca541d6668
    entry_key: a550a338e22294b67fe9289f3bdac5e8546d05136fc275f7b482e5513f82a214
  - object_id: ARV-GEO-C1-BASE-Q2-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-1-reviewed.md
    content_sha256: 462c30cc944f95a506a9303a57e2ca4738f2ba9ed2d7e39f74d704d997498617
    file_sha256: 9bfff99733d21f7445127f3c06cd72f77d599ad6cca761c935115f9bca7a0ec4
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-chatgpt-1-reviewed.md
    snapshot_sha256: 9bfff99733d21f7445127f3c06cd72f77d599ad6cca761c935115f9bca7a0ec4
    entry_key: ac6045e0771ec8031689858e79624527f7f371b7cee7f75a1a66caf36b5c4973
  - object_id: AGG-GEO-C1-BASE-Q2-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-perplexity.md
    content_sha256: 58cf292e19536409fca3056c2ce9c1eff2c6b2a44cc7fb78657ee6f3a28bbe5c
    file_sha256: 889a24bd21e8fef7488214ea3dce791b48c8ac549510367889a4a9dae2e844b6
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-perplexity.md
    snapshot_sha256: 889a24bd21e8fef7488214ea3dce791b48c8ac549510367889a4a9dae2e844b6
    entry_key: ad0ea0e0569d79e0cfd3741444c6658b49c1f9d20e33ce5f51be0ffd835b8d57
  - object_id: ARV-GEO-C1-BASE-Q5-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-gemini-2-reviewed.md
    content_sha256: 2cbf1803f0cc87cb5dc67426d6aa834db17efa3ae0ff4f4cc5abecf7312862b7
    file_sha256: 178b9e220e999304a9d1211fb760eb9063255f594e37cef08723120b935a374a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-gemini-2-reviewed.md
    snapshot_sha256: 178b9e220e999304a9d1211fb760eb9063255f594e37cef08723120b935a374a
    entry_key: ad6671ce8afa35ba8817c37b6e8df6cfe781e3333e6feabb9eae7ab0cd532035
  - object_id: ARV-GEO-C1-BASE-Q6-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-claude-2-reviewed.md
    content_sha256: 0049553ff019af54607529496731b0d31cddd6b944937ab6912bc98189d35c8f
    file_sha256: f89a5c34a623e1c0a6226a09183a49a75387d7282815aac35aafb01fe74a6e14
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-claude-2-reviewed.md
    snapshot_sha256: f89a5c34a623e1c0a6226a09183a49a75387d7282815aac35aafb01fe74a6e14
    entry_key: ae1b2acccb83bbb9b5ac1c3d42fde4408f00684a9f702f59698ec860d2f6be25
  - object_id: ARV-GEO-C1-BASE-Q1-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-1-reviewed.md
    content_sha256: a072f5227705966c2550a360f99bab2f39eb918d753ff69a9a51269b276ec4fa
    file_sha256: d47bb826fa3c6b968295734b6daa582926b52a0d67f3eb86d39e4f5f55aa3a12
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-1-reviewed.md
    snapshot_sha256: d47bb826fa3c6b968295734b6daa582926b52a0d67f3eb86d39e4f5f55aa3a12
    entry_key: aebbfa0d229e366385333c3602ef76fafe4e5106b37f3ba1f31fc0138b76b554
  - object_id: SMP-GEO-C1-BASE-Q6-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 61d47b0c91afa97a6ab55e7bc346b6842d0ef6256e60824758596cb4a3f2ba75
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-1.md
    snapshot_sha256: 61d47b0c91afa97a6ab55e7bc346b6842d0ef6256e60824758596cb4a3f2ba75
    entry_key: b33d6c0c76c610201488190881dcc82c3f19d784a4d16e534e57f4beb69f52b4
  - object_id: AGG-GEO-C1-BASE-Q1-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-google-ai.md
    content_sha256: a1dece7b6d2784b5b72f035814fe619a93e99ed492b675ab6ac35bd45e9c6def
    file_sha256: 556a12ef478013606246a226d25b310580ec444151055387ab26db48344863c0
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-google-ai.md
    snapshot_sha256: 556a12ef478013606246a226d25b310580ec444151055387ab26db48344863c0
    entry_key: b4ef8b69c04dedb87869f1527ce2b5f31e67566c1fee35367e09bcee0884155b
  - object_id: AGG-GEO-C1-BASE-Q3-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-perplexity.md
    content_sha256: 6df58421fdc2aa8d04a46d1a346f0214cee3183c881e775de542bcbdcf730fd6
    file_sha256: d70168f35f130c7284691001cf9be0ce5d4a15a62e8f7a6c5c625160a6155541
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-perplexity.md
    snapshot_sha256: d70168f35f130c7284691001cf9be0ce5d4a15a62e8f7a6c5c625160a6155541
    entry_key: b6eb5cf49751348a48e0f6d50464381d7f7312b4228dc2c98313c066e824b234
  - object_id: SMP-GEO-C1-BASE-Q2-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 761993c3d99a9eb147c60fc0448df6bf849cb94930d08928e4a5d32d3cf37b29
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-google-ai-2.md
    snapshot_sha256: 761993c3d99a9eb147c60fc0448df6bf849cb94930d08928e4a5d32d3cf37b29
    entry_key: b921cf261c9e91c9587fcb327bdaab078f1d27c07a5f69b91b0ea5cf0eaffaef
  - object_id: AGG-GEO-C1-BASE-Q5-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-google-ai.md
    content_sha256: 50092fa9c4168904f6242f78e9b4bee6e690fb77b52a9a371b5bfa8b2dab87dd
    file_sha256: 3d0203e7b8d0085727aab6f94afa7969f196167ff9fcce22b2430f8dc95c53b9
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-google-ai.md
    snapshot_sha256: 3d0203e7b8d0085727aab6f94afa7969f196167ff9fcce22b2430f8dc95c53b9
    entry_key: b99b2a449ac6fa39b75a871940129816a557ae95cf6ad6943b5801696502dec3
  - object_id: ARV-GEO-C1-BASE-Q4-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-gemini-2-reviewed.md
    content_sha256: e45de9cad88774ecde42146e614bc33881c47378eeb421b9947038087840a13f
    file_sha256: 094336f31c91fbcd9570b3f34ceecb6c024df26ca9691aa28ebb41081dab6e3c
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-gemini-2-reviewed.md
    snapshot_sha256: 094336f31c91fbcd9570b3f34ceecb6c024df26ca9691aa28ebb41081dab6e3c
    entry_key: bb3d0d54b30707a04f4b4a1249bc289641972bd9209cff56812bf03720434993
  - object_id: SMP-GEO-C1-BASE-Q3-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: a3c824f36e8d1c4796b03c123ec979a5eb93cc020e5e0024b9fdd8823ead3a64
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-claude-2.md
    snapshot_sha256: a3c824f36e8d1c4796b03c123ec979a5eb93cc020e5e0024b9fdd8823ead3a64
    entry_key: bb4869478c4d36acbf6bd2eb40718b0e5b4865a1fdb2374cc01adb1423221ae8
  - object_id: ARV-GEO-C1-BASE-Q3-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-1-reviewed.md
    content_sha256: 8270577a276360e31fd4d992082b5fc3bcf38ef18afd32c97bf015b7a0c64c1e
    file_sha256: c6d32213d134fcccc745b0a30758ccdc46492f82cd93234d43c577a1ff8ccb5e
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-chatgpt-1-reviewed.md
    snapshot_sha256: c6d32213d134fcccc745b0a30758ccdc46492f82cd93234d43c577a1ff8ccb5e
    entry_key: bc5b99957294fab6f3ba28e644eca2d4852ed4383d189359e0933465207bba76
  - object_id: SMP-GEO-C1-BASE-Q6-CLAUDE-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-claude-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4211038dffdc7f916e914ea580d69bdbe659ca71808e9eb04c6aa5556f85678b
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-claude-2.md
    snapshot_sha256: 4211038dffdc7f916e914ea580d69bdbe659ca71808e9eb04c6aa5556f85678b
    entry_key: bdb13f5e492c57f8324260a2f30f11708dacdaf0ab28888f616de6a8abf0dffb
  - object_id: SMP-GEO-C1-BASE-Q6-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: b5179fdb1b331acc3c9e4e9eb6631cc6953e452023d969307b817b90908e4b38
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-perplexity-2.md
    snapshot_sha256: b5179fdb1b331acc3c9e4e9eb6631cc6953e452023d969307b817b90908e4b38
    entry_key: be4ab0c215c73520ac11b33b1c9e77cfc1edaf6a17138a722bb6d2214fdff197
  - object_id: ARV-GEO-C1-BASE-Q6-CHATGPT-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-2-reviewed.md
    content_sha256: 3f46964610dd5aec3ce700d88c82a330ce25b43deb65f908a76c3e0cd069a67b
    file_sha256: dd9207cc20138679d4375c183d6b42809eeda4a6644a3f3cab8a6b9c321bcceb
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-2-reviewed.md
    snapshot_sha256: dd9207cc20138679d4375c183d6b42809eeda4a6644a3f3cab8a6b9c321bcceb
    entry_key: bf0f0f6b4f986e33cc3e885c15c411b93930c29081386d8e1ef36dc406a11bd2
  - object_id: ARV-GEO-C1-BASE-Q1-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-gemini-2-reviewed.md
    content_sha256: 63a3e2d80bb27923dd05810bdd2d2aad7779509eac2ab272c48eb8595ef8587c
    file_sha256: c401469508863c943584c69ba66d6b7ca3466c9a6c5dfe2f89a3ff7d8e6fa281
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-gemini-2-reviewed.md
    snapshot_sha256: c401469508863c943584c69ba66d6b7ca3466c9a6c5dfe2f89a3ff7d8e6fa281
    entry_key: bf65e702f6d6cbf0014c8e7003582a89f5fa0599b5d59817926f0182ab682719
  - object_id: ARV-GEO-C1-BASE-Q5-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-claude-1-reviewed.md
    content_sha256: 845cdbe97e8f6be765ae83844337e4f829a07398c3e731fe6638e68d2d0e9732
    file_sha256: 2c240b6c714ad17e8621aa8ad0cb8e2dd7f2540d8773d476813e09861562a9cd
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-claude-1-reviewed.md
    snapshot_sha256: 2c240b6c714ad17e8621aa8ad0cb8e2dd7f2540d8773d476813e09861562a9cd
    entry_key: c018a2165690e06b64a0f0489013ef8c5c0baa5a931dfe12890bb9c97130f8bf
  - object_id: ARV-GEO-C1-BASE-Q5-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-1-reviewed.md
    content_sha256: bd3b2a6f76e78ba1089165c59afdcc4594877a06e82a1839a6fe09c0ddbebce6
    file_sha256: b10416061fbc78a1647c7ee2f4fb6b4001f48dea1b5bd516672fe997910ec238
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q5-chatgpt-1-reviewed.md
    snapshot_sha256: b10416061fbc78a1647c7ee2f4fb6b4001f48dea1b5bd516672fe997910ec238
    entry_key: c0cbac4559335fce9600abda8bd93724934ef546596afbd3c2d1861eedf89a51
  - object_id: AGG-GEO-C1-BASE-Q2-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-google-ai.md
    content_sha256: fef2b265fd814c119ce39cdc80ec8503f2359bb2a75a19cde960ead5cdea1c07
    file_sha256: ed655c9a4d3609df8d6613911c48cd6bedbfe971ae6e15867c6371a73bb17567
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-google-ai.md
    snapshot_sha256: ed655c9a4d3609df8d6613911c48cd6bedbfe971ae6e15867c6371a73bb17567
    entry_key: c141235ebe708549a4e00ee2a852fe9b0ad137b6d49ea9144069b48742a55034
  - object_id: SMP-GEO-C1-BASE-Q1-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 4b679b58d86a52c69c0cb875214fdb4d596b92dbe148b958b311fa1f157adc2d
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q1-chatgpt-2.md
    snapshot_sha256: 4b679b58d86a52c69c0cb875214fdb4d596b92dbe148b958b311fa1f157adc2d
    entry_key: c1d4024f46fa3ea61249efbfd0e568625f224909bca460e472b5197197078ed6
  - object_id: SMP-GEO-C1-BASE-Q5-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: be38756e8472c3badcf6b810fda8498a07b26fbf947d614c746e923f41392735
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-claude-1.md
    snapshot_sha256: be38756e8472c3badcf6b810fda8498a07b26fbf947d614c746e923f41392735
    entry_key: c226052658096056dc2d0fde9b6faf9a94f0c72e93e8d8d78ea87f10f4160889
  - object_id: AGG-GEO-C1-BASE-Q1-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-gemini.md
    content_sha256: c1a5c6684deb40657d6ebda9da4f4dd760d8efc61995a96557d116d5dd6cf2be
    file_sha256: a8340543543269721ddea8b9a1f04f16da33731277e482f8d5613acf411ddbb8
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-gemini.md
    snapshot_sha256: a8340543543269721ddea8b9a1f04f16da33731277e482f8d5613acf411ddbb8
    entry_key: c2acec8cd640570334c6044a2338ed78f1ff19009dbe785b7a3cce4c4c86df9d
  - object_id: SMP-GEO-C1-BASE-Q4-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: bc1c8e83d902b2fdf95d7cc7217d27d34abe297e4c3d83b372b5cacbef3358ea
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-google-ai-1.md
    snapshot_sha256: bc1c8e83d902b2fdf95d7cc7217d27d34abe297e4c3d83b372b5cacbef3358ea
    entry_key: c3919bbd2024019330ac5b216a12013d41ba2e5856c354315bb3e8af99aa5ce3
  - object_id: SMP-GEO-C1-BASE-Q4-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 81f3a0e19330f26cbedcbda3781c136b52429c65bd9ca64f28af6481ad035c89
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-gemini-1.md
    snapshot_sha256: 81f3a0e19330f26cbedcbda3781c136b52429c65bd9ca64f28af6481ad035c89
    entry_key: c89f38a9a2974abf10bc3847464aad7c22194fc511acd7554cd1a95f19c871d1
  - object_id: SMP-GEO-C1-BASE-Q3-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 5350d8048a8142b6fa19fbb2416b6599319c5e575f2c526d8a6baabd79088f9c
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-perplexity-2.md
    snapshot_sha256: 5350d8048a8142b6fa19fbb2416b6599319c5e575f2c526d8a6baabd79088f9c
    entry_key: ce9eed4e58abb505fcc17a7f5e975b028df6c38abd816091d1a9f65aa5ea569e
  - object_id: SMP-GEO-C1-BASE-Q6-PERPLEXITY-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-perplexity-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 7afdb332cf633af8feff4fef1ce7db5d1a30ccc02c0530382f0cadb7cccc2d1d
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-perplexity-1.md
    snapshot_sha256: 7afdb332cf633af8feff4fef1ce7db5d1a30ccc02c0530382f0cadb7cccc2d1d
    entry_key: cf6469dd56994ceb410e1a53a5b2974f75fc1f284e9bf2277f389d778f2c6d84
  - object_id: SMP-GEO-C1-BASE-Q2-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 17c5b1cdbd62b7cfa5c42e45baadfd07881b8e530fed5a4b7b924a4a67d45065
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-google-ai-1.md
    snapshot_sha256: 17c5b1cdbd62b7cfa5c42e45baadfd07881b8e530fed5a4b7b924a4a67d45065
    entry_key: d02ddca85e09dd809e8b3375fbabc4e219cb346e17067623c855928e5de4f0ed
  - object_id: AGG-GEO-C1-BASE-Q1-CHATGPT
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-chatgpt.md
    content_sha256: e1d39810eca2bfe7a63359760b061c6c1b590aa30968da73b984769d38d6fb2c
    file_sha256: 95bce431b89678aaf8150a5a146a84af6d3e9d3ea6d3bf46e1670ba9658f5879
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-chatgpt.md
    snapshot_sha256: 95bce431b89678aaf8150a5a146a84af6d3e9d3ea6d3bf46e1670ba9658f5879
    entry_key: d1be40590ee38155e7e273d5ab2f9b4cbe62bfcba2f78f73b5acf9b32b260f3a
  - object_id: AGG-GEO-C1-BASE-Q4-GOOGLE-AI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-google-ai.md
    content_sha256: 3bbbc69d0b42a0960fef9361378ed3c4bbcddffe1abb65fa43d4a3cef99eaaeb
    file_sha256: 5c7bed2a19c198a56eeabef6e6b5b7670c31b5a9bb0bf06f69809793665c7576
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-google-ai.md
    snapshot_sha256: 5c7bed2a19c198a56eeabef6e6b5b7670c31b5a9bb0bf06f69809793665c7576
    entry_key: d3e0836a4a999bb1a2c8631e9617c26a9f084bdb34ddec5df3fa0fee033b4349
  - object_id: AGG-GEO-C1-BASE-Q1-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q1-claude.md
    content_sha256: ec18a5665c312f143c275fc8490188c9f876f1ec19912d39b56bf747a1102689
    file_sha256: 270f5b786aafc15e3e7be5556f728af52d56e1ea0f5c8a7db728f0215b540965
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q1-claude.md
    snapshot_sha256: 270f5b786aafc15e3e7be5556f728af52d56e1ea0f5c8a7db728f0215b540965
    entry_key: d4006af619e47a907e77107888a0dc919b37c890ae5196c9d3deb19648c374d1
  - object_id: AGG-GEO-C1-BASE-Q4-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-claude.md
    content_sha256: 53c690af183de2d75274176deea4b23de4147ece6026976f5c7a951454dbe2e1
    file_sha256: 34a551ee723689879c4c2a2a0712c0a3334efb3201e1bff36e249b29bf4ac29a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-claude.md
    snapshot_sha256: 34a551ee723689879c4c2a2a0712c0a3334efb3201e1bff36e249b29bf4ac29a
    entry_key: d56342eadf32a295da1ecbd29e85808210d8f9efe20ef07570b938fbf9f5d17b
  - object_id: SMP-GEO-C1-BASE-Q6-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: ac38ffa8c3ee057e6c4d97e3ea86095d27b389e2dff6295efb8f651c0e61c99e
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-chatgpt-2.md
    snapshot_sha256: ac38ffa8c3ee057e6c4d97e3ea86095d27b389e2dff6295efb8f651c0e61c99e
    entry_key: d63e3c68d9458bdcd0a2743d4f29e00f7dbda881552f9c700679aaade4a095cf
  - object_id: SMP-GEO-C1-BASE-Q6-CLAUDE-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-claude-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: f85aeec7f8113d0fa1846c9a90cf0110fb04ff63591bfa9f93a4054494b26511
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-claude-1.md
    snapshot_sha256: f85aeec7f8113d0fa1846c9a90cf0110fb04ff63591bfa9f93a4054494b26511
    entry_key: d8cb4813c783bcb7d75f4170f72e6a6f388577a5a7706c63a5a8f9efb0161ecb
  - object_id: ARV-GEO-C1-BASE-Q6-CHATGPT-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-1-reviewed.md
    content_sha256: b922c3a60a7fd6ec23cd9606548b25f4a948537edf90eeb1c3e6c8075678df8d
    file_sha256: e464699345d33f998498bd724ced8840883b8d37685b0abb007f5b2a10c0686c
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-chatgpt-1-reviewed.md
    snapshot_sha256: e464699345d33f998498bd724ced8840883b8d37685b0abb007f5b2a10c0686c
    entry_key: dd690c10499f392c6542d834ab061dc0b8e9f90d9c0df777447b3618caa0bb76
  - object_id: SMP-GEO-C1-BASE-Q3-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 329f5d3e4ec9a8999d2b367b712dac68b976a89cb5405b1efea581dec5ffc08e
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-gemini-2.md
    snapshot_sha256: 329f5d3e4ec9a8999d2b367b712dac68b976a89cb5405b1efea581dec5ffc08e
    entry_key: e0c03e33ae139e2418ea1ef82984d21472d3a0310ab36025370b090d97a51bc8
  - object_id: SMP-GEO-C1-BASE-Q4-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 5637f571cf289c95ec18ed5e75a6720277fba4469ff2f4b890914c88f5639851
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-google-ai-2.md
    snapshot_sha256: 5637f571cf289c95ec18ed5e75a6720277fba4469ff2f4b890914c88f5639851
    entry_key: e214d1af8734d3b756eae5f6363c411c5d41ef8ab8c9832f1068e12f039958b7
  - object_id: ARV-GEO-C1-BASE-Q1-CLAUDE-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-claude-1-reviewed.md
    content_sha256: b2ae294a520de7e40c2cea6928a3e36ad62a270de8975fc92bd1f64748397655
    file_sha256: d4773a9aefd86c52ce2eb0f91adf7f8310468d265003c8731064187db396b6ff
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-claude-1-reviewed.md
    snapshot_sha256: d4773a9aefd86c52ce2eb0f91adf7f8310468d265003c8731064187db396b6ff
    entry_key: e2d202bc7cc9bd461f4116ffbd0a76c70833494d39f80778b42b56f9bfb20dd3
  - object_id: AGG-GEO-C1-BASE-Q5-PERPLEXITY
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q5-perplexity.md
    content_sha256: b937b064201e431264bd66a64b64adf0cbd2f6e3e84afb1d5118f6f4cfe6d7af
    file_sha256: ed425c29af645def0b3c8417c7cf4b7095fa69963f1079e3943ee0227d56d492
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q5-perplexity.md
    snapshot_sha256: ed425c29af645def0b3c8417c7cf4b7095fa69963f1079e3943ee0227d56d492
    entry_key: e3102c62623b36d1b38f0588ea7634ca5b62327e2ea95313e02b7454f342d86a
  - object_id: SMP-GEO-C1-BASE-Q2-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 0f82462b5e553911875bfe9d2c20a1824ca5ec0e8f82710203127d8681ca8d12
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-perplexity-2.md
    snapshot_sha256: 0f82462b5e553911875bfe9d2c20a1824ca5ec0e8f82710203127d8681ca8d12
    entry_key: e3b4d1d7c5ddf31f71cf3f01a09eb8b9248649b064f9a35043414018442b3a17
  - object_id: ARV-GEO-C1-BASE-Q2-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q2-gemini-2-reviewed.md
    content_sha256: 9c919a73d7fa4512d9c52a6a58b2d26f0613fac646b5f40d831b8d90cd46e327
    file_sha256: 50c06a3f2b5822836ea184125b79ed16260a89890403262c5a726c31545c3855
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q2-gemini-2-reviewed.md
    snapshot_sha256: 50c06a3f2b5822836ea184125b79ed16260a89890403262c5a726c31545c3855
    entry_key: e71086e7a1851da4d32cdc8e5786394470e80464a403cffb33a4bfab6c0dc45b
  - object_id: AGG-GEO-C1-BASE-Q2-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q2-gemini.md
    content_sha256: dbc14e451934504b73c27db172d11092b8df1e05897afd34ef8ee10ddb5acc9f
    file_sha256: a4f8ceee6365fc94e3ccfddf1701e398e6a316dbf76ccf89f3960bb381f15b8f
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q2-gemini.md
    snapshot_sha256: a4f8ceee6365fc94e3ccfddf1701e398e6a316dbf76ccf89f3960bb381f15b8f
    entry_key: e7ab7b12da0f0e1064f73b7fdb85ba344c86e861aba001f1a7e129293753ad4e
  - object_id: SMP-GEO-C1-BASE-Q3-GOOGLE-AI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-google-ai-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 599b5750edc9af5751218b070810b98631fc87e7b94213c21b1c8301ed1f8b28
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-google-ai-2.md
    snapshot_sha256: 599b5750edc9af5751218b070810b98631fc87e7b94213c21b1c8301ed1f8b28
    entry_key: e84854a2d190284a6110357df18bd9c38d388dba9c6d803cfc23f981e16c8711
  - object_id: AGG-GEO-C1-BASE-Q3-CLAUDE
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q3-claude.md
    content_sha256: 1b8f19074cd3768a6bf1fb90738eaecb7c0ea67025aba3d64718f5f50d10a7bf
    file_sha256: bf87487b815ab997d863b14365b519bce5a1e97c9859a7953e5233c8e8a88f52
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q3-claude.md
    snapshot_sha256: bf87487b815ab997d863b14365b519bce5a1e97c9859a7953e5233c8e8a88f52
    entry_key: e8be22ce46327bb6181caae1e9f7a99d6818e67f7833bc3dfaad937bfc740107
  - object_id: ARV-GEO-C1-BASE-Q1-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-2-reviewed.md
    content_sha256: 61af8cdea15d940b979104493a6835f7f9c37651c34141ced8bbe76f686f63ef
    file_sha256: 1bd27a52ffa55edd9582e856a03419bd30aa220588f13882c32be056ef239b6c
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q1-google-ai-2-reviewed.md
    snapshot_sha256: 1bd27a52ffa55edd9582e856a03419bd30aa220588f13882c32be056ef239b6c
    entry_key: e9e19fc6e839fbb53ef920e84b2858457d7b9fce0fc8e13455eb8f6be7c26ce0
  - object_id: AGG-GEO-C1-BASE-Q4-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q4-gemini.md
    content_sha256: 7db889c2020bbc1fd08a9ad3918eb21e600e2a798cd39fb8dc955d1b22b67b64
    file_sha256: d421cc549df5794c5fd60cb2045aeae100d503cd2a0f74ae090ef532f42ab75a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q4-gemini.md
    snapshot_sha256: d421cc549df5794c5fd60cb2045aeae100d503cd2a0f74ae090ef532f42ab75a
    entry_key: eab66d5883d8bf8a19b6bdde23e01252025dd5ad0195d7754435bcbaef02b5fc
  - object_id: SMP-GEO-C1-BASE-Q5-GOOGLE-AI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-google-ai-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 6270622f76a180158b6335461ecb0041a2a024c0a303424671615e0f4139c0fc
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-google-ai-1.md
    snapshot_sha256: 6270622f76a180158b6335461ecb0041a2a024c0a303424671615e0f4139c0fc
    entry_key: eb26f0e3c91760c5ac5cb2e8dae88ee1b599ce59faf7342a54a962d3dcb571ab
  - object_id: SMP-GEO-C1-BASE-Q5-CHATGPT-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8f635858dc57749f5788583e48e928b026205e7617d5e7d7e52b0f72e859e632
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q5-chatgpt-2.md
    snapshot_sha256: 8f635858dc57749f5788583e48e928b026205e7617d5e7d7e52b0f72e859e632
    entry_key: ecf540755541b2c2ddf844bc07f026682b18d58109c0f814ec92e7d34306e0bb
  - object_id: ARV-GEO-C1-BASE-Q6-GEMINI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-gemini-2-reviewed.md
    content_sha256: bac22b6cf8bcb1354ee1d60c86b31675cced7a1bd2ed6929916bb841ae9d560d
    file_sha256: 06cdb5a3eec30970a05ca692f6c5b33566d2925d6e3c82daaaf5f3d1c6406f99
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-gemini-2-reviewed.md
    snapshot_sha256: 06cdb5a3eec30970a05ca692f6c5b33566d2925d6e3c82daaaf5f3d1c6406f99
    entry_key: ee46c84cb0726cb5b901a16b5488d9a37ad27a66450f8a0ec1ee9e79d6fa1a8a
  - object_id: SMP-GEO-C1-BASE-Q4-PERPLEXITY-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-perplexity-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: de14f9df9fefd4b34e61c69a6ebd2c6bf0053f91adb896d08fc1913ece9c5275
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-perplexity-2.md
    snapshot_sha256: de14f9df9fefd4b34e61c69a6ebd2c6bf0053f91adb896d08fc1913ece9c5275
    entry_key: eef21acde2b516400281e917e9f4d99c76d24370b634875ed992076198cdf803
  - object_id: ARV-GEO-C1-BASE-Q4-GOOGLE-AI-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-1-reviewed.md
    content_sha256: e53b76e17146774990ae5792a4d25b2b4ec8c786f4558ecec5a0e5b2d8c07816
    file_sha256: 480c73a2e1c09c63e82884f46979f6c929d3dd6a093a45d81f663cdaceb4b86f
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q4-google-ai-1-reviewed.md
    snapshot_sha256: 480c73a2e1c09c63e82884f46979f6c929d3dd6a093a45d81f663cdaceb4b86f
    entry_key: f0299b2931b9e9d9d0e354fbbc0d0fb5450c8793362c9e5a8401bc42690e013d
  - object_id: AGG-GEO-C1-BASE-Q6-GEMINI
    record_type: answer_aggregation
    object_version: 1.0.0
    object_path: cycles/m5/aggregations/agg-geo-c1-base-q6-gemini.md
    content_sha256: 50b58a9fe51a5c3f0e3bb63685f152c1ee26d79827fc9464664ca383f02d82a3
    file_sha256: e7d83938bd5b4d39b5c7c6b9d90e70cf3fec7d912f8ccf081623a7b5fcd7d4ae
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/aggregations/agg-geo-c1-base-q6-gemini.md
    snapshot_sha256: e7d83938bd5b4d39b5c7c6b9d90e70cf3fec7d912f8ccf081623a7b5fcd7d4ae
    entry_key: f213334edd6621f7ec9e0be8f109f0c5824de18bf667bf4aa3adae4ef511fa24
  - object_id: SMP-GEO-C1-BASE-Q3-CHATGPT-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: d78f2e5ee59d6ecb304b8b80b65eccb4c3841e6a80bdb287bd5ef34b4d0307d5
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q3-chatgpt-1.md
    snapshot_sha256: d78f2e5ee59d6ecb304b8b80b65eccb4c3841e6a80bdb287bd5ef34b4d0307d5
    entry_key: f2617d2cfda5315620795387244afdb7667d6a14205b3b54f0981697bf5edd51
  - object_id: SMP-GEO-C1-BASE-Q4-GEMINI-2
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q4-gemini-2.md
    content_sha256: dab2280854b840d20db2c76c5a64257cd9aba1325610a0e3ea4145d68c75370c
    file_sha256: 8d591b957d5fec4dddf1877c6374530a8f26355ac61fdb658e0b24a79fb330a1
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q4-gemini-2.md
    snapshot_sha256: 8d591b957d5fec4dddf1877c6374530a8f26355ac61fdb658e0b24a79fb330a1
    entry_key: f6c75aa79409202b9193fcb0a0e6c34095264aa7b73510c33df422cb4fd3d656
  - object_id: SMP-GEO-C1-BASE-Q6-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q6-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 85a677a24d469192c3a4359834870b6da5159460fc9bb64901116a0f0c3d8b17
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q6-gemini-1.md
    snapshot_sha256: 85a677a24d469192c3a4359834870b6da5159460fc9bb64901116a0f0c3d8b17
    entry_key: f999a3f65f1b1fbfa6e25110ed71f23c28da96c4a06cf682896762948218fee9
  - object_id: ARV-GEO-C1-BASE-Q6-GOOGLE-AI-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-2-reviewed.md
    content_sha256: a1839de212f14cac8ef30d8a8b5f0ae37e26de44bce2318c737257343e7e7905
    file_sha256: dfddc0d77bee02823e48f1a89ae3ec8a4e6a29c389fd4b0e98e996d89da37072
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q6-google-ai-2-reviewed.md
    snapshot_sha256: dfddc0d77bee02823e48f1a89ae3ec8a4e6a29c389fd4b0e98e996d89da37072
    entry_key: fe50d44c8fb6a086754547aa6131c5e5ee160a3314656f9f9921adc782b6874d
  - object_id: ARV-GEO-C1-BASE-Q3-CLAUDE-2-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-claude-2-reviewed.md
    content_sha256: 8e103c85b7f94168899a0f0dd9d2c563a2cd018b4e0122562da42e778b2ae738
    file_sha256: cc854217ac04794ec52a483b545ac8815a3e53ecdbc54f133053fcc9f93290c7
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-claude-2-reviewed.md
    snapshot_sha256: cc854217ac04794ec52a483b545ac8815a3e53ecdbc54f133053fcc9f93290c7
    entry_key: fe9d0561e34f5bace6f89b21f6e9ddfd0994f22566205403696315ece61ec56e
  - object_id: ARV-GEO-C1-BASE-Q3-PERPLEXITY-1-REVIEWED
    record_type: answer_review
    object_version: 1.0.0
    object_path: cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-1-reviewed.md
    content_sha256: 51776a4c38e8d4e7fe2f2b06edc4ad1a9f87c0fba818714428fe0b28955ec4c3
    file_sha256: 3534d114798075ef7b26dad382ebff34d1fdc89f5ec79b562a1d6b081d3e7b31
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/reviews/arv-geo-c1-base-q3-perplexity-1-reviewed.md
    snapshot_sha256: 3534d114798075ef7b26dad382ebff34d1fdc89f5ec79b562a1d6b081d3e7b31
    entry_key: fef97edafc9811c663bcb530af59d8eef3cc3d6ee3495e1b029eff6ff542b114
  - object_id: SMP-GEO-C1-BASE-Q2-GEMINI-1
    record_type: answer_sample
    object_version: 1.0.0
    object_path: cycles/m5/samples/smp-geo-c1-base-q2-gemini-1.md
    content_sha256: 8092e876e09e74c3385df01d30bdb28ca43c7c0a61b95e6118888c590824f75c
    file_sha256: 06c4693f9d7b23be7d740a256213ba40bbf478a6086862261b6f451f51d0078a
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/objects/cycles/m5/samples/smp-geo-c1-base-q2-gemini-1.md
    snapshot_sha256: 06c4693f9d7b23be7d740a256213ba40bbf478a6086862261b6f451f51d0078a
    entry_key: ff6840c949d42bf0131d8a9399f1132b3c30a4ec5018f78c8d496719851c0997
artifact_entries:
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-a4f41be5-6348-4c00-9030-cb4112af9d16.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-a4f41be5-6348-4c00-9030-cb4112af9d16.json
    media_type: application/json
    source_sha256: 2339f96c379109e0a0c4578b512ce1a5e9a395f63802da1f7d270bf6aa742543
    snapshot_sha256: 2339f96c379109e0a0c4578b512ce1a5e9a395f63802da1f7d270bf6aa742543
    entry_key: 005f2b69e104c3e76a448844e4374038b7da0d116110e1da18000ffbfb2277fe
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/0e4493c119ab-answer-2.txt
    media_type: text/plain
    source_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    snapshot_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    entry_key: 028897fc546271b91aec9a5ee2cab0ed82f13f41092fcca898adb96950a48165
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/6b2780af837a-extraction-2.json
    media_type: application/json
    source_sha256: 2fcacb7fed2ee0a38451ecea8db23b2b2c837d87531fc58928aff1535d8865bd
    snapshot_sha256: 2fcacb7fed2ee0a38451ecea8db23b2b2c837d87531fc58928aff1535d8865bd
    entry_key: 02e59c1011181a299d05d1cecc9c631d60c9ed95264b2cb5707915a9a0bc0c68
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/2ff4b7e76b0d-answer-1.txt
    media_type: text/plain
    source_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    snapshot_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    entry_key: 0504580f3c4881c50612f80461ba9ae1a9ccce4e2ade2579e804ec8c875bfc50
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-88c3bef4-bc3c-4be7-ab16-eb7c3bfbccfe.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-88c3bef4-bc3c-4be7-ab16-eb7c3bfbccfe.json
    media_type: application/json
    source_sha256: 52dd330a08802289c694e139c72f79c275bcac7ddb82d38bb9603ee7569c8446
    snapshot_sha256: 52dd330a08802289c694e139c72f79c275bcac7ddb82d38bb9603ee7569c8446
    entry_key: 050b06f2c6e071c3988681432157855e564cfe1d1a96aacb6e8da1e3310d311e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/183bc4f0f785-answer-2.txt
    media_type: text/plain
    source_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    snapshot_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    entry_key: 051f43778196352babf68570eccf5c0f605b5ac283399a4a45ec44aee8b7f923
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/cba3d40432bc-extraction-2.json
    media_type: application/json
    source_sha256: 02bfefc48ddd4dda5918bb617f4056cab43221eac6302ce4bdf6754541159ed0
    snapshot_sha256: 02bfefc48ddd4dda5918bb617f4056cab43221eac6302ce4bdf6754541159ed0
    entry_key: 0619159fc4c942ff02ede50c74dd0993a1685f44ac8fa07b45a553ee69c0381f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/c6114e71b992-answer-1.txt
    media_type: text/plain
    source_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    snapshot_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    entry_key: 07271cb785e09f2bffa10113951f194a7c428302689f898f0e1c71c3c36ba4c4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/546ba8948a7a-extraction-1.json
    media_type: application/json
    source_sha256: fbab9d84b71564dccd279d25fcb0894aff2102d286a85cdcb495022678c5e2d7
    snapshot_sha256: fbab9d84b71564dccd279d25fcb0894aff2102d286a85cdcb495022678c5e2d7
    entry_key: 0814a7c629eed2ccfa41559e296b05dd1f77d4ca413bf81075ce382b5db61440
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/118f40f8c4fe-collector-1.json
    media_type: application/json
    source_sha256: b60b335e2326e627e8b2975b66a7484993deb926e2f472397a75acec0b15f6ff
    snapshot_sha256: b60b335e2326e627e8b2975b66a7484993deb926e2f472397a75acec0b15f6ff
    entry_key: 08d3aed18f4a8d43b0d4c31246e3ab51917e6087be445d0c76ec58b09814e4a0
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/c016646db26d-extraction-2.json
    media_type: application/json
    source_sha256: 0315498be5fa35c29b87c2341decf3533864057d00b8c6b69e0b7f42034bcc92
    snapshot_sha256: 0315498be5fa35c29b87c2341decf3533864057d00b8c6b69e0b7f42034bcc92
    entry_key: 09acd0091c92a01da8ec873f8ac75e8086de0f43597f96cab0e71850f10b50dd
  - role: supporting_artifact
    source_path: reviews/decisions/OWNER-C1-BASE-ANSWERS.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/996b322550c1-OWNER-C1-BASE-ANSWERS.json
    media_type: application/json
    source_sha256: 1566795769222b99412bb62468b63d5c48c74a871164bb9c6a7f2849c457c53d
    snapshot_sha256: 1566795769222b99412bb62468b63d5c48c74a871164bb9c6a7f2849c457c53d
    entry_key: 0a7f3529dc29ab715fabb91e5630b153c740ed8a3f5780340241925cb5de6158
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/b3890b2dea5a-collector-2.json
    media_type: application/json
    source_sha256: 58918f6de24043f91bb37a8e4542e3f8c2ac868f617ce8f89cfbb6557aa48bc7
    snapshot_sha256: 58918f6de24043f91bb37a8e4542e3f8c2ac868f617ce8f89cfbb6557aa48bc7
    entry_key: 0abbc3ad98e82a6393b74b2aaa4ab5ad7d973c5d23ce151eb5f984d50c79bde8
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a7cf8bda62ec-answer-2.txt
    media_type: text/plain
    source_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    snapshot_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    entry_key: 0b9a0efb24783b4316772d32b44945ce3374e33d97ba8b71e9cc65aef8e485e0
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-40ddcda4-ce13-4e6a-8aea-934baf382d99.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-40ddcda4-ce13-4e6a-8aea-934baf382d99.json
    media_type: application/json
    source_sha256: b20db3bb4ea376061fe46a12c13274907b2422ac15823262ec5eed0bc50c0e78
    snapshot_sha256: b20db3bb4ea376061fe46a12c13274907b2422ac15823262ec5eed0bc50c0e78
    entry_key: 0cbbc25c4514a0dfd0e86d0dd96826c9e64784e0f3f26cf27a808f6221ed6818
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/8b0e181d0d7c-extraction-2.json
    media_type: application/json
    source_sha256: 353c99f4653ddbd72e1c977f1589ee7002e85bf773c52bd7cc74d8011ded6b04
    snapshot_sha256: 353c99f4653ddbd72e1c977f1589ee7002e85bf773c52bd7cc74d8011ded6b04
    entry_key: 0d11bb50cd43403ddd43e6a0fb889f367bf87a6832624088e67d5e877007d85a
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-a46c4484-a228-4e28-9e09-d686d27e3223.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-a46c4484-a228-4e28-9e09-d686d27e3223.json
    media_type: application/json
    source_sha256: ab88b77c90cfae774d782f0adc45dd195d3557c0f27eece43a93968c4982ecb4
    snapshot_sha256: ab88b77c90cfae774d782f0adc45dd195d3557c0f27eece43a93968c4982ecb4
    entry_key: 0eb2938e4da8825c0742f98937b32fc30cfd873c59684014c806a14b387fb85b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/5fcb828988a4-extraction-2.json
    media_type: application/json
    source_sha256: a5e5a6e15afefad6184d879b7731e7321123ce77895775e94e8dfcb7088dae5c
    snapshot_sha256: a5e5a6e15afefad6184d879b7731e7321123ce77895775e94e8dfcb7088dae5c
    entry_key: 0f38baf408d985eb010d794468acb6beae81ee613e40f2550ee8fa246820e161
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f1ba239ae27e-collector-2.json
    media_type: application/json
    source_sha256: 1ffb43d66de7a1fee0cba53e82ceea259412a28d513e844b8fa2c5d6b920f50e
    snapshot_sha256: 1ffb43d66de7a1fee0cba53e82ceea259412a28d513e844b8fa2c5d6b920f50e
    entry_key: 112680d6c80040347fb6de8be444fa1180871897b47c614db0a4ade788f2801f
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-d0984c87-db06-466c-9257-2cf2adfba542.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-d0984c87-db06-466c-9257-2cf2adfba542.json
    media_type: application/json
    source_sha256: d76e9678a4b9efa6ca74572b008945158381ff0d6e1648c3fe1654601e1f14be
    snapshot_sha256: d76e9678a4b9efa6ca74572b008945158381ff0d6e1648c3fe1654601e1f14be
    entry_key: 12dfd5ddad096a058564d63bf045a1aab5339b7f5ace24be74e26f30db91fdf8
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-185b7d07-e83a-4b94-9db3-c34ee13b49f1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-185b7d07-e83a-4b94-9db3-c34ee13b49f1.json
    media_type: application/json
    source_sha256: 099e07bd33885b650fc73971480e87aff40115a3d6c6aa7fdb538f68fbf01572
    snapshot_sha256: 099e07bd33885b650fc73971480e87aff40115a3d6c6aa7fdb538f68fbf01572
    entry_key: 14496ba112474a94da8f02ceb93cced17a61756e6425b8910a4ba0c42108d49d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a28e769b254c-answer-1.txt
    media_type: text/plain
    source_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    snapshot_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    entry_key: 168bae509590e161e39dcd04ae08f343efdaa8edf05f1032848022a92af38875
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-1b78b620-a1d6-4821-b115-0c0bcd13bb81.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-1b78b620-a1d6-4821-b115-0c0bcd13bb81.json
    media_type: application/json
    source_sha256: 8cad9d5c75721bf3bd4b06bd5dca2b5798416e7140b97befcba86473dc02bdb9
    snapshot_sha256: 8cad9d5c75721bf3bd4b06bd5dca2b5798416e7140b97befcba86473dc02bdb9
    entry_key: 189d6c055394378859c8a84ad1a1114756cd4a71ea5d388da31d379444cec8ec
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a25a4ee31207-collector-1.json
    media_type: application/json
    source_sha256: 96708d5ef29779b39d762e1544144bd91961fd3429c858cb346750fdfef9ef61
    snapshot_sha256: 96708d5ef29779b39d762e1544144bd91961fd3429c858cb346750fdfef9ef61
    entry_key: 194bba237565ab3ea551df56bfdd09517e1f05f055f5acc734b6a0192474f277
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/81f78fc87e0b-answer-1.txt
    media_type: text/plain
    source_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    snapshot_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    entry_key: 1a2d93bee7548dccf995221546cfe8931c0fc5cbb99ee65841ffd52fd4b8137c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/730606f7d171-collector-1.json
    media_type: application/json
    source_sha256: ffb0c6e99120cef470a66b190465d02ec534fa9369353d6d1a8d891e372bb715
    snapshot_sha256: ffb0c6e99120cef470a66b190465d02ec534fa9369353d6d1a8d891e372bb715
    entry_key: 1ae62ebc9cbaa3aee8e270c31d513da39fe5826078155d1c4a6497ec7db12a09
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/637617840620-answer-2.txt
    media_type: text/plain
    source_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    snapshot_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    entry_key: 1c050a1a0a8e96422d8320fbb40bc72428beffbdb8f83e415c53983da294839a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/e7e539c6c91c-answer-2.txt
    media_type: text/plain
    source_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    snapshot_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    entry_key: 1e2b31195c425c96bf860250a05cbae1d1718a7c7289b7564e7527ed7d474f52
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/23b8df21af01-collector-2.json
    media_type: application/json
    source_sha256: 67b0841a1e62b05cb59f570446db64646034fa388f960a6c3623133a9c6c8364
    snapshot_sha256: 67b0841a1e62b05cb59f570446db64646034fa388f960a6c3623133a9c6c8364
    entry_key: 1edc8744cf4c97cafc595a4f3ae9ebab3c5fa7bcbe1ffc5e7d923e479738daf0
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C1-BASE-Q2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/C1-BASE-Q2.json
    media_type: application/json
    source_sha256: b10965be024a4d1947e6cb42ca8483ee1fd2e60248af492741f054e40ba4b514
    snapshot_sha256: b10965be024a4d1947e6cb42ca8483ee1fd2e60248af492741f054e40ba4b514
    entry_key: 1f0ab45a239b63913e25d1cb15c275e76d53db73168bd5a55036cc4b39afcb7e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/009368e14dc5-answer-1.txt
    media_type: text/plain
    source_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    snapshot_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    entry_key: 201a2a90ff5ce4d6754ad3024b35683065c6dadb1139bf8168cc6e4231b07d72
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/1714b83e5d6e-extraction-1.json
    media_type: application/json
    source_sha256: 24bab8d711529489173aed9c6a407c340fb1799843584c666787d68af775bfdd
    snapshot_sha256: 24bab8d711529489173aed9c6a407c340fb1799843584c666787d68af775bfdd
    entry_key: 20f2781d2954b7c77b5f11bd0c082fd98319f8d4446d09d2b6ba75ec52abc3e7
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/6b892cad67a0-extraction-2.json
    media_type: application/json
    source_sha256: ab0d7ce2fea1b1a390424861de736a23f3545432019e562027afa49dd35d4473
    snapshot_sha256: ab0d7ce2fea1b1a390424861de736a23f3545432019e562027afa49dd35d4473
    entry_key: 2238bd83a1a711e2adff058ab497011826a28bd321b37f70cbcbf4495607b981
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/55dad4bde67b-answer-2.txt
    media_type: text/plain
    source_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    snapshot_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    entry_key: 2250d543985d25decb8a88a1be67d8af20fdebdf679ecbba0eccb47b968550a4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/1bf1d102db18-answer-1.txt
    media_type: text/plain
    source_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    snapshot_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    entry_key: 22a25d11a90222228a3dd6402a0d3ef6a43466bdec08c8d0f711005334e514db
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-757afa41-73d5-4ef0-bd19-c4b44fcaf96e.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-757afa41-73d5-4ef0-bd19-c4b44fcaf96e.json
    media_type: application/json
    source_sha256: fbed9bf9e3c9d387b5fa982cf7ff83ab11d74c5e5c8fad71e68868409a2eb715
    snapshot_sha256: fbed9bf9e3c9d387b5fa982cf7ff83ab11d74c5e5c8fad71e68868409a2eb715
    entry_key: 242625956e16e2d38de2c851c244deedeb862fc4bc8abc83d9dca5db4f34122e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/71f37737902c-collector-2.json
    media_type: application/json
    source_sha256: ecc6f3ea26d7b90b2d2ceadcfdde0e286e01731125547263c9b857d2c542ca8b
    snapshot_sha256: ecc6f3ea26d7b90b2d2ceadcfdde0e286e01731125547263c9b857d2c542ca8b
    entry_key: 24272bc2564b95565de99133f036767e41aacbae247c837e0c85854e29549202
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C1-BASE-Q3.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/C1-BASE-Q3.json
    media_type: application/json
    source_sha256: b5d35008e3e9b3797cf7532a24f7ac69544251ee059ee0a9c180fd91d8932e4d
    snapshot_sha256: b5d35008e3e9b3797cf7532a24f7ac69544251ee059ee0a9c180fd91d8932e4d
    entry_key: 24789fa415c058bbbf9c0bc27ee99d4e7b42ecf0f3c6c294999430f25161fed4
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-3169b86e-90f5-40a3-a31c-b01f478294cf.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-3169b86e-90f5-40a3-a31c-b01f478294cf.json
    media_type: application/json
    source_sha256: 8955feda1e9a28e23f27d0fe5c60ede01f3ed5e549b33eac8bf63f47709a154b
    snapshot_sha256: 8955feda1e9a28e23f27d0fe5c60ede01f3ed5e549b33eac8bf63f47709a154b
    entry_key: 27924813dccdaac51dd4a38f316df2c3f32caf69e2ddad00281d3905e048c0e4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/13a8fdf4da0d-answer-2.txt
    media_type: text/plain
    source_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    snapshot_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    entry_key: 27f53cfa352740683f187e30eab0817ae11bce56573c269dd209b72b27537331
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/0e7d144976e4-collector-2.json
    media_type: application/json
    source_sha256: 249a8708e17c33b7d0e6d1d8383de09a2b4f791c1dc2bcb141a24774b8d43e5e
    snapshot_sha256: 249a8708e17c33b7d0e6d1d8383de09a2b4f791c1dc2bcb141a24774b8d43e5e
    entry_key: 286be8b7b6608e6f8f9c992ce0f95e49d78f48488a639df85dca3303d621778b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/9ba7b415be16-answer-1.txt
    media_type: text/plain
    source_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    snapshot_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    entry_key: 293072cf584456bf973b864e8975e6600837660951665945cb3a9ddea43cf04f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/b48a5f0d7737-collector-2.json
    media_type: application/json
    source_sha256: 20468352504b427d42a650b0fb324dab198138842542c6cf91e1e3b413434fce
    snapshot_sha256: 20468352504b427d42a650b0fb324dab198138842542c6cf91e1e3b413434fce
    entry_key: 2a9ab0e8ff8c547111c77bd5206464a552fc11d21e6011a90a4dde3ffce6fa24
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/941a9ee4af1a-collector-1.json
    media_type: application/json
    source_sha256: a706a76cb74b331a1944def2c5d55bd7c82996c4980df690b39b03ba1bd88e47
    snapshot_sha256: a706a76cb74b331a1944def2c5d55bd7c82996c4980df690b39b03ba1bd88e47
    entry_key: 2c183b38505b409a9d82f21216fd011d5fc058fd2659461855f01d836b8cee74
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/9c5c7ddc98ef-collector-2.json
    media_type: application/json
    source_sha256: 9bd7691f6ebdbe6fed2223139666055a1b168da03e37e2e0fa83c4f55cab7378
    snapshot_sha256: 9bd7691f6ebdbe6fed2223139666055a1b168da03e37e2e0fa83c4f55cab7378
    entry_key: 2ddad9e13f20c516bf2fdf5bfc16c59e27f91883bb529df1f6231c8b59a8cd02
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/efb66b64cba0-answer-1.txt
    media_type: text/plain
    source_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    snapshot_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    entry_key: 2e25c939ffac0af0d71c9811a7e8fc50214fec5204347438e0c994139c9f0902
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7e83b7a9-9a7a-42c7-95d8-938d3552eff4.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-7e83b7a9-9a7a-42c7-95d8-938d3552eff4.json
    media_type: application/json
    source_sha256: 7ecb880f94251bbab042d4a7c128caf353af2cc170be593a7deec2e5225d4c83
    snapshot_sha256: 7ecb880f94251bbab042d4a7c128caf353af2cc170be593a7deec2e5225d4c83
    entry_key: 30bfb6cf38bb2660e8d7ac2af414e58c1d612c32ce682712d9e6ba6a6e2fe91e
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-470b00ed-5c76-4c52-a99c-4e79f8f5fcee.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-470b00ed-5c76-4c52-a99c-4e79f8f5fcee.json
    media_type: application/json
    source_sha256: b9b6469a150618c0c927f76ed6bf80508611ca41e2c8eb900464c7aa985f444a
    snapshot_sha256: b9b6469a150618c0c927f76ed6bf80508611ca41e2c8eb900464c7aa985f444a
    entry_key: 3133a443eb6aacdf4df636fe35bb00f6c6aaa41db3a65f756d6e2f37e9596798
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/0667b14bc600-extraction-1.json
    media_type: application/json
    source_sha256: 5c2b6953978fadb063ff896ec13c3603f637c4a1dbb0bd6464224ce8f9d47f47
    snapshot_sha256: 5c2b6953978fadb063ff896ec13c3603f637c4a1dbb0bd6464224ce8f9d47f47
    entry_key: 313e7f6dd31b92fe90072a7cdae3fc3cd476c88a797fa762534da78928b9ac85
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7dc3c3f4-6227-4d8e-b8fe-ab1d28c1842e.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-7dc3c3f4-6227-4d8e-b8fe-ab1d28c1842e.json
    media_type: application/json
    source_sha256: d9a54fb89f95cb26856cbcec2f97b9450e890e9cce46d84fe31b114cf97be704
    snapshot_sha256: d9a54fb89f95cb26856cbcec2f97b9450e890e9cce46d84fe31b114cf97be704
    entry_key: 31cc427b04a0d9812111819d476eb081a11aad8feb03b7437c9d232745ed83b4
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2a40eb20-fd24-435e-8f28-47178d39bb76.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-2a40eb20-fd24-435e-8f28-47178d39bb76.json
    media_type: application/json
    source_sha256: dd354f31494bbb527b134d4100266f2dd30eb78c841cc93a148c21d80d75c186
    snapshot_sha256: dd354f31494bbb527b134d4100266f2dd30eb78c841cc93a148c21d80d75c186
    entry_key: 33679d14cee9e98f2726ab9963523637a7e804f2ed8737da13b5b1589bfe34e6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/d2fe390ec279-extraction-2.json
    media_type: application/json
    source_sha256: 946eb792fb6da7ca75ee93a680e1e996d70bc72d23c2929492411ef2dda3b1d3
    snapshot_sha256: 946eb792fb6da7ca75ee93a680e1e996d70bc72d23c2929492411ef2dda3b1d3
    entry_key: 343b498d7bf4035cbc7bf4651b561a6e493563bbaecd88143036a31e2f65fb99
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/7f17aeb4af34-collector-1.json
    media_type: application/json
    source_sha256: 92e0f3afd7b9466ffde2e1018b15ae5895e4f9ab5e1865cb0896d3e923877713
    snapshot_sha256: 92e0f3afd7b9466ffde2e1018b15ae5895e4f9ab5e1865cb0896d3e923877713
    entry_key: 3592f4e1832ddad3b74d423246fcfc8e527519c5beb6a560390228629684fb03
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/981937fcfbe1-collector-2.json
    media_type: application/json
    source_sha256: 8f09645857c16261adf9c9a4c8bc951603094ec81a032c82cefa564ba003fb31
    snapshot_sha256: 8f09645857c16261adf9c9a4c8bc951603094ec81a032c82cefa564ba003fb31
    entry_key: 35b86d0556fb9127fbfca45958cf205774bff00299a15d1f9d7a91bb0bc09739
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/36d3a22fc6e6-extraction-2.json
    media_type: application/json
    source_sha256: 3c85838211bf17e8b05063e169efacb8b692c4917b5a80b881a7a43e098c293b
    snapshot_sha256: 3c85838211bf17e8b05063e169efacb8b692c4917b5a80b881a7a43e098c293b
    entry_key: 368f7544e57832be68a0205754887132514e5d1b2009414b99f2f940fd6c60a1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/c9aa20731010-collector-2.json
    media_type: application/json
    source_sha256: 174a6f96c57dca595e640728e863660854b2b0ef82b18287bcbfa5bbd2ab6e7a
    snapshot_sha256: 174a6f96c57dca595e640728e863660854b2b0ef82b18287bcbfa5bbd2ab6e7a
    entry_key: 36c654025fba835be9b553b45a900f5cf60386a99802a94e25a11de973b27b17
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-cb22104a-955a-48d8-a2ab-6b7d998dd625.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-cb22104a-955a-48d8-a2ab-6b7d998dd625.json
    media_type: application/json
    source_sha256: a886ae25a11399e2a5f7939163378e6ed17f74977fe2649c45d8a48938253ae0
    snapshot_sha256: a886ae25a11399e2a5f7939163378e6ed17f74977fe2649c45d8a48938253ae0
    entry_key: 36c6f632915a90d0c17d51810ec7a8f534e952cfc1ecbcb02c33d5eae5e37a4c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/8c03118d6532-extraction-2.json
    media_type: application/json
    source_sha256: 0aacf6ad185f65a8523d6a206e40f331b6d9ec06ceded150d496df947792998b
    snapshot_sha256: 0aacf6ad185f65a8523d6a206e40f331b6d9ec06ceded150d496df947792998b
    entry_key: 37b2d1f6757f21033fad44b338589da4f1af339dfeb76f11674ff6076ea733a5
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/164157eecec8-collector-2.json
    media_type: application/json
    source_sha256: a91111cb54a624fa1cd680edc0bebac7dd9d9c0cc7cbd04b6fd5489dcfd46e0d
    snapshot_sha256: a91111cb54a624fa1cd680edc0bebac7dd9d9c0cc7cbd04b6fd5489dcfd46e0d
    entry_key: 396af0ceeebd8afc09207b1503b149db1ab2fe88ee91b66728d04e050e247a84
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/22954c8e54ca-extraction-2.json
    media_type: application/json
    source_sha256: 212c672a2c9e0cdbe4a808e02b388749fbf05d38dcc72f45484527bd6767b52a
    snapshot_sha256: 212c672a2c9e0cdbe4a808e02b388749fbf05d38dcc72f45484527bd6767b52a
    entry_key: 3980dd39231665690bb616b3f4d755bb4e8c767db451557d64007bc76f2b790a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/dff65d399c4f-collector-1.json
    media_type: application/json
    source_sha256: d40b8f35bd2e86cc2b915a304c69f1b8be369ddca74cab41a86bb5af62982de1
    snapshot_sha256: d40b8f35bd2e86cc2b915a304c69f1b8be369ddca74cab41a86bb5af62982de1
    entry_key: 3e0bea8ee4624f9f5d01a22fbecab598ddd1c97d1373140011065d5c8409bb77
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/dae26f1e929b-extraction-1.json
    media_type: application/json
    source_sha256: b0081b24b74d4f05f43a869a8f0abd4096b8cceae7bcde1fcd57107de9f255f2
    snapshot_sha256: b0081b24b74d4f05f43a869a8f0abd4096b8cceae7bcde1fcd57107de9f255f2
    entry_key: 3e1024d7349df7f256e5c52f041ee8062dba7fd29ade8474243e514980a9e56c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/6f3262aaeb40-collector-1.json
    media_type: application/json
    source_sha256: d1a853619ae39109140d975f658273a2a72e8409a080fa6edc58e099841d6536
    snapshot_sha256: d1a853619ae39109140d975f658273a2a72e8409a080fa6edc58e099841d6536
    entry_key: 4076f36874e0d62f91b10f12db294a703bea8a34a2a10b72661b77b045338124
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/83724cb8f862-extraction-2.json
    media_type: application/json
    source_sha256: 5d86f8e62cb9329759dd9114d1b43545d549146287a3380a9ff664bec15e8ca8
    snapshot_sha256: 5d86f8e62cb9329759dd9114d1b43545d549146287a3380a9ff664bec15e8ca8
    entry_key: 40a1dcde62903caa6e59ee67c31aac1a9f1e0ecd52d0666229c85e4a8c941431
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/321c92afcc5d-collector-1.json
    media_type: application/json
    source_sha256: d7d685ae7245175766d07828586574255cc505d1616eaad909b0e66209efbd4d
    snapshot_sha256: d7d685ae7245175766d07828586574255cc505d1616eaad909b0e66209efbd4d
    entry_key: 424ebc1e570fc5dcb2fd2ee6d4d0263671db81c99705fa6c6233b8954be5907c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-850b8812-cc75-4cac-aebb-117365e37429.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-850b8812-cc75-4cac-aebb-117365e37429.json
    media_type: application/json
    source_sha256: 3473034f2bee522143b3264291015a9cd554242c6b89c3599e52e5ff9ac19616
    snapshot_sha256: 3473034f2bee522143b3264291015a9cd554242c6b89c3599e52e5ff9ac19616
    entry_key: 42e3105435f8d463236b53bbbb9cfa0d4ee9f380f83ede0dd5ad129e3490d763
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/65cbe6b3799c-answer-1.txt
    media_type: text/plain
    source_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    snapshot_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    entry_key: 43a6550470744e28f89fef4125a812ec41fe24e99fbd754d606f54ee98122035
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-72a5d5ed-c11b-411c-9955-774d44fee7f9.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-72a5d5ed-c11b-411c-9955-774d44fee7f9.json
    media_type: application/json
    source_sha256: f2312c09f7a0683f1429bf8629787aa7b28dbb3dc7fa6fefd570bf41f27736a0
    snapshot_sha256: f2312c09f7a0683f1429bf8629787aa7b28dbb3dc7fa6fefd570bf41f27736a0
    entry_key: 448de2e0c20db00cb1f4d8c31cb101e415aa6e73576e1771a95b08ac3cdf3ccb
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/4aec358394a5-extraction-2.json
    media_type: application/json
    source_sha256: a9d01c27ebc72974fd511cd2bf0a5473066e6edf17933d997cbaa8d957bb16cb
    snapshot_sha256: a9d01c27ebc72974fd511cd2bf0a5473066e6edf17933d997cbaa8d957bb16cb
    entry_key: 469b8a8c8d3f2fe2d1b925cee085dab9f961e1af278af02d89fddb808f49200a
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-4c7ce3f8-f0de-4c61-8cfa-da98097a8543.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-4c7ce3f8-f0de-4c61-8cfa-da98097a8543.json
    media_type: application/json
    source_sha256: a77463b7d8d608dc55d98a9795b36f9b42bdad7d3330809f4a1ae41779ca46c9
    snapshot_sha256: a77463b7d8d608dc55d98a9795b36f9b42bdad7d3330809f4a1ae41779ca46c9
    entry_key: 474c26b9f4ce06af81b3b67b273614b288098dadcbe9c00f6a6ffa6243669bff
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-10edc7a0-98eb-4998-ab83-4435c8519c8a.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-10edc7a0-98eb-4998-ab83-4435c8519c8a.json
    media_type: application/json
    source_sha256: d57966281219209266c7f491fe5bff185a72e109ad1574d99097807c89211ba7
    snapshot_sha256: d57966281219209266c7f491fe5bff185a72e109ad1574d99097807c89211ba7
    entry_key: 48115e69378937935c751043ec6c85de91b30bd42ca76b21931807d11217fd6d
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2a8251ec-79ef-4cd0-96d3-166eb26ac9b3.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-2a8251ec-79ef-4cd0-96d3-166eb26ac9b3.json
    media_type: application/json
    source_sha256: 02a30ccde5ac5b6ded03c0d7760891f86ac8fbc740703b437deb072b890de1bf
    snapshot_sha256: 02a30ccde5ac5b6ded03c0d7760891f86ac8fbc740703b437deb072b890de1bf
    entry_key: 48f69117c309e0fde0274ef0afab35d4ab98bde613d9e9d3f1a965e34b6abaa6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a2dbc75a26ab-answer-1.txt
    media_type: text/plain
    source_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    snapshot_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    entry_key: 491bd4b9f9097a9cb3063a72e4a00bb3886493a2f0d7db23e2b405539fcfdc9a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/774261555722-answer-1.txt
    media_type: text/plain
    source_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    snapshot_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    entry_key: 4a2b57b98bc24f8874ee15bac6e2e959469e7be949b1d180388ac15c96f34296
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/91e55bc03b50-answer-2.txt
    media_type: text/plain
    source_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    snapshot_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    entry_key: 4a3f3ec340d2da22d87f84e249ddf5a8295fd5325e92722ff7165c1d5aa66cf7
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-c591aeba-3e9b-4ece-b1ca-c9308771dbf2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-c591aeba-3e9b-4ece-b1ca-c9308771dbf2.json
    media_type: application/json
    source_sha256: 7633c45f0c17cbebda2516b3a5795650a531e2c63b2374d463e6175792f5d515
    snapshot_sha256: 7633c45f0c17cbebda2516b3a5795650a531e2c63b2374d463e6175792f5d515
    entry_key: 4f47ad37a03aa7034759a5b1d9259f68d7037c1a311f103c21c5f6ba10774dd5
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-99158f40-3045-4101-bca5-cd8dfb86a426.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-99158f40-3045-4101-bca5-cd8dfb86a426.json
    media_type: application/json
    source_sha256: f70c4446801748518b843dd2fc6e61b695b5848864c9ab754c3ecfcbad9d3521
    snapshot_sha256: f70c4446801748518b843dd2fc6e61b695b5848864c9ab754c3ecfcbad9d3521
    entry_key: 4f6e109600e82f84483fe35503c2e9bb6eb12a6cf7e62595170649fbe2262788
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a00a124395dc-answer-1.txt
    media_type: text/plain
    source_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    snapshot_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    entry_key: 515c95e368fea6979ce395572c6052ccdcec655ad0639483328b3b54ca269d2f
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-cdb84a2e-b38c-4711-8747-19d5a40e29d6.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-cdb84a2e-b38c-4711-8747-19d5a40e29d6.json
    media_type: application/json
    source_sha256: ddae6817003034e89be267d5bbdc45c32b31b6f4c720e9aabb8d8af3c4f76f5d
    snapshot_sha256: ddae6817003034e89be267d5bbdc45c32b31b6f4c720e9aabb8d8af3c4f76f5d
    entry_key: 52ac056d6bbf4c34635411a3a43d18f860521ba7f5e4bd0d2047f6666ef10f2e
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C1-BASE-ANSWERS.md
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/OWNER-C1-BASE-ANSWERS.md
    media_type: text/plain
    source_sha256: 7a13cbc8da0862bdcf962da295a0d2afb8532b9b41c31d68b2aa9783d2f3646a
    snapshot_sha256: 7a13cbc8da0862bdcf962da295a0d2afb8532b9b41c31d68b2aa9783d2f3646a
    entry_key: 53b0e57db7a0b011b216cdd21272165309118566100d291fd8e35b2f6a308fb8
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7d224172-ef00-42c3-94af-aa803bbdc764.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-7d224172-ef00-42c3-94af-aa803bbdc764.json
    media_type: application/json
    source_sha256: 516e0df909a4080c411bbac5138c60ccd819aea2d38df098cb365dd8fbd0bc97
    snapshot_sha256: 516e0df909a4080c411bbac5138c60ccd819aea2d38df098cb365dd8fbd0bc97
    entry_key: 53c9c59c96739e8ec34aaa4aeb77496612dd9229b2396b06fd54a5535bcfdd1e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/59e3d0ad3f30-extraction-2.json
    media_type: application/json
    source_sha256: 12018bcb7944b1d48ea83b76b1d4381646a82f24fcf375d812c3a4373d240166
    snapshot_sha256: 12018bcb7944b1d48ea83b76b1d4381646a82f24fcf375d812c3a4373d240166
    entry_key: 54e70e777f6a27ca9a48864a678199ac9d9030a4f15690432583859a055be126
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/9769e5fa8dcd-extraction-1.json
    media_type: application/json
    source_sha256: 1b734d33939f034a243e031a8ede147f9c1236b2fbae62eb74698fb81ee15eee
    snapshot_sha256: 1b734d33939f034a243e031a8ede147f9c1236b2fbae62eb74698fb81ee15eee
    entry_key: 550fe94f476e0570c8009d4da66c8aa4297e015cbd3060989adfcd57186bd750
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/681666145adc-collector-1.json
    media_type: application/json
    source_sha256: 56cec8004917f37f9d17fca52983e52810b8b25b8734a8318ba5d0e866c670ad
    snapshot_sha256: 56cec8004917f37f9d17fca52983e52810b8b25b8734a8318ba5d0e866c670ad
    entry_key: 5558a3538bf1b70ff8f54038f8bc82d3549490f178ac36868c08ecf04df3fee4
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-25065562-c4dc-4606-977d-6bf5ed365bde.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-25065562-c4dc-4606-977d-6bf5ed365bde.json
    media_type: application/json
    source_sha256: 55fe343b1ba40a18c68916e1fe5c7b09cb084d4e95e29fa12b8ae8cda10ba29e
    snapshot_sha256: 55fe343b1ba40a18c68916e1fe5c7b09cb084d4e95e29fa12b8ae8cda10ba29e
    entry_key: 56005f28acca4ce87b3279037b6ace90f0f36d120ea9ca5d7da29d2f63562b84
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-8ce5a7b4-0dcf-4ab1-bca0-e2004661511c.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-8ce5a7b4-0dcf-4ab1-bca0-e2004661511c.json
    media_type: application/json
    source_sha256: 0d39288023493c4ec9e8884913b357802cab801988219a6f0730ab651d98443a
    snapshot_sha256: 0d39288023493c4ec9e8884913b357802cab801988219a6f0730ab651d98443a
    entry_key: 57f4edc7e34853f6338d8bdc33a92a13fabbb8e29ddbe6751813ae13895abf97
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-37716102-f4fa-40b7-a640-2db52cff0771.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-37716102-f4fa-40b7-a640-2db52cff0771.json
    media_type: application/json
    source_sha256: 2cb738755beabbe2f4a2c0f12ebf9282b956257e9d5a740c17d352b2ccfa417e
    snapshot_sha256: 2cb738755beabbe2f4a2c0f12ebf9282b956257e9d5a740c17d352b2ccfa417e
    entry_key: 59c9cbf68672303da7b09178bc864f63cd365a40b415c2e8ed5c99294d0d70db
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C1-BASE-Q4.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/C1-BASE-Q4.json
    media_type: application/json
    source_sha256: e87cac5d1ff3563c403844fa0331bfc17ad10d05a8f2f06c7d4618644ef51565
    snapshot_sha256: e87cac5d1ff3563c403844fa0331bfc17ad10d05a8f2f06c7d4618644ef51565
    entry_key: 5ab6a46404500be5c545d8d4646ab611f371e4b4ab615006beca29392825cb1e
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-4008c134-6dbe-460d-a227-0093712bb675.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-4008c134-6dbe-460d-a227-0093712bb675.json
    media_type: application/json
    source_sha256: 34df3288d19cbe62c1fa2e6a99c894511cd3c74d28701470b4e4aade0842aad1
    snapshot_sha256: 34df3288d19cbe62c1fa2e6a99c894511cd3c74d28701470b4e4aade0842aad1
    entry_key: 5b547208075f2b5bf5ab15cb6d85f565c0be6c1c63f62097c88d2c8de9916dd0
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/fa48b88e3549-extraction-2.json
    media_type: application/json
    source_sha256: 39fcf365ee2323d730bc266cd0615acab54fbc8a7401c0558b8c94464049ee1b
    snapshot_sha256: 39fcf365ee2323d730bc266cd0615acab54fbc8a7401c0558b8c94464049ee1b
    entry_key: 5bd805410ed7a33c6a5f95128fe6a6faa58fb47b88d9b87aa32428aadb130205
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/085d880a8487-extraction-2.json
    media_type: application/json
    source_sha256: 089ee66a774ba0f5248f24fe1e44a3cf279768bf5ee31f043e45e6fafee6afc7
    snapshot_sha256: 089ee66a774ba0f5248f24fe1e44a3cf279768bf5ee31f043e45e6fafee6afc7
    entry_key: 5c802abaa30abe67828bd2ad9ec4dbeb9bab03b809eb39f9956616f2bd55782b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/87093e51a803-extraction-2.json
    media_type: application/json
    source_sha256: 6aa3a31640eece0390957143f3a43ed5e8c640905761e7ab6182e6aeaec7f503
    snapshot_sha256: 6aa3a31640eece0390957143f3a43ed5e8c640905761e7ab6182e6aeaec7f503
    entry_key: 5c9d582ba6501dfeafb54cb7295e9e4aa44564519c6546c210a6211a3e186678
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a538ba3bce96-collector-1.json
    media_type: application/json
    source_sha256: 4f08108dc833a06516955d0def49413b5f69a6bdd70f732f245651424857b8cf
    snapshot_sha256: 4f08108dc833a06516955d0def49413b5f69a6bdd70f732f245651424857b8cf
    entry_key: 5d9d4b6a447cc663ac32241b11616327ced5932c9615bfb85578969ea256b28c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/566ec07586f7-answer-2.txt
    media_type: text/plain
    source_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    snapshot_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    entry_key: 5dfc28cddcbabadb567c4b0b9f7f5862525cdf8d03df3d986f2281e1c1832d03
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-44ed5383-301a-4758-b842-973f412d5634.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-44ed5383-301a-4758-b842-973f412d5634.json
    media_type: application/json
    source_sha256: ae29f473f6efbbe8b394ec4964f0d5ed2d06b40e89ba48f49af341dc9a2ea799
    snapshot_sha256: ae29f473f6efbbe8b394ec4964f0d5ed2d06b40e89ba48f49af341dc9a2ea799
    entry_key: 5e8d2aa1ac3ecefab75b67a59904b12f8fc91dfd643708e85cd0b0d3e4420a89
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/05453a4d7e6f-collector-2.json
    media_type: application/json
    source_sha256: 337868af77a7bd4c3ae577028c3434d662e7e8d1c36bb89a0f0b5f9ce0923b1a
    snapshot_sha256: 337868af77a7bd4c3ae577028c3434d662e7e8d1c36bb89a0f0b5f9ce0923b1a
    entry_key: 608a2b15edd5f5a728473768f5fc07ac8573fd0ea1090e72f067945219c45629
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/46f5dcad940b-answer-2.txt
    media_type: text/plain
    source_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    snapshot_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    entry_key: 6180482eb81a7cb1bb8f82cc7d29a8566a3b7d91c1f5a60d114abd98805f92ad
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-1ee9abde-12ca-4e28-b36f-b51c15576d97.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-1ee9abde-12ca-4e28-b36f-b51c15576d97.json
    media_type: application/json
    source_sha256: d85583a3fc6b8060fcdd77b148fe11442d0692a7d096c7caf07ede345734df55
    snapshot_sha256: d85583a3fc6b8060fcdd77b148fe11442d0692a7d096c7caf07ede345734df55
    entry_key: 61e01cc3f2d267636c8216c5edf8afee2744ce54880fe026682dd38b3bf5cfae
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-e861525d-c28e-40f1-a4fd-2061b37df0b0.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-e861525d-c28e-40f1-a4fd-2061b37df0b0.json
    media_type: application/json
    source_sha256: 59046b4d647c4b54ce0916cb06f87a228c83eb4916192a9be1614ddcad06b5a2
    snapshot_sha256: 59046b4d647c4b54ce0916cb06f87a228c83eb4916192a9be1614ddcad06b5a2
    entry_key: 626e43abaf5673b5680b01ff7f3b8178c27e4f65017123a33016ca490e31a62e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/49b055654de2-answer-1.txt
    media_type: text/plain
    source_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    snapshot_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    entry_key: 64d4df8f3d27545702ad967953383cbaad81bebeb8a942f4085c8a2e990fe6fa
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-23a993cc-469a-45fe-95a1-47b632187ec1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-23a993cc-469a-45fe-95a1-47b632187ec1.json
    media_type: application/json
    source_sha256: 079a27652838705095c7efd18e26cf94760d687c096293d5693b543ce716987c
    snapshot_sha256: 079a27652838705095c7efd18e26cf94760d687c096293d5693b543ce716987c
    entry_key: 64e94f76b12a6f97271ad1de856ff6b24209f93d262d3a467738a5d9b954e7a8
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C1-BASE-Q6.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/C1-BASE-Q6.json
    media_type: application/json
    source_sha256: 8b311b3cd23f95de7d16967a142771ec0d97bb032872124be7c8c554665772f3
    snapshot_sha256: 8b311b3cd23f95de7d16967a142771ec0d97bb032872124be7c8c554665772f3
    entry_key: 6519b302a2c7cb8f8d4fcb929c238b3250dbe12186e467bda6fb75482fdb56c3
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C1-BASE-Q1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/C1-BASE-Q1.json
    media_type: application/json
    source_sha256: 7c39973f3e630d5b4dde5ad3fd15f656f8bf20f9b638ba86778e28688ab77977
    snapshot_sha256: 7c39973f3e630d5b4dde5ad3fd15f656f8bf20f9b638ba86778e28688ab77977
    entry_key: 656d9f76664d519cb7ec5c0d8bd1ef659bf9ddff0f3b1636b2544fd7191489ce
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/52be41690c72-answer-2.txt
    media_type: text/plain
    source_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    snapshot_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    entry_key: 6586fa3a123af8bea9e06cf8da9125c9ade38d990990b15fc33a22de7ac16951
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/0db933efe65f-extraction-1.json
    media_type: application/json
    source_sha256: edb4a5f09442979bc78138c7b221ae16b3429750b7ae7101dcd18ae839231259
    snapshot_sha256: edb4a5f09442979bc78138c7b221ae16b3429750b7ae7101dcd18ae839231259
    entry_key: 667b408840285e9e6034d6b7f5d427340f7f97622c5ebf893eb1a0e0db69b427
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a95e24a57783-collector-2.json
    media_type: application/json
    source_sha256: 4f51ad28e59c4e1ab1eb9989b74613ec5e9c643d5fd5e759f3233828b3843cd9
    snapshot_sha256: 4f51ad28e59c4e1ab1eb9989b74613ec5e9c643d5fd5e759f3233828b3843cd9
    entry_key: 6895859a731df8253302898cbcad17ebecf4191521740f74746dcd5bea8f3bbb
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/1f439c030e1c-extraction-2.json
    media_type: application/json
    source_sha256: 481f170dd3311deb2daddcbb7f6824c7ebdc1dcb663069bd83433183890163dd
    snapshot_sha256: 481f170dd3311deb2daddcbb7f6824c7ebdc1dcb663069bd83433183890163dd
    entry_key: 68faf9246b497f10c95b67af93969588c6ba1d32c67a30a3417a0e61e64b0094
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-81af9940-2bfb-4bae-b530-5a957903313f.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-81af9940-2bfb-4bae-b530-5a957903313f.json
    media_type: application/json
    source_sha256: abd87938cd3802031eb8abf9b59b451f522c260c43f324dd7091c9ca0e14545a
    snapshot_sha256: abd87938cd3802031eb8abf9b59b451f522c260c43f324dd7091c9ca0e14545a
    entry_key: 6928c822e4f0cf03e9c0e186daefe796301742d020bd35d564765e8cc0dafdd4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/d108156e4e60-answer-2.txt
    media_type: text/plain
    source_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    snapshot_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    entry_key: 6b367aa6f38fa0476a4c9697d9b7c50b9d70510d70b611d9b2e0511e4a44a5aa
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/82f6eae9be0d-collector-1.json
    media_type: application/json
    source_sha256: 6aa4eb149153da9b974c1daa5b772834a73ae662a6b2891ac4c381d8194cc3bb
    snapshot_sha256: 6aa4eb149153da9b974c1daa5b772834a73ae662a6b2891ac4c381d8194cc3bb
    entry_key: 6c661d8d395ff82ab04e471c35b5ffb52ca8297a17495630965f193601bdffb4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a5c3e8a96c96-collector-1.json
    media_type: application/json
    source_sha256: 124663ff41ad6e52711389415f9e174b01ac868da322a21effc57aa3e5dda5f0
    snapshot_sha256: 124663ff41ad6e52711389415f9e174b01ac868da322a21effc57aa3e5dda5f0
    entry_key: 6c67bc7bff8ff24cf0f1ea6d2ce37954358563e05f1526c4d2cba17d21aeab6f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/8976cac64260-collector-2.json
    media_type: application/json
    source_sha256: cec1b39ace0639a11a78aa28a76bd1bcfe4f00f830e21d72b5a6b74ee091f847
    snapshot_sha256: cec1b39ace0639a11a78aa28a76bd1bcfe4f00f830e21d72b5a6b74ee091f847
    entry_key: 6c7db66415f330cdea0617614a272971f0901d47b64de03278f4b03b7c435aec
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f47c3f2dbb70-answer-2.txt
    media_type: text/plain
    source_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    snapshot_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    entry_key: 6cacb2f5255dfcc058c51482884e545fc8f6ef736858af4f6153323a4c207e60
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/22a3e070eb4d-answer-2.txt
    media_type: text/plain
    source_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    snapshot_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    entry_key: 6d02e447ffaf3d46aaac6a525a19017f91e49b38bb6662d264b855c5bf94006e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/92f8b81a74a7-collector-1.json
    media_type: application/json
    source_sha256: 0f2b4917a62e87f2b433905413cb53a53ccba34b7b12b52b1b3d0dbc4c643cd7
    snapshot_sha256: 0f2b4917a62e87f2b433905413cb53a53ccba34b7b12b52b1b3d0dbc4c643cd7
    entry_key: 6d669afecac77dcd28caca3a1114c0e2f2a90773b1ec92dd4aa4f976b7ad2ca4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/52aef18d4b82-answer-1.txt
    media_type: text/plain
    source_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    snapshot_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    entry_key: 6e9e9569718a43975cff58c1cc42d0598802c75e10a3dc28f983d6fdf72f89a2
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/18d16f430cda-answer-2.txt
    media_type: text/plain
    source_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    snapshot_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    entry_key: 6f274a392fbf96ceec2e170155cb0bea372f727b7f43fc85448b4ee46a65de99
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-22a07db8-6dd7-4031-a7c0-194bece73dfc.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-22a07db8-6dd7-4031-a7c0-194bece73dfc.json
    media_type: application/json
    source_sha256: a9ccb7955b785ea9de0930ae55c0f63f3bef211ca6e67a7da4cb7231fd884417
    snapshot_sha256: a9ccb7955b785ea9de0930ae55c0f63f3bef211ca6e67a7da4cb7231fd884417
    entry_key: 6f722ca817db1cfc19b2177b55c8f5d2da9bb5b3d6e4fa205c636ec963d09a3d
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-c77975b0-cc68-447d-b7cb-83cfdd69a236.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-c77975b0-cc68-447d-b7cb-83cfdd69a236.json
    media_type: application/json
    source_sha256: 3c448e527892f51fb227c77269a82e7172afd9aacf3d35f91d117d67a752f011
    snapshot_sha256: 3c448e527892f51fb227c77269a82e7172afd9aacf3d35f91d117d67a752f011
    entry_key: 71c3ca28b4272d826df361058304ffe0716979e10b3aebe839e2e6f2d72b5022
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/82d606f3fe83-collector-2.json
    media_type: application/json
    source_sha256: b358a87bcad8f56d5b9ae63e45d7ddc850c25f1a00ceb0df3666e5853b99e7da
    snapshot_sha256: b358a87bcad8f56d5b9ae63e45d7ddc850c25f1a00ceb0df3666e5853b99e7da
    entry_key: 766e7b569bdc0acd6d4de66816bbbfb6e75fde8a9cfc757807caf31fdaac8c7c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/beaf6ef52a57-collector-2.json
    media_type: application/json
    source_sha256: 5f51481dc9a6a43056aee37211b4e3bfaed173db20cdc9374597227150324085
    snapshot_sha256: 5f51481dc9a6a43056aee37211b4e3bfaed173db20cdc9374597227150324085
    entry_key: 7971414bd757feee9fb2352cdbe1dfa5de49bac70369cb05a0417dd52ad48485
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/3bc64428624d-collector-1.json
    media_type: application/json
    source_sha256: 66df9abbd6eee2e8138d57e57c10c469feae04045506682c5d2711bd7487a91a
    snapshot_sha256: 66df9abbd6eee2e8138d57e57c10c469feae04045506682c5d2711bd7487a91a
    entry_key: 7a7e54a587733e1fc202080bae82354a9fb538cef151bbcf60181f0a4d339d14
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/762285f7b46c-answer-2.txt
    media_type: text/plain
    source_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    snapshot_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    entry_key: 7c26af5a03a492626d93282ae36b49e4125cc6dd56ba292491f12a3f2a941fdf
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/7b48782bff26-extraction-1.json
    media_type: application/json
    source_sha256: f4d588759b5fba98d42403d6b460f5ad040e02e75a4c4bf365c60acff24cbe40
    snapshot_sha256: f4d588759b5fba98d42403d6b460f5ad040e02e75a4c4bf365c60acff24cbe40
    entry_key: 7d29a89c1a7ce773524e71e5a6c599032d2183ad1a4e8e1fde16698971df0319
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/c854ebca6018-extraction-1.json
    media_type: application/json
    source_sha256: ea37fb89cf5694aa7e099f81342b1cfe0df8f718a6e92ec5e7315e493f91fd31
    snapshot_sha256: ea37fb89cf5694aa7e099f81342b1cfe0df8f718a6e92ec5e7315e493f91fd31
    entry_key: 7dfe4ce4c45e6340900c28f546af3d468a46423e148dd532138aee6a24abaf75
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/8690428d3643-collector-1.json
    media_type: application/json
    source_sha256: c0c091f895576492a2bf4ed452397a2e52ff15fef03553ac4e708e0cf238d5f9
    snapshot_sha256: c0c091f895576492a2bf4ed452397a2e52ff15fef03553ac4e708e0cf238d5f9
    entry_key: 7f06986a3f4d0276cc3931c1a85c4c491a9e9a00e7524f11f1ff9a5abd974e4c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/ee3cc68f1dd8-answer-2.txt
    media_type: text/plain
    source_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    snapshot_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    entry_key: 81e01dd400bce048beb8aa9e279b51a5f5ad22d59dc6d2f570c46e42e3bc1eda
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f130e739ffaa-collector-1.json
    media_type: application/json
    source_sha256: 21fe01796c98f37695c0da70d7143c8c93c8832ca32064891eb1509a4cd60b02
    snapshot_sha256: 21fe01796c98f37695c0da70d7143c8c93c8832ca32064891eb1509a4cd60b02
    entry_key: 820c71641a8c77d5b938f86794d59b785c566e90fc2d1963f2fea6171ce1cea9
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GOOGLE-AI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f92b9867387e-extraction-2.json
    media_type: application/json
    source_sha256: 50bdf4c7c7b92f9a47c075ee3c6dfecbf5009690c1ed360218adcc486793dfc7
    snapshot_sha256: 50bdf4c7c7b92f9a47c075ee3c6dfecbf5009690c1ed360218adcc486793dfc7
    entry_key: 830b49ac3313520058bc9faaa679196756f251ba42064703966f3959401841c5
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/225ed38285e5-extraction-1.json
    media_type: application/json
    source_sha256: faa5f842ec2991d4e82b8c1e9a870dd189e3eeb709fff0e0629c238b6ec2ff7d
    snapshot_sha256: faa5f842ec2991d4e82b8c1e9a870dd189e3eeb709fff0e0629c238b6ec2ff7d
    entry_key: 84215c8c20cd20c62eeb66bd9ee8ead89a1662e59d9bedfb8e246b52aadafdf3
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-dba27fd1-f0ce-4176-84b0-dd0394586622.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-dba27fd1-f0ce-4176-84b0-dd0394586622.json
    media_type: application/json
    source_sha256: a9047fa2737baec84981434b652a1221b3d5bac222daa4ee5e67cece0495ba7e
    snapshot_sha256: a9047fa2737baec84981434b652a1221b3d5bac222daa4ee5e67cece0495ba7e
    entry_key: 858451874f967aa7477dce2bcc07f6c9ae3292eca1363940d0ebb6680e97208e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/84866c3e0947-extraction-2.json
    media_type: application/json
    source_sha256: f04e5d6b7055767638d1c10d8fffed0cdc167567fe16e4e35e47d540dba6ab20
    snapshot_sha256: f04e5d6b7055767638d1c10d8fffed0cdc167567fe16e4e35e47d540dba6ab20
    entry_key: 880f0dcb8d5ac33de8579596a7f064bf5b14d922942e6a1647e8070dc7e44415
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/bbacd85202c9-extraction-2.json
    media_type: application/json
    source_sha256: 70934488d7904912cffb1fb83bbb910b064787bc2459a9bec05ea25c9ca4eff4
    snapshot_sha256: 70934488d7904912cffb1fb83bbb910b064787bc2459a9bec05ea25c9ca4eff4
    entry_key: 8a1ee2171cdf0e754dc7f1925aa4fa76f1b617d93d74ea04926703c9504328a7
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/4af1e4021040-answer-2.txt
    media_type: text/plain
    source_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    snapshot_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    entry_key: 8a9b68fa3d909175458105eadd5953da7dd28aec249bff7fd5efb5a83677eb25
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CHATGPT/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/7c8e84c06110-collector-2.json
    media_type: application/json
    source_sha256: e171b7c3ce0438ae1cc4d2f5a8f9665c49d78c44170a33159c32f9675699d898
    snapshot_sha256: e171b7c3ce0438ae1cc4d2f5a8f9665c49d78c44170a33159c32f9675699d898
    entry_key: 8aee115e24bc9830989f9ff8422311de4337ef573f0451dda343fc7353424bcb
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/5ad499a77325-answer-2.txt
    media_type: text/plain
    source_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    snapshot_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    entry_key: 8b46ce9f194e92e28559ab9d07b617ac51cb4c5a9f2e4ba920b1824b23a6255a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/0499db4a0c8a-collector-1.json
    media_type: application/json
    source_sha256: 77e649b514930519ca19315ed9261219a6a0115f5983656b468ea51fd418f11d
    snapshot_sha256: 77e649b514930519ca19315ed9261219a6a0115f5983656b468ea51fd418f11d
    entry_key: 8ed8258ee63a9ad261581d64e69884860c6dd33757c2cae24ca8c3f38c259fb0
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/252834441837-extraction-2.json
    media_type: application/json
    source_sha256: 5bf4a2d863a2f7d2da668e34b05d424aade9d496aedb79cc74c7990fa0dbc058
    snapshot_sha256: 5bf4a2d863a2f7d2da668e34b05d424aade9d496aedb79cc74c7990fa0dbc058
    entry_key: 8fa75dc479cb65c1f0495fd2f2cb504c886af51cb34086768f0f84c5f89bbb4e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/7f635e297f89-collector-2.json
    media_type: application/json
    source_sha256: c44d5adaf0645d8058ae6575fe9c6401fde5a9fab0c8b539bfc934e02ed50f79
    snapshot_sha256: c44d5adaf0645d8058ae6575fe9c6401fde5a9fab0c8b539bfc934e02ed50f79
    entry_key: 939983a01d8fe216ac5cf448764f315956163d0f9fafd7239f4e5d587dd407ed
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-a2b7b3c1-2ca5-4614-a741-939926aa3b9a.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-a2b7b3c1-2ca5-4614-a741-939926aa3b9a.json
    media_type: application/json
    source_sha256: 6f81339f0f66cf99b702b5af080908ee25eeddabe386155e066b94511323fa00
    snapshot_sha256: 6f81339f0f66cf99b702b5af080908ee25eeddabe386155e066b94511323fa00
    entry_key: 95f3d3e325c6ebb11041e81cf215be37cda8e84d7fbbfcc637a07ddaf717ffa5
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/cc77ede350b8-answer-1.txt
    media_type: text/plain
    source_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    snapshot_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    entry_key: 97e2fc1630462cad94a21954976c83d820eaf8153e2114aaeae2fc57af39120d
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-37d99847-3e08-4276-a414-2052c07513a9.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-37d99847-3e08-4276-a414-2052c07513a9.json
    media_type: application/json
    source_sha256: 15e82ea001c3fcc81756fa1e2261b54f87fb73b9b6fa375fb403dbc64e38a770
    snapshot_sha256: 15e82ea001c3fcc81756fa1e2261b54f87fb73b9b6fa375fb403dbc64e38a770
    entry_key: 9862038141f323b8f6da3c384e337534aa8156d322b9898e8ef320a46730213c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/34ba6ec0adaf-collector-2.json
    media_type: application/json
    source_sha256: bb78e174d1401cb7cec2adb3aa8e27453f87d4a70f925a04ea4dd37c2242f4cb
    snapshot_sha256: bb78e174d1401cb7cec2adb3aa8e27453f87d4a70f925a04ea4dd37c2242f4cb
    entry_key: 9969b96db6774608577f69779438e5fdc0c8bf015cef81cca667208921ccbaf5
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-8d8fca07-b0e6-412a-b84c-1f3612c0dd28.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-8d8fca07-b0e6-412a-b84c-1f3612c0dd28.json
    media_type: application/json
    source_sha256: 12b8f09c80484df4ccce0ea40eb6cf4bca036012809fbd18ae5b704dcea5cee1
    snapshot_sha256: 12b8f09c80484df4ccce0ea40eb6cf4bca036012809fbd18ae5b704dcea5cee1
    entry_key: 9a1e266811d4a1814084d8e90158cd360f5de455bf6ddf524ebd9a6293dd4be1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f7dc2732635b-collector-2.json
    media_type: application/json
    source_sha256: d7a7554fac70f32f6f6a7bbacdeddc94b324eb8ba43c69afca58e0c035a58d52
    snapshot_sha256: d7a7554fac70f32f6f6a7bbacdeddc94b324eb8ba43c69afca58e0c035a58d52
    entry_key: 9b0f4ac6e5af413a9dba3bf0bfb0d350bc5d1b58fce0232f65fe6a3215e36a6b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/34e829e76f8d-extraction-1.json
    media_type: application/json
    source_sha256: 3147700a918551707c37e2e3fb9d48624e3a8b3dbaefc3b5a9e3394b18a8118a
    snapshot_sha256: 3147700a918551707c37e2e3fb9d48624e3a8b3dbaefc3b5a9e3394b18a8118a
    entry_key: 9faabd99a2071249f1ca365cd42f8ca11e3592090e13211601679cf42eb6ae5a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/b90ef6cdd0a2-answer-1.txt
    media_type: text/plain
    source_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    snapshot_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    entry_key: 9fb936ee18a4423085d3fdac868f432920ba875de58fed993399d87c0bcd027f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/e7ad4a3797a4-extraction-1.json
    media_type: application/json
    source_sha256: 8f87bbcf552124386e06be66ba7fccec77fe81ffef1f747b9481bccdc41eddda
    snapshot_sha256: 8f87bbcf552124386e06be66ba7fccec77fe81ffef1f747b9481bccdc41eddda
    entry_key: 9ff62c0146e2fb7ff163a95175d0d1531b748cea35c0d01b44c88d1912a1f0c1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/5cf21d0dcf70-answer-2.txt
    media_type: text/plain
    source_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    snapshot_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    entry_key: a05be2c4a23c25f6226db4911fdd987397063df94eed479af7374042791105ac
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/3c2c4cf3dc09-extraction-1.json
    media_type: application/json
    source_sha256: 9dac05a519424413c3bea0b8eab2228541ffa904d3ae3782a5018f24fb0b2020
    snapshot_sha256: 9dac05a519424413c3bea0b8eab2228541ffa904d3ae3782a5018f24fb0b2020
    entry_key: a32ad45748d47c475e327005c460eb1849d970bf4abbffb8378be11bcbc7bed8
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-efda5ae5-a717-42ce-b485-c80b9cac5efa.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-efda5ae5-a717-42ce-b485-c80b9cac5efa.json
    media_type: application/json
    source_sha256: 4e6926bdea1e8c72285f188dc3dca98e923de39c8e90702ba6d95acc9c4188e2
    snapshot_sha256: 4e6926bdea1e8c72285f188dc3dca98e923de39c8e90702ba6d95acc9c4188e2
    entry_key: a41e118e12165a6cb6c82aa00abb1a189d72ef8a8b76b2e4b87c30b8cdcaccb6
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-61c9ab36-5c83-4dc6-8c52-6d5d1332d496.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-61c9ab36-5c83-4dc6-8c52-6d5d1332d496.json
    media_type: application/json
    source_sha256: e9408aa237894b177117f3f96d4bfaa0f2b1989f7977e7ea5162c16acffca331
    snapshot_sha256: e9408aa237894b177117f3f96d4bfaa0f2b1989f7977e7ea5162c16acffca331
    entry_key: a466ef4beb6d7b5ff0128cbfa2a0b9f15e86175775a2ec3679b890f3888d27d0
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/98a56b006a51-extraction-1.json
    media_type: application/json
    source_sha256: 0466da81bfc333c124f3bdc61b58010295d13ee69d20e1686ff6fd53cddcb451
    snapshot_sha256: 0466da81bfc333c124f3bdc61b58010295d13ee69d20e1686ff6fd53cddcb451
    entry_key: a4c5f6f6631a6c8070aee72155851ec658297cf0d75513dfcc3c46bce3f39099
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-f9838c91-5763-4f95-8c25-f33385a22e05.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-f9838c91-5763-4f95-8c25-f33385a22e05.json
    media_type: application/json
    source_sha256: 9a479e9dc88fe136e8e41921404c2756f2f2ee27f4a6a9cdb3956d165939627a
    snapshot_sha256: 9a479e9dc88fe136e8e41921404c2756f2f2ee27f4a6a9cdb3956d165939627a
    entry_key: a585fe72cb3fd7046f3d610b438f9e2fd6f3993974310da827123ace36b02fbd
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/efb73d6f426b-answer-1.txt
    media_type: text/plain
    source_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    snapshot_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    entry_key: a60365ad9b4d8672fffac6debff9b08a1301bb5070a365062c444ecc008e3f3e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/58ff57c51f36-extraction-2.json
    media_type: application/json
    source_sha256: 4f7b6ba6092d79411080431c28e812031b7abcaf155d285b59eaccb12b4b7c3d
    snapshot_sha256: 4f7b6ba6092d79411080431c28e812031b7abcaf155d285b59eaccb12b4b7c3d
    entry_key: a699b9ba923ef85bc01774068254b80ecfe06763699086d778f4c9d401314919
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-e4835a0e-87ac-4442-a2de-a25b59b11382.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-e4835a0e-87ac-4442-a2de-a25b59b11382.json
    media_type: application/json
    source_sha256: 7bb2cf937ed3df31d6b8a5efbaec218ec4d8f23192c15eb23e9869dd6794e9f4
    snapshot_sha256: 7bb2cf937ed3df31d6b8a5efbaec218ec4d8f23192c15eb23e9869dd6794e9f4
    entry_key: a6a1d52b3cc6ae5e3cb469ff01408eb4d46459040d0c54bc6790ffe04e0c5424
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GOOGLE-AI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/2561ca412c87-answer-1.txt
    media_type: text/plain
    source_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    snapshot_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    entry_key: a74a3fe83d3f6bb15a8774058a4046ffc81db28735c0d0b3bbcc5bc1038a1f2c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/8b38f1254e24-extraction-1.json
    media_type: application/json
    source_sha256: 77d4d94aca3e8b2928dc5c42d69cf81bcc6ed9403c33ee9efe1c233a28a7b1b9
    snapshot_sha256: 77d4d94aca3e8b2928dc5c42d69cf81bcc6ed9403c33ee9efe1c233a28a7b1b9
    entry_key: a7bb9cac0fa6f07966dbc135368a30144af7bfcdfa8d5225d00132836f2579be
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/b2175d5ca1ee-extraction-1.json
    media_type: application/json
    source_sha256: 1d94953d2840ea45be65d695c2e7092793b7252bfd297c12dd350dc8563e8ce9
    snapshot_sha256: 1d94953d2840ea45be65d695c2e7092793b7252bfd297c12dd350dc8563e8ce9
    entry_key: ac322b1c8426780e89519c58fb753e5da579f9ff92044895ed58a69c0a4da27a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/ac676a61d8d5-collector-2.json
    media_type: application/json
    source_sha256: 63e044bcfe44b969cbbaecadad0808f42033e7d93933ccd56e171fc604e2003a
    snapshot_sha256: 63e044bcfe44b969cbbaecadad0808f42033e7d93933ccd56e171fc604e2003a
    entry_key: ad5a2d0bdb506fd9fec087bb9530ce9eff0adb408edd089a4846a899d26f3dc3
  - role: supporting_artifact
    source_path: cycles/m5/analysis/C1-BASE-Q5.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/C1-BASE-Q5.json
    media_type: application/json
    source_sha256: 1b70034d1c1c86342f621e2502da31d0dd9437033f29a7b07d5486b498c6eddc
    snapshot_sha256: 1b70034d1c1c86342f621e2502da31d0dd9437033f29a7b07d5486b498c6eddc
    entry_key: ae3eade23808616f8a2a08e40508902de26b4df85d7a5e6f04227127857301d3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/5feebe2ea469-extraction-1.json
    media_type: application/json
    source_sha256: 247dc4ec31694fdc147206f12e6d5eb2e67d827a58f59690e52b2391be3a662b
    snapshot_sha256: 247dc4ec31694fdc147206f12e6d5eb2e67d827a58f59690e52b2391be3a662b
    entry_key: b3076882ccd303c53652ba8493b31117fcd077d816367ee69d5d0b5f974e8290
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/72058131360d-extraction-2.json
    media_type: application/json
    source_sha256: 360b16a06fe6181f20da29d58a6a7e7c9d4f33a8d615696e0c85419adfbfb9c9
    snapshot_sha256: 360b16a06fe6181f20da29d58a6a7e7c9d4f33a8d615696e0c85419adfbfb9c9
    entry_key: b342223faf6348cc604356bb676e81fe40675d1f9bbf996f8859f8f7b53b00d0
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-83010587-9014-4596-a926-0b93d56d4912.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-83010587-9014-4596-a926-0b93d56d4912.json
    media_type: application/json
    source_sha256: 349308e1a99c8d5ff037dd03afd82300dc4c58f84144457e357a71bd04ab5d98
    snapshot_sha256: 349308e1a99c8d5ff037dd03afd82300dc4c58f84144457e357a71bd04ab5d98
    entry_key: b37d910c036d2291ade6717b794680a60c5ac978abc192a71799e8195fb4b186
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/d085f40c5601-collector-2.json
    media_type: application/json
    source_sha256: c6135d4e5fdedd08747defe266ced4ffeabd60dcf390909dc1dc083331517d72
    snapshot_sha256: c6135d4e5fdedd08747defe266ced4ffeabd60dcf390909dc1dc083331517d72
    entry_key: b4795e5fe6e98c20b23b269131c8bc4b114f47f4f47eb470aa18e4ee2afe6f12
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-d7072eef-561c-461c-9408-6b1bad4d3d84.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-d7072eef-561c-461c-9408-6b1bad4d3d84.json
    media_type: application/json
    source_sha256: 5be1b0a35abc6795e5210546b292bc098fdc37e4e20782a4c22641977e5418d2
    snapshot_sha256: 5be1b0a35abc6795e5210546b292bc098fdc37e4e20782a4c22641977e5418d2
    entry_key: b4b20b11626930938ba03ff3931b361b0ec94801bf7eb89a2338969dadaa0a17
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/be23ab9b5847-collector-1.json
    media_type: application/json
    source_sha256: 9d9e0c95b51ce127fa01de265fc2560427d0771bcf806459fb0fdf47ab077eb1
    snapshot_sha256: 9d9e0c95b51ce127fa01de265fc2560427d0771bcf806459fb0fdf47ab077eb1
    entry_key: b4c53977832a498cc8b4d0faf8752f493f0a1ee3ffb8b7f47b4319c9b88e897b
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-33809086-d003-46b1-82e3-85fc763ef948.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-33809086-d003-46b1-82e3-85fc763ef948.json
    media_type: application/json
    source_sha256: f1581ba82ffba6b20a9b0ccc8ae6eae9d380bf9fe78d86a9a338aef06b5cb0ea
    snapshot_sha256: f1581ba82ffba6b20a9b0ccc8ae6eae9d380bf9fe78d86a9a338aef06b5cb0ea
    entry_key: b4cc28969f3c1c06eecba1b96f1b2b3d50b9020d876cf8e0e2578f15d309bef3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CHATGPT/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/4a49548c8464-answer-1.txt
    media_type: text/plain
    source_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    snapshot_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    entry_key: b5da48ebbfc04899d72ddf6a2a5875165d452393d342271c498f368f80cae6ff
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/105e94ae36e5-answer-1.txt
    media_type: text/plain
    source_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    snapshot_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    entry_key: b5f7edbdeabf05e9308e4102656450e52092d2fef8d0102a4ddd7cc24c331da1
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/c1b71b32285d-collector-2.json
    media_type: application/json
    source_sha256: fe3912ff2ae46372e4a9e84a41e80ce6e6e7e36f3a464f12d933af2733b3aacf
    snapshot_sha256: fe3912ff2ae46372e4a9e84a41e80ce6e6e7e36f3a464f12d933af2733b3aacf
    entry_key: b6e8612a5a5545e2bef69969d5f1df8a97e17a5011162a844311fe2c51cdce03
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/85c58d3210e7-collector-2.json
    media_type: application/json
    source_sha256: 61d3c79f9bdb5d22ed1a16204fef7b8fd4d91947e01fb089cb6963efface02e1
    snapshot_sha256: 61d3c79f9bdb5d22ed1a16204fef7b8fd4d91947e01fb089cb6963efface02e1
    entry_key: b82143c16547f673eab0d4868e53d0b40e118df7c93eae195fd5f77f5dfa2e50
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-PERPLEXITY/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/9169ab98040e-collector-2.json
    media_type: application/json
    source_sha256: 374336cd9c01cc35e8626405e370b136a3a43319e255c2e0e278fbaf9c515913
    snapshot_sha256: 374336cd9c01cc35e8626405e370b136a3a43319e255c2e0e278fbaf9c515913
    entry_key: b8cbabc247cae73f5862fd4a64a167aa261194ecca8e9135b6c9f460c95d0623
  - role: measurement_contract
    source_path: execution/contracts/measurement-contract.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/measurement-contract.json
    media_type: application/json
    source_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    snapshot_sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
    entry_key: bb2232ca6638930fdaa8b3cc5f62925add95e7640ca96b9ef3124f778669a009
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f8de86727912-collector-1.json
    media_type: application/json
    source_sha256: 082acff9fccceef878bc546fa27afc779bb2612b8aa5adeb8a9c5c8728430eb9
    snapshot_sha256: 082acff9fccceef878bc546fa27afc779bb2612b8aa5adeb8a9c5c8728430eb9
    entry_key: bc0e5537c8ae553e41fc4bbc9b8e1a277e40a7ddab1ae6ac71e488f4a4a5c8cb
  - role: other_contract
    source_path: cycles/preparation/matrix-C1-BASE.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/matrix-C1-BASE.json
    media_type: application/json
    source_sha256: 44d81c49cbe3bfb13ca43cd969190e81d2d990b97331980557f4eb13e6a0bf8d
    snapshot_sha256: 44d81c49cbe3bfb13ca43cd969190e81d2d990b97331980557f4eb13e6a0bf8d
    entry_key: bc31d8947c34a3134e1ba96104c2d14d8bc65d25ef37cf042e394b8bb314881b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GOOGLE-AI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/cfbe9a5ebf79-answer-2.txt
    media_type: text/plain
    source_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    snapshot_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    entry_key: bc6b081d46007537c31d0a468cb7937f7035e2bab16da50f4f281f32c28ba480
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/38a76bd6fe23-answer-1.txt
    media_type: text/plain
    source_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    snapshot_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    entry_key: bc7bf0a4021868ba29741dd9b002f2a25724b2d927bf4279708c5df92294082d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/5030c1aa2299-extraction-1.json
    media_type: application/json
    source_sha256: 9d9bd70c1fa90ff50365e7371cfe45260f2617f29e324c189cb836af1791b570
    snapshot_sha256: 9d9bd70c1fa90ff50365e7371cfe45260f2617f29e324c189cb836af1791b570
    entry_key: bc8b3840fe9e712d40f4093ef26030f1b0902110fda0ea16284e39d79212abdf
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/6447691b3ebe-collector-2.json
    media_type: application/json
    source_sha256: cff95b5e3ae6256c9e7c05ea4320ac96099051c21d7e9f5933c1256e8c023770
    snapshot_sha256: cff95b5e3ae6256c9e7c05ea4320ac96099051c21d7e9f5933c1256e8c023770
    entry_key: bccb5518fa1f3fd637ed04b268ba92dbef210a66c211ef65ffbeb46a519473e9
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/90da04209dde-extraction-1.json
    media_type: application/json
    source_sha256: 44556102246a29807436666c4d924e2fc971ec4110851b6dbfb19dc01a84c392
    snapshot_sha256: 44556102246a29807436666c4d924e2fc971ec4110851b6dbfb19dc01a84c392
    entry_key: bce4e270c6d97acb3480813c0e1391eba274f7609455f0d12b8bcb2a1f56aea3
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/cfe373529e62-answer-1.txt
    media_type: text/plain
    source_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    snapshot_sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    entry_key: bf055d26135b6e48ee245315f1768b3aeab27dcd23c92c650708e94ca472187e
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/70184e9978cf-answer-2.txt
    media_type: text/plain
    source_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    snapshot_sha256: 09e88098261c305b6836de166ab2102c88205de9bdf2146bbaa5cebfc9ed75c3
    entry_key: bf2e007ba22d48566637339953395e6ab6f2c1b55c79fa1128d0f97e8d53d752
  - role: supporting_artifact
    source_path: reviews/packages/OWNER-C1-BASE-ANSWERS.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/feafd4c25b3a-OWNER-C1-BASE-ANSWERS.json
    media_type: application/json
    source_sha256: fdd3678d49250b1cc4d2fbbdb8f794b4cc7296b06537d06d6b5ec47a2ed6a0db
    snapshot_sha256: fdd3678d49250b1cc4d2fbbdb8f794b4cc7296b06537d06d6b5ec47a2ed6a0db
    entry_key: c0aa4ad67d4fcf45bf51fb6f3519cd64ccc564e365f0d04ef5363e42d7d9e163
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CHATGPT/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/44480a6efabf-answer-2.txt
    media_type: text/plain
    source_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    snapshot_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    entry_key: c0f2972f6e5c88b90fa5263eb8b27191b341808ba3fef62ed6e1272f2aa24041
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f8d6faa86fc1-collector-2.json
    media_type: application/json
    source_sha256: 96f4914dba0cbf0d448877a0b5d00206a0781eadf6ac4dcdc08c9b1521859a86
    snapshot_sha256: 96f4914dba0cbf0d448877a0b5d00206a0781eadf6ac4dcdc08c9b1521859a86
    entry_key: c1546842ea248891fb73c4050db5fc81318dc105101d7e4874472793020ce778
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-8da6ad80-a623-4f4d-8bef-5e0552fba82a.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-8da6ad80-a623-4f4d-8bef-5e0552fba82a.json
    media_type: application/json
    source_sha256: c1e51910bfc9f3e2cf74c772f5d8196031f9ec93b2be64c1421f0d4f33cdd1df
    snapshot_sha256: c1e51910bfc9f3e2cf74c772f5d8196031f9ec93b2be64c1421f0d4f33cdd1df
    entry_key: c1eb5b188d5864f829b8599b33c6af2ad5b99dcfdd28df15833cbb807b2ae54d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/0c953fbc4914-collector-1.json
    media_type: application/json
    source_sha256: f4b0391d997a7cdf66ab7dc69c2e45cc9174c1d9f4a77b0526d5b0cba71b201c
    snapshot_sha256: f4b0391d997a7cdf66ab7dc69c2e45cc9174c1d9f4a77b0526d5b0cba71b201c
    entry_key: c24669f1747db9d036e4b6da916b59ce488d731915044c93501e2ec3392bd116
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-02a81a17-e6ee-4d61-b57a-532b02e96846.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-02a81a17-e6ee-4d61-b57a-532b02e96846.json
    media_type: application/json
    source_sha256: 3fdd642e7e63ef2d5777391e44cf891de9610f849d8cd91f8ef1b1cb0ec9acf5
    snapshot_sha256: 3fdd642e7e63ef2d5777391e44cf891de9610f849d8cd91f8ef1b1cb0ec9acf5
    entry_key: c319204b2ee483532b7a29e1e0bbc3d3d586d80bb5ca2f0d8624a66c98b67417
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/763cbf7cd4fe-answer-2.txt
    media_type: text/plain
    source_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    snapshot_sha256: 39990bbdabda1011a05db39e6e852bbb5a43a747c5bc99ee9e778c1740ceba69
    entry_key: c335bbbd37b2ded0a2306dda27249f13250022078034e7bb6561b016891f7059
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/e1d3a937c890-collector-1.json
    media_type: application/json
    source_sha256: 528325e131824b411769346cb0286f00a739d625192b20d0c12261e037468468
    snapshot_sha256: 528325e131824b411769346cb0286f00a739d625192b20d0c12261e037468468
    entry_key: c36f09d33c05219d5c043a4a2f59d0e103ecd9bf8a6d4508dc70fd787e0783bb
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/68892783559d-answer-2.txt
    media_type: text/plain
    source_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    snapshot_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    entry_key: c3a6b7c7826cdeb5fee840b1d50508c8d7bb5a1365f2654e507967fce0f8d746
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/eee4b9f9f5b7-collector-1.json
    media_type: application/json
    source_sha256: e22f9b0a5a6fe59b24bb76128bb0b3cce4485112a992e372cbae5b905123b993
    snapshot_sha256: e22f9b0a5a6fe59b24bb76128bb0b3cce4485112a992e372cbae5b905123b993
    entry_key: c3ce5a76d856259bba930aee7dd81aab9a550523e92ce064ca1179fb56fca5a5
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-0e435af7-1bcf-4d26-9442-12747a4d854c.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-0e435af7-1bcf-4d26-9442-12747a4d854c.json
    media_type: application/json
    source_sha256: 962bb7ea93c1a24a0b69e112317e23aa2ebdca595cd33d1ec526979567f5ef82
    snapshot_sha256: 962bb7ea93c1a24a0b69e112317e23aa2ebdca595cd33d1ec526979567f5ef82
    entry_key: c63b91103646fdd23cbc2482359788fc797f55eee2858bd9392aecd4525d6513
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/d0da693da927-collector-1.json
    media_type: application/json
    source_sha256: 71831dfd886be7fe3564b8d781bec5f1754431e7037a542a6f9adeb353aef4d7
    snapshot_sha256: 71831dfd886be7fe3564b8d781bec5f1754431e7037a542a6f9adeb353aef4d7
    entry_key: cc0472831fb11887f22bb53ad11daf4fed565ac2c89bbbeb2c5e92323fed2757
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-d284ead9-2a69-47cb-a297-ef5a3dbd3bee.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-d284ead9-2a69-47cb-a297-ef5a3dbd3bee.json
    media_type: application/json
    source_sha256: 6be7379f94cf606ef2b99339b65d50b8d989e9deb4d7253077408fd5544b0733
    snapshot_sha256: 6be7379f94cf606ef2b99339b65d50b8d989e9deb4d7253077408fd5544b0733
    entry_key: cc3568db13e06c5e81deb11a1e6b229e901a30ed355095ef77530417e9dd06eb
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CHATGPT/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/e2d2f88841db-collector-1.json
    media_type: application/json
    source_sha256: aec04f5997481a9ae4d97f778510b641ab8d7f2941e3b4fc22fdd328b2b67e35
    snapshot_sha256: aec04f5997481a9ae4d97f778510b641ab8d7f2941e3b4fc22fdd328b2b67e35
    entry_key: ccd589a9d70fe8e3adf6f9550c11e0f41d98186dbdd70b5f25fef3cf2471e8a5
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-27a75a97-a4dd-480d-ad8b-fcde762b05b4.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-27a75a97-a4dd-480d-ad8b-fcde762b05b4.json
    media_type: application/json
    source_sha256: e14c6982c4a0b53338250210069d88e15e3fbcf00568ef0fbe9f810853f50487
    snapshot_sha256: e14c6982c4a0b53338250210069d88e15e3fbcf00568ef0fbe9f810853f50487
    entry_key: ccf9e3176fd520cfb79c233bff8501e611f7e423de9bd6495aa2d38ef63cc406
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-1187fd98-6181-4faf-b189-a1a9f4174750.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-1187fd98-6181-4faf-b189-a1a9f4174750.json
    media_type: application/json
    source_sha256: a849cb5ac8c952e19bec61b7da3b88ba19551cb1a56d36e189906776c2d844a2
    snapshot_sha256: a849cb5ac8c952e19bec61b7da3b88ba19551cb1a56d36e189906776c2d844a2
    entry_key: ce97572663aa9ddd229370b7ef0ed6855d251188c9a04f824246a6848a852668
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f6d8d9348792-extraction-1.json
    media_type: application/json
    source_sha256: 4b409fb95ec6dcc516be8087e5f0d6362839c01d9e74bef951d659a6150480ae
    snapshot_sha256: 4b409fb95ec6dcc516be8087e5f0d6362839c01d9e74bef951d659a6150480ae
    entry_key: cebfad874e024cc324cfd41f66137cd4ed30c04db8651870646d927ad795ff08
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GEMINI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/930c4e83a77d-collector-1.json
    media_type: application/json
    source_sha256: dea192c958ddda8065ba4885303c377c85c73ad12f36df908fbfd82c546d7c30
    snapshot_sha256: dea192c958ddda8065ba4885303c377c85c73ad12f36df908fbfd82c546d7c30
    entry_key: cefc39b6d473bdd072bc8692833cfec6353317213d5c2ea5138f24d6d80b3d06
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a60a6b468869-answer-1.txt
    media_type: text/plain
    source_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    snapshot_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    entry_key: cfc3e899d97585bb094471384abb753853cc92d462694fd4f5f07ea5acadc16c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/1397bfb0ec47-answer-2.txt
    media_type: text/plain
    source_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    snapshot_sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    entry_key: d10263b26a6a9ea51c3f4b5ab1e77ae7158e2207390ffc37cd1ea4d7e1131a03
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/9b3062b01ea4-answer-1.txt
    media_type: text/plain
    source_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    snapshot_sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    entry_key: d3790e9a4d967020a7752ba0fe6641ed2370ed771efb39026a0d702eb3901608
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/e2b138f5b57a-extraction-1.json
    media_type: application/json
    source_sha256: 275648df2bac94b24267b9a8444ec9ba8afeb7c462584028a89ac4e92c2081ef
    snapshot_sha256: 275648df2bac94b24267b9a8444ec9ba8afeb7c462584028a89ac4e92c2081ef
    entry_key: d5de4524eccfa43b58371b5f2c97fd209db20262615d42b680660e40ab879f5c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2efa6d08-745e-4843-8979-02e5424b4edf.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-2efa6d08-745e-4843-8979-02e5424b4edf.json
    media_type: application/json
    source_sha256: 21ecd7d4cf58550c7fb5a913a0f8dd4c6d11cb2fffa847f7da2282b5fe0a6273
    snapshot_sha256: 21ecd7d4cf58550c7fb5a913a0f8dd4c6d11cb2fffa847f7da2282b5fe0a6273
    entry_key: d5f00a3dccc9753b8f6f8a757e84e999b40a388e42eb0c4dd2c15ead91fb24cd
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/7d2d591dd02d-collector-1.json
    media_type: application/json
    source_sha256: 88629a43327b1a877e746a9f9f0f33ae7b3e50717d80f50beb1cd433f93246d5
    snapshot_sha256: 88629a43327b1a877e746a9f9f0f33ae7b3e50717d80f50beb1cd433f93246d5
    entry_key: d632803f72c8fcc5149fb8e687fe59ec71c549ec643e58fc7509b3aa92f2e3a6
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/04b4a5ba7299-collector-2.json
    media_type: application/json
    source_sha256: c6be31819bfb561862f22e1cd9591a39088e00f7d351e67554f436c7a8d419eb
    snapshot_sha256: c6be31819bfb561862f22e1cd9591a39088e00f7d351e67554f436c7a8d419eb
    entry_key: d76c1d86df9e6fe1845f017210e41c3019a65a171210a8f4227f4aeeedcb7c32
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/53e87d2daccd-collector-1.json
    media_type: application/json
    source_sha256: aefacb651f0948c7c5bd73364b38e9b59d9c2454b11c8f4dd81194855a0cac9b
    snapshot_sha256: aefacb651f0948c7c5bd73364b38e9b59d9c2454b11c8f4dd81194855a0cac9b
    entry_key: d7ff9b0726b0a99e63ac18a9b20b91733954480b00ab6015d26db53fdb85db09
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/3b937103be23-answer-1.txt
    media_type: text/plain
    source_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    snapshot_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    entry_key: d8bbdd4968ab02fc958835213fc0800b2b90b9b99de7f9d0f68982a327471bda
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/2625574cf99f-answer-1.txt
    media_type: text/plain
    source_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    snapshot_sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    entry_key: d99d81e9f64cb856104a76cd2d85f93f1a3496beb0353c94c0e0fd9927534731
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/3ed3c9c79a28-answer-2.txt
    media_type: text/plain
    source_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    snapshot_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    entry_key: d9bfd853e7bb2af9ac25a0e15fdebd8cac805c15f3ace7e4f417e6057c5fe1ab
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-PERPLEXITY/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/01f436045d5a-collector-1.json
    media_type: application/json
    source_sha256: ef2221a8d4d64c3011d59be6b74e6cf6286d06b68215b54213f5e27605ee5a61
    snapshot_sha256: ef2221a8d4d64c3011d59be6b74e6cf6286d06b68215b54213f5e27605ee5a61
    entry_key: da1cf8918b1bb3e6bd5672f73d2a9db434105cbeed31f01edca1775f008efb70
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-94ff19e1-e26c-4b91-9eb1-202cd2d12e4a.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-94ff19e1-e26c-4b91-9eb1-202cd2d12e4a.json
    media_type: application/json
    source_sha256: 54f375c0c79dd307fb232e787ecf1bd6945ce2c75d884544a29a57abe2d31d66
    snapshot_sha256: 54f375c0c79dd307fb232e787ecf1bd6945ce2c75d884544a29a57abe2d31d66
    entry_key: da4f9f9745906d2e626b72d3277c76cb40167264281664322b216a398cf3a501
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7ab1657b-5f37-4ff4-9dfd-eeac7f591fc1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-7ab1657b-5f37-4ff4-9dfd-eeac7f591fc1.json
    media_type: application/json
    source_sha256: a530c168559bd5900f73bbc38c22818e31e9886ac6281860b7837dafff5eeeb2
    snapshot_sha256: a530c168559bd5900f73bbc38c22818e31e9886ac6281860b7837dafff5eeeb2
    entry_key: db7183482cae69bfff9aa013a47888fc4c8a4bee92e74ab9b79e88e190d20a38
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/5c382f582369-extraction-1.json
    media_type: application/json
    source_sha256: d5c09f83125501199941971580da9c9a644d8db771c0e5ac6c043082bf3071be
    snapshot_sha256: d5c09f83125501199941971580da9c9a644d8db771c0e5ac6c043082bf3071be
    entry_key: dc4aae68d5f32b6a92ded13b10bc3480fa4d59673167d1f771c551d852705e10
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-c64f0f4f-fe20-4721-9685-c371f1cd2dc0.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-c64f0f4f-fe20-4721-9685-c371f1cd2dc0.json
    media_type: application/json
    source_sha256: 95e9ab71aebe53f5d64163bb5afcb20e73df37822e4a1bae38a56b18ac4f6791
    snapshot_sha256: 95e9ab71aebe53f5d64163bb5afcb20e73df37822e4a1bae38a56b18ac4f6791
    entry_key: ddc190210284cb9e1d9ac9650fee84fffe82b3bcc59a41db17f8cff486195ef5
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CLAUDE/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/2079b0a63492-collector-2.json
    media_type: application/json
    source_sha256: 756c9321dc0436fb424776c5785f45fdab48587d3883f243ea758f10b7ee16f6
    snapshot_sha256: 756c9321dc0436fb424776c5785f45fdab48587d3883f243ea758f10b7ee16f6
    entry_key: de571e707ccd5c82cab13d2e5c4775fc5939ea41bc6320aadb89e2f406b3b041
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/2d01a461e5fc-extraction-1.json
    media_type: application/json
    source_sha256: 07d78e6f9934391d6d681659f06fc630c20e1876ca1b88ceb31c0549f9c89777
    snapshot_sha256: 07d78e6f9934391d6d681659f06fc630c20e1876ca1b88ceb31c0549f9c89777
    entry_key: df94d4225f5f8ba74ae6f8f45db846e91f08f0fc1d94a4f47cd9a4b15245912d
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-d072da06-2923-4997-95a0-2ebd0cbd263b.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-d072da06-2923-4997-95a0-2ebd0cbd263b.json
    media_type: application/json
    source_sha256: 6473d72ab842dedc01283357daf34fbd88ab0f28760964fd24033fce9d4ffe61
    snapshot_sha256: 6473d72ab842dedc01283357daf34fbd88ab0f28760964fd24033fce9d4ffe61
    entry_key: df9648740430d77b7f7d93dcdfc7cf94c9647dcf3943f6d9f10a4af62fe9c31c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-4a2c3eed-85a5-4d0d-bae5-cc9d6cce9445.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-4a2c3eed-85a5-4d0d-bae5-cc9d6cce9445.json
    media_type: application/json
    source_sha256: 13a3170182ba42874587ce007117c2b935596c03f8fe8011fb55e75a8b72fee0
    snapshot_sha256: 13a3170182ba42874587ce007117c2b935596c03f8fe8011fb55e75a8b72fee0
    entry_key: dfe475f5dfc06547474c2e6f695fb54324a79f7cede61f9a3358d47e2ecd57b4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/6bc1941a63bc-extraction-1.json
    media_type: application/json
    source_sha256: 082f2ad1d363e64b2a207ef7e7fdca94f2c565f7351c46e05e8f1a452a658773
    snapshot_sha256: 082f2ad1d363e64b2a207ef7e7fdca94f2c565f7351c46e05e8f1a452a658773
    entry_key: e209022e54562d10c3ad8e9498efd5f0a97700f6b70ff120243cb477cd26609a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/ae78f8cc6c34-extraction-1.json
    media_type: application/json
    source_sha256: 9e8ab1018d6765da546caa84e2233e137960f286c2658768ecda76c4f0bff29b
    snapshot_sha256: 9e8ab1018d6765da546caa84e2233e137960f286c2658768ecda76c4f0bff29b
    entry_key: e2ea3ff5edaf7757c67aff5cc517088899c831160e6f4be3bf9b1f9cda4c2497
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/4473df0cec83-extraction-2.json
    media_type: application/json
    source_sha256: 2b8fd95fa327854e88e9674c9b15466949b6767caefeee00e5947e41abd8a7a2
    snapshot_sha256: 2b8fd95fa327854e88e9674c9b15466949b6767caefeee00e5947e41abd8a7a2
    entry_key: e466a0e98c3054f7422ec758dbd3c65c946c58e98f59e795c08c23c220cc6c99
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-GEMINI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/ab4bc913ace2-extraction-1.json
    media_type: application/json
    source_sha256: 44d1a143433803593f13f02c59725383af4892217b790a02bbea5d1fe7a08262
    snapshot_sha256: 44d1a143433803593f13f02c59725383af4892217b790a02bbea5d1fe7a08262
    entry_key: e479b07027c8222b5debb5ed3240cc39a64a9e342401ebcbd2b90e91cc913677
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/3f85046f5d81-collector-2.json
    media_type: application/json
    source_sha256: 00a3c06f486f6e5731fc4874b0bf601405338e34b3c1c4868b1ec1fcc1949b7b
    snapshot_sha256: 00a3c06f486f6e5731fc4874b0bf601405338e34b3c1c4868b1ec1fcc1949b7b
    entry_key: e4c8ee8534ee9e5355f7875c789e2964c0f0cea871cc5149449abf17d31c66e2
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GOOGLE-AI/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/122834cd33dc-collector-1.json
    media_type: application/json
    source_sha256: 79072794e32e7a5c3e4d09b21adffd610eb2a7d6181b8228844db63e96458691
    snapshot_sha256: 79072794e32e7a5c3e4d09b21adffd610eb2a7d6181b8228844db63e96458691
    entry_key: e4dcbe539642211daa233255cdd9764059921b4392b24e005c76f0aad59cea60
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/raw/collector-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/1f09d100f8f0-collector-1.json
    media_type: application/json
    source_sha256: 8d8825921c70d205928db0b9c4d7abad41a29c7d9a4123eef8a836849f6fa301
    snapshot_sha256: 8d8825921c70d205928db0b9c4d7abad41a29c7d9a4123eef8a836849f6fa301
    entry_key: e61a15ba76e650a7fbc1907cf0b63e2ffc7956d134e0aacddc451238900e0331
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CHATGPT/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/c7573d73e695-extraction-1.json
    media_type: application/json
    source_sha256: e1377b02bb95fc07cdb925df15ef3b8e00827fd8de95b7f3e7ca7c3299b9a6c9
    snapshot_sha256: e1377b02bb95fc07cdb925df15ef3b8e00827fd8de95b7f3e7ca7c3299b9a6c9
    entry_key: e74d65f8a131e3932eebef3ae8985e8130eca7703abbc96d840064b9f4a2e898
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-dc7127c3-a257-420e-bdae-3d8276233baf.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-dc7127c3-a257-420e-bdae-3d8276233baf.json
    media_type: application/json
    source_sha256: 5608280231d2d3d59ab83c5d339480516701aba4a80ea5a5ca9099b8b2ff3902
    snapshot_sha256: 5608280231d2d3d59ab83c5d339480516701aba4a80ea5a5ca9099b8b2ff3902
    entry_key: e79c157670373d9a6b958529b2e9cddb560dee6a022ed8e328e0f7dd676a4a14
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/b037fd9b598e-answer-1.txt
    media_type: text/plain
    source_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    snapshot_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    entry_key: e7c70fa53889a21793ff9598456134d20e20819bb0906c564097d4fc375acd38
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/451111d164dc-answer-1.txt
    media_type: text/plain
    source_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    snapshot_sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    entry_key: e8eb678f94a01feb71804b0bdd788d9e35ad4647adf995a1e35e3e586ecb9415
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-PERPLEXITY/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/cb744521ca10-answer-2.txt
    media_type: text/plain
    source_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    snapshot_sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    entry_key: e8fb214a67bc6cc164d2211c30a7e6d392084e64e5ca9d7b2524fe8aa908bf50
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-2a4c2db5-181d-4246-a9c1-c8a9646a9120.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-2a4c2db5-181d-4246-a9c1-c8a9646a9120.json
    media_type: application/json
    source_sha256: 7e0d0b51046a35662ba8162c808daf1ad867a817ef47d694611d8291e674cf41
    snapshot_sha256: 7e0d0b51046a35662ba8162c808daf1ad867a817ef47d694611d8291e674cf41
    entry_key: e9f7ebb6786cec7b475312368a930e8ee282f01704674397e870b4f8836f982c
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-b1dc80c4-3818-4be5-b609-eeb8baa780be.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-b1dc80c4-3818-4be5-b609-eeb8baa780be.json
    media_type: application/json
    source_sha256: 75e5b964e955aaedd8c74735f4e3be814006c6b52b9ad86f7566e1e31708e200
    snapshot_sha256: 75e5b964e955aaedd8c74735f4e3be814006c6b52b9ad86f7566e1e31708e200
    entry_key: eaaeeee8ea3a1fe23ae81773002d99a31d0c82839bb53a84534f9ba9feef5b55
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/4496f55456c7-answer-2.txt
    media_type: text/plain
    source_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    snapshot_sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    entry_key: ec0c5c08676bd045736a538d2a0095a12086beda3a88b451a4e3bab663683db0
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-1b5fc036-57d5-4dfe-a51d-df1e5730df2a.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-1b5fc036-57d5-4dfe-a51d-df1e5730df2a.json
    media_type: application/json
    source_sha256: abf95d2a7ba93a9e98b10a9a9cd12e8338053f53b733df68b30e78f7e2aa9112
    snapshot_sha256: abf95d2a7ba93a9e98b10a9a9cd12e8338053f53b733df68b30e78f7e2aa9112
    entry_key: ec3a41f71f8eac5e30156cefee3622134e5f47b241dfd28c16a52d571e584b27
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/b903b14362d6-extraction-2.json
    media_type: application/json
    source_sha256: 281f689d1857b39774e76dff16d8c2eb4a1c2ad10a3dddd391a54b443e94dbe4
    snapshot_sha256: 281f689d1857b39774e76dff16d8c2eb4a1c2ad10a3dddd391a54b443e94dbe4
    entry_key: ec9e68a899a6f747f59f12938f8a46b01401adef58c08cb9c240bf777b681a63
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q5-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/61a2c1251d4a-extraction-2.json
    media_type: application/json
    source_sha256: 4ea8187cd44df360a1f02fe918eca4c5fde66cfed15b4c51aff51d8837a6b9d4
    snapshot_sha256: 4ea8187cd44df360a1f02fe918eca4c5fde66cfed15b4c51aff51d8837a6b9d4
    entry_key: edd4bfdeccccae64da617e6043597bb8a9b0609020c85d56a29b61f0a6fdfa3b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-PERPLEXITY/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/e03a91fefeb5-answer-1.txt
    media_type: text/plain
    source_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    snapshot_sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    entry_key: eec12488ffa6a0044fd8389b9a7b45051806f786144e26669779e30caab8c907
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q2-PERPLEXITY/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/1461ed06c39f-extraction-2.json
    media_type: application/json
    source_sha256: 66a2467bfa94949ba6b4412e8766acba8f2b1e25aa68b29f54a26a8c53363265
    snapshot_sha256: 66a2467bfa94949ba6b4412e8766acba8f2b1e25aa68b29f54a26a8c53363265
    entry_key: eedeaacb061803a83e7282bb4db61dde4377d9b6d9c2fcbe1a3c6f41d1cac182
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-993b1f54-dcd5-4024-a690-e7b0768e6a46.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-993b1f54-dcd5-4024-a690-e7b0768e6a46.json
    media_type: application/json
    source_sha256: bd773176c06c974e6767dbd670c4436dd1fbf4aba36c4a6f11cca536fcaab9c9
    snapshot_sha256: bd773176c06c974e6767dbd670c4436dd1fbf4aba36c4a6f11cca536fcaab9c9
    entry_key: ef58d93e77abe14f13a2de9a4346696d2843b01c5c40f5296f4c3ef34c64bf3a
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-GOOGLE-AI/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/b55bb70c3982-extraction-1.json
    media_type: application/json
    source_sha256: d66a555c49b59677db7f3d2f02d7ea71e58fe153bca5302b1afac0b8cbd02e12
    snapshot_sha256: d66a555c49b59677db7f3d2f02d7ea71e58fe153bca5302b1afac0b8cbd02e12
    entry_key: f0b8ba36a078b23ff16ff65edeae3e4b141088fb6d74fcfa1e90320d202eb038
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-92bffc2f-bf8c-45d4-a866-893e94e0bc90.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-92bffc2f-bf8c-45d4-a866-893e94e0bc90.json
    media_type: application/json
    source_sha256: 6bd463b5bfd0177624af512c400177825d5aaff29bb32963d1f4a81ee17d0247
    snapshot_sha256: 6bd463b5bfd0177624af512c400177825d5aaff29bb32963d1f4a81ee17d0247
    entry_key: f169f6a8949c4bfa35378821cd77a38de004e9ffa96d1e6af484c01f120cb27b
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-GEMINI/raw/answer-2.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/0b2ef4041c78-answer-2.txt
    media_type: text/plain
    source_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    snapshot_sha256: 6ea27ce1e62064936f0c8e08903c89e718a105405ea35ee46d4eab143a2f6fec
    entry_key: f269934518513ce436b495a5672a3adb7fb5ffe7bd613dade02f1c4e303d830f
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q3-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/4f6d906f474c-extraction-1.json
    media_type: application/json
    source_sha256: 41d938f32aa4cd440ae5a2479bd16adfa93d27c0ac535ce35c09305366277e70
    snapshot_sha256: 41d938f32aa4cd440ae5a2479bd16adfa93d27c0ac535ce35c09305366277e70
    entry_key: f2c8fc6f4711f923e41e84b8169a322d83245054c8087a6352d76999c88f5093
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7682bb33-a7ce-4b19-a976-f96d4f1bf2b0.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-7682bb33-a7ce-4b19-a976-f96d4f1bf2b0.json
    media_type: application/json
    source_sha256: c71e513730e5dcb65391af099a4c2b1fcb8038c907f069eb32488ee4eb43993d
    snapshot_sha256: c71e513730e5dcb65391af099a4c2b1fcb8038c907f069eb32488ee4eb43993d
    entry_key: f462305072c1fc0796b4e9bbb10b2f85f6c9bb8d0864e94cd6513eca2e6513f4
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-PERPLEXITY/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/7c22fe9fa4c1-extraction-1.json
    media_type: application/json
    source_sha256: 2c68285c081c4203248f3367f010a6b7f4c6b2178bc1b8701a4d8385c65a2f00
    snapshot_sha256: 2c68285c081c4203248f3367f010a6b7f4c6b2178bc1b8701a4d8385c65a2f00
    entry_key: f46ccbae2edb035ce1b08d505f1aa1726205d83c3d70c771c8c5948eaaf6904d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CHATGPT/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/a5264cab0596-extraction-2.json
    media_type: application/json
    source_sha256: 255fcc634e361e8dc5de0ace3be5553d3f87a03e100e313abad1f07d555d891f
    snapshot_sha256: 255fcc634e361e8dc5de0ace3be5553d3f87a03e100e313abad1f07d555d891f
    entry_key: f55e662c98d3b5fdcb2b3e3994ce68fcc0084c08af39002929cebbde9faef818
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CLAUDE/raw/answer-1.txt
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/f43c58f62592-answer-1.txt
    media_type: text/plain
    source_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    snapshot_sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    entry_key: f56b65de29e5106bb8f916dd0c24169233eb24ead45c60fc177b8fd67875bb1d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q4-CLAUDE/outputs/extraction-1.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/71a663c7ef98-extraction-1.json
    media_type: application/json
    source_sha256: c4d878d06d792d01427df36e6885a72ef1c547eced2111478e42f5e653d02bab
    snapshot_sha256: c4d878d06d792d01427df36e6885a72ef1c547eced2111478e42f5e653d02bab
    entry_key: f585991d27487cc3ccf65392ee6c350cef471276ab3bc123d49635320f26ed5c
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/97e7e6dfa59f-extraction-2.json
    media_type: application/json
    source_sha256: 6f4f22fd385d529582e41b59beb04f386e486d8435c2038fa46a37e0f384ac9f
    snapshot_sha256: 6f4f22fd385d529582e41b59beb04f386e486d8435c2038fa46a37e0f384ac9f
    entry_key: f7dde20edc4f2a21e4fcd2ec1486d987632f8c3b524ca5b9b11d35ffc48ab6f5
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/outputs/extraction-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/37a3fb48114f-extraction-2.json
    media_type: application/json
    source_sha256: b2dfe73b277fa13cb1ef1763771ed8dfaf5636121edf14b87e4e7e37d31a9231
    snapshot_sha256: b2dfe73b277fa13cb1ef1763771ed8dfaf5636121edf14b87e4e7e37d31a9231
    entry_key: f8fca7d0934f0312ad6a4a31c3775fc1140b838bf66f15209c0d8d0aa39a187e
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-7ac7c97e-7c91-4bb1-bc2c-36cf1e023bdd.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-7ac7c97e-7c91-4bb1-bc2c-36cf1e023bdd.json
    media_type: application/json
    source_sha256: 6179a017aea8d66462488d2480dd5bf427d89ff1401cccd057a10ad5b4c2c3b8
    snapshot_sha256: 6179a017aea8d66462488d2480dd5bf427d89ff1401cccd057a10ad5b4c2c3b8
    entry_key: fba61fa097511a3fce1206560fb495c758cd3714f018e3a1a2fc33a0ea18ea0d
  - role: supporting_artifact
    source_path: runs/RUN-GEO-C1-BASE-Q6-GOOGLE-AI/raw/collector-2.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/ab2fca19d9bd-collector-2.json
    media_type: application/json
    source_sha256: 8df9b60bb8d4069cade6b32b35cfac8040b382eb5d7eaa0e56e994c548ffe8e8
    snapshot_sha256: 8df9b60bb8d4069cade6b32b35cfac8040b382eb5d7eaa0e56e994c548ffe8e8
    entry_key: fbc37ddc0e50cc28b1ad6605a5363f2a075c717e81561b302125789edb41e249
  - role: supporting_artifact
    source_path: runs/model-calls/MODEL-bde808ac-38ba-456b-8472-65b5f61969b7.json
    snapshot_path: outputs/snapshots/cis-geo-c1-baseline-recorded/artifacts/MODEL-bde808ac-38ba-456b-8472-65b5f61969b7.json
    media_type: application/json
    source_sha256: c5be994b3391d6295547a557a7e4143aa3f92c6847fedae653ec221bf58d6d2b
    snapshot_sha256: c5be994b3391d6295547a557a7e4143aa3f92c6847fedae653ec221bf58d6d2b
    entry_key: fbdb509ec61193b411443ec4a6a7a2099f55fa5dc9155a0c617bc600c43fc2bf
pre_review_transition_snapshot_versions: []
pre_review_entry_keys: []
run_ref: RUN-GEO-E2E-C1
---
# Cycle Input Snapshot CIS-GEO-C1-BASELINE-RECORDED
