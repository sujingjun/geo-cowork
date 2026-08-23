---
title: Spec 0004 — Knowledge & Query Operating System
status: proposed
created: 2026-08-24
source:
  - docs/prd/2026-08-24-m3-knowledge-query-operating-system.md
  - docs/specs/0003-contract-provenance-kernel.md
scope: M3 Document、Claim/Evidence、Answer Card、Knowledge Release、Query Set 与 Evidence Plan
---

# Spec 0004 — Knowledge & Query Operating System

## 1. 继承与触发范围

所有 M3 对象继承 Spec 0003 公共字段、安全、stable ID、refs、index 和 Run 契约。本 Spec 适用于 `geo-knowledge-cycle/geo-query/geo-knowledge/geo-evidence`、`knowledge-query.mjs`、M3 Schema、对象模板和 MyyShop M3 slice。

## 2. 新对象类型

| `record_type` | ID 前缀 | 状态 |
| --- | --- | --- |
| `document` | `DOC-` | `draft/reviewed/approved/stale/deprecated` |
| `answer_card` | `ANS-` | `candidate/reviewed/approved/published/stale/deprecated` |
| `knowledge_release` | `KR-` | `draft/reviewed/published/superseded` |
| `query_set` | `QS-` | `draft/frozen/superseded` |
| `evidence_plan` | `EPL-` | `draft/active/fulfilled/superseded` |
| `perception_goal` | `GOAL-` | `candidate/approved/active/achieved/partial/not_achieved/deprecated` |

M3 同时扩展 Spec 0003 的 Query、Claim、Evidence 字段与状态条件，不改变其 ID。

## 3. 人工批准证明

需要批准的对象使用：

```yaml
approval:
  approved_by: <human role or stable human identifier>
  approved_at: <RFC3339>
  decision_ref: <workspace-local decision or current user instruction reference>
```

约束：

- Agent 不得自行生成或猜测 approval。
- `document:approved`、`claim:approved|published`、`query:formal`、`answer_card:approved|published`、`query_set:frozen`、`knowledge_release:published`、`perception_goal:approved|active|achieved|partial|not_achieved` 必须有 approval。
- approval 记录存在只证明对象内有可追溯人类决定；发布、部署和业务效果仍由各自 Record 证明。

## 4. 对象结构与规则

### 4.1 Document

必需：`scope`、`source_refs`；可选 `legacy_refs`、`claim_refs`。`legacy_refs` 只允许 legacy `KB-*`/`Q-*` 字符串，不参加 canonical broken-ref。只有 `approved` Document 可作为 `propose` 输入。

### 4.2 Query 扩展

必需增加：`normalized_text`、`intent`、`priority`、`goal_refs`；可选 `discovery_source_refs`、`legacy_refs`。`goal_refs` 只能指 Perception Goal，`discovery_source_refs` 只能指 Source。

- candidate → formal 必须由人类修改状态并提供 approval；Tool 不提供自动 promote。
- 同一 active Goal 下 `normalized_text + language` 重复返回 `DUPLICATE_QUERY`。
- formal Query 文本变化必须提升 version；frozen Set 以精确 `ref + version + content_sha256` 阻止静默漂移。v1 的一个 checkout 只解析每个 stable ID 的当前 canonical 文件；历史字节由 Git 与不可覆盖 Run 工件保存，不在同一 graph 内并存解析同 ID 多 revision。

### 4.3 Claim 扩展

必需增加：`document_refs`、`scope`、`evidence_sufficiency`。`document_refs` 只能指 Document；可选 `release_refs` 只能指 Knowledge Release。

`evidence_sufficiency`：

```yaml
evidence_sufficiency:
  status: sufficient | insufficient | unknown
  rule_version: m3-evidence-sufficiency-v1
  missing: [<evidence category>]
```

治理生命周期：

