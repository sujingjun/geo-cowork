/**
 * Page analyzer orchestrator — runs inside the content script.
 *
 * Fully automatic: when a page handled by a platform adapter finishes
 * loading (and on SPA navigations), it waits for profile data, extracts a
 * compact candidate and forwards it to the background service worker as a
 * PAGE_CANDIDATE message. No in-page UI.
 *
 * Also answers ANALYZE_PAGE runtime messages (explicit retry from the
 * popup / bridge) by re-running extraction on demand.
 */

import { findAdapter } from './analyzers/registry'
import type { PageCandidate } from './analyzers/types'
import {
  MIN_PROFILE_CONFIDENCE,
  PAGE_ANALYZER_URL_POLL_INTERVAL_MS,
  STRUCTURED_DATA_CONFIDENCE
} from './page-analyzer.constants'

/** URLs already analyzed in this page session — avoid duplicate reports. */
const analyzedUrls = new Set<string>()
let lastSeenUrl = ''
let running = false

async function analyzeCurrentPage(reason: string): Promise<PageCandidate | null> {
  const url = new URL(window.location.href)
  const adapter = findAdapter(url)
  if (!adapter) return null

  if (adapter.waitForData) {
    const ready = await adapter.waitForData(document, url)
    if (!ready) console.log('[CreatorWorkbench] PageAnalyzer: data wait timed out for', url.href)
  }

  const candidate = adapter.extract(document, url)
  if (!candidate) return null

  console.log(`[CreatorWorkbench] PageAnalyzer (${reason}): platform=${candidate.platform}, confidence=${candidate.confidence}`)

  if (!candidate.isProfilePage || candidate.confidence < MIN_PROFILE_CONFIDENCE) {
    return candidate
  }

  analyzedUrls.add(url.href)
  // Explicit runs are handed to the background directly by the caller —
  // forwarding again as PAGE_CANDIDATE would trigger a duplicate LLM call.
  if (reason !== 'explicit' && candidate.confidence < STRUCTURED_DATA_CONFIDENCE) {
    try {
      await chrome.runtime.sendMessage({ type: 'PAGE_CANDIDATE', data: candidate })
    } catch (error) {
      console.error('[CreatorWorkbench] PageAnalyzer: forward failed:', error)
    }
  }
  return candidate
}

/** Auto-analyze once per URL (initial load + SPA navigation). */
function maybeAutoAnalyze(reason: string): void {
  const href = window.location.href
  if (href === lastSeenUrl) return
  lastSeenUrl = href
  if (analyzedUrls.has(href)) return
  if (running) return
  const adapter = findAdapter(new URL(href))
  if (!adapter) return

  running = true
  analyzeCurrentPage(reason)
    .catch(error => console.error('[CreatorWorkbench] PageAnalyzer: analysis failed:', error))
    .finally(() => { running = false })
}

export function initPageAnalyzer(): void {
  // Run after the page has fully loaded.
  if (document.readyState === 'complete') {
    maybeAutoAnalyze('load')
  } else {
    window.addEventListener('load', () => maybeAutoAnalyze('load'), { once: true })
  }

  // SPA navigation: TikTok uses history.pushState, so poll the URL.
  window.addEventListener('popstate', () => maybeAutoAnalyze('popstate'))
  window.addEventListener('hashchange', () => maybeAutoAnalyze('hashchange'))
  window.setInterval(() => maybeAutoAnalyze('url-poll'), PAGE_ANALYZER_URL_POLL_INTERVAL_MS)

  // Explicit analysis requests from the background (popup retry / bridge).
  chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
    if (!message || typeof message !== 'object' || !('type' in message) || message.type !== 'ANALYZE_PAGE') return false
    ;(async () => {
      try {
        const candidate = await analyzeCurrentPage('explicit')
        sendResponse({ success: true, candidate })
      } catch (error: unknown) {
        sendResponse({ success: false, error: error instanceof Error ? error.message : 'analysis failed' })
      }
    })()
    return true
  })

  console.log('[CreatorWorkbench] PageAnalyzer initialized')
}
