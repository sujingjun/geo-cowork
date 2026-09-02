# Change Impact Guide

## Database Schema Changes

### Impact Scope
- **Affected**: 所有数据库操作、API 路由、类型定义、组件
- **Risk Level**: 🔴 High - 可能导致数据丢失或应用崩溃

### Change Hotspots
- `server/db/schema.ts` - 数据库模式定义
- `server/db/migrations/` - 迁移脚本
- `shared/types/db.d.ts` - 类型定义
- 所有使用受影响表的 API 路由

### Affected Flows
- 聊天创建和查询
- 消息保存和加载
- 用户认证和会话
- 投票功能

### Upstream Dependencies
- Drizzle ORM 配置
- SQLite/Turso 连接

### Downstream Dependencies
- 所有 API 路由
- 所有数据库查询
- 前端类型定义

### Suggested Validation
1. ✅ 运行 `pnpm db:generate` 生成迁移
2. ✅ 检查生成的 SQL 迁移文件
3. ✅ 在开发环境运行 `pnpm db:migrate`
4. ✅ 验证旧数据兼容性（如有现有数据）
5. ✅ 运行 `pnpm typecheck` 检查类型错误
6. ✅ 测试受影响的 API 端点
7. ✅ 检查前端组件是否正常工作
8. ✅ 更新 `assets/module-graph.json` 中的数据库依赖

### Related Tests
- 数据库查询测试
- API 集成测试
- 类型检查

---

## API Route Changes

### Impact Scope
- **Affected**: 前端组件、组合式函数、其他 API 路由
- **Risk Level**: 🟡 Medium - 可能破坏前后端集成

### Change Hotspots
- `server/api/**/*.ts` - API 路由实现
- `app/composables/*.ts` - API 调用逻辑
- 前端组件中的 $fetch 调用

### Affected Flows
- 对应业务场景的完整流程
- 依赖该 API 的其他功能

### Upstream Dependencies
- 数据库模式
- 认证和权限
- 外部服务（AI Gateway, Blob 存储）

### Downstream Dependencies
- 前端组件
- 组合式函数
- 其他 API 路由（如果有依赖）

### Suggested Validation
1. ✅ 检查 API 签名变更（参数、返回值）
2. ✅ 更新前端调用代码
3. ✅ 测试 API 端点（手动或自动）
4. ✅ 检查错误处理逻辑
5. ✅ 验证认证和权限检查
6. ✅ 更新 `references/api-reference.md`
7. ✅ 更新相关业务场景文档
8. ✅ 运行端到端测试

### Related Tests
- API 单元测试
- 集成测试
- 前端组件测试

---

## AI Model/Tool Changes

### Impact Scope
- **Affected**: AI 响应流程、工具调用、UI 渲染
- **Risk Level**: 🟡 Medium - 可能影响用户体验

### Change Hotspots
- `server/api/chats/[id].post.ts` - AI 流式响应
- `app/components/ModelSelect.vue` - 模型选择
- `app/components/chat/tool/*.vue` - 工具 UI 组件
- 工具定义文件（如果添加新工具）

### Affected Flows
- AI 对话场景
- 工具调用场景
- 模型切换场景

### Upstream Dependencies
- Vercel AI Gateway 配置
- AI 模型可用性
- 工具 API（搜索、天气等）

### Downstream Dependencies
- 消息渲染组件
- 工具结果 UI
- 用户体验

### Suggested Validation
1. ✅ 测试新模型的流式响应
2. ✅ 验证工具调用是否正常
3. ✅ 检查工具结果 UI 渲染
4. ✅ 测试错误处理（模型不可用）
5. ✅ 验证多模态输入（文件上传）
6. ✅ 更新模型列表和描述
7. ✅ 更新 `references/patterns.md` 中的工具集成模式
8. ✅ 测试不同模型的响应质量

### Related Tests
- AI 流式响应测试
- 工具调用测试
- UI 渲染测试

---

## Authentication/Permission Changes

### Impact Scope
- **Affected**: 登录流程、会话管理、权限检查、保护的路由
- **Risk Level**: 🔴 High - 安全关键

### Change Hotspots
- `server/routes/auth/*.ts` - 认证路由
- `shared/types/auth.d.ts` - 用户类型
- API 路由中的权限检查
- 受保护的页面和组件

### Affected Flows
- 登录和登出
- 会话验证
- 文件上传
- 聊天管理
- 所有需要认证的操作

### Upstream Dependencies
- GitHub OAuth 配置
- 会话加密密钥
- 数据库 users 表

### Downstream Dependencies
- 所有受保护的 API
- 所有需要认证的 UI
- 用户相关功能

### Suggested Validation
1. ✅ 测试登录流程
2. ✅ 验证会话持久性
3. ✅ 测试权限检查（所有者验证）
4. ✅ 验证登出功能
5. ✅ 测试未认证用户访问保护资源
6. ✅ 检查会话过期处理
7. ✅ 更新 `references/entrypoints.md` 中的认证入口
8. ✅ 运行安全测试

### Related Tests
- 认证集成测试
- 权限检查测试
- 会话管理测试

---

## Component/UI Changes

### Impact Scope
- **Affected**: 使用该组件的页面、其他组件、用户界面
- **Risk Level**: 🟢 Low - 通常限于前端

### Change Hotspots
- `app/components/**/*.vue` - 组件文件
- `app/pages/**/*.vue` - 页面（如使用该组件）
- `app/layouts/*.vue` - 布局（如使用该组件）

