import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, rm, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRealSamplingWorkspace } from './helpers/real-sampling-fixtures.mjs';
import {
  formalSlots,
  receiveFormalAnswer,
  aggregateRealSamples,
} from '../plugins/geo-expert/scripts/lib/real-sampling.mjs';
import { executeRealJourney } from '../plugins/geo-expert/scripts/lib/real-journey.mjs';
import {
  realContext,
  jsonAt,
} from '../plugins/geo-expert/scripts/lib/real-journey-store.mjs';
import {
  advanceRealCycle,
  assertRealSamplingGate,
} from '../plugins/geo-expert/scripts/lib/real-cycle-progress.mjs';
import { advanceCycle } from '../plugins/geo-expert/scripts/lib/cycle-lifecycle.mjs';
import { traceCycle } from '../plugins/geo-expert/scripts/lib/cycle-trace.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  sha256,
  stableStringify,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

let baseline;
test.before(async () => {
  baseline = await createRealSamplingWorkspace();
  const slots = await formalSlots(baseline, 'baseline');
  for (const [i, slot] of slots.entries()) {
    const origin = {
      chatgpt: 'https://chatgpt.com',
      gemini: 'https://gemini.google.com',
      perplexity: 'https://www.perplexity.ai',
      google_ai: 'https://www.google.com',
      claude: 'https://claude.ai',
    }[slot.platform];
    await receiveFormalAnswer(baseline, {
      ...slot,
      slot_id: slot.id,
      synthetic: false,
      captured_at: new Date().toISOString(),
      result_url: `${origin}/contract-test/${slot.ordinal}`,
      conversation_id: `contract-test-${slot.platform}-${slot.ordinal}`,
      outcome: 'no_result',
      answer_text: '',
      citations:
        i === 0
          ? [
              {
                occurrence_ordinal: 1,
                url: 'https://www.myyshop.com/about',
                title: 'Isolated contract-test source',
                context: 'Source panel in an isolated no-answer state fixture',
              },
            ]
          : [],
      browser_conditions: { conversation_state: 'new', model_mode: 'unknown' },
    });
  }
});
test.after(async () => {
  if (baseline) await rm(baseline, { recursive: true, force: true });
});
async function copyBaseline(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-real-progress-'));
  await cp(baseline, root, { recursive: true });
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}
async function approveReviews(root) {
  const waiting = await executeRealJourney({
    command: 'continue',
    workspace: root,
  });
  assert.equal(waiting.waiting_human, true);
  const file = waiting.reviews[0].package;
  const packageBytes = await readFile(
    path.join(root, file.replace(/\.md$/, '.json')),
    'utf8',
  );
  const pack = JSON.parse(packageBytes);
  const feedback = `包：${pack.id}\n校验：${sha256(packageBytes)}\n决定：approve\n决定人：Isolated contract-test reviewer\n时间：${new Date().toISOString()}\n说明：State-contract fixture only; no business approval or external observation.\n`;
  const feedbackFile = path.join(root, 'reviews/feedback/state-contract.md');
  await writeFile(feedbackFile, feedback);
  const applied = await executeRealJourney({
    command: 'apply-feedback',
    workspace: root,
    file: feedbackFile,
  });
  assert.equal(applied.reviewed, 10);
  return { pack, feedbackFile };
}
async function gateObjects(root) {
  const aggs = await aggregateRealSamples(root, 'baseline'),
    { graph } = await realContext(root),
    slots = await formalSlots(root, 'baseline');
  return [
    ...slots.map((s) => graph.byId.get(s.sample_ref)),
    ...slots.map((s) =>
      graph.byId.get(s.sample_ref.replace(/^SMP-/, 'ARV-') + '-REVIEWED'),
    ),
    ...aggs,
  ];
}
async function prepared(t) {
  const root = await copyBaseline(t);
  await approveReviews(root);
  return root;
}
async function writeObject(root, object) {
  await writeFile(
    path.join(root, object.path),
    serializeMarkdownObject(object.data, object.content),
  );
}

