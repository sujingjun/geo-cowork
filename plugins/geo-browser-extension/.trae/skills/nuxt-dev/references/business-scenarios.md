# Business Scenarios

## Scenario 1: 新用户首次访问

### User Role
未登录访客

### Goal
快速体验 AI 聊天功能，无需注册

### Entry Points
- **UI**: 访问首页 `/` (`app/pages/index.vue`)
- **Trigger**: 页面加载

### Flow
1. **加载首页**
   - 渲染欢迎界面和模型选择器
   - 显示示例提示词
   - 无需认证检查

2. **输入首条消息**
   - 用户在输入框输入问题
   - 可选择不同 AI 模型
   - 点击发送按钮

3. **创建临时聊天**
   - 调用 `POST /api/chats` (`server/api/chats.post.ts`)
   - 未登录用户创建临时聊天（不持久化）
   - 生成临时 chatId (UUID)

4. **流式响应**
   - AI Gateway 返回流式响应
   - 前端实时渲染 AI 回复
   - 显示"思考中"指示器

5. **查看结果**
   - 消息完整显示
   - 可继续对话
   - 提示登录以保存历史

### Core Modules
- `app/pages/index.vue` - 首页组件
- `app/composables/useChatActions.ts` - 聊天创建逻辑
- `server/api/chats.post.ts` - 聊天创建 API
- `server/api/chats/[id].post.ts` - 消息发送 API

### Key Entities
- **Chat**: 临时聊天会话（不保存到数据库）
- **Message**: 用户消息和 AI 响应

### State Transitions
无登录 → 创建临时聊天 → 对话中 → 提示登录保存

### Related Configs
- `AI_GATEWAY_API_KEY` - AI 服务访问密钥

### Related Permissions
无需认证

### Related Integrations
- Vercel AI Gateway - AI 模型访问

### Common Failure Points
- AI Gateway API 密钥无效
- 网络超时导致流式响应中断
- AI 模型不可用

### Validation Steps
1. 访问首页，检查页面正常加载
2. 输入消息，验证流式响应
3. 检查 AI 回复内容完整
4. 验证未登录用户无法保存聊天

---

## Scenario 2: 登录用户创建聊天

### User Role
已登录用户

### Goal
创建并保存聊天历史，方便后续查看

### Entry Points
- **UI**: 点击"New Chat"按钮 (`app/components/Navbar.vue`)
- **API**: `POST /api/chats` (`server/api/chats.post.ts`)
- **Trigger**: 用户点击或首页发送消息

### Flow
1. **认证检查**
   - 检查用户会话 (`useUserSession()`)
   - 已登录用户可创建持久化聊天

2. **创建聊天**
   - 调用 `POST /api/chats` with CSRF token
   - 生成 UUID 作为 chatId
   - 插入 chats 表：`{ id, userId, visibility: 'private' }`

3. **发送首条消息**
   - 插入 messages 表：`{ chatId, role: 'user', parts }`
   - 调用 AI Gateway 获取响应
   - 流式返回 AI 回复

4. **保存 AI 响应**
   - 将 AI 消息插入 messages 表
   - 保存工具调用结果（如有）
   - 更新聊天标题（基于首条消息）

5. **导航到聊天页面**
   - 跳转到 `/chat/[id]` (`app/pages/chat/[id].vue`)
   - 加载完整聊天历史
   - 更新侧边栏聊天列表

### Core Modules
- `app/composables/useChatActions.ts` - 聊天操作
- `app/composables/useChats.ts` - 聊天列表管理
- `server/api/chats.post.ts` - 聊天创建
- `server/api/chats/[id].post.ts` - 消息发送
- `server/db/schema.ts` - 数据库模式

### Key Entities
- **Chat**: 持久化聊天会话
- **Message**: 用户和 AI 消息
- **User**: 会话所有者

### State Transitions
已登录 → 创建聊天 → 保存到数据库 → 导航到聊天页 → 侧边栏显示

### Related Configs
- `NUXT_SESSION_PASSWORD` - 会话加密
- `AI_GATEWAY_API_KEY` - AI 服务
- `TURSO_DATABASE_URL` - 数据库连接

### Related Permissions
- 需要认证（已登录）
- 用户只能操作自己的聊天

### Related Integrations
- GitHub OAuth - 用户认证
- Vercel AI Gateway - AI 响应
- Turso/SQLite - 数据持久化

### Common Failure Points
- 会话过期导致认证失败
- CSRF token 不匹配
- 数据库连接失败
- AI 响应超时

### Validation Steps
1. 登录用户，创建新聊天
2. 验证聊天保存到数据库
3. 检查侧边栏显示新聊天
4. 刷新页面，验证聊天仍存在
5. 验证聊天所有权正确

---

## Scenario 3: 文件上传对话

### User Role
已登录用户（文件上传需要认证）

