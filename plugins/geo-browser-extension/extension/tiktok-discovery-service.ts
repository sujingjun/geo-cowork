import { ingestTikTokDiscoveryBatch, pruneExpiredTikTokComments } from './discovery-store'
import type { StoredTikTokCreator } from './discovery-store.types'
import type { TikTokDiscoveryBatch } from './tiktok-discovery.types'
import type {
  TikTokDiscoveryServiceDependencies,
  TikTokDiscoverySyncPayload
} from './tiktok-discovery-service.types'

function sameCreator(
  stored: StoredTikTokCreator,
  observed: TikTokDiscoveryBatch['creators'][number]
): boolean {
  return !!(
    (observed.stable_id && stored.stable_id === observed.stable_id)
    || (observed.username && stored.username?.toLowerCase() === observed.username.toLowerCase())
  )
}

export async function handleTikTokDiscoveryBatch(
  batch: TikTokDiscoveryBatch,
  dependencies: TikTokDiscoveryServiceDependencies
) {
  const currentState = await dependencies.loadState()
  pruneExpiredTikTokComments(currentState, batch.context.observed_at)
  const { state, summary, creatorChanges } = ingestTikTokDiscoveryBatch(currentState, batch)
  const touchedCreators = state.creators.filter(creator =>
    batch.creators.some(observed => sameCreator(creator, observed))
  )

  for (const creator of touchedCreators) dependencies.upsertCreator(creator)
  await dependencies.saveState(state, summary, creatorChanges)

  const videoIds = new Set(batch.videos.map(video => video.video_id))
  const sourceKeys = new Set(batch.creators.flatMap((creator) => {
    const identities = []
    if (creator.stable_id) identities.push(`tiktok:${creator.stable_id}`)
    if (creator.username) identities.push(`tiktok:@${creator.username.toLowerCase()}`)
    return identities
  }))
  const syncPayload: TikTokDiscoverySyncPayload = {
    creators: touchedCreators,
    videos: state.videos.filter(video => videoIds.has(video.video_id)),
    sources: state.sources.filter(source =>
      source.page_url === batch.context.page_url
      && source.source === batch.context.source
      && source.observed_at === batch.context.observed_at
      && sourceKeys.has(source.creator_identity)
    )
  }
  await dependencies.syncToServer(syncPayload)

  return summary
}
