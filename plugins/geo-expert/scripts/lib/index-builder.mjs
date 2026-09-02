import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import {
  ObjectContractError,
  RECORD_TYPES,
  readMarkdownObject,
} from './object-contract.mjs';
import {
  atomicWrite,
  compareUtf8,
  sha256,
  stableStringify,
  walkMarkdownFiles,
} from './workspace-paths.mjs';

const INDEX_NAMES = {
  query: 'queries.json',
  claim: 'claims.json',
  source: 'sources.json',
  evidence: 'evidence.json',
  finding: 'findings.json',
  asset: 'assets.json',
  run: 'runs.json',
  cycle: 'cycles.json',
  document: 'documents.json',
  answer_card: 'answer-cards.json',
  knowledge_release: 'knowledge-releases.json',
  query_set: 'query-sets.json',
  evidence_plan: 'evidence-plans.json',
  perception_goal: 'perception-goals.json',
  asset_proposal: 'asset-proposals.json',
  adoption_record: 'adoption-records.json',
  asset_publication: 'asset-publications.json',
  collector_profile: 'collector-profiles.json',
  answer_sample: 'answer-samples.json',
  citation_observation: 'citation-observations.json',
  source_classification: 'source-classifications.json',
  claim_support_review: 'claim-support-reviews.json',
  answer_review: 'answer-reviews.json',
  answer_aggregation: 'answer-aggregations.json',
  merchant: 'merchants.json',
  brand_knowledge_base: 'brand-knowledge-bases.json',
  cycle_input_snapshot: 'cycle-input-snapshots.json',
  cycle_transition: 'cycle-transitions.json',
  analytics_observation: 'analytics-observations.json',
  business_signal: 'business-signals.json',
  cycle_review: 'cycle-reviews.json',
  strategy_assessment: 'strategy-assessments.json',
  decision_dimension: 'decision-dimensions.json',
  cycle_goal_candidate_batch: 'cycle-goal-candidate-batches.json',
  cycle_goal_candidate: 'cycle-goal-candidates.json',
  cycle_goal_selection: 'cycle-goal-selections.json',
  strategy_output: 'strategy-outputs.json',
  lifecycle_readiness_report: 'lifecycle-readiness-reports.json',
  conformance_profile: 'conformance-profiles.json',
  conformance_result: 'conformance-results.json',
};
const EXTENDED_INDEX_TYPES = new Set([
  'document', 'answer_card', 'knowledge_release',
  'query_set', 'evidence_plan', 'perception_goal',
  'asset_proposal', 'adoption_record', 'asset_publication',
  'collector_profile', 'answer_sample', 'citation_observation',
  'source_classification', 'claim_support_review', 'answer_review',
  'answer_aggregation',
  'merchant', 'brand_knowledge_base', 'cycle_input_snapshot', 'cycle_transition',
  'analytics_observation', 'business_signal', 'cycle_review',
  'strategy_assessment', 'decision_dimension', 'cycle_goal_candidate_batch',
  'cycle_goal_candidate', 'cycle_goal_selection', 'strategy_output',
  'lifecycle_readiness_report', 'conformance_profile', 'conformance_result',
]);

