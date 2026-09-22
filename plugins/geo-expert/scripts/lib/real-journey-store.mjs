import { readFile, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import {
  resolveWithin,
  writeCreateOnly,
  stableStringify,
  sha256,
  assertNoSymlinkPath,
} from './workspace-paths.mjs';
import { requireReal } from './real-cycle-contract.mjs';

export const REAL_PLAN_PATH = 'cycles/preparation/real-cycle-plan.json';
export const objectPath = (folder, id) => `${folder}/${id.toLowerCase()}.md`;
export const ref = (o) => ({
  ref: o.data?.id ?? o.id,
  version: o.data?.version ?? o.version,
});
export async function jsonAt(workspace, relative, fallback) {
  try {
    return JSON.parse(
      await readFile(resolveWithin(workspace, relative), 'utf8'),
    );
  } catch (error) {
    if (error.code === 'ENOENT' && arguments.length === 3) return fallback;
    throw error;
  }
}
export async function putJson(workspace, relative, value) {
  await writeCreateOnly(workspace, relative, stableStringify(value, 2), {
    idempotent: true,
  });
  return { path: relative, sha256: sha256(stableStringify(value, 2)) };
}
export function realObject(
  id,
  type,
  status,
  title,
  now = new Date().toISOString(),
) {
  return {
    id,
    record_type: type,
    status,
    version: '1.0.0',
    title,
    created_at: now,
    updated_at: now,
  };
}
export async function putObject(workspace, folder, data, body = '') {
  const identity = await jsonAt(workspace, 'workspace.json');
  requireReal(
    identity.workspace_mode === 'online' &&
      identity.execution_scope === 'authorized_real' &&
      !data.test_scope &&
      data.execution_scope !== 'synthetic_test',
    'SYNTHETIC_REAL_REF_CONTAMINATION',
    'Real object requires an online workspace',
  );
  validateObjectData(data);
  const relative = objectPath(folder, data.id);
  await writeCreateOnly(
    workspace,
    relative,
    serializeMarkdownObject(data, body || `# ${data.title}\n`),
    { idempotent: true },
  );
  return { data, path: relative, content: body };
}
export async function realContext(workspace) {
  const identity = await jsonAt(workspace, 'workspace.json');
  requireReal(
    identity.workspace_mode === 'online' &&
      identity.execution_scope === 'authorized_real',
    'WORKSPACE_SCOPE_INVALID',
    'Real journey requires online/authorized_real',
  );
  const plan = await jsonAt(workspace, REAL_PLAN_PATH, null);
  const graph = await loadWorkspaceGraph({ workspace });
  const cycles = graph.objects
    .filter(
      (o) =>
        o.data.execution_scope === 'authorized_real' &&
        o.data.record_type === 'cycle',
    )
    .sort((a, b) => b.data.cycle_number - a.data.cycle_number);
  const latest = cycles[0];
  const runtime =
    plan && plan.cycle_number > (latest?.data.cycle_number ?? 0)
      ? plan
      : (latest?.data.extensions?.['geo.real_cycle'] ?? plan);
  const cycle = runtime ? graph.byId.get(runtime.cycle_ref) : latest;
  return { identity, plan: runtime, graph, cycle };
}
export async function assertRealAuthorization(
  workspace,
  plan,
  now = new Date(),
) {
  const control = await jsonAt(workspace, REAL_PLAN_PATH, null);
  requireReal(
    plan?.execution_paused !== true && control?.execution_paused !== true,
    'REAL_EXECUTION_PAUSED',
    'Owner paused real business execution; explicit resumption is required',
  );
  const auth = plan?.authorization;
  requireReal(
    auth?.ref?.startsWith('workspace://') &&
      /^[a-f0-9]{64}$/.test(auth.sha256 ?? '') &&
      Date.parse(auth.expires_at) > new Date(now).getTime(),
    'REAL_AUTHORIZATION_REQUIRED',
    'Current bounded execution authorization is required',
  );
  const bytes = await readFile(resolveWithin(workspace, auth.ref.slice(12)));
  requireReal(
    sha256(bytes) === auth.sha256,
    'REAL_AUTHORIZATION_DRIFT',
    'Execution authorization changed',
  );
  return auth;
}
export function approvalFrom(feedback) {
  return {
    approved_by: feedback.decision.actor,
    approved_at: feedback.decision.at,
    decision_ref: feedback.decision_ref,
  };
}

// A directory rename publishes each mutually-referencing group together. A crash
// never leaves a visible GCB without its GCDs, or a Goal without its Query Set.
export async function writeObjectBundle(workspace, runRef, folder, values) {
  requireReal(
    /^RUN-(?:[A-Z0-9]+-)*[A-Z0-9]+$/.test(runRef ?? '') && values?.length,
    'REAL_PLAN_INVALID',
    'Atomic object bundle requires an explicit Run and objects',
  );
  const objects = values.map((data) => {
    validateObjectData(data);
    return {
      data,
      path: `${folder}/${data.id.toLowerCase()}.md`,
      content: serializeMarkdownObject(data, `# ${data.title}\n`),
    };
  });
  const fingerprint = sha256(
    stableStringify(objects.map((o) => ({ path: o.path, content: o.content }))),
  );
  const stage = `runs/${runRef}/outputs/real-bundles/${fingerprint}`;
  let exists = false;
  try {
    await readFile(resolveWithin(workspace, objects[0].path));
    exists = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!exists) {
    for (const object of objects)
      await writeCreateOnly(
        workspace,
        `${stage}/${path.posix.basename(object.path)}`,
        object.content,
        { idempotent: true },
      );
    const parent = path.posix.dirname(folder);
    await assertNoSymlinkPath(workspace, parent, { allowMissingLeaf: true });
    await mkdir(resolveWithin(workspace, parent), { recursive: true });
    await assertNoSymlinkPath(workspace, folder, { allowMissingLeaf: true });
    try {
      await rename(
        resolveWithin(workspace, stage),
        resolveWithin(workspace, folder),
      );
    } catch (error) {
      if (!['EEXIST', 'ENOTEMPTY'].includes(error.code)) throw error;
    }
  }
  for (const object of objects)
    requireReal(
      (await readFile(resolveWithin(workspace, object.path), 'utf8')) ===
        object.content,
      'GOAL_CANDIDATE_BATCH_CONFLICT',
      'Published bundle differs from the approved immutable objects',
    );
  return objects.map((o) => ({ ...o, content: `# ${o.data.title}\n` }));
}
