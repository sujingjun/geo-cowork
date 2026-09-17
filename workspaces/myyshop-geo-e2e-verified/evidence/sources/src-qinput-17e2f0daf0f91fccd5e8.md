---
id: SRC-QINPUT-17E2F0DAF0F91FCCD5E8
record_type: source
status: active
version: 1.0.0
created_at: '2026-09-15T20:37:05.574Z'
updated_at: '2026-09-15T20:37:05.574Z'
title: knowledge_generated input
name: knowledge_generated input
source_kind: knowledge_generated
locator: 'workspace://queries/inputs/17e2f0daf0f91fccd5e84f3d78f5c2fb3f04200eb742cc7d7d2085e227ef68d6/input.json'
extensions:
  geo.query_input:
    source_kind: knowledge_generated
    raw_sha256: e3444e90b34ea84fa7b57ecf7c52ee5aebf48baf9d99de61513699894147a69e
    owner: Owner
    details:
      generator_version: knowledge-query-v1
      clue_inputs:
        - source_review: CRV-GEO-C1-DECIDED
          selected_goal:
            statement: Improve eligibility and evidence clarity using the previous cycle review.
            success_question: Can an eligible creator identify the rehearsal terms and evidence limits?
            query_cluster_key: eligibility-evidence
      clue_inputs_sha256: be9b43dc62bd147ae52e788dfe9808b7534b09c2fe2eb1c5282066b406f43561
      model_call:
        id: MODEL-dd7f036d-a02f-40f6-9fdd-d18a8c729988
        provider: deepseek
        model: deepseek-flash
        prompt_sha256: 362f64ee31d006120eb3423c0124aade62e3ac58c56018471f82ccd119d437bb
        input_sha256: 9dba3109dc49d913367108d4b5d5481f7a82267c7076f368818a2fe44472077d
        started_at: '2026-09-15T20:36:59.675Z'
        status: completed
        request_options:
          thinking: enabled
          reasoning_effort: low
        http_status: 200
        response_model: deepseek-flash
        usage:
          prompt_tokens: 2584
          completion_tokens: 1300
          total_tokens: 3884
          prompt_tokens_details:
            cached_tokens: 0
          completion_tokens_details:
            reasoning_tokens: 716
          prompt_cache_hit_tokens: 0
          prompt_cache_miss_tokens: 2584
        finish_reason: stop
        output_sha256: e3444e90b34ea84fa7b57ecf7c52ee5aebf48baf9d99de61513699894147a69e
        completed_at: '2026-09-15T20:37:05.570Z'
        duration_ms: 5895
      knowledge_versions:
        - path: knowledge/02-brand-identity/identity.md
          sha256: 49e5074d3673bb3fe5ab94db911574b45d16f76803c9dee0831fda9fa6d47e75
        - path: knowledge/02-brand-identity/legacy.md
          sha256: 5dc7c0b63582d6736d402ca12dc42bb6011898f3e88d93e1a9c9284a12661e1f
        - path: knowledge/03-positioning-strategy/positioning.md
          sha256: 96ec87a12d27a9c000f5b338f3bce315d29fbe01aac91b7de992768645a635c3
        - path: knowledge/03-positioning-strategy/non-goals.md
          sha256: 2fd1e92836adc8597725a5f67a8d19392bad43367b520b9ae1f502828f89bad5
        - path: knowledge/04-audience-lifecycle/eligibility.md
          sha256: d71492e6bce1df0b100e47a90b12d52085f5a6ec2bf2e3a14a02b9adbf7fd703
        - path: knowledge/04-audience-lifecycle/onboarding.md
          sha256: 8dc1a30f2c3afdaffebfffde1deaae5270e4d9253f231bae064bb1a8203207df
        - path: knowledge/05-products-services/campaigns.md
          sha256: 02ae4fca62d3ca9a8a2cf20d4e6daf3ec87390a68cc2c4ef02b76adde862c1c5
        - path: knowledge/05-products-services/automation.md
          sha256: 14fa153bc49a0e008e4881b27a2d856500b029991e2d7e4c5f1238c587eb2c09
        - path: knowledge/06-commercial-rules/fees.md
          sha256: df102d28504a90def720e2f13ac6ea5e00e59dc495034deebbdd33b77c2db743
        - path: knowledge/06-commercial-rules/refund.md
          sha256: 767a5b9ce079e7abe1f9d5ccc511196e6a8ff943b7afb37da2b3e72d1914782e
        - path: knowledge/07-trust-safety/privacy.md
          sha256: 1fda0e8ec5591e0e6ae238e670ca80118b3ac3e05041a71916fd8bd466039751
        - path: knowledge/07-trust-safety/guarantees.md
          sha256: 7941214c2a428323bfa615e8784996e459945984aa6d579ccf2be8d35b2e237f
        - path: knowledge/08-proof-authority/case.md
          sha256: 749660cf88446fddb6ac51b4e6e8b2b786f6672f6807f4bedd2e5273a67e0de3
        - path: knowledge/08-proof-authority/growth.md
          sha256: 35ef6dfb1030bd5d2d367cf247d351157f5220ff6743eeee84743706efe8f35b
        - path: knowledge/09-voice-messaging/voice.md
          sha256: 3b3b4be376071b06042655164fed1f253827aa8672b0976ed0f2bed6f26387b1
        - path: knowledge/09-voice-messaging/expired.md
          sha256: d7675c9827226f7ce0eeb3578fd53a4243f006f57306c6677db435d6aab2a930
        - path: knowledge/10-query-answer-cards/answer-definition.md
          sha256: f6575d78f26ee086b62bf698159940dc817472163f00920885b3b1146b699e3f
        - path: knowledge/10-query-answer-cards/comparison.md
          sha256: efa951a3279cf2b42f45164304c9836b71eeb488ba68caf01a072d44ae17f0d8
test_scope:
  kind: synthetic
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
  merchant_ref: MER-MYYSHOP-001
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
---
# knowledge_generated input
