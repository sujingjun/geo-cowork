---
title: Spec 0009 — Cross-host Conformance and Engineering Release Candidate
status: approved
created: 2026-08-27
updated: 2026-08-27
source:
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md
  - docs/specs/0001-plugin-package-contract.md
  - docs/specs/0002-workspace-contract.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/records/2026-08-27-m8-conformance-contract-closure-review.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - README.md
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
  - 2026-08-27 Owner 最新委派：由全新上下文 M8 窄合同技术 Review Agent 在 test-merchant engineering 范围内闭合 CFP artifact 归属、Repository 三态快照与 Tool contract closure
scope: M8 Codex/Claude Code 已适配检查、WorkBuddy 中国区 test-only 语义检查、确定性对比、安全恢复与测试商户工程候选
---

# Spec 0009 — Cross-host Conformance and Engineering Release Candidate

## 1. 继承、状态与授权

本 Spec 继承 Spec 0001—0008 的插件包装、Workspace、对象、Run、Cycle、策略、test scope、安全、create-only、index 与 trace 合同。

Owner 已明确批准本 Spec，可据此按已批准 Plan 实现测试商户 M8。它不授权真实宿主外部写入、真实业务账号读取、commit、push、PR、deploy 或 release。“Engineering Release Candidate”只表示测试商户工程候选工件，不是仓库 Release、插件发布或 v1 完成状态。

测试商户离线工程不要求真实业务账号。M8 可以按账号与数据准备 Runbook 提前确认 Codex、Claude Code、WorkBuddy 中国区在本机可打开/登录及版本信息，但不记录邮箱、Token、Cookie 或完整 Profile；本机登录就绪不等于单次真实业务访问授权。

## 2. 与既有宿主合同的关系

### 2.1 Codex 与 Claude Code

Codex、Claude Code 是当前已提供插件包装的宿主：

- Codex：`.codex-plugin/plugin.json`、`.agents/plugins/marketplace.json`；
- Claude Code：`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`；
- 两者读取同一 `skills/`、`scripts/`、`schemas/` 与外置 Workspace。

M8 可对它们执行 manifest/marketplace/static discovery、共享 Tool 直接运行和经宿主触发的 conformance 检查。宿主登录状态、插件安装与交互式运行仍分别记录；一项通过不能替代另一项。

### 2.2 WorkBuddy 中国区

Spec 0001 与仓库 README 已明确：截至当前基线，WorkBuddy 中国区没有官方开发者包装契约，本仓不提供 WorkBuddy Manifest、Marketplace、导入协议或 CLI validator。

因此 M8 只能使用以下模式：

1. `test_only_semantic_fixture`：用相同 Workspace 输入和结构化宿主指令 fixture 验证业务语义、Tool allowlist 与预期 diagnostics；确定性比较只来自其调用的共享 Tool 输出；
2. `manual_configuration_check`：由人类按 README 在“我的专家/创建技能”中核对自然语言配置、共享 Skill/Workspace 指向与能力限制，保存不含账号信息的检查结论。

`test_only_semantic_fixture` 是 required execution；`manual_configuration_check` 是可选人工准备，未执行时明确 `not_executed` 且不阻断离线工程门。任一模式执行时都必须在 `conformance_result.host_runs[].host_boundary` 输出前四项 false 与 limitation：

```yaml
native_adapter_present: false
native_host_verified: false
packaging_contract_available: false
native_packaging_conformance_applicable: false
limitation_codes: [WORKBUDDY_DEVELOPER_CONTRACT_UNAVAILABLE]
```

禁止：新建或猜测 WorkBuddy Manifest、把人工配置当插件导入、把 test fixture 当真实宿主执行、把本机登录当 capability 通过。官方契约出现后必须另立/更新 Spec 0001 并获批准，不能在 M8 静默恢复包装。

账号 Runbook 的 ACCT-H03“可安装专家/Skill”是 `proposed` 的未来 readiness 问题，不是当前包装事实或 M8 离线工程前置；当前用户指令与 Spec 0001 的无官方契约边界优先。

## 3. 新对象与 ID

| `record_type` | ID 前缀 | 状态 | 职责 |
| --- | --- | --- | --- |
| `conformance_profile` | `CFP-` | `draft/frozen/superseded` | 冻结宿主模式、capability matrix、输入/输出与允许归一化 |
| `session_recovery_result` | `SRR-` | `computed/superseded` | 保存全新无聊天上下文进程的恢复输入、输出摘要与结论 |
| `conformance_result` | `CFR-` | `computed/superseded` | 锁定逐宿主结果、差异、diagnostics 与结论 |
| `engineering_release_candidate` | `ERC-` | `draft/reviewed/superseded` | 汇总稳定快照上的测试商户工程门证据 |

所有对象必须带 Spec 0007 注册的顶层 `test_scope`。实质修订使用新 ID/supersedes，不覆盖旧结果。

## 4. Conformance Profile

### 4.1 必需字段

