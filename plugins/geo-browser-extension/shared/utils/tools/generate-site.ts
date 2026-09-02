import { tool } from 'ai'
import { z } from 'zod'
import type { UIToolInvocation } from 'ai'
import { buildProductDrivenSiteBuilderConfig, normalizeSiteBuilderConfig, siteBuilderConfigSchema } from '../site-builder'
import { buildShopifySeoGeoPayload, buildSiteLinks, buildSiteSeo } from '../site-platform'

const DEFAULT_SITE_URL = 'http://localhost:3000/'

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60)

  return slug || `site-${crypto.randomUUID().slice(0, 8)}`
}

/**
 * Ensure slug is unique by appending a number if needed
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const { db, schema } = await import('hub:db')
  const { eq } = await import('drizzle-orm')

  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await db.query.sites.findFirst({
      where: eq(schema.sites.slug, slug)
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

/**
 * Create generate_site tool with user and chat context
 */
export function createGenerateSiteTool(userId: string, chatId: string) {
  return tool({
    description: 'Generate a GEO-friendly e-commerce site based on selected products from the user\'s connected stores. Use this tool after fetching products with get_products.',
    inputSchema: z.object({
      title: z.string().describe('Site title (e.g., "Best Tech Gadgets 2025")'),
      theme: z.string().describe('Site theme or description (e.g., "Modern electronics for professionals")'),
      productIds: z.array(z.string()).min(3).max(20).describe('Array of product IDs to include in the site (min 3, max 20)'),
      template: z.enum(['grid', 'list', 'hero']).default('grid').describe('Site template: grid (card grid layout), list (vertical list), hero (hero image with featured products)'),
      builderConfig: siteBuilderConfigSchema.optional().describe('Optional composable Nuxt UI + product component template blocks. Include section.content to customize exact module copy, links, FAQs, articles, testimonials, and HowTo steps. Use only allowed components and sections from the site builder registry.'),
      seoTitle: z.string().optional().describe('SEO/GEO title (leave empty to use site title)'),
      seoDescription: z.string().optional().describe('SEO/GEO description summarizing the site content')
    }),
    execute: async ({ title, theme, productIds, template, builderConfig, seoTitle, seoDescription }) => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      try {
        // 使用动态导入确保数据库连接正确初始化
        const { db, schema } = await import('hub:db')
        const { inArray } = await import('drizzle-orm')
        const runtimeConfig = useRuntimeConfig()

        const candidateProducts = await db.query.products.findMany({
          where: inArray(schema.products.id, productIds),
          with: {
            store: {
              columns: {
                platform: true,
                userId: true
              }
            }
          }
        })

        const userProducts = productIds.flatMap((productId) => {
          const product = candidateProducts.find(candidate => candidate.id === productId && candidate.store.userId === userId)

          return product ? [product] : []
        })

        if (userProducts.length === 0) {
          return {
            success: false,
            message: 'No valid products found. Please fetch products first using get_products tool.',
            site: null
          }
        }

        if (userProducts.length !== productIds.length) {
          return {
            success: false,
            message: 'Some selected products do not belong to your connected stores. Please choose products from your own catalog only.',
            site: null
          }
        }

        // Generate unique slug
        const baseSlug = generateSlug(title)
        const slug = await ensureUniqueSlug(baseSlug)
        const siteBaseUrl = (runtimeConfig.public.siteUrl || DEFAULT_SITE_URL).replace(/\/?$/, '/')
        const siteSeoInput = {
          title,
          slug,
          theme,
          siteType: 'internal' as const,
          seoTitle,
          seoDescription,
          ogImage: userProducts.find(product => product.imageUrl)?.imageUrl || null
        }
        const productsForSeo = userProducts.map(product => ({
          ...product,
          platform: product.store.platform
        }))
        const generatedSeo = buildSiteSeo(siteSeoInput, productsForSeo, siteBaseUrl)
        const categories = Array.from(new Set(
          userProducts
            .map(product => product.category)
            .filter((category): category is string => Boolean(category))
        ))
        const fallbackBuilderConfig = buildProductDrivenSiteBuilderConfig({
          template,
          title,
          theme,
          productCount: userProducts.length,
          categories,
          products: productsForSeo,
          userIntent: theme
        })
        const normalizedBuilderConfig = normalizeSiteBuilderConfig(builderConfig, fallbackBuilderConfig)

        // Create site
        const [site] = await db.insert(schema.sites).values({
          id: crypto.randomUUID(),
          chatId,
          userId,
          title,
          slug,
          theme,
          template,
          status: 'draft',
          seoTitle: generatedSeo.title,
          seoDescription: generatedSeo.description,
          ogImage: generatedSeo.ogImage,
          builderConfig: normalizedBuilderConfig
        }).returning({
          id: schema.sites.id,
          title: schema.sites.title,
          slug: schema.sites.slug,
          theme: schema.sites.theme,
          template: schema.sites.template,
          status: schema.sites.status,
          createdAt: schema.sites.createdAt
        })

        // Create site-product associations
        if (site) {
          await db.insert(schema.siteProducts).values(
            userProducts.map((product, index) => ({
              siteId: site.id,
              productId: product.id,
              position: index
            }))
          )

          return {
            success: true,
            message: `Successfully created site "${title}" with ${userProducts.length} products!`,
            site: {
              ...buildSiteLinks(site, siteBaseUrl),
              id: site.id,
              title: site.title,
              slug: site.slug,
              theme: site.theme,
              siteType: 'internal',
              template: site.template,
              status: site.status,
              createdAt: site.createdAt,
              seo: generatedSeo,
              shopifySeoGeo: buildShopifySeoGeoPayload(siteSeoInput, productsForSeo, generatedSeo),
              builderConfig: normalizedBuilderConfig,
              productCount: userProducts.length,
              previewUrl: generatedSeo.links.displayUrl,
              editUrl: `/sites/${site.id}/edit`
            }
          }
        }

        return {
          success: false,
          message: 'Failed to create site record.',
          site: null
        }
      } catch (error) {
        console.error('Error generating site:', error)
        return {
          success: false,
          message: 'Failed to generate site. Please try again.',
          site: null
        }
      }
    }
  })
}

// Type for UI tool invocation
export type GenerateSiteUIToolInvocation = UIToolInvocation<ReturnType<typeof createGenerateSiteTool>>