test('full five-platform two-slot baseline advances only after exact Owner review, then freezes Matrix and trace evidence', async (t) => {
  const root = await copyBaseline(t);
  const first = await executeRealJourney({
    command: 'continue',
    workspace: root,
  });
  const packagePath = first.reviews[0].package;
  const beforePackage = await readFile(path.join(root, packagePath));
  const repeat = await executeRealJourney({
    command: 'continue',
    workspace: root,
  });
  assert.equal(repeat.waiting_human, true);
  assert.deepEqual(await readFile(path.join(root, packagePath)), beforePackage);
  const { feedbackFile } = await approveReviews(root);
  assert.equal(
    (
      await executeRealJourney({
        command: 'apply-feedback',
        workspace: root,
        file: feedbackFile,
      })
    ).replay,
    true,
  );
  await executeRealJourney({ command: 'continue', workspace: root });
  const { cycle, plan, graph } = await realContext(root);
  assert.equal(cycle.data.aggregate_stage, 'baseline_recorded');
  assert.equal(cycle.data.transition_refs.length, 1);
  const matrix = await jsonAt(root, `${plan.cycle_dir}/matrix-baseline.json`);
  assert.deepEqual(matrix.slots, await formalSlots(root, 'baseline'));
  assert.equal(matrix.slots.length, 10);
  const transition = graph.byId.get(cycle.data.transition_refs[0]);
  const snapshot = graph.byId.get(
    transition.data.gate_snapshot_version.ref,
  ).data;
  const artifactPaths = new Set(
    snapshot.artifact_entries.map((a) => a.source_path),
  );
  assert.ok(artifactPaths.has(`${plan.cycle_dir}/matrix-baseline.json`));
  for (const slot of matrix.slots)
    assert.ok(artifactPaths.has(`runs/${slot.run_ref}/raw/capture.json`));
  for (const entry of snapshot.artifact_entries)
    assert.equal(
      sha256(
        await readFile(
          path.join(root, 'runs', snapshot.run_ref, entry.snapshot_path),
        ),
      ),
      entry.snapshot_sha256,
    );
  const ids = new Set(snapshot.source_entries.map((s) => s.object_id));
  assert.ok(
    ids.has(`CIT-${matrix.slots[0].sample_ref.slice(4)}-1`),
    'snapshot must pin canonical citations',
  );
  assert.ok(
    snapshot.source_entries.some(
      (s) => s.record_type === 'source' && s.object_id.startsWith('SRC-REAL-'),
    ),
    'snapshot must pin citation sources',
  );
  const trace = await traceCycle({
    workspace: root,
    cycleId: cycle.data.id,
    active: true,
  });
  assert.deepEqual(trace.errors, []);
  assert.equal(trace.lifecycle_ready, false);
  const beforeCycle = await readFile(path.join(root, cycle.path));
  const replay = await advanceRealCycle(
    root,
    'baseline_recorded',
    await gateObjects(root),
  );
  assert.equal(replay.applied, true);
  assert.deepEqual(await readFile(path.join(root, cycle.path)), beforeCycle);
  const rawCopy = snapshot.artifact_entries.find((a) =>
    a.source_path.endsWith('/raw/capture.json'),
  );
  const copyPath = path.join(
    root,
    'runs',
    snapshot.run_ref,
    rawCopy.snapshot_path,
  );
  const originalCopy = await readFile(copyPath);
  await writeFile(
    copyPath,
    Buffer.concat([originalCopy, Buffer.from('\nchanged')]),
  );
  const brokenTrace = await traceCycle({
    workspace: root,
    cycleId: cycle.data.id,
    active: true,
  });
  assert.ok(
    brokenTrace.errors.length > 0,
    'trace must reject a changed archived capture',
  );
  await writeFile(copyPath, originalCopy);
  assert.deepEqual(
    (
      await traceCycle({
        workspace: root,
        cycleId: cycle.data.id,
        active: true,
      })
    ).errors,
    [],
  );
});

test('formal gate rejects omitted sample or reviewed successor without advancing Cycle', async (t) => {
  for (const kind of ['answer_sample', 'answer_review']) {
    const root = await prepared(t),
      objects = await gateObjects(root),
      { cycle } = await realContext(root);
    const target = objects.find((o) => o.data.record_type === kind);
    await assert.rejects(
      advanceRealCycle(
        root,
        'baseline_recorded',
        objects.filter((o) => o.data.id !== target.data.id),
      ),
      (e) =>
        [
          'CYCLE_GATE_REQUIRED',
          'ANALYSIS_CHAIN_INCOMPLETE',
          'RUBRIC_DRIFT',
          'AGGREGATION_INPUT_DRIFT',
        ].includes(e.code),
    );
    assert.equal(
      (await realContext(root)).cycle.data.aggregate_stage,
      'frozen',
    );
    assert.equal(
      (await realContext(root)).cycle.data.version,
      cycle.data.version,
    );
  }
});

