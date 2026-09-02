/**
 * Main World injected bridge — provides a programmable API on the page.
 * Communicates with content.ts via window.postMessage.
 */
;(function initCreatorWorkbenchBridge() {
  if (typeof window === 'undefined') return
  if ((window as any).CreatorWorkbench && typeof (window as any).CreatorWorkbench.call === 'function') return

  const REQUEST_TYPE = 'CREATOR_WORKBENCH_BRIDGE_REQUEST'
  const RESPONSE_TYPE = 'CREATOR_WORKBENCH_BRIDGE_RESPONSE'
  const DEFAULT_TIMEOUT_MS = 20 * 60 * 1000
  let seq = 0

  function nextRequestId(): string {
    seq += 1
    return `cw_${Date.now()}_${seq}_${Math.random().toString(36).slice(2, 8)}`
  }

  /**
   * Call an extension bridge action and wait for the response.
   * @param action - The bridge action name.
   * @param payload - Optional payload object.
   * @param options - Optional timeout configuration.
   * @returns Promise resolving with the response data.
   */
  function call(
    action: string,
    payload: Record<string, unknown> = {},
    options: { timeoutMs?: number } = {}
  ): Promise<unknown> {
    const requestId = nextRequestId()
    const timeoutMs = Number.isFinite(Number(options?.timeoutMs))
      ? Math.max(1000, Number(options.timeoutMs))
      : DEFAULT_TIMEOUT_MS

    return new Promise((resolve, reject) => {
      let done = false

      const finish = (fn: (v: unknown) => void, value: unknown) => {
        if (done) return
        done = true
        window.removeEventListener('message', onMessage)
        clearTimeout(timer)
        fn(value)
      }

      const onMessage = (event: MessageEvent) => {
        if (event.source !== window) return
        const data = event.data || {}
        if (data.type !== RESPONSE_TYPE || data.requestId !== requestId) return
        if (data.success === false) {
          finish(reject, new Error(data.error || 'Bridge call failed'))
          return
        }
        finish(resolve, data.data)
      }

      const timer = window.setTimeout(() => {
        finish(reject, new Error(`Bridge timeout (${timeoutMs}ms) for action: ${action}`))
      }, timeoutMs)

      window.addEventListener('message', onMessage)
      window.postMessage({
        type: REQUEST_TYPE,
        requestId,
        action: String(action || ''),
        payload
      }, '*')
    })
  }

  const api = {
    version: '1.0.0',
    call,
    ping: (options?: { timeoutMs?: number }) => call('ping', {}, options),
    searchCreators: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('search_creators', { params }, options),
    crawlComments: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('crawl_comments', { params }, options),
    sendDm: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('send_dm', { params }, options),
    getCreatorProfile: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('get_creator_profile', { params }, options),
    createMessageTemplate: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('create_message_template', { params }, options),
    checkOutreachStatus: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('check_outreach_status', { params }, options),
    getCreatorList: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('get_creator_list', { params }, options),
    getCurrentTags: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('get_current_tags', { params }, options),
    getCreatorTags: (options?: { timeoutMs?: number }) => call('get_creator_tags', {}, options),
    createCreatorTag: (name: string, options?: { timeoutMs?: number }) =>
      call('create_creator_tag', { name: String(name || '') }, options),
    getScheduleTaskSet: (options?: { timeoutMs?: number }) => call('get_schedule_task_set', {}, options),
    runAutoCrawlBatch: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('run_auto_crawl_batch', { params }, options),
    runAutoSendBatch: (options?: { timeoutMs?: number }) => call('run_auto_send_batch', {}, options),
    analyzePage: (params: Record<string, unknown> = {}, options?: { timeoutMs?: number }) =>
      call('analyze_page', { params }, options)
  }

  try {
    Object.defineProperty(window, 'CreatorWorkbench', {
      value: api,
      configurable: false,
      enumerable: false,
      writable: false
    })
  } catch (_) {
    ;(window as any).CreatorWorkbench = api
  }

  window.dispatchEvent(new CustomEvent('creator-workbench-ready', {
    detail: { version: api.version }
  }))
  console.log('[CreatorWorkbench] Bridge ready v' + api.version)
})()
