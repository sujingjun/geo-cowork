import type { Client } from '@libsql/client'
import type { TikTokDiscoverySyncPayload } from '../../extension/tiktok-discovery-service.types'
import type { TikTokCommentAnalysisResponse } from '../../shared/types/tiktok-comment-analysis'

const CREATE_TABLE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS creator_profiles (
    identity_key TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    stable_id TEXT,
    username TEXT,
    nickname TEXT,
    avatar_url TEXT,
    signature TEXT,
    country TEXT,
    language TEXT,
    gender TEXT,
    skin_tone TEXT,
    age_range TEXT,
    follower_count INTEGER,
    following_count INTEGER,
    video_count INTEGER,
    total_favorited INTEGER,
    field_sources TEXT NOT NULL DEFAULT '{}',
    first_seen_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS creator_profiles_platform_stable_id_idx
    ON creator_profiles(platform, stable_id)`,
  `CREATE INDEX IF NOT EXISTS creator_profiles_platform_username_idx
    ON creator_profiles(platform, username)`,
  `CREATE TABLE IF NOT EXISTS creator_videos (
    video_key TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    video_id TEXT NOT NULL,
    creator_identity TEXT,
    creator_username TEXT,
    url TEXT,
    description TEXT,
    like_count INTEGER,
    play_count INTEGER,
    favorite_count INTEGER,
    comment_count INTEGER,
    share_count INTEGER,
    engagement_rate REAL,
    field_sources TEXT NOT NULL DEFAULT '{}',
    first_seen_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS creator_discovery_sources (
    source_key TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    creator_identity TEXT NOT NULL,
    page_url TEXT NOT NULL,
    source TEXT NOT NULL,
    observed_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS creator_discovery_sources_creator_idx
    ON creator_discovery_sources(creator_identity, observed_at)`,
  `CREATE TABLE IF NOT EXISTS comment_analyses (
    comment_key TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    video_id TEXT,
    creator_identity TEXT,
    sentiment TEXT NOT NULL,
    sentiment_confidence REAL NOT NULL,
    keywords TEXT NOT NULL DEFAULT '[]',
    analyzed_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS creator_comment_insights (
    creator_identity TEXT PRIMARY KEY,
    positive_count INTEGER NOT NULL DEFAULT 0,
    neutral_count INTEGER NOT NULL DEFAULT 0,
    negative_count INTEGER NOT NULL DEFAULT 0,
    keywords TEXT NOT NULL DEFAULT '[]',
    analyzed_comment_count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  )`
] as const

function creatorIdentity(stableId: string | null, username: string | null): string | null {
  if (stableId) return `tiktok:${stableId}`
  if (username) return `tiktok:@${username.toLowerCase()}`
  return null
}

export async function ensureTikTokDiscoveryTables(client: Client): Promise<void> {
  for (const statement of CREATE_TABLE_STATEMENTS) {
    await client.execute(statement)
  }
}

export async function upsertTikTokDiscovery(
  client: Client,
  payload: TikTokDiscoverySyncPayload
): Promise<void> {
  for (const creator of payload.creators) {
    const identityKey = creatorIdentity(creator.stable_id, creator.username)
    if (!identityKey) continue
    await client.execute({
      sql: `INSERT INTO creator_profiles (
        identity_key, platform, stable_id, username, nickname, avatar_url, signature,
        country, language, gender, skin_tone, age_range, follower_count, following_count,
        video_count, total_favorited, field_sources, first_seen_at, last_seen_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(identity_key) DO UPDATE SET
        stable_id = excluded.stable_id,
        username = excluded.username,
        nickname = excluded.nickname,
        avatar_url = excluded.avatar_url,
        signature = excluded.signature,
        country = excluded.country,
        language = excluded.language,
        gender = excluded.gender,
        skin_tone = excluded.skin_tone,
        age_range = excluded.age_range,
        follower_count = excluded.follower_count,
        following_count = excluded.following_count,
        video_count = excluded.video_count,
        total_favorited = excluded.total_favorited,
        field_sources = excluded.field_sources,
        first_seen_at = excluded.first_seen_at,
        last_seen_at = excluded.last_seen_at,
        updated_at = excluded.updated_at`,
      args: [
        identityKey,
        creator.platform,
        creator.stable_id,
        creator.username,
        creator.nickname,
        creator.avatar_url,
        creator.signature,
        creator.country,
        creator.language,
        creator.gender,
        creator.skin_tone,
        creator.age_range,
        creator.follower_count,
        creator.following_count,
        creator.video_count,
        creator.total_favorited,
        JSON.stringify(creator.field_sources),
        creator.first_seen_at,
        creator.last_seen_at,
        creator.last_seen_at
      ]
    })

    if (creator.stable_id && creator.username) {
      const usernameIdentity = `tiktok:@${creator.username.toLowerCase()}`
      if (usernameIdentity !== identityKey) {
        await client.execute({
          sql: 'UPDATE creator_videos SET creator_identity = ? WHERE creator_identity = ?',
          args: [identityKey, usernameIdentity]
        })
        await client.execute({
          sql: 'UPDATE creator_discovery_sources SET creator_identity = ? WHERE creator_identity = ?',
          args: [identityKey, usernameIdentity]
        })
        await client.execute({
          sql: 'DELETE FROM creator_profiles WHERE identity_key = ?',
          args: [usernameIdentity]
        })
      }
    }
  }

  for (const video of payload.videos) {
    const videoKey = `${video.platform}:${video.video_id}`
    const creatorKey = creatorIdentity(video.creator_stable_id, video.creator_username)
    await client.execute({
      sql: `INSERT INTO creator_videos (
        video_key, platform, video_id, creator_identity, creator_username, url, description,
        like_count, play_count, favorite_count, comment_count, share_count, engagement_rate,
        field_sources, first_seen_at, last_seen_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(video_key) DO UPDATE SET
        creator_identity = excluded.creator_identity,
        creator_username = excluded.creator_username,
        url = excluded.url,
        description = excluded.description,
        like_count = excluded.like_count,
        play_count = excluded.play_count,
        favorite_count = excluded.favorite_count,
        comment_count = excluded.comment_count,
        share_count = excluded.share_count,
        engagement_rate = excluded.engagement_rate,
        field_sources = excluded.field_sources,
        first_seen_at = excluded.first_seen_at,
        last_seen_at = excluded.last_seen_at,
        updated_at = excluded.updated_at`,
      args: [
        videoKey,
        video.platform,
        video.video_id,
        creatorKey,
        video.creator_username,
        video.url,
        video.description,
        video.like_count,
        video.play_count,
        video.favorite_count,
        video.comment_count,
        video.share_count,
        video.engagement_rate,
        JSON.stringify(video.field_sources),
        video.first_seen_at,
        video.last_seen_at,
        video.last_seen_at
      ]
    })
  }

  for (const source of payload.sources) {
    const sourceKey = [
      source.creator_identity,
      source.source,
      source.observed_at,
      source.page_url
    ].join('|')
    await client.execute({
      sql: `INSERT INTO creator_discovery_sources (
        source_key, platform, creator_identity, page_url, source, observed_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(source_key) DO NOTHING`,
      args: [
        sourceKey,
        source.platform,
        source.creator_identity,
        source.page_url,
        source.source,
        source.observed_at
      ]
    })
  }
}

export async function saveTikTokCommentAnalysis(
  client: Client,
  response: TikTokCommentAnalysisResponse,
  commentVideoIds: Map<string, string | null>
): Promise<void> {
  for (const item of response.items) {
    await client.execute({
      sql: `INSERT INTO comment_analyses (
        comment_key, platform, comment_id, video_id, creator_identity,
        sentiment, sentiment_confidence, keywords, analyzed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(comment_key) DO UPDATE SET
        video_id = excluded.video_id,
        creator_identity = excluded.creator_identity,
        sentiment = excluded.sentiment,
        sentiment_confidence = excluded.sentiment_confidence,
        keywords = excluded.keywords,
        analyzed_at = excluded.analyzed_at`,
      args: [
        `tiktok:${item.comment_id}`,
        'tiktok',
        item.comment_id,
        commentVideoIds.get(item.comment_id) || null,
        response.creator_identity,
        item.sentiment,
        item.confidence,
        JSON.stringify(item.keywords),
        response.analyzed_at
      ]
    })
  }

  await client.execute({
    sql: `INSERT INTO creator_comment_insights (
      creator_identity, positive_count, neutral_count, negative_count,
      keywords, analyzed_comment_count, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(creator_identity) DO UPDATE SET
      positive_count = excluded.positive_count,
      neutral_count = excluded.neutral_count,
      negative_count = excluded.negative_count,
      keywords = excluded.keywords,
      analyzed_comment_count = excluded.analyzed_comment_count,
      updated_at = excluded.updated_at`,
    args: [
      response.creator_identity,
      response.summary.positive_count,
      response.summary.neutral_count,
      response.summary.negative_count,
      JSON.stringify(response.summary.keywords),
      response.summary.analyzed_comment_count,
      response.analyzed_at
    ]
  })
}

export async function deleteTikTokCreator(client: Client, creatorIdentity: string) {
  const analyses = await client.execute({
    sql: 'DELETE FROM comment_analyses WHERE creator_identity = ?',
    args: [creatorIdentity]
  })
  const insights = await client.execute({
    sql: 'DELETE FROM creator_comment_insights WHERE creator_identity = ?',
    args: [creatorIdentity]
  })
  const sources = await client.execute({
    sql: 'DELETE FROM creator_discovery_sources WHERE creator_identity = ?',
    args: [creatorIdentity]
  })
  const videos = await client.execute({
    sql: 'DELETE FROM creator_videos WHERE creator_identity = ?',
    args: [creatorIdentity]
  })
  const creators = await client.execute({
    sql: 'DELETE FROM creator_profiles WHERE identity_key = ?',
    args: [creatorIdentity]
  })

  return {
    creators: creators.rowsAffected,
    videos: videos.rowsAffected,
    sources: sources.rowsAffected,
    analyses: analyses.rowsAffected,
    insights: insights.rowsAffected
  }
}
