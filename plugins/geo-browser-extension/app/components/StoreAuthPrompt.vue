<script setup lang="ts">
import AmazonStoreAuthPanel from '~/components/store-auth/AmazonStoreAuthPanel.vue'
import ShopifyStoreAuthPanel from '~/components/store-auth/ShopifyStoreAuthPanel.vue'

const { hasAmazonStore, hasAuthorizedStore, hasShopifyStore } = useStores()
const selectedTab = shallowRef<'amazon' | 'shopify'>('amazon')

const tabs = [
  {
    key: 'amazon',
    label: 'Amazon 授权',
    icon: 'i-simple-icons-amazon'
  },
  {
    key: 'shopify',
    label: 'Shopify 授权',
    icon: 'i-simple-icons-shopify'
  }
] as const

const cardTitle = computed(() => {
  return hasAuthorizedStore.value ? '继续添加店铺' : '连接店铺'
})

const cardDescription = computed(() => {
  if (hasAuthorizedStore.value)
    return '授权入口会常驻保留，可继续添加多个 Amazon / Shopify 店铺，并分别作为后续站点的数据来源。'

  return '连接 Amazon 或 Shopify 店铺后，即可同步商品并通过 AI 生成 GEO 展示站点。'
})

const preferredTab = computed<'amazon' | 'shopify'>(() => {
  if (hasShopifyStore.value && !hasAmazonStore.value)
    return 'shopify'

  return 'amazon'
})

watch(preferredTab, (tab) => {
  selectedTab.value = tab
}, {
  immediate: true
})
</script>

<template>
  <section class="mt-8" aria-labelledby="store-auth-title">
    <UCard variant="subtle">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-start">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <UIcon
                :name="hasAuthorizedStore ? 'i-heroicons-building-storefront' : 'i-heroicons-plus-circle'"
                class="text-xl"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 id="store-auth-title" class="text-xl font-semibold text-highlighted">
                {{ cardTitle }}
              </h2>
            </div>
          </div>
          <p class="max-w-xl text-sm leading-6 text-muted">
            {{ cardDescription }}
          </p>

          <div
            class="inline-flex rounded-md border border-default bg-default p-1"
            role="tablist"
            aria-label="选择授权平台"
          >
            <UButton
              v-for="tab in tabs"
              :key="tab.key"
              :icon="tab.icon"
              :color="selectedTab === tab.key ? 'primary' : 'neutral'"
              :variant="selectedTab === tab.key ? 'soft' : 'ghost'"
              size="sm"
              role="tab"
              :aria-selected="selectedTab === tab.key"
              class="rounded-sm"
              @click="selectedTab = tab.key"
            >
              {{ tab.label }}
            </UButton>
          </div>
        </div>

        <AmazonStoreAuthPanel v-if="selectedTab === 'amazon'" />
        <ShopifyStoreAuthPanel v-else />
      </div>
    </UCard>
  </section>
</template>
