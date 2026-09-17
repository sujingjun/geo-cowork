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
  knowledge_base_ref: KBASE-GEO-E2E-377EC2E00B68
  merchant_ref: MER-MYYSHOP-001
  usage: test_only
  workspace_id: ws_377ec2e00b68d35bf465ab5d6e
source_refs:
  - SRC-GEO-SITE-C2-OWN
locator: 'https://brand.geo-e2e.invalid/faq'
captured_at: '2026-10-03T00:00:00.000Z'
snapshot:
  path: assets/snapshots/C2/AFTER/own/html.txt
  sha256: 8ced087cfe6244a1ce1293c9383920112204d2a96f108384a6a1f5ddc59b7ec1
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
