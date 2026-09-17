---
id: SMP-GEO-C1-BASE-Q6-CLAUDE-2
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
    path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/outputs/extraction-2.json
    sha256: b2dfe73b277fa13cb1ef1763771ed8dfaf5636121edf14b87e4e7e37d31a9231
    model_call: MODEL-a46c4484-a228-4e28-9e09-d686d27e3223
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-USE-EN-1531
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C1-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q6-CLAUDE
slot_key: 0a1299e740f73e8a4eb489d1028a9e54320ae7612ddab65bc8407b82945c1649
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: e4a1819e674e3ec31f205818a4d4e5b6eaaf1102ad823e133f3cae7bbfa5e777
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 96f4914dba0cbf0d448877a0b5d00206a0781eadf6ac4dcdc08c9b1521859a86
    media_type: application/json
raw_manifest_sha256: 637f4baa3d73feacf3593216926652fc730a1ef66d9161e3839bd6fd003d6083
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
