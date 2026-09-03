---
title: Browser Query Task MCP 自动化实施计划
status: approved
created: 2026-09-03
updated: 2026-09-03
source:
  - docs/specs/0013-browser-query-task-mcp-automation.md
  - docs/prd/2026-09-03-browser-query-task-mcp-automation.md
  - docs/architecture/2026-09-03-browser-query-task-mcp-automation-architecture.md
  - docs/records/2026-09-03-browser-cowork-communication-research-record.md
  - "2026-09-03 Owner 明确批准 PRD、Spec 0013 和 Plan，并授权开始本地实现"
scope: Browser Server MCP、任务持久化、Extension 执行、Agent 提取、Cowork 物化 seam、插件注册与离线验收
---

# Browser Query Task MCP 自动化实施计划

## 1. 目标与当前差距

目标是跑通一个不访问真实平台、不调用真实模型的纵向切片：Cowork 注册 active Cycle/frozen Query Set → 扩展新建任务 → fixture 登录等待/逐条 Query/完整回答 HTML → Browser Server Agent Fake extraction → MCP pending result → Cowork 接收并 materialize M5 fixture。

| 当前事实 | 目标差距 |
| --- | --- |
| loopback task service 由 Cowork 持有任务状态 | Task 应由 Browser Server durable 持有，Extension 执行，Cowork 只提供输入/消费结果 |
| Extension 直接调用 `/api/task/start|complete|fail` | Client 只连接 Browser Server 产品接口；Cowork 只通过 MCP 调 Server |
| 只保存 answer text/Citation | 缺回答根完整 HTML、raw artifact、Agent extraction provenance 与 pending queue |
| geo-expert 无 `.mcp.json`，validator 明确禁 MCP | 需要 Browser MCP Server 注册、插件合同与 validator 更新 |
| Browser Server 使用 AI SDK provider，但无 Query extractor | 需要独立 Schema-first extractor 与 Fake Model 注入 |
| Cowork 没有 Browser result materializer | 需要 MCP intake bundle、checksum 校验、ack 与既有 M5 materializer 接线 |

## 2. 实施顺序

### Slice A — SDD 批准与红测

Owner 审阅 Requirement、PRD、Architecture、Spec 0013、Plan 与 Task；只有 PRD/Spec 明确批准后进入代码。先建立 MCP、Server store、Extension journey、Agent extraction、Cowork materialization 的失败测试。

### Slice B — Browser Server 任务与结果内核

新增 Cycle Query Input、Browser Task/Attempt、Raw Artifact、Extraction、Pending/Ack 的类型、Schema、Repository 与状态机；复用现有 Drizzle/数据库，不引入新数据库。所有写入先校验、create-only raw、revision mutation、稳定错误码。

### Slice C — Streamable HTTP MCP Server

引入官方 TypeScript MCP SDK v2 的 Server/Node adapter，锁定 exact package version；新增 `/mcp` Nitro route、bearer/Host/Origin/size gate 与 Spec 0013 §9 Tool。先只接 Fake repositories 跑 modern/legacy in-process integration，再接真实 Server repository。

### Slice D — Extension Client Task

Assistant Panel 改为连接 Browser Server、列出 Cycle Query Input、创建任务并显示 task/query/attempt 状态。将页面执行从当前 Cowork task client 解耦；实现新对话、最小登录 detector、`waiting_human` 恢复、单 submit、回答稳定、answer root outerHTML/Citation capture 和 client checkpoint。

真实平台继续 `manual_only`；DOM automation 正向测试只接 loopback fixture。

### Slice E — Browser Server Agent

建立单一 extraction entrypoint，复用现有 AI provider factory，输出经 Zod/JSON Schema 验证。测试默认 Fake Extractor；覆盖 invalid output、model error、从同一 raw 重试、provenance/checksum。没有当次模型授权不运行真实 provider。

### Slice F — Cowork MCP 消费与 canonical seam

在 geo-expert 新增确定性 Browser result intake/materializer：list/get/raw chunks/checksum/create-only local intake/ack，随后复用 M5 Answer Sample/Citation materializer。版本漂移或 bytes 冲突不 ack；ack 后 M5 失败从本地 intake 重试。

### Slice G — 插件包装

新增 `plugins/geo-expert/.mcp.json`，只登记同机 URL 和 `GEO_BROWSER_MCP_TOKEN` 变量名；修改 Spec 0001、validator、README/CHANGELOG/Marketplace 验收。不得提交 token 值。用实际 Codex plugin 安装路径验证 Server/Tool 可发现，但不调用真实平台。

### Slice H — 纵向 E2E 与收口

使用临时数据库、loopback generative fixture、Fake Extractor 和 synthetic/test-only Workspace 跑完整旅程；注入 Extension/Server/Agent/Cowork 中断，验证恢复和不重复提交。运行根全量、扩展测试/build/typecheck/lint、plugin/docs、MyyShop 字节不变；新增 Record，分别报告 implemented、automated verified 与仍未完成的真实 Chrome/真实平台/真实模型门。

## 3. 目标文件

预计新增：

- `plugins/geo-browser-extension/server/routes/mcp.post.ts`
- `plugins/geo-browser-extension/server/utils/browser-query/` 下 types、constants、schemas、repositories、state、mcp-tools、extractor
- `plugins/geo-browser-extension/shared/types/browser-query.ts`
- `plugins/geo-browser-extension/extension/` 下 Browser Server client、task controller、platform adapter/checkpoint 模块
- `plugins/geo-expert/.mcp.json`
- `plugins/geo-expert/scripts/browser-query-result.mjs`
- `plugins/geo-expert/scripts/lib/browser-query-result.mjs`
- Server/MCP/Extension/Cowork 专项测试与 fixture
- `docs/records/2026-09-03-browser-query-task-mcp-automation-record.md`

预计修改：

- Browser Server DB schema/migration、`package.json`/lockfile、Nuxt runtime config
- Side Panel HTML/CSS/JS、extension manifest/build script、fixture server
- geo-expert Spec 0001、validator、README、CHANGELOG、根 `package.json` 与 docs navigation

任何文件超过 500 行或混合职责时按 AGENTS.md 拆分；不重构无关站点、聊天、商店或 M2—M8 模块。

## 4. 验证门

最低检查：

```bash
node --test tests/browser-query-task*.test.mjs
pnpm --dir plugins/geo-browser-extension test:extension
pnpm --dir plugins/geo-browser-extension typecheck
pnpm --dir plugins/geo-browser-extension build:extension
npm test
npm run validate:plugin
npm run check:docs
node plugins/geo-expert/scripts/workspace-validate.mjs --workspace workspaces/myyshop --objects
node plugins/geo-expert/scripts/build-index.mjs --workspace workspaces/myyshop --check
git status --porcelain workspaces/myyshop
git diff --check
```

还必须有：MCP auth/modern/legacy Tool integration、fixture DOM journey、Agent Fake schema、pending/ack conflict、crash matrix、no-real-network/no-real-model 与已安装插件 Tool discovery 证据。

## 5. 停止条件与授权

- PRD/Spec 0013 未获 Owner 明确批准；
- 需要把任一真实平台从 `manual_only` 提升为 `allowed`；
- 需要真实或付费模型、真实账号、cookie/storage、生产数据库或外部服务；
- 需要新增远端监听、OAuth、部署、发布、Chrome Web Store、commit、push 或 PR；
- Browser Server 必须复制 Cowork 的 M5 业务语义才能继续；
- `workspaces/myyshop` 出现非预期写入，或全量回归失败且无法在当前范围内修复。

上述情况停止受影响 Slice 并记录，不静默扩大授权。