```yaml
merchant_ref: TMT-...
profile_run_ref: RUN-...
workspace_snapshot:
  workspace_id: ws_...
  workspace_mode: test_only
  manifest_path: <profile_run_ref 的 raw/outputs 下 create-only path>
  manifest_sha256: <sha256>
hosts:
  - host: codex | claude_code | workbuddy_china
    mode: packaging_static | native_interactive | direct_shared_tool |
      test_only_semantic_fixture | manual_configuration_check
    conformance_tier: packaging | native_interactive | shared_tool |
      semantic_fixture | manual_boundary
    execution_key: <host>:<mode>:<conformance_tier>
    host_version: <non-empty 或 unknown>
    packaging_refs: [<repo-relative manifest/marketplace path>]
    login_readiness: ready | not_ready | unknown
    host_boundary:
      native_adapter_present: true | false
      native_host_verified: true | false
      packaging_contract_available: true | false
      native_packaging_conformance_applicable: true | false
      deterministic_comparison_eligible: true | false
      limitation_codes: [<stable code>]
    applicable_outputs: [indexes | finding | trace | cycle_result | diagnostics |
      packaging | manual_configuration]
    session_recovery_applicable: true | false
required_execution_keys:
  - codex:packaging_static:packaging
  - codex:direct_shared_tool:shared_tool
  - claude_code:packaging_static:packaging
  - claude_code:direct_shared_tool:shared_tool
  - workbuddy_china:test_only_semantic_fixture:semantic_fixture
optional_execution_keys:
  - codex:native_interactive:native_interactive
  - claude_code:native_interactive:native_interactive
  - workbuddy_china:manual_configuration_check:manual_boundary
required_comparisons:
  - left_execution_key: codex:direct_shared_tool:shared_tool
    right_execution_key: claude_code:direct_shared_tool:shared_tool
    output_kinds: [indexes, finding, trace, cycle_result, diagnostics]
  - left_execution_key: codex:direct_shared_tool:shared_tool
    right_execution_key: workbuddy_china:test_only_semantic_fixture:semantic_fixture
    output_kinds: [indexes, finding, trace, cycle_result, diagnostics]
  - left_execution_key: claude_code:direct_shared_tool:shared_tool
    right_execution_key: workbuddy_china:test_only_semantic_fixture:semantic_fixture
    output_kinds: [indexes, finding, trace, cycle_result, diagnostics]
  - left_execution_key: codex:packaging_static:packaging
    right_execution_key: claude_code:packaging_static:packaging
    output_kinds: [packaging, diagnostics]
determinism:
  clock:
    mode: fixed
    value: <RFC3339>
  operation_ids:
    scheme_version: <semver>
    values: [{ operation: <stable key>, id: <stable ID> }]
  random_input_forbidden: true
  environment:
    LANG: <frozen value>
    LC_ALL: <frozen value>
    TZ: <frozen value>
    node_version: <exact version>
    icu_version: <exact version>
    platform: <exact os/arch>
artifact_pins:
  delegation_contract: { path: <repo-relative>, sha256: <sha256> }
  capability_matrix: { path: <profile_run_ref 的 output 或 repo-relative>, sha256: <sha256> }
  sample_workspace_manifest: { path: <profile_run_ref 的 output>, sha256: <sha256> }
  successor_handoff: { path: <repo-relative handoff>, sha256: <sha256> }
profile_artifact_manifest:
  schema_version: conformance-profile-artifact-manifest/1.0.0
  path: <profile_run_ref 的 outputs 下 create-only path>
  sha256: <manifest 完整 bytes sha256>
  entries:
    - role: workspace_snapshot | capability_matrix | sample_workspace_manifest |
        normalization_rules | sensitive_data_policy
      path: <profile_run_ref 的 raw/outputs 下 create-only path>
      sha256: <artifact 完整 bytes sha256>
      media_type: <non-empty>
capabilities:
  - id: <stable capability>
    required: true | false
    per_execution:
      - execution_key: <frozen execution key>
        state: supported | unsupported | not_applicable
        evidence: [<repo-relative path 或 fixture ref>]
        reason: <unsupported/not_applicable 时必需；supported 可选>
        contract_ref: <not_applicable 时必需；其他状态可选>
input_contract:
  version: <semver>
  sha256: <sha256>
expected_outputs:
  - execution_key: <frozen execution key>
    output_kind: indexes | finding | trace | cycle_result | diagnostics |
      packaging | manual_configuration
    comparison: byte_exact | canonical_json | semantic_exact | not_applicable
normalization:
  rule_version: <semver>
  artifact_path: <profile_run_ref 的 outputs/ 下 create-only path>
  rules_sha256: <sha256>
  replacements:
    - json_pointer: <固定 RFC 6901 pointer>
      operation: replace
      replacement: <固定占位值>
sensitive_data_policy:
  version: <semver>
  artifact_path: <profile_run_ref 的 outputs/ 下 create-only path>
  sha256: <sha256>
approval: <frozen 时的 fixture human approval>
```

### 4.2 Profile Run 与 artifact 归属

`profile_run_ref` 是对创建当前 CFP 的 Profile Run 的 direct ref，不 exact-pin Run version。该 Run 必须属于同一 Test Merchant/Workspace，Skill 必须是本 Spec 的 conformance profile freeze Tool，input fingerprint 必须覆盖 Profile plan、Workspace snapshot 输入、全部 repository pins 与显式 profile artifacts。

所有声明为 Run-owned 的 path 都必须位于 `profile_run_ref` 的 `raw/` 或 `outputs/`，并遵守 Spec 0003 create-only artifact 合同；不得引用其他 Run、任意 Workspace 文件或插件安装缓存。`delegation_contract/successor_handoff` 等 repository pin 继续使用 repo-relative path；`capability_matrix` 若选择 repo-relative path，则不得伪装为 Run output，也不进入 `profile_artifact_manifest.entries`。

`profile_artifact_manifest.entries` 必须对 CFP 引用的每一个 Run-owned artifact 恰好有一项，manifest 自身除外；按 `role`、path 的 UTF-8 bytes 排序，path 唯一，entry checksum 必须等于 CFP 对应字段与实际 bytes。manifest 自身写入 `profile_run_ref` 的 `outputs/`，create-only 且由 CFP 的 path+sha pin。漏项、重复、额外未引用 entry、跨 Run path、checksum 不一致或同 path 不同 bytes 均失败。

frozen CFP 不再原地修订；任何实质变化创建新 CFP ID 并 supersede 旧对象。Run 后续按既有生命周期提升 version 不使旧 CFP 自失效：历史复验解析 stable `profile_run_ref`，只核对 create-only artifact path/bytes、CFP checksums、`profile_artifact_manifest` 及 sample Workspace 的 CIS/manifest pins，不要求 Run 当前 version 等于一个未冻结的历史值。Run artifact 缺失或 bytes 漂移仍 fail closed。

### 4.3 Workspace snapshot

manifest 按相对 path ASCII 排序，逐项保存 path、media type、sha256、对象 ID/type/version/status；排除 `indexes/` 派生输出、临时 lock 和本次 host output 目录。输入含 symlink、path escape、secret/PII marker、真实 locator 或非 test-only 对象时 profile 不能 frozen。

同一 frozen manifest 复制到每个隔离 host output root；任何宿主不得修改输入。执行前后 manifest checksum 必须相同。

### 4.4 Capability matrix

required capability registry 固定如下，调用方/规则 artifact 不得删减、改名或把 `required` 改 false：

