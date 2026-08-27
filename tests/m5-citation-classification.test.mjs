import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  materializeClaimSupportReview,
  materializeSourceClassification,
  rejectExternalRankingImport,
} from '../plugins/geo-expert/scripts/lib/citation-analysis.mjs';
import { collectFixtureCycle } from '../plugins/geo-expert/scripts/lib/answer-cycle.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import {
  materializeCitationSourcePair,
  normalizeCitationUrl,
} from '../plugins/geo-expert/scripts/lib/source-registry.mjs';
import { sourceClassificationQueueStatus } from '../plugins/geo-expert/scripts/lib/m5-policy.mjs';
import { m5FixturePlan, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

test('Citation URL 规范化保留 path/query 并处理 IDN、默认端口、fragment 与 www', () => {
  assert.deepEqual(
    normalizeCitationUrl('HTTPS://www.BÜCHER.example:443/a?q=1#x'),
    {
      url_normalized: 'https://www.xn--bcher-kva.example/a?q=1',
      citation_domain: 'xn--bcher-kva.example',
    },
  );
  assert.throws(
    () => normalizeCitationUrl('not a url'),
    (error) => error.code === 'CITATION_URL_INVALID',
  );
});

test('Citation/Source 双向 materialization 可从半成品恢复且拒绝无观测候选', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  plan.samples[0].citations = [plan.samples[0].citations[0]];
  const collected = await collectFixtureCycle({ workspace: root, plan, stopAfter: 'samples' });
  const sample = collected.samples[0];
  const occurrence = plan.samples[0].citations[0];
  await assert.rejects(
    materializeCitationSourcePair({
      workspace: root, sample, occurrence, now: sample.captured_at, failAfter: 'citation',
    }),
    (error) => error.code === 'INJECTED_FAILURE',
  );
  const resumed = await materializeCitationSourcePair({
    workspace: root, sample, occurrence, now: sample.captured_at,
  });
  assert.equal(resumed.source_ref, 'SRC-M5-BRAND-001');
  const graph = await loadWorkspaceGraph({ workspace: root });
  assert.equal(graph.byId.get('CIT-TEST-001').data.source_ref, 'SRC-M5-BRAND-001');
  assert.equal(graph.byId.get('SRC-M5-BRAND-001').data.discovery.citation_ref, 'CIT-TEST-001');

  await assert.rejects(
    materializeSourceClassification({
      workspace: root,
      sourceId: 'SRC-MISSING-001',
      citationIds: [],
      plan: occurrence.classification,
      now: sample.captured_at,
    }),
    (error) => error.code === 'SOURCE_CANDIDATE_UNOBSERVED',
  );
  await rm(root, { recursive: true });
});

test('Source Classification 与 Claim Support 独立，外部榜单入口显式禁止', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await collectFixtureCycle({ workspace: root, plan });
  const occurrence = plan.samples[0].citations[0];
  const classification = await materializeSourceClassification({
    workspace: root,
    sourceId: occurrence.source.id,
    citationIds: [occurrence.id],
    plan: occurrence.classification,
    now: plan.samples[0].captured_at,
  });
  const support = await materializeClaimSupportReview({
    workspace: root,
    citationId: occurrence.id,
    classificationId: classification.id,
    plan: { ...occurrence.claim_support, verdict: 'not_supported' },
    now: plan.samples[0].captured_at,
  });
  assert.equal(classification.primary_source_type, 'official_fact');
  assert.equal(support.verdict, 'not_supported');
  assert.throws(
    () => rejectExternalRankingImport({ domains: ['example.invalid'] }),
    (error) => error.code === 'EXTERNAL_RANKING_IMPORT_FORBIDDEN',
  );
  await rm(root, { recursive: true });
});

test('后续 Citation 复用既有 Source，不改写首次 discovery 字节', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  const collected = await collectFixtureCycle({ workspace: root, plan, stopAfter: 'samples' });
  const first = plan.samples[0].citations[0];
  await materializeCitationSourcePair({
    workspace: root, sample: collected.samples[0], occurrence: first,
    now: collected.samples[0].captured_at,
  });
  const sourcePath = path.join(root, first.source.path);
  const before = await readFile(sourcePath);
  const classification = await materializeSourceClassification({
    workspace: root,
    sourceId: first.source.id,
    citationIds: [first.id],
    plan: first.classification,
    now: collected.samples[0].captured_at,
  });
  const later = structuredClone(first);
  later.id = 'CIT-TEST-101';
  later.path = 'cycles/m5/citations/cit-101.md';
  later.occurrence_index = 3;
  later.position = { kind: 'ui_order', order: 3 };
  later.url_raw = 'https://brand.example.invalid/help#later';
  const result = await materializeCitationSourcePair({
    workspace: root, sample: collected.samples[0], occurrence: later,
    now: '2026-08-25T02:00:00+08:00',
  });
  assert.equal(result.source_action, 'kept');
  const reusedClassification = await materializeSourceClassification({
    workspace: root,
    sourceId: first.source.id,
    citationIds: [later.id],
    plan: first.classification,
    now: '2026-08-25T02:00:00+08:00',
  });
  assert.equal(reusedClassification.action, 'kept');
  assert.equal(reusedClassification.id, classification.id);
  assert.deepEqual(await readFile(sourcePath), before);
  const graph = await loadWorkspaceGraph({ workspace: root });
  assert.equal(graph.byId.get(first.source.id).data.discovery.citation_ref, first.id);
  assert.equal(graph.byId.get(later.id).data.source_ref, first.source.id);
  await rm(root, { recursive: true });
});

test('Source 分类队列在 100 个唯一 Source 时才进入 batch_ready', () => {
  assert.equal(sourceClassificationQueueStatus(0), 'archived_unclassified');
  assert.equal(sourceClassificationQueueStatus(99), 'archived_unclassified');
  assert.equal(sourceClassificationQueueStatus(100), 'batch_ready');
});
