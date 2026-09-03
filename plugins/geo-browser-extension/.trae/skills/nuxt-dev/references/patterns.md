# Code Patterns and Templates

## Architecture Patterns

### Composable Pattern
**组合式函数模式** - 封装可复用的响应式逻辑

```typescript
// app/composables/useChatActions.ts
export function useChatActions() {
  const { csrf, headerName } = useCsrf()
  
  async function createChat(message: Message) {
    return await $fetch('/api/chats', {
      method: 'POST',
      headers: { [headerName]: csrf },
      body: { message }
    })
  }
  
  async function deleteChat(id: string) {
    await $fetch(`/api/chats/${id}`, {
      method: 'DELETE',
      headers: { [headerName]: csrf }
    })
  }
  
  return { createChat, deleteChat }
}
```

### Server Route Pattern
**服务器路由模式** - RESTful API 设计

```typescript
// server/api/chats/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { user } = await getUserSession(event)
  
  // 查询数据库
  const chat = await useDrizzle()
    .select()
    .from(tables.chats)
    .where(eq(tables.chats.id, id))
    .get()
  
  // 权限检查
  if (chat.visibility === 'private' && chat.userId !== user?.id) {
    throw createError({ statusCode: 403 })
  }
  
  return chat
})
```

### Streaming Response Pattern
**流式响应模式** - AI 消息流式传输

```typescript
// server/api/chats/[id].post.ts
import { streamText } from 'ai'

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event)
  
  const result = streamText({
    model: anthropic('claude-3-5-haiku-latest'),
    messages: [{ role: 'user', content: message.parts }],
    tools: { weather, chart, search }
  })
  
  return result.toDataStreamResponse()
})
```

## Error Handling Patterns

### API Error Handling
```typescript
// server/api/example.ts
export default defineEventHandler(async (event) => {
  try {
    // 业务逻辑
    const data = await fetchData()
    return data
  } catch (error) {
    // 统一错误处理
    console.error('API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: error.message }
    })
  }
})
```

### Component Error Handling
```vue
<script setup lang="ts">
const { data, error, pending } = await useFetch('/api/data')

watchEffect(() => {
  if (error.value) {
    toast.add({
      title: 'Error',
      description: error.value.message,
      color: 'red'
    })
  }
})
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>{{ data }}</div>
</template>
```

## Logging Patterns

### Server Logging
```typescript
// server/api/example.ts
export default defineEventHandler(async (event) => {
  const start = Date.now()
  
  console.log('[API] Request:', event.path)
  
  try {
    const result = await doSomething()
    console.log('[API] Success:', event.path, `${Date.now() - start}ms`)
    return result
  } catch (error) {
    console.error('[API] Error:', event.path, error)
    throw error
  }
})
```

### Client Logging
```typescript
// app/composables/useLogger.ts
export function useLogger(scope: string) {
  function log(...args: any[]) {
    console.log(`[${scope}]`, ...args)
  }
  
  function error(...args: any[]) {
    console.error(`[${scope}]`, ...args)
  }
  
  return { log, error }
}
```

## Async Patterns

### Data Fetching with Auto-refresh
```typescript
// app/composables/useChats.ts
export function useChats() {
  const { data: chats, refresh, pending } = useLazyFetch('/api/chats', {
    default: () => [],
    key: 'chats',
    getCachedData: key => useNuxtData(key).data.value
  })
  
  return { chats, refresh, pending }
}
```

### Sequential Async Operations
```typescript
async function createChatWithMessage(message: Message) {
  // 1. 创建聊天
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: { message }
  })
  
  // 2. 上传文件（如果有）
  if (files.length > 0) {
    await Promise.all(
      files.map(file => uploadFile(chat.id, file))
    )
  }
  
  // 3. 导航到聊天页面
  await navigateTo(`/chat/${chat.id}`)
}
```

### Parallel Async Operations
```typescript
async function loadChatData(chatId: string) {
  const [chat, messages, votes] = await Promise.all([
    $fetch(`/api/chats/${chatId}`),
    $fetch(`/api/chats/${chatId}/messages`),
    $fetch(`/api/chats/${chatId}/votes`)
  ])
  
  return { chat, messages, votes }
}
```

## Naming Conventions

### File Naming
- **Pages**: `kebab-case.vue` - 如 `chat/[id].vue`
- **Components**: `PascalCase.vue` - 如 `ChatTitle.vue`
- **Composables**: `camelCase.ts` - 如 `useChatActions.ts`
- **API Routes**: `resource.method.ts` - 如 `chats.get.ts`, `[id].post.ts`
- **Utils**: `camelCase.ts` - 如 `formatDate.ts`
- **Types**: `kebab-case.d.ts` - 如 `db.d.ts`

