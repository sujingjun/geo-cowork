import { z } from 'zod'

export const SITE_TEMPLATES = ['grid', 'list', 'hero'] as const
export const SITE_SECTION_KINDS = [
  'storefront-header',
  'commerce-hero',
  'category-strip',
  'product-grid',
  'product-list',
  'featured-product',
  'trust-strip',
  'brand-features',
  'testimonials',
  'about-brand',
  'how-to',
  'faq',
  'blog-list',
  'social-links',
  'contact',
  'product-cta'
] as const

export type SiteTemplate = typeof SITE_TEMPLATES[number]
export type SiteSectionKind = typeof SITE_SECTION_KINDS[number]

export interface SiteBuilderComponentDefinition {
  name: string
  category: 'nuxt-ui' | 'product'
  role: string
  source: 'official-nuxt-ui' | 'site-product'
  allowedSections: SiteSectionKind[]
}

export interface SiteBuilderSection {
  id: string
  kind: SiteSectionKind
  title: string
  description?: string
  components: string[]
  content?: Record<string, unknown>
  productMode?: 'all' | 'featured' | 'remaining'
  maxProducts?: number
  anchor?: string
}

export interface SiteBuilderConfig {
  version: 1
  template: SiteTemplate
  summary: string
  components: {
    nuxtUi: string[]
    product: string[]
  }
  composables: string[]
  sections: SiteBuilderSection[]
}

export interface BuildDefaultSiteBuilderConfigInput {
  template: SiteTemplate | string | null | undefined
  title: string
  theme: string
  productCount: number
  categories: string[]
}

export interface SiteBuilderProductInput {
  title: string
  description?: string | null
  category?: string | null
  platform?: string | null
  vendor?: string | null
  productType?: string | null
  tags?: string[] | null
}

export const NUXT_UI_SITE_COMPONENTS: SiteBuilderComponentDefinition[] = [
  {
    name: 'UHeader',
    category: 'nuxt-ui',
    role: 'Responsive storefront navigation shell',
    source: 'official-nuxt-ui',
    allowedSections: ['storefront-header']
  },
  {
    name: 'UContainer',
    category: 'nuxt-ui',
    role: 'Constrain and center section content',
    source: 'official-nuxt-ui',
    allowedSections: [...SITE_SECTION_KINDS]
  },
  {
    name: 'UMain',
    category: 'nuxt-ui',
    role: 'Primary document landmark for generated storefronts',
    source: 'official-nuxt-ui',
    allowedSections: [...SITE_SECTION_KINDS]
  },
  {
    name: 'UPageHero',
    category: 'nuxt-ui',
    role: 'Responsive landing hero structure',
    source: 'official-nuxt-ui',
    allowedSections: ['commerce-hero']
  },
  {
    name: 'UPageSection',
    category: 'nuxt-ui',
    role: 'Reusable responsive page band',
    source: 'official-nuxt-ui',
    allowedSections: ['category-strip', 'product-grid', 'product-list', 'featured-product', 'trust-strip', 'brand-features', 'testimonials', 'about-brand', 'how-to', 'faq', 'blog-list', 'social-links', 'contact', 'product-cta']
  },
  {
    name: 'UPageFeature',
    category: 'nuxt-ui',
    role: 'Brand value proposition and service feature rows',
    source: 'official-nuxt-ui',
    allowedSections: ['brand-features', 'how-to', 'about-brand']
  },
  {
    name: 'UPageCard',
    category: 'nuxt-ui',
    role: 'Editorial, testimonial, FAQ, and contact content cards',
    source: 'official-nuxt-ui',
    allowedSections: ['testimonials', 'faq', 'blog-list', 'contact', 'social-links']
  },
  {
    name: 'UPageColumns',
    category: 'nuxt-ui',
    role: 'Responsive columns for brand story, proof, and contact blocks',
    source: 'official-nuxt-ui',
    allowedSections: ['brand-features', 'testimonials', 'about-brand', 'contact']
  },
  {
    name: 'UPageCTA',
    category: 'nuxt-ui',
    role: 'Conversion section for platform-aware shopping and contact actions',
    source: 'official-nuxt-ui',
    allowedSections: ['product-cta', 'contact']
  },
  {
    name: 'UPageGrid',
    category: 'nuxt-ui',
    role: 'Responsive product-card grid',
    source: 'official-nuxt-ui',
    allowedSections: ['product-grid', 'brand-features', 'testimonials', 'faq', 'blog-list', 'social-links']
  },
  {
    name: 'UPageList',
    category: 'nuxt-ui',
    role: 'Stacked product comparison list',
    source: 'official-nuxt-ui',
    allowedSections: ['product-list', 'how-to', 'blog-list']
  },
  {
    name: 'UPageLinks',
    category: 'nuxt-ui',
    role: 'Structured social, editorial, and support link groups',
    source: 'official-nuxt-ui',
    allowedSections: ['social-links', 'contact', 'blog-list']
  },
  {
    name: 'UCard',
    category: 'nuxt-ui',
    role: 'Elevated commerce content container',
    source: 'official-nuxt-ui',
    allowedSections: ['product-grid', 'product-list', 'featured-product', 'trust-strip', 'brand-features', 'testimonials', 'about-brand', 'how-to', 'faq', 'blog-list', 'social-links', 'contact', 'product-cta']
  },
  {
    name: 'UButton',
    category: 'nuxt-ui',
    role: 'Primary and secondary commerce calls to action',
    source: 'official-nuxt-ui',
    allowedSections: ['commerce-hero', 'product-grid', 'product-list', 'featured-product', 'about-brand', 'blog-list', 'social-links', 'contact', 'product-cta']
  },
  {
    name: 'UBadge',
    category: 'nuxt-ui',
    role: 'Category, status, and merchandising labels',
    source: 'official-nuxt-ui',
    allowedSections: ['commerce-hero', 'category-strip', 'product-grid', 'product-list', 'featured-product', 'trust-strip', 'brand-features', 'testimonials', 'about-brand', 'how-to', 'faq', 'blog-list', 'social-links', 'contact', 'product-cta']
  },
  {
    name: 'UAccordion',
    category: 'nuxt-ui',
    role: 'Accessible FAQ and HowTo disclosure groups',
    source: 'official-nuxt-ui',
    allowedSections: ['faq', 'how-to']
  },
  {
    name: 'UEmpty',
    category: 'nuxt-ui',
    role: 'Empty catalog state',
    source: 'official-nuxt-ui',
    allowedSections: ['product-grid', 'product-list', 'featured-product']
  }
]

