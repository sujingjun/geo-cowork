---
title: Spec 0008 — Strategy Discovery and Cycle Two
status: approved
created: 2026-08-27
updated: 2026-08-28
source:
  - docs/prd/2026-08-27-m6-m8-test-merchant-engineering-closure.md
  - docs/architecture/2026-08-27-m6-m8-test-merchant-engineering-closure-architecture.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/records/2026-08-27-m7-decision-dimension-state-machine-review.md
  - docs/records/2026-08-28-m7-review-candidate-generation-contract-review.md
  - docs/runbooks/geo-cowork-account-data-readiness.md
  - 2026-08-27 Owner 明确批准：批准全部 M6—M8 设计并按推荐方向推进，保留人工 review 和全新上下文 Agent 独立决策门
scope: M7 人工触发战略发现、Decision Dimension、Product Gap 证据门、Cycle 1 到 Cycle 2 候选与人类选择
---

# Spec 0008 — Strategy Discovery and Cycle Two

## 1. 继承、状态与授权

本 Spec 继承 Spec 0003—0007 的公共对象、批准、安全、Gap、答案测试、测试商户、Cycle/Analytics/Review、create-only、Run、index 与 trace 合同。

Owner 已明确批准本 Spec。它只定义测试商户 M7 行为，可据此按已批准 Plan 实现；不授权真实战略研究、产品立项、真实 MyyShop Cycle 2 或外部访问。测试商户离线工程不需要真实业务账号；任何未来真实材料读取仍须按账号与数据准备 Runbook 单次授权。

## 2. 新对象与 ID

| `record_type` | ID 前缀 | 状态 | 职责 |
| --- | --- | --- | --- |
| `strategy_assessment` | `STA-` | `draft/waiting_human/decided/superseded` | 记录显式触发、触发条件检查、输入和人类结论 |
| `decision_dimension` | `DDM-` | `candidate/validated/decision_factor/deprecated` | 保存一个可追溯的比较/推荐判断维度；历史只通过新 ID + `supersedes_ref` 保留，不回写旧对象状态 |
| `cycle_goal_candidate_batch` | `GCB-` | `recorded` | 冻结 Review/CIS、生成规则与有序 Candidate 实例清单 |
| `cycle_goal_candidate` | `GCD-` | `candidate` | 保存从 Cycle 1 Review 确定性生成、字节不可变的 Cycle 2 Goal 候选实例 |
| `cycle_goal_selection` | `GSEL-` | `draft/decided/superseded` | 独立保存对一个候选 batch 的人类选择、拒绝或推迟决定 |
| `strategy_output` | `STO-` | `draft/superseded` | 锁定机会分析、PRD 草案与人工验证计划 artifacts |

本 Spec 复用 Spec 0005 的 `finding.diagnosis_class: product_gap`，不新建第二个 Product Gap 类型。所有测试对象必须带 Spec 0007 注册的顶层 `test_scope`。

## 3. 显式人工触发

### 3.1 Gate 0：人工 invocation

人类 invocation 只允许 Tool 开始 eligibility assessment；它与 assessment 是否符合条件、是否继续研究是两个后续门。缺 invocation 时不能创建 Strategy Run；存在 invocation 也不能自报 eligibility pass 或自动 proceed。

`strategy_assessment` 必需：

```yaml
merchant_ref: TMT-...
cycle_review_ref: CRV-...
cycle_review_version: <semver>
strategy_input_snapshot_version: { ref: CIS-..., version: <semver> } # snapshot_kind:strategy
human_invocation:
  decision_ref: <fixture human decision>
  invoked_by: <human role or stable test identity>
  invoked_at: <RFC3339>
  requested_scope: <non-empty>
eligibility_inputs:
  review_entry_keys: [<strategy CIS 中 reviewed ARV entry key>]
  evidence_entry_keys: [<strategy CIS 中 approved Evidence entry key>]
  finding_entry_keys: [<strategy CIS 中 Finding entry key>]
  product_gap_entry_key: <strategy CIS 中唯一 open Product Gap entry key>
  product_gap_identity:
    object_id: FND-...
    record_type: finding
    object_version: <semver>
    file_sha256: <sha256>
eligibility_checks:
  repeated_dimension:
    state: pass | fail | insufficient
    dimension_key: <由显式 reviewed ARV 字段按规则规范化的稳定 key>
    query_entry_keys: [<strategy CIS Q entry key>]
    review_entry_keys: [<strategy CIS ARV entry key>]
  user_interest_evidence:
    state: pass | fail | insufficient
    evidence_entry_keys: [<strategy CIS EVD entry key>]
  comparison_impact:
    state: pass | fail | insufficient
    evidence_entry_keys: [<strategy CIS EVD entry key>]
    review_entry_keys: [<strategy CIS ARV entry key>]
  content_evidence_fix_insufficient:
    state: pass | fail | insufficient
    finding_entry_keys: [<strategy CIS FND entry key>]
eligibility_result: eligible | ineligible | insufficient
eligibility_rule:
  id: <stable id>
  version: <semver>
  artifact_path: <Run outputs/ 下 create-only path>
  artifact_entry_key: <strategy CIS artifact entry key>
  sha256: <sha256>
decision: proceed | do_not_proceed | needs_evidence | pending
approval: <fixture human decision；decided 时必需>
supersedes_ref: STA-... # decided 时指向 waiting_human Assessment
```

