---
title: Authorized-real GEO Cycle 与 v1 收口 PRD
status: proposed
created: 2026-09-04
updated: 2026-09-04
source:
  - CONTEXT.md
  - CONTEXT-MAP.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/prd/2026-08-24-m5-consumer-answer-testing.md
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/prd/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - docs/prd/2026-09-03-browser-query-task-mcp-automation.md
  - docs/plans/2026-09-04-real-cycle-blocker-closure-plan.md
  - docs/records/2026-09-04-real-cycle-blocker-closure-planning-record.md
  - "2026-09-04 Owner 指令：批准起草，不等于批准 PRD"
scope: MyyShop authorized-real 双 GEO Cycle、Agent 主导/Owner 门禁、真实 Publication/Retest/Analytics、Cycle 2 选择及 M8/v1 产品体验与业务验收；不定义 Schema、代码或部署方案
---

# Authorized-real GEO Cycle 与 v1 收口 PRD

## 1. 产品问题

geo-cowork 已验证 knowledge-independent、synthetic/test-only 双周期和部分真实只读输入，但真实 MyyShop 仍没有可启动的 real KBASE，现有运行能力也只证明可以创建 authorized-real Cycle，不能证明能安全推进和完成。用户需要一个由 Agent 主导、在关键事实与外部门由人决策的真实产品旅程，而不是继续把局部工程绿灯、fixture 或文档状态解释为真实 Cycle 或 v1 完成。

当前还存在三类容易混淆的结果：

- `real_cycle_start_ready:true` 只说明真实知识与启动输入就绪；
- Cycle `review_decided/full` 只说明一个真实周期按合同完成并形成业务复核；
- v1 readiness、实际 Release 和业务效果是后续不同门，不能互相替代。

## 2. 核心用户与协作角色

### 2.1 核心用户

MyyShop 当前研发负责人，也是本阶段 Product Owner。该用户希望由 Agent 承担持续编排和证据整理，只在真正需要人类判断、授权或外部责任时介入。

### 2.2 协作角色

- **Agent**：准备候选、执行获授权步骤、验证、恢复、追踪 Blocker、生成决策包、Record 和 Handoff；不得自行决定业务事实或越过外部门。
- **Facts Owner / GEO Reviewer**：批准事实、Evidence 支持范围、Claim、Answer Card、Knowledge Release、Answer Review 和 Gap。
- **Site Owner**：决定 Adoption，批准或执行真实 Asset Publication，并在事后确认发布证明。
- **Platform Operator**：在 `manual_only` 边界内完成必须由人执行的登录、提交和结果确认。
- **Analytics Owner**：逐次确认真实数据资源、scope、时间窗、输出和撤销责任。
- **Independent Reviewer**：在 Start-ready、Safe-to-create、每个 Cycle 完成和 M8/v1 前独立复验，不接受执行 Agent 自证。

同一人可以承担多个角色，但每个决定的角色、时间、scope 和 decision ref 必须清楚，且不同阶段不能因为角色相同而自动继承授权。

## 3. 产品目标

1. 让用户清楚看到当前阻塞的是知识输入、运行能力、人工决定、外部操作、观察窗口还是 v1 门。
2. 以英文 `What is MyyShop?` 的最小真实知识切片达到 Cycle 1 Start-ready，不等待全部 legacy knowledge。
3. 在创建真实 Cycle 前提供独立 Safe-to-create go/no-go，避免生成一个已知无法推进的孤立 Cycle。
4. 由 Agent 主导完成真实 Cycle 1 的 Baseline、Diagnosis、Adoption、Publication、Retest、Analytics 和 Cycle Review。
5. 只从 Cycle 1 decided Review 产生 Cycle 2 候选，由用户独立选择并完整完成 Cycle 2。
6. 在最终稳定快照上完成 Codex/Claude native、WorkBuddy manual/semantic fixture 与跨 Session M8/v1 验收。
7. 全程保留原始证据、版本、失败、负面结果和未验证边界，不要求结果必须正向。

## 4. 产品非目标

- 不把 86 条 P0 或全部 120 条 legacy knowledge 设为 Cycle 1 启动门；
- 不自动批准 Evidence、Claim、Answer Review、Gap、Adoption、Publication、Cycle Review、Cycle 2 Goal 或 Release；
- 不自动发布官网、媒体或其他外部资产；
- 不突破消费者平台 `manual_only`、Terms、robots、账号或隐私边界；
- 不用 API、其他平台或成功重试替换真实平台的 refusal、timeout、no result 或 challenge；
- 不要求正向 GEO、访问、注册或业务结果来伪装流程完成；
- 不把 Knowledge Release 当作外部 Publication；
- 不把 WorkBuddy manual 或 semantic fixture 说成 WorkBuddy native；
- 不在本 PRD 中选择数据库、Schema、类、函数、文件结构、Agent 数量或部署技术；
- 不授权 commit、push、PR、真实数据读取、真实模型、Release 或 deploy。

