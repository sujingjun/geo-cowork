/**
 * Background Service Worker — core business orchestration engine.
 *
 * Responsibilities:
 *   - Receive intercepted data from content scripts
 *   - Extract creator info from Douyin API responses
 *   - Deduplicate (client-side sec_uid set)
 *   - Batch upload to server API
 *   - Handle bridge actions (ping, get_creator_list, search, send_dm, etc.)
 *   - DM sending flow with rate-limit detection
 *
 * State is persisted to chrome.storage.local so it survives service-worker
 * termination (SWs are reclaimed after ~30s of inactivity). In-memory mirrors
 * are hydrated from storage on startup and written through on every change.
 */

import { sendDmToCreator, sendDmBatch } from './dm-sender'
import { resolveExtensionApiBase } from './config'
import { createAgentRuntime } from './agent-runtime'
import { collectSearchCreatorsFromTab } from './search-page-collector'
import type { DmRecipient } from '../shared/types/creator-platform'
import { analyzePageInTab, handlePageCandidate } from './page-analysis-service'
import type { PageAnalysisDependencies } from './page-analysis-types'
import type { CommentRecord, Creator as CreatorRecord, CreatorPlatform, CrawlStats, PageAnalysisResult } from './types'
import { creatorDedupKey } from './types'
import type { PageCandidate } from './analyzers/types'
import type { TikTokDiscoveryBatch } from './tiktok-discovery.types'
import { markCreatorsSynced } from './creator-sync'
import { createTikTokBackgroundService } from './tiktok-background-service'
import { upsertTikTokCreatorInPool } from './tiktok-creator-pool'
import { removeCreatorFromPool } from './creator-delete'
import { openExtensionPopup } from './popup-opener'
import { migrateStoredTikTokCreatorPool } from './tiktok-creator-pool-migration'

// ─── Storage keys ────────────────────────────────────────────────────

const STORAGE_KEYS = {
  creators: 'cw_creators',
  comments: 'cw_comments',
  stats: 'cw_stats',
  profiles: 'cw_profiles',
  apiBase: 'api_base',
  lastAnalysis: 'cw_last_analysis'
} as const

// ─── In-memory mirrors (hydrated from chrome.storage.local) ─────────

let creatorPool: CreatorRecord[] = []
let commentStore: CommentRecord[] = []
let crawlStats: CrawlStats = { totalCollected: 0, totalDeduplicated: 0, totalNew: 0, isCrawling: false }
let profileCache = new Map<string, Record<string, unknown>>()
let API_BASE = resolveExtensionApiBase(undefined)
let lastAnalysis: PageAnalysisResult | null = null

// Dedup indexes rebuilt from the pools (Sets are not serializable).
// Keyed by `${platform}:${platform_uid || sec_uid}` so the same username
// on two platforms never collides.
const dedupKeySet = new Set<string>()
const commentCidSet = new Set<string>()

// Transient cache of the current search session (re-derivable, not persisted).
const searchItemState = {
  lastUpdatedAt: null as string | null,
  keyword: null as string | null,
  videoMap: new Map<string, any>()
}

const BATCH_SIZE = 200

const agentRuntime = createAgentRuntime({
  openTab: url => chrome.tabs.create({ url, active: true }),
  getCreators: () => creatorPool,
  getComments: () => commentStore,
  getProfile: secUid => profileCache.get(secUid)
})

// ─── Persistence helpers (write-through) ────────────────────────────

function persistCreators(): void {
  chrome.storage.local.set({ [STORAGE_KEYS.creators]: creatorPool })
    .catch(err => console.error('[CreatorWorkbench] persist creators failed:', err))
}

function persistComments(): void {
  chrome.storage.local.set({ [STORAGE_KEYS.comments]: commentStore })
    .catch(err => console.error('[CreatorWorkbench] persist comments failed:', err))
}

function persistStats(): void {
  chrome.storage.local.set({ [STORAGE_KEYS.stats]: crawlStats })
    .catch(err => console.error('[CreatorWorkbench] persist stats failed:', err))
}

