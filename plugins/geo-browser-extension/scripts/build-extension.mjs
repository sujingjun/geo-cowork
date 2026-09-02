import { access, cp, mkdir, readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const sourceDir = resolve(projectRoot, 'extension')
const outputDir = resolve(projectRoot, '.output/extension')

await rm(outputDir, { recursive: true, force: true })
await mkdir(resolve(projectRoot, '.output'), { recursive: true })
await cp(sourceDir, outputDir, { recursive: true })

const manifest = JSON.parse(await readFile(resolve(outputDir, 'manifest.json'), 'utf8'))
if (manifest.manifest_version !== 3) {
  throw new Error('Extension manifest must use Manifest V3')
}

const requiredFiles = [
  manifest.background?.service_worker,
  manifest.side_panel?.default_path
].filter(Boolean)

for (const relativePath of requiredFiles) {
  await access(resolve(outputDir, relativePath))
}

console.warn(`[build-extension] Built ${outputDir}`)
