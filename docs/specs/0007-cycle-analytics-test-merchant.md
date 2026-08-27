---
title: Spec 0007 — Cycle Analytics Test Merchant
status: approved
created: 2026-08-27
updated: 2026-08-28
source:
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/records/2026-08-27-m5-m6-two-slot-lease-compatibility-review.md
  - docs/records/2026-08-28-m7-review-candidate-generation-contract-review.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
scope: M6 测试商户身份、Cycle 冻结与推进、Analytics Observation、Evidence 分离、Cycle Review、恢复与污染防护
---

# Spec 0007 — Cycle Analytics Test Merchant

## 1. 继承、状态与授权

本 Spec 继承 Spec 0003 的公共字段、stable ID、refs、version pin、checksum、index、Run、create-only、安全与 supersede；继承 Spec 0004 的 Goal/Query Set/Knowledge Release/Claim/Evidence/approval；继承 Spec 0005 的 Gap/Proposal/Adoption/Publication/Technical Retest；继承 Spec 0006 的 Baseline/Retest/Profile/Sample/Review/Aggregation。

本 Spec 只定义 M6 测试商户系统行为。Owner 已明确批准本 Spec，可据此按已批准 Plan 实现 Schema、Tool、Skill、fixture 与测试；真实系统、真实数据、Git 远端、部署与发布仍未授权。

真实业务账号不是测试商户离线工程前置。未来真实 MyyShop 内测只能依据账号与数据准备 Runbook 使用用户控制登录/OAuth/脱敏导出和最小只读权限；账号就绪不等于某次真实访问授权。

## 2. 新对象与 ID

| `record_type` | ID 前缀 | 状态 | 职责 |
| --- | --- | --- | --- |
| `test_merchant` | `TMT-` | `draft/frozen/superseded` | 冻结虚构测试商户身份与隔离规则 |
| `cycle_input_snapshot` | `CIS-` | `recorded/superseded` | create-only 保存 freeze/review 时输入对象的不可变元数据与 bytes manifest |
| `cycle_transition` | `CTR-` | `recorded/superseded` | create-only 记录一次合法阶段推进 |
| `analytics_observation` | `ANO-` | `recorded/superseded` | 保存测量口径、时间窗与观测值，不承担 Evidence 角色 |
| `business_signal` | `BSIG-` | `computed/superseded` | 从冻结 Observation 与口径确定性计算业务信号，不承担 Evidence 或因果角色 |
| `cycle_review` | `CRV-` | `draft/waiting_human/decided/superseded` | 汇总 Cycle 结果、局限和人类结论 |

本 Spec 扩展既有 `cycle`、`evidence` 与 `run`，不创建第二套 Query、Claim、Publication、Sample 或 Evidence 类型。

本 Spec 新增类型的实质修订创建新 ID，并以 `supersedes_ref` 指向同类型旧对象；旧对象、旧 Run 和 artifacts 保留。既有 M2—M5 对象继续遵守 Spec 0003/0004 的 stable ID + version 语义，本 Spec 不要求它们改 ID 或新增通用 supersede 字段。

### 2.1 当前实现兼容约束

当前源码只为 Cycle 校验 Spec 0003 的 `core_versions` 和公共状态，尚无 Cycle 生命周期 Tool、M6 语义 validator 或 Cycle trace；实施不得把字段“可被公共 Schema 解析”误报为 M6 合同已成立。

`object-contract.mjs` 合并同名类型时只保留该类型首次注册的 `required` 集合，后续 Schema 只能合并 properties/allOf/status 等；因此本 Spec 对既有 `cycle/evidence/run` 增加的必填字段，必须由独立 M6 profile validator 强制，或先经另行批准修正公共 Schema merge 语义并做 M2—M5 回归。不得假定新增 `m6-record-types.schema.json` 的 `required` 会自动生效。

当前 `workspace-validate --objects` 只加载 base graph/index 校验，不运行 M3/M4/M5 profile semantics。M6 必须提供独立 `geo-lifecycle validate/trace`，并在总验收入口显式聚合 base graph 与 M3—M6 profile 检查；单独的 `workspace-validate --objects` 不能代表 M6 ready。

M5 基础 Collector Profile Schema 的 `sampling_count` 必须保留 `[2, 3]`，仅用于解析既有历史对象。真实 MyyShop graph 当前有 6 个获批两槽协议之前产生的 exploratory Profile 使用 `sampling_count: 3`；把基础 Schema 改成 `const: 2` 会使这些不可变历史对象和真实 Workspace graph 失效。该兼容入口不扩大 Spec 0006：M5 `baseline/post_change_retest`、M6 test profile、所有新 Collector Profile/materializer 仍必须由 profile/plan validator 强制 `sampling_count: 2`；`sampling_count: 3` 不得进入 Baseline、Retest、Answer Aggregation 或 Cycle。Answer Sample 与 M5 Run `sample_slots` 的 ordinal 在基础 Schema 中仍只允许 `1 | 2`，不得为历史 Profile 补 ordinal 3。

既有 M5 Run 的 `lease` 没有 `revision`，因此基础 M5 Run Schema 只可把 `lease.revision` 增加为可选正整数。M6 Schema 不得重新声明或覆盖 `run.properties.lease`；当前同名类型的 properties 是浅合并，后注册的 nested `lease` 会整体覆盖 M5 定义并把历史 M5 Run 误纳入 M6 约束。只有独立 M6 profile validator 对 `skill: geo-lifecycle | geo-analytics` 的 Run 强制完整 M6 字段与 `lease.revision`；`geo-answer-cycle` 历史 Run 继续按 M5 基础合同解析。

### 2.2 Cycle Input Snapshot

