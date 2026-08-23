import { readFile } from 'node:fs/promises';

import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';
export { traceQuery } from './knowledge-trace.mjs';

export class KnowledgeQueryError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'KnowledgeQueryError';
    this.code = code;
    Object.assign(this, details);
  }
}

const M3_REQUIRED_FIELDS = {
  query: ['normalized_text', 'intent', 'priority', 'goal_refs'],
  claim: ['document_refs', 'scope', 'evidence_sufficiency'],
};

function assertM3Fields(object) {
  for (const field of M3_REQUIRED_FIELDS[object.data.record_type] ?? []) {
    const value = object.data[field];
    if (value === undefined || (Array.isArray(value) && value.length === 0)
        || (typeof value === 'string' && value.trim() === '')) {
      throw new KnowledgeQueryError('M3_FIELD_REQUIRED', 'M3 输入对象缺少必填字段', {
        ref: object.data.id, field,
      });
    }
  }
}

function requireObject(graph, ref, type) {
  const object = graph.byId.get(ref);
  if (!object) throw new KnowledgeQueryError('BROKEN_REF', '对象引用不存在', { ref });
  if (object.data.record_type !== type) {
    throw new KnowledgeQueryError('REF_TYPE_MISMATCH', '对象引用类型错误', {
      ref,
      expected: type,
      actual: object.data.record_type,
    });
  }
  return object;
}

function assertPlanCandidates(items) {
  for (const item of items) {
    if ((item.status && item.status !== 'candidate') || item.approval) {
      throw new KnowledgeQueryError('AUTO_APPROVAL_FORBIDDEN', 'propose 只能创建 candidate 对象');
    }
  }
}

function assertUniqueOutputs(items) {
  const ids = new Set();
  const paths = new Set();
  for (const item of items) {
    const safePath = assertSafeRelativePath(item.path);
    if (ids.has(item.id) || paths.has(safePath)) {
      throw new KnowledgeQueryError('OBJECT_CONFLICT', 'plan 内存在重复 ID 或 path');
    }
    ids.add(item.id);
    paths.add(safePath);
  }
}

function assertOutputIdentities(graph, items) {
  for (const item of items) {
    const existing = graph.byId.get(item.id);
    const safePath = assertSafeRelativePath(item.path);
    if (existing && existing.path !== safePath) {
      throw new KnowledgeQueryError('OBJECT_CONFLICT', 'stable ID 已存在于其他路径', {
        id: item.id,
        existing_path: existing.path,
        requested_path: safePath,
      });
    }
  }
}

async function writeOutputs(workspace, outputs) {
  const prepared = outputs.map((output) => {
    validateObjectData(output.data, { path: output.path });
    return {
      ...output,
      content: serializeMarkdownObject(output.data, `# ${output.data.title ?? output.data.id}\n`),
    };
  });
  for (const output of prepared) {
    try {
      await assertNoSymlinkPath(workspace, output.path);
      if ((await readFile(resolveWithin(workspace, output.path), 'utf8')) !== output.content) {
        throw new KnowledgeQueryError('OBJECT_CONFLICT', '目标已存在且内容不同', {
          path: output.path,
        });
      }
    } catch (error) {
      if (!['PATH_NOT_FOUND', 'ENOENT'].includes(error.code)) throw error;
    }
  }
  const created = [];
  const kept = [];
  for (const output of prepared) {
    const result = await writeCreateOnly(
      workspace,
      output.path,
      output.content,
      { idempotent: true, conflictCode: 'OBJECT_CONFLICT' },
    );
    (result.action === 'created' ? created : kept).push(result.path);
  }
  return { created, kept };
}

function common(item, recordType, status, now, existing) {
  return {
    id: item.id,
    record_type: recordType,
    status,
    version: item.version ?? '1.0.0',
    created_at: existing?.data.created_at ?? now,
    updated_at: existing?.data.updated_at ?? now,
    ...(item.title ? { title: item.title } : {}),
  };
}

export function querySetContentSha(queryVersions) {
  const normalized = queryVersions
    .map(({ ref, version, query_text, language }) => ({ ref, version, query_text, language }))
    .sort((a, b) => a.ref.localeCompare(b.ref));
  return sha256(stableStringify(normalized));
}

