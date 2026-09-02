import { client } from '../../../utils/db'
import { parseTikTokDiscoverySyncPayload } from '../../../utils/tiktok-discovery-contract'
import {
  ensureTikTokDiscoveryTables,
  upsertTikTokDiscovery
} from '../../../utils/tiktok-discovery-repository'

defineRouteMeta({
  openAPI: {
    description: '按 TikTok 稳定身份新增或更新被动发现的达人、视频和来源。',
    tags: ['creator-discovery']
  }
})

export default defineEventHandler(async (event) => {
  const payload = await readValidatedBody(event, parseTikTokDiscoverySyncPayload)
  await ensureTikTokDiscoveryTables(client)
  await upsertTikTokDiscovery(client, payload)

  return {
    creators: payload.creators.length,
    videos: payload.videos.length,
    sources: payload.sources.length
  }
})
