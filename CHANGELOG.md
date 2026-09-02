# geo-cowork 变更记录

## 2026-09-02 - 五平台 guard adapter 移除 terms_blocked（本地未发布）

- 按 Owner 当次指令移除五个平台 guard adapter 的 `terms_blocked` 状态：ChatGPT、Perplexity、Google AI、Claude 与 Gemini 统一为 `manual_only`，adapter 合同枚举收窄为 `allowed/manual_only`；
- 五个平台的 Query 测试统一由 GEO Browser Extension（manual_assist）在 Owner-controlled 浏览器中完成；adapter `manual_fallback.mode` 统一冻结为 `extension_manual_assist`，Browser Query Task 合同强制校验该通道；
- Perplexity 同步放开：`user_supplied_result` 限制移除，可走扩展 manual_assist 提交新 Query，Owner 已提供导出/结果 URL 的导入通道保留；本决定覆盖 2026-08-26 Perplexity 限制决策；
- 自动采集门不变：非 `allowed` 平台尝试 `dom_automation`/Playwright 仍在浏览器启动前被 `PLATFORM_TERMS_BLOCKED` 阻止，adapter 变成 `allowed` 仍需平台方书面许可；
- 根 `npm test` 347/347 与扩展 4/4 通过；未访问真实平台、未安装扩展、未 push/PR/release/deploy。

## 2026-09-02 - Knowledge-Independent GEO Lifecycle Readiness（本地未发布）

- 将 M6/M7 的测试边界从虚构 `test_merchant` 重构为“唯一 MyyShop online Merchant + 隔离 development-test KBASE”；新增显式 `knowledge_base_ref`，删除旧 record type、CLI、模块、模板与专属 fixture 命名；
- 新增 `workspaces/myyshop-development-test/`，复用 MyyShop 线上 locator、GA4 Property `356373250` 和 GSC URL-prefix 配置；test-only Claim/Evidence/批准不进入真实工作区，也不自动转正；
- 新增只读 `geo-readiness report`，分开 engineering readiness 与 real Cycle start readiness；真实知识缺席固定 `content_gap_inferred:false` 且不创建 Cycle；
- 新增 GA4/GSC `collect-observe` 与聚合业务文件 `ingest-business-file`：可形成真实 ANO、非因果 BSIG、candidate EVD，拒绝自动批准、PII、逐用户/逐请求数据；
- 完成 Query Portfolio 对新 KBASE scope 的迁移和 NUL 文档字节修复；候选生成、去重、聚类、优先级、人工批准与冻结行为不变；
- 新增 M8 Cross-host Conformance Tool：Codex/Claude packaging + shared Tool 和 WorkBuddy test-only semantic fixture 为 required；native/manual optional 保持 `not_executed`；
- synthetic Cycle 1/2、人工选择、恢复、安全与跨宿主专项已重新通过；真实 GA4/GSC Observation 采集与受控物化随后完成，Evidence 保持 candidate、Signal 保持 non-causal；无 push/PR/release/deploy。

## 2026-09-01 - Query Portfolio 流水线（本地未发布）

- 新增 Query Portfolio 阶段：候选 intake（确定性归一化/意图/优先级规则 `qp-*-v1`）、同源重复失败、跨来源合并、既有 Query 幂等跳过、聚类与覆盖报告（create-only JSON 工件）、draft Query Set 组装与冻结前机器门；
- 新增 `scripts/query-portfolio.mjs`（intake/report/assemble/prefreeze/validate）与 `skills/geo-query-portfolio`；不新增记录类型、不写任何 `approval`，candidate → formal 与 draft → frozen 只由人类编辑并补批准；
- 双路径写入已于 2026-09-02 迁移：`workspace_mode: development_test` 走 `preflightTestKnowledgeWrite`，真实工作区仍走 M3 `validateObjectData` + create-only；
- 知识库缺席验收已迁移为 online Merchant + test-only KBASE；合成 Source 继续使用 `.invalid` locator，`workspaces/myyshop` 只读兼容保持；
- 专项 21 tests（16 单元 + 3 E2E + 2 CLI）与全量 321 tests 通过；插件 Manifest 仍为 0.3.0，未 commit/push/PR/release/deploy。

## 2026-08-26 - M5 两槽英文 Baseline 第 1 槽（本地未发布）

