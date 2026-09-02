import type { Creator } from './types'

export interface TikTokCreatorPoolDependencies {
  createId: () => string
  now: () => string
}

export type TikTokCreatorPoolResult = 'inserted' | 'updated'

export type TikTokCreatorPool = Creator[]
