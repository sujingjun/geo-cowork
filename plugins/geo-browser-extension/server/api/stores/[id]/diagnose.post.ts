import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { buildAuthExpiredStoreUpdate, buildDiagnostics, getEffectiveStoreStatus, normalizeStoreError } from '#shared/utils'
import { getValidAccessToken } from '../../../utils/amazon-sp-api'
import { getShopifyShopProfile } from '../../../utils/shopify-api'
import {
  buildHealthyDiagnostics,
  getOwnedStoreOrThrow,
  recordStoreAuthEvent,
  toPublicStore
} from '../../../utils/store-management'

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
  const effectiveStatus = getEffectiveStoreStatus(store, now)

  if (effectiveStatus === 'disconnected') {
    const diagnostics = buildDiagnostics({
      status: 'disconnected',
      code: 'DISCONNECTED',
      action: 'REAUTHORIZE',
      message: '店铺授权已断开，需要重新授权。',
      checks: [
        {
          name: '授权连接',
          status: 'fail',
          message: '当前店铺没有可用访问令牌。'
        }
      ]
    })

    await db.update(schema.stores)
      .set({
        lastDiagnosedAt: now,
        diagnostics
      })
      .where(eq(schema.stores.id, store.id))

    return {
      success: true,
      diagnostics,
      store: toPublicStore(await getOwnedStoreOrThrow(store.id, session.user.id))
    }
  }

  if (!store.accessToken) {
    const updateValues = buildAuthExpiredStoreUpdate('店铺访问令牌缺失，请重新授权。', now)
    await db.update(schema.stores)
      .set(updateValues)
      .where(eq(schema.stores.id, store.id))

    await recordStoreAuthEvent({
      storeId: store.id,
      userId: store.userId,
      platform: store.platform,
      type: 'expired',
      message: updateValues.lastSyncError,
      now
    })

    return {
      success: true,
      diagnostics: updateValues.diagnostics,
      store: toPublicStore(await getOwnedStoreOrThrow(store.id, session.user.id))
    }
  }

  try {
    if (store.platform === 'shopify') {
      if (!store.shopDomain) {
        throw createError({
          statusCode: 400,
          message: 'Shopify shop domain is missing'
        })
      }

      await getShopifyShopProfile(store.shopDomain, store.accessToken)
    } else {
      await getValidAccessToken(store)
    }

    const diagnostics = buildHealthyDiagnostics()

    await db.update(schema.stores)
      .set({
        status: 'connected',
        lastDiagnosedAt: now,
        diagnostics,
        lastSyncError: null
      })
      .where(eq(schema.stores.id, store.id))

    return {
      success: true,
      diagnostics,
      store: toPublicStore(await getOwnedStoreOrThrow(store.id, session.user.id))
    }
  } catch (error) {
    const normalized = normalizeStoreError(error)
    const diagnostics = buildDiagnostics({
      status: normalized.status,
      code: normalized.code,
      action: normalized.action,
      message: normalized.message,
      checks: [
        {
          name: normalized.code === 'AUTH_EXPIRED' ? '授权有效性' : '平台接口',
          status: 'fail',
          message: normalized.message
        }
      ]
    })

    await db.update(schema.stores)
      .set({
        status: normalized.status,
        lastDiagnosedAt: now,
        diagnostics,
        lastSyncError: normalized.message
      })
      .where(eq(schema.stores.id, store.id))

    if (normalized.status === 'expired') {
      await recordStoreAuthEvent({
        storeId: store.id,
        userId: store.userId,
        platform: store.platform,
        type: 'expired',
        message: normalized.message,
        now
      })
    }

    return {
      success: true,
      diagnostics,
      store: toPublicStore(await getOwnedStoreOrThrow(store.id, session.user.id))
    }
  }
})
