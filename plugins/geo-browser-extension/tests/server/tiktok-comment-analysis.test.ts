import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createTikTokCommentAnalysisResponse,
  summarizeTikTokCommentAnalyses
} from '../../server/utils/tiktok-comment-analysis'

test('按逐条评论分析确定性汇总情感分布和高频关键词', () => {
  const summary = summarizeTikTokCommentAnalyses([
    {
      comment_id: 'comment-1',
      sentiment: 'positive',
      confidence: 0.9,
      keywords: ['质量', '推荐']
    },
    {
      comment_id: 'comment-2',
      sentiment: 'negative',
      confidence: 0.8,
      keywords: ['价格', '质量']
    },
    {
      comment_id: 'comment-3',
      sentiment: 'neutral',
      confidence: 0.7,
      keywords: ['价格']
    }
  ])

  assert.deepEqual(summary, {
    positive_count: 1,
    neutral_count: 1,
    negative_count: 1,
    analyzed_comment_count: 3,
    keywords: [
      { keyword: '价格', count: 2 },
      { keyword: '质量', count: 2 },
      { keyword: '推荐', count: 1 }
    ]
  })
})

test('评论分析只接受与本次请求一一对应的模型结果', () => {
  const request = {
    creator_identity: 'tiktok:user-1',
    comments: [
      { comment_id: 'comment-1', video_id: 'video-1', text: '很好' },
      { comment_id: 'comment-2', video_id: 'video-1', text: '一般' }
    ]
  }
  const items = [
    { comment_id: 'comment-1', sentiment: 'positive' as const, confidence: 0.9, keywords: ['推荐'] },
    { comment_id: 'comment-2', sentiment: 'neutral' as const, confidence: 0.8, keywords: ['体验'] }
  ]

  const response = createTikTokCommentAnalysisResponse(
    request,
    items,
    '2026-08-30T05:00:00.000Z'
  )
  assert.equal(response.summary.analyzed_comment_count, 2)
  assert.throws(() => createTikTokCommentAnalysisResponse(
    request,
    [items[0]!],
    '2026-08-30T05:00:00.000Z'
  ), /模型结果未覆盖本次全部评论/)
})
