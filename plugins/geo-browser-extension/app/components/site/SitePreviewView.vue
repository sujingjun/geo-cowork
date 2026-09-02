<script setup lang="ts">
import type { SiteProduct } from './types'
import { buildProductDrivenSiteBuilderConfig, buildSiteSchemaInput, buildSiteSeo, normalizeSiteBuilderConfig } from '#shared/utils'

const props = defineProps<{
  slug: string
}>()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const requestUrl = useRequestURL()

const { data: site, error } = await useFetch(() => `/api/sites/${props.slug}`, {
  key: () => `site-${props.slug}-${route.fullPath}`
})

if (error.value || !site.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Site not found'
  })
}

const siteData = site.value
const siteBaseUrl = runtimeConfig.public.siteUrl || requestUrl.origin
const products = computed<SiteProduct[]>(() => site.value?.products || [])
const heroProduct = computed(() => products.value.find(product => product.imageUrl) || products.value[0] || null)
const heroImage = computed(() => heroProduct.value?.imageUrl || site.value?.ogImage || null)
const categories = computed(() => {
  const values = products.value
    .map(product => product.category)
    .filter((category): category is string => Boolean(category))

  return Array.from(new Set(values)).slice(0, 4)
})
const siteBasePath = computed(() => site.value ? `/sites/${site.value.slug}` : '/sites')
const builderConfig = computed(() => {
  const fallbackConfig = buildProductDrivenSiteBuilderConfig({
    template: site.value?.template,
    title: site.value?.title || '',
    theme: site.value?.theme || '',
    productCount: products.value?.length || 0,
    categories: categories.value,
    products: products.value,
    userIntent: site.value?.theme || ''
  })

  return normalizeSiteBuilderConfig(site.value?.builderConfig, fallbackConfig)
})

const siteSeo = buildSiteSeo(siteData, siteData.products || [], siteBaseUrl)
const schemaInput = buildSiteSchemaInput(siteData, siteData.products || [], siteSeo)
const extendedJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...schemaInput.organization
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    ...schemaInput.webSite
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...schemaInput.faqPage
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    ...schemaInput.howTo
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    ...schemaInput.blog
  }
]

useSeoMeta({
  title: siteSeo.title,
  description: siteSeo.description,
  ogTitle: siteSeo.title,
  ogDescription: siteSeo.description,
  ogImage: siteSeo.ogImage,
  ogUrl: siteSeo.links.canonicalUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: siteSeo.title,
  twitterDescription: siteSeo.description,
  twitterImage: siteSeo.ogImage
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: siteSeo.links.canonicalUrl
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(extendedJsonLd)
    }
  ]
})

if (siteData.products && siteData.products?.length > 0) {
  useSchemaOrg([
    defineWebPage({
      name: schemaInput.webPage.name,
      description: schemaInput.webPage.description,
      url: schemaInput.webPage.url
    }),
    defineBreadcrumb({
      itemListElement: schemaInput.breadcrumb.itemListElement
    }),
    defineItemList({
      name: schemaInput.itemList.name,
      description: schemaInput.itemList.description,
      numberOfItems: schemaInput.itemList.numberOfItems,
      itemListElement: schemaInput.itemList.itemListElement
    }),
    ...schemaInput.products.map(product =>
      defineProduct({
        name: product.name,
        image: product.image,
        description: product.description,
        category: product.category,
        offers: product.offers
      })
    )
  ])
}
</script>

<template>
  <div class="site-preview">
    <header class="storefront-header">
      <UContainer class="storefront-header-inner">
        <NuxtLink :to="siteBasePath" class="storefront-brand">
          {{ site?.title }}
        </NuxtLink>

        <nav class="storefront-nav" aria-label="Storefront navigation">
          <a href="#collection">Collection</a>
          <a v-if="categories?.length" href="#categories">Categories</a>
          <a href="#features">Features</a>
          <a href="#guides">Guides</a>
          <a href="#faq">FAQ</a>
        </nav>

        <UButton
          to="/sites"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-left"
        >
          返回我的站点
        </UButton>
      </UContainer>
    </header>

    <main>
      <SiteTemplateRenderer
        v-if="site"
        :config="builderConfig"
        :site-title="site.title"
        :theme="site.theme"
        :status="site.status"
        :products="products"
        :categories="categories"
        :hero-product="heroProduct"
        :hero-image="heroImage"
      />
    </main>
  </div>
</template>

<style scoped>
.site-preview {
  min-height: 100vh;
  background: var(--ui-bg);
  color: var(--ui-text);
}

.storefront-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--ui-border);
  background: color-mix(in srgb, var(--ui-bg) 88%, transparent);
  backdrop-filter: blur(18px);
}

.storefront-header-inner {
  align-items: center;
  display: flex;
  gap: 1rem;
  min-height: 4rem;
}

.storefront-brand {
  color: var(--ui-text-highlighted);
  font-size: 1rem;
  font-weight: 700;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.storefront-nav {
  display: none;
  gap: 1.25rem;
  margin-left: auto;
  margin-right: 0.5rem;
}

.storefront-nav a {
  color: var(--ui-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.storefront-nav a:hover {
  color: var(--ui-text-highlighted);
}

@media (min-width: 768px) {
  .storefront-nav {
    display: flex;
  }
}
</style>
