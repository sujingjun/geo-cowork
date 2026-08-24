---
title: M4 Diagnosis, Site & Asset Proposal 原始需求
status: approved
created: 2026-08-24
source:
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/records/2026-08-24-m3-business-object-approval-record.md
  - docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md
  - "2026-08-24 当前用户指令：批准 M4 Requirement、PRD、Architecture、Spec 0005、Plan 和 Task，进入实现；真实 MyyShop 采集仍不授权，完成后制定 M2–M4 里程碑整体优化 Handoff"
scope: M4 诊断、站点与研究输入、Gap 分类、Asset 建议、采用/发布证明、技术复测及整体优化交接
---

# M4 Diagnosis, Site & Asset Proposal 原始需求

## 1. 业务诉求

MyyShop 研发负责人需要把 M3 已批准的 Goal、Query Set、Knowledge Release、Claim、Evidence 和 Answer Card，转换为可追溯的诊断与 Asset 级完整建议稿。系统必须区分确定性技术观察、语义 Gap 提案、人工采用、实际发布和 Technical Retest，不能把代码存在、建议生成或人工采用误写成页面已发布或 GEO 效果成立。

M4 首先完成离线工程纵切：使用 `.invalid` 或本地合成 Fixture 验证 Schema、Tool、Skills、Run 和恢复规则。任何 MyyShop 真实站点、账号、GA4/GSC、消费者生成式平台、社区、媒体、竞争对手或外部系统采集，仍需按目标和数据源取得当次明确授权。

## 2. 已验证输入与当前缺口

### 2.1 可继承输入

- M2 提供 Markdown Object Contract、Source/Evidence/Finding/Asset/Run、refs、checksum、不可覆盖 artifact、index 与 legacy ops-geo 迁移语义。
- M3 提供 approved Goal、formal Query、frozen Query Set、published Knowledge Release、Claim/Answer Card 精确版本、Evidence Sufficiency warning 与 Evidence Plan。
- MyyShop 当前 M3 trace 为 `lifecycle_ready:true`，但两条 Claim 仍保留 `EVIDENCE_INSUFFICIENT`；内部采用决定没有补造 first-party/data/case Evidence。
- 120 条 legacy knowledge 保持原始字节，15 个 indexes 可确定性重建。

### 2.2 当前缺口

1. M2 Finding/Asset 只有公共最小字段，没有 M4 Gap、站点检测、Asset 角色和重测关系。
2. Content Gap、Evidence Gap、Product Gap 尚无可校验输入、反例、冲突和人工确认边界。
3. HTTP、canonical、robots、sitemap、Schema 语法、title/meta/heading presence 与 crawlability 尚无 M4 确定性工具。
4. Source 可访问性、原文是否取得、独立支持、Evidence 与置信度尚未分开记录。
5. Asset 级完整建议稿、建议项采用、实际发布证明与 Technical Retest 尚无独立对象和门禁。
6. 多 Goal 共用同一 Asset 时，尚无“只生成一份合并建议稿”与冲突失败规则。
7. M2/M3 在 M4 使用中暴露的不合理项尚无统一观察记录和后续整体优化入口。

## 3. 必须支持的动作

### 3.1 Finding、Asset 与 Gap

- 复用 M2 Finding、Asset 与 Evidence，不引入综合 GEO 分。
- 所有 M4 Finding 均保留 Query、Claim、Evidence、Asset 的可解析关系；blocked/unverifiable 的 Evidence 只能证明采集失败或不可验证，不能冒充原文或业务事实。
- Content/Evidence/Product Gap 分别记录支持 Evidence、反证、未解决冲突、规则版本、提案原因和人工决定状态。
- 确定性技术 Finding 可以自动创建或复测；语义 Gap 只能进入人工确认，不自动成为业务结论。

### 3.2 `geo-site` 确定性诊断

- 从显式、带 checksum 的本地采集 manifest 读取 HTTP、headers、HTML/text、robots、sitemap 与 Schema snapshot。
- 输出稳定检测码、规则版本、item state、Evidence 与 Finding refs。
- 缺输入、登录、403、challenge、timeout 或无原文时明确返回 blocked/unverifiable；不以推测补全。
- 当前里程碑不内置真实网络抓取；Crawlee、Playwright、Unlighthouse 或外网采集均需另行批准。

### 3.3 研究输入

- `geo-reputation` 与 `geo-competitor` 分别记录 Source、访问结果、原文快照、Evidence、独立支持、置信度与反证。
- 不从单次生成式平台回答、搜索摘要、登录墙或 challenge 推导竞品优势、推荐理由或 Product Gap。
- 不自动发帖、评论、联络媒体、联系合作伙伴或写入外部系统。

