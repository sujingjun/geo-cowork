import assert from 'node:assert/strict'
import test from 'node:test'

import { buildDmProfileUrl, getDmPlatformConfig } from '../../extension/dm-sender'
import { filterCreatorsByPlatform, resolveCreatorRecipient } from '../../shared/utils/creator-platform'

test('抖音达人使用 sec_uid 作为私信收件人', () => {
  const recipient = resolveCreatorRecipient({
    platform: 'douyin',
    sec_uid: 'douyin-sec',
    platform_uid: null,
    nickname: '抖音达人'
  })

  assert.deepEqual(recipient, {
    platform: 'douyin',
    recipientId: 'douyin-sec',
    nickname: '抖音达人'
  })
  assert.equal(buildDmProfileUrl(recipient), 'https://www.douyin.com/user/douyin-sec')
})

test('TikTok 达人使用 platform_uid 作为私信收件人', () => {
  const recipient = resolveCreatorRecipient({
    platform: 'tiktok',
    sec_uid: null,
    platform_uid: 'yi.ng849',
    nickname: 'YI NG'
  })

  assert.deepEqual(recipient, {
    platform: 'tiktok',
    recipientId: 'yi.ng849',
    nickname: 'YI NG'
  })
  assert.equal(buildDmProfileUrl(recipient), 'https://www.tiktok.com/@yi.ng849')
  assert.deepEqual(getDmPlatformConfig('tiktok'), {
    messageButtonLabels: ['Message', '消息'],
    inputSelectors: [
      '.public-DraftEditor-content[contenteditable="true"]',
      '[contenteditable="true"][role="textbox"][aria-label]'
    ],
    sendWithEnter: true,
    rateLimitKeywords: ['Too many attempts', 'Try again later', '操作过于频繁', '请稍后再试']
  })
})

test('平台缺少对应标识时拒绝发送', () => {
  assert.throws(() => resolveCreatorRecipient({
    platform: 'tiktok',
    sec_uid: 'wrong-platform-id',
    platform_uid: null,
    nickname: '缺少用户名'
  }), /缺少 TikTok 用户名/)
})

test('平台过滤默认返回全部并可分别筛选抖音和 TikTok', () => {
  const creators = [
    { id: '1', platform: 'douyin' as const },
    { id: '2', platform: 'tiktok' as const }
  ]

  assert.deepEqual(filterCreatorsByPlatform(creators, null), creators)
  assert.deepEqual(filterCreatorsByPlatform(creators, 'douyin'), [creators[0]])
  assert.deepEqual(filterCreatorsByPlatform(creators, 'tiktok'), [creators[1]])
})
