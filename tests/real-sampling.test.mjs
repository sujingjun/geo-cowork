import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {
  assertFormalCapture,
  assertFormalCitations,
  assertFormalExtraction,
} from '../plugins/geo-expert/scripts/lib/real-sampling.mjs';
import { assertRealCapturePrivacy } from '../plugins/geo-expert/scripts/lib/answer-sample.mjs';
import {
  claimRealWorkspaceSubmission,
  prepareEngineeringCapture,
  bindEngineeringContext,
  claimEngineeringSubmission,
  recordEngineeringCapture,
  readEngineeringCaptureRun,
  withCaptureLock,
} from '../plugins/geo-expert/scripts/lib/capture-run.mjs';
import { collectPlaywright } from '../plugins/geo-expert/scripts/lib/playwright-collector.mjs';

const slot = {
  id: 'SLOT-REAL-BASE-CHATGPT-1',
  sample_ref: 'SMP-REAL-BASE-CHATGPT-1',
  run_ref: 'RUN-REAL-BASE-CHATGPT-1',
  cycle_ref: 'CYC-REAL-001',
  knowledge_base_ref: 'KBASE-REAL-001',
  query_ref: 'Q-REAL-001',
  query_version: '1.0.0',
  query_set_ref: 'QS-REAL-001',
  query_set_version: '1.0.0',
  query_text: 'What is MyyShop?',
  profile_ref: 'CPF-REAL-001',
  profile_version: '1.0.0',
  platform: 'chatgpt',
  ordinal: 1,
  purpose: 'baseline',
  window: {
    id: 'BASE',
    starts_at: '2026-08-20T00:00:00Z',
    ends_at: '2026-08-27T00:00:00Z',
  },
  collection_method: 'browser_automation',
  authorization: {
    ref: 'workspace://execution/authorization.json',
    sha256: 'a'.repeat(64),
    expires_at: '2027-01-01T00:00:00Z',
  },
};
const capture = () => ({
  ...slot,
  slot_id: slot.id,
  synthetic: false,
  captured_at: '2026-08-21T00:00:01Z',
  result_url: 'https://chatgpt.com/c/one',
  conversation_id: 'one',
  outcome: 'no_result',
  answer_text: '',
  citations: [],
  browser_conditions: { conversation_state: 'new', model_mode: 'unknown' },
});
async function temp(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'geo-real-sampling-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test('formal binding rejects changed slot/query/window/method and permits observed nonanswers only', () => {
  assert.equal(assertFormalCapture(slot, capture()), true);
  for (const patch of [
    { slot_id: 'OTHER' },
    { query_text: 'Another question' },
    { run_ref: 'RUN-OTHER' },
    { window: { ...slot.window, starts_at: '2026-08-19T00:00:00Z' } },
    { collection_method: 'manual' },
    { outcome: 'system_failure' },
    { citations: undefined },
    { browser_conditions: { conversation_state: 'existing' } },
  ])
    assert.throws(() => assertFormalCapture(slot, { ...capture(), ...patch }));
  for (const outcome of ['timeout', 'challenge', 'no_result'])
    assert.equal(assertFormalCapture(slot, { ...capture(), outcome }), true);
  assert.throws(
    () => assertFormalCapture(slot, { ...capture(), outcome: 'refusal' }),
    { code: 'RAW_ANSWER_REQUIRED' },
  );
  assert.equal(
    assertFormalCapture(slot, {
      ...capture(),
      outcome: 'refusal',
      answer_text: 'I cannot answer this question.',
    }),
    true,
  );
  const cit = {
    occurrence_ordinal: 1,
    url: 'https://myyshop.com/about',
    title: 'MyyShop',
    context: 'Source',
  };
  assert.equal(
    assertFormalCapture(slot, { ...capture(), citations: [cit] }),
    true,
  );
  assert.throws(() =>
    assertFormalCapture(slot, {
      ...capture(),
      citations: [{ ...cit, occurrence_ordinal: 2 }],
    }),
  );
  assert.throws(
    () => assertFormalCapture(slot, capture(), [{ ...capture(), ordinal: 2 }]),
    { code: 'SAMPLE_NOT_INDEPENDENT' },
  );
});

test('privacy checks every capture field before any raw write, while bounded authorization references remain valid', () => {
  assert.doesNotThrow(() => assertRealCapturePrivacy(capture()));
  for (const patch of [
    { browser_conditions: { account_email: 'person@example.com' } },
    { citations: [{ url: 'https://site.com', context: 'Cookie: secret' }] },
    { answer_html: '<div>full page</div>' },
    { note: 'person@example.com' },
  ])
    assert.throws(() => assertRealCapturePrivacy({ ...capture(), ...patch }), {
      code: 'PRIVACY_SCOPE_VIOLATION',
    });
});

