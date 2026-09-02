import type { PageCandidate } from './analyzers/types'
import type {
  AnalyzeCandidate,
  AnalyzePageApiResponse,
  AnalyzePageCommandResponse,
  PageAnalysisDependencies
} from './page-analysis-types'
import type { CreatorPlatform, PageAnalysisResult } from './types'
import { SUPPORTED_PROFILE_URL_PATTERNS } from './constants'
import { openExtensionPopup } from './popup-opener'

/** Judge, normalize and persist one compact page candidate. */
export async function handlePageCandidate(
  candidate: PageCandidate,
  dependencies: PageAnalysisDependencies
): Promise<PageAnalysisResult> {
  const platform: CreatorPlatform = candidate.platform === 'tiktok' ? 'tiktok' : 'douyin'
  const base: PageAnalysisResult = {
    url: candidate.url,
    platform,
    is_creator_profile: false,
    confidence: candidate.confidence,
    reason: '',
    creator: null,
    inserted: false,
    analyzed_at: new Date().toISOString()
  }

  const apiBase = dependencies.getApiBase()
  if (!apiBase) {
    return { ...base, reason: '未配置服务端地址（api_base），无法进行 LLM 判定' }
  }

  let result: AnalyzePageApiResponse
  try {
    const response = await fetch(`${apiBase}/api/analyze-page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: candidate.platform,
        url: candidate.url,
        candidate: {
          isProfilePage: candidate.isProfilePage,
          confidence: candidate.confidence,
          extractedFields: candidate.extractedFields,
          signals: candidate.signals,
          rawSummary: candidate.rawSummary
        }
      })
    })
    if (!response.ok) throw new Error(`analyze-page HTTP ${response.status}`)
    result = await response.json()
  } catch (error: unknown) {
    console.error('[CreatorWorkbench] analyze-page request failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'network error'
    return { ...base, reason: `LLM 判定请求失败：${errorMessage}` }
  }

  const resultPlatform: CreatorPlatform = result.platform === 'tiktok' ? 'tiktok' : platform
  const analysis: PageAnalysisResult = {
    ...base,
    platform: resultPlatform,
    is_creator_profile: result.is_creator_profile,
    confidence: result.confidence ?? candidate.confidence,
    reason: result.reason || ''
  }

  const uid = result.normalized?.platform_uid || candidate.extractedFields.platform_uid
  if (result.is_creator_profile && result.normalized && uid) {
    const inserted = dependencies.addCreatorToPool(uid, {
      nickname: result.normalized.nickname,
      avatar_url: result.normalized.avatar_url,
      signature: result.normalized.signature,
      follower_count: result.normalized.follower_count,
      following_count: result.normalized.following_count,
      aweme_count: result.normalized.video_count,
      total_favorited: result.normalized.total_favorited,
      unique_id: uid,
      region: result.normalized.region
    }, 'profile', resultPlatform)
    dependencies.persistCreators()
    dependencies.persistStats()
    analysis.inserted = inserted
    analysis.creator = dependencies.findCreator(resultPlatform, uid)
    if (inserted) {
      dependencies.batchUploadToServer()
        .catch(error => console.error('[CreatorWorkbench] Batch upload error:', error))
    }
  }

  if (analysis.is_creator_profile && analysis.inserted) {
    void openExtensionPopup(candidate.url)
  }

  return analysis
}

/** Ask a tab to extract its current candidate, then run the supplied analyzer. */
export async function analyzePageInTab(
  requestedTabId: number | undefined,
  analyzeCandidate: AnalyzeCandidate
): Promise<AnalyzePageCommandResponse> {
  let tabId = requestedTabId || 0
  if (!tabId) {
    const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const activeTab = activeTabs[0]
    const activeUrl = activeTab?.url || ''
    const activeSupported = activeUrl.startsWith('https://www.douyin.com/')
      || activeUrl.startsWith('https://www.tiktok.com/')

    if (activeSupported) {
      tabId = activeTab?.id || 0
    } else {
      const supportedTabs = await chrome.tabs.query({
        currentWindow: true,
        url: SUPPORTED_PROFILE_URL_PATTERNS
      })
      supportedTabs.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
      tabId = supportedTabs[0]?.id || activeTab?.id || 0
    }
  }
  if (!tabId) return { success: false, error: '没有可用的活动标签页' }

  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'ANALYZE_PAGE' })
    const candidate = response?.candidate as PageCandidate | null
    if (!response?.success || !candidate) {
      return { success: false, error: response?.error || '当前页面不支持画像分析' }
    }
    if (!candidate.isProfilePage) {
      return { success: true, analysis: null, message: '当前页面未识别到达人画像' }
    }
    return { success: true, analysis: await analyzeCandidate(candidate) }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : '分析触发失败' }
  }
}
