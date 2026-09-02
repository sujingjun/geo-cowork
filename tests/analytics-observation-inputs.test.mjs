import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  normalizeBusinessFileInput,
  normalizeReadonlyResultToMetrics,
} from '../plugins/geo-expert/scripts/lib/analytics-observation-inputs.mjs';
import { materializeRealAnalyticsBundle } from '../plugins/geo-expert/scripts/lib/real-analytics-materializer.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { initWorkspace } from '../plugins/geo-expert/scripts/workspace-init.mjs';

test('GA4/GSC 真实只读结果只生成聚合 Observation metrics', () => {
  const metrics = normalizeReadonlyResultToMetrics({
    schema_version: 'ga4-gsc-readonly-result/1.0.0',
    captured_at: '2026-09-02T02:00:00Z',
    time_window: { start_date: '2026-08-23', end_date: '2026-08-29' },
    sources: {
      ga4: { status: 'ok', rows: [
        { dimensions: { date: '2026-08-23' }, metrics: { sessions: 3, activeUsers: 2, screenPageViews: 5 } },
        { dimensions: { date: '2026-08-24' }, metrics: { sessions: 4, activeUsers: 3, screenPageViews: 6 } },
      ] },
      gsc: { status: 'ok', rows: [
        { dimensions: { date: '2026-08-23' }, metrics: { clicks: 2, impressions: 10, ctr: 0.2, position: 4 } },
        { dimensions: { date: '2026-08-24' }, metrics: { clicks: 3, impressions: 30, ctr: 0.1, position: 8 } },
      ] },
    },
    quality: { warnings: [] },
    causal_claim: false,
  });
  assert.deepEqual(Object.fromEntries(metrics.map((metric) => [metric.metric_id, metric.value])), {
    ga4_sessions: 7,
    ga4_active_users: 5,
    ga4_screen_page_views: 11,
    gsc_clicks: 5,
    gsc_impressions: 40,
    gsc_ctr: 0.125,
    gsc_weighted_position: 7,
  });
  assert.ok(metrics.every((metric) => metric.causal_claim === false));
  assert.ok(metrics.every((metric) => !metric.metric_id.includes('ai')));
});

test('服务端聚合 JSON/CSV 归一化；PII 与逐请求行失败', () => {
  const metadata = {
    merchant_ref: 'MER-MYYSHOP-001',
    starts_at: '2026-08-23T00:00:00Z',
    ends_at: '2026-08-30T00:00:00Z',
    as_of: '2026-09-02T02:00:00Z',
    owner_role: 'MyyShop Data Owner',
    source_locator: 'workspace://authorized-export/aggregate.csv',
    authorization_ref: 'workspace://decisions/business-file-authorized.md',
  };
  const csv = 'metric_id,value,unit,segment\nregistrations,12,count,all\n';
  const result = normalizeBusinessFileInput({ bytes: Buffer.from(csv), format: 'csv', metadata });
  assert.equal(result.metrics[0].metric_id, 'registrations');
  assert.equal(result.causal_claim, false);
  assert.throws(
    () => normalizeBusinessFileInput({
      bytes: Buffer.from('metric_id,value,unit,email\nregistrations,1,count,user@example.com\n'),
      format: 'csv', metadata,
    }),
    (error) => error.code === 'BUSINESS_FILE_PII_DETECTED',
  );
  assert.throws(
    () => normalizeBusinessFileInput({
      bytes: Buffer.from('request_id,metric_id,value,unit\nr1,registrations,1,count\n'),
      format: 'csv', metadata,
    }),
    (error) => error.code === 'BUSINESS_FILE_ROW_LEVEL_FORBIDDEN',
  );
});

