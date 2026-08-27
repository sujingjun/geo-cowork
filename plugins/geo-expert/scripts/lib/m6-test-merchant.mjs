import { lstat, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import { validateM6Object } from './m6-profile.mjs';
import { validateObjectData } from './object-contract.mjs';
import { collectObjectReferences } from './index-builder.mjs';
import { walkMarkdownFiles } from './workspace-paths.mjs';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(LIB_DIR, '..', '..', '..', '..');
const REAL_MYYSHOP_ROOT = path.join(REPO_ROOT, 'workspaces', 'myyshop');
const WORKSPACE_ID = /^ws_[a-z0-9]{26}$/;
const TEST_NAMESPACE = /^[a-z0-9][a-z0-9-]*$/;
const REAL_CANONICAL_ID = /\b(?:CLM|EVD|SRC|Q|QS|KR|ANS|AST|RUN|GOAL)-MYYSHOP-[A-Z0-9-]+\b/;
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

export class M6TestMerchantError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'M6TestMerchantError';
    this.code = code;
    Object.assign(this, details);
  }
}

async function sameOrInside(candidate, parent) {
  const [actualCandidate, actualParent] = await Promise.all([
    realpath(candidate),
    realpath(parent),
  ]);
  const relative = path.relative(actualParent, actualCandidate);
  return relative === '' || !relative.startsWith('..') && !path.isAbsolute(relative);
}

function invalidIdentity(identity) {
  if (!identity || !WORKSPACE_ID.test(identity.workspace_id ?? '')) return true;
  if (identity.workspace_mode !== 'test_only') return true;
  if (!TEST_NAMESPACE.test(identity.test_namespace ?? '')) return true;
  if (identity.legal_entity !== false) return true;
  try {
    const locator = new URL(identity.subject_locator);
    return locator.protocol !== 'https:' || !locator.hostname.endsWith('.invalid');
  } catch {
    return true;
  }
}

async function readWorkspaceIdentity(workspace) {
  try {
    return JSON.parse(await readFile(path.join(workspace, 'workspace.json'), 'utf8'));
  } catch (error) {
    throw new M6TestMerchantError('TEST_MERCHANT_IDENTITY_INVALID', '测试 Workspace 身份不可读', {
      cause_code: error.code,
    });
  }
}

function urlsIn(text) {
  return text.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [];
}

function stringIsContaminated(value) {
  if (/(?:^|[\\/])workspaces[\\/]myyshop(?:[\\/]|$)/.test(value)) return true;
  if (REAL_CANONICAL_ID.test(value)) return true;
  if (EMAIL.test(value)) return true;
  for (const rawUrl of urlsIn(value)) {
    try {
      if (!new URL(rawUrl).hostname.endsWith('.invalid')) return true;
    } catch {
      return true;
    }
  }
  return false;
}

function findContamination(value, currentPath = '$', findings = []) {
  if (typeof value === 'string') {
    if (stringIsContaminated(value)) findings.push(currentPath);
    return findings;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => findContamination(item, `${currentPath}[${index}]`, findings));
    return findings;
  }
  if (!value || typeof value !== 'object') return findings;
  for (const [key, item] of Object.entries(value)) {
    if (key === 'real_workspace_forbidden') continue;
    findContamination(item, `${currentPath}.${key}`, findings);
  }
  return findings;
}

export function assertNoSyntheticContamination(value) {
  const findings = findContamination(value);
  if (findings.length > 0) {
    throw new M6TestMerchantError('SYNTHETIC_REAL_REF_CONTAMINATION', '检测到真实/模拟污染', {
      fields: findings,
    });
  }
  return true;
}