| capability ID | 适用 execution tier | 其他 required execution 的状态 |
| --- | --- | --- |
| `packaging_contract_discovery` | packaging | `not_applicable` + Spec 0001 contract ref |
| `shared_tool_discovery` | shared_tool / semantic_fixture | `not_applicable` |
| `workspace_snapshot_readonly` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `m6_lifecycle` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `m6_analytics_fixture` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `m7_strategy_cycle_two` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `indexes_determinism` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `findings_determinism` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `trace_determinism` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `diagnostics_determinism` | packaging / shared_tool / semantic_fixture | 无 |
| `test_real_isolation` | packaging / shared_tool / semantic_fixture | 无 |
| `secret_pii_protection` | packaging / shared_tool / semantic_fixture | 无 |
| `concurrency_recovery` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |
| `session_recovery` | shared_tool / semantic_fixture | packaging 为 `not_applicable` |

每个 capability 均 `required:true`；“not applicable”是明确的 mode 语义，不是省略检查。

- required capability 在目标模式下 `unsupported` 时该 host result fail loud；不得标为 skipped 后整体通过。
- `hosts[].execution_key` 必须等于 host/mode/tier 三元组拼接，且 Profile 内唯一。required/optional 矩阵固定为 §4.1 所列最小集合；artifact 不得删除 required execution 或把 optional 提升后替换 required。
- capability 逐 `execution_key` 计算，禁止按 host 汇总后用某一 mode 的支持掩盖另一 mode 的 unsupported。
- 每个 `required:true` capability × required execution key 必须恰好有一个 `per_execution` row，state/evidence 均不可缺；重复、缺行或引用 optional key 代替 required key都失败。
- `not_applicable` row 必须有非空 reason 与 contract_ref；unsupported 必须有 reason。调用方不得自定义新的 required capability 来替代固定 registry。
- `not_applicable` 只允许合同本身明确不适用，例如 WorkBuddy native packaging；必须带 reason 和上游 contract ref。
- WorkBuddy 的 `supported` 只能表达 semantic fixture/人工配置能力，不能表达 native adapter。
- capability 不得由命令成功自报；必须有 manifest、Tool output、fixture checksum 或人工检查 Record 等可定位 Evidence。
- `session_recovery` 是 required capability：全新、无聊天上下文的进程只获得 checkout、独立 test-only sample Workspace 和 successor Handoff，必须重建当前 Cycle/每 Goal stage、next action、trace/index/Workspace digests，并记录 `conversation_history_used:false`。任何依赖原对话、模型记忆或未 pin 文件的恢复都失败。
- required matrix 中 Codex/Claude `direct_shared_tool` 与 WorkBuddy `test_only_semantic_fixture` 的 `session_recovery_applicable` 必须 true；packaging static 与 WorkBuddy manual 为 false。optional native 若实际执行则必须 true。
- `delegation_contract` 只规定子任务权限、输入、输出、文件范围、验证和停止条件，不复制 Cycle/Analytics/Strategy 业务规则；业务规则只引用 Specs/Skills/Tools。
- `sample_workspace_manifest` 就是 Spec 0007 独立 test-only fixture Workspace 的冻结 snapshot，不得使用真实 MyyShop 或插件缓存。
- CFP 的 WorkBuddy host boundary 四字段必须与 §2.2 一致并由 Schema 强制；CFR 必须逐值复验，不能只在 trace/正文展示。
- `manual_configuration_check` 的 `applicable_outputs` 只能是 `manual_configuration/packaging` 边界证据，`deterministic_comparison_eligible:false`、`session_recovery_applicable:false`；不能声明 indexes/Finding/trace/Cycle result。`test_only_semantic_fixture/direct_shared_tool` 只有直接调用共享 Tool 的输出可声明核心 applicable outputs。
- `manual_configuration_check` 的 expected output comparison 必须 `not_applicable`；其他 deterministic mode 的核心 output 不得使用该值逃避比较。
- Codex/Claude 的 `packaging_static/direct_shared_tool/native_interactive` 属不同 tier 与 gate；当前基线没有真实 native interactive 证据，因此不能预填 `native_host_verified:true`，也不能用 static/direct pass 替代。
- native interactive 执行的 host version 为 `unknown` 时不能 pass。
- normalization 只能对 frozen JSON Pointer 做固定 `replace`；禁止 delete、glob、正则删除或运行时新增 pointer，业务 ID/status/version/ref/metric/diagnostics/test scope 永不允许替换。
- sensitive-data policy 必须覆盖嵌套 JSON、CSV 单元格与文本；未知/二进制格式无法可靠扫描时 fail closed，不得以“未命中”通过。
- CFP policy ID/version/bytes sha 必须等于 sample Workspace M6 Analytics freeze CIS 所 pin 的政策；M8 不允许更换为较弱 policy。

## 5. 执行与确定性输出

### 5.1 宿主执行合同

每个 host/mode 创建独立 Run 与输出目录，输入固定为 frozen CFP、Workspace snapshot、Tool/Schema/Skill versions、operation plan 与 test scope。全部时间和 operation/business IDs 来自 Profile 冻结值，禁止宿主自行取当前时间或随机 ID。Run 不能共享可写 artifacts、lock 或 cwd 假设。

宿主 adapter 只能：定位共享 Skill/Tool、传递显式 `--workspace`、呈现结构化输出和人工门。不得重写 Query、Claim、Cycle、状态机、错误码或 fallback 行为。

### 5.2 比较输出

至少比较：

- 全部派生 index 文件的集合与 bytes；
- 同一 deterministic detector 的 Finding ID/refs/version/body checksum；
- M6/M7 trace 的节点、边、gate、warning 与 diagnostics code；
- Cycle 1/2 每 Goal track、Business Signal、Review 与选择结果；
- unsupported/blocked/path/security 错误是否同 code、同字段位置且不泄密。

`byte_exact` 不允许归一化。`canonical_json` 只允许对象 key 排序与行尾规范化。`semantic_exact` 只允许 frozen Profile 列出的宿主环境字段，例如绝对 checkout root 与 host version；固定 clock 后的时间、Run/operation/business ID 不得被删除。删除前后必须同时保存 raw 和 normalized checksum。不得删除业务 ID、status、version、ref、metric、warning/error 或 provenance 差异。

`manual_configuration_check` 只作为人工边界 Evidence，不参加 index/Finding/trace/Cycle/Business Signal 核心确定性比较；WorkBuddy 只有 `test_only_semantic_fixture` 中直接调用共享确定性 Tool 的输出可以进入比较，并继续保留非 native 限制。

### 5.3 fail-loud

以下任一情形不得静默降级：

