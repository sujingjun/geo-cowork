---
id: SMP-GEO-C2-BASE-Q3-GEMINI-1
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
    path: runs/RUN-GEO-C2-BASE-Q3-GEMINI/outputs/extraction-1.json
    sha256: a1ecc8226c5fbc5aa3a51bce612b3e8536a83e77e7f57582bf7aa51558d92cbc
    model_call: MODEL-2d7aa8f2-88b1-4f1e-b774-3a29e26c05c3
purpose: baseline
query_ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-747A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: capability
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q3-GEMINI
slot_key: c9ec82621b0a908f25d4341106f782e9d5c8ac01d425999cf54f9a7d86047eb2
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: c07e836f4d76939b6f2ccfdf926b3df255262f53005ae2803cbe45be153964b5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 08fd504636703e8dea9176b7736d0512f3c6d6a2b2667c6d0c400a3dba098f38
    media_type: application/json
raw_manifest_sha256: 758cecbde294acc50defd265ad1b4501f236db13ffc910134e9db792fe3e3036
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
