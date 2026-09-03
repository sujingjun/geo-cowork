---
title: Browser Query Task MCP 自动化任务清单
status: implemented
created: 2026-09-03
updated: 2026-09-03
source:
  - docs/plans/2026-09-03-browser-query-task-mcp-automation-plan.md
  - docs/specs/0013-browser-query-task-mcp-automation.md
  - "2026-09-03 Owner 授权按已批准 Plan 开始本地实现"
scope: SDD 批准后按依赖执行的 Browser Server、Extension、Agent、MCP、Cowork 与验收任务
---

# Browser Query Task MCP 自动化任务清单

## T01 — SDD 人工门与红测骨架

- 目标：Owner 审阅并明确批准 PRD/Spec 0013；为 CQI、task state、raw/extraction、MCP、Extension journey、Cowork intake 建立失败测试。
- 成功标准：每条后续行为可追溯到 Spec；测试因能力缺失而红，不因 fixture/依赖错误假红。

## T02 — Browser Server 领域内核与持久化

- 目标：实现 CQI、BQT/Attempt、Capture/Raw、Extraction、Pending/Ack 的 Schema、Repository、revision 和 create-only/幂等规则。
- 验证：正常、重复、bytes 冲突、非法 transition、并发 revision、restart recovery 矩阵。

## T03 — Browser MCP Server

- 目标：实现同机 Streamable HTTP `/mcp`、Spec 0013 Tool、Server instructions、bearer/Host/Origin/size gate 与 modern/legacy compatibility。
- 验证：官方 SDK client integration、未授权/未知 Tool/schema/分页/分块/ack 正负例。

## T04 — Extension Browser Query Task

- 目标：Assistant Panel 选择 CQI/平台并建任务；实现新对话、登录等待与恢复、单 submit、回答稳定、完整 answer outerHTML/Citation capture、checkpoint。
- 验证：loopback DOM fixture 覆盖 logged-out → waiting_human → login → query → capture，以及 submitted-unknown 不重试。

## T05 — Browser Server Agent Extraction

- 目标：实现版本化 extraction profile、Fake/real provider seam、Schema output、provenance 与同 raw 重试。
- 验证：Fake success、invalid schema、model failure、retry 只增加 extraction attempt、不增加 Query Attempt；无真实模型请求。

## T06 — Cowork Result Intake 与 M5 Seam

- 目标：实现 pending list/get/artifact chunks/checksum/local intake/ack，随后接既有 Answer Sample/Citation materializer。
- 验证：版本漂移不 ack、raw 不完整不 ack、重复同步 kept、ack 后 materializer failure 可从本地恢复。

## T07 — 插件 MCP 注册与合同更新

- 目标：新增 `.mcp.json`，更新 Spec 0001、validator、README/CHANGELOG；安装后由 Codex Host 发现 Browser MCP Server Tool。
- 验证：拒绝明文 token/非 loopback URL/未知字段；实际插件安装与 `/mcp` Tool discovery，未访问真实平台。

## T08 — E2E、回归与 Record

- 目标：用 synthetic Workspace、临时 Server DB、loopback平台和 Fake Agent 跑完整 Cycle input → Browser task → MCP result → Cowork M5 materialization；执行故障矩阵和全部回归。
- 验证：Plan §4 全部通过；真实 MyyShop 字节不变；Record 分开记录自动化工程验证、真实 Chrome UI、真实平台许可、真实模型、发布和部署边界。
