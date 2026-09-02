const FORBIDDEN_HEADERS = new Set([
  'email', 'phone', 'ip', 'ip_address', 'cookie', 'authorization', 'token', 'secret',
  'password', 'user_id', 'request_id', 'event_id', 'session_id', 'account_id',
]);
const REQUIRED_METADATA = [
  'merchant_ref', 'starts_at', 'ends_at', 'as_of', 'owner_role',
  'source_locator', 'authorization_ref',
];

export class AnalyticsObservationInputError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AnalyticsObservationInputError';
    this.code = code;
    Object.assign(this, details);
  }
}

function round(value) {
  return Number(value.toFixed(12));
}

function metric(metricId, definition, value, unit, source) {
  return {
    metric_id: metricId,
    definition,
    value: Number.isFinite(value) ? round(value) : null,
    unit,
    dimensions: { source },
    state: Number.isFinite(value) ? 'observed' : 'unavailable',
    limitation: Number.isFinite(value) ? null : 'No rows in the authorized window.',
    causal_claim: false,
  };
}

function sumRows(rows, key) {
  return rows.reduce((total, row) => total + Number(row.metrics?.[key] ?? 0), 0);
}

export function normalizeReadonlyResultToMetrics(result) {
  if (result?.schema_version !== 'ga4-gsc-readonly-result/1.0.0'
      || result.causal_claim !== false
      || !result.sources?.ga4 || !result.sources?.gsc) {
    throw new AnalyticsObservationInputError(
      'READONLY_RESPONSE_INVALID',
      'GA4/GSC normalized result contract invalid',
    );
  }
  const ga4Rows = result.sources.ga4.rows ?? [];
  const gscRows = result.sources.gsc.rows ?? [];
  const clicks = sumRows(gscRows, 'clicks');
  const impressions = sumRows(gscRows, 'impressions');
  const weightedPosition = impressions === 0
    ? Number.NaN
    : gscRows.reduce((total, row) =>
      total + Number(row.metrics?.position ?? 0) * Number(row.metrics?.impressions ?? 0), 0)
      / impressions;
  return [
    metric('ga4_sessions', 'GA4 sessions in the authorized window.', sumRows(ga4Rows, 'sessions'), 'sessions', 'ga4'),
    metric('ga4_active_users', 'GA4 active users in the authorized window.', sumRows(ga4Rows, 'activeUsers'), 'users', 'ga4'),
    metric('ga4_screen_page_views', 'GA4 screen/page views in the authorized window.', sumRows(ga4Rows, 'screenPageViews'), 'views', 'ga4'),
    metric('gsc_clicks', 'GSC clicks in the authorized window.', clicks, 'clicks', 'gsc'),
    metric('gsc_impressions', 'GSC impressions in the authorized window.', impressions, 'impressions', 'gsc'),
    metric('gsc_ctr', 'GSC aggregate clicks divided by impressions.', impressions === 0 ? Number.NaN : clicks / impressions, 'ratio', 'gsc'),
    metric('gsc_weighted_position', 'GSC position weighted by impressions.', weightedPosition, 'position', 'gsc'),
  ];
}

function assertMetadata(metadata) {
  if (!metadata || REQUIRED_METADATA.some((field) =>
    typeof metadata[field] !== 'string' || metadata[field].trim() === '')) {
    throw new AnalyticsObservationInputError(
      'BUSINESS_FILE_METADATA_INVALID',
      'Business file metadata incomplete',
    );
  }
  if (!/^MER-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(metadata.merchant_ref)
      || !Number.isFinite(Date.parse(metadata.starts_at))
      || !Number.isFinite(Date.parse(metadata.ends_at))
      || !Number.isFinite(Date.parse(metadata.as_of))) {
    throw new AnalyticsObservationInputError(
      'BUSINESS_FILE_METADATA_INVALID',
      'Business file merchant/time metadata invalid',
    );
  }
}

