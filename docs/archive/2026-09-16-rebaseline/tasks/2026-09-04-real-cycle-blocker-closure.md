---
title: 真实 GEO Cycle 阻塞收口与双周期 v1 任务清单
status: proposed
created: 2026-09-04
updated: 2026-09-04
source:
  - docs/plans/2026-09-04-real-cycle-blocker-closure-plan.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/records/2026-09-02-myyshop-real-cycle-readiness-report.md
  - docs/records/2026-09-03-browser-query-task-mcp-automation-record.md
  - "2026-09-04 grill-with-docs Owner 共识"
scope: 从 authorized-real SDD、工程基线、英文 real KBASE 到两个真实 GEO Cycle、M8/v1 的依赖化任务；Citation 维护线不阻塞 Cycle
baseline: main@d848cdf1ba83a40f3f243e24b66db0f275cec424；clean；本地未 push
---

# 真实 GEO Cycle 阻塞收口与双周期 v1 任务清单

所有任务初始为 `proposed`。Owner 对访谈决定的确认不等于自动批准尚未起草的 authorized-real PRD、Spec 0014，也不授权本地实现、真实访问、Publication、commit、push、PR、release 或 deploy。

本文件是 program-level proposed task map，不是可直接分派的最小实现任务。T01 的 PRD/Spec 获批后，T03、T07、T08、T09 必须按状态机阶段拆成新的 child Task 文档并补精确目标文件、测试命令、Session 与 Handoff；未拆分前不得进入实现。

## 依赖总览

```text
T01 PRD→Spec→Plan/Task批准
├─ T02 工程基线 ─┬─ T03A shared validator → T03B M6 real parity ─┐
│                 ├─ T04 M5工程seam ──────────────────────────────┼─ T06B Safe-to-create/create → T07 Cycle1 ─┐
│                 └─ T08 M7 real parity ──────────────────────────────────────────────┼─ T09 Cycle2 → T10 M8/v1
└─ T05A English real KBASE + T03A → T06A Start-ready ─────────────────────────────────┘
   T05B operational input package ────────────────→ T06B

T11 Citation 维护线从 T02 后持续并行，不进入 T06/T07/T09 的 required dependencies；是否仍为 T10 的独立 M5/v1 依赖，由 T01 PRD 明确决定。
```

## T01 — Authorized-real PRD、Spec 与场景矩阵

- 对应 PRD/Spec/Plan：`docs/prd/2026-09-04-authorized-real-geo-cycle.md`（`proposed`）→ 待起草 Spec 0014 → 本 Plan。
- 目标：先定义 authorized-real/v1 产品验收，再把 real/test 双路径、九阶段门、人工决定、Cycle 2 与 M8/v1 写成可测试系统合同。
- 成功标准：PRD 决定用户旅程、业务成功、Citation 的 M5/v1 边界与外部门；Spec 明确输入/输出、状态、Schema、错误码、幂等、并发、恢复、权限、审计、KBASE membership、真实 Publication、统一 decision seam、Review/Trace、Cycle 2、Browser extraction 技术分支、negative/no-signal 结果及 M8 v2 acceptance；若新决定改变既有 M5/v1 或 Spec 0013 extractor 验收，最终产品 Plan、Browser Context 与受影响 PRD/Spec 显式标注 supersession；场景矩阵逐条可追溯。
- 范围外：代码实现、真实 KBASE 写入、真实平台或数据访问。
- 前置依赖：无。
- 目标文件：上述 PRD、`docs/specs/0014-authorized-real-geo-cycle-execution.md`、必要的最终产品 Plan/M5/Spec 0013/Browser Context supersession 注记，以及获批 Spec 后回写的 Plan/child Tasks。
- 测试要求：文档链接、状态、术语、transition/gate/错误码和 test/real 隔离人工复核。
- 验证：`npm run check:docs`、`git diff --check`，以及 PRD→Spec→场景矩阵审阅；批准前不执行代码红测。
- 风险：直接修改旧 test-only 行为，导致历史 fixture 和 real 语义混写。
- 当前状态：`proposed`。
- 当前进展：PRD draft 已创建，等待 Owner 对 D1–D5 与全文作批准或修改决定；Spec 尚未起草。
- Session/Handoff：跨 Session；任一上游决定未完成时创建 Handoff，记录待批准工件、分支/HEAD 和下一开场指令。
- 授权门：PRD、Spec 0014、回写后的 Plan/Tasks 与本地实现必须由 Owner 依次明确批准后，才能进入 T02–T05。

