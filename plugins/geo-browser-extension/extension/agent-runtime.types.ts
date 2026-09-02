import type { CommentRecord, Creator } from './types'
import type { CreatorPlatform } from '../shared/types/creator-platform'

export interface AgentRuntimeDependencies {
  openTab: (url: string) => Promise<{ id?: number }>
  getCreators: () => Creator[]
  getComments: () => CommentRecord[]
  getProfile: (secUid: string) => Record<string, unknown> | undefined
}

export interface SearchCreatorsInput {
  keyword: string
  minFollowers?: number
  maxFollowers?: number
  targetCount?: number
}

export interface CrawlCommentsInput {
  videoUrl?: string
  awemeId?: string
}

export interface CreatorProfileInput {
  platform: CreatorPlatform
  recipientId: string
}

export interface OutreachStatusInput {
  status?: string
  page?: number
  pageSize?: number
}
