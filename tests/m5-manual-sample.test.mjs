import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import { ingestManualSample } from '../plugins/geo-expert/scripts/lib/answer-manual.mjs';
import {
  collectorProfileFingerprint,
  validateAnswerWorkspace,
} from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { readRun } from '../plugins/geo-expert/scripts/lib/run-store.mjs';
import { collectorProfile, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

function manualPlan() {
  const profile = collectorProfile({
    id: 'CPF-TEST-MANUAL-001',
    title: 'Synthetic manual profile',
    product_entry: 'https://chatgpt.com/?temporary-chat=true',
    login_state: 'logged_in',
    web_search_state: 'unknown',
    model_mode: 'unknown',
    collection_method: 'manual',
  });
  return {
    schema_version: 'm5-manual-sample-plan-v1',
    purpose: 'exploratory',
    authorization_ref: 'workspace://cycles/preparation/decisions/m5-manual-authorized.md',
    profile: { path: 'cycles/m5/profiles/cpf-test-manual-001.md', data: profile },
    run: { id: 'RUN-TEST-M5-MANUAL-001' },
    input_versions: {
      'GOAL-TEST-001': '1.0.0',
      'Q-TEST-001': '1.0.0',
      'QS-TEST-001': '1.0.0',
      'KR-TEST-001': '1.0.0',
      'CLM-TEST-001': '1.0.0',
      'CPF-TEST-MANUAL-001': '1.0.0',
    },
    goal_refs: ['GOAL-TEST-001'],
    query_set_versions: [{ ref: 'QS-TEST-001', version: '1.0.0' }],
    knowledge_release_versions: [{ ref: 'KR-TEST-001', version: '1.0.0' }],
    query_version: { ref: 'Q-TEST-001', version: '1.0.0' },
    collector_contract: {
      schema_version: '1.0.0', collector_version: 'manual-owner-v1',
      tool_policy_version: 'm5-manual-privacy-v1',
    },
    sample: {
      id: 'SMP-TEST-MANUAL-001',
      path: 'cycles/m5/samples/smp-test-manual-001.md',
      ordinal: 1,
      outcome: 'success',
      captured_at: '2026-08-25T03:00:00+08:00',
      answer_output_path: 'raw/slot-1/answer.md',
      log_output_path: 'raw/slot-1/collector-log.json',
      citations: [
        {
          id: 'CIT-TEST-MANUAL-001',
          path: 'cycles/m5/citations/cit-test-manual-001.md',
          occurrence_index: 1,
          position: { kind: 'ui_order', order: 1 },
          url_raw: 'https://example.invalid/source#answer',
          anchor_or_context: 'Synthetic existing source citation.',
          existing_source_ref: 'SRC-TEST-001',
          classification: {
            id: 'SCL-TEST-MANUAL-001',
            path: 'cycles/m5/classifications/scl-test-manual-001.md',
            status: 'candidate',
            primary_source_type: 'official_fact',
            secondary_source_types: [],
            party_relation: 'first_party',
            subject_workspace: 'synthetic-brand',
            basis: {
              page_owner: 'Synthetic Brand', content_form: 'official',
              evidence: ['Manual answer exposed this Citation; page support remains unreviewed.'],
            },
            confidence: 'low',
            reviewer: { kind: 'geo_expert', identifier: 'manual-smoke-v1' },
            review_required: true,
          },
        },
        {
          id: 'CIT-TEST-MANUAL-002',
          path: 'cycles/m5/citations/cit-test-manual-002.md',
          occurrence_index: 2,
          position: { kind: 'ui_order', order: 2 },
          url_raw: 'https://community.example.invalid/post',
          anchor_or_context: 'Synthetic new source citation.',
          source: {
            id: 'SRC-TEST-MANUAL-COMMUNITY-001',
            path: 'evidence/sources/src-test-manual-community-001.md',
            name: 'Synthetic community source',
            locator: 'https://community.example.invalid/post',
            identity: {
              level: 'page', key: 'page:https://community.example.invalid/post',
              citation_domain: 'community.example.invalid', host_platform: 'other',
              publisher_name: 'unknown',
            },
          },
          classification: {
            id: 'SCL-TEST-MANUAL-002',
            path: 'cycles/m5/classifications/scl-test-manual-002.md',
            status: 'candidate',
            primary_source_type: 'community_experience',
            secondary_source_types: [],
            party_relation: 'third_party',
            subject_workspace: 'synthetic-brand',
            basis: {
              page_owner: 'unknown', content_form: 'community_post',
              evidence: ['Manual answer exposed this Citation; identity remains unreviewed.'],
            },
            confidence: 'low',
            reviewer: { kind: 'geo_expert', identifier: 'manual-smoke-v1' },
            review_required: true,
          },
        },
      ],
    },
  };
}

function baselineManualPlan({ ordinal = 1, runId = 'RUN-TEST-M5-MANUAL-BASELINE-001' } = {}) {
  const plan = manualPlan();
  plan.schema_version = 'm5-manual-baseline-plan-v2';
  plan.purpose = 'baseline';
  plan.classification_policy = {
    mode: 'batch_at_source_threshold',
    threshold: 100,
    decision_ref: 'workspace://cycles/preparation/decisions/m5-two-slot-source-batch-approved.md',
  };
  plan.language_contract = {
    role: 'primary',
    object_key: 'myyshop-definition',
    primary_language: 'en-US',
    primary_query_ref: 'Q-TEST-001',
    semantic_contract_ref: 'workspace://cycles/preparation/decisions/m5-two-slot-source-batch-approved.md',
  };
  plan.manual_source = {
    kind: 'user_supplied_result_url',
    result_url: 'https://chatgpt.com/share/test-result',
    capture_surface: 'chrome_extension',
  };
  plan.profile.data.id = 'CPF-TEST-MANUAL-BASELINE-001';
  plan.profile.data.title = 'Synthetic two-slot manual baseline profile';
  plan.profile.data.language = 'en-US';
  plan.profile.data.language_contract = plan.language_contract;
  plan.profile.data.sampling_count = 2;
  plan.profile.data.profile_fingerprint = collectorProfileFingerprint(plan.profile.data);
  plan.profile.path = 'cycles/m5/profiles/cpf-test-manual-baseline-001.md';
  delete plan.input_versions['CPF-TEST-MANUAL-001'];
  plan.input_versions['CPF-TEST-MANUAL-BASELINE-001'] = '1.0.0';
  plan.run.id = runId;
  plan.samples = [{ ordinal: 1 }, { ordinal: 2 }];
  plan.sample = {
    ...plan.sample,
    id: `SMP-TEST-MANUAL-BASELINE-00${ordinal}`,
    path: `cycles/m5/samples/smp-test-manual-baseline-00${ordinal}.md`,
    ordinal,
    answer_output_path: `raw/slot-${ordinal}/answer.md`,
    log_output_path: `raw/slot-${ordinal}/collector-log.json`,
    citations: ordinal === 1 ? plan.sample.citations : [],
  };
  return plan;
}

test('manual exploratory Sample 落盘 raw/Citation/Source/classification 且不保存账号标识', async () => {
  const root = await m5ReadyWorkspace();
  const plan = manualPlan();
  const answer = 'Synthetic Brand answer.\n\n[1]: https://example.invalid/source\n';
  const result = await ingestManualSample({ workspace: root, plan, answerText: answer });
  assert.equal(result.sample_ref, 'SMP-TEST-MANUAL-001');
  assert.equal(result.citation_refs.length, 2);
  const sample = await readMarkdownObject(path.join(root, plan.sample.path), { workspace: root });
  assert.equal(sample.data.purpose, 'exploratory');
  assert.equal(sample.data.collection_method, 'manual');
  assert.equal(sample.data.privacy.account_identifier_stored, false);
  assert.equal(
    await readFile(path.join(root, 'runs/RUN-TEST-M5-MANUAL-001/raw/slot-1/answer.md'), 'utf8'),
    answer,
  );
  assert.ok((await readFile(
    path.join(root, 'runs/RUN-TEST-M5-MANUAL-001/raw/slot-1/collector-log.json'), 'utf8',
  )).includes('"account_identifier_stored": false'));
  assert.deepEqual((await validateAnswerWorkspace({ workspace: root })).errors, []);
  await rm(root, { recursive: true });
});

test('manual import 拒绝答案中的账号邮箱并在写入前失败', async () => {
  const root = await m5ReadyWorkspace();
  const plan = manualPlan();
  await assert.rejects(
    ingestManualSample({ workspace: root, plan, answerText: 'Contact owner@example.com' }),
    (error) => error.code === 'PRIVACY_SCOPE_VIOLATION',
  );
  await assert.rejects(readFile(path.join(root, `runs/${plan.run.id}/raw/slot-1/answer.md`)));
  await rm(root, { recursive: true });
});

test('manual import 同字节重试幂等，不同字节冲突且旧 raw 不变', async () => {
  const root = await m5ReadyWorkspace();
  const plan = manualPlan();
  const answer = 'Synthetic manual answer.\n';
  await ingestManualSample({ workspace: root, plan, answerText: answer });
  const repeated = await ingestManualSample({ workspace: root, plan, answerText: answer });
  assert.equal(repeated.sample_ref, plan.sample.id);
  await assert.rejects(
    ingestManualSample({ workspace: root, plan, answerText: 'Changed answer.\n' }),
    (error) => error.code === 'RAW_ARTIFACT_CONFLICT',
  );
  assert.equal(
    await readFile(path.join(root, `runs/${plan.run.id}/${plan.sample.answer_output_path}`), 'utf8'),
    answer,
  );
  await rm(root, { recursive: true });
});

test('manual materializer 拒绝 Perplexity 页面采集但允许用户导出文件', async () => {
  const root = await m5ReadyWorkspace();
  const plan = manualPlan();
  plan.profile.data.platform = 'perplexity';
  plan.profile.data.product_entry = 'https://www.perplexity.ai/';
  plan.profile.data.profile_fingerprint = collectorProfileFingerprint(plan.profile.data);
  await assert.rejects(
    ingestManualSample({ workspace: root, plan, answerText: 'Synthetic answer.\n' }),
    (error) => error.code === 'PLATFORM_MANUAL_COLLECTION_BLOCKED',
  );
  await assert.rejects(readFile(path.join(root, `runs/${plan.run.id}/run.md`)));

  plan.manual_source = {
    kind: 'user_supplied_export',
    filename: 'perplexity-export.md',
    sha256: 'a'.repeat(64),
  };
  const result = await ingestManualSample({ workspace: root, plan, answerText: 'Synthetic export.\n' });
  assert.equal(result.sample_ref, plan.sample.id);
  await rm(root, { recursive: true });
});

test('manual baseline v2 固定两个独立 slot，并在第二槽前保持 waiting_human', async () => {
  const root = await m5ReadyWorkspace();
  const firstPlan = baselineManualPlan();
  const first = await ingestManualSample({
    workspace: root,
    plan: firstPlan,
    answerText: 'Synthetic English baseline answer one.\n',
  });
  assert.equal(first.purpose, 'baseline');
  assert.equal(first.classification_refs.length, 0);
  assert.equal(first.source_archive.threshold, 100);
  assert.equal(first.source_archive.unique_source_count, 2);
  assert.equal(first.source_archive.remaining_to_batch, 98);
  const waitingRun = await readRun({ workspace: root, runId: firstPlan.run.id });
  assert.equal(waitingRun.data.status, 'waiting_human');
  assert.equal(waitingRun.data.lease, undefined);
  const repeatedFirst = await ingestManualSample({
    workspace: root,
    plan: firstPlan,
    answerText: 'Synthetic English baseline answer one.\n',
  });
  assert.equal(repeatedFirst.action, 'kept');
  assert.equal((await readRun({ workspace: root, runId: firstPlan.run.id })).original, waitingRun.original);

  const queuedSource = await readMarkdownObject(
    path.join(root, 'evidence/sources/src-test-manual-community-001.md'),
    { workspace: root },
  );
  assert.equal(queuedSource.data.classification_queue.status, 'archived_unclassified');
  assert.equal(queuedSource.data.classification_queue.threshold, 100);
  await assert.rejects(readFile(path.join(
    root,
    'cycles/m5/classifications/scl-test-manual-002.md',
  )));

  const secondPlan = baselineManualPlan({ ordinal: 2 });
  const second = await ingestManualSample({
    workspace: root,
    plan: secondPlan,
    answerText: 'Synthetic English baseline answer two.\n',
  });
  assert.equal(second.purpose, 'baseline');
  assert.equal((await readRun({ workspace: root, runId: secondPlan.run.id })).data.status, 'completed');
  await rm(root, { recursive: true });
});
