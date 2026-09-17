---
id: EVD-GEO-SITE-C1-BASE-OWN-CRAWLABILITY
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
record_type: evidence
status: candidate
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: CRAWLABILITY Evidence
source_refs:
  - SRC-GEO-SITE-C1-OWN
claim_refs:
  - CLM-GEO-E2E-ANSWER-DEFINITION
  - CLM-GEO-E2E-AUTOMATION
  - CLM-GEO-E2E-CAMPAIGNS
  - CLM-GEO-E2E-CASE
  - CLM-GEO-E2E-COMPARISON
  - CLM-GEO-E2E-ELIGIBILITY
  - CLM-GEO-E2E-FEES
  - CLM-GEO-E2E-GUARANTEES
  - CLM-GEO-E2E-IDENTITY
  - CLM-GEO-E2E-LEGACY
  - CLM-GEO-E2E-NON-GOALS
  - CLM-GEO-E2E-ONBOARDING
  - CLM-GEO-E2E-POSITIONING
  - CLM-GEO-E2E-PRIVACY
  - CLM-GEO-E2E-REFUND
  - CLM-GEO-E2E-VOICE
locator: 'https://brand.geo-e2e.invalid/about'
captured_at: '2026-09-16T00:00:00Z'
snapshot:
  path: assets/snapshots/C1/BASE/own/html.txt
  sha256: d82228b74970e278aa6453e96d135fd69f88ff360d1acc593fab0953f93978a1
  media_type: text/html
collector:
  name: rehearsal-http-readback
  version: 1.0.0
scope: 至少一个确定性 crawlability 条件失败
collection_state: captured
proof_scope: metadata_only
detector_code: CRAWLABILITY
---
# CRAWLABILITY Evidence

至少一个确定性 crawlability 条件失败