约束：

1. 缺 `human_invocation.decision_ref` 返回 `STRATEGY_HUMAN_TRIGGER_REQUIRED`，不得创建 Run 或 Assessment。
2. Invocation 只批准一次受限 eligibility check，不批准 Dimension、Product Gap、PRD、Claim、Cycle 2 Goal 或发布。
3. Invocation 后先从当前 graph 创建 `snapshot_kind:strategy` CIS，完整复制 eligibility 对象与规则 artifact；Tool 只从 pinned strategy CIS copies 按 create-only `eligibility_rule` 计算四项 state 与 result，plan 不接受调用方自报 `pass`。规则 artifact 只能收紧或具体化以下 Spec 下限，不能弱化。
4. 每个 `eligibility_checks` entry key 都必须是 `eligibility_inputs` 对应集合的子集并在同一 strategy CIS 中解析；`product_gap_entry_key` 解析出的 identity tuple 必须等于 `product_gap_identity`。不得注入未冻结来源或 live ref。
5. `repeated_dimension.dimension_key` 只可从 CIS copy 中 reviewed ARV 的显式结构字段（含 `exploratory.decision_dimension_candidates`）按 versioned 规则做精确规范化/去重生成，不得从回答正文或自由文本语义猜测；字段为空即 insufficient。至少需要两个相关 formal Query 的 reviewed ARV，或两个平台的 reviewed ARV。
6. `user_interest_evidence` 只允许 `evidence:approved`，support kind 必须是 first-party user data、真实社区表达或 independent，Scope 与 requested scope 一致、as-of 适用且非 stale。
7. `comparison_impact` 至少有两个独立 formal Query 或两个不同平台的 reviewed ARV；每个 ARV 必须追溯到 Sample.platform，不接受 platform 字符串自报。
8. `content_evidence_fix_insufficient` 必须引用同一个 approved/open Product Gap，以及与它同 Scope 的 Content/Evidence Finding，证明只修内容或证据仍不足；M7 不创建这些 Finding。
9. Tool 只能创建 `draft`/`waiting_human` 与 `decision:pending`；eligibility 计算完成后，人类另行决定。`decided` 必须使用新 STA ID、`supersedes_ref` 指向 waiting_human Assessment并保留完整 approval；`proceed` 要求 `eligibility_result:eligible` 与四项 `pass`，否则只能 `needs_evidence/do_not_proceed`。
10. 未 invocation、ineligible 或 `do_not_proceed` 不阻塞 `geo-lifecycle` 主线；主线不得自动调用本 Skill。

### 3.2 禁止自动触发的信号

以下任一项不能单独触发战略分支：单条 Query、单次平台答案、低 Answer Rubric、单个竞品陈述、搜索摘要、模型建议、一个 Content/Evidence Gap 或 fixture Analytics 数值。

## 4. Decision Dimension

### 4.1 必需字段

