import { readFile } from 'node:fs/promises';

import { assertManualAnswerPrivacy } from './answer-sample.mjs';
import { normalizeCitationUrl } from './source-registry.mjs';
import {
  resolveWithin,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

const CAPTURE_SCHEMA = 'geo-browser-query-capture-v1';
const MAX_ANSWER_BYTES = 2 * 1024 * 1024;
const MAX_CITATIONS = 500;
const ANSWER_OUTCOMES = new Set(['success', 'refusal']);
const FAILURE_OUTCOMES = new Set(['system_failure', 'timeout', 'no_result', 'challenge', 'cancelled']);

class BrowserQueryAttemptError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'BrowserQueryAttemptError';
    this.code = code;
    Object.assign(this, details);
  }
}

function fail(code, message, details = {}) {
  throw new BrowserQueryAttemptError(code, message, details);
}

function safeText(value, field, { required = true, max = 4_000 } = {}) {
  if (typeof value !== 'string') fail('QUERY_TASK_INVALID', `${field} 必须是字符串`, { field });
  const text = value.trim();
  if (required && !text) fail('QUERY_TASK_INVALID', `${field} 不能为空`, { field });
  if (Buffer.byteLength(text) > max) fail('QUERY_TASK_INVALID', `${field} 超过长度上限`, { field });
  return text;
}

function assertSafeArtifactText(value) {
  if (!value) return;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Invalid escapes are handled by URL parsing; scan the original text here.
  }
  assertManualAnswerPrivacy(decoded);
}

function assertSafeUrlParameters(url) {
  for (const [key, value] of url.searchParams) {
    if (/(?:password|passcode|token|secret|credential|cookie|auth|api[_-]?key|session|code)/i.test(key)) {
      fail('PRIVACY_SCOPE_VIOLATION', 'URL 不得包含凭据形态的 query 参数', { field: key });
    }
    assertSafeArtifactText(`${key}=${value}`);
  }
  assertSafeArtifactText(url.toString());
}

export function sanitizeBrowserFailureReason(reason) {
  const value = safeText(reason, 'failure_reason', { max: 4_000 });
  assertManualAnswerPrivacy(value);
  return value;
}

function checkedResultUrl(value, platform) {
  let result;
  try {
    result = new URL(value);
  } catch {
    fail('PLATFORM_ALLOWLIST_VIOLATION', 'result_url 不是合法 URL');
  }
  if (!['http:', 'https:'].includes(result.protocol) || result.username || result.password) {
    fail('PLATFORM_ALLOWLIST_VIOLATION', 'result_url 协议或凭据非法');
  }
  assertSafeUrlParameters(result);
  const allowedOrigins = Array.isArray(platform.result_url_origins)
    ? platform.result_url_origins
    : [new URL(platform.entry_url).origin];
  if (!allowedOrigins.includes(result.origin)) {
    fail('PLATFORM_ALLOWLIST_VIOLATION', 'result_url 与平台 origin 不一致');
  }
  return result.toString();
}

function normalizeCitations(citations) {
  if (!Array.isArray(citations) || citations.length > MAX_CITATIONS) {
    fail('QUERY_TASK_INVALID', `citations 必须是数组且不超过 ${MAX_CITATIONS} 条`);
  }
  return citations.map((citation, index) => {
    if (!citation || typeof citation !== 'object') fail('QUERY_TASK_INVALID', 'citation 必须是对象');
    const urlRaw = safeText(citation.url, `citations[${index}].url`, { max: 8_000 });
    let citationUrl;
    try {
      citationUrl = new URL(urlRaw);
    } catch {
      fail('CITATION_URL_INVALID', 'Citation URL 无法解析');
    }
    assertSafeUrlParameters(citationUrl);
    const title = safeText(citation.title ?? '', `citations[${index}].title`, {
      required: false,
      max: 1_000,
    });
    const context = safeText(citation.context ?? '', `citations[${index}].context`, {
      required: false,
      max: 4_000,
    });
    assertSafeArtifactText(title);
    assertSafeArtifactText(context);
    return {
      occurrence_index: index + 1,
      url_raw: urlRaw,
      ...normalizeCitationUrl(urlRaw),
      title,
      context,
    };
  });
}

export function browserQueryAttemptRoot(taskId, queryRef, attemptNo) {
  return `runs/${taskId}/browser-query-attempts/${sha256(queryRef).slice(0, 16)}/attempt-${attemptNo}`;
}

