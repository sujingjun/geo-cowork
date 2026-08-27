import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import {
  assertSafeRelativePath,
  resolveWithin,
  sha256,
  stableStringify,
  walkMarkdownFiles,
} from './workspace-paths.mjs';

export function sameJson(left, right) {
  return stableStringify(left) === stableStringify(right);
}

function failure(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  return error;
}

export async function canonicalObjects(workspace) {
  const root = path.resolve(workspace);
  const objects = [];
  for (const file of await walkMarkdownFiles(root, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const original = await readFile(file, 'utf8');
    if (!original.startsWith('---')) continue;
    const parsed = matter(original);
    if (!parsed.data.record_type || parsed.data.record_type === 'knowledge_entry') continue;
    objects.push({
      data: parsed.data,
      content: parsed.content,
      original,
      bytes: Buffer.from(original),
      path: path.relative(root, file).split(path.sep).join('/'),
    });
  }
  return objects;
}

export async function canonicalObjectMap(workspace) {
  const map = new Map();
  for (const object of await canonicalObjects(workspace)) {
    if (map.has(object.data.id)) {
      throw failure('DUPLICATE_ID', 'canonical stable ID 不唯一', { id: object.data.id });
    }
    map.set(object.data.id, object);
  }
  return map;
}

export async function findCanonicalObject(workspace, id, recordType = null) {
  const object = (await canonicalObjectMap(workspace)).get(id);
  if (!object || (recordType && object.data.record_type !== recordType)) {
    throw failure('TRACE_INCOMPLETE', 'canonical 对象不存在或类型错误', {
      ref: id,
      expected_record_type: recordType,
    });
  }
  return object;
}

export function exactVersion(object, expected, code = 'CYCLE_TWO_PREDECESSOR_MISMATCH') {
  if (!expected || object.data.id !== expected.ref || object.data.version !== expected.version) {
    throw failure(code, '对象 exact version 不匹配', {
      expected,
      actual: { ref: object.data.id, version: object.data.version },
    });
  }
}

function validateManifest(snapshot, manifest, bytes) {
  if (sha256(bytes) !== snapshot.data.manifest?.sha256
      || manifest.snapshot_id !== snapshot.data.id
      || manifest.snapshot_kind !== snapshot.data.snapshot_kind
      || manifest.fingerprint !== snapshot.data.manifest?.fingerprint
      || !sameJson(manifest.source_entries, snapshot.data.source_entries)
      || !sameJson(manifest.artifact_entries, snapshot.data.artifact_entries)) {
    throw failure(
      'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
      'CIS manifest 与 canonical snapshot 不一致',
      { snapshot_id: snapshot.data.id },
    );
  }
}

export async function loadCanonicalSnapshot(workspace, snapshotOrId) {
  const root = path.resolve(workspace);
  const snapshot = typeof snapshotOrId === 'string'
    ? await findCanonicalObject(root, snapshotOrId, 'cycle_input_snapshot')
    : snapshotOrId;
  if (snapshot.data.record_type !== 'cycle_input_snapshot') {
    throw failure('TRACE_INCOMPLETE', '目标不是 CIS', { ref: snapshot.data.id });
  }
  const manifestPath = `runs/${snapshot.data.run_ref}/${snapshot.data.manifest.artifact_path}`;
  const manifestBytes = await readFile(resolveWithin(root, manifestPath));
  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch {
    throw failure('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS manifest 不是合法 JSON');
  }
  validateManifest(snapshot, manifest, manifestBytes);
  const entries = new Map();
  for (const entry of snapshot.data.source_entries ?? []) {
    const copyPath = `runs/${snapshot.data.run_ref}/${entry.snapshot_path}`;
    const bytes = await readFile(resolveWithin(root, copyPath));
    const parsed = matter(bytes.toString('utf8'));
    if (sha256(bytes) !== entry.snapshot_sha256
        || entry.snapshot_sha256 !== entry.file_sha256
        || parsed.data.id !== entry.object_id
        || parsed.data.record_type !== entry.record_type
        || String(parsed.data.version) !== entry.object_version) {
      throw failure('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS source copy 漂移', {
        entry_key: entry.entry_key,
      });
    }
    entries.set(entry.entry_key, {
      ...entry,
      data: parsed.data,
      content: parsed.content,
      bytes,
      copy_path: copyPath,
    });
  }
  const artifacts = new Map();
  for (const entry of snapshot.data.artifact_entries ?? []) {
    const copyPath = `runs/${snapshot.data.run_ref}/${entry.snapshot_path}`;
    const bytes = await readFile(resolveWithin(root, copyPath));
    if (sha256(bytes) !== entry.snapshot_sha256) {
      throw failure('CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH', 'CIS artifact copy 漂移', {
        entry_key: entry.entry_key,
      });
    }
    artifacts.set(entry.entry_key, { ...entry, bytes, copy_path: copyPath });
  }
  return { snapshot, manifest, entries, artifacts };
}

export function entryTuple(entry) {
  return {
    entry_key: entry.entry_key,
    object_id: entry.object_id,
    record_type: entry.record_type,
    object_version: entry.object_version,
    file_sha256: entry.file_sha256,
  };
}

export function entryIdentity(entry) {
  return {
    object_id: entry.object_id,
    record_type: entry.record_type,
    object_version: entry.object_version,
    file_sha256: entry.file_sha256,
  };
}

export async function existingBytes(workspace, relative) {
  assertSafeRelativePath(relative);
  try {
    return await readFile(resolveWithin(path.resolve(workspace), relative));
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'PATH_NOT_FOUND') return null;
    throw error;
  }
}

export async function assertCreateOnlyTargets(workspace, targets, conflictCode) {
  const seen = new Set();
  for (const target of targets) {
    assertSafeRelativePath(target.path);
    if (seen.has(target.path)) {
      throw failure(conflictCode, 'materialization target path 重复', { path: target.path });
    }
    seen.add(target.path);
    const current = await existingBytes(workspace, target.path);
    if (current && !current.equals(Buffer.from(target.bytes))) {
      throw failure(conflictCode, 'create-only target bytes 冲突', { path: target.path });
    }
  }
}

export function makeFailure(code, message, details = {}) {
  return failure(code, message, details);
}