function persistProfiles(): void {
  chrome.storage.local.set({ [STORAGE_KEYS.profiles]: Object.fromEntries(profileCache) })
    .catch(err => console.error('[CreatorWorkbench] persist profiles failed:', err))
}

function persistLastAnalysis(): void {
  chrome.storage.local.set({ [STORAGE_KEYS.lastAnalysis]: lastAnalysis })
    .catch(err => console.error('[CreatorWorkbench] persist lastAnalysis failed:', err))
}

/** Dedup key for a creator record (legacy records without platform count as douyin). */
function recordKey(c: Pick<CreatorRecord, 'platform' | 'platform_uid' | 'sec_uid' | 'stable_id'>): string {
  const identifier = c.stable_id || c.platform_uid || c.sec_uid || ''
  const normalizedIdentifier = c.platform === 'tiktok' ? identifier.toLowerCase() : identifier
  return creatorDedupKey(c.platform || 'douyin', normalizedIdentifier)
}

function normalizeRecipientId(platform: CreatorPlatform, value: unknown): string {
  const raw = String(value || '').trim().replace(/^@/, '')
  if (!raw) return ''
  return platform === 'tiktok' ? raw.toLowerCase() : raw
}

function rebuildIndexes(): void {
  dedupKeySet.clear()
  for (const creator of creatorPool) {
    dedupKeySet.add(recordKey(creator))
    if (creator.platform === 'tiktok' && creator.platform_uid) {
      dedupKeySet.add(creatorDedupKey('tiktok', creator.platform_uid))
    }
  }
  commentCidSet.clear()
  for (const c of commentStore) commentCidSet.add(c.cid)
}

/**
 * Hydrate in-memory state from chrome.storage.local. Resolved before any
 * message is handled (the message listener awaits `ready`).
 */
const ready: Promise<void> = (async () => {
  try {
    const stored = await chrome.storage.local.get([
      STORAGE_KEYS.creators,
      STORAGE_KEYS.comments,
      STORAGE_KEYS.stats,
      STORAGE_KEYS.profiles,
      STORAGE_KEYS.apiBase,
      STORAGE_KEYS.lastAnalysis
    ])
    creatorPool = Array.isArray(stored[STORAGE_KEYS.creators]) ? stored[STORAGE_KEYS.creators] as CreatorRecord[] : []
    // Normalize legacy records: they predate the platform fields.
    for (const c of creatorPool) {
      if (!c.platform) c.platform = 'douyin'
      if (c.platform_uid === undefined) c.platform_uid = null
    }
    await migrateStoredTikTokCreatorPool(
      creatorPool,
      creators => chrome.storage.local.set({ [STORAGE_KEYS.creators]: creators })
    )
    commentStore = Array.isArray(stored[STORAGE_KEYS.comments]) ? stored[STORAGE_KEYS.comments] as CommentRecord[] : []
    crawlStats = { totalCollected: 0, totalDeduplicated: 0, totalNew: 0, isCrawling: false, ...(stored[STORAGE_KEYS.stats] as Partial<CrawlStats> | undefined) }
    // isCrawling is a transient flag — never restore it as true after a restart.
    crawlStats.isCrawling = false
    profileCache = new Map(Object.entries((stored[STORAGE_KEYS.profiles] as Record<string, Record<string, unknown>> | undefined) || {}))
    API_BASE = resolveExtensionApiBase(stored[STORAGE_KEYS.apiBase])
    lastAnalysis = (stored[STORAGE_KEYS.lastAnalysis] as PageAnalysisResult | null | undefined) || null
    rebuildIndexes()
    console.log(`[CreatorWorkbench] Hydrated: ${creatorPool.length} creators, ${commentStore.length} comments`)
  } catch (err) {
    console.error('[CreatorWorkbench] Hydration failed:', err)
  }
})()

// ─── Utility functions ───────────────────────────────────────────────

function generateId(): string {
  return crypto.randomUUID()
}

function nowISO(): string {
  return new Date().toISOString()
}

