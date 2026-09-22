import { readFile } from 'node:fs/promises';
import {
  realContext,
  putJson,
  putObject,
  jsonAt,
  ref,
} from './real-journey-store.mjs';
import {
  requireReal,
  REAL_PLATFORMS,
  assertRealSlot,
  buildObservationSchedule,
} from './real-cycle-contract.mjs';
import { createCycle } from '../geo-lifecycle.mjs';
import { advanceCycle, resumeCycleTransition } from './cycle-lifecycle.mjs';
import {
  realProfiles,
  formalSlots,
  assertFormalCapture,
  assertFormalExtraction,
  assertFormalCitations,
} from './real-sampling.mjs';
import {
  expandEvidenceObjects,
  supportingArtifacts,
} from './snapshot-support.mjs';
import { resolveWithin, sha256, stableStringify } from './workspace-paths.mjs';

export async function freezeRealCycle(workspace) {
  let { plan, graph, cycle, identity } = await realContext(workspace);
  if (cycle && cycle.data.id === plan.cycle_ref) return cycle;
  const runtimePath = `${plan.cycle_dir}/runtime.json`;
  let runtime = await jsonAt(workspace, runtimePath, null);
  if (!runtime) {
    const now = new Date();
    runtime = {
      ...plan,
      source_asset_refs: plan.asset_refs,
      asset_refs: plan.asset_refs.map(
        (id) => `${id}-REAL-C${plan.cycle_number}`,
      ),
      baseline_window: {
        id: 'BASE',
        starts_at: now.toISOString(),
        ends_at: new Date(now.getTime() + 7 * 86400000).toISOString(),
      },
    };
    await putJson(workspace, runtimePath, runtime);
  }
  const releaseObject = graph.byId.get(plan.knowledge.release_ref),
    querySet = graph.byId.get(plan.query_set_ref);
  for (const [index, id] of runtime.source_asset_refs.entries()) {
    const original = graph.byId.get(id);
    await putObject(
      workspace,
      original.data.asset_kind === 'own' ? 'assets/own' : 'assets/external',
      {
        ...original.data,
        id: runtime.asset_refs[index],
        created_at: runtime.baseline_window.starts_at,
        updated_at: runtime.baseline_window.starts_at,
        goal_refs: [runtime.goal_ref],
        query_refs: querySet.data.query_versions.map((v) => v.ref),
        claim_versions: releaseObject.data.claim_versions,
        knowledge_release_versions: [ref(releaseObject)],
      },
      original.content,
    );
  }
  const profiles = await realProfiles(
    workspace,
    runtime,
    runtime.baseline_window,
  );
  ({ graph } = await realContext(workspace));
  const qs = graph.byId.get(plan.query_set_ref),
    release = graph.byId.get(plan.knowledge.release_ref);
  const ids = [
    identity.merchant_ref,
    plan.knowledge_base_ref,
    plan.goal_ref,
    plan.query_set_ref,
    release.data.id,
    ...qs.data.query_versions.map((v) => v.ref),
    ...release.data.answer_card_versions.map((v) => v.ref),
    ...release.data.claim_versions.map((v) => v.ref),
    ...runtime.asset_refs,
    ...profiles.map((o) => o.data.id),
  ];
  const objects = expandEvidenceObjects(
    graph,
    [...new Set(ids)].map((id) => graph.byId.get(id)),
  );
  const artifacts = [
    {
      role: 'other_contract',
      path: runtimePath,
      media_type: 'application/json',
    },
    ...Object.entries(plan.contracts).map(([role, p]) => ({
      role,
      path: p,
      media_type: 'application/json',
    })),
    {
      role: 'supporting_artifact',
      path: plan.authorization.ref.slice(12),
      media_type: 'text/plain',
    },
    ...(await supportingArtifacts(workspace, graph, objects)),
  ];
  const request = {
    schema_version: 'm6-create-cycle-plan/1.0.0',
    cycle_id: runtime.cycle_ref,
    cycle_path: `${runtime.cycle_dir}/cycle.md`,
    run_id: runtime.run_ref,
    snapshot_id: `CIS-${runtime.cycle_ref.slice(4)}-FREEZE`,
    merchant_ref: identity.merchant_ref,
    knowledge_base_ref: runtime.knowledge_base_ref,
    goal_ref: runtime.goal_ref,
    query_set_ref: runtime.query_set_ref,
    cycle_number: runtime.cycle_number,
    created_at: runtime.baseline_window.starts_at,
    source_paths: objects.map((o) => o.path),
    artifact_paths: [...new Map(artifacts.map((a) => [a.path, a])).values()],
    runtime,
    predecessor_review_version: runtime.predecessor_review_version,
    goal_selection_version: runtime.goal_selection_version,
  };
  await putJson(workspace, `${plan.cycle_dir}/create.json`, request);
  return createCycle(workspace, request);
}

