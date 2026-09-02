import { z } from 'zod'

const nullableText = z.string().nullable()
const nullableCount = z.number().int().nonnegative().nullable()
const fieldSourceSchema = z.object({
  source: z.enum(['dom', 'embedded', 'network']),
  observed_at: z.string()
}).strict()

const creatorSchema = z.object({
  platform: z.literal('tiktok'),
  stable_id: nullableText,
  username: nullableText,
  nickname: nullableText,
  avatar_url: nullableText,
  signature: nullableText,
  country: nullableText,
  language: nullableText,
  gender: nullableText,
  skin_tone: nullableText,
  age_range: nullableText,
  follower_count: nullableCount,
  following_count: nullableCount,
  video_count: nullableCount,
  total_favorited: nullableCount,
  first_seen_at: z.string(),
  last_seen_at: z.string(),
  field_sources: z.record(z.string(), fieldSourceSchema)
}).strict()

const videoSchema = z.object({
  platform: z.literal('tiktok'),
  video_id: z.string().min(1),
  creator_stable_id: nullableText,
  creator_username: nullableText,
  url: nullableText,
  description: nullableText,
  like_count: nullableCount,
  play_count: nullableCount,
  favorite_count: nullableCount,
  comment_count: nullableCount,
  share_count: nullableCount,
  engagement_rate: z.number().nonnegative().nullable(),
  first_seen_at: z.string(),
  last_seen_at: z.string(),
  field_sources: z.record(z.string(), fieldSourceSchema)
}).strict()

const sourceSchema = z.object({
  platform: z.literal('tiktok'),
  creator_identity: z.string().min(1),
  page_url: z.string().min(1),
  source: z.enum(['dom', 'embedded', 'network']),
  observed_at: z.string()
}).strict()

export const tiktokDiscoverySyncSchema = z.object({
  creators: z.array(creatorSchema),
  videos: z.array(videoSchema),
  sources: z.array(sourceSchema)
}).strict()

export function parseTikTokDiscoverySyncPayload(value: unknown) {
  return tiktokDiscoverySyncSchema.parse(value)
}
