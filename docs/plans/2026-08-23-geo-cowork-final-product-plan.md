# geo-cowork 最终产品方案：MyyShop 本地 GEO 研究与运营专家

- 状态：approved
- 日期：2026-08-23
- 更新：2026-08-25，Owner 明确 M5 必须完整设计 Playwright 与真实消费者平台采集；持续信源体系只由真实 Citation Observation 维护，不做冷启动榜单导入
- 来源：2026-08-23 苏格拉底式产品澄清、GitHub 开源研究与 Owner 批准；2026-08-25 Owner 信源与采集边界决定
- 适用范围：里程碑 M2—M8、MyyShop 两个真实 GEO Cycle、本地跨宿主 GEO 专家 v1
- 目标仓库：`sujingjun/geo-cowork`
- 试点品牌：MyyShop
- 产品阶段：本地优先 v1
- v1 完成门：完成 2 个真实 GEO Cycle
- 技术原则：Node.js 主体，Python Tool 可插拔；Markdown-first；不以云端控制面、数据库、MCP 或多 Agent 数量作为产品成立前提

---

## 1. 产品定义

`geo-cowork` 是 MyyShop 的本地 GEO 研究与运营专家。

它的核心不是“批量抓 Prompt、补文章、自动发文”，而是围绕品牌认知目标持续完成：

```text
生成式平台观察
→ Query Portfolio
→ 品牌知识与 Claim / Evidence
→ Content Gap / Evidence Gap
→ Own / External Asset 诊断
→ 站内外建议文档
→ 人工审核与发布
→ Technical Retest
→ 消费者端生成式平台正式复测
→ GA4 / GSC / 服务端业务观察
→ GEO Cycle Review
→ 下一周期
```

### 1.1 核心用户

v1 只有一个核心用户：MyyShop 当前研发负责人。

第一阶段由该用户完成知识收集、人工审核协调、GEO Cycle 运行、建议稿采用、人工发布确认和最终 Cycle Review。

### 1.2 产品北极星

不是“品牌多被 AI 提到一次”，而是：

> 让生成式平台对 MyyShop 的定义、比较、引用逐步与经过业务批准的品牌知识一致，并持续观察这种认知变化是否伴随 AI 来源访问、注册等业务信号。

### 1.3 非目标

v1 不建设：

- 云端多租户 GEO SaaS；
- 自动 CMS 发布、自动 Git PR、自动媒体投放；
- 自动社区运营、批量评论或伪造用户口碑；
- 统一“GEO 100 分”；
- 以 Agent 数量作为产品能力；
- MyyShop 达人共创产品本身；
- 强依赖数据库、队列、LangGraph、MCP Server 或云端 API 的运行时。

---

## 2. MyyShop 第一版品牌认知基线

### 2.1 三层战略结构

```text
品牌总定位
MyyShop 是面向全球达人的全生命周期服务容器

当前阶段战略
优先建设面向中小网红的共创商业容器

长期生态愿景
形成中小网红 Skill 共生、互补和商业化的“热带雨林”
```

三者必须分别标记“当前定位 / 阶段战略 / 长期愿景”，不能被模型混写成全部已经实现。

### 2.2 当前对外主叙事

> MyyShop 正在从达人流量变现平台升级为面向全球达人的全生命周期服务容器，目前已提供画像报告、品牌商单和 MyyFinds，并在探索课程、数字代言人、社交涨粉等成长能力或工具。

### 2.3 关键风险提示

系统必须显式提示但不代替人工决策：

- 不应把“全生命周期”描述为全部服务已经上线；
- 不应把课程、数字代言人、社交涨粉等探索能力描述为正式上线；
- 不应保证商单、涨粉或收入结果；
- 不应把 MyyShop 描述为 MCN；
- 不应继续仅描述为联盟营销或流量变现平台。

v1 不把这些风险做成业务硬阻断；系统负责暴露风险，最终由人工决定。

---

## 3. 核心业务模型

### 3.1 核心认知目标（Core Perception Goal）

GEO Cycle 的业务最小单位不是单条 Query，而是一个“要改变或建立什么品牌认知”的目标。

