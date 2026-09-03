import { loadActivePageContext } from './panel.js'
import { BrowserTaskCheckpointStore } from '../query-task-checkpoint.js'
import { isPostSubmitFailure } from '../query-task-error-policy.js'
import { QueryTaskClient } from '../query-task-client.js'
import {
  capturePreparedPlatformResult,
  checkPreparedPlatformLogin,
  openManualPlatform,
  prepareAutomatedPlatformQuery,
  requestPlatformPermission,
  runAutomatedPlatformQuery
} from '../platform-runner.js'

const pageElements = {
  status: document.querySelector('#page-status'),
  title: document.querySelector('#page-title'),
  url: document.querySelector('#page-url')
}
const taskElements = {
  serviceUrl: document.querySelector('#service-url'),
  token: document.querySelector('#session-token'),
  connect: document.querySelector('#connect-task'),
  cycleInput: document.querySelector('#cycle-input'),
  createTask: document.querySelector('#create-task'),
  connectionState: document.querySelector('#connection-state'),
  message: document.querySelector('#task-message'),
  card: document.querySelector('#task-card'),
  progress: document.querySelector('#task-progress'),
  queryState: document.querySelector('#query-state'),
  queryRef: document.querySelector('#query-ref'),
  queryText: document.querySelector('#query-text'),
  boundary: document.querySelector('#platform-boundary'),
  start: document.querySelector('#start-query'),
  continue: document.querySelector('#continue-query'),
  retry: document.querySelector('#retry-query'),
  captureForm: document.querySelector('#capture-form'),
  answerOutcome: document.querySelector('#answer-outcome'),
  resultUrl: document.querySelector('#result-url'),
  answerText: document.querySelector('#answer-text'),
  answerHtml: document.querySelector('#answer-html'),
  citationText: document.querySelector('#citation-text'),
  failureForm: document.querySelector('#failure-form'),
  failureOutcome: document.querySelector('#failure-outcome'),
  failureReason: document.querySelector('#failure-reason')
}

const refreshButton = document.querySelector('#refresh-page')
const checkpointStore = new BrowserTaskCheckpointStore(globalThis.chrome.storage.local)
const inputById = new Map()
let client = null
let taskState = null

function setTaskMessage(text, state = 'ready') {
  taskElements.message.textContent = text
  taskElements.message.dataset.state = state
}

function currentQuery() {
  return taskState?.queries.find(query => !['completed', 'cancelled'].includes(query.status)) || null
}

function currentAttempt(query = currentQuery()) {
  return query?.attempts.at(-1) || null
}

function renderInputs(inputs) {
  inputById.clear()
  taskElements.cycleInput.replaceChildren()
  if (!inputs.length) {
    const option = document.createElement('option')
    option.textContent = '没有可用的 Cycle Query Input'
    option.value = ''
    taskElements.cycleInput.append(option)
  }
  for (const input of inputs) {
    inputById.set(input.input_id, input)
    const option = document.createElement('option')
    option.value = input.input_id
    option.textContent = `${input.cycle.ref} · ${input.query_set.ref} · ${input.platform.id}`
    taskElements.cycleInput.append(option)
  }
  taskElements.cycleInput.disabled = inputs.length === 0
  taskElements.createTask.disabled = inputs.length === 0
}