- Owner 将正式协议修订为每平台两个独立英文 manual Sample；中文仅作可选辅助并绑定同一语义合同；
- Source 只归档未分类，按 M5 Citation 引用的唯一 `source_ref` 计数，达到 100 后另启批量 Classification/Claim Support Task；
- 新增 manual baseline v2、Source batch queue、两槽 Run 恢复、低于阈值的 partial/unknown 聚合，以及批量采集/Review CLI；
- ChatGPT、Gemini、Google AI、Perplexity、Claude 各完成第 1 槽，共新增 52 个 Citation；当前累计 33/100 个唯一 Source，五个 Run 均为 `waiting_human` 1/2；
- 新增 5 个 candidate Answer Review；Gemini 当前定位为 fail，其余为 partial；最新完整业务知识库、Source 分类、第 2 槽和 Aggregation 仍待后续；
- Owner 随后提供五平台第 2 槽：新增 53 个 Citation，五个 Run 均 completed 2/2；形成 10 个 candidate Review 与 5 个 computed Aggregation；当前 40/100 Source、comparability 均 partial；
- Gemini 官方共享入口 `share.gemini.google` 只加入 manual result allowlist；自动 Query/Playwright guard 不变；
- 自动采集 guard、外部写入、发布、部署与 Git 远端门保持；未 commit/push/PR/release/deploy。

## 2026-08-25 - M5 Consumer Answer Testing 离线工程（本地未发布）

- Owner 批准 M5 Requirement、PRD、Architecture、Spec 0006、Plan 与 Task，并授权 T02—T07 本地离线实现；
- 新增七类 M5 canonical 对象、七类派生 index、Profile fingerprint、当时的三 slot Sample、create-only raw、Citation-driven Source 与双向闭包；该采样数已由 2026-08-26 Owner 决定修订为两槽；
- 新增 lease/stale takeover/未知提交状态停门、五层 Source Classification、Claim Support、同 raw 多 rubric Review、五项指标与 comparability；
- 新增 `answer-cycle.mjs`、`geo-answer-cycle`、`geo-answer` 和 `.invalid` 录制 Fixture；外部榜单 import 与未授权真实 `collect` 均显式失败；
- 后续按 Owner 授权全局安装 `playwright@1.62.1`，复用兼容 `chromium-1234`，完成 loopback base Smoke；未下载新 browser binary；
- 新增五个平台 Terms/robots guard adapter；账号与本地 365 天保留已授权，但真实 UI Smoke 全部在浏览器启动前停止，未访问账号或采集 Output；
- 后续由 Owner 在 ChatGPT Temporary Chat 手工完成 1 个 exploratory Smoke，生成 1 Sample、3 Citation 与 candidate Classification；未自动提取 Output，也未形成 Baseline；
- Owner 另完成 1 个 Gemini 无 Citation manual exploratory Sample，随后将剩余平台切换为书面自动采集 permission ref 硬门；
- 后续按 Owner 决定移除 adapter `written_permission_ref` 运行时硬门；平台许可改放 Requirements 需求池，业务状态“待规划”、是否开启规范仅由 Owner 决定，Terms/robots guard 保留；
- 2026-08-26 启用 Google AI/Claude Owner manual exploratory adapter，并把平台注册入口校验接入 manual materializer；Perplexity manual 继续 blocked，自动采集 guard 不变；
- 2026-08-26 由 Owner 提供 Google AI 共享结果，材料化 1 个 exploratory/manual Sample、9 个 Citation、9 个新 Source 与 9 个待复核 candidate Classification；未创建 Claim Support/Review/Aggregation，不构成 Baseline；
- 2026-08-26 由 Owner 提供 Claude 共享结果，材料化 1 个 exploratory/manual Sample、6 个 Citation、2 个唯一 Source（其中 1 个新建、1 个复用）与 6 个待复核 candidate Classification；未创建 Claim Support/Review/Aggregation，不构成 Baseline；
- 2026-08-26 Owner 将首个 Claude Profile 直接指定为 `region: CN`，并批准独立英文 formal Query/Query Set 与 `region: US` 共享结果采集；美国成功重试形成 3 个 Citation、2 个唯一 Source 与 3 个待复核 Classification，只记录采集基线差异，不执行 IP 对比；首次枚举校验失败 Run/Attempt 保留为审计历史；
- 2026-08-26 新增 Perplexity `user_supplied_export_only` manual 门：Owner 提供的导出 Markdown 以原文件 SHA 写入 1 个 exploratory Sample、5 个 Citation、3 个新 Source 与 5 个待复核 Classification；普通页面 manual 和 browser automation 继续 blocked；
- 未 commit/push/PR/release/deploy，插件 Manifest 仍为 0.3.0。

## 2026-08-24 - M2–M4 优化与 MyyShop 首批公开采集（本地未发布）

- 新增同源 allowlist public collector：单并发、限速、超时/重试、重定向/容量上限、敏感 header 脱敏、raw/metadata SHA 与 create-only 恢复；
- 新增 collection summary 到 M4 Site/Research manifest/plan 的确定性桥接器，以及仓库级 Markdown 链接检查；
- 经 Owner 明确授权采集 11 个 MyyShop 公开端点，生成 11 份 candidate 一方 Evidence 和 5 页 Site Run；未读取 GA4/GSC、账号或消费者平台；
- 真实 sitemap 暴露 processing instruction/尾部 comment 假阳性，红测修复并将 detector 升为 `m4-site-detectors-v1.0.2`；旧 Run 保留为修复轨迹；
- 没有自动批准 Evidence、更新 Claim、确认 Gap、生成 Proposal、采用、外部发布、commit、push、PR 或部署。

