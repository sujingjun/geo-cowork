---
title: Spec 0003 — Contract & Provenance Kernel
status: proposed
created: 2026-08-24
source:
  - docs/prd/2026-08-23-m2-contract-provenance-kernel.md
  - docs/architecture/2026-08-23-contract-provenance-kernel-architecture.md
scope: M2 Markdown Object Contract、indexes、refs、Run、artifact 与 legacy audit migration
---

# Spec 0003 — Contract & Provenance Kernel

## 1. 触发范围

本 Spec 适用于 canonical Markdown 对象的读取和校验、派生 index 构建、Run 创建/恢复/supersede、artifact 写入、legacy ops-geo audit 迁移以及 Workspace 对象级校验。

## 2. 公共 Markdown Object Contract

### 2.1 必需 Frontmatter

```yaml
id: <stable-id>
record_type: <registered-type>
status: <type-specific-status>
version: <major.minor.patch>
created_at: <RFC3339 datetime>
updated_at: <RFC3339 datetime>
```

约束：

- `id`、`record_type` 创建后不可改变；对象内容变化必须提升 `version` 并更新 `updated_at`。
- `created_at <= updated_at`。
- `version` 固定 `^[0-9]+\.[0-9]+\.[0-9]+$`。
- canonical ID 固定大写前缀，后续片段只允许大写字母、数字和连字符。
- 可选 `title` 为非空字符串。
- 可选 `extensions` 为对象；key 必须是 `<namespace>.<name>` 小写命名，类型实现不得从 `extensions` 读取核心规则。
- 未注册顶层字段失败；未来扩展先注册类型 Schema 或使用 `extensions`。

### 2.2 M2 类型与 ID 前缀

| `record_type` | ID 前缀 | 状态 |
| --- | --- | --- |
| `query` | `Q-` | `candidate/formal/stale/deprecated` |
| `claim` | `CLM-` | `candidate/evidence_ready/reviewed/approved/published/stale/deprecated` |
| `source` | `SRC-` | `active/stale/deprecated` |
| `evidence` | `EVD-` | `candidate/reviewed/approved/stale/deprecated` |
| `finding` | `FND-` | `open/waiting_human/resolved/dismissed/superseded` |
| `asset` | `AST-` | `candidate/active/stale/deprecated` |
| `run` | `RUN-` | 见 §6 |
| `cycle` | `CYC-` | `proposed/active/waiting_human/completed/cancelled/superseded` |

Query/Claim 在 M2 冻结稳定身份、状态和最小 refs，以满足后续公共契约；M3 再定义 formal/approval/Knowledge Release 的业务转移，M2 不执行批准。

## 3. 类型最小结构

### 3.1 Query

必需：`query_text`、`language`。M2 只允许创建 `candidate`；`formal` 的人工批准规则由 Spec 0004 定义。

### 3.2 Claim

必需：`statement`、`risk_type`、`risk_level`。`risk_type` 为 `ordinary_fact/capability_fact/effect_claim/comparison_claim/high_risk_commitment`；`risk_level` 为 `low/medium/high/critical`。可选 `evidence_refs`，目标只能是 Evidence。M2 不自动推进 Claim 状态。

### 3.3 Source

必需：`name`、`source_kind`、`locator`。Source 表示主体或渠道，不包含综合可信分。

### 3.4 Evidence

必需：

```yaml
source_refs: [SRC-...]
locator: <可定位位置>
captured_at: <RFC3339>
snapshot:
  path: <workspace-relative-path>
  sha256: <64 lowercase hex>
  media_type: <non-empty>
collector:
  name: <non-empty>
  version: <non-empty>
```

可选 `claim_refs` 目标只能是 Claim。snapshot 文件必须存在于 Workspace 内且实际 SHA-256 相同。Evidence `stale` 只产生 warning，不自动修改 Claim、Release 或其他对象。

### 3.5 Finding

必需：`finding_code`、`finding_kind`、`item_state`、`rule_version`。`finding_kind` 为 `technical/semantic/legacy_observation`；`item_state` 为 `observed/inferred/unverifiable/blocked`。可选 `query_refs/claim_refs/evidence_refs/asset_refs` 必须指向对应类型。`observed` 必须至少有一个 Evidence ref；legacy 无精确 Evidence 时必须 `unverifiable`。

