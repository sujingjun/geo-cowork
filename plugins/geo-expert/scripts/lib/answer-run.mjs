import {
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';

import {
  collectorProfileFingerprint,
  sampleSlotKey,
  validateCollectorProfileData,
} from './answer-profile.mjs';
import {
  readRun,
  createRun,
  transitionRun,
} from './run-store.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  assertNoSymlinkPath,
  atomicWrite,
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

const STEPS = [
  'profile_validated',
  'authorization_checked',
  'session_prepared',
  'query_submitted',
  'terminal_state_observed',
  'raw_artifacts_written',
  'sample_metadata_written',
  'citation_source_plan_frozen',
  'citations_and_sources_materialized',
  'candidate_classifications_materialized',
];

export class AnswerRunError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnswerRunError';
    this.code = code;
    Object.assign(this, details);
  }
}

function profileBody(data) {
  return `# ${data.title ?? data.id}\n`;
}

async function ensureProfile({ workspace, plan }) {
  validateCollectorProfileData(plan.profile.data);
  validateObjectData(plan.profile.data, { path: plan.profile.path });
  try {
    return await writeCreateOnly(
      workspace,
      plan.profile.path,
      serializeMarkdownObject(plan.profile.data, profileBody(plan.profile.data)),
      { idempotent: true, conflictCode: 'PROFILE_FINGERPRINT_MISMATCH' },
    );
  } catch (error) {
    if (error.code === 'PROFILE_FINGERPRINT_MISMATCH') throw error;
    throw error;
  }
}

function slotsFor(plan) {
  const samples = plan.samples ?? [plan.sample];
  const queryVersion = plan.query_cluster?.query_versions?.[0] ?? plan.query_version;
  return samples.map((sample) => ({
    slot_key: sampleSlotKey({
      purpose: plan.purpose,
      queryRef: queryVersion.ref,
      queryVersion: queryVersion.version,
      platform: plan.profile.data.platform,
      collectorProfileRef: plan.profile.data.id,
      collectorProfileVersion: plan.profile.data.version,
      queryTemplateVersion: plan.profile.data.query_template_version,
      timeWindowId: plan.profile.data.time_window.id,
      ordinal: sample.ordinal,
    }),
    query_ref: queryVersion.ref,
    platform: plan.profile.data.platform,
    ordinal: sample.ordinal,
    completed_steps: [],
    step_proofs: {},
    attempt_refs: [],
    selected_sample_ref: null,
  }));
}

export async function initializeAnswerRun({ workspace, plan, now = plan.profile.data.updated_at }) {
  const isRecorded = plan.schema_version === 'm5-recorded-fixture-plan-v1';
  const isManual = plan.schema_version === 'm5-manual-sample-plan-v1';
  if (!isRecorded && !isManual) {
    throw new AnswerRunError('M5_FIELD_REQUIRED', '未知 M5 plan schema_version');
  }
  const authorizationMatches = isRecorded
    ? plan.authorization_ref?.startsWith('fixture://')
    : plan.authorization_ref?.startsWith('workspace://');
  if (!authorizationMatches) {
    throw new AnswerRunError(
      'COLLECTION_AUTHORIZATION_REQUIRED',
      'M5 plan 必须使用与采集方式匹配的显式 authorization',
    );
  }
  const expectedMethod = isRecorded ? 'recorded_fixture' : 'manual';
  if (plan.profile.data.collection_method !== expectedMethod) {
    throw new AnswerRunError('PLAYWRIGHT_GATE_NOT_APPROVED', '离线实现只允许 recorded_fixture');
  }
  if (isManual && plan.purpose !== 'exploratory') {
    throw new AnswerRunError('SAMPLE_NOT_INDEPENDENT', '单次 manual Smoke 只能标记 exploratory');
  }
  if (plan.profile.data.profile_fingerprint !== collectorProfileFingerprint(plan.profile.data)) {
    throw new AnswerRunError('PROFILE_FINGERPRINT_MISMATCH', 'Collector Profile fingerprint 不一致');
  }
  await ensureProfile({ workspace, plan });

  let run;
  try {
    await createRun({
      workspace,
      runId: plan.run.id,
      skill: 'geo-answer-cycle',
      skillVersion: '1.0.0',
      inputVersions: plan.input_versions,
      now,
    });
    run = await readRun({ workspace, runId: plan.run.id });
  } catch (error) {
    if (error.code !== 'RUN_CONFLICT') throw error;
    run = await readRun({ workspace, runId: plan.run.id });
  }

  if (run.data.authorization_ref) {
    const expected = stableStringify({
      authorization_ref: plan.authorization_ref,
      purpose: plan.purpose,
      profile_versions: [{ ref: plan.profile.data.id, version: plan.profile.data.version }],
      query_set_versions: plan.query_set_versions,
      collector_contract: plan.collector_contract,
    });
    const actual = stableStringify({
      authorization_ref: run.data.authorization_ref,
      purpose: run.data.purpose,
      profile_versions: run.data.profile_versions,
      query_set_versions: run.data.query_set_versions,
      collector_contract: run.data.collector_contract,
    });
    if (expected !== actual) throw new AnswerRunError('RUN_CONFLICT', 'M5 Run 对应不同 plan');
    return { action: 'kept', data: run.data };
  }

  const patch = {
    authorization_ref: plan.authorization_ref,
    purpose: plan.purpose,
    goal_refs: plan.goal_refs,
    profile_versions: [{ ref: plan.profile.data.id, version: plan.profile.data.version }],
    query_set_versions: plan.query_set_versions,
    knowledge_release_versions: plan.knowledge_release_versions,
    sample_slots: slotsFor(plan),
    collector_contract: plan.collector_contract,
    next_action: isRecorded ? 'collect recorded fixture' : 'ingest manual sample',
  };
  const result = await transitionRun({
    workspace,
    runId: plan.run.id,
    status: run.data.status,
    now,
    patch,
  });
  return { action: 'created', data: result.data };
}

