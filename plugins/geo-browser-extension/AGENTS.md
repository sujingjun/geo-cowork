---
name: agent
description: 面向代理式编码助手的项目操作手册（Nuxt 4 GEO 电商站点生成与 AI Chat）
---

# AGENTS 指南

## 项目概览

- 这是一个 Nuxt 4 全栈项目，核心能力包括 AI 对话、Amazon / Shopify等平台 店铺授权、商品同步、GEO/SEO 友好的站点生成。
- 前端栈：Vue 3、TypeScript、Nuxt UI、Tailwind CSS 4。
- 后端栈：Nitro server routes、Drizzle ORM、NuxtHub PostgreSQL / PGlite、Zod。
- AI 栈：Vercel AI SDK，接入 OpenAI、Anthropic、Google、DeepSeek 与自定义 tools。

## 关键目录

- `app/`：页面、布局、组件、composables、客户端工具。
- `app/pages/`：页面入口；优先从这里定位功能。
- `app/components/`：可复用 UI 组件，默认 `<script setup lang="ts">`。
- `app/composables/`：前端复用逻辑与请求封装。
- `server/api/`：Nitro API 路由。
- `server/routes/`：OAuth 回调等非 `/api` 服务端路由。
- `server/db/schema.ts`：数据库 schema 单一事实来源。
- `shared/`：前后端共享模型、类型、工具。
- `docs/`：项目文档；新增文档优先放这里。

## 环境与启动

- Node 要求：`22.x`
- 包管理器：`pnpm@11.1.3`
- 安装依赖：`pnpm install`
- 安装后自动执行：`pnpm postinstall` -> `nuxt prepare`
- 启动开发环境：`pnpm dev`
- 预览生产构建：`pnpm preview`
- 生产启动：`pnpm start`

## 构建、检查与发布命令

- 完整构建：`pnpm build`
- 代码检查：`pnpm lint`
- 类型检查：`pnpm typecheck`
- DeepSeek 冒烟测试：`pnpm test:deepseek`
- 本地环境变量检查：`pnpm check:env`
- 生产环境变量检查：`pnpm check:env:production`
- 拉取 Vercel 生产配置：`pnpm vercel:pull:prod`
- 生产部署：`pnpm deploy:prod`
- 预构建后部署：`pnpm deploy:prod:prebuilt`

## 数据库命令

- 生成 Drizzle 产物：`pnpm db:generate`
- 执行迁移：`pnpm db:migrate`
- 初始化测试数据：`pnpm db:seed`
- 执行临时 SQL：`pnpm db:sql`
- 查看当前表：`pnpm db:tables`
- 注意：`pnpm db:seed` 依赖开发服务器已启动。

## 测试现状与单测命令

- 仓库已安装 `vitest`、`@vue/test-utils`、`happy-dom`、`@nuxt/test-utils`。
- 当前没有 `pnpm test` 脚本；请直接使用 `pnpm exec vitest ...`。
- 当前已存在测试文件：`server/db/schema.test.ts`。
- 运行全部测试：`pnpm exec vitest run`
- 运行单个测试文件：`pnpm exec vitest run path/to/file.test.ts`
- 运行单个测试用例：`pnpm exec vitest run path/to/file.test.ts -t "case name"`
- 单文件 watch：`pnpm exec vitest path/to/file.test.ts`
- 覆盖率：`pnpm exec vitest run --coverage`
- 本仓库单文件示例：`pnpm exec vitest run server/db/schema.test.ts`

## 文档维护原则
- ✅ 所有 AI 生成的文档必须放在 `/docs` 目录
- ✅ 文档名称使用`kebab-case`，使用中文。
- ✅ 重要更新需要在本文档（AGENTS.md）中索引
- ✅ 配置类文档需要包含示例和故障排除
- ✅ 更新类文档需要说明变更原因和影响范围

## 推荐阅读顺序

- 先读：`AGENTS.md`
- Amazon 沙箱授权、App 客户端与服务说明：`docs/店铺-授权-实现.md`
- 再读： `/docs`相关文档
- 然后看：`README.md`、`package.json`、`nuxt.config.ts`、`eslint.config.mjs` 与现有代码风格为准
- 修改功能前，从页面或 API 入口追踪到 composable / shared util / DB schema。

## 架构约定

- Vue 统一使用 Composition API。
- Vue SFC 默认使用 `<script setup lang="ts">`。
- 页面与 layout 保持轻量，复用逻辑下沉到 composables。
- 通用 UI 放在 `app/components/`，共享逻辑优先复用 `shared/`。
- 后端资源接口就近放在 `server/api/`。
- 数据结构变化先改 `server/db/schema.ts`，再同步 API、shared types、前端映射。
- AI tool 注册入口在 `server/api/chats/[id].post.ts`，tool schema 在 `shared/utils/tools/`。