首轮目标从：

```text
让生成式平台正确回答“What is MyyShop / MyyShop 是什么”
```

开始。

一个 Cycle 可以并行多个 Core Perception Goal，但每个 Goal 的 Query Set、基线、诊断和结论独立。

### 3.2 Query Portfolio

Query 生命周期：

```text
candidate
→ 去重 / 聚类 / 意图识别
→ 关联 Core Perception Goal
→ 记录来源 / 优先级 / 覆盖
→ 人工批准 formal query
→ Cycle 启动时冻结 Query Set Version
```

Cycle 内不得静默增删正式 Query；新发现 Query 进入下一版本。

来源优先级：

```text
生成式平台观察（发现入口）
> MyyShop 第一方用户数据
> 真实社区表达
> 竞品材料
```

生成式平台回答是 Observation，不是企业事实 Evidence。

### 3.3 双层知识权威

```text
完整业务文档
→ 负责战略原因、完整语境、叙事和业务审批载体

原子 Claim
→ 负责机器调用、Query 回答、资产生成、诊断与一致性检查
```

两者必须绑定同一版本并做一致性校验。

知识生成允许双向：

```text
Approved Document → Claim / Evidence / Answer Card
Approved Claim Set → About / FAQ / PR 等建议稿
```

### 3.4 Claim 生命周期

```text
candidate
→ evidence_ready
→ reviewed
→ approved
→ published
→ stale / deprecated
```

`published` 表示进入正式 Knowledge Release，而不是已经发布到官网或媒体。

### 3.5 Claim 风险分级

由确定性规则初判 + 人工确认：

- 普通事实；
- 能力事实；
- 效果主张；
- 比较 / 优势主张；
- 高风险商业承诺。

风险等级决定“建议证据充分性”和措辞风险，但 v1 最终仍由人工决定是否采用。

### 3.6 Evidence Sufficiency

按 Claim 类型建议最低证据：

```text
普通事实
→ 1 个已批准第一方来源

能力 / 效果主张
→ 第一方事实 + 数据或真实案例

推荐性 / 优势主张
→ 第一方事实 + 用户或独立第三方证据

高风险商业承诺
→ 正式规则 + 明确 Scope + 业务负责人批准
```

### 3.7 Source 与 Evidence

v1 采用轻量两层模型：

```text
Source
= 来源主体或渠道

Evidence
= 从 Source 取得的具体可定位证据
```

不在第一版设计复杂的 Source Trust Score。

MyyShop 第一方业务数据作为 Evidence 时必须形成不可变 Evidence Snapshot，并记录：指标、值、业务口径、时间窗口、as-of 时间、来源系统、提供人、Claim refs、captured_at、next_review。

Evidence stale 只产生复核提示，不自动让 Approved Claim / Knowledge Release 失效。

---

## 4. GEO 诊断模型

主线固定使用三类 Gap。

### 4.1 Content Gap

```text
品牌真实能力存在
+ Evidence 足以支撑当前表达
+ Own / External Asset 没有说明清楚、缺失或不一致
= Content Gap
```

典型行动：页面、FAQ、PR、社媒资料、llms.txt、结构化数据等建议稿。

### 4.2 Evidence Gap

```text
品牌真实能力存在
+ 已存在 Claim
+ 缺真实案例 / 数据 / 用户反馈 / 独立来源等足够支撑
= Evidence Gap
```

Evidence Gap 必须输出完整 Evidence Plan：要证明哪个 Claim、当前为什么不足、需要哪类证据、最低合格要求、从哪里获取、谁提供、是否需要第三方印证、如何验收、获得后部署到哪些 Asset、用哪些 Query 复测。

### 4.3 Product Gap

```text
用户稳定关注某项能力
+ MyyShop 尚未提供或现有能力不足以支撑相关主张
= Product Gap
```

Product Gap 不自动变成内容任务。人工可以选择进入独立战略发现分支。

---

## 5. 战略发现分支

战略发现不是 GEO 主线的必经步骤，独立为 `geo-strategy-discovery` Skill，并且只允许人工主动调用。

### 5.1 触发条件

Skill 首先检查：

