# GEO Browser Extension

本上下文定义浏览器内 GEO 辅助能力与现有站点服务之间的职责边界。

## Language

**GEO Browser Assistant**:
面向人工主导 GEO 浏览器工作的薄客户端；后续生成式平台 Query 测试等浏览器辅助切片归属此上下文，但不拥有服务端业务能力。
_Avoid_: GEO Site Generator, Browser Backend

**GEO Site Service**:
现有 SSR 站点服务，拥有 AI、鉴权、数据与站点生成能力，并向浏览器辅助端提供受控的服务边界。
_Avoid_: Chrome Extension, Static Site Bundle

**Assistant Panel**:
与当前浏览页面并存、持续承载 GEO Browser Assistant 工作流的主操作区；工具栏入口仅用于唤起该区域。
_Avoid_: Popup, Embedded GEO Site

**Active Page Context**:
人工打开或刷新 Assistant Panel 时读取的当前标签页标题与 URL 快照；它不包含页面正文、DOM 或账号状态。
_Avoid_: Page Content, Browser Session

**Browser Query Task**:
由一个 frozen Query Set、目标平台、执行许可和逐条状态组成的本地任务；状态可恢复，但 `running` 状态恢复时不得自动重复提交。
_Avoid_: Query Set, Platform Conversation

**Query Attempt**:
一条 Query 的一次执行尝试；成功 attempt 保存完整回答、Citation raw 与 capture manifest，失败 attempt 保存不可变 collector log。重试创建新 attempt，不覆盖历史。
_Avoid_: Query Version, Answer Review

**Manual Assist**:
扩展复制 Query 并打开平台，人工负责提交、确认终态和提供完整结果；适用于现有消费者平台的人工 fallback。
_Avoid_: Browser Automation, API Collection

**DOM Automation**:
仅当平台注册 adapter 的自动化状态为 `allowed` 时，由扩展在精确 origin 权限内输入、提交、等待与提取；登录状态本身不构成许可。
_Avoid_: Manual Assist, Unrestricted Scraping
