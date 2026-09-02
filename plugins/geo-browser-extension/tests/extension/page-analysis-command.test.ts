import assert from 'node:assert/strict'
import test from 'node:test'

import { analyzePageInTab } from '../../extension/page-analysis-service'

test('Agent 页面触发画像分析时会选择最近使用的受支持页面', async () => {
  const originalChrome = globalThis.chrome
  const analyzedTabIds: number[] = []

  globalThis.chrome = {
    tabs: {
      async query(queryInfo: chrome.tabs.QueryInfo) {
        if (queryInfo.active) {
          return [{ id: 1, url: 'chrome-extension://example/index.html#/workbench' }]
        }
        return [
          { id: 2, url: 'https://www.tiktok.com/@creator', lastAccessed: 20 },
          { id: 3, url: 'https://www.douyin.com/user/abc', lastAccessed: 10 }
        ]
      },
      async sendMessage(tabId: number) {
        analyzedTabIds.push(tabId)
        return {
          success: true,
          candidate: {
            platform: 'tiktok',
            url: 'https://www.tiktok.com/@creator',
            isProfilePage: false,
            confidence: 0,
            extractedFields: {},
            signals: [],
            rawSummary: ''
          }
        }
      }
    }
  } as unknown as typeof chrome

  try {
    const result = await analyzePageInTab(undefined, async () => {
      throw new Error('不应进入 LLM 分析')
    })

    assert.deepEqual(analyzedTabIds, [2])
    assert.deepEqual(result, {
      success: true,
      analysis: null,
      message: '当前页面未识别到达人画像'
    })
  } finally {
    globalThis.chrome = originalChrome
  }
})
