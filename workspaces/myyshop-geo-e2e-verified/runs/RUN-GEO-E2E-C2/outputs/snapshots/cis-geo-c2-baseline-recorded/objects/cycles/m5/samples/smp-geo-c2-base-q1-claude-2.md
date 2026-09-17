---
id: SMP-GEO-C2-BASE-Q1-CLAUDE-2
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
    path: runs/RUN-GEO-C2-BASE-Q1-CLAUDE/outputs/extraction-2.json
    sha256: 284324fa89ae2c608be07351a4750175065eefd9a356633ca02571dfe94ecd2d
    model_call: MODEL-c822f8d9-304e-4080-9132-2a344afd1418
purpose: baseline
query_ref: Q-HOW-SHOULD-AN-ELIGIBLE-CREATOR-EN-D279
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: comparison
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q1-CLAUDE
slot_key: ad16d8a0bfb7efa3dc89e3f9d4481a64ffa2ca279ca3d825debe8ab9829547a0
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
    sha256: 8f8e9c1e600b0a6bb71aa54c2129c8f5bc6857e81b028e5a1f4c0df3f3923805
    media_type: application/json
raw_manifest_sha256: e0bb6679712b9c55d12fab62f20c47a6c2e4f63e27bd642022b9ca2027a03246
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
