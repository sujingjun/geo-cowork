/**
 * Platform page-analyzer adapter types.
 *
 * A PlatformAdapter knows how to recognize a creator profile page on one
 * social platform and extract a compact candidate summary from the DOM.
 * The candidate (NOT the full HTML) is sent to the server-side LLM for
 * final judgment and field normalization.
 */

import type { CreatorPlatform } from '../types'

/** Platforms the framework can describe, including not-yet-implemented ones. */
export type AnalyzablePlatform = CreatorPlatform | 'instagram' | 'facebook'

/** One heuristic observation that contributed to the candidate. */
export interface PageSignal {
  type: 'url' | 'embedded_json' | 'meta_tag' | 'dom_selector' | 'title'
  name: string
  value?: unknown
  confidence: number
}

/** Normalized creator profile fields an adapter tries to extract. */
export interface CreatorProfileFields {
  /** TikTok @username, Douyin sec_uid, etc. */
  platform_uid: string
  nickname: string
  avatar_url: string
  signature: string
  follower_count: number
  following_count: number
  /** Video/works count (maps to Creator.aweme_count). */
  video_count: number
  total_favorited: number
  region: string
}

/** The compact payload sent from the content script to the background/LLM. */
export interface PageCandidate {
  platform: AnalyzablePlatform
  url: string
  isProfilePage: boolean
  /** Heuristic confidence 0-1 that this page is a creator profile. */
  confidence: number
  extractedFields: Partial<CreatorProfileFields>
  signals: PageSignal[]
  /** Compact human/LLM-readable summary of what was found. */
  rawSummary: string
}

export interface PlatformAdapter {
  readonly platform: AnalyzablePlatform
  /** Cheap synchronous URL check — is this page handled by this adapter? */
  match(url: URL): boolean
  /**
   * Extract a candidate from the current document. Returns null when the
   * URL matched but the page clearly is not a creator profile.
   */
  extract(doc: Document, url: URL): PageCandidate | null
  /**
   * Wait for the page's profile data to appear (SPA rendering).
   * Resolves true when data is present, false on timeout.
   */
  waitForData?(doc: Document, url: URL, timeoutMs?: number): Promise<boolean>
}

/**
 * Parse compact count strings like "1.2M", "3.4K", "12,345" into numbers.
 * Shared by all platform adapters.
 */
export function parseCompactCount(raw: string | null | undefined): number | null {
  if (!raw) return null
  const cleaned = String(raw).trim().replace(/[,，\s]/g, '')
  const match = cleaned.match(/^([\d.]+)\s*([KkMmBb万]?)$/)
  if (!match) return null
  const base = Number.parseFloat(match[1]!)
  if (Number.isNaN(base)) return null
  const suffix = (match[2] || '').toLowerCase()
  let multiplier = 1
  if (suffix === 'k') multiplier = 1e3
  else if (suffix === 'm') multiplier = 1e6
  else if (suffix === 'b') multiplier = 1e9
  else if (suffix === '万') multiplier = 1e4
  return Math.round(base * multiplier)
}