async function readCanonicalObjects(workspace) {
  const objects = [];
  for (const file of await walkMarkdownFiles(workspace, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    if (!parsed.data.record_type || parsed.data.record_type === 'knowledge_entry') continue;
    objects.push({
      data: parsed.data,
      content: parsed.content,
      path: path.relative(workspace, file).split(path.sep).join('/'),
    });
  }
  return objects;
}

export async function assertTestWorkspaceWriteAllowed({ workspace }) {
  const root = path.resolve(workspace);
  if ((await lstat(root)).isSymbolicLink()) {
    throw new M6TestMerchantError('SYMLINK_NOT_ALLOWED', '测试 Workspace 根不能是 symlink');
  }
  if (await sameOrInside(root, REAL_MYYSHOP_ROOT)) {
    throw new M6TestMerchantError('REAL_WORKSPACE_WRITE_FORBIDDEN', '真实 MyyShop Workspace 禁止测试写入');
  }
  const identity = await readWorkspaceIdentity(root);
  if (invalidIdentity(identity)) {
    throw new M6TestMerchantError('TEST_MERCHANT_IDENTITY_INVALID', '测试 Workspace 根身份非法');
  }
  return identity;
}

export async function validateTestMerchantWorkspace({ workspace }) {
  const root = path.resolve(workspace);
  const errors = [];
  let identity;
  try {
    identity = await assertTestWorkspaceWriteAllowed({ workspace: root });
  } catch (error) {
    errors.push({ code: error.code ?? 'TEST_MERCHANT_IDENTITY_INVALID', path: 'workspace.json' });
    return { workspace: root, identity: null, synthetic: false, errors, warnings: [] };
  }

  let objects;
  try {
    objects = await readCanonicalObjects(root);
  } catch (error) {
    errors.push({ code: error.code ?? 'TEST_MERCHANT_IDENTITY_INVALID', path: error.path ?? '<workspace>' });
    return { workspace: root, identity, synthetic: true, errors, warnings: [] };
  }
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  const merchants = objects.filter((object) => object.data.record_type === 'test_merchant');
  if (merchants.length !== 1) {
    errors.push({ code: 'TEST_MERCHANT_IDENTITY_INVALID', path: 'cycles', reason: 'merchant_count' });
  }
  const merchant = merchants[0]?.data;
  if (merchant && (merchant.status !== 'frozen'
      || merchant.workspace_id !== identity.workspace_id
      || merchant.workspace_namespace !== identity.test_namespace
      || merchant.identity?.canonical_locator !== identity.subject_locator
      || merchant.identity?.legal_entity_kind !== 'fictitious')) {
    errors.push({ code: 'TEST_MERCHANT_IDENTITY_INVALID', id: merchant.id, path: merchants[0].path });
  }

  for (const object of objects) {
    const profile = validateM6Object(object, { testWorkspace: true });
    errors.push(...profile.errors);
    const scope = object.data.test_scope;
    if (scope && merchant && (scope.merchant_ref !== merchant.id
        || scope.workspace_id !== identity.workspace_id
        || !byId.has(scope.merchant_ref))) {
      errors.push({
        code: 'SYNTHETIC_REAL_REF_CONTAMINATION',
        id: object.data.id,
        path: object.path,
        field: 'test_scope',
      });
    }
    const contaminated = [
      ...findContamination(object.data),
      ...findContamination(object.content),
    ];
    if (contaminated.length > 0) {
      errors.push({
        code: 'SYNTHETIC_REAL_REF_CONTAMINATION',
        id: object.data.id,
        path: object.path,
        fields: contaminated,
      });
    }
  }
  return { workspace: root, identity, merchant, synthetic: true, errors, warnings: [] };
}

export async function preflightSyntheticWrite({
  workspace,
  data,
  body = '',
  manifest,
  refClosure = true,
}) {
  const identity = await assertTestWorkspaceWriteAllowed({ workspace });
  const validation = await validateTestMerchantWorkspace({ workspace });
  if (validation.errors.length > 0) {
    throw new M6TestMerchantError(validation.errors[0].code, '测试 Workspace 未通过写前校验', {
      diagnostics: validation.errors,
    });
  }
  const scope = data?.test_scope;
  if (!scope
      || scope.kind !== 'synthetic'
      || scope.usage !== 'test_only') {
    throw new M6TestMerchantError('TEST_MERCHANT_SCOPE_REQUIRED', 'synthetic 对象缺少顶层 test_scope');
  }
  const merchant = validation.errors.length === 0
    ? (await readCanonicalObjects(path.resolve(workspace)))
      .find((object) => object.data.record_type === 'test_merchant')?.data
    : null;
  if (!merchant
      || scope.merchant_ref !== merchant.id
      || scope.workspace_id !== identity.workspace_id) {
    throw new M6TestMerchantError('SYNTHETIC_REAL_REF_CONTAMINATION', 'test_scope 跨 Workspace');
  }
  const contaminated = [
    ...findContamination(data),
    ...findContamination(body),
    ...findContamination(manifest),
  ];
  if (contaminated.length > 0) {
    throw new M6TestMerchantError('SYNTHETIC_REAL_REF_CONTAMINATION', '检测到真实/模拟污染', {
      fields: contaminated,
    });
  }
  let normalized;
  try {
    normalized = validateObjectData(data, { path: '<synthetic-write-plan>' });
  } catch (error) {
    throw error;
  }
  const profile = validateM6Object({ data: normalized, path: '<synthetic-write-plan>' }, {
    testWorkspace: true,
  });
  if (profile.errors.length > 0) {
    throw new M6TestMerchantError(profile.errors[0].code, 'M6 profile 写前校验失败', {
      diagnostics: profile.errors,
    });
  }
  const objects = await readCanonicalObjects(path.resolve(workspace));
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  for (const relation of refClosure ? collectObjectReferences(normalized) : []) {
    const target = relation.ref === normalized.id
      ? { data: normalized }
      : byId.get(relation.ref);
    if (!target) {
      throw new M6TestMerchantError('BROKEN_REF', 'synthetic 写入包含 unresolved ref', {
        field: relation.field,
        ref: relation.ref,
      });
    }
    if (!relation.allowedTypes.includes(target.data.record_type)) {
      throw new M6TestMerchantError('REF_TYPE_MISMATCH', 'synthetic 写入 ref 类型错误', {
        field: relation.field,
        ref: relation.ref,
        expected: relation.allowedTypes,
        actual: target.data.record_type,
      });
    }
    if (relation.version && relation.version !== target.data.version) {
      throw new M6TestMerchantError('REF_VERSION_MISMATCH', 'synthetic 写入 ref 版本漂移', {
        field: relation.field,
        ref: relation.ref,
        expected: relation.version,
        actual: target.data.version,
      });
    }
  }
  return { ok: true, identity, merchant_ref: merchant.id };
}
