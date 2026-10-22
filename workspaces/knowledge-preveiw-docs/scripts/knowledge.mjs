import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { resolveWorkspace } from '../lib/workspace.ts'

const [command, ...args] = process.argv.slice(2)
try {
  if (!['dev', 'build'].includes(command)) throw new Error('支持命令：dev、build')
  const index = args.indexOf('--workspace')
  if (index < 0 || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error('必须提供 --workspace <路径>')
  const workspace = resolveWorkspace(path.resolve(process.cwd(), args[index + 1]))
  args.splice(index, 2)
  const appRoot = fileURLToPath(new URL('../', import.meta.url))
  const child = spawn('pnpm', ['exec', 'nuxt', command, ...(command === 'dev' ? ['--host', '127.0.0.1'] : []), ...args], {
    cwd: appRoot, stdio: 'inherit', env: { ...process.env, GEO_KNOWLEDGE_WORKSPACE: workspace.root }
  })
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
  child.on('error', (error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  child.on('exit', (code) => {
    process.exitCode = code ?? 1
  })
} catch (error) {
  console.error(`[knowledge] ${error.message}`)
  process.exitCode = 1
}