## 5. 用户旅程

### 5.1 查看真实 Cycle 阻塞图

用户首先看到具名 Blocker：它阻止哪个检查点或 Cycle transition、当前证据、负责角色、解除动作和恢复条件。warning、未来观察时间、Citation 数量和 optional 未执行项不会被笼统展示为 Cycle Blocker。

### 5.2 达到 Cycle 1 Start-ready

1. 用户确认 Cycle 1 primary Query 为 `What is MyyShop?`。
2. Agent 保留现有 English Query/Query Set 精确版本，准备同一 Goal 的真实 Document、Claim、最小 approved Evidence→Source 子集、English Answer Card、Knowledge Release 和 real KBASE membership。
3. 中文 Query 可以继续作为辅助观察，但不进入 Cycle 1 required Query Set、frozen input 或完成门。
4. Facts Owner 逐项批准本次知识切片；其余 candidate Evidence 和 legacy knowledge 保持 backlog。
5. 系统完成只读检查并显示 `real_cycle_start_ready:true`，同时明确它还不是创建授权或全周期可运行证明。

### 5.3 Safe-to-create 与创建授权

Start-ready 后，用户看到独立 Safe-to-create 结果：真实 Cycle 推进、人工决定承接、Review/Trace、Baseline 输入、目标 Asset、五个平台 Baseline Profile、相对 Retest schedule、测量口径和 Cycle plan 是否已准备完成。

只有 Safe-to-create 通过，Agent 才展示完整 Cycle create decision package。用户单独授权后创建真实 Cycle；授权不得从 PRD、Start-ready 或其他数据访问决定推断。

### 5.4 记录 Platform Answer Baseline

1. Cycle 1 优先复用现有英文 Query 的五平台双槽正式 Baseline，但必须证明 Query、Profile、time window 和 raw artifact 与本 Cycle 冻结输入相容。
2. real Knowledge Release 到位后，用户审阅 10 个 candidate Answer Review；系统保留旧对象并生成新的 reviewed successor。
3. 每个平台基于两个 reviewed successor 生成新的 Aggregation successor；旧 candidate Review/Aggregation 不被覆盖。
4. Citation Observation 继续形成 Source identity、provenance 和观察指标，但数量与 Classification/Claim Support 不阻止 Baseline 或任何 Cycle transition。

### 5.5 Diagnosis、Gap 与 Adoption

1. Agent 在逐目标只读授权范围内诊断内容、证据和技术资产，并准备 Finding/Gap/Proposal decision package。
2. Facts Owner 独立判断 Gap 是 `open` 还是 `dismissed`；Agent Finding 不能自动成为业务 Gap。
3. 对 open Gap，Agent 提供 Proposal；用户逐项决定 accepted、modified 或 rejected。
4. 若全部 recommendation 被拒绝，用户只能明确取消/no-adoption；系统不得伪造 Publication/Retest，当前 Goal 也不能计为 full。

### 5.6 真实 Asset Publication

1. Agent 展示 exact target、完整内容或 diff、权限、影响、回滚和停止条件。
2. 用户作出事前执行授权；有受控发布能力时 Agent 可以执行，否则由 Site Owner 执行。
3. 提交状态未知时不自动重试。
4. 发布后系统 read-back locator、hash、时间和 proof；Site Owner 再作独立事后 attestation。
5. 只有事后证明完整，系统才显示 `publication_confirmed`。事前授权本身不是 Publication。

### 5.7 Technical Retest 与四周 Platform Answer Retest

1. Publication confirmed 后，用户单独授权目标 URL 的 Technical Retest；发布写授权不自动覆盖读取。
2. Technical Retest 完成后，系统才把相对 schedule 解析为 W1–W4 绝对窗口。
3. 每周每个平台固定两个独立 slots。当前单 Query 范围下，四周共形成 40 个 Retest Samples、40 个 reviewed Reviews 和 20 个按平台/窗口 Aggregations。
4. 每个平台、Profile、window、method 和 Run 单独授权；一个平台的决定不继承到另一个平台或另一周。
5. refusal、timeout、no_result、challenge、cancelled 在满足最小证据后都属于有效观察终态，不能被成功样本覆盖。只有尚未形成平台观察的 system failure 可以按合同重试。
6. challenge 立即停止该平台当前动作，不使用 API、其他平台或替代数据补数。
7. Week 4 只有在用户基于既定证据另作决定时才延长 W5–W8；不得为了等待结果变好而延长。

