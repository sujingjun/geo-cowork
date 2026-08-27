import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import {
  advanceCycle,
  resumeCycleTransition,
} from '../plugins/geo-expert/scripts/lib/cycle-lifecycle.mjs';
import {
  acquireCycleLease,
  recoverStaleCycleLease,
  releaseCycleLease,
} from '../plugins/geo-expert/scripts/lib/cycle-lock.mjs';
import {
  M6_CYCLE_ID,
  createM6FixtureWorkspace,
} from './helpers/m6-fixtures.mjs';
import {
  createM6FrozenCycleWorkspace,
} from './helpers/m6-cycle-fixtures.mjs';
import {
  capture,
  materializeM6BaselineGate,
  pathExists,
  transitionPlan,
  waitForPath,
} from './helpers/m6-adversarial-fixtures.mjs';

const LOCK_PATH = 'cycles/.locks/cyc-m6-test-001.json';

test('P0: active freeze 任一 live bytes 漂移必须阻止 advance', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const cyclePath = path.join(fixture.root, 'cycles/m6/cycle.md');
    const beforeCycle = await readFile(cyclePath);
    await writeFile(
      path.join(fixture.root, 'queries/formal/query.md'),
      '# frozen query was replaced after freeze\n',
    );
    const outcome = await capture(() => advanceCycle({
      workspace: fixture.root,
      plan: transitionPlan(fixture.cycle, {
        operation_id: 'op-m6-freeze-drift-001',
        transition_id: 'CTR-M6-FREEZE-DRIFT-001',
        gate_snapshot_id: 'CIS-M6-FREEZE-DRIFT-001',
      }),
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      cycle_unchanged: (await readFile(cyclePath)).equals(beforeCycle),
    }, {
      rejected: true,
      error_code: 'CYCLE_VERSION_DRIFT',
      cycle_unchanged: true,
    }, 'active Cycle 每次推进前必须比较完整 freeze CIS live bytes');
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('P0: transition gate snapshot 后的 live gate 漂移必须在锁内复验', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const baseline = await materializeM6BaselineGate(fixture.root);
    const loadDir = path.join(fixture.root, 'execution/gate-load');
    await mkdir(loadDir, { recursive: true });
    const loadPaths = [];
    for (let index = 0; index < 80; index += 1) {
      const name = `gate-load-${String(index).padStart(3, '0')}.json`;
      await writeFile(path.join(loadDir, name), Buffer.alloc(64 * 1024, index));
      loadPaths.push(`execution/gate-load/${name}`);
    }
    const plan = transitionPlan(fixture.cycle, {
      operation_id: 'op-m6-gate-drift-001',
      transition_id: 'CTR-M6-GATE-DRIFT-001',
      gate_snapshot_id: 'CIS-M6-GATE-DRIFT-001',
      gate: {
        source_paths: baseline.descriptors.map((descriptor) => descriptor.path),
        artifact_paths: [
          'execution/contracts/measurement-contract.json',
          ...loadPaths,
        ],
      },
    });
    const cyclePath = path.join(fixture.root, 'cycles/m6/cycle.md');
    const beforeCycle = await readFile(cyclePath);
    const running = capture(() => advanceCycle({ workspace: fixture.root, plan }));
    const driftDescriptor = baseline.descriptors[0];
    const copied = await waitForPath(
      fixture.root,
      'runs/RUN-M6-CIS-001/outputs/snapshots/cis-m6-gate-drift-001/'
        + `objects/${driftDescriptor.path}`,
    );
    assert.equal(copied, true, '对抗 harness 必须先观察到 gate copy 已持久化');
    const gatePath = path.join(fixture.root, ...driftDescriptor.path.split('/'));
    const gateBytes = await readFile(gatePath, 'utf8');
    await writeFile(gatePath, `${gateBytes}\nGate drift after snapshot copy.\n`);
    const outcome = await running;
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      cycle_unchanged: (await readFile(cyclePath)).equals(beforeCycle),
    }, {
      rejected: true,
      error_code: 'CYCLE_CAS_MISMATCH',
      cycle_unchanged: true,
    }, '锁内必须重新比较 live gate 与 transition CIS bytes');
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('P0: 仅 Goal+measurement 自报不能满足 baseline_recorded gate', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const outcome = await capture(() => advanceCycle({
      workspace: fixture.root,
      plan: transitionPlan(fixture.cycle, {
        operation_id: 'op-m6-gate-readiness-001',
        transition_id: 'CTR-M6-GATE-READINESS-001',
        gate_snapshot_id: 'CIS-M6-GATE-READINESS-001',
      }),
    }));
    assert.equal(outcome.ok, false, '缺 Sample/Review/Aggregation 的 baseline gate 必须失败');
    assert.equal(outcome.error?.code, 'CYCLE_GATE_REQUIRED');
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('P0: operation fingerprint 必须由完整 plan 重算，不能只比较调用方字符串', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const baseline = await materializeM6BaselineGate(fixture.root);
    const firstPlan = transitionPlan(fixture.cycle, {
      operation_id: 'op-m6-fingerprint-001',
      transition_id: 'CTR-M6-FINGERPRINT-001',
      gate_snapshot_id: 'CIS-M6-FINGERPRINT-001',
      gate: baseline.gate,
    });
    await advanceCycle({ workspace: fixture.root, plan: firstPlan });
    const outcome = await capture(() => advanceCycle({
      workspace: fixture.root,
      plan: {
        ...firstPlan,
        to_stage: 'diagnosis_ready',
        gate_snapshot_id: 'CIS-M6-FINGERPRINT-DIFFERENT-001',
      },
    }));
    assert.equal(outcome.ok, false, '同字符串 fingerprint 但 plan bytes 不同必须冲突');
    assert.equal(outcome.error?.code, 'TRANSITION_CONFLICT');
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('P0: orphan resume 不得越过另一 owner 的 active lease', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const baseline = await materializeM6BaselineGate(fixture.root);
    const plan = transitionPlan(fixture.cycle, {
      operation_id: 'op-m6-resume-lease-001',
      transition_id: 'CTR-M6-RESUME-LEASE-001',
      gate_snapshot_id: 'CIS-M6-RESUME-LEASE-001',
      gate: baseline.gate,
      fault_after: 'transition_intent_written',
    });
    const fault = await capture(() => advanceCycle({ workspace: fixture.root, plan }));
    assert.equal(fault.error?.code, 'FAULT_INJECTED', '对抗 fixture 必须先形成 orphan intent');
    await acquireCycleLease({
      workspace: fixture.root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'm6-adversarial-owner-b',
      now: '2026-08-27T00:00:30Z',
      ttlMs: 60_000,
      inputFingerprint: 'b'.repeat(64),
    });
    const cyclePath = path.join(fixture.root, 'cycles/m6/cycle.md');
    const beforeCycle = await readFile(cyclePath);
    const outcome = await capture(() => resumeCycleTransition({
      workspace: fixture.root,
      cycleId: M6_CYCLE_ID,
      operationId: plan.operation_id,
      expectedCycleVersion: '1.0.0',
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      cycle_unchanged: (await readFile(cyclePath)).equals(beforeCycle),
    }, {
      rejected: true,
      error_code: 'LEASE_ACTIVE',
      cycle_unchanged: true,
    });
  } finally {
    await rm(fixture.root, { recursive: true });
  }
});

test('P0: 同 owner 的过期 lease 也必须走显式 stale recovery', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await acquireCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'same-owner',
      now: '2026-08-27T00:00:00Z',
      ttlMs: 1_000,
      inputFingerprint: 'a'.repeat(64),
    });
    const outcome = await capture(() => acquireCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'same-owner',
      now: '2026-08-27T00:00:02Z',
      ttlMs: 1_000,
      inputFingerprint: 'a'.repeat(64),
    }));
    assert.equal(outcome.ok, false, '过期 lease 不能因 owner/fingerprint 相同而 kept');
    assert.equal(outcome.error?.code, 'LEASE_STALE_RECOVERY_REQUIRED');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: stale owner release 必须以 revision fencing 拒绝删除 takeover lease', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await acquireCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'shared-owner-id',
      now: '2026-08-27T00:00:00Z',
      ttlMs: 1_000,
      inputFingerprint: 'a'.repeat(64),
    });
    const takeover = await recoverStaleCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'shared-owner-id',
      now: '2026-08-27T00:00:02Z',
      ttlMs: 60_000,
      expectedInputFingerprint: 'a'.repeat(64),
    });
    assert.equal(takeover.revision, 2, '对抗 fixture 必须先完成 revision 2 takeover');
    const staleRelease = await capture(() => releaseCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'shared-owner-id',
      expectedRevision: 1,
    }));
    assert.deepEqual({
      rejected: !staleRelease.ok,
      lock_survives: await pathExists(root, LOCK_PATH),
    }, {
      rejected: true,
      lock_survives: true,
    }, 'release 必须同时 fence owner 与 revision');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: takeover claim crash 后同 plan 重试必须可恢复', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await acquireCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'crashed-owner',
      now: '2026-08-27T00:00:00Z',
      ttlMs: 1_000,
      inputFingerprint: 'a'.repeat(64),
    });
    const claim = path.join(root, 'cycles/.locks/cyc-m6-test-001.takeover-1.json');
    await writeFile(claim, '{"simulated":"crash-after-claim"}\n');
    const outcome = await capture(() => recoverStaleCycleLease({
      workspace: root,
      cycleId: M6_CYCLE_ID,
      ownerId: 'recovery-owner',
      now: '2026-08-27T00:00:02Z',
      ttlMs: 60_000,
      expectedInputFingerprint: 'a'.repeat(64),
    }));
    assert.equal(outcome.ok, true, '同 revision/plan 的 orphan takeover claim 必须可重入恢复');
    assert.equal(outcome.value?.action, 'taken_over');
  } finally {
    await rm(root, { recursive: true });
  }
});
