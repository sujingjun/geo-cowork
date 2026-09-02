import type { Store } from '#shared/types/db'

/**
 * Amazon SP-API Client
 * Handles authentication and API calls to Amazon Selling Partner API
 */

export interface AmazonProduct {
  asin: string
  title: string
  price?: string
  currency?: string
  imageUrl?: string
  description?: string
  category?: string
}

export interface AmazonOAuthTokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
}

interface AmazonListingItem {
  sku: string
  summaries?: Array<{
    asin?: string
    itemName?: string
    productType?: string
    mainImage?: {
      link?: string
    }
  }>
  offers?: Array<{
    price?: {
      amount?: string
      currencyCode?: string
    }
  }>
}

interface AmazonListingsItemsResponse {
  items?: AmazonListingItem[]
}

interface AmazonMarketplaceParticipation {
  marketplace?: {
    id?: string
    name?: string
  }
}

interface AmazonMarketplaceParticipationsResponse {
  payload?: AmazonMarketplaceParticipation[]
}

type AmazonSpApiEnvironment = 'production' | 'sandbox'

export interface AmazonAuthState {
  nonce: string
  userId: string
  region: string
  marketplaceId: string
  redirectTo: string
  mode?: 'connect' | 'reauthorize'
  storeId?: string
  createdAt: number
}

export const AMAZON_AUTH_STATE_COOKIE = 'amazon_oauth_state'

const AMAZON_PRODUCTION_ENDPOINTS: Record<string, string> = {
  'us-east-1': 'https://sellingpartnerapi-na.amazon.com',
  'eu-west-1': 'https://sellingpartnerapi-eu.amazon.com',
  'us-west-2': 'https://sellingpartnerapi-fe.amazon.com'
}

const AMAZON_SANDBOX_ENDPOINTS: Record<string, string> = {
  'us-east-1': 'https://sandbox.sellingpartnerapi-na.amazon.com',
  'eu-west-1': 'https://sandbox.sellingpartnerapi-eu.amazon.com',
  'us-west-2': 'https://sandbox.sellingpartnerapi-fe.amazon.com'
}

function normalizeAmazonEnvironment(value?: string): AmazonSpApiEnvironment {
  return value === 'sandbox' ? 'sandbox' : 'production'
}

export function getAmazonSpApiEndpoint(region: string, configuredEndpoint?: string, environment?: string): string {
  if (configuredEndpoint)
    return configuredEndpoint

  const endpointMap = normalizeAmazonEnvironment(environment) === 'sandbox'
    ? AMAZON_SANDBOX_ENDPOINTS
    : AMAZON_PRODUCTION_ENDPOINTS

  return endpointMap[region] || endpointMap['us-east-1']!
}

export function getAmazonRedirectUri(): string {
  const config = useRuntimeConfig()
  return `${config.public.siteUrl || 'http://localhost:3000'}/auth/amazon`
}

export function getAmazonAuthConfig() {
  const config = useRuntimeConfig()
  const clientId = config.oauth.amazon.clientId
  const clientSecret = config.oauth.amazon.clientSecret
  const applicationId = config.amazon?.applicationId
  const sellerCentralAuthorizeUrl = config.amazon?.sellerCentralAuthorizeUrl || 'https://sellercentral.amazon.com/apps/authorize/consent'
  const authorizationVersion = config.amazon?.authorizationVersion
  const sandboxRefreshToken = config.amazon?.sandboxRefreshToken
  const region = config.amazon?.region || 'us-east-1'
  const marketplaceId = config.amazon?.marketplaceId || getMarketplaceId(region)
  const environment = normalizeAmazonEnvironment(config.amazon?.environment)

  return {
    clientId,
    clientSecret,
    applicationId,
    sellerCentralAuthorizeUrl,
    authorizationVersion,
    sandboxRefreshToken,
    region,
    marketplaceId,
    environment,
    spApiEndpoint: getAmazonSpApiEndpoint(region, config.amazon?.spApiEndpoint, environment)
  }
}

export function assertAmazonAuthConfig() {
  const config = getAmazonAuthConfig()
  const missing = []

  if (!config.clientId)
    missing.push('NUXT_OAUTH_AMAZON_CLIENT_ID or AMAZON_LWA_CLIENT_ID')
  if (!config.clientSecret)
    missing.push('NUXT_OAUTH_AMAZON_CLIENT_SECRET or AMAZON_LWA_CLIENT_SECRET')
  if (!config.applicationId)
    missing.push('AMAZON_SP_API_APPLICATION_ID')
  if (config.environment === 'sandbox' && !config.sandboxRefreshToken)
    missing.push('AMAZON_SP_API_SANDBOX_REFRESH_TOKEN')

  if (missing.length) {
    throw createError({
      statusCode: 503,
      message: `Amazon authorization is not configured. Missing: ${missing.join(', ')}`
    })
  }

  return config
}

