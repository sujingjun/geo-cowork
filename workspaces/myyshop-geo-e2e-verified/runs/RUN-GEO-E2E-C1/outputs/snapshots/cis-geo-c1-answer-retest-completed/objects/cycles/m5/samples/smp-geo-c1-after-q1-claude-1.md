---
id: SMP-GEO-C1-AFTER-Q1-CLAUDE-1
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
    path: runs/RUN-GEO-C1-AFTER-Q1-CLAUDE/outputs/extraction-1.json
    sha256: 559a3bfb0beea4edb3fa872fc29b74168d00a25bc1d70957632df394e9f6e2df
    model_call: MODEL-a09c4e3c-b27e-44ea-930d-415da11464f0
purpose: post_change_retest
query_ref: Q-DOES-THE-MYYSHOP-REHEARSAL-GUARANTEE-EN-F889
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: capability
platform: claude
collector_profile_ref: CPF-GEO-E2E-C1-AFTER-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-AFTER-Q1-CLAUDE
slot_key: 35f2e78adeec2780ce89dc2733166c859e4905259ca3fe0f03eb861b3994d7ca
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-23T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 8f4722060af5261330e6141cdf06d79f0d079761d77a422ea3ec13b60485d0f8
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 5ac6af74d42ad8fd84b4c892df748c2cb4dd572b2430f2febe1fcf79e0786811
    media_type: application/json
raw_manifest_sha256: f7c07aa4a74c93af03329a4e932fb01097e96f47e83125c9d45d8c6732948baa
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
