---
id: SMP-GEO-C2-BASE-Q4-CLAUDE-1
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
    path: runs/RUN-GEO-C2-BASE-Q4-CLAUDE/outputs/extraction-1.json
    sha256: acaf3c03be1e05e63f592ff81515bdd21d6996f6d197881f89a449c178560256
    model_call: MODEL-c49417c9-bc2b-46d3-b862-1dd998a37e29
purpose: baseline
query_ref: Q-WHAT-EVIDENCE-LIMITS-PRIVACY-BOUNDARIES-EN-AB42
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: other
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q4-CLAUDE
slot_key: e520359937a0ed9b50f3178cfc1dc941295b89a8dd1af7c627c0ed665df4a1da
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 8751b15c37c82c92ab3a214c443364e4d6c58ad8c26a2ef8c7e23a6d41051a9b
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: e94e3c4114ef1901cdbcf766d14c201b723abc1cff37df9b0c3ebd963640bc52
    media_type: application/json
raw_manifest_sha256: db0a7eccecafd51799678201c163999859d036cd236486ddc8d028aef669aa86
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