## 导入与模块边界

- 只使用 ESM import/export。
- 单独写 `import type` 时，放在对应 value import 前面。
- 优先使用 Nuxt 别名，例如 `~/...`、`#shared/...`，避免深层相对路径。
- 不要无必要地在 `hub:db` + Drizzle 之外再套新的数据访问抽象。
- 前后端共用模型、工具、类型时，优先复用 `shared/` 中现有模块。

## 格式与代码风格

- 以 `eslint.config.mjs` 与 `nuxt.config.ts` 中的配置为准。
- 使用单引号。
- 不使用分号。
- 不使用 trailing commas。
- 大括号风格使用 `1tbs`。
- Vue 模板单行最多 3 个属性。
- `console.log` 会触发警告；仅允许 `console.warn` 与 `console.error`。
- 注释保持克制，只解释意图、限制或不明显的实现。

## TypeScript 约定

- 应用代码默认使用 TypeScript，不新增普通 JS 业务文件。
- 优先复用共享类型、Drizzle 类型、Zod 推导类型。
- 避免 `any`；碰到存量 `any` 时尽量顺手收窄。
- 服务端参数与请求体校验优先使用 Zod。
- 共享数据结构优先定义清晰的 `type` / `interface`，避免重复声明。

## 命名约定

- 组件文件：PascalCase，例如 `ProductCard.vue`。
- composables：`useXxx.ts`，例如 `useStores.ts`。
- 变量与函数：`camelCase`。
- 类型与接口：`PascalCase`。
- API 路由文件遵循 Nuxt/Nitro 命名，例如 `server/api/chats/[id].post.ts`。
- SQL 层字段保持 `snake_case`，应用层通过 Drizzle 使用 camelCase。

## Vue / Nuxt 实践

- 读操作和页面级缓存优先使用 `useFetch` / `useLazyFetch`。
- 用户主动触发的写操作优先使用 `$fetch`。
- 修改写接口时保留现有 `useCsrf()` 头部注入模式。
- 变更列表或会话页面时，检查 `refreshNuxtData(...)` 与 `useNuxtData(...)` 是否需要同步更新。
- 能用 `computed` 推导的状态，不要复制成多份 `ref`。
- 组件过大时优先拆分职责，不要继续堆条件分支。
- UI 优先复用 Nuxt UI 现有原语与模式。

## 服务端与错误处理

- 可选登录态使用 `getUserSession(event)`。
- 必须登录的接口使用 `requireUserSession(event)`。
- 归属校验默认沿用 `session.user?.id || session.id` 模式，除非有明确迁移方案。
- 路由参数校验优先使用 `getValidatedRouterParams(..., z.object(...).parse)`。
- 请求体校验优先使用 `readValidatedBody(..., schema.parse)`。
- 可预期错误使用 `createError({ statusCode, statusMessage/message })` 抛出。
- 不要依赖前端隐藏按钮做权限控制；后端必须做真实校验。
- Nitro handler 中，业务失败优先返回明确 `4xx`，不要吞异常。
- 真正的异常可以先 `console.error` 再返回 `500`。
- 前端交互失败优先通过 toast 给出可执行提示。

## 数据库与安全

- 所有 schema 变更先从 `server/db/schema.ts` 开始。
- schema 修改后，按需运行 `pnpm db:generate` 与 `pnpm db:migrate`。
- 检查索引、唯一约束、外键删除策略是否仍然合理。
- 检查受影响的 handlers、shared types、前端字段映射是否同步更新。
- 所有密钥必须放环境变量，不要硬编码。
- OAuth、AI provider、Blob 等配置都从 `runtimeConfig` / 环境变量读取。
- 上传、聊天写操作、可见性切换等请求必须保留 CSRF 防护。

## 代理工作流

- 先做小范围阅读，再动手，不要一上来全仓大搜大改。
- 先理解完整链路：页面 / 组件 -> composable -> API -> shared util -> DB。
- 优先最小化、定点修改，避免无关重构。
- 不要覆盖或回退用户已有改动，除非明确要求。
- 如果仓库是脏工作区，只处理与你任务直接相关的文件。
- 只改文档时做内容自检即可；不要声称代码测试通过，除非刚实际运行过。
- 改动运行时代码时，至少考虑 `pnpm typecheck`；改动构建链路或依赖时优先补跑 `pnpm build`。
- 完成后明确说明：改了哪些文件、做了什么、运行了哪些验证。
