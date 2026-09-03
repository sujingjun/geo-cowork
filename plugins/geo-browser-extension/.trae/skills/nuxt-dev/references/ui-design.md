# UI 设计规范

## 设计系统概览

本项目采用 **Nuxt UI** 作为核心设计系统，基于 Tailwind CSS 4 构建，提供一套完整的组件库和设计规范。

### 核心设计原则
- **一致性** - 统一的视觉语言和交互模式
- **可访问性** - 符合 WCAG 2.1 AA 标准
- **响应式** - 移动优先，适配多种设备
- **可定制** - 主题可配置，支持深色模式
- **性能优先** - 最小化样式体积，优化渲染性能

---

## 色彩系统

### 主色调（Primary）
```typescript
// app.config.ts
ui: {
  primary: 'blue',  // 可选：blue, green, red, purple, yellow, orange 等
  gray: 'neutral'   // 可选：slate, gray, zinc, neutral, stone
}
```

### 语义化颜色
- **Primary** - 主要操作、链接、强调
- **Success** - 成功状态、正向反馈
- **Warning** - 警告信息、需注意事项
- **Error** - 错误状态、失败反馈
- **Info** - 提示信息、中性反馈

### 颜色使用规范
```vue
<!-- 按钮颜色 -->
<UButton color="primary">主要操作</UButton>
<UButton color="gray" variant="ghost">次要操作</UButton>
<UButton color="red" variant="outline">危险操作</UButton>

<!-- 状态颜色 -->
<UBadge color="green">成功</UBadge>
<UBadge color="yellow">警告</UBadge>
<UBadge color="red">错误</UBadge>
```

### 深色模式支持
```vue
<!-- 自动支持深色模式 -->
<template>
  <div class="bg-white dark:bg-gray-900">
    <p class="text-gray-900 dark:text-gray-100">内容</p>
  </div>
</template>
```

---

## 字体排版

### 字体家族
```css
/* 默认字体栈 */
font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

/* 等宽字体（代码） */
font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

### 字体大小层级
| 级别 | Tailwind Class | 尺寸 | 使用场景 |
|------|----------------|------|----------|
| XS | `text-xs` | 0.75rem (12px) | 辅助文本、标签 |
| SM | `text-sm` | 0.875rem (14px) | 正文、描述 |
| Base | `text-base` | 1rem (16px) | 默认正文 |
| LG | `text-lg` | 1.125rem (18px) | 小标题 |
| XL | `text-xl` | 1.25rem (20px) | 卡片标题 |
| 2XL | `text-2xl` | 1.5rem (24px) | 页面标题 |
| 3XL | `text-3xl` | 1.875rem (30px) | 主标题 |
| 4XL | `text-4xl` | 2.25rem (36px) | 大标题 |

### 字重（Font Weight）
- `font-normal` (400) - 正文
- `font-medium` (500) - 强调文本
- `font-semibold` (600) - 小标题
- `font-bold` (700) - 标题

### 行高（Line Height）
- `leading-tight` (1.25) - 标题
- `leading-normal` (1.5) - 正文
- `leading-relaxed` (1.625) - 长文本

---

## 间距系统

### 间距标准
基于 **4px 基准**，使用 Tailwind 的间距单位：

| 单位 | 像素 | 使用场景 |
|------|------|----------|
| `1` | 4px | 微小间距 |
| `2` | 8px | 紧凑间距 |
| `3` | 12px | 小间距 |
| `4` | 16px | 标准间距 |
| `6` | 24px | 中等间距 |
| `8` | 32px | 大间距 |
| `12` | 48px | 分区间距 |
| `16` | 64px | 大分区间距 |

### Padding 使用规范
```vue
<!-- 卡片内边距 -->
<UCard class="p-4 sm:p-6">内容</UCard>

<!-- 页面容器 -->
<div class="px-4 py-6 sm:px-6 lg:px-8">页面内容</div>

<!-- 按钮内边距 -->
<UButton size="sm">小按钮</UButton>  <!-- px-3 py-1.5 -->
<UButton size="md">中按钮</UButton>  <!-- px-4 py-2 -->
<UButton size="lg">大按钮</UButton>  <!-- px-5 py-2.5 -->
```

### Margin 使用规范
```vue
<!-- 段落间距 -->
<p class="mb-4">第一段</p>
<p class="mb-4">第二段</p>

<!-- 区块间距 -->
<section class="mb-8">区块 1</section>
<section class="mb-8">区块 2</section>

<!-- 标题间距 -->
<h2 class="text-2xl font-bold mb-3">标题</h2>
<p class="text-base">正文</p>
```

### Gap 使用规范（Flexbox / Grid）
```vue
<!-- Flex 间距 -->
<div class="flex gap-4">
  <UButton>按钮 1</UButton>
  <UButton>按钮 2</UButton>
