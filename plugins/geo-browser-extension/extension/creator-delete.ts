import type { TikTokDiscoveryState } from './discovery-store.types'
import type { Creator } from './types'
import type { DeleteCreatorDataSummary } from './creator-delete.types'

export function removeCreatorFromPool(pool: Creator[], creatorId: string): Creator | null {
  const index = pool.findIndex(creator => creator.id === creatorId)
  if (index < 0) return null
  return pool.splice(index, 1)[0] || null
}

function videoCreatorIdentity(video: TikTokDiscoveryState['videos'][number]): string | null {
  if (video.creator_stable_id) return `tiktok:${video.creator_stable_id}`
  if (video.creator_username) return `tiktok:@${video.creator_username.toLowerCase()}`
  return null
}

export function deleteTikTokCreatorData(
  state: TikTokDiscoveryState,
  creatorIdentity: string
): DeleteCreatorDataSummary {
  const videoIds = new Set(
    state.videos
      .filter(video => videoCreatorIdentity(video) === creatorIdentity)
      .map(video => video.video_id)
  )
  const before = {
    creators: state.creators.length,
    videos: state.videos.length,
    comments: state.comments.length,
    sources: state.sources.length,
    insights: state.insights.length
  }

  state.creators = state.creators.filter((creator) => {
    const identity = creator.stable_id
      ? `tiktok:${creator.stable_id}`
      : creator.username ? `tiktok:@${creator.username.toLowerCase()}` : null
    return identity !== creatorIdentity
  })
  state.videos = state.videos.filter(video => videoCreatorIdentity(video) !== creatorIdentity)
  state.comments = state.comments.filter(comment => !comment.video_id || !videoIds.has(comment.video_id))
  state.sources = state.sources.filter(source => source.creator_identity !== creatorIdentity)
  state.insights = state.insights.filter(insight => insight.creator_identity !== creatorIdentity)

  return {
    creators: before.creators - state.creators.length,
    videos: before.videos - state.videos.length,
    comments: before.comments - state.comments.length,
    sources: before.sources - state.sources.length,
    insights: before.insights - state.insights.length
  }
}