function renderTask(state) {
  taskState = state
  taskElements.card.hidden = false
  taskElements.connectionState.textContent = '已连接'
  taskElements.connectionState.dataset.state = 'ready'
  const completed = state.queries.filter(query => query.status === 'completed').length
  taskElements.progress.textContent = `${completed} / ${state.queries.length} · ${state.task_id}`
  const query = currentQuery()
  if (!query) {
    taskElements.queryState.textContent = 'completed'
    taskElements.queryState.dataset.state = 'completed'
    taskElements.queryRef.textContent = state.query_set.ref
    taskElements.queryText.textContent = '全部 Query 已形成终态。'
    taskElements.boundary.textContent = '结果保存在 Browser Server pending queue，等待 Cowork 主动拉取。'
    taskElements.start.hidden = true
    taskElements.continue.hidden = true
    taskElements.retry.hidden = true
    taskElements.captureForm.hidden = true
    taskElements.failureForm.hidden = true
    return
  }
  const attempt = currentAttempt(query)
  const canResumeCapture = state.platform.execution_mode === 'dom_automation'
    && attempt?.stage === 'waiting_response'
  const canRetryExtraction = Boolean(
    attempt?.stage === 'extraction_pending' && attempt.capture_id
  )
  taskElements.queryState.textContent = attempt?.stage || query.status
  taskElements.queryState.dataset.state = query.status
  taskElements.queryRef.textContent = `${query.ref} · ${query.version}`
  taskElements.queryText.textContent = query.query_text
  taskElements.boundary.textContent = state.platform.execution_mode === 'dom_automation'
    ? `自动化只对已许可 adapter 生效：${state.platform.id}。每条 Query 打开独立新会话。`
    : `人工辅助：Query 会复制并在 ${state.platform.id} 打开新会话；请人工提交并提供完整结果。`
  taskElements.start.hidden = query.status !== 'pending'
  taskElements.continue.hidden = !(canResumeCapture
    || (query.status === 'waiting_human'
      && ['login_required', 'challenge'].includes(attempt?.waiting_reason)))
  taskElements.continue.textContent = canResumeCapture ? '恢复结果采集' : '人工处理完成，继续'
  taskElements.retry.hidden = !(canRetryExtraction
    || (query.status === 'failed' && attempt?.outcome === 'system_failure'))
  taskElements.retry.textContent = canRetryExtraction ? '重试结果提取' : '重新启动'
  taskElements.captureForm.hidden = !(query.status === 'waiting_human'
    && ['submission_unknown', 'result_confirmation'].includes(attempt?.waiting_reason))
  taskElements.failureForm.hidden = !['running', 'waiting_human'].includes(query.status)
  if (query.status === 'failed') setTaskMessage(`失败：${attempt?.failure_reason || 'unknown'}`, 'error')
  if (query.status === 'blocked') setTaskMessage(`平台已停止：${attempt?.failure_reason || 'challenge'}`, 'error')
}

function citationsFromText(value) {
  return value.split('\n').map(line => line.trim()).filter(Boolean).map((line, index) => {
    const separator = line.lastIndexOf('|')
    const raw = separator < 0 ? line : line.slice(separator + 1).trim()
    const normalized = new URL(raw)
    normalized.hash = ''
    return {
      ordinal: index + 1,
      href_raw: raw,
      href_normalized: normalized.toString(),
      title: separator < 0 ? '' : line.slice(0, separator).trim(),
      anchor_or_context: ''
    }
  })
}

async function refreshPage() {
  await loadActivePageContext(
    globalThis.chrome.runtime.sendMessage.bind(globalThis.chrome.runtime),
    pageElements
  )
}

async function loadRegisteredInputs() {
  const result = await client.listInputs()
  renderInputs(result.items)
  const activeTaskId = await checkpointStore.loadActiveTask()
  if (activeTaskId) {
    try {
      let activeTask = await client.load(activeTaskId)
      renderTask(activeTask)
      const query = currentQuery()
      const attempt = currentAttempt(query)
      const checkpoint = await checkpointStore.load(activeTaskId)
      if ((query?.status === 'running' && attempt?.stage === 'submitted')
        || (attempt?.stage === 'ready' && checkpoint?.stage === 'submit_intent')) {
        const waiting = await client.wait(
          activeTaskId,
          attempt.attempt_id,
          activeTask.revision,
          'submission_unknown'
        )
        activeTask = waiting.task
        renderTask(activeTask)
      }
      setTaskMessage('已恢复 Browser Server 中的任务状态。')
    } catch {
      await checkpointStore.clearActiveTask()
    }
  }
}

async function saveAutomatedCapture(attempt, capture) {
  const completed = await client.capture(taskState.task_id, {
    schema_version: 'geo-browser-query-capture-submission-v1',
    attempt_id: attempt.attempt_id,
    expected_revision: taskState.revision,
    outcome: 'success',
    ...capture,
    captured_at: new Date().toISOString()
  })
  await checkpointStore.clear(taskState.task_id)
  renderTask(completed.task)
  setTaskMessage('完整回答已保存并进入 pending queue。')
}

async function waitForLogin(task, attempt, prepared) {
  const waiting = await client.wait(
    task.task_id,
    attempt.attempt_id,
    task.revision,
    'login_required'
  )
  await checkpointStore.save(task.task_id, {
    ...prepared,
    task_id: task.task_id,
    attempt_id: attempt.attempt_id,
    stage: 'waiting_human',
    updated_at: new Date().toISOString()
  })
  renderTask(waiting.task)
  setTaskMessage('平台需要人工登录。完成登录后点击“继续”；系统不会读取凭据。', 'error')
}

