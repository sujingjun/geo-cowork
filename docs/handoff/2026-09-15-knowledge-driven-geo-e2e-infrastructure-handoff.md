---
title: 知识驱动 GEO 专家全流程基建闭环 Handoff
status: proposed
created: 2026-09-15
updated: 2026-09-15
repository: sujingjun/geo-cowork
baseline: main@dd7cc2187c962c84b45f46dd744e0fa9822a06b4
source:
  - 2026-09-15 Owner 当前请求：以模拟业务知识库先跑通 GEO 专家全流程，日常只维护知识与必要业务反馈
  - AGENTS.md
  - docs/workflow.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/specs/0013-browser-query-task-mcp-automation.md
  - docs/plans/2026-09-04-real-cycle-blocker-closure-plan.md
scope: 当前源码与历史验收记录审计、目标重排、接缝任务、模拟全流程与真实适配分层验收；不是实现或真实业务验收记录
authorization: 当前仅分析和交付；未获当次 commit/push/PR、真实账号访问、平台 Query 提交、外部发布或部署授权
---

# 知识驱动 GEO 专家全流程基建闭环 Handoff

## 0. 给接手 Agent 的结论

**不要等待 MyyShop 完整真实知识库，也不要从零重建 GEO 框架。下一步应交付“从知识输入到周期复盘的可操作产品闭环”，而不是再证明一次预置对象可以经过状态机。**

当前仓库已经有知识/Query、M4 诊断与建议、M5 答案与引用、M6/M7 Cycle/Review/下一周期、GA4/GSC 只读接入、Browser Server/Extension 的较多实现。但现有 synthetic E2E 会预先物化一批下游 gate fixture，不能证明日常使用时只提供业务知识，就能实际生成问题、分析、Gap、建议、反馈、复测与复盘。[R02–R15]

本次建议把工作的第一终点改为：**同一 Merchant 的隔离测试知识库 + 原始业务与外部输入 fixture，经公开 Skill/CLI 实际运行全部能力，完成 Cycle 1 的人工反馈闭环，再把反馈落实为 Cycle 2 的新计划与完整演练。** 真实输入适配与真实 GEO 效果另行验收，不得混淆。

### 当前审计证据边界

审计固定于上面的 Git SHA，已通过 GitHub 读取关键源码、接口、工作区状态和相关 Record。本文没有在完整本地 checkout 上执行 npm/pnpm 测试；本地拉取受网络解析限制未完成。文中测试数字是具名历史 Record 的结果，不是本次重跑结果。本文没有修改远端、访问真实平台账户、重新读取 GA4/GSC、发布资产或创建真实 Cycle。

`proposed` 表示本 Handoff 中新增产品/契约设计尚需按仓库 SDD 落定。接手后可以在已有批准范围内复现与修复；涉及新的行为合同，应先形成最小 PRD/Spec 修订和待批准差异，不能把本文件自行提升为批准凭证。[R01]

## 1. 成功标准：Owner 维护知识，不维护内部编排

Owner 的日常输入限定为三类业务材料：知识事实及原始证据、必要的人类决定、发布/业务观察反馈。账号连接和真实操作仍需对应授权。**“只维护知识库”是取消人工维护内部对象链、命令和状态，不是取消事实审核、发布责任与账号授权。**

Agent 应负责读取知识、生成候选 Query、准备冻结协议、收集或导入观察、分析答案、诊断 Gap/资产、生成站内外建议、整理审核包、读取反馈、执行已授权步骤、生成复测与复盘、提出下一周期候选。ID、引用、版本、checksum、plan、gate descriptor、索引和状态推进由工具生成、校验和持久化。

成功场景：Owner 说“使用这个知识库运行一个 GEO 周期”，系统自动完成当前可执行步骤；遇到确实需要人类的决定，提交一个可读审核包。Owner 填完反馈后，系统在新会话也能从文件继续，而不要求 Owner 手写 JSON、拼接 ID、修改数据库或理解 CAS/lease。

不将聊天记录作为授权或事实的唯一持久来源；将明确指令落成可核验的决定记录，同时保留真实决定主体。Agent 不能自行填写 Owner 的批准结论。[R01,R02]

## 2. 把三种完成度分开

以下 A/B/C 是本文的验收分层标签，不是新增仓库状态或 execution_scope。

| 层级 | 本层证明什么 | 可以用什么输入 | 不能声称什么 |
| --- | --- | --- | --- |
| A：产品级模拟演练 | 只提供业务知识、原始观察和独立人工反馈时，全部能力实际运行并衔接，具有错误分支和续跑能力 | 同一 Merchant、development-test KBASE、明确 synthetic/test_only 的原始知识、页面、答案、分析数据及模拟发布回执 | 真实平台正式复测、真实 Publication、真实品牌事实、GEO 提升 |
| B：真实输入适配 | 各入口能在获授权范围内处理真实数据，保留 provenance 并正确隔离 | 精确授权的消费者 UI 样本、真实公开页面读回、GA4/GSC 只读请求、聚合业务文件 | 自动覆盖所有平台、替平台授予自动化许可、基于一次接入证明完整业务周期 |
| C：真实业务周期 | 真实知识闭包、真实采集、实际发布、双复测、观察、Owner Review 形成可追溯周期 | 当前有效真实 KBASE 与逐阶段真实证据 | 将正向关联当因果，将合成结果当真实效果 |

当前先交付 A，同时实现和验证 B 所需契约与可执行适配能力；B 的真实运行证据按平台/数据源分别标记。缺某个平台自动化许可不阻止 A，也不阻止该平台的合规手工输入；但不能将未运行的平台标为自动化已验证。

9 月 4 日 proposed roadmap 以两个真实 Cycle + M8/v1 为终点。保留其有效 blocker 分析，但不再让真实 KBASE 供给、完整原生跨宿主验收或真实发布等待成为本次 A 层的前置条件。Spec 0014 在旧 Plan 中仅是拟议入口，接手时核对实际编号与状态，不宣称已经存在或批准。[R04]

## 3. 当前能力审计：哪些复用，哪些尚未闭环

