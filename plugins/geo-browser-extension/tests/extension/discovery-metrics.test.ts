import assert from 'node:assert/strict'
import test from 'node:test'

import {
  calculateCreatorEngagementRate,
  calculateVideoEngagementRate
} from '../../extension/discovery-metrics'
import type { TikTokVideoObservation } from '../../extension/tiktok-discovery.types'

function video(
  videoId: string,
  counts: Pick<TikTokVideoObservation, 'like_count' | 'play_count' | 'favorite_count' | 'comment_count' | 'share_count'>
): TikTokVideoObservation {
  return {
    platform: 'tiktok',
    video_id: videoId,
    creator_stable_id: 'user-1',
    creator_username: 'creator_one',
    url: `https://www.tiktok.com/@creator_one/video/${videoId}`,
    description: null,
    ...counts
  }
}

test('按点赞评论分享与播放量计算视频和达人互动率', () => {
  const videos = [
    video('video-1', {
      like_count: 100,
      play_count: 1000,
      favorite_count: 999,
      comment_count: 10,
      share_count: 5
    }),
    video('video-2', {
      like_count: 40,
      play_count: 500,
      favorite_count: 888,
      comment_count: 5,
      share_count: 5
    })
  ]

  assert.equal(calculateVideoEngagementRate(videos[0]!), 0.115)
  assert.equal(calculateCreatorEngagementRate(videos), 0.11)
})

test('播放量缺失或为零时互动率不可计算', () => {
  const noViews = video('video-3', {
    like_count: 10,
    play_count: 0,
    favorite_count: 5,
    comment_count: 2,
    share_count: 1
  })

  assert.equal(calculateVideoEngagementRate(noViews), null)
  assert.equal(calculateCreatorEngagementRate([noViews]), null)
})
