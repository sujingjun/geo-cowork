<script setup lang="ts">
import { getPlatformLabel } from '#shared/utils'

interface StoreAuthorizationResponse {
  success: boolean
  platform: 'shopify'
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

function normalizeInputShopDomain(value: string) {
  return `${value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.myshopify\.com$/, '')}.myshopify.com`
}

const { loggedIn } = useUserSession()
const { $csrfFetch } = useNuxtApp()
const { openLoginModal } = useLoginModal()
const { hasShopifyStore, defaultShopifyStore, fetchStores, shopifyStores } = useStores()
const toast = useToast()

const authorizing = shallowRef(false)
const error = shallowRef<string | null>(null)
const shopDomain = shallowRef('')

const statusTitle = computed(() => {
  if (hasShopifyStore.value)
    return 'Shopify 店铺已连接'

  return '尚未连接 Shopify 店铺'
})

const statusDescription = computed(() => {
  if (!defaultShopifyStore.value)
    return '连接 Shopify 店铺后，可同步商品，并为未来的 Shopify CLI / MCP 外站能力提供数据与发布入口。'

  return `当前已连接 ${defaultShopifyStore.value.storeName}，店铺域名 ${defaultShopifyStore.value.shopDomain || '未记录'}。`
})

async function authorizeShopify() {
  if (!loggedIn.value) {
    error.value = '请先登录以连接您的 Shopify 店铺'
    return
  }

  if (!shopDomain.value.trim()) {
    error.value = '请输入 Shopify 店铺域名，例如 your-store 或 your-store.myshopify.com'
    return
  }

  try {
    authorizing.value = true
    error.value = null
    const expectedShopDomain = normalizeInputShopDomain(shopDomain.value)

    const data = await $csrfFetch<StoreAuthorizationResponse>('/api/stores', {
      method: 'POST',
      body: {
        platform: 'shopify',
        shopDomain: shopDomain.value.trim()
      }
    })

    if (!data?.success || !data.authorizationUrl)
      throw new Error('授权失败，请重试')

    const authPopup = watchStoreAuthPopup('shopify')
    try {
      await authPopup.open(data.authorizationUrl, { width: 720, height: 780 })
    } finally {
      authPopup.stop()
    }

    if (authPopup.payload?.status === 'error')
      throw new Error(authPopup.payload.message)

    await fetchStores()

    const connectedStore = shopifyStores.value.find(store => store.shopDomain === expectedShopDomain)
    if (!connectedStore) {
      throw new Error(`Shopify 授权未完成：未在已连接店铺列表中找到 ${expectedShopDomain}，请检查授权弹窗结果后重试`)
    }

    toast.add({
      title: '授权成功',
      description: `${getPlatformLabel(data.platform)} 店铺 ${connectedStore.storeName} 已连接`,
      color: 'success'
    })
  } catch (caughtError) {
    error.value = getErrorMessage(caughtError) || '连接 Shopify 店铺失败'
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
          <span class="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
            <UIcon name="i-simple-icons-shopify" class="text-xl" />
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
            :color="hasShopifyStore ? 'success' : 'warning'"
            variant="soft"
            class="shrink-0"
          >
            {{ hasShopifyStore ? '已授权' : '未授权' }}
          </UBadge>
        </div>

        <UAlert
          v-if="!loggedIn"
          color="info"
          variant="soft"
          title="需要登录"
          description="请先使用 Google 或 GitHub 登录以连接您的 Shopify 店铺"
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

        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div class="space-y-1.5">
            <label for="shopify-shop-domain" class="text-sm font-medium text-highlighted">
              Shopify 店铺域名
            </label>
            <UInput
              id="shopify-shop-domain"
              v-model="shopDomain"
              name="shopify-shop-domain"
              autocomplete="off"
              size="lg"
              placeholder="your-store 或 your-store.myshopify.com…"
              icon="i-simple-icons-shopify"
              class="w-full"
            />
          </div>

          <UButton
            :loading="authorizing"
            :disabled="!loggedIn || authorizing"
            color="success"
            icon="i-simple-icons-shopify"
            class="justify-center"
            @click="authorizeShopify"
          >
            {{ hasShopifyStore ? '连接新店铺' : '连接店铺' }}
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
