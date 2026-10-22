import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync, realpathSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { buildCatalog, resolveWorkspace, catalogFile, digest, routeFor } from '../lib/workspace.ts'
import { projectBeforeParse, projectAfterParse } from '../lib/content.ts'

function fixture(t, brand = 'Fixture') {
  const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'knowledge-reader-')))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  function put(file, body) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    writeFileSync(path.join(root, file), body)
  }
  put('workspace.json', JSON.stringify({ workspace_id: `ws_${brand}`, brand }))
  put('knowledge/README.md', '# Knowledge home\n\n[Identity](02-identity/_index.md)\n')
  put('knowledge/02-identity/_index.md', '# Identity\n\n[Name](name.md)\n')
  const primary = '---\nrecord_type: knowledge_entry\nid: KB-NAME-001\ntitle: Official Name\nstatus: draft\nversion: 1.0\nowner: Brand\n---\n# Official Name\n\nCurrent name.\n\n[Source](../../evidence/sources/brand.md)\n[Record](../../cycles/decision.md)\n[Unsupported](../../evidence/snapshots/raw.html)\n[Data](../coverage.csv)\n'
  put('knowledge/02-identity/name.md', primary)
  put('knowledge/translations/zh-CN/02-identity/name.md', `# 品牌名称\n\n- Knowledge ID: KB-NAME-001\n- Source file: 02-identity/name.md\n- Source version: 1\n- Source SHA-256: ${digest(primary)}\n- Translation status: synchronized\n\n中文事实。\n`)
  put('knowledge/coverage.csv', 'id,status\nKB-NAME-001,draft\n')
  put('evidence/sources/brand.md', '---\nid: SRC-BRAND\nstatus: active\n---\n# Brand source\n\n[Snapshot][text]\n\n[text]: ../snapshots/brand.txt\n')
  put('evidence/snapshots/brand.txt', '<script>alert("not executable")</script>\nCaptured source in full.')
  put('evidence/snapshots/raw.html', '<h1>Not in scope</h1>')
  put('evidence/sources/unreferenced.md', '# Must not appear')
  put('cycles/decision.md', '# Not a reading page')
  return { root, put, workspace: resolveWorkspace(root) }
}

test('knowledge reader: binds a real workspace and rejects absent/invalid identity', (t) => {
  const f = fixture(t)
  assert.equal(f.workspace.brand, 'Fixture')
  assert.throws(() => resolveWorkspace(''), /workspace/)
  f.put('workspace.json', '{}')
  assert.throws(() => resolveWorkspace(f.root), /workspace_id/)
})

test('knowledge reader: indexes bilingual knowledge and only referenced evidence', (t) => {
  const f = fixture(t)
  const c = buildCatalog(f.workspace)
  assert.equal(c.logicalEntries, 1)
  assert.equal(c.files['knowledge/README.md'].path, '/en')
  assert.equal(c.files['knowledge/02-identity/_index.md'].path, '/en/02-identity')
  assert.equal(c.files['knowledge/translations/zh-CN/02-identity/name.md'].path, '/zh-CN/02-identity/name')
  assert.equal(c.files['knowledge/02-identity/name.md'].translationStatus, 'synchronized')
  assert.equal(c.files['knowledge/translations/zh-CN/02-identity/name.md'].status, 'draft')
  assert.equal(c.files['evidence/sources/brand.md'].status, 'active')
  assert.ok(c.files['evidence/snapshots/brand.txt'])
  assert.ok(c.files['knowledge/coverage.csv'])
  for (const denied of ['cycles/decision.md', 'evidence/snapshots/raw.html', 'evidence/sources/unreferenced.md']) assert.equal(c.files[denied], undefined)
})

test('knowledge reader: detects stale translation and file add/remove without mutating source', (t) => {
  const f = fixture(t)
  const first = buildCatalog(f.workspace)
  const source = 'knowledge/02-identity/name.md'
  const original = first.files[source].raw
  assert.equal(readFileSync(path.join(f.root, source), 'utf8'), original)
  f.put(source, `${original}\nUpdated fact.\n`)
  f.put('knowledge/02-identity/added.md', '# Added fact')
  const next = buildCatalog(f.workspace)
  assert.notEqual(next.revision, first.revision)
  assert.equal(next.files[source].translationStatus, 'stale')
  assert.ok(next.files['knowledge/02-identity/added.md'])
  rmSync(path.join(f.root, 'knowledge/translations/zh-CN/02-identity/name.md'))
  const last = buildCatalog(f.workspace)
  assert.equal(last.files[source].translationStatus, 'missing')
  assert.equal(last.files[source].counterpartPath, '')
})

