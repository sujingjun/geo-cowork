# 🔧 DeepSeek 模型名称迁移问题修复

## 问题描述

迁移到 DeepSeek 官方 SDK 后，如果浏览器中存储了旧的模型名称，会导致以下错误：

```
{
  "error": true,
  "statusCode": 400,
  "statusMessage": "Validation Error",
  "message": "Invalid model"
}
```

## 原因

旧的模型名称：
- ❌ `deepseek/deepseek-v4-pro`
- ❌ `deepseek/deepseek-v4-flash`
- ❌ `anthropic/claude-haiku-4.5`

新的模型名称：
- ✅ `deepseek/deepseek-chat`
- ✅ `deepseek/deepseek-reasoner`
- ✅ `anthropic/claude-3-7-sonnet`

## 已修复

### 1. 服务器端修复
✅ 添加 `MODELS` 导入到 `server/api/chats/[id].post.ts`

```typescript
import { MODELS } from '#shared/utils/models'
```

### 2. 客户端修复
✅ 自动验证和修复无效的模型名称

```typescript
// app/composables/useModels.ts
if (model.value && !MODELS.some(m => m.value === model.value)) {
  console.warn(`Invalid model "${model.value}" in cookie, resetting to default`)
  model.value = 'openai/gpt-4o'
}
```

### 3. 默认模型更新
✅ 更新默认模型为 `openai/gpt-4o`

---

## 用户解决方案

### 方案 1: 自动修复（推荐）
重启开发服务器后，系统会自动检测并修复无效的模型名称：

```bash
# 重启开发服务器
pnpm dev
```

刷新浏览器页面，系统会自动切换到默认模型。

### 方案 2: 手动清除 Cookie
如果自动修复不生效，手动清除浏览器 Cookie：

#### Chrome/Edge
1. 打开开发者工具（F12）
2. 切换到 "Application" 标签
3. 左侧选择 "Cookies" → `http://localhost:3000`
4. 找到 `model` cookie 并删除
5. 刷新页面

#### Firefox
1. 打开开发者工具（F12）
2. 切换到 "Storage" 标签
3. 左侧选择 "Cookies" → `http://localhost:3000`
4. 找到 `model` cookie 并删除
5. 刷新页面

#### Safari
1. 打开开发者工具（Cmd+Option+I）
2. 切换到 "Storage" 标签
3. 左侧选择 "Cookies" → `http://localhost:3000`
4. 找到 `model` cookie 并删除
5. 刷新页面

### 方案 3: 使用无痕模式测试
```bash
# 启动开发服务器
pnpm dev

# 在浏览器中打开无痕窗口
# Chrome: Ctrl+Shift+N (Win) / Cmd+Shift+N (Mac)
# 访问 http://localhost:3000
```

---

## 验证修复

### 1. 检查控制台
打开浏览器控制台（F12），查看是否有警告信息：
```
Invalid model "deepseek/deepseek-v4-pro" in cookie, resetting to default
```

如果看到此消息，说明自动修复已生效。

### 2. 测试发送消息
1. 选择任意模型
2. 发送测试消息
3. 如果收到响应，说明问题已解决 ✅

### 3. 检查模型选择器
模型选择器应显示以下选项：
- GPT-4o
- GPT-4.1
- GPT-4o Mini
- GPT-4.1 Mini
- Claude 3.7 Sonnet
- DeepSeek Chat ✅
- DeepSeek Reasoner ✅

---

## 开发者说明

### 代码变更

#### server/api/chats/[id].post.ts
```typescript
// 添加导入
import { MODELS } from '#shared/utils/models'

// 验证使用 MODELS 数组
const { model: modelString, messages } = await readValidatedBody(event, z.object({
  model: z.string().refine(value => MODELS.some(m => m.value === value), {
    message: 'Invalid model'
  }),
  messages: z.array(z.custom<UIMessage>())
}).parse)
```

#### app/composables/useModels.ts
```typescript
export function useModels() {
  const model = useCookie<string>('model', { default: () => 'openai/gpt-4o' })

  // 验证并修复旧的模型名称
  if (model.value && !MODELS.some(m => m.value === model.value)) {
    console.warn(`Invalid model "${model.value}" in cookie, resetting to default`)
    model.value = 'openai/gpt-4o'
  }

  return {
    models: MODELS,
    model
  }
}
```

---

## 预防措施

### 未来模型更新时
1. ✅ 保持向后兼容或提供迁移脚本
2. ✅ 在客户端添加模型验证
3. ✅ 更新默认模型为有效值
4. ✅ 在更新日志中明确说明变更

### 测试清单
- [ ] 测试新用户（无 Cookie）
- [ ] 测试老用户（有旧 Cookie）
- [ ] 测试各个模型切换
- [ ] 验证错误消息清晰

---

## 相关文档

- [DeepSeek 官方 SDK](./deepseek-官方-sdk.md)
- [模型更新说明](./模型-更新-说明.md)
- [迁移完成报告](./deepseek-迁移-完成.md)

---

## 快速命令

```bash
# 重启开发服务器
pnpm dev

# 检查类型
pnpm typecheck

# 清除浏览器缓存后测试
# 使用无痕模式访问 http://localhost:3000
```

---

**修复日期**: 2025-05-29  
**影响范围**: 所有使用旧模型名称的用户  
**修复状态**: ✅ 已修复并添加自动迁移
