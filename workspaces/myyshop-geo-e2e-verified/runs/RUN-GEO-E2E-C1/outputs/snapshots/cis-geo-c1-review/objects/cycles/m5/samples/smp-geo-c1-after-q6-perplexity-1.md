---
id: SMP-GEO-C1-AFTER-Q6-PERPLEXITY-1
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-09-23T00:00:01.000Z'
updated_at: '2026-09-23T00:00:01.000Z'
title: Recorded sample 1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C1-AFTER-Q6-PERPLEXITY/outputs/extraction-1.json
    sha256: f3ede59a228e8930b6dcb2829348ad7248793ea7d168a8f7c2b1c8dbc7a6cd02
    model_call: MODEL-b3a317e9-7e3f-4c4d-85f4-8dcb977e8194
purpose: post_change_retest
query_ref: Q-WHO-IS-ELIGIBLE-TO-USE-EN-1531
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C1-AFTER-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-AFTER-Q6-PERPLEXITY
slot_key: 20f8e67dec0d44b80335b4754bc690eeedb447ca125d845bf8d9350b417d6237
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-23T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: b8db4c88e90f493864cf7f5b34d86653ad9216f23597cd8b8e25842b7d9f1ec3
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: e9e0b278f5afe69a055a232bf185778c50b3295864b30acd478df0ae3e6a0bd6
    media_type: application/json
raw_manifest_sha256: 373cf2d0484cffc42d1b1a998d1d5d075f7c46102d60672f855f390ffee04403
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
publication_refs:
  - PUB-GEO-C1-OWN-V2-CONFIRMED
  - PUB-GEO-C1-OFFICIAL-V2-CONFIRMED
technical_retest_run_refs:
  - RUN-GEO-SITE-C1-AFTER-OWN
  - RUN-GEO-SITE-C1-AFTER-OFFICIAL
baseline_aggregation_refs:
  - AGG-GEO-C1-BASE-Q3-GOOGLE-AI
  - AGG-GEO-C1-BASE-Q5-GEMINI
  - AGG-GEO-C1-BASE-Q4-PERPLEXITY
  - AGG-GEO-C1-BASE-Q2-CHATGPT
  - AGG-GEO-C1-BASE-Q2-CLAUDE
  - AGG-GEO-C1-BASE-Q6-CHATGPT
  - AGG-GEO-C1-BASE-Q6-PERPLEXITY
  - AGG-GEO-C1-BASE-Q5-CLAUDE
  - AGG-GEO-C1-BASE-Q4-CHATGPT
  - AGG-GEO-C1-BASE-Q6-CLAUDE
  - AGG-GEO-C1-BASE-Q3-CHATGPT
  - AGG-GEO-C1-BASE-Q3-GEMINI
  - AGG-GEO-C1-BASE-Q5-CHATGPT
  - AGG-GEO-C1-BASE-Q1-PERPLEXITY
  - AGG-GEO-C1-BASE-Q6-GOOGLE-AI
  - AGG-GEO-C1-BASE-Q2-PERPLEXITY
  - AGG-GEO-C1-BASE-Q1-GOOGLE-AI
  - AGG-GEO-C1-BASE-Q3-PERPLEXITY
  - AGG-GEO-C1-BASE-Q5-GOOGLE-AI
  - AGG-GEO-C1-BASE-Q2-GOOGLE-AI
  - AGG-GEO-C1-BASE-Q1-GEMINI
  - AGG-GEO-C1-BASE-Q1-CHATGPT
  - AGG-GEO-C1-BASE-Q4-GOOGLE-AI
  - AGG-GEO-C1-BASE-Q1-CLAUDE
  - AGG-GEO-C1-BASE-Q4-CLAUDE
  - AGG-GEO-C1-BASE-Q5-PERPLEXITY
  - AGG-GEO-C1-BASE-Q2-GEMINI
  - AGG-GEO-C1-BASE-Q3-CLAUDE
  - AGG-GEO-C1-BASE-Q4-GEMINI
  - AGG-GEO-C1-BASE-Q6-GEMINI
---
# Recorded Sample 1
