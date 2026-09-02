import { lstat, mkdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import { validateM6Object } from './m6-profile.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { collectObjectReferences } from './index-builder.mjs';
import {
  assertSafeRelativePath,
  stableStringify,
  walkMarkdownFiles,
  writeCreateOnly,
} from './workspace-paths.mjs';
import { initWorkspace } from '../workspace-init.mjs';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(LIB_DIR, '..', '..', '..', '..');
const REAL_MYYSHOP_ROOT = path.join(REPO_ROOT, 'workspaces', 'myyshop');
const WORKSPACE_ID = /^ws_[a-z0-9]{26}$/;
const MERCHANT_ID = /^MER-(?:[A-Z0-9]+-)*[A-Z0-9]+$/;
const KNOWLEDGE_BASE_ID = /^KBASE-(?:[A-Z0-9]+-)*[A-Z0-9]+$/;
const REAL_MYYSHOP_OBJECT_ID = /\b(?:CLM|EVD|SRC|Q|QS|KR|ANS|AST|RUN|GOAL)-MYYSHOP-(?!DEVTEST-)[A-Z0-9-]+\b/;
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

export class WorkspaceScopeError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'WorkspaceScopeError';
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

export async function readWorkspaceIdentity(workspace) {
  try {
    return JSON.parse(await readFile(path.join(workspace, 'workspace.json'), 'utf8'));
  } catch (error) {
    throw new WorkspaceScopeError('WORKSPACE_SCOPE_INVALID', 'Workspace 身份不可读', {
      cause_code: error.code,
    });
  }
}

function invalidDevelopmentIdentity(identity) {
  if (!identity || !WORKSPACE_ID.test(identity.workspace_id ?? '')) return true;
  if (identity.workspace_mode !== 'development_test') return true;
  if (!MERCHANT_ID.test(identity.merchant_ref ?? '')) return true;
  if (identity.merchant_mode !== 'online') return true;
  if (identity.execution_scope !== 'synthetic_test') return true;
  if (!KNOWLEDGE_BASE_ID.test(identity.knowledge_base_ref ?? '')) return true;
  if (identity.knowledge_base_mode !== 'test_only') return true;
  if (!identity.online_configuration
      || typeof identity.online_configuration.ga4_property_id !== 'string'
      || typeof identity.online_configuration.gsc_site_url !== 'string'
      || typeof identity.online_configuration.analytics_plan !== 'string') return true;
  try {
    const subject = new URL(identity.subject_locator);
    const gsc = new URL(identity.online_configuration.gsc_site_url);
    if (subject.protocol !== 'https:' || gsc.protocol !== 'https:') return true;
  } catch {
    return true;
  }
  return false;
}

function urlsIn(text) {
  return text.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [];
}

function stringIsContaminated(value) {
  if (/(?:^|[\\/])workspaces[\\/]myyshop(?:[\\/]|$)/.test(value)) return true;
  if (REAL_MYYSHOP_OBJECT_ID.test(value)) return true;
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
    findContamination(item, `${currentPath}.${key}`, findings);
  }
  return findings;
}

export function assertNoTestKnowledgeContamination(value) {
  const findings = findContamination(value);
  if (findings.length > 0) {
    throw new WorkspaceScopeError(
      'SYNTHETIC_REAL_REF_CONTAMINATION',
      '检测到测试知识与真实业务对象污染',
      { fields: findings },
    );
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
    const relative = path.relative(workspace, file).split(path.sep).join('/');
    validateObjectData(parsed.data, { path: relative });
    objects.push({ data: parsed.data, content: parsed.content, path: relative });
  }
  return objects;
}

export async function assertDevelopmentWorkspaceWriteAllowed({ workspace }) {
  const root = path.resolve(workspace);
  if ((await lstat(root)).isSymbolicLink()) {
    throw new WorkspaceScopeError('SYMLINK_NOT_ALLOWED', 'development-test Workspace 根不能是 symlink');
  }
  if (await sameOrInside(root, REAL_MYYSHOP_ROOT)) {
    throw new WorkspaceScopeError(
      'REAL_WORKSPACE_WRITE_FORBIDDEN',
      '真实 MyyShop Workspace 禁止写入 test-only 知识',
    );
  }
  const identity = await readWorkspaceIdentity(root);
  if (invalidDevelopmentIdentity(identity)) {
    throw new WorkspaceScopeError('WORKSPACE_SCOPE_INVALID', 'development-test Workspace 身份非法');
  }
  return identity;
}

