/**
 * useExtensionBridge — wraps chrome.runtime messaging for the Nuxt app.
 *
 * In extension mode: communicates with background.ts via chrome.runtime.sendMessage.
 * In web mode: falls back to Nuxt server API routes ($fetch).
 */

/// <reference types="@types/chrome" />

import type {
  AnalyzePageResponse,
  AnalyzeTikTokCommentsResponse,
  CreatorListResponse,
  CreatorFilter,
  PageAnalysisResult,
  TikTokCreatorInsightsResponse
} from '~/utils/extension-messaging'

export function useExtensionBridge() {
  const isExtension = computed(() => {
    return typeof chrome !== 'undefined' && !!chrome.runtime?.id
  })

  /**
   * Send a message to the background service worker.
   * Returns a Promise that resolves with the response.
   */
  function sendMessage<T = unknown>(message: Record<string, unknown>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!isExtension.value) {
        reject(new Error('Not in extension environment'))
        return
      }

      chrome.runtime.sendMessage(message, (response: T) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || 'sendMessage failed'))
          return
        }
        resolve(response)
      })
    })
  }

  /**
   * Ping the extension to check connectivity.
   */
  async function ping(): Promise<{ pong: boolean; version: string; creators: number }> {
    if (isExtension.value) {
      return sendMessage({ type: 'PING' })
    }
    // Web mode: return mock
    return { pong: true, version: 'web', creators: 0 }
  }

  /**
   * Get the creator list (with pagination).
   * Extension mode: chrome.runtime → background.ts
   * Web mode: /api/creators
   */
  async function getCreators(filter: CreatorFilter = {}): Promise<CreatorListResponse> {
    if (isExtension.value) {
      return sendMessage({
        type: 'GET_CREATOR_LIST',
        params: {
          page: filter.page || 1,
          pageSize: filter.pageSize || 20,
          platform: filter.platform || null,
          keyword: filter.keyword || null,
          minFollowers: filter.min_followers,
          maxFollowers: filter.max_followers,
          source: filter.source,
          status: filter.status
        }
      })
    }

    // Web mode fallback
    return $fetch<CreatorListResponse>('/api/creators', {
      query: {
        page: filter.page || 1,
        pageSize: filter.pageSize || 20,
        platform: filter.platform || undefined,
        keyword: filter.keyword || undefined,
        minFollowers: filter.min_followers || undefined,
        maxFollowers: filter.max_followers || undefined,
        source: filter.source || undefined,
        status: filter.status || undefined
      }
    })
  }

  /**
   * Search for creators (triggers the search flow in background).
   */
  async function searchCreators(params: Record<string, unknown>): Promise<unknown> {
    if (isExtension.value) {
      return sendMessage({ type: 'SEARCH_CREATORS', params })
    }
    return $fetch('/api/creators/search', { method: 'POST', body: params })
  }

  /**
   * Open a video so the injected interceptor can collect comment users.
   */
  async function crawlComments(params: Record<string, unknown>): Promise<unknown> {
    if (isExtension.value) {
      return sendMessage({ type: 'CRAWL_COMMENTS', params })
    }
    return {
      success: false,
      status: 'extension_required',
      message: '评论抓取需要在 Chrome 插件模式下执行'
    }
  }

  /**
   * Read a creator profile from the active extension pool.
   */
  async function getCreatorProfile(params: Record<string, unknown>): Promise<unknown> {
    if (isExtension.value) {
      return sendMessage({ type: 'GET_CREATOR_PROFILE', params })
    }
    const data = await $fetch<CreatorListResponse>('/api/creators', {
      query: {
        platform: params.platform,
        keyword: String(params.recipientId || params.secUid || ''),
        page: 1,
        pageSize: 1
      }
    })
    const profile = data.items[0]
    return profile
      ? { found: true, profile, message: `已找到达人 ${profile.nickname || profile.sec_uid}` }
      : { found: false, message: `未找到平台标识为 ${String(params.recipientId || params.secUid || '')} 的达人` }
  }

  /**
   * Send a DM to a creator.
   */
  async function sendDm(params: Record<string, unknown>): Promise<unknown> {
    if (isExtension.value) {
      const platform = params.platform === 'tiktok' ? 'tiktok' : 'douyin'
      return sendMessage({
        type: 'SEND_DM',
        params: {
          ...params,
          platform,
          recipientId: params.recipientId
            || (platform === 'tiktok' ? params.platform_uid : params.sec_uid || params.secUid)
        }
      })
    }
    return {
      success: false,
      status: 'extension_required',
      message: '私信发送需要在 Chrome 插件模式下执行'
    }
  }

  /**
   * Check outreach status.
   */
  async function checkOutreachStatus(params: Record<string, unknown> = {}): Promise<unknown> {
    if (isExtension.value) {
      return sendMessage({ type: 'CHECK_OUTREACH_STATUS', params })
    }
    return $fetch('/api/creators', {
      query: {
        status: params.status,
        page: params.page || 1,
        pageSize: params.pageSize || 20
      }
    })
  }

  /**
   * Open the workbench page in a new tab.
   */
  function openWorkbench() {
    if (isExtension.value) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html#/workbench') })
    } else {
      window.open('/workbench', '_blank')
    }
  }

  /**
   * Get the most recent page-analysis result recorded by the background.
   */
  async function getLastAnalysis(): Promise<{ analysis: PageAnalysisResult | null }> {
    if (isExtension.value) {
      return sendMessage({ type: 'GET_LAST_ANALYSIS' })
    }
    return { analysis: null }
  }

  /**
   * Explicitly trigger page analysis on a tab (defaults to the active tab).
   */
  async function analyzePage(params: Record<string, unknown> = {}): Promise<AnalyzePageResponse | Record<string, unknown>> {
    if (isExtension.value) {
      const recent = await getLastAnalysis()
      if (recent.analysis) {
        const creator = recent.analysis.creator
        return {
          success: true,
          analysis: recent.analysis,
          message: recent.analysis.is_creator_profile
            ? `最近识别到达人 ${creator?.nickname || creator?.platform_uid || '未知'}`
            : recent.analysis.reason || '最近页面未识别到达人画像'
        }
      }
      return sendMessage({ type: 'ANALYZE_PAGE', params })
    }
    if (typeof params.htmlSnippet === 'string' && params.htmlSnippet) {
      return $fetch('/api/analyze-page', {
        method: 'POST',
        body: {
          platform: 'tiktok',
          url: params.url || '(pasted-snippet)',
          candidate: {
            isProfilePage: true,
            confidence: 0.5,
            extractedFields: {},
            signals: [{ type: 'dom_selector', name: 'pasted_html', confidence: 0.5 }],
            rawSummary: params.htmlSnippet.slice(0, 4000)
          }
        }
      })
    }
    return { success: false, error: '页面分析功能在插件模式下可用' }
  }

  async function getTikTokCreatorInsights(creatorId: string): Promise<TikTokCreatorInsightsResponse> {
    if (!isExtension.value) return { found: false, error: 'TikTok 洞察仅在插件模式下可用' }
    return sendMessage({
      type: 'GET_TIKTOK_CREATOR_INSIGHTS',
      params: { creatorId }
    })
  }

  async function analyzeTikTokComments(creatorId: string): Promise<AnalyzeTikTokCommentsResponse> {
    if (!isExtension.value) return { success: false, error: 'TikTok 评论分析仅在插件模式下可用' }
    return sendMessage({
      type: 'ANALYZE_TIKTOK_COMMENTS',
      params: { creatorId }
    })
  }

  async function deleteCreator(creatorId: string): Promise<{ success: boolean, error?: string }> {
    if (!isExtension.value) return { success: false, error: '达人删除仅在插件模式下可用' }
    return sendMessage({
      type: 'DELETE_CREATOR',
      params: { creatorId }
    })
  }

  async function getAgentApiBase(): Promise<unknown> {
    if (!isExtension.value) return ''
    const stored = await chrome.storage.local.get('api_base')
    return stored.api_base
  }

  return {
    isExtension,
    sendMessage,
    ping,
    getCreators,
    searchCreators,
    crawlComments,
    getCreatorProfile,
    sendDm,
    checkOutreachStatus,
    openWorkbench,
    getLastAnalysis,
    analyzePage,
    getTikTokCreatorInsights,
    analyzeTikTokComments,
    deleteCreator,
    getAgentApiBase
  }
}
