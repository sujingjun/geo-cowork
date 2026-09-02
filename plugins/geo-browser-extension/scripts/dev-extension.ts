/**
 * Extension dev watch script — rebuilds the loadable extension in
 * `.output/extension/` whenever source files change.
 *
 * Two tiers:
 *   - FAST (sub-second): `extension/`, `manifest.json`, `public/icons/`
 *     → esbuild recompile + re-copy only. No Nuxt rebuild.
 *   - FULL (slow, debounced): `app/`, `nuxt.config.ts`, other `public/` files
 *     → `nuxt generate` + copy + reference fix + inline-script (CSP) extraction.
 *
 * Rebuilds are serialized through a single promise chain so a fast rebuild
 * never interleaves with a full one mid-clean.
 *
 * Usage:
 *   pnpm dev:extension
 * Then load `.output/extension/` in chrome://extensions (Load unpacked) and
 * click the reload icon on the extension card after each rebuild.
 */

import { watch, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildExtension, buildExtensionCore } from './build-extension'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

const WATCH = {
  extensionSrc: join(projectRoot, 'extension'),
  appSrc: join(projectRoot, 'app'),
  publicDir: join(projectRoot, 'public'),
  iconsDir: join(projectRoot, 'public', 'icons'),
  manifest: join(projectRoot, 'manifest.json'),
  nuxtConfig: join(projectRoot, 'nuxt.config.ts')
}

// ─── Serialize all rebuilds through one chain ────────────────────────

let chain: Promise<void> = Promise.resolve()
function enqueue(label: string, task: () => void) {
  chain = chain.then(() => {
    const start = Date.now()
    try {
      task()
      console.log(`\n[dev-extension] ✅ ${label} done in ${Date.now() - start}ms — reload the extension in chrome://extensions`)
    } catch (err) {
      console.error(`\n[dev-extension] ❌ ${label} failed:`, err)
    }
  })
}

// ─── Debounce ────────────────────────────────────────────────────────

function debounce(fn: () => void, ms: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(fn, ms)
  }
}

const scheduleFast = debounce(() => {
  enqueue('Fast rebuild (extension core)', () => buildExtensionCore())
}, 150)

const scheduleFull = debounce(() => {
  enqueue('Full rebuild (Nuxt popup + extension)', () => buildExtension({ generate: true }))
}, 1500)

// ─── Watchers ────────────────────────────────────────────────────────

function watchDir(dir: string, onEvent: (filename: string | null) => void) {
  if (!existsSync(dir)) {
    console.warn(`[dev-extension] Watch dir missing, skipping: ${dir}`)
    return
  }
  // `recursive: true` is supported on macOS and Windows.
  watch(dir, { recursive: true }, (_event, filename) => {
    if (!filename) return
    // Ignore editor/OS noise.
    if (filename.endsWith('.DS_Store') || filename.includes('~')) return
    onEvent(filename)
  })
}

function startWatching() {
  // Fast tier: extension scripts.
  watchDir(WATCH.extensionSrc, (f) => {
    console.log(`[dev-extension] extension changed: ${f}`)
    scheduleFast()
  })

  // Fast tier: manifest.
  watch(WATCH.manifest, () => {
    console.log('[dev-extension] manifest.json changed')
    scheduleFast()
  })

  // Public assets: icons → fast; anything else (e.g. favicon) → full.
  watchDir(WATCH.publicDir, (f) => {
    if (f && f.startsWith('icons')) {
      console.log(`[dev-extension] icon changed: ${f}`)
      scheduleFast()
    } else {
      console.log(`[dev-extension] public asset changed: ${f}`)
      scheduleFull()
    }
  })

  // Full tier: Nuxt app source.
  watchDir(WATCH.appSrc, (f) => {
    console.log(`[dev-extension] app changed: ${f}`)
    scheduleFull()
  })

  // Full tier: Nuxt config.
  if (existsSync(WATCH.nuxtConfig)) {
    watch(WATCH.nuxtConfig, () => {
      console.log('[dev-extension] nuxt.config.ts changed')
      scheduleFull()
    })
  }
}

// ─── Main ────────────────────────────────────────────────────────────

console.log('='.repeat(60))
console.log('  Creator Workbench - Extension Dev Watch')
console.log('='.repeat(60))
console.log('  Watching:')
console.log('    extension/      → fast rebuild (esbuild)')
console.log('    manifest.json   → fast rebuild')
console.log('    public/icons/   → fast rebuild')
console.log('    app/            → full rebuild (nuxt generate)')
console.log('    nuxt.config.ts  → full rebuild')
console.log('='.repeat(60))

// Initial full build, then watch.
enqueue('Initial build', () => {
  buildExtension({ generate: true })
  startWatching()
  console.log('\n[dev-extension] 👀 Watching for changes... (Ctrl+C to stop)')
})
