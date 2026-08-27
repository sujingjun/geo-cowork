---
id: TMT-EXAMPLE-001
record_type: test_merchant
status: draft
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: TMT-EXAMPLE-001
  workspace_id: ws_example0000000000000000000
workspace_id: ws_example0000000000000000000
workspace_namespace: example-test-merchant
display_name: Example Synthetic Test Merchant
identity:
  legal_entity_kind: fictitious
  canonical_locator: https://example-test-merchant.invalid/
  real_brand_identity_claimed: false
provenance:
  kind: synthetic
  usage: test_only
  decision_ref: fixture://approval/example-test-merchant
real_workspace_forbidden:
  - workspaces/myyshop
---
# Test Merchant 模板
