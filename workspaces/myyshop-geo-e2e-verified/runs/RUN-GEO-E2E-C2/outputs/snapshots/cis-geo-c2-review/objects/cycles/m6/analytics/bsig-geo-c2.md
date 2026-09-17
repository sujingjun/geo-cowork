---
id: BSIG-GEO-C2
record_type: business_signal
status: computed
version: 1.0.0
created_at: '2026-10-09T00:00:00.000Z'
updated_at: '2026-10-09T00:00:00.000Z'
title: Synthetic Business Signal
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
execution_scope: synthetic_test
merchant_ref: MER-MYYSHOP-001
cycle_ref: CYC-GEO-E2E-C2
goal_ref: GOAL-GEO-E2E-C2
run_ref: RUN-GEO-ANALYTICS-C2
observation_versions:
  - ref: ANO-GEO-C2
    version: 1.0.0
measurement_contract:
  version: 1.0.0
  artifact_path: execution/contracts/measurement-contract.json
  artifact_entry_key: f8ffea436618e87358de7d89510410387967da75368202bea7294352edd7fb6b
  sha256: 38c1980f471f579564f81aff27132a5682cb647f38f19c0021698e39b4b41967
rule:
  id: geo-e2e-signal-v1
  version: 1.0.0
  artifact_path: execution/contracts/signal-rule.json
  artifact_entry_key: c701b43cd4431e96d8f1eed1b9f106527d5da349f138c1de913d4ccc3df62cd6
  sha256: b3b82536873a227ca6bdb3764f1f8711df6b50fd000fe78308e36173d56e19a0
signal_kind: ai_registration
denominator:
  definition: ai_visits
  value: 120
  state: known
calculation:
  value: 0
  unit: registrations_per_visit
  state: no_signal
  explanation: 0 / 120.
causal_claim: false
---
# Synthetic Business Signal