- required capability unsupported；
- host wrapper 没有找到共享 Tool/Skill；
- manifest/profile/version/input checksum 漂移；
- 输出缺失、额外写入、未知字段或 diagnostics code 漂移；
- WorkBuddy 模式尝试进入 native adapter；
- 自动改用另一宿主、API、搜索摘要、人工概述或旧缓存补数。

### 5.4 Session Recovery Result

对每个 `session_recovery_applicable:true` 的 execution，必须启动全新进程，只传入 frozen checkout、test-only sample Workspace 与 successor Handoff，不传原对话、模型记忆、旧进程缓存或人工摘要，并创建：

```yaml
profile_version: { ref: CFP-..., version: <semver> }
host: <host>
mode: <mode>
execution_key: <host>:<mode>:<tier>
run_version: { ref: RUN-..., version: <semver> }
conversation_history_used: false
isolation:
  launcher:
    command: <exact executable>
    path: <absolute launcher path>
    sha256: <launcher bytes sha256>
    args_allowlist: [<exact allowed args>]
    env_allowlist: [LANG, LC_ALL, TZ, PATH, <minimal required>]
  readable_input_allowlist:
    - <frozen checkout path>
    - <sample Workspace path>
    - <successor Handoff path>
  cache_root: { path: <fresh empty path>, initial_manifest_sha256: <empty manifest sha256> }
  config_root: { path: <fresh empty path>, initial_manifest_sha256: <empty manifest sha256> }
  network_enabled: false
  old_cache_sentinel:
    path: <outside allowlist sentinel path>
    expected_readable: false
    observed_readable: false
inputs:
  checkout_head: <40 hex>
  repo_manifest_sha256: <sha256>
  sample_workspace_manifest_sha256: <sha256>
  successor_handoff: { path: <repo-relative>, sha256: <sha256> }
recovered:
  cycle_stage_digest: <sha256>
  next_action_digest: <sha256>
  trace_digest: <sha256>
  index_digest: <sha256>
  workspace_digest: <sha256>
expected:
  cycle_stage_digest: <sha256>
  next_action_digest: <sha256>
  trace_digest: <sha256>
  index_digest: <sha256>
  workspace_digest: <sha256>
result: pass | fail
diagnostics: [{ code: <stable code>, path: <redacted> }]
```

`computed` 只在 launcher/args/env/readable-input allowlist、fresh empty cache/config roots、network disabled、旧 cache sentinel 不可读、输入 pins、五项 digest 与 `conversation_history_used:false` 全部可复验时成立。任何依赖旧聊天、旧 cache、网络或未冻结文件，digest 不一致，或 WorkBuddy manual 模式冒充恢复都为 fail。

除机器 `isolated_os_process` SRR 外，M8 还必须至少启动一次与实现/当前对话不同的 stateless Agent Session，只给 checkout、sample Workspace 与 successor Handoff；其独立 QA Record 必须记录无历史上下文、恢复结论与未验证项，并由 ERC path+sha pin。该 Record 不能由 SRR 自动生成来冒充独立 Agent 证据；WorkBuddy manual 模式不适用。

## 6. Conformance Result

必需字段：

```yaml
merchant_ref: TMT-...
profile_version: { ref: CFP-..., version: <semver> }
input_manifest_sha256: <sha256>
host_runs:
  - host: <host>
    mode: <profile mode>
    conformance_tier: <profile tier>
    execution_key: <profile execution key>
    applicable_outputs: [<profile output kinds>]
    host_boundary:
      native_adapter_present: true | false
      native_host_verified: true | false
      packaging_contract_available: true | false
      native_packaging_conformance_applicable: true | false
      deterministic_comparison_eligible: true | false
      limitation_codes: [<stable code>]
    run_version: { ref: RUN-..., version: <semver> }
    raw_output_manifest_sha256: <sha256>
    normalized_output_manifest_sha256: <sha256>
    capability_results: [{ id: <capability>, result: pass | fail | not_applicable, reason: <text> }]
    diagnostics: [{ code: <stable code>, path: <redacted path>, field: <optional> }]
    session_recovery_version: { ref: SRR-..., version: <semver> } | null
optional_execution_status:
  - execution_key: <optional execution key>
    status: not_executed
    reason: <非空>
comparisons:
  - output_kind: <kind>
    left_execution_key: <execution key>
    right_execution_key: <execution key>
    result: equal | different | not_comparable
    differences: [<field/path + checksums，不含正文>]
conclusion: pass | fail | partial
limitations: [<非空>]
```

- `computed` 只由确定性 comparator 创建。
- CFR 必须对 required execution keys 恰好各有一条 host run；本目标每个 optional key 必须恰好有一条 `not_executed + reason`，Schema 不允许 executed，不得缺字段静默消失。未来执行 optional native/manual 需要新的明确授权并更新 Spec/Record。
- CFR comparisons 必须对 CFP `required_comparisons` 的每个 pair × output kind 恰好有一条结果；遗漏、重复、左右 mode/tier 错配均失败。三个 shared-tool/semantic executions 对核心五类输出必须全对等比较；packaging pair 只做其声明的包装语义/diagnostics 比较。
- Codex/Claude Code 的 `packaging_static/direct_shared_tool` 可以产生对应模式 `pass`，但只有实际完成且留证的 `native_interactive` 才能使 `native_host_verified:true`；静态/直接 Tool 通过不得冒充真实交互宿主验收。
- WorkBuddy `test_only_semantic_fixture/manual_configuration_check` 即使通过，整体 limitation 仍必须保留 `native_host_verified:false`；不得把它归一化掉。
- WorkBuddy 的四个 false boundary 值和 limitation code 是机器 Schema 必填，不是正文提示；`manual_configuration_check` 必须 `deterministic_comparison_eligible:false`。
- 本目标不执行 manual configuration。未来若另获授权，必须新增 checked_by/checked_at/decision_ref/checklist_sha256 四项人类证据，deterministic comparator 只能校验、不能自行生成；在本 Schema 中只能 `not_executed`。
- required capability fail、确定性输出 different 或输入被修改时 conclusion 必须 `fail`。
- 任一 `session_recovery_applicable:true` host 缺 SRR、SRR `result:fail` 或 `conversation_history_used` 非 false 时 conclusion 必须 `fail`；不适用模式必须为 null 并给出 profile reason。
- 只有明确不比较的人工展示字段可 `not_comparable`；核心业务输出不能用 `partial` 隐藏差异。

## 7. Engineering Release Candidate

