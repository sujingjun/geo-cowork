---
id: SMP-GEO-C2-BASE-Q6-CLAUDE-2
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-09-30T00:00:02.000Z'
updated_at: '2026-09-30T00:00:02.000Z'
title: Recorded sample 2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C2-BASE-Q6-CLAUDE/outputs/extraction-2.json
    sha256: b992116d18cba81a71fe32d8e84719096cd17e2ff1b738c697aa4147fc692917
    model_call: MODEL-98c0de2d-eecf-4c0e-92d0-5f68a3a28718
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q6-CLAUDE
slot_key: 3af8740b884f06abf0be371c1574e3ec9a8ceda8b5e3639efd99c843e9314c69
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: b5d08e2297953197e42fb44284ce8470ebfeb6391636872184f4820a1c0e8435
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: fe1c26ab48c5a9f983a439ff68ccdb54b3754b69020d1bd02ed2e78d724807bd
    media_type: application/json
raw_manifest_sha256: c43230911c9b09f8fa0f6b0f7c1dbc964001d1967627c6fecf8fbfb16a57949d
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
