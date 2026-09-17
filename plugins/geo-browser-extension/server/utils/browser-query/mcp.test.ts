import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'
import { afterEach, describe, expect, it } from 'vitest'

import { createBrowserMcpHandler } from './mcp'
import { MemoryBrowserQueryRepository } from './memory-repository'
import { BrowserQueryService } from './service'

const handlers: Array<{ close(): Promise<void> }> = []

afterEach(async () => {
  await Promise.all(handlers.splice(0).map(handler => handler.close()))
})

function input() {
  return {
    schema_version: 'geo-cycle-query-input-v1',
    request_id: 'REQ-MCP-CQI-001',
    cycle: { ref: 'CYC-MCP-001', version: '1.0.0', status: 'active' },
    query_set: {
      ref: 'QS-MCP-001', version: '1.0.0', content_sha256: 'a'.repeat(64)
    },
    queries: [{
      ref: 'Q-MCP-001', version: '1.0.0', query_text: 'Fixture query',
      language: 'en-US', ordinal: 1
    }],
    platform: {
      id: 'fixture',
      entry_url: 'http://127.0.0.1:9321/task',
      execution_mode: 'dom_automation',
      policy_status: 'allowed',
      profile_ref: 'CPF-MCP-001',
      profile_version: '1.0.0',
      authorization_ref: 'fixture://mcp',
      authorization_sha256: 'b'.repeat(64)
    },
    registered_at: '2026-09-03T02:00:00Z'
  }
}

function service() {
  return new BrowserQueryService({
    repository: new MemoryBrowserQueryRepository(),
    adapterRegistry: {
      fixture: {
        id: 'fixture',
        version: '1.0.0',
        policyStatus: 'allowed',
        exactEntryUrls: ['http://127.0.0.1:9321/task'],
        selectorVersion: 'fixture-v2',
        terminalDetectorVersion: 'fixture-v2',
        selectors: {
          input: '#prompt', submit: '#submit', answer: '.answer', citation: 'a',
          loggedIn: '[data-login-state="logged-in"]',
          loggedOut: '[data-login-state="logged-out"]',
          timeoutMs: 30_000, stableMs: 500
        }
      }
    },
    extractor: {
      profile: {
        provider: 'not-invoked', model: 'not-invoked', promptVersion: 'v1',
        promptSha256: 'c'.repeat(64), schemaVersion: 'geo-browser-extraction-result-v1'
      },
      async extract() {
        throw new Error('not used in MCP contract test')
      }
    }
  })
}

async function connect(mode: 'legacy' | 'auto') {
  const handler = createBrowserMcpHandler({ service: service() })
  handlers.push(handler)
  const client = new Client(
    { name: `browser-query-${mode}-test`, version: '1.0.0' },
    { versionNegotiation: { mode } }
  )
  const transport = new StreamableHTTPClientTransport(new URL('http://test.local/mcp'), {
    fetch: (url, init) => handler.fetch(new Request(url, init))
  })
  await client.connect(transport)
  return { client, handler }
}

describe('Browser MCP handler', () => {
  it.each(['legacy', 'auto'] as const)('serves %s clients with the exact tool allowlist', async (mode) => {
    const { client } = await connect(mode)
    const listed = await client.listTools()
    expect(new Set(listed.tools.map(tool => tool.name))).toEqual(new Set([
      'register_cycle_query_input',
      'get_cycle_query_input',
      'list_browser_query_tasks',
      'get_browser_query_task_summary',
      'list_pending_query_results',
      'get_query_result',
      'get_query_result_artifact',
      'acknowledge_query_result'
    ]))

    const registered = await client.callTool({
      name: 'register_cycle_query_input',
      arguments: { input: input() }
    })
    expect(registered.isError).not.toBe(true)
    expect(registered.structuredContent).toMatchObject({
      schema_version: 'geo-browser-mcp-result-v1',
      ok: true,
      action: 'created'
    })
    expect(client.getProtocolEra()).toBe(mode === 'auto' ? 'modern' : 'legacy')
    await client.close()
  })
})
