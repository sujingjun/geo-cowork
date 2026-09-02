# Runtime and Trigger Entrypoints

## UI Entrypoints

### Home Page
**Path**: `/` (`app/pages/index.vue`)
**Trigger Type**: User navigation
**Purpose**: 应用首页，创建新聊天的起点
**Authentication**: Optional（未登录用户可访问）
**Main Downstream Modules**:
- `app/composables/useChatActions.ts` - 创建聊天
- `app/composables/useFileUpload.ts` - 文件上传
- `server/api/chats.post.ts` - 创建聊天 API
**Related Scenarios**: 新用户首次访问，登录用户创建聊天
**User Actions**:
- 输入消息并发送
- 选择 AI 模型
- 上传文件（需要登录）

### Chat Detail Page
**Path**: `/chat/[id]` (`app/pages/chat/[id].vue`)
**Trigger Type**: User navigation, deep link
**Purpose**: 查看和继续现有聊天
**Authentication**: Optional（公开聊天无需登录，私密聊天需要所有者）
**Main Downstream Modules**:
- `server/api/chats/[id].get.ts` - 获取聊天历史
- `server/api/chats/[id].post.ts` - 发送消息
- `server/api/chats/[id]/votes.get.ts` - 获取投票
- `app/composables/useChatActions.ts` - 聊天操作
**Related Scenarios**: 登录用户创建聊天，文件上传对话，模型切换，工具调用
**User Actions**:
- 发送消息
- 编辑和重新生成消息
- 投票（点赞/点踩）
- 重命名聊天
- 切换可见性
- 删除聊天

### Login Button
**Path**: User menu in navbar (`app/components/UserMenu.vue`)
**Trigger Type**: User click
**Purpose**: 触发 GitHub OAuth 登录流程
**Authentication**: None（登录前）
**Main Downstream Modules**:
- `server/routes/auth/github.get.ts` - OAuth 回调
- GitHub OAuth API
**Related Scenarios**: 登录用户创建聊天，文件上传对话
**Flow**:
1. 用户点击登录按钮
2. 重定向到 GitHub OAuth 授权页面
3. 用户授权后回调到 `/auth/github`
4. 创建会话并重定向回首页

### Logout Action
**Path**: User menu dropdown
**Trigger Type**: User click
**Purpose**: 清除用户会话，退出登录
**Authentication**: Required
**Main Downstream Modules**:
- `nuxt-auth-utils` - 会话清理
**Flow**:
1. 用户点击登出
2. 清除会话 cookie
3. 刷新页面

### File Upload
**Path**: Drag-drop overlay (`app/components/drag-drop/Overlay.vue`) or upload button (`app/components/chat/FileUploadButton.vue`)
**Trigger Type**: File drag-drop or file input
**Purpose**: 上传文件到 Blob 存储
**Authentication**: Required
**Main Downstream Modules**:
- `app/composables/useFileUpload.ts` - 上传逻辑
- `server/api/upload/[chatId].put.ts` - 上传 API
- NuxtHub Blob Storage
**Related Scenarios**: 文件上传对话
**Flow**:
1. 用户拖放或选择文件
2. 上传到 Blob 存储
3. 返回文件 URL
4. 附加到消息

### Model Selector
**Path**: Model select component (`app/components/ModelSelect.vue`)
**Trigger Type**: User selection
**Purpose**: 切换 AI 模型
**Authentication**: Optional
**Main Downstream Modules**:
- `app/composables/useModels.ts` - 模型管理
- `server/api/chats/[id].post.ts` - 使用选定模型
**Related Scenarios**: 模型切换

---

## API Entrypoints

### GET /api/chats
**Path**: `server/api/chats.get.ts`
**Trigger Type**: HTTP GET request
**Purpose**: 获取当前用户的聊天列表
**Authentication**: Required
**Request Parameters**: None
**Response**: `Chat[]` - 聊天列表
**Related Scenarios**: 登录用户查看历史
**Caller**: 侧边栏组件 (`useChats()` composable)

### POST /api/chats
**Path**: `server/api/chats.post.ts`
**Trigger Type**: HTTP POST request
**Purpose**: 创建新聊天并发送首条消息
**Authentication**: Optional（未登录用户创建临时聊天）
**Request Body**:
```json
{
  "id": "uuid",
  "message": {
    "role": "user",
    "parts": [...]
  }
}
```
**Response**: `Chat` - 新创建的聊天
**Related Scenarios**: 新用户首次访问，登录用户创建聊天
**Caller**: 首页 (`useChatActions()` composable)