export function createAmazonAuthorizationUrl(state: string): string {
  const config = assertAmazonAuthConfig()

  if (config.environment === 'sandbox') {
    const url = new URL(getAmazonRedirectUri())
    url.searchParams.set('sandbox', '1')
    url.searchParams.set('state', state)
    url.searchParams.set('spapi_oauth_code', 'sandbox-auth-code')
    url.searchParams.set('selling_partner_id', 'SANDBOX_SELLING_PARTNER')

    return url.toString()
  }

  const url = new URL(config.sellerCentralAuthorizeUrl)

  url.searchParams.set('application_id', config.applicationId)
  url.searchParams.set('state', state)
  if (config.authorizationVersion)
    url.searchParams.set('version', config.authorizationVersion)

  return url.toString()
}

export function createAmazonCallbackContinuationUrl(
  callbackUri: string,
  amazonState: string,
  state: string,
  redirectUri: string
): string {
  const config = assertAmazonAuthConfig()
  const url = new URL(callbackUri)

  url.searchParams.set('amazon_state', amazonState)
  url.searchParams.set('state', state)
  url.searchParams.set('redirect_uri', redirectUri)
  if (config.authorizationVersion)
    url.searchParams.set('version', config.authorizationVersion)

  return url.toString()
}

/**
 * Extract detailed error info from an Amazon LWA token endpoint error.
 * Amazon returns 400 with a JSON body containing `error` and `error_description`.
 */
function extractLwaTokenError(err: unknown, context: string): Error {
  const errAny = err as { data?: { error?: string, error_description?: string }, statusCode?: number, message?: string }
  const amazonError = errAny?.data?.error
  const amazonDesc = errAny?.data?.error_description
  const detail = amazonError
    ? `[${context}] Amazon LWA error: ${amazonError} — ${amazonDesc || 'no description'}`
    : `[${context}] LWA request failed: ${errAny?.message || String(err)}`

  console.error(detail, errAny?.data || '')

  return createError({
    statusCode: 502,
    message: amazonError
      ? `Amazon LWA rejected the token request: ${amazonError} (${amazonDesc || 'no description'})`
      : `Amazon LWA token request failed: ${errAny?.message || 'unknown error'}`
  })
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeAmazonAuthCode(
  code: string,
  redirectUri: string
): Promise<AmazonOAuthTokenResponse> {
  const config = assertAmazonAuthConfig()

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret
  })

  try {
    const response = await $fetch<AmazonOAuthTokenResponse>(
      'https://api.amazon.com/auth/o2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      }
    )

    return response
  } catch (err) {
    throw extractLwaTokenError(err, 'exchangeAmazonAuthCode')
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAmazonToken(
  refreshToken: string
): Promise<AmazonOAuthTokenResponse> {
  const config = assertAmazonAuthConfig()

  if (!refreshToken) {
    throw createError({
      statusCode: 502,
      message: 'Cannot refresh Amazon token: refresh token is empty.'
    })
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret
  })

  try {
    const response = await $fetch<AmazonOAuthTokenResponse>(
      'https://api.amazon.com/auth/o2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      }
    )

    return response
  } catch (err) {
    throw extractLwaTokenError(err, 'refreshAmazonToken')
  }
}

/**
 * Get valid access token, refresh if expired
 */
export async function getValidAccessToken(store: Store): Promise<string> {
  const now = new Date()
  const expiresAt = store.expiresAt

  // Refresh if token expires in less than 5 minutes
  if (expiresAt && expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    const tokenResponse = await refreshAmazonToken(store.refreshToken)

    // Update store with new tokens
    const { db, schema } = await import('hub:db')
    const { eq } = await import('drizzle-orm')

    await db.update(schema.stores).set({
      accessToken: tokenResponse.access_token,
      refreshToken: resolveAmazonRefreshToken(tokenResponse.refresh_token, store.refreshToken),
      expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000)
    }).where(eq(schema.stores.id, store.id))

    return tokenResponse.access_token
  }

  return store.accessToken
}

