import { readFile } from 'node:fs/promises';
import {
  realContext,
  putJson,
  putObject,
  jsonAt,
  realObject,
  assertRealAuthorization,
} from './real-journey-store.mjs';
import {
  requireReal,
  buildObservationSchedule,
  realPublicUrl,
} from './real-cycle-contract.mjs';
import {
  sha256,
  resolveWithin,
  stableStringify,
  atomicWrite,
  assertNoSymlinkPath,
} from './workspace-paths.mjs';
import { ensureJourneyRun } from './journey-sampling.mjs';
import { transitionRun, readRun } from './run-store.mjs';
import { withJourneyLock } from './journey-lock.mjs';

// Exact domains only: neither direct/Google traffic nor unknown referrals imply AI visits.
export const AI_SOURCES = Object.freeze([
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'www.perplexity.ai',
  'claude.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
]);
const DAY = 86400000;
const GSC_ZONE = 'America/Los_Angeles';
const METRICS = Object.freeze({
  ai_visits: ['ga4', 'sessions', 'ai_visit'],
  ai_registration_events: ['registration', 'events', 'ai_registration'],
  gsc_clicks: ['gsc', 'clicks', 'search_visibility'],
  gsc_impressions: ['gsc', 'impressions', 'search_visibility'],
});
const LIMITATION =
  'Observational aggregates only; recognized AI session sources miss unattributed/direct visits and do not isolate causal GEO effects. Event counts are not unique people. GSC web traffic does not isolate AI answers. Source calendars differ; no statistical significance or error bound is inferred.';
