---
id: GCB-09BDF23520694DFFE51C596E
record_type: cycle_goal_candidate_batch
status: recorded
version: 1.0.0
created_at: 2026-01-01T00:00:00Z
updated_at: 2026-01-01T00:00:00Z
title: 合成第二周期目标候选批次
test_scope:
  kind: synthetic
  usage: test_only
  merchant_ref: TMT-M6-TEST-001
  workspace_id: ws_m6testmerchant000000000000
merchant_ref: TMT-M6-TEST-001
source_cycle_review_version:
  ref: CRV-M7-CYCLE-ONE-DECIDED-001
  version: 1.0.0
  file_sha256: ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
review_input_snapshot_version:
  ref: CIS-M7-REVIEW-001
  version: 1.0.0
  fingerprint: eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
generator_rule:
  id: m7-cycle-goal-candidate-test-v1
  version: 1.0.0
  artifact_path: outputs/contracts/m7-candidate-generator-rule.json
  sha256: "6666666666666666666666666666666666666666666666666666666666666666"
batch_key: 09bdf23520694dffe51c596e30adbae9e700b6e1af171cc1d8c686973be3d2d7
ordered_candidates:
  - candidate_content_key: eb8be862c9e25675551edc23dc163672592140904367bce480af262761b8bdbb
    rank_inputs:
      priority: 0
      kind_order: 6
      tie_break_key: eb8be862c9e25675551edc23dc163672592140904367bce480af262761b8bdbb
    rank: 1
    candidate_instance_key: 04d13e449a31c19f972207aae46e490c870c924d27fd9ea7b54266cc0b77a964
    candidate_version:
      ref: GCD-04D13E449A31C19F972207AA
      version: 1.0.0
run_ref: RUN-M7-CANDIDATES-001
---
# 合成第二周期目标候选批次模板

批次及候选均为 create-only 测试对象。
