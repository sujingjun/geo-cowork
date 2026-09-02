import assert from 'node:assert/strict'
import test from 'node:test'

import { upsertTikTokCreatorInPool } from '../../extension/tiktok-creator-pool'
import type { StoredTikTokCreator } from '../../extension/discovery-store.types'
import type { Creator } from '../../extension/types'

function discovered(stableId: string | null, followerCount: number | null): StoredTikTokCreator {
  return {
    platform: 'tiktok',
    stable_id: stableId,
    username: 'creator_one',
    nickname: 'Creator One',
    avatar_url: null,
    signature: null,
    country: null,
    language: null,
    gender: null,
    skin_tone: null,
    age_range: null,
    follower_count: followerCount,
    following_count: null,
    video_count: null,
    total_favorited: null,
    first_seen_at: '2026-08-30T04:00:00.000Z',
    last_seen_at: '2026-08-30T04:10:00.000Z',
    field_sources: {}
  }
}

test('TikTok 发现数据投影到达人池时保留私信状态并补全稳定身份', () => {
  const pool: Creator[] = []
  const dependencies = {
    createId: () => 'creator-1',
    now: () => '2026-08-30T04:20:00.000Z'
  }

  upsertTikTokCreatorInPool(pool, discovered(null, null), dependencies)
  pool[0]!.status = 'replied'
  upsertTikTokCreatorInPool(pool, discovered('user-1', 2000), dependencies)

  assert.equal(pool.length, 1)
  assert.deepEqual({
    stable_id: pool[0]?.stable_id,
    follower_count: pool[0]?.follower_count,
    status: pool[0]?.status
  }, {
    stable_id: 'user-1',
    follower_count: 2000,
    status: 'replied'
  })
})
