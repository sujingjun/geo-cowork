---
id: ANO-MYYSHOP-GA4-20260902
record_type: analytics_observation
status: recorded
version: 1.0.0
created_at: '2026-09-02T11:18:48.856Z'
updated_at: '2026-09-02T11:18:48.856Z'
title: MyyShop GA4 authorized read-only observation
merchant_ref: MER-MYYSHOP-001
run_ref: RUN-MYYSHOP-GA4-GSC-OBS-20260902
execution_scope: authorized_real
adapter:
  kind: ga4
  name: ga4-readonly
  version: 1.0.0
  access_mode: read_only
  authorization_ref: 'workspace://cycles/preparation/decisions/2026-09-02-ga4-gsc-observation-authorized.md'
measurement_contract:
  version: 1.0.0
  artifact_path: execution/contracts/myyshop-analytics-measurement-v1.json
  artifact_entry_key: 45835f470829a3ff5b4abbc3d64fd497063b57bca2626016239024591b3ebb98
  sha256: d80e59eb0c23394f2db6a0b27ea4e2e4c0723490c6af0ecdba1205aadfab3fd4
sensitive_data_policy:
  id: myyshop-analytics-sensitive-policy-v1
  version: 1.0.0
  artifact_entry_key: f1701e7b992de933d509d3ac5eda4f2efc19a0a6ec71d335df0deb641eddd234
  sha256: b89e4e414a9724ace494ce5bc7471eb8e10daa13231a5ca4ab4369130eb14e0b
time_window:
  starts_at: '2026-08-23T00:00:00Z'
  ends_at: '2026-08-29T23:59:59Z'
  as_of: '2026-09-02T11:18:48.856Z'
metrics:
  - metric_id: ga4_sessions
    definition: GA4 sessions in the authorized window.
    value: 59619
    unit: sessions
    dimensions:
      source: ga4
    state: observed
    limitation: null
    causal_claim: false
  - metric_id: ga4_active_users
    definition: GA4 active users in the authorized window.
    value: 46180
    unit: users
    dimensions:
      source: ga4
    state: observed
    limitation: null
    causal_claim: false
  - metric_id: ga4_screen_page_views
    definition: GA4 screen/page views in the authorized window.
    value: 262649
    unit: views
    dimensions:
      source: ga4
    state: observed
    limitation: null
    causal_claim: false
artifacts:
  - path: runs/RUN-MYYSHOP-GA4-GSC-OBS-20260902/raw/analytics/result.json
    sha256: 41dcaf47d8d53b8e4faf270c35ae424bffe0911e4737c4fc80c16c48dd81a3f0
    media_type: application/json
quality:
  completeness: complete
  warnings: []
causal_claim: false
---
# MyyShop GA4 authorized read-only observation
