import { readFile } from 'node:fs/promises';

import { loadSnapshotGraph } from './cycle-snapshot.mjs';
import { serializeMarkdownObject } from './object-contract.mjs';
import { preflightTestKnowledgeWrite } from './workspace-scope.mjs';
import {
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class StrategyAssessmentError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'StrategyAssessmentError';
    this.code = code;
    Object.assign(this, details);
  }
}

function entry(snapshot, key) {
  return snapshot?.entries?.get(key) ?? null;
}

function entriesByType(snapshot, recordType) {
  return [...(snapshot?.entries?.values?.() ?? [])]
    .filter((item) => item.data?.record_type === recordType);
}

function sameIdentity(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function identityOf(item) {
  if (!item?.data) return null;
  return {
    object_id: item.data.id,
    record_type: item.data.record_type,
    object_version: item.data.version,
    file_sha256: item.file_sha256,
  };
}

function diagnostic(code, details = {}) {
  return { code, ...details };
}

export function validateStrategyProductGap({ snapshot, entryKey, identity }) {
  const errors = [];
  const item = entry(snapshot, entryKey);
  if (!item || item.data?.record_type !== 'finding'
      || item.data?.diagnosis_class !== 'product_gap') {
    errors.push(diagnostic('PRODUCT_GAP_NOT_M4_OPEN', { entry_key: entryKey }));
    return { errors };
  }
  if (item.data.status !== 'open') {
    errors.push(diagnostic('PRODUCT_GAP_NOT_M4_OPEN', { entry_key: entryKey }));
  }
  if (!item.data.approval) {
    errors.push(diagnostic('PRODUCT_GAP_HUMAN_REVIEW_REQUIRED', { entry_key: entryKey }));
  }
  if (!sameIdentity(identityOf(item), identity)) {
    errors.push(diagnostic('GOAL_CANDIDATE_STRATEGY_GATE_MISMATCH', {
      entry_key: entryKey,
      expected: identity,
      actual: identityOf(item),
    }));
  }
  const supporting = new Set(item.data.gap_basis?.supporting_evidence_refs ?? []);
  const evidenceById = new Map(entriesByType(snapshot, 'evidence')
    .map((evidence) => [evidence.data.id, evidence.data]));
  const supportObjects = [...supporting].map((ref) => evidenceById.get(ref)).filter(Boolean);
  const hasDemand = supportObjects.some((evidence) =>
    ['user', 'independent'].includes(evidence.support_kind)
    || ['user', 'user_data', 'independent_third_party']
      .includes(evidence.extensions?.['geo.evidence_category']));
  const hasCapability = supportObjects.some((evidence) =>
    evidence.support_kind === 'first_party'
    || evidence.extensions?.['geo.evidence_category'] === 'first_party');
  if ((item.data.evidence_refs ?? []).length === 0 || supporting.size < 2
      || !hasDemand || !hasCapability) {
    errors.push(diagnostic('PRODUCT_GAP_SUPPORT_MISSING', { entry_key: entryKey }));
  }
  return { errors };
}

function normalizeDimension(value) {
  if (typeof value !== 'string') return '';
  return value.normalize('NFC').trim().replace(/[A-Z]/g, (letter) => letter.toLowerCase());
}

function reviewFacts(snapshot, reviewKeys) {
  const queryEntries = entriesByType(snapshot, 'query');
  const sampleEntries = entriesByType(snapshot, 'answer_sample');
  const queryById = new Map(queryEntries.map((item) => [item.data.id, item]));
  const sampleById = new Map(sampleEntries.map((item) => [item.data.id, item]));
  const reviews = reviewKeys.map((key) => ({ key, item: entry(snapshot, key) }));
  const eligibleReviews = reviews.filter(({ item }) =>
    item?.data?.record_type === 'answer_review' && item.data.status === 'reviewed');
  const occurrences = new Map();
  const queryKeys = new Set();
  const queryIds = new Set();
  const platforms = new Set();
  for (const { item } of eligibleReviews) {
    for (const candidate of item.data.exploratory?.decision_dimension_candidates ?? []) {
      const normalized = normalizeDimension(candidate);
      if (normalized) occurrences.set(normalized, (occurrences.get(normalized) ?? 0) + 1);
    }
    const sample = sampleById.get(item.data.sample_ref)?.data;
    if (!sample) continue;
    if (sample.platform) platforms.add(sample.platform);
    const query = queryById.get(sample.query_ref);
    if (query?.data?.status === 'formal') {
      queryIds.add(query.data.id);
      queryKeys.add(query.entry_key);
    }
  }
  const repeated = [...occurrences.entries()]
    .filter(([, count]) => count >= 2)
    .sort(([left], [right]) => Buffer.compare(Buffer.from(left), Buffer.from(right)))[0]?.[0] ?? '';
  return {
    eligibleReviews,
    repeated,
    queryKeys: [...queryKeys].sort(),
    queryIds,
    platforms,
  };
}

function evidenceFacts(snapshot, keys, requestedScope, invokedAt) {
  const accepted = [];
  const rejected = [];
  for (const key of keys) {
    const item = entry(snapshot, key);
    const data = item?.data;
    const category = data?.extensions?.['geo.evidence_category'];
    const allowedKind = ['user', 'independent'].includes(data?.support_kind)
      || (data?.support_kind === 'first_party' && ['user_data', 'first_party_user_data'].includes(category))
      || ['user', 'user_data', 'independent_third_party'].includes(category);
    const asOfValid = data?.captured_at && Date.parse(data.captured_at) <= Date.parse(invokedAt);
    if (data?.record_type === 'evidence' && data.status === 'approved' && data.approval
        && allowedKind && data.scope === requestedScope && asOfValid) {
      accepted.push(key);
    } else {
      rejected.push(key);
    }
  }
  return { accepted, rejected };
}

function findingFacts(snapshot, keys, productGapKey) {
  const items = keys.map((key) => ({ key, item: entry(snapshot, key) }));
  const open = items.filter(({ item }) =>
    item?.data?.record_type === 'finding' && item.data.status === 'open' && item.data.approval);
  const product = open.find(({ key, item }) =>
    key === productGapKey && item.data.diagnosis_class === 'product_gap');
  const sharesScope = ({ item }) => {
    if (!product) return false;
    return ['query_refs', 'claim_refs', 'asset_refs'].some((field) => {
      const expected = new Set(product.item.data[field] ?? []);
      return (item.data[field] ?? []).some((ref) => expected.has(ref));
    });
  };
  return {
    content: open.filter(({ item }) => item.data.diagnosis_class === 'content_gap')
      .filter(sharesScope).map(({ key }) => key),
    evidence: open.filter(({ item }) => item.data.diagnosis_class === 'evidence_gap')
      .filter(sharesScope).map(({ key }) => key),
    product: open.filter(({ key, item }) =>
      key === productGapKey && item.data.diagnosis_class === 'product_gap').map(({ key }) => key),
  };
}

function checkState(pass, fail = false) {
  if (pass) return 'pass';
  return fail ? 'fail' : 'insufficient';
}

export async function loadStrategySnapshot({ workspace, plan }) {
  if (plan?.snapshot?.kind !== 'strategy') {
    throw new StrategyAssessmentError(
      'STRATEGY_TRIGGER_CHECK_INCOMPLETE',
      'M7 只能读取 M6 snapshot_kind:strategy CIS',
      { created_paths: [] },
    );
  }
  const history = await loadSnapshotGraph({ workspace, plan });
  const entries = new Map();
  for (const sourceEntry of plan.source_entries) {
    const object = history.byId.get(sourceEntry.object_id);
    if (!object) {
      throw new StrategyAssessmentError(
        'STRATEGY_TRIGGER_CHECK_INCOMPLETE',
        'strategy CIS source entry copy 缺失',
        { entry_key: sourceEntry.entry_key, created_paths: [] },
      );
    }
    entries.set(sourceEntry.entry_key, {
      entry_key: sourceEntry.entry_key,
      file_sha256: sourceEntry.file_sha256,
      data: object.data,
      content: object.content,
      snapshot_path: object.snapshot_path,
    });
  }
  const artifactEntries = new Map();
  for (const artifact of plan.artifact_entries) {
    const relative = `runs/${plan.run_ref}/${artifact.snapshot_path}`;
    const bytes = await readFile(resolveWithin(workspace, relative));
    if (sha256(bytes) !== artifact.snapshot_sha256) {
      throw new StrategyAssessmentError(
        'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
        'strategy CIS artifact copy checksum 不一致',
        { entry_key: artifact.entry_key, created_paths: [] },
      );
    }
    artifactEntries.set(artifact.entry_key, {
      ...artifact,
      bytes,
      snapshot_path: relative,
    });
  }
  return {
    snapshot_id: plan.snapshot.id,
    snapshot_kind: 'strategy',
    fingerprint: plan.manifest.fingerprint,
    entries,
    artifact_entries: artifactEntries,
    source: history.source,
  };
}

export async function assessStrategyEligibility({ snapshot, input }) {
  if (!input?.human_invocation?.decision_ref) {
    throw new StrategyAssessmentError(
      'STRATEGY_HUMAN_TRIGGER_REQUIRED',
      'Strategy eligibility 需要显式人工 invocation',
      { created_paths: [] },
    );
  }
  if (input.eligibility_checks || input.eligibility_result) {
    throw new StrategyAssessmentError(
      'STRATEGY_ELIGIBILITY_SELF_REPORT_FORBIDDEN',
      '调用方不得自报 Strategy eligibility 结果',
      { created_paths: [] },
    );
  }
  if (snapshot?.snapshot_kind !== 'strategy') {
    throw new StrategyAssessmentError(
      'STRATEGY_TRIGGER_CHECK_INCOMPLETE',
      'eligibility 只读取 strategy CIS',
      { created_paths: [] },
    );
  }
  if (!snapshot.artifact_entries?.has(input.eligibility_rule_entry_key)) {
    throw new StrategyAssessmentError(
      'STRATEGY_TRIGGER_CHECK_INCOMPLETE',
      'strategy CIS 未冻结 eligibility rule artifact',
      { created_paths: [] },
    );
  }
  const gap = validateStrategyProductGap({
    snapshot,
    entryKey: input.product_gap_entry_key,
    identity: input.product_gap_identity,
  });
  const reviews = reviewFacts(snapshot, input.review_entry_keys ?? []);
  const evidence = evidenceFacts(
    snapshot,
    input.evidence_entry_keys ?? [],
    input.human_invocation.requested_scope,
    input.human_invocation.invoked_at,
  );
  const findings = findingFacts(
    snapshot,
    input.finding_entry_keys ?? [],
    input.product_gap_entry_key,
  );
  const hasIndependentImpact = reviews.queryIds.size >= 2 || reviews.platforms.size >= 2;
  const checks = {
    repeated_dimension: {
      state: checkState(Boolean(reviews.repeated) && hasIndependentImpact),
      dimension_key: reviews.repeated,
      query_entry_keys: reviews.queryKeys,
      review_entry_keys: (input.review_entry_keys ?? []).filter((key) => entry(snapshot, key)),
    },
    user_interest_evidence: {
      state: checkState(evidence.accepted.length > 0, evidence.rejected.length > 0),
      evidence_entry_keys: evidence.accepted,
    },
    comparison_impact: {
      state: checkState(hasIndependentImpact),
      evidence_entry_keys: evidence.accepted,
      review_entry_keys: (input.review_entry_keys ?? []).filter((key) => entry(snapshot, key)),
    },
    content_evidence_fix_insufficient: {
      state: checkState(
        gap.errors.length === 0
        && findings.product.length === 1
        && (findings.content.length > 0 || findings.evidence.length > 0),
        gap.errors.length > 0,
      ),
      finding_entry_keys: [
        ...findings.content,
        ...findings.evidence,
        ...findings.product,
      ],
    },
  };
  const states = Object.values(checks).map((item) => item.state);
  const eligibilityResult = states.every((state) => state === 'pass')
    ? 'eligible'
    : states.some((state) => state === 'fail') ? 'ineligible' : 'insufficient';
  return {
    eligibility_checks: checks,
    eligibility_result: eligibilityResult,
    warnings: eligibilityResult === 'eligible' ? [] : [{ code: 'STRATEGY_NEEDS_EVIDENCE' }],
    created_paths: [],
  };
}

export async function assessStrategyFromCycleSnapshot({ workspace, plan, input }) {
  const snapshot = await loadStrategySnapshot({ workspace, plan });
  return assessStrategyEligibility({ snapshot, input });
}

export function buildWaitingStrategyAssessment({ context, input, result, eligibilityRule }) {
  if (!input?.human_invocation?.decision_ref || !eligibilityRule) {
    throw new StrategyAssessmentError(
      'STRATEGY_TRIGGER_CHECK_INCOMPLETE',
      'waiting Strategy Assessment 输入不完整',
      { created_paths: [] },
    );
  }
  return {
    id: context.id,
    record_type: 'strategy_assessment',
    status: 'waiting_human',
    version: '1.0.0',
    created_at: context.created_at,
    updated_at: context.created_at,
    title: 'Synthetic Strategy Assessment',
    test_scope: { ...context.test_scope },
    merchant_ref: context.merchant_ref,
    cycle_review_ref: context.cycle_review_ref,
    cycle_review_version: context.cycle_review_version,
    strategy_input_snapshot_version: context.strategy_input_snapshot_version,
    human_invocation: input.human_invocation,
    eligibility_inputs: {
      review_entry_keys: input.review_entry_keys,
      evidence_entry_keys: input.evidence_entry_keys,
      finding_entry_keys: input.finding_entry_keys,
      product_gap_entry_key: input.product_gap_entry_key,
      product_gap_identity: input.product_gap_identity,
    },
    eligibility_checks: result.eligibility_checks,
    eligibility_result: result.eligibility_result,
    eligibility_rule: eligibilityRule,
    decision: 'pending',
  };
}

export function buildDecidedStrategyAssessment({ waiting, id, decision, approval, updatedAt }) {
  if (!waiting || waiting.status !== 'waiting_human' || id === waiting.id || !approval
      || decision === 'pending'
      || (decision === 'proceed'
        && (waiting.eligibility_result !== 'eligible'
          || Object.values(waiting.eligibility_checks).some((item) => item.state !== 'pass')))) {
    throw new StrategyAssessmentError(
      'STRATEGY_TRIGGER_CHECK_INCOMPLETE',
      'Strategy Assessment 人工决定不满足门禁',
      { created_paths: [] },
    );
  }
  return {
    ...waiting,
    id,
    status: 'decided',
    updated_at: updatedAt ?? waiting.updated_at,
    decision,
    approval,
    supersedes_ref: waiting.id,
  };
}

export async function materializeStrategyAssessment({ workspace, path, data }) {
  const body = '# Synthetic Strategy Assessment\n';
  await preflightTestKnowledgeWrite({
    workspace,
    data,
    body,
    manifest: {
      eligibility_result: data.eligibility_result,
      eligibility_rule: data.eligibility_rule,
    },
  });
  return writeCreateOnly(workspace, path, serializeMarkdownObject(data, body), {
    idempotent: true,
    conflictCode: 'STRATEGY_ASSESSMENT_CONFLICT',
  });
}
