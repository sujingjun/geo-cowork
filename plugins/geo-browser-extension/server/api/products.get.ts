import { db, schema } from 'hub:db'
import { eq, and, like, inArray } from 'drizzle-orm'

/**
 * GET /api/products
 * Get products for the current user with optional filters
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const query = getQuery(event)
  const storeId = query.storeId as string | undefined
  const platform = query.platform as string | undefined
  const category = query.category as string | undefined
  const keywords = query.keywords as string | undefined
  const limit = query.limit ? Number.parseInt(query.limit as string) : 50

  try {
    // Get user's stores
    const userStores = await db.query.stores.findMany({
      where: eq(schema.stores.userId, session.user.id),
      columns: { id: true, platform: true }
    })

    if (userStores.length === 0) {
      return []
    }

    const filteredStores = platform
      ? userStores.filter(store => store.platform === platform)
      : userStores

    const storeIds = filteredStores.map(s => s.id)

    if (storeIds.length === 0) {
      return []
    }

    if (storeId && !storeIds.includes(storeId)) {
      throw createError({
        statusCode: 404,
        message: 'Store not found'
      })
    }

    // Build query conditions
    const conditions = []

    if (storeId) {
      conditions.push(eq(schema.products.storeId, storeId))
    } else {
      conditions.push(inArray(schema.products.storeId, storeIds))
    }

    if (category) {
      conditions.push(like(schema.products.category, `%${category}%`))
    }

    if (keywords) {
      conditions.push(like(schema.products.title, `%${keywords}%`))
    }

    // Query products
    const products = await db.query.products.findMany({
      where: and(...conditions),
      limit,
      orderBy: (products, { desc }) => [desc(products.lastSyncedAt)]
    })

    return products
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'statusCode' in error)
      throw error

    console.error('Error fetching products:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products'
    })
  }
})
