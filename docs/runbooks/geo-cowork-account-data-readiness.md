---
title: geo-cowork 账号与数据准备清单
status: proposed
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md
  - workspaces/myyshop/strategy/2026-08-27-content-evidence-gap-report.md
  - 2026-08-27 当前用户指令：提前准备后续里程碑所需账号与数据 Checklist
scope: 测试商户工程闭环、真实 MyyShop 内测启动和两个真实 GEO Cycle 的账号、权限、数据与授权准备
---

# geo-cowork 账号与数据准备清单

## 1. 先看结论

### 1.1 当前测试商户工程阶段

M6—M8 的合同、状态机、错误处理和双周期旅程优先使用 fixture。当前阶段：

- 不需要提供真实 GA4、GSC、CRM、CMS、消费者平台密码或 API Key；
- 不需要建立真实 MyyShop 商户；
- 不需要开放生产写权限；
- 可提前准备 Codex、Claude Code、WorkBuddy 的本机登录状态，供 M8 跨宿主验收；
- 可提前准备真实内测所需的账号角色、数据字典和脱敏导出方案，但在获得当次授权前不连接。

### 1.2 真实 MyyShop 内测阶段

优先使用“用户自主管理登录 + 最小只读权限 + OAuth/导出文件”。账号准备完成不等于授权某次访问；每次真实连接、采集、发布或写入仍需要独立决定。

## 2. 安全红线

以下内容不要发到聊天、Markdown、截图、Run artifact 或 Git：

- 密码、短信/邮箱验证码、恢复码；
- API Key、Client Secret、Access Token、Refresh Token、Session Token；
- Cookie、Local Storage、浏览器完整 Profile；
- 私钥、证书私钥、`.env` 值；
- 未脱敏用户姓名、邮箱、手机号、IP、订单、付款或账号数据；
- 包含账号头像、邮箱、历史会话或无关个人信息的完整页面 DOM/截图。

凭据应保留在原平台 OAuth、系统钥匙串、用户控制的浏览器登录态或经批准的 Vault 中。仓库只登记角色、权限范围、资源 ID、授权决定引用、有效期和撤销负责人。

## 3. 分阶段总表

| 阶段 | 必须准备 | 可选准备 | 暂时不要提供 |
| --- | --- | --- | --- |
| 测试商户 SDD/离线实现 | 无真实业务账号；独立 fixture Workspace | Codex/Claude Code/WorkBuddy 登录状态 | 任何业务凭据、真实个人数据 |
| M8 跨宿主工程验收 | Codex、Claude Code、WorkBuddy 可安装并本机登录 | GitHub 只读账号 | GitHub 写 Token、发布权限 |
| 真实 MyyShop 知识内测 | 内部材料只读/导出路径、事实 Owner/Approver | 文档系统只读账号 | 未批准材料和机密凭据 |
| M4 发布链内测 | 官网/CMS 只读账号、人工发布负责人 | 预发布环境账号 | 自动发布 Token、生产写权限 |
| M5 消费者答案测试 | 用户控制的 ChatGPT、Google、Perplexity、Claude 登录；逐平台授权表 | 单独测试账号 | 密码、Cookie、自动化绕过权限 |
| M6 Analytics | GA4 property Viewer + read-only OAuth；数据字典 | GSC、server logs、CRM 导出 | Analytics 编辑/管理权限 |
| 真实 Cycle Review | Baseline/Retest 时间窗、发布证明、业务事件口径 | 周度复测排期 | 未经确认的因果结论 |

## 4. 宿主与工程账号

| ID | 账号/环境 | 阶段 | 最低准备 | 需要记录 | 不需要提供 |
| --- | --- | --- | --- | --- | --- |
| ACCT-H01 | Codex Desktop/CLI | M8 | 本机可用、可安装本地插件 | 宿主版本、账号角色、插件目录、测试机器 | 登录 Token、ChatGPT Cookie |
| ACCT-H02 | Claude Code | M8 | 本机登录、可读取同一测试 Workspace | 版本、插件/Skill 安装位置、允许 Tool | API Key、Claude Cookie |
| ACCT-H03 | WorkBuddy 中国区 | M8 | 本机登录、可安装专家/Skill | 版本、账号区域、插件目录、能力限制 | 登录凭据、企业密钥 |
| ACCT-H04 | GitHub | 后续 Release | 只读即可；当前不是工程门 | 仓库 URL、账号角色、默认分支 | PAT、SSH 私钥、写权限 |

准备动作：

- [ ] 三个宿主分别能够打开，不要求现在安装新插件。
- [ ] 记录宿主版本、操作系统和插件安装根目录，不记录账号邮箱。
- [ ] 确认同一台机器还是多台机器；多机时记录环境差异。
- [ ] 明确谁负责安装、撤销和最终跨宿主验收。

