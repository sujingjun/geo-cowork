import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';

import {
  assertNoSymlinkPath,
  atomicWrite,
  resolveWithin,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';

export const BROWSER_QUERY_STATUSES = Object.freeze([
  'pending', 'running', 'waiting_human', 'completed', 'failed', 'blocked',
]);
export const BROWSER_TASK_STATUSES = Object.freeze([
  'pending', 'running', 'waiting_human', 'completed', 'failed', 'blocked',
]);

class BrowserQueryStoreError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'BrowserQueryStoreError';
    this.code = code;
    Object.assign(this, details);
  }
}

function fail(code, message, details = {}) {
  throw new BrowserQueryStoreError(code, message, details);
}

export async function readBrowserQueryState(workspace, statePath) {
  try {
    return JSON.parse(await readFile(resolveWithin(workspace, statePath), 'utf8'));
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) return null;
    if (error instanceof SyntaxError) fail('QUERY_TASK_STATE_CONFLICT', 'Query task state 不是合法 JSON');
    throw error;
  }
}

export async function writeBrowserQueryState(workspace, statePath, state) {
  await atomicWrite(workspace, statePath, stableStringify(state, 2));
  return state;
}

export function validateBrowserQueryState(state, { schema, fingerprint }) {
  const queryStatuses = new Set(BROWSER_QUERY_STATUSES);
  const taskStatuses = new Set(BROWSER_TASK_STATUSES);
  if (!state || state.schema_version !== schema || state.plan_fingerprint !== fingerprint
      || !Number.isInteger(state.revision) || state.revision < 0
      || !taskStatuses.has(state.status) || !Array.isArray(state.queries)
      || state.queries.some((query) => !queryStatuses.has(query.status))) {
    fail('QUERY_TASK_STATE_CONFLICT', '既有 Query task state 与当前 plan 不一致');
  }
  if (!state.input_projection
      || sha256(stableStringify(state.input_projection)) !== state.plan_fingerprint) {
    fail('QUERY_TASK_STATE_CONFLICT', 'task state immutable projection fingerprint 不一致');
  }
  const projected = {
    task_id: state.input_projection.task_id,
    cycle_ref: state.input_projection.cycle_ref,
    cycle_version: state.input_projection.cycle_version,
    cycle_binding: state.input_projection.cycle_binding,
    query_set: state.input_projection.query_set,
    platform: state.input_projection.platform,
    authorization_ref: state.input_projection.authorization_ref,
    authorization: state.input_projection.authorization,
    queries: state.input_projection.queries,
  };
  const actual = {
    task_id: state.task_id,
    cycle_ref: state.cycle_ref,
    cycle_version: state.cycle_version,
    cycle_binding: state.cycle_binding,
    query_set: state.query_set,
    platform: state.platform,
    authorization_ref: state.authorization_ref,
    authorization: state.authorization,
    queries: state.queries.map(({ ref, version, query_text: queryText, language, intent }) => ({
      ref,
      version,
      query_text: queryText,
      language,
      intent,
    })),
  };
  if (stableStringify(actual) !== stableStringify(projected)) {
    fail('QUERY_TASK_STATE_CONFLICT', 'task state immutable fields 与 frozen projection 不一致');
  }
  for (const query of state.queries) {
    const attempts = query.attempts ?? [];
    const last = attempts.at(-1);
    const sequential = attempts.every((attempt, index) => attempt.attempt_no === index + 1);
    const activeMatches = !['running', 'waiting_human'].includes(query.status)
      || last?.status === query.status;
    const terminalMatches = !['completed', 'failed', 'blocked'].includes(query.status)
      || last?.status === query.status;
    if (!Array.isArray(query.attempts) || query.attempt_count !== attempts.length
        || !sequential || !activeMatches || !terminalMatches) {
      fail('QUERY_TASK_STATE_CONFLICT', 'Query status 与 attempt 历史不一致', {
        query_ref: query.ref,
      });
    }
  }
  const expectedCurrent = state.queries.find((query) => query.status !== 'completed')?.ref ?? null;
  const expectedStatus = state.queries.every((query) => query.status === 'completed')
    ? 'completed'
    : state.queries.some((query) => query.status === 'blocked') ? 'blocked'
      : state.queries.some((query) => query.status === 'failed') ? 'failed'
        : state.queries.some((query) => query.status === 'waiting_human') ? 'waiting_human'
          : state.queries.some((query) => query.status === 'running') ? 'running' : 'pending';
  if (state.current_query_ref !== expectedCurrent || state.status !== expectedStatus) {
    fail('QUERY_TASK_STATE_CONFLICT', 'task status/current Query 与 Query 状态不一致');
  }
  return state;
}

