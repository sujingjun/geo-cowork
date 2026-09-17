---
id: SMP-GEO-C2-BASE-Q4-PERPLEXITY-2
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
    path: runs/RUN-GEO-C2-BASE-Q4-PERPLEXITY/outputs/extraction-2.json
    sha256: 08363e69c53033839aabde96928ed0427802d3d3eae5440774bf5374e2ea6907
    model_call: MODEL-584b77eb-af43-4b27-85a0-be9b76544cde
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
slot_key: 5fb6dc26010b519cd6cde6885fbfc76b383ea25eebe89222cee56f13d256f980
ordinal: 2
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:02.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-2.txt
    sha256: 2682145b971b031a33695d65ed7720577d9c0c124f25c43e97be40f26fcb8c26
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-2.json
    sha256: 17f39ce03a70c1b2b7791aeca93da6e035b289bb4e3c3bb80f2906a6702802d9
    media_type: application/json
raw_manifest_sha256: e92818c01b276b09feabcbfe3c80525f8ab0363e9e1aa54c83d25b225cf01fb8
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 2