## T02 — 可依赖工程基线

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0014、Plan Phase 1；B-ENG-01、B-ENG-02。
- 目标：恢复默认测试/lint/build 的可重复结果。
- 成功标准：Analytics 单测不依赖过期真实授权；默认 Vitest、Node Test、lint、typecheck、Extension build、Nuxt build 均以正确入口正常退出。
- 范围外：无关重构、批量格式化上游参考文档、真实 Analytics 读取。
- 前置依赖：T01 approved。
- 目标文件：`tests/analytics-readonly-cli.test.mjs` 的 fixture/clock seam、Extension test config、当前 8 个 lint error 所在文件、Nuxt/PGlite build 收口点。
- 测试要求：过期/有效/漂移授权的确定性负例；Vitest/Node Test 不互相误收；build exit 0。
- 验证：Plan §9.2 全量门，加敏感信息扫描和 first-party `git diff --check`。
- 风险：为收绿而延长真实授权、弱化 expiry 或顺手重构站点业务代码。
- 当前状态：`proposed`。
- Session/Handoff：可跨 Session；失败分类、已运行命令、生成物清理、checkout 与下一步必须进入 Record/Handoff。

## T03 — M6 Authorized-real Cycle 1 推进、Review 与 Trace

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0014、Plan Phase 2；B-M6-01、B-M6-02、B-M4-02、B-M6-03、B-M6-04。
- 目标：T03A 建立 Readiness/create/freeze 共用的 real KBASE validator；T03B 让 authorized-real Cycle 安全覆盖九阶段，而不放宽 synthetic/test-only 隔离。
- 成功标准：T03A 对 KBASE mode/status/approval/membership 和 cross-KBASE 对象在 report/create/freeze 返回同一稳定错误且 zero-write；T03B 实现 execution-scope-aware preflight、CIS/CTR/Cycle CAS、恢复、drift、幂等、real Publication proof、Analytics ownership、统一 decision-materialization seam、Review waiting/decided 和 completed Trace。
- 范围外：真实 MyyShop Cycle 创建、真实 Publication、真实数据读取。
- 前置依赖：T01 approved、T02 工程门可重复。
- 目标文件：`cycle-snapshot.mjs`、`cycle-lifecycle.mjs`、`cycle-gates.mjs`、`cycle-trace.mjs`、`workspace-scope.mjs`、Readiness/Schema/Profile 及专项测试。
- 测试要求：invalid real KBASE status/approval/cross-KBASE membership 的 report/create/freeze 一致负例；每阶段 normal/invalid/scope pollution/version drift/checksum/concurrency/crash recovery；real/test 双向伪造；任意对象数量不得绕过 exact frozen matrix。
- 验证：新增 authorized-real Cycle 1 专项 + M6 全量 + 根全量 + Workspace zero-write。
- 风险：只删除 `test_scope` 检查造成 real 路径无 proof，或 preflight 顺序错误留下半成品。
- 当前状态：`proposed`。
- 粒度：父工作包；Spec 0014 批准后至少拆成 T03A shared validator，以及 T03B 的 preflight/snapshot、transition/gates、Review/decision、Trace/recovery child Tasks。
- Session/Handoff：每个 child Task 独立 Session/Record；跨 child 或阻塞时创建 Handoff，不以父工作包自报完成。

