# M5 两次采样、100 Source 批量分类与当前定位决定

- 决定人：MyyShop Owner（本会话用户）
- 决定时间：2026-08-26
- 决定引用：`workspace://cycles/preparation/decisions/2026-08-26-m5-two-slot-source-batch-and-positioning-approved.md`
- 适用范围：M5 正式人工 Baseline、Source 归档/分类门、首期语言合同和 Answer Review 当前定位基线

## 1. Source 归档与批量分类

1. 所有由 M5 Citation Observation 发现或复用的 Source 先进入 `archived_unclassified`。
2. 当前阶段不创建新的有效 Source Classification；既有 candidate Classification 保留审计历史并转为 `superseded`，不进入当前指标口径。
3. 阈值按当前 Workspace 中被非 superseded M5 Citation 引用的唯一 `source_ref` 计数；不按 Citation occurrence、URL 变体或域名数量计数。
4. 唯一 Source 达到 100 个后，统一进入 `batch_ready`，再建立独立分类 Task；该 Task 仍需人工审阅五层类型、主体关系和 Claim Support。

## 2. 正式采样与语言合同

1. 每个平台、每条正式 Query 固定两个独立 Sample slot，ordinal 为 `1`、`2`。
2. 两个 slot 必须由两个独立会话/结果产生；不得复制同一回答，不得用成功结果替换拒答、超时、无结果或 challenge。
3. 首期正式主线为英文 `en-US`，统一 Query：`What is MyyShop?`。
4. 中文 `zh-CN` 首期可选，只作辅助采集；同一业务对象必须绑定本决定中的中英语义合同。中英文分别聚合，语言差异不能被判为完全可比。
5. 五个平台第 1 槽由 Owner 使用 Chrome 插件/现有浏览器生成并提供 exact result URL；Agent 只读取结果正文和 Citation，不自动提交 Query，不保存账号标识、cookie、storage、历史或完整 DOM。

## 3. 当前定位中文合同

MyyShop 是面向全球内容创作者的达人服务平台，正在从以达人商业化为主的服务，扩展为覆盖达人加入、成长、活跃与商业化的更完整服务体系。

当前对外可保留的能力类别包括品牌合作机会、MyyFinds 及达人侧工具与服务。具体功能、开放状态、地区、资格、费用和结算规则，应以对应官方页面和最新业务确认信息为准。

MyyShop 正在探索 AI 辅助分析、推荐与匹配，以及课程、数字代言人和达人协作增长等能力；这些属于持续建设或规划中的方向，不代表全部已经上线，也不保证达人收入、涨粉或商业结果。

## 4. English semantic equivalent

MyyShop is a creator services platform for content creators worldwide. It is expanding from services centered on creator monetization toward a more complete service system covering creator onboarding, growth, engagement, and monetization.

Current externally supportable capability categories include brand collaboration opportunities, MyyFinds, and creator-facing tools and services. Specific features, availability, regions, eligibility, fees, and settlement rules are subject to the relevant official pages and the latest business-confirmed information.

MyyShop is exploring AI-assisted analysis, recommendations, and matching, as well as courses, digital spokespersons, and creator-collaboration growth capabilities. These are under ongoing development or planning; they do not mean all capabilities are live, and they do not guarantee creator income, follower growth, or commercial outcomes.

本英文文本只用于 M5 同对象语义核对与 Answer Review；不代表已在官网或其他外部渠道发布。

## 5. 第 1 槽结果 URL

| platform | exact result URL | Query |
| --- | --- | --- |
| Gemini | <https://gemini.google.com/app/d9268cd1f0666ca6> | `What is MyyShop?` |
| Google AI | <https://share.google/aimode/XBcz8OzqjKI0wbL75> | `What is MyyShop?` |
| Perplexity | <https://www.perplexity.ai/search/f0d54976-ff47-48df-9c5b-fc46dd4e308b> | `What is MyyShop?` |
| ChatGPT | <https://chatgpt.com/share/6a8ec472-a10c-83e9-95db-1029298cba9d> | `What is MyyShop?` |
| Claude | <https://claude.ai/share/67fe4c86-1b1c-46f0-a967-790c6b7b0d00> | `What is MyyShop?` |

## 6. 授权与非目标

- 已授权：读取上述 exact result URL；保存脱敏完整回答、Citation URL、Source registry、Profile、Run、Sample 与本决定；本地保留 365 天。
- 未授权：自动提交第二次 Query、读取账号凭据或历史、保存账号 chrome/完整 DOM、外部写入、发布、部署、commit、push 或 PR。
- 第 2 槽必须由 Owner 另行进行独立人工采集并提供结果；在此之前各平台 Run 保持 `waiting_human`。
- 当前定位是 M5 评估合同，不自动把现有业务知识库全部升级为已批准、证据充分或已外部发布。
