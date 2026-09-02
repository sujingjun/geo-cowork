<script setup lang="ts">
/**
 * Outreach page — DM sending workbench.
 *
 * Features:
 *   - Select creators from the pool to send DMs
 *   - Choose or create message templates
 *   - Preview rendered message with variables replaced
 *   - Batch send with progress tracking
 *   - Rate-limit detection and status updates
 *   - AI Agent panel for template generation
 */

import type { Creator, DmRecipient } from '~/utils/extension-messaging'
import { resolveCreatorRecipient } from '../../shared/utils/creator-platform'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: '私信触达 — Creator Workbench',
  description: 'AI Agent 驱动的私信触达工作台'
})

const route = useRoute()
const toast = useToast()

const creatorsStore = useCreatorsStore()
const outreachStore = useOutreachStore()

// Selected creators for batch sending
const selectedCreators = ref<Creator[]>([])
const selectedTemplateId = ref<string>('')
const customMessage = ref('')
const useCustomMessage = ref(false)

// Pre-select creator from query param
onMounted(async () => {
  await creatorsStore.fetchCreators(1)

  const creatorId = route.query.creator_id as string
  if (creatorId) {
    const creator = creatorsStore.creators.find(c => c.id === creatorId)
    if (creator) {
      selectedCreators.value = [creator]
    }
  }
})

// Selected template
const selectedTemplate = computed(() => {
  return outreachStore.templates.find(t => t.id === selectedTemplateId.value)
})

// Rendered message preview
const messagePreview = computed(() => {
  const content = useCustomMessage.value
    ? customMessage.value
    : selectedTemplate.value?.content || ''

  if (selectedCreators.value.length > 0) {
    const creator = selectedCreators.value[0]!
    return outreachStore.renderTemplate(content, {
      昵称: creator.nickname || '达人',
      领域: '美妆',
      粉丝数: creator.follower_count?.toString() || '未知',
      平台: creator.platform === 'tiktok' ? 'TikTok' : '抖音',
      平台账号: creator.platform_uid || creator.sec_uid || '',
      sec_uid: creator.sec_uid,
      unique_id: creator.unique_id || ''
    })
  }
  return content
})

// Toggle creator selection
function toggleCreator(creator: Creator) {
  const idx = selectedCreators.value.findIndex(c => c.id === creator.id)
  if (idx >= 0) {
    selectedCreators.value.splice(idx, 1)
  } else {
    selectedCreators.value.push(creator)
  }
}

// Select all pending creators
function selectAllPending() {
  const pending = creatorsStore.creators.filter(c => c.status === 'pending')
  selectedCreators.value = [...pending]
}

// Clear selection
function clearSelection() {
  selectedCreators.value = []
}

// Send batch DMs
async function sendBatch() {
  if (selectedCreators.value.length === 0) {
    toast.add({ description: '请先选择达人', color: 'warning' })
    return
  }

  const message = useCustomMessage.value ? customMessage.value : selectedTemplate.value?.content
  if (!message) {
    toast.add({ description: '请选择模板或输入自定义文案', color: 'warning' })
    return
  }

  let creators: DmRecipient[]
  try {
    creators = selectedCreators.value.map(resolveCreatorRecipient)
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : '达人缺少平台收件人标识',
      color: 'warning'
    })
    return
  }

  await outreachStore.sendBatch(creators, message, selectedTemplateId.value || undefined)

  if (outreachStore.lastBatchResult) {
    const result = outreachStore.lastBatchResult
    if (result.rateLimited) {
      toast.add({
        title: '触发限频',
        description: `已发送 ${result.sent} 条，失败 ${result.failed} 条。检测到限频，已停止发送。`,
        color: 'warning',
        duration: 0
      })
    } else {
      toast.add({
        title: '发送完成',
        description: `成功 ${result.sent} 条，失败 ${result.failed} 条`,
        color: 'success'
      })
    }
  }
}

// Quick stats
const batchStats = computed(() => [
  { label: '已选达人', value: selectedCreators.value.length, icon: 'i-lucide-check-circle' },
  { label: '已发送', value: outreachStore.lastBatchResult?.sent || 0, icon: 'i-lucide-send' },
  { label: '失败', value: outreachStore.lastBatchResult?.failed || 0, icon: 'i-lucide-x-circle' },
  { label: '限频', value: outreachStore.lastBatchResult?.rateLimited ? '是' : '否', icon: 'i-lucide-alert-triangle' }
])
</script>

