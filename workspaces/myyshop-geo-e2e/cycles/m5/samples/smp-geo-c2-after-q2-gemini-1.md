---
id: SMP-GEO-C2-AFTER-Q2-GEMINI-1
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
    path: runs/RUN-GEO-C2-AFTER-Q2-GEMINI/outputs/extraction-1.json
    sha256: f16616626f1c2df75491463ec1fcd3ed7022d0d07fbae78e9275b9fbca4715fd
    model_call: MODEL-44130a93-3a77-4641-b719-7e2eea7a9ebd
purpose: post_change_retest
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-2CC4
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q2-GEMINI
slot_key: eaf765c0db1c0a31eb6abd9e7fdb92570f81c666ed638ac0aed459ff9a497e86
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 6b43628ab9ba2be523784343283b0da779fb0b0daf05d0a1a43bb3373fc8d8d1
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 0a74ddcc7da991b802066223f37a748ce6299eb74a7b1b7b613f802f978cf0ed
    media_type: application/json
raw_manifest_sha256: f45410e81f63a62ca774013f4f872d9c4be8c1289ecfbb2f07b03f1eb48de107
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
