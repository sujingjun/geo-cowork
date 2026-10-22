import { defineNuxtModule } from 'nuxt/kit'
import { watch } from 'chokidar'
import path from 'node:path'
import { catalog } from '../lib/build-context'
import { supportedPath } from '../lib/workspace'

export default defineNuxtModule({
  meta: { name: 'knowledge-reader' },
  setup(_options, nuxt) {
    if (!catalog) {
      if (!nuxt.options._prepare) throw new Error('请通过 npm run dev:knowledge -- --workspace <路径> 指定工作区')
      return
    }
    for (const warning of catalog.warnings) console.warn(`[knowledge] ${warning}`)
    if (!nuxt.options.dev || nuxt.options._prepare) return
    const activeCatalog = catalog
    const root = activeCatalog.workspace.root
    // 关联、译文状态和引用清单是跨文件派生信息，变更后完整重建同一内容索引。
    const watcher = watch([
      path.join(root, 'knowledge'), path.join(root, 'evidence/sources'),
      path.join(root, 'evidence/snapshots'), path.join(root, 'workspace.json')
    ], { ignoreInitial: true, followSymlinks: false, awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 } })
    let timer: ReturnType<typeof setTimeout> | undefined
    let closing = false
    watcher.on('all', (_event, filename) => {
      if (closing) return
      const relative = path.relative(root, filename).split(path.sep).join('/')
      if (relative !== 'workspace.json' && !supportedPath(relative)) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        console.info('[knowledge] 来源变化，正在刷新内容及关联索引')
        void nuxt.callHook('restart', { hard: true })
      }, 250)
    })
    nuxt.hook('close', async () => {
      closing = true
      clearTimeout(timer)
      await watcher.close()
    })
  }
})
