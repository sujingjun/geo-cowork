import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  mkdir,
  mkdtemp,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  collectFixtureCycle,
} from '../plugins/geo-expert/scripts/lib/answer-cycle.mjs';
import {
  collectorProfileFingerprint,
} from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import {
  buildCycleSnapshotPlan,
  materializeCycleSnapshot,
} from '../plugins/geo-expert/scripts/lib/cycle-snapshot.mjs';
import {
  collectObjectReferences,
} from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  assertDevelopmentWorkspaceWriteAllowed,
  preflightTestKnowledgeWrite,
} from '../plugins/geo-expert/scripts/lib/workspace-scope.mjs';
import {
  validateWorkspace,
} from '../plugins/geo-expert/scripts/workspace-validate.mjs';
import {
  M6_CYCLE_ID,
  M6_MERCHANT_ID,
  M6_NOW,
  M6_RUN_ID,
  M6_TEST_SCOPE,
  createM6FixtureWorkspace,
  seedM6FreezeInputs,
  writeM6Object,
} from './helpers/m6-fixtures.mjs';
import {
  m5FixturePlan,
  m5ReadyWorkspace,
} from './helpers/m5-fixtures.mjs';
import {
  capture,
  pathExists,
  treeDigest,
} from './helpers/m6-adversarial-fixtures.mjs';

test('P0: formal sampling_count 3 必须在任何 Profile/Run 写入前拒绝', async () => {
  const root = await m5ReadyWorkspace();
  try {
    const plan = m5FixturePlan();
    plan.run.id = 'RUN-TEST-M5-ADVERSARIAL-3SLOT';
    plan.profile.data.sampling_count = 3;
    plan.profile.data.profile_fingerprint = collectorProfileFingerprint(plan.profile.data);
    plan.samples.push({
      ...plan.samples[1],
      id: 'SMP-TEST-ADVERSARIAL-003',
      path: 'cycles/m5/samples/smp-test-adversarial-003.md',
      ordinal: 3,
      citations: [],
      artifacts: [{
        role: 'collector_log',
        source_path: 'fixtures/m5/slot-3-timeout-log.json',
        output_path: 'raw/slot-3/collector-log.json',
        media_type: 'application/json',
      }],
    });
    const before = await treeDigest(root);
    const outcome = await capture(() => collectFixtureCycle({ workspace: root, plan }));
    const actual = {
      rejected: !outcome.ok,
      unchanged: await treeDigest(root) === before,
      run_created: await pathExists(root, `runs/${plan.run.id}/run.md`),
    };
    assert.deepEqual(actual, {
      rejected: true,
      unchanged: true,
      run_created: false,
    }, '三槽正式计划必须在全量预检阶段 fail closed 且零写');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: unresolved/type/version refs 必须由 synthetic 写前预检拒绝', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    const commonQuery = {
      id: 'Q-M6-ADVERSARIAL-REF-001',
      record_type: 'query',
      status: 'candidate',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      test_scope: { ...M6_TEST_SCOPE },
      query_text: 'Synthetic adversarial query?',
      language: 'en-US',
    };
    const candidates = [
      {
        ...commonQuery,
        goal_refs: ['GOAL-EXTERNAL-NONEXISTENT-001'],
      },
      {
        ...commonQuery,
        id: 'Q-M6-ADVERSARIAL-REF-002',
        goal_refs: ['SRC-M6-TEST-001'],
      },
      {
        id: 'ANS-M6-ADVERSARIAL-REF-003',
        record_type: 'answer_card',
        status: 'candidate',
        version: '1.0.0',
        created_at: M6_NOW,
        updated_at: M6_NOW,
        test_scope: { ...M6_TEST_SCOPE },
        query_refs: ['Q-M6-TEST-001'],
        claim_versions: [{ ref: 'CLM-M6-TEST-001', version: '9.9.9' }],
        evidence_refs: ['EVD-M6-TEST-001'],
        direct_answer: 'Synthetic.',
        limitations: [],
        forbidden_statements: [],
      },
    ];
    const before = await treeDigest(root);
    const outcomes = await Promise.all(candidates.map((data) => capture(() =>
      preflightTestKnowledgeWrite({ workspace: root, data, body: '# Synthetic\n' }))));
    assert.deepEqual({
      rejected: outcomes.map((outcome) => !outcome.ok),
      unchanged: await treeDigest(root) === before,
    }, {
      rejected: [true, true, true],
      unchanged: true,
    }, 'unresolved、wrong-type、wrong-version ref 必须在写前全部失败');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P0: 同 basename 的 CIS artifact 冲突必须在任何 snapshot copy 写入前失败', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    await mkdir(path.join(root, 'execution/other'), { recursive: true });
    await writeFile(
      path.join(root, 'execution/other/measurement-contract.json'),
      '{"different":true}\n',
    );
    const plan = await buildCycleSnapshotPlan({
      workspace: root,
      id: 'CIS-M6-ADVERSARIAL-COLLISION-001',
      snapshotKind: 'transition',
      merchantRef: M6_MERCHANT_ID,
      cycleRef: M6_CYCLE_ID,
      runRef: M6_RUN_ID,
      sourcePaths: ['cycles/preparation/goal.md'],
      artifactPaths: [
        {
          role: 'measurement_contract',
          path: 'execution/contracts/measurement-contract.json',
          media_type: 'application/json',
        },
        {
          role: 'other_contract',
          path: 'execution/other/measurement-contract.json',
          media_type: 'application/json',
        },
      ],
    });
    const before = await treeDigest(root);
    const outcome = await capture(() => materializeCycleSnapshot({ workspace: root, plan }));
    const collidingCopy = 'runs/RUN-M6-CIS-001/outputs/snapshots/'
      + 'cis-m6-adversarial-collision-001/artifacts/measurement-contract.json';
    assert.deepEqual({
      rejected: !outcome.ok,
      unchanged: await treeDigest(root) === before,
      partial_copy_left: await pathExists(root, collidingCopy),
    }, {
      rejected: true,
      unchanged: true,
      partial_copy_left: false,
    }, 'target-set 冲突必须在 materialization 第一字节之前被发现');
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P1: M6 Cycle core_versions.input_snapshot 只允许 CIS', () => {
  const refs = collectObjectReferences({
    id: 'CYC-M6-ADVERSARIAL-REF-001',
    record_type: 'cycle',
    scope: 'knowledge_independent_engineering',
    core_versions: {
      input_snapshot: { ref: 'EVD-M6-TEST-001', version: '1.0.0' },
    },
  });
  const inputSnapshot = refs.find((item) => item.field === 'core_versions.input_snapshot');
  assert.deepEqual(
    inputSnapshot?.allowedTypes,
    ['cycle_input_snapshot'],
    'M6 input_snapshot 不得由 RECORD_TYPES 通配放行',
  );
});