export const PRODUCT_SITE_COMPONENTS: SiteBuilderComponentDefinition[] = [
  {
    name: 'SiteBrandFeatureGrid',
    category: 'product',
    role: 'Reusable brand promise grid for generated storefronts',
    source: 'site-product',
    allowedSections: ['brand-features']
  },
  {
    name: 'SiteEditorialSection',
    category: 'product',
    role: 'Reusable story, article, FAQ, and contact composition helpers',
    source: 'site-product',
    allowedSections: ['testimonials', 'about-brand', 'how-to', 'faq', 'blog-list', 'social-links', 'contact']
  },
  {
    name: 'SiteProductCard',
    category: 'product',
    role: 'Reusable product card with platform-aware CTA',
    source: 'site-product',
    allowedSections: ['product-grid', 'featured-product']
  },
  {
    name: 'SiteGridLayout',
    category: 'product',
    role: 'Dense product card collection',
    source: 'site-product',
    allowedSections: ['product-grid']
  },
  {
    name: 'SiteListLayout',
    category: 'product',
    role: 'Buying-guide comparison layout',
    source: 'site-product',
    allowedSections: ['product-list']
  },
  {
    name: 'SiteHeroLayout',
    category: 'product',
    role: 'Featured product storytelling layout',
    source: 'site-product',
    allowedSections: ['featured-product']
  }
]

export const SITE_BUILDER_COMPOSABLES = [
  {
    name: 'useSeoMeta',
    role: 'Generate page-level SEO metadata for platform-aware storefronts'
  },
  {
    name: 'useHead',
    role: 'Publish canonical links and structured data script tags'
  },
  {
    name: 'useSchemaOrg',
    role: 'Publish JSON-LD WebPage, Breadcrumb, ItemList, and Product schemas'
  },
  {
    name: 'useScrollspy',
    role: 'Enable anchor-aware navigation for longer generated templates'
  },
  {
    name: 'useToast',
    role: 'Surface actionable authoring and sync feedback in admin views'
  }
]

