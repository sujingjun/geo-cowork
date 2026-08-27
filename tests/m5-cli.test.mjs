import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { m5FixturePlan, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/answer-cycle.mjs');

test('M5 CLI 从非仓库 cwd 以 no-network recorded Fixture 跑通全链', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  const planPath = path.join(root, 'fixtures/m5/plan.json');
  await writeFile(planPath, JSON.stringify(plan, null, 2));
  const commands = ['plan', 'collect-fixture', 'review', 'aggregate', 'validate'];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('NETWORK_FORBIDDEN'); };
  try {
    for (const command of commands) {
      const args = [CLI, command, '--workspace', root];
      if (command !== 'validate') args.push('--plan', planPath);
      const result = await exec(process.execPath, args, {
        cwd: os.tmpdir(),
        env: { ...process.env, GEO_ANSWER_NETWORK_DISABLED: '1' },
      });
      const parsed = JSON.parse(result.stdout);
      if (command === 'validate') assert.deepEqual(parsed.errors, []);
      else assert.equal(parsed.ok, true);
    }
  } finally {
    globalThis.fetch = originalFetch;
    await rm(root, { recursive: true });
  }
});

test('M5 CLI 不提供外部榜单 import 或真实 collect 绕过入口', async () => {
  const root = await m5ReadyWorkspace();
  await assert.rejects(
    exec(process.execPath, [CLI, 'import-ranking', '--workspace', root], { cwd: os.tmpdir() }),
    (error) => error.code === 1 && error.stderr.includes('INVALID_ARGUMENT'),
  );
  await assert.rejects(
    exec(process.execPath, [CLI, 'collect', '--workspace', root, '--platform', 'chatgpt'], { cwd: os.tmpdir() }),
    (error) => error.code === 1 && error.stderr.includes('PLATFORM_TERMS_BLOCKED'),
  );
  await rm(root, { recursive: true });
});

