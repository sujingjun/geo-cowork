import assert from 'node:assert/strict'
import test from 'node:test'

import { createAgentRuntime } from '../../extension/agent-runtime'
import type { Creator } from '../../extension/types'

function creator(id: string, status: Creator['status']): Creator {
  return {
    id,
    platform: 'douyin',
    platform_uid: null,
    sec_uid: `sec-${id}`,
    nickname: `达人${id}`,
    avatar_url: null,
    signature: null,
    follower_count: 1000,
    following_count: null,
    aweme_count: null,
    total_favorited: null,
    unique_id: null,
    short_id: null,
    region: null,
    source: 'manual',
    status,
    created_at: '2026-08-30T00:00:00.000Z',
    updated_at: '2026-08-30T00:00:00.000Z'
  }
}

test('Agent 搜索达人会打开带关键词的抖音搜索页', async () => {
  const openedUrls: string[] = []
  const runtime = createAgentRuntime({
    openTab: async (url) => {
      openedUrls.push(url)
      return { id: 42 }
    },
    getCreators: () => [],
    getComments: () => [],
    getProfile: () => undefined
  })

  const result = await runtime.searchCreators({
    keyword: '美妆 达人',
    minFollowers: 1000,
    maxFollowers: 10000,
    targetCount: 50
  })

  assert.deepEqual(openedUrls, [
    'https://www.douyin.com/search/%E7%BE%8E%E5%A6%86%20%E8%BE%BE%E4%BA%BA'
  ])
  assert.deepEqual(result, {
    success: true,
    status: 'started',
    tabId: 42,
    message: '已打开“美妆 达人”的抖音搜索页，搜索结果会自动进入达人池'
  })
})

test('Agent 抓取评论会打开指定抖音视频并拒绝站外地址', async () => {
  const openedUrls: string[] = []
  const runtime = createAgentRuntime({
    openTab: async (url) => {
      openedUrls.push(url)
      return { id: 7 }
    },
    getCreators: () => [],
    getComments: () => [],
    getProfile: () => undefined
  })

  const result = await runtime.crawlComments({ awemeId: '123456' })

  assert.deepEqual(openedUrls, ['https://www.douyin.com/video/123456'])
  assert.deepEqual(result, {
    success: true,
    status: 'started',
    tabId: 7,
    message: '已打开抖音视频，页面评论加载后会自动采集评论用户'
  })
  await assert.rejects(
    runtime.crawlComments({ videoUrl: 'https://example.com/video/1' }),
    /仅支持抖音视频地址/
  )
})

test('Agent 可读取达人详情和触达状态', () => {
  const tiktokCreator: Creator = {
    ...creator('2', 'pending'),
    platform: 'tiktok',
    platform_uid: 'creator-two',
    sec_uid: null,
    nickname: 'TikTok 达人'
  }
  const creators = [creator('1', 'sent'), tiktokCreator]
  const runtime = createAgentRuntime({
    openTab: async () => ({}),
    getCreators: () => creators,
    getComments: () => [],
    getProfile: () => undefined
  })

  assert.deepEqual(runtime.getCreatorProfile({ platform: 'douyin', recipientId: 'sec-1' }), {
    found: true,
    profile: creators[0],
    message: '达人 达人1：粉丝 1000，状态 已发送'
  })
  assert.deepEqual(runtime.getCreatorProfile({ platform: 'tiktok', recipientId: 'creator-two' }), {
    found: true,
    profile: tiktokCreator,
    message: '达人 TikTok 达人：粉丝 1000，状态 待发送'
  })
  assert.deepEqual(runtime.checkOutreachStatus({ status: 'sent', page: 1, pageSize: 20 }), {
    total: 1,
    items: [creators[0]],
    summary: {
      pending: 1,
      sent: 1,
      replied: 0,
      converted: 0,
      blocked: 0
    },
    message: '当前有 1 个已发送状态的达人'
  })
})
