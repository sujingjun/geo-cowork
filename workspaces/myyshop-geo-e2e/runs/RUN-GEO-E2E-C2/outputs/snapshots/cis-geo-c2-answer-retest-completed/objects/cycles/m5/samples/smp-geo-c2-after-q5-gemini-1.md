---
id: SMP-GEO-C2-AFTER-Q5-GEMINI-1
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
    path: runs/RUN-GEO-C2-AFTER-Q5-GEMINI/outputs/extraction-1.json
    sha256: 3e5c74da8c5e2096089caf2b28338eda1e77b117fbd4ba6154fdfe65d66e8804
    model_call: MODEL-08dfe514-06cf-48f7-84b1-f7ea7806af68
purpose: post_change_retest
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-1724
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-AFTER-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-AFTER-Q5-GEMINI
slot_key: 774d532fe31b97df4a86df44ef107e82d9cb9a79cb4cb1e31cb9f2504bc78f00
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-10-07T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: ae3fa165c5234fedd0af63077b17f20189a0b1ee941b2ce1dd861ab0b75d5965
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 4ac0e7ca1e2cda90004dea64441e43044115de0129575b3d697124d38180a28d
    media_type: application/json
raw_manifest_sha256: 9d225565a26e0f06e316440900b6d53b786538229fda9153d9853ce8fc509a1c
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
