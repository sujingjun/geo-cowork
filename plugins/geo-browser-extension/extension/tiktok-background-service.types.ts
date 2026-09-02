import type { StoredTikTokCreator } from './discovery-store.types'

export interface TikTokBackgroundStorage {
  get: (key: string) => Promise<Record<string, unknown>>
  set: (items: Record<string, unknown>) => Promise<void>
}

export interface TikTokBackgroundServiceDependencies {
  storage: TikTokBackgroundStorage
  getApiBase: () => string
  fetch: typeof fetch
  now: () => string
  upsertCreator: (creator: StoredTikTokCreator) => void
  persistCreatorPool: () => void
  markCreatorsSynced: (creators: StoredTikTokCreator[]) => void
  openPopup: (pageUrl: string, tabId?: number) => Promise<void>
}
