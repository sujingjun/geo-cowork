import type { TikTokDiscoverySource } from './tiktok-discovery.types'

export const DISCOVERY_SOURCE_PRIORITY: Record<TikTokDiscoverySource, number> = {
  dom: 1,
  embedded: 2,
  network: 3
}

export const LOCAL_COMMENT_RETENTION_DAYS = 30
