# SEO/GEO 实施指南

## 什么是 SEO 和 GEO？

### SEO（Search Engine Optimization）
**传统搜索引擎优化** - 优化网站以提高在 Google、Bing 等搜索引擎中的排名和可见性。

### GEO（Generative Engine Optimization）
**生成式引擎优化** - 针对 AI 驱动的搜索引擎（ChatGPT、Perplexity、Gemini、Claude、Copilot）优化内容，使其更容易被 AI 理解、引用和推荐。

### 为什么两者都重要？
- **传统搜索** - 仍然是主要流量来源（Google 占全球搜索 90%+）
- **AI 搜索** - 快速增长的新渠道，用户开始使用 ChatGPT、Perplexity 等工具搜索信息
- **未来趋势** - AI 搜索将与传统搜索并存，需要同时优化

---

## 在 Nuxt 项目中实现 SEO/GEO

### 1. 安装必要的模块

#### @nuxtjs/seo（推荐）
集成 SEO 工具套件，包含 sitemap、robots、schema-org 等。

```bash
pnpm add -D @nuxtjs/seo
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo'],
  
  site: {
    url: 'https://example.com',
    name: '网站名称',
    description: '网站描述',
    defaultLocale: 'zh-CN'
  }
})
```

#### nuxt-schema-org（独立使用）
如果只需要结构化数据：

```bash
pnpm add -D nuxt-schema-org
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-schema-org'],
  
  schemaOrg: {
    host: 'https://example.com'
  }
})
```

---

## Meta 标签优化

### 1. 页面级 Meta 标签

```vue
<script setup>
// pages/index.vue
useSeoMeta({
  title: '首页标题 - 网站名称',
  description: '首页描述，包含关键词，150-160 字符',
  keywords: '关键词1, 关键词2, 关键词3',
  
  // Open Graph (社交分享)
  ogTitle: '首页标题',
  ogDescription: '首页描述',
  ogImage: 'https://example.com/og-image.jpg',
  ogType: 'website',
  ogUrl: 'https://example.com',
  
  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: '首页标题',
  twitterDescription: '首页描述',
  twitterImage: 'https://example.com/twitter-image.jpg',
  
  // 其他
  robots: 'index, follow',
  author: '作者名称',
  language: 'zh-CN'
})
</script>

<template>
  <div>
    <h1>首页内容</h1>
  </div>
</template>
```

### 2. 动态 Meta 标签（文章页）

```vue
<script setup>
// pages/articles/[slug].vue
const route = useRoute()
const { data: article } = await useFetch(`/api/articles/${route.params.slug}`)

useSeoMeta({
  title: () => `${article.value.title} - 网站名称`,
  description: () => article.value.excerpt,
  ogTitle: () => article.value.title,
  ogDescription: () => article.value.excerpt,
  ogImage: () => article.value.coverImage,
  ogType: 'article',
  articlePublishedTime: () => article.value.publishedAt,
  articleModifiedTime: () => article.value.updatedAt,
  articleAuthor: () => article.value.author.name
})
</script>

<template>
  <article>
    <h1>{{ article.title }}</h1>
    <p>{{ article.content }}</p>
  </article>
</template>
```

### 3. 全局默认 Meta 标签

```vue
<!-- app.vue -->
<script setup>
useSeoMeta({
  titleTemplate: '%s - 网站名称',
  description: '默认网站描述',
  ogImage: 'https://example.com/default-og.jpg',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

---

## 结构化数据（Schema.org）

### 1. 网站基础信息

```vue
<script setup lang="ts">
// app.vue 或 layouts/default.vue
useSchemaOrg([
  {
    '@type': 'WebSite',
    name: '网站名称',
    url: 'https://example.com',
    description: '网站描述',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://example.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  },
  {
    '@type': 'Organization',
    name: '组织名称',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    sameAs: [
      'https://twitter.com/username',
      'https://github.com/username'
    ]
  }
])
</script>
```

### 2. 文章页结构化数据

```vue
<script setup>
// pages/articles/[slug].vue
const article = await fetchArticle()

useSchemaOrg([
  {
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url
    },
    publisher: {
      '@type': 'Organization',
      name: '网站名称',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    }
  }
])
</script>
```

### 3. 面包屑导航

```vue
<script setup>
// pages/blog/[category]/[slug].vue
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://example.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '博客',
        item: 'https://example.com/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '分类名称',
        item: 'https://example.com/blog/category'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: '文章标题',
        item: 'https://example.com/blog/category/article'
      }
    ]
  }
])
</script>

