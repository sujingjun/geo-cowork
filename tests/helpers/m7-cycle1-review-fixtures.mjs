import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { execute as executeLifecycle } from '../../plugins/geo-expert/scripts/geo-lifecycle.mjs';
import { buildCycleSnapshotPlan } from '../../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import { assembleCycleReview, decideCycleReview } from '../../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import { sha256, stableStringify, walkMarkdownFiles } from '../../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { materializeM6E2EGates } from './m6-e2e-fixtures.mjs';
import { materializeM6OutputGateFixtures } from './m6-e2e-output-fixtures.mjs';
import {
  M6_APPROVAL,
  M6_NOW,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  readM6FixtureJson,
  seedM6FreezeInputs,
  writeM6Object,
} from './m6-fixtures.mjs';

async function writePlan(root, name, value) {
  const target = path.join(root, 'fixtures/plans', `${name}.json`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
  return target;
}

async function readCycle(root) {
  return matter(await readFile(path.join(root, 'cycles/m6/cycle.md'), 'utf8')).data;
}

async function descriptor(root, relative) {
  const data = matter(await readFile(path.join(root, ...relative.split('/')), 'utf8')).data;
  return {
    id: data.id, record_type: data.record_type, status: data.status,
    version: data.version, path: relative,
    sha256: sha256(await readFile(path.join(root, ...relative.split('/')))),
  };
}

function advancePlan(bundle, gate, cycle, descriptors) {
  return {
    schema_version: 'm6-cycle-transition-plan/1.0.0',
    operation_id: `m7-cycle-one-${gate.name}`,
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
    lease: { owner_id: `m7-cycle-one-${gate.name}`, now: M6_NOW, ttl_ms: 60_000 },
  };
}

async function advance(root, bundle, gate, cycle, descriptors) {
  await executeLifecycle({
    command: 'advance', workspace: root, cycle: cycle.id,
    plan: await writePlan(root, `advance-${gate.name}`, advancePlan(bundle, gate, cycle, descriptors)),
  });
  return readCycle(root);
}

async function materializeProductGap(root) {
  const userBytes = 'Synthetic users repeatedly request transparent pricing.\n';
  const capabilityBytes = 'Synthetic first-party scope documents only a limited pricing range.\n';
  await mkdir(path.join(root, 'evidence/snapshots'), { recursive: true });
  await writeFile(path.join(root, 'evidence/snapshots/m7-user-interest.txt'), userBytes);
  await writeFile(path.join(root, 'evidence/snapshots/m7-capability-gap.txt'), capabilityBytes);
  const source = {
    id: 'SRC-M7-USER-001', record_type: 'source', status: 'active', version: '1.0.0',
    created_at: M6_NOW, updated_at: M6_NOW, title: 'Synthetic user source',
    test_scope: { ...M6_TEST_SCOPE }, name: 'Synthetic user research',
    source_kind: 'development_fixture', locator: 'https://m6-test-merchant.invalid/research/users',
  };
  await writeM6Object(root, 'evidence/sources/src-m7-user-001.md', source);
  const research = (id, title, bytes, file, supportKind, locator) => ({
    id, record_type: 'evidence', status: 'approved', version: '1.0.0',
    created_at: M6_NOW, updated_at: M6_NOW, title, test_scope: { ...M6_TEST_SCOPE },
    source_refs: [supportKind === 'user' ? source.id : 'SRC-M6-TEST-001'],
    claim_refs: ['CLM-M6-TEST-001'], locator, captured_at: M6_NOW,
    snapshot: { path: `evidence/snapshots/${file}`, sha256: sha256(bytes), media_type: 'text/plain' },
    collector: { name: 'm7-cycle-one-fixture', version: '1.0.0' },
    scope: 'Synthetic pricing clarity.', approval: { ...M6_APPROVAL },
    access_state: 'accessible', original_content_state: 'captured', support_kind: supportKind,
    independent_support_refs: [], counter_evidence_refs: [], confidence: 'high',
    confidence_reason: 'Synthetic approved fixture.', proof_scope: 'original_content',
  });
  const demand = research(
    'EVD-M7-USER-DEMAND-001', 'Synthetic user demand', userBytes,
    'm7-user-interest.txt', 'user', 'https://m6-test-merchant.invalid/research/users#pricing',
  );
  const capability = research(
    'EVD-M7-CAPABILITY-GAP-001', 'Synthetic capability gap', capabilityBytes,
    'm7-capability-gap.txt', 'first_party', 'https://m6-test-merchant.invalid/about',
  );
  await writeM6Object(root, 'evidence/records/evd-m7-user-demand-001.md', demand);
  await writeM6Object(root, 'evidence/records/evd-m7-capability-gap-001.md', capability);
  const productGap = {
    id: 'FND-M7-PRODUCT-GAP-001', record_type: 'finding', status: 'open', version: '1.0.0',
    created_at: M6_NOW, updated_at: M6_NOW, title: 'Synthetic pricing Product Gap',
    test_scope: { ...M6_TEST_SCOPE }, finding_code: 'PRICING_CLARITY_GAP',
    finding_kind: 'semantic', item_state: 'inferred', rule_version: 'm7-product-gap-v1',
    diagnosis_class: 'product_gap', query_refs: ['Q-M6-TEST-001'],
    claim_refs: ['CLM-M6-TEST-001'], evidence_refs: [demand.id, capability.id],
    asset_refs: ['AST-M6-TEST-001'], source_refs: [source.id, 'SRC-M6-TEST-001'],
    approval: { ...M6_APPROVAL, decision_ref: 'fixture://approval/m7-product-gap-001' },
    gap_basis: {
      supporting_evidence_refs: [demand.id, capability.id], counter_evidence_refs: [],
      unresolved_conflicts: [], rationale: 'Synthetic demand and capability-gap Evidence.',
    },
  };
  const paths = [
    'evidence/sources/src-m7-user-001.md',
    'evidence/records/evd-m7-user-demand-001.md',
    'evidence/records/evd-m7-capability-gap-001.md',
    'cycles/m6/findings/fnd-m7-product-gap-001.md',
  ];
  await writeM6Object(root, paths[3], productGap);
  return {
    productGap,
    descriptors: await Promise.all(paths.map((item) => descriptor(root, item))),
  };
}

async function objectsById(root) {
  const result = new Map();
  for (const file of await walkMarkdownFiles(root, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    result.set(parsed.data.id, {
      data: parsed.data,
      path: path.relative(root, file).split(path.sep).join('/'),
    });
  }
  return result;
}

async function reviewSnapshotPreview(root, cycle, bundle) {
  const objects = await objectsById(root);
  const freeze = objects.get(cycle.core_versions.input_snapshot.ref).data;
  const sourcePaths = new Set(freeze.source_entries.map((item) => item.object_path));
  const artifacts = new Map(freeze.artifact_entries.map((item) => [item.source_path, {
    role: item.role, path: item.source_path, media_type: item.media_type,
  }]));
  const transitionVersions = [];
  const entryKeys = [];
  for (const ref of cycle.transition_refs) {
    const transition = objects.get(ref).data;
    if (['review_waiting_human', 'review_decided'].includes(transition.to_stage)) break;
    const gate = objects.get(transition.gate_snapshot_version.ref).data;
    transitionVersions.push({ ref: gate.id, version: gate.version });
    for (const item of gate.source_entries) { sourcePaths.add(item.object_path); entryKeys.push(item.entry_key); }
    for (const item of gate.artifact_entries) {
      artifacts.set(item.source_path, { role: item.role, path: item.source_path, media_type: item.media_type });
      entryKeys.push(item.entry_key);
    }
  }
  return buildCycleSnapshotPlan({
    workspace: root, id: 'CIS-M7-CYCLE-ONE-REVIEW-001', snapshotKind: 'review',
    merchantRef: bundle.create_cycle.merchant_ref, cycleRef: cycle.id, runRef: freeze.run_ref,
    sourcePaths: [...sourcePaths].sort(), artifactPaths: [...artifacts.values()].sort((a, b) => a.path.localeCompare(b.path)),
    baseFreezeSnapshotVersion: { ref: freeze.id, version: freeze.version },
    preReviewTransitionSnapshotVersions: transitionVersions,
    preReviewEntryKeys: [...new Set(entryKeys)].sort(),
  });
}

function tuple(entry) {
  return {
    entry_key: entry.entry_key, object_id: entry.object_id, record_type: entry.record_type,
    object_version: entry.object_version, file_sha256: entry.file_sha256,
  };
}

export async function createM7CandidateReadyCycleOneWorkspace() {
  const root = await createM6FixtureWorkspace();
  await seedM6FreezeInputs(root);
  const bundle = await readM6FixtureJson('plans/cycle-1-e2e.json');
  const gates = await materializeM6E2EGates(root, bundle);
  const product = await materializeProductGap(root);
  gates.byGate.diagnosis.push(...product.descriptors);
  await executeLifecycle({ command: 'create-cycle', workspace: root, plan: await writePlan(root, 'create-cycle', bundle.create_cycle) });
  let cycle = await readCycle(root);
  for (const gate of bundle.gates.slice(0, 6)) cycle = await advance(root, bundle, gate, cycle, gates.byGate[gate.name]);
  const outputs = await materializeM6OutputGateFixtures(root, bundle, { includeReview: false });
  cycle = await advance(root, bundle, bundle.gates[6], cycle, outputs.byGate.analytics);
  const preview = await reviewSnapshotPreview(root, cycle, bundle);
  const goal = preview.source_entries.find((item) => item.object_id === 'GOAL-M6-TEST-001');
  const finding = preview.source_entries.find((item) => item.object_id === product.productGap.id);
  const evidence = preview.source_entries.filter((item) =>
    ['EVD-M7-USER-DEMAND-001', 'EVD-M7-CAPABILITY-GAP-001'].includes(item.object_id));
  const candidate = {
    candidate_kind: 'product_gap', source_goal_entry: tuple(goal),
    source_entries: [tuple(finding), ...evidence.map(tuple)], rank_inputs: { priority: 0 },
    goal_statement: 'Improve synthetic pricing clarity.',
    success_question: 'Can the synthetic price range be represented accurately?',
    query_cluster_key: 'm7-synthetic-pricing', evidence_gaps: [],
    risks: ['Synthetic fixture only; no real product decision.'],
  };
  const reviewPlan = {
    schema_version: 'm6-cycle-review-plan/1.0.0', merchant_ref: bundle.create_cycle.merchant_ref,
    cycle_ref: cycle.id, run_ref: preview.run_ref, reviewed_cycle_input_version: cycle.version,
    review_snapshot: {
      id: preview.snapshot.id,
      base_freeze_snapshot_version: preview.base_freeze_snapshot_version,
      pre_review_transition_snapshot_versions: preview.pre_review_transition_snapshot_versions,
      pre_review_entry_keys: preview.pre_review_entry_keys,
      source_paths: preview.source_entries.map((item) => item.object_path),
      artifact_paths: preview.artifact_entries.map((item) => ({ role: item.role, path: item.source_path, media_type: item.media_type })),
    },
    waiting_review: { id: 'CRV-M7-CYCLE-ONE-WAITING-001', path: 'cycles/m7/reviews/crv-m7-cycle-one-waiting-001.md' },
    goal_results: [{ goal_entry_key: goal.entry_key, perception_goal: 'inconclusive', observations: ['Synthetic Cycle 1 Product Gap observation.'], business_signal_entry_keys: ['a'.repeat(64)], limitations: ['Synthetic fixture only.'], forbidden_conclusions: ['No real product conclusion.'] }],
    next_cycle_candidate_inputs: [candidate], test_scope: { ...M6_TEST_SCOPE },
  };
  const waiting = await assembleCycleReview({ workspace: root, plan: reviewPlan });
  cycle = await advance(root, bundle, bundle.gates[7], cycle, [await descriptor(root, reviewPlan.waiting_review.path)]);
  const decision = {
    waiting_review_ref: reviewPlan.waiting_review.id,
    decided_review: { id: 'CRV-M7-CYCLE-ONE-DECIDED-001', path: 'cycles/m7/reviews/crv-m7-cycle-one-decided-001.md' },
    approval: { ...M6_APPROVAL, decision_ref: 'fixture://approval/m7-cycle-one-review-001' },
    goal_results: reviewPlan.goal_results, test_scope: { ...M6_TEST_SCOPE },
  };
  const decided = await decideCycleReview({ workspace: root, decision });
  cycle = await advance(root, bundle, bundle.gates[8], cycle, [await descriptor(root, decision.decided_review.path)]);
  return { root, cycle, reviewSnapshot: waiting.review_snapshot, waiting: waiting.data, decided: decided.data, candidate };
}
