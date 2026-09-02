import { lstat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv2020 from 'ajv/dist/2020.js';
import matter from 'gray-matter';

import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  compareUtf8,
  resolveWithin,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = path.resolve(SCRIPT_DIR, '..', '..', 'schemas');

async function loadSchema(name) {
  return JSON.parse(await readFile(path.join(SCHEMA_DIR, name), 'utf8'));
}

const COMMON = await loadSchema('common-object.schema.json');
const M2 = await loadSchema('m2-record-types.schema.json');
const M3 = await loadSchema('m3-record-types.schema.json');
const M4 = await loadSchema('m4-record-types.schema.json');
const M5 = await loadSchema('m5-record-types.schema.json');
const M6 = await loadSchema('m6-record-types.schema.json');
const M7 = await loadSchema('m7-record-types.schema.json');
const M8 = await loadSchema('m8-record-types.schema.json');

export class ObjectContractError extends Error {
  constructor(code, message, diagnostics = []) {
    super(message);
    this.name = 'ObjectContractError';
    this.code = code;
    this.diagnostics = diagnostics;
  }
}

function mergeDefinitions() {
  const definitions = new Map();
  for (const schema of [M2, M3, M4, M5, M6, M7, M8]) {
    for (const [recordType, definition] of Object.entries(schema.$defs)) {
      const prior = definitions.get(recordType);
      const existing = prior ?? {
        required: [],
        properties: {},
        statuses: [],
        idPrefix: null,
        allOf: [],
      };
      definitions.set(recordType, {
        required: prior
          ? existing.required
          : [...new Set(definition.required ?? [])],
        properties: { ...existing.properties, ...(definition.properties ?? {}) },
        statuses: definition['x-statuses'] ?? existing.statuses,
        idPrefix: definition['x-id-prefix'] ?? existing.idPrefix,
        allOf: [...existing.allOf, ...(definition.allOf ?? [])],
      });
    }
  }
  return definitions;
}

function localizeCommonRefs(value) {
  if (Array.isArray(value)) return value.map(localizeCommonRefs);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key,
      key === '$ref' && typeof item === 'string'
        ? item.replace(/^common#\//, '#/')
        : localizeCommonRefs(item),
    ]));
  }
  return value;
}

const DEFINITIONS = mergeDefinitions();
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  strictRequired: false,
  allowUnionTypes: true,
});
ajv.addSchema({ ...COMMON, $id: 'common' });

const VALIDATORS = new Map();
for (const [recordType, definition] of DEFINITIONS.entries()) {
  VALIDATORS.set(recordType, ajv.compile({
    $id: `geo-cowork:${recordType}`,
    $defs: COMMON.$defs,
    type: 'object',
    required: [...COMMON.$defs.common.required, ...definition.required],
    properties: {
      ...localizeCommonRefs(COMMON.$defs.common.properties),
      ...localizeCommonRefs(definition.properties),
      record_type: { const: recordType },
      status: { enum: definition.statuses },
    },
    ...(definition.allOf.length > 0
      ? { allOf: localizeCommonRefs(definition.allOf) }
      : {}),
    additionalProperties: false,
  }));
}

export const RECORD_TYPES = Object.freeze([...DEFINITIONS.keys()].sort());

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /(?:api[_-]?key|access[_-]?token|token|authorization|cookie)\s*[:=]\s*(?:bearer\s+)?["']?[A-Za-z0-9_./+-]{12,}/i,
];

function normalizeYaml(value) {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeYaml);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, normalizeYaml(item)]),
    );
  }
  return value;
}

function sanitizedAjvDiagnostics(pathLabel, errors = []) {
  return errors.map((error) => ({
    code: 'INVALID_FRONTMATTER',
    path: pathLabel,
    field: error.instancePath || '/',
    keyword: error.keyword,
    message: error.message,
  }));
}

function isValidRfc3339(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute, second, , offsetHour = '00', offsetMinute = '00'] = match;
  const numeric = [year, month, day, hour, minute, second, offsetHour, offsetMinute].map(Number);
  const [y, mo, d, h, mi, s, oh, om] = numeric;
  const lastDay = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  return mo >= 1 && mo <= 12 && d >= 1 && d <= lastDay
    && h <= 23 && mi <= 59 && s <= 59 && oh <= 23 && om <= 59
    && !Number.isNaN(Date.parse(value));
}

function validateDateFields(data, pathLabel) {
  const fields = [
    ['created_at', data.created_at],
    ['updated_at', data.updated_at],
    ['captured_at', data.captured_at],
    ['frozen_at', data.frozen_at],
    ['published_at', data.published_at],
    ['approval.approved_at', data.approval?.approved_at],
  ];
  for (const [field, value] of fields) {
    if (value !== undefined && !isValidRfc3339(value)) {
      throw new ObjectContractError('INVALID_DATETIME', `RFC3339 时间非法（${pathLabel}）`, [{
        code: 'INVALID_DATETIME', path: pathLabel, field: `/${field.replace('.', '/')}`,
      }]);
    }
  }
}

