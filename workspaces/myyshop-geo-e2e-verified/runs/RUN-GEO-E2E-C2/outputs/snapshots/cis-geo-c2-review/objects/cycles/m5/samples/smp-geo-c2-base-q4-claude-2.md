---
id: SMP-GEO-C2-BASE-Q4-CLAUDE-2
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
    path: runs/RUN-GEO-C2-BASE-Q4-CLAUDE/outputs/extraction-2.json
    sha256: dcb511ffc297f7a5d25f0b6c84e392b2c6be744bc671d034ea4e060035a34b91
    model_call: MODEL-ec35ad94-b596-4249-af8e-1cc34cc9bfa3
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
slot_key: f80e50c23030b23a160f619d6314192482beb07a6cc28aded6323e3293ccfa13
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 2682145b971b031a33695d65ed7720577d9c0c124f25c43e97be40f26fcb8c26
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: b0f8fa7e12ad1a19a55327d6b53012281114a9b6cf91d6e8dcdf08361b3ca674
    media_type: application/json
raw_manifest_sha256: c7549e7212221aab23747d9a750ab16c8836d1ed113c7278a382c22af27af327
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
