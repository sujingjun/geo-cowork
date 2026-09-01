---
name: geo-query-portfolio
description: 在 Cycle 启动前用确定性流水线完成 Query Portfolio：观察 intake 生成 candidate、去重、聚类与覆盖报告、draft Query Set 组装、冻结前检查与三层校验。
---

# geo-query-portfolio

## 触发场景

- 从授权观察来源（生成式平台观察、第一方用户数据、社区表达、竞品材料）登记 candidate Query；
- 为一个 Perception Goal 生成聚类、意图与覆盖视图；
- 组装 draft Query Set 并检查冻结前剩余人工门；
- 校验 Query Portfolio 对象合同（M3 + portfolio + 测试商户）。

## 输入

工作区路径、intake 计划 JSON（引用 workspace 内已登记 active Source 与 Perception Goal）、报告 Goal ID、draft Query Set 组装计划 JSON、待检查的 Query Set ID。

## 开工前必读

读取工作区 `README.md`、`STATUS.md`、`workspace.json`，以及 Spec 0003、Spec 0004、Spec 0011。确认观察来源已获授权；测试工作区必须具备 `test_only` 身份与唯一 `test_merchant`。

## 步骤

1. 校验观察来源与 Goal 后运行 intake：

   ```bash
   node <plugin-root>/scripts/query-portfolio.mjs intake --workspace <path> --plan <plan.json>
   ```

2. 生成聚类与覆盖报告（create-only 工件写入 `queries/portfolio/reports/`）：

   ```bash
   node <plugin-root>/scripts/query-portfolio.mjs report --workspace <path> --goal <GOAL-ID>
   ```

3. 人工逐条批准：把选定 Query 编辑为 `formal` 并补 `approval`（可覆盖优先级建议）；Agent 不得代写 approval。
4. 组装 draft Query Set：

   ```bash
   node <plugin-root>/scripts/query-portfolio.mjs assemble --workspace <path> --plan <assemble-plan.json>
   ```

5. 运行冻结前检查，按 gates 清单人工补门：

   ```bash
   node <plugin-root>/scripts/query-portfolio.mjs prefreeze --workspace <path> --query-set <QS-ID>
   ```

6. 人工把 Query Set 编辑为 `frozen`（补 `frozen_at/frozen_by/content_sha256/approval`），然后校验并重建 index，把每步写入独立 Run：

   ```bash
   node <plugin-root>/scripts/query-portfolio.mjs validate --workspace <path>
   node <plugin-root>/scripts/build-index.mjs --workspace <path>
   ```

## 输出

candidate Query、portfolio 报告工件、draft/frozen Query Set、结构化 errors/warnings 与 gates 清单、可重建 index。

## 可做事项

- 确定性生成 candidate 与去重（同源重复失败、跨来源合并、既有重复跳过并报告）；
- 报告聚类、意图、优先级建议与覆盖缺口；
- 列出冻结前全部机器门与期望 `content_sha256`；
- 在真实工作区与测试商户工作区用同一命令运行（测试工作区自动走 `preflightSyntheticWrite`）。

## 禁止事项

- 不代替人类批准 Query、Query Set 或 Goal，不生成或修改任何 `approval`；
- 不把优先级建议、聚类结果或报告表述为业务决定；
- 不采集平台答案、不连接 GA4/GSC、不进入 M4 诊断或 Cycle 运行；
- 不修改既有 Query/Query Set 的状态或版本；不把测试 Fixture 的 approval 用于真实品牌。

## 失败与停止条件

Goal/Source 不存在或非 active、同源重复观察、stable ID 冲突、目标字节冲突、测试工作区身份或 `test_scope` 非法时停止在对应错误上；保留已合法创建的 candidate，不猜测修复。

## 验收方式

`query-portfolio.mjs validate` 无 error（warning 有明确 Owner）；`build-index.mjs --check` 通过；frozen Query Set 必须具备人类批准证明、精确版本与匹配的 `content_sha256`。

## 示例

```bash
node <plugin-root>/scripts/query-portfolio.mjs intake --workspace ./brand-workspace --plan ./intake-plan.json
node <plugin-root>/scripts/query-portfolio.mjs report --workspace ./brand-workspace --goal GOAL-EXAMPLE-001
node <plugin-root>/scripts/query-portfolio.mjs prefreeze --workspace ./brand-workspace --query-set QS-EXAMPLE-001
```
