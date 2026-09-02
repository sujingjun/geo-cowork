/**
 * DM sending flow and rate-limit detection for background.ts.
 *
 * Page actions are executed via chrome.scripting.executeScript
 * in the context of the target tab.
 *
 * Flow:
 *   1. Open creator profile page
 *   2. Wait for page to load
 *   3. Click "私信" (DM) button
 *   4. Wait for message input to appear
 *   5. Paste message content
 *   6. Click send button
 *   7. Detect rate-limit keywords
 *   8. If rate-limited, stop batch and signal account switch
 */

import type { DmRecipient } from '../shared/types/creator-platform'
import { DOUYIN_RATE_LIMIT_KEYWORDS, getDmPlatformConfig } from './dm-sender.constants'

export { getDmPlatformConfig } from './dm-sender.constants'

// ─── Rate limit keywords ─────────────────────────────────────────────

export const RATE_LIMIT_KEYWORDS = [
  ...DOUYIN_RATE_LIMIT_KEYWORDS
]

// ─── DM sending result ───────────────────────────────────────────────

export interface DmSendResult {
  success: boolean
  prepared?: boolean
  limited?: boolean
  error?: string
  keyword?: string
}

function sanitizeRecipientId(recipientId: string): string {
  return String(recipientId || '').trim().replace(/^@/, '')
}

export function buildDmProfileUrl(recipient: DmRecipient): string {
  const recipientId = sanitizeRecipientId(recipient.recipientId)
  return recipient.platform === 'tiktok'
    ? `https://www.tiktok.com/@${encodeURIComponent(recipientId)}`
    : `https://www.douyin.com/user/${encodeURIComponent(recipientId)}`
}

// ─── Page action functions (executed in page context) ────────────────

/**
 * Click the "私信" (DM) button on the creator profile page.
 * Must be a plain function — it gets serialized and injected.
 */
function pageAction_clickDmButton(labels: string[]) {
  const normalize = (value: string | null | undefined) => (value || '').replace(/\s+/g, ' ').trim().toLowerCase()
  const labelsNormalized = labels.map((label) => normalize(label))
  const isMessageLabel = (value: string) => {
    const normalized = normalize(value)
    return labelsNormalized.some((label) =>
      normalized === label || normalized.startsWith(`${label} `) || normalized.includes(label)
    )
  }

  const errorPage = document.querySelector('[data-e2e="error-page"]')
  if (errorPage) {
    const errorText = (errorPage.innerText || errorPage.textContent || '').replace(/\s+/g, ' ').trim()
    const unavailableKeywords = ['用户不存在', '账号已封禁', '帐号已封禁', '该用户已被封禁', '该账号已被封禁', '用户已封禁']
    const hitKeyword = unavailableKeywords.find((kw) => errorText.includes(kw))
    return {
      success: false,
      error: hitKeyword ? `用户不可访问: ${hitKeyword}` : `用户主页异常: ${errorText || '未知异常'}`,
      unavailable: true
    }
  }

  const button = Array.from(document.querySelectorAll<HTMLElement>('button, [role="button"], a'))
    .find((element) => {
      if (element.offsetParent === null) return false
      const text = element.innerText || element.textContent || ''
      const label = element.getAttribute('aria-label') || element.getAttribute('title') || ''
      return isMessageLabel(text) || isMessageLabel(label)
    })

  if (!button) {
    return { success: false, error: '未找到私信按钮' }
  }

  if (button.getAttribute('aria-disabled') === 'true' || (button as HTMLButtonElement).disabled) {
    return { success: false, error: '私信按钮已禁用' }
  }

  button.click()
  return { success: true }
}

/**
 * Check if the message input is available.
 */
function pageAction_hasMessageInput(inputSelectors: string[]) {
  for (const selector of inputSelectors) {
    const found = document.querySelector(selector) as HTMLElement | null
    if (found && found.offsetParent !== null) {
      return { success: true, found: true }
    }
  }

  return { success: true, found: false }
}

/**
 * Type and send a message.
 */
