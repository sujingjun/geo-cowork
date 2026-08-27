import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import path from 'node:path';

import {
  collectorProfileFingerprint,
  validateCollectorProfileData,
} from '../lib/answer-profile.mjs';
import { assertPlatformAutomationAllowed } from './platforms/index.mjs';

const OUTCOMES = new Set([
  'success', 'refusal', 'timeout', 'no_result',
  'challenge', 'cancelled', 'system_failure',
]);

export class PlaywrightCollectorError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PlaywrightCollectorError';
    this.code = code;
    Object.assign(this, details);
  }
}

export function assertPlaywrightVersion(actual, expected) {
  if (actual !== expected) {
    throw new PlaywrightCollectorError(
      'PLAYWRIGHT_RUNTIME_MISMATCH',
      `Playwright runtime ${actual} 与批准版本 ${expected} 不一致`,
      { actual, expected },
    );
  }
  return actual;
}

export function resolveGlobalPlaywright({ expectedVersion = '1.62.1' } = {}) {
  let globalRoot;
  try {
    globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
    const require = createRequire(import.meta.url);
    const packageFile = path.join(globalRoot, 'playwright', 'package.json');
    const packageData = require(packageFile);
    assertPlaywrightVersion(packageData.version, expectedVersion);
    const playwright = require(path.join(globalRoot, 'playwright'));
    return { version: packageData.version, playwright, global_root: globalRoot };
  } catch (error) {
    if (error.code === 'PLAYWRIGHT_RUNTIME_MISMATCH') throw error;
    throw new PlaywrightCollectorError(
      'PLAYWRIGHT_GATE_NOT_APPROVED',
      '无法解析已批准的全局 Playwright runtime',
      { global_root: globalRoot ?? null },
    );
  }
}

function parseViewport(value) {
  if (value === 'unknown') return undefined;
  const match = /^(\d+)x(\d+)$/.exec(value);
  if (!match) throw new PlaywrightCollectorError('M5_FIELD_REQUIRED', 'viewport 必须为 WIDTHxHEIGHT');
  return { width: Number(match[1]), height: Number(match[2]) };
}

function validateAuthorization(authorization, profile, adapter) {
  if (!authorization?.decision_ref?.startsWith('workspace://')
      || authorization.platform !== profile.platform
      || authorization.retention_days !== 365
      || authorization.account_identifier_stored !== false
      || authorization.credentials_stored !== false
      || authorization.external_writes !== false
      || !Array.isArray(authorization.allowed_artifacts)
      || !authorization.allowed_artifacts.includes('collector_log')
      || authorization.allowed_artifacts.some((role) => !adapter.allowed_artifacts.includes(role))) {
    throw new PlaywrightCollectorError(
      'COLLECTION_AUTHORIZATION_REQUIRED',
      '平台 authorization 缺失、过期或不匹配',
    );
  }
  if (!authorization.product_entries.includes(profile.product_entry)
      || !adapter.product_entries.includes(profile.product_entry)) {
    throw new PlaywrightCollectorError(
      'PLATFORM_ALLOWLIST_VIOLATION',
      'product entry 不在 authorization 与 adapter 的交集',
      { product_entry: profile.product_entry },
    );
  }
  return authorization;
}

