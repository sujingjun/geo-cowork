import {
  createEmptyTikTokDiscoveryState,
  pruneExpiredTikTokComments
} from './discovery-store'
import type { TikTokDiscoveryState } from './discovery-store.types'
import { calculateCreatorEngagementRate } from './discovery-metrics'
import {
  applyTikTokCommentAnalysis,
  buildTikTokCommentAnalysisRequest
} from './tiktok-comment-analysis'
import { handleTikTokDiscoveryBatch } from './tiktok-discovery-service'
import type { TikTokDiscoveryBatch } from './tiktok-discovery.types'
import type { TikTokCommentAnalysisResponse } from '../shared/types/tiktok-comment-analysis'
import { deleteTikTokCreatorData } from './creator-delete'
import {
  TIKTOK_DISCOVERY_STATE_STORAGE_KEY,
  TIKTOK_DISCOVERY_SUMMARY_STORAGE_KEY,
  TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY,
  TIKTOK_POPUP_LAST_OPENED_AT_STORAGE_KEY,
  TIKTOK_POPUP_OPEN_COOLDOWN_MS
} from './tiktok-background-service.constants'
import type { TikTokBackgroundServiceDependencies } from './tiktok-background-service.types'
import { migrateTikTokTotalFavorited } from './tiktok-count'
import {
  deleteFromPageSnapshot,
  mergePageSnapshot,
  pageSnapshotStorageKey,
  projectPageSnapshot
} from './tiktok-page-snapshot'
import type { TikTokPageDiscoverySnapshot } from './tiktok-page-snapshot.types'