```yaml
merchant_ref: TMT-...
strategy_assessment_version: { ref: STA-..., version: <semver> }
strategy_input_snapshot_version: { ref: CIS-..., version: <semver> }
label: <非空稳定名称>
definition: <该维度判断什么>
query_entry_keys: [<strategy CIS Q entry key>]
review_entry_keys: [<strategy CIS ARV entry key>]
evidence_entry_keys: [<strategy CIS EVD entry key>]
finding_entry_keys: [<strategy CIS FND entry key>]
product_gap_entry_key: <strategy CIS open Product Gap entry key>
product_gap_identity: { object_id: FND-..., record_type: finding, object_version: <semver>, file_sha256: <sha256> }
basis:
  platforms: [<platform>]
  query_clusters: [<stable key>]
  supporting_observations: [<可定位摘要>]
  counter_observations: [<可定位摘要>]
  unresolved_conflicts: [<可定位摘要>]
validation_decision: # candidate 时不得出现；其他状态按 §4.2 精确条件出现
  decided_by: <human>
  decided_at: <RFC3339>
  decision_ref: <fixture human decision>
  verdict: validated | rejected
  reason: <非空>
factor_decision: # 仅 validated 的后继对象按 §4.2 出现
  decided_by: <human>
  decided_at: <RFC3339>
  decision_ref: <fixture human decision>
  verdict: promoted | rejected
  reason: <非空>
deprecation_decision: # 仅 decision_factor → deprecated 时必需
  decided_by: <human>
  decided_at: <RFC3339>
  decision_ref: <fixture human decision>
  verdict: deprecated
  reason: <非空>
supersedes_ref: DDM-... # 状态推进时必需
```

### 4.2 生命周期

```text
candidate
→ validated | deprecated
validated
→ decision_factor | validated | deprecated
decision_factor
→ deprecated
```

- Tool 只创建 `candidate`；此时三个 decision 字段与 `supersedes_ref` 均不得出现，Agent 不自动推进。
- 每次推进都创建新的 DDM ID，并以 `supersedes_ref` 精确指向直接前态；旧对象和旧 decision bytes 不修改、不改成 `superseded`。新对象携带该 lineage 已成立的旧 decision 块，并只增加本次新 decision。相同目标 ID/路径同字节返回 `kept`，不同字节冲突。
- `candidate → validated|deprecated` 只产生 `validation_decision`：`verdict:validated` 映射 `status:validated`，`verdict:rejected` 映射 `status:deprecated`。拒绝结论保留在新的 deprecated 对象中，不另造重复的 deprecation 决定。
- `validated → decision_factor|validated|deprecated` 只新增独立 `factor_decision`：`verdict:promoted` 只映射 `status:decision_factor`；`verdict:rejected` 必须由同一决定选择保留为新的 `status:validated` 或终止为新的 `status:deprecated`，其非空 `reason` 必须说明选择。进入 decision_factor 还要求可观察到该维度影响比较、推荐或排除。`validation_decision` 与 `factor_decision` 的 `decision_ref` 必须不同，不得复用或合并。
- `decision_factor → deprecated` 只新增独立 `deprecation_decision`；它表示对已经成立的决策因素显式退役，不否定或删除先前的 validated/promoted 结论。其 `decision_ref` 必须不同于 validation/factor 决定。
- 禁止 `validated/decision_factor/deprecated → candidate`、deprecated 后继续推进、跳过前态或让 `supersedes_ref` 指向非直接前态。candidate 表示尚未验证，回退会丢失既有人工结论。

每个可达状态的 decision 字段条件固定如下；表外组合均返回错误：

| 当前状态 | 直接前态 | `validation_decision` | `factor_decision` | `deprecation_decision` |
| --- | --- | --- | --- | --- |
| `candidate` | 无 | 不得出现 | 不得出现 | 不得出现 |
| `validated` | `candidate` | 必需，`validated` | 不得出现 | 不得出现 |
| `validated` | `validated` | 必需，沿用 `validated` | 必需，新决定为 `rejected` | 不得出现 |
| `decision_factor` | `validated` | 必需，沿用 `validated` | 必需，新决定为 `promoted` | 不得出现 |
| `deprecated` | `candidate` | 必需，新决定为 `rejected` | 不得出现 | 不得出现 |
| `deprecated` | `validated` | 必需，沿用 `validated` | 必需，新决定为 `rejected` | 不得出现 |
| `deprecated` | `decision_factor` | 必需，沿用 `validated` | 必需，沿用 `promoted` | 必需，新决定为 `deprecated` |

`validated` 表示在明确 Scope/时间窗内有合格 Evidence 支持该维度存在，不表示它已是决策因素。`deprecated` 是当前战略研究中的终态，但旧 lineage 仍可追溯；重新研究必须从新的 candidate ID 开始，不能复活旧对象。

- 状态只在本战略研究中有效，不自动成为品牌 Claim、产品事实或真实市场规律。
- 实质变化创建新 ID；不能原地改写被 Strategy Output 或 Cycle candidate 锁定的 Dimension。

## 5. Product Gap 证据门

M7 只消费已通过 approved Spec 0005 §3.4 profile、`status:open` 且带人类 `approval` 的 Product Gap Finding。M7 不向既有 Finding 增加字段，不要求它反向引用 Strategy Assessment/Dimension，也不得在 M7 自动创建、确认或推进 Product Gap；否则会与当前 M4 Schema 的 unknown-field fail-closed 合同冲突。

