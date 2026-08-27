import { createHash } from 'node:crypto';
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import {
  computeBusinessSignal,
  ingestFixtureObservation,
} from '../../plugins/geo-expert/scripts/lib/analytics-cycle.mjs';
import {
  advanceCycle,
} from '../../plugins/geo-expert/scripts/lib/cycle-lifecycle.mjs';
import {
  buildCycleSnapshotPlan,
} from '../../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import {
  loadWorkspaceGraph,
} from '../../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  M6_CYCLE_ID,
  M6_MERCHANT_ID,
  M6_TEST_SCOPE,
  readM6FixtureJson,
  writeM6Object,
} from './m6-fixtures.mjs';
import {
  createM6FrozenCycleWorkspace,
} from './m6-cycle-fixtures.mjs';
import {
  materializeM6E2EGates,
} from './m6-e2e-fixtures.mjs';

function compareUtf8(left, right) {
  return Buffer.compare(Buffer.from(left), Buffer.from(right));
}

export async function capture(action) {
  try {
    return { ok: true, value: await action() };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function pathExists(root, relative) {
  try {
    await lstat(path.join(root, ...relative.split('/')));
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function readJsonAt(root, relative) {
  return JSON.parse(await readFile(path.join(root, ...relative.split('/')), 'utf8'));
}

export async function writeJsonAt(root, relative, value) {
  const target = path.join(root, ...relative.split('/'));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
  return target;
}

export async function treeDigest(root) {
  const rows = [];
  async function visit(relative = '') {
    const absolute = relative ? path.join(root, ...relative.split('/')) : root;
    const entries = await readdir(absolute, { withFileTypes: true });
    entries.sort((a, b) => compareUtf8(a.name, b.name));
    for (const entry of entries) {
      const child = relative ? `${relative}/${entry.name}` : entry.name;
      const target = path.join(root, ...child.split('/'));
      const stat = await lstat(target);
      if (stat.isSymbolicLink()) {
        rows.push([child, 'SYMLINK']);
      } else if (stat.isDirectory()) {
        await visit(child);
      } else if (stat.isFile()) {
        rows.push([
          child,
          createHash('sha256').update(await readFile(target)).digest('hex'),
        ]);
      }
    }
  }
  await visit();
  return createHash('sha256').update(JSON.stringify(rows)).digest('hex');
}

export function analyticsInput({
  metrics = [
    {
      metric_id: 'ai_visits',
      value: 20,
      unit: 'visits',
      dimensions: { source_group: 'synthetic_ai' },
    },
    {
      metric_id: 'ai_registrations',
      value: 2,
      unit: 'registrations',
      dimensions: { source_group: 'synthetic_ai' },
    },
  ],
  timeWindow = {
    starts_at: '2026-08-01T00:00:00Z',
    ends_at: '2026-08-08T00:00:00Z',
    as_of: '2026-08-09T00:00:00Z',
  },
} = {}) {
  return {
    schema_version: 'm6-fixture-analytics/1.0.0',
    time_window: timeWindow,
    metrics,
  };
}

export function observationPlan({
  id = 'ANO-M6-ADVERSARIAL-001',
  inputPath = 'fixtures/analytics/complete.json',
  rawOutputPath = `raw/analytics/${id.toLowerCase()}.json`,
  policyPath = 'execution/contracts/sensitive-data-policy.json',
  measurementPath = 'execution/contracts/measurement-contract.json',
  goalRef = 'GOAL-M6-TEST-001',
  cycleRef = M6_CYCLE_ID,
  runRef = 'RUN-M6-ANALYTICS-ADVERSARIAL-001',
} = {}) {
  return {
    schema_version: 'm6-analytics-observation-plan/1.0.0',
    observation: {
      id,
      path: `cycles/m6/analytics/${id.toLowerCase()}.md`,
    },
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: cycleRef,
    goal_ref: goalRef,
    run_ref: runRef,
    adapter: {
      kind: 'fixture',
      name: 'm6-adversarial-fixture',
      version: '1.0.0',
      access_mode: 'fixture',
      authorization_ref: 'fixture://authorization/m6-adversarial',
    },
    input_path: inputPath,
    raw_output_path: rawOutputPath,
    measurement_contract_path: measurementPath,
    sensitive_data_policy_path: policyPath,
    test_scope: { ...M6_TEST_SCOPE },
  };
}

export function signalPlan({
  id = 'BSIG-M6-ADVERSARIAL-001',
  observationVersions = [{ ref: 'ANO-M6-ADVERSARIAL-001', version: '1.0.0' }],
  measurementPath = 'execution/contracts/measurement-contract.json',
  rulePath = 'execution/contracts/signal-rule.json',
  goalRef = 'GOAL-M6-TEST-001',
  cycleRef = M6_CYCLE_ID,
  runRef = 'RUN-M6-ANALYTICS-ADVERSARIAL-001',
} = {}) {
  return {
    schema_version: 'm6-business-signal-plan/1.0.0',
    signal: {
      id,
      path: `cycles/m6/signals/${id.toLowerCase()}.md`,
    },
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: cycleRef,
    goal_ref: goalRef,
    run_ref: runRef,
    observation_versions: observationVersions,
    measurement_contract_path: measurementPath,
    rule_path: rulePath,
    test_scope: { ...M6_TEST_SCOPE },
  };
}

export function transitionPlan(cycle, overrides = {}) {
  const id = overrides.transition_id ?? 'CTR-M6-ADVERSARIAL-001';
  return {
    schema_version: 'm6-cycle-transition-plan/1.0.0',
    operation_id: 'op-m6-adversarial-001',
    operation_fingerprint: 'a'.repeat(64),
    transition_id: id,
    gate_snapshot_id: 'CIS-M6-ADVERSARIAL-GATE-001',
    cycle_ref: M6_CYCLE_ID,
    goal_entry_key: cycle.goal_tracks[0].goal_entry_key,
    expected_cycle_version: cycle.version,
    from_stage: cycle.goal_tracks[0].stage,
    to_stage: 'baseline_recorded',
    actor: { kind: 'deterministic_tool' },
    lease: {
      owner_id: 'm6-adversarial-owner-a',
      now: '2026-08-27T00:00:00Z',
      ttl_ms: 60_000,
    },
    gate: {
      source_paths: ['cycles/preparation/goal.md'],
      artifact_paths: ['execution/contracts/measurement-contract.json'],
    },
    ...overrides,
  };
}

function gateFromDescriptors(descriptors, artifactPaths = [
  'execution/contracts/measurement-contract.json',
]) {
  return {
    source_paths: descriptors.map((descriptor) => descriptor.path),
    artifact_paths: artifactPaths,
  };
}

async function readCycleData(root) {
  const graph = await loadWorkspaceGraph({ workspace: root });
  return graph.byId.get(M6_CYCLE_ID)?.data ?? null;
}

export async function materializeM6BaselineGate(root) {
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  const gates = await materializeM6E2EGates(root, bundle);
  const descriptors = gates.byGate.baseline;
  return {
    bundle,
    gates,
    descriptors,
    gate: gateFromDescriptors(descriptors),
  };
}

async function advanceE2EGate(root, cycle, gateSpec, descriptors) {
  await advanceCycle({
    workspace: root,
    plan: transitionPlan(cycle, {
      operation_id: `m6-adversarial-setup-${gateSpec.name}`,
      operation_fingerprint: `setup-${gateSpec.name}`,
      transition_id: gateSpec.transition_id,
      gate_snapshot_id: gateSpec.gate_snapshot_id,
      expected_cycle_version: cycle.version,
      from_stage: gateSpec.from_stage,
      to_stage: gateSpec.to_stage,
      gate: gateFromDescriptors(descriptors),
      lease: {
        owner_id: `m6-adversarial-setup-${gateSpec.name}`,
        now: '2026-08-27T00:00:00Z',
        ttl_ms: 60_000,
      },
    }),
  });
  return readCycleData(root);
}

function cutoffFromGraph(graph, cycle) {
  const transitions = [];
  const entryKeys = [];
  for (const ref of cycle.transition_refs) {
    const transition = graph.byId.get(ref)?.data;
    if (!transition || ['review_waiting_human', 'review_decided'].includes(transition.to_stage)) {
      continue;
    }
    const gate = graph.byId.get(transition.gate_snapshot_version.ref)?.data;
    transitions.push({ ref: gate.id, version: gate.version });
    entryKeys.push(
      ...gate.source_entries.map((entry) => entry.entry_key),
      ...gate.artifact_entries.map((entry) => entry.entry_key),
    );
  }
  return {
    base: { ...cycle.core_versions.input_snapshot },
    transitions,
    entryKeys: [...new Set(entryKeys)].sort(),
  };
}

export async function createM6ReviewReadyWorkspace({
  snapshotId = 'CIS-M6-ADVERSARIAL-REVIEW-DECIDE-001',
  waitingId = 'CRV-M6-ADVERSARIAL-WAITING-DECIDE-001',
} = {}) {
  const fixture = await createM6FrozenCycleWorkspace();
  const { root } = fixture;
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  const gates = await materializeM6E2EGates(root, bundle);
  let cycle = await readCycleData(root);
  for (const gateSpec of bundle.gates.slice(0, 6)) {
    cycle = await advanceE2EGate(root, cycle, gateSpec, gates.byGate[gateSpec.name]);
  }

  const observation = await ingestFixtureObservation({
    workspace: root,
    plan: observationPlan({
      id: bundle.analytics.observation.id,
      inputPath: bundle.analytics.observation.input_path,
      rawOutputPath: bundle.analytics.observation.raw_output_path,
      runRef: 'RUN-M6-ANALYTICS-E2E-001',
    }),
  });
  await computeBusinessSignal({
    workspace: root,
    plan: signalPlan({
      id: bundle.analytics.signal.id,
      observationVersions: [{ ref: observation.data.id, version: observation.data.version }],
      runRef: 'RUN-M6-ANALYTICS-E2E-001',
    }),
  });
  cycle = await advanceE2EGate(
    root,
    cycle,
    bundle.gates[6],
    bundle.gates[6].object_specs,
  );

  const graph = await loadWorkspaceGraph({ workspace: root });
  const cutoff = cutoffFromGraph(graph, cycle);
  const sourcePaths = [
    'cycles/preparation/test-merchant.md',
    'cycles/preparation/goal.md',
    bundle.analytics.observation.path,
    bundle.analytics.signal.path,
  ];
  const artifactPaths = [{
    role: 'measurement_contract',
    path: 'execution/contracts/measurement-contract.json',
    media_type: 'application/json',
  }];
  const preview = await buildCycleSnapshotPlan({
    workspace: root,
    id: snapshotId,
    snapshotKind: 'review',
    merchantRef: M6_MERCHANT_ID,
    cycleRef: M6_CYCLE_ID,
    runRef: 'RUN-M6-CIS-001',
    sourcePaths,
    artifactPaths,
    baseFreezeSnapshotVersion: cutoff.base,
    preReviewTransitionSnapshotVersions: cutoff.transitions,
    preReviewEntryKeys: cutoff.entryKeys,
  });
  const signalEntry = preview.source_entries.find((entry) =>
    entry.object_id === bundle.analytics.signal.id);
  return {
    ...fixture,
    bundle,
    cycle,
    cutoff,
    reviewPlan: {
      schema_version: 'm6-cycle-review-plan/1.0.0',
      merchant_ref: M6_MERCHANT_ID,
      cycle_ref: M6_CYCLE_ID,
      run_ref: 'RUN-M6-CIS-001',
      reviewed_cycle_input_version: cycle.version,
      review_snapshot: {
        id: snapshotId,
        base_freeze_snapshot_version: cutoff.base,
        pre_review_transition_snapshot_versions: cutoff.transitions,
        pre_review_entry_keys: cutoff.entryKeys,
        source_paths: sourcePaths,
        artifact_paths: artifactPaths,
      },
      waiting_review: {
        id: waitingId,
        path: `cycles/m6/reviews/${waitingId.toLowerCase()}.md`,
      },
      goal_results: [{
        goal_entry_key: cycle.goal_tracks[0].goal_entry_key,
        perception_goal: 'inconclusive',
        observations: ['Synthetic Cycle input through analytics_recorded.'],
        business_signal_entry_keys: [signalEntry.entry_key],
        limitations: ['Synthetic fixture only.'],
        forbidden_conclusions: ['No causal or real MyyShop conclusion.'],
      }],
      next_cycle_candidate_inputs: [],
      test_scope: { ...M6_TEST_SCOPE },
    },
  };
}

export async function waitForPath(root, relative, { timeoutMs = 5_000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await pathExists(root, relative)) return true;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  return false;
}
