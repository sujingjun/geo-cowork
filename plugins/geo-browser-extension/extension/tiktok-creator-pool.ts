import type { StoredTikTokCreator } from './discovery-store.types'
import type {
  TikTokCreatorPool,
  TikTokCreatorPoolDependencies,
  TikTokCreatorPoolResult
} from './tiktok-creator-pool.types'

export function upsertTikTokCreatorInPool(
  pool: TikTokCreatorPool,
  discovered: StoredTikTokCreator,
  dependencies: TikTokCreatorPoolDependencies
): TikTokCreatorPoolResult {
  const username = discovered.username?.toLowerCase() || null
  const existing = pool.find(creator =>
    creator.platform === 'tiktok'
    && (
      (discovered.stable_id && creator.stable_id === discovered.stable_id)
      || (username && (creator.platform_uid?.toLowerCase() === username || creator.unique_id?.toLowerCase() === username))
    )
  )
  const updatedAt = dependencies.now()

  if (!existing) {
    pool.push({
      id: dependencies.createId(),
      platform: 'tiktok',
      platform_uid: discovered.username,
      stable_id: discovered.stable_id,
      sec_uid: null,
      nickname: discovered.nickname,
      avatar_url: discovered.avatar_url,
      signature: discovered.signature,
      follower_count: discovered.follower_count,
      following_count: discovered.following_count,
      aweme_count: discovered.video_count,
      total_favorited: discovered.total_favorited,
      unique_id: discovered.username,
      short_id: null,
      region: discovered.country,
      country: discovered.country,
      language: discovered.language,
      gender: discovered.gender,
      skin_tone: discovered.skin_tone,
      age_range: discovered.age_range,
      source: 'page',
      sync_status: 'pending',
      status: 'pending',
      created_at: updatedAt,
      updated_at: updatedAt
    })
    return 'inserted'
  }

  existing.stable_id = discovered.stable_id || existing.stable_id || null
  existing.platform_uid = discovered.username || existing.platform_uid
  existing.unique_id = discovered.username || existing.unique_id
  existing.nickname = discovered.nickname || existing.nickname
  existing.avatar_url = discovered.avatar_url || existing.avatar_url
  existing.signature = discovered.signature || existing.signature
  existing.follower_count = discovered.follower_count ?? existing.follower_count
  existing.following_count = discovered.following_count ?? existing.following_count
  existing.aweme_count = discovered.video_count ?? existing.aweme_count
  existing.total_favorited = discovered.total_favorited ?? existing.total_favorited
  existing.region = discovered.country || existing.region
  existing.country = discovered.country || existing.country || null
  existing.language = discovered.language || existing.language || null
  existing.gender = discovered.gender || existing.gender || null
  existing.skin_tone = discovered.skin_tone || existing.skin_tone || null
  existing.age_range = discovered.age_range || existing.age_range || null
  existing.sync_status = 'pending'
  existing.updated_at = updatedAt
  return 'updated'
}
