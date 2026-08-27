---
title: M6—M8 测试商户 SDD 人工批准交接
status: verified
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/requirements/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md
  - docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/records/2026-08-27-m6-m8-sdd-approval-record.md
  - docs/records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md
  - docs/records/2026-08-27-m7-decision-dimension-state-machine-review.md
  - docs/records/2026-08-27-m8-conformance-contract-closure-review.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-08-27 Owner 明确决定：批准所有设计，后续按推荐方向推进；保留人工 review，并委派全新上下文的 gpt-5.6-sol Agent 独立决策
scope: M6—M8 SDD Owner 批准事实、批准范围与批准后实施开场；不授权真实系统、Git 远端、部署或发布
---

# M6—M8 测试商户 SDD 人工批准交接

## 1. 当前结论

Owner 已明确批准 M6—M8 测试商户 Requirement、PRD、Architecture、Spec 0007—0009、Plan 与 Task，并决定后续按现有推荐方向推进。八份 SDD 的 Frontmatter 已更新为 `approved`；批准事实、范围与未授权边界见 [批准 Record](../records/2026-08-27-m6-m8-sdd-approval-record.md)。

T01 人工批准门已经完成，后续可按已批准 Plan 从 T02 开始，依次推进 M6、M7、M8 和稳定快照独立 QA。本次批准记录任务本身没有实现代码、Schema、Skill、fixture 或测试。

## 2. 本 SDD 冻结的范围

### 2.1 已批准可实施

- 独立 test-only Workspace 与 `.invalid` 虚构测试商户；
- M6 multi-goal Cycle、transition CAS、fixture Analytics、Observation、Business Signal、Evidence 分离与 Review；
- M7 Gate 0 人工 invocation、eligibility、Decision Dimension、只消费 M4 open Product Gap、GCD/GSEL 与 Cycle 2；
- M8 Codex/Claude Code 已适配检查、WorkBuddy 中国区 test-only/manual boundary、稳定快照、session recovery 与 ERC；
- M8 pin delegation contract、capability matrix、独立 sample Workspace manifest 与本 successor Handoff；全新进程记录 `conversation_history_used:false`；
- 安全、并发、恢复、create-only、真实/模拟污染和 fail-loud 负例。

### 2.2 始终不由本范围证明

- 真实 MyyShop 商户、事实、Evidence、批准或内测；
- 真实外部 Publication、GA4/GSC/CRM/消费者平台访问；
- 两个真实 MyyShop GEO Cycle、真实业务效果或 v1 Release；
- commit、push、PR、deploy 或 release。

## 3. Owner 已批准的合同

| 决定 | Owner 结论 | 继续有效的控制门 |
| --- | --- | --- |
| Inherited baseline | 接受 Spec 0003/0004 当前条款作为本任务继承基线；不改变其历史文件状态 | 若实现发现实质冲突，停止受影响实现并重新决策 |
| Spec 0007 | 批准顶层 `test_scope`、Workspace root test identity、CIS、每 Goal track、Observation/Signal/Evidence 分离与 CAS | 只限 test merchant engineering |
| M5→M6 兼容 | 基础 Schema 保留历史 `sampling_count:[2,3]` 与可选 lease revision；正式/测试新写入只允许两槽，M6 Run profile 强制 revision；见 [独立 Review Record](../records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md) | 历史 3 只可解析，不得进入 Baseline/Retest/Aggregation/Cycle；M6 Schema 不覆盖 nested lease |
| Spec 0008 | 批准 Gate 0 invocation/eligibility 分离、M4 open Product Gap 只读消费与 GCB/GCD/GSEL 分离；DDM 状态机窄修订见 [独立 Review Record](../records/2026-08-27-m7-decision-dimension-state-machine-review.md) | 人工 invocation、proceed、Dimension 和 Goal selection 门继续保留 |
| Spec 0009 | 批准 Codex/Claude 按实际模式留证；WorkBuddy 无 native 包装、只做 required semantic fixture | 不得新增或虚构 WorkBuddy Manifest/native conformance |
| M8 窄合同闭包 | CFP artifact direct Profile Run 归属、Repository HEAD/index/worktree 三态与 Tool contract closure 见 [独立 Review Record](../records/2026-08-27-m8-conformance-contract-closure-review.md) | 只决定 test-merchant engineering 技术合同，不构成真实宿主或发布批准 |
| M8 required matrix | 批准 Codex/Claude packaging+shared Tool、WorkBuddy semantic fixture 为 required；native/manual optional/not executed | optional 不得替代 required |
| Session recovery | 批准 isolated OS process SRR + 不同 stateless Agent Session 独立 Record 两层恢复 | 任一缺失不得组装 ERC |
| 实施顺序 | 批准 M6 → M7 → M8，稳定后独立 QA | 不允许并行跳过依赖；QA 后修改须重跑 |

这是 Owner 明确决定的记录，不是 Agent 从 Handoff、文档存在、`check:docs` 或本地测试推导批准。

## 4. 批准后的委派与文件 ownership

| Agent | 独占文件范围 | 交接要求 |
| --- | --- | --- |
| M6 high | m6 schema、lifecycle/analytics scripts/Skills、M6 fixtures/tests | 回报命令/exit/diff，不触碰 shared registry |
| M7 high | m7 schema、strategy scripts/Skill、M7 fixtures/tests | 不修改 M6/M8 或 Spec 0005 Finding Schema |
| M8 implementation max | m8 schema、conformance scripts、M8/sample/host fixtures/tests | 交付稳定实现快照，不自验收发布 |
| Final adversarial QA max | 独立红测、QA checks、QA Record | 必须与 M8 实现 Agent不同；不直接修业务实现 |
| 总 Lead ultra | common schema/object-contract/index-builder/package/plugin docs/shared registry、集成修复和最终验收 | 所有 shared files 串行修改 |

