import { db, schema } from 'hub:db'
import { eq, and } from 'drizzle-orm'
import { buildDiagnostics, getEffectiveStoreStatus } from '#shared/utils'
import { getAmazonProducts } from '../../../utils/amazon-sp-api'
import { getShopifyProducts, getShopifyShopProfile, mapShopifyProductToCatalogProduct } from '../../../utils/shopify-api'
import {
  buildHealthyDiagnostics,
  markStoreOperationFailure,
  recordStoreSyncLog
} from '../../../utils/store-management'
import type { Store } from '#shared/types/db'

type SyncableProductValues = {
  asin: string | null
  externalProductId: string
  title: string
  price: string | null
  currency: string | null
  imageUrl: string | null
  description: string | null
  category: string | null
  platformHandle: string | null
  productUrl: string | null
  vendor: string | null
  productType: string | null
  tags: string[]
  variants: Array<{
    id: string
    title: string
    sku?: string | null
    price?: string | null
    currency?: string | null
    inventoryQuantity?: number | null
  }>
  rawData: Record<string, unknown>
}

async function getStoreProductValues(store: Store): Promise<SyncableProductValues[]> {
  if (store.platform === 'shopify') {
    if (!store.shopDomain) {
      throw createError({
        statusCode: 400,
        message: 'Shopify store is missing shop domain metadata'
      })
    }

    const shopDomain = store.shopDomain
    const shopProfile = await getShopifyShopProfile(shopDomain, store.accessToken)
    const shopifyProducts = await getShopifyProducts(store, { limit: 100 })
    const defaultCurrency = shopProfile.currency || 'USD'

    return shopifyProducts.map(product => ({
      asin: null,
      ...mapShopifyProductToCatalogProduct(product, shopDomain, defaultCurrency),
      rawData: product as unknown as Record<string, unknown>
    }))
  }

  const amazonProducts = await getAmazonProducts(store, {
    limit: 100
  })

  return amazonProducts.map(product => ({
    asin: product.asin,
    externalProductId: product.asin,
    title: product.title,
    price: product.price || null,
    currency: product.currency || 'USD',
    imageUrl: product.imageUrl || null,
    description: product.description || null,
    category: product.category || null,
    platformHandle: null,
    productUrl: `https://amazon.com/dp/${product.asin}`,
    vendor: null,
    productType: product.category || null,
    tags: [],
    variants: [],
    rawData: product as unknown as Record<string, unknown>
  }))
}

/**
 * POST /api/stores/[id]/sync
 * Sync products from a connected store
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const storeId = getRouterParam(event, 'id')
  if (!storeId) {
    throw createError({
      statusCode: 400,
      message: 'Store ID is required'
    })
  }

  // Verify store belongs to user
  const store = await db.query.stores.findFirst({
    where: and(
      eq(schema.stores.id, storeId),
      eq(schema.stores.userId, session.user.id)
    )
  })

  if (!store) {
    throw createError({
      statusCode: 404,
      message: 'Store not found'
    })
  }

  const effectiveStatus = getEffectiveStoreStatus(store)
  if (effectiveStatus === 'disconnected') {
    throw createError({
      statusCode: 409,
      message: '店铺授权已断开，请重新授权后再同步商品。'
    })
  }

  if (effectiveStatus === 'expired' || !store.accessToken) {
    await markStoreOperationFailure(store, createError({
      statusCode: 401,
      message: '店铺授权已过期，请重新授权后再同步商品。'
    }))

    throw createError({
      statusCode: 401,
      message: '店铺授权已过期，请重新授权后再同步商品。'
    })
  }

  try {
    const productsToSync = await getStoreProductValues(store)

    const syncedProducts = []
    let createdCount = 0
    let updatedCount = 0
    const syncedAt = new Date()

    for (const productValues of productsToSync) {
      const existingProduct = await db.query.products.findFirst({
        where: and(
          eq(schema.products.storeId, storeId),
          eq(schema.products.externalProductId, productValues.externalProductId)
        )
      })

      if (existingProduct) {
        const [updatedProduct] = await db.update(schema.products).set({
          ...productValues,
          lastSyncedAt: syncedAt
        }).where(eq(schema.products.id, existingProduct.id)).returning()

        if (updatedProduct) {
          syncedProducts.push(updatedProduct)
          updatedCount += 1
        }
      } else {
        const [newProduct] = await db.insert(schema.products).values({
          id: crypto.randomUUID(),
          storeId,
          ...productValues,
          lastSyncedAt: syncedAt
        }).returning()

        if (newProduct) {
          syncedProducts.push(newProduct)
          createdCount += 1
        }
      }
    }

    const diagnostics = buildHealthyDiagnostics('商品同步成功，店铺授权当前可用。')

    await db.update(schema.stores)
      .set({
        status: 'connected',
        lastSyncedAt: syncedAt,
        lastSyncStatus: 'success',
        lastSyncError: null,
        lastDiagnosedAt: syncedAt,
        diagnostics
      })
      .where(eq(schema.stores.id, store.id))

    await recordStoreSyncLog({
      store,
      status: 'success',
      syncedCount: syncedProducts.length,
      createdCount,
      updatedCount,
      failedCount: 0,
      message: `同步成功：新增 ${createdCount} 个，更新 ${updatedCount} 个。`,
      diagnostics
    })

    return {
      success: true,
      platform: store.platform,
      synced: syncedProducts.length,
      created: createdCount,
      updated: updatedCount,
      products: syncedProducts
    }
  } catch (error: unknown) {
    console.error('Error syncing products:', error)
    const normalized = await markStoreOperationFailure(store, error)
    const diagnostics = buildDiagnostics({
      status: normalized.status,
      code: normalized.code,
      action: normalized.action,
      message: normalized.message
    })

    throw createError({
      statusCode: normalized.status === 'expired' ? 401 : 500,
      message: diagnostics.message
    })
  }
})