## T04 — M5 Reviewed Review、Baseline Gate 与真实结果工程 seam

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0006/0013/0014、Plan Phase 2/3；B-M5-01、B-M5-02、B-M5-03。
- 目标：建立 Owner decision→reviewed successor→新 Aggregation 的可审计工程 seam，并让 real Cycle gate 精确校验英文 Query×五平台×两槽×Profile×time window；真实 Owner Review 留到 T07。
- 成功标准：candidate Review 可依据独立 decision artifact 生成新 ID 的 reviewed successor object，并以 `supersedes_ref` 绑定 predecessor，历史字节不变；每个平台生成新 ID 的 Aggregation successor，exact-pin 两个 reviewed successor；40 Source/0 Classification 仍可完成并返回 `SOURCE_CLASSIFICATION_DEFERRED`；manual-only Browser real path 使用 Spec 0014 批准的 extraction 分支闭合 CQI→capture→pending→M5→ack/recovery。
- 范围外：未经 PRD/Spec 0014 批准的 extraction 分支、未经当次授权的真实模型调用、DOM automation、Citation 数量门。
- 前置依赖：T01 approved、T02；真实 Review 物化依赖 T05 real KR 与 Owner H3，且不属于 G2。
- 目标文件：Answer Review Schema/materializer/CLI、Cycle baseline gate、Browser/Cowork real input contract、相关测试与 Record。
- 测试要求：no-decision/decision ref 重用/跨 Scope/重放/冲突、candidate→reviewed lineage、旧 AGG 不被改写、跨 Query/平台/slot/window 伪造、manual capture、获批 extraction 分支、PII/token 拒绝、40→100 non-interference。
- 验证：M5/Browser 专项、五平台矩阵检查、根全量；真实 UI 证据另记。
- 风险：把 Agent 评语当 Owner 决定，或为方便自动采集突破 `manual_only`。
- 当前状态：`proposed`。
- Session/Handoff：至少拆成 Review/Aggregation、Browser real intake、Citation non-interference 三个 child Tasks；各自独立 Record/Handoff。

## T05 — 英文 Real Knowledge Slice 与 Cycle 1 Operational Input

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0012/0014、Plan Phase 3；B-M3-01、B-M3-02。
- 目标：T05A 围绕 `What is MyyShop?` 建立最小、真实、人工批准的知识闭包；T05B 在该闭包上准备独立的 Safe-to-create operational input package。
- 成功标准：T05A 的同一 real KBASE membership manifest exact-pin approved Goal、`Q-MYYSHOP-WHAT-IS-EN-BASELINE-001@1.0.0`、`QS-MYYSHOP-DEFINITION-EN-BASELINE-001@1.0.0`、English Answer Card、Claim、经 Owner 审核的最小 approved Evidence→Source 子集、approved Document 与 human-approved Knowledge Release；中文和其余 candidate Evidence backlog 不进入 frozen QS/CIS/track/gate。T05B 至少包含一个 exact-bind 新 Goal/Q/KR/Claim 的 versioned Asset、五个 frozen Baseline Profile、relative Retest schedule template、measurement/rule/policy artifacts 和 Cycle create plan；未来 Retest Profile 只在 Publication 后生成。
- 范围外：全部 86 条 P0/120 条 legacy knowledge、test KBASE 转正、Citation 100 Source。
- 前置依赖：T01 approved；事实材料与决定由 Owner 提供。
- 目标文件：保留既有 English Query/QS `1.0.0` 的 exact bytes；在 `workspaces/myyshop` 下新增或 version Goal/Document/Claim/Evidence/Answer Card/KR/KBASE membership manifest、决定记录、Asset、Collector Profiles、measurement/rule/policy 和 create plan；最后才更新 `workspace.json`。若 Query/QS 必须变更，则不得复用现有 Baseline，另走 fresh Baseline 分支。
- 测试要求：KBASE membership、Goal/Query/Answer Card closure、Evidence Scope/limitation、version/checksum、test-only 污染、index rebuild 确定性。
- 验证：Workspace、Knowledge、Query Portfolio、Readiness 四道检查。
- 风险：覆盖历史对象、把 candidate Evidence 自动批准、把 Knowledge Release 误写成外部 Publication。
- 当前状态：`proposed`。
- 粒度：拆成 T05A Knowledge closure 与 T05B Operational package；T06 只做独立 QA，不在验收时补造前置对象。
- Session/Handoff：跨事实审阅 Session；每批候选与 Owner decision 单独记录，未批准材料不得进入 real KBASE。
- 授权门：每个事实与批准决定由 Owner 明确确认；Agent 只准备决策包和候选变更。

