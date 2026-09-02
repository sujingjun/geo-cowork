/**
 * Outreach store — manages message templates and DM sending tasks.
 */

import { defineStore } from 'pinia'
import type { DmRecipient, MessageTemplate, OutreachTask } from '~/utils/extension-messaging'

export const useOutreachStore = defineStore('outreach', () => {
  // ─── State ────────────────────────────────────────────────────────

  const templates = ref<MessageTemplate[]>([
    {
      id: 'tpl-1',
      name: '新品种草-默认',
      content: '{{昵称}}你好！我注意到你在{{领域}}领域的优质内容，特别喜欢你最近的作品。我们有一款新品非常适合你的风格，想邀请你体验种草。有兴趣了解详情吗？',
      variables: ['昵称', '领域'],
      send_count: 0,
      reply_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'tpl-2',
      name: '合作邀请-友好',
      content: '{{昵称}}你好！我是品牌方，一直在关注你的账号。你的内容质量和粉丝互动都非常好，想和你聊一个合作机会。方便详细沟通吗？',
      variables: ['昵称'],
      send_count: 0,
      reply_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ])

  const tasks = ref<OutreachTask[]>([])
  const sending = ref(false)
  const sendProgress = ref({ current: 0, total: 0 })
  const lastBatchResult = ref<{
    processed: number
    sent: number
    failed: number
    rateLimited: boolean
  } | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────

  const isExtension = computed(() => typeof chrome !== 'undefined' && !!chrome.runtime?.id)

  const templateStats = computed(() => {
    return templates.value.map(t => ({
      ...t,
      replyRate: t.send_count > 0 ? (t.reply_count / t.send_count * 100).toFixed(1) + '%' : '0%'
    }))
  })

  // ─── Actions ──────────────────────────────────────────────────────

  /**
   * Create a new template.
   */
  function createTemplate(name: string, content: string): MessageTemplate {
    const variables = extractVariables(content)
    const template: MessageTemplate = {
      id: `tpl-${Date.now()}`,
      name,
      content,
      variables,
      send_count: 0,
      reply_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    templates.value.push(template)
    return template
  }

  /**
   * Update an existing template.
   */
  function updateTemplate(id: string, updates: Partial<MessageTemplate>) {
    const template = templates.value.find(t => t.id === id)
    if (template) {
      Object.assign(template, updates, { updated_at: new Date().toISOString() })
      if (updates.content) {
        template.variables = extractVariables(updates.content)
      }
    }
  }

  /**
   * Delete a template.
   */
  function deleteTemplate(id: string) {
    templates.value = templates.value.filter(t => t.id !== id)
  }

  /**
   * Replace variables in a template with creator data.
   */
  function renderTemplate(content: string, creator: Record<string, unknown>): string {
    return content.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = creator[key]
      return value != null ? String(value) : `{{${key}}}`
    })
  }

  /**
   * Send a DM to a single creator.
   */
  async function sendDm(recipient: DmRecipient, message: string): Promise<{ success: boolean; error?: string }> {
    if (isExtension.value) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({
          type: 'SEND_DM',
          params: { ...recipient, message }
        }, (response) => {
          resolve(response || { success: false, error: 'No response' })
        })
      })
    }

    // Web mode: call server API
    try {
      await $fetch('/api/outreach/send', {
        method: 'POST',
        body: { ...recipient, message }
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  /**
   * Send DMs to a batch of creators.
   */
  async function sendBatch(
    creators: DmRecipient[],
    message: string,
    templateId?: string
  ): Promise<void> {
    sending.value = true
    sendProgress.value = { current: 0, total: creators.length }

    try {
      if (isExtension.value) {
        const result = await new Promise<any>((resolve) => {
          chrome.runtime.sendMessage({
            type: 'SEND_DM_BATCH',
            params: {
              creators,
              message,
              delayBetweenSends: 2000,
              openInBackground: true
            }
          }, (response) => resolve(response))
        })

        lastBatchResult.value = {
          processed: result?.processed || 0,
          sent: result?.sent || 0,
          failed: result?.failed || 0,
          rateLimited: result?.rateLimited || false
        }

        // Update template stats
        if (templateId) {
          const template = templates.value.find(t => t.id === templateId)
          if (template) {
            template.send_count += result?.sent || 0
          }
        }
      } else {
        // Web mode: send one by one
        let sent = 0
        let failed = 0
        for (let i = 0; i < creators.length; i++) {
          sendProgress.value = { current: i + 1, total: creators.length }
          const result = await sendDm(creators[i]!, message)
          if (result.success) sent++
          else failed++
        }
        lastBatchResult.value = { processed: sent + failed, sent, failed, rateLimited: false }
      }
    } finally {
      sending.value = false
    }
  }

  /**
   * Extract variable names from template content.
   */
  function extractVariables(content: string): string[] {
    const matches = content.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))]
  }

  return {
    templates,
    tasks,
    sending,
    sendProgress,
    lastBatchResult,
    isExtension,
    templateStats,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    renderTemplate,
    sendDm,
    sendBatch
  }
})