async function readOptionalJson(workspace, relativePath) {
  try {
    return JSON.parse(await readFile(resolveWithin(workspace, relativePath), 'utf8'));
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) return null;
    if (error instanceof SyntaxError) {
      fail('RAW_ARTIFACT_CONFLICT', '既有 artifact 不是合法 JSON', { path: relativePath });
    }
    throw error;
  }
}

async function readOptionalText(workspace, relativePath) {
  try {
    return await readFile(resolveWithin(workspace, relativePath), 'utf8');
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) return null;
    throw error;
  }
}

async function writeArtifact(workspace, relativePath, bytes) {
  await writeCreateOnly(workspace, relativePath, bytes, {
    idempotent: true,
    conflictCode: 'RAW_ARTIFACT_CONFLICT',
  });
}

async function reserveOutcome({ workspace, path, value }) {
  const existing = await readOptionalJson(workspace, path);
  if (existing) {
    const expected = { ...value, observed_at: existing.observed_at };
    if (stableStringify(existing) !== stableStringify(expected)) {
      fail('QUERY_ATTEMPT_OUTCOME_CONFLICT', '同一 attempt 已冻结另一终态', { path });
    }
    return existing;
  }
  const bytes = Buffer.from(stableStringify(value, 2));
  await writeArtifact(workspace, path, bytes);
  return value;
}

export async function materializeSuccessfulBrowserAttempt({
  workspace,
  state,
  query,
  attempt,
  answerText,
  citations,
  resultUrl,
  outcome = 'success',
  now,
}) {
  if (!ANSWER_OUTCOMES.has(outcome)) fail('QUERY_TASK_INVALID', '完整回答 outcome 只能是 success/refusal');
  if (typeof answerText !== 'string' || !answerText.trim()) {
    fail('QUERY_TASK_INVALID', 'answer_text 不能为空');
  }
  if (Buffer.byteLength(answerText) > MAX_ANSWER_BYTES) {
    fail('QUERY_TASK_INVALID', 'answer_text 超过 2 MiB');
  }
  assertManualAnswerPrivacy(answerText);
  const normalizedCitations = normalizeCitations(citations ?? []);
  const normalizedResultUrl = checkedResultUrl(resultUrl, state.platform);
  const root = browserQueryAttemptRoot(state.task_id, query.ref, attempt.attempt_no);
  const answerPath = `${root}/answer.md`;
  const citationsPath = `${root}/citations.json`;
  const logPath = `${root}/collector-log.json`;
  const capturePath = `${root}/capture.json`;
  const outcomePath = `${root}/outcome.json`;
  const answerBytes = Buffer.from(answerText);
  const citationBytes = Buffer.from(stableStringify(normalizedCitations, 2));
  const payloadFingerprint = sha256(stableStringify({
    answer_sha256: sha256(answerBytes),
    citations_sha256: sha256(citationBytes),
    result_url: normalizedResultUrl,
  }));
  const outcomeJournal = await reserveOutcome({
    workspace,
    path: outcomePath,
    value: {
      schema_version: 'geo-browser-query-outcome-v1',
      task_id: state.task_id,
      query_ref: query.ref,
      attempt_no: attempt.attempt_no,
      outcome,
      payload_fingerprint: payloadFingerprint,
      result_url: normalizedResultUrl,
      artifact_plan: [
        { role: 'answer_text', path: answerPath, sha256: sha256(answerBytes) },
        { role: 'citation_raw', path: citationsPath, sha256: sha256(citationBytes) },
      ],
      observed_at: now,
    },
  });
  const log = {
    schema_version: 'geo-browser-query-collector-log-v1',
    task_id: state.task_id,
    cycle_ref: state.cycle_ref,
    cycle_version: state.cycle_version,
    query_ref: query.ref,
    query_version: query.version,
    platform: state.platform.id,
    platform_adapter_id: state.platform.adapter_id,
    platform_adapter_version: state.platform.adapter_version,
    selector_version: state.platform.selector_version,
    terminal_detector_version: state.platform.terminal_detector_version,
    attempt_no: attempt.attempt_no,
    outcome,
    operator_role: state.platform.execution_mode === 'manual_assist'
      ? 'human_operator'
      : 'browser_extension',
    started_at: attempt.started_at,
    completed_at: outcomeJournal.observed_at,
    steps: [
      'query_loaded',
      'session_prepared',
      'query_submitted',
      'terminal_state_observed',
      'answer_captured',
      'citations_captured',
    ],
    account_identifier_stored: false,
    credentials_stored: false,
  };
  const logBytes = Buffer.from(stableStringify(log, 2));
  let capture = {
    schema_version: CAPTURE_SCHEMA,
    task_id: state.task_id,
    cycle_ref: state.cycle_ref,
    cycle_version: state.cycle_version,
    query_ref: query.ref,
    query_version: query.version,
    query_set_ref: state.query_set.ref,
    query_set_version: state.query_set.version,
    platform: state.platform.id,
    platform_adapter_id: state.platform.adapter_id,
    platform_adapter_version: state.platform.adapter_version,
    selector_version: state.platform.selector_version,
    terminal_detector_version: state.platform.terminal_detector_version,
    execution_mode: state.platform.execution_mode,
    collection_method: state.platform.execution_mode === 'manual_assist'
      ? 'manual'
      : 'browser_automation',
    authorization_ref: state.authorization_ref,
    authorization_sha256: state.authorization.decision_sha256,
    attempt_no: attempt.attempt_no,
    outcome,
    captured_at: outcomeJournal.observed_at,
    result_url: normalizedResultUrl,
    payload_fingerprint: payloadFingerprint,
    artifacts: [
      { role: 'answer_text', path: answerPath, sha256: sha256(answerBytes), media_type: 'text/markdown' },
      { role: 'citation_raw', path: citationsPath, sha256: sha256(citationBytes), media_type: 'application/json' },
      { role: 'collector_log', path: logPath, sha256: sha256(logBytes), media_type: 'application/json' },
    ],
    privacy: {
      account_identifier_stored: false,
      credentials_stored: false,
      answer_region_only: true,
    },
  };
  const existing = await readOptionalJson(workspace, capturePath);
  if (existing) {
    if (existing.payload_fingerprint !== payloadFingerprint) {
      fail('RAW_ARTIFACT_CONFLICT', '既有 capture 与当前完成请求不同', { path: capturePath });
    }
    capture = existing;
  }
  const captureBytes = Buffer.from(stableStringify(capture, 2));
  await writeArtifact(workspace, answerPath, answerBytes);
  await writeArtifact(workspace, citationsPath, citationBytes);
  await writeArtifact(workspace, logPath, logBytes);
  await writeArtifact(workspace, capturePath, captureBytes);
  return {
    capture,
    result_url: normalizedResultUrl,
    capture_path: capturePath,
    capture_sha256: sha256(captureBytes),
    outcome_path: outcomePath,
    outcome_sha256: sha256(Buffer.from(stableStringify(outcomeJournal, 2))),
  };
}

