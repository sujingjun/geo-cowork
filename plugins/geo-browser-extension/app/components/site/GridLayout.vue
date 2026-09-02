<script setup lang="ts">
import type { SiteProduct } from './types'

const props = defineProps<{
  products: SiteProduct[]
}>()

const categoryCount = computed(() => {
  return new Set(props.products.map(product => product.category).filter(Boolean)).size
})
</script>

<template>
  <section class="grid-layout" aria-labelledby="collection-heading">
    <div class="collection-toolbar">
      <div>
        <UBadge color="primary" variant="soft" class="mb-3">
          Curated collection
        </UBadge>
        <h2 id="collection-heading" class="text-2xl font-bold text-highlighted sm:text-3xl">
          Shop the edit
        </h2>
      </div>

      <div class="collection-stats">
        <span>{{ products.length }} products</span>
        <span v-if="categoryCount">{{ categoryCount }} categories</span>
      </div>
    </div>

    <div class="product-grid">
      <SiteProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>

<style scoped>
.grid-layout {
  padding-block: 3rem;
}

.collection-toolbar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.collection-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: var(--ui-text-muted);
  font-size: 0.875rem;
}

.collection-stats span {
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  padding: 0.375rem 0.625rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 640px) {
  .collection-toolbar {
    align-items: end;
    flex-direction: row;
    justify-content: space-between;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