</div>

<!-- Grid 间距 -->
<div class="grid grid-cols-3 gap-6">
  <UCard>卡片 1</UCard>
  <UCard>卡片 2</UCard>
  <UCard>卡片 3</UCard>
</div>
```

---

## 组件设计系统

### 按钮（Button）
```vue
<!-- 基础按钮 -->
<UButton>默认按钮</UButton>
<UButton color="primary">主要操作</UButton>
<UButton color="gray">次要操作</UButton>

<!-- 按钮变体 -->
<UButton variant="solid">实心</UButton>
<UButton variant="outline">轮廓</UButton>
<UButton variant="ghost">幽灵</UButton>
<UButton variant="soft">柔和</UButton>
<UButton variant="link">链接</UButton>

<!-- 按钮尺寸 -->
<UButton size="xs">超小</UButton>
<UButton size="sm">小</UButton>
<UButton size="md">中</UButton>
<UButton size="lg">大</UButton>
<UButton size="xl">超大</UButton>

<!-- 图标按钮 -->
<UButton icon="i-heroicons-plus" />
<UButton icon="i-heroicons-plus" label="添加" />
<UButton label="删除" trailing-icon="i-heroicons-trash" />
```

### 输入框（Input）
```vue
<!-- 基础输入 -->
<UInput v-model="value" placeholder="请输入内容" />

<!-- 带图标 -->
<UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="搜索" />

<!-- 带标签 -->
<UFormGroup label="用户名" hint="请输入您的用户名">
  <UInput v-model="username" />
</UFormGroup>

<!-- 状态输入 -->
<UInput v-model="value" :error="errorMessage" />
<UInput v-model="value" color="green" />
```

### 卡片（Card）
```vue
<!-- 基础卡片 -->
<UCard>
  <template #header>
    <h3 class="text-lg font-semibold">卡片标题</h3>
  </template>
  <p>卡片内容</p>
  <template #footer>
    <UButton>操作</UButton>
  </template>
</UCard>

<!-- 简单卡片 -->
<UCard class="p-6">
  <h3 class="text-xl font-bold mb-3">标题</h3>
  <p class="text-gray-600">内容</p>
</UCard>
```

### 模态框（Modal）
```vue
<UModal v-model="isOpen">
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">模态框标题</h3>
    </template>
    <p>模态框内容</p>
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="gray" @click="isOpen = false">取消</UButton>
        <UButton @click="handleConfirm">确认</UButton>
      </div>
    </template>
  </UCard>
</UModal>
```

### 通知（Notification）
```vue
<script setup>
const toast = useToast()

function showSuccess() {
  toast.add({
    title: '成功',
    description: '操作已完成',
    color: 'green'
  })
}

function showError() {
  toast.add({
    title: '错误',
    description: '操作失败，请重试',
    color: 'red'
  })
}
</script>
```

---

## 布局规范

### 容器宽度
```vue
<!-- 最大宽度容器 -->
<div class="container mx-auto max-w-7xl px-4">
  <!-- 内容 -->
</div>

<!-- 响应式容器 -->
<div class="max-w-sm">小容器 (24rem)</div>
<div class="max-w-md">中容器 (28rem)</div>
<div class="max-w-lg">大容器 (32rem)</div>
<div class="max-w-xl">超大容器 (36rem)</div>
<div class="max-w-2xl">2XL 容器 (42rem)</div>
<div class="max-w-7xl">7XL 容器 (80rem)</div>
```

### 网格系统
```vue
<!-- 响应式网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>列 1</div>
  <div>列 2</div>
  <div>列 3</div>
</div>

<!-- 自适应网格 -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
  <div>卡片 1</div>
  <div>卡片 2</div>
  <div>卡片 3</div>
</div>
```

### Flex 布局
```vue
<!-- 水平居中 -->
<div class="flex justify-center items-center">
  <div>居中内容</div>
</div>

<!-- 两端对齐 -->
<div class="flex justify-between items-center">
  <div>左侧</div>
  <div>右侧</div>
</div>

<!-- 垂直堆叠 -->
<div class="flex flex-col gap-4">
  <div>项目 1</div>
  <div>项目 2</div>
</div>
```

---

## 响应式设计

### 断点标准
| 断点 | 最小宽度 | 设备 |
|------|----------|------|
| `sm` | 640px | 手机横屏 |
| `md` | 768px | 平板竖屏 |
| `lg` | 1024px | 平板横屏 / 小笔记本 |
| `xl` | 1280px | 桌面 |
| `2xl` | 1536px | 大屏幕 |

### 响应式类使用
```vue
<!-- 响应式字体 -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">响应式标题</h1>

