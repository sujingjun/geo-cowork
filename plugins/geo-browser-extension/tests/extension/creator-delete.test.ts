import assert from 'node:assert/strict'
import test from 'node:test'

import {
  deleteTikTokCreatorData,
  removeCreatorFromPool
} from '../../extension/creator-delete'
import { createEmptyTikTokDiscoveryState, ingestTikTokDiscoveryBatch } from '../../extension/discovery-store'
import type { Creator } from '../../extension/types'

test('删除达人同时移除达人池和对应 TikTok 发现数据', () => {
  const pool = [{ id: 'creator-1', platform: 'tiktok' }] as Creator[]
  const state = ingestTikTokDiscoveryBatch(createEmptyTikTokDiscoveryState(), {
    creators: [{
      platform: 'tiktok', stable_id: 'user-1', username: 'creator_one', nickname: null,
      avatar_url: null, signature: null, country: null, language: null, gender: null,
      skin_tone: null, age_range: null, follower_count: null, following_count: null,
      video_count: null, total_favorited: null
    }],
    videos: [{
      platform: 'tiktok', video_id: 'video-1', creator_stable_id: 'user-1',
      creator_username: 'creator_one', url: null, description: null, like_count: null,
      play_count: null, favorite_count: null, comment_count: null, share_count: null
    }],
    comments: [{
      platform: 'tiktok', comment_id: 'comment-1', video_id: 'video-1', author_id: null,
      author_username: null, author_nickname: null, text: 'comment', like_count: null,
      analysis_status: 'pending'
    }],
    context: {
      page_url: 'https://www.tiktok.com/@creator_one/video/video-1',
      source: 'network',
      observed_at: '2026-08-30T05:00:00.000Z'
    }
  }).state

  const removed = removeCreatorFromPool(pool, 'creator-1')
  const summary = deleteTikTokCreatorData(state, 'tiktok:user-1')

  assert.equal(removed?.id, 'creator-1')
  assert.deepEqual(summary, { creators: 1, videos: 1, comments: 1, sources: 1, insights: 0 })
  assert.equal(pool.length, 0)
  assert.equal(state.creators.length, 0)
  assert.equal(state.videos.length, 0)
  assert.equal(state.comments.length, 0)
  assert.equal(state.sources.length, 0)
})