1. 多个相关 Query 或多个生成式平台反复出现同一判断维度；
2. 第一方用户数据或真实社区表达证明用户确实关心；
3. 能观察到该因素实际影响品牌比较、推荐或排除；
4. 仅靠 Content Gap / Evidence Gap 修复不足以解决。

### 5.2 决策维度生命周期

仅在战略分支使用：

```text
candidate
→ validated
→ decision_factor
```

### 5.3 战略输出

```text
Decision Model
→ 品牌 / 竞品能力与证据映射
→ Product Gap / 候选推荐理由
→ 机会分析
→ PRD
→ 人工实验验证方案
```

`geo-cowork` 不实现具体达人产品。

---

## 6. Asset 模型与内容生成

### 6.1 两类 Asset

```text
Own Asset
= MyyShop 可直接控制的官网、FAQ、Schema、llms、官方 PR、官方社媒等

External Asset
= 媒体、合作伙伴、第三方评测、社区和用户内容
```

处理方式：

- Own Asset → 生成完整建议稿；
- 官方可控站外资产 → 生成完整建议稿；
- 合作伙伴 / 媒体 → 生成修正 Brief / Pitch；
- 社区 / 用户内容 → 研究记录 + 回复建议稿；
- 不自动发布。

### 6.2 首轮权威资产结构

同一 Knowledge Release 派生：About Us（权威品牌正文）、Homepage（简明定义 + 核心能力 + About 链接）、FAQ、Organization Schema、llms.txt / llms-full.txt、Answer Cards。

### 6.3 内容生成契约

```text
Query
→ 定义必须回答什么

Claim + Evidence
→ 定义允许说什么、风险在哪里、可说多强

Asset
→ 定义在哪个载体中怎么组织
```

最终交付始终是 Asset 级完整建议稿。

即使 Claim 未批准或 Evidence 不足，v1 仍允许生成完整建议稿，但风险段落必须带 risk_level、risk_type、claim_refs、evidence_status、风险原因、建议弱化表达。不得用模型推测填补缺失事实。

### 6.4 多 Goal 共用 Asset

目标层独立诊断，Asset 层统一生成，并保留 Goal → Query → Claim → 建议项追溯。

人工 Adoption Record v1 做到建议项级：`accepted | modified | rejected`。

---

## 7. 正式平台答案测试协议

### 7.1 核心平台

ChatGPT、Gemini、Perplexity、Google AI Overviews、Claude。

### 7.2 采样策略

探索性研究可单次采样，不进入正式趋势。

正式 Baseline / Retest：每个平台 × 每条 Query 独立采样 3 次。

### 7.3 Collector Profile

每个平台维护版本化 Collector Profile：platform、product_entry、region、language、login_state、conversation_state、web_search_state、model / mode（能获取时）、query_template_version、sampling_count、time_window、device / browser（适用时）。无法控制变量记录 `unknown`。

比较结果：`comparable: true | partial | false`，并记录 comparability_notes。

### 7.4 采集入口

正式样本只认消费者产品界面：Playwright / 浏览器自动化辅助；自动化不稳定则人工采集；API 第一版不进入正式采样体系。

M5 必须设计 Playwright collector base 与 ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews、Claude 逐平台 adapter：每次采样隔离 browser context，只访问获授权入口，使用版本化 selector/终态，保存完整回答与 Citation raw，最小化帐号信息，并对 timeout、refusal、no result、challenge 与 selector drift 显式失败。依赖安装、浏览器下载和逐平台真实运行仍是独立授权门。

### 7.5 Answer Sample Evidence

每个样本保存 Query、完整回答、Citation URL + 对应位置、UI 截图、Collector Profile、capture time、login / web search 状态、success / refusal / timeout / no_result、manual / browser_automation、HTML / DOM / 页面导出（能获取则保存，否则 `unavailable`）。

Raw sample 与 Review 分离，后续 Rubric 更新可以重评历史数据。

### 7.6 持续信源体系

每个真实 Citation Observation 必须匹配或创建可追溯 Source identity，再独立建立 Source Classification 与 Claim Support Review。Source registry 持续保留 domain/publisher/channel/page 身份、first/last seen、观测次数、平台、Query Cluster 和时间窗；宿主域名不等于发布者或信源类型。

