import { readFile } from 'node:fs/promises';

import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  assertNoSymlinkPath,
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  writeCreateOnly,
} from './workspace-paths.mjs';

export class DiagnosisError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'DiagnosisError';
    this.code = code;
    Object.assign(this, details);
  }
}

export function requireObject(graph, ref, type) {
  const object = graph.byId.get(ref);
  if (!object) throw new DiagnosisError('BROKEN_REF', '对象引用不存在', { ref });
  if (object.data.record_type !== type) {
    throw new DiagnosisError('REF_TYPE_MISMATCH', '对象引用类型错误', {
      ref,
      expected: type,
      actual: object.data.record_type,
    });
  }
  return object;
}

export function validateVersionRefs(graph, refs, type) {
  for (const item of refs ?? []) {
    const target = requireObject(graph, item.ref, type);
    if (target.data.version !== item.version) {
      throw new DiagnosisError('RETEST_INPUT_DRIFT', '对象版本引用与当前对象不一致', {
        ref: item.ref,
        expected: item.version,
        actual: target.data.version,
      });
    }
  }
}

export function commonData(item, recordType, status, now, existing) {
  return {
    id: item.id,
    ...(item.test_scope ? { test_scope: { ...item.test_scope } } : {}),
    record_type: recordType,
    status,
    version: item.version ?? existing?.data.version ?? '1.0.0',
    created_at: existing?.data.created_at ?? now,
    updated_at: existing?.data.updated_at ?? now,
    ...(item.title ? { title: item.title } : {}),
  };
}

export function sortedUnique(values = []) {
  return [...new Set(values)].sort();
}

export function isSubset(values = [], allowed = []) {
  const allowedSet = new Set(allowed);
  return values.every((value) => allowedSet.has(value));
}

export function isFixtureLocator(locator) {
  if (typeof locator !== 'string') return false;
  if (locator.startsWith('workspace://')) return true;
  try {
    return new URL(locator).hostname.endsWith('.invalid');
  } catch {
    return false;
  }
}

function normalizeBody(body = '') {
  return body.endsWith('\n') ? body : `${body}\n`;
}

export async function prepareOutputs({ workspace, graph, outputs }) {
  const ids = new Set();
  const paths = new Set();
  const prepared = [];
  for (const output of outputs) {
    const safePath = assertSafeRelativePath(output.path);
    if (ids.has(output.data.id) || paths.has(safePath)) {
      throw new DiagnosisError('OBJECT_CONFLICT', 'plan 内存在重复 ID 或 path');
    }
    ids.add(output.data.id);
    paths.add(safePath);
    const existingIdentity = graph.byId.get(output.data.id);
    if (existingIdentity && existingIdentity.path !== safePath) {
      throw new DiagnosisError('OBJECT_CONFLICT', 'stable ID 已存在于其他路径', {
        id: output.data.id,
        existing_path: existingIdentity.path,
        requested_path: safePath,
      });
    }
    validateObjectData(output.data, { path: safePath });
    const body = normalizeBody(output.body ?? `# ${output.data.title ?? output.data.id}\n`);
    prepared.push({
      path: safePath,
      data: output.data,
      body,
      content: serializeMarkdownObject(output.data, body),
      conflictCode: output.conflictCode ?? 'OBJECT_CONFLICT',
    });
  }

  for (const output of prepared) {
    try {
      await assertNoSymlinkPath(workspace, output.path);
      const existing = await readFile(resolveWithin(workspace, output.path), 'utf8');
      if (existing !== output.content) {
        throw new DiagnosisError(output.conflictCode, '目标已存在且内容不同', {
          path: output.path,
        });
      }
    } catch (error) {
      if (!['PATH_NOT_FOUND', 'ENOENT'].includes(error.code)) throw error;
    }
  }
  return prepared;
}

export async function writePreparedOutputs({ workspace, prepared }) {
  const created = [];
  const kept = [];
  for (const output of prepared) {
    const result = await writeCreateOnly(workspace, output.path, output.content, {
      idempotent: true,
      conflictCode: output.conflictCode,
    });
    (result.action === 'created' ? created : kept).push(result.path);
  }
  return { created, kept };
}

export async function readSnapshot({ workspace, snapshot, missingCode = 'SNAPSHOT_REQUIRED' }) {
  if (!snapshot?.path || !snapshot.sha256 || !snapshot.media_type) {
    throw new DiagnosisError(missingCode, 'snapshot path、sha256 与 media_type 必填');
  }
  const safePath = assertSafeRelativePath(snapshot.path);
  let bytes;
  try {
    await assertNoSymlinkPath(workspace, safePath);
    bytes = await readFile(resolveWithin(workspace, safePath));
  } catch (error) {
    if (['PATH_NOT_FOUND', 'ENOENT'].includes(error.code)) {
      throw new DiagnosisError(missingCode, 'snapshot 不存在', { path: safePath });
    }
    throw error;
  }
  if (sha256(bytes) !== snapshot.sha256) {
    throw new DiagnosisError('CHECKSUM_MISMATCH', 'snapshot checksum 不一致', { path: safePath });
  }
  return { ...snapshot, path: safePath, bytes };
}