async function verifyArtifact(workspace, relativePath, expectedSha256) {
  if (!relativePath || !/^[a-f0-9]{64}$/.test(expectedSha256 ?? '')) {
    fail('QUERY_TASK_ARTIFACT_INCOMPLETE', 'task state artifact descriptor 不完整', {
      path: relativePath,
    });
  }
  let bytes;
  try {
    await assertNoSymlinkPath(workspace, relativePath);
    bytes = await readFile(resolveWithin(workspace, relativePath));
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) {
      fail('QUERY_TASK_ARTIFACT_INCOMPLETE', 'task state 引用的 artifact 不存在', {
        path: relativePath,
      });
    }
    throw error;
  }
  if (sha256(bytes) !== expectedSha256) {
    fail('QUERY_TASK_ARTIFACT_CHECKSUM_MISMATCH', 'task state artifact checksum 漂移', {
      path: relativePath,
    });
  }
  return bytes;
}

function artifactJson(bytes, relativePath) {
  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch {
    fail('QUERY_TASK_ARTIFACT_INCOMPLETE', 'task artifact 不是合法 JSON', { path: relativePath });
  }
}

export async function validateBrowserQueryStateArtifacts(workspace, state) {
  for (const query of state.queries) {
    for (const attempt of query.attempts ?? []) {
      if (attempt.capture_path && attempt.collector_log_path) {
        fail('QUERY_ATTEMPT_OUTCOME_CONFLICT', '同一 attempt 同时引用成功与失败 artifact', {
          query_ref: query.ref,
          attempt_no: attempt.attempt_no,
        });
      }
      if (attempt.outcome_path) {
        const bytes = await verifyArtifact(workspace, attempt.outcome_path, attempt.outcome_sha256);
        const outcome = artifactJson(bytes, attempt.outcome_path);
        if (outcome.query_ref !== query.ref || outcome.attempt_no !== attempt.attempt_no
            || outcome.outcome !== attempt.outcome) {
          fail('QUERY_ATTEMPT_OUTCOME_CONFLICT', 'outcome journal 与 task state 不一致', {
            query_ref: query.ref,
            attempt_no: attempt.attempt_no,
          });
        }
      }
      if (attempt.capture_path) {
        const bytes = await verifyArtifact(workspace, attempt.capture_path, attempt.capture_sha256);
        const capture = artifactJson(bytes, attempt.capture_path);
        if (capture.query_ref !== query.ref || capture.attempt_no !== attempt.attempt_no
            || !Array.isArray(capture.artifacts)) {
          fail('QUERY_TASK_ARTIFACT_INCOMPLETE', 'capture manifest 与 task state 不一致');
        }
        for (const artifact of capture.artifacts) {
          await verifyArtifact(workspace, artifact.path, artifact.sha256);
        }
      }
      if (attempt.collector_log_path) {
        await verifyArtifact(workspace, attempt.collector_log_path, attempt.collector_log_sha256);
      }
      if (['completed', 'failed', 'blocked'].includes(attempt.status)) {
        const answerOutcome = ['success', 'refusal'].includes(attempt.outcome);
        const failureOutcome = ['system_failure', 'timeout', 'no_result', 'challenge', 'cancelled']
          .includes(attempt.outcome);
        if (!attempt.outcome_path || (answerOutcome && !attempt.capture_path)
            || (failureOutcome && !attempt.collector_log_path)
            || (!answerOutcome && !failureOutcome)) {
          fail('QUERY_TASK_ARTIFACT_INCOMPLETE', 'terminal attempt artifact 闭包不完整', {
            query_ref: query.ref,
            attempt_no: attempt.attempt_no,
          });
        }
      }
    }
  }
  return state;
}

function leaseRoot(taskId) {
  return `runs/${taskId}/.browser-query-task-lease`;
}

async function readLease(workspace, taskId) {
  return JSON.parse(await readFile(resolveWithin(workspace, `${leaseRoot(taskId)}/lease.json`), 'utf8'));
}

