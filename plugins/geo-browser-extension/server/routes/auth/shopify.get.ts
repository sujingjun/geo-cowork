import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'
import type { H3Event } from 'h3'
import {
  exchangeShopifyAuthCode,
  getShopifyShopProfile,
  normalizeShopDomain,
  SHOPIFY_AUTH_STATE_COOKIE,
  verifyShopifyCallbackHmac
} from '../../utils/shopify-api'
import type { ShopifyAuthState } from '../../utils/shopify-api'
import { recordStoreAuthEvent } from '../../utils/store-management'

function popupResponse(status: 'success' | 'error', message: string, redirectTo = '/stores') {
  const safeStatus = JSON.stringify(status)
  const safeMessage = JSON.stringify(message)
  const safeRedirectTo = JSON.stringify(redirectTo)

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Shopify authorization ${status}</title>
  </head>
  <body>
    <script>
      const payload = { provider: 'shopify', status: ${safeStatus}, message: ${safeMessage}, redirectTo: ${safeRedirectTo} };
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'shopify-auth', payload }, window.location.origin);
      }
      window.location.replace(${safeRedirectTo});
      window.close();
    </script>
    <p>${status === 'success' ? 'Shopify authorization completed.' : 'Shopify authorization failed.'}</p>
  </body>
</html>`
}

function readShopifyState(event: H3Event) {
  const rawState = getCookie(event, SHOPIFY_AUTH_STATE_COOKIE)

  if (!rawState)
    return null

  try {
    return JSON.parse(rawState) as ShopifyAuthState
  } catch {
    return null
  }
}

function getStringQueryParams(query: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value === undefined ? undefined : String(value)
    ])
  ) as Record<string, string | undefined>
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string | undefined
  const state = query.state as string | undefined
  const shop = query.shop as string | undefined
  const hmac = query.hmac as string | undefined

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setHeader(event, 'Referrer-Policy', 'no-referrer')

  const authState = readShopifyState(event)
  deleteCookie(event, SHOPIFY_AUTH_STATE_COOKIE, { path: '/' })

  if (!authState || !state || authState.nonce !== state) {
    return popupResponse('error', 'Shopify authorization state is invalid or expired.', '/stores?shopify_auth=invalid_state')
  }

  if (Date.now() - authState.createdAt > 10 * 60 * 1000) {
    return popupResponse('error', 'Shopify authorization state expired. Please try again.', '/stores?shopify_auth=expired')
  }

  if (!code || !shop || !hmac) {
    return popupResponse('error', 'Shopify did not return a complete authorization response.', '/stores?shopify_auth=missing_code')
  }

  let normalizedShop: string

  try {
    normalizedShop = normalizeShopDomain(shop)
  } catch {
    return popupResponse('error', 'Shopify returned an invalid shop domain.', '/stores?shopify_auth=invalid_shop')
  }

  if (normalizedShop !== authState.shopDomain) {
    return popupResponse('error', 'Shopify authorization shop mismatch.', '/stores?shopify_auth=invalid_shop')
  }

  const config = useRuntimeConfig(event)
  if (!verifyShopifyCallbackHmac(getStringQueryParams(query), config.oauth.shopify.clientSecret)) {
    return popupResponse('error', 'Shopify authorization signature is invalid.', '/stores?shopify_auth=invalid_signature')
  }

  try {
    const session = await getUserSession(event)

    if (!session?.user?.id || session.user.id !== authState.userId) {
      return popupResponse('error', 'Please sign in again before connecting Shopify.', '/stores?shopify_auth=not_authenticated')
    }

    const tokenResponse = await exchangeShopifyAuthCode(shop, code)
    const shopProfile = await getShopifyShopProfile(shop, tokenResponse.access_token)
    const storeExternalId = String(shopProfile.id)

    const existingStore = authState.mode === 'reauthorize' && authState.storeId
      ? await db.query.stores.findFirst({
          where: and(
            eq(schema.stores.id, authState.storeId),
            eq(schema.stores.userId, session.user.id)
          )
        })
      : await db.query.stores.findFirst({
          where: and(
            eq(schema.stores.userId, session.user.id),
            eq(schema.stores.storeId, storeExternalId)
          )
        })

    if (authState.mode === 'reauthorize' && !existingStore) {
      return popupResponse('error', 'The Shopify store to reauthorize was not found.', '/stores?shopify_auth=store_not_found')
    }

    const storeValues = {
      accessToken: tokenResponse.access_token,
      refreshToken: '',
      expiresAt: null,
      storeName: shopProfile.name,
      region: 'global',
      marketplaceId: null,
      shopDomain: shopProfile.myshopify_domain,
      scopes: tokenResponse.scope || null,
      status: 'connected' as const,
      lastSyncError: null,
      lastDiagnosedAt: null,
      diagnostics: null,
      disconnectedAt: null,
      reauthorizedAt: authState.mode === 'reauthorize' ? new Date() : null
    }
    const targetStoreId = existingStore?.id || crypto.randomUUID()

    if (existingStore) {
      await db.update(schema.stores)
        .set(storeValues)
        .where(eq(schema.stores.id, existingStore.id))
    } else {
      await db.insert(schema.stores).values({
        id: targetStoreId,
        userId: session.user.id,
        platform: 'shopify',
        storeId: storeExternalId,
        ...storeValues
      })
    }

    await recordStoreAuthEvent({
      storeId: targetStoreId,
      userId: session.user.id,
      platform: 'shopify',
      type: authState.mode === 'reauthorize' ? 'reauthorized' : 'authorized',
      message: authState.mode === 'reauthorize'
        ? 'Shopify 店铺已重新授权。'
        : 'Shopify 店铺已完成授权。',
      metadata: {
        shopDomain: shopProfile.myshopify_domain,
        scopes: tokenResponse.scope || null
      }
    })

    return popupResponse('success', authState.mode === 'reauthorize' ? 'Shopify store reauthorized successfully.' : 'Shopify store connected successfully.', authState.redirectTo)
  } catch (error) {
    console.error('Error processing Shopify OAuth callback:', error)
    return popupResponse('error', 'Failed to complete Shopify authorization.', '/stores?shopify_auth=callback_failed')
  }
})
