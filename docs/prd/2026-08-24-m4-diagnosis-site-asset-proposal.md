---
title: M4 Diagnosis, Site & Asset Proposal PRD
status: approved
created: 2026-08-24
source:
  - docs/requirements/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - "2026-08-24 当前用户指令：批准 M4 六份 SDD 进入实现；真实 MyyShop 采集仍不授权"
scope: M4 用户流程、Gap 业务规则、Asset 建议、采用/发布/复测门与业务验收
---

# M4 Diagnosis, Site & Asset Proposal PRD

## 1. 为什么做

M3 已回答“允许说什么、由什么 Evidence 支撑、哪些 Query 必须回答”。M4 要回答“现有站内外 Asset 哪里缺失或不一致、为什么构成 Content/Evidence/Product Gap、应该给出什么完整建议稿”。如果不把观察、判断、采用、发布和复测拆开，系统会把技术检测当业务结论、把建议稿当上线事实，最终无法审计 GEO 变化来自何处。

## 2. 核心用户

v1 核心用户仍是 MyyShop 当前研发负责人。该用户协调品牌、产品、内容、证据和发布负责人，负责批准 M4 SDD、授权真实采集、确认语义 Gap、逐项采用建议、确认实际发布并决定是否进入后续 Cycle。

Agent 负责提出候选、解释证据和风险、运行确定性检查并生成完整建议稿；Agent 不替代任何采集授权、业务判断、采用或发布决定。

## 3. 核心对象与阶段

```text
M3 approved inputs
→ immutable collection evidence
→ technical Finding / semantic Gap proposal
→ Asset-level complete proposal
→ item-level human adoption
→ human publication attestation
→ Technical Retest
→ M5/M6 后续效果观察
```

各阶段独立成立：

- Finding 存在不表示 Gap 已获人工确认；
- Proposal 存在不表示建议被采用；
- Adoption `accepted` 不表示内容已发布；
- Publication attestation 不表示技术复测通过；
- Technical Retest 通过不表示消费者平台认知或业务指标改善。

## 4. 用户流程

### 4.1 启动诊断

1. 用户选择 approved Perception Goal、frozen Query Set 和 published Knowledge Release 的精确版本。
2. 用户选择目标 Asset registry；同一 Asset 可以关联多个 Goal，但每个诊断 Run 必须锁定实际输入版本。
3. 离线开发只加载 `.invalid`/本地 Fixture manifest；真实目标需要列出 URL、账号、采集器、数据范围和允许写入范围并取得当次授权。
4. 输入变化时旧 Run 保留并 supersede，不覆盖原始 Evidence 或输出。

### 4.2 站点技术诊断

`geo-site` 读取带 checksum 的采集 manifest，检查 HTTP、canonical、robots、sitemap、Schema 语法、title/meta/heading presence 和 crawlability。每个结论都引用实际 snapshot Evidence、规则版本与目标 Asset。

已取得响应但内容表明 403/login/challenge 时，Evidence 证明的是“本次访问被阻断”；无响应、超时或缺 snapshot 时记录不可验证。两者都不能支持“页面不存在”“没有 Schema”或其他超出证据范围的结论。

### 4.3 研究输入

`geo-reputation`/`geo-competitor` 接收已授权或合成研究 manifest：

1. 登记 Source 与访问时间；
2. 分别记录可访问性、是否取得原文、snapshot checksum；
3. 区分第一方、用户、独立第三方、竞争对手材料和生成式平台 Observation；
4. 记录独立支持、反证、置信度和理由；
5. 只有 Evidence 闭包完整时才提出语义 Finding，且初始状态等待人工确认。

系统不把搜索摘要、点赞数缺失、登录墙、平台回答或单一竞争对手自述自动升级为可信业务结论。

### 4.4 Gap Review

用户按三类 Gap 审查：

| 类型 | 必须成立 | 典型反例 | 初始决定 |
| --- | --- | --- | --- |
| Content Gap | 能力/Claim 已存在且当前表达所需 Evidence 足够；目标 Asset 缺失、不清晰或不一致 | Evidence 不足；能力尚未成立；只是技术抓取失败 | `waiting_human` |
| Evidence Gap | Claim/能力存在，但指定表达缺 data/case/user/independent 等所需 Evidence | 只是页面文案缺失；已有足够且在有效期内的 Evidence | `waiting_human` |
| Product Gap | 有可复验的用户需求/决策因素 Evidence，且产品能力确实缺失或不足 | 单条 Query、单次平台回答、竞品自述或内容未写清 | `waiting_human`，并只能建议进入 M7 战略分支 |

Agent 必须展示支持 Evidence、反证和未解决冲突。人类确认后 Gap 才能进入后续行动；Product Gap 不自动变内容任务或产品需求。

