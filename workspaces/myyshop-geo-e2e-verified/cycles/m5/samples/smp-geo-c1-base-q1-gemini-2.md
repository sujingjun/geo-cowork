---
id: SMP-GEO-C1-BASE-Q1-GEMINI-2
record_type: answer_sample
status: recorded
version: 1.0.0
created_at: '2026-09-16T00:00:02.000Z'
updated_at: '2026-09-16T00:00:02.000Z'
title: Recorded sample 2
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
extensions:
  geo.extraction:
    path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/outputs/extraction-2.json
    sha256: 2b8fd95fa327854e88e9674c9b15466949b6767caefeee00e5947e41abd8a7a2
    model_call: MODEL-2a40eb20-fd24-435e-8f28-47178d39bb76
purpose: baseline
query_ref: Q-DOES-THE-MYYSHOP-REHEARSAL-GUARANTEE-EN-F889
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: capability
platform: gemini
collector_profile_ref: CPF-GEO-E2E-C1-BASE-GEMINI
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q1-GEMINI
slot_key: 0c3061f4d3bbe2f290bf0a9d6eb384cf221988bf807c6f9019835cdd75c14f40
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 6607f587a488799b0f0b775f1035bc2fc2183dd21a354c89936d1c08e49597c5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: c6135d4e5fdedd08747defe266ced4ffeabd60dcf390909dc1dc083331517d72
    media_type: application/json
raw_manifest_sha256: 673c94013dcc380c91fab5ea59d251bde83f6db096f3acdcc220be0d1d21d2dc
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