五层角色为：官方事实源、制度权威源、独立专业源、社区经验源、内容传播源。分类可有副标签但只有一个主标签，`first_party | third_party | unknown` 与五层角色分开记录。分析链为 Query → Platform → Intent → Citation Domain → Source Identity → Source Type → Claim Supported。

指标按行业、平台、Query Cluster 和时间窗计算 Top Citation Domains、Citation Share、Source Diversity、First-party vs Third-party Ratio 与 Source Volatility。候选 Source 只能由当前 Workspace 内获授权真实 Run 的 Citation Observation 发现；产品不建立外部综合榜、静态域名表或历史排名的冷启动 import 合同、命令或候选生成路径。

### 7.7 正式 Review Rubric

正式回归：实体识别、核心事实正确、当前定位正确、风险 / 红线命中、Citation 质量及是否支撑对应 Claim。

探索性字段：比较维度、推荐理由、排除理由、竞品出现方式、来源结构、新的判断维度候选。探索字段不直接计入正式回归结果。

### 7.8 Evaluation

确定性项目自动；语义项目由 GEO 专家初评；冲突、低置信度、关键风险、证据矛盾或直接影响 Cycle 结论的关键样本才要求人工确认。

3 次样本保留 pass / partial / fail、brand_mention、official_citation、legacy_positioning、citation_source_distribution、stability。Perception Goal 最终由人工综合判断 `achieved | partial | not_achieved`，v1 不设置数学阈值。

---

## 8. Technical Retest 与观察窗口

人工标记建议已实际发布后，立即 Technical Retest；随后每周 Platform Retest。默认观察 4 周；结果仍明显波动或信号不足可延长到 8 周，并记录原因。延长不是“等到结果变好”。

---

## 9. Analytics 与业务观察

### 9.1 v1 优先级

- P0：GA4 直接连接；
- P1：GSC 接入成本足够低则一起加入；
- MyyShop 第一方业务数据：v1 可以人工输入 / 文件导入。

### 9.2 数据角色

GA4、GSC、Server access logs 是 Observation；MyyShop 第一方业务数据可以在明确口径后成为 Evidence Snapshot。

核心业务观察：AI 来源访问、AI 来源注册事件、注册趋势、搜索曝光 / Query / 索引变化、服务端 AI referrer / access signal。

这些属于观察性归因，不宣称单一内容变更产生严格因果。

---

## 10. GEO Cycle

### 10.1 Cycle 单位

一个 Cycle 可并行多个 Core Perception Goal，每个 Goal 绑定独立 Query Set，但可共享 Knowledge Release、Evidence、Asset。

### 10.2 核心版本冻结

Cycle 启动锁定 Knowledge Release Version、Query Set Version、关键 Asset Version、Collector Profile Version。Evidence 允许在 Cycle 中新增，但 Baseline / Retest 必须记录实际 Evidence Version。

### 10.3 结果指标

不使用统一 GEO 总分。

每 Goal 独立展示确定性建设指标：Knowledge Coverage、Evidence Coverage、Technical Readiness、Query Coverage、Asset Consistency。这些指标只观察，不做数值硬门。

真实结果多维展示：Answer Rubric、平台覆盖、Citation 变化、旧定位残留、GA4 AI visits / registration signals。

### 10.4 v1.0 完成门

必须完成 2 个真实 GEO Cycle。

Cycle 1：品牌认知冷启动，第一入口“What is MyyShop”。

Cycle 2：不预设目标；从 Cycle 1 Review 中选择高价值新 Query Cluster、最大 Content Gap、最大 Evidence Gap、最稳定严重错误认知或值得验证的推荐理由。第二个 Cycle 用来证明方法可复用。

---

## 11. Skill 架构

上层业务流程 Skills：`geo-lifecycle`、`geo-knowledge-cycle`、`geo-diagnosis-cycle`、`geo-answer-cycle`、`geo-strategy-discovery`。

