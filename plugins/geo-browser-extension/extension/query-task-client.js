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
  constructor({ baseUrl = DEFAULT_BASE_URL, token, fetchImpl = globalThis.fetch }) {
    this.baseUrl = normalizedBaseUrl(baseUrl)
    this.token = String(token || '').trim()
    this.fetchImpl = fetchImpl
    if (this.token.length < 16) throw new Error('请输入任务服务启动时输出的 session token')
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
    if (!response.ok) throw new Error(`${payload.error || `HTTP_${response.status}`}: ${payload.message || '任务服务请求失败'}`)
    return payload
  }

  load() {
    return this.request('/api/task')
  }

  start(queryRef) {
    return this.request('/api/task/start', { query_ref: queryRef })
  }

  complete(queryRef, result) {
    return this.request('/api/task/complete', { query_ref: queryRef, ...result })
  }

  fail(queryRef, failureReason, outcome = 'system_failure') {
    return this.request('/api/task/fail', {
      query_ref: queryRef,
      failure_reason: failureReason,
      outcome
    })
  }

  uncertain(queryRef, reason) {
    return this.request('/api/task/uncertain', {
      query_ref: queryRef,
      reason
    })
  }

  retry(queryRef) {
    return this.request('/api/task/retry', { query_ref: queryRef })
  }
}

export { DEFAULT_BASE_URL }