const REF_FIELDS = {
  query: { goal_refs: ['perception_goal'], discovery_source_refs: ['source'] },
  claim: {
    evidence_refs: ['evidence'],
    document_refs: ['document'],
    release_refs: ['knowledge_release'],
  },
  source: {},
  evidence: {
    source_refs: ['source'],
    claim_refs: ['claim'],
    independent_support_refs: ['evidence'],
    counter_evidence_refs: ['evidence'],
  },
  finding: {
    query_refs: ['query'],
    claim_refs: ['claim'],
    evidence_refs: ['evidence'],
    asset_refs: ['asset'],
    source_refs: ['source'],
    retest_of_ref: ['finding'],
  },
  asset: {
    source_refs: ['source'],
    goal_refs: ['perception_goal'],
    query_refs: ['query'],
  },
  run: {
    input_refs: RECORD_TYPES,
    finding_refs: ['finding'],
    evidence_refs: ['evidence'],
    asset_refs: ['asset'],
    goal_refs: ['perception_goal'],
    publication_refs: ['asset_publication'],
    retest_of_refs: ['finding'],
    supersedes_ref: ['run'],
    superseded_by_ref: ['run'],
  },
  cycle: {},
  document: { source_refs: ['source'], claim_refs: ['claim'] },
  answer_card: {
    query_refs: ['query'],
    evidence_refs: ['evidence'],
    release_refs: ['knowledge_release'],
  },
  knowledge_release: {},
  query_set: { goal_refs: ['perception_goal'] },
  evidence_plan: {
    claim_refs: ['claim'],
    retest_query_refs: ['query'],
    finding_refs: ['finding'],
    asset_refs: ['asset'],
  },
  perception_goal: { query_set_refs: ['query_set'] },
  asset_proposal: {
    asset_ref: ['asset'],
    goal_refs: ['perception_goal'],
    query_refs: ['query'],
    finding_refs: ['finding'],
    evidence_refs: ['evidence'],
  },
  adoption_record: { proposal_ref: ['asset_proposal'], asset_ref: ['asset'] },
  asset_publication: {
    proposal_ref: ['asset_proposal'],
    adoption_ref: ['adoption_record'],
    asset_ref: ['asset'],
  },
  collector_profile: { supersedes_ref: ['collector_profile'] },
  answer_sample: {
    query_ref: ['query'],
    query_set_ref: ['query_set'],
    collector_profile_ref: ['collector_profile'],
    run_ref: ['run'],
    retry_of_ref: ['answer_sample'],
    publication_refs: ['asset_publication'],
    technical_retest_run_refs: ['run'],
    baseline_aggregation_refs: ['answer_aggregation'],
    supersedes_ref: ['answer_sample'],
  },
  citation_observation: {
    sample_ref: ['answer_sample'],
    source_ref: ['source'],
    supersedes_ref: ['citation_observation'],
  },
  source_classification: {
    source_ref: ['source'],
    citation_refs: ['citation_observation'],
    supersedes_ref: ['source_classification'],
  },
  claim_support_review: {
    citation_ref: ['citation_observation'],
    classification_ref: ['source_classification'],
    claim_ref: ['claim'],
    supersedes_ref: ['claim_support_review'],
  },
  answer_review: {
    sample_ref: ['answer_sample'],
    claim_support_review_refs: ['claim_support_review'],
    supersedes_ref: ['answer_review'],
  },
  answer_aggregation: {
    supersedes_ref: ['answer_aggregation'],
  },
  merchant: { supersedes_ref: ['merchant'] },
  brand_knowledge_base: {
    merchant_ref: ['merchant'],
    supersedes_ref: ['brand_knowledge_base'],
  },
  cycle_input_snapshot: {
    merchant_ref: ['merchant'],
    knowledge_base_ref: ['brand_knowledge_base'],
    cycle_ref: ['cycle'],
    run_ref: ['run'],
    supersedes_ref: ['cycle_input_snapshot'],
  },
  cycle_transition: {
    cycle_ref: ['cycle'],
    goal_ref: ['perception_goal'],
    supersedes_ref: ['cycle_transition'],
  },
  analytics_observation: {
    merchant_ref: ['merchant'],
    cycle_ref: ['cycle'],
    goal_ref: ['perception_goal'],
    run_ref: ['run'],
    supersedes_ref: ['analytics_observation'],
  },
  business_signal: {
    merchant_ref: ['merchant'],
    cycle_ref: ['cycle'],
    goal_ref: ['perception_goal'],
    run_ref: ['run'],
    supersedes_ref: ['business_signal'],
  },
  cycle_review: {
    merchant_ref: ['merchant'],
    cycle_ref: ['cycle'],
    supersedes_ref: ['cycle_review'],
  },
  strategy_assessment: {
    merchant_ref: ['merchant'],
    cycle_review_ref: ['cycle_review'],
    supersedes_ref: ['strategy_assessment'],
  },
  decision_dimension: {
    merchant_ref: ['merchant'],
    supersedes_ref: ['decision_dimension'],
  },
  cycle_goal_candidate_batch: {
    merchant_ref: ['merchant'],
    run_ref: ['run'],
  },
  cycle_goal_candidate: { merchant_ref: ['merchant'] },
  cycle_goal_selection: {
    merchant_ref: ['merchant'],
    supersedes_ref: ['cycle_goal_selection'],
  },
  strategy_output: {
    merchant_ref: ['merchant'],
    run_ref: ['run'],
    supersedes_ref: ['strategy_output'],
  },
  lifecycle_readiness_report: {
    merchant_ref: ['merchant'],
    knowledge_base_ref: ['brand_knowledge_base'],
    goal_ref: ['perception_goal'],
    supersedes_ref: ['lifecycle_readiness_report'],
  },
  conformance_profile: {
    merchant_ref: ['merchant'],
    knowledge_base_ref: ['brand_knowledge_base'],
    supersedes_ref: ['conformance_profile'],
  },
  conformance_result: {
    profile_ref: ['conformance_profile'],
    supersedes_ref: ['conformance_result'],
  },
};

