---
id: STA-M7-WAITING-001
record_type: strategy_assessment
status: waiting_human
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
title: 合成战略资格评估
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: TMT-M6-TEST-001
  workspace_id: ws_m6testmerchant000000000000
merchant_ref: TMT-M6-TEST-001
cycle_review_ref: CRV-M7-CYCLE-ONE-DECIDED-001
cycle_review_version: 1.0.0
strategy_input_snapshot_version:
  ref: CIS-M7-STRATEGY-001
  version: 1.0.0
human_invocation:
  decision_ref: fixture://decision/m7-strategy-invocation-001
  invoked_by: Fixture Strategy Reviewer
  invoked_at: 2026-01-01T00:00:00Z
  requested_scope: synthetic-pricing-clarity
eligibility_inputs:
  review_entry_keys:
    - "6666666666666666666666666666666666666666666666666666666666666666"
    - "7777777777777777777777777777777777777777777777777777777777777777"
  evidence_entry_keys:
    - "8888888888888888888888888888888888888888888888888888888888888888"
    - "9999999999999999999999999999999999999999999999999999999999999999"
  finding_entry_keys:
    - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    - bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    - cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
  product_gap_entry_key: cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
  product_gap_identity:
    object_id: FND-M7-PRODUCT-GAP-001
    record_type: finding
    object_version: 1.0.0
    file_sha256: cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
eligibility_checks:
  repeated_dimension:
    state: pass
    dimension_key: pricing-clarity
    query_entry_keys:
      - "2222222222222222222222222222222222222222222222222222222222222222"
      - "3333333333333333333333333333333333333333333333333333333333333333"
    review_entry_keys:
      - "6666666666666666666666666666666666666666666666666666666666666666"
      - "7777777777777777777777777777777777777777777777777777777777777777"
  user_interest_evidence:
    state: pass
    evidence_entry_keys:
      - "8888888888888888888888888888888888888888888888888888888888888888"
  comparison_impact:
    state: pass
    evidence_entry_keys:
      - "8888888888888888888888888888888888888888888888888888888888888888"
    review_entry_keys:
      - "6666666666666666666666666666666666666666666666666666666666666666"
      - "7777777777777777777777777777777777777777777777777777777777777777"
  content_evidence_fix_insufficient:
    state: pass
    finding_entry_keys:
      - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      - bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
      - cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
eligibility_result: eligible
eligibility_rule:
  id: m7-strategy-eligibility-test-v1
  version: 1.0.0
  artifact_path: outputs/contracts/m7-eligibility-rule.json
  artifact_entry_key: dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
  sha256: dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
decision: pending
---
# 合成战略资格评估模板

仅用于测试商户离线工程，等待独立人工决定是否继续。
