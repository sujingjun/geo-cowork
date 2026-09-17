---
id: SMP-GEO-C1-BASE-Q1-GEMINI-1
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
    path: runs/RUN-GEO-C1-BASE-Q1-GEMINI/outputs/extraction-1.json
    sha256: 44556102246a29807436666c4d924e2fc971ec4110851b6dbfb19dc01a84c392
    model_call: MODEL-37716102-f4fa-40b7-a640-2db52cff0771
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
slot_key: 035bcb2245cbbc9b443fce26dbabdbdb57515b0fd32c83598c044adda27283e9
ordinal: 1
attempt_no: 1
outcome: success
captured_at: '2026-09-16T00:00:01.000Z'
collection_method: recorded_fixture
artifacts:
  - role: answer_text
    availability: captured
    path: raw/answer-1.txt
    sha256: 7f4595b8b7da535caf17ee39d3ea096bdeaeebd062f92101a30f238529002827
    media_type: text/plain
  - role: collector_log
    availability: captured
    path: raw/collector-1.json
    sha256: d40b8f35bd2e86cc2b915a304c69f1b8be369ddca74cab41a86bb5af62982de1
    media_type: application/json
raw_manifest_sha256: c2778c184e47d66c18f66ef0e42a7344245bd459e5a9c48305cbf619681e166b
privacy:
  account_identifier_stored: false
  credentials_stored: false
  answer_region_only: true
  redaction_notes:
    - Synthetic .invalid recorded fixture; no account data.
---
# Recorded Sample 1
