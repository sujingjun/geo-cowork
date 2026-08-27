import {
  readMarkdownObject,
  serializeMarkdownObject,
  validateObjectData,
} from './object-contract.mjs';
import { loadWorkspaceGraph } from './index-builder.mjs';
import {
  M5_SOURCE_CLASSIFICATION_THRESHOLD,
  sourceClassificationQueueStatus,
} from './m5-policy.mjs';
import { atomicWrite, resolveWithin } from './workspace-paths.mjs';

function bumpPatch(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

function observedSourceIds(graph) {
  return new Set(graph.objects
    .filter(({ data }) => data.record_type === 'citation_observation'
      && data.status !== 'superseded')
    .map(({ data }) => data.source_ref));
}

async function rewriteObject({ workspace, object, patch, now }) {
  const current = await readMarkdownObject(resolveWithin(workspace, object.path), { workspace });
  const data = {
    ...current.data,
    ...patch,
    version: bumpPatch(current.data.version),
    updated_at: now,
  };
  validateObjectData(data, { path: object.path });
  await atomicWrite(
    workspace,
    object.path,
    serializeMarkdownObject(data, current.content),
  );
  return data;
}

export async function archiveObservedSourcesForBatchClassification({
  workspace,
  decisionRef,
  now,
  threshold = M5_SOURCE_CLASSIFICATION_THRESHOLD,
}) {
  if (threshold !== M5_SOURCE_CLASSIFICATION_THRESHOLD
      || !decisionRef?.startsWith('workspace://')) {
    const error = new Error('Source 批量分类策略必须使用 Workspace 决定与 100 条阈值');
    error.code = 'M5_FIELD_REQUIRED';
    throw error;
  }
  const graph = await loadWorkspaceGraph({ workspace });
  const sourceIds = observedSourceIds(graph);
  const status = sourceClassificationQueueStatus(sourceIds.size);
  let queued = 0;
  for (const sourceId of sourceIds) {
    const object = graph.byId.get(sourceId);
    if (!object || object.data.record_type !== 'source') continue;
    const expected = { status, threshold, decision_ref: decisionRef };
    if (JSON.stringify(object.data.classification_queue) === JSON.stringify(expected)) continue;
    await rewriteObject({
      workspace,
      object,
      patch: { classification_queue: expected },
      now,
    });
    queued += 1;
  }

  let supersededClassifications = 0;
  const supersededClassificationIds = new Set();
  for (const object of graph.objects) {
    if (object.data.record_type !== 'source_classification'
        || object.data.status === 'superseded'
        || !sourceIds.has(object.data.source_ref)) continue;
    await rewriteObject({ workspace, object, patch: { status: 'superseded' }, now });
    supersededClassifications += 1;
    supersededClassificationIds.add(object.data.id);
  }
  let supersededClaimSupports = 0;
  for (const object of graph.objects) {
    if (object.data.record_type !== 'claim_support_review'
        || object.data.status === 'superseded'
        || !supersededClassificationIds.has(object.data.classification_ref)) continue;
    await rewriteObject({ workspace, object, patch: { status: 'superseded' }, now });
    supersededClaimSupports += 1;
  }
  return {
    status,
    threshold,
    unique_source_count: sourceIds.size,
    remaining_to_batch: Math.max(0, threshold - sourceIds.size),
    queued_source_count: queued,
    superseded_classification_count: supersededClassifications,
    superseded_claim_support_count: supersededClaimSupports,
    decision_ref: decisionRef,
  };
}
