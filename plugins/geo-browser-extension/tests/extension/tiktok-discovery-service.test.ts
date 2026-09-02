import assert from 'node:assert/strict'
import test from 'node:test'

import { handleTikTokDiscoveryBatch } from '../../extension/tiktok-discovery-service'
import { createEmptyTikTokDiscoveryState } from '../../extension/discovery-store'
import type { StoredTikTokCreator, TikTokDiscoveryState } from '../../extension/discovery-store.types'
import type { TikTokDiscoveryBatch } from '../../extension/tiktok-discovery.types'

test('TikTok 发现批次本地持久化并在服务端同步时排除评论原文', async () => {
  let state: TikTokDiscoveryState = createEmptyTikTokDiscoveryState()
  let savedSummary: unknown
  let syncedPayload: unknown
  const creatorUpdates: StoredTikTokCreator[] = []
  const batch: TikTokDiscoveryBatch = {
    creators: [{
      platform: 'tiktok',
      stable_id: 'user-1',
      username: 'creator_one',
      nickname: 'Creator One',
      avatar_url: null,
      signature: null,
      country: 'US',
      language: 'en',
      gender: null,
      skin_tone: null,
      age_range: null,
      follower_count: 2000,
      following_count: null,
      video_count: null,
      total_favorited: null
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
      observed_at: '2026-08-30T04:40:00.000Z'
    }
  }

  const result = await handleTikTokDiscoveryBatch(batch, {
    async loadState() {
      return state
    },
    async saveState(nextState, summary) {
      state = nextState
      savedSummary = summary
    },
    upsertCreator(creator) {
      creatorUpdates.push(creator)
    },
    async syncToServer(payload) {
      syncedPayload = payload
    }
  })

  assert.deepEqual(result, {
    discovered: 1,
    inserted: 1,
    updated: 0,
    videos: 1,
    comments: 1,
    pending_comments: 1
  })
  assert.deepEqual(savedSummary, result)
  assert.equal(state.comments[0]?.text, 'Love this product')
  assert.equal(creatorUpdates.length, 1)
  assert.doesNotMatch(JSON.stringify(syncedPayload), /Love this product/)
  assert.deepEqual(Object.keys(syncedPayload as Record<string, unknown>).sort(), [
    'creators',
    'sources',
    'videos'
  ])
})
