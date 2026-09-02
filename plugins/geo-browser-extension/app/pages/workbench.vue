<script setup lang="ts">
/**
 * Workbench page — unified dashboard and conversation management.
 *
 * Layout:
 *   - Top: Dashboard with metrics and charts
 *   - Middle: Recent activity feed + needs follow-up list
 *   - Bottom: AI Agent panel for auto follow-up suggestions
 */

import type { Creator } from '~/utils/extension-messaging'
import WorkbenchDashboard from '~/components/workbench/Dashboard.vue'
import { getCreatorDisplayName } from '../../shared/utils/creator-display'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: '工作台 — Creator Workbench',
  description: '达人建联统一工作台 — 数据看板、状态跟踪、自动跟进'
})

const workbenchStore = useWorkbenchStore()
const toast = useToast()

const activeTab = ref<'dashboard' | 'activity' | 'followup'>('dashboard')

// Agent follow-up suggestions
const {
  input: agentInput,
  isStreaming,
  messages: agentMessages,
  send: agentSend
} = useAgent()

onMounted(async () => {
  await workbenchStore.fetchAll()
})

// Quick follow-up actions
function followUpAll() {
  agentSend('帮我给所有已发送但未回复的达人生成跟进话术，语气要温和不催促')
}

function followUpOne(creator: Creator) {
  agentSend(`帮我给达人"${getCreatorDisplayName(creator)}"生成一条跟进私信，他/她已经 ${workbenchStore.funnel.replyRate}% 的回复率`)
}

// Status update
const statusOptions = [
  { label: '待发送', value: 'pending' },
  { label: '已发送', value: 'sent' },
  { label: '已回复', value: 'replied' },
  { label: '已转化', value: 'converted' },
  { label: '已封禁', value: 'blocked' }
]

function onStatusChange(creator: Creator, newStatus: string) {
  workbenchStore.updateStatus(creator.id, newStatus as Creator['status'])
  toast.add({ description: `已更新状态为: ${newStatus}`, color: 'success' })
}

// Time range selector
const timeRangeOptions = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  { label: '全部', value: 'all' }
]

function onTimeRangeChange(val: string) {
  workbenchStore.timeRange = val as any
  workbenchStore.fetchAll()
}
</script>

<template>
  <UDashboardPanel id="workbench" class="min-h-0 min-w-0" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <Navbar>
        <template #title>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-layout-dashboard" class="text-primary" />
            <span class="font-semibold">工作台</span>
          </div>
        </template>

        <USelect
          :model-value="workbenchStore.timeRange"
          :items="timeRangeOptions"
          value-key="value"
          size="xs"
          class="w-28"
          @update:model-value="onTimeRangeChange"
        />
      </Navbar>
    </template>

    <template #body>
      <div class="flex h-full min-w-0">
        <!-- Main content -->
        <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
          <!-- Tabs -->
          <div class="flex shrink-0 flex-wrap items-center gap-1 border-b border-default px-4 py-2">
            <UButton
              label="数据看板"
              icon="i-lucide-bar-chart"
              size="xs"
              :variant="activeTab === 'dashboard' ? 'solid' : 'ghost'"
              :color="activeTab === 'dashboard' ? 'primary' : 'neutral'"
              @click="activeTab = 'dashboard'"
            />
            <UButton
              label="最近活动"
              icon="i-lucide-activity"
              size="xs"
              :variant="activeTab === 'activity' ? 'solid' : 'ghost'"
              :color="activeTab === 'activity' ? 'primary' : 'neutral'"
              @click="activeTab = 'activity'"
            />
            <UButton
              label="待跟进"
              icon="i-lucide-clock"
              size="xs"
              :variant="activeTab === 'followup' ? 'solid' : 'ghost'"
              :color="activeTab === 'followup' ? 'primary' : 'neutral'"
              @click="activeTab = 'followup'"
            >
              <template v-if="workbenchStore.needsFollowUp.length > 0" #trailing>
                <UBadge color="warning" variant="solid" size="sm">
                  {{ workbenchStore.needsFollowUp.length }}
                </UBadge>
              </template>
            </UButton>
          </div>

          <!-- Tab content -->
          <div class="flex-1 min-w-0 overflow-y-auto p-4">
            <!-- Dashboard -->
            <div v-if="activeTab === 'dashboard'">
              <div v-if="workbenchStore.loading" class="flex justify-center py-12">
                <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-muted" />
              </div>
              <WorkbenchDashboard v-else />
            </div>

            <!-- Recent activity -->
            <div v-else-if="activeTab === 'activity'" class="space-y-2">
              <div v-if="workbenchStore.recentActivity.length === 0" class="flex flex-col items-center py-12 text-center">
                <UIcon name="i-lucide-inbox" class="text-4xl text-muted mb-2" />
                <p class="text-muted">暂无活动记录</p>
              </div>

              <div
                v-for="creator in workbenchStore.recentActivity"
                :key="creator.id"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-elevated"
              >
                <UAvatar :src="creator.avatar_url || undefined" :alt="creator.nickname || ''" size="sm" />
                <div class="flex-1 min-w-0">
                  <span class="text-sm font-medium">{{ getCreatorDisplayName(creator) }}</span>
                  <span class="text-xs text-muted ml-2">
                    {{ new Date(creator.updated_at).toLocaleString('zh-CN') }}
                  </span>
                </div>
                <USelect
                  :model-value="creator.status"
                  :items="statusOptions"
                  value-key="value"
                  size="xs"
                  class="w-28"
                  @update:model-value="(val) => onStatusChange(creator, val)"
                />
              </div>
            </div>

            <!-- Needs follow-up -->
            <div v-else-if="activeTab === 'followup'" class="space-y-3">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 class="text-sm font-semibold">待跟进达人</h4>
                  <p class="text-xs text-muted">已发送私信但未收到回复的达人</p>
                </div>
                <UButton
                  v-if="workbenchStore.needsFollowUp.length > 0"
                  label="AI 批量生成跟进话术"
                  icon="i-lucide-bot"
                  size="sm"
                  color="primary"
                  variant="soft"
                  :loading="isStreaming"
                  class="self-start sm:self-auto"
                  @click="followUpAll"
                />
              </div>

              <div v-if="workbenchStore.needsFollowUp.length === 0" class="flex flex-col items-center py-12 text-center">
                <UIcon name="i-lucide-check-circle" class="text-4xl text-success mb-2" />
                <p class="text-muted">没有待跟进的达人 🎉</p>
              </div>

              <UCard
                v-for="creator in workbenchStore.needsFollowUp"
                :key="creator.id"
                :ui="{ body: 'p-3' }"
              >
                <div class="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                  <UAvatar :src="creator.avatar_url || undefined" :alt="creator.nickname || ''" size="sm" />
                  <div class="flex-1 min-w-0">
                    <span class="text-sm font-medium">{{ getCreatorDisplayName(creator) }}</span>
                    <p class="text-xs text-muted">
                      粉丝 {{ creator.follower_count ?? '-' }} · 发送时间 {{ new Date(creator.updated_at).toLocaleDateString('zh-CN') }}
                    </p>
                  </div>
                  <UButton
                    label="生成跟进"
                    icon="i-lucide-message-square-plus"
                    size="xs"
                    variant="outline"
                    color="primary"
                    :disabled="isStreaming"
                    @click="followUpOne(creator)"
                  />
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Right: Agent panel -->
        <div class="hidden w-[clamp(320px,30vw,400px)] min-w-0 shrink-0 border-l border-default xl:flex">
          <AgentPanel class="w-full min-w-0" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
