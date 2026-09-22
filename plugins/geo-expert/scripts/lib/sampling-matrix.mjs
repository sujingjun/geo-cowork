import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { loadWorkspaceGraph } from './index-builder.mjs';
import { resolveWithin, sha256 } from './workspace-paths.mjs';
import { sampleSlotKey } from './answer-profile.mjs';
const fail = (message) => {
  throw Object.assign(new Error(message), { code: 'CYCLE_GATE_REQUIRED' });
};
export async function assertSamplingMatrix(
  workspace,
  snapshot,
  stage,
  objects,
) {
  const graph = await loadWorkspaceGraph({ workspace });
  const cycle = graph.byId.get(snapshot.cycle_ref)?.data;
  if (cycle?.execution_scope === 'authorized_real')
    return (await import('./real-cycle-progress.mjs')).assertRealSamplingGate(
      workspace,
      snapshot,
      stage,
      objects,
    );
  if (!cycle?.extensions?.['geo.journey']) return;
  if (!['baseline_recorded', 'answer_retest_completed'].includes(stage)) return;
  const purpose =
    stage === 'baseline_recorded' ? 'baseline' : 'post_change_retest';
  let matrix;
  for (const artifact of snapshot.artifact_entries) {
    const bytes = await readFile(
      resolveWithin(workspace, artifact.source_path),
    );
    if (sha256(bytes) !== artifact.source_sha256) fail('Matrix artifact drift');
    try {
      const value = JSON.parse(bytes);
      if (value.schema_version === 'geo-sampling-matrix-v1') matrix = value;
    } catch {}
  }
  if (
    !matrix ||
    matrix.cycle_ref !== cycle.id ||
    matrix.goal_ref !==
      graph.byId.get(cycle.extensions['geo.journey'].query_set_ref)?.data
        .goal_refs[0] ||
    matrix.purpose !== purpose ||
    matrix.knowledge_base_ref !== cycle.knowledge_base_ref
  )
    fail('Missing or foreign sampling matrix');
  const querySet = graph.byId.get(matrix.query_set_ref)?.data;
  if (
    !querySet ||
    querySet.id !== cycle.extensions['geo.journey'].query_set_ref ||
    querySet.status !== 'frozen'
  )
    fail('Matrix Query Set mismatch');
  const queryVersions = new Map(
    matrix.query_versions.map((v) => [v.ref, v.version]),
  );
  if (
    queryVersions.size !== querySet.query_versions.length ||
    querySet.query_versions.some((v) => queryVersions.get(v.ref) !== v.version)
  )
    fail('Matrix Query versions mismatch');
  const profiles = matrix.profile_versions.map(
    (v) => graph.byId.get(v.ref)?.data,
  );
  const freeze = graph.byId.get(cycle.core_versions.input_snapshot.ref)?.data;
  const frozenProfiles =
    freeze?.source_entries.filter(
      (e) => e.record_type === 'collector_profile',
    ) ?? [];
  const baselinePlatforms = new Set(
    frozenProfiles.map((e) => graph.byId.get(e.object_id)?.data.platform),
  );
  if (
    JSON.stringify(matrix.ordinals) !== '[1,2]' ||
    profiles.length !== baselinePlatforms.size ||
    profiles.some(
      (p) => !p || p.sampling_count !== 2 || !baselinePlatforms.has(p.platform),
    )
  )
    fail('Matrix changed the frozen platform or slot coverage');
  if (
    purpose === 'baseline' &&
    matrix.profile_versions.some(
      (v) =>
        !frozenProfiles.some(
          (e) => e.object_id === v.ref && e.object_version === v.version,
        ),
    )
  )
    fail('Baseline Profile is outside the freeze');
  if (
    profiles.some(
      (p, i) =>
        !p ||
        p.version !== matrix.profile_versions[i].version ||
        p.status !== 'frozen' ||
        !p.approval,
    ) ||
    new Set(profiles.map((p) => p.platform)).size !== profiles.length
  )
    fail('Matrix profiles mismatch');
  const samples = objects.filter((o) => o.record_type === 'answer_sample');
  const reviews = objects.filter((o) => o.record_type === 'answer_review');
  const aggs = objects.filter((o) => o.record_type === 'answer_aggregation');
  const expected = new Set();
  for (const [query, version] of queryVersions)
    for (const profile of profiles)
      for (const ordinal of matrix.ordinals)
        expected.add(
          sampleSlotKey({
            purpose,
            queryRef: query,
            queryVersion: version,
            platform: profile.platform,
            collectorProfileRef: profile.id,
            collectorProfileVersion: profile.version,
            queryTemplateVersion: profile.query_template_version,
            timeWindowId: profile.time_window.id,
            ordinal,
          }),
        );
  if (
    samples.length !== expected.size ||
    new Set(samples.map((s) => s.slot_key)).size !== expected.size
  )
    fail('Incomplete or duplicate Query/platform/slot matrix');
  for (const sample of samples) {
    const profile = profiles.find((p) => p.id === sample.collector_profile_ref);
    if (
      !expected.has(sample.slot_key) ||
      !matrix.ordinals.includes(sample.ordinal) ||
      sample.purpose !== purpose ||
      queryVersions.get(sample.query_ref) !== sample.query_version ||
      sample.query_set_ref !== querySet.id ||
      sample.query_set_version !== querySet.version ||
      !profile ||
      sample.platform !== profile.platform ||
      sample.collector_profile_version !== profile.version ||
      Date.parse(sample.captured_at) <
        Date.parse(profile.time_window.starts_at) ||
      Date.parse(sample.captured_at) > Date.parse(profile.time_window.ends_at)
    )
      fail('Sample is outside the frozen matrix');
    if (
      sampleSlotKey({
        purpose,
        queryRef: sample.query_ref,
        queryVersion: sample.query_version,
        platform: sample.platform,
        collectorProfileRef: profile.id,
        collectorProfileVersion: profile.version,
        queryTemplateVersion: profile.query_template_version,
        timeWindowId: profile.time_window.id,
        ordinal: sample.ordinal,
      }) !== sample.slot_key
    )
      fail('Sample slot identity differs from its metadata');
    const reviewed = reviews.filter(
      (r) =>
        r.sample_ref === sample.id &&
        r.status === 'reviewed' &&
        r.sample_raw_manifest_sha256 === sample.raw_manifest_sha256 &&
        r.approval,
    );
    if (reviewed.length !== 1)
      fail('Sample needs one approved reviewed successor');
    if (
      purpose !== 'baseline' &&
      (!sample.publication_refs?.length ||
        sample.publication_refs.some(
          (r) => !cycle.goal_tracks[0].publication_refs.includes(r),
        ) ||
        !sample.technical_retest_run_refs?.length ||
        sample.technical_retest_run_refs.some(
          (r) => !cycle.goal_tracks[0].technical_retest_run_refs.includes(r),
        ))
    )
      fail('Retest publication/technical lineage mismatch');
    if (purpose !== 'baseline') {
      const boundary = Math.max(
        ...sample.publication_refs.map((id) =>
          Date.parse(graph.byId.get(id)?.data.published_at),
        ),
        ...sample.technical_retest_run_refs.map((id) =>
          Date.parse(graph.byId.get(id)?.data.updated_at),
        ),
      );
      if (
        !Number.isFinite(boundary) ||
        Date.parse(sample.captured_at) <= boundary
      )
        fail('Retest predates publication or technical checks');
    }
  }
  const selected = aggs.flatMap((a) => a.selected_sample_versions);
  if (
    selected.length !== samples.length ||
    new Set(selected.map((v) => v.ref)).size !== samples.length
  )
    fail('Aggregation matrix incomplete');
  for (const agg of aggs) {
    if (agg.purpose !== purpose) fail('Wrong aggregation purpose');
    if (
      agg.selected_sample_versions.length !== 2 ||
      agg.answer_review_versions.length !== 2
    )
      fail('Aggregation must pin two reviewed slots');
    const picked = agg.selected_sample_versions.map((v) =>
      samples.find(
        (s) =>
          s.id === v.ref &&
          s.version === v.version &&
          s.raw_manifest_sha256 === v.raw_manifest_sha256 &&
          s.slot_key === v.slot_key,
      ),
    );
    if (
      picked.some((s) => !s) ||
      new Set(picked.map((s) => s.query_ref)).size !== 1 ||
      picked.some(
        (s) =>
          s.platform !== agg.platform ||
          s.collector_profile_ref !== agg.profile_versions[0]?.ref ||
          s.collector_profile_version !== agg.profile_versions[0]?.version,
      )
    )
      fail('Aggregation sample lineage mismatch');
    if (
      agg.query_cluster.query_versions.length !== 1 ||
      agg.query_cluster.query_versions[0].ref !== picked[0].query_ref ||
      agg.query_cluster.query_versions[0].version !== picked[0].query_version
    )
      fail('Aggregation Query binding mismatch');
    for (const v of agg.answer_review_versions) {
      const r = reviews.find(
        (r) =>
          r.id === v.ref &&
          r.version === v.version &&
          r.rubric.sha256 === v.rubric_sha256,
      );
      if (!r) fail('Aggregation pins a stale or unreviewed result');
      if (!picked.some((s) => s.id === r.sample_ref))
        fail('Aggregation Review belongs to another sample');
    }
  }
}