### 4.5 Asset 级完整建议稿

用户选择目标 Asset 后，`geo-content` 根据 Query、批准 Claim、Evidence、Finding 与 Knowledge Release 形成单份完整建议稿：

- Own/官方可控 Asset：完整正文或结构化内容建议；
- 合作伙伴/媒体：完整 Brief 或 Pitch；
- 社区/用户内容：研究记录与回复建议稿，不自动冒充用户发言；
- 多 Goal 共用 Asset：合并为一份 Proposal，每个建议项保留来源 Goal/Query/Claim/Finding。

Evidence 不足或 Claim 尚未获允许表达时，建议稿可以保留占位和弱化版本，但必须显式风险说明，不能生成肯定事实。

### 4.6 Adoption、Publication 与 Retest

1. Tool 可为 Proposal 创建空白 Adoption Record，所有建议项先为 `pending`。
2. 人类逐项填写 `accepted/modified/rejected`、理由和必要的修改文本，并留下批准证明。
3. 实际修改并发布由人类或外部流程完成；系统只接受独立 Publication attestation，不执行写入。
4. 只有 confirmed Publication 或明确的 `development_fixture` 才能启动 Technical Retest。
5. Retest 创建新 Evidence、新 Finding 和新 Run，并引用旧 Finding；不覆盖历史，不声称业务效果。

### 4.7 M2–M4 整体优化交接

实施过程中把 M2/M3 不合理项登记到 M4 Record，至少包含：观察 ID、当前证据、影响、是否阻塞、临时处理、建议优化和未验证项。M4 验收后生成整体优化 Handoff，交给独立任务统一评估，不在 M4 内顺手重构。

## 5. 业务规则

1. 不使用统一 GEO 总分；每个 Finding 保留独立规则与 Evidence。
2. `observed` 只用于 snapshot 能直接证明的技术事实；Gap 分类是 `inferred` 的语义提案，不能标为 observed。
3. blocked/unverifiable Evidence 只证明访问结果，不证明目标内容或业务事实。
4. 每个 M4 Finding 必须能追溯 Query、Claim、Evidence 和 Asset；不允许裸结论。
5. Evidence Sufficiency 不足时不能判为 Content Gap；应保留 Evidence Gap 或无法判定。
6. Product Gap 需要用户需求 Evidence 与能力缺口 Evidence，且必须人工确认；生成式平台 Observation 只能作为发现线索。
7. Proposal Tool 只物化 Host 明确给出的完整文本和建议项，不自行调用模型或补事实。
8. 同一 Asset、同一输入版本集合只能有一份有效 Proposal；重复同字节幂等，内容冲突失败。
9. Agent 不得创建 `decided` Adoption 或 `confirmed` Publication；人类证明缺失时 validator 失败。
10. 实际发布、Technical Retest、M5 平台复测和 M6 业务观察各自独立，不通过状态联动伪造结果。

## 6. 业务验收

### 6.1 离线工程验收

- 合成 approved M3 输入可以运行 Site/Research/Gap/Proposal/Adoption template/Publication fixture/Retest 全链。
- 正常、非法、边界、blocked、checksum、refs、输入漂移、重复、冲突与中断恢复都有测试。
- 两次相同输入产生相同 Finding、Proposal、indexes 和 trace；不存在综合分。
- 一个 About Asset 关联多个 Goal 时只生成一份 Proposal；建议项仍可逐条追溯。
- 风险段落、Evidence Gap、Product Gap 反例和人工状态门可由 Fixture 复验。

### 6.2 真实业务验收门

离线工程通过不等于真实 MyyShop 诊断完成。只有另行授权后，真实 Record 才能声明：

- 每个采集目标、账号、Source 和 Tool 均在授权范围；
- 每个真实 Finding 的 Evidence snapshot 与 refs 可读取并校验；
- 每个语义 Gap 有人工决定；
- 每个采用项、发布证明和 Retest 分别记录；
- 未进行的真实采集、发布、平台复测和业务观察明确列为未验证。

## 7. 非目标

- 自动访问未授权网站、账号、GA4/GSC、消费者生成式平台或内部业务系统；
- 自动发布页面、Schema、llms、PR、媒体、社区或合作伙伴内容；
- 把 M4 Technical Retest 当 M5 平台效果或 M6 业务效果；
- 自动生成产品战略、竞品优势结论或 Product PRD；
- 在本里程碑批量优化 M2/M3。

## 8. 已批准范围与后续人工门

- Owner 已于 2026-08-24 批准本 PRD、Architecture、Spec 0005、Plan 和 Task 进入本地离线实现；
- 后续真实采集范围、语义 Gap 决定、建议采用、发布证明与外部操作授权分别单独批准。
