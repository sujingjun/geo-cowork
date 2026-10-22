---
title: geo-cowork 知识库导航
kind: index
status: verified
sources:
  - docs/records/2026-10-22-myyshop-initial-knowledge-curation-record.md
  - docs/tasks/2026-10-22-myyshop-initial-knowledge-curation.md
  - docs/plans/2026-10-22-myyshop-initial-knowledge-curation-plan.md
  - docs/plans/2026-10-19-source-monitoring-and-query-discovery-plan.md
  - docs/requirements/2026-10-18-geo-user-journey-and-loop-discovery.md
  - docs/records/2026-10-17-myyshop-geo-full-flow-audit.md
  - docs/records/2026-10-17-oneglanse-mcp-integration-record.md
  - docs/plans/2026-10-17-oneglanse-mcp-integration-plan.md
  - docs/records/2026-10-17-oneglanse-boundary-workspace-cleanup-record.md
  - docs/records/2026-10-17-oneglanse-mcp-planning-record.md
  - docs/specs/0015-authorized-real-two-cycle.md
  - docs/records/2026-09-20-authorized-real-two-cycle-record.md
  - docs/plans/2026-09-16-knowledge-driven-geo-e2e-plan.md
  - AGENTS.md
  - CONTEXT.md
  - CONTEXT-MAP.md
  - docs/workflow.md
  - docs/README.md
  - docs/plans/2026-08-23-geo-cowork-final-product-plan.md
  - docs/prd/2026-09-04-authorized-real-geo-cycle.md
  - docs/plans/2026-09-04-real-cycle-blocker-closure-plan.md
  - docs/tasks/2026-09-04-real-cycle-blocker-closure.md
  - docs/records/2026-09-04-real-cycle-blocker-closure-planning-record.md
  - docs/records/2026-09-02-myyshop-real-cycle-readiness-report.md
  - workspaces/myyshop/STATUS.md
  - docs/records/2026-08-24-m2-contract-provenance-kernel-record.md
  - docs/records/2026-08-24-m3-knowledge-query-operating-system-record.md
  - docs/records/2026-08-24-m3-business-object-approval-record.md
  - docs/handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md
  - docs/specs/0005-diagnosis-site-asset-proposal.md
  - docs/plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md
  - docs/records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md
  - docs/handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md
  - docs/records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md
  - docs/records/2026-08-25-m5-source-system-and-collector-design-record.md
  - docs/records/2026-08-25-m5-offline-consumer-answer-testing-record.md
  - docs/records/2026-08-25-m5-playwright-runtime-and-platform-guard-record.md
  - docs/records/2026-08-25-m5-chatgpt-manual-smoke-record.md
  - docs/records/2026-08-25-m5-gemini-manual-smoke-record.md
  - docs/requirements/2026-08-25-platform-automation-permission-backlog.md
  - docs/specs/0006-consumer-answer-testing.md
  - docs/plans/2026-08-24-m5-consumer-answer-testing-plan.md
updated: 2026-10-22
---

# geo-cowork 知识库导航

本页是 `docs/wiki/` 的固定导航起点，只收录可追溯的导航摘要；规范、批准、实现或验证的原始证据以各 canonical 文档与实际工作区为准，规则见 [`../workflow.md`](../workflow.md) 第 2 章。

## Wiki 页面索引

| 页面 | kind | status | updated |
| --- | --- | --- | --- |
| [index.md](index.md)（本页） | index | verified | 2026-10-22 |
| [OneGlanse 对接](oneglanse-integration.md) | architecture | implemented | 2026-10-17 |
| [正式真实双周期](real-cycles.md) | product | implemented | 2026-10-17 |

新 Wiki 页面按 `docs/workflow.md` 第 2 章 Frontmatter 要求建档后加入本索引；原始来源变更而未同步时须标明过期或更新 `updated`。

## 当前正式真实周期

见[正式真实双周期导航](real-cycles.md)。当前下一行动以2026-09-20批准Plan与实际preflight为准；下方旧专题入口保留历史追溯。

## Canonical 入口

- 初始知识整理：[MyyShop 初始品牌知识库整理计划](../plans/2026-10-22-myyshop-initial-knowledge-curation-plan.md)（approved；英文主版、中文对照，沿用现状）；[执行记录](../records/2026-10-22-myyshop-initial-knowledge-curation-record.md)记录 120 个逻辑条目、来源覆盖、补证及验证。默认入口为[英文知识库](../../workspaces/myyshop/knowledge/README.md)，知识事实仍待业务确认。
- 当前访谈草案：[GEO 用户旅程与持续循环](../requirements/2026-10-18-geo-user-journey-and-loop-discovery.md)（proposed；Q1–Q51 核心选择已收敛，GA4 自动读取注册信号，接入时创建飞书智能体与对应人员的异常通知群；第 9 节列出落地清单，实际能力待验收）
- 信源覆盖与分流：[信源监控、舆情与 Query 发现](../plans/2026-10-19-source-monitoring-and-query-discovery-plan.md)（proposed；需求信源日常检查与消费者答案周采样分开，实际接入及调度待落实）

