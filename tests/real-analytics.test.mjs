import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  AI_SOURCES,
  analyticsWindows,
  analyticsCalendarWindow,
  calendarDate,
  buildCycleAnalyticsRequests,
  normalizeAiReport,
  normalizeGscReport,
  readAiReport,
  compareAnalyticsMetric,
  resolveAnalyticsPins,
  registrationDefinition,
  collectAnalyticsWindow,
  buildAnalyticsObjects,
  validateAnalyticsMatrix,
} from '../plugins/geo-expert/scripts/lib/real-analytics.mjs';
import { buildObservationSchedule } from '../plugins/geo-expert/scripts/lib/real-cycle-contract.mjs';
import {
  sha256,
  stableStringify,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';
import { validateObjectData } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';

const publicationAt = '2026-08-01T02:00:00.000Z';
const schedule = buildObservationSchedule({
  cycleRef: 'CYC-REAL-ONE',
  publicationAt,
  technicalAt: '2026-08-01T03:00:00.000Z',
});
const windows = analyticsWindows(publicationAt, schedule);
const hash = (value) => sha256(stableStringify(value, 2));
async function write(root, relative, value) {
  await mkdir(path.dirname(path.join(root, relative)), { recursive: true });
  await writeFile(
    path.join(root, relative),
    typeof value === 'string' ? value : stableStringify(value, 2),
  );
}
async function fixture(t, analytics = {}) {
  const workspace = await mkdtemp(
    path.join(os.tmpdir(), 'geo-real-analytics-test-'),
  );
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const ai = {
    property_id: '356373250',
    site_url: 'https://www.myyshop.com/',
    property_time_zone: 'Asia/Shanghai',
    registration_event: null,
    registration_approval_ref: null,
    final_lag_days: 3,
    calendar_policy: 'complete_days_after_anchor',
    ...analytics,
  };
  const metrics = [
    ['ai_visits', 'sessions'],
    ['ai_registration_events', 'events'],
    ['gsc_clicks', 'clicks'],
    ['gsc_impressions', 'impressions'],
  ].map(([metric_id, unit]) => ({
    metric_id,
    unit,
    definition: `Defined observed aggregate ${metric_id}.`,
  }));
  const contracts = {
    measurement_contract: {
      id: 'real-measurement',
      version: '1.0.0',
      schema_version: 'm6-measurement-contract/1.0.0',
      scope: 'authorized_real',
      metrics,
      analytics: ai,
      causal_claim_allowed: false,
      ai_sources: [...AI_SOURCES],
    },
    sensitive_data_policy: {
      id: 'real-policy',
      version: '1.0.0',
      schema_version: 'm6-sensitive-data-policy/1.0.0',
      scope: 'authorized_real',
      aggregate_only: true,
      unknown_fields: 'reject',
      max_input_bytes: 1048576,
      allowed_dimensions: ['date', 'sessionSource', 'sessionMedium'],
      forbidden_field_patterns: [
        'email',
        'phone',
        'userId',
        'userPseudoId',
        'ip',
        'cookie',
        'token',
        'secret',
        'password',
      ],
    },
    signal_rule: {
      id: 'real-rule',
      version: '1.0.0',
      schema_version: 'm6-signal-rule/1.0.0',
      scope: 'authorized_real',
      calculation: 'daily_mean_difference_from_pre28',
      baseline_window: 'PRE28',
      metric_ids: metrics.map((m) => m.metric_id),
      causal_claim: false,
    },
  };
  const decision =
    'Owner authorized read-only real Analytics in isolated test workspace.';
  await write(workspace, 'workspace.json', {
    workspace_mode: 'online',
    execution_scope: 'authorized_real',
  });
  await write(workspace, 'reviews/authorization.md', decision);
  const plan = {
    cycle_ref: schedule.cycle_ref,
    goal_ref: 'GOAL-REAL-ONE',
    merchant_ref: 'MER-REAL-ONE',
    knowledge_base_ref: 'KBASE-REAL-ONE',
    cycle_dir: 'cycles/real-one',
    analytics: ai,
    contracts: {},
    authorization: {
      ref: 'workspace://reviews/authorization.md',
      sha256: sha256(decision),
      expires_at: '2099-01-01T00:00:00Z',
    },
  };
  const pins = {},
    entries = [];
  for (const [role, data] of Object.entries(contracts)) {
    const source_path = `execution/contracts/${role}.json`,
      snapshot_path = `outputs/${role}.json`,
      bytes = stableStringify(data, 2);
    const tuple = {
      role,
      source_path,
      snapshot_path,
      media_type: 'application/json',
      source_sha256: sha256(bytes),
      snapshot_sha256: sha256(bytes),
    };
    const entry = { ...tuple, entry_key: sha256(stableStringify(tuple)) };
    entries.push(entry);
    plan.contracts[role] = source_path;
    pins[role] = {
      data,
      pin: {
        version: data.version,
        artifact_path: source_path,
        artifact_entry_key: entry.entry_key,
        sha256: entry.source_sha256,
      },
    };
    await write(workspace, source_path, bytes);
    await write(workspace, `runs/RUN-FREEZE/${snapshot_path}`, bytes);
  }
  const goalBytes = '# Frozen goal\n';
  const goal = {
    object_id: plan.goal_ref,
    record_type: 'perception_goal',
    object_version: '1.0.0',
    object_path: 'cycles/goal.md',
    content_sha256: sha256(goalBytes),
    file_sha256: sha256(goalBytes),
    snapshot_path: 'outputs/goal.md',
    snapshot_sha256: sha256(goalBytes),
  };
  goal.entry_key = sha256(stableStringify(goal));
  await write(workspace, goal.object_path, goalBytes);
  await write(workspace, 'runs/RUN-FREEZE/outputs/goal.md', goalBytes);
  const freeze = {
    id: 'CIS-REAL-ONE',
    version: '1.0.0',
    cycle_ref: plan.cycle_ref,
    snapshot_kind: 'freeze',
    execution_scope: 'authorized_real',
    run_ref: 'RUN-FREEZE',
    artifact_entries: entries,
    source_entries: [goal],
  };
  const cycle = {
    data: {
      id: plan.cycle_ref,
      version: '1.0.0',
      merchant_ref: plan.merchant_ref,
      knowledge_base_ref: plan.knowledge_base_ref,
      core_versions: {
        input_snapshot: { ref: freeze.id, version: freeze.version },
      },
      goal_tracks: [{ goal_entry_key: goal.entry_key }],
    },
  };
  const graph = {
    byId: new Map([
      [freeze.id, { data: freeze }],
      [plan.goal_ref, { data: { id: plan.goal_ref, version: '1.0.0' } }],
    ]),
  };
  return {
    workspace,
    context: { plan, cycle, graph, freeze, goal, pins, schedule, windows },
  };
}
function aiResponse({
  metric = 'sessions',
  rows = [['20260715', 'chatgpt.com', 'referral', 2]],
  timeZone = 'Asia/Shanghai',
  metadata = {},
} = {}) {
  return {
    dimensionHeaders: ['date', 'sessionSource', 'sessionMedium'].map(
      (name) => ({ name }),
    ),
    metricHeaders: [{ name: metric }],
    rowCount: rows.length,
    rows: rows.map(([date, source, medium, value]) => ({
      dimensionValues: [date, source, medium].map((value) => ({ value })),
      metricValues: [{ value: String(value) }],
    })),
    metadata: { timeZone, ...metadata },
  };
}
function responseFor(req) {
  if (req.url.includes('analyticsdata'))
    return aiResponse({
      rows: [
        [
          req.data.dateRanges[0].startDate.replaceAll('-', ''),
          'chatgpt.com',
          'referral',
          4,
        ],
      ],
    });
  const days =
    (Date.parse(req.data.endDate) - Date.parse(req.data.startDate)) / 86400000 +
    1;
  return {
    responseAggregationType: 'byProperty',
    rows: Array.from({ length: days }, (_, i) => ({
      keys: [
        new Date(Date.parse(req.data.startDate) + i * 86400000)
          .toISOString()
          .slice(0, 10),
      ],
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    })),
  };
}

test('resource calendar windows exclude publication day, preserve PT and do not overlap across DST', () => {
  assert.throws(() => calendarDate(publicationAt, undefined), {
    code: 'ANALYTICS_TIMEZONE_REQUIRED',
  });
  const preGA = analyticsCalendarWindow(windows[0], schedule, 'Asia/Shanghai');
  const preGSC = analyticsCalendarWindow(
    windows[0],
    schedule,
    'America/Los_Angeles',
  );
  assert.deepEqual(preGA, {
    start_date: '2026-07-04',
    end_date: '2026-07-31',
    time_zone: 'Asia/Shanghai',
  });
  assert.deepEqual(preGSC, {
    start_date: '2026-07-03',
    end_date: '2026-07-30',
    time_zone: 'America/Los_Angeles',
  });
  const fall = buildObservationSchedule({
    cycleRef: 'CYC-REAL-ONE',
    publicationAt: '2026-10-29T14:00:00Z',
    technicalAt: '2026-10-30T14:00:00Z',
  });
  const periods = fall.windows.map((w) =>
    analyticsCalendarWindow(w, fall, 'America/Los_Angeles'),
  );
  assert.deepEqual(
    periods.map((p) => [p.start_date, p.end_date]),
    [
      ['2026-10-31', '2026-11-06'],
      ['2026-11-07', '2026-11-13'],
      ['2026-11-14', '2026-11-20'],
      ['2026-11-21', '2026-11-27'],
    ],
  );
  assert.throws(
    () =>
      analyticsWindows(publicationAt, {
        ...schedule,
        windows: schedule.windows.slice(1),
      }),
    { code: 'ANALYTICS_WINDOW_INVALID' },
  );
});

test('requests use separate resource dates, exact source filter and no registration inference', () => {
  const window = analyticsCalendarWindow(windows[0], schedule, 'Asia/Shanghai'),
    gscWindow = analyticsCalendarWindow(
      windows[0],
      schedule,
      'America/Los_Angeles',
    );
  const req = buildCycleAnalyticsRequests({
    propertyId: '356373250',
    siteUrl: 'https://www.myyshop.com/',
    window,
    gscWindow,
  });
  assert.equal(req.registration, undefined);
  assert.equal(req.ga4.data.dateRanges[0].startDate, '2026-07-04');
  assert.equal(req.gsc.data.startDate, '2026-07-03');
  assert.equal(req.gsc.data.dataState, 'final');
  assert.equal(req.gsc.data.aggregationType, 'byProperty');
  assert.throws(() =>
    buildCycleAnalyticsRequests({
      propertyId: '356373250',
      siteUrl: 'http://localhost/',
      window,
    }),
  );
  assert.throws(() =>
    buildCycleAnalyticsRequests({
      propertyId: '356373250',
      siteUrl: 'https://www.myyshop.com/',
      window: { start_date: '2026-02-30', end_date: '2026-03-01' },
    }),
  );
});

test('GA4 normalization drops untrusted fields, preserves zero and refuses malformed, thresholded or timezone drift as complete data', () => {
  const report = aiResponse({
    rows: [['20260715', 'chatgpt.com', 'private@example.com', 0]],
    metadata: {
      subjectToThresholding: true,
      emptyReason: 'private@example.com',
    },
  });
  report.email = 'private@example.com';
  const normalized = normalizeAiReport(report);
  assert.equal(normalized.total, 0);
  assert.equal(normalized.rows[0].medium, 'other');
  assert.ok(!JSON.stringify(normalized).includes('@'));
  assert.deepEqual(normalized.warnings, [
    'THRESHOLDED',
    'EMPTY_REASON_PRESENT',
  ]);
  assert.throws(() => normalizeAiReport(report, { timeZone: 'UTC' }), {
    code: 'ANALYTICS_TIMEZONE_DRIFT',
  });
  assert.throws(
    () =>
      normalizeAiReport(
        aiResponse({ rows: [['20260715', 'google', 'organic', 4]] }),
      ),
    { code: 'ANALYTICS_RESPONSE_INVALID' },
  );
  assert.throws(() => normalizeAiReport({ ...aiResponse(), rowCount: 4 }), {
    code: 'ANALYTICS_RESPONSE_PARTIAL',
  });
  assert.throws(
    () =>
      normalizeAiReport(
        aiResponse({ rows: [['20260230', 'chatgpt.com', 'referral', 2]] }),
      ),
    { code: 'ANALYTICS_RESPONSE_INVALID' },
  );
  assert.throws(
    () =>
      normalizeAiReport(
        aiResponse({ rows: [['20260715', 'chatgpt.com', 'referral', -1]] }),
      ),
    { code: 'ANALYTICS_RESPONSE_INVALID' },
  );
  assert.equal(normalizeAiReport(aiResponse({ rows: [] })).total, 0);
});

test('GA4 reads every page and rejects count drift, empty intermediate pages and duplicate rows', async () => {
  const window = analyticsCalendarWindow(windows[0], schedule, 'Asia/Shanghai');
  const request = buildCycleAnalyticsRequests({
    propertyId: '356373250',
    siteUrl: 'https://www.myyshop.com/',
    window,
  }).ga4;
  const offsets = [];
  const result = await readAiReport(
    async (req) => {
      offsets.push(req.data.offset);
      return {
        ...aiResponse({
          rows: [
            [
              req.data.offset === '0' ? '20260715' : '20260716',
              'chatgpt.com',
              'referral',
              2,
            ],
          ],
        }),
        rowCount: 2,
      };
    },
    request,
    window,
    'Asia/Shanghai',
  );
  assert.deepEqual(offsets, ['0', '1']);
  assert.equal(result.total, 4);
  await assert.rejects(
    readAiReport(
      async (req) => ({
        ...aiResponse({
          rows:
            req.data.offset === '0'
              ? [['20260715', 'chatgpt.com', 'referral', 2]]
              : [],
        }),
        rowCount: 2,
      }),
      request,
      window,
      'Asia/Shanghai',
    ),
    { code: 'ANALYTICS_RESPONSE_PARTIAL' },
  );
  await assert.rejects(
    readAiReport(
      async () => ({ ...aiResponse(), rowCount: 2 }),
      request,
      window,
      'Asia/Shanghai',
    ),
    { code: 'ANALYTICS_RESPONSE_INVALID' },
  );
});

test('GSC omitted dates remain coverage gaps, malformed/duplicate/out-of-window data is rejected', () => {
  const period = { start_date: '2026-07-01', end_date: '2026-07-02' };
  assert.equal(normalizeGscReport({}, period).clicks, 0);
  assert.deepEqual(normalizeGscReport({}, period).warnings, [
    'GSC_DAYS_WITHOUT_ROWS',
  ]);
  const row = {
    keys: ['2026-07-01'],
    clicks: 1,
    impressions: 2,
    ctr: 0.5,
    position: 1,
  };
  assert.throws(() => normalizeGscReport({ rows: [row, row] }, period), {
    code: 'ANALYTICS_RESPONSE_INVALID',
  });
  assert.throws(
    () => normalizeGscReport({ rows: [{ ...row, ctr: 2 }] }, period),
    { code: 'ANALYTICS_RESPONSE_INVALID' },
  );
  assert.throws(
    () =>
      normalizeGscReport({ rows: [{ ...row, keys: ['2026-07-03'] }] }, period),
    { code: 'ANALYTICS_RESPONSE_INVALID' },
  );
});

test('comparison preserves negative, zero, unavailable and insufficient data without dividing by a zero baseline', () => {
  assert.deepEqual(compareAnalyticsMetric(7, 56, 7, 28), {
    value: -1,
    state: 'negative',
  });
  assert.deepEqual(compareAnalyticsMetric(0, 0, 7, 28), {
    value: 0,
    state: 'no_signal',
  });
  assert.deepEqual(compareAnalyticsMetric(7, 0, 7, 28), {
    value: 1,
    state: 'signal_observed',
  });
  assert.deepEqual(compareAnalyticsMetric(null, 0, 7, 28), {
    value: null,
    state: 'unavailable',
  });
  assert.deepEqual(compareAnalyticsMetric(0, 0, 7, 28, true), {
    value: null,
    state: 'insufficient_data',
  });
});

test('exact freeze pins validate goal/source/copy plus measurement, policy and rule before collection', async (t) => {
  const { workspace, context: c } = await fixture(t);
  const resolved = await resolveAnalyticsPins(
    workspace,
    c.plan,
    c.graph,
    c.cycle,
  );
  assert.deepEqual(resolved.pins, c.pins);
  await write(workspace, c.plan.contracts.measurement_contract, {
    ...c.pins.measurement_contract.data,
    analytics: { ...c.plan.analytics, property_id: '999' },
  });
  await assert.rejects(
    resolveAnalyticsPins(workspace, c.plan, c.graph, c.cycle),
    { code: 'ANALYTICS_CONTRACT_DRIFT' },
  );
  await write(
    workspace,
    c.plan.contracts.measurement_contract,
    c.pins.measurement_contract.data,
  );
  await write(workspace, 'runs/RUN-FREEZE/outputs/goal.md', 'tampered');
  await assert.rejects(
    resolveAnalyticsPins(workspace, c.plan, c.graph, c.cycle),
    { code: 'ANALYTICS_CONTRACT_DRIFT' },
  );
});

test('registration requires an exact approved event definition and frozen proof, not a merely existing file', async (t) => {
  const { workspace, context: c } = await fixture(t, {
    registration_event: 'sign_up',
    registration_approval_ref: 'workspace://reviews/event.json',
    registration_approval_sha256: 'a'.repeat(64),
  });
  await write(workspace, 'reviews/event.json', { event_name: 'sign_up' });
  assert.deepEqual(
    await registrationDefinition(workspace, c.plan, c.freeze, new Date()),
    { event: null, warning: 'REGISTRATION_DEFINITION_INVALID' },
  );
  c.plan.analytics.registration_event = null;
  assert.deepEqual(
    await registrationDefinition(workspace, c.plan, c.freeze, new Date()),
    { event: null, warning: 'REGISTRATION_DEFINITION_UNCONFIRMED' },
  );
});

test('mature windows materialize schema-valid observations/signals while pending windows cause no API call', async (t) => {
  const { workspace, context: c } = await fixture(t);
  let calls = 0;
  const request = async (req) => {
    calls++;
    return responseFor(req);
  };
  assert.equal(
    await collectAnalyticsWindow(
      workspace,
      c,
      windows[1],
      request,
      new Date('2026-08-08T10:00:00Z'),
      null,
      true,
    ),
    null,
  );
  assert.equal(calls, 0);
  const pre = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    request,
    new Date('2026-09-10T10:00:00Z'),
    null,
    true,
  );
  assert.equal(calls, 2);
  assert.equal(pre.objects.length, 6);
  for (const object of pre.objects) validateObjectData(object.data);
  assert.equal(
    pre.objects.find((o) => o.data.id.endsWith('AI-REGISTRATION-EVENTS')).data
      .calculation.state,
    'unavailable',
  );
  assert.equal(
    pre.objects.find((o) => o.data.id.endsWith('GSC-CLICKS')).data.calculation
      .state,
    'no_signal',
  );
  let total = pre.objects.length;
  for (const window of windows.slice(1)) {
    const result = await collectAnalyticsWindow(
      workspace,
      c,
      window,
      request,
      new Date('2026-09-10T10:00:00Z'),
      pre.raw,
      true,
    );
    total += result.objects.length;
    assert.deepEqual(
      buildAnalyticsObjects(c, result.raw),
      result.objects.map((o) => o.data),
    );
  }
  assert.equal(total, 30);
  assert.equal(calls, 10);
});

