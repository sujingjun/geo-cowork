---
id: EVD-GEO-SITE-C1-AFTER-OWN-CRAWLABILITY
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
record_type: evidence
status: candidate
version: 1.0.0
created_at: '2026-09-19T00:00:00.000Z'
updated_at: '2026-09-19T00:00:00.000Z'
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
captured_at: '2026-09-19T00:00:00.000Z'
snapshot:
  path: assets/snapshots/C1/AFTER/own/html.txt
  sha256: 9706abeb6fe57bac3842cef8e1eee4d7bf6c57641cc598c80ec6f8421f362f8b
  media_type: text/html
collector:
  name: rehearsal-http-readback
  version: 1.0.0
scope: HTTP、robots、noindex 与 canonical 条件通过
collection_state: captured
proof_scope: metadata_only
detector_code: CRAWLABILITY
---
# CRAWLABILITY Evidence

HTTP、robots、noindex 与 canonical 条件通过
