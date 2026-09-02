import type { Creator } from './types'

export function markCreatorsSynced(
  creators: Array<Pick<Creator, 'sync_status'>>
): void {
  for (const creator of creators) creator.sync_status = 'synced'
}