### GET /api/chats/[id]
**Path**: `server/api/chats/[id].get.ts`
**Trigger Type**: HTTP GET request
**Purpose**: 获取单个聊天及其消息历史
**Authentication**: Optional（公开聊天无需认证）
**Request Parameters**: `id` (path parameter)
**Response**: `{ chat: Chat, messages: Message[] }`
**Related Scenarios**: 查看聊天历史
**Caller**: 聊天详情页

### POST /api/chats/[id]
**Path**: `server/api/chats/[id].post.ts`
**Trigger Type**: HTTP POST request
**Purpose**: 发送消息并获取 AI 流式响应
**Authentication**: Optional
**Request Body**:
```json
{
  "message": {
    "role": "user",
    "parts": [...]
  }
}
```
**Response**: Server-Sent Events stream（流式响应）
**Related Scenarios**: 所有对话场景
**Caller**: 聊天详情页

### DELETE /api/chats/[id]
**Path**: `server/api/chats/[id].delete.ts`
**Trigger Type**: HTTP DELETE request
**Purpose**: 删除聊天及其所有消息
**Authentication**: Required（仅所有者）
**Request Parameters**: `id` (path parameter)
**Response**: `{ success: boolean }`
**Related Scenarios**: 聊天管理（删除）
**Caller**: 聊天操作菜单

### PATCH /api/chats/[id]/title
**Path**: `server/api/chats/[id]/title.patch.ts`
**Trigger Type**: HTTP PATCH request
**Purpose**: 更新聊天标题
**Authentication**: Required（仅所有者）
**Request Body**: `{ title: string }`
**Response**: `{ success: boolean }`
**Related Scenarios**: 聊天管理（重命名）
**Caller**: 重命名对话框

### PATCH /api/chats/[id]/visibility
**Path**: `server/api/chats/[id]/visibility.patch.ts`
**Trigger Type**: HTTP PATCH request
**Purpose**: 切换聊天可见性
**Authentication**: Required（仅所有者）
**Request Body**: `{ visibility: "public" | "private" }`
**Response**: `{ success: boolean }`
**Related Scenarios**: 聊天管理（可见性）
**Caller**: 可见性切换组件

### DELETE /api/chats/[id]/messages
**Path**: `server/api/chats/[id]/messages.delete.ts`
**Trigger Type**: HTTP DELETE request
**Purpose**: 删除指定消息及其后续消息
**Authentication**: Required（仅所有者）
**Request Query**: `messageId=string`
**Response**: `{ success: boolean }`
**Related Scenarios**: 消息编辑和重新生成
**Caller**: 消息操作菜单

### GET /api/chats/[id]/votes
**Path**: `server/api/chats/[id]/votes.get.ts`
**Trigger Type**: HTTP GET request
**Purpose**: 获取聊天中的所有投票
**Authentication**: Optional
**Request Parameters**: `id` (path parameter)
**Response**: `Vote[]` - 投票列表
**Related Scenarios**: 消息投票显示
**Caller**: 消息组件

### POST /api/chats/[id]/votes
**Path**: `server/api/chats/[id]/votes.post.ts`
**Trigger Type**: HTTP POST request
**Purpose**: 为消息投票（点赞/点踩）
**Authentication**: Optional
**Request Body**:
```json
{
  "messageId": "string",
  "isUpvoted": true
}
```
**Response**: `{ success: boolean }`
**Related Scenarios**: 消息投票
**Caller**: 消息操作按钮

### PUT /api/upload/[chatId]
**Path**: `server/api/upload/[chatId].put.ts`
**Trigger Type**: HTTP PUT request
**Purpose**: 上传文件到 Blob 存储
**Authentication**: Required
**Request Body**: FormData with file
**Response**:
```json
{
  "type": "image" | "file",
  "url": "string",
  "mediaType": "string"
}
```
**Related Scenarios**: 文件上传对话
**Caller**: 文件上传组件

### DELETE /api/upload/[...pathname]
**Path**: `server/api/upload/[...pathname].delete.ts`
**Trigger Type**: HTTP DELETE request
**Purpose**: 删除 Blob 存储中的文件
**Authentication**: Required
**Request Parameters**: `pathname` (catch-all path parameter)
**Response**: `{ success: boolean }`
**Related Scenarios**: 文件管理
**Caller**: 文件预览组件

---

## OAuth/Auth Entrypoints

### GitHub OAuth Callback
**Path**: `/auth/github` (`server/routes/auth/github.get.ts`)
**Trigger Type**: HTTP GET redirect from GitHub
**Purpose**: 处理 GitHub OAuth 授权回调
**Authentication**: None（OAuth flow）
**Flow**:
1. GitHub 重定向到此路由，携带授权码
2. 使用授权码交换访问令牌
3. 获取用户信息
4. 创建或更新 users 表记录
5. 创建用户会话
6. 重定向到首页
**Related Scenarios**: 用户登录
**Upstream**: GitHub OAuth API
**Downstream**: 用户会话创建，数据库更新

