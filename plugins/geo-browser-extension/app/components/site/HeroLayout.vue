<script setup lang="ts">
import type { SiteProduct } from './types'
import { getPlatformActionLabel, getProductExternalUrl } from '#shared/utils'

const props = defineProps<{
  products: SiteProduct[]
}>()

const heroProduct = computed(() => props.products[0])
const otherProducts = computed(() => props.products.slice(1))

const heroProductUrl = computed(() => heroProduct.value ? getProductExternalUrl(heroProduct.value) : null)
const heroActionLabel = computed(() => getPlatformActionLabel(heroProduct.value?.platform))

const formattedHeroPrice = computed(() => {
  if (!heroProduct.value?.price)
    return 'Price unavailable'

  const numericPrice = Number(heroProduct.value.price)

  if (Number.isNaN(numericPrice))
    return heroProduct.value.price

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: heroProduct.value.currency || 'USD'
  }).format(numericPrice)
})
</script>

<template>
  <section class="hero-layout">
    <div v-if="heroProduct" class="featured-product">
      <div class="featured-media">
        <img
          v-if="heroProduct.imageUrl"
          :src="heroProduct.imageUrl"
          :alt="heroProduct.title"
          class="h-full w-full object-cover"
        >
        <div v-else class="flex h-full w-full items-center justify-center bg-muted">
          <UIcon name="i-heroicons-photo" class="size-16 text-muted" />
        </div>
      </div>

      <div class="featured-copy">
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft">
              Featured drop
            </UBadge>
            <UBadge v-if="heroProduct.category" color="neutral" variant="soft">
              {{ heroProduct.category }}
            </UBadge>
          </div>

          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-muted">
              {{ heroProduct.vendor || heroProduct.productType || 'Curated product' }}
            </p>
            <h2 class="mt-2 text-3xl font-bold leading-tight text-highlighted sm:text-4xl">
              {{ heroProduct.title }}
            </h2>
          </div>

          <p v-if="heroProduct.description" class="max-w-2xl text-base leading-7 text-muted">
            {{ heroProduct.description }}
          </p>
        </div>

        <div class="featured-action">
          <p class="text-3xl font-bold text-highlighted">
            {{ formattedHeroPrice }}
          </p>
          <UButton
            :to="heroProductUrl || undefined"
            target="_blank"
            external
            color="primary"
            size="xl"
            trailing-icon="i-lucide-arrow-up-right"
            :disabled="!heroProductUrl"
          >
            {{ heroActionLabel }}
          </UButton>
        </div>
      </div>
    </div>

    <div v-if="otherProducts.length > 0" class="more-products">
      <div class="more-heading">
        <UBadge color="neutral" variant="soft">
          More picks
        </UBadge>
        <h3 class="text-2xl font-bold text-highlighted">
          Complete the collection
        </h3>
      </div>

      <div class="more-grid">
        <SiteProductCard
          v-for="product in otherProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-layout {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-block: 3rem;
}

.featured-product {
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  display: grid;
  gap: 0;
  overflow: hidden;
  background: var(--ui-bg);
}

.featured-media {
  aspect-ratio: 4 / 3;
  background: var(--ui-bg-muted);
}

.featured-copy {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: space-between;
  padding: 1.25rem;
}

.featured-action {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.more-heading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.more-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .featured-product {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }

  .featured-media {
    aspect-ratio: auto;
    min-height: 34rem;
  }

  .featured-copy {
    padding: 2rem;
  }

  .featured-action {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }

  .more-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
