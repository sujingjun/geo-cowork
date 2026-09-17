import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, access } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { withJourneyLock } from '../plugins/geo-expert/scripts/lib/journey-lock.mjs';
test('single workspace writer rejects competition and recovers a proven dead process', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-writer-'));
  try {
    await withJourneyLock(root, async () => {
      await assert.rejects(
        withJourneyLock(root, async () => {}),
        { code: 'WORKSPACE_BUSY' },
      );
    });
    await writeFile(
      path.join(root, '.geo-writer.lock'),
      JSON.stringify({ pid: 2147483647, started_at: '2026-01-01T00:00:00Z' }),
    );
    assert.equal(await withJourneyLock(root, async () => 42), 42);
    await assert.rejects(access(path.join(root, '.geo-writer.lock')));
  } finally {
    await rm(root, { recursive: true });
  }
});
