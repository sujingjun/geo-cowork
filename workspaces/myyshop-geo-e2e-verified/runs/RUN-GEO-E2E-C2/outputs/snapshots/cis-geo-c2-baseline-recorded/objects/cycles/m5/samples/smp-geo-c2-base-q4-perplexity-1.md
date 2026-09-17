---
id: SMP-GEO-C2-BASE-Q4-PERPLEXITY-1
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
    path: runs/RUN-GEO-C2-BASE-Q4-PERPLEXITY/outputs/extraction-1.json
    sha256: a1b96a4399f1a26fe5602fca991e475552a161f2c369d94375b858c537917915
    model_call: MODEL-9360ec6e-735c-4297-91c1-aa48c7fb3285
purpose: baseline
query_ref: Q-WHAT-EVIDENCE-LIMITS-PRIVACY-BOUNDARIES-EN-AB42
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: other
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q4-PERPLEXITY
slot_key: 188f3c4ef94950f9eb5c1349b0ea45eda5395b0d627b43328fe644ade9365505
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 8751b15c37c82c92ab3a214c443364e4d6c58ad8c26a2ef8c7e23a6d41051a9b
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 51ba9b8db5edce6d0d956059ecd35a582f1defb3285cabb87f9a7da858aa7108
    media_type: application/json
raw_manifest_sha256: 34c516ec0b139c8b07b04afacfca6f103af8a1aba9737d6f96c2087265c0fedd
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
