import { readFile } from 'node:fs/promises';

import {
  assertNoSymlinkPath,
  resolveWithin,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';

const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const GA4_METRICS = ['sessions', 'activeUsers', 'screenPageViews'];
const EXACT = Object.freeze({
  schemaVersion: 'ga4-gsc-readonly-smoke/1.0.0',
  workspaceId: 'ws_myyshop2026082400000000000',
  startDate: '2026-08-23',
  endDate: '2026-08-29',
  ga4PropertyId: '356373250',
  ga4Dimensions: ['date'],
  gscSiteUrl: 'https://www.myyshop.com/',
  gscDimensions: ['date'],
});

export class AnalyticsReadonlyError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'AnalyticsReadonlyError';
    this.code = code;
  }
}

function sameValues(actual, expected) {
  return Array.isArray(actual)
    && actual.length === expected.length
    && actual.every((value, index) => value === expected[index]);
}

function invalidPlan(message) {
  throw new AnalyticsReadonlyError('READONLY_PLAN_INVALID', message);
}

function assertExactKeys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || !sameValues(Object.keys(value).sort(), [...expected].sort())) {
    invalidPlan(`${label} 字段集合与合同不一致`);
  }
}

function validateExactPlan(plan) {
  assertExactKeys(plan, [
    'schema_version', 'run_id', 'workspace_id', 'authorization',
    'time_window', 'ga4', 'gsc',
  ], 'plan');
  assertExactKeys(plan.authorization, ['ref', 'sha256', 'expires_at'], 'authorization');
  assertExactKeys(plan.time_window, ['start_date', 'end_date'], 'time_window');
  assertExactKeys(plan.ga4, ['property_id', 'dimensions', 'metrics', 'limit'], 'ga4');
  assertExactKeys(plan.gsc, [
    'site_url', 'dimensions', 'type', 'aggregation_type', 'data_state', 'row_limit',
  ], 'gsc');
  if (plan.schema_version !== EXACT.schemaVersion
      || !/^RUN-MYYSHOP-GA4-GSC-SMOKE-[0-9]{8}$/.test(plan.run_id)
      || plan.workspace_id !== EXACT.workspaceId) {
    invalidPlan('plan identity/schema 与获授权合同不一致');
  }
  if (plan.time_window.start_date !== EXACT.startDate
      || plan.time_window.end_date !== EXACT.endDate) {
    invalidPlan('time_window 与获授权合同不一致');
  }
  if (plan.ga4.property_id !== EXACT.ga4PropertyId
      || !sameValues(plan.ga4.dimensions, EXACT.ga4Dimensions)
      || !sameValues(plan.ga4.metrics, GA4_METRICS)
      || plan.ga4.limit !== 10) {
    invalidPlan('ga4.metrics/dimensions/property/limit 与获授权合同不一致');
  }
  if (plan.gsc.site_url !== EXACT.gscSiteUrl
      || !sameValues(plan.gsc.dimensions, EXACT.gscDimensions)
      || plan.gsc.type !== 'web'
      || plan.gsc.aggregation_type !== 'byProperty'
      || plan.gsc.data_state !== 'final'
      || plan.gsc.row_limit !== 10) {
    invalidPlan('gsc fields 与获授权合同不一致');
  }
  if (typeof plan.authorization.ref !== 'string'
      || !/^workspace:\/\/[A-Za-z0-9._/-]+\.md$/.test(plan.authorization.ref)
      || !/^[a-f0-9]{64}$/.test(plan.authorization.sha256)) {
    invalidPlan('authorization ref/checksum 非法');
  }
}

export async function preflightReadonlyPlan({ workspace, plan, now = new Date() }) {
  validateExactPlan(plan);
  if (typeof plan?.authorization?.ref !== 'string'
      || !plan.authorization.ref.startsWith('workspace://')) {
    throw new AnalyticsReadonlyError(
      'READONLY_AUTHORIZATION_REQUIRED',
      'authorization.ref 必须是 Workspace 决定引用',
    );
  }
  const relative = plan.authorization.ref.slice('workspace://'.length);
  await assertNoSymlinkPath(workspace, relative);
  const [workspaceIdentity, authorizationBytes] = await Promise.all([
    readFile(resolveWithin(workspace, 'workspace.json'), 'utf8').then(JSON.parse),
    readFile(resolveWithin(workspace, relative)),
  ]);
  if (workspaceIdentity.workspace_id !== plan.workspace_id) {
    throw new AnalyticsReadonlyError(
      'READONLY_AUTHORIZATION_DRIFT',
      'Workspace identity 与计划不一致',
    );
  }
  if (sha256(authorizationBytes) !== plan.authorization.sha256) {
    throw new AnalyticsReadonlyError(
      'READONLY_AUTHORIZATION_DRIFT',
      '授权决定 bytes 与计划 checksum 不一致',
    );
  }
  if (!Number.isFinite(Date.parse(plan.authorization.expires_at))
      || Date.parse(plan.authorization.expires_at) <= now.getTime()) {
    throw new AnalyticsReadonlyError(
      'READONLY_AUTHORIZATION_REQUIRED',
      '授权决定已过期或 expiry 非法',
    );
  }
  return {
    authorization_sha256: plan.authorization.sha256,
    requests: buildReadonlyRequests(plan),
  };
}

