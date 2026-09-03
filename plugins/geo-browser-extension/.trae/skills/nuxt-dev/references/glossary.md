# Glossary

## Business Terms

**Chat** - 用户与 AI 助手的对话会话。每个聊天包含标题、可见性设置和多条消息。支持创建、删除、重命名和分享。

**Message** - 聊天中的单条消息记录。包含角色（user/assistant/system）和内容部分（parts）。消息按时间顺序排列，形成对话上下文。

**Part** - 消息的内容单元。一条消息可包含多个 parts，类型包括：text（文本）、image（图片）、file（文件）、tool-call（工具调用）、tool-result（工具结果）。

**Visibility** - 聊天的可见性设置。`public`（公开）表示任何人可访问，`private`（私密）表示仅创建者可访问。

**Vote** - 用户对 AI 消息的反馈。`upvote`（点赞）表示满意，`downvote`（点踩）表示不满意。用于改进 AI 响应质量。

**Tool** - AI 可调用的外部功能。当前支持：Web 搜索、图表生成、天气查询。AI 根据用户问题自动决定是否调用工具。

**Model** - AI 语言模型。支持多个提供商的模型，如 Claude Haiku 4.5、Gemini 3 Flash、GPT-5 Nano。用户可切换模型。

**Streaming** - 流式响应技术。AI 回复以流的方式逐块返回，用户可实时看到生成过程，无需等待完整响应。

**Gateway** - Vercel AI Gateway，统一访问多个 AI 提供商的中间层。简化 API 密钥管理，提供负载均衡和故障转移。

**Blob** - 二进制大对象存储服务。用于存储用户上传的文件（图片、文档等）。支持多种存储驱动（Vercel Blob、R2、S3）。

**Session** - 用户会话。通过 GitHub OAuth 登录后创建，用于识别用户身份和权限。存储在加密的 cookie 中。

**OAuth** - 开放授权协议。本项目使用 GitHub OAuth 实现第三方登录，无需管理密码。

**CSRF** - 跨站请求伪造保护。所有状态变更请求需要 CSRF token，防止恶意攻击。

**Composable** - Vue 3 组合式函数。封装可复用的逻辑，如 useChatActions、useFileUpload。遵循 use* 命名约定。

**Middleware** - 中间件。在路由跳转前执行的逻辑，用于认证检查、权限验证等。

**Migration** - 数据库迁移。记录数据库模式变更的脚本，确保生产和开发环境同步。使用 Drizzle Kit 管理。

## Technical Terms

**Nuxt** - Vue 3 全栈框架。提供服务器端渲染、自动路由、API 路由等功能。本项目基于 Nuxt 4。

**Nitro** - Nuxt 的服务器引擎。处理 API 路由、服务器渲染、中间件等后端逻辑。

**Drizzle ORM** - TypeScript ORM 库。提供类型安全的数据库操作和迁移管理。支持 SQLite 和 PostgreSQL。

**SQLite** - 嵌入式关系数据库。本地开发使用，零配置。生产环境使用 Turso（分布式 SQLite）。

**Turso** - 分布式 SQLite 数据库服务。提供全球边缘部署、自动备份和高可用性。

**NuxtHub** - Nuxt 的云平台集成。提供 Blob 存储、数据库、KV 存储等服务。简化部署流程。

**AI SDK** - Vercel AI SDK。提供统一的 AI 模型接口，支持流式响应、工具调用、多模态输入。

**SSE (Server-Sent Events)** - 服务器推送技术。用于实现 AI 流式响应，服务器持续向客户端推送数据块。

**Tailwind CSS** - 实用优先的 CSS 框架。本项目使用 Tailwind CSS 4，支持主题和深色模式。

**Nuxt UI** - Nuxt 的 UI 组件库。提供预设计的组件、主题系统和无障碍支持。

**ESLint** - JavaScript/TypeScript 代码检查工具。配置了 Nuxt 官方规则，强制代码风格一致性。

