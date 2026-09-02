---
id: AST-M6-TEST-001
record_type: asset
status: active
version: 1.0.0
created_at: '2026-08-27T00:00:00Z'
updated_at: '2026-08-27T00:00:00Z'
title: Synthetic About asset
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: MER-MYYSHOP-001
  workspace_id: ws_myyshopdevtest000000000000
  knowledge_base_ref: KBASE-MYYSHOP-DEVTEST-001
asset_kind: own
locator: 'https://dev-knowledge.invalid/about'
source_refs:
  - SRC-M6-TEST-001
asset_role: about
control_scope: own
goal_refs:
  - GOAL-M6-TEST-001
query_refs:
  - Q-M6-TEST-001
claim_versions:
  - ref: CLM-M6-TEST-001
    version: 1.0.0
knowledge_release_versions:
  - ref: KR-M6-TEST-001
    version: 1.0.0
---
# M6 synthetic fixture