| 环节 | 当前可证实的基础 | 尚缺的闭环/验收 | 证据 |
| --- | --- | --- | --- |
| Query Portfolio | intake、归一化、意图分类、去重、聚类、优先级、assemble、prefreeze、validate 已有 | 公共入口消费预置 query_text；需要从 KB/Goal 生成候选问题，标注生成来源，并实际经过审核、冻结 | R05 |
| 手工答案采集 | 已有五平台各两槽正式英文 manual Baseline 的历史记录和导入路径 | 统一用户粘贴/导出/结果 URL 的接收体验；新 Cycle 的完整绑定、错误分类、复测复用 | R03,R08 |
| 浏览器扩展 | CQI/BQT、checkpoint、raw、pending、ack、loopback UI 已实现并有局部验证 | Fake extractor、真实平台权限/选择器与真实 raw 到 canonical M5 的路径未闭合 | R06,R07 |
| Playwright MCP | 仓库有 Playwright smoke/采集相关基础；官方工具可连接浏览器 | 现有 GEO Browser Server MCP 不等于 Playwright MCP；需要受控执行适配、批准的 MCP 边界和统一结果合同 | R02,R06,W02 |
| 答案分析 | Sample、Citation、Review、Aggregation 合同与工具已有 | manual-review-batch 的 core/exploratory 由输入提供且固定 candidate；需验证语义分析的来源定位，并闭合 Owner decision→reviewed successor→新聚合 | R08,R09 |
| 品牌知识与 Claim/Evidence | 120 条 legacy 目录、模板、治理说明及 M3 canonical 对象基础已有 | 完整可维护目录应统一指向 canonical 状态；补变更影响、失效检查、模板与生成入口，不能再维护两套事实 | R03,R10 |
| Content/Evidence Gap | M3/M4 知识与诊断基础已有，语义边界有定义 | KB+答案+资产证据联动，实际生成 Gap 报告与处理路线；区分输入缺席、内容缺口、证据缺口和产品缺口 | R02,R11 |
| Own/External Asset | site-audit、research-ingest、manifest/snapshot、propose-assets 等入口已有 | 从任务到授权输入准备、双类资产诊断与可读报告，第三方不可控资产另行处理；不能仅验证人工写好的 manifest | R11 |
| 站内外建议 | Asset Proposal、prepare-adoption 等基础已有 | 生成业务可交付建议文档：改什么、为什么、证据、负责人、接受标准、预期影响和验证方式 | R11 |
| 人工审核与发布反馈 | Adoption/Publication 对象与 prepare 入口、人工门已有 | 统一反馈入口和 successor；真实发布证明读回；发布前授权与发布后 attestation 分离 | R11,R12 |
| Technical Retest | technical-retest 与确定性 Site 审计存在 | 以同一 adopted item/asset 的实际发布版本和新快照驱动，技术通过不等于答案或效果改善 | R11,R12 |
| 消费者正式复测 | M5 purpose、Profile、两槽协议和聚合基础存在 | post-change 真实证据及完整 Query×Platform×slot×window 校验；模拟只能验证协议执行 | R03,R08,R12 |
| GA4/GSC/业务数据 | 真实只读历史采集已形成 ANO/非因果 BSIG/candidate EVD；聚合业务文件 adapter 已有 | 当前 Cycle/Goal/window 绑定、质量与覆盖报告、输入模板；旧日期聚合不能证明 AI referrer 或 GEO 效果 | R03,R16 |
| GEO Cycle Review | assembleCycleReview、decideCycleReview、下一周期候选/选择与 synthetic 双周期基础存在 | 用户可读复盘模板→真实反馈导入→新 decided CRV→下一周期；real scope 与统一入口尚未闭合 | R13,R14,R15 |
| 整体编排/宿主 | Skills、文件工作区、CIS、lease/CAS/恢复工具已有 | 知识驱动而非 gate 驱动的日常入口；原生宿主运行证据、WorkBuddy 新契约适配 | R02,R13,R14,W01 |

### 3.1 已被源码确认的关键接缝

**E2E 边界。** `tests/m6-cycle-e2e.test.mjs` 的主旅程先调用 `seedM6FreezeInputs`、`materializeM6E2EGates`，再创建 Cycle，前六个 gate 使用预置 descriptor 推进。它是有价值的合同/恢复测试，但不能代替从业务输入逐步生成所有下游工件的产品验收。[R15]

**Browser 到 M5。** `materializeBrowserIntakeSample` 明确只接受 `m5-recorded-fixture-plan-v1` 与 `fixture://` authorization。真实 raw 已可靠接收也不表示真实 canonical M5 物化已经支持。[R07]

**Lifecycle 的真实 scope。** create-cycle 已出现 real readiness 分支，但 transition 和 Review 仍使用 `test_scope` / `preflightTestKnowledgeWrite`。Publication gate 强制 `.invalid`。因此“能创建 real Cycle”不能推断“能完成 real Cycle”。[R12,R13]

**gate 校验不足。** `cycle-gates.mjs` 存在按对象计数、状态和 ordinal 的校验，尚不足以证明完整实验矩阵、同 Cycle/Goal ownership 及所有精确版本关系。不能用无关的两个答案满足一整轮正式观察。[R12]

**失败副作用。** `advanceCycle` 在获得 lease、检查 CAS 和调用 stage semantic gate 前物化 gate snapshot；应先做无副作用 preflight，并明确失败后的 orphan/retry 合同。[R13]

### 3.2 历史验证记录不能省略的未完成项

2026-09-03 Browser Record 记载：根测试 353 项中 350 通过、3 失败，失败与 Analytics 授权过期相关；全量 Extension lint 8 errors/57 warnings；Nuxt build 生成产物但 PGlite 相关进程未自行退出。相关 Browser 专项、typecheck 和 loopback 浏览器链路当时通过。接手必须重跑定位，不能直接沿用“全仓已通过”，也不能续期真实授权来修复本应离线的单测。[R06]

当前 real STATUS 记载 `knowledge_base_ref:null`、`real_pending`、未创建正式 Cycle；五平台合计 10 个 Answer Review 为 candidate；100 Source 是非阻塞维护触发器。不得把 40→100 Source、120 条知识目录填满或正向业务信号设成本次基建验收条件。[R02,R03]

## 4. 目标架构：在既有对象系统上补接缝

