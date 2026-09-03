import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const projectRoot = resolve(import.meta.dirname, '..')
const extensionOutput = resolve(projectRoot, '.output/extension')

function buildExtension() {
  execFileSync(process.execPath, ['scripts/build-extension.mjs'], {
    cwd: projectRoot,
    stdio: 'pipe'
  })
}

test('构建 MV3 Side Panel 并通过最小权限连接 loopback 任务服务', async () => {
  buildExtension()
  const manifest = JSON.parse(readFileSync(resolve(extensionOutput, 'manifest.json'), 'utf8'))
  const sidePanelHtml = readFileSync(resolve(extensionOutput, 'sidepanel/index.html'), 'utf8')
  const sidePanelScript = readFileSync(resolve(extensionOutput, 'sidepanel/sidepanel.js'), 'utf8')

  assert.equal(manifest.manifest_version, 3)
  assert.deepEqual(manifest.permissions, ['clipboardWrite', 'sidePanel', 'scripting', 'storage', 'tabs'])
  assert.deepEqual(manifest.host_permissions, [
    'http://127.0.0.1/*'
  ])
  assert.equal(manifest.background.service_worker, 'service-worker.js')
  assert.equal(manifest.side_panel.default_path, 'sidepanel/index.html')
  assert.equal(manifest.action.default_popup, undefined)
  assert.match(sidePanelHtml, /id="capture-form"/)
  assert.match(sidePanelHtml, /id="cycle-input"/)
  assert.match(sidePanelHtml, /id="create-task"/)
  assert.match(sidePanelHtml, /id="continue-query"/)
  assert.match(sidePanelHtml, /id="answer-html"/)
  assert.match(sidePanelHtml, /id="retry-query"/)
  assert.doesNotMatch(sidePanelHtml, /<script(?![^>]*\bsrc=)[^>]*>/i)
  assert.doesNotMatch(sidePanelHtml, /\son\w+\s*=/i)
  assert.ok(
    sidePanelScript.indexOf('requestPlatformPermission(globalThis.chrome')
    < sidePanelScript.indexOf('await client.claim(taskState.task_id'),
    '首次权限请求必须在其他 await 之前发起'
  )
  for (const file of [
    'service-worker.js',
    'service-worker-core.js',
    'page-context.js',
    'query-task-client.js',
    'query-task-checkpoint.js',
    'query-task-error-policy.js',
    'platform-runner.js',
    'sidepanel/sidepanel.js',
    'sidepanel/panel.js',
    'sidepanel/sidepanel.css'
  ]) assert.equal(existsSync(resolve(extensionOutput, file)), true, file)
})

test('Service Worker 继续提供活动页上下文', async () => {
  buildExtension()
  const coreUrl = `${pathToFileURL(resolve(extensionOutput, 'service-worker-core.js')).href}?test=${Date.now()}`
  const { registerServiceWorker } = await import(coreUrl)
  let messageHandler
  let panelBehavior
  const chromeApi = {
    sidePanel: {
      async setPanelBehavior(value) {
        panelBehavior = value
      }
    },
    runtime: {
      onMessage: {
        addListener(handler) {
          messageHandler = handler
        }
      }
    },
    tabs: {
      async query() {
        return [{ title: 'GEO 测试页面', url: 'https://example.com/query' }]
      }
    }
  }
  await registerServiceWorker(chromeApi)
  assert.deepEqual(panelBehavior, { openPanelOnActionClick: true })
  const response = await new Promise((resolveResponse) => {
    assert.equal(messageHandler({ type: 'GET_ACTIVE_PAGE_CONTEXT' }, {}, resolveResponse), true)
  })
  assert.deepEqual(response, {
    ok: true,
    context: {
      available: true,
      title: 'GEO 测试页面',
      url: 'https://example.com/query'
    }
  })
})

