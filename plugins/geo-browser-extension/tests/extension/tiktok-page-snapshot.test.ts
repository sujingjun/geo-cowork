import assert from 'node:assert/strict'
import test from 'node:test'

import { createTikTokBackgroundService } from '../../extension/tiktok-background-service'

test('TikTok 同一页面实例聚合多来源批次并由新实例整体替换', async () => {
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
    now: () => '2026-08-30T07:20:00.000Z',
    upsertCreator() {},
    persistCreatorPool() {},
    markCreatorsSynced() {},
    async openPopup() {}
  })
  const pageUrl = 'https://www.tiktok.com/explore'
  function creator(stableId: string) {
    return {
      platform: 'tiktok' as const,
      stable_id: stableId,
      username: stableId,
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
    }
  }

  await Promise.all([
    service.ingest({
      creators: [creator('embedded-creator')],
      videos: [],
      comments: [],
      context: {
        page_url: pageUrl,
        source: 'embedded',
        observed_at: '2026-08-30T07:00:00.000Z',
        tab_id: 21,
        page_instance_id: 'instance-1'
      }
    }),
    service.ingest({
      creators: [creator('dom-creator')],
      videos: [],
      comments: [],
      context: {
        page_url: pageUrl,
        source: 'dom',
        observed_at: '2026-08-30T07:01:00.000Z',
        tab_id: 21,
        page_instance_id: 'instance-1'
      }
    })
  ])
  await service.ingest({
    creators: [],
    videos: [],
    comments: [{
      platform: 'tiktok',
      comment_id: 'comment-1',
      video_id: null,
      author_id: null,
      author_username: null,
      author_nickname: null,
      text: '脱敏评论',
      like_count: null,
      analysis_status: 'pending'
    }],
    context: {
      page_url: pageUrl,
      source: 'network',
      observed_at: '2026-08-30T07:02:00.000Z',
      tab_id: 21,
      page_instance_id: 'instance-1'
    }
  })

  assert.deepEqual(await service.getPageData(pageUrl, 21), {
    creatorIdentities: ['tiktok:embedded-creator', 'tiktok:dom-creator'],
    summary: {
      discovered: 2,
      inserted: 2,
      updated: 0,
      videos: 0,
      comments: 1,
      pending_comments: 1
    }
  })

  await service.ingest({
    creators: [creator('new-instance-creator')],
    videos: [],
    comments: [],
    context: {
      page_url: pageUrl,
      source: 'dom',
      observed_at: '2026-08-30T07:10:00.000Z',
      tab_id: 21,
      page_instance_id: 'instance-2'
    }
  })

  assert.deepEqual(await service.getPageData(pageUrl, 21), {
    creatorIdentities: ['tiktok:new-instance-creator'],
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

test('TikTok 主页和视频页弹窗只投影 URL 主体且全局达人池保留完整发现', async () => {
  const storage: Record<string, unknown> = {}
  const projectedUsernames: Array<string | null> = []
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
    now: () => '2026-08-30T07:30:00.000Z',
    upsertCreator(creator) {
      projectedUsernames.push(creator.username)
    },
    persistCreatorPool() {},
    markCreatorsSynced() {},
    async openPopup() {}
  })
  function creator(stableId: string, username: string) {
    return {
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
    }
  }
  const cases = [
    {
      pageUrl: 'https://www.tiktok.com/@profile_owner',
      tabId: 31,
      owner: creator('profile-owner-id', 'profile_owner'),
      recommended: creator('profile-recommended-id', 'profile_recommended')
    },
    {
      pageUrl: 'https://www.tiktok.com/@video_owner/video/video-1',
      tabId: 32,
      owner: creator('video-owner-id', 'video_owner'),
      recommended: creator('video-recommended-id', 'video_recommended')
    }
  ]

  for (const [index, item] of cases.entries()) {
    const ownerVideoId = `owner-video-${index}`
    const recommendedVideoId = `recommended-video-${index}`
    await service.ingest({
      creators: [item.owner, item.recommended],
      videos: [
        {
          platform: 'tiktok', video_id: ownerVideoId,
          creator_stable_id: item.owner.stable_id, creator_username: item.owner.username,
          url: null, description: null, like_count: null, play_count: null,
          favorite_count: null, comment_count: null, share_count: null
        },
        {
          platform: 'tiktok', video_id: recommendedVideoId,
          creator_stable_id: item.recommended.stable_id, creator_username: item.recommended.username,
          url: null, description: null, like_count: null, play_count: null,
          favorite_count: null, comment_count: null, share_count: null
        }
      ],
      comments: [
        {
          platform: 'tiktok', comment_id: `owner-comment-${index}`, video_id: ownerVideoId,
          author_id: null, author_username: null, author_nickname: null,
          text: '主页脱敏评论', like_count: null, analysis_status: 'pending'
        },
        {
          platform: 'tiktok', comment_id: `recommended-comment-${index}`, video_id: recommendedVideoId,
          author_id: null, author_username: null, author_nickname: null,
          text: '推荐内容脱敏评论', like_count: null, analysis_status: 'pending'
        }
      ],
      context: {
        page_url: item.pageUrl,
        source: 'network',
        observed_at: `2026-08-30T07:3${index}:00.000Z`,
        tab_id: item.tabId,
        page_instance_id: `owner-instance-${index}`
      }
    })

    assert.deepEqual(await service.getPageData(item.pageUrl, item.tabId), {
      creatorIdentities: [`tiktok:${item.owner.stable_id}`],
      summary: {
        discovered: 1,
        inserted: 1,
        updated: 0,
        videos: 1,
        comments: 1,
        pending_comments: 1
      }
    })
  }

  assert.deepEqual(projectedUsernames, [
    'profile_owner',
    'profile_recommended',
    'video_owner',
    'video_recommended'
  ])
})

