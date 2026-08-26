import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';

import {
  acquireAnswerLease,
  completeAnswerStep,
  heartbeatAnswerLease,
  initializeAnswerRun,
  releaseAnswerLease,
  resumeAnswerRun,
} from '../plugins/geo-expert/scripts/lib/answer-run.mjs';
import { readRun } from '../plugins/geo-expert/scripts/lib/run-store.mjs';
import { m5FixturePlan, m5ReadyWorkspace } from './helpers/m5-fixtures.mjs';

test('M5 lease 拒绝双 owner，过期后可接管并保留 revision', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await initializeAnswerRun({ workspace: root, plan, now: '2026-08-25T00:00:00+08:00' });
  await acquireAnswerLease({
    workspace: root, runId: plan.run.id, ownerId: 'owner-a',
    now: '2026-08-25T00:00:00+08:00', ttlMs: 1_000,
  });
  await assert.rejects(
    acquireAnswerLease({
      workspace: root, runId: plan.run.id, ownerId: 'owner-b',
      now: '2026-08-25T00:00:00.500+08:00', ttlMs: 1_000,
    }),
    (error) => error.code === 'LEASE_ACTIVE',
  );
  const heartbeat = await heartbeatAnswerLease({
    workspace: root, runId: plan.run.id, ownerId: 'owner-a',
    now: '2026-08-25T00:00:00.750+08:00', ttlMs: 2_000,
  });
  assert.equal(heartbeat.owner_id, 'owner-a');
  await assert.rejects(
    acquireAnswerLease({
      workspace: root, runId: plan.run.id, ownerId: 'owner-b',
      now: '2026-08-25T00:00:02+08:00', ttlMs: 1_000,
    }),
    (error) => error.code === 'LEASE_ACTIVE',
  );
  const takeover = await acquireAnswerLease({
    workspace: root, runId: plan.run.id, ownerId: 'owner-b',
    now: '2026-08-25T00:00:03+08:00', ttlMs: 1_000,
  });
  assert.equal(takeover.previous_owner_id, 'owner-a');
  await releaseAnswerLease({ workspace: root, runId: plan.run.id, ownerId: 'owner-b' });
  await rm(root, { recursive: true });
});

test('query_submitted 后终态未知必须 waiting_human，不自动重复提交', async () => {
  const root = await m5ReadyWorkspace();
  const plan = m5FixturePlan();
  await initializeAnswerRun({ workspace: root, plan, now: '2026-08-25T00:00:00+08:00' });
  await acquireAnswerLease({
    workspace: root, runId: plan.run.id, ownerId: 'owner-a',
    now: '2026-08-25T00:00:00+08:00', ttlMs: 60_000,
  });
  const slotKey = (await readRun({ workspace: root, runId: plan.run.id })).data.sample_slots[0].slot_key;
  for (const step of ['profile_validated', 'authorization_checked', 'session_prepared', 'query_submitted']) {
    await completeAnswerStep({
      workspace: root, runId: plan.run.id, ownerId: 'owner-a', slotKey, step,
      proof: `fixture:${step}`, now: '2026-08-25T00:00:01+08:00',
    });
  }
  await releaseAnswerLease({ workspace: root, runId: plan.run.id, ownerId: 'owner-a' });
  const resumed = await resumeAnswerRun({
    workspace: root, runId: plan.run.id, ownerId: 'owner-b',
    now: '2026-08-25T00:01:00+08:00', ttlMs: 60_000,
  });
  assert.equal(resumed.action, 'waiting_human');
  assert.equal((await readRun({ workspace: root, runId: plan.run.id })).data.status, 'waiting_human');
  await rm(root, { recursive: true });
});