test('source errors persist safely, retry after six hours, reuse successes and create immutable successors', async (t) => {
  const { workspace, context: c } = await fixture(t);
  const calls = [];
  let fail = true;
  const request = async (req) => {
    const kind = req.url.includes('analyticsdata') ? 'ga4' : 'gsc';
    calls.push(kind);
    if (kind === 'ga4' && fail)
      throw Object.assign(
        new Error('secret=do-not-store private@example.com'),
        { code: 'private@example.com', response: { status: 403 } },
      );
    return responseFor(req);
  };
  const first = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    request,
    new Date('2026-09-10T00:00:00Z'),
    null,
    true,
  );
  assert.equal(first.raw.sources.ga4.status, 'unavailable');
  assert.ok(!JSON.stringify(first.raw).includes('@'));
  assert.deepEqual(calls, ['ga4', 'gsc']);
  const same = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    request,
    new Date('2026-09-10T01:00:00Z'),
    null,
    true,
  );
  assert.equal(same.raw.attempt, 1);
  assert.equal(calls.length, 2);
  // Simulate interrupted canonical materialization; resume from durable raw.
  await rm(path.join(workspace, first.objects[5].path));
  const restored = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    request,
    new Date('2026-09-10T02:00:00Z'),
    null,
    true,
  );
  assert.equal(restored.objects.length, 6);
  assert.equal(calls.length, 2);
  fail = false;
  const next = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    request,
    new Date('2026-09-10T06:00:00Z'),
    null,
    true,
  );
  assert.deepEqual(calls, ['ga4', 'gsc', 'ga4']);
  assert.equal(next.raw.attempt, 2);
  assert.equal(next.objects[0].data.supersedes_ref, first.objects[0].data.id);
  assert.equal(
    next.raw.sources.gsc.collected_at,
    first.raw.sources.gsc.collected_at,
  );
  const original = await readFile(
    path.join(
      workspace,
      `runs/${first.objects[0].data.run_ref}/raw/analytics.json`,
    ),
    'utf8',
  );
  assert.equal(sha256(original), first.objects[0].data.artifacts[0].sha256);
});

