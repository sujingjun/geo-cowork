<script setup lang="ts">
import type { SiteProduct } from './types'
import { getPlatformActionLabel, getProductExternalUrl } from '#shared/utils'

const props = defineProps<{
  product: SiteProduct
  featured?: boolean
}>()

const productUrl = computed(() => getProductExternalUrl(props.product))
const actionLabel = computed(() => getPlatformActionLabel(props.product.platform))
const platformLabel = computed(() => props.product.platform === 'shopify' ? 'Shopify' : props.product.platform === 'amazon' ? 'Amazon' : 'Store')
const productMeta = computed(() => props.product.vendor || props.product.productType || props.product.category || platformLabel.value)

const formattedPrice = computed(() => {
  if (!props.product.price)
    return 'Price unavailable'

  const numericPrice = Number(props.product.price)

  if (Number.isNaN(numericPrice))
    return props.product.price

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.product.currency || 'USD'
  }).format(numericPrice)
})
</script>

<template>
  <UCard
    class="group product-card overflow-hidden ring-1 ring-default/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/30"
    :ui="{
      body: 'p-0 sm:p-0',
      footer: 'p-0 sm:p-0'
    }"
  >
    <div>
      <div class="product-media">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.title"
          class="product-image"
          loading="lazy"
        >
        <div v-else class="product-empty">
          <UIcon name="i-heroicons-photo" class="size-12 text-muted" />
        </div>

        <div class="product-badges">
          <UBadge
            v-if="product.category"
            color="neutral"
            variant="solid"
            size="xs"
          >
            {{ product.category }}
          </UBadge>
          <UBadge color="primary" variant="soft" size="xs">
            {{ platformLabel }}
          </UBadge>
        </div>
      </div>

      <div class="product-body">
        <div class="space-y-2">
          <p class="text-xs font-medium uppercase tracking-wide text-muted">
            {{ productMeta }}
          </p>
          <h3 class="line-clamp-2 text-base font-semibold leading-6 text-highlighted">
            {{ product.title }}
          </h3>
          <p v-if="product.description" class="line-clamp-3 text-sm leading-6 text-muted">
            {{ product.description }}
          </p>
        </div>

        <div class="mt-5 flex items-end justify-between gap-3">
          <div>
            <p class="text-xs text-muted">
              From
            </p>
            <p class="text-xl font-bold text-highlighted">
              {{ formattedPrice }}
            </p>
          </div>
          <UButton
            :to="productUrl || undefined"
            target="_blank"
            external
            color="primary"
            variant="solid"
            size="sm"
            trailing-icon="i-lucide-arrow-up-right"
            class="shrink-0 whitespace-nowrap"
            :disabled="!productUrl"
            :aria-label="actionLabel"
          >
            View
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
.product-card {
  height: 100%;
  border-radius: 0.5rem;
}

.product-media {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: color-mix(in srgb, var(--ui-bg-muted) 86%, transparent);
}

.product-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
}

.group:hover .product-image {
  transform: scale(1.04);
}

.product-empty {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.product-badges {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-body {
  display: flex;
  min-height: 15rem;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}
</style>