<template>
  <UDashboardPanel id="outreach" class="min-h-0" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <Navbar>
        <template #title>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-send" class="text-primary" />
            <span class="font-semibold">私信触达</span>
          </div>
        </template>
      </Navbar>
    </template>

    <template #body>
      <div class="flex h-full">
        <!-- Left: Creator selection + sending -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Stats -->
          <div class="grid grid-cols-4 gap-3 p-4">
            <UCard v-for="stat in batchStats" :key="stat.label" :ui="{ body: 'p-3' }">
              <div class="flex items-center gap-2">
                <UIcon :name="stat.icon" class="text-primary" />
                <div>
                  <p class="text-xl font-bold">{{ stat.value }}</p>
                  <p class="text-xs text-muted">{{ stat.label }}</p>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Selection bar -->
          <div class="flex items-center gap-2 px-4 py-2 border-b border-default">
            <UButton size="xs" variant="outline" color="neutral" @click="selectAllPending">
              全选待发送
            </UButton>
            <UButton size="xs" variant="outline" color="neutral" @click="clearSelection">
              清空选择
            </UButton>
            <span class="text-xs text-muted ml-auto">
              共 {{ creatorsStore.creators.length }} 个达人，已选 {{ selectedCreators.length }} 个
            </span>
          </div>

          <!-- Creator list -->
          <div class="flex-1 overflow-y-auto px-4 py-2 space-y-1">
            <div v-if="creatorsStore.creators.length === 0" class="flex flex-col items-center py-12 text-center">
              <UIcon name="i-lucide-users" class="text-4xl text-muted mb-2" />
              <p class="text-muted">暂无达人数据</p>
              <UButton label="去挖掘达人" to="/discover" size="sm" color="primary" variant="soft" class="mt-2" />
            </div>

            <div
              v-for="creator in creatorsStore.creators"
              :key="creator.id"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-elevated cursor-pointer"
              :class="{ 'bg-primary/5 ring-1 ring-primary/30': selectedCreators.some(c => c.id === creator.id) }"
              @click="toggleCreator(creator)"
            >
              <UCheckbox
                :model-value="selectedCreators.some(c => c.id === creator.id)"
                @update:model-value="toggleCreator(creator)"
              />
              <UAvatar :src="creator.avatar_url || undefined" :alt="creator.nickname || ''" size="sm" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium truncate">{{ creator.nickname || '未知达人' }}</span>
                  <UBadge color="neutral" variant="soft" size="sm">
                    {{ creator.platform === 'tiktok' ? 'TikTok' : '抖音' }}
                  </UBadge>
                </div>
                <span class="text-xs text-muted ml-2">
                  粉丝 {{ creator.follower_count ?? '-' }}
                </span>
              </div>
              <UBadge
                :variant="'soft'"
                :color="creator.status === 'sent' ? 'primary' : creator.status === 'replied' ? 'success' : 'neutral'"
                size="sm"
              >
                {{ creator.status === 'pending' ? '待发送' : creator.status === 'sent' ? '已发送' : creator.status === 'replied' ? '已回复' : creator.status }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Right: Template + preview + agent -->
        <div class="hidden lg:flex w-[420px] border-l border-default flex-col">
          <!-- Template selection -->
          <div class="p-4 border-b border-default space-y-3">
            <h3 class="text-sm font-semibold">发送设置</h3>

            <div class="flex gap-2">
              <UButton
                label="使用模板"
                size="xs"
                :variant="!useCustomMessage ? 'solid' : 'outline'"
                :color="!useCustomMessage ? 'primary' : 'neutral'"
                @click="useCustomMessage = false"
              />
              <UButton
                label="自定义文案"
                size="xs"
                :variant="useCustomMessage ? 'solid' : 'outline'"
                :color="useCustomMessage ? 'primary' : 'neutral'"
                @click="useCustomMessage = true"
              />
            </div>

            <!-- Template selector -->
            <div v-if="!useCustomMessage">
              <label class="text-xs text-muted mb-1 block">选择模板</label>
              <USelect
                v-model="selectedTemplateId"
                :items="outreachStore.templates.map(t => ({ label: t.name, value: t.id }))"
                value-key="value"
                placeholder="选择文案模板"
                size="sm"
                class="w-full"
              />
            </div>

            <!-- Custom message -->
            <div v-else>
              <label class="text-xs text-muted mb-1 block">自定义文案</label>
              <UTextarea
                v-model="customMessage"
                :rows="4"
                placeholder="输入自定义私信内容，支持 {{变量名}} 占位符"
                class="w-full"
              />
            </div>

            <!-- Preview -->
            <div v-if="messagePreview">
              <label class="text-xs text-muted mb-1 block">预览（首个达人）</label>
              <div class="rounded-lg bg-elevated p-3 text-sm">
                {{ messagePreview }}
              </div>
            </div>

            <!-- Send button -->
            <UButton
              label="发送私信"
              icon="i-lucide-send"
              color="primary"
              class="w-full"
              :loading="outreachStore.sending"
              :disabled="selectedCreators.length === 0 || (!useCustomMessage && !selectedTemplate)"
              @click="sendBatch"
            />

            <!-- Progress -->
            <div v-if="outreachStore.sending" class="text-center text-xs text-muted">
              正在发送 {{ outreachStore.sendProgress.current }} / {{ outreachStore.sendProgress.total }}...
            </div>

            <!-- Last result -->
            <div v-if="outreachStore.lastBatchResult && !outreachStore.sending" class="rounded-lg p-3 text-sm" :class="outreachStore.lastBatchResult.rateLimited ? 'bg-warning/10' : 'bg-success/10'">
              <p v-if="outreachStore.lastBatchResult.rateLimited" class="text-warning font-medium">⚠️ 触发限频</p>
              <p v-else class="text-success font-medium">✅ 发送完成</p>
              <p class="text-xs text-muted mt-1">
                成功 {{ outreachStore.lastBatchResult.sent }} 条，失败 {{ outreachStore.lastBatchResult.failed }} 条
              </p>
            </div>
          </div>

          <!-- Template manager -->
          <div class="p-4 border-b border-default">
            <TemplateManager />
          </div>

          <!-- Agent panel -->
          <div class="flex-1 overflow-hidden">
            <AgentPanel class="h-full" />
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
