<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { SiteBuilderConfig, SiteBuilderSection } from '#shared/utils'
import type {
  SiteArticleCard,
  SiteAction,
  SiteBrandFeature,
  SiteFaqCategory,
  SiteFaqItem,
  SiteLinkItem,
  SiteProduct,
  SiteTestimonial
} from './types'
import { getProductExternalUrl } from '#shared/utils'
import { getSectionActions, getSectionBadges, getSectionCategories, getSectionLinks, getSectionText } from './content'

const props = defineProps<{
  config: SiteBuilderConfig
  siteTitle: string
  theme: string
  status: string
  products: SiteProduct[]
  categories: string[]
  heroProduct: SiteProduct | null
  heroImage: string | null
}>()

const SiteGridLayout = defineAsyncComponent(() => import('~/components/site/GridLayout.vue'))
const SiteListLayout = defineAsyncComponent(() => import('~/components/site/ListLayout.vue'))
const SiteHeroLayout = defineAsyncComponent(() => import('~/components/site/HeroLayout.vue'))
const SiteTestimonialsSection = defineAsyncComponent(() => import('~/components/site/TestimonialsSection.vue'))
const SiteFaqSection = defineAsyncComponent(() => import('~/components/site/FaqSection.vue'))
const SiteArticlesSection = defineAsyncComponent(() => import('~/components/site/ArticlesSection.vue'))

