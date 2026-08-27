---
title: M6—M8 测试商户系统工程闭环实施计划
status: approved
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md
  - docs/handoff/2026-08-27-m6-m8-test-merchant-engineering-lead-handoff.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
scope: 已获批 Spec 下的测试商户 M6—M8 实施、测试、稳定快照验收与真实内测交接；不授权真实系统或发布动作
---

# M6—M8 测试商户系统工程闭环实施计划

## 1. 目标与成功标准

### 1.1 目标

在独立 test-only Workspace 中最小实现 Spec 0007—0009，跑通两个 synthetic GEO Cycle、人工触发战略分支、Cycle 1 → Cycle 2 人类选择，以及宿主边界内的确定性、安全与恢复验收。

### 1.2 成功标准

1. 所有新增类型、状态、refs、version pin、indexes、trace 和错误码有失败测试与最小实现。
2. fixture Workspace 具备 fail-closed 身份，任何真实/模拟双向污染在写入前失败；真实 `workspaces/myyshop` 字节不变。
3. 每个 Cycle 支持多 Goal 独立 track；测试旅程各用一个 Goal，完整通过 Publication、双 Retest、Observation、Business Signal 与 Review。
4. Analytics Observation、Business Signal、Evidence 与因果结论严格分离；`no_signal/insufficient_data/negative` 是合法结果。
5. Strategy Gate 0 invocation、eligibility、Dimension 两次门、M4 open Product Gap 消费及 Cycle Goal Selection 各自独立。
6. Codex/Claude Code 可做已适配检查；WorkBuddy 中国区只做 test-only 语义/人工配置检查且 fail loud 保留限制。
7. 稳定快照的专项测试、全量检查、安全/并发/恢复矩阵与对抗验收通过，形成 scope 受限的 ERC。

## 2. 范围外与授权限制

- Spec 0007—0009 已获 Owner 明确批准，可按本 Plan 创建测试商户范围的代码、Schema、Skill、fixture 与测试；不得越过本文其他授权限制。
- 不建立真实 MyyShop 商户，不写 `workspaces/myyshop` 业务对象，不连接真实 GA4/GSC/CRM/CMS/消费者平台。
- 测试商户离线工程不要求真实业务账号。M8 只可按 Runbook 提前核对三宿主本机登录准备；不获取登录凭据。
- 真实内测未来仅允许用户控制登录/OAuth/脱敏导出与最小只读：GA4 Property Viewer + `analytics.readonly`；GSC 优先 Restricted user + `webmasters.readonly`。账号就绪不等于某次访问授权。
- 永不索取或落盘密码、Cookie、Token、Client Secret、`.env` 值或未脱敏 PII。
- 不 commit、push、PR、merge、deploy 或 release。

## 3. 当前实现基线与差距

| 当前事实 | 影响 | 计划处理 |
| --- | --- | --- |
| Cycle 只有 M2 `core_versions` 与公共状态 | 没有 M6 生命周期 Tool、语义 validator 或 Cycle trace | 先红测，再增加独立 M6 profile validator/trace/transition Tool |
| schema merge 对已有类型不合并后续 `required` | 新 m6 schema 不能自动强制 Cycle/Evidence/Run 扩展必填 | M6 profile 显式强制；公共 merge 若要改需单独评审与全回归 |
| `workspace-validate --objects` 只跑 base graph/index | 不能证明 M3—M6 profile ready | 新建聚合 validate 入口，明确 base 与 profile 检查列表 |
| M5 基础 Schema 允许 `sampling_count: 2/3`，且真实 graph 有 6 个历史 exploratory Profile 为 3 | 基础 Schema 收紧为 2 会破坏不可变历史；但 3 不能进入正式协议 | 基础 Schema 保留 `[2,3]` 仅作历史 parse；M5 formal/M6 test profile 和所有新 materializer 强制 2，Sample/Run ordinal 仍只允许 1/2 |
| 7 个历史 M5 Run 的 `lease` 没有 `revision`；同名 nested property 为浅覆盖 | M6 Schema 若覆盖 `run.lease` 并强制 revision，会使真实 Workspace graph 失效 | M5 基础 lease 增加可选 `revision`；M6 Schema 不重定义 nested lease；M6 profile 只对 `geo-lifecycle/geo-analytics` Run 强制 revision |
| fixture 只靠 `.invalid/fixture://` 等局部字段 | Workspace 根没有 fail-closed test-only identity | 前向兼容扩展 `workspace.json`，加 Test Merchant 与顶层 `test_scope` |
| graph 每个 stable ID 只解析当前 revision | 直接长期 pin live version 会让历史 Cycle 失配 | 新增 create-only freeze/review CIS；active 检 drift，completed 从 snapshot 恢复 |
| 当前 Run 更新是 read→temporary rename | 不能声称 Cycle transition 具备 CAS | 实现独占 create-only lock + expected version re-read + operation ledger |
| WorkBuddy 无官方开发者包装契约 | 不能做第三 Manifest/native conformance | 只做 semantic fixture/人工配置检查，固定 boundary 字段 |