test('P1: workspace-validate --objects 必须聚合 M6 existing-type profile', async () => {
  const root = await createM6FixtureWorkspace();
  try {
    await seedM6FreezeInputs(root);
    await writeM6Object(root, 'cycles/m6/invalid-profile-cycle.md', {
      id: 'CYC-M6-ADVERSARIAL-PROFILE-001',
      record_type: 'cycle',
      status: 'proposed',
      version: '1.0.0',
      created_at: M6_NOW,
      updated_at: M6_NOW,
      scope: 'knowledge_independent_engineering',
      core_versions: {},
    });
    const result = await validateWorkspace(root, { objects: true });
    assert.equal(result.ok, false, 'base graph 通过不能掩盖 M6 Cycle profile 缺字段');
    assert.ok(
      result.object_errors.some((item) => item.code === 'M6_FIELD_REQUIRED'),
      '聚合入口必须返回 M6_FIELD_REQUIRED',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('P1: test Workspace 根为 symlink 时所有 M6 写路径必须 fail closed', async () => {
  const target = await createM6FixtureWorkspace();
  const parent = await mkdtemp(path.join(os.tmpdir(), 'geo-m6-root-link-'));
  const linked = path.join(parent, 'linked-workspace');
  try {
    await seedM6FreezeInputs(target);
    await symlink(target, linked, 'dir');
    const outcome = await capture(() => assertDevelopmentWorkspaceWriteAllowed({ workspace: linked }));
    assert.equal(outcome.ok, false, 'Workspace 根 symlink 不得通过身份预检');
    assert.equal(outcome.error?.code, 'SYMLINK_NOT_ALLOWED');
  } finally {
    await rm(parent, { recursive: true });
    await rm(target, { recursive: true });
  }
});
