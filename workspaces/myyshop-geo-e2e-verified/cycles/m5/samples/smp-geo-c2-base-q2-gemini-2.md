---
id: SMP-GEO-C2-BASE-Q2-GEMINI-2
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
    path: runs/RUN-GEO-C2-BASE-Q2-GEMINI/outputs/extraction-2.json
    sha256: c389374a43fb27550494609bf2cfd4cf3bdd2b0f43a13fc9b91a2089ed79e467
    model_call: MODEL-ec0855be-9784-4d7d-9a7b-e6272b55b1ef
purpose: baseline
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q2-GEMINI
slot_key: cc7ab092aed06c900633873ba5585d15518bc2150d30f11ec5dab9b3c656be8b
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 43946e8d50763282655618d825004ca24889ce202eb9116c03b0ef147ee2103c
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 9b6c0400f4b7fee323c6cb29e3d288e80bb536bcb9c891858a0bfeb547de723b
    media_type: application/json
raw_manifest_sha256: 5a6b3f397761e238c1284d942181c756470626d76f02fd25926b31b2fb9aae11
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
