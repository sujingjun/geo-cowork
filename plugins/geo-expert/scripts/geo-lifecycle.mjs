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
  initializeDevelopmentKnowledgeWorkspace,
  preflightLifecycleWrite,
  validateLifecycleWorkspace,
} from './lib/workspace-scope.mjs';
import { assessLifecycleReadiness } from './lib/lifecycle-readiness.mjs';
import {
  readMarkdownObject,
  serializeMarkdownObject,
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
const JOURNEY_COMMANDS = ['preflight', 'start', 'continue', 'inbox', 'apply-feedback', 'report', 'receive-answer', 'record-publication'];
const COMMANDS = new Set([
  ...JOURNEY_COMMANDS,
  'prepare-development-workspace', 'create-cycle', 'advance',
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
  if (['prepare-development-workspace', 'create-cycle', 'advance', 'assemble-review',
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

function byType(entries, type) {
  return entries.filter((entry) => entry.record_type === type);
}

export async function createCycle(workspace, plan) {
  const root = path.resolve(workspace);
  const validation = await validateLifecycleWorkspace({
    workspace: root,
    knowledgeBaseRef: plan.knowledge_base_ref,
  });
  if (validation.errors.length > 0) {
    const error = new Error('Lifecycle Workspace 未就绪');
    error.code = validation.errors[0].code;
    throw error;
  }
  const testOnly = validation.identity.workspace_mode === 'development_test';
  if(testOnly && plan.runtime)throw Object.assign(new Error('Real runtime cannot be installed in a test workspace'),{code:'SYNTHETIC_REAL_REF_CONTAMINATION'});
  if(!testOnly) {
    const runtime=plan.runtime;
    if(!runtime || runtime.cycle_ref!==plan.cycle_id || runtime.run_ref!==plan.run_id
      ||runtime.merchant_ref!==plan.merchant_ref||runtime.knowledge_base_ref!==plan.knowledge_base_ref
      ||runtime.goal_ref!==plan.goal_ref||runtime.query_set_ref!==plan.query_set_ref)
      throw Object.assign(new Error('Real Cycle creation requires a bound execution runtime; use start/preflight'),{code:'REAL_CYCLE_PLAN_REQUIRED'});
    await (await import('./lib/real-journey-store.mjs')).assertRealAuthorization(root,runtime);
  }
  if(!testOnly && plan.cycle_number===2)
    await (await import('./lib/real-cycle-review.mjs')).assertRealCycleTwoBindings(root,plan.runtime??plan);
  if (!testOnly) {
    const readiness = await assessLifecycleReadiness({
      workspace: root,
      knowledgeBaseRef: plan.knowledge_base_ref,
      goalRef: plan.goal_ref,
      querySetRef: plan.query_set_ref,
    });
    if (!readiness.real_cycle_start_ready) {
      const error = new Error('Real Cycle start readiness 未通过');
      error.code = 'KNOWLEDGE_INPUT_ABSENT';
      error.diagnostics = readiness.gates.filter(({ status }) => status === 'blocked');
      throw error;
    }
  }
  if (plan.merchant_ref !== validation.identity.merchant_ref
      || plan.knowledge_base_ref !== validation.identity.knowledge_base_ref) {
    const error = new Error('Cycle Merchant/Knowledge Base 与 Workspace 不一致');
    error.code = 'KNOWLEDGE_BASE_SCOPE_MISMATCH';
    throw error;
  }
  const snapshot = await buildCycleSnapshotPlan({
    workspace: root,
    id: plan.snapshot_id,
    snapshotKind: 'freeze',
    merchantRef: plan.merchant_ref,
    knowledgeBaseRef: plan.knowledge_base_ref,
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
  const createdAt = testOnly ? validation.knowledgeBase.updated_at : (plan.created_at ?? new Date().toISOString());
  const cycle = {
    id: plan.cycle_id,
    record_type: 'cycle',
    status: 'active',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: testOnly ? 'Synthetic GEO Cycle 1' : 'Authorized Real GEO Cycle 1',
    ...(testOnly ? { test_scope: {
      kind: 'synthetic', usage: 'test_only',
      merchant_ref: validation.identity.merchant_ref,
      workspace_id: validation.identity.workspace_id,
      knowledge_base_ref: validation.identity.knowledge_base_ref,
    } } : {}),
    scope: testOnly ? 'knowledge_independent_engineering' : 'authorized_real',
    merchant_ref: plan.merchant_ref,
    knowledge_base_ref: plan.knowledge_base_ref,
    execution_scope: testOnly ? 'synthetic_test' : 'authorized_real',
    cycle_number: plan.cycle_number ?? 1,
    ...(plan.runtime ? { extensions: { 'geo.real_cycle': plan.runtime } } : {}),
    core_versions: { input_snapshot: { ref: snapshot.snapshot.id, version: snapshot.snapshot.version } },
    aggregate_stage: 'frozen',
    completion_scope: 'none',
    goal_tracks: tracks,
    transition_refs: [],
    cycle_review_version: null,
    predecessor_review_version: plan.predecessor_review_version ?? null,
    goal_selection_version: plan.goal_selection_version ?? null,
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
    title: testOnly ? 'Synthetic lifecycle Run' : 'Authorized Real lifecycle Run',
    ...(testOnly ? { test_scope: { ...cycle.test_scope } } : {}),
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
    execution_scope: cycle.execution_scope,
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
  const runBody = testOnly ? '# Synthetic lifecycle Run\n' : '# Authorized Real lifecycle Run\n';
  await preflightLifecycleWrite({
    workspace: root,
    data: run,
    body: runBody,
    refClosure: false,
  });
  await writeCreateOnly(root, `runs/${plan.run_id}/run.md`, serializeMarkdownObject(
    run,
    runBody,
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

export async function completeReviewPlan(root, request) {
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
  if(JOURNEY_COMMANDS.includes(args.command))return (await import('./lib/journey-entrypoints.mjs')).executeKnowledgeJourney(args);
  if (args.command === 'validate') return validateLifecycleWorkspace({ workspace: root });
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
  if (args.command === 'prepare-development-workspace') {
    return initializeDevelopmentKnowledgeWorkspace({ workspace: root, plan });
  }
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
      console.log(`geo-lifecycle commands: ${[...COMMANDS].join(' ')}`);
      return;
    }
    if (!JOURNEY_COMMANDS.includes(args.command)) assertNetworkDisabled(args.command);
    const result = JOURNEY_COMMANDS.includes(args.command)
      ? await (await import('./lib/journey-entrypoints.mjs')).executeKnowledgeJourney(args)
      : await execute(args);
    console.log(JSON.stringify(result, null, 2));
    if (Array.isArray(result.errors) && result.errors.length > 0) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({
      error: error.code ?? 'M6_LIFECYCLE_FAILED',
      message: error.message,
      diagnostics: error.diagnostics ?? error.fields?.map(field => ({field})) ?? [],
    }));
    process.exitCode = exitCode(error);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { execute, parseArgs };
