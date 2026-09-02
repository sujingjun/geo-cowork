import { readFile } from 'node:fs/promises';

import matter from 'gray-matter';

import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  assertNoSymlinkPath,
  resolveWithin,
  sha256,
  stableStringify,
} from './workspace-paths.mjs';

class BrowserQueryCycleError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'BrowserQueryCycleError';
    this.code = code;
    Object.assign(this, details);
  }
}

function fail(code, message, details = {}) {
  throw new BrowserQueryCycleError(code, message, details);
}

async function readFrozenSnapshotObject(workspace, snapshot, entry) {
  const relativePath = `runs/${snapshot.run_ref}/${entry.snapshot_path}`;
  await assertNoSymlinkPath(workspace, relativePath);
  const bytes = await readFile(resolveWithin(workspace, relativePath));
  const { entry_key: entryKey, ...entryPayload } = entry;
  if (sha256(bytes) !== entry.snapshot_sha256
      || entry.snapshot_sha256 !== entry.file_sha256
      || sha256(stableStringify(entryPayload)) !== entryKey) {
    fail(
      'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
      'Cycle snapshot object checksum 或 entry key 漂移',
      { path: relativePath },
    );
  }
  const parsed = matter(bytes.toString('utf8')).data;
  if (parsed.id !== entry.object_id || parsed.record_type !== entry.record_type
      || String(parsed.version) !== entry.object_version) {
    fail(
      'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
      'Cycle snapshot object identity 漂移',
      { path: relativePath },
    );
  }
  return parsed;
}

async function validateSnapshotManifest(workspace, snapshot) {
  const relativePath = `runs/${snapshot.run_ref}/${snapshot.manifest.artifact_path}`;
  await assertNoSymlinkPath(workspace, relativePath);
  const bytes = await readFile(resolveWithin(workspace, relativePath));
  if (sha256(bytes) !== snapshot.manifest.sha256) {
    fail(
      'CYCLE_INPUT_SNAPSHOT_CHECKSUM_MISMATCH',
      'Cycle snapshot manifest checksum 漂移',
      { path: relativePath },
    );
  }
}

export async function loadBrowserQueryCycle({ workspace, plan }) {
  const graph = await loadWorkspaceGraph({ workspace });
  const cycle = graph.byId.get(plan.cycle_ref)?.data;
  if (!cycle || cycle.record_type !== 'cycle' || cycle.status !== 'active'
      || cycle.version !== plan.cycle_version) {
    fail(
      'CYCLE_INPUT_NOT_READY',
      'Query task 必须引用 active Cycle 的精确版本',
      { cycle_ref: plan.cycle_ref },
    );
  }
  const snapshotVersion = cycle.core_versions?.input_snapshot;
  const snapshot = graph.byId.get(snapshotVersion?.ref)?.data;
  if (!snapshot || snapshot.record_type !== 'cycle_input_snapshot'
      || snapshot.status !== 'recorded' || snapshot.snapshot_kind !== 'freeze'
      || snapshot.cycle_ref !== cycle.id || snapshot.version !== snapshotVersion?.version) {
    fail('CYCLE_INPUT_NOT_READY', 'Cycle 的 frozen input snapshot 缺失或版本漂移');
  }
  await validateSnapshotManifest(workspace, snapshot);
  const trackKeys = new Set((cycle.goal_tracks ?? []).map((track) => track.query_set_entry_key));
  const boundEntry = snapshot.source_entries.find((entry) =>
    entry.record_type === 'query_set'
      && trackKeys.has(entry.entry_key)
      && entry.object_id === plan.query_set.ref
      && entry.object_version === plan.query_set.version);
  if (!boundEntry) {
    fail(
      'CYCLE_QUERY_SET_MISMATCH',
      'Query Set 不是 Cycle frozen snapshot 中绑定的精确版本',
      { cycle_ref: cycle.id, query_set_ref: plan.query_set.ref },
    );
  }
  const querySet = await readFrozenSnapshotObject(workspace, snapshot, boundEntry);
  if (querySet.status !== 'frozen' || !Array.isArray(querySet.query_versions)
      || querySet.query_versions.length === 0) {
    fail('QUERY_SET_NOT_READY', 'Query Set 必须为非空 frozen 集合');
  }
  const queries = await Promise.all(querySet.query_versions.map(async (version) => {
    const queryEntry = snapshot.source_entries.find((entry) =>
      entry.record_type === 'query'
        && entry.object_id === version.ref
        && entry.object_version === version.version);
    const query = queryEntry
      ? await readFrozenSnapshotObject(workspace, snapshot, queryEntry)
      : null;
    if (!query || query.status !== 'formal' || typeof query.query_text !== 'string'
        || !query.query_text.trim()) {
      fail(
        'QUERY_SET_NOT_READY',
        'Query Set 包含缺失、非 formal 或版本漂移的 Query',
        { query_ref: version.ref },
      );
    }
    return {
      ref: query.id,
      version: query.version,
      query_text: query.query_text,
      language: query.language,
      intent: query.intent,
    };
  }));
  return {
    queries,
    cycle_binding: {
      cycle: { ref: cycle.id, version: cycle.version },
      input_snapshot: { ref: snapshot.id, version: snapshot.version },
      query_set_entry_key: boundEntry.entry_key,
    },
  };
}
