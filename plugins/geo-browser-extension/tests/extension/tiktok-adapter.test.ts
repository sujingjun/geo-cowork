import assert from 'node:assert/strict'
import test from 'node:test'

import { tiktokAdapter } from '../../extension/analyzers/tiktok'

function createDocumentWithHydration(
  uniqueId: string,
  stats: Record<string, number> = { followerCount: 999 }
): Document {
  const hydration = {
    __DEFAULT_SCOPE__: {
      'webapp.user-detail': {
        userInfo: {
          user: {
            uniqueId,
            nickname: '残留页面数据'
          },
          stats
        }
      }
    }
  }

  return {
    title: '',
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

test('忽略与当前 TikTok 主页用户名不一致的残留嵌入数据', () => {
  const candidate = tiktokAdapter.extract(
    createDocumentWithHydration('creator_one'),
    new URL('https://www.tiktok.com/@creator_two')
  )

  assert.ok(candidate)
  assert.deepEqual({
    isProfilePage: candidate.isProfilePage,
    confidence: candidate.confidence,
    platform_uid: candidate.extractedFields.platform_uid,
    nickname: candidate.extractedFields.nickname,
    follower_count: candidate.extractedFields.follower_count
  }, {
    isProfilePage: false,
    confidence: 0.4,
    platform_uid: 'creator_two',
    nickname: undefined,
    follower_count: undefined
  })
})

test('TikTok 主页画像把负溢出的大数获赞恢复为非负值', () => {
  const candidate = tiktokAdapter.extract(
    createDocumentWithHydration('large_account', { heartCount: -1594967296 }),
    new URL('https://www.tiktok.com/@large_account')
  )

  assert.equal(candidate?.extractedFields.total_favorited, 2700000000)
})