为避免当前单 revision graph 因源对象后续 version bump 使历史 Cycle 自失效，M6 新建局部不可变快照，而不改变源对象身份模型。

`cycle_input_snapshot` 必需字段：

```yaml
merchant_ref: TMT-...
cycle_ref: CYC-...
snapshot_kind: freeze | transition | review | strategy
manifest:
  schema_version: cycle-input-snapshot/1.0.0
  artifact_path: <对应 Run outputs/ 下 create-only path>
  sha256: <manifest 完整 bytes sha256>
  fingerprint: <entries canonical JSON sha256>
source_entries:
  - entry_key: <sha256>
    object_id: <stable canonical ID>
    record_type: <registered type>
    object_version: <semver>
    object_path: <Workspace-relative Markdown path>
    content_sha256: <gray-matter body 原始 UTF-8 sha256>
    file_sha256: <完整 Markdown bytes sha256>
    snapshot_path: <对应 CIS Run outputs/ 下 create-only .md copy>
    snapshot_sha256: <copy 完整 bytes sha256，必须等于 file_sha256>
artifact_entries:
  - entry_key: <sha256>
    role: measurement_contract | signal_rule | sensitive_data_policy |
      raw_manifest | rubric | other_contract
    source_path: <原 Run artifact 或 Workspace contract path>
    snapshot_path: <对应 CIS Run outputs/ 下 create-only copy>
    media_type: <non-empty>
    source_sha256: <原完整 bytes sha256>
    snapshot_sha256: <copy 完整 bytes sha256，必须等于 source_sha256>
base_freeze_snapshot_version: { ref: CIS-..., version: <semver> } # review 时必需
pre_review_transition_snapshot_versions: [{ ref: CIS-..., version: <semver> }]
pre_review_entry_keys: [<截至 analytics_recorded 的 gate entry key>]
run_ref: RUN-...
supersedes_ref: CIS-... # 放弃的 active snapshot 被替代时可选
```

约束：

1. canonical object entry key 覆盖 ID/type/version/original path/body hash/file hash/snapshot path/snapshot hash；artifact entry key 覆盖 role/source path/source hash/snapshot path/snapshot hash/media type。两类 entries 分别按 entry key ASCII 排序且唯一；manifest fingerprint 覆盖两个完整数组、base/pre-review snapshot refs/entry keys。
2. 每个 source entry 必须把原 Markdown 完整 bytes 复制到当前 CIS Run `outputs/` 的 create-only `.md`，每个 artifact entry同样复制完整 bytes；snapshot sha 必须等于原 sha。CIS 不能只保存 hash 后声称可恢复，历史 trace 必须从 snapshot copy 重新 parse。
3. `freeze` snapshot 包含全部 Goal/Query/Query Set/KR/Claim/Answer Card/Evidence/Asset/Collector Profile 与 measurement/rule artifacts；`transition` snapshot 捕获本次 gate 对象/artifacts；`review` snapshot 纳入 freeze + 全部 applied transition CIS并复制最终 Review 输入；`strategy` snapshot 捕获 M7 eligibility 所需的 reviewed ARV/Query/Sample、approved Evidence、Finding/Product Gap 与规则 artifacts。
4. 两类 entries 是不可变历史 metadata+bytes，不作为 live graph refs 或 VERSION_FIELDS；创建 CIS 时必须回到当前 graph/Workspace 全量校验 ID/type/version/path/file bytes、refs 闭包、artifact containment/create-only 来源和 profile readiness，校验后把 manifest create-only 写入当前 Run `outputs/`。
5. Cycle、Transition、Review 与 Strategy 只 version-pin CIS 自身；completed 历史 trace 从 CIS snapshot copies 重建，不再要求源对象当前 version 等于历史 version。
6. active Cycle 每次推进前把当前 live inputs 与 `freeze` CIS 比较；任一 version/path/checksum 漂移则 supersede 当前 Cycle/Run并重新冻结，不能继续。completed Cycle 只验证 CIS bytes/checksum，不因 live object 后续 bump 失效。
7. Review CIS 是 pre-review cutoff：`base_freeze_snapshot_version` 指向 freeze CIS；`pre_review_transition_snapshot_versions/pre_review_entry_keys` 必须完整包含创建前、截至每个 Goal track `analytics_recorded` 的全部 applied CTR gate snapshots/entries，防止早期 gate 后续 bump 被“洗新”。它明确排除尚未发生、以 Review 自身为 gate 的 `review_waiting_human` 和 `review_decided` 两次 transition，避免闭包循环。
8. CIS manifest/copy 缺失、checksum 不匹配、含 symlink/真实污染或同 entry key bytes 冲突时 fail closed。
9. `freeze` CIS 与新 Cycle 双向引用时，materialization plan 必须预分配 CYC/CIS ID、version 和预期 bytes，在内存验证完整闭包后 create-only 写入；中断只按同一 plan/checksum 补齐，任一已存 bytes 不同即冲突。

## 3. 测试商户合同

### 3.1 Workspace 身份

`test_merchant` 必需字段：

```yaml
workspace_id: ws_<独立身份>
workspace_namespace: <不与真实 Workspace 重叠的稳定 namespace>
display_name: <明确含测试含义的名称>
identity:
  legal_entity_kind: fictitious
  canonical_locator: https://<name>.invalid/
  real_brand_identity_claimed: false
provenance:
  kind: synthetic
  usage: test_only
  decision_ref: <fixture human decision>
  semantic_projection_ref: <可选；仅指向已批准产品语义来源>
real_workspace_forbidden:
  - workspaces/myyshop
approval: <fixture human approval；frozen 时必需>
```

约束：