### 3.4 Asset 级建议与人工门

- 同一批准 Knowledge Release 可派生 About、Homepage、FAQ、Organization Schema、llms 文件、Answer Card 或站外 Brief/Pitch/回复建议。
- 每个建议项保留 Goal、Query、Finding、Claim、Evidence 和目标 Asset 关系。
- Claim 未批准或 Evidence 不足时仍可形成完整建议稿，但相应段落必须给出风险类型、原因和弱化表达；不得推测缺失事实。
- 同一 Asset 的多 Goal 输入只产生一份合并建议稿；无法确定性合并时失败并等待人工决定。
- 建议稿、`accepted/modified/rejected` 采用决定、实际发布证明与 Technical Retest 必须为四个独立阶段。

### 3.5 里程碑观察与后续优化

- M4 实施期间发现的 M2/M3 不合理项只记录实际证据、影响、是否阻塞 M4 和建议方向，不在 M4 内批量重构。
- 直接阻塞 M4 的 M2/M3 问题必须先形成失败测试和影响说明，再请求是否允许修改既有行为。
- M4 验证完成后建立 `docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`，把观察项交给独立整体优化任务；该 Handoff 不是优化批准。

## 4. 成功标准

1. M4 Requirement、PRD、Architecture、Spec 0005、Plan 和 Task 职责分离；Owner 明确批准后状态为 `approved`，批准证据与真实采集禁区可追溯。
2. 合成 Fixture 覆盖正常、非法、边界、路径、checksum、refs、幂等、冲突、故障恢复和 Technical Retest。
3. 每条 M4 Finding 都能追溯 Query、Claim、Evidence 与 Asset；Evidence 的证明范围与 item state 一致。
4. 三类 Gap 的成立条件、反例和人工决策边界可由测试验证；Evidence 不足不能伪装 Content Gap，Query 热度不能单独证明 Product Gap。
5. 确定性站点检测相同输入得到字节稳定结果，不读取网络、不产生综合 GEO 分。
6. Source 访问失败、原文缺失、独立支持不足和低置信度分别保留，不静默合并成“已研究”。
7. 同一 Asset 的多 Goal 输入只生成一份完整建议稿；冲突在写入前失败且不留下半成品。
8. 风险段落包含 Claim/Evidence refs、风险原因与弱化表达，不用模型推测补事实。
9. Adoption Record 逐项记录 `accepted/modified/rejected`；Agent 不生成已决定状态或伪造人工证明。
10. 没有人工发布证明时 Technical Retest 拒绝；合成 Fixture 使用明确 `development_fixture` 例外且不能成为真实发布证据。
11. M0—M3 回归、插件自检、Workspace/index 确定性与 120 条 legacy 原始字节保持通过。
12. M4 Record 只记录实际命令与结果；M2/M3 观察项和 M2–M4 整体优化 Handoff 完整、可追溯且不混入本轮实现结论。

## 5. 约束与授权边界

- Markdown 是业务对象权威来源，indexes 为可删除重建的派生文件。
- Host Agent 负责语义提案；Node Tool 只验证、确定性检测和 create-only 物化显式输入。
- 默认只使用脱敏 Fixture、Fake Collector 和本地 snapshot；不调用付费模型或第三方 API。
- 不修改已批准 M3 对象的业务语义，不把产品方案 Source 当作更高等级业务 Evidence。
- 不把插件业务文件写入安装缓存，不依赖 `../../workspaces` 开发仓库相对结构。
- 未授权 commit、push、PR、真实采集、外部写入、发布、部署或生产流量操作。

## 6. 非目标

- M5 消费者产品 UI 的正式三次采样与平台效果复测；
- M6 GA4/GSC、真实 Cycle 1 与业务观察；
- M7 战略发现、Product PRD 或真实产品实施；
- 自动 CMS/Git PR、自动媒体或社区运营；
- 综合 GEO 分、自动业务批准或自动因果结论；
- 在 M4 内完成 M2/M3 全面重构。

## 7. 已批准范围与后续人工决定

- Owner 已于 2026-08-24 批准本 Requirement、PRD、Architecture、Spec 0005、Plan 和 Task 进入本地离线实现。
- 是否以及何时授权具体 MyyShop 站点、账号、Source、采集器和数据范围。
- 语义 Gap、建议项采用和实际发布均需各自的人类决定；M4 开发批准不自动覆盖这些门。
