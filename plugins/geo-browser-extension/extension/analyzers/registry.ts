/**
 * Platform adapter registry.
 *
 * Adding Instagram/Facebook support = adding a new adapter file and
 * registering it here; the orchestrator (page-analyzer.ts) and the
 * background flow are platform-agnostic.
 */

import type { PlatformAdapter } from './types'
import { tiktokAdapter } from './tiktok'

export const platformAdapters: PlatformAdapter[] = [tiktokAdapter]

/** Find the adapter that handles this URL, if any. */
export function findAdapter(url: URL): PlatformAdapter | undefined {
  return platformAdapters.find(adapter => adapter.match(url))
}
