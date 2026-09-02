import { loadActivePageContext } from './panel.js'
import { QueryTaskClient } from '../query-task-client.js'
import {
  openManualPlatform,
  requestPlatformPermission,
  runAutomatedPlatformQuery
} from '../platform-runner.js'

const elements = {
  status: document.querySelector('#page-status'),
  title: document.querySelector('#page-title'),
  url: document.querySelector('#page-url')
}
const refreshButton = document.querySelector('#refresh-page')
const taskElements = {
  serviceUrl: document.querySelector('#service-url'),
  token: document.querySelector('#session-token'),
  connect: document.querySelector('#connect-task'),
  connectionState: document.querySelector('#connection-state'),
  message: document.querySelector('#task-message'),
  card: document.querySelector('#task-card'),
  progress: document.querySelector('#task-progress'),
  queryState: document.querySelector('#query-state'),
  queryRef: document.querySelector('#query-ref'),
  queryText: document.querySelector('#query-text'),
  boundary: document.querySelector('#platform-boundary'),
  start: document.querySelector('#start-query'),
  retry: document.querySelector('#retry-query'),
  captureForm: document.querySelector('#capture-form'),
  answerOutcome: document.querySelector('#answer-outcome'),
  resultUrl: document.querySelector('#result-url'),
  answerText: document.querySelector('#answer-text'),
  citationText: document.querySelector('#citation-text'),
  failureForm: document.querySelector('#failure-form'),
  failureOutcome: document.querySelector('#failure-outcome'),
  failureReason: document.querySelector('#failure-reason')
}

let client = null
let taskState = null

function setTaskMessage(text, state = 'ready') {
  taskElements.message.textContent = text
  taskElements.message.dataset.state = state
}

function currentQuery() {
  return taskState?.queries.find(query => query.ref === taskState.current_query_ref) || null
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
    taskElements.queryText.textContent = '全部 Query 已完成。'
    taskElements.boundary.textContent = '所有结果均已写入项目工作区。'
    taskElements.start.hidden = true
    taskElements.retry.hidden = true
    taskElements.captureForm.hidden = true
    taskElements.failureForm.hidden = true
    return
  }
  taskElements.queryState.textContent = query.status
  taskElements.queryState.dataset.state = query.status
  taskElements.queryRef.textContent = `${query.ref} · ${query.version}`
  taskElements.queryText.textContent = query.query_text
  taskElements.boundary.textContent = state.platform.execution_mode === 'dom_automation'
    ? `自动化已获许可：${state.platform.id}。点击后将输入、提交、等待并采集回答。`
    : `人工辅助：Query 会复制到剪贴板并打开 ${state.platform.id}；请人工提交并粘贴完整结果。`
  taskElements.start.hidden = query.status !== 'pending'
  taskElements.retry.hidden = query.status !== 'failed'
  taskElements.captureForm.hidden = !(
    ['running', 'waiting_human'].includes(query.status)
    && (state.platform.execution_mode === 'manual_assist' || query.status === 'waiting_human')
  )
  taskElements.failureForm.hidden = !['running', 'waiting_human'].includes(query.status)
  if (query.status === 'failed') {
    setTaskMessage(`失败：${query.last_failure_reason}`, 'error')
  } else if (query.status === 'blocked') {
    setTaskMessage(`平台已停止：${query.last_failure_reason}`, 'error')
  }
}

function citationsFromText(value) {
  return value.split('\n').map(line => line.trim()).filter(Boolean).map((line) => {
    const separator = line.lastIndexOf('|')
    if (separator < 0) return { url: line, title: '', context: '' }
    return {
      title: line.slice(0, separator).trim(),
      url: line.slice(separator + 1).trim(),
      context: ''
    }
  })
}

async function loadTask() {
  const result = await client.load()
  renderTask(result.state)
  setTaskMessage(result.action === 'resumed' ? '已恢复本地任务状态。' : '已创建本地任务状态。')
}

async function refresh() {
  await loadActivePageContext(
    globalThis.chrome.runtime.sendMessage.bind(globalThis.chrome.runtime),
    elements
  )
}

refreshButton.addEventListener('click', refresh)
taskElements.connect.addEventListener('click', async () => {
  try {
    client = new QueryTaskClient({
      baseUrl: taskElements.serviceUrl.value,
      token: taskElements.token.value
    })
    setTaskMessage('正在连接…', 'loading')
    await loadTask()
  } catch (error) {
    taskElements.connectionState.textContent = '连接失败'
    taskElements.connectionState.dataset.state = 'error'
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.start.addEventListener('click', async () => {
  const query = currentQuery()
  if (!client || !query) return
  taskElements.start.disabled = true
  let permissionPromise
  try {
    if (taskState.platform.execution_mode === 'dom_automation') {
      permissionPromise = requestPlatformPermission(globalThis.chrome, taskState.platform)
    }
    const started = await client.start(query.ref)
    renderTask(started.state)
    if (started.state.platform.execution_mode === 'dom_automation') {
      await permissionPromise
      setTaskMessage('已提交 Query，正在等待模型回复…', 'loading')
      try {
        const capture = await runAutomatedPlatformQuery(
          globalThis.chrome,
          started.state.platform,
          query.query_text
        )
        const completed = await client.complete(query.ref, capture)
        renderTask(completed.state)
        setTaskMessage('回答与引用已写回项目。')
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error)
        const postSubmit = ['submitted', 'unknown'].includes(error?.stage)
        const stopped = postSubmit
          ? await client.uncertain(query.ref, reason)
          : await client.fail(query.ref, reason, 'system_failure')
        renderTask(stopped.state)
        if (postSubmit) {
          setTaskMessage('Query 可能已提交；请人工确认当前页面终态，系统不会自动重试。', 'error')
        }
      }
    } else {
      await openManualPlatform(globalThis.chrome, started.state.platform.entry_url, query.query_text)
      setTaskMessage('Query 已复制并打开平台；人工提交后粘贴完整结果。')
    }
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  } finally {
    taskElements.start.disabled = false
  }
})

taskElements.captureForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const query = currentQuery()
  if (!client || !query) return
  try {
    const completed = await client.complete(query.ref, {
      result_url: taskElements.resultUrl.value,
      answer_text: taskElements.answerText.value,
      outcome: taskElements.answerOutcome.value,
      citations: citationsFromText(taskElements.citationText.value)
    })
    taskElements.captureForm.reset()
    renderTask(completed.state)
    setTaskMessage('回答与引用已写回项目。')
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.failureForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const query = currentQuery()
  if (!client || !query) return
  try {
    const failed = await client.fail(
      query.ref,
      taskElements.failureReason.value,
      taskElements.failureOutcome.value
    )
    taskElements.failureForm.reset()
    renderTask(failed.state)
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})

taskElements.retry.addEventListener('click', async () => {
  const query = currentQuery()
  if (!client || !query) return
  try {
    const retried = await client.retry(query.ref)
    renderTask(retried.state)
    setTaskMessage('失败记录已保留；Query 已回到 pending，可重新启动。')
  } catch (error) {
    setTaskMessage(error instanceof Error ? error.message : String(error), 'error')
  }
})
void refresh()
