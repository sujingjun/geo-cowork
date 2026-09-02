/**
 * POST /api/creators/search — Search/filter creators in the local store.
 *
 * Body: { platform, keyword, minFollowers, maxFollowers, source, status, page, pageSize }
 * Returns: { items, total, page, pageSize }
 *
 * In extension mode, this triggers the Douyin search interception flow
 * via background.ts. In web mode, it queries the in-memory store.
 */

import { defineEventHandler, readBody } from 'h3'
import { getWebCreatorStore } from './index.get'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const page = Number(body.page) || 1
  const pageSize = Number(body.pageSize) || 20

  const store = getWebCreatorStore()
  let items = [...store]

  if (body.platform) {
    items = items.filter((c: any) => c.platform === body.platform)
  }

  if (body.keyword) {
    const kw = String(body.keyword).toLowerCase()
    items = items.filter((c: any) =>
      (c.nickname?.toLowerCase().includes(kw))
      || (c.unique_id?.toLowerCase().includes(kw))
      || (c.sec_uid?.toLowerCase().includes(kw))
      || (c.platform_uid?.toLowerCase().includes(kw))
    )
  }

  if (body.minFollowers != null) {
    items = items.filter((c: any) => c.follower_count != null && c.follower_count >= Number(body.minFollowers))
  }
  if (body.maxFollowers != null) {
    items = items.filter((c: any) => c.follower_count != null && c.follower_count <= Number(body.maxFollowers))
  }
  if (body.source) {
    items = items.filter((c: any) => c.source === body.source)
  }
  if (body.status) {
    items = items.filter((c: any) => c.status === body.status)
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
