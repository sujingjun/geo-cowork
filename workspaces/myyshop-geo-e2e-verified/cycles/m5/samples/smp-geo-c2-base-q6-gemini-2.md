---
id: SMP-GEO-C2-BASE-Q6-GEMINI-2
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
    path: runs/RUN-GEO-C2-BASE-Q6-GEMINI/outputs/extraction-2.json
    sha256: fd41d151afe464a4714c3337b7ed18efba11415b9500dd8eb66f9a3bb0e3b149
    model_call: MODEL-d0c26e60-3fc8-4509-98a6-751bab869359
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C2-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q6-GEMINI
slot_key: acb56490713955413f257efcd453ba1f990d3352fb0cd25a33e69a09b8bbb0e6
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: b5d08e2297953197e42fb44284ce8470ebfeb6391636872184f4820a1c0e8435
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 6dd9135dafa4856086a521c3feec8e9ebd30c4c4c2d2b1d15fa6a04a5d5434b5
    media_type: application/json
raw_manifest_sha256: 3e078e8d2e9c95300bc1df17cfacf366268de2d5ce4b8d7728085740cbc3f724
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
