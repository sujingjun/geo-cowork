---
title: Spec 0005 — Diagnosis, Site & Asset Proposal
status: approved
created: 2026-08-24
source:
  - docs/prd/2026-08-24-m4-diagnosis-site-asset-proposal.md
  - docs/architecture/2026-08-24-diagnosis-site-asset-proposal-architecture.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - "2026-08-24 当前用户指令：批准 M4 六份 SDD 进入实现；真实 MyyShop 采集仍不授权"
scope: M4 Finding/Asset profile、站点与研究 manifest、Gap、Asset Proposal、Adoption、Publication 与 Technical Retest
---

# Spec 0005 — Diagnosis, Site & Asset Proposal

## 1. 继承与触发范围

所有 M4 对象继承 Spec 0003 的公共字段、安全、stable ID、refs、checksum、index、Run 与 create-only 规则，以及 Spec 0004 的 Goal/Query Set/Knowledge Release/Claim/Evidence/approval 规则。

本 Spec 适用于 `geo-diagnosis-cycle`、`geo-site`、`geo-reputation`、`geo-competitor`、`geo-content`、`diagnosis.mjs`、M4 Schema/profile、合成 Fixture 和后续经授权的真实 M4 Run。

M4 profile 只在 M4 命令与 M4 对象上强制扩展字段，不反向要求合法的 M2/M3 历史对象携带 M4 字段。

## 2. 类型注册与状态

M4 新增三类对象：

| `record_type` | ID 前缀 | 状态 |
| --- | --- | --- |
| `asset_proposal` | `PRP-` | `draft/superseded` |
| `adoption_record` | `ADR-` | `draft/decided/superseded` |
| `asset_publication` | `PUB-` | `draft/confirmed/withdrawn/superseded` |

M4 同时扩展 Finding、Asset、Evidence Plan 与 Run；不改变已有 ID 前缀和历史状态。

## 3. M4 Finding Profile

### 3.1 必需结构

M4 创建的 Finding 除 Spec 0003 字段外必须包含：

```yaml
diagnosis_class: technical | content_gap | evidence_gap | product_gap
query_refs: [Q-...]
claim_refs: [CLM-...]
evidence_refs: [EVD-...]
asset_refs: [AST-...]
source_refs: [SRC-...] # 可为空；研究 Finding 应填写
approval:               # 人类确认/驳回语义 Gap 时必需
  approved_by: <human>
  approved_at: <RFC3339>
  decision_ref: <decision>
gap_basis:             # technical 时不得出现
  supporting_evidence_refs: [EVD-...]
  counter_evidence_refs: [EVD-...]
  unresolved_conflicts: [<non-empty string>]
  rationale: <non-empty string>
retest_of_ref: FND-... # 仅 Technical Retest 使用
```

约束：

- `query_refs/claim_refs/evidence_refs/asset_refs` 均至少一项且可解析；blocked/unverifiable 的 Evidence 可以是访问阻断或 collector error snapshot，但其 Scope 只能证明失败事实。
- `supporting_evidence_refs` 与 `counter_evidence_refs` 都必须包含在顶层 `evidence_refs` 中；两者不得重叠。
- Tool 创建的 `technical` Finding：`finding_kind: technical`，`item_state` 只能为 `observed/blocked/unverifiable`，初始 `status: open`；detector 通过只进入 Run summary，不创建“成功 Finding”。
- Tool 创建的三类 Gap：`finding_kind: semantic`，`item_state` 只能为 `inferred/blocked/unverifiable`，初始 `status: waiting_human`；不得标为 `observed`。
- M4 Schema 为 Finding 注册可选 `approval`；人类确认语义 Gap 时写 `status: open` 与 `approval`，驳回写 `status: dismissed` 与 `approval`。Agent/Tool 不执行该转换。
- Technical Retest 新建 Finding；`retest_of_ref` 必须指向同一 Asset、同一 `finding_code` 的旧 Finding。旧 Finding 不覆盖。

### 3.2 Content Gap

`content_gap` 必须同时满足：

