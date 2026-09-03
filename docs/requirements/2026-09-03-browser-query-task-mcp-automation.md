---
title: Browser Query Task MCP 自动化需求
status: proposed
created: 2026-09-03
source:
  - docs/specs/0006-consumer-answer-testing.md
  - docs/records/2026-09-02-geo-browser-query-task-slice-record.md
  - docs/records/2026-09-03-browser-cowork-communication-research-record.md
  - docs/adr/0002-browser-server-streamable-http-mcp-boundary.md
  - "2026-09-02 当前用户指令：Cowork 生成 Query Set 并启动 GEO Cycle；扩展新建 Query Task、处理登录等待、逐条提交并采集完整回答 HTML"
  - "2026-09-03 用户确认：任务闭环属于浏览器扩展产品；Browser Server Agent 通过 Streamable HTTP MCP 向 Codex 中的 Cowork 提供结果"
scope: Cowork、Browser Server Agent 与 Chrome Extension 的 Query Task 输入、执行、结果提取和 MCP 交接；不授权真实平台自动执行或发布
---

# Browser Query Task MCP 自动化需求

## 1. 问题

Cowork 已能生成并冻结 Query Set、创建和启动 GEO Cycle；Chrome 扩展已有 loopback fixture 上的逐条 Query 执行能力，但当前实现仍由 Cowork loopback 服务拥有任务状态，并由扩展直接调用自定义 HTTP `start/complete/fail/retry`。这与已确认的产品边界不一致：Browser Query Task 应在浏览器产品内部闭环，Cowork 只提供冻结输入并获取结果。

同时，当前扩展只保存 answer text 与 Citation，没有形成“完整回答 HTML → Server Agent 可追溯提取 → Cowork canonical M5 物化”的稳定合同；既有插件 Spec 0001 还明确禁止 MCP Server，无法按新方向安装后自动注册 Browser MCP Server。

## 2. 目标

1. Cowork 创建并启动 `GEO Cycle`；Cycle 启动仍锁定精确版本的 frozen Query Set。
2. Cycle 的 Browser 路径由 Cowork 通过 Browser MCP Server 注册不可变 `Cycle Query Input`；人工采集路径继续独立存在。
3. Browser Extension Client 从 Browser Server 选择已注册 Cycle 输入并新建 `Browser Query Task`，任务状态、重试、登录等待与完成均在浏览器产品内部闭环。
4. 每条 Query 使用独立新对话上下文；若平台未登录，任务进入 `waiting_human`，等待人工完成登录后从原 Query 继续，不自动重复提交。
5. 在平台注册自动化许可为 `allowed` 时，Extension Client 获取版本化 DOM selector，输入 Query、提交、等待回答稳定，并保存回答区域完整 HTML、可见文本、Citation、结果 URL 与采集诊断。
6. Browser Server Agent 保存不可变 Query Capture，使用版本化模型、Prompt 与 Schema 生成 Extraction Result，并将结果加入 durable pending queue。
7. 安装在 Codex 中的 geo-expert/Cowork 通过 Codex Host 的 MCP Client 主动读取 pending result，核验 Cycle/Query Set/Query 版本并完成 canonical M5 物化。
8. Cowork 可靠接收 raw 与 extraction 后 acknowledgement；后续分析失败从 Cowork 本地输入重试，不让扩展重新提交 Query。
9. Browser Server 作为同机 Streamable HTTP MCP Server，由插件 `.mcp.json` 注册；Browser Extension Client 不直接连接 Cowork。

## 3. 成功标准

- 浏览器产品在服务重启、扩展 Service Worker 休眠及人工登录暂停后可恢复，且不会不确定地重复提交 Query。
- 一个 Cycle Query Input 可被扩展发现并建立任务，且其 Query 文本、版本和 hash 与 Cowork 注册输入完全一致。
- 每条成功 attempt 都有 create-only raw HTML、capture checksum、Extraction Result provenance 与 pending delivery 状态。
- Cowork 重复读取或重复 acknowledgement 为幂等；不同 bytes 使用同一 capture ID 时 fail loud。
- MCP Tool 输出不默认内联完整 HTML；Cowork 可按 result ID 读取 raw artifact，并可在本地 materialize 后确认接收。
- Fake Model 与本地生成式平台 fixture 跑通端到端；未访问任何真实消费者平台、未调用真实或付费模型。
- 插件安装产物能够注册 Browser MCP Server，Codex 可列出并调用允许的 Tool；旧 `mcpServers` 禁止项被显式修订而非绕过。

## 4. 非目标与授权边界

- 本需求不把 ChatGPT、Gemini、Perplexity、Google AI 或 Claude adapter 从 `manual_only` 自动提升为 `allowed`；真实 DOM 自动执行需要逐平台独立授权与 Record。
- 不读取 cookie、local/session storage、邮箱、账号 ID 或密码；登录只通过最小 DOM 状态判断，凭据始终由人工在平台页面输入。
- 不让 Browser Server Agent 创建 Answer Sample、Source、Review、Aggregation、Evidence、Claim、Publication 或业务结论。
- 不让 Cowork 直接推进 Browser Query Task，也不让 Browser MCP Server自动唤醒 Codex Agent。
- 不包含 commit、push、PR、部署、发布、Chrome Web Store 上架或真实数据迁移。

## 5. 已确认决策

- 规范术语统一为 `GEO Cycle`，不新建 `Circle` 对象。
- Browser Extension Client 只连接 Browser Server；Browser Server 是 MCP Server；Codex Host 是 MCP Host/Client；Cowork Skill 是领域调用方。
- Browser Server 与 Cowork 同机，MCP transport 使用 Streamable HTTP。
- Extension 每条 Query 交付结果并在任务终态交付 Task Summary；Browser Server durable queue，Cowork 主动拉取。
- Browser Server Agent 负责平台中立提取；Cowork 负责项目语义分析与 canonical M5 物化。
