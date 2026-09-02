---
id: EVD-M6-TEST-001
record_type: evidence
status: approved
version: 1.0.0
created_at: '2026-08-27T00:00:00Z'
updated_at: '2026-08-27T00:00:00Z'
title: Synthetic evidence
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_myyshopdevtest000000000000
  knowledge_base_ref: KBASE-MYYSHOP-DEVTEST-001
source_refs:
  - SRC-M6-TEST-001
claim_refs:
  - CLM-M6-TEST-001
locator: 'https://dev-knowledge.invalid/source#fact'
captured_at: '2026-08-27T00:00:00Z'
snapshot:
  path: evidence/snapshots/source.txt
  sha256: b0c9b191d0e9de066b8967f96ef821df715fab28ed74cac47f35d4d452c56358
  media_type: text/plain
collector:
  name: m6-fixture
  version: 1.0.0
scope: Synthetic test only.
approval:
  approved_by: Fixture Human Reviewer
  approved_at: '2026-08-27T00:00:00Z'
  decision_ref: 'fixture://approval/m6-test-only-001'
---
# M6 synthetic fixture