```text
Owner 维护知识正文、原始 Evidence、适用范围与必要决定
    ↓
知识目录/模板/变更检查 → canonical candidate 与明确知识版本
    ↓
KB + Goal + 已有真实需求线索 → 候选 Query 生成 → Portfolio 治理
    ↓ 人工选择/必要批准
Frozen Query Set + 实验 Profile + 版本化运行计划
    ↓
manual / browser_extension / playwright_mcp
    ↓ 统一 capture 合同；保留实际 collector 与真实性标签
raw → 校验与解析 → Answer Sample/Citation → 候选分析 → Owner Review
    ↓
Content/Evidence Gap + Own/External Asset 诊断
    ↓
站内外建议文档 → Adoption 决定 → 发布反馈与证明
    ↓
Technical Retest → 预定窗口消费者 Platform Retest
    ↓
GA4 / GSC / 聚合业务文件 → 质量校验 → 非因果 Observation/Signal
    ↓
Cycle Review 模板 → Owner 反馈 → 新版本 decided Review
    ↓
候选优化方向 → Owner Goal 选择 → 新 Query Set / 新快照 → Cycle 2
```

实务中知识准备和答案观察可以并行，但最终事实准确性评估必须明确使用哪版经批准知识。不得把尚未完成的真实知识闭包当成答案一定错误的依据。[R02,R03]

### 4.1 控制面与事实源

沿用 Workspace canonical 文件、M2 provenance、CIS/CTR 与现有对象 Schema。新建总入口/派生进度报告可以，但不创建另一套 Flow 数据库替代 Cycle，不让 Browser Server 持有品牌事实或批准。Owner Inbox/目录/看板是可重建的导航，不是第二份事实库。

新增接口名称由 Spec 最小化确定。本文提到的“生成问题”“导入反馈”“继续周期”等是目标能力，不代表仓库已有对应 CLI。优先扩展已有脚本/Skill，而不是建立平行执行框架。

### 4.2 统一结果合同的必要语义

三个 collector 都应保留 merchant/KBASE/execution scope、Cycle/Goal、Query/Query Set 的 ref+version、平台、Profile fingerprint、目的、slot、采集时间/时区、会话条件、实际可知的地区/模型信息、结果 URL、raw 文件及 hash、提取器/规则版本、outcome、授权引用和实际 collector。

未知字段保持 unknown；不能猜模型版本、IP 地区或浏览器状态。人工导出没有 DOM 就明确没有 DOM；不能为满足 schema 伪造 HTML 或 screenshot。同一逻辑观察经不同入口重复导入必须去重；三个入口不是三个独立样本。

Browser 的原始接收边界沿用：读取 pending → 校验元数据和 raw chunks → 本地 durable intake → checksum 闭合 → ack；ack 后 M5 失败从本地 intake 重试。不要把 ack 当成业务审核或整个 Cycle 成功。[R06–R08]

## 5. 模拟知识库与输入包：提供业务原料，不提供预置结论

### 5.1 身份和工作区

复用 `MER-MYYSHOP-001` 和开发测试 KBASE 模式。使用现有 `workspaces/myyshop-development-test` 作为受版本控制的 seed，运行产物写入隔离的、具有明确 workspace_id 的演练工作区；具体路径由已批准初始化工具产生。不能把既有 frozen KBASE 原地改写成可变运行状态。

同一 Merchant 不新增虚构商户身份；模拟内容不代表 MyyShop 真实事实。生成物保持 synthetic/test_only，禁止合并到 real KBASE、禁止发布到真实 MyyShop 网站、第三方站点或消费者平台充当品牌事实。真实消费者样本只能按 B 层单独获取和保存；不能将模拟知识放进消费者对话提示后把受污染的答案计为自然正式 Baseline。[R02,R03]

### 5.2 完整目录沿用既有 9 类业务知识

目录完整表示所有业务类别均有条目/模板/状态/负责人入口，不要求所有内容一次填满。建议先做 18 个模拟条目：每类 2 个，足以检验维护能力；正式采样只冻结其中一个 Goal 所需的最小切片。数量是演练覆盖建议，不是新的产品门槛。

| 既有目录 | 建议两类演练条目 | 需要检验的知识能力 |
| --- | --- | --- |
| 02-brand-identity | 品牌定义、与历史品牌/定位的区别 | 实体消歧、旧事实保留、版本替代 |
| 03-positioning-strategy | 当前定位、明确非目标 | 不把局部服务泛化为整个平台 |
| 04-audience-lifecycle | 目标用户/资格、成长阶段适用性 | 人群与地区边界 |
| 05-products-services | 已支持能力、尚未支持能力 | 能力证据与 Product Gap 分流 |
| 06-commercial-rules | 模拟费用规则、结算/退款条件 | 日期、币种、例外与生效范围；不填写真实未知价格 |
| 07-trust-safety | 合规/隐私说明、风险限制 | 禁止过度保证和越界结论 |
| 08-proof-authority | 模拟案例、模拟统计指标定义 | 分母/窗口/来源/同意与到期治理 |
| 09-voice-messaging | 标准表达、禁用或废弃表达 | 正文、答案卡、Schema 的语义一致性 |
| 10-query-answer-cards | 定义问答、比较/选择问答 | Query→Answer Card→Claim→Evidence→Document/KR 链 |

保留 `00-governance` 与 `01-templates`。目录条目至少展示：主题、Query 关联、知识来源、Owner、状态、适用范围、版本、生效/复核时间、Claim/Evidence 引用及待补项。Agent 可生成 draft/candidate，但不得因“模板齐全”自动批准。引用当前模板时明确 legacy 与 canonical 的不同状态语义。[R10]

### 5.3 演练原始输入

输入包应包含知识原文/原始文档、演练用页面 before/after 源文件、消费者答案原始文本/局部 DOM fixture、模拟 GA4/GSC/业务数据行、独立的人类模拟决定。原始数据必须标记生成方式和 test_only；外部页面 fixture 使用保留测试域标识，本地 HTTP 访问地址通过显式 transport mapping 绑定，不能把 loopback URL 当成真实外部 Publication。

至少包含 6 个英文主线 Query 的生成意图，并覆盖定义、能力、适用性、规则、信任、比较；中英辅助仅做语义对齐。先跑 2 平台×2 slots 的垂直切片，再覆盖既有五平台适配合同。完整 6 Query×5 平台×2 slots×Baseline/Retest 两阶段为 120 个逻辑采样槽，全部可以使用隔离 fixture；120 是本演练矩阵计算，不是来源数量或知识条目数量门槛。

