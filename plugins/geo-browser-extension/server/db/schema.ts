import type { UIMessage } from 'ai'
import type { SiteBuilderConfig } from '../../shared/utils/site-builder'
import { relations, sql } from 'drizzle-orm'
import { pgTable, text, integer, index, uniqueIndex, primaryKey, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
}

type ProductVariant = {
  id: string
  title: string
  sku?: string | null
  price?: string | null
  currency?: string | null
  inventoryQuantity?: number | null
}

type StoreDiagnostics = {
  status: string
  code?: string
  message: string
  action: string
  checks: Array<{
    name: string
    status: string
    message: string
  }>
}

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  username: text('username').notNull(),
  provider: text('provider', { enum: ['github', 'google'] }).notNull(),
  providerId: text('provider_id').notNull(),
  ...timestamps
}, table => [
  uniqueIndex('users_provider_id_idx').on(table.provider, table.providerId)
])

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats)
}))

export const chats = pgTable('chats', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title'),
  userId: text('user_id').notNull(),
  visibility: text('visibility', { enum: ['public', 'private'] }).notNull().default('private'),
  ...timestamps
}, table => [
  index('chats_user_id_idx').on(table.userId)
])

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id]
  }),
  messages: many(messages)
}))

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  parts: jsonb('parts').$type<UIMessage['parts']>().notNull().default(sql`'[]'::jsonb`),
  ...timestamps
}, table => [
  index('messages_chat_id_idx').on(table.chatId)
])

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}))

export const votes = pgTable('votes', {
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  messageId: text('message_id').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  isUpvoted: boolean('is_upvoted').notNull()
}, table => [
  primaryKey({ columns: [table.chatId, table.messageId] })
])

export const votesRelations = relations(votes, ({ one }) => ({
  chat: one(chats, {
    fields: [votes.chatId],
    references: [chats.id]
  }),
  message: one(messages, {
    fields: [votes.messageId],
    references: [messages.id]
  })
}))

// Store authorization information
export const stores = pgTable('stores', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform', { enum: ['amazon', 'shopify'] }).notNull().default('amazon'),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  storeId: text('store_id').notNull(),
  storeName: text('store_name').notNull(),
  region: text('region').notNull().default('us-east-1'),
  marketplaceId: text('marketplace_id'),
  shopDomain: text('shop_domain'),
  scopes: text('scopes'),
  status: text('status', { enum: ['connected', 'disconnected', 'expired', 'error'] }).notNull().default('connected'),
  lastSyncedAt: timestamp('last_synced_at', { mode: 'date' }),
  lastSyncStatus: text('last_sync_status', { enum: ['success', 'failed', 'partial', 'never'] }).notNull().default('never'),
  lastSyncError: text('last_sync_error'),
  lastDiagnosedAt: timestamp('last_diagnosed_at', { mode: 'date' }),
  diagnostics: jsonb('diagnostics').$type<StoreDiagnostics | null>(),
  disconnectedAt: timestamp('disconnected_at', { mode: 'date' }),
  reauthorizedAt: timestamp('reauthorized_at', { mode: 'date' }),
  ...timestamps
}, table => [
  index('stores_user_id_idx').on(table.userId)
])

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id]
  }),
  products: many(products),
  authEvents: many(storeAuthEvents),
  syncLogs: many(storeSyncLogs)
}))

export const storeAuthEvents = pgTable('store_auth_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform', { enum: ['amazon', 'shopify'] }).notNull(),
  type: text('type', { enum: ['authorized', 'reauthorized', 'disconnected', 'expired', 'reconnect_failed'] }).notNull(),
  message: text('message').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown> | null>(),
  ...timestamps
}, table => [
  index('store_auth_events_store_id_idx').on(table.storeId),
  index('store_auth_events_user_id_idx').on(table.userId)
])

export const storeAuthEventsRelations = relations(storeAuthEvents, ({ one }) => ({
  store: one(stores, {
    fields: [storeAuthEvents.storeId],
    references: [stores.id]
  }),
  user: one(users, {
    fields: [storeAuthEvents.userId],
    references: [users.id]
  })
}))