const equal = (a, b) => stableStringify(a) === stableStringify(b);
const digest = (value) => sha256(stableStringify(value, 2));
function validDate(value) {
  const time = Date.parse(`${value}T00:00:00Z`);
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(time) &&
    new Date(time).toISOString().slice(0, 10) === value
  );
}
function addDays(date, count) {
  requireReal(
    validDate(date),
    'ANALYTICS_WINDOW_INVALID',
    'Invalid calendar date',
  );
  return new Date(Date.parse(`${date}T00:00:00Z`) + count * DAY)
    .toISOString()
    .slice(0, 10);
}
function dayCount(period) {
  return (
    (Date.parse(period.end_date) - Date.parse(period.start_date)) / DAY + 1
  );
}
export function calendarDate(instant, timeZone) {
  requireReal(
    typeof timeZone === 'string' &&
      timeZone.length > 0 &&
      Number.isFinite(new Date(instant).getTime()),
    'ANALYTICS_TIMEZONE_REQUIRED',
    'A verified IANA property timezone is required',
  );
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(instant));
  } catch {
    requireReal(false, 'ANALYTICS_TIMEZONE_REQUIRED', 'Invalid IANA timezone');
  }
}
export function analyticsWindows(publicationAt, schedule) {
  const published = Date.parse(publicationAt);
  requireReal(
    Number.isFinite(published),
    'ANALYTICS_WINDOW_INVALID',
    'Publication timestamp required',
  );
  const expected = buildObservationSchedule({
    cycleRef: schedule.cycle_ref,
    publicationAt,
    technicalAt: schedule.technical_retest_at,
  });
  requireReal(
    Date.parse(schedule.publication_at) === published &&
      equal(schedule.windows, expected.windows),
    'ANALYTICS_WINDOW_INVALID',
    'Analytics must use the actual four-window schedule',
  );
  return [
    {
      id: 'PRE28',
      starts_at: new Date(published - 28 * DAY).toISOString(),
      ends_at: new Date(published).toISOString(),
    },
    ...schedule.windows,
  ];
}
// PRE28 excludes the publication day. Weekly source periods begin the next full
// resource-calendar day after technical retest; they do not overlap at midnight
// or across DST. The consumer-platform schedule remains unchanged.
export function analyticsCalendarWindow(window, schedule, timeZone) {
  const anchor = calendarDate(
    window.id === 'PRE28'
      ? schedule.publication_at
      : schedule.technical_retest_at,
    timeZone,
  );
  const ordinal = Number(window.id.slice(1));
  requireReal(
    window.id === 'PRE28' || /^[W][1-4]$/.test(window.id),
    'ANALYTICS_WINDOW_INVALID',
    'Unknown Analytics window',
  );
  return {
    start_date: addDays(
      anchor,
      window.id === 'PRE28' ? -28 : 1 + (ordinal - 1) * 7,
    ),
    end_date: addDays(anchor, window.id === 'PRE28' ? -1 : ordinal * 7),
    time_zone: timeZone,
  };
}
function mature(period, now, lag) {
  return (
    period === null ||
    period.end_date <= addDays(calendarDate(now, period.time_zone), -lag)
  );
}
function assertPeriod(period) {
  requireReal(
    validDate(period?.start_date) &&
      validDate(period?.end_date) &&
      period.start_date <= period.end_date &&
      dayCount(period) <= 28,
    'ANALYTICS_WINDOW_INVALID',
    'Expected 1–28 complete calendar dates',
  );
}
export function buildCycleAnalyticsRequests({
  propertyId,
  siteUrl,
  window,
  gscWindow = window,
  registrationEvent,
}) {
  requireReal(
    /^\d+$/.test(propertyId ?? ''),
    'ANALYTICS_RESOURCE_INVALID',
    'Explicit GA4 property required',
  );
  realPublicUrl(siteUrl);
  assertPeriod(window);
  assertPeriod(gscWindow);
  requireReal(
    !registrationEvent ||
      /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(registrationEvent),
    'ANALYTICS_REGISTRATION_INVALID',
    'Invalid registration event name',
  );
  const filter = {
    filter: {
      fieldName: 'sessionSource',
      inListFilter: { values: [...AI_SOURCES], caseSensitive: false },
    },
  };
  const common = {
    dateRanges: [{ startDate: window.start_date, endDate: window.end_date }],
    dimensions: [
      { name: 'date' },
      { name: 'sessionSource' },
      { name: 'sessionMedium' },
    ],
    orderBys: ['date', 'sessionSource', 'sessionMedium'].map(
      (dimensionName) => ({ dimension: { dimensionName } }),
    ),
    limit: '1000',
    offset: '0',
    keepEmptyRows: true,
  };
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  return {
    ga4: {
      url,
      data: {
        ...common,
        metrics: [{ name: 'sessions' }],
        dimensionFilter: filter,
      },
    },
    ...(registrationEvent
      ? {
          registration: {
            url,
            data: {
              ...common,
              metrics: [{ name: 'eventCount' }],
              dimensionFilter: {
                andGroup: {
                  expressions: [
                    filter,
                    {
                      filter: {
                        fieldName: 'eventName',
                        stringFilter: {
                          matchType: 'EXACT',
                          value: registrationEvent,
                          caseSensitive: true,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        }
      : {}),
    gsc: {
      url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      data: {
        startDate: gscWindow.start_date,
        endDate: gscWindow.end_date,
        dimensions: ['date'],
        type: 'web',
        aggregationType: 'byProperty',
        dataState: 'final',
        rowLimit: 25000,
        startRow: 0,
      },
    },
  };
}
function qualityWarnings(metadata = {}) {
  return [
    ...(metadata.subjectToThresholding ? ['THRESHOLDED'] : []),
    ...(metadata.dataLossFromOtherRow ? ['DATA_LOSS'] : []),
    ...(metadata.samplingMetadatas?.length ? ['SAMPLED'] : []),
    ...(metadata.dataTruncationReasons?.length ? ['TRUNCATED'] : []),
    ...(metadata.schemaRestrictionResponse?.activeMetricRestrictions?.length
      ? ['RESTRICTED']
      : []),
    ...(metadata.emptyReason ? ['EMPTY_REASON_PRESENT'] : []),
  ];
}
export function normalizeAiReport(response, { metric, period, timeZone } = {}) {
  const name = response?.metricHeaders?.[0]?.name;
  requireReal(
    response?.metricHeaders?.length === 1 &&
      (metric ? name === metric : ['sessions', 'eventCount'].includes(name)) &&
      (response.dimensionHeaders ?? []).map((x) => x.name).join(',') ===
        'date,sessionSource,sessionMedium',
    'ANALYTICS_RESPONSE_INVALID',
    'Unexpected report headers',
  );
  const time_zone = response.metadata?.timeZone;
  calendarDate(Date.now(), time_zone);
  requireReal(
    !timeZone || timeZone === time_zone,
    'ANALYTICS_TIMEZONE_DRIFT',
    'GA4 property timezone differs from the frozen contract',
  );
  const seen = new Set();
  const rows = (response.rows ?? []).map((row) => {
    requireReal(
      row.dimensionValues?.length === 3 && row.metricValues?.length === 1,
      'ANALYTICS_RESPONSE_INVALID',
      'Unexpected report dimensions',
    );
    const [date, source, medium] = row.dimensionValues.map((x) => x.value),
      raw = row.metricValues[0].value,
      value = Number(raw);
    const day =
      typeof date === 'string'
        ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        : '';
    const key = JSON.stringify([date, source, medium]);
    requireReal(
      /^\d{8}$/.test(date ?? '') &&
        validDate(day) &&
        typeof source === 'string' &&
        AI_SOURCES.includes(source.toLowerCase()) &&
        typeof medium === 'string' &&
        /^(?:0|[1-9]\d*)$/.test(raw ?? '') &&
        Number.isSafeInteger(value) &&
        !seen.has(key) &&
        (!period || (day >= period.start_date && day <= period.end_date)),
      'ANALYTICS_RESPONSE_INVALID',
      'Unexpected or duplicate aggregate row',
    );
    seen.add(key);
    return {
      date: day,
      source: source.toLowerCase(),
      medium: ['referral', 'organic', '(none)', '(not set)'].includes(medium)
        ? medium
        : 'other',
      value,
    };
  });
  const count = response.rowCount ?? 0;
  requireReal(
    Number.isSafeInteger(count) && count === rows.length,
    'ANALYTICS_RESPONSE_PARTIAL',
    'Incomplete paginated aggregate result',
  );
  const total = rows.reduce((n, r) => n + r.value, 0);
  requireReal(
    Number.isSafeInteger(total),
    'ANALYTICS_RESPONSE_INVALID',
    'Aggregate exceeds numeric precision',
  );
  return {
    rows,
    total,
    time_zone,
    warnings: qualityWarnings(response.metadata),
  };
}
export async function readAiReport(request, descriptor, period, timeZone) {
  let header,
    count,
    rows = [],
    warnings = [],
    pages = 0;
  do {
    const response = await request({
      ...descriptor,
      data: { ...descriptor.data, offset: String(rows.length) },
    });
    const currentCount = response?.rowCount ?? 0;
    requireReal(
      Number.isSafeInteger(currentCount) &&
        currentCount >= 0 &&
        currentCount <= 50000 &&
        (count === undefined || currentCount === count),
      'ANALYTICS_RESPONSE_PARTIAL',
      'GA4 page count drift or read bound exceeded',
    );
    count = currentCount;
    if (!header) header = response;
    requireReal(
      equal(response.dimensionHeaders, header.dimensionHeaders) &&
        equal(response.metricHeaders, header.metricHeaders) &&
        response.metadata?.timeZone === header.metadata?.timeZone,
      'ANALYTICS_RESPONSE_PARTIAL',
      'GA4 page headers drifted',
    );
    const part = response.rows ?? [];
    requireReal(
      Array.isArray(part) &&
        (part.length > 0 || count === 0) &&
        rows.length + part.length <= count &&
        ++pages <= 50,
      'ANALYTICS_RESPONSE_PARTIAL',
      'Empty, duplicate or incomplete GA4 page',
    );
    rows.push(...part);
    warnings.push(...qualityWarnings(response.metadata));
  } while (rows.length < count);
  const result = normalizeAiReport(
    { ...header, rowCount: count, rows },
    { metric: descriptor.data.metrics[0].name, period, timeZone },
  );
  return { ...result, warnings: [...new Set(warnings)] };
}
export function normalizeGscReport(response, period) {
  assertPeriod(period);
  requireReal(
    response &&
      typeof response === 'object' &&
      !response.error &&
      ['byProperty', undefined].includes(response.responseAggregationType) &&
      (response.rows === undefined || Array.isArray(response.rows)),
    'ANALYTICS_RESPONSE_INVALID',
    'Invalid GSC property report',
  );
  const seen = new Set();
  const rows = (response.rows ?? []).map((row) => {
    const date = row.keys?.[0];
    requireReal(
      row.keys?.length === 1 &&
        validDate(date) &&
        date >= period.start_date &&
        date <= period.end_date &&
        !seen.has(date) &&
        ['clicks', 'impressions', 'ctr', 'position'].every(
          (k) =>
            typeof row[k] === 'number' &&
            Number.isFinite(row[k]) &&
            row[k] >= 0,
        ) &&
        row.ctr <= 1 &&
        row.clicks <= row.impressions,
      'ANALYTICS_RESPONSE_INVALID',
      'Invalid GSC aggregate row',
    );
    seen.add(date);
    return {
      date,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    };
  });
  requireReal(
    rows.length <= dayCount(period),
    'ANALYTICS_RESPONSE_PARTIAL',
    'Too many GSC date rows',
  );
  return {
    time_zone: GSC_ZONE,
    rows,
    clicks: rows.reduce((n, r) => n + r.clicks, 0),
    impressions: rows.reduce((n, r) => n + r.impressions, 0),
    warnings: rows.length < dayCount(period) ? ['GSC_DAYS_WITHOUT_ROWS'] : [],
  };
}
async function frozenBytes(workspace, freeze, entry) {
  requireReal(entry, 'ANALYTICS_CONTRACT_DRIFT', 'Frozen artifact is missing');
  const { entry_key, ...tuple } = entry;
  requireReal(
    sha256(stableStringify(tuple)) === entry_key,
    'ANALYTICS_CONTRACT_DRIFT',
    'Frozen artifact tuple changed',
  );
  const copyPath = `runs/${freeze.run_ref}/${entry.snapshot_path}`;
  await assertNoSymlinkPath(workspace, entry.source_path);
  await assertNoSymlinkPath(workspace, copyPath);
  const bytes = await readFile(resolveWithin(workspace, entry.source_path)),
    copy = await readFile(resolveWithin(workspace, copyPath));
  requireReal(
    sha256(bytes) === entry.source_sha256 &&
      sha256(copy) === entry.snapshot_sha256 &&
      entry.source_sha256 === entry.snapshot_sha256,
    'ANALYTICS_CONTRACT_DRIFT',
    'Frozen artifact source/copy changed',
  );
  return bytes;
}
export async function resolveAnalyticsPins(workspace, plan, graph, cycle) {
  const freeze = graph.byId.get(
    cycle?.data.core_versions?.input_snapshot?.ref,
  )?.data;
  requireReal(
    freeze?.snapshot_kind === 'freeze' &&
      freeze.execution_scope === 'authorized_real' &&
      freeze.cycle_ref === cycle?.data.id &&
      freeze.version === cycle.data.core_versions.input_snapshot.version &&
      plan?.cycle_ref === cycle.data.id &&
      plan.merchant_ref === cycle.data.merchant_ref &&
      plan.knowledge_base_ref === cycle.data.knowledge_base_ref,
    'ANALYTICS_CONTRACT_DRIFT',
    'Cycle/freeze/scope binding mismatch',
  );
  const goal = freeze.source_entries.find(
    (e) => e.object_id === plan.goal_ref && e.record_type === 'perception_goal',
  );
  requireReal(
    goal &&
      cycle.data.goal_tracks.length === 1 &&
      cycle.data.goal_tracks[0].goal_entry_key === goal.entry_key &&
      graph.byId.get(plan.goal_ref)?.data.version === goal.object_version,
    'ANALYTICS_CONTRACT_DRIFT',
    'Analytics goal must match the frozen track',
  );
  const { entry_key: goalKey, ...goalTuple } = goal;
  const goalCopyPath = `runs/${freeze.run_ref}/${goal.snapshot_path}`;
  await assertNoSymlinkPath(workspace, goal.object_path);
  await assertNoSymlinkPath(workspace, goalCopyPath);
  requireReal(
    sha256(stableStringify(goalTuple)) === goalKey &&
      sha256(await readFile(resolveWithin(workspace, goal.object_path))) ===
        goal.file_sha256 &&
      sha256(await readFile(resolveWithin(workspace, goalCopyPath))) ===
        goal.snapshot_sha256 &&
      goal.file_sha256 === goal.snapshot_sha256,
    'ANALYTICS_CONTRACT_DRIFT',
    'Frozen goal tuple/source/copy changed',
  );
  const pins = {};
  for (const role of [
    'measurement_contract',
    'signal_rule',
    'sensitive_data_policy',
  ]) {
    const relative = plan.contracts?.[role],
      entry = freeze.artifact_entries.find(
        (e) => e.role === role && e.source_path === relative,
      );
    const data = JSON.parse(await frozenBytes(workspace, freeze, entry));
    requireReal(
      data.scope === 'authorized_real' &&
        data.id &&
        /^\d+\.\d+\.\d+$/.test(data.version),
      'ANALYTICS_CONTRACT_INVALID',
      'Real Analytics contracts need explicit scope and version',
    );
    pins[role] = {
      data,
      pin: {
        version: data.version,
        artifact_path: relative,
        artifact_entry_key: entry.entry_key,
        sha256: entry.source_sha256,
      },
    };
  }
  const measurement = pins.measurement_contract.data,
    policy = pins.sensitive_data_policy.data,
    rule = pins.signal_rule.data,
    ai = plan.analytics;
  requireReal(
    measurement.schema_version === 'm6-measurement-contract/1.0.0' &&
      measurement.causal_claim_allowed === false &&
      equal(measurement.ai_sources, AI_SOURCES) &&
      equal(measurement.analytics, ai) &&
      Object.entries(METRICS).every(([id, [, unit]]) =>
        measurement.metrics?.some(
          (m) => m.metric_id === id && m.unit === unit && m.definition?.trim(),
        ),
      ),
    'ANALYTICS_CONTRACT_INVALID',
    'Measurement metrics/resource configuration differ from freeze',
  );
  requireReal(
    policy.schema_version === 'm6-sensitive-data-policy/1.0.0' &&
      policy.aggregate_only === true &&
      policy.unknown_fields === 'reject' &&
      equal(policy.allowed_dimensions, [
        'date',
        'sessionSource',
        'sessionMedium',
      ]) &&
      Number.isSafeInteger(policy.max_input_bytes) &&
      policy.max_input_bytes > 0 &&
      policy.max_input_bytes <= 1048576,
    'ANALYTICS_POLICY_INVALID',
    'Expected bounded aggregate-only policy',
  );
  requireReal(
    rule.schema_version === 'm6-signal-rule/1.0.0' &&
      rule.calculation === 'daily_mean_difference_from_pre28' &&
      rule.baseline_window === 'PRE28' &&
      rule.causal_claim === false &&
      Array.isArray(rule.metric_ids) &&
      equal([...rule.metric_ids].sort(), Object.keys(METRICS).sort()),
    'ANALYTICS_RULE_INVALID',
    'Unsupported frozen signal rule',
  );
  requireReal(
    /^\d+$/.test(ai?.property_id ?? '') &&
      ai.calendar_policy === 'complete_days_after_anchor' &&
      Number.isInteger(ai.final_lag_days) &&
      ai.final_lag_days >= 3 &&
      ai.final_lag_days <= 14,
    'ANALYTICS_CONTRACT_INVALID',
    'Explicit resources, calendar policy and 3–14 day settling lag required',
  );
  realPublicUrl(ai.site_url);
  if (ai.property_time_zone !== null)
    calendarDate(Date.now(), ai.property_time_zone);
  return { pins, freeze, goal };
}
export async function registrationDefinition(workspace, plan, freeze, now) {
  const ai = plan.analytics;
  if (
    !ai.registration_event ||
    !ai.registration_approval_ref ||
    !ai.registration_approval_sha256
  )
    return { event: null, warning: 'REGISTRATION_DEFINITION_UNCONFIRMED' };
  const relative = ai.registration_approval_ref.replace(/^workspace:\/\//, '');
  try {
    const entry = freeze.artifact_entries.find(
        (e) => e.source_path === relative,
      ),
      bytes = await frozenBytes(workspace, freeze, entry),
      approval = JSON.parse(bytes);
    requireReal(
      sha256(bytes) === ai.registration_approval_sha256 &&
        approval.schema_version === 'geo-registration-definition-approval-v1' &&
        approval.decision === 'approve' &&
        typeof approval.actor === 'string' &&
        approval.actor.trim() &&
        Number.isFinite(Date.parse(approval.at)) &&
        Date.parse(approval.at) <= new Date(now).getTime() &&
        approval.cycle_ref === plan.cycle_ref &&
        approval.goal_ref === plan.goal_ref &&
        approval.property_id === ai.property_id &&
        approval.event_name === ai.registration_event &&
        /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(approval.event_name) &&
        approval.definition?.trim(),
      'ANALYTICS_REGISTRATION_INVALID',
      'Registration approval does not bind the actual resource/event/goal',
    );
    const proofBytes = await frozenBytes(
      workspace,
      freeze,
      freeze.artifact_entries.find(
        (e) => e.source_path === approval.proof?.path,
      ),
    );
    const proof = JSON.parse(proofBytes);
    requireReal(
      sha256(proofBytes) === approval.proof.sha256 &&
        proof.property_id === ai.property_id &&
        proof.event_name === ai.registration_event &&
        proof.definition === approval.definition &&
        proof.verified === true &&
        Date.parse(proof.verified_at) <= Date.parse(approval.at),
      'ANALYTICS_REGISTRATION_INVALID',
      'Actual registration definition proof is missing',
    );
    return { event: ai.registration_event, warning: null };
  } catch {
    return { event: null, warning: 'REGISTRATION_DEFINITION_INVALID' };
  }
}
function safeError(error) {
  const auth = error?.response?.data?.error;
  if (
    [
      'invalid_grant',
      'invalid_rapt',
      'invalid_client',
      'invalid_scope',
      'access_denied',
    ].includes(auth)
  )
    return `AUTH_${auth.toUpperCase()}`;
  const code = error?.code;
  if (
    [
      'ANALYTICS_TIMEZONE_REQUIRED',
      'ANALYTICS_TIMEZONE_DRIFT',
      'ANALYTICS_RESPONSE_INVALID',
      'ANALYTICS_RESPONSE_PARTIAL',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNRESET',
    ].includes(code)
  )
    return code;
  const status = error?.response?.status;
  return Number.isInteger(status) && status >= 400 && status <= 599
    ? `HTTP_${status}`
    : 'AUTH_OR_REQUEST_FAILED';
}
function googleRequester() {
  let client;
  return async (descriptor) => {
    client ??= import('google-auth-library').then(({ GoogleAuth }) =>
      new GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/analytics.readonly',
          'https://www.googleapis.com/auth/webmasters.readonly',
        ],
      }).getClient(),
    );
    return (
      await (
        await client
      ).request({ ...descriptor, method: 'POST', timeout: 30000, retry: false })
    ).data;
  };
}
function metricValue(raw, id) {
  const [source] = METRICS[id],
    result = raw.sources[source];
  return result?.status === 'ok'
    ? source === 'gsc'
      ? result.data[id === 'gsc_clicks' ? 'clicks' : 'impressions']
      : result.data.total
    : null;
}
export function compareAnalyticsMetric(
  current,
  baseline,
  currentDays,
  baselineDays,
  partial = false,
) {
  if (current === null || baseline === null)
    return { value: null, state: 'unavailable' };
  if (partial) return { value: null, state: 'insufficient_data' };
  const value = current / currentDays - baseline / baselineDays;
  return {
    value,
    state:
      value < 0 ? 'negative' : value === 0 ? 'no_signal' : 'signal_observed',
  };
}
function objectIds(cycle, window, attempt) {
  const suffix = `${cycle.data.id.slice(4)}-${window.id}${attempt > 1 ? `-A${attempt}` : ''}`;
  return {
    run: `RUN-${suffix}-ANALYTICS`,
    observation: (kind) => `ANO-${suffix}-${kind.toUpperCase()}`,
    signal: (id) => `BSIG-${suffix}-${id.toUpperCase().replaceAll('_', '-')}`,
  };
}
export function buildAnalyticsObjects(context, raw) {
  const baseline = raw.baseline_summary ?? null;
  const { plan, cycle, pins } = context,
    ids = objectIds(cycle, raw.window, raw.attempt),
    prior =
      raw.attempt > 1 ? objectIds(cycle, raw.window, raw.attempt - 1) : null;
  const common = {
    merchant_ref: plan.merchant_ref,
    cycle_ref: cycle.data.id,
    goal_ref: plan.goal_ref,
    run_ref: ids.run,
    execution_scope: 'authorized_real',
    causal_claim: false,
  };
  const extension = {
    'geo.real_analytics': {
      window_id: raw.window.id,
      attempt: raw.attempt,
      binding_sha256: raw.binding_sha256,
      raw_sha256: digest(raw),
    },
  };
  const policy = pins.sensitive_data_policy;
  const objects = [],
    observationByKind = {};
  for (const kind of ['ga4', 'gsc']) {
    const metricIds =
      kind === 'ga4'
        ? ['ai_visits', 'ai_registration_events']
        : ['gsc_clicks', 'gsc_impressions'];
    const metrics = metricIds.map((id) => {
      const [source, unit] = METRICS[id],
        result = raw.sources[source],
        period = raw.calendars[kind],
        value = metricValue(raw, id);
      return {
        metric_id: id,
        definition: pins.measurement_contract.data.metrics.find(
          (m) => m.metric_id === id,
        ).definition,
        value,
        unit,
        dimensions: {
          window: raw.window.id,
          time_zone: period?.time_zone ?? 'unknown',
          start_date: period?.start_date ?? null,
          end_date: period?.end_date ?? null,
        },
        state:
          value === null
            ? 'unavailable'
            : result.data.warnings.length
              ? 'partial'
              : 'observed',
        limitation: LIMITATION,
      };
    });
    const warnings = [
      ...new Set(
        metricIds.flatMap((id) => {
          const s = raw.sources[METRICS[id][0]];
          return s.status === 'ok' ? s.data.warnings : [s.error];
        }),
      ),
    ];
    const data = {
      ...realObject(
        ids.observation(kind),
        'analytics_observation',
        'recorded',
        `${raw.window.id} ${kind.toUpperCase()} real aggregates`,
        raw.captured_at,
      ),
      ...common,
      adapter: {
        kind,
        name: 'geo-real-cycle-analytics',
        version: '1.0.0',
        access_mode: 'read_only',
        authorization_ref: plan.authorization.ref,
      },
      measurement_contract: pins.measurement_contract.pin,
      sensitive_data_policy: {
        id: policy.data.id,
        version: policy.pin.version,
        artifact_entry_key: policy.pin.artifact_entry_key,
        sha256: policy.pin.sha256,
      },
      time_window: {
        starts_at: raw.window.starts_at,
        ends_at: raw.window.ends_at,
        as_of: raw.captured_at,
      },
      metrics,
      artifacts: [
        {
          path: 'raw/analytics.json',
          sha256: digest(raw),
          media_type: 'application/json',
        },
      ],
      quality: {
        completeness: metrics.every((m) => m.state === 'unavailable')
          ? 'unavailable'
          : metrics.every((m) => m.state === 'observed')
            ? 'complete'
            : 'partial',
        warnings,
      },
      extensions: extension,
      ...(prior ? { supersedes_ref: prior.observation(kind) } : {}),
    };
    observationByKind[kind] = data;
    objects.push(data);
  }
  for (const [id, [source, unit, signalKind]] of Object.entries(METRICS)) {
    const kind = source === 'gsc' ? 'gsc' : 'ga4',
      currentValue = metricValue(raw, id),
      baseValue = baseline ? metricValue(baseline, id) : currentValue;
    const currentPeriod = raw.calendars[kind],
      basePeriod = baseline?.calendars[kind] ?? currentPeriod;
    const partial =
      !!raw.sources[source]?.data?.warnings.length ||
      !!baseline?.sources[source]?.data?.warnings.length;
    const calculation =
      raw.window.id === 'PRE28'
        ? {
            value: currentValue,
            state:
              currentValue === null
                ? 'unavailable'
                : partial
                  ? 'insufficient_data'
                  : currentValue === 0
                    ? 'no_signal'
                    : 'signal_observed',
          }
        : compareAnalyticsMetric(
            currentValue,
            baseValue,
            currentPeriod ? dayCount(currentPeriod) : 0,
            basePeriod ? dayCount(basePeriod) : 0,
            partial,
          );
    const baseId =
      baseline &&
      objectIds(cycle, baseline.window, baseline.attempt).observation(kind);
    const data = {
      ...realObject(
        ids.signal(id),
        'business_signal',
        'computed',
        `${raw.window.id} ${id} observed comparison`,
        raw.captured_at,
      ),
      ...common,
      measurement_contract: pins.measurement_contract.pin,
      observation_versions: [
        { ref: observationByKind[kind].id, version: '1.0.0' },
        ...(raw.window.id !== 'PRE28' && baseId
          ? [{ ref: baseId, version: '1.0.0' }]
          : []),
      ],
      rule: { id: pins.signal_rule.data.id, ...pins.signal_rule.pin },
      signal_kind: signalKind,
      denominator: {
        definition:
          'Baseline observed daily mean; absolute difference, not a conversion rate or percentage lift.',
        value:
          baseValue === null || !basePeriod
            ? null
            : baseValue / dayCount(basePeriod),
        state:
          baseValue === null ? 'unknown' : baseValue === 0 ? 'zero' : 'known',
      },
      calculation: {
        ...calculation,
        unit: raw.window.id === 'PRE28' ? unit : `${unit}/day difference`,
        explanation: `${raw.window.id === 'PRE28' ? 'Baseline aggregate.' : 'Current daily mean minus PRE28 daily mean.'} ${LIMITATION}`,
      },
      extensions: extension,
      ...(prior ? { supersedes_ref: prior.signal(id) } : {}),
    };
    objects.push(data);
  }
  return objects;
}
async function materialize(workspace, context, raw) {
  const { plan, cycle } = context,
    ids = objectIds(cycle, raw.window, raw.attempt),
    objects = [];
  for (const data of buildAnalyticsObjects(context, raw))
    objects.push(await putObject(workspace, 'cycles/m6/analytics', data));
  const run = (await readRun({ workspace, runId: ids.run })).data;
  if (run.status !== 'completed')
    await transitionRun({
      workspace,
      runId: ids.run,
      status: 'completed',
      now: raw.captured_at,
      patch: {
        completed_steps: [
          'authorized_readonly_observation',
          'noncausal_comparison',
        ],
        output_artifacts: ['raw/analytics.json'],
        execution_scope: 'authorized_real',
        merchant_ref: plan.merchant_ref,
        cycle_ref: cycle.data.id,
        next_action: 'wait for next mature window or review limitations',
      },
    });
  return objects;
}
async function analyticsContext(workspace) {
  const context = await realContext(workspace),
    { plan, graph, cycle } = context;
  requireReal(
    cycle,
    'CYCLE_REQUIRED',
    'Freeze the real cycle before Analytics',
  );
  const resolved = await resolveAnalyticsPins(workspace, plan, graph, cycle);
  const schedule = await jsonAt(
    workspace,
    `${plan.cycle_dir}/schedule.json`,
    null,
  );
  requireReal(
    schedule?.cycle_ref === cycle.data.id,
    'OBSERVATION_WINDOW_PENDING',
    'Publication and technical retest schedule required',
  );
  const pubs = cycle.data.goal_tracks[0].publication_refs.map(
    (id) => graph.byId.get(id)?.data,
  );
  requireReal(
    pubs.length &&
      pubs.every(
        (p) =>
          p?.record_type === 'asset_publication' &&
          Number.isFinite(Date.parse(p.published_at)),
      ),
    'ANALYTICS_PUBLICATION_REQUIRED',
    'Actual publication receipts required',
  );
  const publicationAt = new Date(
    Math.max(...pubs.map((p) => Date.parse(p.published_at))),
  ).toISOString();
  return {
    ...context,
    ...resolved,
    schedule,
    windows: analyticsWindows(publicationAt, schedule),
  };
}
export async function collectAnalyticsWindow(
  workspace,
  context,
  window,
  request,
  now,
  baseline,
  retryUnavailable,
) {
  requireReal(
    now instanceof Date &&
      Number.isFinite(now.getTime()) &&
      now.getTime() <= Date.now(),
    'ANALYTICS_WINDOW_INVALID',
    'Analytics cannot capture a future instant',
  );
  await assertRealAuthorization(workspace, context.plan, now);
  const { plan, cycle, pins, schedule, freeze } = context,
    ai = plan.analytics;
  const calendars = {
    ga4:
      ai.property_time_zone === null
        ? null
        : analyticsCalendarWindow(window, schedule, ai.property_time_zone),
    gsc: analyticsCalendarWindow(window, schedule, GSC_ZONE),
  };
  if (
    Date.parse(window.ends_at) > now.getTime() ||
    !Object.values(calendars).every((p) => mature(p, now, ai.final_lag_days))
  )
    return null;
  requireReal(
    window.id === 'PRE28' || baseline?.window?.id === 'PRE28',
    'ANALYTICS_BASELINE_REQUIRED',
    'A recorded PRE28 baseline is required for weekly comparison',
  );
  const registration = await registrationDefinition(
    workspace,
    plan,
    freeze,
    now,
  );
  const binding = {
    cycle_ref: cycle.data.id,
    goal_ref: plan.goal_ref,
    freeze: cycle.data.core_versions.input_snapshot,
    contracts: Object.fromEntries(
      Object.entries(pins).map(([k, v]) => [k, v.pin]),
    ),
    analytics: ai,
    window,
    calendars,
    registration_event: registration.event,
  };
  const bindingSha = digest(binding),
    statePath = `${plan.cycle_dir}/analytics/${window.id}/state.json`;
  let state = await jsonAt(workspace, statePath, null);
  requireReal(
    !state || state.binding_sha256 === bindingSha,
    'ANALYTICS_ARTIFACT_CONFLICT',
    'Existing window binding differs from frozen inputs',
  );
  let raw = state?.raw_path ? await jsonAt(workspace, state.raw_path) : null;
  if (raw) {
    requireReal(
      digest(raw) === state.raw_sha256 && raw.binding_sha256 === bindingSha,
      'ANALYTICS_ARTIFACT_CONFLICT',
      'Persisted Analytics artifact changed',
    );
    // Finish any interrupted materialization before creating immutable successors.
    const existingObjects = await materialize(workspace, context, raw);
    const failed = Object.values(raw.sources).some(
      (s) => s.status === 'unavailable' && s.retryable,
    );
    const baselineChanged =
      raw.baseline_sha256 !== (baseline ? digest(baseline) : null);
    if (
      (!retryUnavailable ||
        !failed ||
        now.getTime() < Date.parse(state.retry_after_at)) &&
      !baselineChanged
    )
      return {
        raw,
        objects: existingObjects,
      };
    state = {
      binding_sha256: bindingSha,
      attempt: state.attempt + 1,
      started_at: now.toISOString(),
      sources: Object.fromEntries(
        Object.entries(raw.sources).filter(
          ([, s]) => s.status === 'ok' || !s.retryable,
        ),
      ),
      raw_path: null,
    };
  }
  state ??= {
    binding_sha256: bindingSha,
    attempt: 1,
    started_at: now.toISOString(),
    sources: {},
    raw_path: null,
  };
  const ids = objectIds(cycle, window, state.attempt);
  await ensureJourneyRun(
    workspace,
    ids.run,
    {
      [cycle.data.id]: cycle.data.version,
      [plan.goal_ref]: context.goal.object_version,
    },
    undefined,
    state.started_at,
    'geo-analytics',
  );
  await atomicWrite(workspace, statePath, stableStringify(state, 2));
  // A missing timezone is a known data gap, never silently UTC. GSC can proceed.
  const requests = buildCycleAnalyticsRequests({
    propertyId: ai.property_id,
    siteUrl: ai.site_url,
    window: calendars.ga4 ?? calendars.gsc,
    gscWindow: calendars.gsc,
    registrationEvent: registration.event,
  });
  for (const source of ['ga4', 'registration', 'gsc']) {
    if (state.sources[source]) continue;
    let result;
    if (source !== 'gsc' && !calendars.ga4)
      result = {
        status: 'unavailable',
        retryable: false,
        error: 'GA4_TIMEZONE_UNCONFIRMED',
      };
    else if (source === 'registration' && !registration.event)
      result = {
        status: 'unavailable',
        retryable: false,
        error: registration.warning,
      };
    else
      try {
        const data =
          source === 'gsc'
            ? normalizeGscReport(await request(requests.gsc), calendars.gsc)
            : await readAiReport(
                request,
                requests[source],
                calendars.ga4,
                ai.property_time_zone,
              );
        requireReal(
          Buffer.byteLength(stableStringify(data)) <=
            pins.sensitive_data_policy.data.max_input_bytes / 3,
          'ANALYTICS_RESPONSE_PARTIAL',
          'Aggregate report exceeds policy size',
        );
        result = { status: 'ok', data, collected_at: now.toISOString() };
      } catch (error) {
        result = {
          status: 'unavailable',
          retryable: true,
          error: safeError(error),
        };
      }
    state.sources[source] = result;
    await atomicWrite(workspace, statePath, stableStringify(state, 2));
  }
  raw = {
    schema_version: 'geo-real-cycle-analytics-v1',
    binding_sha256: bindingSha,
    binding,
    attempt: state.attempt,
    captured_at: now.toISOString(),
    window,
    calendars,
    sources: state.sources,
    baseline_sha256: baseline ? digest(baseline) : null,
    baseline_summary: baseline
      ? {
          window: baseline.window,
          attempt: baseline.attempt,
          calendars: baseline.calendars,
          sources: Object.fromEntries(
            Object.entries(baseline.sources).map(([k, v]) => [
              k,
              v.status === 'ok' ? { ...v, data: { ...v.data, rows: [] } } : v,
            ]),
          ),
        }
      : null,
    limitations: [
      LIMITATION,
      'Three or more full calendar days of settling lag reduces freshness risk but is not a completeness guarantee. Missing GSC dates are omitted by the API and remain a coverage limitation.',
    ],
    causal_claim: false,
  };
  requireReal(
    Buffer.byteLength(stableStringify(raw, 2)) <=
      pins.sensitive_data_policy.data.max_input_bytes,
    'ANALYTICS_RESPONSE_PARTIAL',
    'Aggregate artifact exceeds frozen policy',
  );
  const rawPath = `runs/${ids.run}/raw/analytics.json`;
  const existing = await jsonAt(workspace, rawPath, null);
  if (existing) {
    requireReal(
      existing.binding_sha256 === bindingSha &&
        equal(existing.sources, state.sources),
      'ANALYTICS_ARTIFACT_CONFLICT',
      'Interrupted artifact differs',
    );
    raw = existing;
  } else await putJson(workspace, rawPath, raw);
  state = {
    ...state,
    raw_path: rawPath,
    raw_sha256: digest(raw),
    retry_after_at: new Date(
      Date.parse(raw.captured_at) + 6 * 3600000,
    ).toISOString(),
  };
  await atomicWrite(workspace, statePath, stableStringify(state, 2));
  return { raw, objects: await materialize(workspace, context, raw, baseline) };
}
export async function collectCycleAnalytics(
  workspace,
  { request, retryUnavailable = true } = {},
) {
  const context = await analyticsContext(workspace);
  await assertRealAuthorization(workspace, context.plan);
  const lockDirectory = `${context.plan.cycle_dir}/analytics`;
  await assertNoSymlinkPath(workspace, lockDirectory, {
    allowMissingLeaf: true,
  });
  return withJourneyLock(resolveWithin(workspace, lockDirectory), async () => {
    const objects = [],
      now = new Date();
    let baseline = null;
    const requester = request ?? googleRequester();
    for (const window of context.windows) {
      const result = await collectAnalyticsWindow(
        workspace,
        context,
        window,
        requester,
        now,
        baseline,
        retryUnavailable,
      );
      if (!result) continue;
      if (window.id === 'PRE28') baseline = result.raw;
      objects.push(...result.objects);
    }
    return objects;
  });
}
export async function validateAnalyticsMatrix(
  workspace,
  context,
  inputObjects,
  now = new Date(),
) {
  const { plan, cycle, pins, schedule, windows } = context;
  const objects = inputObjects.map((o) => o.data ?? o);
  const expectedCalendars = new Map(
    windows.map((window) => [
      window.id,
      {
        ga4:
          plan.analytics.property_time_zone === null
            ? null
            : analyticsCalendarWindow(
                window,
                schedule,
                plan.analytics.property_time_zone,
              ),
        gsc: analyticsCalendarWindow(window, schedule, GSC_ZONE),
      },
    ]),
  );
  requireReal(
    windows.every(
      (window) =>
        Date.parse(window.ends_at) <= now.getTime() &&
        Object.values(expectedCalendars.get(window.id)).every((period) =>
          mature(period, now, plan.analytics.final_lag_days),
        ),
    ),
    'OBSERVATION_WINDOW_PENDING',
    'All PRE28/W1–W4 source calendar windows and settling periods must elapse',
  );
  requireReal(
    objects.filter((o) =>
      ['analytics_observation', 'business_signal'].includes(o.record_type),
    ).length === 30,
    'ANALYTICS_MATRIX_INCOMPLETE',
    'Exactly ten observations and twenty metric signals are required',
  );
  let baseline = null;
  for (const window of windows) {
    const state = await jsonAt(
      workspace,
      `${plan.cycle_dir}/analytics/${window.id}/state.json`,
      null,
    );
    requireReal(
      state?.raw_path &&
        Number.isSafeInteger(state.attempt) &&
        state.attempt >= 1,
      'ANALYTICS_MATRIX_INCOMPLETE',
      'Missing Analytics window',
    );
    const raw = await jsonAt(workspace, state.raw_path),
      ids = objectIds(cycle, window, state.attempt);
    requireReal(
      state.raw_path === `runs/${ids.run}/raw/analytics.json` &&
        raw.attempt === state.attempt &&
        digest(raw) === state.raw_sha256 &&
        digest(raw.binding) === raw.binding_sha256 &&
        raw.binding_sha256 === state.binding_sha256 &&
        raw.binding.cycle_ref === cycle.data.id &&
        raw.binding.goal_ref === plan.goal_ref &&
        equal(raw.window, window) &&
        equal(raw.binding.window, window) &&
        equal(raw.calendars, expectedCalendars.get(window.id)) &&
        equal(raw.binding.calendars, raw.calendars) &&
        equal(raw.binding.freeze, cycle.data.core_versions.input_snapshot) &&
        equal(raw.binding.analytics, plan.analytics) &&
        Number.isFinite(Date.parse(raw.captured_at)) &&
        Date.parse(raw.captured_at) <= now.getTime() &&
        Date.parse(raw.captured_at) >= Date.parse(window.ends_at) &&
        Object.values(raw.calendars).every((period) =>
          mature(
            period,
            new Date(raw.captured_at),
            plan.analytics.final_lag_days,
          ),
        ) &&
        equal(
          raw.binding.contracts,
          Object.fromEntries(Object.entries(pins).map(([k, v]) => [k, v.pin])),
        ),
      'ANALYTICS_ARTIFACT_CONFLICT',
      'Analytics raw binding changed',
    );
    requireReal(
      raw.baseline_sha256 === (baseline ? digest(baseline) : null),
      'ANALYTICS_BASELINE_DRIFT',
      'Weekly signals must use the latest exact PRE28 evidence',
    );
    if (window.id === 'PRE28') baseline = raw;
    for (const expected of buildAnalyticsObjects(context, raw)) {
      const matches = objects.filter((o) => o.id === expected.id);
      requireReal(
        matches.length === 1 && equal(matches[0], expected),
        'ANALYTICS_MATRIX_INCOMPLETE',
        'Full exact latest Analytics observation/signal matrix required',
      );
    }
  }
  return true;
}
export async function assertRealAnalyticsGate(workspace, inputObjects) {
  return validateAnalyticsMatrix(
    workspace,
    await analyticsContext(workspace),
    inputObjects,
  );
}
