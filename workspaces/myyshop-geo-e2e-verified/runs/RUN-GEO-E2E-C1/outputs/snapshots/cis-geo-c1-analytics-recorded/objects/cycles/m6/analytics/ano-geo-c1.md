---
id: ANO-GEO-C1
record_type: analytics_observation
status: recorded
version: 1.0.0
created_at: '2026-09-25T00:00:00.000Z'
updated_at: '2026-09-25T00:00:00.000Z'
title: Synthetic Analytics Observation
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
execution_scope: synthetic_test
merchant_ref: MER-MYYSHOP-001
cycle_ref: CYC-GEO-E2E-C1
goal_ref: GOAL-GEO-E2E-C1
run_ref: RUN-GEO-ANALYTICS-C1
adapter:
  kind: fixture
  name: aggregate-business-input
  version: 1.0.0
  access_mode: fixture
  authorization_ref: 'fixture://independent-business-input'
measurement_contract:
  version: 1.0.0
  artifact_path: execution/contracts/measurement-contract.json
  artifact_entry_key: 6c7bc9c1c9b1c6e12841185c235d69724891321d63ccce74f751c3e0b98d7806
  sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
sensitive_data_policy:
  id: geo-e2e-policy-v1
  version: 1.0.0
  artifact_entry_key: 862603b3cd2836eaffccb93d146a69e0d9df61326e223e4241c5e1ed05f2faa9
  sha256: ac819db2c463201f8d00e1a9dd8d081df9d1df7c5202b91ebc3404b2724310ab
time_window:
  as_of: '2026-09-25T00:00:00.000Z'
  ends_at: '2026-09-25T00:00:00.000Z'
  starts_at: '2026-09-18T00:00:00.000Z'
metrics:
  - metric_id: ai_visits
    definition: Synthetic aggregate visits; not real attribution.
    value: 120
    unit: visits
    dimensions:
      source: synthetic
    state: observed
    limitation: null
  - metric_id: ai_registrations
    definition: Synthetic aggregate completed registrations.
    value: 0
    unit: registrations
    dimensions:
      source: synthetic
    state: observed
    limitation: null
artifacts:
  - path: raw/analytics.json
    sha256: 333558ab2bac6d8825ebe98bff3d531b317b2d70bd61b7e06f1bb9a4b86d0434
    media_type: application/json
quality:
  completeness: complete
  warnings: []
causal_claim: false
---
# Synthetic Analytics Observation