const allowedComponentNames = new Set([
  ...NUXT_UI_SITE_COMPONENTS.map(component => component.name),
  ...PRODUCT_SITE_COMPONENTS.map(component => component.name)
])
const componentDefinitions = [
  ...NUXT_UI_SITE_COMPONENTS,
  ...PRODUCT_SITE_COMPONENTS
]
const allowedSectionKinds = new Set<SiteSectionKind>(SITE_SECTION_KINDS)
const allowedTemplates = new Set<SiteTemplate>(SITE_TEMPLATES)

export const siteBuilderSectionSchema = z.object({
  id: z.string().min(1).max(64),
  kind: z.enum(SITE_SECTION_KINDS),
  title: z.string().min(1).max(120),
  description: z.string().max(240).optional(),
  components: z.array(z.string()).min(1).max(8),
  content: z.record(z.string(), z.unknown()).optional(),
  productMode: z.enum(['all', 'featured', 'remaining']).optional(),
  maxProducts: z.number().int().positive().max(24).optional(),
  anchor: z.string().min(1).max(64).optional()
})

export const siteBuilderConfigSchema = z.object({
  version: z.literal(1).default(1),
  template: z.enum(SITE_TEMPLATES),
  summary: z.string().min(1).max(240),
  components: z.object({
    nuxtUi: z.array(z.string()).max(16).default([]),
    product: z.array(z.string()).max(16).default([])
  }).default({ nuxtUi: [], product: [] }),
  composables: z.array(z.string()).max(12).default([]),
  sections: z.array(siteBuilderSectionSchema).min(1).max(12)
})

const looseSiteBuilderSectionSchema = z.object({
  id: z.string().min(1).max(64),
  kind: z.string().min(1).max(64),
  title: z.string().min(1).max(120),
  description: z.string().max(240).optional(),
  components: z.array(z.string()).min(1).max(8),
  content: z.record(z.string(), z.unknown()).optional(),
  productMode: z.enum(['all', 'featured', 'remaining']).optional(),
  maxProducts: z.number().int().positive().max(24).optional(),
  anchor: z.string().min(1).max(64).optional()
})

const looseSiteBuilderConfigSchema = z.object({
  version: z.literal(1).optional(),
  template: z.enum(SITE_TEMPLATES),
  summary: z.string().min(1).max(240).optional(),
  components: z.object({
    nuxtUi: z.array(z.string()).max(16).default([]),
    product: z.array(z.string()).max(16).default([])
  }).optional(),
  composables: z.array(z.string()).max(12).default([]),
  sections: z.array(looseSiteBuilderSectionSchema).min(1).max(12)
})

export function isSiteTemplate(template: string | null | undefined): template is SiteTemplate {
  return Boolean(template && allowedTemplates.has(template as SiteTemplate))
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values))
}

function buildComponentsFromSections(sections: SiteBuilderSection[]) {
  const allComponents = uniqueValues(sections.flatMap(section => section.components))

  return {
    nuxtUi: allComponents.filter(component => NUXT_UI_SITE_COMPONENTS.some(item => item.name === component)),
    product: allComponents.filter(component => PRODUCT_SITE_COMPONENTS.some(item => item.name === component))
  }
}

function isComponentAllowedInSection(componentName: string, sectionKind: SiteSectionKind) {
  const definition = componentDefinitions.find(component => component.name === componentName)

  return Boolean(definition?.allowedSections.includes(sectionKind))
}

