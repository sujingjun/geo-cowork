import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  parseMarkdownObjectText,
  readMarkdownObject,
  serializeMarkdownObject,
  validateObjectData,
} from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { sha256 } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { NOW, source, temporaryWorkspace, writeObject } from './helpers/object-fixtures.mjs';

test('合法公共对象通过 gray-matter 与 Ajv 校验', () => {
  const data = source();
  assert.doesNotThrow(() => validateObjectData(data, { path: 'evidence/sources/source.md' }));

  const parsed = parseMarkdownObjectText(serializeMarkdownObject(data, '# Source\n'), {
    path: 'evidence/sources/source.md',
  });
  assert.equal(parsed.data.id, data.id);
  assert.match(parsed.content, /Source/);
});

test('M2 最小 Query/Claim 不被 M3 扩展字段反向强制', () => {
  assert.doesNotThrow(() => validateObjectData({
    id: 'Q-M2-MINIMAL-001', record_type: 'query', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, query_text: 'Minimal?', language: 'en',
  }));
  assert.doesNotThrow(() => validateObjectData({
    id: 'CLM-M2-MINIMAL-001', record_type: 'claim', status: 'candidate', version: '1.0.0',
    created_at: NOW, updated_at: NOW, statement: 'Minimal.', risk_type: 'ordinary_fact',
    risk_level: 'low', evidence_refs: [],
  }));
});

test('缺少公共字段、未知类型、非法 ID 与时间顺序明确失败', () => {
  for (const [mutate, code] of [
    [(data) => delete data.updated_at, 'INVALID_FRONTMATTER'],
    [(data) => { data.record_type = 'mystery'; }, 'UNKNOWN_RECORD_TYPE'],
    [(data) => { data.id = 'source-lowercase'; }, 'INVALID_FRONTMATTER'],
    [(data) => { data.version = 'v1'; }, 'INVALID_FRONTMATTER'],
    [(data) => { data.status = 'approved'; }, 'INVALID_FRONTMATTER'],
    [(data) => { data.created_at = '2026-02-30T00:00:00Z'; }, 'INVALID_DATETIME'],
    [(data) => { data.updated_at = '2026-08-23T00:00:00+08:00'; }, 'INVALID_TIME_ORDER'],
  ]) {
    const data = source();
    mutate(data);
    assert.throws(
      () => validateObjectData(data, { path: 'fixture.md' }),
      (error) => error.code === code && !error.message.includes('Synthetic source'),
    );
  }
});

test('Evidence 必须引用至少一个 Source', () => {
  assert.throws(
    () => validateObjectData({
      id: 'EVD-TEST-EMPTY-001', record_type: 'evidence', status: 'candidate', version: '1.0.0',
      created_at: NOW, updated_at: NOW, source_refs: [], locator: 'fixture://evidence',
      captured_at: NOW,
      snapshot: { path: 'evidence/snapshots/fact.txt', sha256: 'a'.repeat(64), media_type: 'text/plain' },
      collector: { name: 'fixture', version: '1.0.0' },
    }),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
});

test('secret marker 失败且诊断不回显 secret', () => {
  const secret = 'sk-example-do-not-echo-1234567890';
  const text = `${serializeMarkdownObject(source(), '# Source\n')}\napi_key: ${secret}\n`;
  assert.throws(
    () => parseMarkdownObjectText(text, { path: 'source.md' }),
    (error) => error.code === 'SECRET_MARKER' && !error.message.includes(secret),
  );
});

test('Evidence snapshot checksum 正确时通过，错误时失败', async () => {
  const root = await temporaryWorkspace();
  const relative = 'evidence/snapshots/fact.txt';
  const content = 'synthetic fact\n';
  await mkdir(path.join(root, 'evidence/snapshots'), { recursive: true });
  await writeFile(path.join(root, relative), content);
  await writeObject(root, 'evidence/sources/source.md', source());
  const data = {
    id: 'EVD-TEST-001',
    record_type: 'evidence',
    status: 'candidate',
    version: '1.0.0',
    created_at: NOW,
    updated_at: NOW,
    source_refs: ['SRC-TEST-001'],
    locator: 'https://example.invalid/source#fact',
    captured_at: NOW,
    snapshot: { path: relative, sha256: sha256(content), media_type: 'text/plain' },
    collector: { name: 'fixture', version: '1.0.0' },
  };
  const file = await writeObject(root, 'evidence/records/evidence.md', data);
  await assert.doesNotReject(readMarkdownObject(file, { workspace: root }));

  data.snapshot.sha256 = '0'.repeat(64);
  await writeFile(file, serializeMarkdownObject(data, '# Evidence\n'));
  await assert.rejects(
    readMarkdownObject(file, { workspace: root }),
    (error) => error.code === 'CHECKSUM_MISMATCH',
  );
  await rm(root, { recursive: true });
});

test('canonical Markdown symlink 被拒绝', async () => {
  const root = await temporaryWorkspace();
  const outside = path.join(root, '..', `${path.basename(root)}-outside.md`);
  await writeFile(outside, serializeMarkdownObject(source(), '# Outside\n'));
  const link = path.join(root, 'evidence/sources/link.md');
  await symlink(outside, link);
  await assert.rejects(
    readMarkdownObject(link, { workspace: root }),
    (error) => error.code === 'SYMLINK_NOT_ALLOWED',
  );
  await rm(root, { recursive: true });
  await rm(outside);
});