const VERSION_FIELDS = {
  answer_card: [['claim_versions', ['claim']]],
  knowledge_release: [
    ['claim_versions', ['claim']],
    ['answer_card_versions', ['answer_card']],
  ],
  query_set: [['query_versions', ['query']]],
  asset: [
    ['claim_versions', ['claim']],
    ['knowledge_release_versions', ['knowledge_release']],
  ],
  asset_proposal: [
    ['claim_versions', ['claim']],
    ['knowledge_release_versions', ['knowledge_release']],
  ],
  run: [
    ['query_set_versions', ['query_set']],
    ['knowledge_release_versions', ['knowledge_release']],
    ['profile_versions', ['collector_profile']],
  ],
  answer_aggregation: [
    ['profile_versions', ['collector_profile']],
    ['citation_versions', ['citation_observation']],
    ['source_versions', ['source']],
    ['classification_versions', ['source_classification']],
    ['claim_support_review_versions', ['claim_support_review']],
  ],
  business_signal: [['observation_versions', ['analytics_observation']]],
  evidence: [['observation_versions', ['analytics_observation']]],
};

export class IndexValidationError extends Error {
  constructor(diagnostics) {
    super('Workspace object/index 校验失败');
    this.name = 'IndexValidationError';
    this.code = 'INDEX_VALIDATION_FAILED';
    this.diagnostics = diagnostics;
  }
}

