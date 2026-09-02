import {
  assertPlatformAutomationAllowed,
  assertPlatformManualAllowed,
  getPlatformAdapter,
} from '../collectors/platforms/index.mjs';
import { loadBrowserQueryAuthorization } from './browser-query-task-authorization.mjs';
import { loadBrowserQueryCycle } from './browser-query-task-cycle.mjs';
import {
  assertSafeRelativePath,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';

export const BROWSER_QUERY_PLAN_SCHEMA = 'geo-browser-query-task-plan-v1';
export const BROWSER_QUERY_STATE_SCHEMA = 'geo-browser-query-task-state-v1';

const EXECUTION_MODES = new Set(['dom_automation', 'manual_assist']);

export class BrowserQueryTaskError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'BrowserQueryTaskError';
    this.code = code;
    Object.assign(this, details);
  }
}

export function failBrowserQueryTask(code, message, details = {}) {
  throw new BrowserQueryTaskError(code, message, details);
}

function assertNoSecrets(value, path = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecrets(item, [...path, index]));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (/^(?:cookie|cookies|password|access_token|api_key|account_email|credentials)$/i.test(key)) {
      failBrowserQueryTask('PRIVACY_SCOPE_VIOLATION', 'Query task 不得包含账号或凭据字段', {
        field: [...path, key].join('.'),
      });
    }
    assertNoSecrets(item, [...path, key]);
  }
}

function safeText(value, field, { max = 4_000 } = {}) {
  if (typeof value !== 'string' || !value.trim()) {
    failBrowserQueryTask('QUERY_TASK_INVALID', `${field} 不能为空`, { field });
  }
  const text = value.trim();
  if (Buffer.byteLength(text) > max) {
    failBrowserQueryTask('QUERY_TASK_INVALID', `${field} 超过长度上限`, { field });
  }
  return text;
}

function checkedEntryUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    failBrowserQueryTask('PLATFORM_ALLOWLIST_VIOLATION', 'platform.entry_url 不是合法 URL');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    failBrowserQueryTask('PLATFORM_ALLOWLIST_VIOLATION', 'platform.entry_url 协议或凭据非法');
  }
  return url;
}

function sameEntry(left, right) {
  const allowed = new URL(left);
  return allowed.origin === right.origin && allowed.pathname === right.pathname;
}

function validateSelectors(selectors) {
  const required = ['input', 'submit', 'answer', 'citation'];
  if (!selectors || typeof selectors !== 'object') {
    failBrowserQueryTask('QUERY_TASK_INVALID', 'dom_automation 缺少 selectors');
  }
  for (const field of required) {
    safeText(selectors[field], `platform.selectors.${field}`, { max: 500 });
  }
  if (selectors.busy !== undefined) {
    safeText(selectors.busy, 'platform.selectors.busy', { max: 500 });
  }
  const timeoutMs = Number(selectors.timeout_ms ?? 120_000);
  const stableMs = Number(selectors.stable_ms ?? 1_200);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 300_000) {
    failBrowserQueryTask('QUERY_TASK_INVALID', 'selectors.timeout_ms 必须在 1000..300000');
  }
  if (!Number.isInteger(stableMs) || stableMs < 250 || stableMs > 10_000) {
    failBrowserQueryTask('QUERY_TASK_INVALID', 'selectors.stable_ms 必须在 250..10000');
  }
  return {
    input: selectors.input,
    submit: selectors.submit,
    answer: selectors.answer,
    citation: selectors.citation,
    ...(selectors.busy ? { busy: selectors.busy } : {}),
    timeout_ms: timeoutMs,
    stable_ms: stableMs,
  };
}

function validatePlatform(plan) {
  const platform = plan.platform;
  if (!platform || typeof platform !== 'object') {
    failBrowserQueryTask('QUERY_TASK_INVALID', '缺少 platform');
  }
  const id = safeText(platform.id, 'platform.id', { max: 80 });
  const executionMode = safeText(platform.execution_mode, 'platform.execution_mode', { max: 40 });
  if (!EXECUTION_MODES.has(executionMode)) {
    failBrowserQueryTask('QUERY_TASK_INVALID', 'platform.execution_mode 非法');
  }
  const entryUrl = checkedEntryUrl(platform.entry_url);
  let adapter = null;
  let policy;
  let selectors;
  let selectorVersion;
  let terminalDetectorVersion;
  if (id === 'fixture') {
    if (!plan.development_fixture || executionMode !== 'dom_automation'
        || !plan.authorization_ref?.startsWith('fixture://')
        || entryUrl.hostname !== '127.0.0.1') {
      failBrowserQueryTask(
        'COLLECTION_AUTHORIZATION_REQUIRED',
        'fixture 自动化只允许显式 fixture:// 授权与 127.0.0.1 页面',
      );
    }
    policy = {
      status: 'allowed',
      reason: 'development fixture only',
      policy_url: 'fixture://browser-query-task',
    };
    selectors = validateSelectors(platform.selectors);
    selectorVersion = safeText(platform.selector_version, 'platform.selector_version', { max: 120 });
    terminalDetectorVersion = safeText(
      platform.terminal_detector_version,
      'platform.terminal_detector_version',
      { max: 120 },
    );
  } else {
    try {
      adapter = getPlatformAdapter(id);
    } catch (error) {
      failBrowserQueryTask(error.code ?? 'PLATFORM_ADAPTER_NOT_FOUND', error.message, { platform: id });
    }
    if (!adapter.product_entries.some((entry) => sameEntry(entry, entryUrl))) {
      failBrowserQueryTask(
        'PLATFORM_ALLOWLIST_VIOLATION',
        'platform.entry_url 不在 adapter allowlist',
        { platform: id },
      );
    }
    if (!plan.authorization_ref?.startsWith('workspace://')) {
      failBrowserQueryTask('COLLECTION_AUTHORIZATION_REQUIRED', '真实平台任务缺 workspace authorization');
    }
    if (executionMode === 'dom_automation') {
      assertPlatformAutomationAllowed(adapter);
      if (!adapter.extension_automation?.selectors) {
        failBrowserQueryTask(
          'PLATFORM_ADAPTER_INVALID',
          '获许可真实平台仍须在 adapter 中冻结 extension selectors',
          { platform: id },
        );
      }
      selectors = validateSelectors(adapter.extension_automation.selectors);
    } else {
      assertPlatformManualAllowed(adapter, { manualSourceKind: 'user_supplied_result_url' });
      if (adapter.manual_fallback.mode !== 'extension_manual_assist') {
        failBrowserQueryTask(
          'PLATFORM_MANUAL_COLLECTION_BLOCKED',
          '平台 manual 路径必须经由 GEO Browser Extension manual assist',
          { platform: id },
        );
      }
    }
    policy = adapter.automation;
    selectorVersion = adapter.selector_version;
    terminalDetectorVersion = adapter.terminal_detector_version;
  }
  return {
    id,
    adapter_id: adapter?.id ?? 'fixture-browser-query-adapter',
    adapter_version: adapter?.version ?? '1.0.0',
    entry_url: entryUrl.toString(),
    execution_mode: executionMode,
    selector_version: selectorVersion,
    terminal_detector_version: terminalDetectorVersion,
    policy: {
      status: policy.status,
      reason: policy.reason,
      policy_url: policy.policy_url,
    },
    result_url_origins: adapter?.manual_fallback.result_url_origins ?? [entryUrl.origin],
    ...(executionMode === 'dom_automation' ? { selectors } : {}),
  };
}