### Goal
上传文件（图片、文档）并让 AI 分析内容

### Entry Points
- **UI**: 拖放文件到聊天窗口 (`app/components/drag-drop/Overlay.vue`)
- **UI**: 点击上传按钮 (`app/components/chat/FileUploadButton.vue`)
- **API**: `PUT /api/upload/[chatId]` (`server/api/upload/[chatId].put.ts`)
- **Trigger**: 文件拖放或文件选择

### Flow
1. **选择文件**
   - 用户拖放文件或点击上传按钮
   - 文件选择器打开或拖放区域激活
   - 显示文件预览 (`FilePreview.vue`)

2. **认证检查**
   - 验证用户已登录
   - 未登录用户无法上传文件

3. **上传文件**
   - 调用 `PUT /api/upload/[chatId]`
   - 上传到 NuxtHub Blob 存储
   - 返回文件 URL 和 mediaType

4. **附加到消息**
   - 将文件 URL 添加到消息 parts
   - `{ type: 'image', url, mediaType }`
   - 与文本提示一起发送

5. **AI 分析**
   - AI 接收多模态输入（文本 + 文件）
   - 分析文件内容并生成回复
   - 流式返回分析结果

6. **显示结果**
   - 消息中显示文件预览
   - AI 回复引用文件内容
   - 支持多文件上传

### Core Modules
- `app/composables/useFileUpload.ts` - 文件上传逻辑
- `app/components/drag-drop/Overlay.vue` - 拖放界面
- `app/components/chat/FileUploadButton.vue` - 上传按钮
- `app/components/chat/FilePreview.vue` - 文件预览
- `server/api/upload/[chatId].put.ts` - 文件上传 API
- `server/api/chats/[id].post.ts` - 多模态消息发送

### Key Entities
- **Blob**: 上传到存储的文件
- **Message Part**: 文件类型的消息部分（image, file）
- **Chat**: 包含文件的聊天会话

### State Transitions
选择文件 → 上传中 → 上传完成 → 附加到消息 → 发送给 AI → 分析结果

### Related Configs
- `BLOB_READ_WRITE_TOKEN` - Blob 存储访问令牌
- 存储驱动配置（Vercel Blob / R2 / S3）

### Related Permissions
- 需要认证（已登录）
- 文件大小限制（配置于 Blob 存储）

### Related Integrations
- NuxtHub Blob - 文件存储
- Vercel Blob / R2 / S3 - 存储后端
- Vercel AI Gateway - 多模态 AI 分析

### Common Failure Points
- 未登录用户尝试上传
- 文件过大超出限制
- Blob 存储配置错误
- 文件类型不支持
- 网络中断导致上传失败

### Validation Steps
1. 登录用户，拖放文件到聊天窗口
2. 验证文件预览显示正确
3. 检查文件上传到 Blob 存储
4. 发送消息，验证 AI 分析文件内容
5. 检查消息中文件显示正确
6. 删除文件，验证从存储中移除

---

## Scenario 4: 模型切换

### User Role
任何用户（已登录或未登录）

### Goal
切换不同 AI 模型以获得不同风格的回复

### Entry Points
- **UI**: 点击模型选择器 (`app/components/ModelSelect.vue`)
- **Trigger**: 用户选择不同模型

### Flow
1. **显示模型列表**
   - 加载可用模型（Claude, Gemini, GPT）
   - 显示模型名称和描述
   - 高亮当前选中模型

2. **切换模型**
   - 用户点击其他模型
   - 更新本地状态（localStorage 或 cookie）
   - 显示切换成功提示

3. **应用到后续消息**
   - 下次发送消息时使用新模型
   - 历史消息保持原模型生成
   - 每条消息记录使用的模型

4. **模型特性差异**
   - 不同模型支持不同功能
   - 某些模型支持更大上下文
   - 某些模型速度更快

### Core Modules
- `app/components/ModelSelect.vue` - 模型选择器
- `app/composables/useModels.ts` - 模型管理
- `server/api/chats/[id].post.ts` - 使用选定模型

### Key Entities
- **Model**: AI 模型配置（提供商、ID、名称）
- **Message**: 记录生成消息的模型

### State Transitions
选择模型 → 更新本地状态 → 后续消息使用新模型

### Related Configs
- `AI_GATEWAY_API_KEY` - 访问所有模型
- 模型配置（provider, model ID）

### Related Permissions
无特殊权限要求

### Related Integrations
- Vercel AI Gateway - 统一多模型访问
- Anthropic Claude
- Google Gemini
- OpenAI GPT

### Common Failure Points
- 某些模型不可用或下线
- API 配额耗尽
- 模型不支持特定功能（如文件分析）

### Validation Steps
1. 打开模型选择器，查看可用模型
2. 切换模型，验证状态更新
3. 发送消息，验证使用新模型
4. 检查历史消息未受影响
5. 测试不同模型的响应差异

