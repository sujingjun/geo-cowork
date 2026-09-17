---
id: SMP-GEO-C2-BASE-Q6-GEMINI-1
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-09-30T00:00:01.000Z'
updated_at: '2026-09-30T00:00:01.000Z'
title: Recorded sample 1
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C2-BASE-Q6-GEMINI/outputs/extraction-1.json
    sha256: 3c5f737302294a6e585e1e459f759aafdf3851c3614fdabb9842351118d5b734
    model_call: MODEL-72b53fb6-ddbd-4ce0-a4ae-03d90f28ae6e
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q6-GEMINI
slot_key: 59d1562428de3a3dc09a07af0ff9465f389bb2c8593556ad0911c548ea5c44f9
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: eb596ee94aef42aaaf603f819c0e653604f3acc65bcae78c6480f6a8ba8393a2
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: e0a5ffb11051503c5c80a37a88d9172ea022b4c177018d231713d94e718f3135
    media_type: application/json
raw_manifest_sha256: 3045fc0e706960e4ece765cad95a9bf9bdc2df8d6c6ae05317131580aff649e8
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