1. 测试 Workspace 的 `workspace.json` 必须以前向兼容字段显式声明：

   ```json
   {
     "workspace_mode": "test_only",
     "test_namespace": "<stable non-production namespace>",
     "legal_entity": false,
     "subject_locator": "https://<name>.invalid/"
   }
   ```

   每个 fixture 写命令先核对 `workspace_id + workspace_mode + test_namespace + legal_entity + subject_locator` 与 frozen Test Merchant 完全一致。缺失、未知、冲突或非 `test_only` 一律 fail closed；不得从路径名或 `development_fixture` 猜测测试身份。
2. `test_merchant: frozen` 的 `workspace_id` 必须与目标 `workspace.json` 一致，Workspace 路径不得等于或位于真实 `workspaces/myyshop/`。
3. `canonical_locator` 与 `workspace.json.subject_locator` 只允许 `.invalid`；本地 artifact 使用 Workspace-relative path。
4. `semantic_projection_ref` 只说明测试语义来源，不创建真实 Claim，也不能引用真实 Workspace 中的 canonical ID。
5. 公共对象 Schema 注册可选顶层 `test_scope`；测试商户 Workspace 中由本里程碑新建的模拟对象必须直接包含：

   ```yaml
   test_scope:
     kind: synthetic
     usage: test_only
     merchant_ref: TMT-...
     workspace_id: ws_...
   ```

6. `test_scope` 是核心隔离字段，validator、write plan 和污染检查必须读取它；不得放入 `extensions`。`extensions` 只允许非核心展示信息，遵守 Spec 0003“核心规则不得从 extensions 读取”的约束。
7. `merchant_ref` 必须解析到当前 Workspace 的 frozen Test Merchant，`workspace_id` 必须与根身份一致；缺失或跨 Workspace 失败。
8. fixture approval 的 `decision_ref` 必须显式标明测试用途；不得复用真实 MyyShop approval。

### 3.2 污染防护

以下任一情形在写入前返回 error，且不得留下正式文件：

- 测试对象引用真实 MyyShop 对象、URL、账号、Evidence 或 Run；
- 真实对象引用 `TMT-/CTR-/ANO-/BSIG-/CRV-` 或带顶层 `test_scope` 的对象；
- fixture Observation/Evidence/approval 进入真实 Claim、Knowledge Release、Aggregation 或业务指标分母；
- 输出根、artifact 根或恢复 fallback 指向真实 `workspaces/myyshop`；
- 测试 identity 缺 `.invalid`、`synthetic/test_only` 或独立 namespace。

validator 必须同时检查 direct refs、version refs、Run inputs、index refs 与 Markdown body/manifest 中声明的 locator；不能只检查目录名。

## 4. Cycle M6 Profile

### 4.1 必需字段

既有 `cycle` 增加：

```yaml
scope: test_merchant_engineering
merchant_ref: TMT-...
cycle_number: 1 # 仅加载 Spec 0007 profile 时
core_versions:
  input_snapshot: { ref: CIS-..., version: <semver> }
aggregate_stage: prepared | frozen | baseline_recorded | diagnosis_ready |
  adoption_decided | publication_confirmed | technical_retest_completed |
  answer_retest_completed | analytics_recorded | review_waiting_human |
  review_decided | cancelled_no_adoption | mixed
completion_scope: none | full | partial
goal_tracks:
  - goal_entry_key: <freeze CIS 中 GOAL entry key>
    input_snapshot_version: { ref: CIS-..., version: <semver> }
    query_set_entry_key: <freeze CIS 中 QS entry key>
    knowledge_release_entry_keys: [<freeze CIS entry key>]
    evidence_entry_keys: [<freeze CIS entry key>]
    asset_entry_keys: [<freeze CIS entry key>]
    collector_profile_entry_keys: [<freeze CIS entry key>]
    measurement_contract_entry_key: <freeze CIS artifact entry key>
    stage: prepared | frozen | baseline_recorded | diagnosis_ready |
      adoption_decided | publication_confirmed | technical_retest_completed |
      answer_retest_completed | analytics_recorded | review_waiting_human |
      review_decided | cancelled_no_adoption
    baseline_aggregation_refs: [AGG-...]
    finding_refs: [FND-...]
    evidence_plan_refs: [EPL-...]
    asset_proposal_refs: [PRP-...]
    adoption_record_refs: [ADR-...]
    publication_refs: [PUB-...]
    technical_retest_run_refs: [RUN-...]
    answer_retest_aggregation_refs: [AGG-...]
    analytics_observation_refs: [ANO-...]
    business_signal_refs: [BSIG-...]
    review_input_snapshot_version: { ref: CIS-..., version: <semver> } | null
transition_refs: [CTR-...]
cycle_review_version: { ref: CRV-..., version: <semver> } | null
predecessor_review_version: { ref: CRV-..., version: <semver> } | null
goal_selection_version: { ref: GSEL-..., version: <semver> } | null
```

- 一个 Cycle 可包含多个 Goal；每个 `goal_tracks` 项通过同一 freeze CIS 中的 entry key 独立冻结 Query Set/KR/Evidence/Asset/Profile，并以 direct refs 跟踪 active outputs、以 review CIS 冻结最终 Review 输入。当前双周期 fixture 可以每个 Cycle 只有一个 Goal，但实现和 validator 不能丢弃最终产品方案的多 Goal 语义。
- 仅加载 Spec 0007 registry/profile 时只允许 Cycle 1，`predecessor_review_version` 与 `goal_selection_version` 必须为空。Cycle 2 只有在 Spec 0008 registry/profile 同时加载、且两个字段通过其精确版本校验时才合法；Spec 0007 不能单独接受 `cycle_number:2`。
- `status` 继续使用既有状态；Goal track `stage` 与顶层 `aggregate_stage` 不新增仓库级状态词。
- `aggregate_stage` 是确定性派生摘要：全部 track 同 stage 时取该 stage，不同时为 `mixed`。一个 Goal 完成不得推进其他 Goal。