export function validateObjectData(input, { path: pathLabel = '<memory>' } = {}) {
  const data = normalizeYaml(input);
  const definition = DEFINITIONS.get(data?.record_type);
  if (!definition) {
    throw new ObjectContractError('UNKNOWN_RECORD_TYPE', `未注册的 record_type（${pathLabel}）`, [{
      code: 'UNKNOWN_RECORD_TYPE',
      path: pathLabel,
      field: '/record_type',
    }]);
  }
  const validate = VALIDATORS.get(data.record_type);
  if (!validate(data)) {
    throw new ObjectContractError(
      'INVALID_FRONTMATTER',
      `Frontmatter 不符合对象契约（${pathLabel}）`,
      sanitizedAjvDiagnostics(pathLabel, validate.errors),
    );
  }
  validateDateFields(data, pathLabel);
  if (!data.id.startsWith(definition.idPrefix)) {
    throw new ObjectContractError('INVALID_FRONTMATTER', `stable ID 前缀错误（${pathLabel}）`, [{
      code: 'INVALID_FRONTMATTER', path: pathLabel, field: '/id',
    }]);
  }
  if (Date.parse(data.created_at) > Date.parse(data.updated_at)) {
    throw new ObjectContractError('INVALID_TIME_ORDER', `对象时间顺序非法（${pathLabel}）`, [{
      code: 'INVALID_TIME_ORDER', path: pathLabel, field: '/updated_at',
    }]);
  }
  if (data.record_type === 'finding' && data.item_state === 'observed'
      && (data.evidence_refs?.length ?? 0) === 0) {
    throw new ObjectContractError('INVALID_FRONTMATTER', `observed Finding 缺少 Evidence（${pathLabel}）`, [{
      code: 'INVALID_FRONTMATTER', path: pathLabel, field: '/evidence_refs',
    }]);
  }
  if (data.record_type === 'run') {
    const refs = [...data.input_refs].sort();
    const versionEntries = Object.entries(data.input_versions).sort(([a], [b]) => compareUtf8(a, b));
    const versionRefs = versionEntries.map(([ref]) => ref);
    if (stableStringify(refs) !== stableStringify(versionRefs)) {
      throw new ObjectContractError('INVALID_INPUT_VERSIONS', `Run input_refs 与 input_versions 不一致（${pathLabel}）`, [{
        code: 'INVALID_INPUT_VERSIONS', path: pathLabel, field: '/input_versions',
      }]);
    }
    if (sha256(stableStringify(Object.fromEntries(versionEntries))) !== data.input_fingerprint) {
      throw new ObjectContractError('INVALID_INPUT_FINGERPRINT', `Run input_fingerprint 不一致（${pathLabel}）`, [{
        code: 'INVALID_INPUT_FINGERPRINT', path: pathLabel, field: '/input_fingerprint',
      }]);
    }
  }
  if (data.record_type === 'evidence') assertSafeRelativePath(data.snapshot.path);
  for (const artifact of data.output_artifacts ?? []) assertSafeRelativePath(artifact);
  return data;
}

export function parseMarkdownObjectText(text, { path: pathLabel = '<memory>' } = {}) {
  const lines = text.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    if (SECRET_PATTERNS.some((pattern) => pattern.test(line))) {
      throw new ObjectContractError('SECRET_MARKER', `检测到敏感标记（${pathLabel}:${index + 1}）`, [{
        code: 'SECRET_MARKER', path: pathLabel, line: index + 1,
      }]);
    }
  }
  let parsed;
  try {
    parsed = matter(text);
  } catch {
    throw new ObjectContractError('INVALID_FRONTMATTER', `Frontmatter 无法解析（${pathLabel}）`, [{
      code: 'INVALID_FRONTMATTER', path: pathLabel,
    }]);
  }
  const data = validateObjectData(parsed.data, { path: pathLabel });
  return { data, content: parsed.content, original: text };
}

export function serializeMarkdownObject(data, body = '') {
  const content = body.endsWith('\n') ? body : `${body}\n`;
  return matter.stringify(content, normalizeYaml(data), { lineWidth: -1 });
}

export async function readMarkdownObject(file, { workspace } = {}) {
  const absolute = path.resolve(file);
  let pathLabel = absolute;
  if (workspace) {
    const root = path.resolve(workspace);
    const relative = path.relative(root, absolute).split(path.sep).join('/');
    if (!relative || relative.startsWith('../') || path.isAbsolute(relative)) {
      throw new ObjectContractError('PATH_ESCAPE', '对象文件不在工作区内');
    }
    await assertNoSymlinkPath(root, relative);
    pathLabel = relative;
  } else if ((await lstat(absolute)).isSymbolicLink()) {
    throw new ObjectContractError('SYMLINK_NOT_ALLOWED', '对象文件不能是符号链接');
  }
  const parsed = parseMarkdownObjectText(await readFile(absolute, 'utf8'), { path: pathLabel });
  if (workspace && parsed.data.record_type === 'evidence') {
    const snapshotPath = parsed.data.snapshot.path;
    try {
      await assertNoSymlinkPath(workspace, snapshotPath);
    } catch (error) {
      if (error.code === 'PATH_NOT_FOUND') {
        throw new ObjectContractError('SNAPSHOT_NOT_FOUND', `Evidence snapshot 不存在（${pathLabel}）`, [{
          code: 'SNAPSHOT_NOT_FOUND', path: pathLabel, field: '/snapshot/path',
        }]);
      }
      throw error;
    }
    const actual = sha256(await readFile(resolveWithin(workspace, snapshotPath)));
    if (actual !== parsed.data.snapshot.sha256) {
      throw new ObjectContractError('CHECKSUM_MISMATCH', `Evidence snapshot checksum 不一致（${pathLabel}）`, [{
        code: 'CHECKSUM_MISMATCH', path: pathLabel, field: '/snapshot/sha256',
      }]);
    }
  }
  return parsed;
}

export function recordTypeDefinition(recordType) {
  return DEFINITIONS.get(recordType) ?? null;
}
