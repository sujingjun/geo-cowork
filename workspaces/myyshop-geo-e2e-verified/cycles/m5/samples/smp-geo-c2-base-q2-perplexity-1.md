---
id: SMP-GEO-C2-BASE-Q2-PERPLEXITY-1
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
    path: runs/RUN-GEO-C2-BASE-Q2-PERPLEXITY/outputs/extraction-1.json
    sha256: 7a1eac8d8bfcaf51d1a7834fa939a97b55551697a848dbd6064244ed62fd0cb0
    model_call: MODEL-936dd281-d58a-4ca6-8daf-945e4f0e0986
purpose: baseline
query_ref: Q-WHAT-ARE-THE-MYYSHOP-REHEARSAL-EN-57D1
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q2-PERPLEXITY
slot_key: c0a577d040e7ad023dd985f5adba612573193c0e32c2db1be651e518a63cadf9
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
    sha256: ccd4977e83d175fd4d31030135f554805b1e7daabe323f91e83fed5d6cc7f1e7
    media_type: application/json
raw_manifest_sha256: 21328a6f8bc761131630b206b543db7a3e7bdcb4852a8739aa6594c52bcdbad8
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
