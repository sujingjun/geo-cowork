import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  validateCandidateBatchClosure,
  validateProductGapCandidate,
} from './cycle-goal-candidates.mjs';
import { validateGoalSelection } from './cycle-goal-selection.mjs';
import {
  buildCycleSnapshotPlan,
  materializeCycleFreeze,
  previewCycleSnapshotTargets,
} from './cycle-snapshot.mjs';
import { prepareCycleTwoInputs } from './cycle-two.mjs';
import {
  assertNoTestKnowledgeContamination,
  assertDevelopmentWorkspaceWriteAllowed,
  preflightTestKnowledgeWrite,
  validateDevelopmentKnowledgeWorkspace,
} from './workspace-scope.mjs';
import { validateM6Object } from './m6-profile.mjs';
import { collectObjectReferences } from './index-builder.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { inputFingerprint } from './run-store.mjs';
import { traceCycle } from './cycle-trace.mjs';
import {
  assertCreateOnlyTargets,
  canonicalObjectMap,
  entryIdentity,
  exactVersion,
  loadCanonicalSnapshot,
  makeFailure,
  sameJson,
} from './cycle-two-workspace.mjs';
import {
  compareUtf8,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';
function sameReviewVersion(value, review, checksum) {
  return value?.ref === review.data.id
    && value?.version === review.data.version
    && value?.file_sha256 === checksum;
}
async function validateWorkspace(root) {
  await assertDevelopmentWorkspaceWriteAllowed({ workspace: root });
  const result = await validateDevelopmentKnowledgeWorkspace({ workspace: root });
  if (result.errors.length > 0) {
    throw makeFailure(result.errors[0].code, 'M7 Test Workspace 未就绪', {
      diagnostics: result.errors,
    });
  }
  return result;
}
async function verifyStrategyCandidate(root, objects, candidate, reviewGraph) {
  if (candidate.candidate_kind !== 'product_gap') return;
  const versions = candidate.strategy_gate_versions;
  if (!versions) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', 'Product Gap strategy pins 缺失');
  }
  const assessment = objects.get(versions.strategy_assessment_version.ref);
  const output = objects.get(versions.strategy_output_version.ref);
  const dimensions = versions.decision_dimension_versions.map((item) => objects.get(item.ref));
  if (!assessment || !output || dimensions.some((item) => !item)) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_REQUIRED', 'Product Gap strategy 对象缺失');
  }
  exactVersion(assessment, versions.strategy_assessment_version,
    'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  exactVersion(output, versions.strategy_output_version,
    'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  versions.decision_dimension_versions.forEach((item, index) => exactVersion(
    dimensions[index], item, 'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH',
  ));
  const reviewGap = reviewGraph.entries.get(versions.review_product_gap_entry_key);
  const strategyGraph = await loadCanonicalSnapshot(root, versions.strategy_input_snapshot_version.ref);
  exactVersion(strategyGraph.snapshot, versions.strategy_input_snapshot_version,
    'GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH');
  const strategyGap = strategyGraph.entries.get(versions.strategy_product_gap_entry_key);
  if (!reviewGap || !strategyGap
      || !sameJson(entryIdentity(reviewGap), versions.product_gap_identity)
      || !sameJson(entryIdentity(strategyGap), versions.product_gap_identity)
      || assessment.data.strategy_input_snapshot_version?.ref !== strategyGraph.snapshot.data.id
      || output.data.strategy_input_snapshot_version?.ref !== strategyGraph.snapshot.data.id) {
    throw makeFailure('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', 'Product Gap identity/snapshot 换绑');
  }
  const checked = validateProductGapCandidate({
    candidate,
    gates: {
      assessment: assessment.data,
      dimensions: dimensions.map((item) => item.data),
      output: output.data,
      reviewProductGapIdentity: entryIdentity(reviewGap),
      strategyProductGapIdentity: entryIdentity(strategyGap),
    },
  });
  if (checked.errors.length > 0) {
    throw makeFailure(checked.errors[0].code, 'Product Gap strategy gate 非法', {
      diagnostics: checked.errors,
    });
  }
}
function selectedReviewInput(review, selected) {
  return review.data.next_cycle_candidate_inputs.find((input) =>
    input.candidate_kind === selected.candidate_kind
      && input.source_goal_entry?.entry_key === selected.source_goal_entry_key
      && sameJson(
        input.source_entries.map((item) => item.entry_key).sort(compareUtf8),
        selected.source_entry_keys,
      )
      && input.goal_statement === selected.proposed_goal.statement
      && input.success_question === selected.proposed_goal.success_question
      && input.query_cluster_key === selected.proposed_goal.query_cluster_key);
}
async function verifySelectionChain(root, plan) {
  const objects = await canonicalObjectMap(root);
  const review = objects.get(plan.predecessor_review_version.ref);
  const selection = objects.get(plan.goal_selection_version.ref);
  const selected = objects.get(plan.selected_candidate_version.ref);
  if (!review || review.data.record_type !== 'cycle_review' || review.data.status !== 'decided'
      || !selection || selection.data.record_type !== 'cycle_goal_selection'
      || selection.data.status !== 'decided'
      || !selected || selected.data.record_type !== 'cycle_goal_candidate') {
    throw makeFailure('GOAL_SELECTION_REQUIRED', 'Cycle 2 selection chain 不完整');
  }
  exactVersion(review, plan.predecessor_review_version, 'CYCLE_TWO_PREDECESSOR_MISMATCH');
  exactVersion(selection, plan.goal_selection_version, 'GOAL_SELECTION_REQUIRED');
  exactVersion(selected, plan.selected_candidate_version, 'GOAL_SELECTION_REQUIRED');
  const reviewSha = sha256(review.bytes);
  if (plan.predecessor_review_version.file_sha256
      && plan.predecessor_review_version.file_sha256 !== reviewSha) {
    throw makeFailure('CYCLE_TWO_PREDECESSOR_MISMATCH', 'predecessor Review bytes 漂移');
  }
  const predecessorTrace = await traceCycle({ workspace: root, cycleId: review.data.cycle_ref });
  if (predecessorTrace.status !== 'completed' || predecessorTrace.errors?.length > 0) {
    throw makeFailure('CYCLE_ONE_REVIEW_REQUIRED', 'predecessor Cycle 1 未 completed', {
      diagnostics: predecessorTrace.errors ?? [],
    });
  }
  const draft = objects.get(selection.data.supersedes_ref);
  if (!draft || draft.data.record_type !== 'cycle_goal_selection') {
    throw makeFailure('GOAL_SELECTION_APPROVAL_REQUIRED', 'decided GSEL direct draft 缺失');
  }
  const selectionCheck = validateGoalSelection(selection.data, { prior: draft.data });
  if (selectionCheck.errors.length > 0) {
    throw makeFailure(selectionCheck.errors[0].code, 'decided GSEL 完整性失败', {
      diagnostics: selectionCheck.errors,
    });
  }
  const batch = objects.get(selection.data.candidate_batch_version.ref);
  if (!batch || batch.data.record_type !== 'cycle_goal_candidate_batch') {
    throw makeFailure('GOAL_CANDIDATE_BATCH_INCOMPLETE', 'GCB 不存在');
  }
  exactVersion(batch, selection.data.candidate_batch_version, 'GOAL_CANDIDATE_BATCH_INCOMPLETE');
  const candidates = batch.data.ordered_candidates.map((item) => objects.get(item.candidate_version.ref));
  if (candidates.some((item) => !item)) {
    throw makeFailure('GOAL_CANDIDATE_BATCH_INCOMPLETE', 'GCB candidate 缺失');
  }
  const batchCheck = validateCandidateBatchClosure({
    batch: batch.data,
    candidates: candidates.map((item) => item.data),
  });
  if (batchCheck.errors.length > 0) {
    throw makeFailure(batchCheck.errors[0].code, 'GCB/GCD 派生完整性失败', {
      diagnostics: batchCheck.errors,
    });
  }
  const chosen = selection.data.decision.selected_candidate_version;
  if (!chosen
      || chosen.ref !== selected.data.id || chosen.version !== selected.data.version
      || !sameJson(chosen, plan.selected_candidate_version)) {
    throw makeFailure('GOAL_SELECTION_REQUIRED', 'selected Candidate 与 GSEL/plan 不一致');
  }
  if (!sameReviewVersion(batch.data.source_cycle_review_version, review, reviewSha)
      || !sameReviewVersion(selection.data.source_cycle_review_version, review, reviewSha)
      || candidates.some((item) => !sameReviewVersion(
        item.data.source_cycle_review_version, review, reviewSha,
      ))) {
    throw makeFailure('CYCLE_TWO_PREDECESSOR_MISMATCH', 'GCB/GCD/GSEL predecessor bytes 漂移');
  }
  const reviewGraph = await loadCanonicalSnapshot(root, review.data.review_input_snapshot_version.ref);
  exactVersion(reviewGraph.snapshot, review.data.review_input_snapshot_version,
    'CYCLE_TWO_PREDECESSOR_MISMATCH');
  if (reviewGraph.snapshot.data.snapshot_kind !== 'review'
      || review.data.review_input_fingerprint !== reviewGraph.snapshot.data.manifest.fingerprint) {
    throw makeFailure('CYCLE_TWO_PREDECESSOR_MISMATCH', 'predecessor Review CIS 漂移');
  }
  if (!selectedReviewInput(review, selected.data)) {
    throw makeFailure('GOAL_CANDIDATE_INPUT_DRIFT', 'selected Candidate 不来自 Review pinned input');
  }
  await verifyStrategyCandidate(root, objects, selected.data, reviewGraph);
  return { objects, review, selection, draft, batch, candidates, selected, reviewSha };
}
function validatePlannedObjects(plan, validation, existing) {
  const planned = [];
  const ids = new Set();
  const paths = new Set();
  for (const item of plan.source_objects ?? []) {
    if (!item?.path || ids.has(item.data?.id) || paths.has(item.path)) {
      throw makeFailure('CYCLE_INPUT_NOT_READY', 'Cycle 2 source object ID/path 不唯一');
    }
    ids.add(item.data.id);
    paths.add(item.path);
    const data = validateObjectData(item.data, { path: item.path });
    const profile = validateM6Object({ data, path: item.path }, { testKnowledgeWorkspace: true });
    if (profile.errors.length > 0) {
      throw makeFailure(profile.errors[0].code, 'Cycle 2 source profile 非法', {
        diagnostics: profile.errors,
      });
    }
    if (data.test_scope?.merchant_ref !== validation.merchant.id
        || data.test_scope?.workspace_id !== validation.identity.workspace_id
        || data.test_scope?.knowledge_base_ref !== validation.knowledgeBase.id) {
      throw makeFailure('SYNTHETIC_REAL_REF_CONTAMINATION', 'Cycle 2 source scope 跨 Workspace');
    }
    const body = `# ${data.title}\n`;
    const bytes = Buffer.from(serializeMarkdownObject(data, body));
    const prior = existing.get(data.id);
    if (prior && (prior.path !== item.path || !prior.bytes.equals(bytes))) {
      throw makeFailure('OBJECT_CONFLICT', 'Cycle 2 planned stable ID 已存在不同 bytes', { id: data.id });
    }
    planned.push({ path: item.path, data, body, bytes });
  }
  return planned;
}
function validateRefClosure(planned, existing) {
  const byId = new Map([...existing.entries()].map(([id, object]) => [id, object.data]));
  for (const item of planned) byId.set(item.data.id, item.data);
  for (const item of planned) {
    for (const relation of collectObjectReferences(item.data)) {
      const target = relation.ref === item.data.id ? item.data : byId.get(relation.ref);
      if (!target) {
        throw makeFailure('BROKEN_REF', 'Cycle 2 planned ref 未解析', {
          field: relation.field, ref: relation.ref,
        });
      }
      if (!relation.allowedTypes.includes(target.record_type)) {
        throw makeFailure('REF_TYPE_MISMATCH', 'Cycle 2 planned ref 类型错误', {
          field: relation.field, ref: relation.ref,
        });
      }
      if (relation.version && relation.version !== target.version) {
        throw makeFailure('REF_VERSION_MISMATCH', 'Cycle 2 planned ref version 漂移', {
          field: relation.field, ref: relation.ref,
        });
      }
    }
  }
}
async function materializationInputs(root, plan, validation, existing) {
  const planned = validatePlannedObjects(plan, validation, existing);
  validateRefClosure(planned, existing);
  const raw = [];
  for (const file of plan.workspace_files ?? []) {
    const bytes = Buffer.from(file.content ?? '');
    if (sha256(bytes) !== file.sha256) {
      throw makeFailure('CYCLE_INPUT_NOT_READY', 'Cycle 2 workspace file checksum 漂移', {
        path: file.path,
      });
    }
    assertNoTestKnowledgeContamination(file.content);
    raw.push({ path: file.path, bytes });
  }
  const rawByPath = new Map(raw.map((item) => [item.path, item.bytes]));
  for (const item of planned.filter((entry) => entry.data.record_type === 'evidence')) {
    const snapshotPath = item.data.snapshot?.path;
    let bytes = rawByPath.get(snapshotPath);
    if (!bytes) {
      try { bytes = await readFile(resolveWithin(root, snapshotPath)); } catch { bytes = null; }
    }
    if (!bytes || sha256(bytes) !== item.data.snapshot.sha256) {
      throw makeFailure('CHECKSUM_MISMATCH', 'Cycle 2 Evidence snapshot checksum 漂移', {
        id: item.data.id,
      });
    }
  }
  for (const item of planned) {
    await preflightTestKnowledgeWrite({
      workspace: root,
      data: item.data,
      body: item.body,
      manifest: { cycle_number: 2 },
      refClosure: false,
    });
  }
  const sourceBytes = new Map();
  const plannedByPath = new Map(planned.map((item) => [item.path, item.bytes]));
  for (const sourcePath of plan.source_paths) {
    const bytes = plannedByPath.get(sourcePath)
      ?? await readFile(resolveWithin(root, sourcePath));
    sourceBytes.set(sourcePath, bytes);
  }
  const artifactBytes = new Map();
  for (const artifact of plan.artifact_paths) {
    const bytes = await readFile(resolveWithin(root, artifact.path));
    assertNoTestKnowledgeContamination(bytes.toString('utf8'));
    artifactBytes.set(artifact.path, bytes);
  }
  return { planned, raw, sourceBytes, artifactBytes };
}

