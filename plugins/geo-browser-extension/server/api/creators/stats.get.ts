/**
 * GET /api/creators/stats — Get creator pool statistics.
 *
 * Returns aggregate stats about the creator pool.
 */

import { defineEventHandler } from 'h3'
import { getWebCreatorStore } from './index.get'

export default defineEventHandler(async () => {
  const store = getWebCreatorStore()

  const bySource = store.reduce((acc: Record<string, number>, c: any) => {
    acc[c.source] = (acc[c.source] || 0) + 1
    return acc
  }, {})

  const byStatus = store.reduce((acc: Record<string, number>, c: any) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {})

  const followerBuckets = {
    '0-1k': 0,
    '1k-10k': 0,
    '10k-100k': 0,
    '100k-1m': 0,
    '1m+': 0
  }

  for (const c of store as any[]) {
    const fc = c.follower_count
    if (fc == null) continue
    if (fc < 1000) followerBuckets['0-1k']++
    else if (fc < 10000) followerBuckets['1k-10k']++
    else if (fc < 100000) followerBuckets['10k-100k']++
    else if (fc < 1000000) followerBuckets['100k-1m']++
    else followerBuckets['1m+']++
  }

  return {
    total: store.length,
    bySource,
    byStatus,
    followerBuckets
  }
})