export async function proposeKnowledge({ workspace, plan, now }) {
  const graph = await loadWorkspaceGraph({ workspace });
  const document = requireObject(graph, plan.document_ref, 'document');
  if (document.data.status !== 'approved' || !document.data.approval) {
    throw new KnowledgeQueryError('DOCUMENT_NOT_APPROVED', '只有 approved Document 可用于 propose');
  }
  const claims = plan.claims ?? [];
  const answerCards = plan.answer_cards ?? [];
  const all = [...claims, ...answerCards];
  assertPlanCandidates(all);
  assertUniqueOutputs(all);
  assertOutputIdentities(graph, all);
  const plannedClaims = new Map(claims.map((item) => [item.id, item]));

  for (const item of claims) {
    for (const ref of item.evidence_refs ?? []) requireObject(graph, ref, 'evidence');
  }
  for (const item of answerCards) {
    for (const ref of item.query_refs ?? []) assertM3Fields(requireObject(graph, ref, 'query'));
    for (const ref of item.evidence_refs ?? []) requireObject(graph, ref, 'evidence');
    for (const versionRef of item.claim_versions ?? []) {
      const planned = plannedClaims.get(versionRef.ref);
      if (planned) {
        if ((planned.version ?? '1.0.0') !== versionRef.version) {
          throw new KnowledgeQueryError('VERSION_DRIFT', 'Answer Card 引用了错误的计划 Claim 版本');
        }
      } else {
        const existing = requireObject(graph, versionRef.ref, 'claim');
        assertM3Fields(existing);
        if (existing.data.version !== versionRef.version) {
          throw new KnowledgeQueryError('VERSION_DRIFT', 'Answer Card 引用了错误的 Claim 版本');
        }
      }
    }
  }

  const outputs = [
    ...claims.map((item) => ({
      path: item.path,
      data: {
        ...common(item, 'claim', 'candidate', now, graph.byId.get(item.id)),
        statement: item.statement,
        risk_type: item.risk_type,
        risk_level: item.risk_level,
        evidence_refs: item.evidence_refs ?? [],
        document_refs: [plan.document_ref],
        scope: item.scope,
        evidence_sufficiency: {
          status: 'unknown',
          rule_version: 'm3-evidence-sufficiency-v1',
          missing: [],
        },
      },
    })),
    ...answerCards.map((item) => ({
      path: item.path,
      data: {
        ...common(item, 'answer_card', 'candidate', now, graph.byId.get(item.id)),
        query_refs: item.query_refs ?? [],
        claim_versions: item.claim_versions ?? [],
        evidence_refs: item.evidence_refs ?? [],
        direct_answer: item.direct_answer,
        limitations: item.limitations ?? [],
        forbidden_statements: item.forbidden_statements ?? [],
      },
    })),
  ];
  return writeOutputs(workspace, outputs);
}

function validateVersionRefs(graph, refs, type, { m3Profile = false } = {}) {
  for (const item of refs) {
    const target = requireObject(graph, item.ref, type);
    if (m3Profile) assertM3Fields(target);
    if (target.data.version !== item.version) {
      throw new KnowledgeQueryError('VERSION_DRIFT', '对象版本引用与当前对象不一致', {
        ref: item.ref,
        expected: item.version,
        actual: target.data.version,
      });
    }
  }
}

export async function assembleQuerySet({ workspace, plan, now }) {
  const graph = await loadWorkspaceGraph({ workspace });
  assertUniqueOutputs([plan]);
  assertOutputIdentities(graph, [plan]);
  for (const ref of plan.goal_refs ?? []) requireObject(graph, ref, 'perception_goal');
  validateVersionRefs(graph, plan.query_versions ?? [], 'query', { m3Profile: true });
  const data = {
    ...common(plan, 'query_set', 'draft', now, graph.byId.get(plan.id)),
    goal_refs: plan.goal_refs ?? [],
    query_versions: plan.query_versions ?? [],
  };
  const result = await writeOutputs(workspace, [{ path: plan.path, data }]);
  return { ...result, data };
}

export async function assembleKnowledgeRelease({ workspace, plan, now }) {
  const graph = await loadWorkspaceGraph({ workspace });
  assertUniqueOutputs([plan]);
  assertOutputIdentities(graph, [plan]);
  validateVersionRefs(graph, plan.claim_versions ?? [], 'claim', { m3Profile: true });
  validateVersionRefs(graph, plan.answer_card_versions ?? [], 'answer_card');
  const data = {
    ...common(plan, 'knowledge_release', 'draft', now, graph.byId.get(plan.id)),
    release_version: plan.release_version,
    claim_versions: plan.claim_versions ?? [],
    answer_card_versions: plan.answer_card_versions ?? [],
    readiness: 'incomplete',
  };
  const result = await writeOutputs(workspace, [{ path: plan.path, data }]);
  return { ...result, data };
}

function addError(errors, code, object, details = {}) {
  errors.push({ code, id: object.data.id, path: object.path, ...details });
}

function requiresApproval(data) {
  return (data.record_type === 'document' && data.status === 'approved')
    || (data.record_type === 'claim' && ['approved', 'published'].includes(data.status))
    || (data.record_type === 'query' && data.status === 'formal')
    || (data.record_type === 'evidence' && data.status === 'approved')
    || (data.record_type === 'answer_card' && ['approved', 'published'].includes(data.status))
    || (data.record_type === 'query_set' && data.status === 'frozen')
    || (data.record_type === 'knowledge_release' && data.status === 'published')
    || (data.record_type === 'perception_goal'
      && ['approved', 'active', 'achieved', 'partial', 'not_achieved'].includes(data.status));
}