## 4. 已批准的兼容决策

### 4.1 Frozen version pin

Spec 0004 当前以“一个 stable ID 的当前 canonical revision”解析 graph，同时状态/版本更新通常会原地修改对象；长期 Cycle pin 需要旧版本继续可解析，两者存在实质张力。

本计划采用局部 CIS 方案，保持 Spec 0003/0004 的 stable ID + version 语义：freeze/review 时 create-only 保存当前对象 metadata/bytes manifest，Cycle/Review 只 pin CIS；active live drift supersede Cycle，completed history 从 CIS 恢复。它不要求源对象换 ID，不批量修改 M2—M5 consumer，也不需要多 revision live graph。

### 4.2 Existing-type required

本计划优先使用 profile validator，不直接修改 schema merge。若实现证明 profile 重复过多或无法保证公共 walker 一致性，再提出独立内核变更；不能在 M6 顺手重构。

### 4.3 M8 唯一 required/optional 方案

Owner 批准整体 SDD 即确认：required executions 固定为 Codex/Claude `packaging_static + direct_shared_tool`、WorkBuddy `test_only_semantic_fixture`；Codex/Claude native interactive 与 WorkBuddy manual configuration 可选且默认 `not_executed`。session recovery 同时要求 isolated OS process SRR 与不同 stateless Agent Session 独立 Record。实现时不再自由选择或用 optional 替换 required。

### 4.4 M5→M6 两槽与 lease 兼容

基础 Schema 与新写入合同分层：M5 Collector Profile 的 `[2,3]` 只保存历史可读性，正式/测试 profile 与全部新 materializer 只写 2；历史 `sampling_count:3` 不得进入 Baseline、Retest、Aggregation 或 Cycle，Sample/Run ordinal 永远只有 1/2。M5 基础 lease 的 `revision` 可选，M6 Schema 不覆盖 nested lease；M6 profile 仅对 `geo-lifecycle/geo-analytics` Run 强制正整数 revision。该决定只解决历史 graph 兼容，不恢复三槽协议，也不修改真实 Workspace。

## 5. 委派与文件 ownership

| 责任方 | 固定范围 | 禁止触碰 |
| --- | --- | --- |
| SDD Agent（`gpt-5.6-sol/xhigh`） | 本轮 `docs/` SDD 套件、导航与获授权的一致性文字修正 | 代码、Schema、Skill、fixture、tests |
| M6 Agent（`gpt-5.6-sol/high`） | M6 schema、lifecycle/analytics scripts、`geo-lifecycle`/`geo-analytics` Skills、M6 fixture/tests | M7/M8 文件与 shared registry |
| M7 Agent（`gpt-5.6-sol/high`） | M7 schema、strategy scripts/Skill、M7 fixture/tests | M6/M8 文件、Spec 0005 Finding Schema 与 shared registry |
| M8 implementation Agent（`gpt-5.6-sol/max`） | M8 schema、conformance scripts、host/sample fixtures 与 M8 tests | M6/M7 实现与 shared registry |
| Final adversarial QA Agent（与实现不同的 `gpt-5.6-sol/max`） | 新增/运行独立红测、稳定快照对抗检查和 QA Record | 不直接修业务实现；发现问题交回 Lead/owner Agent |
| 总 Lead（`gpt-5.6-sol/ultra`） | `common-object.schema.json`、`object-contract.mjs`、`index-builder.mjs`、`package.json`、plugin docs/validator、共享 registry 集成、冲突修复与最终验收 | 不接受子 Agent 自述替代复核 |

共享文件只由总 Lead 串行修改；需要 shared change 的 Agent只提交精确建议、红测和影响范围，不直接并发编辑。每个 Agent 必须回报：目标、实际文件、验证命令与 exit code、首次失败/修复、未验证项、`git diff -- <owned paths>` 范围。总 Lead 在每次合并/修复后重跑受影响检查；最终 QA 后任何修改都会使旧 QA 失效。

## 6. 实施顺序

### WP0 — 人工批准与稳定基线

目标：记录 Requirement/PRD/Architecture/Spec 0007—0009/Plan 的批准范围和 §4 兼容取舍。

动作：

1. 记录 Owner 对每份 Spec 的明确决定；只更新获批工件状态与被该决定取代的状态性文字。
2. 单独记录 Owner 是否接受 Spec 0003/0004 当前条款作为本轮 inherited baseline；不接受则停止并回到上游 SDD，Agent 不从既有实现/Record 推导批准。
3. 核对绝对 checkout、HEAD/upstream、dirty/untracked 和继承文件。
4. 运行既有五项只读基线与 `git diff --check`，记录命令/退出码。

