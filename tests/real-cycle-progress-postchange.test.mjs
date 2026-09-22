import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, rm, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRealSamplingWorkspace } from './helpers/real-sampling-fixtures.mjs';
import {
  realContext,
  realObject,
  putObject,
  putJson,
  jsonAt,
} from '../plugins/geo-expert/scripts/lib/real-journey-store.mjs';
import {
  formalSlots,
  receiveFormalAnswer,
  reviewRealSamples,
  approveRealAnswers,
  aggregateRealSamples,
} from '../plugins/geo-expert/scripts/lib/real-sampling.mjs';
import { assertRealSamplingGate } from '../plugins/geo-expert/scripts/lib/real-cycle-progress.mjs';
import { buildObservationSchedule } from '../plugins/geo-expert/scripts/lib/real-cycle-contract.mjs';
import {
  createRun,
  transitionRun,
} from '../plugins/geo-expert/scripts/lib/run-store.mjs';
import { acceptOwnerFeedback } from '../plugins/geo-expert/scripts/lib/owner-feedback.mjs';
import { serializeMarkdownObject } from '../plugins/geo-expert/scripts/lib/object-contract.mjs';
import {
  stableStringify,
  sha256,
} from '../plugins/geo-expert/scripts/lib/workspace-paths.mjs';

// Past timestamps below exercise only the post-change state contract. These
// fixtures are not real publication, platform observations, model outputs or business evidence.
let fixture;
const PUB = 'PUB-POST-CONTRACT',
  RUN = 'RUN-POST-CONTRACT',
  DAY = 86400000;