### Variable Naming
- **Constants**: `UPPER_SNAKE_CASE` - 如 `MAX_FILE_SIZE`
- **Variables**: `camelCase` - 如 `chatId`, `uploadedFiles`
- **Functions**: `camelCase` - 如 `createChat`, `deleteMessage`
- **Components**: `PascalCase` - 如 `ChatTitle`, `UserMenu`
- **Types/Interfaces**: `PascalCase` - 如 `Chat`, `Message`, `User`

### Function Naming
- **Event handlers**: `on*` 或 `handle*` - 如 `onClick`, `handleSubmit`
- **Composables**: `use*` - 如 `useChats`, `useFileUpload`
- **Boolean getters**: `is*`, `has*`, `can*` - 如 `isLoading`, `hasPermission`
- **Async functions**: 描述性动词 - 如 `fetchChats`, `createChat`

## Code Templates

### API Route Template
```typescript
// server/api/resource.get.ts
export default defineEventHandler(async (event) => {
  // 1. 获取参数
  const query = getQuery(event)
  
  // 2. 认证检查（可选）
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({ statusCode: 401 })
  }
  
  // 3. 权限检查（可选）
  if (!hasPermission(user)) {
    throw createError({ statusCode: 403 })
  }
  
  // 4. 业务逻辑
  const db = useDrizzle()
  const data = await db.select().from(tables.resource).all()
  
  // 5. 返回结果
  return data
})
```

### Composable Template
```typescript
// app/composables/useResource.ts
export function useResource() {
  const { data, refresh, pending } = useLazyFetch('/api/resource', {
    key: 'resource',
    default: () => []
  })
  
  async function createResource(payload: CreatePayload) {
    const result = await $fetch('/api/resource', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return result
  }
  
  async function deleteResource(id: string) {
    await $fetch(`/api/resource/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  }
  
  return {
    data,
    pending,
    refresh,
    createResource,
    deleteResource
  }
}
```

### Component Template
```vue
<!-- app/components/ExampleComponent.vue -->
<script setup lang="ts">
interface Props {
  title: string
  items: Array<any>
  disabled?: boolean
}

interface Emits {
  (e: 'update', value: any): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式状态
const selected = ref<string | null>(null)

// 计算属性
const filteredItems = computed(() => {
  return props.items.filter(item => item.active)
})

// 方法
function handleClick(item: any) {
  selected.value = item.id
  emit('update', item)
}
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <ul>
      <li
        v-for="item in filteredItems"
        :key="item.id"
        @click="handleClick(item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>
```

## Database Patterns

### Query Pattern with Relations
```typescript
const db = useDrizzle()

// 查询聊天及其消息
const chatWithMessages = await db
  .select()
  .from(tables.chats)
  .where(eq(tables.chats.id, chatId))
  .leftJoin(tables.messages, eq(tables.messages.chatId, tables.chats.id))
  .all()
```

### Transaction Pattern
```typescript
await db.transaction(async (tx) => {
  // 创建聊天
  await tx.insert(tables.chats).values({ id, title, userId })
  
  // 创建首条消息
  await tx.insert(tables.messages).values({
    chatId: id,
    role: 'user',
    parts: message.parts
  })
})
```

### Soft Delete Pattern
```typescript
// 标记为已删除而非真实删除
await db
  .update(tables.chats)
  .set({ deletedAt: new Date() })
  .where(eq(tables.chats.id, chatId))
```

## Feature Integration Patterns

### Adding a New Tool
1. **定义工具**: `server/utils/tools/myTool.ts`
```typescript
export const myTool = {
  name: 'my_tool',
  description: 'Description of what this tool does',
  parameters: z.object({
    param: z.string()
  }),
  execute: async ({ param }) => {
    // 工具逻辑
    return result
  }
}
```

2. **注册工具**: `server/api/chats/[id].post.ts`
```typescript
import { myTool } from '~/server/utils/tools/myTool'

const result = streamText({
  tools: { weather, chart, search, myTool }
})
```

3. **创建 UI 组件**: `app/components/chat/tool/MyTool.vue`
```vue
<script setup lang="ts">
defineProps<{ data: any }>()
</script>

<template>
  <div>
    <!-- 渲染工具结果 -->
  </div>
</template>
```

### Adding a New Page
1. **创建页面**: `app/pages/my-page.vue`
2. **添加路由链接**: 在导航组件中添加链接
3. **添加权限检查**: 在页面中使用 `definePageMeta`

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth' // 需要认证
})
</script>
```

### Adding a New API Endpoint
1. **创建路由文件**: `server/api/resource/[id].get.ts`
2. **实现业务逻辑**: 参考 API Route Template
3. **添加类型定义**: `shared/types/resource.d.ts`
4. **在前端调用**: 使用 `$fetch` 或 `useFetch`

### Adding Database Fields
1. **更新模式**: `server/db/schema.ts`
```typescript
export const chats = sqliteTable('chats', {
  // 新增字段
  newField: text('new_field')
})
```

2. **生成迁移**: `pnpm db:generate`
3. **运行迁移**: `pnpm db:migrate`
4. **更新类型**: TypeScript 类型自动生成