export const storeSyncLogs = pgTable('store_sync_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform', { enum: ['amazon', 'shopify'] }).notNull(),
  status: text('status', { enum: ['success', 'failed', 'partial'] }).notNull(),
  syncedCount: integer('synced_count').notNull().default(0),
  createdCount: integer('created_count').notNull().default(0),
  updatedCount: integer('updated_count').notNull().default(0),
  failedCount: integer('failed_count').notNull().default(0),
  message: text('message'),
  diagnostics: jsonb('diagnostics').$type<StoreDiagnostics | null>(),
  ...timestamps
}, table => [
  index('store_sync_logs_store_id_idx').on(table.storeId),
  index('store_sync_logs_user_id_idx').on(table.userId)
])

export const storeSyncLogsRelations = relations(storeSyncLogs, ({ one }) => ({
  store: one(stores, {
    fields: [storeSyncLogs.storeId],
    references: [stores.id]
  }),
  user: one(users, {
    fields: [storeSyncLogs.userId],
    references: [users.id]
  })
}))

// Product data cache
export const products = pgTable('products', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  asin: text('asin'),
  externalProductId: text('external_product_id').notNull(),
  title: text('title').notNull(),
  price: text('price'),
  currency: text('currency').default('USD'),
  imageUrl: text('image_url'),
  description: text('description'),
  category: text('category'),
  platformHandle: text('platform_handle'),
  productUrl: text('product_url'),
  vendor: text('vendor'),
  productType: text('product_type'),
  tags: jsonb('tags').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  variants: jsonb('variants').$type<ProductVariant[]>().notNull().default(sql`'[]'::jsonb`),
  rawData: jsonb('raw_data').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  lastSyncedAt: timestamp('last_synced_at', { mode: 'date' }),
  ...timestamps
}, table => [
  index('products_store_id_idx').on(table.storeId),
  index('products_asin_idx').on(table.asin),
  index('products_external_product_id_idx').on(table.externalProductId),
  uniqueIndex('products_store_asin_idx').on(table.storeId, table.asin),
  uniqueIndex('products_store_external_product_id_idx').on(table.storeId, table.externalProductId)
])

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id]
  }),
  siteProducts: many(siteProducts)
}))

// Generated sites
export const sites = pgTable('sites', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chat_id').references(() => chats.id, { onDelete: 'set null' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  theme: text('theme').notNull(),
  siteType: text('site_type', { enum: ['internal', 'shopify-external'] }).notNull().default('internal'),
  template: text('template', { enum: ['grid', 'list', 'hero'] }).notNull().default('grid'),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ogImage: text('og_image'),
  builderConfig: jsonb('builder_config').$type<SiteBuilderConfig | null>(),
  publishedAt: timestamp('published_at', { mode: 'date' }),
  ...timestamps
}, table => [
  index('sites_user_id_idx').on(table.userId),
  index('sites_chat_id_idx').on(table.chatId),
  uniqueIndex('sites_slug_idx').on(table.slug)
])

export const sitesRelations = relations(sites, ({ one, many }) => ({
  user: one(users, {
    fields: [sites.userId],
    references: [users.id]
  }),
  chat: one(chats, {
    fields: [sites.chatId],
    references: [chats.id]
  }),
  siteProducts: many(siteProducts)
}))

// Site-Product association
export const siteProducts = pgTable('site_products', {
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0)
}, table => [
  primaryKey({ columns: [table.siteId, table.productId] }),
  index('site_products_site_id_idx').on(table.siteId),
  index('site_products_product_id_idx').on(table.productId)
])

export const siteProductsRelations = relations(siteProducts, ({ one }) => ({
  site: one(sites, {
    fields: [siteProducts.siteId],
    references: [sites.id]
  }),
  product: one(products, {
    fields: [siteProducts.productId],
    references: [products.id]
  })
}))
