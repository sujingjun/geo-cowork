---
id: SMP-GEO-C2-BASE-Q1-GEMINI-2
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
    path: runs/RUN-GEO-C2-BASE-Q1-GEMINI/outputs/extraction-2.json
    sha256: 3a5d3748a7a6de8818569c37a752e1b28b6a90fcc675eb8f40263ae6d833ccbe
    model_call: MODEL-5245adf1-203f-48c8-b5c4-ef5c66c94e67
purpose: baseline
query_ref: Q-HOW-SHOULD-AN-ELIGIBLE-CREATOR-EN-D279
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: comparison
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q1-GEMINI
slot_key: f32d89a3c3411d5e436a071307450b623f7cfb8f1c803b0e64ecfd38e572aa9b
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 573d7fc0f790661103f95c3ce3bd9bdec37d1dde646a5ff0156d211ba33146ea
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 51ae835c103a56a56605f9cd8f45ffbbefad65030f62086f16f63392f30b84e4
    media_type: application/json
raw_manifest_sha256: 5a4cbadd446c36d7e1aced3a92ebfa281b123a7477e3d670481c8826bb94a201
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