<template>
  <nav aria-label="面包屑导航">
    <ol class="flex gap-2">
      <li><NuxtLink to="/">首页</NuxtLink></li>
      <li>/</li>
      <li><NuxtLink to="/blog">博客</NuxtLink></li>
      <li>/</li>
      <li>{{ article.title }}</li>
    </ol>
  </nav>
</template>
```

### 4. FAQ 页面

```vue
<script setup>
useSchemaOrg([
  {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '问题 1？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '答案 1 的详细内容...'
        }
      },
      {
        '@type': 'Question',
        name: '问题 2？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '答案 2 的详细内容...'
        }
      }
    ]
  }
])
</script>
```

---

## Sitemap 配置

### 自动生成 Sitemap

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo'],
  
  sitemap: {
    strictNuxtContentPaths: true,
    // 自动从页面生成
    autoLastmod: true,
    
    // 排除某些路径
    exclude: [
      '/admin/**',
      '/api/**'
    ],
    
    // 自定义 URL
    urls: async () => {
      // 从 API 获取动态路由
      const articles = await $fetch('/api/articles')
      return articles.map(article => ({
        url: `/articles/${article.slug}`,
        lastmod: article.updatedAt,
        changefreq: 'weekly',
        priority: 0.8
      }))
    }
  }
})
```

---

## Robots.txt 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo'],
  
  robots: {
    // 允许所有搜索引擎
    allow: '/',
    
    // 禁止某些路径
    disallow: [
      '/admin',
      '/api',
      '/private'
    ],
    
    // Sitemap 位置
    sitemap: 'https://example.com/sitemap.xml',
    
    // 针对特定爬虫的规则
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/admin'
      },
      {
        userAgent: 'ChatGPT-User',  // OpenAI 爬虫
        allow: '/',
        disallow: '/admin'
      }
    ]
  }
})
```

---

## AI 搜索优化（GEO）

### 1. 内容结构化

AI 更容易理解结构化的内容：

```vue
<template>
  <article>
    <!-- 明确的标题层级 -->
    <h1>主标题：如何优化 Nuxt 应用的 SEO</h1>
    
    <!-- 摘要/引言 -->
    <p class="lead">
      本文介绍 Nuxt 应用的 SEO 优化方法，包括 Meta 标签、结构化数据和 AI 搜索优化。
    </p>
    
    <!-- 分节明确 -->
    <section>
      <h2>Meta 标签优化</h2>
      <p>Meta 标签是 SEO 的基础...</p>
      
      <h3>标题标签</h3>
      <p>标题标签应该...</p>
      
      <h3>描述标签</h3>
      <p>描述标签应该...</p>
    </section>
    
    <section>
      <h2>结构化数据</h2>
      <p>结构化数据帮助搜索引擎...</p>
    </section>
    
    <!-- 关键信息突出 -->
    <aside class="highlight">
      <strong>关键要点：</strong>
      <ul>
        <li>使用语义化 HTML</li>
        <li>添加结构化数据</li>
        <li>优化内容可读性</li>
      </ul>
    </aside>
  </article>
