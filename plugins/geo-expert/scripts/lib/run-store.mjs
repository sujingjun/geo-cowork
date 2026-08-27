import path from 'node:path';

import {
  readMarkdownObject,
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  assertSafeRelativePath,
  atomicWrite,
  sha256,
  stableStringify,
  writeCreateOnly,
} from './workspace-paths.mjs';

const TRANSITIONS = {
  pending: ['running', 'cancelled', 'superseded'],
  running: ['waiting_human', 'blocked', 'completed', 'failed', 'cancelled', 'superseded'],
  waiting_human: ['running', 'failed', 'cancelled', 'superseded'],
  blocked: ['running', 'failed', 'cancelled', 'superseded'],
  failed: ['running', 'cancelled', 'superseded'],
  completed: [],
  cancelled: [],
  superseded: [],
};

export class RunStoreError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'RunStoreError';
    this.code = code;
    Object.assign(this, details);
  }
}

function sortedInputVersions(inputVersions) {
  return Object.fromEntries(Object.entries(inputVersions).sort(([a], [b]) => a.localeCompare(b)));
}

export function inputFingerprint(inputVersions) {
  return sha256(stableStringify(sortedInputVersions(inputVersions)));
}

function bumpPatch(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

function runRelativePath(runId) {
  return `runs/${runId}/run.md`;
}

export async function createRun({
  workspace,
  runId,
  skill,
  skillVersion,
  inputVersions,
  now,
  supersedesRef,
}) {
  const versions = sortedInputVersions(inputVersions);
  const data = {
    id: runId,
    record_type: 'run',
    status: 'pending',
    version: '1.0.0',
    created_at: now,
    updated_at: now,
    title: `${skill} run`,
    skill,
    skill_version: skillVersion,
    input_refs: Object.keys(versions),
    input_versions: versions,
    input_fingerprint: inputFingerprint(versions),
    completed_steps: [],
    output_artifacts: [],
    business_result: 'not_evaluated',
    next_action: 'start',
    finding_refs: [],
    evidence_refs: [],
    asset_refs: [],
    failure_reason: null,
    ...(supersedesRef ? { supersedes_ref: supersedesRef } : {}),
  };
  validateObjectData(data, { path: runRelativePath(runId) });
  const result = await writeCreateOnly(
    workspace,
    runRelativePath(runId),
    serializeMarkdownObject(data, `# Run ${runId}\n`),
    { idempotent: true, conflictCode: 'RUN_CONFLICT' },
  );
  return { ...result, data };
}

export async function readRun({ workspace, runId }) {
  const file = path.join(path.resolve(workspace), ...runRelativePath(runId).split('/'));
  try {
    return await readMarkdownObject(file, { workspace });
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'PATH_NOT_FOUND') {
      throw new RunStoreError('RUN_NOT_FOUND', 'Run 不存在', { run_id: runId });
    }
    throw error;
  }
}

export async function transitionRun({
  workspace,
  runId,
  status,
  now,
  businessResult,
  patch = {},
}) {
  const current = await readRun({ workspace, runId });
  if (status !== current.data.status && !(TRANSITIONS[current.data.status] ?? []).includes(status)) {
    throw new RunStoreError('INVALID_RUN_TRANSITION', 'Run 状态转移非法', {
      from: current.data.status,
      to: status,
    });
  }
  const data = {
    ...current.data,
    ...patch,
    status,
    updated_at: now,
    version: status === current.data.status && businessResult === undefined
      && Object.keys(patch).length === 0
      ? current.data.version
      : bumpPatch(current.data.version),
    ...(businessResult === undefined ? {} : { business_result: businessResult }),
  };
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) delete data[key];
  }
  validateObjectData(data, { path: runRelativePath(runId) });
  await atomicWrite(
    workspace,
    runRelativePath(runId),
    serializeMarkdownObject(data, current.content),
  );
  return { action: status === current.data.status ? 'kept' : 'updated', data };
}

export async function writeRunArtifact({
  workspace,
  runId,
  relativePath,
  content,
  idempotent = false,
  conflictCode = 'ARTIFACT_EXISTS',
}) {
  await readRun({ workspace, runId });
  const safe = assertSafeRelativePath(relativePath);
  if (!safe.startsWith('raw/') && !safe.startsWith('outputs/')) {
    throw new RunStoreError('PATH_ESCAPE', 'Run artifact 只允许写入 raw/ 或 outputs/');
  }
  const result = await writeCreateOnly(
    workspace,
    `runs/${runId}/${safe}`,
    content,
    { idempotent, conflictCode },
  );
  const run = await readRun({ workspace, runId });
  if (run.data.output_artifacts.includes(safe)) return result;
  const outputArtifacts = [...new Set([...run.data.output_artifacts, safe])].sort();
  await transitionRun({
    workspace,
    runId,
    status: run.data.status,
    now: run.data.updated_at,
    patch: { output_artifacts: outputArtifacts },
  });
  return result;
}

export async function resumeRun({
  workspace,
  runId,
  currentInputVersions,
  newRunId,
  now,
}) {
  const old = await readRun({ workspace, runId });
  const fingerprint = inputFingerprint(currentInputVersions);
  if (old.data.input_fingerprint === fingerprint) {
    await transitionRun({ workspace, runId, status: 'running', now });
    return { action: 'resume', run_id: runId };
  }
  if (old.data.status === 'superseded') {
    if (old.data.superseded_by_ref !== newRunId) {
      throw new RunStoreError('RUN_CONFLICT', '旧 Run 已由另一 Run supersede');
    }
    const existing = await readRun({ workspace, runId: newRunId });
    if (existing.data.input_fingerprint !== fingerprint) {
      throw new RunStoreError('RUN_CONFLICT', '新 Run ID 对应不同输入');
    }
    return { action: 'superseded', old_run_id: runId, new_run_id: newRunId };
  }
  try {
    const existing = await readRun({ workspace, runId: newRunId });
    if (existing.data.input_fingerprint !== fingerprint
        || existing.data.supersedes_ref !== runId) {
      throw new RunStoreError('RUN_CONFLICT', '新 Run ID 对应不同输入或旧 Run');
    }
  } catch (error) {
    if (error.code !== 'RUN_NOT_FOUND') throw error;
    await createRun({
      workspace,
      runId: newRunId,
      skill: old.data.skill,
      skillVersion: old.data.skill_version,
      inputVersions: currentInputVersions,
      now,
      supersedesRef: runId,
    });
  }
  await transitionRun({
    workspace,
    runId,
    status: 'superseded',
    now,
    patch: { superseded_by_ref: newRunId, next_action: `continue with ${newRunId}` },
  });
  return { action: 'superseded', old_run_id: runId, new_run_id: newRunId };
}
