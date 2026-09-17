---
id: SMP-GEO-C2-AFTER-Q3-GEMINI-1
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
    path: runs/RUN-GEO-C2-AFTER-Q3-GEMINI/outputs/extraction-1.json
    sha256: fff4903bcfc6e84aef6a169b845b19a276e674e722067a6e74f2c634dfc1d1af
    model_call: MODEL-aa5073f2-26a8-4a19-bebc-8f53420622cd
purpose: post_change_retest
query_ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-3271
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: capability
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q3-GEMINI
slot_key: 34ae97508945eefc7c6492cd83593e550f8ff079525bd3f5329a1b5a42a79838
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 6b14c4e8132ac55fd45f45bdf65604245bb66d5ea910e6033fdf0282d2698c0a
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 9d158181a2b26e581efe11272e7d1b6e227682e92ab9aa75b24cbdfd3468ada1
    media_type: application/json
raw_manifest_sha256: ea6d5b2814acbca33e4514a9a49d67b18cb1efd9001a61cc66d5966c2a7e12ff
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
