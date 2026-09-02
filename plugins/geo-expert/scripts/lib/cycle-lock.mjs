import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';

import {
  atomicWrite,
  resolveWithin,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';
import { assertDevelopmentWorkspaceWriteAllowed } from './workspace-scope.mjs';

export class CycleLockError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CycleLockError';
    this.code = code;
    Object.assign(this, details);
  }
}

function lockPath(cycleId) {
  return `cycles/.locks/${cycleId.toLowerCase()}.json`;
}

function takeoverPath(cycleId, revision) {
  return `cycles/.locks/${cycleId.toLowerCase()}.takeover-${revision}.json`;
}

function recoveryClaimPath(cycleId, revision) {
  return `cycles/.locks/${cycleId.toLowerCase()}.takeover-${revision}.recovery.json`;
}

async function readLease(workspace, cycleId) {
  try {
    return JSON.parse(await readFile(resolveWithin(workspace, lockPath(cycleId)), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function leaseData({
  cycleId,
  ownerId,
  now,
  ttlMs,
  revision,
  inputFingerprint,
  previousOwnerId,
}) {
  const acquired = Date.parse(now);
  if (!Number.isFinite(acquired) || !Number.isInteger(ttlMs) || ttlMs <= 0) {
    throw new CycleLockError('INVALID_ARGUMENT', 'lease 时间或 TTL 非法');
  }
  return {
    schema_version: 'm6-cycle-lock/1.0.0',
    cycle_id: cycleId,
    owner_id: ownerId,
    revision,
    input_fingerprint: inputFingerprint ?? null,
    acquired_at: now,
    heartbeat_at: now,
    expires_at: new Date(acquired + ttlMs).toISOString(),
    ...(previousOwnerId ? { previous_owner_id: previousOwnerId } : {}),
  };
}

export async function acquireCycleLease({
  workspace,
  cycleId,
  ownerId,
  now,
  ttlMs,
  inputFingerprint = null,
}) {
  const root = path.resolve(workspace);
  await assertDevelopmentWorkspaceWriteAllowed({ workspace: root });
  const data = leaseData({
    cycleId, ownerId, now, ttlMs, revision: 1, inputFingerprint,
  });
  try {
    await writeCreateOnly(root, lockPath(cycleId), stableStringify(data, 2), {
      conflictCode: 'LEASE_EXISTS',
    });
    return { action: 'acquired', ...data };
  } catch (error) {
    if (error.code !== 'LEASE_EXISTS') throw error;
  }
  const existing = await readLease(root, cycleId);
  if (Date.parse(existing?.expires_at) <= Date.parse(now)) {
    throw new CycleLockError('LEASE_STALE_RECOVERY_REQUIRED', 'lease 已过期，必须显式恢复', {
      owner_id: existing?.owner_id,
      revision: existing?.revision,
    });
  }
  if (existing?.owner_id === ownerId && existing.input_fingerprint === inputFingerprint) {
    return { action: 'kept', ...existing };
  }
  throw new CycleLockError('LEASE_ACTIVE', 'Cycle 已有有效 lease', {
    owner_id: existing?.owner_id,
    revision: existing?.revision,
  });
}

export async function recoverStaleCycleLease({
  workspace,
  cycleId,
  ownerId,
  now,
  expectedInputFingerprint,
  ttlMs = 60_000,
}) {
  const root = path.resolve(workspace);
  await assertDevelopmentWorkspaceWriteAllowed({ workspace: root });
  const existing = await readLease(root, cycleId);
  if (!existing) throw new CycleLockError('LEASE_STALE_RECOVERY_REQUIRED', '不存在可恢复 lease');
  if (Date.parse(existing.expires_at) > Date.parse(now)) {
    throw new CycleLockError('LEASE_ACTIVE', 'lease 尚未过期', {
      owner_id: existing.owner_id,
      revision: existing.revision,
    });
  }
  if (existing.input_fingerprint !== expectedInputFingerprint) {
    throw new CycleLockError('LEASE_STALE_RECOVERY_REQUIRED', 'stale lease 输入 fingerprint 不一致');
  }

  const claim = takeoverPath(cycleId, existing.revision);
  const recoveryClaim = recoveryClaimPath(cycleId, existing.revision);
  const claimData = {
    cycle_id: cycleId,
    expected_revision: existing.revision,
    expected_owner_id: existing.owner_id,
    takeover_owner_id: ownerId,
    expected_input_fingerprint: expectedInputFingerprint,
  };
  let ownsClaim = false;
  let ownsRecoveryClaim = false;
  try {
    await writeCreateOnly(root, claim, stableStringify(claimData, 2), {
      conflictCode: 'LEASE_ACTIVE',
    });
    ownsClaim = true;
  } catch (error) {
    if (error.code !== 'LEASE_ACTIVE') throw error;
    let priorClaim = null;
    try {
      priorClaim = JSON.parse(await readFile(resolveWithin(root, claim), 'utf8'));
    } catch {}
    const validActiveClaim = priorClaim?.cycle_id === cycleId
      && priorClaim.expected_revision === existing.revision
      && priorClaim.expected_owner_id === existing.owner_id
      && priorClaim.expected_input_fingerprint === expectedInputFingerprint;
    if (validActiveClaim) {
      throw new CycleLockError('LEASE_ACTIVE', '已有 takeover contender 持有 claim');
    }
    await writeCreateOnly(root, recoveryClaim, stableStringify(claimData, 2), {
      conflictCode: 'LEASE_ACTIVE',
    });
    ownsRecoveryClaim = true;
    await atomicWrite(root, claim, stableStringify(claimData, 2));
    ownsClaim = true;
  }
  try {
    const latest = await readLease(root, cycleId);
    if (stableStringify(latest) !== stableStringify(existing)) {
      throw new CycleLockError('LEASE_ACTIVE', 'lease 在 takeover 前已变化');
    }
    const next = leaseData({
      cycleId,
      ownerId,
      now,
      ttlMs,
      revision: existing.revision + 1,
      inputFingerprint: expectedInputFingerprint,
      previousOwnerId: existing.owner_id,
    });
    await atomicWrite(root, lockPath(cycleId), stableStringify(next, 2));
    return {
      action: 'taken_over',
      previous_owner_id: existing.owner_id,
      ...next,
    };
  } finally {
    if (ownsClaim) await rm(resolveWithin(root, claim), { force: true });
    if (ownsRecoveryClaim) await rm(resolveWithin(root, recoveryClaim), { force: true });
  }
}

export async function releaseCycleLease({ workspace, cycleId, ownerId, expectedRevision }) {
  const root = path.resolve(workspace);
  const existing = await readLease(root, cycleId);
  if (!existing) return { action: 'kept' };
  if (existing.owner_id !== ownerId) {
    throw new CycleLockError('LEASE_ACTIVE', '只有当前 owner 可以释放 lease', {
      owner_id: existing.owner_id,
    });
  }
  if (expectedRevision !== undefined && existing.revision !== expectedRevision) {
    throw new CycleLockError('LEASE_ACTIVE', 'lease revision fencing 失败', {
      owner_id: existing.owner_id,
      expected_revision: expectedRevision,
      actual_revision: existing.revision,
    });
  }
  await rm(resolveWithin(root, lockPath(cycleId)), { force: true });
  return { action: 'released', revision: existing.revision };
}
