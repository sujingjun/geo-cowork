// Spec 0001 插件包契约测试：validate-plugin.mjs 全量合规。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VALIDATE_PLUGIN = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/validate-plugin.mjs');

test('validate-plugin.mjs 退出码 0 且 ok:true', async () => {
  const { stdout } = await run('node', [VALIDATE_PLUGIN], { cwd: REPO_ROOT });
  const out = JSON.parse(stdout);
  assert.equal(out.ok, true);
});

test('validate-plugin.mjs 不依赖调用时 cwd', async () => {
  const { stdout } = await run('node', [VALIDATE_PLUGIN], { cwd: '/tmp' });
  const out = JSON.parse(stdout);
  assert.equal(out.ok, true);
});
