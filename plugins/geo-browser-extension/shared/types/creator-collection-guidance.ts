import type { CreatorDisplayIdentity } from './creator-display'

export interface CreatorCollectionProfile extends CreatorDisplayIdentity {
  avatar_url: string | null
  signature: string | null
  country?: string | null
  language?: string | null
  follower_count: number | null
}

export interface CreatorCollectionVideo {
  video_id: string
  url: string | null
  like_count: number | null
  play_count: number | null
  favorite_count: number | null
  comment_count: number | null
  share_count: number | null
}

export interface CreatorCollectionGuidanceInput {
  creator: CreatorCollectionProfile
  videos: CreatorCollectionVideo[]
  collectedCommentCount: number
}

export interface CreatorCollectionGuidance {
  kind: 'profile' | 'video' | 'comments'
  label: string
  message: string
  url: string
}
