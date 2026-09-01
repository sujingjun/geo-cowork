---
title: Query Portfolio 流水线 PRD
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/requirements/2026-09-01-query-portfolio.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - 2026-09-01 当前用户明确指令：先实现 Query Portfolio 候选生成、去重、聚类、优先级、人工批准和 Query Set 冻结
scope: GEO 负责人从观察来源建立并冻结 Query Set 的用户旅程、业务规则、业务验收与非目标
---

# Query Portfolio 流水线 PRD

## 1. 用户与价值

MyyShop GEO 负责人（v1 唯一核心用户）需要在 Cycle 启动前把分散的查询观察变成一份可审计、可批准、可冻结的 Query Set。当前 Query 对象只能手工编写，重复靠事后 validate 报错发现，聚类与覆盖完全靠人脑，冻结前剩余人工门不透明。本流水线把这一段变成确定性工具链，让负责人把精力集中在人工批准本身。

同时满足总体路线要求：知识库（Claim/Evidence/Document/KR）缺席时，流水线可完整工程验收；真实知识切片到位后，同一命令无需改代码即可在真实工作区启动真实 Cycle 的 Query Set 冻结。

## 2. 用户旅程

1. 负责人整理已授权观察（生成式平台观察、第一方用户数据、社区表达、竞品材料）为一份 intake 计划，引用 workspace 内已登记的 Source 与目标 Perception Goal。
2. 运行 intake：系统按确定性规则生成 candidate Query（归一化文本、意图、优先级建议、来源 refs、Goal 绑定），并输出重复报告——同一来源在 plan 内重复观察同一 Query 直接失败且无部分写入；不同来源观察同一 Query 合并为一个 candidate（来源并集、优先级取最高）；对既有活跃 Query 的重复观察被跳过并记录指向既有对象。
3. 运行 portfolio 报告：按聚类、意图、来源、优先级与覆盖查看全景；看到哪些聚类还没有 formal Query、哪些语言/意图有缺口。
4. 负责人逐条审阅候选，人工把选定 Query 编辑为 `formal` 并补 approval（可覆盖优先级建议）。
5. 用既有 `assemble-query-set` 从 formal Query 组装 draft Query Set。
6. 运行冻结前检查：系统列出全部未满足的冻结门（Query formal、approval、Goal 状态、内容哈希预览、覆盖摘要）。
7. 负责人人工把 Query Set 编辑为 `frozen`（补 `frozen_at/frozen_by/approval/content_sha256`），validate 与 index 确认冻结成立。
8. 冻结后的 Query Set 成为 Cycle 启动输入；Cycle 内新发现的 Query 进入下一版本。

## 3. 业务规则

- **来源优先级**（产品方案 §3.2 固定顺序）：生成式平台观察 > MyyShop 第一方用户数据 > 真实社区表达 > 竞品材料；工具按来源类别写入 P0—P3 建议值，同一 Query 多来源时取最高优先级；建议值仅供人工参考，人工批准时可覆盖。
- **确定性规则**：归一化、意图识别、聚类、优先级映射均为带版本号的确定性规则；同一输入跨宿主输出一致；规则变更必须升版本，报告记录所用规则版本。
- **去重**：同一 active Goal 下 `normalized_text + language` 重复即重复；重复观察不得产生第二个 Query 对象，但必须在 Run 输出中可追溯。
- **人工批准**：candidate → formal 与 draft → frozen 只能由人类编辑对象并补 approval 完成；工具不得自动 promote，不得代写 approval；工具的人工批准检查只验证证明存在与格式，不验证决定真实性。
- **覆盖记录**：报告按 Goal 输出聚类 × 语言 × 意图的覆盖与 formal 化进度；冻结前检查输出覆盖摘要，缺覆盖只提示不阻断。
- **测试边界**：工程验收使用 `test_only` 身份、`.invalid` locator 的测试商户 fixture；fixture 中的 approval 仅用于验证机器门，不代表真实品牌批准。

## 4. 业务验收

| 编号 | 场景 | 通过条件 |
| --- | --- | --- |
| BA-01 | 观察登记 | 从合法 intake 计划生成 candidate Query，字段完整且绑定既有 Goal 与 Source |
| BA-02 | 防重 | 同一来源在 plan 内重复使整个 intake 失败且无部分写入；跨来源重复合并为单一 candidate；对既有 Query 的重复观察被跳过并报告既有 ref |
| BA-03 | 聚类视图 | 报告按确定性规则给出聚类、代表 Query、成员与优先级建议，同输入重算结果一致 |
| BA-04 | 覆盖视图 | 报告展示 Goal 下语言/意图/聚类覆盖与 formal 化缺口 |
| BA-05 | 优先级建议 | 按来源类别映射 P0—P3；人工覆盖后 validate 不再回写 |
| BA-06 | 人工批准门 | 无 approval 的 formal Query 或 frozen Query Set 在 validate 报错；工具任何命令都不能生成 approval |
| BA-07 | 冻结前检查 | 冻结前检查列出全部未满足门与内容哈希预览；全部满足时明确提示可冻结 |
| BA-08 | 知识库缺席 E2E | 零 Claim/Evidence/Document/KR 的测试商户工作区完成 intake → 报告 → 人工批准 → 冻结，validate/index 无 error |
| BA-09 | 真实工作区只读 | 真实 `workspaces/myyshop` 字节不变，既有只读检查通过 |
| BA-10 | 结论边界 | 全流程不产生任何 Claim、Evidence、Publication 或业务效果表述 |

## 5. 非目标与完成边界

本次完成至 frozen Query Set 为止的确定性流水线与测试商户工程验收；不证明真实 Cycle 效果，不包含知识对象治理（M3 既有）、Cycle 内 Query 静默变更管控（M6 既有）或真实采集授权。真实工作区运行、真实 Cycle 启动与业务效果由后续独立授权与 Record 证明。