test('formal gate rejects a missing canonical citation even when the raw and sample remain unchanged', async (t) => {
  const root = await prepared(t),
    objects = await gateObjects(root),
    { graph } = await realContext(root);
  const citation = graph.objects.find(
    (o) => o.data.record_type === 'citation_observation',
  );
  // Keep the graph well-formed so this is the complete raw/canonical check, not only a dangling-ref failure.
  for (const aggregate of objects.filter(
    (o) => o.data.record_type === 'answer_aggregation',
  )) {
    aggregate.data.citation_versions = [];
    aggregate.data.classification_versions = [];
    await writeObject(root, aggregate);
  }
  const source = graph.byId.get(citation.data.source_ref);
  delete source.data.discovery;
  delete source.data.identity;
  await writeObject(root, source);
  await rm(path.join(root, citation.path));
  await assert.rejects(
    advanceRealCycle(root, 'baseline_recorded', await gateObjects(root)),
    { code: 'CITATION_SOURCE_PAIR_INCOMPLETE' },
  );
  assert.equal((await realContext(root)).cycle.data.aggregate_stage, 'frozen');
});

test('formal gate rejects window drift even if the raw file and its declared checksum are changed together', async (t) => {
  const root = await prepared(t),
    objects = await gateObjects(root),
    sample = objects.find((o) => o.data.record_type === 'answer_sample');
  const binding = sample.data.extensions['geo.real_capture'];
  const raw = await jsonAt(root, binding.raw_path);
  raw.window.ends_at = new Date(
    Date.parse(raw.window.ends_at) + 86400000,
  ).toISOString();
  const bytes = stableStringify(raw, 2);
  await writeFile(path.join(root, binding.raw_path), bytes);
  binding.raw_sha256 = sha256(bytes);
  await writeObject(root, sample);
  await assert.rejects(
    advanceRealCycle(root, 'baseline_recorded', await gateObjects(root)),
    { code: 'FORMAL_SLOT_MISMATCH' },
  );
  assert.equal((await realContext(root)).cycle.data.aggregate_stage, 'frozen');
});

test('formal gate requires exactly one byte-verified frozen matrix with the current full slot contract', async (t) => {
  const root = await prepared(t),
    objects = await gateObjects(root),
    { cycle, plan } = await realContext(root);
  const matrixPath = `${plan.cycle_dir}/matrix-contract-check.json`;
  const matrix = {
    schema_version: 'geo-real-sampling-matrix-v1',
    cycle_ref: cycle.data.id,
    slots: await formalSlots(root, 'baseline'),
  };
  const bytes = stableStringify(matrix, 2);
  await writeFile(path.join(root, matrixPath), bytes);
  const artifact = { source_path: matrixPath, source_sha256: sha256(bytes) };
  const snapshot = { cycle_ref: cycle.data.id, artifact_entries: [artifact] };
  await assertRealSamplingGate(
    root,
    snapshot,
    'baseline_recorded',
    objects.map((o) => o.data),
  );
  await assert.rejects(
    assertRealSamplingGate(
      root,
      { ...snapshot, artifact_entries: [] },
      'baseline_recorded',
      objects.map((o) => o.data),
    ),
    { code: 'CYCLE_GATE_REQUIRED' },
  );
  await assert.rejects(
    assertRealSamplingGate(
      root,
      { ...snapshot, artifact_entries: [artifact, artifact] },
      'baseline_recorded',
      objects.map((o) => o.data),
    ),
    { code: 'CYCLE_GATE_REQUIRED' },
  );
  matrix.slots[0].query_text = 'Changed question';
  await writeFile(path.join(root, matrixPath), stableStringify(matrix, 2));
  await assert.rejects(
    assertRealSamplingGate(
      root,
      snapshot,
      'baseline_recorded',
      objects.map((o) => o.data),
    ),
    { code: 'CYCLE_GATE_REQUIRED' },
  );
  const altered = await readFile(path.join(root, matrixPath));
  await assert.rejects(
    assertRealSamplingGate(
      root,
      {
        ...snapshot,
        artifact_entries: [{ ...artifact, source_sha256: sha256(altered) }],
      },
      'baseline_recorded',
      objects.map((o) => o.data),
    ),
    { code: 'CYCLE_GATE_REQUIRED' },
  );
});

