import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  createRun,
  readRun,
  resumeRun,
  transitionRun,
  writeRunArtifact,
} from '../plugins/geo-expert/scripts/lib/run-store.mjs';
import { validateObjectData } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { NOW, temporaryWorkspace } from './helpers/object-fixtures.mjs';

const INPUTS_V1 = { 'SRC-TEST-001': '1.0.0' };
const INPUTS_V2 = { 'SRC-TEST-001': '1.1.0' };

test('Run 拒绝 input refs/version/fingerprint 不一致', async () => {
  const root = await temporaryWorkspace();
  const created = await createRun({
    workspace: root, runId: 'RUN-TEST-INPUT-001', skill: 'geo-test',
    skillVersion: '1.0.0', inputVersions: INPUTS_V1, now: NOW,
  });
  assert.throws(
    () => validateObjectData({ ...created.data, input_refs: [] }),
    (error) => error.code === 'INVALID_INPUT_VERSIONS',
  );
  assert.throws(
    () => validateObjectData({ ...created.data, input_fingerprint: '0'.repeat(64) }),
    (error) => error.code === 'INVALID_INPUT_FINGERPRINT',
  );
  await rm(root, { recursive: true });
});

test('Run status 与 business result 独立，非法状态转移失败', async () => {
  const root = await temporaryWorkspace();
  await createRun({
    workspace: root,
    runId: 'RUN-TEST-001',
    skill: 'geo-test',
    skillVersion: '1.0.0',
    inputVersions: INPUTS_V1,
    now: NOW,
  });
  await transitionRun({ workspace: root, runId: 'RUN-TEST-001', status: 'running', now: NOW });
  await transitionRun({
    workspace: root,
    runId: 'RUN-TEST-001',
    status: 'completed',
    businessResult: 'fail',
    now: NOW,
  });
  const completed = await readRun({ workspace: root, runId: 'RUN-TEST-001' });
  assert.equal(completed.data.status, 'completed');
  assert.equal(completed.data.business_result, 'fail');
  await assert.rejects(
    transitionRun({ workspace: root, runId: 'RUN-TEST-001', status: 'running', now: NOW }),
    (error) => error.code === 'INVALID_RUN_TRANSITION',
  );
  await rm(root, { recursive: true });
});

test('Run artifact create-only，二次写失败且旧字节不变', async () => {
  const root = await temporaryWorkspace();
  await createRun({
    workspace: root,
    runId: 'RUN-TEST-ARTIFACT-001',
    skill: 'geo-test',
    skillVersion: '1.0.0',
    inputVersions: INPUTS_V1,
    now: NOW,
  });
  await writeRunArtifact({
    workspace: root,
    runId: 'RUN-TEST-ARTIFACT-001',
    relativePath: 'raw/sample.json',
    content: '{"value":1}\n',
  });
  await assert.rejects(
    writeRunArtifact({
      workspace: root,
      runId: 'RUN-TEST-ARTIFACT-001',
      relativePath: 'raw/sample.json',
      content: '{"value":2}\n',
    }),
    (error) => error.code === 'ARTIFACT_EXISTS',
  );
  assert.equal(
    await readFile(path.join(root, 'runs/RUN-TEST-ARTIFACT-001/raw/sample.json'), 'utf8'),
    '{"value":1}\n',
  );
  await rm(root, { recursive: true });
});

test('输入不变恢复旧 Run；输入变化 supersede 并幂等创建新 Run', async () => {
  const root = await temporaryWorkspace();
  await createRun({
    workspace: root,
    runId: 'RUN-TEST-RESUME-001',
    skill: 'geo-test',
    skillVersion: '1.0.0',
    inputVersions: INPUTS_V1,
    now: NOW,
  });
  await transitionRun({
    workspace: root,
    runId: 'RUN-TEST-RESUME-001',
    status: 'running',
    now: NOW,
  });
  await transitionRun({
    workspace: root,
    runId: 'RUN-TEST-RESUME-001',
    status: 'blocked',
    now: NOW,
  });

  const unchanged = await resumeRun({
    workspace: root,
    runId: 'RUN-TEST-RESUME-001',
    currentInputVersions: INPUTS_V1,
    newRunId: 'RUN-TEST-RESUME-002',
    now: NOW,
  });
  assert.equal(unchanged.action, 'resume');
  assert.equal((await readRun({ workspace: root, runId: 'RUN-TEST-RESUME-001' })).data.status, 'running');

  await transitionRun({
    workspace: root,
    runId: 'RUN-TEST-RESUME-001',
    status: 'blocked',
    now: NOW,
  });
  const changed = await resumeRun({
    workspace: root,
    runId: 'RUN-TEST-RESUME-001',
    currentInputVersions: INPUTS_V2,
    newRunId: 'RUN-TEST-RESUME-002',
    now: NOW,
  });
  assert.equal(changed.action, 'superseded');
  assert.equal((await readRun({ workspace: root, runId: 'RUN-TEST-RESUME-001' })).data.status, 'superseded');
  assert.equal((await readRun({ workspace: root, runId: 'RUN-TEST-RESUME-002' })).data.status, 'pending');

  const repeated = await resumeRun({
    workspace: root,
    runId: 'RUN-TEST-RESUME-001',
    currentInputVersions: INPUTS_V2,
    newRunId: 'RUN-TEST-RESUME-002',
    now: NOW,
  });
  assert.equal(repeated.action, 'superseded');
  await rm(root, { recursive: true });
});

test('新 Run 已创建但旧 Run 未更新时，重试 supersede 可收敛', async () => {
  const root = await temporaryWorkspace();
  await createRun({
    workspace: root, runId: 'RUN-TEST-CRASH-001', skill: 'geo-test',
    skillVersion: '1.0.0', inputVersions: INPUTS_V1, now: NOW,
  });
  await transitionRun({
    workspace: root, runId: 'RUN-TEST-CRASH-001', status: 'running', now: NOW,
  });
  await transitionRun({
    workspace: root, runId: 'RUN-TEST-CRASH-001', status: 'blocked', now: NOW,
  });
  await createRun({
    workspace: root, runId: 'RUN-TEST-CRASH-002', skill: 'geo-test',
    skillVersion: '1.0.0', inputVersions: INPUTS_V2, now: NOW,
    supersedesRef: 'RUN-TEST-CRASH-001',
  });
  const result = await resumeRun({
    workspace: root,
    runId: 'RUN-TEST-CRASH-001',
    currentInputVersions: INPUTS_V2,
    newRunId: 'RUN-TEST-CRASH-002',
    now: '2026-08-24T00:01:00+08:00',
  });
  assert.equal(result.action, 'superseded');
  assert.equal((await readRun({ workspace: root, runId: 'RUN-TEST-CRASH-001' })).data.status, 'superseded');
  await rm(root, { recursive: true });
});
