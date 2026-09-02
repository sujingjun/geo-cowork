function originPattern(value) {
  const url = new URL(value)
  return `${url.origin}/*`
}

function sameOrigin(left, right) {
  try {
    return new URL(left).origin === new URL(right).origin
  } catch {
    return false
  }
}

async function waitForTab(chromeApi, tabId, timeoutMs = 30_000) {
  const current = await chromeApi.tabs.get(tabId)
  if (current.status === 'complete') return current
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      chromeApi.tabs.onUpdated.removeListener(listener)
      reject(new Error('等待平台页面加载超时'))
    }, timeoutMs)
    function listener(updatedId, changeInfo, tab) {
      if (updatedId !== tabId || changeInfo.status !== 'complete') return
      clearTimeout(timer)
      chromeApi.tabs.onUpdated.removeListener(listener)
      resolve(tab)
    }
    chromeApi.tabs.onUpdated.addListener(listener)
  })
}

async function platformTab(chromeApi, entryUrl) {
  const [active] = await chromeApi.tabs.query({ active: true, currentWindow: true })
  if (active?.id && sameOrigin(active.url, entryUrl)) return active
  return chromeApi.tabs.create({ url: entryUrl, active: true })
}

export async function performPlatformQuery(queryText, selectors) {
  let stage = 'pre_submit'
  try {
    const input = document.querySelector(selectors.input)
    if (!input) throw new Error(`找不到输入框: ${selectors.input}`)
    const beforeCount = document.querySelectorAll(selectors.answer).length
    input.focus()
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      const prototype = input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
      if (setter) setter.call(input, queryText)
      else input.value = queryText
    } else if (input.isContentEditable) {
      input.textContent = queryText
    } else {
      throw new Error('平台输入框不是可编辑元素')
    }
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText',
      data: queryText
    }))
    input.dispatchEvent(new Event('change', { bubbles: true }))

    const submit = document.querySelector(selectors.submit)
    if (!submit || submit.disabled) throw new Error(`提交按钮不可用: ${selectors.submit}`)
    submit.click()
    stage = 'submitted'

    const timeoutAt = Date.now() + selectors.timeout_ms
    let lastText = ''
    let stableSince = Date.now()
    while (Date.now() < timeoutAt) {
      const answers = [...document.querySelectorAll(selectors.answer)]
      const answer = answers.at(-1)
      const text = answer?.innerText?.trim() || ''
      const busy = selectors.busy ? Boolean(document.querySelector(selectors.busy)) : false
      if (answers.length > beforeCount && text && text === lastText && !busy
        && Date.now() - stableSince >= selectors.stable_ms) {
        const citations = [...answer.querySelectorAll(selectors.citation)]
          .filter(link => link.href)
          .map(link => ({
            url: link.href,
            title: link.textContent?.trim() || '',
            context: link.closest('p, li, blockquote')?.textContent?.trim() || ''
          }))
        return {
          ok: true,
          answer_text: text,
          citations,
          result_url: location.href
        }
      }
      if (text !== lastText) {
        lastText = text
        stableSince = Date.now()
      }
      await new Promise(resolve => setTimeout(resolve, 250))
    }
    throw new Error('等待模型回复完成超时')
  } catch (error) {
    return {
      ok: false,
      stage,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export function requestPlatformPermission(chromeApi, platform) {
  if (platform.execution_mode !== 'dom_automation' || platform.policy?.status !== 'allowed') {
    throw new Error('当前平台未获 DOM 自动化许可')
  }
  const entry = new URL(platform.entry_url)
  if (entry.protocol === 'http:' && entry.hostname === '127.0.0.1') return Promise.resolve(true)
  const origins = [originPattern(platform.entry_url)]
  return chromeApi.permissions.request({ origins }).then((granted) => {
    if (!granted) throw new Error('未授予当前平台页面权限')
    return true
  })
}

export async function runAutomatedPlatformQuery(chromeApi, platform, queryText) {
  if (platform.execution_mode !== 'dom_automation' || platform.policy?.status !== 'allowed') {
    throw new Error('当前平台未获 DOM 自动化许可')
  }
  const tab = await platformTab(chromeApi, platform.entry_url)
  if (!tab.id) throw new Error('无法取得平台标签页 ID')
  await waitForTab(chromeApi, tab.id)
  let result
  try {
    const execution = await chromeApi.scripting.executeScript({
      target: { tabId: tab.id },
      func: performPlatformQuery,
      args: [queryText, platform.selectors]
    })
    result = execution[0]?.result
  } catch (cause) {
    const error = new Error(cause instanceof Error ? cause.message : String(cause))
    error.stage = 'unknown'
    throw error
  }
  if (result?.ok === false) {
    const error = new Error(result.error || '平台执行失败')
    error.stage = result.stage
    throw error
  }
  if (!result?.answer_text || !result?.result_url) {
    const error = new Error('平台没有返回完整回答')
    error.stage = 'unknown'
    throw error
  }
  return result
}

export async function openManualPlatform(chromeApi, entryUrl, queryText, clipboard = navigator.clipboard) {
  await clipboard.writeText(queryText)
  const tab = await platformTab(chromeApi, entryUrl)
  if (tab.id) await chromeApi.tabs.update(tab.id, { active: true })
  return tab
}
