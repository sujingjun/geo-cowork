import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { generateQueryIdentity, normalizeQueryText } from '../plugins/geo-expert/scripts/lib/query-portfolio.mjs';
import {
  QP_APPROVAL,
  QP_FIXTURE_ROOT,
  QP_GOAL_ID,
  QP_QUERY_SET_ID,
  QP_TEST_SCOPE,
  QP_WORKSPACE_ID,
  createQueryPortfolioFixtureWorkspace,
  freezeQuerySet,
  promoteQueryToFormal,
} from './helpers/query-portfolio-fixtures.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'plugins/geo-expert/scripts/query-portfolio.mjs');
const BUILD_INDEX = path.join(ROOT, 'plugins/geo-expert/scripts/build-index.mjs');
const PLAN = path.join(QP_FIXTURE_ROOT, 'plans/intake-basic.json');
const NOW = '2026-09-01T00:00:00Z';
const SET_PATH = 'queries/sets/qs-qp-test-001.md';

async function runCli(args) {
  try {
    const { stdout } = await run('node', [...args], { cwd: '/tmp' });
    return { code: 0, result: JSON.parse(stdout), error: null };
  } catch (failure) {
    return {
      code: failure.code ?? 1,
      result: failure.stdout ? JSON.parse(failure.stdout) : null,
      error: failure.stderr ? JSON.parse(failure.stderr) : null,
    };
  }
}

function portfolio(command, workspace, ...rest) {
  const args = [SCRIPT, command, '--workspace', workspace, ...rest];
  if (command !== 'prefreeze' && command !== 'validate') args.push('--now', NOW);
  return runCli(args);
}

