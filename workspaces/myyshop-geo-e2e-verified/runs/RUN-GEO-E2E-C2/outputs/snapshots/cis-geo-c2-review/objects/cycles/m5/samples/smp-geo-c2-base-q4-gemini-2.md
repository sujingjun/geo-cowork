---
id: SMP-GEO-C2-BASE-Q4-GEMINI-2
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
    path: runs/RUN-GEO-C2-BASE-Q4-GEMINI/outputs/extraction-2.json
    sha256: 5734434ebd84a096c4cadf80ef129103bf583cbc7a15cef3d5281cb6d8f2c1b8
    model_call: MODEL-b7622456-107e-4e4e-880a-b2ae66688cee
purpose: baseline
query_ref: Q-WHAT-EVIDENCE-LIMITS-PRIVACY-BOUNDARIES-EN-AB42
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: other
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q4-GEMINI
slot_key: 86df0657b8170fdfc313028e5f5686106442c393396a0e813858dd95f69811d5
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
    sha256: b9e3f2df2a2bc683b2a60ea20ad6c69273e7e120170f0c19209f34622c6d27d5
    media_type: application/json
raw_manifest_sha256: 38c2b04d1a7356dbaea0c9849b7aee66d5b2bbee2722ff728c12097c5a342be5
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
