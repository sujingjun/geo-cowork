#!/usr/bin/env node
/**
 * 为指定用户和店铺批量插入商品数据
 */

import { PGlite } from '@electric-sql/pglite'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRESQL_URL

async function createDbClient() {
  if (connectionString)
    return postgres(connectionString, { prepare: false })

  return new PGlite('.data/db')
}

// 用户和店铺 ID
const USER_ID = '13399df5-9161-4c69-9264-fab7f42a9e18'
const STORE_ID = 'ffccd138-b466-4345-9c39-d4392874f794'

// 商品数据
const products = [
  // 电子类
  { asin: 'B08N5WRWNW', title: 'Echo Dot (5th Gen) Smart Speaker with Alexa', price: '49.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop', description: 'Compact smart speaker with Alexa voice control and improved audio', category: 'Electronics' },
  { asin: 'B09B8RXYYG', title: 'Apple AirPods Pro (2nd Generation)', price: '249.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop', description: 'Wireless earbuds with active noise cancellation', category: 'Electronics' },
  { asin: 'B09G9FPHY6', title: 'Apple Watch Series 9 GPS', price: '399.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop', description: 'Advanced health tracking and fitness smartwatch', category: 'Electronics' },
  { asin: 'B0BSHF7WHW', title: 'Logitech MX Master 3S Wireless Mouse', price: '99.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', description: 'Ergonomic wireless mouse for productivity', category: 'Electronics' },
  { asin: 'B09JQMJHXY', title: 'Anker PowerCore 26800 Portable Charger', price: '65.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', description: 'High-capacity power bank for all devices', category: 'Electronics' },
  { asin: 'B0BL5SXBB5', title: 'Samsung 980 PRO 2TB PCIe 4.0 NVMe SSD', price: '199.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop', description: 'Ultra-fast storage for gaming and content creation', category: 'Electronics' },
  { asin: 'B08T6RZ3W9', title: 'Blue Yeti USB Microphone for Streaming', price: '129.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=400&fit=crop', description: 'Professional USB microphone for podcasting and streaming', category: 'Electronics' },
  { asin: 'B09JQL3NWT', title: 'Sony WH-1000XM5 Wireless Headphones', price: '399.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop', description: 'Industry-leading noise canceling headphones', category: 'Electronics' },
  { asin: 'B0BQR7J9MQ', title: 'DJI Mini 3 Pro Drone with Camera', price: '759.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop', description: 'Compact drone with 4K HDR video', category: 'Electronics' },
  { asin: 'B0B7CPSN2K', title: 'Keychron K8 Wireless Mechanical Keyboard', price: '89.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', description: 'Compact mechanical keyboard for Mac and Windows', category: 'Electronics' },

  // 科技类
  { asin: 'B09BKNRM44', title: 'Ring Video Doorbell Pro 2', price: '249.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop', description: 'Smart doorbell with advanced motion detection', category: 'Technology' },
  { asin: 'B09VLC7ZXZ', title: 'GoPro HERO11 Black Action Camera', price: '499.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=400&fit=crop', description: 'Waterproof action camera with 5.3K video', category: 'Technology' },
  { asin: 'B09QM7JPW8', title: 'KitchenAid Artisan Stand Mixer', price: '429.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1578843481163-e8f5b9f1d25b?w=400&h=400&fit=crop', description: 'Classic stand mixer for baking', category: 'Technology' },
  { asin: 'B09M7H1PRW', title: 'iRobot Roomba j7+ Robot Vacuum', price: '799.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1559599238-682f82097794?w=400&h=400&fit=crop', description: 'Self-emptying robot vacuum with obstacle avoidance', category: 'Technology' },
  { asin: 'B0B1LKXH5Q', title: 'Breville Barista Express Espresso Machine', price: '699.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop', description: 'All-in-one espresso machine with grinder', category: 'Technology' },
  { asin: 'B09W5WGF4S', title: 'Dyson V15 Detect Cordless Vacuum', price: '649.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop', description: 'Powerful cordless vacuum with laser detection', category: 'Technology' },
  { asin: 'B08DX3JC82', title: 'Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker', price: '99.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop', description: 'Multi-functional pressure cooker', category: 'Technology' },
  { asin: 'B09PHHKDDT', title: 'Ninja Air Fryer Pro 4-in-1', price: '119.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop', description: 'Versatile air fryer with 5-quart capacity', category: 'Technology' },
  { asin: 'B0B35MWQX3', title: 'Philips Sonicare DiamondClean', price: '189.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop', description: 'Premium electric toothbrush', category: 'Technology' },
  { asin: 'B09X7QKWNM', title: 'Levoit Core 400S Air Purifier', price: '219.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', description: 'Smart air purifier for large rooms', category: 'Technology' },

  // 数码类
  { asin: 'B0C5W1M7X9', title: 'Sony PlayStation 5 Slim Console', price: '499.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop', description: 'Next-gen gaming console with ultra-high-speed SSD', category: 'Digital' },
  { asin: 'B0C5W1M7Y0', title: 'Xbox Series X Console', price: '499.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1605647551614-e8df1a459a13?w=400&h=400&fit=crop', description: 'Powerful gaming console with 4K gaming', category: 'Digital' },
  { asin: 'B0C5W1M7Y1', title: 'Nintendo Switch OLED Model', price: '349.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=400&fit=crop', description: 'Hybrid gaming console with vibrant OLED screen', category: 'Digital' },
  { asin: 'B0C5W1M7Y2', title: 'Apple iPad Pro 12.9-inch', price: '999.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1510573346161-4996890d0180?w=400&h=400&fit=crop', description: 'Powerful tablet with M3 chip', category: 'Digital' },
  { asin: 'B0C5W1M7Y3', title: 'Samsung Galaxy Tab S9 Ultra', price: '1199.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1510573346161-4996890d0180?w=400&h=400&fit=crop', description: 'Large Android tablet with S Pen support', category: 'Digital' },
  { asin: 'B0C5W1M7Y4', title: 'Sony A7 IV Mirrorless Camera', price: '2499.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', description: 'Professional full-frame camera with 33MP sensor', category: 'Digital' },
  { asin: 'B0C5W1M7Y5', title: 'Canon EOS R6 Mark II', price: '2499.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=400&fit=crop', description: 'High-performance mirrorless camera', category: 'Digital' },
  { asin: 'B0C5W1M7Y6', title: 'Razer BlackWidow V4 Pro', price: '299.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', description: 'Premium gaming keyboard with RGB lighting', category: 'Digital' },
  { asin: 'B0C5W1M7Y7', title: 'SteelSeries Arctis Nova Pro', price: '299.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop', description: 'High-fidelity gaming headset', category: 'Digital' },
  { asin: 'B0C5W1M7Y8', title: 'Elgato Stream Deck MK.2', price: '149.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop', description: 'Customizable streaming controller', category: 'Digital' },

  // 美妆类
  { asin: 'B0D5K1M7Z0', title: 'Lancome Advanced Genifique Serum', price: '135.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1555949965-aa79d59d275e?w=400&h=400&fit=crop', description: 'Anti-aging serum with 7 prebiotics', category: 'Beauty' },
  { asin: 'B0D5K1M7Z1', title: 'Estee Lauder Advanced Night Repair', price: '110.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=400&h=400&fit=crop', description: 'Nighttime repair serum with hyaluronic acid', category: 'Beauty' },
  { asin: 'B0D5K1M7Z2', title: 'MAC Lipstick Ruby Woo', price: '23.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop', description: 'Classic matte red lipstick', category: 'Beauty' },
  { asin: 'B0D5K1M7Z3', title: 'Urban Decay Naked Palette', price: '54.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1585779128082-565746599074?w=400&h=400&fit=crop', description: '12 neutral eyeshadows palette', category: 'Beauty' },
  { asin: 'B0D5K1M7Z4', title: 'Dyson Airwrap Complete', price: '599.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1573497491208-6b1acb260682?w=400&h=400&fit=crop', description: 'Multi-styler for curling and smoothing', category: 'Beauty' },
  { asin: 'B0D5K1M7Z5', title: 'Shiseido Ultimune Power Infusing Concentrate', price: '85.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1555949965-aa79d59d275e?w=400&h=400&fit=crop', description: 'Immunity-boosting facial serum', category: 'Beauty' },
  { asin: 'B0D5K1M7Z6', title: 'Fenty Beauty Pro Filt\'r Foundation', price: '38.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop', description: 'Inclusive foundation with 50 shades', category: 'Beauty' },
  { asin: 'B0D5K1M7Z7', title: 'Too Faced Better Than Sex Mascara', price: '23.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1581094282070-36a45b25e1b9?w=400&h=400&fit=crop', description: 'Volumizing mascara with hourglass brush', category: 'Beauty' },
  { asin: 'B0D5K1M7Z8', title: 'Charlotte Tilbury Pillow Talk Lipstick', price: '34.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop', description: 'Iconic nude-pink lipstick', category: 'Beauty' },
  { asin: 'B0D5K1M7Z9', title: 'SK-II Facial Treatment Essence', price: '215.00', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1555949965-aa79d59d275e?w=400&h=400&fit=crop', description: 'Essence with Pitera for radiant skin', category: 'Beauty' },

  // 宠物类
  { asin: 'B0E5K2N8A0', title: 'Purina Pro Plan Dog Food', price: '54.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop', description: 'High-protein dry dog food for all breeds', category: 'Pets' },
  { asin: 'B0E5K2N8A1', title: 'Blue Buffalo Cat Food', price: '39.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop', description: 'Grain-free cat food with real chicken', category: 'Pets' },
  { asin: 'B0E5K2N8A2', title: 'Kong Classic Dog Toy', price: '12.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&h=400&fit=crop', description: 'Durable rubber chew toy for dogs', category: 'Pets' },
  { asin: 'B0E5K2N8A3', title: 'Furminator Deshedding Tool', price: '49.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', description: 'Professional grooming tool for shedding pets', category: 'Pets' },
  { asin: 'B0E5K2N8A4', title: 'PetSafe Drinkwell Water Fountain', price: '44.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1580284917757-5f149173575e?w=400&h=400&fit=crop', description: 'Automatic water fountain for cats and dogs', category: 'Pets' },
  { asin: 'B0E5K2N8A5', title: 'SmartPetLove Snuggle Puppy', price: '29.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', description: 'Comfort toy with heartbeat simulation', category: 'Pets' },
  { asin: 'B0E5K2N8A6', title: 'ZiggyPaws Interactive Cat Feather Toy', price: '19.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&h=400&fit=crop', description: 'Interactive wand toy for cats', category: 'Pets' },
  { asin: 'B0E5K2N8A7', title: 'Outward Hound Nina Ottosson Puzzle', price: '24.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&h=400&fit=crop', description: 'Interactive puzzle feeder for dogs', category: 'Pets' },
  { asin: 'B0E5K2N8A8', title: 'PetFusion Ultimate Cat Scratcher', price: '39.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400&h=400&fit=crop', description: 'Premium cardboard cat scratcher lounge', category: 'Pets' },
  { asin: 'B0E5K2N8A9', title: 'Whisker City Cat Tree Tower', price: '129.99', currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400&h=400&fit=crop', description: 'Multi-level cat tree with scratching posts', category: 'Pets' }
]

async function main() {
  console.log(`📦 Starting product seeding for store: ${STORE_ID}`)
  const client = await createDbClient()

  const now = new Date()
  let insertedCount = 0
  let skippedCount = 0

  for (const product of products) {
    try {
      // 检查是否已存在
      const existing = connectionString
        ? await client`
          SELECT id
          FROM products
          WHERE store_id = ${STORE_ID} AND asin = ${product.asin}
        `
        : await client.query('SELECT id FROM products WHERE store_id = $1 AND asin = $2', [STORE_ID, product.asin])

      if (existing.length > 0) {
        skippedCount++
        continue
      }

      // 插入新商品
      if (connectionString) {
        await client`
          INSERT INTO products (
            id,
            store_id,
            asin,
            title,
            price,
            currency,
            image_url,
            description,
            category,
            last_synced_at,
            created_at
          ) VALUES (
            ${crypto.randomUUID()},
            ${STORE_ID},
            ${product.asin},
            ${product.title},
            ${product.price},
            ${product.currency},
            ${product.imageUrl},
            ${product.description},
            ${product.category},
            ${now},
            ${now}
          )
        `
      } else {
        await client.query(
          `INSERT INTO products (id, store_id, asin, title, price, currency, image_url, description, category, last_synced_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            crypto.randomUUID(),
            STORE_ID,
            product.asin,
            product.title,
            product.price,
            product.currency,
            product.imageUrl,
            product.description,
            product.category,
            now,
            now
          ]
        )
      }

      insertedCount++
      process.stdout.write(`\r✅ Inserted ${insertedCount} products...`)
    } catch (error) {
      console.error(`❌ Error inserting ${product.asin}:`, error)
    }
  }

  console.log(`\n\n🎉 Seeding completed!`)
  console.log(`✅ Inserted: ${insertedCount} products`)
  console.log(`⏭️  Skipped (already exists): ${skippedCount} products`)

  // 统计各类别数量
  const categoryStats = connectionString
    ? await client`
      SELECT category, COUNT(*)::int AS count
      FROM products
      WHERE store_id = ${STORE_ID}
      GROUP BY category
    `
    : await client.query('SELECT category, COUNT(*)::int AS count FROM products WHERE store_id = $1 GROUP BY category', [STORE_ID])

  console.log(`\n📊 Category distribution:`)
  categoryStats.forEach((row) => {
    console.log(`   ${row.category}: ${row.count} products`)
  })

  if (connectionString)
    await client.end()
  else
    await client.close()
}

main().catch(console.error)