async function acquireLease({ workspace, taskId, fingerprint, expectedRevision, ttlMs }) {
  const ownerId = `browser-query-task-${process.pid}-${randomUUID()}`;
  await assertNoSymlinkPath(workspace, `runs/${taskId}`, { allowMissingLeaf: true });
  await mkdir(resolveWithin(workspace, `runs/${taskId}`), { recursive: true });
  await assertNoSymlinkPath(workspace, `runs/${taskId}`);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const acquiredAt = new Date();
    const lease = {
      scope_key: `browser-query-task:${taskId}`,
      owner_id: ownerId,
      input_fingerprint: fingerprint,
      fence_revision: expectedRevision,
      acquired_at: acquiredAt.toISOString(),
      heartbeat_at: acquiredAt.toISOString(),
      expires_at: new Date(acquiredAt.getTime() + ttlMs).toISOString(),
    };
    try {
      await mkdir(resolveWithin(workspace, leaseRoot(taskId)));
      await writeFile(
        resolveWithin(workspace, `${leaseRoot(taskId)}/lease.json`),
        stableStringify(lease, 2),
        { flag: 'wx' },
      );
      return lease;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let current;
      try {
        current = await readLease(workspace, taskId);
      } catch (readError) {
        if (!['ENOENT', 'PATH_NOT_FOUND'].includes(readError.code)
            && !(readError instanceof SyntaxError)) throw readError;
        const incompleteRoot = `runs/${taskId}/browser-query-lease-history`;
        await mkdir(resolveWithin(workspace, incompleteRoot), { recursive: true });
        try {
          await rename(
            resolveWithin(workspace, leaseRoot(taskId)),
            resolveWithin(workspace, `${incompleteRoot}/incomplete-${randomUUID()}`),
          );
        } catch (renameError) {
          if (!['ENOENT', 'EEXIST', 'ENOTEMPTY'].includes(renameError.code)) throw renameError;
        }
        continue;
      }
      if (Date.parse(current.expires_at) > Date.now()) {
        fail('QUERY_TASK_LEASE_ACTIVE', '另一个 Query task 服务正在修改状态', {
          expires_at: current.expires_at,
        });
      }
      if (current.input_fingerprint !== fingerprint) {
        fail('QUERY_TASK_STATE_CONFLICT', 'stale lease 属于不同 input fingerprint');
      }
      const historyRoot = `runs/${taskId}/browser-query-lease-history`;
      await mkdir(resolveWithin(workspace, historyRoot), { recursive: true });
      const historyPath = `${historyRoot}/${sha256(stableStringify(current)).slice(0, 16)}`;
      try {
        await rename(
          resolveWithin(workspace, leaseRoot(taskId)),
          resolveWithin(workspace, historyPath),
        );
      } catch (renameError) {
        if (!['ENOENT', 'EEXIST', 'ENOTEMPTY'].includes(renameError.code)) throw renameError;
      }
    }
  }
  fail('QUERY_TASK_LEASE_STALE', '无法安全接管 Query task lease');
}

function sameLease(left, right) {
  return left.owner_id === right.owner_id
    && left.input_fingerprint === right.input_fingerprint
    && left.fence_revision === right.fence_revision;
}

async function assertLeaseCurrent({ workspace, taskId, lease }) {
  const current = await readLease(workspace, taskId);
  if (!sameLease(current, lease) || Date.parse(current.expires_at) <= Date.now()) {
    fail('QUERY_TASK_LEASE_ACTIVE', 'Query task lease 已过期或被新 owner 接管');
  }
  return current;
}

async function heartbeatLease({ workspace, taskId, lease, ttlMs }) {
  const current = await assertLeaseCurrent({ workspace, taskId, lease });
  const heartbeatAt = new Date();
  const heartbeat = {
    ...current,
    heartbeat_at: heartbeatAt.toISOString(),
    expires_at: new Date(heartbeatAt.getTime() + ttlMs).toISOString(),
  };
  await atomicWrite(workspace, `${leaseRoot(taskId)}/lease.json`, stableStringify(heartbeat, 2));
  Object.assign(lease, heartbeat);
}

async function releaseLease({ workspace, taskId, lease }) {
  const current = await readLease(workspace, taskId);
  if (!sameLease(current, lease)) fail('QUERY_TASK_LEASE_ACTIVE', 'stale owner 不能释放 takeover lease');
  await rm(resolveWithin(workspace, leaseRoot(taskId)), { recursive: true });
}

export async function withBrowserQueryTaskLease({
  workspace,
  taskId,
  fingerprint,
  expectedRevision,
  ttlMs = 60_000,
  operation,
}) {
  if (!fingerprint || !Number.isInteger(expectedRevision) || expectedRevision < 0) {
    fail('QUERY_TASK_STATE_CONFLICT', 'lease 缺 input fingerprint 或 expected revision');
  }
  const lease = await acquireLease({
    workspace, taskId, fingerprint, expectedRevision, ttlMs,
  });
  let heartbeatError = null;
  const heartbeatTimer = setInterval(() => {
    heartbeatLease({ workspace, taskId, lease, ttlMs }).catch((error) => {
      heartbeatError = error;
    });
  }, Math.max(1_000, Math.floor(ttlMs / 3)));
  heartbeatTimer.unref();
  const assertCurrent = async () => {
    if (heartbeatError) throw heartbeatError;
    await heartbeatLease({ workspace, taskId, lease, ttlMs });
    return assertLeaseCurrent({ workspace, taskId, lease });
  };
  try {
    const result = await operation({ lease, assertCurrent });
    await assertCurrent();
    return result;
  } finally {
    clearInterval(heartbeatTimer);
    await releaseLease({ workspace, taskId, lease });
  }
}
