import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { createM6FrozenCycleWorkspace } from './helpers/m6-cycle-fixtures.mjs';
import {
  buildCycleSnapshotPlan,
  compareLiveInputsWithFreeze,
} from '../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';

test('supporting artifacts retain distinct same-basename bytes and constrain loopback proof to an explicit test locator', async () => {
  const { root } = await createM6FrozenCycleWorkspace();
  try {
    await mkdir(`${root}/support/a`, { recursive: true });
    await mkdir(`${root}/support/b`, { recursive: true });
    await writeFile(
      `${root}/support/a/proof.json`,
      JSON.stringify({
        synthetic: true,
        logical_locator: 'https://brand.example.invalid/about',
        transport: 'http://127.0.0.1:1234/asset',
        status: 200,
      }),
    );
    await writeFile(
      `${root}/support/b/proof.json`,
      JSON.stringify({ schema: 'https://schema.org', synthetic: true }),
    );
    const plan = await buildCycleSnapshotPlan({
      workspace: root,
      id: 'CIS-SUPPORT-001',
      snapshotKind: 'transition',
      merchantRef: 'MER-MYYSHOP-001',
      cycleRef: 'CYC-M6-TEST-001',
      runRef: 'RUN-M6-CIS-001',
      sourcePaths: ['cycles/preparation/goal.md'],
      artifactPaths: ['a', 'b'].map((d) => ({
        role: 'supporting_artifact',
        path: `support/${d}/proof.json`,
        media_type: 'application/json',
      })),
    });
    assert.equal(
      new Set(plan.artifact_entries.map((e) => e.snapshot_path)).size,
      2,
    );
    assert.equal(
      (await compareLiveInputsWithFreeze({ workspace: root, plan })).ok,
      true,
    );
    await writeFile(
      `${root}/support/a/proof.json`,
      JSON.stringify({
        synthetic: true,
        logical_locator: 'https://real.example.com/',
        transport: 'http://127.0.0.1:1234/asset',
      }),
    );
    assert.equal(
      (await compareLiveInputsWithFreeze({ workspace: root, plan })).ok,
      false,
    );
  } finally {
    await rm(root, { recursive: true });
  }
});