### 4.2 冻结规则

每个 Goal track 执行 `prepared → frozen` 时必须独立验证：frozen Test Merchant、freeze CIS 中该 approved/active Goal、frozen Query Set、published/ready Knowledge Release、Evidence、M4 Asset profile、frozen Collector Profile、measurement contract 及全部 entry bytes/checksum。

测试 fixture 可以使用显式 test approval 跑通状态机，但每个相关对象都必须处于独立测试 Workspace 且带 test scope。真实 MyyShop 未完成的业务门不能由测试批准补写。

冻结后 active live input 与 CIS 任一 version/path/content/file checksum 不同：当前 Cycle/Run `superseded`，保留历史，按源对象正常 stable ID/version 语义更新后创建新的 freeze CIS 与 Cycle/Run。completed 历史 Cycle 使用旧 CIS 复原，不要求 live graph 保留旧 revision，也不自动修改或提升被引用 Goal 的状态。

### 4.3 每个 Goal track 的阶段状态机

```text
prepared
→ frozen
→ baseline_recorded
→ diagnosis_ready
→ adoption_decided
├─ 全部 recommendation rejected + human cancel/no_adoption
│  → cancelled_no_adoption
└→ publication_confirmed
→ technical_retest_completed
→ answer_retest_completed
→ analytics_recorded
→ review_waiting_human
→ review_decided
```

Cycle 公共状态由所有 Goal track 确定性汇总：

- 所有 track 均为 `prepared`：`status: proposed`；
- 任一 track 位于 `diagnosis_ready`（Gap/Adoption 待决定）、`adoption_decided`（Publication 或 no-adoption 待决定）或 `review_waiting_human`：`status: waiting_human`；
- 全部 track 为 `review_decided`：`status: completed`、`completion_scope:full`；
- 全部 track 为 `cancelled_no_adoption`：`status: cancelled`；
- 所有 tracks 都已 terminal 且 `review_decided/cancelled_no_adoption` 混合：`status: completed`、`completion_scope:partial`，不能满足完整工程 Cycle/ERC gate；
- 其他正常推进组合：`status: active`；
- `cancelled/superseded` 由显式 Cycle terminal transition 决定并优先于汇总。

合法例外只有 `active ↔ waiting_human` 的明确人工门；`cancelled/superseded` 终止当前 Cycle。禁止跳阶段、倒退、从 terminal 继续、用一个 Goal 的门推进另一个 Goal，或通过直接编辑 Cycle 跳过 `cycle_transition`。

### 4.4 阶段前置

| Goal track 目标阶段 | 必需前置证明 |
| --- | --- |
| `baseline_recorded` | M5 baseline Sample/Review/Aggregation refs 完整；fixture 结果明确 test_only |
| `diagnosis_ready` | M4 Finding/Proposal refs 闭合；Gap 分类满足 Spec 0005 |
| `adoption_decided` | `adoption_record:decided` + fixture human approval |
| `publication_confirmed` | `asset_publication:confirmed` + `.invalid` locator + test approval；不表示真实外部发布 |
| `technical_retest_completed` | Publication 对应 Technical Retest Run/Finding 完整 |
| `answer_retest_completed` | M5 post-change Retest 前置、两槽与 Aggregation 完整 |
| `analytics_recorded` | measurement contract 对应的合法 Observation 与 Business Signal 均完整；允许 `no_signal/insufficient_data/negative`，coverage/unknown 明示，不要求伪造正向增长 |
| `review_waiting_human` | `cycle_review:waiting_human` + review CIS 锁定全部输入 bytes；draft 不能作为前置 |
| `review_decided` | Cycle Review `decided` + fixture human decision，未把观察写成因果 |

若一个 Goal 的 Adoption Record 中全部 recommendation item 均为 `rejected`，唯一合法行为是由人类显式选择 `cancel/no_adoption`，把该 Goal track 推进到 `cancelled_no_adoption`；不得伪造 Publication/Retest，也不得把该 track 计为完整工程 Cycle。单个 Goal 取消不推进或取消其他 Goal；只有全部 tracks 都取消时 Cycle 才是 `cancelled`。存在其他已完成 Goal 时 Cycle 的终止摘要必须显示 `partial`，ERC 的完整双周期 gate 不接受含取消 track 的 Cycle。

## 5. Cycle Transition

必需字段：

```yaml
cycle_ref: CYC-...
goal_ref: GOAL-... | null
supersedes_ref: CTR-... # 可选；仅孤儿 intent 被新 operation 替代时必需
operation_id: <stable idempotency key>
operation_fingerprint: <sha256>
expected_cycle_version: <semver>
input_snapshot_version: { ref: CIS-..., version: <semver> }
gate_snapshot_version: { ref: CIS-..., version: <semver> } # snapshot_kind:transition
from_status: <existing cycle status>
to_status: <existing cycle status>
from_stage: <§4.3 Goal track stage | aggregate mixed | Cycle terminal>
to_stage: <§4.3 Goal track stage | aggregate mixed | Cycle terminal>
required_gate_entry_keys: [<gate snapshot entry key>]
lease_revision: <positive integer>
actor:
  kind: deterministic_tool | fixture_human
  decision_ref: <human transition 时必需>
```

