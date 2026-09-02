import { getTableColumns } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { products, sites, storeAuthEvents, storeSyncLogs, stores } from './schema'

function enumValuesOf(column: { enumValues: readonly string[] }) {
  return column.enumValues
}

describe('database schema', () => {
  it('supports universal product fields for multiple commerce platforms', () => {
    const productColumns = getTableColumns(products)

    expect(Object.keys(productColumns)).toEqual(expect.arrayContaining([
      'externalProductId',
      'platformHandle',
      'productUrl',
      'vendor',
      'productType',
      'tags',
      'variants',
      'rawData'
    ]))
    expect(enumValuesOf(stores.platform)).toContain('shopify')
  })

  it('defines site type with internal and shopify-external values', () => {
    const siteColumns = getTableColumns(sites)

    expect(sites.siteType).toBeDefined()
    expect(enumValuesOf(sites.siteType)).toEqual(['internal', 'shopify-external'])
    expect(Object.keys(siteColumns)).toContain('builderConfig')
  })

  it('tracks store lifecycle state and diagnostics', () => {
    const storeColumns = getTableColumns(stores)

    expect(Object.keys(storeColumns)).toEqual(expect.arrayContaining([
      'status',
      'lastSyncedAt',
      'lastSyncStatus',
      'lastSyncError',
      'lastDiagnosedAt',
      'diagnostics',
      'disconnectedAt',
      'reauthorizedAt'
    ]))
    expect(enumValuesOf(stores.status)).toEqual(['connected', 'disconnected', 'expired', 'error'])
    expect(enumValuesOf(stores.lastSyncStatus)).toEqual(['success', 'failed', 'partial', 'never'])
  })

  it('defines auth events and sync logs for store operations', () => {
    expect(enumValuesOf(storeAuthEvents.type)).toEqual([
      'authorized',
      'reauthorized',
      'disconnected',
      'expired',
      'reconnect_failed'
    ])
    expect(enumValuesOf(storeSyncLogs.status)).toEqual(['success', 'failed', 'partial'])
  })
})
