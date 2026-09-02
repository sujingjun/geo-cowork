# AI 配置错误修复指南

## 问题描述

错误信息：
```
ERROR litellm.APIError: AzureException APIError - {"error":{"code":"404","message": "Resource not found"}}
Received Model Group=gpt-4o
```

## 原因分析

这个错误表示系统正在尝试通过 Vercel AI Gateway 调用 AI 模型，但配置不正确。可能的原因：

1. ❌ 没有设置 `OPENAI_API_KEY` 环境变量
2. ❌ AI Gateway 没有正确配置
3. ❌ 模型名称配置错误

## 解决方案

### 方案 1：使用 OpenAI API（推荐）

#### 步骤 1：创建 `.env` 文件

在项目根目录创建 `.env` 文件：

```bash
# OpenAI API Key（必需）
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 可选：如果使用自定义 OpenAI 兼容 API
# OPENAI_BASE_URL=https://api.openai.com/v1

# 会话密钥（必需，至少 32 字符）
NUXT_SESSION_PASSWORD=your-session-password-at-least-32-characters-long

# GitHub OAuth（可选，用于登录功能）
NUXT_OAUTH_GITHUB_CLIENT_ID=your-github-client-id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your-github-client-secret

# 站点 URL
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 步骤 2：获取 OpenAI API Key

1. 访问 [OpenAI API Keys](https://platform.openai.com/api-keys)
2. 登录你的 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制 API Key 并粘贴到 `.env` 文件中

#### 步骤 3：重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
pnpm dev
```

### 方案 2：使用 Vercel AI Gateway

如果你想使用 Vercel AI Gateway 统一管理多个 AI 提供商：

#### 步骤 1：设置 AI Gateway

1. 访问 [Vercel AI Gateway](https://vercel.com/docs/ai/ai-gateway)
2. 在 Vercel Dashboard 中创建 AI Gateway 项目
3. 配置支持的模型（gpt-4o, claude-3-7-sonnet 等）
4. 获取 AI Gateway API Key

#### 步骤 2：配置环境变量

在 `.env` 文件中添加：

```bash
# Vercel AI Gateway
AI_GATEWAY_API_KEY=your-ai-gateway-api-key

# 会话密钥
NUXT_SESSION_PASSWORD=your-session-password-at-least-32-characters-long
```

### 方案 3：使用其他 AI 提供商

#### Anthropic (Claude)

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Google (Gemini)

```bash
GOOGLE_GENERATIVE_AI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 验证配置

### 检查环境变量

创建临时验证脚本 `check-env.mjs`：

```javascript
import { readFileSync } from 'fs'

console.log('🔍 检查环境变量配置...\n')

try {
  const env = readFileSync('.env', 'utf-8')
  const lines = env.split('\n').filter(line => line.trim() && !line.startsWith('#'))
  
  const required = [
    'NUXT_SESSION_PASSWORD',
    'OPENAI_API_KEY' // 或 AI_GATEWAY_API_KEY
  ]
  
  const configured = []
  const missing = []
  
  for (const key of required) {
    const found = lines.some(line => line.startsWith(key + '='))
    if (found) {
      configured.push(key)
      console.log(`✅ ${key} - 已配置`)
    } else {
      missing.push(key)
      console.log(`❌ ${key} - 未配置`)
    }
  }
  
  console.log('\n📊 配置统计:')
  console.log(`已配置: ${configured.length}/${required.length}`)
  
  if (missing.length > 0) {
    console.log('\n⚠️  缺少以下环境变量:')
    missing.forEach(key => console.log(`   - ${key}`))
  } else {
    console.log('\n🎉 所有必需的环境变量都已配置!')
  }
} catch (error) {
  console.error('❌ 未找到 .env 文件，请创建一个！')
  console.log('\n💡 提示: 复制 .env.example 并重命名为 .env')
}
```

运行验证：

```bash
node check-env.mjs
```

## 常见问题

### Q1: 我没有 OpenAI API Key 怎么办？

**A:** 你可以使用其他提供商：
- **Anthropic**: 访问 https://console.anthropic.com/ 获取 API Key
- **Google**: 访问 https://makersuite.google.com/app/apikey 获取 API Key

### Q2: 我的 API Key 是否有效？

**A:** 可以使用 curl 测试：

```bash
# 测试 OpenAI
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Q3: 还是报错怎么办？

**A:** 检查以下几点：
1. 确认 `.env` 文件在项目根目录
2. 确认环境变量名称拼写正确（区分大小写）
3. 确认 API Key 前后没有空格
4. 重启开发服务器
5. 检查浏览器控制台和终端日志

### Q4: 如何切换到成本更低的模型？

**A:** 在聊天界面右下角的模型选择器中选择：
- `gpt-4o-mini` - OpenAI 最便宜的模型
- `claude-3-5-haiku` - Anthropic 最便宜的模型
- `gemini-2.0-flash` - Google 免费模型

## 推荐配置

### 开发环境（本地测试）

```bash
# 使用便宜的模型
OPENAI_API_KEY=sk-xxxxxxxx
NUXT_SESSION_PASSWORD=your-32-character-password-here
```

### 生产环境（部署到 Vercel）

1. 在 Vercel Dashboard 设置环境变量
2. 使用 AI Gateway 管理多个提供商
3. 启用速率限制和监控

## 下一步

配置完成后：

1. ✅ 重启开发服务器
2. ✅ 访问 http://localhost:3000
3. ✅ 尝试发送消息测试 AI 对话
4. ✅ 如果还有问题，查看终端日志

## 获取帮助

如果以上方案都无法解决问题，请提供：
1. 完整的错误日志
2. 你的配置方式（OpenAI / AI Gateway / 其他）
3. 使用的模型名称
4. 环境变量配置（隐藏敏感信息）