`operation_fingerprint` 覆盖 operation ID、Cycle ID、目标 Goal track、`expected_cycle_version`、freeze/transition CIS ref/version/fingerprint、required gate entry keys、from/to 与 tool contract。相同 operation ID/fingerprint/bytes 返回 `kept`；相同 operation ID 不同 fingerprint 或 bytes 返回 conflict。

推进前先创建 `snapshot_kind:transition` CIS，把本次实际 gate 对象/artifacts完整复制并冻结 entry keys；随后用 create-only lock 独占 Cycle scope，在锁内重新读取 Cycle并比较 `expected_cycle_version`。只有 live gates 仍与 transition CIS 一致且 version 匹配者可写 CTR 与新 Cycle revision；不匹配返回 `CYCLE_CAS_MISMATCH`。当前 Run 的 read→temporary rename 实现本身不提供此并发保证，不得直接复用后宣称 CAS 已成立。Cycle 当前指针只有在 CTR 完整写入、snapshot/entry closure 复验和锁内版本比较通过后更新。`goal_ref:null` 只用于 Cycle-level freeze、aggregate mixed/terminal 汇总、cancel/supersede；Goal track 阶段推进必须指定对应 Goal。

`cycle_transition:recorded` 只表示 transition intent 已持久化，不表示已应用。只有当前 Cycle 的 `transition_refs` 包含该 CTR 且新 Cycle revision 与 `to_status/to_stage` 一致时才是 applied。若进程在 CTR 写入后、Cycle CAS 前中断，同一 operation 恢复时附加该 CTR；不得重复创建或把孤儿 intent 计为阶段完成。若恢复时输入或 expected version 已漂移，创建新的 CTR ID 并以 `supersedes_ref` 指向旧 intent，旧 CTR 保留但永不进入 applied 统计。

普通 CTR 不得包含 `supersedes_ref`；只有确认替代 orphan intent 的新 CTR 必须包含它，且目标只能是同 Cycle/operation lineage 的未 applied CTR。

## 6. Analytics Observation

### 6.1 必需字段

```yaml
merchant_ref: TMT-...
cycle_ref: CYC-...
goal_ref: GOAL-...
run_ref: RUN-...
adapter:
  kind: fixture | ga4 | gsc | business_file | server_log
  name: <non-empty>
  version: <semver>
  access_mode: fixture | read_only
  authorization_ref: <fixture decision；真实访问时必需>
measurement_contract:
  version: <semver>
  artifact_path: <Run output 或 Workspace-relative contract path>
  artifact_entry_key: <freeze/transition CIS artifact entry key>
  sha256: <sha256>
sensitive_data_policy:
  id: <stable id>
  version: <semver>
  artifact_entry_key: <freeze CIS 中 policy artifact entry key>
  sha256: <sha256>
time_window:
  starts_at: <RFC3339>
  ends_at: <RFC3339>
  as_of: <RFC3339>
metrics:
  - metric_id: <stable key>
    definition: <non-empty>
    value: <number | null>
    unit: <non-empty>
    dimensions: { <stable key>: <scalar> }
    state: observed | unavailable | partial
    limitation: <null 或非空>
artifacts:
  - path: <对应 run_ref 的 raw/ 或 outputs/ 下 create-only path>
    sha256: <sha256>
    media_type: <non-empty>
quality:
  completeness: complete | partial | unavailable
  warnings: [<code>]
causal_claim: false
```

### 6.2 adapter seam

- 测试商户只允许 `adapter.kind: fixture`、`access_mode: fixture` 和 Workspace-local 脱敏输入。
- `run_ref` 必须指向当前 Analytics Run；Run 允许按既有状态机 bump version，因此 ANO 不 exact-pin Run version。artifact 只能位于该 Run 的 `raw/` 或 `outputs/`，写入采用 create-only；transition/review CIS 复制完整 bytes 保存历史，不能引用任意 Workspace 文件伪装 raw。
- measurement contract path/sha 与 sensitive policy ID/version/sha 必须分别匹配 freeze/transition CIS 的 artifact entry/copy。
- 真实 GA4 未来只允许 Property `Viewer` 与 `analytics.readonly`；GSC 优先 Restricted user 与 `webmasters.readonly`；权限不足时请求 Owner 决定，不自动提升。
- 真实业务文件只接受明确授权的脱敏聚合导出；不要求数据库账号或生产 SSH。
- adapter 不接收或保存密码、Cookie、Token、Client Secret、`.env` 值或未脱敏 PII；授权只登记角色、scope、资源 ID、期限与撤销责任。
- 账号/权限准备完成不等于 Run 的 `authorization_ref`；每次真实访问仍须独立决定。
- adapter 不创建 Claim、Evidence、批准、Publication 或因果结论。
- 在写 raw plan 或 artifact 前，adapter 必须按 pinned versioned sensitive-data policy 和 adapter kind 执行字段 allowlist、值类型/大小限制、secret marker 与 PII 扫描；policy ID/version/CIS artifact copy/sha 必须闭合。未知字段、禁止字段、嵌套 JSON/CSV 命中或无法扫描的二进制内容 fail closed 或明确 `unavailable`。现有 Markdown 行级 secret 扫描不能替代结构化预检。
- M8 conformance 必须 pin 并复用同一 sensitive-data policy ID/version/bytes sha；不得另配更弱政策通过宿主检查。

### 6.3 Observation 与 Evidence 分离

`analytics_observation` 永远不是 Evidence，不能出现在 `claim.evidence_refs`。需要把第一方业务数据登记为 Evidence 时，必须走独立 materialization plan：

