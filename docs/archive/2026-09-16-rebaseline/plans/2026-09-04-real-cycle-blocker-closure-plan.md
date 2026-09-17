---
title: 真实 GEO Cycle 阻塞收口与双周期 v1 行动计划
status: proposed
created: 2026-09-04
updated: 2026-09-04
source:
  - CONTEXT.md
  - CONTEXT-MAP.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/prd/2026-09-04-authorized-real-geo-cycle.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/specs/0013-browser-query-task-mcp-automation.md
  - docs/records/2026-09-02-myyshop-real-cycle-readiness-report.md
  - docs/records/2026-09-03-browser-query-task-mcp-automation-record.md
  - workspaces/myyshop/STATUS.md
  - "2026-09-04 grill-with-docs：Owner 确认双真实 GEO Cycle + M8/v1、英文 Cycle 1、Citation 非阻塞、Agent 主导与 Owner 门禁、跨宿主完成门"
scope: 关闭影响真实 Cycle 1 启动和双周期完整推进的 required gates，并在两个真实 Cycle 后收口 M8/v1；不在本 Plan 中批准 Spec、执行外部动作或发布
baseline: main@d848cdf1ba83a40f3f243e24b66db0f275cec424；clean；origin/main 落后本地 15 个提交
---

# 真实 GEO Cycle 阻塞收口与双周期 v1 行动计划

## 1. 目标与状态边界

总目标是由 Agent 主导完成两个真实 MyyShop GEO Cycle，并在最终稳定快照上通过 M8/v1 完成门。`real_cycle_start_ready:true` 是第一个检查点，不是终点；每个 Cycle 只有所有 Goal track 达到 `review_decided` 且 `completion_scope:full` 才算完整。

本 Plan 是 `proposed roadmap`。它将已确认的产品边界转成审议顺序；authorized-real PRD 与 Spec 0014 获批后必须据其回写本 Plan/Task，才能成为实施依据。本文件不授权真实数据读取、消费者平台操作、Asset Publication、commit、push、PR、release 或 deploy。

## 2. Owner 已确认的执行决定

1. 统一使用 **GEO Cycle**；历史文档中的 “Circle” 仅作为 legacy alias，不创建第二套对象或状态机。
2. 总终点为两个真实 GEO Cycle + M8/v1；`real_cycle_start_ready:true` 是首个可验收检查点。
3. Cycle 1 主线只使用英文 `What is MyyShop?` 的最小 Goal-scoped Real Knowledge Slice；中文只作辅助观察，不等待 86 条 P0 或全部 120 条 legacy knowledge。
4. Citation Observation 当前只记录、归档、去重、索引和做质量观察。40/100 与后续 Classification/Claim Support 是非阻塞维护线，不得阻止任一真实 Cycle transition。
5. Agent 负责计划、实现、验证、执行编排、材料准备和 Record；Owner 负责事实判断、Review、授权、Adoption、Publication、Cycle Review、Cycle 2 Goal 选择和 v1 发布决定。
6. M8/v1 要求两个真实 Cycle `review_decided/full`、Codex/Claude Code native interactive、WorkBuddy 人工语义检查及独立 execution lane 的确定性一致；第三条可比 lane 是 `test_only_semantic_fixture/shared_tool`，不冒充 WorkBuddy native，后者在缺正式合同时保持 optional。

Owner 已明确 Citation 不阻塞真实 Cycle；现有 approved 产品基线是否仍把 100 Source 作为独立 M5/v1 交付门，留给 authorized-real PRD 显式保留或移除。本 `proposed roadmap` 不越级替代该产品决定。

现行 test-only 合同允许 Analytics 输出 `no_signal`、`negative` 或 `insufficient_data` 后完成 Cycle。新的 PRD 必须把“Cycle 合同完成”“M6 一级业务成功”和“v1 release readiness”分开：无正向信号可以进入 decided Review，但不能由本 Plan 自动判定为 M6 业务成功或满足 v1 产品门。

## 3. 完成门

以下是本 Plan 的检查点标签，不新增仓库状态词：

| 检查点 | 可观察完成条件 |
| --- | --- |
| G0 — SDD 可实施 | 新的 authorized-real PRD 与 Spec 0014 依次获 Owner 批准；本 Plan/Task 已按 Spec 回写；可执行红测矩阵冻结 |
| G1 — 工程基线 | 根测试、Cycle/Browser 专项、typecheck、lint、build、plugin/docs/workspace 检查达到声明门；无真实外部副作用 |
| G2 — Cycle 1 Start-ready | 英文 Real Knowledge Slice 闭包、real KBASE 绑定、全部启动前只读检查通过，报告 `real_cycle_start_ready:true` |
| G2A — Safe-to-create | 计划级 go/no-go：M6 real advance/Review/Trace 与 M5 reviewed successor 工程 seam 已验证，创建后不会因已知代码硬阻塞停在 `frozen`；它不是新的仓库状态 |
| G3 — Cycle 1 完成 | Cycle 1 每阶段有真实对象和 Record，最终 `review_decided/full` |
| G4 — Cycle 2 完成 | Goal 来自 Cycle 1 decided Review 与 Owner 选择，完整重复九阶段，最终 `review_decided/full` |
| G5 — M8/v1 readiness | 两个真实 Cycle、two-cycle retrospective、最终 M8 跨宿主门与 release-readiness package 完整；实际 Release/Record 仍在单独授权后成立 |