<!-- 响应式间距 -->
<div class="p-4 md:p-6 lg:p-8">响应式内边距</div>

<!-- 响应式布局 -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">左侧</div>
  <div class="w-full md:w-1/2">右侧</div>
</div>

<!-- 响应式显示/隐藏 -->
<div class="hidden md:block">桌面显示</div>
<div class="block md:hidden">移动显示</div>
```

---

## 动画与过渡

### 过渡时长
- `duration-75` (75ms) - 微小交互
- `duration-150` (150ms) - 快速交互
- `duration-300` (300ms) - 标准交互
- `duration-500` (500ms) - 慢速交互

### 常用过渡效果
```vue
<!-- 悬停过渡 -->
<UButton class="transition-colors duration-200 hover:bg-blue-600">
  悬停效果
</UButton>

<!-- 透明度过渡 -->
<div class="transition-opacity duration-300 opacity-0 hover:opacity-100">
  渐显内容
</div>

<!-- 变换过渡 -->
<div class="transition-transform duration-200 hover:scale-105">
  缩放卡片
</div>
```

### Vue 过渡组件
```vue
<Transition name="fade">
  <div v-if="show">淡入淡出</div>
</Transition>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

---

## 无障碍设计

### 语义化 HTML
```vue
<!-- 使用正确的 HTML 标签 -->
<header>
  <nav>
    <UButton to="/">首页</UButton>
  </nav>
</header>

<main>
  <article>
    <h1>文章标题</h1>
    <p>文章内容</p>
  </article>
</main>

<footer>
  <p>&copy; 2024 版权所有</p>
</footer>
```

### ARIA 属性
```vue
<!-- 可访问性标签 -->
<UButton aria-label="关闭对话框" icon="i-heroicons-x-mark" />

<!-- 状态说明 -->
<div role="alert" aria-live="polite">
  操作成功
</div>

<!-- 描述关联 -->
<UInput 
  v-model="email" 
  aria-describedby="email-help"
/>
<p id="email-help" class="text-sm text-gray-500">
  请输入有效的邮箱地址
</p>
```

### 键盘导航
- 所有交互元素可通过 Tab 键访问
- 使用 Enter / Space 键激活按钮
- 使用 Esc 键关闭模态框和下拉菜单
- 支持方向键导航（列表、菜单）

### 颜色对比度
- 正文文本：至少 4.5:1
- 大文本（18px+ 或 14px+ 加粗）：至少 3:1
- UI 组件：至少 3:1

---

## 图标系统

### 使用 Iconify
```vue
<!-- Heroicons -->
<UIcon name="i-heroicons-home" />
<UIcon name="i-heroicons-user" />
<UIcon name="i-heroicons-cog-6-tooth" />

<!-- 自定义尺寸 -->
<UIcon name="i-heroicons-star" class="w-4 h-4" />
<UIcon name="i-heroicons-star" class="w-6 h-6" />
<UIcon name="i-heroicons-star" class="w-8 h-8" />

<!-- 自定义颜色 -->
<UIcon name="i-heroicons-heart" class="text-red-500" />
```

### 图标使用规范
- 小图标（16px）：导航、按钮内图标
- 中图标（20px）：列表项、卡片图标
- 大图标（24px）：页面标题、特性图标
- 超大图标（32px+）：空状态、插图

---

## 最佳实践

### 1. 优先使用 Nuxt UI 组件
```vue
<!-- ✅ 推荐：使用 Nuxt UI 组件 -->
<UButton>点击</UButton>
<UInput v-model="value" />
<UCard>内容</UCard>

<!-- ❌ 避免：手动实现已有组件 -->
<button class="px-4 py-2 bg-blue-500 text-white rounded">点击</button>
```

### 2. 使用 Tailwind 工具类
```vue
<!-- ✅ 推荐：使用 Tailwind 类 -->
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
  内容
</div>

<!-- ❌ 避免：内联样式 -->
<div style="display: flex; padding: 24px; background: white;">
  内容
</div>
```

### 3. 保持设计一致性
- 统一使用主题颜色
- 遵循间距标准
- 统一圆角尺寸（默认 `rounded-md`）
- 统一阴影样式（默认 `shadow-sm`）

### 4. 性能优化
- 避免过度嵌套
- 减少不必要的动画
- 使用 `loading` 状态提升体验
- 图片懒加载和优化

### 5. 深色模式
- 所有组件默认支持深色模式
- 使用 `dark:` 前缀自定义深色样式
- 测试深色模式下的可读性和对比度

---

## 参考资源

- [Nuxt UI 文档](https://ui.nuxt.com)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Iconify 图标库](https://icon-sets.iconify.design)
- [WCAG 无障碍指南](https://www.w3.org/WAI/WCAG21/quickref/)