/**
 * Get Amazon Marketplace ID by region
 */
export function getMarketplaceId(region: string): string {
  const marketplaceMap: Record<string, string> = {
    'us-east-1': 'ATVPDKIKX0DER', // US
    'eu-west-1': 'A1F83G8C2ARO7P', // UK
    'us-west-2': 'A1AM78C64UM0Y8' // Mexico
  }
  return (marketplaceMap[region] || marketplaceMap['us-east-1'])!
}

export function normalizeAmazonCatalogPageSize(limit?: number): string {
  if (!limit)
    return '10'

  return Math.max(1, Math.min(20, Math.trunc(limit))).toString()
}

export function resolveAmazonRefreshToken(responseRefreshToken: string | undefined, currentRefreshToken: string): string {
  return responseRefreshToken || currentRefreshToken
}

export function buildAmazonListingsRequest(
  store: Pick<Store, 'storeId' | 'region' | 'marketplaceId'>,
  environment: AmazonSpApiEnvironment,
  limit?: number
): { path: string, params: URLSearchParams } {
  const marketplaceId = store.marketplaceId || getMarketplaceId(store.region)
  const params = environment === 'sandbox'
    ? new URLSearchParams({
        identifiersType: 'SKU',
        identifiers: 'GM-ZDPI-9B4E,HW-ZDPI-9B4E,TC-ZDPI-9B4E',
        marketplaceIds: marketplaceId,
        includedData: 'summaries,offers,fulfillmentAvailability,issues',
        pageSize: '1'
      })
    : new URLSearchParams({
        marketplaceIds: marketplaceId,
        includedData: 'summaries,offers,fulfillmentAvailability',
        pageSize: normalizeAmazonCatalogPageSize(limit)
      })

  return {
    path: `/listings/2021-08-01/items/${encodeURIComponent(store.storeId)}`,
    params
  }
}

export function mapAmazonListingItemToProduct(item: AmazonListingItem): AmazonProduct {
  const summary = item.summaries?.[0]
  const price = item.offers?.[0]?.price

  return {
    asin: summary?.asin || item.sku,
    title: summary?.itemName || summary?.asin || item.sku,
    price: price?.amount,
    currency: price?.currencyCode,
    imageUrl: summary?.mainImage?.link,
    description: undefined,
    category: summary?.productType
  }
}

/**
 * Fetch the selling partner's products from Amazon SP-API Listings Items API.
 * Uses LWA access token only — no AWS SigV4 signing required.
 */
export async function getAmazonProducts(
  store: Store,
  options: {
    limit?: number
  } = {}
): Promise<AmazonProduct[]> {
  const config = useRuntimeConfig()
  const environment = normalizeAmazonEnvironment(config.amazon?.environment)

  const accessToken = await getValidAccessToken(store)
  const request = buildAmazonListingsRequest(store, environment, options.limit)

  try {
    const endpoint = getAmazonSpApiEndpoint(store.region, config.amazon?.spApiEndpoint, environment)

    const response = await $fetch<AmazonListingsItemsResponse>(
      `${endpoint}${request.path}?${request.params.toString()}`,
      {
        headers: {
          'x-amz-access-token': accessToken,
          'content-type': 'application/json'
        }
      }
    )
    const products = response.items?.map(mapAmazonListingItemToProduct) || []

    return products
  } catch (error) {
    console.error('Error fetching Amazon products:', error)
    throw error
  }
}

/**
 * Get seller profile information
 */
export async function getAmazonSellerProfile(
  accessToken: string,
  _region: string
): Promise<{ sellerId: string, name: string }> {
  const config = useRuntimeConfig()
  const region = config.amazon?.region || _region || 'us-east-1'
  const endpoint = getAmazonSpApiEndpoint(region, config.amazon?.spApiEndpoint, config.amazon?.environment)

  try {
    const response = await $fetch<AmazonMarketplaceParticipationsResponse>(
      `${endpoint}/sellers/v1/marketplaceParticipations`,
      {
        headers: {
          'x-amz-access-token': accessToken,
          'Content-Type': 'application/json'
        }
      }
    )

    const participation = response.payload?.[0]
    return {
      sellerId: participation?.marketplace?.id || 'unknown',
      name: participation?.marketplace?.name || 'Amazon Store'
    }
  } catch (error) {
    console.error('Error fetching seller profile:', error)
    return {
      sellerId: 'unknown',
      name: 'Amazon Store'
    }
  }
}