function normalizeValues(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

export function collectObjectReferences(data) {
  const refs = [];
  if (data.test_scope?.merchant_ref) {
    refs.push({
      field: 'test_scope.merchant_ref',
      ref: data.test_scope.merchant_ref,
      allowedTypes: ['merchant'],
      version: null,
    });
  }
  if (data.test_scope?.knowledge_base_ref) {
    refs.push({
      field: 'test_scope.knowledge_base_ref',
      ref: data.test_scope.knowledge_base_ref,
      allowedTypes: ['brand_knowledge_base'],
      version: null,
    });
  }
  for (const [field, allowedTypes] of Object.entries(REF_FIELDS[data.record_type] ?? {})) {
    for (const ref of normalizeValues(data[field])) {
      refs.push({ field, ref, allowedTypes, version: null });
    }
  }
  const versionFields = VERSION_FIELDS[data.record_type] ?? [];
  for (const [field, allowedTypes] of versionFields) {
    for (const entry of data[field] ?? []) {
      refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes });
    }
  }
  if (data.record_type === 'cycle') {
    for (const [field, entry] of Object.entries(data.core_versions ?? {})) {
      const allowedTypes = ['knowledge_independent_engineering', 'authorized_real'].includes(data.scope)
        && field === 'input_snapshot'
        ? ['cycle_input_snapshot']
        : RECORD_TYPES;
      refs.push({ field: `core_versions.${field}`, ref: entry.ref, version: entry.version, allowedTypes });
    }
    if (data.merchant_ref) refs.push({ field: 'merchant_ref', ref: data.merchant_ref, version: null, allowedTypes: ['merchant'] });
    if (data.knowledge_base_ref) refs.push({ field: 'knowledge_base_ref', ref: data.knowledge_base_ref, version: null, allowedTypes: ['brand_knowledge_base'] });
    for (const ref of data.transition_refs ?? []) {
      refs.push({ field: 'transition_refs', ref, version: null, allowedTypes: ['cycle_transition'] });
    }
    for (const [field, allowedTypes] of [
      ['cycle_review_version', ['cycle_review']],
      ['predecessor_review_version', ['cycle_review']],
      ['goal_selection_version', ['cycle_goal_selection']],
    ]) {
      const entry = data[field];
      if (entry?.ref) refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes });
    }
    for (const [index, track] of (data.goal_tracks ?? []).entries()) {
      for (const field of ['input_snapshot_version', 'review_input_snapshot_version']) {
        const entry = track[field];
        if (entry?.ref) refs.push({
          field: `goal_tracks[${index}].${field}`,
          ref: entry.ref,
          version: entry.version,
          allowedTypes: ['cycle_input_snapshot'],
        });
      }
      for (const [field, allowedTypes] of [
        ['baseline_aggregation_refs', ['answer_aggregation']],
        ['finding_refs', ['finding']],
        ['evidence_plan_refs', ['evidence_plan']],
        ['asset_proposal_refs', ['asset_proposal']],
        ['adoption_record_refs', ['adoption_record']],
        ['publication_refs', ['asset_publication']],
        ['technical_retest_run_refs', ['run']],
        ['answer_retest_aggregation_refs', ['answer_aggregation']],
        ['analytics_observation_refs', ['analytics_observation']],
        ['business_signal_refs', ['business_signal']],
      ]) {
        for (const ref of track[field] ?? []) refs.push({
          field: `goal_tracks[${index}].${field}`,
          ref,
          version: null,
          allowedTypes,
        });
      }
    }
  }
  if (data.record_type === 'cycle_input_snapshot') {
    for (const field of ['base_freeze_snapshot_version']) {
      const entry = data[field];
      if (entry?.ref) refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes: ['cycle_input_snapshot'] });
    }
    for (const entry of data.pre_review_transition_snapshot_versions ?? []) {
      refs.push({
        field: 'pre_review_transition_snapshot_versions',
        ref: entry.ref,
        version: entry.version,
        allowedTypes: ['cycle_input_snapshot'],
      });
    }
  }
  if (data.record_type === 'cycle_transition') {
    for (const field of ['input_snapshot_version', 'gate_snapshot_version']) {
      const entry = data[field];
      refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes: ['cycle_input_snapshot'] });
    }
  }
  if (data.record_type === 'cycle_review') {
    const entry = data.review_input_snapshot_version;
    refs.push({ field: 'review_input_snapshot_version', ref: entry.ref, version: entry.version, allowedTypes: ['cycle_input_snapshot'] });
  }
  if (data.record_type === 'strategy_assessment') {
    refs.push({
      field: 'cycle_review_version', ref: data.cycle_review_ref,
      version: data.cycle_review_version, allowedTypes: ['cycle_review'],
    });
    const entry = data.strategy_input_snapshot_version;
    refs.push({ field: 'strategy_input_snapshot_version', ref: entry.ref, version: entry.version, allowedTypes: ['cycle_input_snapshot'] });
  }
  if (data.record_type === 'decision_dimension') {
    for (const [field, allowedTypes] of [
      ['strategy_assessment_version', ['strategy_assessment']],
      ['strategy_input_snapshot_version', ['cycle_input_snapshot']],
    ]) {
      const entry = data[field];
      refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes });
    }
  }
  if (data.record_type === 'cycle_goal_candidate_batch') {
    for (const [field, allowedTypes] of [
      ['source_cycle_review_version', ['cycle_review']],
      ['review_input_snapshot_version', ['cycle_input_snapshot']],
    ]) {
      const entry = data[field];
      refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes });
    }
    for (const [index, item] of (data.ordered_candidates ?? []).entries()) {
      const entry = item.candidate_version;
      refs.push({ field: `ordered_candidates[${index}].candidate_version`, ref: entry.ref, version: entry.version, allowedTypes: ['cycle_goal_candidate'] });
    }
  }
  if (data.record_type === 'cycle_goal_candidate') {
    for (const [field, allowedTypes] of [
      ['candidate_batch_version', ['cycle_goal_candidate_batch']],
      ['source_cycle_review_version', ['cycle_review']],
      ['review_input_snapshot_version', ['cycle_input_snapshot']],
    ]) {
      const entry = data[field];
      refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes });
    }
    const gate = data.strategy_gate_versions;
    if (gate) {
      for (const [field, allowedTypes] of [
        ['strategy_input_snapshot_version', ['cycle_input_snapshot']],
        ['strategy_assessment_version', ['strategy_assessment']],
        ['strategy_output_version', ['strategy_output']],
      ]) {
        const entry = gate[field];
        refs.push({ field: `strategy_gate_versions.${field}`, ref: entry.ref, version: entry.version, allowedTypes });
      }
      for (const [index, entry] of (gate.decision_dimension_versions ?? []).entries()) {
        refs.push({ field: `strategy_gate_versions.decision_dimension_versions[${index}]`, ref: entry.ref, version: entry.version, allowedTypes: ['decision_dimension'] });
      }
    }
  }
  if (data.record_type === 'cycle_goal_selection') {
    for (const [field, allowedTypes] of [
      ['source_cycle_review_version', ['cycle_review']],
      ['candidate_batch_version', ['cycle_goal_candidate_batch']],
    ]) {
      const entry = data[field];
      refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes });
    }
    const candidateEntries = [
      ...(data.candidate_versions ?? []),
      ...(data.decision?.selected_candidate_version ? [data.decision.selected_candidate_version] : []),
      ...(data.decision?.rejected_candidate_versions ?? []),
      ...(data.decision?.deferred_candidate_versions ?? []),
    ];
    for (const [index, entry] of candidateEntries.entries()) {
      refs.push({ field: `candidate_decisions[${index}]`, ref: entry.ref, version: entry.version, allowedTypes: ['cycle_goal_candidate'] });
    }
  }
  if (data.record_type === 'strategy_output') {
    for (const [field, allowedTypes] of [
      ['strategy_assessment_version', ['strategy_assessment']],
      ['strategy_input_snapshot_version', ['cycle_input_snapshot']],
    ]) {
      const entry = data[field];
      refs.push({ field, ref: entry.ref, version: entry.version, allowedTypes });
    }
    for (const [index, entry] of (data.decision_dimension_versions ?? []).entries()) {
      refs.push({ field: `decision_dimension_versions[${index}]`, ref: entry.ref, version: entry.version, allowedTypes: ['decision_dimension'] });
    }
  }
  if (data.record_type === 'source' && data.discovery?.citation_ref) {
    refs.push({
      field: 'discovery.citation_ref',
      ref: data.discovery.citation_ref,
      version: null,
      allowedTypes: ['citation_observation'],
    });
  }
  if (data.record_type === 'answer_sample') {
    refs.push(
      { field: 'query_version', ref: data.query_ref, version: data.query_version, allowedTypes: ['query'] },
      { field: 'query_set_version', ref: data.query_set_ref, version: data.query_set_version, allowedTypes: ['query_set'] },
      {
        field: 'collector_profile_version',
        ref: data.collector_profile_ref,
        version: data.collector_profile_version,
        allowedTypes: ['collector_profile'],
      },
    );
  }
  if (data.record_type === 'claim_support_review') {
    refs.push({
      field: 'claim_version',
      ref: data.claim_ref,
      version: data.claim_version,
      allowedTypes: ['claim'],
    });
  }
  if (data.record_type === 'answer_aggregation') {
    for (const item of data.query_cluster?.query_versions ?? []) {
      refs.push({ field: 'query_cluster.query_versions', ref: item.ref, version: item.version, allowedTypes: ['query'] });
    }
    for (const item of data.selected_sample_versions ?? []) {
      refs.push({ field: 'selected_sample_versions', ref: item.ref, version: item.version, allowedTypes: ['answer_sample'] });
    }
    for (const item of data.answer_review_versions ?? []) {
      refs.push({ field: 'answer_review_versions', ref: item.ref, version: item.version, allowedTypes: ['answer_review'] });
    }
    if (data.comparability?.compared_to_ref) {
      refs.push({
        field: 'comparability.compared_to_ref',
        ref: data.comparability.compared_to_ref,
        version: null,
        allowedTypes: ['answer_aggregation'],
      });
    }
  }
  return refs;
}

