---
title: M6—M8 测试商户系统工程闭环任务清单
status: approved
created: 2026-08-27
updated: 2026-08-28
source:
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md
  - docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - docs/records/2026-08-28-owner-m7-circle1-scope-amendment.md
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
scope: 已获批 Spec 下可独立执行、验证与交接的最小任务；T01 已完成，T02—T12 按依赖推进
---

# M6—M8 测试商户系统工程闭环任务清单

## 1. 总体边界

- 当前状态：任务清单历史上已 `approved`；T01—T06 已 verified。Owner 最新收缩本阶段终点为 M7 / Circle 1 人工内测就绪；T07—T12 原任务全部 deferred，等待人工内测结论和重新定基线。
- 目标：只完成测试商户系统工程闭环。
- 禁止：写 `workspaces/myyshop` 业务对象、真实系统访问、凭据/PII、WorkBuddy Manifest、commit/push/PR/deploy/release。
- 账号：离线任务不要求真实业务账号；M8 只核对本机宿主登录准备。真实内测最小只读与单次授权遵守账号与数据准备 Runbook。
- 所有任务完成回报必须含：目标、实际修改、命令/退出码、首次失败与修复、未验证项、Git diff 范围。

## 2. 委派与文件 ownership

- SDD xhigh：只负责本 `docs/` SDD 套件。
- M6 high：独占 m6 schema、lifecycle/analytics scripts/Skills、M6 fixtures/tests。
- M7 high：独占 m7 schema、strategy scripts/Skill、M7 fixtures/tests。
- M8 implementation max：独占 m8 schema、conformance scripts、M8/sample/host fixtures/tests。
- Final adversarial QA max：必须不同于 M8 实现 Agent，只新增/运行独立红测与 QA Record，不直接修改业务实现。
- 总 Lead ultra：独占 common schema、object-contract、index-builder、package、plugin docs/validator、shared registry 集成及最终修复/验收。
- shared files 只允许总 Lead 串行修改；各 Agent 不得越过 owned paths，若需共享改动只交付精确建议与红测。

## 3. 任务表

### T01 — SDD 人工批准

- 对应：全部 PRD/Spec/Plan。
- 目标：由 Owner 决定是否批准 Spec 0007—0009，并确认接受 Spec 0003/0004 当前条款作为本轮 inherited baseline。
- 成功标准：决定可追溯；只把明确批准的文档改为 `approved`。
- 范围外：任何实现。
- 前置依赖：无。
- 目标文件：本 SDD 套件与批准 Record/Handoff。
- 验证：`npm run check:docs`、`git diff --check`。
- 风险：把 SDD 绿检误当批准。
- 当前状态：`verified`；Owner 批准事实见批准 Record。

### T02 — 合同红测、registry 与 M5→M6 历史兼容

- 对应：Spec 0007 §2、Spec 0008 §2、Spec 0009 §3、Plan WP1。
- 目标：先建立新类型/profile/index/trace 失败测试；分离 M5 历史 parse 与正式/测试新写入合同，并闭合 M5→M6 lease revision 边界。
- 成功标准：基础 Schema 继续解析 6 个历史 `sampling_count:3` exploratory Profile 和无 revision 的历史 M5 lease；M5 formal/M6 test profile 与所有新 materializer 只接受 sampling 2，Sample/Run ordinal 3 失败，sampling 3 不能进入 Baseline/Retest/Aggregation/Cycle；M6 Schema 不覆盖 nested lease，M6 profile 对 `geo-lifecycle/geo-analytics` Run 缺 revision 失败；existing-type required 由 profile 强制；CIS freeze/review manifest、active drift、completed history trace 正负例通过；真实 MyyShop 只读 checks 与 M2—M5 回归通过。
- 范围外：Cycle 业务实现。
- 前置依赖：T01 批准。
- 目标文件：`schemas/`、object/index registry、M6—M8 schema/profile 测试。
- 验证：M5 专项、M6—M8 schema tests、`npm test`。
- 风险：把新写入约束放进基础 Schema、或由 M6 Schema 浅覆盖 nested lease，都会让真实历史 graph 失效；默认不改内核 merge 语义。
- 当前状态：`verified`；M5/M6 兼容、registry 与红测结果见 M6 Record。

### T03 — Test Merchant fail-closed 身份与污染防护

