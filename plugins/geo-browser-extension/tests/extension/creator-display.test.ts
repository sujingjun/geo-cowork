import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getCreatorDisplayName,
  getCreatorProfileUrl
} from '../../shared/utils/creator-display'

test('达人缺少昵称时使用平台标识而不是显示未知达人', () => {
  assert.equal(getCreatorDisplayName({
    platform: 'tiktok',
    nickname: null,
    platform_uid: 'creator_one',
    sec_uid: null,
    unique_id: 'creator_one',
    short_id: null
  }), '@creator_one')

  assert.equal(getCreatorDisplayName({
    platform: 'douyin',
    nickname: null,
    platform_uid: null,
    sec_uid: 'MS4wLjABAAAA',
    unique_id: 'douyin_creator',
    short_id: null
  }), '@douyin_creator')
})

test('按平台生成达人主页入口', () => {
  assert.equal(getCreatorProfileUrl({
    platform: 'tiktok',
    nickname: null,
    platform_uid: '@creator.one',
    sec_uid: null
  }), 'https://www.tiktok.com/@creator.one')

  assert.equal(getCreatorProfileUrl({
    platform: 'douyin',
    nickname: null,
    platform_uid: null,
    sec_uid: 'douyin-sec'
  }), 'https://www.douyin.com/user/douyin-sec')
})
