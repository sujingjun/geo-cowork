import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { m5FixturePlan, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/answer-cycle.mjs');

test('M5 CLI 从非仓库 cwd 以 no-network recorded Fixture 跑通全链', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  const planPath = path.join(root, 'fixtures/m5/plan.json');
  await writeFile(planPath, JSON.stringify(plan, null, 2));
  const commands = ['plan', 'collect-fixture', 'review', 'aggregate', 'validate'];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('NETWORK_FORBIDDEN'); };
  try {
    for (const command of commands) {
      const args = [CLI, command, '--workspace', root];
      if (command !== 'validate') args.push('--plan', planPath);
      const result = await exec(process.execPath, args, {
        cwd: os.tmpdir(),
        env: { ...process.env, GEO_ANSWER_NETWORK_DISABLED: '1' },
      });
      const parsed = JSON.parse(result.stdout);
      if (command === 'validate') assert.deepEqual(parsed.errors, []);
      else assert.equal(parsed.ok, true);
    }
  } finally {
    globalThis.fetch = originalFetch;
    await rm(root, { recursive: true });
  }
});

test('M5 CLI 不提供外部榜单 import 或真实 collect 绕过入口', async () => {
  const root = await m5ReadyWorkspace();
  await assert.rejects(
    exec(process.execPath, [CLI, 'import-ranking', '--workspace', root], { cwd: os.tmpdir() }),
    (error) => error.code === 1 && error.stderr.includes('INVALID_ARGUMENT'),
  );
  await assert.rejects(
    exec(process.execPath, [CLI, 'collect', '--workspace', root, '--platform', 'chatgpt'], { cwd: os.tmpdir() }),
    (error) => error.code === 1 && error.stderr.includes('PLATFORM_TERMS_BLOCKED'),
  );
  await rm(root, { recursive: true });
});
