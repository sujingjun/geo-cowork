import { getPlatformLabel, getProductExternalUrl } from './store-platform'

const DEFAULT_SITE_URL = 'http://localhost:3000/'
const MAX_DESCRIPTION_LENGTH = 160

export type SiteType = 'internal' | 'shopify-external'

export interface SiteLinkInput {
  slug: string
  siteType?: SiteType | string | null
}

export interface SiteSeoInput extends SiteLinkInput {
  title: string
  theme: string
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: string | null
}

export interface SiteProductSeoInput {
  title: string
  description?: string | null
  price?: string | null
  currency?: string | null
  imageUrl?: string | null
  asin?: string | null
  productUrl?: string | null
  category?: string | null
  platform?: string | null
}

export interface SiteLinks {
  publicPath: string
  internalPath: string
  displayPath: string
  canonicalPath: string
  publicUrl: string
  internalUrl: string
  displayUrl: string
  canonicalUrl: string
}

export interface SiteSeo {
  title: string
  description: string
  ogImage?: string
  platformSummary: string
  categorySummary: string
  links: SiteLinks
}

export interface SiteSchemaInput {
  organization: {
    name: string
    url: string
    sameAs: string[]
  }
  webSite: {
    name: string
    url: string
  }
  webPage: {
    name: string
    description: string
    url: string
  }
  breadcrumb: {
    itemListElement: Array<{
      name: string
      item: string
    }>
  }
  itemList: {
    name: string
    description: string
    numberOfItems: number
    itemListElement: Array<{
      '@type': 'ListItem'
      'position': number
      'name': string
      'url'?: string
    }>
  }
  products: Array<{
    name: string
    image?: string
    description?: string
    category?: string
    offers?: {
      '@type': 'Offer'
      'price'?: string
      'priceCurrency': string
      'availability': string
      'url'?: string
    }
  }>
  faqPage: {
    mainEntity: Array<{
      '@type': 'Question'
      'name': string
      'acceptedAnswer': {
        '@type': 'Answer'
        'text': string
      }
    }>
  }
  howTo: {
    name: string
    description: string
    step: Array<{
      '@type': 'HowToStep'
      'position': number
      'name': string
      'text': string
    }>
  }
  blog: {
    name: string
    blogPost: Array<{
      '@type': 'BlogPosting'
      'headline': string
      'description': string
      'url': string
    }>
  }
}

export interface ShopifySeoGeoPayload {
  handle: string
  seo: {
    title: string
    description: string
  }
  jsonLd: SiteSchemaInput
  metaobject: {
    type: 'geo_site'
    fields: Array<{
      key: string
      value: string
    }>
  }
}

function normalizeSiteBaseUrl(siteBaseUrl?: string | null) {
  return (siteBaseUrl || DEFAULT_SITE_URL).replace(/\/?$/, '/')
}

