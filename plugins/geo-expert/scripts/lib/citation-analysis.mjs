import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { sha256, stableStringify, writeCreateOnly } from './workspace-paths.mjs';

export class CitationAnalysisError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CitationAnalysisError';
    this.code = code;
    Object.assign(this, details);
  }
}

export function rejectExternalRankingImport() {
  throw new CitationAnalysisError(
    'EXTERNAL_RANKING_IMPORT_FORBIDDEN',
    'M5 不接受外部榜单、静态域名表或历史排名导入',
  );
}

export async function materializeSourceClassification({
  workspace,
  sourceId,
  citationIds,
  plan,
  now,
}) {
  if (!Array.isArray(citationIds) || citationIds.length === 0) {
    throw new CitationAnalysisError(
      'SOURCE_CANDIDATE_UNOBSERVED',
      'Source Classification 必须由 Citation Observation 触发',
    );
  }
  const graph = await loadWorkspaceGraph({ workspace });
  const source = graph.byId.get(sourceId)?.data;
  const citations = citationIds.map((id) => graph.byId.get(id)?.data);
  if (!source || source.record_type !== 'source'
      || citations.some((citation) => !citation
        || citation.record_type !== 'citation_observation'
        || citation.source_ref !== sourceId)) {
    throw new CitationAnalysisError('SOURCE_CANDIDATE_UNOBSERVED', 'Source/Citation 关系不完整');
  }
  if (plan.secondary_source_types.includes(plan.primary_source_type)) {
    throw new CitationAnalysisError('SOURCE_CLASSIFICATION_CONFLICT', '主标签不能重复为副标签');
  }
  const reviewRequired = plan.review_required
    || ['low', 'unknown'].includes(plan.confidence)
    || plan.primary_source_type === 'unknown';
  const existing = graph.byId.get(plan.id)?.data;
  if (existing) {
    const expected = stableStringify({
      source_ref: sourceId,
      status: plan.status,
      primary_source_type: plan.primary_source_type,
      secondary_source_types: plan.secondary_source_types,
      party_relation: plan.party_relation,
      subject_workspace: plan.subject_workspace,
      basis: plan.basis,
      confidence: plan.confidence,
      reviewer: plan.reviewer,
      review_required: reviewRequired,
    });
    const actual = stableStringify({
      source_ref: existing.source_ref,
      status: existing.status,
      primary_source_type: existing.primary_source_type,
      secondary_source_types: existing.secondary_source_types,
      party_relation: existing.party_relation,
      subject_workspace: existing.subject_workspace,
      basis: existing.basis,
      confidence: existing.confidence,
      reviewer: existing.reviewer,
      review_required: existing.review_required,
    });
    if (existing.record_type !== 'source_classification' || expected !== actual) {
      throw new CitationAnalysisError(
        'SOURCE_CLASSIFICATION_CONFLICT',
        '既有 Classification 与当前计划不同；必须使用新 ID + supersedes_ref',
      );
    }
    return { ...existing, action: 'kept' };
  }
  const data = {
    id: plan.id,
    record_type: 'source_classification',
    status: plan.status,
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `Classification ${sourceId}`,
    source_ref: sourceId,
    citation_refs: [...new Set(citationIds)].sort(),
    classification_key: sha256(stableStringify({
      source_identity_key: source.identity?.key ?? `locator:${source.locator}`,
      rule_version: plan.reviewer.identifier,
    })),
    primary_source_type: plan.primary_source_type,
    secondary_source_types: plan.secondary_source_types,
    party_relation: plan.party_relation,
    subject_workspace: plan.subject_workspace,
    basis: plan.basis,
    confidence: plan.confidence,
    reviewer: plan.reviewer,
    review_required: reviewRequired,
  };
  validateObjectData(data, { path: plan.path });
  const result = await writeCreateOnly(
    workspace,
    plan.path,
    serializeMarkdownObject(data, `# ${data.title}\n`),
    { idempotent: true, conflictCode: 'SOURCE_CLASSIFICATION_CONFLICT' },
  );
  return { ...data, action: result.action };
}

export async function materializeClaimSupportReview({
  workspace,
  citationId,
  classificationId,
  plan,
  now,
}) {
  const graph = await loadWorkspaceGraph({ workspace });
  const citation = graph.byId.get(citationId)?.data;
  const classification = graph.byId.get(classificationId)?.data;
  const claim = graph.byId.get(plan.claim_ref)?.data;
  if (!citation || !classification || classification.source_ref !== citation.source_ref
      || !claim || claim.version !== plan.claim_version) {
    throw new CitationAnalysisError('CLAIM_SUPPORT_INCOMPLETE', 'Citation/Classification/Claim 关系不完整');
  }
  const data = {
    id: plan.id,
    record_type: 'claim_support_review',
    status: plan.status,
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `Claim support ${citationId}`,
    citation_ref: citationId,
    classification_ref: classificationId,
    claim_ref: plan.claim_ref,
    claim_version: plan.claim_version,
    verdict: plan.verdict,
    support_scope: plan.support_scope,
    rationale: plan.rationale,
    confidence: plan.confidence,
    reviewer: plan.reviewer,
    review_required: plan.review_required
      || ['low', 'unknown'].includes(plan.confidence),
  };
  validateObjectData(data, { path: plan.path });
  const result = await writeCreateOnly(
    workspace,
    plan.path,
    serializeMarkdownObject(data, `# ${data.title}\n`),
    { idempotent: true, conflictCode: 'CLAIM_SUPPORT_INCOMPLETE' },
  );
  return { ...data, action: result.action };
}
