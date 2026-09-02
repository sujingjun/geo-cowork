/**
 * Content Script — runs in the isolated world on target pages.
 * Bridges messages between the Main World (inject.ts, bridge.ts) and the
 * background service worker via chrome.runtime.
 */

import { initPageAnalyzer } from './page-analyzer'
import { initTikTokPassiveDiscovery } from './tiktok-passive-discovery'

const BRIDGE_REQUEST_TYPE = 'CREATOR_WORKBENCH_BRIDGE_REQUEST'
const BRIDGE_RESPONSE_TYPE = 'CREATOR_WORKBENCH_BRIDGE_RESPONSE'

/**
 * Map bridge action names to runtime message types understood by background.ts.
 */
function buildRuntimeMessage(
  action: string,
  payload: Record<string, unknown> | undefined
): Record<string, unknown> | null {
  const safePayload = payload && typeof payload === 'object' ? payload : {}

  const actionMap: Record<string, Record<string, unknown>> = {
    ping: { type: 'PING' },
    search_creators: { type: 'SEARCH_CREATORS', params: safePayload },
    crawl_comments: { type: 'CRAWL_COMMENTS', params: safePayload },
    send_dm: { type: 'SEND_DM', params: safePayload },
    get_creator_profile: { type: 'GET_CREATOR_PROFILE', params: safePayload },
    create_message_template: { type: 'CREATE_MESSAGE_TEMPLATE', params: safePayload },
    check_outreach_status: { type: 'CHECK_OUTREACH_STATUS', params: safePayload },
    get_creator_list: { type: 'GET_CREATOR_LIST', params: safePayload },
    get_current_tags: { type: 'GET_CURRENT_TAGS', params: safePayload },
    get_creator_tags: { type: 'GET_CREATOR_TAGS' },
    create_creator_tag: { type: 'CREATE_CREATOR_TAG', name: String(safePayload.name || '').trim() },
    get_schedule_task_set: { type: 'GET_SCHEDULE_TASK_SET' },
    run_auto_crawl_batch: { type: 'RUN_AUTO_CRAWL_BATCH', params: safePayload },
    run_auto_send_batch: { type: 'RUN_AUTO_SEND_BATCH' },
    analyze_page: { type: 'ANALYZE_PAGE', params: safePayload }
  }

  return actionMap[action] || null
}

/**
 * Post a bridge response back to the Main World.
 */
function postBridgeResponse(requestId: string, payload: Record<string, unknown> = {}) {
  if (!requestId) return
  try {
    window.postMessage({
      type: BRIDGE_RESPONSE_TYPE,
      requestId,
      ...payload
    }, '*')
  } catch (error) {
    console.error('[CreatorWorkbench] Content: bridge response failed:', error)
  }
}

/**
 * Handle bridge requests from bridge.ts (Main World).
 */
function handleBridgeMessage(event: MessageEvent): boolean {
  if (event.source !== window) return false
  if (event.data?.type !== BRIDGE_REQUEST_TYPE) return false

  const requestId = String(event.data?.requestId || '').trim()
  const action = String(event.data?.action || '').trim()
  const payload = event.data?.payload
  if (!requestId) return true

  const runtimeMessage = buildRuntimeMessage(action, payload)
  if (!runtimeMessage) {
    postBridgeResponse(requestId, {
      success: false,
      error: `Unsupported bridge action: ${action || '(empty)'}`
    })
    return true
  }

  ;(async () => {
    try {
      const response = await chrome.runtime.sendMessage(runtimeMessage)
      postBridgeResponse(requestId, { success: true, data: response })
    } catch (error: any) {
      postBridgeResponse(requestId, {
        success: false,
        error: error?.message || 'runtime sendMessage failed'
      })
    }
  })()

  return true
}

// ─── Main message listener ───────────────────────────────────────────

window.addEventListener('message', (event) => {
  // Handle bridge requests from bridge.ts
  if (handleBridgeMessage(event)) return

  if (event.source !== window) return

  const msgType = event.data?.type as string | undefined
  if (!msgType) return

  // Forward intercepted data from inject.ts to background
  const dataForwardMap: Record<string, string> = {
    DOUYIN_COMMENT_EXTENSION_DATA: 'COMMENT_DATA',
    DOUYIN_SEARCH_ITEM_DATA: 'SEARCH_ITEM_DATA',
    DOUYIN_USER_PROFILE_DATA: 'USER_PROFILE_DATA',
    DOUYIN_AWEME_POST_DATA: 'AWEME_POST_DATA'
  }

  if (dataForwardMap[msgType]) {
    const runtimeType = dataForwardMap[msgType]
    const payload = event.data.payload
    console.log(`[CreatorWorkbench] Content: forwarding ${msgType} → ${runtimeType}`)

    ;(async () => {
      try {
        const response = await chrome.runtime.sendMessage({ type: runtimeType, data: payload })
        console.log('[CreatorWorkbench] Content: ✅ forwarded', response)
      } catch (error) {
        console.error('[CreatorWorkbench] Content: forward failed:', error)
      }
    })()
    return
  }

  // Forward crawl progress
  if (msgType === 'CRAWL_PROGRESS') {
    chrome.runtime.sendMessage({
      type: 'CRAWL_PROGRESS',
      progressType: event.data.progressType,
      data: event.data.data
    }).catch(error => console.error('[CreatorWorkbench] Content: progress forward failed:', error))
  }
})

console.log('[CreatorWorkbench] Content script loaded')

// Start the automatic page analyzer (no-op on pages no adapter handles).
initPageAnalyzer()

// Discover creator-related data already loaded by the current TikTok page.
initTikTokPassiveDiscovery()
