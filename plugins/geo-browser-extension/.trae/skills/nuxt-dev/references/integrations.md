# External Integrations

## Vercel AI Gateway

### Purpose
统一访问多个 AI 提供商（Anthropic、OpenAI、Google），提供负载均衡、故障转移和费用监控。

### Integration Type
**Outbound** - 应用调用外部 AI 服务

### Trigger Direction
应用主动调用（用户发送消息时）

### Related Modules
- `server/api/chats/[id].post.ts` - 流式 AI 响应
- AI SDK 库（`@ai-sdk/gateway`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/openai`）

### Configuration
**Environment Variables**:
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway API 密钥（必需）

**Code Configuration**:
```typescript
import { gateway } from '@ai-sdk/gateway'

const model = gateway('anthropic/claude-3-5-haiku-latest', {
  apiKey: process.env.AI_GATEWAY_API_KEY
})
```

### Entrypoints
- `POST /api/chats/[id]` - 发送消息触发 AI 调用

### Authentication
使用 API 密钥认证

### Failure Modes
- **API Key Invalid**: 返回 401 Unauthorized
- **Model Unavailable**: 自动故障转移到备用模型
- **Rate Limit Exceeded**: 返回 429 Too Many Requests
- **Network Timeout**: 流式响应中断，前端显示错误

### Retry/Error Behavior
- AI SDK 自动重试（短暂网络错误）
- 超时后停止流式响应
- 前端显示错误提示，允许重试

### Validation/Testing
- **Development**: 使用测试 API 密钥
- **Production**: 监控 AI Gateway 控制台的使用情况和错误
- **Mock**: 可在测试中 mock streamText 响应

### Related Scenarios
- 新用户首次访问
- 登录用户创建聊天
- 工具调用场景

---

## GitHub OAuth

### Purpose
用户认证和授权，获取用户基本信息（名称、邮箱、头像）

### Integration Type
**Inbound/Outbound** - OAuth 授权流程

### Trigger Direction
用户主动触发登录

### Related Modules
- `server/routes/auth/github.get.ts` - OAuth 回调处理
- `nuxt-auth-utils` 模块
- `server/db/schema.ts` - users 表

### Configuration
**Environment Variables**:
- `NUXT_OAUTH_GITHUB_CLIENT_ID` - GitHub OAuth 客户端 ID（可选，启用认证时必需）
- `NUXT_OAUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth 客户端密钥（可选）
- `NUXT_SESSION_PASSWORD` - 会话加密密钥（必需，最少32字符）

**OAuth App Settings** (GitHub):
- Authorization callback URL: `http://localhost:3000/auth/github` (开发)
- Homepage URL: 应用首页

### Entrypoints
- `GET /auth/github` - OAuth 回调
- UI 登录按钮 (`UserMenu.vue`)

### Authentication
OAuth 2.0 授权码流程

### Failure Modes
- **Invalid Credentials**: OAuth 应用配置错误，无法获取 token
- **User Denies Access**: 用户拒绝授权，返回错误
- **Callback URL Mismatch**: 回调 URL 不匹配，GitHub 拒绝请求
- **Session Creation Failed**: 数据库错误或会话加密失败

### Retry/Error Behavior
- OAuth 失败后重定向到首页，显示错误提示
- 用户可重试登录

### Validation/Testing
- **Development**: 使用 GitHub OAuth App 测试账号
- **Production**: 使用真实 OAuth App
- **Mock**: 可 mock 用户会话进行测试

### Related Scenarios
- 登录用户创建聊天
- 文件上传对话
- 聊天管理

---

## NuxtHub Blob Storage

### Purpose
存储用户上传的文件（图片、文档等）

### Integration Type
**Outbound** - 应用将文件上传到 Blob 存储

### Trigger Direction
用户上传文件时

### Related Modules
- `server/api/upload/[chatId].put.ts` - 文件上传
- `server/api/upload/[...pathname].delete.ts` - 文件删除
- `app/composables/useFileUpload.ts` - 前端上传逻辑
- NuxtHub 配置 (`nuxt.config.ts` - `hub: { blob: true }`)

### Configuration
**Environment Variables**:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob 访问令牌（生产环境，可选）

**Storage Drivers**:
- **Local** (开发): 文件系统存储（`.data/blob`）
- **Vercel Blob** (生产): Vercel 提供的 Blob 存储
- **Cloudflare R2**: Cloudflare 对象存储
- **Amazon S3**: AWS S3 存储

**Code Configuration**:
```typescript
const blob = hubBlob()
const file = await blob.put(pathname, body, {
  addRandomSuffix: true
})
```

### Entrypoints
- `PUT /api/upload/[chatId]` - 上传文件
- `DELETE /api/upload/[...pathname]` - 删除文件

### Authentication
需要用户登录（文件上传受保护）

### Failure Modes
- **Authentication Failed**: 未登录用户无法上传
- **File Too Large**: 超出存储限制，返回错误
- **Storage Quota Exceeded**: 存储空间不足
- **Network Timeout**: 上传中断，前端显示错误
- **Invalid File Type**: 不支持的文件类型

### Retry/Error Behavior
- 上传失败后前端显示错误
- 用户可重试上传
- 自动清理失败的临时文件

