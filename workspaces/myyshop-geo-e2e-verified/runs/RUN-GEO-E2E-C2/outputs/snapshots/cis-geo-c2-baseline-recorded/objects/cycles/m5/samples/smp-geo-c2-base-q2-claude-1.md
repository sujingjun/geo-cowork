---
id: SMP-GEO-C2-BASE-Q2-CLAUDE-1
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
    path: runs/RUN-GEO-C2-BASE-Q2-CLAUDE/outputs/extraction-1.json
    sha256: 09b7c23fd1bb2c31a1cba83c71dbd0d452a7dc3b3b083da9b0b3eb71adf7b7ee
    model_call: MODEL-61dcffbe-fe7d-4eeb-bf75-780e2f262c28
purpose: baseline
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q2-CLAUDE
slot_key: 0c599c1ba3a7626333e133e4952d533d78d2fdfe6f902823dff93cbcb06781d6
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 6c544daa5264d3773c0dc4f7a6ae21a68231bbadb1513dc03a61b1dba996123b
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 7453d5f1bdbbb33ca44aeb9629ef6aff5711cb974c544c6752aefe7306ef576d
    media_type: application/json
raw_manifest_sha256: 86465ab024b8685e094281cab4b419c214cac7a8f47782080905b3d56d85a101
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
