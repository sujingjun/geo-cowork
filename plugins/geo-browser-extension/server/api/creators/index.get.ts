/**
 * GET /api/creators — List creators with optional filtering and pagination.
 *
 * Query params:
 *   page, pageSize — pagination
 *   platform — filter by platform (douyin|tiktok)
 *   keyword — search by nickname / unique_id / sec_uid
 *   minFollowers, maxFollowers — follower count range
 *   source — filter by source (search|comment|profile|manual)
 *   status — filter by status (pending|sent|replied|converted|blocked)
 *
 * In web mode, this serves as the BFF endpoint backed by SQLite.
 * In extension mode, the app calls chrome.runtime directly.
 */

import { defineEventHandler, getQuery } from 'h3'

// In-memory creator store for web mode (Phase 2)
// Phase 6 will persist to SQLite via Drizzle ORM
const webCreatorStore: Array<Record<string, unknown>> = []

export function getWebCreatorStore() {
  return webCreatorStore
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 20

  let items = [...webCreatorStore]

  if (query.platform) {
    items = items.filter((c: any) => c.platform === query.platform)
  }

  // Filter by keyword
  if (query.keyword) {
    const kw = String(query.keyword).toLowerCase()
    items = items.filter((c: any) =>
      (c.nickname?.toLowerCase().includes(kw))
      || (c.unique_id?.toLowerCase().includes(kw))
      || (c.sec_uid?.toLowerCase().includes(kw))
      || (c.platform_uid?.toLowerCase().includes(kw))
    )
  }

  // Filter by follower range
  if (query.minFollowers != null) {
    const min = Number(query.minFollowers)
    items = items.filter((c: any) => c.follower_count != null && c.follower_count >= min)
  }
  if (query.maxFollowers != null) {
    const max = Number(query.maxFollowers)
    items = items.filter((c: any) => c.follower_count != null && c.follower_count <= max)
  }

  // Filter by source
  if (query.source) {
    items = items.filter((c: any) => c.source === query.source)
  }

  // Filter by status
  if (query.status) {
    items = items.filter((c: any) => c.status === query.status)
  }

  const total = items.length
  const start = (page - 1) * pageSize
  const pagedItems = items.slice(start, start + pageSize)

  return {
    items: pagedItems,
    total,
    page,
    pageSize
  }
})
