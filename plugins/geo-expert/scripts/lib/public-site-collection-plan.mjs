import { assertSafeRelativePath } from './workspace-paths.mjs';

const PLAN_KEYS = new Set([
  'schema_version', 'run_id', 'origin', 'development_fixture', 'collector',
  'request', 'raw_retention_days', 'reviewer_role', 'allowlist', 'targets',
]);
const COLLECTOR_KEYS = new Set(['name', 'version', 'mode']);
const REQUEST_KEYS = new Set([
  'user_agent', 'accept_language', 'concurrency', 'request_interval_ms',
  'timeout_ms', 'max_retries', 'max_redirects', 'max_response_bytes',
]);
const TARGET_KEYS = new Set([
  'id', 'path', 'file', 'expected_statuses', 'expected_media_types',
]);

export class PublicSiteCollectionError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PublicSiteCollectionError';
    this.code = code;
    Object.assign(this, details);
  }
}

function fail(code, message, details) {
  throw new PublicSiteCollectionError(code, message, details);
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail('INVALID_COLLECTION_PLAN', `${label} 必须是对象`);
  }
}

function assertExactKeys(value, allowed, label) {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    fail('INVALID_COLLECTION_PLAN', `${label} 含未知字段`, { fields: unknown.sort() });
  }
}

function assertInteger(value, label, { min, max }) {
  if (!Number.isInteger(value) || value < min || value > max) {
    fail('INVALID_COLLECTION_PLAN', `${label} 必须是 ${min}—${max} 的整数`);
  }
  return value;
}

function normalizeOrigin(origin, developmentFixture) {
  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    fail('INVALID_COLLECTION_PLAN', 'origin 必须是合法 URL');
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
    fail('INVALID_COLLECTION_PLAN', 'origin 只能包含 scheme、host 与可选 port');
  }
  const localFixture = developmentFixture
    && ['127.0.0.1', 'localhost', '[::1]'].includes(parsed.hostname);
  if (parsed.protocol !== 'https:' && !localFixture) {
    fail('INVALID_COLLECTION_PLAN', '真实公开采集 origin 必须使用 HTTPS');
  }
  return parsed.origin;
}

function normalizeStringArray(value, label, { pattern } = {}) {
  if (!Array.isArray(value) || value.length === 0) {
    fail('INVALID_COLLECTION_PLAN', `${label} 必须是非空数组`);
  }
  const result = value.map((item) => {
    if (typeof item !== 'string' || item.length === 0 || (pattern && !pattern.test(item))) {
      fail('INVALID_COLLECTION_PLAN', `${label} 含非法值`);
    }
    return item;
  });
  if (new Set(result).size !== result.length) {
    fail('INVALID_COLLECTION_PLAN', `${label} 不允许重复值`);
  }
  return result;
}

function normalizeTarget(target, allowlist) {
  assertObject(target, 'target');
  assertExactKeys(target, TARGET_KEYS, 'target');
  if (typeof target.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(target.id)) {
    fail('INVALID_COLLECTION_PLAN', 'target.id 必须是小写稳定标识');
  }
  if (!allowlist.has(target.path)) {
    fail('TARGET_NOT_ALLOWED', 'target.path 不在 allowlist', { path: target.path });
  }
  const file = assertSafeRelativePath(target.file);
  if (file.includes('/')) fail('INVALID_COLLECTION_PLAN', 'target.file 不能包含目录');
  if (!Array.isArray(target.expected_statuses) || target.expected_statuses.length === 0) {
    fail('INVALID_COLLECTION_PLAN', 'target.expected_statuses 必须是非空数组');
  }
  const expectedStatuses = target.expected_statuses.map((status) =>
    assertInteger(status, 'expected_status', { min: 100, max: 599 }));
  const expectedMediaTypes = normalizeStringArray(
    target.expected_media_types,
    'target.expected_media_types',
    { pattern: /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/ },
  );
  return {
    id: target.id,
    path: target.path,
    file,
    expected_statuses: [...new Set(expectedStatuses)].sort((a, b) => a - b),
    expected_media_types: [...expectedMediaTypes].sort(),
  };
}

