# ✅ DeepSeek 集成验证清单

## 🎯 快速验证（必做）

### 1. 文件检查
```bash
# 检查配置文件
[ ] nuxt.config.ts 包含 deepseek 配置
[ ] shared/utils/models.ts 包含 DeepSeek 模型
[ ] server/utils/ai-providers.ts 包含 deepseek case
```

**验证命令**:
```bash
# 检查 nuxt.config.ts
grep -A 3 "deepseek:" nuxt.config.ts

# 检查模型列表
grep "DeepSeek" shared/utils/models.ts

# 检查提供商逻辑
grep -A 5 "case 'deepseek':" server/utils/ai-providers.ts
```

### 2. 环境配置
```bash
[ ] .env 文件存在
[ ] DEEPSEEK_API_KEY 已配置
[ ] NUXT_SESSION_PASSWORD 已配置（最少32字符）
```

**验证命令**:
```bash
# 运行环境检查
pnpm check:env
```

**预期输出**:
```
✅ DeepSeek - 已配置 (sk-xxxxxx...xxxx)
✅ NUXT_SESSION_PASSWORD - 已配置
```

### 3. API 连接测试
```bash
[ ] 测试脚本可执行
[ ] API 连接成功
[ ] 可用模型列表返回
```

**验证命令**:
```bash
# 测试 DeepSeek 连接
pnpm test:deepseek
```

**预期输出**:
```
✅ API 连接成功！
📦 可用模型:
   • deepseek-chat
   • deepseek-coder
```

---

## 🧪 功能验证（推荐）

### 4. 启动应用
```bash
[ ] 开发服务器启动成功
[ ] 无错误信息
[ ] 可以访问 http://localhost:3000
```

**验证命令**:
```bash
# 启动开发服务器
pnpm dev
```

**检查项**:
- Console 无红色错误
- 页面正常加载
- 模型选择器显示

### 5. UI 测试
```bash
[ ] 模型选择器显示 DeepSeek 选项
[ ] 可以选择 DeepSeek V4 Pro
[ ] 可以选择 DeepSeek V4 Flash
[ ] 图标正常显示（🧠 和 ⚡）
```

**验证步骤**:
1. 打开 http://localhost:3000
2. 点击右上角模型选择器
3. 查看是否有 "DeepSeek V4 Pro" 和 "DeepSeek V4 Flash"

### 6. 对话测试
```bash
[ ] 选择 DeepSeek V4 Flash
[ ] 发送测试消息："你好，请介绍一下你自己"
[ ] 收到流式响应
[ ] 响应完整且正确
```

**测试用例**:
```
测试 1: 简单对话
输入: "你好"
预期: 正常的问候响应

测试 2: 代码生成
输入: "用 TypeScript 写一个计算斐波那契数列的函数"
预期: 返回完整代码

测试 3: 中文理解
输入: "解释一下什么是闭包，用中文"
预期: 清晰的中文解释
```

---

## 🔧 高级验证（可选）

### 7. 工具调用测试
```bash
[ ] Web 搜索工具正常
[ ] 图表生成工具正常
[ ] 其他工具正常
```

**测试用例**:
```
输入: "搜索最新的 Vue 3.5 新特性"
预期: 调用 Web 搜索工具并返回结果
```

### 8. 文件上传测试
```bash
[ ] 可以上传图片
[ ] DeepSeek 可以识别图片内容
[ ] 多模态对话正常
```

**测试步骤**:
1. 上传一张图片
2. 询问 "这张图片里有什么？"
3. 验证 DeepSeek 正确识别内容

### 9. 性能测试
```bash
[ ] 响应速度符合预期（Flash < 2秒，Pro < 5秒）
[ ] 流式响应流畅
[ ] 无卡顿或超时
```

### 10. 错误处理测试
```bash
[ ] API Key 错误时有友好提示
[ ] 网络错误时有重试机制
[ ] 超时有明确错误信息
```

**测试方法**:
```bash
# 测试错误的 API Key
export DEEPSEEK_API_KEY=invalid-key
pnpm test:deepseek
# 应该看到清晰的错误提示
```

---

## 📊 文档验证（必做）

