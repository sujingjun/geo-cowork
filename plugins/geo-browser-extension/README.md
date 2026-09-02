# GEO 友好电商站点生成系统

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

通过 AI 对话生成 GEO 友好的电商站点系统。用户可以授权亚马逊店铺，通过对话生成优化的单页商品站点，自动配置 SEO/GEO 优化。

## 核心功能

### AI 驱动的站点生成
- 🤖 **对话式站点创建** - 通过自然语言对话创建电商站点
- 🛍️ **亚马逊商品集成** - 连接亚马逊店铺，自动同步商品数据
- 🎨 **多模板支持** - Grid、List、Hero 三种布局模板
- 🔍 **SEO/GEO 优化** - 自动生成优化的 meta 标签和 Schema.org 标记

### 原 AI 聊天功能
- ⚡️ **流式 AI 消息** - 基于 [AI SDK](https://ai-sdk.dev) 的流式对话，支持思考/推理模式
- 🤖 **多模型支持** - GPT-4o、Claude 3.7 Sonnet、DeepSeek Chat/Reasoner（通过 [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) 或直连）
- 🔍 **Web 搜索** - 内置搜索工具（Anthropic、OpenAI）
- 📊 **图表和天气** - 工具调用与丰富的 UI 渲染
- 🔐 **认证** - GitHub OAuth（使用 [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)）
- 💾 **聊天历史** - PostgreSQL 数据库（本地默认使用 PGlite，生产环境可使用 `DATABASE_URL`）和 [Drizzle ORM](https://orm.drizzle.team)
- 📎 **文件上传** - 拖放上传（使用 [NuxtHub Blob](https://hub.nuxt.com/docs/blob)，需要认证）
- ✨ **Markdown 渲染** - 流式代码高亮（通过 [Comark](https://comark.dev)）

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 数据库迁移

```bash
pnpm db:migrate
```

### 3. 初始化测试数据

```bash
# 启动开发服务器
pnpm dev

# 在另一个终端初始化测试数据
pnpm db:seed
```

这将创建：
- 2 个测试用户
- 2 个测试店铺
- 20 个测试商品（12个科技 + 8个家居）
- 3 个测试站点（Grid、List、Hero 模板）

详细说明见 [docs/数据-初始化.md](docs/数据-初始化.md)

### 4. 访问测试站点

```
http://localhost:3000/sites/ultimate-tech-gadgets-2025  (Grid 模板)
http://localhost:3000/sites/essential-kitchen-appliances  (List 模板)
http://localhost:3000/sites/smart-home-revolution  (Hero 模板)
```

## 用户旅程

1. **授权店铺** → 用户通过 OAuth 授权亚马逊店铺（测试环境下使用模拟数据）
2. **对话生成** → 用户在聊天中输入“生成一个 xx 主题的站点”
3. **数据读取** → Agent 后台读取亚马逊商品数据（使用 `get_products` 工具）
4. **站点生成** → 使用 Nuxt UI 组件生成 GEO 友好单页（使用 `generate_site` 工具）
5. **商品跳转** → 点击商品卡片跳转到亚马逊商品详情页

## 项目结构

```
server/
  ├── api/
  │   ├── stores.get.ts          # 获取店铺列表
  │   ├── stores.post.ts         # 启动 Amazon OAuth
  │   ├── stores/[id]/sync.post.ts  # 同步商品
  │   ├── products.get.ts        # 获取商品列表
  │   ├── sites.get.ts           # 获取站点列表
  │   └── sites/[slug].get.ts    # 获取站点详情
  ├── db/
  │   ├── schema.ts              # 数据库模式
  │   └── seed.ts                # 测试数据脚本
  ├── routes/
  │   └── auth/amazon.get.ts     # Amazon OAuth 回调
  └── utils/
      └── amazon-sp-api.ts       # Amazon SP-API 客户端

shared/
  └── utils/
      └── tools/
          ├── get-products.ts    # AI 工具：获取商品
          └── generate-site.ts   # AI 工具：生成站点

app/
  ├── pages/
  │   └── sites/
  │       ├── index.vue          # 站点列表页（待开发）
  │       └── [slug].vue         # 站点预览页（待开发）
  └── components/
      └── site/
          ├── ProductCard.vue    # 商品卡片（待开发）
          ├── GridLayout.vue     # 网格布局（待开发）
          ├── ListLayout.vue     # 列表布局（待开发）
          └── HeroLayout.vue     # Hero 布局（待开发）
```

## 开发文档

- [docs/文档-索引.md](docs/文档-索引.md) - docs 文档总览
- [docs/数据-初始化.md](docs/数据-初始化.md) - 数据初始化指南
- [docs/生产-部署.md](docs/生产-部署.md) - Supabase + Vercel 生产发布流程
- [docs/前端-开发-准备.md](docs/前端-开发-准备.md) - 前端开发准备指南
- [docs/deepseek-快速-开始.md](docs/deepseek-快速-开始.md) - DeepSeek 快速开始
- [docs/deepseek-配置-指南.md](docs/deepseek-配置-指南.md) - DeepSeek 完整配置指南
- [AGENTS.md](AGENTS.md) - 项目架构和业务逻辑

---

## 原模板功能

> 以下是原 Nuxt AI Chatbot Template 的功能和部署说明

## Quick Start

```bash
npm create nuxt@latest -- -t ui/chat
```

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fchat&repository-name=chat&env=NUXT_OAUTH_GITHUB_CLIENT_ID%2CNUXT_OAUTH_GITHUB_CLIENT_SECRET%2CNUXT_SESSION_PASSWORD&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22tursocloud%22%2C%22productSlug%22%3A%22database%22%2C%22protocol%22%3A%22storage%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D&demo-title=Nuxt+Chat+Template&demo-description=An+AI+chatbot+template+with+GitHub+authentication+and+persistent+chat+history+powered+by+Vercel+AI+SDK.&demo-url=https%3A%2F%2Fchat-template.nuxt.dev&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fchat-dark.png)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

Run database migrations:

```bash
pnpm db:migrate
```

> [!NOTE]
> This project now uses NuxtHub PostgreSQL. Local development falls back to embedded PGlite automatically. For external databases, set `DATABASE_URL`, `POSTGRES_URL`, or `POSTGRESQL_URL`.

### AI Integration

This template uses the [Vercel AI SDK](https://ai-sdk.dev/) for streaming AI responses with support for multiple providers through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway). When deployed on Vercel, the AI Gateway is configured automatically.

**Supported AI Models:**
- 🌐 **Vercel AI Gateway** - Unified access to multiple providers (recommended)
- 👙 **OpenAI** - GPT-4o, GPT-4.1, GPT-4o Mini, GPT-4.1 Mini
- 🏛️ **Anthropic** - Claude 3.7 Sonnet
- 🧠 **DeepSeek** - DeepSeek V4 Pro, DeepSeek V4 Flash (💡 High performance + Low cost)
- 🌐 **Google** - Gemini models

#### Quick Setup with DeepSeek (Recommended)

DeepSeek offers excellent performance at a fraction of the cost:

```bash
# 1. Get API key from https://platform.deepseek.com/
# 2. Add to .env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 3. Test configuration
pnpm test:deepseek
```

📚 [DeepSeek Quick Start Guide](docs/deepseek-快速-开始.md)

For local development, set your API key in `.env`:

```bash
AI_GATEWAY_API_KEY=<your-vercel-ai-gateway-api-key>
# or use individual provider keys
OPENAI_API_KEY=<your-openai-api-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
DEEPSEEK_API_KEY=<your-deepseek-api-key>
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-api-key>
```

> [!TIP]
> With [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), you don't need individual API keys for OpenAI, Anthropic, etc. It provides a unified API to access hundreds of models through a single endpoint with automatic load balancing, fallbacks, and spend monitoring.

### Authentication (Optional)

This template uses [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) for authentication with GitHub and Google OAuth.

To enable authentication, configure either or both OAuth providers and set:

```bash
NUXT_OAUTH_GITHUB_CLIENT_ID=<your-github-oauth-app-client-id>
NUXT_OAUTH_GITHUB_CLIENT_SECRET=<your-github-oauth-app-client-secret>
NUXT_OAUTH_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
NUXT_SESSION_PASSWORD=<your-password-minimum-32-characters>
```

Amazon seller authorization uses Amazon Selling Partner OAuth. Configure these when connecting real Amazon stores:

```bash
NUXT_OAUTH_AMAZON_CLIENT_ID=<your-amazon-lwa-client-id>
NUXT_OAUTH_AMAZON_CLIENT_SECRET=<your-amazon-lwa-client-secret>
AMAZON_SP_API_APPLICATION_ID=<your-selling-partner-application-id>
AMAZON_SP_API_ENVIRONMENT=production
AMAZON_SP_API_AUTH_VERSION=beta # only while the app is in Draft
AMAZON_SELLER_CENTRAL_AUTHORIZE_URL=https://sellercentral.amazon.com/apps/authorize/consent
AMAZON_SP_API_REGION=us-east-1
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER
AMAZON_SP_API_ENDPOINT=https://sellingpartnerapi-na.amazon.com
```

For a sandbox app, set `AMAZON_SP_API_ENVIRONMENT=sandbox` and add the token created from Solution Provider Portal as `AMAZON_SP_API_SANDBOX_REFRESH_TOKEN`.

See [Amazon Store Authorization](docs/店铺-授权-实现.md) for callback URLs, regional settings, and SP-API product sync prerequisites.

### Blob Storage (Optional)

This template uses [NuxtHub Blob](https://hub.nuxt.com/docs/blob) for file uploads, which supports multiple storage drivers:

- **Local filesystem** (default for development, stored in `.data/blob`)
- **[Vercel Blob](https://vercel.com/docs/vercel-blob)** (auto-configured when deployed to Vercel)
- **[Cloudflare R2](https://hub.nuxt.com/docs/blob#set-a-driver)** (when deployed to Cloudflare)
- **[Amazon S3](https://hub.nuxt.com/docs/blob#set-a-driver)** (with manual configuration)

For **Vercel Blob**, assign a Blob Store to your project from the Vercel dashboard (Project → Storage), then set the token for local development:

```bash
BLOB_READ_WRITE_TOKEN=<your-vercel-blob-token>
```

> [!NOTE]
> File uploads require authentication. See the [NuxtHub Blob documentation](https://hub.nuxt.com/docs/blob#set-a-driver) for configuring other storage drivers.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
