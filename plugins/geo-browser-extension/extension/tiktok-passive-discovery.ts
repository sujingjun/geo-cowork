import {
  extractTikTokDiscoveryFromDocument,
  extractTikTokDiscoveryFromDom
} from './tiktok-discovery'
import type { TikTokDiscoveryBatch } from './tiktok-discovery.types'
import {
  TIKTOK_DISCOVERY_DEBOUNCE_MS,
  TIKTOK_DISCOVERY_RUNTIME_MESSAGE,
  TIKTOK_DISCOVERY_WINDOW_MESSAGE
} from './tiktok-passive-discovery.constants'
import type { TikTokPassiveDiscoveryOptions } from './tiktok-passive-discovery.types'

function hasDiscoveries(batch: TikTokDiscoveryBatch): boolean {
  return batch.creators.length > 0 || batch.videos.length > 0 || batch.comments.length > 0
}

function batchFingerprint(batch: TikTokDiscoveryBatch): string {
  return JSON.stringify({
    page_url: batch.context.page_url,
    creators: batch.creators,
    videos: batch.videos,
    comments: batch.comments
  })
}

function isTikTokPage(url: URL): boolean {
  return /(^|\.)tiktok\.com$/.test(url.hostname)
}

function isDiscoveryBatch(value: unknown): value is TikTokDiscoveryBatch {
  if (!value || typeof value !== 'object') return false
  const batch = value as Partial<TikTokDiscoveryBatch>
  return Array.isArray(batch.creators)
    && Array.isArray(batch.videos)
    && Array.isArray(batch.comments)
    && !!batch.context
}

export function initTikTokPassiveDiscovery(options: TikTokPassiveDiscoveryOptions = {}): void {
  const url = new URL(window.location.href)
  if (!isTikTokPage(url)) return

  const now = options.now || (() => new Date().toISOString())
  const createPageInstanceId = options.createPageInstanceId || (() => crypto.randomUUID())
  let pageInstanceUrl = url.href
  let pageInstanceId = createPageInstanceId()
  let scheduled: number | null = null
  const lastFingerprints = new Map<string, string>()

  async function forward(batch: TikTokDiscoveryBatch): Promise<void> {
    if (!hasDiscoveries(batch)) return
    const currentPageUrl = window.location.href
    if (batch.context.page_url !== currentPageUrl) return
    if (currentPageUrl !== pageInstanceUrl) {
      pageInstanceUrl = currentPageUrl
      pageInstanceId = createPageInstanceId()
    }
    const pageBatch: TikTokDiscoveryBatch = {
      ...batch,
      context: { ...batch.context, page_instance_id: pageInstanceId }
    }
    const fingerprint = batchFingerprint(pageBatch)
    const fingerprintKey = `${pageInstanceId}:${pageBatch.context.source}:${pageBatch.context.page_url}`
    if (fingerprint === lastFingerprints.get(fingerprintKey)) return
    lastFingerprints.set(fingerprintKey, fingerprint)
    await chrome.runtime.sendMessage({
      type: TIKTOK_DISCOVERY_RUNTIME_MESSAGE,
      data: pageBatch
    })
  }

  function scanCurrentDocument(): void {
    const currentUrl = new URL(window.location.href)
    const observedAt = now()
    const batches = [
      extractTikTokDiscoveryFromDocument(document, currentUrl, observedAt),
      extractTikTokDiscoveryFromDom(document, currentUrl, observedAt)
    ]
    for (const batch of batches) {
      void forward(batch).catch(error =>
        console.error('[CreatorWorkbench] TikTok passive discovery failed:', error)
      )
    }
  }

  function scheduleScan(): void {
    if (scheduled != null) return
    scheduled = window.setTimeout(() => {
      scheduled = null
      scanCurrentDocument()
    }, TIKTOK_DISCOVERY_DEBOUNCE_MS)
  }

  window.addEventListener('message', (event: MessageEvent) => {
    if (event.source !== window || event.data?.type !== TIKTOK_DISCOVERY_WINDOW_MESSAGE) return
    if (!isDiscoveryBatch(event.data.data)) return
    void forward(event.data.data).catch(error =>
      console.error('[CreatorWorkbench] TikTok network discovery forward failed:', error)
    )
  })

  if (typeof MutationObserver !== 'undefined' && document.documentElement) {
    const observer = new MutationObserver(scheduleScan)
    observer.observe(document.documentElement, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', scheduleScan, { once: true })
  } else {
    scheduleScan()
  }
}
