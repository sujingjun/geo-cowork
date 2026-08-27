import { readFile } from 'node:fs/promises';

import { validateDecisionDimensionLineage } from './decision-dimension.mjs';
import { recomputeAssessment } from './strategy-workflow.mjs';
import { validateStrategyOutput } from './strategy-output.mjs';
import { traceStrategy } from './strategy-trace.mjs';
import { resolveWithin } from './workspace-paths.mjs';
import { strategyCanonicalObjects } from './strategy-workspace.mjs';

export async function traceStrategyWorkspace({ root, assessmentRef }) {
  const objects = await strategyCanonicalObjects(root);
  const assessment = objects.find((item) => item.data.id === assessmentRef
    && item.data.record_type === 'strategy_assessment');
  if (!assessment) {
    return { ...traceStrategy({ assessment: null, snapshot: null }), dimension_lineage: [] };
  }
  const loaded = await recomputeAssessment(root, assessment.data);
  const dimensions = objects.filter((item) => item.data.record_type === 'decision_dimension'
    && item.data.strategy_assessment_version?.ref === assessment.data.id);
  const output = objects.find((item) => item.data.record_type === 'strategy_output'
    && item.data.strategy_assessment_version?.ref === assessment.data.id) ?? null;
  const errors = [];
  const byId = new Map(dimensions.map((item) => [item.data.id, item]));
  for (const current of dimensions) {
    const prior = current.data.supersedes_ref ? byId.get(current.data.supersedes_ref)?.data : null;
    errors.push(...validateDecisionDimensionLineage({ current: current.data, prior }).errors);
  }
  const lineage = [];
  if (output) {
    let cursor = byId.get(output.data.decision_dimension_versions[0]?.ref);
    const seen = new Set();
    while (cursor && !seen.has(cursor.data.id)) {
      seen.add(cursor.data.id);
      lineage.unshift(cursor);
      cursor = cursor.data.supersedes_ref ? byId.get(cursor.data.supersedes_ref) : null;
    }
    const artifactContents = new Map();
    for (const artifact of output.data.artifacts) {
      const file = resolveWithin(root, `runs/${output.data.run_ref}/${artifact.path}`);
      artifactContents.set(artifact.role, await readFile(file));
    }
    errors.push(...validateStrategyOutput({
      data: output.data, body: output.content, artifactContents,
    }).errors);
  }
  const traced = traceStrategy({
    assessment: assessment.data,
    snapshot: { snapshot_id: loaded.cis.data.id, snapshot_kind: 'strategy' },
    dimensions: lineage.map((item) => item.data), output: output?.data ?? null,
  });
  errors.push(...traced.errors);
  return {
    ...traced, result: errors.length === 0 ? 'complete' : 'incomplete', errors,
    assessment_path: assessment.path, strategy_snapshot_path: loaded.cis.path,
    dimension_lineage: lineage.map((item) => ({
      id: item.data.id, status: item.data.status, path: item.path,
    })),
    output_path: output?.path ?? null, run_ref: loaded.cis.data.run_ref,
  };
}
