import { createHash } from 'node:crypto'
import { constants, closeSync, fstatSync, lstatSync, openSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { fromMarkdown } from 'mdast-util-from-markdown'

export interface Workspace {
  root: string
  id: string
  brand: string
  cacheKey: string
}

export interface KnowledgeFile {
  sourcePath: string
  path: string
  kind: 'knowledge' | 'source' | 'attachment'
  locale: 'en' | 'zh-CN' | 'none'
  title: string
  recordId: string
  recordType: string
  status: string
  version: string
  owner: string
  lastReviewed: string
  counterpartPath: string
  translationStatus: 'synchronized' | 'stale' | 'missing' | 'unverified' | 'not_applicable'
  raw: string
  sha256: string
}

export interface Catalog {
  workspace: Workspace
  revision: string
  files: Record<string, KnowledgeFile>
  logicalEntries: number
  warnings: string[]
}

export function digest(text: string) {
  return createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex')
}

export function validSourcePath(value: string) {
  return Boolean(value && !value.includes('\\') && !value.includes('\0') && !path.posix.isAbsolute(value)
    && value.split('/').every(part => part && part !== '.' && part !== '..' && !part.startsWith('.')))
}

// 不依赖字符串前缀授权文件；逐级排除符号链接，并在读取前再次校验真实路径。
export function readWorkspaceFile(root: string, sourcePath: string) {
  if (!validSourcePath(sourcePath)) throw new Error('INVALID_FILE_PATH')
  let current = root
  for (const part of sourcePath.split('/')) {
    current = path.join(current, part)
    if (lstatSync(current).isSymbolicLink()) throw new Error('SYMLINK_NOT_ALLOWED')
  }
  const fd = openSync(current, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    if (!fstatSync(fd).isFile() || realpathSync(current) !== current) throw new Error('FILE_OUTSIDE_WORKSPACE')
    return readFileSync(fd, 'utf8')
  } finally {
    closeSync(fd)
  }
}

export function resolveWorkspace(input: string) {
  if (!input) throw new Error('缺少 --workspace。示例：npm run dev:knowledge -- --workspace ./workspaces/myyshop')
  const root = realpathSync(path.resolve(input))
  const identity = JSON.parse(readWorkspaceFile(root, 'workspace.json'))
  if (typeof identity.workspace_id !== 'string' || !identity.workspace_id.trim()
    || typeof identity.brand !== 'string' || !identity.brand.trim()) throw new Error('workspace.json 必须包含 workspace_id 和 brand')
  const knowledge = lstatSync(path.join(root, 'knowledge'))
  if (!knowledge.isDirectory() || knowledge.isSymbolicLink()) throw new Error('knowledge/ 必须是工作区内的真实目录')
  return { root, id: identity.workspace_id, brand: identity.brand, cacheKey: digest(`${identity.workspace_id}:${root}`).slice(0, 16) } as Workspace
}

const textTypes = new Set(['.txt', '.json', '.csv'])
export function supportedPath(sourcePath: string) {
  if (!validSourcePath(sourcePath)) return false
  const extension = path.posix.extname(sourcePath).toLowerCase()
  return (sourcePath.startsWith('knowledge/') && (extension === '.md' || textTypes.has(extension)))
    || (sourcePath.startsWith('evidence/sources/') && extension === '.md')
    || (sourcePath.startsWith('evidence/snapshots/') && textTypes.has(extension))
}

export function routeFor(sourcePath: string) {
  let route: string
  if (sourcePath.startsWith('knowledge/') && sourcePath.endsWith('.md')) {
    route = sourcePath.replace(/^knowledge\/translations\/zh-CN\//, 'zh-CN/').replace(/^knowledge\//, 'en/')
    route = route.replace(/(?:README|_index)\.md$/, '').replace(/\.md$/, '').replace(/\/$/, '')
  } else if (sourcePath.startsWith('evidence/sources/') && sourcePath.endsWith('.md')) {
    route = sourcePath.replace(/^evidence\/sources\//, 'sources/').slice(0, -3)
  } else {
    route = `files/${sourcePath}`
  }
  return `/${route.split('/').map(encodeURIComponent).join('/')}`
}

function readingField(text: string, name: string) {
  return text.match(new RegExp(`^- ${name}: (.+)$`, 'm'))?.[1]?.trim() || ''
}

export function markdownLinks(raw: string) {
  const tree = fromMarkdown(matter(raw).content)
  const definitions = new Map<string, string>()
  const links: string[] = []
  const refs: string[] = []
  function walk(node: { type: string, url?: string, identifier?: string, children?: unknown[] }) {
    if (node.type === 'definition') definitions.set(node.identifier!, node.url!)
    if (node.type === 'link' || node.type === 'image') links.push(node.url!)
    if (node.type === 'linkReference' || node.type === 'imageReference') refs.push(node.identifier!)
    for (const child of node.children || []) walk(child as typeof node)
  }
  walk(tree)
  return [...links, ...refs.flatMap(ref => definitions.get(ref) || [])]
}

export function localLink(sourcePath: string, href: string) {
  if (!href || href.startsWith('#') || /^(?:https?:|mailto:)/i.test(href)) return null
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('/')) return { sourcePath: '', suffix: '', href }
  const offset = href.search(/[?#]/)
  const pathname = offset < 0 ? href : href.slice(0, offset)
  try {
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), decodeURIComponent(pathname)))
    return { sourcePath: target, suffix: offset < 0 ? '' : href.slice(offset), href }
  } catch {
    return { sourcePath: '', suffix: '', href }
  }
}

export function buildCatalog(workspace: Workspace): Catalog {
  const files: Catalog['files'] = {}
  const warnings: string[] = []
  const pending: string[] = []
  function scan(directory: string) {
    for (const entry of readdirSync(path.join(workspace.root, directory), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith('.')) continue
      const sourcePath = `${directory}/${entry.name}`
      if (entry.isSymbolicLink()) {
        warnings.push(`跳过符号链接：${sourcePath}`)
        continue
      }
      if (entry.isDirectory()) scan(sourcePath)
      else if (entry.isFile() && entry.name.endsWith('.md')) pending.push(sourcePath)
    }
  }
  scan('knowledge')
  const seen = new Set<string>()
  while (pending.length) {
    const sourcePath = pending.shift()!
    if (seen.has(sourcePath) || !supportedPath(sourcePath)) continue
    seen.add(sourcePath)
    let raw: string
    try {
      raw = readWorkspaceFile(workspace.root, sourcePath)
    } catch {
      warnings.push(`不可读取引用：${sourcePath}`)
      continue
    }
    const isMarkdown = sourcePath.endsWith('.md')
    const { data, content }: { data: Record<string, unknown>, content: string } = isMarkdown ? matter(raw) : { data: {}, content: raw }
    const kind = !isMarkdown ? 'attachment' : sourcePath.startsWith('knowledge/') ? 'knowledge' : 'source'
    const locale = kind !== 'knowledge' ? 'none' : sourcePath.startsWith('knowledge/translations/zh-CN/') ? 'zh-CN' : 'en'
    files[sourcePath] = {
      sourcePath, path: routeFor(sourcePath), kind, locale,
      title: String(data.title || content.match(/^#\s+(.+)$/m)?.[1] || path.posix.basename(sourcePath)),
      recordId: String(data.id || readingField(raw, 'Knowledge ID')),
      recordType: String(data.record_type || ''), status: String(data.status || ''), version: String(data.version || ''),
      owner: String(data.owner || ''), lastReviewed: String(data.last_reviewed || ''),
      counterpartPath: '', translationStatus: 'not_applicable', raw, sha256: digest(raw)
    }
    if (isMarkdown) {
      for (const href of markdownLinks(raw)) {
        const target = localLink(sourcePath, href)
        if (target && supportedPath(target.sourcePath)) pending.push(target.sourcePath)
      }
    }
  }
  const routes = new Set<string>()
  for (const file of Object.values(files)) {
    if (routes.has(file.path)) throw new Error(`页面路由冲突：${file.path}`)
    routes.add(file.path)
    if (file.kind !== 'knowledge') continue
    const primaryPath = file.locale === 'zh-CN' ? file.sourcePath.replace('knowledge/translations/zh-CN/', 'knowledge/') : file.sourcePath
    const primary = files[primaryPath]
    const translation = files[primaryPath.replace('knowledge/', 'knowledge/translations/zh-CN/')]
    const counterpart = file.locale === 'en' ? translation : primary
    file.counterpartPath = counterpart?.path || ''
    file.translationStatus = counterpart ? 'unverified' : 'missing'
    if (primary && translation && primary.recordId && primary.recordType === 'knowledge_entry') {
      const matches = readingField(translation.raw, 'Knowledge ID') === primary.recordId
        && readingField(translation.raw, 'Source file') === primaryPath.slice('knowledge/'.length)
        && readingField(translation.raw, 'Source version') === primary.version
        && readingField(translation.raw, 'Source SHA-256') === primary.sha256
        && readingField(translation.raw, 'Translation status') === 'synchronized'
      file.translationStatus = matches ? 'synchronized' : 'stale'
      if (file.locale === 'zh-CN') {
        for (const key of ['recordId', 'recordType', 'status', 'version', 'owner', 'lastReviewed'] as const) file[key] = primary[key]
      }
    }
  }
  const revision = digest(JSON.stringify(Object.values(files).map(f => [f.sourcePath, f.sha256])))
  const logicalEntries = new Set(Object.values(files).filter(f => f.locale === 'en' && f.recordType === 'knowledge_entry').map(f => f.recordId)).size
  return { workspace, revision, files, warnings, logicalEntries }
}

export function catalogFile(catalog: Catalog, sourcePath: string, live = false) {
  if (!validSourcePath(sourcePath) || !Object.hasOwn(catalog.files, sourcePath)) throw new Error('FILE_NOT_AVAILABLE')
  // 开发期间即使目录被替换成符号链接，也不能沿用旧清单开放读取。
  if (live) readWorkspaceFile(catalog.workspace.root, sourcePath)
  return catalog.files[sourcePath]!
}
