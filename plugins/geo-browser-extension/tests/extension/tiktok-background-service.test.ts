import assert from 'node:assert/strict'
import test from 'node:test'

import { createTikTokBackgroundService } from '../../extension/tiktok-background-service'
import type { StoredTikTokCreator } from '../../extension/discovery-store.types'

test('TikTok 后台服务串联发现摘要、达人投影和详情洞察', async () => {
  const storage: Record<string, unknown> = {}
  const projectedCreators: StoredTikTokCreator[] = []
  let openedPopups = 0
  const service = createTikTokBackgroundService({
    storage: {
      async get(key) {
        return { [key]: storage[key] }
      },
      async set(items) {
        Object.assign(storage, items)
      }
    },
    getApiBase: () => '',
    fetch: async () => ({ ok: true }) as Response,
    now: () => '2026-08-30T05:00:00.000Z',
    upsertCreator(creator) {
      projectedCreators.push(creator)
    },
    persistCreatorPool() {},
    markCreatorsSynced() {},
    async openPopup() {
      openedPopups++
    }
  })

  const summary = await service.ingest({
    creators: [{
      platform: 'tiktok',
      stable_id: 'user-1',
      username: 'creator_one',
      nickname: 'Creator One',
      avatar_url: null,
      signature: null,
      country: null,
      language: null,
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
      url: null,
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
      author_id: null,
      author_username: null,
      author_nickname: null,
      text: 'Love this product',
      like_count: null,
      analysis_status: 'pending'
    }],
    context: {
      page_url: 'https://www.tiktok.com/@creator_one/video/video-1',
      source: 'network',
      observed_at: '2026-08-30T04:50:00.000Z'
    }
  })
  const storedSummary = await service.getSummary()
  const insights = await service.getCreatorInsights('tiktok:user-1')
  const pageData = await service.getPageData('https://www.tiktok.com/@creator_one/video/video-1')

  await service.ingest({
    creators: [{
      platform: 'tiktok',
      stable_id: 'user-1',
      username: 'creator_one',
      nickname: 'Creator One Updated',
      avatar_url: null,
      signature: null,
      country: null,
      language: null,
      gender: null,
      skin_tone: null,
      age_range: null,
      follower_count: 3000,
      following_count: null,
      video_count: null,
      total_favorited: null
    }],
    videos: [],
    comments: [],
    context: {
      page_url: 'https://www.tiktok.com/@creator_one',
      source: 'network',
      observed_at: '2026-08-30T05:00:01.000Z'
    }
  })

  assert.equal(projectedCreators.length, 2)
  assert.equal(openedPopups, 1)
  assert.deepEqual(storedSummary, { summary })
  assert.deepEqual(pageData, {
    creatorIdentities: ['tiktok:user-1'],
    summary
  })
  assert.deepEqual({
    found: insights.found,
    overall_engagement_rate: insights.overall_engagement_rate,
    pending_comments: insights.pending_comments
  }, {
    found: true,
    overall_engagement_rate: 0.115,
    pending_comments: 1
  })
})

