---
id: SMP-GEO-C1-BASE-Q3-CLAUDE-1
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
    path: runs/RUN-GEO-C1-BASE-Q3-CLAUDE/outputs/extraction-1.json
    sha256: 41d938f32aa4cd440ae5a2479bd16adfa93d27c0ac535ce35c09305366277e70
    model_call: MODEL-92bffc2f-bf8c-45d4-a866-893e94e0bc90
purpose: baseline
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-3BC4
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C1-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q3-CLAUDE
slot_key: 00a27d35b44d04f9d5472f538e5a097e83b9ece1d8038a345b5ea914bb2e7a7e
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: ab868325fa8ce2576c2db3952929692c417f7d3e21725576eff7364f952dfc0d
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 96708d5ef29779b39d762e1544144bd91961fd3429c858cb346750fdfef9ef61
    media_type: application/json
raw_manifest_sha256: f7b937ca0ec200848ff36b1590499318a1681ae9b2b37aadc191fa5a5a197dd6
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