- 对应：Spec 0007 §3。
- 目标：实现 `workspace.json` test-only 身份、TMT、顶层 `test_scope` 和真实/模拟双向污染预检。
- 成功标准：缺 mode/namespace/.invalid/test scope、真实路径或跨 Workspace ref 均在写前失败。
- 范围外：真实商户建立。
- 前置依赖：T02。
- 目标文件：M6 profile/Tool、独立 test merchant fixture、隔离测试。
- 验证：身份、污染、path/symlink/secret/PII 专项测试。
- 风险：路径名推断测试身份导致 fail-open。
- 当前状态：`verified`；test-only 身份与双向污染 final QA 已通过。

### T04 — Multi-goal Cycle、transition CAS 与恢复

- 对应：Spec 0007 §4—§5、§10。
- 目标：每 Goal 独立 track、确定性汇总、operation ledger、expected version CAS、M6 profile revision lease/resume/supersede。
- 成功标准：一个 Goal 不推进其他 Goal；每次 gate 在 CAS 前有 transition CIS 完整 bytes，Review CIS闭合全部 applied transitions；`geo-lifecycle/geo-analytics` Run lease 必有正整数 revision；并发只有一个成功；中断按 plan/checksum 收敛。
- 范围外：复用当前 Run rename 并声称 CAS。
- 前置依赖：T03。
- 目标文件：`geo-lifecycle` Tool/Skill、Cycle/Transition 模板与测试。
- 验证：状态机、跳步、并发、stale lease、故障注入。
- 风险：当前 graph 单 revision；必须通过 CIS 隔离历史版本，不改写 M2—M5 stable ID 语义。
- 当前状态：`verified`；multi-goal、CAS、lease/race/recovery final QA 已通过。

### T05 — Analytics fixture、Observation、Business Signal 与 Evidence 分离

- 对应：Spec 0007 §6—§8。
- 目标：实现 fixture adapter、raw allowlist/scan、Observation、Signal、candidate Evidence materialization 与 Cycle Review。
- 成功标准：no-signal/insufficient/negative 合法；Observation/Signal 不能当 Evidence/因果；多 Goal Review 独立。
- 范围外：真实 GA4/GSC/业务数据连接。
- 前置依赖：T04。
- 目标文件：`geo-analytics` Tool/Skill、对象模板、M6 fixture/tests。
- 验证：adapter/denominator/规则漂移/Evidence 半成品/PII tests。
- 风险：伪造正向增长或把 fixture approval 写成真实批准。
- 当前状态：`verified`；ANO/BSIG/Evidence/Review 与 pinning final QA 已通过。

### T06 — Cycle 1 完整测试旅程

- 对应：Spec 0007 全部。
- 目标：跑通 Baseline → M4 chain → 双 Retest → Analytics → Review。
- 成功标准：一个完整 synthetic Cycle 1；缺门、全 Adoption rejected、污染和恢复负例通过。
- 范围外：真实 M4 Publication/M5采集。
- 前置依赖：T05。
- 目标文件：M6 E2E fixture/test/Record。
- 验证：`test:m6-cycle` 与 test-merchant Cycle 1 E2E（以实现后真实命令为准）。
- 风险：模拟 Publication 被误报外部发布。
- 当前状态：`verified`；完整 synthetic Cycle 1 与 19 项 final adversarial 已通过，见 M6 Record。

### T07 — Strategy Gate 0、eligibility 与 Dimension

- 对应：Spec 0008 §3—§5。
- 目标：拆分 invocation/eligibility/proceed，先建 strategy CIS 完整 copies，建立 Dimension 两次独立门，只消费 snapshot 中 M4 open Product Gap。
- 成功标准：自报 pass、裸 Sample、candidate Review、空 hints、非 approved/stale Evidence、单 Query/平台、自动 trigger/Gap confirmation 均失败；DDM 两次决定映射精确。
- 范围外：修改 Spec 0005 Finding Schema。
- 前置依赖：T06。
- 目标文件：`geo-strategy-discovery` Tool/Skill、M7 tests。
- 验证：trigger/eligibility/Dimension/Product Gap 正负例。
- 风险：M7 越权创建或批准 Product Gap。
- 当前状态：`deferred`；不属于当前 Circle 1 验收。

### T08 — Strategy Output、GCB/GCD/GSEL 与 Cycle 2

