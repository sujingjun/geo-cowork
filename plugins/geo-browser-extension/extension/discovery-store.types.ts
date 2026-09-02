import type {
  TikTokCommentObservation,
  TikTokCreatorObservation,
  TikTokDiscoverySource,
  TikTokVideoObservation
} from './tiktok-discovery.types'
import type {
  TikTokCommentAnalysisSummary
} from '../shared/types/tiktok-comment-analysis'

export interface DiscoveryFieldSource {
  source: TikTokDiscoverySource
  observed_at: string
}

export interface StoredTikTokCreator extends TikTokCreatorObservation {
  first_seen_at: string
  last_seen_at: string
  field_sources: Partial<Record<keyof TikTokCreatorObservation, DiscoveryFieldSource>>
}

export interface StoredTikTokVideo extends TikTokVideoObservation {
  engagement_rate: number | null
  first_seen_at: string
  last_seen_at: string
  field_sources: Partial<Record<keyof TikTokVideoObservation, DiscoveryFieldSource>>
}

export interface StoredTikTokComment extends TikTokCommentObservation {
  discovered_at: string
  expires_at: string
  sentiment: 'positive' | 'neutral' | 'negative' | null
  sentiment_confidence: number | null
  keywords: string[]
}

export interface TikTokDiscoverySourceRecord {
  platform: 'tiktok'
  creator_identity: string
  page_url: string
  source: TikTokDiscoverySource
  observed_at: string
}

export interface StoredTikTokCommentInsight {
  creator_identity: string
  summary: TikTokCommentAnalysisSummary
  analyzed_at: string
}

export interface TikTokDiscoveryState {
  creators: StoredTikTokCreator[]
  videos: StoredTikTokVideo[]
  comments: StoredTikTokComment[]
  sources: TikTokDiscoverySourceRecord[]
  insights: StoredTikTokCommentInsight[]
}

export interface TikTokDiscoverySummary {
  discovered: number
  inserted: number
  updated: number
  videos: number
  comments: number
  pending_comments: number
}

export type TikTokDiscoveryCreatorChangeStatus = 'inserted' | 'updated' | 'unchanged'

export interface TikTokDiscoveryCreatorChange {
  identity: string
  status: TikTokDiscoveryCreatorChangeStatus
}

export interface TikTokDiscoveryIngestResult {
  state: TikTokDiscoveryState
  summary: TikTokDiscoverySummary
  creatorChanges: TikTokDiscoveryCreatorChange[]
}
