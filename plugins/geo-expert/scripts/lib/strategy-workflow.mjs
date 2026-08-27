import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  assessStrategyEligibility,
  buildDecidedStrategyAssessment,
  buildWaitingStrategyAssessment,
  loadStrategySnapshot,
  materializeStrategyAssessment,
} from './strategy-assessment.mjs';
import {
  buildDecisionDimensionSuccessor,
  materializeDecisionDimension,
} from './decision-dimension.mjs';
import { buildCycleSnapshotPlan, materializeCycleSnapshot } from './cycle-snapshot.mjs';
import { readMarkdownObject, validateObjectData } from './object-contract.mjs';
import { transitionRun } from './run-store.mjs';
import {
  materializeStrategyOutput,
  strategyArtifactFingerprint,
} from './strategy-output.mjs';
import {
  assertNoSymlinkPath,
  compareUtf8,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';
import { findStrategyCanonical } from './strategy-workspace.mjs';
import {
  createStrategyRun, eligibilityInput, snapshotViewFromPlan,
} from './strategy-workflow-preflight.mjs';

function fail(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  throw error;
}

function same(left, right) {
  return stableStringify(left) === stableStringify(right);
}

async function bytesWithin(root, relative) {
  const safe = path.isAbsolute(relative)
    ? path.relative(root, relative).split(path.sep).join('/') : relative;
  if (!safe || safe.startsWith('../') || path.isAbsolute(safe)) {
    fail('PATH_ESCAPE', '输入文件不在 Workspace 内');
  }
  await assertNoSymlinkPath(root, safe);
  return readFile(resolveWithin(root, safe));
}

async function jsonWithin(root, relative, label) {
  try {
    return JSON.parse((await bytesWithin(root, relative)).toString('utf8'));
  } catch (error) {
    if (error.code && error.code !== 'ENOENT') throw error;
    return fail('INVALID_ARGUMENT', `${label} 无法读取或不是合法 JSON`);
  }
}

async function objectWithin(root, relative, expected = {}) {
  const bytes = await bytesWithin(root, relative);
  const parsed = await readMarkdownObject(resolveWithin(root, relative), { workspace: root });
  if ((expected.id && parsed.data.id !== expected.id)
      || (expected.type && parsed.data.record_type !== expected.type)
      || (expected.status && parsed.data.status !== expected.status)) {
    fail(expected.code ?? 'STRATEGY_TRIGGER_SCOPE_MISMATCH', 'canonical 对象身份或状态不匹配', {
      path: relative,
    });
  }
  return { ...parsed, bytes, path: relative, file_sha256: sha256(bytes) };
}

function fixtureDecision(decision, kind) {
  if (decision?.schema_version !== 'm7-fixture-human-decision/1.0.0'
      || decision.decision_kind !== kind
      || decision.conversation_history_used !== false
      || decision.fresh_process_required !== true
      || decision.real_execution_authorized !== false) {
    fail('STRATEGY_DECISION_INVALID', '只接受 fresh synthetic/test_only fixture decision');
  }
  const refs = [
    decision.human_invocation?.decision_ref,
    decision.approval?.decision_ref,
    decision.decision?.decision_ref,
  ].filter(Boolean);
  if (refs.some((item) => !item.startsWith('fixture://'))) {
    fail('STRATEGY_DECISION_INVALID', 'decision_ref 必须是 fixture://');
  }
}

function assertPin(pin, object, code = 'STRATEGY_DECISION_INPUT_DRIFT') {
  if (!pin || pin.ref !== object.data.id || pin.version !== object.data.version
      || pin.file_sha256 !== object.file_sha256) {
    fail(code, 'decision pin 与 canonical bytes 不一致');
  }
}

function artifactBySource(plan, sourcePath) {
  return plan.artifact_entries.find((item) => item.source_path === sourcePath);
}

async function snapshotFromAssessment(root, assessment) {
  const cis = await findStrategyCanonical(
    root, assessment.strategy_input_snapshot_version.ref, 'cycle_input_snapshot',
  );
  if (cis.data.snapshot_kind !== 'strategy'
      || cis.data.version !== assessment.strategy_input_snapshot_version.version) {
    fail('STRATEGY_TRIGGER_CHECK_INCOMPLETE', 'Assessment strategy CIS pin 不匹配');
  }
  const manifestPath = `runs/${cis.data.run_ref}/${cis.data.manifest.artifact_path}`;
  const manifestBytes = await bytesWithin(root, manifestPath);
  const plan = {
    snapshot: { id: cis.data.id, kind: 'strategy' },
    merchant_ref: cis.data.merchant_ref,
    cycle_ref: cis.data.cycle_ref,
    run_ref: cis.data.run_ref,
    source_entries: cis.data.source_entries,
    artifact_entries: cis.data.artifact_entries,
    manifest: {
      ...cis.data.manifest,
      bytes: manifestBytes.toString('utf8'),
    },
  };
  const snapshot = await loadStrategySnapshot({ workspace: root, plan });
  if (snapshot.fingerprint !== cis.data.manifest.fingerprint) {
    fail('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS fingerprint 不一致');
  }
  return { cis, snapshot };
}

export async function recomputeAssessment(root, assessment) {
  const loaded = await snapshotFromAssessment(root, assessment);
  const input = {
    human_invocation: assessment.human_invocation,
    ...assessment.eligibility_inputs,
    eligibility_rule_entry_key: assessment.eligibility_rule.artifact_entry_key,
  };
  const result = await assessStrategyEligibility({ snapshot: loaded.snapshot, input });
  if (result.eligibility_result !== assessment.eligibility_result
      || !same(result.eligibility_checks, assessment.eligibility_checks)) {
    fail('STRATEGY_DECISION_INPUT_DRIFT', 'Assessment 与冻结 CIS 复算结果不一致');
  }
  return loaded;
}

export async function invokeStrategy({ root, plan }) {
  const config = plan.invoke;
  if (!config) return { state: 'waiting_explicit_strategy_input', written_paths: [] };
  const decision = await jsonWithin(root, config.decision_path, 'invocation decision');
  fixtureDecision(decision, 'strategy_invocation');
  if (!decision.human_invocation?.decision_ref) {
    fail('STRATEGY_HUMAN_TRIGGER_REQUIRED', '缺少显式人工 strategy invocation');
  }
  const review = await objectWithin(root, config.review_path, {
    id: decision.cycle_review_version?.ref, type: 'cycle_review', status: 'decided',
    code: 'CYCLE_ONE_REVIEW_REQUIRED',
  });
  assertPin(decision.cycle_review_version, review, 'CYCLE_ONE_REVIEW_REQUIRED');
  const cycle = await objectWithin(root, config.cycle_path, {
    id: review.data.cycle_ref, type: 'cycle', status: 'completed', code: 'CYCLE_ONE_REVIEW_REQUIRED',
  });
  if (cycle.data.cycle_number !== 1 || config.source_paths.length === 0
      || !config.source_paths.includes(config.review_path)
      || !config.source_paths.includes(config.cycle_path)) {
    fail('CYCLE_ONE_REVIEW_REQUIRED', 'Strategy 只接受 completed Cycle 1 decided Review');
  }
  const rulePaths = [config.eligibility_rule_path, config.candidate_generator_rule_path];
  const [eligibilityRule, candidateRule] = await Promise.all(
    rulePaths.map((item) => jsonWithin(root, item, 'strategy rule')),
  );
  if (eligibilityRule?.schema_version !== 'm7-strategy-eligibility-rule/1.0.0'
      || eligibilityRule.scope !== decision.human_invocation.requested_scope
      || eligibilityRule.real_execution_authorized !== false
      || candidateRule?.schema_version !== 'm7-cycle-goal-candidate-rule/1.0.0'
      || candidateRule.real_execution_authorized !== false
      || candidateRule.hidden_score !== false
      || !same(candidateRule.kind_order, {
        query_cluster: 1, content_gap: 2, evidence_gap: 3,
        severe_misperception: 4, recommendation_reason: 5, product_gap: 6,
      })
      || !same(candidateRule.sort, [
        'priority_ascending', 'kind_order_ascending',
        'candidate_content_key_ascii_ascending',
      ])
      || typeof candidateRule.derived_fields?.rationale_template !== 'string'
      || !candidateRule.derived_fields.rationale_template.includes('{candidate_kind}')
      || !Array.isArray(candidateRule.derived_fields?.limitations)
      || candidateRule.derived_fields.limitations.length === 0
      || candidateRule.derived_fields.limitations.some((item) =>
        typeof item !== 'string' || item.trim() === '')) {
    fail('STRATEGY_TRIGGER_SCOPE_MISMATCH', 'strategy versioned rule 不满足 test-only 合同');
  }
  await Promise.all(config.source_paths.map((item) => objectWithin(root, item)));
  const ruleOutputs = {
    eligibility: 'outputs/contracts/m7-eligibility-rule.json',
    candidate: 'outputs/contracts/m7-candidate-generator-rule.json',
  };
  for (const [source, target] of [
    [config.eligibility_rule_path, ruleOutputs.eligibility],
    [config.candidate_generator_rule_path, ruleOutputs.candidate],
  ]) {
    await writeCreateOnly(root, `runs/${config.run_ref}/${target}`, await bytesWithin(root, source), {
      idempotent: true, conflictCode: 'STRATEGY_RULE_CONFLICT',
    });
  }
  const snapshotPlan = await buildCycleSnapshotPlan({
    workspace: root, id: config.snapshot_ref, snapshotKind: 'strategy',
    merchantRef: plan.merchant_ref, cycleRef: cycle.data.id, runRef: config.run_ref,
    sourcePaths: config.source_paths,
    artifactPaths: [
      { role: 'other_contract', path: config.decision_path, media_type: 'application/json' },
      { role: 'other_contract', path: `runs/${config.run_ref}/${ruleOutputs.eligibility}`, media_type: 'application/json' },
      { role: 'other_contract', path: `runs/${config.run_ref}/${ruleOutputs.candidate}`, media_type: 'application/json' },
    ],
  });
  const parsed = new Map();
  for (const entry of snapshotPlan.source_entries) {
    parsed.set(entry.object_id, await objectWithin(root, entry.object_path));
  }
  const artifacts = new Map();
  for (const entry of snapshotPlan.artifact_entries) {
    artifacts.set(entry.source_path, await bytesWithin(root, entry.source_path));
  }
  const snapshot = snapshotViewFromPlan(snapshotPlan, parsed, artifacts);
  const input = eligibilityInput(snapshot, decision.human_invocation);
  const result = await assessStrategyEligibility({ snapshot, input });
  const eligibilityEntry = artifactBySource(
    snapshotPlan, `runs/${config.run_ref}/${ruleOutputs.eligibility}`,
  );
  const data = buildWaitingStrategyAssessment({
    context: {
      id: config.waiting.id, created_at: decision.human_invocation.invoked_at,
      test_scope: { ...review.data.test_scope }, merchant_ref: plan.merchant_ref,
      cycle_review_ref: review.data.id, cycle_review_version: review.data.version,
      strategy_input_snapshot_version: { ref: config.snapshot_ref, version: '1.0.0' },
    },
    input, result,
    eligibilityRule: {
      id: eligibilityRule.id, version: eligibilityRule.version,
      artifact_path: ruleOutputs.eligibility,
      artifact_entry_key: eligibilityEntry.entry_key,
      sha256: eligibilityEntry.snapshot_sha256,
    },
  });
  validateObjectData(data, { path: config.waiting.path });
  await materializeCycleSnapshot({ workspace: root, plan: snapshotPlan });
  await createStrategyRun({
    root, runRef: config.run_ref, now: decision.human_invocation.invoked_at,
    testScope: review.data.test_scope,
    outputArtifacts: [ruleOutputs.candidate, ruleOutputs.eligibility].sort(compareUtf8),
    inputVersions: {
      [plan.merchant_ref]: review.data.test_scope ? '1.0.0' : '1.0.0',
      [cycle.data.id]: cycle.data.version,
      [review.data.id]: review.data.version,
      [config.snapshot_ref]: '1.0.0',
    },
  });
  const materialized = await materializeStrategyAssessment({
    workspace: root, path: config.waiting.path, data,
  });
  await transitionRun({
    workspace: root, runId: config.run_ref, status: 'running',
    now: decision.human_invocation.invoked_at,
  });
  await transitionRun({
    workspace: root, runId: config.run_ref, status: 'waiting_human',
    now: decision.human_invocation.invoked_at,
    patch: { completed_steps: ['strategy_snapshot', 'eligibility_assessed'], next_action: 'human_strategy_decision' },
  });
  const candidateEntry = artifactBySource(
    snapshotPlan, `runs/${config.run_ref}/${ruleOutputs.candidate}`,
  );
  return {
    assessment_ref: data.id, assessment_path: config.waiting.path,
    assessment_file_sha256: sha256(await bytesWithin(root, config.waiting.path)),
    assessment_status: data.status, eligibility_result: data.eligibility_result,
    run_ref: config.run_ref,
    strategy_snapshot_version: {
      ref: config.snapshot_ref, version: '1.0.0', fingerprint: snapshotPlan.manifest.fingerprint,
    },
    rules: {
      eligibility: { id: eligibilityRule.id, version: eligibilityRule.version, path: ruleOutputs.eligibility, sha256: eligibilityEntry.snapshot_sha256 },
      candidate_generator: { id: candidateRule.id, version: candidateRule.version, path: ruleOutputs.candidate, sha256: candidateEntry.snapshot_sha256 },
    },
    action: materialized.action,
  };
}

export async function decideStrategy({ root, decisionPath }) {
  const decision = await jsonWithin(root, decisionPath, 'strategy decision');
  fixtureDecision(decision, 'strategy_assessment');
  const waiting = await findStrategyCanonical(
    root, decision.subject_version?.ref, 'strategy_assessment',
  );
  assertPin(decision.subject_version, waiting);
  const loaded = await recomputeAssessment(root, waiting.data);
  if (!same(decision.strategy_snapshot_version, {
    ref: loaded.cis.data.id, version: loaded.cis.data.version,
    fingerprint: loaded.cis.data.manifest.fingerprint,
  })) fail('STRATEGY_DECISION_INPUT_DRIFT', 'decision strategy CIS pin 不匹配');
  const data = buildDecidedStrategyAssessment({
    waiting: waiting.data, id: decision.target.id, decision: decision.decision,
    approval: decision.approval, updatedAt: decision.approval?.approved_at,
  });
  const result = await materializeStrategyAssessment({
    workspace: root, path: decision.target.path, data,
  });
  await transitionRun({
    workspace: root, runId: loaded.cis.data.run_ref, status: 'running',
    now: decision.approval.approved_at,
    patch: { completed_steps: ['strategy_snapshot', 'eligibility_assessed', 'strategy_decided'], next_action: 'propose_dimension_candidate' },
  });
  return {
    assessment_ref: data.id, assessment_path: decision.target.path,
    assessment_file_sha256: sha256(await bytesWithin(root, decision.target.path)),
    assessment_status: data.status, decision: data.decision,
    run_ref: loaded.cis.data.run_ref,
    strategy_snapshot_version: decision.strategy_snapshot_version,
    action: result.action,
  };
}

function dimensionBasis(snapshot, assessment) {
  const reviews = assessment.eligibility_inputs.review_entry_keys
    .map((key) => snapshot.entries.get(key)).filter(Boolean);
  const samples = new Map([...snapshot.entries.values()]
    .filter((item) => item.data.record_type === 'answer_sample')
    .map((item) => [item.data.id, item.data]));
  return {
    platforms: [...new Set(reviews.map((item) => samples.get(item.data.sample_ref)?.platform).filter(Boolean))].sort(compareUtf8),
    query_clusters: [assessment.eligibility_checks.repeated_dimension.dimension_key],
    supporting_observations: reviews.map((item) => `冻结 Review ${item.data.id} 明确记录该维度。`).sort(compareUtf8),
    counter_observations: ['未接入真实业务或市场观察。'],
    unresolved_conflicts: [],
  };
}

export async function createDimensionCandidate({ root, config }) {
  const assessment = await objectWithin(root, config.assessment_path, {
    id: config.assessment_ref, type: 'strategy_assessment', status: 'decided',
  });
  if (assessment.data.decision !== 'proceed') fail('DECISION_DIMENSION_APPROVAL_REQUIRED', 'STA 未决定 proceed');
  const loaded = await recomputeAssessment(root, assessment.data);
  const data = {
    id: config.id, record_type: 'decision_dimension', status: 'candidate', version: '1.0.0',
    created_at: assessment.data.updated_at, updated_at: assessment.data.updated_at,
    title: `测试商户 Decision Dimension: ${assessment.data.eligibility_checks.repeated_dimension.dimension_key}`,
    test_scope: { ...assessment.data.test_scope }, merchant_ref: assessment.data.merchant_ref,
    strategy_assessment_version: { ref: assessment.data.id, version: assessment.data.version },
    strategy_input_snapshot_version: { ...assessment.data.strategy_input_snapshot_version },
    label: assessment.data.eligibility_checks.repeated_dimension.dimension_key,
    definition: config.definition,
    query_entry_keys: assessment.data.eligibility_checks.repeated_dimension.query_entry_keys,
    review_entry_keys: assessment.data.eligibility_inputs.review_entry_keys,
    evidence_entry_keys: assessment.data.eligibility_inputs.evidence_entry_keys,
    finding_entry_keys: assessment.data.eligibility_inputs.finding_entry_keys,
    product_gap_entry_key: assessment.data.eligibility_inputs.product_gap_entry_key,
    product_gap_identity: assessment.data.eligibility_inputs.product_gap_identity,
    basis: dimensionBasis(loaded.snapshot, assessment.data),
  };
  const result = await materializeDecisionDimension({ workspace: root, path: config.path, data });
  return {
    dimension_ref: data.id, dimension_path: config.path, dimension_status: data.status,
    dimension_file_sha256: sha256(await bytesWithin(root, config.path)),
    strategy_snapshot_version: {
      ref: loaded.cis.data.id, version: loaded.cis.data.version,
      fingerprint: loaded.cis.data.manifest.fingerprint,
    },
    action: result.action,
  };
}

export async function advanceDimension({ root, decisionPath }) {
  const decision = await jsonWithin(root, decisionPath, 'dimension decision');
  fixtureDecision(decision, 'decision_dimension_transition');
  const prior = await objectWithin(root, decision.subject_path, {
    id: decision.subject_version?.ref, type: 'decision_dimension',
  });
  assertPin(decision.subject_version, prior);
  const assessment = await findStrategyCanonical(
    root, prior.data.strategy_assessment_version.ref, 'strategy_assessment',
  );
  const loaded = await recomputeAssessment(root, assessment.data);
  const snapshotVersion = {
    ref: loaded.cis.data.id, version: loaded.cis.data.version,
    fingerprint: loaded.cis.data.manifest.fingerprint,
  };
  if (!same(decision.strategy_snapshot_version, snapshotVersion)) {
    fail('STRATEGY_DECISION_INPUT_DRIFT', 'DDM decision strategy CIS pin 不匹配');
  }
  const data = buildDecisionDimensionSuccessor({
    prior: prior.data, id: decision.target.id, status: decision.target.status,
    decision: decision.decision, updatedAt: decision.decision.decided_at,
  });
  const result = await materializeDecisionDimension({
    workspace: root, path: decision.target.path, data, prior: prior.data,
  });
  return {
    dimension_ref: data.id, dimension_path: decision.target.path, dimension_status: data.status,
    dimension_file_sha256: sha256(await bytesWithin(root, decision.target.path)),
    strategy_snapshot_version: snapshotVersion, action: result.action,
  };
}

export async function assembleStrategyOutput({ root, config }) {
  const assessment = await objectWithin(root, config.assessment_path, {
    id: config.assessment_ref, type: 'strategy_assessment', status: 'decided',
  });
  const loaded = await recomputeAssessment(root, assessment.data);
  const dimensions = await Promise.all(config.dimension_paths.map((item, index) =>
    objectWithin(root, item, { id: config.dimension_refs[index], type: 'decision_dimension', status: 'decision_factor' })));
  if (dimensions.length === 0 || dimensions.some((item) =>
    !same(item.data.product_gap_identity, assessment.data.eligibility_inputs.product_gap_identity)
    || item.data.strategy_assessment_version.ref !== assessment.data.id)) {
    fail('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', 'STO 的 factor DDM 与 STA/CIS 不一致');
  }
  const body = (await bytesWithin(root, config.body_path)).toString('utf8');
  const artifactContents = new Map();
  const artifacts = [];
  for (const artifact of config.artifacts) {
    const bytes = await bytesWithin(root, artifact.source_path);
    artifactContents.set(artifact.role, bytes);
    artifacts.push({ role: artifact.role, path: artifact.path, sha256: sha256(bytes), media_type: 'text/markdown' });
  }
  const data = {
    id: config.id, record_type: 'strategy_output', status: 'draft', version: '1.0.0',
    created_at: assessment.data.updated_at, updated_at: assessment.data.updated_at,
    title: '测试商户战略建议', test_scope: { ...assessment.data.test_scope },
    merchant_ref: assessment.data.merchant_ref,
    strategy_assessment_version: { ref: assessment.data.id, version: assessment.data.version },
    strategy_input_snapshot_version: { ...assessment.data.strategy_input_snapshot_version },
    run_ref: loaded.cis.data.run_ref,
    decision_dimension_versions: dimensions.map((item) => ({ ref: item.data.id, version: item.data.version })),
    product_gap_entry_key: assessment.data.eligibility_inputs.product_gap_entry_key,
    product_gap_identity: assessment.data.eligibility_inputs.product_gap_identity,
    opportunity: {
      statement: config.opportunity_statement,
      supporting_evidence_entry_keys: assessment.data.eligibility_inputs.evidence_entry_keys,
      counter_evidence_entry_keys: [], limitations: config.limitations,
    },
    artifacts, validation_plan_contract: config.validation_plan_contract,
    body_sha256: sha256(body), artifact_manifest_fingerprint: strategyArtifactFingerprint(artifacts),
  };
  const result = await materializeStrategyOutput({ workspace: root, path: config.path, data, body, artifactContents });
  await transitionRun({
    workspace: root, runId: data.run_ref, status: 'completed', now: data.updated_at,
    businessResult: 'inconclusive',
    patch: { completed_steps: ['strategy_snapshot', 'eligibility_assessed', 'strategy_decided', 'dimension_factor_decided', 'strategy_output'], next_action: 'fixture_human_validation' },
  });
  return {
    strategy_output_ref: data.id, strategy_output_path: config.path,
    strategy_output_file_sha256: sha256(await bytesWithin(root, config.path)),
    run_ref: data.run_ref,
    strategy_snapshot_version: {
      ref: loaded.cis.data.id, version: loaded.cis.data.version,
      fingerprint: loaded.cis.data.manifest.fingerprint,
    },
    dimension_refs: dimensions.map((item) => item.data.id), action: result.action,
  };
}