不得把 G0–G5 合并成一个“已完成”，也不得用后一个检查点反向补写前一个检查点的证据。

## 4. Blocker 分类规则

每个 blocker 必须声明它阻止的具名检查点或 Cycle transition：

- `required_for_start`：阻止 G2 或 `create-cycle`；
- `required_for_cycle_stage`：阻止某个真实 Cycle 阶段；
- `required_for_cycle2`：只阻止 Cycle 1 Review 后的 Cycle 2；
- `required_for_v1`：不阻止 Cycle 运行，但阻止 G5；
- `non_blocking_observation`：只记录进度、风险或未来优化，不得阻止 Cycle。

## 5. 当前 Blocker Registry

| ID | target | owner_role | evidence_refs | 当前 blocker | resume_condition | classification |
| --- | --- | --- | --- | --- | --- | --- |
| B-SDD-01 | G0 | Product Owner | `docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md:19,62,125`；Spec 0007/0008 | 现有 PRD/Spec 只批准 test-only，缺 authorized-real/v1 产品与系统合同 | PRD → Spec 0014 → 回写 Plan/Task 依次批准 | `required_for_start` |
| B-ENG-01 | G1 | Engineering Lead | `docs/records/2026-09-03-browser-query-task-mcp-automation-record.md:93-105` | 根测试 350/353，时间性单测直接消费已过期 Analytics 授权 | fixture/注入时钟使测试确定；运行时 expiry 仍 fail closed | `required_for_start` |
| B-ENG-02 | G1/G5 | Browser Lead | 同上；Extension package/test config | Vitest 误收 Node Test、lint 8 errors、Nuxt build 不退出 | 默认全量命令各自 exit 0 | `required_for_start` |
| B-GOV-01 | G5 | Plugin Maintainer | `docs/records/2026-09-03-all-branches-main-consolidation-record.md` | 重复/过期 Agent 指令含未固定联网命令、旧 SQLite/Turso 导航与冲突凭据建议 | active/inactive 清单完成；危险指令隔离、去重或重生成 | `required_for_v1` |
| B-M3-01 | G2 | Facts Owner | `workspaces/myyshop/workspace.json:12-13`；Readiness Report `:20-25,39-46` | `knowledge_base_ref:null`、`real_pending`，无 real KBASE | 英文 Real Knowledge Slice 与 membership manifest 获批并显式绑定 | `required_for_start` |
| B-M3-02 | G2 | Facts Owner | `cycles/preparation/goal-myyshop-definition-001.md:8-16`；`queries/formal/q-myyshop-what-is-en-baseline-001.md:8-22`；`knowledge/answer-cards/ans-myyshop-what-is-001.md:8-18` | Goal/Answer Card 与正式英文 Query/Query Set 未形成同 KBASE 闭包 | 新版本 exact-pin English Query、QS、Answer Card、Claim/Evidence/Document/KR | `required_for_start` |
| B-G2A-01 | G2A | Engineering Lead + Facts Owner | Spec 0007 `:229-233`；`assets/own/ast-myyshop-about-001.md:9-25` | 旧 Asset 绑定旧 Query/KR；缺新 Goal 的 Asset、五个 frozen Baseline Profile、relative Retest schedule template、measurement/rule/policy 与 create plan | 版本化 operational package 通过 create dry-preflight；未来 Retest Profile 不在 Publication 前伪造 | `required_for_start` |
| B-M5-01 | `baseline_recorded` | GEO Reviewer + Owner | `cycle-gates.mjs:37-61`；`manual-review-batch.mjs:18-29` | 10 个 Review 都是 candidate；无 decision→reviewed successor seam，旧 AGG 也只引用 candidate | Owner decision artifact→新 ID reviewed successor；五个平台创建 exact-pin 新 ID AGG successor，均保留 `supersedes_ref` | `required_for_cycle_stage` |
| B-M5-02 | `answer_retest_completed` | Browser Lead + Platform Operator | `extractor.ts:7-24`；`browser-query-result.mjs:205-220`；Spec 0013 `:166-172` | Browser extraction 只有 fake/disabled，Cowork intake 只接受 fixture；五平台 manual_only；non-model extractor 会改变 approved Spec 0013 | PRD/Spec 0014 在规则型 extractor 与逐次获授权模型 extractor 中明确选择；若选前者，显式修订/替代 Spec 0013 与 Browser Context；闭合 CQI→capture→pending→M5→ack/recovery | `required_for_cycle_stage` |
| B-M5-03 | 所有 active Cycle transition | Lifecycle Lead | `source-batch.mjs:25-80`；`answer-manual.mjs:253-260` | Source queue/classification 原地变化可能触发 CIS input drift，间接阻塞 Cycle | queue 状态变为派生数据或新版本；40→100 跨阈值 non-interference 红测通过 | `required_for_cycle_stage` |
| B-M4-01 | `diagnosis_ready` / `adoption_decided` / `publication_confirmed` | Facts Owner + Site Owner | M4 real collection Record `:139-145`；Spec 0005 `:199-234` | 无真实 Gap decision、Proposal、Adoption、Publication | 逐目标读取授权→Gap decision→Proposal→Adoption→实际 Publication | `required_for_cycle_stage` |
| B-M4-02 | `publication_confirmed` | Lifecycle Lead + Site Owner | `cycle-gates.mjs:70-79` | Publication gate 强制 `.invalid`，且预授权/事后 attestation 未分离 | real locator/proof/read-back + 独立 attestation；test-only 仍限 `.invalid` | `required_for_cycle_stage` |
| B-M6-01 | G3 全阶段 | Lifecycle Lead | `cycle-lifecycle.mjs:185-214,280-329`；`cycle-trace.mjs:182-243,262-310,393-398` | advance/Review/Trace 固定 test scope；失败可能先留 CIS 半成品 | execution-scope-aware zero-write preflight、CAS、恢复、real Review/Trace 红测通过 | `required_for_cycle_stage` |
| B-M6-02 | G3 全阶段 | Lifecycle Lead | `cycle-gates.mjs:37-92` | gate 只按数量/状态，未校验完整 Query×Platform×slot×window 和 Cycle/Goal ownership | transition CIS 对 exact matrix/ref/version/hash/scope 全闭合 | `required_for_cycle_stage` |
| B-M6-03 | `analytics_recorded` | Analytics Owner | real-cycle Runbook `:60-82`；当前 ANO/BSIG | 旧授权已过期，现有 Observation 无当前 Cycle/Goal/schedule 绑定 | 每次新授权；当前 Cycle/Goal/window ANO/BSIG 完整，无文件保持 not_applicable | `required_for_cycle_stage` |
| B-M6-04 | `review_decided` | Owner | Spec 0007 `:434+`；`cycle-trace.mjs` | real waiting/decided Review 与统一 decision seam 未实现/执行 | 独立 Owner decision artifact→新 decided CRV；waiting bytes 不变 | `required_for_cycle_stage` |
| B-M7-01 | G4 | Lifecycle Lead + Owner | `strategy-workflow.mjs:78-93`；`cycle-goal-*.mjs`；`cycle-two-apply.mjs:425-466` | Candidate/GSEL/Strategy/Cycle2 固定 synthetic；Product Gap filter 顺序不足 | real ordinary candidate；不合格 Product Gap withheld；Strategy gates 后重建 batch，再 GSEL/apply | `required_for_cycle2` |
| B-M8-01 | G5 | Conformance Lead + Owner | Spec 0009 `:382-469`；M8 Record `:17-37` | 现有 CFP/CFR/ERC 只能表达 test-only/optional-not-executed，不能记录双 real Cycle/native/manual | v2/独立 acceptance exact-pin 两 Cycle/CRV 与 host evidence | `required_for_v1` |
| B-M8-02 | G5 | Conformance Lead | `geo-conformance.mjs:82-109`；`conformance.mjs:88-105` | 中央流程把一个 digest 复制给五项 execution，未证明独立宿主运行 | 独立 host runner/output manifest；Codex/Claude native 与 WorkBuddy semantic fixture 分别产证再比较 | `required_for_v1` |
| B-M8-03 | G5 | Workspace Owner | real-cycle Runbook `:44`；`workspace-scope.mjs:189-195` | 过早 archive dev-test KBASE 会破坏最终 M8 deterministic conformance | `KBASE-MYYSHOP-DEVTEST-001` 至少保持 frozen 到 G5 完成 | `required_for_v1` |
| B-M8-04 | G5 | Conformance Lead | Spec 0009 `:416-431,523-547` | 现有 contract pins/tool closure 不包含 Spec 0010–0014、Browser real materializer、新 Schema/entry/runtime resources | v2 acceptance 使用完整 repo manifest + 显式 recursive Tool closure，并有漏 pin/漏 import 红测 | `required_for_v1` |
| OBS-CIT-01 | M5 maintenance | GEO Analyst | `workspaces/myyshop/STATUS.md:21-22` | 40/100 Source，Classification/Claim Support 为 0 | 持续记录；达到 100 后按 PRD 决定的 M5/v1边界独立批处理 | `non_blocking_observation` |

