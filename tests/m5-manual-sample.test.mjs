import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import { ingestManualSample } from '../plugins/geo-expert/scripts/lib/answer-manual.mjs';
import { validateAnswerWorkspace } from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { collectorProfile, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

function manualPlan() {
  const profile = collectorProfile({
    id: 'CPF-TEST-MANUAL-001',
    title: 'Synthetic manual profile',
    product_entry: 'https://consumer.example.invalid/manual',
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
