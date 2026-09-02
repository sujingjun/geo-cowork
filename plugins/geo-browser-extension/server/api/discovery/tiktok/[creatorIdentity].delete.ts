import { client } from '../../../utils/db'
import {
  deleteTikTokCreator,
  ensureTikTokDiscoveryTables
} from '../../../utils/tiktok-discovery-repository'

export default defineEventHandler(async (event) => {
  const rawIdentity = getRouterParam(event, 'creatorIdentity') || ''
  const creatorIdentity = decodeURIComponent(rawIdentity)
  if (!creatorIdentity.startsWith('tiktok:')) {
    throw createError({ statusCode: 400, statusMessage: '无效的 TikTok 达人身份' })
  }

  await ensureTikTokDiscoveryTables(client)
  return deleteTikTokCreator(client, creatorIdentity)
})