至少设置以下对照场景：已证实事实且页面表达不足、事实缺证据、知识输入未提供、当前能力不存在、旧定位仍出现在页面、引用与答案主张不对应、证据到期/矛盾、授权/登录/选择器失败、分析数据缺失/零值/负向、Owner 拒绝部分建议。

### 5.4 明确禁止的验收捷径

不能在 E2E 开始时注入最终 Findings、Evidence Plan、Asset Proposal、Adoption 决定、confirmed Publication、reviewed Answer Review、Aggregation、Cycle Review 或 Cycle 2 候选结论，再说业务链路跑通。下游工件必须由待验收入口产生。

fixture 可以提供不可控外部输入以及独立 Owner 模拟反馈；反馈只能在对应审核包生成后输入，且绑定该包的 ID/version/hash。发布模拟器必须在采用决定后执行，并产出实际可读回的演练版本，再由验证路径生成 test-only Publication 证明。原先 gate fixture 测试继续保留，定位为合同测试，不删除、不冒充新产品旅程测试。

## 6. 必须补齐的能力合同

### 6.1 知识维护与候选 Query 生成

知识输入在一个面向 Owner 的入口维护，并映射到既有 canonical 对象。Agent 生成所需 refs/IDs 和候选变更；到期、矛盾、废弃知识给出影响列表，活跃 Cycle 冻结输入不能被静默替换，变更应进入后续版本或新周期。

候选 Query 生成以 Goal、知识切片、用户角色/阶段和已有需求线索为输入。可以使用宿主模型提出问题、确定性模板作为可测基础，但两者都输出同一候选合同。记录 generator version、输入知识版本、生成理由和语言；模型建议不能冒充 `generative_platform_observation` 或已有真实用户数据。必要时在 Spec 中增加明确生成来源类别/扩展，不滥用现有 P0 来源优先级。

生成后走既有 Portfolio：去重→聚类→优先级解释→Owner 选择→formal Query/frozen Query Set。不能因推荐了一个问题就自动认为它有真实需求频次或已获批准。[R05]

### 6.2 三采集入口与提取器

手工作为完整一级入口：支持粘贴/导出/授权结果 URL，保留采集方式、独立性与缺失字段。不是只让 Owner 手写全部 JSON。

扩展区分“用户已提交后采集当前答案”和“扩展自动提交/批量执行”。分别记录授权与平台可用性，不以登录状态解除平台 manual_only。选择器变动、登录失效、challenge、提交结果未知必须保留失败状态；提交未知时不自动重发 Query。

Playwright MCP 作为可选受控执行器接入同一采集合同。官方已有连接既有浏览器及扩展模式，但这只证明工具能力，不证明平台许可或本仓适配完成。按已批准契约扩展 MCP 边界，固定依赖版本、限定目标页面与工具能力、由用户完成敏感登录，不导出 cookie/storage。[W02,R02]

提取器应先明确当前 Spec 0013 是否要求模型提取；按已批准合同实现真实 provider，或显式修订为规则型提取+人工修正/模型辅助。不能静默以新提取架构替代批准合同。将“采集”“字段提取”“品牌语义评估”分层：提取成功不等于 Claim 正确。

对真实 M5 物化新增 scope-aware 合同，保留 fixture 拒绝污染门；禁止简单删去 `fixture://` 检查就允许所有输入进入 real。[R06,R07]

### 6.3 答案分析、审核与聚合

输出必须回答：品牌是否被提及、定位是否一致、哪些原句支持或违反哪条知识、遗漏什么、引用实际指向哪里、置信/不确定项是什么。每条判断可定位原始答案片段与知识版本；无真实知识闭包时保留 partial/unknown，不填造“事实正确率”。

Agent 产出 candidate Review 与可读解释。Owner 决定生成新 ID 的 reviewed successor，原 candidate bytes 不变。Aggregation 重新 pin successor；不能只改 candidate 的 status，也不能沿用仍引用 candidate 的旧 AGG 充当已审核结果。

候选分析要有质量验收而非只有 schema 测试：用具名对照集检查无依据断言、错误事实、范围扩大和引文不支持等场景。宿主模型输出可以不逐字一致，但证据定位、分类约束与必要事实判断应通过已冻结 rubric。[R08,R09]

### 6.4 Gap 与站内外诊断/建议

`Knowledge Input Absence` 是输入/就绪问题；`Evidence Gap` 是主张缺少足够/适用/有效支持；`Content Gap` 需要已采集资产和需求/知识对照证明内容供给不足；`Product Gap` 表示问题不能仅靠内容修复。未采集、不可访问、未分类引用不能自动转成上述业务结论。[R02]

Own 资产与官方可控 External 资产可以输出直接改稿和发布建议；不可控第三方资产输出更正请求、补充材料或沟通建议，不声称已经修改，也不把自动社区发帖作为补洞方案。

建议文档每项包含 query/goal、发现与证据、目标资产与控制权、建议内容/前后差异、Claim/Evidence 约束、依赖、Owner、优先级理由、审核与发布动作、技术/平台复测接受标准。Evidence Gap 应产生取证任务，不能用更强营销文案“修复”。

### 6.5 Owner 决定与发布反馈

统一从可读审核包获取决定，再映射到现有 canonical 对象。审核包应展示所审核的具体版本、建议、差异、风险及必填反馈，支持采用、修改后采用、拒绝、延期等业务选择；这些选择如何映射对象字段由 Spec 明确，不擅自新增全局状态词。

决定必须绑定 exact object/version/hash、决定主体与时间。Agent 准备材料不等于获得批准；模拟决定明确 fixture_human/test_only，真实批准不能复用。

外部发布前的操作授权和发布后的事实证明分开。发布后记录实际 locator、时间、发布版本/内容 hash、涉及 adopted item、回执/截图和只读 read-back。发布失败、未发布、局部发布不能标为全量 confirmed。拒绝所有建议应按已有取消/未采用分支结束或等待，不强行补假 Publication。

### 6.6 Lifecycle 与两个 Retest

