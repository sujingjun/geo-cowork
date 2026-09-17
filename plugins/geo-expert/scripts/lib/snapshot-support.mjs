import { readFile } from 'node:fs/promises';
import {
  resolveWithin,
  sha256,
  assertNoSymlinkPath,
} from './workspace-paths.mjs';

export function expandEvidenceObjects(graph, objects) {
  const found = new Map(objects.map((o) => [o.data.id, o]));
  const queue = [...objects];
  for (let i = 0; i < queue.length; i++)
    for (const ref of [
      ...(queue[i].data.evidence_refs ?? []),
      ...(queue[i].data.source_refs ?? []),
      ...(queue[i].data.document_refs ?? []),
    ]) {
      const object = graph.byId.get(ref);
      if (
        object &&
        !found.has(ref) &&
        ['source', 'evidence', 'document'].includes(object.data.record_type)
      ) {
        found.set(ref, object);
        queue.push(object);
      }
    }
  return [...found.values()];
}
export async function supportingArtifacts(workspace, graph, objects) {
  const artifacts = new Map();
  async function add(relative, expected) {
    if (!relative) return;
    await assertNoSymlinkPath(workspace, relative);
    const bytes = await readFile(resolveWithin(workspace, relative));
    if (expected && sha256(bytes) !== expected)
      throw Object.assign(new Error('Supporting artifact checksum changed'), {
        code: 'CYCLE_VERSION_DRIFT',
      });
    artifacts.set(relative, {
      role: 'supporting_artifact',
      path: relative,
      media_type: relative.endsWith('.json')
        ? 'application/json'
        : relative.endsWith('.html')
          ? 'text/html'
          : 'text/plain',
    });
  }
  for (const { data } of objects) {
    if (data.record_type === 'evidence' && data.snapshot)
      await add(data.snapshot.path, data.snapshot.sha256);
    const knowledge = data.extensions?.['geo.knowledge_input'];
    if (knowledge) {
      await add(knowledge.raw_path, knowledge.sha256);
      if (knowledge.original_path)
        await add(knowledge.original_path, knowledge.original_sha256);
    }
    const asset = data.extensions?.['geo.rehearsal'];
    if (asset?.raw_path) await add(asset.raw_path);
    if (
      data.record_type === 'source' &&
      data.locator?.startsWith('workspace://')
    )
      await add(data.locator.slice('workspace://'.length));
    if (data.record_type === 'answer_sample')
      for (const artifact of data.artifacts)
        if (artifact.availability === 'captured')
          await add(`runs/${data.run_ref}/${artifact.path}`, artifact.sha256);
    for (const key of ['geo.extraction', 'geo.analysis']) {
      const value = data.extensions?.[key];
      if (value) {
        await add(value.path, value.sha256);
        if (value.model_call)
          await add(`runs/model-calls/${value.model_call}.json`);
      }
    }
    const semantic = data.extensions?.['geo.semantic_analysis'];
    if (semantic?.raw_report) await add(semantic.raw_report);
    const proof = data.extensions?.['geo.publication_proof'];
    if (proof) await add(proof.path, proof.sha256);
    const previous = data.extensions?.['geo.feedback']?.predecessor;
    const prior = previous && graph.byId.get(previous.ref);
    if (prior) await add(prior.path);
    if (data.approval?.decision_ref?.startsWith('workspace://')) {
      const relative = data.approval.decision_ref.slice('workspace://'.length);
      await add(relative);
      if (relative.startsWith('reviews/decisions/')) {
        const decision = JSON.parse(
          await readFile(resolveWithin(workspace, relative), 'utf8'),
        );
        if (decision.package_id) {
          await add(
            `reviews/packages/${decision.package_id}.json`,
            decision.package_sha256,
          );
          await add(`reviews/packages/${decision.package_id}.md`);
        }
      }
    }
  }
  return [...artifacts.values()];
}
