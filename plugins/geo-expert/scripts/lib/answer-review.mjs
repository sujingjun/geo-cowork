import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { sha256, stableStringify, writeCreateOnly } from './workspace-paths.mjs';

export class AnswerReviewError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnswerReviewError';
    this.code = code;
    Object.assign(this, details);
  }
}

export function rubricSha(definition) {
  return sha256(stableStringify(definition));
}

export async function materializeAnswerReview({
  workspace,
  sampleId,
  claimSupportIds,
  plan,
  now,
}) {
  const graph = await loadWorkspaceGraph({ workspace });
  const sample = graph.byId.get(sampleId)?.data;
  if (!sample || sample.record_type !== 'answer_sample') {
    throw new AnswerReviewError('ANALYSIS_CHAIN_INCOMPLETE', 'Answer Review 缺少 Sample');
  }
  const supports = claimSupportIds.map((id) => graph.byId.get(id)?.data);
  if (supports.some((support) => !support || support.record_type !== 'claim_support_review')) {
    throw new AnswerReviewError('CLAIM_SUPPORT_INCOMPLETE', 'Answer Review 包含无效 Claim Support');
  }
  const sampleCitations = new Set(graph.objects
    .filter(({ data }) => data.record_type === 'citation_observation' && data.sample_ref === sampleId)
    .map(({ data }) => data.id));
  if (supports.some((support) => !sampleCitations.has(support.citation_ref))) {
    throw new AnswerReviewError('CLAIM_SUPPORT_INCOMPLETE', 'Claim Support 不属于目标 Sample');
  }
  const data = {
    id: plan.id,
    record_type: 'answer_review',
    status: plan.status,
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `Answer Review ${sampleId}`,
    ...(sample.test_scope ? { test_scope: { ...sample.test_scope } } : {}),
    ...(plan.analysis ? {extensions:{'geo.analysis':plan.analysis}} : {}),
    sample_ref: sampleId,
    sample_raw_manifest_sha256: sample.raw_manifest_sha256,
    rubric: {
      version: plan.rubric.version,
      sha256: rubricSha(plan.rubric.definition),
    },
    claim_support_review_refs: [...new Set(claimSupportIds)].sort(),
    core: plan.core,
    exploratory: plan.exploratory,
    reviewer: plan.reviewer,
    review_required: plan.review_required,
  };
  validateObjectData(data, { path: plan.path });
  const result = await writeCreateOnly(
    workspace,
    plan.path,
    serializeMarkdownObject(data, `# ${data.title}\n`),
    { idempotent: true, conflictCode: 'RUBRIC_DRIFT' },
  );
  return { ...data, action: result.action };
}
