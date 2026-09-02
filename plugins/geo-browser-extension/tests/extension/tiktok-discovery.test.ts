import assert from 'node:assert/strict'
import test from 'node:test'

import {
  extractTikTokDiscoveryFromDocument,
  extractTikTokDiscoveryFromDom,
  extractTikTokDiscoveryFromPayload
} from '../../extension/tiktok-discovery'

test('从 TikTok 已返回数据发现达人、视频和待分析评论', () => {
  const batch = extractTikTokDiscoveryFromPayload({
    itemList: [{
      id: 'video-1',
      desc: '新品试用',
      author: {
        id: 'user-1',
        uniqueId: 'creator_one',
        nickname: 'Creator One',
        avatarLarger: 'https://example.test/avatar.jpg',
        region: 'US',
        language: 'en'
      },
      authorStats: {
        followerCount: 1234
      },
      stats: {
        diggCount: 100,
        playCount: 1000,
        collectCount: 20,
        commentCount: 10,
        shareCount: 5
      }
    }],
    comments: [{
      cid: 'comment-1',
      aweme_id: 'video-1',
      text: 'Love this product',
      digg_count: 8,
      user: {
        uid: 'audience-1',
        unique_id: 'fan_one',
        nickname: 'Fan One'
      }
    }]
  }, {
    pageUrl: 'https://www.tiktok.com/search?q=beauty',
    source: 'network',
    observedAt: '2026-08-30T04:00:00.000Z'
  })

  assert.deepEqual(batch.creators, [{
    platform: 'tiktok',
    stable_id: 'user-1',
    username: 'creator_one',
    nickname: 'Creator One',
    avatar_url: 'https://example.test/avatar.jpg',
    signature: null,
    country: 'US',
    language: 'en',
    gender: null,
    skin_tone: null,
    age_range: null,
    follower_count: 1234,
    following_count: null,
    video_count: null,
    total_favorited: null
  }])
  assert.deepEqual(batch.videos, [{
    platform: 'tiktok',
    video_id: 'video-1',
    creator_stable_id: 'user-1',
    creator_username: 'creator_one',
    url: 'https://www.tiktok.com/@creator_one/video/video-1',
    description: '新品试用',
    like_count: 100,
    play_count: 1000,
    favorite_count: 20,
    comment_count: 10,
    share_count: 5
  }])
  assert.deepEqual(batch.comments, [{
    platform: 'tiktok',
    comment_id: 'comment-1',
    video_id: 'video-1',
    author_id: 'audience-1',
    author_username: 'fan_one',
    author_nickname: 'Fan One',
    text: 'Love this product',
    like_count: 8,
    analysis_status: 'pending'
  }])
  assert.deepEqual(batch.context, {
    page_url: 'https://www.tiktok.com/search?q=beauty',
    source: 'network',
    observed_at: '2026-08-30T04:00:00.000Z'
  })
})

test('从 TikTok 当前页面嵌入数据发现并合并同一达人', () => {
  const hydration = {
    __DEFAULT_SCOPE__: {
      'webapp.user-detail': {
        userInfo: {
          user: {
            id: 'user-1',
            uniqueId: 'creator_one',
            nickname: 'Creator One',
            signature: 'Beauty creator',
            region: 'US'
          },
          stats: {
            followerCount: 2000,
            followingCount: 100,
            videoCount: 30,
            heartCount: 50000
          }
        }
      },
      'webapp.video-detail': {
        itemInfo: {
          itemStruct: {
            id: 'video-1',
            author: {
              id: 'user-1',
              uniqueId: 'creator_one',
              nickname: 'Creator One'
            },
            stats: {
              diggCount: 200,
              playCount: 4000,
              collectCount: 30,
              commentCount: 40,
              shareCount: 20
            }
          }
        }
      }
    }
  }
  const doc = {
    getElementById(id: string) {
      return id === '__UNIVERSAL_DATA_FOR_REHYDRATION__'
        ? { textContent: JSON.stringify(hydration) }
        : null
    },
    querySelectorAll() {
      return []
    }
  } as unknown as Document

  const batch = extractTikTokDiscoveryFromDocument(
    doc,
    new URL('https://www.tiktok.com/@creator_one/video/video-1'),
    '2026-08-30T04:10:00.000Z'
  )

  assert.equal(batch.creators.length, 1)
  assert.deepEqual(batch.creators[0], {
    platform: 'tiktok',
    stable_id: 'user-1',
    username: 'creator_one',
    nickname: 'Creator One',
    avatar_url: null,
    signature: 'Beauty creator',
    country: 'US',
    language: null,
    gender: null,
    skin_tone: null,
    age_range: null,
    follower_count: 2000,
    following_count: 100,
    video_count: 30,
    total_favorited: 50000
  })
  assert.deepEqual(batch.videos.map(video => video.video_id), ['video-1'])
  assert.deepEqual(batch.context, {
    page_url: 'https://www.tiktok.com/@creator_one/video/video-1',
    source: 'embedded',
    observed_at: '2026-08-30T04:10:00.000Z'
  })
})