### 5.8 Analytics 与 Cycle Review

1. 每次 Analytics 读取前，Agent 展示资源、只读 scope、时间窗、输出、保留和撤销责任，Analytics Owner 逐次授权。
2. Observation 和 Business Signal 必须属于当前 Cycle/Goal，并与批准的 Retest schedule 时间关系清楚。
3. `no_signal`、`negative`、`insufficient_data` 或 unavailable 不阻止形成 Cycle Review，但必须降低业务结果判断并保留限制。
4. Agent 冻结 waiting Review package；用户独立决定后，系统生成新的 decided Review，旧 waiting 版本不被覆盖。
5. Cycle 只有所有 required Goal tracks 均 `review_decided` 时才显示 `completed/full`。

### 5.9 选择并完成 Cycle 2

1. 系统只从 Cycle 1 decided Review 冻结的输入生成普通候选。
2. 没有 Strategy closure 的 Product Gap 被明确 withheld，但不阻塞普通候选。
3. 用户若希望考虑 Product Gap，需依次单独决定 Strategy invocation、STA proceed、DDM validation、DDM factor promotion；完成 Strategy Output 后系统重建 Candidate Batch。
4. 用户在最终 Candidate Batch 上独立决定 GSEL，再使用不同 decision ref 批准 Cycle 2 Goal。
5. 若没有 eligible candidate，或 GSEL 全部 rejected/deferred，系统停止并等待新 Evidence/Review 或用户取消 v1 目标，不能编造 Goal。
6. 新 Goal 独立完成 Knowledge Slice、Start-ready、Safe-to-create 和 create authorization，再完整重复 Cycle 1 的阶段与观察窗口。

### 5.10 M8/v1 readiness 与实际 Release

1. 两个真实 Cycle completed/full 后，系统设置稳定 snapshot cutoff，等待写入和 lease 收敛，并短暂停止 Citation 等 Workspace writer。
2. Codex 和 Claude Code 分别通过独立 native Session 产出证据。
3. WorkBuddy manual 只验证配置与跨会话继续；可比的第三 lane 明确标记为 `test_only_semantic_fixture/shared_tool`。
4. 三条可比 execution lanes 独立产生可比较结果，不能由中央流程复制一个 digest 自证。
5. 用户看到 two-cycle Retrospective、能力矩阵、安全边界、cloud-readiness、已知限制和 release-readiness package。
6. 达到 v1 readiness 不等于已 Release；实际 Release、push 和 deploy 分别需要新授权，实际发布后检查完成后才能形成 verified Release Record。

## 6. 业务规则

### 6.1 状态与结论分离

| 结果 | 只说明什么 | 不说明什么 |
| --- | --- | --- |
| Knowledge-independent Engineering Readiness | test-only 工程合同可运行 | 真实知识或真实 Cycle 就绪 |
| Real Cycle Start Readiness | Goal-scoped real knowledge 与启动输入齐备 | 已授权创建、能跑完整周期 |
| Safe-to-create | 创建后没有当前已知的代码/输入硬阻塞 | 业务门已经决定 |
| Cycle completed/full | required stages 与 Owner Review 完整 | 结果正向、v1 已发布 |
| M6 business result | 当前观察对业务目标的 achieved/partial/not achieved/inconclusive 判断 | 内容变化造成该结果的因果关系 |
| M8/v1 readiness | 两个真实 Cycle 与跨宿主产品门完整 | 已 Release、已部署或业务成功 |
| Release | 当次授权的实际发布与发布后检查完成 | GEO 或业务效果达成 |
| Business effect | 经明确观察口径支持的结果 | 自动归因于某次 GEO 改动 |

### 6.2 Agent 主导、人类门禁

- Agent 可以准备决定内容和推荐答案，但不能生成 Owner 的决定。
- Owner 先提供独立 decision artifact/approval；系统只据其确定性物化新 successor 对象。
- no-decision、decision ref 重用、跨 Scope、重放或内容冲突必须失败。
- Publication 的事前授权和事后确认必须是两个不同事件。
- GSEL 与 Goal approval 必须独立；Cycle 2 create 还需要第三次授权。

### 6.3 真实知识与版本