function pageAction_sendMessage(
  message: string,
  inputSelectors: string[],
  sendWithEnter: boolean,
  delayAfterType = 500
) {
  function setContentEditableText(input: HTMLElement, nextMessage: string) {
    input.focus()
    const finalText = String(nextMessage || '')

    if (typeof (input as HTMLInputElement).value === 'string') {
      const inputEl = input as HTMLInputElement
      inputEl.value = finalText
      inputEl.dispatchEvent(new Event('input', { bubbles: true }))
      inputEl.dispatchEvent(new Event('change', { bubbles: true }))
      return
    }

    try {
      const doc = input.ownerDocument
      doc?.execCommand?.('selectAll')
      doc?.execCommand?.('delete')
      doc?.execCommand?.('insertText', false, finalText)
      if ((input.textContent || '') === finalText) {
        return
      }
    } catch (_) {
      // Fallback to direct textContent assignment below.
    }

    input.textContent = finalText
    input.dispatchEvent(new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: finalText,
      inputType: 'insertFromPaste'
    }))
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      data: finalText,
      inputType: 'insertFromPaste'
    }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  return new Promise((resolve) => {
    let input: HTMLElement | null = null
    for (const selector of inputSelectors) {
      const found = document.querySelector(selector) as HTMLElement | null
      if (found && found.offsetParent !== null) {
        input = found
        break
      }
    }

    if (!input) {
      resolve({ success: false, error: '未找到消息输入框' })
      return
    }

    try {
      setContentEditableText(input, message)
    } catch (e: any) {
      resolve({ success: false, error: '粘贴失败: ' + e.message })
      return
    }

    // Wait then click send
    setTimeout(() => {
      if (sendWithEnter) {
        const eventInit = {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        }
        input.dispatchEvent(new KeyboardEvent('keypress', eventInit))
        input.dispatchEvent(new KeyboardEvent('keydown', eventInit))
        input.dispatchEvent(new KeyboardEvent('keyup', eventInit))
        resolve({ success: true })
        return
      }

      const sendBtn = document.querySelector('.e2e-send-msg-btn') as HTMLElement | null
      if (sendBtn) {
        const clickable = sendBtn.closest('button, span[role="button"], div[role="button"]') || sendBtn
        if (clickable.offsetParent !== null) {
          clickable.click()
          resolve({ success: true })
          return
        }
      }

      // Fallback: find button with specific SVG path
      const allButtons = document.querySelectorAll('button, span[class*="send"]')
      for (const btn of Array.from(allButtons)) {
        const svg = btn.querySelector('svg')
        if (svg) {
          const path = svg.querySelector('path[d*="M17.5"]')
          if (path && (btn as HTMLElement).offsetParent !== null) {
            btn.click()
            resolve({ success: true })
            return
          }
        }
      }

      resolve({ success: false, error: '未找到发送按钮' })
    }, delayAfterType)
  })
}

/**
 * Detect rate-limit message on the page.
 */
function pageAction_detectRateLimit(keywords: string[]) {
  try {
    const list = Array.isArray(keywords) ? keywords : [keywords]
    const container = document.querySelector('#messageContent') || document.body

    const mainText = (container.innerText || container.textContent || '').trim()
    const containerHit = list.find((kw) => mainText && mainText.includes(kw))
    if (containerHit) {
      return { success: true, limited: true, hit: 'container-text', keyword: containerHit }
    }

    const nodes = Array.from(container.querySelectorAll('div, span, p, pre'))
    const hitNode = nodes.find((el) => {
      const txt = (el.textContent || '').trim()
      return txt && list.some((kw) => txt.includes(kw))
    })
    if (hitNode) {
      const nodeKeyword = list.find((kw) => (hitNode.textContent || '').trim().includes(kw))
      return { success: true, limited: true, hit: 'node-text', keyword: nodeKeyword }
    }

    return { success: true, limited: false }
  } catch (error: any) {
    return { success: false, error: error.message, limited: false }
  }
}

// ─── Helper: execute function in tab ─────────────────────────────────

