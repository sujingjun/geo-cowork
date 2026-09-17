---
id: SMP-GEO-C1-BASE-Q2-CLAUDE-1
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
    path: runs/RUN-GEO-C1-BASE-Q2-CLAUDE/outputs/extraction-1.json
    sha256: 24bab8d711529489173aed9c6a407c340fb1799843584c666787d68af775bfdd
    model_call: MODEL-2efa6d08-745e-4843-8979-02e5424b4edf
purpose: baseline
query_ref: Q-HOW-CAN-I-COMPARE-THE-EN-B48D
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: comparison
platform: claude
collector_profile_ref: CPF-GEO-E2E-C1-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q2-CLAUDE
slot_key: fbc9e2022aee20168a0f631cf94bb4bb861390cab95033a27920eda1d43852ba
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 039c3c8160454cc2f0dfacefae59f118664ae4a72ae0f52b790280bd02c0af6a
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: d7d685ae7245175766d07828586574255cc505d1616eaad909b0e66209efbd4d
    media_type: application/json
raw_manifest_sha256: 8dd64f12131e1dd31a48bf8a592010ce522293dadf63697582d26c1a27ff944b
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
