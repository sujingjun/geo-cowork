---
id: SMP-GEO-C2-BASE-Q6-PERPLEXITY-2
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
    path: runs/RUN-GEO-C2-BASE-Q6-PERPLEXITY/outputs/extraction-2.json
    sha256: 9f7c2267d682d7110aa473c53c387c38f18712663bf765e8f2af9560f5ac9c40
    model_call: MODEL-9cd1011d-5e61-4197-9dc4-179d82332e50
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q6-PERPLEXITY
slot_key: e20934fb4a908aff424631807b2f58a85250bf84d9eb843545d23785104b5826
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
    sha256: 661e6815f2bf717f87d119c45f5bbec4478c017872039932f6e3285c60795647
    media_type: application/json
raw_manifest_sha256: c3a8076410dbcf4769ecb3af25ca752daca7eb645db306e1ab8475a43d8460f8
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