async function executeAutomated(query, attempt, prepared) {
  if (prepared.login_state === 'logged_out') {
    await waitForLogin(taskState, attempt, prepared)
    return
  }
  const ready = await client.advance(
    taskState.task_id,
    attempt.attempt_id,
    taskState.revision,
    'ready',
    {
      conversation_state: prepared.conversation_state,
      conversation_proof: prepared.conversation_proof
    }
  )
  renderTask(ready.task)
  try {
    const capture = await runAutomatedPlatformQuery(
      globalThis.chrome,
      taskState.platform,
      query.query_text,
      prepared,
      {
        onBeforeSubmit: async checkpoint => checkpointStore.save(taskState.task_id, {
          ...checkpoint,
          task_id: taskState.task_id,
          attempt_id: attempt.attempt_id,
          stage: 'submit_intent',
          updated_at: new Date().toISOString()
        }),
        onSubmitted: async (checkpoint) => {
          const submitted = await client.advance(
            taskState.task_id,
            attempt.attempt_id,
            taskState.revision,
            'submitted'
          )
          const waiting = await client.advance(
            submitted.task.task_id,
            attempt.attempt_id,
            submitted.task.revision,
            'waiting_response'
          )
          renderTask(waiting.task)
          await checkpointStore.save(taskState.task_id, {
            ...checkpoint,
            task_id: taskState.task_id,
            attempt_id: attempt.attempt_id,
            stage: 'waiting_response',
            updated_at: new Date().toISOString()
          })
        }
      }
    )
    await saveAutomatedCapture(attempt, capture)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    const postSubmit = isPostSubmitFailure(error, currentAttempt(query)?.stage)
    const stopped = postSubmit
      ? await client.wait(taskState.task_id, attempt.attempt_id, taskState.revision, 'submission_unknown')
      : await client.fail(taskState.task_id, attempt.attempt_id, taskState.revision, reason)
    renderTask(stopped.task)
    setTaskMessage(postSubmit
      ? 'Query 可能已提交；请人工确认页面终态，系统不会自动重试。'
      : reason, 'error')
  }
}

refreshButton.addEventListener('click', refreshPage)

