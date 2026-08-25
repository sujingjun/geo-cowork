---
title: M5 Consumer Answer Testing 与持续信源体系 PRD
status: proposed
created: 2026-08-24
updated: 2026-08-25
source:
  - docs/requirements/2026-08-24-m5-consumer-answer-testing.md
  - "2026-08-25 当前用户指令：持续维护信源体系，不做冷启动导入；完整设计 Playwright 与真实采集"
scope: M5 用户流程、Playwright/真实采样、持续信源维护、五层角色、指标、人工门与业务验收
---

# M5 Consumer Answer Testing 与持续信源体系 PRD

## 1. 为什么做

M3 定义 MyyShop 允许表达什么，M4 诊断站内外 Asset。M5 要建立独立的消费者端反馈：不同平台在固定 Query 下实际如何回答、引用哪些来源、来源是否支持对应 Claim，以及如何把多轮真实 Citation 持续沉淀为可复核的 Source registry。

如果 raw、Review 和聚合混在一起，Rubric 更新会改写历史；如果平台上下文和失败样本不保留，Baseline 与 Retest 不可比较；如果预填外部域名榜，就会把他人统计误写成本项目观察。M5 的候选信源只从获授权消费者平台的真实 Citation 中产生。

## 2. 核心用户

v1 核心用户是 MyyShop 当前研发负责人。该用户选择冻结 Query Set，协调平台采集授权、隐私决定和关键样本复核，并决定某次 Run 是探索、Baseline 还是具备 M4 Publication 前置的 Retest。

GEO 专家负责准备候选 Profile、执行获授权的采样、复核新来源身份/角色、解释 Evidence 和提出 Review；确定性 Tool 负责不可变落盘、状态/refs 校验、Source 匹配、域名规范化和聚合。Agent 不批准隐私策略、不伪造消费者界面样本，也不把 Citation 当成事实支持结论。

## 3. 用户流程

### 3.1 冻结采样输入

1. 用户选择 approved Goal、frozen Query Set、published/ready Knowledge Release 的精确版本。
2. 用户为每个平台选择一个 Collector Profile，明确入口、地区、语言、登录/会话/搜索状态、可见模型/模式、设备/浏览器和时间窗。
3. 任一不可控制字段记录 `unknown`；存在关键 `unknown` 时后续比较最高只能为 `partial`。
4. 系统生成每个平台 × 每条 Query × 三个 ordinal 的固定 sample slot，不在运行中静默增删。

### 3.2 授权与启动

离线 Fixture 可在获批的 M5 实现任务中运行；真实平台 Run 必须先检查逐平台授权矩阵：允许的产品入口、账号/登录态、自动化方式、采集字段、最小化/脱敏、保留期、访问控制、停止条件和允许写入范围。

缺少授权时 Run 保持 `blocked`，不得打开平台、登录、下载浏览器或用 API 替代。验证码、challenge、封禁风险、条款冲突或无法去除账号信息时停止受影响平台，其他平台不能替它补造样本。

真实自动采集使用 Playwright base：每个 slot 创建隔离 browser context，按冻结入口和 Profile 设置 locale/viewport，使用版本化 selector 识别回答终态，截取答案/Citation 区域并在写入前最小化账号信息。平台 adapter 只负责导航、提交、等待、Citation 提取与失败诊断；不得改变 Query、自动重试平台观察结果或执行消息、点赞、评论、表单等外部写入。

### 3.3 三次独立采样

每个 sample slot 使用新的会话上下文提交同一冻结 Query 模板。一次 slot 的业务终态为：

```text
success | refusal | timeout | no_result | challenge | cancelled | system_failure
```

前五类都是平台/采集观察结果；`system_failure` 表示工具或环境没有形成可评价平台结果。任何状态都必须落盘；只有明确允许的系统级重试可继续，并保留所有 attempt artifact。

### 3.4 raw 与 Review 分离

采集完成后先创建不可变 Answer Sample，再独立创建：

1. Citation Observation：引用出现位置、原始/规范化 URL、域名和 Source ref；
2. Source registry：匹配已有域名/发布者/频道/页面身份，或从首次 Citation 创建新 Source；
3. Source Classification：绑定 Source 的五层主/副标签与依据；
4. Claim Support Review：Citation 是否支持某个 Claim；
5. Answer Review：实体、核心事实、当前定位、风险、Citation 质量和探索字段；
6. Answer Aggregation：只对锁定的样本和 Review 版本计算指标。

Rubric 或分类规则更新时创建新对象，不改 raw。关键、低置信度、证据矛盾或影响 Cycle 结论的判断进入人工复核。

### 3.5 Baseline、探索与 Retest

- `exploratory`：可用于发现问题，不能进入正式趋势；采样数可少于三次但必须显式标注。
- `baseline`：具备批准采集授权且每个平台 × Query 固定三个 sample slot；无需假装已发生 M4 Publication。
- `post_change_retest`：除上述条件外，必须引用 confirmed M4 Publication 和对应 Technical Retest Run；否则拒绝使用该标签。

### 3.6 持续维护信源

每次 Run 完成后，系统把 Citation 匹配到现有 Source。首次出现的身份创建 Source 和 candidate Classification；低置信度、平台托管主体不明或关键指标受影响时进入人工队列。后续 Run 只追加 Observation，并派生首次/最近出现、平台、Query Cluster、窗口和出现次数，不回写历史。

