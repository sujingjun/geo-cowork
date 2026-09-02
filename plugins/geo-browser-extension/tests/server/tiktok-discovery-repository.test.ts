import assert from 'node:assert/strict'
import test from 'node:test'
import { createClient } from '@libsql/client'

import {
  deleteTikTokCreator,
  ensureTikTokDiscoveryTables,
  saveTikTokCommentAnalysis,
  upsertTikTokDiscovery
} from '../../server/utils/tiktok-discovery-repository'

test('服务端按 TikTok 稳定身份更新达人并持久化视频和来源', async () => {
  const client = createClient({ url: 'file::memory:' })

  try {
    await ensureTikTokDiscoveryTables(client)
    await upsertTikTokDiscovery(client, {
      creators: [{
        platform: 'tiktok',
        stable_id: 'user-1',
        username: 'creator_one',
        nickname: 'Creator',
        avatar_url: null,
        signature: null,
        country: 'US',
        language: 'en',
        gender: null,
        skin_tone: null,
        age_range: null,
        follower_count: 1000,
        following_count: null,
        video_count: null,
        total_favorited: null,
        first_seen_at: '2026-08-30T04:00:00.000Z',
        last_seen_at: '2026-08-30T04:00:00.000Z',
        field_sources: {}
      }],
      videos: [{
        platform: 'tiktok',
        video_id: 'video-1',
        creator_stable_id: 'user-1',
        creator_username: 'creator_one',
        url: 'https://www.tiktok.com/@creator_one/video/video-1',
        description: null,
        like_count: 100,
        play_count: 1000,
        favorite_count: 20,
        comment_count: 10,
        share_count: 5,
        engagement_rate: 0.115,
        first_seen_at: '2026-08-30T04:00:00.000Z',
        last_seen_at: '2026-08-30T04:00:00.000Z',
        field_sources: {}
      }],
      sources: [{
        platform: 'tiktok',
        creator_identity: 'tiktok:user-1',
        page_url: 'https://www.tiktok.com/search?q=beauty',
        source: 'dom',
        observed_at: '2026-08-30T04:00:00.000Z'
      }]
    })
    await upsertTikTokDiscovery(client, {
      creators: [{
        platform: 'tiktok',
        stable_id: 'user-1',
        username: 'creator_one',
        nickname: 'Creator One',
        avatar_url: null,
        signature: 'Beauty creator',
        country: 'US',
        language: 'en',
        gender: null,
        skin_tone: null,
        age_range: null,
        follower_count: 2000,
        following_count: 100,
        video_count: 30,
        total_favorited: 50000,
        first_seen_at: '2026-08-30T04:00:00.000Z',
        last_seen_at: '2026-08-30T04:10:00.000Z',
        field_sources: {}
      }],
      videos: [],
      sources: [{
        platform: 'tiktok',
        creator_identity: 'tiktok:user-1',
        page_url: 'https://www.tiktok.com/@creator_one',
        source: 'network',
        observed_at: '2026-08-30T04:10:00.000Z'
      }]
    })

    const creators = await client.execute('SELECT identity_key, nickname, follower_count FROM creator_profiles')
    const videos = await client.execute('SELECT video_key, engagement_rate FROM creator_videos')
    const sources = await client.execute('SELECT source_key FROM creator_discovery_sources')

    assert.deepEqual(creators.rows.map(row => ({
      identity_key: row.identity_key,
      nickname: row.nickname,
      follower_count: row.follower_count
    })), [{
      identity_key: 'tiktok:user-1',
      nickname: 'Creator One',
      follower_count: 2000
    }])
    assert.deepEqual(videos.rows.map(row => ({
      video_key: row.video_key,
      engagement_rate: row.engagement_rate
    })), [{
      video_key: 'tiktok:video-1',
      engagement_rate: 0.115
    }])
    assert.equal(sources.rows.length, 2)
  } finally {
    client.close()
  }
})

test('服务端只持久化评论分析结果和达人汇总', async () => {
  const client = createClient({ url: 'file::memory:' })

  try {
    await ensureTikTokDiscoveryTables(client)
    await saveTikTokCommentAnalysis(client, {
      creator_identity: 'tiktok:user-1',
      items: [{
        comment_id: 'comment-1',
        sentiment: 'positive',
        confidence: 0.9,
        keywords: ['质量', '推荐']
      }],
      summary: {
        positive_count: 1,
        neutral_count: 0,
        negative_count: 0,
        analyzed_comment_count: 1,
        keywords: [
          { keyword: '推荐', count: 1 },
          { keyword: '质量', count: 1 }
        ]
      },
      analyzed_at: '2026-08-30T05:00:00.000Z'
    }, new Map([['comment-1', 'video-1']]))

    const analyses = await client.execute('SELECT comment_id, sentiment, keywords FROM comment_analyses')
    const insights = await client.execute('SELECT creator_identity, positive_count, analyzed_comment_count FROM creator_comment_insights')

    assert.deepEqual(analyses.rows.map(row => ({
      comment_id: row.comment_id,
      sentiment: row.sentiment,
      keywords: JSON.parse(String(row.keywords))
    })), [{
      comment_id: 'comment-1',
      sentiment: 'positive',
      keywords: ['质量', '推荐']
    }])
    assert.deepEqual(insights.rows.map(row => ({
      creator_identity: row.creator_identity,
      positive_count: row.positive_count,
      analyzed_comment_count: row.analyzed_comment_count
    })), [{
      creator_identity: 'tiktok:user-1',
      positive_count: 1,
      analyzed_comment_count: 1
    }])
  } finally {
    client.close()
  }
})

test('服务端删除 TikTok 达人时清理对应视频来源和评论洞察', async () => {
  const client = createClient({ url: 'file::memory:' })
  try {
    await ensureTikTokDiscoveryTables(client)
    await upsertTikTokDiscovery(client, {
      creators: [{
        platform: 'tiktok', stable_id: 'user-1', username: 'creator_one', nickname: null,
        avatar_url: null, signature: null, country: null, language: null, gender: null,
        skin_tone: null, age_range: null, follower_count: null, following_count: null,
        video_count: null, total_favorited: null, field_sources: {},
        first_seen_at: '2026-08-30T05:00:00.000Z', last_seen_at: '2026-08-30T05:00:00.000Z'
      }],
      videos: [{
        platform: 'tiktok', video_id: 'video-1', creator_stable_id: 'user-1',
        creator_username: 'creator_one', url: null, description: null, like_count: null,
        play_count: null, favorite_count: null, comment_count: null, share_count: null,
        engagement_rate: null, field_sources: {}, first_seen_at: '2026-08-30T05:00:00.000Z',
        last_seen_at: '2026-08-30T05:00:00.000Z'
      }],
      sources: [{
        platform: 'tiktok', creator_identity: 'tiktok:user-1',
        page_url: 'https://www.tiktok.com/@creator_one', source: 'network',
        observed_at: '2026-08-30T05:00:00.000Z'
      }]
    })

    const deleted = await deleteTikTokCreator(client, 'tiktok:user-1')

    assert.deepEqual(deleted, { creators: 1, videos: 1, sources: 1, analyses: 0, insights: 0 })
    assert.equal((await client.execute('SELECT * FROM creator_profiles')).rows.length, 0)
    assert.equal((await client.execute('SELECT * FROM creator_videos')).rows.length, 0)
    assert.equal((await client.execute('SELECT * FROM creator_discovery_sources')).rows.length, 0)
  } finally {
    client.close()
  }
})
