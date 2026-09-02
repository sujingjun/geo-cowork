import type { CreatorPlatform } from '../shared/types/creator-platform'
import type { DmPlatformConfigs } from './dm-sender.types'

export const DOUYIN_RATE_LIMIT_KEYWORDS = [
  '给陌生人发送消息过于频繁',
  '一口气发太多啦',
  '操作过于频繁',
  '请稍后再试'
]

export const DM_PLATFORM_CONFIGS: DmPlatformConfigs = {
  douyin: {
    messageButtonLabels: ['私信'],
    inputSelectors: [
      '[data-e2e="msg-input"] [contenteditable="true"]',
      '[contenteditable="true"][role="textbox"]',
      '.DraftEditor-content[contenteditable="true"]'
    ],
    sendWithEnter: false,
    rateLimitKeywords: DOUYIN_RATE_LIMIT_KEYWORDS
  },
  tiktok: {
    messageButtonLabels: ['Message', 'Send message', '消息', '发送消息', '发消息', '私信'],
    inputSelectors: [
      '.public-DraftEditor-content[contenteditable="true"]',
      '[contenteditable="true"][role="textbox"][aria-label*="发送消息"]',
      '[contenteditable="true"][role="textbox"][aria-label]'
    ],
    sendWithEnter: true,
    rateLimitKeywords: ['Too many attempts', 'Try again later', '操作过于频繁', '请稍后再试']
  }
}

export function getDmPlatformConfig(platform: CreatorPlatform) {
  return DM_PLATFORM_CONFIGS[platform]
}
