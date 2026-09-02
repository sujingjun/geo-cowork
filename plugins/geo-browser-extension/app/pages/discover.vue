<script setup lang="ts">
/**
 * Discover page — creator discovery workbench.
 *
 * Layout: left panel (creator list + filter), right panel (AI Agent).
 * The Agent can search for creators, and results appear in the list.
 */

import type {
  Creator,
  CreatorFilter,
  CreatorPlatform,
  TikTokCreatorInsightsResponse
} from '~/utils/extension-messaging'
import { getCreatorCollectionGuidance } from '../../shared/utils/creator-collection-guidance'
import { getCreatorDisplayName, getCreatorProfileUrl } from '../../shared/utils/creator-display'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: '找达人 — Creator Workbench',
  description: 'AI Agent 驱动的达人挖掘工作台'
})

const creatorsStore = useCreatorsStore()
const { getTikTokCreatorInsights, analyzeTikTokComments } = useExtensionBridge()
const toast = useToast()

// Local filter state
const filter = ref<CreatorFilter>({
  platform: null,
  keyword: null,
  min_followers: null,
  max_followers: null,
  source: null,
  status: null
})

const platformTabs: Array<{ label: string, value: CreatorPlatform | null, icon: string }> = [
  { label: '全部', value: null, icon: 'i-lucide-layers-3' },
  { label: '抖音', value: 'douyin', icon: 'i-lucide-music-2' },
  { label: 'TikTok', value: 'tiktok', icon: 'i-simple-icons-tiktok' }
]

// Selected creator for detail view
const selectedCreator = ref<Creator | null>(null)
const showDetailModal = ref(false)
const creatorInsights = ref<TikTokCreatorInsightsResponse | null>(null)
const insightsLoading = ref(false)
const commentAnalysisLoading = ref(false)
const detailError = ref('')

// Agent panel visibility (on mobile)
const showAgentPanel = ref(false)

// ─── Actions ────────────────────────────────────────────────────────

onMounted(async () => {
  await creatorsStore.fetchCreators(1)
  await creatorsStore.fetchStats()
})

async function onApplyFilter() {
  await creatorsStore.applyFilter(filter.value)
}

async function onResetFilter() {
  const platform = filter.value.platform || null
  filter.value = {
    platform,
    keyword: null,
    min_followers: null,
    max_followers: null,
    source: null,
    status: null
  }
  await creatorsStore.applyFilter(filter.value)
}

async function onPlatformChange(platform: CreatorPlatform | null) {
  filter.value.platform = platform
  selectedCreator.value = null
  await creatorsStore.applyFilter({ platform })
}

async function loadCreatorInsights(creator: Creator) {
  creatorInsights.value = null
  detailError.value = ''
  if (creator.platform !== 'tiktok') return
  insightsLoading.value = true
  try {
    creatorInsights.value = await getTikTokCreatorInsights(creator.id)
    if (!creatorInsights.value.found) {
      detailError.value = creatorInsights.value.error || '未找到 TikTok 洞察数据'
    }
  } catch (error) {
    detailError.value = error instanceof Error ? error.message : '读取 TikTok 洞察失败'
  } finally {
    insightsLoading.value = false
  }
}

async function onSelectCreator(creator: Creator) {
  selectedCreator.value = creator
  showDetailModal.value = true
  await loadCreatorInsights(creator)
}

function onSendDm(creator: Creator) {
  // Navigate to outreach page with pre-selected creator
  navigateTo({ path: '/outreach', query: { creator_id: creator.id } })
}

async function onViewProfile(creator: Creator) {
  selectedCreator.value = creator
  showDetailModal.value = true
  await loadCreatorInsights(creator)
}

async function onAnalyzeComments() {
  const creator = selectedCreator.value
  if (!creator || creator.platform !== 'tiktok') return
  commentAnalysisLoading.value = true
  detailError.value = ''
  try {
    const result = await analyzeTikTokComments(creator.id)
    if (!result.success) {
      detailError.value = result.error || '评论分析失败'
      return
    }
    await loadCreatorInsights(creator)
  } catch (error) {
    detailError.value = error instanceof Error ? error.message : '评论分析失败'
  } finally {
    commentAnalysisLoading.value = false
  }
}

