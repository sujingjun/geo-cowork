import { calculateVideoEngagementRate } from './discovery-metrics'
import {
  DISCOVERY_SOURCE_PRIORITY,
  LOCAL_COMMENT_RETENTION_DAYS
} from './discovery-store.constants'
import type {
  DiscoveryFieldSource,
  StoredTikTokComment,
  StoredTikTokCreator,
  StoredTikTokVideo,
  TikTokDiscoveryCreatorChange,
  TikTokDiscoveryIngestResult,
  TikTokDiscoveryState
} from './discovery-store.types'
import type {
  TikTokCreatorObservation,
  TikTokDiscoveryBatch,
  TikTokVideoObservation
} from './tiktok-discovery.types'

export function createEmptyTikTokDiscoveryState(): TikTokDiscoveryState {
  return { creators: [], videos: [], comments: [], sources: [], insights: [] }
}

export function pruneExpiredTikTokComments(
  state: TikTokDiscoveryState,
  now: string
): number {
  const before = state.comments.length
  state.comments = state.comments.filter(comment => comment.expires_at > now)
  return before - state.comments.length
}

export function normalizeDiscoveryPageUrl(value: string): string {
  try {
    const url = new URL(value)
    url.hash = ''
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '')
    return url.href
  } catch {
    return value
  }
}

function creatorIdentity(creator: Pick<TikTokCreatorObservation, 'stable_id' | 'username'>): string | null {
  if (creator.stable_id) return `tiktok:${creator.stable_id}`
  if (creator.username) return `tiktok:@${creator.username.toLowerCase()}`
  return null
}

function resolvedCreatorIdentity(
  state: TikTokDiscoveryState,
  observed: TikTokCreatorObservation
): string | null {
  const normalizedUsername = observed.username?.toLowerCase() || null
  const stored = state.creators.find(creator =>
    (observed.stable_id && creator.stable_id === observed.stable_id)
    || (normalizedUsername && creator.username?.toLowerCase() === normalizedUsername)
  )
  return creatorIdentity(stored || observed)
}

function sourceCanReplace(current: DiscoveryFieldSource | undefined, incoming: DiscoveryFieldSource): boolean {
  if (!current) return true
  const currentPriority = DISCOVERY_SOURCE_PRIORITY[current.source]
  const incomingPriority = DISCOVERY_SOURCE_PRIORITY[incoming.source]
  return incomingPriority > currentPriority
    || (incomingPriority === currentPriority && incoming.observed_at >= current.observed_at)
}

function createFieldSources<T extends Record<string, unknown>>(
  value: T,
  source: DiscoveryFieldSource
): Partial<Record<keyof T, DiscoveryFieldSource>> {
  const result: Partial<Record<keyof T, DiscoveryFieldSource>> = {}
  for (const [key, fieldValue] of Object.entries(value)) {
    if (fieldValue != null && fieldValue !== '') result[key as keyof T] = source
  }
  return result
}

function mergeCreator(
  target: StoredTikTokCreator,
  incoming: TikTokCreatorObservation,
  source: DiscoveryFieldSource
): boolean {
  let changed = false
  for (const [rawKey, value] of Object.entries(incoming)) {
    const key = rawKey as keyof TikTokCreatorObservation
    if (key === 'platform' || value == null || value === '') continue
    const currentValue = target[key]
    if ((currentValue == null || currentValue === '') || sourceCanReplace(target.field_sources[key], source)) {
      if (currentValue !== value) changed = true
      ;(target as unknown as Record<string, unknown>)[key] = value
      target.field_sources[key] = source
    }
  }
  if (source.observed_at > target.last_seen_at) target.last_seen_at = source.observed_at
  return changed
}

function upsertCreator(
  state: TikTokDiscoveryState,
  incoming: TikTokCreatorObservation,
  source: DiscoveryFieldSource
): 'inserted' | 'updated' | 'unchanged' {
  const normalizedUsername = incoming.username?.toLowerCase() || null
  const existing = state.creators.find(creator =>
    (incoming.stable_id && creator.stable_id === incoming.stable_id)
    || (normalizedUsername && creator.username?.toLowerCase() === normalizedUsername)
  )
  if (existing) {
    const previousIdentity = creatorIdentity(existing)
    const changed = mergeCreator(existing, incoming, source)
    const currentIdentity = creatorIdentity(existing)
    if (previousIdentity && currentIdentity && previousIdentity !== currentIdentity) {
      for (const sourceRecord of state.sources) {
        if (sourceRecord.creator_identity === previousIdentity) {
          sourceRecord.creator_identity = currentIdentity
        }
      }
      for (const insight of state.insights) {
        if (insight.creator_identity === previousIdentity) {
          insight.creator_identity = currentIdentity
        }
      }
      for (const video of state.videos) {
        if (!video.creator_stable_id && incoming.stable_id
          && video.creator_username?.toLowerCase() === incoming.username?.toLowerCase()) {
          video.creator_stable_id = incoming.stable_id
        }
      }
    }
    return changed ? 'updated' : 'unchanged'
  }
  if (!creatorIdentity(incoming)) return 'unchanged'

  state.creators.push({
    ...incoming,
    first_seen_at: source.observed_at,
    last_seen_at: source.observed_at,
    field_sources: createFieldSources(
      incoming as unknown as Record<string, unknown>,
      source
    ) as StoredTikTokCreator['field_sources']
  })
  return 'inserted'
}