function addCreatorToPool(
  uid: string,
  data: Partial<CreatorRecord> = {},
  source: CreatorRecord['source'] = 'manual',
  platform: CreatorPlatform = 'douyin'
): boolean {
  const key = creatorDedupKey(platform, uid)
  if (!uid || dedupKeySet.has(key)) return false
  dedupKeySet.add(key)
  creatorPool.push({
    id: generateId(),
    platform,
    // Douyin's uid is a sec_uid; other platforms use platform_uid.
    platform_uid: platform === 'douyin' ? (data.platform_uid || null) : (data.platform_uid || uid),
    stable_id: data.stable_id || null,
    sec_uid: platform === 'douyin' ? uid : null,
    nickname: data.nickname || null,
    avatar_url: data.avatar_url || null,
    signature: data.signature || null,
    follower_count: data.follower_count ?? null,
    following_count: data.following_count ?? null,
    aweme_count: data.aweme_count ?? null,
    total_favorited: data.total_favorited ?? null,
    unique_id: data.unique_id || null,
    short_id: data.short_id || null,
    region: data.region || null,
    country: data.country || null,
    language: data.language || null,
    gender: data.gender || null,
    skin_tone: data.skin_tone || null,
    age_range: data.age_range || null,
    source,
    sync_status: data.sync_status || 'pending',
    status: 'pending',
    created_at: nowISO(),
    updated_at: nowISO()
  })
  crawlStats.totalDeduplicated++
  return true
}

function resolveTikTokCreatorIdentity(params: Record<string, unknown>): string | null {
  const explicitIdentity = String(params.creatorIdentity || params.creator_identity || '').trim()
  if (explicitIdentity) return explicitIdentity
  const creatorId = String(params.creatorId || params.creator_id || '').trim()
  const creator = creatorPool.find(item => item.id === creatorId)
  if (!creator || creator.platform !== 'tiktok') return null
  if (creator.stable_id) return `tiktok:${creator.stable_id}`
  if (creator.platform_uid) return `tiktok:@${creator.platform_uid.toLowerCase()}`
  return null
}

function getTikTokPoolCreatorIdentity(creator: CreatorRecord): string | null {
  if (creator.platform !== 'tiktok') return null
  if (creator.stable_id) return `tiktok:${creator.stable_id}`
  if (creator.platform_uid) return `tiktok:@${creator.platform_uid.toLowerCase()}`
  return null
}

const tiktokBackgroundService = createTikTokBackgroundService({
  storage: {
    get: key => chrome.storage.local.get(key),
    set: items => chrome.storage.local.set(items)
  },
  getApiBase: () => API_BASE,
  fetch,
  now: nowISO,
  upsertCreator: (creator) => {
    upsertTikTokCreatorInPool(creatorPool, creator, {
      createId: generateId,
      now: nowISO
    })
    rebuildIndexes()
  },
  persistCreatorPool: persistCreators,
  markCreatorsSynced: (creators) => {
    const syncedCreators = creatorPool.filter(record =>
      record.platform === 'tiktok'
      && creators.some(creator =>
        (creator.stable_id && record.stable_id === creator.stable_id)
        || (creator.username && record.platform_uid?.toLowerCase() === creator.username.toLowerCase())
      )
    )
    markCreatorsSynced(syncedCreators)
  },
  openPopup: openExtensionPopup
})

function addCommentToStore(comment: CommentRecord): boolean {
  if (!comment.cid || commentCidSet.has(comment.cid)) return false
  commentCidSet.add(comment.cid)
  commentStore.push(comment)
  return true
}

