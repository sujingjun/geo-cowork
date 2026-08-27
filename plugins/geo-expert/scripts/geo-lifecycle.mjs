#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  buildCycleSnapshotPlan,
  materializeCycleFreeze,
} from './lib/cycle-snapshot.mjs';
import {
  advanceCycle,
  resumeCycleTransition,
} from './lib/cycle-lifecycle.mjs';
import {
  assembleCycleReview,
  traceCycle,
} from './lib/cycle-trace.mjs';
import {
  assertTestWorkspaceWriteAllowed,
  validateTestMerchantWorkspace,
} from './lib/m6-test-merchant.mjs';
import {
  readMarkdownObject,
  serializeMarkdownObject,
  validateObjectData,
} from './lib/object-contract.mjs';
import { inputFingerprint } from './lib/run-store.mjs';
import {
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  stableStringify,
  walkMarkdownFiles,
  writeCreateOnly,
} from './lib/workspace-paths.mjs';
import { initWorkspace } from './workspace-init.mjs';
const COMMANDS = new Set([
  'prepare-test-merchant', 'create-cycle', 'advance',
  'assemble-review', 'trace', 'validate', 'propose-cycle-two', 'apply-goal-selection',
]);
function invalid(message) {
  const error = new Error(message);
  error.code = 'INVALID_ARGUMENT';
  return error;
}
function assertNetworkDisabled(command) {
  if (process.env.GEO_M6_NETWORK_DISABLED !== '1') {
    const error = new Error('M6 离线 CLI 要求 GEO_M6_NETWORK_DISABLED=1');
    error.code = 'NETWORK_GUARD_REQUIRED';
    throw error;
  }
  if (['propose-cycle-two', 'apply-goal-selection'].includes(command)
      && process.env.GEO_M7_NETWORK_DISABLED !== '1') {
    const error = new Error('M7 离线 CLI 要求 GEO_M7_NETWORK_DISABLED=1');
    error.code = 'NETWORK_GUARD_REQUIRED';
    throw error;
  }
}
function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw invalid('缺少或非法 command');
  const args = { command };
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!flag.startsWith('--')) throw invalid(`未知参数: ${flag}`);
    args[flag.slice(2)] = rest[++index] ?? null;
  }
  if (!args.workspace) throw invalid('缺少 --workspace');
  if (['prepare-test-merchant', 'create-cycle', 'advance', 'assemble-review',
    'propose-cycle-two', 'apply-goal-selection'].includes(command)
      && !args.plan) throw invalid('缺少 --plan');
  if (['advance', 'trace'].includes(command) && !args.cycle) throw invalid('缺少 --cycle');
  if (command === 'propose-cycle-two' && !args.review) throw invalid('缺少 --review');
  return args;
}

async function readPlan(file) {
  try {
    return JSON.parse(await readFile(path.resolve(file), 'utf8'));
  } catch {
    throw invalid('plan 无法读取或不是合法 JSON');
  }
}

async function fileExists(file) {
  try { await readFile(file); return true; } catch { return false; }
}

async function prepareTestMerchant(workspace, plan) {
  const root = path.resolve(workspace);
  const identityPath = path.join(root, 'workspace.json');
  if (await fileExists(identityPath)) await assertTestWorkspaceWriteAllowed({ workspace: root });
  const existingIdentity = await fileExists(identityPath)
    ? JSON.parse(await readFile(identityPath, 'utf8'))
    : null;
  const createdAt = existingIdentity?.created_at ?? plan.created_at ?? new Date().toISOString();
  const identity = {
    schema_version: '1.0.0',
    workspace_id: plan.workspace_id,
    brand: plan.brand,
    created_at: createdAt,
    created_by: 'geo-lifecycle/1.0.0',
    workspace_mode: 'test_only',
    test_namespace: plan.test_namespace,
    legal_entity: false,
    subject_locator: plan.subject_locator,
  };
  const merchant = {
    id: plan.merchant_id,
    record_type: 'test_merchant',
    status: 'frozen',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: `${plan.brand} test merchant`,
    test_scope: {
      kind: 'synthetic', usage: 'test_only',
      merchant_ref: plan.merchant_id, workspace_id: plan.workspace_id,
    },
    workspace_id: plan.workspace_id,
    workspace_namespace: plan.test_namespace,
    display_name: plan.brand,
    identity: {
      legal_entity_kind: 'fictitious',
      canonical_locator: plan.subject_locator,
      real_brand_identity_claimed: false,
    },
    provenance: {
      kind: 'synthetic', usage: 'test_only', decision_ref: plan.decision_ref,
    },
    real_workspace_forbidden: ['workspaces/myyshop'],
    approval: {
      approved_by: 'Fixture Human Reviewer',
      approved_at: createdAt,
      decision_ref: plan.decision_ref,
    },
  };
  validateObjectData(merchant, { path: '<prepare-test-merchant-plan>' });
  const identityResult = await writeCreateOnly(
    root,
    'workspace.json',
    stableStringify(identity, 2),
    { idempotent: true, conflictCode: 'IDENTITY_CONFLICT' },
  );
  await initWorkspace({
    workspace: root,
    brand: plan.brand,
    testOnly: true,
    testNamespace: plan.test_namespace,
    subjectLocator: plan.subject_locator,
  });
  const merchantResult = await writeCreateOnly(
    root,
    plan.merchant_path,
    serializeMarkdownObject(merchant, '# Synthetic Test Merchant\n'),
    { idempotent: true, conflictCode: 'OBJECT_CONFLICT' },
  );
  const validation = await validateTestMerchantWorkspace({ workspace: root });
  if (validation.errors.length > 0) {
    const error = new Error('Test Merchant 初始化后校验失败');
    error.code = validation.errors[0].code;
    error.diagnostics = validation.errors;
    throw error;
  }
  return {
    action: identityResult.action === 'kept' && merchantResult.action === 'kept'
      ? 'kept' : 'created',
    workspace: root,
    workspace_id: plan.workspace_id,
    merchant_id: plan.merchant_id,
    network_accessed: false,
  };
}

