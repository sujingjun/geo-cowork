import test from 'node:test';
import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';
import { m5ReadyWorkspace, m5FixturePlan } from './helpers/m5-fixtures.mjs';
import { collectFixtureCycle } from '../plugins/geo-expert/scripts/lib/answer-cycle.mjs';
import {
  materializeCitationSourcePair,
  refreshFormalSourceQueue,
} from '../plugins/geo-expert/scripts/lib/source-registry.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';

test('formal Source queue defers 99 identities, marks 100 batch-ready, and never manufactures classifications', async (t) => {
  const root = await m5ReadyWorkspace();
  t.after(() => rm(root, { recursive: true, force: true }));
  const result = await collectFixtureCycle({
      workspace: root,
      plan: m5FixturePlan(),
      stopAfter: 'samples',
    }),
    sample = result.samples[0];
  async function add(n) {
    const suffix = String(n).padStart(3, '0'),
      url = `https://source-${n}.example.test/page`;
    await materializeCitationSourcePair({
      workspace: root,
      sample,
      now: sample.captured_at,
      occurrence: {
        id: `CIT-QUEUE-${suffix}`,
        path: `cycles/m5/citations/queue-${suffix}.md`,
        occurrence_index: n,
        position: { kind: 'ui_order', order: n },
        url_raw: url,
        anchor_or_context: 'Queue state contract only',
        source: {
          id: `SRC-QUEUE-${suffix}`,
          path: `evidence/sources/queue-${suffix}.md`,
          name: `Queue source ${n}`,
          locator: url,
          identity: {
            level: 'page',
            key: url,
            citation_domain: `source-${n}.example.test`,
            host_platform: 'none',
            publisher_name: 'unknown',
          },
        },
      },
    });
  }
  for (let n = 1; n <= 99; n++) await add(n);
  const options = {
    sampleRef: sample.id,
    decisionRef: 'workspace://execution/source-queue-contract.json',
  };
  const first = await refreshFormalSourceQueue(
    root,
    sample.captured_at,
    options,
  );
  assert.equal(first.unique_source_count, 99);
  assert.equal(first.status, 'archived_unclassified');
  await add(100);
  const second = await refreshFormalSourceQueue(
    root,
    sample.captured_at,
    options,
  );
  assert.equal(second.unique_source_count, 100);
  assert.equal(second.status, 'batch_ready');
  const graph = await loadWorkspaceGraph({ workspace: root });
  for (let n = 1; n <= 100; n++)
    assert.equal(
      graph.byId.get(`SRC-QUEUE-${String(n).padStart(3, '0')}`).data
        .classification_queue.status,
      'batch_ready',
    );
  assert.equal(
    graph.objects.filter((o) =>
      ['source_classification', 'claim_support_review'].includes(
        o.data.record_type,
      ),
    ).length,
    0,
  );
  const versions = graph.objects
    .filter((o) => o.data.id.startsWith('SRC-QUEUE-'))
    .map((o) => [o.data.id, o.data.version]);
  await refreshFormalSourceQueue(root, sample.captured_at, options);
  const replay = await loadWorkspaceGraph({ workspace: root });
  for (const [id, version] of versions)
    assert.equal(replay.byId.get(id).data.version, version);
});
