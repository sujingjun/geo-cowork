import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { temporaryWorkspace } from './helpers/object-fixtures.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT_ROOT = path.join(ROOT, 'plugins/geo-expert/scripts');

test('M2 CLI：index check、Run create 与 legacy import 可从非仓库 cwd 执行', async () => {
  const root = await temporaryWorkspace('geo-m2-cli-');
  const buildResult = JSON.parse((await run('node', [
    path.join(SCRIPT_ROOT, 'build-index.mjs'), '--workspace', root, '--check',
  ], { cwd: '/tmp' })).stdout);
  assert.equal(buildResult.object_count, 0);
  assert.deepEqual(buildResult.written, []);

  const inputs = path.join(root, 'inputs.json');
  await writeFile(inputs, '{"SRC-TEST-001":"1.0.0"}\n');
  const runResult = JSON.parse((await run('node', [
    path.join(SCRIPT_ROOT, 'run-lifecycle.mjs'), 'create',
    '--workspace', root, '--run', 'RUN-CLI-TEST-001',
    '--skill', 'geo-test', '--skill-version', '1.0.0', '--inputs', inputs,
    '--now', '2026-08-24T00:00:00+08:00',
  ], { cwd: '/tmp' })).stdout);
  assert.equal(runResult.data.status, 'pending');

  await mkdir(path.join(root, 'imports'), { recursive: true });
  await mkdir(path.join(root, 'legacy/raw'), { recursive: true });
  const legacyInput = path.join(root, 'imports/legacy.json');
  await copyFile(path.join(ROOT, 'tests/fixtures/m2-contract/ops-geo-legacy-synthetic.json'), legacyInput);
  await copyFile(
    path.join(ROOT, 'tests/fixtures/m2-contract/homepage.txt'),
    path.join(root, 'legacy/raw/homepage.txt'),
  );
  const importResult = JSON.parse((await run('node', [
    path.join(SCRIPT_ROOT, 'legacy-ops-geo-import.mjs'),
    '--workspace', root, '--input', legacyInput, '--namespace', 'CLI-TEST',
  ], { cwd: '/tmp' })).stdout);
  assert.deepEqual(importResult.evidence_refs, ['EVD-LEGACY-CLI-TEST-001']);
  await rm(root, { recursive: true });
});
