---
title: M6—M8 测试商户系统工程闭环架构
status: approved
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/architecture/2026-08-20-cross-host-plugin-architecture.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
scope: 测试商户 M6—M8 目标模块、对象关系、数据流与已批准架构决策；不替代 Spec 或实现
---

# M6—M8 测试商户系统工程闭环架构

## 1. 目标形态

```text
Codex / Claude Code / WorkBuddy 中国区边界内测试入口
                         │
                         ▼
                  Primary GEO Expert
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  geo-lifecycle      geo-analytics   geo-strategy-discovery
  Cycle 编排/门禁    Observation      人工触发战略分支
        │                │                │
        └────────────────┼────────────────┘
                         ▼
              Deterministic Node Tools
      合同校验 / 状态推进 / index / trace / 恢复
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
独立测试商户 Workspace             真实 MyyShop Workspace
synthetic/test_only + .invalid      只读回归，不写测试对象
```

宿主拥有 Agent loop；共享 Skills 负责编排和人工门；确定性 Tool 负责合同、状态、索引、追踪与恢复；Workspace 中 canonical Markdown 保存事实。M6—M8 不新建第四套 Agent Runtime、数据库或云端控制面。

## 2. 分层职责

| 层 | 职责 | 不得做 |
| --- | --- | --- |
| 宿主边界 | 触发 Skill、呈现人工决定、调用同一 Tool | 复制状态机、修改业务语义、静默降级 |
| `geo-lifecycle` | 冻结 Cycle 输入、推进阶段、汇总门与 Review | 自动批准、自动发布、判断因果 |
| `geo-analytics` | 校验 adapter 输入、登记 Observation、组装 Review 输入 | 把 Observation 当 Evidence、保存凭据 |
| `geo-strategy-discovery` | 检查显式触发、组织维度与候选、等待人类选择 | 自动触发、自动确认 Product Gap 或 Cycle 2 Goal |
| 确定性 Tool | Schema/ref/version/checksum、状态、index、trace、并发/恢复 | 调用真实外部系统、做语义批准 |
| fixture adapter | 提供可重复的 GA4/GSC/业务事件形状 | 冒充真实连接或真实数据 |
| read-only seam | 约束未来连接器输入输出、权限与快照 | 在本目标中连接真实系统或保存认证信息 |
| 测试 Workspace | 保存 synthetic canonical 对象与 create-only artifacts | 引用或污染真实 MyyShop 对象 |
| 真实 MyyShop | 只用于验证未被改写及未来接入边界 | 接收 fixture Claim/Evidence/批准/指标 |

## 3. 对象关系

### 3.1 M6 主链

```text
Test Merchant Identity
→ Cycle（Goal / Query Set / KR / Asset / Collector Profile / measurement version pin）
→ M5 Baseline 或 fixture Baseline
→ M4 Gap / Proposal / Adoption / Publication
→ Technical Retest
→ Answer Retest / Aggregation
→ Analytics Observation
→ Business Signal
→ Cycle Review
```

Analytics Observation 与 Evidence 是不同对象：Observation 记录“看到什么”；Evidence 记录“什么 snapshot 在什么 Scope 下可以支持什么 Claim”。只有独立 materialization plan 与人工决定可以新建 Evidence；关系必须是显式 ref，不能通过共享状态或字段暗示升级。

### 3.2 M7 分支

```text
Cycle 1 Review
→ deterministic GCB + ordinary GCD（不要求 strategy）
→ fixture human GSEL decision
→ selected Cycle 2 Goal
→ Cycle 2

M4 双证据 + 人工确认的 open Product Gap（可选输入）
→ Gate 0 人工 invocation
→ deterministic eligibility check
→ 人工 proceed 决定
→ Decision Dimensions
→ Strategy Output（机会、PRD 草案、人工验证计划）
```

战略分支可缺省；普通 Cycle 2 候选无需 strategy。M7 只消费并反向引用 M4 已确认 open Product Gap，不创建、确认或扩展 Finding Schema。Strategy Output 不回写 Product Gap、Claim、Knowledge Release 或产品批准。

### 3.3 M8 验收链

```text
Frozen conformance input bundle
→ host capability declaration
→ host-mode run
→ canonical normalized outputs
→ byte/semantic comparison + diagnostics
→ Conformance Result
→ test-merchant Engineering Release Candidate
```

Codex、Claude Code 可进入已适配宿主检查。WorkBuddy 中国区只能进入 `test_only_semantic_fixture` 或人工配置语义检查，其结果必须携带限制，不能计为 native adapter 通过。

## 4. 隔离架构

### 4.1 身份域

- 测试 Workspace ID、namespace、对象 ID 与 run scope 独立。
- 测试商户 identity 的法定主体标记固定为 fictitious，locator 只允许 `.invalid` 或 Workspace-local。
- 每个 synthetic 对象直接包含已注册顶层 `test_scope: {kind:synthetic, usage:test_only, merchant_ref, workspace_id}`；核心隔离规则不读取 `extensions`。
- 真实与测试对象图分别加载；cross-graph ref 在写入前失败，不能等到 index 阶段才发现污染。

### 4.2 写入域

- Tool 接收一个解析后的绝对 Workspace 根；所有 path containment 与 symlink 检查基于该根。
- 测试实现不得将真实 `workspaces/myyshop` 作为输出根、fixture root 或默认 fallback。
- 对真实 MyyShop 的回归只允许运行现有只读 validate/index-check；任何 write plan 都在预检阶段拒绝。

## 5. 状态与恢复架构

Cycle 公共 `status` 沿用既有 `proposed/active/waiting_human/completed/cancelled/superseded`；更细阶段由 Cycle stage 与 create-only transition ledger 表示。每次推进先验证：