export async function advanceRealCycle(workspace, toStage, inputObjects) {
  const { cycle, plan, graph } = await realContext(workspace);
  if (cycle.data.aggregate_stage === toStage)
    return { kept: true, applied: true };
  const token = `${cycle.data.id.slice(4)}-${toStage.toUpperCase().replaceAll('_', '-')}`;
  const objects = expandEvidenceObjects(
    graph,
    inputObjects.map((o) => (typeof o === 'string' ? graph.byId.get(o) : o)),
  );
  requireReal(
    objects.every(Boolean),
    'CYCLE_GATE_REQUIRED',
    'Missing canonical gate object',
  );
  const artifacts = [
    ...Object.entries(plan.contracts).map(([role, p]) => ({
      role,
      path: p,
      media_type: 'application/json',
    })),
    ...(await supportingArtifacts(workspace, graph, objects)),
  ];
  if (['baseline_recorded', 'answer_retest_completed'].includes(toStage)) {
    const purpose =
      toStage === 'baseline_recorded' ? 'baseline' : 'post_change_retest';
    const matrix = {
      schema_version: 'geo-real-sampling-matrix-v1',
      cycle_ref: cycle.data.id,
      slots: await formalSlots(workspace, purpose),
    };
    const descriptor = await putJson(
      workspace,
      `${plan.cycle_dir}/matrix-${purpose}.json`,
      matrix,
    );
    artifacts.push({
      role: 'other_contract',
      path: descriptor.path,
      media_type: 'application/json',
    });
  }
  const schedule = await jsonAt(
    workspace,
    `${plan.cycle_dir}/schedule.json`,
    null,
  );
  if (schedule)
    artifacts.push({
      role: 'other_contract',
      path: `${plan.cycle_dir}/schedule.json`,
      media_type: 'application/json',
    });
  const human = [
    'adoption_decided',
    'publication_confirmed',
    'review_decided',
    'cancelled_no_adoption',
  ].includes(toStage);
  const decision = objects.find((o) => o.data.approval)?.data.approval
    ?.decision_ref;
  const requestPath = `${plan.cycle_dir}/transitions/${toStage}.json`;
  let request = await jsonAt(workspace, requestPath, null);
  if (!request) {
    request = {
      cycle_ref: cycle.data.id,
      operation_id: `${cycle.data.id}:${toStage}`,
      transition_id: `CTR-${token}`,
      gate_snapshot_id: `CIS-${token}`,
      expected_cycle_version: cycle.data.version,
      goal_entry_key: cycle.data.goal_tracks[0].goal_entry_key,
      from_stage: cycle.data.aggregate_stage,
      to_stage: toStage,
      actor: human
        ? { kind: 'human', decision_ref: decision }
        : { kind: 'deterministic_tool' },
      lease: {
        owner_id: 'real-journey',
        now: new Date().toISOString(),
        ttl_ms: 60000,
      },
      gate: {
        source_paths: [...new Set(objects.map((o) => o.path))],
        artifact_paths: [
          ...new Map(artifacts.map((a) => [a.path, a])).values(),
        ],
      },
    };
    await putJson(workspace, requestPath, request);
  }
  const prior = graph.byId.get(request.transition_id);
  if (prior && !cycle.data.transition_refs.includes(request.transition_id))
    return resumeCycleTransition({
      workspace,
      cycleId: cycle.data.id,
      operationId: request.operation_id,
      expectedCycleVersion: cycle.data.version,
    });
  return advanceCycle({
    workspace,
    plan: request,
    executionNow: new Date().toISOString(),
  });
}