M2 本地 Contract Kernel 与 M3 历史切片的 proposed 文档状态、真实 `ops-geo` 缺席、WorkBuddy native 缺席均保留为治理或未来集成事项，不升级为真实 Cycle blocker。

## 6. 实施工作流

### Phase 0 — PRD、Spec 与红测矩阵冻结

目标：先审阅当前 `proposed` 的 `Authorized-real GEO Cycle & v1` PRD；PRD 获批后再建立 `Spec 0014 — Authorized-real GEO Cycle Execution`，不直接修改 test-only 代码语义。

PRD 至少决定：两个真实 Cycle 的用户旅程、英文 Cycle 1、Agent/Owner 分工、真实 Publication、观察窗、无正向信号时的 M6 业务验收、100 Source 是否仍为独立 M5/v1 门，以及 M8/v1 的业务完成定义。

Spec 0014 至少明确：

- `synthetic_test` 与 `authorized_real` 的共享状态机和不同 proof requirements；
- real KBASE membership 的机器可验证表达；推荐使用 versioned membership manifest exact-pin `id/type/version/path/hash`，不得仅按 Workspace 目录推断；
- Goal/Query/KR、membership manifest 和 CIS exact binding，并由 Readiness/create/freeze 共用同一 validator；
- 九阶段真实 gate 的对象、版本、checksum、scope 与失败码；
- reviewed Answer Review 的人工 successor/lineage；
- 统一 decision-materialization seam：Owner 先提供独立、可校验的 decision artifact/approval（ref、checksum、scope），确定性 Tool 只据此物化新 successor，不能生成或改写决定；覆盖 Gap、Review、Adoption、Publication attestation、Cycle Review、STA/DDM、GSEL 与 Goal；
- real Publication locator、attestation、proof artifact 与回滚边界；
- 真实 Browser/manual capture、隐私和 materialization；
- Browser extraction 技术分支：规则型 non-model extraction，或逐次获授权的 model/prompt/schema extraction；若采用前者，必须显式修订/替代 approved Spec 0013 和 Browser Context，不得由本 Plan 静默决定；
- 两阶段时间绑定：create-cycle 只 pin 五个 Baseline Profile 与 relative Retest schedule template；`technical_retest_completed` 后以其完成时间为 anchor 解析 W1–W4 绝对窗口、创建 20 个 frozen Retest Profile 和 versioned schedule，并由 transition CIS pin；所有 Retest capture 必须晚于对应 Technical Retest；
- 若 Week 4 决定延长，以新决定创建 schedule successor 与 W5–W8 Profile，不修改 base CIS、既有 schedule/Profile，也不等待结果变好；
- `no_signal/negative/insufficient_data` 是合法 Cycle 结果；
- real Review/Trace、Cycle 2 Candidate/GSEL/apply；
- Citation Observation 与 100 Source 永远不作为 Cycle gate，并保证 Source queue/classification 演进不会通过 frozen input drift 间接 supersede active Cycle；
- M8/v1 的 native/manual 完成门，以及能够 exact-pin 两个 real Cycle/decided Review 的 v2 profile/result 或独立 v1 acceptance 对象；不得把 real 对象塞进现有 test-only CFP/CFR/ERC。