function cycleTrack(snapshot, goalEntry) {
  const entries = (type) => snapshot.source_entries.filter((item) => item.record_type === type);
  const querySets = entries('query_set');
  const querySet = querySets.find((entry) => {
    const bytes = snapshot.sourceBytes.get(entry.object_path);
    return matter(bytes.toString('utf8')).data.goal_refs?.includes(goalEntry.object_id);
  }) ?? querySets[0];
  return {
    goal_entry_key: goalEntry.entry_key,
    input_snapshot_version: { ref: snapshot.snapshot.id, version: snapshot.snapshot.version },
    query_set_entry_key: querySet?.entry_key,
    knowledge_release_entry_keys: entries('knowledge_release').map((item) => item.entry_key),
    evidence_entry_keys: entries('evidence').map((item) => item.entry_key),
    asset_entry_keys: entries('asset').map((item) => item.entry_key),
    collector_profile_entry_keys: entries('collector_profile').map((item) => item.entry_key),
    measurement_contract_entry_key: snapshot.artifact_entries
      .find((item) => item.role === 'measurement_contract')?.entry_key,
    stage: 'frozen',
    baseline_aggregation_refs: [], finding_refs: [], evidence_plan_refs: [],
    asset_proposal_refs: [], adoption_record_refs: [], publication_refs: [],
    technical_retest_run_refs: [], answer_retest_aggregation_refs: [],
    analytics_observation_refs: [], business_signal_refs: [],
    review_input_snapshot_version: null,
  };
}

