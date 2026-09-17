import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import matter from 'gray-matter';
import { createM6FrozenCycleWorkspace } from './helpers/m6-cycle-fixtures.mjs';
import { compareLiveInputsWithFreeze } from '../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
test('Source queue crossing the 100 threshold preserves freeze, while locator changes still fail', async () => {
  const { root, snapshotPlan } = await createM6FrozenCycleWorkspace();
  try {
    const source = snapshotPlan.source_entries.find(
      (e) => e.record_type === 'source',
    );
    const file = `${root}/${source.object_path}`;
    const original = matter(await readFile(file, 'utf8'));
    const data = {
      ...original.data,
      version: '1.0.1',
      updated_at: '2026-09-16T00:00:00Z',
      classification_queue: {
        status: 'batch_ready',
        threshold: 100,
        decision_ref: 'workspace://queue-maintenance',
      },
    };
    await writeFile(file, serializeMarkdownObject(data, original.content));
    assert.equal(
      (
        await compareLiveInputsWithFreeze({
          workspace: root,
          plan: snapshotPlan,
        })
      ).ok,
      true,
    );
    data.locator = 'https://different.geo-e2e.invalid/';
    await writeFile(file, serializeMarkdownObject(data, original.content));
    assert.equal(
      (
        await compareLiveInputsWithFreeze({
          workspace: root,
          plan: snapshotPlan,
        })
      ).ok,
      false,
    );
  } finally {
    await rm(root, { recursive: true });
  }
});
