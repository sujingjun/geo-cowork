---
title: M5 Consumer Answer Testing 与持续信源体系原始需求
status: approved
created: 2026-08-24
updated: 2026-08-26
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
  - docs/records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md
  - "2026-08-24 当前用户指令：独立评审 M2–M4；通过时只制定 M5 proposed 工件，不实现、不采集消费者平台"
  - "2026-08-25 当前用户指令：持续维护信源体系，不需要冷启动导入；M5 必须设计 Playwright 与真实采集；文档合入 main，不进入实现"
  - "2026-08-25 当前用户指令：批准 M5 里程碑方案设计，并实施计划，完成目标"
  - "2026-08-25 当前用户指令：Playwright 使用最新版并全局安装；五个平台统一授权 Owner Google 登录身份，按真实用户隐私，本地 artifact 保留 1 年"
  - "2026-08-26 当前用户指令：信源统一归档未分类，累计 100 个 Source 后批量分类；每平台改为两次独立人工采样；英文为主、中文可选且同对象语义一致；确认当前 MyyShop 定位并提供五个平台首轮结果 URL"
scope: M5 正式消费者产品答案 Baseline/Retest、持续信源体系、Playwright collector 与真实采集设计
---

# M5 Consumer Answer Testing 与持续信源体系原始需求

## 1. 业务诉求

MyyShop 研发负责人需要在真实消费者产品入口中，对冻结 Query Set 做可复现、可比较且可重新评审的答案采样。系统必须保留平台上下文、完整回答、Citation、截图和失败状态，并把原始样本、持续信源登记、信源分类、Claim 支撑判断、答案 Review 与聚合指标分开，避免把某次回答、API 输出或外部域名榜误写成正式趋势。

M5 必须完整设计并分段实现离线合同、长任务恢复、聚合计算、Playwright collector base、逐平台 adapter、人工 fallback 和真实 Baseline/Retest。真实 ChatGPT、Gemini、Perplexity、Google AI Mode/AI Overviews、Claude 或其他消费者平台采集，必须在 M5 SDD 获批后，再按平台取得单独授权；当前文档任务不安装 Playwright、不下载浏览器、不登录或采样任何消费者平台。

持续信源体系只从获授权消费者平台 Run 的 Citation Observation 中发现、登记和复核候选来源。M5 不设计外部综合榜、静态域名表或历史排名的冷启动导入对象、命令或候选生成路径。

## 2. 可继承输入与当前缺口

### 2.1 可继承输入

- M2 已提供 Markdown Object Contract、refs/index、Run 生命周期、input fingerprint、create-only artifact、checksum、安全路径和 legacy compatibility。
- M3 已提供 approved Goal、formal Query、frozen Query Set、published/ready 内部 Knowledge Release、Claim/Answer Card 精确版本和关系 trace。
- M4 已提供 Evidence/Finding/Asset、研究 Source 范围、人工 Gap/Adoption/Publication 门和 Technical Retest 分层。
- MyyShop 当前 Query trace 为 `lifecycle_ready:true`、`gates:[]`；两条 `EVIDENCE_INSUFFICIENT` 与 11 条 `INDEPENDENT_SUPPORT_MISSING` warning 均保留。
- M4 的 11 个公开站点 snapshot 是站点与第一方研究输入，不是消费者平台答案样本，也不是已发布改动。

### 2.2 当前缺口

1. 仓库没有 M5 canonical 对象、Schema、Collector Profile、Answer Sample、Citation、持续信源登记或聚合合同。
2. M2 Run 只验证了同步本地任务；浏览器长任务的 checkpoint、lease、stale lock、人工接管和跨进程恢复尚未定义。
3. 当前每个 stable ID 只解析一个 canonical 当前版本；同一 raw sample 的重评、跨时间窗比较和 profile 漂移需要不可变 revision 方案。
4. `package.json` 没有 Playwright，浏览器二进制、平台 adapter、选择器策略和三宿主范围均未批准。
5. 当前没有任何消费者平台账号、隐私、截图/DOM 保留或采集授权。
6. M4 没有 confirmed Publication 或真实 Technical Retest，因此当前只能规划未来 Baseline；不能把后续采样称为发布后 Retest。

## 3. 五层信源角色模型

M5 必须按被引用页面及其内容生产主体分类，不允许仅凭域名综合排名自动决定类别：