### Validation/Testing
- **Development**: 使用本地文件系统存储
- **Production**: 验证 Vercel Blob 或其他驱动配置
- **Mock**: 可 mock Blob API 进行单元测试

### Related Scenarios
- 文件上传对话

---

## SQLite / Turso Database

### Purpose
持久化存储用户、聊天、消息和投票数据

### Integration Type
**Internal** - 应用内部数据库

### Trigger Direction
应用读写数据时

### Related Modules
- `server/db/schema.ts` - 数据库模式
- `server/db/migrations/` - 迁移脚本
- 所有 API 路由（查询和写入）
- Drizzle ORM 库

### Configuration
**Environment Variables**:
- `TURSO_DATABASE_URL` - Turso 数据库连接 URL（生产环境，可选）
- `TURSO_AUTH_TOKEN` - Turso 认证令牌（生产环境，可选）

**Database Drivers**:
- **Local SQLite** (开发): `.data/hub/db/db.sqlite`
- **Turso** (生产): 分布式 SQLite 服务

**Schema**:
- `users` - 用户信息
- `chats` - 聊天会话
- `messages` - 聊天消息
- `votes` - 消息投票

### Entrypoints
所有 API 路由均涉及数据库操作

### Authentication
数据库访问无需额外认证（应用内部）

### Failure Modes
- **Connection Failed**: 数据库连接失败（生产环境 Turso 不可用）
- **Query Timeout**: 查询超时（复杂查询或网络问题）
- **Constraint Violation**: 违反唯一约束或外键约束
- **Migration Failed**: 数据库迁移失败

### Retry/Error Behavior
- 数据库错误返回 500 Internal Server Error
- 前端显示错误提示
- 用户可重试操作

### Validation/Testing
- **Development**: 使用本地 SQLite 数据库
- **Production**: 使用 Turso 或其他生产数据库
- **Testing**: 使用内存 SQLite 进行单元测试
- **Migrations**: 使用 Drizzle Kit 管理迁移

### Related Scenarios
所有涉及数据持久化的场景

---

## AI Tool Integrations

### Web Search Tool

**Purpose**: 提供实时 Web 搜索能力

**Integration Type**: Outbound（通过 AI 提供商的 built-in tool）

**Related Modules**:
- `server/api/chats/[id].post.ts` - 工具调用
- `app/components/chat/tool/Sources.vue` - 搜索结果 UI

**Configuration**: 由 AI 提供商（Anthropic/OpenAI）提供，无需额外配置

**Failure Modes**: 搜索 API 不可用，返回空结果

**Related Scenarios**: 工具调用（Web 搜索）

### Chart Generation Tool

**Purpose**: 生成图表（柱状图、折线图、饼图等）

**Integration Type**: Internal（AI 生成数据，前端渲染）

**Related Modules**:
- `server/api/chats/[id].post.ts` - 工具定义
- `app/components/chat/tool/Chart.vue` - 图表渲染
- `nuxt-charts` 模块

**Configuration**: 工具定义在 AI streamText 中

**Failure Modes**: 工具参数无效，图表渲染失败

**Related Scenarios**: 工具调用场景

### Weather Tool

**Purpose**: 查询天气信息

**Integration Type**: Outbound（调用天气 API）或 Mock

**Related Modules**:
- `server/api/chats/[id].post.ts` - 工具定义
- `app/components/chat/tool/Weather.vue` - 天气 UI

**Configuration**: 工具定义和参数验证

**Failure Modes**: 天气 API 不可用，返回错误

**Related Scenarios**: 工具调用场景

---

## Deployment Integrations

### Vercel Platform

**Purpose**: 应用部署和托管

**Integration Type**: Deployment Platform

**Configuration**:
- 环境变量配置（Vercel Dashboard）
- 自动部署（Git 集成）
- Turso 集成（数据库）
- Vercel Blob 集成（文件存储）

**Entrypoints**: Git push 触发自动部署

**Validation**: 部署后运行健康检查

### Cloudflare Platform

**Purpose**: 备选部署平台（使用 R2 存储）

**Integration Type**: Deployment Platform

**Configuration**:
- R2 存储配置
- 环境变量配置

**Validation**: 部署后验证 R2 存储可用

---

## Monitoring and Observability

### Console Logging

**Purpose**: 开发环境调试和生产环境错误追踪

**Related Modules**: 所有服务器路由和关键组件

**Configuration**: `console.log`, `console.error`

**Validation**: 查看服务器日志和浏览器控制台

### Error Tracking (Future)

**Potential Integration**: Sentry, LogRocket, Datadog

**Purpose**: 生产环境错误监控和用户行为追踪

**Status**: 未集成，可根据需要添加

---

## Integration Dependency Map

```
GitHub OAuth → Users (DB) → Session → Protected APIs
                                      → Chats (DB)
                                      → File Upload → Blob Storage

AI Gateway → AI Models → Streaming Response → Messages (DB)
                      → Tool Calls → Tool Results → UI Components

Blob Storage ← File Upload ← Authenticated Users
             → File URLs → AI Multimodal Input

Turso/SQLite ← All APIs → All Data Persistence
```
