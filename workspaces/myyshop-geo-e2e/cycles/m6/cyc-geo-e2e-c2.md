---
id: CYC-GEO-E2E-C2
record_type: cycle
status: completed
version: 1.0.9
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-10-09T00:00:00.000Z'
title: Synthetic GEO Cycle 2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
scope: knowledge_independent_engineering
merchant_ref: MER-MYYSHOP-001
knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
execution_scope: synthetic_test
cycle_number: 2
core_versions:
  input_snapshot:
    ref: CIS-GEO-E2E-FREEZE-C2
    version: 1.0.0
aggregate_stage: review_decided
completion_scope: full
goal_tracks:
  - goal_entry_key: d4abe3adf89e120428516eb55f5ad306a5a27f14feecaa7cdaa1fbe222c8e57e
    input_snapshot_version:
      ref: CIS-GEO-E2E-FREEZE-C2
      version: 1.0.0
    query_set_entry_key: cdd79633afc1277e04094f22f7df8654bfb43a9affec2b26638d0d2cadb0df8a
    knowledge_release_entry_keys:
      - caecf0a65ed3ffab678434d6a9c929cafffe0aebf06f15dd1d0852bb16bca69c
    evidence_entry_keys:
      - 07ba0027d3d4754eb5ebe1e9c4b19315beeb40075ed256e7b5f3998a81be06e2
      - 1306d7f2005ab206563961c1bbeead956a4b179e8c89620fcbd78186cd63fab0
      - 189af50b75549ccc348beab46313d780b6cc34ca1887042a0df384275ede32ac
      - 2389a7a1aa0e86adf53ae908b969a20ea8844e9690aee52489fbf5887c288c36
      - 2ad44dcd5a6d3e2d35650a726811c5c38f087cc5ccb63f321c1a3b60296999f8
      - 2f0be51688afc1940744ec3a79bb7c627fa604cc3bd24a54bea2f7b4ba2b55af
      - 36f96c55b7edef5e2ad372f7935784a3cad2bd1293b8f28d580bf3e01bb8dddf
      - 77757753343a68a5bbd84fef9632f496c3a2c43e4b1326737c94a6f1dd068d13
      - 7fcb82ed882943949100780973270d921c21d9d72f42445973f8ed23ab96a813
      - 80c833fb94b7a29ae5588dbb1503ac9273705314c69a5b9f01655294cd1cd212
      - 957a79364ab854fc9f703232976e0f1e86f1f3154a46fecb95cef82eef7d0c42
      - aaf88cc283e46eae0ab8b3b7e2ac4f397773141043ce0fe6cdfd3343e6d27335
      - ab4e52f264f0b69a183509f11390ee6ef905e69db59d1e57c5f3a4bf9d84d3d4
      - ac4d795e963d9b2c48bd8aed24138450ce73af1f01955671c32654cadacd796d
      - b790f3434197d57660ec0328f88642e5106da9d3a742781571cafc8b79ef1df4
      - dc6c50591d59919c73bf67c55be04b6ec3121b2fedf9b97f21a0891e20324a1b
    asset_entry_keys:
      - 214d602a238c3cf44d3fc0a781d565ab0ae014a7c66dc73acc79b4f1e509dcaf
      - 787b08a9cbd3755dc54d40e9365dce9da1bf7788a7de12ae9403a2cab4b50a8a
      - 82b57479a1a05dcf1377f85e66862468b2c28e59dc8d397141762a452174fd44
    collector_profile_entry_keys:
      - 41a02d666e7ecd131e7f8996f71385a6890bffae1a5d622ccf3f7c57a038602e
      - a1f3b68a22d36cb7433a77fd876397f84661ade8ec435ed3220755ac1c7356ab
      - b4a81ee1a8a5aa7411598cb02542cec64a5ab4416f8f9f4c5ef470c498d982dc
      - b614320032721128c41a9bc1ce2e57463b08762fdc3ec9b2a10b13b29feff47b
      - c2324a3a253dd8d29a2cb9202dcec9093c5bf6c42e9fdba949ebd79bb00ba08d
    measurement_contract_entry_key: f8ffea436618e87358de7d89510410387967da75368202bea7294352edd7fb6b
    stage: review_decided
    baseline_aggregation_refs:
      - AGG-GEO-C2-BASE-Q1-CLAUDE
      - AGG-GEO-C2-BASE-Q3-GEMINI
      - AGG-GEO-C2-BASE-Q6-PERPLEXITY
      - AGG-GEO-C2-BASE-Q1-PERPLEXITY
      - AGG-GEO-C2-BASE-Q4-CHATGPT
      - AGG-GEO-C2-BASE-Q4-GEMINI
      - AGG-GEO-C2-BASE-Q3-PERPLEXITY
      - AGG-GEO-C2-BASE-Q2-GOOGLE-AI
      - AGG-GEO-C2-BASE-Q6-CLAUDE
      - AGG-GEO-C2-BASE-Q2-GEMINI
      - AGG-GEO-C2-BASE-Q5-GEMINI
      - AGG-GEO-C2-BASE-Q5-CLAUDE
      - AGG-GEO-C2-BASE-Q5-GOOGLE-AI
      - AGG-GEO-C2-BASE-Q1-CHATGPT
      - AGG-GEO-C2-BASE-Q6-GEMINI
      - AGG-GEO-C2-BASE-Q3-CLAUDE
      - AGG-GEO-C2-BASE-Q6-CHATGPT
      - AGG-GEO-C2-BASE-Q4-GOOGLE-AI
      - AGG-GEO-C2-BASE-Q6-GOOGLE-AI
      - AGG-GEO-C2-BASE-Q1-GEMINI
      - AGG-GEO-C2-BASE-Q2-CHATGPT
      - AGG-GEO-C2-BASE-Q3-GOOGLE-AI
      - AGG-GEO-C2-BASE-Q5-PERPLEXITY
      - AGG-GEO-C2-BASE-Q3-CHATGPT
      - AGG-GEO-C2-BASE-Q1-GOOGLE-AI
      - AGG-GEO-C2-BASE-Q4-PERPLEXITY
      - AGG-GEO-C2-BASE-Q2-CLAUDE
      - AGG-GEO-C2-BASE-Q4-CLAUDE
      - AGG-GEO-C2-BASE-Q5-CHATGPT
      - AGG-GEO-C2-BASE-Q2-PERPLEXITY
    finding_refs:
      - FND-GEO-SITE-C2-BASE-THIRD-PARTY-CANONICAL
      - FND-GEO-C2-OWN-1
      - FND-GEO-C2-OFFICIAL-1
      - FND-GEO-SITE-C2-BASE-THIRD-PARTY-SCHEMA-SYNTAX
      - FND-GEO-C2-THIRD-PARTY-2
      - FND-GEO-SITE-C2-BASE-THIRD-PARTY-CRAWLABILITY
      - FND-GEO-SITE-C2-BASE-THIRD-PARTY-META-DESCRIPTION-PRESENT
      - FND-GEO-C2-THIRD-PARTY-1
    evidence_plan_refs:
      - EPL-GEO-C2-OWN-1
    asset_proposal_refs:
      - PRP-GEO-C2-OWN
      - PRP-GEO-C2-THIRD-PARTY
      - PRP-GEO-C2-OFFICIAL
    adoption_record_refs:
      - ADR-GEO-C2-OFFICIAL-DECIDED
      - ADR-GEO-C2-THIRD-PARTY-DECIDED
      - ADR-GEO-C2-OWN-DECIDED
    publication_refs:
      - PUB-GEO-C2-OWN-V2-CONFIRMED
      - PUB-GEO-C2-OFFICIAL-V2-CONFIRMED
    technical_retest_run_refs:
      - RUN-GEO-SITE-C2-AFTER-OWN
      - RUN-GEO-SITE-C2-AFTER-OFFICIAL
    answer_retest_aggregation_refs:
      - AGG-GEO-C2-AFTER-Q2-CHATGPT
      - AGG-GEO-C2-AFTER-Q2-GEMINI
      - AGG-GEO-C2-AFTER-Q1-CLAUDE
      - AGG-GEO-C2-AFTER-Q5-GOOGLE-AI
      - AGG-GEO-C2-AFTER-Q3-CHATGPT
      - AGG-GEO-C2-AFTER-Q5-CLAUDE
      - AGG-GEO-C2-AFTER-Q6-PERPLEXITY
      - AGG-GEO-C2-AFTER-Q3-PERPLEXITY
      - AGG-GEO-C2-AFTER-Q4-PERPLEXITY
      - AGG-GEO-C2-AFTER-Q1-PERPLEXITY
      - AGG-GEO-C2-AFTER-Q4-CHATGPT
      - AGG-GEO-C2-AFTER-Q5-PERPLEXITY
      - AGG-GEO-C2-AFTER-Q2-GOOGLE-AI
      - AGG-GEO-C2-AFTER-Q2-CLAUDE
      - AGG-GEO-C2-AFTER-Q1-GOOGLE-AI
      - AGG-GEO-C2-AFTER-Q3-GOOGLE-AI
      - AGG-GEO-C2-AFTER-Q5-GEMINI
      - AGG-GEO-C2-AFTER-Q4-GOOGLE-AI
      - AGG-GEO-C2-AFTER-Q5-CHATGPT
      - AGG-GEO-C2-AFTER-Q6-CLAUDE
      - AGG-GEO-C2-AFTER-Q6-GEMINI
      - AGG-GEO-C2-AFTER-Q6-CHATGPT
      - AGG-GEO-C2-AFTER-Q3-GEMINI
      - AGG-GEO-C2-AFTER-Q1-CHATGPT
      - AGG-GEO-C2-AFTER-Q4-CLAUDE
      - AGG-GEO-C2-AFTER-Q4-GEMINI
      - AGG-GEO-C2-AFTER-Q6-GOOGLE-AI
      - AGG-GEO-C2-AFTER-Q1-GEMINI
      - AGG-GEO-C2-AFTER-Q2-PERPLEXITY
      - AGG-GEO-C2-AFTER-Q3-CLAUDE
    analytics_observation_refs:
      - ANO-GEO-C2
    business_signal_refs:
      - BSIG-GEO-C2
    review_input_snapshot_version:
      ref: CIS-GEO-C2-REVIEW-WAITING-HUMAN
      version: 1.0.0
