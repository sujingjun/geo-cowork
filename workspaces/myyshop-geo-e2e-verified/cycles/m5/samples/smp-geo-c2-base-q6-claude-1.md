---
id: SMP-GEO-C2-BASE-Q6-CLAUDE-1
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
    path: runs/RUN-GEO-C2-BASE-Q6-CLAUDE/outputs/extraction-1.json
    sha256: 48b11286873b534e142611df2d086310a9e6e9f93357262d436521ff3142c056
    model_call: MODEL-b6e3907b-e4e0-414f-a715-5e1c5e561962
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-JOIN-EN-8E8A
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C2
query_set_version: 1.0.0
intent: brand_definition
platform: claude
collector_profile_ref: CPF-GEO-E2E-C2-BASE-CLAUDE
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C2-BASE-Q6-CLAUDE
slot_key: 527f635894f16b73865dff56ac902365c47a929ebfdf1c84ce6710fe71a4dab3
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-30T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: eb596ee94aef42aaaf603f819c0e653604f3acc65bcae78c6480f6a8ba8393a2
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: f195f87dbc5aba57d42f2587b38e1d40e45faddc3651905ccc30ae4b9c509a49
    media_type: application/json
raw_manifest_sha256: 21aa8ececeab3ec032c1af3687d20ac3e30d7446c72bd723659cc8eae46a391a
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
