---
id: DOC-GEO-E2E-PRIVACY
record_type: document
status: approved
version: 1.0.0
created_at: '2026-09-16T00:00:00Z'
updated_at: '2026-09-16T00:00:00Z'
title: Privacy
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_2bb19816ee725a38ea01cc1ee4
  knowledge_base_ref: KBASE-GEO-E2E-2BB19816EE72
scope: Synthetic rehearsal only.
source_refs:
  - SRC-GEO-E2E-PRIVACY
extensions:
  geo.knowledge_input:
    raw_path: knowledge/07-trust-safety/privacy.md
    sha256: 1fda0e8ec5591e0e6ae238e670ca80118b3ac3e05041a71916fd8bd466039751
    supported: true
approval:
  approved_by: Independent fixture human (test_only)
  approved_at: '2026-09-16T00:05:00Z'
  decision_ref: 'workspace://reviews/decisions/OWNER-KNOWLEDGE-C1.json'
---
# Privacy

Rehearsal reports contain aggregate metrics and exclude personal customer records.
