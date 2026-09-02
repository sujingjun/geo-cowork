import assert from 'node:assert/strict'
import test from 'node:test'

import { initTikTokPassiveDiscovery } from '../../extension/tiktok-passive-discovery'
import { TIKTOK_DISCOVERY_WINDOW_MESSAGE } from '../../extension/tiktok-passive-discovery.constants'

test('TikTok 当前页面加载完成后把已嵌入的达人数据发送到后台', async () => {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document
  const originalChrome = globalThis.chrome
  const originalMutationObserver = globalThis.MutationObserver
  const messages: unknown[] = []
  const hydration = {
    __DEFAULT_SCOPE__: {
      'webapp.user-detail': {
        userInfo: {
          user: {
            id: 'user-1',
            uniqueId: 'creator_one',
            nickname: 'Creator One'
          },
          stats: {
            followerCount: 2000
          }
        }
      }
    }
  }

  globalThis.window = {
    location: { href: 'https://www.tiktok.com/foryou' },
    addEventListener() {},
    setTimeout(callback: TimerHandler) {
      if (typeof callback === 'function') callback()
      return 1
    },
    clearTimeout() {}
  } as unknown as Window & typeof globalThis
  globalThis.document = {
    readyState: 'complete',
    documentElement: {},
    getElementById(id: string) {
      return id === '__UNIVERSAL_DATA_FOR_REHYDRATION__'
        ? { textContent: JSON.stringify(hydration) }
        : null
    },
    querySelectorAll() {
      return []
    }
  } as unknown as Document
  globalThis.MutationObserver = class {
    observe() {}
    disconnect() {}
    takeRecords() { return [] }
  } as unknown as typeof MutationObserver
  globalThis.chrome = {
    runtime: {
      async sendMessage(message: unknown) {
        messages.push(message)
      }
    }
  } as unknown as typeof chrome

  try {
    initTikTokPassiveDiscovery({
      now: () => '2026-08-30T04:20:00.000Z',
      createPageInstanceId: () => 'page-instance-1'
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.equal(messages.length, 1)
    assert.deepEqual(messages[0], {
      type: 'TIKTOK_DISCOVERY_DATA',
      data: {
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
        videos: [],
        comments: [],
        context: {
          page_url: 'https://www.tiktok.com/foryou',
          source: 'embedded',
          observed_at: '2026-08-30T04:20:00.000Z',
          page_instance_id: 'page-instance-1'
        }
      }
    })
  } finally {
    globalThis.window = originalWindow
    globalThis.document = originalDocument
    globalThis.chrome = originalChrome
    globalThis.MutationObserver = originalMutationObserver
  }
})

test('TikTok 同一 SPA 页面实例复用 ID 并在 URL 改变时刷新', async () => {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document
  const originalChrome = globalThis.chrome
  const messages: Array<{ data: { context: { page_instance_id?: string } } }> = []
  let messageListener: ((event: MessageEvent) => void) | undefined
  const location = { href: 'https://www.tiktok.com/explore' }
  let nextPageInstance = 1

  globalThis.window = {
    location,
    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      if (type === 'message' && typeof listener === 'function') {
        messageListener = listener as (event: MessageEvent) => void
      }
    }
  } as unknown as Window & typeof globalThis
  globalThis.document = {
    readyState: 'loading',
    documentElement: null
  } as unknown as Document
  globalThis.chrome = {
    runtime: {
      async sendMessage(message: { data: { context: { page_instance_id?: string } } }) {
        messages.push(message)
      }
    }
  } as unknown as typeof chrome

  function networkBatch(pageUrl: string, stableId: string) {
    return {
      creators: [{
        platform: 'tiktok',
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
      }],
      videos: [],
      comments: [],
      context: {
        page_url: pageUrl,
        source: 'network',
        observed_at: '2026-08-30T07:00:00.000Z'
      }
    }
  }

  try {
    initTikTokPassiveDiscovery({
      createPageInstanceId: () => `page-instance-${nextPageInstance++}`
    })
    messageListener?.({
      source: window,
      data: {
        type: TIKTOK_DISCOVERY_WINDOW_MESSAGE,
        data: networkBatch(location.href, 'creator-1')
      }
    } as MessageEvent)
    messageListener?.({
      source: window,
      data: {
        type: TIKTOK_DISCOVERY_WINDOW_MESSAGE,
        data: networkBatch(location.href, 'creator-2')
      }
    } as MessageEvent)
    const previousPageUrl = location.href
    location.href = 'https://www.tiktok.com/search?q=beauty'
    messageListener?.({
      source: window,
      data: {
        type: TIKTOK_DISCOVERY_WINDOW_MESSAGE,
        data: networkBatch(location.href, 'creator-3')
      }
    } as MessageEvent)
    messageListener?.({
      source: window,
      data: {
        type: TIKTOK_DISCOVERY_WINDOW_MESSAGE,
        data: networkBatch(previousPageUrl, 'late-creator')
      }
    } as MessageEvent)
    messageListener?.({
      source: window,
      data: {
        type: TIKTOK_DISCOVERY_WINDOW_MESSAGE,
        data: networkBatch(location.href, 'creator-4')
      }
    } as MessageEvent)
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.deepEqual(
      messages.map(message => message.data.context.page_instance_id),
      ['page-instance-1', 'page-instance-1', 'page-instance-2', 'page-instance-2']
    )
  } finally {
    globalThis.window = originalWindow
    globalThis.document = originalDocument
    globalThis.chrome = originalChrome
  }
})