function mergeVideo(
  target: StoredTikTokVideo,
  incoming: TikTokVideoObservation,
  source: DiscoveryFieldSource
): void {
  for (const [rawKey, value] of Object.entries(incoming)) {
    const key = rawKey as keyof TikTokVideoObservation
    if (key === 'platform' || value == null || value === '') continue
    const currentValue = target[key]
    if ((currentValue == null || currentValue === '') || sourceCanReplace(target.field_sources[key], source)) {
      ;(target as unknown as Record<string, unknown>)[key] = value
      target.field_sources[key] = source
    }
  }
  target.engagement_rate = calculateVideoEngagementRate(target)
  if (source.observed_at > target.last_seen_at) target.last_seen_at = source.observed_at
}

function upsertVideo(state: TikTokDiscoveryState, incoming: TikTokVideoObservation, source: DiscoveryFieldSource): void {
  const existing = state.videos.find(video => video.video_id === incoming.video_id)
  if (existing) {
    mergeVideo(existing, incoming, source)
    return
  }
  state.videos.push({
    ...incoming,
    engagement_rate: calculateVideoEngagementRate(incoming),
    first_seen_at: source.observed_at,
    last_seen_at: source.observed_at,
    field_sources: createFieldSources(
      incoming as unknown as Record<string, unknown>,
      source
    ) as StoredTikTokVideo['field_sources']
  })
}

function commentExpiry(observedAt: string): string {
  const expiry = new Date(observedAt)
  expiry.setUTCDate(expiry.getUTCDate() + LOCAL_COMMENT_RETENTION_DAYS)
  return expiry.toISOString()
}

function upsertComment(state: TikTokDiscoveryState, incoming: TikTokDiscoveryBatch['comments'][number], observedAt: string): void {
  const existing = state.comments.find(comment => comment.comment_id === incoming.comment_id)
  if (existing) {
    const analysis = existing.analysis_status === 'analyzed'
      ? {
          analysis_status: existing.analysis_status,
          sentiment: existing.sentiment,
          sentiment_confidence: existing.sentiment_confidence,
          keywords: existing.keywords
        }
      : null
    Object.assign(existing, incoming)
    const nextExpiry = commentExpiry(observedAt)
    if (nextExpiry > existing.expires_at) existing.expires_at = nextExpiry
    if (analysis) Object.assign(existing, analysis)
    return
  }
  const stored: StoredTikTokComment = {
    ...incoming,
    discovered_at: observedAt,
    expires_at: commentExpiry(observedAt),
    sentiment: null,
    sentiment_confidence: null,
    keywords: []
  }
  state.comments.push(stored)
}

function addSource(
  state: TikTokDiscoveryState,
  creator: TikTokCreatorObservation,
  batch: TikTokDiscoveryBatch
): void {
  const identity = creatorIdentity(creator)
  if (!identity) return
  const sourceRecord = {
    platform: 'tiktok' as const,
    creator_identity: identity,
    page_url: batch.context.page_url,
    source: batch.context.source,
    observed_at: batch.context.observed_at
  }
  const exists = state.sources.some(item =>
    item.creator_identity === sourceRecord.creator_identity
    && item.page_url === sourceRecord.page_url
    && item.source === sourceRecord.source
    && item.observed_at === sourceRecord.observed_at
  )
  if (!exists) state.sources.push(sourceRecord)
}

export function ingestTikTokDiscoveryBatch(
  state: TikTokDiscoveryState,
  batch: TikTokDiscoveryBatch
): TikTokDiscoveryIngestResult {
  const source: DiscoveryFieldSource = {
    source: batch.context.source,
    observed_at: batch.context.observed_at
  }
  let inserted = 0
  let updated = 0
  const creatorChanges: TikTokDiscoveryCreatorChange[] = []

  for (const creator of batch.creators) {
    const result = upsertCreator(state, creator, source)
    if (result === 'inserted') inserted++
    if (result === 'updated') updated++
    addSource(state, creator, batch)
    const identity = resolvedCreatorIdentity(state, creator)
    if (identity) creatorChanges.push({ identity, status: result })
  }
  for (const video of batch.videos) upsertVideo(state, video, source)
  for (const comment of batch.comments) upsertComment(state, comment, batch.context.observed_at)
  const observedCommentIds = new Set(batch.comments.map(comment => comment.comment_id))

  return {
    state,
    creatorChanges,
    summary: {
      discovered: batch.creators.length,
      inserted,
      updated,
      videos: batch.videos.length,
      comments: batch.comments.length,
      pending_comments: state.comments.filter(comment =>
        observedCommentIds.has(comment.comment_id) && comment.analysis_status === 'pending'
      ).length
    }
  }
}
