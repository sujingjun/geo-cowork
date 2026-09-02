# DeepSeek 快速开始指南

## 🎯 快速配置（3 步完成）

### 1️⃣ 获取 API 密钥

访问 [DeepSeek 开放平台](https://platform.deepseek.com/)，注册并获取 API 密钥。

### 2️⃣ 配置环境变量

在项目根目录的 `.env` 文件中添加：

```bash
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3️⃣ 验证配置

```bash
# 运行配置测试
pnpm test:deepseek

# 或检查所有环境变量
pnpm check:env
```

如果看到 ✅ 表示配置成功！

---

## 🚀 开始使用

```bash
# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000，在模型选择器中选择：
- **DeepSeek V4 Pro** 🧠 - 强大的推理能力，适合复杂任务
- **DeepSeek V4 Flash** ⚡ - 快速响应，适合日常对话

---

## 📊 模型选择建议

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 代码生成、重构 | DeepSeek V4 Pro | 强大的编程能力 |
| 技术问题解答 | DeepSeek V4 Pro | 深度推理能力 |
| 日常对话 | DeepSeek V4 Flash | 快速响应 + 低成本 |
| 文档总结 | DeepSeek V4 Flash | 性价比高 |
| 复杂分析 | DeepSeek V4 Pro | 更强的理解能力 |

---

## 🆚 与其他模型对比

```
💰 成本效益: DeepSeek > Gemini > GPT > Claude
⚡ 响应速度: DeepSeek Flash > Gemini > GPT Mini > Claude
🧠 推理能力: Claude > DeepSeek Pro > GPT-4o > Gemini
🇨🇳 中文理解: DeepSeek > Claude > GPT > Gemini
```

---

## ⚙️ 高级配置（可选）

### 自定义 API 端点

```bash
# .env
DEEPSEEK_BASE_URL=https://your-custom-endpoint.com
```

### 多模型混合使用

同时配置多个提供商，根据任务选择最佳模型：

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
```

---

## 🔧 故障排除

### ❌ API Key 无效

**错误**: `Failed to initialize DeepSeek model`

**解决**:
1. 检查 `.env` 中的 `DEEPSEEK_API_KEY` 格式
2. 确认密钥以 `sk-` 开头
3. 访问 https://platform.deepseek.com/ 验证密钥状态
4. 重启开发服务器 `pnpm dev`

### ⏱️ 连接超时

**解决**:
1. 检查网络连接
2. 尝试访问 https://api.deepseek.com
3. 如使用代理，配置 `HTTP_PROXY` 环境变量

### 💸 配额不足

**解决**:
1. 登录 DeepSeek 平台查看余额
2. 充值或升级账户
3. 临时切换到其他 AI 模型

---

## 📚 相关资源

- 📖 [完整文档](./deepseek-配置-指南.md)
- 🌐 [DeepSeek 官网](https://platform.deepseek.com/)
- 💡 [API 文档](https://platform.deepseek.com/api-docs)
- 💰 [定价信息](https://platform.deepseek.com/pricing)

---

## 💡 使用技巧

### 1. 根据任务选择模型
```javascript
// 复杂任务 → Pro 模型
const model = 'deepseek/deepseek-v4-pro'

// 简单任务 → Flash 模型（更快更便宜）
const model = 'deepseek/deepseek-v4-flash'
```

### 2. 控制上下文长度
长对话会增加 token 消耗，适时开启新会话可以节省成本。

### 3. 利用流式响应
项目默认启用流式响应，可以随时终止不需要的回复。

---

## ✅ 验证清单

完成以下步骤，确保 DeepSeek 正常工作：

- [ ] 在 `.env` 中配置 `DEEPSEEK_API_KEY`
- [ ] 运行 `pnpm test:deepseek` 测试连接
- [ ] 运行 `pnpm dev` 启动服务器
- [ ] 在界面中选择 DeepSeek 模型
- [ ] 发送测试消息，验证流式响应
- [ ] 尝试 Pro 和 Flash 模型，对比效果

---

**🎉 配置完成！开始使用 DeepSeek 体验高性价比 AI 助手！**
