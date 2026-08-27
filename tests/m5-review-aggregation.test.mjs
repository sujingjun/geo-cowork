import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  aggregateFixtureCycle,
  collectFixtureCycle,
  reviewFixtureCycle,
} from '../plugins/geo-expert/scripts/lib/answer-cycle.mjs';
import {
  compareCollectorProfiles,
  sourceVolatility,
} from '../plugins/geo-expert/scripts/lib/answer-aggregation.mjs';
import { materializeAnswerReview } from '../plugins/geo-expert/scripts/lib/answer-review.mjs';
import { archiveObservedSourcesForBatchClassification } from '../plugins/geo-expert/scripts/lib/source-batch.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { collectorProfile, m5FixturePlan, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

test('同一 raw 可产生新 Rubric Review，旧 raw 与 Review 字节不变', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await collectFixtureCycle({ workspace: root, plan });
  await reviewFixtureCycle({ workspace: root, plan });
  const rawPath = path.join(root, 'runs/RUN-TEST-M5-001/raw/slot-1/answer.txt');
  const reviewPath = path.join(root, 'cycles/m5/reviews/arv-001.md');
  const rawBefore = await readFile(rawPath);
  const reviewBefore = await readFile(reviewPath);
  const second = structuredClone(plan.samples[0].answer_review);
  second.id = 'ARV-TEST-101';
  second.path = 'cycles/m5/reviews/arv-101.md';
  second.rubric.version = '2.0.0';
  second.rubric.definition.core_fields.push('new_fixture_field');
  await materializeAnswerReview({
    workspace: root,
    sampleId: plan.samples[0].id,
    claimSupportIds: plan.samples[0].citations.map((item) => item.claim_support.id),
    plan: second,
    now: plan.samples[0].captured_at,
  });
  assert.deepEqual(await readFile(rawPath), rawBefore);
  assert.deepEqual(await readFile(reviewPath), reviewBefore);
  await rm(root, { recursive: true });
});

test('五项指标、状态计数和零分母按手算 Fixture 确定', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await collectFixtureCycle({ workspace: root, plan });
  await reviewFixtureCycle({ workspace: root, plan });
  await aggregateFixtureCycle({ workspace: root, plan });
  const aggregation = await readMarkdownObject(
    path.join(root, plan.aggregation.path), { workspace: root },
  );
  const metrics = aggregation.data.metrics;
  assert.equal(metrics.total_citation_units, 2);
  assert.deepEqual(metrics.outcome_counts, {
    success: 1, refusal: 1, timeout: 0, no_result: 0,
    challenge: 0, cancelled: 0, system_failure: 0,
  });
  assert.equal(metrics.top_citation_domains[0].count, 1);
  assert.equal(metrics.top_citation_domains[0].share, 0.5);
  assert.equal(metrics.source_diversity.distinct_source_types, 2);
  assert.equal(metrics.source_diversity.classification_coverage, 1);
  assert.equal(metrics.party_relation.first_party_count, 1);
  assert.equal(metrics.party_relation.third_party_count, 1);
  assert.equal(metrics.party_relation.ratio, 1);
  assert.equal(metrics.no_citation_answer_count, 1);
  await rm(root, { recursive: true });
});

test('comparability 不把 unknown 当通配符，硬差异为 false', () => {
  const base = collectorProfile();
  assert.equal(compareCollectorProfiles(base, base).result, true);
  const unknown = collectorProfile({ region: 'unknown' });
  assert.equal(compareCollectorProfiles(base, unknown).result, 'partial');
  const otherLanguage = collectorProfile({ language: 'zh-CN' });
  assert.equal(compareCollectorProfiles(base, otherLanguage).result, false);
});

test('无 Citation 使用 null + reason，Source Volatility 按 total variation 计算', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  for (const sample of plan.samples) sample.citations = [];
  await collectFixtureCycle({ workspace: root, plan });
  await reviewFixtureCycle({ workspace: root, plan });
  await aggregateFixtureCycle({ workspace: root, plan });
  const aggregation = await readMarkdownObject(
    path.join(root, plan.aggregation.path), { workspace: root },
  );
  assert.equal(aggregation.data.metrics.total_citation_units, 0);
  assert.equal(aggregation.data.metrics.citation_share.reason, 'NO_CITATIONS');
  assert.equal(aggregation.data.metrics.source_diversity.normalized_source_type_entropy, null);
  assert.equal(aggregation.data.metrics.party_relation.ratio, null);

  assert.deepEqual(sourceVolatility({
    previousDomains: [
      { domain: 'a.invalid', count: 1, share: 0.5 },
      { domain: 'b.invalid', count: 1, share: 0.5 },
    ],
    currentDomains: [{ domain: 'a.invalid', count: 2, share: 1 }],
    comparability: true,
    previousWindow: {
      starts_at: '2026-08-23T00:00:00Z', ends_at: '2026-08-24T00:00:00Z',
    },
    currentWindow: {
      starts_at: '2026-08-24T00:00:00Z', ends_at: '2026-08-25T00:00:00Z',
    },
  }), { value: 0.5, reason: null });
  await rm(root, { recursive: true });
});

test('100 Source 前允许两槽聚合保留分类指标为 partial/unknown', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await collectFixtureCycle({ workspace: root, plan });
  await reviewFixtureCycle({ workspace: root, plan });
  await archiveObservedSourcesForBatchClassification({
    workspace: root,
    decisionRef: 'workspace://cycles/preparation/decisions/m5-source-batch-approved.md',
    now: '2026-08-25T02:00:00+08:00',
  });
  await aggregateFixtureCycle({ workspace: root, plan });
  const aggregation = await readMarkdownObject(
    path.join(root, plan.aggregation.path), { workspace: root },
  );
  assert.equal(aggregation.data.metrics.expected_sample_count, 2);
  assert.equal(aggregation.data.metrics.source_diversity.classification_coverage, 0);
  assert.equal(aggregation.data.metrics.source_diversity.status, 'partial');
  assert.equal(aggregation.data.metrics.party_relation.unknown_count, 2);
  assert.equal(aggregation.data.metrics.classification_counts.archived_unclassified, 2);
  assert.deepEqual(aggregation.data.classification_versions, []);
  assert.deepEqual(aggregation.data.claim_support_review_versions, []);
  await rm(root, { recursive: true });
});
