import type { CreatorIdentity, DmRecipient } from '../types/creator-platform'

export function filterCreatorsByPlatform<T extends { platform: CreatorIdentity['platform'] }>(
  creators: T[],
  platform: CreatorIdentity['platform'] | null | undefined
): T[] {
  return platform ? creators.filter(creator => creator.platform === platform) : creators
}

export function resolveCreatorRecipient(creator: CreatorIdentity): DmRecipient {
  if (creator.platform === 'douyin') {
    if (!creator.sec_uid) throw new Error('抖音达人缺少 sec_uid')
    return {
      platform: 'douyin',
      recipientId: creator.sec_uid,
      nickname: creator.nickname || undefined
    }
  }

  if (!creator.platform_uid) throw new Error('TikTok 达人缺少 TikTok 用户名')
  return {
    platform: 'tiktok',
    recipientId: creator.platform_uid.replace(/^@/, ''),
    nickname: creator.nickname || undefined
  }
}
