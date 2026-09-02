import {
  BROWSER_QUERY_CAPTURE_SCHEMA,
  inspectBrowserAttemptRecovery,
  materializeFailedBrowserAttempt,
  materializeSuccessfulBrowserAttempt,
  sanitizeBrowserFailureReason,
} from './browser-query-task-attempt.mjs';
import {
  BROWSER_QUERY_PLAN_SCHEMA,
  BROWSER_QUERY_STATE_SCHEMA,
  BrowserQueryTaskError,
  failBrowserQueryTask as fail,
  prepareBrowserQueryTask,
} from './browser-query-task-contract.mjs';
import {
  readBrowserQueryState,
  validateBrowserQueryState,
  validateBrowserQueryStateArtifacts,
  withBrowserQueryTaskLease,
  writeBrowserQueryState,
} from './browser-query-task-store.mjs';

function newState(plan, queries, inputProjection, fingerprint, now) {
  return {
    schema_version: BROWSER_QUERY_STATE_SCHEMA,
    task_id: plan.task_id,
    cycle_ref: plan.cycle_ref,
    cycle_version: plan.cycle_version,
    cycle_binding: plan.cycle_binding,
    status: 'pending',
    revision: 0,
    plan_fingerprint: fingerprint,
    input_projection: inputProjection,
    query_set: plan.query_set,
    platform: plan.platform,
    authorization_ref: plan.authorization_ref,
    authorization: plan.authorization,
    current_query_ref: queries[0].ref,
    queries: queries.map((query) => ({
      ...query,
      status: 'pending',
      attempt_count: 0,
      last_failure_reason: null,
      attempts: [],
    })),
    created_at: now,
    updated_at: now,
  };
}

export async function openBrowserQueryTask({ workspace, plan, now = new Date().toISOString() }) {
  const prepared = await prepareBrowserQueryTask({ workspace, plan, now });
  const normalizedPlan = prepared.plan;
  const existing = await readBrowserQueryState(workspace, normalizedPlan.state_path);
  if (existing) {
    const state = validateBrowserQueryState(existing, {
      schema: BROWSER_QUERY_STATE_SCHEMA,
      fingerprint: prepared.fingerprint,
    });
    await validateBrowserQueryStateArtifacts(workspace, state);
    return { action: 'resumed', state_path: normalizedPlan.state_path, state };
  }
  return withBrowserQueryTaskLease({
    workspace,
    taskId: normalizedPlan.task_id,
    fingerprint: prepared.fingerprint,
    expectedRevision: 0,
    async operation({ assertCurrent }) {
      const raced = await readBrowserQueryState(workspace, normalizedPlan.state_path);
      if (raced) {
        const state = validateBrowserQueryState(raced, {
          schema: BROWSER_QUERY_STATE_SCHEMA,
          fingerprint: prepared.fingerprint,
        });
        await validateBrowserQueryStateArtifacts(workspace, state);
        return { action: 'resumed', state_path: normalizedPlan.state_path, state };
      }
      const state = newState(
        normalizedPlan,
        prepared.queries,
        prepared.input_projection,
        prepared.fingerprint,
        now,
      );
      await assertCurrent();
      await writeBrowserQueryState(workspace, normalizedPlan.state_path, state);
      return { action: 'created', state_path: normalizedPlan.state_path, state };
    },
  });
}

function findQuery(state, queryRef) {
  const query = state.queries.find((item) => item.ref === queryRef);
  if (!query) {
    fail('QUERY_TASK_QUERY_NOT_FOUND', '任务中不存在指定 Query', { query_ref: queryRef });
  }
  return query;
}

function recalculateTaskState(state) {
  if (state.queries.every((query) => query.status === 'completed')) return 'completed';
  if (state.queries.some((query) => query.status === 'blocked')) return 'blocked';
  if (state.queries.some((query) => query.status === 'failed')) return 'failed';
  if (state.queries.some((query) => query.status === 'waiting_human')) return 'waiting_human';
  if (state.queries.some((query) => query.status === 'running')) return 'running';
  return 'pending';
}