批准前只冻结文档化场景/失败用例矩阵，不执行代码红测。Owner 依次批准 PRD、Spec 0014、回写后的 Plan/Task并明确授权本地实现后，才从可执行失败测试开始；任一批准缺失即停止。

### Phase 1 — 恢复可依赖工程基线

1. 将 Analytics CLI 单测与真实授权文件解耦，使用固定 fixture 或注入时钟；运行时仍按真实当前时间 fail closed。
2. 修正 Vitest include/exclude，使默认命令不误收 Node Test；保留 Node Test 独立入口。
3. 修复 Extension lint error；warning 只有影响声明门时处理，不做无关格式化。
4. 诊断 Nuxt/Nitro/PGlite build 不退出，要求完整 build exit 0，而非只认日志。
5. 并行准备导入 Agent 指令的 active/inactive 清单；该治理线不阻止 G2，但必须在 G5 前完成。在来源和语义复核前，不让其覆盖根 AGENTS/Spec。

G1 退出门：全仓与 Cycle/Browser 专项在相同 checkout 可重复通过；构建正常结束；新增变更 `git diff --check` 通过；已知上游字节例外单列而非冒充全绿。Agent 指令治理按 B-GOV-01 保留为 G5 依赖，不混入 G2。

### Phase 2 — M6 Authorized-real Cycle 1 Parity

按红测推进最小代码切片：