1. 输入一个或多个非 superseded `observation_versions`、原始授权、数据口径、Scope、snapshot/checksum、事实 Owner 与 Evidence ID/path；
2. 预检 Evidence 所需 Source、Claim 与 approval 边；
3. 生成新的 `EVD-` 对象并在 M6 Evidence profile 中增加 version-pinned `observation_versions`；
4. Evidence 初始只能 `candidate`；人类另行审核后才可推进；
5. Observation 不修改，Evidence 也不继承 Observation 的 `recorded` 状态。

测试商户允许 synthetic Evidence 与 fixture approval 仅用于状态机测试；它们必须 test_only，不能进入真实 Claim/KR 或真实业务结论。

## 7. Business Signal

Business Signal 是对冻结 Observation 的确定性派生，不是 raw Observation、Evidence、Claim、Cycle 结果或因果证明。

必需字段：

```yaml
merchant_ref: TMT-...
cycle_ref: CYC-...
goal_ref: GOAL-...
run_ref: RUN-...
observation_versions: [{ ref: ANO-..., version: <semver> }]
measurement_contract:
  version: <semver>
  artifact_path: <Run output 或 Workspace-relative contract path>
  artifact_entry_key: <freeze/transition CIS artifact entry key>
  sha256: <sha256>
rule:
  id: <stable id>
  version: <semver>
  artifact_path: <Run output 或 Workspace-relative rule path>
  artifact_entry_key: <freeze/transition CIS artifact entry key>
  sha256: <sha256>
signal_kind: ai_visit | ai_registration | registration_trend |
  search_visibility | server_referrer | custom
denominator:
  definition: <non-empty>
  value: <number | null>
  state: known | zero | unknown | not_applicable
calculation:
  value: <number | null>
  unit: <non-empty>
  state: signal_observed | no_signal | insufficient_data | negative | unavailable
  explanation: <非空确定性说明>
causal_claim: false
```

约束：

- `computed` 要求所有 Observation version、measurement/rule version 与 Goal track 精确匹配；输入 superseded、Scope 不同或时间窗不兼容时失败。
- measurement/rule path/sha 必须与对应 CIS artifact entry/copy 闭合，不接受松散 path/hash 自报。
- `run_ref` 指向计算本 Signal 的 Run；不 exact-pin可 bump 的 Run version，历史 rule/input/output bytes 由 transition/review CIS 保存。
- 计算必须明确 denominator；未知、零分母或数据不足产生 `null + state/reason`，不得补零、猜值或换口径。
- `no_signal/insufficient_data/negative` 均是合法工程输出；Analytics 完成门要求 Observation + Signal 合同完整，不要求正向增长。
- Business Signal 必须带公共 `test_scope`，不能进入真实业务指标分母；不能出现在 `claim.evidence_refs`，也不能被物化为 Evidence 而绕过 Observation/Evidence 门。
- 重算规则变化创建新 `BSIG-` 并 supersede 旧对象；不得原地覆盖历史计算。

## 8. Cycle Review

必需字段：

```yaml
merchant_ref: TMT-...
cycle_ref: CYC-...
reviewed_cycle_input_version: <创建 review CIS 时读取的 Cycle version 快照>
review_input_snapshot_version: { ref: CIS-..., version: <semver> }
review_input_fingerprint: <必须等于 review CIS manifest fingerprint>
goal_results:
  - goal_entry_key: <review CIS 中 GOAL entry key>
    perception_goal: achieved | partial | not_achieved | inconclusive
    observations: [<非空事实描述>]
    business_signal_entry_keys: [<review CIS 中 BSIG entry key>]
    limitations: [<非空边界>]
    forbidden_conclusions: [<不得推出的因果/真实结论>]
next_cycle_candidate_inputs:
  - candidate_kind: query_cluster | content_gap | evidence_gap |
      severe_misperception | recommendation_reason | product_gap
    source_goal_entry:
      entry_key: <review CIS 中 GOAL entry key>
      object_id: GOAL-...
      object_version: <semver>
      file_sha256: <sha256>
    source_entries:
      - { entry_key: <review CIS entry key>, object_id: <ID>, record_type: <type>, object_version: <semver>, file_sha256: <sha256> }
    rank_inputs:
      priority: <non-negative integer>
    goal_statement: <非空>
    success_question: <非空>
    query_cluster_key: <非空>
    evidence_gaps: [<非空或空数组>]
    risks: [<非空或空数组>]
approval: <fixture human decision；decided 时必需>
supersedes_ref: CRV-... # waiting_human/decided 新对象按条件指向前态
```

- Tool 可选创建 `draft` 准备对象；进入 `review_waiting_human` 前必须创建新的 `waiting_human` CRV（若有 draft则 `supersedes_ref` 指向 draft），不得用 draft 作为阶段前置。Tool 不得创建 `decided` 或 Goal 结果 approval。
- `review_input_snapshot_version` 必须指向 `snapshot_kind:review` 的 pre-review CIS；它必须闭合 freeze 与截至 analytics_recorded 的 applied transitions/gates，但不得反向包含后生的 review waiting/decided transitions。缺任一 pre-review transition 或 analytics gate copy 时不得创建 waiting_human CRV。
- `decided` 必须使用新 CRV ID、`supersedes_ref` 指向 waiting_human CRV并有显式人类决定；不能从 draft 直接 decided，也不能在同一 CRV ID 原地改状态。`reviewed_cycle_input_version` 是 review CIS 创建时的历史快照，不要求持续等于 Review 进入 Cycle 后再次 bump 的当前 Cycle version；gate 只在创建/应用 transition 时用 `expected_cycle_version` 校验。`review_input_fingerprint` 必须等于 pinned review CIS fingerprint。
- 每个 Goal 恰有一个 `goal_results`，且只能引用自己 track 的 Observation/Signal；一个 Goal 的结果不能代表其他 Goal。
- `perception_goal` 结果是该测试 Cycle 的人工判断，不提升真实 MyyShop Goal。
- `next_cycle_candidate_inputs` 使用冻结结构而非字符串占位；它只是 Spec 0008 的确定性候选输入，不等于已选择 Goal。
- `next_cycle_candidate_inputs` 不保存 GCD 的 `rationale/limitations`；两者只能由 Spec 0008 冻结、带 checksum 的版本化候选生成规则从 `candidate_kind` 确定性派生。调用方 plan、聊天历史或 Agent 临场文本不得补充或覆盖。
- `candidate_kind` 限制 review CIS source types：`query_cluster` 只允许 Q/QS/ARV/AGG；`content_gap/evidence_gap/product_gap` 必须含对应 FND；`severe_misperception/recommendation_reason` 只允许 reviewed ARV/AGG 及其已锁定 Query。所有 source entries 必须属于 `source_goal_entry` 对应 Goal track；跨 Goal 输入失败。