async function mutate({ workspace, plan, now, change }) {
  const opened = await openBrowserQueryTask({ workspace, plan, now });
  return withBrowserQueryTaskLease({
    workspace,
    taskId: opened.state.task_id,
    fingerprint: opened.state.plan_fingerprint,
    expectedRevision: opened.state.revision,
    async operation({ assertCurrent }) {
      const latest = await readBrowserQueryState(workspace, opened.state_path);
      const state = structuredClone(validateBrowserQueryState(latest, {
        schema: BROWSER_QUERY_STATE_SCHEMA,
        fingerprint: opened.state.plan_fingerprint,
      }));
      await validateBrowserQueryStateArtifacts(workspace, state);
      const revision = state.revision;
      if (revision !== opened.state.revision) {
        fail('QUERY_TASK_STATE_CONFLICT', 'task state revision 已被另一 owner 推进');
      }
      const result = await change(state);
      state.status = recalculateTaskState(state);
      state.current_query_ref = state.queries.find((query) => query.status !== 'completed')?.ref ?? null;
      state.updated_at = now;
      state.revision = revision + 1;
      await validateBrowserQueryStateArtifacts(workspace, state);
      await assertCurrent();
      await writeBrowserQueryState(workspace, opened.state_path, state);
      return { action: 'updated', state_path: opened.state_path, state, ...result };
    },
  });
}

export async function startBrowserQuery({ workspace, plan, queryRef, now = new Date().toISOString() }) {
  return mutate({
    workspace,
    plan,
    now,
    change(state) {
      const query = queryRef
        ? findQuery(state, queryRef)
        : state.queries.find((item) => item.status === 'pending');
      if (!query) fail('QUERY_TASK_COMPLETE', '没有待执行 Query');
      if (query.status !== 'pending') {
        fail('QUERY_TASK_TRANSITION_INVALID', '只有 pending Query 可以开始', {
          query_ref: query.ref,
          status: query.status,
        });
      }
      if (state.queries.some((item) => ['running', 'waiting_human'].includes(item.status))) {
        fail('QUERY_TASK_TRANSITION_INVALID', '同一任务一次只能运行一条 Query');
      }
      query.status = 'running';
      query.attempt_count += 1;
      query.last_failure_reason = null;
      query.attempts.push({
        attempt_no: query.attempt_count,
        status: 'running',
        started_at: now,
      });
      return { query: structuredClone(query) };
    },
  });
}

function runningAttempt(query) {
  const attempt = query.attempts.at(-1);
  if (!['running', 'waiting_human'].includes(query.status)
      || !attempt || !['running', 'waiting_human'].includes(attempt.status)) {
    fail('QUERY_TASK_TRANSITION_INVALID', 'Query 没有可结束的 active attempt', {
      query_ref: query.ref,
      status: query.status,
    });
  }
  return attempt;
}

export async function completeBrowserQuery({
  workspace,
  plan,
  queryRef,
  answerText,
  citations,
  resultUrl,
  outcome = 'success',
  now = new Date().toISOString(),
}) {
  return mutate({
    workspace,
    plan,
    now,
    async change(state) {
      const query = findQuery(state, queryRef);
      const attempt = runningAttempt(query);
      const materialized = await materializeSuccessfulBrowserAttempt({
        workspace, state, query, attempt, answerText, citations, resultUrl, outcome, now,
      });
      Object.assign(attempt, {
        status: 'completed',
        outcome,
        completed_at: materialized.capture.captured_at,
        result_url: materialized.result_url,
        capture_path: materialized.capture_path,
        capture_sha256: materialized.capture_sha256,
        outcome_path: materialized.outcome_path,
        outcome_sha256: materialized.outcome_sha256,
      });
      query.status = 'completed';
      query.last_failure_reason = null;
      return { query: structuredClone(query), capture: materialized.capture };
    },
  });
}

