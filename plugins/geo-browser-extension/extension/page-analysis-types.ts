import type { PageCandidate } from './analyzers/types'
import type { Creator, CreatorPlatform, PageAnalysisResult } from './types'

export interface AnalyzePageApiResponse {
  is_creator_profile: boolean
  confidence: number
  platform: CreatorPlatform | 'instagram' | 'facebook'
  reason: string
  normalized: {
    platform_uid: string
    nickname: string | null
    avatar_url: string | null
    signature: string | null
    follower_count: number | null
    following_count: number | null
    video_count: number | null
    total_favorited: number | null
    region: string | null
  } | null
}

export interface PageAnalysisDependencies {
  getApiBase: () => string
  addCreatorToPool: (
    uid: string,
    data: Partial<Creator>,
    source: Creator['source'],
    platform: CreatorPlatform
  ) => boolean
  findCreator: (platform: CreatorPlatform, uid: string) => Creator | null
  persistCreators: () => void
  persistStats: () => void
  batchUploadToServer: () => Promise<unknown>
}

export interface AnalyzePageCommandResponse {
  success: boolean
  analysis?: PageAnalysisResult | null
  error?: string
  message?: string
}

export type AnalyzeCandidate = (candidate: PageCandidate) => Promise<PageAnalysisResult>
