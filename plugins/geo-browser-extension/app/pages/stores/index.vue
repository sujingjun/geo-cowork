<script setup lang="ts">
import { getPlatformLabel } from '#shared/utils'
import { LazyModalConfirm } from '#components'

const { fetchStores, loading: storesLoading, error: storesError, stores, defaultStore } = useStores()
const { csrf, headerName } = useCsrf()
const { loggedIn } = useUserSession()
const overlay = useOverlay()
const syncingStoreId = shallowRef<string | null>(null)
const syncedStoreId = shallowRef<string | null>(null)
const diagnosingStoreId = shallowRef<string | null>(null)
const reauthorizingStoreId = shallowRef<string | null>(null)
const disconnectingStoreId = shallowRef<string | null>(null)
const toast = useToast()
const showStoreSkeletons = computed(() => loggedIn.value && storesLoading.value)
const disconnectModal = overlay.create(LazyModalConfirm, {
  props: {
    title: '断开店铺授权',
    description: '断开后将清除本地授权令牌，商品缓存和已生成站点不会删除。重新同步前需要再次授权。',
    color: 'warning',
    confirmLabel: '断开授权',
    cancelLabel: '保留授权'
  }
})

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object') {
    const maybeError = error as { data?: { message?: string, statusMessage?: string }, message?: string, statusMessage?: string }
    return maybeError.data?.message || maybeError.data?.statusMessage || maybeError.statusMessage || maybeError.message
  }

  return undefined
}

watch(loggedIn, async (isLoggedIn) => {
  if (isLoggedIn)
    await fetchStores()
}, {
  immediate: true
})

useSeoMeta({
  title: '店铺管理',
  description: '管理已授权的 Amazon 和 Shopify 店铺，并执行商品同步'
})

async function syncStore(storeId: string) {
  try {
    syncingStoreId.value = storeId
    syncedStoreId.value = null

    const result = await $fetch<{ synced: number, platform: string }>(`/api/stores/${storeId}/sync`, {
      method: 'POST',
      headers: {
        [headerName]: csrf
      }
    })

    syncedStoreId.value = storeId
    await fetchStores()
    toast.add({
      title: '同步成功',
      description: `${getPlatformLabel(result.platform)} 店铺已同步 ${result.synced} 个商品`,
      color: 'success'
    })
  } catch (error) {
    console.error('Error syncing store:', error)
    const message = getErrorMessage(error) || '商品同步失败，请检查店铺授权与平台配置后重试'
    toast.add({
      title: '同步失败',
      description: message,
      color: 'error'
    })
  } finally {
    syncingStoreId.value = null
  }
}

function getStoreStatusLabel(status: string) {
  const labels: Record<string, string> = {
    connected: '已连接',
    disconnected: '已断开',
    expired: '授权过期',
    error: '异常'
  }

  return labels[status] || status
}

function getStoreStatusColor(status: string) {
  const colors: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
    connected: 'success',
    disconnected: 'neutral',
    expired: 'warning',
    error: 'error'
  }

  return colors[status] || 'neutral'
}

