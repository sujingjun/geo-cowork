---
id: SMP-GEO-C2-AFTER-Q2-GEMINI-2
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-10-07T00:00:02.000Z'
updated_at: '2026-10-07T00:00:02.000Z'
title: Recorded sample 2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/outputs/extraction-2.json
    sha256: b358506f8ab3b1b4db135235ac9111d6571abe77ab70b61b81c06002c5d64b68
    model_call: MODEL-1426ad56-832e-472e-88c7-5928daec75e7
purpose: post_change_retest
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q2-GEMINI
slot_key: f8ab2641ce578b7a6fb82d82b3e448ea3a7e6056434c5666073044b85d30eb08
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 5318a7dfc6137c2bbb12e34f8a63a0476ad420a80d9f55c1149b061697a11aff
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 908f672e9eb2887e95a4cf3374e1339d8e6f82be1db297ff0b9e99219706323c
    media_type: application/json
raw_manifest_sha256: e5fb4a05a229f037b65cc96d7148725a5304e943c1f27dbc6135131c60f7c34d
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
publication_refs:
  - PUB-GEO-C2-OWN-V2-CONFIRMED
technical_retest_run_refs:
  - RUN-GEO-SITE-C2-AFTER-OWN
baseline_aggregation_refs:
  - AGG-GEO-C2-BASE-Q3-CHATGPT
  - AGG-GEO-C2-BASE-Q2-CHATGPT
  - AGG-GEO-C2-BASE-Q5-GOOGLE-AI
  - AGG-GEO-C2-BASE-Q6-GOOGLE-AI
  - AGG-GEO-C2-BASE-Q3-GEMINI
  - AGG-GEO-C2-BASE-Q2-GEMINI
  - AGG-GEO-C2-BASE-Q5-PERPLEXITY
  - AGG-GEO-C2-BASE-Q2-PERPLEXITY
  - AGG-GEO-C2-BASE-Q6-CHATGPT
  - AGG-GEO-C2-BASE-Q4-PERPLEXITY
  - AGG-GEO-C2-BASE-Q1-GEMINI
  - AGG-GEO-C2-BASE-Q5-CLAUDE
  - AGG-GEO-C2-BASE-Q1-CHATGPT
  - AGG-GEO-C2-BASE-Q3-PERPLEXITY
  - AGG-GEO-C2-BASE-Q6-PERPLEXITY
  - AGG-GEO-C2-BASE-Q2-GOOGLE-AI
  - AGG-GEO-C2-BASE-Q3-CLAUDE
  - AGG-GEO-C2-BASE-Q2-CLAUDE
  - AGG-GEO-C2-BASE-Q6-CLAUDE
  - AGG-GEO-C2-BASE-Q1-GOOGLE-AI
  - AGG-GEO-C2-BASE-Q1-CLAUDE
  - AGG-GEO-C2-BASE-Q1-PERPLEXITY
  - AGG-GEO-C2-BASE-Q4-GEMINI
  - AGG-GEO-C2-BASE-Q4-CLAUDE
  - AGG-GEO-C2-BASE-Q4-CHATGPT
  - AGG-GEO-C2-BASE-Q5-GEMINI
  - AGG-GEO-C2-BASE-Q3-GOOGLE-AI
  - AGG-GEO-C2-BASE-Q5-CHATGPT
  - AGG-GEO-C2-BASE-Q4-GOOGLE-AI
  - AGG-GEO-C2-BASE-Q6-GEMINI
---
# Recorded Sample 2
