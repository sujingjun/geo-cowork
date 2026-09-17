---
id: EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CRAWLABILITY
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
  - SRC-GEO-SITE-C1-THIRD-PARTY
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
locator: 'https://media.geo-e2e.invalid/review'
captured_at: '2026-09-16T00:00:00Z'
snapshot:
  path: assets/snapshots/C1/BASE/third-party/html.txt
  sha256: 974db9ce52d8fa2447b8be120c5b5663f4342656faeb6666d1cd349430ee8bf8
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
