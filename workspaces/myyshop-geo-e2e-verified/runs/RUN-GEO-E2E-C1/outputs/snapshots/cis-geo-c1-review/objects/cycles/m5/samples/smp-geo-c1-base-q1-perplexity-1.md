---
id: SMP-GEO-C1-BASE-Q1-PERPLEXITY-1
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
    path: runs/RUN-GEO-C1-BASE-Q1-PERPLEXITY/outputs/extraction-1.json
    sha256: 2c68285c081c4203248f3367f010a6b7f4c6b2178bc1b8701a4d8385c65a2f00
    model_call: MODEL-c64f0f4f-fe20-4721-9685-c371f1cd2dc0
purpose: baseline
query_ref: Q-DOES-THE-MYYSHOP-REHEARSAL-GUARANTEE-EN-F889
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: capability
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C1-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q1-PERPLEXITY
slot_key: 0fc1109dd19cc54fe87772401641b646226fa82fceb8a5d69aa07d0479a30507
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 66df9abbd6eee2e8138d57e57c10c469feae04045506682c5d2711bd7487a91a
    media_type: application/json
raw_manifest_sha256: 8c2083d192b2a1a134499ea299b7a1942bc654ece1d1e9c66c50c91fd3501833
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
