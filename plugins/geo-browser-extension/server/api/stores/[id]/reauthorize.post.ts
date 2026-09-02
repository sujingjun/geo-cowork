import {
  AMAZON_AUTH_STATE_COOKIE,
  createAmazonAuthorizationUrl,
  getAmazonRedirectUri
} from '../../../utils/amazon-sp-api'
import type { AmazonAuthState } from '../../../utils/amazon-sp-api'
import {
  createShopifyAuthorizationUrl,
  getShopifyRedirectUri,
  SHOPIFY_AUTH_STATE_COOKIE
} from '../../../utils/shopify-api'
import type { ShopifyAuthState } from '../../../utils/shopify-api'
import { getOwnedStoreOrThrow } from '../../../utils/store-management'

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
  const nonce = crypto.randomUUID()

  if (store.platform === 'shopify') {
    if (!store.shopDomain) {
      throw createError({
        statusCode: 400,
        message: 'Shopify shop domain is missing'
      })
    }

    const redirectUri = getShopifyRedirectUri()
    const statePayload: ShopifyAuthState = {
      nonce,
      userId: session.user.id,
      shopDomain: store.shopDomain,
      redirectTo: '/stores?shopify_auth=reauthorized',
      mode: 'reauthorize',
      storeId: store.id,
      createdAt: Date.now()
    }

    setCookie(event, SHOPIFY_AUTH_STATE_COOKIE, JSON.stringify(statePayload), {
      httpOnly: true,
      secure: redirectUri.startsWith('https://'),
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60
    })

    return {
      success: true,
      platform: store.platform,
      authorizationUrl: createShopifyAuthorizationUrl(store.shopDomain, nonce),
      expiresIn: 10 * 60
    }
  }

  const redirectUri = getAmazonRedirectUri()
  const statePayload: AmazonAuthState = {
    nonce,
    userId: session.user.id,
    region: store.region,
    marketplaceId: store.marketplaceId || '',
    redirectTo: '/stores?amazon_auth=reauthorized',
    mode: 'reauthorize',
    storeId: store.id,
    createdAt: Date.now()
  }

  setCookie(event, AMAZON_AUTH_STATE_COOKIE, JSON.stringify(statePayload), {
    httpOnly: true,
    secure: redirectUri.startsWith('https://'),
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60
  })

  return {
    success: true,
    platform: store.platform,
    authorizationUrl: createAmazonAuthorizationUrl(nonce),
    expiresIn: 10 * 60
  }
})
