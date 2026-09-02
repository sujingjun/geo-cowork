import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  materializeStrategyOutput,
} from '../plugins/geo-expert/scripts/lib/strategy-output.mjs';
import {
  traceStrategy,
} from '../plugins/geo-expert/scripts/lib/strategy-trace.mjs';
import {
  buildStrategyGateObjects,
  buildValidStrategyOutput,
  createM7Workspace,
} from './helpers/m7-cycle2-fixtures.mjs';

test('strategy absent trace 返回 not_applicable，不阻塞普通 lifecycle', () => {
  const trace = traceStrategy({ assessment: null, snapshot: null });
  assert.equal(trace.result, 'not_applicable');
  assert.deepEqual(trace.errors, []);
  assert.equal(trace.warnings[0].code, 'STRATEGY_NOT_TRIGGERED');
});

test('strategy trace 锁定 invocation、同 Product Gap tuple、factor DDM 与 STO', () => {
  const { assessment, dimension, output } = buildStrategyGateObjects();
  const trace = traceStrategy({
    assessment,
    snapshot: { snapshot_id: 'CIS-M7-STRATEGY-001', snapshot_kind: 'strategy' },
    dimensions: [dimension],
    output,
  });
  assert.equal(trace.result, 'complete');
  assert.equal(trace.human_invocation.decision_ref.startsWith('fixture://'), true);
  assert.deepEqual(trace.errors, []);
});

test('STO 对真实 MyyShop Workspace 保持 zero-write', async () => {
  const fixture = await buildValidStrategyOutput();
  const realWorkspace = path.resolve('workspaces/myyshop');
  await assert.rejects(
    materializeStrategyOutput({
      workspace: realWorkspace,
      path: 'strategy/outputs/sto-m7-forbidden.md',
      ...fixture,
    }),
    (error) => ['REAL_WORKSPACE_WRITE_FORBIDDEN', 'WORKSPACE_SCOPE_INVALID'].includes(error.code),
  );
  await assert.rejects(
    access(path.join(realWorkspace, 'strategy/outputs/sto-m7-forbidden.md')),
    (error) => error.code === 'ENOENT',
  );
});

test('GCB/GCD/GSEL/Cycle2 半成品只按同一 plan/checksum 恢复，漂移与污染失败', async () => {
  const {
    resumeCycleTwoMaterialization,
    validateCycleTwoRecoveryPlan,
  } = await import('../plugins/geo-expert/scripts/lib/cycle-two.mjs');
  const root = await createM7Workspace();
  try {
    const base = {
      schema_version: 'm7-cycle-two-recovery/1.0.0',
      workspace: root,
      plan_sha256: 'a'.repeat(64),
      frozen_plan_sha256: 'a'.repeat(64),
      predecessor_review_ref: 'CRV-M6-CYCLE-ONE-DECIDED-001',
      selection_ref: 'GSEL-M7-DECIDED-001',
      completed_steps: ['gcb_gcd_materialized'],
      step_proofs: { gcb_gcd_materialized: 'b'.repeat(64) },
    };
    assert.deepEqual(validateCycleTwoRecoveryPlan(base).errors, []);
    const resumed = await resumeCycleTwoMaterialization(base);
    assert.equal(resumed.action, 'resumed');
    for (const invalid of [
      { ...base, plan_sha256: 'c'.repeat(64) },
      { ...base, workspace: realpath('workspaces/myyshop') },
      { ...base, predecessor_review_ref: 'CRV-REAL-MYYSHOP-001' },
    ]) assert.notDeepEqual(validateCycleTwoRecoveryPlan(invalid).errors, []);
  } finally {
    await rm(root, { recursive: true });
  }
});

function realpath(relative) {
  return path.resolve(relative);
}