taskElements.connect.addEventListener('click', async () => {
  try {
    client = new QueryTaskClient({
      baseUrl: taskElements.serviceUrl.value,
      token: taskElements.token.value
    })
    setTaskMessage('正在连接…', 'loading')
    await loadRegisteredInputs()
    taskElements.connectionState.textContent = '已连接'
    taskElements.connectionState.dataset.state = 'ready'
    setTaskMessage(inputById.size ? '请选择 Cycle 输入并新建任务。' : '当前没有已注册 Cycle 输入。')
  } catch (error) {
    taskElements.connectionState.textContent = '连接失败'
    taskElements.connectionState.dataset.state = 'error'
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.createTask.addEventListener('click', async () => {
  const input = inputById.get(taskElements.cycleInput.value)
  if (!client || !input) return
  try {
    const created = await client.createTask(input.input_id, input.fingerprint)
    await checkpointStore.saveActiveTask(created.task.task_id)
    renderTask(created.task)
    setTaskMessage('Browser Query Task 已创建；输入版本已冻结。')
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.start.addEventListener('click', async () => {
  const query = currentQuery()
  if (!client || !query) return
  taskElements.start.disabled = true
  const permissionPromise = taskState.platform.execution_mode === 'dom_automation'
    ? requestPlatformPermission(globalThis.chrome, taskState.platform)
    : null
  try {
    const claimed = await client.claim(taskState.task_id, taskState.revision)
    renderTask(claimed.task)
    const checking = await client.advance(
      claimed.task.task_id,
      claimed.attempt.attempt_id,
      claimed.task.revision,
      'checking_login'
    )
    renderTask(checking.task)
    if (checking.task.platform.execution_mode === 'dom_automation') {
      await permissionPromise
      const prepared = await prepareAutomatedPlatformQuery(globalThis.chrome, checking.task.platform)
      await executeAutomated(query, claimed.attempt, prepared)
    } else {
      const manual = await openManualPlatform(
        globalThis.chrome,
        checking.task.platform.entry_url,
        query.query_text
      )
      const ready = await client.advance(
        checking.task.task_id,
        claimed.attempt.attempt_id,
        checking.task.revision,
        'ready',
        {
          conversation_state: manual.conversation_state,
          conversation_proof: manual.conversation_proof
        }
      )
      const waiting = await client.wait(
        ready.task.task_id,
        claimed.attempt.attempt_id,
        ready.task.revision,
        'result_confirmation'
      )
      await checkpointStore.save(waiting.task.task_id, {
        schema_version: 'geo-browser-extension-checkpoint-v1',
        task_id: waiting.task.task_id,
        attempt_id: claimed.attempt.attempt_id,
        tab_id: manual.tab.id,
        stage: 'waiting_human',
        updated_at: new Date().toISOString()
      })
      renderTask(waiting.task)
      setTaskMessage('Query 已复制并打开新会话；人工提交后粘贴完整回答与回答根 HTML。')
    }
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  } finally {
    taskElements.start.disabled = false
  }
})

taskElements.continue.addEventListener('click', async () => {
  const query = currentQuery()
  const attempt = currentAttempt(query)
  if (!client || !query || !attempt) return
  try {
    if (attempt.stage === 'waiting_response') {
      const checkpoint = await checkpointStore.load(taskState.task_id)
      if (!checkpoint) throw new Error('缺少等待结果的页面 checkpoint')
      const capture = await capturePreparedPlatformResult(
        globalThis.chrome,
        taskState.platform,
        checkpoint
      )
      await saveAutomatedCapture(attempt, capture)
      return
    }
    const resumed = await client.continue(taskState.task_id, attempt.attempt_id, taskState.revision)
    renderTask(resumed.task)
    const checkpoint = await checkpointStore.load(taskState.task_id)
    if (!checkpoint) throw new Error('缺少可恢复的页面 checkpoint')
    const checked = await checkPreparedPlatformLogin(globalThis.chrome, taskState.platform, checkpoint)
    await checkpointStore.save(taskState.task_id, {
      ...checked,
      task_id: taskState.task_id,
      attempt_id: attempt.attempt_id
    })
    await executeAutomated(query, attempt, checked)
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.captureForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const query = currentQuery()
  const attempt = currentAttempt(query)
  if (!client || !query || !attempt) return
  try {
    const completed = await client.capture(taskState.task_id, {
      schema_version: 'geo-browser-query-capture-submission-v1',
      attempt_id: attempt.attempt_id,
      expected_revision: taskState.revision,
      outcome: taskElements.answerOutcome.value,
      result_url: taskElements.resultUrl.value,
      answer_text: taskElements.answerText.value,
      answer_html: taskElements.answerHtml.value,
      citations: citationsFromText(taskElements.citationText.value),
      detector_diagnostics: { capture_mode: 'human_confirmed' },
      captured_at: new Date().toISOString()
    })
    taskElements.captureForm.reset()
    await checkpointStore.clear(taskState.task_id)
    renderTask(completed.task)
    setTaskMessage('Capture 已保存并进入 pending queue。')
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.failureForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const query = currentQuery()
  const attempt = currentAttempt(query)
  if (!client || !query || !attempt) return
  try {
    const failed = await client.fail(
      taskState.task_id,
      attempt.attempt_id,
      taskState.revision,
      taskElements.failureReason.value,
      taskElements.failureOutcome.value
    )
    taskElements.failureForm.reset()
    await checkpointStore.clear(taskState.task_id)
    renderTask(failed.task)
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.retry.addEventListener('click', async () => {
  const query = currentQuery()
  const attempt = currentAttempt(query)
  if (!client || !query || !attempt) return
  try {
    if (attempt.stage === 'extraction_pending' && attempt.capture_id) {
      const extracted = await client.retryExtraction(attempt.capture_id)
      renderTask(extracted.task)
      setTaskMessage(extracted.pending
        ? '结果提取已完成并进入 pending queue。'
        : `结果提取仍失败：${extracted.extraction.diagnostics?.message || 'unknown'}`, extracted.pending ? 'ready' : 'error')
      return
    }
    const retried = await client.retry(taskState.task_id, query.ref, taskState.revision)
    renderTask(retried.task)
    setTaskMessage('失败 attempt 已保留；Query 已回到 pending。')
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

void refreshPage()