外部综合榜、静态域名表或历史排名不进入导入流程，也不能预生成 Source/Classification。没有真实 Citation 的域名不属于 M5 候选信源。

## 4. 五层信源与 Claim 支撑

Source Classification 先按具体页面、作者/机构与内容形态判断，再记录域名辅助信息：

| 主类型 | 判定要点 | 不能自动推出 |
| --- | --- | --- |
| 官方事实源 | 品牌控制的官网、产品文档、帮助中心、GitHub 或白皮书 | 独立可信、效果成立 |
| 制度权威源 | 政府、监管、标准、大学、论文或专业机构 | 自动适用于任意行业或 Claim Scope |
| 独立专业源 | 无品牌控制关系的行业媒体、分析机构、垂直媒体或评测 | 一定正确、一定支持当前 Claim |
| 社区经验源 | 可定位的用户、社区、论坛或口碑表达 | 代表总体用户或因果结论 |
| 内容传播源 | 视频、短视频、图片、播客或新闻中的解释、体验与传播 | 一定独立；可同时有官方/社区/专业副标签 |

分类与 Claim 支撑是两个决定。一个制度权威来源仍可能不支持当前 Claim；一个第一方页面可能准确支持品牌事实，但不构成独立验证。

## 5. 指标展示

所有指标按 `industry + platform + query_cluster + time_window` 展示，不形成统一 GEO 总分：

- Top Citation Domains：当前样本中实际出现的头部引用域名；
- Citation Share：域名占去重 Citation 单元的比例；
- Source Diversity：来源类型覆盖数、规范化类型熵和域名数量；
- First-party vs Third-party Ratio：品牌第一方与非品牌第一方的计数、占比和比值；
- Source Volatility：与前一可比时间窗的域名份额变化。

同时展示样本总数、各终态数、无 Citation 样本数、new/returning Source 数、candidate/reviewed/unresolved 分类数和 comparability。分母不足或不可比较时显示 `null + reason`，不补零。

产品不提供外部域名榜或静态清单导入。所有指标、候选和维护视图只读取当前 Workspace 的真实 Citation Observation。

## 6. 可比性业务规则

- `true`：关键 Profile、Query/模板版本、采样协议、三个 slot 和 Review/分类规则均一致，且没有关键 `unknown`。
- `partial`：仍可解释方向，但采集方式、可见模型/模式、设备或其他变量存在已记录的未知/差异。
- `false`：产品入口、平台、地区、语言、登录/搜索状态、Query/模板版本、正式/探索协议或样本集合发生硬差异。

系统必须展示逐字段 comparability notes；用户不能手工把硬差异覆盖为 `true`。

## 7. 业务规则

1. 正式样本只认消费者 UI；API 只能进入独立探索数据集。
2. 三个 sample slot 是三个独立观察，不把一次回答复制或重试成三次。
3. 同一回答重复相同规范化 URL 的 Citation 在 raw 中全部保留，聚合时每个 sample + URL 只计一个 Citation 单元。
4. 无 Citation 的回答保留并计入 `no_citation_sample_count`；Citation Share 分母为零时不计算份额。
5. Source Type 允许多标签，但主标签唯一；主标签未人工/规则确定时进入 `unknown`，不得强行归类。
6. YouTube、Reddit、LinkedIn 等宿主域名不能自动决定 Source Type；必须结合发布者、频道和页面身份。
7. Source 的 `active` 只表示 registry 身份可用，不表示权威、Evidence approved 或 Claim supported。
8. Review 必须绑定 sample checksum 与 rubric checksum；二者漂移时拒绝聚合。
9. Baseline 不要求 M4 已发布；`post_change_retest` 必须有 M4 Publication 与 Technical Retest 前置。
10. M5 结果是平台 Observation，不自动成为 Claim Evidence、M4 Gap、M6 业务效果或因果结论。

## 8. 业务验收

### 8.1 离线工程验收

- 本地录制 Fixture 可跑通 Profile → 三个 sample slot → Citation → Source 匹配/候选 → 分类 → Claim 支撑 → Review → 聚合；
- success/refusal/timeout/no_result/challenge/system_failure 均可复验且不丢失；
- 同一 raw 可被两个 Rubric 独立 Review，旧字节与 checksum 不变；
- 五项指标的分子、分母、排序、零分母和跨窗不可比较场景有确定性测试；
- 新来源、重复来源、宿主域名/发布者分离、candidate→reviewed、未解析身份和禁止榜单导入有确定性测试；
- crash/stale lock/重复启动/取消/supersede 不覆盖 artifact、不重复已完成外部动作；
- M2–M4 和 120 条 legacy 回归不变。

### 8.2 真实业务验收门

真实 Baseline Record 必须逐平台证明：授权仍有效、消费者 UI 入口正确、三个独立样本完整、Profile 和隐私最小化可审阅、失败没有被替换、Review/聚合可追溯。未满足的平台保持 blocked，不影响其他平台事实，但不能被称为全平台 Baseline 完成。

## 9. 非目标与当前边界

本 PRD 完整定义 Playwright 与真实采集产品流程，但不批准代码实现、依赖安装、浏览器下载、消费者平台登录/采样、GA4/GSC、外部写入、发布、部署或业务效果判断。文档保持 `proposed`；本次 Owner 授权只覆盖文档 commit 与本地合入 `main`。
