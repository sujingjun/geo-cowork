---
id: SMP-GEO-C1-BASE-Q5-GEMINI-2
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-09-16T00:00:02.000Z'
updated_at: '2026-09-16T00:00:02.000Z'
title: Recorded sample 2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/outputs/extraction-2.json
    sha256: 02bfefc48ddd4dda5918bb617f4056cab43221eac6302ce4bdf6754541159ed0
    model_call: MODEL-8ce5a7b4-0dcf-4ab1-bca0-e2004661511c
purpose: baseline
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-2B21
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C1-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q5-GEMINI
slot_key: c1e49ad3549295ed61ab902dad9ae3c8e905b75d1547cd9ebbae434cd4f4b8e9
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: db8601fb7672f814b3df90092d8938ef0c3e494899f58cc481f3340c9b6b083b
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: c6be31819bfb561862f22e1cd9591a39088e00f7d351e67554f436c7a8d419eb
    media_type: application/json
raw_manifest_sha256: 64c46415600d4ee61989fbd61d1acf1b3427712db7dd33bb19e238bb94bd7b21
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
