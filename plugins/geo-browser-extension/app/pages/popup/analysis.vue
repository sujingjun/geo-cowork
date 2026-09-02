<script setup lang="ts">
import type { Creator, PageAnalysisResult } from '~/utils/extension-messaging'

const { isExtension, getLastAnalysis, analyzePage, getCreators, openWorkbench } = useExtensionBridge()

const analysis = ref<PageAnalysisResult | null>(null)
const creators = ref<Creator[]>([])
const total = ref(0)
const loading = ref(true)
const retrying = ref(false)
const errorMsg = ref('')

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

function formatCount(n: number | null): string {
  if (n == null) return '-'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

const platformLabel: Record<string, string> = {
  tiktok: 'TikTok',
  douyin: '抖音'
}

const highlightId = computed(() => analysis.value?.creator?.id || null)

async function loadData() {
  loading.value = true
  errorMsg.value = ''
  try {
    const [analysisRes, listRes] = await Promise.all([
      getLastAnalysis(),
      getCreators({ page: 1, pageSize: 20 })
    ])
    analysis.value = analysisRes.analysis
    creators.value = listRes.items || []
    total.value = listRes.total || 0
  } catch (error: unknown) {
    errorMsg.value = getErrorMessage(error, '加载失败')
  } finally {
    loading.value = false
  }
}

async function retryAnalyze() {
  retrying.value = true
  errorMsg.value = ''
  try {
    const res = await analyzePage()
    if (!res.success) {
      errorMsg.value = res.error || '分析失败'
      return
    }
    await loadData()
  } catch (error: unknown) {
    errorMsg.value = getErrorMessage(error, '分析失败')
  } finally {
    retrying.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="w-[400px] max-h-[600px] overflow-y-auto p-3 flex flex-col gap-3 bg-default">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <UIcon name="i-lucide-scan-search" class="text-primary" />
        <span class="font-semibold text-sm">达人画像识别</span>
      </div>
      <UButton
        icon="i-lucide-external-link"
        size="xs"
        variant="ghost"
        color="neutral"
        @click="openWorkbench"
      >
        打开工作台
      </UButton>
    </div>

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      :title="errorMsg"
      size="sm"
    />

    <!-- Latest analysis card -->
    <UCard v-if="analysis" :ui="{ body: 'p-3' }">
      <div v-if="analysis.is_creator_profile && analysis.creator" class="flex flex-col gap-2">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="analysis.creator.avatar_url || undefined"
            :alt="analysis.creator.nickname || ''"
            size="xl"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-medium truncate">{{ analysis.creator.nickname || '未知达人' }}</span>
              <UBadge color="primary" variant="soft" size="sm">
                {{ platformLabel[analysis.platform] || analysis.platform }}
              </UBadge>
              <UBadge
                v-if="analysis.inserted"
                color="success"
                variant="soft"
                size="sm"
              >
                新入库
              </UBadge>
            </div>
            <p class="text-xs text-muted truncate">
              @{{ analysis.creator.platform_uid || analysis.creator.unique_id }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-1 text-center text-xs">
          <div>
            <div class="font-semibold">
              {{ formatCount(analysis.creator.follower_count) }}
            </div>
            <div class="text-muted">
              粉丝
            </div>
          </div>
          <div>
            <div class="font-semibold">
              {{ formatCount(analysis.creator.following_count) }}
            </div>
            <div class="text-muted">
              关注
            </div>
          </div>
          <div>
            <div class="font-semibold">
              {{ formatCount(analysis.creator.total_favorited) }}
            </div>
            <div class="text-muted">
              获赞
            </div>
          </div>
          <div>
            <div class="font-semibold">
              {{ formatCount(analysis.creator.aweme_count) }}
            </div>
            <div class="text-muted">
              作品
            </div>
          </div>
        </div>

        <p v-if="analysis.creator.signature" class="text-xs text-muted line-clamp-2">
          {{ analysis.creator.signature }}
        </p>

        <div class="flex items-start gap-1 text-xs text-muted border-t border-default pt-2">
          <UIcon name="i-lucide-sparkles" class="flex-shrink-0 mt-0.5 text-primary" />
          <span>{{ analysis.reason || '已完成画像识别' }}（置信度 {{ Math.round((analysis.confidence || 0) * 100) }}%）</span>
        </div>
      </div>

      <div v-else class="flex items-start gap-2 text-sm">
        <UIcon name="i-lucide-info" class="text-muted flex-shrink-0 mt-0.5" />
        <div>
          <p>当前页面未识别到达人画像</p>
          <p class="text-xs text-muted mt-1">
            {{ analysis.reason }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- Empty state -->
    <UCard v-else-if="!loading" :ui="{ body: 'p-4' }">
      <div class="flex flex-col items-center gap-2 text-center">
        <UIcon name="i-lucide-user-search" class="text-2xl text-muted" />
        <p class="text-sm text-muted">
          打开 TikTok 达人主页，页面加载完成后将自动识别达人画像
        </p>
      </div>
    </UCard>

    <!-- Creator pool list -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-muted">达人池（{{ total }}）</span>
        <UButton
          icon="i-lucide-refresh-cw"
          size="xs"
          variant="ghost"
          color="neutral"
          :loading="retrying"
          title="重新分析当前页"
          @click="retryAnalyze"
        >
          重新分析
        </UButton>
      </div>

      <div v-if="loading" class="flex justify-center py-4">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-muted" />
      </div>

      <template v-else>
        <div
          v-for="creator in creators"
          :key="creator.id"
          class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors"
          :class="creator.id === highlightId ? 'bg-primary/10 ring-1 ring-primary/40' : 'hover:bg-elevated'"
        >
          <UAvatar
            :src="creator.avatar_url || undefined"
            :alt="creator.nickname || ''"
            size="sm"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1">
              <span class="text-sm truncate">{{ creator.nickname || creator.platform_uid || creator.sec_uid || '未知' }}</span>
              <UBadge
                v-if="creator.platform && creator.platform !== 'douyin'"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ platformLabel[creator.platform] || creator.platform }}
              </UBadge>
            </div>
            <p class="text-xs text-muted truncate">
              粉丝 {{ formatCount(creator.follower_count) }} · 获赞 {{ formatCount(creator.total_favorited) }}
            </p>
          </div>
        </div>

        <p v-if="creators.length === 0" class="text-xs text-muted text-center py-3">
          达人池为空
        </p>
      </template>
    </div>

    <p v-if="!isExtension" class="text-xs text-muted text-center">
      当前为网页模式，自动识别需安装浏览器插件
    </p>
  </div>
</template>