</template>
```

### 2. 内容优化原则

#### ✅ DO - 好的做法
- 使用清晰的标题和副标题
- 提供简洁的摘要/引言
- 使用列表和表格组织信息
- 突出关键信息和要点
- 添加代码示例和实际案例
- 使用语义化 HTML 标签
- 提供准确的元数据

#### ❌ DON'T - 避免的做法
- 过度使用关键词填充
- 隐藏内容或关键词
- 大段无结构的文本
- 模糊或误导性的标题
- 过度嵌套的 HTML 结构
- 缺少 alt 属性的图片

### 3. 答案优化（为 AI 问答准备）

AI 搜索引擎经常提取明确的答案：

```vue
<template>
  <article>
    <h1>什么是 Nuxt？</h1>
    
    <!-- 直接回答问题 -->
    <p>
      <strong>Nuxt 是一个基于 Vue.js 的全栈框架</strong>，
      用于构建现代化的 Web 应用程序。它提供了服务器端渲染、
      静态站点生成、自动路由等功能。
    </p>
    
    <!-- 详细说明 -->
    <h2>核心特性</h2>
    <ul>
      <li><strong>服务器端渲染 (SSR)</strong>：提升首屏加载速度和 SEO</li>
      <li><strong>自动路由</strong>：基于文件系统的路由</li>
      <li><strong>TypeScript 支持</strong>：开箱即用</li>
    </ul>
    
    <!-- 实际示例 -->
    <h2>快速开始</h2>
    <pre><code>pnpm create nuxt@latest my-app</code></pre>
  </article>
</template>
```

### 4. 引用和来源

帮助 AI 理解内容的权威性：

```vue
<template>
  <article>
    <h1>Vue 3 Composition API 性能优势</h1>
    <p>
      根据 <a href="https://vuejs.org" rel="nofollow">Vue.js 官方文档</a>，
      Composition API 相比 Options API 有更好的 TypeScript 支持和代码组织能力。
    </p>
    
    <!-- 引用数据 -->
    <blockquote cite="https://vuejs.org/guide/extras/composition-api-faq.html">
      <p>
        "Composition API provides better logic reuse and more flexible code organization."
      </p>
      <footer>— Vue.js 官方文档</footer>
    </blockquote>
    
    <!-- 参考资源 -->
    <section>
      <h2>参考资源</h2>
      <ul>
        <li><a href="https://vuejs.org">Vue.js 官方网站</a></li>
        <li><a href="https://nuxt.com">Nuxt 官方文档</a></li>
      </ul>
    </section>
  </article>
</template>
```

---

## 性能优化（影响 SEO）

### 1. 图片优化

```vue
<template>
  <!-- 使用 Nuxt Image 自动优化 -->
  <NuxtImg
    src="/image.jpg"
    alt="图片描述（必需）"
    width="800"
    height="600"
    loading="lazy"
    format="webp"
  />
  
  <!-- 响应式图片 -->
  <NuxtImg
    src="/hero.jpg"
    alt="英雄图"
    sizes="sm:100vw md:50vw lg:400px"
    loading="lazy"
  />
</template>
```

### 2. 字体优化

```vue
<script setup>
// 预加载关键字体
useHead({
  link: [
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/inter-var.woff2',
      crossorigin: 'anonymous'
    }
  ]
})
</script>
```

### 3. 预加载关键资源

```vue
<script setup>
useHead({
  link: [
    // 预连接到外部域名
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    // 预加载关键资源
    {
      rel: 'preload',
      as: 'image',
      href: '/hero-image.jpg'
    }
  ]
})
</script>
```

---

## 内容优化检查清单

### 📋 页面级检查
- [ ] 标题标签（50-60 字符）
- [ ] 描述标签（150-160 字符）
- [ ] H1 标签（每页唯一）
- [ ] 图片 alt 属性
- [ ] 内部链接
- [ ] 外部链接（rel="nofollow" 如需要）
- [ ] 语义化 HTML
- [ ] 移动端友好
- [ ] 加载速度 < 3 秒

### 📋 结构化数据检查
- [ ] WebSite schema
- [ ] Organization schema
- [ ] Article/BlogPosting schema（文章页）
- [ ] BreadcrumbList schema
- [ ] FAQPage schema（FAQ 页面）
- [ ] 使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 测试

### 📋 AI 优化检查
- [ ] 明确的标题和副标题
- [ ] 简洁的摘要/引言
- [ ] 结构化内容（列表、表格）
- [ ] 突出关键信息
- [ ] 代码示例和案例
- [ ] 引用和来源
- [ ] 答案直接明确

### 📋 技术 SEO 检查
- [ ] Sitemap.xml 生成
- [ ] Robots.txt 配置
- [ ] Canonical URL
- [ ] 404 页面
- [ ] 301 重定向（旧 URL）
- [ ] HTTPS
- [ ] 响应式设计

---

## 测试和验证工具

### 传统 SEO 工具
- [Google Search Console](https://search.google.com/search-console) - 搜索表现监控
- [Google Rich Results Test](https://search.google.com/test/rich-results) - 结构化数据测试
- [PageSpeed Insights](https://pagespeed.web.dev) - 性能和 SEO 分析
- [Screaming Frog](https://www.screamingfrogseosuite.co.uk/) - 网站爬取分析

### AI 搜索测试
- **ChatGPT** - 直接询问 "Tell me about [your website/topic]"
- **Perplexity** - 搜索你的品牌或主题，看是否被引用
- **Google Gemini** - 测试内容是否被理解和引用

### Nuxt 开发工具
```bash
# 生成 sitemap
nuxt generate

