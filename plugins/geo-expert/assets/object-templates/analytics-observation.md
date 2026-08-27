---
id: ANO-EXAMPLE-001
record_type: analytics_observation
status: recorded
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: TMT-EXAMPLE-001
  workspace_id: ws_example0000000000000000000
merchant_ref: TMT-EXAMPLE-001
cycle_ref: CYC-EXAMPLE-001
goal_ref: GOAL-EXAMPLE-001
run_ref: RUN-EXAMPLE-001
adapter:
  kind: fixture
  name: example-fixture
  version: 1.0.0
  access_mode: fixture
  authorization_ref: fixture://authorization/example-analytics
measurement_contract:
  version: 1.0.0
  artifact_path: execution/contracts/measurement-contract.json
  artifact_entry_key: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  sha256: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
sensitive_data_policy:
  id: example-sensitive-data-policy
  version: 1.0.0
  artifact_entry_key: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
  sha256: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
time_window:
  starts_at: 2026-01-01T00:00:00Z
  ends_at: 2026-01-08T00:00:00Z
  as_of: 2026-01-09T00:00:00Z
metrics:
  - metric_id: ai_visits
    definition: Synthetic AI visits.
    value: 0
    unit: visits
    dimensions:
      source_group: synthetic_ai
    state: observed
    limitation: null
artifacts:
  - path: raw/analytics/example.json
    sha256: cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    media_type: application/json
quality:
  completeness: complete
  warnings: []
causal_claim: false
---
# Analytics Observation 模板