test('真实只读结果一次写入 ANO、非因果 BSIG 与未批准 candidate Evidence', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-real-analytics-'));
  try {
    const identity = {
      schema_version: '1.0.0', workspace_id: 'ws_myyshop2026082400000000000', brand: 'MyyShop',
      created_at: '2026-08-24T00:00:00Z', created_by: 'test', workspace_mode: 'online',
      merchant_ref: 'MER-MYYSHOP-001', merchant_mode: 'online',
      subject_locator: 'https://www.myyshop.com/', execution_scope: 'authorized_real',
      knowledge_base_ref: null, knowledge_base_mode: 'real_pending',
      online_configuration: {
        ga4_property_id: '356373250', gsc_site_url: 'https://www.myyshop.com/', analytics_plan: 'plan.json',
      },
    };
    await writeFile(path.join(root, 'workspace.json'), `${JSON.stringify(identity, null, 2)}\n`);
    await initWorkspace({ workspace: root, brand: 'MyyShop' });
    const merchant = {
      id: 'MER-MYYSHOP-001', record_type: 'merchant', status: 'active', version: '1.0.0',
      created_at: '2026-09-02T02:00:00Z', updated_at: '2026-09-02T02:00:00Z',
      display_name: 'MyyShop', canonical_locator: 'https://www.myyshop.com/', account_mode: 'online',
    };
    await mkdir(path.join(root, 'execution/identity'), { recursive: true });
    await writeFile(path.join(root, 'execution/identity/merchant.md'), serializeMarkdownObject(merchant, '# Merchant\n'));
    await mkdir(path.join(root, 'execution/contracts'), { recursive: true });
    const contracts = {
      measurement: { id: 'measurement-real-v1', version: '1.0.0', metrics: [
        { metric_id: 'ga4_sessions' }, { metric_id: 'ga4_active_users' },
        { metric_id: 'ga4_screen_page_views' }, { metric_id: 'gsc_clicks' },
        { metric_id: 'gsc_impressions' }, { metric_id: 'gsc_ctr' },
        { metric_id: 'gsc_weighted_position' },
      ] },
      policy: { id: 'policy-real-v1', version: '1.0.0', aggregate_only: true },
      rule: { id: 'gsc-ctr-v1', version: '1.0.0', causal_claim: false },
    };
    for (const [name, data] of Object.entries(contracts)) {
      await writeFile(path.join(root, `execution/contracts/${name}.json`), `${JSON.stringify(data)}\n`);
    }
    const result = {
      schema_version: 'ga4-gsc-readonly-result/1.0.0', run_id: 'RUN-MYYSHOP-SMOKE-001',
      captured_at: '2026-09-02T02:00:00Z',
      time_window: { start_date: '2026-08-23', end_date: '2026-08-29' },
      sources: {
        ga4: { status: 'ok', rows: [{ dimensions: { date: '2026-08-23' }, metrics: { sessions: 3, activeUsers: 2, screenPageViews: 5 } }] },
        gsc: { status: 'ok', rows: [{ dimensions: { date: '2026-08-23' }, metrics: { clicks: 2, impressions: 10, ctr: 0.2, position: 4 } }] },
      }, quality: { warnings: [] }, causal_claim: false,
    };
    const descriptor = (id, itemPath) => ({ id, path: itemPath });
    const plan = {
      schema_version: 'real-analytics-observation-plan/1.0.0',
      merchant_ref: 'MER-MYYSHOP-001', execution_scope: 'authorized_real',
      authorization_ref: 'workspace://decisions/analytics-authorized.md',
      raw_output_path: 'runs/RUN-MYYSHOP-ANALYTICS-001/raw/analytics/result.json',
      sources: [
        { ...descriptor('SRC-MYYSHOP-GA4-001', 'evidence/sources/src-myyshop-ga4-001.md'), kind: 'ga4', name: 'MyyShop GA4' },
        { ...descriptor('SRC-MYYSHOP-GSC-001', 'evidence/sources/src-myyshop-gsc-001.md'), kind: 'gsc', name: 'MyyShop GSC' },
      ],
      run: descriptor('RUN-MYYSHOP-ANALYTICS-001', 'runs/RUN-MYYSHOP-ANALYTICS-001/run.md'),
      observations: [
        { ...descriptor('ANO-MYYSHOP-GA4-001', 'cycles/analytics/ano-myyshop-ga4-001.md'), kind: 'ga4' },
        { ...descriptor('ANO-MYYSHOP-GSC-001', 'cycles/analytics/ano-myyshop-gsc-001.md'), kind: 'gsc' },
      ],
      signal: descriptor('BSIG-MYYSHOP-GSC-001', 'cycles/analytics/bsig-myyshop-gsc-001.md'),
      evidence: { ...descriptor('EVD-MYYSHOP-ANALYTICS-001', 'evidence/records/evd-myyshop-analytics-001.md'), status: 'candidate' },
      contracts: {
        measurement: { path: 'execution/contracts/measurement.json' },
        sensitive_data_policy: { path: 'execution/contracts/policy.json' },
        signal_rule: { path: 'execution/contracts/rule.json' },
      },
    };
    const readonlyPlan = {
      run_id: 'RUN-MYYSHOP-SMOKE-001', authorization: { ref: plan.authorization_ref },
      ga4: { property_id: '356373250' }, gsc: { site_url: 'https://www.myyshop.com/' },
    };
    const created = await materializeRealAnalyticsBundle({ workspace: root, readonlyPlan, result, plan });
    assert.equal(created.evidence_status, 'candidate');
    assert.equal(created.auto_approved, false);
    assert.equal(created.causal_claim, false);
    const graph = await loadWorkspaceGraph({ workspace: root });
    assert.equal(graph.byId.get(created.business_signal_ref).data.causal_claim, false);
    assert.equal(graph.byId.get(created.evidence_ref).data.approval, undefined);
    assert.equal((await readFile(path.join(root, plan.raw_output_path), 'utf8')).includes('screenPageViews'), true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