1. 引用的 Claim 为 approved/published 且版本属于输入 Knowledge Release；
2. 当前表达所需 Claim 的 `evidence_sufficiency.status: sufficient`，且所引 Evidence 在 Scope/时效上适用；
3. Asset Evidence 直接证明缺失、不清晰或不一致；
4. 反证与未解决冲突已经显式列出。

任一 Claim 为 `insufficient/unknown` 时返回 `CONTENT_GAP_EVIDENCE_INSUFFICIENT`，不得把它归为 Content Gap；可以提出 Evidence Gap 或保持无法判断。

### 3.3 Evidence Gap

`evidence_gap` 必须引用已存在 Claim，并至少满足一项：

- Claim `evidence_sufficiency.status` 为 `insufficient/unknown`；
- 当前表达需要的 Evidence 类别缺失、stale 或 Scope 不适用；
- 已有 Evidence 之间存在未解决冲突。

存在的 M3 Evidence Plan 应复用并关联；新 M4 Evidence Plan 必须列出 Finding、目标 Asset、最低验收、提供人、验收方法和复测 Query。Evidence Gap 不自动创建或采集 Evidence。

### 3.4 Product Gap

`product_gap` 必须同时引用：

- 用户需求、真实社区表达或独立第三方的 supporting Evidence；
- MyyShop 当前能力缺失或不足的第一方/经批准 Evidence；
- 对应 Query、Claim 和目标 Asset。

单条 Query、单次生成式平台回答、竞争对手自述、搜索摘要或内容未写清不能单独成立 Product Gap。Tool 只创建 `waiting_human` 提案；确认后下一动作只能是 M7 战略发现，不自动创建内容任务或产品 PRD。

## 4. Asset Profile

M4 使用的 Asset 除 Spec 0003 字段外必须包含：

```yaml
asset_role: about | homepage | faq | organization_schema | llms | answer_card | official_social | partner | media | community | other
control_scope: own | official_external | partner | media | community | user
goal_refs: [GOAL-...]
query_refs: [Q-...]
claim_versions:
  - { ref: CLM-..., version: 1.0.0 }
knowledge_release_versions:
  - { ref: KR-..., version: 1.0.0 }
```

- `asset_kind: own` 只能搭配 `control_scope: own`；其他控制范围使用 `asset_kind: external`。
- Goal 必须 approved/active，Query 必须 formal，Claim 与 Knowledge Release 版本必须精确匹配。
- Asset registry 只描述目标载体，不表示已有 Proposal、已采用或已发布。

## 5. Evidence Plan 与 Run 扩展

### 5.1 Evidence Plan

M4 新建或升级的 Evidence Plan 增加：

```yaml
finding_refs: [FND-...]
asset_refs: [AST-...]
deployment_targets: [<asset section or locator>]
```

既有 M3 Plan 可以作为输入而不补字段；只有声称覆盖 M4 Gap/Asset 的 Plan 才进入 M4 profile。

### 5.2 Run

M4 Run 增加：

```yaml
goal_refs: [GOAL-...]
query_set_versions: [{ ref: QS-..., version: 1.0.0 }]
knowledge_release_versions: [{ ref: KR-..., version: 1.0.0 }]
publication_refs: [PUB-...] # Technical Retest 必需
retest_of_refs: [FND-...]   # Technical Retest 必需
development_fixture: false
manifest_fingerprint: <64 lowercase hex> # Site/Research Run 必需
detector_results:                      # Site/Technical Retest Run 必需
  - code: HTTP_STATUS
    state: pass | fail | blocked | unverifiable
    rule_version: <detector version>
    message: <deterministic summary>
```

- 非 Fixture Run 的 Goal/Set/KR 必须满足 M3 lifecycle ready。
- `development_fixture:true` 只允许 `.invalid` locator 或 Workspace 内本地 snapshot；不得引用 MyyShop 真实 URL、账号或业务数据。
- `completed` 只表示 Tool 步骤完成；`business_result` 独立，不能表示发布或 GEO 效果。
- manifest 指纹覆盖目标、collector、状态、snapshot metadata、HTTP/期望与研究 observation；Site 的九项 pass/fail/blocked/unverifiable 必须持久写入 Run summary，不能只存在于 stdout。

