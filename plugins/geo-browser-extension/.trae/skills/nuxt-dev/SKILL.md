---
name: nuxt-dev
description: 当需要理解、定位、开发、分析代码时优先使用此技能。适用场景:(1) 查找功能实现："在哪里"、"找到"、"定位"、"查看"、"搜索"某个功能、模块、API、函数、类；(2) 代码导航："如何实现"、"怎么写的"、"代码位置"、"文件在哪"；(3) 开发任务："添加功能"、"修改代码"、"优化性能"、"重构模块"、"调试问题"前需要了解现有结构；(4) 架构理解：分析"模块关系"、"依赖关系"、"数据流向"、"组件交互"；(5) 项目探索：新接手项目、理解项目结构、查找配置文件、定位入口文件；(6) 业务关联：分析"某个场景从哪里进入"、"改动会影响哪些流程"、"配置或权限控制了哪些功能"。核心能力：快速索引大型代码库、精准定位代码位置、串联业务场景与代码路径、可视化模块依赖、提供导航指引。触发关键词：找、查、在哪、定位、搜索、实现、开发、修改、添加、优化、重构、调试、分析、理解、探索、影响、场景、流程、入口、链路。
---

# Project Context Indexer

## What is This?

**项目导航和上下文检索中心** - 提供快速查找、模块理解、场景追踪和变更影响评估。

**核心组件**:
- `references/` - 详细文档（API、术语、模式、场景、影响、集成、入口点）
- `scripts/` - 自动化脚本（依赖分析、未使用代码检测、目录树生成）
- `assets/` - 可视化资产（架构图、数据流图、业务流程图、模块依赖图）

**使用场景**: 查找文件、理解结构、定位功能、追踪场景、评估变更影响

**与 AGENTS.md 关系**: AGENTS.md 提供概念和工作流，SKILL.md 提供导航索引和代码定位

## Skill 技能协作

> 💡 **技能协作**：开发 Nuxt 项目时，本 skill 会自动协同以下 skills：
> - `nuxt` - Nuxt 核心特性（服务端、路由、中间件、配置）
> - `vue-best-practices` - Vue 最佳实践和组件规范
> - `vueuse` - VueUse 组合式工具
> - `frontend-design` - UI 设计与实现
> - `seo-geo` - SEO & GEO 优化（搜索引擎和 AI 搜索引擎优化）
> **设计规范**：`frontend-design` skill 需参考的 UI 设计规范：[UI 设计规范](./references/ui-design.md) - 色彩、字体、间距、组件设计系统
> 
> **SEO/GEO 规范**：开发面向用户的页面时，参考 [SEO/GEO 实施指南](./references/seo-geo-guide.md) - Meta 标签、结构化数据、AI 搜索优化

## Quick Navigation Index

📖 **Documentation References** (Details inside):
- `references/api-reference.md` - API、公共接口、关键函数、导出接口
- `references/glossary.md` - 项目术语和领域概念
- `references/patterns.md` - 代码模式、约定和模板
- `references/business-scenarios.md` - 场景卡片，连接用户、触发器、入口点、模块和验证
- `references/change-impact.md` - 变更热点、影响流程、风险和验证范围
- `references/integrations.md` - 外部服务、队列、webhooks、SDK 和系统边界
- `references/entrypoints.md` - UI、API、CLI、作业、webhook、队列、扩展和引导入口点
- `references/ui-design.md` - UI 设计规范（色彩、字体、间距、组件设计系统）
- `references/seo-geo-guide.md` - SEO/GEO 实施指南（Meta 标签、结构化数据、AI 搜索优化）

🔧 **Automation Scripts** (Ready to run):
- `scripts/analyze-deps.sh` - 依赖和图分析工具
- `scripts/find-unused.sh` - 未使用代码检测器
- `scripts/generate-tree.sh` - 目录树生成器

🏗️ **Visual Assets** (Diagrams and graphs):
- `assets/architecture.txt` - 系统架构（ASCII）
- `assets/data-flow.txt` - 数据流路径
- `assets/business-flow.txt` - 业务场景流程
- `assets/module-graph.json` - 模块依赖、场景标签、运行时关系和模块索引链接（JSON）

## Project Structure Summary

### Frontend (app/)
- `app.vue` - 应用入口，SEO 元数据，主题配置
- `app.config.ts` - 应用配置（UI 颜色、主题）
- `pages/` - 页面路由
  - `index.vue` - 首页，创建新聊天
  - `chat/[id].vue` - 聊天详情页，流式对话
- `components/` - Vue 组件
  - `Navbar.vue` - 导航栏
  - `UserMenu.vue` - 用户菜单
  - `ModelSelect.vue` - 模型选择器
  - `Logo.vue`, `ModalConfirm.vue`, `ModalRename.vue` - 通用组件
  - `chat/` - 聊天相关组件
    - `ChatTitle.vue`, `ChatVisibility.vue`, `Indicator.vue` - 聊天 UI
    - `Files.vue`, `FileUploadButton.vue`, `FilePreview.vue` - 文件上传
    - `SourceLink.vue` - 来源链接
    - `message/` - 消息组件
      - `MessageContent.vue`, `MessageActions.vue`, `MessageEdit.vue`
    - `tool/` - 工具 UI 组件
      - `Weather.vue`, `Chart.vue`, `Sources.vue`
  - `drag-drop/` - 拖放组件
    - `Overlay.vue` - 拖放覆盖层
