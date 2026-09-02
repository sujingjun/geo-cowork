import assert from 'node:assert/strict'
import test from 'node:test'

import {
  applyTikTokCommentAnalysis,
  buildTikTokCommentAnalysisRequest
} from '../../extension/tiktok-comment-analysis'
import { createEmptyTikTokDiscoveryState, ingestTikTokDiscoveryBatch } from '../../extension/discovery-store'

test('用户触发时只发送达人待分析评论并保存逐条结果和汇总', () => {
  const discovered = ingestTikTokDiscoveryBatch(createEmptyTikTokDiscoveryState(), {
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
      follower_count: null,
      following_count: null,
      video_count: null,
      total_favorited: null
    }],
    videos: [{
      platform: 'tiktok',
      video_id: 'video-1',
      creator_stable_id: 'user-1',
      creator_username: 'creator_one',
      url: null,
      description: null,
      like_count: null,
      play_count: null,
      favorite_count: null,
      comment_count: null,
      share_count: null
    }],
    comments: [{
      platform: 'tiktok',
      comment_id: 'comment-1',
      video_id: 'video-1',
      author_id: null,
      author_username: null,
      author_nickname: null,
      text: 'Love this product',
      like_count: 1,
      analysis_status: 'pending'
    }],
    context: {
      page_url: 'https://www.tiktok.com/@creator_one/video/video-1',
      source: 'network',
      observed_at: '2026-08-30T04:40:00.000Z'
    }
  })

  const request = buildTikTokCommentAnalysisRequest(
    discovered.state,
    'tiktok:user-1',
    '2026-08-30T05:00:00.000Z'
  )
  assert.deepEqual(request, {
    creator_identity: 'tiktok:user-1',
    comments: [{
      comment_id: 'comment-1',
      video_id: 'video-1',
      text: 'Love this product'
    }]
  })

  applyTikTokCommentAnalysis(discovered.state, {
    creator_identity: 'tiktok:user-1',
    items: [{
      comment_id: 'comment-1',
      sentiment: 'positive',
      confidence: 0.9,
      keywords: ['quality']
    }],
    summary: {
      positive_count: 1,
      neutral_count: 0,
      negative_count: 0,
      analyzed_comment_count: 1,
      keywords: [{ keyword: 'quality', count: 1 }]
    },
    analyzed_at: '2026-08-30T05:00:01.000Z'
  })

  assert.deepEqual({
    status: discovered.state.comments[0]?.analysis_status,
    sentiment: discovered.state.comments[0]?.sentiment,
    keywords: discovered.state.comments[0]?.keywords,
    raw_text: discovered.state.comments[0]?.text
  }, {
    status: 'analyzed',
    sentiment: 'positive',
    keywords: ['quality'],
    raw_text: 'Love this product'
  })
  assert.equal(discovered.state.insights[0]?.summary.positive_count, 1)

  ingestTikTokDiscoveryBatch(discovered.state, {
    creators: [],
    videos: [],
    comments: [{
      platform: 'tiktok',
      comment_id: 'comment-1',
      video_id: 'video-1',
      author_id: null,
      author_username: null,
      author_nickname: null,
      text: 'Love this product',
      like_count: 2,
      analysis_status: 'pending'
    }],
    context: {
      page_url: 'https://www.tiktok.com/@creator_one/video/video-1',
      source: 'network',
      observed_at: '2026-08-30T05:10:00.000Z'
    }
  })

  assert.equal(discovered.state.comments[0]?.analysis_status, 'analyzed')
})
