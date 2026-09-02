/**
 * Extension messaging protocol definitions for the Nuxt app side.
 * Used by composables and components to communicate with the extension.
 */

/// <reference types="@types/chrome" />

import type { CreatorPlatform } from '../../shared/types/creator-platform'
import type {
  TikTokCommentAnalysisResponse,
  TikTokCommentAnalysisSummary,
  TikTokCommentSentiment
} from '../../shared/types/tiktok-comment-analysis'

export type { CreatorPlatform, DmRecipient } from '../../shared/types/creator-platform'

// ─── Runtime message types (app → background via chrome.runtime) ─────

export type AppToBackgroundMessage =
  | { type: 'PING' }
  | { type: 'SEARCH_CREATORS'; params: Record<string, unknown> }
  | { type: 'CRAWL_COMMENTS'; params: Record<string, unknown> }
  | { type: 'SEND_DM'; params: Record<string, unknown> }
  | { type: 'GET_CREATOR_PROFILE'; params: Record<string, unknown> }
  | { type: 'CREATE_MESSAGE_TEMPLATE'; params: Record<string, unknown> }
  | { type: 'CHECK_OUTREACH_STATUS'; params: Record<string, unknown> }
  | { type: 'GET_CREATOR_LIST'; params: { page?: number; pageSize?: number; keyword?: string } }
  | { type: 'GET_PAGE_CREATOR_LIST'; params: { pageUrl: string, tabId?: number } }
  | { type: 'GET_CURRENT_TAGS'; params: Record<string, unknown> }
  | { type: 'GET_CREATOR_TAGS' }
  | { type: 'CREATE_CREATOR_TAG'; name: string }
  | { type: 'GET_SCHEDULE_TASK_SET' }
  | { type: 'RUN_AUTO_CRAWL_BATCH'; params: Record<string, unknown> }
  | { type: 'RUN_AUTO_SEND_BATCH' }
  | { type: 'ANALYZE_PAGE'; params?: { tabId?: number } }
  | { type: 'GET_LAST_ANALYSIS' }
  | {
    type: 'GET_TIKTOK_DISCOVERY_SUMMARY'
  }
  | {
    type: 'GET_TIKTOK_CREATOR_INSIGHTS'
    params: { creatorId?: string, creatorIdentity?: string }
  }
  | {
    type: 'ANALYZE_TIKTOK_COMMENTS'
    params: { creatorId?: string, creatorIdentity?: string }
  }
  | {
    type: 'DELETE_CREATOR'
    params: { creatorId: string }
  }

// ─── Creator data model (shared with extension/types.ts) ─────────────

export interface Creator {
  id: string
  /** Social platform this creator was mined from. Defaults to 'douyin' for legacy records. */
  platform: CreatorPlatform
  /** Platform-specific stable id: Douyin sec_uid, TikTok @username. */
  platform_uid: string | null
  /** Platform-owned stable user id when the current page exposes one. */
  stable_id?: string | null
  /** Douyin-only id. Null for TikTok creators. */
  sec_uid: string | null
  nickname: string | null
  avatar_url: string | null
  signature: string | null
  follower_count: number | null
  following_count: number | null
  /** Video/works count. TikTok video_count maps here. */
  aweme_count: number | null
  total_favorited: number | null
  unique_id: string | null
  short_id: string | null
  region: string | null
  country?: string | null
  language?: string | null
  gender?: string | null
  skin_tone?: string | null
  age_range?: string | null
  source: 'search' | 'comment' | 'profile' | 'page' | 'manual'
  sync_status?: 'pending' | 'synced' | 'error'
  status: 'pending' | 'sent' | 'replied' | 'converted' | 'blocked'
  created_at: string
  updated_at: string
}

/** Result of a page analysis run, as stored by the background worker. */
export interface PageAnalysisResult {
  url: string
  platform: CreatorPlatform
  is_creator_profile: boolean
  confidence: number
  reason: string
  creator: Creator | null
  /** True when the creator was newly inserted into the pool. */
  inserted: boolean
  analyzed_at: string
}

export interface AnalyzePageResponse {
  success: boolean
  analysis?: PageAnalysisResult | null
  error?: string
  message?: string
}

export interface CreatorListResponse {
  items: Creator[]
  total: number
  page: number
  pageSize: number
}

export interface CreatorFilter {
  platform?: CreatorPlatform | null
  keyword?: string | null
  min_followers?: number | null
  max_followers?: number | null
  source?: Creator['source'] | null
  status?: Creator['status'] | null
  page?: number
  pageSize?: number
}

export interface TikTokVideoInsight {
  video_id: string
  url: string | null
  description: string | null
  like_count: number | null
  play_count: number | null
  favorite_count: number | null
  comment_count: number | null
  share_count: number | null
  engagement_rate: number | null
}

export interface TikTokCommentInsightItem {
  comment_id: string
  video_id: string | null
  text: string
  analysis_status: 'pending' | 'analyzed'
  sentiment: TikTokCommentSentiment | null
  sentiment_confidence: number | null
  keywords: string[]
}

export interface TikTokCreatorInsightsResponse {
  found: boolean
  error?: string
  creator_identity?: string
  videos?: TikTokVideoInsight[]
  comments?: TikTokCommentInsightItem[]
  overall_engagement_rate?: number | null
  comment_insight?: {
    creator_identity: string
    summary: TikTokCommentAnalysisSummary
    analyzed_at: string
  } | null
  pending_comments?: number
}

export interface AnalyzeTikTokCommentsResponse {
  success: boolean
  error?: string
  analysis?: TikTokCommentAnalysisResponse
}

// ─── Outreach / DM types ─────────────────────────────────────────────

export interface MessageTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  send_count: number
  reply_count: number
  created_at: string
  updated_at: string
}

export interface OutreachTask {
  id: string
  creator_id: string
  template_id: string | null
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'rate_limited'
  message_content: string | null
  sent_at: string | null
  error: string | null
  created_at: string
}

// ─── Agent tool types ────────────────────────────────────────────────

export interface AgentToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export type AgentToolName =
  | 'search_creators'
  | 'crawl_comments'
  | 'send_dm'
  | 'get_creator_profile'
  | 'create_message_template'
  | 'check_outreach_status'
  | 'analyze_page'

// ─── Environment detection ───────────────────────────────────────────

export function isExtensionEnvironment(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.runtime?.id
}

export function isWebEnvironment(): boolean {
  return !isExtensionEnvironment()
}
