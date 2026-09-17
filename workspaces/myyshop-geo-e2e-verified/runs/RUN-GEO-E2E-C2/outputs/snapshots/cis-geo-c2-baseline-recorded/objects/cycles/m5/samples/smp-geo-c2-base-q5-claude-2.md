---
id: SMP-GEO-C2-BASE-Q5-CLAUDE-2
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
    path: runs/RUN-GEO-C2-BASE-Q5-CLAUDE/outputs/extraction-2.json
    sha256: c9f70a8d8b5bd626ba44c4f33c2d72c7b9f0ac6ef493c70b811cfc0d73a1a347
    model_call: MODEL-ad9ebc2e-6afd-45fd-a44a-a27025123e84
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
slot_key: 89c373833c20d9322b4ac970d6858fe0b8aba6472e3e3351c201e82de6db4054
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
    sha256: 9e82d676ca6446d30bcc76119da9215a6e0dd421d0a38abff8f557f2eb4d6d67
    media_type: application/json
raw_manifest_sha256: 17787fe559907bad0df8bec721c5b17f6ad4c332090876ead395a53b42a87780
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