`strategy_assessment`、`decision_dimension` 与 `strategy_output` 通过同一 strategy CIS 的 Product Gap/Evidence/Finding entry keys 消费当时的完整 bytes，不持有 M2—M5 live VERSION_FIELDS。它们必须再次检查用户需要、当前能力缺失/不足、supporting/counter Scope 与冲突；单条 Query、平台 Observation、竞品自述或 Content Gap 不能替代任一证据边。若需要改变 Product Gap 合同或 Finding 字段，必须停止 M7、更新 Spec 0005 并重新获得批准。

STA、DDM、STO 必须分别持久化同一 Product Gap identity tuple `{object_id,record_type,object_version,file_sha256}`；任一对象换绑另一 entry/tuple 时 strategy trace 失败。

消费 Product Gap 的下一动作只能进入 Strategy Output/独立产品发现；不能自动创建 Content task、approved PRD、Claim、Roadmap 或 Cycle Goal。

## 6. Strategy Output

必需字段：

```yaml
merchant_ref: TMT-...
strategy_assessment_version: { ref: STA-..., version: <semver> }
strategy_input_snapshot_version: { ref: CIS-..., version: <semver> }
run_ref: RUN-...
decision_dimension_versions: [{ ref: DDM-..., version: <semver> }]
product_gap_entry_key: <strategy CIS open Product Gap entry key>
product_gap_identity: { object_id: FND-..., record_type: finding, object_version: <semver>, file_sha256: <sha256> }
opportunity:
  statement: <非空>
  supporting_evidence_entry_keys: [<strategy CIS EVD entry key>]
  counter_evidence_entry_keys: [<strategy CIS EVD entry key>]
  limitations: [<非空>]
artifacts:
  - role: opportunity_analysis | prd_draft | human_validation_plan
    path: <Run outputs 下 create-only path>
    sha256: <sha256>
    media_type: text/markdown
validation_plan_contract:
  hypothesis: <非空>
  required_evidence: [<非空>]
  method: <非空>
  result_criteria:
    success: <非空>
    fail: <非空>
    inconclusive: <非空>
  owner: <human role>
  stop_conditions: [<非空>]
  real_execution_authorized: false
  auto_approval: false
body_sha256: <gray-matter 去除 Frontmatter 后 UTF-8 原始正文 sha256>
artifact_manifest_fingerprint: <按 role/path/sha256/media_type 排序后的 canonical JSON sha256>
supersedes_ref: STO-... # 实质修订时可选
```

- Tool 只物化 Host 提供的 draft，不自动生成批准；文件标题和正文必须显式写“测试商户战略建议”。
- `opportunity_analysis/prd_draft/human_validation_plan` 三类 artifact 必须各恰好一份，role 不得重复或缺失；validation plan 必须完整覆盖上列合同，且本范围不得把 `real_execution_authorized/auto_approval` 设为 true。
- `run_ref` 必须指向当前 Strategy Run；Run 可按既有状态机 bump，不 exact-pin其 version。所有 artifact 必须位于该 Run 的 `outputs/`、create-only 且 checksum 一致，并由 strategy/review CIS 保存历史 bytes。`body_sha256` 与 `artifact_manifest_fingerprint` 分开计算，不能相互替代。
- PRD 草案不是 `docs/prd/` 中的 approved SDD，不提供自动批准、Task 创建或实现入口。
- Strategy Output 不得修改 Claim、Knowledge Release、Product Gap approval 或 Cycle。

## 7. Cycle 1 → Cycle 2 候选

### 7.1 输入与生成

候选生成只接受 `cycle_review:decided` 且来自 completed Cycle 1。输入为 Review 中 version-pinned 的：

- 高价值新 Query Cluster；
- 最大 Content Gap；
- 最大 Evidence Gap；
- 最稳定严重错误认知；
- 值得继续验证的推荐/排除理由；
- 经明确战略触发后才可加入的 Product Gap/Decision Dimension。

生成器不得读取未在 Review 锁定的聊天、模型记忆或工作区外材料。

每项来源使用 Cycle Review 冻结的结构，按以下规则生成：