### 3.6 Asset

必需：`asset_kind`（`own/external`）、`locator`。可选 `source_refs` 目标只能是 Source。

### 3.7 Run

必需：`skill`、`skill_version`、`input_refs`、`input_versions`、`input_fingerprint`、`completed_steps`、`output_artifacts`、`business_result`、`next_action`。可选 `finding_refs/evidence_refs/asset_refs/failure_reason/supersedes_ref/superseded_by_ref`。

`business_result` 为 `not_evaluated/pass/partial/fail/inconclusive`，与 status 无联动；`completed` 不代表 `pass`。

### 3.8 Cycle

必需：`core_versions` 对象。每项为 `{ ref, version }`；存在的 ref 必须解析且版本相同。M2 允许空对象，M3 以后再要求 Goal、Knowledge Release、Query Set 和 Asset 组合。

## 4. refs 解析

### 4.1 允许关系

| 来源字段 | 允许目标 |
| --- | --- |
| `claim.evidence_refs` | `evidence` |
| `evidence.source_refs` | `source` |
| `evidence.claim_refs` | `claim` |
| `finding.query_refs` | `query` |
| `finding.claim_refs` | `claim` |
| `finding.evidence_refs` | `evidence` |
| `finding.asset_refs` | `asset` |
| `asset.source_refs` | `source` |
| `run.input_refs` | 任一已注册 canonical 类型 |
| `run.finding/evidence/asset_refs` | 对应类型 |
| `run.supersedes_ref/superseded_by_ref` | `run` |
| `cycle.core_versions.*.ref` | 任一已注册 canonical 类型 |

### 4.2 错误

- 相同 ID 出现两次：`DUPLICATE_ID`，报告两个相对路径。
- 目标不存在：`BROKEN_REF`，报告来源路径、字段和 ref。
- 目标类型错误：`REF_TYPE_MISMATCH`，报告期望/实际类型。
- `core_versions` 的目标版本不同：`REF_VERSION_MISMATCH`。
- legacy `knowledge_entry` 不参与 canonical refs 闭包，也不能作为 canonical ref 目标；M3 通过显式 `legacy_refs` 处理。

## 5. index 契约

### 5.1 输出

每个已注册类型对应一个稳定文件，至少包括 `queries.json/claims.json/sources.json/evidence.json/findings.json/assets.json/runs.json/cycles.json`：

```json
{
  "schema_version": "1.0.0",
  "record_type": "claim",
  "objects": [
    {
      "id": "CLM-EXAMPLE-001",
      "status": "candidate",
      "version": "1.0.0",
      "path": "knowledge/claims/example.md",
      "updated_at": "2026-08-24T00:00:00+08:00",
      "refs": ["EVD-EXAMPLE-001"]
    }
  ]
}
```

对象按 `id`、path 排序；refs 去重排序；JSON 两空格缩进、末尾换行；不写 `generated_at`。

### 5.2 legacy knowledge index

扫描 `knowledge/` 下 `record_type: knowledge_entry`，排除 `00-governance/`、`01-templates/`、`README.md` 和 `_index.md`。输出 `legacy-knowledge.json`，每项只含 `id/query_id/status/version/path/content_sha256/contract_status: legacy`。它不把条目映射成 Claim，也不验证 legacy `query_id` 为 canonical ref。

### 5.3 构建规则

- 先完成全部 parse、Schema、snapshot checksum、duplicate 与 refs 校验；有 error 时不写任何正式 index。
- warning 不阻止构建，必须结构化返回。
- 相同 Markdown 输入连续构建字节一致。
- 构建前后所有 Markdown SHA-256 必须相同。
- index 自身不参与扫描；临时文件不得残留。

## 6. Run 生命周期与不可变工件

### 6.1 状态机

```text
pending → running | cancelled | superseded
running → waiting_human | blocked | completed | failed | cancelled | superseded
waiting_human | blocked → running | failed | cancelled | superseded
failed → running | cancelled | superseded
completed | cancelled | superseded → terminal
```

