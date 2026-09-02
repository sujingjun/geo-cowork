---
title: Spec 0012 — Knowledge-Independent GEO Lifecycle Readiness
status: approved
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/prd/2026-09-02-knowledge-independent-lifecycle-readiness.md
  - docs/adr/0001-one-merchant-development-test-knowledge-base.md
  - docs/specs/0003-contract-provenance-kernel.md
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/specs/0007-cycle-analytics-test-merchant.md
  - docs/specs/0008-strategy-discovery-cycle-two.md
  - docs/specs/0009-cross-host-conformance-engineering-release.md
  - docs/specs/0010-ga4-gsc-readonly-analytics.md
  - docs/specs/0011-query-portfolio.md
scope: 替代旧 test_merchant 身份边界，定义知识库选择、Readiness、真实 Observation 输入与 M8 实现闭包
---

# Spec 0012 — Knowledge-Independent GEO Lifecycle Readiness

## 1. 继承与替代

本 Spec 继承 Spec 0003—0011 中不冲突的 create-only、version pin、人工门、数据安全与宿主 tier 合同。它替代 Spec 0007—0009 中 `test_merchant`、`TMT-*`、虚构法定主体和 `.invalid` Workspace 身份要求；通用 M4/M5 合成 fixture 的 `.invalid` URL 不受影响。

## 2. Workspace 与知识库身份

development-test Workspace 的 `workspace.json` 必须包含：

```json
{
  "workspace_mode": "development_test",
  "merchant_ref": "MER-MYYSHOP-001",
  "merchant_mode": "online",
  "subject_locator": "https://www.myyshop.com/",
  "execution_scope": "synthetic_test",
  "knowledge_base_ref": "KBASE-MYYSHOP-DEVTEST-001",
  "knowledge_base_mode": "test_only",
  "online_configuration": {
    "analytics_plan": "cycles/preparation/analytics/ga4-gsc-readonly-plan.json"
  }
}
```

真实 Workspace 可在真实知识缺席时省略 `knowledge_base_ref`；任何 Cycle 创建必须显式传入，且所指对象必须存在、属于同一 Merchant、与 Workspace mode 相容。

新增对象：

- `merchant` / `MER-*` / `active|archived`：真实线上 Merchant 身份；不得带 `test_scope`。
- `brand_knowledge_base` / `KBASE-*` / `draft|frozen|active|archived`：知识集合身份、mode、root 与 provenance。
- `lifecycle_readiness_report` / `LRR-*` / `computed|superseded`：只读就绪结果；CLI 默认只输出，不自动物化对象。
- `conformance_profile` / `CFP-*` / `draft|frozen|superseded` 与 `conformance_result` / `CFR-*` / `computed|superseded`：M8 输入与结果。

所有 synthetic 对象的 `test_scope` 必须为 `{kind: synthetic, usage: test_only, merchant_ref, workspace_id, knowledge_base_ref}`，并与 Workspace 和 KBASE 一致。旧 `test_merchant` record type、`prepare-test-merchant` 命令和相关模板不得继续注册或公开。

## 3. 知识库选择与真实切片

Cycle、CIS、Review、Strategy 与相关 Run 必须 version-pin `knowledge_base_ref`。同一 Run 不得出现两个知识库。development-test KBASE 只能进入 `synthetic_test`；真实 KBASE 只能进入 `authorized_real`。

真实 Cycle start-ready 必须逐个检查所选 frozen Query Set 中所有 Query 的闭包：Query → approved/published Answer Card → approved/published Claim → approved Evidence → Source/approved Document，并由人类批准的内部 Knowledge Release 锁定版本。检查按 Goal 范围执行，无条目数下限；缺失只返回 `KNOWLEDGE_INPUT_ABSENT`，固定 `content_gap_inferred:false`。

## 4. Readiness Report

`geo-readiness report --workspace <path> --knowledge-base <KBASE-ID> --goal <GOAL-ID>` 只读输出：

