import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('工作台达人详情读取 TikTok 洞察并由用户触发评论分析', () => {
  const bridge = readFileSync('app/composables/useExtensionBridge.ts', 'utf-8')
  const discoverPage = readFileSync('app/pages/discover.vue', 'utf-8')
  const creatorCard = readFileSync('app/components/creator/CreatorCard.vue', 'utf-8')

  assert.match(bridge, /GET_TIKTOK_CREATOR_INSIGHTS/)
  assert.match(bridge, /ANALYZE_TIKTOK_COMMENTS/)
  assert.match(discoverPage, /分析评论/)
  assert.match(discoverPage, /overall_engagement_rate/)
  assert.match(discoverPage, /comment_insight/)
  assert.match(creatorCard, /打开主页/)
  assert.match(creatorCard, /删除/)
  assert.match(discoverPage, /getCreatorCollectionGuidance/)
  assert.match(discoverPage, /confirm\(/)
  assert.match(bridge, /DELETE_CREATOR/)
})
