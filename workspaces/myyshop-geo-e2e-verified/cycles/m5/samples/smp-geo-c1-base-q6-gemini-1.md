---
id: SMP-GEO-C1-BASE-Q6-GEMINI-1
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-09-16T00:00:01.000Z'
updated_at: '2026-09-16T00:00:01.000Z'
title: Recorded sample 1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C1-BASE-Q6-GEMINI/outputs/extraction-1.json
    sha256: 082f2ad1d363e64b2a207ef7e7fdca94f2c565f7351c46e05e8f1a452a658773
    model_call: MODEL-470b00ed-5c76-4c52-a99c-4e79f8f5fcee
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-USE-EN-1531
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C1-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q6-GEMINI
slot_key: a5c301630b4ee401527c9e279caf6a5fcff12131f5166062ff8d89729a836d0b
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: dea192c958ddda8065ba4885303c377c85c73ad12f36df908fbfd82c546d7c30
    media_type: application/json
raw_manifest_sha256: d7cd440a085bbc189759755b58deb605504674a7aa99b6c087b758cf0783236a
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
