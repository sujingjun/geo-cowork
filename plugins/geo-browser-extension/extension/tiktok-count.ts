import {
  TIKTOK_SIGNED_INT32_MIN,
  TIKTOK_UINT32_RANGE
} from './tiktok-count.constants'

export function normalizeTikTokTotalFavorited(value: number): number {
  if (Number.isInteger(value) && value >= TIKTOK_SIGNED_INT32_MIN && value < 0) {
    return value + TIKTOK_UINT32_RANGE
  }
  return value
}

export function migrateTikTokTotalFavorited<
  T extends { platform?: string, total_favorited: number | null }
>(creators: T[]): boolean {
  let changed = false
  for (const creator of creators) {
    if (creator.platform !== 'tiktok' || creator.total_favorited == null) continue
    const normalized = normalizeTikTokTotalFavorited(creator.total_favorited)
    if (normalized === creator.total_favorited) continue
    creator.total_favorited = normalized
    changed = true
  }
  return changed
}
