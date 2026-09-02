import { ACTIVE_PAGE_CONTEXT_MESSAGE } from '../page-context.js'

function setStatus(status, text, state) {
  status.textContent = text
  status.dataset.state = state
}

export async function loadActivePageContext(sendMessage, elements) {
  setStatus(elements.status, '正在读取当前页面…', 'loading')

  try {
    const response = await sendMessage({ type: ACTIVE_PAGE_CONTEXT_MESSAGE })
    if (!response?.ok) throw new Error(response?.error || '无法读取当前页面')

    const { context } = response
    if (!context?.available) {
      elements.title.textContent = '当前页面不可用'
      elements.url.textContent = '—'
      elements.url.href = '#'
      setStatus(elements.status, '当前标签页没有可读取的 URL', 'unavailable')
      return
    }

    elements.title.textContent = context.title || context.url
    elements.url.textContent = context.url
    elements.url.href = context.url
    setStatus(elements.status, '已读取当前页面', 'ready')
  } catch (error) {
    elements.title.textContent = '读取失败'
    elements.url.textContent = '—'
    elements.url.href = '#'
    setStatus(
      elements.status,
      error instanceof Error ? error.message : String(error),
      'error'
    )
  }
}
