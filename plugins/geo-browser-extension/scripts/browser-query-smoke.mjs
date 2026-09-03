import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'

const baseUrl = process.env.GEO_BROWSER_SMOKE_URL || 'http://127.0.0.1:4319'
const mcpToken = process.env.GEO_BROWSER_MCP_TOKEN || ''
const productToken = process.env.GEO_BROWSER_PRODUCT_TOKEN || ''
const negotiationMode = process.env.GEO_BROWSER_MCP_NEGOTIATION === 'legacy' ? 'legacy' : 'auto'

if (mcpToken.length < 16 || productToken.length < 16) {
  throw new Error('Smoke requires GEO_BROWSER_MCP_TOKEN and GEO_BROWSER_PRODUCT_TOKEN')
}

const suffix = String(Date.now())
const queryText = 'What is the synthetic browser fixture?'
const hash = value => createHash('sha256').update(value).digest('hex')

const client = new Client(
  { name: 'geo-browser-live-smoke', version: '1.0.0' },
  { versionNegotiation: { mode: negotiationMode } }
)
await client.connect(new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), {
  requestInit: { headers: { Authorization: `Bearer ${mcpToken}` } }
}))

async function product(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: `Bearer ${productToken}`,
      Origin: 'chrome-extension://fixture-smoke',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  })
  const payload = await response.json()
  assert.equal(response.ok, true, JSON.stringify(payload))
  return payload
}

try {
  const registered = await client.callTool({
    name: 'register_cycle_query_input',
    arguments: {
      input: {
        schema_version: 'geo-cycle-query-input-v1',
        request_id: `REQ-SMOKE-CQI-${suffix}`,
        cycle: { ref: `CYC-SMOKE-${suffix}`, version: '1.0.0', status: 'active' },
        query_set: {
          ref: `QS-SMOKE-${suffix}`,
          version: '1.0.0',
          content_sha256: hash(`query-set:${suffix}`)
        },
        queries: [{
          ref: `Q-SMOKE-${suffix}`,
          version: '1.0.0',
          query_text: queryText,
          language: 'en-US',
          ordinal: 1
        }],
        platform: {
          id: 'fixture',
          entry_url: 'http://127.0.0.1:9321/task',
          execution_mode: 'dom_automation',
          policy_status: 'allowed',
          profile_ref: `CPF-SMOKE-${suffix}`,
          profile_version: '1.0.0',
          authorization_ref: 'fixture://browser-query-live-smoke',
          authorization_sha256: hash(`authorization:${suffix}`)
        },
        registered_at: new Date().toISOString()
      }
    }
  })
  assert.equal(registered.isError, undefined)
  const cycleInput = registered.structuredContent.data.input

  const created = await product('/api/browser-query/tasks', {
    schema_version: 'geo-browser-query-task-create-v1',
    request_id: `REQ-SMOKE-BQT-${suffix}`,
    input_id: cycleInput.input_id,
    input_fingerprint: cycleInput.fingerprint,
    created_at: new Date().toISOString()
  })
  const taskId = created.task.task_id
  const claimed = await product(`/api/browser-query/tasks/${taskId}/claim`, {
    expected_revision: created.task.revision,
    now: new Date().toISOString()
  })
  let task = claimed.task
  const attemptId = claimed.attempt.attempt_id
  for (const [stage, extra] of [
    ['checking_login', {}],
    ['ready', {
      conversation_state: 'new',
      conversation_proof: { kind: 'fresh_tab_entry', url: 'http://127.0.0.1:9321/task' }
    }],
    ['submitted', {}],
    ['waiting_response', {}]
  ]) {
    const advanced = await product(`/api/browser-query/tasks/${taskId}/advance`, {
      attempt_id: attemptId,
      expected_revision: task.revision,
      stage,
      ...extra,
      now: new Date().toISOString()
    })
    task = advanced.task
  }
  const answerHtml = '<article class="answer"><p>Synthetic fixture answer.</p></article>'
  const captured = await product(`/api/browser-query/tasks/${taskId}/capture`, {
    schema_version: 'geo-browser-query-capture-submission-v1',
    attempt_id: attemptId,
    expected_revision: task.revision,
    outcome: 'success',
    answer_html: answerHtml,
    answer_text: 'Synthetic fixture answer.',
    citations: [],
    result_url: `http://127.0.0.1:9321/result?conversation=${suffix}`,
    detector_diagnostics: { smoke: true },
    captured_at: new Date().toISOString()
  })
  assert.equal(captured.task.status, 'completed')
  assert.equal(captured.extraction.status, 'completed')

  const pendingResponse = await client.callTool({
    name: 'list_pending_query_results',
    arguments: { task_id: taskId, limit: 10 }
  })
  const pending = pendingResponse.structuredContent.data.items[0]
  assert.equal(pending.result_id, captured.pending.result_id)
  const resultResponse = await client.callTool({
    name: 'get_query_result',
    arguments: { result_id: pending.result_id }
  })
  assert.equal(resultResponse.structuredContent.data.capture.answer_text, 'Synthetic fixture answer.')
  assert.equal(JSON.stringify(pendingResponse.structuredContent).includes(answerHtml), false)

  const chunks = []
  let offset = 0
  let complete = false
  while (!complete) {
    const artifactResponse = await client.callTool({
      name: 'get_query_result_artifact',
      arguments: {
        result_id: pending.result_id,
        artifact_id: pending.raw_artifact_id,
        offset,
        max_bytes: 16
      }
    })
    const chunk = artifactResponse.structuredContent.data
    chunks.push(Buffer.from(chunk.data_base64, 'base64'))
    if (chunk.next_offset === null) complete = true
    else offset = chunk.next_offset
  }
  const raw = Buffer.concat(chunks)
  assert.equal(raw.toString('utf8'), answerHtml)
  assert.equal(hash(raw), pending.raw_sha256)

  const acknowledged = await client.callTool({
    name: 'acknowledge_query_result',
    arguments: {
      result_id: pending.result_id,
      capture_sha256: pending.capture_sha256,
      extraction_sha256: pending.extraction_sha256,
      receiver_fingerprint: hash(`receiver:${suffix}`),
      received_at: new Date().toISOString()
    }
  })
  assert.equal(acknowledged.structuredContent.action, 'acknowledged')
  process.stdout.write(`${JSON.stringify({
    ok: true,
    protocol_era: client.getProtocolEra(),
    task_id: taskId,
    result_id: pending.result_id,
    raw_sha256: pending.raw_sha256
  }, null, 2)}\n`)
} finally {
  await client.close()
}