function runData(plan, cycle, snapshot, createdAt) {
  const versions = Object.fromEntries(snapshot.source_entries.map((entry) => [
    entry.object_id, entry.object_version,
  ]).sort(([left], [right]) => compareUtf8(left, right)));
  return {
    id: plan.run_id,
    record_type: 'run',
    status: 'running',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: 'Synthetic Cycle 2 lifecycle Run',
    test_scope: { ...cycle.test_scope },
    skill: 'geo-lifecycle',
    skill_version: '1.0.0',
    input_refs: Object.keys(versions).sort(compareUtf8),
    input_versions: versions,
    input_fingerprint: inputFingerprint(versions),
    completed_steps: ['freeze_snapshot'],
    output_artifacts: [
      ...snapshot.source_entries.map((entry) => entry.snapshot_path),
      ...snapshot.artifact_entries.map((entry) => entry.snapshot_path),
      snapshot.manifest.artifact_path,
    ].sort(compareUtf8),
    business_result: 'not_evaluated',
    next_action: 'advance Cycle 2 baseline gate',
    merchant_ref: plan.merchant_ref,
    cycle_ref: plan.cycle_id,
    cycle_version: cycle.version,
    transition_plan_sha256: sha256(stableStringify(plan)),
    lease: {
      scope_key: `${plan.cycle_id}:lifecycle`,
      owner_id: 'geo-lifecycle-cycle-two',
      revision: 1,
      acquired_at: createdAt,
      heartbeat_at: createdAt,
      expires_at: new Date(Date.parse(createdAt) + 60_000).toISOString(),
    },
    finding_refs: [], evidence_refs: [], asset_refs: [], failure_reason: null,
  };
}