export async function materializeFailedBrowserAttempt({
  workspace,
  state,
  query,
  attempt,
  reason,
  outcome = 'system_failure',
  now,
}) {
  if (!FAILURE_OUTCOMES.has(outcome)) fail('QUERY_TASK_INVALID', '失败 outcome 非法');
  const failureReason = sanitizeBrowserFailureReason(reason);
  const root = browserQueryAttemptRoot(state.task_id, query.ref, attempt.attempt_no);
  const logPath = `${root}/collector-log.json`;
  const outcomePath = `${root}/outcome.json`;
  const failureFingerprint = sha256(stableStringify({
    task_id: state.task_id,
    query_ref: query.ref,
    attempt_no: attempt.attempt_no,
    failure_reason: failureReason,
  }));
  const outcomeJournal = await reserveOutcome({
    workspace,
    path: outcomePath,
    value: {
      schema_version: 'geo-browser-query-outcome-v1',
      task_id: state.task_id,
      query_ref: query.ref,
      attempt_no: attempt.attempt_no,
      outcome,
      payload_fingerprint: failureFingerprint,
      collector_log_path: logPath,
      failure_reason_sha256: sha256(failureReason),
      observed_at: now,
    },
  });
  let failure = {
    schema_version: 'geo-browser-query-failure-v1',
    task_id: state.task_id,
    cycle_ref: state.cycle_ref,
    cycle_version: state.cycle_version,
    query_ref: query.ref,
    query_version: query.version,
    platform: state.platform.id,
    collection_method: state.platform.execution_mode === 'manual_assist'
      ? 'manual'
      : 'browser_automation',
    platform_adapter_id: state.platform.adapter_id,
    platform_adapter_version: state.platform.adapter_version,
    selector_version: state.platform.selector_version,
    terminal_detector_version: state.platform.terminal_detector_version,
    attempt_no: attempt.attempt_no,
    outcome,
    failed_at: outcomeJournal.observed_at,
    failure_reason: failureReason,
    failure_fingerprint: failureFingerprint,
    account_identifier_stored: false,
    credentials_stored: false,
  };
  const existing = await readOptionalJson(workspace, logPath);
  if (existing) {
    if (existing.failure_fingerprint !== failureFingerprint) {
      fail('RAW_ARTIFACT_CONFLICT', '既有 failure log 与当前失败请求不同', { path: logPath });
    }
    failure = existing;
  }
  const logBytes = Buffer.from(stableStringify(failure, 2));
  await writeArtifact(workspace, logPath, logBytes);
  return {
    failure,
    failure_reason: failureReason,
    collector_log_path: logPath,
    collector_log_sha256: sha256(logBytes),
    outcome_path: outcomePath,
    outcome_sha256: sha256(Buffer.from(stableStringify(outcomeJournal, 2))),
  };
}

