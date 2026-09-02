<script setup lang="ts">
const input = ref('')
const loading = ref(false)
const chatId = crypto.randomUUID()

const { user } = useUserSession()

// 检查店铺授权状态
const { hasAuthorizedStore, fetchStores } = useStores()

// 组件加载时检查授权状态
onMounted(async () => {
  await fetchStores()
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  let timeGreeting = 'Good evening'
  if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 18) timeGreeting = 'Good afternoon'

  const name = user.value?.name?.split(' ')[0] || user.value?.username

  return name ? `${timeGreeting}, ${name}` : `${timeGreeting}`
})

const {
  dropzoneRef,
  dragging,
  open,
  files,
  uploading,
  uploadedFiles,
  removeFile,
  clearFiles
} = useFileUploadWithStatus(chatId)

const { csrf, headerName } = useCsrf()

async function createChat(prompt: string) {
  // 检查是否需要店铺授权
  if (checkStoreAuthRequired(prompt) && !hasAuthorizedStore.value) {
    toast.add({
      title: '需要授权店铺',
      description: '请先连接您的 Amazon 或 Shopify 店铺再生成站点',
      color: 'warning',
      icon: 'i-heroicons-exclamation-triangle'
    })
    // 跳转到店铺管理页，那里会显示授权提示
    navigateTo('/stores')
    return
  }

  input.value = prompt
  loading.value = true

  const parts: Array<{ type: string, text?: string, mediaType?: string, url?: string }> = [{ type: 'text', text: prompt }]

  if (uploadedFiles.value.length > 0) {
    parts.push(...uploadedFiles.value)
  }

  const chat = await $fetch('/api/chats', {
    method: 'POST',
    headers: { [headerName]: csrf },
    body: {
      id: chatId,
      message: {
        role: 'user',
        parts
      }
    }
  })

  refreshNuxtData('chats')
  navigateTo(`/chat/${chat?.id}`)
}

async function onSubmit() {
  await createChat(input.value)
  clearFiles()
}

const quickChats = [
  {
    label: '生成一个母婴产品推荐站点',
    icon: 'i-lucide-baby'
  },
  {
    label: '创建家居装饰商品展示页',
    icon: 'i-lucide-home'
  },
  {
    label: '生成户外运动装备站点',
    icon: 'i-lucide-bike'
  },
  {
    label: '创建电子产品评测站点',
    icon: 'i-lucide-smartphone'
  },
  {
    label: '查看我的店铺数据',
    icon: 'i-lucide-store'
  },
  {
    label: '优化站点GEO设置',
    icon: 'i-lucide-search'
  },
  {
    label: '如何提高站点转化率？',
    icon: 'i-lucide-trending-up'
  }
]

const toast = useToast()

// 检查是否需要店铺授权
function checkStoreAuthRequired(prompt: string): boolean {
  const keywords = ['生成', '创建', '站点', '商品', 'site', 'generate', 'create', 'product']
  return keywords.some(keyword => prompt.toLowerCase().includes(keyword))
}
</script>

<template>
  <UDashboardPanel
    id="home"
    class="min-h-0"
    :ui="{ body: 'p-0 sm:p-0' }"
  >
    <template #header>
      <Navbar />
    </template>

    <template #body>
      <div ref="dropzoneRef" class="flex flex-1">
        <DragDropOverlay :show="dragging" />

        <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
          <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
            {{ greeting }}
          </h1>

          <UChatPrompt
            v-model="input"
            :status="loading ? 'streaming' : 'ready'"
            :disabled="uploading"
            class="[view-transition-name:chat-prompt]"
            variant="subtle"
            :ui="{ base: 'px-1.5' }"
            @submit="onSubmit"
          >
            <template v-if="files.length > 0" #header>
              <ChatFiles :files="files" @remove="removeFile" />
            </template>

            <template #footer>
              <div class="flex items-center gap-1">
                <ChatFileUploadButton :open="open" />

                <ModelSelect />
              </div>

              <UChatPromptSubmit color="neutral" size="sm" :disabled="uploading" />
            </template>
          </UChatPrompt>

          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="quickChat in quickChats"
              :key="quickChat.label"
              :icon="quickChat.icon"
              :label="quickChat.label"
              size="sm"
              color="neutral"
              variant="outline"
              class="rounded-full"
              @click="createChat(quickChat.label)"
            />
          </div>
        </UContainer>
      </div>
    </template>
  </UDashboardPanel>
</template>
