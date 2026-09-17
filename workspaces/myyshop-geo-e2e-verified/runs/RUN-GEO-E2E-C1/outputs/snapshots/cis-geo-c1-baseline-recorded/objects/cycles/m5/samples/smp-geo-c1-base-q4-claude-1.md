---
id: SMP-GEO-C1-BASE-Q4-CLAUDE-1
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
    path: runs/RUN-GEO-C1-BASE-Q4-CLAUDE/outputs/extraction-1.json
    sha256: c4d878d06d792d01427df36e6885a72ef1c547eced2111478e42f5e653d02bab
    model_call: MODEL-23a993cc-469a-45fe-95a1-47b632187ec1
purpose: baseline
query_ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-2DE3
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: capability
platform: claude
collector_profile_ref: CPF-GEO-E2E-C1-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q4-CLAUDE
slot_key: f87cb2b38fae4a0469d4520d22ee05988a9655e0a1a67be4eba6ca38089d01af
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 88629a43327b1a877e746a9f9f0f33ae7b3e50717d80f50beb1cd433f93246d5
    media_type: application/json
raw_manifest_sha256: 0327cad22c84fc8c55848b495ed3895a7447177037033367f366aeda34d90687
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
