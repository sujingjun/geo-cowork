import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Store } from '#shared/types/db'

export interface ShopifyAuthState {
  nonce: string
  userId: string
  shopDomain: string
  redirectTo: string
  mode?: 'connect' | 'reauthorize'
  storeId?: string
  createdAt: number
}

export interface ShopifyAccessTokenResponse {
  access_token: string
  scope?: string
}

export interface ShopifyShop {
  id: number
  name: string
  myshopify_domain: string
  domain?: string | null
  currency?: string | null
}

export interface ShopifyProductVariant {
  id: number
  title: string
  sku?: string | null
  price?: string | null
  inventory_quantity?: number | null
}

export interface ShopifyProduct {
  id: number
  title: string
  body_html?: string | null
  vendor?: string | null
  product_type?: string | null
  handle?: string | null
  tags?: string | null
  variants?: ShopifyProductVariant[]
  image?: {
    src?: string | null
  } | null
  images?: Array<{
    src?: string | null
  }>
}

export const SHOPIFY_AUTH_STATE_COOKIE = 'shopify_oauth_state'

export function normalizeShopDomain(shopDomain: string) {
  const sanitized = shopDomain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.myshopify\.com$/, '')

  if (!/^[a-z0-9][a-z0-9-]*$/.test(sanitized)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid Shopify shop domain'
    })
  }

  return `${sanitized}.myshopify.com`
}

export function getShopifyRedirectUri() {
  const config = useRuntimeConfig()
  return `${config.public.siteUrl || 'http://localhost:3000'}/auth/shopify`
}

export function getShopifyAuthConfig() {
  const config = useRuntimeConfig()

  return {
    clientId: config.oauth.shopify.clientId,
    clientSecret: config.oauth.shopify.clientSecret,
    scopes: config.shopify.scopes || 'read_products',
    apiVersion: config.shopify.apiVersion || '2024-10'
  }
}

export function assertShopifyAuthConfig() {
  const config = getShopifyAuthConfig()
  const missing = []

  if (!config.clientId)
    missing.push('NUXT_OAUTH_SHOPIFY_CLIENT_ID')
  if (!config.clientSecret)
    missing.push('NUXT_OAUTH_SHOPIFY_CLIENT_SECRET')

  if (missing.length) {
    throw createError({
      statusCode: 503,
      message: `Shopify authorization is not configured. Missing: ${missing.join(', ')}`
    })
  }

  return config
}

export function createShopifyAuthorizationUrl(shopDomain: string, state: string) {
  const config = assertShopifyAuthConfig()
  const normalizedShopDomain = normalizeShopDomain(shopDomain)
  const url = new URL(`https://${normalizedShopDomain}/admin/oauth/authorize`)

  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('scope', config.scopes)
  url.searchParams.set('redirect_uri', getShopifyRedirectUri())
  url.searchParams.set('state', state)

  return url.toString()
}

export function verifyShopifyCallbackHmac(
  query: Record<string, string | undefined>,
  secret: string
) {
  const provided = query.hmac
  if (!provided)
    return false

  const message = Object.keys(query)
    .filter(key => key !== 'hmac' && key !== 'signature' && query[key] !== undefined)
    .sort()
    .map(key => `${key}=${query[key]}`)
    .join('&')

  const digest = createHmac('sha256', secret).update(message).digest('hex')

  const providedBuffer = Buffer.from(provided, 'utf8')
  const digestBuffer = Buffer.from(digest, 'utf8')

  if (providedBuffer.length !== digestBuffer.length)
    return false

  return timingSafeEqual(providedBuffer, digestBuffer)
}

export async function exchangeShopifyAuthCode(shopDomain: string, code: string) {
  const config = assertShopifyAuthConfig()
  const normalizedShopDomain = normalizeShopDomain(shopDomain)

  return await $fetch<ShopifyAccessTokenResponse>(`https://${normalizedShopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    body: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code
    }
  })
}

export async function getShopifyShopProfile(shopDomain: string, accessToken: string) {
  const config = assertShopifyAuthConfig()
  const normalizedShopDomain = normalizeShopDomain(shopDomain)
  const response = await $fetch<{ shop: ShopifyShop }>(`https://${normalizedShopDomain}/admin/api/${config.apiVersion}/shop.json`, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    }
  })

  return response.shop
}

export function createShopifyProductUrl(shopDomain: string, handle: string | null | undefined) {
  const normalizedShopDomain = normalizeShopDomain(shopDomain)

  if (!handle)
    return `https://${normalizedShopDomain}`

  return `https://${normalizedShopDomain}/products/${handle}`
}

function stripHtml(html: string | null | undefined) {
  if (!html)
    return null

  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || null
}

export function mapShopifyProductToCatalogProduct(
  product: ShopifyProduct,
  shopDomain: string,
  defaultCurrency = 'USD'
) {
  const tags = (product.tags || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
  const primaryVariant = product.variants?.[0]
  const imageUrl = product.image?.src || product.images?.[0]?.src || null

  return {
    externalProductId: String(product.id),
    title: product.title,
    price: primaryVariant?.price || null,
    currency: defaultCurrency,
    imageUrl,
    description: stripHtml(product.body_html),
    category: product.product_type || null,
    platformHandle: product.handle || null,
    productUrl: createShopifyProductUrl(shopDomain, product.handle),
    vendor: product.vendor || null,
    productType: product.product_type || null,
    tags,
    variants: (product.variants || []).map(variant => ({
      id: String(variant.id),
      title: variant.title,
      sku: variant.sku || null,
      price: variant.price || null,
      currency: defaultCurrency,
      inventoryQuantity: variant.inventory_quantity ?? null
    })),
    rawData: product
  }
}

export async function getShopifyProducts(
  store: Store,
  options: { limit?: number } = {}
) {
  if (!store.shopDomain) {
    throw createError({
      statusCode: 400,
      message: 'Shopify store is missing shop domain metadata'
    })
  }

  const config = assertShopifyAuthConfig()
  const limit = Math.min(options.limit || 50, 100)
  const normalizedShopDomain = normalizeShopDomain(store.shopDomain)
  const response = await $fetch<{ products: ShopifyProduct[] }>(
    `https://${normalizedShopDomain}/admin/api/${config.apiVersion}/products.json`,
    {
      query: {
        limit,
        fields: 'id,title,body_html,vendor,product_type,handle,tags,variants,image,images'
      },
      headers: {
        'X-Shopify-Access-Token': store.accessToken,
        'Content-Type': 'application/json'
      }
    }
  )

  return response.products || []
}