### 7.1 必需字段

```yaml
merchant_ref: TMT-...
scope: test_merchant_engineering
stable_snapshot:
  git_head: <40 hex>
  repo_manifest_schema: geo-cowork-repo-manifest/2.0.0
  repo_manifest_path: <checkout 外独立 test Workspace 的 Run output>
  repo_manifest_sha256: <sha256>
  dirty_path_manifest_schema: geo-cowork-dirty-path-manifest/2.0.0
  dirty_path_manifest_path: <checkout 外独立 test Workspace 的 Run output>
  dirty_path_manifest_sha256: <sha256>
  workspace_manifest_sha256: <sha256>
  created_at: <RFC3339>
artifact_pins:
  delegation_contract: { path: <repo-relative>, sha256: <sha256> }
  capability_matrix: { path: <Run output/repo-relative>, sha256: <sha256> }
  sample_workspace_manifest: { path: <Run output>, sha256: <sha256> }
  successor_handoff: { path: <repo-relative>, sha256: <sha256> }
  stateless_agent_session_record: { path: <repo-relative QA Record>, sha256: <sha256> }
contract_pins:
  specs:
    - { path: docs/specs/0001-plugin-package-contract.md, sha256: <sha256> }
    - { path: docs/specs/0002-workspace-contract.md, sha256: <sha256> }
    - { path: docs/specs/0003-contract-provenance-kernel.md, sha256: <sha256> }
    - { path: docs/specs/0004-knowledge-query-operating-system.md, sha256: <sha256> }
    - { path: docs/specs/0005-diagnosis-site-asset-proposal.md, sha256: <sha256> }
    - { path: docs/specs/0006-consumer-answer-testing.md, sha256: <sha256> }
    - { path: docs/specs/0007-cycle-analytics-test-merchant.md, sha256: <sha256> }
    - { path: docs/specs/0008-strategy-discovery-cycle-two.md, sha256: <sha256> }
    - { path: docs/specs/0009-cross-host-conformance-engineering-release.md, sha256: <sha256> }
  plan: { path: docs/plans/2026-08-27-m6-m8-test-merchant-engineering-closure-plan.md, sha256: <sha256> }
  task: { path: docs/tasks/2026-08-27-m6-m8-test-merchant-engineering-closure.md, sha256: <sha256> }
  tool_contract_manifest: { schema: geo-cowork-tool-contract-manifest/1.0.0, path: <checkout 外 Run output>, sha256: <sha256> }
  tool_contracts:
    - { role: root | esm_dependency | explicit_pin, path: <repo-relative closure entry>, sha256: <sha256> }
cycle_versions:
  - ref: CYC-...
    version: <semver>
    review_version: { ref: CRV-..., version: <semver> }
conformance_result_versions: [{ ref: CFR-..., version: <semver> }]
verification_runs: [{ ref: RUN-..., version: <semver> }]
gates:
  two_cycle_fixture: pass | fail
  synthetic_real_isolation: pass | fail
  security: pass | fail
  concurrency_recovery: pass | fail
  session_recovery: pass | fail
  cross_host_boundary: pass | fail
  docs_and_plugin: pass | fail
real_world_gates:
  real_myyshop_merchant: not_executed
  real_publication: not_executed
  real_analytics: not_executed
  two_real_cycles: not_executed
  business_effect: not_executed
  codex_native_interactive: not_executed
  claude_code_native_interactive: not_executed
  workbuddy_native_contract: contract_unavailable
  workbuddy_manual_host: not_executed
  release_authorization: not_authorized
limitations: [<非空>]
approval: <reviewed 时必需；draft 时不得出现>
```

### 7.2 状态与门

- Tool 只创建 `draft`；`reviewed` 需要测试商户工程验收人类决定，但不等于批准 PRD/Spec、Release 或部署。
- `draft` 不得含 approval；`reviewed` 必须有完整人类 approval，且 approval 只能确认 test merchant engineering scope。
- `tool_contract_manifest` 必须按 §7.4 固定算法完整列出 M6—M8 schemas、entry scripts、递归 ESM 共享库、三项 Skills 与显式 runtime resource pins；`tool_contracts` 必须与 manifest entries 的 role/path/sha 集合完全相等。漏文件、额外 entry、未 pin runtime resource 或顺序/checksum 漂移均使 stable snapshot 失败。
- 所有 test engineering gates 必须 pass 才能 `reviewed`；`real_world_gates` 必须保持如实状态，不能以 fixture 替换。
- `cross_host_boundary:pass` 只在 required execution matrix 全通过、required comparison coverage 完整且 CFR `conclusion:pass` 时成立；`partial` 不得通过。optional native/manual 结果不得补偿 required failure，也不因 `not_executed` 阻断离线工程门。
- 两个 Cycle 必须是 Spec 0007/0008 的完整 test-only Cycle，各自有 decided Review；全部 Adoption rejected 后取消的 Cycle 不计数。
- Conformance 必须由所有实现修改后的稳定快照生成。快照后任何代码、Schema、Skill、fixture 或测试变化都使旧 ERC/CFR stale，须重跑受影响检查并创建新对象。
- 对象名称、正文与最终报告不得使用“v1 released”“production ready”“MyyShop verified”等越界表述。

### 7.3 Repository/dirty 稳定快照算法

`repo_manifest` 的输入路径先取以下三者并集，再用 NUL status 的 rename/copy pair 合并成逻辑项：

1. `git ls-tree -rz --full-tree HEAD` 的全部 HEAD paths，确保 staged delete/rename 的旧 path 不丢失；
2. `git ls-files --stage -z` 的全部 index stage-0 paths，确保 index 与工作树独立读取；
3. `git ls-files --others --exclude-standard -z` 的全部非 ignored untracked paths。

排除 `.git/` 与 Git ignore 生效的文件，因此 ignored `node_modules/` 不进入；不得手工排除其他 HEAD/index/untracked path。index 出现 stage 1/2/3 的 unmerged entry 时稳定快照直接失败，不选择任一冲突版本。

每个 `geo-cowork-repo-manifest/2.0.0` item 固定为：

