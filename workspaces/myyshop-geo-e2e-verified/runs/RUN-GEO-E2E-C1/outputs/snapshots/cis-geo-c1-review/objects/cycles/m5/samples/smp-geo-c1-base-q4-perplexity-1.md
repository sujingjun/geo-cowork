---
id: SMP-GEO-C1-BASE-Q4-PERPLEXITY-1
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
    path: runs/RUN-GEO-C1-BASE-Q4-PERPLEXITY/outputs/extraction-1.json
    sha256: 1b734d33939f034a243e031a8ede147f9c1236b2fbae62eb74698fb81ee15eee
    model_call: MODEL-d284ead9-2a69-47cb-a297-ef5a3dbd3bee
purpose: baseline
query_ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-2DE3
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: capability
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C1-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q4-PERPLEXITY
slot_key: b246622e55e80759474c6e3284396c0ec49e2aafb3f68efb96cd4178a044cf37
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 837a9422da39bb66306158337cb30c4aa4e029f82654a15e63b92f85c1e151ac
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 77e649b514930519ca19315ed9261219a6a0115f5983656b468ea51fd418f11d
    media_type: application/json
raw_manifest_sha256: 624b3d4fe82eb44e03cc3d1047bc8ba15bdd1093b3d7a08208f4b4fc48c338cf
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
