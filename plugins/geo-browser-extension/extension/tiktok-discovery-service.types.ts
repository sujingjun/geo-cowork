import type {
  StoredTikTokCreator,
  StoredTikTokVideo,
  TikTokDiscoveryCreatorChange,
  TikTokDiscoverySourceRecord,
  TikTokDiscoveryState,
  TikTokDiscoverySummary
} from './discovery-store.types'

export interface TikTokDiscoverySyncPayload {
  creators: StoredTikTokCreator[]
  videos: StoredTikTokVideo[]
  sources: TikTokDiscoverySourceRecord[]
}

export interface TikTokDiscoveryServiceDependencies {
  loadState: () => Promise<TikTokDiscoveryState>
  saveState: (
    state: TikTokDiscoveryState,
    summary: TikTokDiscoverySummary,
    creatorChanges: TikTokDiscoveryCreatorChange[]
  ) => Promise<void>
  upsertCreator: (creator: StoredTikTokCreator) => void
  syncToServer: (payload: TikTokDiscoverySyncPayload) => Promise<void>
}