function validatePlan(plan) {
  assertNoSecrets(plan);
  if (!plan || typeof plan !== 'object' || plan.schema_version !== BROWSER_QUERY_PLAN_SCHEMA) {
    failBrowserQueryTask('QUERY_TASK_INVALID', `schema_version 必须为 ${BROWSER_QUERY_PLAN_SCHEMA}`);
  }
  const taskId = safeText(plan.task_id, 'task_id', { max: 120 });
  if (!/^BQT-[A-Z0-9-]+$/.test(taskId)) {
    failBrowserQueryTask('QUERY_TASK_INVALID', 'task_id 必须使用 BQT- 前缀');
  }
  const cycleRef = safeText(plan.cycle_ref, 'cycle_ref', { max: 240 });
  if (!/^CYC-[A-Z0-9-]+$/.test(cycleRef)) {
    failBrowserQueryTask('QUERY_TASK_INVALID', 'cycle_ref 必须引用 CYC- 对象');
  }
  const authorizationSha256 = plan.development_fixture
    ? null
    : safeText(plan.authorization_sha256, 'authorization_sha256', { max: 64 });
  if (!plan.development_fixture && !/^[a-f0-9]{64}$/.test(authorizationSha256)) {
    failBrowserQueryTask('COLLECTION_AUTHORIZATION_REQUIRED', 'authorization_sha256 必须是 SHA-256');
  }
  return {
    schema_version: BROWSER_QUERY_PLAN_SCHEMA,
    task_id: taskId,
    cycle_ref: cycleRef,
    cycle_version: safeText(plan.cycle_version, 'cycle_version', { max: 40 }),
    query_set: {
      ref: safeText(plan.query_set?.ref, 'query_set.ref', { max: 160 }),
      version: safeText(plan.query_set?.version, 'query_set.version', { max: 40 }),
    },
    authorization_ref: safeText(plan.authorization_ref, 'authorization_ref', { max: 500 }),
    authorization_sha256: authorizationSha256,
    development_fixture: Boolean(plan.development_fixture),
    state_path: assertSafeRelativePath(
      plan.state_path ?? `runs/${taskId}/browser-query-task-state.json`,
    ),
    platform: validatePlatform(plan),
  };
}

function inputProjection(plan, queries) {
  return {
    schema_version: plan.schema_version,
    task_id: plan.task_id,
    cycle_ref: plan.cycle_ref,
    cycle_version: plan.cycle_version,
    cycle_binding: plan.cycle_binding,
    query_set: plan.query_set,
    authorization_ref: plan.authorization_ref,
    authorization_sha256: plan.authorization_sha256,
    authorization: plan.authorization,
    development_fixture: plan.development_fixture,
    state_path: plan.state_path,
    platform: plan.platform,
    queries: queries.map(({ ref, version, query_text: queryText, language, intent }) => ({
      ref,
      version,
      query_text: queryText,
      language,
      intent,
    })),
  };
}

export async function prepareBrowserQueryTask({ workspace, plan, now }) {
  if (!Number.isFinite(Date.parse(now))) {
    failBrowserQueryTask('QUERY_TASK_INVALID', 'now 必须是合法 RFC3339 时间');
  }
  const normalizedPlan = validatePlan(plan);
  normalizedPlan.authorization = await loadBrowserQueryAuthorization({
    workspace,
    plan: normalizedPlan,
    now,
  });
  const loaded = await loadBrowserQueryCycle({ workspace, plan: normalizedPlan });
  normalizedPlan.cycle_binding = loaded.cycle_binding;
  const projection = inputProjection(normalizedPlan, loaded.queries);
  return {
    plan: normalizedPlan,
    queries: loaded.queries,
    input_projection: projection,
    fingerprint: sha256(stableStringify(projection)),
  };
}
