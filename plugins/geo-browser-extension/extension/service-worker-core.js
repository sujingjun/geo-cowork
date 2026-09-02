import {
  ACTIVE_PAGE_CONTEXT_MESSAGE,
  readActivePageContext
} from './page-context.js'

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

export function registerServiceWorker(chromeApi) {
  chromeApi.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== ACTIVE_PAGE_CONTEXT_MESSAGE) return undefined

    ;(async () => {
      try {
        const context = await readActivePageContext(chromeApi.tabs.query.bind(chromeApi.tabs))
        sendResponse({ ok: true, context })
      } catch (error) {
        sendResponse({ ok: false, error: errorMessage(error) })
      }
    })()

    return true
  })

  return chromeApi.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
}
