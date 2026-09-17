---
id: SMP-GEO-C1-BASE-Q5-CLAUDE-2
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
    path: runs/RUN-GEO-C1-BASE-Q5-CLAUDE/outputs/extraction-2.json
    sha256: 281f689d1857b39774e76dff16d8c2eb4a1c2ad10a3dddd391a54b443e94dbe4
    model_call: MODEL-757afa41-73d5-4ef0-bd19-c4b44fcaf96e
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
slot_key: abc1111216f43b80dcc9654830ef4521acd7e5856d66deb8595f33e175af7147
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
    sha256: 58918f6de24043f91bb37a8e4542e3f8c2ac868f617ce8f89cfbb6557aa48bc7
    media_type: application/json
raw_manifest_sha256: 469d2ce6c91f385fe6f826b1096b08e2577e30941c27b0399ee8e91a9c1fa53f
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