**TypeScript** - JavaScript 的类型超集。本项目使用 strict 模式，要求显式类型注解。

**pnpm** - 高效的包管理器。比 npm/yarn 更快，节省磁盘空间。本项目使用 pnpm 9+。

**Vue Reactivity** - Vue 的响应式系统。使用 ref、computed、watch 等 API 实现数据绑定和自动更新。

**Auto-import** - Nuxt 的自动导入功能。组件、组合式函数、工具函数无需手动导入，提高开发效率。

**Server Routes** - Nuxt 的服务器路由。`server/routes/` 目录下的文件自动映射为 HTTP 路由。

**API Routes** - Nuxt 的 API 路由。`server/api/` 目录下的文件自动映射为 `/api/*` 端点。

**File-based Routing** - Nuxt 的文件路由。`app/pages/` 目录结构自动生成路由配置。

**Dynamic Routes** - 动态路由。使用 `[id]` 语法定义参数化路由，如 `/chat/[id].vue`。

**Layout** - Nuxt 布局系统。`app/layouts/` 中的布局文件可在页面中复用，如导航栏、侧边栏。

**Error Page** - Nuxt 错误页面。`app/error.vue` 捕获应用级错误，提供友好的错误提示。

## Abbreviations and Acronyms

**AI** - Artificial Intelligence，人工智能

**API** - Application Programming Interface，应用程序接口

**ORM** - Object-Relational Mapping，对象关系映射

**CRUD** - Create, Read, Update, Delete，增删改查

**SSR** - Server-Side Rendering，服务器端渲染

**SPA** - Single Page Application，单页应用

**UUID** - Universally Unique Identifier，通用唯一标识符

**JWT** - JSON Web Token，JSON Web 令牌

**HTTP** - HyperText Transfer Protocol，超文本传输协议

**REST** - Representational State Transfer，表述性状态转移

**JSON** - JavaScript Object Notation，JavaScript 对象表示法

**SQL** - Structured Query Language，结构化查询语言

**CLI** - Command Line Interface，命令行界面

**UI** - User Interface，用户界面

**UX** - User Experience，用户体验

**CSS** - Cascading Style Sheets，层叠样式表

**JS/TS** - JavaScript / TypeScript

**ENV** - Environment，环境变量

**BLOB** - Binary Large Object，二进制大对象

**CDN** - Content Delivery Network，内容分发网络

**CSRF** - Cross-Site Request Forgery，跨站请求伪造

**CORS** - Cross-Origin Resource Sharing，跨域资源共享

## Usage Context

### In Logs
- "Streaming AI response" - AI 流式响应进行中
- "Chat created" - 新聊天已创建
- "File uploaded to blob" - 文件已上传到存储
- "User authenticated via GitHub" - 用户通过 GitHub 认证
- "Database migration applied" - 数据库迁移已应用
- "CSRF token invalid" - CSRF token 无效

### In Config
- `AI_GATEWAY_API_KEY` - AI Gateway API 密钥
- `NUXT_SESSION_PASSWORD` - 会话加密密钥
- `BLOB_READ_WRITE_TOKEN` - Blob 存储访问令牌
- `TURSO_DATABASE_URL` - Turso 数据库连接 URL
- `TURSO_AUTH_TOKEN` - Turso 认证令牌

### In UI
- "Start a new chat" - 开始新对话
- "Upload files" - 上传文件
- "Switch model" - 切换模型
- "Regenerate response" - 重新生成回复
- "Copy to clipboard" - 复制到剪贴板
- "Delete chat" - 删除聊天
- "Make public" / "Make private" - 设为公开/私密

### In Code
- `useChatActions()` - 聊天操作组合式函数
- `streamText()` - AI SDK 流式文本生成
- `defineEventHandler()` - 定义 Nitro 事件处理器
- `useUserSession()` - 用户会话管理
- `$fetch()` - Nuxt 的 fetch API
- `useLazyAsyncData()` - 延迟异步数据加载
