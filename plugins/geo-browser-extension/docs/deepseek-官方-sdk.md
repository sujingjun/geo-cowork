# DeepSeek 官方 SDK 集成说明

## 🎯 重要更新

项目已更新为使用 **DeepSeek 官方 AI SDK**（`@ai-sdk/deepseek`），而非 OpenAI 兼容 API。

---

## 📦 SDK 信息

- **包名**: `@ai-sdk/deepseek`
- **版本**: 2.0.35+
- **文档**: https://ai-sdk.dev/providers/ai-sdk-providers/deepseek
- **优势**: 官方支持、原生特性、更好的性能

---

## 🆕 模型变更

### 旧模型名称（已弃用）
- ❌ `deepseek/deepseek-v4-pro`
- ❌ `deepseek/deepseek-v4-flash`

### 新模型名称（官方）
- ✅ `deepseek/deepseek-chat` - 通用对话模型
- ✅ `deepseek/deepseek-reasoner` - 推理模型（支持思考模式）

---

## 🌟 新特性

### 1. 思考模式 (Thinking Mode)

**DeepSeek Reasoner** 支持显示思考过程：

```typescript
import { deepseek } from '@ai-sdk/deepseek'
import { streamText } from 'ai'

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

### 2. 上下文缓存 (Context Caching)

DeepSeek 支持磁盘缓存技术，显著降低重复内容的 token 成本：

```typescript
const result = await generateText({
  model: deepseek('deepseek-chat'),
  prompt: 'Your prompt here'
})

// 查看缓存统计
console.log(result.providerMetadata)
// 输出: { deepseek: { promptCacheHitTokens: 1856, promptCacheMissTokens: 5 } }
```

- `promptCacheHitTokens`: 缓存命中的 token 数量
- `promptCacheMissTokens`: 缓存未命中的 token 数量

### 3. 推理强度控制 (Reasoning Effort)

可以控制 DeepSeek 的推理强度：

```typescript
const { text, reasoning } = await generateText({
  model: deepseek('deepseek-chat'),
  prompt: 'How many "r"s are in the word "strawberry"?',
  providerOptions: {
    deepseek: {
      thinking: { type: 'enabled' },
      reasoningEffort: 'high' // 'low' | 'medium' | 'high' | 'xhigh' | 'max'
    }
  }
})
```

---

## 🔧 技术实现

### 服务器端代码

```typescript
// server/utils/ai-providers.ts
import { deepseek, createDeepSeek } from '@ai-sdk/deepseek'

case 'deepseek': {
  // 自定义配置
  if (config.deepseek?.apiKey || config.deepseek?.baseURL) {
    const deepseekProvider = createDeepSeek({
      apiKey: config.deepseek?.apiKey,
      baseURL: config.deepseek?.baseURL
    })
    return deepseekProvider(modelName)
  }
  
  // 默认配置（使用环境变量 DEEPSEEK_API_KEY）
  return deepseek(modelName)
}
```

### 模型配置

```typescript
// shared/utils/models.ts
export const MODELS = [
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
]
```

---

## 📊 模型能力对比

| 模型 | 文本生成 | 对象生成 | 图片输入 | 工具调用 | 工具流式 |
|------|---------|---------|---------|---------|---------|
| deepseek-chat | ✅ | ✅ | ✅ | ✅ | ✅ |
| deepseek-reasoner | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 使用建议

### DeepSeek Chat
**适用场景**:
- ✅ 日常对话和问答
- ✅ 代码生成和重构
- ✅ 技术文档编写
- ✅ 多模态输入（图片 + 文本）
- ✅ 工具调用（Web 搜索、图表生成）
- ✅ 长文本处理（支持 context caching）

**特点**:
- 通用对话模型
- 高性价比
- 支持上下文缓存
- 多模态支持

### DeepSeek Reasoner
**适用场景**:
- ✅ 复杂逻辑推理问题
- ✅ 数学问题解答
- ✅ 多步骤推理任务
- ✅ 需要展示思考过程的场景
- ✅ 复杂算法设计

**特点**:
- 支持思考模式（Chain-of-Thought）
- 显示推理过程
- 可调节推理强度
- 适合复杂问题

---

## 🔄 迁移指南

### 从 OpenAI 兼容 API 迁移

**旧代码** (OpenAI 兼容):
```typescript
import { createOpenAI } from '@ai-sdk/openai'

const deepseekProvider = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
})
const model = deepseekProvider('deepseek-v4-pro')
```

**新代码** (官方 SDK):
```typescript
import { deepseek, createDeepSeek } from '@ai-sdk/deepseek'

// 默认配置
const model = deepseek('deepseek-chat')

// 自定义配置
const deepseekProvider = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
})
const model = deepseekProvider('deepseek-chat')
```

### 模型名称对应

| 旧名称 | 新名称 | 说明 |
|--------|--------|------|
| `deepseek-v4-pro` | `deepseek-chat` | 通用对话模型 |
| `deepseek-v4-flash` | `deepseek-chat` | 使用同一模型 |
| - | `deepseek-reasoner` | 新增推理模型 |

---

## ✅ 验证配置

### 1. 检查包安装
```bash
pnpm list @ai-sdk/deepseek
# 应该显示: @ai-sdk/deepseek 2.0.35
```

### 2. 测试连接
```bash
pnpm test:deepseek
```

### 3. 验证模型
启动应用后，模型选择器应显示：
- DeepSeek Chat 🧠
- DeepSeek Reasoner ⚡

---

## 🆘 常见问题

### Q: 为什么要从 OpenAI 兼容 API 切换到官方 SDK？

**A**: 官方 SDK 提供：
- ✅ 原生支持 thinking mode
- ✅ 上下文缓存统计
- ✅ 推理强度控制
- ✅ 更好的类型提示
- ✅ 官方维护和更新

### Q: 旧的模型名称还能用吗？

**A**: 不能。需要更新为官方模型名称：
- `deepseek-chat` - 通用对话
- `deepseek-reasoner` - 推理模型

### Q: 如何启用思考模式？

**A**: 使用 `deepseek-reasoner` 模型，或在 `providerOptions` 中设置：
```typescript
providerOptions: {
  deepseek: {
    thinking: { type: 'enabled' }
  }
}
```

### Q: 上下文缓存如何工作？

**A**: DeepSeek 自动缓存重复的输入内容。查看 `result.providerMetadata.deepseek` 获取缓存统计信息。

---

## 📚 相关资源

- [官方文档](https://ai-sdk.dev/providers/ai-sdk-providers/deepseek)
- [DeepSeek 平台](https://platform.deepseek.com/)
- [API 文档](https://api-docs.deepseek.com/)
- [思考模式文档](https://api-docs.deepseek.com/guides/thinking_mode)

---

**更新日期**: 2025-05-29  
**SDK 版本**: @ai-sdk/deepseek@2.0.35  
**维护者**: DHCoder Team
