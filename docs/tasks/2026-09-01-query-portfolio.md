---
title: Query Portfolio 流水线任务清单
status: verified
created: 2026-09-01
updated: 2026-09-02
source:
  - docs/plans/2026-09-01-query-portfolio-plan.md
  - docs/specs/0011-query-portfolio.md
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
scope: 当前会话内的 TDD、实现、验证与 Record 收口
---

# Query Portfolio 流水线任务清单

## T01 — 规则红测与实现

- 目标：`qp-normalize-v1`、`qp-intent-v1`、`qp-priority-v1`、`qp-cluster-v1`、`qp-id-v1` 纯函数按 Spec 0011 §2 实现，测试先红后绿，含中文二元组与确定性排序。
- 范围外：workspace I/O。
- 验证：`node --test tests/query-portfolio.test.mjs`。

## T02 — intake / assemble 双路写入

- 目标：intake 计划合同、全量预检（同源重复失败、跨源合并、既有跳过、ID 冲突）、candidate 生成与 `extensions["geo.qp_intake"]`；assemble draft Query Set 与 `content_sha256_preview`；测试路径经 `preflightTestKnowledgeWrite` + KBASE-bound `test_scope`，真实路径与 M3 一致；幂等 `kept`。
- 验证：专项测试正负例（非法 schema_version、未知 Goal、非 active Source、非法 source_class、空 query_text、同源重复、跨源合并、既有重复、ID 冲突、路径冲突）。

## T03 — report / prefreeze / validate

- 目标：内容键报告工件与覆盖视图；prefreeze gates、期望哈希与覆盖 warning；三层 validate 合并与 drift/coverage warnings；测试工作区追加 test merchant 校验。
- 验证：专项测试（gates 矩阵、hash、warnings、确定性重算、test_only 分支）。

## T04 — CLI 与 E2E

- 目标：`query-portfolio.mjs` 五命令参数解析、JSON stdout、错误码与退出码；知识库缺席 test-only KBASE fixture 与 E2E 全旅程（幂等重跑、formal/冻结模拟、validate 无 error、index 重建、零业务知识对象断言）。
- 验证：`node --test tests/query-portfolio-cli.test.mjs tests/query-portfolio-e2e.test.mjs`。

## T05 — Skill、文档与 Record 收口

- 目标：`geo-query-portfolio` Skill；`package.json` test script；README/docs 导航/CHANGELOG；Record 记录命令、退出码、首次失败与修复、未验证项。
- 验证：Plan §5 全部验收命令；`workspaces/myyshop` 字节不变。