- 仓级规则：[`../../AGENTS.md`](../../AGENTS.md)
- 工作流规范：[`../workflow.md`](../workflow.md)
- 文档导航：[`../README.md`](../README.md)
- 领域上下文：[`../../CONTEXT-MAP.md`](../../CONTEXT-MAP.md)
- 当前批准产品基线：[`../plans/2026-08-23-geo-cowork-final-product-plan.md`](../plans/2026-08-23-geo-cowork-final-product-plan.md)
- Authorized-real/v1 PRD：[`../prd/2026-09-04-authorized-real-geo-cycle.md`](../prd/2026-09-04-authorized-real-geo-cycle.md)（`proposed`）
- 当前下一行动计划：[`../plans/2026-09-16-knowledge-driven-geo-e2e-plan.md`](../plans/2026-09-16-knowledge-driven-geo-e2e-plan.md)（`approved`）
- 当前任务图：[`../tasks/2026-09-16-knowledge-driven-geo-e2e.md`](../tasks/2026-09-16-knowledge-driven-geo-e2e.md)
- 当前规划记录：[`../records/2026-09-04-real-cycle-blocker-closure-planning-record.md`](../records/2026-09-04-real-cycle-blocker-closure-planning-record.md)（`verified`；仅规划范围）
- MyyShop 当前状态：[`../../workspaces/myyshop/STATUS.md`](../../workspaces/myyshop/STATUS.md)
- Real Cycle Readiness：[`../records/2026-09-02-myyshop-real-cycle-readiness-report.md`](../records/2026-09-02-myyshop-real-cycle-readiness-report.md)
- M2 本地验收：[`../records/2026-08-24-m2-contract-provenance-kernel-record.md`](../records/2026-08-24-m2-contract-provenance-kernel-record.md)
- M3 本地验收：[`../records/2026-08-24-m3-knowledge-query-operating-system-record.md`](../records/2026-08-24-m3-knowledge-query-operating-system-record.md)
- M3 业务对象批准：[`../records/2026-08-24-m3-business-object-approval-record.md`](../records/2026-08-24-m3-business-object-approval-record.md)
- M4 启动边界：[`../handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md`](../handoff/2026-08-24-m4-diagnosis-site-asset-proposal-handoff.md)
- M4 已批准系统规格：[`../specs/0005-diagnosis-site-asset-proposal.md`](../specs/0005-diagnosis-site-asset-proposal.md)
- M4 已批准实施计划：[`../plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md`](../plans/2026-08-24-m4-diagnosis-site-asset-proposal-plan.md)
- M4 本地离线验收：[`../records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md`](../records/2026-08-24-m4-diagnosis-site-asset-proposal-record.md)
- M2–M4 整体优化与 M5 进入门：[`../handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md`](../handoff/2026-08-24-m2-m4-integrated-optimization-handoff.md)
- M2–M4 独立评审与 M5 进入门结论：[`../records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md`](../records/2026-08-24-m2-m4-completeness-and-m5-entry-gate-review.md)
- M5 持续信源与 Playwright/真实采集设计修订记录：[`../records/2026-08-25-m5-source-system-and-collector-design-record.md`](../records/2026-08-25-m5-source-system-and-collector-design-record.md)
- M5 离线工程验收：[`../records/2026-08-25-m5-offline-consumer-answer-testing-record.md`](../records/2026-08-25-m5-offline-consumer-answer-testing-record.md)
- M5 Playwright 与平台条款门验收：[`../records/2026-08-25-m5-playwright-runtime-and-platform-guard-record.md`](../records/2026-08-25-m5-playwright-runtime-and-platform-guard-record.md)
- M5 ChatGPT 人工 Smoke：[`../records/2026-08-25-m5-chatgpt-manual-smoke-record.md`](../records/2026-08-25-m5-chatgpt-manual-smoke-record.md)
- M5 Gemini 人工 Smoke：[`../records/2026-08-25-m5-gemini-manual-smoke-record.md`](../records/2026-08-25-m5-gemini-manual-smoke-record.md)
- M5 Google AI 人工共享 Smoke：[`../records/2026-08-26-m5-google-ai-manual-share-smoke-record.md`](../records/2026-08-26-m5-google-ai-manual-share-smoke-record.md)
- M5 Claude CN/US 人工共享基线记录：[`../records/2026-08-26-m5-claude-manual-share-smoke-record.md`](../records/2026-08-26-m5-claude-manual-share-smoke-record.md)
- M5 Perplexity 用户导出 Markdown Smoke：[`../records/2026-08-26-m5-perplexity-user-export-smoke-record.md`](../records/2026-08-26-m5-perplexity-user-export-smoke-record.md)
- 平台许可需求池条目：[`../requirements/2026-08-25-platform-automation-permission-backlog.md`](../requirements/2026-08-25-platform-automation-permission-backlog.md)
- M5 approved Spec：[`../specs/0006-consumer-answer-testing.md`](../specs/0006-consumer-answer-testing.md)
- M5 approved Plan：[`../plans/2026-08-24-m5-consumer-answer-testing-plan.md`](../plans/2026-08-24-m5-consumer-answer-testing-plan.md)

其他文档类别目录（架构、需求、PRD、原型、Spec、Plan、Task、Record、Runbook、Release、复盘、经验、Handoff）在首次出现 canonical 文档时创建，并由 `docs/README.md` 导航。

## 2026-09-16 历史工程验收入口

[知识驱动 GEO 全流程计划](../plans/2026-09-16-knowledge-driven-geo-e2e-plan.md) 是当前 Owner 已要求实施的任务；旧真实周期 roadmap 已归档。自定义模型只保留切换配置，本次真实提取使用 DeepSeek。

最终工程验收已完成：两个演练周期共 240 个真实模型提取槽，三个真实平台各一次采集，GSC 718 行。见 [实施记录](../records/2026-09-16-knowledge-driven-geo-e2e-record.md) 与 [能力边界](../records/2026-09-16-geo-capability-matrix.md)。