- Cycle 1 required Query Set 只包含当前 approved English Query；若 Query/QS bytes 或 version 改变，现有 Baseline 不可复用，必须进入 fresh Baseline 分支。
- Real Knowledge Slice 只审核本次 Claim/KR 选中的最小 Evidence 子集。
- test-only 对象不能复制、合并或转正到 real KBASE。
- Knowledge Release 是内部知识包，不能当作外部 Publication。
- `KBASE-MYYSHOP-DEVTEST-001` 至少保持 frozen 到最终 M8/v1 验收结束。

### 6.4 Citation 与 Source

- Citation Observation 是来源登记和比较 provenance，不是 approved Evidence 或 Claim Support。
- Citation、Source queue、Classification 或 Claim Support 的新增和状态变化不得造成 active Cycle required input drift。
- 40→100 不阻止任何 Cycle transition；是否仍属于独立 M5/v1 完成门见 §9 待批准选择。
- 不允许外部榜单、静态域名清单或与真实 Citation 无关的导入凑数。

### 6.5 平台、隐私与提取

- 登录状态不等于自动化许可；五个平台继续遵守 `manual_only`，除非未来独立批准新的平台合同。
- 不保存密码、token、cookie、账号标识、浏览历史或完整页面 DOM。
- 产品必须保存足以复核的原始回答区域、Citation、result URL 和失败证据，并能在中断后恢复而不重复提交。
- 提取不得静默产生付费模型调用。规则型 non-model extraction 或获授权 model extraction 的技术选择由 Spec 0014 决定；若采用前者，必须显式修订/替代 Spec 0013 的 provider/model/prompt 合同。

### 6.6 Observation、业务成功与因果

- 有效 Observation 是 Cycle 完成输入，不要求数值正向。
- M6 一级业务成功必须有 approved PRD 定义的真实 signal；无信号时只能是 not_achieved 或 inconclusive。
- v1 readiness 是否要求至少一个正向 signal 见 §9 待批准选择。
- 任何访问、注册、排名或平台答案变化都不得自动归因于 Publication 或 GEO 工作。

### 6.7 M8 execution lanes

- Codex native、Claude Code native 和 `test_only_semantic_fixture/shared_tool` 是三条可比 lanes。
- WorkBuddy manual 是配置/跨会话边界证据，不参加核心 digest 比较，也不把 `native_host_verified` 设为 true。
- 每条可比 lane 必须独立产出，不接受中央 fan-out 复制结果。
- 最终证据必须 exact-pin 两个 real Cycle、decided Reviews 和完整产品/Tool closure。

## 7. 业务验收

| ID | 场景 | 通过条件 |
| --- | --- | --- |
| BA-01 | Blocker 视图 | 每项说明 target、证据、责任角色、恢复条件；warning/等待/optional 不冒充 blocker |
| BA-02 | 英文 Start-ready | 只用 `What is MyyShop?` 最小 real slice 得到 `real_cycle_start_ready:true`；中文和其他 backlog 不成为门 |
| BA-03 | Start-ready 与 Safe-to-create | 两个结果独立展示；Start-ready 不能被说成可完整运行或创建授权 |
| BA-04 | 创建授权 | Safe-to-create 通过后仍需单独授权；未授权时 real Workspace 无 Cycle 写入 |
| BA-05 | Baseline 复用 | 现有五平台双槽 Baseline 只有在 exact Query/Profile/window/artifact 相容时可复用 |
| BA-06 | Review successor | 10 个 candidate Review 保留；Owner decision 形成新 ID reviewed successors 和新 Aggregation successors |
| BA-07 | Citation 非干扰 | 40→100、queue/classification/index 变化不阻止或 supersede active Cycle；required knowledge 漂移仍失败 |
| BA-08 | Gap 与 Adoption | Gap、Proposal、Adoption 是不同人类门；全部 rejected 只能取消，不伪造 Publication |
| BA-09 | Publication 双门 | 事前授权后才能写；read-back 和独立 attestation 后才 confirmed；未知提交不重试 |
| BA-10 | Retest 顺序 | Technical Retest 在 Publication 后；W1–W4 Profile/window 只在 Technical Retest 后解析并冻结 |
| BA-11 | 四周矩阵 | 单 Query 下 40 Retest Samples、40 reviewed Reviews、20 Aggregations 或合法终态证据全部闭合 |
| BA-12 | 平台失败 | refusal/timeout/no_result/challenge/cancelled 不被成功覆盖；challenge 停止且不补平台/API 数据 |
| BA-13 | Analytics | 每次读取单独授权；ANO/BSIG 属于当前 Cycle/Goal/window；正、负、无信号都可如实 Review |
| BA-14 | Cycle Review | waiting 与 decided 是不同对象；没有 Owner decision 不得 completed/full |
| BA-15 | Cycle 2 普通候选 | 无 Strategy 时 Product Gap withheld，普通候选仍可生成 |
| BA-16 | Cycle 2 Product Gap | invocation、STA、DDM validation、独立 factor promotion、STO 后才重建 batch 并进入 GSEL |
| BA-17 | Cycle 2 决定 | GSEL、Goal approval、Cycle create 使用三个独立 decision refs；无候选时停止 |
| BA-18 | 双周期 | 两个 Cycle 独立知识、授权、Publication、Retest、Analytics 和 Review，最终均 completed/full |
| BA-19 | M8 lanes | Codex/Claude native 与 semantic fixture 分别产证；WorkBuddy manual 边界不冒充 native/可比输出 |
| BA-20 | v1/Release 边界 | v1 readiness、实际 Release、deploy 和业务效果分别展示，低层通过不能提升高层状态 |

