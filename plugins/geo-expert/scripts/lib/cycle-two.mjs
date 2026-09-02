import path from 'node:path';

import { traceCycle } from './cycle-trace.mjs';
import { stableStringify } from './workspace-paths.mjs';

const EXPECTED_STAGES = Object.freeze([
  'baseline_recorded',
  'diagnosis_ready',
  'adoption_decided',
  'publication_confirmed',
  'technical_retest_completed',
  'answer_retest_completed',
  'analytics_recorded',
  'review_waiting_human',
  'review_decided',
]);
const REQUIRED_SOURCE_TYPES = Object.freeze([
  'perception_goal', 'query', 'query_set', 'document', 'claim', 'answer_card',
  'knowledge_release', 'evidence', 'source', 'asset', 'collector_profile',
]);

export class CycleTwoError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CycleTwoError';
    this.code = code;
    Object.assign(this, details);
  }
}

function semver(value) {
  return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(value ?? '');
}

function versionRef(value, prefix) {
  return value && new RegExp(`^${prefix}-(?:[A-Z0-9]+-)*[A-Z0-9]+$`).test(value.ref)
    && semver(value.version);
}

function contaminated(value) {
  if (typeof value === 'string') {
    return /(?:^|[\\/])workspaces[\\/]myyshop(?:[\\/]|$)/i.test(value)
      || /\b(?:CLM|EVD|SRC|Q|QS|KR|ANS|AST|RUN|GOAL)-MYYSHOP-(?!DEVTEST-)[A-Z0-9-]+\b/.test(value)
      || /(?:^|-)REAL(?:-|$)/i.test(value);
  }
  if (Array.isArray(value)) return value.some(contaminated);
  return Boolean(value && typeof value === 'object' && Object.values(value).some(contaminated));
}

function independentGoalApproval(plan) {
  const approval = plan.new_goal?.approval;
  if (!approval?.approved_by || !approval?.approved_at || !approval?.decision_ref) return false;
  if (/cycle[-_ ]?one|m6/i.test(approval.decision_ref)) return false;
  const otherRefs = [
    plan.predecessor_review_version?.ref,
    plan.goal_selection_version?.ref,
    plan.selected_candidate_version?.ref,
  ];
  return !otherRefs.includes(approval.decision_ref);
}

function sourceClosureValid(plan) {
  const objects = plan?.source_objects ?? [];
  const byType = new Map(objects.map((item) => [item.data?.record_type, item]));
  if (REQUIRED_SOURCE_TYPES.some((type) => !byType.has(type))) return false;
  if (new Set(objects.map((item) => item.data?.id)).size !== objects.length) return false;
  const paths = new Set(plan.source_paths ?? []);
  if (objects.some((item) => !paths.has(item.path))) return false;
  const goal = byType.get('perception_goal')?.data;
  const query = byType.get('query')?.data;
  const querySet = byType.get('query_set')?.data;
  const release = byType.get('knowledge_release')?.data;
  const profile = byType.get('collector_profile')?.data;
  const asset = byType.get('asset')?.data;
  const contracts = new Set((plan.artifact_paths ?? []).map((item) => item.role));
  return goal?.id === plan.new_goal.id
    && goal.status === 'approved' && query?.status === 'formal'
    && querySet?.status === 'frozen' && release?.status === 'published'
    && release?.readiness === 'ready' && profile?.status === 'frozen'
    && profile?.sampling_count === 2 && asset?.status === 'active'
    && contracts.has('measurement_contract')
    && contracts.has('signal_rule')
    && contracts.has('sensitive_data_policy');
}

export function validateCycleTwoBinding(plan) {
  const errors = [];
  if (!plan || plan.cycle_number !== 2) {
    errors.push({ code: 'CYCLE_TWO_PREDECESSOR_MISMATCH', field: 'cycle_number' });
  }
  if (!versionRef(plan?.predecessor_review_version, 'CRV')) {
    errors.push({ code: 'CYCLE_ONE_REVIEW_REQUIRED' });
  }
  if (!versionRef(plan?.goal_selection_version, 'GSEL')) {
    errors.push({ code: 'GOAL_SELECTION_REQUIRED' });
  }
  if (!versionRef(plan?.selected_candidate_version, 'GCD')) {
    errors.push({ code: 'GOAL_SELECTION_REQUIRED', field: 'selected_candidate_version' });
  }
  if (!plan?.new_goal?.id?.startsWith('GOAL-')
      || !plan.new_goal.path
      || !plan.new_goal.statement
      || !plan.new_goal.success_question
      || !plan.new_goal.query_cluster_key
      || !independentGoalApproval(plan)) {
    errors.push({ code: 'GOAL_SELECTION_APPROVAL_REQUIRED', field: 'new_goal.approval' });
  }
  if (!sourceClosureValid(plan)) {
    errors.push({ code: 'CYCLE_INPUT_NOT_READY', field: 'source_objects' });
  }
  if (plan?.network_access !== false || plan?.real_execution_authorized !== false) {
    errors.push({ code: 'STRATEGY_AUTO_TRIGGER_FORBIDDEN' });
  }
  if (stableStringify(plan?.stages ?? []) !== stableStringify(EXPECTED_STAGES)) {
    errors.push({ code: 'CYCLE_GATE_REQUIRED', field: 'stages' });
  }
  if (contaminated(plan)) {
    errors.push({ code: 'SYNTHETIC_REAL_REF_CONTAMINATION' });
  }
  return { errors };
}

