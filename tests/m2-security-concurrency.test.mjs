import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';

import { initWorkspace } from '../plugins/geo-expert/scripts/workspace-init.mjs';
import { createRun, writeRunArtifact } from '../plugins/geo-expert/scripts/lib/run-store.mjs';
import { NOW, temporaryWorkspace } from './helpers/object-fixtures.mjs';

test('并发 workspace init 返回的 ID 全部等于实际落盘身份', async () => {
  const root = await temporaryWorkspace('geo-init-concurrent-');
  await rm(root, { recursive: true });
  const results = await Promise.all(
    Array.from({ length: 8 }, () => initWorkspace({ workspace: root, brand: 'Concurrent' })),
  );
  const actual = JSON.parse(await readFile(`${root}/workspace.json`, 'utf8')).workspace_id;
  assert.ok(results.every((result) => result.workspace_id === actual));
  await rm(root, { recursive: true });
});

test('artifact 拒绝父目录逃逸与绝对路径', async () => {
  const root = await temporaryWorkspace();
  await createRun({
    workspace: root,
    runId: 'RUN-TEST-PATH-001',
    skill: 'geo-test',
    skillVersion: '1.0.0',
    inputVersions: {},
    now: NOW,
  });
  for (const relativePath of ['raw/../escape.txt', '/tmp/escape.txt', 'outputs\\escape.txt']) {
    await assert.rejects(
      writeRunArtifact({
        workspace: root,
        runId: 'RUN-TEST-PATH-001',
        relativePath,
        content: 'forbidden',
      }),
      (error) => error.code === 'PATH_ESCAPE',
    );
  }
  await rm(root, { recursive: true });
});