```text
candidate → evidence_ready | deprecated
evidence_ready → reviewed | candidate | deprecated
reviewed → approved | evidence_ready | deprecated
approved → published | stale | deprecated
published → stale | deprecated
stale → reviewed | deprecated
deprecated → terminal
```

M3 不提供自动 promote 命令。validator 校验当前目标状态的 approval、证据与 Release 前置，但单个当前文件不能证明完整历史转换路径；append-only transition ledger 不在本里程碑范围。

`published` 必须有至少一个 published Knowledge Release 的 `release_refs`，且该 Release 锁定本 Claim 当前 version。充分性建议不自动推进或回退状态。

### 4.4 Evidence 扩展

可选 `scope`、`approval`。approved Evidence 必须有 approval。stale Evidence 只返回 `STALE_EVIDENCE` warning；不能触发对象写入或 Claim/KR 状态变化。

### 4.5 Answer Card

必需：`query_refs`、`claim_versions`、`direct_answer`、`limitations`、`forbidden_statements`。`query_refs` 只能指 Query；`claim_versions` 每项为 `{ ref, version }` 并必须解析为 Claim 精确版本。可选 `evidence_refs`、`release_refs`。

approved/published Answer Card 只能引用 formal Query 和 approved/published Claim。`published` 必须有 published Release ref；不表示外部页面发布。

### 4.6 Perception Goal

必需：`goal_statement`、`success_question`。可选 `query_set_refs`。Tool 创建的 MyyShop Goal 保持 candidate，直到 Owner 显式批准；当前实例的后续批准见 M3 业务对象批准 Record。

### 4.7 Query Set

必需：`goal_refs`、`query_versions`；每个 version ref 唯一。draft 可包含 candidate/formal Query，用于准备；frozen 时：

- 所有 Query 必须 formal、有 approval、版本精确匹配；
- 必须有 `frozen_at`、`frozen_by`、approval；
- `content_sha256` 等于按 ref 排序的 `{ref,version,query_text,language}` canonical JSON SHA-256；
- frozen 对象内容变化失败，必须新 version 并 supersede。

### 4.8 Knowledge Release

必需：`release_version`、`claim_versions`、`answer_card_versions`、`readiness`。draft/reviewed 可引用 candidate 对象，但 `readiness` 必须为 `incomplete`。published 时：

- `readiness: ready` 且有 approval；
- Claim 必须 approved/published，Answer Card 必须 approved/published；
- 所有 version 精确匹配；
- refs 闭包必须形成 Query → Answer Card → Claim → Evidence → Source 与 Claim → Document；
- 发布后内容变化必须新 Release version，旧 Release `superseded`。

### 4.9 Evidence Plan

必需：`claim_refs`、`current_gap`、`required_evidence`、`minimum_acceptance`、`source_categories`、`provider_owner`、`acceptance_method`、`retest_query_refs`。它只描述计划，不自动创建 Evidence、Finding、Asset 或采集任务。

## 5. 风险与充分性建议

确定性规则版本 `m3-evidence-sufficiency-v1`：

- `ordinary_fact`：至少一个 approved first-party Evidence；
- `capability_fact`/`effect_claim`：first-party Evidence + data/case Evidence；
- `comparison_claim`：first-party Evidence + user/independent-third-party Evidence；
- `high_risk_commitment`：formal-rule Evidence + 明确 Scope + Claim approval。

Evidence 通过 `extensions.geo.evidence_category` 表示类别。缺失返回 warning 与建议，不自动修改 `evidence_sufficiency` 或 status。

Evidence Sufficiency 是建议而非机器发布硬门。只要 published Release 的 Document/Evidence/Claim/Answer/Query 均具备可追溯人类批准，Owner 可以在保留 `EVIDENCE_INSUFFICIENT` warning、Scope、limitations 与禁止表述的前提下决定纳入内部 Knowledge Release；系统不得把批准改写成不存在的 `first_party/data/case` Evidence。

## 6. Tool 输入输出

### 6.1 `propose`

