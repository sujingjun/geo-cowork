---
id: SMP-GEO-C2-BASE-Q2-GEMINI-1
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
    path: runs/RUN-GEO-C2-BASE-Q2-GEMINI/outputs/extraction-1.json
    sha256: 004e2d7047d66461c882c7ac82fec6497626d469bdde30fa2605156ff5f104a9
    model_call: MODEL-dd9ca717-8bf7-411f-b612-cb2d73528ba7
purpose: baseline
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q2-GEMINI
slot_key: d869b49e522dc309dc6b8295ab678f3d53a438355424a7f9b5d777664c5f0cf3
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 6c544daa5264d3773c0dc4f7a6ae21a68231bbadb1513dc03a61b1dba996123b
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 07045aaba5500d2c59b617824f44d3133fd3fb350e7514f4b362e4cd910fbb51
    media_type: application/json
raw_manifest_sha256: 03a6a817626029c6e3a2aab2799c6d50b606de51661416ce530b16b96bc83925
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
