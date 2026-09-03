# GEO Browser Assistant

本目录包含 Browser Server 与 Chrome Manifest V3 Extension Client。Browser 产品拥有 `Browser Query Task`、逐条 attempt、raw capture、Extraction Result 与 pending delivery；Cowork 只注册 active GEO Cycle 的冻结输入并消费结果。

## 运行结构

```text
Cowork active GEO Cycle / frozen Query Set
  → Codex Host 调用 Browser MCP Server 注册 Cycle Query Input
  → Extension Client 选择输入并创建 Browser Query Task
  → 人工登录接管 / loopback DOM automation
  → Browser Server 保存 answer outerHTML + text + Citation
  → Fake 或显式注入的 Extractor
  → pending result
  → Cowork 分块读取、可靠保存、ack、M5 materialization
```

Extension Client 只连接 Browser Server 的产品 API，不直接读取 Workspace，也不充当 MCP Client。Browser MCP endpoint 是同机 `http://127.0.0.1:4319/mcp`；Codex Host 管理实际 MCP Client。

## 1. 本地 Server

先安装与迁移：

```bash
cd plugins/geo-browser-extension
pnpm install --frozen-lockfile
pnpm db:migrate
```

为本地开发设置两个不同的高熵 token。值只放环境变量，不写 `.env.example`、Workspace、Extension storage 或 Git：

```bash
GEO_BROWSER_PRODUCT_TOKEN=<extension-product-token> \
GEO_BROWSER_MCP_TOKEN=<codex-mcp-token> \
GEO_BROWSER_EXTRACTOR_MODE=fake \
NUXT_SESSION_PASSWORD=<local-session-password-at-least-32-chars> \
pnpm dev:browser-query
```

- `GEO_BROWSER_PRODUCT_TOKEN` 由用户临时填入 Side Panel，只保留在当前页面内存。
- `GEO_BROWSER_MCP_TOKEN` 由 Codex 通过插件 `.mcp.json` 的 `bearer_token_env_var` 读取。
- `GEO_BROWSER_EXTRACTOR_MODE=fake` 只用于离线开发；未显式设置时 extractor fail closed。真实模型需要另行授权和 provider 实现。
- `/mcp` 与 `/api/browser-query/**` 只对各自 bearer 通道关闭 cookie-CSRF；两者仍校验 loopback Host、Origin 规则、请求大小与 Schema。

## 2. Cycle 输入与任务

Cowork 通过 MCP Tool `register_cycle_query_input` 发布精确版本的 active Cycle、frozen Query Set、Query 文本/hash、Collector Profile 与许可快照。注册只创建不可变 `Cycle Query Input`，不创建或推进 Browser Query Task。

在 Side Panel 中：

1. 填入 `http://127.0.0.1:4319` 与 Product token；
2. 连接并选择已注册 Cycle / Query Set；
3. 新建 Browser Query Task；
4. 点击“开始本条”。每条 Query 都打开一个新标签页；
5. 未登录时进入 `waiting_human`，人工完成登录后点击“继续”；
6. `manual_assist` 由人工提交并提供回答根 HTML；`dom_automation` 只在 adapter 与许可快照都为 `allowed` 时执行；
7. 提交状态未知时不自动重试；只有明确的 `system_failure` 可以创建新 attempt。

Browser Server 是 durable authority；Extension 的 `chrome.storage.local` 只保存当前 tab/attempt/stage checkpoint，不保存 token、cookie、storage、账号 ID 或凭据。

## 3. 构建 Extension

```bash
pnpm test:extension
pnpm build:extension
```

在支持命令行加载 Extension 的 Chrome for Testing/Chromium 中加载 `.output/extension`。当前 branded Chrome 可能忽略 `--load-extension`；日常 Chrome Profile 的“加载已解压扩展程序”仍是独立人工 UI 门。

回答采集只保存当前 answer root 的 `outerHTML`、可见文本、Citation occurrence、result URL 和 detector diagnostics，不保存整页 DOM、sidebar/history/account UI，也不通过 `innerHTML` 回显原始内容。

## 4. 验证

```bash
pnpm test:browser-query
pnpm test:extension
pnpm typecheck
pnpm build:extension
GEO_BROWSER_MCP_TOKEN=<token> \
GEO_BROWSER_PRODUCT_TOKEN=<token> \
pnpm smoke:browser-query
```

`smoke:browser-query` 只连接 loopback Server，使用 synthetic CQI、Fake Extractor 与 synthetic answer HTML；设置 `GEO_BROWSER_MCP_NEGOTIATION=legacy` 可复核 2025-era stateless 兼容。Fixture 页面由 `pnpm fixture:extension` 启动。

## 边界

- ChatGPT、Gemini、Perplexity、Google AI、Claude adapter 继续为 `manual_only`；登录状态不能提升自动化许可。
- Browser Server 不读取 Cowork Workspace，不创建 Answer Sample、Review、Source Classification、Evidence、Claim 或业务结论。
- acknowledgement 只表示 Cowork 已可靠保存 raw/extraction，不表示 Review、Cycle 完成、发布或业务效果。
- `plugins/geo-expert/scripts/browser-query-task.mjs` 是 Spec 0013 前的 Workspace-owned 最小切片兼容入口；新 Browser-owned Task 不再由该脚本推进。
- 未经单独授权，不调用真实平台、真实/付费模型，不发布 Extension，不部署 Server。