## 6. Asset Proposal

### 6.1 必需字段

```yaml
id: PRP-...
record_type: asset_proposal
status: draft
asset_ref: AST-...
goal_refs: [GOAL-...]
query_refs: [Q-...]
finding_refs: [FND-...]
knowledge_release_versions: [{ ref: KR-..., version: 1.0.0 }]
claim_versions: [{ ref: CLM-..., version: 1.0.0 }]
evidence_refs: [EVD-...]
body_sha256: <64 lowercase hex>
recommendation_items:
  - item_id: REC-...
    section: <body heading/anchor>
    action: <non-empty string>
    claim_refs: [CLM-...]
    evidence_refs: [EVD-...]
    finding_refs: [FND-...]
    risk:
      level: low | medium | high | critical
      type: none | unapproved_claim | evidence_insufficient | stale_evidence | scope_limit | conflict
      reason: <non-empty string>
      suggested_weakening: <non-empty string>
```

### 6.2 完整性与唯一性

- Markdown body 是完整建议稿；`body_sha256` 计算 gray-matter 去除 Frontmatter 后的 UTF-8 原始 body，不做语义归一化。
- 每个 recommendation item 的 section 必须在 body 中存在；item ID 在 Proposal 内唯一。
- 所有 item refs 必须是 Proposal 顶层 refs 的子集。
- Claim 未批准、Evidence 不足/stale/冲突时，相关 item 的 `risk.type` 不得为 `none`，并必须提供弱化表达。
- 同一 `asset_ref + goal/query/KR/claim 精确版本集合` 只能有一份非 superseded Proposal。相同输入/字节返回 `kept`；不同内容返回 `DUPLICATE_ASSET_PROPOSAL` 或 `PROPOSAL_CONFLICT`。
- 多 Goal 输入必须落到一份 Proposal；Tool 只按显式 plan 合并和排序，不解决文本或事实冲突。

Tool 只物化 Host 提供的 body 与 items，不自动调用模型，也不把 Proposal 标记为采用或发布。

## 7. Adoption Record

必需字段：`proposal_ref`、`asset_ref`、`decisions`。每个 Proposal item 必须恰好出现一次：

```yaml
decisions:
  - item_id: REC-...
    decision: pending | accepted | modified | rejected
    reason: <non-empty string>
    modified_text: <string, modified 时必需>
approval: <human approval> # decided 时必需
```

- `draft` 只能包含 `pending`，且 Tool 只允许创建这种模板。
- `decided` 不得包含 `pending`，必须有 approval；`modified` 必须有非空 `modified_text`。
- Agent/Tool 尝试创建 `accepted/modified/rejected` 或 `decided` 返回 `AUTO_ADOPTION_FORBIDDEN`。
- Adoption 决定不修改 Proposal，不表示内容已发布。

## 8. Asset Publication

`confirmed` Publication 必须包含：

```yaml
proposal_ref: PRP-...
adoption_ref: ADR-...
asset_ref: AST-...
published_item_ids: [REC-...]
published_locator: <non-empty string>
content_sha256: <64 lowercase hex>
published_at: <RFC3339>
approval: <human approval>
```

- Adoption 必须 `decided`，published items 只能来自 `accepted/modified`；rejected item 不得出现。
- Tool 只允许创建 `draft` 空模板；Agent/Tool 创建 `confirmed/withdrawn` 返回 `AUTO_PUBLICATION_FORBIDDEN`。
- Publication 是人类对实际外部动作的证明，不是发布执行器，也不证明 URL 当前可访问。

## 9. Site Collection Manifest

### 9.1 输入

`site-audit` 只读取显式 JSON manifest：

```text
schema_version
target: asset_ref + locator
goal/query/claim/KR exact refs
captured_at
collector: name + version + mode
collection_state: captured | blocked | unverifiable
snapshots[]: role + workspace-relative path + sha256 + media_type
http: status + selected headers（可选）
```

