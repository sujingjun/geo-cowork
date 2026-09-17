---
id: SMP-GEO-C2-BASE-Q6-PERPLEXITY-1
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
    path: runs/RUN-GEO-C2-BASE-Q6-PERPLEXITY/outputs/extraction-1.json
    sha256: eb07fc97abb398736a8de13a5bcf21f6ab5b993a3eb8c5ddd6fc8e6fa28e7cc5
    model_call: MODEL-982da9a6-6976-4427-a5e0-968201b14e85
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
slot_key: af14d7bf0d14fa96639e037205454767052b2295d4f09b634ca35e378d46f0a6
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
    sha256: b670b18dc5263312628ee532dac3e42d99cc5aefa3e5d10e5b106915ecec5810
    media_type: application/json
raw_manifest_sha256: cd1106f54ed6aba70cf1bb67112f5b0210a52a2b5b24fcf6caf2debb9d4ab594
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
