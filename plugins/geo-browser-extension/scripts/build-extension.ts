/**
 * Build post-processing script.
 *
 * After `nuxt generate` produces static output in `.output/public/`,
 * this script:
 *   1. Copies manifest.json
 *   2. Copies extension scripts (compiled to JS)
 *   3. Copies icons
 *   4. Renames files starting with "_" (Chrome restriction)
 *   5. Fixes references to renamed files
 *   6. Produces a loadable Chrome extension directory
 *
 * Usage:
 *   pnpm run build:extension
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

const OUTPUT_DIR = join(projectRoot, '.output', 'public')
const EXTENSION_DIR = join(projectRoot, '.output', 'extension')
const EXTENSION_SRC = join(projectRoot, 'extension')
const MANIFEST_SRC = join(projectRoot, 'manifest.json')
const ICONS_SRC = join(projectRoot, 'public', 'icons')
const IS_LOCAL_TEST_BUILD = process.env.EXTENSION_LOCAL_TEST === '1'

function runNuxtGenerate() {
  console.log('[build-extension] Running nuxt generate...')
  execSync('nuxt generate', {
    cwd: projectRoot,
    env: { ...process.env, EXTENSION_BUILD: '1' },
    stdio: 'inherit'
  })
}

export function compileExtensionScripts() {
  console.log('[build-extension] Compiling extension scripts...')
  const esbuildBin = join(projectRoot, 'node_modules', '.bin', 'esbuild')
  const esbuild = existsSync(esbuildBin) ? esbuildBin : 'npx esbuild'

  const scripts = [
    { input: 'background.ts', output: 'background.js' },
    { input: 'content.ts', output: 'content.js' },
    { input: 'inject.ts', output: 'inject.js' },
    { input: 'tiktok-inject.ts', output: 'tiktok-inject.js' },
    { input: 'bridge.ts', output: 'bridge.js' }
  ]

  for (const { input, output } of scripts) {
    const inputPath = join(EXTENSION_SRC, input)
    if (!existsSync(inputPath)) {
      console.warn(`[build-extension] Warning: ${input} not found, skipping`)
      continue
    }
    execSync(
      `${esbuild} "${inputPath}" --bundle --format=iife --target=es2020 --define:__CREATOR_WORKBENCH_LOCAL_TEST__=${IS_LOCAL_TEST_BUILD} --outfile="${join(EXTENSION_DIR, output)}"`,
      { cwd: projectRoot, stdio: 'inherit' }
    )
  }
}

export function copyManifest() {
  console.log('[build-extension] Copying manifest.json...')
  if (!existsSync(MANIFEST_SRC)) {
    throw new Error('manifest.json not found at project root')
  }
  const manifest = JSON.parse(readFileSync(MANIFEST_SRC, 'utf-8'))
  if (IS_LOCAL_TEST_BUILD) {
    manifest.host_permissions = [
      'http://localhost:3000/*',
      ...(manifest.host_permissions || [])
    ]
  }
  writeFileSync(
    join(EXTENSION_DIR, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf-8'
  )
}

export function copyIcons() {
  console.log('[build-extension] Copying icons...')
  const destIcons = join(EXTENSION_DIR, 'icons')
  mkdirSync(destIcons, { recursive: true })

  if (existsSync(ICONS_SRC)) {
    const files = readdirSync(ICONS_SRC)
    for (const file of files) {
      if (file.endsWith('.png')) {
        copyFileSync(join(ICONS_SRC, file), join(destIcons, file))
      }
    }
  }

  if (!existsSync(join(destIcons, 'icon-128.png'))) {
    console.warn('[build-extension] Warning: No PNG icons found. Place icons in public/icons/')
  }
}

/**
 * Copy a directory, renaming files/dirs starting with "_" to "cw" prefix.
 * Chrome extensions disallow filenames starting with "_".
 */
