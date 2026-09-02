import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  createShopifyProductUrl,
  mapShopifyProductToCatalogProduct,
  normalizeShopDomain,
  verifyShopifyCallbackHmac
} from './shopify-api'

describe('shopify-api helpers', () => {
  it('normalizes shop domains to myshopify hosts', () => {
    expect(normalizeShopDomain('demo-shop')).toBe('demo-shop.myshopify.com')
    expect(normalizeShopDomain('https://Demo-Shop.myshopify.com/admin')).toBe('demo-shop.myshopify.com')
  })

  it('validates callback hmac values', () => {
    const params = {
      code: 'abc123',
      host: 'ZGVtby1zaG9wLm15c2hvcGlmeS5jb20vYWRtaW4',
      shop: 'demo-shop.myshopify.com',
      state: 'nonce-1',
      timestamp: '1718700000'
    }
    const message = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key as keyof typeof params]}`)
      .join('&')
    const hmac = createHmac('sha256', 'secret-key').update(message).digest('hex')

    expect(verifyShopifyCallbackHmac({ ...params, hmac }, 'secret-key')).toBe(true)
    expect(verifyShopifyCallbackHmac({ ...params, hmac: 'bad-value' }, 'secret-key')).toBe(false)
  })

  it('maps shopify products into the shared catalog shape', () => {
    const mapped = mapShopifyProductToCatalogProduct({
      id: 10,
      title: 'Travel Backpack',
      body_html: '<p>Carry-on ready bag</p>',
      vendor: 'Demo Bags',
      product_type: 'Luggage',
      handle: 'travel-backpack',
      tags: 'travel, bags',
      variants: [{
        id: 11,
        title: 'Default Title',
        sku: 'TB-001',
        price: '129.00',
        inventory_quantity: 12
      }],
      image: {
        src: 'https://cdn.example.com/travel-backpack.jpg'
      }
    }, 'demo-shop.myshopify.com', 'USD')

    expect(createShopifyProductUrl('demo-shop.myshopify.com', 'travel-backpack')).toBe('https://demo-shop.myshopify.com/products/travel-backpack')
    expect(mapped).toMatchObject({
      externalProductId: '10',
      title: 'Travel Backpack',
      price: '129.00',
      currency: 'USD',
      description: 'Carry-on ready bag',
      category: 'Luggage',
      platformHandle: 'travel-backpack',
      productUrl: 'https://demo-shop.myshopify.com/products/travel-backpack',
      vendor: 'Demo Bags',
      productType: 'Luggage',
      tags: ['travel', 'bags'],
      imageUrl: 'https://cdn.example.com/travel-backpack.jpg'
    })
    expect(mapped.variants).toEqual([{
      id: '11',
      title: 'Default Title',
      sku: 'TB-001',
      price: '129.00',
      currency: 'USD',
      inventoryQuantity: 12
    }])
  })
})
