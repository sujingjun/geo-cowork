import type { TikTokVideoObservation } from './tiktok-discovery.types'

function interactions(video: TikTokVideoObservation): number {
  return (video.like_count || 0) + (video.comment_count || 0) + (video.share_count || 0)
}

export function calculateVideoEngagementRate(video: TikTokVideoObservation): number | null {
  if (!video.play_count || video.play_count <= 0) return null
  return interactions(video) / video.play_count
}

export function calculateCreatorEngagementRate(videos: TikTokVideoObservation[]): number | null {
  const measurableVideos = videos.filter(video => video.play_count != null && video.play_count > 0)
  const totalPlays = measurableVideos.reduce((sum, video) => sum + (video.play_count || 0), 0)
  if (totalPlays === 0) return null
  const totalInteractions = measurableVideos.reduce((sum, video) => sum + interactions(video), 0)
  return totalInteractions / totalPlays
}
