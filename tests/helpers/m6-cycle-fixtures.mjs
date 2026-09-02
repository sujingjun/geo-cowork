import {
  M6_APPROVAL,
  M6_CYCLE_ID,
  M6_KNOWLEDGE_BASE_ID,
  M6_MERCHANT_ID,
  M6_NOW,
  M6_RUN_ID,
  M6_TEST_SCOPE,
  buildM6SnapshotPlan,
  createM6FixtureWorkspace,
  seedM6FreezeInputs,
  writeM6Object,
} from './m6-fixtures.mjs';
import {
  buildCycleSnapshotPlan,
  materializeCycleFreeze,
  materializeCycleSnapshot,
} from '../../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import { inputFingerprint } from '../../plugins/geo-expert/scripts/lib/run-store.mjs';

export function m6GoalTrack({
  suffix = '001',
  stage = 'prepared',
  inputSnapshotRef = 'CIS-M6-TEST-001',
} = {}) {
  const key = (character) => character.repeat(64);
  return {
    goal_entry_key: key(suffix === '001' ? '1' : '2'),
    input_snapshot_version: { ref: inputSnapshotRef, version: '1.0.0' },
    query_set_entry_key: key(suffix === '001' ? '3' : '4'),
    knowledge_release_entry_keys: [key(suffix === '001' ? '5' : '6')],
    evidence_entry_keys: [key(suffix === '001' ? '7' : '8')],
    asset_entry_keys: [key(suffix === '001' ? '9' : 'a')],
    collector_profile_entry_keys: [key(suffix === '001' ? 'b' : 'c')],
    measurement_contract_entry_key: key('d'),
    stage,
    baseline_aggregation_refs: [],
    finding_refs: [],
    evidence_plan_refs: [],
    asset_proposal_refs: [],
    adoption_record_refs: [],
    publication_refs: [],
    technical_retest_run_refs: [],
    answer_retest_aggregation_refs: [],
    analytics_observation_refs: [],
    business_signal_refs: [],
    review_input_snapshot_version: null,
  };
}

export function m6CycleData({
  status = 'proposed',
  version = '1.0.0',
  tracks = [m6GoalTrack()],
  aggregateStage = 'prepared',
  completionScope = 'none',
  transitionRefs = [],
} = {}) {
  return {
    id: M6_CYCLE_ID,
    record_type: 'cycle',
    status,
    version,
    created_at: M6_NOW,
    updated_at: M6_NOW,
    title: 'M6 synthetic cycle',
    test_scope: { ...M6_TEST_SCOPE },
    scope: 'knowledge_independent_engineering',
    merchant_ref: M6_MERCHANT_ID,
    knowledge_base_ref: M6_KNOWLEDGE_BASE_ID,
    execution_scope: 'synthetic_test',
    cycle_number: 1,
    core_versions: { input_snapshot: { ref: 'CIS-M6-TEST-001', version: '1.0.0' } },
    aggregate_stage: aggregateStage,
    completion_scope: completionScope,
    goal_tracks: tracks,
    transition_refs: transitionRefs,
    cycle_review_version: null,
    predecessor_review_version: null,
    goal_selection_version: null,
  };
}

