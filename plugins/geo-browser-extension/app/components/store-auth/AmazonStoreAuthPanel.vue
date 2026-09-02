<script setup lang="ts">
import { getPlatformLabel } from '#shared/utils'

interface StoreAuthorizationResponse {
  success: boolean
  platform: 'amazon'
  authorizationUrl: string
  expiresIn: number
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object') {
    const maybeError = error as { data?: { message?: string, statusMessage?: string }, message?: string, statusMessage?: string }
    return maybeError.data?.message || maybeError.data?.statusMessage || maybeError.statusMessage || maybeError.message
  }

  return undefined
}

const { loggedIn } = useUserSession()
const { $csrfFetch } = useNuxtApp()
const { openLoginModal } = useLoginModal()
const { hasAmazonStore, defaultAmazonStore, fetchStores } = useStores()
const toast = useToast()

const authorizing = shallowRef(false)
const error = shallowRef<string | null>(null)

const statusTitle = computed(() => {
  if (hasAmazonStore.value)
    return 'Amazon 店铺已连接'

  return '尚未连接 Amazon 店铺'
})

const statusDescription = computed(() => {
  if (!defaultAmazonStore.value)
    return '连接 Amazon 卖家账号后，可同步商品并用于站内 GEO 展示站点或后续混合商品来源配置。'

  return `当前已连接 ${defaultAmazonStore.value.storeName}，默认区域 ${defaultAmazonStore.value.region}。`
})

async function authorizeAmazon() {
  if (!loggedIn.value) {
    error.value = '请先登录以连接您的亚马逊店铺'
    return
  }

  try {
    authorizing.value = true
    error.value = null

    const data = await $csrfFetch<StoreAuthorizationResponse>('/api/stores', {
      method: 'POST',
      body: {
        platform: 'amazon'
      }
    })

    if (!data?.success || !data.authorizationUrl)
      throw new Error('授权失败，请重试')

    const authPopup = watchStoreAuthPopup('amazon')
    try {
      await authPopup.open(data.authorizationUrl, { width: 720, height: 780 })
    } finally {
      authPopup.stop()
    }

    if (authPopup.payload?.status === 'error')
      throw new Error(authPopup.payload.message)

    await fetchStores()

    toast.add({
      title: '授权成功',
      description: `${getPlatformLabel(data.platform)} 店铺已连接`,
      color: 'success'
    })
  } catch (caughtError) {
    error.value = getErrorMessage(caughtError) || '连接亚马逊店铺失败'
    toast.add({
      title: '授权失败',
      description: error.value || undefined,
      color: 'error'
    })
  } finally {
    authorizing.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-md border border-default bg-default p-4">
      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <span class="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <UIcon name="i-simple-icons-amazon" class="text-xl" />
          </span>
          <div class="min-w-0 flex-1 space-y-1">
            <p class="font-medium text-highlighted">
              {{ statusTitle }}
            </p>
            <p class="text-sm leading-5 text-muted">
              {{ statusDescription }}
            </p>
          </div>
          <UBadge
            :color="hasAmazonStore ? 'success' : 'warning'"
            variant="soft"
            class="shrink-0"
          >
            {{ hasAmazonStore ? '已授权' : '未授权' }}
          </UBadge>
        </div>

        <UAlert
          v-if="!loggedIn"
          color="info"
          variant="soft"
          title="需要登录"
          description="请先使用 Google 或 GitHub 登录以连接您的亚马逊店铺"
          icon="i-heroicons-information-circle"
        >
          <template #actions>
            <UButton
              color="info"
              variant="soft"
              size="sm"
              @click="openLoginModal()"
            >
              立即登录
            </UButton>
          </template>
        </UAlert>

        <div class="flex justify-end">
          <UButton
            :loading="authorizing"
            :disabled="!loggedIn || authorizing"
            color="warning"
            icon="i-simple-icons-amazon"
            @click="authorizeAmazon"
          >
            {{ hasAmazonStore ? '连接新的 Amazon 店铺' : '连接亚马逊卖家账号' }}
          </UButton>
        </div>
      </div>
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      title="操作失败"
      :description="error"
      icon="i-heroicons-exclamation-circle"
      aria-live="polite"
    />
  </div>
</template>
