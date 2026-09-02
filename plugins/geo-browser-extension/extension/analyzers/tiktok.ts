/**
 * TikTok creator profile page adapter.
 *
 * Extraction strategy (most to least reliable):
 *   1. `#__UNIVERSAL_DATA_FOR_REHYDRATION__` — embedded JSON TikTok injects
 *      for hydration; contains the full user object + stats.
 *   2. `#SIGI_STATE` — older embedded JSON blob with UserModule data.
 *   3. Open Graph meta tags (og:title / og:description / og:image).
 *   4. DOM selectors (data-e2e attributes) — last resort.
 */

import type { PageCandidate, PageSignal, PlatformAdapter } from './types'
import { parseCompactCount } from './types'
import { normalizeTikTokTotalFavorited } from '../tiktok-count'

const PROFILE_PATH_RE = /^\/@[^/]+\/?$/

interface TikTokUserRaw {
  uniqueId?: string
  nickname?: string
  avatarLarger?: string
  avatarMedium?: string
  avatarThumb?: string
  signature?: string
  region?: string
}

interface TikTokStatsRaw {
  followerCount?: number
  followingCount?: number
  heartCount?: number
  heart?: number
  videoCount?: number
  diggCount?: number
}

function matchesUsername(user: TikTokUserRaw, username: string): boolean {
  return !user.uniqueId || user.uniqueId.toLowerCase() === username.toLowerCase()
}

function usernameFromUrl(url: URL): string | null {
  const match = url.pathname.match(/^\/@([^/]+)\/?$/)
  return match ? decodeURIComponent(match[1]!) : null
}

/** Pull { user, stats } from the hydration JSON, if present. */
function readHydrationData(doc: Document, username: string): { user: TikTokUserRaw, stats: TikTokStatsRaw } | null {
  const script = doc.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__')
  if (!script?.textContent) return null
  try {
    const data = JSON.parse(script.textContent)
    const scope = data?.['__DEFAULT_SCOPE__'] || {}
    // Current shape: webapp.user-detail.userInfo.{user,stats}
    const userInfo = scope['webapp.user-detail']?.userInfo
    if (userInfo?.user && matchesUsername(userInfo.user, username)) {
      return { user: userInfo.user, stats: userInfo.stats || {} }
    }
    // Legacy/alternate shape: webapp.user.{user,stats} keyed by username
    const userModule = scope['webapp.user']
    if (userModule?.users?.[username] && matchesUsername(userModule.users[username], username)) {
      return { user: userModule.users[username], stats: userModule.stats?.[username] || {} }
    }
    return null
  } catch {
    return null
  }
}

/** Pull { user, stats } from the older SIGI_STATE blob, if present. */
function readSigiState(doc: Document, username: string): { user: TikTokUserRaw, stats: TikTokStatsRaw } | null {
  const script = doc.getElementById('SIGI_STATE')
  if (!script?.textContent) return null
  try {
    const data = JSON.parse(script.textContent)
    const user = data?.UserModule?.users?.[username]
    if (!user || !matchesUsername(user, username)) return null
    return { user, stats: data?.UserModule?.stats?.[username] || {} }
  } catch {
    return null
  }
}

function readMeta(doc: Document, property: string): string | null {
  return doc.querySelector(`meta[property="${property}"]`)?.getAttribute('content')
    || doc.querySelector(`meta[name="${property}"]`)?.getAttribute('content')
    || null
}

function readE2E(doc: Document, name: string): string | null {
  return doc.querySelector(`[data-e2e="${name}"]`)?.textContent?.trim() || null
}

