# ⚡ 快速修复：AI 配置错误

## 🚨 遇到错误？

```
ERROR litellm.APIError: AzureException APIError - {"error":{"code":"404","message": "Resource not found"}}
```

## ✅ 5 分钟快速修复

### 步骤 1：创建 .env 文件

在项目根目录创建 `.env` 文件（与 `package.json` 同级）

### 步骤 2：添加配置

复制以下内容到 `.env` 文件：

```bash
# OpenAI API Key（必需）
# 获取方式：访问 https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 会话密钥（必需，随机生成 32 字符以上）
NUXT_SESSION_PASSWORD=your-random-32-character-or-longer-password-here

# 站点 URL
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 步骤 3：获取 OpenAI API Key

1. 访问 https://platform.openai.com/api-keys
2. 登录或注册账号
3. 点击 "Create new secret key"
4. 复制 API Key（以 `sk-proj-` 或 `sk-` 开头）
5. 粘贴到 `.env` 文件中

### 步骤 4：生成会话密钥

在终端运行以下命令生成随机密钥：

```bash
# macOS/Linux
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

将输出的字符串复制到 `NUXT_SESSION_PASSWORD`

### 步骤 5：重启服务器

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
pnpm dev
```

## ✅ 验证配置

运行检查脚本：

```bash
pnpm check:env
```

应该看到：
```
✅ NUXT_SESSION_PASSWORD - 已配置
✅ OpenAI - 已配置
```

## 🎉 完成！

现在访问 http://localhost:3000 就可以使用 AI 功能了。

## 🆘 还是不行？

### 常见问题

**Q1: 没有 OpenAI 账号？**
- 可以使用其他 AI 提供商（见下方）

**Q2: API Key 无效？**
- 确认复制完整（包含 `sk-` 前缀）
- 确认账号有余额
- 尝试重新生成 Key

**Q3: 还是报同样的错误？**
- 删除 `.env` 文件重新创建
- 确认环境变量名称拼写正确
- 检查是否有空格

## 🌐 使用其他 AI 提供商

### Anthropic (Claude)

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NUXT_SESSION_PASSWORD=your-random-password-here
```

获取地址：https://console.anthropic.com/

### Google (Gemini)

```bash
# .env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NUXT_SESSION_PASSWORD=your-random-password-here
```

获取地址：https://makersuite.google.com/app/apikey

## 📖 详细文档

- 完整配置指南：`docs/ai-配置-修复.md`
- 支持的模型列表：`docs/支持-模型.md`

## 💬 需要帮助？

1. 查看错误日志（终端窗口）
2. 运行 `pnpm check:env` 检查配置
3. 阅读详细文档
4. 提供完整错误信息寻求帮助