scope-aware 修复覆盖 create/advance/review/trace/cycle-two 全调用链，不能只改一个 `.invalid` 判断。test-only 继续要求演练 locator/隔离；authorized-real 校验真实目标和证明；scope 不得靠 ID 前缀猜测。

阶段门按冻协议验证完整矩阵、同 Merchant/KBASE/Cycle/Goal、query/profile/purpose/slot/window/版本/hash。Source queue/classification 的非阻塞维护不能原地污染 active freeze，补40→100跨阈值 non-interference 测试。[R04,R12,R13]

Technical Retest 在实际发布事件之后重取同资产新快照，按已批准技术规则验证页面、canonical、Schema、robots 等实际适用项。可选 llms.txt 等项目单独标注，不能把所有技术检查通过等同于生成式平台会引用。

消费者 Platform Retest 在发布与 Technical Retest 后，按预先确定的观察窗口执行。默认每周复测可以作为用户现有节奏的计划模板，但必须明确日期/时区及实际执行记录；不在首次演练时假装未来窗口已完成。新采集保留拒答、无结果与失败，禁止择优保留、重新措辞后当作原 Query 的改善。[R02,R08]

### 6.7 Analytics 与业务输入

复用已有只读接口、认证边界和 `ingest-business-file`，不因期望 MCP 就重写已可用的数据通道。工具实现方式由宿主可用能力选择，但产物遵守同一 Observation 合同。

模板至少声明指标定义、值/单位、时间窗、来源、粒度、时区、去重/排除规则、覆盖/缺失、采集时间、业务 Owner、Cycle/Goal/资产关联。数据按聚合层输入，不要求导出个人级敏感数据。未提供、真零值、暂未成熟窗口、权限失败必须分别表示；缺输入不能伪装为零增长，也不能静默成为 not_applicable。

将接口可用、平台曝光、带可识别来源的访问、业务事件分开呈现。声明 measurement contract 的取数范围、质量警告、候选来源映射、无法识别部分和非因果边界。低样本/无信号/负向允许进入有保留的 Review，不自动证明 GEO 无效或有效。[R16]

截至本次核验，Google 已发布单独的生成式 AI 可见性报告，官方注记 2026-08-31 全站点推出；它的数据包含于 overall report，不能相加重复计数。当前查阅的 Search Analytics API 文档未列专门 GenAI `type`，因此接手应核实目标属性及实际可用 API/授权导出，不编造参数，也不从 UI 新报告推断本仓已具备对应接口。[W03,W04]

### 6.8 Review → 下周期反馈

复盘不是只生成摘要。先冻结 Review 输入，生成含结果/缺口/对比/局限/禁止结论的 waiting 包；Owner 填反馈后形成新 decided CRV；产生下一周期候选，每项给出处、优先理由、预期机制、依赖与验证方式；Owner 选择 Goal 后才冻结下一周期。

复用现有 `assembleCycleReview`、`decideCycleReview`、`propose-cycle-two`、`apply-goal-selection` 能力并暴露可用入口，不把已存在的 Review 底座描述为“全部重做”。Product Gap 涉及策略决策时走既有 Strategy 门，普通优化候选不能被迫进入完整策略分支。[R13,R14]

附带的 `geo-cycle-owner-review-template.md` 是业务侧模板，不是可直接导入现行 schema 的 JSON。接手应根据获批 Spec 实现转换/校验，不能直接把填好的 Markdown 当 approval 对象绕过门。

## 7. 实施任务包与依赖

所有任务由 Engineering Lead 集成，QA 独立核查证据与负例。无需人为建立多个执行 Agent 才能完成；具备并行能力时，KB/Query、Capture、Lifecycle/Review 可在共享合同冻结后并行。优先级描述当前建设顺序，不是现有业务对象 priority 字段。

### T00 — 基线复现、最小 SDD 差异和任务登记（P0）

目标：确认当前 HEAD 与本审计基线差异；读取 AGENTS、workflow、当前 PRD/Spec/Record；把本次“先产品演练”与 9/4 真实周期 roadmap 的范围差异写清。

目标文件：现有 `docs/prd/`、`docs/specs/`、`docs/plans/`、`docs/tasks/` 及新 Record；新增文件名/Spec 编号按仓库现状分配。不要批量改写历史已验收记录。

验收：输出可实施的新增/复用/待批准清单、执行授权矩阵、当前错误基线、测试计划。对于未获批准的产品变化只停受影响实现；继续完成不依赖该决定的复现、已有合同验证和候选材料。

### T01 — 确定性测试与构建退出修复（P0，依赖 T00）

目标文件：`tests/analytics-readonly-cli.test.mjs`，Browser 扩展的测试配置、lint 报错文件、构建/PGlite 生命周期代码，以复现结果限定修改范围。

验收：离线测试不依赖真实授权文件或当前墙钟，注入时钟/fixture；生产 expiry 仍 fail closed；Node test 与 Vitest 各收自己的文件；lint/typecheck/build 均有明确 exit 0 或具名未通过结果，不用 Ctrl-C 后标通过。不得删除失败测试、延长真实授权或大规模无关重构。

### T02 — 知识目录、模板和原始演练输入包（P0，依赖 T00）

复用 `knowledge/README.md`、`00-governance`、`01-templates` 和对象模板，映射 legacy/canonical；实现可重复创建、维护检查和变更影响报告。

验收：完整九类目录可导航；最小模拟知识切片可校验；有证据过期/矛盾/缺失分支；只有原始输入和独立 Owner 决定，不预置下游结果；真实 Workspace 校验摘要/字节未改变。

### T03 — KB 驱动的问题生成与 Portfolio 接通（P0，依赖 T02）

目标文件：`plugins/geo-expert/scripts/query-portfolio.mjs`、`scripts/lib/query-portfolio.mjs`、相应知识/Query Skills 与测试；仅在合同需要时增加生成适配模块。

验收：Owner 不写 query_text intake plan，也能由知识和 Goal 生成候选、看到理由、去重聚类、选择并冻结；更换知识版本能产生可解释差异；模型生成来源不会冒充真实用户/平台观察；旧 Portfolio 测试继续通过。

### T04 — 统一采集合同、真实提取和三个入口（P0/P1，依赖 T01、T03）

目标文件：`plugins/geo-browser-extension` 的 Browser Query/Extension 相关模块，`scripts/lib/browser-query-result.mjs`、`geo-answer-cycle/SKILL.md`、采集适配测试；PW MCP 接口新增需走边界批准。

