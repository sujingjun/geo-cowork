---
id: CRV-EXAMPLE-001
record_type: cycle_review
status: waiting_human
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: TMT-EXAMPLE-001
  workspace_id: ws_example0000000000000000000
merchant_ref: TMT-EXAMPLE-001
cycle_ref: CYC-EXAMPLE-001
reviewed_cycle_input_version: 1.0.9
review_input_snapshot_version:
  ref: CIS-EXAMPLE-REVIEW-001
  version: 1.0.0
review_input_fingerprint: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
goal_results:
  - goal_entry_key: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    perception_goal: inconclusive
    observations:
      - Synthetic observation only.
    business_signal_entry_keys:
      - bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    limitations:
      - No real Analytics or Publication.
    forbidden_conclusions:
      - Do not claim causal or real MyyShop impact.
next_cycle_candidate_inputs: []
---
# Cycle Review 模板
