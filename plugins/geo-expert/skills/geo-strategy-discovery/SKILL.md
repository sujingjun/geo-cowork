---
name: geo-strategy-discovery
description: 在显式人工 invocation 后，基于 development-test KBASE 的 M6 strategy CIS 和已批准 M4 open Product Gap 执行战略发现、Decision Dimension 人工门、Strategy Output 与 Cycle 2 候选准备；不自动批准或选择。
---

# geo-strategy-discovery

## 触发场景

- 人工明确要求对一个 completed Cycle Review 进行 Strategy eligibility 检查；
- 已存在 approved/open Product Gap，需要准备 test-only Decision Dimension、Strategy Output 或 Cycle 2 候选。

本 Skill 不是普通 GEO Cycle 的必经步骤。没有显式人工 invocation 时保持 `not_applicable`。

## 输入

只接受 test-only Workspace、decided Cycle Review、M6 `snapshot_kind:strategy` CIS、create-only eligibility rule、已批准且非 stale 的 Evidence、approved/open Product Gap，以及独立 fresh-process 人工决定文件。

## 开工前必读

读取 Spec 0005、Spec 0007、Spec 0008、Spec 0012、M6→M7 Handoff、当前 Cycle Review/CIS、Merchant 与 KBASE 身份。先确认 `GEO_M7_NETWORK_DISABLED=1`，再核对 plan、Scope、版本、checksum 与人工决定的 `conversation_history_used:false`。

## 步骤

1. 用 `assess` 从 M6 strategy CIS copies 计算四项 eligibility；拒绝调用方自报 pass。
2. 等待独立人工决定 STA 是否 `proceed`；Tool 不自动决定。
3. 用两次独立人工门推进 DDM：candidate → validated → decision_factor，旧对象不覆盖。
4. 用 `assemble-output` 物化三份 test-only Strategy Output artifact；不生成 approved PRD。
5. 由 `geo-lifecycle propose-cycle-two` 从 decided Cycle Review 创建 GCB/GCD 与 draft GSEL。
6. 等待 fresh-process GSEL 人工决定；没有 selected 时不启动 Cycle 2。
7. 由 `geo-lifecycle apply-goal-selection` 创建独立 approved Goal、freeze CIS 与 Cycle 2 输入。
8. 记录 trace、create-only 恢复状态、未验证边界和下一人工门。

## 输出

输出 STA、DDM、STO、GCB/GCD、GSEL 和 Cycle 2 freeze input refs，以及 eligibility、trace、warning、失败码、`network_accessed:false` 和真实门仍 open 的说明。

## 可做事项

- 读取 M6 strategy/review CIS 的完整 snapshot copies；
- 运行确定性 eligibility、key、排序、tuple、partition 和 checksum 校验；
- 物化 test-only draft/waiting 对象与 create-only artifacts；
- 请求人工 review、factor promotion、Goal selection 与独立 Goal approval。

## 禁止事项

- 不自动触发 Strategy、不从正文猜 dimension、不接受裸 Sample 或 candidate Review；
- 不创建、确认或修改 M4 Product Gap；
- 不自动批准 DDM、PRD、Claim、Goal、GSEL 或 Publication；
- 不访问真实 MyyShop、账号、平台、Analytics、外部系统或网络；
- 不把 fixture 决定、STO 或 synthetic Cycle 2 表述为真实产品投资或业务效果。

## 失败与停止条件

human invocation 缺失、CIS/checksum/Scope 漂移、Evidence 不合格、Product Gap tuple 不一致、decision lineage 非法、artifact 冲突、GSEL 分区不完整、真实/模拟污染或网络 guard 缺失时立即停止。旧对象与已写 artifact 不删除、不覆盖。

## 验收方式

运行 M7 Schema/assessment/DDM/STO/GCB/GSEL/CLI/Cycle2/trace-security 测试。必须证明普通候选不依赖 Strategy、Product Gap 候选闭合 STA→factor DDM→STO、三份人工决定来自 fresh process、重复 materialization 为 `kept`，并保持 M6 回归通过。

## 示例

```bash
GEO_M7_NETWORK_DISABLED=1 node <plugin-root>/scripts/geo-strategy-discovery.mjs assess --workspace <test-workspace> --plan <plan.json>
GEO_M7_NETWORK_DISABLED=1 node <plugin-root>/scripts/geo-strategy-discovery.mjs trace --workspace <test-workspace> --plan <plan.json>
```