function leaseRelative(runId) {
  return `runs/${runId}/.m5-lease`;
}

async function readLease(workspace, runId) {
  const relative = `${leaseRelative(runId)}/lease.json`;
  await assertNoSymlinkPath(workspace, relative);
  return JSON.parse(await readFile(resolveWithin(workspace, relative), 'utf8'));
}

async function createLeaseDir({ workspace, runId, lease }) {
  const relative = leaseRelative(runId);
  await assertNoSymlinkPath(workspace, relative, { allowMissingLeaf: true });
  await mkdir(resolveWithin(workspace, relative));
  await writeFile(resolveWithin(workspace, `${relative}/lease.json`), stableStringify(lease, 2), {
    flag: 'wx',
  });
}

export async function acquireAnswerLease({ workspace, runId, ownerId, now, ttlMs }) {
  await readRun({ workspace, runId });
  let previousOwnerId;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const acquiredAt = new Date(now);
    const lease = {
      scope_key: `answer-run:${runId}`,
      owner_id: ownerId,
      acquired_at: acquiredAt.toISOString(),
      heartbeat_at: acquiredAt.toISOString(),
      expires_at: new Date(acquiredAt.getTime() + ttlMs).toISOString(),
    };
    try {
      await createLeaseDir({ workspace, runId, lease });
      const run = await readRun({ workspace, runId });
      const status = ['pending', 'waiting_human', 'blocked', 'failed'].includes(run.data.status)
        ? 'running'
        : run.data.status;
      await transitionRun({ workspace, runId, status, now, patch: { lease } });
      return { ...lease, previous_owner_id: previousOwnerId };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const current = await readLease(workspace, runId);
      if (current.owner_id === ownerId && Date.parse(current.expires_at) > Date.parse(now)) {
        return { ...current, previous_owner_id: previousOwnerId };
      }
      if (Date.parse(current.expires_at) > Date.parse(now)) {
        throw new AnswerRunError('LEASE_ACTIVE', 'M5 Run lease 仍有效', {
          owner_id: current.owner_id,
          expires_at: current.expires_at,
        });
      }
      previousOwnerId = current.owner_id;
      const historyRoot = `runs/${runId}/lease-history`;
      await mkdir(resolveWithin(workspace, historyRoot), { recursive: true });
      const history = `${historyRoot}/${sha256(stableStringify(current)).slice(0, 16)}`;
      try {
        await rename(
          resolveWithin(workspace, leaseRelative(runId)),
          resolveWithin(workspace, history),
        );
      } catch (renameError) {
        if (!['ENOENT', 'EEXIST', 'ENOTEMPTY'].includes(renameError.code)) throw renameError;
      }
    }
  }
  throw new AnswerRunError('LEASE_STALE_RECOVERY_REQUIRED', '无法安全接管 stale lease');
}

export async function releaseAnswerLease({ workspace, runId, ownerId }) {
  const current = await readLease(workspace, runId);
  if (current.owner_id !== ownerId) {
    throw new AnswerRunError('LEASE_ACTIVE', '只有当前 owner 可释放 lease');
  }
  await rm(resolveWithin(workspace, leaseRelative(runId)), { recursive: true });
  return { action: 'released', owner_id: ownerId };
}