## 5. 消费者平台账号

| ID | 平台入口 | 是否必须 | 最低准备 | 当前建议方式 |
| --- | --- | --- | --- | --- |
| ACCT-P01 | ChatGPT 消费者产品 | 真实 Cycle 必须 | 用户控制账号、稳定地区/语言、可新建独立会话 | 人工采集优先；自动化仍受 Terms/robots 门约束 |
| ACCT-P02 | Gemini | 真实 Cycle 必须 | 用户控制 Google 账号、稳定产品入口 | 人工采集优先 |
| ACCT-P03 | Google AI Mode/AI Overviews | 真实 Cycle 必须 | 可访问目标产品入口的 Google 账号/地区 | 按具体入口单独记录，不与 Gemini 混用 |
| ACCT-P04 | Perplexity | 真实 Cycle 必须 | 用户控制账号、稳定产品入口 | 人工采集或用户导出 |
| ACCT-P05 | Claude 消费者产品 | 真实 Cycle 必须 | 用户控制账号、稳定地区/语言 | 人工采集优先 |

每个平台提前填写一份 Collector Profile 准备表：

- [ ] platform / product entry；
- [ ] 账号由谁控制，只登记角色，不登记邮箱；
- [ ] region / language；
- [ ] free/paid plan；
- [ ] login state / conversation state / web search state；
- [ ] 可见 model/mode；
- [ ] browser/device/viewport；
- [ ] 允许人工采集还是允许浏览器辅助；
- [ ] 允许保存的 artifact：回答、Citation、局部截图、局部 DOM/导出；
- [ ] 脱敏方式、保留期、访问人、删除责任人；
- [ ] challenge、验证码、账号信息无法去除或条款冲突时的停止条件。

注意：账号存在不代表允许自动采集；平台 Terms、robots、challenge 和安全控制仍可阻塞执行。

## 6. GA4 账号与数据

### 6.1 账号权限

