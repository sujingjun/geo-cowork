import { describe, expect, it } from 'vitest'
import { getPlatformLabel, getProductExternalUrl } from './store-platform'

describe('store platform helpers', () => {
  it('prefers explicit product urls and falls back to amazon asin links', () => {
    expect(getProductExternalUrl({ productUrl: 'https://demo-shop.myshopify.com/products/travel-backpack', asin: null })).toBe('https://demo-shop.myshopify.com/products/travel-backpack')
    expect(getProductExternalUrl({ productUrl: null, asin: 'B000123456' })).toBe('https://amazon.com/dp/B000123456')
    expect(getProductExternalUrl({ productUrl: null, asin: null })).toBeNull()
  })

  it('returns human labels for known store platforms', () => {
    expect(getPlatformLabel('amazon')).toBe('Amazon')
    expect(getPlatformLabel('shopify')).toBe('Shopify')
    expect(getPlatformLabel('unknown')).toBe('unknown')
  })
})
