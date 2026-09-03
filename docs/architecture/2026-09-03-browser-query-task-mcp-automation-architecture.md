---
title: Browser Query Task MCP 自动化架构
status: proposed
created: 2026-09-03
source:
  - docs/prd/2026-09-03-browser-query-task-mcp-automation.md
  - docs/adr/0002-browser-server-streamable-http-mcp-boundary.md
  - docs/specs/0001-plugin-package-contract.md
  - docs/specs/0006-consumer-answer-testing.md
  - https://developers.openai.com/codex/mcp
  - https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
scope: 同机 Browser Extension、Browser Server Agent、Codex Host 与 Cowork 的模块职责、MCP 数据流、状态恢复和安全边界
---

# Browser Query Task MCP 自动化架构

## 1. 目标形态

```text
Cowork Workspace
  Query Portfolio → frozen Query Set → active GEO Cycle
        │
        │ Codex Host MCP Client
        ▼
Browser MCP Server（同机 Streamable HTTP）
  ├─ Cycle Query Input Registry
  ├─ Browser Query Task Store
  ├─ Query Capture / Raw Artifact Store
  ├─ Browser Server Agent / Extractor
  └─ Pending Result Queue
        ▲                         │
        │ Browser product channel│ MCP pull + acknowledgement
        ▼                         ▼
Browser Extension Client      geo-expert / Cowork Skill
  ├─ Assistant Panel              └─ canonical M5 materialization
  ├─ platform tab / login wait
  ├─ DOM input / submit / wait
  └─ answer HTML / Citation capture
```

插件安装关系不是业务数据流方向：`geo-expert` 通过 `.mcp.json` 把 Browser MCP Server 注册给 Codex；Codex Host 管理实际 MCP Client，Cowork Skill 调用 Tool。Browser MCP Server 不读取 Cowork Workspace，Browser Extension Client 也不直接连接 Cowork。

## 2. 所有权

| 边界 | 拥有 | 不拥有 |
| --- | --- | --- |
| Cowork | GEO Cycle、frozen Query Set、平台许可决定、canonical M5 对象与人工门 | Browser Query Task、页面 DOM、登录凭据 |
| Codex Host | MCP Client 生命周期、Tool 可见性与调用批准 | GEO 业务语义、Browser Task 状态 |
| Browser Server | Cycle Query Input 副本、Browser Task、raw capture、Extraction Result、pending/ack 状态 | canonical Query/Query Set、Answer Sample、业务批准 |
| Browser Server Agent | 回答区域的中立结构提取与 provenance | Claim 支撑、Review、Source 分类、GEO 结论 |
| Browser Extension Client | 页面交互、人工登录暂停、in-flight checkpoint、DOM capture | Cowork Workspace、MCP Client、canonical M5 对象 |

Browser Query Task 属于“浏览器产品”边界：Browser Server 是 durable authority，Extension Client 是页面执行器并保留足以恢复当前 attempt 的本地 checkpoint。

## 3. 输入流

### 3.1 Cycle 侧

1. Cowork 完成 Query Set 人工冻结并启动 GEO Cycle。
2. 用户选择浏览器任务路径后，Cowork 从 canonical Workspace 生成 `Cycle Query Input`，包含 exact refs、versions、hash、Query 文本、平台入口、Profile 与许可快照。
3. Cowork 调用 `register_cycle_query_input`。Browser MCP Server 全量校验后 create-only 保存；同 ID 同 bytes 返回 `kept`，不同 bytes 返回冲突。
4. 此注册动作不创建 Browser Query Task。它只向浏览器产品发布一个可选择的冻结输入。

### 3.2 Browser 侧

1. Assistant Panel 列出 Browser Server 上可用的 Cycle Query Input。
2. 用户选择 Cycle 与平台后新建 Browser Query Task；Server 冻结 input fingerprint 并把第一条 Query 分派给 Extension Client。
3. Extension Client 为每条 Query 打开可证明为新对话的入口。若未登录或出现 challenge，进入 `waiting_human`；登录完成后由人工点击继续。
4. `manual_assist` 由人工点击提交；`dom_automation` 仅在 Cowork 许可快照和 Browser adapter 均为 `allowed` 时自动输入提交。
5. 回答完成判定需要版本化 busy/terminal/stability detector。提交后状态不确定时停在人工确认，不自动重试。

## 4. 结果流

```text
answer root outerHTML + visible text + Citation occurrences + URL + diagnostics
  → immutable Query Capture
  → raw answer HTML artifact（create-only + SHA-256）
  → Browser Server Agent
  → Extraction Result（model + prompt + schema + raw checksum）
  → Pending Query Result
  → Cowork list/get/artifact-read
  → Cowork 本地 create-only 接收
  → acknowledgement
  → canonical M5 materialization / later Review gates
```

完整 HTML 指“当前回答根节点的 `outerHTML`”，不是全页 DOM。原始 bytes 不执行、不通过 `innerHTML` 回显；Agent 使用经解析和最小化的工作副本。MCP 列表只返回 metadata，不内联 HTML；Cowork 分块读取 raw artifact 并用 checksum 闭合。

Acknowledgement 发生在 Cowork 已可靠保存 raw 与 extraction 后，不等待 Review/聚合。由此 Cowork 后续分析失败不会触发平台 Query 重跑。

