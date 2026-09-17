---
id: SMP-GEO-C2-BASE-Q4-GEMINI-1
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
    path: runs/RUN-GEO-C2-BASE-Q4-GEMINI/outputs/extraction-1.json
    sha256: 1e6612519d315d8e659944dc5a3e9e28ba02093d6139633d6001e855200befc2
    model_call: MODEL-8271e33b-71b8-4879-b9e3-3332dc675386
purpose: baseline
query_ref: Q-WHAT-EVIDENCE-LIMITS-PRIVACY-BOUNDARIES-EN-AB42
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: other
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q4-GEMINI
slot_key: 18304e3b1e3c4ac7527270c2413910fe29bbf4b372ff7a39e5caa8e9c6a46cca
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 8751b15c37c82c92ab3a214c443364e4d6c58ad8c26a2ef8c7e23a6d41051a9b
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 96c4148ea890c7429d0331a7d037124cf619aaa43da9b7c1164faa5d50024328
    media_type: application/json
raw_manifest_sha256: 876e6c68865cf8e811a996dcdfe6b26584d925d034fc48b54bfdcceddf4c5bae
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
