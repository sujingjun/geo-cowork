import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  assertPlaywrightVersion,
  runPlaywrightAttempt,
} from '../plugins/geo-expert/scripts/collectors/playwright-base.mjs';
import { collectorProfile } from './helpers/m5-fixtures.mjs';

function fakeRuntime() {
  const state = {
    launches: 0,
    contexts: [],
    closedContexts: 0,
    closedBrowsers: 0,
  };
  const handle = {
    version: '1.62.1',
    playwright: {
      chromium: {
        async launch() {
          state.launches += 1;
          return {
            async newContext(options) {
              const contextState = { id: state.contexts.length + 1, options, routes: [] };
              state.contexts.push(contextState);
              return {
                async route(pattern, handler) {
                  contextState.routes.push({ pattern, handler });
                },
                async newPage() {
                  return {
                    context_id: contextState.id,
                    current_url: null,
                    submitted_query: null,
                    async goto(url) { this.current_url = url; },
                    url() { return this.current_url; },
                  };
                },
                async close() { state.closedContexts += 1; },
              };
            },
            async close() { state.closedBrowsers += 1; },
          };
        },
      },
    },
  };
  return { handle, state };
}

const AUTHORIZATION = {
  decision_ref: 'workspace://cycles/preparation/decisions/m5-platform-authorized.md',
  platform: 'chatgpt',
  product_entries: ['https://consumer.example.invalid/chat'],
  allowed_artifacts: ['answer_text', 'citation_raw', 'collector_log'],
  retention_days: 365,
  account_identifier_stored: false,
  credentials_stored: false,
  external_writes: false,
};

const FIXTURE_ADAPTER = {
  id: 'fixture-playwright',
  platform: 'chatgpt',
  version: 'fixture-playwright-v1',
  product_entries: ['https://consumer.example.invalid/chat'],
  automation: { status: 'allowed', policy_url: 'fixture://policy/allowed' },
  selector_version: 'fixture-selectors-v1',
  terminal_detector_version: 'fixture-terminal-v1',
  allowed_artifacts: ['answer_text', 'citation_raw', 'collector_log'],
  async navigate(page, entry) { await page.goto(entry); },
  async inspectProfile(page) { return { login_state: 'logged_out', context_id: page.context_id }; },
  async submitQuery(page, query) { page.submitted_query = query; },
  async waitForTerminal(page) {
    return { outcome: 'success', proof: `context:${page.context_id}` };
  },
  async extract(page) {
    return {
      answer_text: `answer from context ${page.context_id}`,
      citations: [{ url_raw: 'https://source.example.invalid/page', occurrence_index: 1 }],
    };
  },
  manual_fallback: { allowed: true, requirements: [] },
  stop_conditions: ['fixture_failure'],
};

test('Playwright runtime 必须匹配批准的 exact version', () => {
  assert.equal(assertPlaywrightVersion('1.62.1', '1.62.1'), '1.62.1');
  assert.throws(
    () => assertPlaywrightVersion('1.62.0', '1.62.1'),
    (error) => error.code === 'PLAYWRIGHT_RUNTIME_MISMATCH',
  );
});

test('base 每 attempt 使用新 context、无 storageState、守住 allowlist 并关闭资源', async () => {
  const runtime = fakeRuntime();
  const profile = collectorProfile({ product_entry: 'https://consumer.example.invalid/chat' });
  const first = await runPlaywrightAttempt({
    runtime: runtime.handle,
    expectedVersion: '1.62.1',
    profile,
    authorization: AUTHORIZATION,
    adapter: FIXTURE_ADAPTER,
    query: 'What is Synthetic Brand?',
    ordinal: 1,
    attemptNo: 1,
    timeoutMs: 5_000,
  });
  const second = await runPlaywrightAttempt({
    runtime: runtime.handle,
    expectedVersion: '1.62.1',
    profile,
    authorization: AUTHORIZATION,
    adapter: FIXTURE_ADAPTER,
    query: 'What is Synthetic Brand?',
    ordinal: 2,
    attemptNo: 1,
    timeoutMs: 5_000,
  });
  assert.equal(first.outcome, 'success');
  assert.equal(second.outcome, 'success');
  assert.notEqual(first.diagnostics.context_id, second.diagnostics.context_id);
  assert.equal(runtime.state.contexts.length, 2);
  assert.ok(runtime.state.contexts.every(({ options }) => !('storageState' in options)));
  assert.ok(runtime.state.contexts.every(({ routes }) => routes.length === 1));
  assert.equal(runtime.state.closedContexts, 2);
  assert.equal(runtime.state.closedBrowsers, 2);
});

test('base 在浏览器启动前拒绝越过入口 allowlist', async () => {
  const runtime = fakeRuntime();
  const profile = collectorProfile({ product_entry: 'https://outside.example.invalid/chat' });
  await assert.rejects(
    runPlaywrightAttempt({
      runtime: runtime.handle,
      expectedVersion: '1.62.1',
      profile,
      authorization: AUTHORIZATION,
      adapter: FIXTURE_ADAPTER,
      query: 'test',
      ordinal: 1,
      attemptNo: 1,
      timeoutMs: 5_000,
    }),
    (error) => error.code === 'PLATFORM_ALLOWLIST_VIOLATION',
  );
  assert.equal(runtime.state.launches, 0);
});

test('base 在浏览器启动前拒绝超出 adapter 的 artifact 授权', async () => {
  const runtime = fakeRuntime();
  const profile = collectorProfile({ product_entry: 'https://consumer.example.invalid/chat' });
  await assert.rejects(
    runPlaywrightAttempt({
      runtime: runtime.handle,
      expectedVersion: '1.62.1',
      profile,
      authorization: {
        ...AUTHORIZATION,
        allowed_artifacts: [...AUTHORIZATION.allowed_artifacts, 'html'],
      },
      adapter: FIXTURE_ADAPTER,
      query: 'test',
      ordinal: 1,
      attemptNo: 1,
      timeoutMs: 5_000,
    }),
    (error) => error.code === 'COLLECTION_AUTHORIZATION_REQUIRED',
  );
  assert.equal(runtime.state.launches, 0);
});