export function normalizeCollectionPlan(plan) {
  assertObject(plan, 'plan');
  assertExactKeys(plan, PLAN_KEYS, 'plan');
  if (plan.schema_version !== '1.0.0') {
    fail('INVALID_COLLECTION_PLAN', 'schema_version 必须为 1.0.0');
  }
  if (typeof plan.run_id !== 'string' || !/^RUN-[A-Z0-9-]+$/.test(plan.run_id)) {
    fail('INVALID_COLLECTION_PLAN', 'run_id 必须是 RUN- 开头的稳定 ID');
  }
  if (plan.development_fixture !== undefined && typeof plan.development_fixture !== 'boolean') {
    fail('INVALID_COLLECTION_PLAN', 'development_fixture 必须是 boolean');
  }
  const developmentFixture = plan.development_fixture === true;
  const origin = normalizeOrigin(plan.origin, developmentFixture);

  assertObject(plan.collector, 'collector');
  assertExactKeys(plan.collector, COLLECTOR_KEYS, 'collector');
  if (
    plan.collector.name !== 'geo-cowork-public-site'
    || plan.collector.mode !== 'public_http'
    || typeof plan.collector.version !== 'string'
    || !/^\d+\.\d+\.\d+$/.test(plan.collector.version)
  ) {
    fail('INVALID_COLLECTION_PLAN', 'collector name/version/mode 非法');
  }

  assertObject(plan.request, 'request');
  assertExactKeys(plan.request, REQUEST_KEYS, 'request');
  if (typeof plan.request.user_agent !== 'string' || !/^geo-cowork-m4\/\d+\.\d+\.\d+$/.test(plan.request.user_agent)) {
    fail('INVALID_COLLECTION_PLAN', 'request.user_agent 非法');
  }
  if (typeof plan.request.accept_language !== 'string' || plan.request.accept_language.length > 128) {
    fail('INVALID_COLLECTION_PLAN', 'request.accept_language 非法');
  }
  const request = {
    user_agent: plan.request.user_agent,
    accept_language: plan.request.accept_language,
    concurrency: assertInteger(plan.request.concurrency, 'request.concurrency', { min: 1, max: 1 }),
    request_interval_ms: assertInteger(
      plan.request.request_interval_ms,
      'request.request_interval_ms',
      { min: developmentFixture ? 0 : 1000, max: 60000 },
    ),
    timeout_ms: assertInteger(plan.request.timeout_ms, 'request.timeout_ms', { min: 1, max: 120000 }),
    max_retries: assertInteger(plan.request.max_retries, 'request.max_retries', { min: 0, max: 5 }),
    max_redirects: assertInteger(plan.request.max_redirects, 'request.max_redirects', { min: 0, max: 10 }),
    max_response_bytes: assertInteger(
      plan.request.max_response_bytes,
      'request.max_response_bytes',
      { min: 1, max: 10 * 1024 * 1024 },
    ),
  };

  const allowlistValues = normalizeStringArray(plan.allowlist, 'allowlist');
  const allowlist = new Set();
  for (const item of allowlistValues) {
    if (!item.startsWith('/') || item.includes('?') || item.includes('#')) {
      fail('INVALID_COLLECTION_PLAN', 'allowlist 只允许 origin-relative pathname');
    }
    const parsed = new URL(item, origin);
    if (parsed.origin !== origin || parsed.pathname !== item) {
      fail('INVALID_COLLECTION_PLAN', 'allowlist pathname 非法', { path: item });
    }
    allowlist.add(item);
  }
  if (!Array.isArray(plan.targets) || plan.targets.length === 0) {
    fail('INVALID_COLLECTION_PLAN', 'targets 必须是非空数组');
  }
  const targets = plan.targets.map((target) => normalizeTarget(target, allowlist));
  for (const key of ['id', 'path', 'file']) {
    const values = targets.map((target) => target[key]);
    if (new Set(values).size !== values.length) {
      fail('INVALID_COLLECTION_PLAN', `target.${key} 不允许重复`);
    }
  }
  if (typeof plan.reviewer_role !== 'string' || plan.reviewer_role.trim().length === 0) {
    fail('INVALID_COLLECTION_PLAN', 'reviewer_role 必填');
  }

  return {
    schema_version: '1.0.0',
    run_id: plan.run_id,
    origin,
    development_fixture: developmentFixture,
    collector: { ...plan.collector },
    request,
    raw_retention_days: assertInteger(
      plan.raw_retention_days,
      'raw_retention_days',
      { min: 1, max: 365 },
    ),
    reviewer_role: plan.reviewer_role.trim(),
    allowlist: [...allowlist].sort(),
    targets,
  };
}