function validateApprovals(graph, errors) {
  for (const object of graph.objects) {
    if (requiresApproval(object.data) && !object.data.approval) {
      addError(errors, 'APPROVAL_REQUIRED', object);
    }
  }
}

function validateM3RequiredFields(graph, errors) {
  for (const object of graph.objects) {
    for (const field of M3_REQUIRED_FIELDS[object.data.record_type] ?? []) {
      const value = object.data[field];
      if (value === undefined || (Array.isArray(value) && value.length === 0)
          || (typeof value === 'string' && value.trim() === '')) {
        addError(errors, 'M3_FIELD_REQUIRED', object, { field });
      }
    }
  }
}

function validateDuplicateQueries(graph, errors) {
  const seen = new Map();
  for (const object of graph.objects.filter(({ data }) =>
    data.record_type === 'query' && !['stale', 'deprecated'].includes(data.status))) {
    for (const goal of object.data.goal_refs ?? []) {
      const key = `${goal}\u0000${object.data.normalized_text}\u0000${object.data.language}`;
      const prior = seen.get(key);
      if (prior) addError(errors, 'DUPLICATE_QUERY', object, { duplicate_of: prior.data.id });
      else seen.set(key, object);
    }
  }
}

function evidenceCategories(graph, claim) {
  return new Set((claim.data.evidence_refs ?? [])
    .map((ref) => graph.byId.get(ref)?.data)
    .filter((data) => data?.record_type === 'evidence' && data.status === 'approved')
    .map((data) => data.extensions?.['geo.evidence_category'])
    .filter(Boolean));
}

function evidenceGaps(graph, claim) {
  const categories = evidenceCategories(graph, claim);
  const has = (value) => categories.has(value);
  switch (claim.data.risk_type) {
    case 'ordinary_fact': return has('first_party') ? [] : ['first_party'];
    case 'capability_fact':
    case 'effect_claim':
      return [!has('first_party') && 'first_party', !(has('data') || has('case')) && 'data_or_case'].filter(Boolean);
    case 'comparison_claim':
      return [!has('first_party') && 'first_party',
        !(has('user') || has('independent_third_party')) && 'user_or_independent'].filter(Boolean);
    case 'high_risk_commitment':
      return [!has('formal_rule') && 'formal_rule', !claim.data.scope && 'scope',
        !claim.data.approval && 'approval'].filter(Boolean);
    default: return ['unregistered_rule'];
  }
}

function validateEvidence(graph, errors, warnings) {
  for (const object of graph.objects) {
    if (object.data.record_type === 'evidence' && object.data.status === 'stale') {
      warnings.push({ code: 'STALE_EVIDENCE', id: object.data.id, path: object.path });
    }
    if (object.data.record_type === 'claim') {
      const missing = evidenceGaps(graph, object);
      if (missing.length > 0) {
        warnings.push({ code: 'EVIDENCE_INSUFFICIENT', id: object.data.id, path: object.path, missing });
      }
      const recorded = object.data.evidence_sufficiency;
      if (recorded && recorded.status !== 'unknown'
          && (recorded.status === 'sufficient') !== (missing.length === 0)) {
        warnings.push({
          code: 'EVIDENCE_SUFFICIENCY_DRIFT', id: object.data.id, path: object.path,
          recorded_status: recorded.status, actual_missing: missing,
        });
      }
    }
  }
}

function validateAnswers(graph, errors) {
  for (const object of graph.objects.filter(({ data }) => data.record_type === 'answer_card')) {
    if (!['approved', 'published'].includes(object.data.status)) continue;
    for (const ref of object.data.query_refs) {
      if (graph.byId.get(ref)?.data.status !== 'formal') addError(errors, 'QUERY_NOT_FORMAL', object, { ref });
    }
    for (const item of object.data.claim_versions) {
      if (!['approved', 'published'].includes(graph.byId.get(item.ref)?.data.status)) {
        addError(errors, 'RELEASE_NOT_READY', object, { ref: item.ref });
      }
    }
    if (object.data.status === 'published') {
      const releases = object.data.release_refs ?? [];
      if (!releases.some((ref) => graph.byId.get(ref)?.data.status === 'published')) {
        addError(errors, 'RELEASE_NOT_READY', object, { field: 'release_refs' });
      }
    }
  }
}