## 9. refs、indexes 与 trace

index registry 增加：

- `test-merchants.json`
- `cycle-input-snapshots.json`
- `cycle-transitions.json`
- `analytics-observations.json`
- `business-signals.json`
- `cycle-reviews.json`

新增 refs 与 version refs 必须进入公共 graph；Cycle/Cycle Track/Transition/Review/Strategy 对 CIS 的 version pin、CIS `base_freeze_snapshot_version/pre_review_transition_snapshot_versions`、M6 Evidence/BSIG `observation_versions` 必须加入 VERSION_FIELDS/index。CIS/ANO/BSIG `run_ref`、CTR freeze/gate snapshot 与 CIS/CTR/CRV `supersedes_ref` 进入 direct ref index。CIS source/artifact entry keys 只在 snapshot manifest 闭包中解析，不作为 live graph refs。

`trace --cycle <CYC-ID>` 必须按 Goal track 从 freeze/pre-review CIS 与 transition snapshots 重建：Test Merchant → frozen inputs → Baseline → Finding/Proposal → Adoption → Publication → Technical Retest → Answer Retest → Analytics Observation → Business Signal → Goal result。review waiting/decided 两次 CTR 各自用 transition CIS 冻结对应 CRV；completed trace 直接组合 freeze CIS + pre-review CIS + Cycle `transition_refs` 中全部 applied transition CIS（含 review 两次），不要求 pre-review CIS 反向包含后生 transition。active trace 同时报告 live drift；completed trace 只要求上述 snapshot bytes 完整。缺边返回 `TRACE_INCOMPLETE`；未到阶段返回 gate，不伪装完成。

trace 必须同时返回：`scope:test_merchant_engineering`、`synthetic:true`、`real_myyshop_impact:false` 与污染扫描结论。

## 10. Run、并发与恢复

M6 Run 增加：

```yaml
merchant_ref: TMT-...
cycle_ref: CYC-...
cycle_version: <semver>
transition_plan_sha256: <sha256>
lease:
  scope_key: <workspace id + cycle id>
  owner_id: <local process/run identity>
  revision: <positive integer>
  acquired_at: <RFC3339>
  heartbeat_at: <RFC3339>
  expires_at: <RFC3339>
```

上述 `lease` 是 M6 profile 约束，不是对所有历史 Run 的基础 Schema 追溯性必填。基础 M5 Run Schema 提供相同 nested 结构并把 `revision` 设为可选；M6 Schema 不复制该 nested 定义，`geo-lifecycle/geo-analytics` Run 缺 `revision` 时由 M6 profile 返回 `M6_FIELD_REQUIRED`。

- 同一 scope 只能有一个有效 lease；竞争者返回 `LEASE_ACTIVE`，不得并发推进。
- 只有 lease 过期、input fingerprint 相同且 transition plan 完整时可接管；记录前 owner/revision。
- 每个 completed step 必须有 create-only artifact checksum 或 canonical ref；缺证明不跳过。
- 半成品恢复只按冻结 plan 补齐；已存 bytes 不同则冲突并停止。
- 输入变化走 Spec 0003 supersede；旧 Cycle/Transition/Observation/Review 不删除。

## 11. CLI 预期行为

```text
geo-lifecycle.mjs validate --workspace <path>
geo-lifecycle.mjs prepare-test-merchant --workspace <path> --plan <json>
geo-lifecycle.mjs create-cycle --workspace <path> --plan <json>
geo-lifecycle.mjs advance --workspace <path> --cycle <CYC-ID> --plan <json>
geo-lifecycle.mjs assemble-review --workspace <path> --plan <json>
geo-lifecycle.mjs trace --workspace <path> --cycle <CYC-ID>
geo-analytics.mjs ingest-fixture --workspace <path> --plan <json>
geo-analytics.mjs compute-signals --workspace <path> --plan <json>
geo-analytics.mjs materialize-evidence --workspace <path> --plan <json>
```

本节只冻结未来接口；本 SDD 任务不创建上述脚本。所有写命令必须先全量预检，并拒绝真实 MyyShop 输出根。`materialize-evidence` 不提供自动 approval 参数。

`prepare-test-merchant` 只有两种合法模式：对空目录调用扩展后的 workspace init，并在同一 create-only identity plan 中一次性写入 `workspace.json` test-only 字段与 TMT；或只读验证一个已预建且身份完整的 test Workspace。禁止在已有真实/unknown Workspace 上事后补 `workspace_mode/test_namespace/legal_entity/subject_locator` 把它转换成测试商户。

## 12. 错误与 warning

错误至少包括：

