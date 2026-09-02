export type StorePlatform = 'amazon' | 'shopify'

export const STORE_PLATFORM_OPTIONS = [
  {
    label: 'Amazon',
    value: 'amazon',
    icon: 'i-simple-icons-amazon'
  },
  {
    label: 'Shopify',
    value: 'shopify',
    icon: 'i-simple-icons-shopify'
  }
] as const

export function getPlatformLabel(platform: string | null | undefined) {
  switch (platform) {
    case 'amazon':
      return 'Amazon'
    case 'shopify':
      return 'Shopify'
    default:
      return platform || 'Unknown'
  }
}

export function getPlatformActionLabel(platform: string | null | undefined) {
  switch (platform) {
    case 'shopify':
      return 'View on Shopify'
    case 'amazon':
    default:
      return 'View on Amazon'
  }
}

export function getProductExternalUrl(product: { productUrl?: string | null, asin?: string | null }) {
  if (product.productUrl)
    return product.productUrl

  if (product.asin)
    return `https://amazon.com/dp/${product.asin}`

  return null
}
