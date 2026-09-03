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

export async function waitForPlatformTab(chromeApi, tabId, timeoutMs = 30_000) {
  const current = await chromeApi.tabs.get(tabId)
  if (current.status === 'complete') return current
  return new Promise((resolve, reject) => {
    let settled = false
    function finish(value, error) {
      if (settled) return
      settled = true
      clearTimeout(timer)
      clearInterval(poll)
      chromeApi.tabs.onUpdated.removeListener(listener)
      if (error) reject(error)
      else resolve(value)
    }
    const timer = setTimeout(() => {
      finish(null, new Error('等待平台页面加载超时'))
    }, timeoutMs)
    function listener(updatedId, changeInfo, tab) {
      if (updatedId !== tabId || changeInfo.status !== 'complete') return
      finish(tab)
    }
    chromeApi.tabs.onUpdated.addListener(listener)
    const checkCurrent = () => chromeApi.tabs.get(tabId).then((tab) => {
      if (tab.status === 'complete') finish(tab)
    }, error => finish(null, error))
    const poll = setInterval(checkCurrent, 50)
    checkCurrent()
  })
}

function runnerError(message, stage, details = {}) {
  const error = new Error(message)
  error.stage = stage
  Object.assign(error, details)
  return error
}

export function inspectPlatformLogin(selectors) {
  if (selectors.loggedOut && document.querySelector(selectors.loggedOut)) {
    return { login_state: 'logged_out' }
  }
  if (selectors.loggedIn && document.querySelector(selectors.loggedIn)) {
    return { login_state: 'logged_in' }
  }
  return { login_state: 'unknown' }
}

