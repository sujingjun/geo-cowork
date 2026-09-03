---
title: Chrome 扩展与 Cowork 通信方式研究记录
status: verified
created: 2026-09-03
updated: 2026-09-03
source:
  - https://modelcontextprotocol.io/specification/2026-07-28/architecture
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/transports
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
  - https://developer.chrome.com/docs/extensions/develop/concepts/network-requests
  - https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle
  - https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging
  - https://developers.openai.com/codex/mcp
  - plugins/geo-expert/scripts/browser-query-task.mjs
  - plugins/geo-browser-extension/extension/query-task-client.js
  - plugins/geo-browser-extension/extension/manifest.json
  - docs/specs/0001-plugin-package-contract.md
  - "2026-09-03 当前 grill-with-docs 会话：扩展拥有 Browser Query Task；逐 Query 推送 Query Capture，任务结束提交摘要"
  - "2026-09-03 Owner 决定：不采用自定义 HTTP 接口；本次启用 Cowork MCP 服务，由浏览器产品 Server Agent 打通 MCP 通信"
  - "2026-09-03 Owner 澄清：Browser Extension Client 只连接 Browser Server Agent；Server Agent 通过 MCP 连接 Cowork"
  - "2026-09-03 Owner 确认：Browser Server 与 Cowork 同机；Browser Server 是 Streamable HTTP MCP Server，由安装在 Codex 中的 geo-expert/Cowork 调用"
  - "2026-09-03 Owner 确认：Browser Server Agent 提取并排队结果；Cowork 主动拉取并负责项目语义分析与 canonical 物化"
scope: Chrome MV3 扩展与本地 Cowork 的 Query Capture 通信方式研究；不批准实现、外部访问、MCP Server 或发布
workspace: /Users/sujingjun/geo-cowork
branch: main
baseline: 7da911728c75d4babe30cb09614eadd117169f0b; local HEAD ahead of origin/main by 4; no fetch
---

# Chrome 扩展与 Cowork 通信方式研究记录

## 1. 结论

MCP 技术上可以承载扩展侧向 Cowork 提交 `Query Capture`。研究建议原为第一版沿用 `127.0.0.1` loopback HTTP POST；Owner 已在研究后明确否决自定义 HTTP 接口，并决定本次启用 Cowork MCP 服务，由浏览器产品的 Server Agent 打通 MCP 通信。

`Query Capture` 合同仍须独立于 MCP transport。已确认运行拓扑为同机三层：Browser Extension Client 连接 Browser Server Agent；Browser Server 暴露 Streamable HTTP MCP endpoint；Codex Host 管理 MCP Client，安装其中的 geo-expert/Cowork 工作流调用该 Server。

## 2. 已核验事实

### 2.1 当前仓库

- 当前本地服务只绑定 `127.0.0.1`，校验 Chrome extension Origin 和临时 Bearer token，并通过普通 JSON HTTP 暴露任务接口（`plugins/geo-expert/scripts/browser-query-task.mjs:28-175`）。
- 当前扩展使用 `fetch()` 调用该 loopback 服务（`plugins/geo-browser-extension/extension/query-task-client.js:1-66`），Manifest 已仅授权 `http://127.0.0.1/*`（`plugins/geo-browser-extension/extension/manifest.json:13-21`）。
- 当前服务仍拥有 `start/complete/fail/retry` 状态推进，与本次已确认的“任务闭环在扩展内部”目标不一致；后续需要把服务收窄为 Cycle/Query 输入读取与 Capture 接收，而不是原样沿用现有接口。
- 当前插件合同明确禁止 Manifest 出现 `mcpServers`，既有架构也不以 MCP 为前置条件（`docs/specs/0001-plugin-package-contract.md:48`）。采用 MCP Server 需要独立修改上游架构与合同，不能当成内部重命名。

### 2.2 MCP 2026-07-28

