import { describe, expect, it } from 'vitest'
import {
  buildAuthExpiredStoreUpdate,
  buildDisconnectedStoreUpdate,
  buildStoreAuthEvent,
  getEffectiveStoreStatus,
  normalizeStoreError
} from './store-lifecycle'

describe('store lifecycle utilities', () => {
  const now = new Date('2026-06-19T10:00:00.000Z')

  it('derives expired status from token expiry when a store is otherwise connected', () => {
    expect(getEffectiveStoreStatus({
      status: 'connected',
      expiresAt: new Date('2026-06-19T09:59:00.000Z')
    }, now)).toBe('expired')
  })

  it('keeps disconnected status authoritative', () => {
    expect(getEffectiveStoreStatus({
      status: 'disconnected',
      expiresAt: new Date('2026-06-19T09:59:00.000Z')
    }, now)).toBe('disconnected')
  })

  it('builds a disconnect update that clears credentials and records diagnostics', () => {
    expect(buildDisconnectedStoreUpdate(now)).toMatchObject({
      accessToken: '',
      refreshToken: '',
      status: 'disconnected',
      lastSyncStatus: 'failed',
      disconnectedAt: now,
      diagnostics: {
        code: 'DISCONNECTED',
        action: 'REAUTHORIZE'
      }
    })
  })

  it('builds an expired-auth update with actionable diagnostics', () => {
    expect(buildAuthExpiredStoreUpdate('Token expired', now)).toMatchObject({
      status: 'expired',
      lastSyncStatus: 'failed',
      lastSyncError: 'Token expired',
      diagnostics: {
        code: 'AUTH_EXPIRED',
        action: 'REAUTHORIZE'
      }
    })
  })

  it('normalizes auth and rate limit failures into operator actions', () => {
    expect(normalizeStoreError({ statusCode: 401, message: 'Unauthorized' })).toMatchObject({
      code: 'AUTH_EXPIRED',
      action: 'REAUTHORIZE'
    })
    expect(normalizeStoreError({ statusCode: 429, message: 'Rate limited' })).toMatchObject({
      code: 'PLATFORM_API_ERROR',
      action: 'RETRY_LATER'
    })
  })

  it('builds auth events with serializable metadata', () => {
    expect(buildStoreAuthEvent({
      storeId: 'store-1',
      userId: 'user-1',
      platform: 'shopify',
      type: 'reauthorized',
      message: 'Store reauthorized',
      metadata: { shopDomain: '69geo.myshopify.com' },
      now
    })).toMatchObject({
      storeId: 'store-1',
      userId: 'user-1',
      platform: 'shopify',
      type: 'reauthorized',
      createdAt: now
    })
  })
})