先闭合手工→统一 Sample，再闭合扩展自动采集→同一 Sample，最后闭合 Playwright MCP→同一 Sample。三条路径都应有受控 UI/文件运行证据，fixture 可验证工程行为；真实验证单独标记。

验收：登录接管可继续，raw 可验证，缺权限可回落手工；unknown submission 不重发；失败 extractor 只重试提取；重复导入幂等；错 Query/version/scope/hash 拒绝且不 ack；ack 后可本地恢复。所有平台 adapter 都有支持/未支持/阻塞原因清单，不能简单批量改为 allowed。

### T05 — 答案分析与人工 reviewed successor（P0，依赖 T04）

目标文件：`scripts/lib/manual-review-batch.mjs`、`answer-review.mjs`、相关聚合与 CLI/Skill，复用已有 rubric 和 provenance。

验收：原始答案+知识实际产生 candidate 判断和证据定位；Owner 反馈经工具生成 new-ID reviewed successor；新 AGG pin 新 Review；原始样本和旧 Review 不变。rubric 对照集验证错误事实、过度外推、引用不支持与未知知识，不仅做 schema 校验。

### T06 — Gap、Own/External 诊断与建议文档（P0，依赖 T02、T05）

目标文件：`diagnosis.mjs`、`scripts/lib/research-input.mjs`、`site-audit.mjs`、`asset-proposal.mjs`，相应 Skills/模板；实改路径以定义和调用点核验后登记。

验收：同一知识/答案/页面输入实际生成两类 Gap 报告、站内外诊断和可交付建议；已知场景正确分流；每项有证据与下一动作；官方可控/第三方不可控资产分别处理；未采集资产不捏造结论。

### T07 — 人工反馈、模拟发布与 Technical Retest（P0，依赖 T06）

复用 prepare-adoption、prepare-publication、technical-retest，补用户反馈接收和发布读回适配。模拟器只作用于隔离测试站点或显式本地 fixture transport。

验收：采用/修改/拒绝/延期/局部发布均有正确分支；无批准不能执行模拟发布的批准分支；修改后重新审核；确有发布后新内容可读回，技术复测基于该版本；不能直接插入 confirmed gate 充数。真实适配保留独立授权与 read-back 证明要求。

### T08 — Scope-aware Lifecycle 和消费者复测矩阵（P0，依赖 T01、T04、T05、T07）

目标文件：`geo-lifecycle.mjs`、`scripts/lib/cycle-gates.mjs`、`cycle-lifecycle.mjs`、`cycle-trace.mjs`，以及 M5 post-change 相关入口。

验收：模拟 scope 完整且不污染真实对象；真实合同用脱敏合同测试验证，实际运行仍需授权；非法输入在可实现的 preflight 范围零业务写入；并发/孤儿恢复明确；完整实验矩阵与对象归属校验；Source 维护不干扰冻输入；Baseline 与 Retest 配对结果可重算。

### T09 — Analytics/业务文件与 Review→Cycle 2（P0/P1，依赖 T08）

目标文件：`geo-analytics-readonly.mjs`、`geo-analytics.mjs`、Review/strategy/cycle-two 既有模块、相关对象/报告模板。

验收：三类输入均有模板与读取/导入路径，质量/窗口/非因果边界可见；无信号/负向/缺失不被伪装；复盘模板收到 Owner 反馈后生成新 decided Review，提出下一周期候选，经选择后新冻 Goal/Query Set；完成第二个演练周期，不复用旧批准假充新决定。

### T10 — GEO 专家统一入口与宿主衔接（P0 入口；P1 宿主扩展，依赖 T03–T09）

基于现有 `geo-lifecycle`/相关 Skills 形成“开始/继续周期、查看待审核、导入反馈、查看复盘”的业务入口。CLI 做确定性动作与校验，宿主 Agent 负责语义与工具编排；能力不要只藏在长 Prompt 中。

验收：Owner 只用知识和可读反馈完成一次旅程，不手改 plan/ID/status；新会话能找回当前步骤、未完成原因、所需输入和下一动作。至少当前使用宿主有实测记录，其余宿主独立列状态，不用共享工具摘要冒充原生执行。

WorkBuddy 中国区官方目前已公开专家包、Agent 定义、Skills 和 MCP 依赖规则；先纠正 README 的“等待契约”旧说明，再按官方规范进行局部适配与实际导入/调用/续跑验证。官方使用 `.codebuddy-plugin` 是该包格式，不能据此把产品目标改成 CodeBuddy；工具权限由 WorkBuddy 系统分配，不能自造 tools 字段宣称能力。[W01,R02]

### T11 — 产品旅程验收、文档导航与最终交接（P0，依赖前述 A 层任务）

新增的产品 E2E 测试只能从业务输入与原始外部 fixture 开始，实际调用产物生成入口；保留现有合同测试并明确二者不同职责。产物必须持久化到可审阅演练工作区，不只在临时测试结束后删除全部证据。

验收：本节后列验收矩阵通过；出具逐层/逐平台能力报告、运行证据、真实未验证清单、Owner 操作说明、两个演练周期复盘。更新当前 docs 导航、STATUS 和相关 Skill；不改变历史 Record 的事实。最后在明确授权范围内处理提交，当前 Handoff 不授予 commit/push/PR。

## 8. 验收矩阵：不能只看测试数量