下层专业 Skills：`geo-query`、`geo-knowledge`、`geo-evidence`、`geo-site`、`geo-reputation`、`geo-competitor`、`geo-answer`、`geo-content`、`geo-analytics`。

上层只负责编排、阶段上下文、人工决策点、Run 汇总，不复制专业规则。

---

## 12. Agent 架构

默认只有一个 GEO 主专家。专业 Agent 不是固定团队，也不拥有业务规则。

只有满足以下条件，主专家才提出委派：大量独立来源会污染主上下文、可以真实并行、需要多轮搜索/归纳/反证、需要独立立场对抗审查、工作量超过普通 Skill Run。主专家必须先给出建议 Agent、原因、输入范围、允许 Tool/Data、预期输出、Cycle/Goal 关系，由人工确认后创建。

候选专业 Agent：Query Research Agent、Evidence Research Agent、Platform / Competitor Research Agent、Adversarial Reviewer。

---

## 13. Tool / Connector 架构

Layer 1 确定性本地 Tool：Markdown / Frontmatter 解析、Object Contract 校验、indexes 构建、refs 校验、diff / compare、site technical checks、evidence manifest / SHA、Run / Cycle history compare。

Layer 2 研究型 Tool：Web Search、page fetch、browser、community / media / competitor research、consumer generative product collection。

Layer 3 业务连接器：GA4、GSC、MyyShop data、其他社媒 / CMS（未来）。

Node.js 是核心运行时。Python Tool 可使用，但必须通过稳定 IO 契约接入，不得拥有 Workspace 业务状态，不得复制 Claim / Evidence / Finding 规则。

---

## 14. Run / History Contract

每个专业 Skill 都是独立 Run。

Run Status：

```text
pending
→ running
→ waiting_human / blocked
→ completed | failed | cancelled | superseded
```

业务结果必须独立表示，`completed` 不等于 GEO 结果“好”。

每次 Run 记录 run_id、skill/version、Cycle/Goal、input refs、status、completed steps、output artifacts、Finding/Evidence/Asset refs、failure reason、next action。

如果恢复时关键输入版本已变化：旧 Run → superseded → 保留历史 → 创建新 Run → 使用最新输入重跑。

所有 Run 原始工件不可覆盖；Query / Claim / Evidence / Finding / Asset 使用稳定业务 ID。

可自动更新的确定性 Finding：HTTP、canonical、robots、sitemap、Schema 语法、title/meta/heading presence、crawlability、Approved Claim 在 Own Asset 之间的明确字段/版本不一致。

需要人工确认的语义 Finding：定位表达是否清晰、Evidence 是否充分、来源是否可信、竞品优势、decision factor、recommendation reason、Product Gap / strategic opportunity。

---

## 15. Workspace 目标结构

```text
workspaces/myyshop/
├── README.md
├── STATUS.md
├── workspace.json
├── knowledge/
│   ├── documents/
│   ├── claims/
│   ├── releases/
│   └── answer-cards/
├── queries/
│   ├── candidates/
│   ├── formal/
│   └── sets/
├── evidence/
│   ├── sources/
│   ├── records/
│   ├── snapshots/
│   └── plans/
├── assets/
│   ├── own/
│   └── external/
├── indexes/
│   ├── queries.json
│   ├── claims.json
│   ├── evidence.json
│   ├── findings.json
│   ├── assets.json
│   └── runs.json
├── cycles/
│   └── <cycle-id>/
│       ├── cycle.md
│       ├── goals/
│       ├── baselines/
│       ├── findings/
│       ├── proposals/
│       ├── retests/
│       ├── reviews/
│       └── run-refs/
└── runs/
    └── <run-id>/
        ├── run.md
        ├── raw/
        └── outputs/
```

现有 MyyShop 120 条知识不要做无价值批量改名；通过迁移脚本 / 索引兼容逐步纳入。

---

## 16. Markdown Object Contract

所有 Markdown 共享公共 Frontmatter：

```yaml
id: <stable-id>
record_type: <query|claim|evidence|finding|asset|run|cycle|...>
status: <type-specific-status>
version: <object-version>
created_at: <datetime>
updated_at: <datetime>
```

