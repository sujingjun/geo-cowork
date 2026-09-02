import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { extname, join, resolve, sep } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

import type {
  BuiltRouteRequest,
  CdpMessage,
  ChromeTarget,
  PageObservation
} from './router-build-harness.types'

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const projectRoot = resolve(import.meta.dirname, '../..')

function contentType(filePath: string): string {
  switch (extname(filePath)) {
    case '.css': return 'text/css'
    case '.html': return 'text/html; charset=utf-8'
    case '.js': return 'text/javascript'
    case '.json': return 'application/json'
    case '.png': return 'image/png'
    case '.woff2': return 'font/woff2'
    default: return 'application/octet-stream'
  }
}

function apiFixture(pathname: string): unknown {
  if (pathname === '/api/chats') return []
  if (pathname === '/api/_auth/session') return null
  if (pathname === '/api/creators') return { items: [], total: 0, page: 1, pageSize: 20 }
  if (pathname === '/api/creators/stats') {
    return { total: 0, bySource: {}, byStatus: {}, followerBuckets: {} }
  }
  return undefined
}

async function createChromeTarget(port: number, url: string): Promise<ChromeTarget> {
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, {
    method: 'PUT'
  })
  if (!targetResponse.ok) throw new Error(`无法创建 Chrome 页面：${targetResponse.status}`)
  return await targetResponse.json() as ChromeTarget
}

async function connectCdp(webSocketUrl: string) {
  const socket = new WebSocket(webSocketUrl)
  await new Promise<void>((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', () => resolveOpen(), { once: true })
    socket.addEventListener('error', () => rejectOpen(new Error('无法连接 Chrome 调试端口')), { once: true })
  })
  let nextId = 0
  const pending = new Map<number, {
    resolve: (message: CdpMessage) => void
    reject: (error: Error) => void
  }>()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data)) as CdpMessage
    if (!message.id || !pending.has(message.id)) return
    const request = pending.get(message.id)!
    pending.delete(message.id)
    if (message.error) request.reject(new Error(message.error.message))
    else request.resolve(message)
  })

  return {
    call(method: string, params: Record<string, unknown> = {}) {
      const id = ++nextId
      return new Promise<CdpMessage>((resolveCall, rejectCall) => {
        pending.set(id, { resolve: resolveCall, reject: rejectCall })
        socket.send(JSON.stringify({ id, method, params }))
      })
    },
    close() {
      socket.close()
    }
  }
}

async function observeChromeTarget(
  port: number,
  url: string,
  request: BuiltRouteRequest
): Promise<string> {
  const target = await createChromeTarget(port, url)
  const cdp = await connectCdp(target.webSocketDebuggerUrl)
  const expectedTitle = JSON.stringify(request.expectedTitle)
  const expectedText = JSON.stringify(request.expectedText)

  try {
    await cdp.call('Runtime.enable')
    let lastObservation: PageObservation | undefined
    for (let attempt = 0; attempt < 60; attempt++) {
      const evaluation = await cdp.call('Runtime.evaluate', {
        expression: `(() => {
          const root = document.querySelector('#__nuxt')
          return {
            href: location.href,
            nuxtReady: Boolean(root?.firstElementChild),
            textSample: root?.textContent?.slice(0, 1000),
            textReady: Boolean(root?.textContent?.includes(${expectedText})),
            titleReady: document.title.includes(${expectedTitle})
          }
        })()`,
        returnByValue: true
      })
      const observation = evaluation.result?.result?.value as PageObservation | undefined
      lastObservation = observation
      if (
        observation?.href
        && observation.nuxtReady
        && observation.textReady
        && observation.titleReady
      ) {
        return observation.href
      }
      await delay(100)
    }
    throw new Error(`Nuxt 路由页面未就绪：${request.initialPath} ${JSON.stringify(lastObservation)}`)
  } finally {
    cdp.close()
    await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => undefined)
  }
}

async function startChrome(profileDir: string) {
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-background-networking',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profileDir}`,
    '--remote-debugging-port=0',
    'about:blank'
  ], { stdio: 'ignore' })
  const portFile = join(profileDir, 'DevToolsActivePort')

  for (let attempt = 0; attempt < 100; attempt++) {
    if (existsSync(portFile)) {
      const [port] = readFileSync(portFile, 'utf-8').split('\n')
      return { chrome, port: Number(port) }
    }
    if (chrome.exitCode != null) throw new Error(`Chrome 提前退出：${chrome.exitCode}`)
    await delay(50)
  }
  chrome.kill('SIGTERM')
  throw new Error('Chrome 调试端口启动超时')
}

export async function observeBuiltRoutes(
  buildDir: string,
  requests: BuiltRouteRequest[]
): Promise<string[]> {
  if (!existsSync(chromePath)) throw new Error(`未找到 Chrome：${chromePath}`)
  const absoluteBuildDir = resolve(projectRoot, buildDir)
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
    const fixture = apiFixture(pathname)
    if (fixture !== undefined || pathname === '/api/_auth/session') {
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(fixture))
      return
    }
    let filePath = join(absoluteBuildDir, pathname === '/' ? 'index.html' : pathname.slice(1))
    if (!filePath.startsWith(`${absoluteBuildDir}${sep}`)) {
      response.writeHead(403).end()
      return
    }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html')
    if (!existsSync(filePath)) filePath = join(absoluteBuildDir, 'index.html')

    response.setHeader('Content-Type', contentType(filePath))
    response.end(readFileSync(filePath))
  })
  await new Promise<void>(resolveListen => server.listen(0, '127.0.0.1', resolveListen))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('无法启动路由测试服务器')
  const profileDir = mkdtempSync(join(tmpdir(), 'creator-workbench-router-'))
  let chrome: ReturnType<typeof spawn> | undefined

  try {
    const startedChrome = await startChrome(profileDir)
    chrome = startedChrome.chrome
    const observedUrls: string[] = []
    for (const request of requests) {
      observedUrls.push(await observeChromeTarget(
        startedChrome.port,
        `http://127.0.0.1:${address.port}${request.initialPath}`,
        request
      ))
    }
    return observedUrls
  } finally {
    if (chrome?.exitCode == null) {
      const exited = new Promise<void>(resolveExit => chrome!.once('exit', () => resolveExit()))
      chrome.kill('SIGTERM')
      await Promise.race([exited, delay(2000)])
      if (chrome.exitCode == null) chrome.kill('SIGKILL')
    }
    await new Promise<void>(resolveClose => server.close(() => resolveClose()))
    rmSync(profileDir, { recursive: true, force: true })
  }
}