const renderableSections = computed(() => props.config.sections.filter(section => section.kind !== 'storefront-header'))
const productCountLabel = computed(() => `${props.products.length} ${props.products.length === 1 ? 'product' : 'products'}`)
const heroProductUrl = computed(() => props.heroProduct ? getProductExternalUrl(props.heroProduct) : null)
const primaryCategory = computed(() => props.categories[0] || props.theme)
const brandFeatures = computed<SiteBrandFeature[]>(() => [
  {
    title: 'Curated from live product data',
    description: `Every section is generated from ${props.products.length || 'synced'} product records, categories, and platform links.`,
    icon: 'i-lucide-sparkles'
  },
  {
    title: 'Checkout stays on the source platform',
    description: 'Product CTAs preserve Amazon, Shopify, and marketplace URLs so shoppers can continue where inventory lives.',
    icon: 'i-lucide-external-link'
  },
  {
    title: 'Structured for SEO and GEO',
    description: 'Pages combine readable buying guidance with JSON-LD-ready product, FAQ, article, and organization signals.',
    icon: 'i-lucide-bot'
  }
])
const testimonials = computed<SiteTestimonial[]>(() => [
  {
    quote: `The ${primaryCategory.value} picks are easy to compare without losing the original product context.`,
    name: 'Research-first shopper',
    detail: 'Values side-by-side discovery'
  },
  {
    quote: 'The page feels like a brand storefront, not a scraped product feed.',
    name: 'Store operator',
    detail: 'Needs better product storytelling'
  },
  {
    quote: 'Clear categories and direct source links make the collection feel trustworthy.',
    name: 'Returning customer',
    detail: 'Checks availability before buying'
  }
])
const howToSteps = computed(() => [
  {
    title: 'Start with the hero pick',
    description: props.heroProduct
      ? `Use ${props.heroProduct.title} as the reference point for price, features, and use case.`
      : 'Use the featured product area to establish the collection standard.'
  },
  {
    title: 'Compare by category',
    description: props.categories.length
      ? `Scan ${props.categories.slice(0, 3).join(', ')} to narrow the collection.`
      : 'Scan the product cards by fit, price, and description.'
  },
  {
    title: 'Open the source listing',
    description: 'Use the product CTA to verify availability, shipping, variants, and checkout details on the original platform.'
  }
])
const faqItems = computed<SiteFaqItem[]>(() => [
  {
    label: 'Where does checkout happen?',
    content: 'Checkout happens on the original product platform. This generated site is optimized for discovery, comparison, SEO, and GEO visibility.'
  },
  {
    label: 'How fresh are these products?',
    content: 'Products come from connected store sync data. Re-sync the source store when inventory, price, or descriptions change.'
  },
  {
    label: 'Can this become a Shopify page?',
    content: 'Yes. The same structured modules can later map to Shopify pages, theme sections, or Metaobjects with matching SEO and JSON-LD payloads.'
  }
])
const articleCards = computed<SiteArticleCard[]>(() => [
  {
    title: `How to compare ${primaryCategory.value} products`,
    description: `A practical guide to reading product signals, price, source links, and category fit across ${props.products.length || 'your'} products.`,
    icon: 'i-lucide-newspaper',
    date: 'Updated today'
  },
  {
    title: 'What makes a GEO-ready product page',
    description: 'How structured content, FAQs, articles, and product schema help AI systems understand a storefront.',
    icon: 'i-lucide-search-check',
    date: 'SEO guide'
  },
  {
    title: 'When to re-sync your store catalog',
    description: 'Use re-syncs when price, stock, variants, vendor metadata, or product descriptions change upstream.',
    icon: 'i-lucide-refresh-cw',
    date: 'Operations'
  }
])
const socialLinks = computed<SiteLinkItem[]>(() => [
  {
    label: 'Instagram',
    icon: 'i-simple-icons-instagram',
    to: 'https://www.instagram.com/'
  },
  {
    label: 'TikTok',
    icon: 'i-simple-icons-tiktok',
    to: 'https://www.tiktok.com/'
  },
  {
    label: 'YouTube',
    icon: 'i-simple-icons-youtube',
    to: 'https://www.youtube.com/'
  }
])
const contactLinks = computed<SiteLinkItem[]>(() => [
  {
    label: 'Email support',
    icon: 'i-lucide-mail',
    to: 'mailto:hello@example.com'
  },
  {
    label: 'View collection',
    icon: 'i-lucide-layout-grid',
    to: '#collection'
  },
  {
    label: 'Read FAQ',
    icon: 'i-lucide-circle-help',
    to: '#faq'
  }
])
const defaultHeroActions = computed<SiteAction[]>(() => [
  {
    label: 'Shop collection',
    to: '#collection',
    color: 'primary',
    variant: 'solid',
    icon: 'i-lucide-arrow-down'
  },
  ...(heroProductUrl.value
    ? [{
        label: 'Featured item',
        to: heroProductUrl.value,
        color: 'neutral' as const,
        variant: 'solid' as const,
        icon: 'i-lucide-arrow-up-right',
        target: '_blank',
        external: true
      }]
    : [])
])
const defaultTrustBadges = ['Nuxt UI', 'Product schema', 'Shopify-ready']
const defaultContactActions = computed<SiteAction[]>(() => [
  {
    label: 'View products',
    to: '#collection',
    color: 'primary',
    variant: 'solid',
    icon: 'i-lucide-shopping-bag'
  },
  {
    label: 'Contact us',
    to: 'mailto:hello@example.com',
    color: 'neutral',
    variant: 'outline',
    icon: 'i-lucide-mail'
  }
])
const defaultProductCtaActions = computed<SiteAction[]>(() => [
  {
    label: 'Compare products',
    to: '#collection',
    color: 'primary',
    variant: 'solid',
    icon: 'i-lucide-layout-grid'
  },
  ...(heroProductUrl.value
    ? [{
        label: 'Open featured item',
        to: heroProductUrl.value,
        color: 'neutral' as const,
        variant: 'outline' as const,
        icon: 'i-lucide-arrow-up-right',
        target: '_blank',
        external: true
      }]
    : [])
])

function contentArray<T>(section: SiteBuilderSection, key: string, fallback: T[]) {
  const value = section.content?.[key]

  return Array.isArray(value) ? value as T[] : fallback
}

function sectionFeatures(section: SiteBuilderSection): SiteBrandFeature[] {
  return contentArray(section, 'features', brandFeatures.value)
}

function sectionTestimonials(section: SiteBuilderSection): SiteTestimonial[] {
  return contentArray(section, 'testimonials', testimonials.value)
}

