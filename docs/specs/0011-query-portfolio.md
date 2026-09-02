---
title: Spec 0011 — Query Portfolio Pipeline
status: approved
created: 2026-09-01
updated: 2026-09-02
source:
  - docs/prd/2026-09-01-query-portfolio.md
  - docs/architecture/2026-09-01-query-portfolio-architecture.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - 2026-09-01 当前用户明确指令：先实现 Query Portfolio 候选生成、去重、聚类、优先级、人工批准和 Query Set 冻结
scope: Query Portfolio 从观察 intake 到 frozen Query Set 的确定性流水线合同；不新增 record type、不修改既有 Spec 0003/0004/0007 语义
---

# Spec 0011 — Query Portfolio Pipeline

## 1. 继承与触发范围

继承 Spec 0003 的公共字段、stable ID、refs、version pin、checksum、create-only、安全与幂等规则；继承 Spec 0004 的 Query / Query Set / Perception Goal 状态机与人工批准合同（candidate → formal、draft → frozen 均由人类完成）；development-test 路径按 Spec 0012 使用唯一线上 Merchant、test-only KBASE 与 `preflightTestKnowledgeWrite` 写入门。本 Spec 适用于 `query-portfolio.mjs`、`lib/query-portfolio.mjs`、`skills/geo-query-portfolio`、Query Portfolio fixture 与测试。

本 Spec 不新增 record type，不修改任何既有 Schema、lib 或 CLI；Query 继续使用 Spec 0003 的 `query` 对象与 `queries/candidates|formal` 目录，Query Set 继续使用 `query_set` 对象与 `queries/sets` 目录。

## 2. 确定性规则

所有规则带版本号；版本号写入生成对象的 `extensions["geo.qp_intake"]` 与报告工件；规则语义变更必须升版本。

### 2.1 `qp-normalize-v1`

输入 `query_text`，输出 `normalized_text`：NFKC 归一 → 小写 → 连续空白折叠为单空格 → 去除首尾标点（`?!.,;:、。？！，；：`）。输出为空即 `QP_QUERY_TEXT_INVALID`。该 `normalized_text` 与 Spec 0004 §4.2 的去重键语义一致。

### 2.2 `qp-intent-v1`

在 `normalized_text` 上按固定顺序匹配关键词（英文按词边界，中文按子串），首个命中的意图生效：

```text
1 comparison          ：" vs "、"vs."、"compar" 前缀（compare/compared/…）、"difference between"、"对比"、"区别"、"还是"
2 recommendation      ："best"、"top "、"recommend"、"should i"、"推荐"、"哪个好"
3 pricing             ："pric" 前缀（price/pricing/…）、"cost"、"how much"、"free"、"收费"、"多少钱"、"价格"、"免费"
4 reputation          ："safe"、"legit"、"scam"、"trustworthy"、"review"、"reviews"、"靠谱"、"安全"、"评价"、"骗局"
5 capability          ："how to"、"can "、"does "、"feature"、"features"、"功能"、"怎么用"、"如何"、"支持"
6 brand_definition    ：以 "what is"/"what are"/"who is"/"who are" 开头、"tell me about"、"什么是"、"是什么"、"介绍一下"
7 other               ：以上均未命中
```

### 2.3 `qp-priority-v1`

来源类别固定映射：`generative_platform_observation → P0`、`first_party_user_data → P1`、`community_expression → P2`、`competitor_material → P3`。一个 Query 被多个来源观察时取序号最小（最高）优先级。`source_class` 是计划中的人类声明，本规则只校验枚举，不验证声明的真实性。

### 2.4 `qp-cluster-v1`

聚类域为 (Goal, language, intent) 桶内 status 为 `candidate|formal` 的 Query。token 化：ASCII 字母数字串为单 token；连续 CJK 字符产出相邻二元组（长度 1 产出单字）。token 集去除停用词（规则内置固定表）后计算 Jaccard 相似度；按 `compareUtf8` 有序枚举 query ID 对，相似度 ≥ 0.6 即 union 归并。`cluster_key = 'QC-' + sha256(stableStringify({language, intent, member_refs 升序})) 前 12 位 hex 大写`；代表 Query 为成员中 ID 字节序最小者；聚类建议优先级为成员优先级的最高者。聚类结果是派生分析，不是业务对象。

### 2.5 `qp-id-v1`

`id = 'Q-' + SLUG + '-' + LANG + '-' + HEX4`：

- SLUG：`normalized_text` 的 ASCII 字母数字 token，取前 5 个、每个截断 12 字符、连接 `-`、总长截断 40、大写；无 ASCII token 时为 `QUERY`；
- LANG：`language` 以 `-`/`_` 切分首段大写；
- HEX4：`sha256(stableStringify({normalized_text, language}))` 前 4 位 hex 大写。

