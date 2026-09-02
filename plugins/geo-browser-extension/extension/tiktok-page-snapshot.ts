import { normalizeDiscoveryPageUrl } from './discovery-store'
import type {
  TikTokDiscoveryCreatorChange,
  TikTokDiscoveryState,
  TikTokDiscoverySummary
} from './discovery-store.types'
import { TIKTOK_PAGE_SNAPSHOT_STORAGE_KEY_PREFIX } from './tiktok-background-service.constants'
import type { TikTokDiscoveryBatch } from './tiktok-discovery.types'
import type { TikTokPageDiscoverySnapshot } from './tiktok-page-snapshot.types'

export function pageSnapshotStorageKey(pageUrl: string, tabId?: number): string {
  const pageKey = normalizeDiscoveryPageUrl(pageUrl)
  const scopeKey = Number.isInteger(tabId) ? `tab:${tabId}` : 'url'
  return `${TIKTOK_PAGE_SNAPSHOT_STORAGE_KEY_PREFIX}:${scopeKey}:${pageKey}`
}

function canonicalSnapshotIdentity(state: TikTokDiscoveryState, identity: string): string {
  const username = identity.startsWith('tiktok:@')
    ? identity.slice('tiktok:@'.length).toLowerCase()
    : null
  const stableId = !username && identity.startsWith('tiktok:')
    ? identity.slice('tiktok:'.length)
    : null
  const creator = state.creators.find(item =>
    (username && item.username?.toLowerCase() === username)
    || (stableId && item.stable_id === stableId)
  )
  if (creator?.stable_id) return `tiktok:${creator.stable_id}`
  if (creator?.username) return `tiktok:@${creator.username.toLowerCase()}`
  return identity
}

function canonicalSnapshotIdentities(state: TikTokDiscoveryState, identities: string[]): string[] {
  return Array.from(new Set(identities.map(identity => canonicalSnapshotIdentity(state, identity))))
}

function pageOwnerUsername(pageUrl: string): string | null {
  try {
    const match = new URL(pageUrl).pathname.match(/^\/@([^/]+)(?:\/video\/[^/]+)?\/?$/)
    return match?.[1] ? decodeURIComponent(match[1]).toLowerCase() : null
  } catch {
    return null
  }
}

function snapshotIdentityUsername(state: TikTokDiscoveryState, identity: string): string | null {
  if (identity.startsWith('tiktok:@')) return identity.slice('tiktok:@'.length).toLowerCase()
  const stableId = identity.startsWith('tiktok:') ? identity.slice('tiktok:'.length) : null
  return state.creators.find(creator => stableId && creator.stable_id === stableId)?.username?.toLowerCase() || null
}

export function projectPageSnapshot(
  snapshot: TikTokPageDiscoverySnapshot,
  state: TikTokDiscoveryState,
  pageUrl: string
): { creatorIdentities: string[], summary: TikTokDiscoverySummary } {
  const ownerUsername = pageOwnerUsername(pageUrl)
  const canonicalCreatorIdentities = canonicalSnapshotIdentities(state, snapshot.creator_identities)
  const creatorIdentities = ownerUsername
    ? canonicalCreatorIdentities.filter(identity =>
        snapshotIdentityUsername(state, identity) === ownerUsername)
    : canonicalCreatorIdentities
  const projectedIdentities = new Set(creatorIdentities)
  const insertedIdentities = canonicalSnapshotIdentities(state, snapshot.inserted_creator_identities)
  const updatedIdentities = canonicalSnapshotIdentities(state, snapshot.updated_creator_identities)
  const videoIds = ownerUsername
    ? snapshot.video_ids.filter((videoId) => {
        const video = state.videos.find(item => item.video_id === videoId)
        const identity = video?.creator_stable_id
          ? `tiktok:${video.creator_stable_id}`
          : video?.creator_username ? `tiktok:@${video.creator_username.toLowerCase()}` : ''
        return snapshotIdentityUsername(state, identity) === ownerUsername
      })
    : snapshot.video_ids
  const projectedVideoIds = new Set(videoIds)
  const commentIds = ownerUsername
    ? snapshot.comment_ids.filter((commentId) => {
        const comment = state.comments.find(item => item.comment_id === commentId)
        return !!comment?.video_id && projectedVideoIds.has(comment.video_id)
      })
    : snapshot.comment_ids
  const projectedCommentIds = new Set(commentIds)
  return {
    creatorIdentities,
    summary: {
      discovered: creatorIdentities.length,
      inserted: insertedIdentities.filter(identity => projectedIdentities.has(identity)).length,
      updated: updatedIdentities.filter(identity => projectedIdentities.has(identity)).length,
      videos: videoIds.length,
      comments: commentIds.length,
      pending_comments: snapshot.pending_comment_ids.filter(commentId => projectedCommentIds.has(commentId)).length
    }
  }
}