function sectionSteps(section: SiteBuilderSection) {
  return contentArray(section, 'steps', howToSteps.value)
}

function sectionFaqs(section: SiteBuilderSection): SiteFaqItem[] {
  return contentArray(section, 'faqs', faqItems.value)
}

function sectionFaqCategories(section: SiteBuilderSection): SiteFaqCategory[] {
  const categories = contentArray<SiteFaqCategory>(section, 'categories', [])

  if (categories.length > 0)
    return categories

  return [
    {
      label: 'Shopping',
      key: 'shopping',
      questions: sectionFaqs(section)
    }
  ]
}

function sectionArticles(section: SiteBuilderSection): SiteArticleCard[] {
  return contentArray(section, 'articles', articleCards.value)
}

function sectionLinks(section: SiteBuilderSection, fallback: SiteLinkItem[]): SiteLinkItem[] {
  return contentArray(section, 'links', fallback)
}

function sectionText(section: SiteBuilderSection, key: string, fallback: string) {
  return getSectionText(section, key, fallback)
}

function sectionBadges(section: SiteBuilderSection, fallback: string[]) {
  return getSectionBadges(section, fallback)
}

function sectionCategories(section: SiteBuilderSection, fallback: string[]) {
  return getSectionCategories(section, fallback)
}

function sectionLinkItems(section: SiteBuilderSection, fallback: SiteLinkItem[]) {
  return getSectionLinks(section, fallback)
}

function sectionActions(section: SiteBuilderSection, fallback: SiteAction[]) {
  return getSectionActions(section, fallback)
}

function sectionProducts(section: SiteBuilderSection) {
  if (section.productMode === 'featured')
    return props.heroProduct ? [props.heroProduct] : []

  if (section.productMode === 'remaining')
    return props.products.slice(1, section.maxProducts ? section.maxProducts + 1 : undefined)

  return section.maxProducts ? props.products.slice(0, section.maxProducts) : props.products
}

function shouldRenderSection(section: SiteBuilderSection) {
  if (section.kind === 'category-strip')
    return sectionCategories(section, props.categories).length > 0

  if (['product-grid', 'product-list', 'featured-product'].includes(section.kind))
    return props.products.length > 0

  return true
}
</script>

