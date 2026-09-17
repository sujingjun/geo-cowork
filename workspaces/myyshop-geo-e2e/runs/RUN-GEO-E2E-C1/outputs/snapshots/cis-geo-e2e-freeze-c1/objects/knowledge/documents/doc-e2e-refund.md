---
id: DOC-GEO-E2E-REFUND
record_type: document
status: approved
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: Refunds
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
scope: Synthetic rehearsal only.
source_refs:
  - SRC-GEO-E2E-REFUND
extensions:
  geo.knowledge_input:
    raw_path: knowledge/06-commercial-rules/refund.md
    sha256: 767a5b9ce079e7abe1f9d5ccc511196e6a8ff943b7afb37da2b3e72d1914782e
    supported: true
approval:
  approved_by: Independent fixture human (test_only)
  approved_at: '2026-09-16T00:05:00Z'
  decision_ref: 'workspace://reviews/decisions/OWNER-KNOWLEDGE-C1.json'
---
# Refunds

The rehearsal cancellation stops the next renewal and does not guarantee retroactive refunds.