export function mergePageSnapshot(
  current: TikTokPageDiscoverySnapshot | undefined,
  state: TikTokDiscoveryState,
  batch: TikTokDiscoveryBatch,
  creatorChanges: TikTokDiscoveryCreatorChange[]
): TikTokPageDiscoverySnapshot {
  const pageInstanceId = batch.context.page_instance_id || `batch:${batch.context.observed_at}`
  const sameInstance = current?.page_instance_id === pageInstanceId
  const canonical = (identities: string[] | undefined) =>
    (identities || []).map(identity => canonicalSnapshotIdentity(state, identity))
  const creatorIdentities = new Set(sameInstance ? canonical(current.creator_identities) : [])
  const insertedIdentities = new Set(sameInstance ? canonical(current.inserted_creator_identities) : [])
  const updatedIdentities = new Set(sameInstance ? canonical(current.updated_creator_identities) : [])
  const videoIds = new Set(sameInstance ? current.video_ids : [])
  const commentIds = new Set(sameInstance ? current.comment_ids : [])

  for (const change of creatorChanges) {
    const identity = canonicalSnapshotIdentity(state, change.identity)
    creatorIdentities.add(identity)
    if (change.status === 'inserted') insertedIdentities.add(identity)
    if (change.status === 'updated') updatedIdentities.add(identity)
  }
  for (const video of batch.videos) videoIds.add(video.video_id)
  for (const comment of batch.comments) commentIds.add(comment.comment_id)
  const pendingCommentIds = state.comments
    .filter(comment => commentIds.has(comment.comment_id) && comment.analysis_status === 'pending')
    .map(comment => comment.comment_id)

  return {
    page_url: batch.context.page_url,
    page_instance_id: pageInstanceId,
    creator_identities: Array.from(creatorIdentities),
    inserted_creator_identities: Array.from(insertedIdentities),
    updated_creator_identities: Array.from(updatedIdentities),
    video_ids: Array.from(videoIds),
    comment_ids: Array.from(commentIds),
    pending_comment_ids: pendingCommentIds,
    discovered: creatorIdentities.size,
    inserted: insertedIdentities.size,
    updated: updatedIdentities.size,
    videos: videoIds.size,
    comments: commentIds.size,
    pending_comments: pendingCommentIds.length
  }
}

export function deleteFromPageSnapshot(
  snapshot: TikTokPageDiscoverySnapshot,
  state: TikTokDiscoveryState,
  creatorIdentity: string,
  deletedVideoIds: Set<string>,
  deletedCommentIds: Set<string>
): TikTokPageDiscoverySnapshot {
  const creatorIdentities = canonicalSnapshotIdentities(state, snapshot.creator_identities)
  const insertedIdentities = canonicalSnapshotIdentities(state, snapshot.inserted_creator_identities)
  const updatedIdentities = canonicalSnapshotIdentities(state, snapshot.updated_creator_identities)
  const next = {
    ...snapshot,
    creator_identities: creatorIdentities.filter(identity => identity !== creatorIdentity),
    inserted_creator_identities: insertedIdentities.filter(identity => identity !== creatorIdentity),
    updated_creator_identities: updatedIdentities.filter(identity => identity !== creatorIdentity),
    video_ids: snapshot.video_ids.filter(videoId => !deletedVideoIds.has(videoId)),
    comment_ids: snapshot.comment_ids.filter(commentId => !deletedCommentIds.has(commentId)),
    pending_comment_ids: snapshot.pending_comment_ids.filter(commentId => !deletedCommentIds.has(commentId))
  }
  return {
    ...next,
    discovered: next.creator_identities.length,
    inserted: next.inserted_creator_identities.length,
    updated: next.updated_creator_identities.length,
    videos: next.video_ids.length,
    comments: next.comment_ids.length,
    pending_comments: next.pending_comment_ids.length
  }
}