输出路径为 `queries/candidates/<id 小写>.md`。若该 stable ID 已存在且 `(normalized_text, language)` 不同，写前失败 `QP_ID_COLLISION`。

## 3. 工具合同

CLI：`query-portfolio.mjs <command> --workspace <path> ...`；命令为 `intake / report / assemble / prefreeze / validate`。参数解析、JSON stdout、错误输出与退出码沿用仓库既有 CLI 约定（`2` 参数/路径错误、`3` 冲突、`1` 校验失败）。

### 3.1 `intake --workspace <path> --plan <plan.json> [--now <RFC3339>]`

计划 `schema_version` 固定 `qp-intake-plan/1.0.0`：

```json
{
  "run_id": "RUN-QP-EXAMPLE-001",
  "goal_ref": "GOAL-EXAMPLE-001",
  "sources": [
    {
      "source_ref": "SRC-EXAMPLE-001",
      "source_class": "generative_platform_observation",
      "observed_at": "2026-09-01T00:00:00+08:00",
      "entries": [
        { "query_text": "What is Example?", "language": "en-US" }
      ]
    }
  ]
}
```

预检（全部通过后才写入，无部分写入）：

1. `run_id` 以 `RUN-` 开头；`goal_ref` 解析为 `perception_goal`；
2. 每个 `source_ref` 解析为 `source` 且 status 为 `active`；`source_class` 在 §2.3 枚举内；`observed_at` 合法 RFC3339；
3. 每条 entry 的 `query_text` 非空、`language` 至少 2 字符；归一化结果非空；
4. 同一 source 组内出现重复 `(normalized_text, language)` → `DUPLICATE_QUERY`，整个计划失败；
5. 跨 source 组的重复 `(normalized_text, language)` 合并为一个 Query：`discovery_source_refs` 为来源并集，`query_text` 取参与文本中 `compareUtf8` 字节序最小者，优先级取最高；
6. 与既有同 Goal 活跃（candidate/formal）Query 重复 → 不创建新对象，计入 `duplicates`（含既有 ref 与来源 ref）；
7. 生成的 stable ID 与既有对象冲突且语义不同 → `QP_ID_COLLISION`。

写入对象：`status: candidate`、`version: 1.0.0`、`intent`（§2.2）、`priority`（§2.3）、`goal_refs: [goal_ref]`、`discovery_source_refs`（升序）、`extensions["geo.qp_intake"] = { normalize, intent, priority, cluster 规则版本, sources: [{ref, source_class, observed_at}] }`。不写 `approval`；写路径按 §4 双路执行。幂等：同字节重跑返回 `kept`。

stdout 结果至少包含：`created`、`kept`、`duplicates`（`existing_ref`、`source_ref`）、每条新 Query 的 `id/path/normalized_text/intent/priority/source_classes`。

### 3.2 `report --workspace <path> --goal <GOAL-ID> [--now <RFC3339>]`

计算该 Goal 下全部非 stale/deprecated Query 的组合视图：按 (language, intent) 的分布、`qp-cluster-v1` 聚类（含成员 refs+versions、代表 Query、建议优先级、formal 数）、覆盖统计（每语言/每意图/每聚类的 total 与 formal）、冻结就绪摘要（formal 覆盖为 0 的聚类与无 formal 的语言）。

结果以 canonical JSON 写入 create-only 工件 `queries/portfolio/reports/<goal-id 小写>-<key8>.json`，`key8` 为报告 canonical bytes sha256 前 8 位 hex；内容含 `schema_version: "qp-portfolio-report/1.0.0"`、`rule_versions`、`generated_at` 与全部视图数据。同内容重跑 `kept`；内容变化产生新文件，不修改旧工件。stdout 同步返回报告与工件路径。

### 3.3 `assemble --workspace <path> --plan <plan.json> [--now <RFC3339>]`

计划 `schema_version` 固定 `qp-assemble-plan/1.0.0`，字段：`id`（QS- 前缀）、`path`、可选 `title`、`goal_refs`（≥1）、`query_versions`（`{ref, version}` ≥1、ref 唯一）。校验：goal 解析为 `perception_goal`；query 解析为 `query` 且满足 M3 必填字段；版本精确匹配（`VERSION_DRIFT`）；plan 内 ID/path 唯一；既有同 ID 异路径冲突 `OBJECT_CONFLICT`。允许引用 candidate 或 formal Query（与 Spec 0004 §4.7 draft 语义一致）。

写入 `status: draft` 的 `query_set`（不含 freeze 字段、不含 approval），并返回 `content_sha256_preview`（按 `querySetContentSha` 语义）。写路径按 §4 双路执行，幂等同 §3.1。

### 3.4 `prefreeze --workspace <path> --query-set <QS-ID>`

纯检查，不写入。对 draft 输出 gates（每项含 code/ref/field）：