export function buildReadonlyRequests(plan) {
  return {
    ga4: {
      method: 'POST',
      scope: GA4_SCOPE,
      url: `https://analyticsdata.googleapis.com/v1beta/properties/${plan.ga4.property_id}:runReport`,
      body: {
        dateRanges: [{
          startDate: plan.time_window.start_date,
          endDate: plan.time_window.end_date,
        }],
        dimensions: plan.ga4.dimensions.map((name) => ({ name })),
        metrics: plan.ga4.metrics.map((name) => ({ name })),
        limit: plan.ga4.limit,
        keepEmptyRows: false,
        returnPropertyQuota: true,
      },
    },
    gsc: {
      method: 'POST',
      scope: GSC_SCOPE,
      url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(plan.gsc.site_url)}/searchAnalytics/query`,
      body: {
        startDate: plan.time_window.start_date,
        endDate: plan.time_window.end_date,
        dimensions: [...plan.gsc.dimensions],
        type: plan.gsc.type,
        aggregationType: plan.gsc.aggregation_type,
        dataState: plan.gsc.data_state,
        rowLimit: plan.gsc.row_limit,
        startRow: 0,
      },
    },
  };
}

function boundedNumber(value, label, { min = 0, max = Number.POSITIVE_INFINITY } = {}) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', `${label} 不是合法范围内数值`);
  }
  return parsed;
}

function normalizeDate(value, source) {
  if (source === 'ga4' && /^[0-9]{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  if (source === 'gsc' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) return value;
  throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', `${source} date 形状非法`);
}

function normalizeGa4(plan, response) {
  if (!sameValues(response?.dimensionHeaders?.map(({ name }) => name), plan.ga4.dimensions)
      || !sameValues(response?.metricHeaders?.map(({ name }) => name), plan.ga4.metrics)
      || !Array.isArray(response?.rows)) {
    throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', 'GA4 headers/rows 与请求不一致');
  }
  const rows = response.rows.map((row) => {
    if (!Array.isArray(row.dimensionValues)
        || row.dimensionValues.length !== plan.ga4.dimensions.length
        || !Array.isArray(row.metricValues)
        || row.metricValues.length !== plan.ga4.metrics.length) {
      throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', 'GA4 row 列数与请求不一致');
    }
    return {
      dimensions: Object.fromEntries(plan.ga4.dimensions.map((name, index) => [
        name,
        name === 'date'
          ? normalizeDate(row.dimensionValues[index]?.value, 'ga4')
          : row.dimensionValues[index]?.value,
      ])),
      metrics: Object.fromEntries(plan.ga4.metrics.map((name, index) => [
        name,
        boundedNumber(row.metricValues[index]?.value, `GA4 ${name}`),
      ])),
    };
  });
  if (response.rowCount !== rows.length || rows.length > plan.ga4.limit) {
    throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', 'GA4 rowCount/limit 不一致');
  }
  return {
    status: rows.length === 0 ? 'unavailable' : 'ok',
    row_count: rows.length,
    rows,
    response_checksum: sha256(stableStringify(response)),
    quota: response.propertyQuota ?? {},
  };
}

function normalizeGsc(plan, response) {
  if (!Array.isArray(response?.rows)) {
    throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', 'GSC rows 缺失');
  }
  const rows = response.rows.map((row) => {
    if (!Array.isArray(row.keys) || row.keys.length !== plan.gsc.dimensions.length) {
      throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', 'GSC row keys 与请求不一致');
    }
    return {
      dimensions: Object.fromEntries(plan.gsc.dimensions.map((name, index) => [
        name,
        name === 'date' ? normalizeDate(row.keys[index], 'gsc') : row.keys[index],
      ])),
      metrics: {
        clicks: boundedNumber(row.clicks, 'GSC clicks'),
        impressions: boundedNumber(row.impressions, 'GSC impressions'),
        ctr: boundedNumber(row.ctr, 'GSC ctr', { max: 1 }),
        position: boundedNumber(row.position, 'GSC position'),
      },
    };
  });
  if (rows.length > plan.gsc.row_limit
      || response.responseAggregationType !== plan.gsc.aggregation_type) {
    throw new AnalyticsReadonlyError('READONLY_RESPONSE_INVALID', 'GSC rowLimit/aggregation 不一致');
  }
  return {
    status: rows.length === 0 ? 'unavailable' : 'ok',
    row_count: rows.length,
    rows,
    response_checksum: sha256(stableStringify(response)),
    response_aggregation_type: response.responseAggregationType,
  };
}

export async function collectReadonlySources({ plan, request, now = new Date() }) {
  const requests = buildReadonlyRequests(plan);
  const ga4Response = await request('ga4', requests.ga4);
  const gscResponse = await request('gsc', requests.gsc);
  const ga4 = normalizeGa4(plan, ga4Response);
  const gsc = normalizeGsc(plan, gscResponse);
  const warnings = [];
  if (ga4Response.metadata?.dataLossFromOtherRow === true) {
    warnings.push('GA4_DATA_LOSS_FROM_OTHER_ROW');
  }
  if (Array.isArray(ga4Response.metadata?.samplingMetadatas)
      && ga4Response.metadata.samplingMetadatas.length > 0) {
    warnings.push('GA4_SAMPLED');
  }
  if (ga4Response.metadata?.subjectToThresholding === true) {
    warnings.push('GA4_THRESHOLDING');
  }
  if (gscResponse.metadata?.first_incomplete_date
      || gscResponse.metadata?.first_incomplete_hour) {
    warnings.push('GSC_INCOMPLETE_DATA');
  }
  if (ga4.status === 'unavailable') warnings.push('GA4_NO_ROWS');
  if (gsc.status === 'unavailable') warnings.push('GSC_NO_ROWS');
  return {
    schema_version: 'ga4-gsc-readonly-result/1.0.0',
    run_id: plan.run_id,
    captured_at: now.toISOString(),
    time_window: { ...plan.time_window },
    sources: { ga4, gsc },
    quality: { warnings },
    causal_claim: false,
    persisted_to_workspace: false,
  };
}

export const READONLY_SCOPES = Object.freeze([GA4_SCOPE, GSC_SCOPE]);
