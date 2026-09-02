import type { CreatorPlatform } from './creator-platform'

export interface CreatorDisplayIdentity {
  platform: CreatorPlatform
  nickname: string | null
  platform_uid: string | null
  sec_uid: string | null
  unique_id?: string | null
  short_id?: string | null
  stable_id?: string | null
}
