import { sqliteTable, text, integer, real, index, uniqueIndex, primaryKey } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
}

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  username: text('username').notNull(),
  provider: text('provider', { enum: ['github'] }).notNull(),
  providerId: text('provider_id').notNull(),
  ...timestamps
}, table => [
  uniqueIndex('users_provider_id_idx').on(table.provider, table.providerId)
])

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats)
}))

export const chats = sqliteTable('chats', {
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

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  parts: text('parts', { mode: 'json' }),
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

export const votes = sqliteTable('votes', {
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  messageId: text('message_id').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  isUpvoted: integer('is_upvoted', { mode: 'boolean' }).notNull()
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

export const creatorProfiles = sqliteTable('creator_profiles', {
  identityKey: text('identity_key').primaryKey(),
  platform: text('platform').notNull(),
  stableId: text('stable_id'),
  username: text('username'),
  nickname: text('nickname'),
  avatarUrl: text('avatar_url'),
  signature: text('signature'),
  country: text('country'),
  language: text('language'),
  gender: text('gender'),
  skinTone: text('skin_tone'),
  ageRange: text('age_range'),
  followerCount: integer('follower_count'),
  followingCount: integer('following_count'),
  videoCount: integer('video_count'),
  totalFavorited: integer('total_favorited'),
  fieldSources: text('field_sources').notNull().default('{}'),
  firstSeenAt: text('first_seen_at').notNull(),
  lastSeenAt: text('last_seen_at').notNull(),
  updatedAt: text('updated_at').notNull()
}, table => [
  uniqueIndex('creator_profiles_platform_stable_id_idx').on(table.platform, table.stableId),
  index('creator_profiles_platform_username_idx').on(table.platform, table.username)
])

export const creatorVideos = sqliteTable('creator_videos', {
  videoKey: text('video_key').primaryKey(),
  platform: text('platform').notNull(),
  videoId: text('video_id').notNull(),
  creatorIdentity: text('creator_identity'),
  creatorUsername: text('creator_username'),
  url: text('url'),
  description: text('description'),
  likeCount: integer('like_count'),
  playCount: integer('play_count'),
  favoriteCount: integer('favorite_count'),
  commentCount: integer('comment_count'),
  shareCount: integer('share_count'),
  engagementRate: real('engagement_rate'),
  fieldSources: text('field_sources').notNull().default('{}'),
  firstSeenAt: text('first_seen_at').notNull(),
  lastSeenAt: text('last_seen_at').notNull(),
  updatedAt: text('updated_at').notNull()
})

export const creatorDiscoverySources = sqliteTable('creator_discovery_sources', {
  sourceKey: text('source_key').primaryKey(),
  platform: text('platform').notNull(),
  creatorIdentity: text('creator_identity').notNull(),
  pageUrl: text('page_url').notNull(),
  source: text('source').notNull(),
  observedAt: text('observed_at').notNull()
}, table => [
  index('creator_discovery_sources_creator_idx').on(table.creatorIdentity, table.observedAt)
])

export const commentAnalyses = sqliteTable('comment_analyses', {
  commentKey: text('comment_key').primaryKey(),
  platform: text('platform').notNull(),
  commentId: text('comment_id').notNull(),
  videoId: text('video_id'),
  creatorIdentity: text('creator_identity'),
  sentiment: text('sentiment').notNull(),
  sentimentConfidence: real('sentiment_confidence').notNull(),
  keywords: text('keywords').notNull().default('[]'),
  analyzedAt: text('analyzed_at').notNull()
})

export const creatorCommentInsights = sqliteTable('creator_comment_insights', {
  creatorIdentity: text('creator_identity').primaryKey(),
  positiveCount: integer('positive_count').notNull().default(0),
  neutralCount: integer('neutral_count').notNull().default(0),
  negativeCount: integer('negative_count').notNull().default(0),
  keywords: text('keywords').notNull().default('[]'),
  analyzedCommentCount: integer('analyzed_comment_count').notNull().default(0),
  updatedAt: text('updated_at').notNull()
})