1. `candidate_kind` 固定序：`query_cluster=1`、`content_gap=2`、`evidence_gap=3`、`severe_misperception=4`、`recommendation_reason=5`、`product_gap=6`。
2. `source_goal_entry_key/source_entry_keys` 必须来自 Review pin 的 CIS manifest；source entry keys 按 ASCII 排序。
3. 版本化 `generator_rule` 必须作为 create-only artifact 位于当前 Candidate Run 的 `outputs/`，并至少锁定 `kind_order`、排序规则与 `derived_fields`。`rationale` 只能由规则中的固定模板对 `candidate_kind` 做字面替换，`limitations` 只能逐字复制规则中的固定非空数组；规则不得读取 plan 自报候选、聊天历史、模型记忆或工作区外材料。规则 ID/version/path/checksum 任一变化都生成新 batch。
4. `candidate_content_key = sha256(canonical JSON({candidate_kind, review_input_snapshot_version, source_goal_entry_key, source_entry_keys, proposed_goal, rationale, limitations, evidence_gaps, risks, strategy_gate_versions}))`。
5. 初排固定为 `rank_inputs.priority` 升序、kind 固定序升序、content key ASCII 升序；Tool 生成 `rank_inputs.kind_order/tie_break_key` 并赋 rank，CRV 不得预填 tie-break。
6. `batch_key = sha256(canonical JSON({review_ref,review_version,review_file_sha256,review_input_snapshot_version,review_snapshot_fingerprint,generator_rule,ordered_ranked_descriptors}))`，其中 descriptor 为 `{candidate_content_key,rank_inputs,rank}` 完整对象。priority/rank inputs 即使未改变顺序，只要变化也产生新 batch。
7. `candidate_instance_key = sha256(canonical JSON({batch_key,candidate_content_key,rank_inputs,rank}))`。GCB ID 为 `GCB-` 加 batch key 前 24 位大写十六进制；GCD ID 为 `GCD-` 加 candidate instance key 前 24 位大写十六进制。
8. Selection 保持同一 batch，但 draft/decided 使用不同 `decision_key = sha256(canonical JSON({batch_key,phase,selected,rejected,deferred,reason,approval}))`；draft 的 phase 固定 `draft`、selected 为 null、数组为空、reason/approval 为 null，decided 覆盖完整分区、reason 与 approval 的 approver/time/decision ref。Selection ID 为 `GSEL-` 加 decision key 前 24 位大写十六进制。

所有 ID 碰撞但 bytes 不同必须 fail closed；不引入统一 GEO 分或隐藏模型分数。

相同输入与规则版本必须生成相同 batch/content/instance/decision keys、ID、bytes 和 order。

### 7.2 Cycle Goal Candidate Batch

```yaml
merchant_ref: TMT-...
source_cycle_review_version: { ref: CRV-..., version: <semver>, file_sha256: <sha256> }
review_input_snapshot_version: { ref: CIS-..., version: <semver>, fingerprint: <sha256> }
generator_rule:
  id: <stable id>
  version: <semver>
  artifact_path: <Run outputs/ 下 create-only path>
  sha256: <sha256>
batch_key: <sha256>
ordered_candidates:
  - candidate_content_key: <sha256>
    rank_inputs: { priority: <int>, kind_order: <int>, tie_break_key: <content key> }
    rank: <positive integer>
    candidate_instance_key: <sha256>
    candidate_version: { ref: GCD-..., version: <semver> }
run_ref: RUN-...
```

- GCB `recorded` 后不可修改或 supersede；Review/CIS/rule/ordered ranked descriptors 任一变化生成新 batch/新 GCB ID。
- GCB 与 GCD 相互 exact-ref，materialization plan 必须先预分配所有 ID/预生成 bytes，在内存校验完整双向闭包后 create-only 写入；中断只能按相同 plan/checksum 补齐。

### 7.3 Cycle Goal Candidate

```yaml
merchant_ref: TMT-...
candidate_batch_version: { ref: GCB-..., version: <semver> }
source_cycle_review_version: { ref: CRV-..., version: <semver>, file_sha256: <sha256> }
review_input_snapshot_version: { ref: CIS-..., version: <semver>, fingerprint: <sha256> }
candidate_content_key: <sha256>
candidate_instance_key: <sha256>
candidate_kind: query_cluster | content_gap | evidence_gap |
  severe_misperception | recommendation_reason | product_gap
source_goal_entry_key: <review CIS 中 GOAL entry key>
source_entry_keys: [<review CIS entry key>]
proposed_goal:
  statement: <非空>
  success_question: <非空>
  query_cluster_key: <非空>
rationale: <非空>
limitations: [<非空>]
evidence_gaps: [<字符串>]
risks: [<字符串>]
rank_inputs:
  priority: <non-negative integer>
  kind_order: <1..6，必须与 §7.1 映射一致>
  tie_break_key: <必须等于 candidate_content_key>
rank: <positive integer>
strategy_gate_versions: # product_gap 时必需；其他 kind 不得出现
  strategy_input_snapshot_version: { ref: CIS-..., version: <semver> }
  review_product_gap_entry_key: <review CIS 中唯一 Product Gap FND entry key>
  strategy_product_gap_entry_key: <strategy CIS 中唯一 open Product Gap FND entry key>
  product_gap_identity: { object_id: FND-..., record_type: finding, object_version: <semver>, file_sha256: <sha256> }
  strategy_assessment_version: { ref: STA-..., version: <semver> }
  decision_dimension_versions: [{ ref: DDM-..., version: <semver> }] # 至少一个 decision_factor
  strategy_output_version: { ref: STO-..., version: <semver> }
```

