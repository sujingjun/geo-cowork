import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

import { observeBuiltRoutes } from '../tests/extension/router-build-harness'
import { routerCases } from '../tests/extension/router-cases'

const projectRoot = resolve(import.meta.dirname, '..')

function runPnpm(args: string[], env = process.env) {
  execFileSync('pnpm', args, {
    cwd: projectRoot,
    env,
    stdio: 'inherit'
  })
}

async function verifyBuild(mode: 'web' | 'extension', buildDir: string) {
  const requests = routerCases.map(({ route, expectedTitle, expectedText }) => ({
    initialPath: mode === 'extension' ? `/index.html#${route}` : route,
    expectedTitle,
    expectedText
  }))
  const observedUrls = await observeBuiltRoutes(buildDir, requests)

  for (const [index, { route }] of routerCases.entries()) {
    const observedUrl = new URL(observedUrls[index])
    assert.equal(observedUrl.pathname, mode === 'extension' ? '/index.html' : route)
    assert.equal(observedUrl.hash, mode === 'extension' ? `#${route}` : '')
    assert.equal((observedUrl.href.match(/#/g) || []).length, mode === 'extension' ? 1 : 0)
  }
  console.log(`[router-builds] ${mode} 三路由已通过 Nuxt 就绪与 URL 检查`)
}

const webEnv = { ...process.env }
delete webEnv.EXTENSION_BUILD
delete webEnv.EXTENSION_LOCAL_TEST

console.log('[router-builds] 生成普通 Web 产物...')
runPnpm(['exec', 'nuxt', 'generate'], webEnv)
await verifyBuild('web', '.output/public')

console.log('[router-builds] 生成扩展测试产物...')
runPnpm(['build:extension:test'])
await verifyBuild('extension', '.output/extension')