async function overwrite(root, object) {
  await writeFile(
    path.join(root, object.path),
    serializeMarkdownObject(object.data, object.content),
  );
}
async function buildFixture() {
  const root = await createRealSamplingWorkspace();
  let { plan, cycle } = await realContext(root);
  const technicalAt = new Date(Date.now() - 35 * DAY).toISOString(),
    publicationAt = new Date(Date.parse(technicalAt) - 3600000).toISOString();
  const approval = {
    approved_by: 'Isolated contract reviewer',
    approved_at: publicationAt,
    decision_ref: plan.authorization.ref,
  };
  await putObject(root, 'findings', {
    ...realObject(
      'FND-POST-CONTRACT',
      'finding',
      'open',
      'Contract-only observation',
      publicationAt,
    ),
    finding_code: 'GEO_CONTENT_GAP',
    finding_kind: 'semantic',
    item_state: 'inferred',
    rule_version: 'state-test-v1',
  });
  await putObject(root, 'assets/proposals', {
    ...realObject(
      'PRP-POST-CONTRACT',
      'asset_proposal',
      'draft',
      'Contract-only proposal',
      publicationAt,
    ),
    asset_ref: plan.asset_refs[0],
    goal_refs: [plan.goal_ref],
    query_refs: ['Q-M6-TEST-001'],
    finding_refs: ['FND-POST-CONTRACT'],
    knowledge_release_versions: [
      { ref: plan.knowledge.release_ref, version: '1.0.0' },
    ],
    claim_versions: [{ ref: 'CLM-M6-TEST-001', version: '1.0.0' }],
    evidence_refs: ['EVD-M6-TEST-001'],
    body_sha256: sha256('state contract'),
    recommendation_items: [
      {
        item_id: 'REC-POST-CONTRACT',
        section: 'Contract',
        action: 'Contract only',
        claim_refs: ['CLM-M6-TEST-001'],
        evidence_refs: ['EVD-M6-TEST-001'],
        finding_refs: ['FND-POST-CONTRACT'],
        risk: {
          level: 'low',
          type: 'none',
          reason: 'Contract only',
          suggested_weakening: 'No business assertion',
        },
      },
    ],
  });
  await putObject(root, 'assets/adoptions', {
    ...realObject(
      'ADR-POST-CONTRACT',
      'adoption_record',
      'decided',
      'Contract-only adoption',
      publicationAt,
    ),
    proposal_ref: 'PRP-POST-CONTRACT',
    asset_ref: plan.asset_refs[0],
    decisions: [
      {
        item_id: 'REC-POST-CONTRACT',
        decision: 'accepted',
        reason: 'State contract only',
      },
    ],
    approval,
  });
  await putObject(root, 'assets/publications', {
    ...realObject(
      PUB,
      'asset_publication',
      'confirmed',
      'Contract-only publication',
      publicationAt,
    ),
    proposal_ref: 'PRP-POST-CONTRACT',
    adoption_ref: 'ADR-POST-CONTRACT',
    asset_ref: plan.asset_refs[0],
    published_item_ids: ['REC-POST-CONTRACT'],
    published_locator: 'https://www.myyshop.com/about',
    published_at: publicationAt,
    content_sha256: sha256('state contract'),
    approval,
  });
  await createRun({
    workspace: root,
    runId: RUN,
    skill: 'geo-site',
    skillVersion: '1.0.0',
    inputVersions: { [PUB]: '1.0.0' },
    now: technicalAt,
  });
  await transitionRun({
    workspace: root,
    runId: RUN,
    status: 'running',
    now: technicalAt,
  });
  await transitionRun({
    workspace: root,
    runId: RUN,
    status: 'completed',
    now: technicalAt,
    businessResult: 'pass',
    patch: { publication_refs: [PUB], completed_steps: ['technical_retest'] },
  });
  await putJson(root, `runs/${RUN}/outputs/technical-readback.json`, {
    publication_ref: PUB,
    run_ref: RUN,
    captured_at: technicalAt,
    completed_at: technicalAt,
    content_present: true,
    all_checks_passed: true,
    checks: [],
  });
  cycle.data.goal_tracks[0].publication_refs = [PUB];
  cycle.data.goal_tracks[0].technical_retest_run_refs = [RUN];
  cycle.data.goal_tracks[0].stage = 'technical_retest_completed';
  cycle.data.aggregate_stage = 'technical_retest_completed';
  await overwrite(root, cycle);
  await putJson(
    root,
    `${plan.cycle_dir}/schedule.json`,
    buildObservationSchedule({
      cycleRef: cycle.data.id,
      publicationAt,
      technicalAt,
    }),
  );
  for (const slot of await formalSlots(root, 'post_change_retest')) {
    const origin = {
      chatgpt: 'https://chatgpt.com',
      gemini: 'https://gemini.google.com',
      perplexity: 'https://www.perplexity.ai',
      google_ai: 'https://www.google.com',
      claude: 'https://claude.ai',
    }[slot.platform];
    await receiveFormalAnswer(root, {
      ...slot,
      slot_id: slot.id,
      synthetic: false,
      captured_at: new Date(
        Date.parse(slot.window.starts_at) + 3600000,
      ).toISOString(),
      result_url: `${origin}/contract-test/${slot.window.id}/${slot.ordinal}`,
      conversation_id: `contract-${slot.window.id}-${slot.platform}-${slot.ordinal}`,
      outcome: 'no_result',
      answer_text: '',
      citations: [],
      browser_conditions: { conversation_state: 'new', model_mode: 'unknown' },
    });
  }
  for (const result of await reviewRealSamples(root, 'post_change_retest')) {
    const bytes = await readFile(
        path.join(root, result.package.replace(/\.md$/, '.json')),
        'utf8',
      ),
      pack = JSON.parse(bytes);
    const feedback = await acceptOwnerFeedback({
      workspace: root,
      text: `包：${pack.id}\n校验：${sha256(bytes)}\n决定：approve\n决定人：Isolated contract reviewer\n时间：${new Date().toISOString()}\n说明：State contract only, no business approval.\n`,
    });
    await approveRealAnswers(root, feedback);
  }
  await aggregateRealSamples(root, 'post_change_retest');
  return root;
}
test.before(async () => {
  fixture = await buildFixture();
});
test.after(async () => {
  if (fixture) await rm(fixture, { recursive: true, force: true });
});
async function clone(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-post-gate-'));
  await cp(fixture, root, { recursive: true });
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}
async function inputs(root) {
  const { plan, cycle, graph } = await realContext(root),
    slots = await formalSlots(root, 'post_change_retest');
  const matrixPath = `${plan.cycle_dir}/matrix-post-contract.json`,
    schedulePath = `${plan.cycle_dir}/schedule.json`;
  const matrix = {
    schema_version: 'geo-real-sampling-matrix-v1',
    cycle_ref: cycle.data.id,
    slots,
  };
  await writeFile(path.join(root, matrixPath), stableStringify(matrix, 2));
  const artifacts = await Promise.all(
    [matrixPath, schedulePath].map(async (p) => ({
      source_path: p,
      source_sha256: sha256(await readFile(path.join(root, p))),
    })),
  );
  const ids = new Set(slots.map((s) => s.sample_ref));
  const objects = graph.objects
    .filter(
      (o) =>
        ids.has(o.data.id) ||
        (o.data.record_type === 'answer_review' &&
          o.data.status === 'reviewed' &&
          ids.has(o.data.sample_ref)) ||
        (o.data.record_type === 'answer_aggregation' &&
          o.data.purpose === 'post_change_retest'),
    )
    .map((o) => o.data);
  return {
    slots,
    objects,
    snapshot: { cycle_ref: cycle.data.id, artifact_entries: artifacts },
    plan,
    graph,
  };
}
async function gate(root, input) {
  const x = input ?? (await inputs(root));
  return assertRealSamplingGate(
    root,
    x.snapshot,
    'answer_retest_completed',
    x.objects,
  );
}

