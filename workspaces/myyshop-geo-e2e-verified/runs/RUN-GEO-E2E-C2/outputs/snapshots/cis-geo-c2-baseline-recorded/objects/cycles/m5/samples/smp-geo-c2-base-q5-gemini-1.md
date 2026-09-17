---
id: SMP-GEO-C2-BASE-Q5-GEMINI-1
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
    path: runs/RUN-GEO-C2-BASE-Q5-GEMINI/outputs/extraction-1.json
    sha256: 64f0f2f83e143fedf61ec8cec8df9868eff61541b022bf24f3307b3e6f172c7a
    model_call: MODEL-ac09e5be-59be-4103-bc44-6193d5549384
purpose: baseline
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q5-GEMINI
slot_key: 621ad743b63fac899b35c03723036a6dbe358cb0cb035d87da017f7662e8700b
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 9774fa5d43238ff0c19dbc182e3a24f9c0f35f3488d18c957d286381f513a67f
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 35d21a7075b7e2d5370337a0c6854306fd1d49d56f38d64a7e058267f24fca2b
    media_type: application/json
raw_manifest_sha256: c9c5f44369aa89356b1fac544caa6b50346ade3f7850f1d6be75093145c6d51f
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
