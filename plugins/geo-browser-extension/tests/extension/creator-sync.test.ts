import assert from 'node:assert/strict'
import test from 'node:test'

import { markCreatorsSynced } from '../../extension/creator-sync'
import type { Creator } from '../../extension/types'

test('数据同步成功不改变达人私信触达状态', () => {
  const creators = [{
    id: 'creator-1',
    platform: 'tiktok',
    platform_uid: 'creator_one',
    sec_uid: null,
    nickname: 'Creator One',
    avatar_url: null,
    signature: null,
    follower_count: null,
    following_count: null,
    aweme_count: null,
    total_favorited: null,
    unique_id: 'creator_one',
    short_id: null,
    region: null,
    source: 'page',
    status: 'pending',
    sync_status: 'pending',
    created_at: '2026-08-30T04:00:00.000Z',
    updated_at: '2026-08-30T04:00:00.000Z'
  }] satisfies Creator[]

  markCreatorsSynced(creators)

  assert.equal(creators[0]?.status, 'pending')
  assert.equal(creators[0]?.sync_status, 'synced')
})
