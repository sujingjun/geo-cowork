import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  collectFixtureCycle,
} from '../plugins/geo-expert/scripts/lib/answer-cycle.mjs';
import {
  materializeFixtureSample,
  rawManifestSha,
} from '../plugins/geo-expert/scripts/lib/answer-sample.mjs';
import { initializeAnswerRun } from '../plugins/geo-expert/scripts/lib/answer-run.mjs';
import { validateAnswerWorkspace } from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import { readMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { m5FixturePlan, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

test('recorded Fixture 保留两个 slot、终态与 create-only raw checksum', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  const result = await collectFixtureCycle({ workspace: root, plan });
  assert.equal(result.samples.length, 2);
  assert.deepEqual(result.samples.map((item) => item.outcome), ['success', 'refusal']);

  const sample = await readMarkdownObject(
    path.join(root, 'cycles/m5/samples/smp-test-001.md'),
    { workspace: root },
  );
  assert.equal(sample.data.raw_manifest_sha256, rawManifestSha(sample.data.artifacts));
  const answerPath = path.join(root, 'runs/RUN-TEST-M5-001/raw/slot-1/answer.txt');
  const before = await readFile(answerPath, 'utf8');

  const repeated = await collectFixtureCycle({ workspace: root, plan });
  assert.equal(repeated.samples.length, 2);
  assert.equal(await readFile(answerPath, 'utf8'), before);

  await writeFile(path.join(root, 'fixtures/m5/slot-1-answer.txt'), 'changed fixture bytes\n');
  await assert.rejects(
    collectFixtureCycle({ workspace: root, plan }),
    (error) => error.code === 'RAW_ARTIFACT_CONFLICT',
  );
  assert.equal(await readFile(answerPath, 'utf8'), before);
  await rm(root, { recursive: true });
});

test('Sample outcome 与 artifact 门拒绝缺 answer、日志及敏感输入', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await collectFixtureCycle({ workspace: root, plan });
  const invalid = structuredClone(plan.samples[0]);
  invalid.id = 'SMP-TEST-099';
  invalid.path = 'cycles/m5/samples/smp-test-099.md';
  invalid.ordinal = 1;
  invalid.artifacts = [];
  await assert.rejects(
    materializeFixtureSample({ workspace: root, plan, sample: invalid }),
    (error) => error.code === 'RAW_ARTIFACT_REQUIRED',
  );

  const sensitive = structuredClone(plan.samples[1]);
  sensitive.id = 'SMP-TEST-098';
  sensitive.path = 'cycles/m5/samples/smp-test-098.md';
  sensitive.cookie = 'forbidden-secret-value';
  await assert.rejects(
    materializeFixtureSample({ workspace: root, plan, sample: sensitive }),
    (error) => error.code === 'PRIVACY_SCOPE_VIOLATION',
  );
  await rm(root, { recursive: true });
});

test('no_result、challenge、cancelled 与 system_failure 均作为独立终态落盘', async () => {
  for (const [index, outcome] of ['no_result', 'challenge', 'cancelled', 'system_failure'].entries()) {
    const root = await m5ReadyWorkspace();
    const plan = m5FixturePlan();
    await initializeAnswerRun({ workspace: root, plan });
    const sample = structuredClone(plan.samples[1]);
    sample.id = `SMP-TEST-20${index}`;
    sample.path = `cycles/m5/samples/smp-test-20${index}.md`;
    sample.outcome = outcome;
    if (outcome === 'cancelled') {
      sample.cancellation = {
        source: 'human',
        completed_steps: ['profile_validated'],
        reason: 'Synthetic fixture cancellation.',
      };
    }
    sample.artifacts = [{
      role: 'collector_log',
      content: `{"terminal_state":"${outcome}"}\n`,
      output_path: `raw/outcome-${index}/collector-log.json`,
      media_type: 'application/json',
    }];
    const result = await materializeFixtureSample({ workspace: root, plan, sample });
    assert.equal(result.outcome, outcome);
    await rm(root, { recursive: true });
  }
});

test('cancelled Sample 缺少取消来源与已完成步骤时拒绝', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await initializeAnswerRun({ workspace: root, plan });
  const cancelled = structuredClone(plan.samples[1]);
  cancelled.id = 'SMP-TEST-250';
  cancelled.path = 'cycles/m5/samples/smp-test-250.md';
  cancelled.outcome = 'cancelled';
  await assert.rejects(
    materializeFixtureSample({ workspace: root, plan, sample: cancelled }),
    (error) => error.code === 'INVALID_FRONTMATTER',
  );
  await rm(root, { recursive: true });
});

test('system_failure 可用递增 attempt 重试，旧 attempt 保留', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await initializeAnswerRun({ workspace: root, plan });
  const failed = structuredClone(plan.samples[0]);
  failed.id = 'SMP-TEST-301';
  failed.path = 'cycles/m5/samples/smp-test-301.md';
  failed.outcome = 'system_failure';
  failed.artifacts = [{
    role: 'collector_log', content: '{"terminal_state":"system_failure"}\n',
    output_path: 'raw/retry-1/collector-log.json', media_type: 'application/json',
  }];
  const first = await materializeFixtureSample({ workspace: root, plan, sample: failed });
  const retried = structuredClone(plan.samples[0]);
  retried.id = 'SMP-TEST-302';
  retried.path = 'cycles/m5/samples/smp-test-302.md';
  retried.attempt_no = 2;
  retried.retry_of_ref = first.id;
  retried.artifacts = [{
    role: 'answer_text', content: 'Recovered recorded answer.\n',
    output_path: 'raw/retry-2/answer.txt', media_type: 'text/plain',
  }];
  await materializeFixtureSample({ workspace: root, plan, sample: retried });
  const validation = await validateAnswerWorkspace({ workspace: root });
  assert.deepEqual(validation.errors, []);
  assert.equal(
    await readFile(path.join(root, 'runs/RUN-TEST-M5-001/raw/retry-1/collector-log.json'), 'utf8'),
    '{"terminal_state":"system_failure"}\n',
  );
  await rm(root, { recursive: true });
});
