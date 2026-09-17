---
id: SMP-GEO-C1-BASE-Q1-CLAUDE-2
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
    path: runs/RUN-GEO-C1-BASE-Q1-CLAUDE/outputs/extraction-2.json
    sha256: 6f4f22fd385d529582e41b59beb04f386e486d8435c2038fa46a37e0f384ac9f
    model_call: MODEL-1ee9abde-12ca-4e28-b36f-b51c15576d97
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
slot_key: e0d24c92aa54d293836c23762d5e779e50c1a01ee5a33108dc113330c15074a6
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 8f09645857c16261adf9c9a4c8bc951603094ec81a032c82cefa564ba003fb31
    media_type: application/json
raw_manifest_sha256: d53b1b60d382b3c9d9391f3677b7222cf5f2af9761a0a7a5a02994dca22632c0
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
