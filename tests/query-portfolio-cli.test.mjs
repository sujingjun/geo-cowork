import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  QP_FIXTURE_ROOT,
  QP_GOAL_ID,
  QP_QUERY_SET_ID,
  createQueryPortfolioFixtureWorkspace,
  promoteQueryToFormal,
} from './helpers/query-portfolio-fixtures.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'plugins/geo-expert/scripts/query-portfolio.mjs');
const PLAN = path.join(QP_FIXTURE_ROOT, 'plans/intake-basic.json');
const NOW = '2026-09-01T00:00:00Z';

async function runCli(args) {
  try {
    const { stdout } = await run('node', [SCRIPT, ...args], { cwd: '/tmp' });
    return { code: 0, result: JSON.parse(stdout), error: null };
  } catch (failure) {
    return {
      code: failure.code ?? 1,
      result: failure.stdout ? JSON.parse(failure.stdout) : null,
      error: failure.stderr ? JSON.parse(failure.stderr) : null,
    };
  }
}

test('CLI：参数合同负例', async () => {
  const cases = [
    [[], 'INVALID_ARGUMENT'],
    [['not-a-command', '--workspace', '/tmp'], 'INVALID_ARGUMENT'],
    [['intake'], 'INVALID_ARGUMENT'],
    [['intake', '--workspace', '/tmp', '--plan'], 'INVALID_ARGUMENT'],
    [['intake', '--workspace', '/tmp', '--plan', PLAN, '--unknown', 'x'], 'INVALID_ARGUMENT'],
    [['report', '--workspace', '/tmp', '--goal', '--now', NOW], 'INVALID_ARGUMENT'],
    [['report', '--workspace', '/tmp', '--goal', QP_GOAL_ID, '--now', NOW, '--now', NOW], 'INVALID_ARGUMENT'],
    [['intake', '--workspace', '/tmp', '--plan', '/tmp/nonexistent-plan-qp.json'], 'ENOENT'],
  ];
  for (const [args, code] of cases) {
    const result = await runCli(args);
    assert.equal(result.code, 2, JSON.stringify(args));
    assert.equal(result.error.error, code, JSON.stringify(args));
  }
});

test('CLI：intake/report/assemble/prefreeze/validate 串联与冲突退出码', async () => {
  const root = await createQueryPortfolioFixtureWorkspace();
  try {
    const intake = await runCli(['intake', '--workspace', root, '--plan', PLAN, '--now', NOW]);
    assert.equal(intake.code, 0);
    const queryIds = intake.result.queries.map((item) => item.id);

    const report = await runCli(['report', '--workspace', root, '--goal', QP_GOAL_ID, '--now', NOW]);
    assert.equal(report.code, 0);
    assert.equal(report.result.report.query_counts.total, 4);

    const assemblePlan = path.join(root, 'assemble-plan.json');
    await writeFile(assemblePlan, `${JSON.stringify({
      schema_version: 'qp-assemble-plan/1.0.0',
      id: QP_QUERY_SET_ID,
      path: 'queries/sets/qs-qp-test-001.md',
      title: 'CLI test query set',
      goal_refs: [QP_GOAL_ID],
      query_versions: queryIds.map((ref) => ({ ref, version: '1.0.0' })),
    })}\n`);
    const assemble = await runCli(['assemble', '--workspace', root, '--plan', assemblePlan, '--now', NOW]);
    assert.equal(assemble.code, 0);

    // 同 ID 同路径不同内容 → OBJECT_CONFLICT / 退出码 3
    await writeFile(assemblePlan, `${JSON.stringify({
      schema_version: 'qp-assemble-plan/1.0.0',
      id: QP_QUERY_SET_ID,
      path: 'queries/sets/qs-qp-test-001.md',
      goal_refs: [QP_GOAL_ID],
      query_versions: queryIds.slice(0, 2).map((ref) => ({ ref, version: '1.0.0' })),
    })}\n`);
    const conflict = await runCli(['assemble', '--workspace', root, '--plan', assemblePlan, '--now', NOW]);
    assert.equal(conflict.code, 3);
    assert.equal(conflict.error.error, 'OBJECT_CONFLICT');

    const blocked = await runCli(['prefreeze', '--workspace', root, '--query-set', QP_QUERY_SET_ID]);
    assert.equal(blocked.code, 1);
    assert.equal(blocked.result.ready, false);

    for (const queryId of queryIds) {
      await promoteQueryToFormal(root, queryId);
    }
    const ready = await runCli(['prefreeze', '--workspace', root, '--query-set', QP_QUERY_SET_ID]);
    assert.equal(ready.code, 0);
    assert.equal(ready.result.ready, true);

    const validation = await runCli(['validate', '--workspace', root]);
    assert.equal(validation.code, 0);
    assert.deepEqual(validation.result.errors, []);

    // validate 退出码 1：移除一个对象的 test_scope 后测试知识库层报错
    const setFile = path.join(root, 'queries/sets/qs-qp-test-001.md');
    const parsed = matter(await readFile(setFile, 'utf8'));
    delete parsed.data.test_scope;
    await writeFile(setFile, serializeMarkdownObject(parsed.data, parsed.content));
    const broken = await runCli(['validate', '--workspace', root]);
    assert.equal(broken.code, 1);
    assert.ok(broken.result.errors.some((error) => error.code === 'TEST_KNOWLEDGE_SCOPE_REQUIRED'));
  } finally {
    await rm(root, { recursive: true });
  }
});
