import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { buildProductDrivenSiteBuilderConfig, buildShopifySeoGeoPayload, buildSiteLinks, buildSiteSeo, normalizeSiteBuilderConfig } from '#shared/utils'

/**
 * GET /api/sites/[slug]
 * Get site details with products
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Site slug is required'
    })
  }

  try {
    const runtimeConfig = useRuntimeConfig()
    const siteBaseUrl = runtimeConfig.public.siteUrl

    // Get site with products
    const site = await db.query.sites.findFirst({
      where: eq(schema.sites.slug, slug),
      columns: {
        id: true,
        title: true,
        slug: true,
        theme: true,
        template: true,
        status: true,
        seoTitle: true,
        seoDescription: true,
        ogImage: true,
        builderConfig: true,
        publishedAt: true,
        createdAt: true
      },
      with: {
        siteProducts: {
          with: {
            product: {
              with: {
                store: {
                  columns: {
                    platform: true
                  }
                }
              }
            }
          },
          orderBy: (siteProducts, { asc }) => [asc(siteProducts.position)]
        },
        user: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    if (!site) {
      throw createError({
        statusCode: 404,
        message: 'Site not found'
      })
    }

    const siteType = 'internal'
    const products = site.siteProducts.map((sp) => {
      const { store, ...product } = sp.product

      return {
        ...product,
        platform: store.platform,
        position: sp.position
      }
    })
    const siteInput = {
      ...site,
      siteType
    }
    const seo = buildSiteSeo(siteInput, products, siteBaseUrl)
    const categories = Array.from(new Set(
      products
        .map(product => product.category)
        .filter((category): category is string => Boolean(category))
    ))
    const fallbackBuilderConfig = buildProductDrivenSiteBuilderConfig({
      template: site.template,
      title: site.title,
      theme: site.theme,
      productCount: products.length,
      categories,
      products,
      userIntent: site.theme
    })
    const builderConfig = normalizeSiteBuilderConfig(site.builderConfig, fallbackBuilderConfig)

    // Transform data for frontend
    return {
      id: site.id,
      title: site.title,
      slug: site.slug,
      theme: site.theme,
      siteType,
      template: site.template,
      status: site.status,
      seoTitle: site.seoTitle,
      seoDescription: site.seoDescription,
      ogImage: site.ogImage,
      builderConfig,
      publishedAt: site.publishedAt,
      createdAt: site.createdAt,
      user: site.user,
      links: buildSiteLinks(siteInput, siteBaseUrl),
      seo,
      shopifySeoGeo: buildShopifySeoGeoPayload(siteInput, products, seo),
      products
    }
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'statusCode' in error)
      throw error

    console.error('Error fetching site:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch site'
    })
  }
})
