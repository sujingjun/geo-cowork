import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  M6_APPROVAL,
  createM6FixtureWorkspace,
  readM6FixtureJson,
  seedM6FreezeInputs,
} from './helpers/m6-fixtures.mjs';
import { materializeM6E2EGates } from './helpers/m6-e2e-fixtures.mjs';
import { materializeM6OutputGateFixtures } from './helpers/m6-e2e-output-fixtures.mjs';
import { sha256, stableStringify } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { buildIndexes } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { validateDiagnosisWorkspace } from '../plugins/geo-expert/scripts/lib/diagnosis-profile.mjs';
import { validateAnswerWorkspace } from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { decideCycleReview } from '../plugins/geo-expert/scripts/lib/cycle-trace.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIFECYCLE = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-lifecycle.mjs');
const ANALYTICS = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-analytics.mjs');
const REAL_MYYSHOP = path.join(REPO_ROOT, 'workspaces/myyshop');

async function ensureEntrypoints() {
  await Promise.all([access(LIFECYCLE), access(ANALYTICS)]);
}

async function runCli(script, args, { cwd = os.tmpdir() } = {}) {
  return exec(process.execPath, [script, ...args], {
    cwd,
    env: { ...process.env, GEO_M6_NETWORK_DISABLED: '1' },
  });
}