1. T03A 先让 Readiness、create-cycle 与 freeze 使用同一 real KBASE mode/status/approval/membership validator；invalid status/approval/cross-KBASE object 必须返回同一稳定错误并 zero-write。T03A 是 G2 前置。
2. Cycle transition 根据 execution scope 选择 proof profile；real 对象不得携带 test-only 声明，test-only 路径不得被放宽。
3. 在写 transition CIS 前完成全部无副作用预检；失败不得留下半成品。
4. Baseline gate 校验冻结 Query×Platform×ordinal×Collector Profile×time window 的完整矩阵，以及 reviewed Review 和 Aggregation lineage。
5. Publication gate 对 real 路径校验真实 locator、approved Asset、Adoption、attestation 和 proof；对 test-only 仍只接受 `.invalid`。
6. Analytics gate 校验 ANO/BSIG 属于当前 Cycle/Goal/measurement window；没有正向信号仍允许完成。
7. Review assemble/decide 与 Trace 支持 real Cycle，completed trace 只从冻结 snapshot 恢复。
8. Citation/Source 继续追加、queue 跨过 100 和 Classification/Claim Support 新版本不得构成 required freeze drift；修改 Query/Claim/Evidence 等 required input 仍须 fail closed。

退出门分两层：T03A shared validator 先满足 G2；T03B 在隔离临时 Workspace 上让 authorized-real 合同路径无外部副作用地覆盖一个 Cycle 的九阶段、人工 decision seam、失败/恢复/并发/漂移，满足 G2A。这仍只证明工程能力，不是真实 MyyShop Cycle。M7/Cycle 2 parity 在 Phase 6/T08 单独验收。

### Phase 3 — 英文 Real Knowledge Slice 与 M5 Review 准备

本 Phase 与 Phase 1/2 并行，但严格区分 G2 启动门和 `baseline_recorded` 阶段门。

G2 Real Knowledge Slice：

1. Cycle 1 required Query Set 固定为 `QS-MYYSHOP-DEFINITION-EN-BASELINE-001@1.0.0`，且只含 `Q-MYYSHOP-WHAT-IS-EN-BASELINE-001@1.0.0`（`What is MyyShop?`）。
2. 中文 Query 仅为 non-blocking observation，不进入 Cycle 1 frozen Query Set、CIS、Goal track 或任何 required gate。
3. 对既有正式英文 Query/Platform Answer Baseline 做 version、语义合同和 artifact 复核。
4. 为同一语义 Goal 创建新的批准版本，闭合 real Document、Claim、approved Evidence/Source、英文 Answer Card、内部 Knowledge Release 与 KBASE membership manifest。
5. 事实 Owner 只需审核并批准本次 Claim/KR membership manifest 选中的最小 Evidence 子集，逐项决定支持范围、limitations 和待补 data/case；其余 11 份一方网页 candidate Evidence 保持非阻塞 backlog，可并行审阅，不进入 T06A 依赖。
6. 创建 real KBASE 后，把 `workspaces/myyshop/workspace.json` 显式切换为该 KBASE；不复制或提升 development-test 对象。`KBASE-MYYSHOP-DEVTEST-001` 至少保持 `frozen` 到最终 M8/v1 snapshot 验收完成，之后是否 archive 另行决定。

G2 退出门：Workspace/Knowledge/Portfolio/Readiness 四道只读检查通过，且 `real_cycle_start_ready:true`。Answer Review、Citation 数量、Publication、Retest 和 Analytics 均不参与该判定。

G2A operational input preparation（不影响 G2）：

7. T05B 版本化准备至少一个 exact-bind 新 Goal/Q/KR/Claim 的 Asset、五个与 primary Query 匹配的 frozen Baseline Profile、relative Retest schedule template、measurement/rule/policy artifacts 和 Cycle create plan；不覆盖现有 Asset/Profile 历史，也不在 Publication 时间未知时伪造未来 Retest Profile。
8. T06B 只负责独立 dry-preflight/QA，不在验收阶段临时创建这些前置对象。

`baseline_recorded` 前的并行人工门：

9. T04 先完成 reviewed successor/decision 与精确 Aggregation 的工程 seam；这可以与 real KBASE 准备并行。
10. real KR 批准后，Owner 再审阅现有 10 个 candidate Answer Review。每个新 ID reviewed successor exact-pin predecessor、Sample raw hash、rubric、KR/Claim version 和 Owner decision；Agent 为五个平台创建新 ID Aggregation successor，精确引用对应两个 reviewed successor。两类对象均用 `supersedes_ref` 保留 lineage，不改写历史对象。
11. 40 Source、0 Classification/Claim Support 仍允许 Review、Aggregation 与 `baseline_recorded`，但必须输出 `SOURCE_CLASSIFICATION_DEFERRED` 观察，不得回流为 Cycle gate。

### Phase 4 — 独立 QA 与真实 Cycle 1 创建

1. G2 Readiness QA 只依赖获批 SDD、G1 中与 Readiness 有关的工程门、T03A shared validator 和英文 real KBASE；重跑 Workspace 校验、知识闭包、敏感信息、zero-write 与 Readiness。
2. 先独立记录 `real_cycle_start_ready:true`；T04 的真实 Owner Review、Browser Retest、Publication 与 Analytics 均不得反向阻止该结果。
3. 进入计划级 G2A Safe-to-create 时，再要求 T03B 的 M6 real advance/Review/Trace 与 T04 的 reviewed successor/Baseline gate 工程 seam 通过独立红测；无需先产生真实 reviewed 对象。
4. Agent 展示 Cycle plan、所有 frozen refs/version/checksum、目标 Workspace、预期首阶段与停止条件，证明创建后不存在已知代码硬阻塞。
5. Owner 当次明确授权后才执行真实 `create-cycle`。

