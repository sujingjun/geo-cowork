import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { resolveWithin, stableStringify } from './workspace-paths.mjs';

function securityError(code, message, details = {}) {
  const error = new Error(message);
  error.name = 'AnalyticsSecurityError';
  error.code = code;
  Object.assign(error, details);
  return error;
}

function forbiddenKey(key, policy) {
  return policy.forbidden_field_patterns.some((pattern) =>
    key.toLowerCase().includes(pattern.toLowerCase()));
}

function forbiddenScalar(value) {
  if (typeof value !== 'string') return false;
  return /(?:api[_-]?key|access[_-]?token|authorization|cookie|password|secret)\s*[:=]/i.test(value)
    || /(?:^|\s)\+?\d{1,3}[\s-]+\d{3}[\s-]+\d{3}[\s-]+\d{4}(?:\s|$)/.test(value)
    || /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(value);
}

function validateDimensions(value, policy, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'dimensions 必须是 scalar map', { path: label });
  }
  for (const [key, item] of Object.entries(value)) {
    if (key.toLowerCase().includes('email')
        || typeof item === 'string' && /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(item)) {
      throw securityError('ANALYTICS_PII_DETECTED', 'Analytics fixture 检测到 PII', {
        path: `${label}.${key}`,
      });
    }
    if (forbiddenKey(key, policy) || forbiddenScalar(item)
        || item !== null && !['string', 'number', 'boolean'].includes(typeof item)) {
      throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'Analytics dimensions 字段不允许', {
        path: `${label}.${key}`,
      });
    }
  }
}

function validateShape(input, policy) {
  if (Buffer.isBuffer(input) || !input || typeof input !== 'object' || Array.isArray(input)) {
    throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'Analytics 输入必须是可扫描 JSON object');
  }
  const top = new Set(['schema_version', 'time_window', 'metrics']);
  if (Object.keys(input).some((key) => !top.has(key) || forbiddenKey(key, policy))) {
    throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'Analytics 顶层字段不允许');
  }
  if (input.schema_version !== 'm6-fixture-analytics/1.0.0'
      || !input.time_window || !Array.isArray(input.metrics) || input.metrics.length === 0) {
    throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'Analytics fixture 合同不完整');
  }
  const timeFields = new Set(['starts_at', 'ends_at', 'as_of']);
  if (Object.keys(input.time_window).some((key) => !timeFields.has(key))) {
    throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'time_window 字段不允许');
  }
  for (const [index, metric] of input.metrics.entries()) {
    const fields = new Set(['metric_id', 'value', 'unit', 'dimensions']);
    if (!metric || Object.keys(metric).some((key) => !fields.has(key))
        || typeof metric.metric_id !== 'string'
        || metric.value !== null && typeof metric.value !== 'number'
        || typeof metric.unit !== 'string') {
      throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'metric 字段或类型不允许', { index });
    }
    validateDimensions(metric.dimensions, policy, `metrics[${index}].dimensions`);
  }
}

export async function validateFixtureAnalyticsInput({ workspace, input, inputPath, policyPath }) {
  const root = path.resolve(workspace);
  const policy = JSON.parse(await readFile(resolveWithin(root, policyPath), 'utf8'));
  const value = inputPath
    ? JSON.parse(await readFile(resolveWithin(root, inputPath), 'utf8'))
    : input;
  const bytes = inputPath
    ? await readFile(resolveWithin(root, inputPath))
    : Buffer.isBuffer(value) ? value : Buffer.from(stableStringify(value, 2));
  if (bytes.length > policy.max_input_bytes) {
    throw securityError('ANALYTICS_FIELD_NOT_ALLOWED', 'Analytics 输入超过 policy 大小限制');
  }
  validateShape(value, policy);
  return { ok: true, input: value, bytes, policy };
}