- Candidate bytes create-only；候选对象不含 selection、approval 或状态推进字段。
- `source_goal_entry_key/source_entry_keys` 必须等于 CRV next-cycle input 且可在 pinned review CIS 中复验类型、version/checksum 与 Goal 归属；它们不作为 live graph refs，跨 Goal 候选失败。
- `product_gap` Candidate 的 `source_entry_keys` 中必须恰好有一个 review CIS Product Gap FND，且等于 `review_product_gap_entry_key`。validator 对 review/strategy 两个 Gap entry 比较 `{object_id,record_type,object_version,file_sha256}`，必须完全等于 `product_gap_identity`；snapshot path 可以不同。
- STA 必须 `decided/proceed`，至少一个 DDM 必须 `status:decision_factor` 且 `factor_decision.verdict:promoted`，STO 必须为对应 draft；STA/DDM/STO 各自的 `product_gap_identity` 和 entry key 必须绑定同一 tuple。仅 `validated` 的 DDM 或 Review FND-A/Strategy FND-B 换绑都失败。其他 candidate kind 不要求 strategy。
- Product Gap 发生 version/bytes 变化时，必须先创建新的 decided CRV/review CIS，再创建新的 strategy CIS/STA/DDM/STO/GCB/GCD；不得把旧 Review Candidate 换绑到新 Gap。
- Review/CIS/source entries、Goal 文本、rationale/limitations/gaps/risks、strategy gates、batch/rank/rank inputs 或规则变化必须生成新 GCB/GCD ID，不修改旧 Candidate。

### 7.4 Cycle Goal Selection

```yaml
merchant_ref: TMT-...
source_cycle_review_version: { ref: CRV-..., version: <semver>, file_sha256: <sha256> }
candidate_batch_version: { ref: GCB-..., version: <semver> }
batch_key: <sha256>
decision_key: <sha256>
candidate_versions: [{ ref: GCD-..., version: <semver> }]
decision:
  selected_candidate_version: { ref: GCD-..., version: <semver> } | null
  rejected_candidate_versions: [{ ref: GCD-..., version: <semver> }]
  deferred_candidate_versions: [{ ref: GCD-..., version: <semver> }]
  reason: <draft 可空，decided 时非空>
approval: <decided 时必需的 fixture human decision>
supersedes_ref: GSEL-... # decided 或实质修订时指向旧 draft/decision
```

- Tool 只创建 `draft`，不得自选 Candidate；draft 时 `approval/supersedes_ref` 均不得出现。
- `decided` 必须使用新的 GSEL ID、`supersedes_ref` 指向旧 draft；selected/rejected/deferred 必须对同一 GCB 的 `candidate_versions` 做精确、唯一、互斥、无遗漏分区；rejected/deferred 按 Candidate ID ASCII 排序，最多一个 selected。
- 没有 selected 时 Cycle 2 不启动；人类可以全部拒绝或推迟。
- fixture human decision 只对测试商户有效；不得复制成真实 MyyShop Cycle 2 决定。
- Candidate 与 Selection 是不同对象；人类决定不覆盖 Candidate bytes，也不使用同一 GCD ID 的第二 revision。
- 本版 GSEL 只允许选择一个新的焦点 Goal；它不删除 Cycle 中其他既有 Goal tracks。未来一次选择多个新 Goal 必须另立 Spec，不把数组语义塞入本合同。
- 选择后按 Spec 0003/0004 的 stable ID + 新 version 语义准备 Cycle 2 输入，并在 Cycle 2 freeze 时创建新 CIS；Selection approval 不自动批准 Goal，Goal 仍按 Spec 0004 单独取得 fixture approval。

### 7.5 Cycle 2 绑定

