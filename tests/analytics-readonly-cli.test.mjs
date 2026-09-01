import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import { execute } from '../plugins/geo-expert/scripts/geo-analytics-readonly.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-analytics-readonly.mjs');

test('真实只读 CLI 公开 doctor/dry-run/smoke 三个命令', async () => {
  const { stdout } = await exec(process.execPath, [CLI, '--help'], { cwd: REPO_ROOT });
  for (const command of ['doctor', 'dry-run', 'smoke']) {
    assert.ok(stdout.includes(command), command);
  }
});

test('dry-run 无凭据无网络地输出获授权请求摘要', async () => {
  const { stdout, stderr } = await exec(process.execPath, [
    CLI,
    'dry-run',
    '--workspace', path.join(REPO_ROOT, 'workspaces/myyshop'),
    '--plan', path.join(
      REPO_ROOT,
      'workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json',
    ),
  ], {
    cwd: REPO_ROOT,
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
    },
  });
  assert.equal(stderr, '');
  const result = JSON.parse(stdout);
  assert.equal(result.mode, 'dry-run');
  assert.equal(result.network_accessed, false);
  assert.equal(result.credential_accessed, false);
  assert.equal(result.run_id, 'RUN-MYYSHOP-GA4-GSC-SMOKE-20260901');
  assert.equal(result.requests.ga4.url,
    'https://analyticsdata.googleapis.com/v1beta/properties/356373250:runReport');
  assert.equal(result.requests.gsc.url,
    'https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.myyshop.com%2F/searchAnalytics/query');
});

test('smoke 缺环境开关时在 ADC 与网络前失败', async () => {
  await assert.rejects(exec(process.execPath, [
    CLI,
    'smoke',
    '--workspace', path.join(REPO_ROOT, 'workspaces/myyshop'),
    '--plan', path.join(
      REPO_ROOT,
      'workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json',
    ),
    '--output', path.join(REPO_ROOT, 'tmp/geo-analytics/test-result.json'),
    '--confirm-readonly',
  ], {
    cwd: REPO_ROOT,
    env: { PATH: process.env.PATH, HOME: process.env.HOME },
  }), (error) => {
    assert.equal(error.code, 1);
    assert.equal(JSON.parse(error.stderr).error, 'READONLY_NETWORK_CONFIRMATION_REQUIRED');
    assert.equal(error.stdout, '');
    return true;
  });
});

test('smoke 在 ADC 前拒绝 tmp/geo-analytics Run 目录外输出', async () => {
  await assert.rejects(exec(process.execPath, [
    CLI,
    'smoke',
    '--workspace', path.join(REPO_ROOT, 'workspaces/myyshop'),
    '--plan', path.join(
      REPO_ROOT,
      'workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json',
    ),
    '--output', '/tmp/geo-analytics-result.json',
    '--confirm-readonly',
  ], {
    cwd: REPO_ROOT,
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      GEO_ANALYTICS_REAL_READ: '1',
    },
  }), (error) => {
    assert.equal(JSON.parse(error.stderr).error, 'READONLY_OUTPUT_FORBIDDEN');
    return true;
  });
});

test('smoke 通过 injected Google seam 顺序读取并只向 stdout 返回脱敏摘要', async () => {
  const requested = [];
  let persisted = null;
  const result = await execute({
    command: 'smoke',
    workspace: path.join(REPO_ROOT, 'workspaces/myyshop'),
    plan: path.join(
      REPO_ROOT,
      'workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json',
    ),
    output: path.join(
      REPO_ROOT,
      'tmp/geo-analytics/RUN-MYYSHOP-GA4-GSC-SMOKE-20260901/unit-result.json',
    ),
    confirmReadonly: true,
  }, {
    realReadEnabled: true,
    now: new Date('2026-09-01T00:30:00Z'),
    createRequester: async () => async (source, request) => {
      requested.push({ source, request });
      if (source === 'ga4') {
        return {
          dimensionHeaders: [{ name: 'date' }],
          metricHeaders: [
            { name: 'sessions', type: 'TYPE_INTEGER' },
            { name: 'activeUsers', type: 'TYPE_INTEGER' },
            { name: 'screenPageViews', type: 'TYPE_INTEGER' },
          ],
          rows: [{
            dimensionValues: [{ value: '20260823' }],
            metricValues: [{ value: '10' }, { value: '8' }, { value: '12' }],
          }],
          rowCount: 1,
          propertyQuota: {},
        };
      }
      return {
        rows: [{
          keys: ['2026-08-23'], clicks: 2, impressions: 20, ctr: 0.1, position: 3.5,
        }],
        responseAggregationType: 'byProperty',
      };
    },
    writeResult: async (output, value) => {
      persisted = { output, value };
      return { action: 'created' };
    },
  });

  assert.deepEqual(requested.map(({ source }) => source), ['ga4', 'gsc']);
  assert.equal(persisted.value.sources.ga4.rows[0].metrics.sessions, 10);
  assert.deepEqual(result.sources, {
    ga4: {
      status: 'ok', row_count: 1,
      response_checksum: persisted.value.sources.ga4.response_checksum,
    },
    gsc: {
      status: 'ok', row_count: 1,
      response_checksum: persisted.value.sources.gsc.response_checksum,
    },
  });
  assert.equal('rows' in result.sources.ga4, false);
  assert.equal(result.network_accessed, true);
  assert.equal(result.credential_accessed, true);
});

test('doctor 只报告本地 ADC 前置，不读取 credential 内容或网络', async () => {
  const result = await execute({
    command: 'doctor',
    workspace: path.join(REPO_ROOT, 'workspaces/myyshop'),
    plan: path.join(
      REPO_ROOT,
      'workspaces/myyshop/cycles/preparation/analytics/2026-09-01-ga4-gsc-readonly-smoke-plan.json',
    ),
    confirmReadonly: false,
  }, {
    now: new Date('2026-09-01T00:30:00Z'),
    checkCredentials: async () => ({
      adc_available: false,
      gcloud_available: false,
      google_auth_library_available: true,
    }),
  });

  assert.deepEqual(result, {
    mode: 'doctor',
    run_id: 'RUN-MYYSHOP-GA4-GSC-SMOKE-20260901',
    authorization_ready: true,
    adc_available: false,
    gcloud_available: false,
    google_auth_library_available: true,
    credential_content_read: false,
    network_accessed: false,
  });
});