transition_refs:
  - CTR-GEO-C2-BASELINE-RECORDED
  - CTR-GEO-C2-DIAGNOSIS-READY
  - CTR-GEO-C2-ADOPTION-DECIDED
  - CTR-GEO-C2-PUBLICATION-CONFIRMED
  - CTR-GEO-C2-TECHNICAL-RETEST-COMPLETED
  - CTR-GEO-C2-ANSWER-RETEST-COMPLETED
  - CTR-GEO-C2-ANALYTICS-RECORDED
  - CTR-GEO-C2-REVIEW-WAITING-HUMAN
  - CTR-GEO-C2-REVIEW-DECIDED
cycle_review_version:
  ref: CRV-GEO-C2-DECIDED
  version: 1.0.0
predecessor_review_version:
  ref: CRV-GEO-C1-DECIDED
  version: 1.0.0
goal_selection_version:
  ref: GSEL-F1CC84D9AE1591B77DCD82BB
  version: 1.0.0
extensions:
  geo.journey:
    query_refs:
      - Q-HOW-SHOULD-I-COMPARE-THE-EN-5087
      - Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-2CC4
      - Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271
      - Q-WHAT-DOES-THE-MYYSHOP-REHEARSAL-EN-0B93
      - Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-1724
      - Q-WHO-IS-ELIGIBLE-TO-PARTICIPATE-EN-B8C2
    query_set_ref: QS-GEO-E2E-C2
    knowledge_release_ref: KR-GEO-E2E-C2
    asset_refs:
      - AST-GEO-E2E-C2-OWN
      - AST-GEO-E2E-C2-OFFICIAL
      - AST-GEO-E2E-C2-THIRD-PARTY
    baseline_profile_refs:
      - CPF-GEO-E2E-C2-BASE-CHATGPT
      - CPF-GEO-E2E-C2-BASE-GEMINI
      - CPF-GEO-E2E-C2-BASE-PERPLEXITY
      - CPF-GEO-E2E-C2-BASE-GOOGLE-AI
      - CPF-GEO-E2E-C2-BASE-CLAUDE
    input_path: cycles/preparation/knowledge-input-C2.json
---
# M6 synthetic cycle
