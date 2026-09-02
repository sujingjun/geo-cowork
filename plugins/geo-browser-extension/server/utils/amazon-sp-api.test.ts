import { describe, expect, it } from 'vitest'
import * as amazonSpApi from './amazon-sp-api'

type AmazonSpApiUnderTest = typeof amazonSpApi & {
  buildAmazonListingsRequest: (
    store: { storeId: string, region: string, marketplaceId: string | null },
    environment: 'production' | 'sandbox',
    limit?: number
  ) => { path: string, params: URLSearchParams }
  mapAmazonListingItemToProduct: (item: unknown) => amazonSpApi.AmazonProduct
  resolveAmazonRefreshToken: (responseRefreshToken: string | undefined, currentRefreshToken: string) => string
}

const api = amazonSpApi as AmazonSpApiUnderTest

describe('amazon SP-API product sync', () => {
  it('builds the exact Listings Items static sandbox request', () => {
    const request = api.buildAmazonListingsRequest({
      storeId: 'SANDBOX_SELLING_PARTNER',
      region: 'us-east-1',
      marketplaceId: 'ATVPDKIKX0DER'
    }, 'sandbox', 100)

    expect(request.path).toBe('/listings/2021-08-01/items/SANDBOX_SELLING_PARTNER')
    expect(Object.fromEntries(request.params)).toEqual({
      identifiersType: 'SKU',
      identifiers: 'GM-ZDPI-9B4E,HW-ZDPI-9B4E,TC-ZDPI-9B4E',
      marketplaceIds: 'ATVPDKIKX0DER',
      includedData: 'summaries,offers,fulfillmentAvailability,issues',
      pageSize: '1'
    })
  })

  it('maps a seller listing and offer into the shared Amazon product shape', () => {
    const product = api.mapAmazonListingItemToProduct({
      sku: 'GM-ZDPI-9B4E',
      summaries: [{
        asin: 'B071VG5N9D',
        itemName: 'Hardside Carry-On Spinner Suitcase Luggage',
        productType: 'LUGGAGE',
        mainImage: { link: 'https://www.example.com/luggage.png' }
      }],
      offers: [{
        price: { amount: '100.00', currencyCode: 'USD' }
      }]
    })

    expect(product).toEqual({
      asin: 'B071VG5N9D',
      title: 'Hardside Carry-On Spinner Suitcase Luggage',
      price: '100.00',
      currency: 'USD',
      imageUrl: 'https://www.example.com/luggage.png',
      description: undefined,
      category: 'LUGGAGE'
    })
  })

  it('keeps the existing refresh token when LWA omits it from a refresh response', () => {
    expect(api.resolveAmazonRefreshToken(undefined, 'Atzr|sandbox-refresh-token'))
      .toBe('Atzr|sandbox-refresh-token')
  })
})
