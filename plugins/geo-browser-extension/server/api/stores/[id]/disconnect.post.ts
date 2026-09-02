import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { buildDisconnectedStoreUpdate } from '#shared/utils'
import { getOwnedStoreOrThrow, recordStoreAuthEvent, toPublicStore } from '../../../utils/store-management'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const storeId = getRouterParam(event, 'id')

  if (!storeId) {
    throw createError({
      statusCode: 400,
      message: 'Store id is required'
    })
  }

  const store = await getOwnedStoreOrThrow(storeId, session.user.id)
  const now = new Date()

  await db.update(schema.stores)
    .set(buildDisconnectedStoreUpdate(now))
    .where(eq(schema.stores.id, store.id))

  await recordStoreAuthEvent({
    storeId: store.id,
    userId: store.userId,
    platform: store.platform,
    type: 'disconnected',
    message: '用户主动断开店铺授权。',
    now
  })

  const updatedStore = await getOwnedStoreOrThrow(store.id, session.user.id)

  return {
    success: true,
    store: toPublicStore(updatedStore)
  }
})
