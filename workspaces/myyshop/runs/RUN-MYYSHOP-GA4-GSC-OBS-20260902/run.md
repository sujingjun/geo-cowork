---
id: RUN-MYYSHOP-GA4-GSC-OBS-20260902
record_type: run
status: completed
version: 1.0.0
created_at: '2026-09-02T11:18:48.856Z'
updated_at: '2026-09-02T11:18:48.856Z'
title: MyyShop authorized read-only Analytics observation Run
skill: geo-analytics
skill_version: 1.1.0
input_refs:
  - MER-MYYSHOP-001
  - SRC-MYYSHOP-GA4-20260902
  - SRC-MYYSHOP-GSC-20260902
input_versions:
  MER-MYYSHOP-001: 1.0.0
  SRC-MYYSHOP-GA4-20260902: 1.0.0
  SRC-MYYSHOP-GSC-20260902: 1.0.0
input_fingerprint: 98c0109062c1e3c8e78c008bc5917b2e47c457d68e5ca22a049cbe6951893ee1
completed_steps:
  - authorized_read
  - observation_recorded
  - signal_computed
  - candidate_evidence_created
output_artifacts:
  - cycles/m6/analytics/ano-myyshop-ga4-20260902.md
  - cycles/m6/analytics/ano-myyshop-gsc-20260902.md
  - cycles/m6/analytics/bsig-myyshop-gsc-20260902.md
  - evidence/records/evd-myyshop-analytics-20260902.md
  - runs/RUN-MYYSHOP-GA4-GSC-OBS-20260902/raw/analytics/result.json
business_result: inconclusive
next_action: Human review of candidate Evidence; no causal conclusion.
evidence_refs:
  - EVD-MYYSHOP-ANALYTICS-20260902
finding_refs: []
asset_refs: []
failure_reason: null
merchant_ref: MER-MYYSHOP-001
execution_scope: authorized_real
transition_plan_sha256: 41dcaf47d8d53b8e4faf270c35ae424bffe0911e4737c4fc80c16c48dd81a3f0
lease:
  scope_key: 'MER-MYYSHOP-001:authorized-real-analytics'
  owner_id: geo-analytics-86835
  revision: 1
  acquired_at: '2026-09-02T11:18:48.856Z'
  heartbeat_at: '2026-09-02T11:18:48.856Z'
  expires_at: '2026-09-02T11:19:48.856Z'
---
# MyyShop authorized read-only Analytics observation Run
