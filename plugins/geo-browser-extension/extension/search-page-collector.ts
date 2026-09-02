import type { SearchPageCreatorCandidate } from './search-page-collector.types'

/** Plain page-world function; it is serialized by chrome.scripting. */
export function extractSearchCreatorsFromPage(): SearchPageCreatorCandidate[] {
  const candidates: SearchPageCreatorCandidate[] = []
  const seen = new Set<string>()
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/user/"]'))

  for (const link of links) {
    let secUid: string
    try {
      const match = new URL(link.href).pathname.match(/^\/user\/([^/]+)/)
      secUid = match?.[1] ? decodeURIComponent(match[1]) : ''
    } catch {
      continue
    }
    if (!secUid || seen.has(secUid)) continue

    seen.add(secUid)
    const nickname = (link.textContent || '').replace(/^@/, '').trim() || null
    candidates.push({ sec_uid: secUid, nickname })
    if (candidates.length >= 50) break
  }

  return candidates
}

export async function collectSearchCreatorsFromTab(tabId: number): Promise<SearchPageCreatorCandidate[]> {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: extractSearchCreatorsFromPage
  })
  return results[0]?.result || []
}
