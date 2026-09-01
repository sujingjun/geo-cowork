---
title: Query Portfolio 流水线需求
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - workspaces/myyshop/STATUS.md
  - 2026-09-01 当前用户明确指令：先实现 Query Portfolio 候选生成、去重、聚类、优先级、人工批准和 Query Set 冻结
scope: Query Portfolio 从候选生成到 Query Set 冻结的确定性流水线；不包含知识对象、真实采集、发布或业务效果
---

# Query Portfolio 流水线需求

## 1. 问题

最终产品方案（`docs/plans/2026-08-23-geo-cowork-final-product-plan.md` 第 3.2 节）定义了 Query Portfolio 生命周期：

```text
candidate
→ 去重 / 聚类 / 意图识别
→ 关联 Core Perception Goal
→ 记录来源 / 优先级 / 覆盖
→ 人工批准 formal query
→ Cycle 启动时冻结 Query Set Version
```

当前仓库只实现了该生命周期的终点合同：M3 提供 Query/Query Set 的 Schema、`assemble-query-set`（创建 draft）与 validate/trace 冻结校验，M6 测试商户 Cycle 的 Query Set 由 fixture 直接预置。起点与中间段缺失：

1. 没有任何工具可以从授权观察来源生成 candidate Query；Query 对象目前只能手工编写 Markdown。
2. 去重只存在于 validate 阶段的错误报告（`DUPLICATE_QUERY`），intake 时不能防重、不能报告重复观察。
3. 没有聚类、意图识别与覆盖分析；人工批准前看不到聚类视图，冻结前看不到覆盖缺口。
4. 冻结前没有就绪检查；人工需要直接在对象文件里完成 formal/frozen 编辑，缺一个列出剩余门的确定性入口。

同时，当前总体路线是：**知识库缺席时可完整工程验收，真实知识切片到位后无需改代码即可启动真实 Cycle**。这意味着 Query Portfolio 流水线必须与 Claim/Evidence/Document/Knowledge Release 完全解耦，在只有 Perception Goal 与 Source 的工作区上即可跑通到 frozen Query Set。

## 2. 本次目标

1. 提供确定性 intake 工具：从 workspace 内已登记 Source 的观察条目生成 candidate Query 对象（含 `normalized_text`、`intent`、`priority`、`goal_refs`、`discovery_source_refs`）。
2. intake 全量预检去重：plan 内重复与对同 Goal 既有活跃 Query 的重复都在写入前被识别；重复观察不产生第二个对象。
3. 提供确定性 portfolio 报告：按规则聚类（`qp-cluster-v1`）、意图分布、来源/优先级覆盖、formal 化与冻结就绪缺口。
4. 来源优先级按产品方案固定映射：生成式平台观察 > 第一方用户数据 > 真实社区表达 > 竞品材料；工具只写建议值，人工批准时可覆盖。
5. 人工批准与冻结保持既有合同：candidate → formal 与 draft → frozen 均由人类编辑对象并补 approval；工具不提供自动 promote，只提供校验与就绪检查。
6. 测试商户 fixture（`test_only` 身份、`.invalid` locator）在知识库缺席（无 Claim/Evidence/Document/KR）条件下完整跑通：intake → 报告 → 人工批准 → draft Query Set → 冻结 → validate/index 通过。
7. 上述代码路径 workspace-generic：真实知识切片到位后，同一命令在真实工作区运行无需改代码。

## 3. 成功标准

- 新增工具、规则与测试先红后绿；每条 Spec 行为可追溯到失败测试。
- 重复 Query 在写入前被拒绝或跳过并报告，不产生重复对象；重复观察保留在 Run 输出中可追溯。
- 聚类、意图、优先级、归一化全部为版本化确定性规则，同一输入在任何宿主输出一致。
- fixture E2E 在零知识对象的工作区完成冻结；`knowledge-query.mjs validate` 与新建 portfolio 校验均无 error。
- 真实 `workspaces/myyshop` 字节不变（只读检查通过）；既有 M2—M7、插件与文档检查全部通过。
- 不创建任何 MyyShop Claim、Evidence、批准、Publication 或业务效果。

## 4. 非目标

- 不创建、批准或修改 Claim/Evidence/Document/Knowledge Release；知识库到位后由 M3 既有流程处理。
- 不自动把 candidate 提升为 formal，不自动冻结 Query Set，不代写 approval。
- 不采集生成式平台、不访问账号、不连接 GA4/GSC。
- 不写 `workspaces/myyshop` 任何业务对象；不 commit、push、PR 或发布。
- 不在本轮实现 Cycle 运行期内的 Query Set 静默增删管控（M6 已有 freeze CIS 合同）；本轮只负责到冻结为止。

## 5. 已确认假设

- 观察条目来源以 workspace 内已登记的 Source 对象为准（Spec 0003 的 `source` 类型）；本轮不新增 Source 类型。
- portfolio 报告是派生分析工件（create-only），聚类结果不作为新的业务对象类型进入对象合同；Query 与 Query Set 仍由 M3 对象承载。
- 意图、聚类、优先级建议不写入既有 Query 的语义字段之外的新字段；`priority` 与 `intent` 沿用 M3 既有字段。
