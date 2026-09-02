import assert from 'node:assert/strict'
import test from 'node:test'

import { getCreatorCollectionGuidance } from '../../shared/utils/creator-collection-guidance'

test('达人指标缺失时给出可执行的主页和视频页采集引导', () => {
  const guidance = getCreatorCollectionGuidance({
    creator: {
      platform: 'tiktok',
      nickname: 'Creator One',
      platform_uid: 'creator_one',
      sec_uid: null,
      avatar_url: null,
      signature: null,
      country: null,
      language: null,
      follower_count: null
    },
    videos: [{
      video_id: 'video-1',
      url: 'https://www.tiktok.com/@creator_one/video/video-1',
      like_count: 100,
      play_count: null,
      favorite_count: null,
      comment_count: 8,
      share_count: null
    }],
    collectedCommentCount: 8
  })

  assert.deepEqual(guidance, [
    {
      kind: 'profile',
      label: '打开达人主页补全画像',
      message: '头像、简介、国家、语言、粉丝数存在缺失。',
      url: 'https://www.tiktok.com/@creator_one'
    },
    {
      kind: 'video',
      label: '打开视频页补全指标',
      message: '播放、收藏、分享次数存在缺失。',
      url: 'https://www.tiktok.com/@creator_one/video/video-1'
    },
    {
      kind: 'comments',
      label: '打开视频页继续采集评论',
      message: '当前已采集 8 条评论，建议至少采集 50 条。',
      url: 'https://www.tiktok.com/@creator_one/video/video-1'
    }
  ])
})