function createBaseSections(input: BuildDefaultSiteBuilderConfigInput, template: SiteTemplate): SiteBuilderSection[] {
  const categoryDescription = input.categories.length
    ? `Filter the collection by ${input.categories.slice(0, 3).join(', ')}.`
    : 'Highlight the most useful shopping paths in this collection.'

  const shared: SiteBuilderSection[] = [
    {
      id: 'header',
      kind: 'storefront-header',
      title: 'Storefront navigation',
      components: ['UHeader', 'UContainer', 'UButton'],
      anchor: 'top'
    },
    {
      id: 'hero',
      kind: 'commerce-hero',
      title: input.title,
      description: input.theme,
      components: ['UPageHero', 'UContainer', 'UBadge', 'UButton'],
      productMode: 'featured',
      maxProducts: 1
    },
    {
      id: 'categories',
      kind: 'category-strip',
      title: 'Shop by category',
      description: categoryDescription,
      components: ['UPageSection', 'UContainer', 'UBadge'],
      anchor: 'categories'
    }
  ]

  if (template === 'list') {
    return [
      ...shared,
      {
        id: 'collection',
        kind: 'product-list',
        title: 'Compare the collection',
        description: `${input.productCount} products arranged as a buying guide.`,
        components: ['UPageSection', 'UPageList', 'UCard', 'SiteListLayout'],
        productMode: 'all',
        anchor: 'collection'
      },
      {
        id: 'trust',
        kind: 'trust-strip',
        title: 'Built for confident comparison',
        components: ['UPageSection', 'UContainer', 'UBadge']
      },
      {
        id: 'features',
        kind: 'brand-features',
        title: 'Why shoppers choose this edit',
        description: 'Use Nuxt UI feature blocks to explain product fit, sourcing context, and post-purchase confidence.',
        components: ['UPageSection', 'UPageGrid', 'UPageFeature', 'UBadge', 'SiteBrandFeatureGrid'],
        anchor: 'features'
      },
      {
        id: 'faq',
        kind: 'faq',
        title: 'Shopping questions',
        description: 'Answers for availability, platform checkout, and product selection.',
        components: ['UPageSection', 'UPageGrid', 'UPageCard', 'UAccordion', 'SiteEditorialSection'],
        anchor: 'faq'
      },
      {
        id: 'contact',
        kind: 'contact',
        title: 'Need help choosing?',
        description: 'Contact and social links for the generated brand storefront.',
        components: ['UPageSection', 'UPageCTA', 'UPageLinks', 'UButton', 'SiteEditorialSection'],
        anchor: 'contact'
      }
    ]
  }

  if (template === 'hero') {
    return [
      ...shared,
      {
        id: 'featured',
        kind: 'featured-product',
        title: 'Featured product story',
        description: 'Lead with one hero product and support it with complementary picks.',
        components: ['UPageSection', 'UCard', 'UButton', 'SiteHeroLayout'],
        productMode: 'all',
        anchor: 'collection'
      },
      {
        id: 'trust',
        kind: 'trust-strip',
        title: 'Platform-aware merchandising',
        components: ['UPageSection', 'UContainer', 'UBadge']
      },
      {
        id: 'about',
        kind: 'about-brand',
        title: 'About this product story',
        description: 'A brand narrative block designed for Shopify pages, theme sections, or future metaobject write-back.',
        components: ['UPageSection', 'UPageColumns', 'UPageFeature', 'UButton', 'SiteEditorialSection'],
        anchor: 'about'
      },
      {
        id: 'how-to',
        kind: 'how-to',
        title: 'How to choose from this collection',
        description: 'A structured buying path that can be exported as HowTo JSON-LD.',
        components: ['UPageSection', 'UPageList', 'UPageFeature', 'UAccordion', 'SiteEditorialSection'],
        anchor: 'how-to'
      },
      {
        id: 'social',
        kind: 'social-links',
        title: 'Follow the brand signals',
        description: 'Structured external links for social proof and marketplace discovery.',
        components: ['UPageSection', 'UPageGrid', 'UPageCard', 'UPageLinks', 'SiteEditorialSection'],
        anchor: 'social'
      }
    ]
  }

  return [
    ...shared,
    {
      id: 'collection',
      kind: 'product-grid',
      title: 'Shop the edit',
      description: `${input.productCount} products arranged as responsive commerce cards.`,
      components: ['UPageSection', 'UPageGrid', 'UCard', 'SiteGridLayout'],
      productMode: 'all',
      anchor: 'collection'
    },
    {
      id: 'trust',
      kind: 'trust-strip',
      title: 'Fresh picks from connected stores',
      components: ['UPageSection', 'UContainer', 'UBadge']
    },
    {
      id: 'features',
      kind: 'brand-features',
      title: 'Built for product discovery',
      description: 'Feature modules explain selection logic, platform checkout, and buyer confidence.',
      components: ['UPageSection', 'UPageGrid', 'UPageFeature', 'UBadge', 'SiteBrandFeatureGrid'],
      anchor: 'features'
    },
    {
      id: 'testimonials',
      kind: 'testimonials',
      title: 'What customers notice',
      description: 'Social proof cards for generated brand storefronts.',
      components: ['UPageSection', 'UPageColumns', 'UPageCard', 'UBadge', 'SiteEditorialSection'],
      anchor: 'reviews'
    },
    {
      id: 'blog',
      kind: 'blog-list',
      title: 'Latest buying guides',
      description: 'Editorial article cards that support SEO, GEO, and Shopify content expansion.',
      components: ['UPageSection', 'UPageGrid', 'UPageCard', 'UPageLinks', 'SiteEditorialSection'],
      anchor: 'guides'
    },
    {
      id: 'cta',
      kind: 'product-cta',
      title: 'Ready to compare the collection?',
      description: 'Open the source products, save your shortlist, or request a tailored recommendation.',
      components: ['UPageSection', 'UPageCTA', 'UButton'],
      anchor: 'contact'
    }
  ]
}

