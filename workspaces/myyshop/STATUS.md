# MyyShop 工作区状态

> 最近更新：2026-10-22

## 本地知识整理（2026-10-22）

已根据本次授权生成 [120 条英文主版本](knowledge/README.md)及[完整中文对照](knowledge/translations/zh-CN/README.md)，沿用现状，不预设品牌转型。来源登记、集中缺口、版本和双语检查见[验证报告](knowledge/00-governance/validation-report.md)与[执行记录](../../docs/records/2026-10-22-myyshop-initial-knowledge-curation-record.md)。所有条目仍为内部审核 draft；本地整理不代表品牌事实已获批准，也未替换历史正式 Release、解除真实周期暂停或启动外部发布。

## 当前阶段

当前状态为工程复验收尾、真实业务暂停。2026-09-20已批准正式真实双周期，见[Spec 0015](../../docs/specs/0015-authorized-real-two-cycle.md)、[主 Agent 验收记录](../../docs/records/2026-09-20-authorized-real-two-cycle-record.md)。真实编排、正式采样、发布读回、分周Analytics及第二轮Goal入口已实现；主Agent最终448/448测试和文档/插件/Workspace/index检查通过，工程已收尾，真实业务暂停。

当前仍为0个真实KBASE、0个正式Cycle、0个Publication；`knowledge_base_ref:null`。首轮英文知识切片已整理并展示[Owner审核包](reviews/packages/OWNER-KNOWLEDGE-CYC-MYYSHOP-REAL-20260920-01.md)，Owner明确回复“暂缓知识批准”。Google重新登录进程已报告ADC保存成功，但按暂停指令未继续读取或验证GA4/GSC，时区/事件定义仍未确认。preflight `real_cycle_start_ready:false`、`safe_to_create:false`；尚未新增正式Baseline样本。执行计划为 `execution_paused:true`，每日北京时间10:00 heartbeat已暂停（PAUSED），不会自动推进。

历史2026-09-16双周期仍为隔离演练，不计入当前两个真实周期。

## 当前源码的完整流程试跑（2026-10-17）

采集 Agent 与 MCP Server 均从 `/Users/sujingjun/dhnb/oneglanse` 构建和运行。复用已授权登录凭证后，新的 `what is myyshop` / Gemini 原生运行成功，内部第 3 次尝试完成；MCP 仅启动一次 job。新回答为 1,151 bytes、sources=[]，存储与接收 hash 一致，来源覆盖含义保持未知。

当前官网首页/About/robots/sitemap 已只读采集；真实 DeepSeek 生成并校验了 4 条候选观察、4 条建议。正式知识构建在临时副本中产生 candidate 英文 Answer Card 与 draft Release，并补齐关系追溯；临时副本已删除，草案仅以审阅 bundle 保存。真实工作区仍无 KBASE/Cycle/Publication，未生成新的正式 Sample/Review 或批准。

正式完整闭环尚未成立：英文 Query 原始追溯返回 TRACE_INCOMPLETE；正式诊断返回 BASELINE_REQUIRED，OneGlanse intake 缺少正式接续及采样证明。OneGlanse 本仓分析凭据已配置但网关连接失败；这与下方历史运行环境缺凭据的原因不同。详见[整体流程与能力缺口](../../docs/records/2026-10-17-myyshop-geo-full-flow-audit.md)。正式执行暂停不变。

## OneGlanse 单 Query 首次工程联调（历史证据）（2026-10-17）

本次明确授权的 `what is myyshop` / Gemini 已通过 MCP 完成保存、原生运行、状态查询和完整接收：1 条回答、6 条 Source（4 个不同 URL），5,053 bytes 与 OneGlanse 保存值的 SHA-256 一致。来源 Query 版本与原文/发送文本映射保存在 [intake](runs/RUN-ONEGLANSE-MYYSHOP-20261017-01/oneglanse-intake/received.json)，[候选 GEO 分析](../../docs/records/2026-10-17-oneglanse-geo-observation.md)已完成。

OneGlanse 默认后台分析已触发，但因运行环境未配置分析模型凭据而失败；本次没有关闭它或重发 Query。此工程结果不属于正式 Baseline，也不创建 KBASE/Cycle/Publication，`execution_paused:true` 保持。详细测试、hash 与限制见[联调记录](../../docs/records/2026-10-17-oneglanse-mcp-integration-record.md)。本次只同步仓库文档，未写飞书镜像。

## 当前边界