类型扩展字段按 Claim / Evidence / Finding / Run 各自职责定义。Markdown 是权威，`indexes/*.json` 是从 Markdown 可重建的只读机器索引，不得反向覆盖 Markdown。

---

## 17. GitHub 开源研究吸收方案

评估维度：功能契合度、License、活跃度、可维护性、可阅读性、可扩展性、本地优先适配性、依赖复杂度、与 geo-cowork 重叠度、测试成熟度、规范一致性。

### 17.1 直接复用

**`jonschlinkert/gray-matter`**：Markdown Frontmatter 解析。小而成熟、MIT、API 简单，与 Markdown-first 高度一致。直接作为核心小依赖。

**`ajv-validator/ajv`**：机器契约 / JSON Schema 校验。MIT、支持 JSON Schema 2020-12、长期维护。直接复用。

**`microsoft/playwright`**：正式消费者平台 Collector 的浏览器底层。Apache-2.0、TypeScript、可固定 browser context、抓截图、DOM / HTML，比 LLM 驱动浏览器更可复现。直接复用。

**`googleanalytics/google-analytics-mcp`**：GA4 P0 业务观察连接器。Google Analytics 官方组织、Apache-2.0、read-only scope、支持 Admin / Data / realtime / funnel report。优先集成；GA4 数据保持 Observation。

### 17.2 改造复用

**`sujingjun/ops-geo`**：吸收 raw evidence snapshot、evidence manifest、SHA、observed/inferred/unverifiable/blocked、Finding evidence refs、detector/rubric version、legacy score non-comparable、candidate fix、readiness 与 business effect 分离。拒绝综合 GEO 100 分、推测性平台就绪分、绝对爬虫因果和“修复即效果”。改造成 `geo-site` 确定性证据 Tool。

**`apify/crawlee`**：Apache-2.0、TypeScript、Playwright/raw HTTP/Cheerio 统一，适合 Own / External Asset 多页面抓取和可靠队列。如果 M4 实际需要多页队列、重试、限速再引入，不在 M2 提前增加复杂度。

**`harlan-zw/unlighthouse`**：可选整站 Lighthouse / CWV 技术数据源；输出只进入 Technical Observation，不成为 GEO 总分。

**`saurabhsharma2u/search-console-mcp`**：MIT、TypeScript、GSC/Bing/GA4 查询完整，但属社区项目且同时暴露写 Tool。条件集成：pin 版本 + tool allowlist，只开放 read-only；不满足维护/权限要求时回退 GSC 手工导入。

### 17.3 借鉴领域模型 / 工作流

**`ai-search-guru/getcito...`**：借 Prompt Run/raw output 分离、Citation 独立记录、brand/competitor mention 派生、provider/model/web-search/locale 元数据、同 Prompt 多 Run；不采用 PostgreSQL + pg-boss 全栈、API 正式采集和 silent degradation。

**`promptfoo/promptfoo`**：借 evaluation matrix、test case/assertion、raw result 与 evaluator 分离、本地可重复评估、side-by-side report。正式采样仍必须消费者 UI。后续可评估其作为离线 Answer Review / 回归断言引擎。

**`stanford-oval/storm`**：借 perspective-guided questioning、pre-writing research、多视角问题发现、human steering、dynamic mind map；映射 `geo-query` 和 `geo-strategy-discovery`，不直接嵌入整个 Python/DSPy pipeline。

**`assafelovic/gpt-researcher`**：借 planner → research questions、execution agents 并行收集、source tracking、filter/aggregate；映射人工批准的 Professional Research Agent，不让多 Agent 成为默认架构。

**`Future-House/paper-qa`**：借 retrieve → evidence scoring → re-rank → grounded answer、metadata-aware evidence、contradiction detection；映射 `geo-evidence`，不搬科学 RAG 栈。

**`cxcscmu/AutoGEO`**：借“从生成式引擎样本中提取偏好规则、engine/domain specificity、策略随领域重新验证”；映射战略发现 Decision Model。不采用自动改写网页为主线、API 代替消费者 UI、单一 visibility 分数。

