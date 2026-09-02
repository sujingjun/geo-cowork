import { tool } from 'ai'
import { z } from 'zod'
import type { UIToolInvocation } from 'ai'

/**
 * Create get_products tool with user context
 */
export function createGetProductsTool(userId: string) {
  return tool({
    description: 'Get products from the user\'s connected commerce stores. Use this tool to fetch Amazon or Shopify product data when the user wants to generate a site or review catalog options.',
    inputSchema: z.object({
      platform: z.enum(['amazon', 'shopify']).optional().describe('Optional store platform filter'),
      storeId: z.string().optional().describe('Optional store ID to limit results to one connected store'),
      theme: z.string().optional().describe('Theme or keyword to filter products (e.g., "electronics", "books", "toys")'),
      category: z.string().optional().describe('Product category to filter by'),
      limit: z.number().default(10).describe('Maximum number of products to return (default: 10, max: 50)')
    }),
    execute: async ({ theme, category, limit, platform, storeId }) => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      try {
        // 使用动态导入确保数据库连接正确初始化
        const { db, schema } = await import('hub:db')
        const { and, eq, inArray, like } = await import('drizzle-orm')

        // Get user's stores
        const userStores = await db.query.stores.findMany({
          where: eq(schema.stores.userId, userId),
          columns: { id: true, platform: true, storeName: true }
        })

        if (userStores.length === 0) {
          return {
            success: false,
            message: 'No connected stores found. Please connect an Amazon or Shopify store first.',
            products: []
          }
        }

        const filteredStores = userStores.filter((store) => {
          if (platform && store.platform !== platform)
            return false

          if (storeId && store.id !== storeId)
            return false

          return true
        })

        if (filteredStores.length === 0) {
          return {
            success: false,
            message: 'No connected stores matched the requested filters.',
            products: []
          }
        }

        const storeIds = filteredStores.map(s => s.id)
        const storeLookup = new Map(filteredStores.map(store => [store.id, store]))

        // Build query conditions
        const conditions = [inArray(schema.products.storeId, storeIds)]

        if (category) {
          conditions.push(like(schema.products.category, `%${category}%`))
        }

        if (theme) {
          conditions.push(like(schema.products.title, `%${theme}%`))
        }

        // Query products
        const products = await db.query.products.findMany({
          where: and(...conditions),
          limit: Math.min(limit, 50),
          orderBy: (products, { desc }) => [desc(products.lastSyncedAt)]
        })

        return {
          success: true,
          count: products.length,
          products: products.map(p => ({
            id: p.id,
            storeId: p.storeId,
            platform: storeLookup.get(p.storeId)?.platform || null,
            storeName: storeLookup.get(p.storeId)?.storeName || null,
            asin: p.asin,
            title: p.title,
            price: p.price,
            currency: p.currency,
            imageUrl: p.imageUrl,
            description: p.description,
            category: p.category,
            productUrl: p.productUrl,
            vendor: p.vendor,
            productType: p.productType
          }))
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        return {
          success: false,
          message: 'Failed to fetch products. Please try again.',
          products: []
        }
      }
    }
  })
}

// Type for UI tool invocation
export type GetProductsUIToolInvocation = UIToolInvocation<ReturnType<typeof createGetProductsTool>>
