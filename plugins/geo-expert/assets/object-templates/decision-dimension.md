---
id: DDM-M7-CANDIDATE-001
record_type: decision_dimension
status: candidate
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
title: 合成价格清晰度候选维度
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: TMT-M6-TEST-001
  workspace_id: ws_m6testmerchant000000000000
merchant_ref: TMT-M6-TEST-001
strategy_assessment_version:
  ref: STA-M7-DECIDED-001
  version: 1.0.0
strategy_input_snapshot_version:
  ref: CIS-M7-STRATEGY-001
  version: 1.0.0
label: 合成价格清晰度
definition: 测试消费者能否判断适用的合成价格区间。
query_entry_keys:
  - "2222222222222222222222222222222222222222222222222222222222222222"
  - "3333333333333333333333333333333333333333333333333333333333333333"
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
basis:
  platforms:
    - fixture-chat
    - fixture-assistant
  query_clusters:
    - synthetic-pricing
  supporting_observations:
    - 两份已复核合成答案呈现价格清晰度差异。
  counter_observations:
    - 不存在真实市场观察。
  unresolved_conflicts: []
---
# 候选决策维度模板

本对象尚未获得人工验证，不是已成立的决策因素。
