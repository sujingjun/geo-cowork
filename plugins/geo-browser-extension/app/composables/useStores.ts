/**
 * 店铺管理组合式函数
 * 用于检查用户授权状态、获取店铺列表等
 */

import type { StoreDiagnostics, StoreStatus, StoreSyncStatus } from '#shared/utils'

export interface Store {
  id: string
  userId: string
  platform: string
  storeId: string
  storeName: string
  region: string
  marketplaceId: string | null
  shopDomain: string | null
  scopes: string | null
  expiresAt: Date | null
  status: StoreStatus
  lastSyncedAt: Date | null
  lastSyncStatus: StoreSyncStatus
  lastSyncError: string | null
  lastDiagnosedAt: Date | null
  diagnostics: StoreDiagnostics | null
  disconnectedAt: Date | null
  reauthorizedAt: Date | null
  createdAt: Date
}

export const useStores = () => {
  const { loggedIn } = useUserSession()
  const stores = useState<Store[]>('stores:list', () => [])
  const loading = useState<boolean>('stores:loading', () => false)
  const error = useState<string | null>('stores:error', () => null)

  /**
   * 获取用户的店铺列表
   */
  const fetchStores = async () => {
    if (!loggedIn.value) {
      stores.value = []
      error.value = null
      loading.value = false
      return
    }

    try {
      loading.value = true
      error.value = null

      const data = await $fetch<Store[]>('/api/stores')
      stores.value = data || []
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : '获取店铺列表失败'
      stores.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 检查用户是否已授权店铺
   */
  const hasAuthorizedStore = computed(() => {
    return stores.value.length > 0
  })

  /**
   * 获取第一个店铺（默认店铺）
   */
  const defaultStore = computed(() => {
    return stores.value[0] || null
  })

  const authorizedPlatforms = computed(() => {
    return Array.from(new Set(stores.value.map(store => store.platform)))
  })

  const amazonStores = computed(() => {
    return stores.value.filter(store => store.platform === 'amazon')
  })

  const shopifyStores = computed(() => {
    return stores.value.filter(store => store.platform === 'shopify')
  })

  const hasAmazonStore = computed(() => {
    return amazonStores.value.length > 0
  })

  const hasShopifyStore = computed(() => {
    return shopifyStores.value.length > 0
  })

  const defaultAmazonStore = computed(() => {
    return amazonStores.value[0] || null
  })

  const defaultShopifyStore = computed(() => {
    return shopifyStores.value[0] || null
  })

  return {
    stores,
    loading,
    error,
    hasAuthorizedStore,
    authorizedPlatforms,
    defaultStore,
    amazonStores,
    shopifyStores,
    hasAmazonStore,
    hasShopifyStore,
    defaultAmazonStore,
    defaultShopifyStore,
    fetchStores
  }
}
