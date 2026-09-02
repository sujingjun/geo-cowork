import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdir,
  readFile,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import {
  M6_CYCLE_ID,
  M6_KNOWLEDGE_BASE_ID,
  M6_MERCHANT_ID,
  M6_NOW,
  M6_RUN_ID,
  M6_TEST_SCOPE,
  buildM6SnapshotPlan,
  createM6FixtureWorkspace,
  fixturePath,
  readM6FixtureJson,
  seedM6FreezeInputs,
  writeM6Object,
} from './helpers/m6-fixtures.mjs';
import { sha256, stableStringify } from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

async function snapshotApi() {
  return import('../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs');
}

async function preparedWorkspace() {
  const root = await createM6FixtureWorkspace();
  const inputs = await seedM6FreezeInputs(root);
  return { root, inputs };
}

function absolute(root, relative) {
  return path.join(root, ...relative.split('/'));
}

test('M6 冻结合同 fixture bytes 可复算且不含真实账号或因果声明', async () => {
  const measurement = await readM6FixtureJson('contracts/measurement-contract.json');
  const signal = await readM6FixtureJson('contracts/signal-rule.json');
  const policy = await readM6FixtureJson('contracts/sensitive-data-policy.json');
  const analytics = await readM6FixtureJson('analytics/complete.json');
  assert.equal(measurement.scope, 'test_only');
  assert.equal(measurement.causal_claim_allowed, false);
  assert.equal(signal.causal_claim, false);
  assert.equal(policy.unknown_binary, 'reject');
  assert.deepEqual(analytics.metrics.map((item) => item.metric_id), [
    'ai_visits', 'ai_registrations',
  ]);
  const bytes = await readFile(fixturePath('contracts/measurement-contract.json'));
  assert.match(sha256(bytes), /^[a-f0-9]{64}$/);
});

test('freeze CIS 保存完整 Markdown/artifact bytes、稳定 entry 排序与 manifest checksum', async () => {
  const { root, inputs } = await preparedWorkspace();
  try {
    const plan = await buildM6SnapshotPlan(root, inputs);
    const { materializeCycleSnapshot } = await snapshotApi();
    const result = await materializeCycleSnapshot({ workspace: root, plan });
    assert.equal(result.action, 'created');
    assert.equal(result.snapshot_id, plan.snapshot.id);

    const sourceKeys = plan.source_entries.map((item) => item.entry_key);
    const artifactKeys = plan.artifact_entries.map((item) => item.entry_key);
    assert.deepEqual(sourceKeys, [...sourceKeys].sort());
    assert.deepEqual(artifactKeys, [...artifactKeys].sort());
    for (const entry of plan.source_entries) {
      const original = await readFile(absolute(root, entry.object_path));
      const copy = await readFile(absolute(root, `runs/${M6_RUN_ID}/${entry.snapshot_path}`));
      assert.deepEqual(copy, original);
      assert.equal(sha256(copy), entry.file_sha256);
      assert.equal(entry.snapshot_sha256, entry.file_sha256);
    }
    for (const entry of plan.artifact_entries) {
      const original = await readFile(absolute(root, entry.source_path));
      const copy = await readFile(absolute(root, `runs/${M6_RUN_ID}/${entry.snapshot_path}`));
      assert.deepEqual(copy, original);
      assert.equal(sha256(copy), entry.source_sha256);
    }
    const manifest = await readFile(
      absolute(root, `runs/${M6_RUN_ID}/${plan.manifest.artifact_path}`),
      'utf8',
    );
    assert.equal(manifest, plan.manifest.bytes);
    assert.equal(sha256(manifest), plan.manifest.sha256);
    assert.equal(JSON.parse(manifest).fingerprint, plan.manifest.fingerprint);
  } finally {
    await rm(root, { recursive: true });
  }
});

