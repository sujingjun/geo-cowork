import { describe, expect, it } from 'vitest'
import {
  NUXT_UI_SITE_COMPONENTS,
  PRODUCT_SITE_COMPONENTS,
  buildDefaultSiteBuilderConfig,
  buildProductDrivenSiteBuilderConfig,
  normalizeSiteBuilderConfig
} from './site-builder'

describe('site builder registry', () => {
  it('exposes Nuxt UI and product components as composable building blocks', () => {
    expect(NUXT_UI_SITE_COMPONENTS.map(component => component.name)).toEqual(expect.arrayContaining([
      'UContainer',
      'UPageHero',
      'UPageSection',
      'UPageFeature',
      'UPageCard',
      'UPageColumns',
      'UPageCTA',
      'UPageGrid',
      'UPageList',
      'UPageLinks',
      'UCard',
      'UButton',
      'UBadge'
    ]))
    expect(PRODUCT_SITE_COMPONENTS.map(component => component.name)).toEqual(expect.arrayContaining([
      'SiteProductCard',
      'SiteGridLayout',
      'SiteListLayout',
      'SiteHeroLayout',
      'SiteBrandFeatureGrid',
      'SiteEditorialSection'
    ]))
  })

  it('builds a grid template from header, hero, category, and product sections', () => {
    const config = buildDefaultSiteBuilderConfig({
      template: 'grid',
      title: 'Gift Guide',
      theme: 'Curated Shopify products',
      productCount: 8,
      categories: ['Home', 'Beauty']
    })

    expect(config.template).toBe('grid')
    expect(config.sections.map(section => section.kind)).toEqual([
      'storefront-header',
      'commerce-hero',
      'category-strip',
      'product-grid',
      'trust-strip',
      'brand-features',
      'testimonials',
      'blog-list',
      'product-cta'
    ])
    expect(config.sections.find(section => section.kind === 'product-grid')?.components).toContain('UPageGrid')
    expect(config.sections.find(section => section.kind === 'brand-features')?.components).toContain('UPageFeature')
    expect(config.sections.find(section => section.kind === 'blog-list')?.components).toContain('UPageCard')
  })

  it('builds a hero template around a featured product section', () => {
    const config = buildDefaultSiteBuilderConfig({
      template: 'hero',
      title: 'Smart Home Drops',
      theme: 'Hero-led product storytelling',
      productCount: 5,
      categories: ['Smart Home']
    })

    expect(config.sections.map(section => section.kind)).toContain('featured-product')
    expect(config.sections.map(section => section.kind)).toContain('about-brand')
    expect(config.sections.map(section => section.kind)).toContain('how-to')
    expect(config.sections.find(section => section.kind === 'featured-product')?.components).toContain('SiteHeroLayout')
  })

  it('derives module content from product attributes and user intent', () => {
    const config = buildProductDrivenSiteBuilderConfig({
      template: 'grid',
      title: 'Creator Desk Setup',
      theme: 'quiet productivity gear for creators',
      productCount: 3,
      categories: ['Audio', 'Desk'],
      userIntent: 'premium desk setup for video calls',
      products: [
        {
          title: 'Noise Canceling Microphone',
          description: 'Clear voice capture for video calls',
          category: 'Audio',
          platform: 'shopify',
          vendor: 'Studio Co'
        },
        {
          title: 'Ergonomic Desk Lamp',
          description: 'Warm light for long creative sessions',
          category: 'Desk',
          platform: 'amazon',
          vendor: 'Light Lab'
        }
      ]
    })

    const features = config.sections.find(section => section.kind === 'brand-features')
    const blog = config.sections.find(section => section.kind === 'blog-list')

    expect(features?.content?.features).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: expect.stringContaining('Audio')
      })
    ]))
    expect(JSON.stringify(blog?.content)).toContain('Creator Desk Setup buying checklist')
  })

  it('normalizes unsafe AI-provided template configs', () => {
    const fallback = buildDefaultSiteBuilderConfig({
      template: 'list',
      title: 'Fallback',
      theme: 'Fallback theme',
      productCount: 3,
      categories: []
    })
    const config = normalizeSiteBuilderConfig({
      template: 'grid',
      sections: [
        { id: 'unsafe', kind: 'script-tag', title: 'Unsafe', components: ['script'] },
        {
          id: 'ok',
          kind: 'product-list',
          title: 'Products',
          components: ['UPageList', 'SiteListLayout'],
          content: {
            intro: 'Keep safe structured content'
          }
        }
      ]
    }, fallback)

    expect(config.template).toBe('grid')
    expect(config.sections).toHaveLength(1)
    expect(config.sections[0]?.kind).toBe('product-list')
    expect(config.sections[0]?.components).toEqual(['UPageList', 'SiteListLayout'])
    expect(config.sections[0]?.content?.intro).toBe('Keep safe structured content')
  })

  it('removes components that are not allowed in a section kind', () => {
    const fallback = buildDefaultSiteBuilderConfig({
      template: 'grid',
      title: 'Fallback',
      theme: 'Fallback theme',
      productCount: 3,
      categories: []
    })
    const config = normalizeSiteBuilderConfig({
      template: 'grid',
      sections: [
        {
          id: 'bad-grid',
          kind: 'product-grid',
          title: 'Bad grid',
          components: ['UPageGrid', 'SiteHeroLayout', 'SiteGridLayout', 'UPageFeature']
        }
      ]
    }, fallback)

    expect(config.sections[0]?.components).toEqual(['UPageGrid', 'SiteGridLayout'])
    expect(config.components.product).toEqual(['SiteGridLayout'])
  })
})