验收：批准范围和停止条件可追溯；批准记录任务自身无实现 diff。

### WP1 — 红测、registry 与最小兼容修复

目标：建立失败测试和机器合同入口。

预期目标文件：

- `plugins/geo-expert/schemas/m6-record-types.schema.json`
- `plugins/geo-expert/schemas/m7-record-types.schema.json`
- `plugins/geo-expert/schemas/m8-record-types.schema.json`
- `plugins/geo-expert/schemas/common-object.schema.json`（只增加可选顶层 `test_scope`）
- `plugins/geo-expert/schemas/m5-record-types.schema.json`（保留 Profile `[2,3]` 历史 parse、Sample/Run ordinal 仅 1/2，并给基础 lease 增加可选 revision）
- `plugins/geo-expert/scripts/lib/object-contract.mjs`
- `plugins/geo-expert/scripts/lib/index-builder.mjs`
- M6/M7/M8 专项测试文件。

步骤：

1. 先写未知类型、existing-type required 未生效、M5→M6 两槽/lease 双层兼容、refs/index/trace、污染、WorkBuddy 假包装、CIS 与 execution-key 红测。红测必须同时证明历史 `sampling_count:3`/无 revision lease 可被 base graph 解析，以及正式/测试 profile、所有新 materializer、M6 Run profile 对 2/revision 的 fail-closed 约束。
2. 注册新类型、index/ref/version 字段；实现 CIS create-only manifest、entry hash与 Cycle/Review CIS version pin；保留 M2—M5 stable ID/schema merge 行为，M6 Schema 不覆盖 nested `run.lease`，M6 profile 强制扩展 required 与 lease revision。
3. 建立聚合 validate 路由，明确哪些 profile 被实际执行。
4. 运行 M5 专项回归与全量测试。

shared registry 关键排序不得继续依赖 locale-sensitive `localeCompare`；先用不同 LANG/LC_ALL、Unicode path/ID 写红测，再由 Lead 最小引入 UTF-8 byte comparator 并跑 M2—M5 全回归。

验收：每个失败先可复现；最小修改后通过；真实 MyyShop `workspace-validate --objects`、`answer-cycle validate` 与 index check 不因兼容修复失败；无无关重构。

### WP2 — Test Merchant、Cycle 与 Analytics

目标：实现 Spec 0007 的隔离、multi-goal track、transition、adapter 与 Review。

预期目标文件：

- `plugins/geo-expert/scripts/geo-lifecycle.mjs`
- `plugins/geo-expert/scripts/geo-analytics.mjs`
- 对应 `scripts/lib/` 模块、模板与 `geo-lifecycle/geo-analytics` Skill；
- 独立 `tests/fixtures/m6-test-merchant/`，不得位于真实 MyyShop Workspace。

顺序：

1. workspace root identity + Test Merchant + 顶层 test scope + real/synthetic 双向污染预检。
2. freeze/transition/pre-review/strategy CIS 完整 bytes copies 与每 Goal frozen track；每次 CTR 在 CAS 前冻结 gate CIS，pre-review cutoff 只纳入截至 analytics_recorded 的 applied snapshots，后生 review waiting/decided 各自用 transition CIS；再实现 ledger/lock/CAS，不直接冒用现有 Run rename。
3. fixture adapter 的字段 allowlist、大小/类型、secret/PII scan、create-only raw plan。
4. Analytics Observation、Business Signal 与独立 Evidence materialization。
5. Cycle Review、candidate input 冻结结构、index/trace。
6. 正常 Cycle 1 和每个阶段缺门/全部 Adoption rejected cancel 负例。

验收：单 Goal/multi-goal、并发、恢复、污染与非正向 Signal 场景均通过；真实 MyyShop 只读检查字节不变。

### WP3 — Strategy 与 Cycle 2

目标：实现 Spec 0008，不修改 Spec 0005 Finding Schema。

顺序：

1. Gate 0 human invocation 与 version-pinned eligibility 确定性计算：显式 dimension key、approved/non-stale user Evidence、2 Query/平台 impact、同 open Product Gap 的 fix-insufficient 下限。
2. candidate/validated/decision_factor 新 ID 与两次独立人工门。
3. 只消费 M4 已 `open + approval` Product Gap；不创建或确认 Gap。
4. Strategy Output 三类唯一 artifact、validation plan contract 与 Run fingerprints。
5. 从 Cycle 1 decided CRV/review CIS 生成 create-only GCB + GCD；Product Gap candidate 强制 STA proceed + DDM decision_factor + STO gates；用独立 GSEL 人类决定。
6. 绑定 predecessor Review/GSEL/new Goal，完整运行 Cycle 2。
7. 证明不触发 strategy 时普通 Cycle 2 仍可运行。

