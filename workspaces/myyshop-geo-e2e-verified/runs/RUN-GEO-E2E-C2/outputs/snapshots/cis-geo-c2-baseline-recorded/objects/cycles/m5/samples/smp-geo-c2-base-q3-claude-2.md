---
id: SMP-GEO-C2-BASE-Q3-CLAUDE-2
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
    path: runs/RUN-GEO-C2-BASE-Q3-CLAUDE/outputs/extraction-2.json
    sha256: 700991b19aafbfd5bb6d04fa724705c0b2f94f274180c58f19d0c289cb109264
    model_call: MODEL-67a773b2-1e30-4255-a2e3-8bd1dce39735
purpose: baseline
query_ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-747A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: capability
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q3-CLAUDE
slot_key: 207f244832863f25d62ddb909703bb23ec76d81dfb973024139df89470ba5a2b
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: e948afd172349b108329aa51da6b317a0a04809c95d7364ab41c808c087a507f
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 4be0ab09e9f12c33d28a04806cd6cf5e397915f832353a8216e14e054250d295
    media_type: application/json
raw_manifest_sha256: a929fff205b1ac32d3e2d55c3644a1aaa926acd73a57782267ecb35b925da4cb
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