export async function assertRealSamplingGate(
  workspace,
  snapshot,
  toStage,
  objects,
) {
  if (!['baseline_recorded', 'answer_retest_completed'].includes(toStage))
    return;
  const { cycle, plan, graph } = await realContext(workspace);
  requireReal(
    cycle?.data.id === snapshot.cycle_ref && plan?.cycle_ref === cycle.data.id,
    'CYCLE_GATE_REQUIRED',
    'Real cycle runtime binding missing',
  );
  const purpose =
    toStage === 'baseline_recorded' ? 'baseline' : 'post_change_retest';
  let retestBoundary = null;
  if (purpose !== 'baseline') {
    const track = cycle.data.goal_tracks[0];
    const publications = track.publication_refs.map(
      (id) => graph.byId.get(id)?.data,
    );
    const runs = track.technical_retest_run_refs.map(
      (id) => graph.byId.get(id)?.data,
    );
    requireReal(
      publications.length &&
        runs.length &&
        publications.every(
          (p) =>
            p?.record_type === 'asset_publication' &&
            p.status === 'confirmed' &&
            p.approval,
        ) &&
        runs.every((r) => r?.record_type === 'run' && r.status === 'completed'),
      'CYCLE_GATE_REQUIRED',
      'Retest requires confirmed publications and completed technical checks',
    );
    const reports = [];
    for (const run of runs) {
      const report = await jsonAt(
        workspace,
        `runs/${run.id}/outputs/technical-readback.json`,
      );
      requireReal(
        report.run_ref === run.id &&
          track.publication_refs.includes(report.publication_ref) &&
          run.publication_refs?.includes(report.publication_ref) &&
          Date.parse(report.completed_at) === Date.parse(run.updated_at),
        'CYCLE_GATE_REQUIRED',
        'Technical observation anchor or publication binding changed',
      );
      reports.push(report);
    }
    const published = Math.max(
      ...publications.map((p) => Date.parse(p.published_at)),
    );
    retestBoundary = Math.max(
      ...reports.map((r) => Date.parse(r.completed_at)),
    );
    requireReal(
      Number.isFinite(published) &&
        Number.isFinite(retestBoundary) &&
        retestBoundary >= published,
      'CYCLE_GATE_REQUIRED',
      'Publication/technical timestamps are invalid',
    );
    const expected = buildObservationSchedule({
      cycleRef: cycle.data.id,
      publicationAt: new Date(published).toISOString(),
      technicalAt: new Date(retestBoundary).toISOString(),
    });
    const schedule = await jsonAt(workspace, `${plan.cycle_dir}/schedule.json`);
    requireReal(
      stableStringify(schedule) === stableStringify(expected),
      'CYCLE_GATE_REQUIRED',
      'Schedule must retain all four windows and the actual publication/technical anchors',
    );
    requireReal(
      expected.windows.every((w) => Date.parse(w.ends_at) <= Date.now()),
      'OBSERVATION_WINDOW_PENDING',
      'Four actual weeks must elapse before completion',
    );
  }
  const slots = await formalSlots(workspace, purpose);
  const samples = objects.filter((o) => o.record_type === 'answer_sample'),
    reviews = objects.filter((o) => o.record_type === 'answer_review'),
    aggs = objects.filter((o) => o.record_type === 'answer_aggregation');
  const matrices = [];
  for (const artifact of snapshot.artifact_entries) {
    const bytes = await readFile(
      resolveWithin(workspace, artifact.source_path),
    );
    requireReal(
      sha256(bytes) === artifact.source_sha256,
      'CYCLE_GATE_REQUIRED',
      'Matrix artifact drift',
    );
    try {
      const data = JSON.parse(bytes);
      if (data.schema_version === 'geo-real-sampling-matrix-v1')
        matrices.push(data);
    } catch {}
  }
  requireReal(
    matrices.length === 1 &&
      stableStringify(matrices[0].slots) === stableStringify(slots),
    'CYCLE_GATE_REQUIRED',
    'Frozen real sampling matrix missing or changed',
  );
  requireReal(
    samples.length === slots.length &&
      new Set(samples.map((s) => s.id)).size === slots.length,
    'CYCLE_GATE_REQUIRED',
    'Incomplete real Query/platform/window/slot matrix',
  );
  if (purpose !== 'baseline')
    requireReal(
      slots.every((s) => Date.parse(s.window.ends_at) <= Date.now()),
      'OBSERVATION_WINDOW_PENDING',
      'Four actual weeks must elapse before completion',
    );
  const captures = [];
  for (const slot of slots) {
    const sample = samples.find((s) => s.id === slot.sample_ref),
      binding = sample?.extensions?.['geo.real_capture'];
    requireReal(
      binding &&
        !sample.test_scope &&
        sample.collection_method === slot.collection_method &&
        sample.query_ref === slot.query_ref &&
        sample.query_version === slot.query_version &&
        sample.query_set_ref === slot.query_set_ref &&
        sample.query_set_version === slot.query_set_version &&
        sample.collector_profile_ref === slot.profile_ref &&
        sample.collector_profile_version === slot.profile_version &&
        sample.ordinal === slot.ordinal &&
        sample.platform === slot.platform &&
        sample.purpose === purpose,
      'CYCLE_GATE_REQUIRED',
      'Foreign or synthetic sample',
    );
    const profile = graph.byId.get(slot.profile_ref)?.data;
    requireReal(
      profile?.status === 'frozen' &&
        profile.approval &&
        profile.version === slot.profile_version &&
        profile.platform === slot.platform &&
        profile.time_window.id === slot.window.id &&
        profile.time_window.starts_at === slot.window.starts_at &&
        profile.time_window.ends_at === slot.window.ends_at,
      'CYCLE_GATE_REQUIRED',
      'Frozen Profile differs from the slot window',
    );
    const bytes = await readFile(resolveWithin(workspace, binding.raw_path));
    requireReal(
      sha256(bytes) === binding.raw_sha256,
      'CYCLE_GATE_REQUIRED',
      'Raw capture drift',
    );
    const capture = JSON.parse(bytes);
    assertFormalCapture(slot, capture, captures);
    captures.push(capture);
    assertFormalCitations(graph, sample, capture);
    if (capture.answer_text?.trim()) {
      const extraction = sample.extensions?.['geo.extraction'];
      requireReal(
        extraction?.path && extraction.sha256,
        'CYCLE_GATE_REQUIRED',
        'Missing real extraction audit',
      );
      const extractionBytes = await readFile(
        resolveWithin(workspace, extraction.path),
      );
      requireReal(
        sha256(extractionBytes) === extraction.sha256,
        'CYCLE_GATE_REQUIRED',
        'Extraction artifact drift',
      );
      await assertFormalExtraction(
        workspace,
        slot,
        capture,
        JSON.parse(extractionBytes),
        plan,
      );
    }
    requireReal(
      graph.byId.get(sample.run_ref)?.data.status === 'completed',
      'CYCLE_GATE_REQUIRED',
      'Capture Run is incomplete',
    );
    requireReal(
      sample.captured_at === capture.captured_at &&
        sample.outcome === capture.outcome,
      'CYCLE_GATE_REQUIRED',
      'Capture metadata drift',
    );
    const match = reviews.filter(
      (r) =>
        r.sample_ref === sample.id &&
        r.status === 'reviewed' &&
        r.approval &&
        r.sample_raw_manifest_sha256 === sample.raw_manifest_sha256,
    );
    requireReal(
      match.length === 1,
      'CYCLE_GATE_REQUIRED',
      'Each observation requires one approved review',
    );
    if (purpose !== 'baseline')
      requireReal(
        Date.parse(sample.captured_at) > retestBoundary &&
          sample.publication_refs?.length &&
          sample.publication_refs.every((id) =>
            cycle.data.goal_tracks[0].publication_refs.includes(id),
          ) &&
          sample.technical_retest_run_refs?.length &&
          sample.technical_retest_run_refs.every((id) =>
            cycle.data.goal_tracks[0].technical_retest_run_refs.includes(id),
          ),
        'CYCLE_GATE_REQUIRED',
        'Retest publication lineage missing',
      );
  }
  const selected = aggs.flatMap((a) => a.selected_sample_versions ?? []);
  requireReal(
    aggs.length === slots.length / 2 &&
      selected.length === slots.length &&
      new Set(selected.map((v) => v.ref)).size === slots.length &&
      selected.every((v) =>
        samples.some(
          (s) =>
            s.id === v.ref &&
            s.version === v.version &&
            s.raw_manifest_sha256 === v.raw_manifest_sha256,
        ),
      ),
    'CYCLE_GATE_REQUIRED',
    'Real aggregation coverage incomplete',
  );
  for (const a of aggs) {
    const selectedSamples = a.selected_sample_versions.map((v) =>
      samples.find((s) => s.id === v.ref),
    );
    requireReal(
      a.purpose === purpose &&
        a.selected_sample_versions.length === 2 &&
        a.answer_review_versions.length === 2 &&
        new Set(selectedSamples.map((s) => s.collector_profile_ref)).size ===
          1 &&
        new Set(selectedSamples.map((s) => s.query_ref)).size === 1 &&
        a.profile_versions?.length === 1 &&
        selectedSamples.every(
          (s) =>
            s.platform === a.platform &&
            s.collector_profile_ref === a.profile_versions[0].ref &&
            s.collector_profile_version === a.profile_versions[0].version,
        ) &&
        a.query_cluster?.query_versions?.length === 1 &&
        selectedSamples.every(
          (s) =>
            s.query_ref === a.query_cluster.query_versions[0].ref &&
            s.query_version === a.query_cluster.query_versions[0].version,
        ) &&
        a.answer_review_versions.every((v) =>
          reviews.some(
            (r) =>
              r.id === v.ref &&
              r.version === v.version &&
              r.rubric.sha256 === v.rubric_sha256 &&
              selectedSamples.some(
                (s) =>
                  s.id === r.sample_ref &&
                  s.raw_manifest_sha256 === r.sample_raw_manifest_sha256,
              ),
          ),
        ),
      'CYCLE_GATE_REQUIRED',
      'Cross-window aggregation or stale review',
    );
  }
}
