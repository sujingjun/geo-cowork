import { describe, expect, it } from 'vitest'

import { createBrowserProductFetch, secureBrowserMcpFetch } from './http'
import { MemoryBrowserQueryRepository } from './memory-repository'
import { BrowserQueryService } from './service'

const TOKEN = 'fixture-product-token-123456'

function testService() {
  return new BrowserQueryService({
    repository: new MemoryBrowserQueryRepository(),
    adapterRegistry: {
      fixture: {
        id: 'fixture', version: '1.0.0', policyStatus: 'allowed',
        exactEntryUrls: ['http://127.0.0.1:9321/task'],
        selectorVersion: 'fixture-v2', terminalDetectorVersion: 'fixture-v2',
        selectors: {
          input: '#prompt', submit: '#submit', answer: '.answer', citation: 'a',
          timeoutMs: 30_000, stableMs: 500
        }
      }
    },
    extractor: {
      profile: {
        provider: 'fake', model: 'fake', promptVersion: 'v1',
        promptSha256: 'b'.repeat(64), schemaVersion: 'geo-browser-extraction-result-v1'
      },
      async extract() {
        throw new Error('not used')
      }
    }
  })
}

function request(path: string, init: RequestInit = {}) {
  return new Request(`http://127.0.0.1:4319${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      origin: 'chrome-extension://fixture-extension',
      ...init.headers
    }
  })
}

describe('Browser Query HTTP boundaries', () => {
  it('fails closed on missing token, non-loopback host, browser origin and oversized MCP body', async () => {
    const downstream = async () => new Response('ok')
    const secured = secureBrowserMcpFetch({ fetch: downstream, token: TOKEN, maxBodyBytes: 32 })

    expect((await secured(new Request('http://127.0.0.1:4319/mcp', {
      method: 'POST', body: '{}'
    }))).status).toBe(401)
    expect((await secured(new Request('http://evil.example/mcp', {
      method: 'POST',
      headers: { authorization: `Bearer ${TOKEN}` },
      body: '{}'
    }))).status).toBe(403)
    expect((await secured(new Request('http://127.0.0.1:4319/mcp', {
      method: 'POST',
      headers: { authorization: `Bearer ${TOKEN}`, origin: 'https://evil.example' },
      body: '{}'
    }))).status).toBe(403)
    expect((await secured(new Request('http://127.0.0.1:4319/mcp', {
      method: 'POST',
      headers: { authorization: `Bearer ${TOKEN}` },
      body: 'x'.repeat(33)
    }))).status).toBe(413)
    expect((await secured(new Request('http://127.0.0.1:4319/mcp', {
      method: 'POST',
      headers: { authorization: `Bearer ${TOKEN}` },
      body: '{}'
    }))).status).toBe(200)
  })

  it('lets the extension list registered inputs, create a task and claim its first Query', async () => {
    const service = testService()
    const registered = await service.registerCycleQueryInput({
      schema_version: 'geo-cycle-query-input-v1',
      request_id: 'REQ-HTTP-CQI-001',
      cycle: { ref: 'CYC-HTTP-001', version: '1.0.0', status: 'active' },
      query_set: { ref: 'QS-HTTP-001', version: '1.0.0', content_sha256: 'a'.repeat(64) },
      queries: [{
        ref: 'Q-HTTP-001', version: '1.0.0', query_text: 'HTTP fixture query',
        language: 'en-US', ordinal: 1
      }],
      platform: {
        id: 'fixture', entry_url: 'http://127.0.0.1:9321/task',
        execution_mode: 'dom_automation', policy_status: 'allowed',
        profile_ref: 'CPF-HTTP-001', profile_version: '1.0.0',
        authorization_ref: 'fixture://http', authorization_sha256: 'c'.repeat(64)
      },
      registered_at: '2026-09-03T04:00:00Z'
    })
    const fetch = createBrowserProductFetch({ service, token: TOKEN })

    const originlessExtensionRequest = await fetch(new Request(
      'http://127.0.0.1:4319/api/browser-query/inputs',
      { headers: { authorization: `Bearer ${TOKEN}` } }
    ))
    expect(originlessExtensionRequest.status).toBe(200)
    expect((await fetch(new Request('http://127.0.0.1:4319/api/browser-query/inputs', {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        origin: 'https://evil.example'
      }
    }))).status).toBe(403)

    const listed = await fetch(request('/api/browser-query/inputs'))
    expect(listed.status).toBe(200)
    expect((await listed.json()).items).toHaveLength(1)

    const created = await fetch(request('/api/browser-query/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        schema_version: 'geo-browser-query-task-create-v1',
        request_id: 'REQ-HTTP-BQT-001',
        input_id: registered.input.input_id,
        input_fingerprint: registered.input.fingerprint,
        created_at: '2026-09-03T04:01:00Z'
      })
    }))
    expect(created.status).toBe(200)
    const task = (await created.json()).task

    const claimed = await fetch(request(`/api/browser-query/tasks/${task.task_id}/claim`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ expected_revision: 0, now: '2026-09-03T04:02:00Z' })
    }))
    expect(claimed.status).toBe(200)
    expect((await claimed.json()).attempt.stage).toBe('opening_platform')
  })
})
