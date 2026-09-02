import assert from 'node:assert/strict'
import test from 'node:test'

import { openExtensionPopup } from '../../extension/popup-opener'

test('自动 popup 回退为独立窗口时保留触发识别的页面 URL', async () => {
  const originalChrome = globalThis.chrome
  let createdUrl = ''
  globalThis.chrome = {
    action: {
      async openPopup() {
        throw new Error('popup unavailable')
      }
    },
    runtime: {
      getURL(path: string) {
        return `chrome-extension://example/${path}`
      }
    },
    windows: {
      async create(options: chrome.windows.CreateData) {
        createdUrl = String(options.url || '')
        return {} as chrome.windows.Window
      }
    }
  } as unknown as typeof chrome

  try {
    await openExtensionPopup('https://www.tiktok.com/search?q=beauty', 17)
    assert.equal(
      createdUrl,
      'chrome-extension://example/popup.html?pageUrl=https%3A%2F%2Fwww.tiktok.com%2Fsearch%3Fq%3Dbeauty&sourceTabId=17'
    )
  } finally {
    globalThis.chrome = originalChrome
  }
})
