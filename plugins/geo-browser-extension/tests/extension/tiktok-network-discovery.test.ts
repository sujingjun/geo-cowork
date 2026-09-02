import assert from 'node:assert/strict'
import test from 'node:test'

import { initTikTokNetworkDiscovery } from '../../extension/tiktok-network-discovery'
import { TIKTOK_DISCOVERY_WINDOW_MESSAGE } from '../../extension/tiktok-passive-discovery.constants'

test('TikTok 网络发现只观察页面原请求并发送规范化数据', async () => {
  const originalWindow = globalThis.window
  const postedMessages: unknown[] = []
  let fetchCount = 0
  const responsePayload = {
    itemList: [{
      id: 'video-1',
      author: {
        id: 'user-1',
        uniqueId: 'creator_one',
        nickname: 'Creator One'
      },
      stats: {
        diggCount: 100,
        playCount: 1000,
        commentCount: 10,
        shareCount: 5
      }
    }]
  }
  const originalFetch = async () => {
    fetchCount++
    return {
      clone() {
        return {
          async json() {
            return responsePayload
          }
        }
      }
    } as Response
  }

  globalThis.window = {
    location: {
      href: 'https://www.tiktok.com/foryou',
      origin: 'https://www.tiktok.com'
    },
    fetch: originalFetch,
    postMessage(message: unknown) {
      postedMessages.push(message)
    }
  } as unknown as Window & typeof globalThis

  try {
    initTikTokNetworkDiscovery({ now: () => '2026-08-30T04:30:00.000Z' })
    await window.fetch('https://www.tiktok.com/api/recommend/item_list/')
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.equal(fetchCount, 1)
    assert.equal(postedMessages.length, 1)
    const message = postedMessages[0] as {
      type: string
      data: {
        creators: Array<{ stable_id: string, username: string }>
        videos: Array<{ video_id: string }>
      }
    }
    assert.equal(message.type, TIKTOK_DISCOVERY_WINDOW_MESSAGE)
    assert.deepEqual(message.data.creators.map(creator => ({
      stable_id: creator.stable_id,
      username: creator.username
    })), [{ stable_id: 'user-1', username: 'creator_one' }])
    assert.deepEqual(message.data.videos.map(video => video.video_id), ['video-1'])
  } finally {
    globalThis.window = originalWindow
  }
})

test('TikTok 网络发现观察页面 XMLHttpRequest 已返回的评论', async () => {
  const originalWindow = globalThis.window
  const postedMessages: unknown[] = []
  let sendCount = 0

  class FakeXMLHttpRequest {
    responseType: XMLHttpRequestResponseType = ''
    responseText = JSON.stringify({
      comments: [{
        cid: 'comment-1',
        aweme_id: 'video-1',
        text: 'So useful',
        user: { uid: 'audience-1', unique_id: 'fan_one' }
      }]
    })

    private listeners: Array<() => void> = []

    open(_method: string, _url: string | URL) {}

    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      if (type === 'load' && typeof listener === 'function') {
        this.listeners.push(() => listener.call(this, {} as Event))
      }
    }

    send() {
      sendCount++
      for (const listener of this.listeners) listener()
    }
  }

  globalThis.window = {
    location: {
      href: 'https://www.tiktok.com/@creator_one/video/video-1',
      origin: 'https://www.tiktok.com'
    },
    fetch: async () => ({}) as Response,
    XMLHttpRequest: FakeXMLHttpRequest,
    postMessage(message: unknown) {
      postedMessages.push(message)
    }
  } as unknown as Window & typeof globalThis

  try {
    initTikTokNetworkDiscovery({ now: () => '2026-08-30T04:35:00.000Z' })
    const xhr = new window.XMLHttpRequest()
    xhr.open('GET', 'https://www.tiktok.com/api/comment/list/')
    xhr.send()
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.equal(sendCount, 1)
    assert.equal(postedMessages.length, 1)
    const message = postedMessages[0] as {
      data: { comments: Array<{ comment_id: string, analysis_status: string }> }
    }
    assert.deepEqual(message.data.comments.map(comment => ({
      comment_id: comment.comment_id,
      analysis_status: comment.analysis_status
    })), [{ comment_id: 'comment-1', analysis_status: 'pending' }])
  } finally {
    globalThis.window = originalWindow
  }
})

test('TikTok fetch 迟到响应保留请求发起时页面且不增加请求', async () => {
  const originalWindow = globalThis.window
  const postedMessages: Array<{ data: { context: { page_url: string } } }> = []
  const location = {
    href: 'https://www.tiktok.com/explore',
    origin: 'https://www.tiktok.com'
  }
  let fetchCount = 0
  let resolveResponse: ((response: Response) => void) | undefined
  const responsePromise = new Promise<Response>((resolve) => {
    resolveResponse = resolve
  })

  globalThis.window = {
    location,
    fetch() {
      fetchCount++
      return responsePromise
    },
    postMessage(message: { data: { context: { page_url: string } } }) {
      postedMessages.push(message)
    }
  } as unknown as Window & typeof globalThis

  try {
    initTikTokNetworkDiscovery({ now: () => '2026-08-30T08:10:00.000Z' })
    const request = window.fetch('https://www.tiktok.com/api/recommend/item_list/')
    location.href = 'https://www.tiktok.com/search?q=beauty'
    resolveResponse?.({
      clone() {
        return {
          async json() {
            return {
              itemList: [{
                id: 'late-video-id',
                author: {
                  id: 'late-creator-id',
                  uniqueId: 'late_creator',
                  nickname: 'Late Creator'
                },
                stats: { playCount: 100 }
              }]
            }
          }
        } as Response
      }
    } as Response)
    await request
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.equal(fetchCount, 1)
    assert.equal(postedMessages.length, 1)
    assert.equal(postedMessages[0]?.data.context.page_url, 'https://www.tiktok.com/explore')
  } finally {
    globalThis.window = originalWindow
  }
})
