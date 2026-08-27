import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import {
  advanceCycle,
} from '../plugins/geo-expert/scripts/lib/cycle-lifecycle.mjs';
import {
  loadWorkspaceGraph,
} from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  sha256,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import {
  execute as executeLifecycle,
} from '../plugins/geo-expert/scripts/geo-lifecycle.mjs';
import {
  validateWorkspace,
} from '../plugins/geo-expert/scripts/workspace-validate.mjs';
import {
  createM6FrozenCycleWorkspace,
} from './helpers/m6-cycle-fixtures.mjs';
import {
  createM6CompletedBusinessTraceWorkspace,
} from './helpers/m6-completed-business-fixture.mjs';
import {
  materializeM6E2EGates,
} from './helpers/m6-e2e-fixtures.mjs';
import {
  M6_APPROVAL,
  M6_NOW,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  readM6FixtureJson,
  seedM6FreezeInputs,
  writeM6Object,
} from './helpers/m6-fixtures.mjs';
import {
  capture,
} from './helpers/m6-adversarial-fixtures.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_LIFECYCLE_FILES = [
  'plugins/geo-expert/scripts/geo-lifecycle.mjs',
  'plugins/geo-expert/scripts/lib/cycle-lifecycle.mjs',
  'plugins/geo-expert/scripts/lib/cycle-trace.mjs',
];

async function publicLifecycleSource() {
  return (await Promise.all(PUBLIC_LIFECYCLE_FILES.map((file) =>
    readFile(path.join(REPO_ROOT, file), 'utf8')))).join('\n');
}

async function currentCycle(root, cycleId) {
  return (await loadWorkspaceGraph({ workspace: root })).byId.get(cycleId).data;
}

function coreAdvancePlan(cycle, gate, descriptors, tag) {
  const suffix = tag.toUpperCase().replaceAll('_', '-');
  return {
    schema_version: 'm6-cycle-transition-plan/1.0.0',
    operation_id: `m6-final-qa-${tag}`,
    operation_fingerprint: `caller-${tag}`,
    transition_id: `CTR-M6-FINAL-QA-${suffix}-001`,
    gate_snapshot_id: `CIS-M6-FINAL-QA-${suffix}-001`,
    cycle_ref: cycle.id,
    goal_entry_key: cycle.goal_tracks[0].goal_entry_key,
    expected_cycle_version: cycle.version,
    from_stage: gate.from_stage,
    to_stage: gate.to_stage,
    actor: { kind: 'deterministic_tool' },
    lease: {
      owner_id: `m6-final-qa-${tag}`,
      now: M6_NOW,
      ttl_ms: 60_000,
    },
    gate: {
      source_paths: descriptors.map((descriptor) => descriptor.path),
      artifact_paths: ['execution/contracts/measurement-contract.json'],
    },
  };
}

async function advanceFixtureGate(root, cycle, gate, descriptors, tag) {
  await advanceCycle({
    workspace: root,
    plan: coreAdvancePlan(cycle, gate, descriptors, tag),
  });
  return currentCycle(root, cycle.id);
}

