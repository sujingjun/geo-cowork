import type { Creator } from './types'

export const CREATOR_STATUS_LABELS: Record<Creator['status'], string> = {
  pending: '待发送',
  sent: '已发送',
  replied: '已回复',
  converted: '已转化',
  blocked: '已封禁'
}

export const SUPPORTED_PROFILE_URL_PATTERNS = [
  'https://www.douyin.com/*',
  'https://www.tiktok.com/*'
]
