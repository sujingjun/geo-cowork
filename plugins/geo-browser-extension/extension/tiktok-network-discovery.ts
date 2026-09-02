import { extractTikTokDiscoveryFromPayload } from './tiktok-discovery'
import type { TikTokDiscoveryBatch } from './tiktok-discovery.types'
import {
  TIKTOK_DISCOVERY_WINDOW_MESSAGE,
  TIKTOK_MAX_RESPONSE_TEXT_CHARS
} from './tiktok-passive-discovery.constants'
import type { TikTokNetworkDiscoveryOptions } from './tiktok-network-discovery.types'

const INSTALL_FLAG = '__creatorWorkbenchTikTokNetworkDiscoveryInstalled'

function hasDiscoveries(batch: TikTokDiscoveryBatch): boolean {
  return batch.creators.length > 0 || batch.videos.length > 0 || batch.comments.length > 0
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

function shouldInspect(urlValue: string): boolean {
  try {
    const url = new URL(urlValue, window.location.origin)
    return /(^|\.)tiktok\.com$/.test(url.hostname) && url.pathname.startsWith('/api/')
  } catch {
    return false
  }
}

export function initTikTokNetworkDiscovery(options: TikTokNetworkDiscoveryOptions = {}): void {
  const pageWindow = window as Window & Record<string, unknown>
  if (pageWindow[INSTALL_FLAG] || typeof window.fetch !== 'function') return
  pageWindow[INSTALL_FLAG] = true

  const now = options.now || (() => new Date().toISOString())
  const originalFetch = window.fetch

  function postPayload(payload: unknown, pageUrl: string): void {
    const batch = extractTikTokDiscoveryFromPayload(payload, {
      pageUrl,
      source: 'network',
      observedAt: now()
    })
    if (!hasDiscoveries(batch)) return
    window.postMessage({
      type: TIKTOK_DISCOVERY_WINDOW_MESSAGE,
      data: batch
    }, '*')
  }

  async function inspectResponse(responsePromise: Promise<Response>, pageUrl: string): Promise<void> {
    try {
      const response = await responsePromise
      const payload = await response.clone().json()
      postPayload(payload, pageUrl)
    } catch {
      // Non-JSON and unrelated responses are intentionally ignored.
    }
  }

  window.fetch = function (...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
    const pageUrl = window.location.href
    const responsePromise = originalFetch.apply(this, args)
    if (shouldInspect(requestUrl(args[0]))) {
      void inspectResponse(responsePromise, pageUrl)
    }
    return responsePromise
  }

  const Xhr = window.XMLHttpRequest
  if (typeof Xhr !== 'function') return
  const originalOpen = Xhr.prototype.open
  const originalSend = Xhr.prototype.send
  const xhrUrls = new WeakMap<XMLHttpRequest, string>()

  Xhr.prototype.open = function (...args: Parameters<XMLHttpRequest['open']>): void {
    xhrUrls.set(this, String(args[1] || ''))
    ;(originalOpen as (...openArgs: Parameters<XMLHttpRequest['open']>) => void).apply(this, args)
  }

  Xhr.prototype.send = function (...args: Parameters<XMLHttpRequest['send']>): void {
    const urlValue = xhrUrls.get(this) || ''
    const pageUrl = window.location.href
    if (shouldInspect(urlValue)) {
      this.addEventListener('load', () => {
        try {
          if (this.responseType === 'json') {
            postPayload(this.response, pageUrl)
            return
          }
          if (this.responseType && this.responseType !== 'text') return
          if (!this.responseText || this.responseText.length > TIKTOK_MAX_RESPONSE_TEXT_CHARS) return
          postPayload(JSON.parse(this.responseText), pageUrl)
        } catch {
          // Non-JSON and unrelated responses are intentionally ignored.
        }
      }, { once: true })
    }
    originalSend.apply(this, args)
  }
}