test('knowledge reader: rejects traversal, undeclared files, and symlinks including directory replacement', (t) => {
  const f = fixture(t)
  const outside = fixture(t, 'Outside')
  symlinkSync(path.join(outside.root, 'knowledge/README.md'), path.join(f.root, 'knowledge/escape.md'))
  symlinkSync(outside.root, path.join(f.root, 'knowledge/escape-dir'))
  const c = buildCatalog(f.workspace)
  assert.equal(c.files['knowledge/escape.md'], undefined)
  for (const value of ['../workspace.json', '/etc/passwd', 'knowledge/../workspace.json', 'workspace.json', 'knowledge/%2e%2e/workspace.json', 'toString', '__proto__']) {
    assert.throws(() => catalogFile(c, value, true))
  }
  rmSync(path.join(f.root, 'evidence/snapshots'), { recursive: true })
  symlinkSync(path.join(outside.root, 'evidence/snapshots'), path.join(f.root, 'evidence/snapshots'))
  assert.throws(() => catalogFile(c, 'evidence/snapshots/brand.txt', true), /SYMLINK/)
})

test('knowledge reader: frozen snapshot reads original content after live files change', (t) => {
  const f = fixture(t)
  const c = JSON.parse(JSON.stringify(buildCatalog(f.workspace)))
  const original = catalogFile(c, 'evidence/snapshots/brand.txt').raw
  f.put('evidence/snapshots/brand.txt', 'Later source version')
  assert.equal(catalogFile(c, 'evidence/snapshots/brand.txt').raw, original)
  assert.notEqual(buildCatalog(f.workspace).revision, c.revision)
})

test('knowledge reader: isolates workspaces and detects ambiguous routes', (t) => {
  const a = fixture(t, 'Alpha')
  const b = fixture(t, 'Beta')
  assert.notEqual(a.workspace.cacheKey, b.workspace.cacheKey)
  a.put('knowledge/02-identity/README.md', '# Duplicate home')
  assert.throws(() => buildCatalog(a.workspace), /路由冲突/)
  assert.equal(buildCatalog(b.workspace).workspace.brand, 'Beta')
})

test('knowledge reader: preserves source IDs and rewrites links in compressed Content AST', (t) => {
  const f = fixture(t)
  const c = buildCatalog(f.workspace)
  const sourcePath = 'knowledge/02-identity/name.md'
  const file = { id: `docs/${sourcePath}`, path: path.join(f.root, sourcePath), body: c.files[sourcePath].raw }
  projectBeforeParse(c, { file })
  assert.match(file.body, /recordId: KB-NAME-001/)
  assert.doesNotMatch(file.body, /^id:/m)
  const content = {
    id: file.id,
    body: { type: 'minimark', value: [
      ['h1', { id: 'official-name' }, 'Official Name'],
      ['a', { href: '../../evidence/sources/brand.md#part' }, 'Source'],
      ['a', { href: '../../cycles/decision.md' }, 'Decision'],
      ['a', { href: 'https://example.org/' }, 'Website'],
      ['a', { href: '#current-answer' }, 'Section'],
      ['a', { href: 'javascript:alert(1)' }, 'Unsafe']
    ] }
  }
  projectAfterParse(c, { file, content })
  const nodes = content.body.value
  assert.equal(content.headingId, 'official-name')
  assert.equal(content.id, file.id)
  assert.equal(content.recordId, 'KB-NAME-001')
  assert.equal(nodes[0][1].href, '/sources/brand#part')
  assert.equal(nodes[1][1].href, undefined)
  assert.equal(nodes[1][1]['data-source-path'], '../../cycles/decision.md')
  assert.equal(nodes[2][1].href, 'https://example.org/')
  assert.equal(nodes[3][1].href, '#current-answer')
  assert.equal(nodes[4][1].href, undefined)
})

test('knowledge reader: reference links work, code examples do not authorize files', (t) => {
  const f = fixture(t)
  f.put('knowledge/code.md', '# Code\n\n```md\n[Not a reference](../evidence/sources/unreferenced.md)\n```\n')
  assert.equal(buildCatalog(f.workspace).files['evidence/sources/unreferenced.md'], undefined)
  assert.equal(routeFor('knowledge/translations/zh-CN/README.md'), '/zh-CN')
  assert.equal(routeFor('knowledge/01-templates/中文 空格.md'), '/en/01-templates/%E4%B8%AD%E6%96%87%20%E7%A9%BA%E6%A0%BC')
})
