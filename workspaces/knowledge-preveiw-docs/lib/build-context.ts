import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { buildCatalog, digest, resolveWorkspace } from './workspace.ts'

export const appRoot = fileURLToPath(new URL('../', import.meta.url))
export const catalog = process.env.GEO_KNOWLEDGE_WORKSPACE
  ? buildCatalog(resolveWorkspace(process.env.GEO_KNOWLEDGE_WORKSPACE))
  : undefined
const projectionVersion = digest(['workspace.ts', 'content.ts'].map(name => readFileSync(path.join(appRoot, 'lib', name), 'utf8')).join('\n'))
export const snapshotDirectory = catalog
  ? path.join(appRoot, '.data', 'knowledge', catalog.workspace.cacheKey, digest(catalog.revision + projectionVersion))
  : undefined
if (catalog && snapshotDirectory) {
  mkdirSync(snapshotDirectory, { recursive: true })
  writeFileSync(path.join(snapshotDirectory, 'snapshot.json'), JSON.stringify(catalog))
}