export async function inspectBrowserAttemptRecovery({ workspace, state, query, attempt }) {
  const root = browserQueryAttemptRoot(state.task_id, query.ref, attempt.attempt_no);
  const outcomePath = `${root}/outcome.json`;
  const outcome = await readOptionalJson(workspace, outcomePath);
  if (!outcome) return null;
  if (outcome.task_id !== state.task_id || outcome.query_ref !== query.ref
      || outcome.attempt_no !== attempt.attempt_no
      || !ANSWER_OUTCOMES.has(outcome.outcome) && !FAILURE_OUTCOMES.has(outcome.outcome)) {
    fail('QUERY_ATTEMPT_OUTCOME_CONFLICT', '恢复时 outcome journal 与 attempt 不一致');
  }
  const recovered = {
    outcome: outcome.outcome,
    outcome_path: outcomePath,
    outcome_sha256: sha256(Buffer.from(stableStringify(outcome, 2))),
    completed_at: outcome.observed_at,
  };
  if (ANSWER_OUTCOMES.has(outcome.outcome)) {
    const capturePath = `${root}/capture.json`;
    const capture = await readOptionalJson(workspace, capturePath);
    if (!capture) {
      const answerPlan = outcome.artifact_plan?.find((item) => item.role === 'answer_text');
      const citationPlan = outcome.artifact_plan?.find((item) => item.role === 'citation_raw');
      if (!answerPlan?.path || !citationPlan?.path || !outcome.result_url) {
        fail('QUERY_TASK_ARTIFACT_INCOMPLETE', 'outcome journal 缺少成功 materialization plan');
      }
      const answerText = await readOptionalText(workspace, answerPlan.path);
      const citationRaw = await readOptionalJson(workspace, citationPlan.path);
      if (answerText === null || !Array.isArray(citationRaw)) {
        return { ...recovered, status: 'waiting_human' };
      }
      const materialized = await materializeSuccessfulBrowserAttempt({
        workspace,
        state,
        query,
        attempt,
        answerText,
        citations: citationRaw.map((citation) => ({
          url: citation.url_raw,
          title: citation.title,
          context: citation.context,
        })),
        resultUrl: outcome.result_url,
        outcome: outcome.outcome,
        now: outcome.observed_at,
      });
      return {
        ...recovered,
        status: 'completed',
        result_url: materialized.result_url,
        capture_path: materialized.capture_path,
        capture_sha256: materialized.capture_sha256,
      };
    }
    return {
      ...recovered,
      status: 'completed',
      result_url: capture.result_url,
      capture_path: capturePath,
      capture_sha256: sha256(Buffer.from(stableStringify(capture, 2))),
    };
  }
  const logPath = `${root}/collector-log.json`;
  const failure = await readOptionalJson(workspace, logPath);
  if (!failure) {
    return { ...recovered, status: 'waiting_human' };
  }
  return {
    ...recovered,
    status: outcome.outcome === 'system_failure'
      ? 'failed'
      : outcome.outcome === 'challenge' ? 'blocked' : 'completed',
    failure_reason: failure.failure_reason,
    collector_log_path: logPath,
    collector_log_sha256: sha256(Buffer.from(stableStringify(failure, 2))),
  };
}

export const BROWSER_QUERY_CAPTURE_SCHEMA = CAPTURE_SCHEMA;
