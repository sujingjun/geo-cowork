import { materializeAnswerAggregation } from './answer-aggregation.mjs';

export async function aggregateManualBaselineBatch({ workspace, manifest }) {
  if (manifest.schema_version !== 'm5-manual-aggregation-batch-v1'
      || !Array.isArray(manifest.entries) || manifest.entries.length === 0) {
    const error = new Error('manual aggregation batch manifest 合同不完整');
    error.code = 'M5_FIELD_REQUIRED';
    throw error;
  }
  const aggregations = [];
  for (const entry of manifest.entries) {
    aggregations.push(await materializeAnswerAggregation({
      workspace,
      now: manifest.computed_at,
      plan: {
        purpose: 'baseline',
        industry: manifest.industry,
        query_cluster: manifest.query_cluster,
        profile: { data: { id: entry.profile_ref } },
        samples: entry.sample_refs.map((id) => ({ id })),
        aggregation: {
          id: entry.aggregation_id,
          path: `cycles/m5/aggregations/${entry.aggregation_id.toLowerCase()}.md`,
          top_n: 10,
        },
      },
    }));
  }
  return { ok: true, aggregations };
}