重复设置当前状态幂等；其他转移返回 `INVALID_RUN_TRANSITION`。

### 6.2 input fingerprint

`input_versions` 是 `ref -> version` 对象；按 ref 排序后以 UTF-8 canonical JSON 计算 SHA-256。恢复时：

- fingerprint 相同：返回 `resume`，可按状态机进入 `running`；
- fingerprint 不同：旧 Run 设 `superseded`、记录 `superseded_by_ref`，以调用方提供的新稳定 ID 创建 `pending` Run，并记录 `supersedes_ref`；
- 对同一 old/new/input 重复调用返回同一结果；不同内容撞到相同新 ID 返回冲突。

### 6.3 artifact

只允许 `raw/<relative>` 或 `outputs/<relative>`；禁止目录 symlink、文件 symlink、绝对路径、`..`、反斜杠和空路径。使用 `wx` 创建，目标已存在返回 `ARTIFACT_EXISTS`，旧字节不变。

## 7. legacy ops-geo adapter

### 7.1 输入

脱敏 JSON 可包含：`url/date/geo_score/scores/platforms/findings/snapshots`。每个 snapshot 使用逻辑 key、相对 path、source locator、captured_at、sha256、media_type、collector/version；Finding 可含 `evidence_keys`。

### 7.2 输出与降级

- 计算完整输入 SHA-256；用显式大写 namespace 和稳定序号生成 Source/Evidence/Finding ID。
- snapshot 生成 Source/Evidence；只在 Evidence 文件存在且 checksum 一致时可引用。
- 有全部精确 `evidence_keys` 的 Finding 可为 `observed`；否则必须 `unverifiable`。
- 原 title/description 只放 `extensions.legacy.statement` 或正文，不回填 Claim/Query/Asset refs。
- `geo_score` 只进入 migration summary：`{ value, rubric_version: "legacy-unknown", comparable: false }`；`scores/platforms` 不进入权威指标。
- 输入永不修改；重复相同 import 幂等；已有 ID 内容不同返回 `IMPORT_CONFLICT`。

## 8. 安全与脱敏

- canonical walker 对 symlink 一律 `SYMLINK_NOT_ALLOWED`。
- 文件相对路径必须经过 Workspace containment；逃逸返回 `PATH_ESCAPE`。
- secret marker 至少覆盖 private key block、常见 bearer/token/API key 赋值和 cookie header；错误只含 path、line、code，不含命中值。
- parser 不读取 Markdown 内链接目标或网络 URL。
- CLI stdout/stderr 不输出环境变量、完整文件正文或 snapshot 内容。

## 9. 并发与幂等

- Workspace identity 竞争失败者必须读取实际落盘 ID。
- 两个 index build 的正式输出必须均为完整合法 JSON，最终字节相同。
- import、artifact、supersede 使用稳定 ID、`wx` 与原子 rename；重复调用不得产生重复对象。
- 进程在新 Run 创建后、旧 Run 更新前中断时，重复 supersede 必须收敛。

## 10. CLI 与退出码

```text
build-index.mjs --workspace <path> [--check]
workspace-validate.mjs --workspace <path> [--objects]
run-lifecycle.mjs <create|artifact|resume> ...
legacy-ops-geo-import.mjs --workspace <path> --input <json> --namespace <UPPER-ID>
```

通用退出码：0 成功；1 契约/refs/checksum/secret 失败；2 参数或路径非法；3 create-only/import/identity 冲突。现有 `workspace-init` 身份冲突仍使用 3。

## 11. 非功能要求

- Node.js >=20，ESM；相同输入跨 cwd 产生相同语义输出。
- 1,000 个 Markdown 对象的本地 parse/validate/index 目标小于 5 秒；本里程碑用合成 Fixture 验证正确性，不把性能目标误报为生产容量结论。
- 所有 diagnostics 可序列化为 JSON，且包含稳定 `code`。

## 12. 非目标与授权

- 不批准 Query/Claim，不发布 Knowledge Release，不执行 M3/M4 业务。
- 不引入数据库、网络采集、真实模型、Python 业务内核或云服务。
- 本 Spec 当前为 `proposed`；实现和测试不把它自行提升为 `approved`。