| 信源层 | 合同值 | 证明职责 |
| --- | --- | --- |
| 官方事实源 | `official_fact` | 品牌官网、产品文档、帮助中心、GitHub 与官方白皮书建立产品事实与实体基础 |
| 制度权威源 | `institutional_authority` | 政府、监管、标准、大学、论文或专业机构建立高可信事实 |
| 独立专业源 | `independent_professional` | 行业媒体、分析机构、垂直媒体与评测网站提供第三方验证、比较和推荐 |
| 社区经验 | `community_experience` | 实际用户如何使用、比较及描述优缺点 |
| 内容传播源 | `content_distribution` | 视频、短视频、图片、播客和新闻承担场景解释、使用体验与热点传播 |

五层表示来源在当前 Citation 中承担的角色，不是通用权威等级。一个来源可有多个标签，但必须有且只有一个主标签供聚合使用，并保留分类依据、置信度和人工复核状态。品牌第一方与第三方的划分以“是否由被评估品牌控制”为准，不以宿主域名推断；YouTube、Reddit、LinkedIn 等先作为平台或域名，再按具体发布者、频道和页面分类。

## 4. 必须支持的动作

### 4.1 Collector Profile 与正式采样

- 版本化冻结 platform、product entry、region、language、login state、conversation state、web search state、可见 model/mode、Query template version、sampling count、time window、device/browser 和 `unknown`。
- 正式样本只来自消费者 UI；API、搜索摘要、第三方转述与探索性样本必须分开。
- 每个平台 × 每条 formal Query 固定两个独立 sample slot；每个 slot 使用新会话上下文，保留成功、拒答、超时、无结果、challenge、取消和系统失败。
- 英文 `en-US` 是首期正式主线；中文 `zh-CN` 只作为可选辅助采样。同一品牌对象的中英文 Query 必须绑定同一语义合同，分别保存、分别聚合，不把语言差异伪装为平台变化。
- 自动化不稳定时允许人工 fallback，但必须记录采集方式；人工与自动采样不能静默视为完全可比。
- Playwright base 必须设计隔离 browser context、入口 allowlist、版本化 selector、终态识别、答案区域截图/DOM 最小化、timeout/challenge 停门、artifact checksum 与显式失败；平台 adapter 只处理平台差异，不决定采样语义。

### 4.2 不可变 Answer Sample

- 每个采集尝试保存完整回答、Citation URL 与位置、截图、Collector Profile、采集时间、终态、采集方式，以及可取得的 DOM/HTML/导出。
- raw answer、截图、DOM/HTML 和采集日志写入 create-only Run artifact，并记录 SHA-256；已落盘 raw 不得被 Review 或重试覆盖。
- 登录凭据、cookie、token、local storage、账号邮箱、头像和与答案无关的个人信息不得进入 artifact；无法安全最小化时相应 artifact 标为 `unavailable` 并记录原因。

### 4.3 分层分析链

最小可追溯链固定为：

```text
Query → Platform → Intent → Citation Domain → Source Identity → Source Type → Claim Supported
```

- Citation Observation 保存每次引用出现的位置、规范化 URL、域名和 `source_ref`；同一回答中的重复引用不从 raw 中删除。
- M5 复用 M2 `Source` registry 持久化域名、发布者、频道或页面身份；新 Source 必须引用首次真实 Citation Observation，不能由榜单或人工域名清单预填。
- Source Classification 独立于 Citation Observation，并绑定 `source_ref`。当前阶段新发现 Source 只进入 `archived_unclassified` 队列；当 Workspace 中被 M5 Citation 引用的唯一 Source 达到 100 个后，才启动统一批量分类 Task。
- Claim Support Review 独立判断某 Citation 是否支持具体 Claim；来源类别不能代替支撑判断。
- Answer Review 绑定 raw sample checksum 与 rubric version；Rubric 更新时创建新 Review，不回写 Sample。

### 4.4 持续信源维护

- 每次获授权 Run 将 Citation 匹配到既有 Source；无法匹配时，以可审计 identity key 创建新 Source。采集阶段不创建或自动推进 Source Classification。
- 100 条阈值按当前 Workspace 中被非 superseded M5 Citation 引用的唯一 `source_ref` 计数，不按 Citation occurrence、URL 变体或域名数量计数。
- 系统从不可变 Observation 派生 first seen、last seen、出现平台、Query Cluster、时间窗、observation count，以及 new/returning/unresolved/reviewed 状态；不得回写旧 Observation。
- `Source.status:active/stale/deprecated` 只表示 registry 生命周期，不表示可信、已批准或支持 Claim；分类和 Claim Support 分别复核。
- 外部综合榜、静态域名表和历史排名不导入 Workspace，不生成 Source、Classification、Citation 或聚合输入。

### 4.5 指标与比较

