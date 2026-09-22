import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRealSamplingWorkspace } from './helpers/real-sampling-fixtures.mjs';
import {
  formalSlots,
  receiveFormalAnswer,
} from '../plugins/geo-expert/scripts/lib/real-sampling.mjs';
import { readRun } from '../plugins/geo-expert/scripts/lib/run-store.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import { loadWorkspaceGraph } from '../plugins/geo-expert/scripts/lib/index-builder.mjs';
import { validateAnswerWorkspace } from '../plugins/geo-expert/scripts/lib/answer-profile.mjs';
import {
  materializeCitationSourcePair,
  recoverCitationSourcePairs,
} from '../plugins/geo-expert/scripts/lib/source-registry.mjs';

const observation = (slot) => ({
  ...slot,
  slot_id: slot.id,
  synthetic: false,
  captured_at: new Date().toISOString(),
  result_url: `${slot.platform === 'claude' ? 'https://claude.ai' : 'https://chatgpt.com'}/c/${slot.ordinal}`,
  conversation_id: `conversation-${slot.ordinal}`,
  outcome: 'no_result',
  answer_text: '',
  citations: [],
  browser_conditions: { conversation_state: 'new', model_mode: 'unknown' },
});

test('formal receiver materializes nonanswer, completes an interrupted Run and replays unchanged canonical bytes', async (t) => {
  const root = await createRealSamplingWorkspace();
  t.after(() => rm(root, { recursive: true, force: true }));
  const slots = await formalSlots(root, 'baseline');
  assert.equal(slots.length, 10);
  const slot = slots.find((s) => s.platform === 'chatgpt' && s.ordinal === 1),
    raw = observation(slot);
  const first = await receiveFormalAnswer(root, raw);
  assert.equal(first.sample_ref, slot.sample_ref);
  let graph = await loadWorkspaceGraph({ workspace: root }),
    sample = graph.byId.get(slot.sample_ref);
  const before = await readFile(path.join(root, sample.path));
  assert.equal(
    (await readRun({ workspace: root, runId: slot.run_ref })).data.status,
    'completed',
  );
  // Simulate process death after canonical sample but before Run completion.
  const run = await readRun({ workspace: root, runId: slot.run_ref });
  run.data.status = 'running';
  run.data.completed_steps = [];
  await writeFile(
    path.join(root, `runs/${slot.run_ref}/run.md`),
    serializeMarkdownObject(run.data, run.content),
  );
  await receiveFormalAnswer(root, raw);
  await receiveFormalAnswer(root, raw);
  assert.deepEqual(await readFile(path.join(root, sample.path)), before);
  assert.equal(
    (await readRun({ workspace: root, runId: slot.run_ref })).data.status,
    'completed',
  );
  const validation = await validateAnswerWorkspace({ workspace: root });
  assert.deepEqual(
    validation.errors.filter(
      (e) => e.id === slot.run_ref || e.id === slot.sample_ref,
    ),
    [],
  );
  await assert.rejects(
    receiveFormalAnswer(root, {
      ...raw,
      browser_conditions: { conversation_state: 'new', model_mode: 'changed' },
    }),
    { code: 'OBJECT_CONFLICT' },
  );
  const manual = slots.find((s) => s.platform === 'claude' && s.ordinal === 1);
  await receiveFormalAnswer(root, observation(manual));
});

test('citation-first interruption repairs before graph loading and retains first source bytes', async (t) => {
  const root = await createRealSamplingWorkspace();
  t.after(() => rm(root, { recursive: true, force: true }));
  const slot = (await formalSlots(root, 'baseline'))[0];
  await receiveFormalAnswer(root, observation(slot));
  const sample = (await loadWorkspaceGraph({ workspace: root })).byId.get(
    slot.sample_ref,
  ).data;
  const occurrence = {
    id: 'CIT-REAL-RECOVERY-001',
    path: 'cycles/m5/citations/recovery.md',
    url_raw: 'https://www.myyshop.com/about',
    occurrence_index: 1,
    position: { kind: 'ui_order', order: 1 },
    anchor_or_context: 'Source shown',
    source: {
      id: 'SRC-REAL-RECOVERY-001',
      path: 'evidence/sources/recovery.md',
      name: 'myyshop.com',
      locator: 'https://www.myyshop.com/about',
      identity: {
        level: 'page',
        key: 'https://www.myyshop.com/about',
        citation_domain: 'myyshop.com',
        host_platform: 'none',
        publisher_name: 'unknown',
      },
    },
  };
  await assert.rejects(
    materializeCitationSourcePair({
      workspace: root,
      sample,
      occurrence,
      now: sample.captured_at,
      failAfter: 'citation',
    }),
    { code: 'INJECTED_FAILURE' },
  );
  await assert.rejects(loadWorkspaceGraph({ workspace: root }), {
    code: 'INDEX_VALIDATION_FAILED',
  });
  await recoverCitationSourcePairs(root);
  const before = await readFile(path.join(root, occurrence.source.path));
  await recoverCitationSourcePairs(root);
  await receiveFormalAnswer(root, observation(slot)).catch((e) => {
    assert.equal(e.code, 'OBJECT_CONFLICT');
  });
  assert.deepEqual(
    await readFile(path.join(root, occurrence.source.path)),
    before,
  );
  const graph = await loadWorkspaceGraph({ workspace: root });
  assert.equal(
    graph.byId.get(occurrence.id).data.source_ref,
    occurrence.source.id,
  );
});
