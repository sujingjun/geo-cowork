import { readFile } from 'node:fs/promises';

import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  sha256,
} from './workspace-paths.mjs';

const REQUIRED_ARTIFACTS = Object.freeze(['answer_text', 'citation_raw', 'collector_log']);
const REQUIRED_STOP_CONDITIONS = Object.freeze([
  'challenge', 'account_warning', 'privacy_minimization_failed', 'selector_drift',
]);

class BrowserQueryAuthorizationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'BrowserQueryAuthorizationError';
    this.code = code;
  }
}

function fail(message) {
  throw new BrowserQueryAuthorizationError('COLLECTION_AUTHORIZATION_REQUIRED', message);
}

function validTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function sameEntry(left, right) {
  const allowed = new URL(left);
  return allowed.origin === right.origin && allowed.pathname === right.pathname;
}

export async function loadBrowserQueryAuthorization({ workspace, plan, now }) {
  if (plan.development_fixture) {
    return {
      decision_ref: plan.authorization_ref,
      decision_sha256: null,
      status: 'fixture',
      expires_at: null,
    };
  }
  const relativePath = assertSafeRelativePath(plan.authorization_ref.slice('workspace://'.length));
  if (!relativePath.startsWith('cycles/preparation/decisions/') || !relativePath.endsWith('.json')) {
    fail('Query task authorization 必须是 decisions/ 下的结构化 JSON');
  }
  let bytes;
  try {
    await assertNoSymlinkPath(workspace, relativePath);
    bytes = await readFile(resolveWithin(workspace, relativePath));
  } catch (error) {
    if (['ENOENT', 'PATH_NOT_FOUND'].includes(error.code)) fail('authorization_ref 不存在');
    throw error;
  }
  if (sha256(bytes) !== plan.authorization_sha256) {
    fail('authorization decision bytes 与冻结 SHA-256 不一致');
  }
  let decision;
  try {
    decision = JSON.parse(bytes.toString('utf8'));
  } catch {
    fail('authorization decision 不是合法 JSON');
  }
  const artifacts = new Set(decision.allowed_artifacts ?? []);
  const stopConditions = new Set(decision.stop_conditions ?? []);
  const retention = decision.artifact_retention_days ?? {};
  const nonEmpty = (value) => typeof value === 'string' && Boolean(value.trim());
  let entryMatches = false;
  try {
    entryMatches = sameEntry(decision.product_entry, new URL(plan.platform.entry_url));
  } catch {
    entryMatches = false;
  }
  const expectedMethod = plan.platform.execution_mode === 'dom_automation'
    ? 'browser_automation'
    : 'manual';
  const invalid = decision.schema_version !== 'geo-browser-query-authorization-v1'
    || decision.status !== 'approved'
    || decision.decision_ref !== plan.authorization_ref
    || decision.platform !== plan.platform.id
    || !entryMatches
    || decision.login_state !== 'logged_in'
    || !nonEmpty(decision.region)
    || !nonEmpty(decision.language)
    || decision.collection_method !== expectedMethod
    || decision.query_submission_allowed !== true
    || REQUIRED_ARTIFACTS.some((role) => !artifacts.has(role))
    || REQUIRED_ARTIFACTS.some((role) => !Number.isInteger(retention[role]) || retention[role] < 1)
    || decision.privacy?.answer_region_only !== true
    || decision.privacy?.account_identifier_stored !== false
    || decision.privacy?.credentials_stored !== false
    || !Array.isArray(decision.access_roles) || decision.access_roles.length === 0
    || decision.access_roles.some((role) => !nonEmpty(role))
    || !nonEmpty(decision.deletion_responsibility)
    || REQUIRED_STOP_CONDITIONS.some((condition) => !stopConditions.has(condition))
    || decision.external_writes !== false
    || !nonEmpty(decision.approved_by)
    || !validTimestamp(decision.approved_at)
    || !validTimestamp(decision.expires_at)
    || Date.parse(decision.expires_at) <= Date.parse(now)
    || Date.parse(decision.expires_at) <= Date.parse(decision.approved_at);
  if (invalid) fail('authorization decision 缺字段、过期或与任务范围不匹配');
  return {
    decision_ref: plan.authorization_ref,
    decision_sha256: plan.authorization_sha256,
    status: decision.status,
    expires_at: decision.expires_at,
    collection_method: decision.collection_method,
    allowed_artifacts: [...artifacts].sort(),
  };
}