function toAbsoluteUrl(path: string, siteBaseUrl?: string | null) {
  const baseUrl = normalizeSiteBaseUrl(siteBaseUrl)
  const normalizedPath = path.replace(/^\//, '')

  return `${baseUrl}${normalizedPath}`
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function truncateDescription(description: string) {
  if (description.length <= MAX_DESCRIPTION_LENGTH) {
    return description
  }

  return `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`
}

function getOriginBaseUrl(url: string) {
  try {
    return `${new URL(url).origin}/`
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function buildSiteLinks(site: SiteLinkInput, siteBaseUrl?: string | null): SiteLinks {
  const publicPath = `/sites/${site.slug}`
  const internalPath = `/sites/internal/${site.slug}`
  const displayPath = site.siteType === 'shopify-external' ? publicPath : internalPath
  const canonicalPath = publicPath

  return {
    publicPath,
    internalPath,
    displayPath,
    canonicalPath,
    publicUrl: toAbsoluteUrl(publicPath, siteBaseUrl),
    internalUrl: toAbsoluteUrl(internalPath, siteBaseUrl),
    displayUrl: toAbsoluteUrl(displayPath, siteBaseUrl),
    canonicalUrl: toAbsoluteUrl(canonicalPath, siteBaseUrl)
  }
}

export function buildSiteSeo(site: SiteSeoInput, products: SiteProductSeoInput[], siteBaseUrl?: string | null): SiteSeo {
  const platformSummary = uniqueValues(products.map(product => getPlatformLabel(product.platform))).join(' + ') || 'multi-platform'
  const categories = uniqueValues(products.map(product => product.category))
  const categorySummary = categories.slice(0, 3).join(', ') || site.theme
  const productCount = products.length
  const productWord = productCount === 1 ? 'product' : 'products'
  const generatedTitle = `${site.title} | ${platformSummary} Product Picks`
  const generatedDescription = truncateDescription(
    `Explore ${productCount} curated ${platformSummary} ${productWord} for ${site.theme}. Compare ${categorySummary} and open each item on its source platform.`
  )

  return {
    title: site.seoTitle || generatedTitle,
    description: site.seoDescription || generatedDescription,
    ogImage: site.ogImage || products.find(product => product.imageUrl)?.imageUrl || undefined,
    platformSummary,
    categorySummary,
    links: buildSiteLinks(site, siteBaseUrl)
  }
}

export function buildSiteSchemaInput(
  site: SiteSeoInput,
  products: SiteProductSeoInput[],
  seo: SiteSeo
): SiteSchemaInput {
  const originUrl = getOriginBaseUrl(seo.links.canonicalUrl)
  const primaryCategory = uniqueValues(products.map(product => product.category))[0] || site.theme

  return {
    organization: {
      name: site.title,
      url: seo.links.canonicalUrl,
      sameAs: [
        'https://www.instagram.com/',
        'https://www.tiktok.com/',
        'https://www.youtube.com/'
      ]
    },
    webSite: {
      name: site.title,
      url: originUrl
    },
    webPage: {
      name: seo.title,
      description: seo.description,
      url: seo.links.canonicalUrl
    },
    breadcrumb: {
      itemListElement: [
        {
          name: 'Sites',
          item: toAbsoluteUrl('/sites', originUrl)
        },
        {
          name: site.title,
          item: seo.links.canonicalUrl
        }
      ]
    },
    itemList: {
      name: site.title,
      description: seo.description,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': product.title,
        'url': getProductExternalUrl(product) || undefined
      }))
    },
    products: products.map(product => ({
      name: product.title,
      image: product.imageUrl || undefined,
      description: product.description || undefined,
      category: product.category || undefined,
      offers: {
        '@type': 'Offer',
        'price': product.price || undefined,
        'priceCurrency': product.currency || 'USD',
        'availability': 'https://schema.org/InStock',
        'url': getProductExternalUrl(product) || undefined
      }
    })),
    faqPage: {
      mainEntity: [
        {
          '@type': 'Question',
          'name': 'Where does checkout happen?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Checkout happens on the original source platform. This generated page helps shoppers discover, compare, and understand the collection.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How fresh are these products?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Product details are based on the latest synced catalog data available to the site. Re-sync the connected store when upstream products change.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Can this become a Shopify page?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The same structured content can be mapped to Shopify pages, theme sections, or Metaobjects in a future write-back workflow.'
          }
        }
      ]
    },
    howTo: {
      name: `How to choose from ${site.title}`,
      description: `A structured buying path for ${seo.categorySummary}.`,
      step: [
        {
          '@type': 'HowToStep',
          'position': 1,
          'name': 'Start with the featured product',
          'text': products[0]
            ? `Use ${products[0].title} as the reference point for fit, features, and source-platform details.`
            : 'Use the featured product area as the reference point for the collection.'
        },
        {
          '@type': 'HowToStep',
          'position': 2,
          'name': 'Compare the category fit',
          'text': `Review ${primaryCategory} and related categories to narrow the collection.`
        },
        {
          '@type': 'HowToStep',
          'position': 3,
          'name': 'Open the source listing',
          'text': 'Verify availability, variants, shipping, and checkout details on the original platform.'
        }
      ]
    },
    blog: {
      name: `${site.title} buying guides`,
      blogPost: [
        {
          '@type': 'BlogPosting',
          'headline': `How to compare ${primaryCategory} products`,
          'description': `A practical guide to evaluating ${primaryCategory} products by fit, price, platform, and product details.`,
          'url': `${seo.links.canonicalUrl}#guides`
        },
        {
          '@type': 'BlogPosting',
          'headline': 'What makes a GEO-ready product page',
          'description': 'How structured modules, product schema, FAQs, and editorial context help AI systems understand a storefront.',
          'url': `${seo.links.canonicalUrl}#guides`
        }
      ]
    }
  }
}

export function buildShopifySeoGeoPayload(
  site: SiteSeoInput,
  products: SiteProductSeoInput[],
  seo: SiteSeo
): ShopifySeoGeoPayload {
  const jsonLd = buildSiteSchemaInput(site, products, seo)
  const categorySummary = seo.categorySummary
  const platformSummary = seo.platformSummary

  return {
    handle: site.slug,
    seo: {
      title: seo.title,
      description: seo.description
    },
    jsonLd,
    metaobject: {
      type: 'geo_site',
      fields: [
        {
          key: 'title',
          value: site.title
        },
        {
          key: 'theme',
          value: site.theme
        },
        {
          key: 'canonical_url',
          value: seo.links.canonicalUrl
        },
        {
          key: 'platform_summary',
          value: platformSummary
        },
        {
          key: 'category_summary',
          value: categorySummary
        },
        {
          key: 'product_count',
          value: String(products.length)
        },
        {
          key: 'json_ld',
          value: JSON.stringify(jsonLd)
        }
      ]
    }
  }
}