- 对应：Spec 0008 §6—§10。
- 目标：create-only Strategy 三类 artifacts、确定性 GCB/GCD、独立 GSEL 和 Cycle 2 CIS。
- 成功标准：content/batch/instance keys 与候选 bytes 稳定；Product Gap 必有 decision_factor gate；人类决定在 GSEL；Cycle 2 精确引用 predecessor Review/GSEL、创建新 freeze CIS 并完整运行。
- 范围外：把 strategy 设为普通 Cycle 2 前置。
- 前置依赖：T07。
- 目标文件：M7 output/candidate/selection 模块、Cycle 2 E2E tests。
- 验证：hash/order/并发/多选/无选/版本漂移/strategy absent tests。
- 风险：同 GCD ID 修改选择，破坏 create-only。
- 当前状态：`deferred`；不属于当前 Circle 1 验收。

### T09 — Codex/Claude Code 已适配 conformance

- 对应：Spec 0009 §2.1、§4—§6。
- 目标：冻结输入/clock/operation IDs 与 delegation/capability/sample/Handoff pins，在两个已适配宿主/共享 Tool 模式比较确定性输出。
- 成功标准：required execution keys（Codex/Claude packaging+shared Tool）全部通过，index/Finding/trace/Cycle/diagnostics 可比输出一致；optional native 不冒充 required；缺 capability fail loud。
- 范围外：登录凭据、宿主外部写入。
- 前置依赖：T08。
- 目标文件：conformance Tool/profile/tests、隔离 host outputs。
- 验证：manifest/tool/Skill、input mutation、output drift、normalization 负例。
- 风险：忽略 host-specific 差异或过度 normalization。
- 当前状态：`deferred`；等待 Owner Circle 1 内测与后续重新定基线。

### T10 — WorkBuddy 中国区边界 conformance

- 对应：Spec 0009 §2.2。
- 目标：只实现 test-only semantic fixture 与 manual configuration check；后者不进入核心确定性比较。
- 成功标准：required WorkBuddy semantic fixture 通过；前三项包装/native boundary 与 native applicability 均 false；optional manual 未执行为 not_executed，尝试 native/Manifest 明确失败。
- 范围外：WorkBuddy Manifest、Marketplace、导入协议或真实宿主通过声明。
- 前置依赖：T09；本机登录可选准备，不是离线测试前置。
- 目标文件：WorkBuddy semantic fixture、manual checklist adapter、tests。
- 验证：semantic/manual 正例、native/虚构包装/静默降级负例。
- 风险：把本机登录或人工配置当真实插件验收。
- 当前状态：`deferred`；等待 Owner Circle 1 内测与后续重新定基线。

### T11 — 安全、并发、恢复与稳定快照 QA

- 对应：Spec 0007—0009 安全/测试章节。
- 目标：在实现稳定后独立运行对抗矩阵、两层无聊天上下文 session recovery 和全部回归。
- 成功标准：path/symlink/secret/PII、污染、create-only、CAS/lease、每步中断、host drift、isolated OS process SRR 与不同 stateless Agent Session 独立 Record均覆盖；dirty manifest 包含全部 tracked/non-ignored untracked 并排除 ignored node_modules；112 个既有测试不得回归（实际数量以执行 Record 为准）。
- 范围外：接受实现 Agent 自报完成。
- 前置依赖：T10，且实现 diff 冻结。
- 目标文件：独立 QA tests/Record；不得改业务实现后沿用旧 QA。
- 验证：全部专项 + `npm test` + plugin/docs + MyyShop read-only checks + `git diff --check`。
- 风险：QA 后改动使结论失效。
- 当前状态：`deferred`；原全闭环 QA 不属于当前阶段；当前只执行 Circle 1 稳定快照独立 QA。

### T12 — ERC 与真实 MyyShop 内测交接

- 对应：Spec 0009 §7、账号与数据准备 Runbook。
- 目标：组装 draft/reviewed test-engineering ERC 和真实内测启动清单/Handoff。
- 成功标准：测试工程 gates 有证据；真实商户、Publication、Analytics、两个真实 Cycle、业务效果、release authorization 全部如实 open/not executed。
- 范围外：自动创建真实商户、访问账号或启动真实测试。
- 前置依赖：T11 全绿与稳定 snapshot。
- 目标文件：测试 Workspace ERC、Record、后继 Handoff/Runbook 引用。
- 验证：ERC trace、scope 负例、docs/link/diff checks。
- 风险：把 ERC 表述为 v1 Release。
- 当前状态：`deferred`；当前只交付 Circle 1 人工内测 Handoff。

## 4. 任务依赖

```text
T01 → T02 → T03 → T04 → T05 → T06
                                  ↓
                      T07 → T08 → T09 → T10 → T11 → T12
```

可在同一阶段并行的只限文件不重叠且没有业务依赖的红测准备；M6 输出是 M7 输入，M6/M7 输出是 M8 输入，不得并行跳过。
