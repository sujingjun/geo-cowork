import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  buildReadonlyRequests,
  collectReadonlySources,
  preflightReadonlyPlan,
} from '../plugins/geo-expert/scripts/lib/analytics-readonly.mjs';

const PLAN = {
  schema_version: 'ga4-gsc-readonly-smoke/1.0.0',
  run_id: 'RUN-MYYSHOP-GA4-GSC-SMOKE-20260901',
  workspace_id: 'ws_myyshop2026082400000000000',
  authorization: {
    ref: 'workspace://cycles/preparation/decisions/2026-09-01-ga4-gsc-readonly-smoke-authorized.md',
    sha256: 'a'.repeat(64),
    expires_at: '2026-09-02T00:00:00+08:00',
  },
  time_window: { start_date: '2026-08-23', end_date: '2026-08-29' },
  ga4: {
    property_id: '356373250',
    dimensions: ['date'],
    metrics: ['sessions', 'activeUsers', 'screenPageViews'],
    limit: 10,
  },
  gsc: {
    site_url: 'https://www.myyshop.com/',
    dimensions: ['date'],
    type: 'web',
    aggregation_type: 'byProperty',
    data_state: 'final',
    row_limit: 10,
  },
};

test('approved plan 生成固定 GA4/GSC 只读请求', () => {
  assert.deepEqual(buildReadonlyRequests(PLAN), {
    ga4: {
      method: 'POST',
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      url: 'https://analyticsdata.googleapis.com/v1beta/properties/356373250:runReport',
      body: {
        dateRanges: [{ startDate: '2026-08-23', endDate: '2026-08-29' }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
        ],
        limit: 10,
        keepEmptyRows: false,
        returnPropertyQuota: true,
      },
    },
    gsc: {
      method: 'POST',
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      url: 'https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.myyshop.com%2F/searchAnalytics/query',
      body: {
        startDate: '2026-08-23',
        endDate: '2026-08-29',
        dimensions: ['date'],
        type: 'web',
        aggregationType: 'byProperty',
        dataState: 'final',
        rowLimit: 10,
        startRow: 0,
      },
    },
  });
});

