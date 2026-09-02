import type { CreatorPlatform } from '../shared/types/creator-platform'

export interface DmPlatformConfig {
  messageButtonLabels: string[]
  inputSelectors: string[]
  sendWithEnter: boolean
  rateLimitKeywords: string[]
}

export type DmPlatformConfigs = Record<CreatorPlatform, DmPlatformConfig>