function validateClaims(graph, errors) {
  for (const object of graph.objects.filter(({ data }) => data.record_type === 'claim')) {
    if (object.data.status !== 'published') continue;
    const releases = object.data.release_refs ?? [];
    const valid = releases.some((ref) => {
      const release = graph.byId.get(ref)?.data;
      return release?.status === 'published'
        && release.claim_versions.some((item) => item.ref === object.data.id
          && item.version === object.data.version);
    });
    if (!valid) addError(errors, 'RELEASE_NOT_READY', object, { field: 'release_refs' });
  }
}

function validateQuerySets(graph, errors) {
  for (const object of graph.objects.filter(({ data }) => data.record_type === 'query_set')) {
    if (object.data.status !== 'frozen') continue;
    if (!object.data.frozen_at || !object.data.frozen_by || !object.data.content_sha256) {
      addError(errors, 'APPROVAL_REQUIRED', object, { field: 'freeze_metadata' });
      continue;
    }
    const versions = object.data.query_versions.map(({ ref, version }) => {
      const query = graph.byId.get(ref)?.data;
      if (query?.status !== 'formal') addError(errors, 'QUERY_NOT_FORMAL', object, { ref });
      return { ref, version, query_text: query?.query_text, language: query?.language };
    });
    if (querySetContentSha(versions) !== object.data.content_sha256) {
      addError(errors, 'VERSION_DRIFT', object, { field: 'content_sha256' });
    }
    for (const ref of object.data.goal_refs) {
      if (!['approved', 'active'].includes(graph.byId.get(ref)?.data.status)) {
        addError(errors, 'GOAL_NOT_APPROVED', object, { ref });
      }
    }
  }
}

function validateReleases(graph, errors) {
  for (const object of graph.objects.filter(({ data }) => data.record_type === 'knowledge_release')) {
    if (object.data.status !== 'published') {
      if (object.data.readiness !== 'incomplete') addError(errors, 'RELEASE_NOT_READY', object);
      continue;
    }
    if (object.data.readiness !== 'ready') addError(errors, 'RELEASE_NOT_READY', object);
    const releaseClaims = new Map(object.data.claim_versions.map((item) => [item.ref, item.version]));
    for (const item of object.data.claim_versions) {
      const claim = graph.byId.get(item.ref)?.data;
      if (!['approved', 'published'].includes(claim?.status)) {
        addError(errors, 'RELEASE_NOT_READY', object, { ref: item.ref });
      }
      if ((claim?.document_refs?.length ?? 0) === 0 || (claim?.evidence_refs?.length ?? 0) === 0) {
        addError(errors, 'TRACE_INCOMPLETE', object, { ref: item.ref });
      }
      for (const documentRef of claim?.document_refs ?? []) {
        if (graph.byId.get(documentRef)?.data.status !== 'approved') {
          addError(errors, 'RELEASE_NOT_READY', object, { ref: documentRef });
        }
      }
      for (const evidenceRef of claim?.evidence_refs ?? []) {
        const evidence = graph.byId.get(evidenceRef)?.data;
        if (evidence?.status !== 'approved') {
          addError(errors, 'RELEASE_NOT_READY', object, { ref: evidenceRef });
        }
        for (const sourceRef of evidence?.source_refs ?? []) {
          if (graph.byId.get(sourceRef)?.data.status !== 'active') {
            addError(errors, 'RELEASE_NOT_READY', object, { ref: sourceRef });
          }
        }
      }
      if (claim && evidenceGaps(graph, { data: claim }).length > 0) {
        addError(errors, 'RELEASE_NOT_READY', object, { ref: item.ref, field: 'evidence_sufficiency' });
      }
    }
    for (const item of object.data.answer_card_versions) {
      const answer = graph.byId.get(item.ref)?.data;
      if (!['approved', 'published'].includes(answer?.status)) {
        addError(errors, 'RELEASE_NOT_READY', object, { ref: item.ref });
      }
      for (const claimVersion of answer?.claim_versions ?? []) {
        if (releaseClaims.get(claimVersion.ref) !== claimVersion.version) {
          addError(errors, 'RELEASE_NOT_READY', object, {
            ref: item.ref,
            field: 'claim_versions',
          });
        }
      }
    }
  }
}

export async function validateKnowledgeWorkspace({ workspace }) {
  let graph;
  try {
    graph = await loadWorkspaceGraph({ workspace });
  } catch (error) {
    if (error.code === 'INDEX_VALIDATION_FAILED') return { errors: error.diagnostics, warnings: [] };
    throw error;
  }
  const errors = [];
  const warnings = [];
  validateM3RequiredFields(graph, errors);
  validateApprovals(graph, errors);
  validateDuplicateQueries(graph, errors);
  validateEvidence(graph, errors, warnings);
  validateAnswers(graph, errors);
  validateClaims(graph, errors);
  validateQuerySets(graph, errors);
  validateReleases(graph, errors);
  return { errors, warnings };
}
