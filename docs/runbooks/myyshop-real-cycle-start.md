---
title: MyyShop 真实 GEO Cycle 启动 Runbook
status: implemented
created: 2026-09-02
updated: 2026-10-17
source:
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/records/2026-09-02-myyshop-real-cycle-readiness-report.md
scope: 从 development-test KBASE 切换到 Goal-scoped 真实知识切片并启动真实 Cycle；不代替任何人工批准
---

# MyyShop 真实 GEO Cycle 启动 Runbook

## 1. 当前入口

- 真实 Workspace：`workspaces/myyshop`
- development-test：历史常驻工作区已于 2026-10-17 清理；确定性验证使用 `tests/fixtures/` 与临时工作区，不是当前业务入口。
- 唯一 Merchant：`MER-MYYSHOP-001`
- 测试知识库：`KBASE-MYYSHOP-DEVTEST-001`
- 待提供真实知识库示例 ID：`KBASE-MYYSHOP-REAL-001`（当前不存在，不得伪造创建）

## 2. 真实知识切片最低门

只要求拟启动 Goal 的 frozen Query Set 完整闭包，不等待全部 120 条知识：

```text
Goal
→ frozen Query Set
→ 每个 formal Query
→ approved/published Answer Card
→ approved/published Claim
→ approved Evidence → Source
→ approved Document
→ 人工批准的内部 Knowledge Release
```

所有对象必须属于同一 real KBASE。证据充分性 warning 可保留，但不得虚构不存在的 Evidence、扩大 Scope 或省略 limitations。知识目录/对象缺失只表示 `KNOWLEDGE_INPUT_ABSENT`，不能写成 Content Gap。

## 3. 建立真实 KBASE

1. 由事实 Owner 提供真实 Document/Evidence/Claim/Answer Card 及审批决定；不得复制 test-only 对象。
2. 创建 `brand_knowledge_base`，`mode: real`、`merchant_ref: MER-MYYSHOP-001`、`root_path` 指向真实知识目录；active/frozen 状态必须有真实人工 approval。
3. 在 `workspaces/myyshop/workspace.json` 把 `knowledge_base_ref:null` 改为该真实 KBASE ID，并把 `knowledge_base_mode` 改为 `real`。
4. 历史 test KBASE 不自动转正，不复制到真实工作区。2026-10-17 用户已授权清理其常驻演练目录；恢复依据见[清理记录](../records/2026-10-17-oneglanse-boundary-workspace-cleanup-record.md)，不通过跨 KBASE 引用代替真实知识批准。

## 4. 启动前只读检查

```bash
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/query-portfolio.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/geo-readiness.mjs report \
  --workspace workspaces/myyshop \
  --knowledge-base <REAL-KBASE-ID> \
  --goal <APPROVED-GOAL-ID>
```

只有 `real_cycle_start_ready:true` 才准备 Cycle plan。Readiness 本身不创建 Cycle。

## 5. Analytics Observation

每次真实读取都需要新授权决定、有效 checksum/expiry、固定资源和双确认；不要复用过期授权：

```bash
GEO_ANALYTICS_REAL_READ=1 node plugins/geo-expert/scripts/geo-analytics-readonly.mjs collect-observe \
  --workspace workspaces/myyshop \
  --plan <CURRENT-READONLY-PLAN.json> \
  --observation-plan <CURRENT-OBSERVATION-PLAN.json> \
  --confirm-readonly
```

输出只能是真实 Observation、非因果 Business Signal、candidate Evidence 与 Run。不要把 GA4/GSC 指标解释为 AI referrer、内容变更效果或 GEO 因果提升。

服务端业务文件只接受经过 Owner 授权并放入 Workspace 的聚合 JSON/CSV：

```bash
GEO_M6_NETWORK_DISABLED=1 node plugins/geo-expert/scripts/geo-analytics.mjs ingest-business-file \
  --workspace workspaces/myyshop \
  --plan <AUTHORIZED-BUSINESS-FILE-PLAN.json>
```

没有文件时保留 `BUSINESS_FILE_NOT_PROVIDED`；不得制造示例数据进入真实 Workspace。

## 6. 创建真实 Cycle

复制已验证的 plan 结构，显式设置 real `knowledge_base_ref` 与 `merchant_ref: MER-MYYSHOP-001`；`create-cycle` 会从 online Workspace 派生 `execution_scope: authorized_real`。先人工复核所有 source paths/version/checksum；只有当次用户明确授权后才执行正式 `create-cycle`。测试 KBASE、fixture approval、synthetic Evidence/Publication 不得出现。

## 7. 停止条件

- Readiness 任一 required gate blocked；
- KBASE、Goal、Query Set、Claim/Evidence/Document 或 approval 漂移；
- 需要扩大 API scope、读取 PII/逐用户数据或使用消费者 UI 自动化；
- 需要自动批准、外部 Publication、部署、发布或业务效果声明。

发生以上任一项时停止并记录 blocker，不降级到 test KBASE 或 synthetic 数据。