- `formal_cycle_created:false`；
- `engineering_ready` 与 `real_cycle_start_ready` 分离；
- identity、knowledge closure、Query Portfolio、Analytics、business file、M7 与 M8 gate；
- 每个 gate 的 `pass|blocked|not_applicable`、证据 ref 与限制；
- `knowledge_absence.content_gap_inferred:false`。

任何对象缺失、状态不足、版本漂移或路径跨 KBASE 均 fail loud，但不得写 Gap、Cycle、Claim、Evidence、批准或 Publication。

## 5. Analytics Observation

真实 GA4/GSC 继续使用 Spec 0010 的精确资源、字段、只读 scope、双确认与授权 checksum。新增单次显式 `collect-observe`：网络前完成所有检查，成功后 create-only 写入 raw normalized artifact、一个或多个 `analytics_observation:recorded`、确定性 `business_signal:computed` 与可选 `evidence:candidate`。任何输出固定 `causal_claim:false`；Evidence 不含 approval，Business Signal 不得进入 `claim.evidence_refs`。

GA4 聚合 metrics 为 sessions、activeUsers、screenPageViews；GSC 聚合 metrics 为 clicks、impressions、CTR 与 impressions-weighted position。它们只能描述获授权时间窗内的观察，不能表示 AI referrer、GEO 增长或内容因果。

## 6. 服务端业务文件

`ingest-business-file` 只接受 Workspace 内、显式授权、聚合后的 JSON 或 CSV。必需 metadata：merchant、time window、as-of、owner role、measurement definition、source locator、authorization ref/checksum。数据只允许 metric ID、数值、单位和低基数 scalar dimensions；email、phone、IP、cookie、token、secret、用户 ID、逐请求/逐用户行和未知二进制在写入前拒绝。缺少真实文件时 Readiness 返回 `BUSINESS_FILE_NOT_PROVIDED`，不生成数据或 Gap。

## 7. Query Portfolio、Cycle 与 M7

Spec 0011 的确定性生成、去重、聚类、优先级与人工冻结保持不变，但测试写路径改为 development-test KBASE scope。Query/Query Set 不因生成而获得批准。synthetic Cycle 1/2 使用同一 MyyShop Merchant 与 test-only KBASE；Cycle 2 仍要求人工选择，Strategy 仍要求显式触发与既有双证据 Product Gap 门。

## 8. M8

required executions 固定为 Codex/Claude `packaging_static + direct_shared_tool` 与 WorkBuddy `test_only_semantic_fixture`。Codex/Claude native interactive、WorkBuddy manual configuration 是 optional；未执行为 `not_executed`。Tool 比较冻结输入的 normalized digest、index、Finding、trace、Cycle 与 diagnostics；不支持、缺包装、输入漂移、差异、PII 或未知二进制必须 fail loud。不得创建 WorkBuddy Manifest 或宣称 native host verified。

## 9. 删除与兼容边界

迁移验证后删除 `m6-test-merchant.mjs`、`test-merchant.md` 模板、`test_merchant` Schema/index/refs、`prepare-test-merchant` CLI 与专属 fixture 命名。Git 历史和旧 Record 保留，不把历史 verified 范围重写成新模型已验证。

## 10. 错误码

至少包含：`WORKSPACE_SCOPE_INVALID`、`KNOWLEDGE_BASE_REQUIRED`、`KNOWLEDGE_BASE_SCOPE_MISMATCH`、`KNOWLEDGE_INPUT_ABSENT`、`READINESS_INPUT_DRIFT`、`ANALYTICS_AUTHORIZATION_REQUIRED`、`BUSINESS_FILE_NOT_PROVIDED`、`BUSINESS_FILE_PII_DETECTED`、`CONFORMANCE_CAPABILITY_UNSUPPORTED`、`CONFORMANCE_OUTPUT_MISMATCH`。
