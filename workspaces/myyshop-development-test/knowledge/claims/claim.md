---
id: CLM-M6-TEST-001
record_type: claim
status: published
version: 1.0.0
created_at: '2026-08-27T00:00:00Z'
updated_at: '2026-08-27T00:00:00Z'
title: Synthetic claim
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_myyshopdevtest000000000000
  knowledge_base_ref: KBASE-MYYSHOP-DEVTEST-001
statement: The development test knowledge base contains a documented fixture capability.
risk_type: capability_fact
risk_level: low
evidence_refs:
  - EVD-M6-TEST-001
document_refs:
  - DOC-M6-TEST-001
scope: Synthetic test only.
evidence_sufficiency:
  status: sufficient
  rule_version: m3-evidence-sufficiency-v1
  missing: []
release_refs:
  - KR-M6-TEST-001
approval:
  approved_by: Fixture Human Reviewer
  approved_at: '2026-08-27T00:00:00Z'
  decision_ref: 'fixture://approval/m6-test-only-001'
---
# M6 synthetic fixture