test('删除 TikTok 达人后同步移除页面快照身份并重算摘要', async () => {
  const storage: Record<string, unknown> = {}
  const service = createTikTokBackgroundService({
    storage: {
      async get(key) {
        return { [String(key)]: storage[String(key)] }
      },
      async set(items) {
        Object.assign(storage, items)
      }
    },
    getApiBase: () => '',
    fetch: async () => ({ ok: true }) as Response,
    now: () => '2026-08-30T07:40:00.000Z',
    upsertCreator() {},
    persistCreatorPool() {},
    markCreatorsSynced() {},
    async openPopup() {}
  })
  const pageUrl = 'https://www.tiktok.com/explore'
  const creator = (stableId: string) => ({
    platform: 'tiktok' as const,
    stable_id: stableId,
    username: stableId,
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
  })

  await service.ingest({
    creators: [creator('delete-id'), creator('keep-id')],
    videos: [],
    comments: [],
    context: {
      page_url: pageUrl,
      source: 'dom',
      observed_at: '2026-08-30T07:40:00.000Z',
      tab_id: 41,
      page_instance_id: 'delete-instance'
    }
  })
  await service.deleteCreator('tiktok:delete-id')

  assert.deepEqual(await service.getPageData(pageUrl, 41), {
    creatorIdentities: ['tiktok:keep-id'],
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

test('跨页面升级稳定身份后原页仍可投影并按稳定身份删除', async () => {
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
    now: () => '2026-08-30T08:00:00.000Z',
    upsertCreator() {},
    persistCreatorPool() {},
    markCreatorsSynced() {},
    async openPopup() {}
  })
  const creator = (stableId: string | null) => ({
    platform: 'tiktok' as const,
    stable_id: stableId,
    username: 'alias_creator',
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
  })
  const originalPageUrl = 'https://www.tiktok.com/explore'

  await service.ingest({
    creators: [creator(null)],
    videos: [],
    comments: [],
    context: {
      page_url: originalPageUrl,
      source: 'dom',
      observed_at: '2026-08-30T08:00:00.000Z',
      tab_id: 51,
      page_instance_id: 'alias-original-instance'
    }
  })
  await service.ingest({
    creators: [creator('stable-alias-id')],
    videos: [],
    comments: [],
    context: {
      page_url: 'https://www.tiktok.com/search?q=alias',
      source: 'network',
      observed_at: '2026-08-30T08:01:00.000Z',
      tab_id: 52,
      page_instance_id: 'alias-upgrade-instance'
    }
  })

  assert.deepEqual(await service.getPageData(originalPageUrl, 51), {
    creatorIdentities: ['tiktok:stable-alias-id'],
    summary: {
      discovered: 1,
      inserted: 1,
      updated: 0,
      videos: 0,
      comments: 0,
      pending_comments: 0
    }
  })

  await service.deleteCreator('tiktok:stable-alias-id')

  assert.deepEqual(await service.getPageData(originalPageUrl, 51), {
    creatorIdentities: [],
    summary: {
      discovered: 0,
      inserted: 0,
      updated: 0,
      videos: 0,
      comments: 0,
      pending_comments: 0
    }
  })
})

test('TikTok 加载持久化状态时迁移负获赞值并回写发现数据', async () => {
  const storage: Record<string, unknown> = {
    cw_tiktok_discovery_state: {
      creators: [{
        platform: 'tiktok',
        stable_id: 'legacy-negative-id',
        username: 'legacy_negative',
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
        total_favorited: -1594967296,
        first_seen_at: '2026-08-29T00:00:00.000Z',
        last_seen_at: '2026-08-29T00:00:00.000Z',
        field_sources: {}
      }],
      videos: [],
      comments: [],
      sources: [],
      insights: []
    }
  }
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
    now: () => '2026-08-30T07:50:00.000Z',
    upsertCreator() {},
    persistCreatorPool() {},
    markCreatorsSynced() {},
    async openPopup() {}
  })

  const insights = await service.getCreatorInsights('tiktok:legacy-negative-id')
  const persistedState = storage.cw_tiktok_discovery_state as {
    creators: Array<{ total_favorited: number | null }>
  }

  assert.equal(insights.creator?.total_favorited, 2700000000)
  assert.equal(persistedState.creators[0]?.total_favorited, 2700000000)
})
