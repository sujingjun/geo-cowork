/**
 * Workbench store — unified dashboard state for conversation management.
 *
 * Tracks creator status transitions, outreach metrics, and
 * provides data for the dashboard visualizations.
 */

import { defineStore } from 'pinia'
import type { Creator } from '~/utils/extension-messaging'

export const useWorkbenchStore = defineStore('workbench', () => {
  // ─── State ────────────────────────────────────────────────────────

  const creators = ref<Creator[]>([])
  const loading = ref(false)

  // Dashboard time range
  const timeRange = ref<'7d' | '30d' | 'all'>('30d')

  // ─── Getters ──────────────────────────────────────────────────────

  const totalCreators = computed(() => creators.value.length)

  const statusBreakdown = computed(() => {
    const breakdown = {
      pending: 0,
      sent: 0,
      replied: 0,
      converted: 0,
      blocked: 0
    }
    for (const c of creators.value) {
      breakdown[c.status]++
    }
    return breakdown
  })

  const sourceBreakdown = computed(() => {
    const breakdown: Record<string, number> = {}
    for (const c of creators.value) {
      breakdown[c.source] = (breakdown[c.source] || 0) + 1
    }
    return breakdown
  })

  const followerBuckets = computed(() => {
    const buckets = {
      '0-1k': 0,
      '1k-10k': 0,
      '10k-100k': 0,
      '100k-1m': 0,
      '1m+': 0,
      unknown: 0
    }
    for (const c of creators.value) {
      const fc = c.follower_count
      if (fc == null) { buckets.unknown++; continue }
      if (fc < 1000) buckets['0-1k']++
      else if (fc < 10000) buckets['1k-10k']++
      else if (fc < 100000) buckets['10k-100k']++
      else if (fc < 1000000) buckets['100k-1m']++
      else buckets['1m+']++
    }
    return buckets
  })

  // Conversion funnel
  const funnel = computed(() => {
    const total = creators.value.length
    const sent = statusBreakdown.value.sent + statusBreakdown.value.replied + statusBreakdown.value.converted
    const replied = statusBreakdown.value.replied + statusBreakdown.value.converted
    const converted = statusBreakdown.value.converted

    return {
      total,
      sent,
      replied,
      converted,
      reachRate: total > 0 ? ((sent / total) * 100).toFixed(1) : '0',
      replyRate: sent > 0 ? ((replied / sent) * 100).toFixed(1) : '0',
      conversionRate: replied > 0 ? ((converted / replied) * 100).toFixed(1) : '0'
    }
  })

  // Recent activity (sorted by updated_at desc)
  const recentActivity = computed(() => {
    return [...creators.value]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 20)
  })

  // Creators needing follow-up (sent but no reply)
  const needsFollowUp = computed(() => {
    return creators.value.filter(c => c.status === 'sent')
  })

  // ─── Actions ──────────────────────────────────────────────────────

  async function fetchAll() {
    loading.value = true
    try {
      const isExtension = typeof chrome !== 'undefined' && !!chrome.runtime?.id
      if (isExtension) {
        const response = await chrome.runtime.sendMessage({
          type: 'GET_CREATOR_LIST',
          params: { page: 1, pageSize: 1000 }
        })
        creators.value = response?.items || []
      } else {
        const data = await $fetch('/api/creators', {
          query: { page: 1, pageSize: 1000 }
        })
        creators.value = (data as any)?.items || []
      }
    } catch (err) {
      console.error('[WorkbenchStore] fetchAll failed:', err)
    } finally {
      loading.value = false
    }
  }

  function updateStatus(id: string, status: Creator['status']) {
    const creator = creators.value.find(c => c.id === id)
    if (creator) {
      creator.status = status
      creator.updated_at = new Date().toISOString()
    }
  }

  return {
    creators,
    loading,
    timeRange,
    totalCreators,
    statusBreakdown,
    sourceBreakdown,
    followerBuckets,
    funnel,
    recentActivity,
    needsFollowUp,
    fetchAll,
    updateStatus
  }
})
