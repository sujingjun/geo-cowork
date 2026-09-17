import { readFile, readdir } from 'node:fs/promises';
import { findJourneyCycle, refVersion } from './journey-cycle-inputs.mjs';
import { advanceCycle } from './cycle-lifecycle.mjs';
import {
  writeCreateOnly,
  stableStringify,
  resolveWithin,
} from './workspace-paths.mjs';
import { modelHash } from './model-client.mjs';
import {
  expandEvidenceObjects,
  supportingArtifacts,
} from './snapshot-support.mjs';

export async function journeyDecision(workspace, id) {
  const names = await readdir(resolveWithin(workspace, 'reviews/packages'));
  const packages = await Promise.all(
    names
      .filter((n) => n.endsWith('.json'))
      .map(async (n) =>
        JSON.parse(
          await readFile(
            resolveWithin(workspace, `reviews/packages/${n}`),
            'utf8',
          ),
        ),
      ),
  );
  const visited = new Set();
  while (true) {
    if (visited.has(id)) throw new Error('Review package lineage cycle');
    visited.add(id);
    const children = packages.filter((p) => p.parent_package_id === id);
    if (children.length > 1) throw new Error('Conflicting review revisions');
    if (!children.length) break;
    id = children[0].id;
  }
  try {
    return JSON.parse(
      await readFile(
        resolveWithin(workspace, `reviews/decisions/${id}.json`),
        'utf8',
      ),
    );
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}
export async function advanceJourney(workspace, toStage, objects) {
  const { cycle, context, graph } = await findJourneyCycle(workspace);
  const from = cycle.data.aggregate_stage;
  if (from === toStage) return { kept: true };
  const suffix = `C${context.cycle_number}`;
  const token = toStage.toUpperCase().replaceAll('_', '-');
  objects = expandEvidenceObjects(
    graph,
    objects.map((o) => (typeof o === 'string' ? graph.byId.get(o) : o)),
  );
  const paths = [
    ...new Set(
      objects.map((o) =>
        typeof o === 'string' ? graph.byId.get(o)?.path : o.path,
      ),
    ),
  ];
  if (paths.some((p) => !p)) throw new Error('Gate object not found');
  const artifacts = [
    {
      role: 'measurement_contract',
      path: 'execution/contracts/measurement-contract.json',
      media_type: 'application/json',
    },
  ];
  if (['baseline_recorded', 'answer_retest_completed'].includes(toStage)) {
    const purpose =
      toStage === 'baseline_recorded' ? 'baseline' : 'post_change_retest';
    const phase = purpose === 'baseline' ? 'BASE' : 'AFTER';
    const matrix = {
      schema_version: 'geo-sampling-matrix-v1',
      cycle_ref: cycle.data.id,
      goal_ref: context.goal_ref,
      knowledge_base_ref: context.test_scope.knowledge_base_ref,
      purpose,
      query_set_ref: cycle.data.extensions['geo.journey'].query_set_ref,
      query_versions: context.selected_query_refs.map((id) =>
        refVersion(graph.byId.get(id)),
      ),
      profile_versions: [
        'chatgpt',
        'gemini',
        'perplexity',
        'google_ai',
        'claude',
      ].map((p) =>
        refVersion(
          graph.byId.get(
            `CPF-GEO-E2E-${suffix}-${phase}-${p.toUpperCase().replaceAll('_', '-')}`,
          ),
        ),
      ),
      ordinals: [1, 2],
    };
    const relative = `cycles/preparation/matrix-${suffix}-${phase}.json`;
    await writeCreateOnly(workspace, relative, stableStringify(matrix, 2), {
      idempotent: true,
    });
    artifacts.push({
      role: 'other_contract',
      path: relative,
      media_type: 'application/json',
    });
  }
  artifacts.push(...(await supportingArtifacts(workspace, graph, objects)));
  const human = [
    'adoption_decided',
    'publication_confirmed',
    'review_decided',
    'cancelled_no_adoption',
  ].includes(toStage);
  const decisionRef = objects
    .map((o) => (typeof o === 'string' ? graph.byId.get(o)?.data : o.data))
    .find((d) => d?.approval)?.approval?.decision_ref;
  const now = new Date(
    Date.parse(context.created_at) +
      ({
        baseline_recorded: 1,
        diagnosis_ready: 1,
        adoption_decided: 1,
        publication_confirmed: 2,
        technical_retest_completed: 3,
        answer_retest_completed: 8,
        analytics_recorded: 9,
        review_waiting_human: 9,
        review_decided: 9,
      }[toStage] ?? 0) *
        86400000,
  ).toISOString();
  const plan = {
    cycle_ref: cycle.data.id,
    operation_id: `${cycle.data.id}:${toStage}`,
    transition_id: `CTR-GEO-${suffix}-${token}`,
    gate_snapshot_id: `CIS-GEO-${suffix}-${token}`,
    expected_cycle_version: cycle.data.version,
    goal_entry_key: cycle.data.goal_tracks[0].goal_entry_key,
    from_stage: from,
    to_stage: toStage,
    actor: human
      ? { kind: 'fixture_human', decision_ref: decisionRef }
      : { kind: 'deterministic_tool' },
    lease: { owner_id: 'knowledge-journey', now, ttl_ms: 60000 },
    gate: { source_paths: paths, artifact_paths: artifacts },
  };
  await writeCreateOnly(
    workspace,
    `cycles/preparation/transitions/${toStage}-${suffix}-${modelHash(stableStringify(plan)).slice(0, 12)}.json`,
    stableStringify(plan, 2),
    { idempotent: true },
  );
  return advanceCycle({ workspace, plan });
}