- M8 保留条件：`KBASE-MYYSHOP-DEVTEST-001` 至少保持 `frozen` 到 T10 完成；是否 archive 另行决定。

## T06 — 独立 QA、Start-ready 与真实 Cycle 1 创建

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0012/0014、Plan Phase 4；G1/G2/G2A。
- 目标：先独立确认严格的 Start-ready，再以更强的 Safe-to-create go/no-go 防止制造孤立真实 Cycle。
- 成功标准：T06A 依赖 T02、T03A shared validator 和 T05A，报告 `real_cycle_start_ready:true`；T06B 另要求 T03B、T04 工程 seam、T05B 的 Baseline Profile/relative schedule operational package 通过 create dry-preflight；Owner 看过完整计划。
- 范围外：自动创建、直接推进 Baseline、外部访问。
- 前置依赖：T06A= T01 approved + T02 Readiness 相关门 + T03A + T05A；T06B= T03B + T04 工程 seam + T05B + T06A。T11 和真实 H3 Review 不构成 Start-ready/create 依赖。
- 目标文件：Readiness/QA Record、Cycle create plan、冻结输入清单；授权后才创建真实 Cycle/CIS/Run。
- 测试要求：Readiness true 但缺 Asset/Profile/measurement package 时 create preflight 必须 zero-write fail；final red-team、敏感信息、真实 Workspace diff、分支/HEAD/依赖冻结。
- 验证：Plan §9.2、real readiness、create-cycle dry contract、创建后 trace/read-back。
- 风险：把 `real_cycle_start_ready:true` 当创建授权，或先创建后发现 advance 仍阻塞。
- 当前状态：`proposed`。
- Session/Handoff：T06A Readiness QA 与 T06B Safe-to-create/实际创建使用不同 Record；跨授权等待时创建 Handoff。
- 授权门：真实 `create-cycle` 必须获得当次明确授权。

## T07 — Agent 主导完成真实 Cycle 1

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0005/0006/0010/0014、Plan Phase 5；G3。
- 目标：按九阶段完成英文 `What is MyyShop?` 真实 Cycle 1。
- 成功标准：real KR 后完成 10 个新 ID 的 Owner reviewed successor Review 与五个新 ID 的 Baseline Aggregation successor；Diagnosis、Gap decision、Adoption、真实 Publication 的事前授权/事后 attestation、Technical Retest、W1–W4 Platform Answer Retest、Analytics、waiting/decided Review 全部可追溯；最终 `review_decided/full`。
- 范围外：保证正向排名、流量、注册或业务效果；自动审批和自动发布。
- 前置依赖：T06 创建完成；每个 H Gate 单独满足。
- 目标文件：真实 Cycle/Run/CIS/CTR、M4/M5/M6 对象、raw/proof、Record 与阶段 Handoff。
- 测试要求：每次 transition 复验 frozen refs；W1–W4 schedule 只在 Technical Retest 完成后解析且所有 capture 更晚；外部动作提交未知时不重试；refusal/timeout/no_result/challenge/cancelled 只要满足证据合同即可占用 slot，不能被成功样本覆盖；只有未形成观察的 `system_failure` 可重试；challenge 停止该平台，不换 API/平台补数；`no_signal/negative/insufficient_data` 如实进入 Review。
- 验证：每阶段 gate check、技术/平台实际证据、Analytics contract、最终 Trace 和独立 Review。
- 风险：重复平台提交、Publication proof 不完整、观察窗缩短、把结果写成因果。
- 当前状态：`proposed`。
- 粒度：父工作包；至少拆为 T07A Baseline/Review、T07B Diagnosis/Gap/Adoption、T07C Publication/Technical Retest、T07D W1–W4 Platform Retest、T07E Analytics/Review。
- Session/Handoff：每个阶段和每周观察窗独立 Record；等待下一窗口或人工门时写 Handoff，不能用一个长期 Session 自报完成。
- 授权门：事实/Review、逐目标读取、Gap、Adoption、Publication 执行与 attestation、Technical Retest、逐平台逐周 Retest、逐次 Analytics 与最终 Cycle Review 分别由 Owner 决定。

