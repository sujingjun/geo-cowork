<script setup lang="ts">
import type { SiteProduct } from './types'
import { getPlatformActionLabel, getProductExternalUrl } from '#shared/utils'

defineProps<{
  products: SiteProduct[]
}>()

function formatPrice(price: string | null, currency: string | null = 'USD') {
  if (!price)
    return 'Price unavailable'

  const numericPrice = Number(price)

  if (Number.isNaN(numericPrice))
    return price

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(numericPrice)
}

const getActionLabel = (product: SiteProduct) => getPlatformActionLabel(product.platform)
const getExternalUrl = (product: SiteProduct) => getProductExternalUrl(product)
const getProductMeta = (product: SiteProduct) => product.vendor || product.productType || product.category || 'Featured product'
</script>

<template>
  <section class="list-layout" aria-labelledby="product-list-heading">
    <div class="list-heading">
      <UBadge color="primary" variant="soft">
        Buying guide
      </UBadge>
      <h2 id="product-list-heading" class="text-2xl font-bold text-highlighted sm:text-3xl">
        Compare products
      </h2>
    </div>

    <div class="space-y-4">
      <UCard
        v-for="product in products"
        :key="product.id"
        class="product-row ring-1 ring-default/70 transition duration-300 hover:shadow-lg hover:ring-primary/30"
        :ui="{ body: 'p-0 sm:p-0' }"
      >
        <div class="product-row-grid">
          <div class="product-row-media">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.title"
              class="h-full w-full object-cover"
              loading="lazy"
            >
            <div v-else class="flex h-full w-full items-center justify-center bg-muted">
              <UIcon name="i-heroicons-photo" class="size-12 text-muted" />
            </div>
          </div>

          <div class="product-row-content">
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-if="product.category"
                  color="neutral"
                  variant="soft"
                  size="xs"
                >
                  {{ product.category }}
                </UBadge>
                <UBadge color="primary" variant="soft" size="xs">
                  {{ product.platform === 'shopify' ? 'Shopify' : product.platform === 'amazon' ? 'Amazon' : 'Store' }}
                </UBadge>
              </div>

              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-muted">
                  {{ getProductMeta(product) }}
                </p>
                <h3 class="mt-1 text-xl font-semibold leading-7 text-highlighted">
                  {{ product.title }}
                </h3>
              </div>

              <p v-if="product.description" class="line-clamp-3 max-w-3xl text-sm leading-6 text-muted">
                {{ product.description }}
              </p>
            </div>

            <div class="product-row-action">
              <p class="text-2xl font-bold text-highlighted">
                {{ formatPrice(product.price, product.currency) }}
              </p>
              <UButton
                :to="getExternalUrl(product) || undefined"
                target="_blank"
                external
                color="primary"
                variant="solid"
                trailing-icon="i-lucide-arrow-up-right"
                :disabled="!getExternalUrl(product)"
              >
                {{ getActionLabel(product) }}
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </section>
</template>

<style scoped>
.list-layout {
  padding-block: 3rem;
}

.list-heading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.product-row {
  overflow: hidden;
  border-radius: 0.5rem;
}

.product-row-grid {
  display: grid;
  grid-template-columns: 1fr;
}

.product-row-media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ui-bg-muted);
}

.product-row-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: space-between;
  padding: 1rem;
}

.product-row-action {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .product-row-grid {
    grid-template-columns: minmax(14rem, 18rem) 1fr;
  }

  .product-row-media {
    aspect-ratio: auto;
    min-height: 18rem;
  }

  .product-row-content {
    padding: 1.5rem;
  }

  .product-row-action {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
