#!/usr/bin/env node

import { PGlite } from '@electric-sql/pglite'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRESQL_URL

async function createDbClient() {
  if (connectionString)
    return postgres(connectionString, { prepare: false })

  return new PGlite('.data/db')
}

const USER_ID = '13399df5-9161-4c69-9264-fab7f42a9e18'

async function testGetProducts() {
  console.log('🔍 Testing get_products tool logic...\n')
  const client = await createDbClient()

  try {
    // Step 1: Get user's stores
    console.log('1️⃣ 查询用户店铺...')
    const stores = connectionString
      ? await client`
        SELECT id, store_name
        FROM stores
        WHERE user_id = ${USER_ID}
      `
      : await client.query('SELECT id, store_name FROM stores WHERE user_id = $1', [USER_ID])

    if (stores.length === 0) {
      console.error('❌ 用户没有授权的店铺')
      process.exit(1)
    }

    console.log(`✅ 找到 ${stores.length} 个店铺:`)
    stores.forEach((store) => {
      console.log(`   - ${store.store_name} (ID: ${store.id})`)
    })

    const storeId = stores[0].id

    // Step 2: Get products by category (Pets)
    console.log('\n2️⃣ 查询宠物类商品...')
    const petProducts = connectionString
      ? await client`
        SELECT asin, title, price, category
        FROM products
        WHERE store_id = ${storeId} AND category = ${'Pets'}
        ORDER BY title
        LIMIT 10
      `
      : await client.query('SELECT asin, title, price, category FROM products WHERE store_id = $1 AND category = $2 ORDER BY title LIMIT 10', [storeId, 'Pets'])

    console.log(`✅ 找到 ${petProducts.length} 个宠物类商品:`)
    petProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price}`)
    })

    // Step 3: Get all products count
    console.log('\n3️⃣ 查询店铺所有商品...')
    const allProducts = connectionString
      ? await client`
        SELECT category, COUNT(*)::int AS count
        FROM products
        WHERE store_id = ${storeId}
        GROUP BY category
        ORDER BY count DESC
      `
      : await client.query('SELECT category, COUNT(*)::int AS count FROM products WHERE store_id = $1 GROUP BY category ORDER BY count DESC', [storeId])

    console.log('📊 商品类别分布:')
    allProducts.forEach((row) => {
      console.log(`   ${row.category}: ${row.count} 个商品`)
    })

    console.log('\n🎉 测试完成!')
  } catch (error) {
    console.error('❌ 测试失败:', error)
    process.exit(1)
  }

  if (connectionString)
    await client.end()
  else
    await client.close()
}

testGetProducts()
