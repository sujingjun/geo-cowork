import type { Creator } from './types'
import { migrateTikTokTotalFavorited } from './tiktok-count'

export async function migrateStoredTikTokCreatorPool(
  creators: Creator[],
  persist: (creators: Creator[]) => Promise<void>
): Promise<void> {
  if (migrateTikTokTotalFavorited(creators)) await persist(creators)
}
