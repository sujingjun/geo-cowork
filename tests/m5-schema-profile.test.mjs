import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  collectorProfileFingerprint,
  validateAnswerWorkspace,
} from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { buildIndexes } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  RECORD_TYPES,
  validateObjectData,
} from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  aggregateFixtureCycle,
  collectFixtureCycle,
  reviewFixtureCycle,
} from '../plugins/geo-expert/scripts/lib/answer-cycle.mjs';
import { source } from './helpers/object-fixtures.mjs';
import {
  collectorProfile,
  m5FixturePlan,
  m5ReadyWorkspace,
} from './helpers/m5-fixtures.mjs';

test('M5 注册七类对象且不反向破坏 M2 Source', () => {
  for (const type of [
    'collector_profile', 'answer_sample', 'citation_observation',
    'source_classification', 'claim_support_review', 'answer_review',
    'answer_aggregation',
  ]) assert.ok(RECORD_TYPES.includes(type), type);

  assert.equal(validateObjectData(source()).record_type, 'source');
  assert.equal(validateObjectData(collectorProfile()).record_type, 'collector_profile');
  assert.throws(
    () => validateObjectData({ ...collectorProfile(), unexpected: true }),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
});

test('Collector Profile fingerprint、frozen approval 与 unknown 规则可复验', async () => {
  const valid = collectorProfile();
  assert.equal(collectorProfileFingerprint(valid), valid.profile_fingerprint);
  assert.throws(
    () => validateObjectData({ ...valid, approval: undefined }),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );

  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  plan.profile.data.profile_fingerprint = '0'.repeat(64);
  await assert.rejects(
    collectFixtureCycle({ workspace: root, plan }),
    (error) => error.code === 'PROFILE_FINGERPRINT_MISMATCH',
  );
  await rm(root, { recursive: true });
});

test('M5 全链对象生成七类 index，workspace profile 无错误', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await collectFixtureCycle({ workspace: root, plan });
  await reviewFixtureCycle({ workspace: root, plan });
  await aggregateFixtureCycle({ workspace: root, plan });

  const validation = await validateAnswerWorkspace({ workspace: root });
  assert.deepEqual(validation.errors, []);
  const built = await buildIndexes({ workspace: root });
  for (const name of [
    'collector-profiles.json', 'answer-samples.json', 'citation-observations.json',
    'source-classifications.json', 'claim-support-reviews.json',
    'answer-reviews.json', 'answer-aggregations.json',
  ]) assert.ok(built.indexes.includes(name), name);
  const samples = JSON.parse(await readFile(path.join(root, 'indexes/answer-samples.json'), 'utf8'));
  assert.equal(samples.objects.length, 2);
  await rm(root, { recursive: true });
});
