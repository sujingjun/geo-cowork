import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import { execute } from '../plugins/geo-expert/scripts/geo-analytics-readonly.mjs';

const exec = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(REPO_ROOT, 'plugins/geo-expert/scripts/geo-analytics-readonly.mjs');
const SETUP_WIZARD = path.join(
  REPO_ROOT,
  'plugins/geo-expert/scripts/setup-google-analytics-readonly.sh',
);
const RUNBOOK = path.join(REPO_ROOT, 'docs/runbooks/ga4-gsc-readonly-analytics.md');
const CURRENT_PLAN = path.join(
  REPO_ROOT,
  'workspaces/myyshop/cycles/preparation/analytics/2026-09-02-ga4-gsc-readonly-observation-read-plan.json',
);

test('真实只读 CLI 公开 doctor/dry-run/smoke/collect-observe', async () => {
  const { stdout } = await exec(process.execPath, [CLI, '--help'], { cwd: REPO_ROOT });
  for (const command of ['doctor', 'dry-run', 'smoke', 'collect-observe']) {
    assert.ok(stdout.includes(command), command);
  }
});

test('setup 向导包含 ADC 基础 scope、无 TERM 兜底且文档入口无错字', async () => {
  const source = await readFile(SETUP_WIZARD, 'utf8');
  const runbook = await readFile(RUNBOOK, 'utf8');
  assert.match(source, /TERM=xterm-256color[\s\S]*export TERM/);
  assert.match(
    source,
    /https:\/\/www\.googleapis\.com\/auth\/cloud-platform,https:\/\/www\.googleapis\.com\/auth\/analytics\.readonly,https:\/\/www\.googleapis\.com\/auth\/webmasters\.readonly/,
  );
  assert.match(runbook, /cloud-platform/);
  assert.doesNotMatch(runbook, /真实 smokex x/);
});

test('dry-run 无凭据无网络地输出获授权请求摘要', async () => {
  const { stdout, stderr } = await exec(process.execPath, [
    CLI,
    'dry-run',
    '--workspace', path.join(REPO_ROOT, 'workspaces/myyshop'),
    '--plan', CURRENT_PLAN,
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
  assert.equal(result.run_id, 'RUN-MYYSHOP-GA4-GSC-SMOKE-20260902');
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
    '--plan', CURRENT_PLAN,
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
    '--plan', CURRENT_PLAN,
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

test('collect-observe 单次执行连接只读采集与受控 materializer', async () => {
  let materialized = null;
  const result = await execute({
    command: 'collect-observe',
    workspace: path.join(REPO_ROOT, 'workspaces/myyshop'),
    plan: CURRENT_PLAN,
    'observation-plan': path.join(
      REPO_ROOT,
      'workspaces/myyshop/cycles/preparation/analytics/2026-09-02-ga4-gsc-observation-plan.json',
    ),
    confirmReadonly: true,
  }, {
    realReadEnabled: true,
    now: new Date('2026-09-02T10:30:00Z'),
    createRequester: async () => async (source) => source === 'ga4' ? {
      dimensionHeaders: [{ name: 'date' }],
      metricHeaders: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }],
      rows: [{
        dimensionValues: [{ value: '20260823' }],
        metricValues: [{ value: '1' }, { value: '1' }, { value: '1' }],
      }],
      rowCount: 1,
      propertyQuota: {},
    } : {
      rows: [{ keys: ['2026-08-23'], clicks: 1, impressions: 10, ctr: 0.1, position: 2 }],
      responseAggregationType: 'byProperty',
    },
    materializeResult: async (input) => {
      materialized = input;
      return {
        action: 'created', run_ref: 'RUN-MYYSHOP-GA4-GSC-OBS-20260902',
        observation_refs: ['ANO-MYYSHOP-GA4-20260902', 'ANO-MYYSHOP-GSC-20260902'],
        business_signal_ref: 'BSIG-MYYSHOP-GSC-20260902',
        evidence_ref: 'EVD-MYYSHOP-ANALYTICS-20260902', evidence_status: 'candidate',
        causal_claim: false, auto_approved: false,
      };
    },
  });
  assert.equal(materialized.result.causal_claim, false);
  assert.equal(materialized.plan.evidence.status, 'candidate');
  assert.equal(result.network_accessed, true);
  assert.equal(result.evidence_status, 'candidate');
  assert.equal(result.auto_approved, false);
});