function withTimeout(promise, timeoutMs) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new PlaywrightCollectorError(
      'SAMPLE_TERMINAL_STATE_UNKNOWN',
      '等待平台终态超时',
    )), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function runPlaywrightAttempt({
  runtime,
  expectedVersion,
  profile,
  authorization,
  adapter,
  query,
  ordinal,
  attemptNo,
  timeoutMs,
}) {
  validateCollectorProfileData(profile);
  if (profile.platform !== adapter.platform) {
    throw new PlaywrightCollectorError('PLATFORM_ADAPTER_INVALID', 'Profile 与 adapter platform 不一致');
  }
  assertPlatformAutomationAllowed(adapter);
  validateAuthorization(authorization, profile, adapter);
  assertPlaywrightVersion(runtime.version, expectedVersion);

  const allowOrigins = new Set(adapter.product_entries.map((entry) => new URL(entry).origin));
  let browser;
  let context;
  const startedAt = Date.now();
  try {
    browser = await runtime.playwright.chromium.launch({ headless: true });
    const viewport = parseViewport(profile.device.viewport);
    const contextOptions = {
      ...(profile.language === 'unknown' ? {} : { locale: profile.language }),
      ...(viewport ? { viewport } : {}),
    };
    context = await browser.newContext(contextOptions);
    await context.route('**/*', async (route) => {
      const requestUrl = route.request?.().url?.() ?? profile.product_entry;
      if (allowOrigins.has(new URL(requestUrl).origin)) await route.continue();
      else await route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    await adapter.navigate(page, profile.product_entry);
    if (!adapter.product_entries.includes(page.url())) {
      throw new PlaywrightCollectorError('PLATFORM_ALLOWLIST_VIOLATION', '页面导航离开批准入口');
    }
    const observedProfile = await adapter.inspectProfile(page, profile);
    await adapter.submitQuery(page, query);
    const terminal = await withTimeout(adapter.waitForTerminal(page, { timeoutMs }), timeoutMs);
    if (!OUTCOMES.has(terminal.outcome)) {
      throw new PlaywrightCollectorError('SAMPLE_TERMINAL_STATE_UNKNOWN', 'adapter 返回非法终态');
    }
    const extracted = await adapter.extract(page, terminal);
    return {
      outcome: terminal.outcome,
      answer_text: extracted.answer_text ?? null,
      citations: extracted.citations ?? [],
      artifacts: [
        ...(extracted.answer_text ? [{ role: 'answer_text', content: extracted.answer_text }] : []),
        {
          role: 'collector_log',
          content: JSON.stringify({
            adapter_id: adapter.id,
            adapter_version: adapter.version,
            selector_version: adapter.selector_version,
            terminal_detector_version: adapter.terminal_detector_version,
            outcome: terminal.outcome,
            ordinal,
            attempt_no: attemptNo,
          }),
        },
      ],
      diagnostics: {
        ...observedProfile,
        adapter_id: adapter.id,
        adapter_version: adapter.version,
        duration_ms: Date.now() - startedAt,
      },
    };
  } finally {
    if (context) await context.close();
    if (browser) await browser.close();
  }
}

export async function smokeGlobalPlaywright({ expectedVersion = '1.62.1' } = {}) {
  const runtime = resolveGlobalPlaywright({ expectedVersion });
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html>
      <form><input aria-label="query"><button type="submit">Ask</button></form>
      <main hidden>Local Playwright answer <a href="https://source.example.invalid/page">Source</a></main>
      <script>
        document.querySelector('form').addEventListener('submit', event => {
          event.preventDefault();
          document.querySelector('main').hidden = false;
        });
      </script>`);
  });
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    const entry = `http://127.0.0.1:${address.port}/`;
    const profile = {
      id: 'CPF-LOCAL-PLAYWRIGHT-SMOKE-001',
      record_type: 'collector_profile',
      status: 'frozen',
      version: '1.0.0',
      created_at: '2026-08-25T00:00:00+08:00',
      updated_at: '2026-08-25T00:00:00+08:00',
      title: 'Local Playwright smoke profile',
      platform: 'chatgpt',
      product_entry: entry,
      region: 'unknown',
      language: 'en-US',
      login_state: 'logged_out',
      conversation_state: 'new',
      web_search_state: 'unavailable',
      model_mode: 'local-fixture',
      query_template_version: '1.0.0',
      sampling_count: 2,
      time_window: {
        id: 'TW-LOCAL-PLAYWRIGHT-SMOKE-001',
        starts_at: '2026-08-25T00:00:00+08:00',
        ends_at: '2026-08-26T00:00:00+08:00',
      },
      device: {
        class: 'desktop', os: 'macOS', browser: 'Chrome for Testing', viewport: '1280x720',
      },
      collection_method: 'browser_automation',
      approval: {
        approved_by: 'Local fixture owner',
        approved_at: '2026-08-25T00:00:00+08:00',
        decision_ref: 'fixture://approval/playwright-smoke',
      },
    };
    profile.profile_fingerprint = collectorProfileFingerprint(profile);
    const adapter = {
      id: 'local-playwright-smoke',
      platform: 'chatgpt',
      version: 'local-playwright-smoke-v1',
      product_entries: [entry],
      selector_version: 'local-smoke-selectors-v1',
      terminal_detector_version: 'local-smoke-terminal-v1',
      allowed_artifacts: ['answer_text', 'citation_raw', 'collector_log'],
      automation: { status: 'allowed', policy_url: 'fixture://policy/local-smoke' },
      manual_fallback: { allowed: false, requirements: [] },
      stop_conditions: ['local_fixture_failure'],
      async navigate(page, target) { await page.goto(target); },
      async inspectProfile() { return { login_state: 'logged_out', context_id: 'local-smoke' }; },
      async submitQuery(page, query) {
        await page.getByLabel('query').fill(query);
        await page.getByRole('button', { name: 'Ask' }).click();
      },
      async waitForTerminal(page) {
        await page.locator('main').waitFor({ state: 'visible' });
        return { outcome: 'success', proof: 'local-main-visible' };
      },
      async extract(page) {
        return {
          answer_text: await page.locator('main').innerText(),
          citations: [{
            url_raw: await page.locator('main a').getAttribute('href'), occurrence_index: 1,
          }],
        };
      },
    };
    const result = await runPlaywrightAttempt({
      runtime,
      expectedVersion,
      profile,
      authorization: {
        decision_ref: 'workspace://cycles/preparation/decisions/local-playwright-smoke.md',
        platform: 'chatgpt',
        product_entries: [entry],
        allowed_artifacts: adapter.allowed_artifacts,
        retention_days: 365,
        account_identifier_stored: false,
        credentials_stored: false,
        external_writes: false,
      },
      adapter,
      query: 'What is the local fixture?',
      ordinal: 1,
      attemptNo: 1,
      timeoutMs: 10_000,
    });
    return {
      ok: result.outcome === 'success' && result.citations.length === 1,
      version: runtime.version,
      browser_executable: runtime.playwright.chromium.executablePath(),
      base_outcome: result.outcome,
      citation_count: result.citations.length,
      network: 'loopback_only',
    };
  } catch (error) {
    throw new PlaywrightCollectorError(
      'BROWSER_BINARY_UNAVAILABLE',
      '全局 Playwright 无法启动当前 browser binary',
      { cause: error.message },
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}
