# GEO Browser Extension

本上下文定义浏览器内 GEO 辅助能力与现有站点服务之间的职责边界。

## Language

**GEO Browser Assistant**:
面向人工主导 GEO 浏览器工作的薄客户端；后续生成式平台 Query 测试等浏览器辅助切片归属此上下文，但不拥有服务端业务能力。
_Avoid_: GEO Site Generator, Browser Backend

**Browser Extension Client**:
运行在 Chrome 中并拥有 Browser Query Task 与页面交互的客户端；它只与 Browser Server Agent 通信，不直接调用 Cowork。
_Avoid_: Browser Server Agent, Codex MCP Client

**GEO Site Service**:
现有 SSR 站点服务，拥有 AI、鉴权、数据与站点生成能力，并向浏览器辅助端提供受控的服务边界。
_Avoid_: Chrome Extension, Static Site Bundle

**Browser Server Agent**:
浏览器产品 Server 端拥有的 Agent 能力；它接收 Cowork 发起的任务、协调 Browser Extension Client，并保存浏览器任务产出的模型结果。它不拥有 GEO Cycle，也不代替 Browser Extension Client 执行页面交互。
_Avoid_: Chrome Content Script, Cowork Agent, Browser Query Task

**Browser MCP Server**:
Browser Server Agent 在同机 Streamable HTTP endpoint 暴露的 MCP 能力；它接收 Cowork 的任务调用并向 Cowork 提供待处理模型结果。
_Avoid_: Cowork MCP Server, Browser Extension Client, Custom REST API

**Cowork MCP Consumer**:
安装到 Codex 后通过 Codex Host 所管理的 MCP Client 调用 Browser MCP Server 的 GEO 工作流角色；它不是独立的 MCP Client 进程。
_Avoid_: Cowork MCP Server, Standalone MCP Client

**Assistant Panel**:
与当前浏览页面并存、持续承载 GEO Browser Assistant 工作流的主操作区；工具栏入口仅用于唤起该区域。
_Avoid_: Popup, Embedded GEO Site

**Active Page Context**:
人工打开或刷新 Assistant Panel 时读取的当前标签页标题与 URL 快照；它不包含页面正文、DOM 或账号状态。
_Avoid_: Page Content, Browser Session

**Browser Query Task**:
扩展基于一个 GEO Cycle 的 frozen Query Set 新建并闭环的浏览器执行任务；它拥有逐条 Query 的执行状态，Cowork 只消费其模型结果，不推进该任务。
_Avoid_: Query Set, GEO Cycle, Cowork Run

**Query Attempt**:
一条 Query 的一次执行尝试；成功 attempt 保存完整回答、Citation raw 与 capture manifest，失败 attempt 保存不可变 collector log。重试创建新 attempt，不覆盖历史。
_Avoid_: Query Version, Answer Review

**Query Capture**:
Browser Extension Client 为一次 Query Attempt 形成并交付给 Browser Server Agent 的不可变模型结果；人工采集与浏览器自动采集使用同一合同，并由 Browser MCP Server 提供给 Cowork。它保留原始回答与 Citation，但不是 Agent 分析结果、Answer Sample 或业务结论。
_Avoid_: Browser Query Task, Answer Review, Analysis Result

**Extraction Result**:
Browser Server Agent 基于 Query Capture 生成的平台中立提取结果；它必须绑定原始结果及所用模型、Prompt 和 Schema 版本。它不是 Cowork 的 canonical Answer Sample、Citation Observation 或业务判断。
_Avoid_: Query Capture, Canonical Answer, GEO Finding

**Pending Query Result**:
Browser MCP Server 已持久保存、等待 Cowork 主动读取并确认接收的 Query Capture 与 Extraction Result 组合。MCP Server 不以通知自动唤起 Cowork Agent。
_Avoid_: Running Query, Completed Answer Sample, Push Notification

**Canonical Answer Materialization**:
Cowork 校验 Cycle、Query Set、Query、原始结果与提取来源后，将其写入项目 canonical M5 对象的过程；Browser Server Agent 不执行该物化。
_Avoid_: DOM Extraction, Query Capture Delivery

**Manual Assist**:
扩展复制 Query 并打开平台，人工负责提交、确认终态和提供完整结果；适用于现有消费者平台的人工 fallback。
_Avoid_: Browser Automation, API Collection

**DOM Automation**:
仅当平台注册 adapter 的自动化状态为 `allowed` 时，由扩展在精确 origin 权限内输入、提交、等待与提取；登录状态本身不构成许可。
_Avoid_: Manual Assist, Unrestricted Scraping
