import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createEmptyTikTokDiscoveryState,
  ingestTikTokDiscoveryBatch,
  pruneExpiredTikTokComments
} from '../../extension/discovery-store'
import type { TikTokDiscoveryBatch } from '../../extension/tiktok-discovery.types'

function batch(input: Partial<TikTokDiscoveryBatch> & Pick<TikTokDiscoveryBatch, 'context'>): TikTokDiscoveryBatch {
  return {
    creators: [],
    videos: [],
    comments: [],
    ...input
  }
}

test('同一 TikTok 达人后续取得稳定身份和完整数据时合并补全', () => {
  const first = ingestTikTokDiscoveryBatch(createEmptyTikTokDiscoveryState(), batch({
    creators: [{
      platform: 'tiktok',
      stable_id: null,
      username: 'creator_one',
      nickname: 'Creator',
      avatar_url: null,
      signature: null,
      country: null,
      language: null,
      gender: null,
      skin_tone: null,
      age_range: null,
      follower_count: null,
      following_count: null,
      video_count: null,
      total_favorited: null
    }],
    context: {
      page_url: 'https://www.tiktok.com/search?q=beauty',
      source: 'dom',
      observed_at: '2026-08-30T04:00:00.000Z'
    }
  }))

  const second = ingestTikTokDiscoveryBatch(first.state, batch({
    creators: [{
      platform: 'tiktok',
      stable_id: 'user-1',
      username: 'creator_one',
      nickname: 'Creator One',
      avatar_url: 'https://example.test/avatar.jpg',
      signature: 'Beauty creator',
      country: 'US',
      language: 'en',
      gender: null,
      skin_tone: null,
      age_range: null,
      follower_count: 2000,
      following_count: 100,
      video_count: 30,
      total_favorited: 50000
    }],
    videos: [{
      platform: 'tiktok',
      video_id: 'video-1',
      creator_stable_id: 'user-1',
      creator_username: 'creator_one',
      url: 'https://www.tiktok.com/@creator_one/video/video-1',
      description: '新品试用',
      like_count: 100,
      play_count: 1000,
      favorite_count: 20,
      comment_count: 10,
      share_count: 5
    }],
    comments: [{
      platform: 'tiktok',
      comment_id: 'comment-1',
      video_id: 'video-1',
      author_id: 'audience-1',
      author_username: 'fan_one',
      author_nickname: 'Fan One',
      text: 'Love this product',
      like_count: 8,
      analysis_status: 'pending'
    }],
    context: {
      page_url: 'https://www.tiktok.com/@creator_one/video/video-1',
      source: 'network',
      observed_at: '2026-08-30T04:10:00.000Z'
    }
  }))

  assert.equal(second.state.creators.length, 1)
  assert.deepEqual({
    stable_id: second.state.creators[0]?.stable_id,
    username: second.state.creators[0]?.username,
    nickname: second.state.creators[0]?.nickname,
    follower_count: second.state.creators[0]?.follower_count
  }, {
    stable_id: 'user-1',
    username: 'creator_one',
    nickname: 'Creator One',
    follower_count: 2000
  })
  assert.deepEqual(second.summary, {
    discovered: 1,
    inserted: 0,
    updated: 1,
    videos: 1,
    comments: 1,
    pending_comments: 1
  })
  assert.equal(second.state.sources.length, 2)
  assert.deepEqual(
    second.state.sources.map(source => source.creator_identity),
    ['tiktok:user-1', 'tiktok:user-1']
  )
  assert.equal(second.state.videos.length, 1)
  assert.equal(second.state.comments.length, 1)
})

test('TikTok 评论原文超过三十天后从本地状态删除', () => {
  const state = createEmptyTikTokDiscoveryState()
  state.comments.push({
    platform: 'tiktok',
    comment_id: 'comment-1',
    video_id: 'video-1',
    author_id: null,
    author_username: null,
    author_nickname: null,
    text: 'expired text',
    like_count: null,
    analysis_status: 'analyzed',
    discovered_at: '2026-07-01T00:00:00.000Z',
    expires_at: '2026-07-31T00:00:00.000Z',
    sentiment: 'positive',
    sentiment_confidence: 0.9,
    keywords: ['quality']
  })
  state.insights.push({
    creator_identity: 'tiktok:user-1',
    summary: {
      positive_count: 1,
      neutral_count: 0,
      negative_count: 0,
      analyzed_comment_count: 1,
      keywords: [{ keyword: 'quality', count: 1 }]
    },
    analyzed_at: '2026-07-01T00:10:00.000Z'
  })

  const removed = pruneExpiredTikTokComments(state, '2026-08-01T00:00:00.000Z')

  assert.equal(removed, 1)
  assert.equal(state.comments.length, 0)
  assert.equal(state.insights.length, 1)
})