test('知识库缺席：测试知识库 Query Portfolio 全旅程', async () => {
  const root = await createQueryPortfolioFixtureWorkspace();
  try {
    // 1. intake：4 条观察生成 candidate Query
    const intake = await portfolio('intake', root, '--plan', PLAN);
    assert.equal(intake.code, 0);
    assert.equal(intake.result.queries.length, 4);
    assert.equal(intake.result.duplicates.length, 0);
    const intents = intake.result.queries.map((item) => item.intent).sort();
    assert.deepEqual(intents, ['brand_definition', 'brand_definition', 'pricing', 'reputation']);
    assert.ok(intake.result.queries.every((item) => item.priority === 'P0'));
    for (const generated of intake.result.queries) {
      assert.deepEqual(
        generateQueryIdentity({
          normalizedText: generated.normalized_text,
          language: 'en-US',
        }),
        { id: generated.id, path: generated.path },
      );
      const text = await readFile(path.join(root, generated.path), 'utf8');
      const data = matter(text).data;
      assert.equal(data.status, 'candidate');
      assert.equal(data.approval, undefined);
      assert.deepEqual(data.goal_refs, [QP_GOAL_ID]);
      assert.deepEqual(data.test_scope, QP_TEST_SCOPE);
      assert.equal(data.extensions['geo.qp_intake'].rules.cluster, 'qp-cluster-v1');
    }

    // 2. 幂等重跑：全部 kept
    const repeated = await portfolio('intake', root, '--plan', PLAN);
    assert.equal(repeated.code, 0);
    assert.deepEqual(repeated.result.created, []);
    assert.equal(repeated.result.kept.length, 4);

    // 3. report：3 个聚类，全部未 formal
    const report = await portfolio('report', root, '--goal', QP_GOAL_ID);
    assert.equal(report.code, 0);
    assert.equal(report.result.report.clusters.length, 3);
    assert.equal(report.result.report.query_counts.total, 4);
    assert.equal(report.result.report.coverage.clusters_with_formal, 0);
    assert.match(report.result.artifact_path, /^queries\/portfolio\/reports\/goal-qp-test-001-[0-9a-f]{8}\.json$/);
    const reportRepeat = await portfolio('report', root, '--goal', QP_GOAL_ID);
    assert.equal(reportRepeat.result.action, 'kept');

    // 4. 组装 draft Query Set（含 4 个 candidate 引用）
    const assemblePlan = path.join(root, 'assemble-plan.json');
    const { writeFile } = await import('node:fs/promises');
    await writeFile(assemblePlan, `${JSON.stringify({
      schema_version: 'qp-assemble-plan/1.0.0',
      id: QP_QUERY_SET_ID,
      path: SET_PATH,
      title: 'QP test knowledge base query set',
      goal_refs: [QP_GOAL_ID],
      query_versions: intake.result.queries.map((item) => ({ ref: item.id, version: '1.0.0' })),
    })}\n`);
    const assemble = await portfolio('assemble', root, '--plan', assemblePlan);
    assert.equal(assemble.code, 0);
    assert.equal(assemble.result.data.status, 'draft');
    assert.match(assemble.result.content_sha256_preview, /^[a-f0-9]{64}$/);

    // 5. 冻结前检查：未批准时逐门报告并退出 1
    const blocked = await portfolio('prefreeze', root, '--query-set', QP_QUERY_SET_ID);
    assert.equal(blocked.code, 1);
    assert.equal(blocked.result.ready, false);
    assert.equal(blocked.result.gates.filter((gate) => gate.code === 'QUERY_NOT_FORMAL').length, 4);
    assert.equal(blocked.result.gates.filter((gate) => gate.code === 'APPROVAL_REQUIRED').length, 4);

    // 6. 人工批准模拟：4 条 candidate → formal（fixture approval，含一条优先级人工覆盖）
    for (const [index, generated] of intake.result.queries.entries()) {
      await promoteQueryToFormal(root, generated.id, index === 0 ? { priority: 'P2' } : {});
    }
    const overridden = matter(await readFile(path.join(root, intake.result.queries[0].path), 'utf8')).data;
    assert.equal(overridden.priority, 'P2');
    assert.equal(overridden.status, 'formal');
    assert.deepEqual(overridden.approval, QP_APPROVAL);

    // 7. 冻结前检查：全部就绪并给出期望 content_sha256
    const ready = await portfolio('prefreeze', root, '--query-set', QP_QUERY_SET_ID);
    assert.equal(ready.code, 0);
    assert.equal(ready.result.ready, true);
    assert.deepEqual(ready.result.gates, []);
    assert.equal(ready.result.expected_content_sha256, assemble.result.content_sha256_preview);

    // 8. 人工冻结模拟
    await freezeQuerySet(root, SET_PATH, { contentSha256: ready.result.expected_content_sha256 });

    // 9. prefreeze 对 frozen 复检合同
    const frozenCheck = await portfolio('prefreeze', root, '--query-set', QP_QUERY_SET_ID);
    assert.equal(frozenCheck.code, 0);
    assert.equal(frozenCheck.result.state, 'frozen');
    assert.equal(frozenCheck.result.valid, true);

    // 10. validate：M3 + portfolio + 测试知识库三层均无 error
    const validation = await portfolio('validate', root);
    assert.equal(validation.code, 0);
    assert.deepEqual(validation.result.errors, []);
    assert.deepEqual(validation.result.warnings, []);

    // 11. index 重建
    const indexRun = await runCli([BUILD_INDEX, '--workspace', root]);
    assert.equal(indexRun.code, 0);
    const queriesIndex = JSON.parse(await readFile(path.join(root, 'indexes/queries.json'), 'utf8'));
    assert.equal(queriesIndex.objects.length, 4);
    assert.ok(queriesIndex.objects.every((object) => object.status === 'formal'));
    const setsIndex = JSON.parse(await readFile(path.join(root, 'indexes/query-sets.json'), 'utf8'));
    assert.equal(setsIndex.objects.length, 1);
    assert.equal(setsIndex.objects[0].status, 'frozen');

    // 12. 知识库缺席断言：工作区只有商户/来源/目标/Query/Query Set
    const graph = await loadWorkspaceGraph({ workspace: root });
    const recordTypes = [...new Set(graph.objects.map((object) => object.data.record_type))].sort();
    assert.deepEqual(recordTypes, [
      'brand_knowledge_base', 'merchant', 'perception_goal', 'query', 'query_set', 'source',
    ]);
    for (const object of graph.objects) {
      if (!['merchant', 'brand_knowledge_base'].includes(object.data.record_type)) {
        assert.ok(!/MYYSHOP/.test(object.data.id), object.data.id);
      }
    }
    assert.equal((await readFile(path.join(root, 'workspace.json'), 'utf8')).includes(QP_WORKSPACE_ID), true);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('知识库缺席：重复观察与跨来源合并', async () => {
  const root = await createQueryPortfolioFixtureWorkspace();
  try {
    const plan = JSON.parse(await readFile(PLAN, 'utf8'));
    // 第二个来源观察同一 normalized Query（不同大小写与标点）→ 合并为单对象
    plan.sources.push({
      source_ref: 'SRC-QP-TEST-002',
      source_class: 'community_expression',
      observed_at: NOW,
      entries: [{ query_text: 'what is qp test knowledge base', language: 'en-US' }],
    });
    const planFile = path.join(root, 'intake-plan-2.json');
    const { writeFile } = await import('node:fs/promises');
    await writeFile(planFile, `${JSON.stringify(plan)}\n`);
    const result = await portfolio('intake', root, '--plan', planFile);
    assert.equal(result.code, 0);
    assert.equal(result.result.queries.length, 4);
    const merged = result.result.queries.find(
      (item) => item.normalized_text === 'what is qp test knowledge base',
    );
    assert.equal(merged.source_classes.length, 2);
    assert.equal(merged.priority, 'P0');
    const text = matter(await readFile(path.join(root, merged.path), 'utf8')).data;
    assert.deepEqual(text.discovery_source_refs, ['SRC-QP-TEST-001', 'SRC-QP-TEST-002']);
    assert.equal(normalizeQueryText(text.query_text), text.normalized_text);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('知识库缺席：同源重复观察整体失败且无部分写入', async () => {
  const root = await createQueryPortfolioFixtureWorkspace();
  try {
    const plan = JSON.parse(await readFile(PLAN, 'utf8'));
    plan.sources[0].entries.push({ query_text: 'what is QP test knowledge base', language: 'en-US' });
    const planFile = path.join(root, 'intake-plan-3.json');
    const { writeFile } = await import('node:fs/promises');
    await writeFile(planFile, `${JSON.stringify(plan)}\n`);
    const result = await portfolio('intake', root, '--plan', planFile);
    assert.equal(result.code, 1);
    assert.equal(result.error.error, 'DUPLICATE_QUERY');
    const graph = await loadWorkspaceGraph({ workspace: root });
    assert.equal(graph.objects.filter((object) => object.data.record_type === 'query').length, 0);
  } finally {
    await rm(root, { recursive: true });
  }
});
