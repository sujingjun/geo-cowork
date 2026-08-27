---
title: M6 测试商户 Cycle 1 人工内测手册
status: approved
created: 2026-08-28
updated: 2026-08-28
source:
  - docs/records/2026-08-28-m6-test-merchant-cycle1-engineering-record.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - 2026-08-28 Owner 指令：先人工接手内测 Cycle 1，确认产品质量和方向后再继续 Strategy/Cycle 2
  - 2026-08-28 Owner 最新指令：本阶段最终目标为 M7 / Circle 1 可跑通，后续 M8 Strategy/Cycle 2 等待内测确认
scope: synthetic/test_only M6 Cycle 1 的人工产品体验、对象链、边界和继续/调整决定；不访问真实系统
---

# M6 测试商户 Cycle 1 人工内测手册

## 1. 当前暂停点

M6 synthetic/test-only Cycle 1 已通过工程 QA。本阶段以 Owner 最新口径完成 M7 / Circle 1 人工接管；Strategy Discovery、GSEL、Cycle 2 与 M8 暂停，等待 Owner 完成本手册并明确“继续 / 调整 / 停止”。范围调整前的后续实现现场不构成当前验收事实。

本次内测不需要任何真实账号，不连接 GA4、GSC、CRM、CMS 或消费者平台，也不建立真实 MyyShop 商户。不要把密码、Cookie、Token、`.env` 或个人数据放进 Review Workspace、聊天、截图或反馈。

## 2. 生成独立 Review Workspace

在当前 checkout 根运行；目标路径必须不存在：

```bash
node tests/manual/m6-internal-review.mjs \
  --workspace workspaces/m6-owner-internal-review
```

预期输出：`ok:true`、`status:completed`、`aggregate_stage:review_decided`、`completion_scope:full`、`synthetic:true`、`real_myyshop_impact:false`、`network_accessed:false`。

再次使用同一路径会失败并拒绝覆盖。脚本禁止写入 `workspaces/myyshop`，先在 staging 中完成对象校验与 trace，再原子落位。

## 3. 先做机器复验

```bash
node plugins/geo-expert/scripts/workspace-validate.mjs \
  --workspace workspaces/m6-owner-internal-review --objects

node plugins/geo-expert/scripts/geo-lifecycle.mjs trace \
  --workspace workspaces/m6-owner-internal-review \
  --cycle CYC-M6-TEST-001
```

第一条应为 `ok:true`；第二条应为 `lifecycle_ready:true` 且没有 errors。

## 4. 人工查看对象链

按顺序检查，不要只看最终 trace：

1. `workspace.json`：确认 `workspace_mode:test_only`、独立 `workspace_id/namespace`、`.invalid` locator、`legal_entity:false`。
2. `cycles/m6/cycle.md`：确认单 Goal、九阶段、`completion_scope:full`，没有真实 MyyShop ref。
3. `cycles/m6/snapshots/` 与 `runs/`：确认 freeze/transition/review CIS 保存完整 bytes/checksum，不依赖聊天历史。
4. Baseline：两份 Sample、两份 Review、一个 Aggregation；确认两个独立 ordinal。
5. Diagnosis：Content Gap、完整 Proposal 与风险说明。
6. Adoption：synthetic 人工决定与 Proposal 分离。
7. Publication：`.invalid` confirmed 证明只表示 fixture，不是外部发布。
8. Technical Retest：Run/Finding 与 Publication 分离。
9. Answer Retest：两槽 Sample/Review/Aggregation，不用 Baseline 冒充。
10. Analytics：ANO、BSIG、Measurement/Rule/Policy pin；确认 `causal_claim:false`。
11. Cycle Review：waiting 与 decided 使用不同 CRV ID；结论、限制和禁止推论清楚。

## 5. 产品方向 Review

逐项记录 `通过 / 需调整 / 不接受`：

- 用户是否能看懂当前处于哪个阶段、为什么不能继续；
- Workspace 文件是否足以在没有原聊天时恢复；
- Query、Claim、Evidence、Gap、Proposal、Adoption、Publication、两个 Retest、Analytics、Review 是否职责清楚；
- synthetic/test_only 与真实 MyyShop 的差异是否足够醒目；
- 人工门数量是否过多或过少；
- 错误信息是否能指导下一步，而非只给技术 code；
- `no_signal/negative/inconclusive` 是否仍能形成诚实 Review；
- 如果这是实际产品，你是否愿意用它进入真实 MyyShop 内测；
- Strategy Discovery 是否应该继续作为独立可选分支；
- Cycle 2 候选和选择应保留、简化还是调整。

建议反馈格式：

```text
对象/步骤：<路径或 ID>
判断：通过 | 需调整 | 不接受
看到的内容：<脱敏摘要>
期望行为：<具体说明>
严重度：P0 | P1 | P2
是否允许继续 M7/Cycle 2：是 | 否 | 有条件
```

## 6. 继续门

在 Owner 明确确认前：

- 不继续 M7 Strategy Discovery 实现；
- 不创建或决定 GSEL；
- 不运行 synthetic Cycle 2；
- 不进入 M8 conformance；
- 不建立真实 MyyShop 商户或连接真实系统。

Owner 后续应明确回复之一：

1. `Cycle 1 人工内测通过，允许重新定基线并启动后续 M8 Strategy Discovery 与 Cycle 2。`
2. `Cycle 1 有条件通过，先修复以下问题：...`
3. `Cycle 1 方向不通过，停止后续里程碑并回到 PRD/Spec。`
