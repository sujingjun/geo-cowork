---
title: Knowledge-Independent GEO Lifecycle Readiness 任务清单
status: implemented
created: 2026-09-02
updated: 2026-09-02
source:
  - docs/specs/0012-knowledge-independent-lifecycle-readiness.md
  - docs/plans/2026-09-02-knowledge-independent-lifecycle-readiness-plan.md
scope: T01—T08 本地实现与验收
---

# Knowledge-Independent GEO Lifecycle Readiness 任务清单

## T01 — 基线与 SDD

- 当前状态：`verified`。
- 成功标准：Git/M6/M7/M8/Query/Analytics/Workspace/deferred 状态有证据；ADR 与批准链完整。
- 验证：Git 命令、文档链接检查。

## T02 — 单 Merchant 与 test-only KBASE

- 当前状态：`verified`。
- 成功标准：创建 MyyShop development-test Workspace；线上 locator/Analytics 配置一致；synthetic 对象绑定 KBASE；旧 test_merchant 实现删除。
- 验证：身份、跨 KBASE、自动转正、symlink/secret/PII 负例。

## T03 — Query Portfolio 复核

- 当前状态：`verified`。
- 成功标准：生成、去重、聚类、优先级、人工决定、冻结及知识缺席场景通过；修复 Record NUL。
- 验证：`npm run test:query-portfolio`。

## T04 — Readiness

- 当前状态：`verified`。
- 成功标准：真实 MyyShop 只读报告；不创建 Cycle；Goal-slice 闭包与知识缺席语义正确。
- 验证：Readiness 正负例、运行前后文件 digest。

## T05 — Analytics 与业务文件

- 当前状态：`implemented`；fixture/injected/安全测试全部通过，真实 `collect-observe` 因 ADC 需要交互式重新登录而在网络前停止；没有真实业务文件。
- 成功标准：GA4/GSC → ANO → BSIG → candidate EVD；JSON/CSV adapter；无自动批准/因果/PII。
- 验证：injected requester、文件 adapter、授权漂移、幂等与冲突测试；当次授权真实 smoke。

## T06 — synthetic Cycle 1/2 与 M7 QA

- 当前状态：`verified`；见独立 QA Record。
- 成功标准：同一 MyyShop Merchant + test-only KBASE 完成双 Cycle、人工选择、恢复和污染负例；新增独立 QA Record。
- 验证：`npm run test:m6-cycle`、`npm run test:m7-strategy`、完整 E2E。

## T07 — M8 Cross-host Conformance

- 当前状态：`verified`；required tier 范围，native/manual optional 未执行。
- 成功标准：required executions 通过，optional/unsupported 边界准确，差异和敏感输入 fail loud。
- 验证：`npm run test:m8-conformance`。

## T08 — 最终验收与 Runbook

- 当前状态：`implemented`；最终全量 333/333 通过，等待 T05 外部 ADC 门收口后决定是否提升整体 Task。
- 成功标准：Knowledge-Independent readiness Record、真实启动 Runbook、所有未验证边界及 Git 状态完整。
- 验证：完整测试、docs/plugin 校验、真实 Workspace 只读回归。
