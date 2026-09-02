import { describe, expect, it } from 'vitest'
import { buildShopifySeoGeoPayload, buildSiteLinks, buildSiteSchemaInput, buildSiteSeo } from './site-platform'

const products = [
  {
    title: 'Shopify Baby Carrier',
    description: 'Comfort carrier for daily family travel',
    price: '59.99',
    currency: 'USD',
    imageUrl: 'https://example.com/carrier.jpg',
    productUrl: 'https://demo.myshopify.com/products/carrier',
    category: 'Baby',
    platform: 'shopify'
  },
  {
    title: 'Amazon Nursery Light',
    description: 'Soft night light for nursery rooms',
    price: '24.00',
    currency: 'USD',
    imageUrl: null,
    asin: 'B000TEST',
    category: 'Nursery',
    platform: 'amazon'
  }
]

describe('site platform utilities', () => {
  it('builds stable public, internal, display, and canonical links', () => {
    const links = buildSiteLinks({ slug: 'baby-picks', siteType: 'internal' }, 'https://geo.example/')

    expect(links.publicPath).toBe('/sites/baby-picks')
    expect(links.internalPath).toBe('/sites/internal/baby-picks')
    expect(links.displayUrl).toBe('https://geo.example/sites/internal/baby-picks')
    expect(links.canonicalUrl).toBe('https://geo.example/sites/baby-picks')
  })

  it('generates platform-aware fallback SEO copy', () => {
    const seo = buildSiteSeo({
      title: 'Baby Essentials',
      slug: 'baby-essentials',
      theme: 'new parent shopping',
      siteType: 'internal'
    }, products, 'https://geo.example')

    expect(seo.title).toBe('Baby Essentials | Shopify + Amazon Product Picks')
    expect(seo.description).toContain('2 curated Shopify + Amazon products')
    expect(seo.description.length).toBeLessThanOrEqual(160)
    expect(seo.ogImage).toBe('https://example.com/carrier.jpg')
  })

  it('builds JSON-LD inputs with platform product URLs', () => {
    const site = {
      title: 'Baby Essentials',
      slug: 'baby-essentials',
      theme: 'new parent shopping',
      siteType: 'internal' as const
    }
    const seo = buildSiteSeo(site, products, 'https://geo.example')
    const schema = buildSiteSchemaInput(site, products, seo)

    expect(schema.webPage.url).toBe('https://geo.example/sites/baby-essentials')
    expect(schema.itemList.numberOfItems).toBe(2)
    expect(schema.itemList.itemListElement[1]?.url).toBe('https://amazon.com/dp/B000TEST')
    expect(schema.products[0]?.offers?.url).toBe('https://demo.myshopify.com/products/carrier')
    expect(schema.organization.name).toBe('Baby Essentials')
    expect(schema.webSite.url).toBe('https://geo.example/')
    expect(schema.faqPage.mainEntity).toHaveLength(3)
    expect(schema.howTo.step[0]?.name).toBe('Start with the featured product')
    expect(schema.blog.blogPost[0]?.headline).toContain('Baby')
  })

  it('prepares Shopify SEO/GEO payload without writing to Shopify', () => {
    const site = {
      title: 'Baby Essentials',
      slug: 'baby-essentials',
      theme: 'new parent shopping',
      siteType: 'internal' as const
    }
    const seo = buildSiteSeo(site, products, 'https://geo.example')
    const payload = buildShopifySeoGeoPayload(site, products, seo)

    expect(payload.handle).toBe('baby-essentials')
    expect(payload.seo.title).toBe(seo.title)
    expect(payload.metaobject.type).toBe('geo_site')
    expect(payload.metaobject.fields.some(field => field.key === 'json_ld')).toBe(true)
  })
})