async function batchUploadToServer(): Promise<{ inserted: number, ignored: number }> {
  if (!API_BASE) return { inserted: 0, ignored: 0 }
  const newCreators = creatorPool.filter(c => c.sync_status !== 'synced')
  if (newCreators.length === 0) return { inserted: 0, ignored: 0 }
  try {
    const response = await fetch(`${API_BASE}/api/creators/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creators: newCreators })
    })
    if (!response.ok) return { inserted: 0, ignored: newCreators.length }
    const result = await response.json()
    crawlStats.totalNew += result.inserted || 0
    markCreatorsSynced(newCreators)
    persistCreators()
    persistStats()
    return { inserted: result.inserted || 0, ignored: result.ignored || 0 }
  } catch (err) {
    console.error('[CreatorWorkbench] Batch upload error:', err)
    return { inserted: 0, ignored: 0 }
  }
}

// ─── Data processing handlers ────────────────────────────────────────

function processCommentData(payload: any): { count: number, addedCount: number } {
  const users = Array.isArray(payload?.users) ? payload.users : []
  const comments = Array.isArray(payload?.comments) ? payload.comments : []
  let addedCount = 0
  crawlStats.totalCollected += users.length
  for (const user of users) {
    if (user.sec_uid && addCreatorToPool(user.sec_uid, { nickname: user.nickname }, 'comment')) addedCount++
  }
  for (const comment of comments) {
    if (comment.cid && comment.sec_uid) {
      addCommentToStore({ cid: comment.cid, sec_uid: comment.sec_uid, text: comment.text || '', aweme_id: comment.aweme_id || null, create_time: comment.create_time || null })
    }
  }
  persistCreators()
  persistComments()
  persistStats()
  if (addedCount > 0 && creatorPool.length % BATCH_SIZE === 0) {
    batchUploadToServer().catch(err => console.error('[CreatorWorkbench] Batch upload error:', err))
  }
  return { count: creatorPool.length, addedCount }
}

function processSearchItemData(payload: any): { added: number, total: number } {
  const videos = Array.isArray(payload?.videos) ? payload.videos : []
  const meta = payload?.meta || {}
  searchItemState.lastUpdatedAt = nowISO()
  searchItemState.keyword = meta.keyword || null
  let added = 0
  crawlStats.totalCollected += videos.length
  for (const video of videos) {
    const author = video.author
    if (!author?.sec_uid) continue
    searchItemState.videoMap.set(video.aweme_id, video)
    if (addCreatorToPool(author.sec_uid, {
      nickname: author.nickname, avatar_url: author.avatar_url, signature: author.signature,
      follower_count: author.follower_count, unique_id: author.unique_id, short_id: author.short_id
    }, 'search')) added++
  }
  persistCreators()
  persistStats()
  if (added > 0 && creatorPool.length % BATCH_SIZE === 0) {
    batchUploadToServer().catch(err => console.error('[CreatorWorkbench] Batch upload error:', err))
  }
  return { added, total: creatorPool.length }
}

function processUserProfileData(payload: any): { received: boolean, updated: boolean } {
  const profile = payload?.profile
  if (!profile?.sec_uid) return { received: true, updated: false }
  profileCache.set(profile.sec_uid, profile)
  persistProfiles()
  const creator = creatorPool.find(c => c.sec_uid === profile.sec_uid)
  if (creator) {
    creator.nickname = profile.nickname || creator.nickname
    creator.signature = profile.signature || creator.signature
    creator.follower_count = profile.follower_count ?? creator.follower_count
    creator.following_count = profile.following_count ?? creator.following_count
    creator.aweme_count = profile.aweme_count ?? creator.aweme_count
    creator.total_favorited = profile.total_favorited ?? creator.total_favorited
    creator.region = profile.region || creator.region
    creator.unique_id = profile.unique_id || creator.unique_id
    creator.short_id = profile.short_id || creator.short_id
    creator.avatar_url = profile.avatar_url || creator.avatar_url
    creator.updated_at = nowISO()
    persistCreators()
    return { received: true, updated: true }
  }
  addCreatorToPool(profile.sec_uid, {
    nickname: profile.nickname, signature: profile.signature, follower_count: profile.follower_count,
    following_count: profile.following_count, aweme_count: profile.aweme_count, total_favorited: profile.total_favorited,
    region: profile.region, unique_id: profile.unique_id, short_id: profile.short_id, avatar_url: profile.avatar_url
  }, 'profile')
  persistCreators()
  return { received: true, updated: false }
}

function processAwemePostData(payload: any): { received: boolean, videoCount: number } {
  const videos = Array.isArray(payload?.videos) ? payload.videos : []
  return { received: true, videoCount: videos.length }
}

// ─── Page analysis flow (HTML-structure-based creator mining) ────────

const pageAnalysisDependencies: PageAnalysisDependencies = {
  getApiBase: () => API_BASE,
  addCreatorToPool,
  findCreator: (platform, uid) =>
    creatorPool.find(c => recordKey(c) === creatorDedupKey(platform, uid)) || null,
  persistCreators,
  persistStats,
  batchUploadToServer
}

async function analyzeAndPersist(candidate: PageCandidate): Promise<PageAnalysisResult> {
  const analysis = await handlePageCandidate(candidate, pageAnalysisDependencies)
  lastAnalysis = analysis
  persistLastAnalysis()
  return analysis
}

// ─── Message handler ─────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  (async () => {
    // Wait for state hydration before touching the pools.
    await ready

    const type = message?.type as string
    if (!type) {
      sendResponse({ status: 'no_type' })
      return
    }
    console.log(`[CreatorWorkbench] Background: received "${type}"`)

    switch (type) {
      case 'PING':
        sendResponse({ pong: true, version: '1.0.0', creators: creatorPool.length, comments: commentStore.length, stats: crawlStats })
        return

      case 'GET_CREATOR_LIST': {
        const params = message.params || {}
        const page = Number(params.page) || 1
        const pageSize = Number(params.pageSize) || 20
        let items = [...creatorPool]
        if (params.keyword) {
          const kw = String(params.keyword).toLowerCase()
          items = items.filter(c => (c.nickname?.toLowerCase().includes(kw)) || (c.unique_id?.toLowerCase().includes(kw)) || (c.sec_uid?.toLowerCase().includes(kw)) || (c.platform_uid?.toLowerCase().includes(kw)))
        }
        if (params.minFollowers != null) items = items.filter(c => c.follower_count != null && c.follower_count >= Number(params.minFollowers))
        if (params.maxFollowers != null) items = items.filter(c => c.follower_count != null && c.follower_count <= Number(params.maxFollowers))
        if (params.source) items = items.filter(c => c.source === params.source)
        if (params.status) items = items.filter(c => c.status === params.status)
        if (params.platform) items = items.filter(c => (c.platform || 'douyin') === params.platform)
        const total = items.length
        const start = (page - 1) * pageSize
        sendResponse({ items: items.slice(start, start + pageSize), total, page, pageSize })
        return
      }

      case 'GET_PAGE_CREATOR_LIST': {
        const pageUrl = String(message.params?.pageUrl || message.params?.page_url || '')
        const requestedTabId = Number(message.params?.tabId ?? message.params?.tab_id)
        const tabId = Number.isInteger(requestedTabId) && requestedTabId > 0
          ? requestedTabId
          : undefined
        let isTikTokPage = false
        try {
          isTikTokPage = /(^|\.)tiktok\.com$/.test(new URL(pageUrl).hostname)
        } catch {
          // Invalid or non-web page URLs have no page-scoped creator data.
        }
        if (!isTikTokPage) {
          sendResponse({ items: [], total: 0, pageUrl, summary: null })
          return
        }
        const pageData = await tiktokBackgroundService.getPageData(pageUrl, tabId)
        const identities = new Set(pageData.creatorIdentities)
        const items = creatorPool.filter((creator) => {
          const identity = getTikTokPoolCreatorIdentity(creator)
          return !!identity && identities.has(identity)
        })
        sendResponse({
          items,
          total: items.length,
          pageUrl,
          summary: pageData.summary
        })
        return
      }

      case 'GET_CREATOR_STATS':
        sendResponse({ ...crawlStats, poolSize: creatorPool.length, commentCount: commentStore.length, profileCacheSize: profileCache.size, searchKeyword: searchItemState.keyword })
        return

      case 'SEARCH_CREATORS':
        sendResponse(await agentRuntime.searchCreators(message.params || {}))
        return

      case 'CRAWL_COMMENTS':
        sendResponse(await agentRuntime.crawlComments(message.params || {}))
        return

      case 'SEND_DM': {
        const params = message.params || {}
        const platform = params.platform === 'tiktok' ? 'tiktok' : 'douyin'
        const recipientSource = platform === 'tiktok'
          ? (params.recipientId || params.platform_uid || params.secUid || params.sec_uid)
          : (params.recipientId || params.sec_uid || params.secUid || params.platform_uid)
        const recipientId = normalizeRecipientId(platform, recipientSource)
        const messageContent = String(params.message || params.content || '')
        if (!recipientId || !messageContent) {
          sendResponse({ success: false, error: '缺少平台收件人标识或 message 参数' })
          return
        }
        const recipient: DmRecipient = { platform, recipientId }
        const creator = creatorPool.find(c => recordKey(c) === creatorDedupKey(platform, recipientId))
        try {
          const result = await sendDmToCreator(recipient, messageContent, {
            openInBackground: params.openInBackground !== false,
            keepTabOpen: params.keepTabOpen === true,
            dryRun: params.dryRun === true
          })
          if (result.success && !result.prepared && creator) {
            creator.status = 'sent'
            creator.updated_at = nowISO()
            persistCreators()
          }
          sendResponse(result)
        } catch (err: any) {
          sendResponse({ success: false, error: err.message })
        }
        return
      }

      case 'SEND_DM_BATCH': {
        const batchParams = message.params || {}
        const creators = Array.isArray(batchParams.creators) ? batchParams.creators as DmRecipient[] : []
        const batchMessage = batchParams.message || ''
        if (creators.length === 0 || !batchMessage) {
          sendResponse({ success: false, error: '缺少 creators 或 message 参数' })
          return
        }
        crawlStats.isCrawling = true
        persistStats()
        try {
          const batchResult = await sendDmBatch(creators, batchMessage, {
            delayBetweenSends: batchParams.delayBetweenSends || 2000,
            openInBackground: batchParams.openInBackground !== false,
            keepTabOpen: batchParams.keepTabOpen === true,
            onProgress: (current, _total, result) => {
              const c = creators[current - 1]
              if (c) {
                const normalizedRecipientId = normalizeRecipientId(c.platform, c.recipientId)
                const pc = creatorPool.find(p => recordKey(p) === creatorDedupKey(c.platform, normalizedRecipientId))
                if (pc) {
                  pc.status = result.success ? 'sent' : 'pending'
                  pc.updated_at = nowISO()
                }
              }
              persistCreators()
            }
          })
          crawlStats.isCrawling = false
          persistStats()
          sendResponse({ success: true, ...batchResult })
        } catch (err: any) {
          crawlStats.isCrawling = false
          persistStats()
          sendResponse({ success: false, error: err.message })
        }
        return
      }

      case 'GET_CREATOR_PROFILE': {
        sendResponse(agentRuntime.getCreatorProfile({
          platform: message.params?.platform === 'tiktok' ? 'tiktok' : 'douyin',
          recipientId: String(
            message.params?.recipientId
            || message.params?.platform_uid
            || message.params?.secUid
            || message.params?.sec_uid
            || ''
          )
        }))
        return
      }

      case 'CHECK_OUTREACH_STATUS': {
        sendResponse(agentRuntime.checkOutreachStatus(message.params || {}))
        return
      }

      case 'DELETE_CREATOR': {
        const creatorId = String(message.params?.creatorId || message.params?.creator_id || '')
        const creator = removeCreatorFromPool(creatorPool, creatorId)
        if (!creator) {
          sendResponse({ success: false, error: '未找到要删除的达人' })
          return
        }

        let discovery = null
        if (creator.platform === 'tiktok') {
          const creatorIdentity = creator.stable_id
            ? `tiktok:${creator.stable_id}`
            : creator.platform_uid ? `tiktok:@${creator.platform_uid.toLowerCase()}` : null
          if (creatorIdentity) discovery = await tiktokBackgroundService.deleteCreator(creatorIdentity)
        } else if (creator.sec_uid) {
          profileCache.delete(creator.sec_uid)
          commentStore = commentStore.filter(comment => comment.sec_uid !== creator.sec_uid)
        }

        rebuildIndexes()
        persistCreators()
        persistComments()
        persistProfiles()
        sendResponse({ success: true, creatorId, discovery })
        return
      }

      case 'CLEAR_POOL':
        creatorPool = []
        commentStore = []
        dedupKeySet.clear()
        commentCidSet.clear()
        profileCache.clear()
        lastAnalysis = null
        crawlStats = { totalCollected: 0, totalDeduplicated: 0, totalNew: 0, isCrawling: false }
        persistCreators()
        persistComments()
        persistStats()
        persistProfiles()
        persistLastAnalysis()
        sendResponse({ cleared: true })
        return

      case 'UPLOAD_BATCH':
        sendResponse(await batchUploadToServer())
        return

      case 'COMMENT_DATA':
        sendResponse(processCommentData(message.data))
        return

      case 'SEARCH_ITEM_DATA':
        sendResponse(processSearchItemData(message.data))
        return

      case 'USER_PROFILE_DATA':
        sendResponse(processUserProfileData(message.data))
        return

      case 'AWEME_POST_DATA':
        sendResponse(processAwemePostData(message.data))
        return

      case 'TIKTOK_DISCOVERY_DATA': {
        const batch = message.data as TikTokDiscoveryBatch
        sendResponse(await tiktokBackgroundService.ingest({
          ...batch,
          context: {
            ...batch.context,
            ...(sender.tab?.id ? { tab_id: sender.tab.id } : {})
          }
        }))
        return
      }

      case 'GET_TIKTOK_DISCOVERY_SUMMARY':
        sendResponse(await tiktokBackgroundService.getSummary())
        return

      case 'GET_TIKTOK_CREATOR_INSIGHTS': {
        const creatorIdentity = resolveTikTokCreatorIdentity(message.params || {})
        sendResponse(creatorIdentity
          ? await tiktokBackgroundService.getCreatorInsights(creatorIdentity)
          : { found: false, error: '未找到 TikTok 达人身份' })
        return
      }

      case 'ANALYZE_TIKTOK_COMMENTS': {
        const creatorIdentity = resolveTikTokCreatorIdentity(message.params || {})
        sendResponse(creatorIdentity
          ? await tiktokBackgroundService.analyzeComments(creatorIdentity)
          : { success: false, error: '未找到 TikTok 达人身份' })
        return
      }

      case 'PAGE_CANDIDATE':
        sendResponse(await analyzeAndPersist(message.data as PageCandidate))
        return

      case 'ANALYZE_PAGE':
        sendResponse(await analyzePageInTab(Number(message.params?.tabId) || undefined, analyzeAndPersist))
        return

      case 'GET_LAST_ANALYSIS':
        sendResponse({ analysis: lastAnalysis })
        return

      default:
        sendResponse({ status: 'unknown_type', type })
    }
  })().catch((err) => {
    console.error('[CreatorWorkbench] Background handler error:', err)
    try {
      sendResponse({ success: false, error: err?.message || 'handler error' })
    } catch {
      /* channel may be closed */
    }
  })
  // Keep the message channel open for the async response.
  return true
})

// Current Douyin search pages do not always expose the legacy search/item API.
// Materialize visible public creator links after the search document loads.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url?.startsWith('https://www.douyin.com/search/')) return

  void (async () => {
    await ready
    const candidates = await collectSearchCreatorsFromTab(tabId)
    crawlStats.totalCollected += candidates.length
    let added = 0
    for (const candidate of candidates) {
      if (addCreatorToPool(candidate.sec_uid, { nickname: candidate.nickname }, 'search')) added++
    }
    if (candidates.length > 0) persistStats()
    if (added > 0) persistCreators()
    console.log(`[CreatorWorkbench] Search page fallback: candidates=${candidates.length}, added=${added}`)
  })().catch(error => console.error('[CreatorWorkbench] Search page fallback failed:', error))
})

// ─── Extension installation ──────────────────────────────────────────

chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  console.log('[CreatorWorkbench] Extension installed:', details.reason)
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html#/workbench') })
      .catch(err => console.error('[CreatorWorkbench] Failed to open workbench tab:', err))
  }
})

console.log('[CreatorWorkbench] Background service worker loaded')