test('unknown GA4 timezone never defaults to UTC and does not block mature GSC', async (t) => {
  const { workspace, context: c } = await fixture(t, {
    property_time_zone: null,
  });
  const calls = [];
  const result = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    async (req) => {
      calls.push(req.url);
      return responseFor(req);
    },
    new Date('2026-09-10T00:00:00Z'),
    null,
    true,
  );
  assert.equal(calls.length, 1);
  assert.ok(calls[0].includes('/searchAnalytics/query'));
  assert.equal(result.raw.calendars.ga4, null);
  assert.equal(result.raw.sources.ga4.error, 'GA4_TIMEZONE_UNCONFIRMED');
});

test('auth creation/refresh failures are per-source unavailable with no leaked token payload', async (t) => {
  const { workspace, context: c } = await fixture(t);
  const result = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    async () => {
      throw {
        response: {
          status: 400,
          data: {
            error: 'invalid_grant',
            error_description: 'secret=NEVER-SAVE',
          },
        },
      };
    },
    new Date('2026-09-10T00:00:00Z'),
    null,
    true,
  );
  assert.equal(result.raw.sources.ga4.error, 'AUTH_INVALID_GRANT');
  assert.equal(result.raw.sources.gsc.error, 'AUTH_INVALID_GRANT');
  assert.ok(!JSON.stringify(result).includes('NEVER-SAVE'));
});

