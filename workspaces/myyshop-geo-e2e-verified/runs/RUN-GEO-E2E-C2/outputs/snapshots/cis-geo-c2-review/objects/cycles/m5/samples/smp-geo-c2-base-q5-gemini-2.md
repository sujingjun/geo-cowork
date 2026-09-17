---
id: SMP-GEO-C2-BASE-Q5-GEMINI-2
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
    path: runs/RUN-GEO-C2-BASE-Q5-GEMINI/outputs/extraction-2.json
    sha256: 547fab998029eec6d5ae4be4ffeac66a9cdb42385536bbceae075d8c8d8068ab
    model_call: MODEL-94cd4db3-5567-4452-aeb5-3efd7895668e
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
slot_key: 989d4d8c757706e7da92434b0b3b3837701eadc807a65746af365b41eb2e7f35
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 1c137958d5eff1ebcc4528150619e8c05e44b46c52fc4548124e04a8b95bb8a5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: b17377b1efd1a3b850e1df39d98fa624f8570a17c4515cf28211d04384824809
    media_type: application/json
raw_manifest_sha256: a6130cc1263e24ef957c65385131994f852d1ec7d658f4c3ba08ab25073d7850
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
