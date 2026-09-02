import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'
import type { H3Event } from 'h3'
import {
  AMAZON_AUTH_STATE_COOKIE,
  createAmazonCallbackContinuationUrl,
  exchangeAmazonAuthCode,
  getAmazonAuthConfig,
  getAmazonRedirectUri,
  refreshAmazonToken,
  resolveAmazonRefreshToken
} from '../../utils/amazon-sp-api'
import type { AmazonAuthState } from '../../utils/amazon-sp-api'
import { recordStoreAuthEvent } from '../../utils/store-management'

function popupResponse(status: 'success' | 'error', message: string, redirectTo = '/stores') {
  const safeStatus = JSON.stringify(status)
  const safeMessage = JSON.stringify(message)
  const safeRedirectTo = JSON.stringify(redirectTo)

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Amazon authorization ${status}</title>
  </head>
  <body>
    <script>
      const payload = { provider: 'amazon', status: ${safeStatus}, message: ${safeMessage}, redirectTo: ${safeRedirectTo} };
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'amazon-auth', payload }, window.location.origin);
      }
      window.location.replace(${safeRedirectTo});
      window.close();
    </script>
    <p>${status === 'success' ? 'Amazon authorization completed.' : 'Amazon authorization failed.'}</p>
  </body>
</html>`
}

function readAmazonState(event: H3Event): AmazonAuthState | null {
  const rawState = getCookie(event, AMAZON_AUTH_STATE_COOKIE)

  if (!rawState)
    return null

  try {
    return JSON.parse(rawState) as AmazonAuthState
  } catch {
    return null
  }
}

/**
 * Amazon OAuth Callback Handler
 * Stores Amazon Selling Partner authorization tokens.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const error = query.error as string | undefined
  const returnedState = query.state as string | undefined
  const spApiOAuthCode = (query.spapi_oauth_code || query.code) as string | undefined
  const sellingPartnerId = query.selling_partner_id as string | undefined
  const amazonCallbackUri = query.amazon_callback_uri as string | undefined
  const amazonState = query.amazon_state as string | undefined

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setHeader(event, 'Referrer-Policy', 'no-referrer')

  if (error) {
    console.error('Amazon OAuth error:', error)
    return popupResponse('error', 'Amazon authorization was cancelled or denied.', '/stores?amazon_auth=error')
  }

  const state = readAmazonState(event)

  if (amazonCallbackUri && amazonState) {
    if (!state || Date.now() - state.createdAt > 10 * 60 * 1000) {
      return popupResponse('error', 'Amazon authorization state is invalid or expired.', '/stores?amazon_auth=invalid_state')
    }

    const redirectUri = getAmazonRedirectUri()
    return sendRedirect(
      event,
      createAmazonCallbackContinuationUrl(amazonCallbackUri, amazonState, state.nonce, redirectUri)
    )
  }

  deleteCookie(event, AMAZON_AUTH_STATE_COOKIE, { path: '/' })

  if (!state || !returnedState || state.nonce !== returnedState) {
    return popupResponse('error', 'Amazon authorization state is invalid or expired.', '/stores?amazon_auth=invalid_state')
  }

  if (Date.now() - state.createdAt > 10 * 60 * 1000) {
    return popupResponse('error', 'Amazon authorization state expired. Please try again.', '/stores?amazon_auth=expired')
  }

  if (!spApiOAuthCode) {
    return popupResponse('error', 'Amazon did not return an authorization code.', '/stores?amazon_auth=missing_code')
  }

  try {
    const session = await getUserSession(event)

    if (!session?.user?.id || session.user.id !== state.userId) {
      return popupResponse('error', 'Please sign in again before connecting Amazon.', '/stores?amazon_auth=not_authenticated')
    }

    const amazonConfig = getAmazonAuthConfig()
    const tokenResponse = amazonConfig.environment === 'sandbox'
      ? await refreshAmazonToken(amazonConfig.sandboxRefreshToken || '')
      : await exchangeAmazonAuthCode(spApiOAuthCode, getAmazonRedirectUri())
    const refreshToken = resolveAmazonRefreshToken(
      tokenResponse.refresh_token,
      amazonConfig.environment === 'sandbox' ? amazonConfig.sandboxRefreshToken || '' : ''
    )

    if (!refreshToken) {
      throw createError({
        statusCode: 502,
        message: 'Amazon did not return a refresh token.'
      })
    }

    const storeExternalId = sellingPartnerId || `amazon-${session.user.id}`
    let storeName = 'Amazon Store'

    if (amazonConfig.environment === 'sandbox')
      storeName = 'Amazon Sandbox Test Store'
    else if (sellingPartnerId)
      storeName = `Amazon Store ${sellingPartnerId}`

    const existingStore = state.mode === 'reauthorize' && state.storeId
      ? await db.query.stores.findFirst({
          where: and(
            eq(schema.stores.id, state.storeId),
            eq(schema.stores.userId, session.user.id)
          )
        })
      : await db.query.stores.findFirst({
          where: and(
            eq(schema.stores.userId, session.user.id),
            eq(schema.stores.storeId, storeExternalId)
          )
        })

    if (state.mode === 'reauthorize' && !existingStore) {
      return popupResponse('error', 'The Amazon store to reauthorize was not found.', '/stores?amazon_auth=store_not_found')
    }

    const storeValues = {
      accessToken: tokenResponse.access_token,
      refreshToken,
      expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
      storeName,
      region: state.region,
      marketplaceId: state.marketplaceId,
      status: 'connected' as const,
      lastSyncError: null,
      lastDiagnosedAt: null,
      diagnostics: null,
      disconnectedAt: null,
      reauthorizedAt: state.mode === 'reauthorize' ? new Date() : null
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
        platform: 'amazon',
        storeId: storeExternalId,
        ...storeValues
      })
    }

    await recordStoreAuthEvent({
      storeId: targetStoreId,
      userId: session.user.id,
      platform: 'amazon',
      type: state.mode === 'reauthorize' ? 'reauthorized' : 'authorized',
      message: state.mode === 'reauthorize'
        ? 'Amazon 店铺已重新授权。'
        : 'Amazon 店铺已完成授权。',
      metadata: {
        marketplaceId: state.marketplaceId,
        region: state.region
      }
    })

    return popupResponse('success', state.mode === 'reauthorize' ? 'Amazon store reauthorized successfully.' : 'Amazon store connected successfully.', state.redirectTo)
  } catch (callbackError) {
    const errAny = callbackError as { data?: { error?: string, error_description?: string }, message?: string }
    const amazonError = errAny?.data?.error || errAny?.message || 'unknown'
    const amazonDesc = errAny?.data?.error_description || ''
    console.error('Error processing Amazon OAuth callback:', {
      message: errAny?.message || String(callbackError),
      amazonError,
      amazonDescription: amazonDesc,
      data: errAny?.data
    })
    const userMessage = amazonError === 'invalid_grant'
      ? 'Amazon refresh token is expired or revoked. Please regenerate it in the Solution Provider Portal.'
      : amazonError === 'invalid_client'
        ? 'Amazon LWA client credentials are invalid or do not match the token.'
        : 'Failed to complete Amazon authorization.'
    return popupResponse('error', userMessage, '/stores?amazon_auth=callback_failed')
  }
})
