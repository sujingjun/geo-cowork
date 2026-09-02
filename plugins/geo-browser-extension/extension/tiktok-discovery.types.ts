export type TikTokDiscoverySource = 'dom' | 'embedded' | 'network'

export interface TikTokDiscoveryContextInput {
  pageUrl: string
  source: TikTokDiscoverySource
  observedAt: string
}

export interface TikTokCreatorObservation {
  platform: 'tiktok'
  stable_id: string | null
  username: string | null
  nickname: string | null
  avatar_url: string | null
  signature: string | null
  country: string | null
  language: string | null
  gender: string | null
  skin_tone: string | null
  age_range: string | null
  follower_count: number | null
  following_count: number | null
  video_count: number | null
  total_favorited: number | null
}

export interface TikTokVideoObservation {
  platform: 'tiktok'
  video_id: string
  creator_stable_id: string | null
  creator_username: string | null
  url: string | null
  description: string | null
  like_count: number | null
  play_count: number | null
  favorite_count: number | null
  comment_count: number | null
  share_count: number | null
}

export interface TikTokCommentObservation {
  platform: 'tiktok'
  comment_id: string
  video_id: string | null
  author_id: string | null
  author_username: string | null
  author_nickname: string | null
  text: string
  like_count: number | null
  analysis_status: 'pending' | 'analyzed'
}

export interface TikTokDiscoveryBatch {
  creators: TikTokCreatorObservation[]
  videos: TikTokVideoObservation[]
  comments: TikTokCommentObservation[]
  context: {
    page_url: string
    source: TikTokDiscoverySource
    observed_at: string
    tab_id?: number
    page_instance_id?: string
  }
}