```yaml
path: <逻辑当前 path；rename/copy 时等于 new_path>
staged_state: unchanged | added | modified | deleted | renamed | copied |
  type_changed | untracked
unstaged_state: unchanged | added | modified | deleted | renamed | copied |
  type_changed | untracked
path_change: null | {
  kind: rename | copy,
  old_path: <repo-relative>,
  new_path: <repo-relative>,
  observed_in: index | worktree
}
head:
  path: <该层实际 path> | null
  mode: <Git mode> | null
  blob_sha256: <raw blob bytes sha256> | null
index:
  path: <该层实际 path> | null
  mode: <Git mode> | null
  blob_sha256: <raw blob bytes sha256> | null
worktree:
  path: <该层实际 path> | null
  mode: <filesystem 映射的 Git mode> | null
  blob_sha256: <raw file bytes sha256> | null
  size: <non-negative integer> | null
```

三层对象始终存在；某层不存在时该层所有 path/mode/blob 字段必须同时为 null，worktree size 也为 null；某层存在时这些字段必须同时非 null。HEAD/index blob 从对应 Git object 的 raw content 计算 SHA-256，不得把 Git object ID 当 SHA-256；worktree 独立读取当前文件 bytes。HEAD 与 index 的 mode 分别来自 tree/stage，worktree mode 来自 `lstat` 后的固定 Git mode 映射。这样 staged-only content/mode change 表示为 HEAD 与 index 不同、index 与 worktree 相同，不再被 current/HEAD 二态折叠。

staged/unstaged 状态只从 `git status --porcelain=v1 -z --untracked-files=all --ignore-submodules=none` 的 X/Y code 映射，不能按换行、空格或文件内容猜测。`-z` 的 rename/copy row 先读取 new path，再且仅在 X 或 Y 为 `R/C` 时消费紧随其后的 old path；此时 `path_change` 必需、old/new 必须不同、`new_path == path`、`observed_in` 必须对应 X=index 或 Y=worktree。没有 `R/C` 时 `path_change` 必须为 null，不得误吞下一条 status。一个 row 同时产生两个不同 path change、old/new 与三层实际 path 不闭合或 source/destination 重复均失败。rename 将 old/new 合并为一个逻辑 item；copy 保留 old source 的独立 item，并为 new target 创建 path-change item。

X/Y 映射固定为：空格=`unchanged`、`M=modified`、`A=added`、`D=deleted`、`R=renamed`、`C=copied`、`T=type_changed`；`??` 单独映射为 staged `unchanged` + unstaged `untracked`。任何 `U` 或 Git 定义的 unmerged X/Y 组合返回 `REPO_MANIFEST_UNMERGED`；`!!` 不应出现在未开启 ignored 输出的本命令中，出现时返回 `REPO_MANIFEST_STAGE_STATE_MISMATCH`。

path 必须是仓库相对 POSIX、合法 UTF-8 原 bytes，不做 Unicode normalization；按 UTF-8 byte order 排序，不依赖 locale。目录不单列，symlink 直接失败。`tracked_clean` 只能由 staged/unstaged 均 `unchanged`、三层 path 相等且 mode/blob 全等确定；`dirty_path_manifest` 是其余 items 的稳定投影，并完整保留 path_change、三层 path/mode/blob 与 worktree size。它用于人类审查，不能替代完整 repo manifest。

两个 manifest 均为 canonical JSON（对象 key 排序、无额外空白、UTF-8、末尾换行），分别对完整 bytes 计算 SHA-256。任何 HEAD、index 或 worktree path/mode/blob/state 后续变化都使 CFR/ERC stable snapshot stale；ignored `node_modules/` 不进入。

两个 manifest artifact 必须写到 checkout 外的独立 test Workspace/冻结 Run output；禁止写入被扫描 checkout 后再计算，否则会形成自包含 hash 和不可收敛 snapshot。

### 7.4 Tool contract closure 算法

`geo-cowork-tool-contract-manifest/1.0.0` 的 fixed roots 恰好为：

```text
plugins/geo-expert/schemas/m6-record-types.schema.json
plugins/geo-expert/schemas/m7-record-types.schema.json
plugins/geo-expert/schemas/m8-record-types.schema.json
plugins/geo-expert/scripts/cross-host-conformance.mjs
plugins/geo-expert/scripts/geo-analytics.mjs
plugins/geo-expert/scripts/geo-lifecycle.mjs
plugins/geo-expert/scripts/geo-strategy-discovery.mjs
plugins/geo-expert/skills/geo-analytics/SKILL.md
plugins/geo-expert/skills/geo-lifecycle/SKILL.md
plugins/geo-expert/skills/geo-strategy-discovery/SKILL.md
```

closure 生成规则固定如下：

1. fixed roots 不得删除、替换或增加；每项必须是 checkout 内 regular file、非 symlink。代码 root 使用符合 ESM 语法的 parser 读取，不得用正则扫描文本来猜 import。
2. 从四个 entry script 递归解析 static `import`、`export ... from` 和 literal `import("./relative")`/`import('../relative')`；每个 literal relative specifier 按 importer URL 解析，必须显式带文件扩展、留在 checkout 内并解析到 regular non-symlink file。已访问 path 去重，循环只记录一次。相对依赖全部以 `role:esm_dependency` 进入 entries。
3. `import(expression)`、带 substitution 的 template literal 或其他非 literal dynamic import 一律失败；不得以“当前分支未执行”跳过。literal `node:`/bare package specifier 不递归进入 repository closure，但必须去重、按 UTF-8 bytes 排序记录在 `external_specifiers`，供固定 Node/package 环境复验。
4. 不是相对 ESM import 的 runtime contract——包括额外 Schema、模板、asset、policy 与 registry——必须逐 path 声明在 `explicit_pins`，以 `role:explicit_pin` 进入 entries。conformance 执行期间 Tool 对 repository contract/resource 的读取只允许命中 closure entries；实际读取未 pin path 返回错误，因此不能靠漏报 explicit pin 形成假闭包。
5. manifest 保存 `schema_version`、有序 fixed `roots`、有序 `explicit_pins`、有序 `external_specifiers`、有序 `entries[{role,path,sha256,media_type}]` 与 `closure_fingerprint`。所有 path 保留合法 UTF-8 原 bytes，不做 Unicode normalization；roots、pins、specifier 与 entries 均按 UTF-8 bytes 排序，禁止 `localeCompare`。`closure_fingerprint` 对前述四个完整数组的 canonical JSON 计算 SHA-256。
6. manifest 在 checkout 外的冻结 Run output create-only 写入并由 ERC path+sha pin；ERC `tool_contracts` 必须与 entries 在 role/path/sha 上逐项完全相等。fixed root 缺失、递归依赖漏项/多项、显式 pin 漏报/重复、实际读取未 pin、checksum/fingerprint/排序漂移均 fail closed。