function byType(entries, type) {
  return entries.filter((entry) => entry.record_type === type);
}

async function createCycle(workspace, plan) {
  const root = path.resolve(workspace);
  const validation = await validateTestMerchantWorkspace({ workspace: root });
  if (validation.errors.length > 0) {
    const error = new Error('Test Merchant 未就绪');
    error.code = validation.errors[0].code;
    throw error;
  }
  const snapshot = await buildCycleSnapshotPlan({
    workspace: root,
    id: plan.snapshot_id,
    snapshotKind: 'freeze',
    merchantRef: plan.merchant_ref,
    cycleRef: plan.cycle_id,
    runRef: plan.run_id,
    sourcePaths: plan.source_paths,
    artifactPaths: plan.artifact_paths,
  });
  const goals = snapshot.source_entries.filter((entry) => entry.record_type === 'perception_goal');
  const goal = goals.find((entry) => entry.object_id === plan.goal_ref);
  if (!goal || goal.record_type !== 'perception_goal') {
    const error = new Error('create-cycle Goal 不在 freeze inputs');
    error.code = 'CYCLE_INPUT_NOT_READY';
    throw error;
  }
  const querySets = byType(snapshot.source_entries, 'query_set');
  const tracks = [];
  for (const goalEntry of goals) {
    let querySet = null;
    for (const entry of querySets) {
      const data = matter(await readFile(resolveWithin(root, entry.object_path), 'utf8')).data;
      if (data.goal_refs?.includes(goalEntry.object_id)) querySet = entry;
    }
    tracks.push({
      goal_entry_key: goalEntry.entry_key,
      input_snapshot_version: { ref: snapshot.snapshot.id, version: snapshot.snapshot.version },
      query_set_entry_key: querySet?.entry_key ?? querySets[0]?.entry_key,
      knowledge_release_entry_keys: byType(snapshot.source_entries, 'knowledge_release').map((entry) => entry.entry_key),
      evidence_entry_keys: byType(snapshot.source_entries, 'evidence').map((entry) => entry.entry_key),
      asset_entry_keys: byType(snapshot.source_entries, 'asset').map((entry) => entry.entry_key),
      collector_profile_entry_keys: byType(snapshot.source_entries, 'collector_profile').map((entry) => entry.entry_key),
      measurement_contract_entry_key: snapshot.artifact_entries
        .find((entry) => entry.role === 'measurement_contract')?.entry_key,
      stage: 'frozen',
      baseline_aggregation_refs: [], finding_refs: [], evidence_plan_refs: [],
      asset_proposal_refs: [], adoption_record_refs: [], publication_refs: [],
      technical_retest_run_refs: [], answer_retest_aggregation_refs: [],
      analytics_observation_refs: [], business_signal_refs: [],
      review_input_snapshot_version: null,
    });
  }
  const createdAt = validation.merchant.updated_at;
  const cycle = {
    id: plan.cycle_id,
    record_type: 'cycle',
    status: 'active',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: 'Synthetic GEO Cycle 1',
    test_scope: { ...validation.merchant.test_scope },
    scope: 'test_merchant_engineering',
    merchant_ref: plan.merchant_ref,
    cycle_number: 1,
    core_versions: { input_snapshot: { ref: snapshot.snapshot.id, version: snapshot.snapshot.version } },
    aggregate_stage: 'frozen',
    completion_scope: 'none',
    goal_tracks: tracks,
    transition_refs: [],
    cycle_review_version: null,
    predecessor_review_version: null,
    goal_selection_version: null,
  };
  snapshot.cycle = { path: plan.cycle_path, data: cycle };
  const materialized = await materializeCycleFreeze({ workspace: root, plan: snapshot });
  const inputVersions = Object.fromEntries(snapshot.source_entries
    .map((entry) => [entry.object_id, entry.object_version]));
  const run = {
    id: plan.run_id,
    record_type: 'run',
    status: 'running',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: 'Synthetic lifecycle Run',
    test_scope: { ...validation.merchant.test_scope },
    skill: 'geo-lifecycle', skill_version: '1.0.0',
    input_refs: Object.keys(inputVersions).sort(),
    input_versions: Object.fromEntries(Object.entries(inputVersions).sort(([a], [b]) => a.localeCompare(b))),
    input_fingerprint: inputFingerprint(inputVersions),
    completed_steps: ['freeze_snapshot'],
    output_artifacts: [
      ...snapshot.source_entries.map((entry) => entry.snapshot_path),
      ...snapshot.artifact_entries.map((entry) => entry.snapshot_path),
      snapshot.manifest.artifact_path,
    ].sort(),
    business_result: 'not_evaluated',
    next_action: 'advance baseline gate',
    merchant_ref: plan.merchant_ref,
    cycle_ref: plan.cycle_id,
    cycle_version: cycle.version,
    transition_plan_sha256: sha256(stableStringify(plan)),
    lease: {
      scope_key: `${plan.cycle_id}:lifecycle`, owner_id: 'geo-lifecycle-create', revision: 1,
      acquired_at: createdAt, heartbeat_at: createdAt,
      expires_at: new Date(Date.parse(createdAt) + 60_000).toISOString(),
    },
    finding_refs: [], evidence_refs: [], asset_refs: [], failure_reason: null,
  };
  await writeCreateOnly(root, `runs/${plan.run_id}/run.md`, serializeMarkdownObject(
    run,
    '# Synthetic lifecycle Run\n',
  ), { idempotent: true, conflictCode: 'RUN_CONFLICT' });
  return {
    action: materialized.action,
    cycle_id: cycle.id,
    cycle_version: cycle.version,
    goal_entry_key: goal.entry_key,
    snapshot_id: snapshot.snapshot.id,
    network_accessed: false,
  };
}