test('raw tampering blocks replay and old weekly signals are superseded when PRE28 recovers', async (t) => {
  const { workspace, context: c } = await fixture(t);
  let fail = true;
  const request = async (req) => {
    if (fail && req.url.includes('analyticsdata'))
      throw { response: { status: 503 } };
    return responseFor(req);
  };
  const pre = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    request,
    new Date('2026-09-10T00:00:00Z'),
    null,
    true,
  );
  fail = false;
  const w1 = await collectAnalyticsWindow(
    workspace,
    c,
    windows[1],
    request,
    new Date('2026-09-10T00:00:00Z'),
    pre.raw,
    true,
  );
  const nextPre = await collectAnalyticsWindow(
    workspace,
    c,
    windows[0],
    request,
    new Date('2026-09-10T07:00:00Z'),
    null,
    true,
  );
  const nextW1 = await collectAnalyticsWindow(
    workspace,
    c,
    windows[1],
    request,
    new Date('2026-09-10T07:00:00Z'),
    nextPre.raw,
    true,
  );
  assert.equal(nextW1.raw.attempt, 2);
  assert.equal(nextW1.objects[0].data.supersedes_ref, w1.objects[0].data.id);
  assert.equal(
    nextW1.objects.find((o) => o.data.id.endsWith('AI-VISITS')).data
      .observation_versions[1].ref,
    nextPre.objects[0].data.id,
  );
  const rawPath = `runs/${nextW1.objects[0].data.run_ref}/raw/analytics.json`;
  await write(workspace, rawPath, { ...nextW1.raw, causal_claim: true });
  await assert.rejects(
    collectAnalyticsWindow(
      workspace,
      c,
      windows[1],
      request,
      new Date('2026-09-10T08:00:00Z'),
      nextPre.raw,
      true,
    ),
    { code: 'ANALYTICS_ARTIFACT_CONFLICT' },
  );
});