Cycle 2 必须：

- `cycle_number:2`；
- `predecessor_review_version` 精确指向 Cycle 1 decided Review 的 ref/version；
- `goal_selection_version` 精确指向 `cycle_goal_selection:decided` 的 ref/version，且其中唯一 selected Candidate 来自同一 predecessor Review/batch；
- frozen Goal 内容与 Candidate proposed goal 一致，并有独立 fixture approval；
- 按既有 stable ID/version 语义准备 Cycle 2 的 Goal/Query Set/KR/Asset/Profile，并创建新的 freeze CIS；不要求为源对象改 stable ID；
- 完整运行 Spec 0007 的阶段链。

缺 predecessor、selected decision、Goal approval 或版本一致性返回 error；不能用直接创建 Cycle 2 文件绕过。

## 8. refs、indexes 与 trace

index registry 增加：

- `strategy-assessments.json`
- `decision-dimensions.json`
- `cycle-goal-candidate-batches.json`
- `cycle-goal-candidates.json`
- `cycle-goal-selections.json`
- `strategy-outputs.json`

Strategy Assessment/DDM/STO 对 CRV/CIS/STA/DDM，以及 GCB/GCD/GSEL 对 CRV/CIS/batch/candidate 与 strategy gate 新对象的 exact versions 必须加入 VERSION_FIELDS/index。GCB/STO `run_ref` 是 direct ref，不 exact-pin可 bump Run。所有 Q/ARV/EVD/FND/Product Gap 等 M2—M5 输入只使用 strategy/review CIS entry keys并从 snapshot copies 解析，不成为 live refs。各 `supersedes_ref` 为同类型 direct ref；缺边、类型错误或新对象 version mismatch 在写入前失败。

`trace --strategy <STA-ID>` 返回：human invocation → strategy CIS copies/eligibility checks → human proceed decision → Decision Dimension 的完整 `supersedes_ref` lineage 与 validation/factor/deprecation decisions（包括 rejected/deprecated 负结论）→ CIS 中已批准 M4 Product Gap（如有）→ Strategy Output。

`trace --cycle-two <CYC-ID>` 返回：Cycle 1 → decided CRV/review CIS → GCB → GCD（Product Gap 时含 STA/DDM/STO gates）→ decided GSEL → selected Candidate → Cycle 2 freeze CIS → 完整 M6 链。缺边返回 `TRACE_INCOMPLETE`；战略分支未触发返回 `not_applicable`，不能作为错误或主线缺口。

## 9. Run、并发与恢复

- Strategy Run 的 input fingerprint 覆盖 human invocation、Cycle Review、Evidence/Review/Finding/Dimension 精确版本、eligibility/candidate 规则版本和 test merchant identity。
- 同一 `merchant + review + requested_scope` 只有一个有效 lease；并发候选生成必须收敛到相同 bytes。
- GCB 与所有 GCD 先在内存全量预检双向闭包，再 create-only 写入；中断后按冻结 materialization plan/checksum 补齐。
- human decision 只写独立 GSEL 对象，不覆盖 Candidate bytes；Selection 修订使用新 ID/supersedes，保持当前 graph 一个 stable ID 当前 revision的限制。
- 关键输入变化 supersede 旧 Assessment/Output；Candidate 侧创建全新 GCB/GCD，旧 batch 永久保留且不改状态；旧决定保留审计，不自动迁移。

## 10. CLI 预期行为

```text
geo-strategy-discovery.mjs assess --workspace <path> --plan <json>
geo-strategy-discovery.mjs propose-dimensions --workspace <path> --plan <json>
geo-strategy-discovery.mjs assemble-output --workspace <path> --plan <json>
geo-lifecycle.mjs propose-cycle-two --workspace <path> --review <CRV-ID> --plan <json>
geo-lifecycle.mjs apply-goal-selection --workspace <path> --plan <json>
geo-strategy-discovery.mjs trace --workspace <path> --assessment <STA-ID>
```

本节只冻结未来接口。所有命令拒绝真实 MyyShop 输出根、自动 approval、自动 selected、网络访问和外部写入。

## 11. 错误与 warning

错误至少包括：