退出门分开记录：G2 是只读 Start-ready；G2A 是 operational go/no-go；随后真实 Cycle 1/CIS/Run 已创建且 frozen 输入可复验。创建本身不代表 Baseline、Gap 或业务结果成立。

### Phase 5 — Agent 主导完成真实 Cycle 1

按状态机逐门推进：

```text
frozen
→ baseline_recorded
→ diagnosis_ready
→ adoption_decided
→ publication_confirmed
→ technical_retest_completed
→ answer_retest_completed
→ analytics_recorded
→ review_waiting_human
→ review_decided/full
```

- Baseline 优先复用已验证的英文两槽结果；必须先证明 frozen Query/Profile/time-window 与 real Cycle 精确相容，并完成 reviewed Review lineage。
- real KR 批准后，Owner 审阅 10 个 candidate Review；Agent 依据独立 decision artifact 物化新 ID reviewed successor，并为五个平台创建引用新 Review 的新 ID Aggregation successor；两者均保留 `supersedes_ref`，不原地 bump。
- Agent 在逐目标公开读取授权下运行真实诊断并准备 Proposal；Owner 先判断 Gap `open/dismissed`，再决定 Proposal Adoption。
- 至少一个 accepted/modified item 必须实际发布并提供 proof；H7a 明确授权且存在受控发布能力时可由 Agent 执行，否则由目标站点 Owner 执行。写入后先 read-back，再由 H7b 独立 attestation 确认；预授权不能物化 `publication:confirmed`，提交状态未知不得自动重试。
- H8a 单独授权 Technical Retest 的精确 URL/allowlist/artifact/retention；Publication 写授权不能代替该只读授权。
- `technical_retest_completed` 后，以其完成时间解析 relative schedule，创建五平台×W1–W4 共 20 个 frozen Retest Profile 和 versioned schedule，由 transition CIS pin；所有 Retest capture 必须在对应 Technical Retest 之后，后加 Profile 不得被误判为 base freeze drift。
- H8b 按平台、入口、Profile、method 和每个 window 逐 Run 授权 Platform Answer Retest。当前 1 Query×5 平台×2 slots 需要 40 个 Retest Sample、40 个 reviewed Review 和 20 个按平台/窗口 Aggregation 全部闭合后，才进入 `answer_retest_completed`。
- Week 4 若证据支持延长，由 Owner 另作 schedule decision，新增 W5–W8；不得改写原窗口、引发无关 CIS drift，或仅等待结果变好。
- H8c 对每次真实 Analytics 读取单独展示资源、scope、时间窗、输出路径和撤销责任；Observation window/as-of 必须绑定批准的 Retest schedule。
- `no_signal`、`negative`、`insufficient_data` 可进入 Review，但必须保留 limitations 和 forbidden conclusions。
- Agent 准备 waiting Review；Owner 作决定后生成新的 decided Review。

Citation 在所有 Baseline/Retest 中继续记录；40→100 和后续分类并行运行，不出现在 transition required gates 中。

### Phase 6 — 在 Cycle 1 观察窗内准备真实 Cycle 2

可以并行完成 M7 authorized-real 工程和独立 QA，但不得提前选择 Cycle 2 Goal。

Cycle 1 `review_decided/full` 后：

1. 候选生成器从 decided Review 读取全部候选输入；没有 Strategy closure 时，确定性输出普通候选并把 Product Gap 标为 `withheld` 及原因，不能因混合 Review 阻塞普通 batch，也不能由 plan 任意删除输入。
2. 若 Owner 要把某个 Product Gap 纳入候选，先单独显式触发 Strategy，依次完成 STA `decided/proceed`、DDM `candidate→validated` 的 validation decision、使用不同 decision ref 的 `validated→decision_factor/promoted`、STO，再以新 rule/new GCB ID 重建包含合格 Product Gap 的 Candidate Batch。
3. Owner 在最终 Candidate Batch 上独立决定 GSEL；不得先选择尚未通过 Strategy gates 的 Product Gap。
4. Owner 批准 Cycle 2 Goal；Agent 建立或更新对应 Real Knowledge Slice 和 frozen Query Set。
5. 对 Cycle 2 重复 G2/G2A：除 Knowledge closure 外，另准备 exact-bind 新 Goal/Q/KR/Claim 的 Asset、五个 frozen Baseline Profile、relative Retest schedule template、measurement/rule/policy artifacts 与 Cycle plan；Retest Profile 仍在 Publication 后生成。
6. 重新执行 Readiness、Safe-to-create dry-preflight 与独立 QA，再取得 create-cycle 当次授权。

### Phase 7 — 完成真实 Cycle 2