async function executeInTab<T = any>(
  tabId: number,
  func: (...args: any[]) => any,
  args: any[] = []
): Promise<T> {
  try {
    const results = await chrome.scripting.executeScript({ target: { tabId }, func, args, world: 'MAIN' })
    return (results?.[0]?.result as T) || ({ success: false, error: 'No result' } as any)
  } catch (error: any) {
    return { success: false, error: error?.message || 'executeScript failed' } as any
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Main DM sending flow ────────────────────────────────────────────

/**
 * Send a DM to a single creator.
 *
 * @param recipient - Platform-qualified recipient
 * @param message - Message content to send
 * @param options - Optional configuration
 * @returns DmSendResult
 */
export async function sendDmToCreator(
  recipient: DmRecipient,
  message: string,
  options: { openInBackground?: boolean; keepTabOpen?: boolean; dryRun?: boolean } = {}
): Promise<DmSendResult> {
  if (!recipient.recipientId) {
    return { success: false, error: '缺少平台收件人标识' }
  }
  const config = getDmPlatformConfig(recipient.platform)
  const url = buildDmProfileUrl(recipient)

  // Step 1: Open creator profile page
  const tab = await chrome.tabs.create({ url, active: !options.openInBackground })

  if (!tab.id) {
    return { success: false, error: '打开发送页失败' }
  }

  const sendTabId = tab.id

  try {
    // Step 2: Wait for page to load
    await delay(3000)

    // Step 3: Click DM button (retry up to 5 times)
    let inputReady = false
    let lastClickError = ''

    for (let attempt = 0; attempt < 5; attempt++) {
      const clickResult = await executeInTab(sendTabId, pageAction_clickDmButton, [config.messageButtonLabels])
      if (!clickResult.success) {
        lastClickError = clickResult.error || '点击私信按钮失败'
        if (attempt === 4) break
        await delay(800)
        continue
      }

      // Step 4: Check if message input is available
      for (let checkAttempt = 0; checkAttempt < 5; checkAttempt++) {
        await delay(500)
        const inputCheck = await executeInTab(sendTabId, pageAction_hasMessageInput, [config.inputSelectors])
        if (inputCheck.found) {
          inputReady = true
          break
        }
      }
      if (inputReady) break
    }

    if (!inputReady) {
      return { success: false, error: lastClickError || '私信输入框未准备好' }
    }

    if (options.dryRun) {
      return { success: true, prepared: true }
    }

    // Step 5: Send message
    await delay(500)
    const sendResult = await executeInTab(sendTabId, pageAction_sendMessage, [
      message,
      config.inputSelectors,
      config.sendWithEnter,
      500
    ])
    if (!sendResult.success) {
      return { success: false, error: sendResult.error || '发送消息失败' }
    }

    // Step 6: Detect rate-limit (check up to 8 times)
    for (let attempt = 0; attempt < 8; attempt++) {
      await delay(250)
      const detectResult = await executeInTab(sendTabId, pageAction_detectRateLimit, [config.rateLimitKeywords])
      if (detectResult.limited) {
        return {
          success: false,
          limited: true,
          error: `检测到限频: ${detectResult.keyword}`,
          keyword: detectResult.keyword
        }
      }
    }

    return { success: true }
  } finally {
    if (!options.keepTabOpen && sendTabId) {
      chrome.tabs.remove(sendTabId).catch(() => {})
    }
  }
}

/**
 * Send DMs to a batch of creators.
 *
 * @param creators - Platform-qualified recipients
 * @param message - Message content (with variables already replaced)
 * @param options - Batch configuration
 * @returns Batch result summary
 */
export async function sendDmBatch(
  creators: DmRecipient[],
  message: string,
  options: {
    batchSize?: number
    delayBetweenSends?: number
    onProgress?: (current: number, total: number, result: DmSendResult) => void
    openInBackground?: boolean
    keepTabOpen?: boolean
    dryRun?: boolean
  } = {}
): Promise<{
  processed: number
  sent: number
  failed: number
  rateLimited: boolean
  results: Array<{ recipient: DmRecipient; result: DmSendResult }>
}> {
  const total = creators.length
  const delayMs = options.delayBetweenSends ?? 2000
  let sent = 0
  let failed = 0
  let rateLimited = false
  const results: Array<{ recipient: DmRecipient; result: DmSendResult }> = []

  for (let i = 0; i < total; i++) {
    const creator = creators[i]!
    const result = await sendDmToCreator(creator, message, {
      openInBackground: options.openInBackground,
      keepTabOpen: options.keepTabOpen,
      dryRun: options.dryRun
    })

    results.push({ recipient: creator, result })

    if (result.success) {
      sent++
    } else {
      failed++
      if (result.limited) {
        rateLimited = true
        break // Stop batch on rate-limit
      }
    }

    options.onProgress?.(i + 1, total, result)

    // Delay between sends (skip after last)
    if (i < total - 1) {
      await delay(delayMs)
    }
  }

  return {
    processed: sent + failed,
    sent,
    failed,
    rateLimited,
    results
  }
}