test('full matrix gate rejects early dates, missing objects, forged metrics and stale baseline', async (t) => {
  const { workspace, context: c } = await fixture(t);
  await assert.rejects(
    validateAnalyticsMatrix(workspace, c, [], new Date('2026-08-08T10:00:00Z')),
    { code: 'OBSERVATION_WINDOW_PENDING' },
  );
  const now = new Date('2026-09-10T10:00:00Z'),
    objects = [];
  let baseline;
  for (const window of windows) {
    const result = await collectAnalyticsWindow(
      workspace,
      c,
      window,
      async (req) => responseFor(req),
      now,
      baseline,
      true,
    );
    if (window.id === 'PRE28') baseline = result.raw;
    objects.push(...result.objects);
  }
  assert.equal(await validateAnalyticsMatrix(workspace, c, objects, now), true);
  await assert.rejects(
    validateAnalyticsMatrix(workspace, c, objects.slice(1), now),
    { code: 'ANALYTICS_MATRIX_INCOMPLETE' },
  );
  const forged = structuredClone(objects);
  forged[0].data.metrics[0].value = 999999;
  await assert.rejects(validateAnalyticsMatrix(workspace, c, forged, now), {
    code: 'ANALYTICS_MATRIX_INCOMPLETE',
  });
  const statePath = `${c.plan.cycle_dir}/analytics/W4/state.json`,
    state = JSON.parse(await readFile(path.join(workspace, statePath), 'utf8'));
  const raw = JSON.parse(
    await readFile(path.join(workspace, state.raw_path), 'utf8'),
  );
  raw.baseline_sha256 = '0'.repeat(64);
  await write(workspace, state.raw_path, raw);
  await write(workspace, statePath, { ...state, raw_sha256: hash(raw) });
  await assert.rejects(validateAnalyticsMatrix(workspace, c, objects, now), {
    code: 'ANALYTICS_BASELINE_DRIFT',
  });
});

