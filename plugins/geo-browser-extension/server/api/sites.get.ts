import { db, schema } from 'hub:db'
import { and, desc, eq } from 'drizzle-orm'
import { buildSiteLinks, buildSiteSeo } from '#shared/utils'

/**
 * GET /api/sites
 * Get all sites (public sites or user's own sites)
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const query = getQuery(event)
  const status = query.status as 'draft' | 'published' | undefined
  const userId = query.userId as string | undefined
  const type = query.type as 'internal' | 'shopify-external' | undefined

  try {
    const runtimeConfig = useRuntimeConfig()
    const siteBaseUrl = runtimeConfig.public.siteUrl

    if (type === 'shopify-external') {
      return []
    }

    let sites

    if (session?.user?.id) {
      sites = await db.query.sites.findMany({
        where: and(
          userId ? eq(schema.sites.userId, userId) : undefined,
          status ? eq(schema.sites.status, status) : undefined
        ),
        columns: {
          id: true,
          userId: true,
          title: true,
          slug: true,
          theme: true,
          template: true,
          status: true,
          seoTitle: true,
          seoDescription: true,
          ogImage: true,
          publishedAt: true,
          createdAt: true
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          siteProducts: {
            columns: {
              siteId: true,
              productId: true
            }
          }
        },
        orderBy: [desc(schema.sites.createdAt)]
      })
    } else {
      sites = await db.query.sites.findMany({
        where: and(
          eq(schema.sites.status, status || 'published')
        ),
        columns: {
          id: true,
          userId: true,
          title: true,
          slug: true,
          theme: true,
          template: true,
          status: true,
          seoTitle: true,
          seoDescription: true,
          ogImage: true,
          publishedAt: true,
          createdAt: true
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          siteProducts: {
            columns: {
              siteId: true,
              productId: true
            }
          }
        },
        orderBy: [desc(schema.sites.createdAt)]
      })
    }

    // Transform data
    return sites.map((site) => {
      const siteInput = {
        ...site,
        siteType: 'internal' as const
      }

      return {
        id: site.id,
        title: site.title,
        slug: site.slug,
        theme: site.theme,
        siteType: 'internal',
        template: site.template,
        status: site.status,
        seoTitle: site.seoTitle,
        seoDescription: site.seoDescription,
        ogImage: site.ogImage,
        publishedAt: site.publishedAt,
        createdAt: site.createdAt,
        user: site.user,
        links: buildSiteLinks(siteInput, siteBaseUrl),
        seo: buildSiteSeo(siteInput, [], siteBaseUrl),
        productCount: site.siteProducts.length,
        isOwner: session?.user?.id === site.userId
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching sites:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch sites'
    })
  }
})
