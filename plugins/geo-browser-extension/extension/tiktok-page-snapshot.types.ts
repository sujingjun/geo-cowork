import type { TikTokDiscoverySummary } from './discovery-store.types'

export interface TikTokPageDiscoverySnapshot extends TikTokDiscoverySummary {
  page_url: string
  page_instance_id: string
  creator_identities: string[]
  inserted_creator_identities: string[]
  updated_creator_identities: string[]
  video_ids: string[]
  comment_ids: string[]
  pending_comment_ids: string[]
}
