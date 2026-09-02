/**
 * Extension messaging protocol type definitions.
 * Shared between background, content, inject, bridge and the Nuxt app.
 */

import type { CreatorPlatform } from '../shared/types/creator-platform'

export type { CreatorPlatform, DmRecipient } from '../shared/types/creator-platform'

// ─── Bridge action types ─────────────────────────────────────────────

export type BridgeAction =
  | 'ping'
  | 'search_creators'
  | 'crawl_comments'
  | 'send_dm'
  | 'get_creator_profile'
  | 'create_message_template'
  | 'check_outreach_status'
  | 'get_creator_list'
  | 'get_current_tags'
  | 'get_creator_tags'
  | 'create_creator_tag'
  | 'get_schedule_task_set'
  | 'run_auto_crawl_batch'
  | 'run_auto_send_batch'
  | 'analyze_page'

// ─── Bridge message types (between bridge.ts and content.ts) ─────────

export interface BridgeRequestMessage {
  type: 'CREATOR_WORKBENCH_BRIDGE_REQUEST'
  requestId: string
  action: BridgeAction
  payload?: Record<string, unknown>
}

export interface BridgeResponseMessage {
  type: 'CREATOR_WORKBENCH_BRIDGE_RESPONSE'
  requestId: string
  success: boolean
  data?: unknown
  error?: string
}

// ─── Inject → Content data messages ──────────────────────────────────

export interface InterceptedDataMessage {
  type:
    | 'DOUYIN_COMMENT_EXTENSION_DATA'
    | 'DOUYIN_SEARCH_ITEM_DATA'
    | 'DOUYIN_USER_PROFILE_DATA'
    | 'DOUYIN_AWEME_POST_DATA'
  payload: unknown
}

export interface CrawlProgressMessage {
  type: 'CRAWL_PROGRESS'
  progressType: string
  data: unknown
}

// ─── Content → Background runtime messages ───────────────────────────

export interface RuntimeDataMessage {
  type:
    | 'COMMENT_DATA'
    | 'SEARCH_ITEM_DATA'
    | 'USER_PROFILE_DATA'
    | 'AWEME_POST_DATA'
    | 'TIKTOK_DISCOVERY_DATA'
    // data carries a PageCandidate from extension/analyzers (kept as unknown
    // here to avoid a circular import between the two type modules)
    | 'PAGE_CANDIDATE'
  data: unknown
}

export interface RuntimeActionMessage {
  type: string
  params?: Record<string, unknown>
}

export type RuntimeMessage = RuntimeDataMessage | RuntimeActionMessage

// ─── Creator data model ──────────────────────────────────────────────

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

export interface PageAnalysisResult {
  url: string
  platform: CreatorPlatform
  is_creator_profile: boolean
  confidence: number
  reason: string
  creator: Creator | null
  inserted: boolean
  analyzed_at: string
}

export interface CommentRecord {
  cid: string
  sec_uid: string
  text: string
  aweme_id: string | null
  create_time: number | null
}

export interface CrawlStats {
  totalCollected: number
  totalDeduplicated: number
  totalNew: number
  isCrawling: boolean
}

/**
 * Cross-platform dedup key. Always includes the platform so the same
 * username on two platforms never collides.
 */
export function creatorDedupKey(platform: CreatorPlatform, uid: string): string {
  return `${platform}:${uid}`
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

// ─── Extension environment detection ────────────────────────────────

export function isExtensionEnvironment(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.runtime?.id
}