### Affected Flows
- 包含该组件的业务场景
- 用户交互流程

### Upstream Dependencies
- 组合式函数
- API 调用
- 全局状态

### Downstream Dependencies
- 父组件
- 页面
- 用户体验

### Suggested Validation
1. ✅ 测试组件渲染
2. ✅ 验证 Props 和 Events
3. ✅ 检查响应式布局（移动端/桌面端）
4. ✅ 测试主题切换（深色/浅色）
5. ✅ 验证无障碍性（键盘导航、屏幕阅读器）
6. ✅ 检查使用该组件的所有页面
7. ✅ 更新 `references/api-reference.md` 中的组件文档
8. ✅ 运行组件单元测试

### Related Tests
- 组件单元测试
- 快照测试
- 无障碍性测试

---

## Configuration Changes

### Impact Scope
- **Affected**: 应用行为、部署、集成、环境变量
- **Risk Level**: 🟡 Medium - 可能影响运行时行为

### Change Hotspots
- `nuxt.config.ts` - Nuxt 配置
- `.env` / `.env.example` - 环境变量
- `package.json` - 依赖和脚本
- `tsconfig.json` - TypeScript 配置
- `eslint.config.mjs` - ESLint 配置

### Affected Flows
- 应用启动和初始化
- 构建和部署
- 开发环境设置

### Upstream Dependencies
- 依赖包版本
- 外部服务配置

### Downstream Dependencies
- 所有模块和组件
- 构建产物
- 运行时行为

### Suggested Validation
1. ✅ 更新 `.env.example`（如有新环境变量）
2. ✅ 更新 AGENTS.md 和 README.md 文档
3. ✅ 测试开发环境启动
4. ✅ 测试生产构建
5. ✅ 验证新配置生效
6. ✅ 检查依赖兼容性（如更新版本）
7. ✅ 更新部署文档
8. ✅ 在生产环境验证

### Related Tests
- 构建测试
- 配置验证测试
- 集成测试

---

## Storage/Blob Changes

### Impact Scope
- **Affected**: 文件上传、文件管理、存储配置
- **Risk Level**: 🟡 Medium - 可能影响文件功能

### Change Hotspots
- `server/api/upload/*.ts` - 上传 API
- `app/composables/useFileUpload.ts` - 上传逻辑
- NuxtHub Blob 配置
- 存储驱动配置（Vercel Blob / R2 / S3）

### Affected Flows
- 文件上传场景
- 文件预览和管理
- 多模态对话

### Upstream Dependencies
- Blob 存储令牌
- 存储驱动配置
- NuxtHub 配置

### Downstream Dependencies
- 上传组件
- 文件预览组件
- AI 多模态输入

### Suggested Validation
1. ✅ 测试文件上传
2. ✅ 验证文件 URL 访问
3. ✅ 测试文件删除
4. ✅ 检查存储配额和限制
5. ✅ 验证不同存储驱动
6. ✅ 测试大文件上传
7. ✅ 更新 `references/integrations.md` 中的存储集成
8. ✅ 验证生产环境配置

### Related Tests
- 上传功能测试
- 文件管理测试
- 集成测试

---

## Dependency Updates

### Impact Scope
- **Affected**: 整个应用、构建流程、运行时行为
- **Risk Level**: 🟡 Medium to 🔴 High - 取决于更新范围

### Change Hotspots
- `package.json` - 依赖版本
- `pnpm-lock.yaml` - 锁定文件
- 使用更新依赖的所有代码

### Affected Flows
- 可能影响任何功能

### Upstream Dependencies
- 依赖包的上游依赖
- 破坏性变更（Breaking Changes）

### Downstream Dependencies
- 所有使用该依赖的模块
- 构建和运行时

### Suggested Validation
1. ✅ 阅读依赖的变更日志（CHANGELOG）
2. ✅ 检查破坏性变更
3. ✅ 运行 `pnpm install`
4. ✅ 运行 `pnpm typecheck`
5. ✅ 运行 `pnpm lint`
6. ✅ 运行所有测试
7. ✅ 测试关键功能
8. ✅ 在生产环境验证
9. ✅ 更新文档（如有 API 变更）

### Related Tests
- 全套测试
- 回归测试
- 集成测试

---

## Migration Validation Checklist

### Before Making Changes
- [ ] 阅读相关文档和现有代码
- [ ] 查询 nuxt-dev skill 了解影响范围
- [ ] 识别上游和下游依赖
- [ ] 确定需要更新的文档

### During Development
- [ ] 遵循代码规范和模式
- [ ] 添加必要的类型定义
- [ ] 实现错误处理
- [ ] 编写或更新测试

### After Code Changes
- [ ] 运行类型检查和代码检查
- [ ] 运行相关测试
- [ ] 手动测试受影响的功能
- [ ] 更新 API 参考文档
- [ ] 更新业务场景文档
- [ ] 更新变更影响文档
- [ ] 更新模块依赖图

### Before Deployment
- [ ] 在开发环境完整测试
- [ ] 验证数据库迁移（如有）
- [ ] 检查环境变量配置
- [ ] 运行构建流程
- [ ] 在预生产环境验证（如有）

### After Deployment
- [ ] 监控错误和日志
- [ ] 验证关键功能正常
- [ ] 检查性能指标
- [ ] 准备回滚方案（如需要）
