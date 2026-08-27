import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { decideCycleReview } from '../../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import { execute as executeLifecycle } from '../../plugins/geo-expert/scripts/geo-lifecycle.mjs';
import { sha256, stableStringify } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { materializeM6E2EGates } from './m6-e2e-fixtures.mjs';
import { materializeM6OutputGateFixtures } from './m6-e2e-output-fixtures.mjs';
import {
  M6_APPROVAL,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  readM6FixtureJson,
  seedM6FreezeInputs,
} from './m6-fixtures.mjs';

async function writePlan(root, name, value) {
  const dir = path.join(root, 'fixtures/plans');
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${name}.json`);
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
  return file;
}

async function cycleData(root, relative = 'cycles/m6/cycle.md') {
  return matter(await readFile(path.join(root, relative), 'utf8')).data;
}

function advancePlan(bundle, gate, cycle, descriptors) {
  return {
    schema_version: 'm6-cycle-transition-plan/1.0.0',
    operation_id: `business-trace-${gate.name}`,
    operation_fingerprint: sha256(stableStringify({ gate: gate.name, version: cycle.version })),
    transition_id: gate.transition_id,
    gate_snapshot_id: gate.gate_snapshot_id,
    cycle_ref: cycle.id,
    goal_entry_key: cycle.goal_tracks[0].goal_entry_key,
    expected_cycle_version: cycle.version,
    from_stage: gate.from_stage,
    to_stage: gate.to_stage,
    gate_objects: descriptors,
    actor: gate.name === 'review_decided'
      ? { kind: 'fixture_human', decision_ref: bundle.review.decision_ref }
      : { kind: 'deterministic_tool' },
    lease: {
      owner_id: `business-trace-${gate.name}`,
      now: '2026-08-27T00:00:00Z',
      ttl_ms: 60_000,
    },
  };
}

async function advance(root, bundle, gate, cycle, descriptors) {
  await executeLifecycle({
    command: 'advance',
    workspace: root,
    cycle: cycle.id,
    plan: await writePlan(root, `advance-${gate.name}`, advancePlan(bundle, gate, cycle, descriptors)),
  });
  return cycleData(root);
}

export async function createM6CompletedBusinessTraceWorkspace() {
  const root = await createM6FixtureWorkspace();
  await seedM6FreezeInputs(root);
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  const gates = await materializeM6E2EGates(root, bundle);
  await executeLifecycle({
    command: 'create-cycle',
    workspace: root,
    plan: await writePlan(root, 'create-cycle', bundle.create_cycle),
  });
  let cycle = await cycleData(root);
  for (const gate of bundle.gates.slice(0, 6)) {
    cycle = await advance(root, bundle, gate, cycle, gates.byGate[gate.name]);
  }
  const outputs = await materializeM6OutputGateFixtures(root, bundle, { includeReview: false });
  cycle = await advance(root, bundle, bundle.gates[6], cycle, outputs.byGate.analytics);

  const reviewPlan = {
    schema_version: 'm6-cycle-review-plan/1.0.0',
    merchant_ref: bundle.create_cycle.merchant_ref,
    cycle_ref: cycle.id,
    reviewed_cycle_input_version: cycle.version,
    review_snapshot: { id: bundle.review.snapshot_id },
    waiting_review: { id: bundle.review.waiting_id, path: bundle.review.waiting_path },
    goal_results: [{
      goal_entry_key: cycle.goal_tracks[0].goal_entry_key,
      perception_goal: 'inconclusive',
      observations: ['Synthetic completed business trace fixture.'],
      business_signal_entry_keys: ['a'.repeat(64)],
      limitations: ['Synthetic fixture only.'],
      forbidden_conclusions: ['No causal or real MyyShop conclusion.'],
    }],
    next_cycle_candidate_inputs: [],
    test_scope: { ...M6_TEST_SCOPE },
  };
  await executeLifecycle({
    command: 'assemble-review',
    workspace: root,
    plan: await writePlan(root, 'assemble-review', reviewPlan),
  });
  const waitingDescriptor = bundle.gates[7].object_specs[0];
  waitingDescriptor.sha256 = sha256(await readFile(path.join(root, waitingDescriptor.path)));
  cycle = await advance(root, bundle, bundle.gates[7], cycle, [waitingDescriptor]);
  await decideCycleReview({
    workspace: root,
    decision: {
      waiting_review_ref: bundle.review.waiting_id,
      decided_review: { id: bundle.review.decided_id, path: bundle.review.decided_path },
      approval: { ...M6_APPROVAL, decision_ref: bundle.review.decision_ref },
      goal_results: reviewPlan.goal_results,
      test_scope: { ...M6_TEST_SCOPE },
    },
  });
  const decidedDescriptor = bundle.gates[8].object_specs[0];
  decidedDescriptor.sha256 = sha256(await readFile(path.join(root, decidedDescriptor.path)));
  cycle = await advance(root, bundle, bundle.gates[8], cycle, [decidedDescriptor]);
  return { root, cycle };
}
