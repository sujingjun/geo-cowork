# MyyShop 工作区状态

> 最近更新：2026-09-20

## 当前阶段

当前状态为工程复验收尾、真实业务暂停。2026-09-20已批准正式真实双周期，见[Spec 0015](../../docs/specs/0015-authorized-real-two-cycle.md)、[主 Agent 验收记录](../../docs/records/2026-09-20-authorized-real-two-cycle-record.md)。真实编排、正式采样、发布读回、分周Analytics及第二轮Goal入口已实现；主Agent最终448/448测试和文档/插件/Workspace/index检查通过，工程已收尾，真实业务暂停。

当前仍为0个真实KBASE、0个正式Cycle、0个Publication；`knowledge_base_ref:null`。首轮英文知识切片已整理并展示[Owner审核包](reviews/packages/OWNER-KNOWLEDGE-CYC-MYYSHOP-REAL-20260920-01.md)，Owner明确回复“暂缓知识批准”。Google重新登录进程已报告ADC保存成功，但按暂停指令未继续读取或验证GA4/GSC，时区/事件定义仍未确认。preflight `real_cycle_start_ready:false`、`safe_to_create:false`；尚未新增正式Baseline样本。执行计划为 `execution_paused:true`，每日北京时间10:00 heartbeat已暂停（PAUSED），不会自动推进。

历史2026-09-16双周期仍为隔离演练，不计入当前两个真实周期。

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
- 信源体系的唯一候选发现入口是获授权真实 Run 的 Citation Observation；无外部综合榜、静态域名表或历史排名 import 路径。
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