export async function applyGoalSelection({ workspace, plan }) {
  const root = path.resolve(workspace);
  const validation = await validateWorkspace(root);
  const prepared = prepareCycleTwoInputs(plan);
  const chain = await verifySelectionChain(root, prepared);
  const selectedGoal = prepared.source_objects.find((item) =>
    item.data.id === prepared.new_goal.id && item.path === prepared.new_goal.path)?.data;
  if (!selectedGoal || selectedGoal.record_type !== 'perception_goal'
      || selectedGoal.status !== 'approved'
      || selectedGoal.goal_statement !== chain.selected.data.proposed_goal.statement
      || selectedGoal.success_question !== chain.selected.data.proposed_goal.success_question
      || prepared.new_goal.statement !== chain.selected.data.proposed_goal.statement
      || prepared.new_goal.success_question !== chain.selected.data.proposed_goal.success_question
      || prepared.new_goal.query_cluster_key !== chain.selected.data.proposed_goal.query_cluster_key) {
    throw makeFailure('GOAL_SELECTION_APPROVAL_REQUIRED', 'Cycle 2 Goal 与 selected Candidate 不一致');
  }
  const decisions = new Set([
    chain.review.data.approval?.decision_ref,
    chain.selection.data.approval?.decision_ref,
    selectedGoal.approval?.decision_ref,
  ]);
  if (decisions.size !== 3 || [...decisions].some((item) => !item)) {
    throw makeFailure('GOAL_SELECTION_APPROVAL_REQUIRED', 'Goal/Review/GSEL approval 不独立');
  }
  const materialization = await materializationInputs(
    root,
    prepared,
    validation,
    chain.objects,
  );
  const snapshot = await buildCycleSnapshotPlan({
    workspace: root,
    id: prepared.snapshot_id,
    snapshotKind: 'freeze',
    snapshotPath: `cycles/m7/snapshots/${prepared.snapshot_id.toLowerCase()}.md`,
    merchantRef: prepared.merchant_ref,
    knowledgeBaseRef: prepared.knowledge_base_ref,
    cycleRef: prepared.cycle_id,
    runRef: prepared.run_id,
    sourcePaths: prepared.freeze_input_plan.source_paths,
    artifactPaths: prepared.freeze_input_plan.artifact_paths,
    sourceBytesByPath: materialization.sourceBytes,
    artifactBytesByPath: materialization.artifactBytes,
  });
  snapshot.sourceBytes = materialization.sourceBytes;
  const goals = snapshot.source_entries.filter((entry) =>
    entry.record_type === 'perception_goal' && entry.object_id === prepared.new_goal.id);
  if (goals.length !== 1) {
    throw makeFailure('CYCLE_INPUT_NOT_READY', 'Cycle 2 freeze 缺唯一 selected Goal');
  }
  const createdAt = selectedGoal.updated_at;
  const cycle = {
    id: prepared.cycle_id,
    record_type: 'cycle',
    status: 'active',
    version: '1.0.0',
    created_at: createdAt,
    updated_at: createdAt,
    title: 'Synthetic GEO Cycle 2',
    test_scope: { ...selectedGoal.test_scope },
    scope: 'knowledge_independent_engineering',
    merchant_ref: prepared.merchant_ref,
    knowledge_base_ref: prepared.knowledge_base_ref,
    execution_scope: 'synthetic_test',
    cycle_number: 2,
    core_versions: { input_snapshot: { ref: snapshot.snapshot.id, version: snapshot.snapshot.version } },
    aggregate_stage: 'frozen',
    completion_scope: 'none',
    goal_tracks: [cycleTrack(snapshot, goals[0])],
    transition_refs: [],
    cycle_review_version: null,
    predecessor_review_version: {
      ref: chain.review.data.id,
      version: chain.review.data.version,
    },
    goal_selection_version: {
      ref: chain.selection.data.id,
      version: chain.selection.data.version,
    },
  };
  snapshot.cycle = { path: prepared.cycle_path, data: cycle };
  const run = runData(prepared, cycle, snapshot, createdAt);
  const cycleBytes = Buffer.from(serializeMarkdownObject(cycle, '# M6 synthetic cycle\n'));
  const runPath = `runs/${prepared.run_id}/run.md`;
  const runBytes = Buffer.from(serializeMarkdownObject(run, '# Synthetic Cycle 2 lifecycle Run\n'));
  await preflightTestKnowledgeWrite({
    workspace: root, data: cycle, body: '# M6 synthetic cycle\n', manifest: prepared,
    refClosure: false,
  });
  await preflightTestKnowledgeWrite({
    workspace: root, data: run, body: '# Synthetic Cycle 2 lifecycle Run\n', manifest: prepared,
    refClosure: false,
  });
  const snapshotTargets = await previewCycleSnapshotTargets({
    workspace: root,
    plan: snapshot,
    sourceBytesByPath: materialization.sourceBytes,
    artifactBytesByPath: materialization.artifactBytes,
  });
  const targets = [
    ...materialization.raw,
    ...materialization.planned.map(({ path: targetPath, bytes }) => ({ path: targetPath, bytes })),
    ...snapshotTargets.map((item) => ({ path: item.target, bytes: item.bytes })),
    { path: prepared.cycle_path, bytes: cycleBytes },
    { path: runPath, bytes: runBytes },
  ];
  await assertCreateOnlyTargets(root, targets, 'CYCLE_INPUT_SNAPSHOT_CONFLICT');
  for (const target of [...materialization.raw, ...materialization.planned]) {
    await writeCreateOnly(root, target.path, target.bytes, {
      idempotent: true,
      conflictCode: 'CYCLE_INPUT_SNAPSHOT_CONFLICT',
    });
  }
  const frozen = await materializeCycleFreeze({ workspace: root, plan: snapshot });
  const runResult = await writeCreateOnly(root, runPath, runBytes, {
    idempotent: true,
    conflictCode: 'RUN_CONFLICT',
  });
  delete snapshot.sourceBytes;
  return {
    ...cycle,
    action: frozen.action === 'kept' && runResult.action === 'kept' ? 'kept' : 'created',
    cycle_id: cycle.id,
    cycle_version: cycle.version,
    snapshot_id: snapshot.snapshot.id,
    goal_entry_key: goals[0].entry_key,
    selected_candidate_version: { ...prepared.selected_candidate_version },
    network_accessed: false,
    written_paths: targets.map((item) => item.path),
  };
}