Cycle 2 完整重复 Phase 5 九阶段和默认观察窗，不以 Cycle 1 的授权、Publication、Analytics 或 Review 代替。完成后形成 two-cycle comparison 与 Retrospective，但不得把流程完成写成正向业务效果。

### Phase 8 — M8/v1 收口

1. 完成 Agent 控制面 active/inactive 清单，隔离未固定联网安装、过期导航和冲突凭据指令。
2. 两个真实 Cycle 后设置短暂 freeze barrier：等待所有 Run/lease 收敛，暂停 T11 和其他 Workspace writer，固定 repo、dev-test KBASE、两个 real Cycle/CRV 与 as-of cutoff；cutoff 后 Citation 进入后续 Run，不回写 v1 证据。
3. `KBASE-MYYSHOP-DEVTEST-001` 至少保持 `frozen` 到本 Phase 完成；不按旧 Runbook 提前 archive。
4. 保留现有 development-test 确定性 conformance；用 Spec 0014 的 v2 profile/result 或独立 v1 acceptance 对象 exact-pin 两个 real Cycle 与 decided Review，并把 Spec 0010–0014、Browser real materializer、新 Schema/entry script、recursive imports 与 runtime resources 纳入完整 repo manifest + Tool closure。
5. Codex、Claude Code 分别经独立 runner/Session 执行 native interactive smoke；不得由中央流程复制同一 digest 自报多宿主通过。
6. WorkBuddy manual 只验证配置和跨会话继续，保持 `native_host_verified:false/contract_unavailable`；第三条可比 execution lane 明确标记 `test_only_semantic_fixture/shared_tool`，不写成 WorkBuddy 宿主真实执行。
7. Codex native、Claude native 与 test-only semantic fixture 三条可比 lanes 对相同确定性输入分别生成 output manifest，至少覆盖 indexes、Finding、trace、cycle_result、diagnostics 和 validation，再比较 digest；差异 fail loud。WorkBuddy manual evidence 不进入该 digest 比较。
8. 复验 delegation contract、capability matrix、security/redact、sample Workspace 与 cloud-readiness export，形成 two-cycle Retrospective、draft Release Notes、Runbook、release candidate checklist 和未完成云端化事项。
9. H12 前最多达到 `release-ready`；只有 H12 明确授权、实际 Release 与发布后检查完成后，才创建 verified Release Record。push、deploy 仍各自需要当次授权。

## 7. 并行工作与关键依赖

```text
Phase 0 PRD→Spec→Plan/Tasks批准
├─ Phase 1 工程基线
├─ Phase 2 authorized-real runtime
├─ Phase 3 英文 real KBASE + Review
└─ Citation 维护线（始终非阻塞）
          ↓
      独立 QA + Start-ready
          ↓
       Real Cycle 1
          ├─ 4 周观察窗
          └─ 并行准备 M7 real parity
          ↓
      Owner 选择 Cycle 2 Goal
          ↓
       Real Cycle 2
          ↓
        M8 / v1
```

Cycle 2 Goal 必须来自 Cycle 1 decided Review，因此两个真实 Cycle 的观察窗不可并行。按当前默认 4 周窗口，业务运行部分理论下限约 8 周，另加 SDD、工程、知识和发布准备时间。

## 8. Owner Gate 套件

Agent 到每个人工门时必须一次性提供：目标、当前状态、完整候选或操作内容、证据与反证、影响范围、推荐答案、替代方案、停止条件、可恢复性以及将写入的确切路径/外部目标。

