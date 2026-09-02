import assert from 'node:assert/strict'
import test from 'node:test'

test('服务工作线程初始化时迁移达人池中已持久化的负获赞值', async () => {
  const originalChrome = globalThis.chrome
  const storage: Record<string, unknown> = {
    cw_creators: [{
      id: 'legacy-negative-creator',
      platform: 'tiktok',
      platform_uid: 'legacy_negative',
      stable_id: 'legacy-negative-id',
      sec_uid: null,
      nickname: null,
      avatar_url: null,
      signature: null,
      follower_count: null,
      following_count: null,
      aweme_count: null,
      total_favorited: -1594967296,
      unique_id: 'legacy_negative',
      short_id: null,
      region: null,
      country: null,
      language: null,
      gender: null,
      skin_tone: null,
      age_range: null,
      source: 'page',
      sync_status: 'pending',
      status: 'pending',
      created_at: '2026-08-29T00:00:00.000Z',
      updated_at: '2026-08-29T00:00:00.000Z'
    }],
    cw_comments: [],
    cw_stats: {},
    cw_profiles: {},
    api_base: ''
  }
  let onMessage: Parameters<typeof chrome.runtime.onMessage.addListener>[0] | undefined

  globalThis.chrome = {
    storage: {
      local: {
        async get() {
          return storage
        },
        async set(items: Record<string, unknown>) {
          Object.assign(storage, items)
        }
      }
    },
    runtime: {
      onMessage: {
        addListener(listener: typeof onMessage) {
          onMessage = listener
        }
      },
      onInstalled: { addListener() {} }
    },
    tabs: {
      onUpdated: { addListener() {} }
    }
  } as unknown as typeof chrome

  try {
    await import('../../extension/background')
    const response = await new Promise<{ items: Array<{ total_favorited: number | null }> }>((resolve) => {
      onMessage?.(
        { type: 'GET_CREATOR_LIST', params: {} },
        {} as chrome.runtime.MessageSender,
        resolve
      )
    })
    const persistedCreators = storage.cw_creators as Array<{ total_favorited: number | null }>

    assert.equal(response.items[0]?.total_favorited, 2700000000)
    assert.equal(persistedCreators[0]?.total_favorited, 2700000000)
  } finally {
    globalThis.chrome = originalChrome
  }
})