## 2026-08-24 - M4 Diagnosis, Site & Asset Proposal（本地未发布）

- 新增 M4 Schema/profile、三类 Gap 前置、Asset Proposal/Adoption/Publication 对象、三类派生 index 与 Proposal trace；
- 新增本地 checksum manifest 驱动的九项站点检测、研究输入、multi-goal 单 Asset Proposal 和 Technical Retest；
- 新增 `geo-diagnosis-cycle`、`geo-site`、`geo-reputation`、`geo-competitor`、`geo-content` 五个 Skill 与 `diagnosis.mjs`；
- 实现只使用 `.invalid`/本地合成 Fixture，不包含真实 MyyShop 采集、外部写入、发布、部署或 M5 消费者平台复测；
- M4 专项 20/20、全量 67 tests 与插件 54 项通过；建立 M4 Record 和 M2–M4 整体优化/M5 进入门 Handoff；
- 当前插件 Manifest 仍为 0.3.0，本条是未发布源码变更，不构成版本发布记录。

## 2026-08-24 - M3 Knowledge & Query Operating System

- 新增 M3 Schema、Document/Claim/Evidence/Answer Card/Knowledge Release/Query Set/Evidence Plan/Goal 契约与四个 Knowledge/Query Skills；
- 新增 create-only propose/assemble、M3 profile、证据充分性建议、发布闭包、关系 trace 与显式 lifecycle gates；
- 建立 MyyShop “是什么” 的 13 对象关系链、补证计划、技术 Run 与可重建 indexes，保留五条产品风险；
- Owner 后续批准全部 M3 业务对象：Query Set 已冻结，本地 Knowledge Release 已 `published/ready`，trace 为 `lifecycle_ready:true`；两条证据不足 warning 与外部发布边界继续保留；
- 本地 10 项 M3 专项与全量 47 tests 通过；没有真实 M4 诊断、外部发布或部署。

## 2026-08-24 - M2 Contract & Provenance Kernel

- 建立 Markdown Object Contract、稳定 ID/version/refs、可重建 indexes 与 legacy knowledge 兼容索引；
- 建立 Run lifecycle、input supersede、不可覆盖 raw/output artifact 与安全路径边界；
- 独立实现脱敏 ops-geo legacy audit 迁移语义，不复制无许可证上游代码或真实数据；
- MyyShop 补齐 Workspace 根身份与 M2 派生 indexes，120 条 legacy knowledge 原文不改；
- M3 在制检查点后已由同一会话按 Owner fallback 收口；M2 本条目的历史验收范围不因此扩大。

## 2026-08-20 - 移除 CodeBuddy 适配，切换 WorkBuddy（中国区）专家体系

- 删除 `.codebuddy-plugin/plugin.json` 与仓库根 `.codebuddy-plugin/marketplace.json`；插件版本升至 0.2.0（两 Manifest、两 Marketplace）；
- 第三宿主定位改为 WorkBuddy（中国区）专家体系：官方文档（workbuddy.cn）未发布开发者契约，暂不提供插件包装，过渡期经「我的专家/创建技能」人工配置；
- 同步修订 Spec 0001、重新定基线方案、架构文档、PRD、根 README 与两份 Handoff；
- 变更后验证：`node --test` 12/12、`validate-plugin` 8 项、Claude `plugin validate` ✔、Codex 重装 0.2.0 enabled ✔；用户 CodeBuddy 配置的市场注册已移除。

## 2026-08-20 - 里程碑 1 加固与中国区 WorkBuddy 适配

- 根 `README.md` CodeBuddy/WorkBuddy 章节加固：内嵌 CLI 定位与 alias 配置、应用升级路径漂移提示、`/reload-plugins` 与市场/缓存要点；
- 复核 WorkBuddy 官方中文插件文档（2026-08-20）：Manifest 与技能命名空间兼容确认，owner 缺 `email` 记为已知偏差；
- 三宿主全量复验通过（Claude 2.1.237、CodeBuddy 2.115.0、Codex 0.146.0）；交互式 `/reload-plugins` 等宿主命令确认需人工在交互会话补验；
- 新增本阶段 Task、Record 与出口 Handoff；插件代码零行为变更。

## 2026-08-20 — 里程碑 0—1（仓库重新定基线 + 三宿主插件骨架）

- 仓库定位从"SDD 控制面"修正为本地优先 GEO 专家插件仓库；
- 新增根 `README.md`、`package.json`、三个 Marketplace；
- 新增 `plugins/geo-expert`：三宿主 Manifest、`geo-workspace-init` Skill、工作区模板、初始化/校验/插件自检脚本；
- 新增 `tests/`（`node:test`）与 `tests/fixtures/workspace-valid/`；
- 新增里程碑 0—1 的 Requirement、PRD、Architecture、Spec 0001/0002、Plan、Task、Acceptance Record 与里程碑 2 Handoff。
