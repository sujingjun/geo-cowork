import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'
import {
  buildAuthExpiredStoreUpdate,
  buildDiagnostics,
  buildStoreAuthEvent,
  getEffectiveStoreStatus,
  normalizeStoreError
} from '#shared/utils'
import type { StoreDiagnostics } from '#shared/utils'

type Store = typeof schema.stores.$inferSelect

export async function getOwnedStoreOrThrow(storeId: string, userId: string) {
  const store = await db.query.stores.findFirst({
    where: and(
      eq(schema.stores.id, storeId),
      eq(schema.stores.userId, userId)
    )
  })

  if (!store) {
    throw createError({
      statusCode: 404,
      message: 'Store not found'
    })
  }

  return store
}

export function toPublicStore(store: Store) {
  return {
    id: store.id,
    userId: store.userId,
    platform: store.platform,
    storeId: store.storeId,
    storeName: store.storeName,
    region: store.region,
    marketplaceId: store.marketplaceId,
    shopDomain: store.shopDomain,
    scopes: store.scopes,
    expiresAt: store.expiresAt,
    status: getEffectiveStoreStatus(store),
    lastSyncedAt: store.lastSyncedAt,
    lastSyncStatus: store.lastSyncStatus,
    lastSyncError: store.lastSyncError,
    lastDiagnosedAt: store.lastDiagnosedAt,
    diagnostics: store.diagnostics,
    disconnectedAt: store.disconnectedAt,
    reauthorizedAt: store.reauthorizedAt,
    createdAt: store.createdAt
  }
}

export async function recordStoreAuthEvent(input: {
  storeId: string
  userId: string
  platform: 'amazon' | 'shopify'
  type: 'authorized' | 'reauthorized' | 'disconnected' | 'expired' | 'reconnect_failed'
  message: string
  metadata?: Record<string, unknown> | null
  now?: Date
}) {
  await db.insert(schema.storeAuthEvents).values(buildStoreAuthEvent(input))
}

export async function recordStoreSyncLog(input: {
  store: Store
  status: 'success' | 'failed' | 'partial'
  syncedCount?: number
  createdCount?: number
  updatedCount?: number
  failedCount?: number
  message?: string | null
  diagnostics?: StoreDiagnostics | null
}) {
  await db.insert(schema.storeSyncLogs).values({
    storeId: input.store.id,
    userId: input.store.userId,
    platform: input.store.platform,
    status: input.status,
    syncedCount: input.syncedCount || 0,
    createdCount: input.createdCount || 0,
    updatedCount: input.updatedCount || 0,
    failedCount: input.failedCount || 0,
    message: input.message || null,
    diagnostics: input.diagnostics || null
  })
}

export function buildHealthyDiagnostics(message = '店铺授权可用，可以同步商品。'): StoreDiagnostics {
  return buildDiagnostics({
    status: 'healthy',
    action: 'NONE',
    message,
    checks: [
      {
        name: '授权连接',
        status: 'pass',
        message: '平台授权令牌当前可用。'
      }
    ]
  })
}

export async function markStoreOperationFailure(store: Store, error: unknown, now = new Date()) {
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

  const updateValues = normalized.status === 'expired'
    ? buildAuthExpiredStoreUpdate(normalized.message, now)
    : {
        status: normalized.status,
        lastSyncStatus: 'failed' as const,
        lastSyncError: normalized.message,
        lastDiagnosedAt: now,
        diagnostics
      }

  await db.update(schema.stores)
    .set(updateValues)
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

  await recordStoreSyncLog({
    store,
    status: 'failed',
    message: normalized.message,
    diagnostics
  })

  return normalized
}
