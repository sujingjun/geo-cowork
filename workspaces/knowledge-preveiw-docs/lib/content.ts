import path from 'node:path'
import matter from 'gray-matter'
import type { FileAfterParseHook, FileBeforeParseHook } from '@nuxt/content'
import type { Catalog } from './workspace.ts'
import { localLink, markdownLinks } from './workspace.ts'

export function projectBeforeParse(catalog: Catalog, ctx: FileBeforeParseHook) {
  const sourcePath = path.relative(catalog.workspace.root, ctx.file.path!).split(path.sep).join('/')
  const entry = catalog.files[sourcePath]
  if (!entry || entry.kind === 'attachment') throw new Error(`未纳入阅读范围：${sourcePath}`)
  const { data, content } = matter(entry.raw)
  // 业务 id 不能覆盖 Content 的文件身份；所有投影都只改变解析输入。
  const { id: _id, ...metadata } = data
  ctx.file.body = matter.stringify(content, { ...metadata, recordId: entry.recordId })
}

export function projectAfterParse(catalog: Catalog, ctx: FileAfterParseHook) {
  const sourcePath = path.relative(catalog.workspace.root, ctx.file.path!).split(path.sep).join('/')
  const entry = catalog.files[sourcePath]!
  const originalLinks = markdownLinks(entry.raw)
  const { raw: _raw, sha256: _sha, kind, ...metadata } = entry
  Object.assign(ctx.content, metadata, {
    kind, description: '', navigation: kind === 'knowledge',
    stem: entry.path.slice(1) + (/\/(README|_index)\.md$/.test(sourcePath) ? '/index' : ''),
    seo: { title: entry.title }
  })
  // Content 压缩 AST 使用 [tag, props, ...children]；同时兼容未压缩树。
  function rewrite(tag: string, props: Record<string, unknown>) {
    const key = tag === 'a' ? 'href' : tag === 'img' ? 'src' : ''
    if (!key || typeof props[key] !== 'string') return
    const href = props[key] as string
    const target = localLink(sourcePath, href)
    if (!target) return
    // Content 会先移除 Markdown 链接的 .md 后缀；保留原路径与已处理路径两种输入。
    const linked = catalog.files[target.sourcePath] || catalog.files[`${target.sourcePath}.md`]
    if (linked) props[key] = linked.path + target.suffix
    else {
      Reflect.deleteProperty(props, key)
      const original = originalLinks.find(link => link === href || link.replace(/\.md(?=#|$)/, '') === href) || href
      props['data-source-path'] = original
      props.title = `Not included in this reader / 不在本站阅读范围：${original}`
      props['aria-disabled'] = 'true'
      props.class = 'knowledge-unavailable'
    }
  }
  function visit(node: unknown) {
    if (Array.isArray(node)) {
      if (typeof node[0] === 'string' && node[1] && typeof node[1] === 'object' && !Array.isArray(node[1])) {
        rewrite(node[0], node[1])
        for (const child of node.slice(2)) visit(child)
      } else for (const child of node) visit(child)
    } else if (node && typeof node === 'object') {
      const value = node as { tag?: string, props?: Record<string, unknown>, children?: unknown[], value?: unknown[] }
      if (value.tag && value.props) rewrite(value.tag, value.props)
      if (value.children) visit(value.children)
      if (Array.isArray(value.value)) visit(value.value)
    }
  }
  visit(ctx.content.body)
  // 页面页头承担一级标题；保留原始锚点，避免正文重复显示同一标题。
  const body = ctx.content.body as { children?: unknown[], value?: unknown[] }
  const nodes = body.value || body.children
  const heading = nodes?.[0]
  if (Array.isArray(heading) && heading[0] === 'h1') {
    ctx.content.headingId = heading[1]?.id || ''
    nodes!.shift()
  } else if (heading && typeof heading === 'object' && 'tag' in heading && heading.tag === 'h1') {
    ctx.content.headingId = (heading as { props?: { id?: string } }).props?.id || ''
    nodes!.shift()
  }
}
