---
id: SMP-GEO-C2-AFTER-Q5-CLAUDE-2
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-10-07T00:00:02.000Z'
updated_at: '2026-10-07T00:00:02.000Z'
title: Recorded sample 2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/outputs/extraction-2.json
    sha256: 2e2e4312289cacef93532e2d280db56fac8ec437731ff71cdf240b6f32b74782
    model_call: MODEL-980128c1-17ee-4c5d-b1ee-dbe1b2963e30
purpose: post_change_retest
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-1724
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q5-CLAUDE
slot_key: ebe378be08da1126258b403782378a0434f6ebfed605092694801ced280c767b
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 153ca8ecbe75bc3af9d2d5157350f45253efe395e6cdd4dec2d481b8f69631e4
    media_type: application/json
raw_manifest_sha256: 8a3eeef58fa39e114c632874747740b25b07110bb4a2144f6d8fef44bb59ddd8
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
publication_refs:
  - PUB-GEO-C2-OWN-V2-CONFIRMED
  - PUB-GEO-C2-OFFICIAL-V2-CONFIRMED
technical_retest_run_refs:
  - RUN-GEO-SITE-C2-AFTER-OWN
  - RUN-GEO-SITE-C2-AFTER-OFFICIAL
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
---
# Recorded Sample 2
