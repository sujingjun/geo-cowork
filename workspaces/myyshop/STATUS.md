# MyyShop 工作区状态

> 最近更新：2026-09-04

## 当前阶段

M2—M5 历史工程状态保持。2026-09-02 已登记唯一线上 Merchant `MER-MYYSHOP-001` 与真实 GA4/GSC 非凭据配置；真实品牌知识库 ref 当前为空。独立 `workspaces/myyshop-development-test` 已用同一 Merchant 建立 `KBASE-MYYSHOP-DEVTEST-001` 并完成 knowledge-independent 工程验收。真实 Cycle Readiness 只读报告为 `real_cycle_start_ready:false`，原因是 real KBASE 尚未提供；未创建正式 Cycle。

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

## 下一动作

工程侧继续使用 `KBASE-MYYSHOP-DEVTEST-001` 回归；当前先审阅 `docs/prd/2026-09-04-authorized-real-geo-cycle.md`，PRD 获批后再起草 authorized-real 全链 Spec。真实启动不等待全部 120 条知识，只等待英文 `What is MyyShop?` Goal 的真实知识切片形成批准闭包，并按 `docs/runbooks/myyshop-real-cycle-start.md` 切换显式 `knowledge_base_ref`。由事实 Owner 单独审阅新 Analytics candidate Evidence；不得自动绑定 Claim 或解释为因果效果。M5 的 10 个 candidate Answer Review 与 M4 Publication/Retest 仍是对应阶段门；60 个 Source 差额独立并行，不阻塞 Cycle。

## 2026-09-16 Query 来源接入

本次明确授权的 GSC 查询词读取成功：718 行原始记录，按文本和语言归一化为 714 个候选；GSC 不提供语言信息，保存为 `unknown`。当前原始输入与指标见 `queries/inputs/518035755c24dc136b8f4fb1ea051a17c1f7e1b86d20b5a1cc79c5f993de2b57/input.json`。首次默认英文的导入已归档到 `runs/RUN-GEO-QUERY-LANGUAGE-20260916/outputs/original`，旧正式 Query 和品牌事实未改写。

这些是候选输入，不是新的冻结 Query Set，也不代表真实 Cycle 或 GEO 效果。知识驱动演练及其模拟决定保存在独立 `myyshop-geo-e2e-verified` 工作区；三平台单槽真实工程采集另有独立 Run，不计作正式 Baseline。