## 8. 产品成功指标

本 PRD 的产品成功首先看流程真实性与可操作性，而不是追求单一 GEO 分：

- Start-ready 和 Safe-to-create 的 blocker 解释准确率为 100%，不存在已知假绿；
- 两个真实 Cycle 均能从冻结输入、决策与证据恢复到完整 trace；
- 所有 required human decisions 有独立 ref/scope/time，自动批准为 0；
- 未授权外部写入、重复平台提交、凭据/账号标识落盘为 0；
- Citation/Source 维护造成 active Cycle supersede 为 0；
- 每个 Cycle 的观察窗口与合法终态覆盖完整，负面结果不被替换；
- 三条可比 M8 lanes 对相同确定性输入结果一致，差异必须 fail loud；
- M6 business result、v1 readiness、Release 和业务效果始终分别展示。

## 9. 待 Owner 批准的关键产品选择

PRD 获批准前必须逐项明确：

### D1 — 100 Source 对 M5/v1 的地位

**推荐**：100 Source 只保留为持续 Source Classification/Claim Support 维护触发器，不作为真实 Cycle 或 v1 readiness 硬门；M5 Task 可继续显示该维护线尚未完成。若批准，需在最终产品 Plan 与 M5 PRD/Spec 显式标注 supersession，不改写历史 Record。

### D2 — 无正向 Signal 时的 v1 readiness

**推荐**：两个真实 Cycle 和 M8 产品门完整时允许达到 v1 readiness；若没有正向 signal，M6 business result 必须标记 `not_achieved` 或 `inconclusive`，禁止宣称业务成功。若批准，需显式修订最终产品 Plan 中 M6 一级成功与 v1 完成门的关系。

### D3 — Browser Extraction 产品约束

产品层需要在三种体验中明确选择：model mandatory、deterministic default + optional model enrichment，或允许 raw capture 直接物化。**推荐**：deterministic default + optional model enrichment；核心 manual path 在无模型授权时仍可形成可复核的结构化结果，raw capture 不能未经验证直接成为 canonical M5 对象。具体实现由 Spec 0014 决定；任何真实模型调用仍逐 Run 授权，且不能成为静默 fallback。

### D4 — Week 8 延长

**推荐**：W1–W4 是默认 required window；Week 4 只有在预先定义的 completeness/异常证据下由 Owner 决定是否增加 W5–W8，不能以“结果还不够好”为理由延长。

### D5 — Development-test KBASE 归档时点

**推荐**：切换到 real KBASE 后，将 `KBASE-MYYSHOP-DEVTEST-001` 冻结只读保留到最终 M8/v1 证据完成，再决定是否 archive；不得在 Start-ready 后立即归档，也不得把 test-only 对象转正或混入 real KBASE。

## 10. 对既有批准工件的影响

本 PRD 当前只是 `proposed`，不改变任何既有批准状态。若未来批准：

- 作为 test-only M6–M8 PRD 的 authorized-real 产品补充，不否定历史 synthetic 验收；
- D1 若批准，显式替代最终产品 Plan/M5 中“100 Source 阻塞 v1”的解释，但保留维护目标；
- D2 若批准，显式区分 M6 business success 与 v1 readiness，不降低真实 Observation 要求；
- D3 若选择规则型 extraction，必须显式修订/替代 Spec 0013 与 Browser Context；
- M8 新规则需要后续 Spec 表达真实双周期、独立 execution lanes 和 Release readiness，不能塞入现有 test-only 结果对象。

## 11. 进入 Spec 的条件

只有 Owner 对 D1–D5 和本 PRD 其余业务规则给出明确批准或修改决定后，才能把 PRD 标记为 `approved` 并起草 Spec 0014。批准 PRD 不等于批准 Spec、Plan、Tasks、本地实现、真实数据、外部 Publication、commit、push、Release 或 deploy。