test('final QA P0: all-rejected Adoption 之后唯一合法分支是 cancel/no_adoption', async () => {
  const fixture = await createM6FrozenCycleWorkspace();
  try {
    const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
    const gates = await materializeM6E2EGates(fixture.root, bundle, { allRejected: true });
    let cycle = fixture.cycle;
    for (const [index, name] of ['baseline', 'diagnosis', 'adoption'].entries()) {
      cycle = await advanceFixtureGate(
        fixture.root,
        cycle,
        bundle.gates[index],
        gates.byGate[name],
        `rejected-${name}`,
      );
    }
    const adoption = (await loadWorkspaceGraph({ workspace: fixture.root }))
      .byId.get('ADR-M6-ASSET-001').data;
    assert.ok(adoption.decisions.every((item) => item.decision === 'rejected'));

    const publicationPath = 'cycles/m6/publications/pub-m6-final-qa-rejected-001.md';
    await writeM6Object(fixture.root, publicationPath, {
      id: 'PUB-M6-FINAL-QA-REJECTED-001',
      record_type: 'asset_publication',
      status: 'confirmed',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      title: 'Rejected adoption must not publish',
      test_scope: { ...M6_TEST_SCOPE },
      proposal_ref: 'PRP-M6-ASSET-001',
      adoption_ref: adoption.id,
      asset_ref: 'AST-M6-TEST-001',
      published_item_ids: ['REC-M6-ASSET-001'],
      published_locator: 'https://m6-test-merchant.invalid/rejected-publication',
      content_sha256: sha256('rejected-publication'),
      published_at: M6_NOW,
      approval: { ...M6_APPROVAL },
    });
    const cyclePath = path.join(fixture.root, 'cycles/m6/cycle.md');
    const beforeCycle = await readFile(cyclePath);
    const outcome = await capture(() => advanceCycle({
      workspace: fixture.root,
      plan: coreAdvancePlan(cycle, {
        from_stage: 'adoption_decided',
        to_stage: 'publication_confirmed',
      }, [{ path: publicationPath }], 'rejected-publication'),
    }));
    assert.deepEqual({
      rejected: !outcome.ok,
      error_code: outcome.error?.code ?? null,
      cycle_unchanged: (await readFile(cyclePath)).equals(beforeCycle),
    }, {
      rejected: true,
      error_code: 'CYCLE_GATE_REQUIRED',
      cycle_unchanged: true,
    });
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: create-cycle 必须为 freeze CIS 中每个 Goal 建独立 track', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    await writeM6Object(root, 'cycles/preparation/goal-2.md', {
      id: 'GOAL-M6-FINAL-QA-002',
      record_type: 'perception_goal',
      status: 'approved',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      title: 'Second synthetic Goal',
      test_scope: { ...M6_TEST_SCOPE },
      goal_statement: 'Keep the second synthetic Goal independent.',
      success_question: 'Does Cycle preserve both Goal tracks?',
      query_set_refs: ['QS-M6-TEST-001'],
      approval: { ...M6_APPROVAL },
    });
    const plan = structuredClone((await readM6FixtureJson('plans/cycle-1-e2e.json')).create_cycle);
    plan.source_paths.push('cycles/preparation/goal-2.md');
    const planPath = path.join(root, 'create-multi-goal.json');
    await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`);
    await executeLifecycle({ command: 'create-cycle', workspace: root, plan: planPath });
    const graph = await loadWorkspaceGraph({ workspace: root });
    const cycle = graph.byId.get(plan.cycle_id).data;
    const snapshot = graph.byId.get(plan.snapshot_id).data;
    assert.equal(snapshot.source_entries.filter((entry) =>
      entry.record_type === 'perception_goal').length, 2);
    assert.equal(cycle.goal_tracks.length, 2, 'freeze 中的第二个 Goal 不得被静默丢弃');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('final QA P0: generic run 必须承载 gate CIS，且 advance 要回填 track output refs', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
    const gates = await materializeM6E2EGates(root, bundle);
    const createPlan = structuredClone(bundle.create_cycle);
    createPlan.cycle_id = 'CYC-M6-FINAL-QA-GENERIC-001';
    createPlan.cycle_path = 'cycles/m6/generic-cycle.md';
    createPlan.snapshot_id = 'CIS-M6-FINAL-QA-GENERIC-FREEZE-001';
    createPlan.run_id = 'RUN-M6-FINAL-QA-GENERIC-001';
    const createPath = path.join(root, 'create-generic.json');
    await writeFile(createPath, `${JSON.stringify(createPlan, null, 2)}\n`);
    const created = await executeLifecycle({
      command: 'create-cycle', workspace: root, plan: createPath,
    });
    const gate = bundle.gates[0];
    const advancePlan = {
      schema_version: 'm6-cycle-transition-plan/1.0.0',
      operation_id: 'm6-final-qa-generic-baseline',
      operation_fingerprint: 'caller-value',
      transition_id: 'CTR-M6-FINAL-QA-GENERIC-BASELINE-001',
      gate_snapshot_id: 'CIS-M6-FINAL-QA-GENERIC-BASELINE-001',
      cycle_ref: createPlan.cycle_id,
      goal_entry_key: created.goal_entry_key,
      expected_cycle_version: created.cycle_version,
      from_stage: gate.from_stage,
      to_stage: gate.to_stage,
      gate_objects: gates.byGate.baseline,
      actor: { kind: 'deterministic_tool' },
      lease: { owner_id: 'generic-owner', now: M6_NOW, ttl_ms: 60_000 },
    };
    const advancePath = path.join(root, 'advance-generic.json');
    await writeFile(advancePath, `${JSON.stringify(advancePlan, null, 2)}\n`);
    await executeLifecycle({
      command: 'advance', workspace: root, cycle: createPlan.cycle_id, plan: advancePath,
    });

    const cycle = matter(await readFile(path.join(root, createPlan.cycle_path), 'utf8')).data;
    const gateSnapshot = matter(await readFile(path.join(
      root,
      'cycles/m6/snapshots/cis-m6-final-qa-generic-baseline-001.md',
    ), 'utf8')).data;
    const validation = await validateWorkspace(root, { objects: true });
    assert.deepEqual({
      gate_run_ref: gateSnapshot.run_ref,
      baseline_aggregation_refs: cycle.goal_tracks[0].baseline_aggregation_refs,
      workspace_valid: validation.ok,
    }, {
      gate_run_ref: createPlan.run_id,
      baseline_aggregation_refs: ['AGG-M6-BASE-001'],
      workspace_valid: true,
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('final QA P0: public completed Cycle 1 必须保持 Analytics Run 与完整 graph refs 闭合', async () => {
  const fixture = await createM6CompletedBusinessTraceWorkspace();
  try {
    const runRef = 'RUN-M6-ANALYTICS-E2E-001';
    const validation = await validateWorkspace(fixture.root, { objects: true });
    let analyticsRunExists = true;
    try {
      await readFile(path.join(fixture.root, 'runs', runRef, 'run.md'));
    } catch {
      analyticsRunExists = false;
    }
    const brokenAnalyticsRunRefs = (validation.object_errors ?? [])
      .filter((item) => item.code === 'BROKEN_REF'
        && item.field === 'run_ref'
        && item.ref === runRef)
      .map((item) => item.path)
      .sort();
    assert.deepEqual({
      workspace_valid: validation.ok,
      analytics_run_exists: analyticsRunExists,
      broken_analytics_run_refs: brokenAnalyticsRunRefs,
    }, {
      workspace_valid: true,
      analytics_run_exists: true,
      broken_analytics_run_refs: [],
    }, 'E2E/trace 绿不能掩盖 ANO/BSIG 指向不存在的 canonical Analytics Run');
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test('final QA P0: public lifecycle 不得硬编码 canonical fixture Run ID', async () => {
  const source = await publicLifecycleSource();
  assert.equal(source.includes('RUN-M6-CIS-001'), false, 'public core 不得绑定 canonical fixture Run ID');
});

test('final QA P1: public lifecycle 不得硬编码 fixture wall clock', async () => {
  const source = await publicLifecycleSource();
  assert.equal(source.includes('2026-08-27T00:00:00Z'), false, 'public core 不得绑定 fixture wall clock');
});

test('final QA P1: network-disabled 必须由执行 guard 证明而非自报', async () => {
  const source = await publicLifecycleSource();
  assert.equal(
    /GEO_M6_NETWORK_DISABLED|network[-_]guard|assertNetworkDisabled/.test(source),
    true,
    '断网必须由可执行 guard 证明，不能只返回 network_accessed:false',
  );
});
