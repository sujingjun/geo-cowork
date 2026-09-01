---
title: Query Portfolio 流水线架构设计
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/prd/2026-09-01-query-portfolio.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
scope: Query Portfolio 工具、确定性规则、双路写入与测试商户 fixture 的模块关系
---

# Query Portfolio 流水线架构设计

## 1. 目标形态

Query Portfolio 是 Cycle 启动前的独立准备段，位于 M3 对象体系与 M6 Cycle 冻结之间：

```text
授权观察（intake plan）
→ candidate Query 生成（确定性规则）
→ 去重（in-plan 预检 / 跨来源合并 / 既有跳过）
→ 聚类 / 意图 / 覆盖报告（qp-portfolio-report 工件）
→ 人工批准（candidate → formal，人类编辑对象）
→ draft Query Set 组装
→ 冻结前检查（gates + content_sha256 预览）
→ 人工冻结（draft → frozen，人类编辑对象）
→ M3 validate / index / M6 create_cycle 消费
```

## 2. 模块关系

```text
scripts/query-portfolio.mjs            CLI：intake / report / assemble / prefreeze / validate
scripts/lib/query-portfolio.mjs          规则与流程（纯函数 + workspace I/O）
  ├─ 复用 object-contract / index-builder / workspace-paths（Spec 0003 内核）
  ├─ 复用 knowledge-query.mjs 的 querySetContentSha / validateKnowledgeWorkspace
  └─ 测试商户路径复用 m6-test-merchant.mjs 的 preflightSyntheticWrite / validateTestMerchantWorkspace
skills/geo-query-portfolio/SKILL.md      编排 Skill（人工门与 Run 记录约定）
tests/helpers/query-portfolio-fixtures.mjs  知识库缺席的测试商户 fixture
```

不新增 record type、不修改 Schema、不修改 M3/M6 既有 lib。Query 与 Query Set 继续由 Spec 0003/0004 对象承载；聚类与覆盖是派生分析工件，不是业务对象。

## 3. 关键决策

### 3.1 双路写入（同一代码服务真实与测试工作区）

写入前读取 workspace 根 `workspace.json`：

- `workspace_mode !== 'test_only'`（含真实工作区与无身份 fixture）：`validateObjectData` + `writeCreateOnly`，与 M3 `propose/assemble` 相同路径；
- `workspace_mode === 'test_only'`：读取唯一 `test_merchant`，为输出对象生成顶层 `test_scope`，经 `preflightSyntheticWrite` 全量预检（身份、污染、Schema、M6 profile、refs 闭包）后 `writeCreateOnly`。

由此：真实知识切片到位后，同一命令在真实工作区运行无需改代码；测试商户写入保持 M6 fail-closed 隔离。

### 3.2 确定性规则（版本化，跨宿主可复现）

| 规则 | 语义 |
| --- | --- |
| `qp-normalize-v1` | NFKC → 小写 → 空白折叠 → 去首尾标点；结果为空即非法 |
| `qp-intent-v1` | 固定关键词与顺序的意图枚举判定：comparison / recommendation / pricing / reputation / capability / brand_definition / other |
| `qp-priority-v1` | 来源类别 → P0—P3 固定映射；多来源取最高优先级 |
| `qp-cluster-v1` | 在 (goal, language, intent) 桶内，去停用词 token 集 Jaccard ≥ 0.6 的 union-find 聚类；cluster_key 为成员有序集合的内容哈希 |
| `qp-id-v1` | `Q-<SLUG>-<LANG>-<HEX4>`；SLUG 为归一化文本 ASCII token，HEX4 为 (normalized_text, language) 内容哈希前 4 位 |

规则版本写入生成对象的 `extensions['geo.qp_intake']`，供 validate 漂移检查与审计。

### 3.3 人工批准与冻结不新增机制

candidate → formal 与 draft → frozen 沿用 Spec 0004：人类编辑对象 + approval 证明；工具只做机器门校验（prefreeze 列 gate、validate 报 error）。工具任何命令不生成 approval。

## 4. 数据流与工件

- intake：stdout 结果（created / kept / duplicates / merged sources），对象写入 `queries/candidates/`；
- report：create-only JSON 工件写 `queries/portfolio/reports/<goal>-<key8>.json`（内容键寻址，幂等）；
- assemble：draft Query Set 写 `queries/sets/`（由 plan 指定路径）；
- prefreeze：纯检查，stdout 输出 gates、期望 `content_sha256` 与覆盖 warning；
- validate：M3 validate + portfolio 检查 +（测试工作区）test merchant 校验，stdout `{errors, warnings}`。

## 5. 安全与隔离

- 所有写入经 `assertSafeRelativePath` / `assertNoSymlinkPath` / `resolveWithin`；
- 测试工作区写入走 `preflightSyntheticWrite`（真实 MyyShop 路径、真实 canonical ID、email、非 `.invalid` URL 全部拒绝）；
- 真实 `workspaces/myyshop` 在本里程碑只读（验收命令均为只读检查 + `git status` 核对字节不变）。

## 6. 风险

| 风险 | 处理 |
| --- | --- |
| 规则阈值（Jaccard 0.6、停用词表）业务上不最优 | 规则带版本，报告/工件显式记录；调整必须升版本，不做隐式改动 |
| 生成 ID 与既有对象冲突 | 写前按 stable ID 查重，冲突 fail loud（QP_ID_COLLISION） |
| 修改共享内核破坏 M2—M7 | 不改内核；全部新代码在新文件；全量回归验收 |
| 测试商户 fixture 伪装真实批准 | fixture approval 一律 `fixture://`，对象带 `test_scope`，真实工作区字节不变由测试断言 |
