---
id: SMP-GEO-C1-AFTER-Q1-CLAUDE-2
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-09-23T00:00:02.000Z'
updated_at: '2026-09-23T00:00:02.000Z'
title: Recorded sample 2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C1-AFTER-Q1-CLAUDE/outputs/extraction-2.json
    sha256: 85bb45ce9fc6cfb1f06a0370c2ecd384bd75d43b191a58e2effea561ca040fb7
    model_call: MODEL-9fd9abea-79d1-47fa-9172-ffe3d46cf8eb
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
slot_key: bbc706d51bff605cf65ec8ee874e24c07d16ed6afe9c4baa8eda6ee884053c43
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-23T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 8f4722060af5261330e6141cdf06d79f0d079761d77a422ea3ec13b60485d0f8
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 654984ad6cbffe09f7f8dd820b4d4e34960d221bf07b6f60bee9dcd327e63c02
    media_type: application/json
raw_manifest_sha256: 8023608c226aa1e588b689b7c19e1324ac1373682110a727eacd8ec67ad1b53a
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
# Recorded Sample 2
