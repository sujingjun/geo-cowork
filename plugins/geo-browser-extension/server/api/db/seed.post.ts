import { db, schema } from 'hub:db'

function withAmazonProductMetadata<T extends { asin: string }>(products: T[]) {
  return products.map(product => ({
    ...product,
    externalProductId: product.asin,
    productUrl: `https://amazon.com/dp/${product.asin}`
  }))
}

/**
 * POST /api/db/seed
 * Initialize database with test data
 * WARNING: This endpoint should be protected or removed in production
 */
export default defineEventHandler(async () => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 403,
      message: 'Seed endpoint is disabled in production'
    })
  }

  try {
    console.log('🌱 Starting database seed...')

    // 1. Create test users
    console.log('👤 Creating test users...')
    const [user1] = await db.insert(schema.users).values({
      id: 'test-user-1',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: 'https://avatar.vercel.sh/demo',
      username: 'demouser',
      provider: 'github',
      providerId: 'demo-provider-1'
    }).onConflictDoNothing().returning()

    const [user2] = await db.insert(schema.users).values({
      id: 'test-user-2',
      email: 'john@example.com',
      name: 'John Smith',
      avatar: 'https://avatar.vercel.sh/john',
      username: 'johnsmith',
      provider: 'github',
      providerId: 'demo-provider-2'
    }).onConflictDoNothing().returning()

    if (!user1 || !user2) {
      return {
        success: false,
        message: 'Users already exist. Database may already be seeded.'
      }
    }

    // 2. Create test stores
    console.log('🏪 Creating test stores...')
    const [store1] = await db.insert(schema.stores).values({
      userId: user1.id,
      platform: 'amazon',
      accessToken: 'mock-access-token-1',
      refreshToken: 'mock-refresh-token-1',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      storeId: 'A1EXAMPLE1',
      storeName: 'Tech Gadgets Store',
      region: 'us-east-1',
      marketplaceId: 'ATVPDKIKX0DER'
    }).returning()

    const [store2] = await db.insert(schema.stores).values({
      userId: user2.id,
      platform: 'amazon',
      accessToken: 'mock-access-token-2',
      refreshToken: 'mock-refresh-token-2',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      storeId: 'A1EXAMPLE2',
      storeName: 'Home & Kitchen Essentials',
      region: 'us-east-1',
      marketplaceId: 'ATVPDKIKX0DER'
    }).returning()

    // 3. Create test products for store 1 (Tech Gadgets)
    console.log('📦 Creating test products...')
    const techProducts = [
      {
        storeId: store1!.id,
        asin: 'B08N5WRWNW',
        title: 'Echo Dot (5th Gen) Smart Speaker with Alexa',
        price: '49.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop',
        description: 'Compact smart speaker with Alexa voice control and improved audio',
        category: 'Electronics',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B09B8RXYYG',
        title: 'Apple AirPods Pro (2nd Generation)',
        price: '249.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
        description: 'Wireless earbuds with active noise cancellation',
        category: 'Electronics',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B09G9FPHY6',
        title: 'Apple Watch Series 9 GPS',
        price: '399.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
        description: 'Advanced health tracking and fitness smartwatch',
        category: 'Wearables',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B0BSHF7WHW',
        title: 'Logitech MX Master 3S Wireless Mouse',
        price: '99.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        description: 'Ergonomic wireless mouse for productivity',
        category: 'Computer Accessories',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B09JQMJHXY',
        title: 'Anker PowerCore 26800 Portable Charger',
        price: '65.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
        description: 'High-capacity power bank for all devices',
        category: 'Electronics',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B0BL5SXBB5',
        title: 'Samsung 980 PRO 2TB PCIe 4.0 NVMe SSD',
        price: '199.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop',
        description: 'Ultra-fast storage for gaming and content creation',
        category: 'Computer Hardware',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B08T6RZ3W9',
        title: 'Blue Yeti USB Microphone for Streaming',
        price: '129.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=400&fit=crop',
        description: 'Professional USB microphone for podcasting and streaming',
        category: 'Audio Equipment',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B09JQL3NWT',
        title: 'Sony WH-1000XM5 Wireless Headphones',
        price: '399.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
        description: 'Industry-leading noise canceling headphones',
        category: 'Audio',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B0BQR7J9MQ',
        title: 'DJI Mini 3 Pro Drone with Camera',
        price: '759.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop',
        description: 'Compact drone with 4K HDR video',
        category: 'Cameras & Drones',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B0B7CPSN2K',
        title: 'Keychron K8 Wireless Mechanical Keyboard',
        price: '89.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
        description: 'Compact mechanical keyboard for Mac and Windows',
        category: 'Computer Accessories',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B09BKNRM44',
        title: 'Ring Video Doorbell Pro 2',
        price: '249.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop',
        description: 'Smart doorbell with advanced motion detection',
        category: 'Smart Home',
        lastSyncedAt: new Date()
      },
      {
        storeId: store1!.id,
        asin: 'B09VLC7ZXZ',
        title: 'GoPro HERO11 Black Action Camera',
        price: '499.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=400&fit=crop',
        description: 'Waterproof action camera with 5.3K video',
        category: 'Cameras',
        lastSyncedAt: new Date()
      }
    ]

    const products1 = await db.insert(schema.products).values(withAmazonProductMetadata(techProducts)).returning()

    // 4. Create test products for store 2 (Home & Kitchen)
    const homeProducts = [
      {
        storeId: store2!.id,
        asin: 'B09PHHKDDT',
        title: 'Ninja Air Fryer Pro 4-in-1',
        price: '119.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
        description: 'Versatile air fryer with 5-quart capacity',
        category: 'Kitchen Appliances',
        lastSyncedAt: new Date()
      },
      {
        storeId: store2!.id,
        asin: 'B08DX3JC82',
        title: 'Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker',
        price: '99.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
        description: 'Multi-functional pressure cooker',
        category: 'Kitchen Appliances',
        lastSyncedAt: new Date()
      },
      {
        storeId: store2!.id,
        asin: 'B09W5WGF4S',
        title: 'Dyson V15 Detect Cordless Vacuum',
        price: '649.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop',
        description: 'Powerful cordless vacuum with laser detection',
        category: 'Home Appliances',
        lastSyncedAt: new Date()
      },
      {
        storeId: store2!.id,
        asin: 'B0B1LKXH5Q',
        title: 'Breville Barista Express Espresso Machine',
        price: '699.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
        description: 'All-in-one espresso machine with grinder',
        category: 'Kitchen Appliances',
        lastSyncedAt: new Date()
      },
      {
        storeId: store2!.id,
        asin: 'B09M7H1PRW',
        title: 'iRobot Roomba j7+ Robot Vacuum',
        price: '799.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1559599238-682f82097794?w=400&h=400&fit=crop',
        description: 'Self-emptying robot vacuum with obstacle avoidance',
        category: 'Home Appliances',
        lastSyncedAt: new Date()
      },
      {
        storeId: store2!.id,
        asin: 'B09QM7JPW8',
        title: 'KitchenAid Artisan Stand Mixer',
        price: '429.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1578843481163-e8f5b9f1d25b?w=400&h=400&fit=crop',
        description: 'Classic stand mixer for baking',
        category: 'Kitchen Appliances',
        lastSyncedAt: new Date()
      },
      {
        storeId: store2!.id,
        asin: 'B0B35MWQX3',
        title: 'Philips Sonicare DiamondClean',
        price: '189.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop',
        description: 'Premium electric toothbrush',
        category: 'Personal Care',
        lastSyncedAt: new Date()
      },
      {
        storeId: store2!.id,
        asin: 'B09X7QKWNM',
        title: 'Levoit Core 400S Air Purifier',
        price: '219.99',
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
        description: 'Smart air purifier for large rooms',
        category: 'Home Appliances',
        lastSyncedAt: new Date()
      }
    ]

    const products2 = await db.insert(schema.products).values(withAmazonProductMetadata(homeProducts)).returning()

    // 5. Create test chats
    console.log('💬 Creating test chats...')
    const [chat1] = await db.insert(schema.chats).values({
      userId: user1.id,
      title: 'Best Tech Gadgets for 2025',
      visibility: 'public'
    }).returning()

    const [chat2] = await db.insert(schema.chats).values({
      userId: user2.id,
      title: 'Kitchen Must-Haves',
      visibility: 'private'
    }).returning()

    // 6. Create test sites
    console.log('🌐 Creating test sites...')
    const [site1] = await db.insert(schema.sites).values({
      chatId: chat1!.id,
      userId: user1.id,
      title: 'Ultimate Tech Gadgets 2025',
      slug: 'ultimate-tech-gadgets-2025',
      theme: 'Modern technology for professionals and enthusiasts',
      siteType: 'internal',
      template: 'grid',
      status: 'published',
      seoTitle: 'Best Tech Gadgets 2025 - Top Electronic Devices',
      seoDescription: 'Discover the latest and greatest tech gadgets of 2025. From smart speakers to wireless earbuds, find the perfect technology for your lifestyle.',
      publishedAt: new Date()
    }).returning()

    const [site2] = await db.insert(schema.sites).values({
      chatId: chat2!.id,
      userId: user2.id,
      title: 'Essential Kitchen Appliances',
      slug: 'essential-kitchen-appliances',
      theme: 'Must-have appliances for modern kitchens',
      siteType: 'internal',
      template: 'list',
      status: 'draft',
      seoTitle: 'Essential Kitchen Appliances - Home Cooking Made Easy',
      seoDescription: 'Explore our curated selection of essential kitchen appliances. From air fryers to espresso machines, upgrade your culinary experience.'
    }).returning()

    const [site3] = await db.insert(schema.sites).values({
      chatId: chat1!.id,
      userId: user1.id,
      title: 'Smart Home Revolution',
      slug: 'smart-home-revolution',
      theme: 'Transform your home with smart technology',
      siteType: 'internal',
      template: 'hero',
      status: 'published',
      seoTitle: 'Smart Home Devices 2025 - Build Your Connected Home',
      seoDescription: 'Build your dream smart home with our selection of cutting-edge devices. Voice assistants, security cameras, and more.',
      publishedAt: new Date()
    }).returning()

    // 7. Associate products with sites
    console.log('🔗 Associating products with sites...')

    const site1ProductIds = products1.slice(0, 8).map((p, i) => ({
      siteId: site1!.id,
      productId: p.id,
      position: i
    }))
    await db.insert(schema.siteProducts).values(site1ProductIds)

    const site2ProductIds = products2.slice(0, 6).map((p, i) => ({
      siteId: site2!.id,
      productId: p.id,
      position: i
    }))
    await db.insert(schema.siteProducts).values(site2ProductIds)

    const site3ProductIds = [products1[0], products1[2], products1[10]]
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .map((p, i) => ({
        siteId: site3!.id,
        productId: p.id,
        position: i
      }))
    await db.insert(schema.siteProducts).values(site3ProductIds)

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: 2,
        stores: 2,
        products: products1.length + products2.length,
        sites: 3,
        chats: 2,
        testUsers: [
          { email: user1.email, username: user1.username },
          { email: user2.email, username: user2.username }
        ],
        testSites: [
          { slug: site1!.slug, status: 'published' },
          { slug: site2!.slug, status: 'draft' },
          { slug: site3!.slug, status: 'published' }
        ]
      }
    }
  } catch (error: unknown) {
    console.error('❌ Seed failed:', error)
    throw createError({
      statusCode: 500,
      message: `Seed failed: ${(error instanceof Error ? error.message : 'Unknown seed error')}`
    })
  }
})
