# API Reference

## Frontend APIs

### Composables

#### useChatActions()
**Location**: `app/composables/useChatActions.ts`
**Purpose**: 聊天操作管理（创建、删除、重命名、切换可见性）
**Returns**:
- `createChat(message)` - 创建新聊天并发送首条消息
- `deleteChat(id)` - 删除指定聊天
- `renameChat(id, title)` - 重命名聊天
- `toggleVisibility(id)` - 切换聊天可见性（public/private）
**Usage**: 在聊天管理界面和操作按钮中使用

#### useChats()
**Location**: `app/composables/useChats.ts`
**Purpose**: 聊天数据获取和缓存管理
**Returns**:
- `chats` - 聊天列表响应式数据
- `refresh()` - 刷新聊天列表
- `pending` - 加载状态
**Usage**: 在侧边栏和聊天列表页使用

#### useFileUpload(chatId)
**Location**: `app/composables/useFileUpload.ts`
**Purpose**: 文件上传管理（拖放、预览、上传到 Blob 存储）
**Parameters**:
- `chatId: string` - 聊天 ID
**Returns**:
- `dropzoneRef` - 拖放区域引用
- `dragging` - 拖放状态
- `files` - 本地文件列表
- `uploadedFiles` - 已上传文件列表（包含 URL）
- `uploading` - 上传状态
- `open()` - 打开文件选择器
- `removeFile(index)` - 移除文件
- `clearFiles()` - 清空所有文件
**Usage**: 在聊天输入区域和文件上传按钮中使用

#### useModels()
**Location**: `app/composables/useModels.ts`
**Purpose**: AI 模型选择和管理
**Returns**:
- `models` - 可用模型列表
- `selectedModel` - 当前选中模型
- `selectModel(modelId)` - 选择模型
**Usage**: 在模型选择器组件中使用

### Utility Functions

#### getMergedParts(parts)
**Location**: `app/utils/ai.ts`
**Purpose**: 合并消息的 text parts 和转换 source-url parts
**Parameters**:
- `parts: UIMessage['parts']` - 消息部分数组
**Returns**: `UIMessage['parts']` - 合并后的消息部分
**Usage**: 在消息渲染前预处理消息内容

## Backend APIs

### Chat Management

#### GET /api/chats
**Location**: `server/api/chats.get.ts`
**Purpose**: 获取当前用户的聊天列表
**Authentication**: Required
**Returns**: `Chat[]` - 聊天列表，按创建时间倒序
**Usage**: 侧边栏加载聊天历史

#### POST /api/chats
**Location**: `server/api/chats.post.ts`
**Purpose**: 创建新聊天并发送首条消息
**Authentication**: Optional（未登录用户创建临时聊天）
**Body**:
```json
{
  "id": "string (UUID)",
  "message": {
    "role": "user",
    "parts": [
      { "type": "text", "text": "string" },
      { "type": "image", "url": "string", "mediaType": "string" }
    ]
  }
}
```
**Returns**: `Chat` - 新创建的聊天对象
**Usage**: 首页创建新聊天

#### GET /api/chats/[id]
**Location**: `server/api/chats/[id].get.ts`
**Purpose**: 获取单个聊天及其消息历史
**Authentication**: Optional（公开聊天无需认证）
**Returns**: `{ chat: Chat, messages: Message[] }`
**Usage**: 聊天详情页加载历史消息

#### POST /api/chats/[id]
**Location**: `server/api/chats/[id].post.ts`
**Purpose**: 向聊天发送消息并获取 AI 流式响应
**Authentication**: Optional
**Body**:
```json
{
  "message": {
    "role": "user",
    "parts": [...]
  }
}
```
**Returns**: Stream - AI 流式响应（Server-Sent Events）
**Usage**: 聊天页面发送消息

#### DELETE /api/chats/[id]
**Location**: `server/api/chats/[id].delete.ts`
**Purpose**: 删除聊天及其所有消息
**Authentication**: Required（仅允许删除自己的聊天）
**Returns**: `{ success: boolean }`
**Usage**: 聊天操作菜单中的删除功能

#### PATCH /api/chats/[id]/title
**Location**: `server/api/chats/[id]/title.patch.ts`
**Purpose**: 更新聊天标题
**Authentication**: Required
**Body**: `{ title: string }`
**Returns**: `{ success: boolean }`
**Usage**: 聊天重命名功能

#### PATCH /api/chats/[id]/visibility
**Location**: `server/api/chats/[id]/visibility.patch.ts`
**Purpose**: 切换聊天可见性（public/private）
**Authentication**: Required
**Body**: `{ visibility: "public" | "private" }`
**Returns**: `{ success: boolean }`
**Usage**: 聊天可见性切换功能

#### DELETE /api/chats/[id]/messages
**Location**: `server/api/chats/[id]/messages.delete.ts`
**Purpose**: 删除指定消息及其后续所有消息
**Authentication**: Required
**Query**: `messageId=string`
**Returns**: `{ success: boolean }`
**Usage**: 消息编辑和重新生成功能

### Vote Management

#### GET /api/chats/[id]/votes
**Location**: `server/api/chats/[id]/votes.get.ts`
**Purpose**: 获取聊天中的所有投票
**Authentication**: Optional
**Returns**: `Vote[]` - 投票列表
**Usage**: 消息组件加载投票状态

