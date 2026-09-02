<script setup lang="ts">
import { STORE_PLATFORM_OPTIONS, getPlatformLabel } from '#shared/utils'

type StorePlatform = 'amazon' | 'shopify'

interface StoreAuthorizationResponse {
  success: boolean
  platform: StorePlatform
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
const loading = shallowRef(false)
const error = shallowRef<string | null>(null)
const success = shallowRef(false)
const successPlatform = shallowRef<StorePlatform | null>(null)
const selectedPlatform = shallowRef<StorePlatform>('amazon')
const shopDomain = shallowRef('')
const toast = useToast()

const platformOptions = STORE_PLATFORM_OPTIONS.map(option => ({
  label: option.label,
  value: option.value,
  icon: option.icon
}))

const isShopify = computed(() => selectedPlatform.value === 'shopify')

const buttonLabel = computed(() => {
  if (success.value && successPlatform.value)
    return `已连接 ${getPlatformLabel(successPlatform.value)} 店铺`

  return isShopify.value ? '连接 Shopify 店铺' : '连接亚马逊卖家账号'
})

const loginDescription = computed(() => {
  return isShopify.value
    ? '请先使用 Google 或 GitHub 登录以连接您的 Shopify 店铺'
    : '请先使用 Google 或 GitHub 登录以连接您的亚马逊店铺'
})

const successDescription = computed(() => {
  if (successPlatform.value === 'shopify')
    return '您的 Shopify 店铺已成功连接，即将刷新页面...'

  return '您的亚马逊店铺已成功连接，即将刷新页面...'
})

const authorizeStore = async () => {
  if (!loggedIn.value) {
    error.value = isShopify.value ? '请先登录以连接您的 Shopify 店铺' : '请先登录以连接您的亚马逊店铺'
    return
  }

  if (isShopify.value && !shopDomain.value.trim()) {
    error.value = '请输入 Shopify 店铺域名，例如 your-store 或 your-store.myshopify.com'
    return
  }

  try {
    loading.value = true
    error.value = null
    success.value = false
    successPlatform.value = null

    const data = await $csrfFetch<StoreAuthorizationResponse>('/api/stores', {
      method: 'POST',
      body: {
        platform: selectedPlatform.value,
        ...(isShopify.value ? { shopDomain: shopDomain.value.trim() } : {})
      }
    })

    if (!data?.success || !data.authorizationUrl)
      throw new Error('授权失败，请重试')

    const authPopup = watchStoreAuthPopup(data.platform)
    try {
      await authPopup.open(data.authorizationUrl, { width: 720, height: 780 })
    } finally {
      authPopup.stop()
    }

    if (authPopup.payload?.status === 'error')
      throw new Error(authPopup.payload.message)

    success.value = true
    successPlatform.value = data.platform
    toast.add({
      title: '授权成功',
      description: `${getPlatformLabel(data.platform)} 店铺已连接，即将刷新店铺数据`,
      color: 'success'
    })

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (e: unknown) {
    error.value = getErrorMessage(e) || (isShopify.value ? '连接 Shopify 店铺失败' : '连接亚马逊店铺失败')
    toast.add({
      title: '授权失败',
      description: error.value || undefined,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="store-auth-button space-y-4">
    <div class="space-y-3">
      <USelectMenu
        v-model="selectedPlatform"
        :items="platformOptions"
        value-key="value"
        size="lg"
        :icon="platformOptions.find(option => option.value === selectedPlatform)?.icon"
      />

      <UInput
        v-if="isShopify"
        v-model="shopDomain"
        size="lg"
        placeholder="your-store 或 your-store.myshopify.com"
        icon="i-simple-icons-shopify"
      />
    </div>

    <UButton
      :loading="loading"
      :disabled="!loggedIn || loading || success"
      color="warning"
      size="lg"
      block
      @click="authorizeStore"
    >
      <template #leading>
        <UIcon :name="isShopify ? 'i-simple-icons-shopify' : 'i-simple-icons-amazon'" />
      </template>
      {{ buttonLabel }}
    </UButton>

    <UAlert
      v-if="!loggedIn"
      color="info"
      variant="soft"
      title="需要登录"
      :description="loginDescription"
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

    <UAlert
      v-if="success"
      color="success"
      variant="soft"
      title="授权成功"
      :description="successDescription"
      icon="i-heroicons-check-circle"
    />

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      title="连接失败"
      :description="error"
      icon="i-heroicons-exclamation-circle"
    />
  </div>
</template>
