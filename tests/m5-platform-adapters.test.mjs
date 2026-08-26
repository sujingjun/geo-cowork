import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  assertPlatformAutomationAllowed,
  assertPlatformManualAllowed,
  getPlatformAdapter,
  PLATFORM_IDS,
} from '../plugins/geo-expert/scripts/collectors/platforms/index.mjs';
import { runPlaywrightAttempt } from '../plugins/geo-expert/scripts/collectors/playwright-base.mjs';
import { collectorProfile } from './helpers/m5-fixtures.mjs';

test('五个平台 adapter 分别冻结入口、版本、artifact 与条款状态', () => {
  assert.deepEqual(PLATFORM_IDS, ['chatgpt', 'claude', 'gemini', 'google_ai', 'perplexity']);
  for (const platform of PLATFORM_IDS) {
    const adapter = getPlatformAdapter(platform);
    assert.equal(adapter.platform, platform);
    assert.ok(adapter.version);
    assert.ok(adapter.product_entries.length > 0);
    assert.ok(adapter.selector_version);
    assert.ok(adapter.terminal_detector_version);
    if (adapter.manual_fallback.allowed) {
      assert.ok(adapter.allowed_artifacts.includes('answer_text'));
    } else if (platform === 'perplexity') {
      assert.deepEqual(adapter.allowed_artifacts, ['collector_log']);
    } else {
      assert.ok(adapter.allowed_artifacts.includes('collector_log'));
    }
    assert.ok(['terms_blocked', 'manual_only'].includes(adapter.automation.status));
    assert.equal('written_permission_required' in adapter.automation, false);
    assert.equal('written_permission_ref' in adapter.automation, false);
    assert.equal('future_collection_mode' in adapter.automation, false);
    assert.equal('account_email' in adapter, false);
    assert.equal('account_identifier' in adapter, false);
  }
});

test('真实 UI manual adapter 允许四个平台，Perplexity 仅允许用户导出文件', () => {
  for (const platform of ['chatgpt', 'gemini', 'google_ai', 'claude']) {
    assert.equal(assertPlatformManualAllowed(getPlatformAdapter(platform)).platform, platform);
  }
  assert.throws(
    () => assertPlatformManualAllowed(getPlatformAdapter('perplexity')),
    (error) => error.code === 'PLATFORM_MANUAL_COLLECTION_BLOCKED',
  );
  assert.equal(assertPlatformManualAllowed(getPlatformAdapter('perplexity'), {
    manualSourceKind: 'user_supplied_export',
  }).platform, 'perplexity');
});

test('adapter 不再以 written permission ref 作为运行时硬门', () => {
  const base = getPlatformAdapter('gemini');
  const allowed = {
    ...base,
    automation: { ...base.automation, status: 'allowed' },
  };
  assert.equal(assertPlatformAutomationAllowed(allowed).platform, 'gemini');
});

test('五个平台仍在启动 Playwright 前执行平台 Terms guard', async () => {
  for (const platform of PLATFORM_IDS) {
    const adapter = getPlatformAdapter(platform);
    assert.throws(
      () => assertPlatformAutomationAllowed(adapter),
      (error) => error.code === 'PLATFORM_TERMS_BLOCKED',
    );
    let launches = 0;
    const runtime = {
      version: '1.62.1',
      playwright: { chromium: { async launch() { launches += 1; } } },
    };
    const profile = collectorProfile({
      platform,
      product_entry: adapter.product_entries[0],
      collection_method: 'browser_automation',
    });
    await assert.rejects(
      runPlaywrightAttempt({
        runtime,
        expectedVersion: '1.62.1',
        profile,
        authorization: {
          decision_ref: 'workspace://cycles/preparation/decisions/2026-08-25-m5-playwright-and-consumer-platform-authorized.md',
          platform,
          product_entries: adapter.product_entries,
          allowed_artifacts: adapter.allowed_artifacts,
          retention_days: 365,
          account_identifier_stored: false,
          credentials_stored: false,
          external_writes: false,
        },
        adapter,
        query: 'What is MyyShop?',
        ordinal: 1,
        attemptNo: 1,
        timeoutMs: 5_000,
      }),
      (error) => error.code === 'PLATFORM_TERMS_BLOCKED',
    );
    assert.equal(launches, 0);
  }
});

test('未知平台不回退到通用 URL adapter', () => {
  assert.throws(
    () => getPlatformAdapter('unknown'),
    (error) => error.code === 'PLATFORM_ADAPTER_NOT_FOUND',
  );
});
