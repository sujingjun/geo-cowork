<script setup lang="ts">
/**
 * Dashboard component — displays key metrics and charts.
 *
 * Shows conversion funnel, status breakdown, follower distribution,
 * and source distribution.
 */

const workbenchStore = useWorkbenchStore()

const funnel = computed(() => workbenchStore.funnel)
const statusBreakdown = computed(() => workbenchStore.statusBreakdown)
const followerBuckets = computed(() => workbenchStore.followerBuckets)
const sourceBreakdown = computed(() => workbenchStore.sourceBreakdown)

// Funnel data
const funnelSteps = computed(() => [
  { label: '达人总数', value: funnel.value.total, color: 'bg-blue-500' },
  { label: '已触达', value: funnel.value.sent, color: 'bg-green-500' },
  { label: '已回复', value: funnel.value.replied, color: 'bg-yellow-500' },
  { label: '已转化', value: funnel.value.converted, color: 'bg-purple-500' }
])

const funnelWidths = computed(() => {
  const max = funnel.value.total || 1
  return funnelSteps.value.map(step => ({
    ...step,
    width: Math.max(4, (step.value / max) * 100)
  }))
})

// Status badges
const statusItems = computed(() => [
  { label: '待发送', value: statusBreakdown.value.pending, color: 'neutral' as const },
  { label: '已发送', value: statusBreakdown.value.sent, color: 'primary' as const },
  { label: '已回复', value: statusBreakdown.value.replied, color: 'success' as const },
  { label: '已转化', value: statusBreakdown.value.converted, color: 'success' as const },
  { label: '已封禁', value: statusBreakdown.value.blocked, color: 'error' as const }
])

// Follower distribution
const followerItems = computed(() => [
  { label: '0-1k', value: followerBuckets.value['0-1k'] },
  { label: '1k-10k', value: followerBuckets.value['1k-10k'] },
  { label: '10k-100k', value: followerBuckets.value['10k-100k'] },
  { label: '100k-1m', value: followerBuckets.value['100k-1m'] },
  { label: '1m+', value: followerBuckets.value['1m+'] },
  { label: '未知', value: followerBuckets.value.unknown }
])

const maxFollowerCount = computed(() => Math.max(...followerItems.value.map(f => f.value), 1))

// Source distribution
const sourceItems = computed(() => {
  const labels: Record<string, string> = {
    search: '搜索',
    comment: '评论',
    profile: '主页',
    manual: '手动'
  }
  return Object.entries(sourceBreakdown.value).map(([key, value]) => ({
    label: labels[key] || key,
    value
  }))
})

// Rate cards
const rateCards = computed(() => [
  { label: '触达率', value: funnel.value.reachRate + '%', icon: 'i-lucide-send' },
  { label: '回复率', value: funnel.value.replyRate + '%', icon: 'i-lucide-message-circle' },
  { label: '转化率', value: funnel.value.conversionRate + '%', icon: 'i-lucide-check-circle' }
])
</script>

<template>
  <div class="min-w-0 space-y-4">
    <!-- Rate cards -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <UCard v-for="rate in rateCards" :key="rate.label" :ui="{ body: 'p-3' }">
        <div class="flex items-center gap-2">
          <UIcon :name="rate.icon" class="text-primary text-lg" />
          <div>
            <p class="text-xl font-bold">{{ rate.value }}</p>
            <p class="text-xs text-muted">{{ rate.label }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Conversion funnel -->
    <UCard :ui="{ body: 'p-4' }">
      <h4 class="text-sm font-semibold mb-3">转化漏斗</h4>
      <div class="space-y-2">
        <div v-for="step in funnelWidths" :key="step.label" class="flex items-center gap-2">
          <div class="w-20 text-xs text-muted text-right">{{ step.label }}</div>
          <div class="flex-1">
            <div class="h-6 rounded flex items-center justify-end pr-2 text-xs text-white font-medium"
              :class="step.color"
              :style="{ width: step.width + '%' }"
            >
              {{ step.value }}
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Status + Follower distribution -->
    <div class="grid grid-cols-1 gap-3 2xl:grid-cols-2">
      <!-- Status breakdown -->
      <UCard :ui="{ body: 'p-4' }">
        <h4 class="text-sm font-semibold mb-3">状态分布</h4>
        <div class="space-y-2">
          <div v-for="item in statusItems" :key="item.label" class="flex items-center justify-between">
            <span class="text-xs">{{ item.label }}</span>
            <UBadge :variant="'soft'" :color="item.color" size="sm">{{ item.value }}</UBadge>
          </div>
        </div>
      </UCard>

      <!-- Follower distribution -->
      <UCard :ui="{ body: 'p-4' }">
        <h4 class="text-sm font-semibold mb-3">粉丝量级分布</h4>
        <div class="space-y-1.5">
          <div v-for="item in followerItems" :key="item.label" class="flex items-center gap-2">
            <div class="w-16 text-xs text-muted">{{ item.label }}</div>
            <div class="flex-1 h-4 bg-elevated rounded overflow-hidden">
              <div
                class="h-full bg-primary/60 rounded"
                :style="{ width: (item.value / maxFollowerCount * 100) + '%' }"
              />
            </div>
            <span class="text-xs w-6 text-right">{{ item.value }}</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Source distribution -->
    <UCard :ui="{ body: 'p-4' }">
      <h4 class="text-sm font-semibold mb-3">来源分布</h4>
      <div class="flex gap-3 flex-wrap">
        <div v-for="item in sourceItems" :key="item.label" class="text-center">
          <p class="text-lg font-bold">{{ item.value }}</p>
          <p class="text-xs text-muted">{{ item.label }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