- 当前正式规范使用 Host–Client–Server 架构；Host 管理 Client、权限和 AI 集成，一个 Client 对应一个 Server，Server 暴露 Tool、Resource 与 Prompt。[MCP Architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture)
- `2026-07-28` 核心协议已无状态化，每个请求自描述，不再依赖旧版 `initialize/initialized` 与 `Mcp-Session-Id`。业务关联仍需显式传递 `cycle_ref`、`task_id`、`query_ref` 和 `capture_id`。[MCP 2026-07-28 release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- 标准 transport 是 stdio 与 Streamable HTTP；Streamable HTTP 中每条消息是发往单一 MCP endpoint 的 HTTP POST，响应是 JSON 或仅属于该请求的 SSE 流。[MCP Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- 若扩展与 Cowork 直接通信，角色才会是“扩展 = MCP Client、Cowork = MCP Server”；Owner 已明确不采用该两层形态。实际三层形态中，Browser Server 是 MCP Server，Codex Host 是 MCP Host/Client，Cowork Skill 是领域调用方。MCP Server 不能在没有 Client 请求的情况下主动唤起 Cowork Agent，因此结果需要由 Cowork Tool 调用读取，或由独立调度机制触发读取。[MCP message direction](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports#messages)
- MCP 定义消息、能力和 transport，不定义本项目需要的 Outbox、幂等去重、重试、不可变 Capture、任务恢复或 exactly-once 交付；这些仍是应用合同。
- HTTP MCP 的授权是可选能力；一旦采用规范授权，完整模型涉及 OAuth Resource Server、OAuth Client、授权服务器发现、PKCE 与 scope。对单机固定配对而言，该能力当前没有抵消其引入成本。[MCP Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)

### 2.3 Chrome MV3

- 扩展页面或 Service Worker 在具备对应 `host_permissions` 后可以跨 origin `fetch()`；因此当前 loopback POST 是 Chrome 官方支持路径。[Chrome cross-origin requests](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests)
- MV3 Service Worker 可能在空闲 30 秒后终止，单次 `fetch()` 响应超过 30 秒也可能终止；全局变量不能承担可靠状态，关键结果应先持久化再发送。[Chrome service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- Native Messaging 可避免监听端口，并由 Chrome 启动注册的 native host；但需要 `nativeMessaging` 权限、操作系统级 host manifest 与精确 `allowed_origins`，安装和跨平台维护成本更高。[Chrome Native Messaging](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)

## 3. 方案比较

| 方案 | 当前匹配度 | 主要收益 | 主要代价 |
| --- | --- | --- | --- |
| loopback HTTP POST | 高 | 与逐条提交、快速 ACK、现有权限和代码直接匹配 | 需要服务发现、配对 token、Origin、Outbox 与重试 |
| MCP Streamable HTTP | 中 | Tool Schema 标准化，未来可供多个 MCP Host 复用 | 可靠交付仍需自建；新增协议、SDK、版本与合同成本 |
| Chrome Native Messaging | 中 | 无监听端口；Chrome 管理 native host 连接 | 需要系统安装注册与跨平台打包；不直接等于 MCP stdio |

## 4. 研究阶段建议（Owner 未采用）

```text
Extension-owned Task
  → 先把 Query Capture 写入 Extension Outbox
  → POST /api/v1/query-captures 到 127.0.0.1
  → Cowork 校验关联、checksum 与幂等键后原子保存
  ← ACK: accepted | duplicate | conflict
  → Extension 仅在 accepted/duplicate 后标记 delivered
```

建议 ACK 快速结束，不在同一个 HTTP 请求内等待 Agent 分析。Cowork 持久化后再触发分析；分析失败不应让扩展重新采集或重复提交平台 Query。

Owner 已选择本次直接建设 MCP 通信；上面的 HTTP 形态只保留为本次 trade-off 记录，不再作为待实施建议。

建议至少冻结以下传输无关关联字段：`schema_version`、`cycle_ref/version`、`query_set_ref/version`、`browser_task_id`、`query_ref/version`、`attempt_id`、`capture_id`、`platform/profile`、`outcome`、`captured_at`、raw artifact descriptors 与 payload checksum。

### 4.1 Owner 确认的 MCP 拓扑

```text
Browser Extension Client
  ↔ Browser Server Agent + Browser MCP Server
  ↔ MCP Streamable HTTP（同机）
  ↔ Codex Host MCP Client
  ↔ geo-expert / Cowork Skill
```

按 OpenAI 官方 Codex MCP 文档，Codex Host 支持注册 Streamable HTTP Server；安装插件可通过 `.mcp.json` 捆绑 MCP Server 配置。这里的“Cowork 是 Client”是领域口径，协议上的 MCP Client 生命周期由 Codex Host 管理。

## 5. 已确认的结果边界

- Browser Extension Client 将每条 Query 的完整 HTML 作为 raw artifact 交给 Browser Server Agent，不把大段 HTML 内联为 Cowork Tool 的默认列表结果。
- Browser Server Agent 形成带模型、Prompt 与 Schema 版本的 Extraction Result，并与 raw capture 一起进入 durable pending queue。
- Cowork 通过 MCP Tool 主动列出、读取和确认结果；MCP Server 不负责自动唤醒 Codex/Cowork。
- Cowork 在确认 Cycle/Query Set/Query 版本和 raw/extraction provenance 后，负责项目语义分析与 canonical M5 物化。
- acknowledgement 只表示 Cowork 已将 raw 与 extraction 可靠接收；后续语义分析失败从 Cowork 本地输入重试，不要求浏览器重新提交 Query。

本 Record 验证通信技术事实并记录已确认的职责边界；它不表示真实平台自动化、具体 MCP Tool Schema、认证方案、发布或部署已经批准。
