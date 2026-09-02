export async function openExtensionPopup(pageUrl?: string, sourceTabId?: number): Promise<void> {
  try {
    if (chrome.action?.openPopup) {
      await chrome.action.openPopup()
      return
    }
    throw new Error('openPopup unavailable')
  } catch {
    try {
      const params = new URLSearchParams()
      if (pageUrl) params.set('pageUrl', pageUrl)
      if (Number.isInteger(sourceTabId)) params.set('sourceTabId', String(sourceTabId))
      const popupPath = params.size > 0 ? `popup.html?${params}` : 'popup.html'
      await chrome.windows.create({
        url: chrome.runtime.getURL(popupPath),
        type: 'popup',
        width: 420,
        height: 640
      })
    } catch (error) {
      console.error('[CreatorWorkbench] Failed to open extension popup:', error)
    }
  }
}