#### POST /api/chats/[id]/votes
**Location**: `server/api/chats/[id]/votes.post.ts`
**Purpose**: 为消息投票（点赞/点踩）
**Authentication**: Optional
**Body**:
```json
{
  "messageId": "string",
  "isUpvoted": true
}
```
**Returns**: `{ success: boolean }`
**Usage**: 消息操作按钮中的投票功能

### File Upload

#### PUT /api/upload/[chatId]
**Location**: `server/api/upload/[chatId].put.ts`
**Purpose**: 上传文件到 Blob 存储
**Authentication**: Required
**Body**: `FormData` with file
**Returns**:
```json
{
  "type": "image" | "file",
  "url": "string",
  "mediaType": "string"
}
```
**Usage**: 文件上传组件

#### DELETE /api/upload/[...pathname]
**Location**: `server/api/upload/[...pathname].delete.ts`
**Purpose**: 删除 Blob 存储中的文件
**Authentication**: Required
**Returns**: `{ success: boolean }`
**Usage**: 文件预览组件中的删除功能

### Authentication

#### GET /auth/github
**Location**: `server/routes/auth/github.get.ts`
**Purpose**: GitHub OAuth 认证回调
**Returns**: Redirect to home with session cookie
**Usage**: OAuth 登录流程

## Database Schema APIs

### users
**Location**: `server/db/schema.ts`
**Fields**:
- `id` (text, primary key) - 用户 ID (UUID)
- `email` (text) - 邮箱
- `name` (text) - 用户名
- `avatar` (text) - 头像 URL
- `username` (text) - 用户名（GitHub）
- `provider` (text, enum) - 认证提供商（github）
- `providerId` (text) - 提供商用户 ID
- `createdAt` (timestamp) - 创建时间
**Relations**: Has many chats

### chats
**Location**: `server/db/schema.ts`
**Fields**:
- `id` (text, primary key) - 聊天 ID (UUID)
- `title` (text, nullable) - 聊天标题
- `userId` (text) - 所属用户 ID
- `visibility` (text, enum) - 可见性（public/private）
- `createdAt` (timestamp) - 创建时间
**Relations**: Belongs to user, has many messages
**Indexes**: `chats_user_id_idx` on userId

### messages
**Location**: `server/db/schema.ts`
**Fields**:
- `id` (text, primary key) - 消息 ID (UUID)
- `chatId` (text, foreign key) - 所属聊天 ID
- `role` (text, enum) - 角色（user/assistant/system）
- `parts` (json) - 消息部分（文本、图片、工具调用等）
- `createdAt` (timestamp) - 创建时间
**Relations**: Belongs to chat
**Indexes**: `messages_chat_id_idx` on chatId
**Cascade**: Delete when chat is deleted

### votes
**Location**: `server/db/schema.ts`
**Fields**:
- `chatId` (text, foreign key) - 聊天 ID
- `messageId` (text, foreign key) - 消息 ID
- `isUpvoted` (boolean) - 是否点赞
**Primary Key**: (chatId, messageId)
**Relations**: Belongs to chat and message
**Cascade**: Delete when chat or message is deleted

## Component APIs

### ChatTitle
**Location**: `app/components/chat/ChatTitle.vue`
**Props**:
- `chatId: string` - 聊天 ID
- `title: string` - 聊天标题
**Events**:
- `@update:title` - 标题更新事件
**Usage**: 聊天页面顶部标题区域

### ChatVisibility
**Location**: `app/components/chat/ChatVisibility.vue`
**Props**:
- `chatId: string` - 聊天 ID
- `visibility: 'public' | 'private'` - 可见性
**Events**:
- `@update:visibility` - 可见性更新事件
**Usage**: 聊天操作菜单

### FilePreview
**Location**: `app/components/chat/FilePreview.vue`
**Props**:
- `file: File` - 本地文件对象
- `url?: string` - 文件 URL（已上传）
**Events**:
- `@remove` - 移除文件事件
**Usage**: 文件上传区域

### MessageContent
**Location**: `app/components/chat/message/MessageContent.vue`
**Props**:
- `message: Message` - 消息对象
- `streaming: boolean` - 是否流式中
**Usage**: 消息列表中渲染消息内容

### MessageActions
**Location**: `app/components/chat/message/MessageActions.vue`
**Props**:
- `messageId: string` - 消息 ID
- `chatId: string` - 聊天 ID
**Events**:
- `@vote` - 投票事件
- `@edit` - 编辑事件
- `@copy` - 复制事件
**Usage**: 消息悬停时显示的操作按钮

### ModelSelect
**Location**: `app/components/ModelSelect.vue`
**Props**: None
**Events**:
- `@change` - 模型切换事件
**Usage**: 导航栏或聊天页面顶部

### Tool Components

#### Weather
**Location**: `app/components/chat/tool/Weather.vue`
**Props**:
- `data: { location: string, temperature: number, ... }` - 天气数据
**Usage**: AI 工具调用结果渲染

#### Chart
**Location**: `app/components/chat/tool/Chart.vue`
**Props**:
- `data: { type: string, data: any[] }` - 图表数据
**Usage**: AI 工具调用结果渲染

#### Sources
**Location**: `app/components/chat/tool/Sources.vue`
**Props**:
- `sources: Array<{ url: string, title: string }>` - 来源列表
**Usage**: Web 搜索结果渲染