test('自动化 runner 只在 allowed 模式打开新会话、检查登录并回传完整回答 HTML', async () => {
  const runnerUrl = `${pathToFileURL(resolve(extensionOutput, 'platform-runner.js')).href}?test=${Date.now()}`
  const {
    capturePreparedPlatformResult,
    prepareAutomatedPlatformQuery,
    requestPlatformPermission,
    runAutomatedPlatformQuery,
    waitForPlatformTab
  } = await import(runnerUrl)
  const scriptCalls = []
  let submitted = false
  let submittedCheckpoint
  const chromeApi = {
    permissions: {
      async request(value) {
        assert.deepEqual(value, { origins: ['https://allowed.example/*'] })
        return true
      }
    },
    tabs: {
      async create(value) {
        assert.deepEqual(value, { url: 'http://127.0.0.1:9321/task', active: true })
        return { id: 7, url: value.url, status: 'complete' }
      },
      async get() {
        return { id: 7, status: 'complete' }
      },
      onUpdated: {
        addListener() {},
        removeListener() {}
      }
    },
    scripting: {
      async executeScript(value) {
        scriptCalls.push(value)
        if (scriptCalls.length === 1) return [{ result: { login_state: 'logged_in' } }]
        if (scriptCalls.length === 2) return [{ result: { ok: true, before_count: 0 } }]
        assert.doesNotMatch(value.func.toString(), /\b(?:setting|normalizedCitation)\s*\(/)
        return [{ result: {
          ok: true,
          answer_html: '<article class="answer"><p>完整 fixture 回答</p></article>',
          answer_text: '完整 fixture 回答',
          citations: [{
            ordinal: 1,
            href_raw: 'https://source.example/page',
            href_normalized: 'https://source.example/page',
            title: 'Source',
            anchor_or_context: ''
          }],
          result_url: 'http://127.0.0.1:9321/result',
          detector_diagnostics: { answer_count_before: 0, answer_count_after: 1 }
        } }]
      }
    }
  }
  assert.equal(await requestPlatformPermission(chromeApi, {
    entry_url: 'https://allowed.example/task',
    execution_mode: 'dom_automation',
    policy: { status: 'allowed' }
  }), true)
  const platform = {
    entry_url: 'http://127.0.0.1:9321/task',
    execution_mode: 'dom_automation',
    policy: { status: 'allowed' },
    selectors: {
      input: '#prompt', submit: '#submit', answer: '.answer', citation: 'a',
      timeout_ms: 1_000, stable_ms: 250
    }
  }
  const prepared = await prepareAutomatedPlatformQuery(chromeApi, platform)
  assert.equal(prepared.login_state, 'logged_in')
  assert.equal(prepared.conversation_state, 'new')
  const result = await runAutomatedPlatformQuery(
    chromeApi,
    platform,
    'What is MyyShop?',
    prepared,
    { onSubmitted: async (checkpoint) => {
      submitted = true
      submittedCheckpoint = checkpoint
    } }
  )
  assert.equal(scriptCalls[1].args[0], 'What is MyyShop?')
  assert.equal(submitted, true)
  assert.equal(submittedCheckpoint.before_count, 0)
  assert.equal(result.answer_text, '完整 fixture 回答')
  assert.match(result.answer_html, /<article/)
  assert.equal(result.ok, undefined)
  const resumedCapture = await capturePreparedPlatformResult(chromeApi, platform, {
    ...prepared,
    before_count: 0
  })
  assert.equal(resumedCapture.answer_html, result.answer_html)
  chromeApi.scripting.executeScript = async () => [{
    result: { ok: false, stage: 'submitted', error: 'transport lost after submit' }
  }]
  await assert.rejects(
    runAutomatedPlatformQuery(chromeApi, platform, 'test'),
    error => error.stage === 'submitted'
  )
  await assert.rejects(
    runAutomatedPlatformQuery(chromeApi, { ...platform, policy: { status: 'manual_only' } }, 'test'),
    /未获 DOM 自动化许可/
  )

  let reads = 0
  const racedChrome = {
    tabs: {
      async get() {
        reads += 1
        return { id: 8, status: reads < 3 ? 'loading' : 'complete' }
      },
      onUpdated: { addListener() {}, removeListener() {} }
    }
  }
  assert.equal((await waitForPlatformTab(racedChrome, 8, 250)).status, 'complete')
  assert.equal(reads, 3)
})

test('Query Task client 只连接 loopback 并携带临时 token', async () => {
  const clientUrl = `${pathToFileURL(resolve(extensionOutput, 'query-task-client.js')).href}?test=${Date.now()}`
  const { QueryTaskClient } = await import(clientUrl)
  const client = new QueryTaskClient({
    token: 'fixture-session-token-123456',
    fetchImpl: async function (url, init) {
      assert.equal(this, globalThis)
      assert.equal(url, 'http://127.0.0.1:4319/api/browser-query/inputs')
      assert.equal(init.method, 'GET')
      assert.equal(init.headers.Authorization, 'Bearer fixture-session-token-123456')
      return new Response(JSON.stringify({ items: [{ input_id: 'CQI-TEST-001' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  })
  assert.equal((await client.listInputs()).items[0].input_id, 'CQI-TEST-001')
  assert.throws(
    () => new QueryTaskClient({ baseUrl: 'https://example.com', token: 'fixture-session-token-123456' }),
    /任务服务地址必须/
  )
})

test('Query checkpoint survives a fresh store instance without persisting tokens', async () => {
  const checkpointUrl = `${pathToFileURL(resolve(extensionOutput, 'query-task-checkpoint.js')).href}?test=${Date.now()}`
  const { BrowserTaskCheckpointStore } = await import(checkpointUrl)
  const values = {}
  const storage = {
    async get(key) { return { [key]: values[key] } },
    async set(patch) { Object.assign(values, patch) },
    async remove(key) { delete values[key] }
  }
  const first = new BrowserTaskCheckpointStore(storage)
  await first.save('BQT-TEST-001', {
    schema_version: 'geo-browser-extension-checkpoint-v1',
    task_id: 'BQT-TEST-001',
    attempt_id: 'hash/attempt-1',
    tab_id: 7,
    stage: 'checking_login',
    updated_at: '2026-09-03T05:00:00Z'
  })
  const restored = await new BrowserTaskCheckpointStore(storage).load('BQT-TEST-001')
  assert.equal(restored.tab_id, 7)
  assert.doesNotMatch(JSON.stringify(values), /token|authorization/i)
})

test('errors after submitted or waiting_response never reopen automatic Query retry', async () => {
  const policyUrl = `${pathToFileURL(resolve(extensionOutput, 'query-task-error-policy.js')).href}?test=${Date.now()}`
  const { isPostSubmitFailure } = await import(policyUrl)
  assert.equal(isPostSubmitFailure(new Error('capture rejected'), 'waiting_response'), true)
  assert.equal(isPostSubmitFailure({ stage: 'submitted' }, 'ready'), true)
  assert.equal(isPostSubmitFailure(new Error('input missing'), 'ready'), false)
})
