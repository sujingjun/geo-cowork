import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import {
  LIFECYCLE_CLI,
  REPO_ROOT,
  STRATEGY_CLI,
  STRATEGY_SKILL,
  createM7Workspace,
  fixturePath,
  runNode,
} from './helpers/m7-cycle2-fixtures.mjs';

const exec = promisify(execFile);

test('公开 geo-strategy-discovery CLI 与 Skill 必须存在', async () => {
  await Promise.all([access(STRATEGY_CLI), access(STRATEGY_SKILL)]);
});

test('CLI command surface 固定 assess/propose-dimensions/assemble-output/trace', async () => {
  const result = await runNode(STRATEGY_CLI, ['--help']);
  for (const command of ['assess', 'propose-dimensions', 'assemble-output', 'trace']) {
    assert.match(result.stdout, new RegExp(`\\b${command}\\b`));
  }
});

test('geo-lifecycle 暴露 propose-cycle-two/apply-goal-selection 且不改变 M6 commands', async () => {
  const result = await runNode(LIFECYCLE_CLI, ['--help']);
  assert.match(result.stdout, /propose-cycle-two/);
  assert.match(result.stdout, /apply-goal-selection/);
  assert.match(result.stdout, /create-cycle/);
  assert.match(result.stdout, /advance/);
});

test('M7 CLI 可从非仓库 cwd 读取 test-only plan，且显式 network_accessed:false', async () => {
  const root = await createM7Workspace();
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'geo-m7-cli-cwd-'));
  try {
    const result = await runNode(STRATEGY_CLI, [
      'assess', '--workspace', root,
      '--plan', fixturePath('plans/strategy-flow.json'),
    ], { cwd });
    const output = JSON.parse(result.stdout);
    assert.equal(output.network_accessed, false);
    assert.equal(output.scope, 'test_only');
  } finally {
    await rm(root, { recursive: true });
    await rm(cwd, { recursive: true });
  }
});

test('缺 GEO_M7_NETWORK_DISABLED 时 CLI 在读取或写入前 fail closed', async () => {
  const root = await createM7Workspace();
  try {
    const env = { ...process.env };
    delete env.GEO_M7_NETWORK_DISABLED;
    await assert.rejects(
      exec(process.execPath, [
        STRATEGY_CLI,
        'assess', '--workspace', root,
        '--plan', fixturePath('plans/strategy-flow.json'),
      ], { cwd: os.tmpdir(), env }),
      (error) => {
        assert.equal(error.code, 1);
        assert.equal(JSON.parse(error.stderr.trim()).error, 'NETWORK_GUARD_REQUIRED');
        return true;
      },
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('M7 CLI 参数/合同/create-only 冲突使用结构化 JSON 与 exit 1/2/3', async () => {
  const cases = [
    { args: [], exit: 2, code: 'INVALID_ARGUMENT' },
    { args: ['assess', '--workspace', '/tmp'], exit: 2, code: 'INVALID_ARGUMENT' },
    {
      args: ['assess', '--workspace', path.join(REPO_ROOT, 'workspaces/myyshop'), '--plan', fixturePath('plans/strategy-flow.json')],
      exit: 1,
      code: 'REAL_WORKSPACE_WRITE_FORBIDDEN',
    },
  ];
  for (const item of cases) {
    await assert.rejects(
      runNode(STRATEGY_CLI, item.args),
      (error) => {
        assert.equal(error.code, item.exit);
        const parsed = JSON.parse(error.stderr.trim());
        assert.equal(parsed.error, item.code);
        return true;
      },
    );
  }
});