test('TikTok 当前页数据只返回最近发现批次并保持列表与摘要一致', async () => {
  const storage: Record<string, unknown> = {}
  const service = createTikTokBackgroundService({
    storage: {
      async get(key) {
        return { [key]: storage[key] }
      },
      async set(items) {
        Object.assign(storage, items)
      }
    },
    getApiBase: () => '',
    fetch: async () => ({ ok: true }) as Response,
    now: () => '2026-08-30T06:01:00.000Z',
    upsertCreator() {},
    persistCreatorPool() {},
    markCreatorsSynced() {},
    async openPopup() {}
  })
  const pageUrl = 'https://www.tiktok.com/explore'
  function pageBatch(stableId: string, username: string, observedAt: string, tabId: number) {
    return {
      creators: [{
        platform: 'tiktok' as const,
        stable_id: stableId,
        username,
        nickname: null,
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
      videos: [],
      comments: [],
      context: { page_url: pageUrl, source: 'dom' as const, observed_at: observedAt, tab_id: tabId }
    }
  }

  await service.ingest(pageBatch('old-id', 'old_page_creator', '2026-08-30T06:00:00.000Z', 11))
  await Promise.all([
    service.ingest(pageBatch('current-id', 'current_page_creator', '2026-08-30T06:01:00.000Z', 11)),
    service.ingest(pageBatch('other-tab-id', 'other_tab_creator', '2026-08-30T06:02:00.000Z', 12))
  ])

  assert.deepEqual(await service.getPageData(pageUrl, 11), {
    creatorIdentities: ['tiktok:current-id'],
    summary: {
      discovered: 1,
      inserted: 1,
      updated: 0,
      videos: 0,
      comments: 0,
      pending_comments: 0
    }
  })
  assert.deepEqual(await service.getPageData(pageUrl, 12), {
    creatorIdentities: ['tiktok:other-tab-id'],
    summary: {
      discovered: 1,
      inserted: 1,
      updated: 0,
      videos: 0,
      comments: 0,
      pending_comments: 0
    }
  })
})

test('TikTok 同步、评论分析和删除都以 WorkerGlobalScope 作为 fetch 接收者', async () => {
  const storage: Record<string, unknown> = {}
  let syncedCreatorCount = 0
  const requestedUrls: string[] = []
  const service = createTikTokBackgroundService({
    storage: {
      async get(key) {
        return { [key]: storage[key] }
      },
      async set(items) {
        Object.assign(storage, items)
      }
    },
    getApiBase: () => 'http://localhost:3000',
    fetch: (function (this: typeof globalThis, input: RequestInfo | URL) {
      if (this !== globalThis) {
        throw new TypeError('Failed to execute \'fetch\' on \'WorkerGlobalScope\': Illegal invocation')
      }
      const url = String(input)
      requestedUrls.push(url)
      return Promise.resolve({
        ok: true,
        async json() {
          return {
            creator_identity: 'tiktok:worker-fetch-id',
            items: [{
              comment_id: 'worker-comment-id',
              sentiment: 'positive',
              confidence: 0.9,
              keywords: ['质量']
            }],
            summary: {
              positive_count: 1,
              neutral_count: 0,
              negative_count: 0,
              analyzed_comment_count: 1,
              keywords: [{ keyword: '质量', count: 1 }]
            },
            analyzed_at: '2026-08-30T06:11:00.000Z'
          }
        }
      }) as Promise<Response>
    }) as typeof fetch,
    now: () => '2026-08-30T06:10:00.000Z',
    upsertCreator() {},
    persistCreatorPool() {},
    markCreatorsSynced(creators) {
      syncedCreatorCount += creators.length
    },
    async openPopup() {}
  })

  await service.ingest({
    creators: [{
      platform: 'tiktok',
      stable_id: 'worker-fetch-id',
      username: 'worker_fetch_creator',
      nickname: null,
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
    videos: [{
      platform: 'tiktok',
      video_id: 'worker-video-id',
      creator_stable_id: 'worker-fetch-id',
      creator_username: 'worker_fetch_creator',
      url: null,
      description: null,
      like_count: null,
      play_count: null,
      favorite_count: null,
      comment_count: null,
      share_count: null
    }],
    comments: [{
      platform: 'tiktok',
      comment_id: 'worker-comment-id',
      video_id: 'worker-video-id',
      author_id: null,
      author_username: null,
      author_nickname: null,
      text: '脱敏评论',
      like_count: null,
      analysis_status: 'pending'
    }],
    context: {
      page_url: 'https://www.tiktok.com/explore',
      source: 'network',
      observed_at: '2026-08-30T06:10:00.000Z'
    }
  })
  await service.analyzeComments('tiktok:worker-fetch-id')
  await service.deleteCreator('tiktok:worker-fetch-id')

  assert.equal(syncedCreatorCount, 1)
  assert.deepEqual(requestedUrls, [
    'http://localhost:3000/api/discovery/tiktok/upsert',
    'http://localhost:3000/api/discovery/tiktok/analyze-comments',
    'http://localhost:3000/api/discovery/tiktok/tiktok%3Aworker-fetch-id'
  ])
})