function topValues(values: Array<string | null | undefined>, limit = 3) {
  return uniqueValues(values.filter((value): value is string => Boolean(value))).slice(0, limit)
}

function productKeywords(products: SiteBuilderProductInput[]) {
  const words = products
    .flatMap(product => [product.title, product.description || '', product.category || '', product.productType || '', product.vendor || ''])
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4 && !['with', 'from', 'generation', 'product'].includes(word))

  return topValues(words, 6)
}

export function buildProductDrivenSiteBuilderConfig(
  input: BuildDefaultSiteBuilderConfigInput & { products: SiteBuilderProductInput[], userIntent?: string | null }
): SiteBuilderConfig {
  const baseConfig = buildDefaultSiteBuilderConfig(input)
  const categories = topValues(input.products.map(product => product.category), 4)
  const platforms = topValues(input.products.map(product => product.platform), 3)
  const vendors = topValues(input.products.map(product => product.vendor), 3)
  const keywords = productKeywords(input.products)
  const primaryCategory = categories[0] || input.categories[0] || input.theme
  const featuredProduct = input.products[0]
  const intent = input.userIntent || input.theme

  const sections = baseConfig.sections.map((section) => {
    if (section.kind === 'brand-features') {
      return {
        ...section,
        content: {
          features: [
            {
              title: `${primaryCategory} picks with a clear point of view`,
              description: `Selected around ${intent}, with category signals from ${categories.join(', ') || 'the synced catalog'}.`,
              icon: 'i-lucide-sparkles'
            },
            {
              title: platforms.length ? `Source links preserved for ${platforms.join(' + ')}` : 'Source links preserved',
              description: 'Each product keeps its original platform URL so shoppers can verify availability, variants, and checkout details.',
              icon: 'i-lucide-external-link'
            },
            {
              title: 'Built for SEO and GEO interpretation',
              description: `Structured modules highlight ${keywords.slice(0, 3).join(', ') || 'product fit'} so search engines and AI systems can understand the page.`,
              icon: 'i-lucide-bot'
            }
          ]
        }
      }
    }

    if (section.kind === 'testimonials') {
      return {
        ...section,
        content: {
          testimonials: [
            {
              name: 'Comparison-focused shopper',
              detail: primaryCategory,
              quote: `The ${primaryCategory} collection makes it easier to compare product fit without losing source-platform details.`
            },
            {
              name: 'Brand operator',
              detail: vendors.length ? vendors.join(', ') : 'Catalog storytelling',
              quote: 'The page reads like a brand storefront while staying grounded in synced product data.'
            },
            {
              name: 'Returning customer',
              detail: platforms.length ? platforms.join(' + ') : 'Connected stores',
              quote: 'Clear categories, source links, and buying guides make the collection feel trustworthy.'
            }
          ]
        }
      }
    }

    if (section.kind === 'about-brand') {
      return {
        ...section,
        content: {
          features: [
            {
              title: `${input.title} is shaped by real catalog data`,
              description: `This brand story uses ${input.productCount} products, ${categories.join(', ') || 'category'} signals, and the user requirement: ${intent}.`,
              icon: 'i-lucide-store'
            },
            {
              title: 'Prepared for Shopify write-back',
              description: 'The same module content can map to Shopify pages, theme sections, or Metaobjects with matching SEO and JSON-LD.',
              icon: 'i-lucide-panels-top-left'
            }
          ]
        }
      }
    }

    if (section.kind === 'how-to') {
      return {
        ...section,
        content: {
          steps: [
            {
              title: featuredProduct ? `Start with ${featuredProduct.title}` : 'Start with the featured product',
              description: 'Use the hero pick as the reference point for use case, price, and product promise.'
            },
            {
              title: `Compare by ${primaryCategory}`,
              description: categories.length ? `Scan ${categories.join(', ')} to narrow the collection.` : 'Compare product cards by fit, description, and price.'
            },
            {
              title: 'Open the source listing',
              description: 'Verify availability, shipping, variants, and checkout details on the original platform.'
            }
          ]
        }
      }
    }

    if (section.kind === 'faq') {
      return {
        ...section,
        content: {
          faqs: [
            {
              label: 'Why were these products selected?',
              content: `They match ${intent} and share signals around ${primaryCategory}.`
            },
            {
              label: 'Where does checkout happen?',
              content: platforms.length ? `Checkout happens on the original ${platforms.join(' or ')} listing.` : 'Checkout happens on the original product platform.'
            },
            {
              label: 'Can this module be changed later?',
              content: 'Yes. Ask to update a section by name, such as FAQ, testimonials, HowTo, article list, contact, or brand features.'
            }
          ]
        }
      }
    }

    if (section.kind === 'blog-list') {
      return {
        ...section,
        content: {
          articles: [
            {
              title: `How to compare ${primaryCategory} products`,
              description: `A practical guide to reading ${keywords.slice(0, 3).join(', ') || 'product'} signals across this collection.`,
              icon: 'i-lucide-newspaper'
            },
            {
              title: `${input.title} buying checklist`,
              description: `What to verify before buying: fit, platform, availability, variants, and source listing details.`,
              icon: 'i-lucide-list-checks'
            },
            {
              title: 'What makes a GEO-ready product page',
              description: 'How structured modules, FAQs, articles, and product schema help AI systems understand a storefront.',
              icon: 'i-lucide-search-check'
            }
          ]
        }
      }
    }

    return section
  })

  return {
    ...baseConfig,
    summary: `${baseConfig.summary} Content is derived from product attributes and user intent.`,
    components: buildComponentsFromSections(sections),
    sections
  }
}