test('M5 CLI 可从非仓库 cwd 完成两槽 manual baseline、candidate Review 与 partial Aggregation', async () => {
  const root = await m5ReadyWorkspace();
  const manifest = {
    schema_version: 'm5-manual-baseline-batch-v1',
    ordinal: 1,
    captured_at: '2026-08-25T03:00:00+08:00',
    profile_frozen_at: '2026-08-25T03:00:00+08:00',
    time_window: {
      id: 'TW-TEST-MANUAL-BASELINE',
      starts_at: '2026-08-25T00:00:00+08:00',
      ends_at: '2026-08-26T00:00:00+08:00',
    },
    object_key: 'synthetic-brand-definition',
    decision_ref: 'workspace://cycles/preparation/decisions/m5-two-slot-approved.md',
    goal: { ref: 'GOAL-TEST-001', version: '1.0.0' },
    query: { ref: 'Q-TEST-001', version: '1.0.0', language: 'en-US' },
    query_set: { ref: 'QS-TEST-001', version: '1.0.0' },
    knowledge_release: { ref: 'KR-TEST-001', version: '1.0.0' },
    claims: [{ ref: 'CLM-TEST-001', version: '1.0.0' }],
    entries: [{
      platform: 'chatgpt',
      profile_id: 'CPF-TEST-CLI-MANUAL-BASELINE-001',
      run_id: 'RUN-TEST-CLI-MANUAL-BASELINE-001',
      sample_id: 'SMP-TEST-CLI-MANUAL-BASELINE-S1-001',
      product_entry: 'https://chatgpt.com/',
      result_url: 'https://chatgpt.com/share/test-cli-result',
      answer_text: 'Synthetic CLI baseline answer.\n',
      citations: [],
    }],
  };
  const manifestPath = path.join(root, 'fixtures/m5/manual-baseline.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  const collected = await exec(process.execPath, [
    CLI, 'collect-manual-batch', '--workspace', root, '--plan', manifestPath,
  ], { cwd: os.tmpdir() });
  assert.equal(JSON.parse(collected.stdout).results[0].purpose, 'baseline');

  const reviewManifest = {
    schema_version: 'm5-manual-review-batch-v1',
    reviewed_at: manifest.captured_at,
    decision_ref: manifest.decision_ref,
    rubric: { version: '2.0.0', definition: { core_fields: ['current_positioning'] } },
    entries: [{
      sample_ref: manifest.entries[0].sample_id,
      review_id: 'ARV-TEST-CLI-MANUAL-BASELINE-S1-001',
      core: {
        entity_recognition: 'pass', core_fact_accuracy: 'partial',
        current_positioning: 'partial', risk_boundary: 'partial', citation_quality: 'partial',
      },
      exploratory: {
        comparison_dimensions: [], recommendation_reasons: [], exclusion_reasons: [],
        competitor_mentions: [], source_structure_notes: [], decision_dimension_candidates: [],
      },
    }],
  };
  const reviewPath = path.join(root, 'fixtures/m5/manual-review.json');
  await writeFile(reviewPath, JSON.stringify(reviewManifest, null, 2));
  const reviewed = await exec(process.execPath, [
    CLI, 'review-manual-batch', '--workspace', root, '--plan', reviewPath,
  ], { cwd: os.tmpdir() });
  assert.equal(JSON.parse(reviewed.stdout).reviews[0].status, 'candidate');

  const secondManifest = structuredClone(manifest);
  secondManifest.ordinal = 2;
  secondManifest.captured_at = '2026-08-25T04:00:00+08:00';
  secondManifest.entries[0].sample_id = 'SMP-TEST-CLI-MANUAL-BASELINE-S2-001';
  secondManifest.entries[0].result_url = 'https://chatgpt.com/share/test-cli-result-2';
  secondManifest.entries[0].answer_text = 'Synthetic CLI baseline answer two.\n';
  const secondPath = path.join(root, 'fixtures/m5/manual-baseline-2.json');
  await writeFile(secondPath, JSON.stringify(secondManifest, null, 2));
  await exec(process.execPath, [
    CLI, 'collect-manual-batch', '--workspace', root, '--plan', secondPath,
  ], { cwd: os.tmpdir() });

  const secondReview = structuredClone(reviewManifest);
  secondReview.reviewed_at = secondManifest.captured_at;
  secondReview.entries[0].sample_ref = secondManifest.entries[0].sample_id;
  secondReview.entries[0].review_id = 'ARV-TEST-CLI-MANUAL-BASELINE-S2-001';
  const secondReviewPath = path.join(root, 'fixtures/m5/manual-review-2.json');
  await writeFile(secondReviewPath, JSON.stringify(secondReview, null, 2));
  await exec(process.execPath, [
    CLI, 'review-manual-batch', '--workspace', root, '--plan', secondReviewPath,
  ], { cwd: os.tmpdir() });

  const aggregationManifest = {
    schema_version: 'm5-manual-aggregation-batch-v1',
    computed_at: secondManifest.captured_at,
    industry: 'synthetic-services',
    query_cluster: {
      id: 'QC-TEST-CLI-MANUAL', label: 'Synthetic manual definition',
      query_versions: [{ ref: 'Q-TEST-001', version: '1.0.0' }],
    },
    entries: [{
      profile_ref: manifest.entries[0].profile_id,
      sample_refs: [manifest.entries[0].sample_id, secondManifest.entries[0].sample_id],
      aggregation_id: 'AGG-TEST-CLI-MANUAL-BASELINE-001',
    }],
  };
  const aggregationPath = path.join(root, 'fixtures/m5/manual-aggregation.json');
  await writeFile(aggregationPath, JSON.stringify(aggregationManifest, null, 2));
  const aggregated = await exec(process.execPath, [
    CLI, 'aggregate-manual-batch', '--workspace', root, '--plan', aggregationPath,
  ], { cwd: os.tmpdir() });
  const aggregation = JSON.parse(aggregated.stdout).aggregations[0];
  assert.equal(aggregation.status, 'computed');
  assert.equal(aggregation.metrics.selected_sample_count, 2);
  await rm(root, { recursive: true });
});
