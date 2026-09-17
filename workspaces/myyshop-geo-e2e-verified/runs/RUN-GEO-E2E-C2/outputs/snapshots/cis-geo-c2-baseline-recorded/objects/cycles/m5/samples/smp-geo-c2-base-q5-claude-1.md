---
id: SMP-GEO-C2-BASE-Q5-CLAUDE-1
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
    path: runs/RUN-GEO-C2-BASE-Q5-CLAUDE/outputs/extraction-1.json
    sha256: 45ae86331edf12dbb0666f112bbf3c64eae57d3817617b582fe5975906d4598e
    model_call: MODEL-7d503968-7656-455c-b190-28fe8ee1c0cb
purpose: baseline
query_ref: Q-WHAT-IS-THE-MYYSHOP-REHEARSAL-EN-B7A5
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q5-CLAUDE
slot_key: 02ae74fcb7c6da85cd18093d10ce9889fd67203df940e9e79908cc2c0680d72a
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 9774fa5d43238ff0c19dbc182e3a24f9c0f35f3488d18c957d286381f513a67f
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 8c9e8a5c276dbabcb65ad8f2f0e282fbb32c3b30fe9244c454ca3d330c667649
    media_type: application/json
raw_manifest_sha256: 9672b2d0ea5384320634436762fa166fda158854cb9bf24b7d999f2e230e6129
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
