import type { CreatorDisplayIdentity } from '../types/creator-display'

function handle(value: string | null | undefined): string | null {
  const normalized = value?.trim().replace(/^@/, '')
  return normalized || null
}

export function getCreatorDisplayName(creator: CreatorDisplayIdentity): string {
  const nickname = creator.nickname?.trim()
  if (nickname) return nickname

  const publicHandle = handle(creator.unique_id)
    || handle(creator.platform_uid)
    || handle(creator.short_id)
  if (publicHandle) return `@${publicHandle}`

  const stableId = handle(creator.stable_id) || handle(creator.sec_uid)
  if (stableId) {
    const label = creator.platform === 'tiktok' ? 'TikTok 达人' : '抖音达人'
    return `${label} · ${stableId.slice(0, 8)}${stableId.length > 8 ? '…' : ''}`
  }
  return '未命名达人'
}

export function getCreatorProfileUrl(creator: CreatorDisplayIdentity): string | null {
  if (creator.platform === 'tiktok') {
    const username = handle(creator.platform_uid) || handle(creator.unique_id)
    return username ? `https://www.tiktok.com/@${encodeURIComponent(username)}` : null
  }

  const secUid = handle(creator.sec_uid)
  return secUid ? `https://www.douyin.com/user/${encodeURIComponent(secUid)}` : null
}
