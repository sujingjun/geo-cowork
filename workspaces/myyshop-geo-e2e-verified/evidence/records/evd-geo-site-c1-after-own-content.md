---
id: EVD-GEO-SITE-C1-AFTER-OWN-CONTENT
record_type: evidence
status: candidate
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: Observed asset content
test_scope:
  kind: synthetic
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
source_refs:
  - SRC-GEO-SITE-C1-OWN
locator: 'https://brand.geo-e2e.invalid/about'
captured_at: '2026-09-19T00:00:00.000Z'
snapshot:
  path: assets/snapshots/C1/AFTER/own/html.txt
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
