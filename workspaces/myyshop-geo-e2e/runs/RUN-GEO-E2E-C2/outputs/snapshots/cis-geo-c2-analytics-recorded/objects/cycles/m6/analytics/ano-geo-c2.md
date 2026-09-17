---
id: ANO-GEO-C2
record_type: analytics_observation
status: recorded
version: 1.0.0
created_at: '2026-10-09T00:00:00.000Z'
updated_at: '2026-10-09T00:00:00.000Z'
title: Synthetic Analytics Observation
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
execution_scope: synthetic_test
merchant_ref: MER-MYYSHOP-001
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
run_ref: RUN-GEO-ANALYTICS-C2
adapter:
  kind: fixture
  name: aggregate-business-input
  version: 1.0.0
  access_mode: fixture
  authorization_ref: 'fixture://independent-business-input'
measurement_contract:
  version: 1.0.0
  artifact_path: execution/contracts/measurement-contract.json
  artifact_entry_key: f8ffea436618e87358de7d89510410387967da75368202bea7294352edd7fb6b
  sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
sensitive_data_policy:
  id: geo-e2e-policy-v1
  version: 1.0.0
  artifact_entry_key: 27836a6a9f03399ccab98f4c516891c53890bc2535062f4000fad6a59fd79c76
  sha256: ac819db2c463201f8d00e1a9dd8d081df9d1df7c5202b91ebc3404b2724310ab
time_window:
  as_of: '2026-10-09T00:00:00.000Z'
  ends_at: '2026-10-09T00:00:00.000Z'
  starts_at: '2026-10-02T00:00:00.000Z'
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
    sha256: 5943f89ab67381f827751ab4ab292d1a5891a2524a2137c4b64cbec17bc573e7
    media_type: application/json
quality:
  completeness: complete
  warnings: []
causal_claim: false
---
# Synthetic Analytics Observation