export function createTikTokBackgroundService(dependencies: TikTokBackgroundServiceDependencies) {
  const workerFetch = dependencies.fetch.bind(globalThis)
  let ingestQueue: Promise<void> = Promise.resolve()

  async function loadState(): Promise<TikTokDiscoveryState> {
    const stored = await dependencies.storage.get(TIKTOK_DISCOVERY_STATE_STORAGE_KEY)
    const value = stored[TIKTOK_DISCOVERY_STATE_STORAGE_KEY] as Partial<TikTokDiscoveryState> | undefined
    if (!value) return createEmptyTikTokDiscoveryState()
    const state: TikTokDiscoveryState = {
      creators: Array.isArray(value.creators) ? value.creators : [],
      videos: Array.isArray(value.videos) ? value.videos : [],
      comments: Array.isArray(value.comments) ? value.comments : [],
      sources: Array.isArray(value.sources) ? value.sources : [],
      insights: Array.isArray(value.insights) ? value.insights : []
    }
    const migratedCounts = migrateTikTokTotalFavorited(state.creators)
    if (migratedCounts || pruneExpiredTikTokComments(state, dependencies.now()) > 0) {
      await dependencies.storage.set({ [TIKTOK_DISCOVERY_STATE_STORAGE_KEY]: state })
    }
    return state
  }

  async function ingestBatch(batch: TikTokDiscoveryBatch) {
    const summary = await handleTikTokDiscoveryBatch(batch, {
      loadState,
      async saveState(state, summary, creatorChanges) {
        const snapshotStorageKey = pageSnapshotStorageKey(
          batch.context.page_url,
          batch.context.tab_id
        )
        const storedSnapshot = await dependencies.storage.get(snapshotStorageKey)
        const snapshot = mergePageSnapshot(
          storedSnapshot[snapshotStorageKey] as TikTokPageDiscoverySnapshot | undefined,
          state,
          batch,
          creatorChanges
        )
        const storedSnapshotKeys = await dependencies.storage.get(TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY)
        const snapshotKeys = Array.isArray(storedSnapshotKeys[TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY])
          ? storedSnapshotKeys[TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY] as string[]
          : []
        await dependencies.storage.set({
          [TIKTOK_DISCOVERY_STATE_STORAGE_KEY]: state,
          [TIKTOK_DISCOVERY_SUMMARY_STORAGE_KEY]: summary,
          [TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY]: Array.from(new Set([...snapshotKeys, snapshotStorageKey])),
          [snapshotStorageKey]: snapshot
        })
        dependencies.persistCreatorPool()
      },
      upsertCreator: dependencies.upsertCreator,
      async syncToServer(payload) {
        const apiBase = dependencies.getApiBase()
        if (!apiBase) return
        try {
          const response = await workerFetch(`${apiBase}/api/discovery/tiktok/upsert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          if (!response.ok) throw new Error(`discovery sync HTTP ${response.status}`)
          dependencies.markCreatorsSynced(payload.creators)
          dependencies.persistCreatorPool()
        } catch (error) {
          console.error('[CreatorWorkbench] TikTok discovery sync failed:', error)
        }
      }
    })
    if (summary.inserted > 0 || summary.updated > 0) {
      const now = dependencies.now()
      const openedState = await dependencies.storage.get(TIKTOK_POPUP_LAST_OPENED_AT_STORAGE_KEY)
      const previous = String(openedState[TIKTOK_POPUP_LAST_OPENED_AT_STORAGE_KEY] || '')
      const elapsed = Date.parse(now) - Date.parse(previous)
      if (!Number.isFinite(elapsed) || elapsed >= TIKTOK_POPUP_OPEN_COOLDOWN_MS) {
        await dependencies.storage.set({ [TIKTOK_POPUP_LAST_OPENED_AT_STORAGE_KEY]: now })
        await dependencies.openPopup(batch.context.page_url, batch.context.tab_id)
      }
    }
    return summary
  }

  function ingest(batch: TikTokDiscoveryBatch) {
    const result = ingestQueue.then(() => ingestBatch(batch))
    ingestQueue = result.then(() => undefined, () => undefined)
    return result
  }

  async function getSummary() {
    const stored = await dependencies.storage.get(TIKTOK_DISCOVERY_SUMMARY_STORAGE_KEY)
    return { summary: stored[TIKTOK_DISCOVERY_SUMMARY_STORAGE_KEY] || null }
  }

  async function getPageData(pageUrl: string, tabId?: number) {
    const snapshotStorageKey = pageSnapshotStorageKey(pageUrl, tabId)
    const stored = await dependencies.storage.get(snapshotStorageKey)
    const pageSnapshot = stored[snapshotStorageKey] as TikTokPageDiscoverySnapshot | undefined
    if (pageSnapshot
      && Array.isArray(pageSnapshot.creator_identities)
      && Array.isArray(pageSnapshot.inserted_creator_identities)
      && Array.isArray(pageSnapshot.updated_creator_identities)
      && Array.isArray(pageSnapshot.video_ids)
      && Array.isArray(pageSnapshot.comment_ids)
      && Array.isArray(pageSnapshot.pending_comment_ids)) {
      return projectPageSnapshot(pageSnapshot, await loadState(), pageUrl)
    }
    return { creatorIdentities: [], summary: null }
  }

  async function getCreatorInsights(creatorIdentity: string) {
    const state = await loadState()
    const creator = state.creators.find(item =>
      (item.stable_id && `tiktok:${item.stable_id}` === creatorIdentity)
      || (item.username && `tiktok:@${item.username.toLowerCase()}` === creatorIdentity)
    ) || null
    if (!creator) return { found: false, error: '未找到 TikTok 达人发现数据' }
    const videos = state.videos.filter(video =>
      (video.creator_stable_id && `tiktok:${video.creator_stable_id}` === creatorIdentity)
      || (video.creator_username && `tiktok:@${video.creator_username.toLowerCase()}` === creatorIdentity)
    )
    const videoIds = new Set(videos.map(video => video.video_id))
    const comments = state.comments.filter(comment => comment.video_id && videoIds.has(comment.video_id))
    const insight = state.insights.find(item => item.creator_identity === creatorIdentity) || null

    return {
      found: true,
      creator_identity: creatorIdentity,
      creator,
      videos,
      comments,
      overall_engagement_rate: calculateCreatorEngagementRate(videos),
      comment_insight: insight,
      pending_comments: comments.filter(comment => comment.analysis_status === 'pending').length
    }
  }

  async function analyzeComments(creatorIdentity: string) {
    const apiBase = dependencies.getApiBase()
    if (!apiBase) return { success: false, error: '未配置服务端地址，无法分析评论' }
    const state = await loadState()
    const request = buildTikTokCommentAnalysisRequest(state, creatorIdentity, dependencies.now())
    if (request.comments.length === 0) return { success: false, error: '该达人没有待分析评论' }

    const response = await workerFetch(`${apiBase}/api/discovery/tiktok/analyze-comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
    if (!response.ok) throw new Error(`comment analysis HTTP ${response.status}`)
    const analysis = await response.json() as TikTokCommentAnalysisResponse
    applyTikTokCommentAnalysis(state, analysis)
    await dependencies.storage.set({ [TIKTOK_DISCOVERY_STATE_STORAGE_KEY]: state })
    return { success: true, analysis }
  }

  async function deleteCreator(creatorIdentity: string) {
    const state = await loadState()
    const deletedVideoIds = new Set(state.videos
      .filter(video =>
        (video.creator_stable_id && `tiktok:${video.creator_stable_id}` === creatorIdentity)
        || (video.creator_username && `tiktok:@${video.creator_username.toLowerCase()}` === creatorIdentity)
      )
      .map(video => video.video_id))
    const deletedCommentIds = new Set(state.comments
      .filter(comment => comment.video_id && deletedVideoIds.has(comment.video_id))
      .map(comment => comment.comment_id))
    const storedSnapshotKeys = await dependencies.storage.get(TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY)
    const snapshotKeys = Array.isArray(storedSnapshotKeys[TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY])
      ? storedSnapshotKeys[TIKTOK_PAGE_SNAPSHOT_KEYS_STORAGE_KEY] as string[]
      : []
    const snapshotUpdates: Record<string, TikTokPageDiscoverySnapshot> = {}
    for (const snapshotKey of snapshotKeys) {
      const storedSnapshot = await dependencies.storage.get(snapshotKey)
      const snapshot = storedSnapshot[snapshotKey] as TikTokPageDiscoverySnapshot | undefined
      if (snapshot && Array.isArray(snapshot.creator_identities)) {
        snapshotUpdates[snapshotKey] = deleteFromPageSnapshot(
          snapshot,
          state,
          creatorIdentity,
          deletedVideoIds,
          deletedCommentIds
        )
      }
    }
    const deleted = deleteTikTokCreatorData(state, creatorIdentity)
    await dependencies.storage.set({
      [TIKTOK_DISCOVERY_STATE_STORAGE_KEY]: state,
      ...snapshotUpdates
    })

    const apiBase = dependencies.getApiBase()
    if (apiBase) {
      try {
        const response = await workerFetch(
          `${apiBase}/api/discovery/tiktok/${encodeURIComponent(creatorIdentity)}`,
          { method: 'DELETE' }
        )
        if (!response.ok) throw new Error(`creator delete HTTP ${response.status}`)
      } catch (error) {
        console.error('[CreatorWorkbench] TikTok creator delete sync failed:', error)
      }
    }
    return deleted
  }

  return { ingest, getSummary, getPageData, getCreatorInsights, analyzeComments, deleteCreator }
}