## 5. MCP Surface

第一版只暴露边界所需 Tool，不把 Browser 内部逐步状态变成远程控制 API：

| Tool | 方向 | 用途 |
| --- | --- | --- |
| `register_cycle_query_input` | Cowork → Browser | 发布 frozen Cycle/Query 输入；幂等写 |
| `get_cycle_query_input` | Cowork → Browser | 核对已注册 fingerprint 与消费状态 |
| `list_browser_query_tasks` | Cowork → Browser | 查看绑定当前 Cycle 的任务摘要；只读 |
| `get_browser_query_task_summary` | Cowork → Browser | 查看 Query 终态、失败与待人工项；只读 |
| `list_pending_query_results` | Cowork → Browser | 分页列出未确认结果 metadata；只读 |
| `get_query_result` | Cowork → Browser | 读取 Capture metadata 与 Extraction Result；只读 |
| `get_query_result_artifact` | Cowork → Browser | 分块读取 raw HTML/JSON artifact；只读 |
| `acknowledge_query_result` | Cowork → Browser | 以 result/checksum/fingerprint 确认可靠接收；幂等写 |

Server instructions 只说明跨 Tool 顺序、安全边界和大对象读取规则，不复制 GEO 业务规则。MCP Tool Schema 使用完整 JSON Schema；错误返回稳定 code 与 diagnostics，不把内部异常或凭据写入输出。

## 6. Agent 边界

Browser Server Agent 复用现有 Browser Server 的 AI provider 工厂和 AI SDK 技术栈，但新增独立 extraction entrypoint：

- 输入只包括 Query、平台 Profile、回答 HTML 的安全解析结果、visible text 与 Citation raw；
- 输出必须通过版本化 Zod/JSON Schema；
- 保存 provider/model 标识、Prompt version、Schema version、开始/完成时间、raw checksum 与失败诊断；
- 测试注入 Fake Extractor，不调用真实模型；
- 模型失败只重试 extraction，不重跑浏览器 Query；
- 不提供 GEO Claim、Review、分类或建议工具，避免把 Cowork 语义复制到 Browser Server。

## 7. 持久化与恢复

- Browser Server 复用现有数据库/Drizzle 技术栈，新增职责单一的 task/input/result 表；不引入第二种数据库。
- Query Capture 与 raw artifact create-only；任务控制状态使用 revision 与 expected revision 乐观并发。
- Extension Client 用 `chrome.storage.local` 或 IndexedDB 保存 in-flight checkpoint；Service Worker 全局变量不是事实源。
- Browser Server 重启后恢复非终态 task；`submitted` 之后缺结果的 attempt 进入 `waiting_human/unknown`，不自动再次提交。
- pending result 在 acknowledgement 前一直可读；ack 重放同 fingerprint 返回 `kept`，不同 fingerprint 返回冲突。

## 8. MCP 兼容与插件包装

- Browser MCP endpoint 固定为同机 `http://127.0.0.1:<configured-port>/mcp`，只接受 Streamable HTTP POST。
- Server 以 MCP `2026-07-28` 为目标，并兼容 Codex 仍使用的 2025-era stateless 请求；实现优先采用官方 TypeScript SDK v2 的 dual-era HTTP handler，依赖精确版本在实施 Record 冻结。
- `plugins/geo-expert/.mcp.json` 只登记 Server URL 与 bearer token 环境变量名，不保存 token 值。
- Spec 0001、插件验证脚本和安装说明必须显式允许这一 `.mcp.json`；Manifest 不复制业务规则。
- Codex Host 的 Tool allowlist/approval policy 与 Browser Server 自身鉴权同时生效，二者不能互相替代。

## 9. 安全与范围

- MCP endpoint 绑定 `127.0.0.1`，校验 Host/Origin，使用高熵 bearer token；token 只来自环境，不写日志、Workspace、扩展存储或 Git。
- Browser Extension Client 与 Server 的产品通信单独鉴权；页面 content script 不能选择任意 MCP URL 或发起 MCP Tool。
- 保存内容只限回答根节点及 Citation 所需上下文，禁止整页账号栏、历史会话列表、cookie、storage 或凭据。
- 当前真实平台仍为 `manual_only`；自动 DOM 路径只用 loopback fixture 验收。逐平台放行必须另有授权、adapter 变更和真实 UI Record。

## 10. 已知风险

| 风险 | 处理 |
| --- | --- |
| MCP Server 不能自动唤起 Codex turn | durable pending queue；Cowork 在显式同步/恢复步骤主动拉取，未来 heartbeat 单独立项 |
| Browser Server 复制 Cowork 业务语义 | extraction schema 只做平台中立字段；canonical 物化留在 Cowork |
| 完整 HTML 过大或含敏感 UI | 只截回答根节点；artifact 分块读取；保存/渲染均按不可信内容处理 |
| 旧 Spec 禁止 MCP | 新 Spec 明确覆盖并修改 Spec 0001/validator；未批准前不实现 |
| Query 已提交但进程中断 | unknown/waiting_human，人工判定，不自动重复提交 |
| Server/Extension 状态分叉 | Server revision 为 durable authority；Client checkpoint 只用于恢复页面执行 |