export async function failBrowserQuery({
  workspace,
  plan,
  queryRef,
  reason,
  outcome = 'system_failure',
  now = new Date().toISOString(),
}) {
  return mutate({
    workspace,
    plan,
    now,
    async change(state) {
      const query = findQuery(state, queryRef);
      const attempt = runningAttempt(query);
      const materialized = await materializeFailedBrowserAttempt({
        workspace, state, query, attempt, reason, outcome, now,
      });
      const status = outcome === 'system_failure'
        ? 'failed'
        : outcome === 'challenge' ? 'blocked' : 'completed';
      Object.assign(attempt, {
        status,
        outcome,
        completed_at: materialized.failure.failed_at,
        failure_reason: materialized.failure_reason,
        collector_log_path: materialized.collector_log_path,
        collector_log_sha256: materialized.collector_log_sha256,
        outcome_path: materialized.outcome_path,
        outcome_sha256: materialized.outcome_sha256,
      });
      query.status = status;
      query.last_failure_reason = materialized.failure_reason;
      return { query: structuredClone(query), failure: materialized.failure };
    },
  });
}

export async function markBrowserQueryUncertain({
  workspace,
  plan,
  queryRef,
  reason,
  now = new Date().toISOString(),
}) {
  const recoveryReason = sanitizeBrowserFailureReason(reason);
  return mutate({
    workspace,
    plan,
    now,
    change(state) {
      const query = findQuery(state, queryRef);
      const attempt = runningAttempt(query);
      attempt.status = 'waiting_human';
      attempt.recovery_reason = 'SAMPLE_TERMINAL_STATE_UNKNOWN';
      attempt.recovery_detail = recoveryReason;
      query.status = 'waiting_human';
      query.last_failure_reason = 'SAMPLE_TERMINAL_STATE_UNKNOWN';
      return { query: structuredClone(query), recovery: 'waiting_human' };
    },
  });
}

export async function retryBrowserQuery({ workspace, plan, queryRef, now = new Date().toISOString() }) {
  return mutate({
    workspace,
    plan,
    now,
    change(state) {
      const query = findQuery(state, queryRef);
      if (query.status !== 'failed' || query.attempts.at(-1)?.outcome !== 'system_failure') {
        fail('QUERY_TASK_TRANSITION_INVALID', '只有 system_failure attempt 可以重试');
      }
      query.status = 'pending';
      return { query: structuredClone(query) };
    },
  });
}

export async function recoverBrowserQueryTask({
  workspace,
  plan,
  now = new Date().toISOString(),
}) {
  const opened = await openBrowserQueryTask({ workspace, plan, now });
  if (!opened.state.queries.some((query) => query.status === 'running')) {
    return { action: 'kept', state_path: opened.state_path, state: opened.state };
  }
  return mutate({
    workspace,
    plan,
    now,
    async change(state) {
      for (const query of state.queries) {
        if (query.status !== 'running') continue;
        const attempt = query.attempts.at(-1);
        const recovered = attempt
          ? await inspectBrowserAttemptRecovery({ workspace, state, query, attempt })
          : null;
        if (recovered) {
          Object.assign(attempt, recovered);
          query.status = recovered.status;
          query.last_failure_reason = recovered.failure_reason ?? (
            recovered.status === 'waiting_human' ? 'OUTCOME_MATERIALIZATION_INCOMPLETE' : null
          );
        } else {
          query.status = 'waiting_human';
          query.last_failure_reason = 'SAMPLE_TERMINAL_STATE_UNKNOWN';
          if (attempt?.status === 'running') {
            attempt.status = 'waiting_human';
            attempt.recovery_reason = 'SAMPLE_TERMINAL_STATE_UNKNOWN';
          }
        }
      }
      return { recovery: 'waiting_human' };
    },
  });
}

export { BrowserQueryTaskError };

export const BROWSER_QUERY_TASK_SCHEMAS = Object.freeze({
  plan: BROWSER_QUERY_PLAN_SCHEMA,
  state: BROWSER_QUERY_STATE_SCHEMA,
  capture: BROWSER_QUERY_CAPTURE_SCHEMA,
});
