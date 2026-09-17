---
id: SMP-GEO-C2-AFTER-Q6-PERPLEXITY-1
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-10-07T00:00:01.000Z'
updated_at: '2026-10-07T00:00:01.000Z'
title: Recorded sample 1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/outputs/extraction-1.json
    sha256: 978be641fcf6810ab699ec1b2ded5233cdd7c0f6347d646bde6138ed5b1d1006
    model_call: MODEL-36bf1494-130a-431e-bd08-be49cd3b51e0
purpose: post_change_retest
query_ref: Q-WHO-IS-ELIGIBLE-TO-PARTICIPATE-EN-B8C2
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q6-PERPLEXITY
slot_key: 828beb54d121aab67171b02e90b9b920c780eee0d5b37aacd37cfd4d1d5b9419
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 964b6c3641dfda6e5624763e698abac4258c6dc25d2eeb15314eaaf28d74f972
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 80527bf067ebfe0b42a8d6b5fd3de0bcc72aa42c9ffd510fc0f5c1479437de4d
    media_type: application/json
raw_manifest_sha256: 9a7aaba31afec84067ab718e040203edcdf0324d21fec84d0b2cac57e31f34db
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
# Recorded Sample 1