test('transition/review/strategy CIS 分别冻结 gate、pre-review cutoff 与 strategy 输入', async () => {
  const { root, inputs } = await preparedWorkspace();
  try {
    const { materializeCycleSnapshot } = await snapshotApi();
    const freeze = await buildM6SnapshotPlan(root, inputs);
    await materializeCycleSnapshot({ workspace: root, plan: freeze });

    const transition = await buildM6SnapshotPlan(root, {
      ...inputs,
      id: 'CIS-M6-TEST-TRANSITION-001',
      snapshotKind: 'transition',
      sourcePaths: ['cycles/preparation/goal.md'],
      artifactPaths: [inputs.artifactPaths[0]],
    });
    await materializeCycleSnapshot({ workspace: root, plan: transition });

    const review = await buildM6SnapshotPlan(root, {
      ...inputs,
      id: 'CIS-M6-TEST-REVIEW-001',
      snapshotKind: 'review',
      baseFreezeSnapshotVersion: { ref: freeze.snapshot.id, version: '1.0.0' },
      preReviewTransitionSnapshotVersions: [{ ref: transition.snapshot.id, version: '1.0.0' }],
      preReviewEntryKeys: transition.source_entries.map((item) => item.entry_key),
    });
    const reviewResult = await materializeCycleSnapshot({ workspace: root, plan: review });
    assert.equal(reviewResult.snapshot_kind, 'review');
    const reviewManifest = JSON.parse(await readFile(
      absolute(root, `runs/${M6_RUN_ID}/${review.manifest.artifact_path}`),
      'utf8',
    ));
    assert.deepEqual(reviewManifest.base_freeze_snapshot_version, {
      ref: freeze.snapshot.id, version: '1.0.0',
    });
    assert.deepEqual(reviewManifest.pre_review_transition_snapshot_versions, [{
      ref: transition.snapshot.id, version: '1.0.0',
    }]);
    assert.equal(stableStringify(reviewManifest).includes('review_waiting_human'), false);
    assert.equal(stableStringify(reviewManifest).includes('review_decided'), false);

    const strategy = await buildM6SnapshotPlan(root, {
      ...inputs,
      id: 'CIS-M6-TEST-STRATEGY-001',
      snapshotKind: 'strategy',
      sourcePaths: [
        'cycles/preparation/goal.md',
        'queries/formal/query.md',
        'evidence/records/evidence.md',
      ],
      artifactPaths: [inputs.artifactPaths[2]],
    });
    const strategyResult = await materializeCycleSnapshot({ workspace: root, plan: strategy });
    assert.equal(strategyResult.snapshot_kind, 'strategy');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('active input 漂移返回 CYCLE_VERSION_DRIFT，completed history 仍从 snapshot copy 解析', async () => {
  const { root, inputs } = await preparedWorkspace();
  try {
    const plan = await buildM6SnapshotPlan(root, inputs);
    const {
      compareLiveInputsWithFreeze,
      loadSnapshotGraph,
      materializeCycleSnapshot,
    } = await snapshotApi();
    await materializeCycleSnapshot({ workspace: root, plan });
    const queryPath = 'queries/formal/query.md';
    await writeFile(absolute(root, queryPath), '# drifted live bytes\n');
    const drift = await compareLiveInputsWithFreeze({ workspace: root, plan });
    assert.equal(drift.ok, false);
    assert.ok(drift.errors.some((item) => item.code === 'CYCLE_VERSION_DRIFT'));

    await unlink(absolute(root, queryPath));
    const history = await loadSnapshotGraph({ workspace: root, plan });
    assert.equal(history.byId.get('Q-M6-TEST-001').data.record_type, 'query');
    assert.equal(history.source, 'snapshot_copies');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('CIS 半成品仅按同一 plan/checksum 补齐，相同 bytes kept、不同 bytes conflict', async (t) => {
  await t.test('same bytes resume', async () => {
    const { root, inputs } = await preparedWorkspace();
    try {
      const plan = await buildM6SnapshotPlan(root, inputs);
      const first = plan.source_entries[0];
      const target = absolute(root, `runs/${M6_RUN_ID}/${first.snapshot_path}`);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, await readFile(absolute(root, first.object_path)));
      const { materializeCycleSnapshot } = await snapshotApi();
      const result = await materializeCycleSnapshot({ workspace: root, plan });
      assert.equal(result.action, 'resumed');
      assert.ok(result.kept.includes(first.snapshot_path));
      assert.equal(
        await readFile(absolute(root, `runs/${M6_RUN_ID}/${plan.manifest.artifact_path}`), 'utf8'),
        plan.manifest.bytes,
      );
    } finally {
      await rm(root, { recursive: true });
    }
  });

  await t.test('different bytes conflict', async () => {
    const { root, inputs } = await preparedWorkspace();
    try {
      const plan = await buildM6SnapshotPlan(root, inputs);
      const first = plan.source_entries[0];
      const target = absolute(root, `runs/${M6_RUN_ID}/${first.snapshot_path}`);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, 'conflicting bytes\n');
      const { materializeCycleSnapshot } = await snapshotApi();
      await assert.rejects(
        materializeCycleSnapshot({ workspace: root, plan }),
        (error) => error.code === 'CYCLE_INPUT_SNAPSHOT_CONFLICT',
      );
      await assert.rejects(readFile(
        absolute(root, `runs/${M6_RUN_ID}/${plan.manifest.artifact_path}`),
      ), (error) => error.code === 'ENOENT');
    } finally {
      await rm(root, { recursive: true });
    }
  });
});

test('freeze CYC/CIS 双向物化在一侧已存在时只允许同一预分配 plan 恢复', async () => {
  const { root, inputs } = await preparedWorkspace();
  try {
    const plan = await buildM6SnapshotPlan(root, inputs);
    const goalEntry = plan.source_entries.find((item) => item.record_type === 'perception_goal');
    const querySetEntry = plan.source_entries.find((item) => item.record_type === 'query_set');
    const releaseEntry = plan.source_entries.find((item) => item.record_type === 'knowledge_release');
    const evidenceEntry = plan.source_entries.find((item) => item.record_type === 'evidence');
    const assetEntry = plan.source_entries.find((item) => item.record_type === 'asset');
    const profileEntry = plan.source_entries.find((item) => item.record_type === 'collector_profile');
    const cycleData = {
      id: M6_CYCLE_ID, record_type: 'cycle', status: 'proposed', version: '1.0.0',
      created_at: M6_NOW, updated_at: M6_NOW, title: 'M6 synthetic cycle',
      test_scope: { ...M6_TEST_SCOPE }, scope: 'knowledge_independent_engineering',
      merchant_ref: M6_MERCHANT_ID,
      knowledge_base_ref: M6_KNOWLEDGE_BASE_ID,
      execution_scope: 'synthetic_test',
      cycle_number: 1,
      core_versions: { input_snapshot: { ref: plan.snapshot.id, version: '1.0.0' } },
      aggregate_stage: 'prepared', completion_scope: 'none',
      goal_tracks: [{
        goal_entry_key: goalEntry.entry_key,
        input_snapshot_version: { ref: plan.snapshot.id, version: '1.0.0' },
        query_set_entry_key: querySetEntry.entry_key,
        knowledge_release_entry_keys: [releaseEntry.entry_key],
        evidence_entry_keys: [evidenceEntry.entry_key],
        asset_entry_keys: [assetEntry.entry_key],
        collector_profile_entry_keys: [profileEntry.entry_key],
        measurement_contract_entry_key: plan.artifact_entries
          .find((item) => item.role === 'measurement_contract').entry_key,
        stage: 'prepared', baseline_aggregation_refs: [], finding_refs: [],
        evidence_plan_refs: [], asset_proposal_refs: [], adoption_record_refs: [],
        publication_refs: [], technical_retest_run_refs: [], answer_retest_aggregation_refs: [],
        analytics_observation_refs: [], business_signal_refs: [], review_input_snapshot_version: null,
      }],
      transition_refs: [], cycle_review_version: null,
      predecessor_review_version: null, goal_selection_version: null,
    };
    plan.cycle = {
      path: 'cycles/m6/cycle.md',
      data: cycleData,
    };
    await writeM6Object(root, plan.cycle.path, plan.cycle.data, '# M6 synthetic cycle\n');
    const { materializeCycleFreeze } = await snapshotApi();
    const result = await materializeCycleFreeze({ workspace: root, plan });
    assert.equal(result.action, 'resumed');
    assert.equal(result.cycle_id, M6_CYCLE_ID);
    assert.equal(result.snapshot_id, plan.snapshot.id);
  } finally {
    await rm(root, { recursive: true });
  }
});
