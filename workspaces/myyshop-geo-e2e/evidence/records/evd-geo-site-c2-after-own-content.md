---
id: EVD-GEO-SITE-C2-AFTER-OWN-CONTENT
record_type: evidence
status: candidate
version: 1.0.0
created_at: '2026-09-30T00:00:00.000Z'
updated_at: '2026-09-30T00:00:00.000Z'
title: Observed asset content
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
source_refs:
  - SRC-GEO-SITE-C2-OWN
locator: 'https://brand.geo-e2e.invalid/about'
captured_at: '2026-10-03T00:00:00.000Z'
snapshot:
  path: assets/snapshots/C2/AFTER/own/html.txt
  sha256: 9706abeb6fe57bac3842cef8e1eee4d7bf6c57641cc598c80ec6f8421f362f8b
  media_type: text/html
collector:
  name: rehearsal-http-readback
  version: 1.0.0
scope: Observed test page content; does not establish that its claims are true.
collection_state: captured
access_state: accessible
original_content_state: captured
support_kind: first_party
proof_scope: target_content
confidence: high
confidence_reason: Exact bytes from the isolated HTTP read-back.
---
# Observed asset content