export function buildDefaultSiteBuilderConfig(input: BuildDefaultSiteBuilderConfigInput): SiteBuilderConfig {
  const template = isSiteTemplate(input.template) ? input.template : 'grid'
  const sections = createBaseSections(input, template)

  return {
    version: 1,
    template,
    summary: `Composable Nuxt UI storefront for ${input.title} using ${template} product merchandising.`,
    components: buildComponentsFromSections(sections),
    composables: ['useSeoMeta', 'useHead', 'useSchemaOrg', 'useScrollspy'],
    sections
  }
}

export function normalizeSiteBuilderConfig(input: unknown, fallback: SiteBuilderConfig): SiteBuilderConfig {
  const parsed = looseSiteBuilderConfigSchema.safeParse(input)

  if (!parsed.success)
    return fallback

  const sections = parsed.data.sections
    .filter((section): section is typeof section & { kind: SiteSectionKind } => allowedSectionKinds.has(section.kind as SiteSectionKind))
    .map((section) => {
      const components = uniqueValues(section.components.filter(component =>
        allowedComponentNames.has(component) && isComponentAllowedInSection(component, section.kind)
      ))

      return {
        ...section,
        components
      }
    })
    .filter(section => section.components.length > 0)

  if (sections.length === 0)
    return fallback

  return {
    version: 1,
    template: parsed.data.template,
    summary: parsed.data.summary || fallback.summary,
    components: buildComponentsFromSections(sections),
    composables: uniqueValues(parsed.data.composables.filter(composable =>
      SITE_BUILDER_COMPOSABLES.some(item => item.name === composable)
    )),
    sections
  }
}