export async function heartbeatAnswerLease({
  workspace,
  runId,
  ownerId,
  now,
  ttlMs,
}) {
  const current = await readLease(workspace, runId);
  if (current.owner_id !== ownerId || Date.parse(current.expires_at) <= Date.parse(now)) {
    throw new AnswerRunError('LEASE_STALE_RECOVERY_REQUIRED', '过期或非 owner lease 不能 heartbeat');
  }
  const heartbeat = {
    ...current,
    heartbeat_at: new Date(now).toISOString(),
    expires_at: new Date(Date.parse(now) + ttlMs).toISOString(),
  };
  await atomicWrite(
    workspace,
    `${leaseRelative(runId)}/lease.json`,
    stableStringify(heartbeat, 2),
  );
  const run = await readRun({ workspace, runId });
  await transitionRun({
    workspace,
    runId,
    status: run.data.status,
    now,
    patch: { lease: heartbeat },
  });
  return heartbeat;
}

async function assertOwner(workspace, runId, ownerId, now) {
  const lease = await readLease(workspace, runId);
  if (lease.owner_id !== ownerId || Date.parse(lease.expires_at) <= Date.parse(now)) {
    throw new AnswerRunError('LEASE_ACTIVE', 'M5 Run lease owner 或有效期不匹配');
  }
  return lease;
}

export async function completeAnswerStep({
  workspace,
  runId,
  ownerId,
  slotKey,
  step,
  proof,
  now,
  attemptRef,
  selectedSampleRef,
}) {
  await assertOwner(workspace, runId, ownerId, now);
  const stepIndex = STEPS.indexOf(step);
  if (stepIndex < 0) throw new AnswerRunError('M5_FIELD_REQUIRED', '未知 M5 collector step');
  const run = await readRun({ workspace, runId });
  const slots = run.data.sample_slots.map((slot) => ({
    ...slot,
    completed_steps: [...slot.completed_steps],
    step_proofs: { ...slot.step_proofs },
    attempt_refs: [...slot.attempt_refs],
  }));
  const slot = slots.find((item) => item.slot_key === slotKey);
  if (!slot) throw new AnswerRunError('SAMPLE_SLOT_CONFLICT', 'M5 sample slot 不存在');
  const firstMissing = STEPS.findIndex((item) => !slot.completed_steps.includes(item));
  if (!slot.completed_steps.includes(step) && firstMissing !== stepIndex) {
    throw new AnswerRunError('LEASE_STALE_RECOVERY_REQUIRED', 'M5 step 不能跳过前置步骤');
  }
  if (!proof) throw new AnswerRunError('LEASE_STALE_RECOVERY_REQUIRED', 'M5 step 缺少完成证明');
  if (!slot.completed_steps.includes(step)) slot.completed_steps.push(step);
  slot.step_proofs[step] = proof;
  if (attemptRef && !slot.attempt_refs.includes(attemptRef)) slot.attempt_refs.push(attemptRef);
  if (selectedSampleRef !== undefined) slot.selected_sample_ref = selectedSampleRef;
  const completedSteps = [...new Set(slots.flatMap((item) =>
    item.completed_steps.map((itemStep) => `${item.slot_key}:${itemStep}`)))].sort();
  const result = await transitionRun({
    workspace,
    runId,
    status: run.data.status,
    now,
    patch: { sample_slots: slots, completed_steps: completedSteps },
  });
  return result.data;
}

export async function resumeAnswerRun({ workspace, runId, ownerId, now, ttlMs }) {
  await acquireAnswerLease({ workspace, runId, ownerId, now, ttlMs });
  const run = await readRun({ workspace, runId });
  const uncertain = run.data.sample_slots.find((slot) =>
    slot.completed_steps.includes('query_submitted')
      && !slot.completed_steps.includes('terminal_state_observed'));
  if (uncertain) {
    await transitionRun({
      workspace,
      runId,
      status: 'waiting_human',
      now,
      patch: {
        next_action: `confirm terminal state for ${uncertain.slot_key}`,
        failure_reason: 'SAMPLE_TERMINAL_STATE_UNKNOWN',
      },
    });
    await releaseAnswerLease({ workspace, runId, ownerId });
    return { action: 'waiting_human', slot_key: uncertain.slot_key };
  }
  return { action: 'resume', run_id: runId };
}
