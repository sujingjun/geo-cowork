---
title: GA4/GSC 真实只读分析接入任务
status: approved
created: 2026-09-01
updated: 2026-09-01
source:
  - docs/plans/2026-09-01-ga4-gsc-readonly-analytics-plan.md
  - docs/specs/0010-ga4-gsc-readonly-analytics.md
scope: 当前会话内的 TDD、实现、验证、真实 smoke 与 Record
---

# GA4/GSC 真实只读分析接入任务

## T01 — 授权与计划冻结

- 成功标准：精确资源、scope、日期、字段、临时产物、过期与停止条件有 Workspace 决定；计划 pin 其 checksum。
- 范围外：凭据与业务数值入仓。
- 验证：preflight 正负例。

## T02 — adapter 与归一化 TDD

- 成功标准：测试先因公开 seam 缺失失败；最小实现生成 exact GA4/GSC 请求并严格解析响应。
- 验证：`node --test tests/analytics-readonly.test.mjs`。

## T03 — CLI、安全门与向导 TDD

- 成功标准：dry-run 断网可用；真实读取需双开关、授权、ADC 和安全 output；向导不把凭据写入仓库。
- 验证：CLI 测试、`bash -n`、`shellcheck`。

## T04 — 回归与真实 smoke

- 成功标准：专项/全量/插件/文档/Workspace 只读检查通过；两个 API 均完成一次指定聚合请求，或精确记录外部阻塞。
- 验证：Plan 第 5 章命令与 live result 结构检查。

## T05 — Record 收口

- 成功标准：记录 checkout、branch/HEAD、dirty/remote、实际命令、退出码、row count/checksum、临时文件处置、未验证项和外部门。
- 范围外：commit、push、PR、发布、业务效果结论。