**`deepseek-ai/deepseek-harness`**：借 capability seam、typed Tool IO、append-only durable event、“model-visible input 可重建”、unsupported capability fail loud、scoped Tool/Agent capability；映射 Run immutable artifacts、Tool Contract、Professional Agent allowlist。项目仍处 developer preview 且明确 breaking changes，不直接作为 v1 Harness。

### 17.4 参考但不采用主架构

**`yaojingang/GEORank`**：有价值在 GEO 工作台产品分类，但 Next/FastAPI/Celery/Postgres/Redis/Qdrant/Neo4j/MinIO 过重，与 Markdown-first 冲突，且偏关键词/内容工具箱，不采用主架构。

**`firecrawl/firecrawl`**：AGPL-3.0、系统依赖重；当前 Playwright/Crawlee 足够，不内嵌。未来可作为外部 provider。

**`browser-use/browser-use`**：不作为正式 Answer Collector；LLM 驱动浏览器不利于严格可比，Playwright 更合适。可未来用于探索研究。

**`humanlayer/humanlayer`**：当前偏 coding agent，License 元数据不清晰；human decision points 用本地 Markdown 状态即可，不复用代码。

---

## 18. 最终技术架构

```text
Host
Codex / Claude Code / WorkBuddy
        │
        ▼
Primary GEO Expert
        │
        ├── Business Workflow Skills
        ├── Professional Skills
        ├── Deterministic Node Tools
        ├── Python / External Tools
        └── Workspace (Markdown = source of truth)
```

关键原则：Host owns Agent loop；geo-cowork owns GEO domain rules；Tool owns deterministic execution；Workspace owns durable business facts。不要再造第四套 Agent runtime。

---

## 19. 重新编排后的里程碑

历史 M0 / M1 保留为已完成基础，不重新实施。

### M2 — Contract & Provenance Kernel

目标：建立所有后续能力共用的本地事实和运行契约。

交付：Markdown Object Contract；Query/Claim/Evidence/Source/Finding/Asset/Run/Cycle 模板；gray-matter parser；AJV validation；build-index；refs validator；Run lifecycle/supersede；immutable run artifacts；ops-geo v2 evidence manifest 适配；legacy audit migration fixture。

验收：Markdown 可构建 indexes；indexes 删除后可重建；invalid refs/duplicate IDs/frontmatter 明确失败；old Run 不覆盖；输入版本变化 supersede old Run；旧 MyyShop audit 可迁移到新 Finding/Evidence 语义而不声称效果。

### M3 — Knowledge & Query Operating System

目标：跑通“完整文档 → Claims / Evidence → Knowledge Release → Query Set”。

交付：`geo-knowledge-cycle`；`geo-query` / `geo-knowledge` / `geo-evidence`；document → atomic Claim/Answer Card；Claim risk suggestion；Evidence Sufficiency suggestion；Evidence Plan；Source/Evidence registry；Knowledge Release；Query Candidate/Formal/Query Set Version；MyyShop “What is MyyShop” KR v1。

验收：可从批准文档提取可审查 Claims；KR 锁定 Claim Version；Query Set 冻结；可追溯 Query → Claim → Evidence → Answer Card；现有 120 条知识兼容索引，不强制批量改写。

### M4 — Diagnosis, Site & Asset Proposal

目标：把知识转换成真实 Content / Evidence Gap 与站内外建议。

交付：`geo-diagnosis-cycle`；`geo-site`；`geo-reputation`；`geo-competitor`；`geo-content`；ops-geo evidence-aware audit；Own/External Asset registry；Content/Evidence/Product Gap；Evidence Plan；multi-goal Asset merge；recommendation-item adoption record；Technical Retest。

可选：Crawlee 多页采集；Unlighthouse 技术数据。

验收：每 Finding 有 Query/Claim/Evidence/Asset refs；确定性 Technical Finding 可自动复验；Semantic Finding 仅提出结论；同一 About 只生成一份合并建议稿；风险段落显式标注；人工标记 published 后可立即 Technical Retest。

### M5 — Consumer Answer Testing

目标：建立真实消费者产品入口的可复现 Baseline / Retest，并建立只由真实 Citation Observation 驱动的持续信源体系。

