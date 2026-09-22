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
      ...(queue[i].data.record_type === 'answer_sample'
        ? graph.objects
            .filter(
              (o) =>
                o.data.record_type === 'citation_observation' &&
                o.data.sample_ref === queue[i].data.id &&
                o.data.status === 'observed',
            )
            .map((o) => o.data.id)
        : []),
      ...(queue[i].data.record_type === 'citation_observation'
        ? [queue[i].data.source_ref]
        : []),
    ]) {
      const object = graph.byId.get(ref);
      if (
        object &&
        !found.has(ref) &&
        ['source', 'evidence', 'document', 'citation_observation'].includes(
          object.data.record_type,
        )
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
    if (data.record_type === 'analytics_observation')
      for (const artifact of data.artifacts)
        await add(
          artifact.path.startsWith('runs/')
            ? artifact.path
            : `runs/${data.run_ref}/${artifact.path}`,
          artifact.sha256,
        );
    for (const key of ['geo.real_diagnosis', 'geo.real_adoption']) {
      const binding = data.extensions?.[key];
      for (const item of binding?.input_bindings ?? [])
        await add(item.path, item.sha256);
      for (const item of binding?.artifacts ?? [])
        await add(item.path, item.sha256);
    }
    const revision = data.extensions?.['geo.revision'];
    if (revision?.support_path)
      await add(revision.support_path, revision.support_sha256);
    if (
      data.record_type === 'run' &&
      data.skill === 'geo-site-technical-retest'
    ) {
      const prefix = `runs/${data.id}/`;
      for (const file of [
        'outputs/technical-completion.json',
        'outputs/technical-readback.json',
      ])
        await add(`${prefix}${file}`);
      const report = JSON.parse(
        await readFile(
          resolveWithin(workspace, `${prefix}outputs/technical-readback.json`),
          'utf8',
        ),
      );
      await add(report.manifest.path, report.manifest.sha256);
      const manifest = JSON.parse(
        await readFile(resolveWithin(workspace, report.manifest.path), 'utf8'),
      );
      for (const entry of Object.values(manifest.snapshots ?? {}))
        if (entry?.path) await add(entry.path, entry.sha256);
    }
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
    if (proof) {
      await add(proof.path, proof.sha256);
      const content = JSON.parse(
        await readFile(resolveWithin(workspace, proof.path), 'utf8'),
      );
      if (content.synthetic === false && content.raw)
        await add(content.raw.path, content.raw.sha256);
    }
    const capture = data.extensions?.['geo.real_capture'];
    if (capture) await add(capture.raw_path, capture.raw_sha256);
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
