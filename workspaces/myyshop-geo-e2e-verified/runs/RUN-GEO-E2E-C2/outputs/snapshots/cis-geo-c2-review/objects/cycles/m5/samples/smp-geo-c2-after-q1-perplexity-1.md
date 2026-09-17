---
id: SMP-GEO-C2-AFTER-Q1-PERPLEXITY-1
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-10-07T00:00:01.000Z'
updated_at: '2026-10-07T00:00:01.000Z'
title: Recorded sample 1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C2-AFTER-Q1-PERPLEXITY/outputs/extraction-1.json
    sha256: 28bf4becd7a0af218975806b8f1c857b39326bbd48f8f02303aec5251e2bbed5
    model_call: MODEL-135e5c82-b755-4a9b-8880-a731b1dfeb0e
purpose: post_change_retest
query_ref: Q-HOW-SHOULD-AN-ELIGIBLE-CREATOR-EN-D279
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: comparison
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q1-PERPLEXITY
slot_key: d5c089d0d6af4241e8fb5a83bfab4ddc3f5c7ce5413fc8bf604660987e48bf68
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 292bd92e1ac99dc47c272fdb2a1ee8a107907ec5101600e77f58827f75223f01
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: d79e076e937af95df427a8711f53d016e1d92d327116ed8053433e24c35080e9
    media_type: application/json
raw_manifest_sha256: d4260a7fb6faa6e76bc6e4b1ec2dea7308750743555aac1c3b3388a7d5e22b98
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
# Recorded Sample 1
