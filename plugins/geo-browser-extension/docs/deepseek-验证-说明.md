# ✅ DeepSeek 官方 SDK 集成 - 验证指令

## 快速验证（3步）

```bash
# 1. 验证包安装
pnpm list @ai-sdk/deepseek
# 预期: @ai-sdk/deepseek@2.0.35 ✅

# 2. 测试 API 连接
pnpm test:deepseek
# 预期: ✅ API 连接成功！

# 3. 启动应用
pnpm dev
# 预期: 启动成功，无 DeepSeek 相关错误
```

---

## UI 验证

访问 http://localhost:3000，检查：

- [ ] 模型选择器显示 "DeepSeek Chat" 🧠
- [ ] 模型选择器显示 "DeepSeek Reasoner" ⚡
- [ ] 可以选择 DeepSeek 模型
- [ ] 发送消息正常工作
- [ ] 流式响应正常

---

## 代码验证

```bash
# 检查模型配置
cat shared/utils/models.ts | grep -A 2 "DeepSeek"

# 预期输出:
# { label: 'DeepSeek Chat', value: 'deepseek/deepseek-chat', icon: 'i-lucide-brain-circuit' },
# { label: 'DeepSeek Reasoner', value: 'deepseek/deepseek-reasoner', icon: 'i-lucide-zap' }
```

```bash
# 检查 provider 实现
cat server/utils/ai-providers.ts | grep -A 5 "from '@ai-sdk/deepseek'"

# 预期包含:
# import { deepseek, createDeepSeek } from '@ai-sdk/deepseek'
```

---

## 功能测试

### 测试 DeepSeek Chat
1. 选择 "DeepSeek Chat"
2. 输入: "你好，请介绍一下你自己"
3. 验证: 收到流式响应 ✅

### 测试 DeepSeek Reasoner（可选）
1. 选择 "DeepSeek Reasoner"
2. 输入: "strawberry 这个单词里有几个 r？"
3. 验证: 
   - 可能看到推理过程（如果启用）
   - 收到正确答案（3个r）✅

### 测试工具调用（可选）
1. 选择任一 DeepSeek 模型
2. 输入: "搜索 Vue 3.5 的新特性"
3. 验证: Web 搜索工具正常调用 ✅

---

## 文档检查

```bash
# 列出所有 DeepSeek 文档
ls -la docs/deepseek-*.md

# 预期输出（11个文件）:
# deepseek-变更-日志.md
# deepseek-完成-总结.md
# deepseek-最终-报告.md
# deepseek-集成-总结.md
# deepseek-迁移-完成.md
# deepseek-官方-sdk.md          ⭐ 重要
# deepseek-快速-开始.md             ⭐ 推荐
# deepseek-sdk-迁移-总结.md  ⭐ 本次变更
# deepseek-配置-指南.md
# deepseek-使用-指南.md
# deepseek-验证-清单.md
```

---

## 问题排查

### 问题 1: 模型选择器中没有 DeepSeek
```bash
# 检查模型配置
cat shared/utils/models.ts | grep DeepSeek

# 重启开发服务器
pnpm dev

# 清除浏览器缓存
# Chrome: Ctrl+Shift+R (Win) 或 Cmd+Shift+R (Mac)
```

### 问题 2: Import 错误
```bash
# 确认包已安装
pnpm list @ai-sdk/deepseek

# 如果未安装，重新安装
pnpm add @ai-sdk/deepseek
```

### 问题 3: API 连接失败
```bash
# 检查环境变量
cat .env | grep DEEPSEEK_API_KEY

# 测试连接
pnpm test:deepseek

# 检查 API Key 有效性
# 访问 https://platform.deepseek.com/
```

---

## 成功标准

所有项目都应该通过：

- [x] 包安装正确 (`@ai-sdk/deepseek@2.0.35`)
- [x] 模型配置正确（`deepseek-chat`, `deepseek-reasoner`）
- [x] Provider 实现正确（使用 `createDeepSeek`）
- [x] 测试脚本可用（`pnpm test:deepseek`）
- [x] 文档完整（11个文档文件）
- [ ] UI 显示正确（需要手动验证）
- [ ] 对话功能正常（需要手动测试）

---

## 下一步

验证通过后：

1. ✅ 阅读 [deepseek-官方-sdk.md](./deepseek-官方-sdk.md)
2. ✅ 尝试新模型和新特性
3. ✅ 测试思考模式和缓存统计
4. ✅ 提供反馈和建议

---

## 快速命令参考

```bash
# 环境检查
pnpm check:env

# DeepSeek 测试
pnpm test:deepseek

# 启动开发
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

---

**验证版本**: v2.0  
**最后更新**: 2025-05-29  
**状态**: ✅ 就绪验证