```text
当前 status/stage
+ frozen input versions
+ required refs/checksums
+ scope/provenance
+ lease ownership
→ 生成 create-only transition intent（recorded 不等于 applied）
→ 在 exclusive lock 内比较 expected Cycle version
→ 写新 Cycle revision，并把 CTR 加入 `cycle.transition_refs`
→ CTR 才成为 applied
```

重复同 operation/fingerprint 返回 `kept`；不同 bytes 返回冲突。CTR 写入后崩溃产生 orphan intent，同输入/expected version恢复时附加到 Cycle；输入或版本漂移时创建新 CTR supersede 旧 intent，旧 intent 永不计为阶段完成。关键输入变化时保留旧对象和 Run，创建 superseding Cycle/Run。

## 6. Analytics adapter seam

统一输入：adapter kind/version、scope、metric definitions、time window、source locator、artifact plan、授权/fixture decision。统一输出：Observation payload、口径、维度、时间窗、采集时间、read-only 证明、artifact descriptors、diagnostics。

- fixture adapter：只读 Workspace-local 文件，固定数据和时钟，必须 test_only。
- 未来 GA4/GSC adapter：只允许 read-only scope；认证只在进程环境中使用，不落 Workspace。
- 未来 business-file adapter：需要文件授权、字段映射、PII/secret 检查和不可变 snapshot。

本架构只冻结 seam，不选择认证方案、不接入真实服务。

## 7. 跨宿主架构

宿主包装只负责发现共享 Skill/Tool：

- Codex：沿用 `.codex-plugin/plugin.json` 与 `.agents/plugins/marketplace.json`；
- Claude Code：沿用 `.claude-plugin/plugin.json` 与 `.claude-plugin/marketplace.json`；
- WorkBuddy 中国区：沿用 README 中的待适配边界，仅用人工配置说明和 test-only fixture 检查语义。

Capability matrix 对每项能力标记 `supported/unsupported/not_applicable`、证据与模式。`unsupported` 必须失败或停门，不能静默换宿主、跳过步骤或用人工输出伪装确定性 Tool 结果。

## 8. 安全与并发

- 复用现有 `PATH_ESCAPE`、`SYMLINK_NOT_ALLOWED`、`SECRET_MARKER`、checksum 与 create-only 机制；新增对象同样进入公共 walker。
- Workspace/Run/Cycle 使用稳定 scope lease；有效 lease 下第二写入者失败，过期接管保留前 owner 与 revision。
- conformance 每个宿主使用隔离输出目录，比较完成前不合并。
- diagnostics 不含原始 secret、完整响应、账号标识或环境变量。

## 9. 已批准架构决策

### AD-M68-1 扩展既有 Cycle，而不另建第二套生命周期

沿用 `CYC-` 与现有 Run 语义，通过 M6 profile、transition ledger 和 Cycle Review 扩展；避免并行状态机。

### AD-M68-2 Observation 与 Evidence 只通过显式物化相连

不让 adapter 直接创建 approved Evidence；Observation 可独立存在。符合第一方证据条件时，以新 ID、新 checksum 和人类决定创建 Evidence。

### AD-M68-3 Cycle 2 采用确定性候选 + 人类选择

候选生成固定排序与来源规则；选择是独立人类决定。这样既可复验，也不把策略判断隐藏进算法。

### AD-M68-4 WorkBuddy 保持待包装适配

在官方开发者契约出现前，不增加第三 Manifest。M8 只验证共享语义和人工配置边界，报告中必须显示 `native_host_verified:false`。

### AD-M68-5 工程候选不是 v1 Release

工程候选只聚合测试商户的稳定快照证据；真实 MyyShop 两个 Cycle、真实 Publication/Analytics 和 release authorization 继续是外部门。

### AD-M68-6 Frozen version pin 与当前单 revision graph 的兼容取舍

当前 graph 对一个 stable ID 只解析当前 canonical revision；若 Cycle 直接长期 pin 源对象 live version，后续正常 version bump 会让历史 Cycle mismatch。M6 采用局部不可变 `Cycle Input Snapshot`：freeze/review 时把源对象 ID/type/version/path/body/file checksum 写入 create-only manifest，创建时对当前 graph 全校验；Cycle/Review 只 version-pin CIS。

active Cycle 每次推进比较 live inputs 与 freeze CIS，漂移则 supersede；completed 历史从 CIS bytes 恢复，不要求 live graph 保留旧 revision。这样保持 Spec 0003/0004 stable ID + version 语义，不扩展所有既有 consumer，也不把 Git 历史冒充当前 graph resolver。

### AD-M68-7 M8 required execution matrix

工程门固定要求：Codex/Claude Code 各自 `packaging_static + direct_shared_tool`，WorkBuddy 中国区 `test_only_semantic_fixture`。Codex/Claude `native_interactive` 与 WorkBuddy `manual_configuration_check` 均为 optional/not executed，不以登录 readiness 或 optional pass 替代 required execution。WorkBuddy manual 未执行不阻断离线工程门。

### AD-M68-8 两层无历史恢复

M8 同时要求：机器隔离 OS process 的 SRR（空 cache/config、network off、输入 allowlist、旧 cache sentinel 不可读）和至少一次由不同 stateless Agent Session 生成的独立 QA Record。两者都只接收 checkout、sample Workspace、successor Handoff；WorkBuddy manual 模式不适用。

## 10. 非目标

不定义字段级 Schema、错误码或具体 CLI；这些由 Spec 0007—0009 定义。不实现真实 connector、WorkBuddy 包装、云端部署、外部发布或真实 MyyShop 对象迁移。
