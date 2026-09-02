import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { toPublicStore } from '../utils/store-management'

/**
 * GET /api/stores
 * Get all stores for the current user
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const stores = await db.query.stores.findMany({
    where: eq(schema.stores.userId, session.user.id),
    orderBy: (stores, { desc }) => [desc(stores.createdAt)]
  })

  return stores.map(store => toPublicStore(store))
})
