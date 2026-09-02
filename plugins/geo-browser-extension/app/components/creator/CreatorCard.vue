<script setup lang="ts">
import type { Creator } from '~/utils/extension-messaging'
import { getCreatorDisplayName, getCreatorProfileUrl } from '../../../shared/utils/creator-display'

const props = defineProps<{
  creator: Creator
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [creator: Creator]
  sendDm: [creator: Creator]
  viewProfile: [creator: Creator]
  openProfile: [creator: Creator]
  deleteCreator: [creator: Creator]
}>()

// Follower count formatting
function formatCount(n: number | null): string {
  if (n == null) return '-'
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// Status badge mapping
const statusConfig: Record<string, { label: string; color: 'neutral' | 'primary' | 'success' | 'warning' | 'error' }> = {
  pending: { label: '待发送', color: 'neutral' },
  sent: { label: '已发送', color: 'primary' },
  replied: { label: '已回复', color: 'success' },
  converted: { label: '已转化', color: 'success' },
  blocked: { label: '已封禁', color: 'error' }
}

// Source badge mapping
const sourceConfig: Record<string, { label: string; icon: string }> = {
  search: { label: '搜索', icon: 'i-lucide-search' },
  comment: { label: '评论', icon: 'i-lucide-message-square' },
  profile: { label: '主页', icon: 'i-lucide-user' },
  page: { label: '页面发现', icon: 'i-lucide-scan-search' },
  manual: { label: '手动', icon: 'i-lucide-hand' }
}

const status = computed(() => statusConfig[props.creator.status] || statusConfig.pending!)
const source = computed(() => sourceConfig[props.creator.source] || sourceConfig.manual!)
const platform = computed(() => props.creator.platform === 'tiktok'
  ? { label: 'TikTok', icon: 'i-simple-icons-tiktok' }
  : { label: '抖音', icon: 'i-lucide-music-2' })
const canSendDm = computed(() => props.creator.platform === 'tiktok'
  ? !!props.creator.platform_uid
  : !!props.creator.sec_uid)
const canOpenProfile = computed(() => !!getCreatorProfileUrl(props.creator))
const displayName = computed(() => getCreatorDisplayName(props.creator))

const avatarFallback = computed(() => {
  return displayName.value.charAt(0) || '?'
})
</script>

<template>
  <UCard
    class="cursor-pointer transition-all hover:ring-2 hover:ring-primary/40"
    :ui="{ body: 'p-3' }"
    :class="{ 'ring-2 ring-primary': selected }"
    @click="emit('select', creator)"
  >
    <div class="flex gap-3">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <UAvatar
          :src="creator.avatar_url || undefined"
          :alt="creator.nickname || ''"
          size="lg"
        >
          <template #fallback>
            <span class="text-lg font-bold">{{ avatarFallback }}</span>
          </template>
        </UAvatar>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-medium truncate">{{ displayName }}</span>
          <UBadge variant="soft" color="neutral" size="sm">
            <UIcon :name="source.icon" class="mr-0.5" size="xs" />
            {{ source.label }}
          </UBadge>
          <UBadge variant="soft" color="neutral" size="sm">
            <UIcon :name="platform.icon" class="mr-0.5" size="xs" />
            {{ platform.label }}
          </UBadge>
        </div>

        <p class="text-xs text-muted truncate mt-0.5">
          {{ creator.signature || '暂无简介' }}
        </p>

        <div class="flex items-center gap-3 mt-1.5 text-xs">
          <span class="flex items-center gap-0.5">
            <UIcon name="i-lucide-users" size="xs" class="text-muted" />
            {{ formatCount(creator.follower_count) }}
          </span>
          <span class="flex items-center gap-0.5">
            <UIcon name="i-lucide-video" size="xs" class="text-muted" />
            {{ formatCount(creator.aweme_count) }}
          </span>
          <UBadge :variant="'soft'" :color="status.color" size="sm">
            {{ status.label }}
          </UBadge>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-1 flex-shrink-0">
        <UButton
          icon="i-lucide-send"
          size="xs"
          variant="soft"
          color="primary"
          :disabled="!canSendDm || creator.status === 'sent' || creator.status === 'replied'"
          @click.stop="emit('sendDm', creator)"
        >
          私信
        </UButton>
        <UButton
          icon="i-lucide-eye"
          size="xs"
          variant="ghost"
          color="neutral"
          @click.stop="emit('viewProfile', creator)"
        >
          详情
        </UButton>
        <UButton
          label="主页"
          title="打开主页"
          icon="i-lucide-external-link"
          size="xs"
          variant="ghost"
          color="neutral"
          :disabled="!canOpenProfile"
          @click.stop="emit('openProfile', creator)"
        />
        <UButton
          label="删除"
          icon="i-lucide-trash-2"
          size="xs"
          variant="ghost"
          color="error"
          @click.stop="emit('deleteCreator', creator)"
        />
      </div>
    </div>
  </UCard>
</template>
