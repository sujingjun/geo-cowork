import { readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';

import { serializeMarkdownObject } from './object-contract.mjs';
import { inputFingerprint } from './run-store.mjs';
import {
  atomicWrite,
  sha256,
  stableStringify,
  walkMarkdownFiles,
  writeCreateOnly,
} from './workspace-paths.mjs';

function runError(code, message) {
  const error = new Error(message);
  error.name = 'AnalyticsRunError';
  error.code = code;
  return error;
}

async function findObject(workspace, id) {
  for (const file of await walkMarkdownFiles(workspace, {
    ignore: (relative) => relative.startsWith('indexes/')
      || /^runs\/[^/]+\/(?:raw|outputs)(?:\/|$)/.test(relative),
  })) {
    const text = await readFile(file, 'utf8');
    if (!text.startsWith('---')) continue;
    const parsed = matter(text);
    if (parsed.data.id === id) {
      return {
        data: parsed.data,
        content: parsed.content,
        path: path.relative(workspace, file).split(path.sep).join('/'),
      };
    }
  }
  return null;
}

export async function createAnalyticsRun(root, plan, updatedAt, rawPath) {
  const existing = await findObject(root, plan.run_ref);
  if (existing) {
    if (existing.data.record_type !== 'run' || existing.data.skill !== 'geo-analytics'
        || existing.data.merchant_ref !== plan.merchant_ref
        || existing.data.cycle_ref !== plan.cycle_ref
        || existing.data.test_scope?.workspace_id !== plan.test_scope?.workspace_id) {
      throw runError('ANALYTICS_ARTIFACT_CONFLICT', 'Analytics Run identity/scope 冲突');
    }
    const [major, minor, patchVersion] = existing.data.version.split('.').map(Number);
    const effectiveUpdatedAt = Date.parse(updatedAt) < Date.parse(existing.data.updated_at)
      ? existing.data.updated_at : updatedAt;
    const data = {
      ...existing.data,
      status: 'running',
      version: `${major}.${minor}.${patchVersion + 1}`,
      updated_at: effectiveUpdatedAt,
      completed_steps: [...new Set([...existing.data.completed_steps, 'fixture_input_validated'])],
      output_artifacts: [...new Set([...existing.data.output_artifacts, rawPath])].sort(),
      business_result: 'not_evaluated',
      next_action: 'compute signals',
      lease: { ...existing.data.lease, heartbeat_at: effectiveUpdatedAt },
    };
    await atomicWrite(root, existing.path, serializeMarkdownObject(data, existing.content));
    return { result: { action: 'updated' }, run: data };
  }
  const refs = [];
  const versions = {};
  for (const ref of [plan.merchant_ref, plan.cycle_ref, plan.goal_ref]) {
    const object = await findObject(root, ref);
    if (object) {
      refs.push(ref);
      versions[ref] = object.data.version;
    }
  }
  const cycle = await findObject(root, plan.cycle_ref);
  const run = {
    id: plan.run_ref,
    record_type: 'run',
    status: 'running',
    version: '1.0.0',
    created_at: updatedAt,
    updated_at: updatedAt,
    title: 'Synthetic geo-analytics Run',
    test_scope: { ...plan.test_scope },
    skill: 'geo-analytics',
    skill_version: '1.0.0',
    input_refs: refs.sort(),
    input_versions: Object.fromEntries(Object.entries(versions).sort(([a], [b]) => a.localeCompare(b))),
    input_fingerprint: inputFingerprint(versions),
    completed_steps: ['fixture_input_validated'],
    output_artifacts: [rawPath],
    business_result: 'not_evaluated',
    next_action: 'compute signals',
    finding_refs: [], evidence_refs: [], asset_refs: [], failure_reason: null,
    merchant_ref: plan.merchant_ref,
    cycle_ref: plan.cycle_ref,
    cycle_version: cycle?.data.version ?? '1.0.0',
    transition_plan_sha256: sha256(stableStringify(plan)),
    lease: {
      scope_key: `${plan.cycle_ref}:analytics`,
      owner_id: `geo-analytics-${process.pid}`,
      revision: 1,
      acquired_at: updatedAt,
      heartbeat_at: updatedAt,
      expires_at: new Date(Date.parse(updatedAt) + 60_000).toISOString(),
    },
  };
  const result = await writeCreateOnly(
    root,
    `runs/${plan.run_ref}/run.md`,
    serializeMarkdownObject(run, '# Synthetic geo-analytics Run\n'),
    { idempotent: true, conflictCode: 'ANALYTICS_ARTIFACT_CONFLICT' },
  );
  return { result, run };
}

export async function completeAnalyticsRun(root, runRef, updatedAt) {
  const object = await findObject(root, runRef);
  if (!object || object.data.record_type !== 'run' || object.data.skill !== 'geo-analytics') {
    throw runError('BUSINESS_SIGNAL_INPUT_DRIFT', 'geo-analytics Run 不存在');
  }
  const effectiveUpdatedAt = Date.parse(updatedAt) < Date.parse(object.data.updated_at)
    ? object.data.updated_at : updatedAt;
  const data = {
    ...object.data,
    status: 'completed',
    version: object.data.version === '1.0.0' ? '1.0.1' : object.data.version,
    updated_at: effectiveUpdatedAt,
    completed_steps: [...new Set([
      ...object.data.completed_steps, 'observation_recorded', 'signal_computed',
    ])],
    business_result: 'partial',
    next_action: 'advance analytics gate',
    lease: { ...object.data.lease, heartbeat_at: effectiveUpdatedAt },
  };
  await atomicWrite(root, object.path, serializeMarkdownObject(data, object.content));
  return data;
}
