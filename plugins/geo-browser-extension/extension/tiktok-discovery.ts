import type {
  TikTokCommentObservation,
  TikTokCreatorObservation,
  TikTokDiscoveryBatch,
  TikTokDiscoveryContextInput,
  TikTokVideoObservation
} from './tiktok-discovery.types'
import { parseCompactCount } from './analyzers/types'
import { normalizeTikTokTotalFavorited } from './tiktok-count'

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function count(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return parseCompactCount(typeof value === 'string' ? value : null)
}

function totalFavoritedCount(value: unknown): number | null {
  const parsed = count(value)
  return parsed == null ? null : normalizeTikTokTotalFavorited(parsed)
}

function username(value: unknown): string | null {
  return text(value)?.replace(/^@/, '') || null
}

function creatorFromAuthor(authorValue: unknown, statsValue: unknown): TikTokCreatorObservation | null {
  const author = asRecord(authorValue)
  if (!author) return null
  const stats = asRecord(statsValue) || {}
  const creatorUsername = username(author.uniqueId ?? author.unique_id)
  const stableId = text(author.id ?? author.uid ?? author.secUid ?? author.sec_uid)
  if (!creatorUsername && !stableId) return null

  return {
    platform: 'tiktok',
    stable_id: stableId,
    username: creatorUsername,
    nickname: text(author.nickname ?? author.display_name),
    avatar_url: text(author.avatarLarger ?? author.avatarMedium ?? author.avatarThumb ?? author.avatar_url),
    signature: text(author.signature ?? author.bio_description),
    country: text(author.region ?? author.region_code ?? author.country),
    language: text(author.language),
    gender: null,
    skin_tone: null,
    age_range: null,
    follower_count: count(stats.followerCount ?? stats.follower_count ?? author.followerCount ?? author.follower_count),
    following_count: count(stats.followingCount ?? stats.following_count ?? author.followingCount ?? author.following_count),
    video_count: count(stats.videoCount ?? stats.video_count ?? author.videoCount ?? author.video_count),
    total_favorited: totalFavoritedCount(stats.heartCount ?? stats.likes_count ?? author.heartCount ?? author.likes_count)
  }
}

function videoFromItem(itemValue: unknown): {
  creator: TikTokCreatorObservation | null
  video: TikTokVideoObservation | null
} {
  const item = asRecord(itemValue)
  if (!item) return { creator: null, video: null }
  const author = asRecord(item.author)
  const creator = creatorFromAuthor(author, item.authorStats ?? item.authorStatsV2 ?? author?.stats ?? author?.statsV2)
  const videoId = text(item.id ?? item.aweme_id)
  if (!videoId) return { creator, video: null }
  const stats = asRecord(item.stats ?? item.statsV2 ?? item.statistics) || {}
  const creatorUsername = creator?.username || username(author?.uniqueId ?? author?.unique_id)

  return {
    creator,
    video: {
      platform: 'tiktok',
      video_id: videoId,
      creator_stable_id: creator?.stable_id || null,
      creator_username: creatorUsername,
      url: text(item.share_url ?? item.shareUrl)
        || (creatorUsername ? `https://www.tiktok.com/@${creatorUsername}/video/${videoId}` : null),
      description: text(item.desc ?? item.video_description ?? item.title),
      like_count: count(stats.diggCount ?? stats.digg_count ?? stats.like_count),
      play_count: count(stats.playCount ?? stats.play_count ?? stats.view_count),
      favorite_count: count(stats.collectCount ?? stats.collect_count ?? stats.favorites_count),
      comment_count: count(stats.commentCount ?? stats.comment_count),
      share_count: count(stats.shareCount ?? stats.share_count)
    }
  }
}

function commentFromItem(commentValue: unknown): TikTokCommentObservation | null {
  const comment = asRecord(commentValue)
  if (!comment) return null
  const commentId = text(comment.cid ?? comment.id)
  const commentText = text(comment.text)
  if (!commentId || !commentText) return null
  const author = asRecord(comment.user ?? comment.author) || {}

  return {
    platform: 'tiktok',
    comment_id: commentId,
    video_id: text(comment.aweme_id ?? comment.video_id),
    author_id: text(author.id ?? author.uid ?? author.secUid ?? author.sec_uid),
    author_username: username(author.uniqueId ?? author.unique_id ?? author.username),
    author_nickname: text(author.nickname ?? author.display_name),
    text: commentText,
    like_count: count(comment.digg_count ?? comment.like_count),
    analysis_status: 'pending'
  }
}

function creatorKey(creator: TikTokCreatorObservation): string | null {
  if (creator.stable_id) return `stable:${creator.stable_id}`
  if (creator.username) return `username:${creator.username.toLowerCase()}`
  return null
}

function mergeMissingFields<T extends Record<string, unknown>>(target: T, incoming: T): void {
  for (const [key, value] of Object.entries(incoming)) {
    if ((target[key] == null || target[key] === '') && value != null && value !== '') {
      target[key] = value as T[keyof T]
    }
  }
}