## 8. 安全、并发与恢复

- 复用并扩展 path containment、symlink、secret marker、PII、create-only、checksum 与 test/real pollution 检查。
- 宿主登录检查只保存角色、host version、ready 状态和责任人，不保存邮箱、Token、Cookie、Client Secret、恢复码或浏览器 Profile。
- 每个 host run 使用独立 lease；同一 profile/host/mode 的有效 lease 下竞争者失败。stale lease 接管记录 prior owner/revision。
- input manifest、host output manifest、normalized manifest 与 comparison plan 先 create-only 冻结；中断恢复按 checksum 补齐，不重新解释已完成宿主动作。
- comparator 或 ERC 组装中断不得覆盖 CFR/Run/Cycle；重复调用同 bytes `kept`，不同 bytes conflict。
- path escape、symlink、secret/PII、真实 Workspace 写入或 synthetic refs 进入真实对象时，全部宿主必须返回等价 fail-loud diagnostics。

## 9. refs、indexes 与 trace

index registry 增加：

- `conformance-profiles.json`
- `session-recovery-results.json`
- `conformance-results.json`
- `engineering-release-candidates.json`

全部 profile/run/cycle/review/session-recovery/result version refs 进入公共 graph；CFP `profile_run_ref` 作为 direct ref 进入 index，不加入 VERSION_FIELDS。`trace --engineering-candidate <ERC-ID>` 返回：Test Merchant → Cycle 1 Review → Goal Selection → Cycle 2 Review → frozen Conformance Profile/Profile Run/artifact manifest pins → host Runs → SRR fresh-session evidence → comparisons/limitations → Engineering Candidate gates → real-world open gates。

trace 必须显示 WorkBuddy mode 与四个 false boundary 字段，不能把 `not_applicable` 边删除；缺 stable snapshot、host Run、CFR 或安全/恢复证据返回 `TRACE_INCOMPLETE`。

## 10. CLI 预期行为

```text
cross-host-conformance.mjs freeze-profile --workspace <path> --plan <json>
cross-host-conformance.mjs run --workspace <path> --profile <CFP-ID> --execution <execution-key>
cross-host-conformance.mjs compare --workspace <path> --plan <json>
cross-host-conformance.mjs assemble-engineering-candidate --workspace <path> --plan <json>
cross-host-conformance.mjs trace --workspace <path> --candidate <ERC-ID>
```

本节只冻结未来接口。命令不提供 WorkBuddy manifest generation、自动安装/登录、真实账号访问、Release/publish/deploy 或 Git 写 flag。

## 11. 错误与 warning

错误至少包括：

```text
CONFORMANCE_PROFILE_NOT_FROZEN
CONFORMANCE_PROFILE_RUN_REQUIRED
CONFORMANCE_PROFILE_RUN_MISMATCH
CONFORMANCE_PROFILE_ARTIFACT_MANIFEST_INVALID
CONFORMANCE_ARTIFACT_OWNER_MISMATCH
CONFORMANCE_INPUT_DRIFT
CONFORMANCE_INPUT_MUTATED
CONFORMANCE_CLOCK_NOT_FROZEN
CONFORMANCE_OPERATION_ID_DRIFT
HOST_MODE_INVALID
EXECUTION_KEY_INVALID
EXECUTION_KEY_DUPLICATE
EXECUTION_MATRIX_INCOMPLETE
HOST_CAPABILITY_UNSUPPORTED
HOST_CAPABILITY_MATRIX_INCOMPLETE
CAPABILITY_REGISTRY_OVERRIDE_FORBIDDEN
HOST_SKILL_NOT_FOUND
HOST_TOOL_NOT_FOUND
HOST_OUTPUT_INCOMPLETE
HOST_OUTPUT_DRIFT
HOST_DIAGNOSTIC_DRIFT
REQUIRED_COMPARISON_INCOMPLETE
REQUIRED_COMPARISON_DUPLICATE
NORMALIZATION_FIELD_FORBIDDEN
WORKBUDDY_NATIVE_ADAPTER_FORBIDDEN
WORKBUDDY_DEVELOPER_CONTRACT_UNAVAILABLE
SESSION_RECOVERY_CONTEXT_LEAK
SESSION_RECOVERY_MISMATCH
SESSION_RECOVERY_ISOLATION_FAILED
SESSION_RECOVERY_CACHE_SENTINEL_READABLE
STATELESS_AGENT_SESSION_REQUIRED
CONFORMANCE_ARTIFACT_PIN_MISMATCH
SENSITIVE_DATA_POLICY_MISMATCH
SENSITIVE_DATA_UNSCANNABLE
MANUAL_CONFIGURATION_EVIDENCE_REQUIRED
NATIVE_HOST_VERSION_REQUIRED
NORMALIZATION_DELETE_FORBIDDEN
LOGIN_SECRET_STORAGE_FORBIDDEN
SYNTHETIC_REAL_REF_CONTAMINATION
REAL_WORKSPACE_WRITE_FORBIDDEN
CONFORMANCE_LEASE_ACTIVE
CONFORMANCE_RECOVERY_CONFLICT
ENGINEERING_CANDIDATE_GATE_FAILED
ENGINEERING_CANDIDATE_STALE_SNAPSHOT
REPO_MANIFEST_INVALID
REPO_MANIFEST_INDEX_STATE_MISSING
REPO_MANIFEST_STAGE_STATE_MISMATCH
REPO_MANIFEST_PATH_CHANGE_INVALID
REPO_MANIFEST_UNMERGED
TOOL_CONTRACT_ROOT_SET_MISMATCH
TOOL_CONTRACT_DYNAMIC_IMPORT_NON_LITERAL
TOOL_CONTRACT_IMPORT_RESOLUTION_FAILED
TOOL_CONTRACT_UNPINNED_RESOURCE
TOOL_CONTRACT_CLOSURE_MISMATCH
DIRTY_PATH_MANIFEST_INVALID
REAL_GATE_MISREPRESENTED
TRACE_INCOMPLETE
```

