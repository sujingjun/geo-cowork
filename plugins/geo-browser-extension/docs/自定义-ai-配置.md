# 自定义 AI Provider 配置使用说明

## 概述

项目现已支持为 OpenAI 和 Anthropic 配置自定义 API Key 和 Base URL，方便使用代理服务或自部署的兼容端点。

## 支持的模型

### OpenAI 模型
- **GPT-4o** - 最强性能
- **GPT-4.1** - 平衡性能
- **GPT-4o Mini** - 快速响应，性价比高（推荐用于标题生成）
- **GPT-4.1 Mini** - 轻量级模型

### Anthropic 模型
- **Claude 3.7 Sonnet** - 高性能模型

### Embedding 模型（仅用于向量化）
- text-embedding-3-large
- text-embedding-3-small

## 快速开始

### 1. 创建 `.env` 文件

在项目根目录创建 `.env` 文件：

```env
# OpenAI 配置
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_BASE_URL=https://api.openai.com/v1  # 可选

# Anthropic 配置
ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_BASE_URL=https://api.anthropic.com  # 可选
```

### 2. 重启开发服务器

```bash
pnpm dev
```

### 3. 测试

创建新对话并发送消息，检查是否正常工作。

## 常见使用场景

### 使用官方 OpenAI API

```env
OPENAI_API_KEY=sk-proj-xxxxx
# OPENAI_BASE_URL 不设置，使用默认值
```

### 使用 OpenAI 兼容代理

```env
OPENAI_API_KEY=your-proxy-key
OPENAI_BASE_URL=https://your-proxy.com/v1
```

### 使用 Azure OpenAI

```env
OPENAI_API_KEY=your-azure-key
OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment
```

### 使用官方 Anthropic API

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
# ANTHROPIC_BASE_URL 不设置，使用默认值
```

### 使用 Anthropic 代理

```env
ANTHROPIC_API_KEY=your-proxy-key
ANTHROPIC_BASE_URL=https://your-anthropic-proxy.com/v1
```

## 实现细节

### 文件结构

```
server/
├── utils/
│   └── ai-providers.ts          # AI 提供商初始化工具函数
├── api/
│   └── chats/
│       └── [id].post.ts         # 修改后的聊天 API
nuxt.config.ts                   # 添加了运行时配置
docs/
└── ai-服务商-配置.md        # 详细配置文档
```

### 核心函数

**`initializeAIProvider(modelString, config)`**
- 根据模型字符串和配置初始化 AI 提供商
- 自动检测是否需要自定义配置
- 支持 OpenAI 和 Anthropic

**`initializeTitleGeneratorModel(config)`**
- 专门用于生成聊天标题的模型
- 默认使用 gpt-4o-mini

### 配置优先级

1. 如果设置了 `apiKey` 或 `baseURL`，使用自定义配置
2. 否则使用默认官方 API 端点
3. 环境变量通过 `nuxt.config.ts` 的 `runtimeConfig` 注入

## 故障排除

### 401 Unauthorized
- 检查 API Key 是否正确
- 确认账户有足够额度

### 404 Not Found
- 验证 Base URL 格式正确
- 检查模型名称是否被端点支持

### 网络错误
- 测试代理 URL 是否可访问: `curl -I <your-base-url>`
- 检查防火墙设置

## 安全建议

1. ✅ 不要提交 `.env` 文件到 Git
2. ✅ 生产环境使用环境变量
3. ✅ 定期轮换 API Key
4. ✅ 监控 API 使用量和费用

## 更多信息

详细配置指南请参阅: [`docs/ai-服务商-配置.md`](./ai-服务商-配置.md)