export async function validateDevelopmentKnowledgeWorkspace({ workspace }) {
  const root = path.resolve(workspace);
  const errors = [];
  let identity;
  try {
    identity = await assertDevelopmentWorkspaceWriteAllowed({ workspace: root });
  } catch (error) {
    errors.push({ code: error.code ?? 'WORKSPACE_SCOPE_INVALID', path: 'workspace.json' });
    return { workspace: root, identity: null, merchant: null, knowledgeBase: null, errors, warnings: [] };
  }

  let objects;
  try {
    objects = await readCanonicalObjects(root);
  } catch (error) {
    errors.push(...(error.diagnostics ?? [{ code: error.code ?? 'OBJECT_VALIDATION_FAILED' }]));
    return { workspace: root, identity, merchant: null, knowledgeBase: null, errors, warnings: [] };
  }
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  const merchantObject = byId.get(identity.merchant_ref);
  const knowledgeObject = byId.get(identity.knowledge_base_ref);
  const merchant = merchantObject?.data;
  const knowledgeBase = knowledgeObject?.data;
  if (!merchant || merchant.record_type !== 'merchant' || merchant.status !== 'active'
      || merchant.canonical_locator !== identity.subject_locator
      || merchant.account_mode !== 'online') {
    errors.push({ code: 'WORKSPACE_SCOPE_INVALID', path: merchantObject?.path ?? 'execution/identity' });
  }
  if (!knowledgeBase || knowledgeBase.record_type !== 'brand_knowledge_base'
      || !['frozen', 'active'].includes(knowledgeBase.status)
      || knowledgeBase.merchant_ref !== identity.merchant_ref
      || knowledgeBase.mode !== 'test_only'
      || knowledgeBase.root_path !== 'knowledge') {
    errors.push({ code: 'KNOWLEDGE_BASE_SCOPE_MISMATCH', path: knowledgeObject?.path ?? 'knowledge/meta' });
  }

  for (const object of objects) {
    if (object.data.record_type === 'merchant') {
      if (object.data.test_scope) {
        errors.push({ code: 'WORKSPACE_SCOPE_INVALID', id: object.data.id, path: object.path });
      }
      continue;
    }
    const scope = object.data.test_scope;
    if (!scope
        || scope.kind !== 'synthetic'
        || scope.usage !== 'test_only'
        || scope.merchant_ref !== identity.merchant_ref
        || scope.workspace_id !== identity.workspace_id
        || scope.knowledge_base_ref !== identity.knowledge_base_ref) {
      errors.push({
        code: 'TEST_KNOWLEDGE_SCOPE_REQUIRED',
        id: object.data.id,
        path: object.path,
      });
      continue;
    }
    const profile = validateM6Object(object, { testKnowledgeWorkspace: true });
    errors.push(...profile.errors);
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
  return { workspace: root, identity, merchant, knowledgeBase, errors, warnings: [] };
}

export async function validateOnlineKnowledgeWorkspace({ workspace, knowledgeBaseRef }) {
  const root = path.resolve(workspace);
  const errors = [];
  let identity;
  try {
    identity = await readWorkspaceIdentity(root);
  } catch (error) {
    return { workspace: root, identity: null, merchant: null, knowledgeBase: null,
      errors: [{ code: error.code ?? 'WORKSPACE_SCOPE_INVALID', path: 'workspace.json' }], warnings: [] };
  }
  if (identity.workspace_mode !== 'online'
      || identity.merchant_mode !== 'online'
      || identity.execution_scope !== 'authorized_real'
      || !MERCHANT_ID.test(identity.merchant_ref ?? '')) {
    errors.push({ code: 'WORKSPACE_SCOPE_INVALID', path: 'workspace.json' });
  }
  const selectedKnowledgeBase = knowledgeBaseRef ?? identity.knowledge_base_ref;
  if (!KNOWLEDGE_BASE_ID.test(selectedKnowledgeBase ?? '')) {
    errors.push({ code: 'KNOWLEDGE_BASE_REQUIRED', path: 'workspace.json' });
  }
  let objects = [];
  try {
    objects = await readCanonicalObjects(root);
  } catch (error) {
    errors.push(...(error.diagnostics ?? [{ code: error.code ?? 'OBJECT_VALIDATION_FAILED' }]));
  }
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  const merchant = byId.get(identity.merchant_ref)?.data;
  const knowledgeBase = byId.get(selectedKnowledgeBase)?.data;
  if (!merchant || merchant.record_type !== 'merchant' || merchant.status !== 'active'
      || merchant.account_mode !== 'online'
      || merchant.canonical_locator !== identity.subject_locator) {
    errors.push({ code: 'WORKSPACE_SCOPE_INVALID', path: 'execution/identity' });
  }
  if (!knowledgeBase || knowledgeBase.record_type !== 'brand_knowledge_base'
      || knowledgeBase.mode !== 'real'
      || !['frozen', 'active'].includes(knowledgeBase.status)
      || knowledgeBase.merchant_ref !== identity.merchant_ref
      || !knowledgeBase.approval) {
    errors.push({ code: 'KNOWLEDGE_BASE_SCOPE_MISMATCH', path: 'knowledge' });
  }
  for (const object of objects) {
    if (object.data.test_scope) {
      errors.push({ code: 'SYNTHETIC_REAL_REF_CONTAMINATION', id: object.data.id, path: object.path });
    }
  }
  return {
    workspace: root,
    identity,
    merchant,
    knowledgeBase,
    selectedKnowledgeBase,
    errors,
    warnings: [],
  };
}

export async function validateLifecycleWorkspace({ workspace, knowledgeBaseRef }) {
  let identity;
  try {
    identity = await readWorkspaceIdentity(path.resolve(workspace));
  } catch (error) {
    return {
      workspace: path.resolve(workspace),
      identity: null,
      merchant: null,
      knowledgeBase: null,
      errors: [{ code: error.code ?? 'WORKSPACE_SCOPE_INVALID', path: 'workspace.json' }],
      warnings: [],
    };
  }
  if (identity.workspace_mode === 'development_test') {
    const result = await validateDevelopmentKnowledgeWorkspace({ workspace });
    if (knowledgeBaseRef && knowledgeBaseRef !== identity.knowledge_base_ref) {
      result.errors.push({ code: 'KNOWLEDGE_BASE_SCOPE_MISMATCH', path: 'workspace.json' });
    }
    return result;
  }
  return validateOnlineKnowledgeWorkspace({ workspace, knowledgeBaseRef });
}

export async function preflightLifecycleWrite({
  workspace,
  data,
  body = '',
  manifest,
  refClosure = true,
}) {
  const identity = await readWorkspaceIdentity(path.resolve(workspace));
  if (identity.workspace_mode === 'development_test') {
    return preflightTestKnowledgeWrite({ workspace, data, body, manifest, refClosure });
  }
  const validation = await validateOnlineKnowledgeWorkspace({
    workspace,
    knowledgeBaseRef: data.knowledge_base_ref ?? identity.knowledge_base_ref,
  });
  if (validation.errors.length > 0) {
    throw new WorkspaceScopeError(validation.errors[0].code, 'online Workspace 未通过写前校验', {
      diagnostics: validation.errors,
    });
  }
  if (data.test_scope || data.execution_scope === 'synthetic_test'
      || data.merchant_ref && data.merchant_ref !== identity.merchant_ref
      || data.knowledge_base_ref && data.knowledge_base_ref !== validation.knowledgeBase.id) {
    throw new WorkspaceScopeError('SYNTHETIC_REAL_REF_CONTAMINATION', 'real lifecycle scope 与 Workspace 不一致');
  }
  const normalized = validateObjectData(data, { path: '<authorized-real-write-plan>' });
  if (!refClosure) return { ok: true, identity, merchant_ref: identity.merchant_ref,
    knowledge_base_ref: validation.knowledgeBase.id };
  const objects = await readCanonicalObjects(path.resolve(workspace));
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  for (const relation of collectObjectReferences(normalized)) {
    const target = relation.ref === normalized.id ? { data: normalized } : byId.get(relation.ref);
    if (!target) throw new WorkspaceScopeError('BROKEN_REF', 'real lifecycle write contains unresolved ref', relation);
    if (!relation.allowedTypes.includes(target.data.record_type)) {
      throw new WorkspaceScopeError('REF_TYPE_MISMATCH', 'real lifecycle ref type mismatch', relation);
    }
    if (relation.version && relation.version !== target.data.version) {
      throw new WorkspaceScopeError('REF_VERSION_MISMATCH', 'real lifecycle ref version mismatch', relation);
    }
  }
  return { ok: true, identity, merchant_ref: identity.merchant_ref,
    knowledge_base_ref: validation.knowledgeBase.id };
}

export async function preflightTestKnowledgeWrite({
  workspace,
  data,
  body = '',
  manifest,
  refClosure = true,
}) {
  const validation = await validateDevelopmentKnowledgeWorkspace({ workspace });
  if (validation.errors.length > 0) {
    throw new WorkspaceScopeError(validation.errors[0].code, '测试知识 Workspace 未通过写前校验', {
      diagnostics: validation.errors,
    });
  }
  const scope = data?.test_scope;
  if (!scope
      || scope.kind !== 'synthetic'
      || scope.usage !== 'test_only'
      || scope.merchant_ref !== validation.identity.merchant_ref
      || scope.workspace_id !== validation.identity.workspace_id
      || scope.knowledge_base_ref !== validation.identity.knowledge_base_ref) {
    throw new WorkspaceScopeError('TEST_KNOWLEDGE_SCOPE_REQUIRED', '对象缺少匹配的 test_scope');
  }
  assertNoTestKnowledgeContamination(data);
  assertNoTestKnowledgeContamination(body);
  assertNoTestKnowledgeContamination(manifest);
  const normalized = validateObjectData(data, { path: '<test-knowledge-write-plan>' });
  const profile = validateM6Object({ data: normalized, path: '<test-knowledge-write-plan>' }, {
    testKnowledgeWorkspace: true,
  });
  if (profile.errors.length > 0) {
    throw new WorkspaceScopeError(profile.errors[0].code, 'profile 写前校验失败', {
      diagnostics: profile.errors,
    });
  }
  const objects = await readCanonicalObjects(path.resolve(workspace));
  const byId = new Map(objects.map((object) => [object.data.id, object]));
  for (const relation of refClosure ? collectObjectReferences(normalized) : []) {
    const target = relation.ref === normalized.id ? { data: normalized } : byId.get(relation.ref);
    if (!target) {
      throw new WorkspaceScopeError('BROKEN_REF', 'test-only 写入包含 unresolved ref', relation);
    }
    if (!relation.allowedTypes.includes(target.data.record_type)) {
      throw new WorkspaceScopeError('REF_TYPE_MISMATCH', 'test-only 写入 ref 类型错误', relation);
    }
    if (relation.version && relation.version !== target.data.version) {
      throw new WorkspaceScopeError('REF_VERSION_MISMATCH', 'test-only 写入 ref 版本漂移', relation);
    }
  }
  return {
    ok: true,
    identity: validation.identity,
    merchant_ref: validation.identity.merchant_ref,
    knowledge_base_ref: validation.identity.knowledge_base_ref,
  };
}

function validateInitializationPlan(plan) {
  if (plan?.schema_version !== 'development-knowledge-workspace/1.0.0'
      || !WORKSPACE_ID.test(plan.workspace_id ?? '')
      || !MERCHANT_ID.test(plan.merchant?.id ?? '')
      || !KNOWLEDGE_BASE_ID.test(plan.knowledge_base?.id ?? '')
      || plan.knowledge_base?.mode !== 'test_only'
      || plan.knowledge_base?.root_path !== 'knowledge'
      || plan.execution_scope !== 'synthetic_test'
      || typeof plan.brand !== 'string'
      || typeof plan.decision_ref !== 'string') {
    throw new WorkspaceScopeError('WORKSPACE_SCOPE_INVALID', 'development Workspace plan 非法');
  }
  for (const relative of [plan.merchant.path, plan.knowledge_base.path,
    plan.online_configuration?.analytics_plan]) assertSafeRelativePath(relative);
  const locator = new URL(plan.merchant.canonical_locator);
  const gsc = new URL(plan.online_configuration.gsc_site_url);
  if (locator.protocol !== 'https:' || gsc.protocol !== 'https:') {
    throw new WorkspaceScopeError('WORKSPACE_SCOPE_INVALID', '线上 locator 必须为 HTTPS');
  }
}

export async function initializeDevelopmentKnowledgeWorkspace({ workspace, plan }) {
  validateInitializationPlan(plan);
  const root = path.resolve(workspace);
  await mkdir(root, { recursive: true });
  try {
    await readFile(path.join(root, 'workspace.json'));
    await assertDevelopmentWorkspaceWriteAllowed({ workspace: root });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const identity = {
    schema_version: '1.0.0',
    workspace_id: plan.workspace_id,
    brand: plan.brand,
    created_at: plan.created_at,
    created_by: 'geo-lifecycle/1.1.0',
    workspace_mode: 'development_test',
    merchant_ref: plan.merchant.id,
    merchant_mode: 'online',
    subject_locator: plan.merchant.canonical_locator,
    execution_scope: plan.execution_scope,
    knowledge_base_ref: plan.knowledge_base.id,
    knowledge_base_mode: 'test_only',
    online_configuration: { ...plan.online_configuration },
  };
  const identityResult = await writeCreateOnly(root, 'workspace.json', stableStringify(identity, 2), {
    idempotent: true,
    conflictCode: 'IDENTITY_CONFLICT',
  });
  await initWorkspace({ workspace: root, brand: plan.brand });
  const approval = {
    approved_by: 'MyyShop Owner (development-test only)',
    approved_at: plan.created_at,
    decision_ref: plan.decision_ref,
  };
  const merchant = {
    id: plan.merchant.id,
    record_type: 'merchant',
    status: 'active',
    version: '1.0.0',
    created_at: plan.created_at,
    updated_at: plan.created_at,
    title: `${plan.brand} online merchant identity`,
    display_name: plan.brand,
    canonical_locator: plan.merchant.canonical_locator,
    account_mode: 'online',
  };
  const testScope = {
    kind: 'synthetic',
    usage: 'test_only',
    merchant_ref: plan.merchant.id,
    workspace_id: plan.workspace_id,
    knowledge_base_ref: plan.knowledge_base.id,
  };
  const knowledgeBase = {
    id: plan.knowledge_base.id,
    record_type: 'brand_knowledge_base',
    status: 'frozen',
    version: '1.0.0',
    created_at: plan.created_at,
    updated_at: plan.created_at,
    title: `${plan.brand} development test knowledge base`,
    test_scope: testScope,
    merchant_ref: plan.merchant.id,
    mode: 'test_only',
    root_path: plan.knowledge_base.root_path,
    provenance: { kind: 'synthetic', usage: 'test_only', decision_ref: plan.decision_ref },
    approval,
  };
  validateObjectData(merchant, { path: '<development-workspace-plan:merchant>' });
  validateObjectData(knowledgeBase, { path: '<development-workspace-plan:knowledge-base>' });
  const merchantResult = await writeCreateOnly(
    root,
    plan.merchant.path,
    serializeMarkdownObject(merchant, '# MyyShop Merchant Identity\n'),
    { idempotent: true, conflictCode: 'OBJECT_CONFLICT' },
  );
  const knowledgeResult = await writeCreateOnly(
    root,
    plan.knowledge_base.path,
    serializeMarkdownObject(knowledgeBase, '# Development Test Brand Knowledge Base\n'),
    { idempotent: true, conflictCode: 'OBJECT_CONFLICT' },
  );
  const validation = await validateDevelopmentKnowledgeWorkspace({ workspace: root });
  if (validation.errors.length > 0) {
    throw new WorkspaceScopeError(validation.errors[0].code, 'development Workspace 初始化后校验失败', {
      diagnostics: validation.errors,
    });
  }
  return {
    action: [identityResult, merchantResult, knowledgeResult].every(({ action }) => action === 'kept')
      ? 'kept' : 'created',
    workspace: root,
    workspace_id: plan.workspace_id,
    merchant_ref: plan.merchant.id,
    knowledge_base_ref: plan.knowledge_base.id,
    test_scope: testScope,
    network_accessed: false,
  };
}
