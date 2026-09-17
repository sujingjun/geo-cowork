#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { loadWorkspaceGraph } from './lib/index-builder.mjs';
import { assertStageGate } from './lib/cycle-gates.mjs';
import { traceCycle } from './lib/cycle-trace.mjs';
import { atomicWrite, resolveWithin, sha256 } from './lib/workspace-paths.mjs';
const index = process.argv.indexOf('--workspace');
const workspace = process.argv[index + 1];
if (index < 0 || !workspace) throw new Error('Provide --workspace');
const graph = await loadWorkspaceGraph({ workspace });
const errors = [];
const cycles = graph.objects
  .filter((o) => o.data.record_type === 'cycle')
  .sort((a, b) => a.data.cycle_number - b.data.cycle_number);
const results = [];
for (const { data: cycle } of cycles) {
  if (cycle.status !== 'completed' || cycle.completion_scope !== 'full')
    errors.push({ cycle: cycle.id, error: 'CYCLE_NOT_FULL' });
  const trace = await traceCycle({ workspace, cycleId: cycle.id });
  if (!trace.lifecycle_ready) errors.push(...trace.errors);
  for (const id of cycle.transition_refs) {
    const transition = graph.byId.get(id).data;
    const snapshot = graph.byId.get(transition.gate_snapshot_version.ref).data;
    try {
      await assertStageGate(workspace, snapshot, transition.to_stage);
    } catch (e) {
      errors.push({
        cycle: cycle.id,
        stage: transition.to_stage,
        error: e.code,
        message: e.message,
      });
    }
  }
  const qs = cycle.extensions['geo.journey'].query_set_ref;
  const samples = graph.objects.filter(
    (o) =>
      o.data.record_type === 'answer_sample' && o.data.query_set_ref === qs,
  );
  const counts = {
    baseline: samples.filter((s) => s.data.purpose === 'baseline').length,
    retest: samples.filter((s) => s.data.purpose === 'post_change_retest')
      .length,
  };
  if (counts.baseline !== 60 || counts.retest !== 60)
    errors.push({ cycle: cycle.id, error: 'MATRIX_COUNT_INVALID' });
  for (const { data: sample } of samples) {
    const ref = sample.extensions?.['geo.extraction'];
    if (!ref) {
      errors.push({
        sample: sample.id,
        error: 'REAL_EXTRACTION_PROOF_MISSING',
      });
      continue;
    }
    const bytes = await readFile(resolveWithin(workspace, ref.path));
    const extraction = JSON.parse(bytes);
    if (
      sha256(bytes) !== ref.sha256 ||
      extraction.audit.provider === 'fake' ||
      extraction.audit.status !== 'completed' ||
      extraction.audit.http_status !== 200 ||
      extraction.audit.extraction_validation !== 'passed'
    )
      errors.push({
        sample: sample.id,
        error: 'REAL_EXTRACTION_PROOF_INVALID',
      });
  }
  results.push({
    id: cycle.id,
    status: cycle.status,
    stage: cycle.aggregate_stage,
    completion_scope: cycle.completion_scope,
    ...counts,
    trace_ready: trace.lifecycle_ready,
  });
}
if (cycles.length !== 2) errors.push({ error: 'TWO_CYCLES_REQUIRED' });
if (cycles.length === 2) {
  const second = cycles[1].data;
  const review = graph.byId.get(second.predecessor_review_version?.ref)?.data;
  const selection = graph.byId.get(second.goal_selection_version?.ref)?.data;
  const qs = graph.byId.get(
    second.extensions['geo.journey'].query_set_ref,
  )?.data;
  const goal = graph.byId.get(qs?.goal_refs?.[0])?.data;
  if (
    review?.cycle_ref !== cycles[0].data.id ||
    selection?.source_cycle_review_version.ref !== review?.id ||
    new Set([
      review?.approval?.decision_ref,
      selection?.approval?.decision_ref,
      goal?.approval?.decision_ref,
    ]).size !== 3
  )
    errors.push({ error: 'CYCLE_TWO_DECISION_LINEAGE_INVALID' });
}
const result = {
  ok: errors.length === 0,
  scope: 'synthetic business inputs with real model execution',
  real_business_effect_verified: false,
  cycles: results,
  errors,
};
await atomicWrite(
  workspace,
  'reports/engineering-acceptance.json',
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