Snapshot role 至少覆盖适用的 `response/html/robots/sitemap/collector_log`。manifest 不携带 secret、cookie、Authorization 或完整环境变量；header allowlist 只允许检测所需字段。

`captured` 必须有 response 或 html snapshot；`blocked/unverifiable` 必须有响应页或脱敏 collector log snapshot。无 checksum Evidence 时返回 `SNAPSHOT_REQUIRED`，不得创建 M4 Finding。

### 9.2 Detector

规则版本固定在输出中，至少覆盖：

| 检测 | 仅可声明 |
| --- | --- |
| HTTP | manifest 记录的状态是否满足该 Asset 的显式期望 |
| canonical | 标签是否存在、URL 语法是否有效、是否与显式目标一致 |
| robots | snapshot 是否可解析、目标路径是否被声明规则阻断 |
| sitemap | snapshot 是否可解析、目标 URL 是否在显式检查范围内 |
| Schema | JSON/JSON-LD 语法是否可解析；不自动验证业务事实正确 |
| title/meta/heading | 对应元素是否存在且非空；不自动判断营销质量 |
| crawlability | 仅汇总 HTTP/robots/noindex/canonical 的确定性条件；不宣称特定生成式平台必然抓取 |

检测通过只写 Run summary；失败/blocked/unverifiable 创建 Finding。相同 manifest、plan 和规则版本必须产生相同语义输出。

## 10. Research Manifest

每个 Source observation 分别包含：

```text
source_ref
access_state: accessible | blocked | unverifiable
original_content_state: captured | missing | not_applicable
snapshot / collector-log path + sha256
support_kind: first_party | user | independent | competitor | platform_observation
independent_support_refs
counter_evidence_refs
confidence: high | medium | low | unknown
confidence_reason
```

- `accessible + captured` 才能把原文作为 Evidence；blocked page/log Evidence 只能证明访问失败。
- 原文缺失、score/comments 不可见、登录、403、challenge、timeout 各自保留，不合并成 verified Evidence。
- confidence 不改变 Evidence 类别或 approval，不替代独立支持。
- `platform_observation` 不能单独支持 Product Gap、竞争优势或推荐理由。

## 11. CLI 与行为

```text
diagnosis.mjs validate --workspace <path>
diagnosis.mjs site-audit --workspace <path> --manifest <json> --plan <json>
diagnosis.mjs research-ingest --workspace <path> --manifest <json> --plan <json>
diagnosis.mjs propose-assets --workspace <path> --plan <json>
diagnosis.mjs prepare-adoption --workspace <path> --proposal <PRP-ID> --id <ADR-ID> --path <relative>
diagnosis.mjs trace --workspace <path> --proposal <PRP-ID>
diagnosis.mjs technical-retest --workspace <path> --manifest <json> --plan <json>
```

- `plan` 必须显式提供所有稳定 ID、目标路径、refs、版本和建议正文；命令不自动批准对象。
- 全部 Schema/ref/version/checksum/duplicate/path/目标冲突在写入前预检。
- 可预见冲突前不得留下半成品；意外 I/O 不是跨文件事务，重试以相同字节 `kept` 收敛并由 Run completed steps 记录恢复。
- stdout 输出结构化摘要、IDs、warnings 和 diagnostics；不输出 snapshot 正文、secret 或完整外部响应。

## 12. Technical Retest

- 非 Fixture Retest 必须引用 `asset_publication:confirmed`、旧 Finding refs 和新 manifest；缺失返回 `PUBLICATION_REQUIRED`。
- Fixture Retest 允许 `development_fixture:true`，但 Asset locator 必须 `.invalid` 或 Workspace-local。
- 每个旧 Finding 创建一个新的 retest Finding：问题仍存在则 `status: open`；确定性检查通过则 `status: resolved`；两者均 `item_state: observed` 并引用新 Evidence。
- 新 Finding 的 `retest_of_ref` 指向旧 Finding；旧对象和旧 Run 不修改。
- Retest 只判断技术规则，不判断 M5 平台回答、流量、注册、品牌认知或因果效果。

## 13. refs、indexes 与 trace

index registry 新增：

