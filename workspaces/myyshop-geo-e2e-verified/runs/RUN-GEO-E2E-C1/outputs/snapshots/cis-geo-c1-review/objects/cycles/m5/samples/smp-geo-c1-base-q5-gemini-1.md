---
id: SMP-GEO-C1-BASE-Q5-GEMINI-1
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
    path: runs/RUN-GEO-C1-BASE-Q5-GEMINI/outputs/extraction-1.json
    sha256: ea37fb89cf5694aa7e099f81342b1cfe0df8f718a6e92ec5e7315e493f91fd31
    model_call: MODEL-33809086-d003-46b1-82e3-85fc763ef948
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
slot_key: 93d4fd4b9de8249d15322edf845454cb0770b9772e7b4427514d09298d16a96d
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 71831dfd886be7fe3564b8d781bec5f1754431e7037a542a6f9adeb353aef4d7
    media_type: application/json
raw_manifest_sha256: aaf1cd2653f267ec14103ac00f8e50bc0a83f6f9dc6670da3aab08724c6044a5
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