- indexes 是派生导航，不是新的业务事实源；
- 当前 Workspace `knowledge_base_ref:null` / `knowledge_base_mode:real_pending`；120 条 legacy knowledge 与既有小型 M3 slice 均未被自动升级为本轮真实品牌知识库；
- M3 validate 只有两条预期 `EVIDENCE_INSUFFICIENT`；两个 Claim 均待 first-party，能力 Claim 另待 data/case；
- 新采集的一方 Evidence 仍为 `candidate`，尚未由事实负责人逐条审核并回写 Claim 新版本，因此不能消除上述 warning；
- trace 关系完整且 `lifecycle_ready:true`，`gates:[]`；批准来源为 Owner 当前会话决定，不是 Agent 自动批准；
- `KR-MYYSHOP-DEFINITION-001` 的 `published/ready` 只表示本地正式知识包，不表示任何外部内容发布；
- 当前 Site 技术结果：For Creators 与 MyyFinds 九项通过；首页、About、Brand Deals 有 canonical 相关 Finding，About 另缺 heading；sitemap 首次假阳性已由 `v1.0.2` 修复并保留旧 Run 轨迹；
- 新采集的 11 份一方 Evidence 与本次 real slice 尚未获得人工批准；Content/Evidence/Product Gap、Proposal、Adoption、Publication、部署或业务效果也未确认。历史已批准 Evidence 继续保留原状态；GA4/GSC smoke 只证明指定窗口的只读接口可用，不证明业务效果。
- M5 Requirement、PRD、Architecture、Spec 0006 与 Plan 均为 `approved`；五平台正式英文两槽 Baseline 已完成并可重算，但 Task 继续为 `implemented`：10 个 Answer Review 仍为 candidate，100 Source 批量 Classification/Claim Support 尚未触发，post-change Retest 另缺 M4 Publication/Technical Retest。账号标识、凭据、浏览器历史和完整 DOM 不落盘。
- 历史 M5 消费者答案信源的候选发现入口是获授权真实 Run 的 Citation Observation；该边界不限制本次明确授权的品牌 PR、官网与官媒材料整理，也不把本次材料登记变成 M5 分类或新的平台采样。
- 当前 M5 共 133 个 Citation Observation，引用 40 个唯一 Source；全部进入 `archived_unclassified`，距离 100 Source 批量分类触发器还差 60 个。既有 27 个 candidate Classification 已转为 `superseded` 历史，不进入当前口径。
- 2026-09-04 Owner 明确决定：Citation Observation 当前用于记录、Source identity、Baseline/Retest provenance 与质量指标；40→100 和后续 Classification/Claim Support 不得阻止真实 GEO Cycle 的启动、推进或完成。它是否仍为独立 M5/v1 交付门，由后续 authorized-real PRD 明确。
- 五个平台各有两个 candidate Answer Review；Gemini 两槽 `current_positioning:fail`，其余平台两槽均为 `partial`。由于最新完整业务知识库尚未建立，所有 `core_fact_accuracy` 与 `citation_quality` 暂为 `partial`，不得升级为最终事实判断。
- 五个平台 Aggregation 均为 `computed` 且 `selected_sample_count:2`；因 region/model/viewport 等存在 unknown 或软差异，comparability 全部为 `partial`。分类覆盖率为 0，Source Type、party relation 与 Claim Support 指标保持 partial/null。
- 当前定位与中英语义合同由 `cycles/preparation/decisions/2026-08-26-m5-two-slot-source-batch-and-positioning-approved.md` 冻结；它是 M5 评估合同，不自动替代 M3 Knowledge Release 或证明外部发布。
- GA4/GSC → ANO/BSIG/candidate EVD 的真实 `collect-observe` 已通过：两个 ANO recorded、一个 BSIG computed/non-causal、一个 EVD candidate 且无 approval；GA4/GSC 各 7 行、0 warning。Business file adapter 已验证，但当前无获授权真实聚合文件，保持 `BUSINESS_FILE_NOT_PROVIDED`。
- M8 required packaging/shared Tool/WorkBuddy semantic fixture 已通过；Codex/Claude native interactive 与 WorkBuddy manual/native 均未执行。

## 当前收尾与未来恢复

本次仅完成工程复验、验收记录和文档整理，不再推进真实知识批准、平台采样、发布或业务观察。原知识材料与现有历史证据保留，延期决定已落盘。

只有Owner明确恢复真实业务时，才重核知识决定、Google访问与测量定义，再解除执行计划和heartbeat的暂停；恢复自动化不代表知识已批准。后续遵循[操作手册](../../docs/runbooks/authorized-real-two-cycle.md)。commit/push/部署/飞书同步未执行。

## 2026-09-16 Query 来源接入

本次明确授权的 GSC 查询词读取成功：718 行原始记录，按文本和语言归一化为 714 个候选；GSC 不提供语言信息，保存为 `unknown`。当前原始输入与指标见 `queries/inputs/518035755c24dc136b8f4fb1ea051a17c1f7e1b86d20b5a1cc79c5f993de2b57/input.json`。首次默认英文的导入已归档到 `runs/RUN-GEO-QUERY-LANGUAGE-20260916/outputs/original`，旧正式 Query 和品牌事实未改写。

这些是候选输入，不是新的冻结 Query Set，也不代表真实 Cycle 或 GEO 效果。知识驱动演练及其模拟决定保存在独立 `myyshop-geo-e2e-verified` 工作区；三平台单槽真实工程采集另有独立 Run，不计作正式 Baseline。