test('four completed real-code-path weeks require all 40 independent observations', async (t) => {
  const root = await clone(t),
    x = await inputs(root);
  assert.equal(x.slots.length, 40);
  assert.equal(
    x.objects.filter((o) => o.record_type === 'answer_aggregation').length,
    20,
  );
  await gate(root, x);
  const missing = x.slots
    .filter((s) => s.window.id === 'W4')
    .map((s) => s.sample_ref);
  await assert.rejects(
    gate(root, {
      ...x,
      objects: x.objects.filter((o) => !missing.includes(o.id)),
    }),
    { code: 'CYCLE_GATE_REQUIRED' },
  );
});
test('a three-week schedule cannot shrink the required post-change matrix', async (t) => {
  const root = await clone(t),
    { plan } = await realContext(root),
    file = `${plan.cycle_dir}/schedule.json`,
    schedule = await jsonAt(root, file);
  schedule.windows.pop();
  await writeFile(path.join(root, file), stableStringify(schedule, 2));
  await assert.rejects(async () => {
    const x = await inputs(root);
    x.objects = x.objects.filter((o) => !o.id.includes('-W4-'));
    await gate(root, x);
  });
});
test('post-change gate rejects completion before the actual fourth week ends', async (t) => {
  const root = await clone(t),
    { plan, cycle, graph } = await realContext(root);
  const technicalAt = new Date(Date.now() - 27 * DAY).toISOString(),
    publicationAt = new Date(Date.parse(technicalAt) - 3600000).toISOString();
  const schedule = buildObservationSchedule({
    cycleRef: cycle.data.id,
    publicationAt,
    technicalAt,
  });
  await writeFile(
    path.join(root, `${plan.cycle_dir}/schedule.json`),
    stableStringify(schedule, 2),
  );
  const pub = graph.byId.get(PUB),
    run = graph.byId.get(RUN);
  pub.data.published_at = publicationAt;
  run.data.updated_at = technicalAt;
  await overwrite(root, pub);
  await overwrite(root, run);
  const reportPath = `runs/${RUN}/outputs/technical-readback.json`,
    report = await jsonAt(root, reportPath);
  report.completed_at = technicalAt;
  report.captured_at = technicalAt;
  await writeFile(path.join(root, reportPath), stableStringify(report, 2));
  await assert.rejects(gate(root), { code: 'OBSERVATION_WINDOW_PENDING' });
});
test('each observation retains its confirmed publication and technical-retest lineage', async (t) => {
  const root = await clone(t),
    x = await inputs(root);
  for (const field of ['publication_refs', 'technical_retest_run_refs']) {
    const altered = structuredClone(x.objects);
    altered.find((o) => o.record_type === 'answer_sample')[field] = [];
    await assert.rejects(gate(root, { ...x, objects: altered }), {
      code: 'CYCLE_GATE_REQUIRED',
    });
  }
});

for (const kind of ['publication', 'technical'])
  test(`sample time cannot precede the actual ${kind} completion`, async (t) => {
    const root = await clone(t),
      x = await inputs(root),
      first = x.objects.find((o) => o.record_type === 'answer_sample'),
      later = new Date(Date.parse(first.captured_at) + DAY).toISOString();
    const object = x.graph.byId.get(kind === 'publication' ? PUB : RUN);
    if (kind === 'publication') object.data.published_at = later;
    else {
      object.data.updated_at = later;
      const file = `runs/${RUN}/outputs/technical-readback.json`,
        report = await jsonAt(root, file);
      report.completed_at = later;
      await writeFile(path.join(root, file), stableStringify(report, 2));
    }
    await overwrite(root, object);
    await assert.rejects(gate(root));
  });

for (const mode of ['reviews', 'samples'])
  test(`post-change aggregate cannot borrow another week ${mode} pair`, async (t) => {
    const root = await clone(t),
      x = await inputs(root);
    const objects = structuredClone(x.objects),
      aggs = objects.filter(
        (o) =>
          o.record_type === 'answer_aggregation' && o.platform === 'chatgpt',
      );
    const key =
      mode === 'reviews'
        ? 'answer_review_versions'
        : 'selected_sample_versions';
    [aggs[0][key], aggs[1][key]] = [aggs[1][key], aggs[0][key]];
    await assert.rejects(gate(root, { ...x, objects }));
  });

test('schedule anchor metadata is immutable even when its windows and matrix remain unchanged', async (t) => {
  const root = await clone(t),
    { plan } = await realContext(root),
    file = `${plan.cycle_dir}/schedule.json`,
    schedule = await jsonAt(root, file);
  schedule.technical_retest_at = new Date(
    Date.parse(schedule.technical_retest_at) + 60000,
  ).toISOString();
  await writeFile(path.join(root, file), stableStringify(schedule, 2));
  await assert.rejects(gate(root));
});