- `asset-proposals.json`
- `adoption-records.json`
- `asset-publications.json`

Finding/Asset/Evidence Plan/Run 的 M4 新 refs 进入 index；所有 version fields 做精确版本校验。

`trace --proposal` 至少返回：Goal → Query Set/Query → Knowledge Release → Claim → Evidence/Source → Finding → Asset → Proposal → Adoption → Publication → Retest Run/Finding。缺边返回 `TRACE_INCOMPLETE`；关系完整但 adoption/publication/retest 未发生时，分别返回明确 gate，不伪装为已完成。

## 14. 状态、批准与授权

1. M4 Tool 可创建技术 Finding、等待人工的 Gap、draft Proposal、draft Adoption template、draft Publication template 和 Run。
2. Gap 确认、Adoption 决定、Publication confirmed/withdrawn 必须由人类写入 approval。
3. 真实采集授权不是对象 approval 的推论，必须由当前任务明确列出目标和范围。
4. 外部写入、发布、部署、commit、push、PR 继续需要当次明确授权。

## 15. 幂等、并发与恢复

- 稳定 ID 与目标路径 create-only；相同字节 `kept`，不同字节 `OBJECT_CONFLICT`。
- 同一 Proposal 唯一键的并发创建只有一个成功；失败者读取实际对象并在同字节时返回 `kept`。
- index 并发构建保持原子完整 JSON 和最终字节一致。
- 新 Run 创建后旧 Run 未 supersede 的中断，重复调用必须收敛到一条 old/new 关系。
- Technical Retest 中断不回写旧 Finding；重复运行通过固定 new IDs 收敛。

## 16. 错误与 warning

至少包括：

```text
M4_FIELD_REQUIRED
INPUT_NOT_M4_READY
COLLECTION_MANIFEST_INVALID
SNAPSHOT_REQUIRED
CHECKSUM_MISMATCH
EVIDENCE_SCOPE_MISMATCH
GAP_CLASSIFICATION_INVALID
GAP_REQUIRES_HUMAN
CONTENT_GAP_EVIDENCE_INSUFFICIENT
PRODUCT_GAP_SUPPORT_MISSING
DUPLICATE_ASSET_PROPOSAL
PROPOSAL_CONFLICT
AUTO_ADOPTION_FORBIDDEN
AUTO_PUBLICATION_FORBIDDEN
PUBLICATION_REQUIRED
RETEST_INPUT_DRIFT
TRACE_INCOMPLETE
OBJECT_CONFLICT
```

warning 至少包括 `SOURCE_BLOCKED`、`ORIGINAL_CONTENT_MISSING`、`INDEPENDENT_SUPPORT_MISSING`、`LOW_CONFIDENCE`、`M2_M3_OBSERVATION_RECORDED`。沿用 Spec 0003 通用退出码。

## 17. 测试与验收范围

必须覆盖：

- M4 Schema 正常、非法、空集合、未知字段、refs/type/version/path/checksum；
- observed/inferred/blocked/unverifiable 与 Evidence Scope；
- 三类 Gap 正例、反例、反证、冲突和人工门；
- 九类 site detector 的 pass/fail/blocked/unverifiable；
- 研究 Source access/original/support/confidence 分离；
- Proposal body hash、risk、single Asset merge、duplicate/conflict/no-partial；
- Adoption/Publication 自动决定拒绝与人类证明；
- Retest publication 前置、resolved/persistent、旧对象不变；
- 幂等、并发、意外 I/O 重试与 Run supersede；
- M0—M3、plugin、Workspace/index、legacy 120 回归。

## 18. M2/M3 观察与非目标

M4 实施发现的 M2/M3 不合理项只写 M4 Record；除非直接阻塞本 Spec 且另获决定，不在 M4 批量修改。M4 完成后必须创建 M2–M4 整体优化 Handoff。

本 Spec 不授权真实 MyyShop 采集、外部写入、自动发布、M5 平台采样、M6 Analytics/业务观察、M7 战略执行或整体重构。Owner 已于 2026-08-24 批准本 Spec 进入本地离线实现；该批准不跨越上述真实执行与外部门禁。
