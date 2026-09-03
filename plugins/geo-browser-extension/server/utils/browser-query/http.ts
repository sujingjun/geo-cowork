import { createHash, timingSafeEqual } from 'node:crypto'

import { BrowserQueryError } from './errors'
import type { BrowserQueryService } from './service'

type FetchHandler = (request: Request) => Promise<Response>

function response(status: number, body: unknown, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers }
  })
}

function loopbackRequest(request: Request) {
  const url = new URL(request.url)
  return url.protocol === 'http:' && url.hostname === '127.0.0.1'
}

function bearerMatches(request: Request, token: string) {
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return Boolean(token) && timingSafeEqual(digest(supplied), digest(token))
}

function statusFor(error: BrowserQueryError) {
  if (error.code.endsWith('_NOT_FOUND')) return 404
  if (error.code.includes('CONFLICT') || error.code.includes('TRANSITION')) return 409
  if (error.code.includes('TERMS') || error.code.includes('ALLOWLIST')) return 403
  return 400
}

function publicError(error: unknown) {
  if (error instanceof BrowserQueryError) {
    return response(statusFor(error), {
      schema_version: 'geo-browser-http-error-v1',
      ok: false,
      code: error.code,
      message: error.message,
      ...(error.diagnostics ? { diagnostics: error.diagnostics } : {})
    })
  }
  return response(500, {
    schema_version: 'geo-browser-http-error-v1',
    ok: false,
    code: 'INTERNAL_ERROR',
    message: 'Browser Query operation failed'
  })
}

async function boundedRequest(request: Request, maxBodyBytes: number) {
  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > maxBodyBytes) return null
  const bytes = new Uint8Array(await request.arrayBuffer())
  if (bytes.byteLength > maxBodyBytes) return null
  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: bytes,
    signal: request.signal
  })
}

export function secureBrowserMcpFetch(options: {
  fetch: FetchHandler
  token: string
  maxBodyBytes?: number
}): FetchHandler {
  const maxBodyBytes = options.maxBodyBytes ?? 1024 * 1024
  return async (request) => {
    if (!options.token) return response(503, { ok: false, code: 'MCP_TOKEN_NOT_CONFIGURED' })
    if (!loopbackRequest(request)) return response(403, { ok: false, code: 'MCP_HOST_NOT_ALLOWED' })
    const origin = request.headers.get('origin')
    if (origin) {
      let allowed = false
      try {
        const parsed = new URL(origin)
        allowed = parsed.protocol === 'http:' && parsed.hostname === '127.0.0.1'
      } catch {
        allowed = false
      }
      if (!allowed) return response(403, { ok: false, code: 'MCP_ORIGIN_NOT_ALLOWED' })
    }
    if (!bearerMatches(request, options.token)) {
      return response(401, { ok: false, code: 'MCP_UNAUTHORIZED' }, {
        'www-authenticate': 'Bearer realm="geo-browser"'
      })
    }
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/mcp') {
      return response(405, { ok: false, code: 'MCP_PROTOCOL_UNSUPPORTED' })
    }
    const bounded = await boundedRequest(request, maxBodyBytes)
    if (!bounded) return response(413, { ok: false, code: 'MCP_BODY_TOO_LARGE' })
    return options.fetch(bounded)
  }
}

async function jsonBody(request: Request, maxBodyBytes = 3 * 1024 * 1024) {
  const bounded = await boundedRequest(request, maxBodyBytes)
  if (!bounded) throw new BrowserQueryError('REQUEST_BODY_TOO_LARGE', 'Request body is too large')
  try {
    return await bounded.json()
  } catch {
    throw new BrowserQueryError('CYCLE_QUERY_INPUT_INVALID', 'Request body must be JSON')
  }
}

function productHeaders(origin: string | null): Record<string, string> {
  if (!origin?.startsWith('chrome-extension://')) return {}
  return { 'access-control-allow-origin': origin, 'vary': 'Origin' }
}

export function createBrowserProductFetch(options: {
  service: BrowserQueryService
  token: string
}): FetchHandler {
  return async (request) => {
    const origin = request.headers.get('origin')
    const cors = productHeaders(origin)
    if (!options.token) return response(503, { ok: false, code: 'PRODUCT_TOKEN_NOT_CONFIGURED' }, cors)
    if (!loopbackRequest(request)) {
      return response(403, { ok: false, code: 'PRODUCT_HOST_NOT_ALLOWED' }, cors)
    }
    if (origin && !origin.startsWith('chrome-extension://')) {
      return response(403, { ok: false, code: 'PRODUCT_ORIGIN_NOT_ALLOWED' }, cors)
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          'access-control-allow-headers': 'Authorization, Content-Type',
          'access-control-allow-methods': 'GET, POST, OPTIONS'
        }
      })
    }
    if (!bearerMatches(request, options.token)) {
      return response(401, { ok: false, code: 'PRODUCT_UNAUTHORIZED' }, cors)
    }
    const url = new URL(request.url)
    const path = url.pathname
    try {
      if (request.method === 'GET' && path === '/api/browser-query/inputs') {
        const items = await options.service.listCycleQueryInputs({
          cycle_ref: url.searchParams.get('cycle_ref') ?? undefined
        })
        return response(200, { schema_version: 'geo-cycle-query-input-list-v1', items }, cors)
      }
      if (request.method === 'POST' && path === '/api/browser-query/tasks') {
        return response(200, await options.service.createTask(await jsonBody(request)), cors)
      }
      const taskMatch = path.match(/^\/api\/browser-query\/tasks\/(BQT-[A-Z0-9-]+)$/)
      if (request.method === 'GET' && taskMatch) {
        return response(200, await options.service.getTask(taskMatch[1]!), cors)
      }
      const actionMatch = path.match(
        /^\/api\/browser-query\/tasks\/(BQT-[A-Z0-9-]+)\/(claim|advance|wait|continue|capture|fail|retry)$/
      )
      if (request.method === 'POST' && actionMatch) {
        const body = await jsonBody(request) as Record<string, unknown>
        const input = { ...body, task_id: actionMatch[1] }
        const action = actionMatch[2]
        if (action === 'claim') return response(200, await options.service.claimNextQuery(input), cors)
        if (action === 'advance') return response(200, await options.service.advanceAttempt(input), cors)
        if (action === 'wait') return response(200, await options.service.waitForHuman(input), cors)
        if (action === 'continue') return response(200, await options.service.continueAttempt(input), cors)
        if (action === 'fail') return response(200, await options.service.failAttempt(input), cors)
        if (action === 'retry') return response(200, await options.service.retryQuery(input), cors)
        return response(200, await options.service.captureQueryResult(input), cors)
      }
      const retryMatch = path.match(
        /^\/api\/browser-query\/captures\/(BQC-[A-Z0-9-]+)\/retry-extraction$/
      )
      if (request.method === 'POST' && retryMatch) {
        const body = await jsonBody(request) as Record<string, unknown>
        return response(200, await options.service.retryExtraction({
          capture_id: retryMatch[1]!,
          now: String(body.now ?? '')
        }), cors)
      }
      return response(404, { ok: false, code: 'PRODUCT_ENDPOINT_NOT_FOUND' }, cors)
    } catch (error) {
      const result = publicError(error)
      for (const [key, value] of Object.entries(cors)) result.headers.set(key, value)
      return result
    }
  }
}