---

## Scenario 5: 工具调用（Web 搜索）

### User Role
任何用户

### Goal
AI 自动调用 Web 搜索工具，获取实时信息

### Entry Points
- **Trigger**: 用户询问需要实时信息的问题
- **Example**: "今天的新闻有哪些？"
- **API**: `server/api/chats/[id].post.ts`

### Flow
1. **用户提问**
   - 用户输入需要实时信息的问题
   - 消息发送到 AI

2. **AI 决策**
   - AI 分析问题，判断需要工具
   - 决定调用 Web 搜索工具
   - 生成工具调用请求

3. **执行搜索**
   - 服务器接收工具调用
   - 执行 Web 搜索（Anthropic/OpenAI built-in）
   - 返回搜索结果

4. **AI 整合结果**
   - AI 接收搜索结果
   - 整合到回复中
   - 引用来源链接

5. **渲染结果**
   - 前端接收流式响应
   - 渲染搜索来源 (`Sources.vue`)
   - 显示引用链接（`SourceLink.vue`）

### Core Modules
- `server/api/chats/[id].post.ts` - 工具调用处理
- `app/components/chat/tool/Sources.vue` - 搜索结果渲染
- `app/components/chat/SourceLink.vue` - 来源链接

### Key Entities
- **Tool Call**: AI 工具调用请求
- **Tool Result**: 工具执行结果
- **Message Part**: 包含工具调用和结果的消息部分

### State Transitions
用户提问 → AI 决策 → 调用工具 → 执行搜索 → 返回结果 → AI 整合 → 渲染 UI

### Related Configs
- AI 模型配置（支持工具调用）
- 工具定义和参数

### Related Permissions
无特殊权限要求

### Related Integrations
- Anthropic/OpenAI Built-in Search Tools
- Vercel AI Gateway

### Common Failure Points
- AI 未能正确识别需要工具
- 搜索 API 失败或超时
- 搜索结果为空
- 工具结果格式解析错误

### Validation Steps
1. 询问需要实时信息的问题
2. 验证 AI 调用搜索工具
3. 检查搜索结果正确返回
4. 验证 UI 渲染来源链接
5. 点击来源链接，验证可访问

---

## Scenario 6: 聊天管理（重命名、删除、可见性）

### User Role
已登录用户（所有者）

### Goal
管理自己的聊天历史

### Entry Points
- **UI**: 聊天操作菜单
  - 重命名: `ModalRename.vue`
  - 删除: `ModalConfirm.vue`
  - 可见性: `ChatVisibility.vue`
- **API**: 
  - `PATCH /api/chats/[id]/title`
  - `DELETE /api/chats/[id]`
  - `PATCH /api/chats/[id]/visibility`

### Flow - 重命名聊天
1. 点击重命名按钮
2. 打开重命名对话框
3. 输入新标题
4. 调用 `PATCH /api/chats/[id]/title`
5. 更新数据库和 UI

### Flow - 删除聊天
1. 点击删除按钮
2. 显示确认对话框
3. 确认后调用 `DELETE /api/chats/[id]`
4. 级联删除所有消息和投票
5. 从侧边栏移除
6. 导航回首页

### Flow - 切换可见性
1. 点击可见性按钮
2. 切换 public/private
3. 调用 `PATCH /api/chats/[id]/visibility`
4. 更新数据库和 UI
5. public 聊天可被他人访问

### Core Modules
- `app/composables/useChatActions.ts` - 操作逻辑
- `app/components/ModalRename.vue` - 重命名对话框
- `app/components/ModalConfirm.vue` - 确认对话框
- `app/components/chat/ChatVisibility.vue` - 可见性切换
- `server/api/chats/[id]/title.patch.ts`
- `server/api/chats/[id].delete.ts`
- `server/api/chats/[id]/visibility.patch.ts`

### Key Entities
- **Chat**: 聊天会话（title, visibility）
- **Message**: 关联消息（级联删除）
- **Vote**: 关联投票（级联删除）

### State Transitions
- 重命名: 显示对话框 → 输入标题 → 保存 → 更新 UI
- 删除: 确认对话框 → 删除数据库 → 移除 UI → 导航离开
- 可见性: 切换状态 → 保存 → 更新 UI

### Related Configs
- `NUXT_SESSION_PASSWORD` - 会话验证

### Related Permissions
- 需要认证
- 仅所有者可操作
- public 聊天可被他人查看但不能编辑

### Related Integrations
- Turso/SQLite - 数据持久化

### Common Failure Points
- 非所有者尝试操作（权限错误）
- 删除时数据库级联失败
- 网络中断导致操作未完成

### Validation Steps
1. 重命名聊天，验证标题更新
2. 切换可见性，验证设置生效
3. 删除聊天，验证从列表移除
4. 验证级联删除（消息、投票）
5. 验证非所有者无法操作