## T08 — M7 Authorized-real Candidate、GSEL、Strategy 与 Cycle 2

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0008/0014、Plan Phase 6；B-M7-01。
- 目标：实现真实 Cycle 1 Review→Candidate→Owner Selection→真实 Cycle 2 的安全路径。
- 成功标准：Candidate 只读 decided Review snapshot；无 Strategy 时确定性过滤/withhold Product Gap 并报告原因，普通候选仍可物化；Owner 要考虑 Product Gap 时依次完成 invocation、STA、DDM validation、独立 factor promotion、STO，再以新 rule/new GCB ID 重建 Candidate Batch；最后才由 GSEL 完整分区和决定；Cycle 2 使用 authorized-real scope。
- 范围外：提前确定 Cycle 2 Goal、强制运行 Strategy、真实 Cycle 2 执行。
- 前置依赖：T01、T02；工程实现可与 T07 观察窗并行，真实选择依赖 T07 decided Review。
- 目标文件：strategy workflow/profile、cycle-goal-candidates、cycle-goal-selection、cycle-two apply、Schema/Profile/CLI 与测试。
- 测试要求：real/test 双路径、普通+Product Gap 混合 Review、withheld diagnostics、未过 Strategy gates 的 Product Gap 不得入 batch/GSEL、DDM validation/factor decision refs 不同、rank/partition、decision lineage、Strategy not_applicable、恢复和冲突。
- 验证：M7 专项、Cycle1→2 authorized-real contract E2E、根全量和独立 QA。
- 风险：从聊天或 live Workspace 生成候选，或让 Strategy Output 自动成为 Approved Claim。
- 当前状态：`proposed`。
- 粒度：父工作包；至少拆为 ordinary candidate/filter、Strategy decisions、batch/GSEL、Cycle2 apply 四个 child Tasks。
- Session/Handoff：每个 decision stage 独立 decision artifact/Record；真实 Cycle 1 Review 未到位时仅完成工程 seam，不伪造输入。

## T09 — 选择并完成真实 Cycle 2

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0005/0006/0008/0010/0014、Plan Phase 6/7；G4。
- 目标：从 Cycle 1 decided Review 选择并批准 Cycle 2 Goal，建立对应知识切片并完整重复九阶段。
- 成功标准：Owner 用独立 decision artifact 完成 decided GSEL，再用不同 ref 独立批准 Goal；Goal/KBASE/Query/KR 重新冻结；新 Goal 的 Asset/Claim、Collector Profiles、measurement/rule/policy 与 Cycle plan 形成独立 G2/G2A package；Cycle 2 最终 `review_decided/full`；授权、Publication、Retest、Analytics 和 Review 均独立于 Cycle 1。
- 范围外：复用 Cycle 1 授权、预设正向结果、跳过第二个观察窗。
- 前置依赖：T07、T08；Cycle 2 real knowledge closure 和 create-cycle 当次授权。
- 目标文件：Cycle 2 Candidate/GSEL/Goal/Knowledge/Cycle/Run/Record/Retrospective 工件。
- 测试要求：每个 Cycle 重复 Start-ready/Safe-to-create、跨 Cycle 污染、旧授权复用、版本漂移、重复外部动作、partial/cancelled 不冒充 full。
- 验证：完整 Trace、独立业务 Review、two-cycle comparison。
- 风险：为了排期并行两个本应串行的观察窗，或把 Cycle 1 结论直接复制到 Cycle 2。
- 当前状态：`proposed`。
- 粒度：父工作包；按 T05/T06/T07 模板为新 Goal 生成独立 child Tasks，不复用 Cycle 1 Task 状态。
- Session/Handoff：若 Review 没有 eligible candidate，或 GSEL 全部 rejected/deferred，停止并写 Handoff；不得杜撰 Goal，等待新 Evidence/Review 或 Owner 取消 v1 目标。
- 授权门：H11a GSEL、H11b Goal approval 与 H4-equivalent Cycle 2 create authorization 三次独立决定，decision ref 不得复用。

