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
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C2-AFTER-Q5-CLAUDE/outputs/extraction-2.json
    sha256: 4fcd043ee744de23b58b785cb221ca4c4e59eaec67e60dce91090b523ecb12f1
    model_call: MODEL-4cf4ab44-58f2-48a0-a7bb-1442ebdb5204
purpose: post_change_retest
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q5-CLAUDE
slot_key: e7c7a8677fabcfbf4c57276295643c4f9414014fa18627118aaed44741339d4d
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 0f0b7013b2f31c2af9d633c252aa57e5997815b617e54b5a8f23d94496b3921b
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: d385b8889e1271e5f73a668718a35e7163086140b3efd898b89c7dcf732c255b
    media_type: application/json
raw_manifest_sha256: 1c3bc8f51fd93d4e5580b8d1373670634d3e2678111568bdc830c09f114b6879
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