- 建议准备一个专用 Google 登录角色，在目标 GA4 Property 只授予 `Viewer`。
- Google 官方说明 `Viewer` 可以查看设置与数据，并通过 UI/API 查看共享资产；无需 `Editor` 或 `Administrator`。
- API/OAuth 只申请 `https://www.googleapis.com/auth/analytics.readonly`。
- 如果不希望暴露收入或成本，可评估附加 `No Revenue Metrics` / `No Cost Metrics`；是否可用取决于本轮目标指标。
- 官方参考：[GA4 访问与数据限制](https://support.google.com/analytics/answer/9305587)、[Google OAuth scopes](https://developers.google.com/identity/protocols/oauth2/scopes)。

### 6.2 提前记录，不记录凭据

| ID | 准备项 | 最低内容 |
| --- | --- | --- |
| DATA-A01 | GA4 Account/Property 定位 | Account 显示名、Property 显示名、Property ID；不写账号邮箱 |
| DATA-A02 | Property 基础口径 | timezone、currency、数据开始日期、环境范围 |
| DATA-A03 | Data Streams | web/app stream ID、域名/应用标识、生产/测试区分 |
| DATA-A04 | 关键事件 | 注册、激活、登录、关键服务动作、商业化事件的事件名与定义 |
| DATA-A05 | 来源识别 | source/medium、referrer、UTM、landing page 与 AI 来源归类规则 |
| DATA-A06 | Baseline | 建议准备发布前 4—8 周按天数据和查询口径 |
| DATA-A07 | 数据限制 | 是否允许看到 revenue/cost、用户级数据是否禁止、最小聚合粒度 |

### 6.3 最低验收问题

- [ ] 哪个 Property 才是 MyyShop 当前权威生产 Property？
- [ ] Web、iOS、Android 是否在同一 Property，如何分别过滤？
- [ ] `sign_up` 或注册事件是否统一，是否存在重复/跨端口径？
- [ ] AI 来源访问如何识别；未知 referrer 如何处理？
- [ ] 注册是否能关联 landing page/source，还是只能做趋势观察？
- [ ] 数据时区、延迟、回补和保留规则是什么？

## 7. GSC 账号与数据

### 7.1 账号权限

- GSC 是 P1，可在 GA4 跑通后接入。
- 优先准备 `Restricted user` 做只读验证；如果目标报告或 API 数据不足，再由 Owner 决定是否提升到 `Full user`。
- 不需要 `Owner`，除非必须进行站点所有权验证或用户管理；这些写/管理动作不属于 GEO 读取任务。
- API/OAuth 只申请 `https://www.googleapis.com/auth/webmasters.readonly`，不要申请 read/write scope。
- 官方参考：[Search Console 用户权限](https://support.google.com/webmasters/answer/7687615)、[Search Console API OAuth](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)。

### 7.2 提前记录

| ID | 准备项 | 最低内容 |
| --- | --- | --- |
| DATA-S01 | Property | Domain Property 或 URL-prefix Property 的精确标识 |
| DATA-S02 | Owner | verified owner 责任角色；不记录验证 Token |
| DATA-S03 | Sitemap | 当前 sitemap URL、提交状态、最近读取/错误 |
| DATA-S04 | Baseline | 发布前 4—8 周 Query/Page/Country/Device/Search appearance 数据 |
| DATA-S05 | 索引观察 | 目标页面索引状态、canonical、last crawl、rich result 状态 |
| DATA-S06 | 过滤口径 | 品牌词/非品牌词、语言、地区、页面组和时间窗 |

## 8. MyyShop 第一方业务数据

真实 MyyShop 内测优先使用经过业务负责人批准的脱敏文件导出，不要求直接数据库账号。

| ID | 数据包 | 最低字段 | 推荐粒度 | 主要用途 |
| --- | --- | --- | --- | --- |
| DATA-B01 | 注册趋势 | date、platform、region、registration_count、口径版本 | 日/周聚合 | 观察注册趋势 |
| DATA-B02 | 激活/活跃 | date、platform、event、user_count、事件定义 | 日/周聚合 | 观察生命周期信号 |
| DATA-B03 | AI 来源注册 | date、landing page、source/referrer group、registration_count | 日聚合 | 观察 AI 来源注册信号 |
| DATA-B04 | Creator 分层 | segment、region、platform、count、as_of | 聚合快照 | 支撑受众/生命周期 Scope |
| DATA-B05 | 产品使用 | capability、status、eligible_count、active_count、time_window | 聚合 | 支撑能力使用观察 |
| DATA-B06 | 案例/结果 | case_id、授权状态、时间窗、指标前后、口径、限制 | 单案例脱敏 | data/case Evidence 候选 |

必须同时提供：数据 Owner、提供人、统计逻辑、查询/报表定位、时间窗、as-of、刷新周期、排除项、去重规则、是否可作为 Evidence、下次复核日期。

禁止直接提供用户级明细；如确需用户级分析，必须另行完成数据授权、最小化和隔离决定。

## 9. Server access logs

Server logs 只作为 Observation。优先使用脱敏聚合导出或临时只读查询，不要求生产 SSH。

提前确认：

- [ ] 日志平台和数据 Owner；
- [ ] 可用时间范围和保留期；
- [ ] timestamp、host、path、status、referrer、user-agent、UTM 是否存在；
- [ ] IP 是否删除或不可逆匿名化；
- [ ] bot/internal/test traffic 排除规则；
- [ ] AI referrer/domain 的分类表和未知项处理；
- [ ] 时区、采样、CDN/代理层和多域名去重规则；
- [ ] 只允许查询/导出，不提供生产主机写权限。

## 10. CRM 与注册系统

优先准备“报告/导出角色”，不提供生产写账号。

| ID | 准备项 | 最低内容 |
| --- | --- | --- |
| ACCT-B01 | 报告账号或导出负责人 | 只读/导出范围、撤销人、有效期 |
| DATA-C01 | 线索/注册定义 | Creator/Brand/MCN lead、合格条件、状态机 |
| DATA-C02 | 来源字段 | first/last touch、UTM、referrer、landing page、unknown |
| DATA-C03 | 事件映射 | GA4 event 与 CRM 状态的映射及时间延迟 |
| DATA-C04 | 聚合输出 | 按时间、来源、地区、平台的脱敏计数 |

CRM 结果只能作为观察性关联；除非另有实验设计，不宣称某次内容变更严格造成注册或商业结果。

## 11. CMS、官网和发布账号

| ID | 角色 | 最低权限 | 用途 |
| --- | --- | --- | --- |
| ACCT-C01 | 内容查看者 | Read-only | Asset inventory、当前内容和版本核验 |
| ACCT-C02 | 内容准备者 | Draft-only，可选 | 把 approved Proposal 转成 CMS draft |
| ACCT-C03 | 人工发布者 | Publish，由业务持有 | 最终 Publication 决定和执行 |

准备动作：

- [ ] 区分生产、预发布和开发环境；
- [ ] 列出 Homepage、About、FAQ、产品页、帮助中心、Schema、llms、PR/社交等资产 Owner；
- [ ] 确认 draft/review/publish/rollback 的人工流程；
- [ ] 准备内容 ID、URL、版本、发布时间、发布者角色和回滚定位；
- [ ] 发布后保存精确 URL、局部 snapshot/checksum、发布时间和 Technical Retest 入口；
- [ ] 不向 Agent 提供生产自动发布 Token。

## 12. 内部材料与知识库数据

真实 MyyShop 商户启动前，按以下数据包准备原始材料或正式导出：

| ID | 数据包 | 负责人建议 |
| --- | --- | --- |
| DATA-K01 | 品牌实体、法定主体、官方域名与渠道 | 品牌 + 法务 |
| DATA-K02 | 当前定位、中英文合同、旧定位迁移 | 管理层 + 品牌 |
| DATA-K03 | 受众、生命周期、资格和地区矩阵 | Creator Growth + 运营 + 法务 |
| DATA-K04 | 产品/服务状态矩阵 | 产品负责人 |
| DATA-K05 | 费用、佣金、付款、归因、履约和申诉规则 | 财务 + 商业化 + 法务 |
| DATA-K06 | 隐私、授权、AI、知识产权和责任边界 | 隐私法务 + 安全 |
| DATA-K07 | 数据口径、结果、案例和第三方证明 | 数据 + 业务 + 法务 |
| DATA-K08 | 术语、禁用语、中英文和渠道规范 | 品牌 + 本地化 + 法务 |
| DATA-K09 | 官网/帮助中心/媒体/社交/合作伙伴资产清单 | 内容 + SEO/GEO + 公关 |

每份材料至少包含：名称、原始位置、Owner、Approver、版本、生效/失效日期、用户/地区/产品/渠道 Scope、限制与例外、对外使用权限。

## 13. 授权决定 Checklist

在任何真实连接或采集前，应有 Workspace 内可追溯决定，至少确认：

- [ ] 访问哪个系统和精确资源；
- [ ] 使用哪个角色，不记录具体账号凭据；
- [ ] 只读、导出、draft 还是 publish；
- [ ] 允许哪些字段和 artifact；
- [ ] 如何脱敏、存在哪里、谁可访问；
- [ ] 保留多久、谁负责删除；
- [ ] 允许的时间窗、地区和语言；
- [ ] 失败、challenge、隐私泄漏或条款冲突时如何停止；
- [ ] 是否允许进入 Evidence；
- [ ] 是否允许外部写入；默认 `否`；
- [ ] 授权到期和撤销方式。

## 14. 建议你现在先完成的准备

### P0：现在准备

- [ ] 指定账号/权限总负责人和数据总负责人。
- [ ] 确认 Codex、Claude Code、WorkBuddy 三个宿主是否都能本机登录。
- [ ] 准备一个专用 Google 登录角色，后续添加 GA4 Property `Viewer`。
- [ ] 确认权威 GA4 Property、timezone、data streams 和注册/激活事件名。
- [ ] 确认 GSC 权威 Property 与 verified owner，但暂不必提升当前用户权限。
- [ ] 准备 DATA-K01—K09 的 Owner/Approver 清单和材料位置。
- [ ] 准备 DATA-B01—B06 的字段字典和脱敏聚合导出方案。
- [ ] 指定 CMS 查看者、内容审核者、人工发布者三个独立角色。

### P1：工程闭环接近完成时准备

- [ ] 给专用 Google 角色授予 GA4 Property `Viewer`。
- [ ] 评估 GSC `Restricted user` 是否满足读取；不足再决定 `Full user`。
- [ ] 检查五个消费者产品账号的地区、语言、产品入口和人工采集可用性。
- [ ] 准备 CRM/server logs 的只读报告或脱敏导出方式。
- [ ] 确认真实内测 artifact 保留期、访问人和删除责任。

### P2：真实 MyyShop 内测启动时决定

- [ ] 批准精确的真实数据、系统和时间窗访问。
- [ ] 批准 Consumer Platform 人工采样和保留策略。
- [ ] 批准 GA4/GSC OAuth read-only 连接。
- [ ] 批准具体 Proposal 的 Adoption；Publication 另行决定。
- [ ] 确认两个真实 Cycle 的 Goal、Query Set、Knowledge Release 和 Review Owner。

## 15. 可填写的准备状态表

### 账号

| ID | 系统 | 负责人角色 | 环境/区域 | 当前权限 | 目标权限 | 状态 | 到期/复核 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 例：ACCT-A01 | GA4 | 数据负责人 | Production / Global | 未添加 | Property Viewer | 待准备 | YYYY-MM-DD | 不记录邮箱 |

### 数据

| ID | 数据包 | Owner | 原始位置 | 时间窗 | 脱敏状态 | 可否作为 Evidence | 状态 | 剩余项 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 例：DATA-B01 | 注册趋势 | 数据负责人 | 内部报表定位 | YYYY-MM-DD—YYYY-MM-DD | 聚合 | 待审批 | 待准备 | 事件口径 |

## 16. 完成判定

这份 Checklist 完成只说明“账号、权限和数据准备就绪”。它不代表：

- 已授权 Agent 实际登录或读取；
- 数据已成为 approved Evidence；
- 内容已被业务批准；
- Proposal 已采用或发布；
- GA4/GSC/CRM 已连接；
- GEO、注册或商业效果已经发生；
- 两个真实 MyyShop Cycle 或 v1 发布完成。
