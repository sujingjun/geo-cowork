import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  buildCycleSnapshotPlan,
  materializeCycleSnapshot,
} from '../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import {
  execute as executeLifecycle,
} from '../plugins/geo-expert/scripts/geo-lifecycle.mjs';
import {
  initWorkspace,
} from '../plugins/geo-expert/scripts/workspace-init.mjs';
import {
  validateWorkspace,
} from '../plugins/geo-expert/scripts/workspace-validate.mjs';
import {
  createM6FrozenCycleWorkspace,
} from './helpers/m6-cycle-fixtures.mjs';
import {
  M6_APPROVAL,
  M6_CYCLE_ID,
  M6_MERCHANT_ID,
  M6_NOW,
  M6_RUN_ID,
  readM6FixtureJson,
  writeM6Object,
} from './helpers/m6-fixtures.mjs';
import {
  capture,
  treeDigest,
} from './helpers/m6-adversarial-fixtures.mjs';

test('final QA P0: normal Workspace 必须拒绝 TMT/test_scope 反向污染', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-final-qa-normal-root-'));
  try {
    const identity = await initWorkspace({ workspace: root, brand: 'Normal Workspace' });
    const merchantId = 'TMT-M6-FINAL-QA-REVERSE-001';
    const testScope = {
      kind: 'synthetic',
      usage: 'test_only',
      merchant_ref: merchantId,
      workspace_id: identity.workspace_id,
    };
    await writeM6Object(root, 'cycles/preparation/injected-test-merchant.md', {
      id: merchantId,
      record_type: 'test_merchant',
      status: 'frozen',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      title: 'Injected test merchant',
      test_scope: testScope,
      workspace_id: identity.workspace_id,
      workspace_namespace: 'm6-final-qa-reverse',
      display_name: 'Injected Test Merchant',
      identity: {
        legal_entity_kind: 'fictitious',
        canonical_locator: 'https://m6-final-qa-reverse.invalid/',
        real_brand_identity_claimed: false,
      },
      provenance: {
        kind: 'synthetic', usage: 'test_only', decision_ref: M6_APPROVAL.decision_ref,
      },
      real_workspace_forbidden: ['workspaces/myyshop'],
      approval: { ...M6_APPROVAL },
    });
    await writeM6Object(root, 'queries/candidates/injected-test-query.md', {
      id: 'Q-M6-FINAL-QA-REVERSE-001',
      record_type: 'query',
      status: 'candidate',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      title: 'Injected test-scoped query',
      test_scope: testScope,
      query_text: 'Should a normal Workspace contain test_scope?',
      language: 'en-US',
    });
    const result = await validateWorkspace(root, { objects: true });
    assert.equal(result.ok, false, '非 test-only 根不得容纳 TMT 或 test_scope 对象');
    assert.ok(result.object_errors.some((item) =>
      item.code === 'SYNTHETIC_REAL_REF_CONTAMINATION'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('final QA P0: CIS 必须扫描 artifact bytes 中的真实 URL/ID 污染', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const pollutedPath = 'execution/contracts/m6-final-qa-polluted.json';
    await writeFile(path.join(fixture.root, ...pollutedPath.split('/')), `${JSON.stringify({
      source: 'https://www.myyshop.com/private',
      claim_ref: 'CLM-MYYSHOP-REAL-001',
    })}\n`);
    const plan = await buildCycleSnapshotPlan({
      workspace: fixture.root,
      id: 'CIS-M6-FINAL-QA-POLLUTED-001',
      snapshotKind: 'transition',
      merchantRef: M6_MERCHANT_ID,
      cycleRef: M6_CYCLE_ID,
      runRef: M6_RUN_ID,
      sourcePaths: ['cycles/preparation/goal.md'],
      artifactPaths: [{
        role: 'other_contract',
        path: pollutedPath,
        media_type: 'application/json',
      }],
    });
    const before = await treeDigest(fixture.root);
    const outcome = await capture(() => materializeCycleSnapshot({
      workspace: fixture.root,
      plan,
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      unchanged: await treeDigest(fixture.root) === before,
    }, {
      rejected: true,
      error_code: 'SYNTHETIC_REAL_REF_CONTAMINATION',
      unchanged: true,
    });
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: BAD merchant plan 必须在零写阶段失败，validate 不得漏报', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-final-qa-bad-merchant-'));
  const planRoot = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-final-qa-plan-'));
  try {
    const plan = structuredClone((await readM6FixtureJson('plans/cycle-1-e2e.json')).prepare);
    plan.merchant_id = 'BAD';
    const planPath = path.join(planRoot, 'bad-merchant.json');
    await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`);
    const before = await treeDigest(root);
    const outcome = await capture(() => executeLifecycle({
      command: 'prepare-test-merchant',
      workspace: root,
      plan: planPath,
    }));
    const validation = await executeLifecycle({ command: 'validate', workspace: root });
    assert.equal(outcome.ok, false, '非法 stable ID 必须在 identity/TMT/目录写入前失败');
    assert.ok(
      ['INVALID_ARGUMENT', 'INVALID_FRONTMATTER', 'TEST_MERCHANT_IDENTITY_INVALID']
        .includes(outcome.error?.code),
      `非法 merchant ID 错误码不明确: ${outcome.error?.code ?? 'success'}`,
    );
    assert.equal(await treeDigest(root), before, 'BAD merchant plan 必须零写');
    assert.ok(validation.errors.length > 0, '公开 lifecycle validate 不得漏报非法/空 Workspace');
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(planRoot, { recursive: true, force: true });
  }
});