async function writePlan(root, name, plan) {
  const dir = path.join(root, 'fixtures', 'plans');
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${name}.json`);
  await writeFile(file, `${JSON.stringify(plan, null, 2)}\n`);
  return file;
}

async function trackedMyyShopSnapshot() {
  const { stdout } = await exec('git', [
    'ls-files', '-z', '--', 'workspaces/myyshop',
  ], { cwd: REPO_ROOT, encoding: 'buffer' });
  const files = stdout.toString('utf8').split('\0').filter(Boolean);
  return Object.fromEntries(await Promise.all(files.map(async (relative) => [
    relative,
    sha256(await readFile(path.join(REPO_ROOT, relative))),
  ])));
}

function advancePlan(bundle, gate, cycleVersion, goalEntryKey, gateObjects = gate.object_specs) {
  return {
    schema_version: 'm6-cycle-transition-plan/1.0.0',
    operation_id: `m6-e2e-${gate.name}`,
    operation_fingerprint: sha256(stableStringify({ gate: gate.name, cycleVersion })),
    transition_id: gate.transition_id,
    gate_snapshot_id: gate.gate_snapshot_id,
    cycle_ref: bundle.create_cycle.cycle_id,
    goal_entry_key: goalEntryKey,
    expected_cycle_version: cycleVersion,
    from_stage: gate.from_stage,
    to_stage: gate.to_stage,
    gate_objects: gateObjects,
    actor: gate.name === 'review_decided'
      ? { kind: 'fixture_human', decision_ref: bundle.review.decision_ref }
      : { kind: 'deterministic_tool' },
    lease: {
      owner_id: `m6-e2e-${gate.name}`,
      now: '2026-08-27T00:00:00Z',
      ttl_ms: 60_000,
    },
  };
}

async function descriptorsFromSpecs(root, specs) {
  return Promise.all(specs.map(async (spec) => ({
    ...spec,
    sha256: sha256(await readFile(path.join(root, ...spec.path.split('/')))),
  })));
}

async function createCliCycle(root, bundle) {
  const createPath = await writePlan(root, 'create-cycle', bundle.create_cycle);
  const created = JSON.parse((await runCli(LIFECYCLE, [
    'create-cycle', '--workspace', root, '--plan', createPath,
  ])).stdout);
  return { version: created.cycle_version, goalEntryKey: created.goal_entry_key };
}

async function advanceCliUntil(root, bundle, byGate, stopIndex, initial) {
  let { version, goalEntryKey } = initial;
  for (const gate of bundle.gates.slice(0, stopIndex)) {
    ({ version, goalEntryKey } = await advanceCliGate(
      root, bundle, gate, { version, goalEntryKey }, byGate[gate.name], `setup-${gate.name}`,
    ));
  }
  return { version, goalEntryKey };
}

async function advanceCliGate(root, bundle, gate, current, descriptors, name = gate.name) {
  const gatePath = await writePlan(root, name, advancePlan(
    bundle, gate, current.version, current.goalEntryKey, descriptors,
  ));
  const result = JSON.parse((await runCli(LIFECYCLE, [
    'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
    '--plan', gatePath,
  ])).stdout);
  return { version: result.cycle_version, goalEntryKey: current.goalEntryKey };
}

async function assembleCliReview(root, bundle, current) {
  const plan = {
    schema_version: 'm6-cycle-review-plan/1.0.0',
    merchant_ref: bundle.create_cycle.merchant_ref,
    cycle_ref: bundle.create_cycle.cycle_id,
    reviewed_cycle_input_version: current.version,
    review_snapshot: { id: bundle.review.snapshot_id },
    waiting_review: { id: bundle.review.waiting_id, path: bundle.review.waiting_path },
    goal_results: [{
      goal_entry_key: current.goalEntryKey,
      perception_goal: 'inconclusive',
      observations: ['Synthetic missing-gate fixture.'],
      business_signal_entry_keys: ['a'.repeat(64)],
      limitations: ['Synthetic fixture only.'],
      forbidden_conclusions: ['No causal or real MyyShop conclusion.'],
    }],
    next_cycle_candidate_inputs: [],
    test_scope: {
      kind: 'synthetic', usage: 'test_only',
      merchant_ref: bundle.create_cycle.merchant_ref,
      workspace_id: bundle.prepare.workspace_id,
    },
  };
  await runCli(LIFECYCLE, [
    'assemble-review', '--workspace', root, '--plan', await writePlan(root, 'missing-review', plan),
  ]);
  return {
    plan,
    descriptors: await descriptorsFromSpecs(
      root,
      bundle.gates.find((gate) => gate.name === 'review_waiting').object_specs,
    ),
  };
}

test('Cycle 1 E2E plan 只有一个 Goal、九个显式 gate，Analytics/Review 不合并', async () => {
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  assert.equal(bundle.create_cycle.goal_ref, 'GOAL-M6-TEST-001');
  assert.equal(bundle.gates.length, 9);
  assert.notEqual(bundle.gates.find((gate) => gate.name === 'analytics').transition_id,
    bundle.gates.find((gate) => gate.name === 'review_waiting').transition_id);
  assert.notEqual(bundle.review.waiting_id, bundle.review.decided_id);
  assert.equal(bundle.expected.real_myyshop_impact, false);
  for (const gate of bundle.gates) {
    assert.ok(gate.object_specs.length > 0, gate.name);
    for (const object of gate.object_specs) {
      assert.match(object.path, /\.md$/);
      assert.match(object.version, /^\d+\.\d+\.\d+$/);
    }
  }

  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const materialized = await materializeM6E2EGates(root, bundle);
    assert.ok(materialized.all.length >= 20);
    assert.ok(materialized.all.every((object) => /^[a-f0-9]{64}$/.test(object.sha256)));
    const graph = await buildIndexes({ workspace: root, write: false });
    assert.ok(graph.object_count >= 30);
    assert.deepEqual((await validateDiagnosisWorkspace({ workspace: root })).errors, []);
    assert.deepEqual((await validateAnswerWorkspace({ workspace: root })).errors, []);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('公开 CLI/API 跑通单 Goal synthetic Cycle 1，fresh process 决定 Review，trace completed', async () => {
  await ensureEntrypoints();
  const beforeMyyShop = await trackedMyyShopSnapshot();
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-cycle1-e2e-'));
  try {
    const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
    const preparePath = await writePlan(root, 'prepare', bundle.prepare);
    await runCli(LIFECYCLE, [
      'prepare-test-merchant', '--workspace', root, '--plan', preparePath,
    ]);
    await seedM6FreezeInputs(root, { skipMerchant: true });
    const gateGraph = await materializeM6E2EGates(root, bundle);
    const created = await createCliCycle(root, bundle);
    let version = created.version;
    const goalEntryKey = created.goalEntryKey;

    for (const gate of bundle.gates.slice(0, 6)) {
      const gatePath = await writePlan(root, `advance-${gate.name}`, advancePlan(
        bundle, gate, version, goalEntryKey, gateGraph.byGate[gate.name],
      ));
      const result = JSON.parse((await runCli(LIFECYCLE, [
        'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
        '--plan', gatePath,
      ])).stdout);
      assert.equal(result.to_stage, gate.to_stage);
      version = result.cycle_version;
    }

    const observationPlan = {
      schema_version: 'm6-analytics-observation-plan/1.0.0',
      observation: bundle.analytics.observation,
      merchant_ref: bundle.create_cycle.merchant_ref,
      cycle_ref: bundle.create_cycle.cycle_id,
      goal_ref: bundle.create_cycle.goal_ref,
      run_ref: 'RUN-M6-ANALYTICS-E2E-001',
      adapter: {
        kind: 'fixture', name: 'm6-fixture', version: '1.0.0', access_mode: 'fixture',
        authorization_ref: 'fixture://authorization/m6-e2e-analytics',
      },
      input_path: bundle.analytics.observation.input_path,
      raw_output_path: bundle.analytics.observation.raw_output_path,
      measurement_contract_path: 'execution/contracts/measurement-contract.json',
      signal_rule_path: 'execution/contracts/signal-rule.json',
      sensitive_data_policy_path: 'execution/contracts/sensitive-data-policy.json'
    };
    observationPlan.test_scope = {
      kind: 'synthetic', usage: 'test_only',
      merchant_ref: bundle.create_cycle.merchant_ref,
      workspace_id: bundle.prepare.workspace_id,
    };
    const observationPath = await writePlan(root, 'analytics-observation', observationPlan);
    await runCli(ANALYTICS, [
      'ingest-fixture', '--workspace', root, '--plan', observationPath,
    ]);
    const signalPlan = {
      schema_version: 'm6-business-signal-plan/1.0.0',
      signal: bundle.analytics.signal,
      merchant_ref: bundle.create_cycle.merchant_ref,
      cycle_ref: bundle.create_cycle.cycle_id,
      goal_ref: bundle.create_cycle.goal_ref,
      run_ref: 'RUN-M6-ANALYTICS-E2E-001',
      observation_versions: [{ ref: bundle.analytics.observation.id, version: '1.0.0' }],
      measurement_contract_path: 'execution/contracts/measurement-contract.json',
      rule_path: 'execution/contracts/signal-rule.json',
      test_scope: observationPlan.test_scope,
    };
    const signalPath = await writePlan(root, 'analytics-signal', signalPlan);
    await runCli(ANALYTICS, [
      'compute-signals', '--workspace', root, '--plan', signalPath,
    ]);

    const analyticsGate = bundle.gates[6];
    const analyticsGatePath = await writePlan(root, 'advance-analytics', advancePlan(
      bundle,
      analyticsGate,
      version,
      goalEntryKey,
      await descriptorsFromSpecs(root, analyticsGate.object_specs),
    ));
    version = JSON.parse((await runCli(LIFECYCLE, [
      'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
      '--plan', analyticsGatePath,
    ])).stdout).cycle_version;

    const reviewPlan = {
      schema_version: 'm6-cycle-review-plan/1.0.0',
      merchant_ref: bundle.create_cycle.merchant_ref,
      cycle_ref: bundle.create_cycle.cycle_id,
      reviewed_cycle_input_version: version,
      review_snapshot: { id: bundle.review.snapshot_id },
      waiting_review: { id: bundle.review.waiting_id, path: bundle.review.waiting_path },
      goal_results: [{
        goal_entry_key: goalEntryKey,
        perception_goal: 'inconclusive',
        observations: ['Synthetic Cycle 1 observation.'],
        business_signal_entry_keys: ['a'.repeat(64)],
        limitations: ['No real Publication or Analytics.'],
        forbidden_conclusions: ['No causal or real MyyShop conclusion.'],
      }],
      next_cycle_candidate_inputs: [],
      test_scope: observationPlan.test_scope,
    };
    const reviewPath = await writePlan(root, 'assemble-review', reviewPlan);
    await runCli(LIFECYCLE, [
      'assemble-review', '--workspace', root, '--plan', reviewPath,
    ]);

    const waitingGate = bundle.gates[7];
    const waitingGatePath = await writePlan(root, 'advance-review-waiting', advancePlan(
      bundle,
      waitingGate,
      version,
      goalEntryKey,
      await descriptorsFromSpecs(root, waitingGate.object_specs),
    ));
    version = JSON.parse((await runCli(LIFECYCLE, [
      'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
      '--plan', waitingGatePath,
    ])).stdout).cycle_version;

    const decision = {
      waiting_review_ref: bundle.review.waiting_id,
      decided_review: { id: bundle.review.decided_id, path: bundle.review.decided_path },
      approval: { ...M6_APPROVAL, decision_ref: bundle.review.decision_ref },
      goal_results: reviewPlan.goal_results,
      test_scope: observationPlan.test_scope,
    };
    const decisionPath = await writePlan(root, 'review-decision', decision);
    const moduleUrl = new URL('../plugins/geo-expert/scripts/lib/cycle-trace.mjs', import.meta.url).href;
    const freshScript = [
      `import {readFile} from 'node:fs/promises'; import {decideCycleReview} from ${JSON.stringify(moduleUrl)};`,
      'const decision=JSON.parse(await readFile(process.argv[2],"utf8"));',
      'const result=await decideCycleReview({workspace:process.argv[1],decision});',
      'console.log(JSON.stringify({...result,conversation_history_used:false}));',
    ].join('\n');
    const fresh = await exec(process.execPath, [
      '--input-type=module', '-e', freshScript, root, decisionPath,
    ], { cwd: os.tmpdir() });
    assert.equal(JSON.parse(fresh.stdout).conversation_history_used, false);

    const decidedGate = bundle.gates[8];
    const decidedGatePath = await writePlan(root, 'advance-review-decided', advancePlan(
      bundle,
      decidedGate,
      version,
      goalEntryKey,
      await descriptorsFromSpecs(root, decidedGate.object_specs),
    ));
    await runCli(LIFECYCLE, [
      'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
      '--plan', decidedGatePath,
    ]);
    const trace = JSON.parse((await runCli(LIFECYCLE, [
      'trace', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
    ])).stdout);
    for (const [key, value] of Object.entries(bundle.expected)) assert.equal(trace[key], value, key);
    assert.deepEqual(trace.errors, []);
    assert.deepEqual(await trackedMyyShopSnapshot(), beforeMyyShop);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('每个缺门均由 advance fail loud，不能以其他 gate 或直接改 Cycle 跳过', async () => {
  await ensureEntrypoints();
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  for (const gate of bundle.gates) {
    const root = await createM6FixtureWorkspace();
    try {
      await seedM6FreezeInputs(root);
      const materialized = await materializeM6E2EGates(root, bundle);
      const created = await createCliCycle(root, bundle);
      const index = bundle.gates.indexOf(gate);
      let current;
      let descriptors;
      if (index < 6) {
        current = await advanceCliUntil(root, bundle, materialized.byGate, index, created);
        descriptors = materialized.byGate[gate.name];
      } else {
        current = await advanceCliUntil(root, bundle, materialized.byGate, 6, created);
        const outputs = await materializeM6OutputGateFixtures(root, bundle, { includeReview: false });
        if (index === 6) {
          descriptors = outputs.byGate.analytics;
        } else {
          current = await advanceCliGate(
            root, bundle, bundle.gates[6], current, outputs.byGate.analytics, 'setup-analytics',
          );
          const waiting = await assembleCliReview(root, bundle, current);
          if (index === 7) {
            descriptors = waiting.descriptors;
          } else {
            current = await advanceCliGate(
              root, bundle, bundle.gates[7], current, waiting.descriptors, 'setup-review-waiting',
            );
            await decideCycleReview({
              workspace: root,
              decision: {
                waiting_review_ref: bundle.review.waiting_id,
                decided_review: { id: bundle.review.decided_id, path: bundle.review.decided_path },
                approval: { ...M6_APPROVAL, decision_ref: bundle.review.decision_ref },
                goal_results: waiting.plan.goal_results,
                test_scope: waiting.plan.test_scope,
              },
            });
            descriptors = await descriptorsFromSpecs(root, gate.object_specs);
          }
        }
      }
      const target = descriptors[0];
      await unlink(path.join(root, ...target.path.split('/'))).catch(() => {});
      const invalid = advancePlan(
        bundle, gate, current.version, current.goalEntryKey, descriptors,
      );
      const planPath = await writePlan(root, `missing-${gate.name}`, invalid);
      await assert.rejects(runCli(LIFECYCLE, [
        'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
        '--plan', planPath,
      ]), (error) => {
        assert.equal(JSON.parse(error.stderr).error, 'CYCLE_GATE_REQUIRED');
        return true;
      });
    } finally {
      await rm(root, { recursive: true });
    }
  }
});

test('all-rejected 只能显式 cancel/no_adoption，不能伪造 Publication/Retest', async () => {
  await ensureEntrypoints();
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const rejectedGates = await materializeM6E2EGates(root, bundle, { allRejected: true });
    const created = await createCliCycle(root, bundle);
    const current = await advanceCliUntil(root, bundle, rejectedGates.byGate, 3, created);
    const cancelPlan = advancePlan(bundle, {
      name: 'cancel-no-adoption',
      transition_id: 'CTR-M6-E2E-CANCEL-001',
      gate_snapshot_id: 'CIS-M6-E2E-CANCEL-001',
      from_stage: 'adoption_decided',
      to_stage: 'cancelled_no_adoption',
      object_specs: bundle.gates.find((gate) => gate.name === 'adoption').object_specs,
    }, current.version, current.goalEntryKey);
    cancelPlan.gate_objects = rejectedGates.byGate.adoption;
    cancelPlan.actor = {
      kind: 'fixture_human',
      decision_ref: 'fixture://approval/m6-cancel-no-adoption',
    };
    const planPath = await writePlan(root, 'cancel-no-adoption', cancelPlan);
    const result = JSON.parse((await runCli(LIFECYCLE, [
      'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
      '--plan', planPath,
    ])).stdout);
    assert.equal(result.to_stage, 'cancelled_no_adoption');
    assert.equal(result.status, 'cancelled');
    assert.equal(result.completion_scope, 'none');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('CLI 恢复同 operation 幂等；污染 plan 与真实输出根在任何正式写入前失败', async () => {
  await ensureEntrypoints();
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const gates = await materializeM6E2EGates(root, bundle);
    const created = await createCliCycle(root, bundle);
    const gate = bundle.gates[0];
    const fault = advancePlan(
      bundle, gate, created.version, created.goalEntryKey, gates.byGate.baseline,
    );
    fault.fault_after = 'transition_intent_written';
    const faultPath = await writePlan(root, 'fault', fault);
    await assert.rejects(runCli(LIFECYCLE, [
      'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
      '--plan', faultPath,
    ]), (error) => JSON.parse(error.stderr).error === 'FAULT_INJECTED');
    delete fault.fault_after;
    const resumePath = await writePlan(root, 'resume', fault);
    const resumed = JSON.parse((await runCli(LIFECYCLE, [
      'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
      '--plan', resumePath,
    ])).stdout);
    assert.equal(resumed.action, 'applied_existing_intent');

    const contaminated = { ...fault, output_root: 'workspaces/myyshop' };
    const contaminatedPath = await writePlan(root, 'contaminated', contaminated);
    await assert.rejects(runCli(LIFECYCLE, [
      'advance', '--workspace', root, '--cycle', bundle.create_cycle.cycle_id,
      '--plan', contaminatedPath,
    ]), (error) => JSON.parse(error.stderr).error === 'SYNTHETIC_REAL_REF_CONTAMINATION');
  } finally {
    await rm(root, { recursive: true });
  }
});