async function readCycle(root, cycleId) {
  for (const file of await walkMarkdownFiles(root, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    if (parsed.data.id === cycleId && parsed.data.record_type === 'cycle') {
      return { data: parsed.data, path: path.relative(root, file).split(path.sep).join('/') };
    }
  }
  return null;
}

function contamination(value) {
  if (typeof value === 'string') return /(?:^|[\\/])workspaces[\\/]myyshop(?:[\\/]|$)/.test(value);
  if (Array.isArray(value)) return value.some(contamination);
  return value && typeof value === 'object' && Object.values(value).some(contamination);
}

async function verifiedGatePaths(root, descriptors) {
  if (!Array.isArray(descriptors) || descriptors.length === 0) {
    const error = new Error('advance 缺 gate_objects');
    error.code = 'CYCLE_GATE_REQUIRED';
    throw error;
  }
  const paths = [];
  for (const descriptor of descriptors) {
    try {
      assertSafeRelativePath(descriptor.path);
      const parsed = await readMarkdownObject(resolveWithin(root, descriptor.path), { workspace: root });
      const bytes = await readFile(resolveWithin(root, descriptor.path));
      if (parsed.data.id !== descriptor.id
          || parsed.data.record_type !== descriptor.record_type
          || parsed.data.status !== descriptor.status
          || parsed.data.version !== descriptor.version
          || sha256(bytes) !== descriptor.sha256) {
        throw new Error('descriptor mismatch');
      }
      paths.push(descriptor.path);
    } catch {
      const error = new Error('canonical gate object 缺失或 descriptor 漂移');
      error.code = 'CYCLE_GATE_REQUIRED';
      throw error;
    }
  }
  return paths;
}

async function advance(workspace, plan, cycleId) {
  const root = path.resolve(workspace);
  if (plan.cycle_ref !== cycleId) throw invalid('--cycle 与 plan.cycle_ref 不一致');
  if (contamination(plan)) {
    const error = new Error('advance plan 包含真实/模拟污染');
    error.code = 'SYNTHETIC_REAL_REF_CONTAMINATION';
    throw error;
  }
  const gatePaths = await verifiedGatePaths(root, plan.gate_objects);
  const current = await readCycle(root, cycleId);
  const transitionPath = `cycles/m6/transitions/${plan.transition_id.toLowerCase()}.md`;
  if (await fileExists(resolveWithin(root, transitionPath))
      && !current.data.transition_refs.includes(plan.transition_id)) {
    const resumed = await resumeCycleTransition({
      workspace: root,
      cycleId,
      operationId: plan.operation_id,
      expectedCycleVersion: plan.expected_cycle_version,
    });
    const cycle = await readCycle(root, cycleId);
    return { ...resumed, ...cycle.data, to_stage: cycle.data.goal_tracks[0].stage };
  }
  const corePlan = {
    ...plan,
    gate: {
      source_paths: gatePaths,
      artifact_paths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
    },
  };
  const result = await advanceCycle({ workspace: root, plan: corePlan });
  const cycle = await readCycle(root, cycleId);
  return {
    ...result,
    status: cycle.data.status,
    aggregate_stage: cycle.data.aggregate_stage,
    completion_scope: cycle.data.completion_scope,
    cycle_version: cycle.data.version,
    to_stage: cycle.data.goal_tracks[0].stage,
    network_accessed: false,
  };
}

async function completeReviewPlan(root, request) {
  const cycle = await readCycle(root, request.cycle_ref);
  if (!cycle) {
    const error = new Error('Cycle 不存在'); error.code = 'REVIEW_PRE_CUTOFF_INCOMPLETE'; throw error;
  }
  const objects = new Map();
  for (const file of await walkMarkdownFiles(root, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    objects.set(parsed.data.id, {
      data: parsed.data,
      path: path.relative(root, file).split(path.sep).join('/'),
    });
  }
  const freeze = objects.get(cycle.data.core_versions.input_snapshot.ref);
  const transitions = [];
  const keys = [];
  const sourcePaths = new Set(freeze.data.source_entries.map((entry) => entry.object_path));
  const artifacts = new Map(freeze.data.artifact_entries.map((entry) => [entry.source_path, {
    role: entry.role, path: entry.source_path, media_type: entry.media_type,
  }]));
  for (const ref of cycle.data.transition_refs) {
    const transition = objects.get(ref);
    if (!transition || ['review_waiting_human', 'review_decided'].includes(transition.data.to_stage)) break;
    const gate = objects.get(transition.data.gate_snapshot_version.ref);
    transitions.push({ ref: gate.data.id, version: gate.data.version });
    for (const entry of gate.data.source_entries) {
      sourcePaths.add(entry.object_path); keys.push(entry.entry_key);
    }
    for (const entry of gate.data.artifact_entries) {
      artifacts.set(entry.source_path, { role: entry.role, path: entry.source_path, media_type: entry.media_type });
      keys.push(entry.entry_key);
    }
  }
  return {
    ...request,
    run_ref: freeze.data.run_ref,
    reviewed_cycle_input_version: cycle.data.version,
    review_snapshot: {
      ...request.review_snapshot,
      base_freeze_snapshot_version: { ref: freeze.data.id, version: freeze.data.version },
      pre_review_transition_snapshot_versions: transitions,
      pre_review_entry_keys: [...new Set(keys)].sort(),
      source_paths: [...sourcePaths].sort(),
      artifact_paths: [...artifacts.values()].sort((a, b) => a.path.localeCompare(b.path)),
    },
  };
}

async function execute(args) {
  const root = path.resolve(args.workspace);
  if (args.command === 'validate') return validateTestMerchantWorkspace({ workspace: root });
  if (args.command === 'trace') return traceCycle({ workspace: root, cycleId: args.cycle });
  const plan = await readPlan(args.plan);
  if (args.command === 'propose-cycle-two') {
    const { proposeCycleTwo } = await import('./lib/cycle-two-proposal.mjs');
    return proposeCycleTwo({ workspace: root, reviewId: args.review, plan });
  }
  if (args.command === 'apply-goal-selection') {
    const { applyGoalSelection } = await import('./lib/cycle-two-apply.mjs');
    return applyGoalSelection({ workspace: root, plan });
  }
  if (args.command === 'prepare-test-merchant') return prepareTestMerchant(root, plan);
  if (args.command === 'create-cycle') return createCycle(root, plan);
  if (args.command === 'advance') return advance(root, plan, args.cycle);
  return assembleCycleReview({ workspace: root, plan: await completeReviewPlan(root, plan) });
}

function exitCode(error) {
  if (error.code === 'INVALID_ARGUMENT') return 2;
  if (['OBJECT_CONFLICT', 'RUN_CONFLICT', 'IDENTITY_CONFLICT', 'TRANSITION_CONFLICT'].includes(error.code)) return 3;
  return 1;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log('geo-lifecycle commands: prepare-test-merchant create-cycle advance assemble-review trace validate propose-cycle-two apply-goal-selection');
      return;
    }
    assertNetworkDisabled(args.command);
    const result = await execute(args);
    console.log(JSON.stringify(result, null, 2));
    if (Array.isArray(result.errors) && result.errors.length > 0) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'M6_LIFECYCLE_FAILED',
      message: error.message,
      diagnostics: error.diagnostics ?? [],
    }));
    process.exitCode = exitCode(error);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { execute, parseArgs };