## T10 — M8 跨宿主与 v1 收口

- 对应 PRD/Spec/Plan：T01 authorized-real PRD、Spec 0009/0014、Plan Phase 8；B-GOV-01、B-M8-01、B-M8-02、B-M8-03、B-M8-04；G5。
- 目标：在最终稳定快照上完成跨宿主、跨 Session 与 two-cycle v1 验收。
- 成功标准：两个真实 Cycle full；Agent 控制面 active/inactive 清单闭合；v2/独立 acceptance exact-pin 两个 real Cycle/decided Review；完整 repo manifest/Tool closure 覆盖 Spec 0010–0014 与 Browser real path；独立 runner 产出 Codex native、Claude native 与明确标记 `test_only_semantic_fixture/shared_tool` 的 output manifests（至少 indexes/Finding/trace/cycle_result/diagnostics/validation）；WorkBuddy manual 只验证配置/跨会话继续且 `native_host_verified:false/contract_unavailable`，不参加 digest 比较；其余 M8 工件复验，two-cycle Retrospective 与 release-readiness package 齐备。
- 范围外：把 WorkBuddy native 设为无合同硬门、自动 push/release/deploy、宣称业务改善。
- 前置依赖：T09；最终代码/Plugin/Workspace snapshot 冻结。
- 目标文件：M8 v2/独立 acceptance、host output manifests、native/manual Records、Retrospective、draft Release Notes/Runbook/readiness checklist；实际发布后才创建 verified Release Record。
- 测试要求：独立宿主 runner/Session、不得中央 fan-out 复制 digest、逐 output kind 完整性、漏 Spec/resource/import pin、相同输入一致/不一致、敏感信息、无聊天记忆依赖、stable snapshot freeze barrier。
- 验证：M8 required + native/manual matrix、最终全量、release candidate checklist；H12 后才验证实际 Release。
- 风险：复用同一执行上下文自证，或把 fixture 5/5 当最终 native 验收。
- 当前状态：`proposed`。
- Session/Handoff：Codex native、Claude native、WorkBuddy manual/semantic 和总验收由独立 Session/Record 执行；父任务只在全部证据汇总后收口。
- 授权门：每个真实宿主的安装/配置/登录检查先展示路径、版本、配置全文和敏感边界，再逐宿主授权；push、Release 与 deploy 各自需要 H12 当次授权。

## T11 — Citation Observation 非阻塞维护线

- 对应 PRD/Spec/Plan：T01 PRD 对 M5/v1 的最终决定、Spec 0006/0014、Plan Owner 决定；OBS-CIT-01。
- 目标：持续记录真实 Baseline/Retest 中的 Citation，并在 100 个唯一 Source 后运行独立 Classification/Claim Support 批处理。
- 成功标准：每个 Citation 可定位、去重和追溯并参与 Source identity/provenance/观察指标；40→100 进度可见；queue/classification 采用派生状态或新版本，不修改 frozen Source bytes；批处理不自动批准 Claim，也不改变/supersede任何 Cycle transition。
- 范围外：外部榜单、静态域名 import、为了凑数新增 Query、Cycle gate。
- 前置依赖：T02 后可持续运行；每次真实平台 Observation 仍需相应授权。
- 目标文件：Citation/Source/index、批处理 Plan/Task/Record；不改 Cycle gate 配置。
- 测试要求：重复 Citation、URL normalization、Source identity、低置信度、跨平台 host、分类/Claim Support 分离；active Cycle 从 40→100、index rebuild 和 batch 状态变化后下一 transition 仍成功，required Query/Claim/Evidence 漂移仍失败。
- 验证：Source count、index rebuild、batch threshold、Cycle non-interference 与无 Cycle required ref 的负例。
- 风险：把 Source Type 当 Claim Support，或让维护进度重新阻塞真实 Cycle。
- 当前状态：`proposed`。
- Blocker class：`non_blocking_observation`；不阻塞 T06/T07/T09，是否为 T10 的独立 M5/v1 条件由 T01 PRD 决定。
- Session/Handoff：长期维护按批次生成 Record；每次授权和 batch cutoff 独立，不保持长驻 Session。