test('workspace rate limit serializes independent concurrent slots and survives restart', async (t) => {
  const root = await temp(t),
    now = new Date('2026-08-21T00:00:00Z');
  const results = await Promise.allSettled([
    claimRealWorkspaceSubmission(root, 'SLOT-A', now),
    claimRealWorkspaceSubmission(root, 'SLOT-B', now),
  ]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(results.filter((r) => r.status === 'rejected').length, 1);
  await assert.rejects(
    claimRealWorkspaceSubmission(
      root,
      'SLOT-C',
      new Date(now.getTime() + 119999),
    ),
    { code: 'COLLECTION_RATE_LIMIT' },
  );
  await claimRealWorkspaceSubmission(
    root,
    'SLOT-C',
    new Date(now.getTime() + 120000),
  );
  await writeFile(
    path.join(root, 'execution/real-capture-rate.lock'),
    JSON.stringify({ pid: 2147483647 }),
  );
  await claimRealWorkspaceSubmission(
    root,
    'SLOT-D',
    new Date(now.getTime() + 240000),
  );
});

test('formal MCP only binds the authorized platform and never resubmits an uncertain attempt', async (t) => {
  const root = await temp(t);
  await prepareEngineeringCapture(root, slot.query_text, slot);
  await assert.rejects(claimEngineeringSubmission(root, 'gemini'), {
    code: 'FORMAL_SLOT_MISMATCH',
  });
  await bindEngineeringContext(root, 'chatgpt', 'context-one');
  await claimEngineeringSubmission(
    root,
    'chatgpt',
    new Date('2026-08-21T00:00:00Z'),
  );
  await assert.rejects(claimEngineeringSubmission(root, 'chatgpt'), {
    code: 'SUBMISSION_UNKNOWN',
  });
  await assert.rejects(
    recordEngineeringCapture(root, 'chatgpt', {
      ...capture(),
      context_token: 'wrong',
    }),
    { code: 'RESULT_BINDING_CHANGED' },
  );
  await assert.rejects(
    recordEngineeringCapture(root, 'chatgpt', {
      ...capture(),
      context_token: 'context-one',
      captured_at: 'invalid',
    }),
    { code: 'CAPTURE_INVALID' },
  );
  await recordEngineeringCapture(root, 'chatgpt', {
    ...capture(),
    context_token: 'context-one',
  });
  assert.equal(
    (await readEngineeringCaptureRun(root)).platforms.chatgpt.status,
    'captured',
  );
  // Reading a persisted capture does not start the browser or invoke any model.
  const resumed = await collectPlaywright({
    outputDir: root,
    platform: 'chatgpt',
    query: slot.query_text,
    formalPlan: slot,
    extract: false,
    resume: true,
  });
  assert.equal(resumed.status, 'captured');
  await assert.rejects(
    collectPlaywright({
      outputDir: root,
      platform: 'gemini',
      query: slot.query_text,
      formalPlan: slot,
      extract: false,
    }),
    { code: 'FORMAL_SLOT_MISMATCH' },
  );
});

test('a live process lease is never stolen', async (t) => {
  const root = await temp(t);
  await mkdir(path.join(root, 'execution'));
  await withCaptureLock(root, async () => {
    await assert.rejects(
      withCaptureLock(root, async () => assert.fail('stolen')),
      { code: 'CAPTURE_RUN_BUSY' },
    );
  });
});

test('formal citation gate rejects missing or altered canonical occurrences and source bindings', () => {
  const sample = { id: 'SMP-REAL-ONE', raw_manifest_sha256: 'a'.repeat(64) };
  const raw = {
    citations: [
      {
        occurrence_ordinal: 1,
        url: 'https://www.myyshop.com/about',
        title: 'MyyShop',
        context: 'Original citation context',
      },
    ],
  };
  const citation = {
    id: 'CIT-REAL-ONE-1',
    record_type: 'citation_observation',
    status: 'observed',
    sample_ref: sample.id,
    sample_raw_manifest_sha256: sample.raw_manifest_sha256,
    occurrence_index: 1,
    url_raw: raw.citations[0].url,
    url_normalized: raw.citations[0].url,
    citation_domain: 'myyshop.com',
    source_ref: 'SRC-REAL-ONE',
    anchor_or_context: raw.citations[0].context,
  };
  const graph = {
    objects: [{ data: citation }],
    byId: new Map([
      [
        'SRC-REAL-ONE',
        { data: { record_type: 'source', locator: raw.citations[0].url } },
      ],
    ]),
  };
  assert.equal(assertFormalCitations(graph, sample, raw), true);
  assert.throws(
    () => assertFormalCitations({ ...graph, objects: [] }, sample, raw),
    { code: 'CITATION_SOURCE_PAIR_INCOMPLETE' },
  );
  assert.throws(
    () => assertFormalCitations({ ...graph, byId: new Map() }, sample, raw),
    { code: 'CITATION_SOURCE_PAIR_INCOMPLETE' },
  );
  assert.throws(
    () =>
      assertFormalCitations(graph, sample, {
        citations: [{ ...raw.citations[0], context: 'Changed' }],
      }),
    { code: 'CITATION_SOURCE_PAIR_INCOMPLETE' },
  );
});

test('cached extraction cannot claim a Fake provider or omit real audit provenance', async () => {
  await assert.rejects(
    assertFormalExtraction(
      '/unused',
      slot,
      { ...capture(), answer_text: 'Answer' },
      {
        audit: {
          status: 'completed',
          extraction_validation: 'passed',
          provider: 'fake',
        },
      },
      { provider: 'deepseek' },
    ),
    { code: 'EXTRACTION_AUDIT_INVALID' },
  );
});
