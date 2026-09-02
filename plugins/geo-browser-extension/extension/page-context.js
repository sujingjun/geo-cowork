export const ACTIVE_PAGE_CONTEXT_MESSAGE = 'GET_ACTIVE_PAGE_CONTEXT'

export async function readActivePageContext(queryTabs) {
  const [tab] = await queryTabs({ active: true, currentWindow: true })
  const url = typeof tab?.url === 'string' ? tab.url : ''
  const title = typeof tab?.title === 'string' && tab.title.trim()
    ? tab.title.trim()
    : url

  return {
    available: Boolean(url),
    title,
    url
  }
}
