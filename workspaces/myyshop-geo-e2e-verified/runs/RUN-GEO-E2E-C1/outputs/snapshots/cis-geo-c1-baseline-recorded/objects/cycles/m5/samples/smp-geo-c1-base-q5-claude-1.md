---
id: SMP-GEO-C1-BASE-Q5-CLAUDE-1
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
    path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/outputs/extraction-1.json
    sha256: 9dac05a519424413c3bea0b8eab2228541ffa904d3ae3782a5018f24fb0b2020
    model_call: MODEL-94ff19e1-e26c-4b91-9eb1-202cd2d12e4a
purpose: baseline
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-2B21
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C1-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q5-CLAUDE
slot_key: d420ee01930e6d0f5e8e87b3fc6da22bdfff201b25695a651546c38aeb05b630
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
    sha256: aefacb651f0948c7c5bd73364b38e9b59d9c2454b11c8f4dd81194855a0cac9b
    media_type: application/json
raw_manifest_sha256: 5307ef92082fce5319078cd9f0e58f6832661c3b34bf48f5015352ec1d91fb87
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
