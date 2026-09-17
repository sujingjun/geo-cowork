---
id: EVD-GEO-SITE-C1-BASE-THIRD-PARTY-CONTENT
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
  - SRC-GEO-SITE-C1-THIRD-PARTY
locator: 'https://media.geo-e2e.invalid/review'
captured_at: '2026-09-16T00:00:00Z'
snapshot:
  path: assets/snapshots/C1/BASE/third-party/html.txt
  sha256: 974db9ce52d8fa2447b8be120c5b5663f4342656faeb6666d1cd349430ee8bf8
  media_type: text/html
collector:
  name: rehearsal-http-readback
  version: 1.0.0
scope: Observed test page content; does not establish that its claims are true.
collection_state: captured
access_state: accessible
original_content_state: captured
support_kind: independent
proof_scope: target_content
confidence: high
confidence_reason: Exact bytes from the isolated HTTP read-back.
---
# Observed asset content