<template>
  <template
    v-for="section in renderableSections"
    :key="section.id"
  >
    <section
      v-if="shouldRenderSection(section)"
      :id="section.anchor"
      class="template-section"
      :class="`template-section--${section.kind}`"
    >
      <template v-if="section.kind === 'commerce-hero'">
        <div class="storefront-hero" :class="{ 'storefront-hero--image': heroImage }">
          <img
            v-if="heroImage"
            :src="heroImage"
            :alt="heroProduct?.title || siteTitle"
            class="storefront-hero-image"
          >
          <div class="storefront-hero-overlay" />

          <UContainer class="storefront-hero-content">
            <div class="storefront-hero-copy">
              <div class="hero-badges">
                <UBadge v-if="status === 'draft'" color="warning" variant="soft">
                  Draft
                </UBadge>
                <UBadge color="primary" variant="soft">
                  {{ productCountLabel }}
                </UBadge>
              </div>

              <h1 class="storefront-title">
                {{ section.title || siteTitle }}
              </h1>
              <p class="storefront-description">
                {{ section.description || theme }}
              </p>

              <div class="storefront-actions">
                <UButton
                  v-for="action in sectionActions(section, defaultHeroActions)"
                  :key="action.label"
                  :to="action.to"
                  :target="action.target"
                  :external="action.external"
                  :color="action.color || 'primary'"
                  :variant="action.variant || 'solid'"
                  size="xl"
                  :trailing-icon="action.icon"
                >
                  {{ action.label }}
                </UButton>
              </div>
            </div>
          </UContainer>
        </div>
      </template>

      <UContainer v-else-if="section.kind === 'category-strip'">
        <div class="category-shell">
          <div>
            <UBadge color="neutral" variant="soft">
              {{ section.title }}
            </UBadge>
            <p v-if="section.description" class="category-description">
              {{ section.description }}
            </p>
          </div>

          <div class="category-strip" aria-label="Collection categories">
            <UBadge
              v-for="category in sectionCategories(section, categories)"
              :key="category"
              color="neutral"
              variant="soft"
              size="lg"
            >
              {{ category }}
            </UBadge>
          </div>
        </div>
      </UContainer>

      <UContainer v-else-if="section.kind === 'product-grid'">
        <SiteGridLayout :products="sectionProducts(section)" />
      </UContainer>

      <UContainer v-else-if="section.kind === 'product-list'">
        <SiteListLayout :products="sectionProducts(section)" />
      </UContainer>

      <UContainer v-else-if="section.kind === 'featured-product'">
        <SiteHeroLayout :products="sectionProducts(section)" />
      </UContainer>

      <UContainer v-else-if="section.kind === 'trust-strip'">
        <div class="trust-strip">
          <UCard
            class="trust-card"
            :ui="{ body: 'p-5 sm:p-6' }"
          >
            <div class="trust-content">
              <div>
                <UBadge color="primary" variant="soft">
                  {{ section.title }}
                </UBadge>
                <p class="trust-copy">
                  {{ sectionText(section, 'body', 'Product cards keep source-platform links, SEO text, and JSON-LD aligned for GEO-ready storefronts.') }}
                </p>
              </div>
              <div class="trust-pills">
                <UBadge
                  v-for="badge in sectionBadges(section, defaultTrustBadges)"
                  :key="badge"
                  color="neutral"
                  variant="soft"
                >
                  {{ badge }}
                </UBadge>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>

      <UPageSection
        v-else-if="section.kind === 'brand-features'"
        :title="section.title"
        :description="section.description"
      >
        <UPageGrid>
          <UPageFeature
            v-for="feature in sectionFeatures(section)"
            :key="feature.title"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
          />
        </UPageGrid>
      </UPageSection>

      <SiteTestimonialsSection
        v-else-if="section.kind === 'testimonials'"
        :title="section.title"
        :description="section.description"
        :testimonials="sectionTestimonials(section)"
      />

      <UPageSection
        v-else-if="section.kind === 'about-brand'"
        :title="section.title"
        :description="section.description"
      >
        <UPageColumns>
          <UPageFeature
            v-for="feature in sectionFeatures(section)"
            :key="feature.title"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
          />
        </UPageColumns>
      </UPageSection>

      <UPageSection
        v-else-if="section.kind === 'how-to'"
        :title="section.title"
        :description="section.description"
      >
        <div class="howto-list">
          <UPageFeature
            v-for="(step, index) in sectionSteps(section)"
            :key="step.title"
            :title="`${index + 1}. ${step.title}`"
            :description="step.description"
            icon="i-lucide-list-checks"
          />
        </div>
      </UPageSection>

      <SiteFaqSection
        v-else-if="section.kind === 'faq'"
        :title="section.title"
        :description="section.description"
        :categories="sectionFaqCategories(section)"
      />

      <SiteArticlesSection
        v-else-if="section.kind === 'blog-list'"
        :title="section.title"
        :description="section.description"
        :articles="sectionArticles(section)"
      />

      <UPageSection
        v-else-if="section.kind === 'social-links'"
        :title="section.title"
        :description="section.description"
      >
        <UPageGrid>
          <UPageCard
            v-for="link in sectionLinkItems(section, socialLinks)"
            :key="link.label"
            :title="link.label"
            :description="link.description"
            :icon="link.icon"
            :to="link.to"
            :target="link.external ? '_blank' : undefined"
            :external="link.external"
          />
        </UPageGrid>
      </UPageSection>

      <UPageSection
        v-else-if="section.kind === 'contact'"
        :title="section.title"
        :description="section.description"
        :ui="{
          container: 'px-0 pt-0! sm:gap-6 lg:gap-8',
          title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
          description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
        }"
      >
        <UPageCTA
          :title="sectionText(section, 'ctaTitle', section.title)"
          :description="sectionText(section, 'ctaDescription', section.description || 'Ask for a tailored recommendation or jump back into the product collection.')"
          variant="naked"
          class="rounded-lg bg-elevated/50"
          :ui="{
            container: 'sm:py-10 lg:py-10 sm:gap-6'
          }"
        >
          <template #links>
            <UButton
              v-for="action in sectionActions(section, defaultContactActions)"
              :key="action.label"
              :to="action.to"
              :target="action.target"
              :external="action.external"
              :color="action.color || 'primary'"
              :variant="action.variant || 'solid'"
              size="lg"
              :icon="action.icon"
            >
              {{ action.label }}
            </UButton>
          </template>
        </UPageCTA>
        <UPageLinks :links="sectionLinks(section, contactLinks)" class="contact-links" />
      </UPageSection>

      <UPageSection
        v-else-if="section.kind === 'product-cta'"
        :title="section.title"
        :description="section.description"
      >
        <UPageCTA
          :title="sectionText(section, 'ctaTitle', section.title)"
          :description="sectionText(section, 'ctaDescription', section.description || '')"
        >
          <template #links>
            <UButton
              v-for="action in sectionActions(section, defaultProductCtaActions)"
              :key="action.label"
              :to="action.to"
              :target="action.target"
              :external="action.external"
              :color="action.color || 'primary'"
              :variant="action.variant || 'solid'"
              size="lg"
              :icon="action.icon"
            >
              {{ action.label }}
            </UButton>
          </template>
        </UPageCTA>
      </UPageSection>
    </section>
  </template>

  <UContainer v-if="products.length === 0">
    <UEmpty
      icon="i-heroicons-inbox"
      title="No products available"
      description="This collection does not have synced products yet."
      class="py-20"
    />
  </UContainer>