```text
TEST_MERCHANT_IDENTITY_INVALID
TEST_MERCHANT_SCOPE_REQUIRED
REAL_WORKSPACE_WRITE_FORBIDDEN
SYNTHETIC_PROVENANCE_REQUIRED
SYNTHETIC_REAL_REF_CONTAMINATION
CYCLE_INPUT_NOT_READY
CYCLE_INPUT_SNAPSHOT_INVALID
CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH
CYCLE_INPUT_SNAPSHOT_CONFLICT
CYCLE_INPUT_SNAPSHOT_COPY_MISSING
TRANSITION_GATE_SNAPSHOT_INCOMPLETE
REVIEW_SNAPSHOT_CYCLE_DETECTED
REVIEW_PRE_CUTOFF_INCOMPLETE
CYCLE_VERSION_DRIFT
CYCLE_CAS_MISMATCH
INVALID_CYCLE_TRANSITION
CYCLE_GATE_REQUIRED
TRANSITION_CONFLICT
TRANSITION_INTENT_ORPHANED
TRANSITION_INTENT_INPUT_DRIFT
ANALYTICS_ADAPTER_INVALID
ANALYTICS_READ_ONLY_REQUIRED
ANALYTICS_AUTHORIZATION_REQUIRED
ANALYTICS_ARTIFACT_CONFLICT
ANALYTICS_FIELD_NOT_ALLOWED
ANALYTICS_PII_DETECTED
ANALYTICS_SENSITIVE_DATA_POLICY_REQUIRED
BUSINESS_SIGNAL_INPUT_DRIFT
BUSINESS_SIGNAL_DENOMINATOR_INVALID
OBSERVATION_AS_EVIDENCE_FORBIDDEN
BUSINESS_SIGNAL_AS_EVIDENCE_FORBIDDEN
EVIDENCE_MATERIALIZATION_INCOMPLETE
CYCLE_REVIEW_APPROVAL_REQUIRED
LEASE_ACTIVE
LEASE_STALE_RECOVERY_REQUIRED
PATH_ESCAPE
SYMLINK_NOT_ALLOWED
SECRET_MARKER
TRACE_INCOMPLETE
```

warning 至少包括：

```text
ANALYTICS_PARTIAL
ANALYTICS_UNAVAILABLE
BUSINESS_SIGNAL_NO_SIGNAL
BUSINESS_SIGNAL_INSUFFICIENT_DATA
BUSINESS_SIGNAL_NEGATIVE
OBSERVATIONAL_ATTRIBUTION_ONLY
FIXTURE_APPROVAL_USED
REAL_MYYSHOP_GATE_OPEN
ACCOUNT_READY_NOT_AUTHORIZED
```

## 13. 测试与验收范围

必须先以失败测试覆盖：

- 新类型、状态、字段、未知字段、ID、refs/version/checksum/index/trace；
- 基础 Schema 可解析真实 MyyShop 的 6 个历史 `sampling_count:3` exploratory Profile，但 M5 formal/M6 test profile 与全部新 materializer 拒绝 3；`sampling_count:3` 不能进入 Baseline、Retest、Aggregation 或 Cycle；Sample/Run ordinal 3 始终失败；
- 基础 Schema 可解析没有 `lease.revision` 的历史 `geo-answer-cycle` Run，M6 Schema 不含 nested `run.properties.lease` 覆盖；`geo-lifecycle/geo-analytics` Run 缺 `lease.revision` 必须由 M6 profile 失败；
- freeze/transition/review/strategy CIS 的完整 bytes copy、entry/hash/排序/create-only/checksum、创建时 live graph 校验、active drift supersede 与 completed history从copy解析；
- `workspace.json` 的 `workspace_mode/test_namespace/legal_entity/subject_locator`、顶层 test_scope、`.invalid` 和真实/模拟双向污染；
- 单 Goal 与多 Goal 的独立 track，某一 Goal 完成/失败不得带动其他 Goal；`cancelled_no_adoption` 的单/all-track 汇总；
- 完整 Cycle 1 正常链与每个缺门、跳阶段、倒退、terminal 继续；全部 Adoption rejected 必须 cancel/no_adoption；
- input drift、transition gate snapshot、operation fingerprint、expected version CAS、CTR orphan intent、重复调用、并发竞争、stale lease、每个写入边界中断、resume/supersede；
- fixture adapter 正常/部分/不可用、versioned sensitive policy、字段 allowlist、嵌套 JSON/CSV/raw secret/PII、未知二进制 fail-closed、read-only seam和授权缺失；
- Business Signal 的 signal/no_signal/insufficient_data/negative、零/未知分母、规则漂移及 test-only 分母隔离；
- Analytics Observation 被误当 Evidence/因果、Evidence materialization 半成品；
- Review CIS fingerprint、new-ID decided Review、自 Cycle version bump 不误判 drift、candidate kind/source Goal/type 约束；
- pre-review cutoff 不含 review waiting/decided 后生 transitions、无闭包循环、不得遗漏 analytics gate；completed trace 组合后生 transition CIS；
- fixture Publication checkbox 被误当真实外部发布；
- path escape、symlink、secret marker、create-only bytes 冲突；
- M2—M5、plugin、真实 MyyShop 只读 validate/index-check 回归。

通过这些测试只证明测试商户工程能力，不证明真实连接、真实 Publication、真实 Analytics、真实 MyyShop Cycle 或业务效果。

## 14. 非目标

- 不连接 GA4/GSC/CRM/server logs/消费者平台；
- 不读取或存储密码、Cookie、Token、Client Secret、`.env` 或 PII；
- 不写真实 MyyShop、外部资产或生产系统；
- 不定义战略分支和跨宿主候选发布细节，分别见 Spec 0008/0009；
- 不授权 commit、push、PR、deploy 或 release。