- 每条 `query_versions`：ref 解析、版本精确匹配、Query `status: formal`（`QUERY_NOT_FORMAL`）、Query 具备 `approval`（`APPROVAL_REQUIRED`）；
- 每个 `goal_refs`：解析且 status 为 `approved|active`（`GOAL_NOT_APPROVED`）；
- 期望 `content_sha256`（`querySetContentSha` 语义）与建议的 `frozen_at/frozen_by/approval` 字段清单。

覆盖 warning：Goal 下 `qp-cluster-v1` 聚类中无成员进入本集合、portfolio 语言未进入本集合。全部 gate 满足时 `ready: true`；存在 gate 时退出码 `1`。若对象已是 `frozen`，则按 Spec 0004 §4.7 冻结合同复检并报告其有效性，不提供任何改写。

### 3.5 `validate --workspace <path>`

执行三层检查并返回 `{errors, warnings}`（errors 非空时退出码 `1`）：

1. Spec 0004 的 `validateKnowledgeWorkspace` 全部 errors/warnings；
2. Query Portfolio 检查：带 `extensions["geo.qp_intake"]` 的 Query 若 `normalized_text`/`intent` 与规则重算不一致（`QP_NORMALIZATION_DRIFT`/`QP_INTENT_DRIFT`，warning）；frozen Query Set 的 Goal 聚类覆盖缺口（`QP_COVERAGE_GAP`，warning）；Query 的 `priority`/Schema 约束由既有 Schema 校验承载；
3. `workspace.json` 为 `test_only` 时追加 Spec 0007 `validateTestMerchantWorkspace` 的全部 errors。

## 4. 双路写入与安全

- 读取 workspace 根 `workspace.json`：`workspace_mode === 'development_test'` 时，每个输出对象从唯一 Merchant 与显式 KBASE 生成顶层 `test_scope`，经 `preflightTestKnowledgeWrite`（身份、知识库隔离、Schema、M6 profile、refs 闭包）后 `writeCreateOnly`；否则走 `validateObjectData + writeCreateOnly`（与 M3 相同路径）。`workspace.json` 缺失或无该字段按非测试路径处理。
- 全部输出路径经 `assertSafeRelativePath`/`assertNoSymlinkPath`/`resolveWithin`；报告工件与对象均 create-only，冲突返回 `OBJECT_CONFLICT`。
- 工具任何命令不生成、不修改、不删除 `approval`；不修改既有 Query/Query Set 状态；不写 Claim/Evidence/Document/Knowledge Release/Answer Card。

## 5. 幂等与冲突

沿用 Spec 0003 §7：目标不存在 `wx` 创建；存在且字节相同 `kept`；同 ID/path 不同内容 `OBJECT_CONFLICT`；可预见冲突全部在写入前预检。intake 对既有 Query 的重复观察不产生第二对象，也不修改既有对象。

## 6. development-test KBASE fixture 与知识库缺席验收

- fixture workspace 具备 MyyShop online Merchant identity 与唯一 frozen test-only KBASE；真实 locator/config 只属于 Merchant 配置，合成 Source locator 继续使用 `.invalid`；
- 种子对象仅为 `source`（active）与 `perception_goal`（approved，fixture approval `fixture://…`）；**不包含任何 claim / evidence / document / knowledge_release / answer_card**；
- 全部写入经 `preflightTestKnowledgeWrite`，对象带 Merchant、Workspace、KBASE 三元绑定的 `test_scope`；
- E2E：intake（含幂等重跑）→ report（含确定性重算）→ 人工批准模拟（fixture 编辑 formal + approval）→ assemble → prefreeze（正/负 gate）→ 人工冻结模拟 → validate 无 error → `build-index` 成功且 `queries.json`/`query-sets.json` 含新对象 → 断言工作区零知识对象。

## 7. 错误码

```text
QP_PLAN_INVALID
QP_GOAL_REQUIRED
QP_SOURCE_REQUIRED
QP_QUERY_TEXT_INVALID
QP_ID_COLLISION
QP_REPORT_CONFLICT
DUPLICATE_QUERY
VERSION_DRIFT
APPROVAL_REQUIRED
QUERY_NOT_FORMAL
GOAL_NOT_APPROVED
OBJECT_CONFLICT
BROKEN_REF / REF_TYPE_MISMATCH（沿用）
QP_NORMALIZATION_DRIFT (warning)
QP_INTENT_DRIFT (warning)
QP_COVERAGE_GAP (warning)
```

退出码沿用 Spec 0003 通用约定。

## 8. 非目标

不实现 candidate → formal 或 draft → frozen 的任何自动提升；不采集平台数据；不修改真实 `workspaces/myyshop`；不生成 M4 之后的 Gap/Proposal/Publication；不在 Cycle 运行期管理 Query Set（Spec 0007 freeze CIS 已覆盖）；不引入 LLM 分类或非确定性聚类。
