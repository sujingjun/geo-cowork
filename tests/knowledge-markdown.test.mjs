import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { readKnowledgeMarkdown } from '../plugins/geo-expert/scripts/lib/knowledge-markdown.mjs';
test('Owner edits business Markdown without internal IDs and original bytes remain available', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-knowledge-md-'));
  try {
    await mkdir(path.join(root, '02-brand-identity'));
    const text =
      '# Definition\n\nUsage: synthetic/test_only\n\n事实：The rehearsal is a creator service.\n原始证据：The rehearsal charter defines a creator service.\n复核时间：2026-12-31\n';
    await writeFile(path.join(root, '02-brand-identity/definition.md'), text);
    const [entry] = await readKnowledgeMarkdown(root);
    assert.equal(entry.fact, 'The rehearsal is a creator service.');
    assert.equal(
      entry.evidence,
      'The rehearsal charter defines a creator service.',
    );
    assert.equal(entry.source_text, text);
    assert.equal(entry.review_after, '2026-12-31');
    assert.equal(entry.key, 'definition');
  } finally {
    await rm(root, { recursive: true });
  }
});