export function submitPlatformQuery(queryText, selectors) {
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
    return { ok: true, stage, before_count: beforeCount }
  } catch (error) {
    return { ok: false, stage, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function capturePlatformAnswer(selectors, beforeCount) {
  const timeoutMs = selectors.timeoutMs ?? selectors.timeout_ms
  const stableMs = selectors.stableMs ?? selectors.stable_ms
  const timeoutAt = Date.now() + timeoutMs
  let lastText = ''
  let stableSince = Date.now()
  while (Date.now() < timeoutAt) {
    const answers = [...document.querySelectorAll(selectors.answer)]
    const answer = answers.at(-1)
    const text = (answer?.innerText || answer?.textContent || '').trim()
    const busy = selectors.busy ? Boolean(document.querySelector(selectors.busy)) : false
    if (answers.length > beforeCount && text && text === lastText && !busy
      && Date.now() - stableSince >= stableMs) {
      const citations = [...answer.querySelectorAll(selectors.citation)]
        .filter(link => link.href)
        .map((link, index) => {
          const raw = link.getAttribute('href') || link.href
          const normalized = new URL(link.href)
          normalized.hash = ''
          return {
            ordinal: index + 1,
            href_raw: raw,
            href_normalized: normalized.toString(),
            title: link.textContent?.trim() || '',
            anchor_or_context: link.closest('p, li, blockquote')?.textContent?.trim() || ''
          }
        })
      return {
        ok: true,
        answer_html: answer.outerHTML,
        answer_text: text,
        citations,
        result_url: location.href,
        detector_diagnostics: {
          answer_count_before: beforeCount,
          answer_count_after: answers.length,
          busy_present: busy,
          stable_ms: stableMs
        }
      }
    }
    if (text !== lastText) {
      lastText = text
      stableSince = Date.now()
    }
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  return { ok: false, stage: 'submitted', error: '等待模型回复完成超时' }
}

export function requestPlatformPermission(chromeApi, platform) {
  if (platform.execution_mode !== 'dom_automation'
    || (platform.policy_status ?? platform.policy?.status) !== 'allowed') {
    throw new Error('当前平台未获 DOM 自动化许可')
  }
  const entry = new URL(platform.entry_url)
  if (entry.protocol === 'http:' && entry.hostname === '127.0.0.1') return Promise.resolve(true)
  return chromeApi.permissions.request({ origins: [originPattern(platform.entry_url)] }).then((granted) => {
    if (!granted) throw new Error('未授予当前平台页面权限')
    return true
  })
}

export async function checkPreparedPlatformLogin(chromeApi, platform, checkpoint) {
  const tab = await chromeApi.tabs.get(checkpoint.tab_id)
  if (tab.url && !sameOrigin(tab.url, platform.entry_url)) {
    throw runnerError('恢复标签页已离开目标平台', 'checking_login')
  }
  await waitForPlatformTab(chromeApi, checkpoint.tab_id)
  const execution = await chromeApi.scripting.executeScript({
    target: { tabId: checkpoint.tab_id },
    func: inspectPlatformLogin,
    args: [platform.selectors]
  })
  return {
    ...checkpoint,
    login_state: execution[0]?.result?.login_state || 'unknown',
    updated_at: new Date().toISOString()
  }
}

export async function prepareAutomatedPlatformQuery(chromeApi, platform) {
  if (platform.execution_mode !== 'dom_automation'
    || (platform.policy_status ?? platform.policy?.status) !== 'allowed') {
    throw new Error('当前平台未获 DOM 自动化许可')
  }
  const tab = await chromeApi.tabs.create({ url: platform.entry_url, active: true })
  if (!tab.id) throw new Error('无法取得平台标签页 ID')
  await waitForPlatformTab(chromeApi, tab.id)
  return checkPreparedPlatformLogin(chromeApi, platform, {
    schema_version: 'geo-browser-extension-checkpoint-v1',
    tab_id: tab.id,
    entry_url: platform.entry_url,
    conversation_state: 'new',
    conversation_proof: {
      kind: 'fresh_tab_entry',
      url: platform.entry_url,
      opened_at: new Date().toISOString()
    },
    stage: 'checking_login',
    updated_at: new Date().toISOString()
  })
}

export async function capturePreparedPlatformResult(chromeApi, platform, checkpoint) {
  if (!Number.isInteger(checkpoint.before_count) || checkpoint.before_count < 0) {
    throw runnerError('恢复 checkpoint 缺少提交前回答计数', 'submitted')
  }
  const captured = await chromeApi.scripting.executeScript({
    target: { tabId: checkpoint.tab_id },
    func: capturePlatformAnswer,
    args: [platform.selectors, checkpoint.before_count]
  })
  const result = captured[0]?.result
  if (!result?.ok) throw runnerError(result?.error || '平台没有返回完整回答', result?.stage || 'submitted')
  if (!result.answer_html || !result.answer_text || !result.result_url) {
    throw runnerError('平台没有返回完整回答', 'submitted')
  }
  const capture = { ...result }
  delete capture.ok
  return capture
}

export async function runAutomatedPlatformQuery(
  chromeApi,
  platform,
  queryText,
  checkpoint,
  callbacks = {}
) {
  if (platform.execution_mode !== 'dom_automation'
    || (platform.policy_status ?? platform.policy?.status) !== 'allowed') {
    throw new Error('当前平台未获 DOM 自动化许可')
  }
  const prepared = checkpoint || await prepareAutomatedPlatformQuery(chromeApi, platform)
  if (prepared.login_state === 'logged_out') {
    throw runnerError('平台需要人工登录', 'checking_login', {
      waiting_reason: 'login_required',
      checkpoint: prepared
    })
  }
  await callbacks.onBeforeSubmit?.(prepared)
  const submitted = await chromeApi.scripting.executeScript({
    target: { tabId: prepared.tab_id },
    func: submitPlatformQuery,
    args: [queryText, platform.selectors]
  })
  const submitResult = submitted[0]?.result
  if (!submitResult?.ok) {
    throw runnerError(submitResult?.error || '平台提交失败', submitResult?.stage || 'unknown')
  }
  const submittedCheckpoint = {
    ...prepared,
    stage: 'submitted',
    before_count: submitResult.before_count
  }
  await callbacks.onSubmitted?.(submittedCheckpoint)
  return capturePreparedPlatformResult(chromeApi, platform, submittedCheckpoint)
}

export async function openManualPlatform(chromeApi, entryUrl, queryText, clipboard = navigator.clipboard) {
  await clipboard.writeText(queryText)
  const tab = await chromeApi.tabs.create({ url: entryUrl, active: true })
  return {
    tab,
    conversation_state: 'unknown',
    conversation_proof: {
      kind: 'fresh_tab_entry',
      url: entryUrl,
      opened_at: new Date().toISOString()
    }
  }
}
