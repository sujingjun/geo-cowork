import { materializeAnswerReview } from './answer-review.mjs';

export async function reviewManualBaselineBatch({ workspace, manifest }) {
  if (manifest.schema_version !== 'm5-manual-review-batch-v1'
      || !manifest.decision_ref?.startsWith('workspace://')
      || !Array.isArray(manifest.entries) || manifest.entries.length === 0) {
    const error = new Error('manual review batch manifest 合同不完整');
    error.code = 'M5_FIELD_REQUIRED';
    throw error;
  }
  const reviews = [];
  for (const entry of manifest.entries) {
    reviews.push(await materializeAnswerReview({
      workspace,
      sampleId: entry.sample_ref,
      claimSupportIds: [],
      plan: {
        id: entry.review_id,
        path: `cycles/m5/reviews/${entry.review_id.toLowerCase()}.md`,
        status: 'candidate',
        rubric: {
          version: manifest.rubric.version,
          definition: manifest.rubric.definition,
        },
        core: entry.core,
        exploratory: entry.exploratory,
        reviewer: { kind: 'geo_expert', identifier: 'm5-owner-positioning-review-v2' },
        review_required: true,
      },
      now: manifest.reviewed_at,
    }));
  }
  return { ok: true, reviews };
}