export async function createM6FrozenCycleWorkspace() {
  const root = await createM6FixtureWorkspace();
  const inputs = await seedM6FreezeInputs(root);
  const snapshotPlan = await buildM6SnapshotPlan(root, inputs);
  const byType = (recordType) => snapshotPlan.source_entries
    .filter((entry) => entry.record_type === recordType);
  const goal = byType('perception_goal')[0];
  const track = {
    goal_entry_key: goal.entry_key,
    input_snapshot_version: { ref: snapshotPlan.snapshot.id, version: '1.0.0' },
    query_set_entry_key: byType('query_set')[0].entry_key,
    knowledge_release_entry_keys: byType('knowledge_release').map((entry) => entry.entry_key),
    evidence_entry_keys: byType('evidence').map((entry) => entry.entry_key),
    asset_entry_keys: byType('asset').map((entry) => entry.entry_key),
    collector_profile_entry_keys: byType('collector_profile').map((entry) => entry.entry_key),
    measurement_contract_entry_key: snapshotPlan.artifact_entries
      .find((entry) => entry.role === 'measurement_contract').entry_key,
    stage: 'frozen',
    baseline_aggregation_refs: [],
    finding_refs: [],
    evidence_plan_refs: [],
    asset_proposal_refs: [],
    adoption_record_refs: [],
    publication_refs: [],
    technical_retest_run_refs: [],
    answer_retest_aggregation_refs: [],
    analytics_observation_refs: [],
    business_signal_refs: [],
    review_input_snapshot_version: null,
  };
  const cycle = m6CycleData({
    status: 'active',
    tracks: [track],
    aggregateStage: 'frozen',
  });
  cycle.core_versions.input_snapshot.ref = snapshotPlan.snapshot.id;
  snapshotPlan.cycle = { path: 'cycles/m6/cycle.md', data: cycle };
  await materializeCycleFreeze({ workspace: root, plan: snapshotPlan });

  const inputVersions = Object.fromEntries(snapshotPlan.source_entries
    .map((entry) => [entry.object_id, entry.object_version]));
  await writeM6Object(root, `runs/${M6_RUN_ID}/run.md`, {
    id: M6_RUN_ID,
    record_type: 'run',
    status: 'running',
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    title: 'M6 synthetic lifecycle run',
    test_scope: { ...M6_TEST_SCOPE },
    skill: 'geo-lifecycle',
    skill_version: '1.0.0',
    input_refs: Object.keys(inputVersions).sort(),
    input_versions: Object.fromEntries(Object.entries(inputVersions).sort(([a], [b]) => a.localeCompare(b))),
    input_fingerprint: inputFingerprint(inputVersions),
    completed_steps: ['freeze_snapshot'],
    output_artifacts: [
      ...snapshotPlan.source_entries.map((entry) => entry.snapshot_path),
      ...snapshotPlan.artifact_entries.map((entry) => entry.snapshot_path),
      snapshotPlan.manifest.artifact_path,
    ].sort(),
    business_result: 'not_evaluated',
    next_action: 'advance baseline gate',
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: M6_CYCLE_ID,
    cycle_version: '1.0.0',
    transition_plan_sha256: 'a'.repeat(64),
    lease: {
      scope_key: `${M6_CYCLE_ID}:fixture`,
      owner_id: 'fixture-owner',
      revision: 1,
      acquired_at: M6_NOW,
      heartbeat_at: M6_NOW,
      expires_at: '2026-08-27T00:01:00Z',
    },
  }, '# M6 synthetic lifecycle run\n');
  return { root, inputs, snapshotPlan, cycle };
}

