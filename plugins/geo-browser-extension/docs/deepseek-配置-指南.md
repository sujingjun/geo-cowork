# DeepSeek 完整配置指南

## 概述

本项目现已支持 DeepSeek AI 模型，使用官方 `@ai-sdk/deepseek` SDK，包括：
- **DeepSeek Chat** - 通用对话模型，支持多模态输入和工具调用
- **DeepSeek Reasoner** - 推理模型，支持思考模式（Chain-of-Thought）

## 快速配置

### 1. 获取 API 密钥

访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册并获取 API 密钥。

### 2. 配置环境变量

在项目根目录的 `.env` 文件中添加：

```bash
# DeepSeek API 密钥
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 验证配置

运行环境检查命令：

```bash
pnpm check:env
```

如果配置正确，你会看到：

```
✅ DeepSeek - 已配置 (sk-xxxxxx...xxxx)
```

### 4. 开始使用

启动开发服务器：

```bash
pnpm dev
```

在聊天界面的模型选择器中，选择：
- **DeepSeek V4 Pro** - 适合复杂任务、长文本分析
- **DeepSeek V4 Flash** - 适合快速对话、简单查询

## API 配置详情

### 默认配置

DeepSeek 使用官方 AI SDK：

- **SDK 包**: `@ai-sdk/deepseek`
- **API 基础 URL**: `https://api.deepseek.com`
- **支持功能**: 流式响应、工具调用、多模态输入、思考模式、上下文缓存

### 自定义端点（可选）

如果需要使用自定义 API 端点，可以添加：

```bash
DEEPSEEK_BASE_URL=https://your-custom-endpoint.com
```

## 模型对比

| 模型 | 特点 | 适用场景 | 性价比 |
|------|------|---------|--------|
| **DeepSeek Chat** | 通用对话，支持多模态、工具调用 | 日常对话、代码生成、技术分析 | ⭐⭐⭐⭐⭐ |
| **DeepSeek Reasoner** | 推理模型，支持思考模式 | 复杂逻辑推理、数学问题、深度分析 | ⭐⭐⭐⭐ |

## 使用建议

### 适合 DeepSeek Chat 的任务
- 日常对话和问答
- 代码生成和重构
- 技术文档编写
- 多模态输入（图片、文本）
- 工具调用（Web 搜索、图表生成）
- 长文本处理（支持 context caching）

### 适合 DeepSeek Reasoner 的任务
- 复杂逻辑推理问题
- 数学问题解答
- 多步骤推理任务
- 需要展示思考过程的场景
- 复杂算法设计

## 故障排除

### 问题：API 密钥无效

**错误信息**: `Failed to initialize DeepSeek model: deepseek-v4-pro. Please check your DEEPSEEK_API_KEY environment variable.`

**解决方案**:
1. 检查 `.env` 文件中的 `DEEPSEEK_API_KEY` 是否正确
2. 确认密钥格式为 `sk-` 开头
3. 登录 [DeepSeek 平台](https://platform.deepseek.com/) 验证密钥状态
4. 重启开发服务器

### 问题：连接超时

**可能原因**:
- 网络连接问题
- API 服务暂时不可用
- 防火墙或代理设置

**解决方案**:
1. 检查网络连接
2. 尝试访问 https://api.deepseek.com 验证可达性
3. 如果使用代理，配置 HTTP_PROXY 环境变量
4. 稍后重试

### 问题：配额不足

**错误信息**: `Rate limit exceeded` 或 `Quota exceeded`

**解决方案**:
1. 登录 DeepSeek 平台查看配额使用情况
2. 升级账户或等待配额重置
3. 暂时切换到其他 AI 提供商（OpenAI、Claude、Gemini）

## 成本优化建议

1. **日常对话使用 Flash 模型** - DeepSeek V4 Flash 成本更低，适合大部分场景
2. **复杂任务使用 Pro 模型** - 只在需要强大推理能力时使用
3. **合理控制上下文长度** - 长对话会增加 token 消耗
4. **使用流式响应** - 项目已默认启用，可提前终止不需要的响应

## 与其他提供商对比

| 提供商 | 优势 | 劣势 |
|--------|------|------|
| **DeepSeek** | 性价比高，中文理解好，推理能力强 | 生态相对较新 |
| **OpenAI** | 生态成熟，功能丰富 | 成本较高 |
| **Anthropic** | 安全性高，长文本处理好 | 价格偏高 |
| **Google** | 免费额度高，速度快 | 推理能力一般 |

## 多提供商混合使用

你可以同时配置多个 AI 提供商，根据任务类型选择：

```bash
# .env 文件
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
```

使用建议：
- **代码生成** → DeepSeek V4 Pro 或 GPT-4o
- **日常对话** → DeepSeek V4 Flash 或 Gemini
- **长文本分析** → Claude 3.7 Sonnet 或 DeepSeek V4 Pro
- **快速查询** → DeepSeek V4 Flash 或 GPT-4o Mini

## 相关资源

- [DeepSeek 官方文档](https://platform.deepseek.com/docs)
- [API 参考](https://platform.deepseek.com/api-docs)
- [定价信息](https://platform.deepseek.com/pricing)
- [DeepSeek 开放平台](https://platform.deepseek.com/)

## 技术细节

### API 实现

DeepSeek 使用官方 AI SDK，项目中通过以下方式初始化：

```typescript
// server/utils/ai-providers.ts
import { deepseek, createDeepSeek } from '@ai-sdk/deepseek'

case 'deepseek': {
  if (config.deepseek?.apiKey || config.deepseek?.baseURL) {
    const deepseekProvider = createDeepSeek({
      apiKey: config.deepseek?.apiKey,
      baseURL: config.deepseek?.baseURL
    })
    return deepseekProvider(modelName)
  } else {
    return deepseek(modelName)
  }
}
```

### 模型配置

```typescript
// shared/utils/models.ts
{
  label: 'DeepSeek Chat',
  value: 'deepseek/deepseek-chat',
  icon: 'i-lucide-brain-circuit'
},
{
  label: 'DeepSeek Reasoner',
  value: 'deepseek/deepseek-reasoner',
  icon: 'i-lucide-zap'
}
```

### 特性支持

#### 1. 思考模式 (Thinking Mode)
DeepSeek Reasoner 支持显示思考过程：
```typescript
const result = streamText({
  model: deepseek('deepseek-reasoner'),
  prompt: '计算 strawberry 中有多少个 r？'
})

for await (const part of result.fullStream) {
  if (part.type === 'reasoning') {
    console.log('思考:', part.text)
  } else if (part.type === 'text') {
    console.log('答案:', part.text)
  }
}
```

#### 2. 上下文缓存 (Context Caching)
DeepSeek 支持磁盘缓存技术，显著降低重复内容的 token 成本：
```typescript
const result = await generateText({
  model: deepseek('deepseek-chat'),
  prompt: 'Your prompt here'
})

// 查看缓存统计
console.log(result.providerMetadata)
// { deepseek: { promptCacheHitTokens: 1856, promptCacheMissTokens: 5 } }
```

## 下一步

1. 配置完成后，访问 http://localhost:3000
2. 在模型选择器中选择 DeepSeek 模型
3. 开始体验 DeepSeek 的强大能力
4. 根据使用情况调整模型选择策略

---

**提示**: 如果遇到其他问题，请查看 [AI 配置修复指南](./ai-配置-修复.md) 或提交 Issue。
