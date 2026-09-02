type StoreAuthProvider = 'amazon' | 'shopify'

interface StoreAuthPopupPayload {
  provider: StoreAuthProvider
  status: 'success' | 'error'
  message: string
  redirectTo?: string
}

interface PopupOptions {
  width?: number
  height?: number
}

interface StoreAuthPopupResult {
  payload: StoreAuthPopupPayload | null
  stop: () => void
  open: (url: string, options?: PopupOptions) => Promise<StoreAuthPopupPayload | null>
}

export function watchStoreAuthPopup(provider: StoreAuthProvider): StoreAuthPopupResult {
  let payload: StoreAuthPopupPayload | null = null
  let popupWindow: Window | null = null
  let messageListener: ((event: MessageEvent) => void) | null = null
  let closeTimer: ReturnType<typeof setInterval> | null = null

  function stop() {
    if (messageListener) {
      window.removeEventListener('message', messageListener)
      messageListener = null
    }
    if (closeTimer) {
      clearInterval(closeTimer)
      closeTimer = null
    }
  }

  if (!import.meta.client) {
    return {
      get payload() {
        return payload
      },
      stop,
      open: async () => null
    }
  }

  function open(url: string, options?: PopupOptions): Promise<StoreAuthPopupPayload | null> {
    const width = options?.width ?? 720
    const height = options?.height ?? 780
    const top = (window.top?.outerHeight ?? 0) / 2 + (window.top?.screenY ?? 0) - height / 2
    const left = (window.top?.outerWidth ?? 0) / 2 + (window.top?.screenX ?? 0) - width / 2

    popupWindow = window.open(
      url,
      'store-auth-popup',
      `width=${width}, height=${height}, top=${top}, left=${left}, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no`
    )

    return new Promise<StoreAuthPopupPayload | null>((resolve) => {
      messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin)
          return

        const message = event.data as { type?: string, payload?: StoreAuthPopupPayload } | null
        if (message?.type !== `${provider}-auth` || message.payload?.provider !== provider)
          return

        payload = message.payload ?? null
        stop()
        try {
          popupWindow?.close()
        } catch {
          // ignore
        }
        resolve(payload)
      }

      window.addEventListener('message', messageListener)

      // Poll for popup closure (user manually closes without postMessage)
      closeTimer = setInterval(() => {
        if (!popupWindow || popupWindow.closed) {
          stop()
          resolve(payload)
        }
      }, 500)
    })
  }

  return {
    get payload() {
      return payload
    },
    stop,
    open
  }
}
