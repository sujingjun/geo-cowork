---
id: SMP-GEO-C2-BASE-Q2-CLAUDE-2
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
    path: runs/RUN-GEO-C2-BASE-Q2-CLAUDE/outputs/extraction-2.json
    sha256: 15f22ceffdee99a7d359013a5d9643bb437355aeb9445e3e535181b5245cfdd4
    model_call: MODEL-6c63bb7f-78d4-4c58-83b5-b849000253ff
purpose: baseline
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q2-CLAUDE
slot_key: 3042201c3141f038a459c27ecceed60cbcc6cfc5bc148b1e849157a7715a5827
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 43946e8d50763282655618d825004ca24889ce202eb9116c03b0ef147ee2103c
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: fe761ead899a1959034b731bd49780a7742f3e0edd53c0c895699ff67da4a567
    media_type: application/json
raw_manifest_sha256: 07620ce12b95d4068f56f54a714cabab104645b9d209f2f996b22a48f16e8126
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
