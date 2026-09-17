---
id: EVD-GEO-SITE-C2-BASE-OWN-CRAWLABILITY
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
record_type: evidence
status: candidate
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: CRAWLABILITY Evidence
source_refs:
  - SRC-GEO-SITE-C2-OWN
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
locator: 'https://brand.geo-e2e.invalid/faq'
captured_at: '2026-09-30T00:00:00.000Z'
snapshot:
  path: assets/snapshots/C2/BASE/own/html.txt
  sha256: 5f6afa5ab36bf065aee9e7383dae62dd7af0052253bd47c3997f779f6458577d
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