export async function createM6CompletedTraceWorkspace() {
  const fixture = await createM6FrozenCycleWorkspace();
  const { root, snapshotPlan } = fixture;
  const goalEntry = snapshotPlan.source_entries
    .find((entry) => entry.record_type === 'perception_goal');
  const stages = [
    'baseline_recorded', 'diagnosis_ready', 'adoption_decided',
    'publication_confirmed', 'technical_retest_completed',
    'answer_retest_completed', 'analytics_recorded',
  ];
  const transitions = [];
  const preReviewSnapshots = [];
  const preReviewEntryKeys = [];
  let fromStage = 'frozen';
  for (const [index, toStage] of stages.entries()) {
    const ordinal = String(index + 1).padStart(2, '0');
    const gate = await buildCycleSnapshotPlan({
      workspace: root,
      id: `CIS-M6-TRACE-GATE-${ordinal}`,
      snapshotKind: 'transition',
      merchantRef: M6_MERCHANT_ID,
      cycleRef: M6_CYCLE_ID,
      runRef: M6_RUN_ID,
      sourcePaths: ['cycles/preparation/goal.md'],
      artifactPaths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
    });
    await materializeCycleSnapshot({ workspace: root, plan: gate });
    const transitionId = `CTR-M6-TRACE-${ordinal}`;
    await writeM6Object(root, `cycles/m6/transitions/${transitionId.toLowerCase()}.md`, {
      id: transitionId,
      record_type: 'cycle_transition',
      status: 'recorded',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      title: `${fromStage} to ${toStage}`,
      test_scope: { ...M6_TEST_SCOPE },
      cycle_ref: M6_CYCLE_ID,
      goal_ref: 'GOAL-M6-TEST-001',
      operation_id: `trace-operation-${ordinal}`,
      operation_fingerprint: String(index + 1).repeat(64).slice(0, 64),
      expected_cycle_version: `1.0.${index}`,
      input_snapshot_version: { ref: snapshotPlan.snapshot.id, version: '1.0.0' },
      gate_snapshot_version: { ref: gate.snapshot.id, version: '1.0.0' },
      from_status: 'active',
      to_status: 'active',
      from_stage: fromStage,
      to_stage: toStage,
      required_gate_entry_keys: [
        ...gate.source_entries.map((entry) => entry.entry_key),
        ...gate.artifact_entries.map((entry) => entry.entry_key),
      ],
      lease_revision: index + 1,
      actor: { kind: 'deterministic_tool' },
    }, `# Trace transition ${ordinal}\n`);
    transitions.push(transitionId);
    preReviewSnapshots.push({ ref: gate.snapshot.id, version: '1.0.0' });
    preReviewEntryKeys.push(
      ...gate.source_entries.map((entry) => entry.entry_key),
      ...gate.artifact_entries.map((entry) => entry.entry_key),
    );
    fromStage = toStage;
  }

  const reviewSnapshot = await buildCycleSnapshotPlan({
    workspace: root,
    id: 'CIS-M6-TRACE-REVIEW-001',
    snapshotKind: 'review',
    merchantRef: M6_MERCHANT_ID,
    cycleRef: M6_CYCLE_ID,
    runRef: M6_RUN_ID,
    sourcePaths: [
      'execution/identity/merchant.md',
      'knowledge/meta/knowledge-base.md',
      'cycles/preparation/goal.md',
      'queries/formal/query.md',
      'evidence/records/evidence.md',
    ],
    artifactPaths: [{
      role: 'measurement_contract',
      path: 'execution/contracts/measurement-contract.json',
      media_type: 'application/json',
    }],
    baseFreezeSnapshotVersion: { ref: snapshotPlan.snapshot.id, version: '1.0.0' },
    preReviewTransitionSnapshotVersions: preReviewSnapshots,
    preReviewEntryKeys: [...new Set(preReviewEntryKeys)],
  });
  await materializeCycleSnapshot({ workspace: root, plan: reviewSnapshot });
  const reviewFingerprint = reviewSnapshot.manifest.fingerprint;
  const goalResult = {
    goal_entry_key: goalEntry.entry_key,
    perception_goal: 'inconclusive',
    observations: ['Synthetic trace observation.'],
    business_signal_entry_keys: ['e'.repeat(64)],
    limitations: ['Synthetic fixture only.'],
    forbidden_conclusions: ['No causal or real MyyShop conclusion.'],
  };
  const waitingId = 'CRV-M6-TRACE-WAITING-001';
  await writeM6Object(root, `cycles/m6/reviews/${waitingId.toLowerCase()}.md`, {
    id: waitingId,
    record_type: 'cycle_review',
    status: 'waiting_human',
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    title: 'Synthetic waiting review',
    test_scope: { ...M6_TEST_SCOPE },
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: M6_CYCLE_ID,
    reviewed_cycle_input_version: '1.0.7',
    review_input_snapshot_version: { ref: reviewSnapshot.snapshot.id, version: '1.0.0' },
    review_input_fingerprint: reviewFingerprint,
    goal_results: [goalResult],
    next_cycle_candidate_inputs: [],
  });
  const decidedId = 'CRV-M6-TRACE-DECIDED-001';
  await writeM6Object(root, `cycles/m6/reviews/${decidedId.toLowerCase()}.md`, {
    id: decidedId,
    record_type: 'cycle_review',
    status: 'decided',
    version: '1.0.0',
    created_at: M6_NOW,
    updated_at: M6_NOW,
    title: 'Synthetic decided review',
    test_scope: { ...M6_TEST_SCOPE },
    merchant_ref: M6_MERCHANT_ID,
    cycle_ref: M6_CYCLE_ID,
    reviewed_cycle_input_version: '1.0.7',
    review_input_snapshot_version: { ref: reviewSnapshot.snapshot.id, version: '1.0.0' },
    review_input_fingerprint: reviewFingerprint,
    goal_results: [goalResult],
    next_cycle_candidate_inputs: [],
    supersedes_ref: waitingId,
    approval: { ...M6_APPROVAL },
  });

  for (const [offset, review] of [
    [8, { id: waitingId, path: `cycles/m6/reviews/${waitingId.toLowerCase()}.md`, stage: 'review_waiting_human' }],
    [9, { id: decidedId, path: `cycles/m6/reviews/${decidedId.toLowerCase()}.md`, stage: 'review_decided' }],
  ]) {
    const gate = await buildCycleSnapshotPlan({
      workspace: root,
      id: `CIS-M6-TRACE-GATE-${String(offset).padStart(2, '0')}`,
      snapshotKind: 'transition',
      merchantRef: M6_MERCHANT_ID,
      cycleRef: M6_CYCLE_ID,
      runRef: M6_RUN_ID,
      sourcePaths: [review.path],
      artifactPaths: [{
        role: 'measurement_contract',
        path: 'execution/contracts/measurement-contract.json',
        media_type: 'application/json',
      }],
    });
    await materializeCycleSnapshot({ workspace: root, plan: gate });
    const transitionId = `CTR-M6-TRACE-${String(offset).padStart(2, '0')}`;
    await writeM6Object(root, `cycles/m6/transitions/${transitionId.toLowerCase()}.md`, {
      id: transitionId,
      record_type: 'cycle_transition',
      status: 'recorded',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      title: review.stage,
      test_scope: { ...M6_TEST_SCOPE },
      cycle_ref: M6_CYCLE_ID,
      goal_ref: 'GOAL-M6-TEST-001',
      operation_id: `trace-operation-${offset}`,
      operation_fingerprint: String(offset).repeat(64).slice(0, 64),
      expected_cycle_version: `1.0.${offset - 1}`,
      input_snapshot_version: { ref: snapshotPlan.snapshot.id, version: '1.0.0' },
      gate_snapshot_version: { ref: gate.snapshot.id, version: '1.0.0' },
      from_status: offset === 8 ? 'active' : 'waiting_human',
      to_status: offset === 8 ? 'waiting_human' : 'completed',
      from_stage: offset === 8 ? 'analytics_recorded' : 'review_waiting_human',
      to_stage: review.stage,
      required_gate_entry_keys: [
        ...gate.source_entries.map((entry) => entry.entry_key),
        ...gate.artifact_entries.map((entry) => entry.entry_key),
      ],
      lease_revision: offset,
      actor: offset === 8
        ? { kind: 'deterministic_tool' }
        : { kind: 'fixture_human', decision_ref: M6_APPROVAL.decision_ref },
    }, `# Trace transition ${offset}\n`);
    transitions.push(transitionId);
  }

  const completedTrack = {
    ...fixture.cycle.goal_tracks[0],
    stage: 'review_decided',
    review_input_snapshot_version: { ref: reviewSnapshot.snapshot.id, version: '1.0.0' },
  };
  await writeM6Object(root, 'cycles/m6/cycle.md', {
    ...fixture.cycle,
    status: 'completed',
    version: '1.0.9',
    aggregate_stage: 'review_decided',
    completion_scope: 'full',
    goal_tracks: [completedTrack],
    transition_refs: transitions,
    cycle_review_version: { ref: decidedId, version: '1.0.0' },
  }, '# M6 completed trace cycle\n');
  return {
    ...fixture,
    reviewSnapshot,
    transitions,
    preReviewSnapshots,
    preReviewEntryKeys: [...new Set(preReviewEntryKeys)].sort(),
    goalEntryKey: goalEntry.entry_key,
  };
}

export async function createM6AnalyticsReadyCycleWorkspace() {
  const fixture = await createM6CompletedTraceWorkspace();
  const analyticsTrack = {
    ...fixture.cycle.goal_tracks[0],
    stage: 'analytics_recorded',
    review_input_snapshot_version: null,
  };
  const cycle = {
    ...fixture.cycle,
    status: 'active',
    version: '1.0.7',
    aggregate_stage: 'analytics_recorded',
    completion_scope: 'none',
    goal_tracks: [analyticsTrack],
    transition_refs: fixture.transitions.slice(0, 7),
    cycle_review_version: null,
  };
  await writeM6Object(
    fixture.root,
    'cycles/m6/cycle.md',
    cycle,
    '# M6 analytics-ready cycle\n',
  );
  return {
    ...fixture,
    cycle,
    reviewCutoff: {
      baseFreezeSnapshotVersion: {
        ref: fixture.snapshotPlan.snapshot.id,
        version: fixture.snapshotPlan.snapshot.version,
      },
      preReviewTransitionSnapshotVersions: fixture.preReviewSnapshots,
      preReviewEntryKeys: fixture.preReviewEntryKeys,
    },
  };
}