`CONFORMANCE_PROFILE_RUN_REQUIRED` 用于缺少 direct `profile_run_ref`；`CONFORMANCE_PROFILE_RUN_MISMATCH` 用于 Run 类型、Test Merchant/Workspace、Skill 或 input fingerprint 不匹配；`CONFORMANCE_ARTIFACT_OWNER_MISMATCH` 用于 Run-owned path 不属于该 Run；profile artifact manifest 的漏项、重复、额外 entry、排序或 checksum 闭包错误统一使用 `CONFORMANCE_PROFILE_ARTIFACT_MANIFEST_INVALID`。

`REPO_MANIFEST_INDEX_STATE_MISSING` 用于无法读取独立 stage-0 index path/mode/blob；三层存在性、X/Y state 与 mode/blob 不相符使用 `REPO_MANIFEST_STAGE_STATE_MISMATCH`；NUL rename/copy 第二 path 的出现条件、old/new/observed layer 不闭合使用 `REPO_MANIFEST_PATH_CHANGE_INVALID`；index 有 stage 1/2/3 时使用 `REPO_MANIFEST_UNMERGED`。

fixed roots 不完全相等使用 `TOOL_CONTRACT_ROOT_SET_MISMATCH`；非 literal dynamic import 使用 `TOOL_CONTRACT_DYNAMIC_IMPORT_NON_LITERAL`；relative import 缺扩展、越界、缺文件或解析到非 regular file 使用 `TOOL_CONTRACT_IMPORT_RESOLUTION_FAILED`；运行时读取 closure 外 repository resource 使用 `TOOL_CONTRACT_UNPINNED_RESOURCE`；entries/pins/external specifiers/fingerprint/`tool_contracts` 任一集合、排序或 checksum 不闭合使用 `TOOL_CONTRACT_CLOSURE_MISMATCH`。

warning 至少包括：

```text
HOST_VERSION_UNKNOWN
HOST_LOGIN_NOT_READY
WORKBUDDY_SEMANTIC_FIXTURE_ONLY
WORKBUDDY_MANUAL_CONFIGURATION_ONLY
HOST_OUTPUT_NOT_COMPARABLE
ACCOUNT_READY_NOT_AUTHORIZED
SESSION_RECOVERY_PENDING
REAL_MYYSHOP_GATE_OPEN
V1_RELEASE_GATE_OPEN
```

## 12. 测试与验收范围

必须先以失败测试覆盖：

- 新类型/状态/字段、refs/version/index/trace、create-only 与 stable snapshot；
- CFP 缺/错 `profile_run_ref`、Run-owned artifact 跨 Run、profile artifact manifest 漏项/重复/额外/checksum 冲突负例；相同 artifact bytes 下 Profile Run 正常 version bump 不得使 frozen CFP 自失效；
- deterministic fixed clock/operation IDs，宿主随机时间/ID 漂移负例；
- 冻结 LANG/LC_ALL/TZ/Node/ICU/platform，在不同 cwd/checkout 下复验；localeCompare/Unicode path/ID 关键排序必须使用稳定 byte comparator；
- Codex/Claude manifest/marketplace/shared Tool 正例和缺包装/缺 Skill/缺 Tool 负例；
- execution key 三元组、同 host 多 mode、重复 key、漏 required、optional/static pass 冒充 native 负例；
- WorkBuddy test-only semantic/manual mode 正例，native adapter/虚构 Manifest/假验收负例；
- WorkBuddy manual configuration 不进入核心比较；semantic fixture 只比较共享 Tool 输出；
- capability supported/unsupported/not_applicable，required capability 静默跳过负例；
- fixed capability registry ID 不可省略/改名/降级，required capability × execution 的 reason/contract-ref 条件校验；
- required capability × execution key 矩阵的唯一完整覆盖，以及 required comparisons 三个核心 execution 全 pair × 五类 output 与 packaging pair 覆盖；遗漏/重复/错 mode负例；
- 相同输入 index/Finding/trace/Goal track/Business Signal/Cycle result/diagnostics 一致；
- normalization allowlist 与删除业务差异负例；
- normalization artifact/固定 JSON Pointer replace 正例，delete/glob/regex/动态 pointer 负例；
- 子宿主输入修改、额外输出、缓存补数、换 API/宿主 fallback；
- path escape、symlink、secret/PII、账号信息、真实/模拟污染；
- versioned sensitive-data policy 的嵌套 JSON/CSV/文本正负例，未知二进制不可扫描 fail closed；
- 并发 host Run、stale lease、每个 artifact 边界中断、resume/supersede；
- 无聊天上下文新进程仅用 checkout + sample Workspace + successor Handoff 恢复 stage/next action/trace/digests，任何历史上下文依赖负例；
- launcher/args/env/readable allowlist、fresh cache/config、network disabled、旧 cache sentinel 不可读，以及不同 stateless Agent Session 独立 Record/pin；
- delegation contract/capability matrix/sample workspace/successor Handoff path+checksum pin 与漂移负例；
- repo/dirty manifest 覆盖 HEAD/index/worktree 三层 content+mode：staged-only bytes/mode、unstaged-only、同时修改、staged add/delete、untracked、rename/copy NUL old/new path 与非法 path-change、unmerged index、Unicode byte sort、symlink 和 ignored node_modules 负例；仅 index 变化也必须改变 manifest sha；
- tool contract fixed roots、递归 static/re-export/literal relative dynamic import、循环去重、非 literal dynamic import、relative path escape/缺扩展/缺文件/symlink、额外 Schema/asset 未显式 pin、runtime 读取未 pin、UTF-8 byte sort、closure fingerprint 与 ERC `tool_contracts` 漏项/多项/checksum 漂移红测；
- ERC 双周期、隔离、安全、并发恢复、session recovery、conformance gates 与全部真实门保持 open；
- ERC 后发生修改使旧 QA/stable snapshot 失效；
- M2—M8、plugin、Workspace/index、docs 与真实 MyyShop 只读回归。

通过上述测试只回答“测试商户范围的系统工程闭环是否通过”。WorkBuddy fixture 不等于真实宿主验收，宿主本机登录不等于真实数据访问，ERC 不等于 v1 Release。

## 13. 非目标

- 不创建 WorkBuddy Manifest/Marketplace/导入协议；
- 不自动安装宿主、登录账号或读取真实业务数据；
- 不连接 GA4/GSC/CRM/CMS/消费者平台；
- 不创建 GitHub PAT、写权限、commit、push、PR、deploy 或 release；
- 不把工程候选表述为真实 MyyShop 内测、两个真实 Cycle、业务效果或生产就绪。
