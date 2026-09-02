import { runInNewContext } from 'node:vm'

interface FakeElement {
  className: string
  disabled: boolean
  textContent: string
  type: string
  addEventListener: (type: string, listener: () => unknown) => void
  appendChild: () => void
  replaceChildren: () => void
}

function createElement(onClick?: (listener: () => unknown) => void): FakeElement {
  return {
    className: '',
    disabled: false,
    textContent: '',
    type: '',
    addEventListener(type, listener) {
      if (type === 'click') onClick?.(listener)
    },
    appendChild() {},
    replaceChildren() {}
  }
}

export async function executePopupWorkbenchClick(scriptSource: string) {
  let clickListener: (() => unknown) | undefined
  const createdTabs: chrome.tabs.CreateProperties[] = []
  const elements = new Map<string, FakeElement>()
  const document = {
    createDocumentFragment: () => createElement(),
    createElement: () => createElement(),
    querySelector(selector: string) {
      if (!elements.has(selector)) {
        elements.set(
          selector,
          createElement(selector === '#open-workbench' ? listener => { clickListener = listener } : undefined)
        )
      }
      return elements.get(selector)!
    }
  }
  const chromeStub = {
    runtime: {
      getURL(path: string) {
        return `chrome-extension://example/${path}`
      },
      async sendMessage(message: { type: string }) {
        if (message.type === 'GET_LAST_ANALYSIS') return { analysis: null }
        if (message.type === 'GET_PAGE_CREATOR_LIST') return { items: [], total: 0, summary: null }
        return { success: true }
      }
    },
    tabs: {
      async create(options: chrome.tabs.CreateProperties) {
        createdTabs.push({ url: options.url })
        return {} as chrome.tabs.Tab
      },
      async query() {
        return [{ url: 'https://www.tiktok.com/@example' }]
      }
    }
  }

  runInNewContext(scriptSource, {
    URLSearchParams,
    chrome: chromeStub,
    confirm: () => true,
    console,
    document,
    window: { location: { search: '' } }
  }, { filename: 'public/popup.js' })

  if (!clickListener) throw new Error('popup.js 未注册 #open-workbench 点击事件')
  await clickListener()
  return createdTabs
}
