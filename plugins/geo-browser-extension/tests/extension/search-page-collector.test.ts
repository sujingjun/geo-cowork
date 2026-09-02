import assert from 'node:assert/strict'
import test from 'node:test'

import { extractSearchCreatorsFromPage } from '../../extension/search-page-collector'

test('从抖音搜索页达人链接提取并去重候选', () => {
  const originalDocument = globalThis.document
  globalThis.document = {
    querySelectorAll() {
      return [
        { href: 'https://www.douyin.com/user/sec-1?from=search', textContent: '@达人甲' },
        { href: 'https://www.douyin.com/user/sec-1', textContent: '@达人甲' },
        { href: 'https://www.douyin.com/user/sec-2', textContent: '达人乙' }
      ]
    }
  } as unknown as Document

  try {
    assert.deepEqual(extractSearchCreatorsFromPage(), [
      { sec_uid: 'sec-1', nickname: '达人甲' },
      { sec_uid: 'sec-2', nickname: '达人乙' }
    ])
  } finally {
    globalThis.document = originalDocument
  }
})
