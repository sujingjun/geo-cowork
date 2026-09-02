import type { TikTokDiscoveryState } from './discovery-store.types'
import type {
  TikTokCommentAnalysisRequest,
  TikTokCommentAnalysisResponse
} from '../shared/types/tiktok-comment-analysis'
import { MAX_TIKTOK_COMMENTS_PER_ANALYSIS_REQUEST } from './tiktok-comment-analysis.constants'

function videoCreatorIdentity(
  video: TikTokDiscoveryState['videos'][number]
): string | null {
  if (video.creator_stable_id) return `tiktok:${video.creator_stable_id}`
  if (video.creator_username) return `tiktok:@${video.creator_username.toLowerCase()}`
  return null
}

export function buildTikTokCommentAnalysisRequest(
  state: TikTokDiscoveryState,
  creatorIdentity: string,
  now: string
): TikTokCommentAnalysisRequest {
  const videoIds = new Set(
    state.videos
      .filter(video => videoCreatorIdentity(video) === creatorIdentity)
      .map(video => video.video_id)
  )
  const comments = state.comments
    .filter(comment =>
      comment.analysis_status === 'pending'
      && !!comment.video_id
      && videoIds.has(comment.video_id)
      && comment.expires_at > now
    )
    .slice(0, MAX_TIKTOK_COMMENTS_PER_ANALYSIS_REQUEST)
    .map(comment => ({
      comment_id: comment.comment_id,
      video_id: comment.video_id,
      text: comment.text
    }))

  return {
    creator_identity: creatorIdentity,
    comments
  }
}

export function applyTikTokCommentAnalysis(
  state: TikTokDiscoveryState,
  response: TikTokCommentAnalysisResponse
): void {
  const results = new Map(response.items.map(item => [item.comment_id, item]))
  for (const comment of state.comments) {
    const result = results.get(comment.comment_id)
    if (!result) continue
    comment.analysis_status = 'analyzed'
    comment.sentiment = result.sentiment
    comment.sentiment_confidence = result.confidence
    comment.keywords = result.keywords
  }

  const insight = {
    creator_identity: response.creator_identity,
    summary: response.summary,
    analyzed_at: response.analyzed_at
  }
  const existingIndex = state.insights.findIndex(item =>
    item.creator_identity === response.creator_identity
  )
  if (existingIndex >= 0) state.insights[existingIndex] = insight
  else state.insights.push(insight)
}
