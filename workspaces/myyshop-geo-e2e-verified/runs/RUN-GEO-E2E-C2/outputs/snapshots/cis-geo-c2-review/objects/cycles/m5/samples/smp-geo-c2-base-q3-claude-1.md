---
id: SMP-GEO-C2-BASE-Q3-CLAUDE-1
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
    path: runs/RUN-GEO-C2-BASE-Q3-CLAUDE/outputs/extraction-1.json
    sha256: 048c0faa127c2dcceaf5fc43969c8e7e55928ef14d5b0d394710494b9dd7c014
    model_call: MODEL-eeb6a0ee-105d-4d8d-9416-1d9da260bd9e
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
slot_key: d71892245a36625624bdf8bd90edb23e9e4bbd6093c4dea88a118a3cbfde03cf
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
    sha256: c03e40ef760d98a1e66a56110dac27291d33c4a6e225daf99647069695e9e498
    media_type: application/json
raw_manifest_sha256: 0c183cc019368ecbfa56e1a7a5ae4d4a689dc088c9fa21c2177741a85829a381
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
