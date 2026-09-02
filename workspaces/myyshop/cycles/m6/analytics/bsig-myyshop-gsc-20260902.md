---
id: BSIG-MYYSHOP-GSC-20260902
record_type: business_signal
status: computed
version: 1.0.0
created_at: '2026-09-02T11:18:48.856Z'
updated_at: '2026-09-02T11:18:48.856Z'
title: MyyShop observed GSC search visibility signal
merchant_ref: MER-MYYSHOP-001
run_ref: RUN-MYYSHOP-GA4-GSC-OBS-20260902
execution_scope: authorized_real
observation_versions:
  - ref: ANO-MYYSHOP-GSC-20260902
    version: 1.0.0
measurement_contract:
  version: 1.0.0
  artifact_path: execution/contracts/myyshop-analytics-measurement-v1.json
  artifact_entry_key: 45835f470829a3ff5b4abbc3d64fd497063b57bca2626016239024591b3ebb98
  sha256: d80e59eb0c23394f2db6a0b27ea4e2e4c0723490c6af0ecdba1205aadfab3fd4
rule:
  id: myyshop-search-visibility-signal-v1
  version: 1.0.0
  artifact_path: execution/contracts/myyshop-search-visibility-signal-v1.json
  artifact_entry_key: 9c4ebbe74856ccf2545e7fb9665d4acaf4010932652a3801d1bf2b7b633fe435
  sha256: c0a95f5334fcc57e508c006bd6a65954b212c2463b4df74812ad2ce3896ec9e7
signal_kind: search_visibility
denominator:
  definition: GSC impressions in the authorized window.
  value: 7642
  state: known
calculation:
  value: 0.385239466108
  unit: clicks_per_impression
  state: signal_observed
  explanation: Observed GSC clicks divided by impressions; no GEO or content causality is asserted.
causal_claim: false
---
# MyyShop observed GSC search visibility signal
