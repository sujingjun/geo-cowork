import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { RECORD_TYPES } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { execute as executeLifecycle } from '../plugins/geo-expert/scripts/geo-lifecycle.mjs';
import { walkMarkdownFiles } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  createM6FixtureWorkspace,
  seedM6FreezeInputs,
} from './helpers/m6-fixtures.mjs';
import {
  initializeDevelopmentKnowledgeWorkspace,
  validateDevelopmentKnowledgeWorkspace,
} from '../plugins/geo-expert/scripts/lib/workspace-scope.mjs';
import { assessLifecycleReadiness } from '../plugins/geo-expert/scripts/lib/lifecycle-readiness.mjs';

const NOW = '2026-09-02T02:00:00Z';
const WORKSPACE_ID = 'ws_myyshopdevtest000000000000';
const MERCHANT_REF = 'MER-MYYSHOP-001';
const KNOWLEDGE_BASE_REF = 'KBASE-MYYSHOP-DEVTEST-001';

function plan(overrides = {}) {
  return {
    schema_version: 'development-knowledge-workspace/1.0.0',
    workspace_id: WORKSPACE_ID,
    brand: 'MyyShop',
    created_at: NOW,
    merchant: {
      id: MERCHANT_REF,
      path: 'execution/identity/merchant.md',
      canonical_locator: 'https://www.myyshop.com/',
    },
    knowledge_base: {
      id: KNOWLEDGE_BASE_REF,
      path: 'knowledge/meta/knowledge-base.md',
      root_path: 'knowledge',
      mode: 'test_only',
    },
    execution_scope: 'synthetic_test',
    online_configuration: {
      ga4_property_id: '356373250',
      gsc_site_url: 'https://www.myyshop.com/',
      analytics_plan: 'cycles/preparation/analytics/ga4-gsc-readonly-plan.json',
    },
    decision_ref: 'conversation://2026-09-02/development-test-knowledge-base-approved',
    ...overrides,
  };
}

test('单一线上 Merchant + test_only KBASE 初始化，不注册 test_merchant', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-kbase-'));
  const result = await initializeDevelopmentKnowledgeWorkspace({ workspace: root, plan: plan() });
  assert.equal(result.merchant_ref, MERCHANT_REF);
  assert.equal(result.knowledge_base_ref, KNOWLEDGE_BASE_REF);
  const validation = await validateDevelopmentKnowledgeWorkspace({ workspace: root });
  assert.deepEqual(validation.errors, []);
  assert.equal(validation.identity.subject_locator, 'https://www.myyshop.com/');
  assert.equal(validation.identity.knowledge_base_mode, 'test_only');
  assert.equal(RECORD_TYPES.includes('merchant'), true);
  assert.equal(RECORD_TYPES.includes('brand_knowledge_base'), true);
  assert.equal(RECORD_TYPES.includes('test_merchant'), false);
});

test('Readiness 只读报告：知识缺席不是 Content Gap，也不创建正式 Cycle', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-readiness-'));
  await initializeDevelopmentKnowledgeWorkspace({ workspace: root, plan: plan() });
  const before = await readdir(path.join(root, 'cycles'));
  const report = await assessLifecycleReadiness({
    workspace: root,
    knowledgeBaseRef: KNOWLEDGE_BASE_REF,
    goalRef: 'GOAL-MYYSHOP-DEVTEST-MISSING-001',
  });
  assert.equal(report.formal_cycle_created, false);
  assert.equal(report.real_cycle_start_ready, false);
  assert.equal(report.knowledge_absence.content_gap_inferred, false);
  assert.ok(report.gates.some((gate) => gate.code === 'KNOWLEDGE_INPUT_ABSENT'));
  assert.deepEqual(await readdir(path.join(root, 'cycles')), before);
});

test('knowledge_base_ref 不匹配时 fail loud', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-kbase-mismatch-'));
  await initializeDevelopmentKnowledgeWorkspace({ workspace: root, plan: plan() });
  await assert.rejects(
    assessLifecycleReadiness({
      workspace: root,
      knowledgeBaseRef: 'KBASE-MYYSHOP-REAL-001',
      goalRef: 'GOAL-MYYSHOP-DEVTEST-001',
    }),
    (error) => error.code === 'KNOWLEDGE_BASE_SCOPE_MISMATCH',
  );
});

test('真实知识切片 ready 不等于可用旧裸 plan 创建正式周期；必须显式绑定运行计划', async () => {
  const root = await createM6FixtureWorkspace();
  const inputs = await seedM6FreezeInputs(root);
  const identityPath = path.join(root, 'workspace.json');
  const identity = JSON.parse(await readFile(identityPath, 'utf8'));
  Object.assign(identity, {
    workspace_mode: 'online',
    execution_scope: 'authorized_real',
    knowledge_base_mode: 'real',
  });
  await writeFile(identityPath, `${JSON.stringify(identity, null, 2)}\n`);
  for (const file of await walkMarkdownFiles(root, {
    ignore: (relative) => relative.startsWith('indexes/'),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    if (!parsed.data.record_type || parsed.data.record_type === 'knowledge_entry') continue;
    delete parsed.data.test_scope;
    if (parsed.data.record_type === 'brand_knowledge_base') {
      parsed.data.mode = 'real';
      parsed.data.status = 'active';
      parsed.data.provenance = {
        kind: 'real', usage: 'brand_operations',
        decision_ref: 'fixture://real-kbase-approval-for-code-path-test',
      };
    }
    await writeFile(file, serializeMarkdownObject(parsed.data, parsed.content));
  }
  const cyclePlan = {
    schema_version: 'm6-create-cycle-plan/1.0.0',
    cycle_id: 'CYC-REAL-PATH-FIXTURE-001',
    cycle_path: 'cycles/real-path-fixture/cycle.md',
    run_id: 'RUN-REAL-PATH-FIXTURE-001',
    snapshot_id: 'CIS-REAL-PATH-FIXTURE-001',
    merchant_ref: MERCHANT_REF,
    knowledge_base_ref: KNOWLEDGE_BASE_REF,
    goal_ref: 'GOAL-M6-TEST-001',
    source_paths: inputs.sourcePaths,
    artifact_paths: inputs.artifactPaths,
  };
  const planPath = path.join(root, 'real-cycle-plan.json');
  await writeFile(planPath, `${JSON.stringify(cyclePlan, null, 2)}\n`);
  const readiness = await assessLifecycleReadiness({
    workspace: root,
    knowledgeBaseRef: KNOWLEDGE_BASE_REF,
    goalRef: cyclePlan.goal_ref,
  });
  assert.equal(readiness.real_cycle_start_ready, true);
  await assert.rejects(executeLifecycle({command:'create-cycle',workspace:root,plan:planPath}),
    error=>error.code==='REAL_CYCLE_PLAN_REQUIRED');
  await assert.rejects(readFile(path.join(root,cyclePlan.cycle_path)),error=>error.code==='ENOENT');
});
