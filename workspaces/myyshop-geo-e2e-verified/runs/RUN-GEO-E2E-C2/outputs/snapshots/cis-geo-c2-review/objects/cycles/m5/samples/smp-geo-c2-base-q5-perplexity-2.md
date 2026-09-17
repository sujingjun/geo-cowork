---
id: SMP-GEO-C2-BASE-Q5-PERPLEXITY-2
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
    path: runs/RUN-GEO-C2-BASE-Q5-PERPLEXITY/outputs/extraction-2.json
    sha256: 2802b1c9ead1a6b563fda07cfc2402e3599965aac1704d638455f9c168f92a7a
    model_call: MODEL-0e21e5bb-3fa8-45d5-b153-32af0ab4499f
purpose: baseline
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q5-PERPLEXITY
slot_key: 37dc1b70b93f9de242c4181b5e0739f225dbc2339553913fa2e24adc0fb9266a
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 1c137958d5eff1ebcc4528150619e8c05e44b46c52fc4548124e04a8b95bb8a5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: b1e95fef381f5c10a36a98c686f9a4b2601787d3f0cdfa3f48bde54816f49879
    media_type: application/json
raw_manifest_sha256: 1014e93f37831de37ee86f5523c4148ceff87208d5161c2f7facca40c70b36b8
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
