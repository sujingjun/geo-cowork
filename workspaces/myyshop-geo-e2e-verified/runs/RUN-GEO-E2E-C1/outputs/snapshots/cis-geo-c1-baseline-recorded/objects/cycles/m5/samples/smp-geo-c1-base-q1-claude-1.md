---
id: SMP-GEO-C1-BASE-Q1-CLAUDE-1
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
    path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/outputs/extraction-1.json
    sha256: d5c09f83125501199941971580da9c9a644d8db771c0e5ac6c043082bf3071be
    model_call: MODEL-3169b86e-90f5-40a3-a31c-b01f478294cf
purpose: baseline
query_ref: Q-DOES-THE-MYYSHOP-REHEARSAL-GUARANTEE-EN-F889
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: capability
platform: claude
collector_profile_ref: CPF-GEO-E2E-C1-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q1-CLAUDE
slot_key: e3d77c11c84c096aed26f614d0401a117608c9ee3a8d4438abfe9849b5c6cd13
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 8d8825921c70d205928db0b9c4d7abad41a29c7d9a4123eef8a836849f6fa301
    media_type: application/json
raw_manifest_sha256: 4e64a6598b8f77302294be48619ac991cc86088c39d7f0006420ee59b27e614f
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
