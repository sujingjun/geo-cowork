/**
 * POST /api/creators/batch — Batch upload creators with dedup.
 *
 * Body: { creators: Creator[] }
 * Returns: { inserted: number, ignored: number }
 *
 * Dedup is done by (platform, platform_uid || sec_uid) so the same
 * username on two platforms never collides.
 */

import { defineEventHandler, readBody } from 'h3'
import { getWebCreatorStore } from './index.get'

function dedupKey(c: Record<string, unknown>): string {
  const platform = typeof c.platform === 'string' ? c.platform : 'douyin'
  const platformUid = typeof c.platform_uid === 'string' ? c.platform_uid : ''
  const secUid = typeof c.sec_uid === 'string' ? c.sec_uid : ''
  return `${platform}:${platformUid || secUid}`
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const creators = Array.isArray(body?.creators) ? body.creators : []

  const store = getWebCreatorStore()
  const existingKeys = new Set(store.map(dedupKey))

  let inserted = 0
  let ignored = 0

  for (const creator of creators) {
    const platform = creator.platform || 'douyin'
    const uid = creator.platform_uid || creator.sec_uid
    if (!uid) {
      ignored++
      continue
    }

    const key = `${platform}:${uid}`
    if (existingKeys.has(key)) {
      ignored++
      continue
    }

    existingKeys.add(key)
    store.push({
      id: creator.id || crypto.randomUUID(),
      platform,
      platform_uid: creator.platform_uid || null,
      sec_uid: creator.sec_uid || null,
      nickname: creator.nickname || null,
      avatar_url: creator.avatar_url || null,
      signature: creator.signature || null,
      follower_count: creator.follower_count ?? null,
      following_count: creator.following_count ?? null,
      aweme_count: creator.aweme_count ?? null,
      total_favorited: creator.total_favorited ?? null,
      unique_id: creator.unique_id || null,
      short_id: creator.short_id || null,
      region: creator.region || null,
      source: creator.source || 'manual',
      status: creator.status || 'pending',
      created_at: creator.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    inserted++
  }

  return { inserted, ignored }
})
