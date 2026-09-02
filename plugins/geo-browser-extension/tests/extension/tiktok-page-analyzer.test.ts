import assert from 'node:assert/strict'
import test from 'node:test'

import { initPageAnalyzer } from '../../extension/page-analyzer'

function createTikTokDocument(): Document {
  const hydration = {
    __DEFAULT_SCOPE__: {
      'webapp.user-detail': {
        userInfo: {
          user: {
            uniqueId: 'creator_one',
            nickname: 'Creator One'
          },
          stats: {
            followerCount: 1234
          }
        }
      }
    }
  }

  return {
    readyState: 'complete',
    title: 'Creator One (@creator_one) | TikTok',
    getElementById(id: string) {
      return id === '__UNIVERSAL_DATA_FOR_REHYDRATION__'
        ? { textContent: JSON.stringify(hydration) }
        : null
    },
    querySelector() {
      return null
    }
  } as unknown as Document
}

test('高置信度 TikTok 嵌入数据不重复发送 LLM 候选', async () => {
  const runtimeMessages: unknown[] = []
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document
  const originalChrome = globalThis.chrome

  globalThis.window = {
    location: { href: 'https://www.tiktok.com/@creator_one' },
    addEventListener() {},
    setInterval() {
      return 1
    }
  } as unknown as Window & typeof globalThis
  globalThis.document = createTikTokDocument()
  globalThis.chrome = {
    runtime: {
      async sendMessage(message: unknown) {
        runtimeMessages.push(message)
      },
      onMessage: {
        addListener() {}
      }
    }
  } as unknown as typeof chrome

  try {
    initPageAnalyzer()
    await new Promise(resolve => setTimeout(resolve, 0))

    assert.deepEqual(runtimeMessages, [])
  } finally {
    globalThis.window = originalWindow
    globalThis.document = originalDocument
    globalThis.chrome = originalChrome
  }
})