test('phase recovery applies one persisted transition intent and repeated resume keeps the same Cycle bytes', async (t) => {
  const root = await prepared(t),
    objects = await gateObjects(root);
  const recovery = await mkdtemp(
    path.join(os.tmpdir(), 'geo-real-phase-recovery-'),
  );
  t.after(() => rm(recovery, { recursive: true, force: true }));
  await cp(root, recovery, { recursive: true });
  await advanceRealCycle(root, 'baseline_recorded', objects);
  const { plan } = await realContext(root),
    requestPath = `${plan.cycle_dir}/transitions/baseline_recorded.json`,
    matrixPath = `${plan.cycle_dir}/matrix-baseline.json`;
  const request = await jsonAt(root, requestPath);
  await writeFile(
    path.join(recovery, matrixPath),
    await readFile(path.join(root, matrixPath)),
  );
  // Seed the exact public transition request generated by the normal path.
  const { mkdir } = await import('node:fs/promises');
  await mkdir(path.dirname(path.join(recovery, requestPath)), {
    recursive: true,
  });
  await writeFile(
    path.join(recovery, requestPath),
    await readFile(path.join(root, requestPath)),
  );
  await assert.rejects(
    advanceCycle({
      workspace: recovery,
      plan: {
        ...request,
        fault_after: 'transition_intent_written',
        lease: { ...request.lease, now: new Date().toISOString() },
      },
    }),
    { code: 'FAULT_INJECTED' },
  );
  const interrupted = await realContext(recovery);
  assert.equal(interrupted.cycle.data.aggregate_stage, 'frozen');
  assert.equal(interrupted.cycle.data.transition_refs.length, 0);
  assert.ok(interrupted.graph.byId.has(request.transition_id));
  await advanceRealCycle(
    recovery,
    'baseline_recorded',
    await gateObjects(recovery),
  );
  const completed = await realContext(recovery),
    before = await readFile(path.join(recovery, completed.cycle.path));
  assert.equal(completed.cycle.data.aggregate_stage, 'baseline_recorded');
  assert.deepEqual(completed.cycle.data.transition_refs, [
    request.transition_id,
  ]);
  await advanceRealCycle(
    recovery,
    'baseline_recorded',
    await gateObjects(recovery),
  );
  assert.deepEqual(
    await readFile(path.join(recovery, completed.cycle.path)),
    before,
  );
  assert.deepEqual(
    (
      await traceCycle({
        workspace: recovery,
        cycleId: completed.cycle.data.id,
        active: true,
      })
    ).errors,
    [],
  );
});

test('phase recovery reuses a completed gate snapshot after interruption before transition intent', async (t) => {
  const root = await prepared(t),
    objects = await gateObjects(root),
    before = await realContext(root);
  const beforeCycle = await readFile(path.join(root, before.cycle.path));
  await advanceRealCycle(root, 'baseline_recorded', objects);
  const after = await realContext(root),
    transition = after.graph.byId.get(after.cycle.data.transition_refs[0]);
  const snapshot = after.graph.byId.get(
    transition.data.gate_snapshot_version.ref,
  );
  const snapshotBefore = await readFile(path.join(root, snapshot.path));
  // The crash boundary is after gate CIS and copies, before the intent exists.
  await writeFile(path.join(root, before.cycle.path), beforeCycle);
  await rm(path.join(root, transition.path));
  await executeRealJourney({ command: 'continue', workspace: root });
  const resumed = await realContext(root);
  assert.equal(resumed.cycle.data.aggregate_stage, 'baseline_recorded');
  assert.equal(resumed.cycle.data.transition_refs.length, 1);
  assert.deepEqual(
    await readFile(path.join(root, snapshot.path)),
    snapshotBefore,
  );
  assert.deepEqual(
    (
      await traceCycle({
        workspace: root,
        cycleId: resumed.cycle.data.id,
        active: true,
      })
    ).errors,
    [],
  );
});