function formatDate(value: Date | string | null) {
  if (!value)
    return '未记录'

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

async function diagnoseStore(storeId: string) {
  try {
    diagnosingStoreId.value = storeId

    const result = await $fetch<{ diagnostics: { message: string }, store?: unknown }>(`/api/stores/${storeId}/diagnose`, {
      method: 'POST',
      headers: {
        [headerName]: csrf
      }
    })

    await fetchStores()
    toast.add({
      title: '诊断完成',
      description: result.diagnostics.message,
      color: 'info'
    })
  } catch (error) {
    const message = getErrorMessage(error) || '诊断失败，请稍后重试'
    toast.add({
      title: '诊断失败',
      description: message,
      color: 'error'
    })
  } finally {
    diagnosingStoreId.value = null
  }
}

async function reauthorizeStore(storeId: string) {
  try {
    reauthorizingStoreId.value = storeId

    const data = await $fetch<{ success: boolean, platform: 'amazon' | 'shopify', authorizationUrl: string }>(`/api/stores/${storeId}/reauthorize`, {
      method: 'POST',
      headers: {
        [headerName]: csrf
      }
    })

    if (!data?.success || !data.authorizationUrl)
      throw new Error('重新授权失败，请重试')

    const authPopup = watchStoreAuthPopup(data.platform)
    try {
      await authPopup.open(data.authorizationUrl, { width: 720, height: 780 })
    } finally {
      authPopup.stop()
    }

    if (authPopup.payload?.status === 'error')
      throw new Error(authPopup.payload.message)

    await fetchStores()
    toast.add({
      title: '重新授权成功',
      description: `${getPlatformLabel(data.platform)} 店铺授权已恢复`,
      color: 'success'
    })
  } catch (error) {
    const message = getErrorMessage(error) || '重新授权失败，请检查店铺授权配置后重试'
    toast.add({
      title: '重新授权失败',
      description: message,
      color: 'error'
    })
  } finally {
    reauthorizingStoreId.value = null
  }
}

async function disconnectStore(storeId: string) {
  const instance = disconnectModal.open()
  const confirmed = await instance.result

  if (!confirmed)
    return

  try {
    disconnectingStoreId.value = storeId
    await $fetch(`/api/stores/${storeId}/disconnect`, {
      method: 'POST',
      headers: {
        [headerName]: csrf
      }
    })

    await fetchStores()
    toast.add({
      title: '已断开授权',
      description: '店铺令牌已清除，可通过重新授权恢复同步。',
      color: 'success'
    })
  } catch (error) {
    const message = getErrorMessage(error) || '断开授权失败，请稍后重试'
    toast.add({
      title: '操作失败',
      description: message,
      color: 'error'
    })
  } finally {
    disconnectingStoreId.value = null
  }
}
</script>

<template>
  <div class="stores-page">
    <UContainer>
      <div class="page-header py-12">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">
              店铺管理
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              统一管理 Amazon / Shopify 授权店铺，并按店铺同步商品数据
            </p>
          </div>

          <UButton
            to="/sites"
            color="primary"
            size="lg"
            leading-icon="i-heroicons-globe-alt"
            class="self-start md:self-auto"
          >
            查看我的站点
          </UButton>
        </div>
      </div>

      <StoreAuthPrompt v-if="!showStoreSkeletons" />

      <UAlert
        v-if="storesError"
        class="mt-6"
        color="error"
        variant="soft"
        title="店铺列表加载失败"
        :description="storesError"
      />

      <div v-else-if="showStoreSkeletons" class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <USkeleton class="h-42 rounded-md" />
        <USkeleton class="h-42 rounded-md" />
      </div>

      <div v-else-if="stores.length > 0" class="mt-6 space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-xl font-semibold text-highlighted">
              已连接店铺
            </h2>
            <p class="text-sm text-muted">
              当前默认店铺为 {{ defaultStore ? `${getPlatformLabel(defaultStore.platform)} / ${defaultStore.storeName}` : '未设置' }}。
            </p>
          </div>
          <UBadge color="neutral" variant="soft" class="self-start sm:self-auto">
            {{ stores.length }} 个店铺
          </UBadge>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <UCard
            v-for="store in stores"
            :key="store.id"
            :ui="{ body: 'p-0 sm:p-0' }"
          >
            <article class="store-card">
              <header class="store-card-header">
                <div class="min-w-0 flex items-start gap-3">
                  <span class="store-platform-icon">
                    <UIcon
                      :name="store.platform === 'shopify' ? 'i-simple-icons-shopify' : 'i-simple-icons-amazon'"
                      :class="store.platform === 'shopify' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'"
                      class="text-xl"
                      aria-hidden="true"
                    />
                  </span>
                  <div class="min-w-0 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="truncate font-semibold text-highlighted">
                        {{ store.storeName }}
                      </h3>
                      <UBadge v-if="defaultStore?.id === store.id" color="success" variant="soft">
                        默认
                      </UBadge>
                    </div>
                    <p class="break-words text-sm text-muted">
                      {{ store.shopDomain || store.storeId }}
                    </p>
                  </div>
                </div>

                <div class="flex shrink-0 flex-col items-end gap-2">
                  <UBadge color="primary" variant="soft">
                    {{ getPlatformLabel(store.platform) }}
                  </UBadge>
                  <UBadge :color="getStoreStatusColor(store.status)" variant="soft">
                    {{ getStoreStatusLabel(store.status) }}
                  </UBadge>
                </div>
              </header>

              <div class="store-card-body">
                <dl class="grid gap-3 sm:grid-cols-2">
                  <div class="rounded-md bg-muted/40 p-3">
                    <dt class="text-xs text-muted">
                      最后同步
                    </dt>
                    <dd class="mt-1 text-sm font-medium text-highlighted">
                      {{ formatDate(store.lastSyncedAt) }}
                    </dd>
                  </div>
                  <div class="rounded-md bg-muted/40 p-3">
                    <dt class="text-xs text-muted">
                      最后诊断
                    </dt>
                    <dd class="mt-1 text-sm font-medium text-highlighted">
                      {{ formatDate(store.lastDiagnosedAt) }}
                    </dd>
                  </div>
                </dl>

                <UAlert
                  v-if="store.lastSyncError || store.diagnostics?.message"
                  class="mt-3"
                  :color="store.status === 'connected' ? 'info' : 'warning'"
                  variant="soft"
                  :title="store.diagnostics?.message || store.lastSyncError || undefined"
                  :description="store.diagnostics?.code ? `诊断代码：${store.diagnostics.code}` : undefined"
                />
              </div>

              <footer class="store-card-footer">
                <UBadge v-if="syncedStoreId === store.id" color="success" variant="soft">
                  已完成同步
                </UBadge>
                <span v-else class="text-xs text-muted">
                  商品同步和诊断操作会写入后台日志
                </span>

                <div class="flex flex-wrap justify-end gap-2">
                  <UButton
                    color="primary"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-arrow-path"
                    :loading="syncingStoreId === store.id"
                    :disabled="store.status === 'disconnected' || store.status === 'expired'"
                    @click="syncStore(store.id)"
                  >
                    同步商品
                  </UButton>

                  <UButton
                    color="neutral"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-wrench-screwdriver"
                    :loading="diagnosingStoreId === store.id"
                    @click="diagnoseStore(store.id)"
                  >
                    诊断
                  </UButton>

                  <UButton
                    v-if="store.status !== 'connected'"
                    color="primary"
                    variant="solid"
                    size="sm"
                    icon="i-heroicons-key"
                    :loading="reauthorizingStoreId === store.id"
                    @click="reauthorizeStore(store.id)"
                  >
                    重新授权
                  </UButton>

                  <UButton
                    v-else
                    color="warning"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-no-symbol"
                    :loading="disconnectingStoreId === store.id"
                    @click="disconnectStore(store.id)"
                  >
                    断开授权
                  </UButton>
                </div>
              </footer>
            </article>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.stores-page {
  min-height: 100vh;
  flex: 1;
  background: var(--ui-bg);
}

.page-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

:global(.dark) .page-header {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.store-card {
  display: grid;
  min-height: 100%;
  grid-template-rows: auto 1fr auto;
}

.store-card-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.125rem;
}

.store-platform-icon {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--ui-primary) 10%, transparent);
  color: var(--ui-primary);
}

.store-card-body {
  padding: 0 1.125rem 1.125rem;
}

.store-card-footer {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--ui-border);
  padding: 0.875rem 1.125rem;
  background: color-mix(in srgb, var(--ui-bg-muted) 42%, transparent);
}

@media (max-width: 640px) {
  .store-card-header,
  .store-card-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .store-card-footer > div {
    justify-content: flex-start;
  }
}
</style>