SDD xhigh 的 ownership 到本轮 `docs/` 套件为止。每个实现/QA Agent 必须回报目标、实际修改、命令与 exit code、首次失败/修复、未验证项和 owned-path diff；任何越界或同文件并发修改都停止交回 Lead。

## 5. 源码核验出的实现前置

1. 当前 Cycle 只有 `core_versions` 和公共状态，没有 M6 lifecycle Tool/profile trace。
2. 同名类型 schema merge 不合并后续 required；M6 扩展必填须由 profile validator 强制。
3. `workspace-validate --objects` 只跑 base graph/index，不代表 M3—M6 profile ready。
4. 真实 MyyShop 有 6 个历史 exploratory Profile 使用 sampling count 3；基础 Schema 保留 `[2,3]` 仅作 parse，正式/测试 profile、所有新 materializer 和 ordinal 合同仍强制两槽。
5. 真实 MyyShop 有 7 个历史 M5 Run lease 没有 revision；M5 基础 lease 只增加可选 revision，M6 Schema 不覆盖 nested lease，M6 profile 单独对 lifecycle/analytics Run 强制 revision。
6. 当前 fixture 无 workspace root test-only identity；必须 fail closed 增加 mode/namespace/legal entity/`.invalid`。
7. 当前 graph 每 stable ID 只解析当前 revision；proposed CIS 在 freeze/review 时固化 metadata/bytes，active drift supersede，completed history 不依赖 live old revision。
8. 当前 Run read→rename 不是 Cycle CAS；必须另实现 exclusive lock + expected version compare。
9. WorkBuddy 中国区仍没有官方开发者包装契约，不得新增 Manifest 或宣称 native conformance。

## 6. 账号与数据边界

账号与数据准备以 [Runbook](../runbooks/geo-cowork-account-data-readiness.md) 为操作清单：

- 测试商户 SDD/离线工程不需要任何真实业务账号；
- M8 可提前准备 Codex、Claude Code、WorkBuddy 本机登录，但不保存账号邮箱或凭据，WorkBuddy 仍受无官方契约边界；
- Runbook ACCT-H03 的“可安装专家/Skill”只是 proposed 未来 readiness 问题，不是当前 WorkBuddy 包装事实、离线工程前置或真实验收；当前用户指令与 Spec 0001 优先；
- 真实 MyyShop 内测未来只使用最小只读、用户控制登录/OAuth/脱敏导出；
- GA4 最低建议为 Property Viewer + `analytics.readonly`；GSC 优先 Restricted user + `webmasters.readonly`；
- 永不索取或落盘密码、Cookie、Token、Client Secret、`.env` 或未脱敏 PII；
- 账号准备就绪不等于授权任一真实连接、采集、发布或写入。

Runbook 本身为 `proposed` 操作清单，不批准 Spec，也不提供真实访问授权。

## 7. Git 与继承基线

- 绝对 checkout：`/Users/sujingjun/.codex/worktrees/4910/geo-cowork`
- 分支：detached HEAD
- HEAD：`a5d8365cb124893e2a79154e27d84c7b73ffc58b`
- 本地 `HEAD...origin/main`：0/0；本轮未 fetch
- 开工继承未跟踪：总 Lead Handoff 与 MyyShop 内容/证据缺口报告；两者未由 SDD Agent 编辑
- 账号与数据准备 Runbook：从主 checkout 用户新增文件按 bytes 镜像，保持 `proposed`，没有改写其内容
- Owner 批准事实与本轮文档状态更新见 `docs/records/2026-08-27-m6-m8-sdd-approval-record.md`
- 未执行 commit、push 或 PR

实际 SDD diff 与验证结果见 [本轮 Record](../records/2026-08-27-m6-m8-test-merchant-sdd-record.md)。

## 8. 下一 Session 第一动作

1. 读取根 `AGENTS.md`、`docs/workflow.md`、本 Handoff、Task、Plan 与 Spec 0007—0009。
2. 阅读批准 Record，确认批准只覆盖 test merchant engineering，并保留人工 review、独立 QA、真实系统与发布门。
3. 核对当前 checkout/HEAD/upstream/dirty/untracked；确认 Handoff 后没有同文件并发修改。
4. 使用用户要求的全新 `gpt-5.6-sol` Agent 上下文，从 T02 开始先运行基线并建立失败测试；M6、M7、M8 按依赖顺序推进。
5. 任何 approved Spec 实质冲突先停止受影响实现、回写 SDD 并重新请求决策，不自行降级。
6. 实现稳定后必须由不同 Agent 完成人工 review/独立红测与两层无聊天上下文恢复检查；旧 QA 在后续修改后失效。

## 9. 停止条件

- 实现与已批准 SDD 出现实质冲突或需要扩大批准范围；
- 同文件出现无法归因并发修改；
- Test Merchant 无法与真实 MyyShop fail-closed 隔离；
- 需要修改 Spec 0005 Product Gap 核心合同或虚构 WorkBuddy 包装；
- 需要真实账号、凭据、未授权数据、外部写入或发布；
- 需要以工程绿测证明真实 MyyShop/v1 门。
