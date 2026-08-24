import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { NOW } from './helpers/object-fixtures.mjs';
import {
  m4ReadyWorkspace,
  sitePlan,
  writeSiteSnapshots,
} from './helpers/m4-fixtures.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/diagnosis.mjs');

test('M4 CLI 可从非仓库 cwd 执行 validate 与 site-audit', async () => {
  const root = await m4ReadyWorkspace();
  const manifest = await writeSiteSnapshots(root);
  const plan = sitePlan('RUN-M4-CLI-001');
  const manifestPath = path.join(root, 'site-manifest.json');
  const planPath = path.join(root, 'site-plan.json');
  await writeFile(manifestPath, JSON.stringify(manifest));
  await writeFile(planPath, JSON.stringify(plan));
  const validated = await exec(process.execPath, [
    CLI, 'validate', '--workspace', root,
  ], { cwd: os.tmpdir() });
  assert.deepEqual(JSON.parse(validated.stdout).errors, []);
  const audited = await exec(process.execPath, [
    CLI, 'site-audit', '--workspace', root,
    '--manifest', manifestPath, '--plan', planPath, '--now', NOW,
  ], { cwd: os.tmpdir() });
  const result = JSON.parse(audited.stdout);
  assert.equal(result.run_ref, 'RUN-M4-CLI-001');
  assert.equal(result.checks.length, 9);
  await rm(root, { recursive: true });
});