| 编号 | 验收场景 | 必须可核验的结果 |
| --- | --- | --- |
| A01 | 从新演练 Workspace 开始，仅输入知识/原始材料 | 无预置下游结论；自动生成可读候选问题并进入既有 Portfolio |
| A02 | 知识改动、证据到期或相互矛盾 | 产生候选变更/影响列表；不静默改写 active frozen inputs |
| A03 | 6 个 Query 的代表性对照集 | 生成来源真实标记；覆盖目标意图；去重/聚类可解释；Owner 冻结后稳定 |
| A04 | manual / extension / Playwright MCP 三入口 | 使用同一结果语义；实际 collector 保留；重复同一观察不计成独立样本 |
| A05 | 登录、challenge、selector drift、提交未知、提取失败 | 精确错误状态、最小人工接管、可恢复；不重发未知提交、不伪造成功 |
| A06 | 不同 Query/Goal/scope/version/raw checksum | 拒绝错误归属；不 ack 错误 bytes；保留必要诊断，不污染 canonical |
| A07 | 事实正确/错误/未知/过度外推/引文不支持 | 分析可定位答案原句和知识；unknown 不充当事实错误；候选与已审核区分 |
| A08 | Absence / Content / Evidence / Product Gap | 正确分流并有依据；缺目录、未采集不能直接推出 Content Gap |
| A09 | Own、官方可控 External、第三方不可控 External | 都有诊断与明确行动边界；不捏造第三方可发布权限 |
| A10 | 人工采用、修改、拒绝、延期 | 新决定有 exact-pin；修改触发重审；不自动自批、不覆盖旧批准 |
| A11 | 发布成功、局部发布、发布失败 | 只有有证明的项 confirmed；模拟发布后有新内容读回；真实与测试不混 |
| A12 | Technical Retest 与消费者 Retest | 同资产版本、不同测试目的；按固定矩阵/窗口比较；不能相互替代 |
| A13 | GA4/GSC/服务端业务数据的零、缺失、过期窗口、负向 | 正确区分值/质量/缺失；非因果；不给缺失数据填零 |
| A14 | Review 收到 Owner 反馈 | waiting 原文件不变，形成新 decided CRV；反馈影响候选和后续计划 |
| A15 | Cycle 2 | 来自具名上轮 Review、独立选择/批准和新冻结输入，完整演练且可追溯 |
| A16 | 中断、新会话、重复操作、CAS/lease 冲突 | 从文件继续；幂等；不覆盖冲突状态；失败副作用/孤儿恢复有证据 |
| A17 | Source 维护从40到100越阈值 | 不改变已冻业务输入，不阻塞无关 Cycle transition |
| A18 | 完成演练后检查真实 MyyShop Workspace | 原始与 canonical 无污染；不得以 test_only 生成真实 Claim/Publication |
| B01 | 一个获授权真实消费者样本进入系统 | 原始证据、平台条件、scope、人工审核及物化链正确；未授权则明确 blocked |
| B02 | 一个获授权真实发布版本的技术读回与复测 | 有 actual publication proof，不以演练结果替代；未发生则未验证 |
| B03 | 当前获授权 GA4/GSC 与聚合业务文件 | 当前范围/窗口校验通过，数据质量和 Cycle 关联准确；旧记录只作历史证据 |
| B04 | 当前宿主与 WorkBuddy 可选扩展 | 每宿主独立安装/入口/工具/续跑记录；不能复制同一 digest 证明独立执行 |

A 层通过与 B 层部分 blocked 可以并存。最终报告必须逐项说明，不能用一个“GEO 全流程完成”掩盖真实消费者正式复测尚未执行。C 层不在无授权情况下执行，更不能要求人为制造正向效果。

## 9. 验证命令与证据包

以下命令来自审计时仓库已有脚本，是接手的回归入口，不代表本次已经执行，也不是可跳过安装/环境检查直接复制到任意机器的承诺。[R02,R17]

```bash
# 先确认 HEAD、dirty changes 和依赖/运行环境；不得覆盖他人改动。
git status --short
git rev-parse HEAD
node --version
npm --version

# 依赖已按锁文件准备后，在仓库根运行。
npm test
npm run test:query-portfolio
npm run test:m3-knowledge-query
npm run test:m4-diagnosis
npm run test:m5-answer
npm run test:m6-cycle
npm run test:m7-strategy
npm run test:m8-conformance
npm run test:analytics-readonly
npm run check:docs
npm run validate:plugin

# Browser 项目已有专项入口。
node --test tests/browser-query-result.test.mjs tests/plugin-mcp-config.test.mjs
pnpm --dir plugins/geo-browser-extension test:browser-query
pnpm --dir plugins/geo-browser-extension test:extension

# 只读检查真实 Workspace，不为修测试修改其授权或业务对象。
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check

# 开发测试范围验证；运行前核对该 seed 的实际身份与版本。
GEO_M6_NETWORK_DISABLED=1 GEO_M7_NETWORK_DISABLED=1 \
  node plugins/geo-expert/scripts/geo-lifecycle.mjs validate \
  --workspace workspaces/myyshop-development-test
```

Browser 的 typecheck/lint/build 命令在该项目 package 中复核后运行，Record 记录真实命令、退出码和进程退出情况。新增知识驱动 E2E 的测试文件/命令须由 T00/T11 定义并注册；本文不编造一个已存在的 `demo:e2e` 命令。

新增证据包至少包含：基线 SHA、实际 dirty 范围、运行配置与 fixture hash、知识/Query/协议版本、两个周期对象图、原始页面/答案证据、生成报告与 Owner 审核包、独立反馈、模拟发布/read-back/两类复测记录、Analytics 质量报告、Review 与下一轮选择、失败恢复日志、实际命令/exit code、真实 Workspace 前后无污染检查。

HTTP fixture smoke 与离线业务 CLI 的网络权限分开：纯逻辑测试禁网；受控浏览器只能访问显式 loopback fixture 服务。不得为了演练关闭整个生产权限检查，或把本地服务访问权限扩大到真实平台。

## 10. 业务侧最低交付物

最终运行至少向 Owner 暴露这些可读工件，而不是只交内部对象：

| 工件 | 面向 Owner 的用途 |
| --- | --- |
| 知识目录与维护待办 | 哪些已知、待证实、到期、矛盾；如何补充与影响什么 |
| Query Portfolio 审核页 | 候选问题、来源、理由、意图、优先级与本轮选择 |
| 平台观察及答案分析报告 | 原始答案入口、品牌/事实/引用/遗漏分析及比较限制 |
| Content / Evidence Gap 报告 | 缺口证据、类型、解决路径和责任人 |
| Own / External 诊断与建议文档 | 目标资产、可控性、改稿/取证/沟通任务与接受标准 |
| 人工审核与发布反馈包 | 采用/修改/拒绝、实际发布凭证与待跟进项 |
| Technical / Platform Retest 报告 | 各自检查结果、固定协议对照、缺失和失败 |
| GA4 / GSC / 业务观察报告 | 取数范围、质量、信号和明确非因果边界 |
| Cycle Review 与下一周期建议 | Owner 决定、保留意见、下轮候选与优化反馈 |