test('approved registration pins require verified matching event semantics and evidence bytes', async (t) => {
  const { workspace, context: c } = await fixture(t, {
    registration_event: 'sign_up',
    registration_approval_ref: 'workspace://reviews/event.json',
  });
  async function freezeFile(source_path, data) {
    const bytes = stableStringify(data, 2),
      snapshot_path = `outputs/${path.basename(source_path)}`;
    const entry = {
      role: 'supporting_artifact',
      source_path,
      snapshot_path,
      media_type: 'application/json',
      source_sha256: sha256(bytes),
      snapshot_sha256: sha256(bytes),
    };
    entry.entry_key = sha256(stableStringify(entry));
    c.freeze.artifact_entries.push(entry);
    await write(workspace, source_path, bytes);
    await write(workspace, `runs/RUN-FREEZE/${snapshot_path}`, bytes);
    return sha256(bytes);
  }
  const proof = {
    property_id: '356373250',
    event_name: 'sign_up',
    definition: 'Completed registration recorded by the application.',
    verified: true,
    verified_at: '2026-07-01T00:00:00Z',
  };
  const proofSha = await freezeFile('reviews/event-definition.json', proof);
  const approval = {
    schema_version: 'geo-registration-definition-approval-v1',
    decision: 'approve',
    actor: 'Owner',
    at: '2026-07-02T00:00:00Z',
    cycle_ref: c.plan.cycle_ref,
    goal_ref: c.plan.goal_ref,
    property_id: '356373250',
    event_name: 'sign_up',
    definition: proof.definition,
    proof: { path: 'reviews/event-definition.json', sha256: proofSha },
  };
  c.plan.analytics.registration_approval_sha256 = await freezeFile(
    'reviews/event.json',
    approval,
  );
  assert.deepEqual(
    await registrationDefinition(
      workspace,
      c.plan,
      c.freeze,
      new Date('2026-08-01'),
    ),
    { event: 'sign_up', warning: null },
  );
  await write(workspace, 'reviews/event-definition.json', {
    ...proof,
    event_name: 'page_view',
  });
  assert.equal(
    (
      await registrationDefinition(
        workspace,
        c.plan,
        c.freeze,
        new Date('2026-08-01'),
      )
    ).event,
    null,
  );
});