function isLegacyExcluded(relative) {
  return relative.startsWith('knowledge/00-governance/')
    || relative.startsWith('knowledge/01-templates/')
    || relative === 'knowledge/README.md'
    || relative.endsWith('/_index.md');
}

const PLANNING_DOCUMENT_PREFIXES = Object.freeze([
  'strategy/business-brand-knowledge-v1/',
]);

function isPlanningDocument(relative) {
  return PLANNING_DOCUMENT_PREFIXES.some((prefix) => relative.startsWith(prefix));
}

function shouldIgnore(relative) {
  return relative === 'indexes'
    || relative.startsWith('indexes/')
    || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative);
}

function relativePath(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

export async function loadWorkspaceGraph({ workspace }) {
  const root = path.resolve(workspace);
  const diagnostics = [];
  const warnings = [];
  const objects = [];
  const legacy = [];
  const byId = new Map();
  const pathsById = new Map();
  const files = await walkMarkdownFiles(root, { ignore: shouldIgnore });

  for (const file of files) {
    const relative = relativePath(root, file);
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    let frontmatter;
    try {
      frontmatter = matter(text).data;
    } catch {
      diagnostics.push({ code: 'INVALID_FRONTMATTER', path: relative });
      continue;
    }
    if (isPlanningDocument(relative)) continue;
    if (frontmatter.record_type === 'knowledge_entry' && !isLegacyExcluded(relative)) {
      if (frontmatter.id && frontmatter.query_id && frontmatter.status && frontmatter.version) {
        legacy.push({
          id: frontmatter.id,
          query_id: frontmatter.query_id,
          status: frontmatter.status,
          version: String(frontmatter.version),
          path: relative,
          content_sha256: sha256(text),
          contract_status: 'legacy',
        });
      } else {
        diagnostics.push({ code: 'INVALID_LEGACY_ENTRY', path: relative });
      }
      continue;
    }
    if (frontmatter.record_type === 'knowledge_entry') continue;
    try {
      const parsed = await readMarkdownObject(file, { workspace: root });
      const object = { ...parsed, path: relative };
      objects.push(object);
      const previousPaths = pathsById.get(parsed.data.id) ?? [];
      previousPaths.push(relative);
      pathsById.set(parsed.data.id, previousPaths);
      if (!byId.has(parsed.data.id)) byId.set(parsed.data.id, object);
    } catch (error) {
      if (error instanceof ObjectContractError || error.code) {
        diagnostics.push(...(error.diagnostics?.length
          ? error.diagnostics
          : [{ code: error.code ?? 'OBJECT_READ_FAILED', path: relative }]));
      } else {
        throw error;
      }
    }
  }

  for (const [id, paths] of pathsById.entries()) {
    if (paths.length > 1) diagnostics.push({ code: 'DUPLICATE_ID', id, paths: paths.sort() });
  }

  for (const object of objects) {
    for (const relation of collectObjectReferences(object.data)) {
      const target = byId.get(relation.ref);
      if (!target) {
        diagnostics.push({
          code: 'BROKEN_REF', path: object.path, field: relation.field, ref: relation.ref,
        });
      } else if (!relation.allowedTypes.includes(target.data.record_type)) {
        diagnostics.push({
          code: 'REF_TYPE_MISMATCH',
          path: object.path,
          field: relation.field,
          ref: relation.ref,
          expected: relation.allowedTypes,
          actual: target.data.record_type,
        });
      } else if (relation.version && relation.version !== target.data.version) {
        diagnostics.push({
          code: 'REF_VERSION_MISMATCH',
          path: object.path,
          field: relation.field,
          ref: relation.ref,
          expected: relation.version,
          actual: target.data.version,
        });
      }
    }
  }

  if (diagnostics.length > 0) throw new IndexValidationError(diagnostics);
  objects.sort((a, b) => compareUtf8(a.data.id, b.data.id) || compareUtf8(a.path, b.path));
  legacy.sort((a, b) => compareUtf8(a.id, b.id) || compareUtf8(a.path, b.path));
  return { root, objects, legacy, byId, warnings };
}

function indexEntry(object) {
  const refs = collectObjectReferences(object.data).map((item) => item.ref);
  return {
    id: object.data.id,
    status: object.data.status,
    version: object.data.version,
    path: object.path,
    updated_at: object.data.updated_at,
    refs: [...new Set(refs)].sort(),
  };
}

export async function buildIndexes({ workspace, write = true }) {
  const graph = await loadWorkspaceGraph({ workspace });
  const indexes = new Map();
  for (const recordType of RECORD_TYPES) {
    const payload = {
      schema_version: EXTENDED_INDEX_TYPES.has(recordType) ? '1.1.0' : '1.0.0',
      record_type: recordType,
      objects: graph.objects
        .filter((object) => object.data.record_type === recordType)
        .map(indexEntry),
    };
    indexes.set(INDEX_NAMES[recordType], stableStringify(payload, 2));
  }
  indexes.set('legacy-knowledge.json', stableStringify({
    schema_version: 'legacy-knowledge-1.0.0',
    record_type: 'knowledge_entry',
    objects: graph.legacy,
  }, 2));

  const written = [];
  if (write) {
    for (const [name, content] of [...indexes.entries()].sort(([a], [b]) => compareUtf8(a, b))) {
      written.push(await atomicWrite(graph.root, `indexes/${name}`, content));
    }
  }
  return {
    workspace: graph.root,
    object_count: graph.objects.length,
    legacy_count: graph.legacy.length,
    warnings: graph.warnings,
    indexes: [...indexes.keys()].sort(),
    written,
  };
}