---

## Background/Startup Entrypoints

### Application Bootstrap
**Path**: `app/app.vue`
**Trigger Type**: Application startup
**Purpose**: 应用初始化，设置全局配置
**Tasks**:
- 设置 SEO 元数据
- 配置主题颜色
- 加载 Nuxt UI 配置
**Related Modules**:
- `app/app.config.ts` - 应用配置
- `nuxt.config.ts` - Nuxt 配置

### Database Connection
**Path**: Nitro startup, Drizzle ORM
**Trigger Type**: Server startup
**Purpose**: 初始化数据库连接
**Configuration**:
- SQLite (开发): `.data/hub/db/db.sqlite`
- Turso (生产): 使用环境变量连接
**Related Modules**: 所有数据库操作

### Middleware Execution
**Path**: `app/middleware/transitions.global.ts`
**Trigger Type**: Every route navigation
**Purpose**: 应用全局过渡效果
**Authentication**: None
**Related Scenarios**: 所有页面导航

---

## Extension/Command Entrypoints

### CSRF Token Generation
**Path**: `nuxt-csurf` module
**Trigger Type**: Every page load
**Purpose**: 生成 CSRF token 防止跨站请求伪造
**Usage**: 所有状态变更 API 请求需要 CSRF token
**Related Modules**: 所有 POST/PATCH/DELETE API

---

## Webhook/Event Entrypoints

**Status**: 当前项目未实现 webhook 或事件订阅

**Future Potential**:
- GitHub webhook（部署触发）
- AI 模型更新通知
- 数据库备份完成通知

---

## CLI/Script Entrypoints

### Database Migrations
**Command**: `pnpm db:migrate`
**Path**: `node_modules/.bin/drizzle-kit migrate`
**Trigger Type**: Manual CLI execution
**Purpose**: 应用数据库迁移
**Related Modules**:
- `server/db/migrations/` - 迁移脚本
- `server/db/schema.ts` - 数据库模式

### Database Migration Generation
**Command**: `pnpm db:generate`
**Path**: `node_modules/.bin/drizzle-kit generate`
**Trigger Type**: Manual CLI execution
**Purpose**: 生成数据库迁移文件
**Related Modules**:
- `server/db/schema.ts` - 模式变更

### Development Server
**Command**: `pnpm dev`
**Path**: `node_modules/.bin/nuxt dev`
**Trigger Type**: Manual CLI execution
**Purpose**: 启动开发服务器
**Port**: 3000 (default)

### Production Build
**Command**: `pnpm build`
**Path**: `node_modules/.bin/nuxt build`
**Trigger Type**: Manual CLI execution or CI/CD
**Purpose**: 构建生产版本

### Type Checking
**Command**: `pnpm typecheck`
**Path**: `node_modules/.bin/vue-tsc`
**Trigger Type**: Manual CLI execution or CI/CD
**Purpose**: TypeScript 类型检查

### Linting
**Command**: `pnpm lint`
**Path**: `node_modules/.bin/eslint`
**Trigger Type**: Manual CLI execution or CI/CD
**Purpose**: 代码风格检查

---

## Entrypoint Relationships

```
User Browser
  ├─ GET / → Home Page → POST /api/chats → AI Response
  ├─ GET /chat/[id] → Chat Detail → POST /api/chats/[id] → AI Stream
  ├─ Login → GitHub OAuth → /auth/github → Session Created
  ├─ File Upload → PUT /api/upload/[chatId] → Blob Storage
  └─ Model Select → Local State Update → Future API Calls Use New Model

Server Startup
  ├─ Database Connection (SQLite/Turso)
  ├─ NuxtHub Initialization (Blob, DB)
  └─ Middleware Registration (CSRF, Auth)

CLI
  ├─ pnpm dev → Development Server
  ├─ pnpm build → Production Build
  ├─ pnpm db:migrate → Apply Migrations
  └─ pnpm db:generate → Generate Migrations
```

---

## Entrypoint Security Matrix

| Entrypoint | Authentication | Authorization | CSRF Protection |
|-----------|---------------|---------------|-----------------|
| GET / | Optional | None | No |
| GET /chat/[id] | Optional | Visibility check | No |
| POST /api/chats | Optional | None | Yes |
| POST /api/chats/[id] | Optional | None | Yes |
| DELETE /api/chats/[id] | Required | Owner only | Yes |
| PATCH /api/chats/[id]/title | Required | Owner only | Yes |
| PUT /api/upload/[chatId] | Required | None | Yes |
| /auth/github | OAuth | None | No |
