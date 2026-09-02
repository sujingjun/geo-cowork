import { tool } from 'ai'
import { z } from 'zod'
import type { UIToolInvocation } from 'ai'
import { buildProductDrivenSiteBuilderConfig, normalizeSiteBuilderConfig } from '../site-builder'

const sectionPatchSchema = z.object({
  siteSlug: z.string().optional().describe('Slug of the site to update. Use this when the user references a preview URL or site slug.'),
  siteId: z.string().optional().describe('ID of the site to update. Use this when available from a previous generate_site result.'),
  sectionId: z.string().optional().describe('Exact section id to update, such as features, testimonials, faq, blog, contact, how-to, about, cta.'),
  sectionKind: z.string().optional().describe('Section kind to update when section id is unknown, such as brand-features, testimonials, faq, blog-list, contact, how-to.'),
  title: z.string().max(120).optional().describe('Replacement module title'),
  description: z.string().max(240).optional().describe('Replacement module description'),
  content: z.record(z.string(), z.unknown()).optional().describe('Replacement structured module content, such as features, testimonials, faqs, steps, articles, or links arrays.'),
  mergeContent: z.boolean().default(true).describe('Merge content into existing module content instead of replacing it completely')
})

export function createUpdateSiteSectionTool(userId: string) {
  return tool({
    description: 'Update one module/section of an existing generated site without rebuilding the whole site. Use this for multi-turn edits like changing FAQ, testimonials, brand features, contact links, articles, HowTo steps, or CTA copy.',
    inputSchema: sectionPatchSchema.refine(input => input.siteSlug || input.siteId, {
      message: 'siteSlug or siteId is required'
    }).refine(input => input.sectionId || input.sectionKind, {
      message: 'sectionId or sectionKind is required'
    }),
    execute: async ({ siteSlug, siteId, sectionId, sectionKind, title, description, content, mergeContent }) => {
      try {
        const { db, schema } = await import('hub:db')
        const { and, eq } = await import('drizzle-orm')

        const site = await db.query.sites.findFirst({
          where: siteId
            ? and(eq(schema.sites.id, siteId), eq(schema.sites.userId, userId))
            : and(eq(schema.sites.slug, siteSlug as string), eq(schema.sites.userId, userId)),
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
            }
          }
        })

        if (!site) {
          return {
            success: false,
            message: 'Site not found or you do not have permission to edit it.',
            site: null
          }
        }

        const products = site.siteProducts.map(({ product }) => ({
          ...product,
          platform: product.store.platform
        }))
        const categories = Array.from(new Set(
          products
            .map(product => product.category)
            .filter((category): category is string => Boolean(category))
        ))
        const fallbackConfig = buildProductDrivenSiteBuilderConfig({
          template: site.template,
          title: site.title,
          theme: site.theme,
          productCount: products.length,
          categories,
          products,
          userIntent: site.theme
        })
        const currentConfig = normalizeSiteBuilderConfig(site.builderConfig, fallbackConfig)
        const targetIndex = currentConfig.sections.findIndex(section =>
          (sectionId && section.id === sectionId) || (sectionKind && section.kind === sectionKind)
        )

        if (targetIndex === -1) {
          return {
            success: false,
            message: `No matching module found for ${sectionId || sectionKind}.`,
            site: {
              id: site.id,
              slug: site.slug,
              availableSections: currentConfig.sections.map(section => ({
                id: section.id,
                kind: section.kind,
                title: section.title
              }))
            }
          }
        }

        const nextSections = currentConfig.sections.map((section, index) => {
          if (index !== targetIndex)
            return section

          return {
            ...section,
            title: title ?? section.title,
            description: description ?? section.description,
            content: content
              ? mergeContent
                ? { ...(section.content || {}), ...content }
                : content
              : section.content
          }
        })
        const nextConfig = normalizeSiteBuilderConfig({
          ...currentConfig,
          sections: nextSections
        }, fallbackConfig)

        await db.update(schema.sites)
          .set({ builderConfig: nextConfig })
          .where(eq(schema.sites.id, site.id))

        const updatedSection = nextConfig.sections[targetIndex]

        return {
          success: true,
          message: `Updated module "${updatedSection?.title || sectionId || sectionKind}".`,
          site: {
            id: site.id,
            slug: site.slug,
            previewUrl: `/sites/internal/${site.slug}`,
            updatedSection
          }
        }
      } catch (error) {
        console.error('Error updating site section:', error)
        return {
          success: false,
          message: 'Failed to update site module. Please try again.',
          site: null
        }
      }
    }
  })
}

export type UpdateSiteSectionUIToolInvocation = UIToolInvocation<ReturnType<typeof createUpdateSiteSectionTool>>