- `composables/` - 组合式函数
  - `useChatActions.ts` - 聊天操作（创建、删除、重命名等）
  - `useChats.ts` - 聊天数据管理
  - `useFileUpload.ts` - 文件上传逻辑
  - `useModels.ts` - 模型管理
- `layouts/` - 布局
  - `default.vue` - 默认布局
- `middleware/` - 中间件
  - `transitions.global.ts` - 全局过渡效果
- `utils/` - 工具函数
  - `ai.ts` - AI 相关工具（消息合并等）
  - `url.ts` - URL 处理
  - `tool.ts` - 工具调用辅助
- `assets/` - 静态资源
  - `css/main.css` - 全局样式

### Backend (server/)
- `api/` - API 路由
  - `chats.get.ts` - 获取聊天列表
  - `chats.post.ts` - 创建新聊天
  - `chats/[id].get.ts` - 获取单个聊天
  - `chats/[id].post.ts` - 发送消息（流式响应）
  - `chats/[id].delete.ts` - 删除聊天
  - `chats/[id]/messages.delete.ts` - 删除消息
  - `chats/[id]/title.patch.ts` - 更新聊天标题
  - `chats/[id]/visibility.patch.ts` - 更新可见性
  - `chats/[id]/votes.get.ts` - 获取投票
  - `chats/[id]/votes.post.ts` - 提交投票
  - `upload/[chatId].put.ts` - 上传文件
  - `upload/[...pathname].delete.ts` - 删除文件
- `routes/` - 服务器路由
  - `auth/github.get.ts` - GitHub OAuth 认证
- `db/` - 数据库
  - `schema.ts` - 数据库模式（users, chats, messages, votes）
  - `migrations/` - 数据库迁移文件

### Shared (shared/)
- `types/` - 共享类型
  - `db.d.ts` - 数据库类型（Chat, Message, Vote）
  - `auth.d.ts` - 认证类型（User）
- `utils/` - 共享工具函数

### Configuration
- `nuxt.config.ts` - Nuxt 配置（模块、主题、ESLint 等）
- `tsconfig.json` - TypeScript 配置
- `package.json` - 依赖管理和脚本
- `pnpm-workspace.yaml` - pnpm 工作区配置
- `eslint.config.mjs` - ESLint 配置

### SEO/GEO 优化
- **@nuxtjs/seo**: SEO 优化套件（包含 sitemap, robots 等）
- **nuxt-schema-org**: Schema.org 结构化数据
- **Meta Tags & OG**: 页面元信息和社交分享优化
- **AI 搜索优化**: 针对 ChatGPT、Perplexity、Gemini 等 AI 搜索引擎的内容优化
- **详细配置**: 查看 `references/seo-geo-guide.md` 了解实施细节

### Deployment & CI/CD
- `.github/` - GitHub Actions 工作流（如果存在）
- `renovate.json` - Renovate 自动依赖更新配置

## Quick Lookup Guide

**Q: "在哪里找到 [功能/模块]?"**
→ 查看 `references/api-reference.md` 按功能或导出名称查找
→ 或查看 `assets/module-graph.json` 按模块路径和依赖查找

**Q: "模块如何连接?"**
→ 查看 `assets/module-graph.json` 了解依赖和边类型
→ 查看 `assets/architecture.txt` 了解可视化连接

**Q: "[术语] 是什么意思?"**
→ 查看 `references/glossary.md`

**Q: "如何实现 [模式]?"**
→ 查看 `references/patterns.md`

**Q: "哪个入口点启动这个流程?"**
→ 查看 `references/entrypoints.md`
→ 然后在 `assets/module-graph.json` 中追踪相关模块

**Q: "这个模块支持哪个业务场景?"**
→ 查看 `references/business-scenarios.md`
→ 匹配 `assets/module-graph.json` 中的场景标签

**Q: "这个变更会影响什么?"**
→ 查看 `references/change-impact.md`
→ 验证相关场景、配置、集成和模块索引

**Q: "哪个配置、权限或特性标志控制此行为?"**
→ 查看 `references/entrypoints.md`、`references/business-scenarios.md` 和 `references/change-impact.md`

**Q: "数据从哪里来，流向哪里?"**
→ 查看 `assets/data-flow.txt`
→ 与场景卡片和集成交叉检查

**Q: "涉及哪个外部系统?"**
→ 查看 `references/integrations.md`

**Q: "循环依赖?"**
→ 运行 `scripts/analyze-deps.sh`

**Q: "未使用代码?"**
→ 运行 `scripts/find-unused.sh`

## Helper Scripts Usage

```bash
# 分析项目依赖
.dhcoder/skills/nuxt-dev/scripts/analyze-deps.sh

# 查找未使用代码
.dhcoder/skills/nuxt-dev/scripts/find-unused.sh

# 生成目录树
.dhcoder/skills/nuxt-dev/scripts/generate-tree.sh
```

首次使用需要设置脚本为可执行：
```bash
chmod +x .dhcoder/skills/nuxt-dev/scripts/*.sh
```

## Maintenance Reminder

**保持此技能更新**:
- 添加模块后 → 更新 `assets/module-graph.json`
- 架构变更后 → 更新 `assets/architecture.txt`
- 业务流程变更后 → 更新 `assets/business-flow.txt`
- 添加 API 后 → 更新 `references/api-reference.md`
- 添加入口点或触发器后 → 更新 `references/entrypoints.md`
- 新场景或行为变更后 → 更新 `references/business-scenarios.md` 和 `references/change-impact.md`
- 新术语后 → 更新 `references/glossary.md`
- 定期运行辅助脚本进行验证