test('从 TikTok 列表页面已经渲染的链接发现达人和视频', () => {
  const doc = {
    querySelectorAll() {
      return [
        { href: 'https://www.tiktok.com/@creator_one', textContent: '@creator_one' },
        { href: 'https://www.tiktok.com/@creator_one/video/video-1', textContent: '新品试用' },
        { href: 'https://www.tiktok.com/@creator_one/video/video-1', textContent: '重复链接' }
      ]
    }
  } as unknown as Document

  const batch = extractTikTokDiscoveryFromDom(
    doc,
    new URL('https://www.tiktok.com/search?q=beauty'),
    '2026-08-30T04:15:00.000Z'
  )

  assert.equal(batch.creators.length, 1)
  assert.deepEqual(batch.creators[0], {
    platform: 'tiktok',
    stable_id: null,
    username: 'creator_one',
    nickname: null,
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
  })
  assert.deepEqual(batch.videos, [{
    platform: 'tiktok',
    video_id: 'video-1',
    creator_stable_id: null,
    creator_username: 'creator_one',
    url: 'https://www.tiktok.com/@creator_one/video/video-1',
    description: null,
    like_count: null,
    play_count: null,
    favorite_count: null,
    comment_count: null,
    share_count: null
  }])
  assert.equal(batch.context.source, 'dom')
})

test('从 TikTok 用户搜索返回的独立用户结构发现达人', () => {
  const batch = extractTikTokDiscoveryFromPayload({
    user_list: [{
      user_info: {
        uid: 'user-2',
        unique_id: 'creator_two',
        nickname: 'Creator Two',
        avatar_url: 'https://example.test/two.jpg',
        follower_count: '3,000',
        region: 'GB'
      }
    }]
  }, {
    pageUrl: 'https://www.tiktok.com/search/user?q=beauty',
    source: 'network',
    observedAt: '2026-08-30T04:16:00.000Z'
  })

  assert.deepEqual(batch.creators.map(creator => ({
    stable_id: creator.stable_id,
    username: creator.username,
    nickname: creator.nickname,
    follower_count: creator.follower_count,
    country: creator.country
  })), [{
    stable_id: 'user-2',
    username: 'creator_two',
    nickname: 'Creator Two',
    follower_count: 3000,
    country: 'GB'
  }])
})

test('TikTok 达人主页发现批次保留当前主页和页面公开推荐身份', () => {
  const batch = extractTikTokDiscoveryFromPayload({
    users: [
      {
        user: { id: 'current-id', uniqueId: 'current_creator', nickname: 'Current Creator' },
        stats: { followerCount: 2000 }
      },
      {
        user: { id: 'recommended-id', uniqueId: 'recommended_creator', nickname: 'Recommended Creator' },
        stats: { followerCount: 3000 }
      },
      {
        user: { id: 'signed-in-id', uniqueId: 'signed_in_account', nickname: 'Signed-in Account' },
        stats: { followerCount: 100 }
      }
    ]
  }, {
    pageUrl: 'https://www.tiktok.com/@current_creator',
    source: 'network',
    observedAt: '2026-08-30T06:00:00.000Z'
  })

  assert.deepEqual(
    batch.creators.map(creator => creator.username),
    ['current_creator', 'recommended_creator', 'signed_in_account']
  )
})

test('TikTok 大数获赞计数从有符号 32 位溢出值恢复为非负值', () => {
  const batch = extractTikTokDiscoveryFromPayload({
    user: {
      id: 'large-account-id',
      uniqueId: 'large_account',
      nickname: 'Large Account'
    },
    stats: {
      heartCount: -1594967296
    }
  }, {
    pageUrl: 'https://www.tiktok.com/@large_account',
    source: 'embedded',
    observedAt: '2026-08-30T06:20:00.000Z'
  })

  assert.equal(batch.creators[0]?.total_favorited, 2700000000)
})
