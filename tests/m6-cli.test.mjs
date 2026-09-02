import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readM6FixtureJson } from './helpers/m6-fixtures.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIFECYCLE = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-lifecycle.mjs');
const ANALYTICS = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-analytics.mjs');
const LIFECYCLE_SKILL = path.join(REPO_ROOT, 'plugins/geo-expert/skills/geo-lifecycle/SKILL.md');
const ANALYTICS_SKILL = path.join(REPO_ROOT, 'plugins/geo-expert/skills/geo-analytics/SKILL.md');
const REAL_MYYSHOP = path.join(REPO_ROOT, 'workspaces/myyshop');

async function runCli(script, args, options = {}) {
  return exec(process.execPath, [script, ...args], {
    cwd: options.cwd ?? os.tmpdir(),
    env: {
      ...process.env,
      GEO_M6_NETWORK_DISABLED: '1',
      ...options.env,
    },
  });
}

async function ensureCliEntrypoints() {
  await Promise.all([access(LIFECYCLE), access(ANALYTICS)]);
}

async function writePlan(root, name, plan) {
  const file = path.join(root, `${name}.json`);
  await writeFile(file, `${JSON.stringify(plan, null, 2)}\n`);
  return file;
}

test('CLI fixture plan 冻结 approved commands、独立身份与 synthetic completion scope', async () => {
  const plan = await readM6FixtureJson('plans/cycle-1-e2e.json');
  assert.equal(plan.prepare.merchant.canonical_locator, 'https://www.myyshop.com/');
  assert.equal(plan.prepare.knowledge_base.mode, 'test_only');
  assert.equal(plan.create_cycle.cycle_id, 'CYC-M6-TEST-001');
  assert.deepEqual(plan.gates.map((gate) => gate.to_stage), [
    'baseline_recorded', 'diagnosis_ready', 'adoption_decided',
    'publication_confirmed', 'technical_retest_completed',
    'answer_retest_completed', 'analytics_recorded',
    'review_waiting_human', 'review_decided',
  ]);
  assert.deepEqual(plan.expected, {
    status: 'completed',
    aggregate_stage: 'review_decided',
    completion_scope: 'full',
    scope: 'knowledge_independent_engineering',
    synthetic: true,
    real_myyshop_impact: false,
  });
});

test('M6 公开 entry scripts 与两份 Skill 必须存在', async () => {
  await Promise.all([
    access(LIFECYCLE),
    access(ANALYTICS),
    access(LIFECYCLE_SKILL),
    access(ANALYTICS_SKILL),
  ]);
});

test('CLI 从非仓库 cwd 支持 lifecycle/analytics approved command surface', async () => {
  await ensureCliEntrypoints();
  const lifecycleHelp = (await runCli(LIFECYCLE, ['--help'], { cwd: os.tmpdir() })).stdout;
  for (const command of [
    'prepare-development-workspace', 'create-cycle', 'advance', 'assemble-review', 'trace', 'validate',
  ]) assert.ok(lifecycleHelp.includes(command), command);
  const analyticsHelp = (await runCli(ANALYTICS, ['--help'], { cwd: os.tmpdir() })).stdout;
  for (const command of [
    'ingest-fixture', 'compute-signals', 'materialize-evidence',
  ]) assert.ok(analyticsHelp.includes(command), command);
});

test('CLI 参数/合同错误输出单个结构化 JSON，exit 1/2/3 分离', async () => {
  await ensureCliEntrypoints();
  const cases = [
    [LIFECYCLE, ['unknown-command', '--workspace', os.tmpdir()], 2, 'INVALID_ARGUMENT'],
    [LIFECYCLE, ['advance', '--workspace', os.tmpdir()], 2, 'INVALID_ARGUMENT'],
    [ANALYTICS, ['ingest-fixture', '--workspace', os.tmpdir()], 2, 'INVALID_ARGUMENT'],
  ];
  for (const [script, args, exitCode, code] of cases) {
    await assert.rejects(runCli(script, args), (error) => {
      assert.equal(error.code, exitCode);
      const parsed = JSON.parse(error.stderr);
      assert.equal(parsed.error, code);
      assert.equal(typeof parsed.message, 'string');
      assert.equal(error.stdout, '');
      return true;
    });
  }
});

test('prepare-development-workspace 对空目录建立 MyyShop Merchant + test KBASE，重复幂等', async () => {
  await ensureCliEntrypoints();
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-cli-prepare-'));
  try {
    const plan = (await readM6FixtureJson('plans/cycle-1-e2e.json')).prepare;
    const planPath = await writePlan(root, 'prepare', plan);
    const first = JSON.parse((await runCli(LIFECYCLE, [
      'prepare-development-workspace', '--workspace', root, '--plan', planPath,
    ])).stdout);
    const second = JSON.parse((await runCli(LIFECYCLE, [
      'prepare-development-workspace', '--workspace', root, '--plan', planPath,
    ])).stdout);
    assert.equal(first.workspace_id, plan.workspace_id);
    assert.equal(second.action, 'kept');
    const identity = JSON.parse(await readFile(path.join(root, 'workspace.json'), 'utf8'));
    assert.equal(identity.workspace_mode, 'development_test');
    assert.equal(identity.subject_locator, plan.merchant.canonical_locator);
    assert.equal(identity.knowledge_base_ref, plan.knowledge_base.id);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('所有 M6 CLI 在 network-disabled 环境运行且不得尝试 fetch fallback', async () => {
  await ensureCliEntrypoints();
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-cli-no-network-'));
  try {
    const plan = (await readM6FixtureJson('plans/cycle-1-e2e.json')).prepare;
    const planPath = await writePlan(root, 'prepare', plan);
    const result = await runCli(LIFECYCLE, [
      'prepare-development-workspace', '--workspace', root, '--plan', planPath,
    ], { env: { GEO_M6_NETWORK_DISABLED: '1' } });
    assert.equal(JSON.parse(result.stdout).network_accessed, false);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('真实 MyyShop write preflight exit 1 且 workspace identity bytes 不变', async () => {
  await ensureCliEntrypoints();
  const before = await readFile(path.join(REAL_MYYSHOP, 'workspace.json'));
  const plan = (await readM6FixtureJson('plans/cycle-1-e2e.json')).prepare;
  const temp = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-cli-real-block-'));
  try {
    const planPath = await writePlan(temp, 'prepare', plan);
    await assert.rejects(runCli(LIFECYCLE, [
      'prepare-development-workspace', '--workspace', REAL_MYYSHOP, '--plan', planPath,
    ]), (error) => {
      assert.equal(error.code, 1);
      assert.equal(JSON.parse(error.stderr).error, 'REAL_WORKSPACE_WRITE_FORBIDDEN');
      return true;
    });
    assert.deepEqual(await readFile(path.join(REAL_MYYSHOP, 'workspace.json')), before);
  } finally {
    await rm(temp, { recursive: true });
  }
});
