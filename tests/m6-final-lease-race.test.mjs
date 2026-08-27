import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawn } from 'node:child_process';
import { rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  acquireCycleLease,
} from '../plugins/geo-expert/scripts/lib/cycle-lock.mjs';
import {
  createM6FixtureWorkspace,
} from './helpers/m6-fixtures.mjs';

const LOCK_MODULE_URL = new URL(
  '../plugins/geo-expert/scripts/lib/cycle-lock.mjs',
  import.meta.url,
).href;

const CONTENDER_SCRIPT = [
  'import { access } from "node:fs/promises";',
  `import { recoverStaleCycleLease } from ${JSON.stringify(LOCK_MODULE_URL)};`,
  'const [workspace, cycleId, ownerId, barrier] = process.argv.slice(1);',
  'console.log("READY");',
  'while (true) {',
  '  try { await access(barrier); break; }',
  '  catch { await new Promise((resolve) => setTimeout(resolve, 1)); }',
  '}',
  'try {',
  '  const result = await recoverStaleCycleLease({',
  '    workspace, cycleId, ownerId,',
  '    now: "2026-08-27T00:00:02Z", ttlMs: 60000,',
  `    expectedInputFingerprint: ${JSON.stringify('a'.repeat(64))},`,
  '  });',
  '  console.log(`RESULT ${JSON.stringify(result)}`);',
  '} catch (error) {',
  '  console.error(`ERROR ${error.code ?? "UNKNOWN"}`);',
  '  process.exitCode = 3;',
  '}',
].join('\n');

function spawnContender({ workspace, cycleId, ownerId, barrier }) {
  const child = spawn(process.execPath, [
    '--input-type=module', '-e', CONTENDER_SCRIPT,
    workspace, cycleId, ownerId, barrier,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  let readyResolved = false;
  let resolveReady;
  let rejectReady;
  const ready = new Promise((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
    if (!readyResolved && stdout.includes('READY')) {
      readyResolved = true;
      resolveReady();
    }
  });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const done = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code) => {
      if (!readyResolved) rejectReady(new Error(`contender exited before READY: ${stderr}`));
      resolve({ code, stdout, stderr, ownerId });
    });
  });
  return { ready, done };
}

test('final QA P0: 8 进程 stale takeover 每轮必须恰好一个 owner 成功', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    const successesByTrial = [];
    for (let trial = 1; trial <= 3; trial += 1) {
      const cycleId = `CYC-M6-FINAL-QA-LEASE-${trial}`;
      await acquireCycleLease({
        workspace: root,
        cycleId,
        ownerId: `stale-owner-${trial}`,
        now: '2026-08-27T00:00:00Z',
        ttlMs: 1_000,
        inputFingerprint: 'a'.repeat(64),
      });
      const barrier = path.join(root, `lease-race-${trial}.start`);
      const contenders = Array.from({ length: 8 }, (_, index) => spawnContender({
        workspace: root,
        cycleId,
        ownerId: `takeover-${trial}-${index}`,
        barrier,
      }));
      await Promise.all(contenders.map((item) => item.ready));
      await writeFile(barrier, 'start\n');
      const results = await Promise.all(contenders.map((item) => item.done));
      successesByTrial.push(results.filter((item) => item.code === 0).length);
    }
    assert.deepEqual(
      successesByTrial,
      [1, 1, 1],
      `同一 stale revision 出现多个 takeover 成功: ${successesByTrial.join('/')}`,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
