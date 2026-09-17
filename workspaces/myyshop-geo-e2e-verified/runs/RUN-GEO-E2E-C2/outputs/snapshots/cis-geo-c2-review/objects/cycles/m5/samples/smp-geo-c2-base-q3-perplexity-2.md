---
id: SMP-GEO-C2-BASE-Q3-PERPLEXITY-2
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
    path: runs/RUN-GEO-C2-BASE-Q3-PERPLEXITY/outputs/extraction-2.json
    sha256: b723918a3f364627f1677138f87ca62bcd72bddbd313140048378a30482da22b
    model_call: MODEL-f50a30ae-f946-4085-b673-d430bb506153
purpose: baseline
query_ref: Q-WHAT-CAPABILITIES-DOES-THE-MYYSHOP-EN-747A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: capability
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C2-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q3-PERPLEXITY
slot_key: b57756af6b23470cc4ede8d48ce097b32e364186445938c2df1d4641f1e72867
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: e948afd172349b108329aa51da6b317a0a04809c95d7364ab41c808c087a507f
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 358446763010da5f900f69bb2a023fa55204dbf9e1d1e4ccb66f8c879ee664f4
    media_type: application/json
raw_manifest_sha256: 538d5c655c9cb86247fe371b4523695f12b69d0f98edc2dffc67bd82558aaf26
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
