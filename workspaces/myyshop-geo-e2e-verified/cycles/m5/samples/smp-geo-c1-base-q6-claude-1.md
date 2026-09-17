---
id: SMP-GEO-C1-BASE-Q6-CLAUDE-1
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
    path: runs/RUN-GEO-C1-BASE-Q6-CLAUDE/outputs/extraction-1.json
    sha256: 275648df2bac94b24267b9a8444ec9ba8afeb7c462584028a89ac4e92c2081ef
    model_call: MODEL-22a07db8-6dd7-4031-a7c0-194bece73dfc
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
slot_key: 44837b3c4f150d0e470e4e2e46d71387fcd11574328402cc3807bd16d40c2985
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 528325e131824b411769346cb0286f00a739d625192b20d0c12261e037468468
    media_type: application/json
raw_manifest_sha256: c45de00deb946e1cbbf9b4158b9e79b9b4807e0534df28463d033898a35d824f
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