所有报告链接到 canonical 对象和原始证据，重生成不改变事实。飞书同步仍是独立授权的只读镜像行为，不成为本次演练必要条件。[R01]

## 11. 可直接交给 Agent 的执行指令

> 以本 Handoff 为当前任务输入，先读取 AGENTS.md、docs/workflow.md、最新产品/Spec/Record，并比对当前 HEAD 与 dd7cc2187c962c84b45f46dd744e0fa9822a06b4。不要从零重建 M2—M8，不等待120条真实知识或100个Source。先收口“知识驱动的产品级模拟全流程”，再独立验证真实输入适配。
>
> 按 T00—T11 落定最小 SDD 差异、执行顺序和验收测试。保留现有合同测试，但新旅程必须从业务知识与原始外部 fixture 开始，实际生成 Query、答案分析、Gap、资产建议、审核包、发布反馈、双复测、Analytics、Cycle Review 和下一周期；禁止预填下游 gate 证明闭环。
>
> Owner 只维护知识与可读决定，不维护内部 plan/ID/hash。复用既有对象与工具，补统一反馈入口、真实提取/物化适配、scope-aware Lifecycle、精确实验矩阵和中断恢复。纠正 WorkBuddy 中国区契约过时说明，按当前官方合同独立验证，不冒充 native 完成。
>
> 在已有批准范围内持续实现、验证和修复；遇到确实需要 Owner 的新产品决定、事实批准、平台许可或真实操作授权，只阻塞相关步骤并交付最小审核包，继续完成不依赖该决定的工作。不能把 Handoff 自行标为批准。最终交付可审阅的两轮演练产物、命令/退出码、负例证据、逐入口能力矩阵及真实未验证项。未经当次明确授权，不 commit/push/PR，不操作真实账号、发布或部署。

## 12. 证据索引与核验方式

仓库证据均以固定 SHA 为基线；路径为仓库相对路径，行号仅对该 SHA 有效。本文没有把历史 Record 的本地 dirty checkout 状态外推为当前远端运行事实。

固定源码 URL 构造方式：

```text
https://github.com/sujingjun/geo-cowork/blob/dd7cc2187c962c84b45f46dd744e0fa9822a06b4/<repository-relative-path>
```

| ID | 已读取来源 | 支持的事实/边界 |
| --- | --- | --- |
| R01 | `AGENTS.md`；`docs/workflow.md` | 授权、状态、源码验证、文档要求、飞书镜像 |
| R02 | `README.md`；`CONTEXT.md`；`plugins/geo-expert/skills/geo-lifecycle/SKILL.md` | 架构边界、知识独立就绪、隔离、生命周期/术语 |
| R03 | `workspaces/myyshop/STATUS.md`；`workspaces/myyshop-development-test/STATUS.md` | 具名工作区状态文件记载；不是本次运行复验 |
| R04 | `docs/plans/2026-09-04-real-cycle-blocker-closure-plan.md` | proposed 真实双周期 roadmap、blocker registry |
| R05 | `plugins/geo-expert/scripts/query-portfolio.mjs`；`scripts/lib/query-portfolio.mjs`（后一路径相对 plugins/geo-expert，重点1–190、380–530） | 现有治理入口消费预置 query_text |
| R06 | `docs/records/2026-09-03-browser-query-task-mcp-automation-record.md` | Fake extractor、loopback验证、真实未执行、测试/lint/build历史失败 |
| R07 | `plugins/geo-expert/scripts/lib/browser-query-result.mjs`，175–270 | raw校验与fixture-only M5 materializer |
| R08 | `plugins/geo-expert/skills/geo-answer-cycle/SKILL.md` | manual/Browser流程、pending/ack、两槽、真实权限边界 |
| R09 | `plugins/geo-expert/scripts/lib/manual-review-batch.mjs` | core输入、固定candidate输出 |
| R10 | `workspaces/myyshop/knowledge/README.md`，1–260 | 120 legacy、九类知识目录、模板、状态语义 |
| R11 | `plugins/geo-expert/scripts/diagnosis.mjs` | 已有审计/研究/建议/采用/发布准备/技术复测入口 |
| R12 | `plugins/geo-expert/scripts/lib/cycle-gates.mjs` | 数量/状态门与Publication `.invalid` 硬编码 |
| R13 | `plugins/geo-expert/scripts/geo-lifecycle.mjs`，1–210；`scripts/lib/cycle-lifecycle.mjs`，165–335；`scripts/lib/cycle-trace.mjs`，175–310（后两路径相对 plugins/geo-expert） | create real分支、advance/Review test-only、snapshot写入顺序、decideReview存在 |
| R14 | `docs/records/2026-09-02-m7-cycle1-cycle2-independent-qa-record.md` | 历史synthetic双周期独立QA及边界 |
| R15 | `tests/m6-cycle-e2e.test.mjs`，1–295 | seed和materializeM6E2EGates先于Cycle推进的E2E结构 |
| R16 | `docs/records/2026-09-02-ga4-gsc-observation-materialization-record.md` | 7+7行真实只读历史验证、ANO/BSIG/candidate EVD、日期聚合限制 |
| R17 | `package.json` | 审计时根脚本入口与Node版本约束 |

官方能力核验时间：2026-09-15。以下来源证明外部工具/产品能力，不证明本仓已经实现或用户当前环境可用。

```text
W01 WorkBuddy 中国区开放平台：专家
https://open.workbuddy.cn/docs/expert
核验重点：基础结构、Agent定义、工具权限、MCP/连接器依赖。

W02 Playwright MCP：Connecting to Browsers
https://playwright.dev/mcp/configuration/browser-extension
核验重点：浏览器连接与扩展模式；不包含消费者平台许可结论。

W03 Google Search Central：Search Generative AI performance reports
https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
发布日期：2026-06-03；页面注记2026-08-31已全站点推出。

W04 Google Search Console API：Search Analytics query
https://developers.google.com/webmaster-tools/v1/searchanalytics/query
核验重点：公开type/dimensions/dataState合同；不可编造专用GenAI参数。
```

---

**最终交付原则：可以在真实知识尚未齐备时把产品基建做完；不能靠模拟知识把真实采集、真实发布、真实复测或业务效果“做成已完成”。**
