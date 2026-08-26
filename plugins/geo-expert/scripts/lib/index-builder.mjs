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
};
const EXTENDED_INDEX_TYPES = new Set([
  'document', 'answer_card', 'knowledge_release',
  'query_set', 'evidence_plan', 'perception_goal',
  'asset_proposal', 'adoption_record', 'asset_publication',
  'collector_profile', 'answer_sample', 'citation_observation',
  'source_classification', 'claim_support_review', 'answer_review',
  'answer_aggregation',
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
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function collectObjectReferences(data) {
  const refs = [];
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
      refs.push({ field: `core_versions.${field}`, ref: entry.ref, version: entry.version, allowedTypes: RECORD_TYPES });
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
  objects.sort((a, b) => a.data.id.localeCompare(b.data.id) || a.path.localeCompare(b.path));
  legacy.sort((a, b) => a.id.localeCompare(b.id) || a.path.localeCompare(b.path));
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
    for (const [name, content] of [...indexes.entries()].sort(([a], [b]) => a.localeCompare(b))) {
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