### 11. 文档完整性
```bash
[ ] README.md 提到 DeepSeek
[ ] AGENTS.md 更新了 DeepSeek 信息
[ ] docs/deepseek-快速-开始.md 存在
[ ] docs/deepseek-使用-指南.md 存在
[ ] docs/deepseek-集成-总结.md 存在
[ ] docs/deepseek-变更-日志.md 存在
```

**验证命令**:
```bash
# 检查文档文件
ls -l docs/deepseek-*.md

# 检查 README 更新
grep "DeepSeek" README.md

# 检查 AGENTS.md 更新
grep "DeepSeek" AGENTS.md
```

### 12. 链接有效性
```bash
[ ] README 中的链接可访问
[ ] 文档间的交叉引用正确
[ ] 外部链接有效
```

---

## 🎓 测试报告模板

完成测试后，填写以下报告：

```markdown
# DeepSeek 集成测试报告

## 测试环境
- Node.js 版本: [填写]
- pnpm 版本: [填写]
- 操作系统: [填写]
- 测试日期: [填写]

## 测试结果

### 快速验证
- [✅/❌] 文件检查
- [✅/❌] 环境配置
- [✅/❌] API 连接测试

### 功能验证
- [✅/❌] 启动应用
- [✅/❌] UI 测试
- [✅/❌] 对话测试

### 高级验证
- [✅/❌] 工具调用测试
- [✅/❌] 文件上传测试
- [✅/❌] 性能测试
- [✅/❌] 错误处理测试

### 文档验证
- [✅/❌] 文档完整性
- [✅/❌] 链接有效性

## 发现的问题
[列出发现的问题]

## 改进建议
[提供改进建议]

## 整体评价
[✅ 通过 / ❌ 不通过 / ⚠️ 部分通过]

## 测试人员
[姓名/ID]
```

---

## 🚨 常见问题检查

### 问题 1: 模型选择器中没有 DeepSeek
**检查项**:
- [ ] `shared/utils/models.ts` 是否包含 DeepSeek
- [ ] 开发服务器是否重启
- [ ] 浏览器缓存是否清除

**解决方法**:
```bash
# 重启开发服务器
pnpm dev
# 浏览器强制刷新 Ctrl+Shift+R (Win) 或 Cmd+Shift+R (Mac)
```

### 问题 2: API 连接失败
**检查项**:
- [ ] `.env` 文件格式正确（无多余空格）
- [ ] API Key 格式正确（sk- 开头）
- [ ] 网络连接正常
- [ ] API Key 有效且有配额

**解决方法**:
```bash
# 检查 API Key 格式
cat .env | grep DEEPSEEK_API_KEY

# 测试连接
pnpm test:deepseek

# 访问 DeepSeek 控制台检查配额
# https://platform.deepseek.com/usage
```

### 问题 3: 响应速度慢
**检查项**:
- [ ] 使用的是 Flash 还是 Pro 模型
- [ ] 网络延迟
- [ ] 上下文长度是否过长

**解决方法**:
- 使用 DeepSeek V4 Flash 获得更快响应
- 定期开启新会话减少上下文
- 检查网络连接质量

---

## ✅ 验证通过标准

### 最低标准（必须全部通过）
- ✅ 文件检查通过
- ✅ 环境配置正确
- ✅ API 连接成功
- ✅ 应用启动正常
- ✅ UI 显示 DeepSeek 选项
- ✅ 基本对话功能正常

### 完整标准（推荐全部通过）
- ✅ 所有快速验证项通过
- ✅ 所有功能验证项通过
- ✅ 工具调用正常
- ✅ 文件上传正常
- ✅ 性能符合预期
- ✅ 文档完整

---

## 📝 提交前检查

准备提交代码？确保：

```bash
[ ] 所有测试通过
[ ] 代码格式正确: pnpm lint
[ ] 类型检查通过: pnpm typecheck
[ ] 文档更新完整
[ ] .env 文件未提交
[ ] 敏感信息已清除
[ ] CHANGELOG 已更新
```

---

## 🎉 验证完成

如果所有最低标准都通过，恭喜！DeepSeek 集成成功！

**下一步**:
1. 开始使用 DeepSeek 进行日常开发
2. 尝试不同的模型对比效果
3. 探索高级功能（工具调用、文件上传等）
4. 分享使用体验和反馈

---

**验证版本**: v1.0.0  
**最后更新**: 2025-05-29  
**维护者**: DHCoder Team
