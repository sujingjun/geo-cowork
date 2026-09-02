// Spec 0002 工作区契约测试：初始化幂等、不覆盖、身份稳定、dry-run、校验。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, readdir, realpath, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initWorkspace,
  REQUIRED_DIRS,
  REQUIRED_FILES,
} from '../plugins/geo-expert/scripts/workspace-init.mjs';
import { validateWorkspace } from '../plugins/geo-expert/scripts/workspace-validate.mjs';

const run = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INIT = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/workspace-init.mjs');
const VALIDATE = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/workspace-validate.mjs');

async function tmpWorkspace() {
  return mkdtemp(path.join(os.tmpdir(), 'geo-ws-test-'));
}

test('空目录初始化：创建全部必需文件与目录，校验通过', async () => {
  const dir = await tmpWorkspace();
  const result = await initWorkspace({ workspace: dir, brand: 'Acme' });

  for (const d of REQUIRED_DIRS) assert.ok(result.created.includes(`${d}/`), `缺少目录 ${d}`);
  for (const f of REQUIRED_FILES) assert.ok(result.created.includes(f), `缺少文件 ${f}`);
  assert.match(result.workspace_id, /^ws_[a-z0-9]{26}$/);

  const validation = await validateWorkspace(dir);
  assert.deepEqual(validation, { workspace: dir, ok: true, missing: [], errors: [] });
  await rm(dir, { recursive: true });
});

test('模板替换：品牌名与身份写入 README 和 workspace.json', async () => {
  const dir = await tmpWorkspace();
  const result = await initWorkspace({ workspace: dir, brand: 'Acme' });

  const readme = await readFile(path.join(dir, 'README.md'), 'utf8');
  assert.ok(readme.includes('Acme'), 'README 未替换品牌名');
  assert.ok(!readme.includes('{{BRAND}}'), 'README 残留占位符');

  const wsJson = JSON.parse(await readFile(path.join(dir, 'workspace.json'), 'utf8'));
  assert.equal(wsJson.brand, 'Acme');
  assert.equal(wsJson.workspace_id, result.workspace_id);
  assert.equal(wsJson.schema_version, '1.0.0');
  await rm(dir, { recursive: true });
});

test('幂等：重复初始化 created 为空、全部 kept、文件字节不变、身份不变', async () => {
  const dir = await tmpWorkspace();
  const first = await initWorkspace({ workspace: dir, brand: 'Acme' });
  const snapshots = {};
  for (const f of REQUIRED_FILES) snapshots[f] = await readFile(path.join(dir, f), 'utf8');

  const second = await initWorkspace({ workspace: dir, brand: 'Acme' });
  assert.deepEqual(second.created, []);
  for (const f of REQUIRED_FILES) {
    assert.ok(second.kept.includes(f), `重复初始化未保留 ${f}`);
    assert.equal(await readFile(path.join(dir, f), 'utf8'), snapshots[f], `${f} 内容被改变`);
  }
  assert.equal(second.workspace_id, first.workspace_id, 'workspace_id 发生变化');
  await rm(dir, { recursive: true });
});

test('不覆盖：用户已有 README 原样保留', async () => {
  const dir = await tmpWorkspace();
  const custom = '# 用户自己的 README\n\n不得被覆盖。\n';
  await writeFile(path.join(dir, 'README.md'), custom);

  const result = await initWorkspace({ workspace: dir, brand: 'Acme' });
  assert.ok(result.kept.includes('README.md'));
  assert.ok(!result.created.includes('README.md'));
  assert.equal(await readFile(path.join(dir, 'README.md'), 'utf8'), custom);
  await rm(dir, { recursive: true });
});

test('dry-run：不写任何文件', async () => {
  const dir = await tmpWorkspace();
  const result = await initWorkspace({ workspace: dir, brand: 'Acme', dryRun: true });
  assert.equal(result.dry_run, true);
  assert.ok(result.created.length > 0, 'dry-run 应报告将创建的内容');
  const entries = await readdir(dir);
  assert.deepEqual(entries, [], 'dry-run 写入了文件');
  await rm(dir, { recursive: true });
});

test('身份冲突：workspace.json 缺字段时拒绝修补', async () => {
  const dir = await tmpWorkspace();
  await writeFile(path.join(dir, 'workspace.json'), JSON.stringify({ brand: 'Acme' }));
  await assert.rejects(
    initWorkspace({ workspace: dir, brand: 'Acme' }),
    (err) => err.code === 'IDENTITY_CONFLICT',
  );
  await rm(dir, { recursive: true });
});

test('CLI：损坏的 workspace.json 退出码 3', async () => {
  const dir = await tmpWorkspace();
  await writeFile(path.join(dir, 'workspace.json'), '{ 不是合法 JSON');
  await assert.rejects(run('node', [INIT, '--workspace', dir]), (err) => err.code === 3);
  await rm(dir, { recursive: true });
});

test('CLI：不完整工作区 validate 退出码 1 并列出 missing', async () => {
  const dir = await tmpWorkspace();
  await initWorkspace({ workspace: dir, brand: 'Acme' });
  await rm(path.join(dir, 'queries'), { recursive: true });
  await rm(path.join(dir, 'STATUS.md'));

  await assert.rejects(run('node', [VALIDATE, '--workspace', dir]), (err) => {
    assert.equal(err.code, 1);
    const out = JSON.parse(err.stdout);
    assert.equal(out.ok, false);
    assert.ok(out.missing.includes('queries/'));
    assert.ok(out.missing.includes('STATUS.md'));
    return true;
  });
  await rm(dir, { recursive: true });
});

test('CLI：validate 从子目录向上定位工作区', async () => {
  const dir = await tmpWorkspace();
  await initWorkspace({ workspace: dir, brand: 'Acme' });
  const nested = path.join(dir, 'queries');
  const { stdout } = await run('node', [VALIDATE], { cwd: nested });
  const out = JSON.parse(stdout);
  assert.equal(out.ok, true);
  // macOS 上 os.tmpdir() 经 /var → /private/var 符号链接，按真实路径比较
  assert.equal(await realpath(out.workspace), await realpath(dir));
  await rm(dir, { recursive: true });
});

test('CLI：非法参数退出码 2', async () => {
  await assert.rejects(run('node', [INIT, '--nonsense']), (err) => err.code === 2);
});
