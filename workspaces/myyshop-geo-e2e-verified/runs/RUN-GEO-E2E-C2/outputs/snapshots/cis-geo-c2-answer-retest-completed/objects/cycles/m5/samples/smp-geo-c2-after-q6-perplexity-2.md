---
id: SMP-GEO-C2-AFTER-Q6-PERPLEXITY-2
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
    path: runs/RUN-GEO-C2-AFTER-Q6-PERPLEXITY/outputs/extraction-2.json
    sha256: 2cad172b947c87a6d7df1fe58ee8c25025ceabba09b61b23c507c4f5bd0e5f00
    model_call: MODEL-00a35b97-cd87-481e-8d89-9a24e07adf14
purpose: post_change_retest
query_ref: Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q6-PERPLEXITY
slot_key: e7d87cc975cae09591a10aa8571c1b516467ff4cab550e989dbbdbbed22cc310
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 0a3d7b6ae5f31551516fe30b4e88e12bbccb9568e0e76345e8c15d33a79f5164
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: ded25fce57bfa1350510db9b739c0568df3e0062e19f060dbcd259c6f61d5742
    media_type: application/json
raw_manifest_sha256: 8beba6ef78a91243c9d5cf2417268398f69b47aa6e52817af47a02194591240d
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