| Gate | Owner 决定 | Agent 在决定前不得做什么 |
| --- | --- | --- |
| H1a | 批准 authorized-real PRD | 不起草定稿 Spec 或把 roadmap 当产品批准 |
| H1b | 批准 Spec 0014、回写后的 Plan、Task 与本地实现 | 不运行代码红测或开始 real-path 实现 |
| H2 | 批准英文 Goal、事实、Evidence、Claim、Answer Card、KR | 不创建/切换 real KBASE |
| H3 | 审阅 Answer Review | 不生成 reviewed successor |
| H4 | 授权创建真实 Cycle | 不执行 `create-cycle` |
| H5a | 逐目标授权 Site/Research 读取范围、artifact 与保留期 | 不访问未列入 allowlist 的 URL/来源 |
| H5b | 判断 Gap `open/dismissed` | 不把 Agent Finding 自动升级为业务 Gap |
| H6 | 决定 Proposal Adoption | 不生成 decided Adoption |
| H7a | 查看 exact target/content/diff/rollback 后授权 Publication 执行 | 不写外部站点；未知提交状态不得自动重试 |
| H7b | 对 read-back locator/hash/time/proof 作事后 attestation | 不生成 `asset_publication:confirmed` |
| H8a | 单独授权 Technical Retest 只读目标 | Publication 写授权不自动覆盖 Retest |
| H8b | 按平台/Profile/window/Run 授权 manual Platform Answer Retest | 不继承其他平台或其他周的授权 |
| H8c | 按资源/时间窗逐次授权 Analytics 只读 | 不复用过期决定或一张总授权覆盖多次读取 |
| H9 | 决定 Cycle Review | 不生成 decided Review |
| H10S1 | 明确是否为某 Product Gap 调用 Strategy | 普通候选分支不等待该决定 |
| H10S2 | 独立决定 STA 是否 `proceed` | 不创建 promoted factor 或 STO |
| H10S3a | 独立决定 DDM `candidate→validated` | 不复用 STA decision ref，不提前提升为 factor |
| H10S3b | 使用另一 decision ref 决定 DDM `validated→decision_factor/promoted` | 未 promoted 时确定性 withhold Product Gap |
| H11a | 在最终 Candidate Batch 上独立决定 GSEL | Selection 不自动批准 Goal |
| H11b | 使用不同 decision artifact/ref 独立批准 Cycle 2 Goal | 不复用 Review/GSEL approval，不创建 Cycle 2 |
| H-M8a | 授权 Codex native 安装/配置/交互检查 | 不修改未展示的本机配置，不记录账号标识或凭据 |
| H-M8b | 授权 Claude Code native 安装/配置/交互检查 | 不继承 H-M8a 授权 |
| H-M8c | 批准 WorkBuddy manual 配置全文与人工执行 | 不把 manual 结果冒充 native 或 deterministic output |
| H12 | 批准 v1 Release、push 或 deploy | H12 前只准备 release-readiness package，不执行远端或生产动作 |

## 9. 验证策略

### 9.1 每个实现 Slice

- 先建立目标失败测试，再实现最小行为；
- 正常、非法、边界、重复、并发、依赖失败、中断恢复、权限、Scope 和跨进程场景；
- test-only 与 authorized-real 双向污染负例；
- 外部调用默认 Fake/loopback，真实系统只在 H Gate 后使用；
- 每个 Slice 更新独立 Record，失败和未验证项不得省略。

### 9.2 G1 最低全量门

```bash
npm test
npm run validate:plugin
npm run check:docs
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop-development-test --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop-development-test --check

cd plugins/geo-browser-extension
npm run test:extension
npm run test:browser-query
./node_modules/.bin/vitest run
npm run lint
npm run typecheck
npm run build:extension
npm run build
```

实际实施前由 Spec 0014 补充 authorized-real 专项命令。`npm run build` 必须真实 exit 0；测试数量只记录实际结果，不预写未来数字。

### 9.3 业务与生产边界

- Automated tests 不替代日常 Chrome Profile、真实 Publication、真实 Retest、Analytics 或 Owner Review；
- `real_cycle_start_ready:true` 不替代 `create-cycle` 授权；
- Release/部署成功不替代业务效果；
- Citation 数量、正向流量或排名不是 Cycle 完成硬门。

## 10. 停止条件

出现以下任一情况，Agent 停止受影响路径、记录 blocker 并请求 Owner 决定：

- Spec 0014、Plan 或 Task 未批准，或实现发现它们冲突；
- real/test scope、KBASE membership、版本、checksum 或冻结输入漂移；
- 需要扩大真实 API scope、读取 PII/逐用户数据、保存凭据或突破平台 `manual_only`；
- 需要真实模型、付费资源、外部 Publication、远端写入、release 或 deploy，但没有当次授权；
- Publication/Retest/Analytics 证据不足，或提交状态未知可能导致重复外部动作；
- 全量门失败且原因无法归入已批准范围；
- Cycle track 全部 recommendation 被拒绝，需要 Owner 决定取消而非伪造 Publication；
- Cycle 1 Review 没有 eligible Cycle 2 candidate，或 GSEL 全部 rejected/deferred；不得杜撰 Goal，G4 等待新 Evidence/新 Review 或 Owner 明确取消 v1 目标；
- 观察结果为负或无信号时，只允许如实进入 Review，不得改口径追求“成功”。

## 11. 本 Plan 不做的事项

- 不把全部 legacy knowledge、100 Citation Source 或正向业务指标设为 Cycle gate；
- 不自动批准 Evidence、Claim、Review、Adoption、Publication、Cycle 2 Goal 或 Release；
- 不把 synthetic/test-only 对象复制、合并或提升进 real KBASE；
- 不为通过门禁伪造真实 URL、Publication、平台回答、Analytics 或业务文件；
- 不把 Strategy 设为每个 Cycle 2 的必经步骤；
- 不在本次规划中执行 commit、push、PR、真实读取、发布或部署。

## 12. 下一授权点

下一步不是直接实现，而是由 Owner 审阅 proposed authorized-real/v1 PRD 的 D1–D5；PRD 获批后再起草 Spec 0014，随后按 Spec 回写本 Plan 和 child Tasks。只有 Owner 依次批准 PRD、Spec、Plan/Tasks 并授权本地实现后，才进入 Phase 1。
