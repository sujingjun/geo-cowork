import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import {
  AMAZON_AUTH_STATE_COOKIE,
  createAmazonAuthorizationUrl,
  getAmazonAuthConfig,
  getAmazonRedirectUri
} from '../utils/amazon-sp-api'
import type { AmazonAuthState } from '../utils/amazon-sp-api'
import {
  createShopifyAuthorizationUrl,
  getShopifyRedirectUri,
  normalizeShopDomain,
  SHOPIFY_AUTH_STATE_COOKIE
} from '../utils/shopify-api'
import type { ShopifyAuthState } from '../utils/shopify-api'

/**
 * POST /api/stores
 * Starts the real Amazon Selling Partner OAuth authorization flow.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session?.user
  const { platform, shopDomain } = await readValidatedBody(event, z.object({
    platform: z.enum(['amazon', 'shopify']).default('amazon'),
    shopDomain: z.string().trim().optional()
  }).parse)

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.id, user.id)
  })

  if (!existingUser) {
    await db.insert(schema.users).values({
      id: user.id,
      email: user.email || `${user.id}@local.invalid`,
      name: user.name || user.username || 'User',
      avatar: user.avatar || 'https://avatar.vercel.sh/user',
      username: user.username || `user-${user.id.slice(0, 8)}`,
      provider: user.provider,
      providerId: user.providerId || user.id
    }).onConflictDoNothing()
  }

  if (platform === 'shopify') {
    if (!shopDomain) {
      throw createError({
        statusCode: 400,
        message: 'Shop domain is required for Shopify authorization'
      })
    }

    const normalizedShopDomain = normalizeShopDomain(shopDomain)
    const redirectUri = getShopifyRedirectUri()
    const nonce = crypto.randomUUID()
    const statePayload: ShopifyAuthState = {
      nonce,
      userId: user.id,
      shopDomain: normalizedShopDomain,
      redirectTo: '/stores?shopify_auth=success',
      mode: 'connect',
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
      platform,
      authorizationUrl: createShopifyAuthorizationUrl(normalizedShopDomain, nonce),
      expiresIn: 10 * 60
    }
  }

  const amazonConfig = getAmazonAuthConfig()
  const redirectUri = getAmazonRedirectUri()
  const nonce = crypto.randomUUID()
  const statePayload: AmazonAuthState = {
    nonce,
    userId: user.id,
    region: amazonConfig.region,
    marketplaceId: amazonConfig.marketplaceId,
    redirectTo: '/stores?amazon_auth=success',
    mode: 'connect',
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
    platform,
    authorizationUrl: createAmazonAuthorizationUrl(nonce),
    expiresIn: 10 * 60
  }
})
