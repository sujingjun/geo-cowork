---
id: SMP-GEO-C1-BASE-Q6-PERPLEXITY-1
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
    path: runs/RUN-GEO-C1-BASE-Q6-PERPLEXITY/outputs/extraction-1.json
    sha256: 07d78e6f9934391d6d681659f06fc630c20e1876ca1b88ceb31c0549f9c89777
    model_call: MODEL-25065562-c4dc-4606-977d-6bf5ed365bde
purpose: baseline
query_ref: Q-WHO-IS-ELIGIBLE-TO-USE-EN-1531
query_version: 1.0.0
query_set_ref: QS-GEO-E2E-C1
query_set_version: 1.0.0
intent: brand_definition
platform: perplexity
collector_profile_ref: CPF-GEO-E2E-C1-BASE-PERPLEXITY
collector_profile_version: 1.0.0
run_ref: RUN-GEO-C1-BASE-Q6-PERPLEXITY
slot_key: 570d9b1216472303d32b25aefa54f47597e8ec1d9fa58f6097d364e3d26469f7
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: b7baef05e6bd13f61f0419b8886129fcb819edfd368adb19cc04240e178cf1d5
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: 082acff9fccceef878bc546fa27afc779bb2612b8aa5adeb8a9c5c8728430eb9
    media_type: application/json
raw_manifest_sha256: 4bdd52baba19bebeb71f63b47a9c38791a427276dba200075444d66c067b7239
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