# 检查构建输出
nuxt build --analyze

# 本地预览（测试 SEO）
nuxt preview
```

---

## 实施步骤

### 1. 基础配置（必做）
```bash
# 安装 SEO 模块
pnpm add -D @nuxtjs/seo
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo'],
  
  site: {
    url: 'https://example.com',
    name: '网站名称',
    description: '网站描述'
  }
})
```

### 2. 页面 Meta（必做）
在每个页面添加 `useSeoMeta()`，设置标题、描述、OG 标签。

### 3. 结构化数据（推荐）
在关键页面添加 `useSchemaOrg()`，提供结构化数据。

### 4. Sitemap 和 Robots（推荐）
配置 sitemap 和 robots.txt，帮助搜索引擎爬取。

### 5. 内容优化（重要）
优化内容结构、标题、摘要，提升 AI 理解能力。

### 6. 性能优化（必做）
优化图片、字体、资源加载，提升用户体验和 SEO。

### 7. 测试和监控（持续）
使用工具测试 SEO 效果，监控搜索表现，持续优化。

---

## 常见问题

### Q: 需要为每个页面手动配置 SEO 吗？
A: 建议为关键页面（首页、产品页、文章页）手动配置，其他页面可使用全局默认值。

### Q: 结构化数据是必需的吗？
A: 不是必需，但强烈推荐。它能显著提升搜索结果的展示效果（富文本摘要、面包屑等）。

### Q: 如何优化动态生成的页面？
A: 使用 `useFetch` 获取数据后，动态生成 Meta 标签和结构化数据。

### Q: AI 搜索引擎会爬取我的网站吗？
A: 是的，ChatGPT、Perplexity 等都有自己的爬虫（如 ChatGPT-User）。可以在 robots.txt 中配置。

### Q: SEO 优化需要多久见效?
A: 传统 SEO 通常需要 3-6 个月。AI 搜索的索引速度更快，但也取决于内容质量和网站权威性。

---

## 参考资源

### 官方文档
- [@nuxtjs/seo](https://nuxtseo.com) - Nuxt SEO 工具套件
- [nuxt-schema-org](https://github.com/harlan-zw/nuxt-schema-org) - 结构化数据模块
- [Schema.org](https://schema.org) - 结构化数据标准
- [Google Search Central](https://developers.google.com/search) - Google SEO 指南

### GEO 相关
- [OpenAI Web Crawling](https://platform.openai.com/docs/plugins/bot) - ChatGPT 爬虫说明
- [Perplexity AI](https://www.perplexity.ai) - AI 搜索引擎
- [GEO Guide by Priyanka](https://www.priyankavirguez.com/geoguide) - GEO 优化指南

### SEO 工具
- [Ahrefs](https://ahrefs.com) - SEO 分析工具
- [Semrush](https://www.semrush.com) - 关键词研究和竞争分析
- [Moz](https://moz.com) - SEO 工具和资源