function copyDirSafe(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const safeName = entry.name.startsWith('_') ? 'cw' + entry.name.slice(1) : entry.name
    const destPath = join(dest, safeName)
    if (entry.isDirectory()) {
      copyDirSafe(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

function copyNuxtOutput() {
  console.log('[build-extension] Copying Nuxt static output...')
  if (!existsSync(OUTPUT_DIR)) {
    throw new Error('Nuxt output not found. Run `nuxt generate` first.')
  }
  const entries = readdirSync(OUTPUT_DIR, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(OUTPUT_DIR, entry.name)
    const safeName = entry.name.startsWith('_') ? 'cw' + entry.name.slice(1) : entry.name
    const destPath = join(EXTENSION_DIR, safeName)
    if (entry.isDirectory()) {
      copyDirSafe(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * Fix references to renamed files in HTML/JS/CSS.
 * 1. Renames files starting with "_" to "cw" prefix
 * 2. Converts absolute paths (/assets/) to relative (./assets/) for Chrome extension
 */
function fixReferences() {
  console.log('[build-extension] Fixing file references...')

  function processFile(filePath: string) {
    let content = readFileSync(filePath, 'utf-8')
    let updated = false

    // Fix: assets/_xxx → assets/cwxxx
    if (content.includes('assets/_')) {
      content = content.replace(/(assets\/)_/g, '$1cw')
      updated = true
    }

    // Fix: /_nuxt/ → /assets/ (legacy)
    if (content.includes('/_nuxt/')) {
      content = content.replace(/\/_nuxt\//g, '/assets/')
      updated = true
    }

    // Fix: fonts/_xxx → fonts/cwxxx
    if (content.includes('fonts/_')) {
      content = content.replace(/(fonts\/)_/g, '$1cw')
      updated = true
    }

    // Fix: absolute paths → relative paths for Chrome extension
    // /assets/ → ./assets/, /fonts/ → ./fonts/
    if (content.includes('"/assets/') || content.includes('\'/assets/')) {
      content = content.replace(/(["'])\/assets\//g, '$1./assets/')
      updated = true
    }
    if (content.includes('"/fonts/') || content.includes('\'/fonts/')) {
      content = content.replace(/(["'])\/fonts\//g, '$1./fonts/')
      updated = true
    }

    // Fix: __NUXT__ config baseURL
    if (content.includes('baseURL:"/"')) {
      content = content.replace(/baseURL:"\/"/g, 'baseURL:"./"')
      updated = true
    }

    if (updated) {
      writeFileSync(filePath, content, 'utf-8')
    }
  }

  function walkDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        walkDir(fullPath)
      } else if (entry.name.endsWith('.html') || entry.name.endsWith('.js') || entry.name.endsWith('.css')) {
        processFile(fullPath)
      }
    }
  }

  walkDir(EXTENSION_DIR)
}

/**
 * Extract executable inline <script> blocks into external files.
 *
 * MV3 extension pages enforce CSP `script-src 'self'`, which BLOCKS inline
 * scripts. Nuxt emits two inline executable scripts (color-mode + the
 * `window.__NUXT__` config) that would otherwise be blocked, breaking the popup.
 *
 * We move each executable inline script to `assets/inline-<n>.js` and replace the
 * tag with `<script src="./assets/inline-<n>.js"></script>`. Non-executable data
 * blocks (`type="application/json"`, e.g. `__NUXT_DATA__`) are left inline.
 * Document position/order is preserved, so classic scripts still run before the
 * deferred module entry — execution semantics are unchanged.
 */
function extractInlineScripts() {
  console.log('[build-extension] Extracting inline scripts (CSP fix)...')
  const assetsDir = join(EXTENSION_DIR, 'assets')
  mkdirSync(assetsDir, { recursive: true })

  // Matches an inline <script> WITHOUT a src attribute. Captures the attrs and body.
  const inlineScriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi

  function isExecutable(attrs: string, body: string): boolean {
    if (/\bsrc\s*=/.test(attrs)) return false
    // Non-JS script types (application/json, importmap, etc.) are data blocks, not executed.
    const typeMatch = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)
    if (typeMatch) {
      const t = typeMatch[1]!.toLowerCase()
      const executableTypes = ['module', 'text/javascript', 'application/javascript']
      if (!executableTypes.includes(t)) return false
    }
    return body.trim().length > 0
  }

  function processHtml(filePath: string) {
    const content = readFileSync(filePath, 'utf-8')
    let counter = 0
    let changed = false

    const replaced = content.replace(inlineScriptRe, (whole, attrs: string, body: string) => {
      if (!isExecutable(attrs, body)) return whole
      counter++
      changed = true
      const fileName = `inline-${counter}.js`
      writeFileSync(join(assetsDir, fileName), body, 'utf-8')
      // Preserve type="module" if present; default to a classic script otherwise.
      const typeAttr = /\btype\s*=\s*["']module["']/i.test(attrs) ? ' type="module"' : ''
      return `<script${typeAttr} src="./assets/${fileName}"></script>`
    })

    if (changed) {
      writeFileSync(filePath, replaced, 'utf-8')
    }
  }

  function walkDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        walkDir(fullPath)
      } else if (entry.name.endsWith('.html')) {
        processHtml(fullPath)
      }
    }
  }

  walkDir(EXTENSION_DIR)
}

function cleanOutput() {
  console.log('[build-extension] Cleaning extension output...')
  if (existsSync(EXTENSION_DIR)) {
    rmSync(EXTENSION_DIR, { recursive: true, force: true })
  }
  mkdirSync(EXTENSION_DIR, { recursive: true })
}

/**
 * Rebuild only the popup UI from the already-generated Nuxt static output
 * (no `nuxt generate`). Used by the watch script when app source has been
 * regenerated externally, or to re-apply post-processing.
 */
export function buildPopupFromExistingOutput() {
  cleanOutput()
  copyNuxtOutput()
  fixReferences()
  extractInlineScripts()
  compileExtensionScripts()
  copyManifest()
  copyIcons()
}

/**
 * Fast path: rebuild only the Chrome-specific pieces (extension scripts,
 * manifest, icons) without touching the Nuxt popup. Sub-second.
 */
export function buildExtensionCore() {
  compileExtensionScripts()
  copyManifest()
  copyIcons()
}

export interface BuildOptions {
  /** Run `nuxt generate` first (slow). Set false to reuse existing .output/public. */
  generate?: boolean
}

export function buildExtension({ generate = true }: BuildOptions = {}) {
  console.log('='.repeat(60))
  console.log('  Creator Workbench - Extension Build')
  console.log('='.repeat(60))

  if (generate) {
    runNuxtGenerate()
  }
  cleanOutput()
  copyNuxtOutput()
  fixReferences()
  extractInlineScripts()
  compileExtensionScripts()
  copyManifest()
  copyIcons()

  console.log('='.repeat(60))
  console.log(`  Extension built at: ${EXTENSION_DIR}`)
  console.log('  Load in Chrome: chrome://extensions -> Load unpacked')
  console.log('='.repeat(60))
}

// Run only when executed directly (not when imported by the watch script).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildExtension({ generate: true })
}
