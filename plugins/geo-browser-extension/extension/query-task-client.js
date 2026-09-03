const DEFAULT_BASE_URL = 'http://127.0.0.1:4319'

function normalizedBaseUrl(value) {
  const url = new URL(value || DEFAULT_BASE_URL)
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1') {
    throw new Error('任务服务地址必须使用 http://127.0.0.1')
  }
  url.pathname = ''
  url.search = ''
  url.hash = ''
  return url.toString().replace(/\/$/, '')
}

export class QueryTaskClient {
  constructor({
    baseUrl = DEFAULT_BASE_URL,
    token,
    fetchImpl = globalThis.fetch,
    now = () => new Date().toISOString()
  }) {
    this.baseUrl = normalizedBaseUrl(baseUrl)
    this.token = String(token || '').trim()
    this.fetchImpl = fetchImpl.bind(globalThis)
    this.now = now
    if (this.token.length < 16) throw new Error('请输入 Browser Server 启动时输出的 product token')
  }

  async request(path, body) {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(`${payload.code || `HTTP_${response.status}`}: ${payload.message || 'Browser Server 请求失败'}`)
      error.code = payload.code || `HTTP_${response.status}`
      error.diagnostics = payload.diagnostics
      throw error
    }
    return payload
  }

  listInputs(cycleRef) {
    const query = cycleRef ? `?cycle_ref=${encodeURIComponent(cycleRef)}` : ''
    return this.request(`/api/browser-query/inputs${query}`)
  }

  createTask(inputId, inputFingerprint) {
    return this.request('/api/browser-query/tasks', {
      schema_version: 'geo-browser-query-task-create-v1',
      request_id: `REQ-BQT-${crypto.randomUUID().replaceAll('-', '').toUpperCase()}`,
      input_id: inputId,
      input_fingerprint: inputFingerprint,
      created_at: this.now()
    })
  }

  load(taskId) {
    return this.request(`/api/browser-query/tasks/${encodeURIComponent(taskId)}`)
  }

  claim(taskId, expectedRevision) {
    return this.action(taskId, 'claim', { expected_revision: expectedRevision })
  }

  advance(taskId, attemptId, expectedRevision, stage, extra = {}) {
    return this.action(taskId, 'advance', {
      attempt_id: attemptId,
      expected_revision: expectedRevision,
      stage,
      ...extra
    })
  }

  wait(taskId, attemptId, expectedRevision, reason) {
    return this.action(taskId, 'wait', {
      attempt_id: attemptId,
      expected_revision: expectedRevision,
      reason
    })
  }

  continue(taskId, attemptId, expectedRevision) {
    return this.action(taskId, 'continue', {
      attempt_id: attemptId,
      expected_revision: expectedRevision
    })
  }

  capture(taskId, payload) {
    return this.request(`/api/browser-query/tasks/${encodeURIComponent(taskId)}/capture`, payload)
  }

  fail(taskId, attemptId, expectedRevision, failureReason, outcome = 'system_failure') {
    return this.action(taskId, 'fail', {
      attempt_id: attemptId,
      expected_revision: expectedRevision,
      failure_reason: failureReason,
      outcome
    })
  }

  retry(taskId, queryRef, expectedRevision) {
    return this.action(taskId, 'retry', {
      query_ref: queryRef,
      expected_revision: expectedRevision
    })
  }

  retryExtraction(captureId) {
    return this.request(`/api/browser-query/captures/${encodeURIComponent(captureId)}/retry-extraction`, {
      now: this.now()
    })
  }

  action(taskId, action, payload) {
    return this.request(`/api/browser-query/tasks/${encodeURIComponent(taskId)}/${action}`, {
      ...payload,
      now: this.now()
    })
  }
}

export { DEFAULT_BASE_URL }