export function buildCycleTwoFreezeInputPlan(plan) {
  const checked = validateCycleTwoBinding(plan);
  if (checked.errors.length > 0) {
    throw new CycleTwoError(checked.errors[0].code, 'Cycle 2 freeze 输入不合法', {
      diagnostics: checked.errors,
    });
  }
  return {
    schema_version: 'm7-cycle-two-freeze-input/1.0.0',
    snapshot_kind: 'freeze',
    snapshot_id: plan.snapshot_id,
    merchant_ref: plan.merchant_ref,
    knowledge_base_ref: plan.knowledge_base_ref,
    cycle_id: plan.cycle_id,
    cycle_number: 2,
    cycle_path: plan.cycle_path,
    run_id: plan.run_id,
    predecessor_review_version: plan.predecessor_review_version,
    goal_selection_version: plan.goal_selection_version,
    selected_candidate_version: plan.selected_candidate_version,
    new_goal: {
      id: plan.new_goal.id,
      path: plan.new_goal.path,
      status: 'approved',
      goal_statement: plan.new_goal.statement,
      success_question: plan.new_goal.success_question,
      query_cluster_key: plan.new_goal.query_cluster_key,
      approval: plan.new_goal.approval,
    },
    source_paths: [
      ...(plan.source_paths ?? []),
      plan.new_goal.path,
    ].filter((value, index, values) => values.indexOf(value) === index),
    artifact_paths: plan.artifact_paths ?? [],
    network_access: false,
  };
}

export function prepareCycleTwoInputs(plan) {
  const checked = validateCycleTwoBinding(plan);
  if (checked.errors.length > 0) {
    throw new CycleTwoError(checked.errors[0].code, 'Cycle 2 绑定不完整', {
      diagnostics: checked.errors,
    });
  }
  return {
    ...structuredClone(plan),
    freeze_input_plan: buildCycleTwoFreezeInputPlan(plan),
    lifecycle_commands: ['propose-cycle-two', 'apply-goal-selection'],
    auto_selected: false,
    auto_approved: false,
  };
}

export function validateCycleTwoRecoveryPlan(plan) {
  const errors = [];
  if (plan?.schema_version !== 'm7-cycle-two-recovery/1.0.0'
      || !/^[a-f0-9]{64}$/.test(plan.plan_sha256 ?? '')
      || plan.plan_sha256 !== plan.frozen_plan_sha256) {
    errors.push({ code: 'GOAL_CANDIDATE_INPUT_DRIFT' });
  }
  if (!path.isAbsolute(plan?.workspace ?? '')
      || /(?:^|[\\/])workspaces[\\/]myyshop(?:[\\/]|$)/i.test(plan.workspace ?? '')) {
    errors.push({ code: 'REAL_WORKSPACE_WRITE_FORBIDDEN' });
  }
  if (!/^CRV-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(plan?.predecessor_review_ref ?? '')
      || !/^GSEL-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(plan?.selection_ref ?? '')
      || contaminated([plan?.predecessor_review_ref, plan?.selection_ref])) {
    errors.push({ code: 'SYNTHETIC_REAL_REF_CONTAMINATION' });
  }
  for (const step of plan?.completed_steps ?? []) {
    if (!/^[a-f0-9]{64}$/.test(plan.step_proofs?.[step] ?? '')) {
      errors.push({ code: 'GOAL_CANDIDATE_BATCH_INCOMPLETE', step });
    }
  }
  return { errors };
}

export async function resumeCycleTwoMaterialization(plan) {
  const checked = validateCycleTwoRecoveryPlan(plan);
  if (checked.errors.length > 0) {
    throw new CycleTwoError(checked.errors[0].code, 'Cycle 2 恢复计划不合法', {
      diagnostics: checked.errors,
    });
  }
  return {
    action: 'resumed',
    plan_sha256: plan.plan_sha256,
    completed_steps: [...plan.completed_steps],
    next_action: 'continue_from_first_unproved_step',
    network_accessed: false,
    written_paths: [],
  };
}

export async function runSyntheticCycleTwo({ workspace, plan, lifecycleAdapter = null }) {
  const prepared = prepareCycleTwoInputs(plan);
  if (lifecycleAdapter) {
    for (const stage of prepared.stages) {
      await lifecycleAdapter.advance({ workspace, plan: prepared, stage });
    }
  }
  const trace = await traceCycle({ workspace, cycleId: prepared.cycle_id });
  if (trace.errors?.length > 0 || trace.status !== 'completed') {
    throw new CycleTwoError('CYCLE_GATE_REQUIRED', 'Cycle 2 尚未完成完整九门', {
      diagnostics: trace.errors ?? [],
    });
  }
  return {
    status: 'completed',
    completion_scope: trace.completion_scope,
    stages: prepared.stages,
    trace: { ...trace, real_myyshop_impact: false },
    network_accessed: false,
  };
}