每个聚合必须锁定 industry、platform、Query Cluster、time window、Query/Sample/Profile/Classification/Review 精确引用，并计算：

- Top Citation Domains；
- Citation Share；
- Source Diversity；
- First-party vs Third-party Ratio；
- Source Volatility。

聚合还必须展示 new/returning Source 数、candidate/reviewed/unresolved classification 数和 classification coverage。所有 Source 与指标必须来自实际 Citation Observation；系统不提供外部榜单导入入口。

### 4.6 长任务恢复

- 固定 sample slot 与 completed step；每步完成后可恢复，不重复已完成外部动作。
- 区分平台回答终态与系统执行失败；timeout/refusal/no_result 不是被丢弃的异常。
- stale lock、重复启动、人工取消、输入版本变化和进程中断必须有收敛规则与故障注入测试。
- Profile、Query、模板、Rubric 或 Tool policy 的关键输入变化时旧 Run 保留并 supersede，新 Run 使用新 ID。

## 5. 成功标准

1. M5 Requirement、PRD、Architecture、Spec 0006、Plan 和 Task 职责分离，并由 Owner 明确批准进入本地离线实现。
2. 合成 `.invalid`/本地录制 Fixture 可证明 Profile、Sample、Citation、分类、Claim 支撑、Review 和聚合 Schema 的正常/非法/边界行为。
3. 两个 sample slot 全部保留；拒答、超时和无结果进入聚合的状态计数，不被成功重试覆盖或删除。
4. 同一 raw sample 可由新 Rubric 产生独立 Review，raw checksum 和旧 Review 字节不变。
5. Source 归档、唯一 Source 计数、100 条阈值、批量分类准备状态、无 Citation、重复引用和 Claim 粒度规则可确定性复验；五层分类在阈值达到后的独立 Task 验收。
6. 五项指标在行业、平台、Query Cluster 和时间窗维度有明确分子、分母、排序和不可计算条件。
7. comparability 的 `true/partial/false` 由冻结字段决定；`unknown` 不作为通配符。
8. crash、timeout、stale lock、重复启动、取消和 supersede 的本地故障测试证明 Run 收敛且 artifact 不覆盖。
9. Playwright base 与真实平台 adapter 的输入、状态机、输出、隐私、失败和恢复已在 Spec/Architecture 完整设计；package 安装和 browser 下载仍是两个独立人工门。
10. 真实平台采集前存在逐平台授权、隐私最小化、保留期、访问控制和停止条件决定；缺任一项即阻塞运行。
11. 外部榜单/域名表没有 import Schema、CLI 或候选生成路径；候选来源只能追溯到真实 Citation Observation。
12. M2–M4 专项、全量、插件、Workspace/Knowledge/Diagnosis、trace、index/legacy 与文档链接回归保持通过。

## 6. 约束

- Markdown 是 canonical 业务事实；indexes 只读且可重建；raw Run artifacts create-only。
- Node.js 继续是确定性内核；不新增数据库、队列或第四套 Agent Runtime。
- Host/人工负责语义分类与 Claim 支撑判断；Tool 只校验、采集显式目标和计算确定性指标。阈值未达到前不得为了补齐指标提前分类。
- 不把 API 样本、探索性样本或平台 Observation 当企业事实 Evidence。
- 不从少量回答、Citation 变化或域名排名推导因果、产品战略或业务效果。
- 本次授权 M5 SDD、T02—T08、本机全局 `playwright@1.62.1`、五个平台 Owner-controlled Google 登录角色、隐私最小化与本地 artifact 365 天保留；不保存账号标识或凭据。平台 Terms/robots 禁止或未明确允许的真实 UI 自动采集继续 blocked；不下载新浏览器、不写外部业务系统、不 commit、push、PR、release 或 deploy。

## 7. 非目标

- 新 browser binary 下载或真实消费者平台 Baseline；
- M4 Evidence/Gap/Proposal/Adoption/Publication/Technical Retest 的人工补写；
- M6 GA4/GSC、真实 GEO Cycle 1 或因果归因；
- M7 战略发现、自动社区运营或产品 PRD；
- 综合 GEO 总分、外部域名榜导入或预填候选信源。

## 8. 待人工决定

- 五个平台在官方 Terms/robots 下能否取得自动采集书面许可；
- Owner 在用户控制浏览器中完成登录后的实际登录态、地区、语言、模型/模式与人工 fallback 可用性；
- 五个平台第 2 个独立英文 Sample 的具体采集时间与结果 URL；在第二槽完成前各平台 Baseline 保持 `waiting_human`。
- 何时具备 M4 Publication 后 Retest 资格。
