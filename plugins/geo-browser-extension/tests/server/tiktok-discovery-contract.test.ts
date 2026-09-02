import assert from 'node:assert/strict'
import test from 'node:test'

import { parseTikTokDiscoverySyncPayload } from '../../server/utils/tiktok-discovery-contract'

test('TikTok 服务端发现入口拒绝评论原文', () => {
  const valid = {
    creators: [],
    videos: [],
    sources: []
  }

  assert.deepEqual(parseTikTokDiscoverySyncPayload(valid), valid)
  assert.throws(() => parseTikTokDiscoverySyncPayload({
    ...valid,
    comments: [{ comment_id: 'comment-1', text: 'private text' }]
  }), /Unrecognized key.*comments/)
})
