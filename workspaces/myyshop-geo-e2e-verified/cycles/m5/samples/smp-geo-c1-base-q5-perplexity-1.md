---
id: SMP-GEO-C1-BASE-Q5-PERPLEXITY-1
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
    path: runs/RUN-GEO-C1-BASE-Q5-PERPLEXITY/outputs/extraction-1.json
    sha256: b0081b24b74d4f05f43a869a8f0abd4096b8cceae7bcde1fcd57107de9f255f2
    model_call: MODEL-b1dc80c4-3818-4be5-b609-eeb8baa780be
purpose: baseline
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-2B21
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C1-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q5-PERPLEXITY
slot_key: e7166c38b0581cf0832b84929e18e3c066f2fd487686e8a7c0de243f0c339a8a
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: bb768ba0ecaf25ac821805139eb73d076edbf879fc6ff7577e2b480189866818
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: ef2221a8d4d64c3011d59be6b74e6cf6286d06b68215b54213f5e27605ee5a61
    media_type: application/json
raw_manifest_sha256: b7c4311c83cd09ca346bb27538dcd49e67eaeb03cfb712d697239cfefaf7a5b0
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