function openExternalPage(url: string) {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    void chrome.tabs.create({ url })
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

function onOpenCreatorProfile(creator: Creator) {
  const url = getCreatorProfileUrl(creator)
  if (url) openExternalPage(url)
}

async function onDeleteCreator(creator: Creator) {
  const name = getCreatorDisplayName(creator)
  if (!confirm(`确认删除“${name}”吗？此操作会同时清理相关采集数据。`)) return
  try {
    await creatorsStore.deleteCreator(creator.id)
    if (selectedCreator.value?.id === creator.id) {
      selectedCreator.value = null
      creatorInsights.value = null
      showDetailModal.value = false
    }
    toast.add({ description: `已删除 ${name}`, color: 'success' })
  } catch (error) {
    toast.add({
      description: error instanceof Error ? error.message : '删除达人失败',
      color: 'error'
    })
  }
}

function formatPercent(value: number | null | undefined): string {
  return value == null ? '-' : `${(value * 100).toFixed(2)}%`
}

const analyzedComments = computed(() =>
  (creatorInsights.value?.comments || [])
    .filter(comment => comment.analysis_status === 'analyzed')
    .slice(0, 10)
)

const collectionGuidance = computed(() => {
  const creator = selectedCreator.value
  if (!creator) return []
  return getCreatorCollectionGuidance({
    creator,
    videos: creatorInsights.value?.videos || [],
    collectedCommentCount: creatorInsights.value?.comments?.length || 0
  })
})

// Stats display
const statsCards = computed(() => [
  { label: '达人总数', value: creatorsStore.total, icon: 'i-lucide-users' },
  { label: '待发送', value: creatorsStore.stats.byStatus?.pending || 0, icon: 'i-lucide-clock' },
  { label: '已发送', value: creatorsStore.stats.byStatus?.sent || 0, icon: 'i-lucide-send' },
  { label: '已回复', value: creatorsStore.stats.byStatus?.replied || 0, icon: 'i-lucide-message-circle' }
])
</script>

<template>
  <UDashboardPanel id="discover" class="min-h-0" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <Navbar>
        <template #title>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-compass" class="text-primary" />
            <span class="font-semibold">找达人</span>
          </div>
        </template>
        <UButton
          icon="i-lucide-bot"
          label="AI Agent"
          color="primary"
          variant="soft"
          class="lg:hidden"
          @click="showAgentPanel = !showAgentPanel"
        />
      </Navbar>
    </template>

    <template #body>
      <div class="flex h-full">
        <!-- Left: Creator list -->
        <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
          <!-- Stats cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
            <UCard
              v-for="stat in statsCards"
              :key="stat.label"
              :ui="{ body: 'p-3' }"
            >
              <div class="flex items-center gap-2">
                <UIcon :name="stat.icon" class="text-primary text-lg" />
                <div>
                  <p class="text-xl font-bold">{{ stat.value }}</p>
                  <p class="text-xs text-muted">{{ stat.label }}</p>
                </div>
              </div>
            </UCard>
          </div>

          <div class="flex items-center gap-2 px-4 pb-3" aria-label="平台筛选">
            <UButton
              v-for="tab in platformTabs"
              :key="tab.label"
              :label="tab.label"
              :icon="tab.icon"
              size="sm"
              :variant="filter.platform === tab.value ? 'solid' : 'outline'"
              :color="filter.platform === tab.value ? 'primary' : 'neutral'"
              :aria-pressed="filter.platform === tab.value"
              @click="onPlatformChange(tab.value)"
            />
          </div>

          <!-- Filter -->
          <div class="px-4 pb-2">
            <CreatorFilter
              v-model="filter"
              @apply="onApplyFilter"
              @reset="onResetFilter"
            />
          </div>

          <!-- Creator list -->
          <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            <div v-if="creatorsStore.loading && creatorsStore.creators.length === 0" class="flex justify-center py-12">
              <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-muted" />
            </div>

            <div v-else-if="creatorsStore.creators.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <UIcon name="i-lucide-search-x" class="text-4xl text-muted mb-2" />
              <p class="text-muted">暂无达人数据</p>
              <p class="text-xs text-muted mt-1">使用右侧 AI Agent 搜索达人，或在抖音页面自动采集</p>
            </div>

            <template v-else>
              <CreatorCard
                v-for="creator in creatorsStore.creators"
                :key="creator.id"
                :creator="creator"
                :selected="selectedCreator?.id === creator.id"
                @select="onSelectCreator"
                @send-dm="onSendDm"
                @view-profile="onViewProfile"
                @open-profile="onOpenCreatorProfile"
                @delete-creator="onDeleteCreator"
              />

              <!-- Load more -->
              <div v-if="creatorsStore.hasMore" class="flex justify-center pt-4">
                <UButton
                  label="加载更多"
                  icon="i-lucide-chevron-down"
                  variant="outline"
                  color="neutral"
                  :loading="creatorsStore.loading"
                  @click="creatorsStore.loadMore()"
                />
              </div>
            </template>
          </div>
        </div>

        <!-- Right: Agent panel (desktop) -->
        <div class="hidden w-[clamp(320px,30vw,400px)] min-w-0 shrink-0 border-l border-default xl:flex">
          <AgentPanel class="w-full min-w-0" />
        </div>

        <!-- Agent panel (mobile drawer) -->
        <USlideover v-model:open="showAgentPanel" side="right" title="AI Agent">
          <template #body>
            <AgentPanel class="h-full" />
          </template>
        </USlideover>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Creator detail modal -->
  <UModal v-model:open="showDetailModal">
    <template #content>
      <div v-if="selectedCreator" class="max-h-[80vh] overflow-y-auto p-6">
        <div class="flex items-center gap-4 mb-4">
          <UAvatar
            :src="selectedCreator.avatar_url || undefined"
            :alt="selectedCreator.nickname || ''"
            size="xl"
          />
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold">{{ getCreatorDisplayName(selectedCreator) }}</h3>
              <UBadge color="neutral" variant="soft">
                {{ selectedCreator.platform === 'tiktok' ? 'TikTok' : '抖音' }}
              </UBadge>
            </div>
            <p class="text-sm text-muted">{{ selectedCreator.unique_id || selectedCreator.short_id || '无ID' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="rounded-lg bg-elevated p-3">
            <p class="text-xs text-muted">粉丝数</p>
            <p class="text-lg font-bold">{{ selectedCreator.follower_count ?? '-' }}</p>
          </div>
          <div class="rounded-lg bg-elevated p-3">
            <p class="text-xs text-muted">作品数</p>
            <p class="text-lg font-bold">{{ selectedCreator.aweme_count ?? '-' }}</p>
          </div>
          <div class="rounded-lg bg-elevated p-3">
            <p class="text-xs text-muted">获赞数</p>
            <p class="text-lg font-bold">{{ selectedCreator.total_favorited ?? '-' }}</p>
          </div>
          <div class="rounded-lg bg-elevated p-3">
            <p class="text-xs text-muted">关注数</p>
            <p class="text-lg font-bold">{{ selectedCreator.following_count ?? '-' }}</p>
          </div>
        </div>

        <div v-if="selectedCreator.signature" class="mb-4">
          <p class="text-xs text-muted mb-1">简介</p>
          <p class="text-sm">{{ selectedCreator.signature }}</p>
        </div>

        <div v-if="selectedCreator.country || selectedCreator.language" class="mb-4 flex flex-wrap gap-2">
          <UBadge v-if="selectedCreator.country" color="neutral" variant="soft">
            国家/地区：{{ selectedCreator.country }}
          </UBadge>
          <UBadge v-if="selectedCreator.language" color="neutral" variant="soft">
            语言：{{ selectedCreator.language }}
          </UBadge>
        </div>

        <UAlert
          v-if="detailError"
          color="error"
          variant="soft"
          :title="detailError"
          class="mb-4"
        />

        <div v-if="collectionGuidance.length" class="mb-4 space-y-2">
          <p class="text-xs font-medium text-muted">
            采集建议
          </p>
          <div
            v-for="item in collectionGuidance"
            :key="`${item.kind}:${item.url}`"
            class="flex items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3"
          >
            <div class="min-w-0">
              <p class="text-sm font-medium">
                {{ item.label }}
              </p>
              <p class="text-xs text-muted">
                {{ item.message }}
              </p>
            </div>
            <UButton
              label="去采集"
              icon="i-lucide-external-link"
              size="xs"
              color="warning"
              variant="soft"
              @click="openExternalPage(item.url)"
            />
          </div>
        </div>

        <div v-if="selectedCreator.platform === 'tiktok'" class="mb-4 border-t border-default pt-4 space-y-4">
          <div v-if="insightsLoading" class="flex justify-center py-4">
            <UIcon name="i-lucide-loader-circle" class="animate-spin text-muted" />
          </div>

          <template v-else-if="creatorInsights?.found">
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-lg bg-elevated p-3">
                <p class="text-xs text-muted">
                  整体互动率
                </p>
                <p class="text-lg font-bold">
                  {{ formatPercent(creatorInsights.overall_engagement_rate) }}
                </p>
              </div>
              <div class="rounded-lg bg-elevated p-3">
                <p class="text-xs text-muted">
                  待分析评论
                </p>
                <p class="text-lg font-bold">
                  {{ creatorInsights.pending_comments || 0 }}
                </p>
              </div>
            </div>

            <div v-if="creatorInsights.videos?.length" class="space-y-2">
              <p class="text-xs font-medium text-muted">
                已发现视频
              </p>
              <a
                v-for="video in creatorInsights.videos.slice(0, 5)"
                :key="video.video_id"
                :href="video.url || undefined"
                target="_blank"
                rel="noopener noreferrer"
                class="block rounded-lg border border-default p-2 text-xs hover:bg-elevated"
              >
                <div class="flex justify-between gap-2">
                  <span class="truncate">{{ video.description || video.video_id }}</span>
                  <strong>{{ formatPercent(video.engagement_rate) }}</strong>
                </div>
                <p class="mt-1 text-muted">
                  播放 {{ video.play_count ?? '-' }} · 点赞 {{ video.like_count ?? '-' }} · 评论 {{ video.comment_count ?? '-' }} · 分享 {{ video.share_count ?? '-' }}
                </p>
              </a>
            </div>

            <div class="flex items-center justify-between gap-3">
              <p class="text-xs font-medium text-muted">
                评论洞察
              </p>
              <UButton
                label="分析评论"
                icon="i-lucide-sparkles"
                size="xs"
                color="primary"
                :loading="commentAnalysisLoading"
                :disabled="!creatorInsights.pending_comments"
                @click="onAnalyzeComments"
              />
            </div>

            <div v-if="creatorInsights.comment_insight" class="rounded-lg bg-elevated p-3 text-xs space-y-2">
              <p>
                正向 {{ creatorInsights.comment_insight.summary.positive_count }} ·
                中性 {{ creatorInsights.comment_insight.summary.neutral_count }} ·
                负向 {{ creatorInsights.comment_insight.summary.negative_count }}
              </p>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="keyword in creatorInsights.comment_insight.summary.keywords"
                  :key="keyword.keyword"
                  color="neutral"
                  variant="soft"
                  size="sm"
                >
                  {{ keyword.keyword }} · {{ keyword.count }}
                </UBadge>
              </div>
            </div>

            <div v-if="analyzedComments.length" class="space-y-2">
              <div
                v-for="comment in analyzedComments"
                :key="comment.comment_id"
                class="rounded-lg border border-default p-2 text-xs"
              >
                <p>
                  {{ comment.text }}
                </p>
                <p class="mt-1 text-muted">
                  {{ comment.sentiment }} · 置信度 {{ formatPercent(comment.sentiment_confidence) }} · {{ comment.keywords.join('、') || '无关键词' }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <div class="flex gap-2 justify-end">
          <UButton
            label="打开主页"
            icon="i-lucide-external-link"
            color="neutral"
            variant="outline"
            :disabled="!getCreatorProfileUrl(selectedCreator)"
            @click="onOpenCreatorProfile(selectedCreator)"
          />
          <UButton
            label="删除达人"
            icon="i-lucide-trash-2"
            color="error"
            variant="outline"
            @click="onDeleteCreator(selectedCreator)"
          />
          <UButton
            label="关闭"
            color="neutral"
            variant="outline"
            @click="showDetailModal = false"
          />
          <UButton
            label="发送私信"
            icon="i-lucide-send"
            color="primary"
            @click="onSendDm(selectedCreator!); showDetailModal = false"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