function piiIn(value) {
  return typeof value === 'string' && (
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(value)
    || /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(value)
    || /(?:api[_-]?key|access[_-]?token|authorization|cookie|password|secret)\s*[:=]/i.test(value)
  );
}

function parseCsvLine(line) {
  const cells = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  if (quoted) throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'Unclosed CSV quote');
  cells.push(value);
  return cells;
}

function parseCsv(bytes) {
  const lines = bytes.toString('utf8').trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'CSV requires header and rows');
  }
  const headers = parseCsvLine(lines[0]).map((value) => value.trim());
  if (!['metric_id', 'value', 'unit'].every((field) => headers.includes(field))) {
    throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'CSV aggregate fields missing');
  }
  const forbidden = headers.find((header) => FORBIDDEN_HEADERS.has(header.toLowerCase()));
  if (forbidden) {
    const code = ['request_id', 'event_id', 'user_id', 'session_id', 'account_id'].includes(forbidden)
      ? 'BUSINESS_FILE_ROW_LEVEL_FORBIDDEN' : 'BUSINESS_FILE_PII_DETECTED';
    throw new AnalyticsObservationInputError(code, `Forbidden business file field: ${forbidden}`);
  }
  return lines.slice(1).map((line, index) => {
    const cells = parseCsvLine(line);
    if (cells.length !== headers.length || cells.some(piiIn)) {
      throw new AnalyticsObservationInputError('BUSINESS_FILE_PII_DETECTED', 'Business file contains PII', { index });
    }
    return Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex]]));
  });
}

function parseJson(bytes) {
  let value;
  try {
    value = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'JSON cannot be parsed');
  }
  if (value?.schema_version !== 'business-aggregate/1.0.0' || !Array.isArray(value.metrics)) {
    throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'JSON aggregate contract invalid');
  }
  return value.metrics;
}

export function normalizeBusinessFileInput({ bytes, format, metadata }) {
  assertMetadata(metadata);
  if (!Buffer.isBuffer(bytes) || bytes.length === 0 || bytes.length > 65_536) {
    throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'Business file size invalid');
  }
  const rows = format === 'csv' ? parseCsv(bytes) : format === 'json' ? parseJson(bytes) : null;
  if (!rows) throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'Only JSON/CSV supported');
  const metrics = rows.map((row, index) => {
    if (!row || typeof row.metric_id !== 'string' || typeof row.unit !== 'string') {
      throw new AnalyticsObservationInputError('BUSINESS_FILE_FORMAT_INVALID', 'Metric row incomplete', { index });
    }
    const value = Number(row.value);
    if (!Number.isFinite(value) || piiIn(row.metric_id) || piiIn(row.unit)) {
      throw new AnalyticsObservationInputError('BUSINESS_FILE_PII_DETECTED', 'Metric row invalid', { index });
    }
    const dimensions = Object.fromEntries(Object.entries(row)
      .filter(([key]) => !['metric_id', 'value', 'unit'].includes(key))
      .map(([key, item]) => [key, item]));
    if (Object.keys(dimensions).length > 8) {
      throw new AnalyticsObservationInputError('BUSINESS_FILE_ROW_LEVEL_FORBIDDEN', 'Too many dimensions');
    }
    return {
      metric_id: row.metric_id,
      definition: `Authorized aggregate business metric: ${row.metric_id}.`,
      value,
      unit: row.unit,
      dimensions,
      state: 'observed',
      limitation: 'Correlation only; no GEO causality is asserted.',
      causal_claim: false,
    };
  });
  return {
    schema_version: 'business-observation-input/1.0.0',
    merchant_ref: metadata.merchant_ref,
    time_window: {
      starts_at: metadata.starts_at,
      ends_at: metadata.ends_at,
      as_of: metadata.as_of,
    },
    owner_role: metadata.owner_role,
    source_locator: metadata.source_locator,
    authorization_ref: metadata.authorization_ref,
    metrics,
    causal_claim: false,
  };
}
