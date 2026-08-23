---
title: M3 Knowledge & Query Operating System 实施计划
status: proposed
created: 2026-08-24
source:
  - docs/specs/0004-knowledge-query-operating-system.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
scope: M3 四个离线纵切、MyyShop candidate slice 与开发验收
---

# M3 Knowledge & Query Operating System 实施计划

## 1. 前置与现状

M3 复用 M2 common parser/index/Run。现有 MyyShop 120 条 knowledge 均为 legacy draft；不得把它们批量转换成 approved Claim。M3 只完成单 Goal 的离线准备闭环，不启动真实 GEO Cycle。

## 2. 纵切

### Slice A — M3 Schema、模板与 validator

新增 `schemas/m3-record-types.schema.json`、Document/Answer Card/Release/Query Set/Evidence Plan/Goal 模板及 `scripts/lib/knowledge-query.mjs`。先写失败测试，覆盖 approval、status、version pins、duplicate Query、stale warning 和 trace。

### Slice B — Document → candidate Claim/Answer Card

实现 `knowledge-query.mjs propose`：只接受 approved Document 和完整 plan，强制 candidate、create-only。用虚构批准 Document Fixture 验证；非 approved 与自动批准输入失败。

### Slice C — Query Set 与 Knowledge Release

实现 `assemble-query-set`、`assemble-release` 与 `validate/trace`。合成 Fixture 验证 formal/frozen/published 完整门；真实 MyyShop 保持 candidate/draft。

### Slice D — Skills 与 MyyShop “What is MyyShop” v1

新增 `geo-knowledge-cycle/geo-query/geo-knowledge/geo-evidence`，共享确定性 Tool。为 MyyShop 建立 Goal、产品方案与 legacy Source、candidate Evidence、draft Document、candidate Claims/Answer Card/Query、draft Query Set/KR、Evidence Plan 与完成状态但 `business_result:not_evaluated` 的 Run。构建 indexes 和带 lifecycle gate 的 trace，不改 120 条 legacy。

## 3. 目标文件

- `plugins/geo-expert/schemas/m3-record-types.schema.json`
- `plugins/geo-expert/scripts/lib/knowledge-query.mjs`
- `plugins/geo-expert/scripts/knowledge-query.mjs`
- `plugins/geo-expert/assets/object-templates/{document,answer-card,knowledge-release,query-set,evidence-plan,perception-goal}.md`
- `plugins/geo-expert/skills/{geo-knowledge-cycle,geo-query,geo-knowledge,geo-evidence}/SKILL.md`
- `tests/m3-knowledge-query.test.mjs`
- `tests/fixtures/m3-knowledge-query/`
- `workspaces/myyshop/` 的窄 canonical slice 与派生 indexes

## 4. 测试矩阵

| 分组 | 场景 |
| --- | --- |
| Document/propose | approved/non-approved；candidate 强制；duplicate plan；create-only 冲突 |
| Claim | 五类风险；充分性建议；非法转移；无 approval 的 approved/published；published 无 Release |
| Evidence | Source 分离；snapshot/locator；stale 只 warning；充分性缺失不改状态 |
| Query | candidate 不自动 formal；formal 无 approval；normalized duplicate |
| Query Set | draft 含 candidate；frozen 仅 formal；version/content hash；freeze 后漂移 |
| Release | 精确 Claim/Answer versions；readiness；published approval；完整 trace |
| legacy | compatibility count 120、聚合 SHA 不变、legacy_refs 不参加 canonical refs |
| 安全/回归 | 继承 M2 path/symlink/secret/id/ref/index/Run；M0/M1 全绿 |

## 5. 验收命令

```bash
npm run test:m3-knowledge-query
npm test
npm run validate:plugin
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/knowledge-query.mjs validate --workspace workspaces/myyshop
node plugins/geo-expert/scripts/knowledge-query.mjs trace --workspace workspaces/myyshop --query Q-MYYSHOP-WHAT-IS-001
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop
git diff --check
```

## 6. 人工门与状态

当前用户指令授权本地 M2/M3 实现和项目 Lead 验收，并覆盖旧 Handoff 的会话停止边界；未授权 Agent 将 PRD/Spec 标记 approved。MyyShop 业务对象不得使用合成 approval，真实 KR/Query Set 保持 draft。

## 7. M4 停止线

M3 不创建 Finding、Asset、Gap、建议稿、Adoption Record 或 Technical Retest。M4 Handoff 清楚列出 draft 输入不能用于真实诊断的前置门，不以开发测试替代业务批准。

## 8. 回滚与发布

全部实例 create-only，index 可重建，legacy 原文件不修改。不执行删除、外部写入、commit、push、PR、部署或发布；任何后续清理由人类基于 Git diff 决定。