验收：自动触发、裸 Sample、自报 pass、仅 validated DDM、多选/自动选择、CIS/批次/版本漂移与 Product Gap 越权均失败。

### WP4 — Cross-host Conformance

目标：实现 Spec 0009 的冻结输入、capability、比较与 fail-loud。

顺序：

1. Codex/Claude Code 现有 manifest/marketplace/shared Tool 检查。
2. WorkBuddy test-only semantic fixture 与 manual configuration contract；固定 `native_host_verified:false`。
3. 冻结 execution key/required comparisons、Spec 0009 固定 capability registry、deterministic clock/operation IDs，以及 delegation contract、capability matrix、sample Workspace manifest、successor Handoff 的 path/checksum。
4. 冻结 LANG/LC_ALL/TZ/Node/ICU/platform、sensitive-data policy、normalization JSON Pointer replace artifact；不同 cwd/checkout 复验。
5. 独立 host output root，按 execution key 比较 index/Finding/trace/Cycle/diagnostics；WorkBuddy manual configuration 不参加核心比较。
6. isolated OS process 使用 launcher/args/env/input allowlist、fresh cache/config、network off、cache sentinel；另由不同 stateless Agent Session 仅凭 checkout + sample Workspace + successor Handoff恢复并写独立 Record。
7. normalization raw/normalized 双 checksum、nested JSON/CSV/文本 PII scan与未知二进制 fail-closed。
8. unsupported、缺 Tool/Skill、输入修改、输出漂移、silent fallback 负例。

验收：可比输出一致；不一致和不支持明确失败；不新增 WorkBuddy Manifest。

### WP5 — 安全、故障、稳定快照与 ERC

目标：在所有实现稳定后完成独立对抗验收。

顺序：

1. path escape、symlink、secret/PII、真实/模拟污染矩阵。
2. duplicate operation、双进程、stale lease、每个 artifact 边界中断与恢复。
3. 全量专项/回归/插件/文档/真实 MyyShop 只读检查。
4. 按 fixed schema 冻结全部 tracked + non-ignored untracked bytes 的 Git/dirty manifest（排除 ignored node_modules）和 sample Workspace manifest。
5. 验证 delegation/capability/sample/Handoff pins 与 session recovery gate；独立 QA 后组装 draft ERC。
6. 任一后续改动使旧 QA 失效，重跑受影响检查并新建 Record/ERC。

验收：所有测试商户工程 gate 有稳定快照 Evidence；所有真实门仍明确 open。

## 7. 测试策略

| 层级 | 重点 |
| --- | --- |
| Schema/profile | 新类型、状态条件、existing-type required、test scope、unknown field |
| 单元 | 状态机、hash/ID、Signal denominator、eligibility、candidate 排序、normalization |
| 集成 | graph/refs/index/trace、create-only、artifact、lease/CAS、恢复 |
| 端到端 | Cycle 1 → GCD/GSEL → Cycle 2 → CFR/ERC |
| 安全 | path/symlink/secret/PII、真实/模拟污染、宿主输出隔离 |
| 宿主 | Codex/Claude 已适配检查；WorkBuddy test-only/manual boundary |
| 回归 | M2—M5、plugin、docs、legacy 120、真实 MyyShop 只读 validate/index-check |

预期新增命令由实现时写入 `package.json`，名称至少区分 `test:m6-cycle`、`test:m7-strategy`、`test:m8-conformance` 和 test-merchant E2E；未实际创建前不把它们记录为已运行。

## 8. 验收命令门

稳定快照至少执行：

```bash
npm run check:docs
npm run validate:plugin
npm test
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
git diff --check
```

另执行实现后实际存在的 M6/M7/M8 专项测试、双周期 E2E、污染负例、三宿主边界检查与安全/恢复故障矩阵。Record 必须逐条记录命令、退出码、测试数、首次失败和修复。

## 9. 发布、回滚与监控边界

- 本计划不发布。ERC 只作为未来真实内测准备输入。
- create-only 对象不通过删除回滚；错误版本 supersede，旧工件保留。
- 实现若导致真实 MyyShop read-only regression，停止并修复；不自动迁移业务对象。
- 真实连接、Publication、真实 Analytics、两个真实 Cycle 和 release authorization 分别另立 Plan/Task/Record。

## 10. 风险与停止条件

- Spec 未批准或批准范围不清；
- CIS manifest/checksum/active drift/历史恢复合同无法闭合；
- Test Merchant 无法 fail-closed 与真实 MyyShop 隔离；
- 需要改变 approved Spec 0005/0006 核心语义；
- 需要真实账号、凭据、未授权数据、外部写入或 WorkBuddy 虚构包装；
- refs/checksum/CAS/secret/path/symlink 校验无法闭合；
- shared worktree 同目标文件出现无法归因修改；
- 结论必须依赖真实 Publication/Analytics/业务决定才能成立。
