/**
 * Creators store — manages creator pool state with Pinia.
 *
 * Supports both extension mode (chrome.runtime) and web mode (server API).
 */

import { defineStore } from 'pinia'
import type { Creator, CreatorListResponse, CreatorFilter } from '~/utils/extension-messaging'

export const useCreatorsStore = defineStore('creators', () => {
  // ─── State ────────────────────────────────────────────────────────

  const creators = ref<Creator[]>([])
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const filter = ref<CreatorFilter>({
    platform: null,
    keyword: null,
    min_followers: null,
    max_followers: null,
    source: null,
    status: null
  })

  // Stats
  const stats = ref({
    total: 0,
    bySource: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    followerBuckets: {} as Record<string, number>
  })

  // ─── Getters ──────────────────────────────────────────────────────

  const isExtension = computed(() => {
    return typeof chrome !== 'undefined' && !!chrome.runtime?.id
  })

  const hasMore = computed(() => creators.value.length < total.value)

  const filteredCreators = computed(() => creators.value)

  // ─── Actions ──────────────────────────────────────────────────────

  /**
   * Fetch creators from the store (extension or web mode).
   */
  async function fetchCreators(page = 1, append = false) {
    loading.value = true
    try {
      if (isExtension.value) {
        const response = await chrome.runtime.sendMessage({
          type: 'GET_CREATOR_LIST',
          params: {
            page,
            pageSize: pageSize.value,
            platform: filter.value.platform,
            keyword: filter.value.keyword,
            minFollowers: filter.value.min_followers,
            maxFollowers: filter.value.max_followers,
            source: filter.value.source,
            status: filter.value.status
          }
        })
        const data = response as CreatorListResponse
        if (append) {
          creators.value.push(...data.items)
        } else {
          creators.value = data.items
        }
        total.value = data.total
        currentPage.value = page
      } else {
        const data = await $fetch<CreatorListResponse>('/api/creators', {
          query: {
            page,
            pageSize: pageSize.value,
            platform: filter.value.platform || undefined,
            keyword: filter.value.keyword || undefined,
            minFollowers: filter.value.min_followers || undefined,
            maxFollowers: filter.value.max_followers || undefined,
            source: filter.value.source || undefined,
            status: filter.value.status || undefined
          }
        })
        if (append) {
          creators.value.push(...data.items)
        } else {
          creators.value = data.items
        }
        total.value = data.total
        currentPage.value = page
      }
    } catch (err) {
      console.error('[CreatorsStore] fetchCreators failed:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Load more creators (next page).
   */
  async function loadMore() {
    if (!hasMore.value || loading.value) return
    await fetchCreators(currentPage.value + 1, true)
  }

  /**
   * Apply filter and reload.
   */
  async function applyFilter(newFilter: Partial<CreatorFilter>) {
    filter.value = { ...filter.value, ...newFilter }
    await fetchCreators(1)
  }

  /**
   * Reset filter.
   */
  async function resetFilter() {
    filter.value = {
      platform: null,
      keyword: null,
      min_followers: null,
      max_followers: null,
      source: null,
      status: null
    }
    await fetchCreators(1)
  }

  /**
   * Fetch stats.
   */
  async function fetchStats() {
    try {
      if (isExtension.value) {
        const response = await chrome.runtime.sendMessage({ type: 'GET_CREATOR_STATS' })
        stats.value = {
          total: response.poolSize || 0,
          bySource: {},
          byStatus: {},
          followerBuckets: {}
        }
      } else {
        const data = await $fetch('/api/creators/stats')
        stats.value = data as any
      }
    } catch (err) {
      console.error('[CreatorsStore] fetchStats failed:', err)
    }
  }

  /**
   * Update creator status.
   */
  function updateCreatorStatus(id: string, status: Creator['status']) {
    const creator = creators.value.find(c => c.id === id)
    if (creator) {
      creator.status = status
      creator.updated_at = new Date().toISOString()
    }
  }

  /**
   * Clear all.
   */
  function clearAll() {
    creators.value = []
    total.value = 0
    currentPage.value = 1
  }

  async function deleteCreator(id: string): Promise<void> {
    if (!isExtension.value) throw new Error('达人删除仅在插件模式下可用')
    const result = await chrome.runtime.sendMessage({
      type: 'DELETE_CREATOR',
      params: { creatorId: id }
    })
    if (!result?.success) throw new Error(result?.error || '删除达人失败')
    creators.value = creators.value.filter(creator => creator.id !== id)
    total.value = Math.max(0, total.value - 1)
    await fetchStats()
  }

  return {
    // State
    creators,
    total,
    loading,
    currentPage,
    pageSize,
    filter,
    stats,
    // Getters
    isExtension,
    hasMore,
    filteredCreators,
    // Actions
    fetchCreators,
    loadMore,
    applyFilter,
    resetFilter,
    fetchStats,
    updateCreatorStatus,
    deleteCreator,
    clearAll
  }
})
