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
};
const M3_INDEX_TYPES = new Set([
  'document', 'answer_card', 'knowledge_release',
  'query_set', 'evidence_plan', 'perception_goal',
]);

const REF_FIELDS = {
  query: { goal_refs: ['perception_goal'], discovery_source_refs: ['source'] },
  claim: {
    evidence_refs: ['evidence'],
    document_refs: ['document'],
    release_refs: ['knowledge_release'],
  },
  source: {},
  evidence: { source_refs: ['source'], claim_refs: ['claim'] },
  finding: {
    query_refs: ['query'],
    claim_refs: ['claim'],
    evidence_refs: ['evidence'],
    asset_refs: ['asset'],
  },
  asset: { source_refs: ['source'] },
  run: {
    input_refs: RECORD_TYPES,
    finding_refs: ['finding'],
    evidence_refs: ['evidence'],
    asset_refs: ['asset'],
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
  evidence_plan: { claim_refs: ['claim'], retest_query_refs: ['query'] },
  perception_goal: { query_set_refs: ['query_set'] },
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
  const versionFields = data.record_type === 'answer_card'
    ? [['claim_versions', ['claim']]]
    : data.record_type === 'knowledge_release'
      ? [['claim_versions', ['claim']], ['answer_card_versions', ['answer_card']]]
      : data.record_type === 'query_set'
        ? [['query_versions', ['query']]]
        : [];
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
      schema_version: M3_INDEX_TYPES.has(recordType) ? '1.1.0' : '1.0.0',
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
