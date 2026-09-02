export type CreatorPlatform = 'douyin' | 'tiktok'

export interface CreatorIdentity {
  platform: CreatorPlatform
  platform_uid: string | null
  sec_uid: string | null
  nickname: string | null
}

export interface DmRecipient {
  platform: CreatorPlatform
  recipientId: string
  nickname?: string
}
