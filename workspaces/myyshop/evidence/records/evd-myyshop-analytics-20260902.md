---
id: EVD-MYYSHOP-ANALYTICS-20260902
record_type: evidence
status: candidate
version: 1.0.0
created_at: '2026-09-02T11:18:48.856Z'
updated_at: '2026-09-02T11:18:48.856Z'
title: MyyShop authorized Analytics Evidence candidate
merchant_ref: MER-MYYSHOP-001
execution_scope: authorized_real
source_refs:
  - SRC-MYYSHOP-GA4-20260902
  - SRC-MYYSHOP-GSC-20260902
locator: 'workspace://runs/RUN-MYYSHOP-GA4-GSC-OBS-20260902/raw/analytics/result.json'
captured_at: '2026-09-02T11:18:48.856Z'
snapshot:
  path: runs/RUN-MYYSHOP-GA4-GSC-OBS-20260902/raw/analytics/result.json
  sha256: 41dcaf47d8d53b8e4faf270c35ae424bffe0911e4737c4fc80c16c48dd81a3f0
  media_type: application/json
collector:
  name: geo-analytics-readonly
  version: 1.1.0
scope: Authorized aggregate GA4/GSC observation only; no GEO or content causality.
observation_versions:
  - ref: ANO-MYYSHOP-GA4-20260902
    version: 1.0.0
  - ref: ANO-MYYSHOP-GSC-20260902
    version: 1.0.0
---
# MyyShop authorized Analytics Evidence candidate