function createBatchCollector(context: TikTokDiscoveryContextInput) {
  const creators: TikTokCreatorObservation[] = []
  const videos: TikTokVideoObservation[] = []
  const comments: TikTokCommentObservation[] = []

  function addCreator(creator: TikTokCreatorObservation | null): void {
    if (!creator) return
    const existing = creators.find(item =>
      (creator.stable_id && item.stable_id === creator.stable_id)
      || (creator.username && item.username?.toLowerCase() === creator.username.toLowerCase())
    )
    if (existing) {
      mergeMissingFields(
        existing as unknown as Record<string, unknown>,
        creator as unknown as Record<string, unknown>
      )
      return
    }
    if (creatorKey(creator)) creators.push(creator)
  }

  function addVideo(video: TikTokVideoObservation | null): void {
    if (!video) return
    const existing = videos.find(item => item.video_id === video.video_id)
    if (existing) {
      mergeMissingFields(
        existing as unknown as Record<string, unknown>,
        video as unknown as Record<string, unknown>
      )
      return
    }
    videos.push(video)
  }

  function addComment(comment: TikTokCommentObservation | null): void {
    if (!comment || comments.some(item => item.comment_id === comment.comment_id)) return
    comments.push(comment)
  }

  function batch(): TikTokDiscoveryBatch {
    return {
      creators,
      videos,
      comments,
      context: {
        page_url: context.pageUrl,
        source: context.source,
        observed_at: context.observedAt
      }
    }
  }

  return { addCreator, addVideo, addComment, batch }
}

export function extractTikTokDiscoveryFromPayload(
  payload: unknown,
  context: TikTokDiscoveryContextInput
): TikTokDiscoveryBatch {
  const collector = createBatchCollector(context)
  const visited = new WeakSet<object>()

  function visit(value: unknown, parentKey = '', insideComment = false): void {
    if (Array.isArray(value)) {
      for (const item of value) visit(item, parentKey, insideComment)
      return
    }

    const record = asRecord(value)
    if (!record || visited.has(record)) return
    visited.add(record)

    if (!insideComment && record.user && (record.stats || record.statsV2)) {
      collector.addCreator(creatorFromAuthor(record.user, record.stats ?? record.statsV2))
    }

    const normalizedParentKey = parentKey.toLowerCase()
    const isStandaloneUser = !insideComment
      && normalizedParentKey.includes('user')
      && !!(record.uniqueId ?? record.unique_id)
      && !!(record.nickname ?? record.display_name ?? record.followerCount ?? record.follower_count)
    if (isStandaloneUser) {
      collector.addCreator(creatorFromAuthor(record, record.stats))
    }

    const isVideo = !!record.author
      && !!text(record.id ?? record.aweme_id)
      && (!!record.stats || !!record.statsV2 || !!record.statistics || !!record.desc || !!record.video_description)
    if (isVideo) {
      const result = videoFromItem(record)
      collector.addCreator(result.creator)
      collector.addVideo(result.video)
    }

    const isComment = insideComment || normalizedParentKey.includes('comment') || !!record.cid
    if (isComment) collector.addComment(commentFromItem(record))

    for (const [key, child] of Object.entries(record)) visit(child, key, isComment)
  }

  visit(payload)
  return collector.batch()
}

export function extractTikTokDiscoveryFromDocument(
  doc: Document,
  url: URL,
  observedAt: string
): TikTokDiscoveryBatch {
  const context: TikTokDiscoveryContextInput = {
    pageUrl: url.href,
    source: 'embedded',
    observedAt
  }
  const collector = createBatchCollector(context)

  for (const id of ['__UNIVERSAL_DATA_FOR_REHYDRATION__', 'SIGI_STATE']) {
    const raw = doc.getElementById(id)?.textContent
    if (!raw) continue
    try {
      const batch = extractTikTokDiscoveryFromPayload(JSON.parse(raw), context)
      for (const creator of batch.creators) collector.addCreator(creator)
      for (const video of batch.videos) collector.addVideo(video)
      for (const comment of batch.comments) collector.addComment(comment)
    } catch {
      // Ignore malformed page-owned data and continue with other sources.
    }
  }

  return collector.batch()
}

export function extractTikTokDiscoveryFromDom(
  doc: Document,
  url: URL,
  observedAt: string
): TikTokDiscoveryBatch {
  const context: TikTokDiscoveryContextInput = {
    pageUrl: url.href,
    source: 'dom',
    observedAt
  }
  const collector = createBatchCollector(context)
  const links = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href*="/@"]'))

  for (const link of links) {
    let parsed: URL
    try {
      parsed = new URL(link.href, url.origin)
    } catch {
      continue
    }
    if (!/(^|\.)tiktok\.com$/.test(parsed.hostname)) continue
    const match = parsed.pathname.match(/^\/@([^/]+)(?:\/video\/([^/]+))?\/?$/)
    if (!match?.[1]) continue
    const creatorUsername = decodeURIComponent(match[1]).replace(/^@/, '')
    if (!creatorUsername) continue

    collector.addCreator({
      platform: 'tiktok',
      stable_id: null,
      username: creatorUsername,
      nickname: null,
      avatar_url: null,
      signature: null,
      country: null,
      language: null,
      gender: null,
      skin_tone: null,
      age_range: null,
      follower_count: null,
      following_count: null,
      video_count: null,
      total_favorited: null
    })

    const videoId = match[2] ? decodeURIComponent(match[2]) : null
    if (!videoId) continue
    collector.addVideo({
      platform: 'tiktok',
      video_id: videoId,
      creator_stable_id: null,
      creator_username: creatorUsername,
      url: `${parsed.origin}/@${creatorUsername}/video/${videoId}`,
      description: null,
      like_count: null,
      play_count: null,
      favorite_count: null,
      comment_count: null,
      share_count: null
    })
  }

  return collector.batch()
}