test('preflight 在网络前拒绝 measurement allowlist 外字段', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-analytics-readonly-'));
  try {
    const decisionRelative = 'cycles/preparation/decisions/authorized.md';
    const decision = Buffer.from('# authorized\n');
    await mkdir(path.join(root, 'cycles/preparation/decisions'), { recursive: true });
    await writeFile(path.join(root, 'workspace.json'), JSON.stringify({
      workspace_id: PLAN.workspace_id,
    }));
    await writeFile(path.join(root, decisionRelative), decision);
    const invalidPlan = structuredClone(PLAN);
    invalidPlan.authorization.ref = `workspace://${decisionRelative}`;
    invalidPlan.authorization.sha256 = createHash('sha256').update(decision).digest('hex');
    invalidPlan.ga4.metrics.push('totalRevenue');

    await assert.rejects(
      preflightReadonlyPlan({
        workspace: root,
        plan: invalidPlan,
        now: new Date('2026-09-01T00:00:00Z'),
      }),
      (error) => error.code === 'READONLY_PLAN_INVALID'
        && error.message.includes('ga4.metrics'),
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('preflight 拒绝授权决定 bytes 漂移', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-analytics-readonly-auth-'));
  try {
    const decisionRelative = 'cycles/preparation/decisions/authorized.md';
    await mkdir(path.join(root, 'cycles/preparation/decisions'), { recursive: true });
    await writeFile(path.join(root, 'workspace.json'), JSON.stringify({
      workspace_id: PLAN.workspace_id,
    }));
    await writeFile(path.join(root, decisionRelative), '# changed after approval\n');
    const driftedPlan = structuredClone(PLAN);
    driftedPlan.authorization.ref = `workspace://${decisionRelative}`;

    await assert.rejects(
      preflightReadonlyPlan({
        workspace: root,
        plan: driftedPlan,
        now: new Date('2026-09-01T00:00:00Z'),
      }),
      (error) => error.code === 'READONLY_AUTHORIZATION_DRIFT',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});

test('preflight 拒绝固定资源、日期、维度或计划 Schema 漂移', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-analytics-readonly-plan-'));
  try {
    const decisionRelative = 'cycles/preparation/decisions/authorized.md';
    const decision = Buffer.from('# authorized\n');
    await mkdir(path.join(root, 'cycles/preparation/decisions'), { recursive: true });
    await writeFile(path.join(root, 'workspace.json'), JSON.stringify({
      workspace_id: PLAN.workspace_id,
    }));
    await writeFile(path.join(root, decisionRelative), decision);
    const valid = structuredClone(PLAN);
    valid.authorization.ref = `workspace://${decisionRelative}`;
    valid.authorization.sha256 = createHash('sha256').update(decision).digest('hex');
    const variants = [
      Object.assign(structuredClone(valid), { schema_version: 'unknown/9.9.9' }),
      Object.assign(structuredClone(valid), { time_window: { ...valid.time_window, end_date: '2026-08-30' } }),
      Object.assign(structuredClone(valid), { ga4: { ...valid.ga4, property_id: '999999999' } }),
      Object.assign(structuredClone(valid), { ga4: { ...valid.ga4, dimensions: ['date', 'platform'] } }),
      Object.assign(structuredClone(valid), { gsc: { ...valid.gsc, site_url: 'sc-domain:myyshop.com' } }),
    ];

    for (const plan of variants) {
      await assert.rejects(
        preflightReadonlyPlan({
          workspace: root,
          plan,
          now: new Date('2026-09-01T00:00:00Z'),
        }),
        (error) => error.code === 'READONLY_PLAN_INVALID',
      );
    }
  } finally {
    await rm(root, { recursive: true });
  }
});

test('两个只读响应被顺序归一化为非因果分析输入', async () => {
  const calls = [];
  const responses = {
    ga4: {
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
      metadata: { currencyCode: 'USD', timeZone: 'America/Los_Angeles' },
      propertyQuota: { tokensPerDay: { consumed: 5, remaining: 199995 } },
    },
    gsc: {
      rows: [{
        keys: ['2026-08-23'],
        clicks: 2,
        impressions: 20,
        ctr: 0.1,
        position: 3.5,
      }],
      responseAggregationType: 'byProperty',
    },
  };
  const result = await collectReadonlySources({
    plan: PLAN,
    now: new Date('2026-09-01T00:30:00Z'),
    request: async (source, request) => {
      calls.push({ source, request });
      return responses[source];
    },
  });

  assert.deepEqual(calls.map(({ source }) => source), ['ga4', 'gsc']);
  assert.deepEqual(result, {
    schema_version: 'ga4-gsc-readonly-result/1.0.0',
    run_id: PLAN.run_id,
    captured_at: '2026-09-01T00:30:00.000Z',
    time_window: PLAN.time_window,
    sources: {
      ga4: {
        status: 'ok',
        row_count: 1,
        rows: [{
          dimensions: { date: '2026-08-23' },
          metrics: { sessions: 10, activeUsers: 8, screenPageViews: 12 },
        }],
        response_checksum: result.sources.ga4.response_checksum,
        quota: { tokensPerDay: { consumed: 5, remaining: 199995 } },
      },
      gsc: {
        status: 'ok',
        row_count: 1,
        rows: [{
          dimensions: { date: '2026-08-23' },
          metrics: { clicks: 2, impressions: 20, ctr: 0.1, position: 3.5 },
        }],
        response_checksum: result.sources.gsc.response_checksum,
        response_aggregation_type: 'byProperty',
      },
    },
    quality: { warnings: [] },
    causal_claim: false,
    persisted_to_workspace: false,
  });
  assert.match(result.sources.ga4.response_checksum, /^[a-f0-9]{64}$/);
  assert.match(result.sources.gsc.response_checksum, /^[a-f0-9]{64}$/);
});

test('归一化拒绝负计数与越界比例', async () => {
  const responses = {
    ga4: {
      dimensionHeaders: [{ name: 'date' }],
      metricHeaders: PLAN.ga4.metrics.map((name) => ({ name, type: 'TYPE_INTEGER' })),
      rows: [{
        dimensionValues: [{ value: '20260823' }],
        metricValues: [{ value: '-1' }, { value: '8' }, { value: '12' }],
      }],
      rowCount: 1,
    },
    gsc: {
      rows: [{
        keys: ['2026-08-23'], clicks: 2, impressions: 20, ctr: 1.2, position: 3.5,
      }],
      responseAggregationType: 'byProperty',
    },
  };

  await assert.rejects(
    collectReadonlySources({
      plan: PLAN,
      request: async (source) => responses[source],
    }),
    (error) => error.code === 'READONLY_RESPONSE_INVALID',
  );
});

test('平台 threshold、sampling、data loss 与 incomplete metadata 转成质量 warning', async () => {
  const responses = {
    ga4: {
      dimensionHeaders: [{ name: 'date' }],
      metricHeaders: PLAN.ga4.metrics.map((name) => ({ name, type: 'TYPE_INTEGER' })),
      rows: [{
        dimensionValues: [{ value: '20260823' }],
        metricValues: [{ value: '10' }, { value: '8' }, { value: '12' }],
      }],
      rowCount: 1,
      metadata: {
        subjectToThresholding: true,
        dataLossFromOtherRow: true,
        samplingMetadatas: [{}],
      },
    },
    gsc: {
      rows: [{
        keys: ['2026-08-23'], clicks: 2, impressions: 20, ctr: 0.1, position: 3.5,
      }],
      responseAggregationType: 'byProperty',
      metadata: { first_incomplete_date: '2026-08-29' },
    },
  };
  const result = await collectReadonlySources({
    plan: PLAN,
    request: async (source) => responses[source],
  });

  assert.deepEqual(result.quality.warnings, [
    'GA4_DATA_LOSS_FROM_OTHER_ROW',
    'GA4_SAMPLED',
    'GA4_THRESHOLDING',
    'GSC_INCOMPLETE_DATA',
  ]);
});
