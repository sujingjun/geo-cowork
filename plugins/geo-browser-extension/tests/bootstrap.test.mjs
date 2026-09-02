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
  assert.deepEqual(manifest.permissions, ['clipboardWrite', 'sidePanel', 'scripting', 'tabs'])
  assert.deepEqual(manifest.host_permissions, [
    'http://127.0.0.1/*'
  ])
  assert.equal(manifest.background.service_worker, 'service-worker.js')
  assert.equal(manifest.side_panel.default_path, 'sidepanel/index.html')
  assert.equal(manifest.action.default_popup, undefined)
  assert.match(sidePanelHtml, /id="capture-form"/)
  assert.match(sidePanelHtml, /id="retry-query"/)
  assert.doesNotMatch(sidePanelHtml, /<script(?![^>]*\bsrc=)[^>]*>/i)
  assert.doesNotMatch(sidePanelHtml, /\son\w+\s*=/i)
  assert.ok(
    sidePanelScript.indexOf('requestPlatformPermission(globalThis.chrome')
    < sidePanelScript.indexOf('await client.start(query.ref)'),
    '首次权限请求必须在其他 await 之前发起'
  )
  for (const file of [
    'service-worker.js',
    'service-worker-core.js',
    'page-context.js',
    'query-task-client.js',
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

test('自动化 runner 只在 allowed 模式申请精确 origin 并回传完整采集', async () => {
  const runnerUrl = `${pathToFileURL(resolve(extensionOutput, 'platform-runner.js')).href}?test=${Date.now()}`
  const { requestPlatformPermission, runAutomatedPlatformQuery } = await import(runnerUrl)
  let scriptArgs
  const chromeApi = {
    permissions: {
      async request(value) {
        assert.deepEqual(value, { origins: ['https://allowed.example/*'] })
        return true
      }
    },
    tabs: {
      async query() {
        return [{ id: 7, url: 'http://127.0.0.1:9321/task', status: 'complete' }]
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
        scriptArgs = value.args
        return [{ result: {
          answer_text: '完整 fixture 回答',
          citations: [{ url: 'https://source.example/page', title: 'Source', context: '' }],
          result_url: 'http://127.0.0.1:9321/result'
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
  const result = await runAutomatedPlatformQuery(chromeApi, platform, 'What is MyyShop?')
  assert.equal(scriptArgs[0], 'What is MyyShop?')
  assert.equal(result.answer_text, '完整 fixture 回答')
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
})

test('Query Task client 只连接 loopback 并携带临时 token', async () => {
  const clientUrl = `${pathToFileURL(resolve(extensionOutput, 'query-task-client.js')).href}?test=${Date.now()}`
  const { QueryTaskClient } = await import(clientUrl)
  const client = new QueryTaskClient({
    token: 'fixture-session-token-123456',
    fetchImpl: async (url, init) => {
      assert.equal(url, 'http://127.0.0.1:4319/api/task')
      assert.equal(init.method, 'GET')
      assert.equal(init.headers.Authorization, 'Bearer fixture-session-token-123456')
      return new Response(JSON.stringify({ action: 'resumed', state: { task_id: 'BQT-TEST-001' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  })
  assert.equal((await client.load()).state.task_id, 'BQT-TEST-001')
  assert.throws(
    () => new QueryTaskClient({ baseUrl: 'https://example.com', token: 'fixture-session-token-123456' }),
    /任务服务地址必须/
  )
})