```text
knowledge-query.mjs propose --workspace <path> --plan <json>
```

plan 包含 approved `document_ref`、candidate Claim 和 Answer Card 的完整稳定 ID、字段与相对输出路径。Tool 校验 Document、refs、输出路径并以 create-only 写入；所有输出强制 candidate，plan 尝试更高状态返回 `AUTO_APPROVAL_FORBIDDEN`。

### 6.2 `assemble-release`

创建 draft Knowledge Release；不提供 publish flag。验证 refs/version，并固定写入 `readiness: incomplete`；正式 `ready` 只能由人类完成 approved 闭包后写入并通过 validator，不提升 status。

### 6.3 `assemble-query-set`

创建 draft Query Set；不提供 freeze flag。freeze 由人类补充 approval/status 后通过 validator 检查。

### 6.4 `validate`

对 Workspace 执行本 Spec 的状态、approval、重复 Query、version pin、trace 与充分性规则；errors 阻止 index，warnings 不写业务对象。

## 7. 幂等与冲突

- propose/assemble 目标不存在则 `wx` 创建；存在且字节相同返回 `kept`；同 ID/path 不同内容返回 `OBJECT_CONFLICT`。
- 一个 plan 内 duplicate ID/path 先失败，不产生任何正式文件。
- 所有可预见的 Schema/ref/版本/既有目标冲突在写入前全量预检；意外 I/O 或进程故障不是跨文件事务，可能留下已经合法创建的 candidate 子集，重试以同字节 `kept` 幂等收敛。
- Tool 不修改已有 Claim/Query/Document 的状态；状态更新由人类或另行批准的专门命令完成。

## 8. indexes 与 trace

Spec 0003 index registry 增加 `documents.json/answer-cards.json/knowledge-releases.json/query-sets.json/evidence-plans.json/perception-goals.json`。每项 refs 包含 version-pinned refs 的 ID。

`trace --query <Q-ID>` 输出 Goal、Query Set、Answer Card、Claim version、Evidence、Source、Document 与 Release 的匹配关系；缺任一 required provenance edge 返回 `TRACE_INCOMPLETE`，不猜测关系。关系完整后还必须返回 `lifecycle_ready` 与逐对象 `gates`：candidate/draft 链可以被追溯，但必须明确 `false`，不能伪装成正式可发布链。

## 9. 错误与 warning

至少包括：

```text
APPROVAL_REQUIRED
AUTO_APPROVAL_FORBIDDEN
M3_FIELD_REQUIRED
DUPLICATE_QUERY
VERSION_DRIFT
QUERY_NOT_FORMAL
RELEASE_NOT_READY
TRACE_INCOMPLETE
LIFECYCLE_NOT_READY (trace gate)
STALE_EVIDENCE (warning)
EVIDENCE_INSUFFICIENT (warning)
EVIDENCE_SUFFICIENCY_DRIFT (warning)
OBJECT_CONFLICT
```

沿用 Spec 0003 通用退出码。

## 10. MyyShop v1 边界

自动创建阶段只产生 candidate/draft 对象，保留最终产品方案中的五条风险，不把 legacy draft 或 `approved` 产品计划自动升级为品牌事实批准；此时 trace 必须返回 `lifecycle_ready:false` 和具体 gate。Owner 后续已明确批准 MyyShop v1 业务对象，当前实例 trace 为 `lifecycle_ready:true`，但两条证据不足 warning 与外部发布边界继续保留，详见 M3 业务对象批准 Record。合成 Fixture 可包含明确的测试 approval，用于验证机器门；Fixture 必须使用虚构品牌和 `.invalid` locator。

## 11. 非目标与授权

不创建 M4 Finding/Asset/Gap/建议稿，不采集真实平台，不连接 GA4/GSC，不发布内容。Spec 当前为 `proposed`，本地实现与测试不构成 Owner 批准或 MyyShop KR 业务发布。
