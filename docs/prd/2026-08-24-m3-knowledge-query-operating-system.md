---
title: M3 Knowledge & Query Operating System PRD
status: proposed
created: 2026-08-24
source: docs/requirements/2026-08-24-m3-knowledge-query-operating-system.md
scope: M3 产品流程、人工决策点、业务规则与验收
---

# M3 Knowledge & Query Operating System PRD

## 1. 为什么做

完整品牌文档适合人类理解战略、语境和限制，原子 Claim 适合机器回答 Query、检查 Evidence 和生成后续建议。二者如果没有共同版本和批准关系，就会出现“文档说一套、Agent 调用另一套”。M3 建立这条双层知识权威，并把正式 Query Set 与 Knowledge Release 冻结为后续诊断的稳定输入。

## 2. 核心用户

v1 核心用户是 MyyShop 当前研发负责人，同时协调品牌、事实与业务审核。Agent 负责提出候选、检查完整性和解释风险，不代替任何批准者。

## 3. 用户流程

### 3.1 Document 到 Claim

1. 用户创建完整品牌 Document，明确范围、来源与 legacy 参考。
2. Document 经人类审核后标记 approved，并留下批准人、时间和决策引用。
3. `geo-knowledge` 从 approved Document 提出 candidate Claims 和 candidate Answer Card。
4. 用户逐项确认 Claim 风险、Evidence、Scope 和表述，决定拒绝、继续补证、review 或 approve。

非 approved Document 可由 Agent阅读和评论，但不能进入确定性 materialize 流程。

### 3.2 Source、Evidence 与 Evidence Plan

用户把来源主体登记为 Source，把可定位摘录/快照登记为 Evidence。系统按 Claim 风险提示建议证据最低组合。证据不足时生成 Evidence Plan，列出需要证明什么、缺什么、由谁提供、如何验收；M3 不执行采集。

### 3.3 Query candidate 到 frozen Query Set

1. Agent 或用户创建 candidate Query，并关联 Core Perception Goal 与来源。
2. 人类去重、确认意图和价值后，显式批准为 formal。
3. Query Set 聚合 formal Query；freeze 时锁定每条 Query 的版本与内容 hash。
4. 新发现或任何正式 Query 文本变化进入新 Query/Set 版本，不能静默改旧 frozen Set。

### 3.4 Knowledge Release

用户选择 approved Claims 与 approved Answer Cards，创建 draft Release。机器检查每个精确版本与 refs；人类 review 后决定 published。Claim `published` 表示已进入正式 Knowledge Release，不表示官网、FAQ、媒体或 Schema 已发布。

### 3.5 “What is MyyShop” v1

M3 在真实 Workspace 建立窄 candidate 链：Core Perception Goal、Query candidate、Source、Evidence、Document、Claims、Answer Card、draft Query Set 与 draft KR。由于本次没有独立的业务事实批准指令，这些对象不得被自动提升。合成 Fixture 单独证明批准后的 freeze/publish 机器行为。

## 4. 业务规则

1. 双层权威：完整 Document 保存语境；Claim 保存可独立调用的原子结论；两者必须有版本 refs。
2. Claim 治理生命周期为 `candidate → evidence_ready → reviewed → approved → published → stale/deprecated`。M3 不提供自动 promote；机器校验目标状态的 approval、证据与 Release 前置，但没有 transition ledger 时不声称已证明完整历史路径。
3. 五类风险只产生建议：普通事实、能力事实、效果主张、比较/优势主张、高风险商业承诺。
4. Evidence stale 只提示复核，不能自动让 approved Claim 或 Release 失效。
5. candidate Query 必须人工批准才能 formal；frozen Set 内不能有 candidate。
6. Knowledge Release 锁定 Claim/Answer Card 精确版本，不能引用漂移版本。
7. legacy `KB-*`/`Q-*` 只是 `legacy_refs`，不是 canonical refs 或批准证据。
8. Agent 可以创建候选与计划，不能批准、发布、采集真实数据或生产内容。

## 5. Evidence Sufficiency 建议

| Claim 类型 | 建议最低证据 |
| --- | --- |
| 普通事实 | 1 个已批准第一方来源 |
| 能力/效果主张 | 第一方事实 + 数据或真实案例 |
| 比较/优势主张 | 第一方事实 + 用户或独立第三方证据 |
| 高风险商业承诺 | 正式规则 + 明确 Scope + 业务负责人批准 |

建议不足只产生 warning 和 Evidence Plan，不自动阻止用户保留候选，也不自动推进/回退状态。

## 6. 业务验收

- 用户可从 approved Fixture Document 生成可审查而非已批准的 Claims/Answer Card。
- 系统拒绝无 approval 的 formal Query、frozen Set 和 published Release。
- 用户能查看 Query → Answer Card → Claim → Evidence → Source → Document 的完整路径，并分别看到 `lifecycle_ready/gates`。
- stale Evidence 不改变 Claim/Release 状态。
- MyyShop 实例保留 candidate/draft 边界和五条风险提示；120 条 legacy 内容没有批量改写。
- 后续 M4 可以读取确定版本，但不能误认为 draft/fake Fixture 是业务基线。

## 7. 非目标

不创建 Finding、Asset、Gap 诊断、About/FAQ/Schema/llms 建议稿；不采样消费者平台；不做 Analytics、真实 Cycle 或战略发现；不自动发布或写外部系统。