```text
STRATEGY_HUMAN_TRIGGER_REQUIRED
STRATEGY_TRIGGER_SCOPE_MISMATCH
STRATEGY_TRIGGER_CHECK_INCOMPLETE
STRATEGY_AUTO_TRIGGER_FORBIDDEN
STRATEGY_ELIGIBILITY_SELF_REPORT_FORBIDDEN
DECISION_DIMENSION_EVIDENCE_INSUFFICIENT
DECISION_DIMENSION_APPROVAL_REQUIRED
DECISION_DIMENSION_TRANSITION_INVALID
DECISION_DIMENSION_DECISION_MISMATCH
PRODUCT_GAP_SUPPORT_MISSING
PRODUCT_GAP_HUMAN_REVIEW_REQUIRED
PRODUCT_GAP_NOT_M4_OPEN
STRATEGY_OUTPUT_CONFLICT
CYCLE_ONE_REVIEW_REQUIRED
GOAL_CANDIDATE_INPUT_DRIFT
GOAL_CANDIDATE_BATCH_CONFLICT
GOAL_CANDIDATE_BATCH_INCOMPLETE
GOAL_CANDIDATE_CROSS_GOAL
GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED
GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH
GOAL_SELECTION_REQUIRED
MULTIPLE_GOAL_SELECTIONS
GOAL_SELECTION_APPROVAL_REQUIRED
GOAL_SELECTION_PARTITION_INVALID
CYCLE_TWO_PREDECESSOR_MISMATCH
SYNTHETIC_REAL_REF_CONTAMINATION
TRACE_INCOMPLETE
```

`DECISION_DIMENSION_TRANSITION_INVALID` 用于非法前态、跳态、terminal 继续或 `supersedes_ref` 非直接前态；`DECISION_DIMENSION_DECISION_MISMATCH` 用于 decision 字段缺失、多余、verdict/status 不匹配、已成立 decision 被改写或 decision ref 非法复用。缺少必需的人类决定继续返回 `DECISION_DIMENSION_APPROVAL_REQUIRED`。

warning 至少包括：

```text
STRATEGY_NOT_TRIGGERED
STRATEGY_NEEDS_EVIDENCE
DECISION_DIMENSION_CONFLICT_OPEN
PRODUCT_GAP_WAITING_HUMAN
GOAL_SELECTION_DEFERRED
FIXTURE_HUMAN_DECISION_USED
REAL_CYCLE_TWO_GATE_OPEN
```

## 12. 测试与验收范围

必须先以失败测试覆盖：

- 新类型/状态/字段、refs/version/index/trace、unknown field 和 create-only；
- strategy CIS 完整 bytes copy/entry keys、M2—M5 live object 后续 bump 不使历史 STA/DDM/STO/GCD 失效、跨 snapshot entry 失败；
- 无 human trigger、trigger scope 漂移、四项检查缺失与自动触发；
- Decision Dimension 每个可达状态/直接前态/decision 字段组合的正反例；`validated → candidate`、terminal 继续、跳态与非直接 `supersedes_ref` 必须失败；
- validation rejected、factor rejected 后保留 validated、factor rejected 后 deprecated、decision_factor 显式 deprecated 的负结论均须保留在新 ID/trace 中，旧 DDM bytes 不变；缺失、多余、verdict/status 不匹配或复用 decision ref 必须失败；
- Product Gap 的用户需要 + 当前能力双 Evidence 门，单 Query/单答案/竞品陈述负例；
- strategy 未调用时 M6 主线完整运行；
- Strategy Output artifact checksum、PRD 草案不升级 approved SDD/Claim；
- Cycle 1 Review/CIS → GCB/GCD 的 content/batch/instance key、排序、双向闭包、重复调用、并发、半成品恢复；
- Product Gap Candidate 缺 decided/proceed STA、validated/factor DDM、STO 或同一 open Gap exact version 的负例；普通 candidate 不要求 strategy；
- Review source 为 FND-A、strategy gate 偷换 FND-B 的 object/version/file-sha mismatch 必须返回 `GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH`；Gap 升版必须重建 CRV/review CIS/strategy/GCB 全链；
- 未选择、多选、自动选择、选择来源漂移、缺 Goal 独立 approval；
- Cycle 2 未引用 Cycle 1 Review、原地修改 Cycle 1 pins、真实/模拟污染；
- path/symlink/secret、stale lease、resume/supersede 与 M2—M6 回归。

通过测试只证明 test-only 战略与第二周期合同，不证明真实用户需要、真实 Product Gap、产品投资决定或真实 MyyShop Cycle 2。

## 13. 非目标

- 不主动研究真实竞品、社区、用户或平台；
- 不创建真实产品 PRD、预算、Roadmap、Claim 或发布；
- 不要求真实账号、OAuth 或数据连接；
- 不替代事实 Owner、产品负责人或业务批准；
- 不授权 commit、push、PR、deploy 或 release。