交付：Collector Profile；Playwright collector base；ChatGPT/Gemini/Perplexity/Google AI Mode/AI Overviews/Claude collectors；real `collect` 与 manual fallback；Answer Sample Evidence package；Citation-driven Source registry 与五层 Classification；Claim Support Review；core/exploratory Review；3-run aggregation；comparability；长任务恢复；逐平台授权/隐私矩阵；`geo-answer-cycle`。

验收：正式样本来自消费者 UI；API 样本不混入；每 Query×Platform 3 次独立保留；raw answer/citation/screenshot/profile 与 review 分离；timeout/refusal/no-result/challenge/selector drift 不静默丢弃；同一 raw sample 可重评；Citation → Source identity → Classification → Claim Support 全链可追溯；五项信源指标可按行业/平台/Query Cluster/时间窗重算；系统无外部榜单冷启动导入路径。

### M6 — Analytics + Real GEO Cycle 1

目标：把 MyyShop 第一个认知目标真实跑完。

交付：Google Analytics 官方 MCP read-only；AI visits/registration observation；可选 GSC read-only；Cycle 1 Baseline；Content/Evidence Plan；Asset 建议与人工 Adoption；publication checkbox；Technical Retest；Week1–4 Platform Retest；必要时 Week8；Cycle Review。

一级成功：整条链真实运行，至少出现真实 AI-source visit 或 registration signal；不要求短期显著增长。

### M7 — Strategy Branch + Real GEO Cycle 2

目标：证明方法可复用，并把深层推荐理由研究限制在独立分支。

交付：`geo-strategy-discovery`；strategic trigger check；decision dimension lifecycle；Product Gap/opportunity analysis；PRD/validation plan；Cycle1→Cycle2 goal selection；完整 Cycle2。

验收：Cycle2 Goal 来自 Cycle1 真实结果；主线不调用 strategy Skill 也能完整运行；strategic output 不自动变 Approved Claim；完成第二个真实周期并形成完整观察结论。

### M8 — Cross-host Conformance & v1.0

目标：把真实验证过的方法稳定发布为本地 GEO 专家。

交付：Codex/Claude Code conformance；WorkBuddy 中国区专家配置；Professional Agent delegation contract；Tool capability matrix；security/redact；sample workspace；two-cycle retrospective；v1 release record；cloud-readiness export。

验收：三宿主共用 Workspace/Skills；相同确定性输入产生相同 index/Finding/validation；不依赖原聊天可继续；两个真实 GEO Cycle 完成；云端化需求有真实证据。

---

## 20. v1 建议的直接依赖

Node Runtime：`gray-matter`、`ajv`、`playwright`。

条件依赖：`crawlee`（多页抓取真正需要时再引入）。

Python / external：`ops-geo` adapted scripts、`analytics-mcp`。

外部条件连接器：`search-console-mcp`。

第一版明确不新增 LangGraph、LangChain mandatory runtime、PostgreSQL、Redis、Qdrant、Neo4j、Celery、pg-boss、Firecrawl embedded server、DeepSeek Harness runtime。它们不是永远不用，而是当前没有足够的本地业务问题证明值得增加维护成本。

---

## 21. 最终判断

`geo-cowork` 应当从“本地 GEO Skills 集合”升级为：

> **以 Markdown 品牌知识与 Evidence 为事实中心，以 Query 和核心认知目标组织工作，以消费者端生成式平台真实样本作为反馈，以 Content Gap / Evidence Gap 为主诊断，并把 Product Gap / 推荐理由研究隔离到人工触发战略分支的 MyyShop 本地 GEO 研究与运营专家。**

与市场常见 GEO 工具的差异不应是“多几个 Agent”或“多几个平台”，而是：

1. 品牌事实有治理和版本；
2. 内容缺口和证据缺口严格分开；
3. 正式效果用真实消费者 UI、固定 Query Set、可比 Collector Profile 和多次样本复测；
4. 深层“为什么 AI 会推荐这个品牌”被作为可验证的战略研究，而不是从几次模型回答直接推导品牌战略。

这四点才是 v1 应当被两个真实 MyyShop GEO Cycle 证明的产品价值。