export const tiktokAdapter: PlatformAdapter = {
  platform: 'tiktok',

  match(url: URL): boolean {
    return /(^|\.)tiktok\.com$/.test(url.hostname) && PROFILE_PATH_RE.test(url.pathname)
  },

  async waitForData(doc: Document, url: URL, timeoutMs = 3000): Promise<boolean> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      if (doc.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__')?.textContent) return true
      if (doc.getElementById('SIGI_STATE')?.textContent) return true
      if (doc.querySelector('[data-e2e="followers-count"]')) return true
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    return false
  },

  extract(doc: Document, url: URL): PageCandidate | null {
    const username = usernameFromUrl(url)
    if (!username) return null

    const signals: PageSignal[] = [{
      type: 'url',
      name: 'profile_path',
      value: url.pathname,
      confidence: 0.4
    }]
    const fields: PageCandidate['extractedFields'] = { platform_uid: username }
    let confidence = 0.4

    // 1. Embedded JSON (most reliable)
    const embedded = readHydrationData(doc, username) || readSigiState(doc, username)
    if (embedded?.user) {
      const { user, stats } = embedded
      fields.platform_uid = user.uniqueId || username
      fields.nickname = user.nickname || undefined
      fields.avatar_url = user.avatarLarger || user.avatarMedium || user.avatarThumb || undefined
      fields.signature = user.signature || undefined
      fields.region = user.region || undefined
      fields.follower_count = stats.followerCount ?? undefined
      fields.following_count = stats.followingCount ?? undefined
      fields.video_count = stats.videoCount ?? undefined
      const totalFavorited = stats.heartCount ?? stats.heart ?? stats.diggCount
      fields.total_favorited = totalFavorited == null
        ? undefined
        : normalizeTikTokTotalFavorited(totalFavorited)
      signals.push({ type: 'embedded_json', name: 'user_object', value: { uniqueId: fields.platform_uid, nickname: fields.nickname }, confidence: 0.9 })
      confidence = 0.9
    }

    // 2. Open Graph meta tags
    const ogTitle = readMeta(doc, 'og:title')
    const ogDescription = readMeta(doc, 'og:description')
    const ogImage = readMeta(doc, 'og:image')
    if (ogTitle || ogDescription) {
      signals.push({ type: 'meta_tag', name: 'og', value: { title: ogTitle, description: ogDescription?.slice(0, 200) }, confidence: 0.7 })
      if (!fields.nickname && ogTitle) fields.nickname = ogTitle.replace(/\s*\(@.*$/, '').trim() || undefined
      if (!fields.avatar_url && ogImage) fields.avatar_url = ogImage
      if (fields.signature == null && ogDescription) fields.signature = ogDescription
      confidence = Math.max(confidence, 0.7)
    }

    // 3. DOM fallback (data-e2e attributes)
    const domNickname = readE2E(doc, 'user-title')
    const domBio = readE2E(doc, 'user-bio')
    const domFollowers = parseCompactCount(readE2E(doc, 'followers-count'))
    const domFollowing = parseCompactCount(readE2E(doc, 'following-count'))
    const domLikes = parseCompactCount(readE2E(doc, 'likes-count'))
    if (domNickname || domFollowers != null) {
      signals.push({ type: 'dom_selector', name: 'data-e2e', value: { nickname: domNickname, followers: domFollowers }, confidence: 0.6 })
      if (!fields.nickname && domNickname) fields.nickname = domNickname
      if (fields.follower_count == null && domFollowers != null) fields.follower_count = domFollowers
      if (fields.following_count == null && domFollowing != null) fields.following_count = domFollowing
      if (fields.total_favorited == null && domLikes != null) fields.total_favorited = domLikes
      if (fields.signature == null && domBio) fields.signature = domBio
      confidence = Math.max(confidence, 0.6)
    }

    // 4. <title> as a weak signal
    if (doc.title) {
      signals.push({ type: 'title', name: 'document.title', value: doc.title.slice(0, 120), confidence: 0.5 })
    }

    const isProfilePage = confidence >= 0.6 && (fields.nickname != null || fields.follower_count != null || embedded != null)

    const rawSummary = [
      `URL: ${url.href}`,
      `Path: ${url.pathname} (@${username})`,
      `Title: ${doc.title || '(none)'}`,
      ogTitle ? `og:title: ${ogTitle}` : null,
      ogDescription ? `og:description: ${ogDescription.slice(0, 300)}` : null,
      `Extracted: nickname=${fields.nickname ?? '?'}, followers=${fields.follower_count ?? '?'}, following=${fields.following_count ?? '?'}, likes=${fields.total_favorited ?? '?'}, videos=${fields.video_count ?? '?'}, bio=${(fields.signature || '').slice(0, 200) || '?'}`,
      `Sources: ${signals.map(s => s.name).join(', ')}`
    ].filter(Boolean).join('\n')

    return {
      platform: 'tiktok',
      url: url.href,
      isProfilePage,
      confidence,
      extractedFields: fields,
      signals,
      rawSummary
    }
  }
}