</template>

<style scoped>
.template-section {
  scroll-margin-top: 4rem;
}

.storefront-hero {
  align-items: end;
  border-bottom: 1px solid var(--ui-border);
  display: flex;
  min-height: min(760px, calc(100vh - 4rem));
  overflow: hidden;
  position: relative;
}

.storefront-hero:not(.storefront-hero--image) {
  background: var(--ui-bg-muted);
}

.storefront-hero-image {
  height: 100%;
  inset: 0;
  object-fit: cover;
  position: absolute;
  width: 100%;
}

.storefront-hero-overlay {
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--ui-bg) 92%, transparent) 0%, color-mix(in srgb, var(--ui-bg) 72%, transparent) 44%, transparent 100%),
    linear-gradient(0deg, color-mix(in srgb, var(--ui-bg) 88%, transparent) 0%, transparent 46%);
  inset: 0;
  position: absolute;
}

.storefront-hero-content {
  padding-block: 5rem 4rem;
  position: relative;
  width: 100%;
}

.storefront-hero-copy {
  max-width: 42rem;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.storefront-title {
  color: var(--ui-text-highlighted);
  font-size: clamp(2.75rem, 9vw, 6.5rem);
  font-weight: 800;
  line-height: 0.95;
  margin-top: 1rem;
}

.storefront-description {
  color: var(--ui-text-muted);
  font-size: 1.125rem;
  line-height: 1.8;
  margin-top: 1.25rem;
  max-width: 38rem;
}

.storefront-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.category-shell {
  border-bottom: 1px solid var(--ui-border-muted);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: 2rem 1.25rem;
}

.category-description {
  color: var(--ui-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-top: 0.5rem;
}

.category-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.trust-strip {
  padding-block: 0 4rem;
}

.trust-card {
  border-radius: 0.5rem;
}

.trust-content {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
}

.trust-copy {
  color: var(--ui-text-muted);
  line-height: 1.7;
  margin-top: 0.75rem;
  max-width: 42rem;
}

.trust-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.howto-list {
  display: grid;
  gap: 1rem;
}

.contact-links {
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .storefront-hero-content {
    padding-block: 7rem 5rem;
  }

  .category-shell,
  .trust-content {
    align-items: center;
    flex-direction: row;
  }
}
</style>
